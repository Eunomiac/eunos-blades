/* ****▌███████████████████████████████████████████████████████████████████████████▐**** *\
|*     ▌████░░░░░░░░░░░ Euno's Blades in the Dark for Foundry VTT ░░░░░░░░░░░░░████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░ by Eunomiac ░░░░░░░░░░░░░██████████████████▐     *|
|*     ▌████████████████████████████  License █ v0.1.0 ████████████████████████████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░░░░░░  ░░░░░░░░░░░░░░░░░░███████████████████▐     *|
\* ****▌███████████████████████████████████████████████████████████████████████████▐**** */

import U from "./utilities.js";
export async function preloadHandlebarsTemplates() {
    const templatePaths = [
        "systems/eunos-blades/templates/parts/toggle-icon.hbs",
        "systems/eunos-blades/templates/parts/button-icon.hbs",
        "systems/eunos-blades/templates/parts/coins.hbs",
        "systems/eunos-blades/templates/parts/coins-stash.hbs",
        "systems/eunos-blades/templates/parts/attributes.hbs",
        "systems/eunos-blades/templates/parts/turf-list.hbs",
        "systems/eunos-blades/templates/parts/cohort-block.hbs",
        "systems/eunos-blades/templates/parts/factions.hbs",
        "systems/eunos-blades/templates/parts/active-effects.hbs"
    ];
    return loadTemplates(templatePaths);
}
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
            return Object.values(param).filter((val) => val !== null && val !== undefined).length;
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
    },
    "isTurfBlock": (name) => checkFuzzyEquality(name, "Turf"),
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
    "traumacounter": function (selected, options) {
        const html = options.fn(this);
        let count = 0;
        for (const trauma in selected) {
            if (selected[trauma] === true) {
                count++;
            }
        }
        if (count > 4) {
            count = 4;
        }
        const rgx = new RegExp(' value=\"' + count + '\"');
        return html.replace(rgx, "$& checked=\"checked\"");
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
            html += "<input type=\"radio\" id=\"crew-coins-vault-" + i + "\" name=\"data.vault.value\" value=\"" + i + "\"><label for=\"crew-coins-vault-" + i + "\"></label>";
        }
        return html;
    },
    "crew_experience": (actor, options) => {
        let html = options.fn(this);
        for (let i = 1; i <= 10; i++) {
            html += `<input type="radio" id="crew-${actor._id}-experience-${i}" name="data.experience" value="${i}" dtype="Radio"><label for="crew-${actor._id}-experience-${i}"></label>`;
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
    },
        "blades-clock": (parameter_name, type, current_value, uniq_id) => {
        let html = "";
        if (current_value === null || current_value === "null") {
            current_value = 0;
        }
        if (parseInt(current_value) > parseInt(type)) {
            current_value = type;
        }
        html += `<label class="clock-zero-label" for="clock-0-${uniq_id}}"><i class="fab fa-creative-commons-zero nullifier"></i></label>`;
        html += `<div id="blades-clock-${uniq_id}" class="blades-clock clock-${type} clock-${type}-${current_value}" style="background-image:url('systems/eunos-blades/assets/progressclocks-svg/Progress Clock ${type}-${current_value}.svg');">`;
        const zero_checked = (parseInt(current_value) === 0) ? 'checked="checked"' : "";
        html += `<input type="radio" value="0" id="clock-0-${uniq_id}}" name="${parameter_name}" ${zero_checked}>`;
        for (let i = 1; i <= parseInt(type); i++) {
            const checked = (parseInt(current_value) === i) ? 'checked="checked"' : "";
            html += `
        <input type="radio" value="${i}" id="clock-${i}-${uniq_id}" name="${parameter_name}" ${checked}>
        <label for="clock-${i}-${uniq_id}"></label>
      `;
        }
        html += "</div>";
        return html;
    },
        "removeClassPrefix": (classStr) => classStr.replace(/^\(.*?\)\s*/, "")
};
export function registerHandlebarHelpers() {
    Object.entries(handlebarHelpers).forEach(([name, func]) => Handlebars.registerHelper(name, func));
}
const removeDuplicatedItemType = (item_data, actor) => {
    const dupe_list = [];
    const distinct_types = ["crew_reputation", "class", "vice", "background", "heritage"];
    const allowed_types = ["item"];
    const should_be_distinct = distinct_types.includes(item_data.type);
    actor.items.forEach((item) => {
        const has_double = (item_data.type === item.data.type);
        if ((item.name === item_data.name || (should_be_distinct && has_double))
            && (!allowed_types.includes(item_data.type))
            && (item_data._id !== item.id)) {
            dupe_list.push(item.id);
        }
    });
    return dupe_list;
};
const getAllItemsByType = async (item_type, game) => {
    if (!game.items) {
        return [];
    }
    const items = game.items.filter((item) => item.data.type === item_type);
    const pack = game.packs.find((pack) => pack.metadata.name === item_type);
    if (!pack) {
        return items;
    }
    const pack_items = await pack.getDocuments();
    items.push(...pack_items);
    items.sort(function (a, b) {
        const nameA = a.data.name.toUpperCase();
        const nameB = b.data.name.toUpperCase();
        return nameA.localeCompare(nameB);
    });
    return items;
};
const getAttributeLabel = (attribute_name) => {
    const attribute_labels = {};
    const attributes = game.system.model.Actor.character.attributes;
    for (const att_name in attributes) {
        attribute_labels[att_name] = attributes[att_name].label;
        for (const skill_name in attributes[att_name].skills) {
            attribute_labels[skill_name] = attributes[att_name].skills[skill_name].label;
        }
    }
    return attribute_labels[attribute_name];
};
const isAttributeAction = (attribute_name) => !(attribute_name in game.system.model.Actor.character.attributes);
const checkFuzzyEquality = (a, b) => {
    const [strA, strB] = [game.i18n.localize(String(a)), game.i18n.localize(String(b))]
        .map((str) => str.toLowerCase().replace(/\s/g, ""));
    return strA === strB;
};
export default {
    removeDuplicatedItemType,
    getAllItemsByType,
    getAttributeLabel,
    isAttributeAction,
    checkFuzzyEquality
};