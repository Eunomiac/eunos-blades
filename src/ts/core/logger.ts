import U from "./utilities";
import {getColor} from "./helpers";

// const LOGGERCONFIG = {
//   fullName:             "eLogger",
//   aliases:              ["dbLog"],
//   stackTraceExclusions: {
//     handlebars: [/scripts\/handlebars/] // From internal Handlebars module
//   }
// };

const STACK_TRACE_EXCLUSIONS = [
  /at Logger/,
  /\beLog\b/,
  /scripts\/handlebars/ // From internal Handlebars module
];

const STACK_TRACE_PROJECT_CODE = [
  /\/systems\//,
  /\/modules\//
];

const STYLES = {
  base: {
    "background":     getColor("black"),
    "color":          getColor("gold", "dark"),
    "font-family":  "Pragmata Pro",
    "padding":        "0 25px",
    "margin-right": "25px"
  },
  log0: {
    "background":  getColor("gold", "dark"),
    "color":       getColor("black", "dark"),
    "font-size":  "16px"
  },
  log1: {
    "background":  getColor("black", "dark"),
    "color":       getColor("gold", "bright"),
    "font-size":  "16px"
  },
  log2: {
    "background":  getColor("black", "dark"),
    "color":       getColor("gold", "dark"),
    "font-size":  "16px"
  },
  log3: {
    "font-size": "14px"
  },
  log4: {
    "font-size": "12px"
  },
  log5: {
    "background":  getColor("grey", "dark"),
    "color":       getColor("grey", "bright"),
    "font-size":  "10px"
  },
  display: {
    "color":         getColor("gold", "bright"),
    "font-family": "Kirsty",
    "font-size":   "16px",
    "margin-left": "-100px",
    "padding":       "0 100px"
  },
  warn: {
    "color":         getColor("black", "dark"),
    "background":    getColor("gold", "dark"),
    "font-weight": 500
  },
  error: {
    "color":         getColor("red", "bright"),
    "background":    getColor("red", "darkest"),
    "font-weight": 500
  },
  handlebars: {
    "background":     getColor("grey"),
    "color":          getColor("blue"),
    "font-family":  "Pragmata Pro",
    "padding":        "0",
    "margin-right": "25px"
  },
  stack: {
    "color":         getColor("gold"),
    "font-weight": 100,
    "font-size":   "10px",
    "font-family": "Pragmata Pro"
  }
};

const {base: baseStyles, ...typeStyles} = STYLES;
const STYLELINES = Object.fromEntries(
  Object.entries(typeStyles)
    .map(([styleName, styles]) => [
      styleName,
      Object.entries({...baseStyles, ...styles})
        .map(([prop, val]) => `${prop}: ${val};`).join(" ")
    ])
);

/**
 * Runs a stack trace from the calling scope. If an ID is passed, it will be used to identify a previously-recorded trace from another scope. Both stack traces will be parsed and combined into a readable description of the caller's call chain.
 * @param caller - The calling class or function.
 * @param id - Optional ID string for a previously-recorded backtrace. If not provided, the standard stack trace will not be modified by a backtrace.
 * @returns The combined and parsed full stack trace of the caller's call chain.
 */
// const runBackTrace = (id?: IDString): string => {
//   if (!stackTrace) { return "StackTrace Unavailable"; }
//   if (id && _backTrace[id]) {
//     const backTrace = _backTrace[id].split("\n");
//     const parsedTrace = stackTrace.split("\n").map((line, i) => {
//       if (backTrace[i]) {
//         return `${line} // ${backTrace[i]}`;
//       }
//       return line;
//     });
//     return parsedTrace.join("\n");
//   }
//   return stackTrace;
// };

type DebugLevel = 0|1|2|3|4|5;
function isDebugLevel(level: unknown): level is DebugLevel {
  return typeof level === "number" && [0, 1, 2, 3, 4, 5].includes(level);
}

const eLogger = (type: "checkLog"|"log"|KeyOf<typeof STYLES> = "base", ...content: [string, ...unknown[]]) => {
  if (!CONFIG.debug.logging && type !== "display" && type !== "error") { return; }

  const dbLevel: DebugLevel = isDebugLevel(U.getLast(content)) ? content.pop() as DebugLevel : 3;
  if (((U.getSetting("debugLevel", "debugSettings") ?? 5) as DebugLevel) < dbLevel) { return; }

  if (type === "checkLog") {
    content.shift();
    type = "log";
  }
  const [message, ...data] = content;
  if (type === "log") {
    type = `${type}${dbLevel}`;
  }

  const stackTrace = type === "display" ? null : getStackTrace();

  let logFunc;
  if (stackTrace) {
    logFunc = console.groupCollapsed;
  } else if (data.length <= 1) {
    logFunc = console.log;
  } else {
    logFunc = console.group;
  }

  if (data.length === 0) {
    if (typeof message === "string") {
      logFunc(`%c${message}`, STYLELINES[type]);
    } else {
      logFunc("%o", message);
    }
  } else {
    logFunc(`%c${message}${typeof data[0] === "string" ? "" : " %o"}`, STYLELINES[type], data.shift());
    data.forEach((line) => {
      if (typeof line === "string") {
        console.log(line);
      } else {
        console.log("%o", line);
      }
    });
  }
  if (stackTrace) {
    console.group("%cSTACK TRACE", `color: ${getColor("gold", "dark")}; font-family: "Pragmata Pro"; font-size: 12px; background: ${getColor("black")}; font-weight: bold; padding: 0 10px;`);
    console.log(`%c${stackTrace}`, Object.entries(STYLES.stack).map(([prop, val]) => `${prop}: ${val};`).join(" "));
    console.groupEnd();
  }
  console.groupEnd();

  function filterStackTrace(traceString: string): string {
    const trace = traceString
      .split(/\n/)
      .slice(1)
      .filter((sLine) => !STACK_TRACE_EXCLUSIONS.some((rTest) => rTest.test(sLine)))
      .map((sLine, i, arr) => {
        let sL = sLine.trim();
        if (sL.includes("Object.fn")) {
          if (arr[i + 1]?.includes("at #call ")) {
            sL = sL.replace(/at Object\.fn (\(.*?([^/.]+)[^/]*\)\s*)$/, "at $2 Hook $1");
          } else {
            sL = sL.replace(/at((?: async)? Object\.fn \(.*?([^/.]+(?:\.\w+)?)[^/]*\)\s*)$/, "at $2$1");
          }
        }
        if (i === 0) { return `${sL.replace(/^at/, "LOGGED AT")}`; }
        return `  ${!STACK_TRACE_PROJECT_CODE.some((rTest) => rTest.test(sL)) ? "    ..." : ">>>"} ${sL.replace(/\bat /, "")}`;
      });

    // if (trace.length === 0) { return traceString; }
    // trace[0] = `${trace[0].replace(/^\s*[.>]{3} /, "LOGGED AT ")}`;

    return trace.join("\n");
  }

  function getStackTrace(): string {
    const trace = new Error();
    Error.captureStackTrace(trace, eLogger);
    return trace.stack
      ? filterStackTrace(trace.stack)
      : "... Stack Trace Unavailable ...";
  }
};

type eLogParams = [string, ...unknown[]];


function checkLog3(...content: eLogParams) {
  eLogger("checkLog", ...content, 3);
}

class Logger {
  static display(...content: eLogParams) { eLogger("display", ...content); }
  static log0(...content: eLogParams) { eLogger("log", ...content, 0); }
  static log1(...content: eLogParams) { eLogger("log", ...content, 1); }
  static log2(...content: eLogParams) { eLogger("log", ...content, 2); }
  static log(...content: eLogParams) { eLogger("log", ...content, 3); }
  static log3(...content: eLogParams) { eLogger("log", ...content, 3); }
  static log4(...content: eLogParams) { eLogger("log", ...content, 4); }
  static log5(...content: eLogParams) { eLogger("log", ...content, 5); }
  static checkLog0(...content: eLogParams) { eLogger("checkLog", ...content, 0); }
  static checkLog1(...content: eLogParams) { eLogger("checkLog", ...content, 1); }
  static checkLog2(...content: eLogParams) { eLogger("checkLog", ...content, 2); }
  static checkLog(...content: eLogParams) { eLogger("checkLog", ...content, 3); }
  static checkLog3(...content: eLogParams) { eLogger("checkLog", ...content, 3); }
  static checkLog4(...content: eLogParams) { eLogger("checkLog", ...content, 4); }
  static checkLog5(...content: eLogParams) { eLogger("checkLog", ...content, 5); }
  static warn(...content: eLogParams) { eLogger("warn", ...content); }
  static error(...content: eLogParams) { eLogger("error", ...content); }
  static hbsLog(...content: eLogParams) { eLogger("handlebars", ...content); }
}

// const logger = {
//   display:   (...content: eLogParams) => eLogger("display", ...content),
//   log0:      (...content: eLogParams) => eLogger("log", ...content, 0),
//   log1:      (...content: eLogParams) => eLogger("log", ...content, 1),
//   log2:      (...content: eLogParams) => eLogger("log", ...content, 2),
//   log:       (...content: eLogParams) => eLogger("log", ...content, 3),
//   log3:      (...content: eLogParams) => eLogger("log", ...content, 3),
//   log4:      (...content: eLogParams) => eLogger("log", ...content, 4),
//   log5:      (...content: eLogParams) => eLogger("log", ...content, 5),
//   checkLog0: (...content: eLogParams) => eLogger("checkLog", ...content, 0),
//   checkLog1: (...content: eLogParams) => eLogger("checkLog", ...content, 1),
//   checkLog2: (...content: eLogParams) => eLogger("checkLog", ...content, 2),
//   checkLog:  (...content: eLogParams) => eLogger("checkLog", ...content, 3),
//   checkLog3: (...content: eLogParams) => eLogger("checkLog", ...content, 3),
//   checkLog4: (...content: eLogParams) => eLogger("checkLog", ...content, 4),
//   checkLog5: (...content: eLogParams) => eLogger("checkLog", ...content, 5),
//   warn:      (...content: eLogParams) => eLogger("warn", ...content),
//   error:     (...content: eLogParams) => eLogger("error", ...content),
//   hbsLog:    (...content: eLogParams) => eLogger("handlebars", ...content)
// };

export default Logger;
