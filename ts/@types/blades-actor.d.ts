type SubActorData = Partial<BladesActor["system"]>

type NPCRandomizerData = {
  isLocked: boolean,
  value: string,
  size: "05" | 1 | 2 | 4,
  label: string | null
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

interface BladesPrimaryActor {
	primaryUser?: User;
}
interface SubActorControl {
	subActors: BladesActor[];
	activeSubActors: BladesActor[];
	archivedSubActors: BladesActor[];

	getDialogActors(category: SelectionCategory): Record<string, BladesActor[]>|false;

	getSubActor(actorRef: ActorRef): BladesActor|undefined;
	addSubActor(actorRef: ActorRef): Promise<void>;
	updateSubActor(actorRef: ActorRef, updateData: DeepPartial<SubActorData & Record<string,any>>): Promise<BladesActor|undefined>;
	remSubActor(actorRef: ActorRef): Promise<void>;
	purgeSubActor(actorRef: ActorRef): Promise<void>;

	hasSubActorOf(actorRef: ActorRef): boolean;

	clearSubActors(): Promise<void>;
}
interface SubItemControl {
	subItems: BladesItem[];
	activeSubItems: BladesItem[];
	archivedSubItems: BladesItem[];

	getDialogItems(category: SelectionCategory): Record<string, BladesItem[]>|false;

	getSubItem(itemRef: ItemRef): BladesItem|undefined;
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

	get playbook(): BladesItem|undefined;
	get playbookName(): (BladesTag & Playbook)|undefined;
	get vice(): BladesItem|undefined;
	get crew(): BladesActor|undefined;
	get abilities(): BladesItem[];

	get attributes(): Record<Attributes,number>|undefined;
	get actions(): Record<Actions,number>|undefined;
	get rollable(): Record<Attributes|Actions, number>|undefined;

	get trauma(): number;
	get traumaList(): string[];
	get activeTraumaConditions(): Record<string,boolean>

	get currentLoad(): number;
	get remainingLoad(): number;

}
interface BladesCrew extends SubActorControl, SubItemControl, CrewAdvancement {
	members: BladesActor[];
	contacts: BladesActor[];
	claims: Record<number,BladesClaimData>;
	turfCount: number;

	get playbook(): BladesItem|undefined;
	get playbookName(): (BladesTag & Playbook)|undefined;
	get abilities(): BladesItem[];
	get upgrades(): BladesItem[];

}
interface BladesNPC extends SubItemControl, BladesSubActor {

}

interface BladesActorSystem {
	world_name: string,
	full_name: string,
	subactors: Record<string,SubActorData>,
	notes: string,
	gm_notes: string,
	tags: BladesTag[],
	acquaintances_name: string,
	friends_name?: string,
	rivals_name?: string,
	vice: {
		name: string,
		override: string|{name: string, img: string}
	},
	stress: NamedValueMax,
	trauma: {
		name: string,
		max: number,
		active: Record<string,boolean|null>,
		checked: Record<string,boolean|null>
	},
	healing: ValueMax,
	resistance_bonuses: Record<Attributes, number>,
	experience: {
		playbook: ValueMax,
		[Attributes.insight]: ValueMax,
		[Attributes.prowess]: ValueMax,
		[Attributes.resolve]: ValueMax,
		clues: string[]
	},
	coins: ValueMax,
	stash: ValueMax,
	loadout: {
		selected: ""|keyof BladesActor["system"]["loadout"]["levels"],
		levels: {
			light: number,
			normal: number,
			heavy: number,
			encumbered: number
		}
	},
	harm: {
		light: {
			one: string,
			two: string,
			effect: string
		},
		medium: {
			one: string,
			two: string,
			effect: string
		},
		heavy: {
			one: string,
			effect: string
		},
		fatal: {
			one: string,
			effect: string
		}
	},
	armor: {
		active: {
			light: boolean,
			heavy: boolean,
			special: boolean
		},
		checked: {
			light: boolean,
			heavy: boolean,
			special: boolean
		}
	},
	attributes: Record<Attributes, Record<Actions,ValueMax>>,
	concept?: string,
	description_short?: string,
	randomizers: {
		name: NPCRandomizerData,
		gender: NPCRandomizerData,
		heritage: NPCRandomizerData,
		appearance: NPCRandomizerData,
		goal: NPCRandomizerData,
		method: NPCRandomizerData,
		profession: NPCRandomizerData,
		trait_1: NPCRandomizerData,
		trait_2: NPCRandomizerData,
		trait_3: NPCRandomizerData,
		interests: NPCRandomizerData,
		quirk: NPCRandomizerData,
		style: NPCRandomizerData
	},
	rep: ValueMax,
	tier: ValueMax,
	deity: string,
	hold: "strong"|"weak",
	// turfs: ValueMax,
	heat: ValueMax,
	wanted: ValueMax,
	hunting_grounds: string,
	advancement_points: number,
	upgrade_points: number,
	ability_points: number,
	goal_1: NamedValueMax,
	goal_2: NamedValueMax
}
