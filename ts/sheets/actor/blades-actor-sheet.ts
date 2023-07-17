
import C, {BladesActorType, BladesItemType, District, Tag, Actions, BladesPhase} from "../../core/constants.js";
import type {Attributes} from "../../core/constants.js";

import U from "../../core/utilities.js";
import BladesSheet from "./blades-sheet.js";
import BladesItem from "../../blades-item.js";
import BladesActor from "../../blades-actor.js";
// import Tagify from "../../lib/tagify/tagify.esm.js";
// import ConstructorDataType from "@league-of-foundry-developers/foundry-vtt-types/src/types/helperTypes.js";
// import {ItemDataConstructorData} from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/itemData.js";


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

	static Initialize() {
		Actors.registerSheet("blades", BladesActorSheet, {types: ["pc"], makeDefault: true});

		Hooks.on("dropActorSheetData", async (parentActor: BladesActor, _, {uuid}: {uuid: string}) => {
			const doc = await fromUuid(uuid) as BladesDoc|null;
			if (doc instanceof BladesActor) {
				if (parentActor.type === BladesActorType.crew && doc.type === BladesActorType.pc) {
					// Dropping a PC onto a Crew Sheet: Add Crew to PC
					doc.addSubActor(parentActor);
				} else if (parentActor.type === BladesActorType.pc && doc.type === BladesActorType.crew) {
					// Dropping a Crew onto a PC Sheet: Add
					parentActor.addSubActor(doc);
				}
			}
			if (doc instanceof BladesItem) {
				BladesItem.create(doc as {name: string, type: BladesItemType}, {parent: parentActor});
				return;
			}
		});
		return loadTemplates([
			"systems/eunos-blades/templates/items/clock_keeper-sheet.hbs",
			"systems/eunos-blades/templates/parts/clock-sheet-row.hbs"
		]);
	}

	override getData() {
		const context = super.getData() as ReturnType<BladesSheet["getData"]> & {attributes: Record<Attributes,Record<Actions,ValueMax>>};

		const sheetData: Partial<BladesActorSheetData> = {};


		sheetData.isOwner = this.actor.testUserPermission(game.user, CONST.DOCUMENT_PERMISSION_LEVELS.OWNER);

		context.attributes = U.objMap(context.system.attributes, (attrData: Record<Actions, ValueMax>) => U.objMap(attrData, (value: ValueMax): ValueMax => ({
			value: value.value,
			max: game.eunoblades.Tracker!.system.game_phase === BladesPhase.CharGen ? 2 : value.max
		}))) as Record<Attributes,Record<Actions,ValueMax>>;

		const {activeSubItems, activeSubActors} = this.actor;

		Object.assign(
			sheetData,
			{
				phases: Object.values(BladesPhase),
				items: { //~ Process and sort active subItems
					abilities: activeSubItems.filter((item) => item.type === BladesItemType.ability).map((item) => {
						//~ Assign dotlines to abilities with usage data
						if (item.system.uses?.max) {
							Object.assign(item, {
								inRuleDotline: {
									data: item.system.uses,
									dotlineLabel: "Uses",
									target: "item.system.uses.value",
									iconEmpty: "dot-empty.svg",
									iconEmptyHover: "dot-empty-hover.svg",
									iconFull: "dot-full.svg",
									iconFullHover: "dot-full-hover.svg"
								}
							});
						}
						return item;
					}),
					background: activeSubItems.find((item) => item.type === BladesItemType.background),
					heritage: activeSubItems.find((item) => item.type === BladesItemType.heritage),
					vice: activeSubItems.find((item) => item.type === BladesItemType.vice),
					loadout: activeSubItems.filter((item) => item.type === BladesItemType.item).map((item) => {
						// Assign load and usage data to gear
						if (item.system.load) {
							Object.assign(item, {
								numberCircle: item.system.load,
								numberCircleClass: "item-load"
							});
						}
						if (item.system.uses?.max) {
							Object.assign(item, {
								inRuleDotline: {
									data: item.system.uses,
									dotlineLabel: "Uses",
									target: "item.system.uses.value",
									iconEmpty: "dot-empty.svg",
									iconEmptyHover: "dot-empty-hover.svg",
									iconFull: "dot-full.svg",
									iconFullHover: "dot-full-hover.svg"
								}
							});
						}
						return item;
					}),
					playbook: this.actor.playbook
				},
				actors: { //~ Process and sort active subActors
					crew: activeSubActors.find((actor) => actor.type === BladesActorType.crew),
					vice_purveyor: activeSubActors.find((actor) => actor.hasTag(Tag.NPC.VicePurveyor)),
					friends: activeSubActors.filter((actor) => actor.hasTag(Tag.NPC.Friend)),
					rivals: activeSubActors.filter((actor) => actor.hasTag(Tag.NPC.Rival))
				},
				stashData: {
					label: "Stash:",
					dotline: {
						data: this.actor.system.stash,
						target: "system.stash.value",
						iconEmpty: "coin-empty.svg",
						iconEmptyHover: "coin-empty-hover.svg",
						iconFull: "coin-full.svg",
						iconFullHover: "coin-full-hover.svg",
						altIconFull: "coin-ten.svg",
						altIconFullHover: "coin-ten-hover.svg",
						altIconStep: 10
					}
				},
				healing_clock: {
					value: this.actor.system.healing.value,
					size: this.actor.system.healing.max
				},
				armor: Object.fromEntries(Object.entries(this.actor.system.armor.active)
					.filter(([, isActive]) => isActive)
					.map(([armor]) => [armor, this.actor.system.armor.checked[armor as keyof BladesActor["system"]["armor"]["checked"]]])),
				loadData: {
					curLoad: this.actor.currentLoad,
					selLoadCount: this.actor.system.loadout.levels[U.lCase(game.i18n.localize(this.actor.system.loadout.selected.toString())) as "heavy"|"normal"|"light"|"encumbered"],
					selections: C.Loadout.selections,
					selLoadLevel: this.actor.system.loadout.selected.toString()
				},
				stressData: {
					name: this.actor.system.stress.name,
					dotline: {
						data: this.actor.system.stress,
						target: "system.stress.value",
						svgKey: "teeth.tall",
						svgFull: "full|half|frame",
						svgEmpty: "full|half|frame"
					}
				},
				traumaData: {
					name: this.actor.system.trauma.name,
					dotline: {
						data: {value: this.actor.trauma, max: this.actor.system.trauma.max},
						svgKey: "teeth.short",
						svgFull: "full|frame",
						svgEmpty: "frame",
						isLocked: true
					},
					compContainer: {
						"class": "comp-trauma-conditions comp-vertical full-width",
						"blocks": [
							this.actor.traumaList.slice(0, Math.ceil(this.actor.traumaList.length / 2))
								.map((tName) => ({
									checkLabel: tName,
									checkClasses: {
										active: "comp-toggle-red",
										inactive: "comp-toggle-grey"
									},
									checkTarget: `system.trauma.checked.${tName}`,
									checkValue: this.actor.system.trauma.checked[tName] ?? false
								})),
							this.actor.traumaList.slice(Math.ceil(this.actor.traumaList.length / 2))
								.map((tName) => ({
									checkLabel: tName,
									checkClasses: {
										active: "comp-toggle-red",
										inactive: "comp-toggle-grey"
									},
									checkTarget: `system.trauma.checked.${tName}`,
									checkValue: this.actor.system.trauma.checked[tName] ?? false
								}))
						]
					}
				},
				acquaintancesName: this.actor.system.acquaintances_name ?? "Friends & Rivals",
				friendsName: this.actor.system.friends_name,
				rivalsName: this.actor.system.rivals_name,
				abilityData: {
					dotline: {
						"class": "dotline-right",
						"data": {
							value: this.actor.availableAbilityPoints,
							max: this.actor.availableAbilityPoints
						},
						"dotlineLabel": "Available Abilities",
						"isLocked": true,
						"iconFull": "dot-full.svg"
					}
				}
			}
		);

		eLog.checkLog("actor", "[BladesActorSheet] getData()", {...context, ...sheetData});

		return {
			...context,
			...sheetData
		};
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
				eLog.log4("Mouse Enter", targetArmor, this, $(this), $(this).next());
				if (!targetArmor) { return }
				$(this).siblings(`.svg-armor.armor-${targetArmor}`).addClass("hover-over");
			},
			mouseleave: function() {
				const targetArmor = self._getHoverArmor();
				if (!targetArmor) { return }
				$(this).siblings(`.svg-armor.armor-${targetArmor}`).removeClass("hover-over");
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
				$(this).siblings(".svg-armor.armor-special").addClass("hover-over");
			},
			mouseleave: function() {
				if (!self.activeArmor.includes("special") || self.activeArmor.length === 1) { return }
				$(this).siblings(".svg-armor.armor-special").removeClass("hover-over");
			}
		});
	}
}

// declare interface BladesActorSheet {
// 	get actor(): BladesActor
// }

export default BladesActorSheet;