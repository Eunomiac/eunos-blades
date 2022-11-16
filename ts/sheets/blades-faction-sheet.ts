
import BladesSheet from "./blades-sheet.js";

class BladesFactionSheet extends BladesSheet {

	static override get defaultOptions() {
	  return foundry.utils.mergeObject(super.defaultOptions, {
			classes: ["eunos-blades", "sheet", "actor", "faction"],
			template: "systems/eunos-blades/templates/faction-sheet.hbs",
			width: 900,
			height: "auto",
			tabs: [{navSelector: ".nav-tabs", contentSelector: ".tab-content"}]
		}) as ActorSheet.Options;
	}

	override activateListeners(html: JQuery<HTMLElement>) {
		super.activateListeners(html);

		// Everything below here is only needed if the sheet is editable
		if (!this.options.editable) {return}

		// Update Inventory Item
		html.find(".item-body").on("click", (event) => {
			const element = $(event.currentTarget).parents(".item");
			const item = this.actor.items.get(element.data("itemId"));
			item?.sheet?.render(true);
		});

	}
}

export default BladesFactionSheet;