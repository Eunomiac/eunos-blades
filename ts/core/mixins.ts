import U from "./utilities.js";
import C, {BladesActorType, BladesPhase, Vice, Tag, District, Playbook, BladesItemType, Attribute, Action, InsightActions, ProwessActions, ResolveActions, PrereqType, Position, Effect, AdvancementPoint, Randomizers, RollModCategory, RollModStatus, RollType, Factor, Harm} from "./constants.js";
import {SelectionCategory} from "../blades-dialog.js";
import BladesActor from "../blades-actor.js";
import BladesItem from "../blades-item.js";
import BladesPC from "../documents/actors/blades-pc.js";
import BladesCrew from "../documents/actors/blades-crew.js";
import type {ItemDataConstructorData} from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/itemData.js";

// type Constructor = new (...args: readonly any[]) => {};

// type ConstructorOf<T extends BladesActor|BladesItem> = new (...args: readonly any[]) => T;

// type ApplyMixin<T extends BladesActor|BladesItem, Superclass extends ConstructorOf<T>, MixinClass extends ConstructorOf<T>> = Superclass & MixinClass;
// type MixinType<T extends BladesActor|BladesItem, MixinClass extends ConstructorOf<T>> = <Superclass extends ConstructorOf<T>>(superclass: Superclass) => ApplyMixin<T, Superclass, MixinClass>;

// class MixinBuilder<T extends BladesActor|BladesItem, Superclass extends ConstructorOf<T>> {
//   superclass: Superclass;

//   constructor(superclass: Superclass) { this.superclass = superclass }
//   with<Mixins extends ReadonlyArray<MixinType<T, any>>>(...mixins: Mixins): ApplyMixins<T, Superclass, Mixins> {
//     return mixins.reduce(
//       (cls, mixin = (x) => x) => mixin(cls),
//       this.superclass
//     ) as ApplyMixins<T, Superclass, Mixins>;
//   }
// }

// type ApplyMixins<
//   T extends BladesActor|BladesItem,
//   Superclass extends ConstructorOf<T>,
//   Mixins extends ReadonlyArray<MixinType<T, any>>
// > = Mixins extends [infer Mixin extends MixinType<T, any>, ...infer Rest extends ReadonlyArray<MixinType<T, any>>] ?
//   ApplyMixins<T, CalculateMixin<T, Superclass, Mixin>, Rest> :
//   Superclass;

// type CalculateMixin<
//   T extends BladesActor|BladesItem,
//   Superclass extends ConstructorOf<T>,
//   Mixin extends MixinType<T, any>
// > = (Mixin extends (superclass: Superclass) => (infer MixinClass extends ConstructorOf<T>) ? ApplyMixin<T, Superclass, MixinClass> : never)

// const MIX = <T extends BladesActor|BladesItem>(superclass: ConstructorOf<T>) => new MixinBuilder<T, ConstructorOf<T>>(superclass);

type ConstructorOf<T extends BladesActor|BladesItem> = new (...args: readonly any[]) => T;

type ApplyMixin<T extends BladesActor|BladesItem, Superclass extends ConstructorOf<T>, MixinClass extends ConstructorOf<T>> = Superclass & MixinClass;
type MixinType<T extends BladesActor|BladesItem, MixinClass extends ConstructorOf<T>> = <Superclass extends ConstructorOf<T>>(superclass: Superclass) => ApplyMixin<T, Superclass, MixinClass>;

class MixinBuilder<T extends BladesActor|BladesItem, Superclass extends ConstructorOf<T>> {
  superclass: Superclass;

  constructor(superclass: Superclass) { this.superclass = superclass }
  with<Mixins extends ReadonlyArray<MixinType<T, any>>>(...mixins: Mixins): ApplyMixins<T, Superclass, Mixins> {
    return mixins.reduce(
      (cls, mixin = (x) => x) => mixin(cls),
      this.superclass
    ) as ApplyMixins<T, Superclass, Mixins>;
  }
}

type ApplyMixins<
  T extends BladesActor|BladesItem,
  Superclass extends ConstructorOf<T>,
  Mixins extends ReadonlyArray<MixinType<T, any>>
> = Mixins extends [infer Mixin extends MixinType<T, any>, ...infer Rest extends ReadonlyArray<MixinType<T, any>>] ?
  ApplyMixins<T, CalculateMixin<T, Superclass, Mixin>, Rest> :
  Superclass;

type CalculateMixin<
  T extends BladesActor|BladesItem,
  Superclass extends ConstructorOf<T>,
  Mixin extends MixinType<T, any>
> = (Mixin extends (superclass: Superclass) => (infer MixinClass extends ConstructorOf<T>) ? ApplyMixin<T, Superclass, MixinClass> : never)

const MIX = <T extends BladesActor|BladesItem>(superclass: ConstructorOf<T>) => new MixinBuilder<T, ConstructorOf<T>>(superclass);

export const PlayableCharacterMixin = (superclass: ConstructorOf<BladesActor>) => class extends superclass {

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
      "CharacterCrew" = Tag.PC.CharacterCrew,
      "VicePurveyor" = Tag.NPC.VicePurveyor
    }
    let focusSubActor: BladesActor | undefined;

    // Does an embedded subActor of this BladesActor already exist on the character?
    if (this.hasSubActorOf(actorRef)) {
      const subActor = this.getSubActor(actorRef);
      if (!subActor) { return }
      // Is it an archived BladesItem?
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

    // Does this BladesActor contain any tags limiting it to one per actor?
    const uniqueTags = focusSubActor.tags.filter((tag: BladesTag) => tag in BladesActorUniqueTags);
    if (uniqueTags.length > 0) {
      // ... then archive all other versions.
      uniqueTags.forEach((uTag: BladesTag) => this.activeSubActors
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
    actor.parentActor = this as BladesActor;
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
      // if (subActor.parentActor?.id === this.id && subActor.clearParentActor) { subActor.clearParentActor(isReRendering) }
    });
    this.sheet?.render();
  }

  async clearParentActor(isReRendering = true): Promise<void> {
    const {parentActor} = this;
    if (!parentActor) { return }
    this.parentActor = undefined;
    this.system = this._source.system;
    this.ownership = this._source.ownership;
    // parentActor.update({[`system.subactors.storage.${this.id}`]: null});
    this.prepareData();
    if (isReRendering) {
      this.sheet?.render();
    }
  }

  parentActor?: BladesActor;
  get isSubActor() { return this.parentActor !== undefined }


  get subItems() { return Array.from(this.items) }
  get activeSubItems() { return this.items.filter((item) => !item.hasTag(Tag.System.Archived)) }
  get archivedSubItems() { return this.items.filter((item) => item.hasTag(Tag.System.Archived)) }

  private _checkItemPrereqs(item: BladesItem): boolean {
    if (!item.system.prereqs) { return true }
    for (let [pType, pReqs] of Object.entries(item.system.prereqs as Partial<Record<PrereqType, boolean | string | string[]>>)) {
      pReqs = Array.isArray(pReqs) ? pReqs : [pReqs.toString()];
      const hitRecord: Partial<Record<PrereqType, string[]>> = {};
      while (pReqs.length) {
        const pString = pReqs.pop()!;
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
        if (!BladesActor.IsType(this, BladesActorType.pc) || this.playbookName === null) { return false }
        const gearItems = this._processEmbeddedItemMatches([
          ...BladesItem.GetTypeWithTags(BladesItemType.gear, this.playbookName),
          ...BladesItem.GetTypeWithTags(BladesItemType.gear, Tag.Gear.General)
        ])
          .filter((item) => this.remainingLoad >= item.system.load);

        // Two tabs, one for playbook and the other for general items
        dialogData[this.playbookName] = gearItems.filter((item) => item.hasTag(this.playbookName));
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
          if (this.playbookName === null) { return false }
          dialogData[this.playbookName] = this._processEmbeddedItemMatches(BladesItem.GetTypeWithTags(BladesItemType.ability, this.playbookName));
          dialogData.Veteran = this._processEmbeddedItemMatches(BladesItem.GetTypeWithTags(BladesItemType.ability))
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

    enum ItemUniqueTypes {
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
    // eLog.checkLog3("subitems", "[addSubItem] embeddedItem", embeddedItem);

    if (embeddedItem) {

      // Is it an archived BladesItem?
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
      ItemUniqueTypes: Object.values(ItemUniqueTypes),
      focusBladesItemType: focusItem.type,
      isLimited: Object.values(ItemUniqueTypes).includes(focusItem.type as any)
    });

    // Is this item type limited to one per actor?
    if (Object.values(ItemUniqueTypes).includes(focusItem.type as any)) {
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
};

export default MIX;