import H from "./core/helpers.js";
import type BladesActor from "./blades-actor.js";
import type {ItemData} from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/module.mjs";
import type BladesItem from "./blades-item.js";

const FUNCQUEUE: Record<string, {
	curFunc: BladesCustomResult,
	queue: BladesCustomEffectData[]
}> = {};

const CUSTOMFUNCS = {
	addItem: async (actor: BladesActor, {name, type}: {name: string, type: string}) => {
		eLog.log("addItem", {actor, name, type});

		// Check if actor already has an item of that name.
		if (actor.items.find((item) => item.name === name && item.type === type)) {
			eLog.error("... Item Already Added: Skipping");
			return;
		}

		const itemsOfType = await H.getAllItemsByType(type, game);
		const newItem = itemsOfType.find((iData) => iData.name === name);
		if (newItem) {
			await actor.createEmbeddedDocuments("Item", [newItem.data as ItemData & Record<string,unknown>]);
		}
	},
	remItem: async (actor: BladesActor, {name, type}: {name: string, type: string}) => {
		eLog.log("remItem", {actor, name, type});
		// Convert name into regular expression pattern (for multiple removals)
		// If name begins with '!', it means to invert the RegExp pattern.
		const reversePattern = name.startsWith("!");
		const namePat = new RegExp(name.replace(/^!/, ""));
		// Assemble list of matching owned items
		const itemsToRemove = actor.items
			.filter((item): item is BladesItem & {id: string} => (reversePattern
				? !namePat.test(item.name ?? "")
				: namePat.test(item.name ?? "")) && item.type === type)
			.map((item) => item.id);
		if (itemsToRemove.length) {
			await actor.deleteEmbeddedDocuments("Item", itemsToRemove);
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

type BladesCustomFuncName = KeyOf<typeof CUSTOMFUNCS>;
type BladesCustomFuncParams = Parameters<ValueOf<typeof CUSTOMFUNCS>>[1];

type BladesCustomFunc = (actor: BladesActor, params: BladesCustomFuncParams) => Promise<void>;
type BladesCustomResult = ReturnType<BladesCustomFunc>;

type BladesCustomEffectData = {
	func: BladesCustomFuncName,
	params: BladesCustomFuncParams
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
				BladesActiveEffect.ThrottleCustomFunc(func as BladesCustomFuncName, actor, params);
			}
		});
	}

	static ThrottleCustomFunc(func: BladesCustomFuncName, actor: BladesActor, params: BladesCustomEffectData["params"]) {
		if (!actor.id) { return }
		eLog.display(`Throttling Func: ${func}(${params.name, params.type})`);
		// Is there a currently-running function for this actor?
		if (actor.id && actor.id in FUNCQUEUE) {
			// Is this a duplicate of a function already queued?
			if (FUNCQUEUE[actor.id].queue.find((funcData: BladesCustomEffectData) => JSON.stringify(funcData) === JSON.stringify({func, params}))) {
				eLog.error("... Function ALREADY QUEUED, SKIPPING");
				return;
			}
			FUNCQUEUE[actor.id].queue.push({func, params});
			eLog.log("... Function Running: Queuing");
			return;
		}
		// If not, create FUNCQUEUE entry and run first function.
		eLog.display("... Creating New FUNCQUEUE, RUNNING:");
		FUNCQUEUE[actor.id] = {
			curFunc: BladesActiveEffect.RunCustomFunc(actor, CUSTOMFUNCS[func](actor, params)),
			queue: []
		};
	}

	static async RunCustomFunc(actor: BladesActor, funcPromise: Promise<void>): Promise<void> {
		if (!actor.id) { return }
		eLog.log("... Running Func ...");
		await funcPromise;
		eLog.log("... Function Complete!");
		if (FUNCQUEUE[actor.id].queue.length) {
			const {func, params} = FUNCQUEUE[actor.id].queue.shift() as BladesCustomEffectData;
			eLog.display(`Progressing Queue: ${func}(${params.name, params.type}) -- ${FUNCQUEUE[actor.id].queue.length} remaining funcs.`);
			FUNCQUEUE[actor.id].curFunc = BladesActiveEffect.RunCustomFunc(actor, CUSTOMFUNCS[func](actor, params));
		} else {
			eLog.display("Function Queue Complete! Deleting.");
			delete FUNCQUEUE[actor.id];
		}
	}
	/**
   * Manage Active Effect instances through the Actor Sheet via effect control buttons.
   * @param {MouseEvent} event      The left-click event on the effect control
   * @param {Actor|Item} owner      The owning entity which manages this effect
   */
	static onManageActiveEffect(event: ClickEvent, owner: Actor|Item) {
		event.preventDefault();
		const a = event.currentTarget as HTMLElement;
		if (a.dataset.action === "create") {
			return owner.createEmbeddedDocuments("ActiveEffect", [{
				label: "New Effect",
				icon: "systems/eunos-blades/assets/icons/Icon.3_13.png",
				origin: owner.uuid
			}]);
		}
		const selector = a.closest("tr");
		if (selector === null) { return null }
		const effect = selector.dataset.effectId ? owner.effects.get(selector.dataset.effectId) : null;
		if (!effect) { return null }
		switch ( a.dataset.action ) {
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