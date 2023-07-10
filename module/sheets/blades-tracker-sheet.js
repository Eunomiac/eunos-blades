/* ****▌███████████████████████████████████████████████████████████████████████████▐**** *\
|*     ▌████░░░░░░░░░░░ Euno's Blades in the Dark for Foundry VTT ░░░░░░░░░░░░░████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░ by Eunomiac ░░░░░░░░░░░░░██████████████████▐     *|
|*     ▌████████████████████████████  License █ v0.1.0 ████████████████████████████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░░░░░░  ░░░░░░░░░░░░░░░░░░███████████████████▐     *|
\* ****▌███████████████████████████████████████████████████████████████████████████▐**** */

import BladesItemSheet from "./blades-item-sheet.js";
import BladesItem from "../blades-item.js";
export var BladesPhase;
(function (BladesPhase) {
    BladesPhase["CharGen"] = "CharGen";
    BladesPhase["Planning"] = "Planning";
    BladesPhase["Score"] = "Score";
    BladesPhase["Downtime"] = "Downtime";
})(BladesPhase || (BladesPhase = {}));
class BladesTrackerSheet extends BladesItemSheet {
    static async Get() {
        return game.eunoblades.Tracker || (await BladesItem.create({
            name: "GM Tracker",
            type: "gm_tracker",
            img: "systems/eunos-blades/assets/icons/gm-tracker.svg"
        }));
    }
    static async GetPhase() {
        return (await BladesTrackerSheet.Get()).system.game_phase;
    }
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            classes: ["eunos-blades", "sheet", "item", "gm-tracker"],
            template: "systems/eunos-blades/templates/items/gm_tracker-sheet.hbs",
            width: 700,
            height: 970
        });
    }
    static async Initialize() {
        game.eunoblades ??= {};
        Items.registerSheet("blades", BladesTrackerSheet, { types: ["gm_tracker"], makeDefault: true });
        Hooks.once("ready", async () => {
            let tracker = game.items.find((item) => item.type === "gm_tracker");
            if (!(tracker instanceof BladesItem)) {
                tracker = (await BladesItem.create({
                    name: "GM Tracker",
                    type: "gm_tracker",
                    img: "systems/eunos-blades/assets/icons/gm-tracker.svg"
                }));
            }
            game.eunoblades.Tracker = tracker;
        });
        return loadTemplates([
            "systems/eunos-blades/templates/items/gm_tracker-sheet.hbs"
        ]);
    }
    async _updateObject(event, formData) {
        const updateData = await this.object.update(formData);
        return updateData;
    }
    async getData() {
        const context = await super.getData();
        return context;
    }
    async activateListeners(html) {
        super.activateListeners(html);
    }
}
export default BladesTrackerSheet;