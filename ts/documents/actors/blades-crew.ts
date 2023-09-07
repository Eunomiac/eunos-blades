import BladesItem from "../../blades-item.js";
import C, {SVGDATA, BladesActorType, Playbook, BladesItemType, Tag, BladesPhase, RollModCategory, PrereqType, Factor, RollModStatus} from "../../core/constants.js";
import U from "../../core/utilities.js";
import BladesActor from "../../blades-actor.js";
import BladesRollCollab from "../../blades-roll-collab.js";
import type {ItemDataConstructorData} from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/itemData.js";
import type {ActorData, ActorDataConstructorData} from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/actorData.js";

class BladesCrew extends BladesActor implements BladesActorSubClass.Crew {

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
    return this.activeSubItems.filter((item) => [BladesItemType.ability, BladesItemType.crew_ability].includes(item.type));
  }

  get playbookName() {
    return this.playbook?.name as (BladesTag & Playbook) | undefined;
  }
  get playbook(): BladesItemOfType<BladesItemType.crew_playbook>|undefined {
    return this.activeSubItems.find((item): item is BladesItemOfType<BladesItemType.crew_playbook> => item.type === BladesItemType.crew_playbook);
  }

}

declare interface BladesCrew {
  type: BladesActorType.crew,
  system: BladesActorSchema.Crew
}

export default BladesCrew;