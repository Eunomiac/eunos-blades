import {BladesActorType} from "../../core/constants";
import {BladesActor} from "../BladesActorProxy";
import {BladesClockKey} from "../../classes/BladesClock";

class BladesFaction extends BladesActor implements BladesActorSubClass.Faction,
                                                   BladesRoll.OppositionDocData {


  // #region BladesRoll Implementation

  // #region BladesRoll.OppositionDoc Implementation
  get rollOppID() { return this.id; }

  get rollOppDoc() { return this; }

  get rollOppImg() { return this.img ?? ""; }

  get rollOppName() { return this.name ?? ""; }

  get rollOppSubName() { return this.system.subtitle || this.system.concept || " "; }

  get rollOppType() { return this.type; }

  get rollOppModsData(): BladesRoll.RollModData[] { return []; }
  // #endregion

  // #endregion

  // _clocks: Collection<BladesClock> = new Collection();

  // get clocks(): Collection<BladesClock> = {
  //   return new Collection()
  // }


  get clocks(): Collection<BladesClockKey> {
    return new Collection(
      Object.entries(this.system.clocksData.keys ?? {})
        .map(([id, data]) => [
          id,
          game.eunoblades.ClockKeys.get(id) ?? new BladesClockKey(data)
        ])
    );
  }

  async addClock(): Promise<BladesClockKey> {
    return await BladesClockKey.Create({
      target: this,
      targetKey: "system.clocksData.keys"
    });
  }

  async deleteClock(clockKeyID: IDString) {
    await game.eunoblades.ClockKeys.get(clockKeyID)?.delete();
  }
}

declare interface BladesFaction {
  type: BladesActorType.faction,
  system: BladesActorSchema.Faction
}

export default BladesFaction;
