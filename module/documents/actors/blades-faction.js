/* ****▌███████████████████████████████████████████████████████████████████████████▐**** *\
|*     ▌████░░░░░░░░░░░ Euno's Blades in the Dark for Foundry VTT ░░░░░░░░░░░░░████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░ by Eunomiac ░░░░░░░░░░░░░██████████████████▐     *|
|*     ▌████████████████████████████  License █ v0.1.0 ████████████████████████████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░░░░░░  ░░░░░░░░░░░░░░░░░░███████████████████▐     *|
\* ****▌███████████████████████████████████████████████████████████████████████████▐**** */

import { Factor } from "../../core/constants.js";
import BladesActor from "../../blades-actor.js";
class BladesFaction extends BladesActor {
    get rollFactors() {
        const factorData = {
            [Factor.tier]: {
                name: Factor.tier,
                value: this.getFactorTotal(Factor.tier),
                max: this.getFactorTotal(Factor.tier),
                baseVal: this.getFactorTotal(Factor.tier),
                isActive: true,
                isPrimary: true,
                isDominant: false,
                highFavorsPC: true
            },
            [Factor.quality]: {
                name: Factor.quality,
                value: this.getFactorTotal(Factor.quality),
                max: this.getFactorTotal(Factor.quality),
                baseVal: this.getFactorTotal(Factor.quality),
                isActive: false,
                isPrimary: false,
                isDominant: false,
                highFavorsPC: true
            }
        };
        return factorData;
    }

    get rollOppID() { return this.id; }
    get rollOppDoc() { return this; }
    get rollOppImg() { return this.img ?? ""; }
    get rollOppName() { return this.name ?? ""; }
    get rollOppSubName() { return ""; }
    get rollOppType() { return this.type; }
    get rollOppModsData() { return []; }
    
    async addClock(clockData = {}) {
        clockData.id ??= clockData.id ?? randomID();
        clockData.color ??= "white";
        clockData.display ??= "";
        clockData.isVisible ??= false;
        clockData.isNameVisible ??= false;
        clockData.isActive ??= false;
        clockData.max ??= 4;
        clockData.target ??= `system.clocks.${clockData.id}.value`;
        clockData.value ??= 0;
        return this.update({ [`system.clocks.${clockData.id}`]: clockData });
    }
    async deleteClock(clockID) {
        return this.update({ [`system.clocks.-=${clockID}`]: null });
    }
}
export default BladesFaction;
//# sourceMappingURL=blades-faction.js.map
//# sourceMappingURL=blades-faction.js.map
