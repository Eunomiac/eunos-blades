import { BladesItemType, ClockColor, District, BladesPhase, Randomizers } from "../core/constants";
import BladesItem from "../BladesItem";
import BladesPC from "../documents/actors/BladesPC.js";
import BladesCrew from "../documents/actors/BladesCrew.js";
import BladesNPC from "../documents/actors/BladesNPC.js";
import BladesFaction from "../documents/actors/BladesFaction.js";
import BladesClockKeeper from '../documents/items/BladesClockKeeper.js';
import BladesGMTracker from '../documents/items/BladesGMTracker.js';
import BladesLocation from "../documents/items/BladesLocation.js";
import BladesScore from "../documents/items/BladesScore.js";
import BladesProject from "../documents/items/BladesProject.js";

declare global {

  // Utility Types for BladesItems
  type TurfNum = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "11" | "12" | "13" | "14" | "15";

  // Random categories for BladesScore
  type RandomCat = keyof typeof Randomizers["GM"];

  // Embeddable BladesItem types
  // type EmbeddableItemType<ParentType extends BladesActorType|BladesItemType> =
  //   ParentType extends BladesActorType.pc ? BladesItemType.ability|BladesItemType.background|BladesItemType.cohort_expert|BladesItemType.cohort_gang|BladesItemType.feature|BladesItemType.heritage|BladesItemType.gear|BladesItemType.playbook|BladesItemType.stricture|BladesItemType.vice|BladesItemType.project|BladesItemType.ritual|BladesItemType.design :
  //   ParentType extends BladesActorType.crew ? BladesItemType.cohort_expert|BladesItemType.cohort_gang|BladesItemType.crew_ability|BladesItemType.crew_playbook|BladesItemType.crew_reputation|BladesItemType.crew_upgrade|BladesItemType.preferred_op :
  //   ParentType extends BladesActorType.npc ? BladesItemType.ability|BladesItemType.background|BladesItemType.cohort_expert|BladesItemType.cohort_gang|BladesItemType.feature|BladesItemType.heritage|BladesItemType.gear|BladesItemType.playbook|BladesItemType.stricture|BladesItemType.vice|BladesItemType.project|BladesItemType.ritual|BladesItemType.design :
  //   ParentType extends BladesActorType.faction ? BladesItemType.cohort_expert|BladesItemType.cohort_gang|BladesItemType.crew_ability|BladesItemType.crew_playbook|BladesItemType.crew_reputation|BladesItemType.crew_upgrade|BladesItemType.gear|BladesItemType.preferred_op|BladesItemType.project|BladesItemType.ritual|BladesItemType.design :
  //   ParentType extends BladesItemType.location ? BladesItemType.location :
  //   ParentType extends BladesItemType.score ? BladesItemType.location : never;

  // #region SCHEMA DATA: TEMPLATE.JSON & SYSTEM

  // template.json "template" definitions for BladesItems
  namespace BladesItemSchemaTemplate {

    export interface Default extends BladesDocSchemaTemplate.Default {
      prereqs: Record<string, string>
      rules: string
      notes: string
      description: string
      tier: NamedValueMax
    }

    export interface district { district?: District }

    export interface clocks {
      clocksData: Record<IDString, BladesClockKey.Data>
    }

    export interface buyable { price: number }

    export interface limitUses { uses_per_score: ValueMax }

    export interface cohort {
      subtypes: Record<string, string>,
      elite_subtypes: Record<string, string>,
      subtitle: string,
      edges: Record<string, string>,
      flaws: Record<string, string>,
      harm: ValueMax,
      armor: ValueMax,
      scale_bonus: number,
      quality_bonus: number,

      scale: number,
      scaleExample: string,
      quality: number,
      image?: string,
      imageLeft?: string,
      imageRight?: string
    }

    export interface playbook {
      concept: string,
      experience_clues: Record<string,string>,
      gather_info_questions: Record<string,string>
    }

    export interface answers { answers: Record<"a" | "b" | "c" | "d", string> }

    export interface canRoll {
      roll_mods: string[]
    }
  }

  // Compiled "system" Schemas for BladesItem Types
  namespace BladesItemSchema {

    export interface Ability extends BladesItemSchemaTemplate.Default,
      BladesItemSchemaTemplate.buyable,
      BladesItemSchemaTemplate.limitUses { }

    export interface Background extends BladesItemSchemaTemplate.Default { }

    export interface Clock_Keeper extends BladesItemSchemaTemplate.Default,
      BladesItemSchemaTemplate.clocks {
      scenes: Record<IDString, {
        name: string,
        keyIDs: IDString[]
      }>,
      targetScene: IDString | null
    }

    export interface Cohort_Gang extends BladesItemSchemaTemplate.Default,
      BladesItemSchemaTemplate.district,
      BladesItemSchemaTemplate.clocks,
      BladesItemSchemaTemplate.cohort,
      BladesItemSchemaTemplate.canRoll { }

    export interface Cohort_Expert extends BladesItemSchemaTemplate.Default,
      BladesItemSchemaTemplate.district,
      BladesItemSchemaTemplate.clocks,
      BladesItemSchemaTemplate.cohort,
      BladesItemSchemaTemplate.canRoll { }

    export interface Crew_Ability extends BladesItemSchemaTemplate.Default,
      BladesItemSchemaTemplate.district,
      BladesItemSchemaTemplate.buyable,
      BladesItemSchemaTemplate.limitUses { }

    export interface Crew_Reputation extends BladesItemSchemaTemplate.Default { }

    export interface Crew_Playbook extends BladesItemSchemaTemplate.Default,
      BladesItemSchemaTemplate.playbook {
      turfs: Record<TurfNum, BladesClaimData>
    }

    export interface Crew_Upgrade extends BladesItemSchemaTemplate.Default,
      BladesItemSchemaTemplate.district,
      BladesItemSchemaTemplate.buyable,
      BladesItemSchemaTemplate.limitUses { }

    export interface Feature extends BladesItemSchemaTemplate.Default,
      BladesItemSchemaTemplate.buyable,
      BladesItemSchemaTemplate.limitUses { }

    export interface Gm_Tracker extends BladesItemSchemaTemplate.Default {
      phase: BladesPhase,
      phases: BladesPhase[],
      is_spoofing_player: boolean
    }

    export interface Heritage extends BladesItemSchemaTemplate.Default { }

    export interface Gear extends BladesItemSchemaTemplate.Default,
      BladesItemSchemaTemplate.limitUses {
      max_per_score: number,
      load: number
    }

    export interface Playbook extends BladesItemSchemaTemplate.Default,
      BladesItemSchemaTemplate.playbook { }

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
      BladesItemSchemaTemplate.clocks {
      scale: number
    }

    export interface Score extends BladesItemSchemaTemplate.Default,
      BladesItemSchemaTemplate.district,
      BladesItemSchemaTemplate.clocks {
      target: string,
      operation: string,
      detail: string,
      engagement_result: string,
      entanglements: Record<string, string>,
      reward: string,
      locations: Record<string, string>,
      images: Record<number, string>,
      imageSelected: number,
      oppositions: Record<string, BladesRoll.OppositionData>,
      oppositionSelected: string,
      isActive: boolean,
      randomizers: Record<RandomCat, Record<string, Record<string, any>>>,
      pc_notes: Record<string,string>
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
    Partial<BladesItemSchema.Gear>,
    Partial<BladesItemSchema.Playbook>,
    Partial<BladesItemSchema.Preferred_Op>,
    Partial<BladesItemSchema.Stricture>,
    Partial<BladesItemSchema.Vice>,
    Partial<BladesItemSchema.Project>,
    Partial<BladesItemSchema.Ritual>,
    Partial<BladesItemSchema.Design>,
    Partial<BladesItemSchema.Location>,
    Partial<BladesItemSchema.Score> { }

  type BladesItemOfType<T extends BladesItemType> =
  // T extends BladesItemType.ability ? BladesItem & { system: ExtractBladesItemSystem<BladesItemType.ability> } :
  // T extends BladesItemType.background ? BladesItem & { system: ExtractBladesItemSystem<BladesItemType.background> } :
  // T extends BladesItemType.clock_keeper ? BladesClockKeeper & { system: ExtractBladesItemSystem<BladesItemType.clock_keeper> } :
  // T extends BladesItemType.cohort_gang ? BladesItem & { system: ExtractBladesItemSystem<BladesItemType.cohort_gang> } :
  // T extends BladesItemType.cohort_expert ? BladesItem & { system: ExtractBladesItemSystem<BladesItemType.cohort_expert> } :
  // T extends BladesItemType.crew_ability ? BladesItem & { system: ExtractBladesItemSystem<BladesItemType.crew_ability> } :
  // T extends BladesItemType.crew_reputation ? BladesItem & { system: ExtractBladesItemSystem<BladesItemType.crew_reputation> } :
  // T extends BladesItemType.crew_playbook ? BladesItem & { system: ExtractBladesItemSystem<BladesItemType.crew_playbook> } :
  // T extends BladesItemType.crew_upgrade ? BladesItem & { system: ExtractBladesItemSystem<BladesItemType.crew_upgrade> } :
  // T extends BladesItemType.feature ? BladesItem & { system: ExtractBladesItemSystem<BladesItemType.feature> } :
  // T extends BladesItemType.gm_tracker ? BladesGMTracker & { system: ExtractBladesItemSystem<BladesItemType.gm_tracker> } :
  // T extends BladesItemType.heritage ? BladesItem & { system: ExtractBladesItemSystem<BladesItemType.heritage> } :
  // T extends BladesItemType.gear ? BladesItem & { system: ExtractBladesItemSystem<BladesItemType.gear> } :
  // T extends BladesItemType.playbook ? BladesItem & { system: ExtractBladesItemSystem<BladesItemType.playbook> } :
  // T extends BladesItemType.preferred_op ? BladesItem & { system: ExtractBladesItemSystem<BladesItemType.preferred_op> } :
  // T extends BladesItemType.stricture ? BladesItem & { system: ExtractBladesItemSystem<BladesItemType.stricture> } :
  // T extends BladesItemType.vice ? BladesItem & { system: ExtractBladesItemSystem<BladesItemType.vice> } :
  // T extends BladesItemType.project ? BladesProject & { system: ExtractBladesItemSystem<BladesItemType.project> } :
  // T extends BladesItemType.ritual ? BladesItem & { system: ExtractBladesItemSystem<BladesItemType.ritual> } :
  // T extends BladesItemType.design ? BladesItem & { system: ExtractBladesItemSystem<BladesItemType.design> } :
  // T extends BladesItemType.location ? BladesLocation & { system: ExtractBladesItemSystem<BladesItemType.location> } :
  // T extends BladesItemType.score ? BladesScore & { system: ExtractBladesItemSystem<BladesItemType.score> } :
  BladesItem & { system: ExtractBladesItemSystem<T> }

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
    [BladesItemType.gear]: BladesItemSchema.Gear,
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

  namespace BladesItemComponent {

    export interface Default {
      getFactorTotal(factor: Factor): number;
    }

  }

  namespace BladesItemSubClass {

    export interface Ability extends BladesItemComponent.Default {}
    export interface Background extends BladesItemComponent.Default {}
    export interface Clock_Keeper extends BladesItemComponent.Default {}
    export interface Cohort_Gang extends BladesItemComponent.Default {}
    export interface Cohort_Expert extends BladesItemComponent.Default {}
    export interface Crew_Ability extends BladesItemComponent.Default {}
    export interface Crew_Reputation extends BladesItemComponent.Default {}
    export interface Crew_Playbook extends BladesItemComponent.Default {}
    export interface Crew_Upgrade extends BladesItemComponent.Default {}
    export interface Feature extends BladesItemComponent.Default {}
    export interface Gm_Tracker extends BladesItemComponent.Default {}
    export interface Heritage extends BladesItemComponent.Default {}
    export interface Gear extends BladesItemComponent.Default {}
    export interface Playbook extends BladesItemComponent.Default {}
    export interface Preferred_Op extends BladesItemComponent.Default {}
    export interface Stricture extends BladesItemComponent.Default {}
    export interface Vice extends BladesItemComponent.Default {}
    export interface Project extends BladesItemComponent.Default {}
    export interface Ritual extends BladesItemComponent.Default {}
    export interface Design extends BladesItemComponent.Default {}
    export interface Location extends BladesItemComponent.Default {}
    export interface Score extends BladesItemComponent.Default {}

  }
  // #endregion

}
