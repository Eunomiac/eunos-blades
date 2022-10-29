import H from "./core/helpers.js";
import type BladesActor from "./blades-actor.js";
import type {ItemData} from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/module.mjs";

const CUSTOMFUNCS = {
	addItem: async (actor: BladesActor, {name, type}: {name: string, type: string}) => {
		eLog.log("addItem", {actor, name, type});
		// Check if actor already has an item of that name.
		if (actor.items.find((item) => item.name === name && item.type === type)) { return }

		const itemsOfType = await H.getAllItemsByType(type, game);
		const newItem = itemsOfType.find((iData) => iData.name === name);
		if (newItem) {
			actor.createEmbeddedDocuments("Item", [newItem.data as ItemData & Record<string,unknown>]);
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

class BladesActiveEffect extends ActiveEffect {
	static Initialize() {
		CONFIG.ActiveEffect.documentClass = BladesActiveEffect;
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
   * Manage Active Effect instances through the Actor Sheet via effect control buttons.
   * @param {MouseEvent} event      The left-click event on the effect control
   * @param {Actor|Item} owner      The owning entity which manages this effect
   */
	static onManageActiveEffect(event: ClickEvent, owner: Actor|Item) {
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
				eLog.log("delete effect");
				return effect.delete();
			case "toggle":
				return effect.update({disabled: !effect.data.disabled});
			// no default
		}
		return null;
	}
}

export default BladesActiveEffect;