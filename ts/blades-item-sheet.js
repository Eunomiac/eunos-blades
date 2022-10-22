/**
 * Extend the basic ItemSheet
 * @extends {ItemSheet}
 */
import {BladesItem} from "./blades-item.js";
import {onManageActiveEffect, prepareActiveEffectCategories} from "./effects.js";
import BladesActiveEffect from "./euno-active-effect.js";

export class BladesItemSheet extends ItemSheet {

	/** @override */
	static get defaultOptions() {

	  return foundry.utils.mergeObject(super.defaultOptions, {
			classes: ["eunos-blades", "sheet", "item"],
			width: 560,
			height: "auto",
			tabs: [{navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description"}]
		});
	}

	/* -------------------------------------------- */

	constructor(item, options = {}) {
		options.classes = [...options.classes ?? [], "eunos-blades", "sheet", "item", item.type];
		super(item, options);
	}

	/** @override */
	get template() {
		if (this.item.data.type === "clock_keeper") {
			return "systems/eunos-blades/templates/clock-keeper-sheet.hbs";
		}
		const path = "systems/eunos-blades/templates/items";
		const simple_item_types = ["background", "heritage", "vice", "crew_reputation"];
		let template_name = `${this.item.data.type}`;

		if (simple_item_types.indexOf(this.item.data.type) >= 0) {
			template_name = "simple";
		}

		return `${path}/${template_name}.hbs`;
	}

	/* -------------------------------------------- */

	/** @override */
	activateListeners(html) {
		super.activateListeners(html);

		// Everything below here is only needed if the sheet is editable
		if (!this.options.editable) {return}

		html.find(".effect-control").click(ev => {
			if ( this.item.isOwned ) {
				ui.notifications.warn(game.i18n.localize("BITD.EffectWarning"));
				return;
			}
			BladesActiveEffect.onManageActiveEffect(ev, this.item);
		});

		html.find("[data-action=\"toggle-turf-connection\"").on("click", this.toggleTurfConnection.bind(this));

		// <input data-dtype="Boolean" type="checkbox" name="data.turfs.{{id}}.connects.{{dir}}" {{checked connects}}>{{/if}}
	}

	toggleTurfConnection(event) {
		const button$ = $(event.currentTarget);
		const connector$ = button$.parent();
		const turfNum = parseInt(connector$.data("index") ?? 0);
		const turfDir = connector$.data("dir");
		if (!turfNum || !turfDir) { return }
		const toggleState = connector$.hasClass("no-connect");
		const updateData = {
			[`system.turfs.${turfNum}.connects.${turfDir}`]: toggleState
		};
		const partner = connector$.data("partner");
		if (typeof partner === "string" && /-/.test(partner)) {
			const [partnerNum, partnerDir] = partner.split("-");
			updateData[`system.turfs.${partnerNum}.connects.${partnerDir}`] = toggleState;
		}
		this.item.update(updateData);
	}

	/* -------------------------------------------- */

	/** @override */
	getData() {
		const data = super.getData();
		data.isGM = game.user.isGM;
		data.editable = this.options.editable;
		const itemData = data.data;
		data.actor = itemData;
		data.data = itemData.data;

		// Prepare Active Effects
		data.effects = BladesActiveEffect.prepareActiveEffectCategories(this.item.effects);
		return data;
	}
}
