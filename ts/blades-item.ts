import C, {SVGDATA, BladesItemType} from "./core/constants.js";
import U from "./core/utilities.js";
import BladesActor from "./blades-actor.js";

class BladesItem extends Item {

	static Categories: Record<string, BladesItemType> = {
		"ability": BladesItemType.ability,
		"background": BladesItemType.background,
		"clock_keeper": BladesItemType.clock_keeper,
		"cohort": BladesItemType.cohort,
		"crew_ability": BladesItemType.crew_ability,
		"crew_reputation": BladesItemType.crew_reputation,
		"crew_playbook": BladesItemType.crew_playbook,
		"crew_upgrade": BladesItemType.crew_upgrade,
		"faction": BladesItemType.faction,
		"feature": BladesItemType.feature,
		"gm_tracker": BladesItemType.gm_tracker,
		"heritage": BladesItemType.heritage,
		"item": BladesItemType.item,
		"playbook": BladesItemType.playbook,
		"stricture": BladesItemType.stricture,
		"vice": BladesItemType.vice
	}

	static get(itemNameOrId: string): BladesItem|null {
		if (!game.items) { return null }
		const item = game.items.find((item: BladesItem) => item.id === itemNameOrId || item.name === itemNameOrId)
			?? game.items.find((item: BladesItem) => item.system.world_name === itemNameOrId);;
		if (!item) { return null }
		return item as BladesItem;
	}

	static async Embed(itemRef: string|BladesItem, parent: BladesActor): Promise<BladesItem|undefined> {
		let item: BladesItem;
		if (typeof itemRef === "string") {
			const foundItem = BladesItem.get(itemRef);
			if (!foundItem) { return }
			item = foundItem;
		} else {
			item = itemRef;
		}
		const embItem = BladesItem.create(item as any, {parent}) as Promise<BladesItem|undefined>;
		if (!embItem) { return }
		return embItem;
	}

	static async getAllItemsByType(item_type: string, isIncludingPacks = false): Promise<BladesItem[]> {
	 if (!game.items) { return [] }

	 const items: BladesItem[] = game.items.filter((item: BladesItem) => item.type === item_type);

	 if (isIncludingPacks || items.length === 0) {
		 const pack = game.packs.find((pack) => pack.metadata.name === item_type);
		 if (pack) {
			 const pack_items = await pack.getDocuments() as BladesItem[];
			 items.push(...pack_items);
		 }
	 }

	 items.sort(function(a, b) {
		 const nameA = a.data.name.toUpperCase();
		 const nameB = b.data.name.toUpperCase();
		 return nameA.localeCompare(nameB);
	 });

	 return items;
	}


	override async _preCreate( data: any, options: any, user: User ) {
		await super._preCreate( data, options, user );

		if (user.id !== game.user?.id) { return }
		if (this.parent?.documentName !== "Actor") { return }

		if (["background", "heritage", "vice", "playbook", "crew_playbook", "crew_reputation"].includes(data.type)) {
			await this.parent.deleteEmbeddedDocuments("Item", this.parent.items
				.filter((item) => item.type === data.type)
				.map((item) => item.id ?? ""));
		}
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
	get isCustomizedItem() { return this.isEmbedded && this.system.isCustomized }
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

	isValidForDoc(doc: BladesActor|BladesItem): boolean {
		let isValid = true;

		if (doc instanceof BladesActor) {
			//~ Check Playbook Compatibility
			if (this.type === "item") {
				isValid = Boolean(this.playbooks.includes("ANY")
				|| (doc.playbookName && this.playbooks.includes(doc.playbookName)));
			}
			if (this.type === "ability") {
				isValid = Boolean((doc.playbookName && this.playbooks.includes(doc.playbookName))
				|| (!this.playbooks.includes("Ghost")
				&& !this.playbooks.includes("Hull")
				&& !this.playbooks.includes("Vampire")));
			}
			if (this.type === "crew_ability") {
				isValid = Boolean(doc.playbookName);
			}
			if (this.type === "crew_upgrade") {
				isValid = Boolean(this.playbooks.includes("ANY")
				|| (doc.playbookName && this.playbooks.includes(doc.playbookName)));
			}
			if (!isValid) { return false }

			//~ Check Load Amounts
			if ("load" in this.system) {
				isValid = this.system.load! <= doc.remainingLoad;
			}
			if (!isValid) { return false }

			//~ Check Quantities
			isValid = doc.items.filter((i) => i.name === this.name).length < (this.system.num_available ?? 1);
			if (!isValid) { return false }

			//~ Check any prerequisites
			for (let [dotKey, val] of Object.entries(flattenObject(this.system.prereqs ?? {}))) {
				if (dotKey.startsWith("item")) {
					dotKey = dotKey.replace(/^item\.?/, "");
					if (doc.items.filter((item) => getProperty(item, dotKey) === val).length === 0) {
						isValid = false;
						break;
					}
				} else {
					if (getProperty(doc, dotKey) !== val) {
						isValid = false;
						break;
					}
				}
			}
		} else {
			isValid = false;
		}

		return isValid;
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
		if (this.isEmbedded && "isCustomized" in this.system && this.system.isCustomized === false) {
			this.update({"system.isCustomized": true});
		}
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
	system: {
		type: string,
		world_name: string,
		bgImg: string,
		description: string,
		isCustomized: boolean,
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
		uses?: number,
		keepAsGhost?: boolean,
		prereqs?: Record<string,any>,
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