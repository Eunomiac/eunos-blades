import {BladesActorType} from "../../core/constants";
import BladesActor from "../../BladesActor";
import BladesClock from "../items/BladesClock";

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


  get clocks(): Collection<BladesClock> {
    return new Collection(
      Object.entries(this.system.clocks ?? {})
        .sort((a, b) => a[1].index - b[1].index)
        .map(([id, data]) => [
          id,
          game.eunoblades.Clocks.get(id) ?? new BladesClock(data)
        ])
    );
  }

  async addClock(): Promise<BladesClock> {
    return await BladesClock.Create({
      target: this,
      targetKey: "system.clocks",
      index: this.clocks.size
    });
  }

  async deleteClock(clockID: IDString) {
    await game.eunoblades.Clocks.get(clockID)?.delete();
  }
}

declare interface BladesFaction {
  type: BladesActorType.faction,
  system: BladesActorSchema.Faction
}

export default BladesFaction;
