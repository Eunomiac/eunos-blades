/* ****▌███████████████████████████████████████████████████████████████████████████▐**** *\
|*     ▌████░░░░░░░░░░░ Euno's Blades in the Dark for Foundry VTT ░░░░░░░░░░░░░████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░ by Eunomiac ░░░░░░░░░░░░░██████████████████▐     *|
|*     ▌████████████████████████████  License █ v0.1.0 ████████████████████████████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░░░░░░  ░░░░░░░░░░░░░░░░░░███████████████████▐     *|
\* ****▌███████████████████████████████████████████████████████████████████████████▐**** */

import BladesSheet from "./blades-sheet.js";
import Tagify from "../../lib/tagify/tagify.esm.js";
class BladesNPCSheet extends BladesSheet {
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            classes: ["eunos-blades", "sheet", "actor", "npc"],
            template: "systems/eunos-blades/templates/npc-sheet.hbs",
            width: 500,
            tabs: [{ navSelector: ".nav-tabs", contentSelector: ".tab-content", initial: "description" }]
        });
    }
    async getData() {
        const data = await super.getData();
        Object.assign(data, {
            randomizers: this.actor.system.randomizers
        });
        return data;
    }
    activateListeners(html) {
        super.activateListeners(html);
        if (!this.options.editable) {
            return;
        }

        const inputElement = document.querySelector('input[name="data.harm.heavy.one"]');
        if (inputElement instanceof HTMLInputElement) {
            new Tagify(inputElement, {});
        }
        else {
            console.log("Not an HTMLInputElement");
        }

        html.find("[data-action=\"randomize\"").on("click", (event) => {
            this.actor.updateRandomizers();
        });
    }
}
export default BladesNPCSheet;