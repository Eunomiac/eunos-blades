import U from "./utilities";
import C from "./constants";

const LOGGERCONFIG = {
  fullName: "eLogger",
  aliases: ["dbLog"],
  stackTraceExclusions: {
    handlebars: [/scripts\/handlebars/] // From internal Handlebars module
  }
};


const STYLES = {
  base: {
    background: C.Colors.BLACK,
    color: C.Colors.dGOLD,
    "font-family": "Pragmata Pro",
    padding: "0 25px",
    "margin-right": "25px"
  },
  log0: {
    background: C.Colors.dGOLD,
    color: C.Colors.dBLACK,
    "font-size": "16px"
  },
  log1: {
    background: C.Colors.dBLACK,
    color: C.Colors.bGOLD,
    "font-size": "16px"
  },
  log2: {
    background: C.Colors.dBLACK,
    color: C.Colors.dGOLD,
    "font-size": "16px"
  },
  log3: {
    "font-size": "14px"
  },
  log4: {
    "font-size": "12px"
  },
  log5: {
    background: C.Colors.dGREY,
    color: C.Colors.bGREY,
    "font-size": "10px"
  },
  display: {
    color: C.Colors.bGOLD,
    "font-family": "Kirsty",
    "font-size": "16px",
    "margin-left": "-100px",
    padding: "0 100px"
  },
  warn: {
    color: C.Colors.dBLACK,
    background: C.Colors.dGOLD,
    "font-weight": 500
  },
  error: {
    color: C.Colors.bRED,
    background: C.Colors.ddRED,
    "font-weight": 500
  },
  handlebars: {
    background: C.Colors.GREY,
    color: C.Colors.BLUE,
    "font-family": "Pragmata Pro",
    padding: "0",
    "margin-right": "25px"
  },
  stack: {
    color: C.Colors.GOLD,
    "font-weight": 100,
    "font-size": "10px",
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
    const blacklist = ((U.getSetting("blacklist") ?? "") as string).split(/,/).map((pat) => new RegExp(`\\b${pat.trim()}\\b`, "igu"));
    const whitelist = ((U.getSetting("whitelist") ?? "") as string).split(/,/).map((pat) => new RegExp(`\\b${pat.trim()}\\b`, "igu"));
    const isBlack = blacklist.some((pat) => pat.test(key as string));
    const isWhite = whitelist.some((pat) => pat.test(key as string));
    if (isBlack && !isWhite) {
      dbLevel = Math.max(4, Math.min(5, dbLevel + 2)) as 4|5;
    }
    if (isWhite && !isBlack) {
      dbLevel = Math.min(3, Math.max(1, dbLevel - 2)) as 1|2|3;
    }
  }
  if ((U.getSetting("debug") ?? 5) as 0|1|2|3|4|5 < dbLevel) { return; }
  if (type === "log") {
    type = `${type}${dbLevel}`;
  }
  const stackTrace = type === "display"
    ? null
    : getStackTrace(LOGGERCONFIG.stackTraceExclusions[type as KeyOf<typeof LOGGERCONFIG["stackTraceExclusions"]>] ?? []);

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
    console.group("%cSTACK TRACE", `color: ${C.Colors.dGOLD}; font-family: "Pragmata Pro"; font-size: 12px; background: ${C.Colors.BLACK}; font-weight: bold; padding: 0 10px;`);
    console.log(`%c${stackTrace}`, Object.entries(STYLES.stack).map(([prop, val]) => `${prop}: ${val};`).join(" "));
    console.groupEnd();
  }
  console.groupEnd();


  /**
   *
   * @param regExpFilters
   */
  function getStackTrace(regExpFilters: RegExp[] = []): string|null {
    regExpFilters.push(new RegExp(`at (getStackTrace|${LOGGERCONFIG.fullName}|${
      LOGGERCONFIG.aliases.map(String).join("|")
    }|Object\\.(log|display|hbsLog|error))`), /^Error/);
    return ((new Error()).stack ?? "")
      .split(/\n/)
      .map((sLine) => sLine.trim())
      .filter((sLine) => !regExpFilters.some((rTest) => rTest.test(sLine)))
      .join("\n");
  }
};

type eLogParams = [string, ...unknown[]];
const logger = {
  display: (...content: eLogParams) => eLogger("display", ...content),
  log0: (...content: eLogParams) => eLogger("log", ...content, 0),
  log1: (...content: eLogParams) => eLogger("log", ...content, 1),
  log2: (...content: eLogParams) => eLogger("log", ...content, 2),
  log: (...content: eLogParams) => eLogger("log", ...content, 3),
  log3: (...content: eLogParams) => eLogger("log", ...content, 3),
  log4: (...content: eLogParams) => eLogger("log", ...content, 4),
  log5: (...content: eLogParams) => eLogger("log", ...content, 5),
  checkLog0: (...content: eLogParams) => eLogger("checkLog", ...content, 0),
  checkLog1: (...content: eLogParams) => eLogger("checkLog", ...content, 1),
  checkLog2: (...content: eLogParams) => eLogger("checkLog", ...content, 2),
  checkLog: (...content: eLogParams) => eLogger("checkLog", ...content, 3),
  checkLog3: (...content: eLogParams) => eLogger("checkLog", ...content, 3),
  checkLog4: (...content: eLogParams) => eLogger("checkLog", ...content, 4),
  checkLog5: (...content: eLogParams) => eLogger("checkLog", ...content, 5),
  warn: (...content: eLogParams) => eLogger("warn", ...content),
  error: (...content: eLogParams) => eLogger("error", ...content),
  hbsLog: (...content: eLogParams) => eLogger("handlebars", ...content)
};

export default logger;
