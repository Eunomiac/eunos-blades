import BladesItem from "../../BladesItem.js";
import { BladesActorType, BladesItemType, BladesPhase } from "../../core/constants.js";
import BladesActor from "../../BladesActor.js";
/*~ @@DOUBLE-BLANK@@ ~*/
class BladesGMTracker extends BladesItem {
    /*~ @@DOUBLE-BLANK@@ ~*/
    get phase() { return BladesItem.IsType(this, BladesItemType.gm_tracker) && this.system.phase; }
    set phase(phase) {
        if (phase && BladesItem.IsType(this, BladesItemType.gm_tracker)) {
            this.update({ "system.phase": phase });
        }
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    prepareDerivedData() {
        this.system.phases = Object.values(BladesPhase);
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    // #region OVERRIDES: prepareDerivedData, _onUpdate
    async _onUpdate(changed, options, userId) {
        await super._onUpdate(changed, options, userId);
        BladesActor.GetTypeWithTags(BladesActorType.pc).forEach((actor) => actor.render());
    }
}
/*~ @@DOUBLE-BLANK@@ ~*/
export default BladesGMTracker;
