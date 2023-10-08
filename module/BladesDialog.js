/* ****▌███████████████████████████████████████████████████████████████████████████▐**** *\
|*     ▌█░░░░░░░░░ Euno's Blades in the Dark for Foundry VTT ░░░░░░░░░░░█▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░ by Eunomiac ░░░░░░░░░░░░░██████████████████▐     *|
|*     ▌█  License █ v0.1.0 ██▐     *|
|*     ▌████░░░░  ░░░░█████▐     *|
\* ****▌███████████████████████████████████████████████████████████████████████████▐**** */

import { ApplyTooltipListeners } from "./core/gsap.js";
import U from "./core/utilities.js";
export var SelectionCategory;
(function (SelectionCategory) {
    SelectionCategory["Heritage"] = "Heritage";
    SelectionCategory["Background"] = "Background";
    SelectionCategory["Vice"] = "Vice";
    SelectionCategory["Playbook"] = "Playbook";
    SelectionCategory["Reputation"] = "Reputation";
    SelectionCategory["Preferred_Op"] = "Preferred_Op";
    SelectionCategory["Gear"] = "Gear";
    SelectionCategory["Ability"] = "Ability";
    SelectionCategory["Faction"] = "Faction";
    SelectionCategory["Upgrade"] = "Upgrade";
    SelectionCategory["Cohort_Gang"] = "Cohort_Gang";
    SelectionCategory["Cohort_Expert"] = "Cohort_Expert";
    SelectionCategory["Feature"] = "Feature";
    SelectionCategory["Stricture"] = "Stricture";
    SelectionCategory["VicePurveyor"] = "VicePurveyor";
    SelectionCategory["Acquaintance"] = "Acquaintance";
    SelectionCategory["Friend"] = "Friend";
    SelectionCategory["Rival"] = "Rival";
    SelectionCategory["Crew"] = "Crew";
    SelectionCategory["Member"] = "Member";
    SelectionCategory["Contact"] = "Contact";
})(SelectionCategory || (SelectionCategory = {}));
class BladesSelectorDialog extends Dialog {
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            classes: ["eunos-blades", "sheet", "dialog"],
            template: "systems/eunos-blades/templates/dialog.hbs",
            width: "auto",
            height: "auto",
            tabs: [{ navSelector: ".nav-tabs", contentSelector: ".tab-content", initial: "front" }]
        });
    }
    static Initialize() {
        return loadTemplates([
            "systems/eunos-blades/templates/dialog.hbs"
        ]);
    }
    static async Display(parent, title, docType, tabs, tags) {
        const app = new BladesSelectorDialog({
            parent,
            title,
            docType,
            tabs,
            "tags": tags?.filter((tag) => tag !== ""),
            "content": "",
            "buttons": {
                cancel: {
                    icon: '<i class="fas fa-times"></i>',
                    label: game.i18n.localize("Cancel"),
                    callback: () => false
                }
            },
            "default": "cancel"
        });
        return app.hasItems ? app.render(true, { width: app.width }) : undefined;
    }
    get hasItems() {
        return Object.values(this.tabs).some((tabItems) => tabItems.length > 0);
    }
    parent;
    tabs;
    tags = [];
    width;
    docType;
    constructor(data, options) {
        super(data, options);
        const validTabs = [];
        for (const [tabName, tabItems] of Object.entries(data.tabs)) {
            if (tabItems.length === 0) {
                delete data.tabs[tabName];
            }
            else {
                validTabs.push(tabName);
            }
        }
        if (validTabs.length === 1 && !("Main" in data.tabs)) {
            data.tabs.Main = [...data.tabs[validTabs[0]]];
            delete data.tabs[validTabs[0]];
        }
        this.docType = data.docType;
        this.parent = data.parent;
        this.tabs = data.tabs;
        this.tags = data.tags ?? [];
        this.width = 150 * Math.ceil(Math.sqrt(Object.values(data.tabs)[0].length));
    }
    getData() {
        const data = super.getData();
        data.title = this.title;
        data.tabs = this.tabs;
        data.docType = this.docType;
        data.tags = this.tags;
        return data;
    }
    activateListeners(html) {
        super.activateListeners(html);
        const self = this;

        html.find(".nav-tabs .tab-selector").on("click", (event) => {
            const tabIndex = U.pInt($(event.currentTarget).data("tab"));
            const numItems = Object.values(self.tabs)[tabIndex].length;
            const width = U.pInt(150 * Math.ceil(Math.sqrt(numItems)));
            eLog.checkLog3("nav", "Nav Tab Size Recalculation", { tabIndex, numItems, width });
            this.render(false, { width });
        });

        ApplyTooltipListeners(html);

        html.find("[data-item-id]").on("click", function () {
            if ($(this).parent().hasClass("locked")) {
                return;
            }
            const docId = $(this).data("itemId");
            const docType = $(this).data("docType");
            eLog.checkLog("dialog", "[BladesDialog] on Click", { elem: this, docId, docType, parent: self.parent });
            if (docType === "Actor") {
                self.parent.addSubActor(docId, self.tags);
            }
            else if (docType === "Item") {
                self.parent.addSubItem(docId);
            }
            self.close();
        });
    }
}
export default BladesSelectorDialog;