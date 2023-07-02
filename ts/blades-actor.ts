import U from "./core/utilities.js";
import C, {BladesActorType, Tag, BladesItemType, Playbook, Randomizers, Attributes, Actions, Positions, EffectLevels, Vice} from "./core/constants.js";

import type {ActorData, ActorDataConstructorData} from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/actorData.js";
import type {ItemDataConstructorData} from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/itemData.js";
import {bladesRoll} from "./blades-roll.js";
import type {DocumentModificationOptions} from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/abstract/document.mjs.js";
import BladesItem, {PrereqType} from "./blades-item.js";
import {SelectionCategory} from "./blades-dialog.js";
import type BladesActiveEffect from "./blades-active-effect";
import type EmbeddedCollection from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/abstract/embedded-collection.mjs.js";

// https://foundryvtt.wiki/en/development/guides/polymorphism-actors-items

// #region Abstract Class Interfaces ~
declare abstract class BladesActorDocument {

	subActors: BladesActor[];
	activeSubActors: BladesActor[];
	archivedSubActors: BladesActor[];

	getDialogActors(category: SelectionCategory): Record<string, BladesActor[]>|false;
	// checkActorPrereqs(actorRef: ActorRef): boolean;

	getSubActor(actorRef: ActorRef): BladesActor|false;
	addSubActor(actorRef: ActorRef): Promise<void>;
	remSubActor(actorRef: ActorRef): Promise<void>;
	purgeSubActor(actorRef: ActorRef): Promise<void>;

	activeSubItems: BladesItem[];
	archivedSubItems: BladesItem[];

	getDialogItems(category: SelectionCategory): Record<string, BladesItem[]>|false;
	// private checkItemPrereqs(itemRef: ItemRef): boolean;

	getSubItem(itemRef: ItemRef): BladesItem|false;
	addSubItem(itemRef: ItemRef): Promise<void>;
	remSubItem(itemRef: ItemRef): Promise<void>;
	purgeSubItem(itemRef: ItemRef): Promise<void>;
}
declare abstract class BladesScoundrelDocument extends BladesActorDocument {

	vices: BladesItem[]|null;

}
declare abstract class BladesCrewDocument extends BladesActorDocument {

}
declare abstract class BladesNPCDocument {

}
// #endregion
class BladesActor extends Actor implements BladesDocument<Actor>, BladesScoundrelDocument,
																																  BladesCrewDocument,
																																	BladesNPCDocument {

	// #region BladesDocument Implementation ~
	static get All() { return game.actors }
	static Get(actorRef: ActorRef): BladesActor|null {
		if (actorRef instanceof BladesActor) { return actorRef }
		if (U.isDocID(actorRef)) { return BladesActor.All.get(actorRef) || null }
		return BladesActor.All.find((a) => a.system.world_name === actorRef)
			|| BladesActor.All.find((a) => a.name === actorRef)
			|| null;
	}
	static GetTypeWithTags(docType: BladesActorType, ...tags: BladesTag[]): BladesActor[] {
		return BladesActor.All.filter((actor) => actor.type === docType)
			.filter((actor) => actor.hasTag(...tags));
	}

	get tags(): BladesTag[] { return this.system.tags }
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

	get tooltip(): string|null {
		const tooltipText = [
			this.system.concept,
			this.system.description_short
		].find((str) => Boolean(str));
		if (tooltipText) { return (new Handlebars.SafeString(tooltipText)).toString() }
		return null;
	}
	// #endregion

	// #region BladesActorDocument Implementation

	// #region Embedded SubActors
	get subActors(): BladesActor[] {
		return Object.keys(this.system.subactors)
			.map((uuid) => this.getSubActor(uuid))
			.filter((subActor): subActor is BladesActor => Boolean(subActor));
	}

	get activeSubActors(): BladesActor[] { return this.subActors.filter((subActor) => !subActor.hasTag(Tag.Archived)) }
	get archivedSubActors(): BladesActor[] { return this.subActors.filter((subActor) => subActor.hasTag(Tag.Archived)) }

	checkActorPrereqs(actor: BladesActor): boolean {

		/* Implement any prerequisite checks for embedding actors */

		return true;
	}
	private processEmbeddedActorMatches(globalActors: BladesActor[]) {
		// Step 0: Filter out globals that fail prereqs.
		globalActors = globalActors.filter(this.checkActorPrereqs);

		// Step 1: Merge subactor data onto matching global actors
		const mergedActors = globalActors.map((gActor) => this.getSubActor(gActor) || gActor);

		// Sort by name
		mergedActors.sort((a, b) => {
			if (a.name === b.name) { return 0 }
			if (a.name === null) { return 1 }
			if (b.name === null) { return -1 }
			if (a.name > b.name) { return 1 }
			if (a.name < b.name) { return -1 }
			return 0;
		});

		return mergedActors;
	}

	getDialogActors(category: SelectionCategory): Record<string, BladesActor[]>|false {

		/* **** NEED TO FILTER OUT ACTORS PLAYER DOESN'T HAVE PERMISSION TO SEE **** */

		const dialogData: Record<string, BladesActor[]> = {};

		switch (category) {
			case SelectionCategory.Acquaintance: {
				if (this.playbookName === null) { return false }
				dialogData.Main = this.processEmbeddedActorMatches(BladesActor.GetTypeWithTags(BladesActorType.npc, this.playbookName));
				return dialogData;
			}
			case SelectionCategory.VicePurveyor: {
				if (this.vices.length === 0) { return false }
				dialogData.Main = this.processEmbeddedActorMatches(BladesActor.GetTypeWithTags(BladesActorType.npc, ...this.vices.map((vice) => vice.name! as Vice)));
				return dialogData;
			}
			case SelectionCategory.Crew: {
				dialogData.Main = BladesActor.GetTypeWithTags(BladesActorType.crew);
				return dialogData;
			}
			default: return false;
		}
	}

	getSubActor(actorRef: ActorRef): BladesActor|false {
		const globalActor = BladesActor.Get(actorRef);
		if (globalActor === null) { return false }
		if (globalActor.uuid in this.system.subactors) {
			const subActorData = this.system.subactors[globalActor.uuid];
			globalActor.system = mergeObject(
				globalActor.system,
				subActorData.system
			) as BladesActorSystem;
			return globalActor;
		}
		return false;
	}
	async addSubActor(actorRef: ActorRef, tags?: BladesTag[]): Promise<void> {
		const globalActor = BladesActor.Get(actorRef);
		if (globalActor === null) { return }
		const subActor = this.getSubActor(actorRef);
		if (subActor) {
			if (!subActor.hasTag(Tag.Archived)) { return }
			subActor.remTag(Tag.Archived); // interception of _update method will translate this to this.system.subactors
		} else {
			const subActorData: BladesActor.SubActorData = {
				uuid: globalActor.uuid,
				system: {}
			};
			if (tags) {
				subActorData.system.tags = U.unique([
					...globalActor.tags,
					...tags
				]);
			}
			this.update({[`system.subactors.${globalActor.uuid}`]: subActorData});
		}
	}
	async remSubActor(actorRef: ActorRef): Promise<void> {
		const subActor = this.getSubActor(actorRef);
		if (!subActor || subActor.hasTag(Tag.Archived)) { return }
		subActor.addTag(Tag.Archived); // interception of _update method will translate this to this.system.subactors
	}
	async purgeSubActor(actorRef: ActorRef): Promise<void> {
		const subActor = this.getSubActor(actorRef);
		if (!subActor) { return }
		this.update({["system.subactors"]: mergeObject(this.system.subactors, {[`-=${subActor.uuid}`]: null})});
	}
	// #endregion

	// #region Embedded Items
	get activeSubItems() { return this.items.filter((item) => !item.hasTag(Tag.Archived)) }
	get archivedSubItems() { return this.items.filter((item) => item.hasTag(Tag.Archived)) }

	private _checkItemPrereqs(item: BladesItem): boolean {
		// const self = this;
		if (!item.system.prereqs) { return true }
		for (const [pType, pString] of Object.entries(item.system.prereqs)) {
			switch (pType) {
				case PrereqType.HasActiveItem: {
					if (!this.activeSubItems.find((item) => item.system.world_name === pString)) {
						return false;
					}
					break;
				}
				case PrereqType.AdvancedPlaybook: {
					if (!this.playbookName || ![Playbook.Ghost, Playbook.Hull, Playbook.Vampire].includes(this.playbookName)) {
						return false;
					}
				}
				// no default
			}
		}
		return true;
	}
	private _processEmbeddedItemMatches(globalItems: BladesItem[]) {

		return globalItems

			// Step 1: Filter out globals that fail prereqs.
			.filter((item) => this._checkItemPrereqs(item))

			// Step 2: Filter out already-active items based on num_available
			.filter((gItem) => {
				const matchingActiveSubItems = this.activeSubItems.filter((sItem) => sItem.system.world_name === gItem.system.world_name);
				return (gItem.system.num_available ?? 1) > matchingActiveSubItems.length;
			})

			// Step 3: Replace with matching Archived, Embedded subItems
			.map((gItem) => {
				const matchingSubItems = this.archivedSubItems.filter((sItem) => sItem.system.world_name === gItem.system.world_name);
				if (matchingSubItems.length > 0) {
					return matchingSubItems;
				} else {
					return gItem;
				}
			})
			.flat()

			// Step 4: Apply CSS classes
			.map((sItem) => {
				const cssClasses: string[] = [];
				if (sItem.isEmbedded) {
					cssClasses.push("embedded");
				}
				if (sItem.hasTag(Tag.Fine)) {
					cssClasses.push("fine-quality");
				}
				if (sItem.hasTag(Tag.Featured)) {
					cssClasses.push("featured-item");
				}

				if (cssClasses.length > 0) {
					sItem.dialogCSSClasses = cssClasses.join(" ");
				}

				return sItem;
			})

			// Step 5: Sort by featured, then by fine, then by world_name, then embedded first sorted by name
			.sort((a, b) => {
				if (a.hasTag(Tag.Featured) && !b.hasTag(Tag.Featured)) { return -1 }
				if (!a.hasTag(Tag.Featured) && b.hasTag(Tag.Featured)) { return 1 }
				if (a.hasTag(Tag.Fine) && !b.hasTag(Tag.Fine)) { return -1 }
				if (!a.hasTag(Tag.Fine) && b.hasTag(Tag.Fine)) { return 1 }
				if (a.system.world_name > b.system.world_name) { return 1 }
				if (a.system.world_name < b.system.world_name) { return -1 }
				if (a.isEmbedded && !b.isEmbedded) { return -1 }
				if (!a.isEmbedded && b.isEmbedded) { return 1 }
				if (a.name === b.name) { return 0 }
				if (a.name === null) { return 1 }
				if (b.name === null) { return -1 }
				if (a.name > b.name) { return 1 }
				if (a.name < b.name) { return -1 }
				return 0;
			});
	}

	getDialogItems(category: SelectionCategory): Record<string, BladesItem[]>|false {

		const dialogData: Record<string, BladesItem[]> = {};

		switch (category) {
			case SelectionCategory.Heritage: {
				dialogData.Main = this._processEmbeddedItemMatches(BladesItem.GetTypeWithTags(BladesItemType.heritage));
				return dialogData;
			}
			case SelectionCategory.Background: {
				dialogData.Main = this._processEmbeddedItemMatches(BladesItem.GetTypeWithTags(BladesItemType.background));
				return dialogData;
			}
			case SelectionCategory.Vice: {
				if (this.playbookName === null) { return false }
				// If actor contains a vice with the Override tag, return false to prevent selecting something different
				if (this.vices.some((item) => item.hasTag(Tag.ViceOverride))) { return false }
				dialogData.Main = this._processEmbeddedItemMatches(BladesItem.GetTypeWithTags(BladesItemType.vice, this.playbookName));
				return dialogData;
			}
			case SelectionCategory.Playbook: {
				switch (this.type) {
					case BladesActorType.pc: {
						dialogData.Basic = this._processEmbeddedItemMatches(BladesItem.GetTypeWithTags(BladesItemType.playbook).filter((item) => !item.hasTag(Tag.Advanced)));
						dialogData.Advanced = this._processEmbeddedItemMatches(BladesItem.GetTypeWithTags(BladesItemType.playbook, Tag.Advanced));
						return dialogData;
					}
					case BladesActorType.crew: {
						dialogData.Main = this._processEmbeddedItemMatches(BladesItem.GetTypeWithTags(BladesItemType.crew_playbook));
						return dialogData;
					}
					default: return false;
				}
			}
			case SelectionCategory.Reputation: {
				dialogData.Main = this._processEmbeddedItemMatches(BladesItem.GetTypeWithTags(BladesItemType.crew_reputation));
				return dialogData;
			}
			case SelectionCategory.PreferredOp: {
				dialogData.Main = this._processEmbeddedItemMatches(BladesItem.GetTypeWithTags(BladesItemType.preferred_op));
				return dialogData;
			}
			case SelectionCategory.Gear: {
				if (this.playbookName === null) { return false }
				const gearItems = this._processEmbeddedItemMatches([
					...BladesItem.GetTypeWithTags(BladesItemType.item, this.playbookName),
					...BladesItem.GetTypeWithTags(BladesItemType.item, Tag.General)
				])
					.filter((item) => this.remainingLoad >= item.load);

				// Two tabs, one for playbook and the other for general items
				dialogData[this.playbookName] = gearItems.filter((item) => item.hasTag(this.playbookName!));
				dialogData.General = gearItems
					.filter((item) => item.hasTag(Tag.General))
					// Remove featured class from General items
					.map((item) => {
						if (item.dialogCSSClasses) {
							item.dialogCSSClasses = item.dialogCSSClasses.replace(/featured-item\s?/g, "");
						}
						return item;
					})
					// Re-sort by world_name
					.sort((a, b) => {
						if (a.system.world_name > b.system.world_name) { return 1 }
						if (a.system.world_name < b.system.world_name) { return -1 }
						return 0;
					});

				return dialogData;
			}
			case SelectionCategory.Ability: {
				if (this.playbookName === null) { return false }
				const itemType = this.type === BladesActorType.crew ? BladesItemType.crew_ability : BladesItemType.ability;
				dialogData[this.playbookName] = this._processEmbeddedItemMatches(BladesItem.GetTypeWithTags(itemType, this.playbookName));
				dialogData.Veteran = this._processEmbeddedItemMatches(BladesItem.GetTypeWithTags(itemType))
					.filter((item) => !item.hasTag(this.playbookName!))
					// Remove featured class from Veteran items
					.map((item) => {
						if (item.dialogCSSClasses) {
							item.dialogCSSClasses = item.dialogCSSClasses.replace(/featured-item\s?/g, "");
						}
						return item;
					})
					// Re-sort by world_name
					.sort((a, b) => {
						if (a.system.world_name > b.system.world_name) { return 1 }
						if (a.system.world_name < b.system.world_name) { return -1 }
						return 0;
					});
				return dialogData;
			}
			case SelectionCategory.Upgrade: {
				dialogData.Main = this._processEmbeddedItemMatches(BladesItem.GetTypeWithTags(BladesItemType.crew_upgrade));
				return dialogData;
			}
			// no default
		}
		return dialogData;
	}

	getSubItem(itemRef: ItemRef): BladesItem|false {
		if (typeof itemRef === "string" && this.items.get(itemRef)) {
			return this.items.get(itemRef) ?? false;
		}
		const globalItem = BladesItem.Get(itemRef);
		if (globalItem && globalItem.id) {
			return this.items.find((item) => item.system.world_name === globalItem.system.world_name) ?? false;
		}
		return false;
	}
	async addSubItem(itemRef: ItemRef): Promise<void> {
		const embeddedItem = this.getSubItem(itemRef);
		if (embeddedItem) {
			// Is it an archived Item? Unarchive it.
			if (embeddedItem.hasTag(Tag.Archived)) {
				embeddedItem.remTag(Tag.Archived);
				return;
			}
			// Is it an active (unarchived) Item? Duplicate the item.
			BladesItem.create([embeddedItem] as unknown as ItemDataConstructorData, {parent: this});
			return;
		}
		// Is it not embedded at all? Embed from global instance.
		const globalItem = BladesItem.Get(itemRef);
		if (globalItem) {
			BladesItem.create([globalItem] as unknown as ItemDataConstructorData, {parent: this});
		}
	}
	async remSubItem(itemRef: ItemRef): Promise<void> {
		const subItem = this.getSubItem(itemRef);
		if (!subItem) { return }
		eLog.checkLog("actorTrigger", "Removing SubItem " + subItem.name, subItem);
		if (subItem.hasTag(Tag.Archived)) { return }
		subItem.addTag(Tag.Archived);
	}
	async purgeSubItem(itemRef: ItemRef): Promise<void> {
		const subItem = this.getSubItem(itemRef);
		if (!subItem || subItem.hasTag(Tag.Archived)) { return }
		subItem.delete();
	}
	// #endregion

	get vices(): BladesItem[] {
		return this.activeSubItems.filter((item) => item.type === BladesItemType.vice);
	}
	// #endregion

	static override async create(data: ActorDataConstructorData & {data?: {world_name?: string}}, options={}) {
		data.token = data.token || {};
		data.data = data.data ?? {};

		eLog.checkLog2("actor", "BladesActor.create(data,options)", {data,options});

		//~ For Crew and PC set the Token to sync with charsheet.
		if ([BladesActorType.crew, BladesActorType.pc].includes(data.type as BladesActorType)) {
			data.token.actorLink = true;
		}

		//~ Create world_name
		data.data.world_name = data.data.world_name ?? data.name.replace(/[^A-Za-z_0-9 ]/g, "")
			.trim()
			.replace(/ /g, "_");

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
			if (doc instanceof BladesItem) {
				eLog.checkLog("actorTrigger", `... doc is Item, docType: ${doc.type}`);
				if ([
					BladesItemType.background,
					BladesItemType.crew_reputation,
					BladesItemType.crew_playbook,
					BladesItemType.heritage,
					BladesItemType.playbook,
					BladesItemType.preferred_op,
					BladesItemType.vice
				].some((iType) => doc.type === iType)) {
					eLog.checkLog("actorTrigger", "... removing uniques", {activeSubItems: this.activeSubItems, removeDoc: doc});
					this.activeSubItems
						.filter((sItem) => sItem.type === doc.type && sItem.id !== doc.id)
						.forEach((sItem) => this.remSubItem(sItem));
				}
				switch (doc.type) {
					case BladesItemType.playbook: {
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

	override async update(updateData: DeepPartial<ActorDataConstructorData | (ActorDataConstructorData & Record<string, unknown>)> | undefined) {
		eLog.checkLog2("actor", "actor.update(data)", {updateData, user: game.user});
		super.update(updateData);
		return this;
	}

	// #region Actor Data Getters
	get playbookName(): (BladesTag & Playbook)|null {
		return this.playbook?.name as (BladesTag & Playbook)|undefined ?? null;
	}
	get playbook() {
		if (this.type === BladesActorType.pc) {
			return this.activeSubItems.find((item) => item.type === BladesItemType.playbook);
		}
		if (this.type === BladesActorType.crew) {
			return this.activeSubItems.find((item) => item.type === BladesItemType.crew_playbook);
		}
		return null;
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

	get currentLoad() {
		const activeLoadItems = this.activeSubItems.filter((item) => item.type === BladesItemType.item);
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
	// #endregion Actor Data Getters

	// #region Rolling Dice
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

	// #endregion Rolling Dice

	// #region NPC Randomizers
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
	// #endregion NPC Randomizers

}


interface BladesActorSystem {
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

declare interface BladesActor {
	get type(): BladesActorType,
	get items(): EmbeddedCollection<typeof BladesItem, ActorData>;
	system: Actor["data"]["data"] & BladesActorSystem;
	parent: TokenDocument | null;
}

export default BladesActor;