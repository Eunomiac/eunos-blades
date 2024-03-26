// #region ▮▮▮▮▮▮▮ IMPORTS ▮▮▮▮▮▮▮ ~
/* eslint-disable @typescript-eslint/no-unused-vars */
import "../scss/style.scss";
// import "../scss/fonts.scss";
// import "../scss/tinymce/skin/skin.scss";
// import "../scss/tinymce/content.scss";
// import "../scss/tinymce/fonts.scss";
import C, {
  ActionTrait,
  ClockColor,
  ClockKeyDisplayMode,
  AttributeTrait,
  RollType,
  ConsequenceType,
  Position,
  RollResult
} from "./core/constants";
import registerSettings, {initTinyMCEStyles, initCanvasStyles, initDOMStyles} from "./core/settings";
import {registerHandlebarHelpers, preloadHandlebarsTemplates} from "./core/helpers";
import BladesChat from "./classes/BladesChat";
import U from "./core/utilities";
import logger from "./core/logger";
import G, {Initialize as GsapInitialize} from "./core/gsap";
import BladesClockKey from "./classes/BladesClockKey";
import BladesDirector from "./classes/BladesDirector";
import BladesConsequence from "./classes/BladesConsequence";
import BladesScene from "./classes/BladesScene";


import BladesActorProxy, {
  BladesActor,
  BladesPC,
  BladesCrew,
  BladesNPC,
  BladesFaction
} from "./documents/BladesActorProxy";
import BladesItemProxy, {
  BladesItem,
  BladesClockKeeper,
  BladesGMTracker,
  BladesLocation,
  BladesScore,
  BladesProject
} from "./documents/BladesItemProxy";

import BladesItemSheet from "./sheets/item/BladesItemSheet";
import BladesPCSheet from "./sheets/actor/BladesPCSheet";
import BladesCrewSheet from "./sheets/actor/BladesCrewSheet";
import BladesNPCSheet from "./sheets/actor/BladesNPCSheet";
import BladesFactionSheet from "./sheets/actor/BladesFactionSheet";
import BladesRoll, {
  BladesRollMod,
  BladesRollPrimary,
  BladesRollOpposition,
  BladesRollParticipant,
  BladesActionRoll,
  BladesEngagementRoll,
  BladesFortuneRoll,
  BladesIncarcerationRoll,
  BladesIndulgeViceRoll,
  BladesInlineResistanceRoll,
  BladesResistanceRoll
} from "./classes/BladesRoll";

import BladesDialog from "./classes/BladesDialog";
import BladesAI, {AGENTS} from "./core/ai";
import BladesActiveEffect from "./documents/BladesActiveEffect";
import BladesGMTrackerSheet from "./sheets/item/BladesGMTrackerSheet";
import BladesClockKeeperSheet from "./sheets/item/BladesClockKeeperSheet";

/* DEVCODE*/
import BladesDebug from "./core/debug";
CONFIG.debug.logging = true;
Object.assign(globalThis, {eLog: logger, BladesDebug});
Handlebars.registerHelper("eLog", logger.hbsLog);
/* !DEVCODE*/

let socket: Socket; // ~ SocketLib interface

/* eslint-enable @typescript-eslint/no-unused-vars */
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
    const pc = game.actors.getName("Alistair") as BladesPC|undefined;
    if (!pc) {return; }
    const conf: BladesRoll.Config = {
      target:          pc,
      targetFlagKey:   "rollCollab" as TargetFlagKey,
      rollType:        RollType.Action,
      rollTrait:       ActionTrait.finesse,
      rollUserID:      game.users.find((user) => user.character?.name === "Alistair")?.id as IDString,
      rollPrimaryData: pc
    };
    BladesActionRoll.New(conf);
  }

  // async newResistanceRoll() {
  //   const pc = game.actors.getName("Alistair") as BladesPC|undefined;
  //   if (!pc?.id) { return; }
  //   const csq = await BladesConsequence.Create({
  //     target: pc,
  //     targetFlagKey: "rollConsequence" as TargetFlagKey,
  //     name: "Shattered Knee",
  //     isScopingById: true,
  //     type: ConsequenceType.ProwessHarm3,
  //     primaryID: pc.uuid,
  //     attribute: AttributeTrait.prowess,
  //     attributeVal: 3,
  //     resistSchema: {
  //       name: "Banged Knee",
  //       type: ConsequenceType.ProwessHarm2,
  //       primaryID: pc.uuid,
  //       canResistWithSpecial: true,
  //       resistWithSpecialNegates: true,
  //       specialFooterMsg: "Ability: Spend to Fully Negate."
  //     },
  //     canResistWithRoll: true,
  //     canResistWithSpecial: true,
  //     resistWithSpecialNegates: true,
  //     specialFooterMsg: "Ability: Spend to Fully Negate."
  //   });
  //   const conf: BladesRoll.Config = {
  //     target: pc,
  //     targetFlagKey: "rollCollab" as TargetFlagKey,
  //     rollType: RollType.Resistance,
  //     rollUserID: game.users.find((user) => user.character?.name === "Alistair")?.id as IDString,
  //     rollPrimaryData: pc,
  //     resistanceData: {
  //       consequence: csq.data
  //     }
  //   };
  //   BladesResistanceRoll.New(conf);
  // }
}


// #region Globals: Exposing Functionality to Global Scope ~
/* DEVCODE*/Object.assign(
  globalThis,
  {
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
    BladesActionRoll,
    BladesEngagementRoll,
    BladesFortuneRoll,
    BladesIncarcerationRoll,
    BladesIndulgeViceRoll,
    BladesInlineResistanceRoll,
    BladesResistanceRoll,
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
    AGENTS
  }
);/* !DEVCODE*/
// #endregion Globals

// #region ████████ SYSTEM INITIALIZATION: Initializing Blades In The Dark System on 'Init' Hook ████████
Hooks.once("init", async () => {
  // Initialize Game object
  game.eunoblades = {
    Rolls:        new Collection<BladesRoll>(),
    ClockKeys:    new Collection<BladesClockKey>(),
    Consequences: new Collection<BladesConsequence>(),
    Director:     BladesDirector.getInstance(),
    Tooltips:     new WeakMap<HTMLElement, gsap.core.Timeline>()
  } as EunoBlades.Game;
  eLog.display("Initializing Blades In the Dark System");

  // Register System Settings
  registerSettings();
  CONFIG.debug.hooks = U.getSetting("debugHooks", "debugSettings") as boolean;

  // Initialize Fonts & Gsap Animations
  GsapInitialize();

  CONFIG.Item.documentClass = BladesItemProxy as unknown as typeof Item;
  CONFIG.Actor.documentClass = BladesActorProxy as unknown as typeof Actor;
  CONFIG.Scene.documentClass = BladesScene;
  CONFIG.ChatMessage.documentClass = BladesChat;

  // Register sheet application classes
  Actors.unregisterSheet("core", ActorSheet);

  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("blades", BladesItemSheet, {types: C.ItemTypes, makeDefault: true});

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
  /* DEVCODE*/Object.assign(
    globalThis,
    {socket, socketlib}
  );/* !DEVCODE*/
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
    type:         "d6",
    labels:       [1, 2, 3, 4, 5, 6].map((num) => `systems/eunos-blades/assets/dice/faces/${num}.webp`),
    system:       "eunos-blades",
    bumpMaps:     [1, 2, 3, 4, 5, 6].map((num) => `systems/eunos-blades/assets/dice/bump-maps/${num}.webp`),
    emissiveMaps: [undefined, undefined, undefined, undefined, undefined, "systems/eunos-blades/assets/dice/emission-maps/6.webp"],
    emissive:     "#d89300"
  });
});
// #endregion ░░░░[Dice So Nice]░░░░
