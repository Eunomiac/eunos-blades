import H from "./core/helpers.js";
import U from "./core/utilities.js";
import C, {Randomizers} from "./core/constants.js";

import type {ActorDataConstructorData} from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/actorData.js";
import {bladesRoll} from "./blades-roll.js";
import type {DocumentModificationOptions} from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/abstract/document.mjs.js";
import BladesItem from "./blades-item.js";
import type BladesActiveEffect from "./blades-active-effect";

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

	// override getRollData() {
	// 	const data = super.getRollData() as object & {dice_amount: Record<string,number>};
	// 	data.dice_amount = this.getAttributeDiceToThrow();
	// 	return data;
	// }

	override async _onCreateEmbeddedDocuments(embName: string, docs: Array<BladesItem|BladesActiveEffect>, ...args: [
		Array<Record<string, unknown>>,
		DocumentModificationOptions,
		string
	]) {
		await super._onCreateEmbeddedDocuments(embName, docs, ...args);

		eLog.log("onCreateEmbeddedDocuments", {embName, docs, args});

		docs.forEach(async (doc) => {
			// eLog.log(`... docs.forEach -> ${doc.name} = ${(doc as BladesItem).type} (${doc instanceof BladesItem})`, doc);
			if (doc instanceof BladesItem) {
				switch (doc.type) {
					case "playbook": {
						if (doc.name && doc.name in C.Playbooks) {
							await this.update({
								"system.trauma.active": null,
								"system.trauma.checked": null
							});
							const playbookKey: KeyOf<typeof C.Playbooks> = "trauma" in C.Playbooks[doc.name as KeyOf<typeof C.Playbooks>]
								? doc.name as KeyOf<typeof C.Playbooks>
								: "DEFAULTS" as KeyOf<typeof C.Playbooks>;
							const playbookData = C.Playbooks[playbookKey] as ValueOf<typeof C.Playbooks> & {trauma: {list: string[]}};
							this.update({
								"system.trauma.active": Object.fromEntries(playbookData.trauma.list.map((tCond: string) => [tCond, true])),
								"system.trauma.checked": Object.fromEntries(playbookData.trauma.list.map((tCond: string) => [tCond, false]))
							});
							break;
						}
					}
					// no default
				}
			}
		});
	}

	get playbook() {
		return this.items.find((item) => item.type === "playbook")?.name;
	}

	get attributes(): Record<Attributes,number> {
		return {
			insight: Object.values(this.system.attributes.insight).filter(({value}) => value > 0).length,
			prowess: Object.values(this.system.attributes.prowess).filter(({value}) => value > 0).length,
			resolve: Object.values(this.system.attributes.resolve).filter(({value}) => value > 0).length
		};
	}

	get actions(): Record<Actions.Any,number> {
		return U.objMap({
			...this.system.attributes.insight,
			...this.system.attributes.prowess,
			...this.system.attributes.resolve
		}, ({value, max}: ValueMax) => U.gsap.utils.clamp(value, 0, max)) as Record<Actions.Any, number>;
	}

	get trauma(): number {
		return Object.keys(this.system.trauma?.checked ?? {})
			.filter((traumaName: string) => {
				return this.system.trauma.active[traumaName] && this.system.trauma.checked[traumaName];
			})
			.length;
	}

	get traumaConditions(): Record<string,boolean> {
		return U.objFilter(
			this.system.trauma?.checked ?? {},
			(v: unknown, traumaName: string) => Boolean(traumaName in this.system.trauma.active && this.system.trauma.active[traumaName])
		) as Record<string, boolean>;
	}
	/**
   * Calculate Attribute Dice to throw.
   */


	rollAttributePopup(attribute_name: Attributes) {

		// const roll = new Roll("1d20 + @abilities.wis.mod", actor.getRollData());
		const attribute_label: Capitalize<Attributes> = U.tCase(attribute_name);

		let content = `
        <h2>${game.i18n.localize("BITD.Roll")} ${attribute_label}</h2>
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
					callback: async (html: HTMLElement|JQuery<HTMLElement>) => {
						if (html instanceof HTMLElement) {
							html = $(html);
						}
						const modifier = parseInt(`${html.find('[name="mod"]').attr("value") ?? 0}`);
						const position: Positions = `${html.find('[name="pos"]').attr("value") ?? Positions.risky}` as Positions;
						const effect: EffectLevels = `${html.find('[name="fx"]').attr("value") ?? EffectLevels.standard}` as EffectLevels;
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

	async rollAttribute(
		attribute_name: Attributes,
		additional_dice_amount = 0,
		position: Positions = Positions.risky,
		effect: EffectLevels = EffectLevels.standard,
		note?: string
	) {
		bladesRoll(
			this.attributes[attribute_name] + additional_dice_amount,
			attribute_name,
			position,
			effect,
			note
		);
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
			style: (gender?: string) => sampleArray([
				...((gender ?? "").charAt(0).toLowerCase() !== "m" ? Randomizers.style.female : []),
				...((gender ?? "").charAt(0).toLowerCase() !== "f" ? Randomizers.style.male : [])
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

export enum Attributes {
	insight = "insight",
	prowess = "prowess",
	resolve = "resolve"
}
export namespace Actions {
	export enum Insight {
		hunt = "hunt",
		study = "study",
		survey = "survey",
		tinker = "tinker"
	}
	export enum Prowess {
		finesse = "finesse",
		prowl = "prowl",
		skirmish = "skirmish",
		wreck = "wreck"
	}
	export enum Resolve {
		attune = "attune",
		command = "command",
		consort = "consort",
		sway = "sway"
	}
	export type Any = Insight|Prowess|Resolve;
}
export enum Positions {
	controlled = "controlled",
	risky = "risky",
	desperate = "desperate"
}
export enum EffectLevels {
	extreme = "extreme",
	great = "great",
	standard = "standard",
	limited = "limited",
	zero = "zero"
}

type RandomizerData = {
	isLocked: boolean,
	value: string,
	size: 1|2|4,
	label: string|null
};

type ContactData = {
	type: string,
	actor: string|BladesActor,
	attitude: 1|-1
}

declare interface BladesActor {
	system: Actor["data"]["data"] & {
			full_name: string,
			crew: string|BladesActor,
			acquaintances: {
				name: string,
				list: ContactData[],
				vice_purveyor: string|BladesActor
			},
			notes: string,
			gm_notes: string,
			vice: {
				name: string,
				override: string|{name: string, img: string}
			},
			stress: NamedValueMax,
			trauma: {
				name: string,
				max: number,
				active: Record<string,boolean|null>,
				checked: Record<string,boolean|null>
			},
			healing: ValueMax,
			experience: {
				playbook: ValueMax,
				[Attributes.insight]: ValueMax,
				[Attributes.prowess]: ValueMax,
				[Attributes.resolve]: ValueMax,
				clues: string[]
			},
			coins: ValueMax,
			stash: ValueMax,
			loadout: {
				selected: string,
				levels: {
					light: number,
					normal: number,
					heavy: number,
					encumbered: number
				}
			},
			harm: {
				light: {
					one: string,
					two: string
				},
				medium: {
					one: string,
					two: string
				},
				heavy: {
					one: string
				}
			},
			armor: {
				active: {
					light: boolean,
					heavy: boolean,
					special: boolean
				},
				checked: {
					light: boolean,
					heavy: boolean,
					special: boolean
				}
			},
			attributes: Record<Attributes, Record<Actions.Any,ValueMax>>,
			tier: number,
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
		}
	parent: TokenDocument | null;
}

export default BladesActor;