import { BladesItemType, Factor } from "../../core/constants.js";
import U from "../../core/utilities.js";
import { BladesItem } from "../BladesItemProxy.js";
import { BladesClockKey } from "./BladesClock.js";
class BladesProject extends BladesItem {
    static Initialize() {
        return loadTemplates([
            "systems/eunos-blades/templates/items/project-sheet.hbs"
        ]);
    }
    static IsType(doc) {
        return super.IsType(doc, BladesItemType.project);
    }
    _clockKey;
    get clockKey() {
        if (this._clockKey) {
            return this._clockKey;
        }
        const { keys } = this.system.clocksData ?? {};
        if (keys) {
            const keyData = Object.values(keys)[0];
            this._clockKey = new BladesClockKey(...[{
                    ...keyData,
                    target: this
                }]);
            return this._clockKey;
        }
        return undefined;
    }
    get currentClock() {
        return this.clockKey?.getCurrentClock();
    }
    get isComplete() {
        return this.clockKey?.isComplete;
    }
    get rollOppClock() { return this.clockKey?.getCurrentClock(); }
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
    async _onCreate(...args) {
        await super._onCreate(...args);
        await BladesClockKey.Create({
            id: randomID(),
            target: this,
            targetKey: "system.clocksData.keys"
        });
    }
}
export default BladesProject;
