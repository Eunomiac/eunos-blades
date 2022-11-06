import C from "../core/constants.js";
import type BladesItem from "../blades-item.js";
import BladesActiveEffect from "../blades-active-effect.js";

class BladesItemSheet extends ItemSheet {

	static override get defaultOptions() {
	  return foundry.utils.mergeObject(super.defaultOptions, {
			classes: ["eunos-blades", "sheet", "item"],
			width: 560,
			height: "auto",
			tabs: [{navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description"}]
		}) as ItemSheet.Options;
	}

	/* -------------------------------------------- */

	constructor(item: BladesItem, options: Partial<ItemSheet.Options> = {}) {
		options.classes = [...options.classes ?? [], "eunos-blades", "sheet", "item", item.type];
		super(item, options);
	}

	override get template() {
		const pathComps = [
			"systems/eunos-blades/templates/items"
		];
		if (C.SimpleItemTypes.includes(this.item.type)) {
			pathComps.push("simple-sheet.hbs");
		} else {
			pathComps.push(`${this.item.data.type}-sheet.hbs`);
		}
		return pathComps.join("/");
	}

	/* -------------------------------------------- */

	override activateListeners(html: JQuery<HTMLElement>) {
		super.activateListeners(html);
		const self = this;

		// Everything below here is only needed if the sheet is editable
		if (!this.options.editable) {return}

		html.find(".effect-control").on("click", (ev) => {
			if ( self.item.isOwned ) {
				ui.notifications!.warn(game.i18n.localize("BITD.EffectWarning"));
				return;
			}
			BladesActiveEffect.onManageActiveEffect(ev, self.item);
		});

		html.find("[data-action=\"toggle-turf-connection\"").on("click", this.toggleTurfConnection.bind(this));

		// <input data-dtype="Boolean" type="checkbox" name="data.turfs.{{id}}.connects.{{dir}}" {{checked connects}}>{{/if}}
	}

	toggleTurfConnection(event: ClickEvent) {
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

	override async getData() {
		const data = await super.getData();
		const itemData = data.data;
		Object.assign(
			data,
			{
				editable: this.options.editable,
				isGM: game.user.isGM,
				isEmbeddedItem: true, // this.item.parent !== null,
				// isOwner: ???,
				actor: itemData,
				data: itemData.data,
				effects: this.item.effects
			}
		);

		return data;
	}
}

declare interface BladesItemSheet {
	get item(): BladesItem
}

export default BladesItemSheet;