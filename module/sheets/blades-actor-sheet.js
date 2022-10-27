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
            width: 700,
            height: 970,
            tabs: [{ navSelector: ".tabs", contentSelector: ".tab-content", initial: "abilities" }]
        });
    }
        
    async getData() {
        const data = await super.getData();
        let loadout = 0;
        data.items.forEach(i => { loadout += (i.type === "item") ? parseInt(i.system.load) : 0; });
        loadout = U.gsap.utils.clamp(0, 10, loadout);
        const classItem = data.items.find((item) => item.type === "class");
        Object.assign(data, {
            effects: this.actor.effects,
            items: {
                "class": classItem,
                "heritage": data.items.find((item) => item.type === "heritage"),
                "background": data.items.find((item) => item.type === "background"),
                "vice": data.items.find((item) => item.type === "vice"),
                "classTagLine": classItem && classItem.name in C.ClassTagLines
                    ? C.ClassTagLines[classItem.name]
                    : ""
            },
            loadout,
            load_level: C.Encumbrance.loadLevel.default,
            load_levels: C.Encumbrance.loadLevel.options
        });
        return data;
    }
    activateListeners(html) {
        super.activateListeners(html);
        if (!this.options.editable) {
            return;
        }
        html.find(".item-body").on("click", (ev) => {
            const element = $(ev.currentTarget).parents(".item");
            const item = this.actor.items.get(element.data("itemId"));
            item?.sheet?.render(true);
        });
        html.find(".item-delete").on("click", async (ev) => {
            const element = $(ev.currentTarget).parents(".item");
            await this.actor.deleteEmbeddedDocuments("Item", [element.data("itemId")]);
            element.slideUp(200, () => this.render(false));
        });
        html.find(".effect-control").on("click", (ev) => BladesActiveEffect.onManageActiveEffect(ev, this.actor));
    }
}
export default BladesActorSheet;