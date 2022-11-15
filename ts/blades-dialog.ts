import C, {BladesActorType, BladesItemType} from "./core/constants.js";
import U from "./core/utilities.js";
import BladesActor from "./blades-actor.js";
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
		category: KeyOf<typeof BladesActor.CategoryTypes|typeof BladesItem.CategoryTypes>,
		callback: (docID: string) => Promise<void>,
		tabFilters: Record<string, (a: T) => boolean> = {all: (a: T) => true},
		featuredFilters?: Record<string, (a: T) => boolean>,
		isFeaturing: Record<string,boolean> = {}
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
			case "Actor": return this._createActorTabs(tabs as Record<string,(a: BladesActor) => boolean>);
			case "Item": return this._createItemTabs(tabs as Record<string,(a: BladesItem) => boolean>);
			// no default
		}
	}
	async _createActorTabs(tabs: Record<string, (a: BladesActor) => boolean>) {
		const allCategoryActors = await BladesActor.GetGlobalCategoryActors(this.category, this.doc as BladesActor);
		const validActors: BladesActor[] = allCategoryActors.filter((actor) => actor.isValidForDoc(this.doc));
		this.tabs = Object.fromEntries((Object.entries(tabs))
			.map(([tabName, tabFilter]) => [
				tabName,
				{featured: [], other: validActors.filter(tabFilter)}
			]));
	}
	async _createItemTabs(tabs: Record<string,(i: BladesItem) => boolean>) {
		const allTypeItems = await BladesItem.GetGlobalCategoryItems(this.category, this.doc as BladesActor);
		const validItems = allTypeItems.filter((item) => item.isValidForDoc(this.doc));
		this.tabs = Object.fromEntries((Object.entries(tabs))
			.map(([tabName, tabFilter]) => [
				tabName,
				{featured: [], other: validItems.filter(tabFilter)}
			]));
	}

	applyFeaturedFilters<T extends BladesActor|BladesItem>(filters: Record<string, (a: T) => boolean>, isFeaturing: Record<string,boolean>) {
		for (const [tabName, filterFunc] of Object.entries(filters)) {
			// const filterFunc = filters[tabName];
			const [featured, other] = [
				(this.tabs[tabName].other as T[]).filter((doc: T) => filterFunc(doc)),
				(this.tabs[tabName].other as T[]).filter((doc: T) => !filterFunc(doc))
			];
			if (isFeaturing[tabName as keyof typeof isFeaturing]) {
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

	doc: BladesActor|BladesItem;
	category: KeyOf<typeof BladesActor.CategoryTypes|typeof BladesItem.CategoryTypes>;
	callback: (docID: string) => Promise<void>;

	get docSuperType(): "Actor"|"Item" {
		if (this.category in BladesActor.CategoryTypes) {
			return "Actor";
		}
		if (this.category in BladesItem.CategoryTypes) {
			return "Item";
		}
		throw new Error(`Unrecognized Category: ${this.category}`);
	}

	get docType(): BladesItemType|BladesActorType {
		if (this.category in BladesActor.CategoryTypes) {
			return BladesActor.CategoryTypes[this.category];
		}
		if (this.category in BladesItem.CategoryTypes) {
			return BladesItem.CategoryTypes[this.category];
		}
		throw new Error(`Unrecognized Category: ${this.category}`);
	}

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
					eLog.checkLog("dialog", `[BladesDialog] Calling Back (${docId})`);
					self.callback(docId);
				}
				self.close();
			},
			mouseenter: async function() {
				$(this).closest(".tab").addClass("hovering");
				$(this).addClass("hover-over");
				if (self.docSuperType === "Item") {
					const item = await BladesItem.GetPersonal($(this).data("itemId"), self.doc as BladesActor);
					if (!item) { return }
					const itemRules = (new Handlebars.SafeString(`<span>${item.system.rules}</span>`)).toString();
					itemDetailPane$.html(itemRules);
				} else if (self.docSuperType === "Actor") {
					const targetActor = await BladesActor.GetPersonal($(this).data("itemId"), self.doc as BladesActor);
					if (!targetActor) { return }
					const actorDesc = (new Handlebars.SafeString(`<span>${targetActor.system.concept || targetActor.system.description_short || ""}</span>`)).toString();
					itemDetailPane$.html(actorDesc);
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