/* ****▌███████████████████████████████████████████████████████████████████████████▐**** *\
|*     ▌████░░░░░░░░░░░ Euno's Blades in the Dark for Foundry VTT ░░░░░░░░░░░░░████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░ by Eunomiac ░░░░░░░░░░░░░██████████████████▐     *|
|*     ▌████████████████████████████  License █ v0.1.0 ████████████████████████████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░░░░░░  ░░░░░░░░░░░░░░░░░░███████████████████▐     *|
\* ****▌███████████████████████████████████████████████████████████████████████████▐**** */

import C, { BladesItemType, BladesPhase } from "../../core/constants.js";
import BladesItem from "../../blades-item.js";
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
        
    
    getData() {
        const context = super.getData();
        context.editable = this.options.editable;
        context.isGM = game.user.isGM;
        context.isEmbeddedItem = this.item.parent !== null;
        context.item = this.item;
        context.system = this.item.system;
        context.activeEffects = Array.from(this.item.effects);
        return this._getTypedItemData[this.item.type](context);
    }
    _getTypedItemData = {
        [BladesItemType.ability]: (context) => {
            if (!BladesItem.IsType(this.item, BladesItemType.ability)) {
                return undefined;
            }
            const sheetData = {};
            return {
                ...context,
                ...sheetData
            };
        },
        [BladesItemType.background]: (context) => {
            if (!BladesItem.IsType(this.item, BladesItemType.background)) {
                return undefined;
            }
            const sheetData = {};
            return {
                ...context,
                ...sheetData
            };
        },
        [BladesItemType.clock_keeper]: (context) => {
            if (!BladesItem.IsType(this.item, BladesItemType.clock_keeper)) {
                return undefined;
            }
            const sheetData = {
                phases: Object.values(BladesPhase)
            };
            return {
                ...context,
                ...sheetData
            };
        },
        [BladesItemType.cohort_gang]: (context) => {
            if (!BladesItem.IsType(this.item, BladesItemType.cohort_gang)) {
                return undefined;
            }
            const sheetData = {};
            return {
                ...context,
                ...sheetData
            };
        },
        [BladesItemType.cohort_expert]: (context) => {
            if (!BladesItem.IsType(this.item, BladesItemType.cohort_expert)) {
                return undefined;
            }
            const sheetData = {};
            return {
                ...context,
                ...sheetData
            };
        },
        [BladesItemType.crew_ability]: (context) => {
            if (!BladesItem.IsType(this.item, BladesItemType.crew_ability)) {
                return undefined;
            }
            const sheetData = {};
            return {
                ...context,
                ...sheetData
            };
        },
        [BladesItemType.crew_reputation]: (context) => {
            if (!BladesItem.IsType(this.item, BladesItemType.crew_reputation)) {
                return undefined;
            }
            const sheetData = {};
            return {
                ...context,
                ...sheetData
            };
        },
        [BladesItemType.crew_playbook]: (context) => {
            if (!BladesItem.IsType(this.item, BladesItemType.crew_playbook)) {
                return undefined;
            }
            const sheetData = {};
            return {
                ...context,
                ...sheetData
            };
        },
        [BladesItemType.crew_upgrade]: (context) => {
            if (!BladesItem.IsType(this.item, BladesItemType.crew_upgrade)) {
                return undefined;
            }
            const sheetData = {};
            return {
                ...context,
                ...sheetData
            };
        },
        [BladesItemType.feature]: (context) => {
            if (!BladesItem.IsType(this.item, BladesItemType.feature)) {
                return undefined;
            }
            const sheetData = {};
            return {
                ...context,
                ...sheetData
            };
        },
        [BladesItemType.gm_tracker]: (context) => {
            if (!BladesItem.IsType(this.item, BladesItemType.gm_tracker)) {
                return undefined;
            }
            const sheetData = {};
            return {
                ...context,
                ...sheetData
            };
        },
        [BladesItemType.heritage]: (context) => {
            if (!BladesItem.IsType(this.item, BladesItemType.heritage)) {
                return undefined;
            }
            const sheetData = {};
            return {
                ...context,
                ...sheetData
            };
        },
        [BladesItemType.item]: (context) => {
            if (!BladesItem.IsType(this.item, BladesItemType.item)) {
                return undefined;
            }
            const sheetData = {
                tierData: {
                    "class": "comp-tier comp-vertical comp-teeth",
                    "label": "Tier",
                    "labelClass": "filled-label full-width",
                    "dotline": {
                        data: this.item.system.tier,
                        target: "system.tier.value",
                        svgKey: "teeth.tall",
                        svgFull: "full|half|frame",
                        svgEmpty: "full|half|frame"
                    }
                }
            };
            return {
                ...context,
                ...sheetData
            };
        },
        [BladesItemType.playbook]: (context) => {
            if (!BladesItem.IsType(this.item, BladesItemType.playbook)) {
                return undefined;
            }
            const sheetData = {};
            return {
                ...context,
                ...sheetData
            };
        },
        [BladesItemType.preferred_op]: (context) => {
            if (!BladesItem.IsType(this.item, BladesItemType.preferred_op)) {
                return undefined;
            }
            const sheetData = {};
            return {
                ...context,
                ...sheetData
            };
        },
        [BladesItemType.stricture]: (context) => {
            if (!BladesItem.IsType(this.item, BladesItemType.stricture)) {
                return undefined;
            }
            const sheetData = {};
            return {
                ...context,
                ...sheetData
            };
        },
        [BladesItemType.vice]: (context) => {
            if (!BladesItem.IsType(this.item, BladesItemType.vice)) {
                return undefined;
            }
            const sheetData = {};
            return {
                ...context,
                ...sheetData
            };
        },
        [BladesItemType.project]: (context) => {
            if (!BladesItem.IsType(this.item, BladesItemType.project)) {
                return undefined;
            }
            const sheetData = {};
            return {
                ...context,
                ...sheetData
            };
        },
        [BladesItemType.ritual]: (context) => {
            if (!BladesItem.IsType(this.item, BladesItemType.ritual)) {
                return undefined;
            }
            const sheetData = {};
            return {
                ...context,
                ...sheetData
            };
        },
        [BladesItemType.design]: (context) => {
            if (!BladesItem.IsType(this.item, BladesItemType.design)) {
                return undefined;
            }
            const sheetData = {};
            return {
                ...context,
                ...sheetData
            };
        },
        [BladesItemType.location]: (context) => {
            if (!BladesItem.IsType(this.item, BladesItemType.location)) {
                return undefined;
            }
            const sheetData = {};
            return {
                ...context,
                ...sheetData
            };
        },
        [BladesItemType.score]: (context) => {
            if (!BladesItem.IsType(this.item, BladesItemType.score)) {
                return undefined;
            }
            const sheetData = {};
            return {
                ...context,
                ...sheetData
            };
        }
    };
    
    
    
    
    
    
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
}
export default BladesItemSheet;