/**
 * @extends {ItemSheet}
 */
export default class EunoTrackerSheet extends ItemSheet {

	/** @override */
	static override get defaultOptions() {
	  return foundry.utils.mergeObject(super.defaultOptions, {
			classes: ["eunos-blades", "sheet", "item", "tracker"],
			template: "systems/eunos-blades/templates/tracker-sheet.hbs",
			width: 900,
			height: "auto",
			tabs: [{navSelector: ".tabs", contentSelector: ".tab-content"}],
			viewPermissions: 0
		});
	}

	static async Initialize() {
		Items.registerSheet("blades", EunoTrackerSheet, {types: ["gm_tracker"], makeDefault: true});
		return loadTemplates(["systems/eunos-blades/templates/tracker-sheet.hbs"]);
	}

	/* -------------------------------------------- */

	/** @override */
	override async getData() {
		const data: Record<string, any> = await super.getData();
		data.editable = this.options.editable;
		const actorData = data.data;
		data.actor = actorData;
		data.data = actorData.data;
		return data as ItemSheet.Data<DocumentSheetOptions>;
	}

	/* -------------------------------------------- */

	/** @override */
	override activateListeners(html: JQuery<HTMLElement>) {
		super.activateListeners(html);

		// Everything below here is only needed if the sheet is editable
		if (!this.options.editable) {return}

		// Update Inventory Item
		// html.find('.item-body').click(ev => {
		//   const element = $(ev.currentTarget).parents(".item");
		//   const item = this.actor.items.get(element.data("itemId"));
		//   item.sheet.render(true);
		// });

		// // Delete Inventory Item
		// html.find('.item-delete').click(ev => {
		//   const element = $(ev.currentTarget).parents(".item");
		//   this.actor.deleteEmbeddedDocuments("Item", [element.data("itemId")]);
		//   element.slideUp(200, () => this.render(false));
		// });

	}
}