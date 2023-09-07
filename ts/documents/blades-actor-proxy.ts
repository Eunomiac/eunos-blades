import U from "../core/utilities.js";
import {BladesActorType} from "../core/constants.js";
import type {ActorDataConstructorData} from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/actorData.js";
import BladesActor from "../blades-actor.js";
import BladesPC from "./actors/blades-pc.js";
import BladesNPC from "./actors/blades-npc.js";
import BladesFaction from "./actors/blades-faction.js";
import BladesCrew from "./actors/blades-crew.js";

const ActorsMap: Partial<Record<BladesActorType,typeof BladesActor>> = {
  [BladesActorType.pc]: BladesPC,
  [BladesActorType.npc]: BladesNPC,
  [BladesActorType.faction]: BladesFaction,
  [BladesActorType.crew]: BladesCrew

};

// eslint-disable-next-line @typescript-eslint/no-empty-function
const BladesActorProxy = new Proxy(function() {}, {

  construct: function(target, args: any[]) {
    const [data] = args;

    if (!ActorsMap[data.type as BladesActorType]) {
      return new BladesActor(...args as [ActorDataConstructorData]);
    }

    return new ActorsMap[data.type as BladesActorType]!(...args as [ActorDataConstructorData]);
  },

  get: function(target, prop) {
    switch (prop) {
      case "create":
      case "createDocuments":
        return function(
          data: ActorDataConstructorData & { system?: Partial<BladesActorSystem> }
          |Array<ActorDataConstructorData & { system?: Partial<BladesActorSystem> }>,
          options = {}
        ) {
          if (U.isArray(data)) {
            return data.map((i) => CONFIG.Actor.documentClass.create(i, options));
          }

          if (!ActorsMap[data.type as BladesActorType]) {
            return BladesActor.create(data, options);
          }

          return ActorsMap[data.type as BladesActorType]!.create(data, options);
        };
      case Symbol.hasInstance:
        return function(instance: unknown) {
          return Object.values(ActorsMap).some((i) => instance instanceof i);
        };
      default:
        return BladesActor[prop as KeyOf<typeof BladesActor>];
    }
  }

});

export default BladesActorProxy;
export {BladesActor, BladesPC, BladesCrew, BladesNPC, BladesFaction};