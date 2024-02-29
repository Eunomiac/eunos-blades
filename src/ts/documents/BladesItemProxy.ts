import U from "../core/utilities";
import {BladesItemType} from "../core/constants";
import type {ItemDataConstructorData} from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/itemData";
import BladesItem from "../BladesItem";
import BladesProject from "./items/BladesProject";
import BladesLocation from "./items/BladesLocation";
import BladesClockKeeper from "./items/BladesClockKeeper";
import BladesGMTracker from "./items/BladesGMTracker";
import BladesScore from "./items/BladesScore";

const ItemsMap: Partial<Record<BladesItemType, typeof BladesItem>> = {
  [BladesItemType.clock_keeper]: BladesClockKeeper,
  [BladesItemType.gm_tracker]: BladesGMTracker,
  [BladesItemType.location]: BladesLocation,
  [BladesItemType.project]: BladesProject,
  [BladesItemType.score]: BladesScore
};

// eslint-disable-next-line @typescript-eslint/no-empty-function
const BladesItemProxy = new Proxy(function() {}, {

  construct(_, args: [ItemDataConstructorData]) {
    const [{type}] = args;
    if (!type) { throw new Error(`Invalid Item Type: ${String(type)}`); }
    const MappedConstructor = ItemsMap[type as BladesItemType];
    if (!MappedConstructor) {
      return new BladesItem(...args);
    }
    return new MappedConstructor(...args);
  },

  get(_, prop) {
    switch (prop) {
      case "create":
      case "createDocuments":
        return function(
          data: ItemDataConstructorData & { system?: Partial<BladesItemSystem> }
          |Array<ItemDataConstructorData & { system?: Partial<BladesItemSystem> }>,
          options = {}
        ) {
          if (U.isArray(data)) {
            return data.map((i) => CONFIG.Item.documentClass.create(i, options));
          }

          const MappedConstructor = ItemsMap[data.type as BladesItemType];
          if (!MappedConstructor) {
            return BladesItem.create(data, options);
          }
          return MappedConstructor.create(data, options);
        };
      case Symbol.hasInstance:
        return function(instance: unknown) {
          return Object.values(ItemsMap).some((i) => instance instanceof i);
        };
      default:
        return BladesItem[prop as KeyOf<typeof BladesItem>];
    }
  }

});

export default BladesItemProxy;
export {BladesItem, BladesClockKeeper, BladesGMTracker, BladesLocation, BladesProject, BladesScore};
