/* ****▌███████████████████████████████████████████████████████████████████████████▐**** *\
|*     ▌████░░░░░░░░░░░ Euno's Blades in the Dark for Foundry VTT ░░░░░░░░░░░░░████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░ by Eunomiac ░░░░░░░░░░░░░██████████████████▐     *|
|*     ▌████████████████████████████  License █ v0.1.0 ████████████████████████████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░░░░░░  ░░░░░░░░░░░░░░░░░░███████████████████▐     *|
\* ****▌███████████████████████████████████████████████████████████████████████████▐**** */

import BladesActor from "./blades-actor.js";
import BladesItem from "./blades-item.js";
class BladesDialog extends Dialog {
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
    static async Display(doc, title, category, callback, tabFilters = { all: (a) => true }, featuredFilters, isFeaturing = {}) {
        const app = new BladesDialog({
            doc,
            title,
            category,
            callback,
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
        await app.createTabs(tabFilters);
        if (featuredFilters) {
            app.applyFeaturedFilters(featuredFilters, isFeaturing);
        }
        return app.render(true);
    }
    tabs = {};
    async createTabs(tabs) {
        switch (this.docSuperType) {
            case "Actor":
                this._createActorTabs(tabs);
                return;
            case "Item":
                this._createItemTabs(tabs);
                return;
        }
    }
    async _createActorTabs(tabs) {
        const allCategoryActors = await BladesActor.GetGlobalCategoryActors(this.category, this.doc);
        const validActors = allCategoryActors.filter((actor) => actor.isValidForDoc(this.doc));
        this.tabs = Object.fromEntries((Object.entries(tabs))
            .map(([tabName, tabFilter]) => [
            tabName,
            { featured: [], other: validActors.filter(tabFilter) }
        ]));
    }
    async _createItemTabs(tabs) {
        const allTypeItems = await BladesItem.GetGlobalCategoryItems(this.category, this.doc);
        const validItems = allTypeItems.filter((item) => item.isValidForDoc(this.doc));
        this.tabs = Object.fromEntries((Object.entries(tabs))
            .map(([tabName, tabFilter]) => [
            tabName,
            { featured: [], other: validItems.filter(tabFilter) }
        ]));
    }
    applyFeaturedFilters(filters, isFeaturing) {
        for (const [tabName, filterFunc] of Object.entries(filters)) {
            const [featured, other] = [
                this.tabs[tabName].other.filter((doc) => filterFunc(doc)),
                this.tabs[tabName].other.filter((doc) => !filterFunc(doc))
            ];
            if (isFeaturing[tabName]) {
                this.tabs[tabName] = {
                    featured,
                    other
                };
            }
            else {
                this.tabs[tabName] = {
                    featured: [],
                    other: [...featured, ...other]
                };
            }
        }
    }
    doc;
    category;
    callback;
    get docSuperType() {
        if (this.category in BladesActor.CategoryTypes) {
            return "Actor";
        }
        if (this.category in BladesItem.CategoryTypes) {
            return "Item";
        }
        throw new Error(`Unrecognized Category: ${this.category}`);
    }
    get docType() {
        if (this.category in BladesActor.CategoryTypes) {
            return BladesActor.CategoryTypes[this.category];
        }
        if (this.category in BladesItem.CategoryTypes) {
            return BladesItem.CategoryTypes[this.category];
        }
        throw new Error(`Unrecognized Category: ${this.category}`);
    }
    constructor(data, options) {
        eLog.checkLog4("dialog", "[BladesDialog] constructor(data)", { ...data });
        super(data, options);
        eLog.checkLog4("dialog", "[BladesDialog] super(data)", { ...data });
        this.doc = data.doc;
        this.category = data.category;
        this.callback = data.callback;
    }
    getData() {
        const data = super.getData();
        eLog.checkLog4("dialog", "[BladesDialog] super.getData()", { ...data });
        Object.assign(data, {
            tabs: this.tabs
        });
        eLog.checkLog("dialog", "[BladesDialog] return getData()", { ...data });
        return data;
    }
    activateListeners(html) {
        super.activateListeners(html);
        const self = this;
        const itemDetailPane$ = $(html).find(".item-details");

        html.find("[data-item-id]").on({
            click: function () {
                const docId = $(this).data("itemId");
                if (docId) {
                    eLog.checkLog("dialog", `[BladesDialog] Calling Back (${docId})`);
                    self.callback(docId);
                }
                self.close();
            },
            mouseenter: async function () {
                $(this).closest(".tab").addClass("hovering");
                $(this).addClass("hover-over");
                if (self.docSuperType === "Item") {
                    const item = await BladesItem.GetPersonal($(this).data("itemId"), self.doc);
                    if (!item) {
                        return;
                    }
                    const itemRules = (new Handlebars.SafeString(`<span>${item.system.rules}</span>`)).toString();
                    itemDetailPane$.html(itemRules);
                }
                else if (self.docSuperType === "Actor") {
                    const targetActor = await BladesActor.GetPersonal($(this).data("itemId"), self.doc);
                    if (!targetActor) {
                        return;
                    }
                    const actorDesc = (new Handlebars.SafeString(`<span>${targetActor.system.concept || targetActor.system.description_short || ""}</span>`)).toString();
                    itemDetailPane$.html(actorDesc);
                }
            },
            mouseleave: function () {
                $(this).closest(".tab").removeClass("hovering");
                $(this).removeClass("hover-over");
                itemDetailPane$.html("");
            }
        });
    }
}
export default BladesDialog;