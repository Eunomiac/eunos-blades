// #region ▮▮▮▮▮▮▮ IMPORTS ▮▮▮▮▮▮▮ ~
/* eslint-disable @typescript-eslint/no-unused-vars */
import U from "./utilities";
/* eslint-enable @typescript-eslint/no-unused-vars */
// #endregion ▮▮▮▮[IMPORTS]▮▮▮▮

// #region ░░░░░░░[Templates]░░░░ Preload Partials, Components & Overlay Templates ░░░░░░░ ~
/**
 * Define a set of template paths to pre-load
 * Pre-loaded templates are compiled and cached for fast access when rendering
 */
export async function preloadHandlebarsTemplates() {
  // Define template paths to load
  const templatePaths = [

    // General Components
    "systems/eunos-blades/templates/components/toggle-icon.hbs",
    "systems/eunos-blades/templates/components/button-icon.hbs",
    "systems/eunos-blades/templates/components/dotline.hbs",
    "systems/eunos-blades/templates/components/armor.hbs",
    "systems/eunos-blades/templates/components/comp.hbs",
    "systems/eunos-blades/templates/components/select.hbs",
    "systems/eunos-blades/templates/components/portrait.hbs",
    "systems/eunos-blades/templates/components/clock.hbs",
    "systems/eunos-blades/templates/components/roll-collab-mod.hbs",
    "systems/eunos-blades/templates/components/slide-out-controls.hbs",
    "systems/eunos-blades/templates/components/consequence.hbs",
    "systems/eunos-blades/templates/components/consequence-accepted.hbs",
    // Partials
    "systems/eunos-blades/templates/parts/tier-block.hbs",
    "systems/eunos-blades/templates/parts/turf-list.hbs",
    "systems/eunos-blades/templates/parts/cohort-block.hbs",
    "systems/eunos-blades/templates/parts/roll-opposition-creator.hbs",
    "systems/eunos-blades/templates/parts/active-effects.hbs",
    "systems/eunos-blades/templates/parts/gm-pc-summary.hbs",
    "systems/eunos-blades/templates/components/clock-key.hbs"
  ];

  // Load the template parts
  return loadTemplates(templatePaths);
}
// #endregion ░░░░[Preload Templates]░░░░

// #region ████████ Handlebars: Handlebar Helpers Definitions ████████ ~
const handlebarHelpers: Record<string, Handlebars.HelperDelegate> = {
  randString(param1 = 10) {
    return U.randString(param1);
  },
  test(param1: unknown, operator: string, param2: unknown) {
    const stringMap = {
      true:  true,
      false: false,
      null:  null,
      undefined
    };
    if (["!", "not", "=??"].includes(String(param1))) {
      [operator, param1] = [String(param1), operator];
    }
    if (typeof param1 === "string" && param1 in stringMap) {
      param1 = stringMap[param1 as keyof typeof stringMap];
    }
    if (typeof param2 === "string" && param2 in stringMap) {
      param2 = stringMap[param2 as keyof typeof stringMap];
    }
    switch (operator) {
      case "!": case "not": { return !param1; }
      case "=??": { return ([undefined, null] as unknown[]).includes(param1); }
      case "&&": { return param1 && param2; }
      case "||": { return param1 || param2; }
      case "==": { return U.areFuzzyEqual(param1, param2); }
      case "===": { return param1 === param2; }
      case "!=":
      case "!==": { return param1 !== param2; }
      case ">": { return typeof param1 === "number" && typeof param2 === "number" && param1 > param2; }
      case "<": { return typeof param1 === "number" && typeof param2 === "number" && param1 < param2; }
      case ">=": { return typeof param1 === "number" && typeof param2 === "number" && param1 >= param2; }
      case "<=": { return typeof param1 === "number" && typeof param2 === "number" && param1 <= param2; }
      case "??": { return param1 ?? param2; }
      case "includes": { return Array.isArray(param1) && param1.includes(param2); }
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
      default: { return false; }
    }
  },
  calc(...params: unknown[]) {
    const calcs: Record<string, (...args: Array<number|string>) => number|string> = {
      "+":     (p1, p2) => U.pInt(p1) + U.pInt(p2),
      "-":     (p1, p2) => U.pInt(p1) - U.pInt(p2),
      "*":     (p1, p2) => U.pInt(p1) * U.pInt(p2),
      "/":     (p1, p2) => U.pInt(p1) / U.pInt(p2),
      "%":     (p1, p2) => U.pInt(p1) % U.pInt(p2),
      "max":   (p1, p2) => Math.max(U.pInt(p1), U.pInt(p2)),
      "min":   (p1, p2) => Math.min(U.pInt(p1), U.pInt(p2)),
      "ceil":  (p1) => Math.ceil(U.pFloat(p1)),
      "floor": (p1) => Math.floor(U.pFloat(p1))
    };
    const [param1, operator, param2] = typeof params[0] === "string" && params[0] in calcs
      ? [params[1], params[0]]
      : params;
    return calcs[operator as KeyOf<typeof calcs>](param1 as string|number, param2 as string|number);
  },
  isIn(...args: unknown[]) {
    const [testStr, ...contents] = args;
    return contents.includes(testStr);
  },
  case(mode: StringCase, str: string) {
    switch (mode) {
      case "upper": return U.uCase(str);
      case "lower": return U.lCase(str);
      case "sentence": return U.sCase(str);
      case "title": return U.tCase(str);
      default: return str;
    }
  },
  romanize(val: number): string {
    return U.romanizeNum(U.pInt(val));
  },
  count(param: unknown): number {
    if (Array.isArray(param) || U.isList(param)) {
      return Object.values(param).filter((val: unknown) => val !== null && val !== undefined).length;
    } else if (typeof param === "string") {
      return param.length;
    }
    return param ? 1 : 0;
  },
  // Concat helper
  // Usage: (concat 'first 'second')
  concat(...args: unknown[]) {
    let outStr = "";
    for (const arg of args) {
      if (typeof arg === "string" || typeof arg === "number") {
        outStr += arg;
      }
    }
    return outStr;
  },
  // Merge helper - To merge additional properties into a template's context
  merge(context, ...args) {
    args.pop();
    return args.reduce((acc, val) => Object.assign(acc, val), context);
  },
  // For loop: {{#for [from = 0, to, stepSize = 1]}}<html content, this = index>{{/for}}
  for : (...args) => {
    const options = args.pop();
    let [from, to, stepSize] = args;
    from = U.pInt(from);
    to = U.pInt(to);
    stepSize = U.pInt(stepSize) || 1;
    if (from > to) { return ""; }
    let html = "";
    for (let i = parseInt(from || 0, 10); i <= parseInt(to || 0, 10); i += stepSize) {
      html += options.fn(i);
    }
    return html;
  },
  signNum(num: number) {
    return U.signNum(num);
  },
  compileSvg(...args): string {
    const [svgDotKey, svgPaths]: [string, string] = args as [string, string];
    return U.getSvgCode(svgDotKey, svgPaths);
  },
  eLog(...args) {
    args.pop();
    let dbLevel = 3;
    if ([0, 1, 2, 3, 4, 5].includes(args[0])) {
      dbLevel = args.shift();
    }
    eLog.hbsLog(...args, dbLevel);
  },
  // Does the name of this turf block represent a standard 'Turf' claim?
  isTurfBlock:         (name: string): boolean => U.fuzzyMatch(name, "Turf"),
  // Which other connection does this connector overlap with?
  getConnectorPartner: (index: number|string, direction: Direction): string|null => {
    index = parseInt(`${index}`, 10);
    const partners: Record<number, Record<string, number>> = {
      1:  {right: 2, bottom: 6},
      2:  {left: 1, right: 3, bottom: 7},
      3:  {left: 2, right: 4, bottom: 8},
      4:  {left: 3, right: 5, bottom: 9},
      5:  {left: 4, bottom: 10},
      6:  {top: 1, right: 7, bottom: 11},
      7:  {top: 2, left: 6, right: 8, bottom: 12},
      8:  {top: 3, left: 7, right: 9, bottom: 13},
      9:  {top: 4, left: 8, right: 10, bottom: 14},
      10: {top: 5, left: 9, bottom: 15},
      11: {top: 6, right: 12},
      12: {top: 7, left: 11, right: 13},
      13: {top: 8, left: 12, right: 14},
      14: {top: 9, left: 13, right: 15},
      15: {top: 10, left: 14}
    };
    const partnerDir = {left: "right", right: "left", top: "bottom", bottom: "top"}[direction];
    const partnerNum = partners[index][direction] ?? 0;
    if (partnerNum) { return `${partnerNum}-${partnerDir}`; }
    return null;
  },
  // Is the value Turf side.
  isTurfOnEdge : (index: number|string, direction: string): boolean => {
    index = parseInt(`${index}`, 10);
    const edges: Record<number, string[]> = {
      1:  ["top", "left"],
      2:  ["top"],
      3:  ["top"],
      4:  ["top"],
      5:  ["top", "right"],
      6:  ["left"],
      7:  [],
      8:  [],
      9:  [],
      10: ["right"],
      11: ["left", "bottom"],
      12: ["bottom"],
      13: ["bottom"],
      14: ["bottom"],
      15: ["right", "bottom"]
    };
    if (!(index in edges)) { return true; }
    return edges[index].includes(direction);
  },
  // Multiboxes
  multiboxes(selected, options) {
    let html = options.fn(this);
    selected = [selected].flat(1);

    selected.forEach((selectedVal: boolean|string) => {
      if (selectedVal !== false) {
        const escapedValue = RegExp.escape(Handlebars.escapeExpression(String(selectedVal)));
        const rgx = new RegExp(` value="${escapedValue}"`);
        html = html.replace(rgx, "$& checked=\"checked\"");
      }
    });

    return html;
  },
  repturf : (turfsAmount, options) => {
    let html = options.fn(this);
    let turfsAmountInt = parseInt(turfsAmount, 10);

    // Can't be more than 6.
    if (turfsAmountInt > 6) {
      turfsAmountInt = 6;
    }

    for (let i = 13 - turfsAmountInt; i <= 12; i++) {
      const rgx = new RegExp(` value="${i}"`);
      html = html.replace(rgx, "$& disabled=\"disabled\"");
    }

    return html;
  }
};

handlebarHelpers.eLog1 = function(...args) { handlebarHelpers.eLog(...[1, ...args.slice(0, 7)]); };
handlebarHelpers.eLog2 = function(...args) { handlebarHelpers.eLog(...[2, ...args.slice(0, 7)]); };
handlebarHelpers.eLog3 = function(...args) { handlebarHelpers.eLog(...[3, ...args.slice(0, 7)]); };
handlebarHelpers.eLog4 = function(...args) { handlebarHelpers.eLog(...[4, ...args.slice(0, 7)]); };
handlebarHelpers.eLog5 = function(...args) { handlebarHelpers.eLog(...[5, ...args.slice(0, 7)]); };

Object.assign(handlebarHelpers);

/**
 *
 */
export function registerHandlebarHelpers() {
  Object.entries(handlebarHelpers).forEach(([name, func]) => Handlebars.registerHelper(name, func));
}
// #endregion ▄▄▄▄▄ Handlebars ▄▄▄▄▄
