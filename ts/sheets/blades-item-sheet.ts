import C, {Tag, District, Playbook, Vice} from "../core/constants.js";
import U from "../core/utilities.js";
import type BladesItem from "../blades-item.js";
import BladesActiveEffect from "../blades-active-effect.js";

import Tagify from "../../lib/tagify/tagify.esm.js";
import type {KeydownEventData, TagData, TagEventData} from "@yaireo/tagify";

class BladesItemSheet extends ItemSheet {

	static override get defaultOptions() {
	  return foundry.utils.mergeObject(super.defaultOptions, {
			classes: ["eunos-blades", "sheet", "item"],
			width: 560,
			height: 500,
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


		// Tagify Functionality
		const tagElem = html.find(".tag-entry")[0] as HTMLInputElement;

		if (tagElem) {
			const tagify = new Tagify(tagElem, {
				enforceWhitelist: true,
				editTags: false,
				whitelist: [
					...Object.values(Tag).map((tag) => ({
						"value": tag,
						"data-group": "Tags"
					})),
					...Object.values(District).map((tag) => ({
						"value": tag,
						"data-group": "Districts"
					})),
					...Object.values(Vice).map((tag) => ({
						"value": tag,
						"data-group": "Vices"
					})),
					...Object.values(Playbook).map((tag) => ({
						"value": tag,
						"data-group": "Playbooks"
					}))
				],
				dropdown: {
					enabled: 0,
					maxItems: 10000,
					placeAbove: false,
					appendTarget: html[0]
				}
			});

			(tagify as any).dropdown.createListHTML = (optionsArr: Array<{ value: BladesTag; "data-group": string }>) => {
				const map: Record<string, unknown> = {};

				return structuredClone(optionsArr)
					.map((suggestion, idx) => {

						const value = (tagify as any).dropdown.getMappedValue.call(
							tagify,
							suggestion
						);
						let tagHTMLString = "";

						if (!map[suggestion["data-group"]]) {
							map[suggestion["data-group"]] = true;

							if (Object.keys(map).length) {
								tagHTMLString += "</div>";
							}

							tagHTMLString += `
								<div class="tagify__dropdown__itemsGroup">
								<h3>${suggestion["data-group"]}</h3>
							`;
						}

						suggestion.value
              = value && typeof value === "string" ? U.escapeHTML(value) : value;

						tagHTMLString += tagify.settings.templates.dropdownItem.apply(
							tagify,
							[suggestion, idx]
						);

						return tagHTMLString;
					})
					.join("");
			};

			// Add existing tags to tagify element
			tagify.addTags(
				this.item.tags.map((tag: BladesTag) => {
					if (Object.values(Tag).includes(tag as Tag)) {
						return {"value": tag, "data-group": "Tags"};
					}
					if (Object.values(District).includes(tag as District)) {
						return {"value": tag, "data-group": "Districts"};
					}
					if (Object.values(Playbook).includes(tag as Playbook)) {
						return {"value": tag, "data-group": "Playbooks"};
					}
					if (Object.values(Vice).includes(tag as Vice)) {
						return {"value": tag, "data-group": "Vices"};
					}
					return {"value": tag, "data-group": "Other"};
				}),
				false,
				false
			);

			tagElem.addEventListener("change", this._onTagifyChange.bind(this));
		}

		// This is a workaround until is being fixed in FoundryVTT.
		if (this.options.submitOnChange) {
			html.on("change", "textarea", this._onChangeInput.bind(this)); // Use delegated listener on the form
		}

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

	async _onTagifyChange(event: Event) {
		const tagString = (event.target as HTMLInputElement).value;
		if (tagString) {
			const tags: BladesTag[] = JSON.parse(tagString)
				.map(({value}: {value: BladesTag}) => value);
			this.item.update({"system.tags": tags});
		} else {
			this.item.update({"system.tags": []});
		}
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