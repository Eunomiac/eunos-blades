/* ****▌███████████████████████████████████████████████████████████████████████████▐**** *\
|*     ▌████░░░░░░░░░░░ Euno's Blades in the Dark for Foundry VTT ░░░░░░░░░░░░░████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░ by Eunomiac ░░░░░░░░░░░░░██████████████████▐     *|
|*     ▌████████████████████████████  License █ v0.1.0 ████████████████████████████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░░░░░░  ░░░░░░░░░░░░░░░░░░███████████████████▐     *|
\* ****▌███████████████████████████████████████████████████████████████████████████▐**** */

import C from "../core/constants.js";
import U from "../core/utilities.js";
import BladesSheet from "./blades-sheet.js";
import BladesItem from "../blades-item.js";
import BladesActor from "../blades-actor.js";
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
        Hooks.on("dropActorSheetData", async (actor, sheet, { type, uuid }) => {
            
            if (type === "Item") {
                const droppedItemId = uuid.replace(/^Item\./, "");
                const droppedItem = await BladesItem.GetGlobal(droppedItemId);
                if (!droppedItem) {
                    return;
                }
                if (!(droppedItem.type in BladesItem.CategoryDefaults)) {
                    return;
                }
                const category = BladesItem.CategoryDefaults[droppedItem.type];
                if (!category) {
                    return;
                }
                BladesItem.Embed(droppedItem, category, actor);
                return;
            }
        });
        return loadTemplates([
            "systems/eunos-blades/templates/items/clock_keeper-sheet.hbs",
            "systems/eunos-blades/templates/parts/clock-sheet-row.hbs"
        ]);
    }
    async getData() {
        const data = await super.getData();
        eLog.checkLog("actor", "[BladesActorSheet] super.getData()", { ...data });

        const attrData = {
            insight: { value: this.actor.attributes.insight, size: 4 + this.actor.system.resistance_bonuses.insight },
            prowess: { value: this.actor.attributes.prowess, size: 4 + this.actor.system.resistance_bonuses.prowess },
            resolve: { value: this.actor.attributes.resolve, size: 4 + this.actor.system.resistance_bonuses.resolve }
        };

        const allTraumaConditions = Object.keys(this.actor.system.trauma.active)
            .filter((key) => this.actor.system.trauma.active[key]);

        const items = {
            abilities: await BladesItem.GetActiveCategoryItems("ability", this.actor),
            background: (await BladesItem.GetActiveCategoryItems("background", this.actor))[0],
            heritage: (await BladesItem.GetActiveCategoryItems("heritage", this.actor))[0],
            vice: (this.actor.system.vice.override && JSON.parse(this.actor.system.vice.override))
                || (await BladesItem.GetActiveCategoryItems("vice", this.actor))[0],
            loadout: await BladesItem.GetActiveCategoryItems("item", this.actor),
            playbook: (await BladesItem.GetActiveCategoryItems("playbook", this.actor))[0]
        };
        const actors = {
            crew: (await BladesActor.GetActiveCategoryActors("pc-crew", this.actor))[0],
            vice_purveyor: (await BladesActor.GetActiveCategoryActors("vice-purveyor", this.actor))[0],
            acquaintances: (await BladesActor.GetActiveCategoryActors("acquaintance", this.actor))
        };
        Object.assign(data, {
            items,
            actors,
            playbookData: this.playbookData,
            coinsData: this.coinsData,
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
                color: "white",
                size: this.actor.system.healing.max,
                value: this.actor.system.healing.value
            },
            armor: Object.fromEntries(Object.entries(this.actor.system.armor.active)
                .filter(([, isActive]) => isActive)
                .map(([armor]) => [armor, this.actor.system.armor.checked[armor]])),
            loadData: {
                items: items.loadout.map((item) => {
                    if (item.system.load) {
                        Object.assign(item, {
                            numberCircle: item.system.load,
                            numberCircleClass: "item-load"
                        });
                    }
                    if (item.system.uses?.max) {
                        Object.assign(item, {
                            dotline: {
                                data: item.system.uses,
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
                curLoad: this.actor.currentLoad,
                selLoadCount: this.actor.system.loadout.levels[U.lCase(game.i18n.localize(this.actor.system.loadout.selected))],
                selections: C.Loadout.selections,
                selLoadLevel: this.actor.system.loadout.selected
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
            attributes: attrData,
            traumaData: {
                name: this.actor.system.trauma.name,
                dotline: {
                    data: { value: this.actor.trauma, max: this.actor.system.trauma.max },
                    svgKey: "teeth.short",
                    svgFull: "full|frame",
                    svgEmpty: "frame",
                    isLocked: true
                },
                compContainer: {
                    "class": "cont-full-height cont-full-width",
                    "blocks": [
                        { cells: allTraumaConditions.slice(0, Math.ceil(allTraumaConditions.length / 2))
                                .map((tName) => ({
                                label: tName,
                                checkControl: `system.trauma.checked.${tName}`,
                                checkValue: this.actor.system.trauma.checked[tName] ?? false
                            })) },
                        { cells: allTraumaConditions.slice(Math.ceil(allTraumaConditions.length / 2))
                                .map((tName) => ({
                                label: tName,
                                checkControl: `system.trauma.checked.${tName}`,
                                checkValue: this.actor.system.trauma.checked[tName] ?? false
                            })) }
                    ]
                }
            },
            acquaintancesName: items.playbook?.system.acquaintances_name ?? "Friends & Rivals"
        });
        eLog.checkLog("actor", "[BladesActorSheet] return getData()", { ...data });
        return data;
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