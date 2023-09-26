/* ****▌███████████████████████████████████████████████████████████████████████████▐**** *\
|*     ▌████░░░░░░░░░░░ Euno's Blades in the Dark for Foundry VTT ░░░░░░░░░░░░░████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░ by Eunomiac ░░░░░░░░░░░░░██████████████████▐     *|
|*     ▌████████████████████████████  License █ v0.1.0 ████████████████████████████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░░░░░░  ░░░░░░░░░░░░░░░░░░███████████████████▐     *|
\* ****▌███████████████████████████████████████████████████████████████████████████▐**** */

import { BladesActorType, Factor } from "../../core/constants.js";
import BladesActor from "../../BladesActor.js";
class BladesNPC extends BladesActor {
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
        if (BladesActor.IsType(this, BladesActorType.npc)) {
            factorData[Factor.scale] = {
                name: Factor.scale,
                value: this.getFactorTotal(Factor.scale),
                max: this.getFactorTotal(Factor.scale),
                baseVal: this.getFactorTotal(Factor.scale),
                cssClasses: "factor-grey",
                isActive: false,
                isPrimary: false,
                isDominant: false,
                highFavorsPC: true
            };
            factorData[Factor.magnitude] = {
                name: Factor.magnitude,
                value: this.getFactorTotal(Factor.magnitude),
                max: this.getFactorTotal(Factor.magnitude),
                baseVal: this.getFactorTotal(Factor.magnitude),
                isActive: false,
                isPrimary: false,
                isDominant: false,
                highFavorsPC: true
            };
        }
        return factorData;
    }

    get rollOppID() { return this.id; }
    get rollOppDoc() { return this; }
    get rollOppImg() { return this.img ?? ""; }
    get rollOppName() { return this.name ?? ""; }
    get rollOppSubName() { return ""; }
    get rollOppType() { return this.type; }
    get rollOppModsData() { return []; }

    get rollParticipantID() { return this.id; }
    get rollParticipantDoc() { return this; }
    get rollParticipantIcon() { return this.img ?? ""; }
    get rollParticipantName() { return this.name ?? ""; }
    get rollParticipantType() { return this.type; }
    get rollParticipantModsData() { return []; }
}
export default BladesNPC;
//# sourceMappingURL=BladesNPC.js.map
//# sourceMappingURL=BladesNPC.js.map
