/* eslint-disable @typescript-eslint/no-unused-vars */
import {BladesActorType, BladesItemType, BladesPhase} from "../../core/constants";
import BladesItemSheet from "./BladesItemSheet";
import BladesItem from "../../BladesItem";
import BladesGMTracker from "../../documents/items/BladesGMTracker";
import BladesActor from "../../BladesActor";
import BladesPC from "../../documents/actors/BladesPC";


export enum BladesTipContext {
  DiceRoll = "DiceRoll",
  Combat = "Combat",
  General = "General"
}

type OnSubmitEvent = Event & {
  result: Promise<Record<string, string|number|boolean>>
}

class BladesTipGenerator {

  static Test(pcActor: unknown): BladesPC|undefined {
    if (BladesActor.IsType(pcActor, BladesActorType.pc)) {
      return pcActor;
    }
    return undefined;
  }

  testActor: BladesActorOfType<BladesActorType.pc> = new BladesPC({name: "blah", type: "pc"});

  static get Tips() {
    return {
      [BladesTipContext.DiceRoll]: [],
      [BladesTipContext.Combat]:   [
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

class BladesGMTrackerSheet extends BladesItemSheet {

  // static Get() { return game.eunoblades.Tracker as BladesGMTracker; }

  static override get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes:  ["eunos-blades", "sheet", "item", "gm-tracker"],
      template: "systems/eunos-blades/templates/items/gm_tracker-sheet.hbs",
      width:    700,
      height:   970
    });
  }

  static async Initialize() {
    Items.registerSheet("blades", BladesGMTrackerSheet, {types: ["gm_tracker"], makeDefault: true});
    return loadTemplates([
      "systems/eunos-blades/templates/items/gm_tracker-sheet.hbs"
    ]);
  }

  override async activateListeners(html: JQuery<HTMLElement>) {
    super.activateListeners(html);
  }

  override async _onSubmit(event: OnSubmitEvent, params: List<unknown> = {}) {
    const prevPhase = this.item.system.phase;
    const submitData = await super._onSubmit(event, params);
    const newPhase = this.item.system.phase;
    let isForcingRender = true;
    if (prevPhase !== newPhase) {
      switch (prevPhase) {
        case BladesPhase.CharGen: {

          break;
        }
        case BladesPhase.Freeplay: {

          break;
        }
        case BladesPhase.Score: {
          isForcingRender = false;
          game.actors.filter((actor): actor is BladesPC => BladesActor.IsType(actor, BladesActorType.pc))
            .forEach((actor) => actor.clearLoadout());
          break;
        }
        case BladesPhase.Downtime: {

          break;
        }
        default: break;
      }
      switch (newPhase) {
        case BladesPhase.CharGen: {

          break;
        }
        case BladesPhase.Freeplay: {

          break;
        }
        case BladesPhase.Score: {

          break;
        }
        case BladesPhase.Downtime: {

          break;
        }
        default: break;
      }
    }
    if (isForcingRender) {
      game.actors.filter((actor) => actor.type === BladesActorType.pc)
        .forEach((actor) => actor.sheet?.render());
    }
    return submitData;
  }

}

export default BladesGMTrackerSheet;
export {BladesTipGenerator};
