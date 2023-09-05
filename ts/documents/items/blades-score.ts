import BladesItem from "../../blades-item.js";
import C, {SVGDATA, BladesActorType, BladesItemType, Tag, BladesPhase, RollModCategory, PrereqType, Factor, RollModStatus} from "../../core/constants.js";
import U from "../../core/utilities.js";
import BladesActor from "../../blades-actor.js";
import BladesRollCollab from "../../blades-roll-collab.js";
import {ItemDataConstructorData} from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/itemData.js";

class BladesScore extends BladesItem implements BladesItemSubClass.Score,
                                                  BladesRollCollab.OppositionDocData {

  override get rollFactors(): Partial<Record<Factor,BladesRollCollab.FactorData>> {

    const tierTotal = this.getFactorTotal(Factor.tier);
    return {
      [Factor.tier]: {
        name: "Tier",
        value: tierTotal,
        max: tierTotal,
        baseVal: tierTotal,
        display: U.romanizeNum(tierTotal),
        isActive: true,
        isPrimary: true,
        isDominant: false,
        highFavorsPC: true,
        cssClasses: "factor-gold factor-main"
      }
    };
  }
  override get rollOppImg() { return this.img ?? undefined }
  override getFactorTotal(factor: Factor): number {
    switch (factor) {
      case Factor.tier: return this.system.tier.value;
      case Factor.quality: return this.getFactorTotal(Factor.tier);
      case Factor.scale: return 0;
      case Factor.magnitude: return 0;
      // no default
    }
    return 0 as never;
  }

  // #region OVERRIDES: _onUpdate
  override async _onUpdate(changed: any, options: any, userId: string) {
    await super._onUpdate(changed, options, userId);
    BladesActor.GetTypeWithTags(BladesActorType.pc).forEach((actor) => actor.render());
  }
  // #endregion

}

declare interface BladesScore {
  type: BladesItemType.score,
  system: BladesItemSchema.Score
}

export default BladesScore;