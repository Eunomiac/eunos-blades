import {BladesActorType} from "../../core/constants";
import BladesActor from "../../BladesActor";

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

  async addClock(clockData: Partial<BladesItemSchema.Clock> = {}) {
    const clockID = randomID();
    clockData.color ??= "white";
    clockData.isVisible ??= false;
    clockData.isNameVisible ??= false;
    clockData.isActive ??= false;
    clockData.value ??= 0;
    clockData.max ??= 4;
    clockData.targetID = this.id;
    clockData.targetKey = `system.clocks.${clockID}.value`;

    return this.update({[`system.clocks.${clockID}`]: {id: clockID, ...clockData}});
  }

  async deleteClock(clockID: string) {
    return this.update({[`system.clocks.-=${clockID}`]: null});
  }
}

declare interface BladesFaction {
  type: BladesActorType.faction,
  system: BladesActorSchema.Faction
}

export default BladesFaction;
