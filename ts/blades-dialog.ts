import G from "./core/gsap.js";
import BladesActor from "./blades-actor.js";
import BladesItem from "./blades-item.js";

export enum SelectionCategory {
	Heritage = "Heritage",
	Background = "Background",
	Vice = "Vice",
	Playbook = "Playbook",
	Reputation = "Reputation",
	PreferredOp = "PreferredOp",
	Gear = "Gear",
	Ability = "Ability",
	Faction = "Faction",
	Upgrade = "Upgrade",
	Cohort = "Cohort",
	Feature = "Feature",
	Stricture = "Stricture",
	VicePurveyor = "VicePurveyor",
	Acquaintance = "Acquaintance",
	Friend = "Friend",
	Rival = "Rival",
	Crew = "Crew",
	Member = "Member"
}

class BladesSelectorDialog extends Dialog {

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
		parent: BladesActor,
		title: string,
		docType: "Actor"|"Item",
		tabs: Record<string, BladesActor[]|BladesItem[]>,
		tags?: string[]
	) {
		eLog.checkLog("BladesSelectorDialog.Display()", {parent, title, tabs});
		const app = new BladesSelectorDialog({
			parent,
			title,
			docType,
			tabs,
			"tags": tags?.filter((tag): tag is BladesTag => tag !== ""),
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

		return app.render(true);
	}

	parent: BladesActor;
	tabs: Record<string, BladesActor[]|BladesItem[]>;
	tags: BladesTag[] = [];
	docType: "Actor"|"Item";

	constructor(data: BladesDialog.Data, options?: Partial<BladesDialog.Options>) {
		super(data, options);
		this.docType = data.docType;
		this.parent = data.parent;
		this.tabs = data.tabs;
		this.tags = data.tags ?? [];
	}

	override getData() {
		const data = super.getData() as BladesDialog.Data;
		eLog.checkLog4("dialog", "[BladesDialog] super.getData()", {...data});
		data.title = this.title;
		data.tabs = this.tabs;
		data.docType = this.docType;
		data.tags = this.tags;

		eLog.checkLog("dialog", "[BladesDialog] return getData()", {...data});
		return data;
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
					const docType = $(this).data("docType");
					eLog.checkLog("dialog", "[BladesDialog] on Click", {elem: this, docId, docType, parent: self.parent});
					if (docType === "Actor") {
						self.parent.addSubActor(docId, self.tags);
					} else if (docType === "Item") {
						self.parent.addSubItem(docId);
					}
					self.close();
				},
				mouseenter: function() {
					$(this).parent().css("z-index", 1);
					$(this).data("hoverTimeline").play();
				},
				mouseleave: function() {
					$(this).data("hoverTimeline").reverse().then(() => {
						$(this).parent().removeAttr("style");
					});
				}
			});
	}
}

export default BladesSelectorDialog;