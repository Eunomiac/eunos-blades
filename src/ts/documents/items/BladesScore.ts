import BladesItem from "../../BladesItem";
import {BladesActorType, BladesItemType, Factor} from "../../core/constants";
import U from "../../core/utilities";
import BladesActor from "../../BladesActor";
import BladesRoll from "../../classes/BladesRoll";
import BladesScoreSheet from "../../sheets/item/BladesScoreSheet";

import type {PropertiesToSource} from "@league-of-foundry-developers/foundry-vtt-types/src/types/helperTypes";
import type {ItemDataBaseProperties} from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/itemData";
import type {DocumentModificationOptions} from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/abstract/document.mjs";


class BladesScore extends BladesItem implements BladesItemSubClass.Score,
  BladesRoll.OppositionData {

  // #region INITIALIZATION ~
  static async Initialize() {
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

  // #region BladesRoll.OppositionData Implementation
  override get rollFactors(): Partial<Record<Factor, BladesRoll.FactorData>> {

    const tierTotal = this.getFactorTotal(Factor.tier);
    return {
      [Factor.tier]: {
        name:         "Tier",
        value:        tierTotal,
        max:          tierTotal,
        baseVal:      tierTotal,
        display:      U.romanizeNum(tierTotal),
        isActive:     true,
        isPrimary:    true,
        isDominant:   false,
        highFavorsPC: true,
        cssClasses:   "factor-gold factor-main"
      }
    };
  }
  override get rollOppImg() { return this.img ?? ""; }
  override getFactorTotal(factor: Factor): number {
    switch (factor) {
      case Factor.tier: return this.system.tier.value;
      case Factor.quality: return this.getFactorTotal(Factor.tier);
      case Factor.scale: return 0;
      case Factor.magnitude: return 0;
      default: return 0 as never;
    }
  }
  // #endregion

  // #region OVERRIDES: _onUpdate
  override async _onUpdate(
    changed: DeepPartial<PropertiesToSource<ItemDataBaseProperties>>,
    options: DocumentModificationOptions,
    userId: string
  ) {
    super._onUpdate(changed, options, userId);
    BladesActor.GetTypeWithTags(BladesActorType.pc).forEach((actor) => actor.render());
  }
  // #endregion

}

declare interface BladesScore {
  type: BladesItemType.score,
  system: BladesItemSchema.Score
}

export default BladesScore;
