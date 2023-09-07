/* ****▌███████████████████████████████████████████████████████████████████████████▐**** *\
|*     ▌████░░░░░░░░░░░ Euno's Blades in the Dark for Foundry VTT ░░░░░░░░░░░░░████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░ by Eunomiac ░░░░░░░░░░░░░██████████████████▐     *|
|*     ▌████████████████████████████  License █ v0.1.0 ████████████████████████████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░░░░░░  ░░░░░░░░░░░░░░░░░░███████████████████▐     *|
\* ****▌███████████████████████████████████████████████████████████████████████████▐**** */

import U from "./utilities.js";
import { BladesActorType, Tag, Playbook, BladesItemType, PrereqType } from "./constants.js";
import { SelectionCategory } from "../blades-dialog.js";
import BladesActor from "../blades-actor.js";
import BladesItem from "../blades-item.js";
class MixinBuilder {
    superclass;
    constructor(superclass) { this.superclass = superclass; }
    with(...mixins) {
        return mixins.reduce((cls, mixin = (x) => x) => mixin(cls), this.superclass);
    }
}
const MIX = (superclass) => new MixinBuilder(superclass);
export const PlayableCharacterMixin = (superclass) => class extends superclass {
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
    parentActor;
    get isSubActor() { return this.parentActor !== undefined; }
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
                        if (!BladesActor.IsType(this, BladesActorType.pc)) {
                            return false;
                        }
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
                if (!BladesActor.IsType(this, BladesActorType.pc)) {
                    return false;
                }
                dialogData.Main = this._processEmbeddedItemMatches(BladesItem.GetTypeWithTags(BladesItemType.heritage));
                return dialogData;
            }
            case SelectionCategory.Background: {
                if (!BladesActor.IsType(this, BladesActorType.pc)) {
                    return false;
                }
                dialogData.Main = this._processEmbeddedItemMatches(BladesItem.GetTypeWithTags(BladesItemType.background));
                return dialogData;
            }
            case SelectionCategory.Vice: {
                if (!BladesActor.IsType(this, BladesActorType.pc) || this.playbookName === null) {
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
                if (!BladesActor.IsType(this, BladesActorType.crew)) {
                    return false;
                }
                dialogData.Main = this._processEmbeddedItemMatches(BladesItem.GetTypeWithTags(BladesItemType.crew_reputation));
                return dialogData;
            }
            case SelectionCategory.Preferred_Op: {
                if (!BladesActor.IsType(this, BladesActorType.crew) || this.playbookName === null) {
                    return false;
                }
                dialogData.Main = this._processEmbeddedItemMatches(BladesItem.GetTypeWithTags(BladesItemType.preferred_op, this.playbookName));
                return dialogData;
            }
            case SelectionCategory.Gear: {
                if (!BladesActor.IsType(this, BladesActorType.pc) || this.playbookName === null) {
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
                if (BladesActor.IsType(this, BladesActorType.pc)) {
                    if (this.playbookName === null) {
                        return false;
                    }
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
                else if (BladesActor.IsType(this, BladesActorType.crew)) {
                    dialogData.Main = this._processEmbeddedItemMatches(BladesItem.GetTypeWithTags(BladesItemType.crew_ability, this.playbookName));
                }
                return dialogData;
            }
            case SelectionCategory.Upgrade: {
                if (!BladesActor.IsType(this, BladesActorType.crew) || this.playbookName === null) {
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
        let ItemUniqueTypes;
        (function (ItemUniqueTypes) {
            ItemUniqueTypes["background"] = "background";
            ItemUniqueTypes["vice"] = "vice";
            ItemUniqueTypes["crew_playbook"] = "crew_playbook";
            ItemUniqueTypes["crew_reputation"] = "crew_reputation";
            ItemUniqueTypes["heritage"] = "heritage";
            ItemUniqueTypes["playbook"] = "playbook";
            ItemUniqueTypes["preferred_op"] = "preferred_op";
        })(ItemUniqueTypes || (ItemUniqueTypes = {}));
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
            ItemUniqueTypes: Object.values(ItemUniqueTypes),
            focusBladesItemType: focusItem.type,
            isLimited: Object.values(ItemUniqueTypes).includes(focusItem.type)
        });
        if (Object.values(ItemUniqueTypes).includes(focusItem.type)) {
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
};
export default MIX;