import C, {BladesActorType, BladesItemType} from "./core/constants.js";
import U from "./core/utilities.js";
import G from "./core/gsap.js";
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
		category: keyof typeof BladesActor.CategoryTypes|keyof typeof BladesItem.CategoryTypes,
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
		if (this.docSuperType === "Actor") {
			return this._createActorTabs(tabs as Record<string,(a: BladesActor) => boolean>);
		}
		return this._createItemTabs(tabs as Record<string,(a: BladesItem) => boolean>);
	}

	_filterUniqueActors(actors: AnyBladesActor[]) {
		const actorIDLog: string[] = [];
		return actors.filter((actor) => {
			if (actorIDLog.includes(actor.id!)) {
				return false;
			} else {
				actorIDLog.push(actor.id!);
				return true;
			}
		});
	}

	async _createActorTabs(tabs: Record<string, (a: BladesActor) => boolean>) {
		eLog.checkLog3("actorFetch", `BladesDialog._createActorTabs() --- cat = ${this.category}`);
		const allCategoryActors = BladesActor.GetPersonalGlobalCategoryActors(this.category as keyof typeof BladesActor.CategoryTypes, this.parentDoc as BladesActor);
		const validatedActors: Array<BladesActor|null> = allCategoryActors.map((actor) => (actor.isValidForDoc(this.parentDoc) ? actor : null));
		const validActors: BladesActor[] = this._filterUniqueActors(validatedActors.filter((actor): actor is BladesActor => actor !== null));
		this.tabs = Object.fromEntries((Object.entries(tabs))
			.map(([tabName, tabFilter]) => [
				tabName,
				{featured: [], other: validActors.filter(tabFilter)}
			]));
	}
	async _createItemTabs(tabs: Record<string,(i: BladesItem) => boolean>) {
		const allCategoryItems = await BladesItem.GetGlobalCategoryItems(this.category as keyof typeof BladesItem.CategoryTypes, this.parentDoc as BladesActor);
		const validatedItems: Array<BladesItem|null> = await Promise.all(allCategoryItems.map(async (item) => {
			return (await item.isValidForDoc(this.parentDoc)) ? item : null;
		}));
		const validItems: BladesItem[] = validatedItems.filter((item): item is BladesItem => item !== null);
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

	parentDoc: BladesActor|BladesItem;
	category: keyof typeof BladesActor.CategoryTypes|keyof typeof BladesItem.CategoryTypes;
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
			return BladesActor.CategoryTypes[this.category as keyof typeof BladesActor.CategoryTypes];
		}
		if (this.category in BladesItem.CategoryTypes) {
			return BladesItem.CategoryTypes[this.category as keyof typeof BladesItem.CategoryTypes];
		}
		throw new Error(`Unrecognized Category: ${this.category}`);
	}

	constructor(data: BladesDialog.Data, options?: Partial<BladesDialog.Options>) {
		// eLog.checkLog4("dialog", "[BladesDialog] constructor(data)", {...data});
		super(data, options);
		// eLog.checkLog4("dialog", "[BladesDialog] super(data)", {...data});


		this.parentDoc = data.doc;
		this.category = data.category;
		this.callback = data.callback;
	}

	override getData(): Omit<BladesDialog.Data,"title"> {
		const data = super.getData();
		eLog.checkLog4("dialog", "[BladesDialog] super.getData()", {...data});

		Object.assign(
			data,
			{
				tabs: this.tabs,
				category: this.category
			}
		);

		eLog.checkLog("dialog", "[BladesDialog] return getData()", {...data});
		return data as Omit<BladesDialog.Data,"title">;
	}

	override activateListeners(html: JQuery<HTMLElement>) {
		super.activateListeners(html);

		const self = this;

		//~ Item Control
		html.find("[data-item-id]")
			.each(function(i, elem) {
				$(elem).data("hoverTimeline", G.effects.hoverDialogItem(elem));
			}).on({
				click: function() {
					const docId = $(this).data("itemId");
					if (docId) {
						self.callback(docId);
					}
					self.close();
				},
				mouseenter: function() {
					$(this).data("hoverTimeline").play();
				},
				mouseleave: function() {
					$(this).data("hoverTimeline").reverse();
				}
			});
	}
}

export default BladesDialog;