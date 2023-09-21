import BladesItem from "../../blades-item.js";
import C, {SVGDATA, BladesActorType, BladesItemType, Tag, BladesPhase, RollModCategory, PrereqType, Factor, RollModStatus} from "../../core/constants.js";
import U from "../../core/utilities.js";
import BladesActor from "../../blades-actor.js";
import BladesRollCollab from "../../blades-roll-collab.js";
import BladesScoreSheet from "../../sheets/item/blades-score-sheet.js";


class BladesScore extends BladesItem implements BladesItemSubClass.Score,
  BladesRollCollab.OppositionDocData {

  // #region INITIALIZATION ~
  static async Initialize() {
    game.eunoblades ??= {};
    Object.assign(globalThis, {BladesScore, BladesScoreSheet});
    Items.registerSheet("blades", BladesScoreSheet, {types: ["score"], makeDefault: true});
    return loadTemplates(["systems/eunos-blades/templates/items/score-sheet.hbs"]);
  }
  // #endregion

  static get Active(): BladesItemOfType<BladesItemType.score>|undefined {
    return BladesItem.GetTypeWithTags(BladesItemType.score).find((score) => score.system.isActive);
  }
  static set Active(val: BladesItemOfType<BladesItemType.score>|undefined) {
    BladesItem.GetTypeWithTags(BladesItemType.score)
      .find((score) => score.system.isActive)?.update({"system.isActive": false})
      .then(() => {
        if (val) {
          val.update({"system.isActive": true});
        }
      });
  }

  // #region BladesRollCollab.OppositionDocData Implementation
  override get rollFactors(): Partial<Record<Factor, BladesRollCollab.FactorData>> {

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
  override get rollOppImg() { return this.img ?? "" }
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
  // #endregion

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