/* ****▌███████████████████████████████████████████████████████████████████████████▐**** *\
|*     ▌█░░░░░░░░░ Euno's Blades in the Dark for Foundry VTT ░░░░░░░░░░░█▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░ by Eunomiac ░░░░░░░░░░░░░██████████████████▐     *|
|*     ▌█  License █ v0.1.0 ██▐     *|
|*     ▌████░░░░  ░░░░█████▐     *|
\* ****▌███████████████████████████████████████████████████████████████████████████▐**** */

import BladesSheet from "./blades-sheet.js";
import { BladesItemType } from "../../core/constants.js";
class BladesCrewSheet extends BladesSheet {
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            classes: ["eunos-blades", "sheet", "actor", "crew"],
            template: "systems/eunos-blades/templates/crew-sheet.hbs",
            width: 940,
            height: 820,
            tabs: [{ navSelector: ".nav-tabs", contentSelector: ".tab-content", initial: "claims" }]
        });
    }
    getData() {
        const context = super.getData();
        eLog.checkLog("actor", "[BladesCrewSheet] super.getData()", { ...context });
        const { activeSubItems } = this.actor;
        const sheetData = {};

        sheetData.preparedItems = Object.assign(context.preparedItems ?? {}, {
            abilities: activeSubItems.filter((item) => item.type === BladesItemType.crew_ability),
            playbook: this.actor.playbook,
            reputation: activeSubItems.find((item) => item.type === BladesItemType.crew_reputation),
            upgrades: activeSubItems.filter((item) => item.type === BladesItemType.crew_upgrade),
            preferredOp: activeSubItems.find((item) => item.type === BladesItemType.preferred_op)
        });
        sheetData.preparedActors = {
            members: this.actor.members,
            contacts: this.actor.contacts
        };
        sheetData.tierData = {
            label: "Tier",
            dotline: {
                data: this.actor.system.tier,
                target: "system.tier.value",
                iconEmpty: "dot-empty.svg",
                iconEmptyHover: "dot-empty-hover.svg",
                iconFull: "dot-full.svg",
                iconFullHover: "dot-full-hover.svg"
            }
        };
        sheetData.upgradeData = {
            dotline: {
                dotlineClass: "dotline-right",
                data: {
                    value: this.actor.availableUpgradePoints,
                    max: this.actor.availableUpgradePoints
                },
                dotlineLabel: "Available Upgrade Points",
                isLocked: true,
                iconFull: "dot-full.svg"
            }
        };
        sheetData.abilityData = {
            dotline: {
                dotlineClass: "dotline-right",
                data: {
                    value: this.actor.availableAbilityPoints,
                    max: this.actor.availableAbilityPoints
                },
                dotlineLabel: "Available Ability Points",
                isLocked: true,
                iconFull: "dot-full.svg"
            }
        };
        sheetData.cohortData = {
            dotline: {
                dotlineClass: "dotline-right",
                data: {
                    value: this.actor.availableCohortPoints,
                    max: this.actor.availableCohortPoints
                },
                dotlineLabel: "Available Cohort Points",
                isLocked: true,
                iconFull: "dot-full.svg"
            }
        };
        sheetData.repData = {
            label: "Rep",
            dotlines: [
                {
                    data: {
                        value: Math.min(this.actor.system.rep.value, this.actor.system.rep.max - this.actor.turfCount),
                        max: this.actor.system.rep.max - this.actor.turfCount
                    },
                    target: "system.rep.value",
                    svgKey: "teeth.tall",
                    svgFull: "full|half|frame",
                    svgEmpty: "full|half|frame"
                },
                {
                    data: {
                        value: this.actor.turfCount,
                        max: this.actor.turfCount
                    },
                    target: "none",
                    svgKey: "teeth.tall",
                    svgFull: "full|half|frame",
                    svgEmpty: "full|half|frame",
                    dotlineClass: "flex-row-reverse",
                    isLocked: true
                }
            ]
        };
        sheetData.heatData = {
            label: "Heat",
            dotline: {
                data: this.actor.system.heat,
                target: "system.heat.value",
                svgKey: "teeth.tall",
                svgFull: "full|half|frame",
                svgEmpty: "full|half|frame"
            }
        };
        sheetData.wantedData = {
            label: "Wanted",
            dotline: {
                data: this.actor.system.wanted,
                target: "system.wanted.value",
                svgKey: "teeth.short",
                svgFull: "full|frame",
                svgEmpty: "frame"
            }
        };
        eLog.checkLog("actor", "[BladesCrewSheet] return getData()", { ...context, ...sheetData });
        return { ...context, ...sheetData };
    }
    activateListeners(html) {
        super.activateListeners(html);
        if (!this.options.editable) {
            return;
        }
        html.find(".item-sheet-open").on("click", (event) => {
            const element = $(event.currentTarget).parents(".item");
            const item = this.actor.items.get(element.data("itemId"));
            item?.sheet?.render(true);
        });
        html.find(".hold-toggle").on("click", () => {
            this.actor.update({ "system.hold": this.actor.system.hold === "weak" ? "strong" : "weak" });
        });
        html.find(".turf-select").on("click", async (event) => {
            const turf_id = $(event.currentTarget).data("turfId");
            const turf_current_status = $(event.currentTarget).data("turfStatus");
            this.actor.playbook?.update({ ["system.turfs." + turf_id + ".value"]: !turf_current_status })
                .then(() => this.render(false));
        });
    }
}
export default BladesCrewSheet;
//# sourceMappingURL=blades-crew-sheet.js.map