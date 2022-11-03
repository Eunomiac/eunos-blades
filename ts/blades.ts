// #region ▮▮▮▮▮▮▮ IMPORTS ▮▮▮▮▮▮▮ ~
import C, {IMPORTDATA} from "./core/constants.js";
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
		GenerateNPCs: () => Promise.all(IMPORTDATA.npcs.map(({name, type, ...data}) => Actor.create({name, type, data})))
	}
);/*!DEVCODE*/
// #endregion Globals

// #region ====== Style Override Injection ====== ~
/**~ Override style module immediately and on system initialization
 * to ensure consistent styling, with minimal flash of unstylized content */
// function injectOverrideClass() {
// 	$("html").attr("class", "-emu-layout");
// 	$("body.vtt.game.system-eunos-blades").addClass("-emu");
// }
// $(injectOverrideClass);
// Hooks.once("init", injectOverrideClass);


// #endregion ___ Style Override Injection ___

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
		BladesClockKeeperSheet.Initialize(),
		preloadHandlebarsTemplates()
	]);

	registerHandlebarHelpers();
});

Hooks.once("ready", async () => {
	initCanvasStyles();
	initTinyMCEStyles();
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