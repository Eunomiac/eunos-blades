import { AttributeTrait, ActionTrait, BladesPhase, BladesActorType, BladesItemType } from '../core/constants';
import BladesActiveEffect from '../BladesActiveEffect';

declare global {

  type BladesBaseActorSheetContext = ActorSheet.Data<DocumentSheetOptions> & {
    cssClass: string,
    editable: boolean,
    isGM: boolean,
    actor: BladesActor,
    system: BladesActorSystem,
    tierTotal: string,
    activeEffects: BladesActiveEffect[],
    gamePhase: BladesPhase,

    rollData: BladesActorRollData,
    hasFullVision: boolean,
    hasLimitedVision: boolean,
    hasControl: boolean,
    playbookData?: {tooltip?: string, dotline: BladesDotlineData},
    coinsData?: {dotline: BladesDotlineData}
  };

  // Final data sent to Handlebars through BladesActorSheet.getData()
  namespace BladesActorSheetTypedData {

    export interface Scoundrel {

      preparedItems: {
        abilities: Array<BladesItemOfType<BladesItemType.ability> & {
          inRuleDotline?: BladesDotlineData
        }>,
        background?: BladesItemOfType<BladesItemType.background>,
        heritage?: BladesItemOfType<BladesItemType.heritage>,
        vice?: BladesItemOfType<BladesItemType.vice>,
        loadout: Array<BladesItemOfType<BladesItemType.gear> & {
          numberCircle?: number,
          numberCircleClass?: string,
          inRuleDotline?: BladesDotlineData
        }>,
        cohorts: {
          gang: BladesItemOfType<BladesItemType.cohort_gang>[],
          expert: BladesItemOfType<BladesItemType.cohort_expert>[]
        },
        playbook?: BladesItemOfType<BladesItemType.playbook>
      },

      preparedActors: {
        crew?: BladesActorOfType<BladesActorType.crew>,
        vice_purveyor?: BladesActorOfType<BladesActorType.npc>,
        acquaintances: Array<BladesActor>
      },

      hasVicePurveyor: boolean,
      healing_clock: BladesClockData,

      stashData: BladesCompData,
      stressData: BladesCompData,
      traumaData: BladesCompData,
      abilityData: BladesCompData,

      attributeData: Record<AttributeTrait, {
        tooltip: string,
        actions: Record<ActionTrait, ValueMax & {tooltip: string}>
      }>,

      gatherInfoTooltip: string,

      loadData: {
        curLoad: number,
        selLoadCount: number,
        options: BladesSelectOption<string>[],
        selected: string
      },
      armor: Record<string,boolean>,

      downtimeData?: {
        actionsList: Record<DowntimeAction, string>,
        actionsTooltips: Record<DowntimeAction, string>
        actionsRemaining: number,
        canPayCoin: boolean,
        canPayRep: boolean,
        isDisplayingCosts: boolean,
        isDisplayingActions: boolean,
        dotline: BladesDotlineData
      }
    }

    export interface Crew {
      preparedItems: {
        abilities: BladesItemOfType<BladesItemType.crew_ability>[],
        playbook?: BladesItemOfType<BladesItemType.crew_playbook>,
        reputation?: BladesItemOfType<BladesItemType.crew_reputation>,
        upgrades: BladesItemOfType<BladesItemType.crew_upgrade>[],
        cohorts: {
          gang: BladesItemOfType<BladesItemType.cohort_gang>[],
          expert: BladesItemOfType<BladesItemType.cohort_expert>[]
        },
        preferredOp?: BladesItemOfType<BladesItemType.preferred_op>
      }

      preparedActors: {
        members: Array<BladesActorOfType<BladesActorType.pc>>,
        contacts: Array<BladesActorOfType<BladesActorType.npc|BladesActorType.faction>>
      }

      tierData: BladesCompData,
      upgradeData: BladesCompData,
      abilityData: BladesCompData,
      cohortData: BladesCompData,
      repData: BladesCompData,
      heatData: BladesCompData,
      wantedData: BladesCompData
    }

    export interface NPC { }

    export interface Faction {
      tierData: BladesCompData
    }
  }

  // Merged Actor Subtype Schemas into Master BladesActor System Schema
  interface BladesActorSheetData extends BladesBaseActorSheetContext,
                                        Partial<BladesActorSheetTypedData.Scoundrel>,
                                        Partial<BladesActorSheetTypedData.Crew>,
                                        Partial<BladesActorSheetTypedData.NPC>,
                                        Partial<BladesActorSheetTypedData.Faction> { }

  // Distinguishing schema types for BladesActor subtypes
  type BladesActorDataOfType<T extends BladesActorType> = {
    [BladesActorType.pc]: BladesActorSheetTypedData.Scoundrel,
    [BladesActorType.crew]: BladesActorSheetTypedData.Crew,
    [BladesActorType.npc]: BladesActorSheetTypedData.NPC,
    [BladesActorType.faction]: BladesActorSheetTypedData.Faction
  }[T];

}