import BladesItem from "../../BladesItem";
import {BladesActorType, Playbook, BladesItemType} from "../../core/constants";
import BladesActor from "../../BladesActor";
import BladesRoll from "../../BladesRoll";
import type {ActorDataConstructorData} from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/actorData";

class BladesCrew extends BladesActor implements BladesActorSubClass.Crew,
  BladesRoll.PrimaryDocData,
  BladesRoll.ParticipantDocData {

  // #region Static Overrides: Create ~
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
