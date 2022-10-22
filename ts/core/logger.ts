import U from "./utilities.js";
import C from "./constants.js";

const getStackTrace = (regExpFilters: RegExp[] = []) => {
	regExpFilters.push(/at (getStackTrace|k4Logger|dbLog|Object\.(log|display|hbsLog|error))/, /^Error/);
	const stackTrace = (new Error()).stack;
	if (stackTrace) {
		return stackTrace
			.split(/\s*\n\s*/)
			.filter((sLine) => !regExpFilters.some((rTest) => rTest.test(sLine)))
			.join("\n");
	}
	return null;
};
const k4Logger = (type: KeyOf<typeof STYLES> = "base", ...content: [string, ...any[]]) => {
	const [message, ...data] = content;
	const dbLevel: 0|1|2|3|4|5 = [0,1,2,3,4,5].includes(U.getLast(data))
		? data.pop()
		: 3;
	if (U.getSetting("debug") as 0|1|2|3|4|5 < dbLevel) { return }
	const stackTrace = type === "display"
		? null
		: getStackTrace(type === "handlebars" ? [/scripts\/handlebars/] : []);
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
		"font-family": "AlverataInformalW01-Regular",
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

const kLog = {
	display: (...content: [string, ...any[]]) => k4Logger("display", ...content),
	log: (...content: [string, ...any[]]) => k4Logger("base", ...content),
	error: (...content: [string, ...any[]]) => k4Logger("error", ...content),
	hbsLog: (...content: [string, ...any[]]) => k4Logger("handlebars", ...content)
};

const registerDebugger = () => {
	Object.assign(globalThis, {kLog});
};

export default registerDebugger;