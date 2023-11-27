
import {BladesActorType, Playbook, BladesItemType} from "../../core/constants";
import {BladesActor, BladesPC} from "../BladesActorProxy";
import {BladesItem} from "../BladesItemProxy";
import BladesRoll from "../../BladesRoll";
import type {ActorDataConstructorData} from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/actorData";

class BladesCrew extends BladesActor implements BladesActorSubClass.Crew,
  BladesRoll.PrimaryDocData,
  BladesRoll.ParticipantDocData {

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


  // #region BladesRoll Implementation

  // #region BladesRoll.ParticipantDoc Implementation
  get rollParticipantID() {return this.id;}

  get rollParticipantDoc() {return this;}

  get rollParticipantIcon() {return this.playbook?.img ?? this.img;}

  get rollParticipantName() {return this.name;}

  get rollParticipantType() {return this.type;}

  get rollParticipantModsData(): BladesRoll.RollModData[] {return [];}

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
