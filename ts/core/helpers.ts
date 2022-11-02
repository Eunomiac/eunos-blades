import U from "./utilities.js";
import type {ItemData} from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/module.mjs";
import type BladesActor from "../blades-actor.js";
import type BladesItem from "../blades-item.js";
import {HbsSvgData, SVGDATA} from "./constants.js";

/**
 * Define a set of template paths to pre-load
 * Pre-loaded templates are compiled and cached for fast access when rendering
 */
export async function preloadHandlebarsTemplates() {
	// Define template paths to load
	const templatePaths = [

		// General Partials
		"systems/eunos-blades/templates/parts/toggle-icon.hbs",
		"systems/eunos-blades/templates/parts/button-icon.hbs",
		"systems/eunos-blades/templates/parts/dotline.hbs",
		"systems/eunos-blades/templates/components/armor.hbs",

		// Actor Sheet Partials
		"systems/eunos-blades/templates/parts/attributes.hbs",
		"systems/eunos-blades/templates/parts/turf-list.hbs",
		"systems/eunos-blades/templates/parts/cohort-block.hbs",
		"systems/eunos-blades/templates/parts/factions.hbs",
		"systems/eunos-blades/templates/parts/active-effects.hbs",

		// Overlays
		"systems/eunos-blades/templates/overlays/clock-overlay.hbs",
		"systems/eunos-blades/templates/overlays/clock-key.hbs",
		"systems/eunos-blades/templates/components/clock.hbs"
	];

	// Load the template parts
	return loadTemplates(templatePaths);
}

const handlebarHelpers: Record<string,Handlebars.HelperDelegate> = {
	"test": function(param1: unknown, operator: string, param2: unknown) {
		const stringMap = {
			"true": true,
			"false": false,
			"null": null,
			"undefined": undefined
		};
		if (["!", "not"].includes(String(param1))) {
			[operator, param1] = [String(param1), operator];
		}
		if (typeof param1 === "string" && param1 in stringMap) {
			param1 = stringMap[param1 as keyof typeof stringMap];
		}
		if (typeof param2 === "string" && param2 in stringMap) {
			param2 = stringMap[param2 as keyof typeof stringMap];
		}
		switch (operator) {
			case "!": case "not": { return !param1 }
			case "&&": { return param1 && param2 }
			case "||": { return param1 || param2 }
			case "==": { return param1 == param2 } // eslint-disable-line eqeqeq
			case "===": { return param1 === param2 }
			case "!=": { return param1 != param2 } // eslint-disable-line eqeqeq
			case "!==": { return param1 !== param2 }
			case ">": { return typeof param1 === "number" && typeof param2 === "number" && param1 > param2 }
			case "<": { return typeof param1 === "number" && typeof param2 === "number" && param1 < param2 }
			case ">=": { return typeof param1 === "number" && typeof param2 === "number" && param1 >= param2 }
			case "<=": { return typeof param1 === "number" && typeof param2 === "number" && param1 <= param2 }
			case "includes": { return Array.isArray(param1) && param1.includes(param2) }
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
			default: { return false }
		}
	},
	"calc": function(...params: unknown[]) {
		const calcs: Record<string, (...args: Array<number|string>) => number|string> = {
			"+": (p1, p2) => U.pInt(p1) + U.pInt(p2),
			"-": (p1, p2) => U.pInt(p1) - U.pInt(p2),
			"*": (p1, p2) => U.pInt(p1) * U.pInt(p2),
			"/": (p1, p2) => U.pInt(p1) / U.pInt(p2),
			"%": (p1, p2) => U.pInt(p1) % U.pInt(p2),
			"ceil": (p1) => Math.ceil(U.pFloat(p1)),
			"floor": (p1) => Math.floor(U.pFloat(p1))
		};
		const [param1, operator, param2] = typeof params[0] === "string" && params[0] in calcs
			? [params[1], params[0]]
			: params;
		return calcs[operator as KeyOf<typeof calcs>](param1 as string|number, param2 as string|number);
	},
	"case": function(mode: "upper" | "lower" | "sentence" | "title", str: string) {
		// return U[`${mode.charAt(0)}Case`](str);
		switch (mode) {
			case "upper": return U.uCase(str);
			case "lower": return U.lCase(str);
			case "sentence": return U.sCase(str);
			case "title": return U.tCase(str);
			default: return str;
		}
	},
	"count": function(param: unknown): number {
		if (Array.isArray(param) || U.isList(param)) {
			return Object.values(param).filter((val: unknown) => val !== null && val !== undefined).length;
		}
		return param ? 1 : 0;
	},
	// For loop: {{#for [from = 0, to, stepSize = 1]}}<html content, this = index>{{/for}}
	"forloop": (...args) => {
		const options = args.pop();
		let [from, to, stepSize] = args;
		from = U.pInt(from);
		to = U.pInt(to);
		stepSize = U.pInt(stepSize) || 1;
		if (from > to) { return "" }
		let html = "";
		for (let i = parseInt(from || 0); i <= parseInt(to || 0); i++) {
			html += options.fn(i);
		}
		return html;
	},
	"signNum": function(num: number) {
		return U.signNum(num);
	},
	"areEmpty": function(...args) {
		args.pop();
		return !Object.values(args).flat().join("");
	},
	"compileSvg": function(...args): string {
		const [svgDotKey, svgPaths]: [string, string] = args as [string, string];
		const svgData = getProperty(SVGDATA, svgDotKey) as HbsSvgData|undefined;
		if (!svgData) { return "" }
		const {viewBox, paths} = svgData;
		return [
			`<svg viewBox="${viewBox}">`,
			...svgPaths
				.split("|")
				.map((path) => `<path class="${path}" d="${paths[path] ?? ""}" />`),
			"</svg>"
		].join("\n");
	},
	"eLog": function(...args) {
		args.pop();
		let dbLevel = 5;
		if ([0,1,2,3,4,5].includes(args[0])) {
			dbLevel = args.shift();
		}
		eLog.hbsLog(...args, dbLevel);
	},
	// Does the name of this turf block represent a standard 'Turf' claim?
	"isTurfBlock": (name: string): boolean => checkFuzzyEquality(name, "Turf"),
	// Which other connection does this connector overlap with?
	"getConnectorPartner": (index: number|string, direction: "right"|"left"|"top"|"bottom"): string|null => {
		index = parseInt(`${index}`);
		const partners: Record<number, Record<string,number>> = {
			1: {right: 2, bottom: 6},
			2: {left: 1, right: 3, bottom: 7},
			3: {left: 2, right: 4, bottom: 8},
			4: {left: 3, right: 5, bottom: 9},
			5: {left: 4, bottom: 10},
			6: {top: 1, right: 7, bottom: 11},
			7: {top: 2, left: 6, right: 8, bottom: 12},
			8: {top: 3, left: 7, right: 9, bottom: 13},
			9: {top: 4, left: 8, right: 10, bottom: 14},
			10: {top: 5, left: 9, bottom: 15},
			11: {top: 6, right: 12},
			12: {top: 7, left: 11, right: 13},
			13: {top: 8, left: 12, right: 14},
			14: {top: 9, left: 13, right: 15},
			15: {top: 10, left: 14}
		};
		const partnerDir = {left: "right", right: "left", top: "bottom", bottom: "top"}[direction];
		const partnerNum = partners[index as keyof typeof partners][direction] ?? 0;
		if (partnerNum) { return `${partnerNum}-${partnerDir}` }
		return null;
	},
	// Is the value Turf side.
	"isTurfOnEdge": (index: number|string, direction: string): boolean => {
		index = parseInt(`${index}`);
		const edges: Record<number, string[]> = {
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
		if (!(index in edges)) { return true }
		return edges[index as keyof typeof edges].includes(direction);
	},
	// Multiboxes
	"multiboxes": function(selected, options) {
		let html = options.fn(this);
		selected = [selected].flat(1);

		selected.forEach((selected_value: boolean|string) => {
			if (selected_value !== false) {
				const escapedValue = RegExp.escape(Handlebars.escapeExpression(String(selected_value)));
				const rgx = new RegExp(' value=\"' + escapedValue + '\"');
				html = html.replace(rgx, "$& checked=\"checked\"");
			}
		});

		return html;
	},
	// NotEquals handlebar.
	"noteq": (a, b, options) => (a !== b ? options.fn(this) : ""),
	// ReputationTurf handlebar.
	"repturf": (turfs_amount, options) => {
		let html = options.fn(this),
		 turfs_amount_int = parseInt(turfs_amount);

		// Can't be more than 6.
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
	// Enrich the HTML replace /n with <br>
	"html": (options) => {
		const text = options.hash.text.replace(/\n/g, "<br />");
		return new Handlebars.SafeString(text);
	},
	// "N Times" loop for handlebars.
	//  Block is executed N times starting from n=1.
	//
	// Usage:
	// {{#times_from_1 10}}
	//   <span>{{this}}</span>
	// {{/times_from_1}}
	"times_from_1": (n, block) => {
		n = parseInt(n);
		let accum = "";
		for (let i = 1; i <= n; ++i) {
			accum += block.fn(i);
		}
		return accum;
	},
	// "N Times" loop for handlebars.
	//  Block is executed N times starting from n=0.
	//
	// Usage:
	// {{#times_from_0 10}}
	//   <span>{{this}}</span>
	// {{/times_from_0}}
	"times_from_0": (n, block) => {
		n = parseInt(n);
		let accum = "";
		for (let i = 0; i <= n; ++i) {
			accum += block.fn(i);
		}
		return accum;
	},
	// Concat helper
	// Usage: (concat 'first 'second')
	"concat": function() {
		let outStr = "";
		for(const arg in arguments){
			if(typeof arguments[arg]!=="object"){
				outStr += arguments[arg];
			}
		}
		return outStr;
	},
	/**
   * Takes label from Selected option instead of just plain value.
   */
	"selectOptionsWithLabel": (choices: any[], options) => {
		const localize = options.hash.localize ?? false;
		let selected = options.hash.selected ?? null;
		const blank = options.hash.blank || null;
		selected = selected instanceof Array ? selected.map(String) : [String(selected)];

		// Create an option
		const option = (key: string, object: Record<string,any>) => {
			if ( localize ) {object.label = game.i18n.localize(object.label)}
			const isSelected = selected.includes(key);
			html += `<option value="${key}" ${isSelected ? "selected" : ""}>${object.label}</option>`;
		};

		// Create the options
		let html = "";
		if ( blank ) {option("", blank)}
		Object.entries(choices).forEach(e => option(...e));

		return new Handlebars.SafeString(html);
	},
	/**
   * Create appropriate Blades clock
   */
	"blades-clock": (parameter_name, type, current_value, uniq_id) => {
		let html = "";
		if (current_value === null || current_value === "null") {
			current_value = 0;
		}
		if (parseInt(current_value) > parseInt(type)) {
			current_value = type;
		}

		// Label for 0
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
	/**
	 * Remove class indicators from item names
	 */
	"removeClassPrefix": (classStr: string) => classStr.replace(/^\(.*?\)\s*/, "")
};

handlebarHelpers.eLog1 = function(...args) { handlebarHelpers.eLog(...[1, ...args]) };
handlebarHelpers.eLog2 = function(...args) { handlebarHelpers.eLog(...[2, ...args]) };
handlebarHelpers.eLog3 = function(...args) { handlebarHelpers.eLog(...[3, ...args]) };
handlebarHelpers.eLog4 = function(...args) { handlebarHelpers.eLog(...[4, ...args]) };
handlebarHelpers.eLog5 = function(...args) { handlebarHelpers.eLog(...[5, ...args]) };

Object.assign(handlebarHelpers);

export function registerHandlebarHelpers() {
	Object.entries(handlebarHelpers).forEach(([name, func]) => Handlebars.registerHelper(name, func));
}


/**~
 * Identifies duplicate items by type and returns a array of item ids to remove.
 */
const removeDuplicatedItemType = (item_data: ItemData, actor: BladesActor): string[] => {
	const dupe_list: string[] = [];
	const distinct_types = ["crew_reputation", "class", "vice", "background", "heritage"];
	const allowed_types = ["item"];
	const should_be_distinct = distinct_types.includes(item_data.type);

	//~ If the Item has the exact same name - remove it from list.
	//~ Remove Duplicate items from the array.
	actor.items.forEach((item) => {
		const has_double = (item_data.type === item.data.type);
		if (
					 (item.name === item_data.name || (should_be_distinct && has_double))
				&& (!allowed_types.includes(item_data.type))
				&& (item_data._id !== item.id)
		) {
			dupe_list.push(item.id!);
		}
	});

	return dupe_list;
};

/**
 * Get all available ingame items by Type, including those in packs.
 */
const getAllItemsByType = async (item_type: string, game: Game): Promise<BladesItem[]> => {

	if (!game.items) { return [] }

	const items: BladesItem[] = game.items.filter((item) => item.data.type === item_type);
	const pack = game.packs.find((pack) => pack.metadata.name === item_type);

	if (!pack) { return items }

	const pack_items = await pack.getDocuments() as BladesItem[];
	items.push(...pack_items);

	items.sort(function(a, b) {
		const nameA = a.data.name.toUpperCase();
		const nameB = b.data.name.toUpperCase();
		return nameA.localeCompare(nameB);
	});

	return items;
};

/**
 * Returns the label for attribute.
 */
const getAttributeLabel = (attribute_name: string): string => {
	const attribute_labels: Record<string, string> = {};
	const attributes = game.system.model.Actor.character.attributes;

	for (const att_name in attributes) {
		attribute_labels[att_name] = attributes[att_name].label;
		for (const skill_name in attributes[att_name].skills) {
			attribute_labels[skill_name] = attributes[att_name].skills[skill_name].label;
		}

	}

	return attribute_labels[attribute_name];
};

/**
 * Returns true if the attribute is an action
 */
const isAttributeAction = (attribute_name: string): boolean => !(attribute_name in game.system.model.Actor.character.attributes);


/**
 * Compares two strings for a match based on lower-case characters only.
 */
const checkFuzzyEquality = (a: unknown, b: unknown): boolean => {
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