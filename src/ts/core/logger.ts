import U from "./utilities";
import {getColor} from "./helpers";

const LOGGERCONFIG = {
  fullName:             "eLogger",
  aliases:              ["dbLog"],
  stackTraceExclusions: {
    handlebars: [/scripts\/handlebars/] // From internal Handlebars module
  }
};


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

const eLogger = (type: "checkLog"|"log"|KeyOf<typeof STYLES> = "base", ...content: [string, ...unknown[]]) => {
  if (!(["error", "display"].includes(type) || CONFIG.debug.logging)) { return; }
  const lastElem = U.getLast(content);
  let trace: string|null = null;
  if (content[0].startsWith("StackTrace:")) {
    trace = (content.shift() as string)?.replace("StackTrace:", "") ?? null;
  }

  let dbLevel: 0|1|2|3|4|5 = typeof lastElem === "number" && [0, 1, 2, 3, 4, 5].includes(lastElem)
    ? content.pop() as 0|1|2|3|4|5
    : 3;
  let key: string|false = false;
  if (type === "checkLog") {
    key = content.shift() as string;
    type = `log${dbLevel}`;
  }

  const [message, ...data] = content;

  if (key) {
    const validKey: string = key;
    const blacklist = ((U.getSetting("blacklist", "debugSettings") ?? "") as string).split(/,/).map((pat) => new RegExp(`\\b${pat.trim()}\\b`, "igu"));
    const whitelist = ((U.getSetting("whitelist", "debugSettings") ?? "") as string).split(/,/).map((pat) => new RegExp(`\\b${pat.trim()}\\b`, "igu"));
    const isBlack = blacklist.some((pat) => pat.test(validKey));
    const isWhite = whitelist.some((pat) => pat.test(validKey));
    if (isBlack && !isWhite) {
      dbLevel = Math.max(4, Math.min(5, dbLevel + 2)) as 4|5;
    }
    if (isWhite && !isBlack) {
      dbLevel = Math.min(3, Math.max(1, dbLevel - 2)) as 1|2|3;
    }
  }
  if ((U.getSetting("debugLevel", "debugSettings") ?? 5) as 0|1|2|3|4|5 < dbLevel) { return; }
  if (type === "log") {
    type = `${type}${dbLevel}`;
  }
  let stackTrace: string|null;
  if (type === "display") {
    stackTrace = null;
  } else if (trace) {
    stackTrace = filterStackTrace(trace, LOGGERCONFIG.stackTraceExclusions[type as KeyOf<typeof LOGGERCONFIG["stackTraceExclusions"]>] ?? []);
  } else {
    stackTrace = getStackTrace(LOGGERCONFIG.stackTraceExclusions[type as KeyOf<typeof LOGGERCONFIG["stackTraceExclusions"]>] ?? []);
  }

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


  function parseStackTrace(traceString: string) {
    return traceString.split(/\n/).map((ln) => {
      const [_full, method, file, line, col] = ln.match(/at (.+) \((.+):(\d+):(\d+)\)/) ?? [];
      return {method, file, line, col};
    });
  }

  function filterStackTrace(traceString: string, regExpFilters: RegExp[] = []): string {
    regExpFilters.push(new RegExp(`at (getStackTrace|${LOGGERCONFIG.fullName}|${
      LOGGERCONFIG.aliases.map(String).join("|")
    }|Object\\.(log|display|hbsLog|error))`), /^Error/);
    return traceString
      .split(/\n/)
      .map((sLine) => sLine.trim())
      .filter((sLine) => !regExpFilters.some((rTest) => rTest.test(sLine)))
      .join("\n");
  }
  /**
   *
   * @param regExpFilters
   */
  function getStackTrace(regExpFilters: RegExp[] = []): string|null {
    return filterStackTrace((new Error()).stack ?? "", regExpFilters);
  }
};

type eLogParams = [string, ...unknown[]];
const logger = {
  display:   (...content: eLogParams) => eLogger("display", ...content),
  log0:      (...content: eLogParams) => eLogger("log", ...content, 0),
  log1:      (...content: eLogParams) => eLogger("log", ...content, 1),
  log2:      (...content: eLogParams) => eLogger("log", ...content, 2),
  log:       (...content: eLogParams) => eLogger("log", ...content, 3),
  log3:      (...content: eLogParams) => eLogger("log", ...content, 3),
  log4:      (...content: eLogParams) => eLogger("log", ...content, 4),
  log5:      (...content: eLogParams) => eLogger("log", ...content, 5),
  checkLog0: (...content: eLogParams) => eLogger("checkLog", ...content, 0),
  checkLog1: (...content: eLogParams) => eLogger("checkLog", ...content, 1),
  checkLog2: (...content: eLogParams) => eLogger("checkLog", ...content, 2),
  checkLog:  (...content: eLogParams) => eLogger("checkLog", ...content, 3),
  checkLog3: (...content: eLogParams) => eLogger("checkLog", ...content, 3),
  checkLog4: (...content: eLogParams) => eLogger("checkLog", ...content, 4),
  checkLog5: (...content: eLogParams) => eLogger("checkLog", ...content, 5),
  warn:      (...content: eLogParams) => eLogger("warn", ...content),
  error:     (...content: eLogParams) => eLogger("error", ...content),
  hbsLog:    (...content: eLogParams) => eLogger("handlebars", ...content),
  backTrace: (...content: eLogParams) => eLogger("checkLog", `StackTrace:${String(content.shift() ?? "")}`, ...content, 3)
};

export default logger;
