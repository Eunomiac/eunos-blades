/* ****▌███████████████████████████████████████████████████████████████████████████▐**** *\
|*     ▌████░░░░░░░░░░░ Euno's Blades in the Dark for Foundry VTT ░░░░░░░░░░░░░████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░ by Eunomiac ░░░░░░░░░░░░░██████████████████▐     *|
|*     ▌████████████████████████████  License █ v0.1.0 ████████████████████████████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░░░░░░  ░░░░░░░░░░░░░░░░░░███████████████████▐     *|
\* ****▌███████████████████████████████████████████████████████████████████████████▐**** */

import U from "./core/utilities.js";
import { BladesActorType, Tag, BladesItemType, Randomizers, Attributes, Actions, Positions, EffectLevels } from "./core/constants.js";
import { bladesRoll } from "./blades-roll.js";
import BladesItem, { PrereqType } from "./blades-item.js";
export var SelectionCategory;
(function (SelectionCategory) {
    SelectionCategory["Heritage"] = "Heritage";
    SelectionCategory["Background"] = "Background";
    SelectionCategory["Vice"] = "Vice";
    SelectionCategory["Playbook"] = "Playbook";
    SelectionCategory["Reputation"] = "Reputation";
    SelectionCategory["PreferredOp"] = "PreferredOp";
    SelectionCategory["Gear"] = "Gear";
    SelectionCategory["Ability"] = "Ability";
    SelectionCategory["Upgrade"] = "Upgrade";
    SelectionCategory["Cohort"] = "Cohort";
    SelectionCategory["Feature"] = "Feature";
    SelectionCategory["Stricture"] = "Stricture";
    SelectionCategory["Acquaintance"] = "Acquaintance";
    SelectionCategory["Crew"] = "Crew";
})(SelectionCategory || (SelectionCategory = {}));
class BladesActor extends Actor {

    static get All() { return game.actors; }
    static Get(actorRef) {
        if (actorRef instanceof BladesActor) {
            return actorRef;
        }
        if (U.isDocID(actorRef)) {
            return BladesActor.All.get(actorRef) || null;
        }
        return BladesActor.All.find((a) => a.system.world_name === actorRef)
            || BladesActor.All.find((a) => a.name === actorRef)
            || null;
    }
    static GetTypeWithTags(docType, ...tags) {
        return BladesActor.All.filter((actor) => actor.type === docType)
            .filter((actor) => actor.hasTag(...tags));
    }
    get tags() { return this.system.tags; }
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
        if (tooltipText) {
            return (new Handlebars.SafeString(tooltipText)).toString();
        }
        return null;
    }
    get activeItems() { return this.items.filter((item) => !item.hasTag(Tag.Archived)); }
    get archivedItems() { return this.items.filter((item) => item.hasTag(Tag.Archived)); }
    processEmbeddedMatches(globalItems) {
        globalItems = globalItems.filter(this.checkPrereqs);
        const activeItems = this.activeItems.filter((eItem) => globalItems.find((gItem) => gItem.system.world_name === eItem.system.world_name));
        let processedItems = [
            ...this.archivedItems.filter((eItem) => globalItems.find((gItem) => gItem.system.world_name === eItem.system.world_name)),
            ...globalItems
        ];
        activeItems.forEach((aItem) => {
            const numActive = activeItems.filter((item) => item.system.world_name === aItem.system.world_name).length;
            if (aItem.system.num_available ?? 1 <= numActive) {
                processedItems = processedItems.filter((item) => item.system.world_name === aItem.system.world_name);
            }
            else {
                processedItems.push(aItem);
            }
        });
        processedItems.forEach((item) => {
            item.dialogCSSClasses = [];
            if (item.isEmbedded) {
                item.dialogCSSClasses.push("embedded");
                if (!item.hasTag(Tag.Archived)) {
                    item.dialogCSSClasses.push("active-embedded");
                }
            }
            if (item.hasTag(Tag.Fine)) {
                item.dialogCSSClasses.push("fine-quality");
            }
            if (item.hasTag(Tag.Featured)) {
                item.dialogCSSClasses.push("featured-item");
            }
        });
        processedItems.sort((a, b) => {
            if (a.hasTag(Tag.Featured) && !b.hasTag(Tag.Featured)) {
                return -1;
            }
            if (!a.hasTag(Tag.Featured) && b.hasTag(Tag.Featured)) {
                return 1;
            }
            if (a.hasTag(Tag.Fine) && !b.hasTag(Tag.Fine)) {
                return -1;
            }
            if (!a.hasTag(Tag.Fine) && b.hasTag(Tag.Fine)) {
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
        return processedItems;
    }
    getDialogItems(dialogRef) {
        
        
        const dialogData = {};
        switch (dialogRef) {
            case SelectionCategory.Heritage: {
                dialogData.Main = this.processEmbeddedMatches(BladesItem.GetTypeWithTags(BladesItemType.heritage));
                return dialogData;
            }
            case SelectionCategory.Background: {
                dialogData.Main = this.processEmbeddedMatches(BladesItem.GetTypeWithTags(BladesItemType.background));
                return dialogData;
            }
            case SelectionCategory.Vice: {
                if (this.playbookName === null) {
                    return false;
                }
                if (this.vices.some((item) => item.hasTag(Tag.ViceOverride))) {
                    return false;
                }
                dialogData.Main = this.processEmbeddedMatches(BladesItem.GetTypeWithTags(BladesItemType.vice, this.playbookName));
                return dialogData;
            }
            case SelectionCategory.Playbook: {
                switch (this.type) {
                    case BladesActorType.pc: {
                        dialogData.Basic = this.processEmbeddedMatches(BladesItem.GetTypeWithTags(BladesItemType.playbook, Tag.AdvancedPlaybook));
                        dialogData.Advanced = this.processEmbeddedMatches(BladesItem.GetTypeWithTags(BladesItemType.playbook, Tag.AdvancedPlaybook));
                        return dialogData;
                    }
                    case BladesActorType.crew: {
                        dialogData.Main = this.processEmbeddedMatches(BladesItem.GetTypeWithTags(BladesItemType.crew_playbook));
                        return dialogData;
                    }
                    default: return false;
                }
            }
            case SelectionCategory.Reputation: {
                dialogData.Main = this.processEmbeddedMatches(BladesItem.GetTypeWithTags(BladesItemType.crew_reputation));
                return dialogData;
            }
            case SelectionCategory.PreferredOp: {
                dialogData.Main = this.processEmbeddedMatches(BladesItem.GetTypeWithTags(BladesItemType.preferred_op));
                return dialogData;
            }
            case SelectionCategory.Gear: {
                if (this.playbookName === null) {
                    return false;
                }
                const gearItems = this.processEmbeddedMatches([
                    ...BladesItem.GetTypeWithTags(BladesItemType.item, this.playbookName),
                    ...BladesItem.GetTypeWithTags(BladesItemType.item, Tag.General)
                ])
                    .filter((item) => this.remainingLoad >= item.load);
                dialogData[this.playbookName] = gearItems.filter((item) => item.hasTag(this.playbookName));
                dialogData.General = gearItems.filter((item) => item.hasTag(Tag.General));
                dialogData.General.forEach((item) => U.pullElement(item.dialogCSSClasses ?? [], (cls) => cls === "featured-item"));
                return dialogData;
            }
            case SelectionCategory.Ability: {
                if (this.playbookName === null) {
                    return false;
                }
                const itemType = this.type === BladesActorType.crew ? BladesItemType.crew_ability : BladesItemType.ability;
                dialogData[this.playbookName] = this.processEmbeddedMatches(BladesItem.GetTypeWithTags(itemType, this.playbookName));
                dialogData.Veteran = this.processEmbeddedMatches(BladesItem.GetTypeWithTags(itemType))
                    .filter((item) => !item.hasTag(this.playbookName));
                return dialogData;
            }
            case SelectionCategory.Upgrade: {
                dialogData.Main = this.processEmbeddedMatches(BladesItem.GetTypeWithTags(BladesItemType.crew_upgrade));
                return dialogData;
            }
        }
        return dialogData;
    }
    checkPrereqs(item) {
        if (!item.system.prereqs) {
            return true;
        }
        for (const [pType, pString] of Object.entries(item.system.prereqs)) {
            switch (pType) {
                case PrereqType.HasActiveItem: {
                    if (!this.activeItems.find((item) => item.system.world_name === pString)) {
                        return false;
                    }
                    break;
                }
            }
        }
        return true;
    }
    addDialogItem(docID) {
        
    }
    getEmbeddedDoc(docID) {
        if (this.items.get(docID)) {
            return this.items.get(docID);
        }
        if (docID in this.system.subactors) {
            return game.actors.get(docID) ?? false;
        }
        return false;
    }
    get vices() {
        return this.activeItems.filter((item) => item.type === BladesItemType.vice);
    }
    
    static async create(data, options = {}) {
        data.token = data.token || {};
        data.data = data.data ?? {};
        eLog.checkLog2("actor", "BladesActor.create(data,options)", { data, options });

        if ([BladesActorType.crew, BladesActorType.pc].includes(data.type)) {
            data.token.actorLink = true;
        }

        data.data.world_name = data.data.world_name ?? data.name.replace(/[^A-Za-z_0-9 ]/g, "")
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
    get playbookName() {
        return this.playbook?.name ?? null;
    }
    get playbook() {
        if (this.type === BladesActorType.pc) {
            return this.activeItems.find((item) => item.type === BladesItemType.playbook);
        }
        if (this.type === BladesActorType.crew) {
            return this.activeItems.find((item) => item.type === BladesItemType.crew_playbook);
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
        const activeLoadItems = this.activeItems.filter((item) => item.type === BladesItemType.item);
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
}
export default BladesActor;