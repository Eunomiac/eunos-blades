/* ****▌███████████████████████████████████████████████████████████████████████████▐**** *\
|*     ▌█░░░░░░░░░ Euno's Blades in the Dark for Foundry VTT ░░░░░░░░░░░█▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░ by Eunomiac ░░░░░░░░░░░░░██████████████████▐     *|
|*     ▌█  License █ v0.1.0 ██▐     *|
|*     ▌████░░░░  ░░░░█████▐     *|
\* ****▌███████████████████████████████████████████████████████████████████████████▐**** */

import C, { ActionTrait, AttributeTrait, RollType, ConsequenceType, Position, RollResult } from "./core/constants.js";
import registerSettings, { initTinyMCEStyles, initCanvasStyles } from "./core/settings.js";
import { registerHandlebarHelpers, preloadHandlebarsTemplates } from "./core/helpers.js";
import BladesPushAlert from "./BladesPushAlert.js";
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
import BladesAI, { AGENTS } from "./core/ai.js";
import BladesActiveEffect from "./BladesActiveEffect.js";
import BladesGMTrackerSheet from "./sheets/item/BladesGMTrackerSheet.js";
import BladesClockKeeperSheet from "./sheets/item/BladesClockKeeperSheet.js";
import { updateClaims, updateContacts, updateOps, updateFactions, updateDescriptions, updateRollMods } from "./data-import/data-import.js";
CONFIG.debug.logging = false;
CONFIG.debug.logging = true;
Object.assign(globalThis, { eLog: logger });
Handlebars.registerHelper("eLog", logger.hbsLog); 
let socket;
class GlobalGetter {
    get roll() { return BladesRoll.Active; }
    get user() { return this.roll?.document; }
    get rollFlags() { return this.roll?.flagData; }
    get userFlags() { return this.user?.flags?.["eunos-blades"]?.rollCollab; }
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
                rollFactors: pc.rollFactors
            },
            consequenceData: {
                [Position.risky]: {
                    [RollResult.partial]: {
                        0: {
                            type: ConsequenceType.ProwessHarm2,
                            attribute: AttributeTrait.prowess,
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
                                typeDisplay: ""
                            },
                            icon: C.ConsequenceIcons[ConsequenceType.ProwessHarm2],
                            typeDisplay: C.ConsequenceDisplay[ConsequenceType.ProwessHarm2]
                        }
                    },
                    [RollResult.fail]: {
                        0: {
                            type: ConsequenceType.ProwessHarm2,
                            attribute: AttributeTrait.prowess,
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
                            icon: C.ConsequenceIcons[ConsequenceType.ProwessHarm2],
                            typeDisplay: C.ConsequenceDisplay[ConsequenceType.ProwessHarm2]
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

Object.assign(globalThis, {
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
        BladesGMTrackerSheet.Initialize(),
        BladesScore.Initialize(),
        BladesDialog.Initialize(),
        BladesClockKeeperSheet.Initialize(),
        BladesPushAlert.Initialize(),
        BladesRoll.Initialize(),
        preloadHandlebarsTemplates()
    ]);
    registerHandlebarHelpers();
});
Hooks.once("ready", () => {
    initCanvasStyles();
    initTinyMCEStyles();
});

Hooks.once("socketlib.ready", () => {
    socket = socketlib.registerSystem("eunos-blades");
    Object.assign(globalThis, { socket, socketlib });     
    BladesRoll.InitSockets();
    let clockOverlayUp;
    let pushControllerUp;
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