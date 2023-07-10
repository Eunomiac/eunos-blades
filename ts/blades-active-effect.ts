import type BladesActor from "./blades-actor.js";
import type {ItemData} from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/module.mjs";
import BladesItem from "./blades-item.js";
import {Tag} from "./core/constants.js";

const FUNCQUEUE: Record<string, {
	curFunc: BladesCustomResult,
	queue: BladesCustomEffectData[]
}> = {};

const CUSTOMFUNCS = {
	addItem: async (actor: BladesActor, {name, type}: {name: string, type: string}) => {
		eLog.checkLog("activeEffects", "addItem", {actor, name, type});
	},
	remItem: async (actor: BladesActor, {name, type}: {name: string, type: string}) => {
		eLog.checkLog("activeEffects", "remItem", {actor, name, type});
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
			eLog.checkLog("activeEffects", "... Function Running: Queuing");
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
		eLog.checkLog("activeEffects", "... Running Func ...");
		await funcPromise;
		eLog.checkLog("activeEffects", "... Function Complete!");
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
		const effect = selector.dataset.effectId ? owner.effects.get(selector.dataset.effectId) as BladesActiveEffect : null;
		if (!effect) { return null }
		switch ( a.dataset.action ) {
			case "edit":
				return effect.sheet?.render(true);
			case "delete":
				eLog.checkLog("activeEffects", "delete effect");
				return effect.delete();
			case "toggle":
				return effect.update({disabled: !effect.disabled});
			// no default
		}
		return null;
	}

	override get isSuppressed() {
		// Get source item from 'origin' field -- of form 'Actor.<id>.Item.<id>'
		if (!/Actor.*Item/.test(this.origin)) { return super.isSuppressed }
		const [actorID, itemID] = this.origin.replace(/Actor\.|Item\./g, "").split(".");
		const actor = game.actors.get(actorID) as BladesActor;
		const item = actor.items.get(itemID) as BladesItem;
		return super.isSuppressed || item.hasTag(Tag.System.Archived);
	}
}

declare interface BladesActiveEffect {
	origin: string
	disabled: boolean
}

export default BladesActiveEffect;