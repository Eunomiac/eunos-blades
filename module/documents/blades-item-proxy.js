/* ****▌███████████████████████████████████████████████████████████████████████████▐**** *\
|*     ▌████░░░░░░░░░░░ Euno's Blades in the Dark for Foundry VTT ░░░░░░░░░░░░░████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░ by Eunomiac ░░░░░░░░░░░░░██████████████████▐     *|
|*     ▌████████████████████████████  License █ v0.1.0 ████████████████████████████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░░░░░░  ░░░░░░░░░░░░░░░░░░███████████████████▐     *|
\* ****▌███████████████████████████████████████████████████████████████████████████▐**** */

import U from "../core/utilities.js";
import { BladesItemType } from "../core/constants.js";
import BladesItem from "../blades-item.js";
import BladesLocation from "./items/blades-location.js";
import BladesClockKeeper from "./items/blades-clock-keeper.js";
import BladesGMTracker from "./items/blades-gm-tracker.js";
import BladesScore from "./items/blades-score.js";
const ItemsMap = {
    [BladesItemType.clock_keeper]: BladesClockKeeper,
    [BladesItemType.gm_tracker]: BladesGMTracker,
    [BladesItemType.location]: BladesLocation,
    [BladesItemType.score]: BladesScore
};
const BladesItemProxy = new Proxy(function () { }, {
    construct: function (target, args) {
        const [data] = args;
        if (!ItemsMap[data.type]) {
            return new BladesItem(...args);
        }
        return new ItemsMap[data.type](...args);
    },
    get: function (target, prop) {
        switch (prop) {
            case "create":
            case "createDocuments":
                return function (data, options = {}) {
                    if (U.isArray(data)) {
                        return data.map((i) => CONFIG.Item.documentClass.create(i, options));
                    }
                    if (!ItemsMap[data.type]) {
                        return BladesItem.create(data, options);
                    }
                    return ItemsMap[data.type].create(data, options);
                };
            case Symbol.hasInstance:
                return function (instance) {
                    return Object.values(ItemsMap).some((i) => instance instanceof i);
                };
            default:
                return BladesItem[prop];
        }
    }
});
export default BladesItemProxy;
export { BladesItem, BladesClockKeeper, BladesGMTracker, BladesLocation, BladesScore };
//# sourceMappingURL=blades-item-proxy.js.map
//# sourceMappingURL=blades-item-proxy.js.map
