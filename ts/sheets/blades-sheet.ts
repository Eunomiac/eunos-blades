import U from "../core/utilities.js";
import G from "../core/gsap.js";
import {Tag, District, Playbook, Vice} from "../core/constants.js";
import Tagify from "../../lib/tagify/tagify.esm.js";
import type {KeydownEventData, TagData} from "@yaireo/tagify";
import BladesActor from "../blades-actor.js";
import BladesItem from "../blades-item.js";
import BladesSelectorDialog, {SelectionCategory} from "../blades-dialog.js";
import BladesActiveEffect from "../blades-active-effect.js";

type BladesCompData = {
  elem$: JQuery<HTMLElement>;
  docID?: string;
  docCat?: SelectionCategory;
  docType?: "Actor" | "Item";
  doc?: BladesActor | BladesItem | false;
  dialogDocs?: Record<string, BladesActor[] | BladesItem[]> | false;
};

class BladesSheet extends ActorSheet {
	override async getData() {
		const context = (await super.getData()) as BladesSheet.Data &
      Record<string, any>;
		eLog.checkLog("actor", "[BladesSheet] super.getData()", {...context});

		context.editable = this.options.editable;
		context.isGM = game.user.isGM;
		context.activeEffects = this.actor.effects;

		eLog.checkLog("actor", "[BladesSheet] return getData()", {...context});

		return {
			...context,
			actor: this.actor,
			system: this.actor.system
		};
	}

	// #region DATA PACKAGING GETTERS
	get playbookData() {
		return {
			dotline: {
				data: this.actor.system.experience.playbook,
				target: "system.experience.playbook.value",
				svgKey: "teeth.tall",
				svgFull: "full|frame",
				svgEmpty: "full|half|frame"
			}
		};
	}

	get coinsData() {
		return {
			dotline: {
				data: this.actor.system.coins,
				target: "system.coins.value",
				iconEmpty: "coin-full.svg",
				iconFull: "coin-full.svg"
			}
		};
	}
	// #endregion

	// #region LISTENERS & EVENT HANDLERS

	override activateListeners(html: JQuery<HTMLElement>) {
		super.activateListeners(html);

		// Handle removal or revealing of secret information content.
		if (game.user.isGM) {
			html.attr("style", "--secret-text-display: initial");
		} else {
			html.find('.editor:not(.tinymce) [data-is-secret="true"]').remove();
		}

		// Everything below here is only needed if the sheet is editable
		if (!this.options.editable) {
			return;
		}

		// Add dotline functionality
		html.find(".dotline").each((i, elem) => {
			if ($(elem).hasClass("locked")) {
				return;
			}

			let targetDoc: BladesActor | BladesItem = this.actor as BladesActor;
			let targetField = $(elem).data("target");

			const comp$ = $(elem).closest("comp");

			if (targetField.startsWith("item")) {
				targetField = targetField.replace(/^item\./, "");
				const itemId = $(elem).closest("[data-comp-id]").data("compId");
				if (!itemId) {
					return;
				}
				const item = this.actor.items.get(itemId);
				if (!item) {
					return;
				}
				targetDoc = item as BladesItem;
			}

			const curValue = U.pInt($(elem).data("value"));
			$(elem)
				.find(".dot")
				.each((j, dot) => {
					$(dot).on("click", (event: ClickEvent) => {
						event.preventDefault();
						const thisValue = U.pInt($(dot).data("value"));
						if (thisValue !== curValue) {
							if (
								comp$.hasClass("comp-coins")
                || comp$.hasClass("comp-stash")
							) {
								G.effects
									.fillCoins($(dot).prevAll(".dot"))
									.then(() => targetDoc.update({[targetField]: thisValue}));
							} else {
								targetDoc.update({[targetField]: thisValue});
							}
						}
					});
					$(dot).on("contextmenu", (event: ContextMenuEvent) => {
						event.preventDefault();
						const thisValue = U.pInt($(dot).data("value")) - 1;
						if (thisValue !== curValue) {
							targetDoc.update({[targetField]: thisValue});
						}
					});
				});
		});

		// Clock Functionality
		html
			.find(".clock-container")
			.on("click", this._onClockLeftClick.bind(this));
		html
			.find(".clock-container")
			.on("contextmenu", this._onClockRightClick.bind(this));

		// Component Functionality: Open, Add (via SelectorDialog), Archive, Delete, Toggle
		html
			.find("[data-comp-id]")
			.find(".comp-title")
			.on("click", this._onItemOpenClick.bind(this));
		html
			.find(".comp-control.comp-add")
			.on("click", this._onItemAddClick.bind(this));
		html
			.find(".comp-control.comp-delete")
			.on("click", this._onItemRemoveClick.bind(this));
		html
			.find(".comp-control.comp-delete-full")
			.on("click", this._onItemFullRemoveClick.bind(this));
		html
			.find(".comp-control.comp-toggle")
			.on("click", this._onItemToggleClick.bind(this));

		// Roll Functionality
		html
			.find("[data-roll-attribute]")
			.on("click", this._onRollAttributeDieClick.bind(this));

		// Active Effects Functionality
		html
			.find(".effect-control")
			.on("click", this._onActiveEffectControlClick.bind(this));

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
				this.actor.tags.map((tag: BladesTag) => {
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
	}

	// #region Clock Handlers
	async _onClockLeftClick(event: ClickEvent) {
		event.preventDefault();
		const clock$ = $(event.currentTarget).find(".clock[data-target]");
		if (!clock$[0]) {
			return;
		}
		const target = clock$.data("target");
		const curValue = U.pInt(clock$.data("value"));
		const maxValue = U.pInt(clock$.data("size"));

		G.effects.pulseClockWedges(clock$.find("wedges")).then(() =>
			this.actor.update({
				[target]: G.utils.wrap(0, maxValue + 1, curValue + 1)
			}));
	}

	async _onClockRightClick(event: ContextMenuEvent) {
		event.preventDefault();
		const clock$ = $(event.currentTarget).find(".clock[data-target]");
		if (!clock$[0]) {
			return;
		}
		const target = clock$.data("target");
		const curValue = U.pInt(clock$.data("value"));

		G.effects.reversePulseClockWedges(clock$.find("wedges")).then(() =>
			this.actor.update({
				[target]: Math.max(0, curValue - 1)
			}));
	}
	// #endregion

	async _onTagifyChange(event: Event) {
		const tagString = (event.target as HTMLInputElement).value;
		if (tagString) {
			const tags: BladesTag[] = JSON.parse(tagString).map(({value}: { value: BladesTag }) => value);
			this.actor.update({"system.tags": tags});
		} else {
			this.actor.update({"system.tags": []});
		}
	}

	// #region Component Handlers
	private _getCompData(event: ClickEvent): BladesCompData {
		const elem$ = $(event.currentTarget).closest(".comp");
		const compData: BladesCompData = {
			elem$,
			docID: elem$.data("compId"),
			docCat: elem$.data("compCat"),
			docType: elem$.data("compType")
		};

		if (compData.docID && compData.docType) {
			compData.doc = {
				Actor: this.actor.getSubActor(compData.docID),
				Item: this.actor.getSubItem(compData.docID)
			}[compData.docType];
		}
		if (compData.docCat && compData.docType) {
			compData.dialogDocs = {
				Actor: this.actor.getDialogActors(compData.docCat),
				Item: this.actor.getDialogItems(compData.docCat)
			}[compData.docType];
		}

		eLog.checkLog2("dialog", "Component Data", {...compData});

		return compData;
	}
	async _onItemOpenClick(event: ClickEvent) {
		event.preventDefault();
		const {doc} = this._getCompData(event);
		if (!doc) {
			return;
		}
		doc.sheet?.render(true);
	}

	async _onItemAddClick(event: ClickEvent) {
		event.preventDefault();
		const {docCat, docType, dialogDocs} = this._getCompData(event);
		eLog.checkLog("_onItemAddClick", {docCat, dialogDocs});
		if (!dialogDocs || !docCat || !docType) {
			return;
		}
		await BladesSelectorDialog.Display(
			this.actor,
			U.tCase(`Add ${docCat.replace(/_/g, " ")}`),
			docType,
			dialogDocs
		);
	}

	async _onItemRemoveClick(event: ClickEvent) {
		event.preventDefault();
		const {elem$, doc} = this._getCompData(event);
		if (!doc) {
			return;
		}
		G.effects.blurRemove(elem$).then(() => doc.addTag(Tag.Archived));
	}

	async _onItemFullRemoveClick(event: ClickEvent) {
		event.preventDefault();
		const {elem$, doc} = this._getCompData(event);
		if (!doc) {
			return;
		}
		G.effects.blurRemove(elem$).then(() => doc.delete());
	}

	async _onItemToggleClick(event: ClickEvent) {
		event.preventDefault();
		const target = $(event.currentTarget).data("target");
		this.actor.update({
			[target]: !getProperty(this.actor, target)
		});
	}
	// #endregion

	// #region Roll Handlers
	async _onRollAttributeDieClick(event: ClickEvent) {
		const attribute_name = $(event.currentTarget).data("rollAttribute");
		this.actor.rollAttributePopup(attribute_name);
	}
	// #endregion

	// #region Active Effect Handlers
	async _onActiveEffectControlClick(event: ClickEvent) {
		BladesActiveEffect.onManageActiveEffect(event, this.actor);
	}
	// #endregion

	// #endregion
}

interface BladesSheet {
  get actor(): BladesActor;
}

export default BladesSheet;
