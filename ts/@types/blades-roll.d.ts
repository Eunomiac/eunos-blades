import {BladesActorType, BladesItemType, RollType, ConsequenceType, RollModStatus, RollModCategory, Action, DowntimeAction, Attribute, Position, Effect, Factor} from "../core/constants.js";
import BladesActor from "../blades-actor.js";
import BladesItem from "../blades-item.js";
import {BladesRollMod} from "../blades-roll-collab.js";

declare global {

  namespace BladesRollCollab {
    export interface Config {
      userID?: string,
      rollSource?: (BladesActor|BladesItem) & SourceDoc,
      rollType: RollType,
      rollTrait?: RollTrait
    }

    export type ConsequenceData = {
      type: ConsequenceType,
      label?: string
    }

    export type FactorFlagData = {
      isActive?: boolean,
      isDominant?: boolean,
      highFavorsPC?: boolean
    }

    export interface FlagData {
      rollID: string;
      rollType: RollType;
      rollSourceType: "Actor"|"Item";
      rollSourceID: string;
      rollTrait: RollTrait;
      rollModsData: Record<string,RollModStatus>;
      rollPositionInitial: Position;
      rollEffectInitial: Effect;
      rollPosEffectTrade: "position"|"effect"|false,
      rollOppositionID?: string,
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
      system: BladesActorSystem|BladesItemSystem,

      rollMods: BladesRollMod[],
      rollSource: BladesActor|BladesItem & SourceDoc,
      rollTraitData: NamedValueMax,
      rollTraitOptions: Array<{name: string, value: RollTrait}>,

      diceTotal: number,

      rollOpposition?: OppositionDoc,

      rollPositions: Position[],
      rollEffects: Effect[],
      teamworkDocs: BladesActor[],
      rollPositionFinal: Position,
      rollEffectFinal: Effect,
      isAffectingResult: boolean,
      isAffectingAfter: boolean,
      rollResultFinal: number,
      rollTraitValOverride?: number,

      canTradePosition: boolean,
      canTradeEffect: boolean,

      posRollMods: Record<RollModCategory, BladesRollMod[]>,
      negRollMods: Record<RollModCategory, BladesRollMod[]>,
      hasInactiveConditionals: Record<RollModCategory, boolean>,

      rollFactors: Record<"source"|"opposition", Partial<Record<Factor,FactorData>>>,

      oddsGradient: string,
      stressData?: {cost: number, tooltip: string}
    }

    export type PartialSheetData = Partial<SheetData> & FlagData;

    export type RollTrait = Action|Attribute|Factor|number;

    export interface FactorData extends NamedValueMax {
      baseVal: number,
      display?: string,
      isActive: boolean,
      isDominant: boolean,
      highFavorsPC: boolean,
      cssClasses: string
    }

    type RollModData = {
      id: string,
      name: string,
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
      category: RollModCategory,
      stressCost?: number
    }

    export interface SourceDocData {
      get rollModsData(): RollModData[],
      get rollFactors(): Partial<Record<Factor,FactorData>>
    }

    export type SourceDoc = SourceDocData & BladesDoc

    export interface OppositionDocData {
      get rollModsData(): RollModData[]|undefined,
      get rollOppImg(): string|undefined,
      get rollFactors(): Partial<Record<Factor,FactorData>>
    }

    export type OppositionDoc = OppositionDocData & BladesDoc;


  }
}