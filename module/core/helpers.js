/* ****▌███████████████████████████████████████████████████████████████████████████▐**** *\
|*     ▌████░░░░░░░░░░░ Euno's Blades in the Dark for Foundry VTT ░░░░░░░░░░░░░████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░ by Eunomiac ░░░░░░░░░░░░░██████████████████▐     *|
|*     ▌████████████████████████████  License █ v0.1.0 ████████████████████████████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░░░░░░  ░░░░░░░░░░░░░░░░░░███████████████████▐     *|
\* ****▌███████████████████████████████████████████████████████████████████████████▐**** */

import U from "./utilities.js";
const handlebarHelpers = {
    "test": function (param1, operator, param2) {
        switch (operator) {
            case "==": {
                return param1 == param2;
            }
            case "===": {
                return param1 === param2;
            }
            case ">": {
                return typeof param1 === "number" && typeof param2 === "number" && param1 > param2;
            }
            case "<": {
                return typeof param1 === "number" && typeof param2 === "number" && param1 < param2;
            }
            case ">=": {
                return typeof param1 === "number" && typeof param2 === "number" && param1 >= param2;
            }
            case "<=": {
                return typeof param1 === "number" && typeof param2 === "number" && param1 <= param2;
            }
            case "includes": {
                return Array.isArray(param1) && param1.includes(param2);
            }
            case "in": {
                if (Array.isArray(param2)) {
                    return param2.includes(param1);
                }
                if (U.isList(param2) && (typeof param1 === "number" || typeof param1 === "string")) {
                    return param1 in param2;
                }
                if (typeof param2 === "string") {
                    return new RegExp(String(param2), "gu").test(String(param1));
                }
                return false;
            }
            default: {
                return false;
            }
        }
    },
    "case": function (mode, str) {
        switch (mode) {
            case "upper": return U.uCase(str);
            case "lower": return U.lCase(str);
            case "sentence": return U.sCase(str);
            case "title": return U.tCase(str);
            default: return str;
        }
    },
    "count": function (param) {
        if (Array.isArray(param) || U.isList(param)) {
            return Object.values(param).length;
        }
        return param ? 1 : 0;
    },
    "signNum": function (num) {
        return U.signNum(num);
    },
    "areEmpty": function (...args) {
        args.pop();
        return !Object.values(args).flat().join("");
    },
    "dbLog": function (...args) {
        args.pop();
        let dbLevel = 5;
        if ([0, 1, 2, 3, 4, 5].includes(args[0])) {
            dbLevel = args.shift();
        }
        bLog.hbsLog(...args, dbLevel);
    }
};
export function registerHandlebarHelpers() {
    Object.entries(handlebarHelpers).forEach(([name, func]) => Handlebars.registerHelper(name, func));
}