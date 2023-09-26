/* ****▌███████████████████████████████████████████████████████████████████████████▐**** *\
|*     ▌████░░░░░░░░░░░ Euno's Blades in the Dark for Foundry VTT ░░░░░░░░░░░░░████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░ by Eunomiac ░░░░░░░░░░░░░██████████████████▐     *|
|*     ▌████████████████████████████  License █ v0.1.0 ████████████████████████████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░░░░░░  ░░░░░░░░░░░░░░░░░░███████████████████▐     *|
\* ****▌███████████████████████████████████████████████████████████████████████████▐**** */

import BladesActorSheet from "./BladesActorSheet.js";
import U from "../../core/utilities.js";
class BladesNPCSheet extends BladesActorSheet {
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
        context.random = context.actor.system.random;
        context.secret = context.actor.system.secret;
        const rStatus = {
            name: { size: 3, label: "Name" },
            gender: { size: "half", label: "Gender" },
            heritage: { size: "third", label: "Heritage" },
            background: { size: "third", label: "Background" },
            profession: { size: "third", label: "Profession" },
            appearance: { size: 2, label: "Appearance" },
            style: { size: 2, label: "Style" },
            quirk: { size: 4, label: "Quirk" },
            goal: { size: 2, label: "Goal" },
            method: { size: 2, label: "Method" },
            interests: { size: 4, label: "Interests" },
            trait: { size: "half", label: "Trait" },
            trait1: { size: "half", label: null },
            trait2: { size: "half", label: null },
            trait3: { size: "half", label: null }
        };
        for (const cat of ["persona", "random", "secret"]) {
            for (const [key] of Object.entries(context[cat])) {
                if (key in rStatus) {
                    Object.assign(context[cat][key], rStatus[key]);
                }
            }
        }
        console.log({ persona: context.persona, random: context.random, secret: context.secret });
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
//# sourceMappingURL=BladesNPCSheet.js.map
//# sourceMappingURL=BladesNPCSheet.js.map
