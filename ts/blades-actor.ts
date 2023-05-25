import U from "./core/utilities.js";
import C, {BladesActorType, BladesItemType, Randomizers, Attributes, Actions, Positions, EffectLevels, Vice} from "./core/constants.js";

import type {ActorData, ActorDataConstructorData} from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/actorData.js";
import {bladesRoll} from "./blades-roll.js";
import type {DocumentModificationOptions} from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/abstract/document.mjs.js";
import BladesItem from "./blades-item.js";
import type BladesActiveEffect from "./blades-active-effect";
import type EmbeddedCollection from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/abstract/embedded-collection.mjs.js";


declare abstract class BladesDoc {
	// static CategoryTypes: Record<string, BladesActorType|BladesItemType>;
	// static CategoryFilters: Record<string, <T extends BladesActor|BladesItem|EmbeddedBladesActor|EmbeddedBladesItem>(items: T[]) => T[]>;
	// static CategoryUniques: Record<string, boolean>;s
	// static get All(): Collection<BladesActor>|Collection<BladesItem>;
	// static GetGlobal(category?: string): Promise<BladesActor|BladesItem|null>;
	// static GetPersonal(docRef: DocRef, category?: string): Promise<EmbeddedBladesActor|BladesItem|EmbeddedBladesItem|null>;
	// static Embed<T extends BladesActor|BladesItem>(docRef: DocRef, category: string, parent: T): Promise<T extends BladesActor ? (EmbeddedBladesActor|null) : (EmbeddedBladesItem|null)>;


}

class BladesActor extends Actor implements BladesDoc {
	static FoldersToTags(): void {
		const folderNames = [...C.Vices, ...Object.keys(C.Playbooks)];
		const folders = game.folders!.filter((folder) => folderNames.includes(folder.name || ""));
		folders.forEach((folder) => {
			const actors = folder.contents as BladesActor[];
			actors.forEach((actor) => {
				actor.addTag(folder.name! as BladesTag);
			});
		});
	}

	// #region ████████ Doc Methods: Methods in Common Between BladesActor & BladesItem ████████ ~
	//~ Actors are primarily referenced by category, not type: rarely "npc" or "crew" but rather "pc-crew" (a link category) or "rival"
	//~    BladesActor.CategoryTypes -> get actor type for given category
	//~    BladesActor.CategoryFilters -> pass actor list filtered by type, get one further filtered by category
	static CategoryTypes = {
		"pc-crew": BladesActorType.crew,
		"crew-pc": BladesActorType.pc,
		"vice_purveyor": BladesActorType.npc,
		"acquaintance": BladesActorType.npc,
		"rival": BladesActorType.npc,
		"pc": BladesActorType.pc,
		"npc": BladesActorType.npc,
		"crew": BladesActorType.crew
	};

	static CategoryFilters: Record<string, (actors: AnyBladesActor[], actorRef?: string|BladesActor) => AnyBladesActor[]> = {
		acquaintance: (actors, actorRef) => {
			const actor: BladesActor|null = actorRef ? BladesActor.Get(actorRef) : null;
			let npcs;
			if (actor !== null) {
				npcs = actors.filter((act) => act.tags.includes(actor.playbookName as BladesTag));
			} else {
				npcs = actors.filter((act) => act.type === BladesActorType.npc);
			}
			return npcs || [];
		},
		rival: (actors, actorRef) => {
			const actor: BladesActor|null = actorRef ? BladesActor.Get(actorRef) : null;
			let npcs;
			if (actor !== null) {
				npcs = actors.filter((act) => act.tags.includes(actor.playbookName as BladesTag));
			} else {
				npcs = actors.filter((act) => act.type === BladesActorType.npc);
			}
			return npcs || [];
		},
		vice_purveyor: (actors, actorRef) => {
			const vices: Vice[] = [];
			let actor;
			if (actorRef) { actor = BladesActor.Get(actorRef) }
			if (actor) {
				vices.push(...actor.vices.map((vice) => vice.system.world_name as Vice & BladesTag));
			} else {
				vices.push(...C.Vices);
			}

			eLog.checkLog3("actorFetch", "BladesActor.vicePurveyorFilter", vices);

			return actors.filter((actor) => actor.tags.some((tag) => vices.includes(tag as Vice & BladesTag)));
		}
	};

	static CategoryUniques: Record<string, boolean> = {
		"pc-crew": true,
		"crew-pc": false,
		"vice_purveyor": true,
		"acquaintance": false,
		"rival": false,
		"pc": false,
		"npc": false,
		"crew": true
	};

	static get All() { return game.actors }

	static Get(actorRef: string|BladesActor): BladesActor|null {
		if (actorRef instanceof BladesActor) { return actorRef }
		if (U.isDocID(actorRef)) { return BladesActor.All.get(actorRef) || null }
		let actor = BladesActor.All.find((a) => a.system.world_name === actorRef) || null;
		if (!actor) {
			actor = BladesActor.All.find((a) => a.name === actorRef) || null;
		}
		return actor;
	}

	private static getAllGlobalActors(): BladesActor[] {
		const actors = Array.from(BladesActor.All);

		// // Get PACK actors.
		// const packs = game.packs.filter((pack) => C.ActorTypes.includes(pack.metadata.name as BladesActorType));
		// const packActors = (await Promise.all(packs.map(async (pack) => {
		// 	const packDocs = await pack.getDocuments() as BladesActor[];
		// 	return packDocs.filter((packActor): packActor is BladesActor => !actors.some((act) => act.system.world_name === packActor.system.world_name));
		// }))).flat();

		// actors.push(...packActors);

		// Sort by NAME
		actors.sort(function(a, b) {
			const nameA = (a.name ?? "").toUpperCase();
			const nameB = (b.name ?? "").toUpperCase();
			return nameA.localeCompare(nameB);
		});

		eLog.checkLog3("actorFetch", "BladesActor.getAllGlobalActors", actors);

		return actors;
	}

	private static getActorsByCat(actorCat: keyof typeof BladesActor.CategoryTypes, actorRef?: string|BladesActor): BladesActor[] {
		if (!(actorCat in BladesActor.CategoryTypes)) { return [] }

		const allActors = BladesActor.getAllGlobalActors();

		// Filter by Category Type
		const allTypeActors = allActors.filter((actor) => actor.type === BladesActor.CategoryTypes[actorCat] as BladesActorType);

		// Filter by Category Filters, if present
		if (actorCat in BladesActor.CategoryFilters) {
			eLog.checkLog3("actorFetch", `BladesActor.getActorsByCat(${actorCat}) *FILTER*`, BladesActor.CategoryFilters[actorCat](allTypeActors, actorRef));
			return BladesActor.CategoryFilters[actorCat](allTypeActors, actorRef);
		}

		eLog.checkLog3("actorFetch", `BladesActor.getActorsByCat(${actorCat})`, allTypeActors);
		return allTypeActors;
	}

	//~ BladesActor.GetGlobal: Returns WORLD instance of referenced BladesActor.
	static GetGlobal(actorRef: string|BladesActor, actorCat?: keyof typeof BladesActor.CategoryTypes): BladesActor|null {
		if (actorCat) {
			if (!(actorCat in BladesActor.CategoryTypes)) { return null }
			if (actorRef instanceof BladesActor) {
				if (actorRef.type !== BladesActor.CategoryTypes[actorCat]) { return null }
				actorRef = actorRef.system.world_name ?? actorRef.id;
			}
		} else if (actorRef instanceof BladesActor) {
			actorCat = actorRef.type;
			actorRef = actorRef.system.world_name ?? actorRef.id;
		}

		const actors = actorCat ? BladesActor.getActorsByCat(actorCat, actorRef) : BladesActor.getAllGlobalActors();

		if (U.isDocID(actorRef)) {
			return actors.find((actor) => actor.id === actorRef) ?? null;
		} else {
			return actors.find((actor) => actor.name === actorRef)
				?? actors.find((actor) => actor.system.world_name === actorRef)
				?? null;
		}
	}

	//~ BladesActor.GetPersonal: Returns WORLD instance of referenced BladesActor IF Embedded in parent, merged
	//~  																																	with any personal data recorded on parent actor.
	static GetPersonal(actorRef: string|BladesActor, parent: BladesActor): EmbeddedBladesActor|null {
		if (!actorRef) { return null }
		// Get the global instance of the referenced Actor
		const actor = BladesActor.GetGlobal(actorRef);
		eLog.checkLog4("actorFetch", `BladesActor.GetPersonal(${typeof actorRef === "string" ? actorRef : actorRef.name}, ${parent.name
		}) -> Global Actor`, actor);
		if (!actor || !actor.id) { return null }

		if (!(actor.id in parent.system.subactors)) { return null }
		const {category, system, isArchived} = parent.system.subactors[actor.id];
		eLog.checkLog4("actorFetch", `BladesActor.GetPersonal(${typeof actorRef === "string" ? actorRef : actorRef.name}, ${parent.name
		}) -> Subactor Data`, {category, system, isArchived, parent});
		if (!category || !system) { return null }

		eLog.checkLog4("actorFetch", `BladesActor.GetPersonal(${typeof actorRef === "string" ? actorRef : actorRef.name}, ${parent.name
		}) -> Merged Actor`, {
			actor: Object.assign(actor, {
				isArchived,
				category,
				system: foundry.utils.mergeObject(actor.system, system)
		 })});
		return Object.assign(actor, {
			isArchived,
			category,
			system: foundry.utils.mergeObject(
				actor.system,
				system
			)
		});
	}

	//~ Embed: Embed a GLOBAL actor into a parent actor UNLESS custom actor exists, in which case unarchive it.
	static async Embed(actorRef: ActorRef, category: keyof typeof BladesActor.CategoryTypes, parent: BladesActor): Promise<EmbeddedBladesActor|null> {
		eLog.log2("[BladesActor.Embed(actorRef, category, parent)]", {actorRef, category, parent});
		const updateData: Record<string, boolean|BladesActor.SubActorData> = {};

		if (!(category in BladesActor.CategoryTypes)) { return null }

		//~ Get global actor from actorRef
		const globalActor = await BladesActor.GetGlobal(actorRef);
		if (!globalActor?.id) { return null }
		if (globalActor.id in parent.system.subactors) {
			updateData[`system.subactors.${globalActor.id}.isArchived`] = false;
		}
		updateData[`system.subactors.${globalActor.id}`] = {id: globalActor.id, category, system: {}, isArchived: false};

		await parent.update(updateData);

		return BladesActor.GetPersonal(actorRef, parent);
	}

	//~ Remove: Remove an embedded actor by archiving it.
	static async Remove(actorRef: ActorRef, category: string, parent: BladesActor, isFullRemoval = false): Promise<void> {
		eLog.log2("[BladesActor.Remove(actorRef, category, parent)]", {actorRef, category, parent});

		const updateData: Record<string, boolean|null> = {};

		if (!(category in BladesActor.CategoryTypes)) { return }

		//~ Get global actor from actorRef
		const globalActor = await BladesActor.GetGlobal(actorRef);
		if (!globalActor?.id) { return }
		if (globalActor.id in parent.system.subactors) {
			if (isFullRemoval) {
				updateData[`system.subactors.${globalActor.id}`] = null;
			} else {
				updateData[`system.subactors.${globalActor.id}.isArchived`] = true;
			}
		}

		await parent.update(updateData);

		return;
	}
	//~ GetEmbeddedActors: Get ALL embedded actors, GLOBAL instances merged with personal data.
	static GetEmbeddedActors(parent: BladesActor): EmbeddedBladesActor[] {
		return Object.keys(parent.system.subactors)
			.map((actorID) => BladesActor.GetPersonal(actorID, parent))
			.filter((actor): actor is EmbeddedBladesActor => actor !== null);
	}


	//~ GetEmbeddedCategoryActors: Get ALL embedded actors of given category.
	static GetEmbeddedCategoryActors(cat: string, parent: BladesActor): EmbeddedBladesActor[] {
		const catActorData: BladesActor.SubActorData[] = Object.values(parent.system.subactors).filter(({category}) => category === cat);
		const embActors = catActorData.map(({id}) => BladesActor.GetPersonal(id, parent));
		return embActors.filter((actor): actor is EmbeddedBladesActor => actor !== null);
	}

	//~ GetActiveEmbeddedCategoryActors: Get ACTIVE (unArchived) embedded actors of given category.
	static GetActiveEmbeddedCategoryActors(cat: string, parent: BladesActor): EmbeddedBladesActor[] {
		return BladesActor.GetEmbeddedCategoryActors(cat, parent).filter((actor) => !actor.isArchived);
	}

	//~ GetGlobalCategoryActors: Get global actors, overwritten by embedded custom actors if parent provided.
	static GetPersonalGlobalCategoryActors(category: keyof typeof BladesActor.CategoryTypes, parent?: BladesActor): AnyBladesActor[] {
		const globalActors = BladesActor.getActorsByCat(category, parent);
		if (!parent) { return globalActors }
		const customizedActors = globalActors.map((gActor) => {
			if (gActor.id && gActor.id in parent.system.subactors) {
				return BladesActor.GetPersonal(gActor, parent) || gActor;
			} else {
				return gActor;
			}
		});
		eLog.checkLog3("actorFetch", `BladesActor.GetPersonalGlobalCategoryActors(${category})`, customizedActors);
		return customizedActors.filter((actor) => actor !== null);
	}
	// #endregion ▄▄▄▄▄ Doc Methods ▄▄▄▄▄

	static override async create(data: ActorDataConstructorData, options={}) {
		data.token = data.token || {};

		eLog.checkLog3("actor", "BladesActor.create(data,options)", {data,options});

		//~ For Crew and PC set the Token to sync with charsheet.
		switch (data.type) {
			case "pc":
			case "crew":
				data.token.actorLink = true;
				break;
			// no default
		}

		function createWorldName(name: string) {
			return name
				.replace(/[^A-Za-z_0-9 ]/g, "")
				.trim()
				.replace(/ /g, "_");
		}

		//~ For All Actors, set world_name to initial name, if not defined.
		// Object.assign(
		// 	data.data,
		// 	{
		// 		world_name: data.data.world_name || createWorldName(data.name ?? "")
		// 	}
		// );

		return super.create(data, options);
	}

	override async _onCreateEmbeddedDocuments(embName: string, docs: Array<BladesItem|BladesActiveEffect>, ...args: [
		Array<Record<string, unknown>>,
		DocumentModificationOptions,
		string
	]) {
		await super._onCreateEmbeddedDocuments(embName, docs, ...args);

		eLog.checkLog("actorTrigger", "onCreateEmbeddedDocuments", {embName, docs, args});

		docs.forEach(async (doc) => {
			// eLog.log(`... docs.forEach -> ${doc.name} = ${(doc as BladesItem).type} (${doc instanceof BladesItem})`, doc);
			if (doc instanceof BladesItem) {
				// doc.update({"system.isArchived": true});
				switch (doc.type) {
					case "playbook": {
						await this.update({
							"system.trauma.active": Object.assign(
								Object.fromEntries(Object.keys(this.system.trauma.active).map((tCond: string) => [tCond, false])),
								Object.fromEntries((doc.system.trauma_conditions ?? []).map((tCond: string) => [tCond, true]))
							),
							"system.trauma.checked": Object.assign(
								Object.fromEntries(Object.keys(this.system.trauma.checked).map((tCond: string) => [tCond, false])),
								Object.fromEntries((doc.system.trauma_conditions ?? []).map((tCond: string) => [tCond, false]))
							)
						});
						break;
					}
					// no default
				}
			}
		});
	}

	isValidForDoc(parentDoc: BladesActor|BladesItem) {
		return true;
	}

	get playbookName() {
		return this.playbook?.name ?? null;
	}
	get playbook() {
		return this.items.find((item) => item.type === "playbook")
			?? this.items.find((item) => item.type === "crew_playbook" )
			?? null;
	}
	get vices(): BladesItem[] {
		return this.items.filter((item) => item.type === "vice");
	}

	get tooltip(): string|undefined {
		const tooltipText = [
			this.system.concept,
			this.system.description_short
		].find((str) => Boolean(str));
		if (tooltipText) { return (new Handlebars.SafeString(tooltipText)).toString() }
		return tooltipText;
	}

	get attributes(): Record<Attributes,number> {
		return {
			insight: Object.values(this.system.attributes.insight).filter(({value}) => value > 0).length + this.system.resistance_bonuses.insight,
			prowess: Object.values(this.system.attributes.prowess).filter(({value}) => value > 0).length + this.system.resistance_bonuses.prowess,
			resolve: Object.values(this.system.attributes.resolve).filter(({value}) => value > 0).length + this.system.resistance_bonuses.resolve
		};
	}

	get actions(): Record<Actions,number> {
		return U.objMap({
			...this.system.attributes.insight,
			...this.system.attributes.prowess,
			...this.system.attributes.resolve
		}, ({value, max}: ValueMax) => U.gsap.utils.clamp(0, max, value)) as Record<Actions, number>;
	}

	get rollable(): Record<Attributes|Actions, number> {
		return {
			...this.attributes,
			...this.actions
		};
	}

	get trauma(): number {
		return Object.keys(this.system.trauma?.checked ?? {})
			.filter((traumaName: string) => {
				return this.system.trauma.active[traumaName] && this.system.trauma.checked[traumaName];
			})
			.length;
	}

	get traumaConditions(): Record<string,boolean> {
		return U.objFilter(
			this.system.trauma?.checked ?? {},
			(v: unknown, traumaName: string) => Boolean(traumaName in this.system.trauma.active && this.system.trauma.active[traumaName])
		) as Record<string, boolean>;
	}

	get tags(): BladesTag[] {
		return this.system.tags;
	}

	async addTag(tagName: BladesTag) {
		const curTags = this.tags;
		if (curTags.includes(tagName)) { return }
		curTags.push(tagName);
		this.update({"system.tags": curTags});
	}

	async removeDoc(docId: string, isFullRemoval = false) {
		const doc = (await BladesActor.GetPersonal(docId, this)) ?? (await BladesItem.GetPersonal(docId, this));
		if (!doc) { return }
		if (doc instanceof BladesActor) {
			BladesActor.Remove(doc, doc.category, this, isFullRemoval);
		} else {
			BladesItem.Remove(doc, doc.type, this, isFullRemoval);
		}
	}

	startScore() {
		this.update({

		});
	}

	startDowntime() {
		this.update({

		});
	}

	endScore() {
		this.update({

		});
	}

	endDowntime() {
		this.update({

		});
	}

	get currentLoad() {
		const activeLoadItems = this.items.filter((item) => item.type === BladesItemType.item && !item.isArchived);
		return U.gsap.utils.clamp(0, 10, activeLoadItems
			.reduce((tot, i) => tot + (i.type === "item"
				? U.pInt(i.system.load)
				: 0
			), 0));
	}
	get remainingLoad(): number {
		if (!this.system.loadout.selected) { return 0 }
		const maxLoad = this.system.loadout.levels[game.i18n.localize(this.system.loadout.selected).toLowerCase() as keyof BladesActor["system"]["loadout"]["levels"]];
		return Math.max(0, maxLoad - this.currentLoad);
	}

	rollAttributePopup(attribute_name: Attributes|Actions) {
		const test = Actions;
		// const roll = new Roll("1d20 + @abilities.wis.mod", actor.getRollData());
		const attribute_label: Capitalize<Attributes|Actions> = U.tCase(attribute_name);

		let content = `
        <h2>${game.i18n.localize("BITD.Roll")} ${attribute_label}</h2>
        <form>
          <div class="form-group">
            <label>${game.i18n.localize("BITD.Modifier")}:</label>
            <select id="mod" name="mod">
              ${this.createListOfDiceMods(-3,+3,0)}
            </select>
          </div>`;
		if ([...Object.keys(Attributes), ...Object.keys(Actions)].includes(attribute_name)) {
			content += `
            <div class="form-group">
              <label>${game.i18n.localize("BITD.Position")}:</label>
              <select id="pos" name="pos">
                <option value="controlled">${game.i18n.localize("BITD.PositionControlled")}</option>
                <option value="risky" selected>${game.i18n.localize("BITD.PositionRisky")}</option>
                <option value="desperate">${game.i18n.localize("BITD.PositionDesperate")}</option>
              </select>
            </div>
            <div class="form-group">
              <label>${game.i18n.localize("BITD.Effect")}:</label>
              <select id="fx" name="fx">
                <option value="limited">${game.i18n.localize("BITD.EffectLimited")}</option>
                <option value="standard" selected>${game.i18n.localize("BITD.EffectStandard")}</option>
                <option value="great">${game.i18n.localize("BITD.EffectGreat")}</option>
              </select>
            </div>`;
		} else {
			content += `
            <input id="pos" name="pos" type="hidden" value="">
            <input id="fx" name="fx" type="hidden" value="">`;
		}
		content += `
        <div className="form-group">
          <label>${game.i18n.localize("BITD.Notes")}:</label>
          <input id="note" name="note" type="text" value="">
        </div><br/>
        </form>
      `;

		new Dialog({
			"title": `${game.i18n.localize("BITD.Roll")} ${attribute_label}`,
			"content": content,
			"buttons": {
				yes: {
					icon: "<i class='fas fa-check'></i>",
					label: game.i18n.localize("BITD.Roll"),
					callback: async (html: HTMLElement|JQuery<HTMLElement>) => {
						if (html instanceof HTMLElement) {
							html = $(html);
						}
						const modifier = parseInt(`${html.find('[name="mod"]').attr("value") ?? 0}`);
						const position: Positions = `${html.find('[name="pos"]').attr("value") ?? Positions.risky}` as Positions;
						const effect: EffectLevels = `${html.find('[name="fx"]').attr("value") ?? EffectLevels.standard}` as EffectLevels;
						const note = `${html.find('[name="note"]').attr("value") ?? 0}`;
						await this.rollAttribute(attribute_name, modifier, position, effect, note);
					}
				},
				no: {
					icon: "<i class='fas fa-times'></i>",
					label: game.i18n.localize("Close")
				}
			},
			"default": "yes"
		}).render(true);

	}

	async rollAttribute(
		attribute_name: Attributes|Actions,
		additional_dice_amount = 0,
		position: Positions = Positions.risky,
		effect: EffectLevels = EffectLevels.standard,
		note?: string
	) {
		bladesRoll(
			this.rollable[attribute_name] + additional_dice_amount,
			attribute_name,
			position,
			effect,
			note
		);
	}

	updateRandomizers() {
		const rStatus: Record<string, Omit<BladesActor.RandomizerData, "value"|"isLocked">> = {
			name: {size: 4, label: null},
			heritage: {size: 1, label: "Heritage"},
			gender: {size: 1, label: "Gender"},
			appearance: {size: 2, label: "Appearance"},
			goal: {size: 4, label: "Goal"},
			method: {size: 4, label: "Method"},
			profession: {size: 2, label: "Profession"},
			trait_1: {size: 1, label: null},
			trait_2: {size: 1, label: null},
			trait_3: {size: 1, label: null},
			interests: {size: 4, label: "Interests"},
			quirk: {size: 4, label: "Quirk"},
			style: {size: 2, label: "Style"}
		};
		const titleChance = 0.05;
		const suffixChance = 0.01;
		function sampleArray(arr: string[], curVals: string[] = [], numVals = 1): string[] {
			arr = arr.filter((elem) => !curVals.includes(elem));
			if (!arr.length) { return [] }
			const returnVals: string[] = [];
			while (returnVals.length < numVals) {
				arr = arr.filter((elem) => ![...curVals, ...returnVals].includes(elem));
				if (!arr.length) { return returnVals }
				returnVals.push(arr[Math.floor(Math.random() * arr.length)]);
			}
			return returnVals;
		}
		const randomGen: Record<string, (gender?:string) => string|string[]|false> = {
			name: (gender?: string) => {
				return [
					Math.random() <= titleChance
						? sampleArray(Randomizers.name_title)
						: "",
					sampleArray([
						...((gender ?? "").charAt(0).toLowerCase() !== "m" ? Randomizers.name_first.female : []),
						...((gender ?? "").charAt(0).toLowerCase() !== "f" ? Randomizers.name_first.male : [])
					]),
					`"${sampleArray(Randomizers.name_alias)}"`,
					sampleArray(Randomizers.name_surname),
					Math.random() <= suffixChance
						? sampleArray(Randomizers.name_suffix)
						: ""
				].filter((val) => Boolean(val)).join(" ");
			},
			gender: () => sampleArray(Randomizers.gender)[0],
			heritage: () => sampleArray(Randomizers.heritage)[0],
			appearance: () => sampleArray(Randomizers.appearance)[0],
			goal: () => sampleArray(Randomizers.goal, [this.system.randomizers.goal.value])[0],
			method: () => sampleArray(Randomizers.method, [this.system.randomizers.goal.value])[0],
			profession: () => sampleArray(Randomizers.profession, [this.system.randomizers.goal.value])[0],
			trait: () => sampleArray(Randomizers.trait, [this.system.randomizers.trait_1.value, this.system.randomizers.trait_2.value, this.system.randomizers.trait_3.value], 1),
			interests: () => sampleArray(Randomizers.interests)[0],
			quirk: () => sampleArray(Randomizers.quirk)[0],
			style: (gender?: string) => sampleArray([
				...((gender ?? "").charAt(0).toLowerCase() !== "m" ? Randomizers.style.female : []),
				...((gender ?? "").charAt(0).toLowerCase() !== "f" ? Randomizers.style.male : [])
			], [this.system.randomizers.style.value])[0]
		};
		const gender = this.system.randomizers.gender.isLocked ? this.system.randomizers.gender.value : randomGen.gender() as string;
		const updateKeys = (Object.keys(this.system.randomizers) as Array<keyof BladesActor["system"]["randomizers"]>).filter((key) => !this.system.randomizers[key].isLocked);
		const updateData: Record<string,BladesActor.RandomizerData> = {};
		let isUpdatingTraits = false;
		updateKeys.forEach((key) => {
			switch (key) {
				case "gender": {
					updateData[`system.randomizers.${key}`] = {
						isLocked: this.system.randomizers.gender.isLocked,
						...rStatus[key],
						value: gender
					};
					break;
				}
				case "trait_1":
				case "trait_2":
				case "trait_3": {
					isUpdatingTraits = true;
					break;
				}
				default: {
					const randomVal = randomGen[key]() as string|false;
					updateData[`system.randomizers.${key}`] = {
						isLocked: false,
						...rStatus[key],
						value: randomVal || this.system.randomizers[key].value
					};
					break;
				}
			}
		});
		if (isUpdatingTraits) {
			const trait1 = this.system.randomizers.trait_1.isLocked
				? this.system.randomizers.trait_1.value
				: sampleArray(Randomizers.trait, [this.system.randomizers.trait_1.value, this.system.randomizers.trait_2.value, this.system.randomizers.trait_3.value], 1)[0];
			const trait2 = this.system.randomizers.trait_2.isLocked
				? this.system.randomizers.trait_2.value
				: sampleArray(Randomizers.trait, [trait1, this.system.randomizers.trait_1.value, this.system.randomizers.trait_2.value, this.system.randomizers.trait_3.value], 1)[0];
			const trait3 = this.system.randomizers.trait_3.isLocked
				? this.system.randomizers.trait_3.value
				: sampleArray(Randomizers.trait, [trait1, trait2, this.system.randomizers.trait_1.value, this.system.randomizers.trait_2.value, this.system.randomizers.trait_3.value], 1)[0];
			if (!this.system.randomizers.trait_1.isLocked) {
				updateData["system.randomizers.trait_1"] = {
					isLocked: false,
					...rStatus.trait_1,
					value: trait1
				};
			}
			if (!this.system.randomizers.trait_2.isLocked) {
				updateData["system.randomizers.trait_2"] = {
					isLocked: false,
					...rStatus.trait_2,
					value: trait2
				};
			}
			if (!this.system.randomizers.trait_3.isLocked) {
				updateData["system.randomizers.trait_3"] = {
					isLocked: false,
					...rStatus.trait_3,
					value: trait3
				};
			}
		}
		return this.update(updateData);
	}

	// /**
	//  * Create <options> for available actions
	//  *  which can be performed.
	//  */
	// createListOfActions() {

	// 	let text = "", attribute, skill;
	// 	const {attributes} = this.system;

	// 	for ( attribute in attributes ) {

	// 		const {skills} = attributes[attribute];

	// 		text += `<optgroup label="${attribute} Actions">`;
	// 		text += `<option value="${attribute}">${attribute} (Resist)</option>`;

	// 		for ( skill in skills ) {
	// 			text += `<option value="${skill}">${skill}</option>`;
	// 		}

	// 		text += "</optgroup>";

	// 	}

	// 	return text;

	// }

	/**
   * Creates <options> modifiers for dice roll.
   *
   * @param {int} rs
   *  Min die modifier
   * @param {int} re
   *  Max die modifier
   * @param {int} s
   *  Selected die
   */
	createListOfDiceMods(rs: number, re: number, s: number|string) {

		let text = "";

		if ( s === "" ) {
			s = 0;
		}

		for ( let i = rs; i <= re; i++ ) {
			let plus = "";
			if ( i >= 0 ) { plus = "+" }
			text += `<option value="${i}"`;
			if ( i === s ) {
				text += " selected";
			}

			text += `>${plus}${i}d</option>`;
		}

		return text;

	}
}

declare interface BladesActor {
	get type(): BladesActorType,
	get items(): EmbeddedCollection<typeof BladesItem, ActorData>;
	system: Actor["data"]["data"] & {
			world_name: string,
			full_name: string,
			subactors: Record<string,BladesActor.SubActorData>,
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
				name: BladesActor.RandomizerData,
				gender: BladesActor.RandomizerData,
				heritage: BladesActor.RandomizerData,
				appearance: BladesActor.RandomizerData,
				goal: BladesActor.RandomizerData,
				method: BladesActor.RandomizerData,
				profession: BladesActor.RandomizerData,
				trait_1: BladesActor.RandomizerData,
				trait_2: BladesActor.RandomizerData,
				trait_3: BladesActor.RandomizerData,
				interests: BladesActor.RandomizerData,
				quirk: BladesActor.RandomizerData,
				style: BladesActor.RandomizerData
			},
			rep: ValueMax,
			tier: ValueMax,
			deity: string,
			hold: "strong"|"weak",
			turfs: ValueMax,
			heat: ValueMax,
			wanted: ValueMax,
			hunting_grounds: {
				desc: string,
				preferred_op: string
			}
		}
	parent: TokenDocument | null;
}

export default BladesActor;