/* ****▌███████████████████████████████████████████████████████████████████████████▐**** *\
|*     ▌████░░░░░░░░░░░ Euno's Blades in the Dark for Foundry VTT ░░░░░░░░░░░░░████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░ by Eunomiac ░░░░░░░░░░░░░██████████████████▐     *|
|*     ▌████████████████████████████  License █ v0.1.0 ████████████████████████████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░░░░░░  ░░░░░░░░░░░░░░░░░░███████████████████▐     *|
\* ****▌███████████████████████████████████████████████████████████████████████████▐**** */

import C, { Tag, District, Playbook, Vice } from "../core/constants.js";
import U from "../core/utilities.js";
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
                    ...Object.values(Tag.System).map((tag) => ({
                        "value": tag,
                        "data-group": "System Tags"
                    })),
                    ...Object.values(Tag.Item).map((tag) => ({
                        "value": tag,
                        "data-group": "Item Tags"
                    })),
                    ...Object.values(Tag.PC).map((tag) => ({
                        "value": tag,
                        "data-group": "Actor Tags"
                    })),
                    ...Object.values(Tag.NPC).map((tag) => ({
                        "value": tag,
                        "data-group": "Actor Tags"
                    })),
                    ...Object.values(District).map((tag) => ({
                        "value": tag,
                        "data-group": "Districts"
                    })),
                    ...Object.values(Vice).map((tag) => ({
                        "value": tag,
                        "data-group": "Vices"
                    })),
                    ...Object.values(Playbook).map((tag) => ({
                        "value": tag,
                        "data-group": "Playbooks"
                    }))
                ],
                dropdown: {
                    enabled: 0,
                    maxItems: 10000,
                    placeAbove: false,
                    appendTarget: html[0]
                }
            });
            tagify.dropdown.createListHTML = (optionsArr) => {
                const map = {};
                return structuredClone(optionsArr)
                    .map((suggestion, idx) => {
                    const value = tagify.dropdown.getMappedValue.call(tagify, suggestion);
                    let tagHTMLString = "";
                    if (!map[suggestion["data-group"]]) {
                        map[suggestion["data-group"]] = true;
                        if (Object.keys(map).length) {
                            tagHTMLString += "</div>";
                        }
                        tagHTMLString += `
								<div class="tagify__dropdown__itemsGroup">
								<h3>${suggestion["data-group"]}</h3>
							`;
                    }
                    suggestion.value
                        = value && typeof value === "string" ? U.escapeHTML(value.replace(/_/g, " ")) : value;
                    tagHTMLString += tagify.settings.templates.dropdownItem.apply(tagify, [suggestion, idx]);
                    return tagHTMLString;
                })
                    .join("");
            };
            tagify.addTags(this.item.tags.map((tag) => {
                if (Object.values(Tag.System).includes(tag)) {
                    return { "value": tag, "data-group": "System Tags" };
                }
                if (Object.values(Tag.Item).includes(tag)) {
                    return { "value": tag, "data-group": "Item Tags" };
                }
                if (Object.values(Tag.PC).includes(tag) || Object.values(Tag.NPC).includes(tag)) {
                    return { "value": tag, "data-group": "Actor Tags" };
                }
                if (Object.values(District).includes(tag)) {
                    return { "value": tag, "data-group": "Districts" };
                }
                if (Object.values(Playbook).includes(tag)) {
                    return { "value": tag, "data-group": "Playbooks" };
                }
                if (Object.values(Vice).includes(tag)) {
                    return { "value": tag, "data-group": "Vices" };
                }
                return { "value": tag, "data-group": "Other" };
            }), false, false);
            tagElem.addEventListener("change", this._onTagifyChange.bind(this));
        }
        if (this.options.submitOnChange) {
            html.on("change", "textarea", this._onChangeInput.bind(this));
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