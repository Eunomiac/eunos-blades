/* ****▌███████████████████████████████████████████████████████████████████████████▐**** *\
|*     ▌████░░░░░░░░░░░ Euno's Blades in the Dark for Foundry VTT ░░░░░░░░░░░░░████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░ by Eunomiac ░░░░░░░░░░░░░██████████████████▐     *|
|*     ▌████████████████████████████  License █ v0.1.0 ████████████████████████████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░░░░░░  ░░░░░░░░░░░░░░░░░░███████████████████▐     *|
\* ****▌███████████████████████████████████████████████████████████████████████████▐**** */

import C from "./core/constants.js";
import registerSettings, { initTinyMCEStyles, initCanvasStyles } from "./core/settings.js";
import { registerHandlebarHelpers, preloadHandlebarsTemplates } from "./core/helpers.js";
import BladesPushController from "./blades-push-notifications.js";
import U from "./core/utilities.js";
import registerDebugger from "./core/logger.js";
import G, { Initialize as GsapInitialize } from "./core/gsap.js";
import BladesActor from "./blades-actor.js";
import BladesActorProxy from "./documents/blades-actor-proxy.js";
import BladesItemProxy, { BladesItem, BladesClockKeeper, BladesGMTracker, BladesLocation, BladesScore } from "./documents/blades-item-proxy.js";
import BladesItemSheet from "./sheets/item/blades-item-sheet.js";
import BladesPCSheet from "./sheets/actor/blades-pc-sheet.js";
import BladesCrewSheet from "./sheets/actor/blades-crew-sheet.js";
import BladesNPCSheet from "./sheets/actor/blades-npc-sheet.js";
import BladesFactionSheet from "./sheets/actor/blades-faction-sheet.js";
import BladesRollCollab, { ApplyRollEffects, ApplyDescriptions } from "./blades-roll-collab.js";
import { bladesRoll, simpleRollPopup } from "./blades-roll.js";
import BladesSelectorDialog from "./blades-dialog.js";
import BladesActiveEffect from "./blades-active-effect.js";
import BladesTrackerSheet from "./sheets/item/blades-tracker-sheet.js";
import BladesClockKeeperSheet from "./sheets/item/blades-clock-keeper-sheet.js";
import { UpdateClaims, UpdateContacts, UpdateOps } from "./data-import/data-import.js";
CONFIG.debug.logging = false;
CONFIG.debug.logging = true; 
let socket;
registerDebugger();

Object.assign(globalThis, {
    UpdateClaims,
    UpdateContacts,
    UpdateOps,
    BladesActor,
    BladesPCSheet,
    BladesCrewSheet,
    BladesFactionSheet,
    BladesNPCSheet,
    BladesActiveEffect,
    BladesPushController,
    BladesRollCollab,
    ApplyRollEffects,
    ApplyDescriptions,
    bladesRoll,
    simpleRollPopup,
    G,
    U,
    C,
    BladesItem,
    BladesClockKeeper,
    BladesGMTracker,
    BladesLocation,
    BladesItemSheet,
    BladesClockKeeperSheet,
    BladesTrackerSheet
});

Hooks.once("init", async () => {
    registerSettings();
    eLog.display("Initializing Blades In the Dark System");
    GsapInitialize();
    CONFIG.Item.documentClass = BladesItemProxy;
    CONFIG.Actor.documentClass = BladesActorProxy;
    Actors.unregisterSheet("core", ActorSheet);
    Actors.registerSheet("blades", BladesCrewSheet, { types: ["crew"], makeDefault: true });
    Actors.registerSheet("blades", BladesFactionSheet, { types: ["faction"], makeDefault: true });
    Actors.registerSheet("blades", BladesNPCSheet, { types: ["npc"], makeDefault: true });
    Items.unregisterSheet("core", ItemSheet);
    Items.registerSheet("blades", BladesItemSheet, { types: C.ItemTypes, makeDefault: true });
    await Promise.all([
        BladesPCSheet.Initialize(),
        BladesActiveEffect.Initialize(),
        BladesTrackerSheet.Initialize(),
        BladesScore.Initialize(),
        BladesSelectorDialog.Initialize(),
        BladesClockKeeperSheet.Initialize(),
        BladesPushController.Initialize(),
        BladesRollCollab.Initialize(),
        preloadHandlebarsTemplates()
    ]);
    registerHandlebarHelpers();
});
Hooks.once("ready", async () => {
    initCanvasStyles();
    initTinyMCEStyles();
    DebugPC();
});

Hooks.once("socketlib.ready", () => {
    socket = socketlib.registerSystem("eunos-blades");
    Object.assign(globalThis, { socket, socketlib });     
    BladesRollCollab.InitSockets();
    let clockOverlayUp, pushControllerUp;
    function InitOverlaySockets() {
        setTimeout(() => {
            clockOverlayUp = clockOverlayUp || BladesClockKeeperSheet.InitSockets();
            pushControllerUp = clockOverlayUp || BladesPushController.InitSockets();
            if (clockOverlayUp && pushControllerUp) {
                return;
            }
            InitOverlaySockets();
        }, 2000);
    }
    InitOverlaySockets();
});

Hooks.once("renderSceneControls", async (app, html) => {
    const dice_roller = $('<li class="scene-control" title="Dice Roll"><i class="fas fa-dice"></i></li>');
    dice_roller.click(async () => {
        await simpleRollPopup();
    });
    if (!foundry.utils.isNewerVersion("9", game.version ?? game.data.version)) {
        html.children().first().append(dice_roller);
    }
    else {
        html.append(dice_roller);
    }
});

Hooks.once("diceSoNiceReady", (dice3d) => {
    dice3d.addSystem({ id: "eunos-blades", name: "Euno's Blades" }, "preferred");
    dice3d.addDicePreset({
        type: "d6",
        labels: [1, 2, 3, 4, 5, 6].map((num) => `systems/eunos-blades/assets/dice/faces/${num}.webp`),
        system: "eunos-blades",
        bumpMaps: [1, 2, 3, 4, 5, 6].map((num) => `systems/eunos-blades/assets/dice/bump-maps/${num}.webp`),
        emissiveMaps: [undefined, undefined, undefined, undefined, undefined, "systems/eunos-blades/assets/dice/emission-maps/6.webp"],
        emissive: "#d89300"
    });
});
//# sourceMappingURL=blades.js.map
//# sourceMappingURL=blades.js.map
