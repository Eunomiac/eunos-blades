// #region ▮▮▮▮▮▮▮ IMPORTS ▮▮▮▮▮▮▮ ~
import C from "./core/constants";
import registerSettings, {initTinyMCEStyles, initCanvasStyles} from "./core/settings";
import {registerHandlebarHelpers, preloadHandlebarsTemplates} from "./core/helpers";
import BladesPushController from "./BladesPushController";
import U from "./core/utilities";
import logger from "./core/logger";
import G, {Initialize as GsapInitialize} from "./core/gsap";


import BladesActorProxy, {BladesActor} from "./documents/BladesActorProxy";
import BladesItemProxy, {BladesItem, BladesClockKeeper, BladesGMTracker, BladesLocation, BladesScore} from "./documents/BladesItemProxy";

import BladesItemSheet from "./sheets/item/BladesItemSheet";
import BladesPCSheet from "./sheets/actor/BladesPCSheet";
import BladesCrewSheet from "./sheets/actor/BladesCrewSheet";
import BladesNPCSheet from "./sheets/actor/BladesNPCSheet";
import BladesFactionSheet from "./sheets/actor/BladesFactionSheet";
import BladesRollCollab, {BladesRollMod, BladesRollPrimary, BladesRollOpposition, BladesRollParticipant} from "./BladesRollCollab";

import BladesSelectorDialog from "./BladesDialog";
import BladesActiveEffect from "./BladesActiveEffect";
import BladesGMTrackerSheet from "./sheets/item/BladesGMTrackerSheet";
import BladesClockKeeperSheet from "./sheets/item/BladesClockKeeperSheet";
import {updateClaims, updateContacts, updateOps, updateFactions, updateDescriptions, updateRollMods} from "./data-import/data-import";

CONFIG.debug.logging = false;
/* DEVCODE*/CONFIG.debug.logging = true;
Object.assign(globalThis, {eLog: logger});
Handlebars.registerHelper("eLog", logger.hbsLog); /* !DEVCODE*/

let socket: Socket; // ~ SocketLib interface

// #endregion ▮▮▮▮[IMPORTS]▮▮▮▮

class GlobalGetter {
  get roll() { return BladesRollCollab.Active; }

  get user() { return this.roll?.document; }

  get rollFlags() { return this.roll?.flagData; }

  get userFlags() { return this.user?.flags?.["eunos-blades"]?.rollCollab; }

  get rollPrimary() { return this.roll?.rollPrimary; }

  get rollPrimaryDoc() { return this.roll?.rollPrimaryDoc; }

  get rollOpposition() { return this.roll?.rollOpposition; }

  get sheetData() { return this.roll?.getData(); }
}


// #region Globals: Exposing Functionality to Global Scope ~
/* DEVCODE*/Object.assign(
  globalThis,
  {
    get: new GlobalGetter(),
    updateClaims,
    updateContacts,
    updateOps,
    updateFactions,
    updateDescriptions,
    updateRollMods,
    BladesActor,
    BladesPCSheet,
    BladesCrewSheet,
    BladesFactionSheet,
    BladesNPCSheet,
    BladesActiveEffect,
    BladesPushController,
    BladesRollCollab,
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
    BladesGMTrackerSheet
  }
);/* !DEVCODE*/
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
    BladesGMTrackerSheet.Initialize(),
    BladesScore.Initialize(),
    BladesSelectorDialog.Initialize(),
    BladesClockKeeperSheet.Initialize(),
    BladesPushController.Initialize(),
    BladesRollCollab.Initialize(),
    preloadHandlebarsTemplates()
  ]);

  registerHandlebarHelpers();
});

Hooks.once("ready", () => {
  initCanvasStyles();
  initTinyMCEStyles();
});
// #endregion ▄▄▄▄▄ SYSTEM INITIALIZATION ▄▄▄▄▄

// #region ░░░░░░░[SocketLib]░░░░ SocketLib Initialization ░░░░░░░ ~
Hooks.once("socketlib.ready", () => {
  socket = socketlib.registerSystem("eunos-blades");
  /* DEVCODE*/Object.assign(
    globalThis,
    {socket, socketlib}
  );/* !DEVCODE*/

  BladesRollCollab.InitSockets();

  let clockOverlayUp: boolean; let pushControllerUp: boolean;

  /**
   * Initializes the overlay sockets for the BladesClockKeeperSheet and BladesPushController.
   * It checks every 2 seconds if the overlays are up and running.
   * If both overlays are up, it stops checking.
   *
   * @function
   * @name InitOverlaySockets
   * @returns {void}
   */
  function InitOverlaySockets(): void {
    setTimeout(() => {
      clockOverlayUp = clockOverlayUp || BladesClockKeeperSheet.InitSockets();
      pushControllerUp = clockOverlayUp || BladesPushController.InitSockets();
      if (clockOverlayUp && pushControllerUp) { return; }
      InitOverlaySockets();
    }, 2000);
  }
  InitOverlaySockets();
});
// #endregion ░░░░[SocketLib]░░░░

// #region ░░░░░░░[Dice So Nice]░░░░ Dice So Nice Integration ░░░░░░░ ~
type Dice3DController = {
  addSystem: (
    data: {
      id: string,
      name: string
    },
    status: string
  ) => void,
  addDicePreset: (
    data: {
      type: string,
      labels: string[],
      system: string,
      bumpMaps: string[],
      emissiveMaps: Array<string|undefined>,
      emissive: string
    }
  ) => void
};
Hooks.once("diceSoNiceReady", (dice3d: Dice3DController) => {
  dice3d.addSystem({id: "eunos-blades", name: "Euno's Blades"}, "preferred");
  dice3d.addDicePreset({
    type: "d6",
    labels: [1, 2, 3, 4, 5, 6].map(num => `systems/eunos-blades/assets/dice/faces/${num}.webp`),
    system: "eunos-blades",
    bumpMaps: [1, 2, 3, 4, 5, 6].map(num => `systems/eunos-blades/assets/dice/bump-maps/${num}.webp`),
    emissiveMaps: [undefined, undefined, undefined, undefined, undefined, "systems/eunos-blades/assets/dice/emission-maps/6.webp"],
    emissive: "#d89300"
  });
});
// #endregion ░░░░[Dice So Nice]░░░░
