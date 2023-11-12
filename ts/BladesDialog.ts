import {ApplyTooltipListeners} from "./core/gsap";
import U from "./core/utilities";
import BladesActor from "./BladesActor";
import BladesItem from "./BladesItem";
import BladesRoll from "./BladesRoll";
import C, {RollResult, ConsequenceType, AttributeTrait} from "./core/constants";
import BladesAI, {AGENTS} from "./core/ai";

// eslint-disable-next-line no-shadow
export enum SelectionCategory {
  Heritage = "Heritage",
  Background = "Background",
  Vice = "Vice",
  Playbook = "Playbook",
  Reputation = "Reputation",
  Preferred_Op = "Preferred_Op",
  Gear = "Gear",
  Ability = "Ability",
  Faction = "Faction",
  Upgrade = "Upgrade",
  Cohort_Gang = "Cohort_Gang",
  Cohort_Expert = "Cohort_Expert",
  Feature = "Feature",
  Stricture = "Stricture",
  VicePurveyor = "VicePurveyor",
  Acquaintance = "Acquaintance",
  Friend = "Friend",
  Rival = "Rival",
  Crew = "Crew",
  Member = "Member",
  Contact = "Contact"
}

// eslint-disable-next-line no-shadow
export enum BladesDialogType {
  Selection = "Selection",
  Consequence = "Consequence"
}

class BladesDialog extends Dialog {

  static override get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["eunos-blades", "sheet", "dialog"],
      width: "auto",
      height: "auto",
      tabs: [{navSelector: ".nav-tabs", contentSelector: ".tab-content", initial: "front"}]
    });
  }

  static Initialize() {
    return loadTemplates([
      "systems/eunos-blades/templates/dialog-selection.hbs",
      "systems/eunos-blades/templates/dialog-consequence.hbs"
    ]);
  }

  static async DisplaySelectionDialog(
    parent: BladesActor,
    title: string,
    docType: "Actor"|"Item",
    tabs: Record<string, BladesActor[]|BladesItem[]>,
    tags?: string[]
  ) {

    const app = new BladesDialog({
      parent,
      title,
      docType,
      tabs,
      tags: tags?.filter((tag): tag is BladesTag => tag !== ""),
      content: "",
      buttons: {
        cancel: {
          icon: '<i class="fas fa-times"></i>',
          label: game.i18n.localize("Cancel"),
          callback: (html: JQuery|HTMLElement) => {
            eLog.checkLog3("dialog", "Callback Scope", {this: this, html});
            return false;
          }
        }
      },
      default: "cancel"
    });

    return app.hasItems ? app.render(true, {width: app.width}) : undefined;
  }

  static async DisplayRollConsequenceDialog(rollInst: BladesRoll) {

    const app: BladesDialog = new BladesDialog({
      parent: rollInst,
      title: "Consequences",
      dialogType: BladesDialogType.Consequence,
      content: "",
      buttons: {
        apply: {
          icon: '<i class="fa-solid fa-arrow-down-to-arc"></i>',
          label: "Apply",
          callback: (html: HTMLElement|JQuery<HTMLElement>) => (app as BladesDialog)
            .writeToRollInstance(html as JQuery<HTMLElement>)
        },
        cancel: {
          icon: '<i class="fas fa-times"></i>',
          label: game.i18n.localize("Cancel"),
          callback: (html: JQuery|HTMLElement) => {
            eLog.checkLog3("dialog", "Callback Scope", {this: app, html});
            return false;
          }
        }
      },
      default: "apply"
    }, {classes: ["eunos-blades", "sheet", "dialog", "consequence-dialog"]});

    return app._render(true, {width: app.width}).then(() => eLog.checkLog3("dialog", "Dialog Instance", {this: app}));
  }

  override get template() {
    if (this.dialogType === BladesDialogType.Selection) {
      return "systems/eunos-blades/templates/dialog-selection.hbs";
    }
    return "systems/eunos-blades/templates/dialog-consequence.hbs";
  }

  get hasItems() {
    return Object.values(this.tabs ?? []).some((tabItems) => tabItems.length > 0);
  }

  parent: BladesActor|BladesRoll;

  tabs?: Record<string, BladesActor[]|BladesItem[]>;

  dialogType: BladesDialogType;

  tags: BladesTag[] = [];

  width: number;

  docType?: "Actor"|"Item";

  csqData: {
    [RollResult.partial]: Record<
      string,
      BladesRoll.ConsequenceData
    >,
    [RollResult.fail]: Record<
      string,
      BladesRoll.ConsequenceData
    >
  } = {[RollResult.partial]: {}, [RollResult.fail]: {}};

  constructor(data: BladesDialog.Data, options?: Partial<BladesDialog.Options>) {
    super(data, options);

    this.dialogType = data.dialogType ?? BladesDialogType.Selection;
    this.parent = data.parent;
    this.width = 500;

    switch (this.dialogType) {
      case BladesDialogType.Selection: this.constructSelectionData(data/* , options */); return;
      case BladesDialogType.Consequence: this.constructConsequenceData(data/* , options */); return;
      default: throw new Error(`Unrecognized type for BladesDialog constructor: '${this.dialogType}'`);
    }
  }

  constructSelectionData(data: BladesDialog.Data/* , options?: Partial<BladesDialog.Options> */) {
    const validTabs: string[] = [];
    if (!data.tabs) { return; }
    for (const [tabName, tabItems] of Object.entries(data.tabs)) {
      if (tabItems.length === 0) {
        delete data.tabs[tabName];
      } else {
        validTabs.push(tabName);
      }
    }

    if (validTabs.length === 1 && !("Main" in data.tabs)) {
      data.tabs.Main = [...data.tabs[validTabs[0]]] as BladesActor[]|BladesItem[];
      delete data.tabs[validTabs[0]];
    }

    this.docType = data.docType;
    this.tabs = data.tabs;
    this.tags = data.tags ?? [];
    this.width = 150 * Math.ceil(Math.sqrt(Object.values(data.tabs)[0].length));
  }

  constructConsequenceData(data: BladesDialog.Data/* , options?: Partial<BladesDialog.Options> */) {
    eLog.checkLog3("dialog", "constructConsequenceData", {incoming: data});
    if (this.parent instanceof BladesRoll) {
      this.csqData = U.objMerge({
        [RollResult.partial]: {
          0: {name: "", type: "", attribute: ""},
          1: {name: "", type: "", attribute: ""},
          2: {name: "", type: "", attribute: ""}
        },
        [RollResult.fail]: {
          0: {name: "", type: "", attribute: ""},
          1: {name: "", type: "", attribute: ""},
          2: {name: "", type: "", attribute: ""}
        }
      }, this.parent.getFlagVal<{
        [RollResult.partial]: Record<
          string,
          BladesRoll.ConsequenceData
        >,
        [RollResult.fail]: Record<
          string,
          BladesRoll.ConsequenceData
        >
      }>("consequenceData") ?? {}) as {
        [RollResult.partial]: Record<
          string,
          BladesRoll.ConsequenceData
        >,
        [RollResult.fail]: Record<
          string,
          BladesRoll.ConsequenceData
        >
      };
      this._consequenceAI = new BladesAI(AGENTS.ConsequenceAdjuster);
    }
  }

  override getData() {
    const data = super.getData() as BladesDialog.Data;

    switch (this.dialogType) {
      case BladesDialogType.Selection: return this.prepareSelectionData(data);
      case BladesDialogType.Consequence: return this.prepareConsequenceData(data);
      default: return null as never;
    }
  }

  prepareSelectionData(data: BladesDialog.Data) {
    data.title = this.title;
    data.tabs = this.tabs;
    data.docType = this.docType;
    data.tags = this.tags;

    return data;
  }

  prepareConsequenceData(data: BladesDialog.Data) {
    eLog.checkLog3("dialog", "updateConsequenceDialog() this.csqData", this.csqData);
    eLog.checkLog3("dialog", "prepareConsequenceData", {incoming: data});
    data.consequenceData = this.csqData;
    data.consequenceTypeOptions = this.consequenceTypeOptions;
    data.consequenceTypeOptionsAll = Object.entries(C.ConsequenceDisplay)
      .map(([cType, cDisplay]) => ({value: cType, display: cDisplay}));
    data.consequenceAttributeOptions = [
      {value: AttributeTrait.insight, display: "Insight"},
      {value: AttributeTrait.prowess, display: "Prowess"},
      {value: AttributeTrait.resolve, display: "Resolve"}
    ];
    eLog.checkLog3("dialog", "prepareConsequenceData", {outgoing: data});
    return data;
  }

  get consequenceTypeOptions(): {
    [RollResult.partial]: Array<BladesSelectOption<string, ConsequenceType>>,
    [RollResult.fail]: Array<BladesSelectOption<string, ConsequenceType>>
    } {
    if (this.parent instanceof BladesRoll) {
      return {
        [RollResult.partial]: C.Consequences[this.parent.finalPosition][RollResult.partial]
          .map((cType) => ({value: cType, display: C.ConsequenceDisplay[cType]})),
        [RollResult.fail]: C.Consequences[this.parent.finalPosition][RollResult.fail]
          .map((cType) => ({value: cType, display: C.ConsequenceDisplay[cType]}))
      };
    }
    return {} as never;
  }

  updateConsequenceDialog(html: JQuery<HTMLElement|HTMLInputElement>, isRendering = true) {

    /** Expected Output:
     * returnData = {
     *    [RollResult.partial]: {
     *      0: {
     *        name: "Broken Leg",
     *        type: "ProwessHarm3",
     *        icon: "system/...",
     *        attribute: "prowess",
     *        resistOptions: {
     *          0: {name: "Sprained Knee", type: "ProwessHarm2", isSelected: false},
     *          1: {name: "Twisted Ankle", type: "ProwessHarm2", isSelected: false},
     *          2: {name: "Bruised Femur", type: "ProwessHarm2", isSelected: true}
     *        }
     *      },
     *      1: { / ... / },
     *      2: { / ... / }
     *    },
     *    [RollResult.fail]: { / ... / }
     * } */

    // const returnData: {
    //   [RollResult.partial]: Record<
    //     string,
    //     BladesRoll.ConsequenceData
    //   >,
    //   [RollResult.fail]: Record<
    //     string,
    //     BladesRoll.ConsequenceData
    //   >
    // } = {[RollResult.partial]: {}, [RollResult.fail]: {}};

    [RollResult.partial, RollResult.fail].forEach((rollResult) => {
      for (let i = 0; i < 3; i++) {
        const thisCsqData: BladesRoll.ConsequenceData = {
          type: (html.find(`[data-flag-target="rollCollab.consequenceData.${rollResult}.${i}.type"]`)[0] as HTMLSelectElement).value as ConsequenceType,
          attribute: (html.find(`[data-flag-target="rollCollab.consequenceData.${rollResult}.${i}.attribute"]`)[0] as HTMLSelectElement).value as AttributeTrait,
          name: (html.find(`[data-flag-target="rollCollab.consequenceData.${rollResult}.${i}.name"]`)[0] as HTMLInputElement).value,
          resistOptions: this.csqData[rollResult as RollResult.partial|RollResult.fail][i]
            .resistOptions ?? {}
        };
        if (thisCsqData.type) {
          thisCsqData.icon = C.ConsequenceIcons[thisCsqData.type];
        }
        const resistOptionElems = Array.from(html.find(`input[type="text"][data-flag-target="rollCollab.consequenceData.${rollResult}.${i}.resistOptions`)) as HTMLInputElement[];
        eLog.checkLog3("dialog", "...resistOptionElems", {html, resistOptionElems, thisCsqData });
        if (resistOptionElems.length > 0) {
          for (let j = 0; j < resistOptionElems.length; j++) {
            thisCsqData.resistOptions ??= {};
            thisCsqData.resistOptions[j] = {
              name: resistOptionElems[i].value,
              type: (html.find(`[data-flag-target="rollCollab.consequenceData.${rollResult}.${i}.resistOptions.${j}.type"]`)[0] as HTMLSelectElement).value as ConsequenceType,
              isSelected: (html.find(`[data-flag-target="rollCollab.consequenceData.${rollResult}.${i}.resistOptions.${j}.isSelected"]`)[0] as HTMLInputElement).checked
            };
          }
        }
        this.csqData[rollResult as RollResult.partial|RollResult.fail][i] = thisCsqData;
      }
    });
    eLog.checkLog3("dialog", "updateConsequenceDialog() this.csqData", this.csqData);
    if (isRendering) {
      this.render();
    }
  }

  async writeToRollInstance(html: JQuery<HTMLElement>) {
    if (this.parent instanceof BladesRoll) {
      this.updateConsequenceDialog(html, false);
      await this.parent.setFlagVal("consequenceData", this.csqData);
    }
  }

  _consequenceAI?: BladesAI;

  async queryAI(event: ClickEvent) {
    // If the AI generator has not been initialized, do so.
    if (!this._consequenceAI) {
      this._consequenceAI = new BladesAI(AGENTS.ConsequenceAdjuster);
    }

    // Get the name of the consequence.
    const dataAction = event.currentTarget.dataset.action;
    if (dataAction && dataAction.startsWith("ai-query")) {
      const [rollResult, csqIndex] = dataAction.split(/-/).slice(2);
      const csqName: string|undefined = this.csqData[rollResult as RollResult.partial|RollResult.fail][csqIndex]?.name;
      if (csqName) {
        const response = await this._consequenceAI?.query(csqName, csqName);
        if (response) {
          this.addResistanceOptions(rollResult as RollResult.partial|RollResult.fail, csqIndex, response.split("|"));
        }
      }
    }
  }

  async setFlagVal(target: string, value: unknown) {
    if (this.parent instanceof BladesRoll) {
      return this.parent.setFlagVal(target, value, false);
    }
  }

  async addResistanceOptions(rollResult: RollResult, cIndex: string, rOptions: string[]) {
    const cData = this.csqData[rollResult as RollResult.partial|RollResult.fail][cIndex];
    if (!cData) { return; }
    const cType = cData.type as keyof typeof C["ResistedConsequenceTypes"];
    const rType = C.ResistedConsequenceTypes[cType] ?? undefined;
    const resistOptions: Record<string, BladesRoll.ConsequenceResisted> = {};
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
    this.csqData[rollResult as RollResult.partial|RollResult.fail][cIndex].resistOptions = resistOptions;
    eLog.checkLog3("dialog", "addResistanceOptions() this.csqData", this.csqData);
    this.render();
  }

  async selectResistOption(event: ClickEvent) {
    eLog.checkLog3("dialog", "Clicked Resistance Option", event);
    const dataAction = event.currentTarget.dataset.action;
    if (dataAction && dataAction.startsWith("gm-select-toggle")) {
      const [rollResult, csqIndex, resIndex] = dataAction.split(/-/).slice(3);
      eLog.checkLog3("dialog", "... Action Passed", {rollResult, csqIndex, resIndex});
      // Get resistance options for this consequence
      const resOptions = this.csqData[rollResult as RollResult.partial|RollResult.fail][csqIndex].resistOptions ?? {};

      // Toggle clicked resistance option
      resOptions[resIndex].isSelected = !resOptions[resIndex].isSelected;

      // If resistance option is now selected, deselect other options
      if (resOptions[resIndex].isSelected) {
        Object.keys(resOptions)
          .filter((key) => key !== resIndex)
          .forEach((key) => { resOptions[key].isSelected = false; });
      }

      // Assign new resistance options to instance.
      this.csqData[rollResult as RollResult.partial|RollResult.fail][csqIndex].resistOptions = resOptions;
      this.render();
    }
  }

  override activateListeners(html: JQuery<HTMLElement>) {
    super.activateListeners(html);

    // ~ Tooltips
    ApplyTooltipListeners(html);

    switch (this.dialogType) {
      case BladesDialogType.Selection: this.activateSelectionListeners(html); break;
      case BladesDialogType.Consequence: this.activateConsequenceListeners(html); break;
    }
  }

  activateSelectionListeners(html: JQuery<HTMLElement>) {
    const self = this;

    // ~ Changing Width on Tab Change Depending on Number of Items
    html.find(".nav-tabs .tab-selector").on("click", (event) => {
      const tabIndex = U.pInt($(event.currentTarget).data("tab"));
      const numItems = Object.values(self.tabs ?? [])[tabIndex].length;
      const width = U.pInt(150 * Math.ceil(Math.sqrt(numItems)));
      eLog.checkLog3("nav", "Nav Tab Size Recalculation", {tabIndex, numItems, width});
      this.render(false, {width});
    });


    // ~ Item Control
    html.find("[data-item-id]").on("click", function() {
      if ($(this).parent().hasClass("locked")) { return; }
      const docId = $(this).data("itemId");
      const docType = $(this).data("docType");
      eLog.checkLog("dialog", "[BladesDialog] on Click", {elem: this, docId, docType, parent: self.parent});
      if (self.parent instanceof BladesActor) {
        if (docType === "Actor") {
          self.parent.addSubActor(docId, self.tags);
        } else if (docType === "Item") {
          self.parent.addSubItem(docId);
        }
      }
      self.close();
    });

  }

  activateConsequenceListeners(html: JQuery<HTMLElement>) {
    html.find("input").on({blur: () => this.updateConsequenceDialog(html)});
    html.find("select").on({change: () => this.updateConsequenceDialog(html)});
    html.find('[data-action^="ai-query"]').on({click: (event) => this.queryAI(event) });
    html.find('[data-action^="gm-select-toggle"]').on({click: (event) => this.selectResistOption(event) });
  }
}

export default BladesDialog;
