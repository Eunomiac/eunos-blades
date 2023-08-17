/* ****▌███████████████████████████████████████████████████████████████████████████▐**** *\
|*     ▌████░░░░░░░░░░░ Euno's Blades in the Dark for Foundry VTT ░░░░░░░░░░░░░████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░ by Eunomiac ░░░░░░░░░░░░░██████████████████▐     *|
|*     ▌████████████████████████████  License █ v0.1.0 ████████████████████████████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░░░░░░  ░░░░░░░░░░░░░░░░░░███████████████████▐     *|
\* ****▌███████████████████████████████████████████████████████████████████████████▐**** */

import C, { BladesActorType, BladesItemType, Attribute, Tag, BladesPhase } from "../../core/constants.js";
import U from "../../core/utilities.js";
import BladesSheet from "./blades-sheet.js";
import BladesActor from "../../blades-actor.js";
import BladesTrackerSheet from "../item/blades-tracker-sheet.js";

class BladesActorSheet extends BladesSheet {
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            classes: ["eunos-blades", "sheet", "actor", "pc"],
            template: "systems/eunos-blades/templates/actor-sheet.hbs",
            width: 775,
            height: 775,
            tabs: [{ navSelector: ".nav-tabs", contentSelector: ".tab-content", initial: "abilities" }]
        });
    }
    static Initialize() {
        Actors.registerSheet("blades", BladesActorSheet, { types: ["pc"], makeDefault: true });
        Hooks.on("dropActorSheetData", async (parentActor, _, { uuid }) => {
            const doc = await fromUuid(uuid);
            if (doc instanceof BladesActor) {
                if (parentActor.type === BladesActorType.crew && doc.type === BladesActorType.pc) {
                    doc.addSubActor(parentActor);
                }
                else if (parentActor.type === BladesActorType.pc && doc.type === BladesActorType.crew) {
                    parentActor.addSubActor(doc);
                }
            }
        });
        return loadTemplates([
            "systems/eunos-blades/templates/items/clock_keeper-sheet.hbs",
            "systems/eunos-blades/templates/parts/clock-sheet-row.hbs"
        ]);
    }
    getData() {
        const context = super.getData();
        const { activeSubItems, activeSubActors } = this.actor;
        const sheetData = {};

        sheetData.preparedItems = Object.assign(context.preparedItems ?? {}, {
            abilities: activeSubItems
                .filter((item) => item.type === BladesItemType.ability)
                .map((item) => {
                if (item.system.uses_per_score.max) {
                    Object.assign(item, {
                        inRuleDotline: {
                            data: item.system.uses_per_score,
                            dotlineLabel: "Uses",
                            target: "item.system.uses_per_score.value",
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
            loadout: activeSubItems.filter((item) => item.type === BladesItemType.gear).map((item) => {
                if (item.system.load) {
                    Object.assign(item, {
                        numberCircle: item.system.load,
                        numberCircleClass: "item-load"
                    });
                }
                if (item.system.uses_per_score.max) {
                    Object.assign(item, {
                        inRuleDotline: {
                            data: item.system.uses_per_score,
                            dotlineLabel: "Uses",
                            target: "item.system.uses_per_score.value",
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
        });
        sheetData.preparedActors = {
            crew: activeSubActors.find((actor) => actor.type === BladesActorType.crew),
            vice_purveyor: activeSubActors.find((actor) => actor.hasTag(Tag.NPC.VicePurveyor)),
            acquaintances: activeSubActors.filter((actor) => actor.hasTag(Tag.NPC.Acquaintance))
        };
        sheetData.hasVicePurveyor = Boolean(this.actor.playbook?.hasTag(Tag.Gear.Advanced) === false
            && activeSubItems.find((item) => item.type === BladesItemType.vice));
        sheetData.healing_clock = {
            display: "Healing",
            target: "system.healing.value",
            color: "white",
            isVisible: true,
            isNameVisible: false,
            isActive: false,
            ...this.actor.system.healing
        };
        sheetData.stashData = {
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
        };
        sheetData.stressData = {
            label: this.actor.system.stress.name,
            dotline: {
                data: this.actor.system.stress,
                dotlineClass: this.actor.system.stress.max >= 13 ? "narrow-stress" : "",
                target: "system.stress.value",
                svgKey: "teeth.tall",
                svgFull: "full|half|frame",
                svgEmpty: "full|half|frame"
            }
        };
        sheetData.traumaData = {
            label: this.actor.system.trauma.name,
            dotline: {
                data: { value: this.actor.trauma, max: this.actor.system.trauma.max },
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
                        checkValue: this.actor.system.trauma.checked[tName] ?? false,
                        tooltip: C.TraumaTooltips[tName],
                        tooltipClass: "tooltip-trauma"
                    })),
                    this.actor.traumaList.slice(Math.ceil(this.actor.traumaList.length / 2))
                        .map((tName) => ({
                        checkLabel: tName,
                        checkClasses: {
                            active: "comp-toggle-red",
                            inactive: "comp-toggle-grey"
                        },
                        checkTarget: `system.trauma.checked.${tName}`,
                        checkValue: this.actor.system.trauma.checked[tName] ?? false,
                        tooltip: C.TraumaTooltips[tName],
                        tooltipClass: "tooltip-trauma"
                    }))
                ]
            }
        };
        sheetData.abilityData = {
            dotline: {
                dotlineClass: "dotline-right dotline-glow",
                data: {
                    value: this.actor.getAvailableAdvancements("Ability"),
                    max: this.actor.getAvailableAdvancements("Ability")
                },
                dotlineLabel: "Available Abilities",
                isLocked: true,
                iconFull: "dot-full.svg"
            }
        };
        sheetData.loadData = {
            curLoad: this.actor.currentLoad,
            selLoadCount: this.actor.system.loadout.levels[U.lCase(game.i18n.localize(this.actor.system.loadout.selected.toString()))],
            selections: C.Loadout.selections,
            selLoadLevel: this.actor.system.loadout.selected.toString()
        };
        sheetData.armor = Object.fromEntries(Object.entries(this.actor.system.armor.active)
            .filter(([, isActive]) => isActive)
            .map(([armor]) => [armor, this.actor.system.armor.checked[armor]]));
        sheetData.attributeData = {};
        const attrEntries = Object.entries(this.actor.system.attributes);
        for (const [attribute, attrData] of attrEntries) {
            sheetData.attributeData[attribute] = {
                tooltip: C.AttributeTooltips[attribute],
                actions: {}
            };
            const actionEntries = Object.entries(attrData);
            for (const [action, actionData] of actionEntries) {
                sheetData.attributeData[attribute].actions[action] = {
                    tooltip: C.ActionTooltips[action],
                    value: actionData.value,
                    max: BladesTrackerSheet.Get().phase === BladesPhase.CharGen ? 2 : this.actor.system.attributes[attribute][action].max
                };
            }
        }
        sheetData.gatherInfoTooltip = (new Handlebars.SafeString([
            "<h2>Gathering Information: Questions to Consider</h2>",
            "<ul>",
            ...Object.values(this.actor.system.gather_info ?? []).map((line) => `<li>${line}</li>`) ?? [],
            "</ul>"
        ].join(""))).toString();
        eLog.checkLog("Attribute", "[BladesActorSheet] attributeData", { attributeData: sheetData.attributeData });
        eLog.checkLog("actor", "[BladesActorSheet] getData()", { ...context, ...sheetData });
        return { ...context, ...sheetData };
    }
    get activeArmor() {
        return Object.keys(U.objFilter(this.actor.system.armor.active, (val) => val === true));
    }
    get checkedArmor() {
        return Object.keys(U.objFilter(this.actor.system.armor.checked, (val, key) => val === true
            && this.actor.system.armor.active[key] === true));
    }
    get uncheckedArmor() {
        return Object.keys(U.objFilter(this.actor.system.armor.active, (val, key) => val === true
            && this.actor.system.armor.checked[key] === false));
    }
    _getHoverArmor() {
        if (!this.activeArmor.length) {
            return false;
        }
        if (this.activeArmor.includes("heavy")) {
            return this.checkedArmor.includes("heavy") ? "light" : "heavy";
        }
        else if (this.activeArmor.includes("light")) {
            return "light";
        }
        return "special";
    }
    _getClickArmor() {
        if (!this.uncheckedArmor.length) {
            return false;
        }
        if (this.uncheckedArmor.includes("heavy")) {
            return "heavy";
        }
        if (this.uncheckedArmor.includes("light")) {
            return "light";
        }
        return "special";
    }
    _getContextMenuArmor() {
        if (!this.checkedArmor.length) {
            return false;
        }
        if (this.checkedArmor.includes("light")) {
            return "light";
        }
        if (this.checkedArmor.includes("heavy")) {
            return "heavy";
        }
        return "special";
    }
    async _onAdvanceClick(event) {
        event.preventDefault();
        super._onAdvanceClick(event);
        const action = $(event.currentTarget).data("action").replace(/^advance-/, "");
        if (action in Attribute) {
            this.actor.advanceAttribute(action);
        }
    }
    activateListeners(html) {
        super.activateListeners(html);

        if (!this.options.editable) {
            return;
        }
        const self = this;

        html.find(".main-armor-control").on({
            click: function () {
                const targetArmor = self._getClickArmor();
                if (!targetArmor) {
                    return;
                }
                self.actor.update({ [`system.armor.checked.${targetArmor}`]: true });
            },
            contextmenu: function () {
                const targetArmor = self._getContextMenuArmor();
                if (!targetArmor) {
                    return;
                }
                self.actor.update({ [`system.armor.checked.${targetArmor}`]: false });
            },
            mouseenter: function () {
                const targetArmor = self._getHoverArmor();
                eLog.log4("Mouse Enter", targetArmor, this, $(this), $(this).next());
                if (!targetArmor) {
                    return;
                }
                $(this).siblings(`.svg-armor.armor-${targetArmor}`).addClass("hover-over");
            },
            mouseleave: function () {
                const targetArmor = self._getHoverArmor();
                if (!targetArmor) {
                    return;
                }
                $(this).siblings(`.svg-armor.armor-${targetArmor}`).removeClass("hover-over");
            }
        });
        html.find(".special-armor-control").on({
            click: function () {
                if (!self.activeArmor.includes("special")) {
                    return;
                }
                self.actor.update({ ["system.armor.checked.special"]: self.uncheckedArmor.includes("special") });
            },
            contextmenu: function () {
                if (!self.activeArmor.includes("special")) {
                    return;
                }
                self.actor.update({ ["system.armor.checked.special"]: self.uncheckedArmor.includes("special") });
            },
            mouseenter: function () {
                if (!self.activeArmor.includes("special") || self.activeArmor.length === 1) {
                    return;
                }
                $(this).siblings(".svg-armor.armor-special").addClass("hover-over");
            },
            mouseleave: function () {
                if (!self.activeArmor.includes("special") || self.activeArmor.length === 1) {
                    return;
                }
                $(this).siblings(".svg-armor.armor-special").removeClass("hover-over");
            }
        });
    }
}
export default BladesActorSheet;