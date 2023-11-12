/* ****▌███████████████████████████████████████████████████████████████████████████▐**** *\
|*     ▌█░░░░░░░░░ Euno's Blades in the Dark for Foundry VTT ░░░░░░░░░░░█▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░ by Eunomiac ░░░░░░░░░░░░░██████████████████▐     *|
|*     ▌█  License █ v0.1.0 ██▐     *|
|*     ▌████░░░░  ░░░░█████▐     *|
\* ****▌███████████████████████████████████████████████████████████████████████████▐**** */

import { ApplyTooltipListeners } from "./core/gsap.js";
import U from "./core/utilities.js";
import BladesActor from "./BladesActor.js";
import BladesRoll from "./BladesRoll.js";
import C, { RollResult, AttributeTrait } from "./core/constants.js";
import BladesAI, { AGENTS } from "./core/ai.js";
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
export var BladesDialogType;
(function (BladesDialogType) {
    BladesDialogType["Selection"] = "Selection";
    BladesDialogType["Consequence"] = "Consequence";
})(BladesDialogType || (BladesDialogType = {}));
class BladesDialog extends Dialog {
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            classes: ["eunos-blades", "sheet", "dialog"],
            width: "auto",
            height: "auto",
            tabs: [{ navSelector: ".nav-tabs", contentSelector: ".tab-content", initial: "front" }]
        });
    }
    static Initialize() {
        return loadTemplates([
            "systems/eunos-blades/templates/dialog-selection.hbs",
            "systems/eunos-blades/templates/dialog-consequence.hbs"
        ]);
    }
    static async DisplaySelectionDialog(parent, title, docType, tabs, tags) {
        const app = new BladesDialog({
            parent,
            title,
            docType,
            tabs,
            tags: tags?.filter((tag) => tag !== ""),
            content: "",
            buttons: {
                cancel: {
                    icon: '<i class="fas fa-times"></i>',
                    label: game.i18n.localize("Cancel"),
                    callback: (html) => {
                        eLog.checkLog3("dialog", "Callback Scope", { this: this, html });
                        return false;
                    }
                }
            },
            default: "cancel"
        });
        return app.hasItems ? app.render(true, { width: app.width }) : undefined;
    }
    static async DisplayRollConsequenceDialog(rollInst) {
        const app = new BladesDialog({
            parent: rollInst,
            title: "Consequences",
            dialogType: BladesDialogType.Consequence,
            content: "",
            buttons: {
                apply: {
                    icon: '<i class="fa-solid fa-arrow-down-to-arc"></i>',
                    label: "Apply",
                    callback: (html) => app
                        .writeToRollInstance(html)
                },
                cancel: {
                    icon: '<i class="fas fa-times"></i>',
                    label: game.i18n.localize("Cancel"),
                    callback: (html) => {
                        eLog.checkLog3("dialog", "Callback Scope", { this: app, html });
                        return false;
                    }
                }
            },
            default: "apply"
        }, { classes: ["eunos-blades", "sheet", "dialog", "consequence-dialog"] });
        return app._render(true, { width: app.width }).then(() => eLog.checkLog3("dialog", "Dialog Instance", { this: app }));
    }
    get template() {
        if (this.dialogType === BladesDialogType.Selection) {
            return "systems/eunos-blades/templates/dialog-selection.hbs";
        }
        return "systems/eunos-blades/templates/dialog-consequence.hbs";
    }
    get hasItems() {
        return Object.values(this.tabs ?? []).some((tabItems) => tabItems.length > 0);
    }
    parent;
    tabs;
    dialogType;
    tags = [];
    width;
    docType;
    csqData = { [RollResult.partial]: {}, [RollResult.fail]: {} };
    constructor(data, options) {
        super(data, options);
        this.dialogType = data.dialogType ?? BladesDialogType.Selection;
        this.parent = data.parent;
        this.width = 500;
        switch (this.dialogType) {
            case BladesDialogType.Selection:
                this.constructSelectionData(data );
                return;
            case BladesDialogType.Consequence:
                this.constructConsequenceData(data );
                return;
            default: throw new Error(`Unrecognized type for BladesDialog constructor: '${this.dialogType}'`);
        }
    }
    constructSelectionData(data ) {
        const validTabs = [];
        if (!data.tabs) {
            return;
        }
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
        this.tabs = data.tabs;
        this.tags = data.tags ?? [];
        this.width = 150 * Math.ceil(Math.sqrt(Object.values(data.tabs)[0].length));
    }
    constructConsequenceData(data ) {
        eLog.checkLog3("dialog", "constructConsequenceData", { incoming: data });
        if (this.parent instanceof BladesRoll) {
            this.csqData = U.objMerge({
                [RollResult.partial]: {
                    0: { name: "", type: "", attribute: "" },
                    1: { name: "", type: "", attribute: "" },
                    2: { name: "", type: "", attribute: "" }
                },
                [RollResult.fail]: {
                    0: { name: "", type: "", attribute: "" },
                    1: { name: "", type: "", attribute: "" },
                    2: { name: "", type: "", attribute: "" }
                }
            }, this.parent.getFlagVal("consequenceData") ?? {});
            this._consequenceAI = new BladesAI(AGENTS.ConsequenceAdjuster);
        }
    }
    getData() {
        const data = super.getData();
        switch (this.dialogType) {
            case BladesDialogType.Selection: return this.prepareSelectionData(data);
            case BladesDialogType.Consequence: return this.prepareConsequenceData(data);
            default: return null;
        }
    }
    prepareSelectionData(data) {
        data.title = this.title;
        data.tabs = this.tabs;
        data.docType = this.docType;
        data.tags = this.tags;
        return data;
    }
    prepareConsequenceData(data) {
        eLog.checkLog3("dialog", "updateConsequenceDialog() this.csqData", this.csqData);
        eLog.checkLog3("dialog", "prepareConsequenceData", { incoming: data });
        data.consequenceData = this.csqData;
        data.consequenceTypeOptions = this.consequenceTypeOptions;
        data.consequenceTypeOptionsAll = Object.entries(C.ConsequenceDisplay)
            .map(([cType, cDisplay]) => ({ value: cType, display: cDisplay }));
        data.consequenceAttributeOptions = [
            { value: AttributeTrait.insight, display: "Insight" },
            { value: AttributeTrait.prowess, display: "Prowess" },
            { value: AttributeTrait.resolve, display: "Resolve" }
        ];
        eLog.checkLog3("dialog", "prepareConsequenceData", { outgoing: data });
        return data;
    }
    get consequenceTypeOptions() {
        if (this.parent instanceof BladesRoll) {
            return {
                [RollResult.partial]: C.Consequences[this.parent.finalPosition][RollResult.partial]
                    .map((cType) => ({ value: cType, display: C.ConsequenceDisplay[cType] })),
                [RollResult.fail]: C.Consequences[this.parent.finalPosition][RollResult.fail]
                    .map((cType) => ({ value: cType, display: C.ConsequenceDisplay[cType] }))
            };
        }
        return {};
    }
    updateConsequenceDialog(html, isRendering = true) {
                
        
        [RollResult.partial, RollResult.fail].forEach((rollResult) => {
            for (let i = 0; i < 3; i++) {
                const thisCsqData = {
                    type: html.find(`[data-flag-target="rollCollab.consequenceData.${rollResult}.${i}.type"]`)[0].value,
                    attribute: html.find(`[data-flag-target="rollCollab.consequenceData.${rollResult}.${i}.attribute"]`)[0].value,
                    name: html.find(`[data-flag-target="rollCollab.consequenceData.${rollResult}.${i}.name"]`)[0].value,
                    resistOptions: this.csqData[rollResult][i]
                        .resistOptions ?? {}
                };
                if (thisCsqData.type) {
                    thisCsqData.icon = C.ConsequenceIcons[thisCsqData.type];
                }
                const resistOptionElems = Array.from(html.find(`input[type="text"][data-flag-target="rollCollab.consequenceData.${rollResult}.${i}.resistOptions`));
                eLog.checkLog3("dialog", "...resistOptionElems", { html, resistOptionElems, thisCsqData });
                if (resistOptionElems.length > 0) {
                    for (let j = 0; j < resistOptionElems.length; j++) {
                        thisCsqData.resistOptions ??= {};
                        thisCsqData.resistOptions[j] = {
                            name: resistOptionElems[i].value,
                            type: html.find(`[data-flag-target="rollCollab.consequenceData.${rollResult}.${i}.resistOptions.${j}.type"]`)[0].value,
                            isSelected: html.find(`[data-flag-target="rollCollab.consequenceData.${rollResult}.${i}.resistOptions.${j}.isSelected"]`)[0].checked
                        };
                    }
                }
                this.csqData[rollResult][i] = thisCsqData;
            }
        });
        eLog.checkLog3("dialog", "updateConsequenceDialog() this.csqData", this.csqData);
        if (isRendering) {
            this.render();
        }
    }
    async writeToRollInstance(html) {
        if (this.parent instanceof BladesRoll) {
            this.updateConsequenceDialog(html, false);
            await this.parent.setFlagVal("consequenceData", this.csqData);
        }
    }
    _consequenceAI;
    async queryAI(event) {
        if (!this._consequenceAI) {
            this._consequenceAI = new BladesAI(AGENTS.ConsequenceAdjuster);
        }
        const dataAction = event.currentTarget.dataset.action;
        if (dataAction && dataAction.startsWith("ai-query")) {
            const [rollResult, csqIndex] = dataAction.split(/-/).slice(2);
            const csqName = this.csqData[rollResult][csqIndex]?.name;
            if (csqName) {
                const response = await this._consequenceAI?.query(csqName, csqName);
                if (response) {
                    this.addResistanceOptions(rollResult, csqIndex, response.split("|"));
                }
            }
        }
    }
    async setFlagVal(target, value) {
        if (this.parent instanceof BladesRoll) {
            return this.parent.setFlagVal(target, value, false);
        }
    }
    async addResistanceOptions(rollResult, cIndex, rOptions) {
        const cData = this.csqData[rollResult][cIndex];
        if (!cData) {
            return;
        }
        const cType = cData.type;
        const rType = C.ResistedConsequenceTypes[cType] ?? undefined;
        const resistOptions = {};
        for (let i = 0; i < rOptions.length; i++) {
            resistOptions[i] = {
                name: rOptions[i],
                isSelected: false
            };
            if (rType) {
                resistOptions[i].type = rType;
                resistOptions[i].icon = C.ConsequenceIcons[rType];
            }
        }
        this.csqData[rollResult][cIndex].resistOptions = resistOptions;
        eLog.checkLog3("dialog", "addResistanceOptions() this.csqData", this.csqData);
        this.render();
    }
    async selectResistOption(event) {
        eLog.checkLog3("dialog", "Clicked Resistance Option", event);
        const dataAction = event.currentTarget.dataset.action;
        if (dataAction && dataAction.startsWith("gm-select-toggle")) {
            const [rollResult, csqIndex, resIndex] = dataAction.split(/-/).slice(3);
            eLog.checkLog3("dialog", "... Action Passed", { rollResult, csqIndex, resIndex });
            const resOptions = this.csqData[rollResult][csqIndex].resistOptions ?? {};
            resOptions[resIndex].isSelected = !resOptions[resIndex].isSelected;
            if (resOptions[resIndex].isSelected) {
                Object.keys(resOptions)
                    .filter((key) => key !== resIndex)
                    .forEach((key) => { resOptions[key].isSelected = false; });
            }
            this.csqData[rollResult][csqIndex].resistOptions = resOptions;
            this.render();
        }
    }
    activateListeners(html) {
        super.activateListeners(html);
        ApplyTooltipListeners(html);
        switch (this.dialogType) {
            case BladesDialogType.Selection:
                this.activateSelectionListeners(html);
                break;
            case BladesDialogType.Consequence:
                this.activateConsequenceListeners(html);
                break;
        }
    }
    activateSelectionListeners(html) {
        const self = this;
        html.find(".nav-tabs .tab-selector").on("click", (event) => {
            const tabIndex = U.pInt($(event.currentTarget).data("tab"));
            const numItems = Object.values(self.tabs ?? [])[tabIndex].length;
            const width = U.pInt(150 * Math.ceil(Math.sqrt(numItems)));
            eLog.checkLog3("nav", "Nav Tab Size Recalculation", { tabIndex, numItems, width });
            this.render(false, { width });
        });
        html.find("[data-item-id]").on("click", function () {
            if ($(this).parent().hasClass("locked")) {
                return;
            }
            const docId = $(this).data("itemId");
            const docType = $(this).data("docType");
            eLog.checkLog("dialog", "[BladesDialog] on Click", { elem: this, docId, docType, parent: self.parent });
            if (self.parent instanceof BladesActor) {
                if (docType === "Actor") {
                    self.parent.addSubActor(docId, self.tags);
                }
                else if (docType === "Item") {
                    self.parent.addSubItem(docId);
                }
            }
            self.close();
        });
    }
    activateConsequenceListeners(html) {
        html.find("input").on({ blur: () => this.updateConsequenceDialog(html) });
        html.find("select").on({ change: () => this.updateConsequenceDialog(html) });
        html.find('[data-action^="ai-query"]').on({ click: (event) => this.queryAI(event) });
        html.find('[data-action^="gm-select-toggle"]').on({ click: (event) => this.selectResistOption(event) });
    }
}
export default BladesDialog;