import U from "../core/utilities.js";
import { BladesActorType } from "../core/constants.js";
import BladesActor from "../BladesActor.js";
import BladesPC from "./actors/BladesPC.js";
import BladesNPC from "./actors/BladesNPC.js";
import BladesFaction from "./actors/BladesFaction.js";
import BladesCrew from "./actors/BladesCrew.js";
/*~ @@DOUBLE-BLANK@@ ~*/
const ActorsMap = {
    [BladesActorType.pc]: BladesPC,
    [BladesActorType.npc]: BladesNPC,
    [BladesActorType.faction]: BladesFaction,
    [BladesActorType.crew]: BladesCrew
    /*~ @@DOUBLE-BLANK@@ ~*/
};
/*~ @@DOUBLE-BLANK@@ ~*/
// eslint-disable-next-line @typescript-eslint/no-empty-function
const BladesActorProxy = new Proxy(function () { }, {
    /*~ @@DOUBLE-BLANK@@ ~*/
    construct(_, args) {
        const [{ type }] = args;
        if (!type) {
            throw new Error(`Invalid Actor Type: ${String(type)}`);
        }
        const MappedConstructor = ActorsMap[type];
        if (!MappedConstructor) {
            return new BladesActor(...args);
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
                        return data.map((i) => CONFIG.Actor.documentClass.create(i, options));
                    }
                    /*~ @@DOUBLE-BLANK@@ ~*/
                    const MappedConstructor = ActorsMap[data.type];
                    if (!MappedConstructor) {
                        return BladesActor.create(data, options);
                    }
                    return MappedConstructor.create(data, options);
                };
            case Symbol.hasInstance:
                return function (instance) {
                    return Object.values(ActorsMap).some((i) => instance instanceof i);
                };
            default:
                return BladesActor[prop];
        }
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
});
/*~ @@DOUBLE-BLANK@@ ~*/
export default BladesActorProxy;
export { BladesActor, BladesPC, BladesCrew, BladesNPC, BladesFaction };
