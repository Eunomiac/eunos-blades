/* ****▌███████████████████████████████████████████████████████████████████████████▐**** *\
|*     ▌████░░░░░░░░░░░ Euno's Blades in the Dark for Foundry VTT ░░░░░░░░░░░░░████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░ by Eunomiac ░░░░░░░░░░░░░██████████████████▐     *|
|*     ▌████████████████████████████  License █ v0.1.0 ████████████████████████████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░░░░░░  ░░░░░░░░░░░░░░░░░░███████████████████▐     *|
\* ****▌███████████████████████████████████████████████████████████████████████████▐**** */

import BladesItem from "../../blades-item.js";
import { BladesActorType, Factor } from "../../core/constants.js";
import U from "../../core/utilities.js";
import BladesActor from "../../blades-actor.js";
class BladesScore extends BladesItem {
    get rollFactors() {
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
    get rollOppImg() { return this.img ?? undefined; }
    getFactorTotal(factor) {
        switch (factor) {
            case Factor.tier: return this.system.tier.value;
            case Factor.quality: return this.getFactorTotal(Factor.tier);
            case Factor.scale: return 0;
            case Factor.magnitude: return 0;
        }
        return 0;
    }

    async _onUpdate(changed, options, userId) {
        await super._onUpdate(changed, options, userId);
        BladesActor.GetTypeWithTags(BladesActorType.pc).forEach((actor) => actor.render());
    }
}
export default BladesScore;