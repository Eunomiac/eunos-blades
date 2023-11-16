// #region ▮▮▮▮▮▮▮ IMPORTS ▮▮▮▮▮▮▮ ~
import C, { ActionTrait, AttributeTrait, RollType, ConsequenceType, Position, RollResult } from "./core/constants.js";
import registerSettings, { initTinyMCEStyles, initCanvasStyles } from "./core/settings.js";
import { registerHandlebarHelpers, preloadHandlebarsTemplates } from "./core/helpers.js";
import BladesPushAlert from "./BladesPushAlert.js";
import BladesChat from "./BladesChat.js";
import U from "./core/utilities.js";
import logger from "./core/logger.js";
import G, { Initialize as GsapInitialize } from "./core/gsap.js";
/*~ @@DOUBLE-BLANK@@ ~*/
import BladesActorProxy, { BladesActor, BladesPC, BladesCrew, BladesNPC, BladesFaction } from "./documents/BladesActorProxy.js";
import BladesItemProxy, { BladesItem, BladesClockKeeper, BladesGMTracker, BladesLocation, BladesScore } from "./documents/BladesItemProxy.js";
/*~ @@DOUBLE-BLANK@@ ~*/
import BladesItemSheet from "./sheets/item/BladesItemSheet.js";
import BladesPCSheet from "./sheets/actor/BladesPCSheet.js";
import BladesCrewSheet from "./sheets/actor/BladesCrewSheet.js";
import BladesNPCSheet from "./sheets/actor/BladesNPCSheet.js";
import BladesFactionSheet from "./sheets/actor/BladesFactionSheet.js";
import BladesRoll, { BladesRollMod, BladesRollPrimary, BladesRollOpposition, BladesRollParticipant } from "./BladesRoll.js";
/*~ @@DOUBLE-BLANK@@ ~*/
import BladesDialog from "./BladesDialog.js";
import BladesAI, { AGENTS } from "./core/ai.js";
import BladesActiveEffect from "./BladesActiveEffect.js";
import BladesGMTrackerSheet from "./sheets/item/BladesGMTrackerSheet.js";
import BladesClockKeeperSheet from "./sheets/item/BladesClockKeeperSheet.js";
import { updateClaims, updateContacts, updateOps, updateFactions, updateDescriptions, updateRollMods } from "./data-import/data-import.js";
/*~ @@DOUBLE-BLANK@@ ~*/
CONFIG.debug.logging = false;
/* DEVCODE*/ CONFIG.debug.logging = true;
Object.assign(globalThis, { eLog: logger });
Handlebars.registerHelper("eLog", logger.hbsLog); /* !DEVCODE*/
/*~ @@DOUBLE-BLANK@@ ~*/
let socket; // ~ SocketLib interface
/*~ @@DOUBLE-BLANK@@ ~*/
// #endregion ▮▮▮▮[IMPORTS]▮▮▮▮
/*~ @@DOUBLE-BLANK@@ ~*/
class GlobalGetter {
    get roll() { return BladesRoll.Active; }
    /*~ @@DOUBLE-BLANK@@ ~*/
    get user() { return this.roll?.document; }
    /*~ @@DOUBLE-BLANK@@ ~*/
    get rollFlags() { return this.roll?.flagData; }
    /*~ @@DOUBLE-BLANK@@ ~*/
    get userFlags() { return this.user?.flags?.["eunos-blades"]?.rollCollab; }
    /*~ @@DOUBLE-BLANK@@ ~*/
    get rollPrimary() { return this.roll?.rollPrimary; }
    /*~ @@DOUBLE-BLANK@@ ~*/
    get rollPrimaryDoc() { return this.roll?.rollPrimaryDoc; }
    /*~ @@DOUBLE-BLANK@@ ~*/
    get rollOpposition() { return this.roll?.rollOpposition; }
    /*~ @@DOUBLE-BLANK@@ ~*/
    get sheetData() { return this.roll?.getData(); }
    /*~ @@DOUBLE-BLANK@@ ~*/
    newActionRoll() {
        const pc = game.actors.getName("Alistair");
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
                rollFactors: pc.rollFactors
            },
            consequenceData: {
                [Position.risky]: {
                    [RollResult.partial]: {
                        0: {
                            type: ConsequenceType.ProwessHarm2,
                            attribute: AttributeTrait.prowess,
                            attributeVal: 3,
                            name: "Broken Leg",
                            resistOptions: {
                                0: {
                                    name: "Sprained Ankle",
                                    isSelected: true,
                                    type: ConsequenceType.ProwessHarm1,
                                    icon: C.ConsequenceIcons[ConsequenceType.ProwessHarm1],
                                    typeDisplay: C.ConsequenceDisplay[ConsequenceType.ProwessHarm1]
                                },
                                1: {
                                    name: "Bruised Leg",
                                    isSelected: false,
                                    type: ConsequenceType.ProwessHarm1,
                                    icon: C.ConsequenceIcons[ConsequenceType.ProwessHarm1]
                                },
                                2: {
                                    name: "Fractured Foot",
                                    isSelected: false,
                                    type: ConsequenceType.ProwessHarm1,
                                    icon: C.ConsequenceIcons[ConsequenceType.ProwessHarm1]
                                }
                            },
                            resistedTo: {
                                name: "Sprained Ankle",
                                isSelected: true,
                                type: ConsequenceType.ProwessHarm1,
                                typeDisplay: C.ConsequenceDisplay[ConsequenceType.ProwessHarm1],
                                icon: C.ConsequenceIcons[ConsequenceType.ProwessHarm1]
                            },
                            specialArmorTo: {
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
                        1: {
                            type: ConsequenceType.ReducedEffect,
                            attribute: AttributeTrait.insight,
                            attributeVal: 4,
                            name: "You Lose Your Footing",
                            /* "resistOptions": {
                                "0": {
                                    "name": "Stumble",
                                    "isSelected": false
                                },
                                "1": {
                                    "name": "Trip",
                                    "isSelected": false
                                },
                                "2": {
                                    "name": "",
                                    "type": "None",
                                    "isSelected": true
                                }
                            }, */
                            resistedTo: {
                                name: "",
                                type: ConsequenceType.None,
                                isSelected: true
                            },
                            icon: "main",
                            typeDisplay: "Reduced Effect"
                        },
                        2: {
                            type: ConsequenceType.ResolveHarm1,
                            attribute: AttributeTrait.resolve,
                            name: "Traumatic Flashbacks",
                            resistOptions: {
                                0: {
                                    name: "",
                                    type: ConsequenceType.None,
                                    isSelected: true
                                },
                                1: {
                                    name: "",
                                    type: ConsequenceType.None,
                                    isSelected: false
                                },
                                2: {
                                    name: "",
                                    type: ConsequenceType.None,
                                    isSelected: false
                                }
                            },
                            resistedTo: {
                                name: "",
                                type: ConsequenceType.None,
                                isSelected: true
                            },
                            icon: "spikes|eyeball|iris",
                            typeDisplay: "Level 1 Harm (Lesser)",
                            attributeVal: 4
                        }
                    },
                    [RollResult.fail]: {
                        0: {
                            type: ConsequenceType.WorsePosition,
                            attribute: AttributeTrait.resolve,
                            attributeVal: 4,
                            name: "Time To Regroup",
                            resistOptions: {
                                0: {
                                    name: "Time to Rest and Recuperate",
                                    isSelected: false
                                },
                                1: {
                                    name: "Time to Reflect and Reevaluate",
                                    isSelected: false
                                },
                                2: {
                                    name: "Time to Reorganize and Strategize",
                                    isSelected: false
                                }
                            },
                            resistedTo: {
                                name: "",
                                type: ConsequenceType.None,
                                isSelected: true
                            },
                            icon: "horizon|boot|ice",
                            typeDisplay: "Worse Position"
                        },
                        1: {
                            type: ConsequenceType.ComplicationMajor,
                            attribute: AttributeTrait.prowess,
                            name: "Your pick snaps off inside the lock.",
                            resistOptions: {
                                0: {
                                    name: "Lock remains intact but jammed",
                                    isSelected: false,
                                    type: ConsequenceType.ComplicationMinor,
                                    icon: "main"
                                },
                                1: {
                                    name: "Pick breaks, but lock is still pickable",
                                    isSelected: true,
                                    type: ConsequenceType.ComplicationMinor,
                                    icon: "main",
                                    typeDisplay: "Minor Complication"
                                },
                                2: {
                                    name: "You manage to extract the broken pick from the lock.",
                                    isSelected: false,
                                    type: ConsequenceType.ComplicationMinor,
                                    icon: "main"
                                }
                            },
                            resistedTo: {
                                name: "Pick breaks, but lock is still pickable",
                                isSelected: true,
                                type: ConsequenceType.ComplicationMinor,
                                icon: "main",
                                typeDisplay: "Minor Complication"
                            },
                            attributeVal: 3,
                            icon: "main",
                            typeDisplay: "Major Complication"
                        },
                        2: {
                            type: ConsequenceType.InsightHarm2,
                            attribute: AttributeTrait.insight,
                            name: "Completely Misled",
                            resistOptions: {
                                0: {
                                    name: "Partially Misinformed",
                                    isSelected: false,
                                    type: ConsequenceType.InsightHarm1,
                                    icon: "eye|iris",
                                    typeDisplay: "Level 1 Harm (Lesser)"
                                },
                                1: {
                                    name: "Confused by Deception",
                                    isSelected: true,
                                    type: ConsequenceType.InsightHarm1,
                                    icon: "eye|iris",
                                    typeDisplay: "Level 1 Harm (Lesser)"
                                },
                                2: {
                                    name: "Given Partially Incorrect Information",
                                    isSelected: false,
                                    type: ConsequenceType.InsightHarm1,
                                    icon: "eye|iris"
                                }
                            },
                            resistedTo: {
                                name: "Confused by Deception",
                                isSelected: true,
                                type: ConsequenceType.InsightHarm1,
                                typeDisplay: "Level 1 Harm (Lesser)",
                                icon: "eye|iris"
                            },
                            specialArmorTo: {
                                name: "Sprained Ankle",
                                isSelected: true,
                                type: ConsequenceType.InsightHarm1,
                                footerMsg: "If vs. Supernatural, Arcane Forces",
                                icon: C.ConsequenceIcons[ConsequenceType.InsightHarm1],
                                typeDisplay: "Level 1 Harm (Lesser)"
                            },
                            icon: "eye|iris",
                            typeDisplay: "Level 2 Harm (Moderate)",
                            attributeVal: 4
                        }
                    }
                }
            }
        };
        BladesRoll.NewRoll(conf);
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
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
                rollFactors: pc.rollFactors
            },
            resistanceData: {
                consequence: {
                    name: "Shattered Knee",
                    icon: C.ConsequenceIcons[ConsequenceType.ProwessHarm3],
                    type: ConsequenceType.ProwessHarm3,
                    typeDisplay: C.ConsequenceDisplay[ConsequenceType.ProwessHarm3],
                    attribute: AttributeTrait.prowess,
                    resistedTo: {
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
/*~ @@DOUBLE-BLANK@@ ~*/
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
    AGENTS
}); /* !DEVCODE*/
// #endregion Globals
/*~ @@DOUBLE-BLANK@@ ~*/
// #region ████████ SYSTEM INITIALIZATION: Initializing Blades In The Dark System on 'Init' Hook ████████
Hooks.once("init", async () => {
    // Register System Settings
    registerSettings();
    eLog.display("Initializing Blades In the Dark System");
    /*~ @@DOUBLE-BLANK@@ ~*/
    // Initialize Fonts & Gsap Animations
    GsapInitialize();
    /*~ @@DOUBLE-BLANK@@ ~*/
    CONFIG.Item.documentClass = BladesItemProxy;
    CONFIG.Actor.documentClass = BladesActorProxy;
    CONFIG.ChatMessage.documentClass = BladesChat;
    /*~ @@DOUBLE-BLANK@@ ~*/
    // Register sheet application classes
    Actors.unregisterSheet("core", ActorSheet);
    Actors.registerSheet("blades", BladesCrewSheet, { types: ["crew"], makeDefault: true });
    Actors.registerSheet("blades", BladesFactionSheet, { types: ["faction"], makeDefault: true });
    Actors.registerSheet("blades", BladesNPCSheet, { types: ["npc"], makeDefault: true });
    /*~ @@DOUBLE-BLANK@@ ~*/
    Items.unregisterSheet("core", ItemSheet);
    Items.registerSheet("blades", BladesItemSheet, { types: C.ItemTypes, makeDefault: true });
    /*~ @@DOUBLE-BLANK@@ ~*/
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
        preloadHandlebarsTemplates()
    ]);
    /*~ @@DOUBLE-BLANK@@ ~*/
    registerHandlebarHelpers();
});
/*~ @@DOUBLE-BLANK@@ ~*/
Hooks.once("ready", () => {
    initCanvasStyles();
    initTinyMCEStyles();
});
// #endregion ▄▄▄▄▄ SYSTEM INITIALIZATION ▄▄▄▄▄
/*~ @@DOUBLE-BLANK@@ ~*/
// #region ░░░░░░░[SocketLib]░░░░ SocketLib Initialization ░░░░░░░ ~
Hooks.once("socketlib.ready", () => {
    socket = socketlib.registerSystem("eunos-blades");
    /* DEVCODE*/ Object.assign(globalThis, { socket, socketlib }); /* !DEVCODE*/
    /*~ @@DOUBLE-BLANK@@ ~*/
    BladesRoll.InitSockets();
    /*~ @@DOUBLE-BLANK@@ ~*/
    let clockOverlayUp;
    let pushControllerUp;
    /*~ @@DOUBLE-BLANK@@ ~*/
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
/*~ @@DOUBLE-BLANK@@ ~*/ 
