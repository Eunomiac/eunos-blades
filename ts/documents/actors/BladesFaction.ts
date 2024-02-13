import {BladesActorType} from "../../core/constants";
import {BladesActor} from "../BladesActorProxy";
import BladesFactionSheet from "../../sheets/actor/BladesFactionSheet";
import BladesClockKey from "../../classes/BladesClocks";

class BladesFaction extends BladesActor implements BladesActorSubClass.Faction,
                                                   BladesRoll.OppositionData {


  // #region INITIALIZATION ~
  static async Initialize() {
    Object.assign(globalThis, {BladesFaction, BladesFactionSheet});
    Actors.registerSheet("blades", BladesFactionSheet, {types: ["faction"], makeDefault: true});
    return loadTemplates(["systems/eunos-blades/templates/faction-sheet.hbs"]);
  }
  // #endregion

  static override get All(): Collection<BladesFaction> {
    return new Collection<BladesFaction>(
      (super.GetTypeWithTags(BladesActorType.faction) as BladesFaction[])
        .map((faction) => [faction.id, faction])
    );
  }

  static override IsType<T extends BladesActorType = BladesActorType.faction>(
    doc: unknown
  ): doc is BladesFaction & BladesActorOfType<T> {
    return super.IsType(doc, BladesActorType.faction);
  }

  // #region BladesRoll Implementation

  // #region BladesRoll.OppositionDoc Implementation
  get rollOppID() { return this.id; }

  get rollOppDoc() { return this; }

  get rollOppImg() { return this.img ?? ""; }

  get rollOppName() { return this.name ?? ""; }

  get rollOppSubName() { return this.system.subtitle || this.system.concept || " "; }

  get rollOppType() { return this.type; }

  get rollOppModsSchemaSet(): BladesRollMod.Schema[] { return []; }
  // #endregion

  // #endregion

  // _clocks: Collection<BladesClock> = new Collection();

  // get clocks(): Collection<BladesClock> = {
  //   return new Collection()
  // }


  get clocks(): Collection<BladesClockKey> {
    return new Collection(
      Object.entries(this.system.clocksData ?? {})
        .map(([id, data]) => [
          id,
          game.eunoblades.ClockKeys.get(id) ?? new BladesClockKey(data)
        ])
    );
  }

  async addClock(): Promise<BladesClockKey> {
    return await BladesClockKey.Create({
      target: this,
      targetKey: "system.clocksData" as TargetKey
    });
  }

  async deleteClock(clockKeyID: IDString) {
    await game.eunoblades.ClockKeys.get(clockKeyID)?.delete(game.eunoblades.ClockKeys);
  }
}

declare interface BladesFaction {
  type: BladesActorType.faction,
  system: BladesActorSchema.Faction
}

export default BladesFaction;
