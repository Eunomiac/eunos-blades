// import {ItemDataConstructorData} from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/itemData";
// import {BladesItem} from "./blades-item";

// export default class ClockKeeper {

// 	public static ClockOverlay?: ClockKeeper;
// 	static #OverlayElement: HTMLElement;
// 	static async Initialize() {
// 		Hooks.once("ready", async () => {
// 			this.ClockOverlay = game.items!.find((item) => item.name === "Clock Keeper") as ClockKeeper | undefined;
// 			if (!this.ClockOverlay) {
// 				this.ClockOverlay = new ClockKeeper();
// 			}
// 		});
// 		return loadTemplates([
// 			"systems/eunos-blades/templates/clock-overlay.hbs",
// 			"systems/eunos-blades/templates/clocks/clock-3.hbs",
// 			"systems/eunos-blades/templates/clocks/clock-4.hbs",
// 			"systems/eunos-blades/templates/clocks/clock-5.hbs",
// 			"systems/eunos-blades/templates/clocks/clock-6.hbs",
// 			"systems/eunos-blades/templates/clocks/clock-8.hbs",
// 			"systems/eunos-blades/templates/clocks/clock-10.hbs",
// 			"systems/eunos-blades/templates/clocks/clock-12.hbs",
// 			"systems/eunos-blades/templates/parts/clock-clip-paths.hbs"
// 		]);
// 	}

// 	constructor(data: ItemDataConstructorData) {
// 		super(data);
// 		this.renderOverlay();
// 	}

// 	async renderOverlay() {
// 		const overlayTemplate = (await getTemplate("systems/eunos-blades/templates/clock-overlay.hbs"))(this);
// 		ClockKeeper.#OverlayElement = $("body.vtt.game.system-eunos-blades").append(overlayTemplate)[0];
// 		// ClockKeeper.#OverlayElement.innerHTML =
// 	}
// }