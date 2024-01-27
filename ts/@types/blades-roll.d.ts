import {BladesActorType, BladesItemType, BladesPhase, RollType, RollSubType, RollModType, ConsequenceType, RollModStatus, RollModSection, ActionTrait, DowntimeAction, AttributeTrait, Position, Effect, Factor, RollPhase, RollResult} from "../core/constants";
import BladesActor from "../BladesActor";
import BladesItem from "../BladesItem";
import {BladesRollMod, BladesRollPrimary, BladesRollOpposition, BladesRollParticipant} from "../classes/BladesRoll";
import BladesClockKey from "../classes/BladesClocks";
import BladesTargetLink from "../classes/BladesTargetLink";

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

    export interface Config extends Partial<BladesTargetLink.Config> {
      rollType?: RollType,
      rollSubType?: RollSubType,
      rollUserID?: IDString,
      rollTrait?: RollTrait,
      rollDowntimeAction?: DowntimeAction,
      rollClockKey?: IDString|BladesClockKey,
      rollClockKeyID?: IDString,

      rollPrimaryData?: PrimaryDocData;
      rollOppData?: OppositionDocData;
      rollParticipantData?: RollParticipantDataSet,

      participantRollTo?: string,
      resistanceRollTo?: {
        id: string,
        userID: string,
        consequenceID: string
      },
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

      userPermissions?: Record<IDString, RollPermissions>
    }

    export interface Schema extends Omit<Config, "rollClockKey"|"rollPrimaryData"|"rollOppData"|"rollParticipantData"> {
      rollPrompt?: string;

      rollPrimaryData: Omit<PrimaryDocData, "rollPrimaryDoc">,
      rollOppData?: Omit<OppositionDocData, "rollOppDoc">,
      rollParticipantData?: RollParticipantFlagData,

      rollModsData: Record<IDString,BladesRollMod.Data>;

      rollPositionInitial: Position;
      rollEffectInitial: Effect;
      rollPosEffectTrade: "position"|"effect"|false,
      rollPhase: RollPhase,

      GMBoosts: Partial<Record<"Dice"|Factor|"Result",number>>,
      GMOppBoosts: Partial<Record<Factor,number>>,
      GMOverrides: Record<string,string>,
      rollFactorToggles: Record<
        "source"|"opposition",
        Partial<Record<Factor, FactorFlagData>>
      >,

      userPermissions: Record<IDString, RollPermissions>,

      template?: string,
      finalPosition?: Position,
      finalEffect?: Effect,
      rollResult?: number|false|RollResult,
      rollTraitVerb?: string,
      rollTraitPastVerb?: string,
      finalDiceData?: DieData[]
    }

    export interface Data extends BladesTargetLink.Data, Schema {}

    export interface Context extends Data {
      cssClass: string,
      editable: boolean,
      isGM: boolean,
      system?: BladesActorSystem|BladesItemSystem,

      rollMods: BladesRollMod[],
      rollPrimary: PrimaryDocData,
      rollTraitData: NamedValueMax & {gmTooltip?: string, pcTooltip?: string},
      rollTraitOptions: Array<{name: string, value: RollTrait}>,

      diceTotal: number,

      rollOpposition?: OppositionDocData,
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
      isAffectingResult: boolean,
      isAffectingAfter: boolean,
      rollResultFinal: number,

      rollTraitValOverride?: number,
      rollFactorPenaltiesNegated: Partial<Record<Factor,boolean>>,

      GMBoosts: Record<"Dice"|Factor|"Result",number>,
      GMOppBoosts: Record<Factor,number>,

      canTradePosition: boolean,
      canTradeEffect: boolean,

      posRollMods: Record<RollModSection, BladesRollMod[]>,
      negRollMods: Record<RollModSection, BladesRollMod[]>,
      hasInactiveConditionals: Record<RollModSection, boolean>,

      rollFactors: Record<"source"|"opposition", Partial<Record<Factor,FactorData>>>,

      oddsHTMLStart: string,
      oddsHTMLStop: string,
      costData?: Record<"footerLabel"|"tooltip",string>,

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

    export type PrimaryDocType =
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

    export interface PrimaryDocData {
      rollPrimaryID?: IDString,
      rollPrimaryDoc?: PrimaryDoc,
      rollPrimaryName: string,
      rollPrimaryType: PrimaryDocType,
      rollPrimaryImg: string,

      rollModsData: RollModData[],
      rollFactors: Partial<Record<Factor,FactorData>>

      applyHarm?(amount: num, name: num)
      applyWorsePosition?()
      spendArmor?()
      spendSpecialArmor?()
    }


    // [BladesItemType.cohort_gang]: BladesItemSchema.Cohort_Gang,
    // [BladesItemType.cohort_expert]: BladesItemSchema.Cohort_Expert,
    // [BladesItemType.gm_tracker]: BladesItemSchema.Gm_Tracker,
    // [BladesItemType.project]: BladesItemSchema.Project,
    // [BladesItemType.ritual]: BladesItemSchema.Ritual,
    // [BladesItemType.design]: BladesItemSchema.Design,
    // [BladesItemType.location]: BladesItemSchema.Location,
    // [BladesItemType.score]: BladesItemSchema.Score,

    export type OppositionDocType =
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

    export interface OppositionDocData {
      rollOppID?: IDString,
      rollOppDoc?: OppositionDoc,
      rollOppName: string,
      rollOppType: OppositionDocType,
      rollOppImg: string,
      rollOppSubName?: string,

      rollOppModsData?: RollModData[],
      rollFactors: Partial<Record<Factor,FactorData>>,

      rollOppClockKeyID?: IDString,
      rollOppClockKey?: BladesClockKey
    }

    export type ParticipantDocType =
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

    export interface ParticipantDocData {
      rollParticipantID?: IDString,
      rollParticipantDoc?: ParticipantDoc,
      rollParticipantName: string,
      rollParticipantType: ParticipantDocType,
      rollParticipantIcon: string,

      rollParticipantModsData?: RollModData[],                                   // As applied to MAIN roll when this participant involved
      rollFactors: Partial<Record<Factor,FactorData>>
    }

    export interface ParticipantSectionData {
      rollParticipantSection: KeyOf<Readonly<RollParticipantDocs>>,
      rollParticipantSubSection: RollParticipantSubSection
    }

    export type ParticipantConstructorData = ParticipantSectionData & Partial<ParticipantDocData>;


    export interface RollParticipantDataSet {
      [RollModSection.roll]?: {
        Assist?: ParticipantDocData & ParticipantSectionData,
        Group_1?: ParticipantDocData & ParticipantSectionData,
        Group_2?: ParticipantDocData & ParticipantSectionData,
        Group_3?: ParticipantDocData & ParticipantSectionData,
        Group_4?: ParticipantDocData & ParticipantSectionData,
        Group_5?: ParticipantDocData & ParticipantSectionData,
        Group_6?: ParticipantDocData & ParticipantSectionData,
      },
      [RollModSection.position]?: {
        Setup?: ParticipantDocData & ParticipantSectionData
      },
      [RollModSection.effect]?: {
        Setup?: ParticipantDocData & ParticipantSectionData
      }
    }

    export type RollParticipantData = Omit<ParticipantDocData, "rollParticipantDoc"> & ParticipantSectionData

    export interface RollParticipantFlagData {
      [RollModSection.roll]?: {
        Assist?: RollParticipantData,
        Group_1?: RollParticipantData,
        Group_2?: RollParticipantData,
        Group_3?: RollParticipantData,
        Group_4?: RollParticipantData,
        Group_5?: RollParticipantData,
        Group_6?: RollParticipantData,
      },
      [RollModSection.position]?: {
        Setup?: RollParticipantData
      },
      [RollModSection.effect]?: {
        Setup?: RollParticipantData
      }
    }

    export interface RollParticipantDocs {
      [RollModSection.roll]?: {
        Assist?: BladesRollParticipant,
        Group_1?: BladesRollParticipant,
        Group_2?: BladesRollParticipant,
        Group_3?: BladesRollParticipant,
        Group_4?: BladesRollParticipant,
        Group_5?: BladesRollParticipant,
        Group_6?: BladesRollParticipant,
      },
      [RollModSection.position]?: {
        Setup?: BladesRollParticipant
      },
      [RollModSection.effect]?: {
        Setup?: BladesRollParticipant
      }
    }

    export type RollParticipantSection = RollModSection.roll|RollModSection.position|RollModSection.effect;

    export type RollParticipantSubSection = "Assist"|"Group_1"|"Group_2"|"Group_3"|"Group_4"|"Group_5"|"Group_6"|"Setup";

  }
}