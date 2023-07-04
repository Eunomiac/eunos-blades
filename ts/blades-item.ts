import C, {SVGDATA, BladesItemType, Tag} from "./core/constants.js";
import U from "./core/utilities.js";
import BladesActor from "./blades-actor.js";


export enum PrereqType {
	HasActiveItem = "HasActiveItem", // Item will only appear in selector if character has Item with world_name (value)
	HasActiveItemsByTag = "HasActiveItemByTag", // For each Tag, character must have an active Item with that tag.
	AdvancedPlaybook = "AdvancedPlaybook", // Item will only appear in selector if character is a Ghost, Hull or Vampire
	HasAllTags = "HasAllTags", // Item will only appear if character has all matching tags.
	HasAnyTag = "HasAnyTag", // Item will appear if character has any matching tag.

	Not_HasActiveItem = "Not_HasActiveItem",
	Not_HasActiveItemsByTag = "Not_HasActiveItemsByTag",
	Not_AdvancedPlaybook = "Not_AdvancedPlaybook",
	Not_HasAllTags = "Not_HasAllTags",
	Not_HasAnyTag = "Not_HasAnyTag"
}
declare abstract class BladesItemDocument {
	archive: () => Promise<BladesItem>;
	unarchive: () => Promise<BladesItem>;

	load: int|null;
	maxPerScore: int;
	usesPerScore: int;
	usesRemaining: int;
}
class BladesItem extends Item implements BladesDocument<Item>, BladesItemDocument {

	// #region BladesDocument Implementation
	static get All() { return game.items }
	static Get(itemRef: ItemRef): BladesItem|undefined {
		if (itemRef instanceof BladesItem) { return itemRef }
		if (U.isDocID(itemRef)) { return BladesItem.All.get(itemRef) }
		return BladesItem.All.find((a) => a.system.world_name === itemRef)
			|| BladesItem.All.find((a) => a.name === itemRef);
	}
	static GetTypeWithTags(docType: BladesItemType, ...tags: BladesTag[]): BladesItem[] {
		return BladesItem.All.filter((item) => item.type === docType)
			.filter((item) => item.hasTag(...tags));
	}

	get tags(): BladesTag[] { return this.system.tags ?? [] }
	hasTag(...tags: BladesTag[]): boolean {
		return tags.every((tag) => this.tags.includes(tag));
	}
	async addTag(...tags: BladesTag[]) {
		const curTags = this.tags;
		tags.forEach((tag) => {
			if (curTags.includes(tag)) { return }
			curTags.push(tag);
		});
		this.update({"system.tags": curTags});
	}
	async remTag(...tags: BladesTag[]) {
		const curTags = this.tags.filter((tag) => !tags.includes(tag));
		this.update({"system.tags": curTags});
	}

	get tooltip(): string|undefined {
		const tooltipText = [
			this.system.rules
		].find((str) => Boolean(str));
		if (tooltipText) { return (new Handlebars.SafeString(tooltipText)).toString() }
		return undefined;
	}
	// #endregion

	// #region BladesItemDocument Implementation

	async archive() {
		await this.addTag(Tag.System.Archived);
		return this;
	}
	async unarchive() {
		await this.remTag(Tag.System.Archived);
		return this;
	}

	get load() { return this.system.load ?? 0 }
	get maxPerScore() { return this.system.num_available ?? 1 }
	get usesPerScore() { return this.system.uses?.max ?? 1 }
	get usesRemaining() { return Math.max(0, this.usesPerScore - (this.system.uses?.value ?? 0)) }
	// #endregion

	override async _preCreate( data: any, options: any, user: User ) {
		await super._preCreate( data, options, user );

		if (user.id !== game.user?.id) { return }
		if (this.parent?.documentName !== "Actor") { return }
	}

	override prepareData() {
		super.prepareData();

		if (this.data.type === "faction") { this._prepareFaction() }
		if (this.data.type === "clock_keeper") { this._prepareClockKeeper() }
		if (this.data.type === "cohort") { this._prepareCohort() }
	}

	_prepareFaction() {
		if (this.type === "faction") {
			this.system.goal_1_clock_value ??= 0;
			if (this.system.goal_1_clock_max === 0) {this.system.goal_1_clock_max = 4}
			this.system.goal_2_clock_value ??= 0;
			if (this.system.goal_2_clock_max === 0) {this.system.goal_2_clock_max = 4}
		}
	}

	_prepareClockKeeper() {
		this.system.scenes = game.scenes?.map((scene) => ({id: scene.id, name: scene.name ?? ""}));
		this.system.targetScene ??= game.scenes?.current?.id;
		this.system.clock_keys = Object.fromEntries(Object.entries(this.system.clock_keys ?? {})
			.filter(([keyID, keyData]) => Boolean(keyData))
			.map(([keyID, keyData]) => {
				if (keyData === null) { return [keyID, null] }
				keyData.clocks = Object.fromEntries(Object.entries(keyData.clocks)
					.filter(([clockNum, clockData]) => Boolean(clockData)));
				return [keyID, keyData];
			}));
	}


	get tier() { return U.pInt(this.parent?.system?.tier) }
	get playbooks(): string[] { return this.system.playbooks ?? [] }

	isKept(actor: BladesActor): boolean|null {
		if (this.type !== "ability") { return null }
		const playbook = actor.playbookName;
		if (!playbook) { return null }
		if (this.system.playbooks?.includes(actor.playbookName)) {
			return true;
		}
		if (["Ghost", "Hull", "Vampire"].includes(actor.playbookName) && this.system.keepAsGhost) {
			return true;
		}
		return false;
	}

	_prepareCohort() {
		if (this.parent?.documentName !== "Actor") { return }
		if (!this.system.cohort) { return }
		this.system.scale = {Gang: this.tier, Expert: 0}[this.system.cohort];
		this.system.quality = {Gang: this.tier, Expert: this.tier + 1}[this.system.cohort];
	}

	async activateOverlayListeners() {
		$("#clocks-overlay").find(".clock-frame").on("wheel", async (event) => {
			if (!game?.user?.isGM) { return }
			if (!event.currentTarget) { return }
			if (!game.eunoblades.ClockKeeper) { return }
			if (!(event.originalEvent instanceof WheelEvent)) { return }

			event.preventDefault();

			const clock$ = $(event.currentTarget).closest(".clock");
			const [key] = clock$.closest(".clock-key");

			if (!(key instanceof HTMLElement)) { return }

			const keyID = key.id;
			const clockNum = clock$.data("index");
			const curClockVal = U.pInt(clock$.data("value"));
			const delta = event.originalEvent.deltaY < 0 ? 1 : -1;
			const size = U.pInt(clock$.data("size"));

			const newClockVal = U.gsap.utils.clamp(0, size, curClockVal + delta);

			if (curClockVal === newClockVal) { return }

			await this.update({
				[`system.clock_keys.${keyID}.clocks.${clockNum}.value`]: `${newClockVal}`
			});
			socketlib.system.executeForEveryone("renderOverlay");
		});

		$("#clocks-overlay").find(".clock").on("click", async (event) => {
			if (!event.currentTarget) { return }
			if (!game.eunoblades.ClockKeeper) { return }

			event.preventDefault();
			const [key] = $(event.currentTarget).closest(".clock-key");
			if (!(key instanceof HTMLElement)) { return }

			$(key).toggleClass("key-faded");
		});
	}

	async addClockKey() {
		const keyID = randomID();
		return this.update({[`system.clock_keys.${keyID}`]: {
			id: keyID,
			display: "",
			isVisible: false,
			isNameVisible: true,
			isActive: false,
			scene: this.system.targetScene,
			numClocks: 1,
			clocks: {
				1: {
					display: "",
					isVisible: true,
					isNameVisible: true,
					isActive: true,
					color: "yellow",
					size: 4,
					value: 0
				}
			}
		}});
	}

	async deleteClockKey(keyID: string) {
		const clockKeys = this.system.clock_keys ?? {};
		clockKeys[keyID] = null;
		return this.update({"system.clock_keys": clockKeys});
	}

	async setKeySize(keyID: string, keySize = 1) {
		keySize = parseInt(`${keySize}`);
		const clockKey = this.system.clock_keys![keyID];
		if (!clockKey) { return this }
		clockKey.numClocks = keySize;
		[...new Array(keySize)].map((_, i) => i + 1)
			.forEach((clockNum) => {
				clockKey.clocks[clockNum] ??= {
					display: "",
					isVisible: false,
					isNameVisible: false,
					isActive: false,
					color: "yellow",
					size: 4,
					value: 0
				};
			});
		[...new Array(6 - keySize)].map((_, i) => keySize + i + 1)
			.forEach((clockNum) => {
				clockKey.clocks[clockNum] = null;
			});
		return this.update({[`system.clock_keys.${keyID}`]: clockKey});
	}

	override async _onUpdate(changed: any, options: any, userId: string) {
		await super._onUpdate(changed, options, userId);
	}

	_overlayElement?: HTMLElement;
	get overlayElement() {
		this._overlayElement ??= $("#clocks-overlay")[0];
		if (!this._overlayElement) {
			$("body.vtt.game.system-eunos-blades").append("<section id=\"clocks-overlay\"></section>");
			[this._overlayElement] = $("#clocks-overlay");
		}
		return this._overlayElement;
	}

	async renderOverlay() {
		if (!game.scenes?.current) { return }
		this.overlayElement.innerHTML = (await getTemplate("systems/eunos-blades/templates/overlays/clock-overlay.hbs"))({
			...this.system,
			currentScene: game.scenes?.current.id,
			clockSizes: C.ClockSizes,
			svgData: SVGDATA
		});
		this.activateOverlayListeners();
	}
}

declare interface BladesItem {
	get type(): string & BladesItemType,
	parent: BladesActor | null,
	dialogCSSClasses?: string,
	system: {
		tags: BladesTag[],
		type: string,
		world_name: string,
		acquaintances_name: string,
		bgImg: string,
		description: string,
		rules: string,
		rules_notes: string,
		class?: string,
		price?: number,
		purchased?: boolean,
		class_default?: boolean,
		tier?: number,
		goal_1?: string,
		goal_1_clock_value?: number,
		goal_1_clock_max?: number,
		size_list_1?: string,
		goal_2?: string,
		goal_2_clock_value?: number,
		goal_2_clock_max?: number,
		playbooks?: string[],
		size_list_2?: string,
		turf?: string,
		assets?: string,
		quirks?: string,
		notables?: string,
		allies?: string,
		enemies?: string,
		situation?: string,
		suggested_ability?: string,
		goal_clock?: number,
		notes?: string,
		hold?: {
			value: number[],
			max: number,
			max_default: number,
			name_default: string,
			name: string
		},
		status?: {
			value: number[],
			max: number,
			max_default: number,
			name_default: string,
			name: string
		},
		load?: number,
		uses?: ValueMax,
		keepAsGhost?: boolean,
		prereqs?: Record<PrereqType, boolean|string|string[]>,
		additional_info?: string,
		equipped?: false,
		num_available?: number
		experience_clues?: string[],
		trauma_conditions?: string[],
		base_skills?: Record<string, number[]>,
		cohort?: string,
		scale?: number,
		quality?: number,
		cohort_list?: Record<string, {label: string}>,
		gang_type?: string[],
		gang_type_list?: Record<string, {
			label: string,
			description: string
		}>,
		expert_type?: string,
		statuses?: string[],
		edges?: string[],
		edges_list?: Record<string, {
			label: string,
			description: string,
			selected: boolean
		}>,
		flaws?: string[],
		flaws_list?: Record<string, {
			label: string,
			description: string,
			selected: boolean
		}>,
		harm?: string[],
		harm_list?: Record<string, {
			label: string,
			description: string,
			value: number
		}>,
		armor?: boolean,
		crew_types?: string[],
		turfs?: Record<string, {
				name: string,
				value: string,
				description: string,
				connects: string[]
		}>,
		clock_keys?: Record<string, clockKeyData|null>,
		scenes?: Array<{id: string, name: string}>,
		targetScene?: string
	}

}

export default BladesItem;