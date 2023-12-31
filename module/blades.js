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
import BladesRoll, { BladesRollMod, BladesRollPrimary, BladesRollOpposition, BladesRollParticipant } from "./classes/BladesRoll.js";
import BladesDialog from "./classes/BladesDialog.js";
import BladesAI, { AGENTS, AIAssistant } from "./core/ai.js";
import BladesActiveEffect from "./documents/BladesActiveEffect.js";
import BladesGMTrackerSheet from "./sheets/item/BladesGMTrackerSheet.js";
import BladesClockKeeperSheet from "./sheets/item/BladesClockKeeperSheet.js";
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
            consequenceData: ({
                desperate: {
                    partial: {
                        WCgccQS5BVoLHFTk: {
                            id: "WCgccQS5BVoLHFTk",
                            name: "",
                            type: "",
                            attribute: "",
                            resistOptions: {},
                            isDisplayingArmorToggle: false,
                            isDisplayingSpecialArmorToggle: false
                        },
                        "8s2qXX84c0cGCoiU": {
                            id: "8s2qXX84c0cGCoiU",
                            name: "",
                            type: "",
                            attribute: "",
                            resistOptions: {},
                            isDisplayingArmorToggle: false,
                            isDisplayingSpecialArmorToggle: false
                        },
                        UIw8B5LmzQnOOwdw: {
                            id: "UIw8B5LmzQnOOwdw",
                            name: "",
                            type: "",
                            attribute: "",
                            resistOptions: {},
                            isDisplayingArmorToggle: false,
                            isDisplayingSpecialArmorToggle: false
                        }
                    },
                    fail: {
                        KDVJ3QIJlvSNmWk8: {
                            id: "KDVJ3QIJlvSNmWk8",
                            name: "",
                            type: "",
                            attribute: "",
                            resistOptions: {},
                            isDisplayingArmorToggle: false,
                            isDisplayingSpecialArmorToggle: false
                        },
                        XjUTS73iOLrFJ710: {
                            id: "XjUTS73iOLrFJ710",
                            name: "",
                            type: "",
                            attribute: "",
                            resistOptions: {},
                            isDisplayingArmorToggle: false,
                            isDisplayingSpecialArmorToggle: false
                        },
                        qTWmIIhsSKFSBoUS: {
                            id: "qTWmIIhsSKFSBoUS",
                            name: "",
                            type: "",
                            attribute: "",
                            resistOptions: {},
                            isDisplayingArmorToggle: false,
                            isDisplayingSpecialArmorToggle: false
                        }
                    }
                },
                risky: {
                    partial: {
                        "3krJpcl6edfLnBzQ": {
                            id: "3krJpcl6edfLnBzQ",
                            name: "Explosive Decompression",
                            type: "ComplicationMajor",
                            attribute: "prowess",
                            icon: "complication-major",
                            typeDisplay: "Major Complication",
                            attributeVal: 4,
                            resistOptions: {
                                "5NPjYJCW5gfj83wh": {
                                    id: "5NPjYJCW5gfj83wh",
                                    name: "Sudden Pressure Surge",
                                    isSelected: true,
                                    type: "ComplicationMinor",
                                    typeDisplay: "Minor Complication",
                                    icon: "complication-minor"
                                },
                                l3ujzWVuDtcxo7Vq: {
                                    id: "l3ujzWVuDtcxo7Vq",
                                    name: "Air Leak Detected",
                                    isSelected: false,
                                    type: "ComplicationMinor",
                                    typeDisplay: "Minor Complication",
                                    icon: "complication-minor",
                                    isVisible: false
                                },
                                Ks20FRMOuVQyzGN9: {
                                    id: "Ks20FRMOuVQyzGN9",
                                    name: "Emergency Oxygen Masks Deployed",
                                    isSelected: false,
                                    type: "ComplicationMinor",
                                    typeDisplay: "Minor Complication",
                                    icon: "complication-minor",
                                    isVisible: false
                                }
                            },
                            isDisplayingArmorToggle: true,
                            armorTo: {
                                id: "5NPjYJCW5gfj83wh",
                                name: "Sudden Pressure Surge",
                                isSelected: true,
                                type: "ComplicationMinor",
                                typeDisplay: "Minor Complication",
                                icon: "complication-minor"
                            },
                            isDisplayingSpecialArmorToggle: false,
                            canArmor: true,
                            resistTo: {
                                id: "5NPjYJCW5gfj83wh",
                                name: "Sudden Pressure Surge",
                                isSelected: true,
                                type: "ComplicationMinor",
                                typeDisplay: "Minor Complication",
                                icon: "complication-minor"
                            }
                        },
                        CxkiRDvm16DxvthM: {
                            id: "CxkiRDvm16DxvthM",
                            name: "Shell-Shocked",
                            type: "ResolveHarm2",
                            attribute: "resolve",
                            attributeVal: 4,
                            resistOptions: {
                                "7Y44iMGzSWEJeNMm": {
                                    id: "7Y44iMGzSWEJeNMm",
                                    name: "Startled",
                                    isSelected: false,
                                    type: "ResolveHarm1",
                                    typeDisplay: "Level 1 Harm (Lesser)",
                                    icon: "harm-resolve-1",
                                    isVisible: false
                                },
                                kXoLCjFoH7CgRfgr: {
                                    id: "kXoLCjFoH7CgRfgr",
                                    name: "Nervous",
                                    isSelected: true,
                                    type: "ResolveHarm1",
                                    typeDisplay: "Level 1 Harm (Lesser)",
                                    icon: "harm-resolve-1"
                                },
                                XJnFjOrtGowbRPKY: {
                                    id: "XJnFjOrtGowbRPKY",
                                    name: "Jumpy",
                                    isSelected: false,
                                    type: "ResolveHarm1",
                                    typeDisplay: "Level 1 Harm (Lesser)",
                                    icon: "harm-resolve-1",
                                    isVisible: false
                                }
                            },
                            isDisplayingArmorToggle: false,
                            isDisplayingSpecialArmorToggle: false,
                            icon: "harm-resolve-2",
                            typeDisplay: "Level 2 Harm (Moderate)",
                            resistTo: {
                                id: "kXoLCjFoH7CgRfgr",
                                name: "Nervous",
                                isSelected: true,
                                type: "ResolveHarm1",
                                typeDisplay: "Level 1 Harm (Lesser)",
                                icon: "harm-resolve-1"
                            }
                        },
                        "5d8etRkLjrulOpKF": {
                            id: "5d8etRkLjrulOpKF",
                            name: "Confused",
                            type: "InsightHarm1",
                            attribute: "insight",
                            attributeVal: 1,
                            resistOptions: {
                                Gnx6n9ZUMAK9ZZEC: {
                                    id: "Gnx6n9ZUMAK9ZZEC",
                                    name: "",
                                    type: "None",
                                    isSelected: true,
                                    isVisible: true
                                }
                            },
                            isDisplayingArmorToggle: false,
                            isDisplayingSpecialArmorToggle: false,
                            icon: "harm-insight-1",
                            typeDisplay: "Level 1 Harm (Lesser)",
                            resistNegates: true,
                            resistTo: {
                                id: "Gnx6n9ZUMAK9ZZEC",
                                name: "",
                                type: "None",
                                isSelected: true,
                                isVisible: true
                            }
                        }
                    },
                    fail: {
                        RDqp6dCAEnncofpu: {
                            id: "RDqp6dCAEnncofpu",
                            name: "Explosive Decompression",
                            type: "ComplicationMajor",
                            attribute: "prowess",
                            attributeVal: 4,
                            resistOptions: {
                                kQu51ZlkNHU3KfWc: {
                                    id: "kQu51ZlkNHU3KfWc",
                                    name: "Sudden Pressure Surge",
                                    type: "ComplicationMinor",
                                    isSelected: true,
                                    icon: "complication-minor",
                                    typeDisplay: "Minor Complication"
                                }
                            },
                            isDisplayingArmorToggle: true,
                            isDisplayingSpecialArmorToggle: false,
                            icon: "complication-major",
                            typeDisplay: "Major Complication",
                            armorTo: {
                                id: "kQu51ZlkNHU3KfWc",
                                name: "Sudden Pressure Surge",
                                type: "ComplicationMinor",
                                isSelected: true,
                                icon: "complication-minor",
                                typeDisplay: "Minor Complication"
                            },
                            canArmor: true,
                            resistTo: {
                                id: "kQu51ZlkNHU3KfWc",
                                name: "Sudden Pressure Surge",
                                type: "ComplicationMinor",
                                isSelected: true,
                                icon: "complication-minor",
                                typeDisplay: "Minor Complication"
                            }
                        },
                        rf2iz18iaEu7LQAO: {
                            id: "rf2iz18iaEu7LQAO",
                            name: "Shell-Shocked",
                            type: "ResolveHarm2",
                            attribute: "resolve",
                            attributeVal: 4,
                            resistOptions: {
                                "3oMnNsTtCkpZHr3f": {
                                    id: "3oMnNsTtCkpZHr3f",
                                    name: "Nervous",
                                    type: "ResolveHarm1",
                                    isSelected: true,
                                    icon: "harm-resolve-1",
                                    typeDisplay: "Level 1 Harm (Lesser)"
                                }
                            },
                            isDisplayingArmorToggle: false,
                            isDisplayingSpecialArmorToggle: false,
                            icon: "harm-resolve-2",
                            typeDisplay: "Level 2 Harm (Moderate)",
                            resistTo: {
                                id: "3oMnNsTtCkpZHr3f",
                                name: "Nervous",
                                type: "ResolveHarm1",
                                isSelected: true,
                                icon: "harm-resolve-1",
                                typeDisplay: "Level 1 Harm (Lesser)"
                            }
                        },
                        mOwl4dKt0gQJRj51: {
                            id: "mOwl4dKt0gQJRj51",
                            name: "Confused",
                            type: "InsightHarm2",
                            attribute: "insight",
                            attributeVal: 1,
                            resistOptions: {
                                KBLDmiqB7OkziuSX: {
                                    id: "KBLDmiqB7OkziuSX",
                                    name: "Distracted",
                                    isSelected: false,
                                    type: "InsightHarm1",
                                    typeDisplay: "Level 1 Harm (Lesser)",
                                    icon: "harm-insight-1",
                                    isVisible: false
                                },
                                qJzMMsnIW1HKnQBv: {
                                    id: "qJzMMsnIW1HKnQBv",
                                    name: "Disoriented",
                                    isSelected: true,
                                    type: "InsightHarm1",
                                    typeDisplay: "Level 1 Harm (Lesser)",
                                    icon: "harm-insight-1"
                                },
                                aQFwNrHehUfwmjc3: {
                                    id: "aQFwNrHehUfwmjc3",
                                    name: "Bewildered",
                                    isSelected: false,
                                    type: "InsightHarm1",
                                    typeDisplay: "Level 1 Harm (Lesser)",
                                    icon: "harm-insight-1",
                                    isVisible: false
                                }
                            },
                            isDisplayingArmorToggle: false,
                            isDisplayingSpecialArmorToggle: false,
                            icon: "harm-insight-2",
                            typeDisplay: "Level 2 Harm (Moderate)",
                            resistTo: {
                                id: "qJzMMsnIW1HKnQBv",
                                name: "Disoriented",
                                isSelected: true,
                                type: "InsightHarm1",
                                typeDisplay: "Level 1 Harm (Lesser)",
                                icon: "harm-insight-1"
                            }
                        }
                    }
                },
                controlled: {
                    partial: {
                        jTyFkKM8tTyRb6AE: {
                            id: "jTyFkKM8tTyRb6AE",
                            name: "",
                            type: "",
                            attribute: "",
                            resistOptions: {},
                            isDisplayingArmorToggle: false,
                            isDisplayingSpecialArmorToggle: false
                        },
                        w5mTqhi63mBPpEoS: {
                            id: "w5mTqhi63mBPpEoS",
                            name: "",
                            type: "",
                            attribute: "",
                            resistOptions: {},
                            isDisplayingArmorToggle: false,
                            isDisplayingSpecialArmorToggle: false
                        },
                        J36HU1WybmWpcBus: {
                            id: "J36HU1WybmWpcBus",
                            name: "",
                            type: "",
                            attribute: "",
                            resistOptions: {},
                            isDisplayingArmorToggle: false,
                            isDisplayingSpecialArmorToggle: false
                        }
                    },
                    fail: {
                        pvkDlaMJgjAtU7Sj: {
                            id: "pvkDlaMJgjAtU7Sj",
                            name: "",
                            type: "",
                            attribute: "",
                            resistOptions: {},
                            isDisplayingArmorToggle: false,
                            isDisplayingSpecialArmorToggle: false
                        },
                        acuEOIEjhKA7srE8: {
                            id: "acuEOIEjhKA7srE8",
                            name: "",
                            type: "",
                            attribute: "",
                            resistOptions: {},
                            isDisplayingArmorToggle: false,
                            isDisplayingSpecialArmorToggle: false
                        },
                        "2UNu4fSNRD80bvpe": {
                            id: "2UNu4fSNRD80bvpe",
                            name: "",
                            type: "",
                            attribute: "",
                            resistOptions: {},
                            isDisplayingArmorToggle: false,
                            isDisplayingSpecialArmorToggle: false
                        }
                    }
                }
            })
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
    get clockKeys() { return game.eunoblades.ClockKeeper?.clockKeys; }
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
        ClockKeys: new Collection(),
        Consequences: new Collection(),
        Director: BladesDirector.getInstance()
    };
    // Register System Settings
    registerSettings();
    CONFIG.debug.hooks = U.getSetting("debugHooks");
    eLog.display("Initializing Blades In the Dark System");
    // Initialize Fonts & Gsap Animations
    GsapInitialize();
    CONFIG.Item.documentClass = BladesItemProxy;
    CONFIG.Actor.documentClass = BladesActorProxy;
    CONFIG.Scene.documentClass = BladesScene;
    CONFIG.ChatMessage.documentClass = BladesChat;
    // Register sheet application classes
    Actors.unregisterSheet("core", ActorSheet);
    Actors.registerSheet("blades", BladesCrewSheet, { types: ["crew"], makeDefault: true });
    Actors.registerSheet("blades", BladesFactionSheet, { types: ["faction"], makeDefault: true });
    Actors.registerSheet("blades", BladesNPCSheet, { types: ["npc"], makeDefault: true });
    Items.unregisterSheet("core", ItemSheet);
    Items.registerSheet("blades", BladesItemSheet, { types: C.ItemTypes, makeDefault: true });
    registerHandlebarHelpers();
    preloadHandlebarsTemplates();
    // Initialize preliminary classes with templates to load
    await Promise.all([
        BladesPCSheet.Initialize(),
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
    await BladesDirector.getInstance().renderOverlay();
    BladesDirector.InitSockets();
    BladesRoll.InitSockets();
    BladesClockKeeper.InitSockets();
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
