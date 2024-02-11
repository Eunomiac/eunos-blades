/* eslint-disable @typescript-eslint/no-unused-vars */
// #region ▮▮▮▮▮▮▮ IMPORTS ▮▮▮▮▮▮▮ ~
import C, { ActionTrait, AttributeTrait, RollType, ConsequenceType } from "./core/constants.js";
import registerSettings, { initTinyMCEStyles, initCanvasStyles, initDOMStyles } from "./core/settings.js";
import { registerHandlebarHelpers, preloadHandlebarsTemplates } from "./core/helpers.js";
import BladesChat from "./classes/BladesChat.js";
import U from "./core/utilities.js";
import logger from "./core/logger.js";
import G, { Initialize as GsapInitialize } from "./core/gsap.js";
import BladesClockKey from "./classes/BladesClocks.js";
import BladesDirector from "./classes/BladesDirector.js";
import BladesConsequence from "./classes/BladesConsequence.js";
import BladesScene from "./classes/BladesScene.js";
import BladesActorProxy, { BladesActor, BladesPC, BladesCrew, BladesNPC, BladesFaction } from "./documents/BladesActorProxy.js";
import BladesItemProxy, { BladesItem, BladesClockKeeper, BladesGMTracker, BladesLocation, BladesScore, BladesProject } from "./documents/BladesItemProxy.js";
import BladesItemSheet from "./sheets/item/BladesItemSheet.js";
import BladesPCSheet from "./sheets/actor/BladesPCSheet.js";
import BladesCrewSheet from "./sheets/actor/BladesCrewSheet.js";
import BladesNPCSheet from "./sheets/actor/BladesNPCSheet.js";
import BladesFactionSheet from "./sheets/actor/BladesFactionSheet.js";
import BladesRoll, { BladesRollMod, BladesRollPrimary, BladesRollOpposition, BladesRollParticipant, BladesActionRoll, BladesResistanceRoll } from "./classes/BladesRoll.js";
import BladesDialog from "./classes/BladesDialog.js";
import BladesAI, { AGENTS, AIAssistant } from "./core/ai.js";
import BladesActiveEffect from "./documents/BladesActiveEffect.js";
import BladesGMTrackerSheet from "./sheets/item/BladesGMTrackerSheet.js";
import BladesClockKeeperSheet from "./sheets/item/BladesClockKeeperSheet.js";
CONFIG.debug.logging = true;
/* DEVCODE*/
Object.assign(globalThis, { eLog: logger });
Handlebars.registerHelper("eLog", logger.hbsLog);
/* !DEVCODE*/
let socket; // ~ SocketLib interface
// #endregion ▮▮▮▮[IMPORTS]▮▮▮▮
class GlobalGetter {
    get clockKeys() { return game.eunoblades.ClockKeys.filter((clockKey) => clockKey.isInScene() && clockKey.isVisible); }
    get roll() { return BladesRoll.Active; }
    get user() { return game.users.getName("Alistair"); }
    get actor() { return game.actors.getName("Alistair"); }
    get rollTarget() { return this.roll?.target; }
    get rollData() { return this.roll?.data; }
    get userFlags() { return this.user?.flags?.["eunos-blades"]; }
    get actorFlags() { return this.actor?.flags?.["eunos-blades"]; }
    get rollPrimary() { return this.roll?.rollPrimary; }
    get rollPrimaryDoc() { return this.roll?.rollPrimaryDoc; }
    get rollOpposition() { return this.roll?.rollOpposition; }
    get sheetData() { return this.roll?.context; }
    newActionRoll() {
        const pc = game.actors.getName("Alistair");
        if (!pc) {
            return;
        }
        const conf = {
            target: pc,
            targetFlagKey: "rollCollab",
            rollType: RollType.Action,
            rollTrait: ActionTrait.finesse,
            rollUserID: game.users.find((user) => user.character?.name === "Alistair")?.id,
            rollPrimaryData: pc
        };
        BladesActionRoll.New(conf);
    }
    async newResistanceRoll() {
        const pc = game.actors.getName("Alistair");
        if (!pc?.id) {
            return;
        }
        const csq = await BladesConsequence.Create({
            target: pc,
            targetFlagKey: "rollConsequence",
            name: "Shattered Knee",
            isScopingById: true,
            type: ConsequenceType.ProwessHarm3,
            primaryID: pc.uuid,
            attribute: AttributeTrait.prowess,
            attributeVal: 3,
            resistSchema: {
                name: "Banged Knee",
                type: ConsequenceType.ProwessHarm2,
                primaryID: pc.uuid,
                canResistWithSpecial: true,
                resistWithSpecialNegates: true,
                specialFooterMsg: "Ability: Spend to Fully Negate."
            },
            canResistWithRoll: true,
            canResistWithSpecial: true,
            resistWithSpecialNegates: true,
            specialFooterMsg: "Ability: Spend to Fully Negate."
        });
        const conf = {
            target: pc,
            targetFlagKey: "rollCollab",
            rollType: RollType.Resistance,
            rollUserID: game.users.find((user) => user.character?.name === "Alistair")?.id,
            rollPrimaryData: pc,
            resistanceData: {
                consequence: csq.data
            }
        };
        BladesResistanceRoll.New(conf);
    }
}
// #region Globals: Exposing Functionality to Global Scope ~
/* DEVCODE*/ Object.assign(globalThis, {
    get: new GlobalGetter(),
    // updateClaims,
    // updateContacts,
    // updateOps,
    // updateFactions,
    // updateDescriptions,
    // updateRollMods,
    BladesScene,
    BladesDirector,
    BladesActor,
    BladesPC,
    BladesCrew,
    BladesNPC,
    BladesFaction,
    BladesPCSheet,
    BladesCrewSheet,
    BladesFactionSheet,
    BladesClockKey,
    BladesNPCSheet,
    BladesActiveEffect,
    BladesRoll,
    BladesRollMod,
    BladesRollPrimary,
    BladesRollOpposition,
    BladesRollParticipant,
    BladesChat,
    BladesConsequence,
    G,
    U,
    C,
    BladesItem,
    BladesClockKeeper,
    BladesGMTracker,
    BladesLocation,
    BladesProject,
    BladesScore,
    BladesItemSheet,
    BladesClockKeeperSheet,
    BladesGMTrackerSheet,
    BladesAI,
    AIAssistant,
    AGENTS
}); /* !DEVCODE*/
// #endregion Globals
// #region ████████ SYSTEM INITIALIZATION: Initializing Blades In The Dark System on 'Init' Hook ████████
Hooks.once("init", async () => {
    // Initialize Game object
    game.eunoblades = {
        Rolls: new Collection(),
        ClockKeys: new Collection(),
        Consequences: new Collection(),
        Director: BladesDirector.getInstance(),
        Tooltips: new WeakMap()
    };
    eLog.display("Initializing Blades In the Dark System");
    // Register System Settings
    registerSettings();
    CONFIG.debug.hooks = U.getSetting("debugHooks");
    // Initialize Fonts & Gsap Animations
    GsapInitialize();
    CONFIG.Item.documentClass = BladesItemProxy;
    CONFIG.Actor.documentClass = BladesActorProxy;
    CONFIG.Scene.documentClass = BladesScene;
    CONFIG.ChatMessage.documentClass = BladesChat;
    // Register sheet application classes
    Actors.unregisterSheet("core", ActorSheet);
    Items.unregisterSheet("core", ItemSheet);
    Items.registerSheet("blades", BladesItemSheet, { types: C.ItemTypes, makeDefault: true });
    registerHandlebarHelpers();
    preloadHandlebarsTemplates();
    // Initialize preliminary classes with templates to load
    await Promise.all([
        BladesPC.Initialize(),
        BladesCrew.Initialize(),
        BladesNPC.Initialize(),
        BladesFaction.Initialize(),
        BladesActiveEffect.Initialize(),
        BladesGMTrackerSheet.Initialize(),
        BladesClockKeeperSheet.Initialize(),
        BladesScore.Initialize(),
        BladesDialog.Initialize(),
        BladesRoll.Initialize(),
        BladesProject.Initialize(),
        BladesChat.Initialize()
    ]);
});
Hooks.once("ready", async () => {
    // Initialize overlays
    await Promise.all([
        BladesDirector.Initialize(),
        BladesGMTracker.Initialize(),
        BladesClockKeeper.Initialize()
    ]);
    // Initialize Clocks, ClockKeys & Consequences
    BladesClockKey.Initialize();
    await BladesConsequence.Initialize();
    initDOMStyles();
    initCanvasStyles();
    initTinyMCEStyles();
    await BladesDirector.getInstance().renderOverlay_SocketResponse();
    BladesDirector.InitSockets();
    BladesRoll.InitSockets();
});
// #endregion ▄▄▄▄▄ SYSTEM INITIALIZATION ▄▄▄▄▄
// #region ░░░░░░░[SocketLib]░░░░ SocketLib Initialization ░░░░░░░ ~
Hooks.once("socketlib.ready", () => {
    socket = socketlib.registerSystem("eunos-blades");
    /* DEVCODE*/ Object.assign(globalThis, { socket, socketlib }); /* !DEVCODE*/
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
// #endregion ░░░░[Dice So Nice]░░░░
