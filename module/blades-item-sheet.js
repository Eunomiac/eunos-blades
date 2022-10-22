import BladesActiveEffect from "./euno-active-effect.js";

export class BladesItemSheet extends ItemSheet {
    
        static get defaultOptions() {
        
        return foundry.utils.mergeObject(super.defaultOptions, {
            classes: ["eunos-blades", "sheet", "item"],
            width: 560,
            height: "auto",
            tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description" }]
        });
    }
    
        
    constructor(item, options = {}) {
        options.classes = [...options.classes ?? [], "eunos-blades", "sheet", "item", item.type];
        super(item, options);
    }
    
        get template() {
        if (this.item.data.type === "clock_keeper") {
            return "systems/eunos-blades/templates/clock-keeper-sheet.hbs";
        }
        const path = "systems/eunos-blades/templates/items";
        const simple_item_types = ["background", "heritage", "vice", "crew_reputation"];
        let template_name = `${this.item.data.type}`;
        
        if (simple_item_types.indexOf(this.item.data.type) >= 0) {
            template_name = "simple";
        }
        
        return `${path}/${template_name}.hbs`;
    }
    
        
        activateListeners(html) {
        super.activateListeners(html);
        
        if (!this.options.editable) {
            return;
        }
        
        html.find(".effect-control").click(ev => {
            if (this.item.isOwned) {
                ui.notifications.warn(game.i18n.localize("BITD.EffectWarning"));
                return;
            }
            BladesActiveEffect.onManageActiveEffect(ev, this.item);
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
    
        
        getData() {
        const data = super.getData();
        data.isGM = game.user.isGM;
        data.editable = this.options.editable;
        const itemData = data.data;
        data.actor = itemData;
        data.data = itemData.data;
        
        data.effects = BladesActiveEffect.prepareActiveEffectCategories(this.item.effects);
        return data;
    }
}