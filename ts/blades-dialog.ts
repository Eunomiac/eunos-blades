import C, {BladesActorType, BladesItemType} from "./core/constants.js";
import U from "./core/utilities.js";
import G from "./core/gsap.js";
import BladesActor from "./blades-actor.js";
import BladesItem from "./blades-item.js";

const app = new Dialog({title: "Test", content: "", buttons: {}});
const tit = app.title;
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

	static async Display(
		parentDoc: BladesActor,
		title: string,
		tabs: Record<string, BladesActor[]|BladesItem[]>,
		callback: (docID: string) => Promise<void>
	) {
		const app = new BladesDialog({
			parentDoc,
			title,
			tabs,
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
		} as BladesDialog.Data);

		return app.render(true);
	}

	parentDoc: BladesActor;
	_title: string;
	override get title(): string { return this._title }
	tabs: Record<string, BladesActor[]|BladesItem[]>;
	callback: (docID: string) => Promise<void>;

	constructor(data: BladesDialog.Data, options?: Partial<BladesDialog.Options>) {
		// eLog.checkLog4("dialog", "[BladesDialog] constructor(data)", {...data});
		super(data, options);
		// eLog.checkLog4("dialog", "[BladesDialog] super(data)", {...data});

		this.parentDoc = data.parentDoc;
		this._title = data.title;
		this.tabs = data.tabs;
		this.callback = data.callback;
	}

	override getData(): Omit<BladesDialog.Data,"title"> {
		const data = super.getData() as Partial<BladesDialog.Data>;
		eLog.checkLog4("dialog", "[BladesDialog] super.getData()", {...data});
		data.title = this.title;
		data.tabs = this.tabs;

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