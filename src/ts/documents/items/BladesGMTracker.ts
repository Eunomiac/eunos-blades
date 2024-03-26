import BladesItem from "../../BladesItem";
import {BladesActorType, BladesItemType, BladesPhase} from "../../core/constants";
import BladesActor from "../../BladesActor";

class BladesGMTracker extends BladesItem implements BladesItemSubClass.Gm_Tracker {

  public static async Initialize() {
    const tracker: BladesGMTracker|undefined = game.items
      .find((item): item is BladesGMTracker => BladesItem.IsType(item, BladesItemType.gm_tracker));
    if (tracker) {
      game.eunoblades.Tracker = tracker;
    } else {
      game.eunoblades.Tracker = (await BladesGMTracker.create({
        name: "GM Tracker",
        type: "gm_tracker",
        img:  "systems/eunos-blades/assets/icons/misc-icons/gm-tracker.svg"
      })) as BladesGMTracker;
    }
  }

  get phase(): BladesPhase { return this.system.phase ?? BladesPhase.Freeplay; }
  set phase(phase: BladesPhase) {
    this.update({"system.phase": phase});
  }

  override prepareDerivedData() {
    this.system.phases = Object.values(BladesPhase);
  }

  // #region OVERRIDES: prepareDerivedData, _onUpdate
  override async _onUpdate(...args: Parameters<typeof BladesActor.prototype.callOnUpdate>) {
    await super.callOnUpdate(...args);
    BladesActor.GetTypeWithTags(BladesActorType.pc).forEach((actor) => actor.render());
  }
  // #endregion

}

declare interface BladesGMTracker {
  type: BladesItemType.gm_tracker,
  system: BladesItemSchema.Gm_Tracker
}


export default BladesGMTracker;
