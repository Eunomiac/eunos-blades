import G, {ApplyTooltipListeners} from "./core/gsap.js";
import U from "./core/utilities.js";
import BladesActor from "./blades-actor.js";
import BladesItem from "./blades-item.js";

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

class BladesSelectorDialog extends Dialog {

  static override get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["eunos-blades", "sheet", "dialog"],
      template: "systems/eunos-blades/templates/dialog.hbs",
      width: "auto",
      height: "auto",
      tabs: [{navSelector: ".nav-tabs", contentSelector: ".tab-content", initial: "front"}]
    });
  }

  static Initialize() {
    return loadTemplates([
      "systems/eunos-blades/templates/dialog.hbs"
    ]);
  }

  static async Display(
    parent: BladesActor,
    title: string,
    docType: "Actor"|"Item",
    tabs: Record<string, BladesActor[]|BladesItem[]>,
    tags?: string[]
  ) {
    // eLog.checkLog("BladesSelectorDialog.Display()", {parent, title, tabs});
    const app = new BladesSelectorDialog({
      parent,
      title,
      docType,
      tabs,
      "tags": tags?.filter((tag): tag is BladesTag => tag !== ""),
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

    return app.hasItems ? app.render(true, {width: app.width}) : undefined;
  }

  get hasItems() {
    return Object.values(this.tabs).some((tabItems) => tabItems.length > 0);
  }
  parent: BladesActor;
  tabs: Record<string, BladesActor[]|BladesItem[]>;
  tags: BladesTag[] = [];
  width: number;
  docType: "Actor"|"Item";

  constructor(data: BladesDialog.Data, options?: Partial<BladesDialog.Options>) {
    super(data, options);

    const validTabs: string[] = [];
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
    this.parent = data.parent;
    this.tabs = data.tabs;
    this.tags = data.tags ?? [];
    this.width = 150 * Math.ceil(Math.sqrt(Object.values(data.tabs)[0].length));
  }

  override getData() {
    const data = super.getData() as BladesDialog.Data;
    // eLog.checkLog4("dialog", "[BladesDialog] super.getData()", {...data});
    data.title = this.title;
    data.tabs = this.tabs;
    data.docType = this.docType;
    data.tags = this.tags;

    // eLog.checkLog("dialog", "[BladesDialog] return getData()", {...data});
    return data;
  }

  override activateListeners(html: JQuery<HTMLElement>) {
    super.activateListeners(html);

    const self = this;

    //~ Changing Width on Tab Change Depending on Number of Items
    html.find(".nav-tabs .tab-selector").on("click", (event) => {
      const tabIndex = U.pInt($(event.currentTarget).data("tab"));
      const numItems = Object.values(self.tabs)[tabIndex].length;
      const width = U.pInt(150 * Math.ceil(Math.sqrt(numItems)));
      eLog.checkLog3("nav", "Nav Tab Size Recalculation", {tabIndex, numItems, width});
      this.render(false, {width});
    });

    //~ Tooltips
    ApplyTooltipListeners(html);

    //~ Item Control
    html.find("[data-item-id]").on("click", function() {
      if ($(this).parent().hasClass("locked")) { return }
      const docId = $(this).data("itemId");
      const docType = $(this).data("docType");
      eLog.checkLog("dialog", "[BladesDialog] on Click", {elem: this, docId, docType, parent: self.parent});
      if (docType === "Actor") {
        self.parent.addSubActor(docId, self.tags);
      } else if (docType === "Item") {
        self.parent.addSubItem(docId);
      }
      self.close();
    });
  }
}

export default BladesSelectorDialog;