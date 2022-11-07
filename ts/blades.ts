// #region ▮▮▮▮▮▮▮ IMPORTS ▮▮▮▮▮▮▮ ~
import C, {IMPORTDATA, BladesActorType, BladesItemType} from "./core/constants.js";
import registerSettings, {initTinyMCEStyles, initCanvasStyles, initFonts} from "./core/settings.js";
import H, {registerHandlebarHelpers, preloadHandlebarsTemplates} from "./core/helpers.js";
import U from "./core/utilities.js";
import registerDebugger from "./core/logger.js";

import BladesActor from "./blades-actor.js";
import BladesItem from "./blades-item.js";
import BladesItemSheet from "./sheets/blades-item-sheet.js";
import BladesActorSheet from "./sheets/blades-actor-sheet.js";
import BladesCrewSheet from "./sheets/blades-crew-sheet.js";
import BladesNPCSheet from "./sheets/blades-npc-sheet.js";
import BladesFactionSheet from "./sheets/blades-faction-sheet.js";

import {bladesRoll, simpleRollPopup} from "./blades-roll.js";
import BladesDialog from "./blades-dialog.js";
import BladesActiveEffect from "./blades-active-effect.js";
import BladesTrackerSheet from "./sheets/blades-tracker-sheet.js";
import BladesClockKeeperSheet from "./sheets/blades-clock-keeper-sheet.js";

let socket: Socket; //~ SocketLib interface
registerDebugger();
// #endregion ▮▮▮▮[IMPORTS]▮▮▮▮

// #region Globals: Exposing Functionality to Global Scope ~
/*DEVCODE*/Object.assign(
	globalThis,
	{
		BladesActor,
		BladesActorSheet,
		BladesCrewSheet,
		BladesFactionSheet,
		BladesNPCSheet,
		BladesClockKeeperSheet,
		BladesTrackerSheet,
		BladesActiveEffect,
		IMPORTDATA,
		bladesRoll,
		simpleRollPopup,
		H,
		U,
		C,
		BladesItem,
		BladesItemSheet,
		ClearNPCs: () => {
			const npcNames = IMPORTDATA.npcs.map(({name}) => name);
			const npcs = Array.from(game.actors ?? [])
				.filter((actor) => npcNames.includes(actor.name ?? ""));
			return Promise.all(npcs.map((npc) => npc.delete()));
		},
		GenerateNPCs: () => Promise.all(IMPORTDATA.npcs.map(({name, type, ...data}) => Actor.create({name, type, data}))),
		MutateItems: () => {
			const patternParts = {
				b: [
					{
						items: ["all"],
						patterns: [
							...[
								"(?:[^ a-zA-Z])?\\d+d",
								"(?:[^ a-zA-Z])?\\d+d? effect",
								"(?:[^ a-zA-Z])?\\d+d? result level",
								"(?:[^ a-zA-Z])?\\d+d? faction status",
								"(?:[^ a-zA-Z])?\\d+ dot",
								"(?:[^ a-zA-Z])?\\d+ stash",
								"(?:[^ a-zA-Z])?\\d+ load",
								"(?:[^ a-zA-Z])?\\d+ drain",
								"(?:[^ a-zA-Z])?\\d+ armor",
								"(?:[^ a-zA-Z])?\\d+ stress(?: box)?"
							],
							...["Hunt", "Study", "Survey", "Tinker", "Finesse", "Prowl", "Skirmish", "Wreck", "Attune", "Command", "Consort", "Sway", "Insight", "Prowess", "Resolve"],
							...[
								"special armor",
								"push yourself",
								"gather info",
								"cohort",
								"xp trigger",
								"downtime",
								"one tick",
								"two ticks",
								"Tier",
								"acquire an asset",
								"reduce heat",
								"incarcerated",
								"gather information",
								"engagement roll",
								"hull",
								"hollow"
							]
						]
					},
					{patterns: ["Hunt", "Study", "Survey", "Tinker", "Finesse", "Prowl", "Skirmish", "Wreck", "Attune", "Command", "Consort", "Sway", "Insight", "Prowess", "Resolve"]
						.map((str) => str.toLowerCase()),
						items: ["Physicker", "Occultist", "Possess", "Interface"]},
					{patterns: ["protect"],
						items: ["Bodyguard"]},
					{patterns: ["potency", "quality", "magnitude", "potent"],
						items: ["Ghost Fighter", "Ghost Hunter (Arrow-Swift)", "Ghost Hunter (Ghost Form)", "Ghost Hunter (Mind Link)", "Infiltrator", "Ghost Voice", "Electroplasmic Projectors", "Undead"]},
					{patterns: ["invent", "craft"],
						items: ["Alchemist"]},
					{patterns: ["assist", "\\d*\\s*drain", "gloom", "compel"],
						items: ["Foresight", "Ghost Form", "Manifest"]},
					{patterns: ["load", "armor", "functions", "drain"],
						items: ["Automaton"]},
					{patterns: ["items"],
						items: ["Compartments"]},
					{patterns: ["frame", "frames", "feature"],
						items: ["Secondary Hull"]}
				],
				i: [
					{
						items: ["all"],
						patterns: [
							...[
								"alchemical)(\\s*features",
								"spark-craft)(\\s*features",
								"arcane)(\\s*features"
							],
							...[
								"This factors into effect\\."
							]
						]
					},
					{patterns: ["Whenever you would take stress.+instead\\."],
						items: ["Ghost Form", "Automaton"]},
					{patterns: ["feature"],
						items: ["Frame Upgrade"]}
				]
			};

			function getPattern(patStr: string): RegExp {
				return new RegExp(`\\b(${patStr})\\b`, "g");
			}

			const patterns = {
				b: patternParts.b.map(({items, patterns}) => ({
					items,
					patterns: patterns.map((pat) => getPattern(pat))
				})),
				i: patternParts.i.map(({items, patterns}) => ({
					items,
					patterns: patterns.map((pat) => getPattern(pat))
				}))
			};

			function createKey(name: string) {
				return name
					.replace(/ /g, "_")
					.replace(/[^A-Za-z_0-9]/g, "")
					.replace(/^\d+|\d+$/g, "");
			}

			game.items
				.forEach((i: BladesItem) => {
					const updateData: Record<string,any> = {
						"system.world_name": createKey(i.name!)
					};
					let ruleString = i.system.rules;
					if (ruleString) {
						ruleString = ruleString
							.replace(/<[^> ]*?>/g, "")
							.replace(/[<>]/g, "");
						updateData["system.description"] = ruleString;
						for (const [wrapper, patParts] of Object.entries(patterns)) {
							for (const {items, patterns} of patParts) {
								if (items.includes("all") || items.includes(i.name ?? "")) {
									patterns.forEach((patr) => {
										ruleString = ruleString
											.trim()
											.replace(patr, `<${wrapper}>$1</${wrapper}>$2`)
											.replace(/\$2/g, "")
											.replace(new RegExp(`(<${wrapper}>)+`, "g"), `<${wrapper}>`)
											.replace(new RegExp(`(</${wrapper}>)+`, "g"), `</${wrapper}>`);
									});
								}
							}
						}
						updateData["system.rules"] = ruleString;
					}

					i.update(updateData);
				});
		},
		GetFlatPackData: async (packName: string) => {
			const pack = game.packs.find((pack) => pack.metadata.name === packName);
			if (!pack) { return }
			const pack_items = await pack.getDocuments();
			const model_item: Record<string,any> = {};
			const fetchKeysMap = {
				"name": "name",
				"system.associated_class": "playbook",
				"system.associated_crew_type": "crew_type",
				"system.associated_faction": "faction",
				"system.description": "description",
				"system.description_short": "description_short",
				"system.notes": "notes",
				"flags.core.sourceId": "flagSource"
			};
			const flat_items = [
				"name|playbook|crew_type|faction|description|description_short|notes|flagSource",
				...pack_items.map((pItem) => {
					const prunedObj: string[] = [];
					// @ts-expect-error Temp
					const flatObj = U.objFlatten(pItem);
					for (const [sourceKey, targetKey] of Object.entries(fetchKeysMap)) {
					// @ts-expect-error Temp
						prunedObj.push((flatObj[sourceKey] ?? "").trim() || "");
					}
					return prunedObj.join("|");
				})
			];
			eLog.display("Flattened Pack", flat_items);
		},
		DebugPC: async () => {
			const {clientTop, clientLeft, clientHeight, clientWidth} = document.documentElement;
			const positions = {
				pc: () => ({top: clientTop, left: clientLeft}),
				crew: ({pcSheetElem, width}: {pcSheetElem: JQuery<HTMLElement>, width: number}) => ({top: clientTop, left: pcSheetElem.position().left + pcSheetElem.width()!}),
				npc: ({height, width}: {height: number, width: number}) => ({top: (clientTop + clientHeight) - height, left: (clientLeft + clientWidth) - width})
			};
			const pc = game.actors.filter((actor) => actor.type === BladesActorType.pc).shift() as BladesActor;

			if (pc) {
				Object.assign(globalThis, pc);
				if (pc.sheet) {
					pc.sheet.render(true);
				}
			}
			const crew = game.actors.filter((actor) => actor.type === BladesActorType.crew).shift() as BladesActor;
			if (crew) {
				Object.assign(globalThis, crew);
				if (crew.sheet) {
					crew.sheet.render(true);
				}
			}
			const npc = game.actors.filter((actor) => actor.type === BladesActorType.npc).shift() as BladesActor;
			if (npc) {
				Object.assign(globalThis, npc);
				if (npc.sheet) {
					npc.sheet.render(true);
				}
			}
			setTimeout(() => {
				if (pc.sheet) {
					pc.sheet.setPosition(positions.pc());
				}
				if (npc.sheet) {
					const height = $(npc.sheet!.element).height()!;
					const width = $(npc.sheet!.element).width()!;
					npc.sheet!.setPosition(positions.npc({height, width}));
				}
				if (crew.sheet) {
					const width = $(crew.sheet!.element).width()!;
					crew.sheet!.setPosition(positions.crew({pcSheetElem: pc.sheet!.element, width}));
				}
			}, 2000);
		}
	}
);/*!DEVCODE*/
// #endregion Globals

// #region ████████ SYSTEM INITIALIZATION: Initializing Blades In The Dark System on 'Init' Hook ████████
Hooks.once("init", async () => {
	registerSettings();
	eLog.display("Initializing Blades In the Dark System");

	// Register System Settings
	initFonts();

	// game.blades = {dice: bladesRoll};
	// game.system.bobclocks = {sizes: [4, 6, 8]};

	CONFIG.Item.documentClass = BladesItem;
	CONFIG.Actor.documentClass = BladesActor;

	// Register sheet application classes
	Actors.unregisterSheet("core", ActorSheet);
	Actors.registerSheet("blades", BladesCrewSheet, {types: ["crew"], makeDefault: true});
	Actors.registerSheet("blades", BladesFactionSheet, {types: ["factions"], makeDefault: true});
	Actors.registerSheet("blades", BladesNPCSheet, {types: ["npc"], makeDefault: true});

	Items.unregisterSheet("core", ItemSheet);
	Items.registerSheet("blades", BladesItemSheet, {types: ["faction", "item", "playbook", "ability", "heritage", "background", "vice", "crew_upgrade", "cohort", "crew_type", "crew_reputation", "crew_upgrade", "crew_ability"], makeDefault: true});

	// Initialize subclasses
	await Promise.all([
		BladesActorSheet.Initialize(),
		BladesActiveEffect.Initialize(),
		BladesTrackerSheet.Initialize(),
		BladesDialog.Initialize(),
		BladesClockKeeperSheet.Initialize(),
		preloadHandlebarsTemplates()
	]);

	registerHandlebarHelpers();
});

Hooks.once("ready", async () => {
	initCanvasStyles();
	initTinyMCEStyles();
	// @ts-expect-error Just never bothered to declare it's a global
	DebugPC();

	const items = [
		...(await BladesItem.getAllItemsByType("crew_upgrade")),
		...(await BladesItem.getAllItemsByType("crew_ability"))
	];

	await Promise.all(items
		.map(async (item) => {
			if (item.type === "crew_ability" && item.system.crew_types!.length === 0) {
				await item.update({"system.crew_types": [item.system.class]});
			}
			return item.update({
				"system.class": null,
				"system.class_default": null,
				"system.crew_type": undefined,
				"system.logic": null,
				"system.purchased": null,
				"system.rules": item.system.description,
				"img": (item.img ?? "").replace(/crew-upgrade-icons\/|crew-ability-icons\//g, "")
			});
		}));
});
// #endregion ▄▄▄▄▄ SYSTEM INITIALIZATION ▄▄▄▄▄

// #region ░░░░░░░[SocketLib]░░░░ SocketLib Initialization ░░░░░░░ ~
Hooks.once("socketlib.ready", () => {
	socket = socketlib.registerSystem("eunos-blades");
	/*DEVCODE*/Object.assign(
		globalThis,
		{socket, socketlib}
	);/*!DEVCODE*/
	socket.register("renderOverlay", () => game.eunoblades.ClockKeeper?.renderOverlay());
});
// #endregion ░░░░[SocketLib]░░░░

// #region ░░░░░░░[Roll Controller]░░░░ Add Dice Roller to Scene Control Sidebar ░░░░░░░ ~
Hooks.once("renderSceneControls", async (app: unknown, html: JQuery<HTMLElement>) => {
	const dice_roller = $('<li class="scene-control" title="Dice Roll"><i class="fas fa-dice"></i></li>');
	dice_roller.click(async () => {
		await simpleRollPopup();
	});
	if (!foundry.utils.isNewerVersion("9", game.version ?? game.data.version)) {
		html.children().first().append(dice_roller);
	} else {
		html.append(dice_roller);
	}
});
// #endregion ░░░░[Dice Roll Controller]░░░░

// #region ░░░░░░░[Dice So Nice]░░░░ Dice So Nice Integration ░░░░░░░ ~
Hooks.once("diceSoNiceReady", (dice3d: Record<any, any>) => {
	dice3d.addSystem({id: "eunos-blades", name: "Euno's Blades"}, "preferred");
	dice3d.addDicePreset({
		type: "d6",
		labels: [1, 2, 3, 4, 5, 6].map((num) => `systems/eunos-blades/assets/dice/faces/${num}.webp`),
		system: "eunos-blades",
		bumpMaps: [1, 2, 3, 4, 5, 6].map((num) => `systems/eunos-blades/assets/dice/bump-maps/${num}.webp`),
		emissiveMaps: [, , , , , "systems/eunos-blades/assets/dice/emission-maps/6.webp"], // eslint-disable-line no-sparse-arrays
		emissive: "#d89300"
	});
});
// #endregion ░░░░[Dice So Nice]░░░░