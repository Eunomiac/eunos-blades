import U from "../../core/utilities.js";
import {BladesActorType, BladesItemType, BladesPhase, Tag} from "../../core/constants.js";
import BladesItemSheet from "./blades-item-sheet.js";
import BladesItem from "../../blades-item.js";
import BladesGMTracker from "../../documents/items/blades-gm-tracker.js";
import BladesActor from "../../blades-actor.js";
import BladesPC from "../../documents/actors/blades-pc.js";
import BladesNPC from "../../documents/actors/blades-npc.js";
import BladesFaction from "../../documents/actors/blades-faction.js";
import BladesCrew from "../../documents/actors/blades-crew.js";


export enum BladesTipContext {
  DiceRoll = "DiceRoll",
  Combat = "Combat",
  General = "General"
}

type OnSubmitEvent = Event & {
  result: Promise<Record<string,string|number|boolean>>
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
class BladesScoreSheet extends BladesItemSheet {

  static override get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["eunos-blades", "sheet", "item", "score-sheet"],
      template: "systems/eunos-blades/templates/items/score-sheet.hbs",
      width: 900,
      height: 970
    });
  }


  override getData() {
    const context = super.getData() as ReturnType<BladesItemSheet["getData"]> & {system: BladesItemSystem};

    const sheetData: Partial<BladesItemDataOfType<BladesItemType.score>> = {};

    sheetData.playerCharacters = BladesActor.GetTypeWithTags(BladesActorType.pc, Tag.PC.ActivePC)
      .map((pc) => {
        return Object.assign(
          pc,
          {
            actionData: Object.fromEntries(Object.entries(pc.system.attributes)
              .map(([attrName, attrData]) => {
                return [
                  attrName,
                  Object.fromEntries(Object.entries(attrData)
                    .map(([actionName, actionData]) => {
                      return [
                        U.uCase(actionName).slice(0, 3),
                        actionData
                      ];
                    }))
                ];
              }))
          }
        );
      });

    return {
      ...context,
      ...sheetData
    } as BladesItemSheetData;
  }


  override async activateListeners(html: JQuery<HTMLElement>) {
    super.activateListeners(html);

  }

  override async _onSubmit(event: OnSubmitEvent, params: List<any> = {}) {
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
        // no default
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
        // no default
      }
    }
    if (isForcingRender) {
      game.actors.filter((actor) => actor.type === BladesActorType.pc)
        .forEach((actor) => actor.sheet?.render());
    }
    return submitData;
  }

}

export default BladesScoreSheet;