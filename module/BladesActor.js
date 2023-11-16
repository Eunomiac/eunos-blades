// #region Imports ~
import U from "./core/utilities.js";
import C, { BladesActorType, Tag, Playbook, BladesItemType, ActionTrait, PrereqType, AdvancementPoint, Randomizers, Factor } from "./core/constants.js";
import { BladesItem } from "./documents/BladesItemProxy.js";
/*~ @@DOUBLE-BLANK@@ ~*/
import { BladesRollMod } from "./BladesRoll.js";
import BladesPushAlert from "./BladesPushAlert.js";
import { SelectionCategory } from "./BladesDialog.js";
// #endregion
/*~ @@DOUBLE-BLANK@@ ~*/
// Blades Theme Song: "Bangkok" from The Gray Man soundtrack: https://www.youtube.com/watch?v=cjjImvMqYlo&list=OLAK5uy_k9cZDd1Fbpd25jfDtte5A6HyauD2-cwgk&index=2
// Also check out Discord thread: https://discord.com/channels/325094888133885952/1152316839163068527
/*~ @@DOUBLE-BLANK@@ ~*/
// eslint-disable-next-line no-shadow
var BladesActorUniqueTags;
(function (BladesActorUniqueTags) {
    BladesActorUniqueTags["CharacterCrew"] = "CharacterCrew";
    BladesActorUniqueTags["VicePurveyor"] = "VicePurveyor";
})(BladesActorUniqueTags || (BladesActorUniqueTags = {}));
// eslint-disable-next-line no-shadow
var BladesItemUniqueTypes;
(function (BladesItemUniqueTypes) {
    BladesItemUniqueTypes["background"] = "background";
    BladesItemUniqueTypes["vice"] = "vice";
    BladesItemUniqueTypes["crew_playbook"] = "crew_playbook";
    BladesItemUniqueTypes["crew_reputation"] = "crew_reputation";
    BladesItemUniqueTypes["heritage"] = "heritage";
    BladesItemUniqueTypes["playbook"] = "playbook";
    BladesItemUniqueTypes["preferred_op"] = "preferred_op";
})(BladesItemUniqueTypes || (BladesItemUniqueTypes = {}));
class BladesActor extends Actor {
    /*~ @@DOUBLE-BLANK@@ ~*/
    // #region Static Overrides: Create ~
    static async create(data, options = {}) {
        data.token = data.token || {};
        data.system = data.system ?? {};
        /*~ @@DOUBLE-BLANK@@ ~*/
        // ~ Create world_name
        data.system.world_name = data.system.world_name ?? data.name.replace(/[^A-Za-z_0-9 ]/g, "").trim().replace(/ /g, "_");
        /*~ @@DOUBLE-BLANK@@ ~*/
        return super.create(data, options);
    }
    // #endregion
    /*~ @@DOUBLE-BLANK@@ ~*/
    // #region BladesDocument Implementation ~
    static get All() { return game.actors; }
    /*~ @@DOUBLE-BLANK@@ ~*/
    static Get(actorRef) {
        if (actorRef instanceof BladesActor) {
            return actorRef;
        }
        if (U.isDocID(actorRef)) {
            return BladesActor.All.get(actorRef);
        }
        return BladesActor.All.find((a) => a.system.world_name === actorRef)
            || BladesActor.All.find((a) => a.name === actorRef);
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    static GetTypeWithTags(docType, ...tags) {
        return BladesActor.All.filter((actor) => actor.type === docType)
            .filter((actor) => actor.hasTag(...tags));
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    static IsType(doc, ...types) {
        const typeSet = new Set(types);
        return doc instanceof BladesActor && typeSet.has(doc.type);
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    get tags() { return this.system.tags ?? []; }
    /*~ @@DOUBLE-BLANK@@ ~*/
    hasTag(...tags) {
        return tags.every((tag) => this.tags.includes(tag));
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    async addTag(...tags) {
        const curTags = this.tags;
        tags.forEach((tag) => {
            if (curTags.includes(tag)) {
                return;
            }
            curTags.push(tag);
        });
        eLog.checkLog2("actor", "BladesActor.addTag(...tags)", { tags, curTags });
        await this.update({ "system.tags": curTags });
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    async remTag(...tags) {
        const curTags = this.tags.filter((tag) => !tags.includes(tag));
        eLog.checkLog2("actor", "BladesActor.remTag(...tags)", { tags, curTags });
        await this.update({ "system.tags": curTags });
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    get tooltip() {
        const tooltipText = [this.system.concept, this.system.subtitle]
            .filter(Boolean)
            .join("<br><br>");
        return tooltipText ? (new Handlebars.SafeString(tooltipText)).toString() : undefined;
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    get dialogCSSClasses() { return ""; }
    /*~ @@DOUBLE-BLANK@@ ~*/
    getFactorTotal(factor) {
        switch (factor) {
            case Factor.tier: {
                if (BladesActor.IsType(this, BladesActorType.pc)) {
                    return this.system.tier.value + (this.crew?.getFactorTotal(Factor.tier) ?? 0);
                }
                return this.system.tier.value;
            }
            case Factor.quality: return this.getFactorTotal(Factor.tier);
            case Factor.scale: {
                if (BladesActor.IsType(this, BladesActorType.npc)) {
                    return this.system.scale;
                }
                return 0;
            }
            case Factor.magnitude: {
                if (BladesActor.IsType(this, BladesActorType.npc)) {
                    return this.system.magnitude;
                }
                return 0;
            }
            default: return 0;
        }
    }
    // #endregion
    /*~ @@DOUBLE-BLANK@@ ~*/
    // #region SubActorControl Implementation ~
    /*~ @@DOUBLE-BLANK@@ ~*/
    get subActors() {
        return Object.keys(this.system.subactors)
            .map((id) => this.getSubActor(id))
            .filter((subActor) => Boolean(subActor));
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    get activeSubActors() {
        return this.subActors.filter((subActor) => !subActor.hasTag(Tag.System.Archived));
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    get archivedSubActors() {
        return this.subActors.filter((subActor) => subActor.hasTag(Tag.System.Archived));
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    checkActorPrereqs(actor) {
        /*~ @@DOUBLE-BLANK@@ ~*/
        /* Implement any prerequisite checks for embedding actors */
        /*~ @@DOUBLE-BLANK@@ ~*/
        return Boolean(actor);
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    processEmbeddedActorMatches(globalActors) {
        /*~ @@DOUBLE-BLANK@@ ~*/
        return globalActors
            // Step 1: Filter out globals that fail prereqs.
            .filter(this.checkActorPrereqs)
            // Step 2: Filter out actors that are already active subActors
            .filter((gActor) => !this.activeSubActors.some((aActor) => aActor.id === gActor.id))
            // Step 3: Merge subactor data onto matching global actors
            .map((gActor) => this.getSubActor(gActor) || gActor)
            // Step 4: Sort by name
            .sort((a, b) => {
            if (a.name === b.name) {
                return 0;
            }
            if (a.name === null) {
                return 1;
            }
            if (b.name === null) {
                return -1;
            }
            if (a.name > b.name) {
                return 1;
            }
            if (a.name < b.name) {
                return -1;
            }
            return 0;
        });
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    getDialogActors(category) {
        /*~ @@DOUBLE-BLANK@@ ~*/
        /* **** NEED TO FILTER OUT ACTORS PLAYER DOESN'T HAVE PERMISSION TO SEE **** */
        /*~ @@DOUBLE-BLANK@@ ~*/
        const dialogData = {};
        /*~ @@DOUBLE-BLANK@@ ~*/
        switch (category) {
            case SelectionCategory.Contact:
            case SelectionCategory.Rival:
            case SelectionCategory.Friend:
            case SelectionCategory.Acquaintance: {
                if (!BladesActor.IsType(this, BladesActorType.pc, BladesActorType.crew)
                    || this.playbookName === null) {
                    return false;
                }
                dialogData.Main = this.processEmbeddedActorMatches(BladesActor.GetTypeWithTags(BladesActorType.npc, this.playbookName));
                return dialogData;
            }
            case SelectionCategory.VicePurveyor: {
                if (!BladesActor.IsType(this, BladesActorType.pc) || !this.vice?.name) {
                    return false;
                }
                dialogData.Main = this.processEmbeddedActorMatches(BladesActor.GetTypeWithTags(BladesActorType.npc, this.vice.name));
                return dialogData;
            }
            case SelectionCategory.Crew: {
                dialogData.Main = BladesActor.GetTypeWithTags(BladesActorType.crew);
                return dialogData;
            }
            default: return false;
        }
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    async addSubActor(actorRef, tags) {
        /*~ @@DOUBLE-BLANK@@ ~*/
        let focusSubActor;
        // Does an embedded subActor of this Actor already exist on the character?
        if (this.hasSubActorOf(actorRef)) {
            const subActor = this.getSubActor(actorRef);
            if (!subActor) {
                return;
            }
            // Is it an archived Item?
            if (subActor.hasTag(Tag.System.Archived)) {
                // Unarchive it
                await subActor.remTag(Tag.System.Archived);
            }
            // Make it the focus item.
            focusSubActor = subActor;
        }
        else {
            // Is it not embedded at all? Create new entry in system.subactors from global actor
            const actor = BladesActor.Get(actorRef);
            if (!actor) {
                return;
            }
            const subActorData = {};
            if (tags) {
                subActorData.tags = U.unique([
                    ...actor.tags,
                    ...tags
                ]);
            }
            // Await the update, then make the retrieved subactor the focus
            await this.update({ [`system.subactors.${actor.id}`]: subActorData });
            focusSubActor = this.getSubActor(actor.id);
        }
        /*~ @@DOUBLE-BLANK@@ ~*/
        if (!focusSubActor) {
            return;
        }
        /*~ @@DOUBLE-BLANK@@ ~*/
        // Does this Actor contain any tags limiting it to one per actor?
        const uniqueTags = focusSubActor.tags.filter((tag) => tag in BladesActorUniqueTags);
        if (uniqueTags.length > 0) {
            // ... then archive all other versions.
            uniqueTags.forEach((uTag) => this.activeSubActors
                .filter((subActor) => Boolean(focusSubActor?.id
                && subActor.id !== focusSubActor.id
                && subActor.hasTag(uTag)))
                .map((subActor) => this.remSubActor(subActor.id)));
        }
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    getSubActor(actorRef) {
        const actor = BladesActor.Get(actorRef);
        if (!actor?.id) {
            return undefined;
        }
        if (!BladesActor.IsType(actor, BladesActorType.npc, BladesActorType.faction)) {
            return actor;
        }
        const subActorData = this.system.subactors[actor.id] ?? {};
        Object.assign(actor.system, mergeObject(actor.system, subActorData));
        actor.parentActor = this;
        return actor;
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    hasSubActorOf(actorRef) {
        const actor = BladesActor.Get(actorRef);
        if (!actor) {
            return false;
        }
        return actor?.id ? actor.id in this.system.subactors : false;
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    async updateSubActor(actorRef, upData) {
        const updateData = U.objExpand(upData);
        if (!updateData.system) {
            return undefined;
        }
        const actor = BladesActor.Get(actorRef);
        if (!actor) {
            return undefined;
        }
        /*~ @@DOUBLE-BLANK@@ ~*/
        // DiffObject new update data against actor data.
        const diffUpdateSystem = U.objDiff(actor.system, updateData.system);
        /*~ @@DOUBLE-BLANK@@ ~*/
        // Merge new update data onto current subactor data.
        const mergedSubActorSystem = U.objMerge(this.system.subactors[actor.id] ?? {}, diffUpdateSystem, { isReplacingArrays: true, isConcatenatingArrays: false });
        /*~ @@DOUBLE-BLANK@@ ~*/
        // Confirm this update changes data:
        if (JSON.stringify(this.system.subactors[actor.id]) === JSON.stringify(mergedSubActorSystem)) {
            return undefined;
        }
        // Update actor with new subactor data.
        return this.update({ [`system.subactors.${actor.id}`]: null }, undefined, true)
            .then(() => this.update({ [`system.subactors.${actor.id}`]: mergedSubActorSystem }, undefined, true))
            .then(() => actor.sheet?.render());
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    async remSubActor(actorRef) {
        const subActor = this.getSubActor(actorRef);
        if (!subActor) {
            return;
        }
        await this.update({ "system.subactors": mergeObject(this.system.subactors, { [`-=${subActor.id}`]: null }) }, undefined, true);
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    async clearSubActors(isReRendering = true) {
        this.subActors.forEach((subActor) => {
            if (subActor.parentActor?.id === this.id) {
                subActor.clearParentActor(isReRendering);
            }
        });
        await this.sheet?.render();
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    async clearParentActor(isReRendering = true) {
        const { parentActor } = this;
        if (!parentActor) {
            return;
        }
        this.parentActor = undefined;
        this.system = this._source.system;
        this.ownership = this._source.ownership;
        /*~ @@DOUBLE-BLANK@@ ~*/
        this.prepareData();
        if (isReRendering) {
            await this.sheet?.render();
        }
    }
    // #endregion
    // #region SubItemControl Implementation ~
    /*~ @@DOUBLE-BLANK@@ ~*/
    get subItems() { return Array.from(this.items); }
    /*~ @@DOUBLE-BLANK@@ ~*/
    get activeSubItems() { return this.items.filter((item) => !item.hasTag(Tag.System.Archived)); }
    /*~ @@DOUBLE-BLANK@@ ~*/
    get archivedSubItems() { return this.items.filter((item) => item.hasTag(Tag.System.Archived)); }
    /*~ @@DOUBLE-BLANK@@ ~*/
    _checkItemPrereqs(item) {
        if (!item.system.prereqs) {
            return true;
        }
        for (const [pType, pReqs] of Object.entries(item.system.prereqs)) {
            const pReqArray = Array.isArray(pReqs) ? pReqs : [pReqs.toString()];
            const hitRecord = {};
            if (!this._processPrereqArray(pReqArray, pType, hitRecord)) {
                return false;
            }
        }
        return true;
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    _processPrereqArray(pReqArray, pType, hitRecord) {
        while (pReqArray.length) {
            const pString = pReqArray.pop();
            hitRecord[pType] ??= [];
            if (!this._processPrereqType(pType, pString, hitRecord)) {
                return false;
            }
        }
        return true;
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    _processPrereqType(pType, pString, hitRecord) {
        switch (pType) {
            case PrereqType.HasActiveItem: {
                return this._processActiveItemPrereq(pString, hitRecord, pType);
            }
            case PrereqType.HasActiveItemsByTag: {
                return this._processActiveItemsByTagPrereq(pString, hitRecord, pType);
            }
            case PrereqType.AdvancedPlaybook: {
                return this._processAdvancedPlaybookPrereq();
            }
            default: return true;
        }
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    _processActiveItemPrereq(pString, hitRecord, pType) {
        const thisItem = this.activeSubItems
            .filter((i) => !hitRecord[pType]?.includes(i.id))
            .find((i) => i.system.world_name === pString);
        if (thisItem) {
            hitRecord[pType]?.push(thisItem.id);
            return true;
        }
        else {
            return false;
        }
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    _processActiveItemsByTagPrereq(pString, hitRecord, pType) {
        const thisItem = this.activeSubItems
            .filter((i) => !hitRecord[pType]?.includes(i.id))
            .find((i) => i.hasTag(pString));
        if (thisItem) {
            hitRecord[pType]?.push(thisItem.id);
            return true;
        }
        else {
            return false;
        }
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    _processAdvancedPlaybookPrereq() {
        if (!BladesActor.IsType(this, BladesActorType.pc)) {
            return false;
        }
        if (!this.playbookName || ![Playbook.Ghost, Playbook.Hull, Playbook.Vampire].includes(this.playbookName)) {
            return false;
        }
        return true;
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    _processEmbeddedItemMatches(globalItems) {
        /*~ @@DOUBLE-BLANK@@ ~*/
        return globalItems
            /*~ @@DOUBLE-BLANK@@ ~*/
            // Step 1: Filter out globals that fail prereqs.
            .filter((item) => this._checkItemPrereqs(item))
            /*~ @@DOUBLE-BLANK@@ ~*/
            // Step 2: Filter out already-active items based on max_per_score (unless MultiplesOk)
            .filter((gItem) => gItem.hasTag(Tag.System.MultiplesOK)
            || (gItem.system.max_per_score ?? 1)
                > this.activeSubItems.filter((sItem) => sItem.system.world_name === gItem.system.world_name).length)
            /*~ @@DOUBLE-BLANK@@ ~*/
            // Step 3: Replace with matching Archived, Embedded subItems
            .map((gItem) => {
            const matchingSubItems = this.archivedSubItems.filter((sItem) => sItem.system.world_name === gItem.system.world_name);
            if (matchingSubItems.length > 0) {
                return matchingSubItems;
            }
            else {
                return gItem;
            }
        })
            .flat()
            /*~ @@DOUBLE-BLANK@@ ~*/
            // Step 4: Apply CSS classes
            .map((sItem) => {
            sItem.dialogCSSClasses = "";
            const cssClasses = [];
            if (sItem.isEmbedded) {
                cssClasses.push("embedded");
            }
            if (sItem.hasTag(Tag.Gear.Fine)) {
                cssClasses.push("fine-quality");
            }
            if (sItem.hasTag(Tag.System.Featured)) {
                cssClasses.push("featured-item");
            }
            if ([BladesItemType.ability, BladesItemType.crew_ability].includes(sItem.type)) {
                if (this.getAvailableAdvancements("Ability") === 0) {
                    cssClasses.push("locked");
                }
                else if ((sItem.system.price ?? 1) > this.getAvailableAdvancements("Ability")) {
                    cssClasses.push("locked", "unaffordable");
                }
                else if ((sItem.system.price ?? 1) > 1) {
                    cssClasses.push("expensive");
                }
            }
            if ([BladesItemType.crew_upgrade].includes(sItem.type)) {
                if (this.getAvailableAdvancements("Upgrade") === 0) {
                    cssClasses.push("locked");
                }
                else if ((sItem.system.price ?? 1) > this.getAvailableAdvancements("Upgrade")) {
                    cssClasses.push("locked", "unaffordable");
                }
                else if ((sItem.system.price ?? 1) > 1) {
                    cssClasses.push("expensive");
                }
            }
            /*~ @@DOUBLE-BLANK@@ ~*/
            if (cssClasses.length > 0) {
                sItem.dialogCSSClasses = cssClasses.join(" ");
            }
            /*~ @@DOUBLE-BLANK@@ ~*/
            return sItem;
        })
            /*~ @@DOUBLE-BLANK@@ ~*/
            // Step 5: Sort by featured, then by fine, then by world_name, then embedded first sorted by name
            .sort((a, b) => {
            if (a.hasTag(Tag.System.Featured) && !b.hasTag(Tag.System.Featured)) {
                return -1;
            }
            if (!a.hasTag(Tag.System.Featured) && b.hasTag(Tag.System.Featured)) {
                return 1;
            }
            if (a.hasTag(Tag.Gear.Fine) && !b.hasTag(Tag.Gear.Fine)) {
                return -1;
            }
            if (!a.hasTag(Tag.Gear.Fine) && b.hasTag(Tag.Gear.Fine)) {
                return 1;
            }
            if (a.system.world_name > b.system.world_name) {
                return 1;
            }
            if (a.system.world_name < b.system.world_name) {
                return -1;
            }
            if (a.isEmbedded && !b.isEmbedded) {
                return -1;
            }
            if (!a.isEmbedded && b.isEmbedded) {
                return 1;
            }
            if (a.name === b.name) {
                return 0;
            }
            if (a.name === null) {
                return 1;
            }
            if (b.name === null) {
                return -1;
            }
            if (a.name > b.name) {
                return 1;
            }
            if (a.name < b.name) {
                return -1;
            }
            return 0;
        });
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    getDialogItems(category) {
        const dialogData = {};
        const isPC = BladesActor.IsType(this, BladesActorType.pc);
        const isCrew = BladesActor.IsType(this, BladesActorType.crew);
        if (!BladesActor.IsType(this, BladesActorType.pc)
            && !BladesActor.IsType(this, BladesActorType.crew)) {
            return false;
        }
        const { playbookName } = this;
        /*~ @@DOUBLE-BLANK@@ ~*/
        if (category === SelectionCategory.Heritage && isPC) {
            dialogData.Main = this._processEmbeddedItemMatches(BladesItem.GetTypeWithTags(BladesItemType.heritage));
        }
        else if (category === SelectionCategory.Background && isPC) {
            dialogData.Main = this._processEmbeddedItemMatches(BladesItem.GetTypeWithTags(BladesItemType.background));
        }
        else if (category === SelectionCategory.Vice && isPC && playbookName !== null) {
            dialogData.Main = this._processEmbeddedItemMatches(BladesItem.GetTypeWithTags(BladesItemType.vice, playbookName));
        }
        else if (category === SelectionCategory.Playbook) {
            if (this.type === BladesActorType.pc) {
                dialogData.Basic = this._processEmbeddedItemMatches(BladesItem.GetTypeWithTags(BladesItemType.playbook)
                    .filter((item) => !item.hasTag(Tag.Gear.Advanced)));
                dialogData.Advanced = this._processEmbeddedItemMatches(BladesItem.GetTypeWithTags(BladesItemType.playbook, Tag.Gear.Advanced));
            }
            else if (this.type === BladesActorType.crew) {
                dialogData.Main = this._processEmbeddedItemMatches(BladesItem.GetTypeWithTags(BladesItemType.crew_playbook));
            }
        }
        else if (category === SelectionCategory.Reputation && isCrew) {
            dialogData.Main = this._processEmbeddedItemMatches(BladesItem.GetTypeWithTags(BladesItemType.crew_reputation));
        }
        else if (category === SelectionCategory.Preferred_Op && isCrew && playbookName !== null) {
            dialogData.Main = this._processEmbeddedItemMatches(BladesItem.GetTypeWithTags(BladesItemType.preferred_op, playbookName));
        }
        else if (category === SelectionCategory.Gear && BladesActor.IsType(this, BladesActorType.pc)) {
            const self = this;
            if (playbookName === null) {
                return false;
            }
            const gearItems = this._processEmbeddedItemMatches([
                ...BladesItem.GetTypeWithTags(BladesItemType.gear, playbookName),
                ...BladesItem.GetTypeWithTags(BladesItemType.gear, Tag.Gear.General)
            ])
                .filter((item) => self.remainingLoad >= item.system.load);
            /*~ @@DOUBLE-BLANK@@ ~*/
            // Two tabs, one for playbook and the other for general items
            dialogData[playbookName] = gearItems.filter((item) => item.hasTag(playbookName));
            dialogData.General = gearItems
                .filter((item) => item.hasTag(Tag.Gear.General))
                // Remove featured class from General items
                .map((item) => {
                if (item.dialogCSSClasses) {
                    item.dialogCSSClasses = item.dialogCSSClasses.replace(/featured-item\s?/g, "");
                }
                return item;
            })
                // Re-sort by world_name
                .sort((a, b) => {
                if (a.system.world_name > b.system.world_name) {
                    return 1;
                }
                if (a.system.world_name < b.system.world_name) {
                    return -1;
                }
                return 0;
            });
        }
        else if (category === SelectionCategory.Ability) {
            if (isPC) {
                if (playbookName === null) {
                    return false;
                }
                dialogData[playbookName] = this._processEmbeddedItemMatches(BladesItem.GetTypeWithTags(BladesItemType.ability, playbookName));
                dialogData.Veteran = this._processEmbeddedItemMatches(BladesItem.GetTypeWithTags(BladesItemType.ability))
                    .filter((item) => !item.hasTag(playbookName))
                    // Remove featured class from Veteran items
                    .map((item) => {
                    if (item.dialogCSSClasses) {
                        item.dialogCSSClasses = item.dialogCSSClasses.replace(/featured-item\s?/g, "");
                    }
                    return item;
                })
                    // Re-sort by world_name
                    .sort((a, b) => {
                    if (a.system.world_name > b.system.world_name) {
                        return 1;
                    }
                    if (a.system.world_name < b.system.world_name) {
                        return -1;
                    }
                    return 0;
                });
            }
            else if (isCrew) {
                dialogData.Main = this._processEmbeddedItemMatches(BladesItem.GetTypeWithTags(BladesItemType.crew_ability, playbookName));
            }
        }
        else if (category === SelectionCategory.Upgrade && isCrew && playbookName !== null) {
            dialogData[playbookName] = this._processEmbeddedItemMatches(BladesItem.GetTypeWithTags(BladesItemType.crew_upgrade, playbookName));
            dialogData.General = this._processEmbeddedItemMatches(BladesItem.GetTypeWithTags(BladesItemType.crew_upgrade, Tag.Gear.General));
        }
        /*~ @@DOUBLE-BLANK@@ ~*/
        return dialogData;
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    getSubItem(itemRef, activeOnly = false) {
        const activeCheck = (i) => !activeOnly || !i.hasTag(Tag.System.Archived);
        if (typeof itemRef === "string" && this.items.get(itemRef)) {
            const returnItem = this.items.get(itemRef);
            if (returnItem && activeCheck(returnItem)) {
                return returnItem;
            }
            else {
                return undefined;
            }
        }
        else {
            const globalItem = BladesItem.Get(itemRef);
            if (!globalItem) {
                return undefined;
            }
            return this.items.find((item) => item.name === globalItem.name && activeCheck(item))
                ?? this.items.find((item) => item.system.world_name === globalItem.system.world_name && activeCheck(item));
        }
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    hasSubItemOf(itemRef) {
        const item = BladesItem.Get(itemRef);
        if (!item) {
            return false;
        }
        return Boolean(this.items.find((i) => i.system.world_name === item.system.world_name));
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    hasActiveSubItemOf(itemRef) {
        const item = BladesItem.Get(itemRef);
        if (!item) {
            return false;
        }
        return Boolean(this.items.find((i) => !i.hasTag(Tag.System.Archived)
            && i.system.world_name === item.system.world_name));
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    async addSubItem(itemRef) {
        /*~ @@DOUBLE-BLANK@@ ~*/
        /**
         * Determines whether a submitted BladesItemType is a type that should appear only once
         * on any given Actor.
         * @param {BladesItemType} type
         * @returns {boolean} True if the type is a BladesItemUniqueTypes
         **/
        function isBladesItemUniqueTypes(type) {
            return Object.values(BladesItemUniqueTypes).includes(type);
        }
        /*~ @@DOUBLE-BLANK@@ ~*/
        eLog.checkLog3("subitems", "[addSubItem] itemRef", itemRef);
        /*~ @@DOUBLE-BLANK@@ ~*/
        let focusItem;
        /*~ @@DOUBLE-BLANK@@ ~*/
        // Does an embedded copy of this item already exist on the character?
        const embeddedItem = this.getSubItem(itemRef);
        /*~ @@DOUBLE-BLANK@@ ~*/
        if (embeddedItem) {
            /*~ @@DOUBLE-BLANK@@ ~*/
            // Is it an archived Item?
            if (embeddedItem.hasTag(Tag.System.Archived)) {
                // Unarchive it & make it the focus item.
                await embeddedItem.remTag(Tag.System.Archived);
                focusItem = embeddedItem;
                eLog.checkLog3("subitems", `[addSubItem] IS ARCHIVED EMBEDDED > Removing 'Archived' Tag, '${focusItem.id}':`, focusItem);
            }
            else { // Otherwise...
                // Duplicate the item, and make the newly-created item the focus.
                focusItem = await BladesItem.create([embeddedItem], { parent: this });
                eLog.checkLog3("subitems", `[addSubItem] IS ACTIVE EMBEDDED > Duplicating, focusItem '${focusItem.id}':`, focusItem);
            }
        }
        else {
            // Is it not embedded at all? Embed from global instance.
            const globalItem = BladesItem.Get(itemRef);
            /*~ @@DOUBLE-BLANK@@ ~*/
            eLog.checkLog3("subitems", `[addSubItem] IS NOT EMBEDDED > Fetching Global, globalItem '${globalItem?.id}':`, globalItem);
            /*~ @@DOUBLE-BLANK@@ ~*/
            if (!globalItem) {
                return;
            }
            focusItem = await BladesItem.create([globalItem], { parent: this });
            focusItem = this.items.getName(globalItem.name);
        }
        /*~ @@DOUBLE-BLANK@@ ~*/
        // Is this item type limited to one per actor?
        if (focusItem && isBladesItemUniqueTypes(focusItem.type)) {
            // ... then archive all other versions.
            await Promise.all(this.activeSubItems
                .filter((subItem) => subItem.type === focusItem?.type
                && subItem.system.world_name !== focusItem?.system.world_name
                && !subItem.hasTag(Tag.System.Archived))
                .map(this.remSubItem.bind(this)));
        }
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    async remSubItem(itemRef) {
        const subItem = this.getSubItem(itemRef);
        if (!subItem) {
            return;
        }
        if (subItem.type !== BladesItemType.gear) {
            this.purgeSubItem(itemRef);
            return;
        }
        eLog.checkLog("actorTrigger", `Removing SubItem ${subItem.name}`, subItem);
        if (subItem.hasTag(Tag.System.Archived)) {
            return;
        }
        await subItem.addTag(Tag.System.Archived);
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    async purgeSubItem(itemRef) {
        const subItem = this.getSubItem(itemRef);
        if (!subItem || subItem.hasTag(Tag.System.Archived)) {
            return;
        }
        await subItem.delete();
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    // #endregion
    // #region Advancement Implementation ~
    // get totalAbilityPoints(): number {
    //   if (!BladesActor.IsType(this, BladesActorType.pc, BladesActorType.crew)) { return 0 }
    //   if (!this.playbook) { return 0 }
    //   switch (this.type) {
    //     case BladesActorType.pc: return this.system.advancement.ability ?? 0;
    //     case BladesActorType.crew: return Math.floor(0.5 * (this.system.advancement.general ?? 0))
    //      + (this.system.advancement.ability ?? 0);
    //     default: return 0;
    //   }
    // }
    // get spentAbilityPoints(): number {
    //   if (!BladesActor.IsType(this, BladesActorType.pc, BladesActorType.crew)) { return 0 }
    //   if (!this.playbook) { return 0 }
    //   return this.abilities.reduce((total, ability) => total + (ability.system.price ?? 1), 0);
    // }
    // get getAvailableAdvancements("Ability")(): number {
    //   if (!BladesActor.IsType(this, BladesActorType.pc, BladesActorType.crew)) { return 0 }
    //   if (!this.playbook) { return 0 }
    //   return this.totalAbilityPoints - this.spentAbilityPoints;
    // }
    /*~ @@DOUBLE-BLANK@@ ~*/
    /* Need simple getters for total ability & upgrade points that check for PRICES of items
          (upgrade.system.price ?? 1) */
    /*~ @@DOUBLE-BLANK@@ ~*/
    async grantAdvancementPoints(allowedTypes, amount = 1) {
        const aPtKey = Array.isArray(allowedTypes)
            ? [...allowedTypes].sort((a, b) => a.localeCompare(b)).join("_")
            : allowedTypes;
        await this.update({ [`system.advancement_points.${aPtKey}`]: (this.system.advancement_points?.[aPtKey] ?? 0) + amount });
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    async removeAdvancementPoints(allowedTypes, amount = 1) {
        const aPtKey = Array.isArray(allowedTypes)
            ? [...allowedTypes].sort((a, b) => a.localeCompare(b)).join("_")
            : allowedTypes;
        const newCount = this.system.advancement_points?.[aPtKey] ?? 0 - amount;
        if (newCount <= 0 && aPtKey in (this.system.advancement_points ?? [])) {
            await this.update({ [`system.advancement_points.-=${aPtKey}`]: null });
        }
        else {
            await this.update({ [`system.advancement_points.${aPtKey}`]: newCount });
        }
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    getAvailableAdvancements(trait) {
        if (!BladesActor.IsType(this, BladesActorType.pc, BladesActorType.crew)) {
            return 0;
        }
        if (trait in ActionTrait) {
            return 1;
        }
        if (trait === "Cohort") {
            const pointsCohort = this.system.advancement_points?.[AdvancementPoint.Cohort] ?? 0;
            const spentCohort = this.cohorts.length;
            return Math.max(0, pointsCohort - spentCohort);
        }
        /*~ @@DOUBLE-BLANK@@ ~*/
        const pointsAbility = this.system.advancement_points?.[AdvancementPoint.Ability] ?? 0;
        const pointsCohortType = this.system.advancement_points?.[AdvancementPoint.CohortType] ?? 0;
        const pointsUpgrade = this.system.advancement_points?.[AdvancementPoint.Upgrade] ?? 0;
        const pointsUpgradeOrAbility = this.system.advancement_points?.[AdvancementPoint.UpgradeOrAbility] ?? 0;
        /*~ @@DOUBLE-BLANK@@ ~*/
        const spentAbility = U.sum(this.items
            .filter((item) => BladesItem.IsType(item, BladesItemType.ability, BladesItemType.crew_ability))
            .map((abil) => abil.system.price ?? 1));
        const spentCohortType = U.sum(this.cohorts
            .map((cohort) => Math.max(0, U.unique(Object.values(cohort.system.subtypes)).length - 1)));
        const spentUpgrade = U.sum(this.items
            .filter((item) => BladesItem.IsType(item, BladesItemType.crew_upgrade))
            .map((upgrade) => upgrade.system.price ?? 1));
        /*~ @@DOUBLE-BLANK@@ ~*/
        const excessUpgrade = Math.max(0, spentUpgrade - pointsUpgrade);
        const excessCohortType = Math.max(0, spentCohortType - pointsCohortType);
        const excessAbility = Math.max(0, spentAbility - pointsAbility);
        /*~ @@DOUBLE-BLANK@@ ~*/
        const remainingAbility = Math.max(0, pointsAbility - spentAbility);
        const remainingCohortType = Math.max(0, pointsCohortType - spentCohortType);
        const remainingUpgrade = Math.max(0, pointsUpgrade - spentUpgrade);
        const remainingUpgradeOrAbility = Math.max(0, pointsUpgradeOrAbility - excessUpgrade - (2 * excessAbility) - (2 * excessCohortType));
        /*~ @@DOUBLE-BLANK@@ ~*/
        if (trait === "Ability") {
            return remainingAbility + Math.floor(0.5 * remainingUpgradeOrAbility);
        }
        if (trait === "Upgrade") {
            return remainingUpgrade + remainingUpgradeOrAbility;
        }
        if (trait === "CohortType") {
            return remainingCohortType + remainingUpgradeOrAbility;
        }
        /*~ @@DOUBLE-BLANK@@ ~*/
        return 0;
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    get availableAbilityPoints() { return this.getAvailableAdvancements("Ability"); }
    /*~ @@DOUBLE-BLANK@@ ~*/
    get availableUpgradePoints() { return this.getAvailableAdvancements("Upgrade"); }
    /*~ @@DOUBLE-BLANK@@ ~*/
    get availableCohortPoints() { return this.getAvailableAdvancements("Cohort"); }
    /*~ @@DOUBLE-BLANK@@ ~*/
    get availableCohortTypePoints() { return this.getAvailableAdvancements("CohortType"); }
    /*~ @@DOUBLE-BLANK@@ ~*/
    get canPurchaseAbility() { return this.availableAbilityPoints > 0; }
    /*~ @@DOUBLE-BLANK@@ ~*/
    get canPurchaseUpgrade() { return this.availableUpgradePoints > 0; }
    /*~ @@DOUBLE-BLANK@@ ~*/
    get canPurchaseCohort() { return this.availableCohortPoints > 0; }
    /*~ @@DOUBLE-BLANK@@ ~*/
    get canPurchaseCohortType() { return this.availableCohortTypePoints > 0; }
    /*~ @@DOUBLE-BLANK@@ ~*/
    async advancePlaybook() {
        if (!BladesActor.IsType(this, BladesActorType.pc, BladesActorType.crew) || !this.playbook) {
            return;
        }
        await this.update({ "system.experience.playbook.value": 0 });
        if (BladesActor.IsType(this, BladesActorType.pc)) {
            BladesPushAlert.Get().pushToAll("GM", `${this.name} Advances their Playbook!`, `${this.name}, select a new Ability on your Character Sheet.`);
            this.grantAdvancementPoints(AdvancementPoint.Ability);
            return;
        }
        if (BladesActor.IsType(this, BladesActorType.crew)) {
            BladesPushAlert.Get().pushToAll("GM", `${this.name} Advances their Playbook!`, "Select new Upgrades and/or Abilities on your Crew Sheet.");
            this.members.forEach((member) => {
                const coinGained = this.system.tier.value + 2;
                BladesPushAlert.Get().pushToAll("GM", `${member.name} Gains ${coinGained} Stash (Crew Advancement)`, undefined);
                member.addStash(coinGained);
            });
            this.grantAdvancementPoints(AdvancementPoint.UpgradeOrAbility, 2);
        }
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    async advanceAttribute(attribute) {
        await this.update({ [`system.experience.${attribute}.value`]: 0 });
        const actions = C.Action[attribute].map((action) => `<strong>${U.tCase(action)}</strong>`);
        BladesPushAlert.Get().pushToAll("GM", `${this.name} Advances their ${U.uCase(attribute)}!`, `${this.name}, add a dot to one of ${U.oxfordize(actions, true, "or")}.`);
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    // #endregion
    // #region BladesSubActor Implementation ~
    /*~ @@DOUBLE-BLANK@@ ~*/
    parentActor;
    /*~ @@DOUBLE-BLANK@@ ~*/
    get isSubActor() { return this.parentActor !== undefined; }
    /*~ @@DOUBLE-BLANK@@ ~*/
    // #endregion
    /*~ @@DOUBLE-BLANK@@ ~*/
    // #region BladesRoll Implementation
    get rollModsData() {
        return BladesRollMod.ParseDocRollMods(this);
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    get rollFactors() {
        const factorData = {
            [Factor.tier]: {
                name: Factor.tier,
                display: "Tier",
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
                display: "Quality",
                value: this.getFactorTotal(Factor.quality),
                max: this.getFactorTotal(Factor.quality),
                baseVal: this.getFactorTotal(Factor.quality),
                isActive: false,
                isPrimary: false,
                isDominant: false,
                highFavorsPC: true
            }
        };
        /*~ @@DOUBLE-BLANK@@ ~*/
        return factorData;
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    // #region BladesRoll.PrimaryDoc Implementation
    /*~ @@DOUBLE-BLANK@@ ~*/
    get rollPrimaryID() { return this.id; }
    /*~ @@DOUBLE-BLANK@@ ~*/
    get rollPrimaryDoc() { return this; }
    /*~ @@DOUBLE-BLANK@@ ~*/
    get rollPrimaryName() { return this.name; }
    /*~ @@DOUBLE-BLANK@@ ~*/
    get rollPrimaryType() { return this.type; }
    /*~ @@DOUBLE-BLANK@@ ~*/
    get rollPrimaryImg() { return this.img; }
    /*~ @@DOUBLE-BLANK@@ ~*/
    // #region BladesCrew Implementation ~
    /*~ @@DOUBLE-BLANK@@ ~*/
    get members() {
        if (!BladesActor.IsType(this, BladesActorType.crew)) {
            return [];
        }
        const self = this;
        return BladesActor.GetTypeWithTags(BladesActorType.pc).filter((actor) => actor.isMember(self));
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    get contacts() {
        if (!BladesActor.IsType(this, BladesActorType.crew) || !this.playbook) {
            return [];
        }
        const self = this;
        return this.activeSubActors.filter((actor) => actor.hasTag(self.playbookName));
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    get claims() {
        if (!BladesActor.IsType(this, BladesActorType.crew) || !this.playbook) {
            return {};
        }
        return this.playbook.system.turfs;
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    get turfCount() {
        if (!BladesActor.IsType(this, BladesActorType.crew) || !this.playbook) {
            return 0;
        }
        return Object.values(this.playbook.system.turfs)
            .filter((claim) => claim.isTurf && claim.value).length;
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    get upgrades() {
        if (!BladesActor.IsType(this, BladesActorType.crew) || !this.playbook) {
            return [];
        }
        return this.activeSubItems
            .filter((item) => item.type === BladesItemType.crew_upgrade);
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    get cohorts() {
        return this.activeSubItems
            .filter((item) => [BladesItemType.cohort_gang, BladesItemType.cohort_expert].includes(item.type));
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    getTaggedItemBonuses(tags) {
        // Check ACTIVE EFFECTS supplied by upgrade/ability against submitted tags?
        return tags.length; // Placeholder to avoid linter error
    }
    // #endregion
    /*~ @@DOUBLE-BLANK@@ ~*/
    // #region PREPARING DERIVED DATA
    prepareDerivedData() {
        if (BladesActor.IsType(this, BladesActorType.pc)) {
            this._preparePCData(this.system);
        }
        if (BladesActor.IsType(this, BladesActorType.crew)) {
            this._prepareCrewData(this.system);
        }
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    _preparePCData(system) {
        if (!BladesActor.IsType(this, BladesActorType.pc)) {
            return;
        }
        /*~ @@DOUBLE-BLANK@@ ~*/
        // Extract experience clues from playbook item, if any
        if (this.playbook) {
            system.experience.clues = [
                ...system.experience.clues,
                ...Object.values(this.playbook.system.experience_clues)
                    .filter((clue) => Boolean(clue.trim()))
            ];
        }
        // Extract gather information questions from playbook item, if any
        if (this.playbook) {
            system.gather_info = [
                ...system.gather_info,
                ...Object.values(this.playbook.system.gather_info_questions)
                    .filter((question) => Boolean(question.trim()))
            ];
        }
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    _prepareCrewData(system) {
        if (!BladesActor.IsType(this, BladesActorType.crew)) {
            return;
        }
        /*~ @@DOUBLE-BLANK@@ ~*/
        // Extract experience clues and turfs from playbook item, if any
        if (this.playbook) {
            system.experience.clues = [
                ...system.experience.clues,
                ...Object.values(this.playbook.system.experience_clues)
                    .filter((clue) => Boolean(clue.trim()))
            ];
            system.turfs = this.playbook.system.turfs;
        }
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    // #endregion
    /*~ @@DOUBLE-BLANK@@ ~*/
    // #region OVERRIDES: _onCreateDescendantDocuments, update ~
    // @ts-expect-error New method not defined in @league VTT types.
    async _onCreateDescendantDocuments(parent, collection, docs, data, options, userId) {
        await Promise.all(docs.map(async (doc) => {
            if (BladesItem.IsType(doc, BladesItemType.playbook, BladesItemType.crew_playbook)) {
                await Promise.all(this.activeSubItems
                    .filter((aItem) => aItem.type === doc.type && aItem.system.world_name !== doc.system.world_name)
                    .map((aItem) => this.remSubItem(aItem)));
            }
        }));
        /*~ @@DOUBLE-BLANK@@ ~*/
        // @ts-expect-error New method not defined in @league VTT types.
        await super._onCreateDescendantDocuments(parent, collection, docs, data, options, userId);
        /*~ @@DOUBLE-BLANK@@ ~*/
        eLog.checkLog("actorTrigger", "_onCreateDescendantDocuments", { parent, collection, docs, data, options, userId });
        /*~ @@DOUBLE-BLANK@@ ~*/
        docs.forEach((doc) => {
            if (BladesItem.IsType(doc, BladesItemType.vice) && BladesActor.IsType(this, BladesActorType.pc)) {
                this.activeSubActors
                    .filter((subActor) => subActor.hasTag(Tag.NPC.VicePurveyor) && !subActor.hasTag(doc.name))
                    .forEach((subActor) => { this.remSubActor(subActor); });
            }
        });
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    async update(updateData, context, isSkippingSubActorCheck = false) {
        if (!updateData) {
            return super.update(updateData);
        }
        if (BladesActor.IsType(this, BladesActorType.crew)) {
            if (!this.playbook) {
                return undefined;
            }
            /*~ @@DOUBLE-BLANK@@ ~*/
            eLog.checkLog("actorTrigger", "Updating Crew", { updateData });
            const playbookUpdateData = Object.fromEntries(Object.entries(flattenObject(updateData))
                .filter(([key, _]) => key.startsWith("system.turfs.")));
            updateData = Object.fromEntries(Object.entries(flattenObject(updateData))
                .filter(([key, _]) => !key.startsWith("system.turfs.")));
            eLog.checkLog("actorTrigger", "Updating Crew", { crewUpdateData: updateData, playbookUpdateData });
            /*~ @@DOUBLE-BLANK@@ ~*/
            const diffPlaybookData = diffObject(flattenObject(this.playbook), playbookUpdateData);
            delete diffPlaybookData._id;
            /*~ @@DOUBLE-BLANK@@ ~*/
            if (!U.isEmpty(diffPlaybookData)) {
                await this.playbook.update(playbookUpdateData, context)
                    .then(() => this.sheet?.render(false));
            }
        }
        else if ((BladesActor.IsType(this, BladesActorType.npc)
            || BladesActor.IsType(this, BladesActorType.faction))
            && this.parentActor
            && !isSkippingSubActorCheck) {
            // This is an embedded Actor: Update it as a subActor of parentActor.
            return this.parentActor.updateSubActor(this.id, updateData)
                .then(() => this);
        }
        /*~ @@DOUBLE-BLANK@@ ~*/
        return super.update(updateData, context);
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    // #endregion
    /*~ @@DOUBLE-BLANK@@ ~*/
    // #region Rolling Dice ~
    /*~ @@DOUBLE-BLANK@@ ~*/
    /**
     * Creates <options> modifiers for dice roll.
     *
     * @param {int} rs
     *  Min die modifier
     * @param {int} re
     *  Max die modifier
     * @param {int} s
     *  Selected die
     */
    createListOfDiceMods(rs, re, s) {
        /*~ @@DOUBLE-BLANK@@ ~*/
        let text = "";
        /*~ @@DOUBLE-BLANK@@ ~*/
        if (s === "") {
            s = 0;
        }
        /*~ @@DOUBLE-BLANK@@ ~*/
        for (let i = rs; i <= re; i++) {
            let plus = "";
            if (i >= 0) {
                plus = "+";
            }
            text += `<option value="${i}"`;
            if (i === s) {
                text += " selected";
            }
            /*~ @@DOUBLE-BLANK@@ ~*/
            text += `>${plus}${i}d</option>`;
        }
        /*~ @@DOUBLE-BLANK@@ ~*/
        return text;
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    // #endregion Rolling Dice
    /*~ @@DOUBLE-BLANK@@ ~*/
    // #region NPC Randomizers ~
    updateRandomizers() {
        if (!BladesActor.IsType(this, BladesActorType.npc)) {
            return;
        }
        const titleChance = 0.05;
        const suffixChance = 0.01;
        /*~ @@DOUBLE-BLANK@@ ~*/
        const { persona, secret, random } = this.system;
        /*~ @@DOUBLE-BLANK@@ ~*/
        /**
         * Returns a random element from an array, optionally excluding all values
         * passed as subsequent parameters.
         * @param {string[]} arr The array to randomly select from.
         * @param {...string} curVals The values to exclude from the sample.
         */
        function sampleArray(arr, ...curVals) {
            arr = arr.filter((elem) => !curVals.includes(elem));
            if (!arr.length) {
                return "";
            }
            return arr[Math.floor(Math.random() * arr.length)];
        }
        const randomGen = {
            name: (gen) => {
                return [
                    Math.random() <= titleChance
                        ? sampleArray(Randomizers.NPC.name_title)
                        : "",
                    sampleArray([
                        ...((gen ?? "").charAt(0).toLowerCase() !== "m" ? Randomizers.NPC.name_first.female : []),
                        ...((gen ?? "").charAt(0).toLowerCase() !== "f" ? Randomizers.NPC.name_first.male : [])
                    ]),
                    `"${sampleArray(Randomizers.NPC.name_alias)}"`,
                    sampleArray(Randomizers.NPC.name_surname),
                    Math.random() <= suffixChance
                        ? sampleArray(Randomizers.NPC.name_suffix)
                        : ""
                ].filter((val) => Boolean(val)).join(" ");
            },
            background: () => sampleArray(Randomizers.NPC.background, random.background.value),
            heritage: () => sampleArray(Randomizers.NPC.heritage, random.heritage.value),
            profession: () => sampleArray(Randomizers.NPC.profession, random.profession.value),
            gender: () => sampleArray(Randomizers.NPC.gender, persona.gender.value),
            appearance: () => sampleArray(Randomizers.NPC.appearance, persona.appearance.value),
            goal: () => sampleArray(Randomizers.NPC.goal, persona.goal.value, secret.goal.value),
            method: () => sampleArray(Randomizers.NPC.method, persona.method.value, secret.method.value),
            trait: () => sampleArray(Randomizers.NPC.trait, persona.trait1.value, persona.trait2.value, persona.trait3.value, secret.trait.value),
            interests: () => sampleArray(Randomizers.NPC.interests, persona.interests.value, secret.interests.value),
            quirk: () => sampleArray(Randomizers.NPC.quirk, persona.quirk.value),
            style: (gen = "") => sampleArray([
                ...(gen.charAt(0).toLowerCase() !== "m" ? Randomizers.NPC.style.female : []),
                ...(gen.charAt(0).toLowerCase() !== "f" ? Randomizers.NPC.style.male : [])
            ], persona.style.value)
        };
        /*~ @@DOUBLE-BLANK@@ ~*/
        const gender = persona.gender.isLocked ? persona.gender.value : randomGen.gender();
        const updateKeys = [
            ...Object.keys(persona).filter((key) => !persona[key]?.isLocked),
            ...Object.keys(random).filter((key) => !random[key]?.isLocked),
            ...Object.keys(secret).filter((key) => !secret[key]?.isLocked)
                .map((secretKey) => `secret-${secretKey}`)
        ];
        /*~ @@DOUBLE-BLANK@@ ~*/
        eLog.checkLog("Update Keys", { updateKeys });
        const updateData = {};
        /*~ @@DOUBLE-BLANK@@ ~*/
        updateKeys.forEach((key) => {
            switch (key) {
                case "name":
                case "heritage":
                case "background":
                case "profession": {
                    const randomVal = randomGen[key]();
                    updateData[`system.random.${key}`] = {
                        isLocked: false,
                        value: randomVal || random[key].value
                    };
                    break;
                }
                case "secret-goal":
                case "secret-interests":
                case "secret-method": {
                    key = key.replace(/^secret-/, "");
                    const randomVal = randomGen[key]();
                    updateData[`system.secret.${key}`] = {
                        isLocked: false,
                        value: randomVal || secret[key].value
                    };
                    break;
                }
                case "gender": {
                    updateData[`system.persona.${key}`] = {
                        isLocked: persona.gender.isLocked,
                        value: gender
                    };
                    break;
                }
                case "trait1":
                case "trait2":
                case "trait3":
                case "secret-trait": {
                    const trait1 = persona.trait1.isLocked
                        ? persona.trait1.value
                        : sampleArray(Randomizers.NPC.trait, persona.trait1.value, persona.trait2.value, persona.trait3.value, secret.trait.value);
                    const trait2 = persona.trait2.isLocked
                        ? persona.trait2.value
                        : sampleArray(Randomizers.NPC.trait, trait1, persona.trait1.value, persona.trait2.value, persona.trait3.value, secret.trait.value);
                    const trait3 = persona.trait3.isLocked
                        ? persona.trait3.value
                        : sampleArray(Randomizers.NPC.trait, trait1, trait2, persona.trait1.value, persona.trait2.value, persona.trait3.value, secret.trait.value);
                    const secretTrait = secret.trait.isLocked
                        ? secret.trait.value
                        : sampleArray(Randomizers.NPC.trait, trait1, trait2, trait3, persona.trait1.value, persona.trait2.value, persona.trait3.value, secret.trait.value);
                    if (!persona.trait1.isLocked) {
                        updateData["system.persona.trait1"] = {
                            isLocked: false,
                            value: trait1
                        };
                    }
                    if (!persona.trait2.isLocked) {
                        updateData["system.persona.trait2"] = {
                            isLocked: false,
                            value: trait2
                        };
                    }
                    if (!persona.trait3.isLocked) {
                        updateData["system.persona.trait3"] = {
                            isLocked: false,
                            value: trait3
                        };
                    }
                    if (!secret.trait.isLocked) {
                        updateData["system.secret.trait"] = {
                            isLocked: false,
                            value: secretTrait
                        };
                    }
                    break;
                }
                default: {
                    const randomVal = randomGen[key]();
                    updateData[`system.persona.${key}`] = {
                        isLocked: false,
                        value: randomVal || persona[key].value
                    };
                    break;
                }
            }
        });
        /*~ @@DOUBLE-BLANK@@ ~*/
        this.update(updateData);
    }
}
/*~ @@DOUBLE-BLANK@@ ~*/
export default BladesActor;
/*~ @@DOUBLE-BLANK@@ ~*/ 
