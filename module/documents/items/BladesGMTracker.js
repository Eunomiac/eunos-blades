import BladesItem from "../../BladesItem.js";
import { BladesActorType, BladesItemType, BladesPhase } from "../../core/constants.js";
import BladesActor from "../../BladesActor.js";
class BladesGMTracker extends BladesItem {
    get phase() { return BladesItem.IsType(this, BladesItemType.gm_tracker) && this.system.phase; }
    set phase(phase) {
        if (phase && BladesItem.IsType(this, BladesItemType.gm_tracker)) {
            this.update({ "system.phase": phase });
        }
    }
    prepareDerivedData() {
        this.system.phases = Object.values(BladesPhase);
    }
    // #region OVERRIDES: prepareDerivedData, _onUpdate
    async _onUpdate(...args) {
        await super.callOnUpdate(...args);
        BladesActor.GetTypeWithTags(BladesActorType.pc).forEach((actor) => actor.render());
    }
}
export default BladesGMTracker;
