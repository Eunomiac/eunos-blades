import BladesItem from "../../BladesItem.js";
import { BladesActorType, BladesItemType, BladesPhase } from "../../core/constants.js";
import BladesActor from "../../BladesActor.js";
class BladesGMTracker extends BladesItem {
    static async Initialize() {
        const tracker = game.items
            .find((item) => BladesItem.IsType(item, BladesItemType.gm_tracker));
        if (tracker) {
            game.eunoblades.Tracker = tracker;
        }
        else {
            game.eunoblades.Tracker = (await BladesGMTracker.create({
                name: "GM Tracker",
                type: "gm_tracker",
                img: "systems/eunos-blades/assets/icons/misc-icons/gm-tracker.svg"
            }));
        }
    }
    get phase() { return this.system.phase ?? BladesPhase.Freeplay; }
    set phase(phase) {
        this.update({ "system.phase": phase });
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
