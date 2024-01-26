
/* eslint-disable @typescript-eslint/no-unused-vars */

import {BladesActorType, Playbook, BladesItemType, Tag} from "../../core/constants";
import {BladesActor, BladesPC, BladesNPC, BladesFaction} from "../BladesActorProxy";
import BladesCrewSheet from "../../sheets/actor/BladesCrewSheet";
import {BladesItem} from "../BladesItemProxy";
import BladesRoll from "../../classes/BladesRoll";
import {SelectionCategory} from "../../classes/BladesDialog";
import type {ActorDataConstructorData} from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/actorData";

class BladesCrew extends BladesActor implements BladesActorSubClass.Crew,
  BladesRoll.PrimaryDocData,
  BladesRoll.ParticipantDocData {

  // #region INITIALIZATION ~
  static async Initialize() {
    Object.assign(globalThis, {BladesCrew, BladesCrewSheet});
    Actors.registerSheet("blades", BladesCrewSheet, {types: ["crew"], makeDefault: true});
    return loadTemplates(["systems/eunos-blades/templates/crew-sheet.hbs"]);
  }
  // #endregion

  // #region Static Overrides: Create ~
  static override IsType<T extends BladesActorType = BladesActorType.crew>(doc: unknown): doc is BladesActorOfType<T> {
    return super.IsType(doc, BladesActorType.crew);
  }

  static GetFromUser(userRef: unknown): BladesCrew|undefined {
    const actor = BladesPC.GetFromUser(userRef);
    if (!actor) { return undefined; }
    return actor.crew;
  }

  static GetFromPC(pcRef: unknown): BladesCrew|undefined {
    let actor: unknown;
    if (typeof pcRef === "string") {
      actor = game.actors.get(pcRef) ?? game.actors.getName(pcRef);
    } else if (pcRef instanceof BladesPC) {
      actor = pcRef;
    } else {
      actor ??= BladesPC.GetFromUser(pcRef);
    }

    if (!BladesPC.IsType(actor)) { throw new Error(`Unable to find BladesPC from '${pcRef}'`); }

    return actor.crew;
  }


  static override async create(
    data: ActorDataConstructorData & {system?: Partial<BladesActorSchema.Crew>},
    options = {}
  ) {
    data.token = data.token || {};
    data.system = data.system ?? {};

    eLog.checkLog2("actor", "BladesActor.create(data,options)", {data, options});

    // ~ For Crew and PC set the Token to sync with charsheet.
    data.token.actorLink = true;

    // ~ Create world_name
    data.system.world_name = data.system.world_name ?? data.name.replace(/[^A-Za-z_0-9 ]/g, "").trim().replace(/ /g, "_");

    // ~ Initialize generic experience clues.
    data.system.experience = {
      playbook: {value: 0, max: 8},
      clues: [],
      ...data.system.experience ?? {}
    } as BladesActorSchema.Crew["experience"];


    return super.create(data, options);
  }
  // #endregion

  // #region BladesCrew Implementation

  getDialogItems(category: SelectionCategory): Record<string, BladesItem[]> {
    const dialogData: Record<string, BladesItem[]> = {};
    const {playbookName} = this;

    if (category === SelectionCategory.Playbook) {
      dialogData.Main = this._processEmbeddedItemMatches(BladesItem.GetTypeWithTags(BladesItemType.crew_playbook));
    } else if (category === SelectionCategory.Reputation) {
      dialogData.Main = this._processEmbeddedItemMatches(BladesItem.GetTypeWithTags(BladesItemType.crew_reputation));
    } else if (category === SelectionCategory.Preferred_Op && playbookName !== null) {
      dialogData.Main = this._processEmbeddedItemMatches(
        BladesItem.GetTypeWithTags(BladesItemType.preferred_op, playbookName)
      );
    } else if (category === SelectionCategory.Ability) {
      dialogData.Main = this._processEmbeddedItemMatches(
        BladesItem.GetTypeWithTags(BladesItemType.crew_ability, this.playbookName)
      );
    } else if (category === SelectionCategory.Upgrade && playbookName !== null) {
      dialogData[playbookName] = this._processEmbeddedItemMatches(
        BladesItem.GetTypeWithTags(BladesItemType.crew_upgrade, playbookName)
      );
      dialogData.General = this._processEmbeddedItemMatches(
        BladesItem.GetTypeWithTags(BladesItemType.crew_upgrade, Tag.Gear.General)
      );
    }

    return dialogData;
  }

  get members(): BladesPC[] {
    if (!BladesActor.IsType(this, BladesActorType.crew)) { return []; }
    const self = this as BladesCrew;
    return BladesActor.GetTypeWithTags(BladesActorType.pc).filter((actor): actor is BladesPC => actor.isMember(self));
  }

  get contacts(): Array<BladesNPC|BladesFaction> {
    if (!BladesActor.IsType(this, BladesActorType.crew) || !this.playbook) { return []; }
    const self: BladesCrew = this as BladesCrew;
    return this.activeSubActors.filter((actor): actor is BladesNPC|BladesFaction => actor.hasTag(self.playbookName));
  }

  get claims(): Record<number, BladesClaimData> {
    if (!BladesActor.IsType(this, BladesActorType.crew) || !this.playbook) { return {}; }
    return this.playbook.system.turfs;
  }

  get turfCount(): number {
    if (!BladesActor.IsType(this, BladesActorType.crew) || !this.playbook) { return 0; }
    return Object.values(this.playbook.system.turfs)
      .filter((claim) => claim.isTurf && claim.value).length;
  }

  get upgrades(): Array<BladesItemOfType<BladesItemType.crew_upgrade>> {
    if (!BladesActor.IsType(this, BladesActorType.crew) || !this.playbook) { return []; }
    return this.activeSubItems
      .filter((item): item is BladesItemOfType<BladesItemType.crew_upgrade> =>
        item.type === BladesItemType.crew_upgrade);
  }

  get cohorts(): Array<BladesItemOfType<BladesItemType.cohort_gang|BladesItemType.cohort_expert>> {
    return this.activeSubItems
      .filter((item): item is BladesItemOfType<BladesItemType.cohort_gang|BladesItemType.cohort_expert> =>
        [BladesItemType.cohort_gang, BladesItemType.cohort_expert].includes(item.type));
  }

  getTaggedItemBonuses(tags: BladesTag[]): number {
    // Given a list of item tags, will return the total bonuses to that item
    // Won't return a number, but an object literal that includes things like extra load space or concealability
    // Check ACTIVE EFFECTS supplied by upgrade/ability against submitted tags?
    return tags.length; // Placeholder to avoid linter error
  }
  // #endregion

  // #region BladesRoll Implementation

  // #region BladesRoll.ParticipantDoc Implementation
  get rollParticipantID() {return this.id;}

  get rollParticipantDoc() {return this;}

  get rollParticipantIcon() {return this.playbook?.img ?? this.img;}

  get rollParticipantName() {return this.name;}

  get rollParticipantType() {return this.type;}

  get rollParticipantModsData(): BladesRollMod.Schema[] {return [];}

  async applyHarm(_amount: number, _name: string) {
    console.error("Attempt to apply harm directly to a Crew document.");
  }

  async applyWorsePosition() {
    console.error("Attempt to apply worse position directly to a Crew document.");

  }
  // #endregion

  // #endregion


  get abilities(): BladesItem[] {
    if (!this.playbook) {return [];}
    return this.activeSubItems
      .filter((item) => [BladesItemType.ability, BladesItemType.crew_ability].includes(item.type));
  }

  get playbookName() {
    return this.playbook?.name as (BladesTag & Playbook) | undefined;
  }

  get playbook(): BladesItemOfType<BladesItemType.crew_playbook> | undefined {
    return this.activeSubItems
      .find((item): item is BladesItemOfType<BladesItemType.crew_playbook> =>
        item.type === BladesItemType.crew_playbook);
  }

}

declare interface BladesCrew {
  type: BladesActorType.crew,
  system: BladesActorSchema.Crew
}

export default BladesCrew;
