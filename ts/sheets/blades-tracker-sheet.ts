
import BladesItemSheet from "./blades-item-sheet.js";
import BladesItem from "../blades-item.js";
import type {ItemDataConstructorData} from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/itemData";

export default class BladesTrackerSheet extends BladesItemSheet {

	static override get defaultOptions() {
	  return foundry.utils.mergeObject(super.defaultOptions, {
			classes: ["eunos-blades", "sheet", "item", "gm-tracker"],
			template: "systems/eunos-blades/templates/items/gm_tracker-sheet.hbs",
			width: 700,
			height: 970
		});
	}

	static async Initialize() {
		game.eunoblades ??= {};
		Items.registerSheet("blades", BladesTrackerSheet, {types: ["gm_tracker"], makeDefault: true});
		Hooks.once("ready", async () => {
			let tracker: BladesItem|undefined = game.items.find((item) => item.type === "gm_tracker");
			if (!(tracker instanceof BladesItem)) {
				tracker = (await BladesItem.create({
					name: "GM Tracker",
					type: "gm_tracker",
					img: "systems/eunos-blades/assets/icons/gm-tracker.svg"
				})) as BladesItem;
			}
			game.eunoblades.Tracker = tracker;
		});
		return loadTemplates([
			"systems/eunos-blades/templates/items/gm_tracker-sheet.hbs"
		]);
	}


	override async _updateObject(event: unknown, formData: ItemDataConstructorData) {
		const updateData = await this.object.update(formData);

		return updateData;
	}

	override async getData() {
		const data = await super.getData();

		return data;
	}

	override async activateListeners(html: JQuery<HTMLElement>) {
		super.activateListeners(html);

	}
}
