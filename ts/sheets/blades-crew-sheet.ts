import U from "../core/utilities.js";
import BladesSheet from "./blades-sheet.js";
import BladesActor from "../blades-actor.js";
import BladesItem from "../blades-item.js";
import {BladesActorType, BladesItemType} from "../core/constants.js";

class BladesCrewSheet extends BladesSheet {

	static override get defaultOptions() {
	  return foundry.utils.mergeObject(super.defaultOptions, {
			classes: ["eunos-blades", "sheet", "actor", "crew"],
			template: "systems/eunos-blades/templates/crew-sheet.hbs",
			width: 940,
			height: 1020,
			tabs: [{navSelector: ".nav-tabs", contentSelector: ".tab-content", initial: "claims"}]
		});
	}

	override getData() {
		const context = super.getData() as ReturnType<BladesSheet["getData"]> & {
			[key: string]: any
		};

		eLog.checkLog("actor", "[BladesCrewSheet] super.getData()", {...context});

		context.actor = this.actor;
		context.system = this.actor.system;

		let turfs_amount = 0;
		if (this.actor.playbook) {
			Object.entries(this.actor.playbook.system.turfs!).forEach(([key, turf]) => {
				if (game.i18n.localize(turf.name).toLowerCase().replace(/\s/g, "") === game.i18n.localize("BITD.Turf").toLowerCase().replace(/\s/g, "")) {
					turfs_amount += U.pInt(turf.value);
				}
			});
		}
		turfs_amount = Math.min(turfs_amount, this.actor.system.turfs.max);

		//~ Assemble embedded actors and items
		context.items = {
			abilities: this.actor.activeSubItems.filter((item) => item.type === BladesItemType.crew_ability),
			playbook: this.actor.playbook,
			reputation: this.actor.activeSubItems.find((item) => item.type === BladesItemType.crew_reputation),
			upgrades: this.actor.activeSubItems.filter((item) => item.type === BladesItemType.crew_upgrade),
			cohorts: this.actor.activeSubItems.filter((item) => item.type === BladesItemType.cohort),
			preferredOp: this.actor.activeSubItems.find((item) => item.type === BladesItemType.preferred_op)
		};
		context.actors = {
			members: this.actor.members
		};

		context.playbookData = this.playbookData;

		context.coinsData = this.coinsData;

		context.tierData = {
			label: "Tier",
			dotline: {
				data: this.actor.system.tier,
				target: "system.tier.value",
				iconEmpty: "dot-empty.svg",
				iconEmptyHover: "dot-empty-hover.svg",
				iconFull: "dot-full.svg",
				iconFullHover: "dot-full-hover.svg"
			}
		};

		context.holdData = {
			name: "Hold",
			displayVal:  U.uCase(this.actor.system.hold),
			radioControl: {
				target: "system.hold",
				value: this.actor.system.hold,
				values: [
					{value: "weak", label: "Weak"},
					{value: "strong", label: "Strong"}
				]
			}
		};

		context.repData = {
			name: "Rep",
			dotlines: [
				{
					data: {
						value: Math.min(this.actor.system.rep.value, this.actor.system.rep.max - turfs_amount),
						max: this.actor.system.rep.max - turfs_amount
					},
					target: "system.rep.value",
					svgKey: "teeth.tall",
					svgFull: "full|half|frame",
					svgEmpty: "full|half|frame"
				},
				{
					"data": {value: turfs_amount, max: turfs_amount},
					"svgKey": "teeth.tall",
					"svgFull": "full|half|frame",
					"svgEmpty": "full|half|frame",
					"class": "flex-row-reverse",
					"isLocked": true
				}
			]
		};

		context.heatData = {
			name: "Heat",
			dotline: {
				data: this.actor.system.heat,
				target: "system.heat.value",
				svgKey: "teeth.tall",
				svgFull: "full|half|frame",
				svgEmpty: "full|half|frame"
			}
		};

		context.wantedData = {
			name: "Wanted",
			dotline: {
				data: this.actor.system.wanted,
				target: "system.wanted.value",
				svgKey: "teeth.short",
				svgFull: "full|frame",
				svgEmpty: "frame"
			}
		};

		eLog.checkLog("actor", "[BladesCrewSheet] return getData()", {...context});
		return context;
	}

	override activateListeners(html: JQuery<HTMLElement>) {
		super.activateListeners(html);

		// Everything below here is only needed if the sheet is editable
		if (!this.options.editable) 		{return}

		// Update Inventory Item
		html.find(".item-sheet-open").on("click", (event) => {
			const element = $(event.currentTarget).parents(".item");
			const item = this.actor.items.get(element.data("itemId"));
			item?.sheet?.render(true);
		});

		// Add a new Cohort
		html.find(".add-item").on("click", (event) => {
			event.preventDefault();
			const a = event.currentTarget;
			const item_type = a.dataset.itemType;

			const data = {
				name: randomID(),
				type: item_type
			};
			return this.actor.createEmbeddedDocuments("Item", [data]);
		});

		// Toggle Turf
		html.find(".turf-select").on("click", async (event) => {
			const element = $(event.currentTarget).parents(".item");

			const item_id = element.data("itemId");
			const turf_id = $(event.currentTarget).data("turfId");
			const turf_current_status = $(event.currentTarget).data("turfStatus");
			const turf_checkbox_name = "system.turfs." + turf_id + ".value";

			await this.actor.updateEmbeddedDocuments("Item", [{
				_id: item_id,
				[turf_checkbox_name]: !turf_current_status}]);
			this.render(false);
		});

		// Cohort Block Harm handler
		html.find('.cohort-block-harm input[type="radio"]').change( async ev => {
			const element = $(ev.currentTarget).parents(".item");

			const item_id = element.data("itemId");
			const harm_id = $(ev.currentTarget).val();

			await this.actor.updateEmbeddedDocuments("Item", [{
				"_id": item_id,
				"system.harm": [harm_id]}]);
			this.render(false);
		});
	}

	/* -------------------------------------------- */
	/*  Form Submission                             */
	/* -------------------------------------------- */

	override async _updateObject(event: Event, formData: object) {

		// Update the Item
		await super._updateObject(event, formData);

		if (event.target && $(event.target).attr("name") === "system.tier") {
			this.render(true);
		}
	}
	/* -------------------------------------------- */

}

export default BladesCrewSheet;