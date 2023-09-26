import BladesItem from "../../BladesItem.js";
import {BladesActorType, BladesItemType, BladesPhase} from "../../core/constants.js";
import BladesActor from "../../BladesActor.js";

class BladesGMTracker extends BladesItem implements BladesItemSubClass.Gm_Tracker {

  get phase(): BladesPhase|false { return BladesItem.IsType(this, BladesItemType.gm_tracker) && this.system.phase }
  set phase(phase: BladesPhase|false) {
    if (phase && BladesItem.IsType(this, BladesItemType.gm_tracker)) {
      this.update({"system.phase": phase});
    }
  }

  override prepareDerivedData() {
    this.system.phases = Object.values(BladesPhase);
  }

  // #region OVERRIDES: prepareDerivedData, _onUpdate
  override async _onUpdate(changed: any, options: any, userId: string) {
    await super._onUpdate(changed, options, userId);
    BladesActor.GetTypeWithTags(BladesActorType.pc).forEach((actor) => actor.render());
  }
  // #endregion

}

declare interface BladesGMTracker {
  type: BladesItemType.gm_tracker,
  system: BladesItemSchema.Gm_Tracker
}


export default BladesGMTracker;