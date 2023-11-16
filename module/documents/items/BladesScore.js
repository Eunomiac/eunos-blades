import BladesItem from "../../BladesItem.js";
import { BladesActorType, BladesItemType, Factor } from "../../core/constants.js";
import U from "../../core/utilities.js";
import BladesActor from "../../BladesActor.js";
import BladesScoreSheet from "../../sheets/item/BladesScoreSheet.js";
/*~ @@DOUBLE-BLANK@@ ~*/
class BladesScore extends BladesItem {
    /*~ @@DOUBLE-BLANK@@ ~*/
    // #region INITIALIZATION ~
    static async Initialize() {
        game.eunoblades ??= {};
        Object.assign(globalThis, { BladesScore, BladesScoreSheet });
        Items.registerSheet("blades", BladesScoreSheet, { types: ["score"], makeDefault: true });
        return loadTemplates(["systems/eunos-blades/templates/items/score-sheet.hbs"]);
    }
    // #endregion
    /*~ @@DOUBLE-BLANK@@ ~*/
    static get Active() {
        return BladesItem.GetTypeWithTags(BladesItemType.score).find((score) => score.system.isActive);
    }
    static set Active(val) {
        BladesItem.GetTypeWithTags(BladesItemType.score)
            .find((score) => score.system.isActive)?.update({ "system.isActive": false })
            .then(() => {
            if (val) {
                val.update({ "system.isActive": true });
            }
        });
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    // #region BladesRoll.OppositionDocData Implementation
    get rollFactors() {
        /*~ @@DOUBLE-BLANK@@ ~*/
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
    get rollOppImg() { return this.img ?? ""; }
    getFactorTotal(factor) {
        switch (factor) {
            case Factor.tier: return this.system.tier.value;
            case Factor.quality: return this.getFactorTotal(Factor.tier);
            case Factor.scale: return 0;
            case Factor.magnitude: return 0;
            default: return 0;
        }
    }
    // #endregion
    /*~ @@DOUBLE-BLANK@@ ~*/
    // #region OVERRIDES: _onUpdate
    async _onUpdate(changed, options, userId) {
        super._onUpdate(changed, options, userId);
        BladesActor.GetTypeWithTags(BladesActorType.pc).forEach((actor) => actor.render());
    }
}
/*~ @@DOUBLE-BLANK@@ ~*/
export default BladesScore;
