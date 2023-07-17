/* ****▌███████████████████████████████████████████████████████████████████████████▐**** *\
|*     ▌████░░░░░░░░░░░ Euno's Blades in the Dark for Foundry VTT ░░░░░░░░░░░░░████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░ by Eunomiac ░░░░░░░░░░░░░██████████████████▐     *|
|*     ▌████████████████████████████  License █ v0.1.0 ████████████████████████████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░░░░░░  ░░░░░░░░░░░░░░░░░░███████████████████▐     *|
\* ****▌███████████████████████████████████████████████████████████████████████████▐**** */

import BladesSheet from "./blades-sheet.js";
class BladesFactionSheet extends BladesSheet {
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            classes: ["eunos-blades", "sheet", "actor", "faction"],
            template: "systems/eunos-blades/templates/faction-sheet.hbs",
            width: 900,
            height: "auto",
            tabs: [{ navSelector: ".nav-tabs", contentSelector: ".tab-content" }]
        });
    }
    getData() {
        const context = super.getData();
        const sheetData = {};
        if (context.actor.system.goal_1.max > 0) {
            sheetData.goal_1_clock = {
                value: context.actor.system.goal_1.value,
                size: context.actor.system.goal_1.max
            };
        }
        if (context.actor.system.goal_2.max > 0) {
            sheetData.goal_2_clock = {
                value: context.actor.system.goal_2.value,
                size: context.actor.system.goal_2.max
            };
        }
        return {
            ...context,
            ...sheetData
        };
    }
    activateListeners(html) {
        super.activateListeners(html);
        if (!this.options.editable) {
            return;
        }
        html.find(".item-body").on("click", (event) => {
            const element = $(event.currentTarget).parents(".item");
            const item = this.actor.items.get(element.data("itemId"));
            item?.sheet?.render(true);
        });
    }
}
export default BladesFactionSheet;