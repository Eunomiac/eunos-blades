import U from "../core/utilities";
import {BladesActorType} from "../core/constants";
import type {ActorDataConstructorData} from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/actorData";
import BladesActor from "../BladesActor";
import BladesPC from "./actors/BladesPC";
import BladesNPC from "./actors/BladesNPC";
import BladesFaction from "./actors/BladesFaction";
import BladesCrew from "./actors/BladesCrew";

const ActorsMap: Partial<Record<BladesActorType, typeof BladesActor>> = {
  [BladesActorType.pc]:      BladesPC,
  [BladesActorType.npc]:     BladesNPC,
  [BladesActorType.faction]: BladesFaction,
  [BladesActorType.crew]:    BladesCrew

};

// eslint-disable-next-line @typescript-eslint/no-empty-function
const BladesActorProxy = new Proxy(function() {}, {

  construct(_, args: [ActorDataConstructorData]) {
    const [{type}] = args;
    if (!type) { throw new Error(`Invalid Actor Type: ${String(type)}`); }
    const MappedConstructor = ActorsMap[type as BladesActorType];
    if (!MappedConstructor) {
      return new BladesActor(...args);
    }
    return new MappedConstructor(...args);
  },

  get(_, prop) {
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

          const MappedConstructor = ActorsMap[data.type as BladesActorType];
          if (!MappedConstructor) {
            return BladesActor.create(data, options);
          }
          return MappedConstructor.create(data, options);
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
