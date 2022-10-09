import BladesHelpers from "./euno-helpers.js";

/**
 * Extend the basic Item
 * @extends {Item}
 */
export class BladesItem extends Item {

	static async Initialize() {
		Hooks.once("ready", async () => {
			game.eunoblades ??= {};
			game.eunoblades.ClockKeeper = game.items.find((item) => item.type === "clock_keeper");
			if (!game.eunoblades.ClockKeeper) {
				game.eunoblades.ClockKeeper = (await Item.create([{
					name: "Clock Keeper",
					type: "clock_keeper",
					img: "systems/eunos-blades/assets/icons/clock-keeper.svg"
				}]))[0];
			}
			game.eunoblades.ClockKeeper.renderOverlay();
		});
		return loadTemplates([
			"systems/eunos-blades/templates/clock-overlay.hbs",
			"systems/eunos-blades/templates/clock-keeper-sheet.hbs",
			"systems/eunos-blades/templates/parts/clock-key.hbs",
			"systems/eunos-blades/templates/parts/clock.hbs",
			"systems/eunos-blades/templates/parts/clock-clip-paths.hbs",
			"systems/eunos-blades/templates/parts/clock-sheet-row.hbs"
		]);
	}

	/** @override */
	async _preCreate( data, options, user ) {
		await super._preCreate( data, options, user );

		if (user.id !== game.user.id) { return }
		if (this.parent?.documentName !== "Actor") { return }

		await this.parent.deleteEmbeddedDocuments("Item", BladesHelpers.removeDuplicatedItemType(data, this.parent));
	}

	/** @override */
	async _on( data, options, user ) {
		await super._preCreate( data, options, user );

		if (user.id !== game.user.id) { return }
		if (this.parent?.documentName !== "Actor") { return }

		await this.parent.deleteEmbeddedDocuments("Item", BladesHelpers.removeDuplicatedItemType(data, this.parent));
	}

	/** @override */
	prepareData() {
		super.prepareData();

		if (this.data.type === "faction") { this._prepareFaction() }
		if (this.data.type === "clock_keeper") { this._prepareClockKeeper() }
		if (this.data.type === "cohort") { this._prepareCohort() }
	}

	_prepareFaction() {
		this.system.goal_1_clock_value ??= 0;
		if (this.system.goal_1_clock_max === 0) {this.system.goal_1_clock_max = 4}
		this.system.goal_2_clock_value ??= 0;
		if (this.system.goal_2_clock_max === 0) {this.system.goal_2_clock_max = 4}
		this.system.size_list_1 = BladesHelpers.createListOfClockSizes( game.system.bobclocks.sizes, this.system.goal_1_clock_max, parseInt( this.system.goal_1_clock_max ) );
		this.system.size_list_2 = BladesHelpers.createListOfClockSizes( game.system.bobclocks.sizes, this.system.goal_2_clock_max, parseInt( this.system.goal_2_clock_max ) );
	}

	_prepareClockKeeper() {
		this.system.scenes = game.scenes?.map((scene) => ({id: scene.id, name: scene.name}));
		this.system.targetScene ??= game.scenes?.current.id;
		this.system.clock_keys = Object.fromEntries(Object.entries(this.system.clock_keys)
			.filter(([keyID, keyData]) => Boolean(keyData))
			.map(([keyID, keyData]) => {
				keyData.clocks = Object.fromEntries(Object.entries(keyData.clocks)
					.filter(([clockNum, clockData]) => Boolean(clockData)));
				return [keyID, keyData];
			}));

	}

	get tier() { return parseInt(this.parent?.system?.tiar || 0) }

	_prepareCohort() {
		if (this.parent?.documentName !== "Actor") { return }
		this.system.scale = {Gang: this.tier, Expert: 0}[this.system.cohort];
		this.system.quality = {Gang: this.tier, Expert: this.tier + 1}[this.system.cohort];
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

	async deleteClockKey(keyID) {
		const clockKeys = this.system.clock_keys;
		clockKeys[keyID] = null;
		return this.update({"system.clock_keys": clockKeys});
	}

	async setKeySize(keyID, keySize = 1) {
		keySize = parseInt(keySize);
		const clockKey = this.system.clock_keys[keyID];
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

	get overlayElement() {
		this._overlayElement ??= $("#euno-clock-keeper-overlay")[0];
		if (!this._overlayElement) {
			$("body.vtt.game.system-eunos-blades").append("<section id=\"euno-clock-keeper-overlay\"></section>");
			this._overlayElement = $("#euno-clock-keeper-overlay")[0];
		}
		return this._overlayElement;
	}

	async renderOverlay() {
		this.overlayElement.innerHTML = (await getTemplate("systems/eunos-blades/templates/clock-overlay.hbs"))({...this.system, currentScene: game.scenes?.current.id});
	}

	// _prepareClockKeeper(data) {
	// console.log("Clock Keeper Data", data);
	// this.data.data = data;

	// /* -------------------------------------------- */

	// /* override */
	// prepareData() {
	// 	super.prepareData();

	// 	const item_data = this.data;
	// 	const {data} = item_data;

	// 	if (item_data.type === "clock_keeper") { this._prepareClockKeeper(data) }
	// 	if (item_data.type === "cohort") { this._prepareCohort(data) }
	// 	if (item_data.type === "faction") { this._prepareFaction(data) }

	// 	this.data.data = data;
	// }

	// _prepareFaction(data) {
	// 	data.goal_1_clock_value ??= 0;
	// 	if( data.goal_1_clock_max === 0 ){ data.goal_1_clock_max = 4 }
	// 	data.goal_2_clock_value ??= 0;
	// 	if( data.goal_2_clock_max === 0 ){ data.goal_2_clock_max = 4 }
	// 	data.size_list_1 = BladesHelpers.createListOfClockSizes( game.system.bobclocks.sizes, data.goal_1_clock_max, parseInt( data.goal_1_clock_max ) );
	// 	data.size_list_2 = BladesHelpers.createListOfClockSizes( game.system.bobclocks.sizes, data.goal_2_clock_max, parseInt( data.goal_2_clock_max ) );

	// 	this.data.data = data;
	// }

	// /**
	//  * Prepares Cohort data
	//  *
	//  * @param {object} data
	//  */
	// _prepareCohort(data) {
	// 	let quality = 0, scale = 0;

	// 	// Adds Scale and Quality
	// 	if (this.actor.data) {
	// 		switch (data.cohort) {
	// 			case "Gang":
	// 				scale = parseInt(this.actor.data.data.tier || 0);
	// 				quality = parseInt(this.actor.data.data.tier || 0);
	// 				break;
	// 			case "Expert":
	// 				scale = 0;
	// 				quality = parseInt(this.actor.data.data.tier || 0) + 1;
	// 				break;
	// 			// no default
	// 		}
	// 	}

	// 	data.scale = scale;
	// 	data.quality = quality;

	// 	this.data.data = data;
	// }
	// }
}
