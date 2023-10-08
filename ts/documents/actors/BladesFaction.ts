import {BladesActorType, Factor} from "../../core/constants";
import BladesActor from "../../BladesActor";

class BladesFaction extends BladesActor implements BladesActorSubClass.Faction,
                                                   BladesRollCollab.OppositionDocData {


  // #region BladesRollCollab Implementation

  get rollFactors(): Partial<Record<Factor, BladesRollCollab.FactorData>> {
    const factorData: Partial<Record<Factor, BladesRollCollab.FactorData>> = {
      [Factor.tier]: {
        name: Factor.tier,
        value: this.getFactorTotal(Factor.tier),
        max: this.getFactorTotal(Factor.tier),
        baseVal: this.getFactorTotal(Factor.tier),
        isActive: true,
        isPrimary: true,
        isDominant: false,
        highFavorsPC: true
      },
      [Factor.quality]: {
        name: Factor.quality,
        value: this.getFactorTotal(Factor.quality),
        max: this.getFactorTotal(Factor.quality),
        baseVal: this.getFactorTotal(Factor.quality),
        isActive: false,
        isPrimary: false,
        isDominant: false,
        highFavorsPC: true
      }
    };

    return factorData;
  }

  // #region BladesRollCollab.OppositionDoc Implementation
  get rollOppID() { return this.id; }

  get rollOppDoc() { return this; }

  get rollOppImg() { return this.img ?? ""; }

  get rollOppName() { return this.name ?? ""; }

  get rollOppSubName() { return this.system.subtitle || this.system.concept || " "; }

  get rollOppType() { return this.type; }

  get rollOppModsData(): BladesRollCollab.RollModData[] { return []; }
  // #endregion

  // #endregion

  async addClock(clockData: Partial<BladesClockData> = {}) {
    clockData.id ??= clockData.id ?? randomID();
    clockData.color ??= "white";
    clockData.display ??= "";
    clockData.isVisible ??= false;
    clockData.isNameVisible ??= false;
    clockData.isActive ??= false;
    clockData.max ??= 4;
    clockData.target ??= `system.clocks.${clockData.id}.value`;
    clockData.value ??= 0;

    return this.update({[`system.clocks.${clockData.id}`]: clockData});
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
