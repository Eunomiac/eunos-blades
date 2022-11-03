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
    }
        
    async getData() {
        const data = await super.getData();
        eLog.log("[BladesActorSheet] super.getData()", { ...data });

        const curLoad = U.gsap.utils.clamp(0, 10, data.items
            .reduce((tot, i) => tot + (i.type === "item"
            ? U.pInt(i.system.load)
            : 0), 0));

        const attrData = {
            insight: { value: this.actor.attributes.insight, size: 4 },
            prowess: { value: this.actor.attributes.prowess, size: 4 },
            resolve: { value: this.actor.attributes.resolve, size: 4 }
        };

        const playbookItem = data.items.find((item) => item.type === "playbook");
        const playbook = playbookItem?.name;

        const viceOverride = this.actor.system.vice.override;
        const availableItems = game.items
            .filter((item) => this.actor.items
            .filter((i) => i.name === item.name).length < (item.system.num_available ?? 1));
        const dialogOptions = {};
        dialogOptions.loadItems = {
            playbook: availableItems.filter((item) => item.type === "item" && item.system.playbooks.includes(playbook)).map((item) => item.name),
            general: availableItems.filter((item) => item.type === "item" && item.system.playbooks.includes("ANY")).map((item) => item.name)
        };
        dialogOptions.abilityItems = {
            playbook: availableItems.filter((item) => item.type === "ability" && item.system.playbooks.includes(playbook)).map((item) => item.name),
            veteran: availableItems.filter((item) => item.type === "ability"
                && !item.system.playbooks.includes(playbook)
                && !item.system.playbooks.includes("Ghost")
                && !item.system.playbooks.includes("Hull")
                && !item.system.playbooks.includes("Vampire")).map((item) => item.name)
        };
        eLog.display("Dialog Options", dialogOptions);
        Object.assign(data, {
            effects: this.actor.effects,
            items: {
                heritage: data.items.find((item) => item.type === "heritage"),
                background: data.items.find((item) => item.type === "background"),
                vice: (viceOverride && JSON.parse(viceOverride)) || data.items.find((item) => item.type === "vice"),
                abilities: data.items.filter((item) => item.type === "ability"),
                loadout: data.items.filter((item) => item.type === "item")
            },
            playbook: playbookItem
                ? {
                    id: playbookItem.id,
                    name: playbookItem.name ?? "",
                    bgImg: (playbookItem.name ?? "DEFAULTS") in C.Playbooks
                        ? C.Playbooks[playbookItem.name].bgImg
                        : "",
                    tagline: (playbookItem.name ?? "DEFAULTS") in C.Playbooks
                        ? C.Playbooks[playbookItem.name].tagline
                        : ""
                }
                : null,
            healing_clock: {
                color: "white",
                size: this.actor.system.healing.max,
                value: this.actor.system.healing.value
            },
            armor: Object.fromEntries(Object.entries(this.actor.system.armor.active)
                .filter(([, isActive]) => isActive)
                .map(([armor]) => [armor, this.actor.system.armor.checked[armor]])),
            loadData: {
                curLoad,
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
        eLog.log("[BladesActorSheet] return getData()", { ...data });
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
                eLog.log("Mouse Enter", targetArmor, this, $(this), $(this).next());
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
                await self.actor.deleteEmbeddedDocuments("Item", [element.data("itemId")]);
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