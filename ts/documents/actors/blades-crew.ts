import BladesItem from "../../blades-item.js";
import C, {SVGDATA, BladesActorType, Playbook, BladesItemType, Tag, BladesPhase, RollModCategory, PrereqType, Factor, RollModStatus} from "../../core/constants.js";
import U from "../../core/utilities.js";
import BladesActor from "../../blades-actor.js";
import BladesRollCollab from "../../blades-roll-collab.js";
import type {ItemDataConstructorData} from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/itemData.js";
import type {ActorData, ActorDataConstructorData} from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/actorData.js";
import MIX, {PlayableCharacterMixin} from "../../core/mixins.js";
import {BladesPC, BladesNPC, BladesFaction} from "../blades-actor-proxy.js";

class BladesCrew extends (MIX(BladesActor).with(PlayableCharacterMixin) as typeof BladesActor & typeof PlayableCharacterMixin) {

  // #region Static Overrides: Create ~
  static override async create(data: ActorDataConstructorData & { system?: Partial<BladesActorSchema.Crew> }, options = {}) {
    data.token = data.token || {};
    data.system = data.system ?? {};

    eLog.checkLog2("actor", "BladesActor.create(data,options)", {data, options});

    //~ For Crew and PC set the Token to sync with charsheet.
    data.token.actorLink = true;

    //~ Create world_name
    data.system.world_name = data.system.world_name ?? data.name.replace(/[^A-Za-z_0-9 ]/g, "").trim().replace(/ /g, "_");

    //~ Initialize generic experience clues.
    data.system.experience = {
      playbook: {value: 0, max: 8},
      clues: [],
      ...data.system.experience ?? {}
    } as BladesActorSchema.Crew["experience"];


    return super.create(data, options);
  }
  // #endregion


  get abilities(): BladesItem[] {
    if (!this.playbook) { return [] }
    return this.activeSubItems.filter((item: BladesItem) => [BladesItemType.ability, BladesItemType.crew_ability].includes(item.type));
  }

  get playbookName() {
    return this.playbook?.name as (BladesTag & Playbook) | undefined;
  }
  get playbook(): BladesItemOfType<BladesItemType.crew_playbook>|undefined {
    return this.activeSubItems.find((item: BladesItem): item is BladesItemOfType<BladesItemType.crew_playbook> => item.type === BladesItemType.crew_playbook);
  }

  get members(): BladesPC[] {
    if (!BladesActor.IsType(this, BladesActorType.crew)) { return [] }
    const self = this as BladesCrew;
    return BladesActor.GetTypeWithTags(BladesActorType.pc).filter((actor): actor is BladesPC => actor.isMember(self));
  }
  get contacts(): Array<BladesNPC|BladesFaction> {
    if (!BladesActor.IsType(this, BladesActorType.crew) || !this.playbook) { return [] }
    const self: BladesCrew = this as BladesCrew;
    return this.activeSubActors.filter((actor: BladesActorOfType): actor is BladesNPC|BladesFaction => actor.hasTag(self.playbookName));
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
    return this.activeSubItems.filter((item: BladesItem): item is BladesItemOfType<BladesItemType.crew_upgrade> => item.type === BladesItemType.crew_upgrade);
  }
  get cohorts(): Array<BladesItemOfType<BladesItemType.cohort_gang|BladesItemType.cohort_expert>> {
    return this.activeSubItems.filter((item: BladesItem): item is BladesItemOfType<BladesItemType.cohort_gang|BladesItemType.cohort_expert> => [BladesItemType.cohort_gang, BladesItemType.cohort_expert].includes(item.type));
  }

  getTaggedItemBonuses(tags: BladesTag[]): number {
    // Check ACTIVE EFFECTS supplied by upgrade/ability against submitted tags?
    return 0;
  }

}

declare interface BladesCrew {
  type: BladesActorType.crew,
  system: BladesActorSchema.Crew
}

export default BladesCrew;