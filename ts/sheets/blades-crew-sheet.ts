import BladesSheet from "./blades-sheet.js";

class BladesCrewSheet extends BladesSheet {

	static override get defaultOptions() {
	  return foundry.utils.mergeObject(super.defaultOptions, {
			classes: ["eunos-blades", "sheet", "actor", "crew"],
			template: "systems/eunos-blades/templates/crew-sheet.hbs",
			width: 940,
			height: 1020,
			tabs: [{navSelector: ".tabs", contentSelector: ".tab-content", initial: "turfs"}]
		});
	}

	override async getData() {
		const data = await super.getData();

		// Calculate Turfs amount.
		// We already have Lair, so set to -1.
		let turfs_amount = 0;

		data.items.forEach((item) => {
			if (item.type === "crew_type" && item.data) {
			// @ts-expect-error Need to figure out what's returned by data.items.
				Object.entries(item.data.turfs).forEach(([key, turf]: [any, any]) => {
					if (game.i18n.localize(turf.name).toLowerCase().replace(/\s/g, "") === game.i18n.localize("BITD.Turf").toLowerCase().replace(/\s/g, "")) {
						turfs_amount += turf.value ? 1 : 0;
					}
				});
			}

		});

		Object.assign(
			data.data,
			{
				turfs_amount
			}
		);

		return data;
	}

	override activateListeners(html: JQuery<HTMLElement>) {
		super.activateListeners(html);

		// Everything below here is only needed if the sheet is editable
		if (!this.options.editable) 		{return}

		// Update Inventory Item
		html.find(".item-sheet-open").on("click", (event) => {
			const element = $(event.currentTarget).parents(".item");
			const item = this.actor.items.get(element.data("itemId"));
			item?.sheet?.render(true);
		});

		// Delete Inventory Item
		html.find(".item-delete").on("click", async (event) => {
			const element = $(event.currentTarget).parents(".item");
			await this.actor.deleteEmbeddedDocuments("Item", [element.data("itemId")]);
			element.slideUp(200, () => this.render(false));
		});

		// Add a new Cohort
		html.find(".add-item").on("click", (event) => {
			event.preventDefault();
			const a = event.currentTarget;
			const item_type = a.dataset.itemType;

			const data = {
				name: randomID(),
				type: item_type
			};
			return this.actor.createEmbeddedDocuments("Item", [data]);
		});

		// Toggle Turf
		html.find(".turf-select").on("click", async (event) => {
			const element = $(event.currentTarget).parents(".item");

			const item_id = element.data("itemId");
			const turf_id = $(event.currentTarget).data("turfId");
			const turf_current_status = $(event.currentTarget).data("turfStatus");
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

	override async _updateObject(event: Event, formData: object) {

		// Update the Item
		await super._updateObject(event, formData);

		if (event.target && $(event.target).attr("name") === "data.tier") {
			this.render(true);
		}
	}
	/* -------------------------------------------- */

}

export default BladesCrewSheet;