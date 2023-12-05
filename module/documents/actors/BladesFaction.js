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
    _clocks = {};
    getClocks(isRefreshing = false) {
        const clockIDs = Object.keys(this.system.clocks);
        if (clockIDs.length === 0) {
            return {};
        }
        for (const clockID of clockIDs) {
            if (isRefreshing || !(clockID in this._clocks)) {
                this._clocks[clockID] = new BladesClock(this.system.clocks[clockID]);
            }
        }
        return this._clocks;
    }
    getClock(clockID) {
        return this.getClocks()[clockID];
    }
    async addClock() {
        const numClocks = Object.values(this.getClocks()).length;
        return await BladesClock.Create({
            id: randomID(),
            target: this,
            targetKey: "system.clocks",
            index: numClocks
        });
    }
    async deleteClock(clockID) {
        await this.getClock(clockID)?.delete();
        delete this._clocks[clockID];
    }
}
export default BladesFaction;
