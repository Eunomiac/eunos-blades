/* ****▌███████████████████████████████████████████████████████████████████████████▐**** *\
|*     ▌████░░░░░░░░░░░ Euno's Blades in the Dark for Foundry VTT ░░░░░░░░░░░░░████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░ by Eunomiac ░░░░░░░░░░░░░██████████████████▐     *|
|*     ▌████████████████████████████  License █ v0.1.0 ████████████████████████████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░░░░░░  ░░░░░░░░░░░░░░░░░░███████████████████▐     *|
\* ****▌███████████████████████████████████████████████████████████████████████████▐**** */

import U from "./core/utilities.js";
import C, { BladesActorType, Tag, Playbook, BladesItemType, Attribute, Action, PrereqType, Position, Effect, AdvancementPoint, Randomizers, RollModCategory, RollModStatus, Factor } from "./core/constants.js";
import { bladesRoll } from "./blades-roll.js";
import BladesItem from "./blades-item.js";
import { SelectionCategory } from "./blades-dialog.js";
import BladesRollCollab from "./blades-roll-collab.js";
class BladesActor extends Actor {
    static async CleanData(actor) {
        if (!actor) {
            return Promise.all(BladesActor.All.map(BladesActor.CleanData));
        }
        if (BladesActor.IsType(actor, BladesActorType.pc, BladesActorType.crew)) {
            return undefined;
        }
        const flatSchema = flattenObject(game.model.Actor[actor.type]);
        for (const dotKey of Object.keys(flatSchema)) {
            flatSchema[dotKey] = getProperty(actor.system, dotKey);
        }
        await BladesActor.create({ name: actor.name, img: actor.img, type: actor.type, system: flatSchema });
        return actor.delete();
    }

    static async create(data, options = {}) {
        data.token = data.token || {};
        data.system = data.system ?? {};
        eLog.checkLog2("actor", "BladesActor.create(data,options)", { data, options });

        if ([BladesActorType.crew, BladesActorType.pc].includes(data.type)) {
            data.token.actorLink = true;
        }

        data.system.world_name = data.system.world_name ?? data.name.replace(/[^A-Za-z_0-9 ]/g, "").trim().replace(/ /g, "_");

        if (data.type === BladesActorType.pc) {
            data.system.experience = {
                playbook: { value: 0, max: 8 },
                insight: { value: 0, max: 6 },
                prowess: { value: 0, max: 6 },
                resolve: { value: 0, max: 6 },
                clues: [],
                ...data.system.experience ?? {}
            };
        }
        if (data.type === BladesActorType.crew) {
            data.system.experience = {
                playbook: { value: 0, max: 8 },
                clues: [],
                ...data.system.experience ?? {}
            };
        }
        return super.create(data, options);
    }

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
    static IsType(doc, ...types) {
        const typeSet = new Set(types);
        return doc instanceof BladesActor && typeSet.has(doc.type);
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
        eLog.checkLog2("actor", "BladesActor.addTag(...tags)", { tags, curTags });
        this.update({ "system.tags": curTags });
    }
    async remTag(...tags) {
        const curTags = this.tags.filter((tag) => !tags.includes(tag));
        eLog.checkLog2("actor", "BladesActor.remTag(...tags)", { tags, curTags });
        this.update({ "system.tags": curTags });
    }
    get tooltip() {
        const tooltipText = [this.system.concept, this.system.subtitle]
            .filter(Boolean)
            .join("<br><br>");
        return tooltipText ? (new Handlebars.SafeString(tooltipText)).toString() : undefined;
    }
    get dialogCSSClasses() { return ""; }
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
        }
        return 0;
    }

    get primaryUser() {
        return game.users?.find((user) => user.character?.id === this?.id) || null;
    }
    async clearLoadout() {
        this.update({ "system.loadout.selected": "" });
        this.updateEmbeddedDocuments("Item", [
            ...this.activeSubItems.filter((item) => BladesItem.IsType(item, BladesItemType.gear) && !item.hasTag(Tag.System.Archived))
                .map((item) => ({
                "_id": item.id,
                "system.tags": [...item.tags, Tag.System.Archived],
                "system.uses_per_score.value": 0
            })),
            ...this.activeSubItems.filter((item) => BladesItem.IsType(item, BladesItemType.ability) && item.system.uses_per_score.max)
                .map((item) => ({
                "_id": item.id,
                "system.uses_per_score.value": 0
            }))
        ]);
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
        return globalActors
            .filter(this.checkActorPrereqs)
            .filter((gActor) => !this.activeSubActors.some((aActor) => aActor.id === gActor.id))
            .map((gActor) => this.getSubActor(gActor) || gActor)
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
    getDialogActors(category) {
                
        const dialogData = {};
        switch (category) {
            case SelectionCategory.Contact:
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
                if (!this.vice?.name) {
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
    async addSubActor(actorRef, tags) {
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
            const subActorData = {};
            if (tags) {
                subActorData.tags = U.unique([
                    ...actor.tags,
                    ...tags
                ]);
            }
            await this.update({ [`system.subactors.${actor.id}`]: subActorData });
            focusSubActor = this.getSubActor(actor.id);
        }
        if (!focusSubActor) {
            return;
        }
        const uniqueTags = focusSubActor.tags.filter((tag) => tag in BladesActorUniqueTags);
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
        if (!BladesActor.IsType(actor, BladesActorType.npc, BladesActorType.faction)) {
            return actor;
        }
        const subActorData = this.system.subactors[actor.id] ?? {};
        Object.assign(actor.system, mergeObject(actor.system, subActorData));
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
        updateData = U.objExpand(updateData);
        if (!updateData.system) {
            return undefined;
        }
        const actor = BladesActor.Get(actorRef);
        if (!actor) {
            return undefined;
        }
        const diffUpdateSystem = U.objDiff(actor.system, updateData.system);
        const mergedSubActorSystem = U.objMerge(this.system.subactors[actor.id] ?? {}, diffUpdateSystem, { isReplacingArrays: true, isConcatenatingArrays: false });
        if (JSON.stringify(this.system.subactors[actor.id]) === JSON.stringify(mergedSubActorSystem)) {
            return undefined;
        }
        return this.update({ [`system.subactors.${actor.id}`]: null }, undefined, true)
            .then(() => this.update({ [`system.subactors.${actor.id}`]: mergedSubActorSystem }, undefined, true))
            .then(() => actor.sheet?.render());
    }
    
    async remSubActor(actorRef) {
        const subActor = this.getSubActor(actorRef);
        if (!subActor) {
            return;
        }
        this.update({ ["system.subactors"]: mergeObject(this.system.subactors, { [`-=${subActor.id}`]: null }) }, undefined, true);
    }
    async clearSubActors(isReRendering = true) {
        this.subActors.forEach((subActor) => {
            if (subActor.parentActor?.id === this.id) {
                subActor.clearParentActor(isReRendering);
            }
        });
        this.sheet?.render();
    }
    async clearParentActor(isReRendering = true) {
        const { parentActor } = this;
        if (!parentActor) {
            return;
        }
        this.parentActor = undefined;
        this.system = this._source.system;
        this.ownership = this._source.ownership;
        this.prepareData();
        if (isReRendering) {
            this.sheet?.render();
        }
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
            return gItem.hasTag(Tag.System.MultiplesOK) || (gItem.system.max_per_score ?? 1) > this.activeSubItems.filter((sItem) => sItem.system.world_name === gItem.system.world_name).length;
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
                dialogData.Main = this._processEmbeddedItemMatches(BladesItem.GetTypeWithTags(BladesItemType.vice, this.playbookName));
                return dialogData;
            }
            case SelectionCategory.Playbook: {
                switch (this.type) {
                    case BladesActorType.pc: {
                        dialogData.Basic = this._processEmbeddedItemMatches(BladesItem.GetTypeWithTags(BladesItemType.playbook).filter((item) => !item.hasTag(Tag.Gear.Advanced)));
                        dialogData.Advanced = this._processEmbeddedItemMatches(BladesItem.GetTypeWithTags(BladesItemType.playbook, Tag.Gear.Advanced));
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
            case SelectionCategory.Preferred_Op: {
                dialogData.Main = this._processEmbeddedItemMatches(BladesItem.GetTypeWithTags(BladesItemType.preferred_op, this.playbookName));
                return dialogData;
            }
            case SelectionCategory.Gear: {
                if (this.type !== BladesActorType.pc || this.playbookName === null) {
                    return false;
                }
                const gearItems = this._processEmbeddedItemMatches([
                    ...BladesItem.GetTypeWithTags(BladesItemType.gear, this.playbookName),
                    ...BladesItem.GetTypeWithTags(BladesItemType.gear, Tag.Gear.General)
                ])
                    .filter((item) => this.remainingLoad >= item.system.load);
                dialogData[this.playbookName] = gearItems.filter((item) => item.hasTag(this.playbookName));
                dialogData.General = gearItems
                    .filter((item) => item.hasTag(Tag.Gear.General))
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
                if (this.type === BladesActorType.pc) {
                    dialogData[this.playbookName] = this._processEmbeddedItemMatches(BladesItem.GetTypeWithTags(BladesItemType.ability, this.playbookName));
                    dialogData.Veteran = this._processEmbeddedItemMatches(BladesItem.GetTypeWithTags(BladesItemType.ability))
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
                }
                else {
                    dialogData.Main = this._processEmbeddedItemMatches(BladesItem.GetTypeWithTags(BladesItemType.crew_ability, this.playbookName));
                }
                return dialogData;
            }
            case SelectionCategory.Upgrade: {
                if (this.playbookName === null) {
                    return false;
                }
                dialogData[this.playbookName] = this._processEmbeddedItemMatches(BladesItem.GetTypeWithTags(BladesItemType.crew_upgrade, this.playbookName));
                dialogData.General = this._processEmbeddedItemMatches(BladesItem.GetTypeWithTags(BladesItemType.crew_upgrade, Tag.Gear.General));
                return dialogData;
            }
        }
        return dialogData;
    }
    getSubItem(itemRef, activeOnly = false) {
        if (typeof itemRef === "string" && this.items.get(itemRef)) {
            return this.items.get(itemRef);
        }
        const globalItem = BladesItem.Get(itemRef);
        if (!globalItem) {
            return undefined;
        }
        return this.items.find((item) => item.name === globalItem.name) ?? this.items.find((item) => item.system.world_name === globalItem.system.world_name);
    }
    hasSubItemOf(itemRef) {
        const item = BladesItem.Get(itemRef);
        if (!item) {
            return false;
        }
        return Boolean(this.items.find((i) => i.system.world_name === item.system.world_name));
    }
    hasActiveSubItemOf(itemRef) {
        const item = BladesItem.Get(itemRef);
        if (!item) {
            return false;
        }
        return Boolean(this.items.find((i) => !i.hasTag(Tag.System.Archived) && i.system.world_name === item.system.world_name));
    }
    async addSubItem(itemRef) {
        eLog.checkLog3("subitems", "[addSubItem] itemRef", itemRef);
        let BladesItemUniqueTypes;
        (function (BladesItemUniqueTypes) {
            BladesItemUniqueTypes["background"] = "background";
            BladesItemUniqueTypes["vice"] = "vice";
            BladesItemUniqueTypes["crew_playbook"] = "crew_playbook";
            BladesItemUniqueTypes["crew_reputation"] = "crew_reputation";
            BladesItemUniqueTypes["heritage"] = "heritage";
            BladesItemUniqueTypes["playbook"] = "playbook";
            BladesItemUniqueTypes["preferred_op"] = "preferred_op";
        })(BladesItemUniqueTypes || (BladesItemUniqueTypes = {}));
        let focusItem;
        const embeddedItem = this.getSubItem(itemRef);
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
            eLog.checkLog3("subitems", `[addSubItem] ... NEWLY EMBEDDED, focusItem '${focusItem.id}'`, focusItem);
        }
        if (!focusItem) {
            return;
        }
        eLog.checkLog3("subitems", `[addSubItem] Checking Uniqueness of '${focusItem.id}'`, {
            BladesItemUniqueTypes: Object.values(BladesItemUniqueTypes),
            focusItemType: focusItem.type,
            isLimited: Object.values(BladesItemUniqueTypes).includes(focusItem.type)
        });
        if (Object.values(BladesItemUniqueTypes).includes(focusItem.type)) {
            await Promise.all(this.activeSubItems
                .filter((subItem) => subItem.type === focusItem.type && subItem.system.world_name !== focusItem.system.world_name && !subItem.hasTag(Tag.System.Archived))
                .map(this.remSubItem.bind(this)));
        }
    }
    async remSubItem(itemRef) {
        const subItem = this.getSubItem(itemRef);
        if (!subItem) {
            return;
        }
        if (subItem.type !== BladesItemType.gear) {
            this.purgeSubItem(itemRef);
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
        
    async grantAdvancementPoints(allowedTypes, amount = 1) {
        const aPtKey = Array.isArray(allowedTypes)
            ? allowedTypes.sort().join("_")
            : allowedTypes;
        this.update({ [`system.advancement_points.${aPtKey}`]: (this.system.advancement_points?.[aPtKey] ?? 0) + amount });
    }
    async removeAdvancementPoints(allowedTypes, amount = 1) {
        const aPtKey = Array.isArray(allowedTypes)
            ? allowedTypes.sort().join("_")
            : allowedTypes;
        const newCount = this.system.advancement_points?.[aPtKey] ?? 0 - amount;
        if (newCount <= 0 && aPtKey in (this.system.advancement_points ?? [])) {
            return this.update({ [`system.advancement_points.-=${aPtKey}`]: null });
        }
        return this.update({ [`system.advancement_points.${aPtKey}`]: newCount });
    }
    getAvailableAdvancements(trait) {
        if (!BladesActor.IsType(this, BladesActorType.pc, BladesActorType.crew)) {
            return 0;
        }
        if (trait in Action) {
            return 1;
        }
        if (trait === "Cohort") {
            const pointsCohort = this.system.advancement_points?.[AdvancementPoint.Cohort] ?? 0;
            const spentCohort = this.cohorts.length;
            return Math.max(0, pointsCohort - spentCohort);
        }
        const pointsAbility = this.system.advancement_points?.[AdvancementPoint.Ability] ?? 0;
        const pointsCohortType = this.system.advancement_points?.[AdvancementPoint.CohortType] ?? 0;
        const pointsUpgrade = this.system.advancement_points?.[AdvancementPoint.Upgrade] ?? 0;
        const pointsUpgradeOrAbility = this.system.advancement_points?.[AdvancementPoint.UpgradeOrAbility] ?? 0;
        const spentAbility = U.sum(this.items
            .filter((item) => BladesItem.IsType(item, BladesItemType.ability, BladesItemType.crew_ability))
            .map((abil) => abil.system.price ?? 1));
        const spentCohortType = U.sum(this.cohorts.map((cohort) => Math.max(0, U.unique(Object.values(cohort.system.subtypes)).length - 1)));
        const spentUpgrade = U.sum(this.items
            .filter((item) => BladesItem.IsType(item, BladesItemType.crew_upgrade))
            .map((upgrade) => upgrade.system.price ?? 1));
        const excessUpgrade = Math.max(0, spentUpgrade - pointsUpgrade);
        const excessCohortType = Math.max(0, spentCohortType - pointsCohortType);
        const excessAbility = Math.max(0, spentAbility - pointsAbility);
        const remainingAbility = Math.max(0, pointsAbility - spentAbility);
        const remainingCohortType = Math.max(0, pointsCohortType - spentCohortType);
        const remainingUpgrade = Math.max(0, pointsUpgrade - spentUpgrade);
        const remainingUpgradeOrAbility = Math.max(0, pointsUpgradeOrAbility - excessUpgrade - (2 * excessAbility) - (2 * excessCohortType));
        if (trait === "Ability") {
            return remainingAbility + Math.floor(0.5 * remainingUpgradeOrAbility);
        }
        if (trait === "Upgrade") {
            return remainingUpgrade + remainingUpgradeOrAbility;
        }
        if (trait === "CohortType") {
            return remainingCohortType + remainingUpgradeOrAbility;
        }
        return 0;
    }
    get availableAbilityPoints() { return this.getAvailableAdvancements("Ability"); }
    get availableUpgradePoints() { return this.getAvailableAdvancements("Upgrade"); }
    get availableCohortPoints() { return this.getAvailableAdvancements("Cohort"); }
    get availableCohortTypePoints() { return this.getAvailableAdvancements("CohortType"); }
    get canPurchaseAbility() { return this.availableAbilityPoints > 0; }
    get canPurchaseUpgrade() { return this.availableUpgradePoints > 0; }
    get canPurchaseCohort() { return this.availableCohortPoints > 0; }
    get canPurchaseCohortType() { return this.availableCohortTypePoints > 0; }
    async advancePlaybook() {
        if (!this.playbook) {
            return undefined;
        }
        await this.update({ "system.experience.playbook.value": 0 });
        switch (this.type) {
            case BladesActorType.pc: {
                game.eunoblades.PushController.pushToAll("GM", `${this.name} Advances their Playbook!`, `${this.name}, select a new Ability on your Character Sheet.`);
                return this.grantAdvancementPoints(AdvancementPoint.Ability);
            }
            case BladesActorType.crew: {
                game.eunoblades.PushController.pushToAll("GM", `${this.name} Advances their Playbook!`, "Select new Upgrades and/or Abilities on your Crew Sheet.");
                this.members.forEach((member) => {
                    const coinGained = this.system.tier.value + 2;
                    game.eunoblades.PushController.pushToAll("GM", `${member.name} Gains ${coinGained} Stash (Crew Advancement)`, undefined);
                    member.addStash(coinGained);
                });
                return this.grantAdvancementPoints(AdvancementPoint.UpgradeOrAbility, 2);
            }
            default: return undefined;
        }
    }
    async advanceAttribute(attribute) {
        await this.update({ [`system.experience.${attribute}.value`]: 0 });
        const actions = C.Action[attribute].map((action) => `<strong>${U.tCase(action)}</strong>`);
        game.eunoblades.PushController.pushToAll("GM", `${this.name} Advances their ${U.uCase(attribute)}!`, `${this.name}, add a dot to one of ${U.oxfordize(actions, true, "or")}.`);
    }
    
    
    
    parentActor;
    get isSubActor() { return this.parentActor !== undefined; }
    
    
    isMember(crew) { return this.crew?.id === crew.id; }
    get vice() {
        if (this.type !== BladesActorType.pc) {
            return undefined;
        }
        return this.activeSubItems.find((item) => item.type === BladesItemType.vice);
    }
    get crew() {
        if (this.type !== BladesActorType.pc) {
            return undefined;
        }
        return this.activeSubActors.find((subActor) => subActor.type === BladesActorType.crew);
    }
    get abilities() {
        if (!this.playbook) {
            return [];
        }
        if (![BladesActorType.pc, BladesActorType.crew].includes(this.type)) {
            return [];
        }
        return this.activeSubItems.filter((item) => [BladesItemType.ability, BladesItemType.crew_ability].includes(item.type));
    }
    get playbookName() {
        return this.playbook?.name;
    }
    get playbook() {
        if (BladesActor.IsType(this, BladesActorType.pc)) {
            return this.activeSubItems.find((item) => item.type === BladesItemType.playbook);
        }
        if (BladesActor.IsType(this, BladesActorType.crew)) {
            return this.activeSubItems.find((item) => item.type === BladesItemType.crew_playbook);
        }
        return undefined;
    }
    get attributes() {
        if (!BladesActor.IsType(this, BladesActorType.pc)) {
            return undefined;
        }
        return {
            insight: Object.values(this.system.attributes.insight).filter(({ value }) => value > 0).length + this.system.resistance_bonus.insight,
            prowess: Object.values(this.system.attributes.prowess).filter(({ value }) => value > 0).length + this.system.resistance_bonus.prowess,
            resolve: Object.values(this.system.attributes.resolve).filter(({ value }) => value > 0).length + this.system.resistance_bonus.resolve
        };
    }
    get actions() {
        if (!BladesActor.IsType(this, BladesActorType.pc)) {
            return undefined;
        }
        return U.objMap({
            ...this.system.attributes.insight,
            ...this.system.attributes.prowess,
            ...this.system.attributes.resolve
        }, ({ value, max }) => U.gsap.utils.clamp(0, max, value));
    }
    get rollable() {
        if (!BladesActor.IsType(this, BladesActorType.pc)) {
            return undefined;
        }
        return {
            ...this.attributes,
            ...this.actions
        };
    }
    get trauma() {
        if (!BladesActor.IsType(this, BladesActorType.pc)) {
            return 0;
        }
        return Object.keys(this.system.trauma.checked)
            .filter((traumaName) => {
            return this.system.trauma.active[traumaName] && this.system.trauma.checked[traumaName];
        })
            .length;
    }
    get traumaList() {
        return BladesActor.IsType(this, BladesActorType.pc) ? Object.keys(this.system.trauma.active).filter((key) => this.system.trauma.active[key]) : [];
    }
    get activeTraumaConditions() {
        if (!BladesActor.IsType(this, BladesActorType.pc)) {
            return {};
        }
        return U.objFilter(this.system.trauma.checked, 
        (v, traumaName) => Boolean(traumaName in this.system.trauma.active && this.system.trauma.active[traumaName]));
    }
    get currentLoad() {
        if (!BladesActor.IsType(this, BladesActorType.pc)) {
            return 0;
        }
        const activeLoadItems = this.activeSubItems.filter((item) => item.type === BladesItemType.gear);
        return U.gsap.utils.clamp(0, 10, activeLoadItems.reduce((tot, i) => tot + U.pInt(i.system.load), 0));
    }
    get remainingLoad() {
        if (!BladesActor.IsType(this, BladesActorType.pc)) {
            return 0;
        }
        if (!this.system.loadout.selected) {
            return 0;
        }
        const maxLoad = this.system.loadout.levels[game.i18n.localize(this.system.loadout.selected.toString()).toLowerCase()];
        return Math.max(0, maxLoad - this.currentLoad);
    }
    async addStash(amount) {
        if (!BladesActor.IsType(this, BladesActorType.pc)) {
            return undefined;
        }
        return this.update({ "system.stash.value": Math.min(this.system.stash.value + amount, this.system.stash.max) });
    }
    
    get members() {
        if (this.type !== BladesActorType.crew) {
            return [];
        }
        return BladesActor.GetTypeWithTags(BladesActorType.pc).filter((actor) => actor.isMember(this));
    }
    get contacts() {
        if (this.type !== BladesActorType.crew || !this.playbook) {
            return [];
        }
        return this.activeSubActors.filter((actor) => actor.hasTag(this.playbookName));
    }
    get claims() {
        if (this.type !== BladesActorType.crew || !this.playbook) {
            return {};
        }
        return this.playbook.system.turfs;
    }
    get turfCount() {
        if (this.type !== BladesActorType.crew || !this.playbook) {
            return 0;
        }
        return Object.values(this.playbook.system.turfs)
            .filter((claim) => claim.isTurf && claim.value).length;
    }
    get upgrades() {
        if (this.type !== BladesActorType.crew || !this.playbook) {
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
    get rollMods() {
        const { roll_mods } = this.system;
        if (!roll_mods) {
            return [];
        }
        const rollMods = [];
        roll_mods.forEach((modString) => {
            const pStrings = modString.split(/@/);
            const nameString = U.pullElement(pStrings, (v) => typeof v === "string" && /^na/i.test(v));
            const nameVal = (typeof nameString === "string" && nameString.replace(/^.*:/, ""));
            if (!nameVal) {
                throw new Error(`RollMod Missing Name: '${modString}'`);
            }
            const catString = U.pullElement(pStrings, (v) => typeof v === "string" && /^cat/i.test(v));
            const catVal = (typeof catString === "string" && catString.replace(/^.*:/, ""));
            if (!catVal || !(catVal in RollModCategory)) {
                throw new Error(`RollMod Missing Category: '${modString}'`);
            }
            const posNegString = (U.pullElement(pStrings, (v) => typeof v === "string" && /^p/i.test(v)) || "posNeg:positive");
            const posNegVal = posNegString.replace(/^.*:/, "");
            const rollMod = {
                name: nameVal,
                category: catVal,
                status: RollModStatus.ToggledOff,
                modType: "general",
                value: 1,
                posNeg: posNegVal,
                tooltip: ""
            };
            pStrings.forEach((pString) => {
                const [keyString, valString] = pString.split(/:/);
                const val = /\|/.test(valString) ? valString.split(/\|/) : valString;
                let key;
                if (/^stat/i.test(keyString)) {
                    key = "status";
                }
                else if (/^val/i.test(keyString)) {
                    key = "value";
                }
                else if (/^eff|^ekey/i.test(keyString)) {
                    key = "effectKey";
                }
                else if (/^side|^ss/i.test(keyString)) {
                    key = "sideString";
                }
                else if (/^tool|^tip/i.test(keyString)) {
                    key = "tooltip";
                }
                else if (/^ty/i.test(keyString)) {
                    key = "modType";
                }
                else if (/^c.*r?.*ty/i.test(keyString)) {
                    key = "conditionalRollTypes";
                }
                else if (/^a.*r?.*y/i.test(keyString)) {
                    key = "autoRollTypes";
                }
                else if (/^c.*r?.*tr/i.test(keyString)) {
                    key = "conditionalRollTraits";
                }
                else if (/^a.*r?.*tr/i.test(keyString)) {
                    key = "autoRollTraits";
                }
                else {
                    throw new Error(`Bad Roll Mod Key: ${keyString}`);
                }
                Object.assign(rollMod, { [key]: ["value"].includes(key)
                        ? U.pInt(val)
                        : (["effectKey", "conditionalRollTypes", "autoRollTypes,", "conditionalRollTraits", "autoRollTraits"].includes(key)
                            ? [val].flat()
                            : val) });
            });
            if (rollMod.status === RollModStatus.Conditional
                || ((rollMod.conditionalRollTypes?.length ?? 0)
                    + (rollMod.conditionalRollTraits?.length ?? 0)
                    + (rollMod.autoRollTypes?.length ?? 0)
                    + (rollMod.autoRollTraits?.length ?? 0) > 0)) {
                rollMod.isConditional = true;
                rollMod.status = RollModStatus.Conditional;
            }
            BladesRollCollab.MergeInRollMod(rollMod, rollMods);
        });
        [[/1d/, RollModCategory.roll], [/Less Effect/, RollModCategory.effect]].forEach(([effectPat, effectCat]) => {
            const { one: harmConditionOne, two: harmConditionTwo } = Object.values(this.system.harm ?? {})
                .find((harmData) => effectPat.test(harmData.effect)) ?? {};
            const harmString = U.objCompact([harmConditionOne, harmConditionTwo === "" ? null : harmConditionTwo]).join(" & ");
            if (harmString.length > 0) {
                BladesRollCollab.MergeInRollMod({
                    name: harmString,
                    category: effectCat,
                    posNeg: "negative",
                    status: RollModStatus.ToggledOn,
                    modType: "harm",
                    value: 1,
                    tooltip: [
                        `<h1 class='red-bright'><strong>Harm:</strong> ${harmString}</h1>`,
                        effectCat === RollModCategory.roll
                            ? "<p>If your injuries apply to the situation at hand, you suffer <strong class='red-bright'>−1d</strong> to your roll.</p>"
                            : "<p>If your injuries apply to the situation at hand, you suffer <strong class='red-bright'>−1 effect</strong>."
                    ].join("")
                }, rollMods);
            }
        });
        
        return rollMods;
    }
    get rollFactors() {
        return {
            [Factor.tier]: {
                name: Factor.tier,
                value: this.getFactorTotal(Factor.tier),
                max: this.getFactorTotal(Factor.tier),
                cssClasses: "factor-gold factor-main",
                isActive: true,
                isDominant: false,
                highFavorsPC: true
            }
        };
    }
    get rollOppImg() { return this.img ?? undefined; }
    
    prepareDerivedData() {
        if (BladesActor.IsType(this, BladesActorType.pc)) {
            this._preparePCData(this.system);
        }
        if (BladesActor.IsType(this, BladesActorType.crew)) {
            this._prepareCrewData(this.system);
        }
        if (BladesActor.IsType(this, BladesActorType.npc)) {
            this._prepareNPCData(this.system);
        }
        if (BladesActor.IsType(this, BladesActorType.faction)) {
            this._prepareFactionData(this.system);
        }
    }
    _preparePCData(system) {
        if (!BladesActor.IsType(this, BladesActorType.pc)) {
            return;
        }
        if (this.playbook) {
            system.experience.clues = [...system.experience.clues, ...Object.values(this.playbook.system.experience_clues).filter((clue) => Boolean(clue.trim()))];
        }
        if (this.playbook) {
            system.gather_info = [...system.gather_info, ...Object.values(this.playbook.system.gather_info_questions).filter((question) => Boolean(question.trim()))];
        }
    }
    _prepareCrewData(system) {
        if (!BladesActor.IsType(this, BladesActorType.crew)) {
            return;
        }
        if (this.playbook) {
            system.experience.clues = [...system.experience.clues, ...Object.values(this.playbook.system.experience_clues).filter((clue) => Boolean(clue.trim()))];
            system.turfs = this.playbook.system.turfs;
        }
    }
    _prepareNPCData(system) {
        if (!BladesActor.IsType(this, BladesActorType.npc)) {
            return;
        }
    }
    _prepareFactionData(system) {
        if (!BladesActor.IsType(this, BladesActorType.faction)) {
            return;
        }
    }
    
    async _onCreateDescendantDocuments(parent, collection, docs, data, options, userId) {
        docs.forEach(async (doc) => {
            if (doc instanceof BladesItem && [BladesItemType.playbook, BladesItemType.crew_playbook].includes(doc.type)) {
                await Promise.all(this.activeSubItems
                    .filter((aItem) => aItem.type === doc.type && aItem.system.world_name !== doc.system.world_name)
                    .map((aItem) => this.remSubItem(aItem)));
            }
        });
        await super._onCreateDescendantDocuments(parent, collection, docs, data, options, userId);
        eLog.checkLog("actorTrigger", "_onCreateDescendantDocuments", { parent, collection, docs, data, options, userId });
        docs.forEach(async (doc) => {
            if (doc instanceof BladesItem) {
                switch (doc.type) {
                    case BladesItemType.vice: {
                        if (!BladesActor.IsType(this, BladesActorType.pc)) {
                            return;
                        }
                        this.activeSubActors
                            .filter((subActor) => subActor.hasTag(Tag.NPC.VicePurveyor) && !subActor.hasTag(doc.name))
                            .forEach((subActor) => this.remSubActor(subActor));
                        break;
                    }
                }
            }
        });
    }
    async update(updateData, context, isSkippingSubActorCheck = false) {
        if (!updateData) {
            return super.update(updateData);
        }
        switch (this.type) {
            case BladesActorType.pc: break;
            case BladesActorType.crew: {
                if (!this.playbook) {
                    return undefined;
                }
                eLog.checkLog("actorTrigger", "Updating Crew", { updateData });
                const playbookUpdateData = Object.fromEntries(Object.entries(flattenObject(updateData))
                    .filter(([key, _]) => key.startsWith("system.turfs.")));
                updateData = Object.fromEntries(Object.entries(flattenObject(updateData))
                    .filter(([key, _]) => !key.startsWith("system.turfs.")));
                eLog.checkLog("actorTrigger", "Updating Crew", { crewUpdateData: updateData, playbookUpdateData });
                const diffPlaybookData = diffObject(flattenObject(this.playbook), playbookUpdateData);
                delete diffPlaybookData._id;
                if (!U.isEmpty(diffPlaybookData)) {
                    await this.playbook.update(playbookUpdateData, context)
                        .then(() => this.sheet?.render(false));
                }
                break;
            }
            case BladesActorType.npc:
            case BladesActorType.faction: {
                if (this.parentActor && !isSkippingSubActorCheck) {
                    return this.parentActor.updateSubActor(this.id, updateData);
                }
                break;
            }
        }
        return super.update(updateData, context);
    }
    
    rollAttributePopup(attribute_name) {
        const test = Action;
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
        if ([...Object.keys(Attribute), ...Object.keys(Action)].includes(attribute_name)) {
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
                        const position = `${html.find('[name="pos"]').attr("value") ?? Position.risky}`;
                        const effect = `${html.find('[name="fx"]').attr("value") ?? Effect.standard}`;
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
    async rollAttribute(attribute_name, additional_dice_amount = 0, position = Position.risky, effect = Effect.standard, note) {
        if (this.type !== BladesActorType.pc) {
            return;
        }
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
        if (!BladesActor.IsType(this, BladesActorType.npc)) {
            return;
        }
        const titleChance = 0.05;
        const suffixChance = 0.01;
        const { persona, secret, random } = this.system;
        function sampleArray(arr, ...curVals) {
            arr = arr.filter((elem) => !curVals.includes(elem));
            if (!arr.length) {
                return "";
            }
            return arr[Math.floor(Math.random() * arr.length)];
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
            background: () => sampleArray(Randomizers.background, random.background.value),
            heritage: () => sampleArray(Randomizers.heritage, random.heritage.value),
            profession: () => sampleArray(Randomizers.profession, random.profession.value),
            gender: () => sampleArray(Randomizers.gender, persona.gender.value),
            appearance: () => sampleArray(Randomizers.appearance, persona.appearance.value),
            goal: () => sampleArray(Randomizers.goal, persona.goal.value, secret.goal.value),
            method: () => sampleArray(Randomizers.method, persona.method.value, secret.method.value),
            trait: () => sampleArray(Randomizers.trait, persona.trait1.value, persona.trait2.value, persona.trait3.value, secret.trait.value),
            interests: () => sampleArray(Randomizers.interests, persona.interests.value, secret.interests.value),
            quirk: () => sampleArray(Randomizers.quirk, persona.quirk.value),
            style: (gender = "") => sampleArray([
                ...(gender.charAt(0).toLowerCase() !== "m" ? Randomizers.style.female : []),
                ...(gender.charAt(0).toLowerCase() !== "f" ? Randomizers.style.male : [])
            ], persona.style.value)
        };
        const gender = persona.gender.isLocked ? persona.gender.value : randomGen.gender();
        const updateKeys = [
            ...Object.keys(persona).filter((key) => !persona[key]?.isLocked),
            ...Object.keys(random).filter((key) => !random[key]?.isLocked),
            ...Object.keys(secret).filter((key) => !secret[key]?.isLocked)
                .map((secretKey) => `secret-${secretKey}`)
        ];
        eLog.checkLog("Update Keys", { updateKeys });
        const updateData = {};
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
                        : sampleArray(Randomizers.trait, persona.trait1.value, persona.trait2.value, persona.trait3.value, secret.trait.value);
                    const trait2 = persona.trait2.isLocked
                        ? persona.trait2.value
                        : sampleArray(Randomizers.trait, trait1, persona.trait1.value, persona.trait2.value, persona.trait3.value, secret.trait.value);
                    const trait3 = persona.trait3.isLocked
                        ? persona.trait3.value
                        : sampleArray(Randomizers.trait, trait1, trait2, persona.trait1.value, persona.trait2.value, persona.trait3.value, secret.trait.value);
                    const secretTrait = secret.trait.isLocked
                        ? secret.trait.value
                        : sampleArray(Randomizers.trait, trait1, trait2, trait3, persona.trait1.value, persona.trait2.value, persona.trait3.value, secret.trait.value);
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
        this.update(updateData);
    }
}
export default BladesActor;