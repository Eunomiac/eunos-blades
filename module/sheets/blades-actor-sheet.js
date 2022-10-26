/* ****▌███████████████████████████████████████████████████████████████████████████▐**** *\
|*     ▌████░░░░░░░░░░░ Euno's Blades in the Dark for Foundry VTT ░░░░░░░░░░░░░████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░ by Eunomiac ░░░░░░░░░░░░░██████████████████▐     *|
|*     ▌████████████████████████████  License █ v0.1.0 ████████████████████████████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░░░░░░  ░░░░░░░░░░░░░░░░░░███████████████████▐     *|
\* ****▌███████████████████████████████████████████████████████████████████████████▐**** */

import { BladesSheet } from "./blades-sheet.js";
import BladesActiveEffect from "../euno-active-effect.js";
export class BladesActorSheet extends BladesSheet {
        static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            classes: ["eunos-blades", "sheet", "actor", "pc"],
            template: "systems/eunos-blades/templates/actor-sheet.hbs",
            width: 700,
            height: 970,
            tabs: [{ navSelector: ".tabs", contentSelector: ".tab-content", initial: "abilities" }]
        });
    }
        
        getData() {
        var data = super.getData();
        data.editable = this.options.editable;
        data.isGM = game.user.isGM;
        const actorData = data.data;
        data.actor = actorData;
        data.data = actorData.data;
        data.faction = data.faction || data.associated_faction || "";
        data.effects = BladesActiveEffect.prepareActiveEffectCategories(this.actor.effects);
        let loadout = 0;
        data.items.forEach(i => { loadout += (i.type === "item") ? parseInt(i.data.load) : 0; });
        data.data.loadout = loadout;
        const load_level = ["BITD.Light",
            "BITD.Light",
            "BITD.Light",
            "BITD.Light",
            "BITD.Normal",
            "BITD.Normal",
            "BITD.Heavy",
            "BITD.Encumbered",
            "BITD.Encumbered",
            "BITD.Encumbered",
            "BITD.OverMax"];
        const mule_level = ["BITD.Light",
            "BITD.Light",
            "BITD.Light",
            "BITD.Light",
            "BITD.Light",
            "BITD.Light",
            "BITD.Normal",
            "BITD.Normal",
            "BITD.Heavy",
            "BITD.Encumbered",
            "BITD.OverMax"];
        let mule_present = 0;
        if (loadout < 0) {
            loadout = 0;
        }
        if (loadout > 10) {
            loadout = 10;
        }

        data.items.forEach(i => {
            if (i.type === "ability" && i.name === "(C) Mule") {
                mule_present = 1;
            }
        });
        if (mule_present) {
            data.data.load_level = mule_level[loadout];
        }
        else {
            data.data.load_level = load_level[loadout];
        }
        data.load_levels = { "BITD.Light": "BITD.Light", "BITD.Normal": "BITD.Normal", "BITD.Heavy": "BITD.Heavy" };
        return data;
    }
        
        activateListeners(html) {
        super.activateListeners(html);
        if (!this.options.editable) {
            return;
        }
        html.find(".item-body").click(ev => {
            const element = $(ev.currentTarget).parents(".item");
            const item = this.actor.items.get(element.data("itemId"));
            item.sheet.render(true);
        });
        html.find(".item-delete").click(async (ev) => {
            const element = $(ev.currentTarget).parents(".item");
            await this.actor.deleteEmbeddedDocuments("Item", [element.data("itemId")]);
            element.slideUp(200, () => this.render(false));
        });
        html.find(".effect-control").click(ev => BladesActiveEffect.onManageActiveEffect(ev, this.actor));
    }
}