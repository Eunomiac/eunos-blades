
import {BladesItemSheet} from "./blades-item-sheet.js";
import type {BladesItem} from "./blades-item.js";
import {ItemDataConstructorData} from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/itemData";

export default class EunoClockKeeperSheet extends BladesItemSheet {

	/** @override */
	static override get defaultOptions() {
	  return foundry.utils.mergeObject(super.defaultOptions, {
			classes: ["eunos-blades", "sheet", "item", "clock-keeper"],
			template: "systems/eunos-blades/templates/clock-keeper-sheet.hbs",
			width: 700,
			height: 970
		});
	}

	/** @override */
	override async _updateObject(event: unknown, formData: ItemDataConstructorData) {
		const updateData = await this.object.update(formData);
		(this.item as BladesItem).renderOverlay();
		return updateData;
	}

	/** @override */
	override getData() {
		const data = super.getData();
		// console.log("Clock Keeper GetData", data);
		// return data;
		// @ts-expect-error Fuck.
		data.data.clock_keys = Object.fromEntries(Object.entries(data.data.clock_keys)
			// @ts-expect-error Fuck.
			.filter(([keyID, keyData]) => Boolean(keyData && keyData.scene === data.data.targetScene)));
		return data;
	}

	addKey(event: MouseEvent) {
		event.preventDefault();
		(this.item as BladesItem).addClockKey();
	}

	deleteKey(event: MouseEvent) {
		event.preventDefault();
		const keyID = (event.currentTarget as HTMLElement).dataset.id;
		(this.item as BladesItem).deleteClockKey(keyID);
	}

	setKeySize(event: InputEvent) {
		event.preventDefault();
		const keyID = (event.target as HTMLInputElement).dataset.id;
		(this.item as BladesItem).setKeySize(keyID, parseInt((event.target as HTMLInputElement).value));
	}

	override async activateListeners(html: JQuery<HTMLElement>) {
		super.activateListeners(html);

		// @ts-expect-error Fuck.
		html.find(".key-add").on("click", this.addKey.bind(this));
		// @ts-expect-error Fuck.
		html.find(".key-delete").on("click", this.deleteKey.bind(this));
		// @ts-expect-error Fuck.
		html.find(".key-clock-counter").on("change", this.setKeySize.bind(this));
	}
}
