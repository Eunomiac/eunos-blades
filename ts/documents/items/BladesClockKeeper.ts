import BladesItem from "../../BladesItem.js";
import C, {SVGDATA, BladesActorType, BladesItemType} from "../../core/constants.js";
import U from "../../core/utilities.js";
import BladesActor from "../../BladesActor.js";
import type {PropertiesToSource} from "@league-of-foundry-developers/foundry-vtt-types/src/types/helperTypes.js";
import type {ItemDataBaseProperties} from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/itemData.js";
import type {DocumentModificationOptions} from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/abstract/document.mjs.js";

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
    if (!game.scenes?.current) { return }
    if (!game.eunoblades.ClockKeeper) { return }
    if (!game.eunoblades.ClockKeeper.overlayElement) {
      eLog.error("clocksOverlay", "[ClocksOverlay] Cannot locate overlay element.");
      return;
    }
    game.eunoblades.ClockKeeper.overlayElement.innerHTML = (await getTemplate("systems/eunos-blades/templates/overlays/clock-overlay.hbs"))({
      ...game.eunoblades.ClockKeeper.system,
      currentScene: game.scenes?.current.id,
      clockSizes: C.ClockSizes,
      svgData: SVGDATA
    });
    game.eunoblades.ClockKeeper.activateOverlayListeners();
  }
  async activateOverlayListeners() {
    if (!game?.user?.isGM) { return }
    $("#clocks-overlay").find(".clock-frame").on("wheel", async (event) => {
      if (!event.currentTarget) { return }
      if (!BladesItem.IsType(game.eunoblades.ClockKeeper, BladesItemType.clock_keeper)) { return }
      if (!(event.originalEvent instanceof WheelEvent)) { return }

      event.preventDefault();

      const clock$ = $(event.currentTarget).closest(".clock");
      const [key] = clock$.closest(".clock-key");

      if (!(key instanceof HTMLElement)) { return }

      const keyID = key.id;
      const clockNum = clock$.data("index");
      const curClockVal = U.pInt(clock$.data("value"));
      const delta = event.originalEvent.deltaY < 0 ? 1 : -1;
      const max = U.pInt(clock$.data("size"));

      const newClockVal = U.gsap.utils.clamp(0, max, curClockVal + delta);

      if (curClockVal === newClockVal) { return }

      await game.eunoblades.ClockKeeper.update({
        [`system.clock_keys.${keyID}.clocks.${clockNum}.value`]: `${newClockVal}`
      });
    });

    $("#clocks-overlay").find(".key-label").on({
      click: async (event) => {
        if (!event.currentTarget) { return }
        if (!BladesItem.IsType(game.eunoblades.ClockKeeper, BladesItemType.clock_keeper)) { return }

        event.preventDefault();

        const keyID = $(event.currentTarget).data("keyId") as string;
        eLog.checkLog3("clocksOverlay", "Updating Key isActive", {
          current: game.eunoblades.ClockKeeper.system.clock_keys[keyID]?.isActive,
          update: !(game.eunoblades.ClockKeeper.system.clock_keys[keyID]?.isActive)
        });
        await game.eunoblades.ClockKeeper.update({[`system.clock_keys.${keyID}.isActive`]: !(game.eunoblades.ClockKeeper.system.clock_keys[keyID]?.isActive)});

      },
      contextmenu: () => {
        if (!game.user.isGM) { return }
        game.eunoblades.ClockKeeper?.sheet?.render(true);
      }
    });
  }

  async addClockKey(): Promise<BladesItemOfType<BladesItemType.clock_keeper>|undefined> {
    if (!BladesItem.IsType(game.eunoblades.ClockKeeper, BladesItemType.clock_keeper)) { return undefined }
    const keyID = randomID();
    return game.eunoblades.ClockKeeper.update({[`system.clock_keys.${keyID}`]: {
      id: keyID,
      display: "",
      isVisible: false,
      isNameVisible: true,
      isActive: true,
      scene: game.eunoblades.ClockKeeper.system.targetScene,
      numClocks: 1,
      clocks: {
        1: {
          display: "",
          isVisible: false,
          isNameVisible: false,
          isActive: false,
          color: "yellow",
          max: 4,
          value: 0
        }
      }
    }});
  }

  async deleteClockKey(keyID: string): Promise<BladesItemOfType<BladesItemType.clock_keeper>|undefined> {
    if (!BladesItem.IsType(game.eunoblades.ClockKeeper, BladesItemType.clock_keeper)) { return undefined }
    return game.eunoblades.ClockKeeper.update({[`system.clock_keys.-=${keyID}`]: null});
  }

  async setKeySize(keyID: string, keySize = 1): Promise<BladesItemOfType<BladesItemType.clock_keeper>|undefined> {
    if (!BladesItem.IsType(game.eunoblades.ClockKeeper, BladesItemType.clock_keeper)) { return undefined }
    keySize = parseInt(`${keySize}`, 10);
    const updateData: Record<string, unknown> = {
      [`system.clock_keys.${keyID}.numClocks`]: keySize
    };
    const clockKey = game.eunoblades.ClockKeeper.system.clock_keys[keyID];
    if (!clockKey) { return game.eunoblades.ClockKeeper }
    const currentSize = Object.values(clockKey.clocks).length;
    if (currentSize < keySize) {
      for (let i = (currentSize + 1); i <= keySize; i++) {
        updateData[`system.clock_keys.${keyID}.clocks.${i}`] = {
          display: "",
          value: 0,
          max: 4,
          color: "yellow",
          isVisible: false,
          isNameVisible: true,
          isActive: false
        };
      }
    } else if (currentSize > keySize) {
      for (let i = (keySize + 1); i <= currentSize; i++) {
        updateData[`system.clock_keys.${keyID}.clocks.-=${i}`] = null;
      }
    }
    eLog.checkLog("clock_key", "Clock Key Update Data", {clockKey, updateData});
    return game.eunoblades.ClockKeeper.update(updateData);

  }
  // #endregion

  // #region OVERRIDES: prepareDerivedData, _onUpdate
  override prepareDerivedData() {
    super.prepareDerivedData();

    this.system.scenes = game.scenes.map((scene) => ({id: scene.id, name: scene.name ?? ""}));
    this.system.targetScene ??= game.scenes.current?.id || null;
    this.system.clock_keys = Object.fromEntries(Object.entries(this.system.clock_keys ?? {})
      .filter(([_, keyData]) => keyData?.id)
      .map(([keyID, keyData]) => {
        if (keyData === null) { return [keyID, null] }
        keyData.clocks = Object.fromEntries(Object.entries(keyData.clocks ?? {})
          .filter(([_, clockData]) => Boolean(clockData)));
        return [keyID, keyData];
      }));
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