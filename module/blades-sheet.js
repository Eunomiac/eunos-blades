export class BladesSheet extends ActorSheet {
    
        
        activateListeners(html) {
        super.activateListeners(html);
        html.find(".item-add-popup").click(this._onItemAddClick.bind(this));
        html.find(".update-box").click(this._onUpdateBoxClick.bind(this));
        
        if (this.options.submitOnChange) {
            html.on("change", "textarea", this._onChangeInput.bind(this));
        }
        
        html.find(".roll-die-attribute").click(this._onRollAttributeDieClick.bind(this));
    }
    
        
    async _onItemAddClick(event) {
        event.preventDefault();
        const item_type = $(event.currentTarget).data("itemType");
        const distinct = $(event.currentTarget).data("distinct");
        let input_type = "checkbox";
        
        if (typeof distinct !== "undefined") {
            input_type = "radio";
        }
        
        const items = await BladesHelpers.getAllItemsByType(item_type, game);
        
        let html = "<div class=\"items-to-add\">";
        
        items.forEach(e => {
            let addition_price_load = "";
            
            if (typeof e.data.load !== "undefined") {
                addition_price_load += `(${e.data.load})`;
            }
            else if (typeof e.data.price !== "undefined") {
                addition_price_load += `(${e.data.price})`;
            }
            
            html += `<input id="select-item-${e._id}" type="${input_type}" name="select_items" value="${e._id}">`;
            html += `<label class="flex-horizontal" for="select-item-${e._id}">`;
            html += `${game.i18n.localize(e.name)} ${addition_price_load} <i class="tooltip fas fa-question-circle"><span class="tooltiptext">${game.i18n.localize(e.data.description)}</span></i>`;
            html += "</label>";
        });
        
        html += "</div>";
        
        const options = {
        };
        
        const dialog = new Dialog({
            "title": `${game.i18n.localize("Add")} ${item_type}`,
            "content": html,
            "buttons": {
                one: {
                    icon: '<i class="fas fa-check"></i>',
                    label: game.i18n.localize("Add"),
                    callback: async (html) => await this.addItemsToSheet(item_type, $(html).find(".items-to-add"))
                },
                two: {
                    icon: '<i class="fas fa-times"></i>',
                    label: game.i18n.localize("Cancel"),
                    callback: () => false
                }
            },
            "default": "two"
        }, options);
        
        dialog.render(true);
    }
    
        
    async addItemsToSheet(item_type, el) {
        
        const items = await BladesHelpers.getAllItemsByType(item_type, game);
        const items_to_add = [];
        
        el.find("input:checked").each(function addItems() {
            items_to_add.push(items.find(e => e._id === $(this).val()));
        });
        
        await Item.create(items_to_add, { parent: this.document });
    }
        
        async _onRollAttributeDieClick(event) {
        
        const attribute_name = $(event.currentTarget).data("rollAttribute");
        this.actor.rollAttributePopup(attribute_name);
        
    }
    
        
    async _onUpdateBoxClick(event) {
        event.preventDefault();
        const item_id = $(event.currentTarget).data("item");
        var update_value = $(event.currentTarget).data("value");
        const update_type = $(event.currentTarget).data("utype");
        if (update_value === undefined) {
            update_value = document.getElementById("fac-" + update_type + "-" + item_id).value;
        }
        let update;
        if (update_type === "status") {
            update = { _id: item_id, data: { status: { value: update_value } } };
        }
        else if (update_type === "hold") {
            update = { _id: item_id, data: { hold: { value: update_value } } };
        }
        else {
            console.log("update attempted for type undefined in blades-sheet.js onUpdateBoxClick function");
            return;
        }
        
        await this.actor.updateEmbeddedDocuments("Item", [update]);
        
    }
}