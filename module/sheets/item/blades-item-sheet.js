/* ****▌███████████████████████████████████████████████████████████████████████████▐**** *\
|*     ▌████░░░░░░░░░░░ Euno's Blades in the Dark for Foundry VTT ░░░░░░░░░░░░░████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░ by Eunomiac ░░░░░░░░░░░░░██████████████████▐     *|
|*     ▌████████████████████████████  License █ v0.1.0 ████████████████████████████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░░░░░░  ░░░░░░░░░░░░░░░░░░███████████████████▐     *|
\* ****▌███████████████████████████████████████████████████████████████████████████▐**** */

import C, { BladesActorType, BladesItemType, BladesPhase, Tag } from "../../core/constants.js";
import U from "../../core/utilities.js";
import G from "../../core/gsap.js";
import BladesActor from "../../blades-actor.js";
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
        const sheetData = {
            cssClass: this.item.type,
            editable: this.options.editable,
            isGM: (game.eunoblades.Tracker.system.is_spoofing_player ? false : Boolean(game.user.isGM)),
            isEmbeddedItem: Boolean(this.item.parent),
            item: this.item,
            system: this.item.system,
            tierTotal: this.item.getTierTotal() > 0 ? U.romanizeNum(this.item.getTierTotal()) : undefined,
            activeEffects: Array.from(this.item.effects)
        };
        return this._getTypedItemData[this.item.type]({ ...context, ...sheetData });
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
            if (!BladesItem.IsType(this.item, BladesItemType.cohort_gang, BladesItemType.cohort_expert)) {
                return undefined;
            }
            context.tierTotal = this.item.system.quality > 0 ? U.romanizeNum(this.item.system.quality) : undefined;
            const sheetData = {
                tierData: {
                    "class": "comp-tier comp-vertical comp-teeth",
                    "dotline": {
                        data: this.item.system.tier,
                        target: "system.tier.value",
                        iconEmpty: "dot-empty.svg",
                        iconEmptyHover: "dot-empty-hover.svg",
                        iconFull: "dot-full.svg",
                        iconFullHover: "dot-full-hover.svg"
                    }
                }
            };
            const scale = Math.min(7, this.item.system.scale);
            if (BladesItem.IsType(this.item, BladesItemType.cohort_gang)) {
                sheetData.scaleData = { example: C.ScaleExamples[scale - 1] };
            }
            const gangTypes = this.item.tags.filter((tag) => Object.values(Tag.GangType).includes(tag));
            if (gangTypes.length === 0 || !BladesActor.IsType(this.item.parent, BladesActorType.crew)) {
                sheetData.subtitle = BladesItem.IsType(this.item, BladesItemType.cohort_gang) ? `A ${C.ScaleSizes[scale - 1]}Gang` : "An Expert";
            }
            else {
                if (BladesItem.IsType(this.item, BladesItemType.cohort_gang)) {
                    if (this.item.parent && BladesActor.IsType(this.item.parent, BladesActorType.crew)) {
                        const eliteUpgrades = this.item.parent.activeSubItems
                            .filter((item) => item.type === BladesItemType.crew_upgrade && item.name && /^Elite/.test(item.name));
                        const parsedGangTypes = gangTypes
                            .map((gType) => {
                            if (eliteUpgrades.some((eUpg) => eUpg.hasTag(gType))) {
                                return `Elite ${gType}`;
                            }
                            return gType;
                        })
                            .sort((a, b) => (/^Elite/.test(a) ? 1 : 0) - (/^Elite/.test(b) ? 1 : 0));
                        sheetData.subtitle = `A ${C.ScaleSizes[scale - 1]}Gang of ${U.oxfordize(parsedGangTypes, false).replace(/\band\b/g, "&")}`;
                    }
                    else {
                        if (gangTypes.length === 0 || !BladesActor.IsType(this.item.parent, BladesActorType.crew)) {
                            sheetData.subtitle = `A ${C.ScaleSizes[scale - 1]}Gang`;
                        }
                        sheetData.subtitle = `A ${C.ScaleSizes[scale - 1]}Gang of ${U.oxfordize(gangTypes, false).replace(/\band\b/g, "&")}`;
                    }
                }
                else if (BladesItem.IsType(this.item, BladesItemType.cohort_expert)) {
                    sheetData.subtitle = "An Expert";
                }
            }
            return {
                ...context,
                ...sheetData
            };
        },
        [BladesItemType.cohort_expert]: (context) => this._getTypedItemData[BladesItemType.cohort_gang](context),
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
            if (context.isGM) {
                const expClueData = {};
                [...Object.values(context.system.experience_clues ?? []).filter((clue) => /[A-Za-z]/.test(clue)), " "].forEach((clue, i) => { expClueData[(i + 1).toString()] = clue; });
                context.system.experience_clues = expClueData;
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
        [BladesItemType.gear]: (context) => {
            if (!BladesItem.IsType(this.item, BladesItemType.gear)) {
                return undefined;
            }
            const sheetData = {
                tierData: {
                    "class": "comp-tier comp-vertical comp-teeth",
                    "label": "Quality",
                    "labelClass": "filled-label full-width",
                    "dotline": {
                        data: this.item.system.tier,
                        target: "system.tier.value",
                        iconEmpty: "dot-empty.svg",
                        iconEmptyHover: "dot-empty-hover.svg",
                        iconFull: "dot-full.svg",
                        iconFullHover: "dot-full-hover.svg"
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
            if (context.isGM) {
                const expClueData = {};
                [...Object.values(context.system.experience_clues ?? []).filter((clue) => /[A-Za-z]/.test(clue)), " "].forEach((clue, i) => { expClueData[(i + 1).toString()] = clue; });
                context.system.experience_clues = expClueData;
                const gatherInfoData = {};
                [...Object.values(context.system.gather_info_questions ?? []).filter((question) => /[A-Za-z]/.test(question)), " "].forEach((question, i) => { gatherInfoData[(i + 1).toString()] = question; });
                context.system.gather_info_questions = gatherInfoData;
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
        html.find(".dotline").each((_, elem) => {
            if ($(elem).hasClass("locked")) {
                return;
            }
            const targetDoc = this.item;
            const targetField = $(elem).data("target");
            const comp$ = $(elem).closest("comp");
            const curValue = U.pInt($(elem).data("value"));
            $(elem)
                .find(".dot")
                .each((j, dot) => {
                $(dot).on("click", (event) => {
                    event.preventDefault();
                    const thisValue = U.pInt($(dot).data("value"));
                    if (thisValue !== curValue) {
                        if (comp$.hasClass("comp-coins")
                            || comp$.hasClass("comp-stash")) {
                            G.effects
                                .fillCoins($(dot).prevAll(".dot"))
                                .then(() => targetDoc.update({ [targetField]: thisValue }));
                        }
                        else {
                            targetDoc.update({ [targetField]: thisValue });
                        }
                    }
                });
                $(dot).on("contextmenu", (event) => {
                    event.preventDefault();
                    const thisValue = U.pInt($(dot).data("value")) - 1;
                    if (thisValue !== curValue) {
                        targetDoc.update({ [targetField]: thisValue });
                    }
                });
            });
        });
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