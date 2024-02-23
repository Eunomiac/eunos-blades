/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApplyTooltipAnimations } from "../core/gsap.js";
import U from "../core/utilities.js";
import { BladesActor } from "../documents/BladesActorProxy.js";
import BladesItem from "../BladesItem.js";
import BladesRoll from "./BladesRoll.js";
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
    BladesDialogType["Input"] = "Input";
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
            "systems/eunos-blades/templates/dialog-input.hbs",
            "systems/eunos-blades/templates/parts/dialog-consequence-block.hbs"
        ]);
    }
    static async DisplaySimpleInputDialog(parent, prompt, target, flagTarget) {
        const app = new BladesDialog({
            parent,
            title: parent instanceof BladesRoll ? "Roll Input" : `${parent.name}: Input`,
            dialogType: BladesDialogType.Input,
            content: "",
            prompt,
            target,
            flagTarget,
            buttons: {
                apply: {
                    icon: '<i class="fa-solid fa-arrow-down-to-arc"></i>',
                    label: "Apply",
                    callback: (html) => app
                    //   .writeToRollInstance(html as JQuery<HTMLElement>)
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
        }, { classes: ["eunos-blades", "sheet", "dialog", "simple-input-dialog"] });
        return app._render(true, { width: app.width }).then(() => eLog.checkLog3("dialog", "Input Dialog Instance", { this: app }));
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
    // static async DisplayRollConsequenceDialog(rollInst: BladesRoll) {
    // const app: BladesDialog = new BladesDialog({
    //   parent: rollInst,
    //   title: "Consequences",
    //   dialogType: BladesDialogType.Consequence,
    //   content: "",
    //   buttons: {
    //     apply: {
    //       icon: '<i class="fa-solid fa-arrow-down-to-arc"></i>',
    //       label: "Apply",
    //       callback: (html: HTMLElement|JQuery<HTMLElement>) => (app as BladesDialog)
    //         .writeToRollInstance(html as JQuery<HTMLElement>)
    //     },
    //     cancel: {
    //       icon: '<i class="fas fa-times"></i>',
    //       label: game.i18n.localize("Cancel"),
    //       callback: (html: JQuery|HTMLElement) => {
    //         eLog.checkLog3("dialog", "Callback Scope", {this: app, html});
    //         return false;
    //       }
    //     }
    //   },
    //   default: "apply"
    // }, {classes: ["eunos-blades", "sheet", "dialog", "consequence-dialog"]});
    // return app._render(true, {width: app.width}).then(() => eLog.checkLog3("dialog", "Dialog Instance", {this: app}));
    // }
    get template() { return `systems/eunos-blades/templates/dialog-${U.lCase(this.dialogType)}.hbs`; }
    get hasItems() {
        return Object.values(this.tabs ?? []).some((tabItems) => tabItems.length > 0);
    }
    parent;
    tabs;
    dialogType;
    tags = [];
    width;
    docType;
    // csqData?: Record<
    // Position,
    // Record<
    //   RollResult.partial|RollResult.fail,
    //   Record<
    //     string,
    //     BladesRoll.ConsequenceData
    //     >
    //   >
    // >;
    prompt;
    target;
    flagTarget;
    constructor(data, options) {
        super(data, options);
        this.dialogType = data.dialogType ?? BladesDialogType.Selection;
        this.parent = data.parent;
        this.width = options?.width ?? 500;
        this.prompt = data.prompt;
        this.target = data.target;
        this.flagTarget = data.flagTarget;
        switch (this.dialogType) {
            case BladesDialogType.Input: return;
            case BladesDialogType.Selection:
                this.constructSelectionData(data /* , options */);
                return;
            // case BladesDialogType.Consequence: this.csqData = this.constructConsequenceData(data/* , options */); return;
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
    // constructConsequenceData(data: BladesDialog.Data/* , options?: Partial<BladesDialog.Options> */) {
    //   eLog.checkLog3("dialog", "constructConsequenceData", {incoming: {...data}});
    //   if (!(this.parent instanceof BladesRoll)) { throw new Error("Cannot call 'constructConsequenceData' without a rollInst parent!"); }
    //   // Get existing consequence data, if any, on roll instance
    //   const rollCsqData = this.parent.data.consequenceData ?? {};
    //   // Extend consequence data by applying new blank consequence instances,
    //   //   so at least three csq entries are available for each position/result combination
    //   (Object.values(Position) as Position[]).forEach((rollPos: Position) => {
    //     rollCsqData[rollPos] ??= {
    //       [RollResult.partial]: {},
    //       [RollResult.fail]: {}
    //     };
    //     ([RollResult.partial, RollResult.fail] as const).forEach((rollResult: RollResult.partial|RollResult.fail) => {
    //       rollCsqData[rollPos] ??= {};
    //       rollCsqData[rollPos][rollResult] ??= {};
    //       while (Object.values(rollCsqData[rollPos][rollResult as RollResult.partial|RollResult.fail]).length < 3) {
    //         const blankCsqData: BladesConsequence.Data = {
    //           id: randomID() as IDString,
    //           name: "",
    //           type: "",
    //           attribute: ""
    //         };
    //         rollCsqData[rollPos][rollResult as RollResult.partial|RollResult.fail][blankCsqData.id] = blankCsqData;
    //       }
    //     });
    //   });
    //   this._consequenceAI = new BladesAI(AGENTS.ConsequenceAdjuster);
    //   return rollCsqData;
    // }
    getData() {
        const data = super.getData();
        switch (this.dialogType) {
            case BladesDialogType.Input: return this.prepareInputData(data);
            case BladesDialogType.Selection: return this.prepareSelectionData(data);
            // case BladesDialogType.Consequence: return this.prepareConsequenceData(data);
            default: return null;
        }
    }
    prepareInputData(data) {
        data.prompt = this.prompt;
        data.target = this.target;
        data.flagTarget = this.flagTarget;
        return data;
    }
    prepareSelectionData(data) {
        data.title = this.title;
        data.tabs = this.tabs;
        data.docType = this.docType;
        data.tags = this.tags;
        return data;
    }
    // prepareConsequenceData(data: BladesDialog.Data) {
    //   eLog.checkLog3("dialog", "prepareConsequenceData this.csqData", {...this.csqData});
    //   eLog.checkLog3("dialog", "prepareConsequenceData", {incoming: {...data}});
    //   data.consequenceData = this.csqData;
    //   data.consequenceTypeOptions = this.consequenceTypeOptions;
    //   data.consequenceTypeOptionsAll = Object.keys(C.ConsequenceDisplay)
    //     .map((cType) => ({value: cType, display: cType}));
    //   data.consequenceAttributeOptions = [
    //     {value: AttributeTrait.insight, display: "Insight"},
    //     {value: AttributeTrait.prowess, display: "Prowess"},
    //     {value: AttributeTrait.resolve, display: "Resolve"}
    //   ];
    //   eLog.checkLog3("dialog", "prepareConsequenceData", {outgoing: {...data}});
    //   return data;
    // }
    // get consequenceTypeOptions(): Record<
    //   Position,
    //   Record<
    //     RollResult.partial|RollResult.fail,
    //     Array<BladesSelectOption<string, ConsequenceType>>
    //   >
    //   > {
    //   if (this.parent instanceof BladesRoll) {
    //     const returnData: Partial<Record<
    //     Position,
    //     Record<
    //       RollResult.partial|RollResult.fail,
    //       Array<BladesSelectOption<string, ConsequenceType>>
    //     >
    //   >> = {};
    //     [Position.controlled, Position.risky, Position.desperate].forEach((pos) => {
    //       returnData[pos] = {
    //         [RollResult.partial]: C.Consequences[pos][RollResult.partial]
    //           .map((cType) => ({value: cType, display: cType})),
    //         [RollResult.fail]: C.Consequences[pos][RollResult.fail]
    //           .map((cType) => ({value: cType, display: cType}))
    //       };
    //     });
    //     return returnData as Record<
    //     Position,
    //     Record<
    //       RollResult.partial|RollResult.fail,
    //       Array<BladesSelectOption<string, ConsequenceType>>
    //     >
    //   >;
    //   }
    //   return {} as never;
    // }
    updateInputText(inputElem$) {
        const value = inputElem$.val();
        if (this.parent instanceof BladesRoll) {
            const flagTarget = inputElem$.data("flagTarget");
            eLog.checkLog3("dialog", "updateInputText", { value, flagTarget });
            this.parent.updateTarget(flagTarget, value)
                .then(() => this.parent.renderRollCollab_SocketCall());
        }
        else if (this.parent instanceof BladesItem || this.parent instanceof BladesActor) {
            this.parent.update({ [inputElem$.data("target")]: inputElem$.val() });
        }
    }
    // updateConsequenceType(csqElem$: JQuery<HTMLElement>, cData: BladesConsequence.Data) {
    //   const type$ = csqElem$.find(".roll-consequence-type-select") as JQuery<HTMLSelectElement>;
    //   const typeVal = type$.val() as string|undefined;
    //   if (typeVal && typeVal in ConsequenceType) {
    //     cData.type = typeVal as ConsequenceType;
    //     cData.icon = C.ConsequenceIcons[cData.type];
    //     cData.typeDisplay = C.ConsequenceDisplay[cData.type];
    //   }
    // }
    // updateConsequenceAttribute(csqElem$: JQuery<HTMLElement>, cData: BladesConsequence.Data) {
    //   if (/Insight/.exec(cData.type)) { cData.attribute = AttributeTrait.insight; }
    //   else if (/Prowess/.exec(cData.type)) { cData.attribute = AttributeTrait.prowess; }
    //   else if (/Resolve/.exec(cData.type)) { cData.attribute = AttributeTrait.resolve; }
    //   else {
    //     const attribute$ = csqElem$.find(".roll-consequence-attribute-select") as JQuery<HTMLSelectElement>;
    //     const attrVal = attribute$.val() as AttributeTrait|undefined;
    //     if (attrVal) {
    //       cData.attribute = attrVal;
    //     }
    //   }
    // }
    // updateConsequenceAttributeVal(cData: BladesConsequence.Data) {
    //   if (this.parent.rollPrimaryDoc instanceof BladesPC) {
    //     cData.attributeVal = this.parent.rollPrimaryDoc.attributes[cData.attribute as AttributeTrait];
    //   } else if (this.parent.rollPrimaryDoc?.parent instanceof BladesPC) {
    //     cData.attributeVal = this.parent.rollPrimaryDoc.parent.attributes[cData.attribute as AttributeTrait];
    //   } else {
    //     eLog.error(`Unable to get attribute from rollPrimaryDoc '${this.parent.rollPrimaryDoc?.name}' of type '${this.parent.rollPrimaryDoc?.rollPrimaryType}' (may need to log via flags if either of the previous show 'undefined'.`);
    //   }
    // }
    // getSelectedResistOption(cData: BladesConsequence.Data): BladesConsequence|false {
    //   return cData.resistTo
    //     ? new BladesConsequence(cData.resistTo)
    //     : false;
    // }
    // updateConsequenceResist(csqElem$: JQuery<HTMLElement>, cData: BladesConsequence.Data) {
    //   const resistOptions: Record<string, BladesRoll.ConsequenceResistOption> = cData.resistOptions ?? {};
    //   // If consequence is already minimal, toggle resistNegates to true and set 'resistTo' to None-type
    //   const minimalCsqTypes = Object.entries(C.ResistedConsequenceTypes)
    //     .filter(([_, rCsqType]) => rCsqType === ConsequenceType.None)
    //     .map(([csqType]) => csqType as ConsequenceType);
    //   if (minimalCsqTypes.includes(cData.type as ConsequenceType)) {
    //     cData.resistNegates = true;
    //     const noneCsq = BladesConsequence.None;
    //     cData.resistOptions = {[noneCsq.id]: noneCsq};
    //     cData.resistTo = noneCsq;
    //     return;
    //   } else {
    //     // Clear 'resistTo' (will be redetermined below)
    //     delete cData.resistTo;
    //     delete cData.resistNegates;
    //     csqElem$.find(".consequence-resist-option").each((_, elem) => {
    //       const resCsqID = $(elem).data("csq-id");
    //       resistOptions[resCsqID] ??= {id: resCsqID, name: "", type: undefined, isSelected: false};
    //       // Update Resistance Option Type
    //       const resType$ = $(elem).find(".roll-consequence-type-select") as JQuery<HTMLSelectElement>;
    //       const resTypeVal = resType$.val() as string|undefined;
    //       if (resTypeVal && resTypeVal in ConsequenceType) {
    //         resistOptions[resCsqID].type = resTypeVal as ConsequenceType;
    //         resistOptions[resCsqID].icon = C.ConsequenceIcons[resistOptions[resCsqID].type as ConsequenceType];
    //         resistOptions[resCsqID].typeDisplay = C.ConsequenceDisplay[resistOptions[resCsqID].type as ConsequenceType];
    //       }
    //       // Update Resistance Option Name
    //       const resName$ = $(elem).find(".consequence-name") as JQuery<HTMLInputElement>;
    //       const resNameVal = resName$.val();
    //       resistOptions[resCsqID].name = resNameVal ?? "";
    //       // If this is selected, update 'resistTo' data as well
    //       if (resistOptions[resCsqID].isSelected) {
    //         cData.resistTo = resistOptions[resCsqID];
    //       }
    //     });
    //   }
    //   cData.resistOptions = resistOptions;
    // }
    // updateConsequenceArmorResist(_csqElem$: JQuery<HTMLElement>, cData: BladesConsequence.Data) {
    //   // If consequence is already minimal, toggle armorNegates to true and set 'armorTo' to None-type
    //   const minimalCsqTypes = Object.entries(C.ResistedConsequenceTypes)
    //     .filter(([_, rCsqType]) => rCsqType === ConsequenceType.None)
    //     .map(([csqType]) => csqType as ConsequenceType);
    //   if (minimalCsqTypes.includes(cData.type as ConsequenceType)) {
    //     cData.armorNegates = true;
    //     cData.armorTo = BladesConsequence.None;
    //   } else {
    //     delete cData.armorNegates;
    //     cData.armorTo = this.getSelectedResistOption(cData);
    //   }
    // }
    // updateConsequenceSpecialArmorResist(_csqElem$: JQuery<HTMLElement>, cData: BladesConsequence.Data) {
    //   // If consequence is already minimal, toggle specialArmorNegates to true and set 'specialTo' to None-type
    //   const minimalCsqTypes = Object.entries(C.ResistedConsequenceTypes)
    //     .filter(([_, rCsqType]) => rCsqType === ConsequenceType.None)
    //     .map(([csqType]) => csqType as ConsequenceType);
    //   if (minimalCsqTypes.includes(cData.type as ConsequenceType)) {
    //     cData.specialArmorNegates = true;
    //     cData.specialTo = BladesConsequence.None;
    //   } else {
    //     delete cData.specialArmorNegates;
    //     cData.specialArmorNegates ??= false;
    //     cData.specialTo = this.getSelectedResistOption(cData);
    //   }
    // }
    // updateConsequenceData(
    //   html: JQuery<HTMLElement|HTMLInputElement>,
    //   cData: BladesConsequence.Data
    // ) {
    //   const csqElem$ = html.find(`.roll-consequence-row[data-csq-id='${cData.id}']`);
    //   // Update Type
    //   this.updateConsequenceType(csqElem$, cData);
    //   // Update Name
    //   if (cData.type === ConsequenceType.None) {
    //     cData.name = "";
    //   } else {
    //     const name$ = csqElem$.find(".consequence-name") as JQuery<HTMLInputElement>;
    //     const nameVal = name$.val();
    //     cData.name = nameVal ?? "";
    //   }
    //   // Update Resistance Attribute
    //   this.updateConsequenceAttribute(csqElem$, cData);
    //   this.updateConsequenceAttributeVal(cData);
    //   // Update Resistance Options
    //   this.updateConsequenceResist(csqElem$, cData);
    //   // Update Armor Options
    //   if ((<BladesRoll> this.parent).canResistWithArmor(cData)) {
    //     cData.isDisplayingArmorToggle = true;
    //     this.updateConsequenceArmorResist(csqElem$, cData);
    //   } else {
    //     cData.isDisplayingArmorToggle = false;
    //   }
    //   // Update Special Armor Options
    //   if ((<BladesRoll> this.parent).canResistWithSpecialArmor(cData)) {
    //     cData.isDisplayingSpecialArmorToggle = true;
    //     this.updateConsequenceSpecialArmorResist(csqElem$, cData);
    //   } else {
    //     cData.isDisplayingSpecialArmorToggle = false;
    //   }
    //   return cData;
    // }
    // updateConsequenceDialog(html: JQuery<HTMLElement|HTMLInputElement>, isRendering = true) {
    //   if (!(this.parent instanceof BladesRoll)) { return; }
    //   if (!this.csqData) { return; }
    //   eLog.checkLog3("dialog", "updateConsequenceDialog() this.csqData INCOMING", {...this.csqData});
    //   const {csqData} = this;
    //   const {rollPrimaryDoc} = this.parent;
    //   if (!(rollPrimaryDoc instanceof BladesPC)) { return; }
    //   (Object.keys(csqData) as Position[]).forEach((rollPos) => {
    //     const positionCsqData = csqData[rollPos];
    //     (Object.keys(csqData[rollPos]) as [RollResult.partial, RollResult.fail]).forEach((rollResult) => {
    //       positionCsqData[rollResult] = U.objMap(
    //         positionCsqData[rollResult],
    //         (cData: BladesConsequence.Data) => this.updateConsequenceData(html, cData)
    //       );
    //     });
    //     csqData[rollPos] = positionCsqData;
    //   });
    //   this.csqData = csqData;
    //   eLog.checkLog3("dialog", "updateConsequenceDialog() this.csqData OUTGOING", {...this.csqData});
    //   if (isRendering) {
    //     this.render();
    //   }
    // }
    // async writeToRollInstance(html: JQuery<HTMLElement>) {
    // if (this.parent instanceof BladesRoll) {
    // this.updateConsequenceDialog(html, false);
    // await this.parent.updateTarget("consequenceData", this.csqData);
    // }
    // }
    // _consequenceAI?: BladesAI;
    // getCsqDataFromElem(elem: HTMLElement, paramCount = 3): string[] {
    //   const dataAction = elem.dataset.action;
    //   if (dataAction) {
    //     const params = dataAction.split(/-/).reverse().slice(0, paramCount);
    //     return params.reverse();
    //   }
    //   return [];
    // }
    // async queryAI(event: ClickEvent) {
    //   if (!this.csqData) { return; }
    //   // If the AI generator has not been initialized, do so.
    //   if (!this._consequenceAI) {
    //     this._consequenceAI = new BladesAI(AGENTS.ConsequenceAdjuster);
    //   }
    //   const [rollPosition, rollResult, csqID] = this.getCsqDataFromElem(event.currentTarget);
    //   const csqName: string|undefined =
    //     this.csqData[rollPosition as Position][rollResult as RollResult.partial|RollResult.fail][csqID]?.name;
    //   if (csqName) {
    //     const response = await this._consequenceAI?.query(csqName, csqName);
    //     if (response) {
    //       this.refreshResistanceOptions(rollPosition as Position, rollResult as RollResult.partial|RollResult.fail, csqID, response.split("|"));
    //     }
    //   }
    // }
    // async spawnBlankResistOption(event: ClickEvent) {
    //   if (!this.csqData) { return; }
    //   const [rollPosition, rollResult, csqID] = this.getCsqDataFromElem(event.currentTarget);
    //   const rCsqID = randomID() as IDString;
    //   this.csqData[rollPosition as Position][rollResult as RollResult.partial|RollResult.fail][csqID]
    //     .resistOptions = {
    //       [rCsqID]: {
    //         id: rCsqID,
    //         name: "",
    //         type: undefined,
    //         isSelected: true
    //       }
    //     };
    //   this.render();
    // }
    // async setFlagVal(target: string, value: unknown) {
    //   if (this.parent instanceof BladesRoll) {
    //     await this.parent.updateTarget(target, value);
    //   }
    // }
    // async refreshResistanceOptions(rollPosition: Position, rollResult: RollResult, cID: string, rOptions: string[]) {
    //   if (!this.csqData) { return; }
    //   const cData = this.csqData[rollPosition][rollResult as RollResult.partial|RollResult.fail][cID];
    //   if (!cData) { return; }
    //   const cType = cData.type as keyof typeof C["ResistedConsequenceTypes"];
    //   const rType = C.ResistedConsequenceTypes[cType] ?? undefined;
    //   const resistOptions: Record<string, BladesRoll.ConsequenceResistOption> = {};
    //   for (let i = 0; i < rOptions.length; i++) {
    //     const rID = randomID() as IDString;
    //     resistOptions[rID] = {
    //       id: rID,
    //       name: rOptions[i],
    //       isSelected: false
    //     };
    //     if (rType) {
    //       resistOptions[rID].type = rType;
    //       resistOptions[rID].typeDisplay = C.ConsequenceDisplay[rType];
    //       resistOptions[rID].icon = C.ConsequenceIcons[rType];
    //     }
    //   }
    //   this.csqData[rollPosition][rollResult as RollResult.partial|RollResult.fail][cID].resistOptions = resistOptions;
    //   eLog.checkLog3("dialog", "addResistanceOptions() this.csqData", {...this.csqData});
    //   this.render();
    // }
    // async selectResistOption(event: ClickEvent) {
    //   if (!this.csqData) { return; }
    //   const [rollPosition, rollResult, csqID, resID] = this.getCsqDataFromElem(event.currentTarget, 4);
    //   eLog.checkLog3("dialog", "... Action Passed", {rollResult, csqIndex: csqID, resIndex: resID});
    //   // Get consequence data
    //   const cData = this.csqData[rollPosition as Position][rollResult as RollResult.partial|RollResult.fail][csqID];
    //   cData.resistOptions ??= {};
    //   // Toggle clicked resistance option
    //   cData.resistOptions[resID].isSelected = !cData.resistOptions[resID].isSelected;
    //   // If resistance option is now selected...
    //   if (cData.resistOptions[resID].isSelected) {
    //     // ... deselect & hide other options
    //     Object.keys(cData.resistOptions)
    //       .filter((key) => key !== resID)
    //       .forEach((key) => {
    //         Object.assign(cData.resistOptions?.[key] ?? {}, {isSelected: false, isVisible: false});
    //       });
    //     // ... and set 'resistTo' to this consequence.
    //     cData.resistTo = cData.resistOptions[resID];
    //   } else {
    //     // Otherwise, set 'resistTo' to false...
    //     cData.resistTo = false;
    //     // ... and unhide other options.
    //     Object.keys(cData.resistOptions)
    //       .filter((key) => key !== resID)
    //       .forEach((key) => {
    //         Object.assign(cData.resistOptions?.[key] ?? {}, {isVisible: true});
    //       });
    //   }
    //   // Assign new cData instance.
    //   this.csqData[rollPosition as Position][rollResult as RollResult.partial|RollResult.fail][csqID] = cData;
    //   this.render();
    // }
    // async clearResistOptions(event: ContextMenuEvent) {
    //   if (!this.csqData) { return; }
    //   const [rollPosition, rollResult, csqID] = this.getCsqDataFromElem(event.currentTarget);
    //   this.csqData[rollPosition as Position][rollResult as RollResult.partial|RollResult.fail][csqID].resistOptions = {};
    //   this.render();
    // }
    // async toggleArmor(event: ClickEvent) {
    //   if (!this.csqData) { return; }
    //   const [rollPosition, rollResult, csqID] = this.getCsqDataFromElem(event.currentTarget);
    //   const cData = this.csqData[rollPosition as Position][rollResult as RollResult.partial|RollResult.fail][csqID];
    //   cData.canArmor = !cData.canArmor;
    //   this.render();
    // }
    // async toggleSpecialArmor(event: ClickEvent) {
    //   if (!this.csqData) { return; }
    //   const [rollPosition, rollResult, csqID] = this.getCsqDataFromElem(event.currentTarget);
    //   const cData = this.csqData[rollPosition as Position][rollResult as RollResult.partial|RollResult.fail][csqID];
    //   cData.canSpecialArmor = !cData.canSpecialArmor;
    //   this.render();
    // }
    activateListeners(html) {
        super.activateListeners(html);
        // ~ Tooltips
        ApplyTooltipAnimations(html);
        switch (this.dialogType) {
            case BladesDialogType.Input:
                this.activateInputListeners(html);
                break;
            case BladesDialogType.Selection:
                this.activateSelectionListeners(html);
                break;
            // case BladesDialogType.Consequence: {
            // this.activateConsequenceListeners(html);
            // Select --> updateConsequenceDialog -> updateConsequenceData(each csq)
            // break;
            // }
        }
    }
    activateInputListeners(html) {
        html.find("textarea").on({ change: (event) => this.updateInputText($(event.currentTarget)) });
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
    async close() {
        $("#eunos-blades-tooltips > *").remove();
        super.close();
    }
}
export default BladesDialog;
