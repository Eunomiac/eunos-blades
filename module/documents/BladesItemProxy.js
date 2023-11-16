import U from "../core/utilities.js";
import { BladesItemType } from "../core/constants.js";
import BladesItem from "../BladesItem.js";
import BladesLocation from "./items/BladesLocation.js";
import BladesClockKeeper from "./items/BladesClockKeeper.js";
import BladesGMTracker from "./items/BladesGMTracker.js";
import BladesScore from "./items/BladesScore.js";
/*~ @@DOUBLE-BLANK@@ ~*/
const ItemsMap = {
    [BladesItemType.clock_keeper]: BladesClockKeeper,
    [BladesItemType.gm_tracker]: BladesGMTracker,
    [BladesItemType.location]: BladesLocation,
    [BladesItemType.score]: BladesScore
};
/*~ @@DOUBLE-BLANK@@ ~*/
// eslint-disable-next-line @typescript-eslint/no-empty-function
const BladesItemProxy = new Proxy(function () { }, {
    /*~ @@DOUBLE-BLANK@@ ~*/
    construct(_, args) {
        const [{ type }] = args;
        if (!type) {
            throw new Error(`Invalid Item Type: ${String(type)}`);
        }
        const MappedConstructor = ItemsMap[type];
        if (!MappedConstructor) {
            return new BladesItem(...args);
        }
        return new MappedConstructor(...args);
    },
    /*~ @@DOUBLE-BLANK@@ ~*/
    get(_, prop) {
        switch (prop) {
            case "create":
            case "createDocuments":
                return function (data, options = {}) {
                    if (U.isArray(data)) {
                        return data.map((i) => CONFIG.Item.documentClass.create(i, options));
                    }
                    /*~ @@DOUBLE-BLANK@@ ~*/
                    const MappedConstructor = ItemsMap[data.type];
                    if (!MappedConstructor) {
                        return BladesItem.create(data, options);
                    }
                    return MappedConstructor.create(data, options);
                };
            case Symbol.hasInstance:
                return function (instance) {
                    return Object.values(ItemsMap).some((i) => instance instanceof i);
                };
            default:
                return BladesItem[prop];
        }
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
});
/*~ @@DOUBLE-BLANK@@ ~*/
export default BladesItemProxy;
export { BladesItem, BladesClockKeeper, BladesGMTracker, BladesLocation, BladesScore };
