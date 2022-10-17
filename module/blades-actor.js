import { bladesRoll } from "./blades-roll.js";
import BladesHelpers from "./euno-helpers.js";
import { RANDOMIZERS } from "./euno-randomizers.js";

export class BladesActor extends Actor {
    
        static async create(data, options = {}) {
        data.token = data.token || {};
        
        // For Crew and Character set the Token to sync with charsheet.
        switch (data.type) {
            case "character":
            case "crew":
                data.token.actorLink = true;
                break;
        }
        
        return super.create(data, options);
    }
    
        getRollData() {
        const data = super.getRollData();
        data.dice_amount = this.getAttributeDiceToThrow();
        return data;
    }
    
        getAttributeDiceToThrow() {
        
        const dice_amount = {};
        for (const attribute_name in this.system.attributes) {
            dice_amount[attribute_name] = 0;
            for (const skill_name in this.system.attributes[attribute_name].skills) {
                dice_amount[skill_name] = parseInt(this.system.attributes[attribute_name].skills[skill_name].value[0]);
                
                if (dice_amount[skill_name] > 0) {
                    dice_amount[attribute_name]++;
                }
            }
            
        }
        
        return dice_amount;
    }
    
    rollAttributePopup(attribute_name) {
        
        const attribute_label = BladesHelpers.getAttributeLabel(attribute_name);
        
        let content = `
        <h2>${game.i18n.localize("BITD.Roll")} ${game.i18n.localize(attribute_label)}</h2>
        <form>
          <div class="form-group">
            <label>${game.i18n.localize("BITD.Modifier")}:</label>
            <select id="mod" name="mod">
              ${this.createListOfDiceMods(-3, +3, 0)}
            </select>
          </div>`;
        if (BladesHelpers.isAttributeAction(attribute_name)) {
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
            <input  id="pos" name="pos" type="hidden" value="">
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
            "title": `${game.i18n.localize("BITD.Roll")} ${game.i18n.localize(attribute_label)}`,
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
                        const position = `${html.find('[name="pos"]').attr("value") ?? 0}`;
                        const effect = `${html.find('[name="fx"]').attr("value") ?? 0}`;
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
    
    async rollAttribute(attribute_name, additional_dice_amount, position, effect, note) {
        attribute_name ??= "";
        additional_dice_amount ??= 0;
        
        let dice_amount = 0;
        if (attribute_name !== "") {
            const roll_data = this.getRollData();
            dice_amount += roll_data.dice_amount[attribute_name];
        }
        else {
            dice_amount = 1;
        }
        dice_amount += additional_dice_amount;
        
        await bladesRoll(dice_amount, attribute_name, position, effect, note);
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
                        ? sampleArray(RANDOMIZERS.name_title)
                        : "",
                    sampleArray([
                        ...((gender ?? "").charAt(0).toLowerCase() !== "m" ? RANDOMIZERS.name_first.female : []),
                        ...((gender ?? "").charAt(0).toLowerCase() !== "f" ? RANDOMIZERS.name_first.male : [])
                    ]),
                    `"${sampleArray(RANDOMIZERS.name_alias)}"`,
                    sampleArray(RANDOMIZERS.name_surname),
                    Math.random() <= suffixChance
                        ? sampleArray(RANDOMIZERS.name_suffix)
                        : ""
                ].filter((val) => Boolean(val)).join(" ");
            },
            gender: () => sampleArray(RANDOMIZERS.gender)[0],
            heritage: () => sampleArray(RANDOMIZERS.heritage)[0],
            appearance: () => sampleArray(RANDOMIZERS.appearance)[0],
            goal: () => sampleArray(RANDOMIZERS.goal, [this.system.randomizers.goal.value])[0],
            method: () => sampleArray(RANDOMIZERS.method, [this.system.randomizers.goal.value])[0],
            profession: () => sampleArray(RANDOMIZERS.profession, [this.system.randomizers.goal.value])[0],
            trait: () => sampleArray(RANDOMIZERS.trait, [this.system.randomizers.trait_1.value, this.system.randomizers.trait_2.value, this.system.randomizers.trait_3.value], 1),
            interests: () => sampleArray(RANDOMIZERS.interests)[0],
            quirk: () => sampleArray(RANDOMIZERS.quirk)[0],
            style: (gender) => sampleArray([
                ...((gender ?? "").charAt(0).toLowerCase() !== "m" ? RANDOMIZERS.style.female : []),
                ...((gender ?? "").charAt(0).toLowerCase() !== "f" ? RANDOMIZERS.style.male : [])
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
                : sampleArray(RANDOMIZERS.trait, [this.system.randomizers.trait_1.value, this.system.randomizers.trait_2.value, this.system.randomizers.trait_3.value], 1)[0];
            const trait2 = this.system.randomizers.trait_2.isLocked
                ? this.system.randomizers.trait_2.value
                : sampleArray(RANDOMIZERS.trait, [trait1, this.system.randomizers.trait_1.value, this.system.randomizers.trait_2.value, this.system.randomizers.trait_3.value], 1)[0];
            const trait3 = this.system.randomizers.trait_3.isLocked
                ? this.system.randomizers.trait_3.value
                : sampleArray(RANDOMIZERS.trait, [trait1, trait2, this.system.randomizers.trait_1.value, this.system.randomizers.trait_2.value, this.system.randomizers.trait_3.value], 1)[0];
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
    
        createListOfActions() {
        
        let text = "", attribute, skill;
        const { attributes } = this.system;
        
        for (attribute in attributes) {
            
            const { skills } = attributes[attribute];
            
            text += `<optgroup label="${attribute} Actions">`;
            text += `<option value="${attribute}">${attribute} (Resist)</option>`;
            
            for (skill in skills) {
                text += `<option value="${skill}">${skill}</option>`;
            }
            
            text += "</optgroup>";
            
        }
        
        return text;
        
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