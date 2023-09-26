/* ****▌███████████████████████████████████████████████████████████████████████████▐**** *\
|*     ▌████░░░░░░░░░░░ Euno's Blades in the Dark for Foundry VTT ░░░░░░░░░░░░░████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░ by Eunomiac ░░░░░░░░░░░░░██████████████████▐     *|
|*     ▌████████████████████████████  License █ v0.1.0 ████████████████████████████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░░░░░░  ░░░░░░░░░░░░░░░░░░███████████████████▐     *|
\* ****▌███████████████████████████████████████████████████████████████████████████▐**** */

import U from "./core/utilities.js";
import C, { BladesActorType, Tag, Playbook, BladesItemType, Action, PrereqType, AdvancementPoint, Randomizers, Factor } from "./core/constants.js";
import { BladesItem } from "./documents/blades-item-proxy.js";
import BladesPushController from "./blades-push-notifications.js";
import { SelectionCategory } from "./blades-dialog.js";
class BladesActor extends Actor {

    static async create(data, options = {}) {
        data.token = data.token || {};
        data.system = data.system ?? {};

        data.system.world_name = data.system.world_name ?? data.name.replace(/[^A-Za-z_0-9 ]/g, "").trim().replace(/ /g, "_");
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
            default: return 0;
        }
    }
    get subActors() {
        return Object.keys(this.system.subactors)
            .map((id) => this.getSubActor(id))
            .filter((subActor) => Boolean(subActor));
    }
    get activeSubActors() { return this.subActors.filter((subActor) => !subActor.hasTag(Tag.System.Archived)); }
    get archivedSubActors() { return this.subActors.filter((subActor) => subActor.hasTag(Tag.System.Archived)); }
    checkActorPrereqs(actor) {
                
        return Boolean(actor);
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
                if (!(BladesActor.IsType(this, BladesActorType.pc) || BladesActor.IsType(this, BladesActorType.crew)) || this.playbookName === null) {
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
                .filter((subActor) => Boolean(focusSubActor?.id && subActor.id !== focusSubActor.id && subActor.hasTag(uTag)))
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
    async updateSubActor(actorRef, upData) {
        const updateData = U.objExpand(upData);
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
        for (const [pType, pReqs] of Object.entries(item.system.prereqs)) {
            const pReqArray = Array.isArray(pReqs) ? pReqs : [pReqs.toString()];
            const hitRecord = {};
            if (!this._processPrereqArray(pReqArray, pType, hitRecord)) {
                return false;
            }
        }
        return true;
    }
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
    _processAdvancedPlaybookPrereq() {
        if (!BladesActor.IsType(this, BladesActorType.pc)) {
            return false;
        }
        if (!this.playbookName || ![Playbook.Ghost, Playbook.Hull, Playbook.Vampire].includes(this.playbookName)) {
            return false;
        }
        return true;
    }
    _processEmbeddedItemMatches(globalItems) {
        return globalItems
            .filter((item) => this._checkItemPrereqs(item))
            .filter((gItem) => gItem.hasTag(Tag.System.MultiplesOK) || (gItem.system.max_per_score ?? 1) > this.activeSubItems.filter((sItem) => sItem.system.world_name === gItem.system.world_name).length)
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
        const isPC = BladesActor.IsType(this, BladesActorType.pc);
        const isCrew = BladesActor.IsType(this, BladesActorType.crew);
        if (!BladesActor.IsType(this, BladesActorType.pc) && !BladesActor.IsType(this, BladesActorType.crew)) {
            return false;
        }
        const { playbookName } = this;
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
                dialogData.Basic = this._processEmbeddedItemMatches(BladesItem.GetTypeWithTags(BladesItemType.playbook).filter((item) => !item.hasTag(Tag.Gear.Advanced)));
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
            dialogData[playbookName] = gearItems.filter((item) => item.hasTag(playbookName));
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
        }
        else if (category === SelectionCategory.Ability) {
            if (isPC) {
                if (playbookName === null) {
                    return false;
                }
                dialogData[playbookName] = this._processEmbeddedItemMatches(BladesItem.GetTypeWithTags(BladesItemType.ability, playbookName));
                dialogData.Veteran = this._processEmbeddedItemMatches(BladesItem.GetTypeWithTags(BladesItemType.ability))
                    .filter((item) => !item.hasTag(playbookName))
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
            else if (isCrew) {
                dialogData.Main = this._processEmbeddedItemMatches(BladesItem.GetTypeWithTags(BladesItemType.crew_ability, playbookName));
            }
        }
        else if (category === SelectionCategory.Upgrade && isCrew && playbookName !== null) {
            dialogData[playbookName] = this._processEmbeddedItemMatches(BladesItem.GetTypeWithTags(BladesItemType.crew_upgrade, playbookName));
            dialogData.General = this._processEmbeddedItemMatches(BladesItem.GetTypeWithTags(BladesItemType.crew_upgrade, Tag.Gear.General));
        }
        return dialogData;
    }
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
        function isBladesItemUniqueTypes(type) {
            return Object.values(BladesItemUniqueTypes).includes(type);
        }
        eLog.checkLog3("subitems", "[addSubItem] itemRef", itemRef);
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
        }
        if (focusItem && isBladesItemUniqueTypes(focusItem.type)) {
            await Promise.all(this.activeSubItems
                .filter((subItem) => subItem.type === focusItem?.type && subItem.system.world_name !== focusItem?.system.world_name && !subItem.hasTag(Tag.System.Archived))
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
            ? allowedTypes.sort((a, b) => a.localeCompare(b)).join("_")
            : allowedTypes;
        this.update({ [`system.advancement_points.${aPtKey}`]: (this.system.advancement_points?.[aPtKey] ?? 0) + amount });
    }
    async removeAdvancementPoints(allowedTypes, amount = 1) {
        const aPtKey = Array.isArray(allowedTypes)
            ? allowedTypes.sort((a, b) => a.localeCompare(b)).join("_")
            : allowedTypes;
        const newCount = this.system.advancement_points?.[aPtKey] ?? 0 - amount;
        if (newCount <= 0 && aPtKey in (this.system.advancement_points ?? [])) {
            this.update({ [`system.advancement_points.-=${aPtKey}`]: null });
        }
        else {
            this.update({ [`system.advancement_points.${aPtKey}`]: newCount });
        }
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
        if (!(BladesActor.IsType(this, BladesActorType.pc) || BladesActor.IsType(this, BladesActorType.crew)) || !this.playbook) {
            return;
        }
        await this.update({ "system.experience.playbook.value": 0 });
        if (BladesActor.IsType(this, BladesActorType.pc)) {
            BladesPushController.Get().pushToAll("GM", `${this.name} Advances their Playbook!`, `${this.name}, select a new Ability on your Character Sheet.`);
            this.grantAdvancementPoints(AdvancementPoint.Ability);
            return;
        }
        if (BladesActor.IsType(this, BladesActorType.crew)) {
            game.eunoblades.PushController?.pushToAll("GM", `${this.name} Advances their Playbook!`, "Select new Upgrades and/or Abilities on your Crew Sheet.");
            this.members.forEach((member) => {
                const coinGained = this.system.tier.value + 2;
                game.eunoblades.PushController?.pushToAll("GM", `${member.name} Gains ${coinGained} Stash (Crew Advancement)`, undefined);
                member.addStash(coinGained);
            });
            this.grantAdvancementPoints(AdvancementPoint.UpgradeOrAbility, 2);
        }
    }
    async advanceAttribute(attribute) {
        await this.update({ [`system.experience.${attribute}.value`]: 0 });
        const actions = C.Action[attribute].map((action) => `<strong>${U.tCase(action)}</strong>`);
        game.eunoblades.PushController?.pushToAll("GM", `${this.name} Advances their ${U.uCase(attribute)}!`, `${this.name}, add a dot to one of ${U.oxfordize(actions, true, "or")}.`);
    }
    parentActor;
    get isSubActor() { return this.parentActor !== undefined; }
    
    
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
        return tags.length;
    }

    prepareDerivedData() {
        if (BladesActor.IsType(this, BladesActorType.pc)) {
            this._preparePCData(this.system);
        }
        if (BladesActor.IsType(this, BladesActorType.crew)) {
            this._prepareCrewData(this.system);
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
    
    async _onCreateDescendantDocuments(parent, collection, docs, data, options, userId) {
        await Promise.all(docs.map(async (doc) => {
            if (BladesItem.IsType(doc, BladesItemType.playbook, BladesItemType.crew_playbook)) {
                await Promise.all(this.activeSubItems
                    .filter((aItem) => aItem.type === doc.type && aItem.system.world_name !== doc.system.world_name)
                    .map((aItem) => this.remSubItem(aItem)));
            }
        }));
        await super._onCreateDescendantDocuments(parent, collection, docs, data, options, userId);
        eLog.checkLog("actorTrigger", "_onCreateDescendantDocuments", { parent, collection, docs, data, options, userId });
        docs.forEach((doc) => {
            if (BladesItem.IsType(doc, BladesItemType.vice) && BladesActor.IsType(this, BladesActorType.pc)) {
                this.activeSubActors
                    .filter((subActor) => subActor.hasTag(Tag.NPC.VicePurveyor) && !subActor.hasTag(doc.name))
                    .forEach((subActor) => { this.remSubActor(subActor); });
            }
        });
    }
    async update(updateData, context, isSkippingSubActorCheck = false) {
        if (!updateData) {
            return super.update(updateData);
        }
        if (BladesActor.IsType(this, BladesActorType.crew)) {
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
        }
        else if ((BladesActor.IsType(this, BladesActorType.npc)
            || BladesActor.IsType(this, BladesActorType.faction))
            && this.parentActor
            && !isSkippingSubActorCheck) {
            return this.parentActor.updateSubActor(this.id, updateData)
                .then(() => this);
        }
        return super.update(updateData, context);
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
        this.update(updateData);
    }
}
export default BladesActor;
//# sourceMappingURL=blades-actor.js.map
//# sourceMappingURL=blades-actor.js.map
