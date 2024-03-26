import {BladesActorType, Tag, District, AttributeTrait, ActionTrait, AdvancementPoint} from "../core/constants";
import BladesActor from "../BladesActor";
import BladesPC from "../documents/actors/BladesPC";
import BladesNPC from "../documents/actors/BladesNPC";
import BladesFaction from "../documents/actors/BladesFaction";
import BladesCrew from "../documents/actors/BladesCrew";
declare global {

  // Extending Type Definitions of 'Actor' Base Class to Foundry V11
  // declare class SeActor extends Actor {
  //   async _onCreateDescendantDocuments(...args: any[]): Promise<void>
  // }

  // Basic & Utility Types for BladesActors
  type BladesRandomizer<T extends string = string> = { isLocked: boolean, value: T }
  type SubActorData = Partial<BladesActor["system"]>
  type AdvancementTrait = ActionTrait|"Ability"|"Upgrade"|"Cohort"|"CohortType"
  type Loadout = "heavy"|"normal"|"light"|"encumbered"
  type harmLevel = 1|2|3|4;

  // #region SCHEMA DATA: TEMPLATE.JSON & SYSTEM

  // template.json "template" definitions for BladesActors
  namespace BladesActorSchemaTemplate {

    export interface Default extends BladesDocSchemaTemplate.Default {
      description: string,
      tier: NamedValueMax,
      subactors: Record<string, SubActorData>,
      subtitle: string
    }

    export interface gmChar {
      concept: string,
      district: District,
      assets: string,
      situation: string,
      turf: string,
      status: number
    }

    export interface pcChar {
      coins: ValueMax,
      experience: {
        playbook: ValueMax,
        clues: string[]
      },
      advancement_points: Record<string, number>,
      downtime_actions: ValueMax,
      downtime_action_bonus: number,
      downtime_action_selected_cost: "Rep"|"Coin",
      downtime_actions_open_submenu: DowntimeAction
    }

    export interface warfare {
      hold: "strong" | "weak",
      at_war_with: Record<string, boolean> // <actorID, boolean>
    }

    export interface canRoll {
      roll_mods: string[]
    }

    export interface clocks {
      clocksData: Record<IDString, BladesClockKey.Data>
    }
  }

  // Compiled "system" Schemas for BladesActor Types
  namespace BladesActorSchema {

    export interface Scoundrel extends BladesActorSchemaTemplate.Default,
      BladesActorSchemaTemplate.pcChar,
      BladesActorSchemaTemplate.clocks,
      BladesItemSchemaTemplate.canRoll {
      acquaintances_name: string,
      vice_name: string,
      stress: NamedValueMax,
      trauma: {
        name: string,
        max: number,
        active: Record<string, boolean>,
        checked: Record<string, boolean>
      },
      stash: ValueMax,

      loadout: {
        selected: "" | "light" | "normal" | "heavy" | "encumbered",
        levels: Record<"light" | "normal" | "heavy" | "encumbered", number>
      },
      harm: {
        lesser: Record<"one" | "two" | "effect", string>,
        moderate: Record<"one" | "two" | "effect", string>,
        severe: Partial<Record<"one" | "two" | "effect", string>> & Record<"one"|"effect", string>
      },
      armor: {
        active: Record<"light" | "heavy" | "special", boolean>,
        checked: Record<"light" | "heavy" | "special", boolean>
      },

      attributes: Record<AttributeTrait, Record<ActionTrait, ValueMax>>,
      resistance_bonus: Record<AttributeTrait, number>

      experience: BladesActorSchemaTemplate.pcChar["experience"] & {
        [AttributeTrait.insight]: ValueMax,
        [AttributeTrait.prowess]: ValueMax,
        [AttributeTrait.resolve]: ValueMax
      },
      gather_info: string[]
    }

    export interface Crew extends BladesActorSchemaTemplate.Default,
      BladesActorSchemaTemplate.pcChar,
      BladesActorSchemaTemplate.warfare,
      BladesItemSchemaTemplate.canRoll {
      rep: ValueMax,
      deity: string,
      heat: ValueMax,
      wanted: ValueMax,
      hunting_grounds: string,

      turfs?: Record<TurfNum, BladesClaimData>
    }

    export interface NPC extends BladesActorSchemaTemplate.Default,
      BladesActorSchemaTemplate.gmChar {
        // description: string,
        // tier: NamedValueMax,
        // subactors: Record<string, SubActorData>,
        // subtitle: string
      // concept: string,
      // clocks: Record<string, BladesClock.Data>,
      // district: District,
      // assets: string,
      // situation: string,
      // turf: string,
      // status: number
      magnitude: number,
      scale: number,
      persona: {
        gender: BladesRandomizer<"M" | "F" | "U" | "X" | "">,
        appearance: BladesRandomizer,
        style: BladesRandomizer,
        goal: BladesRandomizer,
        method: BladesRandomizer,
        quirk: BladesRandomizer,
        interests: BladesRandomizer,
        trait1: BladesRandomizer,
        trait2: BladesRandomizer,
        trait3: BladesRandomizer
      },
      secret: {
        goal: BladesRandomizer,
        method: BladesRandomizer,
        interests: BladesRandomizer,
        trait: BladesRandomizer
      },
      random: {
        name: BladesRandomizer,
        background: BladesRandomizer,
        heritage: BladesRandomizer,
        profession: BladesRandomizer
      }
    }

    export interface Faction extends BladesActorSchemaTemplate.Default,
      BladesActorSchemaTemplate.gmChar,
      BladesActorSchemaTemplate.clocks,
      BladesActorSchemaTemplate.warfare { }
  }

  // Merged Actor Subtype Schemas into Master BladesActor System Schema
  interface BladesActorSystem extends BladesActorSchemaTemplate.Default,
    DeepPartial<BladesActorSchema.Scoundrel>,
    DeepPartial<BladesActorSchema.Crew>,
    DeepPartial<BladesActorSchema.NPC>,
    DeepPartial<BladesActorSchema.Faction> { }

  // Distinguishing schema types for BladesActor subtypes

  type BladesActorOfType<T extends BladesActorType> =
  T extends BladesActorType.pc ? BladesPC & { system: ExtractBladesActorSystem<BladesActorType.pc> } :
  T extends BladesActorType.npc ? BladesNPC & { system: ExtractBladesActorSystem<BladesActorType.npc> } :
  T extends BladesActorType.crew ? BladesCrew & { system: ExtractBladesActorSystem<BladesActorType.crew> } :
  T extends BladesActorType.faction ? BladesFaction & { system: ExtractBladesActorSystem<BladesActorType.faction> } :
  BladesActor & {
    system: ExtractBladesActorSystem<T>
  };

  type ExtractBladesActorSystem<T extends BladesActorType | "ANY" = "ANY"> = {
    [BladesActorType.pc]: BladesActorSchema.Scoundrel,
    [BladesActorType.crew]: BladesActorSchema.Crew,
    [BladesActorType.npc]: BladesActorSchema.NPC,
    [BladesActorType.faction]: BladesActorSchema.Faction,
    ["ANY"]: BladesActorSystem
  }[T];

  // #endregion BASIC DATA

  // #region ACTOR SUBCLASS DEFINITIONS: ACCESSORS & METHODS

  namespace BladesActorComponent {

    export interface Default {
      isSubActor: boolean;
    }

    export interface PrimaryActor {
      primaryUser: User|null;

      clearLoadout(): Promise<void>;
    }

    export interface SubActorControl {
      subActors: BladesActor[];
      activeSubActors: BladesActor[];
      archivedSubActors: BladesActor[];

      getDialogActors(category: SelectionCategory): Record<string, BladesActor[]> | false;

      getSubActor(actorRef: ActorRef): BladesActor | undefined;
      addSubActor(actorRef: ActorRef): Promise<void>;
      updateSubActor(actorRef: ActorRef, updateData: DeepPartial<SubActorData & Record<string, any>>): Promise<BladesActor | undefined>;
      remSubActor(actorRef: ActorRef): Promise<void>;

      hasSubActorOf(actorRef: ActorRef): boolean;

      clearSubActors(): Promise<void>;
      clearParentActor(): Promise<void>;
    }

    export interface SubItemControl {
      subItems: BladesItem[];
      activeSubItems: BladesItem[];
      archivedSubItems: BladesItem[];

      getDialogItems(category: SelectionCategory): Record<string, BladesItem[]> | false;

      getSubItem(itemRef: ItemRef): BladesItem | undefined;
      addSubItem(itemRef: ItemRef): Promise<void>;
      remSubItem(itemRef: ItemRef): Promise<void>;
      purgeSubItem(itemRef: ItemRef): Promise<void>;
    }

    export interface CanSubActor {
      parentActor?: BladesActor;

      clearParentActor(): Promise<void>;
    }

    export interface Advancement {
      grantAdvancementPoints(aPt: AdvancementPoint|AdvancementPoint[], num: number): Promise<void>
      removeAdvancementPoints(aPt: AdvancementPoint|AdvancementPoint[], num: number): Promise<void>

      getAvailableAdvancements(trait: AdvancementTrait): number

      advancePlaybook(): Promise<void>;
      advanceAttribute(attr: AttributeTrait): Promise<void>;
    }

  }

  namespace BladesActorSubClass {

    export interface Scoundrel extends BladesActorComponent.Default,
                                       BladesActorComponent.PrimaryActor,
                                       BladesActorComponent.SubActorControl,
                                       BladesActorComponent.SubItemControl,
                                       BladesActorComponent.Advancement {

      isMember(crew: BladesActor): boolean;

      get playbook(): BladesItem | undefined;
      get playbookName(): (BladesTag & Playbook) | undefined;
      get vice(): BladesItem | undefined;
      get crew(): BladesActor | undefined;
      get abilities(): BladesItem[];

      get attributes(): Record<AttributeTrait, number>;
      get actions(): Record<ActionTrait, number>;
      get rollable(): Record<AttributeTrait | ActionTrait, number>;

      get trauma(): number;
      get traumaList(): string[];
      get activeTraumaConditions(): Record<string, boolean>

      get currentLoad(): number;
      get remainingLoad(): number;

    }

    export interface Crew extends BladesActorComponent.Default,
                                  BladesActorComponent.SubActorControl,
                                  BladesActorComponent.SubItemControl,
                                  BladesActorComponent.Advancement {

      members: BladesActor[];
      contacts: BladesActor[];
      claims: Record<number, BladesClaimData>;
      turfCount: number;

      get playbook(): BladesItem | undefined;
      get playbookName(): (BladesTag & Playbook) | undefined;
      get abilities(): BladesItem[];
      get upgrades(): BladesItem[];

    }

    export interface NPC extends BladesActorComponent.Default,
                                 BladesActorComponent.CanSubActor { }


    export interface Faction extends BladesActorComponent.Default,
                                     BladesActorComponent.SubActorControl,
                                     BladesActorComponent.CanSubActor { }

  }

  // #endregion

  // #region ACTOR getRollData() SCHEMA
  interface BladesActorRoll { }

  type BladesActorRollData<T extends BladesActorType | "ANY" = "ANY"> = T extends "ANY"
    ? BladesActorSystem & BladesActorRoll
    : ExtractBladesActorSystem<T> & BladesActorRoll;
  // #endregion

}
