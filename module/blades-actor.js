/* ****▌███████████████████████████████████████████████████████████████████████████▐**** *\
|*     ▌████░░░░░░░░░░░ Euno's Blades in the Dark for Foundry VTT ░░░░░░░░░░░░░████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░ by Eunomiac ░░░░░░░░░░░░░██████████████████▐     *|
|*     ▌████████████████████████████  License █ v0.1.0 ████████████████████████████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░░░░░░  ░░░░░░░░░░░░░░░░░░███████████████████▐     *|
\* ****▌███████████████████████████████████████████████████████████████████████████▐**** */

import U from "./core/utilities.js";
import C, { BladesActorType, BladesItemType, Randomizers, Attributes, Actions, Positions, EffectLevels } from "./core/constants.js";
import { bladesRoll } from "./blades-roll.js";
import BladesItem from "./blades-item.js";
class BladesActor extends Actor {
    static CategoryTypes = {
        "pc-crew": BladesActorType.crew,
        "crew-pc": BladesActorType.pc,
        "vice_purveyor": BladesActorType.npc,
        "acquaintance": BladesActorType.npc,
        "pc": BladesActorType.pc,
        "npc": BladesActorType.npc,
        "crew": BladesActorType.crew
    };
    static CategoryFilters = {};
    static CategoryUniques = {
        "pc-crew": true,
        "crew-pc": false,
        "vice_purveyor": true,
        "acquaintance": false,
        "pc": false,
        "npc": false,
        "crew": true
    };
    static get All() { return game.actors; }
    static async getAllGlobalActors() {
        const actors = Array.from(BladesActor.All);
        const packs = game.packs.filter((pack) => C.ActorTypes.includes(pack.metadata.name));
        const packActors = (await Promise.all(packs.map(async (pack) => {
            const packDocs = await pack.getDocuments();
            return packDocs.filter((packActor) => !actors.some((act) => act.system.world_name === packActor.system.world_name));
        }))).flat();
        actors.push(...packActors);
        actors.sort(function (a, b) {
            const nameA = (a.name ?? "").toUpperCase();
            const nameB = (b.name ?? "").toUpperCase();
            return nameA.localeCompare(nameB);
        });
        eLog.checkLog3("actorFetch", "BladesActor.getAllGlobalActors", await actors);
        return actors;
    }
    static async getActorsByCat(actorCat) {
        if (!(actorCat in BladesActor.CategoryTypes)) {
            return [];
        }
        const allActors = await BladesActor.getAllGlobalActors();
        const allTypeActors = allActors.filter((actor) => actor.type === BladesActor.CategoryTypes[actorCat]);
        if (actorCat in BladesActor.CategoryFilters) {
            eLog.checkLog3("actorFetch", `BladesActor.getActorsByCat(${actorCat}) *FILTER*`, await BladesActor.CategoryFilters[actorCat](allTypeActors));
            return BladesActor.CategoryFilters[actorCat](allTypeActors);
        }
        eLog.checkLog3("actorFetch", `BladesActor.getActorsByCat(${actorCat})`, await allTypeActors);
        return allTypeActors;
    }

    static async GetGlobal(actorRef, actorCat) {
        if (actorCat) {
            if (!(actorCat in BladesActor.CategoryTypes)) {
                return null;
            }
            if (actorRef instanceof BladesActor) {
                if (actorRef.type !== BladesActor.CategoryTypes[actorCat]) {
                    return null;
                }
                actorRef = actorRef.system.world_name ?? actorRef.id;
            }
        }
        else if (actorRef instanceof BladesActor) {
            actorCat = actorRef.type;
            actorRef = actorRef.system.world_name ?? actorRef.id;
        }
        const actors = await (actorCat ? BladesActor.getActorsByCat(actorCat) : BladesActor.getAllGlobalActors());
        if (U.isDocID(actorRef)) {
            return actors.find((actor) => actor.id === actorRef) ?? null;
        }
        else {
            return actors.find((actor) => actor.name === actorRef)
                ?? actors.find((actor) => actor.system.world_name === actorRef)
                ?? null;
        }
    }
    static async GetPersonal(actorRef, parent) {
        if (!actorRef) {
            return null;
        }
        const actor = await BladesActor.GetGlobal(actorRef);
        eLog.checkLog4("actorFetch", `BladesActor.GetPersonal(${typeof actorRef === "string" ? actorRef : actorRef.name}, ${parent.name}) -> Global Actor`, await actor);
        if (!actor || !actor.id) {
            return null;
        }
        const { category, system } = parent.system.subactors[actor.id];
        eLog.checkLog4("actorFetch", `BladesActor.GetPersonal(${typeof actorRef === "string" ? actorRef : actorRef.name}, ${parent.name}) -> Subactor Data`, { category, system, parent });
        if (!category || !system) {
            return null;
        }
        eLog.checkLog4("actorFetch", `BladesActor.GetPersonal(${typeof actorRef === "string" ? actorRef : actorRef.name}, ${parent.name}) -> Merged Actor`, {
            actor: Object.assign(actor, {
                category,
                system: foundry.utils.mergeObject(actor.system, system)
            })
        });
        return Object.assign(actor, {
            category,
            system: foundry.utils.mergeObject(actor.system, system)
        });
    }

    static async Embed(actorRef, category, parent) {
        eLog.log2("[BladesActor.Embed(actorRef, category, parent)]", { actorRef, category, parent });
        const updateData = {};
        if (!(category in BladesActor.CategoryTypes)) {
            return null;
        }

        const globalActor = await BladesActor.GetGlobal(actorRef);
        if (!globalActor?.id) {
            return null;
        }
        if (globalActor.id in parent.system.subactors) {
            updateData[`system.subactors.${globalActor.id}.isArchived`] = false;
        }
        updateData[`system.subactors.${globalActor.id}`] = { id: globalActor.id, category, system: {}, isArchived: false };
        await parent.update(updateData);
        return BladesActor.GetPersonal(actorRef, parent);
    }

    static async Remove(actorRef, category, parent, isFullRemoval = false) {
        eLog.log2("[BladesActor.Remove(actorRef, category, parent)]", { actorRef, category, parent });
        const updateData = {};
        if (!(category in BladesActor.CategoryTypes)) {
            return;
        }

        const globalActor = await BladesActor.GetGlobal(actorRef);
        if (!globalActor?.id) {
            return;
        }
        if (globalActor.id in parent.system.subactors) {
            if (isFullRemoval) {
                updateData[`system.subactors.${globalActor.id}`] = null;
            }
            else {
                updateData[`system.subactors.${globalActor.id}.isArchived`] = true;
            }
        }
        await parent.update(updateData);
        return;
    }
    static async GetEmbeddedActors(parent) {
        return (await Promise.all(Object.keys(parent.system.subactors).map((actorID) => BladesActor.GetPersonal(actorID, parent))))
            .filter((actor) => actor !== null);
    }

    static async GetEmbeddedCategoryActors(cat, parent) {
        const catActorData = Object.values(parent.system.subactors).filter(({ category }) => category === cat);
        const embActors = await Promise.all(catActorData.map(async ({ id }) => BladesActor.GetPersonal(id, parent)));
        return embActors.filter((actor) => actor !== null);
    }

    static async GetActiveCategoryActors(cat, parent) {
        const embActors = await BladesActor.GetEmbeddedCategoryActors(cat, parent);
        return embActors.filter((actor) => !actor.isArchived);
    }

    static async GetGlobalCategoryActors(category, parent) {
        const globalActors = await BladesActor.getActorsByCat(category);
        if (!parent) {
            return globalActors;
        }
        const customizedActors = await Promise.all(globalActors.map((gActor) => {
            if (gActor.id && gActor.id in parent.system.subactors) {
                return BladesActor.GetPersonal(gActor, parent);
            }
            else {
                return gActor;
            }
        }));
        return customizedActors.filter((actor) => actor !== null);
    }
    static async create(data, options = {}) {
        data.token = data.token || {};
        eLog.checkLog3("actor", "BladesActor.create(data,options)", { data, options });

        switch (data.type) {
            case "pc":
            case "crew":
                data.token.actorLink = true;
                break;
        }
        function createWorldName(name) {
            return name
                .replace(/[^A-Za-z_0-9 ]/g, "")
                .trim()
                .replace(/ /g, "_");
        }
        
        return super.create(data, options);
    }
    async _onCreateEmbeddedDocuments(embName, docs, ...args) {
        await super._onCreateEmbeddedDocuments(embName, docs, ...args);
        eLog.checkLog("actorTrigger", "onCreateEmbeddedDocuments", { embName, docs, args });
        docs.forEach(async (doc) => {
            if (doc instanceof BladesItem) {
                switch (doc.type) {
                    case "playbook": {
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
    isValidForDoc(parentDoc) {
        return true;
    }
    get playbookName() {
        return this.playbook?.name ?? null;
    }
    get playbook() {
        return this.items.find((item) => item.type === "playbook")
            ?? this.items.find((item) => item.type === "crew_playbook")
            ?? null;
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
    async removeDoc(docId, isFullRemoval = false) {
        const doc = (await BladesActor.GetPersonal(docId, this)) ?? (await BladesItem.GetPersonal(docId, this));
        if (!doc) {
            return;
        }
        if (doc instanceof BladesActor) {
            BladesActor.Remove(doc, doc.category, this, isFullRemoval);
        }
        else {
            BladesItem.Remove(doc, doc.type, this, isFullRemoval);
        }
    }
    startScore() {
        this.update({
        });
    }
    startDowntime() {
        this.update({
        });
    }
    endScore() {
        this.update({
        });
    }
    endDowntime() {
        this.update({
        });
    }
    get currentLoad() {
        const activeLoadItems = this.items.filter((item) => item.type === BladesItemType.item && !item.isArchived);
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