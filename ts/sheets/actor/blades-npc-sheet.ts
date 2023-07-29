
import BladesSheet from "./blades-sheet.js";
import U from "../../core/utilities.js";
class BladesNPCSheet extends BladesSheet {

	static override get defaultOptions() {
	  return foundry.utils.mergeObject(super.defaultOptions, {
			classes: ["eunos-blades", "sheet", "actor", "npc"],
			template: "systems/eunos-blades/templates/npc-sheet.hbs",
			width: 500,
			height: 400,
			// height: "auto",
			tabs: [{navSelector: ".nav-tabs", contentSelector: ".tab-content", initial: "description"}]
		});
	}

	override getData() {
		const context = super.getData() as ReturnType<BladesSheet["getData"]> & {
			[key: string]: any
		};

		context.isSubActor = context.actor.isSubActor;
		context.parentActor = context.actor.parentActor;
		context.persona = context.actor.system.persona;

		const rStatus: Record<string, {size: "05"|number, label: string|null}> = {
			name: {size: 4, label: null},
			heritage: {size: 1, label: "Heritage"},
			profession: {size: 1, label: "Profession"},

			gender: {size: 1, label: "Gender"},
			appearance: {size: 1, label: "Appearance"},

			goal: {size: 2, label: "Goal"},
			method: {size: 2, label: "Method"},

			trait1: {size: "05", label: null},
			trait2: {size: "05", label: null},
			trait3: {size: "05", label: null},

			interests: {size: 4, label: "Interests"},
			quirk: {size: 4, label: "Quirk"},
			style: {size: 2, label: "Style"}
		};

		for (const [key] of Object.entries(context.persona)) {
			if (key in rStatus) {
				Object.assign(
					context.persona[key],
					rStatus[key]
				);
			}
		}

		return context;
	}

	override activateListeners(html: JQuery<HTMLElement>) {
		super.activateListeners(html);

		// Everything below here is only needed if the sheet is editable
		if (!this.options.editable) {return}

		html.find(".gm-alert-header").on("click", async (event) => {
			event.preventDefault();

			this.actor.clearParentActor();
		});

		//~ Configure Tagify input elements
		// const inputElement = document.querySelector('input[name="system.harm.heavy.one"]');
		// if (inputElement instanceof HTMLInputElement) { new Tagify(inputElement, {}) } else { console.log("Not an HTMLInputElement")}

		//~ Enable Randomize Button for NPCs
		html.find("[data-action=\"randomize\"").on("click", (event) => {
			this.actor.updateRandomizers();
		});

		//~ Enable status toggles for NPC subactors
		html.find(".comp-status-toggle")
			.on("click", () => {
				const {tags} = this.actor;
				if (this.actor.system.status === 1) {
					U.remove(tags, "Friend");
					tags.push("Rival");
					this.actor.update({
						"system.status": -1,
						"system.tags": U.unique(tags)
					});
				} else {
					U.remove(tags, "Rival");
					tags.push("Friend");
					this.actor.update({
						"system.status": 1,
						"system.tags": U.unique(tags)
					});
				}
			})
			.on("contextmenu", () => {
				this.actor.update({"system.status": 0});
			});

	}
}

export default BladesNPCSheet;