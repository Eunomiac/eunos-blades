
import BladesActor from "../../blades-actor.js";
import BladesSheet from "./blades-sheet.js";
import {BladesActorType} from "../../core/constants.js";

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
    if (!BladesActor.IsType(this.actor, BladesActorType.faction)) { return context }
    const sheetData: Partial<BladesActorSchema.Faction> & BladesActorDataOfType<BladesActorType.faction> = {
      clocks: Object.fromEntries(Object.entries(this.actor.system.clocks).map(([clockNum, clockData], i) => [
        clockNum,
        {
          display: clockData?.display ?? "",
          value: clockData?.value ?? 0,
          max: clockData?.max ?? 0,
          isVisible: true,
          isNameVisible: false,
          isActive: false,
          color: "white",
          target: `system.clocks.${i+1}.value`,
          gm_notes: clockData?.gm_notes ?? ""
        }
      ])) as Record<number, BladesClockData>,
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