import BladesActor from "../../BladesActor.js";
import BladesClock from "../items/BladesClock.js";
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
        return new Collection(Object.entries(this.system.clocks ?? {})
            .sort((a, b) => a[1].index - b[1].index)
            .map(([id, data]) => [
            id,
            game.eunoblades.Clocks.get(id) ?? new BladesClock(data)
        ]));
    }
    async addClock() {
        return await BladesClock.Create({
            target: this,
            targetKey: "system.clocks",
            index: this.clocks.size
        });
    }
    async deleteClock(clockID) {
        await game.eunoblades.Clocks.get(clockID)?.delete();
    }
}
export default BladesFaction;
