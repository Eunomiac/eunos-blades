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

  _clocks: Record<IDString, BladesClock> = {};
  getClocks(isRefreshing = false): Record<IDString, BladesClock> {
    const clockIDs = Object.keys(this.system.clocks);
    if (clockIDs.length === 0) { return {}; }
    for (const clockID of clockIDs) {
      if (isRefreshing || !(clockID in this._clocks)) {
        this._clocks[clockID] = new BladesClock(this.system.clocks[clockID]);
      }
    }
    return this._clocks;
  }

  getClock(clockID: IDString): BladesClock|undefined {
    return this.getClocks()[clockID];
  }

  async addClock(): Promise<BladesClock> {
    const numClocks = Object.values(this.getClocks()).length;

    return await BladesClock.Create({
      id: randomID(),
      target: this,
      targetKey: "system.clocks",
      index: numClocks
    });
  }

  async deleteClock(clockID: IDString) {
    await this.getClock(clockID)?.delete();
    delete this._clocks[clockID];
  }
}

declare interface BladesFaction {
  type: BladesActorType.faction,
  system: BladesActorSchema.Faction
}

export default BladesFaction;
