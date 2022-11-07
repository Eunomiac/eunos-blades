/* ****▌███████████████████████████████████████████████████████████████████████████▐**** *\
|*     ▌████░░░░░░░░░░░ Euno's Blades in the Dark for Foundry VTT ░░░░░░░░░░░░░████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░ by Eunomiac ░░░░░░░░░░░░░██████████████████▐     *|
|*     ▌████████████████████████████  License █ v0.1.0 ████████████████████████████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░░░░░░  ░░░░░░░░░░░░░░░░░░███████████████████▐     *|
\* ****▌███████████████████████████████████████████████████████████████████████████▐**** */

import { BladesActorType, BladesItemType } from "./core/constants.js";
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
        const allTypeActors = await BladesActor.getAllActorsByType(this.docType);
        const validActors = allTypeActors.filter((actor) => actor.isValidForDoc(this.doc));
        this.tabs = Object.fromEntries((Object.entries(tabs))
            .map(([tabName, tabFilter]) => [
            tabName,
            { featured: [], other: validActors.filter(tabFilter) }
        ]));
    }
    async _createItemTabs(tabs) {
        const allTypeItems = await BladesItem.getAllItemsByType(this.docType);
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
    static get Categories() {
        return {
            ability: ["Item", BladesItemType.ability],
            background: ["Item", BladesItemType.background],
            clock_keeper: ["Item", BladesItemType.clock_keeper],
            cohort: ["Item", BladesItemType.cohort],
            crew_ability: ["Item", BladesItemType.crew_ability],
            crew_reputation: ["Item", BladesItemType.crew_reputation],
            crew_playbook: ["Item", BladesItemType.crew_playbook],
            crew_upgrade: ["Item", BladesItemType.crew_upgrade],
            faction: ["Item", BladesItemType.faction],
            gm_tracker: ["Item", BladesItemType.gm_tracker],
            heritage: ["Item", BladesItemType.heritage],
            item: ["Item", BladesItemType.item],
            playbook: ["Item", BladesItemType.playbook],
            vice: ["Item", BladesItemType.vice],
            pc: ["Actor", BladesActorType.pc],
            npc: ["Actor", BladesActorType.npc],
            crew: ["Actor", BladesActorType.crew],
            vicePurveyor: ["Actor", BladesActorType.npc],
            acquaintance: ["Actor", BladesActorType.npc]
        };
    }
    doc;
    category;
    callback;
    get docSuperType() { return BladesDialog.Categories[this.category][0]; }
    get docType() { return BladesDialog.Categories[this.category][1]; }
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
                    self.callback(docId);
                }
                self.close();
            },
            mouseenter: function () {
                $(this).closest(".tab").addClass("hovering");
                $(this).addClass("hover-over");
                if (self.docSuperType === "Item") {
                    const itemRules = (new Handlebars.SafeString(`<span>${game.items.get($(this).data("itemId"))?.system.rules ?? ""}</span>`)).toString();
                    itemDetailPane$.html(itemRules);
                }
                else if (self.docSuperType === "Actor") {
                    const targetActor = game.actors.get($(this).data("itemId"));
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