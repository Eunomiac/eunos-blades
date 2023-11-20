import { BladesItemType } from "../../core/constants.js";
import BladesActor from "../../BladesActor.js";
/*~ @@DOUBLE-BLANK@@ ~*/
class BladesCrew extends BladesActor {
    /*~ @@DOUBLE-BLANK@@ ~*/
    // #region Static Overrides: Create ~
    static async create(data, options = {}) {
        data.token = data.token || {};
        data.system = data.system ?? {};
        /*~ @@DOUBLE-BLANK@@ ~*/
        eLog.checkLog2("actor", "BladesActor.create(data,options)", { data, options });
        /*~ @@DOUBLE-BLANK@@ ~*/
        // ~ For Crew and PC set the Token to sync with charsheet.
        data.token.actorLink = true;
        /*~ @@DOUBLE-BLANK@@ ~*/
        // ~ Create world_name
        data.system.world_name = data.system.world_name ?? data.name.replace(/[^A-Za-z_0-9 ]/g, "").trim().replace(/ /g, "_");
        /*~ @@DOUBLE-BLANK@@ ~*/
        // ~ Initialize generic experience clues.
        data.system.experience = {
            playbook: { value: 0, max: 8 },
            clues: [],
            ...data.system.experience ?? {}
        };
        /*~ @@DOUBLE-BLANK@@ ~*/
        return super.create(data, options);
    }
    // #endregion
    /*~ @@DOUBLE-BLANK@@ ~*/
    // #region BladesRoll Implementation
    /*~ @@DOUBLE-BLANK@@ ~*/
    // #region BladesRoll.ParticipantDoc Implementation
    get rollParticipantID() { return this.id; }
    /*~ @@DOUBLE-BLANK@@ ~*/
    get rollParticipantDoc() { return this; }
    /*~ @@DOUBLE-BLANK@@ ~*/
    get rollParticipantIcon() { return this.playbook?.img ?? this.img; }
    /*~ @@DOUBLE-BLANK@@ ~*/
    get rollParticipantName() { return this.name; }
    /*~ @@DOUBLE-BLANK@@ ~*/
    get rollParticipantType() { return this.type; }
    /*~ @@DOUBLE-BLANK@@ ~*/
    get rollParticipantModsData() { return []; }
    /*~ @@DOUBLE-BLANK@@ ~*/
    async applyHarm(_amount, _name) {
        console.error("Attempt to apply harm directly to a Crew document.");
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    async applyWorsePosition() {
        console.error("Attempt to apply worse position directly to a Crew document.");
        /*~ @@DOUBLE-BLANK@@ ~*/
    }
    // #endregion
    /*~ @@DOUBLE-BLANK@@ ~*/
    // #endregion
    /*~ @@DOUBLE-BLANK@@ ~*/
    get abilities() {
        if (!this.playbook) {
            return [];
        }
        return this.activeSubItems
            .filter((item) => [BladesItemType.ability, BladesItemType.crew_ability].includes(item.type));
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    get playbookName() {
        return this.playbook?.name;
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    get playbook() {
        return this.activeSubItems
            .find((item) => item.type === BladesItemType.crew_playbook);
    }
}
/*~ @@DOUBLE-BLANK@@ ~*/
export default BladesCrew;
/*~ @@DOUBLE-BLANK@@ ~*/ 
