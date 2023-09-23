// #region Imports ~
import U from "./core/utilities.js";
import type {Vice} from "./core/constants.js";
import C, {BladesActorType, Tag, Playbook, BladesItemType, Attribute, Action, PrereqType, Position, Effect, AdvancementPoint, Randomizers, Factor} from "./core/constants.js";

import BladesPC from "./documents/actors/blades-pc.js";
import BladesCrew from "./documents/actors/blades-crew.js";
import BladesNPC from "./documents/actors/blades-npc.js";
import BladesFaction from "./documents/actors/blades-faction.js";

import type {ActorData, ActorDataConstructorData} from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/actorData.js";
import type {ItemDataConstructorData} from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/itemData.js";
import {bladesRoll} from "./blades-roll.js";
import BladesItem from "./blades-item.js";
import {SelectionCategory} from "./blades-dialog.js";
import type BladesActiveEffect from "./blades-active-effect";
import type EmbeddedCollection from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/abstract/embedded-collection.mjs.js";
import type {MergeObjectOptions} from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/utils/helpers.mjs.js";
// #endregion


// https://foundryvtt.wiki/en/development/guides/polymorphism-actors-items
// Blades Theme Song: "Bangkok" from The Gray Man soundtrack: https://www.youtube.com/watch?v=cjjImvMqYlo&list=OLAK5uy_k9cZDd1Fbpd25jfDtte5A6HyauD2-cwgk&index=2
// Add "coin" item to general items --> equals 1 Coin worth of value, carried, and has Load 1.


class BladesActor extends Actor implements BladesDocument<Actor> {

  // #region Static Overrides: Create ~
  static override async create(data: ActorDataConstructorData & { system?: Partial<BladesActorSystem> }, options = {}) {
    data.token = data.token || {};
    data.system = data.system ?? {};

    //~ Create world_name
    data.system.world_name = data.system.world_name ?? data.name.replace(/[^A-Za-z_0-9 ]/g, "").trim().replace(/ /g, "_");

    return super.create(data, options);
  }
  // #endregion

  // #region BladesDocument Implementation ~
  static get All() { return game.actors }
  static Get(actorRef: ActorRef): BladesActor | undefined {
    if (actorRef instanceof BladesActor) { return actorRef }
    if (U.isDocID(actorRef)) { return BladesActor.All.get(actorRef) }
    return BladesActor.All.find((a) => a.system.world_name === actorRef)
      || BladesActor.All.find((a) => a.name === actorRef);
  }
  static GetTypeWithTags<T extends BladesActorType>(docType: T, ...tags: BladesTag[]): Array<BladesActorOfType<T>> {
    return BladesActor.All.filter((actor) => actor.type === docType)
      .filter((actor) => actor.hasTag(...tags)) as Array<BladesActorOfType<T>>;
  }

  static IsType<T extends BladesActorType>(doc: unknown, ...types: T[]): doc is BladesActor & BladesActorOfType<T> {
    const typeSet = new Set<BladesActorType>(types);
    return doc instanceof BladesActor && typeSet.has(doc.type);
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
    eLog.checkLog2("actor", "BladesActor.addTag(...tags)", {tags, curTags});
    this.update({"system.tags": curTags});
  }

  async remTag(...tags: BladesTag[]) {
    const curTags = this.tags.filter((tag) => !tags.includes(tag));
    eLog.checkLog2("actor", "BladesActor.remTag(...tags)", {tags, curTags});
    this.update({"system.tags": curTags});
  }

  get tooltip(): string | undefined {
    const tooltipText = [this.system.concept, this.system.subtitle]
      .filter(Boolean)
      .join("<br><br>");
    return tooltipText ? (new Handlebars.SafeString(tooltipText)).toString() : undefined;
  }

  get dialogCSSClasses(): string { return "" }

  getFactorTotal(factor: Factor): number {
    switch (factor) {
      case Factor.tier: {
        if (BladesActor.IsType(this, BladesActorType.pc)) {
          return this.system.tier.value + (this.crew?.getFactorTotal(Factor.tier) ?? 0);
        }
        return this.system.tier.value;
      }
      case Factor.quality: return this.getFactorTotal(Factor.tier);
      case Factor.scale: {
        if (BladesActor.IsType(this, BladesActorType.npc)) {
          return this.system.scale;
        }
        return 0;
      }
      case Factor.magnitude: {
        if (BladesActor.IsType(this, BladesActorType.npc)) {
          return this.system.magnitude;
        }
        return 0;
      }
      // no default
    }
    return 0;
  }
  // #endregion

  // #region SubActorControl Implementation ~

  get subActors(): BladesActor[] {
    return Object.keys(this.system.subactors)
      .map((id) => this.getSubActor(id))
      .filter((subActor): subActor is BladesActor => Boolean(subActor));
  }
  get activeSubActors(): BladesActor[] { return this.subActors.filter((subActor) => !subActor.hasTag(Tag.System.Archived)) }
  get archivedSubActors(): BladesActor[] { return this.subActors.filter((subActor) => subActor.hasTag(Tag.System.Archived)) }

  checkActorPrereqs(actor: BladesActor): boolean {

    /* Implement any prerequisite checks for embedding actors */

    return true;
  }
  private processEmbeddedActorMatches(globalActors: BladesActor[]) {

    return globalActors
    // Step 1: Filter out globals that fail prereqs.
      .filter(this.checkActorPrereqs)
    // Step 2: Filter out actors that are already active subActors
      .filter((gActor) => !this.activeSubActors.some((aActor) => aActor.id === gActor.id))
    // Step 3: Merge subactor data onto matching global actors
      .map((gActor) => this.getSubActor(gActor) || gActor)
    // Step 4: Sort by name
      .sort((a, b) => {
        if (a.name === b.name) { return 0 }
        if (a.name === null) { return 1 }
        if (b.name === null) { return -1 }
        if (a.name > b.name) { return 1 }
        if (a.name < b.name) { return -1 }
        return 0;
      });
  }

  getDialogActors(category: SelectionCategory): Record<string, BladesActor[]> | false {

    /* **** NEED TO FILTER OUT ACTORS PLAYER DOESN'T HAVE PERMISSION TO SEE **** */

    const dialogData: Record<string, BladesActor[]> = {};

    switch (category) {
      case SelectionCategory.Contact:
      case SelectionCategory.Rival:
      case SelectionCategory.Friend:
      case SelectionCategory.Acquaintance: {
        if (!(BladesActor.IsType(this, BladesActorType.pc) || BladesActor.IsType(this, BladesActorType.crew)) || this.playbookName === null) { return false }
        dialogData.Main = this.processEmbeddedActorMatches(BladesActor.GetTypeWithTags(BladesActorType.npc, this.playbookName));
        return dialogData;
      }
      case SelectionCategory.VicePurveyor: {
        if (!BladesActor.IsType(this, BladesActorType.pc) || !this.vice?.name) { return false }
        dialogData.Main = this.processEmbeddedActorMatches(BladesActor.GetTypeWithTags(BladesActorType.npc, this.vice.name as Vice));
        return dialogData;
      }
      case SelectionCategory.Crew: {
        dialogData.Main = BladesActor.GetTypeWithTags(BladesActorType.crew);
        return dialogData;
      }
      default: return false;
    }
  }

  async addSubActor(actorRef: ActorRef, tags?: BladesTag[]): Promise<void> {

    enum BladesActorUniqueTags {
      CharacterCrew = Tag.PC.CharacterCrew,
      VicePurveyor = Tag.NPC.VicePurveyor
    }
    let focusSubActor: BladesActor | undefined;

    // Does an embedded subActor of this Actor already exist on the character?
    if (this.hasSubActorOf(actorRef)) {
      const subActor = this.getSubActor(actorRef);
      if (!subActor) { return }
      // Is it an archived Item?
      if (subActor.hasTag(Tag.System.Archived)) {
        // Unarchive it
        await subActor.remTag(Tag.System.Archived);
      }
      // Make it the focus item.
      focusSubActor = subActor;
    } else {
      // Is it not embedded at all? Create new entry in system.subactors from global actor
      const actor = BladesActor.Get(actorRef);
      if (!actor) { return }
      const subActorData: SubActorData = {};
      if (tags) {
        subActorData.tags = U.unique([
          ...actor.tags,
          ...tags
        ]);
      }
      // Await the update, then make the retrieved subactor the focus
      await this.update({[`system.subactors.${actor.id}`]: subActorData});
      focusSubActor = this.getSubActor(actor.id!);
    }

    if (!focusSubActor) { return }

    // Does this Actor contain any tags limiting it to one per actor?
    const uniqueTags = focusSubActor.tags.filter((tag) => tag in BladesActorUniqueTags);
    if (uniqueTags.length > 0) {
      // ... then archive all other versions.
      uniqueTags.forEach((uTag) => this.activeSubActors
        .filter((subActor) => subActor!.id !== focusSubActor!.id && subActor.hasTag(uTag))
        .map((subActor) => this.remSubActor(subActor.id!)));
    }
  }

  getSubActor(actorRef: ActorRef): BladesActor | undefined {
    const actor = BladesActor.Get(actorRef);
    if (!actor?.id) { return undefined }
    if (!BladesActor.IsType(actor, BladesActorType.npc, BladesActorType.faction)) { return actor }
    const subActorData = this.system.subactors[actor.id] ?? {};
    Object.assign(
      actor.system,
      mergeObject(actor.system, subActorData)
    );
    actor.parentActor = this;
    return actor;
  }

  hasSubActorOf(actorRef: ActorRef): boolean {
    const actor = BladesActor.Get(actorRef);
    if (!actor) { return false }
    return actor?.id ? actor.id in this.system.subactors : false;
  }

  // hasActiveSubActorOf(actorRef: ActorRef): boolean {
  //   const actor = BladesActor.Get(actorRef);
  //   if (!actor) { return false }
  //   return actor?.id ? (actor.id in this.system.subactors && !this.getSubActor(actorRef)?.hasTag(Tag.System.Archived)) : false;
  // }

  async updateSubActor(actorRef: ActorRef, updateData: DeepPartial<SubActorData & Record<string, any>>): Promise<BladesActor | undefined> {
    updateData = U.objExpand(updateData);
    if (!updateData.system) { return undefined }
    const actor = BladesActor.Get(actorRef);
    if (!actor) { return undefined }

    // diffObject new update data against actor data.
    const diffUpdateSystem = U.objDiff(actor.system, updateData.system);

    // Merge new update data onto current subactor data.
    const mergedSubActorSystem = U.objMerge(this.system.subactors[actor.id!] ?? {}, diffUpdateSystem, {isReplacingArrays: true, isConcatenatingArrays: false});

    // Confirm this update changes data:
    if (JSON.stringify(this.system.subactors[actor.id!]) === JSON.stringify(mergedSubActorSystem)) { return undefined }
    // Update actor with new subactor data.
    return this.update({[`system.subactors.${actor.id}`]: null}, undefined, true)
      .then(() => this.update({[`system.subactors.${actor.id}`]: mergedSubActorSystem}, undefined, true))
      .then(() => actor.sheet?.render()) as Promise<BladesActor | undefined>;
  }

  // async remSubActor(actorRef: ActorRef): Promise<void> {

  // this.purgeSubActor(actorRef);
  // return;
  // const actor = BladesActor.Get(actorRef);
  // if (!actor) { return }
  // if (!this.hasActiveSubActorOf(actor)) { return }
  // const subActor = this.getSubActor(actor)!;
  // if (!subActor || subActor.hasTag(Tag.System.Archived)) { return }
  // subActor.addTag(Tag.System.Archived).then(() => this.render());
  // }

  async remSubActor(actorRef: ActorRef): Promise<void> {
    const subActor = this.getSubActor(actorRef);
    if (!subActor) { return }
    this.update({["system.subactors"]: mergeObject(this.system.subactors, {[`-=${subActor.id}`]: null})}, undefined, true);
  }

  async clearSubActors(isReRendering = true): Promise<void> {
    this.subActors.forEach((subActor) => {
      if (subActor.parentActor?.id === this.id) { subActor.clearParentActor(isReRendering) }
    });
    this.sheet?.render();
  }

  async clearParentActor(isReRendering = true): Promise<void> {
    const {parentActor} = this;
    if (!parentActor) { return }
    this.parentActor = undefined;
    this.system = this._source.system;
    this.ownership = this._source.ownership;

    this.prepareData();
    if (isReRendering) {
      this.sheet?.render();
    }
  }


  // #endregion
  // #region SubItemControl Implementation ~

  get subItems() { return Array.from(this.items) }
  get activeSubItems() { return this.items.filter((item) => !item.hasTag(Tag.System.Archived)) }
  get archivedSubItems() { return this.items.filter((item) => item.hasTag(Tag.System.Archived)) }

  private _checkItemPrereqs(item: BladesItem): boolean {
    if (!item.system.prereqs) { return true }
    for (const [pType, pReqs] of Object.entries(item.system.prereqs as Partial<Record<PrereqType, boolean | string | string[]>>)) {
      const pReqArray = Array.isArray(pReqs) ? pReqs : [pReqs.toString()];
      const hitRecord: Partial<Record<PrereqType, string[]>> = {};
      while (pReqArray.length) {
        const pString = pReqArray.pop()!;
        hitRecord[<PrereqType>pType] ??= [];
        switch (pType) {
          case PrereqType.HasActiveItem: {
            const thisItem = this.activeSubItems
              .filter((item) => !hitRecord[<PrereqType>pType]?.includes(item.id!))
              .find((item) => item.system.world_name === pString);
            if (thisItem) {
              hitRecord[<PrereqType>pType]!.push(thisItem.id!);
            } else {
              return false;
            }
            break;
          }
          case PrereqType.HasActiveItemsByTag: {
            const thisItem = this.activeSubItems
              .filter((item) => !hitRecord[<PrereqType>pType]?.includes(item.id!))
              .find((item) => item.hasTag(pString as BladesTag));
            if (thisItem) {
              hitRecord[<PrereqType>pType]!.push(thisItem.id!);
            } else {
              return false;
            }
            break;
          }
          case PrereqType.AdvancedPlaybook: {
            if (!BladesActor.IsType(this, BladesActorType.pc)) { return false }
            if (!this.playbookName || ![Playbook.Ghost, Playbook.Hull, Playbook.Vampire].includes(this.playbookName)) {
              return false;
            }
          }
          // no default
        }
      }
    }
    return true;
  }
  private _processEmbeddedItemMatches<T extends BladesItemType>(globalItems: Array<BladesItemOfType<T>>): Array<BladesItemOfType<T>> {

    return globalItems

    // Step 1: Filter out globals that fail prereqs.
      .filter((item) => this._checkItemPrereqs(item))

    // Step 2: Filter out already-active items based on max_per_score (unless MultiplesOk)
      .filter((gItem) => {
        return gItem.hasTag(Tag.System.MultiplesOK) || (gItem.system.max_per_score ?? 1) > this.activeSubItems.filter((sItem) => sItem.system.world_name === gItem.system.world_name).length;
      })

    // Step 3: Replace with matching Archived, Embedded subItems
      .map((gItem) => {
        const matchingSubItems = this.archivedSubItems.filter((sItem): sItem is BladesItemOfType<T> => sItem.system.world_name === gItem.system.world_name);
        if (matchingSubItems.length > 0) {
          return matchingSubItems;
        } else {
          return gItem;
        }
      })
      .flat()

    // Step 4: Apply CSS classes
      .map((sItem) => {
        sItem.dialogCSSClasses = "";
        const cssClasses: string[] = [];
        if (sItem.isEmbedded) {
          cssClasses.push("embedded");
        }
        if (sItem.hasTag(Tag.Gear.Fine)) {
          cssClasses.push("fine-quality");
        }
        if (sItem.hasTag(Tag.System.Featured)) {
          cssClasses.push("featured-item");
        }
        if ([BladesItemType.ability, BladesItemType.crew_ability].includes(sItem.type)) {
          if (this.getAvailableAdvancements("Ability") === 0) {
            cssClasses.push("locked");
          } else if ((sItem.system.price ?? 1) > this.getAvailableAdvancements("Ability")) {
            cssClasses.push("locked", "unaffordable");
          } else if ((sItem.system.price ?? 1) > 1) {
            cssClasses.push("expensive");
          }
        }
        if ([BladesItemType.crew_upgrade].includes(sItem.type)) {
          if (this.getAvailableAdvancements("Upgrade") === 0) {
            cssClasses.push("locked");
          } else if ((sItem.system.price ?? 1) > this.getAvailableAdvancements("Upgrade")) {
            cssClasses.push("locked", "unaffordable");
          } else if ((sItem.system.price ?? 1) > 1) {
            cssClasses.push("expensive");
          }
        }

        if (cssClasses.length > 0) {
          sItem.dialogCSSClasses = cssClasses.join(" ");
        }

        return sItem;
      })

    // Step 5: Sort by featured, then by fine, then by world_name, then embedded first sorted by name
      .sort((a, b) => {
        if (a.hasTag(Tag.System.Featured) && !b.hasTag(Tag.System.Featured)) { return -1 }
        if (!a.hasTag(Tag.System.Featured) && b.hasTag(Tag.System.Featured)) { return 1 }
        if (a.hasTag(Tag.Gear.Fine) && !b.hasTag(Tag.Gear.Fine)) { return -1 }
        if (!a.hasTag(Tag.Gear.Fine) && b.hasTag(Tag.Gear.Fine)) { return 1 }
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

  getDialogItems(category: SelectionCategory): Record<string, BladesItem[]> | false {

    const dialogData: Record<string, BladesItem[]> = {};

    switch (category) {
      case SelectionCategory.Heritage: {
        if (!BladesActor.IsType(this, BladesActorType.pc)) { return false }
        dialogData.Main = this._processEmbeddedItemMatches(BladesItem.GetTypeWithTags(BladesItemType.heritage));
        return dialogData;
      }
      case SelectionCategory.Background: {
        if (!BladesActor.IsType(this, BladesActorType.pc)) { return false }
        dialogData.Main = this._processEmbeddedItemMatches(BladesItem.GetTypeWithTags(BladesItemType.background));
        return dialogData;
      }
      case SelectionCategory.Vice: {
        if (!BladesActor.IsType(this, BladesActorType.pc) || this.playbookName === null) { return false }
        dialogData.Main = this._processEmbeddedItemMatches(BladesItem.GetTypeWithTags(BladesItemType.vice, this.playbookName));
        return dialogData;
      }
      case SelectionCategory.Playbook: {
        switch (this.type) {
          case BladesActorType.pc: {
            dialogData.Basic = this._processEmbeddedItemMatches(BladesItem.GetTypeWithTags(BladesItemType.playbook).filter((item) => !item.hasTag(Tag.Gear.Advanced)));
            dialogData.Advanced = this._processEmbeddedItemMatches(BladesItem.GetTypeWithTags(BladesItemType.playbook, Tag.Gear.Advanced));
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
        if (!BladesActor.IsType(this, BladesActorType.crew)) { return false }
        dialogData.Main = this._processEmbeddedItemMatches(BladesItem.GetTypeWithTags(BladesItemType.crew_reputation));
        return dialogData;
      }
      case SelectionCategory.Preferred_Op: {
        if (!BladesActor.IsType(this, BladesActorType.crew) || this.playbookName === null) { return false }
        dialogData.Main = this._processEmbeddedItemMatches(BladesItem.GetTypeWithTags(BladesItemType.preferred_op, this.playbookName as BladesTag));
        return dialogData;
      }
      case SelectionCategory.Gear: {
        if (!BladesActor.IsType(this, BladesActorType.pc)) { return false }
        const self: BladesPC = this as BladesPC;
        if (this.playbookName === null) { return false }
        const gearItems = this._processEmbeddedItemMatches([
          ...BladesItem.GetTypeWithTags(BladesItemType.gear, this.playbookName),
          ...BladesItem.GetTypeWithTags(BladesItemType.gear, Tag.Gear.General)
        ])
          .filter((item) => self.remainingLoad >= item.system.load);

        // Two tabs, one for playbook and the other for general items
        dialogData[self.playbookName] = gearItems.filter((item) => item.hasTag(self.playbookName));
        dialogData.General = gearItems
          .filter((item) => item.hasTag(Tag.Gear.General))
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
        if (BladesActor.IsType(this, BladesActorType.pc)) {
          const self: BladesPC = this as BladesPC;
          if (self.playbookName === null) { return false }
          dialogData[self.playbookName] = this._processEmbeddedItemMatches(BladesItem.GetTypeWithTags(BladesItemType.ability, self.playbookName));
          dialogData.Veteran = this._processEmbeddedItemMatches(BladesItem.GetTypeWithTags(BladesItemType.ability))
            .filter((item) => !item.hasTag(self.playbookName))
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
        } else if (BladesActor.IsType(this, BladesActorType.crew)) {
          dialogData.Main = this._processEmbeddedItemMatches(BladesItem.GetTypeWithTags(BladesItemType.crew_ability, this.playbookName));
        }
        return dialogData;
      }
      case SelectionCategory.Upgrade: {
        if (!BladesActor.IsType(this, BladesActorType.crew) || this.playbookName === null) { return false }
        dialogData[this.playbookName] = this._processEmbeddedItemMatches(BladesItem.GetTypeWithTags(BladesItemType.crew_upgrade, this.playbookName));
        dialogData.General = this._processEmbeddedItemMatches(BladesItem.GetTypeWithTags(BladesItemType.crew_upgrade, Tag.Gear.General));
        return dialogData;
      }
      // no default
    }
    return dialogData;
  }

  getSubItem(itemRef: ItemRef, activeOnly = false): BladesItem | undefined {
    if (typeof itemRef === "string" && this.items.get(itemRef)) {
      return this.items.get(itemRef);
    }
    const globalItem = BladesItem.Get(itemRef);
    if (!globalItem) { return undefined }
    return this.items.find((item) => item.name === globalItem.name) ?? this.items.find((item) => item.system.world_name === globalItem.system.world_name);
  }

  hasSubItemOf(itemRef: ItemRef): boolean {
    const item = BladesItem.Get(itemRef);
    if (!item) { return false }
    return Boolean(this.items.find((i) => i.system.world_name === item.system.world_name));
  }

  hasActiveSubItemOf(itemRef: ItemRef): boolean {
    const item = BladesItem.Get(itemRef);
    if (!item) { return false }
    return Boolean(this.items.find((i) => !i.hasTag(Tag.System.Archived) && i.system.world_name === item.system.world_name));
  }

  async addSubItem(itemRef: ItemRef): Promise<void> {
    eLog.checkLog3("subitems", "[addSubItem] itemRef", itemRef);

    enum BladesItemUniqueTypes {
      background = BladesItemType.background,
      vice = BladesItemType.vice,
      crew_playbook = BladesItemType.crew_playbook,
      crew_reputation = BladesItemType.crew_reputation,
      heritage = BladesItemType.heritage,
      playbook = BladesItemType.playbook,
      preferred_op = BladesItemType.preferred_op,
    }
    let focusItem: BladesItem | undefined;

    // Does an embedded copy of this item already exist on the character?
    const embeddedItem: BladesItem | undefined = this.getSubItem(itemRef);


    if (embeddedItem) {

      // Is it an archived Item?
      if (embeddedItem.hasTag(Tag.System.Archived)) {
        // Unarchive it & make it the focus item.
        await embeddedItem.remTag(Tag.System.Archived);
        focusItem = embeddedItem;
        eLog.checkLog3("subitems", `[addSubItem] IS ARCHIVED EMBEDDED > Removing 'Archived' Tag, '${focusItem.id!}':`, focusItem);
      } else { // Otherwise...
        // Duplicate the item, and make the newly-created item the focus.
        focusItem = await BladesItem.create([embeddedItem] as unknown as ItemDataConstructorData, {parent: this}) as BladesItem;
        eLog.checkLog3("subitems", `[addSubItem] IS ACTIVE EMBEDDED > Duplicating, focusItem '${focusItem.id!}':`, focusItem);
      }
    } else {
      // Is it not embedded at all? Embed from global instance.
      const globalItem = BladesItem.Get(itemRef);

      eLog.checkLog3("subitems", `[addSubItem] IS NOT EMBEDDED > Fetching Global, globalItem '${globalItem?.id}':`, globalItem);

      if (!globalItem) { return }
      focusItem = await BladesItem.create([globalItem] as unknown as ItemDataConstructorData, {parent: this}) as BladesItem;
      focusItem = this.items.getName(globalItem.name!);
      eLog.checkLog3("subitems", `[addSubItem] ... NEWLY EMBEDDED, focusItem '${focusItem!.id}'`, focusItem);
    }

    if (!focusItem) { return }
    eLog.checkLog3("subitems", `[addSubItem] Checking Uniqueness of '${focusItem.id}'`, {
      BladesItemUniqueTypes: Object.values(BladesItemUniqueTypes),
      focusItemType: focusItem.type,
      isLimited: Object.values(BladesItemUniqueTypes).includes(focusItem.type as any)
    });

    // Is this item type limited to one per actor?
    if (Object.values(BladesItemUniqueTypes).includes(focusItem.type as any)) {
      // ... then archive all other versions.
      await Promise.all(this.activeSubItems
        .filter((subItem) => subItem.type === focusItem!.type && subItem!.system.world_name !== focusItem!.system.world_name && !subItem.hasTag(Tag.System.Archived))
        .map(this.remSubItem.bind(this)));
    }
  }

  async remSubItem(itemRef: ItemRef): Promise<void> {
    const subItem = this.getSubItem(itemRef);
    if (!subItem) { return }
    if (subItem.type !== BladesItemType.gear) {
      this.purgeSubItem(itemRef);
      return;
    }
    eLog.checkLog("actorTrigger", "Removing SubItem " + subItem.name, subItem);
    if (subItem.hasTag(Tag.System.Archived)) { return }
    subItem.addTag(Tag.System.Archived);
  }

  async purgeSubItem(itemRef: ItemRef): Promise<void> {
    const subItem = this.getSubItem(itemRef);
    if (!subItem || subItem.hasTag(Tag.System.Archived)) { return }
    subItem.delete();
  }

  // #endregion
  // #region Advancement Implementation ~
  // get totalAbilityPoints(): number {
  //   if (!BladesActor.IsType(this, BladesActorType.pc, BladesActorType.crew)) { return 0 }
  //   if (!this.playbook) { return 0 }
  //   switch (this.type) {
  //     case BladesActorType.pc: return this.system.advancement.ability ?? 0;
  //     case BladesActorType.crew: return Math.floor(0.5 * (this.system.advancement.general ?? 0)) + (this.system.advancement.ability ?? 0);
  //     default: return 0;
  //   }
  // }
  // get spentAbilityPoints(): number {
  //   if (!BladesActor.IsType(this, BladesActorType.pc, BladesActorType.crew)) { return 0 }
  //   if (!this.playbook) { return 0 }
  //   return this.abilities.reduce((total, ability) => total + (ability.system.price ?? 1), 0);
  // }
  // get getAvailableAdvancements("Ability")(): number {
  //   if (!BladesActor.IsType(this, BladesActorType.pc, BladesActorType.crew)) { return 0 }
  //   if (!this.playbook) { return 0 }
  //   return this.totalAbilityPoints - this.spentAbilityPoints;
  // }

  /* Need simple getters for total ability & upgrade points that check for PRICES of items
        (upgrade.system.price ?? 1) */

  async grantAdvancementPoints(allowedTypes: AdvancementPoint|AdvancementPoint[], amount = 1) {
    const aPtKey: string = Array.isArray(allowedTypes)
      ? allowedTypes.sort().join("_")
      : allowedTypes;
    this.update({[`system.advancement_points.${aPtKey}`]: (this.system.advancement_points?.[aPtKey] ?? 0) + amount});
  }

  async removeAdvancementPoints(allowedTypes: AdvancementPoint|AdvancementPoint[], amount = 1) {
    const aPtKey: string = Array.isArray(allowedTypes)
      ? allowedTypes.sort().join("_")
      : allowedTypes;
    const newCount = this.system.advancement_points?.[aPtKey] ?? 0 - amount;
    if (newCount <= 0 && aPtKey in (this.system.advancement_points ?? [])) {
      return this.update({[`system.advancement_points.-=${aPtKey}`]: null});
    }
    return this.update({[`system.advancement_points.${aPtKey}`]: newCount});
  }

  getAvailableAdvancements(trait: Action|"Ability"|"Upgrade"|"Cohort"|"CohortType"): number {
    if (!BladesActor.IsType(this, BladesActorType.pc, BladesActorType.crew)) { return 0 }
    if (trait in Action) {
      return 1;
    }
    if (trait === "Cohort") {
      const pointsCohort = this.system.advancement_points?.[AdvancementPoint.Cohort] ?? 0;
      const spentCohort = this.cohorts.length;
      return Math.max(0, pointsCohort - spentCohort);
    }

    const pointsAbility = this.system.advancement_points?.[AdvancementPoint.Ability] ?? 0;
    const pointsCohortType = this.system.advancement_points?.[AdvancementPoint.CohortType] ?? 0;
    const pointsUpgrade = this.system.advancement_points?.[AdvancementPoint.Upgrade] ?? 0;
    const pointsUpgradeOrAbility = this.system.advancement_points?.[AdvancementPoint.UpgradeOrAbility] ?? 0;

    const spentAbility = U.sum(this.items
      .filter((item) => BladesItem.IsType(item, BladesItemType.ability, BladesItemType.crew_ability))
      .map((abil) => abil.system.price ?? 1));
    const spentCohortType = U.sum(this.cohorts.map((cohort) => Math.max(0, U.unique(Object.values(cohort.system.subtypes)).length - 1)));
    const spentUpgrade = U.sum(this.items
      .filter((item) => BladesItem.IsType(item, BladesItemType.crew_upgrade))
      .map((upgrade) => upgrade.system.price ?? 1));

    const excessUpgrade = Math.max(0, spentUpgrade - pointsUpgrade);
    const excessCohortType = Math.max(0, spentCohortType - pointsCohortType);
    const excessAbility = Math.max(0, spentAbility - pointsAbility);

    const remainingAbility = Math.max(0, pointsAbility - spentAbility);
    const remainingCohortType = Math.max(0, pointsCohortType - spentCohortType);
    const remainingUpgrade = Math.max(0, pointsUpgrade - spentUpgrade);
    const remainingUpgradeOrAbility = Math.max(0, pointsUpgradeOrAbility - excessUpgrade - (2 * excessAbility) - (2 * excessCohortType));

    if (trait === "Ability") {
      return remainingAbility + Math.floor(0.5 * remainingUpgradeOrAbility);
    }
    if (trait === "Upgrade") {
      return remainingUpgrade + remainingUpgradeOrAbility;
    }
    if (trait === "CohortType") {
      return remainingCohortType + remainingUpgradeOrAbility;
    }

    return 0 as never;
  }

  get availableAbilityPoints() { return this.getAvailableAdvancements("Ability") }
  get availableUpgradePoints() { return this.getAvailableAdvancements("Upgrade") }
  get availableCohortPoints() { return this.getAvailableAdvancements("Cohort") }
  get availableCohortTypePoints() { return this.getAvailableAdvancements("CohortType") }

  get canPurchaseAbility() { return this.availableAbilityPoints > 0 }
  get canPurchaseUpgrade() { return this.availableUpgradePoints > 0 }
  get canPurchaseCohort() { return this.availableCohortPoints > 0 }
  get canPurchaseCohortType() { return this.availableCohortTypePoints > 0 }

  async advancePlaybook(): Promise<void> {
    if (!(BladesActor.IsType(this, BladesActorType.pc) || BladesActor.IsType(this, BladesActorType.crew)) || !this.playbook) { return undefined }
    await this.update({"system.experience.playbook.value": 0});
    if (BladesActor.IsType(this, BladesActorType.pc)) {
      game.eunoblades.PushController!.pushToAll("GM", `${this.name} Advances their Playbook!`, `${this.name}, select a new Ability on your Character Sheet.`);
      return this.grantAdvancementPoints(AdvancementPoint.Ability);
    }
    if (BladesActor.IsType(this, BladesActorType.crew)) {
      game.eunoblades.PushController!.pushToAll("GM", `${this.name} Advances their Playbook!`, "Select new Upgrades and/or Abilities on your Crew Sheet.");
      this.members.forEach((member) => {
        const coinGained = this.system.tier.value + 2;
        game.eunoblades.PushController!.pushToAll("GM", `${member.name} Gains ${coinGained} Stash (Crew Advancement)`, undefined);
        member.addStash(coinGained);
      });
      return this.grantAdvancementPoints(AdvancementPoint.UpgradeOrAbility, 2);
    }
    return undefined as never;
  }

  async advanceAttribute(attribute: Attribute) {
    await this.update({[`system.experience.${attribute}.value`]: 0});
    const actions = C.Action[attribute].map((action) => `<strong>${U.tCase(action)}</strong>`);
    game.eunoblades.PushController!.pushToAll("GM", `${this.name} Advances their ${U.uCase(attribute)}!`, `${this.name}, add a dot to one of ${U.oxfordize(actions, true, "or")}.`);
  }


  // #endregion
  // #region BladesSubActor Implementation ~

  parentActor?: BladesActor;
  get isSubActor() { return this.parentActor !== undefined }

  // #endregion

  // #region BladesCrew Implementation ~

  get members(): BladesPC[] {
    if (!BladesActor.IsType(this, BladesActorType.crew)) { return [] }
    const self = this as BladesCrew;
    return BladesActor.GetTypeWithTags(BladesActorType.pc).filter((actor): actor is BladesPC => actor.isMember(self));
  }
  get contacts(): Array<BladesNPC|BladesFaction> {
    if (!BladesActor.IsType(this, BladesActorType.crew) || !this.playbook) { return [] }
    const self: BladesCrew = this as BladesCrew;
    return this.activeSubActors.filter((actor): actor is BladesNPC|BladesFaction => actor.hasTag(self.playbookName));
  }
  get claims(): Record<number, BladesClaimData> {
    if (!BladesActor.IsType(this, BladesActorType.crew) || !this.playbook) { return {} }
    return this.playbook.system.turfs!;
  }
  get turfCount(): number {
    if (!BladesActor.IsType(this, BladesActorType.crew) || !this.playbook) { return 0 }
    return Object.values(this.playbook.system.turfs!)
      .filter((claim) => claim.isTurf && claim.value).length;
  }

  get upgrades(): Array<BladesItemOfType<BladesItemType.crew_upgrade>> {
    if (!BladesActor.IsType(this, BladesActorType.crew) || !this.playbook) { return [] }
    return this.activeSubItems.filter((item): item is BladesItemOfType<BladesItemType.crew_upgrade> => item.type === BladesItemType.crew_upgrade);
  }
  get cohorts(): Array<BladesItemOfType<BladesItemType.cohort_gang|BladesItemType.cohort_expert>> {
    return this.activeSubItems.filter((item): item is BladesItemOfType<BladesItemType.cohort_gang|BladesItemType.cohort_expert> => [BladesItemType.cohort_gang, BladesItemType.cohort_expert].includes(item.type));
  }

  getTaggedItemBonuses(tags: BladesTag[]): number {
    // Check ACTIVE EFFECTS supplied by upgrade/ability against submitted tags?
    return 0;
  }
  // #endregion

  // #region PREPARING DERIVED DATA
  override prepareDerivedData() {
    if (BladesActor.IsType(this, BladesActorType.pc)) { this._preparePCData(this.system) }
    if (BladesActor.IsType(this, BladesActorType.crew)) { this._prepareCrewData(this.system) }
    if (BladesActor.IsType(this, BladesActorType.npc)) { this._prepareNPCData(this.system) }
    if (BladesActor.IsType(this, BladesActorType.faction)) { this._prepareFactionData(this.system) }
  }

  _preparePCData(system: ExtractBladesActorSystem<BladesActorType.pc>) {
    if (!BladesActor.IsType(this, BladesActorType.pc)) { return }

    // Extract experience clues from playbook item, if any
    if (this.playbook) {
      system.experience.clues = [...system.experience.clues, ...Object.values(this.playbook.system.experience_clues).filter((clue) => Boolean(clue.trim()))];
    }
    // Extract gather information questions from playbook item, if any
    if (this.playbook) {
      system.gather_info = [...system.gather_info, ...Object.values(this.playbook.system.gather_info_questions).filter((question) => Boolean(question.trim()))];
    }
  }

  _prepareCrewData(system: ExtractBladesActorSystem<BladesActorType.crew>) {
    if (!BladesActor.IsType(this, BladesActorType.crew)) { return }

    // Extract experience clues and turfs from playbook item, if any
    if (this.playbook) {
      system.experience.clues = [...system.experience.clues, ...Object.values(this.playbook.system.experience_clues).filter((clue) => Boolean(clue.trim()))];
      system.turfs = this.playbook.system.turfs;
    }
  }

  _prepareNPCData(system: ExtractBladesActorSystem<BladesActorType.npc>) {
    if (!BladesActor.IsType(this, BladesActorType.npc)) { return }
  }

  _prepareFactionData(system: ExtractBladesActorSystem<BladesActorType.faction>) {
    if (!BladesActor.IsType(this, BladesActorType.faction)) { return }
  }

  // #endregion

  // #region OVERRIDES: _onCreateDescendantDocuments, update ~
  // @ts-expect-error New method not defined in @league VTT types.
  override async _onCreateDescendantDocuments(parent: BladesActor, collection: "items"|"effects", docs: BladesItem[]|BladesActiveEffect[], data: BladesItem[]|BladesActiveEffect[], options: Record<string,boolean>, userId: string): Promise<void> {
    docs.forEach(async (doc) => {
      if (doc instanceof BladesItem && [BladesItemType.playbook, BladesItemType.crew_playbook].includes(doc.type)) {
        await Promise.all(this.activeSubItems
          .filter((aItem) => aItem.type === doc.type && aItem.system.world_name !== doc.system.world_name)
          .map((aItem) => this.remSubItem(aItem)));
      }
    });

    // @ts-expect-error New method not defined in @league VTT types.
    await super._onCreateDescendantDocuments(parent, collection, docs, data, options, userId);

    eLog.checkLog("actorTrigger", "_onCreateDescendantDocuments", {parent, collection, docs, data, options, userId});

    docs.forEach(async (doc) => {
      if (BladesItem.IsType(doc, BladesItemType.vice) && BladesActor.IsType(this, BladesActorType.pc)) {
        this.activeSubActors
          .filter((subActor) => subActor.hasTag(Tag.NPC.VicePurveyor) && !subActor.hasTag(doc.name as Vice))
          .forEach((subActor) => this.remSubActor(subActor));
      }
    });
  }

  override async update(updateData: DeepPartial<(ActorDataConstructorData & SubActorData) | (ActorDataConstructorData & SubActorData & Record<string, unknown>)> | undefined, context?: (DocumentModificationContext & MergeObjectOptions) | undefined, isSkippingSubActorCheck = false): Promise<any> {
    if (!updateData) { return super.update(updateData) }
    if (BladesActor.IsType(this, BladesActorType.crew)) {
      if (!this.playbook) { return undefined }

      eLog.checkLog("actorTrigger", "Updating Crew", {updateData});
      const playbookUpdateData: Partial<ItemDataConstructorData> = Object.fromEntries(Object.entries(flattenObject(updateData))
        .filter(([key, _]: [string, unknown]) => key.startsWith("system.turfs.")));
      updateData = Object.fromEntries(Object.entries(flattenObject(updateData))
        .filter(([key, _]: [string, unknown]) => !key.startsWith("system.turfs.")));
      eLog.checkLog("actorTrigger", "Updating Crew", {crewUpdateData: updateData, playbookUpdateData});

      const diffPlaybookData = diffObject(flattenObject(this.playbook), playbookUpdateData) as Record<string,any> & {_id?: string};
      delete diffPlaybookData._id;

      if (!U.isEmpty(diffPlaybookData)) {
        await this.playbook!.update(playbookUpdateData, context)
          .then(() => this.sheet?.render(false));
      }
    } else if (BladesActor.IsType(this, BladesActorType.npc) || BladesActor.IsType(this, BladesActorType.faction)) {
      if (this.parentActor && !isSkippingSubActorCheck) {
        // This is an embedded Actor: Update it as a subActor of parentActor.
        return this.parentActor.updateSubActor(this.id!, updateData);
      }
    }

    return super.update(updateData, context);
  }

  // #endregion

  // #region Rolling Dice ~
  rollAttributePopup(attribute_name: Attribute | Action) {
    const attribute_label: Capitalize<Attribute | Action> = U.tCase(attribute_name);

    let content = `
        <h2>${game.i18n.localize("BITD.Roll")} ${attribute_label}</h2>
        <form>
          <div class="form-group">
            <label>${game.i18n.localize("BITD.Modifier")}:</label>
            <select id="mod" name="mod">
              ${this.createListOfDiceMods(-3, +3, 0)}
            </select>
          </div>`;
    if ([...Object.keys(Attribute), ...Object.keys(Action)].includes(attribute_name)) {
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
          callback: async (html: HTMLElement | JQuery<HTMLElement>) => {
            if (html instanceof HTMLElement) {
              html = $(html);
            }
            const modifier = parseInt(`${html.find('[name="mod"]').attr("value") ?? 0}`);
            const position: Position = `${html.find('[name="pos"]').attr("value") ?? Position.risky}` as Position;
            const effect: Effect = `${html.find('[name="fx"]').attr("value") ?? Effect.standard}` as Effect;
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
    attribute_name: Attribute | Action,
    additional_dice_amount = 0,
    position: Position = Position.risky,
    effect: Effect = Effect.standard,
    note?: string
  ) {
    if (!BladesActor.IsType(this, BladesActorType.pc)) { return }
    bladesRoll(
      this.rollable[attribute_name] + additional_dice_amount,
      attribute_name,
      position,
      effect,
      note
    );
  }

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
  createListOfDiceMods(rs: number, re: number, s: number | string) {

    let text = "";

    if (s === "") {
      s = 0;
    }

    for (let i = rs; i <= re; i++) {
      let plus = "";
      if (i >= 0) { plus = "+" }
      text += `<option value="${i}"`;
      if (i === s) {
        text += " selected";
      }

      text += `>${plus}${i}d</option>`;
    }

    return text;
  }

  // #endregion Rolling Dice

  // #region NPC Randomizers ~
  updateRandomizers() {
    if (!BladesActor.IsType(this, BladesActorType.npc)) { return }
    const titleChance = 0.05;
    const suffixChance = 0.01;

    const {persona, secret, random} = this.system;

    function sampleArray(arr: string[], ...curVals: string[]): string {
      arr = arr.filter((elem) => !curVals.includes(elem));
      if (!arr.length) { return "" }
      return arr[Math.floor(Math.random() * arr.length)];
    }
    const randomGen: Record<string, (gender?: string) => string> = {
      name: (gender?: string) => {
        return [
          Math.random() <= titleChance
            ? sampleArray(Randomizers.NPC.name_title)
            : "",
          sampleArray([
            ...((gender ?? "").charAt(0).toLowerCase() !== "m" ? Randomizers.NPC.name_first.female : []),
            ...((gender ?? "").charAt(0).toLowerCase() !== "f" ? Randomizers.NPC.name_first.male : [])
          ]),
          `"${sampleArray(Randomizers.NPC.name_alias)}"`,
          sampleArray(Randomizers.NPC.name_surname),
          Math.random() <= suffixChance
            ? sampleArray(Randomizers.NPC.name_suffix)
            : ""
        ].filter((val) => Boolean(val)).join(" ");
      },
      background: () => sampleArray(Randomizers.NPC.background, random.background.value),
      heritage: () => sampleArray(Randomizers.NPC.heritage, random.heritage.value),
      profession: () => sampleArray(Randomizers.NPC.profession, random.profession.value),
      gender: () => sampleArray(Randomizers.NPC.gender, persona.gender.value) as "M"|"F"|"U"|"X",
      appearance: () => sampleArray(Randomizers.NPC.appearance, persona.appearance.value),
      goal: () => sampleArray(Randomizers.NPC.goal, persona.goal.value, secret.goal.value),
      method: () => sampleArray(Randomizers.NPC.method, persona.method.value, secret.method.value),
      trait: () => sampleArray(Randomizers.NPC.trait, persona.trait1.value, persona.trait2.value, persona.trait3.value, secret.trait.value),
      interests: () => sampleArray(Randomizers.NPC.interests, persona.interests.value, secret.interests.value),
      quirk: () => sampleArray(Randomizers.NPC.quirk, persona.quirk.value),
      style: (gender = "") => sampleArray([
        ...(gender.charAt(0).toLowerCase() !== "m" ? Randomizers.NPC.style.female : []),
        ...(gender.charAt(0).toLowerCase() !== "f" ? Randomizers.NPC.style.male : [])
      ], persona.style.value)
    };

    const gender = persona.gender.isLocked ? persona.gender.value : randomGen.gender();
    const updateKeys = [
      ...Object.keys(persona).filter((key) => !persona[key as KeyOf<typeof persona>]?.isLocked),
      ...Object.keys(random).filter((key) => !random[key as KeyOf<typeof random>]?.isLocked),
      ...Object.keys(secret).filter((key) => !secret[key as KeyOf<typeof secret>]?.isLocked)
        .map((secretKey) => `secret-${secretKey}`)
    ];

    eLog.checkLog("Update Keys", {updateKeys});
    const updateData: Record<string, BladesRandomizer> = {};

    updateKeys.forEach((key) => {
      switch (key) {
        case "name":
        case "heritage":
        case "background":
        case "profession": {
          const randomVal = randomGen[key]();
          updateData[`system.random.${key}`] = {
            isLocked: false,
            value: randomVal || random[key as KeyOf<typeof random>].value
          };
          break;
        }
        case "secret-goal":
        case "secret-interests":
        case "secret-method": {
          key = key.replace(/^secret-/, "");
          const randomVal = randomGen[key]();
          updateData[`system.secret.${key}`] = {
            isLocked: false,
            value: randomVal || secret[key as KeyOf<typeof secret>].value
          };
          break;
        }
        case "gender": {
          updateData[`system.persona.${key}`] = {
            isLocked: persona.gender.isLocked,
            value: gender
          };
          break;
        }
        case "trait1":
        case "trait2":
        case "trait3":
        case "secret-trait": {
          const trait1 = persona.trait1.isLocked
            ? persona.trait1.value
            : sampleArray(Randomizers.NPC.trait, persona.trait1.value, persona.trait2.value, persona.trait3.value, secret.trait.value);
          const trait2 = persona.trait2.isLocked
            ? persona.trait2.value
            : sampleArray(Randomizers.NPC.trait, trait1, persona.trait1.value, persona.trait2.value, persona.trait3.value, secret.trait.value);
          const trait3 = persona.trait3.isLocked
            ? persona.trait3.value
            : sampleArray(Randomizers.NPC.trait, trait1, trait2, persona.trait1.value, persona.trait2.value, persona.trait3.value, secret.trait.value);
          const secretTrait = secret.trait.isLocked
            ? secret.trait.value
            : sampleArray(Randomizers.NPC.trait, trait1, trait2, trait3, persona.trait1.value, persona.trait2.value, persona.trait3.value, secret.trait.value);
          if (!persona.trait1.isLocked) {
            updateData["system.persona.trait1"] = {
              isLocked: false,
              value: trait1
            };
          }
          if (!persona.trait2.isLocked) {
            updateData["system.persona.trait2"] = {
              isLocked: false,
              value: trait2
            };
          }
          if (!persona.trait3.isLocked) {
            updateData["system.persona.trait3"] = {
              isLocked: false,
              value: trait3
            };
          }
          if (!secret.trait.isLocked) {
            updateData["system.secret.trait"] = {
              isLocked: false,
              value: secretTrait
            };
          }
          break;
        }
        default: {
          const randomVal = randomGen[key]();
          updateData[`system.persona.${key}`] = {
            isLocked: false,
            value: randomVal || persona[key as KeyOf<typeof persona>].value
          };
          break;
        }
      }
    });

    this.update(updateData);
  }
  // #endregion NPC Randomizers

}

declare interface BladesActor {
  get id(): string;
  get type(): BladesActorType;
  get items(): EmbeddedCollection<typeof BladesItem, ActorData>;
  system: BladesActorSystem,
  getRollData(): BladesActorRollData;
  parent: TokenDocument | null;
  ownership: Record<string, ValueOf<typeof CONST.DOCUMENT_PERMISSION_LEVELS>>;
  _source: BladesActor;
}


export default BladesActor;