/* eslint-disable @typescript-eslint/no-unused-vars */
import U from "../../core/utilities";
import {SVGDATA, BladesActorType, BladesItemType} from "../../core/constants";
// import U from "../../core/utilities";
import BladesActor from "../../BladesActor";
import {BladesItem} from "../BladesItemProxy";
import BladesClockKey from "../../classes/BladesClockKey";
import type {PropertiesToSource} from "@league-of-foundry-developers/foundry-vtt-types/src/types/helperTypes";
import type {ItemDataBaseProperties} from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/itemData";
import type {DocumentModificationOptions} from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/abstract/document.mjs";

class BladesClockKeeper extends BladesItem implements BladesItemSubClass.Clock_Keeper {

  public static async Initialize() {
    const clockKeeper: BladesClockKeeper|undefined = game.items.find((item): item is BladesClockKeeper => item.type === "clock_keeper");
    if (!clockKeeper) {
      game.eunoblades.ClockKeeper = (await BladesClockKeeper.create({
        name: "Clock Keeper",
        type: "clock_keeper",
        img: "systems/eunos-blades/assets/icons/misc-icons/clock-keeper.svg"
      })) as BladesClockKeeper;
    } else {
      game.eunoblades.ClockKeeper = clockKeeper;
    }

    return loadTemplates([
      "systems/eunos-blades/templates/parts/clock-sheet-key-controls.hbs",
      "systems/eunos-blades/templates/parts/clock-sheet-clock-controls.hbs"
    ]);
  }

  public showClockKeyControls(keyID: IDString) {
    if (this.sheet?.element) {
      // Find the key controls row, flip it over to controls row.
    }
  }

  public hideClockKeyControls(keyID: IDString) {
    if (this.sheet?.element) {
      // Find the key controls row, flip it back to minimal summary
    }
  }

  // #region CLOCKS OVERLAY
  get clockKeys() { return this.getSceneKeys(); }

  get currentScene(): string|undefined { return game.scenes?.current?.id; }

  get currentSceneID(): IDString {
    if (!game.scenes?.current) {
      throw new Error("[BladesClockKeeper.currentScene] Error retrieving 'game.scenes.current'.");
    }
    return game.scenes.current.id as IDString;
  }

  get targetSceneID(): IDString { return this.system.targetScene ?? this.currentSceneID; }

  get keys(): Collection<BladesClockKey> {
    return new Collection(
      Object.entries(this.system.clocksData ?? {})
        .map(([id, data]) => [
          id,
          game.eunoblades.ClockKeys.get(id) ?? new BladesClockKey(data)
        ])
    );
  }

  getSceneKeys(sceneID?: IDString): Collection<BladesClockKey> {
    sceneID ??= this.targetSceneID;

    return new Collection(Array.from(game.eunoblades.ClockKeys)
      .filter((clockKey) => clockKey.sceneIDs.includes(sceneID as IDString))
      .map((clockKey) => [clockKey.id, clockKey]));
  }

  async addClockKey(
    clockKeyConfig: Partial<BladesClockKey.Data> = {}
  ): Promise<BladesClockKey|undefined> {
    if (!clockKeyConfig.sceneIDs?.length) {
      clockKeyConfig.sceneIDs = [this.targetSceneID];
    }
    const key = await BladesClockKey.Create({
      target: this,
      targetKey: "system.clocksData" as TargetKey,
      ...clockKeyConfig
    });
    // super.update({});
    return key;
  }

  async deleteClockKey(keyID: string): Promise<void> {
    await game.eunoblades.ClockKeys.get(keyID)?.delete(game.eunoblades.ClockKeys);
  }

  async addClockToKey(keyID: IDString, clockData?: Partial<BladesClock.Data>): Promise<void> {
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
    this.system.targetScene ??= game.scenes.current?.id as IDString || null;
  }

  // #endregion

}

declare interface BladesClockKeeper {
  type: BladesItemType.clock_keeper,
  system: BladesItemSchema.Clock_Keeper
}

export default BladesClockKeeper;
