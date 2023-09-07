import BladesItem from "../../blades-item.js";
import C, {SVGDATA, BladesActorType, BladesItemType, Tag, BladesPhase, RollModCategory, PrereqType, Factor, RollModStatus} from "../../core/constants.js";
import U from "../../core/utilities.js";
import BladesActor from "../../blades-actor.js";
import BladesRollCollab from "../../blades-roll-collab.js";
import type {ItemDataConstructorData} from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/itemData.js";
import type {ActorData, ActorDataConstructorData} from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/actorData.js";

import MIX, {PlayableCharacterMixin} from "../../core/mixins.js";

class BladesNPC extends (MIX(BladesActor).with(PlayableCharacterMixin) as typeof BladesActor & typeof PlayableCharacterMixin) {

}

declare interface BladesNPC {
  type: BladesActorType.npc,
  system: BladesActorSchema.NPC
}

export default BladesNPC;