import BladesItem from "../../BladesItem";
import {BladesActorType, BladesItemType, ClockColor, Factor} from "../../core/constants";
import U from "../../core/utilities";
import BladesActor from "../../BladesActor";
import BladesRoll from "../../BladesRoll";

class BladesClock extends BladesItem implements BladesItemSubClass.Clock,
  BladesRoll.OppositionDocData {

  get value() { return this.system.value; }

  get max() { return this.system.max; }

  get color() { return this.system.color as ClockColor|""|undefined; }


  override get rollFactors(): Partial<Record<Factor, BladesRoll.FactorData>> {

    const factorData: Partial<Record<Factor, BladesRoll.FactorData>> = {};
    [
      Factor.tier,
      Factor.quality
    ].forEach((factor, i) => {
      const factorTotal = this.getFactorTotal(factor);
      factorData[factor] = {
        name: factor,
        value: factorTotal,
        max: factorTotal,
        baseVal: factorTotal,
        display: factor === Factor.tier ? U.romanizeNum(factorTotal) : `${factorTotal}`,
        isActive: i === 0,
        isPrimary: i === 0,
        isDominant: false,
        highFavorsPC: true,
        cssClasses: `factor-gold${i === 0 ? " factor-main" : ""}`
      };
    });
    return factorData;
  }

  override getFactorTotal(factor: Factor): number {
    switch (factor) {
      case Factor.tier: return this.system.tier.value;
      case Factor.quality: return this.getFactorTotal(Factor.tier);
      // no default
    }
    return 0;
  }

  override get rollOppImg() { return ""; }

  // #region OVERRIDES: _onUpdate
  override async _onUpdate(...args: Parameters<typeof BladesItem.prototype.callOnUpdate>) {
    await super.callOnUpdate(...args);
    BladesActor.GetTypeWithTags(BladesActorType.pc).forEach((actor) => actor.render());
  }
  // #endregion
}

declare interface BladesClock {
  type: BladesItemType.clock,
  system: BladesItemSchema.Clock
}

export default BladesClock;
