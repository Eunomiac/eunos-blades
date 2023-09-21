import {BladesActorType, BladesItemType, RollType, RollSubType, ConsequenceType, RollModStatus, RollModCategory, Action, DowntimeAction, Attribute, Position, Effect, Factor} from "../core/constants.js";
import BladesActor from "../blades-actor.js";
import BladesItem from "../blades-item.js";
import {BladesRollMod} from "../blades-roll-collab.js";

declare global {

  namespace BladesRollCollab {
    export interface Config {
      rollType: RollType,
      userID?: string,
      rollSource?: SourceDocData,
      rollOpposition?: OppositionDocData,
      rollSubType?: RollSubType,
      rollDowntimeAction?: DowntimeAction,
      rollTrait?: RollTrait
    }

    export type ConsequenceData = {
      type: ConsequenceType,
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

    export interface FlagData {
      rollID: string;
      rollType: RollType;
      rollSubType?: RollSubType;
      rollDowntimeAction?: DowntimeAction;
      rollSourceType: string;
      rollSourceID?: string;
      rollSourceData?: SourceDocData;
      rollTrait: RollTrait;
      rollModsData: Record<string,RollModStatus>;
      rollPositionInitial: Position;
      rollEffectInitial: Effect;
      rollPosEffectTrade: "position"|"effect"|false,
      rollOppositionType?: string;
      rollOppositionID?: string,
      rollOppositionData?: OppositionDocData,
      rollConsequence?: ConsequenceData,
      isGMReady: boolean,
      GMBoosts: Partial<Record<"Dice"|Factor|"Result",number>>,
      GMOppBoosts: Partial<Record<Factor,number>>,
      docSelections: {
        [RollModCategory.roll]: {
          Assist: string|false,
          Group_1: string|false,
          Group_2: string|false,
          Group_3: string|false,
          Group_4: string|false,
          Group_5: string|false,
          Group_6: string|false,
        },
        [RollModCategory.position]: {
          Setup: string|false
        },
        [RollModCategory.effect]: {
          Setup: string|false
        }
      }
      rollFactorToggles: Record<"source"|"opposition", Partial<Record<Factor, FactorFlagData>>>
    }

    export interface SheetData extends FlagData {
      cssClass: string,
      editable: boolean,
      isGM: boolean,
      system?: BladesActorSystem|BladesItemSystem,

      rollMods: BladesRollMod[],
      rollSource: SourceDocData,
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

      posRollMods: Record<RollModCategory, BladesRollMod[]>,
      negRollMods: Record<RollModCategory, BladesRollMod[]>,
      hasInactiveConditionals: Record<RollModCategory, boolean>,

      rollFactors: Record<"source"|"opposition", Partial<Record<Factor,FactorData>>>,

      oddsGradient: string,
      oddsGradientTestHTML?: string,
      costData?: Record<"footerLabel"|"tooltip",string>
    }

    export type PartialSheetData = Partial<SheetData> & FlagData;

    export type RollTrait = Action|Attribute|Factor|number;

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
      conditionalRollTypes?: Array<RollType|DowntimeAction>,
      autoRollTypes?: Array<RollType|DowntimeAction>,
      conditionalRollTraits?: RollTrait[],
      autoRollTraits?: RollTrait[],
      category: RollModCategory
    }

    export interface SourceDocData {
      rollSourceID: string|undefined,
      rollSourceDoc: BladesDoc|undefined,
      rollSourceName: string,
      rollSourceType: string,
      rollSourceImg: string,

      rollModsData: RollModData[],
      rollFactors: Partial<Record<Factor,FactorData>>
    }

    export interface OppositionDocData {
      rollOppID: string|undefined,
      rollOppDoc: BladesDoc|undefined,
      rollOppName: string,
      rollOppSubName: string,
      rollOppType: string,
      rollOppImg: string,

      rollModsData: RollModData[]|undefined,
      rollFactors: Partial<Record<Factor,FactorData>>
    }

    export interface ParticipantDocData {
      rollParticipantID: string|undefined,
      rollParticipantDoc: BladesDoc|undefined,
      rollParticipantName: string,
      rollParticipantType: string,
      rollParticipantIcon: string,

      rollParticipantModsData: RollModData[]|undefined, // As applied to MAIN roll when this participant involved
      rollFactors: Partial<Record<Factor,FactorData>>
    }

    // export type OppositionDoc = OppositionDocData & BladesDoc;


  }
}