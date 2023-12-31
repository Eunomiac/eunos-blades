import { BladesActor } from "../BladesActorProxy.js";
import BladesClockKey from "../../classes/BladesClocks.js";
class BladesFaction extends BladesActor {
    // #region BladesRoll Implementation
    // #region BladesRoll.OppositionDoc Implementation
    get rollOppID() { return this.id; }
    get rollOppDoc() { return this; }
    get rollOppImg() { return this.img ?? ""; }
    get rollOppName() { return this.name ?? ""; }
    get rollOppSubName() { return this.system.subtitle || this.system.concept || " "; }
    get rollOppType() { return this.type; }
    get rollOppModsData() { return []; }
    // #endregion
    // #endregion
    // _clocks: Collection<BladesClock> = new Collection();
    // get clocks(): Collection<BladesClock> = {
    //   return new Collection()
    // }
    get clocks() {
        return new Collection(Object.entries(this.system.clocksData ?? {})
            .map(([id, data]) => [
            id,
            game.eunoblades.ClockKeys.get(id) ?? new BladesClockKey(data)
        ]));
    }
    async addClock() {
        return await BladesClockKey.Create({
            target: this,
            targetKey: "system.clocksData"
        });
    }
    async deleteClock(clockKeyID) {
        await game.eunoblades.ClockKeys.get(clockKeyID)?.delete();
    }
}
export default BladesFaction;
