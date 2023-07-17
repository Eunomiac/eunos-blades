
import BladesSheet from "./blades-sheet.js";

type BladesClockData = {
	value: number,
	size: number
}

interface BladesFactionSheetData {
	goal_1_clock: BladesClockData,
	goal_2_clock: BladesClockData
}

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

	override getData() {
		const context = super.getData() as ReturnType<BladesSheet["getData"]>;

		const sheetData: Partial<BladesFactionSheetData> = {};

		if (context.actor.system.goal_1.max > 0) {
			sheetData.goal_1_clock = {
				value: context.actor.system.goal_1.value,
				size: context.actor.system.goal_1.max
			};
		}
		if (context.actor.system.goal_2.max > 0) {
			sheetData.goal_2_clock = {
				value: context.actor.system.goal_2.value,
				size: context.actor.system.goal_2.max
			};
		}

		return {
			...context,
			...sheetData
		};
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