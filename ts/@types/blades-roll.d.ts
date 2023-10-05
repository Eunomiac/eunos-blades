import {BladesActorType, BladesItemType, RollType, RollSubType, ConsequenceType, RollModStatus, RollModSection, ActionTrait, DowntimeAction, AttributeTrait, Position, Effect, Factor} from "../core/constants.js";
import BladesActor from "../BladesActor.js";
import BladesItem from "../BladesItem.js";
import {BladesRollMod, BladesRollCollabComps} from "../BladesRollCollab.js";

declare global {

  namespace BladesRollCollab {

    export interface RollParticipantData {
      [RollModSection.roll]?: {
        Assist?: ParticipantDocData,
        Group_1?: ParticipantDocData,
        Group_2?: ParticipantDocData,
        Group_3?: ParticipantDocData,
        Group_4?: ParticipantDocData,
        Group_5?: ParticipantDocData,
        Group_6?: ParticipantDocData,
      },
      [RollModSection.position]?: {
        Setup?: ParticipantDocData
      },
      [RollModSection.effect]?: {
        Setup?: ParticipantDocData
      }
    }

    export interface RollParticipantDocs {
      [RollModSection.roll]?: {
        Assist?: BladesRollCollabComps.Participant,
        Group_1?: BladesRollCollabComps.Participant,
        Group_2?: BladesRollCollabComps.Participant,
        Group_3?: BladesRollCollabComps.Participant,
        Group_4?: BladesRollCollabComps.Participant,
        Group_5?: BladesRollCollabComps.Participant,
        Group_6?: BladesRollCollabComps.Participant,
      },
      [RollModSection.position]?: {
        Setup?: BladesRollCollabComps.Participant
      },
      [RollModSection.effect]?: {
        Setup?: BladesRollCollabComps.Participant
      }
    }

    export interface Config {
      rollType: RollType,
      rollUserID: string,
      rollPrimaryData: PrimaryDocData;
      rollOppData?: OppositionDocData;
      rollParticipantData?: RollParticipantData,
      rollSubType?: RollSubType,
      rollDowntimeAction?: DowntimeAction,
      rollTrait?: RollTrait,
      participantRollTo?: string
    }
    export type ConstructorConfig = Partial<Config> & Required<Pick<Config, "rollType">>;

    export interface ConsequenceData extends Partial<OppositionDocData> {
      type: ConsequenceType,
      attribute: AttributeTrait,
      label?: string
    }

    export type CostData = {
      id: string,
      label: string,
      costType: string,
      costAmount: number
    }

    export type FactorFlagData = {
      display: string,
      isActive?: boolean,
      isPrimary?: boolean,
      isDominant?: boolean,
      highFavorsPC?: boolean
    }

    export type ModType = BladesItemType | "general" | "harm" | "teamwork";

    export interface FlagData {
      rollID: string;
      rollType: RollType;
      rollSubType?: RollSubType;
      rollDowntimeAction?: DowntimeAction;

      rollPrimaryData: PrimaryDocData;
      rollOppData?: OppositionDocData;
      rollParticipantData?: RollParticipantData;
      rollTrait?: RollTrait;
      rollModsData: Record<string,RollModStatus>;
      rollPositionInitial: Position;
      rollEffectInitial: Effect;
      rollPosEffectTrade: "position"|"effect"|false,
      rollConsequence?: ConsequenceData,
      isGMReady: boolean,
      GMBoosts: Partial<Record<"Dice"|Factor|"Result",number>>,
      GMOppBoosts: Partial<Record<Factor,number>>,
      rollFactorToggles: Record<"source"|"opposition", Partial<Record<Factor, FactorFlagData>>>
    }

    export interface SheetData extends FlagData {
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

      rollPositions: Position[],
      rollEffects: Effect[],
      teamworkDocs: BladesActor[],
      rollPositionFinal: Position,
      rollEffectFinal: Effect,
      isAffectingResult: boolean,
      isAffectingAfter: boolean,
      rollResultFinal: number,

      rollTraitValOverride?: number,
      rollFactorPenaltiesNegated: Partial<Record<Factor,boolean>>,

      GMBoosts: Record<"Dice"|Factor|"Result",number>,
      GMOppBoosts: Record<Factor,number>

      canTradePosition: boolean,
      canTradeEffect: boolean,

      posRollMods: Record<RollModSection, BladesRollMod[]>,
      negRollMods: Record<RollModSection, BladesRollMod[]>,
      hasInactiveConditionals: Record<RollModSection, boolean>,

      rollFactors: Record<"source"|"opposition", Partial<Record<Factor,FactorData>>>,

      oddsGradient: string,
      oddsGradientTestHTML?: string,
      costData?: Record<"footerLabel"|"tooltip",string>
    }

    export type PartialSheetData = Partial<SheetData> & FlagData;

    export type AnyRollType = RollType|RollSubType|DowntimeAction;
    export type RollTrait = ActionTrait|AttributeTrait|Factor|number;

    export interface FactorData extends NamedValueMax {
      baseVal: number,
      display?: string,
      isActive: boolean,
      isPrimary: boolean,
      isDominant: boolean,
      highFavorsPC: boolean,
      cssClasses?: string
    }

    type RollModData = {
      id: string,
      name: string,
      source_name?: string,
      status?: RollModStatus, // Set to held_status ?? user_status ?? base_status at end of getData
      base_status: RollModStatus, // Original status; never changed
      user_status?: RollModStatus, // User-selected status
      held_status?: RollModStatus, // Re-checked for each getData
      value: number,
      effectKeys?: string[],
      sideString?: string,
      tooltip: string,
      posNeg: "positive"|"negative",
      isOppositional?: boolean,
      modType: BladesItemType|"general"|"harm"|"teamwork",
      conditionalRollTypes?: AnyRollType[],
      autoRollTypes?: AnyRollType[],
      participantRollTypes?: AnyRollType[],
      conditionalRollTraits?: RollTrait[],
      autoRollTraits?: RollTrait[],
      participantRollTraits?: RollTrait[],
      category: RollModSection
    }

    export type PrimaryDoc =
       BladesActorOfType<BladesActorType.pc>
      |BladesActorOfType<BladesActorType.crew>
      |BladesItemOfType<BladesItemType.cohort_gang>
      |BladesItemOfType<BladesItemType.cohort_expert>
      |BladesItemOfType<BladesItemType.gm_tracker>;

    export interface PrimaryDocData {
      rollPrimaryID?: string,
      rollPrimaryDoc?: PrimaryDoc,
      rollPrimaryName: string,
      rollPrimaryType: string,
      rollPrimaryImg: string,

      rollModsData: RollModData[],
      rollFactors: Partial<Record<Factor,FactorData>>
    }


    // [BladesItemType.cohort_gang]: BladesItemSchema.Cohort_Gang,
    // [BladesItemType.cohort_expert]: BladesItemSchema.Cohort_Expert,
    // [BladesItemType.gm_tracker]: BladesItemSchema.Gm_Tracker,
    // [BladesItemType.project]: BladesItemSchema.Project,
    // [BladesItemType.ritual]: BladesItemSchema.Ritual,
    // [BladesItemType.design]: BladesItemSchema.Design,
    // [BladesItemType.location]: BladesItemSchema.Location,
    // [BladesItemType.score]: BladesItemSchema.Score,


    export type OppositionDoc =
       BladesActorOfType<BladesActorType.npc>
      |BladesActorOfType<BladesActorType.faction>
      |BladesItemOfType<BladesItemType.cohort_gang>
      |BladesItemOfType<BladesItemType.cohort_expert>
      |BladesItemOfType<BladesItemType.gm_tracker>
      |BladesItemOfType<BladesItemType.project>
      |BladesItemOfType<BladesItemType.design>
      |BladesItemOfType<BladesItemType.ritual>;

    export interface OppositionDocData {
      rollOppID?: string,
      rollOppDoc?: OppositionDoc,
      rollOppName: string,
      rollOppType: string,
      rollOppImg: string,
      rollOppSubName?: string,

      rollOppModsData?: RollModData[],
      rollFactors: Partial<Record<Factor,FactorData>>
    }

    export type ParticipantDoc =
      BladesActorOfType<BladesActorType.pc>
      |BladesActorOfType<BladesActorType.crew>
      |BladesActorOfType<BladesActorType.npc>
      |BladesItemOfType<BladesItemType.cohort_gang>
      |BladesItemOfType<BladesItemType.cohort_expert>
      |BladesItemOfType<BladesItemType.gm_tracker>;

    export interface ParticipantDocData {
      rollParticipantID?: string,
      rollParticipantDoc?: ParticipantDoc,
      rollParticipantName: string,
      rollParticipantType: string,
      rollParticipantIcon: string,

      rollParticipantModsData?: RollModData[], // As applied to MAIN roll when this participant involved
      rollFactors: Partial<Record<Factor,FactorData>>
    }



  }
}