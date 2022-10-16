export function onManageActiveEffect(event, owner) {
    event.preventDefault();
    const a = event.currentTarget;
    const selector = a.closest("tr");
    const effect = selector.dataset.effectId ? owner.effects.get(selector.dataset.effectId) : null;
    switch (a.dataset.action) {
        case "create":
            owner.createEmbeddedDocuments("ActiveEffect", [{
                    "label": "New Effect",
                    "icon": "systems/eunos-blades/assets/icons/Icon.3_13.png",
                    "origin": owner.uuid,
                    "duration.rounds": selector.dataset.effectType === "temporary" ? 1 : undefined,
                    "disabled": selector.dataset.effectType === "inactive"
                }]);
            return;
        case "edit":
            effect.sheet.render(true);
            return;
        case "delete":
            console.log("delete effect");
            effect.delete();
            return;
        case "toggle":
            effect.update({ disabled: !effect.data.disabled });
            return;
    }
}

export function prepareActiveEffectCategories(effects) {
    
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
        }
    };
    
    for (const e of effects) {
        e._getSourceName();
        if (e.data.disabled) {
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