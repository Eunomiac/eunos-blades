import { BladesItemType } from "../../core/constants.js";
import BladesActor from "../../BladesActor.js";
class BladesCrew extends BladesActor {
    // #region Static Overrides: Create ~
    static async create(data, options = {}) {
        data.token = data.token || {};
        data.system = data.system ?? {};
        eLog.checkLog2("actor", "BladesActor.create(data,options)", { data, options });
        // ~ For Crew and PC set the Token to sync with charsheet.
        data.token.actorLink = true;
        // ~ Create world_name
        data.system.world_name = data.system.world_name ?? data.name.replace(/[^A-Za-z_0-9 ]/g, "").trim().replace(/ /g, "_");
        // ~ Initialize generic experience clues.
        data.system.experience = {
            playbook: { value: 0, max: 8 },
            clues: [],
            ...data.system.experience ?? {}
        };
        return super.create(data, options);
    }
    // #endregion
    // #region BladesRoll Implementation
    // #region BladesRoll.ParticipantDoc Implementation
    get rollParticipantID() { return this.id; }
    get rollParticipantDoc() { return this; }
    get rollParticipantIcon() { return this.playbook?.img ?? this.img; }
    get rollParticipantName() { return this.name; }
    get rollParticipantType() { return this.type; }
    get rollParticipantModsData() { return []; }
    async applyHarm(_amount, _name) {
        console.error("Attempt to apply harm directly to a Crew document.");
    }
    async applyWorsePosition() {
        console.error("Attempt to apply worse position directly to a Crew document.");
    }
    // #endregion
    // #endregion
    get abilities() {
        if (!this.playbook) {
            return [];
        }
        return this.activeSubItems
            .filter((item) => [BladesItemType.ability, BladesItemType.crew_ability].includes(item.type));
    }
    get playbookName() {
        return this.playbook?.name;
    }
    get playbook() {
        return this.activeSubItems
            .find((item) => item.type === BladesItemType.crew_playbook);
    }
}
export default BladesCrew;
