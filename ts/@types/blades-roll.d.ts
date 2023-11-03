import {BladesActorType, BladesItemType, RollType, RollSubType, ConsequenceType, RollModStatus, RollModSection, ActionTrait, DowntimeAction, AttributeTrait, Position, Effect, Factor, RollPhase, RollResult} from "../core/constants";
import BladesActor from "../BladesActor";
import BladesItem from "../BladesItem";
import {BladesRollMod, BladesRollPrimary, BladesRollOpposition, BladesRollParticipant} from "../BladesRoll";

declare global {

  namespace BladesRoll {

    export type ConstructorConfig = Partial<Config> & Required<Pick<Config, "rollType">>;

    export interface ConfigFlags extends Config {
      rollPrimaryData: Omit<PrimaryDocData, "rollPrimaryDoc">,
      rollOppData?: Omit<OppositionDocData, "rollOppDoc">,
      rollParticipantData?: RollParticipantFlagData
    }

    export type ConsequenceResisted = {
      name: string,
      type?: ConsequenceType,
      isSelected: boolean
    }

    export interface ConsequenceData {
      name: string,
      type: ConsequenceType,
      attribute: AttributeTrait,
      resistOptions?: Record<
        string,  // display name of consequence
        ConsequenceResisted // ai
      >,
      resistedTo?: ConsequenceResisted|false
        // player's choice from chat
    }

    export type CostData = {
      id: string,
      label: string,
      costType: string,
      costAmount: number
    }

    export type ModType = BladesItemType | "general" | "harm" | "teamwork";

    export interface Config {
      rollType: RollType,
      rollSubType?: RollSubType,
      rollUserID: string,
      rollTrait?: RollTrait,
      rollDowntimeAction?: DowntimeAction,

      rollPrimaryData: PrimaryDocData;
      rollOppData?: OppositionDocData;
      rollParticipantData?: RollParticipantData,

      participantRollTo?: string,
      consequenceData?: {
        [RollResult.partial]?: Record<
          string, // stringified index
          ConsequenceData
        >,
        [RollResult.fail]?: Record<
          string, // stringified index
          ConsequenceData
        >
      }
    }

    export interface FlagData extends ConfigFlags {
      rollID: string;

      rollModsData: Record<string,RollModStatus>;

      rollPrimaryData: Omit<PrimaryDocData, "rollPrimaryDoc">;
      rollOppData?: Omit<OppositionDocData, "rollOppDoc">;
      rollParticipantData?: RollParticipantFlagData;

      rollPositionInitial: Position;
      rollEffectInitial: Effect;
      rollPosEffectTrade: "position"|"effect"|false,
      rollPhase: RollPhase,

      GMBoosts: Partial<Record<"Dice"|Factor|"Result",number>>,
      GMOppBoosts: Partial<Record<Factor,number>>,
      rollFactorToggles: Record<
        "source"|"opposition",
        Partial<Record<Factor, FactorFlagData>>
      >,

      userPermissions: Record<string, RollPermissions>
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
      rollParticipants?: RollParticipantDocs,

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

      consequenceTypeOptions?: {
        [RollResult.partial]: BladesSelectOption<ConsequenceType>[],
        [RollResult.fail]: BladesSelectOption<ConsequenceType>[]
      }

      canTradePosition: boolean,
      canTradeEffect: boolean,

      posRollMods: Record<RollModSection, BladesRollMod[]>,
      negRollMods: Record<RollModSection, BladesRollMod[]>,
      hasInactiveConditionals: Record<RollModSection, boolean>,

      rollFactors: Record<"source"|"opposition", Partial<Record<Factor,FactorData>>>,

      oddsHTMLStart: string,
      oddsHTMLStop: string,
      costData?: Record<"footerLabel"|"tooltip",string>,

      userPermission: RollPermissions
    }

    export type PartialSheetData = Partial<SheetData> & FlagData;

    export type AnyRollType = RollType|RollSubType|DowntimeAction;
    export type RollTrait = ActionTrait|AttributeTrait|Factor|number;

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

    type RollModData = {
      id: string,
      name: string,
      modType: BladesItemType|"general"|"harm"|"teamwork",
      source_name?: string,
      section: RollModSection,
      posNeg: "positive"|"negative",

      status?: RollModStatus,
      base_status: RollModStatus,
      user_status?: RollModStatus,
      held_status?: RollModStatus,

      value: number,
      effectKeys?: string[],

      selected?: string,
      sideString?: string,
      tooltip: string,

      conditionalRollTypes?: AnyRollType[],
      autoRollTypes?: AnyRollType[],
      participantRollTypes?: AnyRollType[],

      conditionalRollTraits?: RollTrait[],
      autoRollTraits?: RollTrait[],
      participantRollTraits?: RollTrait[]
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

      rollParticipantModsData?: RollModData[],                                   // As applied to MAIN roll when this participant involved
      rollFactors: Partial<Record<Factor,FactorData>>
    }

    export interface ParticipantSectionData {
      rollParticipantSection: KeyOf<Readonly<RollParticipantDocs>>,
      rollParticipantSubSection: RollParticipantSubSection
    }

    export type ParticipantConstructorData = ParticipantSectionData & Partial<ParticipantDocData>;


    export interface RollParticipantData {
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