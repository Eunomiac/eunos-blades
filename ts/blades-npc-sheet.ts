
import {BladesSheet} from "./blades-sheet.js";
import {BladesActor} from "./blades-actor.js";

/**
 * @extends {BladesSheet}
 */
// @ts-ignore-error Fuck
export class BladesNPCSheet extends BladesSheet {

	/** @override */
	static override get defaultOptions() {
	  return foundry.utils.mergeObject(super.defaultOptions, {
			classes: ["eunos-blades", "sheet", "actor", "npc"],
			template: "systems/eunos-blades/templates/npc-sheet.hbs",
			width: 500,
			height: "auto",
			tabs: [{navSelector: ".tabs", contentSelector: ".tab-content", initial: "description"}]
		});
	}

	/* -------------------------------------------- */

	/** @override */
	override getData() {
		const data = super.getData();
		const actorData = "data" in data ? data.data : null;
		Object.assign(
			data,
			{
				editable: this.options.editable,
				isGM: game.user.isGM,
				actor: actorData,
				data: actorData!.data,
				randomizers: (this.actor as BladesActor).system.randomizers
			}
		);
		return data;
	}

	/* -------------------------------------------- */

	/** @override */
	override activateListeners(html: JQuery<HTMLElement>) {
		super.activateListeners(html);

		// Everything below here is only needed if the sheet is editable
		if (!this.options.editable) {return}

		//~ Enable Randomize Button for NPCs
		// if ((this.actor as BladesActor).system.type === "npc") {
		html.find("[data-action=\"randomize\"").on("click", (event) => {
			(this.actor as BladesActor).updateRandomizers();
		});
		// }

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