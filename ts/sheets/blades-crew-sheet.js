
import {BladesSheet} from "./blades-sheet.js";

/**
 * @extends {BladesSheet}
 */
export class BladesCrewSheet extends BladesSheet {

	/** @override */
	static get defaultOptions() {
	  return foundry.utils.mergeObject(super.defaultOptions, {
			classes: ["eunos-blades", "sheet", "actor", "crew"],
			template: "systems/eunos-blades/templates/crew-sheet.hbs",
			width: 940,
			height: 1020,
			tabs: [{navSelector: ".tabs", contentSelector: ".tab-content", initial: "turfs"}]
		});
	}

	/* -------------------------------------------- */

	/** @override */
	getData() {
		const data = super.getData();
		data.editable = this.options.editable;
		const actorData = data.data;
		data.actor = actorData;
		data.data = actorData.data;

		// Calculate Turfs amount.
		// We already have Lair, so set to -1.
		let turfs_amount = 0;

		data.items.forEach(item => {

			if (item.type === "crew_type") {
				// Object.entries(item.data.turfs).forEach(turf => {turfs_amount += (turf.value === true) ? 1 : 0});
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

	/* -------------------------------------------- */

	/** @override */
	activateListeners(html) {
		super.activateListeners(html);

		// Everything below here is only needed if the sheet is editable
		if (!this.options.editable) 		{return}

		// Update Inventory Item
		html.find(".item-sheet-open").click(ev => {
			const element = $(ev.currentTarget).parents(".item");
			const item = this.actor.items.get(element.data("itemId"));
			item.sheet.render(true);
		});

		// Delete Inventory Item
		html.find(".item-delete").click( async ev => {
			const element = $(ev.currentTarget).parents(".item");
			await this.actor.deleteEmbeddedDocuments("Item", [element.data("itemId")]);
			element.slideUp(200, () => this.render(false));
		});

		// Add a new Cohort
		html.find(".add-item").click(ev => {
			// @ts-expect-error MIGRATION PAINS
			BladesHelpers._addOwnedItem(ev, this.actor);
		});

		// Toggle Turf
		html.find(".turf-select").click( async ev => {
			const element = $(ev.currentTarget).parents(".item");

			const item_id = element.data("itemId");
			const turf_id = $(ev.currentTarget).data("turfId");
			const turf_current_status = $(ev.currentTarget).data("turfStatus");
			const turf_checkbox_name = "data.turfs." + turf_id + ".value";

			await this.actor.updateEmbeddedDocuments("Item", [{
				_id: item_id,
				[turf_checkbox_name]: !turf_current_status}]);
			this.render(false);
		});

		// Cohort Block Harm handler
		html.find('.cohort-block-harm input[type="radio"]').change( async ev => {
			const element = $(ev.currentTarget).parents(".item");

			const item_id = element.data("itemId");
			const harm_id = $(ev.currentTarget).val();

			await this.actor.updateEmbeddedDocuments("Item", [{
				"_id": item_id,
				"data.harm": [harm_id]}]);
			this.render(false);
		});
	}

	/* -------------------------------------------- */
	/*  Form Submission                             */
	/* -------------------------------------------- */

	/** @override */
	async _updateObject(event, formData) {

		// Update the Item
		await super._updateObject(event, formData);

		if (event.target && event.target.name === "data.tier") {
			this.render(true);
		}
	}
	/* -------------------------------------------- */

}
