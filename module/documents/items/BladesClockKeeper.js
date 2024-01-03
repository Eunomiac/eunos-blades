/* eslint-disable @typescript-eslint/no-unused-vars */
import U from "../../core/utilities.js";
import { BladesItem } from "../BladesItemProxy.js";
import BladesClockKey from "../../classes/BladesClocks.js";
class BladesClockKeeper extends BladesItem {
    static async Initialize() {
        const clockKeeper = game.items.find((item) => item.type === "clock_keeper");
        if (!clockKeeper) {
            game.eunoblades.ClockKeeper = (await BladesClockKeeper.create({
                name: "Clock Keeper",
                type: "clock_keeper",
                img: "systems/eunos-blades/assets/icons/misc-icons/clock-keeper.svg"
            }));
        }
        else {
            game.eunoblades.ClockKeeper = clockKeeper;
        }
        return loadTemplates([
            "systems/eunos-blades/templates/parts/clock-sheet-key-controls.hbs",
            "systems/eunos-blades/templates/parts/clock-sheet-clock-controls.hbs"
        ]);
    }
    showClockKeyControls(keyID) {
        if (this.sheet?.element) {
            // Find the key controls row, flip it over to controls row.
        }
    }
    hideClockKeyControls(keyID) {
        if (this.sheet?.element) {
            // Find the key controls row, flip it back to minimal summary
        }
    }
    // #region CLOCKS OVERLAY
    get clockKeys() { return this.getSceneKeys(); }
    get currentScene() { return game.scenes?.current?.id; }
    get currentSceneID() {
        if (!game.scenes?.current) {
            throw new Error("[BladesClockKeeper.currentScene] Error retrieving 'game.scenes.current'.");
        }
        return game.scenes.current.id;
    }
    get targetSceneID() { return this.system.targetScene ?? this.currentSceneID; }
    get keys() {
        return new Collection(Object.entries(this.system.clocksData ?? {})
            .map(([id, data]) => [
            id,
            game.eunoblades.ClockKeys.get(id) ?? new BladesClockKey(data)
        ]));
    }
    getSceneKeys(sceneID) {
        sceneID ??= this.targetSceneID;
        return new Collection(this.keys
            .filter((clockKey) => clockKey.sceneIDs.includes(sceneID))
            .map((clockKey) => [clockKey.id, clockKey]));
    }
    flipControlPanel(clockKey) {
        const clockKeyFlipper$ = this.sheet?.element?.find(`[data-clock-key-id="${clockKey.id}"]`);
        if (!clockKeyFlipper$) {
            return;
        }
        if (clockKey.isVisible && clockKey.isInCurrentScene) {
            U.gsap.effects.keyControlPanelFlip(clockKeyFlipper$, { angle: 0 })
                .then(() => clockKey.updateTarget("isVisible", false));
        }
        else {
            U.gsap.effects.keyControlPanelFlip(clockKeyFlipper$, { angle: 180 })
                .then(() => clockKey.updateTarget("isVisible", true));
        }
    }
    async addClockKey(clockKeyConfig = {}) {
        if (!clockKeyConfig.sceneIDs?.length) {
            clockKeyConfig.sceneIDs = [this.targetSceneID];
        }
        const key = await BladesClockKey.Create({
            target: this,
            targetKey: "system.clocksData",
            ...clockKeyConfig
        });
        super.update({});
        return key;
    }
    async deleteClockKey(keyID) {
        await game.eunoblades.ClockKeys.get(keyID)?.delete();
    }
    async addClockToKey(keyID, clockData) {
        const key = await game.eunoblades.ClockKeys.get(keyID);
        if (!key) {
            return;
        }
        await key.addClock(clockData);
    }
    async deleteClockFromKey(keyID, clockID) {
        const key = await game.eunoblades.ClockKeys.get(keyID);
        if (!key) {
            return;
        }
        await key.deleteClock(clockID);
    }
    // #endregion
    // #region OVERRIDES: prepareDerivedData, _onUpdate
    prepareDerivedData() {
        super.prepareDerivedData();
        this.system.targetScene ??= game.scenes.current?.id || null;
    }
    async _onUpdate(changed, options, userId) {
        super._onUpdate(changed, options, userId);
        // BladesActor.GetTypeWithTags(BladesActorType.pc).forEach((actor) => actor.render());
        // socketlib.system.executeForEveryone("renderOverlay");
    }
}
export default BladesClockKeeper;
