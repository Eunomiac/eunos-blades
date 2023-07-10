/* ****▌███████████████████████████████████████████████████████████████████████████▐**** *\
|*     ▌████░░░░░░░░░░░ Euno's Blades in the Dark for Foundry VTT ░░░░░░░░░░░░░████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░ by Eunomiac ░░░░░░░░░░░░░██████████████████▐     *|
|*     ▌████████████████████████████  License █ v0.1.0 ████████████████████████████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░░░░░░  ░░░░░░░░░░░░░░░░░░███████████████████▐     *|
\* ****▌███████████████████████████████████████████████████████████████████████████▐**** */

import U from "./core/utilities.js";
import { BladesActorType, Tag, BladesItemType, Playbook, Randomizers, Attributes, Actions, Positions, EffectLevels } from "./core/constants.js";
import { bladesRoll } from "./blades-roll.js";
import BladesItem, { PrereqType } from "./blades-item.js";
import { SelectionCategory } from "./blades-dialog.js";
class BladesActor extends Actor {

    static get All() { return game.actors; }
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
    static GetTypeWithTags(docType, ...tags) {
        return BladesActor.All.filter((actor) => actor.type === docType)
            .filter((actor) => actor.hasTag(...tags));
    }
    get tags() { return this.system.tags ?? []; }
    hasTag(...tags) {
        return tags.every((tag) => this.tags.includes(tag));
    }
    async addTag(...tags) {
        const curTags = this.tags;
        tags.forEach((tag) => {
            if (curTags.includes(tag)) {
                return;
            }
            curTags.push(tag);
        });
        this.update({ "system.tags": curTags });
    }
    async remTag(...tags) {
        const curTags = this.tags.filter((tag) => !tags.includes(tag));
        this.update({ "system.tags": curTags });
    }
    get tooltip() {
        const tooltipText = [
            this.system.concept,
            this.system.description_short
        ].find((str) => Boolean(str));
        return tooltipText ? (new Handlebars.SafeString(tooltipText)).toString() : undefined;
    }
    get primaryUser() {
        return game.users.find((user) => user.character?.id === this?.id);
    }
    
    get subActors() {
        return Object.keys(this.system.subactors)
            .map((id) => this.getSubActor(id))
            .filter((subActor) => Boolean(subActor));
    }
    get activeSubActors() { return this.subActors.filter((subActor) => !subActor.hasTag(Tag.System.Archived)); }
    get archivedSubActors() { return this.subActors.filter((subActor) => subActor.hasTag(Tag.System.Archived)); }
    checkActorPrereqs(actor) {
                
        return true;
    }
    processEmbeddedActorMatches(globalActors) {
        globalActors = globalActors.filter(this.checkActorPrereqs);
        const mergedActors = globalActors.map((gActor) => this.getSubActor(gActor) || gActor);
        mergedActors.sort((a, b) => {
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
        return mergedActors;
    }
    getDialogActors(category) {
                
        const dialogData = {};
        switch (category) {
            case SelectionCategory.Rival:
            case SelectionCategory.Friend:
            case SelectionCategory.Acquaintance: {
                if (this.playbookName === null) {
                    return false;
                }
                dialogData.Main = this.processEmbeddedActorMatches(BladesActor.GetTypeWithTags(BladesActorType.npc, this.playbookName));
                return dialogData;
            }
            case SelectionCategory.VicePurveyor: {
                if (this.vices.length === 0) {
                    return false;
                }
                dialogData.Main = this.processEmbeddedActorMatches(BladesActor.GetTypeWithTags(BladesActorType.npc, ...this.vices.map((vice) => vice.name)));
                return dialogData;
            }
            case SelectionCategory.Crew: {
                dialogData.Main = BladesActor.GetTypeWithTags(BladesActorType.crew);
                return dialogData;
            }
            default: return false;
        }
    }
    async addSubActor(actorRef, tags) {
        eLog.checkLog3("subactors", "[addSubActor] actorRef, tags", { actorRef, tags });
        let BladesActorUniqueTags;
        (function (BladesActorUniqueTags) {
            BladesActorUniqueTags["CharacterCrew"] = "CharacterCrew";
            BladesActorUniqueTags["VicePurveyor"] = "VicePurveyor";
        })(BladesActorUniqueTags || (BladesActorUniqueTags = {}));
        let focusSubActor;
        if (this.hasSubActorOf(actorRef)) {
            const subActor = this.getSubActor(actorRef);
            if (!subActor) {
                return;
            }
            if (subActor.hasTag(Tag.System.Archived)) {
                await subActor.remTag(Tag.System.Archived);
            }
            focusSubActor = subActor;
        }
        else {
            const actor = BladesActor.Get(actorRef);
            if (!actor) {
                return;
            }
            const subActorData = {
                id: actor.id,
                system: {}
            };
            if (tags) {
                subActorData.system.tags = U.unique([
                    ...actor.tags,
                    ...tags
                ]);
            }
            await this.update({ [`system.subactors.${actor.id}`]: subActorData });
            focusSubActor = this.getSubActor(actor.id);
        }
        eLog.checkLog3("subactors", "[addSubActor] Found focusSubActor??");
        if (!focusSubActor) {
            return;
        }
        eLog.checkLog3("subactors", "[addSubActor] ... YES!", focusSubActor);
        const uniqueTags = focusSubActor.tags.filter((tag) => tag in BladesActorUniqueTags);
        eLog.checkLog3("subactors", "[addSubActor] Matching Unique Tags?", { subActorTags: focusSubActor.tags, uniqueTags });
        if (uniqueTags.length > 0) {
            uniqueTags.forEach((uTag) => this.activeSubActors
                .filter((subActor) => subActor.id !== focusSubActor.id && subActor.hasTag(uTag))
                .map((subActor) => this.remSubActor(subActor.id)));
        }
    }
    getSubActor(actorRef) {
        const actor = BladesActor.Get(actorRef);
        if (!actor?.id) {
            return undefined;
        }
        const subActorData = this.system.subactors[actor.id] ?? {};
        actor.system = mergeObject(actor.system, subActorData.system ?? {});
        if (this.primaryUser?.id) {
            actor.ownership[this.primaryUser.id] = CONST.DOCUMENT_PERMISSION_LEVELS.OWNER;
        }
        actor.parentActor = this;
        return actor;
    }
    hasSubActorOf(actorRef) {
        const actor = BladesActor.Get(actorRef);
        if (!actor) {
            return false;
        }
        return actor?.id ? actor.id in this.system.subactors : false;
    }
    async updateSubActor(actorRef, updateData) {
        const actor = BladesActor.Get(actorRef);
        if (!actor) {
            return undefined;
        }
        const curData = this.system.subactors[actor.id] ?? {};
        const mergedData = mergeObject(curData, updateData);
        return this.update({ [`system.subactors.${actor.id}`]: mergedData }, undefined, true);
    }
    async remSubActor(actorRef) {
        const actor = BladesActor.Get(actorRef);
        if (!actor) {
            return;
        }
        if (!this.hasSubActorOf(actor)) {
            return;
        }
        const subActor = this.getSubActor(actor);
        if (!subActor || subActor.hasTag(Tag.System.Archived)) {
            return;
        }
        subActor.addTag(Tag.System.Archived);
    }
    async purgeSubActor(actorRef) {
        const subActor = this.getSubActor(actorRef);
        if (!subActor) {
            return;
        }
        this.update({ ["system.subactors"]: mergeObject(this.system.subactors, { [`-=${subActor.id}`]: null }) }, undefined, true);
    }
    get subItems() { return Array.from(this.items); }
    get activeSubItems() { return this.items.filter((item) => !item.hasTag(Tag.System.Archived)); }
    get archivedSubItems() { return this.items.filter((item) => item.hasTag(Tag.System.Archived)); }
    _checkItemPrereqs(item) {
        if (!item.system.prereqs) {
            return true;
        }
        for (let [pType, pReqs] of Object.entries(item.system.prereqs)) {
            pReqs = Array.isArray(pReqs) ? pReqs : [pReqs.toString()];
            const hitRecord = {};
            while (pReqs.length) {
                const pString = pReqs.pop();
                hitRecord[pType] ??= [];
                switch (pType) {
                    case PrereqType.HasActiveItem: {
                        const thisItem = this.activeSubItems
                            .filter((item) => !hitRecord[pType]?.includes(item.id))
                            .find((item) => item.system.world_name === pString);
                        if (thisItem) {
                            hitRecord[pType].push(thisItem.id);
                        }
                        else {
                            return false;
                        }
                        break;
                    }
                    case PrereqType.HasActiveItemsByTag: {
                        const thisItem = this.activeSubItems
                            .filter((item) => !hitRecord[pType]?.includes(item.id))
                            .find((item) => item.hasTag(pString));
                        if (thisItem) {
                            hitRecord[pType].push(thisItem.id);
                        }
                        else {
                            return false;
                        }
                        break;
                    }
                    case PrereqType.AdvancedPlaybook: {
                        if (!this.playbookName || ![Playbook.Ghost, Playbook.Hull, Playbook.Vampire].includes(this.playbookName)) {
                            return false;
                        }
                    }
                }
            }
        }
        return true;
    }
    _processEmbeddedItemMatches(globalItems) {
        return globalItems
            .filter((item) => this._checkItemPrereqs(item))
            .filter((gItem) => {
            const matchingActiveSubItems = this.activeSubItems.filter((sItem) => sItem.system.world_name === gItem.system.world_name);
            return (gItem.system.num_available ?? 1) > matchingActiveSubItems.length;
        })
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
            .map((sItem) => {
            const cssClasses = [];
            if (sItem.isEmbedded) {
                cssClasses.push("embedded");
            }
            if (sItem.hasTag(Tag.Item.Fine)) {
                cssClasses.push("fine-quality");
            }
            if (sItem.hasTag(Tag.System.Featured)) {
                cssClasses.push("featured-item");
            }
            if (cssClasses.length > 0) {
                sItem.dialogCSSClasses = cssClasses.join(" ");
            }
            return sItem;
        })
            .sort((a, b) => {
            if (a.hasTag(Tag.System.Featured) && !b.hasTag(Tag.System.Featured)) {
                return -1;
            }
            if (!a.hasTag(Tag.System.Featured) && b.hasTag(Tag.System.Featured)) {
                return 1;
            }
            if (a.hasTag(Tag.Item.Fine) && !b.hasTag(Tag.Item.Fine)) {
                return -1;
            }
            if (!a.hasTag(Tag.Item.Fine) && b.hasTag(Tag.Item.Fine)) {
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
    getDialogItems(category) {
        const dialogData = {};
        switch (category) {
            case SelectionCategory.Heritage: {
                dialogData.Main = this._processEmbeddedItemMatches(BladesItem.GetTypeWithTags(BladesItemType.heritage));
                return dialogData;
            }
            case SelectionCategory.Background: {
                dialogData.Main = this._processEmbeddedItemMatches(BladesItem.GetTypeWithTags(BladesItemType.background));
                return dialogData;
            }
            case SelectionCategory.Vice: {
                if (this.playbookName === null) {
                    return false;
                }
                if (this.vices.some((item) => item.hasTag(Tag.Item.ViceOverride))) {
                    return false;
                }
                dialogData.Main = this._processEmbeddedItemMatches(BladesItem.GetTypeWithTags(BladesItemType.vice, this.playbookName));
                return dialogData;
            }
            case SelectionCategory.Playbook: {
                switch (this.type) {
                    case BladesActorType.pc: {
                        dialogData.Basic = this._processEmbeddedItemMatches(BladesItem.GetTypeWithTags(BladesItemType.playbook).filter((item) => !item.hasTag(Tag.Item.Advanced)));
                        dialogData.Advanced = this._processEmbeddedItemMatches(BladesItem.GetTypeWithTags(BladesItemType.playbook, Tag.Item.Advanced));
                        return dialogData;
                    }
                    case BladesActorType.crew: {
                        dialogData.Main = this._processEmbeddedItemMatches(BladesItem.GetTypeWithTags(BladesItemType.crew_playbook));
                        return dialogData;
                    }
                    default: return false;
                }
            }
            case SelectionCategory.Reputation: {
                dialogData.Main = this._processEmbeddedItemMatches(BladesItem.GetTypeWithTags(BladesItemType.crew_reputation));
                return dialogData;
            }
            case SelectionCategory.PreferredOp: {
                dialogData.Main = this._processEmbeddedItemMatches(BladesItem.GetTypeWithTags(BladesItemType.preferred_op));
                return dialogData;
            }
            case SelectionCategory.Gear: {
                if (this.playbookName === null) {
                    return false;
                }
                const gearItems = this._processEmbeddedItemMatches([
                    ...BladesItem.GetTypeWithTags(BladesItemType.item, this.playbookName),
                    ...BladesItem.GetTypeWithTags(BladesItemType.item, Tag.Item.General)
                ])
                    .filter((item) => this.remainingLoad >= item.load);
                dialogData[this.playbookName] = gearItems.filter((item) => item.hasTag(this.playbookName));
                dialogData.General = gearItems
                    .filter((item) => item.hasTag(Tag.Item.General))
                    .map((item) => {
                    if (item.dialogCSSClasses) {
                        item.dialogCSSClasses = item.dialogCSSClasses.replace(/featured-item\s?/g, "");
                    }
                    return item;
                })
                    .sort((a, b) => {
                    if (a.system.world_name > b.system.world_name) {
                        return 1;
                    }
                    if (a.system.world_name < b.system.world_name) {
                        return -1;
                    }
                    return 0;
                });
                return dialogData;
            }
            case SelectionCategory.Ability: {
                if (this.playbookName === null) {
                    return false;
                }
                const itemType = this.type === BladesActorType.crew ? BladesItemType.crew_ability : BladesItemType.ability;
                dialogData[this.playbookName] = this._processEmbeddedItemMatches(BladesItem.GetTypeWithTags(itemType, this.playbookName));
                dialogData.Veteran = this._processEmbeddedItemMatches(BladesItem.GetTypeWithTags(itemType))
                    .filter((item) => !item.hasTag(this.playbookName))
                    .map((item) => {
                    if (item.dialogCSSClasses) {
                        item.dialogCSSClasses = item.dialogCSSClasses.replace(/featured-item\s?/g, "");
                    }
                    return item;
                })
                    .sort((a, b) => {
                    if (a.system.world_name > b.system.world_name) {
                        return 1;
                    }
                    if (a.system.world_name < b.system.world_name) {
                        return -1;
                    }
                    return 0;
                });
                return dialogData;
            }
            case SelectionCategory.Upgrade: {
                dialogData.Main = this._processEmbeddedItemMatches(BladesItem.GetTypeWithTags(BladesItemType.crew_upgrade));
                return dialogData;
            }
        }
        return dialogData;
    }
    getSubItem(itemRef) {
        if (typeof itemRef === "string" && this.items.get(itemRef)) {
            return this.items.get(itemRef);
        }
        const globalItem = BladesItem.Get(itemRef);
        if (!globalItem) {
            return undefined;
        }
        return this.items.find((item) => item.system.world_name === globalItem.system.world_name);
    }
    async addSubItem(itemRef) {
        eLog.checkLog3("subitems", "[addSubItem] itemRef", itemRef);
        let BladesItemUniqueTypes;
        (function (BladesItemUniqueTypes) {
            BladesItemUniqueTypes["background"] = "background";
            BladesItemUniqueTypes["crew_playbook"] = "crew_playbook";
            BladesItemUniqueTypes["crew_reputation"] = "crew_reputation";
            BladesItemUniqueTypes["heritage"] = "heritage";
            BladesItemUniqueTypes["playbook"] = "playbook";
            BladesItemUniqueTypes["preferred_op"] = "preferred_op";
        })(BladesItemUniqueTypes || (BladesItemUniqueTypes = {}));
        let focusItem;
        const embeddedItem = this.getSubItem(itemRef);
        eLog.checkLog3("subitems", "[addSubItem] embeddedItem", embeddedItem);
        if (embeddedItem) {
            if (embeddedItem.hasTag(Tag.System.Archived)) {
                await embeddedItem.remTag(Tag.System.Archived);
                focusItem = embeddedItem;
                eLog.checkLog3("subitems", `[addSubItem] IS ARCHIVED EMBEDDED > Removing 'Archived' Tag, '${focusItem.id}':`, focusItem);
            }
            else {
                focusItem = await BladesItem.create([embeddedItem], { parent: this });
                eLog.checkLog3("subitems", `[addSubItem] IS ACTIVE EMBEDDED > Duplicating, focusItem '${focusItem.id}':`, focusItem);
            }
        }
        else {
            const globalItem = BladesItem.Get(itemRef);
            eLog.checkLog3("subitems", `[addSubItem] IS NOT EMBEDDED > Fetching Global, globalItem '${globalItem?.id}':`, globalItem);
            if (!globalItem) {
                return;
            }
            focusItem = await BladesItem.create([globalItem], { parent: this });
            focusItem = this.items.getName(globalItem.name);
            eLog.checkLog3("subitems", `[addSubItem] ... Duplicated, focusItem '${focusItem.id}'`, focusItem);
        }
        if (!focusItem) {
            return;
        }
        eLog.checkLog3("subitems", `[addSubItem] Checking Uniqueness of '${focusItem.id}'`, {
            BladesItemUniqueTypes: Object.values(BladesItemUniqueTypes),
            focusItemType: focusItem.type,
            isIncluded: Object.values(BladesItemUniqueTypes).includes(focusItem.type)
        });
        if (Object.values(BladesItemUniqueTypes).includes(focusItem.type)) {
            await Promise.all(this.activeSubItems
                .filter((subItem) => subItem.type === focusItem.type && subItem.id !== focusItem.id && !subItem.hasTag(Tag.System.Archived))
                .map((subItem) => this.remSubItem(subItem.id)));
        }
    }
    async remSubItem(itemRef) {
        const subItem = this.getSubItem(itemRef);
        if (!subItem) {
            return;
        }
        eLog.checkLog("actorTrigger", "Removing SubItem " + subItem.name, subItem);
        if (subItem.hasTag(Tag.System.Archived)) {
            return;
        }
        subItem.addTag(Tag.System.Archived);
    }
    async purgeSubItem(itemRef) {
        const subItem = this.getSubItem(itemRef);
        if (!subItem || subItem.hasTag(Tag.System.Archived)) {
            return;
        }
        subItem.delete();
    }
    parentActor;
    get isSubActor() { return this.parentActor !== undefined; }
    
    
    isMember(crew) { return this.crew?.id === crew.id; }
    get vices() {
        return this.activeSubItems.filter((item) => item.type === BladesItemType.vice);
    }
    get crew() {
        if (this.type !== BladesActorType.pc) {
            return undefined;
        }
        return this.activeSubActors.find((subActor) => subActor.type === BladesActorType.crew);
    }
    get members() {
        if (this.type !== BladesActorType.crew) {
            return undefined;
        }
        return BladesActor.GetTypeWithTags(BladesActorType.pc).filter((actor) => actor.isMember(this));
    }
    
    static async create(data, options = {}) {
        data.token = data.token || {};
        data.system = data.system ?? {};
        eLog.checkLog2("actor", "BladesActor.create(data,options)", { data, options });

        if ([BladesActorType.crew, BladesActorType.pc].includes(data.type)) {
            data.token.actorLink = true;
        }

        data.system.world_name = data.system.world_name ?? data.name.replace(/[^A-Za-z_0-9 ]/g, "")
            .trim()
            .replace(/ /g, "_");
        return super.create(data, options);
    }
    async _onCreateEmbeddedDocuments(embName, docs, ...args) {
        await super._onCreateEmbeddedDocuments(embName, docs, ...args);
        eLog.checkLog("actorTrigger", "onCreateEmbeddedDocuments", { embName, docs, args });
        docs.forEach(async (doc) => {
            if (doc instanceof BladesItem) {
                switch (doc.type) {
                    case BladesItemType.playbook: {
                        await this.update({
                            "system.trauma.active": Object.assign(Object.fromEntries(Object.keys(this.system.trauma.active).map((tCond) => [tCond, false])), Object.fromEntries((doc.system.trauma_conditions ?? []).map((tCond) => [tCond, true]))),
                            "system.trauma.checked": Object.assign(Object.fromEntries(Object.keys(this.system.trauma.checked).map((tCond) => [tCond, false])), Object.fromEntries((doc.system.trauma_conditions ?? []).map((tCond) => [tCond, false])))
                        });
                        break;
                    }
                }
            }
        });
    }
    async update(updateData, context, isSkippingSubActorCheck = false) {
        if (!updateData) {
            return undefined;
        }
        if (this.parentActor && !isSkippingSubActorCheck) {
            return this.parentActor.updateSubActor(this.id, updateData);
        }
        return super.update(updateData, context);
    }

    get playbookName() {
        return this.playbook?.name ?? null;
    }
    get playbook() {
        if (this.type === BladesActorType.pc) {
            return this.activeSubItems.find((item) => item.type === BladesItemType.playbook);
        }
        if (this.type === BladesActorType.crew) {
            return this.activeSubItems.find((item) => item.type === BladesItemType.crew_playbook);
        }
        return null;
    }
    get attributes() {
        return {
            insight: Object.values(this.system.attributes.insight).filter(({ value }) => value > 0).length + this.system.resistance_bonuses.insight,
            prowess: Object.values(this.system.attributes.prowess).filter(({ value }) => value > 0).length + this.system.resistance_bonuses.prowess,
            resolve: Object.values(this.system.attributes.resolve).filter(({ value }) => value > 0).length + this.system.resistance_bonuses.resolve
        };
    }
    get actions() {
        return U.objMap({
            ...this.system.attributes.insight,
            ...this.system.attributes.prowess,
            ...this.system.attributes.resolve
        }, ({ value, max }) => U.gsap.utils.clamp(0, max, value));
    }
    get rollable() {
        return {
            ...this.attributes,
            ...this.actions
        };
    }
    get trauma() {
        return Object.keys(this.system.trauma?.checked ?? {})
            .filter((traumaName) => {
            return this.system.trauma.active[traumaName] && this.system.trauma.checked[traumaName];
        })
            .length;
    }
    get traumaConditions() {
        return U.objFilter(this.system.trauma?.checked ?? {}, (v, traumaName) => Boolean(traumaName in this.system.trauma.active && this.system.trauma.active[traumaName]));
    }
    get currentLoad() {
        const activeLoadItems = this.activeSubItems.filter((item) => item.type === BladesItemType.item);
        return U.gsap.utils.clamp(0, 10, activeLoadItems
            .reduce((tot, i) => tot + (i.type === "item"
            ? U.pInt(i.system.load)
            : 0), 0));
    }
    get remainingLoad() {
        if (!this.system.loadout.selected) {
            return 0;
        }
        const maxLoad = this.system.loadout.levels[game.i18n.localize(this.system.loadout.selected).toLowerCase()];
        return Math.max(0, maxLoad - this.currentLoad);
    }

    rollAttributePopup(attribute_name) {
        const test = Actions;
        const attribute_label = U.tCase(attribute_name);
        let content = `
        <h2>${game.i18n.localize("BITD.Roll")} ${attribute_label}</h2>
        <form>
          <div class="form-group">
            <label>${game.i18n.localize("BITD.Modifier")}:</label>
            <select id="mod" name="mod">
              ${this.createListOfDiceMods(-3, +3, 0)}
            </select>
          </div>`;
        if ([...Object.keys(Attributes), ...Object.keys(Actions)].includes(attribute_name)) {
            content += `
            <div class="form-group">
              <label>${game.i18n.localize("BITD.Position")}:</label>
              <select id="pos" name="pos">
                <option value="controlled">${game.i18n.localize("BITD.PositionControlled")}</option>
                <option value="risky" selected>${game.i18n.localize("BITD.PositionRisky")}</option>
                <option value="desperate">${game.i18n.localize("BITD.PositionDesperate")}</option>
              </select>
            </div>
            <div class="form-group">
              <label>${game.i18n.localize("BITD.Effect")}:</label>
              <select id="fx" name="fx">
                <option value="limited">${game.i18n.localize("BITD.EffectLimited")}</option>
                <option value="standard" selected>${game.i18n.localize("BITD.EffectStandard")}</option>
                <option value="great">${game.i18n.localize("BITD.EffectGreat")}</option>
              </select>
            </div>`;
        }
        else {
            content += `
            <input id="pos" name="pos" type="hidden" value="">
            <input id="fx" name="fx" type="hidden" value="">`;
        }
        content += `
        <div className="form-group">
          <label>${game.i18n.localize("BITD.Notes")}:</label>
          <input id="note" name="note" type="text" value="">
        </div><br/>
        </form>
      `;
        new Dialog({
            "title": `${game.i18n.localize("BITD.Roll")} ${attribute_label}`,
            "content": content,
            "buttons": {
                yes: {
                    icon: "<i class='fas fa-check'></i>",
                    label: game.i18n.localize("BITD.Roll"),
                    callback: async (html) => {
                        if (html instanceof HTMLElement) {
                            html = $(html);
                        }
                        const modifier = parseInt(`${html.find('[name="mod"]').attr("value") ?? 0}`);
                        const position = `${html.find('[name="pos"]').attr("value") ?? Positions.risky}`;
                        const effect = `${html.find('[name="fx"]').attr("value") ?? EffectLevels.standard}`;
                        const note = `${html.find('[name="note"]').attr("value") ?? 0}`;
                        await this.rollAttribute(attribute_name, modifier, position, effect, note);
                    }
                },
                no: {
                    icon: "<i class='fas fa-times'></i>",
                    label: game.i18n.localize("Close")
                }
            },
            "default": "yes"
        }).render(true);
    }
    async rollAttribute(attribute_name, additional_dice_amount = 0, position = Positions.risky, effect = EffectLevels.standard, note) {
        bladesRoll(this.rollable[attribute_name] + additional_dice_amount, attribute_name, position, effect, note);
    }
    
    
    
    
    
    
        createListOfDiceMods(rs, re, s) {
        let text = "";
        if (s === "") {
            s = 0;
        }
        for (let i = rs; i <= re; i++) {
            let plus = "";
            if (i >= 0) {
                plus = "+";
            }
            text += `<option value="${i}"`;
            if (i === s) {
                text += " selected";
            }
            text += `>${plus}${i}d</option>`;
        }
        return text;
    }
    
    updateRandomizers() {
        const rStatus = {
            name: { size: 4, label: null },
            heritage: { size: 1, label: "Heritage" },
            gender: { size: 1, label: "Gender" },
            appearance: { size: 2, label: "Appearance" },
            goal: { size: 4, label: "Goal" },
            method: { size: 4, label: "Method" },
            profession: { size: 2, label: "Profession" },
            trait_1: { size: 1, label: null },
            trait_2: { size: 1, label: null },
            trait_3: { size: 1, label: null },
            interests: { size: 4, label: "Interests" },
            quirk: { size: 4, label: "Quirk" },
            style: { size: 2, label: "Style" }
        };
        const titleChance = 0.05;
        const suffixChance = 0.01;
        function sampleArray(arr, curVals = [], numVals = 1) {
            arr = arr.filter((elem) => !curVals.includes(elem));
            if (!arr.length) {
                return [];
            }
            const returnVals = [];
            while (returnVals.length < numVals) {
                arr = arr.filter((elem) => ![...curVals, ...returnVals].includes(elem));
                if (!arr.length) {
                    return returnVals;
                }
                returnVals.push(arr[Math.floor(Math.random() * arr.length)]);
            }
            return returnVals;
        }
        const randomGen = {
            name: (gender) => {
                return [
                    Math.random() <= titleChance
                        ? sampleArray(Randomizers.name_title)
                        : "",
                    sampleArray([
                        ...((gender ?? "").charAt(0).toLowerCase() !== "m" ? Randomizers.name_first.female : []),
                        ...((gender ?? "").charAt(0).toLowerCase() !== "f" ? Randomizers.name_first.male : [])
                    ]),
                    `"${sampleArray(Randomizers.name_alias)}"`,
                    sampleArray(Randomizers.name_surname),
                    Math.random() <= suffixChance
                        ? sampleArray(Randomizers.name_suffix)
                        : ""
                ].filter((val) => Boolean(val)).join(" ");
            },
            gender: () => sampleArray(Randomizers.gender)[0],
            heritage: () => sampleArray(Randomizers.heritage)[0],
            appearance: () => sampleArray(Randomizers.appearance)[0],
            goal: () => sampleArray(Randomizers.goal, [this.system.randomizers.goal.value])[0],
            method: () => sampleArray(Randomizers.method, [this.system.randomizers.goal.value])[0],
            profession: () => sampleArray(Randomizers.profession, [this.system.randomizers.goal.value])[0],
            trait: () => sampleArray(Randomizers.trait, [this.system.randomizers.trait_1.value, this.system.randomizers.trait_2.value, this.system.randomizers.trait_3.value], 1),
            interests: () => sampleArray(Randomizers.interests)[0],
            quirk: () => sampleArray(Randomizers.quirk)[0],
            style: (gender) => sampleArray([
                ...((gender ?? "").charAt(0).toLowerCase() !== "m" ? Randomizers.style.female : []),
                ...((gender ?? "").charAt(0).toLowerCase() !== "f" ? Randomizers.style.male : [])
            ], [this.system.randomizers.style.value])[0]
        };
        const gender = this.system.randomizers.gender.isLocked ? this.system.randomizers.gender.value : randomGen.gender();
        const updateKeys = Object.keys(this.system.randomizers).filter((key) => !this.system.randomizers[key].isLocked);
        const updateData = {};
        let isUpdatingTraits = false;
        updateKeys.forEach((key) => {
            switch (key) {
                case "gender": {
                    updateData[`system.randomizers.${key}`] = {
                        isLocked: this.system.randomizers.gender.isLocked,
                        ...rStatus[key],
                        value: gender
                    };
                    break;
                }
                case "trait_1":
                case "trait_2":
                case "trait_3": {
                    isUpdatingTraits = true;
                    break;
                }
                default: {
                    const randomVal = randomGen[key]();
                    updateData[`system.randomizers.${key}`] = {
                        isLocked: false,
                        ...rStatus[key],
                        value: randomVal || this.system.randomizers[key].value
                    };
                    break;
                }
            }
        });
        if (isUpdatingTraits) {
            const trait1 = this.system.randomizers.trait_1.isLocked
                ? this.system.randomizers.trait_1.value
                : sampleArray(Randomizers.trait, [this.system.randomizers.trait_1.value, this.system.randomizers.trait_2.value, this.system.randomizers.trait_3.value], 1)[0];
            const trait2 = this.system.randomizers.trait_2.isLocked
                ? this.system.randomizers.trait_2.value
                : sampleArray(Randomizers.trait, [trait1, this.system.randomizers.trait_1.value, this.system.randomizers.trait_2.value, this.system.randomizers.trait_3.value], 1)[0];
            const trait3 = this.system.randomizers.trait_3.isLocked
                ? this.system.randomizers.trait_3.value
                : sampleArray(Randomizers.trait, [trait1, trait2, this.system.randomizers.trait_1.value, this.system.randomizers.trait_2.value, this.system.randomizers.trait_3.value], 1)[0];
            if (!this.system.randomizers.trait_1.isLocked) {
                updateData["system.randomizers.trait_1"] = {
                    isLocked: false,
                    ...rStatus.trait_1,
                    value: trait1
                };
            }
            if (!this.system.randomizers.trait_2.isLocked) {
                updateData["system.randomizers.trait_2"] = {
                    isLocked: false,
                    ...rStatus.trait_2,
                    value: trait2
                };
            }
            if (!this.system.randomizers.trait_3.isLocked) {
                updateData["system.randomizers.trait_3"] = {
                    isLocked: false,
                    ...rStatus.trait_3,
                    value: trait3
                };
            }
        }
        return this.update(updateData);
    }
}
export default BladesActor;