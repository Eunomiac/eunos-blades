/* ****▌███████████████████████████████████████████████████████████████████████████▐**** *\
|*     ▌████░░░░░░░░░░░ Euno's Blades in the Dark for Foundry VTT ░░░░░░░░░░░░░████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░ by Eunomiac ░░░░░░░░░░░░░██████████████████▐     *|
|*     ▌████████████████████████████  License █ v0.1.0 ████████████████████████████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░░░░░░  ░░░░░░░░░░░░░░░░░░███████████████████▐     *|
\* ****▌███████████████████████████████████████████████████████████████████████████▐**** */

import C from "../core/constants.js";
import U from "../core/utilities.js";
import BladesSheet from "./blades-sheet.js";
import BladesActiveEffect from "../blades-active-effect.js";
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
        Actors.registerSheet("blades", BladesActorSheet, { types: ["character"], makeDefault: true });
        Hooks.on("dropActorSheetData", (actor, sheet, { type, uuid }) => {
            if (type === "Actor") {
                const droppedActorId = uuid.replace(/^Actor\./, "");
                const droppedActor = game.actors.get(droppedActorId);
                if (!droppedActor) {
                    return;
                }
                switch (droppedActor.type) {
                    case "crew": {
                        actor.update({ "system.crew": droppedActorId });
                        break;
                    }
                }
                return;
            }
            if (type === "Item") {
                const droppedItemId = uuid.replace(/^Item\./, "");
                const droppedItem = game.items.get(droppedItemId);
                if (!droppedItem) {
                    return;
                }
                switch (droppedItem.type) {
                    case "playbook": {
                        break;
                    }
                }
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

        const playbookItem = data.items.find((item) => item.type === "playbook");
        const playbook = playbookItem?.name;

        const viceOverride = this.actor.system.vice.override;
        Object.assign(data, {
            effects: this.actor.effects,
            items: {
                abilities: data.items.filter((item) => item.type === "ability"),
                background: data.items.find((item) => item.type === "background"),
                heritage: data.items.find((item) => item.type === "heritage"),
                playbook: data.items.find((item) => item.type === "playbook"),
                vice: (viceOverride && JSON.parse(viceOverride)) || data.items.find((item) => item.type === "vice"),
                loadout: data.items.filter((item) => item.type === "item")
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
                curLoad: this.actor.currentLoad,
                selLoadCount: this.actor.system.loadout.levels[U.lCase(game.i18n.localize(this.actor.system.loadout.selected))],
                selections: C.Loadout.selections,
                selLoadLevel: this.actor.system.loadout.selected
            },
            attributes: attrData,
            traumaData: {
                name: this.actor.system.trauma.name,
                value: this.actor.trauma,
                max: this.actor.system.trauma.max,
                displayed: this.actor.traumaConditions
            }
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

        html.find(".item-delete").on({
            click: async function () {
                const element = $(this).parents(".item");
                await self.actor.removeItem(element.data("itemId"));
                element.slideUp(200, () => self.render(false));
            }
        });

        html.find(".effect-control").on({
            click: function (event) {
                BladesActiveEffect.onManageActiveEffect(event, self.actor);
            }
        });
    }
}
export default BladesActorSheet;