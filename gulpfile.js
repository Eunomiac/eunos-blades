/* eslint-disable @typescript-eslint/no-var-requires,  */
// #region ▮▮▮▮▮▮▮ IMPORTS ▮▮▮▮▮▮▮ ~
const {src, dest, watch, series, parallel, registry} = require("gulp");
const plumber = require("lazypipe");
const plunger = require("gulp-plumber");
const merger = require("merge2");
const logger = require("fancy-log");
const debug = require("gulp-debug");

const cleaner = require("del");
const renamer = require("gulp-rename");
const header = require("gulp-header");
const replacer = require("gulp-replace");

const typescript = require("gulp-typescript");
const terser = require("gulp-terser");

const sasser = require("gulp-sass")(require("node-sass"));
const bundler = require("gulp-postcss");
// const filler = require("cq-prolyfill/postcss-plugin");
const prefixer = require("autoprefixer");
const minifier = require("cssnano");

const packageJSON = require("./package");

const {analyzeProject} = require("codehawk-cli");
// #endregion ▮▮▮▮[IMPORTS]▮▮▮▮

// #region ▮▮▮▮▮▮▮[UTILITY] Data References & Utility Functions for File Parsing ▮▮▮▮▮▮▮ ~
const ANSICOLORS = {
	// RESET
	x: "\u001b[0m",

	// Standard Colors
	black: "\u001b[30m",
	grey: "\u001b[30;1m",
	red: "\u001b[31m",
	green: "\u001b[32m",
	yellow: "\u001b[33m",
	blue: "\u001b[34m",
	magenta: "\u001b[35m",
	cyan: "\u001b[36m",
	white: "\u001b[37m",

	// Bright Colors
	bred: "\u001b[31;1m",
	bgreen: "\u001b[32;1m",
	byellow: "\u001b[33;1m",
	bblue: "\u001b[34;1m",
	bmagenta: "\u001b[35;1m",
	bcyan: "\u001b[36;1m",
	bwhite: "\u001b[37;1m",

	// Standard Background Colors
	bgblack: "\u001b[40m",
	bggrey: "\u001b[40;1m",
	bgred: "\u001b[41m",
	bggreen: "\u001b[42m",
	bgyellow: "\u001b[43m",
	bgblue: "\u001b[44m",
	bgmagenta: "\u001b[45m",
	bgcyan: "\u001b[46m",
	bgwhite: "\u001b[47m",

	// Bright Background Colors
	bgbred: "\u001b[41;1m",
	bgbgreen: "\u001b[42;1m",
	bgbyellow: "\u001b[43;1m",
	bgbblue: "\u001b[44;1m",
	bgbmagenta: "\u001b[45;1m",
	bgbcyan: "\u001b[46;1m",
	bgbwhite: "\u001b[47;1m",

	// Styles
	none: "",
	bold: "\u001b[1m",
	underline: "\u001b[4m",
	invert: "\u001b[7m"
};
const STREAMSTYLES = {
	gulp: ["grey", "█", "(gulp)"],
	initWhiteSpace: ["bred", "█", "(staging)"],
	tsInit: ["blue", "░", " TS "],
	jsFull: ["bmagenta", "█", " JS "],
	jsMin: ["magenta", "░", " js "],
	cssFull: ["byellow", "█", " SCSS "],
	cssMin: ["yellow", "░", " scss "],
	hbs: ["bblue", "█", " HBS "],
	toDest: ["bgreen", "█", " ASSETS "]
};
const ansi = (str, {fg, bg, style} = {}) => {
	fg = ANSICOLORS[fg ?? "white"];
	bg = ANSICOLORS[`bg${bg ?? "black"}`.replace(/^bg+/, "bg")];
	style = ANSICOLORS[style ?? "none"];
	return [bg, fg, style, str, ANSICOLORS.x].join("");
};
const toBright = (color) => (`b${color}` in ANSICOLORS ? `b${color}` : color);
const toDim = (color) => (color.slice(1) in ANSICOLORS ? color.slice(1) : color);
const toBg = (color) => `bg${color}`.replace(/^(bg)+/, "");
const logParts = {
	tag: (tag = "gulp", color = "white", padChar = "█") => ansi(`▌${centerString(tag, 10, padChar)}▐`, {fg: color}),
	error: (tag, message) => [ansi(`[ERROR: ${tag}]`, {fg: "white", bg: "red", style: "bold"}), ansi(message, {fg: "red"})].join(" "),
	finish: function alertFinish(title, source, destination) {
		title ??= "gulp";
		const [color, padChar, tag] = STREAMSTYLES[title];
		return [
			this.tag(tag, color, padChar),
			" ",
			ansi(source, {fg: toBright(color), style: "underline"}),
			ansi(" successfully piped to ", {fg: toDim(color), style: "none"}),
			ansi(destination, {fg: toBright(color), style: "underline"})
		].join("");
	}
};
const centerString = (str, width, padChar = " ") => {
	let padString = `${str}`;
	while (padString.length < width) {
		padString = `${padChar}${padString}${padChar}`;
	}
	return padString.length > width ? padString.slice(1) : padString;
};
const padHeaderLines = (match) => {
	const padLine = (line, length) => {
		const padLength = length - line.length;
		if (padLength > 0) {
			const [padLeft, padRight] = [Math.ceil(padLength / 2), Math.ceil(padLength / 2)];
			const [lineLeft, lineRight] = [
				line.slice(0, Math.floor(line.length / 2)),
				line.slice(Math.floor(line.length / 2))
			];
			// Two types of padding: '█' and '░'. Count amount of each to get relative ratio.
			const fadePad = lineLeft.match(/░+/u)?.pop().length ?? 0;
			const fullFadeRatio = fadePad === 0 ? 1 : (lineLeft.match(/░+/)?.pop().length ?? 0) / fadePad;
			let numFullPadLeft = Math.round((fullFadeRatio * padLeft) / (1 + fullFadeRatio)),
							numFadePadLeft = 0,
							numFullPadRight = Math.round((fullFadeRatio * padRight) / (1 + fullFadeRatio)),
							numFadePadRight = 0;
			if (fadePad > 0) {
				numFadePadLeft = padLeft - numFullPadLeft;
				numFadePadRight = padRight - numFullPadRight;
			} else {
				numFullPadLeft = padLeft;
				numFullPadRight = padRight;
			}
			numFullPadRight += padLength - (numFullPadLeft + numFadePadLeft + numFullPadRight + numFadePadRight);
			return [
				lineLeft.replace(/▌█/u, `▌${"█".repeat(numFullPadLeft + 1)}`).replace(/░/u, "░".repeat(numFadePadLeft + 1)),
				lineRight.replace(/█▐/u, `${"█".repeat(numFullPadRight + 1)}▐`).replace(/░/u, "░".repeat(numFadePadRight + 1))
			].join("");
		}
		return line;
	};
	const lines = match.split(/\n/s);
	const returnLines = [];
	let [maxIndex, maxLen] = [0, 0];
	lines.forEach((line, i) => {
		if (line.length > maxLen) {
			maxIndex = i;
			maxLen = line.length;
		}
	});
	lines.forEach((line) => {
		if (line.length < maxLen) {
			returnLines.push(padLine(line, maxLen));
		} else {
			returnLines.push(line);
		}
	});
	return returnLines.join("\n");
};
const roundNum = (num, sigDigits = 0) => (sigDigits === 0 ? Math.round(num) : Math.round(num * (10 ** sigDigits)) / (10 ** sigDigits));
const subGroup = (array, groupSize) => {
	const subArrays = [];
	while (array.length > groupSize) {
		const subArray = [];
		while (subArray.length < groupSize) {
			subArray.push(array.shift());
		}
		subArrays.push(subArray);
	}
	subArrays.push(array);
	return subArrays;
};
// #endregion ▮▮▮▮[UTILITY]▮▮▮▮

const ISMINIFYINGJS = false;
const ISBUILDINGDIST = false;
const ISDEPLOYING = false;
const ISANALYZING = false;
const ISGENERATINGTYPEFILES = false;

const PACKAGEFOLDER = "eunos-blades";
const PACKAGENAME = "Euno's Blades in the Dark";
const PACKAGETYPE = "system";

const DISTDATAROOT = "C:/Users/Ryan/Documents/Projects/!!!!CODING/FoundryVTT/FoundryDistData/Data";
const DISTROOT = `${DISTDATAROOT}/${PACKAGETYPE}s/${PACKAGEFOLDER}`;

// #region ████████ CONFIGURATION: Banner Headers, Source/Destination Globs, Build Behavior ████████
// #region ░░░░░░░[BANNERS]░░░░░░░ ~
const dateStringFull = ISDEPLOYING ? `█ ${new Date().toString().match(/\b[A-Z][a-z]+ \d+ \d+/u).shift()} █` : "██";
const dateStringMin = ISDEPLOYING ? ` (${new Date().getFullYear()})` : "";
const BANNERTEMPLATE = {
	full: `/*~ ****▌███████████████████████████████████████████████████████████████████████████▐**** *\\
|*~     ▌█░░░░░░░░░ ${PACKAGENAME} for Foundry VTT ░░░░░░░░░░░█▐     *|
|*~     ▌██████████████████░░░░░░░░░░░░░ by Eunomiac ░░░░░░░░░░░░░██████████████████▐     *|
|*~     ▌█ <%= package.license %> License █ v<%= package.version %> ${dateStringFull}▐     *|
|*~     ▌████░░░░ <%= package.repository.url %> ░░░░█████▐     *|
\\*~ ****▌███████████████████████████████████████████████████████████████████████████▐**** */
/*~ @@DOUBLE-BLANK@@ ~*/\r\n`,
	min: [
		`/*~ ▌██░░ <%= package.name %> v<%= package.version %>${dateStringMin}`,
		"<%= package.license %> License",
		"<%= package.url %> ░░██▐ */"
	].join(" ║ ")
};
// #endregion ░░░░[BANNERS]░░░░
// #region ░░░░░░░[BUILD FILES]░░░░░░░░ ~
const BUILDFILES = {
	ts: {
		"./module_staging_1/": ["ts/**/*.*s"]
	},
	js: {
		"./module/": ["module_staging_1/**/*.js"]
	},
	js_1: {
		"./module_staging_2/": ["module_staging_1/**/*.js"]
	},
	js_2: {
		"./module/": ["module_staging_2/**/*.js"]
	},
	css: {
		"./css/": ["scss/**/*.scss"]
	},
	hbs: {
		"./templates/": ["DISABLE"]
	},
	quickAssets: {
		"./assets/": ["DISABLE"],
		"./css/": ["scss/**/*.css"]
	},
	slowAssets: {
		"./assets/": ["DISABLE"]
	}
};

if (ISBUILDINGDIST) {
	BUILDFILES.js ??= {};
	BUILDFILES.js[`${DISTROOT}/module/`] = ["module/**/*.js"];
	BUILDFILES.css ??= {};
	BUILDFILES.css[`${DISTROOT}/css/`] = ["scss/**/*.scss"];
	BUILDFILES.hbs ??= {};
	BUILDFILES.hbs[`${DISTROOT}/templates/`] = ["templates/**/*.hbs", "templates/**/*.html"];
	BUILDFILES.quickAssets ??= {};
	BUILDFILES.quickAssets[`${DISTROOT}/`] = ["system.json", "template.json", /* "LICENSE.txt", */ "package.json"];
	BUILDFILES.quickAssets[`${DISTROOT}/css/`] = ["scss/**/*.css"];
	BUILDFILES.slowAssets ??= {};
	BUILDFILES.slowAssets[`${DISTROOT}/assets/`] = ["assets/**/*.*"];
	BUILDFILES.slowAssets[`${DISTROOT}/packs/`] = ["packs/**/*.*"];
	BUILDFILES.slowAssets[`${DISTROOT}/lang/`] = ["lang/**/*.*"];
}
// #endregion ░░░░[BUILD FILES]░░░░
// #region ░░░░░░░[REGEXP PATTERNS]░░░░░░░ ~
const REGEXPPATTERNS = {
	/* ALWAYS USE FLAGS:
			g --- global & enables capturing groups
			u --- handles expanded unicode characters AND enables strict checks of RegExp syntax

		 OPTIONAL FLAGS:
		  i --- ignore case
			s --- . dot character WILL match newline characters
			m --- ^ and $ characters WILL match start/end of lines, instead of start/end of entire string
			y --- starts search from <lastIndex> on; lastIndex must be supplied as a property

		 REGEXP PHRASES:
			(\r\n)?\s*? --- capture any line break, then consume blank space at start of line
										  reverse, for end-of-lines: \s*?(\r\n)?
	*/
	init: new Map([
		[/^\s+$/mg, "/*~ @@DOUBLE-BLANK@@ ~*/"] // Replace double-blank lines with token for later retrieval
	]),
	ts: new Map([
		[/from "gsap\/all"/gu, "from \"/scripts/greensock/esm/all.js\""]
	]),
	js: new Map([
		(ISDEPLOYING || ISBUILDINGDIST) ? [/(\r\n)?\s*?(\/\*DEVCODE\*\/.*?\/\*!DEVCODE\*\/)\s*?(\r\n)?/gsm, ""] : [/`/, "`"], // Strip developer code
		[/\/\*~\s*\*{4}▌.*?▐\*{4}\s*\*\//s, padHeaderLines], // Pad header lines to same length
		[/\/\/\s*#region/gi, "//~ #region"], // Prefix #region lines with tildes so they aren't stripped
		[/\/\*\*(?!~)(?:.|\r?\n|\r)*?\*\/[ \t]*(\r?\n?)/g, ""], // Strip multi-line comments unless they beginning with '/*~' or '/**~'
		[/\/\*(?!\*|~)(?:.|\r?\n|\r)*?\*\/[ \t]*(\r?\n?)/g, ""], // Strip multi-line comments unless they beginning with '/*~' or '/**~'
		[/(\r?\n?)[ \t]*\/\/(?!~) .*?$/gm, "$1"], // Strip single-line comments unless they begin with '//~'
		[/(\/\/|\/\*\*?|\|\*|\\\*)~/gm, "$1"], // Strip tildes from comment line prefixes
		[/#(region.*?)[ \t]*~$/gim, "#$1"], // Strip '~' from end-of-lines (used for automatic region folding)
		[/#reg.*? /gs, ""], // Convert region headers to standard headers
		[/((\r?\n)[ \t]*(?:\r?\n))+/g, "\r\n"], // Strip excess blank lines
		[/([ \t]*\r?\n\/\*~? @@DOUBLE\-BLANK@@ ~\*\/)+/g, "\r\n/*~ @@DOUBLE-BLANK@@ ~*/"], // Collapse multiple double-blank lines
		[/\/\*~? @@DOUBLE\-BLANK@@ ~\*\//g, ""], // Restore double-blank lines
		[/([ \t]*\r?\n)*$/, ""], // Strip whitespace from end of files
		[/^([ \t]*\r?\n)*/, ""] // Strip whitespace from start of files
	])
};
// #endregion ░░░░[REGEXP PATTERNS]░░░░
// #region ░░░░░░░[PIPES & PLUMBING]░░░░ Assembly of Pipes for Passing Streams ░░░░░░░ ~
// #region ====== PIPES: Basic Functionality ====== ~
const PIPES = {
	openPipe: (title = "gulp") => {
		const [titleColor, padChar, tagName] = STREAMSTYLES[title] ?? ["red", "?", "???"];
		return plumber()
			.pipe(debug, {
				title: logParts.tag(tagName, titleColor, padChar),
				minimal: true,
				showFiles: true,
				showCount: false
			})
			.pipe(plunger, function errorReporter(err) {
				logger.error(logParts.error(title, err.message));
				this.emit("end");
			});
	},
	replacer: (format) => {
		let pipeline = plumber();
		if (format in REGEXPPATTERNS) {
			REGEXPPATTERNS[format].forEach((rParam, sParam) => {
				pipeline = pipeline.pipe(replacer, sParam, rParam);
			});
		}
		return pipeline;
	},
	tsProject: typescript.createProject("tsconfig.json", {declaration: ISGENERATINGTYPEFILES, emitDeclarationOnly: ISGENERATINGTYPEFILES}),
	terser: () => plumber().pipe(terser, {
		parse: {},
		compress: {},
		mangle: {
			properties: {}
		},
		format: {},
		sourceMap: {},
		ecma: 2020,
		module: true
	}),
	closePipe: (title, source, destination) => {
		const thisDest = dest(destination);
		thisDest.on("finish", () => logger(logParts.finish(title, source, destination)));
		return thisDest;
	}
};
// #endregion ___ PIPES ___

const PLUMBING = {
	analyzeJS: async function analyzeJS(done) {
		if (!ISANALYZING) { return done() }
		try {
			const analysisData = analyzeProject("./");
			const returnData = {
				AVERAGE: roundNum(analysisData.summary.average, 2),
				MEDIAN: roundNum(analysisData.summary.median, 2),
				WORST: roundNum(analysisData.summary.worst, 2)
			};
			analysisData.resultsList.forEach(async ({filename, complexityReport, timesDependedOn}) => {
				returnData[filename] = {
					cyclomatic: `${complexityReport.aggregate.cyclomatic} (Density: ${roundNum(complexityReport.aggregate.cyclomaticDensity, 2)})`,
					halstead: subGroup(Object.entries(complexityReport.aggregate.halstead)
						.map(([test, result], i) => {
							let resultString = `[${test}] `;
							if (typeof result === "object") {
								resultString += `${result.distinct} (${result.total} total) `;
							} else {
								resultString += `${roundNum(result, 3)} `;
							}
							return resultString;
						}), 3)
						.map((subArray) => subArray.join(" ")),
					params: complexityReport.aggregate.paramCount,
					sloc: `Logical: ${complexityReport.aggregate.sloc.logical}, Physical: ${complexityReport.aggregate.sloc.physical}`,
					maintainability: roundNum(complexityReport.maintainability, 2),
					codehawkScore: roundNum(complexityReport.codehawkScore, 3),
					coverage: complexityReport.coverage,
					timesDependedOn
				};
			});
			let analysisString = JSON.stringify(returnData, null, 2);
			while (analysisString.length > 150_000) {
				logger(analysisString.slice(0, 150_000));
				analysisString = analysisString.slice(150_000);
				logger(" ");
				logger(`${analysisString.length} to go ...`);
				await new Promise((resolve) => setTimeout(resolve, 20000));
			}
			logger(analysisString);
		} catch (err) {
			return done();
		}
		return done();
	},
	initDest: function initDist(done, destGlobs = ["./dist/", "./module/", "./module_staging_1", "./module_staging_2", "./css/"]) {
		try {
			cleaner.sync(destGlobs);
		} catch (err) {
			return done();
		}
		return done();
	},
	watch: function watchUpdates() {
		for (const [type, globs] of Object.entries(BUILDFILES)) {
			Object.values(globs ?? {}).forEach((glob) => watch(glob, BUILDFUNCS[type]));
		}
	},
	tsInit: (source, destination) => function pipeTypeScript() {
		const tsStream = src(source, {allowEmpty: true})
			.pipe(PIPES.openPipe("tsInit")())
			.pipe(PIPES.replacer("init")())
			.pipe(PIPES.tsProject());
		if (ISGENERATINGTYPEFILES) {
			return merger([
				tsStream.js
					.pipe(PIPES.replacer("ts")())
					.pipe(PIPES.closePipe("tsInit", source, destination)),
				tsStream.dts
					.pipe(PIPES.closePipe("tsInit", source, `${destination}definitions`))
			]);
		}
		return tsStream
			.pipe(PIPES.replacer("ts")())
			.pipe(PIPES.replacer("js")())
			.pipe(PIPES.closePipe("tsInit", source, destination));
	},
	jsFull: (source, destination) => function pipeFullJS() {
		return src(source, {allowEmpty: true})
			.pipe(PIPES.openPipe("jsFull")())
			.pipe(header(BANNERS.js.full, {"package": packageJSON}))
			.pipe(PIPES.replacer("js")())
			.pipe(PIPES.closePipe("jsFull", source, destination));
	},
	jsMin: (source, destination) => function pipeMinJS() {
		return src(source, {allowEmpty: true})
			.pipe(PIPES.openPipe("jsMin")())
			.pipe(header(BANNERS.js.min, {"package": packageJSON}))
			.pipe(PIPES.replacer("js")())
			// .pipe(renamer({suffix: ".min"}))
			.pipe(PIPES.terser()())
			.pipe(PIPES.closePipe("jsMin", source, destination));
	},
	cssFull: (source, destination) => function pipeFullCSS() {
		return src(source, {allowEmpty: true})
			.pipe(PIPES.openPipe("cssFull")())
			.pipe(sasser({outputStyle: "nested"}))
			.pipe(bundler([
				// filler(),
				prefixer({cascade: false})
			]))
			.pipe(PIPES.closePipe("cssFull", source, destination));
	},
	cssMin: (source, destination) => function pipeMinCSS() {
		return src(source, {allowEmpty: true})
			.pipe(PIPES.openPipe("cssMin")())
			.pipe(sasser({outputStyle: "compressed"}))
			.pipe(bundler([
				// filler(),
				prefixer({cascade: false}),
				minifier()
			]))
			.pipe(header(BANNERS.css.min, {"package": packageJSON}))
			.pipe(renamer({suffix: ".min"}))
			.pipe(PIPES.closePipe("cssMin", source, destination));
	},
	hbs: (source, destination) => function pipeHBS() {
		return src(source, {allowEmpty: true})
			.pipe(PIPES.openPipe("hbs")())
			.pipe(PIPES.closePipe("hbs", source, destination));
	},
	toDest: (source, destination) => function pipeToDest() {
		return src(source, {allowEmpty: true}).pipe(PIPES.openPipe("toDest")()).pipe(PIPES.closePipe("toDest", source, destination));
	}
};
// #endregion ░░░░[PIPES & PLUMBING]░░░░
// #endregion ▄▄▄▄▄ CONFIGURATION ▄▄▄▄▄

// #region ▒░▒░▒░▒[INITIALIZATION]▒░▒░▒░▒ ~

const BANNERS = {
	js: {...BANNERTEMPLATE},
	css: {...BANNERTEMPLATE}
};

const BUILDFUNCS = {};
// #endregion ▒▒▒▒[INITIALIZATION]▒▒▒▒

// #region ████████ JS: Compiling Javascript ████████ ~
BUILDFUNCS.ts /* series(
	PLUMBING.initWhiteSpace, */
	= parallel(...((buildFiles) => {
		const funcs = [];
		for (const [destGlob, sourceGlobs] of Object.entries(buildFiles)) {
			sourceGlobs.forEach((sourceGlob) => {
				funcs.push(PLUMBING.tsInit(sourceGlob, destGlob));
			});
		}
		return funcs;
	})(BUILDFILES.ts));
// );

const jsBuildFuncs = [
	parallel(...((buildFiles) => {
		const funcs = [];
		for (const [destGlob, sourceGlobs] of Object.entries(buildFiles)) {
			sourceGlobs.forEach((sourceGlob) => {
				funcs.push(PLUMBING.jsFull(sourceGlob, destGlob));
			});
		}
		return funcs;
	})(ISMINIFYINGJS ? BUILDFILES.js_1 : BUILDFILES.js))
];

if (ISMINIFYINGJS) {
	jsBuildFuncs.push(parallel(...((buildFiles) => {
		const funcs = [];
		for (const [destGlob, sourceGlobs] of Object.entries(buildFiles)) {
			sourceGlobs.forEach((sourceGlob) => {
				funcs.push(PLUMBING.jsMin(sourceGlob, destGlob));
			});
		}
		return funcs;
	})(BUILDFILES.js_2)));
}

BUILDFUNCS.js = series(
	...jsBuildFuncs,
	PLUMBING.analyzeJS
);
// #endregion ▄▄▄▄▄ JS ▄▄▄▄▄

// #region ████████ CSS: Compiling CSS ████████ ~
BUILDFUNCS.css = parallel(...((sourceDestGlobs) => Object.entries(sourceDestGlobs)
	.map(([destGlob, sourceGlobs]) => [...sourceGlobs
		.map((sourceGlob) => [
			PLUMBING.cssFull(sourceGlob, destGlob),
			PLUMBING.cssMin(sourceGlob, destGlob)
		])
	]).flat())(BUILDFILES.css).flat());

// BUILDFUNCS.css = parallel(...((sourceDestGlobs) => {
// 	const funcs = [];
// 	for (const [destGlob, sourceGlobs] of Object.entries(sourceDestGlobs)) {
// 		const formatType = /dist/.test(destGlob) ? "cssMin" : "cssFull";
// 		funcs.push(PLUMBING[formatType](sourceGlobs[0], destGlob));
// 	}
// 	logger(`There are ${funcs.length} CSS Build Funcs.`);
// 	return funcs;
// })(BUILDFILES.css));
// #endregion ▄▄▄▄▄ CSS ▄▄▄▄▄

// #region ████████ HBS: Compiling HBS ████████ ~

BUILDFUNCS.hbs = parallel(...((sourceDestGlobs) => {
	const funcs = [];
	for (const [destGlob, sourceGlobs] of Object.entries(sourceDestGlobs)) {
		sourceGlobs.forEach((sourceGlob) => {
			funcs.push(PLUMBING.hbs(sourceGlob, destGlob));
		});
	}
	return funcs;
})(BUILDFILES.hbs));
// #endregion ▄▄▄▄▄ HBS ▄▄▄▄▄

// #region ████████ ASSETS: Copying Assets to Dist ████████ ~
const assetPipe = (sourceDestGlobs) => {
	const funcs = [];
	for (const [destGlob, sourceGlobs] of Object.entries(sourceDestGlobs)) {
		sourceGlobs.forEach((sourceGlob) => funcs.push(PLUMBING.toDest(sourceGlob, destGlob)));
	}
	return funcs;
};

BUILDFUNCS.quickAssets = parallel(...assetPipe(BUILDFILES.quickAssets));
BUILDFUNCS.slowAssets = parallel(...assetPipe(BUILDFILES.slowAssets));
// #endregion ▄▄▄▄▄ ASSETS ▄▄▄▄▄

// #region ▒░▒░▒░▒[EXPORTS]▒░▒░▒░▒ ~
const {ts, js, quickAssets, ...parallelBuildFuncs} = BUILDFUNCS;

exports.default = series(PLUMBING.initDest, parallel(series(ts, js, quickAssets), ...Object.values(parallelBuildFuncs)), PLUMBING.watch);
// #endregion ▒▒▒▒[EXPORTS]▒▒▒▒
