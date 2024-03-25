// #region ▮▮▮▮▮▮▮ IMPORTS ▮▮▮▮▮▮▮ ~
/* eslint-disable @typescript-eslint/no-unused-vars */
import {BladesActorType, BladesItemType, BladesPhase, RollType, RollSubType, RollModType, RollPermissions, ConsequenceType, RollModStatus, RollModSection, ActionTrait, DowntimeAction, AttributeTrait, Position, Effect, Factor, RollPhase, RollResult} from "../core/constants";
import BladesActor from "../BladesActor";
import BladesItem from "../BladesItem";
import {BladesRollMod, BladesRollPrimary, BladesRollOpposition, BladesRollParticipant} from "../classes/BladesRoll";
import BladesClockKey from "../classes/BladesClockKey";
import BladesTargetLink from "../classes/BladesTargetLink";
/* eslint-enable @typescript-eslint/no-unused-vars */
// #endregion

declare global {

  namespace BladesRollMod {

    // export type Value = string|number|string[];

    export type Schema = {
      key: string,
      name: string,
      modType: RollModType,
      source_name?: string,
      section: RollModSection,
      posNeg: "positive"|"negative",

      base_status: RollModStatus,
      user_status?: RollModStatus,
      held_status?: RollModStatus,

      value: number,
      effectKeys?: string[],

      sideString?: string,
      tooltip: string,

      conditionalRollTypes?: BladesRoll.AnyRollType[],
      autoRollTypes?: BladesRoll.AnyRollType[],
      participantRollTypes?: BladesRoll.AnyRollType[],

      conditionalRollTraits?: BladesRoll.RollTrait[],
      autoRollTraits?: BladesRoll.RollTrait[],
      participantRollTraits?: BladesRoll.RollTrait[]
    }

    export type Config = BladesTargetLink.Config & Partial<Schema>;

    export type Data = BladesTargetLink.Data & Schema;
  }

  namespace BladesRoll {

    export type Schema = {
      rollType: RollType,
      rollSubType?: RollSubType,
      rollPrompt?: string;
      rollUserID?: IDString,
      rollTrait: RollTrait,
      rollDowntimeAction?: DowntimeAction,
      rollClockKey?: IDString,

      rollPrimaryData: PrimaryData;
      rollOppData?: OppositionData;
      rollParticipantData?: RollParticipantDataSet,

      // participantRollTo?: string,
      // resistanceRollTo?: {
      //   id: string,
      //   userID: string,
      //   consequenceID: string
      // },
      consequenceData?: Partial<Record<
        Position,
        Partial<Record<
          RollResult.partial|RollResult.fail,
          Record<
            IDString,
            BladesConsequence.Data
          >
        >>
      >>,
      resistanceData?: {
        consequence: BladesConsequence.Data
      },

      rollModsData: Record<IDString, BladesRollMod.Data>,

      rollPositionInitial: Position;
      rollEffectInitial: Effect;
      rollPosEffectTrade: "position"|"effect"|false,
      rollPhase: RollPhase,

      GMBoosts: Partial<Record<"Dice"|Factor|"Result", number>>,
      GMOppBoosts: Partial<Record<Factor, number>>,
      GMOverrides: Record<string, string>,
      rollFactorToggles: Record<
        "source"|"opposition",
        Partial<Record<Factor, FactorFlagData>>
      >,

      rollPositionFinal?: Position,
      rollEffectFinal?: Effect,
      rollResult?: number|false|RollResult,
      rollResultDelta?: number,
      rollResultFinal?: number|false|RollResult,
      rollTraitVerb?: string,
      rollTraitPastVerb?: string,
      finalDiceData?: DieData[],

      isInlineResistanceRoll?: boolean,

      userPermissions: Record<IDString, RollPermissions>
    }

    export type Config = BladesTargetLink.Config & Partial<Schema>;

    export type Data = BladesTargetLink.Data & Schema;

    export interface Context extends Data {
      cssClass: string,
      editable: boolean,
      isGM: boolean,
      system?: BladesActorSystem|BladesItemSystem,

      rollMods: BladesRollMod[],
      rollPrimary: BladesRollPrimary,
      rollTraitData: NamedValueMax & {gmTooltip?: string, pcTooltip?: string},
      rollTraitOptions: Array<{name: string, value: RollTrait}>,

      diceTotal: number,

      rollOpposition?: BladesRollOpposition,
      rollParticipants?: RollParticipantDocs,

      rollClockKey?: BladesClockKey,

      rollPositions: Position[],
      rollEffects: Effect[],
      rollParticipantOptions: Record<
        "Assist"|"Setup"|"Group",
        Array<BladesSelectOption<string>>
      >,
      rollPositionFinal: Position,
      rollEffectFinal: Effect,
      rollResultFinal: number|false|RollResult,
      rollResultDelta: number,
      isAffectingResult: boolean,
      isAffectingAfter: boolean,

      rollTraitValOverride?: number,
      rollFactorPenaltiesNegated: Partial<Record<Factor, boolean>>,

      GMBoosts: Record<"Dice"|Factor|"Result", number>,
      GMOppBoosts: Record<Factor, number>,

      canTradePosition: boolean,
      canTradeEffect: boolean,

      posRollMods: Record<RollModSection, BladesRollMod[]>,
      negRollMods: Record<RollModSection, BladesRollMod[]>,
      hasInactiveConditionals: Record<RollModSection, boolean>,

      rollFactors: Record<"source"|"opposition", Partial<Record<Factor, FactorData>>>,

      oddsHTMLStart: string,
      oddsHTMLStop: string,

      totalStressCost: number,
      totalArmorCost: number,
      stressCosts?: Record<string, number>,
      armorCosts?: Record<string, string>,
      specArmorCost?: string,

      userPermission: RollPermissions,
      gamePhase: BladesPhase,
      canDoDowntimeActions?: boolean,
      downtimeActionsRemaining?: number,
      downtimeActionOptions?: Array<BladesSelectOption<string, DowntimeAction>>,
      projectSelectOptions?: Array<BladesSelectOption<string, string>>
    }

    export type CostData = {
      id: string,
      label: string,
      costType: string,
      costAmount: number
    }

    export type AnyRollType = RollType|RollSubType|DowntimeAction;
    export type RollTrait = ActionTrait|AttributeTrait|Factor|number|""|"heat"|"coin"|"lifestyle";

    export type FactorToggle = "isActive"|"isPrimary"|"isDominant"|"highFavorsPC";

    export interface FactorFlagData extends Partial<NamedValueMax> {
      display: string,

      isActive?: boolean,
      isPrimary?: boolean,
      isDominant?: boolean,
      highFavorsPC?: boolean
    }

    export interface FactorData
      extends Required<FactorFlagData> {
        baseVal: number,
        cssClasses?: string
    }

    export type DieData = {
      value: number,
      dieClass: string,
      dieImage: string
    }

    export type PrimaryType =
     BladesActorType.pc
    |BladesActorType.crew
    |BladesActorType.npc
    |BladesItemType.cohort_gang
    |BladesItemType.cohort_expert
    |BladesItemType.gm_tracker
    |BladesItemType.score;

    export type PrimaryDoc =
       BladesActorOfType<BladesActorType.pc>
      |BladesActorOfType<BladesActorType.crew>
      |BladesItemOfType<BladesItemType.cohort_gang>
      |BladesItemOfType<BladesItemType.cohort_expert>
      |BladesItemOfType<BladesItemType.gm_tracker>
      |BladesItemOfType<BladesItemType.score>;

    export interface PrimaryData {
      rollPrimaryID?: IDString,
      rollPrimaryName: string,
      rollPrimaryType: PrimaryType,
      rollPrimaryImg: string,

      rollPrimaryModsSchemaSet: BladesRollMod.Schema[],
      rollFactors: Partial<Record<Factor, FactorData>>
    }

    export type OppositionType =
       BladesActorType.npc
      |BladesActorType.faction
      |BladesItemType.cohort_gang
      |BladesItemType.cohort_expert
      |BladesItemType.gm_tracker
      |BladesItemType.score
      |BladesItemType.location
      |BladesItemType.project
      |BladesItemType.design
      |BladesItemType.ritual;

    export type OppositionDoc =
       BladesActorOfType<BladesActorType.npc>
      |BladesActorOfType<BladesActorType.faction>
      |BladesItemOfType<BladesItemType.cohort_gang>
      |BladesItemOfType<BladesItemType.cohort_expert>
      |BladesItemOfType<BladesItemType.gm_tracker>
      |BladesItemOfType<BladesItemType.score>
      |BladesItemOfType<BladesItemType.location>
      |BladesItemOfType<BladesItemType.project>
      |BladesItemOfType<BladesItemType.design>
      |BladesItemOfType<BladesItemType.ritual>;

    export interface OppositionData {
      rollOppID?: IDString,
      rollOppName: string,
      rollOppType: OppositionType,
      rollOppImg: string,
      rollOppSubName?: string,

      rollOppModsSchemaSet?: BladesRollMod.Schema[],
      rollFactors: Partial<Record<Factor, FactorData>>
    }

    export type ParticipantType =
       BladesActorType.pc
      |BladesActorType.crew
      |BladesActorType.npc
      |BladesItemType.cohort_gang
      |BladesItemType.cohort_expert
      |BladesItemType.gm_tracker

    export type ParticipantDoc =
      BladesActorOfType<BladesActorType.pc>
      |BladesActorOfType<BladesActorType.crew>
      |BladesActorOfType<BladesActorType.npc>
      |BladesItemOfType<BladesItemType.cohort_gang>
      |BladesItemOfType<BladesItemType.cohort_expert>
      |BladesItemOfType<BladesItemType.gm_tracker>;


    export interface ParticipantData {
      rollParticipantID?: IDString,
      rollParticipantName: string,
      rollParticipantType: ParticipantType,
      rollParticipantIcon: string,

      rollParticipantModsSchemaSet?: BladesRollMod.Schema[],
      rollFactors: Partial<Record<Factor, FactorData>>
    }

    export type ParticipantSection = RollModSection.roll|RollModSection.position|RollModSection.effect;
    export type ParticipantSubSection = "Assist"|"Group_1"|"Group_2"|"Group_3"|"Group_4"|"Group_5"|"Group_6"|"Setup";

    export interface RollParticipantDataSet {
      [RollModSection.roll]?: Partial<Record<Exclude<ParticipantSubSection, "Setup">, ParticipantData>>,
      [RollModSection.position]?: Partial<Record<"Setup", ParticipantData>>,
      [RollModSection.effect]?: Partial<Record<"Setup", ParticipantData>>
    }

    export interface RollParticipantDocs {
      [RollModSection.roll]?: Partial<Record<Exclude<ParticipantSubSection, "Setup">, BladesRollParticipant>>,
      [RollModSection.position]?: Partial<Record<"Setup", BladesRollParticipant>>,
      [RollModSection.effect]?: Partial<Record<"Setup", BladesRollParticipant>>
    }


  }
}
