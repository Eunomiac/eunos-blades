/* ****▌███████████████████████████████████████████████████████████████████████████▐**** *\
|*     ▌████░░░░░░░░░░░ Euno's Blades in the Dark for Foundry VTT ░░░░░░░░░░░░░████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░ by Eunomiac ░░░░░░░░░░░░░██████████████████▐     *|
|*     ▌████████████████████████████  License █ v0.1.0 ████████████████████████████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░░░░░░  ░░░░░░░░░░░░░░░░░░███████████████████▐     *|
\* ****▌███████████████████████████████████████████████████████████████████████████▐**** */

import H from "./core/helpers.js";
import U from "./core/utilities.js";
import C, { Randomizers } from "./core/constants.js";
import { bladesRoll } from "./blades-roll.js";
import BladesItem from "./blades-item.js";
class BladesActor extends Actor {
    static async create(data, options = {}) {
        data.token = data.token || {};

        switch (data.type) {
            case "character":
            case "crew":
                data.token.actorLink = true;
                break;
        }
        return super.create(data, options);
    }
    
    async _onCreateEmbeddedDocuments(embName, docs, ...args) {
        await super._onCreateEmbeddedDocuments(embName, docs, ...args);
        eLog.log("onCreateEmbeddedDocuments", { embName, docs, args });
        docs.forEach(async (doc) => {
            if (doc instanceof BladesItem) {
                switch (doc.type) {
                    case "playbook": {
                        if (doc.name && doc.name in C.Playbooks) {
                            await this.update({
                                "system.trauma.active": null,
                                "system.trauma.checked": null
                            });
                            const playbookKey = "trauma" in C.Playbooks[doc.name]
                                ? doc.name
                                : "DEFAULTS";
                            const playbookData = C.Playbooks[playbookKey];
                            this.update({
                                "system.trauma.active": Object.fromEntries(playbookData.trauma.list.map((tCond) => [tCond, true])),
                                "system.trauma.checked": Object.fromEntries(playbookData.trauma.list.map((tCond) => [tCond, false]))
                            });
                            break;
                        }
                    }
                }
            }
        });
    }
    get playbook() {
        return this.items.find((item) => item.type === "playbook")?.name;
    }
    get attributes() {
        return {
            insight: Object.values(this.system.attributes.insight).filter(({ value }) => value > 0).length,
            prowess: Object.values(this.system.attributes.prowess).filter(({ value }) => value > 0).length,
            resolve: Object.values(this.system.attributes.resolve).filter(({ value }) => value > 0).length
        };
    }
    get actions() {
        return U.objMap({
            ...this.system.attributes.insight,
            ...this.system.attributes.prowess,
            ...this.system.attributes.resolve
        }, ({ value, max }) => U.gsap.utils.clamp(value, 0, max));
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
    rollAttributePopup(attribute_name) {
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
        if (H.isAttributeAction(attribute_name)) {
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
        bladesRoll(this.attributes[attribute_name] + additional_dice_amount, attribute_name, position, effect, note);
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
export var Attributes;
(function (Attributes) {
    Attributes["insight"] = "insight";
    Attributes["prowess"] = "prowess";
    Attributes["resolve"] = "resolve";
})(Attributes || (Attributes = {}));
export var Actions;
(function (Actions) {
    let Insight;
    (function (Insight) {
        Insight["hunt"] = "hunt";
        Insight["study"] = "study";
        Insight["survey"] = "survey";
        Insight["tinker"] = "tinker";
    })(Insight = Actions.Insight || (Actions.Insight = {}));
    let Prowess;
    (function (Prowess) {
        Prowess["finesse"] = "finesse";
        Prowess["prowl"] = "prowl";
        Prowess["skirmish"] = "skirmish";
        Prowess["wreck"] = "wreck";
    })(Prowess = Actions.Prowess || (Actions.Prowess = {}));
    let Resolve;
    (function (Resolve) {
        Resolve["attune"] = "attune";
        Resolve["command"] = "command";
        Resolve["consort"] = "consort";
        Resolve["sway"] = "sway";
    })(Resolve = Actions.Resolve || (Actions.Resolve = {}));
})(Actions || (Actions = {}));
export var Positions;
(function (Positions) {
    Positions["controlled"] = "controlled";
    Positions["risky"] = "risky";
    Positions["desperate"] = "desperate";
})(Positions || (Positions = {}));
export var EffectLevels;
(function (EffectLevels) {
    EffectLevels["extreme"] = "extreme";
    EffectLevels["great"] = "great";
    EffectLevels["standard"] = "standard";
    EffectLevels["limited"] = "limited";
    EffectLevels["zero"] = "zero";
})(EffectLevels || (EffectLevels = {}));
export default BladesActor;