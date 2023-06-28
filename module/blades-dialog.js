/* ****▌███████████████████████████████████████████████████████████████████████████▐**** *\
|*     ▌████░░░░░░░░░░░ Euno's Blades in the Dark for Foundry VTT ░░░░░░░░░░░░░████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░ by Eunomiac ░░░░░░░░░░░░░██████████████████▐     *|
|*     ▌████████████████████████████  License █ v0.1.0 ████████████████████████████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░░░░░░  ░░░░░░░░░░░░░░░░░░███████████████████▐     *|
\* ****▌███████████████████████████████████████████████████████████████████████████▐**** */

import G from "./core/gsap.js";
const app = new Dialog({ title: "Test", content: "", buttons: {} });
const tit = app.title;
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
    static async Display(parentDoc, title, tabs, callback) {
        const app = new BladesDialog({
            parentDoc,
            title,
            tabs,
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
        return app.render(true);
    }
    parentDoc;
    _title;
    get title() { return this._title; }
    tabs;
    callback;
    constructor(data, options) {
        super(data, options);
        this.parentDoc = data.parentDoc;
        this._title = data.title;
        this.tabs = data.tabs;
        this.callback = data.callback;
    }
    getData() {
        const data = super.getData();
        eLog.checkLog4("dialog", "[BladesDialog] super.getData()", { ...data });
        data.title = this.title;
        data.tabs = this.tabs;
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