import BladesHelpers from "../euno-helpers.js";
import {BladesItem} from "../blades-item.js";
import type {ItemData} from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/module.mjs";
import type {ItemDataConstructorData} from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/itemData";
import {BladesActor} from "../blades-actor.js";

/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */

export class BladesSheet extends ActorSheet {

	/* -------------------------------------------- */

	/** @override */
	override activateListeners(html: JQuery<HTMLElement>) {
		super.activateListeners(html);

		// Handle removal or revealing of secret information content.
		if (game.user.isGM) {
			html.attr("style", "--secret-text-display: initial");
		} else {
			html.find(".editor:not(.tinymce) [data-is-secret=\"true\"]").remove();
		}

		// Everything below here is only needed if the sheet is editable
		if (!this.options.editable) {return}

		html.find(".item-add-popup").on("click", (event) => {
			this._onItemAddClick(event);
		});
		html.find(".update-box").on("click", this._onUpdateBoxClick.bind(this));

		// This is a workaround until is being fixed in FoundryVTT.
		if ( this.options.submitOnChange ) {
			html.on("change", "textarea", this._onChangeInput.bind(this));  // Use delegated listener on the form
		}

		html.find(".roll-die-attribute").on("click", this._onRollAttributeDieClick.bind(this));
	}

	/* -------------------------------------------- */

	async _onItemAddClick(event: ClickEvent) {
		event.preventDefault();

		const item_type = $(event.currentTarget).data("itemType");
		const distinct = $(event.currentTarget).data("distinct");
		const input_type = typeof distinct === "undefined" ? "checkbox" : "radio";
		const items = await BladesHelpers.getAllItemsByType(item_type, game);

		let html = "<div class=\"items-to-add\">";

		items.forEach(e => {
			let addition_price_load = "";

			if (typeof e.system.load !== "undefined") {
				addition_price_load += `(${e.system.load})`;
			} else if (typeof e.system.price !== "undefined") {
				addition_price_load += `(${e.system.price})`;
			}

			html += `<input id="select-item-${e.data._id}" type="${input_type}" name="select_items" value="${e.data._id}">`;
			html += `<label class="flex-horizontal" for="select-item-${e.id}">`;
			html += `${game.i18n.localize(e.data.name)} ${addition_price_load} <i class="tooltip fas fa-question-circle"><span class="tooltiptext">${game.i18n.localize(e.system.description)}</span></i>`;
			html += "</label>";
		});

		html += "</div>";

		const options = {
			// width: "500"
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

	/* -------------------------------------------- */

	async addItemsToSheet(item_type: string, el: JQuery<HTMLElement>) {

		const items = await BladesHelpers.getAllItemsByType(item_type, game);
		const items_to_add: ItemDataConstructorData[] = [];

		el.find("input:checked").each(function addItems() {
			const item = items.find(e => e.data._id === $(this).val());
			if (item) { items_to_add.push(item.data as ItemData & ItemDataConstructorData) }
		});

		// @ts-expect-error What the fuck type is the first parameter to BladesItem.create?!
		await BladesItem.create(items_to_add, {parent: this.document});
	}
	/* -------------------------------------------- */

	/**
   * Roll an Attribute die.
   * @param {*} event
   */
	async _onRollAttributeDieClick(event: ClickEvent) {

		const attribute_name = $(event.currentTarget).data("rollAttribute");
		(this.actor as BladesActor).rollAttributePopup(attribute_name);

	}

	/* -------------------------------------------- */

	async _onUpdateBoxClick(event: ClickEvent) {
		event.preventDefault();
		const item_id = $(event.currentTarget).data("item");
		let update_value = $(event.currentTarget).data("value");
		const update_type = $(event.currentTarget).data("utype");
		if ( update_value === undefined) {
			update_value = (document.getElementById("fac-" + update_type + "-" + item_id) as HTMLInputElement)?.value;
		}
		let update;
		if ( update_type === "status" ) {
			update = {_id: item_id, data:{status:{value: update_value}}};
		} else if (update_type === "hold") {
			update = {_id: item_id, data:{hold:{value: update_value}}};
		} else {
			console.log("update attempted for type undefined in blades-sheet.js onUpdateBoxClick function");
			return;
		}

		await this.actor.updateEmbeddedDocuments("Item", [update]);


	}

	/* -------------------------------------------- */

}