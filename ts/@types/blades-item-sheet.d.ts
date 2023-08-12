import {BladesActorType, BladesItemType, Attributes, Actions, BladesPhase} from "../core/constants";

declare global {

  type BladesBaseItemSheetContext = ItemSheet.Data<DocumentSheetOptions> & {
    cssClass: string,
    editable: boolean,
    isGM: boolean,
    isEmbeddedItem: boolean,
    item: BladesItem,
    system: BladesItemSystem,
    activeEffects: BladesActiveEffect[],
    tierTotal?: string
  };

  // Final data sent to Handlebars through BladesItemSheet.getData()
  namespace BladesItemSheetTypedData {

    export interface Ability {}
    export interface Background {}
    export interface Clock_Keeper {
      phases: BladesPhase[]
    }
    export interface Cohort_Gang {
      subtitle: string,
      tierData: BladesCompData
      scaleData?: {example: string}
    }
    export interface Cohort_Expert {
      tierData: BladesCompData,
      subtitle: string
    }
    export interface Crew_Ability {}
    export interface Crew_Reputation {}
    export interface Crew_Playbook {}
    export interface Crew_Upgrade {}
    export interface Feature {}
    export interface Gm_Tracker {}
    export interface Heritage {}
    export interface Gear {
      tierData: BladesCompData
    }
    export interface Playbook {}
    export interface Preferred_Op {}
    export interface Stricture {}
    export interface Vice {}
    export interface Project {}
    export interface Ritual {}
    export interface Design {}
    export interface Location {}
    export interface Score {}
  }

  // Merged Item Subtype Schemas into Master BladesItem System Schema
  interface BladesItemSheetData extends BladesBaseItemSheetContext,
                                      Partial<BladesItemSheetTypedData.Ability>,
                                      Partial<BladesItemSheetTypedData.Background>,
                                      Partial<BladesItemSheetTypedData.Clock_Keeper>,
                                      Partial<BladesItemSheetTypedData.Cohort_Gang>,
                                      Partial<BladesItemSheetTypedData.Cohort_Expert>,
                                      Partial<BladesItemSheetTypedData.Crew_Ability>,
                                      Partial<BladesItemSheetTypedData.Crew_Reputation>,
                                      Partial<BladesItemSheetTypedData.Crew_Playbook>,
                                      Partial<BladesItemSheetTypedData.Crew_Upgrade>,
                                      Partial<BladesItemSheetTypedData.Feature>,
                                      Partial<BladesItemSheetTypedData.Gm_Tracker>,
                                      Partial<BladesItemSheetTypedData.Heritage>,
                                      Partial<BladesItemSheetTypedData.Gear>,
                                      Partial<BladesItemSheetTypedData.Playbook>,
                                      Partial<BladesItemSheetTypedData.Preferred_Op>,
                                      Partial<BladesItemSheetTypedData.Stricture>,
                                      Partial<BladesItemSheetTypedData.Vice>,
                                      Partial<BladesItemSheetTypedData.Project>,
                                      Partial<BladesItemSheetTypedData.Ritual>,
                                      Partial<BladesItemSheetTypedData.Design>,
                                      Partial<BladesItemSheetTypedData.Location>,
                                      Partial<BladesItemSheetTypedData.Score> { }

  // Distinguishing schema types for BladesItem subtypes
  type BladesItemDataOfType<T extends BladesItemType> = {
    [BladesItemType.ability]: BladesItemSheetTypedData.Ability,
    [BladesItemType.background]: BladesItemSheetTypedData.Background,
    [BladesItemType.clock_keeper]: BladesItemSheetTypedData.Clock_Keeper,
    [BladesItemType.cohort_gang]: BladesItemSheetTypedData.Cohort_Gang,
    [BladesItemType.cohort_expert]: BladesItemSheetTypedData.Cohort_Expert,
    [BladesItemType.crew_ability]: BladesItemSheetTypedData.Crew_Ability,
    [BladesItemType.crew_reputation]: BladesItemSheetTypedData.Crew_Reputation,
    [BladesItemType.crew_playbook]: BladesItemSheetTypedData.Crew_Playbook,
    [BladesItemType.crew_upgrade]: BladesItemSheetTypedData.Crew_Upgrade,
    [BladesItemType.feature]: BladesItemSheetTypedData.Feature,
    [BladesItemType.gm_tracker]: BladesItemSheetTypedData.Gm_Tracker,
    [BladesItemType.heritage]: BladesItemSheetTypedData.Heritage,
    [BladesItemType.gear]: BladesItemSheetTypedData.Gear,
    [BladesItemType.playbook]: BladesItemSheetTypedData.Playbook,
    [BladesItemType.preferred_op]: BladesItemSheetTypedData.Preferred_Op,
    [BladesItemType.stricture]: BladesItemSheetTypedData.Stricture,
    [BladesItemType.vice]: BladesItemSheetTypedData.Vice,
    [BladesItemType.project]: BladesItemSheetTypedData.Project,
    [BladesItemType.ritual]: BladesItemSheetTypedData.Ritual,
    [BladesItemType.design]: BladesItemSheetTypedData.Design,
    [BladesItemType.location]: BladesItemSheetTypedData.Location,
    [BladesItemType.score]: BladesItemSheetTypedData.Score
  }[T];

}