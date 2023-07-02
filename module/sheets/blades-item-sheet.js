/* ****▌███████████████████████████████████████████████████████████████████████████▐**** *\
|*     ▌████░░░░░░░░░░░ Euno's Blades in the Dark for Foundry VTT ░░░░░░░░░░░░░████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░ by Eunomiac ░░░░░░░░░░░░░██████████████████▐     *|
|*     ▌████████████████████████████  License █ v0.1.0 ████████████████████████████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░░░░░░  ░░░░░░░░░░░░░░░░░░███████████████████▐     *|
\* ****▌███████████████████████████████████████████████████████████████████████████▐**** */

import C, { Tag, District, Playbook, Vice } from "../core/constants.js";
import BladesActiveEffect from "../blades-active-effect.js";
import Tagify from "../../lib/tagify/tagify.esm.js";
class BladesItemSheet extends ItemSheet {
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            classes: ["eunos-blades", "sheet", "item"],
            width: 560,
            height: 500,
            tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description" }]
        });
    }
        
    constructor(item, options = {}) {
        options.classes = [...options.classes ?? [], "eunos-blades", "sheet", "item", item.type];
        super(item, options);
    }
    get template() {
        const pathComps = [
            "systems/eunos-blades/templates/items"
        ];
        if (C.SimpleItemTypes.includes(this.item.type)) {
            pathComps.push("simple-sheet.hbs");
        }
        else {
            pathComps.push(`${this.item.data.type}-sheet.hbs`);
        }
        return pathComps.join("/");
    }
        
    activateListeners(html) {
        super.activateListeners(html);
        const self = this;
        if (!this.options.editable) {
            return;
        }
        const tagElem = html.find(".tag-entry")[0];
        if (tagElem) {
            const tagify = new Tagify(tagElem, {
                enforceWhitelist: true,
                editTags: false,
                whitelist: [
                    ...Object.values(Tag),
                    ...Object.values(District),
                    ...Object.values(Vice),
                    ...Object.values(Playbook)
                ],
                dropdown: {
                    classname: "tagify-dropdown",
                    enabled: 0,
                    maxItems: 5,
                    appendTarget: html[0]
                }
            });
            tagElem.addEventListener("change", this._onTagifyChange.bind(this));
            tagify.addTags(this.item.tags.map((tag) => {
                if (Object.values(Tag).includes(tag)) {
                    return { "value": tag, "class": "orange" };
                }
                if (Object.values(District).includes(tag)) {
                    return { "value": tag, "class": "green" };
                }
                if (Object.values(Playbook).includes(tag)) {
                    return { "value": tag, "class": "blue" };
                }
                if (Object.values(Vice).includes(tag)) {
                    return { "value": tag, "class": "red" };
                }
                return { "value": tag, "class": "white" };
            }), false, false);
        }
        html.find(".effect-control").on("click", (ev) => {
            if (self.item.isOwned) {
                ui.notifications.warn(game.i18n.localize("BITD.EffectWarning"));
                return;
            }
            BladesActiveEffect.onManageActiveEffect(ev, self.item);
        });
        html.find("[data-action=\"toggle-turf-connection\"").on("click", this.toggleTurfConnection.bind(this));
    }
    async _onTagifyChange(event) {
        const tagString = event.target.value;
        if (tagString) {
            const tags = JSON.parse(tagString)
                .map(({ value }) => value);
            this.item.update({ "system.tags": tags });
        }
        else {
            this.item.update({ "system.tags": [] });
        }
    }
    toggleTurfConnection(event) {
        const button$ = $(event.currentTarget);
        const connector$ = button$.parent();
        const turfNum = parseInt(connector$.data("index") ?? 0);
        const turfDir = connector$.data("dir");
        if (!turfNum || !turfDir) {
            return;
        }
        const toggleState = connector$.hasClass("no-connect");
        const updateData = {
            [`system.turfs.${turfNum}.connects.${turfDir}`]: toggleState
        };
        const partner = connector$.data("partner");
        if (typeof partner === "string" && /-/.test(partner)) {
            const [partnerNum, partnerDir] = partner.split("-");
            updateData[`system.turfs.${partnerNum}.connects.${partnerDir}`] = toggleState;
        }
        this.item.update(updateData);
    }
    async getData() {
        const data = await super.getData();
        const itemData = data.data;
        Object.assign(data, {
            editable: this.options.editable,
            isGM: game.user.isGM,
            isEmbeddedItem: true,
            actor: itemData,
            data: itemData.data,
            effects: this.item.effects
        });
        return data;
    }
}
export default BladesItemSheet;