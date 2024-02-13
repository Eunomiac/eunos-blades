/* eslint-disable @typescript-eslint/no-unused-vars */
import { BladesActorType, BladesItemType, Tag } from "../../core/constants.js";
import { BladesActor, BladesPC } from "../BladesActorProxy.js";
import BladesCrewSheet from "../../sheets/actor/BladesCrewSheet.js";
import { BladesItem } from "../BladesItemProxy.js";
import { SelectionCategory } from "../../classes/BladesDialog.js";
class BladesCrew extends BladesActor {
    // #region INITIALIZATION ~
    static async Initialize() {
        Object.assign(globalThis, { BladesCrew, BladesCrewSheet });
        Actors.registerSheet("blades", BladesCrewSheet, { types: ["crew"], makeDefault: true });
        return loadTemplates(["systems/eunos-blades/templates/crew-sheet.hbs"]);
    }
    // #endregion
    // #region Static Overrides: Create ~
    // static override IsType<T extends BladesActorType = BladesActorType.crew>(doc: unknown): doc is BladesActorOfType<T> {
    //   return super.IsType(doc, BladesActorType.crew);
    // }
    static IsType(doc) {
        return super.IsType(doc, BladesActorType.crew);
    }
    static GetFromUser(userRef) {
        const actor = BladesPC.GetFromUser(userRef);
        if (!actor) {
            return undefined;
        }
        return actor.crew;
    }
    static GetFromPC(pcRef) {
        let actor;
        if (typeof pcRef === "string") {
            actor = game.actors.get(pcRef) ?? game.actors.getName(pcRef);
        }
        else if (pcRef instanceof BladesPC) {
            actor = pcRef;
        }
        else {
            actor ??= BladesPC.GetFromUser(pcRef);
        }
        if (!BladesPC.IsType(actor)) {
            throw new Error(`Unable to find BladesPC from "${pcRef}.js"`);
        }
        return actor.crew;
    }
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
    // #region BladesCrew Implementation
    getDialogItems(category) {
        const dialogData = {};
        const { playbookName } = this;
        if (category === SelectionCategory.Playbook) {
            dialogData.Main = this._processEmbeddedItemMatches(BladesItem.GetTypeWithTags(BladesItemType.crew_playbook));
        }
        else if (category === SelectionCategory.Reputation) {
            dialogData.Main = this._processEmbeddedItemMatches(BladesItem.GetTypeWithTags(BladesItemType.crew_reputation));
        }
        else if (category === SelectionCategory.Preferred_Op && playbookName !== null) {
            dialogData.Main = this._processEmbeddedItemMatches(BladesItem.GetTypeWithTags(BladesItemType.preferred_op, playbookName));
        }
        else if (category === SelectionCategory.Ability) {
            dialogData.Main = this._processEmbeddedItemMatches(BladesItem.GetTypeWithTags(BladesItemType.crew_ability, this.playbookName));
        }
        else if (category === SelectionCategory.Upgrade && playbookName !== null) {
            dialogData[playbookName] = this._processEmbeddedItemMatches(BladesItem.GetTypeWithTags(BladesItemType.crew_upgrade, playbookName));
            dialogData.General = this._processEmbeddedItemMatches(BladesItem.GetTypeWithTags(BladesItemType.crew_upgrade, Tag.Gear.General));
        }
        return dialogData;
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
        return this.activeSubItems
            .filter((item) => item.type === BladesItemType.crew_upgrade);
    }
    get cohorts() {
        return this.activeSubItems
            .filter((item) => [BladesItemType.cohort_gang, BladesItemType.cohort_expert].includes(item.type));
    }
    getTaggedItemBonuses(tags) {
        // Given a list of item tags, will return the total bonuses to that item
        // Won't return a number, but an object literal that includes things like extra load space or concealability
        // Check ACTIVE EFFECTS supplied by upgrade/ability against submitted tags?
        return tags.length; // Placeholder to avoid linter error
    }
    // #endregion
    // #region BladesRoll Implementation
    // #region BladesRoll.ParticipantDoc Implementation
    get rollParticipantID() { return this.id; }
    get rollParticipantDoc() { return this; }
    get rollParticipantIcon() { return this.playbook?.img ?? this.img; }
    get rollParticipantName() { return this.name; }
    get rollParticipantType() { return this.type; }
    get rollParticipantModsSchemaSet() { return []; }
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
