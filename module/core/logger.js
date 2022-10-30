/* ****▌███████████████████████████████████████████████████████████████████████████▐**** *\
|*     ▌████░░░░░░░░░░░ Euno's Blades in the Dark for Foundry VTT ░░░░░░░░░░░░░████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░ by Eunomiac ░░░░░░░░░░░░░██████████████████▐     *|
|*     ▌████████████████████████████  License █ v0.1.0 ████████████████████████████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░░░░░░  ░░░░░░░░░░░░░░░░░░███████████████████▐     *|
\* ****▌███████████████████████████████████████████████████████████████████████████▐**** */

import U from "./utilities.js";
import C from "./constants.js";
const LOGGERCONFIG = {
    fullName: "eLogger",
    aliases: ["dbLog"],
    stackTraceExclusions: {
        handlebars: [/scripts\/handlebars/]
    }
};
console.log(new RegExp(`at (getStackTrace|${LOGGERCONFIG.fullName}|${LOGGERCONFIG.aliases.map(String).join("|")}|Object\\.(log|display|hbsLog|error))`));
const getStackTrace = (regExpFilters = []) => {
    regExpFilters.push(new RegExp(`at (getStackTrace|${LOGGERCONFIG.fullName}|${LOGGERCONFIG.aliases.map(String).join("|")}|Object\\.(log|display|hbsLog|error))`), /^Error/);
    const stackTrace = (new Error()).stack;
    if (stackTrace) {
        return stackTrace
            .split(/\s*\n\s*/)
            .filter((sLine) => !regExpFilters.some((rTest) => rTest.test(sLine)))
            .join("\n");
    }
    return null;
};
const eLogger = (type = "base", ...content) => {
    const [message, ...data] = content;
    const dbLevel = [0, 1, 2, 3, 4, 5].includes(U.getLast(data))
        ? data.pop()
        : 3;
    if (U.getSetting("debug") < dbLevel) {
        return;
    }
    const stackTrace = type === "display"
        ? null
        : getStackTrace(LOGGERCONFIG.stackTraceExclusions[type] ?? []);
    const styleLine = Object.entries({
        ...STYLES.base,
        ...STYLES[type] ?? {}
    }).map(([prop, val]) => `${prop}: ${val};`).join(" ");
    const logFunc = stackTrace
        ? console.groupCollapsed
        : (data.length <= 1 ? console.log : console.group);
    if (data.length === 0) {
        if (typeof message === "string") {
            logFunc(`%c${message}`, styleLine);
        }
        else {
            logFunc("%o", message);
        }
    }
    else {
        logFunc(`%c${message}${typeof data[0] === "string" ? "" : " %o"}`, styleLine, data.shift());
        data.forEach((line) => {
            if (typeof line === "string") {
                console.log(line);
            }
            else {
                console.log("%o", line);
            }
        });
    }
    if (stackTrace) {
        console.group("%cSTACK TRACE", `color: ${C.Colors.bGOLD}; font-family: "Pragmata Pro"; font-size: 12px; background: ${C.Colors.BLACK}; font-weight: bold; padding: 0 10px;`);
        console.log(`%c${stackTrace}`, Object.entries(STYLES.stack).map(([prop, val]) => `${prop}: ${val};`).join(" "));
        console.groupEnd();
    }
    console.groupEnd();
};
const STYLES = {
    base: {
        "background": C.Colors.dBLACK,
        "color": C.Colors.bGOLD,
        "font-family": "Pragmata Pro",
        "padding": "0 25px",
        "margin-right": "25px"
    },
    display: {
        "color": C.Colors.gGOLD,
        "font-family": "Kirsty Rg",
        "font-size": "16px",
        "margin-left": "-100px",
        "padding": "0 100px"
    },
    error: {
        "color": C.Colors.gRED,
        "background": C.Colors.dRED,
        "font-weight": 500
    },
    handlebars: {
        "background": C.Colors.GREY,
        "color": C.Colors.BLUE,
        "font-family": "Pragmata Pro",
        "padding": "0",
        "margin-right": "25px"
    },
    stack: {
        "color": C.Colors.GOLD,
        "font-weight": 100,
        "font-size": "10px",
        "font-family": "Pragmata Pro"
    }
};
const eLog = {
    display: (...content) => eLogger("display", ...content),
    log: (...content) => eLogger("base", ...content),
    error: (...content) => eLogger("error", ...content),
    hbsLog: (...content) => eLogger("handlebars", ...content)
};
const registerDebugger = () => {
    Object.assign(globalThis, { eLog });
    Handlebars.registerHelper("eLog", eLog.hbsLog);
};
export default registerDebugger;