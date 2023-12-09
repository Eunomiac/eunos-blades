// #region ▮▮▮▮▮▮▮ IMPORTS ▮▮▮▮▮▮▮ ~
import C, {ActionTrait, ClockColor, AttributeTrait, RollType, ConsequenceType, Position, RollResult} from "./core/constants";
import registerSettings, {initTinyMCEStyles, initCanvasStyles, initDOMStyles} from "./core/settings";
import {registerHandlebarHelpers, preloadHandlebarsTemplates} from "./core/helpers";
import BladesPushAlert from "./BladesPushAlert";
import BladesChat from "./BladesChat";
import U from "./core/utilities";
import logger from "./core/logger";
import G, {Initialize as GsapInitialize} from "./core/gsap";
import BladesClock, {BladesClockKey} from "./documents/items/BladesClock";


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
import BladesRoll, {BladesRollMod, BladesRollPrimary, BladesRollOpposition, BladesRollParticipant} from "./BladesRoll";

import BladesDialog from "./BladesDialog";
import BladesAI, {AGENTS, AIAssistant} from "./core/ai";
import BladesActiveEffect from "./BladesActiveEffect";
import BladesGMTrackerSheet from "./sheets/item/BladesGMTrackerSheet";
import BladesClockKeeperSheet from "./sheets/item/BladesClockKeeperSheet";

CONFIG.debug.logging = false;
/* DEVCODE*/CONFIG.debug.logging = true;
Object.assign(globalThis, {eLog: logger});
Handlebars.registerHelper("eLog", logger.hbsLog); /* !DEVCODE*/

let socket: Socket; // ~ SocketLib interface

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
    const pc = game.actors.getName("Alistair") as BladesPC|undefined;
    if (!pc) {return; }
    const conf = {
      rollType: RollType.Action,
      rollTrait: ActionTrait.finesse,
      rollUserID: game.users.find((user) => user.character?.name === "Alistair")?.id as string,
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
      }) as Partial<
        Record<
          Position,
          Partial<
            Record<
              RollResult.partial | RollResult.fail,
              Record<
                string,
                BladesRoll.ConsequenceData
              >
            >
          >
        >
      >
    };
    BladesRoll.NewRoll(conf);
  }

  newResistanceRoll() {
    const pc = game.actors.getName("Alistair") as BladesPC|undefined;
    if (!pc) { return; }
    const conf = {
      rollType: RollType.Resistance,
      rollUserID: game.users.find((user) => user.character?.name === "Alistair")?.id as string,
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

  async addClockKey(
    keyName: string,
    clockNames: string[]
  ): Promise<{key: BladesClockKey, clocks: BladesClock[]}|undefined> {
    const {ClockKeeper: CK} = game.eunoblades ?? {};
    if (!CK) { return undefined; }
    const clocksData: Array<Partial<BladesClockSystemData>> = [];
    const [curClock] = U.sample(clockNames);
    const clocks: BladesClock[] = [];
    while (clockNames.length) {
      const name = clockNames.shift();
      const color = U.sample([ClockColor.white, ClockColor.red, ClockColor.yellow, ClockColor.cyan]);
      const [max] = U.sample([2, 3, 4, 5, 6, 8, 10, 12]);
      let value: number;
      if (curClock === name) {
        value = U.randInt(1, max-1);
      } else if (clockNames.includes(curClock)) {
        value = max;
      } else {
        value = 0;
      }

      clocksData.push({name, color, value, max});
    }
    const clockKey = await CK.addClockKey({
      sceneID: game.scenes.current?.id,
      name: keyName
    }, clocksData.shift());
    if (!clockKey) { return undefined; }
    while (clocksData.length) {
      await clockKey.addClock(clocksData.shift());
    }
    return {
      key: clockKey,
      clocks
    };
  }

  get clockKeys() { return game.eunoblades.ClockKeeper?.clockKeys; }
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
    BladesActor,
    BladesPC,
    BladesCrew,
    BladesNPC,
    BladesFaction,
    BladesPCSheet,
    BladesCrewSheet,
    BladesFactionSheet,
    BladesClock,
    BladesClockKey,
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
  }
);/* !DEVCODE*/
// #endregion Globals

// #region ████████ SYSTEM INITIALIZATION: Initializing Blades In The Dark System on 'Init' Hook ████████


Hooks.once("init", async () => {
  // Initialize Game object
  game.eunoblades = {
    Clocks: new Collection(),
    ClockKeys: new Collection(),
    Consequences: new Collection()
  };

  // Register System Settings
  registerSettings();
  eLog.display("Initializing Blades In the Dark System");


  // Initialize Fonts & Gsap Animations
  GsapInitialize();

  CONFIG.Item.documentClass = BladesItemProxy as unknown as typeof Item;
  CONFIG.Actor.documentClass = BladesActorProxy as unknown as typeof Actor;
  CONFIG.ChatMessage.documentClass = BladesChat;

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
    BladesDialog.Initialize(),
    BladesClockKeeperSheet.Initialize(),
    BladesPushAlert.Initialize(),
    BladesRoll.Initialize(),
    BladesProject.Initialize(),
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
  /* DEVCODE*/Object.assign(
    globalThis,
    {socket, socketlib}
  );/* !DEVCODE*/

  BladesRoll.InitSockets();

  let clockOverlayUp: boolean; let pushControllerUp: boolean;

  /**
   * Initializes the overlay sockets for the BladesClockKeeperSheet and BladesPushAlert.
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
      pushControllerUp = pushControllerUp || BladesPushAlert.InitSockets();
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
    labels: [1, 2, 3, 4, 5, 6].map((num) => `systems/eunos-blades/assets/dice/faces/${num}.webp`),
    system: "eunos-blades",
    bumpMaps: [1, 2, 3, 4, 5, 6].map((num) => `systems/eunos-blades/assets/dice/bump-maps/${num}.webp`),
    emissiveMaps: [undefined, undefined, undefined, undefined, undefined, "systems/eunos-blades/assets/dice/emission-maps/6.webp"],
    emissive: "#d89300"
  });
});
// #endregion ░░░░[Dice So Nice]░░░░
