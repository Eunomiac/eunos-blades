/* ****▌███████████████████████████████████████████████████████████████████████████▐**** *\
|*     ▌████░░░░░░░░░░░ Euno's Blades in the Dark for Foundry VTT ░░░░░░░░░░░░░████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░ by Eunomiac ░░░░░░░░░░░░░██████████████████▐     *|
|*     ▌████████████████████████████  License █ v0.1.0 ████████████████████████████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░░░░░░  ░░░░░░░░░░░░░░░░░░███████████████████▐     *|
\* ****▌███████████████████████████████████████████████████████████████████████████▐**** */

import U from "../core/utilities.js";
import { BladesActorType } from "../core/constants.js";
import BladesActor from "../blades-actor.js";
import BladesPC from "./actors/blades-pc.js";
import BladesNPC from "./actors/blades-npc.js";
import BladesFaction from "./actors/blades-faction.js";
import BladesCrew from "./actors/blades-crew.js";
const ActorsMap = {
    [BladesActorType.pc]: BladesPC,
    [BladesActorType.npc]: BladesNPC,
    [BladesActorType.faction]: BladesFaction,
    [BladesActorType.crew]: BladesCrew
};
const BladesActorProxy = new Proxy(function () { }, {
    construct: function (target, args) {
        const [data] = args;
        if (!ActorsMap[data.type]) {
            return new BladesActor(...args);
        }
        return new ActorsMap[data.type](...args);
    },
    get: function (target, prop) {
        switch (prop) {
            case "create":
            case "createDocuments":
                return function (data, options = {}) {
                    if (U.isArray(data)) {
                        return data.map((i) => CONFIG.Actor.documentClass.create(i, options));
                    }
                    if (!ActorsMap[data.type]) {
                        return BladesActor.create(data, options);
                    }
                    return ActorsMap[data.type].create(data, options);
                };
            case Symbol.hasInstance:
                return function (instance) {
                    return Object.values(ActorsMap).some((i) => instance instanceof i);
                };
            default:
                return BladesActor[prop];
        }
    }
});
export default BladesActorProxy;
export { BladesActor, BladesPC, BladesCrew, BladesNPC, BladesFaction };