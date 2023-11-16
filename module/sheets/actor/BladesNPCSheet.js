/*~ @@DOUBLE-BLANK@@ ~*/
import BladesActorSheet from "./BladesActorSheet.js";
import U from "../../core/utilities.js";
class BladesNPCSheet extends BladesActorSheet {
    /*~ @@DOUBLE-BLANK@@ ~*/
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            classes: ["eunos-blades", "sheet", "actor", "npc"],
            template: "systems/eunos-blades/templates/npc-sheet.hbs",
            width: 500,
            height: 400,
            // height: "auto",
            tabs: [{ navSelector: ".nav-tabs", contentSelector: ".tab-content", initial: "description" }]
        });
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    getData() {
        const context = super.getData();
        /*~ @@DOUBLE-BLANK@@ ~*/
        context.isSubActor = context.actor.isSubActor;
        context.parentActor = context.actor.parentActor;
        context.persona = context.actor.system.persona;
        context.random = context.actor.system.random;
        context.secret = context.actor.system.secret;
        /*~ @@DOUBLE-BLANK@@ ~*/
        const rStatus = {
            name: { size: 3, label: "Name" },
            gender: { size: "half", label: "Gender" },
            /*~ @@DOUBLE-BLANK@@ ~*/
            heritage: { size: "third", label: "Heritage" },
            background: { size: "third", label: "Background" },
            profession: { size: "third", label: "Profession" },
            /*~ @@DOUBLE-BLANK@@ ~*/
            appearance: { size: 2, label: "Appearance" },
            style: { size: 2, label: "Style" },
            quirk: { size: 4, label: "Quirk" },
            /*~ @@DOUBLE-BLANK@@ ~*/
            goal: { size: 2, label: "Goal" },
            method: { size: 2, label: "Method" },
            /*~ @@DOUBLE-BLANK@@ ~*/
            interests: { size: 4, label: "Interests" },
            /*~ @@DOUBLE-BLANK@@ ~*/
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
        /*~ @@DOUBLE-BLANK@@ ~*/
        console.log({ persona: context.persona, random: context.random, secret: context.secret });
        /*~ @@DOUBLE-BLANK@@ ~*/
        return context;
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    activateListeners(html) {
        super.activateListeners(html);
        /*~ @@DOUBLE-BLANK@@ ~*/
        // Everything below here is only needed if the sheet is editable
        if (!this.options.editable) {
            return;
        }
        /*~ @@DOUBLE-BLANK@@ ~*/
        html.find(".gm-alert-header").on("click", async (event) => {
            event.preventDefault();
            /*~ @@DOUBLE-BLANK@@ ~*/
            this.actor.clearParentActor();
        });
        /*~ @@DOUBLE-BLANK@@ ~*/
        //~ Configure Tagify input elements
        // const inputElement = document.querySelector('input[name="system.harm.heavy.one"]');
        // if (inputElement instanceof HTMLInputElement) { new Tagify(inputElement, {}) } else { console.log("Not an HTMLInputElement")}
        /*~ @@DOUBLE-BLANK@@ ~*/
        //~ Enable Randomize Button for NPCs
        html.find("[data-action=\"randomize\"").on("click", (event) => {
            this.actor.updateRandomizers();
        });
        /*~ @@DOUBLE-BLANK@@ ~*/
        //~ Enable status toggles for NPC subactors
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
        /*~ @@DOUBLE-BLANK@@ ~*/
    }
}
/*~ @@DOUBLE-BLANK@@ ~*/
export default BladesNPCSheet;
