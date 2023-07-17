/* ****▌███████████████████████████████████████████████████████████████████████████▐**** *\
|*     ▌████░░░░░░░░░░░ Euno's Blades in the Dark for Foundry VTT ░░░░░░░░░░░░░████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░ by Eunomiac ░░░░░░░░░░░░░██████████████████▐     *|
|*     ▌████████████████████████████  License █ v0.1.0 ████████████████████████████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░░░░░░  ░░░░░░░░░░░░░░░░░░███████████████████▐     *|
\* ****▌███████████████████████████████████████████████████████████████████████████▐**** */

import BladesSheet from "./blades-sheet.js";
class BladesNPCSheet extends BladesSheet {
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            classes: ["eunos-blades", "sheet", "actor", "npc"],
            template: "systems/eunos-blades/templates/npc-sheet.hbs",
            width: 500,
            height: 400,
            tabs: [{ navSelector: ".nav-tabs", contentSelector: ".tab-content", initial: "description" }]
        });
    }
    getData() {
        const context = super.getData();
        context.isSubActor = context.actor.isSubActor;
        context.parentActor = context.actor.parentActor;
        context.randomizers = context.actor.system.randomizers;
        return context;
    }
    activateListeners(html) {
        super.activateListeners(html);
        if (!this.options.editable) {
            return;
        }
        html.find(".gm-alert-header").on("click", async (event) => {
            event.preventDefault();
            this.actor.clearParentActor();
        });
        
        html.find("[data-action=\"randomize\"").on("click", (event) => {
            this.actor.updateRandomizers();
        });
    }
}
export default BladesNPCSheet;