import U from "../../core/utilities";
import {SVGDATA, BladesActorType, BladesItemType} from "../../core/constants";
// import U from "../../core/utilities";
import BladesActor from "../../BladesActor";
import {BladesItem} from "../BladesItemProxy";
import BladesClock, {BladesClockKey, ApplyClockListeners} from "./BladesClock";
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
    const {ClockKeeper: keeper} = game.eunoblades;
    if (!keeper) { return; }
    const {overlayElement} = keeper;
    eLog.checkLog3("clocksOverlay", "[ClocksOverlay] RenderOverlay", overlayElement);
    if (!overlayElement) {
      eLog.error("clocksOverlay", "[ClocksOverlay] Cannot locate overlay element.");
      return;
    }

    // Re-render the overlay element
    overlayElement.innerHTML = await renderTemplate(
      "systems/eunos-blades/templates/overlays/clock-overlay.hbs",
      keeper
    );

    // Reactivate event listeners
    keeper.activateOverlayListeners();
  }

  get clockKeys() { return this.getSceneKeys(); }

  get currentScene(): string|undefined { return game.scenes?.current?.id; }

  get svgData() { return SVGDATA; }

  async activateOverlayListeners() {
    if (!game?.user?.isGM) { return; }
    eLog.checkLog3("clocksOverlay", "[activateOverlayListeners] Keys", this.keys);
    ApplyClockListeners($("#clocks-overlay"), "ClocksOverlay");

    $("#clocks-overlay").find(".key-label").on({
      click: async (event) => {
        if (!event.currentTarget) { return; }
        if (!BladesItem.IsType(game.eunoblades.ClockKeeper, BladesItemType.clock_keeper)) { return; }

        event.preventDefault();

        const clockKey = game.eunoblades.ClockKeys.get($(event.currentTarget).data("keyId"));
        if (clockKey && clockKey.elem) {
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

  get targetSceneID(): IDString { return this.system.targetScene ?? this.currentSceneID; }

  get keys(): Collection<BladesClockKey> {
    return new Collection(
      Object.entries(this.system.clocksData.keys ?? {})
        .map(([id, data]) => [
          id,
          game.eunoblades.ClockKeys.get(id) ?? new BladesClockKey(data as BladesClockKeySystemData)
        ])
    );
  }

  get clocks(): Collection<BladesClock> {
    return new Collection(
      Object.entries(this.system.clocksData.clocks ?? {})
        .sort((a, b) => a[1].index - b[1].index)
        .map(([id, data]) => [
          id,
          game.eunoblades.Clocks.get(id) ?? new BladesClock(data)
        ])
    );
  }

  getSceneClocks(sceneID?: IDString): Collection<BladesClock> {
    sceneID ??= this.targetSceneID;

    return new Collection(this.clocks
      .filter((clock) => clock.sceneID === sceneID)
      .map((clock) => [clock.id, clock]));
  }

  getSceneKeys(sceneID?: IDString): Collection<BladesClockKey> {
    sceneID ??= this.targetSceneID;

    return new Collection(this.keys
      .filter((clockKey) => clockKey.sceneID === sceneID)
      .map((clockKey) => [clockKey.id, clockKey]));
  }

  addClockKey(
    clockKeyConfig: Partial<BladesClockKeySystemData> = {},
    clocksData: Partial<BladesClockSystemData> = {}
  ): Promise<BladesClockKey|undefined>|undefined {
    if (!(game.eunoblades.ClockKeeper instanceof BladesClockKeeper)) { return undefined; }
    if (!this.targetSceneID && !clockKeyConfig.sceneID) { return undefined; }
    return BladesClockKey.Create({
      sceneID: this.targetSceneID,
      target: this,
      targetKey: "system.clocksData.keys",
      ...clockKeyConfig
    }, clocksData);
  }

  async deleteClockKey(keyID: string): Promise<void> {
    await game.eunoblades.ClockKeys.get(keyID)?.delete();
  }

  async addClockToKey(keyID: IDString, clockData?: Partial<BladesClockData>): Promise<void> {
    const key = await game.eunoblades.ClockKeys.get(keyID);
    if (!key) { return; }
    await key.addClock(clockData);
  }

  async deleteClockFromKey(keyID: IDString, clockID: IDString): Promise<void> {
    const key = await game.eunoblades.ClockKeys.get(keyID);
    if (!key) { return; }
    await key.deleteClock(clockID);
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
    // BladesActor.GetTypeWithTags(BladesActorType.pc).forEach((actor) => actor.render());
    socketlib.system.executeForEveryone("renderOverlay");
  }
  // #endregion

}

declare interface BladesClockKeeper {
  type: BladesItemType.clock_keeper,
  system: BladesItemSchema.Clock_Keeper
}

export default BladesClockKeeper;
