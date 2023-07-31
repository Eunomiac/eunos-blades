
import BladesSheet from "./blades-sheet.js";

class BladesFactionSheet extends BladesSheet {

  static override get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["eunos-blades", "sheet", "actor", "faction"],
      template: "systems/eunos-blades/templates/faction-sheet.hbs",
      width: 900,
      height: "auto",
      tabs: [{navSelector: ".nav-tabs", contentSelector: ".tab-content", initial: "overview"}]
    }) as ActorSheet.Options;
  }

  override getData() {
    const context = super.getData() as ReturnType<BladesSheet["getData"]>;

    const sheetData: Partial<BladesActorSchema.Faction> & BladesSheetData.Faction = {
      clocks: this.actor.system.clocks,
      tierData: {
        "class": "comp-tier comp-vertical comp-teeth",
        "label": "Tier",
        "labelClass": "filled-label full-width",
        "dotline": {
          data: this.actor.system.tier,
          target: "system.tier.value",
          svgKey: "teeth.tall",
          svgFull: "full|half|frame",
          svgEmpty: "full|half|frame"
        }
      }
    };

    return {
      ...context,
      ...sheetData
    };
  }

  override activateListeners(html: JQuery<HTMLElement>) {
    super.activateListeners(html);

    // Everything below here is only needed if the sheet is editable
    if (!this.options.editable) {return}

    // Update Inventory Item
    html.find(".item-body").on("click", (event) => {
      const element = $(event.currentTarget).parents(".item");
      const item = this.actor.items.get(element.data("itemId"));
      item?.sheet?.render(true);
    });

  }
}

export default BladesFactionSheet;