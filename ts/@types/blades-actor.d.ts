import { BladesActorType, Tag, District, Attributes, Actions } from "../core/constants.js";
import BladesActor from "../blades-actor.js";

declare global {

  // Basic & Utility Types for BladesActors
  type BladesRandomizer<T extends string = string> = { isLocked: boolean, value: T }
  type SubActorData = Partial<BladesActor["system"]>

  // #region SCHEMA DATA: TEMPLATE.JSON & SYSTEM

  // template.json "template" definitions for BladesActors
  namespace BladesActorSchemaTemplate {

    export interface Default extends BladesDocSchemaTemplate.Default {
      description: string,
      tier: ValueMax,
      subactors: Record<string, SubActorData>,
      subtitle: string
    }

    export interface gmChar {
      concept: string,
      clocks: Record<string, BladesClockData>,
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
      }
      advancement: {
        general: number,
        ability: number,
        upgrade: number
      }
    }

    export interface hold {
      hold: "strong" | "weak"
    }
  }

  // Compiled "system" Schemas for BladesActor Types
  namespace BladesActorSchema {

    export interface Scoundrel extends BladesActorSchemaTemplate.Default,
      BladesActorSchemaTemplate.pcChar {
      acquaintances_name: string,
      vice_name: string,
      stress: NamedValueMax,
      trauma: {
        name: string,
        max: number,
        active: Record<string, boolean>,
        checked: Record<string, boolean>
      },
      healing: ValueMax,
      stash: ValueMax,

      loadout: {
        selected: "" | "light" | "normal" | "heavy" | "encumbered",
        levels: Record<"light" | "normal" | "heavy" | "encumbered", number>
      },
      harm: {
        light: Record<"one" | "two" | "effect", string>,
        medium: Record<"one" | "two" | "effect", string>,
        heavy: Record<"one" | "effect", string>
      },
      armor: {
        active: Record<"light" | "heavy" | "special", boolean>,
        checked: Record<"light" | "heavy" | "special", boolean>
      },

      attributes: Record<Attributes, Record<Actions, ValueMax>>,
      resistance_bonus: Record<Attributes, number>,

      experience: BladesActorSchemaTemplate.pcChar["experience"] & {
        [Attributes.insight]: ValueMax,
        [Attributes.prowess]: ValueMax,
        [Attributes.resolve]: ValueMax
      },
      gather_info: string[]
    }

    export interface Crew extends BladesActorSchemaTemplate.Default,
      BladesActorSchemaTemplate.pcChar,
      BladesActorSchemaTemplate.hold {
      rep: ValueMax,
      deity: string,
      heat: ValueMax,
      wanted: ValueMax,
      hunting_grounds: string
    }

    export interface NPC extends BladesActorSchemaTemplate.Default,
      BladesActorSchemaTemplate.gmChar {
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
      BladesActorSchemaTemplate.hold { }
  }

  // Merged Actor Subtype Schemas into Master BladesActor System Schema
  interface BladesActorSystem extends BladesActorSchemaTemplate.Default,
    Partial<BladesActorSchema.Scoundrel>,
    Partial<BladesActorSchema.Crew>,
    Partial<BladesActorSchema.NPC>,
    Partial<BladesActorSchema.Faction> { }

  // Distinguishing schema types for BladesActor subtypes
  type BladesActorOfType<T extends BladesActorType> = BladesActor & {
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

      async clearParentActor(): Promise<void>;
    }

    export interface Advancement {
      get totalAbilityPoints(): number;
      get spentAbilityPoints(): number;
      get availableAbilityPoints(): number;

      addAbilityPoints(amount: number): Promise<void>;
      removeAbilityPoints(amount: number): Promise<void>;

      advancePlaybook(): Promise<void>;
    }

    export interface Advancement_Crew {
      get totalAdvancementPoints(): number;
      get spentAdvancementPoints(): number;
      get availableAdvancementPoints(): number;

      addAdvancementPoints(amount: number): Promise<void>;
      removeAdvancementPoints(amount: number): Promise<void>;

      get totalUpgradePoints(): number;
      get spentUpgradePoints(): number;
      get availableUpgradePoints(): number;

      get totalCohortPoints(): number;
      get spentCohortPoints(): number;
      get availableCohortPoints(): number;
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

      get attributes(): Record<Attributes, number> | undefined;
      get actions(): Record<Actions, number> | undefined;
      get rollable(): Record<Attributes | Actions, number> | undefined;

      get trauma(): number;
      get traumaList(): string[];
      get activeTraumaConditions(): Record<string, boolean>

      get currentLoad(): number;
      get remainingLoad(): number;

    }

    export interface Crew extends BladesActorComponent.Default,
                                  BladesActorComponent.SubActorControl,
                                  BladesActorComponent.SubItemControl,
                                  BladesActorComponent.Advancement,
                                  BladesActorComponent.Advancement_Crew {

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
                                 BladesActorComponent.SubItemControl,
                                 BladesActorComponent.CanSubActor { }



    export interface Faction extends BladesActorComponent.Default,
                                     BladesActorComponent.SubActorControl,
                                     BladesActorComponent.SubItemControl,
                                     BladesActorComponent.CanSubActor { }

  }

  // #region Interface Contracts for Implementation by BladesActor Subclass
  interface BladesPrimaryActor {
    primaryUser?: User;
  }
  interface SubActorControl {
    subActors: BladesActor[];
    activeSubActors: BladesActor[];
    archivedSubActors: BladesActor[];

    getDialogActors(category: SelectionCategory): Record<string, BladesActor[]> | false;

    getSubActor(actorRef: ActorRef): BladesActor | undefined;
    addSubActor(actorRef: ActorRef): Promise<void>;
    updateSubActor(actorRef: ActorRef, updateData: DeepPartial<SubActorData & Record<string, any>>): Promise<BladesActor | undefined>;
    remSubActor(actorRef: ActorRef): Promise<void>;
    purgeSubActor(actorRef: ActorRef): Promise<void>;

    hasSubActorOf(actorRef: ActorRef): boolean;

    clearSubActors(): Promise<void>;
  }
  interface SubItemControl {
    subItems: BladesItem[];
    activeSubItems: BladesItem[];
    archivedSubItems: BladesItem[];

    getDialogItems(category: SelectionCategory): Record<string, BladesItem[]> | false;

    getSubItem(itemRef: ItemRef): BladesItem | undefined;
    addSubItem(itemRef: ItemRef): Promise<void>;
    remSubItem(itemRef: ItemRef): Promise<void>;
    purgeSubItem(itemRef: ItemRef): Promise<void>;
  }
  interface BladesSubActor {
    isSubActor: boolean;
    parentActor?: BladesActor;

    async clearParentActor(): Promise<void>;
  }

  interface Advancement {
    get totalAbilityPoints(): number;
    get spentAbilityPoints(): number;
    get availableAbilityPoints(): number;

    addAbilityPoints(amount: number): Promise<void>;
    removeAbilityPoints(amount: number): Promise<void>;

    advancePlaybook(): Promise<void>;
  }

  interface CrewAdvancement extends Advancement {
    get totalAdvancementPoints(): number;
    get spentAdvancementPoints(): number;
    get availableAdvancementPoints(): number;

    addAdvancementPoints(amount: number): Promise<void>;
    removeAdvancementPoints(amount: number): Promise<void>;

    get totalUpgradePoints(): number;
    get spentUpgradePoints(): number;
    get availableUpgradePoints(): number;

    get totalCohortPoints(): number;
    get spentCohortPoints(): number;
    get availableCohortPoints(): number;
  }

  interface BladesScoundrel extends BladesPrimaryActor, SubActorControl, SubItemControl, Advancement {

    isMember(crew: BladesActor): boolean;

    get playbook(): BladesItem | undefined;
    get playbookName(): (BladesTag & Playbook) | undefined;
    get vice(): BladesItem | undefined;
    get crew(): BladesActor | undefined;
    get abilities(): BladesItem[];

    get attributes(): Record<Attributes, number> | undefined;
    get actions(): Record<Actions, number> | undefined;
    get rollable(): Record<Attributes | Actions, number> | undefined;

    get trauma(): number;
    get traumaList(): string[];
    get activeTraumaConditions(): Record<string, boolean>

    get currentLoad(): number;
    get remainingLoad(): number;

  }
  interface BladesCrew extends SubActorControl, SubItemControl, CrewAdvancement {
    members: BladesActor[];
    contacts: BladesActor[];
    claims: Record<number, BladesClaimData>;
    turfCount: number;

    get playbook(): BladesItem | undefined;
    get playbookName(): (BladesTag & Playbook) | undefined;
    get abilities(): BladesItem[];
    get upgrades(): BladesItem[];

  }
  interface BladesNPC extends SubItemControl, BladesSubActor {

  }
  // #endregion

  // #endregion

  // #region ACTOR getRollData() SCHEMA
  interface BladesActorRoll { }

  type BladesActorRollData<T extends BladesActorType | "ANY" = "ANY"> = T extends "ANY"
    ? BladesActorSystem & BladesActorRoll
    : ExtractBladesActorSystem<T> & BladesActorRoll;
  // #endregion

}
