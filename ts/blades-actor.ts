import H from "./core/helpers.js";
import C from "./core/constants.js";
import type {ActorDataConstructorData} from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/actorData.js";
import {bladesRoll} from "./blades-roll.js";

class BladesActor extends Actor {

	static override async create(data: ActorDataConstructorData, options={}) {
		data.token = data.token || {};

		//~ For Crew and Character set the Token to sync with charsheet.
		switch (data.type) {
			case "character":
			case "crew":
				data.token.actorLink = true;
				break;
			// no default
		}

		return super.create(data, options);
	}

	override getRollData() {
		const data = super.getRollData() as object & {dice_amount: Record<string,number>};
		data.dice_amount = this.getAttributeDiceToThrow();
		return data;
	}

	/**
   * Calculate Attribute Dice to throw.
   */
	getAttributeDiceToThrow() {

		// Calculate Dice to throw.
		const dice_amount: Record<string,number> = {};
		for (const attribute_name in this.system.attributes) {
			dice_amount[attribute_name] = 0;
			for (const skill_name in this.system.attributes[attribute_name].skills) {
				dice_amount[skill_name] = parseInt(this.system.attributes[attribute_name].skills[skill_name].value[0]);

				// We add a +1d for every skill higher than 0.
				if (dice_amount[skill_name] > 0) {
					dice_amount[attribute_name]++;
				}
			}

		}

		return dice_amount;
	}

	rollAttributePopup(attribute_name: string) {

		// const roll = new Roll("1d20 + @abilities.wis.mod", actor.getRollData());
		const attribute_label = H.getAttributeLabel(attribute_name);

		let content = `
        <h2>${game.i18n.localize("BITD.Roll")} ${game.i18n.localize(attribute_label)}</h2>
        <form>
          <div class="form-group">
            <label>${game.i18n.localize("BITD.Modifier")}:</label>
            <select id="mod" name="mod">
              ${this.createListOfDiceMods(-3,+3,0)}
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
		} else {
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
					callback: async (html: HTMLElement|JQuery<HTMLElement>) => {
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

	async rollAttribute(attribute_name?: string, additional_dice_amount?: number, position?: string, effect?: string, note?: string) {
		attribute_name ??= "";
		additional_dice_amount ??= 0;

		let dice_amount = 0;
		if (attribute_name !== "") {
			const roll_data = this.getRollData();
			dice_amount += roll_data.dice_amount[attribute_name];
		} else {
			dice_amount = 1;
		}
		dice_amount += additional_dice_amount;

		await bladesRoll(dice_amount, attribute_name, position, effect, note);
	}

	updateRandomizers() {
		const rStatus: Record<string, Omit<RandomizerData, "value"|"isLocked">> = {
			name: {size: 4, label: null},
			heritage: {size: 1, label: "Heritage"},
			gender: {size: 1, label: "Gender"},
			appearance: {size: 2, label: "Appearance"},
			goal: {size: 4, label: "Goal"},
			method: {size: 4, label: "Method"},
			profession: {size: 2, label: "Profession"},
			trait_1: {size: 1, label: null},
			trait_2: {size: 1, label: null},
			trait_3: {size: 1, label: null},
			interests: {size: 4, label: "Interests"},
			quirk: {size: 4, label: "Quirk"},
			style: {size: 2, label: "Style"}
		};
		const titleChance = 0.05;
		const suffixChance = 0.01;
		function sampleArray(arr: string[], curVals: string[] = [], numVals = 1): string[] {
			arr = arr.filter((elem) => !curVals.includes(elem));
			if (!arr.length) { return [] }
			const returnVals: string[] = [];
			while (returnVals.length < numVals) {
				arr = arr.filter((elem) => ![...curVals, ...returnVals].includes(elem));
				if (!arr.length) { return returnVals }
				returnVals.push(arr[Math.floor(Math.random() * arr.length)]);
			}
			return returnVals;
		}
		const randomGen: Record<string, (gender?:string) => string|string[]|false> = {
			name: (gender?: string) => {
				return [
					Math.random() <= titleChance
						? sampleArray(C.Randomizers.name_title)
						: "",
					sampleArray([
						...((gender ?? "").charAt(0).toLowerCase() !== "m" ? C.Randomizers.name_first.female : []),
						...((gender ?? "").charAt(0).toLowerCase() !== "f" ? C.Randomizers.name_first.male : [])
					]),
					`"${sampleArray(C.Randomizers.name_alias)}"`,
					sampleArray(C.Randomizers.name_surname),
					Math.random() <= suffixChance
						? sampleArray(C.Randomizers.name_suffix)
						: ""
				].filter((val) => Boolean(val)).join(" ");
			},
			gender: () => sampleArray(C.Randomizers.gender)[0],
			heritage: () => sampleArray(C.Randomizers.heritage)[0],
			appearance: () => sampleArray(C.Randomizers.appearance)[0],
			goal: () => sampleArray(C.Randomizers.goal, [this.system.randomizers.goal.value])[0],
			method: () => sampleArray(C.Randomizers.method, [this.system.randomizers.goal.value])[0],
			profession: () => sampleArray(C.Randomizers.profession, [this.system.randomizers.goal.value])[0],
			trait: () => sampleArray(C.Randomizers.trait, [this.system.randomizers.trait_1.value, this.system.randomizers.trait_2.value, this.system.randomizers.trait_3.value], 1),
			interests: () => sampleArray(C.Randomizers.interests)[0],
			quirk: () => sampleArray(C.Randomizers.quirk)[0],
			style: (gender?: string) => sampleArray([
				...((gender ?? "").charAt(0).toLowerCase() !== "m" ? C.Randomizers.style.female : []),
				...((gender ?? "").charAt(0).toLowerCase() !== "f" ? C.Randomizers.style.male : [])
			], [this.system.randomizers.style.value])[0]
		};
		const gender = this.system.randomizers.gender.isLocked ? this.system.randomizers.gender.value : randomGen.gender() as string;
		const updateKeys = (Object.keys(this.system.randomizers) as Array<keyof BladesActor["system"]["randomizers"]>).filter((key) => !this.system.randomizers[key].isLocked);
		const updateData: Record<string,RandomizerData> = {};
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
					const randomVal = randomGen[key]() as string|false;
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
				: sampleArray(C.Randomizers.trait, [this.system.randomizers.trait_1.value, this.system.randomizers.trait_2.value, this.system.randomizers.trait_3.value], 1)[0];
			const trait2 = this.system.randomizers.trait_2.isLocked
				? this.system.randomizers.trait_2.value
				: sampleArray(C.Randomizers.trait, [trait1, this.system.randomizers.trait_1.value, this.system.randomizers.trait_2.value, this.system.randomizers.trait_3.value], 1)[0];
			const trait3 = this.system.randomizers.trait_3.isLocked
				? this.system.randomizers.trait_3.value
				: sampleArray(C.Randomizers.trait, [trait1, trait2, this.system.randomizers.trait_1.value, this.system.randomizers.trait_2.value, this.system.randomizers.trait_3.value], 1)[0];
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

	// /**
	//  * Create <options> for available actions
	//  *  which can be performed.
	//  */
	// createListOfActions() {

	// 	let text = "", attribute, skill;
	// 	const {attributes} = this.system;

	// 	for ( attribute in attributes ) {

	// 		const {skills} = attributes[attribute];

	// 		text += `<optgroup label="${attribute} Actions">`;
	// 		text += `<option value="${attribute}">${attribute} (Resist)</option>`;

	// 		for ( skill in skills ) {
	// 			text += `<option value="${skill}">${skill}</option>`;
	// 		}

	// 		text += "</optgroup>";

	// 	}

	// 	return text;

	// }

	/**
   * Creates <options> modifiers for dice roll.
   *
   * @param {int} rs
   *  Min die modifier
   * @param {int} re
   *  Max die modifier
   * @param {int} s
   *  Selected die
   */
	createListOfDiceMods(rs: number, re: number, s: number|string) {

		let text = "";

		if ( s === "" ) {
			s = 0;
		}

		for ( let i = rs; i <= re; i++ ) {
			let plus = "";
			if ( i >= 0 ) { plus = "+" }
			text += `<option value="${i}"`;
			if ( i === s ) {
				text += " selected";
			}

			text += `>${plus}${i}d</option>`;
		}

		return text;

	}
}

type RandomizerData = {
	isLocked: boolean,
	value: string,
	size: 1|2|4,
	label: string|null
};

declare interface BladesActor {
	system: Record<any,any> & {
		randomizers: {
			name: RandomizerData,
			gender: RandomizerData,
			heritage: RandomizerData,
			appearance: RandomizerData,
			goal: RandomizerData,
			method: RandomizerData,
			profession: RandomizerData,
			trait_1: RandomizerData,
			trait_2: RandomizerData,
			trait_3: RandomizerData,
			interests: RandomizerData,
			quirk: RandomizerData,
			style: RandomizerData
		}
	};
	parent: TokenDocument | null;
}

export default BladesActor;