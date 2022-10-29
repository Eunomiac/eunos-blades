/* ****▌███████████████████████████████████████████████████████████████████████████▐**** *\
|*     ▌████░░░░░░░░░░░ Euno's Blades in the Dark for Foundry VTT ░░░░░░░░░░░░░████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░ by Eunomiac ░░░░░░░░░░░░░██████████████████▐     *|
|*     ▌████████████████████████████  License █ v0.1.0 ████████████████████████████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░░░░░░  ░░░░░░░░░░░░░░░░░░███████████████████▐     *|
\* ****▌███████████████████████████████████████████████████████████████████████████▐**** */

import H from "../core/helpers.js";
import U from "../core/utilities.js";
class BladesSheet extends ActorSheet {
    async getData() {
        const data = await super.getData();
        const actorData = data.data;
        Object.assign(data, {
            editable: this.options.editable,
            isGM: game.user.isGM,
            actor: actorData,
            data: actorData.data
        });
        eLog.log("actorData", actorData);
        eLog.log("game.actors.get", game.actors.get(actorData.data.crew));
        if (actorData.data.crew) {
            const crew = game.actors.get(actorData.data.crew);
            if (crew && crew.type === "crew") {
                Object.assign(data.data, {
                    crew
                });
            }
        }
        return data;
    }
    activateListeners(html) {
        super.activateListeners(html);
        if (game.user.isGM) {
            html.attr("style", "--secret-text-display: initial");
        }
        else {
            html.find(".editor:not(.tinymce) [data-is-secret=\"true\"]").remove();
        }
        if (!this.options.editable) {
            return;
        }
        html.find(".dotline").each((i, elem) => {
            const target = $(elem).data("target");
            const curValue = U.pInt($(elem).data("value"));
            $(elem).find(".dot").each((j, dot) => {
                $(dot).on("click", (event) => {
                    event.preventDefault();
                    const thisValue = U.pInt($(dot).data("value"));
                    if (thisValue !== curValue) {
                        this.actor.update({ [target]: thisValue });
                    }
                });
            });
        });
        html.find(".item-add-popup").on("click", (event) => {
            this._onItemAddClick(event);
        });
        html.find(".update-box").on("click", this._onUpdateBoxClick.bind(this));
        if (this.options.submitOnChange) {
            html.on("change", "textarea", this._onChangeInput.bind(this));
        }
        html.find(".roll-die-attribute").on("click", this._onRollAttributeDieClick.bind(this));
    }
    async _onItemAddClick(event) {
        event.preventDefault();
        const item_type = $(event.currentTarget).data("itemType");
        const distinct = $(event.currentTarget).data("distinct");
        const input_type = typeof distinct === "undefined" ? "checkbox" : "radio";
        const items = await H.getAllItemsByType(item_type, game);
        let html = "<div class=\"items-to-add\">";
        items.forEach(e => {
            let addition_price_load = "";
            if (typeof e.system.load !== "undefined") {
                addition_price_load += `(${e.system.load})`;
            }
            else if (typeof e.system.price !== "undefined") {
                addition_price_load += `(${e.system.price})`;
            }
            html += `<input id="select-item-${e.data._id}" type="${input_type}" name="select_items" value="${e.data._id}">`;
            html += `<label class="flex-horizontal" for="select-item-${e.id}">`;
            html += `${game.i18n.localize(e.data.name)} ${addition_price_load} <i class="tooltip fas fa-question-circle"><span class="tooltiptext">${game.i18n.localize(e.system.description)}</span></i>`;
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
        const items = await H.getAllItemsByType(item_type, game);
        const items_to_add = [];
        el.find("input:checked").each(function addItems() {
            const item = items.find(e => e.data._id === $(this).val());
            if (item) {
                items_to_add.push(item.data);
            }
        });
        await BladesItem.create(items_to_add, { parent: this.document });
    }
        async _onRollAttributeDieClick(event) {
        const attribute_name = $(event.currentTarget).data("rollAttribute");
        this.actor.rollAttributePopup(attribute_name);
    }
    async _onUpdateBoxClick(event) {
        event.preventDefault();
        const item_id = $(event.currentTarget).data("item");
        let update_value = $(event.currentTarget).data("value");
        const update_type = $(event.currentTarget).data("utype");
        if (update_value === undefined) {
            update_value = document.getElementById("fac-" + update_type + "-" + item_id)?.value;
        }
        let update;
        if (update_type === "status") {
            update = { _id: item_id, data: { status: { value: update_value } } };
        }
        else if (update_type === "hold") {
            update = { _id: item_id, data: { hold: { value: update_value } } };
        }
        else {
            eLog.error("update attempted for type undefined in blades-sheet.js onUpdateBoxClick function");
            return;
        }
        await this.actor.updateEmbeddedDocuments("Item", [update]);
    }
}
export default BladesSheet;