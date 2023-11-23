import { ApplyTooltipAnimations } from "./core/gsap.js";
import U from "./core/utilities.js";
import { BladesActor, BladesPC } from "./documents/BladesActorProxy.js";
import BladesRoll from "./BladesRoll.js";
import C, { RollResult, ConsequenceType, AttributeTrait, Position } from "./core/constants.js";
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
            "systems/eunos-blades/templates/dialog-consequence.hbs",
            "systems/eunos-blades/templates/parts/dialog-consequence-block.hbs"
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
    csqData;
    constructor(data, options) {
        super(data, options);
        this.dialogType = data.dialogType ?? BladesDialogType.Selection;
        this.parent = data.parent;
        this.width = 500;
        switch (this.dialogType) {
            case BladesDialogType.Selection:
                this.constructSelectionData(data /* , options */);
                return;
            case BladesDialogType.Consequence:
                this.csqData = this.constructConsequenceData(data /* , options */);
                return;
            default: throw new Error(`Unrecognized type for BladesDialog constructor: '${this.dialogType}'`);
        }
    }
    constructSelectionData(data /* , options?: Partial<BladesDialog.Options> */) {
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
    constructConsequenceData(data /* , options?: Partial<BladesDialog.Options> */) {
        eLog.checkLog3("dialog", "constructConsequenceData", { incoming: { ...data } });
        if (!(this.parent instanceof BladesRoll)) {
            throw new Error("Cannot call 'constructConsequenceData' without a rollInst parent!");
        }
        // Get existing consequence data, if any, on roll instance
        const rollCsqData = this.parent.getFlagVal("consequenceData") ?? {};
        // Extend consequence data by applying new blank consequence instances,
        //   so at least three csq entries are available for each position/result combination
        Object.values(Position).forEach((rollPos) => {
            rollCsqData[rollPos] ??= {
                [RollResult.partial]: {},
                [RollResult.fail]: {}
            };
            [RollResult.partial, RollResult.fail].forEach((rollResult) => {
                rollCsqData[rollPos][rollResult] ??= {};
                while (Object.values(rollCsqData[rollPos][rollResult]).length < 3) {
                    const blankCsqData = {
                        id: randomID(),
                        name: "",
                        type: "",
                        attribute: ""
                    };
                    rollCsqData[rollPos][rollResult][blankCsqData.id] = blankCsqData;
                }
            });
        });
        this._consequenceAI = new BladesAI(AGENTS.ConsequenceAdjuster);
        return rollCsqData;
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
        eLog.checkLog3("dialog", "prepareConsequenceData this.csqData", { ...this.csqData });
        eLog.checkLog3("dialog", "prepareConsequenceData", { incoming: { ...data } });
        data.consequenceData = this.csqData;
        data.consequenceTypeOptions = this.consequenceTypeOptions;
        data.consequenceTypeOptionsAll = Object.keys(C.ConsequenceDisplay)
            .map((cType) => ({ value: cType, display: cType }));
        data.consequenceAttributeOptions = [
            { value: AttributeTrait.insight, display: "Insight" },
            { value: AttributeTrait.prowess, display: "Prowess" },
            { value: AttributeTrait.resolve, display: "Resolve" }
        ];
        eLog.checkLog3("dialog", "prepareConsequenceData", { outgoing: { ...data } });
        return data;
    }
    get consequenceTypeOptions() {
        if (this.parent instanceof BladesRoll) {
            const returnData = {};
            [Position.controlled, Position.risky, Position.desperate].forEach((pos) => {
                returnData[pos] = {
                    [RollResult.partial]: C.Consequences[pos][RollResult.partial]
                        .map((cType) => ({ value: cType, display: cType })),
                    [RollResult.fail]: C.Consequences[pos][RollResult.fail]
                        .map((cType) => ({ value: cType, display: cType }))
                };
            });
            return returnData;
        }
        return {};
    }
    updateConsequenceData(html, cData) {
        const csqElem$ = html.find(`.roll-consequence-row[data-csq-id='${cData.id}']`); // flag-target="rollCollab.consequenceData.${rollPos}.${rollResult}.${i}.attribute"]`)
        // Update Type
        const type$ = csqElem$.find(".roll-consequence-type-select");
        const typeVal = type$.val();
        if (typeVal && typeVal in ConsequenceType) {
            cData.type = typeVal;
            cData.icon = C.ConsequenceIcons[cData.type];
            cData.typeDisplay = C.ConsequenceDisplay[cData.type];
        }
        // Update Resistance Attribute
        if (/Resolve/.exec(cData.type)) {
            cData.attribute = AttributeTrait.resolve;
        }
        else if (/Insight/.exec(cData.type)) {
            cData.attribute = AttributeTrait.insight;
        }
        else if (/Prowess/.exec(cData.type)) {
            cData.attribute = AttributeTrait.prowess;
        }
        else {
            const attribute$ = csqElem$.find(".roll-consequence-attribute-select");
            const attrVal = attribute$.val();
            if (attrVal && attrVal in AttributeTrait) {
                cData.attribute = attrVal;
                if (this.parent.rollPrimaryDoc instanceof BladesPC) {
                    cData.attributeVal = this.parent.rollPrimaryDoc.attributes[cData.attribute];
                }
                else if (this.parent.rollPrimaryDoc?.parent instanceof BladesPC) {
                    cData.attributeVal = this.parent.rollPrimaryDoc.parent.attributes[cData.attribute];
                }
                else {
                    eLog.error(`Unable to get attribute from rollPrimaryDoc '${this.parent.rollPrimaryDoc?.name}' of type '${this.parent.rollPrimaryDoc?.rollPrimaryType}' (may need to log via flags if either of the previous show 'undefined'.`);
                }
            }
        }
        // Update Name
        const name$ = csqElem$.find(".consequence-name");
        const nameVal = name$.val();
        cData.name = nameVal ?? "";
        // Update Resistance Options
        const resistOptions = cData.resistOptions ?? {};
        // Clear 'resistTo' (will be redetermined below)
        delete cData.resistTo;
        csqElem$.find(".consequence-resist-option").each((_, elem) => {
            const resCsqID = $(elem).data("csq-id");
            resistOptions[resCsqID] ??= { id: resCsqID, name: "", type: undefined, isSelected: false };
            // Update Resistance Option Type
            const resType$ = $(elem).find(".roll-consequence-type-select");
            const resTypeVal = resType$.val();
            if (resTypeVal && resTypeVal in ConsequenceType) {
                resistOptions[resCsqID].type = resTypeVal;
                resistOptions[resCsqID].icon = C.ConsequenceIcons[resistOptions[resCsqID].type];
                resistOptions[resCsqID].typeDisplay = C.ConsequenceDisplay[resistOptions[resCsqID].type];
            }
            // Update Resistance Option Name
            const resName$ = $(elem).find(".consequence-name");
            const resNameVal = resName$.val();
            resistOptions[resCsqID].name = resNameVal ?? "";
            // If this is selected, update 'resistTo' data as well
            if (resistOptions[resCsqID].isSelected) {
                cData.resistTo = resistOptions[resCsqID];
            }
        });
        cData.resistOptions = resistOptions;
        return cData;
    }
    updateConsequenceDialog(html, isRendering = true) {
        if (!(this.parent instanceof BladesRoll)) {
            return;
        }
        if (!this.csqData) {
            return;
        }
        eLog.checkLog3("dialog", "updateConsequenceDialog() this.csqData INCOMING", { ...this.csqData });
        const { csqData } = this;
        const { rollPrimaryDoc } = this.parent;
        if (!(rollPrimaryDoc instanceof BladesPC)) {
            return;
        }
        Object.keys(csqData).forEach((rollPos) => {
            const positionCsqData = csqData[rollPos];
            Object.keys(csqData[rollPos]).forEach((rollResult) => {
                positionCsqData[rollResult] = U.objMap(positionCsqData[rollResult], (cData) => this.updateConsequenceData(html, cData));
            });
            csqData[rollPos] = positionCsqData;
        });
        this.csqData = csqData;
        eLog.checkLog3("dialog", "updateConsequenceDialog() this.csqData OUTGOING", { ...this.csqData });
        if (isRendering) {
            this.render();
        }
    }
    async writeToRollInstance(html) {
        if (this.parent instanceof BladesRoll) {
            this.updateConsequenceDialog(html, false);
            await this.parent.setFlagVal("consequenceData", { ...this.csqData });
        }
    }
    _consequenceAI;
    async queryAI(event) {
        if (!this.csqData) {
            return;
        }
        // If the AI generator has not been initialized, do so.
        if (!this._consequenceAI) {
            this._consequenceAI = new BladesAI(AGENTS.ConsequenceAdjuster);
        }
        // Get the name of the consequence.
        const dataAction = event.currentTarget.dataset.action;
        if (dataAction && dataAction.startsWith("ai-query")) {
            const [rollPosition, rollResult, csqID] = dataAction.split(/-/).slice(2);
            const csqName = this.csqData[rollPosition][rollResult][csqID]?.name;
            if (csqName) {
                const response = await this._consequenceAI?.query(csqName, csqName);
                if (response) {
                    this.refreshResistanceOptions(rollPosition, rollResult, csqID, response.split("|"));
                }
            }
        }
    }
    async setFlagVal(target, value) {
        if (this.parent instanceof BladesRoll) {
            return this.parent.setFlagVal(target, value, false);
        }
    }
    async refreshResistanceOptions(rollPosition, rollResult, cID, rOptions) {
        if (!this.csqData) {
            return;
        }
        const cData = this.csqData[rollPosition][rollResult][cID];
        if (!cData) {
            return;
        }
        const cType = cData.type;
        const rType = C.ResistedConsequenceTypes[cType] ?? undefined;
        const resistOptions = {};
        for (let i = 0; i < rOptions.length; i++) {
            const rID = randomID();
            resistOptions[rID] = {
                id: rID,
                name: rOptions[i],
                isSelected: false
            };
            if (rType) {
                resistOptions[rID].type = rType;
                resistOptions[rID].typeDisplay = C.ConsequenceDisplay[rType];
                resistOptions[rID].icon = C.ConsequenceIcons[rType];
            }
        }
        this.csqData[rollPosition][rollResult][cID].resistOptions = resistOptions;
        eLog.checkLog3("dialog", "addResistanceOptions() this.csqData", { ...this.csqData });
        this.render();
    }
    async selectResistOption(event) {
        if (!this.csqData) {
            return;
        }
        eLog.checkLog3("dialog", "Clicked Resistance Option", event);
        const dataAction = event.currentTarget.dataset.action;
        if (dataAction && dataAction.startsWith("gm-select-toggle")) {
            const [rollPosition, rollResult, csqIndex, resIndex] = dataAction.split(/-/).slice(3);
            eLog.checkLog3("dialog", "... Action Passed", { rollResult, csqIndex, resIndex });
            // Get consequence data
            const cData = this.csqData[rollPosition][rollResult][csqIndex];
            cData.resistOptions ??= {};
            // Toggle clicked resistance option
            cData.resistOptions[resIndex].isSelected = !cData.resistOptions[resIndex].isSelected;
            // If resistance option is now selected...
            if (cData.resistOptions[resIndex].isSelected) {
                // ... deselect other options
                Object.keys(cData.resistOptions)
                    .filter((key) => key !== resIndex)
                    .forEach((key) => {
                    cData.resistOptions[key].isSelected = false;
                });
                // ... and set 'resistTo' to this consequence.
                cData.resistTo = cData.resistOptions[resIndex];
            }
            else {
                // Otherwise, set 'resistTo' to false.
                cData.resistTo = false;
            }
            // Assign new cData instance.
            this.csqData[rollPosition][rollResult][csqIndex] = cData;
            this.render();
        }
    }
    activateListeners(html) {
        super.activateListeners(html);
        // ~ Tooltips
        ApplyTooltipAnimations(html);
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
        // ~ Changing Width on Tab Change Depending on Number of Items
        html.find(".nav-tabs .tab-selector").on("click", (event) => {
            const tabIndex = U.pInt($(event.currentTarget).data("tab"));
            const numItems = Object.values(self.tabs ?? [])[tabIndex].length;
            const width = U.pInt(150 * Math.ceil(Math.sqrt(numItems)));
            eLog.checkLog3("nav", "Nav Tab Size Recalculation", { tabIndex, numItems, width });
            this.render(false, { width });
        });
        // ~ Item Control
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
        html.find("input").on({ change: () => this.updateConsequenceDialog(html) });
        html.find("select").on({ change: () => this.updateConsequenceDialog(html) });
        html.find('[data-action^="ai-query"]').on({ click: (event) => this.queryAI(event) });
        html.find('[data-action^="gm-select-toggle"]').on({ click: (event) => this.selectResistOption(event) });
    }
}
export default BladesDialog;
