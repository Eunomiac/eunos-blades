/* ****▌███████████████████████████████████████████████████████████████████████████▐**** *\
|*     ▌████░░░░░░░░░░░ Euno's Blades in the Dark for Foundry VTT ░░░░░░░░░░░░░████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░ by Eunomiac ░░░░░░░░░░░░░██████████████████▐     *|
|*     ▌████████████████████████████  License █ v0.1.0 ████████████████████████████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░░░░░░  ░░░░░░░░░░░░░░░░░░███████████████████▐     *|
\* ****▌███████████████████████████████████████████████████████████████████████████▐**** */

import U from "./utilities.js";
import { SVGDATA } from "./constants.js";

export async function preloadHandlebarsTemplates() {
    const templatePaths = [
        "systems/eunos-blades/templates/components/toggle-icon.hbs",
        "systems/eunos-blades/templates/components/button-icon.hbs",
        "systems/eunos-blades/templates/components/dotline.hbs",
        "systems/eunos-blades/templates/components/armor.hbs",
        "systems/eunos-blades/templates/components/comp.hbs",
        "systems/eunos-blades/templates/components/portrait.hbs",
        "systems/eunos-blades/templates/components/clock.hbs",
        "systems/eunos-blades/templates/components/roll-collab-mod.hbs",
        "systems/eunos-blades/templates/components/roll-collab-opposition.hbs",
        "systems/eunos-blades/templates/components/slide-out-controls.hbs",
        "systems/eunos-blades/templates/parts/tier-block.hbs",
        "systems/eunos-blades/templates/parts/turf-list.hbs",
        "systems/eunos-blades/templates/parts/cohort-block.hbs",
        "systems/eunos-blades/templates/parts/roll-opposition-creator.hbs",
        "systems/eunos-blades/templates/parts/active-effects.hbs",
        "systems/eunos-blades/templates/parts/gm-pc-summary.hbs",
        "systems/eunos-blades/templates/overlays/clock-overlay.hbs",
        "systems/eunos-blades/templates/overlays/clock-key.hbs"
    ];
    return loadTemplates(templatePaths);
}

const handlebarHelpers = {
    "randString": function (param1 = 10) {
        return U.randString(param1);
    },
    "test": function (param1, operator, param2) {
        const stringMap = {
            "true": true,
            "false": false,
            "null": null,
            "undefined": undefined
        };
        if (["!", "not", "=??"].includes(String(param1))) {
            [operator, param1] = [String(param1), operator];
        }
        if (typeof param1 === "string" && param1 in stringMap) {
            param1 = stringMap[param1];
        }
        if (typeof param2 === "string" && param2 in stringMap) {
            param2 = stringMap[param2];
        }
        switch (operator) {
            case "!":
            case "not": {
                return !param1;
            }
            case "=??": {
                return [undefined, null].includes(param1);
            }
            case "&&": {
                return param1 && param2;
            }
            case "||": {
                return param1 || param2;
            }
            case "==": {
                return param1 == param2;
            }
            case "===": {
                return param1 === param2;
            }
            case "!=": {
                return param1 != param2;
            }
            case "!==": {
                return param1 !== param2;
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
            case "??": {
                return param1 ?? param2;
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
                    return new RegExp(String(param1), "gu").test(String(param2));
                }
                return false;
            }
            default: {
                return false;
            }
        }
    },
    "calc": function (...params) {
        const calcs = {
            "+": (p1, p2) => U.pInt(p1) + U.pInt(p2),
            "-": (p1, p2) => U.pInt(p1) - U.pInt(p2),
            "*": (p1, p2) => U.pInt(p1) * U.pInt(p2),
            "/": (p1, p2) => U.pInt(p1) / U.pInt(p2),
            "%": (p1, p2) => U.pInt(p1) % U.pInt(p2),
            "max": (p1, p2) => Math.max(U.pInt(p1), U.pInt(p2)),
            "min": (p1, p2) => Math.min(U.pInt(p1), U.pInt(p2)),
            "ceil": (p1) => Math.ceil(U.pFloat(p1)),
            "floor": (p1) => Math.floor(U.pFloat(p1))
        };
        const [param1, operator, param2] = typeof params[0] === "string" && params[0] in calcs
            ? [params[1], params[0]]
            : params;
        return calcs[operator](param1, param2);
    },
    "isIn": function () {
        const [testStr, ...contents] = arguments;
        return contents.includes(testStr);
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
            return Object.values(param).filter((val) => val !== null && val !== undefined).length;
        }
        else if (typeof param === "string") {
            return param.length;
        }
        return param ? 1 : 0;
    },
    "forloop": (...args) => {
        const options = args.pop();
        let [from, to, stepSize] = args;
        from = U.pInt(from);
        to = U.pInt(to);
        stepSize = U.pInt(stepSize) || 1;
        if (from > to) {
            return "";
        }
        let html = "";
        for (let i = parseInt(from || 0); i <= parseInt(to || 0); i++) {
            html += options.fn(i);
        }
        return html;
    },
    "signNum": function (num) {
        return U.signNum(num);
    },
    "areEmpty": function (...args) {
        args.pop();
        return !Object.values(args).flat().join("");
    },
    "compileSvg": function (...args) {
        const [svgDotKey, svgPaths] = args;
        const svgData = getProperty(SVGDATA, svgDotKey);
        if (!svgData) {
            return "";
        }
        const { viewBox, paths } = svgData;
        return [
            `<svg viewBox="${viewBox}">`,
            ...svgPaths
                .split("|")
                .map((path) => `<path class="${path}" d="${paths[path] ?? ""}" />`),
            "</svg>"
        ].join("\n");
    },
    "eLog": function (...args) {
        args.pop();
        let dbLevel = 5;
        if ([0, 1, 2, 3, 4, 5].includes(args[0])) {
            dbLevel = args.shift();
        }
        eLog.hbsLog(...args, dbLevel);
    },
    "isTurfBlock": (name) => U.fuzzyMatch(name, "Turf"),
    "getConnectorPartner": (index, direction) => {
        index = parseInt(`${index}`);
        const partners = {
            1: { right: 2, bottom: 6 },
            2: { left: 1, right: 3, bottom: 7 },
            3: { left: 2, right: 4, bottom: 8 },
            4: { left: 3, right: 5, bottom: 9 },
            5: { left: 4, bottom: 10 },
            6: { top: 1, right: 7, bottom: 11 },
            7: { top: 2, left: 6, right: 8, bottom: 12 },
            8: { top: 3, left: 7, right: 9, bottom: 13 },
            9: { top: 4, left: 8, right: 10, bottom: 14 },
            10: { top: 5, left: 9, bottom: 15 },
            11: { top: 6, right: 12 },
            12: { top: 7, left: 11, right: 13 },
            13: { top: 8, left: 12, right: 14 },
            14: { top: 9, left: 13, right: 15 },
            15: { top: 10, left: 14 }
        };
        const partnerDir = { left: "right", right: "left", top: "bottom", bottom: "top" }[direction];
        const partnerNum = partners[index][direction] ?? 0;
        if (partnerNum) {
            return `${partnerNum}-${partnerDir}`;
        }
        return null;
    },
    "isTurfOnEdge": (index, direction) => {
        index = parseInt(`${index}`);
        const edges = {
            1: ["top", "left"],
            2: ["top"],
            3: ["top"],
            4: ["top"],
            5: ["top", "right"],
            6: ["left"],
            7: [],
            8: [],
            9: [],
            10: ["right"],
            11: ["left", "bottom"],
            12: ["bottom"],
            13: ["bottom"],
            14: ["bottom"],
            15: ["right", "bottom"]
        };
        if (!(index in edges)) {
            return true;
        }
        return edges[index].includes(direction);
    },
    "multiboxes": function (selected, options) {
        let html = options.fn(this);
        selected = [selected].flat(1);
        selected.forEach((selected_value) => {
            if (selected_value !== false) {
                const escapedValue = RegExp.escape(Handlebars.escapeExpression(String(selected_value)));
                const rgx = new RegExp(' value=\"' + escapedValue + '\"');
                html = html.replace(rgx, "$& checked=\"checked\"");
            }
        });
        return html;
    },
    "noteq": (a, b, options) => (a !== b ? options.fn(this) : ""),
    "repturf": (turfs_amount, options) => {
        let html = options.fn(this), turfs_amount_int = parseInt(turfs_amount);
        if (turfs_amount_int > 6) {
            turfs_amount_int = 6;
        }
        for (let i = 13 - turfs_amount_int; i <= 12; i++) {
            const rgx = new RegExp(' value=\"' + i + '\"');
            html = html.replace(rgx, "$& disabled=\"disabled\"");
        }
        return html;
    },
    "crew_vault_coins": (max_coins, options) => {
        let html = options.fn(this);
        for (let i = 1; i <= max_coins; i++) {
            html += "<input type=\"radio\" id=\"crew-coins-vault-" + i + "\" name=\"system.vault.value\" value=\"" + i + "\"><label for=\"crew-coins-vault-" + i + "\"></label>";
        }
        return html;
    },
    "crew_experience": (actor, options) => {
        let html = options.fn(this);
        for (let i = 1; i <= 10; i++) {
            html += `<input type="radio" id="crew-${actor._id}-experience-${i}" name="system.experience" value="${i}" dtype="Radio"><label for="crew-${actor._id}-experience-${i}"></label>`;
        }
        return html;
    },
    "html": (options) => {
        const text = options.hash.text.replace(/\n/g, "<br />");
        return new Handlebars.SafeString(text);
    },
    //
    "times_from_1": (n, block) => {
        n = parseInt(n);
        let accum = "";
        for (let i = 1; i <= n; ++i) {
            accum += block.fn(i);
        }
        return accum;
    },
    //
    "times_from_0": (n, block) => {
        n = parseInt(n);
        let accum = "";
        for (let i = 0; i <= n; ++i) {
            accum += block.fn(i);
        }
        return accum;
    },
    "concat": function () {
        let outStr = "";
        for (const arg in arguments) {
            if (typeof arguments[arg] !== "object") {
                outStr += arguments[arg];
            }
        }
        return outStr;
    },
        "selectOptionsWithLabel": (choices, options) => {
        const localize = options.hash.localize ?? false;
        let selected = options.hash.selected ?? null;
        const blank = options.hash.blank || null;
        selected = selected instanceof Array ? selected.map(String) : [String(selected)];
        const option = (key, object) => {
            if (localize) {
                object.label = game.i18n.localize(object.label);
            }
            const isSelected = selected.includes(key);
            html += `<option value="${key}" ${isSelected ? "selected" : ""}>${object.label}</option>`;
        };
        let html = "";
        if (blank) {
            option("", blank);
        }
        Object.entries(choices).forEach(e => option(...e));
        return new Handlebars.SafeString(html);
    }
    
    
};
handlebarHelpers.eLog1 = function (...args) { handlebarHelpers.eLog(...[1, ...args.slice(0, 7)]); };
handlebarHelpers.eLog2 = function (...args) { handlebarHelpers.eLog(...[2, ...args.slice(0, 7)]); };
handlebarHelpers.eLog3 = function (...args) { handlebarHelpers.eLog(...[3, ...args.slice(0, 7)]); };
handlebarHelpers.eLog4 = function (...args) { handlebarHelpers.eLog(...[4, ...args.slice(0, 7)]); };
handlebarHelpers.eLog5 = function (...args) { handlebarHelpers.eLog(...[5, ...args.slice(0, 7)]); };
Object.assign(handlebarHelpers);
export function registerHandlebarHelpers() {
    Object.entries(handlebarHelpers).forEach(([name, func]) => Handlebars.registerHelper(name, func));
}
//# sourceMappingURL=helpers.js.map
//# sourceMappingURL=helpers.js.map
