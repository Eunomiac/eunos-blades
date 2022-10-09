import {BladesActor} from "./blades-actor";
import {BladesItem} from "./blades-item";
import BladesHelpers from "./euno-helpers.js";

/**
 * Extend the base ActiveEffect class to implement system-specific logic.
 * @extends {ActiveEffect}
 */

const CUSTOMFUNCS = {
	addItem: async (actor: BladesActor, {name, type}: {name: string, type: string}) => {
		const itemsOfType = await BladesHelpers.getAllItemsByType(type, game);
		console.log("All the Items:", itemsOfType);
		const newItem = itemsOfType.find((iData) => iData.name === name) as undefined | (Record<string,unknown> & BladesItem["data"]);
		console.log("Found Item:", newItem);
		if (newItem) {
			// actor.createEmbeddedDocuments("Item", [newItem]);
		}
	}
};

type EffectChangeData = {
	effect: BladesActiveEffect,
	key: string,
	mode: number,
	priority: number,
	value: string
};

type BladesCustomEffectData = {
	func: string,
	params: Parameters<ValueOf<typeof CUSTOMFUNCS>>[1]
}

export default class BladesActiveEffect extends ActiveEffect {
	static Initialize() {
	/**
	 * A hook event that fires when a custom active effect is applied.
	 * @param {Actor} actor                   The actor the active effect is being applied to
	 * @param {EffectChangeData} change       The change data being applied
	 * @param {*} current                     The current value being modified
	 * @param {*} delta                       The parsed value of the change object
	 * @param {object} changes                An object which accumulates changes to be applied
	 */

		Hooks.on("applyActiveEffect", (
			actor: BladesActor,
			{effect, key, priority}: EffectChangeData,
			currentValue: unknown,
			{func, params}: BladesCustomEffectData
		) => {
			if (typeof func === "string" && func in CUSTOMFUNCS) {
				CUSTOMFUNCS[func as keyof typeof CUSTOMFUNCS](actor, params);
			}
		});
	}

	/**
   * Is this active effect currently suppressed?
   * @type {boolean}
   */
	_isSuppressed = false;
	override get isSuppressed() { return this._isSuppressed }
	override set isSuppressed(v: boolean) { this._isSuppressed = v }

	/* --------------------------------------------- */
	/** @inheritdoc */
	// apply(actor, change) {
	// 	if ( this.isSuppressed ) {return null}
	// 	// this allows for math and actor data references in the change values. Probably not necessary for
	// 	// blades, but it was simple, and you never know what users will do. Probably ruin everything.
	// 	change.value = Roll.replaceFormulaData(change.value, actor.data);
	// 	try {
	// 		change.value = Roll.safeEval(change.value).toString();
	// 	} catch (e) {
	// 		// this is a valid case, e.g., if the effect change simply is a string
	// 	}
	// 	let parsed;
	// 	try{
	// 		parsed = JSON.parse(change.value);
	// 	} catch(e){
	// 		// throw new Error("Error blades-active-effect.js ln 31", e);
	// 	}
	// 	if(parsed instanceof Array){
	// 		change.value = parsed;
	// 	}
	// 	return super.apply(actor, change);
	// }
	/* --------------------------------------------- */

	/**
   * Manage Active Effect instances through the Actor Sheet via effect control buttons.
   * @param {MouseEvent} event      The left-click event on the effect control
   * @param {Actor|Item} owner      The owning entity which manages this effect
   */
	static onManageActiveEffect(event: MouseEvent, owner: Actor|Item) {
		event.preventDefault();
		const a = event.currentTarget as HTMLElement;
		const selector = a.closest("tr");
		if (selector === null) { return null }
		const effect = selector.dataset.effectId ? owner.effects.get(selector.dataset.effectId) : null;
		if (!effect) { return null }
		switch ( a.dataset.action ) {
			case "create":
				return owner.createEmbeddedDocuments("ActiveEffect", [{
					"label": "New Effect",
					"icon": "systems/eunos-blades/assets/icons/Icon.3_13.png",
					"origin": owner.uuid,
					"duration.rounds": selector.dataset.effectType === "temporary" ? 1 : undefined,
					"disabled": selector.dataset.effectType === "inactive"
				}]);
			case "edit":
				return effect.sheet?.render(true);
			case "delete":
				console.log("delete effect");
				return effect.delete();
			case "toggle":
				return effect.update({disabled: !effect.data.disabled});
			// no default
		}
		return null;
	}


	/**
   * Prepare the data structure for Active Effects which are currently applied to an Actor or Item.
   * @param {ActiveEffect[]} effects    The array of Active Effect instances to prepare sheet data for
   * @return {object}                   Data for rendering
   */
	static prepareActiveEffectCategories(effects: BladesActiveEffect[]) {
		type EffectCategory = {type: string, label: string, effects: BladesActiveEffect[] }

		// Define effect header categories
		const categories: Record<string, EffectCategory> = {
			temporary: {
				type: "temporary",
				label: "Temporary Effects",
				effects: []
			},
			passive: {
				type: "passive",
				label: "Passive Effects",
				effects: []
			},
			inactive: {
				type: "inactive",
				label: "Inactive Effects",
				effects: []
			},
			suppressed: {
				type: "suppressed",
				label: "Suppressed Effects",
				effects: []
			}

		};

		// Iterate over active effects, classifying them into categories
		for ( const e of effects ) {
			e._getSourceName(); // Trigger a lookup for the source name
			if ( e.isSuppressed ) {
				categories.suppressed.effects.push(e);
			} else if (e.data.disabled) {
				categories.inactive.effects.push(e);
			} else if (e.isTemporary) {
				categories.temporary.effects.push(e);
			} else {
				categories.passive.effects.push(e);
			}
		}
		return categories;
	}
}

// Portions of this code are copyright 2021 Andrew Clayton
//
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
