import { BladesSheet } from "./blades-sheet.js";

export class BladesFactionSheet extends BladesSheet {
    
        static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            classes: ["eunos-blades", "sheet", "actor", "faction"],
            template: "systems/eunos-blades/templates/faction-sheet.hbs",
            width: 900,
            height: "auto",
            tabs: [{ navSelector: ".tabs", contentSelector: ".tab-content" }]
        });
    }
    
        
        getData() {
        const data = super.getData();
        data.editable = this.options.editable;
        const actorData = data.data;
        data.actor = actorData;
        data.data = actorData.data;
        return data;
    }
    
        
        activateListeners(html) {
        super.activateListeners(html);
        
        if (!this.options.editable) {
            return;
        }
        
        html.find(".item-body").click(ev => {
            const element = $(ev.currentTarget).parents(".item");
            const item = this.actor.items.get(element.data("itemId"));
            item.sheet.render(true);
        });
        
        html.find(".item-delete").click(async (ev) => {
            const element = $(ev.currentTarget).parents(".item");
            await this.actor.deleteEmbeddedDocuments("Item", [element.data("itemId")]);
            element.slideUp(200, () => this.render(false));
        });
        
    }
}