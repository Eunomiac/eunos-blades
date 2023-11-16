import BladesItem from "../../BladesItem.js";
import { BladesActorType, Factor } from "../../core/constants.js";
import U from "../../core/utilities.js";
import BladesActor from "../../BladesActor.js";
/*~ @@DOUBLE-BLANK@@ ~*/
class BladesLocation extends BladesItem {
    /*~ @@DOUBLE-BLANK@@ ~*/
    get rollFactors() {
        /*~ @@DOUBLE-BLANK@@ ~*/
        const factorData = {};
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
    /*~ @@DOUBLE-BLANK@@ ~*/
    getFactorTotal(factor) {
        switch (factor) {
            case Factor.tier: return this.system.tier.value;
            case Factor.quality: return this.getFactorTotal(Factor.tier);
            case Factor.scale: return this.system.scale;
            // no default
        }
        return 0;
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    get rollOppImg() { return this.img ?? ""; }
    /*~ @@DOUBLE-BLANK@@ ~*/
    // #region OVERRIDES: _onUpdate
    async _onUpdate(changed, options, userId) {
        await super._onUpdate(changed, options, userId);
        BladesActor.GetTypeWithTags(BladesActorType.pc).forEach((actor) => actor.render());
    }
}
/*~ @@DOUBLE-BLANK@@ ~*/
export default BladesLocation;
