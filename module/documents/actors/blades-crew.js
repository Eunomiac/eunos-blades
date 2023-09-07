/* ****▌███████████████████████████████████████████████████████████████████████████▐**** *\
|*     ▌████░░░░░░░░░░░ Euno's Blades in the Dark for Foundry VTT ░░░░░░░░░░░░░████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░ by Eunomiac ░░░░░░░░░░░░░██████████████████▐     *|
|*     ▌████████████████████████████  License █ v0.1.0 ████████████████████████████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░░░░░░  ░░░░░░░░░░░░░░░░░░███████████████████▐     *|
\* ****▌███████████████████████████████████████████████████████████████████████████▐**** */

import { BladesActorType, BladesItemType } from "../../core/constants.js";
import BladesActor from "../../blades-actor.js";
import MIX, { PlayableCharacterMixin } from "../../core/mixins.js";
class BladesCrew extends MIX(BladesActor).with(PlayableCharacterMixin) {

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
    get members() {
        if (!BladesActor.IsType(this, BladesActorType.crew)) {
            return [];
        }
        const self = this;
        return BladesActor.GetTypeWithTags(BladesActorType.pc).filter((actor) => actor.isMember(self));
    }
    get contacts() {
        if (!BladesActor.IsType(this, BladesActorType.crew) || !this.playbook) {
            return [];
        }
        const self = this;
        return this.activeSubActors.filter((actor) => actor.hasTag(self.playbookName));
    }
    get claims() {
        if (!BladesActor.IsType(this, BladesActorType.crew) || !this.playbook) {
            return {};
        }
        return this.playbook.system.turfs;
    }
    get turfCount() {
        if (!BladesActor.IsType(this, BladesActorType.crew) || !this.playbook) {
            return 0;
        }
        return Object.values(this.playbook.system.turfs)
            .filter((claim) => claim.isTurf && claim.value).length;
    }
    get upgrades() {
        if (!BladesActor.IsType(this, BladesActorType.crew) || !this.playbook) {
            return [];
        }
        return this.activeSubItems.filter((item) => item.type === BladesItemType.crew_upgrade);
    }
    get cohorts() {
        return this.activeSubItems.filter((item) => [BladesItemType.cohort_gang, BladesItemType.cohort_expert].includes(item.type));
    }
    getTaggedItemBonuses(tags) {
        return 0;
    }
}
export default BladesCrew;