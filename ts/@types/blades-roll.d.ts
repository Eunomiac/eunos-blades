import {BladesActorType, BladesItemType, RollType, RollModStatus, RollModCategory, Action, Attribute, Position, Effect, Factor} from "../core/constants.js";
import BladesActor from "../blades-actor.js";
import BladesItem from "../blades-item.js";
import {ModEffects} from "../sheets/roll/blades-roll-collab-sheet.js";

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
      rollFactors: Partial<Record<Factor,FactorData>> & Record<Factor.tier,FactorData>,
      rollOppositionID?: string,
      isGMReady: boolean,
      GMBoosts: Partial<Record<"Dice"|Factor|"Result",number>>,
      GMOppBoosts: Partial<Record<Factor,number>>
    }

    export interface SheetData extends FlagData {
      cssClass: string,
      editable: boolean,
      isGM: boolean,
      system: BladesActorSystem|BladesItemSystem,
      flags: Record<string,any>,

      rollSource: BladesActor|BladesItem & SourceDoc,
      rollTraitData: NamedValueMax,
      rollTraitOptions: Array<{name: string, value: RollTrait}>|false,

      diceTotal: number,

      rollOpposition?: OppositionDoc,
      rollOppositionFactors?: Partial<Record<Factor,FactorData>> & Record<Factor.tier,FactorData>

      rollPositionFinal: Position,
      rollEffectFinal: Effect,
      isAffectingResult: boolean,
      rollResultFinal: number,

      canTradePosition: boolean,
      canTradeEffect: boolean,

      hasInactiveConditionals: Record<RollModCategory, boolean>,

      oddsGradient: string,
      stressData: {cost: number, tooltip: string}
    }

    export type RollTrait = Action|Attribute|Factor|number;

    export interface FactorData extends NamedValueMax {
      display?: string,
      isActive: boolean,
      isDominant: boolean,
      highFavorsPC: boolean,
      cssClasses: string
    }

    type RollModData = {
      name: string,
      status: RollModStatus,
      value: number,
      effectKey?: KeyOf<typeof ModEffects>,
      sideString?: string,
      tooltip: string,
      posNeg: "positive"|"negative",
      isConditional?: boolean,
      isOppositional?: boolean,
      modType?: BladesItemType|"general",
      conditionalRollTypes?: RollType[],
      autoRollTypes?: RollType[],
      conditionalRollTraits?: RollTrait[],
      autoRollTraits?: RollTrait[],
      category: RollModCategory,
      stressCost?: number
    }

    export type ModData = Partial<Record<
      RollModCategory,
      Record<
        "positive"|"negative",
        Record<string,RollModData>
      >
    >>;

    export interface SourceDoc {
      get rollMods(): ModData,
      get rollFactors(): Partial<Record<Factor,FactorData>> & Record<Factor.tier,FactorData>
    }

    export interface OppositionDoc {
      get rollOppImg(): string|undefined,
      get rollFactors(): Partial<Record<Factor,FactorData>> & Record<Factor.tier,FactorData>
    }

  }
}