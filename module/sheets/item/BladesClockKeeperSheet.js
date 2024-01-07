/* eslint-disable @typescript-eslint/no-unused-vars */
import U from "../../core/utilities.js";
import BladesItemSheet from "./BladesItemSheet.js";
import { BladesPC, BladesFaction } from "../../documents/BladesActorProxy.js";
class BladesClockKeeperSheet extends BladesItemSheet {
    // static Get() { return game.eunoblades.ClockKeeper as BladesClockKeeper; }
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            classes: ["eunos-blades", "sheet", "item", "clock-keeper"],
            template: "systems/eunos-blades/templates/items/clock_keeper-sheet.hbs",
            width: 700,
            height: 970,
            tabs: [{ navSelector: ".nav-tabs", contentSelector: ".tab-content", initial: "scene-keys" }]
        });
    }
    static async Initialize() {
        Items.registerSheet("blades", BladesClockKeeperSheet, { types: ["clock_keeper"], makeDefault: true });
        return loadTemplates([
            "systems/eunos-blades/templates/items/clock_keeper-sheet.hbs"
        ]);
    }
    getData() {
        const context = super.getData();
        const sheetData = {
            sceneOptions: Array.from(game.scenes),
            sceneKeys: this.item.getSceneKeys(this.item.system.targetScene ?? game.scenes.current.id),
            pcsWithProjects: BladesPC.All.filter((pc) => pc.projects.length > 0),
            factions: Array.from(BladesFaction.All)
        };
        return { ...context, ...sheetData };
    }
    addKey(event) {
        event.preventDefault();
        this.item.addClockKey();
    }
    deleteKey(event) {
        event.preventDefault();
        const keyID = event.currentTarget.dataset.id;
        if (keyID) {
            this.item.deleteClockKey(keyID);
        }
    }
    async activateListeners(html) {
        super.activateListeners(html);
        html.find("[data-action=\"create-clock-key\"").on({
            click: async (event) => {
                event.preventDefault();
                await this.item.addClockKey();
                // Notify GM
            }
        });
        // #region Helper Functions to Retrieve Clock Keys & Clocks ~
        function getClockKeyFromEvent(event) {
            const id = $(event.currentTarget).data("keyId")
                || $(event.currentTarget).closest(".control-flipper").data("clockKeyId");
            if (!id) {
                throw new Error("No id found on element");
            }
            const clockKey = game.eunoblades.ClockKeys.get(id);
            if (!clockKey) {
                throw new Error(`Clock key with id ${id} not found`);
            }
            return clockKey;
        }
        function getClockFromEvent(event) {
            const clockKey = getClockKeyFromEvent(event);
            const clockID = $(event.currentTarget).data("clockId")
                || $(event.currentTarget).closest(".control-flipper").data("clockId");
            if (!clockID) {
                throw new Error("No clockID found on element");
            }
            const clock = clockKey.getClockByID(clockID);
            if (!clock) {
                throw new Error(`Clock with id ${clockID} not found`);
            }
            return [clockKey, clock];
        }
        // #endregion
        // #region Initializing Flip Control Panels ~
        const flipControls$ = html.find(".control-flipper");
        U.gsap.set(flipControls$.find(".controls-back"), {
            translateZ: -2,
            rotateX: 180,
            autoAlpha: 1
        });
        U.gsap.set(flipControls$.find(".controls-front"), {
            translateZ: 2,
            autoAlpha: 1
        });
        U.gsap.set(html.find(".control-flipper.controls-flipped"), {
            rotateX: 180
        });
        // #endregion
        // #region *** CLOCK KEYS *** ~
        const clockKeyControls$ = html.find(".clock-key-control-flipper");
        // #region isOnDisplay === TRUE OR FALSE (Conditional Animation Checks Required) ~
        clockKeyControls$.find("[data-action=\"toggle-name-visibility\"]").on({
            click: async (event) => {
                event.preventDefault();
                const clockKey = getClockKeyFromEvent(event);
                const isNameVisible = !clockKey.isNameVisible;
                clockKey.updateTarget("isNameVisible", isNameVisible);
                // If clockKey is on display (in scene & visible), sent out animation socket calls
                if (clockKey.isOnDisplay) {
                    if (isNameVisible) {
                        clockKey.fadeInName_SocketCall();
                    }
                    else {
                        clockKey.fadeOutName_SocketCall();
                    }
                }
            }
        });
        clockKeyControls$.find("[data-action=\"toggle-spotlight\"]").on({
            click: async (event) => {
                event.preventDefault();
                const clockKey = getClockKeyFromEvent(event);
                await clockKey.updateTarget("isSpotlit", !clockKey.isSpotlit);
                // If clockKey is on display (in scene & visible), sent out animation socket calls
                if (clockKey.isOnDisplay) {
                    if (clockKey.isSpotlit) {
                        // clockKey.unspotlight_SocketCall();
                    }
                    else {
                        // clockKey.spotlight_SocketCall();
                    }
                }
            }
        });
        // #endregion
        // #region isOnDisplay === TRUE ~
        clockKeyControls$.find("[data-action=\"pull-clock-key\"]").on({
            click: async (event) => {
                event.preventDefault();
                await getClockKeyFromEvent(event).pull_SocketCall();
            }
        });
        // #endregion
        // #region isOnDisplay === FALSE ~
        clockKeyControls$.find("[data-action=\"drop-clock-key\"]").on({
            click: async (event) => {
                event.preventDefault();
                await getClockKeyFromEvent(event).drop_SocketCall();
            }
        });
        clockKeyControls$.find("[data-action=\"spawn-position-dragger\"]").on({
            click: async (event) => {
                event.preventDefault();
                const clockKey = getClockKeyFromEvent(event);
                clockKey.spawnPositionDragger(game.eunoblades.Director.clockKeySection$);
            }
        });
        clockKeyControls$.find("[data-action=\"delete-clock-key\"]").on({
            click: async (event) => {
                event.preventDefault();
                await getClockKeyFromEvent(event).delete();
            }
        });
        clockKeyControls$.find("[data-action=\"add-key-to-scene\"]").on({
            click: async (event) => {
                event.preventDefault();
                await getClockKeyFromEvent(event).addToScene(this.document.targetSceneID);
            }
        });
        clockKeyControls$.find("[data-action=\"remove-key-from-scene\"]").on({
            click: async (event) => {
                event.preventDefault();
                await getClockKeyFromEvent(event).removeFromScene(this.document.targetSceneID);
            }
        });
        clockKeyControls$.find("[data-action=\"add-clock-to-key\"]").on({
            click: async (event) => {
                event.preventDefault();
                await getClockKeyFromEvent(event).addClock();
            }
        });
        clockKeyControls$.find("input.clock-key-input:not([readonly])").on({
            change: async (event) => {
                const input$ = $(event.currentTarget);
                await getClockKeyFromEvent(event).updateTarget(input$.data("targetProp"), input$.val());
            }
        });
        // #endregion
        // #endregion
        // #region *** CLOCKS *** ~
        const clockControls$ = html.find(".clock-control-flipper");
        // #region isOnDisplay === TRUE OR FALSE (Conditional Animation Checks Required) ~
        clockControls$.find("[data-action=\"toggle-visible\"]").on({
            click: async (event) => {
                event.preventDefault();
                const [clockKey, clock] = getClockFromEvent(event);
                const isVisible = !clock.isVisible;
                clock.updateTarget("isVisible", isVisible);
                // If clock key is on display (in scene & visible), sent out animation socket calls
                if (clockKey.isOnDisplay) {
                    if (isVisible) {
                        // clock.show_SocketCall();
                    }
                    else {
                        // clock.hide_SocketCall();
                    }
                }
            }
        });
        clockControls$.find("[data-action=\"toggle-active\"]").on({
            click: async (event) => {
                event.preventDefault();
                const [clockKey, clock] = getClockFromEvent(event);
                const isActive = !clock.isActive;
                clock.updateTarget("isActive", isActive);
                // If clock AND clock key is on display (in scene & visible), sent out animation socket calls
                if (clock.isOnDisplay) {
                    if (isActive) {
                        // clock.activate_SocketCall();
                    }
                    else {
                        // clock.deactivate_SocketCall();
                    }
                }
            }
        });
        clockControls$.find("[data-action=\"toggle-name-visibility\"]").on({
            click: async (event) => {
                event.preventDefault();
                const clock = getClockFromEvent(event)[1];
                const isNameVisible = !clock.isNameVisible;
                clock.updateTarget("isNameVisible", isNameVisible);
                // If clock is on display (in scene & visible), sent out animation socket calls
                if (clock.isOnDisplay) {
                    if (isNameVisible) {
                        // clock.fadeInClockName_SocketCall();
                    }
                    else {
                        // clock.fadeOutClockName_SocketCall();
                    }
                }
            }
        });
        clockControls$.find("[data-action=\"toggle-highlight\"]").on({
            click: async (event) => {
                event.preventDefault();
                const [clockKey, clock] = getClockFromEvent(event);
                const isHighlighted = !clock.isHighlighted;
                clock.updateTarget("isHighlighted", isHighlighted);
                // If clock is on display (in scene & visible), sent out animation socket calls
                if (clock.isOnDisplay) {
                    if (isHighlighted) {
                        // clock.highlight_SocketCall();
                    }
                    else {
                        // clock.unhighlight_SocketCall();
                    }
                }
            }
        });
        // #endregion
        // #region isOnDisplay === TRUE ~
        clockControls$.find("[data-action=\"change-segments\"]").on({
            click: async (event) => {
                event.preventDefault();
                const [clockKey, clock] = getClockFromEvent(event);
                const minDelta = -1 * clock.value;
                const maxDelta = clock.max - clock.value;
                const value = U.gsap.utils.clamp(minDelta, maxDelta, U.pInt($(event.currentTarget).data("value")));
                eLog.checkLog3("BladesClockKeeperSheet", "changeSegments", { event, clock, minDelta, maxDelta, value });
                if (value > 0) {
                    await clock.fillSegments(value);
                }
                else if (value < 0) {
                    await clock.clearSegments(Math.abs(value));
                }
                // clock.changeSegments_SocketCall(value);
            }
        });
        // #endregion
        // #region isOnDisplay === FALSE ~
        clockControls$.find("select.clock-control-select").on({
            change: async (event) => {
                event.preventDefault();
                const select$ = $(event.currentTarget);
                const value = select$.data("dtype") === "number"
                    ? U.pInt(select$.val())
                    : select$.val();
                getClockFromEvent(event)[1].updateTarget(select$.data("targetProp"), value);
            }
        });
        clockControls$.find("input.clock-input:not([readonly])").on({
            change: async (event) => {
                const input$ = $(event.currentTarget);
                await getClockFromEvent(event)[1].updateTarget(input$.data("targetProp"), input$.val());
            }
        });
        clockControls$.find("[data-action=\"delete-clock\"]").on({
            click: async (event) => {
                event.preventDefault();
                await getClockFromEvent(event)[1].delete();
            }
        });
        // #endregion
        // #endregion
    }
}
export default BladesClockKeeperSheet;
