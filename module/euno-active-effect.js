import BladesHelpers from "./euno-helpers.js";

const CUSTOMFUNCS = {
    addItem: async (actor, { name, type }) => {
        console.log("addItem", { actor, name, type });
        if (actor.items.find((item) => item.name === name && item.type === type)) {
            return;
        }
        
        const itemsOfType = await BladesHelpers.getAllItemsByType(type, game);
        const newItem = itemsOfType.find((iData) => iData.name === name);
        if (newItem) {
            actor.createEmbeddedDocuments("Item", [newItem]);
        }
    }
};

export default class BladesActiveEffect extends ActiveEffect {
    static Initialize() {
                
        CONFIG.ActiveEffect.documentClass = BladesActiveEffect;
        Hooks.on("applyActiveEffect", (actor, { effect, key, priority }, currentValue, { func, params }) => {
            if (typeof func === "string" && func in CUSTOMFUNCS) {
                CUSTOMFUNCS[func](actor, params);
            }
        });
    }
    
        _isSuppressed = false;
    get isSuppressed() { return this._isSuppressed; }
    set isSuppressed(v) { this._isSuppressed = v; }
    
        
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
                console.log("delete effect");
                return effect.delete();
            case "toggle":
                return effect.update({ disabled: !effect.data.disabled });
        }
        return null;
    }
    
        static prepareActiveEffectCategories(effects) {
        
        const categories = {
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
        
        for (const e of effects) {
            e._getSourceName();
            if (e.isSuppressed) {
                categories.suppressed.effects.push(e);
            }
            else if (e.data.disabled) {
                categories.inactive.effects.push(e);
            }
            else if (e.isTemporary) {
                categories.temporary.effects.push(e);
            }
            else {
                categories.passive.effects.push(e);
            }
        }
        return categories;
    }
}

//
//
//