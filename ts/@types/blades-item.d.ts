import { BladesItemType } from "../core/constants.js";
import BladesItem from "../blades-item.js";

declare global {

  // #region Utility Types for BladesItems

  // #endregion

  // #region Data Types for BladesItems

  // #endregion

  // template.json "template" definitions for BladesItems
  namespace BladesItemSchemaTemplate {

    export interface Default extends BladesDocSchemaTemplate.Default {
      description: string,
      tier: ValueMax,
      subactors: Record<string, SubActorData>,
      subtitle: string
    }

    export interface district { }

    export interface clocks { }
    export interface buyable { }
    export interface limitUses { }
    export interface cohort { }
    export interface answers { }
  }

  // Compiled "system" Schemas for BladesItem Types
  namespace BladesItemSchema {

    export interface Ability extends BladesItemSchemaTemplate.Default,
                                     BladesItemSchemaTemplate.buyable,
                                     BladesItemSchemaTemplate.limitUses {}

    export interface Background extends BladesItemSchemaTemplate.Default {}
    export interface Clock_Keeper extends BladesItemSchemaTemplate.Default {}
    export interface Cohort_Gang extends BladesItemSchemaTemplate.Default {}
    export interface Cohort_Expert extends BladesItemSchemaTemplate.Default {}
    export interface Crew_Ability extends BladesItemSchemaTemplate.Default {}
    export interface Crew_Reputation extends BladesItemSchemaTemplate.Default {}
    export interface Crew_Playbook extends BladesItemSchemaTemplate.Default {}
    export interface Crew_Upgrade extends BladesItemSchemaTemplate.Default {}
    export interface Feature extends BladesItemSchemaTemplate.Default {}
    export interface Gm_Tracker extends BladesItemSchemaTemplate.Default {}
    export interface Heritage extends BladesItemSchemaTemplate.Default {}
    export interface Item extends BladesItemSchemaTemplate.Default {}
    export interface Playbook extends BladesItemSchemaTemplate.Default {}
    export interface Preferred_Op extends BladesItemSchemaTemplate.Default {}
    export interface Stricture extends BladesItemSchemaTemplate.Default {}
    export interface Vice extends BladesItemSchemaTemplate.Default {}
    export interface Project extends BladesItemSchemaTemplate.Default {}
    export interface Ritual extends BladesItemSchemaTemplate.Default {}
    export interface Design extends BladesItemSchemaTemplate.Default {}
    export interface Location extends BladesItemSchemaTemplate.Default {}
    export interface Score extends BladesItemSchemaTemplate.Default {}

  }

  // Distinguishing schema types for BladesItem subtypes
  type ExtractBladesItemSystem<T extends BladesItemType> = {
    [BladesItemType.ability]: BladesItemSchema.Ability;
    [BladesItemType.background]: BladesItemSchema.Background;
    [BladesItemType.clock_keeper]: BladesItemSchema.Clock_Keeper;
    [BladesItemType.cohort_gang]: BladesItemSchema.Cohort_Gang;
    [BladesItemType.cohort_expert]: BladesItemSchema.Cohort_Expert;
    [BladesItemType.crew_ability]: BladesItemSchema.Crew_Ability;
    [BladesItemType.crew_reputation]: BladesItemSchema.Crew_Reputation;
    [BladesItemType.crew_playbook]: BladesItemSchema.Crew_Playbook;
    [BladesItemType.crew_upgrade]: BladesItemSchema.Crew_Upgrade;
    [BladesItemType.feature]: BladesItemSchema.Feature;
    [BladesItemType.gm_tracker]: BladesItemSchema.Gm_Tracker;
    [BladesItemType.heritage]: BladesItemSchema.Heritage;
    [BladesItemType.item]: BladesItemSchema.Item;
    [BladesItemType.playbook]: BladesItemSchema.Playbook;
    [BladesItemType.preferred_op]: BladesItemSchema.Preferred_Op;
    [BladesItemType.stricture]: BladesItemSchema.Stricture;
    [BladesItemType.vice]: BladesItemSchema.Vice;
    [BladesItemType.project]: BladesItemSchema.Project;
    [BladesItemType.ritual]: BladesItemSchema.Ritual;
    [BladesItemType.design]: BladesItemSchema.Design;
    [BladesItemType.location]: BladesItemSchema.Location;
    [BladesItemType.score]: BladesItemSchema.Score;
  }[T];

  type BladesItemOfType<T extends BladesItemType> = BladesItem & {
    system: ExtractBladesItemSystem<T>;
  };

  // Merged Actor Subtype Schemas into Master BladesItem System Schema
  interface BladesItemSystem extends  BladesItemSchemaTemplate.Default,
                                      Partial<BladesItemSchema.Ability>,
                                      Partial<BladesItemSchema.Background>,
                                      Partial<BladesItemSchema.Clock_Keeper>,
                                      Partial<BladesItemSchema.Cohort_Gang>,
                                      Partial<BladesItemSchema.Cohort_Expert>,
                                      Partial<BladesItemSchema.Crew_Ability>,
                                      Partial<BladesItemSchema.Crew_Reputation>,
                                      Partial<BladesItemSchema.Crew_Playbook>,
                                      Partial<BladesItemSchema.Crew_Upgrade>,
                                      Partial<BladesItemSchema.Feature>,
                                      Partial<BladesItemSchema.Gm_Tracker>,
                                      Partial<BladesItemSchema.Heritage>,
                                      Partial<BladesItemSchema.Item>,
                                      Partial<BladesItemSchema.Playbook>,
                                      Partial<BladesItemSchema.Preferred_Op>,
                                      Partial<BladesItemSchema.Stricture>,
                                      Partial<BladesItemSchema.Vice>,
                                      Partial<BladesItemSchema.Project>,
                                      Partial<BladesItemSchema.Ritual>,
                                      Partial<BladesItemSchema.Design>,
                                      Partial<BladesItemSchema.Location>,
                                      Partial<BladesItemSchema.Score> { }
}
