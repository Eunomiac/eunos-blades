import { SVGDATA, BladesItemType } from "../../core/constants.js";
import { BladesItem } from "../BladesItemProxy.js";
import BladesClock, { BladesClockKey, ApplyClockListeners } from "../../classes/BladesClock.js";
class BladesClockKeeper extends BladesItem {
    // #region CLOCKS OVERLAY
    _overlayElement;
    get overlayElement() {
        this._overlayElement ??= $("#clocks-overlay")[0];
        if (!this._overlayElement) {
            $("body.vtt.game.system-eunos-blades").append("<section id=\"clocks-overlay\"></section>");
            [this._overlayElement] = $("#clocks-overlay");
        }
        return this._overlayElement;
    }
    async renderOverlay() {
        if (!game.scenes?.current) {
            return;
        }
        const { ClockKeeper: keeper } = game.eunoblades;
        if (!keeper) {
            return;
        }
        const { overlayElement } = keeper;
        eLog.checkLog3("clocksOverlay", "[ClocksOverlay] RenderOverlay", overlayElement);
        if (!overlayElement) {
            eLog.error("clocksOverlay", "[ClocksOverlay] Cannot locate overlay element.");
            return;
        }
        // Re-render the overlay element
        overlayElement.innerHTML = await renderTemplate("systems/eunos-blades/templates/overlays/clock-overlay.hbs", keeper);
        // Reactivate event listeners
        keeper.activateOverlayListeners();
    }
    get clockKeys() { return this.getSceneKeys(); }
    get currentScene() { return game.scenes?.current?.id; }
    get svgData() { return SVGDATA; }
    async activateOverlayListeners() {
        if (!game?.user?.isGM) {
            return;
        }
        eLog.checkLog3("clocksOverlay", "[activateOverlayListeners] Keys", this.keys);
        ApplyClockListeners($("#clocks-overlay"), "ClocksOverlay");
        $("#clocks-overlay").find(".key-label").on({
            click: async (event) => {
                if (!event.currentTarget) {
                    return;
                }
                if (!BladesItem.IsType(game.eunoblades.ClockKeeper, BladesItemType.clock_keeper)) {
                    return;
                }
                event.preventDefault();
                const clockKey = game.eunoblades.ClockKeys.get($(event.currentTarget).data("keyId"));
                if (clockKey && clockKey.elem) {
                    await clockKey.toggleActive();
                }
            },
            contextmenu: () => {
                if (!game.user.isGM) {
                    return;
                }
                game.eunoblades.ClockKeeper?.sheet?.render(true);
            }
        });
    }
    get currentSceneID() {
        if (!game.scenes?.current) {
            throw new Error("[BladesClockKeeper.currentScene] Error retrieving 'game.scenes.current'.");
        }
        return game.scenes.current.id;
    }
    get targetSceneID() { return this.system.targetScene ?? this.currentSceneID; }
    get keys() {
        return new Collection(Object.entries(this.system.clocksData.keys ?? {})
            .map(([id, data]) => [
            id,
            game.eunoblades.ClockKeys.get(id) ?? new BladesClockKey(data)
        ]));
    }
    get clocks() {
        return new Collection(Object.entries(this.system.clocksData.clocks ?? {})
            .sort((a, b) => a[1].index - b[1].index)
            .map(([id, data]) => [
            id,
            game.eunoblades.Clocks.get(id) ?? new BladesClock(data)
        ]));
    }
    getSceneClocks(sceneID) {
        sceneID ??= this.targetSceneID;
        return new Collection(this.clocks
            .filter((clock) => clock.sceneID === sceneID)
            .map((clock) => [clock.id, clock]));
    }
    getSceneKeys(sceneID) {
        sceneID ??= this.targetSceneID;
        return new Collection(this.keys
            .filter((clockKey) => clockKey.sceneID === sceneID)
            .map((clockKey) => [clockKey.id, clockKey]));
    }
    addClockKey(clockKeyConfig = {}, clocksData = {}) {
        if (!(game.eunoblades.ClockKeeper instanceof BladesClockKeeper)) {
            return undefined;
        }
        if (!this.targetSceneID && !clockKeyConfig.sceneID) {
            return undefined;
        }
        return BladesClockKey.Create({
            sceneID: this.targetSceneID,
            target: this,
            targetKey: "system.clocksData.keys",
            ...clockKeyConfig
        }, clocksData);
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
        socketlib.system.executeForEveryone("renderOverlay");
    }
}
export default BladesClockKeeper;
