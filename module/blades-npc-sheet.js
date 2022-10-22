import { BladesSheet } from "./blades-sheet.js";

export class BladesNPCSheet extends BladesSheet {
    
        static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            classes: ["eunos-blades", "sheet", "actor", "npc"],
            template: "systems/eunos-blades/templates/npc-sheet.hbs",
            width: 500,
            tabs: [{ navSelector: ".tabs", contentSelector: ".tab-content", initial: "description" }]
        });
    }
    
        
        getData() {
        const data = super.getData();
        const actorData = "data" in data ? data.data : null;
        Object.assign(data, {
            editable: this.options.editable,
            isGM: game.user.isGM,
            actor: actorData,
            data: actorData.data,
            randomizers: this.actor.system.randomizers
        });
        return data;
    }
    
        
        activateListeners(html) {
        super.activateListeners(html);
        
        if (!this.options.editable) {
            return;
        }
        
        // Enable Randomize Button for NPCs
        html.find("[data-action=\"randomize\"").on("click", (event) => {
            this.actor.updateRandomizers();
        });
        

        

        
    }
}