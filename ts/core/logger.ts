import U from "./utilities.js";
import C from "./constants.js";

const LOGGERCONFIG: Record<string,any> = {
  fullName: "eLogger",
  aliases: ["dbLog"],
  stackTraceExclusions: {
    handlebars: [/scripts\/handlebars/] // from internal Handlebars module
  }
};
// console.log(new RegExp(`at (getStackTrace|${LOGGERCONFIG.fullName}|${LOGGERCONFIG.aliases.map(String).join("|")}|Object\\.(log|display|hbsLog|error))`));

const STYLES = {
  base: {
    "background": C.Colors.BLACK,
    "color": C.Colors.bGOLD,
    "font-family": "Pragmata Pro",
    "padding": "0 25px",
    "margin-right": "25px"
  },
  log0: {
    "background": C.Colors.bGOLD,
    "color": C.Colors.dBLACK,
    "font-size": "16px"
  },
  log1: {
    "background": C.Colors.dBLACK,
    "color": C.Colors.gGOLD,
    "font-size": "16px"
  },
  log2: {
    "background": C.Colors.dBLACK,
    "color": C.Colors.bGOLD,
    "font-size": "16px"
  },
  log3: {
    "font-size": "14px"
  },
  log4: {
    "font-size": "12px"
  },
  log5: {
    "background": C.Colors.dGREY,
    "color": C.Colors.bGREY,
    "font-size": "10px"
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

const eLogger = (type: "checkLog"|"log"|KeyOf<typeof STYLES> = "base", ...content: [string, ...any[]]) => {
  let dbLevel: 0|1|2|3|4|5 = [0,1,2,3,4,5].includes(U.getLast(content))
    ? content.pop()
    : 3;
  let key: string|false = false;
  if (type === "checkLog") {
    key = content.shift();
    type = `log${dbLevel}`;
  }

  const [message, ...data] = content;

  if (key) {
    const blacklist = ((U.getSetting("blacklist") ?? "") as string).split(/\s*,\s*/).map((pat) => new RegExp(`\\b${pat}\\b`, "igu"));
    const whitelist = ((U.getSetting("whitelist") ?? "") as string).split(/\s*,\s*/).map((pat) => new RegExp(`\\b${pat}\\b`, "igu"));
    const isBlack = blacklist.some((pat) => pat.test(key as string));
    const isWhite = whitelist.some((pat) => pat.test(key as string));
    if (isBlack && !isWhite) {
      dbLevel = Math.max(4, Math.min(5, dbLevel + 2)) as 4|5;
    }
    if (isWhite && !isBlack) {
      dbLevel = Math.min(3, Math.max(1, dbLevel - 2)) as 1|2|3;
    }
  }
  if (U.getSetting("debug") as 0|1|2|3|4|5 < dbLevel) { return }
  if (type === "log") {
    type = `${type}${dbLevel}`;
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
    } else {
      logFunc("%o", message);
    }
  } else {
    logFunc(`%c${message}${typeof data[0] === "string" ? "" : " %o"}`, styleLine, data.shift());
    data.forEach((line) => {
      if (typeof line === "string") {
        console.log(line);
      } else {
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

  return;

  function getStackTrace(regExpFilters: RegExp[] = []): string|null {
    regExpFilters.push(new RegExp(`at (getStackTrace|${LOGGERCONFIG.fullName}|${
      LOGGERCONFIG.aliases.map(String).join("|")
    }|Object\\.(log|display|hbsLog|error))`), /^Error/);
    return ((new Error()).stack ?? "")
      .split(/\s*\n\s*/)
      .filter((sLine) => !regExpFilters.some((rTest) => rTest.test(sLine)))
      .join("\n");
    return null;
  }
};

type eLogParams = [string, ...any[]];
const eLog = {
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
  error: (...content: eLogParams) => eLogger("error", ...content),
  hbsLog: (...content: eLogParams) => eLogger("handlebars", ...content)
};

const registerDebugger = () => {
  Object.assign(globalThis, {eLog});
  Handlebars.registerHelper("eLog", eLog.hbsLog);
};

export default registerDebugger;