import { BladesItemType, District, BladesPhase } from "../core/constants.js";
import BladesItem from "../blades-item.js";

declare global {

  // Utility Types for BladesItems
  type TurfNum = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "11" | "12" | "13" | "14" | "15";

  // #region SCHEMA DATA: TEMPLATE.JSON & SYSTEM

  // template.json "template" definitions for BladesItems
  namespace BladesItemSchemaTemplate {

    export interface Default extends BladesDocSchemaTemplate.Default {
      prereqs: Record<string, string>
      rules: string
      notes: string
      description: string
      tier: ValueMax
    }

    export interface district { district: District }

    export interface clocks { clocks: Record<string, BladesClockData> }

    export interface buyable { price: number }

    export interface limitUses { uses_per_score: ValueMax }

    export interface cohort {
      subtypes: string[],
      edges: Record<string, string>,
      flaws: Record<string, string>,
      harm: ValueMax,
      scale: number,
      quality: number
    }

    export interface answers { answers: Record<"a" | "b" | "c" | "d", string> }
  }

  // Compiled "system" Schemas for BladesItem Types
  namespace BladesItemSchema {

    export interface Ability extends BladesItemSchemaTemplate.Default,
      BladesItemSchemaTemplate.buyable,
      BladesItemSchemaTemplate.limitUses { }

    export interface Background extends BladesItemSchemaTemplate.Default { }

    export interface Clock_Keeper extends BladesItemSchemaTemplate.Default {
      scenes: Array<{ id: string, name: string }>,
      targetScene: string | null,
      clock_keys: Record<string, BladesMultiClockData | null>
    }

    export interface Cohort_Gang extends BladesItemSchemaTemplate.Default,
      BladesItemSchemaTemplate.district,
      BladesItemSchemaTemplate.clocks,
      BladesItemSchemaTemplate.cohort { }

    export interface Cohort_Expert extends BladesItemSchemaTemplate.Default,
      BladesItemSchemaTemplate.district,
      BladesItemSchemaTemplate.clocks,
      BladesItemSchemaTemplate.cohort { }

    export interface Crew_Ability extends BladesItemSchemaTemplate.Default,
      BladesItemSchemaTemplate.district,
      BladesItemSchemaTemplate.buyable,
      BladesItemSchemaTemplate.limitUses { }

    export interface Crew_Reputation extends BladesItemSchemaTemplate.Default { }

    export interface Crew_Playbook extends BladesItemSchemaTemplate.Default {
      turfs: Record<TurfNum, BladesClaimData>
    }

    export interface Crew_Upgrade extends BladesItemSchemaTemplate.Default,
      BladesItemSchemaTemplate.district,
      BladesItemSchemaTemplate.buyable,
      BladesItemSchemaTemplate.limitUses { }

    export interface Feature extends BladesItemSchemaTemplate.Default,
      BladesItemSchemaTemplate.buyable,
      BladesItemSchemaTemplate.limitUses { }

    export interface Gm_Tracker extends BladesItemSchemaTemplate.Default,
      BladesItemSchemaTemplate.clocks {
      phase: BladesPhase,
      phases: BladesPhase[],
      is_spoofing_player: boolean
    }

    export interface Heritage extends BladesItemSchemaTemplate.Default { }

    export interface Item extends BladesItemSchemaTemplate.Default,
      BladesItemSchemaTemplate.clocks,
      BladesItemSchemaTemplate.limitUses {
      max_per_score: number,
      load: number
    }

    export interface Playbook extends BladesItemSchemaTemplate.Default { }

    export interface Preferred_Op extends BladesItemSchemaTemplate.Default,
      BladesItemSchemaTemplate.district { }

    export interface Stricture extends BladesItemSchemaTemplate.Default { }

    export interface Vice extends BladesItemSchemaTemplate.Default { }

    export interface Project extends BladesItemSchemaTemplate.Default,
      BladesItemSchemaTemplate.district,
      BladesItemSchemaTemplate.clocks { }

    export interface Ritual extends BladesItemSchemaTemplate.Default,
      BladesItemSchemaTemplate.district,
      BladesItemSchemaTemplate.clocks,
      BladesItemSchemaTemplate.answers {
      source: string,
      magnitude: ValueMax,
      cast_time: string,
      action_roll: string,
      fortune_roll: string
    }

    export interface Design extends BladesItemSchemaTemplate.Default,
      BladesItemSchemaTemplate.district,
      BladesItemSchemaTemplate.clocks,
      BladesItemSchemaTemplate.answers {
      creation_type: string,
      min_quality: number,
      drawbacks: Record<string, string>
    }

    export interface Location extends BladesItemSchemaTemplate.Default,
      BladesItemSchemaTemplate.district,
      BladesItemSchemaTemplate.clocks { }

    export interface Score extends BladesItemSchemaTemplate.Default,
      BladesItemSchemaTemplate.district,
      BladesItemSchemaTemplate.clocks {
      target: string,
      operation: string,
      detail: string,
      engagement_result: string,
      entanglements: Record<string, string>,
      reward: string,
      locations: string[]
    }

  }

  // Merged Item Subtype Schemas into Master BladesItem System Schema
  interface BladesItemSystem extends BladesItemSchemaTemplate.Default,
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

  // Distinguishing schema types for BladesItem subtypes
  type BladesItemOfType<T extends BladesItemType> = BladesItem & {
    system: ExtractBladesItemSystem<T>
  };

  type ExtractBladesItemSystem<T extends BladesItemType | "ANY" = "ANY"> = {
    [BladesItemType.ability]: BladesItemSchema.Ability,
    [BladesItemType.background]: BladesItemSchema.Background,
    [BladesItemType.clock_keeper]: BladesItemSchema.Clock_Keeper,
    [BladesItemType.cohort_gang]: BladesItemSchema.Cohort_Gang,
    [BladesItemType.cohort_expert]: BladesItemSchema.Cohort_Expert,
    [BladesItemType.crew_ability]: BladesItemSchema.Crew_Ability,
    [BladesItemType.crew_reputation]: BladesItemSchema.Crew_Reputation,
    [BladesItemType.crew_playbook]: BladesItemSchema.Crew_Playbook,
    [BladesItemType.crew_upgrade]: BladesItemSchema.Crew_Upgrade,
    [BladesItemType.feature]: BladesItemSchema.Feature,
    [BladesItemType.gm_tracker]: BladesItemSchema.Gm_Tracker,
    [BladesItemType.heritage]: BladesItemSchema.Heritage,
    [BladesItemType.gear]: BladesItemSchema.Item,
    [BladesItemType.playbook]: BladesItemSchema.Playbook,
    [BladesItemType.preferred_op]: BladesItemSchema.Preferred_Op,
    [BladesItemType.stricture]: BladesItemSchema.Stricture,
    [BladesItemType.vice]: BladesItemSchema.Vice,
    [BladesItemType.project]: BladesItemSchema.Project,
    [BladesItemType.ritual]: BladesItemSchema.Ritual,
    [BladesItemType.design]: BladesItemSchema.Design,
    [BladesItemType.location]: BladesItemSchema.Location,
    [BladesItemType.score]: BladesItemSchema.Score,
    ["ANY"]: BladesItemSystem
  }[T];

  // #endregion

  // #region ITEM SUBCLASS DEFINITIONS: ACCESSORS & METHODS

  namespace BladesItemComponent {}

  namespace BladesItemSubClass {}

  // #region Interface Contracts for Implementation by BladesActor Subclass

  // #endregion

  // #endregion

}
