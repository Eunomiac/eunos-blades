/* ****▌███████████████████████████████████████████████████████████████████████████▐**** *\
|*     ▌████░░░░░░░░░░░ Euno's Blades in the Dark for Foundry VTT ░░░░░░░░░░░░░████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░ by Eunomiac ░░░░░░░░░░░░░██████████████████▐     *|
|*     ▌████████████████████████████  License █ v0.1.0 ████████████████████████████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░░░░░░  ░░░░░░░░░░░░░░░░░░███████████████████▐     *|
\* ****▌███████████████████████████████████████████████████████████████████████████▐**** */

import BladesItem from "./blades-item.js";
const FUNCQUEUE = {};
const CUSTOMFUNCS = {
    addItem: async (actor, { name, type }) => {
        eLog.checkLog("activeEffects", "addItem", { actor, name, type });
        if (actor.items.find((item) => item.name === name && item.type === type)) {
            eLog.error("... Item Already Added: Skipping");
            return;
        }
        const itemsOfType = await BladesItem.getAllItemsByType(type);
        const newItem = itemsOfType.find((iData) => iData.name === name);
        if (newItem) {
            await actor.createEmbeddedDocuments("Item", [newItem.data]);
        }
    },
    remItem: async (actor, { name, type }) => {
        eLog.checkLog("activeEffects", "remItem", { actor, name, type });
        const reversePattern = name.startsWith("!");
        const namePat = new RegExp(name.replace(/^!/, ""));
        const itemsToRemove = actor.items
            .filter((item) => (reversePattern
            ? !namePat.test(item.name ?? "")
            : namePat.test(item.name ?? "")) && item.type === type)
            .map((item) => item.id);
        if (itemsToRemove.length) {
            await actor.deleteEmbeddedDocuments("Item", itemsToRemove);
        }
    }
};
class BladesActiveEffect extends ActiveEffect {
    static Initialize() {
        CONFIG.ActiveEffect.documentClass = BladesActiveEffect;
        Hooks.on("applyActiveEffect", (actor, { effect, key, priority }, currentValue, { func, params }) => {
            if (typeof func === "string" && func in CUSTOMFUNCS) {
                BladesActiveEffect.ThrottleCustomFunc(func, actor, params);
            }
        });
    }
    static ThrottleCustomFunc(func, actor, params) {
        if (!actor.id) {
            return;
        }
        eLog.display(`Throttling Func: ${func}(${params.name, params.type})`);
        if (actor.id && actor.id in FUNCQUEUE) {
            if (FUNCQUEUE[actor.id].queue.find((funcData) => JSON.stringify(funcData) === JSON.stringify({ func, params }))) {
                eLog.error("... Function ALREADY QUEUED, SKIPPING");
                return;
            }
            FUNCQUEUE[actor.id].queue.push({ func, params });
            eLog.checkLog("activeEffects", "... Function Running: Queuing");
            return;
        }
        eLog.display("... Creating New FUNCQUEUE, RUNNING:");
        FUNCQUEUE[actor.id] = {
            curFunc: BladesActiveEffect.RunCustomFunc(actor, CUSTOMFUNCS[func](actor, params)),
            queue: []
        };
    }
    static async RunCustomFunc(actor, funcPromise) {
        if (!actor.id) {
            return;
        }
        eLog.checkLog("activeEffects", "... Running Func ...");
        await funcPromise;
        eLog.checkLog("activeEffects", "... Function Complete!");
        if (FUNCQUEUE[actor.id].queue.length) {
            const { func, params } = FUNCQUEUE[actor.id].queue.shift();
            eLog.display(`Progressing Queue: ${func}(${params.name, params.type}) -- ${FUNCQUEUE[actor.id].queue.length} remaining funcs.`);
            FUNCQUEUE[actor.id].curFunc = BladesActiveEffect.RunCustomFunc(actor, CUSTOMFUNCS[func](actor, params));
        }
        else {
            eLog.display("Function Queue Complete! Deleting.");
            delete FUNCQUEUE[actor.id];
        }
    }
        static onManageActiveEffect(event, owner) {
        event.preventDefault();
        const a = event.currentTarget;
        if (a.dataset.action === "create") {
            return owner.createEmbeddedDocuments("ActiveEffect", [{
                    label: "New Effect",
                    icon: "systems/eunos-blades/assets/icons/Icon.3_13.png",
                    origin: owner.uuid
                }]);
        }
        const selector = a.closest("tr");
        if (selector === null) {
            return null;
        }
        const effect = selector.dataset.effectId ? owner.effects.get(selector.dataset.effectId) : null;
        if (!effect) {
            return null;
        }
        switch (a.dataset.action) {
            case "edit":
                return effect.sheet?.render(true);
            case "delete":
                eLog.checkLog("activeEffects", "delete effect");
                return effect.delete();
            case "toggle":
                return effect.update({ disabled: !effect.data.disabled });
        }
        return null;
    }
}
export default BladesActiveEffect;