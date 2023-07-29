/* ****▌███████████████████████████████████████████████████████████████████████████▐**** *\
|*     ▌████░░░░░░░░░░░ Euno's Blades in the Dark for Foundry VTT ░░░░░░░░░░░░░████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░ by Eunomiac ░░░░░░░░░░░░░██████████████████▐     *|
|*     ▌████████████████████████████  License █ v0.1.0 ████████████████████████████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░░░░░░  ░░░░░░░░░░░░░░░░░░███████████████████▐     *|
\* ****▌███████████████████████████████████████████████████████████████████████████▐**** */

import BladesSheet from "./blades-sheet.js";
import U from "../../core/utilities.js";
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
        context.persona = context.actor.system.persona;
        const rStatus = {
            name: { size: 4, label: null },
            heritage: { size: 1, label: "Heritage" },
            profession: { size: 1, label: "Profession" },
            gender: { size: 1, label: "Gender" },
            appearance: { size: 1, label: "Appearance" },
            goal: { size: 2, label: "Goal" },
            method: { size: 2, label: "Method" },
            trait1: { size: "05", label: null },
            trait2: { size: "05", label: null },
            trait3: { size: "05", label: null },
            interests: { size: 4, label: "Interests" },
            quirk: { size: 4, label: "Quirk" },
            style: { size: 2, label: "Style" }
        };
        for (const [key] of Object.entries(context.persona)) {
            if (key in rStatus) {
                Object.assign(context.persona[key], rStatus[key]);
            }
        }
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

        html.find(".comp-status-toggle")
            .on("click", () => {
            const { tags } = this.actor;
            if (this.actor.system.status === 1) {
                U.remove(tags, "Friend");
                tags.push("Rival");
                this.actor.update({
                    "system.status": -1,
                    "system.tags": U.unique(tags)
                });
            }
            else {
                U.remove(tags, "Rival");
                tags.push("Friend");
                this.actor.update({
                    "system.status": 1,
                    "system.tags": U.unique(tags)
                });
            }
        })
            .on("contextmenu", () => {
            this.actor.update({ "system.status": 0 });
        });
    }
}
export default BladesNPCSheet;