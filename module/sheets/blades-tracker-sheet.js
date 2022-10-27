/* ****▌███████████████████████████████████████████████████████████████████████████▐**** *\
|*     ▌████░░░░░░░░░░░ Euno's Blades in the Dark for Foundry VTT ░░░░░░░░░░░░░████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░ by Eunomiac ░░░░░░░░░░░░░██████████████████▐     *|
|*     ▌████████████████████████████  License █ v0.1.0 ████████████████████████████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░░░░░░  ░░░░░░░░░░░░░░░░░░███████████████████▐     *|
\* ****▌███████████████████████████████████████████████████████████████████████████▐**** */

export default class EunoTrackerSheet extends ItemSheet {
        static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            classes: ["eunos-blades", "sheet", "item", "tracker"],
            template: "systems/eunos-blades/templates/tracker-sheet.hbs",
            width: 900,
            height: "auto",
            tabs: [{ navSelector: ".tabs", contentSelector: ".tab-content" }],
            viewPermissions: 0
        });
    }
    static async Initialize() {
        Items.registerSheet("blades", EunoTrackerSheet, { types: ["gm_tracker"], makeDefault: true });
        return loadTemplates(["systems/eunos-blades/templates/tracker-sheet.hbs"]);
    }
        
        async getData() {
        const data = await super.getData();
        data.editable = this.options.editable;
        const actorData = data.data;
        data.actor = actorData;
        data.data = actorData.data;
        return data;
    }
        
        activateListeners(html) {
        super.activateListeners(html);
        if (!this.options.editable) {
            return;
        }
    }
}