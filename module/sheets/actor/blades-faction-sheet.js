/* ****▌███████████████████████████████████████████████████████████████████████████▐**** *\
|*     ▌████░░░░░░░░░░░ Euno's Blades in the Dark for Foundry VTT ░░░░░░░░░░░░░████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░ by Eunomiac ░░░░░░░░░░░░░██████████████████▐     *|
|*     ▌████████████████████████████  License █ v0.1.0 ████████████████████████████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░░░░░░  ░░░░░░░░░░░░░░░░░░███████████████████▐     *|
\* ****▌███████████████████████████████████████████████████████████████████████████▐**** */

import BladesActor from "../../blades-actor.js";
import BladesSheet from "./blades-sheet.js";
import { BladesActorType } from "../../core/constants.js";
class BladesFactionSheet extends BladesSheet {
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            classes: ["eunos-blades", "sheet", "actor", "faction"],
            template: "systems/eunos-blades/templates/faction-sheet.hbs",
            width: 900,
            height: "auto",
            tabs: [{ navSelector: ".nav-tabs", contentSelector: ".tab-content", initial: "overview" }]
        });
    }
    getData() {
        const context = super.getData();
        if (!BladesActor.IsType(this.actor, BladesActorType.faction)) {
            return context;
        }
        const sheetData = {
            clocks: Object.fromEntries(Object.entries(this.actor.system.clocks).map(([clockNum, clockData], i) => [
                clockNum,
                {
                    display: clockData?.display ?? "",
                    value: clockData?.value ?? 0,
                    max: clockData?.max ?? 0,
                    isVisible: true,
                    isNameVisible: false,
                    isActive: false,
                    color: "white",
                    target: `system.clocks.${i + 1}.value`,
                    gm_notes: clockData?.gm_notes ?? ""
                }
            ])),
            tierData: {
                "class": "comp-tier comp-vertical comp-teeth",
                "label": "Tier",
                "labelClass": "filled-label full-width",
                "dotline": {
                    data: this.actor.system.tier,
                    target: "system.tier.value",
                    svgKey: "teeth.tall",
                    svgFull: "full|half|frame",
                    svgEmpty: "full|half|frame"
                }
            }
        };
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