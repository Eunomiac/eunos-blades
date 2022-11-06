import H from "../core/helpers.js";
import U from "../core/utilities.js";
import BladesItem from "../blades-item.js";
import type {ItemData} from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/module.mjs";
import type {ItemDataConstructorData} from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/itemData";
import type BladesActor from "../blades-actor.js";
import EmbeddedCollection from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/abstract/embedded-collection.mjs.js";
import {ToObjectFalseType} from "@league-of-foundry-developers/foundry-vtt-types/src/types/helperTypes.js";
import BladesDialog from "../blades-dialog.js";

declare global {
	class BladesSheet<
		Options extends BladesSheet.Options = BladesSheet.Options,
		Data extends object = BladesSheet.Data<Options>
	> extends ActorSheet<BladesSheet.Options, BladesSheet.Data> {

		override getData(options?: Partial<Options>): BladesSheet.Data | Promise<BladesSheet.Data>;
	}

	namespace BladesSheet {
    interface Options extends ActorSheet.Options { }

		interface Data<Opts extends Options = Options> extends ActorSheet.Data<Opts> {
			items: EmbeddedCollection<typeof BladesItem, BladesActor["data"]>
				& ToObjectFalseType<EmbeddedCollection<typeof BladesItem, BladesActor["data"]>>,
			system: BladesActor["system"]
		}
	}

	type DialogItem = {
		category: "Actor"|"Item",
		id: string
	}
}

class BladesSheet extends ActorSheet {

	async _onSubActorAddClick(event: ClickEvent) {
		event.preventDefault();

		// const
	}

	async _onItemAddClick(event: ClickEvent) {
		event.preventDefault();

		const item_type = $(event.currentTarget).data("itemType");
		const initialParams = [
			this.actor,
			U.tCase(`Add ${item_type}`),
			item_type
		] as const;

		if (item_type === "item") {
			await BladesDialog.Display(
				...initialParams,
				async (itemId) => { BladesItem.create(game.items.get(itemId), {parent: this.actor}) },
				{
					[`${this.actor.playbookName} Items`]: (item: BladesItem) => Boolean(item.system.playbooks?.includes(this.actor.playbookName ?? "")),
					"General Items": (item: BladesItem) => Boolean(item.system.playbooks?.includes("ANY"))
				},
				{
					"General Items": (item: BladesItem) => ["Armor", "Armor, Heavy"].includes(item.name ?? "")
				}
			);
		} else if (item_type === "ability") {
			if (!this.actor.playbookName) { return }
			await BladesDialog.Display(
				...initialParams,
				async (itemId) => { BladesItem.create(game.items.get(itemId), {parent: this.actor}) },
				{
					[this.actor.playbookName]: (item: BladesItem) => Boolean(item.system.playbooks?.includes(this.actor.playbookName ?? "")),
					Veteran: (item: BladesItem) => ![this.actor.playbookName!, "Ghost", "Vampire", "Hull"].some((pbName) => item.system.playbooks?.includes(pbName))
				},
				{
					[this.actor.playbookName]: (item: BladesItem) => this.actor.playbook!.system.suggested_ability === item.name
				},
				true
			);
		} else if (["heritage", "background", "vice", "playbook"].includes(item_type)) {
			await BladesDialog.Display(
				...initialParams,
				async (itemId) => { BladesItem.create(game.items.get(itemId), {parent: this.actor}) }
			);
		}
	}


	override async getData() {
		const data = await super.getData() as BladesSheet.Data;
		eLog.checkLog4("actor", "[BladesSheet] super.getData()", {...data});
		const actorData = data.actor as BladesActor;
		const actorSystem = actorData.system;

		// Sort & Compile Linked Subactors
		const subActors: Record<string,Array<{actor: BladesActor, data: Record<string,any>}>> = {};
		Object.entries(actorSystem.subactors ?? {}).forEach(([id, {category, data: subActorData}]) => {
			const actor = game.actors.get(id) as BladesActor;
			if (!actor) { return }
			subActors[category] ??= [];
			subActors[category].push({actor, data: subActorData});
		});

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

		eLog.checkLog4("actor", "[BladesSheet] return getData()", {...data});
		return data;
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

			let targetDoc: BladesActor|BladesItem = this.actor as BladesActor;
			let targetField = $(elem).data("target");

			if (targetField.startsWith("item")) {
				targetField = targetField.replace(/^item\./, "");
				const itemId = $(elem).closest("[data-item-id]").data("itemId");
				if (!itemId) { return }
				const item = this.actor.items.get(itemId);
				if (!item) { return }
				targetDoc = item as BladesItem;
			}

			const curValue = U.pInt($(elem).data("value"));
			$(elem).find(".dot").each((j, dot) => {
				$(dot).on("click", (event: ClickEvent) => {
					event.preventDefault();
					const thisValue = U.pInt($(dot).data("value"));
					if (thisValue !== curValue) {
						targetDoc.update({[targetField]: thisValue});
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

		html.find("[data-item-id]").find(".item-title").on("click", this._onItemOpenClick.bind(this));
		html.find("[data-sub-actor-id]").find(".sub-actor-name").on("click", this._onSubActorOpenClick.bind(this));

		html.find("[data-roll-attribute]").on("click", this._onRollAttributeDieClick.bind(this));
	}

	async _onClockLeftClick(event: ClickEvent) {
		event.preventDefault();
		const clock$ = $(event.currentTarget).find(".clock[data-target]");
		if (!clock$[0]) { return }
		const target = clock$.data("target");
		const curValue = U.pInt(clock$.data("value"));
		const maxValue = U.pInt(clock$.data("size"));
		(this.actor as BladesActor).update({[target]: U.gsap.utils.wrap(0, maxValue + 1, curValue + 1)});
	}

	async _onClockRightClick(event: ContextMenuEvent) {
		event.preventDefault();
		const clock$ = $(event.currentTarget).find(".clock[data-target]");
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


	async addItemsToSheet(item_type: string, el: JQuery<HTMLElement>) {

		const items = await BladesItem.getAllItemsByType(item_type);
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
		this.actor.rollAttributePopup(attribute_name);

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

interface BladesSheet {
	get actor(): BladesActor;
}

export default BladesSheet;