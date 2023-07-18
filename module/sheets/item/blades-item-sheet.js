/* ****▌███████████████████████████████████████████████████████████████████████████▐**** *\
|*     ▌████░░░░░░░░░░░ Euno's Blades in the Dark for Foundry VTT ░░░░░░░░░░░░░████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░ by Eunomiac ░░░░░░░░░░░░░██████████████████▐     *|
|*     ▌████████████████████████████  License █ v0.1.0 ████████████████████████████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░░░░░░  ░░░░░░░░░░░░░░░░░░███████████████████▐     *|
\* ****▌███████████████████████████████████████████████████████████████████████████▐**** */

import C from "../../core/constants.js";
import BladesActiveEffect from "../../blades-active-effect.js";
import Tags from "../../core/tags.js";
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
            pathComps.push(`${this.item.type}-sheet.hbs`);
        }
        return pathComps.join("/");
    }
        
    activateListeners(html) {
        super.activateListeners(html);
        const self = this;
        Tags.InitListeners(html, this.item);
        if (!this.options.editable) {
            return;
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
        const context = (await super.getData());
        context.editable = this.options.editable;
        context.isGM = game.user.isGM;
        context.isEmbeddedItem = this.item.parent !== null;
        context.item = this.item;
        context.system = this.item.system;
        context.activeEffects = this.item.effects;
        return context;
    }
}
export default BladesItemSheet;