/* ****▌███████████████████████████████████████████████████████████████████████████▐**** *\
|*     ▌████░░░░░░░░░░░ Euno's Blades in the Dark for Foundry VTT ░░░░░░░░░░░░░████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░ by Eunomiac ░░░░░░░░░░░░░██████████████████▐     *|
|*     ▌████████████████████████████  License █ v0.1.0 ████████████████████████████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░░░░░░  ░░░░░░░░░░░░░░░░░░███████████████████▐     *|
\* ****▌███████████████████████████████████████████████████████████████████████████▐**** */

import H from "./core/helpers.js";
const CUSTOMFUNCS = {
    addItem: async (actor, { name, type }) => {
        eLog.log("addItem", { actor, name, type });
        if (actor.items.find((item) => item.name === name && item.type === type)) {
            return;
        }
        const itemsOfType = await H.getAllItemsByType(type, game);
        const newItem = itemsOfType.find((iData) => iData.name === name);
        if (newItem) {
            actor.createEmbeddedDocuments("Item", [newItem.data]);
        }
    }
};
class BladesActiveEffect extends ActiveEffect {
    static Initialize() {
        CONFIG.ActiveEffect.documentClass = BladesActiveEffect;
        Hooks.on("applyActiveEffect", (actor, { effect, key, priority }, currentValue, { func, params }) => {
            if (typeof func === "string" && func in CUSTOMFUNCS) {
                CUSTOMFUNCS[func](actor, params);
            }
        });
    }
        static onManageActiveEffect(event, owner) {
        event.preventDefault();
        const a = event.currentTarget;
        const selector = a.closest("tr");
        if (selector === null) {
            return null;
        }
        const effect = selector.dataset.effectId ? owner.effects.get(selector.dataset.effectId) : null;
        if (!effect) {
            return null;
        }
        switch (a.dataset.action) {
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
                return effect.update({ disabled: !effect.data.disabled });
        }
        return null;
    }
}
export default BladesActiveEffect;