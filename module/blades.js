/* ****▌███████████████████████████████████████████████████████████████████████████▐**** *\
|*     ▌████░░░░░░░░░░░ Euno's Blades in the Dark for Foundry VTT ░░░░░░░░░░░░░████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░ by Eunomiac ░░░░░░░░░░░░░██████████████████▐     *|
|*     ▌████████████████████████████  License █ v0.1.0 ████████████████████████████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░░░░░░  ░░░░░░░░░░░░░░░░░░███████████████████▐     *|
\* ****▌███████████████████████████████████████████████████████████████████████████▐**** */

import { IMPORTDATA } from "./core/constants.js";
import registerSettings, { initTinyMCEStyles, initCanvasStyles, initFonts } from "./core/settings.js";
import H, { registerHandlebarHelpers, preloadHandlebarsTemplates } from "./core/helpers.js";
import registerDebugger from "./core/logger.js";
import BladesActor from "./blades-actor.js";
import BladesItem from "./blades-item.js";
import BladesItemSheet from "./sheets/blades-item-sheet.js";
import BladesActorSheet from "./sheets/blades-actor-sheet.js";
import BladesCrewSheet from "./sheets/blades-crew-sheet.js";
import BladesNPCSheet from "./sheets/blades-npc-sheet.js";
import BladesFactionSheet from "./sheets/blades-faction-sheet.js";
import { bladesRoll, simpleRollPopup } from "./blades-roll.js";
import BladesActiveEffect from "./blades-active-effect.js";
import EunoTrackerSheet from "./sheets/blades-tracker-sheet.js";
import EunoClockKeeperSheet from "./sheets/blades-clock-keeper-sheet.js";
let socket;
registerDebugger();

Object.assign(globalThis, {
    BladesActor,
    BladesActorSheet,
    BladesCrewSheet,
    BladesFactionSheet,
    BladesNPCSheet,
    EunoClockKeeperSheet,
    EunoTrackerSheet,
    BladesActiveEffect,
    IMPORTDATA,
    bladesRoll,
    simpleRollPopup,
    H,
    BladesItem,
    BladesItemSheet,
    ClearNPCs: () => {
        const npcNames = IMPORTDATA.npcs.map(({ name }) => name);
        const npcs = Array.from(game.actors ?? [])
            .filter((actor) => npcNames.includes(actor.name ?? ""));
        return Promise.all(npcs.map((npc) => npc.delete()));
    },
    GenerateNPCs: () => Promise.all(IMPORTDATA.npcs.map(({ name, type, ...data }) => Actor.create({ name, type, data })))
});
Hooks.once("init", async () => {
    registerSettings();
    bLog.display("Initializing Blades In the Dark System");
    initFonts();
    CONFIG.Item.documentClass = BladesItem;
    CONFIG.Actor.documentClass = BladesActor;
    Actors.unregisterSheet("core", ActorSheet);
    Actors.registerSheet("blades", BladesActorSheet, { types: ["character"], makeDefault: true });
    Actors.registerSheet("blades", BladesCrewSheet, { types: ["crew"], makeDefault: true });
    Actors.registerSheet("blades", BladesFactionSheet, { types: ["factions"], makeDefault: true });
    Actors.registerSheet("blades", BladesNPCSheet, { types: ["npc"], makeDefault: true });
    Items.unregisterSheet("core", ItemSheet);
    Items.registerSheet("blades", BladesItemSheet, { types: ["faction", "item", "class", "ability", "heritage", "background", "vice", "crew_upgrade", "cohort", "crew_type", "crew_reputation", "crew_upgrade", "crew_ability"], makeDefault: true });
    await Promise.all([
        BladesActiveEffect.Initialize(),
        EunoTrackerSheet.Initialize(),
        EunoClockKeeperSheet.Initialize(),
        preloadHandlebarsTemplates()
    ]);
    registerHandlebarHelpers();
});
Hooks.once("ready", async () => {
    initCanvasStyles();
    initTinyMCEStyles();
});

Hooks.once("socketlib.ready", () => {
    socket = socketlib.registerSystem("eunos-blades");
    Object.assign(globalThis, { socket, socketlib });     socket.register("renderOverlay", () => game.eunoblades.ClockKeeper?.renderOverlay());
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
        emissiveMaps: [, , , , , "systems/eunos-blades/assets/dice/emission-maps/6.webp"],
        emissive: "#d89300"
    });
});