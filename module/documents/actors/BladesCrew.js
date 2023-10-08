/* ****▌███████████████████████████████████████████████████████████████████████████▐**** *\
|*     ▌█░░░░░░░░░ Euno's Blades in the Dark for Foundry VTT ░░░░░░░░░░░█▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░ by Eunomiac ░░░░░░░░░░░░░██████████████████▐     *|
|*     ▌█  License █ v0.1.0 ██▐     *|
|*     ▌████░░░░  ░░░░█████▐     *|
\* ****▌███████████████████████████████████████████████████████████████████████████▐**** */

import { BladesItemType, Factor } from "../../core/constants.js";
import BladesActor from "../../BladesActor.js";
import { BladesRollMod } from "../../BladesRollCollab.js";
class BladesCrew extends BladesActor {

    static async create(data, options = {}) {
        data.token = data.token || {};
        data.system = data.system ?? {};
        eLog.checkLog2("actor", "BladesActor.create(data,options)", { data, options });

        data.token.actorLink = true;

        data.system.world_name = data.system.world_name ?? data.name.replace(/[^A-Za-z_0-9 ]/g, "").trim().replace(/ /g, "_");

        data.system.experience = {
            playbook: { value: 0, max: 8 },
            clues: [],
            ...data.system.experience ?? {}
        };
        return super.create(data, options);
    }
    get rollModsData() {
        return BladesRollMod.ParseDocRollMods(this);
    }
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
    get rollPrimaryID() { return this.id; }
    get rollPrimaryDoc() { return this; }
    get rollPrimaryName() { return this.name; }
    get rollPrimaryType() { return this.type; }
    get rollPrimaryImg() { return this.img; }

    get rollParticipantID() { return this.id; }
    get rollParticipantDoc() { return this; }
    get rollParticipantIcon() { return this.playbook?.img ?? this.img; }
    get rollParticipantName() { return this.name; }
    get rollParticipantType() { return this.type; }
    get rollParticipantModsData() { return []; }
    
    get abilities() {
        if (!this.playbook) {
            return [];
        }
        return this.activeSubItems.filter((item) => [BladesItemType.ability, BladesItemType.crew_ability].includes(item.type));
    }
    get playbookName() {
        return this.playbook?.name;
    }
    get playbook() {
        return this.activeSubItems.find((item) => item.type === BladesItemType.crew_playbook);
    }
}
export default BladesCrew;