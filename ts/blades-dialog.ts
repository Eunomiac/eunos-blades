import C, {BladesActorType, BladesItemType} from "./core/constants.js";
import U from "./core/utilities.js";
import H from "./core/helpers.js";
import type BladesActor from "./blades-actor.js";
import BladesItem from "./blades-item.js";

class BladesDialog extends Dialog {

	static override get defaultOptions() {
	  return foundry.utils.mergeObject(super.defaultOptions, {
			classes: ["eunos-blades", "sheet", "dialog"],
			template: "systems/eunos-blades/templates/dialog.hbs",
			width: "auto",
			height: "auto",
			tabs: [{navSelector: ".nav-tabs", contentSelector: ".tab-content", initial: "front"}]
		});
	}

	static Initialize() {
		return loadTemplates([
			"systems/eunos-blades/templates/dialog.hbs"
		]);
	}

	static async Display<T extends BladesActor|BladesItem>(
		doc: BladesActor|BladesItem,
		title: string,
		category: keyof typeof BladesDialog.Categories,
		callback: (docID: string) => Promise<void>,
		tabFilters: Record<string, (a: T) => boolean> = {all: (a: T) => true},
		featuredFilters?: Record<string, (a: T) => boolean>,
		isFeaturing = false
	) {
		const app = new BladesDialog({
			doc,
			title,
			category,
			callback,
			"content": "",
			"buttons": {
				cancel: {
					icon: '<i class="fas fa-times"></i>',
					label: game.i18n.localize("Cancel"),
					callback: () => false
				}
			},
			"default": "cancel"
		});

		await app.createTabs<T>(tabFilters);
		if (featuredFilters) {
			app.applyFeaturedFilters<T>(featuredFilters, isFeaturing);
		}

		return app.render(true);
	}

	tabs: Record<string, {featured: Array<BladesActor|BladesItem>, other: Array<BladesActor|BladesItem>}> = {};
	async createTabs<T extends BladesActor|BladesItem>(tabs: Record<string, (a: T) => boolean>) {
		switch (this.docSuperType) {
			case "Actor": this._createActorTabs(tabs as Record<string,(a: BladesActor) => boolean>); return;
			case "Item": this._createItemTabs(tabs as Record<string,(a: BladesItem) => boolean>); return;
			// no default
		}
	}
	async _createActorTabs(tabs: Record<string, (a: BladesActor) => boolean>) {
		return;
		// @ts-expect-error Just temporary
		const allTypeActors = await BladesActor.getAllItemsByType(this.docType);
		// @ts-expect-error Just temporary
		const validActors: BladesActor[] = allTypeActors.filter((actor) => actor.isValidForActor(this.actor));
		this.tabs = Object.fromEntries((Object.entries(tabs))
			.map(([tabName, tabFilter]) => [
				tabName,
				{featured: [], other: validActors.filter(tabFilter)}
			]));
	}
	async _createItemTabs(tabs: Record<string,(i: BladesItem) => boolean>) {
		const allTypeItems = await BladesItem.getAllItemsByType(this.docType);
		const validItems = allTypeItems.filter((item) => item.isValidForDoc(this.doc));
		this.tabs = Object.fromEntries((Object.entries(tabs))
			.map(([tabName, tabFilter]) => [
				tabName,
				{featured: [], other: validItems.filter(tabFilter)}
			]));
	}

	applyFeaturedFilters<T extends BladesActor|BladesItem>(filters: Record<string, (a: T) => boolean>, isFeaturing: boolean) {
		for (const [tabName, filterFunc] of Object.entries(filters)) {
			// const filterFunc = filters[tabName];
			const [featured, other] = [
				(this.tabs[tabName].other as T[]).filter((doc: T) => filterFunc(doc)),
				(this.tabs[tabName].other as T[]).filter((doc: T) => !filterFunc(doc))
			];
			if (isFeaturing) {
				this.tabs[tabName] = {
					featured,
					other
				};
			} else {
				this.tabs[tabName] = {
					featured: [],
					other: [...featured, ...other]
				};
			}
		}
	}

	static get Categories(): Record<string, ["Actor"|"Item", BladesItemType|BladesActorType]> {
		return {
			ability: ["Item", BladesItemType.ability],
			background: ["Item", BladesItemType.background],
			clock_keeper: ["Item", BladesItemType.clock_keeper],
			cohort: ["Item", BladesItemType.cohort],
			crew_ability: ["Item", BladesItemType.crew_ability],
			crew_reputation: ["Item", BladesItemType.crew_reputation],
			crew_type: ["Item", BladesItemType.crew_type],
			crew_upgrade: ["Item", BladesItemType.crew_upgrade],
			faction: ["Item", BladesItemType.faction],
			gm_tracker: ["Item", BladesItemType.gm_tracker],
			heritage: ["Item", BladesItemType.heritage],
			item: ["Item", BladesItemType.item],
			playbook: ["Item", BladesItemType.playbook],
			vice: ["Item", BladesItemType.vice],
			pc: ["Actor", BladesActorType.pc],
			npc: ["Actor", BladesActorType.npc],
			crew: ["Actor", BladesActorType.crew],
			vicePurveyor: ["Actor", BladesActorType.npc],
			acquaintance: ["Actor", BladesActorType.npc]
		};
	}

	doc: BladesActor|BladesItem;
	category: KeyOf<typeof BladesDialog.Categories>;
	callback: (docID: string) => Promise<void>;

	get docSuperType(): "Actor"|"Item" { return BladesDialog.Categories[this.category][0] }
	get docType(): BladesItemType|BladesActorType { return BladesDialog.Categories[this.category][1] }

	constructor(data: BladesDialog.Data, options?: Partial<BladesDialog.Options>) {
		eLog.checkLog4("dialog", "[BladesDialog] constructor(data)", {...data});
		super(data, options);
		eLog.checkLog4("dialog", "[BladesDialog] super(data)", {...data});
		this.doc = data.doc;
		this.category = data.category as string;
		this.callback = data.callback;
	}

	override getData(): Omit<BladesDialog.Data,"title"> {
		const data = super.getData();
		eLog.checkLog4("dialog", "[BladesDialog] super.getData()", {...data});

		Object.assign(
			data,
			{
				tabs: this.tabs
			}
		);

		eLog.checkLog("dialog", "[BladesDialog] return getData()", {...data});
		return data as Omit<BladesDialog.Data,"title">;
	}

	override activateListeners(html: JQuery<HTMLElement>) {
		super.activateListeners(html);

		const self = this;

		const itemDetailPane$ = $(html).find(".item-details");

		//~ Item Control
		html.find("[data-item-id]").on({
			click: function() {
				const docId = $(this).data("itemId");
				if (docId) {
					self.callback(docId);
				}
				self.close();
			},
			mouseenter: function() {
				$(this).closest(".tab").addClass("hovering");
				$(this).addClass("hover-over");
				if (self.docSuperType === "Item") {
					const itemRules = (game.items as Collection<BladesItem>).get($(this).data("itemId"))?.system.rules;
					itemDetailPane$.html(itemRules ?? "");
				} else if (self.docSuperType === "Actor") {
					const targetActor = (game.actors as Collection<BladesActor>).get($(this).data("itemId"));
					if (!targetActor) { return }
					const actorDesc = targetActor.system.concept || targetActor.system.description_short || "";
					itemDetailPane$.html(actorDesc ?? "");
				}
			},
			mouseleave: function() {
				$(this).closest(".tab").removeClass("hovering");
				$(this).removeClass("hover-over");
				itemDetailPane$.html("");
			}
		});
	}
}

export default BladesDialog;