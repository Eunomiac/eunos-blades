import { Attributes, Actions, BladesPhase, BladesActorType, BladesItemType } from '../core/constants';
import BladesActiveEffect from '../blades-active-effect';

declare global {

  type BladesBaseActorSheetContext = ActorSheet.Data<DocumentSheetOptions> & {
    cssClass: string,
    editable: boolean,
    isGM: boolean,
    actor: BladesActor,
    system: BladesActorSystem,
    activeEffects: BladesActiveEffect[],

    rollData: BladesActorRollData,
    hasFullVision: boolean,
    hasLimitedVision: boolean,
    hasControl: boolean,
    playbookData?: {tooltip: string, dotline: BladesDotlineData},
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

      attributeData: Record<Attributes, Record<Actions, ValueMax>>,

      gatherInfoTooltip: string,

      loadData: {
        curLoad: number,
        selLoadCount: number,
        selections: string[],
        selLoadLevel: string
      },
      armor: Record<string,boolean>
    }

    export interface Crew {
      preparedItems: {
        abilities: BladesItemOfType<BladesItemType.crew_ability>[],
        playbook?: BladesItemOfType<BladesItemType.crew_playbook>,
        reputation?: BladesItemOfType<BladesItemType.crew_reputation>,
        upgrades: BladesItemOfType<BladesItemType.crew_upgrade>[],
        cohorts: BladesItemOfType<BladesItemType.cohort_gang|BladesItemType.cohort_expert>[],
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