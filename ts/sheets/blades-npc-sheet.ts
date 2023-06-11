
import BladesSheet from "./blades-sheet.js";
import type BladesActor from "../blades-actor.js";
import Tagify from "../../lib/tagify/tagify.esm.js";

class BladesNPCSheet extends BladesSheet {

	static override get defaultOptions() {
	  return foundry.utils.mergeObject(super.defaultOptions, {
			classes: ["eunos-blades", "sheet", "actor", "npc"],
			template: "systems/eunos-blades/templates/npc-sheet.hbs",
			width: 500,
			// height: "auto",
			tabs: [{navSelector: ".nav-tabs", contentSelector: ".tab-content", initial: "description"}]
		});
	}

	override async getData() {
		const data = await super.getData();
		Object.assign(
			data,
			{
				randomizers: (this.actor as BladesActor).system.randomizers
			}
		);
		return data;
	}

	override activateListeners(html: JQuery<HTMLElement>) {
		super.activateListeners(html);

		// Everything below here is only needed if the sheet is editable
		if (!this.options.editable) {return}

		//~ Configure Tagify input elements
		const inputElement = document.querySelector('input[name="data.harm.heavy.one"]');
		if (inputElement instanceof HTMLInputElement) { new Tagify(inputElement, {}) } else { console.log("Not an HTMLInputElement")}

		//~ Enable Randomize Button for NPCs
		// if ((this.actor as BladesActor).system.type === "npc") {
		html.find("[data-action=\"randomize\"").on("click", (event) => {
			(this.actor as BladesActor).updateRandomizers();
		});
		// }

	}
}

export default BladesNPCSheet;