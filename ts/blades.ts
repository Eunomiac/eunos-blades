// #region ▮▮▮▮▮▮▮ IMPORTS ▮▮▮▮▮▮▮ ~
import C from "./core/constants.js";
import registerSettings, {initTinyMCEStyles, initCanvasStyles} from "./core/settings.js";
import {registerHandlebarHelpers, preloadHandlebarsTemplates} from "./core/helpers.js";
import BladesPushController from "./blades-push-notifications.js";
import U from "./core/utilities.js";
import registerDebugger from "./core/logger.js";
import G, {Initialize as GsapInitialize} from "./core/gsap.js";

import BladesActor from "./blades-actor.js";

import BladesActorProxy from "./documents/blades-actor-proxy.js";
import BladesItemProxy, {BladesItem, BladesClockKeeper, BladesGMTracker, BladesLocation, BladesScore} from "./documents/blades-item-proxy.js";

import BladesItemSheet from "./sheets/item/blades-item-sheet.js";
import BladesPCSheet from "./sheets/actor/blades-pc-sheet.js";
import BladesCrewSheet from "./sheets/actor/blades-crew-sheet.js";
import BladesNPCSheet from "./sheets/actor/blades-npc-sheet.js";
import BladesFactionSheet from "./sheets/actor/blades-faction-sheet.js";
import BladesRollCollab, {ApplyRollEffects, ApplyDescriptions} from "./blades-roll-collab.js";

import BladesSelectorDialog from "./blades-dialog.js";
import BladesActiveEffect from "./blades-active-effect.js";
import BladesTrackerSheet from "./sheets/item/blades-tracker-sheet.js";
import BladesClockKeeperSheet from "./sheets/item/blades-clock-keeper-sheet.js";
import {updateClaims, updateContacts, updateOps, updateFactions} from "./data-import/data-import.js";

CONFIG.debug.logging = false;
/*DEVCODE*/CONFIG.debug.logging = true; /*!DEVCODE*/

let socket: Socket; //~ SocketLib interface
registerDebugger();
// #endregion ▮▮▮▮[IMPORTS]▮▮▮▮

// #region Globals: Exposing Functionality to Global Scope ~
/*DEVCODE*/Object.assign(
  globalThis,
  {
    updateClaims,
    updateContacts,
    updateOps,
    updateFactions,
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
  }
);/*!DEVCODE*/
// #endregion Globals

// #region ████████ SYSTEM INITIALIZATION: Initializing Blades In The Dark System on 'Init' Hook ████████
Hooks.once("init", async () => {
  // Register System Settings
  registerSettings();
  eLog.display("Initializing Blades In the Dark System");

  // Initialize Fonts & Gsap Animations
  GsapInitialize();

  CONFIG.Item.documentClass = BladesItemProxy as unknown as typeof Item;
  CONFIG.Actor.documentClass = BladesActorProxy as unknown as typeof Actor;

  // Register sheet application classes
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("blades", BladesCrewSheet, {types: ["crew"], makeDefault: true});
  Actors.registerSheet("blades", BladesFactionSheet, {types: ["faction"], makeDefault: true});
  Actors.registerSheet("blades", BladesNPCSheet, {types: ["npc"], makeDefault: true});

  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("blades", BladesItemSheet, {types: C.ItemTypes, makeDefault: true});

  // Initialize subclasses
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
  // BladesRollCollab.NewRoll({
  //   rollPrimary: U.randElem(BladesActor.GetTypeWithTags(BladesActorType.pc)),
  //   rollType: RollType.Action,
  //   rollTrait: U.randElem(Object.values(Action))
  // });
  // @ts-expect-error Just never bothered to declare it's a global
  DebugPC();
});
// #endregion ▄▄▄▄▄ SYSTEM INITIALIZATION ▄▄▄▄▄

// #region ░░░░░░░[SocketLib]░░░░ SocketLib Initialization ░░░░░░░ ~
Hooks.once("socketlib.ready", () => {
  socket = socketlib.registerSystem("eunos-blades");
  /*DEVCODE*/Object.assign(
    globalThis,
    {socket, socketlib}
  );/*!DEVCODE*/

  BladesRollCollab.InitSockets();

  let clockOverlayUp: boolean, pushControllerUp: boolean;
  function InitOverlaySockets() {
    setTimeout(() => {
      clockOverlayUp = clockOverlayUp || BladesClockKeeperSheet.InitSockets();
      pushControllerUp = clockOverlayUp || BladesPushController.InitSockets();
      if (clockOverlayUp && pushControllerUp) { return }
      InitOverlaySockets();
    }, 2000);
  }
  InitOverlaySockets();
});
// #endregion ░░░░[SocketLib]░░░░

// #region ░░░░░░░[Dice So Nice]░░░░ Dice So Nice Integration ░░░░░░░ ~
type Dice3DController = {
  addSystem: (data: {id: string, name: string}, status: string) => void,
  addDicePreset: (data: {type: string, labels: string[], system: string, bumpMaps: string[], emissiveMaps: Array<string|undefined>, emissive: string}) => void
};
Hooks.once("diceSoNiceReady", (dice3d: Dice3DController) => {
  dice3d.addSystem({id: "eunos-blades", name: "Euno's Blades"}, "preferred");
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