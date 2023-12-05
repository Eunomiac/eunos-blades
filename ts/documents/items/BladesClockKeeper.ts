import {SVGDATA, BladesActorType, BladesItemType} from "../../core/constants";
import U from "../../core/utilities";
import BladesActor from "../../BladesActor";
import {BladesItem} from "../BladesItemProxy";
import BladesClock, {BladesClockKey} from "./BladesClock";
import type {PropertiesToSource} from "@league-of-foundry-developers/foundry-vtt-types/src/types/helperTypes";
import type {ItemDataBaseProperties} from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/itemData";
import type {DocumentModificationOptions} from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/abstract/document.mjs";

class BladesClockKeeper extends BladesItem implements BladesItemSubClass.Clock_Keeper {

  // #region CLOCKS OVERLAY
  _overlayElement?: HTMLElement;

  get overlayElement() {
    this._overlayElement ??= $("#clocks-overlay")[0];
    if (!this._overlayElement) {
      $("body.vtt.game.system-eunos-blades").append("<section id=\"clocks-overlay\"></section>");
      [this._overlayElement] = $("#clocks-overlay");
    }
    return this._overlayElement;
  }

  async renderOverlay() {
    if (!game.scenes?.current) { return; }
    if (!game.eunoblades.ClockKeeper) { return; }
    if (!game.eunoblades.ClockKeeper.overlayElement) {
      eLog.error("clocksOverlay", "[ClocksOverlay] Cannot locate overlay element.");
      return;
    }
    game.eunoblades.ClockKeeper.overlayElement.innerHTML = (await getTemplate("systems/eunos-blades/templates/overlays/clock-overlay.hbs"))({
      ...game.eunoblades.ClockKeeper.system,
      currentScene: game.scenes?.current.id,
      svgData: SVGDATA
    });
    game.eunoblades.ClockKeeper.activateOverlayListeners();
  }

  async activateOverlayListeners() {
    if (!game?.user?.isGM) { return; }
    BladesClock.ApplyClockListeners($("#clocks-overlay"));
    $("#clocks-overlay").find(".key-label").on({
      click: async (event) => {
        if (!event.currentTarget) { return; }
        if (!BladesItem.IsType(game.eunoblades.ClockKeeper, BladesItemType.clock_keeper)) { return; }

        event.preventDefault();

        const clockKey = this.getClockKey($(event.currentTarget).data("keyId"));
        if (clockKey) {
          await clockKey.toggleActive();
        }
      },
      contextmenu: () => {
        if (!game.user.isGM) { return; }
        game.eunoblades.ClockKeeper?.sheet?.render(true);
      }
    });
  }

  get currentSceneID(): IDString {
    if (!game.scenes?.current) {
      throw new Error("[BladesClockKeeper.currentScene] Error retrieving 'game.scenes.current'.");
    }
    return game.scenes.current.id;
  }

  get targetSceneID(): IDString | null { return this.system.targetScene; }

  _clocksData: {
    keys: Record<IDString, BladesClockKey>,
    clocks: Record<IDString, BladesClock>
  } = {keys: {}, clocks: {}};

  getClockKey(keyID: IDString): BladesClockKey|undefined {
    if (!this._clocksData.keys[keyID]) {
      if (!this.system.clocksData.keys?.[keyID]) { return undefined; }
      this._clocksData.keys[keyID] = new BladesClockKey(
        this.system.clocksData.keys[keyID] as BladesClockKeySystemData
      );
    }
    return this._clocksData.keys[keyID];
  }

  async addClockKey(): Promise<BladesClockKey|undefined> {
    if (!BladesItem.IsType(game.eunoblades.ClockKeeper, BladesItemType.clock_keeper)) { return undefined; }
    if (!this.targetSceneID) { return undefined; }
    const clockKey = await BladesClockKey.Create({
      id: randomID(),
      target: this,
      targetKey: "system.clocksData.keys"
    });
    const sceneClockIDs = this.system.scenes?.[this.targetSceneID]?.clockIDs ?? [];
    sceneClockIDs.push(clockKey.id);
    await this.update({[`system.scenes.${this.targetSceneID}.clockIDs`]: sceneClockIDs});
    this._clocksData.keys[clockKey.id] = clockKey;
    return clockKey;
  }

  async deleteClockKey(keyID: string): Promise<void> {
    if (!BladesItem.IsType(game.eunoblades.ClockKeeper, BladesItemType.clock_keeper)) { return undefined; }
    await this.getClockKey(keyID)?.delete();
  }

  async setKeySize(keyID: string, keySize = 1): Promise<void> {
    keySize = U.pInt(keySize);
    if (keySize < 1 || keySize > 6) {
      throw new Error("[BladesClockKey.setKeySize] Key sizes must be between 1 and 6.");
    }
    this.getClockKey(keyID)?.setKeySize(keySize as 1|2|3|4|5|6);
  }
  // #endregion

  // #region OVERRIDES: prepareDerivedData, _onUpdate
  override prepareDerivedData() {
    super.prepareDerivedData();
    this.system.targetScene ??= game.scenes.current?.id || null;
  }

  override async _onUpdate(
    changed: DeepPartial<PropertiesToSource<ItemDataBaseProperties>>,
    options: DocumentModificationOptions,
    userId: string
  ) {
    super._onUpdate(changed, options, userId);
    BladesActor.GetTypeWithTags(BladesActorType.pc).forEach((actor) => actor.render());
    socketlib.system.executeForEveryone("renderOverlay");
  }
  // #endregion

}

declare interface BladesClockKeeper {
  type: BladesItemType.clock_keeper,
  system: BladesItemSchema.Clock_Keeper
}

export default BladesClockKeeper;
