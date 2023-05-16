/* ****▌███████████████████████████████████████████████████████████████████████████▐**** *\
|*     ▌████░░░░░░░░░░░ Euno's Blades in the Dark for Foundry VTT ░░░░░░░░░░░░░████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░ by Eunomiac ░░░░░░░░░░░░░██████████████████▐     *|
|*     ▌████████████████████████████  License █ v0.1.0 ████████████████████████████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░░░░░░  ░░░░░░░░░░░░░░░░░░███████████████████▐     *|
\* ****▌███████████████████████████████████████████████████████████████████████████▐**** */

import G from "./core/gsap.js";
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
        if (this.docSuperType === "Actor") {
            return this._createActorTabs(tabs);
        }
        return this._createItemTabs(tabs);
    }
    async _createActorTabs(tabs) {
        eLog.checkLog3("actorFetch", `BladesDialog._createActorTabs() --- cat = ${this.category}`);
        const allCategoryActors = BladesActor.GetPersonalGlobalCategoryActors(this.category, this.doc);
        const validatedActors = allCategoryActors.map((actor) => (actor.isValidForDoc(this.doc) ? actor : null));
        const validActors = validatedActors.filter((actor) => actor !== null);
        this.tabs = Object.fromEntries((Object.entries(tabs))
            .map(([tabName, tabFilter]) => [
            tabName,
            { featured: [], other: validActors.filter(tabFilter) }
        ]));
    }
    async _createItemTabs(tabs) {
        const allCategoryItems = await BladesItem.GetGlobalCategoryItems(this.category, this.doc);
        const validatedItems = await Promise.all(allCategoryItems.map(async (item) => {
            return (await item.isValidForDoc(this.doc)) ? item : null;
        }));
        const validItems = validatedItems.filter((item) => item !== null);
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
            tabs: this.tabs,
            category: this.category
        });
        eLog.checkLog("dialog", "[BladesDialog] return getData()", { ...data });
        return data;
    }
    activateListeners(html) {
        super.activateListeners(html);
        const self = this;

        html.find("[data-item-id]")
            .each(function (i, elem) {
            $(elem).data("hoverTimeline", G.effects.hoverDialogItem(elem));
        }).on({
            click: function () {
                const docId = $(this).data("itemId");
                if (docId) {
                    self.callback(docId);
                }
                self.close();
            },
            mouseenter: function () {
                $(this).data("hoverTimeline").play();
            },
            mouseleave: function () {
                $(this).data("hoverTimeline").reverse();
            }
        });
    }
}
export default BladesDialog;