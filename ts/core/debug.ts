/* eslint-disable @typescript-eslint/no-unused-vars */
// #region ▮▮▮▮▮▮▮ IMPORTS ▮▮▮▮▮▮▮ ~
import C, {BladesActorType, BladesItemType, RollPermissions, ActionTrait, DowntimeAction, RollSubType, RollPhase, Effect, ClockColor, ClockKeyDisplayMode, AttributeTrait, RollType, ConsequenceType, Position, RollResult} from "../core/constants";
import registerSettings, {initTinyMCEStyles, initCanvasStyles, initDOMStyles} from "../core/settings";
import {registerHandlebarHelpers, preloadHandlebarsTemplates} from "../core/helpers";
import BladesChat from "../classes/BladesChat";
import U from "../core/utilities";
import logger from "../core/logger";
import G, {Initialize as GsapInitialize} from "../core/gsap";
import BladesClockKey from "../classes/BladesClocks";
import BladesDirector from "../classes/BladesDirector";
import BladesConsequence from "../classes/BladesConsequence";
import BladesScene from "../classes/BladesScene";


import BladesActorProxy, {
  BladesActor,
  BladesPC,
  BladesCrew,
  BladesNPC,
  BladesFaction
} from "../documents/BladesActorProxy";
import BladesItemProxy, {
  BladesItem,
  BladesClockKeeper,
  BladesGMTracker,
  BladesLocation,
  BladesScore,
  BladesProject
} from "../documents/BladesItemProxy";

import BladesItemSheet from "../sheets/item/BladesItemSheet";
import BladesPCSheet from "../sheets/actor/BladesPCSheet";
import BladesCrewSheet from "../sheets/actor/BladesCrewSheet";
import BladesNPCSheet from "../sheets/actor/BladesNPCSheet";
import BladesFactionSheet from "../sheets/actor/BladesFactionSheet";
import BladesRoll, {BladesRollMod, BladesRollPrimary, BladesRollOpposition, BladesRollParticipant, BladesActionRoll, BladesEngagementRoll, BladesFortuneRoll, BladesIncarcerationRoll, BladesIndulgeViceRoll, BladesInlineResistanceRoll, BladesResistanceRoll} from "../classes/BladesRoll";

import BladesDialog from "../classes/BladesDialog";
import BladesAI, {AGENTS, AIAssistant} from "../core/ai";
import BladesActiveEffect from "../documents/BladesActiveEffect";
import BladesGMTrackerSheet from "../sheets/item/BladesGMTrackerSheet";
import BladesClockKeeperSheet from "../sheets/item/BladesClockKeeperSheet";
// #endregion ▮▮▮▮[IMPORTS]▮▮▮▮

class BladesDebug {

  static async GetSampleSchemas() {
    // Documents
    const SAMPLE_USER_NAME = "Alistair" as const;
    const SAMPLE_PC_NAME = "Alistair" as const;
    const SAMPLE_NPC_NAME = "Setarra" as const;

    const sampleUser = game.users.getName(SAMPLE_USER_NAME);
    if (!sampleUser) {
      throw new Error(`Sample user with name "${SAMPLE_USER_NAME}" not found.`);
    }
    const samplePC = game.actors.getName(SAMPLE_PC_NAME);
    if (!BladesPC.IsType(samplePC)) {
      throw new Error(`Sample BladesPC with name "${SAMPLE_PC_NAME}" not found.`);
    }
    const sampleNPC: BladesActor|BladesNPC|undefined = game.actors.getName(SAMPLE_NPC_NAME);
    if (!BladesNPC.IsType(sampleNPC)) {
      throw new Error(`Sample BladesNPC with name "${SAMPLE_NPC_NAME}" not found or is not a valid BladesNPC.`);
    }

    // BladesActionRoll
    const BladesActionRoll_Schema: BladesRoll.Schema = {
      rollType: RollType.Action,
      // rollSubType: RollSubType.GatherInfo,
      // rollPrompt: "Gathering Information",
      rollTrait: ActionTrait.skirmish,
      // rollUserID: sampleUser.id,
      // rollDowntimeAction: DowntimeAction.AcquireAsset,
      // rollClockKey: U.getLast(game.eunoblades.ClockKeys.contents)?.id,

      rollPrimaryData: BladesRollPrimary.GetDataFromDoc(samplePC),
      // rollOppData: sampleNPC,
      // rollParticipantData: {},

      // consequenceData: {},
      // resistanceData: {
      //   consequence: {}
      // },

      rollModsData: {},

      rollPositionInitial: Position.risky,
      rollEffectInitial: Effect.standard,
      rollPosEffectTrade: false,
      rollPhase: RollPhase.Collaboration,

      GMBoosts: {},
      GMOppBoosts: {},
      GMOverrides: {},
      rollFactorToggles: {
        source: {},
        opposition: {}
      },

      userPermissions: {
        [sampleUser.id]: RollPermissions.Primary
      }

      // rollPositionFinal: Position.risky,
      // rollEffectFinal: Effect.standard,
      // rollResult: RollResult.success,
      // rollResultDelta: 0,
      // rollResultFinal: RollResult.success,
      // rollTraitVerb: "skirmishes",
      // rollTraitPastVerb: "skirmished",
      // finalDiceData: [],

      // isInlineResistanceRoll: false
    };

    return {
      BladesActionRoll_Schema
    };
  }
}

export default BladesDebug;
