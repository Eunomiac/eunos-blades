/* ****▌███████████████████████████████████████████████████████████████████████████▐**** *\
|*     ▌█░░░░░░░░░ Euno's Blades in the Dark for Foundry VTT ░░░░░░░░░░░█▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░ by Eunomiac ░░░░░░░░░░░░░██████████████████▐     *|
|*     ▌█  License █ v0.1.0 ██▐     *|
|*     ▌████░░░░  ░░░░█████▐     *|
\* ****▌███████████████████████████████████████████████████████████████████████████▐**** */

import BladesItem from "../../blades-item.js";
import { BladesActorType, BladesItemType, BladesPhase } from "../../core/constants.js";
import BladesActor from "../../blades-actor.js";
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

    async _onUpdate(changed, options, userId) {
        await super._onUpdate(changed, options, userId);
        BladesActor.GetTypeWithTags(BladesActorType.pc).forEach((actor) => actor.render());
    }
}
export default BladesGMTracker;
//# sourceMappingURL=blades-gm-tracker.js.map