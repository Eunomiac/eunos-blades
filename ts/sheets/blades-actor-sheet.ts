
import C from "../core/constants.js";
import U from "../core/utilities.js";
import BladesSheet from "./blades-sheet.js";
import BladesActiveEffect from "../blades-active-effect.js";
import type BladesItem from "../blades-item";
import type BladesActor from "../blades-actor.js";

class BladesActorSheet extends BladesSheet {

	static override get defaultOptions() {
	  return foundry.utils.mergeObject(super.defaultOptions, {
			classes: ["eunos-blades", "sheet", "actor", "pc"],
			template: "systems/eunos-blades/templates/actor-sheet.hbs",
			width: 775,
			height: 775,
			tabs: [{navSelector: ".nav-tabs", contentSelector: ".tab-content", initial: "abilities"}]
		});
	}

	/* -------------------------------------------- */

	override async getData() {
		const data = await super.getData();
		eLog.log("[BladesActorSheet] super.getData()", {...data});

		//~ Calculate Loadout
		const curLoad = U.gsap.utils.clamp(0, 10, data.items
			.reduce((tot, i) => tot + (i.type === "item"
			// @ts-expect-error Need to figure out what's returned by data.items.
				? U.pInt(i.system.load)
				: 0
			), 0));

		//~ Isolate heritage/background/vice/class information
		const classItem = data.items.find((item) => item.type === "class");

		//~ Override Vice item for classes with locked vices
		const viceOverride = this.actor.system.vice.override as string;

		Object.assign(
			data,
			{
				effects: this.actor.effects,
				items: {
					"class": classItem,
					"classBgImg": classItem && classItem.name in C.ClassTagLines
						? C.ClassBgImages[classItem.name as KeyOf<typeof C.ClassBgImages>]
						: classItem?.img ?? "",
					"heritage": data.items.find((item) => item.type === "heritage"),
					"background": data.items.find((item) => item.type === "background"),
					"vice": (viceOverride && JSON.parse(viceOverride)) || data.items.find((item) => item.type === "vice"),
					"classTagLine": classItem && classItem.name in C.ClassTagLines
						? C.ClassTagLines[classItem.name as KeyOf<typeof C.ClassTagLines>]
						: ""
				},
				healing_clock: {
					color: "white",
					size: this.actor.system.healing.max,
					value: this.actor.system.healing.value
				},
				armor: Object.fromEntries(Object.entries(this.actor.system.armor.active)
					.filter(([, isActive]) => isActive)
					.map(([armor]) => [armor, this.actor.system.armor.checked[armor as keyof BladesActor["system"]["armor"]["checked"]]])),
				loadData: {
					curLoad,
					curLoadLevel: C.Loadout.levels[Object.values(this.actor.system.loadout.levels)
						.find((load) => load >= curLoad) ?? 4],
					selections: C.Loadout.selections,
					selLoadLevel: this.actor.system.loadout.selected
				}
			}
		);
		eLog.log("[BladesActorSheet] return getData()", {...data});
		return data;
	}

	get activeArmor() {
		return Object.keys(U.objFilter(this.actor.system.armor.active, (val: boolean) => val === true));
	}
	get checkedArmor() {
		return Object.keys(U.objFilter(
			this.actor.system.armor.checked,
			(val: string|number|boolean, key: KeyOf<typeof this.actor.system.armor.checked>) => val === true
				&& this.actor.system.armor.active[key] === true
		));
	}
	get uncheckedArmor() {
		return Object.keys(U.objFilter(
			this.actor.system.armor.active,
			(val: string|number|boolean, key: KeyOf<typeof this.actor.system.armor.active>) => val === true
				&& this.actor.system.armor.checked[key] === false
		));
	}

	_getHoverArmor(): string|false {
		if (!this.activeArmor.length) { return false }
		if (this.activeArmor.includes("heavy")) {
			return this.checkedArmor.includes("heavy") ? "light" : "heavy";
		} else if (this.activeArmor.includes("light")) { return "light" }
		return "special";
	}

	_getClickArmor(): string|false {
		if (!this.uncheckedArmor.length) { return false }
		if (this.uncheckedArmor.includes("heavy")) { return "heavy" }
		if (this.uncheckedArmor.includes("light")) { return "light" }
		return "special";
	}

	_getContextMenuArmor(): string|false {
		if (!this.checkedArmor.length) { return false }
		if (this.checkedArmor.includes("light")) { return "light" }
		if (this.checkedArmor.includes("heavy")) { return "heavy" }
		return "special";
	}

	override activateListeners(html: JQuery<HTMLElement>) {

		super.activateListeners(html);

		//~ Everything below here is only needed if the sheet is editable
		if (!this.options.editable) {return}

		const self = this;

		//~ Armor Control
		html.find(".main-armor-control").on({
			click: function() {
				const targetArmor = self._getClickArmor();
				if (!targetArmor) { return }
				self.actor.update({[`system.armor.checked.${targetArmor}`]: true});
			},
			contextmenu: function() {
				const targetArmor = self._getContextMenuArmor();
				if (!targetArmor) { return }
				self.actor.update({[`system.armor.checked.${targetArmor}`]: false});
			},
			mouseenter: function() {
				const targetArmor = self._getHoverArmor();
				if (!targetArmor) { return }
				$(this).children(`.svg-armor.armor-${targetArmor}`).addClass("hover-over");
			},
			mouseleave: function() {
				const targetArmor = self._getHoverArmor();
				if (!targetArmor) { return }
				$(this).children(`.svg-armor.armor-${targetArmor}`).removeClass("hover-over");
			}
		});

		html.find(".special-armor-control").on({
			click: function() {
				if (!self.activeArmor.includes("special")) { return }
				self.actor.update({["system.armor.checked.special"]: self.uncheckedArmor.includes("special")});
			},
			contextmenu: function() {
				if (!self.activeArmor.includes("special")) { return }
				self.actor.update({["system.armor.checked.special"]: self.uncheckedArmor.includes("special")});
			},
			mouseenter: function() {
				if (!self.activeArmor.includes("special") || self.activeArmor.length === 1) { return }
				$(this).children(".svg-armor.armor-special").addClass("hover-over");
			},
			mouseleave: function() {
				if (!self.activeArmor.includes("special") || self.activeArmor.length === 1) { return }
				$(this).children(".svg-armor.armor-special").removeClass("hover-over");
			}
		});

		//~ Update Inventory Item
		html.find(".item-body").on({
			click: function() {
				const element = $(this).parents(".item");
				const item = self.actor.items.get(element.data("itemId"));
				item?.sheet?.render(true);
			}});

		//~ Delete Inventory Item
		html.find(".item-delete").on({
			click: async function() {
				const element = $(this).parents(".item");
				await self.actor.deleteEmbeddedDocuments("Item", [element.data("itemId")]);
				element.slideUp(200, () => self.render(false));
			}
		});

		//~ Manage Active Effects
		html.find(".effect-control").on({
			click: function(event: ClickEvent) {
				BladesActiveEffect.onManageActiveEffect(event, self.actor);
			}
		});
	}
}

declare interface BladesActorSheet {
	get actor(): BladesActor
}

export default BladesActorSheet;