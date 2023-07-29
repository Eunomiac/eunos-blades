import { BladesActorType, Tag, District, Attributes, Actions } from "../core/constants.js";
import BladesActor from "../blades-actor.js";

declare global {
	type SubActorData = Partial<BladesActor["system"]>

	type BladesRandomizer = {
		isLocked: boolean,
		value: string
	}

	type BladesClaimData = {
		name: string,
		flavor?: string,
		description: string,
		value: boolean,
		isTurf: boolean,
		connects: {
			left: boolean,
			right: boolean,
			top: boolean,
			bottom: boolean
		}
	}

	type BladesClockData = {
		title: string,
		value: number,
		max: number,
		color: string,
		scene?: string,
		isClockVisible?: boolean,
		isTitleVisible?: boolean,
		isFocused?: boolean
	}

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

		get totalAdvancementPoints(): number;
		get spentAdvancementPoints(): number;
		get availableAdvancementPoints(): number;

		addAdvancementPoints(amount: number): Promise<void>;
		removeAdvancementPoints(amount: number): Promise<void>;

		advancePlaybook(): Promise<void>;
	}

	interface CrewAdvancement extends Advancement {
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

	namespace BladesDocSchemaTemplate {

		export interface Default {
			world_name: string,
			gm_notes: string,
			tags: BladesTag[]
		}
	}

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

	type BladesRandomizer<T extends string = string> = {
		isLocked: boolean,
		value: T
	}

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
			}
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
			}
		}

		export interface Faction extends BladesActorSchemaTemplate.Default,
			BladesActorSchemaTemplate.gmChar,
			BladesActorSchemaTemplate.hold { }
	}

	interface BladesActorSystem extends BladesActorSchemaTemplate.Default,
		Partial<BladesActorSchema.Scoundrel>,
		Partial<BladesActorSchema.Crew>,
		Partial<BladesActorSchema.NPC>,
		Partial<BladesActorSchema.Faction> { }

	type ExtractBladesActorSystem<T extends BladesActorType> = {
		[BladesActorType.pc]: BladesActorSchema.Scoundrel;
		[BladesActorType.crew]: BladesActorSchema.Crew;
		[BladesActorType.npc]: BladesActorSchema.NPC;
		[BladesActorType.faction]: BladesActorSchema.Faction;
	}[T];

	type BladesActorOfType<T extends BladesActorType> = BladesActor & {
		system: ExtractBladesActorSystem<T>;
	};

	type BladesDotlineData = {
		data: ValueMax,
		target: string,
		iconEmpty?: string,
		iconEmptyHover?: string,
		iconFull?: string,
		iconFullHover?: string,
		svgKey?: string,
		svgFull?: string,
		svgEmpty?: string
	}
	type BladesCompData = {
		class?: string,
		label?: string,
		labelClass?: string,
		dotline?: BladesDotlineData
	}

	namespace BladesSheetData {

		export interface Scoundrel {}

		export interface Crew {}

		export interface NPC {}

		export interface Faction {
			tierData: BladesCompData
		}
	}
}
