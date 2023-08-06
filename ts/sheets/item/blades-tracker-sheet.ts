
import {BladesActorType, BladesItemType, BladesPhase} from "../../core/constants.js";
import BladesItemSheet from "./blades-item-sheet.js";
import BladesItem from "../../blades-item.js";

export enum BladesTipContext {
  DiceRoll = "DiceRoll",
  Combat = "Combat",
  General = "General"
}
class BladesTipGenerator {

  static get Tips() {
    return {
      [BladesTipContext.DiceRoll]: [],
      [BladesTipContext.Combat]: [
        "Every combat encounter should advance the main plot, or else it's filler.",
        "Inject dialogue into combat encounters, especially from important adversaries.",
        "Combat encounters should be a challenge, but not a slog. Don't be afraid to end them early.",
        "Infiltrate/Rescue/Destroy: Use these as additional/secondary goals in combat encounters.",
        "Tell the next player in the initiative order that they're on deck.",
        "Don't trigger combats automatically: Use alternate objectives to incite the players to fight, giving them agency.",
        "Add another layer by drawing focus to collateral effects of the combat: a fire, a hostage, a collapsing building, innocents in danger"
      ],
      [BladesTipContext.General]: [
        "Rolling the dice always means SOMETHING happens.",
        "Jump straight to the action; don't waste time on establishing scenes or filler.",
        "Invoke elements of characters' backstories or beliefs to make any scene more personal."

      ]
    };
  }

  private tipContext: BladesTipContext;
  constructor(tipContext: BladesTipContext) {
    this.tipContext = tipContext;
  }


}
// declare interface BladesTrackerSheet {
//   get type(): BladesItemType.gm_tracker,
//   parent: null,
//   system: BladesItem["system"] & {
//     game_phase: BladesPhase;
//   }
// }
class BladesTrackerSheet extends BladesItemSheet {

  static Get() { return game.eunoblades.Tracker as BladesItemOfType<BladesItemType.gm_tracker> }

  static override get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["eunos-blades", "sheet", "item", "gm-tracker"],
      template: "systems/eunos-blades/templates/items/gm_tracker-sheet.hbs",
      width: 700,
      height: 970
    });
  }

  static async Initialize() {
    game.eunoblades ??= {};
    Items.registerSheet("blades", BladesTrackerSheet, {types: ["gm_tracker"], makeDefault: true});
    Hooks.once("ready", async () => {
      let tracker: BladesItem|undefined = game.items.find((item) => item.type === "gm_tracker");
      if (!(tracker instanceof BladesItem)) {
        tracker = (await BladesItem.create({
          name: "GM Tracker",
          type: "gm_tracker",
          img: "systems/eunos-blades/assets/icons/misc-icons/gm-tracker.svg"
        })) as BladesItem;
      }
      game.eunoblades.Tracker = tracker;
    });
    return loadTemplates([
      "systems/eunos-blades/templates/items/gm_tracker-sheet.hbs"
    ]);
  }

  // override getData() {
  //   const context: any = super.getData() as ReturnType<BladesItemSheet["getData"]> & {system: any}

  //   context.system.phases = Object.values(BladesPhase);

  //   return context;
  // }

  override async activateListeners(html: JQuery<HTMLElement>) {
    super.activateListeners(html);

  }

  override async _onSubmit(event: Event, params: List<any> = {}) {
    const submitData = await super._onSubmit(event, params);
    game.actors.filter((actor) => actor.type === BladesActorType.pc)
      .forEach((actor) => actor.sheet?.render());
    return submitData;
  }

}

export default BladesTrackerSheet;