import BladesActiveEffect from "./euno-active-effect.js";

export class BladesItemSheet extends ItemSheet {
    
        static get defaultOptions() {
        
        return foundry.utils.mergeObject(super.defaultOptions, {
            classes: ["eunos-blades", "sheet", "item"],
            width: 560,
            height: "auto",
            tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description" }]
        });
    }
    
        
        get template() {
        if (this.item.data.type === "clock_keeper") {
            return "systems/eunos-blades/templates/clock-keeper-sheet.hbs";
        }
        const path = "systems/eunos-blades/templates/items";
        const simple_item_types = ["background", "heritage", "vice", "crew_reputation"];
        let template_name = `${this.item.data.type}`;
        
        if (simple_item_types.indexOf(this.item.data.type) >= 0) {
            template_name = "simple";
        }
        
        return `${path}/${template_name}.hbs`;
    }
    
        
        activateListeners(html) {
        super.activateListeners(html);
        
        if (!this.options.editable) {
            return;
        }
        
        html.find(".effect-control").click(ev => {
            if (this.item.isOwned) {
                ui.notifications.warn(game.i18n.localize("BITD.EffectWarning"));
                return;
            }
            BladesActiveEffect.onManageActiveEffect(ev, this.item);
        });
    }
    
        
        getData() {
        const data = super.getData();
        data.isGM = game.user.isGM;
        data.editable = this.options.editable;
        const itemData = data.data;
        data.actor = itemData;
        data.data = itemData.data;
        
        data.effects = BladesActiveEffect.prepareActiveEffectCategories(this.item.effects);
        return data;
    }
}