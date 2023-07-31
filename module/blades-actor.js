/* ****▌███████████████████████████████████████████████████████████████████████████▐**** *\
|*     ▌████░░░░░░░░░░░ Euno's Blades in the Dark for Foundry VTT ░░░░░░░░░░░░░████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░ by Eunomiac ░░░░░░░░░░░░░██████████████████▐     *|
|*     ▌████████████████████████████  License █ v0.1.0 ████████████████████████████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░░░░░░  ░░░░░░░░░░░░░░░░░░███████████████████▐     *|
\* ****▌███████████████████████████████████████████████████████████████████████████▐**** */

import U from "./core/utilities.js";
import { BladesActorType, Tag, Playbook, BladesItemType, Attributes, Actions, Positions, EffectLevels, Randomizers } from "./core/constants.js";
import { bladesRoll } from "./blades-roll.js";
import BladesItem, { PrereqType } from "./blades-item.js";
import { SelectionCategory } from "./blades-dialog.js";
class BladesActor extends Actor {

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
            data.system.experience.clues = [
                "You expressed your beliefs, drives, heritage, or background.",
                "You struggled with issues from your vice or traumas during the session."
            ];
        }
        if (data.type === BladesActorType.crew) {
            data.system.experience = {
                playbook: { value: 0, max: 8 },
                clues: [],
                ...data.system.experience ?? {}
            };
            data.system.experience.clues = [
                "You contended with challenges above your current station.",
                "You bolstered your crew's reputation, or developed a new one.",
                "You expressed the goals, drives, inner conflict, or essential nature of the crew."
            ];
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
    get primaryUser() {
        return game.users?.find((user) => user.character?.id === this?.id) || null;
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
            return gItem.hasTag(Tag.System.MultiplesOK) || (gItem.system.num_available ?? 1) > this.activeSubItems.filter((sItem) => sItem.system.world_name === gItem.system.world_name).length;
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
            if (sItem.hasTag(Tag.Item.Fine)) {
                cssClasses.push("fine-quality");
            }
            if (sItem.hasTag(Tag.System.Featured)) {
                cssClasses.push("featured-item");
            }
            if ([BladesItemType.ability, BladesItemType.crew_ability].includes(sItem.type)) {
                if (this.availableAbilityPoints === 0) {
                    cssClasses.push("locked");
                }
                else if ((sItem.system.price ?? 1) > this.availableAbilityPoints) {
                    cssClasses.push("locked", "unaffordable");
                }
                else if ((sItem.system.price ?? 1) > 1) {
                    cssClasses.push("expensive");
                }
            }
            if ([BladesItemType.crew_upgrade].includes(sItem.type)) {
                if (this.availableUpgradePoints === 0) {
                    cssClasses.push("locked");
                }
                else if ((sItem.system.price ?? 1) > this.availableUpgradePoints) {
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
            case SelectionCategory.Preferred_Op: {
                dialogData.Main = this._processEmbeddedItemMatches(BladesItem.GetTypeWithTags(BladesItemType.preferred_op));
                return dialogData;
            }
            case SelectionCategory.Gear: {
                if (this.type !== BladesActorType.pc || this.playbookName === null) {
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
                dialogData.General = this._processEmbeddedItemMatches(BladesItem.GetTypeWithTags(BladesItemType.crew_upgrade, Tag.Item.General));
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
        if (subItem.type !== BladesItemType.item) {
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

    get totalAbilityPoints() {
        if (!BladesActor.IsType(this, BladesActorType.pc, BladesActorType.crew)) {
            return 0;
        }
        if (!this.playbook) {
            return 0;
        }
        switch (this.type) {
            case BladesActorType.pc: return this.system.advancement.ability ?? 0;
            case BladesActorType.crew: return Math.floor(0.5 * (this.system.advancement.general ?? 0)) + (this.system.advancement.ability ?? 0);
            default: return 0;
        }
    }
    get spentAbilityPoints() {
        if (!BladesActor.IsType(this, BladesActorType.pc, BladesActorType.crew)) {
            return 0;
        }
        if (!this.playbook) {
            return 0;
        }
        return this.abilities.reduce((total, ability) => total + (ability.system.price ?? 1), 0);
    }
    get availableAbilityPoints() {
        if (!BladesActor.IsType(this, BladesActorType.pc, BladesActorType.crew)) {
            return 0;
        }
        if (!this.playbook) {
            return 0;
        }
        return this.totalAbilityPoints - this.spentAbilityPoints;
    }
    async addAbilityPoints(amount) {
        if (!BladesActor.IsType(this, BladesActorType.pc, BladesActorType.crew)) {
            return;
        }
        this.update({ "system.advancement.ability": (this.system.advancement.ability ?? 0) + amount });
    }
    async removeAbilityPoints(amount) {
        if (!BladesActor.IsType(this, BladesActorType.pc, BladesActorType.crew)) {
            return;
        }
        this.update({ "system.advancement.ability": Math.max(0, (this.system.advancement.ability ?? 0) - amount) });
    }
    async advancePlaybook() {
        if (!this.playbook) {
            return undefined;
        }
        this.update({ "system.experience.playbook.value": 0 });
        switch (this.type) {
            case BladesActorType.pc: return this.addAbilityPoints(1);
            case BladesActorType.crew: {
                this.members.forEach((member) => member.addStash(this.system.tier.value + 2));
                return this.addAdvancementPoints(2);
            }
            default: return undefined;
        }
    }
    
    

    get totalUpgradePoints() {
        if (!BladesActor.IsType(this, BladesActorType.crew)) {
            return 0;
        }
        if (!this.playbook) {
            return 0;
        }
        return (this.system.advancement.general ?? 0) + (this.system.advancement.upgrade ?? 0);
    }
    get spentUpgradePoints() {
        if (!BladesActor.IsType(this, BladesActorType.crew)) {
            return 0;
        }
        if (!this.playbook) {
            return 0;
        }
        return this.upgrades.reduce((total, upgrade) => total + (upgrade.system.price ?? 1), 0);
    }
    get availableUpgradePoints() {
        if (!BladesActor.IsType(this, BladesActorType.crew)) {
            return 0;
        }
        if (!this.playbook) {
            return 0;
        }
        return this.totalUpgradePoints - this.spentUpgradePoints;
    }
    async addAdvancementPoints(amount) {
        if (!BladesActor.IsType(this, BladesActorType.crew)) {
            return;
        }
        if (!this.playbook) {
            return;
        }
        this.update({ "system.advancement.general": (this.system.advancement.general ?? 0) + amount });
    }
    async removeAdvancementPoints(amount) {
        if (!BladesActor.IsType(this, BladesActorType.crew)) {
            return;
        }
        if (!this.playbook) {
            return;
        }
        this.update({ "system.advancement.general": Math.max(0, (this.system.advancement.general ?? 0) - amount) });
    }
    get totalAdvancementPoints() {
        if (!BladesActor.IsType(this, BladesActorType.crew)) {
            return 0;
        }
        if (!this.playbook) {
            return 0;
        }
        return this.system.advancement.general ?? 0;
    }
    get spentAdvancementPoints() {
        if (!BladesActor.IsType(this, BladesActorType.crew)) {
            return 0;
        }
        if (!this.playbook) {
            return 0;
        }
        return (2 * this.spentAbilityPoints) + this.spentUpgradePoints;
    }
    get availableAdvancementPoints() { return this.totalAdvancementPoints - this.spentAdvancementPoints; }
    get totalCohortPoints() {
        if (!this.playbook) {
            return 0;
        }
        if (![BladesActorType.crew].includes(this.type)) {
            return 0;
        }
        return this.upgrades.filter((item) => item.system.world_name === "Cohort").length;
    }
    get spentCohortPoints() {
        if (!this.playbook) {
            return 0;
        }
        if (![BladesActorType.crew].includes(this.type)) {
            return 0;
        }
        return this.cohorts.length + this.cohorts.filter((cohort) => cohort.system.isUpgraded).length;
    }
    get availableCohortPoints() {
        if (!this.playbook) {
            return 0;
        }
        if (![BladesActorType.crew].includes(this.type)) {
            return 0;
        }
        return this.totalCohortPoints - this.spentCohortPoints;
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
        if (this.type === BladesActorType.pc) {
            return this.activeSubItems.find((item) => item.type === BladesItemType.playbook);
        }
        if (this.type === BladesActorType.crew) {
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
        const activeLoadItems = this.activeSubItems.filter((item) => item.type === BladesItemType.item);
        return U.gsap.utils.clamp(0, 10, activeLoadItems
            .reduce((tot, i) => tot + (i.type === "item"
            ? U.pInt(i.system.load)
            : 0), 0));
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
        return this.activeSubItems.filter((item) => item.type === BladesItemType.cohort);
    }

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
        if (game.eunoblades.Tracker?.actionMax) {
            for (const [attribute, attrData] of Object.entries(system.attributes)) {
                for (const [action, actionData] of Object.entries(attrData)) {
                    actionData.max = game.eunoblades.Tracker.actionMax;
                    system.attributes[attribute][action] = actionData;
                }
            }
        }
        system.experience.clues.reverse();
    }
    _prepareCrewData(system) {
        if (!BladesActor.IsType(this, BladesActorType.crew)) {
            return;
        }
        system.experience.clues.reverse();
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
    
    async _onCreateEmbeddedDocuments(embName, docs, ...args) {
        docs.forEach(async (doc) => {
            if (doc instanceof BladesItem && [BladesItemType.playbook, BladesItemType.crew_playbook].includes(doc.type)) {
                await Promise.all(this.activeSubItems
                    .filter((aItem) => aItem.type === doc.type && aItem.system.world_name !== doc.system.world_name)
                    .map((aItem) => this.remSubItem(aItem)));
            }
        });
        await super._onCreateEmbeddedDocuments(embName, docs, ...args);
        eLog.checkLog("actorTrigger", "onCreateEmbeddedDocuments", { embName, docs, args });
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
                    case BladesItemType.playbook: {
                        if (!BladesActor.IsType(this, BladesActorType.pc)) {
                            return;
                        }
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
                if (!U.isEmpty(playbookUpdateData)) {
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