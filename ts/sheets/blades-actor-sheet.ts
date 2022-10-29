
import C from "../core/constants.js";
import U from "../core/utilities.js";
import BladesSheet from "./blades-sheet.js";
import BladesActiveEffect from "../blades-active-effect.js";

class BladesActorSheet extends BladesSheet {

	static override get defaultOptions() {
	  return foundry.utils.mergeObject(super.defaultOptions, {
			classes: ["eunos-blades", "sheet", "actor", "pc"],
			template: "systems/eunos-blades/templates/actor-sheet.hbs",
			width: 700,
			height: 970,
			tabs: [{navSelector: ".tabs", contentSelector: ".tab-content", initial: "abilities"}]
		});
	}

	/* -------------------------------------------- */

	override async getData() {
		const data = await super.getData();

		// Calculate Load
		let loadout = 0;
		// @ts-expect-error Need to figure out what's returned by data.items.
		data.items.forEach(i => {loadout += (i.type === "item") ? parseInt(i.system.load) : 0});
		loadout = U.gsap.utils.clamp(0, 10, loadout);

		// Isolate heritage/background/vice/class information
		const classItem = data.items.find((item) => item.type === "class");

		Object.assign(
			data,
			{
				effects: this.actor.effects,
				items: {
					"class": classItem,
					"classBgImg": classItem && classItem.name in C.ClassTagLines
						? C.ClassBgImages[classItem.name as keyof typeof C.ClassBgImages]
						: classItem?.img ?? "",
					"heritage": data.items.find((item) => item.type === "heritage"),
					"background": data.items.find((item) => item.type === "background"),
					"vice": data.items.find((item) => item.type === "vice"),
					"classTagLine": classItem && classItem.name in C.ClassTagLines
						? C.ClassTagLines[classItem.name as keyof typeof C.ClassTagLines]
						: ""
				},
				loadout,
				load_level: C.Encumbrance.loadLevel.default,
				load_levels: C.Encumbrance.loadLevel.options
			}
		);

		return data;
	}

	override activateListeners(html: JQuery<HTMLElement>) {
		super.activateListeners(html);

		// Everything below here is only needed if the sheet is editable
		if (!this.options.editable) {return}

		// Update Inventory Item
		html.find(".item-body").on("click", (ev) => {
			const element = $(ev.currentTarget).parents(".item");
			const item = this.actor.items.get(element.data("itemId"));
			item?.sheet?.render(true);
		});

		// Delete Inventory Item
		html.find(".item-delete").on("click", async (ev) => {
			const element = $(ev.currentTarget).parents(".item");
			await this.actor.deleteEmbeddedDocuments("Item", [element.data("itemId")]);
			element.slideUp(200, () => this.render(false));
		});

		// manage active effects
		html.find(".effect-control").on("click", (ev) => BladesActiveEffect.onManageActiveEffect(ev, this.actor));
	}
}

export default BladesActorSheet;