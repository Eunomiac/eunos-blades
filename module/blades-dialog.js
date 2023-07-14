/* ****▌███████████████████████████████████████████████████████████████████████████▐**** *\
|*     ▌████░░░░░░░░░░░ Euno's Blades in the Dark for Foundry VTT ░░░░░░░░░░░░░████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░ by Eunomiac ░░░░░░░░░░░░░██████████████████▐     *|
|*     ▌████████████████████████████  License █ v0.1.0 ████████████████████████████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░░░░░░  ░░░░░░░░░░░░░░░░░░███████████████████▐     *|
\* ****▌███████████████████████████████████████████████████████████████████████████▐**** */

import G from "./core/gsap.js";
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
    SelectionCategory["Cohort"] = "Cohort";
    SelectionCategory["Feature"] = "Feature";
    SelectionCategory["Stricture"] = "Stricture";
    SelectionCategory["Vice_Purveyor"] = "Vice_Purveyor";
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
        eLog.checkLog("BladesSelectorDialog.Display()", { parent, title, tabs });
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
        return app.render(true);
    }
    parent;
    tabs;
    tags = [];
    docType;
    constructor(data, options) {
        super(data, options);
        this.docType = data.docType;
        this.parent = data.parent;
        this.tabs = data.tabs;
        this.tags = data.tags ?? [];
    }
    getData() {
        const data = super.getData();
        eLog.checkLog4("dialog", "[BladesDialog] super.getData()", { ...data });
        data.title = this.title;
        data.tabs = this.tabs;
        data.docType = this.docType;
        data.tags = this.tags;
        eLog.checkLog("dialog", "[BladesDialog] return getData()", { ...data });
        return data;
    }
    activateListeners(html) {
        super.activateListeners(html);
        const self = this;

        html.find(".tooltip").siblings("[data-item-id]")
            .each(function (i, elem) {
            $(elem).data("hoverTimeline", G.effects.hoverTooltip(elem));
        })
            .on({
            mouseenter: function () {
                $(this).parent().css("z-index", 1);
                $(this).data("hoverTimeline").play();
            },
            mouseleave: function () {
                $(this).data("hoverTimeline").reverse().then(() => {
                    $(this).parent().removeAttr("style");
                });
            }
        });

        html.find("[data-item-id]").on("click", function () {
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