import BladesItem from "../../BladesItem.js";
import { Factor } from "../../core/constants.js";
import U from "../../core/utilities.js";
class BladesLocation extends BladesItem {
    get rollFactors() {
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
    getFactorTotal(factor) {
        switch (factor) {
            case Factor.tier: return this.system.tier.value;
            case Factor.quality: return this.getFactorTotal(Factor.tier);
            case Factor.scale: return this.system.scale;
            // no default
        }
        return 0;
    }
    get rollOppImg() { return this.img ?? ""; }
}
export default BladesLocation;
