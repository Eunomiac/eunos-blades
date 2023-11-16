import BladesActorSheet from "./BladesActorSheet.js";
import { BladesItemType } from "../../core/constants.js";
/*~ @@DOUBLE-BLANK@@ ~*/
class BladesCrewSheet extends BladesActorSheet {
    /*~ @@DOUBLE-BLANK@@ ~*/
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            classes: ["eunos-blades", "sheet", "actor", "crew"],
            template: "systems/eunos-blades/templates/crew-sheet.hbs",
            width: 940,
            height: 820,
            tabs: [{ navSelector: ".nav-tabs", contentSelector: ".tab-content", initial: "claims" }]
        });
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    getData() {
        const context = super.getData();
        /*~ @@DOUBLE-BLANK@@ ~*/
        eLog.checkLog("actor", "[BladesCrewSheet] super.getData()", { ...context });
        const { activeSubItems } = this.actor;
        /*~ @@DOUBLE-BLANK@@ ~*/
        const sheetData = {};
        /*~ @@DOUBLE-BLANK@@ ~*/
        //~ Assemble embedded actors and items
        sheetData.preparedItems = Object.assign(context.preparedItems ?? {}, {
            abilities: activeSubItems.filter((item) => item.type === BladesItemType.crew_ability),
            playbook: this.actor.playbook,
            reputation: activeSubItems.find((item) => item.type === BladesItemType.crew_reputation),
            upgrades: activeSubItems.filter((item) => item.type === BladesItemType.crew_upgrade),
            preferredOp: activeSubItems.find((item) => item.type === BladesItemType.preferred_op)
        });
        /*~ @@DOUBLE-BLANK@@ ~*/
        sheetData.preparedActors = {
            members: this.actor.members,
            contacts: this.actor.contacts
        };
        /*~ @@DOUBLE-BLANK@@ ~*/
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
        /*~ @@DOUBLE-BLANK@@ ~*/
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
        /*~ @@DOUBLE-BLANK@@ ~*/
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
        /*~ @@DOUBLE-BLANK@@ ~*/
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
        /*~ @@DOUBLE-BLANK@@ ~*/
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
        /*~ @@DOUBLE-BLANK@@ ~*/
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
        /*~ @@DOUBLE-BLANK@@ ~*/
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
        /*~ @@DOUBLE-BLANK@@ ~*/
        eLog.checkLog("actor", "[BladesCrewSheet] return getData()", { ...context, ...sheetData });
        return { ...context, ...sheetData };
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    activateListeners(html) {
        super.activateListeners(html);
        /*~ @@DOUBLE-BLANK@@ ~*/
        // Everything below here is only needed if the sheet is editable
        if (!this.options.editable) {
            return;
        }
        /*~ @@DOUBLE-BLANK@@ ~*/
        // Update Inventory Item
        html.find(".item-sheet-open").on("click", (event) => {
            const element = $(event.currentTarget).parents(".item");
            const item = this.actor.items.get(element.data("itemId"));
            item?.sheet?.render(true);
        });
        /*~ @@DOUBLE-BLANK@@ ~*/
        // Toggle Hold
        html.find(".hold-toggle").on("click", () => {
            this.actor.update({ "system.hold": this.actor.system.hold === "weak" ? "strong" : "weak" });
        });
        /*~ @@DOUBLE-BLANK@@ ~*/
        // Toggle Turf
        html.find(".turf-select").on("click", async (event) => {
            /*~ @@DOUBLE-BLANK@@ ~*/
            const turf_id = $(event.currentTarget).data("turfId");
            const turf_current_status = $(event.currentTarget).data("turfStatus");
            this.actor.playbook?.update({ ["system.turfs." + turf_id + ".value"]: !turf_current_status })
                .then(() => this.render(false));
        });
    }
}
/*~ @@DOUBLE-BLANK@@ ~*/
export default BladesCrewSheet;
