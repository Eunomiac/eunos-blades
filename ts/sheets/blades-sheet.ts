import U from "../core/utilities.js";
import G from "../core/gsap.js";
import {Tag} from "../core/constants.js";
import BladesActor, {SelectionCategory} from "../blades-actor.js";
import BladesItem from "../blades-item.js";
import EmbeddedCollection from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/abstract/embedded-collection.mjs.js";
import {ToObjectFalseType} from "@league-of-foundry-developers/foundry-vtt-types/src/types/helperTypes.js";
import BladesDialog from "../blades-dialog.js";
import BladesActiveEffect from "../blades-active-effect.js";

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

	async _onItemAddClick(event: ClickEvent) {
		event.preventDefault();

		const dataElem$ = $(event.currentTarget).closest(".comp");
		const doc_cat = dataElem$.data("compCat") as SelectionCategory;

		// await BladesDialog.Display(this.actor, U.tCase(`Add ${doc_type.replace(/_/g, " ")}`), doc_cat);
	}


	override async getData() {
		const data = await super.getData() as BladesSheet.Data;
		eLog.checkLog4("actor", "[BladesSheet] super.getData()", {...data});
		const actorData = data.actor as BladesActor;
		const actorSystem = actorData.system;

		Object.assign(
			data,
			{
				editable: this.options.editable,
				isGM: game.user.isGM,
				// isOwner: ???,
				actor: actorData,
				data: actorSystem,
				effects: this.actor.effects
			}
		);
		eLog.checkLog5("actor", "[BladesSheet] return getData()", {...data});
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

			const comp$ = $(elem).closest("comp");

			if (targetField.startsWith("item")) {
				targetField = targetField.replace(/^item\./, "");
				const itemId = $(elem).closest("[data-comp-id]").data("compId");
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
						if (comp$.hasClass("comp-coins") || comp$.hasClass("comp-stash")) {
							G.effects.fillCoins($(dot).prevAll(".dot"))
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

		// Add clock functionality
		html.find(".clock-container").on("click", this._onClockLeftClick.bind(this));
		html.find(".clock-container").on("contextmenu", this._onClockRightClick.bind(this));


		html.find("[data-comp-id]").find(".comp-title").on("click", this._onItemOpenClick.bind(this));
		html.find(".comp-control.comp-add").on("click", (event) => {
			this._onItemAddClick(event);
		});
		html.find(".comp-control.comp-delete").on({
			click: (event) => this._onItemRemoveClick(event)
		});
		html.find(".comp-control.comp-delete-full").on({
			click: (event) => this._onItemFullRemoveClick(event)
		});
		html.find(".comp-control.comp-toggle").on({
			click: (event) => this.actor.update({[$(event.currentTarget).data("target")]: !getProperty(this.actor, $(event.currentTarget).data("target"))})
		});

		// This is a workaround until is being fixed in FoundryVTT.
		if ( this.options.submitOnChange ) {
			html.on("change", "textarea", this._onChangeInput.bind(this));  // Use delegated listener on the form
		}


		html.find("[data-roll-attribute]").on("click", this._onRollAttributeDieClick.bind(this));

		const self = this;
		//~ Delete Inventory Item


		//~ Manage Active Effects
		html.find(".effect-control").on({
			click: function(event: ClickEvent) {
				BladesActiveEffect.onManageActiveEffect(event, self.actor);
			}
		});
	}

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

	async _onItemRemoveClick(event: ClickEvent) {
		event.preventDefault();

		const self = this;

		const dataElem$ = $(event.currentTarget).closest(".comp");
		const docID = dataElem$.data("compId");

		const item = this.actor.items.get(docID);

		if (!item) { return }

		G.effects.blurRemove(dataElem$).then(() => item.addTag(Tag.Archived));
	}

	async _onItemFullRemoveClick(event: ClickEvent) {
		event.preventDefault();

		const self = this;

		const dataElem$ = $(event.currentTarget).closest(".comp");
		const docID = dataElem$.data("compId");

		// G.effects.blurRemove(dataElem$).then(() => BladesItem.deleteEmbeddedDocuments([docID], {parent: this.actor}));
	}

	async _onClockLeftClick(event: ClickEvent) {
		event.preventDefault();
		const clock$ = $(event.currentTarget).find(".clock[data-target]");
		if (!clock$[0]) { return }
		const target = clock$.data("target");
		const curValue = U.pInt(clock$.data("value"));
		const maxValue = U.pInt(clock$.data("size"));

		G.effects.pulseClockWedges(clock$.find(("wedges"))).then(() => this.actor.update({
			[target]: G.utils.wrap(0, maxValue + 1, curValue + 1)
		}));
	}

	async _onClockRightClick(event: ContextMenuEvent) {
		event.preventDefault();
		const clock$ = $(event.currentTarget).find(".clock[data-target]");
		if (!clock$[0]) { return }
		const target = clock$.data("target");
		const curValue = U.pInt(clock$.data("value"));

		G.effects.reversePulseClockWedges(clock$.find(("wedges"))).then(() => this.actor.update({
			[target]: Math.max(0, curValue - 1)
		}));
	}

	async _onItemOpenClick(event: ClickEvent) {
		event.preventDefault();
		const docID = $(event.currentTarget).closest(".comp").data("compId");
		const doc = (await BladesItem.GetPersonal(docID, this.actor)) ?? (await BladesActor.GetPersonal(docID, this.actor));
		eLog.log("CLICKED!", {docID, doc});
		if (!doc) { return }
		doc.sheet?.render(true);
	}

	/**
   * Roll an Attribute die.
   */
	async _onRollAttributeDieClick(event: ClickEvent) {
		const attribute_name = $(event.currentTarget).data("rollAttribute");
		this.actor.rollAttributePopup(attribute_name);
	}
}

interface BladesSheet {
	get actor(): BladesActor;
}

export default BladesSheet;