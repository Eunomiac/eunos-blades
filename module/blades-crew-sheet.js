import { BladesSheet } from "./blades-sheet.js";

export class BladesCrewSheet extends BladesSheet {
    
        static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            classes: ["eunos-blades", "sheet", "actor", "crew"],
            template: "systems/eunos-blades/templates/crew-sheet.hbs",
            width: 940,
            height: 1020,
            tabs: [{ navSelector: ".tabs", contentSelector: ".tab-content", initial: "turfs" }]
        });
    }
    
        
        getData() {
        const data = super.getData();
        data.editable = this.options.editable;
        const actorData = data.data;
        data.actor = actorData;
        data.data = actorData.data;
        

        let turfs_amount = 0;
        
        data.items.forEach(item => {
            
            if (item.type === "crew_type") {
                Object.entries(item.data.turfs).forEach(([key, turf]) => {
                    if (game.i18n.localize(turf.name).toLowerCase().replace(/\s/g, "") === game.i18n.localize("BITD.Turf").toLowerCase().replace(/\s/g, "")) {
                        turfs_amount += turf.value ? 1 : 0;
                    }
                });
            }
            
        });
        data.data.turfs_amount = turfs_amount;
        
        return data;
    }
    
        
        activateListeners(html) {
        super.activateListeners(html);
        
        if (!this.options.editable) {
            return;
        }
        
        html.find(".item-sheet-open").click(ev => {
            const element = $(ev.currentTarget).parents(".item");
            const item = this.actor.items.get(element.data("itemId"));
            item.sheet.render(true);
        });
        
        html.find(".item-delete").click(async (ev) => {
            const element = $(ev.currentTarget).parents(".item");
            await this.actor.deleteEmbeddedDocuments("Item", [element.data("itemId")]);
            element.slideUp(200, () => this.render(false));
        });
        
        html.find(".add-item").click(ev => {
            BladesHelpers._addOwnedItem(ev, this.actor);
        });
        
        html.find(".turf-select").click(async (ev) => {
            const element = $(ev.currentTarget).parents(".item");
            
            const item_id = element.data("itemId");
            const turf_id = $(ev.currentTarget).data("turfId");
            const turf_current_status = $(ev.currentTarget).data("turfStatus");
            const turf_checkbox_name = "data.turfs." + turf_id + ".value";
            
            await this.actor.updateEmbeddedDocuments("Item", [{
                    _id: item_id,
                    [turf_checkbox_name]: !turf_current_status
                }]);
            this.render(false);
        });
        
        html.find('.cohort-block-harm input[type="radio"]').change(async (ev) => {
            const element = $(ev.currentTarget).parents(".item");
            
            const item_id = element.data("itemId");
            const harm_id = $(ev.currentTarget).val();
            
            await this.actor.updateEmbeddedDocuments("Item", [{
                    "_id": item_id,
                    "data.harm": [harm_id]
                }]);
            this.render(false);
        });
    }
    
                
        async _updateObject(event, formData) {
        
        await super._updateObject(event, formData);
        
        if (event.target && event.target.name === "data.tier") {
            this.render(true);
        }
    }
}