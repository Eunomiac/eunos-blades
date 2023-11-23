// #region ▮▮▮▮▮▮▮ IMPORTS ▮▮▮▮▮▮▮ ~
import C, { ActionTrait, AttributeTrait, RollType, ConsequenceType, Position, RollResult } from "./core/constants.js";
import registerSettings, { initTinyMCEStyles, initCanvasStyles, initDOMStyles } from "./core/settings.js";
import { registerHandlebarHelpers, preloadHandlebarsTemplates } from "./core/helpers.js";
import BladesPushAlert from "./BladesPushAlert.js";
import BladesChat from "./BladesChat.js";
import U from "./core/utilities.js";
import logger from "./core/logger.js";
import G, { Initialize as GsapInitialize } from "./core/gsap.js";
import BladesActorProxy, { BladesActor, BladesPC, BladesCrew, BladesNPC, BladesFaction } from "./documents/BladesActorProxy.js";
import BladesItemProxy, { BladesItem, BladesClockKeeper, BladesGMTracker, BladesLocation, BladesScore } from "./documents/BladesItemProxy.js";
import BladesItemSheet from "./sheets/item/BladesItemSheet.js";
import BladesPCSheet from "./sheets/actor/BladesPCSheet.js";
import BladesCrewSheet from "./sheets/actor/BladesCrewSheet.js";
import BladesNPCSheet from "./sheets/actor/BladesNPCSheet.js";
import BladesFactionSheet from "./sheets/actor/BladesFactionSheet.js";
import BladesRoll, { BladesRollMod, BladesRollPrimary, BladesRollOpposition, BladesRollParticipant } from "./BladesRoll.js";
import BladesDialog from "./BladesDialog.js";
import BladesAI, { AGENTS, AIAssistant } from "./core/ai.js";
import BladesActiveEffect from "./BladesActiveEffect.js";
import BladesGMTrackerSheet from "./sheets/item/BladesGMTrackerSheet.js";
import BladesClockKeeperSheet from "./sheets/item/BladesClockKeeperSheet.js";
import { updateClaims, updateContacts, updateOps, updateFactions, updateDescriptions, updateRollMods } from "./data-import/data-import.js";
CONFIG.debug.logging = false;
/* DEVCODE*/ CONFIG.debug.logging = true;
Object.assign(globalThis, { eLog: logger });
Handlebars.registerHelper("eLog", logger.hbsLog); /* !DEVCODE*/
let socket; // ~ SocketLib interface
// #endregion ▮▮▮▮[IMPORTS]▮▮▮▮
class GlobalGetter {
    get roll() { return BladesRoll.Active; }
    get user() { return game.users.getName("Alistair"); }
    get actor() { return game.actors.getName("Alistair"); }
    get rollFlags() { return this.roll?.flagData; }
    get userFlags() { return this.user?.flags?.["eunos-blades"]; }
    get actorFlags() { return this.actor?.flags?.["eunos-blades"]; }
    get rollUser() { return this.roll?.document; }
    get rollUserFlags() { return this.rollUser?.flags?.["eunos-blades"]; }
    get rollPrimary() { return this.roll?.rollPrimary; }
    get rollPrimaryDoc() { return this.roll?.rollPrimaryDoc; }
    get rollOpposition() { return this.roll?.rollOpposition; }
    get sheetData() { return this.roll?.getData(); }
    newActionRoll() {
        const pc = game.actors.getName("Alistair");
        const idList = [...new Array(15)].map(() => randomID());
        if (!pc) {
            return;
        }
        const conf = {
            rollType: RollType.Action,
            rollTrait: ActionTrait.finesse,
            rollUserID: game.users.find((user) => user.character?.name === "Alistair")?.id,
            rollPrimaryData: {
                rollPrimaryID: pc.id,
                rollPrimaryDoc: pc,
                rollPrimaryName: pc.name,
                rollPrimaryType: pc.type,
                rollPrimaryImg: pc.img,
                rollModsData: pc.rollModsData,
                rollFactors: pc.rollFactors,
                applyHarm: pc.applyHarm,
                applyWorsePosition: pc.applyWorsePosition
            },
            consequenceData: {
                [Position.risky]: {
                    [RollResult.partial]: {
                        [idList[0]]: {
                            id: idList[0],
                            type: ConsequenceType.ProwessHarm2,
                            attribute: AttributeTrait.prowess,
                            attributeVal: 3,
                            name: "Broken Leg",
                            resistTo: {
                                id: idList[1],
                                name: "Sprained Ankle",
                                isSelected: true,
                                type: ConsequenceType.ProwessHarm1,
                                typeDisplay: C.ConsequenceDisplay[ConsequenceType.ProwessHarm1],
                                icon: C.ConsequenceIcons[ConsequenceType.ProwessHarm1]
                            },
                            specialArmorTo: {
                                id: idList[2],
                                name: "Sprained Ankle",
                                isSelected: true,
                                type: ConsequenceType.None,
                                icon: C.ConsequenceIcons[ConsequenceType.None],
                                footerMsg: "If vs. Physical Harm",
                                typeDisplay: ""
                            },
                            icon: C.ConsequenceIcons[ConsequenceType.ProwessHarm2],
                            typeDisplay: C.ConsequenceDisplay[ConsequenceType.ProwessHarm2]
                        },
                        [idList[3]]: {
                            id: idList[3],
                            type: ConsequenceType.ReducedEffect,
                            attribute: AttributeTrait.insight,
                            attributeVal: 4,
                            name: "You Lose Your Footing",
                            resistTo: {
                                id: idList[4],
                                name: "",
                                type: ConsequenceType.None,
                                isSelected: true
                            },
                            icon: C.ConsequenceIcons[ConsequenceType.ReducedEffect],
                            typeDisplay: "Reduced Effect"
                        },
                        [idList[5]]: {
                            id: idList[5],
                            type: ConsequenceType.ResolveHarm1,
                            attribute: AttributeTrait.resolve,
                            name: "Traumatic Flashbacks",
                            resistTo: {
                                id: idList[6],
                                name: "",
                                type: ConsequenceType.None,
                                isSelected: true
                            },
                            icon: C.ConsequenceIcons[ConsequenceType.ResolveHarm1],
                            typeDisplay: "Level 1 Harm (Lesser)",
                            attributeVal: 4
                        }
                    },
                    [RollResult.fail]: {
                        [idList[7]]: {
                            id: idList[7],
                            type: ConsequenceType.WorsePosition,
                            attribute: AttributeTrait.resolve,
                            attributeVal: 4,
                            name: "Time To Regroup",
                            resistTo: {
                                id: idList[8],
                                name: "",
                                type: ConsequenceType.None,
                                isSelected: true
                            },
                            icon: C.ConsequenceIcons[ConsequenceType.WorsePosition],
                            typeDisplay: "Worse Position"
                        },
                        [idList[9]]: {
                            id: idList[9],
                            type: ConsequenceType.ComplicationMajor,
                            attribute: AttributeTrait.prowess,
                            name: "Your pick snaps off inside the lock.",
                            resistTo: {
                                id: idList[10],
                                name: "Pick breaks, but lock is still pickable",
                                isSelected: true,
                                type: ConsequenceType.ComplicationMinor,
                                icon: C.ConsequenceIcons[ConsequenceType.ComplicationMinor],
                                typeDisplay: "Minor Complication"
                            },
                            attributeVal: 3,
                            icon: C.ConsequenceIcons[ConsequenceType.ComplicationMajor],
                            typeDisplay: "Major Complication"
                        },
                        [idList[11]]: {
                            id: idList[11],
                            type: ConsequenceType.InsightHarm2,
                            attribute: AttributeTrait.insight,
                            name: "Completely Misled",
                            resistTo: {
                                id: idList[12],
                                name: "Confused by Deception",
                                isSelected: true,
                                type: ConsequenceType.InsightHarm1,
                                typeDisplay: "Level 1 Harm (Lesser)",
                                icon: C.ConsequenceIcons[ConsequenceType.InsightHarm1]
                            },
                            specialArmorTo: {
                                id: idList[13],
                                name: "Sprained Ankle",
                                isSelected: true,
                                type: ConsequenceType.InsightHarm1,
                                footerMsg: "If vs. Supernatural, Arcane Forces",
                                icon: C.ConsequenceIcons[ConsequenceType.InsightHarm1],
                                typeDisplay: "Level 1 Harm (Lesser)"
                            },
                            icon: C.ConsequenceIcons[ConsequenceType.InsightHarm2],
                            typeDisplay: "Level 2 Harm (Moderate)",
                            attributeVal: 4
                        }
                    }
                }
            }
        };
        BladesRoll.NewRoll(conf);
    }
    newResistanceRoll() {
        const pc = game.actors.getName("Alistair");
        if (!pc) {
            return;
        }
        const conf = {
            rollType: RollType.Resistance,
            rollUserID: game.users.find((user) => user.character?.name === "Alistair")?.id,
            rollPrimaryData: {
                rollPrimaryID: pc.id,
                rollPrimaryDoc: pc,
                rollPrimaryName: pc.name,
                rollPrimaryType: pc.type,
                rollPrimaryImg: pc.img,
                rollModsData: pc.rollModsData,
                rollFactors: pc.rollFactors,
                applyHarm: pc.applyHarm,
                applyWorsePosition: pc.applyWorsePosition
            },
            resistanceData: {
                consequence: {
                    id: randomID(),
                    name: "Shattered Knee",
                    icon: C.ConsequenceIcons[ConsequenceType.ProwessHarm3],
                    type: ConsequenceType.ProwessHarm3,
                    typeDisplay: C.ConsequenceDisplay[ConsequenceType.ProwessHarm3],
                    attribute: AttributeTrait.prowess,
                    attributeVal: 3,
                    resistTo: {
                        id: randomID(),
                        name: "Twisted Knee",
                        icon: C.ConsequenceIcons[ConsequenceType.ProwessHarm2],
                        type: ConsequenceType.ProwessHarm2,
                        typeDisplay: C.ConsequenceDisplay[ConsequenceType.ProwessHarm2],
                        isSelected: true
                    }
                }
            }
        };
        BladesRoll.NewRoll(conf);
    }
}
// #region Globals: Exposing Functionality to Global Scope ~
/* DEVCODE*/ Object.assign(globalThis, {
    get: new GlobalGetter(),
    updateClaims,
    updateContacts,
    updateOps,
    updateFactions,
    updateDescriptions,
    updateRollMods,
    BladesActor,
    BladesPC,
    BladesCrew,
    BladesNPC,
    BladesFaction,
    BladesPCSheet,
    BladesCrewSheet,
    BladesFactionSheet,
    BladesNPCSheet,
    BladesActiveEffect,
    BladesPushAlert,
    BladesRoll,
    BladesRollMod,
    BladesRollPrimary,
    BladesRollOpposition,
    BladesRollParticipant,
    BladesChat,
    G,
    U,
    C,
    BladesItem,
    BladesClockKeeper,
    BladesGMTracker,
    BladesLocation,
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
    // Register System Settings
    registerSettings();
    eLog.display("Initializing Blades In the Dark System");
    // Initialize Fonts & Gsap Animations
    GsapInitialize();
    CONFIG.Item.documentClass = BladesItemProxy;
    CONFIG.Actor.documentClass = BladesActorProxy;
    CONFIG.ChatMessage.documentClass = BladesChat;
    // Register sheet application classes
    Actors.unregisterSheet("core", ActorSheet);
    Actors.registerSheet("blades", BladesCrewSheet, { types: ["crew"], makeDefault: true });
    Actors.registerSheet("blades", BladesFactionSheet, { types: ["faction"], makeDefault: true });
    Actors.registerSheet("blades", BladesNPCSheet, { types: ["npc"], makeDefault: true });
    Items.unregisterSheet("core", ItemSheet);
    Items.registerSheet("blades", BladesItemSheet, { types: C.ItemTypes, makeDefault: true });
    // Initialize subclasses
    await Promise.all([
        BladesPCSheet.Initialize(),
        BladesActiveEffect.Initialize(),
        BladesGMTrackerSheet.Initialize(),
        BladesScore.Initialize(),
        BladesDialog.Initialize(),
        BladesClockKeeperSheet.Initialize(),
        BladesPushAlert.Initialize(),
        BladesRoll.Initialize(),
        BladesChat.Initialize(),
        preloadHandlebarsTemplates()
    ]);
    registerHandlebarHelpers();
});
Hooks.once("ready", () => {
    initDOMStyles();
    initCanvasStyles();
    initTinyMCEStyles();
});
// #endregion ▄▄▄▄▄ SYSTEM INITIALIZATION ▄▄▄▄▄
// #region ░░░░░░░[SocketLib]░░░░ SocketLib Initialization ░░░░░░░ ~
Hooks.once("socketlib.ready", () => {
    socket = socketlib.registerSystem("eunos-blades");
    /* DEVCODE*/ Object.assign(globalThis, { socket, socketlib }); /* !DEVCODE*/
    BladesRoll.InitSockets();
    let clockOverlayUp;
    let pushControllerUp;
    /**
     * Initializes the overlay sockets for the BladesClockKeeperSheet and BladesPushAlert.
     * It checks every 2 seconds if the overlays are up and running.
     * If both overlays are up, it stops checking.
     *
     * @function
     * @name InitOverlaySockets
     * @returns {void}
     */
    function InitOverlaySockets() {
        setTimeout(() => {
            clockOverlayUp = clockOverlayUp || BladesClockKeeperSheet.InitSockets();
            pushControllerUp = pushControllerUp || BladesPushAlert.InitSockets();
            if (clockOverlayUp && pushControllerUp) {
                return;
            }
            InitOverlaySockets();
        }, 2000);
    }
    InitOverlaySockets();
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
