import BladesItem from "../../BladesItem.js";
import { BladesActorType, Factor } from "../../core/constants.js";
import U from "../../core/utilities.js";
import BladesActor from "../../BladesActor.js";
class BladesClock extends BladesItem {
    get value() { return this.system.value; }
    get max() { return this.system.max; }
    get color() { return this.system.color; }
    get rollFactors() {
        const factorData = {};
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
    getFactorTotal(factor) {
        switch (factor) {
            case Factor.tier: return this.system.tier.value;
            case Factor.quality: return this.getFactorTotal(Factor.tier);
            // no default
        }
        return 0;
    }
    get rollOppImg() { return ""; }
    // #region OVERRIDES: _onUpdate
    async _onUpdate(...args) {
        await super.callOnUpdate(...args);
        BladesActor.GetTypeWithTags(BladesActorType.pc).forEach((actor) => actor.render());
    }
}
export default BladesClock;