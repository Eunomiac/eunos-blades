import { SVGDATA, BladesActorType, BladesItemType } from "../../core/constants.js";
import U from "../../core/utilities.js";
import BladesActor from "../../BladesActor.js";
import { BladesItem } from "../BladesItemProxy.js";
import BladesClock, { BladesClockKey } from "./BladesClock.js";
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
        if (!game.eunoblades.ClockKeeper) {
            return;
        }
        if (!game.eunoblades.ClockKeeper.overlayElement) {
            eLog.error("clocksOverlay", "[ClocksOverlay] Cannot locate overlay element.");
            return;
        }
        game.eunoblades.ClockKeeper.overlayElement.innerHTML = (await getTemplate("systems/eunos-blades/templates/overlays/clock-overlay.hbs"))({
            ...game.eunoblades.ClockKeeper.system,
            currentScene: game.scenes?.current.id,
            svgData: SVGDATA
        });
        game.eunoblades.ClockKeeper.activateOverlayListeners();
    }
    async activateOverlayListeners() {
        if (!game?.user?.isGM) {
            return;
        }
        BladesClock.ApplyClockListeners($("#clocks-overlay"));
        $("#clocks-overlay").find(".key-label").on({
            click: async (event) => {
                if (!event.currentTarget) {
                    return;
                }
                if (!BladesItem.IsType(game.eunoblades.ClockKeeper, BladesItemType.clock_keeper)) {
                    return;
                }
                event.preventDefault();
                const clockKey = this.getClockKey($(event.currentTarget).data("keyId"));
                if (clockKey) {
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
    get targetSceneID() { return this.system.targetScene; }
    _clocksData = { keys: {}, clocks: {} };
    getClockKey(keyID) {
        if (!this._clocksData.keys[keyID]) {
            if (!this.system.clocksData.keys?.[keyID]) {
                return undefined;
            }
            this._clocksData.keys[keyID] = new BladesClockKey(this.system.clocksData.keys[keyID]);
        }
        return this._clocksData.keys[keyID];
    }
    async addClockKey() {
        if (!BladesItem.IsType(game.eunoblades.ClockKeeper, BladesItemType.clock_keeper)) {
            return undefined;
        }
        if (!this.targetSceneID) {
            return undefined;
        }
        const clockKey = await BladesClockKey.Create({
            id: randomID(),
            target: this,
            targetKey: "system.clocksData.keys"
        });
        const sceneClockIDs = this.system.scenes?.[this.targetSceneID]?.clockIDs ?? [];
        sceneClockIDs.push(clockKey.id);
        await this.update({ [`system.scenes.${this.targetSceneID}.clockIDs`]: sceneClockIDs });
        this._clocksData.keys[clockKey.id] = clockKey;
        return clockKey;
    }
    async deleteClockKey(keyID) {
        if (!BladesItem.IsType(game.eunoblades.ClockKeeper, BladesItemType.clock_keeper)) {
            return undefined;
        }
        await this.getClockKey(keyID)?.delete();
    }
    async setKeySize(keyID, keySize = 1) {
        keySize = U.pInt(keySize);
        if (keySize < 1 || keySize > 6) {
            throw new Error("[BladesClockKey.setKeySize] Key sizes must be between 1 and 6.");
        }
        this.getClockKey(keyID)?.setKeySize(keySize);
    }
    // #endregion
    // #region OVERRIDES: prepareDerivedData, _onUpdate
    prepareDerivedData() {
        super.prepareDerivedData();
        this.system.targetScene ??= game.scenes.current?.id || null;
    }
    async _onUpdate(changed, options, userId) {
        super._onUpdate(changed, options, userId);
        BladesActor.GetTypeWithTags(BladesActorType.pc).forEach((actor) => actor.render());
        socketlib.system.executeForEveryone("renderOverlay");
    }
}
export default BladesClockKeeper;
