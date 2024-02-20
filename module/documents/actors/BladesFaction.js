import { BladesActorType } from "../../core/constants.js";
import { BladesActor } from "../BladesActorProxy.js";
import BladesFactionSheet from "../../sheets/actor/BladesFactionSheet.js";
import BladesClockKey from "../../classes/BladesClockKey.js";
class BladesFaction extends BladesActor {
    // #region INITIALIZATION ~
    static async Initialize() {
        Object.assign(globalThis, { BladesFaction, BladesFactionSheet });
        Actors.registerSheet("blades", BladesFactionSheet, { types: ["faction"], makeDefault: true });
        return loadTemplates(["systems/eunos-blades/templates/faction-sheet.hbs"]);
    }
    // #endregion
    static get All() {
        return new Collection(super.GetTypeWithTags(BladesActorType.faction)
            .map((faction) => [faction.id, faction]));
    }
    static IsType(doc) {
        return super.IsType(doc, BladesActorType.faction);
    }
    // #region BladesRoll Implementation
    // #region BladesRoll.OppositionDoc Implementation
    get rollOppID() { return this.id; }
    get rollOppDoc() { return this; }
    get rollOppImg() { return this.img ?? ""; }
    get rollOppName() { return this.name ?? ""; }
    get rollOppSubName() { return this.system.subtitle || this.system.concept || " "; }
    get rollOppType() { return this.type; }
    get rollOppModsSchemaSet() { return []; }
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
        await game.eunoblades.ClockKeys.get(clockKeyID)?.delete(game.eunoblades.ClockKeys);
    }
}
export default BladesFaction;
