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

        data.system.world_name = data.system.world_name ?? data.name.replace(/[^A-Za-z_0-9 ]/g, "")
            .trim()
            .replace(/ /g, "_");
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
        if (actor.type !== BladesActorType.npc) {
            return actor;
        }
        const subActorData = this.system.subactors[actor.id] ?? {};
        actor.system = mergeObject(actor.system, subActorData ?? {});
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
        eLog.checkLog3("subactors", "[updateSubActor] ", {
            ["3: diffUpdateSystem"]: diffUpdateSystem,
            ["5: mergedSubActorSystem"]: mergedSubActorSystem
        });
        return this.update({ [`system.subactors.${actor.id}`]: mergedSubActorSystem }, undefined, true);
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
    async clearSubActors(isReRendering = true) {
        this.subActors.forEach((subActor) => {
            if (subActor.parentActor?.id === this.id) {
                subActor.clearParentActor(isReRendering);
            }
        });
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
            this.render();
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

    async addAbilityPoints(amount) {
        this.update({ "system.ability_points": (this.system.ability_points ?? 0) + amount });
    }
    async removeAbilityPoints(amount) {
        this.update({ "system.ability_points": Math.max(0, (this.system.ability_points ?? 0) - amount) });
    }
    get totalAbilityPoints() {
        if (!this.playbook) {
            return 0;
        }
        switch (this.type) {
            case BladesActorType.pc: {
                return this.system.ability_points ?? 0;
            }
            case BladesActorType.crew: {
                return Math.floor(0.5 * (this.system.advancement_points ?? 0)) + (this.system.ability_points ?? 0);
            }
            default: return 0;
        }
    }
    get spentAbilityPoints() {
        if (!this.playbook) {
            return 0;
        }
        if (![BladesActorType.pc, BladesActorType.crew].includes(this.type)) {
            return 0;
        }
        return this.abilities.reduce((total, ability) => total + (ability.system.price ?? 1), 0);
    }
    get availableAbilityPoints() {
        if (!this.playbook) {
            return 0;
        }
        if (![BladesActorType.pc, BladesActorType.crew].includes(this.type)) {
            return 0;
        }
        return this.totalAbilityPoints - this.spentAbilityPoints;
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
        if (!this.playbook) {
            return 0;
        }
        if (![BladesActorType.crew].includes(this.type)) {
            return 0;
        }
        return (this.system.advancement_points ?? 0) + (this.system.upgrade_points ?? 0);
    }
    get spentUpgradePoints() {
        if (!this.playbook) {
            return 0;
        }
        if (![BladesActorType.crew].includes(this.type)) {
            return 0;
        }
        return this.upgrades.reduce((total, upgrade) => total + (upgrade.system.price ?? 1), 0);
    }
    get availableUpgradePoints() {
        if (!this.playbook) {
            return 0;
        }
        if (![BladesActorType.crew].includes(this.type)) {
            return 0;
        }
        return this.totalUpgradePoints - this.spentUpgradePoints;
    }
    async addAdvancementPoints(amount) {
        this.update({ "system.advancement_points": (this.system.advancement_points ?? 0) + amount });
    }
    async removeAdvancementPoints(amount) {
        this.update({ "system.advancement_points": Math.max(0, (this.system.advancement_points ?? 0) - amount) });
    }
    get totalAdvancementPoints() {
        if (!this.playbook) {
            return 0;
        }
        if (this.type !== BladesActorType.crew) {
            return 0;
        }
        return this.system.advancement_points ?? 0;
    }
    get spentAdvancementPoints() {
        if (!this.playbook) {
            return 0;
        }
        if (this.type !== BladesActorType.crew) {
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
        if (this.type !== BladesActorType.pc) {
            return undefined;
        }
        return {
            insight: Object.values(this.system.attributes.insight).filter(({ value }) => value > 0).length + this.system.resistance_bonuses.insight,
            prowess: Object.values(this.system.attributes.prowess).filter(({ value }) => value > 0).length + this.system.resistance_bonuses.prowess,
            resolve: Object.values(this.system.attributes.resolve).filter(({ value }) => value > 0).length + this.system.resistance_bonuses.resolve
        };
    }
    get actions() {
        if (this.type !== BladesActorType.pc) {
            return undefined;
        }
        return U.objMap({
            ...this.system.attributes.insight,
            ...this.system.attributes.prowess,
            ...this.system.attributes.resolve
        }, ({ value, max }) => U.gsap.utils.clamp(0, max, value));
    }
    get rollable() {
        if (this.type !== BladesActorType.pc) {
            return undefined;
        }
        return {
            ...this.attributes,
            ...this.actions
        };
    }
    get trauma() {
        if (this.type !== BladesActorType.pc) {
            return 0;
        }
        return Object.keys(this.system.trauma?.checked ?? {})
            .filter((traumaName) => {
            return this.system.trauma.active[traumaName] && this.system.trauma.checked[traumaName];
        })
            .length;
    }
    get traumaList() {
        return Object.keys(this.system.trauma.active ?? {}).filter((key) => this.system.trauma.active[key]);
    }
    get activeTraumaConditions() {
        return U.objFilter(this.system.trauma?.checked ?? {}, (v, traumaName) => Boolean(traumaName in this.system.trauma.active && this.system.trauma.active[traumaName]));
    }
    get currentLoad() {
        if (this.type !== BladesActorType.pc) {
            return 0;
        }
        const activeLoadItems = this.activeSubItems.filter((item) => item.type === BladesItemType.item);
        return U.gsap.utils.clamp(0, 10, activeLoadItems
            .reduce((tot, i) => tot + (i.type === "item"
            ? U.pInt(i.system.load)
            : 0), 0));
    }
    get remainingLoad() {
        if (this.type !== BladesActorType.pc) {
            return 0;
        }
        if (!this.system.loadout.selected) {
            return 0;
        }
        const maxLoad = this.system.loadout.levels[game.i18n.localize(this.system.loadout.selected.toString()).toLowerCase()];
        return Math.max(0, maxLoad - this.currentLoad);
    }
    async addStash(amount) {
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

    async _onCreateEmbeddedDocuments(embName, docs, ...args) {
        super._onCreateEmbeddedDocuments(embName, docs, ...args);
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
            return super.update(updateData);
        }
        switch (this.type) {
            case BladesActorType.pc: {
                if (isSkippingSubActorCheck) {
                    eLog.checkLog("actorTrigger", "Updating PC SubActor Data", { updateData });
                }
                break;
            }
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
            case BladesActorType.npc: {
                if (this.parentActor && !isSkippingSubActorCheck) {
                    eLog.checkLog("actorTrigger", "Updating NPC as SubActor", { parentActor: this.parentActor, systemTags: this.system.tags, sourceTags: this._source.system.tags, isSkippingSubActorCheck, updateData });
                    return this.parentActor.updateSubActor(this.id, updateData);
                }
                eLog.checkLog("actorTrigger", "Updating NPC as ACTOR", { parentActor: this.parentActor, systemTags: this.system.tags, sourceTags: this._source.system.tags, isSkippingSubActorCheck, updateData });
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