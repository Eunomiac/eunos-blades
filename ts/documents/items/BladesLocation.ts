/* eslint-disable @typescript-eslint/no-unused-vars */
import BladesItem from "../../BladesItem";
import {BladesActorType, BladesItemType, Factor} from "../../core/constants";
import U from "../../core/utilities";
import BladesActor from "../../BladesActor";
import BladesRoll from "../../classes/BladesRoll";

class BladesLocation extends BladesItem implements BladesItemSubClass.Location,
                                                    BladesRoll.OppositionDocData {


  override get rollFactors(): Partial<Record<Factor, BladesRoll.FactorData>> {

    const factorData: Partial<Record<Factor, BladesRoll.FactorData>> = {};
    [
      Factor.tier,
      Factor.quality,
      Factor.scale
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
      case Factor.scale: return this.system.scale;
      // no default
    }
    return 0;
  }

  override get rollOppImg() { return this.img ?? ""; }

  // #region OVERRIDES: _onUpdate
  // override async _onUpdate(changed: any, options: any, userId: string) {
  //   await super._onUpdate(changed, options, userId);
  //   BladesActor.GetTypeWithTags(BladesActorType.pc).forEach((actor) => actor.render());
  // }
  // #endregion
}

declare interface BladesLocation {
  type: BladesItemType.location,
  system: BladesItemSchema.Location
}

export default BladesLocation;
