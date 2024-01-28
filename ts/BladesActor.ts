/* eslint-disable @typescript-eslint/no-unused-vars */
// #region Imports ~
import U from "./core/utilities";
import C, {BladesActorType, Tag, Playbook, BladesNoticeType, BladesItemType, AttributeTrait, ActionTrait, PrereqType, AdvancementPoint, Randomizers, Factor, Vice} from "./core/constants";

import {BladesPC, BladesCrew, BladesFaction, BladesNPC} from "./documents/BladesActorProxy";
import {BladesItem} from "./documents/BladesItemProxy";

import {BladesRollMod} from "./classes/BladesRoll";
import BladesDirector from "./classes/BladesDirector";
import {SelectionCategory} from "./classes/BladesDialog";

import type {ActorData, ActorDataConstructorData} from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/actorData";
import type {ItemDataConstructorData} from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/itemData";
import type BladesActiveEffect from "./documents/BladesActiveEffect";
import type EmbeddedCollection from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/abstract/embedded-collection.mjs";
// import type {ToObjectFalseType} from "@league-of-foundry-developers/foundry-vtt-types/src/types/helperTypes";
import type {MergeObjectOptions} from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/utils/helpers.mjs";
// #endregion


// Blades Theme Song: "Bangkok" from The Gray Man soundtrack: https://www.youtube.com/watch?v=cjjImvMqYlo&list=OLAK5uy_k9cZDd1Fbpd25jfDtte5A6HyauD2-cwgk&index=2
// Also check out Discord thread: https://discord.com/channels/325094888133885952/1152316839163068527


enum BladesActorUniqueTags {
  CharacterCrew = Tag.PC.CharacterCrew,
  VicePurveyor = Tag.NPC.VicePurveyor
}

enum BladesItemUniqueTypes {
  background = BladesItemType.background,
  vice = BladesItemType.vice,
  crew_playbook = BladesItemType.crew_playbook,
  crew_reputation = BladesItemType.crew_reputation,
  heritage = BladesItemType.heritage,
  playbook = BladesItemType.playbook,
  preferred_op = BladesItemType.preferred_op,
}
class BladesActor extends Actor implements BladesDocument<Actor> {

  // #region Static Overrides: Create ~
  static override async create(data: ActorDataConstructorData & { system?: Partial<BladesActorSystem> }, options = {}) {
    data.token = data.token || {};
    data.system = data.system ?? {};

    // ~ Create world_name
    data.system.world_name = data.system.world_name ?? data.name.replace(/[^A-Za-z_0-9 ]/g, "").trim().replace(/ /g, "_");

    return await super.create(data, options);
  }
  // #endregion

  // #region BladesDocument Implementation ~
  static get All() { return game.actors; }

  static Get(actorRef: ActorRef): BladesActor | undefined {
    if (actorRef instanceof BladesActor) { return actorRef; }
    if (U.isDocID(actorRef)) { return BladesActor.All.get(actorRef); }
    return BladesActor.All.find((a) => a.system.world_name === actorRef)
      || BladesActor.All.find((a) => a.name === actorRef);
  }

  static GetTypeWithTags<T extends BladesActorType>(docType: T, ...tags: BladesTag[]): Array<BladesActorOfType<T>> {
    return BladesActor.All.filter((actor) => actor.type === docType)
      .filter((actor) => actor.hasTag(...tags)) as Array<BladesActorOfType<T>>;
  }

  static IsType<T extends BladesActorType>(doc: unknown, ...types: T[]): doc is BladesActorOfType<T> {
    const typeSet = new Set<BladesActorType>(types);
    return doc instanceof BladesActor && typeSet.has(doc.type);
  }

  get tags(): BladesTag[] { return this.system.tags ?? []; }

  hasTag(...tags: BladesTag[]): boolean {
    return tags.every((tag) => this.tags.includes(tag));
  }

  async addTag(...tags: BladesTag[]) {
    const curTags = this.tags;
    tags.forEach((tag) => {
      if (curTags.includes(tag)) { return; }
      curTags.push(tag);
    });
    eLog.checkLog2("actor", "BladesActor.addTag(...tags)", {tags, curTags});
    await this.update({"system.tags": curTags});
  }

  async remTag(...tags: BladesTag[]) {
    const curTags = this.tags.filter((tag) => !tags.includes(tag));
    eLog.checkLog2("actor", "BladesActor.remTag(...tags)", {tags, curTags});
    await this.update({"system.tags": curTags});
  }

  get tooltip(): string | undefined {
    const tooltipText = [this.system.concept, this.system.subtitle]
      .filter(Boolean)
      .join("<br><br>");
    return tooltipText ? (new Handlebars.SafeString(tooltipText)).toString() : undefined;
  }

  get dialogCSSClasses(): string { return ""; }

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
      default: return 0;
    }
  }
  // #endregion

  // #region SubActorControl Implementation ~

  get subActors(): BladesActor[] {
    return Object.keys(this.system.subactors)
      .map((id) => this.getSubActor(id))
      .filter((subActor): subActor is BladesActor => Boolean(subActor));
  }

  get activeSubActors(): BladesActor[] {
    return this.subActors.filter((subActor) => !subActor.hasTag(Tag.System.Archived));
  }

  get archivedSubActors(): BladesActor[] {
    return this.subActors.filter((subActor) => subActor.hasTag(Tag.System.Archived));
  }

  checkActorPrereqs(actor: BladesActor): boolean {

    /* Implement any prerequisite checks for embedding actors */

    return Boolean(actor);
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
        if (a.name === b.name) { return 0; }
        if (a.name === null) { return 1; }
        if (b.name === null) { return -1; }
        if (a.name > b.name) { return 1; }
        if (a.name < b.name) { return -1; }
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
        if (!BladesActor.IsType(this, BladesActorType.pc, BladesActorType.crew)
          || this.playbookName === null) { return false; }
        dialogData.Main = this.processEmbeddedActorMatches(
          BladesActor.GetTypeWithTags(BladesActorType.npc, this.playbookName)
        );
        return dialogData;
      }
      case SelectionCategory.VicePurveyor: {
        if (!BladesActor.IsType(this, BladesActorType.pc) || !this.vice?.name) { return false; }
        dialogData.Main = this.processEmbeddedActorMatches(
          BladesActor.GetTypeWithTags(BladesActorType.npc, this.vice.name as Vice)
        );
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

    let focusSubActor: BladesActor | undefined;
    // Does an embedded subActor of this Actor already exist on the character?
    if (this.hasSubActorOf(actorRef)) {
      const subActor = this.getSubActor(actorRef);
      if (!subActor) { return; }
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
      if (!actor) { return; }
      const subActorData: SubActorData = {};
      if (tags) {
        subActorData.tags = U.unique([
          ...actor.tags,
          ...tags
        ]);
      }
      // Await the update, then make the retrieved subactor the focus
      await this.update({[`system.subactors.${actor.id}`]: subActorData});
      focusSubActor = this.getSubActor(actor.id);
    }

    if (!focusSubActor) { return; }

    // Does this Actor contain any tags limiting it to one per actor?
    const uniqueTags = focusSubActor.tags.filter((tag) => tag in BladesActorUniqueTags);
    if (uniqueTags.length > 0) {
      // ... then archive all other versions.
      uniqueTags.forEach((uTag) => this.activeSubActors
        .filter((subActor): subActor is BladesActor =>
          Boolean(focusSubActor?.id
            && subActor.id !== focusSubActor.id
            && subActor.hasTag(uTag))
        )
        .map((subActor) => this.remSubActor(subActor.id)));
    }
  }

  getSubActor(actorRef: ActorRef): BladesActor | undefined {
    const actor = BladesActor.Get(actorRef);
    if (!actor?.id) { return undefined; }
    if (!BladesActor.IsType(actor, BladesActorType.npc, BladesActorType.faction)) { return actor; }
    const subActorData = (this.system.subactors[actor.id] ?? {}) as SubActorData;
    Object.assign(
      actor.system,
      subActorData
    );
    actor.parentActor = this;
    return actor;
  }

  hasSubActorOf(actorRef: ActorRef): boolean {
    const actor = BladesActor.Get(actorRef);
    if (!actor) { return false; }
    return actor?.id ? actor.id in this.system.subactors : false;
  }

  async updateSubActor(
    actorRef: ActorRef,
    upData: List<FullPartial<BladesActorSystem>>
  ): Promise<BladesActor|undefined> {
    const updateData = U.objExpand(upData) as {system: FullPartial<SubActorData>};
    if (!updateData.system) { return undefined; }
    const actor = BladesActor.Get(actorRef);
    if (!actor) { return undefined; }

    // DiffObject new update data against actor data.
    const diffUpdateSystem = U.objDiff(actor.system as BladesActorSystem & Record<string, unknown>, updateData.system);

    // Merge new update data onto current subactor data.
    const mergedSubActorSystem = U.objMerge(
      this.system.subactors[actor.id] ?? {},
      diffUpdateSystem,
      {isReplacingArrays: true, isConcatenatingArrays: false}
    );

    // Confirm this update changes data:
    if (JSON.stringify(this.system.subactors[actor.id]) === JSON.stringify(mergedSubActorSystem)) { return undefined; }
    // Update actor with new subactor data.
    return this.update({[`system.subactors.${actor.id}`]: null}, undefined, true)
      .then(() => this.update({[`system.subactors.${actor.id}`]: mergedSubActorSystem}, undefined, true))
      .then(() => actor.sheet?.render()) as Promise<BladesActor|undefined>;
  }

  async remSubActor(actorRef: ActorRef): Promise<void> {
    const subActor = this.getSubActor(actorRef);
    if (!subActor) { return; }
    await this.update({"system.subactors": mergeObject(this.system.subactors, {[`-=${subActor.id}`]: null})}, undefined, true);
  }

  async clearSubActors(isReRendering = true): Promise<void> {
    this.subActors.forEach((subActor) => {
      if (subActor.parentActor?.id === this.id) { subActor.clearParentActor(isReRendering); }
    });
    await this.sheet?.render();
  }

  async clearParentActor(isReRendering = true): Promise<void> {
    const {parentActor} = this;
    if (!parentActor) { return; }
    this.parentActor = undefined;
    this.system = this._source.system;
    this.ownership = this._source.ownership;

    this.prepareData();
    if (isReRendering) {
      await this.sheet?.render();
    }
  }
  // #endregion
  // #region SubItemControl Implementation ~

  get subItems() { return Array.from(this.items); }

  getSubItemsOfType<T extends BladesItemType>(itemType: T): Array<BladesItemOfType<T>> {
    return this.items.filter((item) => item.type === itemType) as Array<BladesItemOfType<T>>;
  }

  get activeSubItems() { return this.items.filter((item) => !item.hasTag(Tag.System.Archived)); }

  get archivedSubItems() { return this.items.filter((item) => item.hasTag(Tag.System.Archived)); }

  protected _checkItemPrereqs(item: BladesItem): boolean {
    if (!item.system.prereqs) { return true; }
    for (const [pType, pReqs] of Object.entries(
      item.system.prereqs as Partial<Record<PrereqType, boolean | string | string[]>>
    )) {
      const pReqArray = Array.isArray(pReqs) ? pReqs : [pReqs.toString()];
      const hitRecord: Partial<Record<PrereqType, string[]>> = {};
      if (!this._processPrereqArray(pReqArray, pType as PrereqType, hitRecord)) {
        return false;
      }
    }
    return true;
  }

  protected _processPrereqArray(
    pReqArray: string[],
    pType: PrereqType,
    hitRecord: Partial<Record<PrereqType, string[]>>
  ): boolean {
    while (pReqArray.length) {
      const pString = pReqArray.pop();
      hitRecord[pType] ??= [];
      if (!this._processPrereqType(pType, pString, hitRecord)) {
        return false;
      }
    }
    return true;
  }

  protected _processPrereqType(
    pType: PrereqType,
    pString: string | undefined,
    hitRecord: Partial<Record<PrereqType, string[]>>
  ): boolean {
    switch (pType) {
      case PrereqType.HasActiveItem: {
        return this._processActiveItemPrereq(pString, hitRecord, pType);
      }
      case PrereqType.HasActiveItemsByTag: {
        return this._processActiveItemsByTagPrereq(pString, hitRecord, pType);
      }
      case PrereqType.AdvancedPlaybook: {
        return this._processAdvancedPlaybookPrereq();
      }
      default: return true;
    }
  }

  protected _processActiveItemPrereq(
    pString: string | undefined,
    hitRecord: Partial<Record<PrereqType, string[]>>,
    pType: PrereqType
  ): boolean {
    const thisItem = this.activeSubItems
      .filter((i) => !hitRecord[pType]?.includes(i.id))
      .find((i) => i.system.world_name === pString);
    if (thisItem) {
      hitRecord[pType]?.push(thisItem.id);
      return true;
    } else {
      return false;
    }
  }

  protected _processActiveItemsByTagPrereq(
    pString: string | undefined,
    hitRecord: Partial<Record<PrereqType, string[]>>,
    pType: PrereqType
  ): boolean {
    const thisItem = this.activeSubItems
      .filter((i) => !hitRecord[pType]?.includes(i.id))
      .find((i) => i.hasTag(pString as BladesTag));
    if (thisItem) {
      hitRecord[pType]?.push(thisItem.id);
      return true;
    } else {
      return false;
    }
  }

  protected _processAdvancedPlaybookPrereq(): boolean {
    if (!BladesActor.IsType(this, BladesActorType.pc)) { return false; }
    if (!this.playbookName || ![Playbook.Ghost, Playbook.Hull, Playbook.Vampire].includes(this.playbookName)) {
      return false;
    }
    return true;
  }

  protected _processEmbeddedItemMatches<T extends BladesItemType>(
    globalItems: Array<BladesItemOfType<T>>
  ): Array<BladesItemOfType<T>> {

    return globalItems

    // Step 1: Filter out globals that fail prereqs.
      .filter((item) => this._checkItemPrereqs(item))

    // Step 2: Filter out already-active items based on max_per_score (unless MultiplesOk)
      .filter((gItem) => gItem.hasTag(Tag.System.MultiplesOK)
        || (gItem.system.max_per_score ?? 1)
          > this.activeSubItems.filter((sItem) => sItem.system.world_name === gItem.system.world_name).length)

    // Step 3: Replace with matching Archived, Embedded subItems
      .map((gItem) => {
        const matchingSubItems = this.archivedSubItems.filter((sItem): sItem is BladesItemOfType<T> =>
          sItem.system.world_name === gItem.system.world_name);
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
        if (a.hasTag(Tag.System.Featured) && !b.hasTag(Tag.System.Featured)) { return -1; }
        if (!a.hasTag(Tag.System.Featured) && b.hasTag(Tag.System.Featured)) { return 1; }
        if (a.hasTag(Tag.Gear.Fine) && !b.hasTag(Tag.Gear.Fine)) { return -1; }
        if (!a.hasTag(Tag.Gear.Fine) && b.hasTag(Tag.Gear.Fine)) { return 1; }
        if (a.system.world_name > b.system.world_name) { return 1; }
        if (a.system.world_name < b.system.world_name) { return -1; }
        if (a.isEmbedded && !b.isEmbedded) { return -1; }
        if (!a.isEmbedded && b.isEmbedded) { return 1; }
        if (a.name === b.name) { return 0; }
        if (a.name === null) { return 1; }
        if (b.name === null) { return -1; }
        if (a.name > b.name) { return 1; }
        if (a.name < b.name) { return -1; }
        return 0;
      });
  }


  getSubItem(itemRef: ItemRef, activeOnly = false): BladesItem | undefined {
    const activeCheck = (i: BladesItem) => !activeOnly || !i.hasTag(Tag.System.Archived);
    if (typeof itemRef === "string" && this.items.get(itemRef)) {
      const returnItem = this.items.get(itemRef);
      if (returnItem && activeCheck(returnItem)) {
        return returnItem;
      } else {
        return undefined;
      }
    } else {
      const globalItem = BladesItem.Get(itemRef);
      if (!globalItem) { return undefined; }
      return this.items.find((item) => item.name === globalItem.name && activeCheck(item))
        ?? this.items.find((item) => item.system.world_name === globalItem.system.world_name && activeCheck(item));
    }
  }

  hasSubItemOf(itemRef: ItemRef): boolean {
    const item = BladesItem.Get(itemRef);
    if (!item) { return false; }
    return Boolean(this.items.find((i) => i.system.world_name === item.system.world_name));
  }

  hasActiveSubItemOf(itemRef: ItemRef): boolean {
    const item = BladesItem.Get(itemRef);
    if (!item) { return false; }
    return Boolean(this.items.find((i) => !i.hasTag(Tag.System.Archived)
      && i.system.world_name === item.system.world_name));
  }

  async addSubItem(itemRef: ItemRef): Promise<void> {

    /**
     * Determines whether a submitted BladesItemType is a type that should appear only once
     * on any given Actor.
     * @param {BladesItemType} type
     * @returns {boolean} True if the type is a BladesItemUniqueTypes
     **/
    function isBladesItemUniqueTypes(type: unknown): type is BladesItemUniqueTypes {
      return Object.values(BladesItemUniqueTypes).includes(type as BladesItemUniqueTypes);
    }

    eLog.checkLog3("subitems", "[addSubItem] itemRef", itemRef);

    let focusItem: BladesItem | undefined;

    // Does an embedded copy of this item already exist on the character?
    const embeddedItem: BladesItem | undefined = this.getSubItem(itemRef);


    if (embeddedItem) {

      // Is it an archived Item?
      if (embeddedItem.hasTag(Tag.System.Archived)) {
        // Unarchive it & make it the focus item.
        await embeddedItem.remTag(Tag.System.Archived);
        focusItem = embeddedItem;
        eLog.checkLog3("subitems", `[addSubItem] IS ARCHIVED EMBEDDED > Removing 'Archived' Tag, '${focusItem.id}':`, focusItem);
      } else { // Otherwise...
        // Duplicate the item, and make the newly-created item the focus.
        focusItem = await BladesItem.create(
          [embeddedItem] as unknown as ItemDataConstructorData,
          {parent: this}
        ) as BladesItem;
        eLog.checkLog3("subitems", `[addSubItem] IS ACTIVE EMBEDDED > Duplicating, focusItem '${focusItem.id}':`, focusItem);
      }
    } else {
      // Is it not embedded at all? Embed from global instance.
      const globalItem = BladesItem.Get(itemRef);

      eLog.checkLog3("subitems", `[addSubItem] IS NOT EMBEDDED > Fetching Global, globalItem '${globalItem?.id}':`, globalItem);

      if (!globalItem) { return; }
      focusItem = await BladesItem.create(
        [globalItem] as unknown as ItemDataConstructorData,
        {parent: this}
      ) as BladesItem;
      focusItem = this.items.getName(globalItem.name);
    }

    // Is this item type limited to one per actor?
    if (focusItem && isBladesItemUniqueTypes(focusItem.type)) {
      // ... then archive all other versions.
      await Promise.all(this.activeSubItems
        .filter((subItem) => subItem.type === focusItem?.type
            && subItem.system.world_name !== focusItem?.system.world_name
            && !subItem.hasTag(Tag.System.Archived))
        .map(this.remSubItem.bind(this)));
    }
  }

  async remSubItem(itemRef: ItemRef): Promise<void> {
    const subItem = this.getSubItem(itemRef);
    if (!subItem) { return; }
    if (subItem.type !== BladesItemType.gear) {
      this.purgeSubItem(itemRef);
      return;
    }
    eLog.checkLog("actorTrigger", `Removing SubItem ${subItem.name}`, subItem);
    if (subItem.hasTag(Tag.System.Archived)) { return; }
    await subItem.addTag(Tag.System.Archived);
  }

  async purgeSubItem(itemRef: ItemRef): Promise<void> {
    const subItem = this.getSubItem(itemRef);
    if (!subItem || subItem.hasTag(Tag.System.Archived)) { return; }
    await subItem.delete();
  }

  // #endregion
  // #region Advancement Implementation ~
  // get totalAbilityPoints(): number {
  //   if (!BladesActor.IsType(this, BladesActorType.pc, BladesActorType.crew)) { return 0 }
  //   if (!this.playbook) { return 0 }
  //   switch (this.type) {
  //     case BladesActorType.pc: return this.system.advancement.ability ?? 0;
  //     case BladesActorType.crew: return Math.floor(0.5 * (this.system.advancement.general ?? 0))
  //      + (this.system.advancement.ability ?? 0);
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
      ? [...allowedTypes].sort((a, b) => a.localeCompare(b)).join("_")
      : allowedTypes;
    await this.update({[`system.advancement_points.${aPtKey}`]: (this.system.advancement_points?.[aPtKey] ?? 0) + amount});
  }

  async removeAdvancementPoints(allowedTypes: AdvancementPoint|AdvancementPoint[], amount = 1) {
    const aPtKey: string = Array.isArray(allowedTypes)
      ? [...allowedTypes].sort((a, b) => a.localeCompare(b)).join("_")
      : allowedTypes;
    const newCount = this.system.advancement_points?.[aPtKey] ?? 0 - amount;
    if (newCount <= 0 && aPtKey in (this.system.advancement_points ?? [])) {
      await this.update({[`system.advancement_points.-=${aPtKey}`]: null});
    } else {
      await this.update({[`system.advancement_points.${aPtKey}`]: newCount});
    }
  }

  getAvailableAdvancements(trait: AdvancementTrait): number {
    if (!BladesActor.IsType(this, BladesActorType.pc, BladesActorType.crew)) { return 0; }
    if (trait in ActionTrait) {
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
    const spentCohortType = U.sum(this.cohorts
      .map((cohort) => Math.max(0, U.unique(Object.values(cohort.system.subtypes)).length - 1))
    );
    const spentUpgrade = U.sum(this.items
      .filter((item) => BladesItem.IsType(item, BladesItemType.crew_upgrade))
      .map((upgrade) => upgrade.system.price ?? 1));

    const excessUpgrade = Math.max(0, spentUpgrade - pointsUpgrade);
    const excessCohortType = Math.max(0, spentCohortType - pointsCohortType);
    const excessAbility = Math.max(0, spentAbility - pointsAbility);

    const remainingAbility = Math.max(0, pointsAbility - spentAbility);
    const remainingCohortType = Math.max(0, pointsCohortType - spentCohortType);
    const remainingUpgrade = Math.max(0, pointsUpgrade - spentUpgrade);
    const remainingUpgradeOrAbility = Math.max(
      0,
      pointsUpgradeOrAbility - excessUpgrade - (2 * excessAbility) - (2 * excessCohortType)
    );

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

  get availableAbilityPoints() { return this.getAvailableAdvancements("Ability"); }

  get availableUpgradePoints() { return this.getAvailableAdvancements("Upgrade"); }

  get availableCohortPoints() { return this.getAvailableAdvancements("Cohort"); }

  get availableCohortTypePoints() { return this.getAvailableAdvancements("CohortType"); }

  get canPurchaseAbility() { return this.availableAbilityPoints > 0; }

  get canPurchaseUpgrade() { return this.availableUpgradePoints > 0; }

  get canPurchaseCohort() { return this.availableCohortPoints > 0; }

  get canPurchaseCohortType() { return this.availableCohortTypePoints > 0; }


  async advancePlaybook() {
    if (!BladesActor.IsType(this, BladesActorType.pc, BladesActorType.crew) || !this.playbook) { return; }
    await this.update({"system.experience.playbook.value": 0});
    if (this instanceof BladesPC) {
      BladesDirector.getInstance().pushNotice_SocketCall(
        "ALL",
        {
          title: `${this.name} Advances their Playbook!`,
          body: `${this.name}, select a new Ability on your Character Sheet.`,
          type: BladesNoticeType.push,
          cssClasses: "advancement-alert"
        }
      );
      this.grantAdvancementPoints(AdvancementPoint.Ability);
      return;
    }
    if (this instanceof BladesCrew) {
      BladesDirector.getInstance().pushNotice_SocketCall(
        "ALL",
        {
          title: "You Advance your Crew Playbook!",
          body: "Select new Upgrades and/or Abilities on your Crew Sheet.",
          type: BladesNoticeType.push,
          cssClasses: "advancement-alert crew-advancement-alert"
        }
      );
      const coinGained = this.system.tier.value + 2;
      this.members.forEach((member) => {
        if (member.primaryUser?.id) {
          BladesDirector.getInstance().pushNotice_SocketCall(
            member.primaryUser?.id,
            {
              title: "Your Stash Increases! <em>(Crew Advancement)</em>",
              type: BladesNoticeType.push,
              body: `You gain ${coinGained} Stash from Crew Advancement.`,
              cssClasses: "stash-alert"
            }
          );
          member.addStash(coinGained);
        }
      });
      this.grantAdvancementPoints(AdvancementPoint.UpgradeOrAbility, 2);
    }
  }

  async advanceAttribute(attribute: AttributeTrait) {
    if (!(this instanceof BladesPC)) { return; }
    if (!this.primaryUser?.id) { return; }
    await this.update({[`system.experience.${attribute}.value`]: 0});
    const actions = C.Action[attribute].map((action) => `<strong>${U.tCase(action)}</strong>`);
    BladesDirector.getInstance().pushNotice_SocketCall(
      this.primaryUser.id,
      {
        title: `${this.name} Advances their ${U.uCase(attribute)}!`,
        body: `${this.name}, add a dot to one of ${U.oxfordize(actions, true, "or")}.`,
        type: BladesNoticeType.push,
        cssClasses: "advancement-alert"
      }
    );
  }

  get isAtWar(): boolean {
    if (BladesNPC.IsType(this)) { return false; }
    if (BladesPC.IsType(this)) { return this.crew?.isAtWar ?? false; }
    return Object.values(this.system.at_war_with ?? {})
      .filter((val) => val === true)
      .length > 0;
  }
  // #endregion
  // #region BladesSubActor Implementation ~

  parentActor?: BladesActor;

  get isSubActor() { return this.parentActor !== undefined; }

  // #endregion

  // #region BladesRoll Implementation ~
  get rollModsSchemaSet(): BladesRollMod.Schema[] {
    return BladesRollMod.ParseDocModsToSchemaSet(this);
  }

  get rollFactors(): Partial<Record<Factor, BladesRoll.FactorData>> {
    const factorData: Partial<Record<Factor, BladesRoll.FactorData>> = {
      [Factor.tier]: {
        name: Factor.tier,
        display: "Tier",
        value: this.getFactorTotal(Factor.tier),
        max: this.getFactorTotal(Factor.tier),
        baseVal: this.getFactorTotal(Factor.tier),
        isActive: true,
        isPrimary: true,
        isDominant: false,
        highFavorsPC: true
      },
      [Factor.quality]: {
        name: Factor.quality,
        display: "Quality",
        value: this.getFactorTotal(Factor.quality),
        max: this.getFactorTotal(Factor.quality),
        baseVal: this.getFactorTotal(Factor.quality),
        isActive: false,
        isPrimary: false,
        isDominant: false,
        highFavorsPC: true
      }
    };

    return factorData;
  }

  // #region BladesRoll.PrimaryDoc Implementation

  get rollPrimaryID() { return this.id; }

  get rollPrimaryDoc() { return this; }

  get rollPrimaryName() { return this.name; }

  get rollPrimaryType() {
    if (![BladesActorType.pc, BladesActorType.crew].includes(this.type)) {
      throw new Error(`BladesActor of type '${this.type}' ("${this.name}") cannot be RollPrimary.`);
    }
    return this.type as BladesRoll.PrimaryDocType; }

  get rollPrimaryImg() { return this.img; }

  // #endregion

  // #endregion

  // #region BladesCrew Implementation ~

  // #endregion

  // #region PREPARING DERIVED DATA ~
  override prepareDerivedData() {
    if (BladesActor.IsType(this, BladesActorType.pc)) { this._preparePCData(this.system); }
    if (BladesActor.IsType(this, BladesActorType.crew)) { this._prepareCrewData(this.system); }
  }

  _preparePCData(system: ExtractBladesActorSystem<BladesActorType.pc>) {
    if (!BladesActor.IsType(this, BladesActorType.pc)) { return; }

    // Extract experience clues from playbook item, if any
    if (this.playbook) {
      system.experience.clues = [
        ...system.experience.clues,
        ...Object.values(this.playbook.system.experience_clues)
          .filter((clue) => Boolean(clue.trim()))
      ];
    }
    // Extract gather information questions from playbook item, if any
    if (this.playbook) {
      system.gather_info = [
        ...system.gather_info,
        ...Object.values(this.playbook.system.gather_info_questions)
          .filter((question) => Boolean(question.trim()))
      ];
    }
  }

  _prepareCrewData(system: ExtractBladesActorSystem<BladesActorType.crew>) {
    if (!BladesActor.IsType(this, BladesActorType.crew)) { return; }

    // Extract experience clues and turfs from playbook item, if any
    if (this.playbook) {
      system.experience.clues = [
        ...system.experience.clues,
        ...Object.values(this.playbook.system.experience_clues)
          .filter((clue) => Boolean(clue.trim()))
      ];
      system.turfs = this.playbook.system.turfs;
    }
  }

  // #endregion

  // #region OVERRIDES: _onCreateDescendantDocuments, update ~

  // @ts-expect-error New method not defined in @league VTT types.
  override async _onCreateDescendantDocuments(parent: BladesActor, collection: "items"|"effects", docs: BladesItem[]|BladesActiveEffect[], data: BladesItem[]|BladesActiveEffect[], options: Record<string, boolean>, userId: string) {
    await Promise.all(docs.map(async (doc) => {
      if (BladesItem.IsType(doc, BladesItemType.playbook, BladesItemType.crew_playbook)) {
        await Promise.all(this.activeSubItems
          .filter((aItem) => aItem.type === doc.type && aItem.system.world_name !== doc.system.world_name)
          .map((aItem) => this.remSubItem(aItem)));
      }
    }));

    // @ts-expect-error New method not defined in @league VTT types.
    await super._onCreateDescendantDocuments(parent, collection, docs, data, options, userId);

    eLog.checkLog("actorTrigger", "_onCreateDescendantDocuments", {parent, collection, docs, data, options, userId});

    docs.forEach((doc) => {
      if (BladesItem.IsType(doc, BladesItemType.vice) && BladesActor.IsType(this, BladesActorType.pc)) {
        this.activeSubActors
          .filter((subActor) => subActor.hasTag(Tag.NPC.VicePurveyor) && !subActor.hasTag(doc.name as Vice))
          .forEach((subActor) => { this.remSubActor(subActor); });
      }
    });
  }

  override async update(
    updateData: Record<string, unknown> | undefined,
    context?: (DocumentModificationContext & MergeObjectOptions) | undefined,
    isSkippingSubActorCheck = false): Promise<this & BladesActor|undefined> {
    if (!updateData) { return super.update(updateData); }
    if (BladesActor.IsType(this, BladesActorType.crew)) {
      if (!this.playbook) { return undefined; }

      eLog.checkLog("actorTrigger", "Updating Crew", {updateData});
      const playbookUpdateData: Partial<ItemDataConstructorData> = Object.fromEntries(
        Object.entries(flattenObject(updateData))
          .filter(([key, _]: [string, unknown]) => key.startsWith("system.turfs."))
      );
      updateData = Object.fromEntries(Object.entries(flattenObject(updateData))
        .filter(([key, _]: [string, unknown]) => !key.startsWith("system.turfs.")));
      eLog.checkLog("actorTrigger", "Updating Crew", {crewUpdateData: updateData, playbookUpdateData});

      const diffPlaybookData = diffObject(
        flattenObject(this.playbook),
        playbookUpdateData
      ) as Record<string, Record<string, string>> & {_id?: string};
      delete diffPlaybookData._id;

      if (!U.isEmpty(diffPlaybookData)) {
        await this.playbook.update(playbookUpdateData, context)
          .then(() => this.sheet?.render(false));
      }
    } else if (
      (BladesActor.IsType(this, BladesActorType.npc)
      || BladesActor.IsType(this, BladesActorType.faction))
      && this.parentActor
      && !isSkippingSubActorCheck) {
      // This is an embedded Actor: Update it as a subActor of parentActor.
      return this.parentActor.updateSubActor(this.id, updateData as List<FullPartial<Partial<BladesActorSystem>>>)
        .then(() => this);
    }

    return super.update(updateData, context);
  }

  // #endregion

  // #region Rolling Dice ~

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
      if (i >= 0) { plus = "+"; }
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
    if (!BladesActor.IsType(this, BladesActorType.npc)) { return; }
    const titleChance = 0.05;
    const suffixChance = 0.01;

    const {persona, secret, random} = this.system;

    /**
     * Returns a random element from an array, optionally excluding all values
     * passed as subsequent parameters.
     * @param {string[]} arr The array to randomly select from.
     * @param {...string} curVals The values to exclude from the sample.
     */
    function sampleArray(arr: string[], ...curVals: string[]): string {
      arr = arr.filter((elem) => !curVals.includes(elem));
      if (!arr.length) { return ""; }
      return arr[Math.floor(Math.random() * arr.length)];
    }
    const randomGen: Record<string, (gender?: string) => string> = {
      name: (gen?: string) => {
        return [
          Math.random() <= titleChance
            ? sampleArray(Randomizers.NPC.name_title)
            : "",
          sampleArray([
            ...((gen ?? "").charAt(0).toLowerCase() !== "m" ? Randomizers.NPC.name_first.female : []),
            ...((gen ?? "").charAt(0).toLowerCase() !== "f" ? Randomizers.NPC.name_first.male : [])
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
      gender: () => sampleArray(Randomizers.NPC.gender, persona.gender.value) as Gender,
      appearance: () => sampleArray(Randomizers.NPC.appearance, persona.appearance.value),
      goal: () => sampleArray(Randomizers.NPC.goal, persona.goal.value, secret.goal.value),
      method: () => sampleArray(Randomizers.NPC.method, persona.method.value, secret.method.value),
      trait: () => sampleArray(
        Randomizers.NPC.trait,
        persona.trait1.value,
        persona.trait2.value,
        persona.trait3.value,
        secret.trait.value
      ),
      interests: () => sampleArray(Randomizers.NPC.interests, persona.interests.value, secret.interests.value),
      quirk: () => sampleArray(Randomizers.NPC.quirk, persona.quirk.value),
      style: (gen = "") => sampleArray([
        ...(gen.charAt(0).toLowerCase() !== "m" ? Randomizers.NPC.style.female : []),
        ...(gen.charAt(0).toLowerCase() !== "f" ? Randomizers.NPC.style.male : [])
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
            value: randomVal || random[key].value
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
            : sampleArray(
              Randomizers.NPC.trait,
              persona.trait1.value,
              persona.trait2.value,
              persona.trait3.value,
              secret.trait.value
            );
          const trait2 = persona.trait2.isLocked
            ? persona.trait2.value
            : sampleArray(
              Randomizers.NPC.trait,
              trait1,
              persona.trait1.value,
              persona.trait2.value,
              persona.trait3.value,
              secret.trait.value
            );
          const trait3 = persona.trait3.isLocked
            ? persona.trait3.value
            : sampleArray(
              Randomizers.NPC.trait,
              trait1,
              trait2,
              persona.trait1.value,
              persona.trait2.value,
              persona.trait3.value,
              secret.trait.value
            );
          const secretTrait = secret.trait.isLocked
            ? secret.trait.value
            : sampleArray(
              Randomizers.NPC.trait,
              trait1,
              trait2,
              trait3,
              persona.trait1.value,
              persona.trait2.value,
              persona.trait3.value,
              secret.trait.value
            );
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

  // Unlock lower-level update method for subclasses
  public async callOnUpdate(...args: Parameters<typeof BladesActor.prototype._onUpdate>) {
    await this._onUpdate(...args);
  }
}

declare interface BladesActor {
  get id(): IDString;
  get uuid(): UUIDString;
  get name(): string;
  get img(): string;
  get type(): BladesActorType;
  get items(): EmbeddedCollection<typeof BladesItem, ActorData>;
  get flags(): Record<string, unknown>;
  system: BladesActorSystem,
  getRollData(): BladesActorRollData;
  parent: TokenDocument | null;
  ownership: Record<string, ValOf<typeof CONST.DOCUMENT_PERMISSION_LEVELS>>;
  _source: BladesActor;
}

export default BladesActor;
