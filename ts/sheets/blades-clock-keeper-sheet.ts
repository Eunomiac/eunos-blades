
import BladesItemSheet from "./blades-item-sheet.js";
import BladesItem from "../blades-item.js";

export default class BladesClockKeeperSheet extends BladesItemSheet {

	static override get defaultOptions() {
	  return foundry.utils.mergeObject(super.defaultOptions, {
			classes: ["eunos-blades", "sheet", "item", "clock-keeper"],
			template: "systems/eunos-blades/templates/items/clock_keeper-sheet.hbs",
			width: 700,
			height: 970
		});
	}

	static async Initialize() {
		game.eunoblades ??= {};
		Items.registerSheet("blades", BladesClockKeeperSheet, {types: ["clock_keeper"], makeDefault: true});
		Hooks.once("ready", async () => {
			let clockKeeper: BladesItem|undefined = game.items.find((item) => item.type === "clock_keeper");
			if (!(clockKeeper instanceof BladesItem)) {
				clockKeeper = (await BladesItem.create({
					name: "Clock Keeper",
					type: "clock_keeper",
					img: "systems/eunos-blades/assets/icons/clock-keeper.svg"
				})) as BladesItem;
			}
			game.eunoblades.ClockKeeper = clockKeeper;
			game.eunoblades.ClockKeeper.renderOverlay();
		});
		Hooks.on("canvasReady", async () => { game.eunoblades.ClockKeeper?.renderOverlay() });
		return loadTemplates([
			"systems/eunos-blades/templates/items/clock_keeper-sheet.hbs",
			"systems/eunos-blades/templates/parts/clock-sheet-row.hbs"
		]);
	}


	override async _updateObject(event: unknown, formData: any) {
		const updateData = await this.object.update(formData);
		socketlib.system.executeForEveryone("renderOverlay");
		// (this.item as BladesItem).renderOverlay();
		return updateData;
	}

	override async getData() {
		const data = await super.getData();
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
		if (keyID) {
			(this.item as BladesItem).deleteClockKey(keyID);
		}
	}

	setKeySize(event: InputEvent) {
		event.preventDefault();
		const keyID = (event.target as HTMLInputElement).dataset.id;
		if (keyID) {
			(this.item as BladesItem).setKeySize(keyID, parseInt((event.target as HTMLInputElement).value));
		}
	}

	override async activateListeners(html: JQuery<HTMLElement>) {
		super.activateListeners(html);

		// @ts-expect-error Fuck.
		html.find("[data-action=\"add-key\"").on("click", this.addKey.bind(this));
		// @ts-expect-error Fuck.
		html.find("[data-action=\"delete-key\"").on("click", this.deleteKey.bind(this));
		// @ts-expect-error Fuck.
		html.find(".clock-counter").on("change", this.setKeySize.bind(this));
	}
}
