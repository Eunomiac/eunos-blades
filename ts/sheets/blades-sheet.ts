import H from "../core/helpers.js";
import U from "../core/utilities.js";
import type BladesItem from "../blades-item.js";
import type {ItemData} from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/module.mjs";
import type {ItemDataConstructorData} from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/itemData";
import type BladesActor from "../blades-actor.js";

declare global {
	class BladesSheet<
		Options extends BladesSheet.Options = BladesSheet.Options,
		Data extends object = BladesSheet.Data<Options>
	> extends ActorSheet<BladesSheet.Options, BladesSheet.Data> {
		get actor(): BladesActor;
		override getData(options?: Partial<Options>): BladesSheet.Data | Promise<BladesSheet.Data>;
	}

	namespace BladesSheet {
    interface Options extends ActorSheet.Options { }

		interface Data<Options extends BladesSheet.Options = BladesSheet.Options> extends ActorSheet.Data<BladesSheet.Options> {
			system: BladesActor["system"]
		}
	}
}

class BladesSheet extends ActorSheet {

	override async getData() {
		const data = await super.getData() as BladesSheet.Data;
		eLog.log("[BladesSheet] super.getData()", {...data});
		const actorData = data.actor as BladesActor;
		const actorSystem = actorData.system;

		// Link Embedded Actors
		this._linkEmbeddedActors(actorSystem);

		// Filter trauma conditions
		this._filterTraumaConditions(actorSystem);

		Object.assign(
			data,
			{
				editable: this.options.editable,
				isGM: game.user.isGM,
				// isOwner: ???,
				actor: actorData,
				data: actorSystem
			}
		);

		eLog.log("[BladesSheet] return getData()", {...data});
		return data;
	}

	_linkEmbeddedActors(actorSystem: BladesActor["system"]) {
		if (typeof actorSystem.crew !== "string") { return }
		const crew = game.actors.get(actorSystem.crew) as BladesActor|undefined;
		if (crew && crew.type === "crew") {
			actorSystem.crew = crew;
		}
	}

	_filterTraumaConditions(actorSystem: BladesActor["system"]) {
		if (!actorSystem.trauma?.list) { return }
		actorSystem.trauma.list = U.objFilter(
			actorSystem.trauma.list,
			(val: unknown): val is true|false => val === true || val === false
		);
		actorSystem.trauma.value = Object.values(actorSystem.trauma.list)
			.filter((val) => val === true)
			.length;
	}

	override activateListeners(html: JQuery<HTMLElement>) {
		super.activateListeners(html);

		// Handle removal or revealing of secret information content.
		if (game.user.isGM) {
			html.attr("style", "--secret-text-display: initial");
		} else {
			html.find(".editor:not(.tinymce) [data-is-secret=\"true\"]").remove();
		}

		// Everything below here is only needed if the sheet is editable
		if (!this.options.editable) {return}

		// Add dotline functionality
		html.find(".dotline").each((i, elem) => {

			if ($(elem).hasClass("locked")) { return }

			const target = $(elem).data("target");

			const curValue = U.pInt($(elem).data("value"));
			$(elem).find(".dot").each((j, dot) => {
				$(dot).on("click", (event: ClickEvent) => {
					event.preventDefault();
					const thisValue = U.pInt($(dot).data("value"));
					if (thisValue !== curValue) {
						this.actor.update({[target]: thisValue});
					}
				});
				$(dot).on("contextmenu", (event: ContextMenuEvent) => {
					event.preventDefault();
					const thisValue = U.pInt($(dot).data("value")) - 1;
					if (thisValue !== curValue) {
						this.actor.update({[target]: thisValue});
					}
				});
			});
		});

		// Add clock functionality
		html.find(".clock-container").on("click", this._onClockLeftClick.bind(this));
		html.find(".clock-container").on("contextmenu", this._onClockRightClick.bind(this));

		html.find(".item-add-popup").on("click", (event) => {
			this._onItemAddClick(event);
		});
		html.find(".update-box").on("click", this._onUpdateBoxClick.bind(this));

		// This is a workaround until is being fixed in FoundryVTT.
		if ( this.options.submitOnChange ) {
			html.on("change", "textarea", this._onChangeInput.bind(this));  // Use delegated listener on the form
		}

		html.find("[data-item-id]").children(".item-name").on("click", this._onItemOpenClick.bind(this));
		html.find("[data-sub-actor-id]").children(".sub-actor-name").on("click", this._onSubActorOpenClick.bind(this));

		html.find(".roll-die-attribute").on("click", this._onRollAttributeDieClick.bind(this));
	}

	async _onClockLeftClick(event: ClickEvent) {
		event.preventDefault();
		const clock$ = $(event.currentTarget).children(".clock[data-target]");
		if (!clock$[0]) { return }
		const target = clock$.data("target");
		const curValue = U.pInt(clock$.data("value"));
		const maxValue = U.pInt(clock$.data("size"));
		(this.actor as BladesActor).update({[target]: U.gsap.utils.wrap(0, maxValue + 1, curValue + 1)});
	}

	async _onClockRightClick(event: ContextMenuEvent) {
		event.preventDefault();
		const clock$ = $(event.currentTarget).children(".clock[data-target]");
		if (!clock$[0]) { return }
		const target = clock$.data("target");
		const curValue = U.pInt(clock$.data("value"));
		(this.actor as BladesActor).update({[target]: Math.max(0, curValue - 1)});
	}

	async _onItemOpenClick(event: ClickEvent) {
		event.preventDefault();
		const itemID = $(event.currentTarget).closest("[data-item-id]").data("itemId");
		if (itemID) {
			(this.actor as BladesActor).items.get(itemID)?.sheet?.render(true);
		}
	}

	async _onSubActorOpenClick(event: ClickEvent) {
		event.preventDefault();
		const actorID = $(event.currentTarget).closest("[data-sub-actor-id]").data("subActorId");
		if (actorID) {
			game.actors.get(actorID)?.sheet?.render(true);
		}
	}

	async _onSubActorAddClick(event: ClickEvent) {
		event.preventDefault();

		// const
	}

	async _onItemAddClick(event: ClickEvent) {
		event.preventDefault();

		const item_type = $(event.currentTarget).data("itemType");
		const distinct = $(event.currentTarget).data("distinct");
		const input_type = typeof distinct === "undefined" ? "checkbox" : "radio";
		const items = await H.getAllItemsByType(item_type, game);

		let html = "<div class=\"items-to-add\">";

		items.forEach(e => {
			let addition_price_load = "";

			if (typeof e.system.load !== "undefined") {
				addition_price_load += `(${e.system.load})`;
			} else if (typeof e.system.price !== "undefined") {
				addition_price_load += `(${e.system.price})`;
			}

			html += `<input id="select-item-${e.data._id}" type="${input_type}" name="select_items" value="${e.data._id}">`;
			html += `<label class="flex-horizontal" for="select-item-${e.id}">`;
			html += `${game.i18n.localize(e.data.name)} ${addition_price_load} <i class="tooltip fas fa-question-circle"><span class="tooltiptext">${game.i18n.localize(e.system.description)}</span></i>`;
			html += "</label>";
		});

		html += "</div>";

		const options = {
			// width: "500"
		};

		const dialog = new Dialog({
			"title": `${game.i18n.localize("Add")} ${item_type}`,
			"content": html,
			"buttons": {
				one: {
					icon: '<i class="fas fa-check"></i>',
					label: game.i18n.localize("Add"),
					callback: async (html) => await this.addItemsToSheet(item_type, $(html).find(".items-to-add"))
				},
				two: {
					icon: '<i class="fas fa-times"></i>',
					label: game.i18n.localize("Cancel"),
					callback: () => false
				}
			},
			"default": "two"
		}, options);

		dialog.render(true);
	}

	async addItemsToSheet(item_type: string, el: JQuery<HTMLElement>) {

		const items = await H.getAllItemsByType(item_type, game);
		const items_to_add: ItemDataConstructorData[] = [];

		el.find("input:checked").each(function addItems() {
			const item = items.find(e => e.data._id === $(this).val());
			if (item) { items_to_add.push(item.data as ItemData & ItemDataConstructorData) }
		});

		// @ts-expect-error What the fuck type is the first parameter to BladesItem.create?!
		await BladesItem.create(items_to_add, {parent: this.document});
	}

	/**
   * Roll an Attribute die.
   */
	async _onRollAttributeDieClick(event: ClickEvent) {

		const attribute_name = $(event.currentTarget).data("rollAttribute");
		(this.actor as BladesActor).rollAttributePopup(attribute_name);

	}

	async _onUpdateBoxClick(event: ClickEvent) {
		event.preventDefault();
		const item_id = $(event.currentTarget).data("item");
		let update_value = $(event.currentTarget).data("value");
		const update_type = $(event.currentTarget).data("utype");
		if ( update_value === undefined) {
			update_value = (document.getElementById("fac-" + update_type + "-" + item_id) as HTMLInputElement)?.value;
		}
		let update;
		if ( update_type === "status" ) {
			update = {_id: item_id, data:{status:{value: update_value}}};
		} else if (update_type === "hold") {
			update = {_id: item_id, data:{hold:{value: update_value}}};
		} else {
			eLog.error("update attempted for type undefined in blades-sheet.js onUpdateBoxClick function");
			return;
		}

		await this.actor.updateEmbeddedDocuments("Item", [update]);
	}
}

export default BladesSheet;