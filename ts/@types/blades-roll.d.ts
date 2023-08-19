import {BladesActorType, BladesItemType, RollType, RollModStatus, RollModCategory, Action, Attribute, Position, Effect, Factor} from "../core/constants.js";
import BladesActor from "../blades-actor.js";
import BladesItem from "../blades-item.js";

declare global {

  namespace BladesRollCollab {
    export interface Config {
      userID?: string,
      rollSource?: (BladesActor|BladesItem) & BladesRollCollab.SourceDoc,
      rollType: RollType,
      rollTrait?: BladesRollCollab.RollTrait
    }

    export interface FlagData {
      rollID: string;
      rollType: RollType;
      rollSourceType: "Actor"|"Item";
      rollSourceID: string;
      rollTrait: RollTrait;
      rollMods: ModData;
      rollPositionInitial: Position;
      rollEffectInitial: Effect;
      rollPosEffectTrade: "position"|"effect"|false,
      rollFactors: Record<Factor,FactorData>,
      rollOppositionID?: string,
      isGMReady: boolean,
      GMBoosts: Record<"Dice"|Factor|"Result",number>
    }

    export interface SheetData extends FlagData {
      cssClass: string,
      editable: boolean,
      isGM: boolean,
      system: BladesActorSystem|BladesItemSystem,
      flags: Record<string,any>,

      rollSource: BladesActor|BladesItem,
      rollTraitData: NamedValueMax,
      rollTraitOptions: Array<{name: string, value: RollTrait}>|false,

      diceTotal: number,

      rollFactorData: Array<{name: Factor, value: string, cssClasses: string}>,

      rollOpposition?: OppositionData,

      rollPositionFinal: Position,
      rollEffectFinal: Effect,
      isAffectingResult: boolean,
      rollResultFinal: number,

      rollOddsData: Array<{odds: number, result: string, cssClasses: string, tooltip: string}>
      stressData: {cost: number, tooltip: string}
    }

    export type RollTrait = Action|Attribute|Factor|number;

    export interface FactorData extends NamedValueMax {
      isActive: boolean
      isDominant: boolean
      highFavorsPC: boolean
    }

    type RollModData = {
      status: RollModStatus,
      sideString?: string,
      tooltip: string,
      isAbility?: boolean
    }

    export type ModData = Partial<Record<
      RollModCategory,
      Record<
        "positive"|"negative",
        Record<string,RollModData>
      >
    >>;

    export interface SourceDoc {
      getTierTotal(): number
      get rollMods(): BladesRollCollab.ModData
    }

    export interface OppositionDoc extends SourceDoc {
      get rollOppImg(): string|undefined
    }

    export interface OppositionData {
      doc: (BladesActor|BladesItem) & OppositionDoc,
      rollFactorData: Array<{name: Factor, value: string, cssClasses: string}>,
      GMBoosts: Partial<Record<Factor,number>>
    }

    export interface ModDoc {
      get rollModData(): {

      }
    }
  }
}