import { BladesSheet } from "./blades-sheet.js";

export class BladesNPCSheet extends BladesSheet {
    
        static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            classes: ["eunos-blades", "sheet", "actor", "npc"],
            template: "systems/eunos-blades/templates/npc-sheet.hbs",
            width: 500,
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
        

        

        
    }
}