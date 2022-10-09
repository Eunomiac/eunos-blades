// Import Modules
import {registerSystemSettings} from "./settings.js";
import {preloadHandlebarsTemplates} from "./blades-templates.js";
// import {bladesRoll, simpleRollPopup} from "./blades-roll.js";
import BladesHelpers, {registerHandlebarHelpers} from "./euno-helpers.js";
import {BladesActor} from "./blades-actor.js";
import {BladesItem} from "./blades-item.js";
import {BladesItemSheet} from "./blades-item-sheet.js";
import {BladesActorSheet} from "./blades-actor-sheet.js";
import {BladesCrewSheet} from "./blades-crew-sheet.js";
import {BladesNPCSheet} from "./blades-npc-sheet.js";
import {BladesFactionSheet} from "./blades-faction-sheet.js";

import DATA from "./data-importer.js";
import {bladesRoll, simpleRollPopup} from "./euno-blades-roll.js";
import BladesActiveEffect from "./euno-active-effect.js";
import EunoTrackerSheet from "./euno-tracker-sheet.js";
import EunoClockKeeperSheet from "./euno-clock-keeper-sheet.js";

Object.assign(
	globalThis,
	{
		BladesHelpers: BladesHelpers,
		ClearNPCs: () => {
			const npcNames = DATA.npcs.map(({name}) => name);
			const npcs = Array.from(game.actors ?? [])
				.filter((actor) => npcNames.includes(actor.name ?? ""));
			return Promise.all(npcs.map((npc) => npc.delete()));
		},
		GenerateNPCs: () => Promise.all(DATA.npcs.map(({name, type, ...data}) => Actor.create({name, type, data})))
	}
);

$(() => {
	$("html").attr("class", "-emu-layout");
	$("body.vtt.game.system-eunos-blades").addClass("-emu");
});

/* -------------------------------------------- */

/*  Foundry VTT Initialization                  */

/* -------------------------------------------- */

Hooks.once("init", async () => {
	console.log("Initializing Blades In the Dark System");

	$("html").attr("class", "-emu-layout");
	$("body.vtt.game.system-eunos-blades").addClass("-emu");

	// @ts-expect-error MIGRATION PAINS
	game.blades = {dice: bladesRoll};
	// @ts-expect-error MIGRATION PAINS
	game.system.bobclocks = {sizes: [ 4, 6, 8 ]};

	CONFIG.Item.documentClass = BladesItem;
	CONFIG.Actor.documentClass = BladesActor;
	CONFIG.ActiveEffect.documentClass = BladesActiveEffect;

	// Register System Settings
	registerSystemSettings();

	// Register sheet application classes
	Actors.unregisterSheet("core", ActorSheet);
	Actors.registerSheet("blades", BladesActorSheet, {types: ["character"], makeDefault: true});
	Actors.registerSheet("blades", BladesCrewSheet, {types: ["crew"], makeDefault: true});
	Actors.registerSheet("blades", BladesFactionSheet, {types: ["factions"], makeDefault: true});
	Actors.registerSheet("blades", BladesNPCSheet, {types: ["npc"], makeDefault: true});

	Items.unregisterSheet("core", ItemSheet);
	Items.registerSheet("blades", BladesItemSheet, {types: ["faction", "item", "class", "ability", "heritage", "background", "vice", "crew_upgrade", "cohort", "crew_type", "crew_reputation", "crew_upgrade", "crew_ability"], makeDefault: true});
	Items.registerSheet("blades", EunoTrackerSheet, {types: ["gm_tracker"], makeDefault: true});
	Items.registerSheet("blades", EunoClockKeeperSheet, {types: ["clock_keeper"], makeDefault: true});

	await preloadHandlebarsTemplates();

	// Initialize subclasses
	await Promise.all([
		BladesActiveEffect.Initialize(),
		EunoTrackerSheet.Initialize(),
		BladesItem.Initialize()
	]);

	registerHandlebarHelpers();
});

// getSceneControlButtons
Hooks.once("renderSceneControls", async (app: unknown, html: JQuery<HTMLElement>) => {
	const dice_roller = $('<li class="scene-control" title="Dice Roll"><i class="fas fa-dice"></i></li>');
	dice_roller.click( async () => {
		await simpleRollPopup();
	});
	if ( !foundry.utils.isNewerVersion("9", game.version ?? game.data.version) ) {
		html.children().first().append( dice_roller );
	} else {
		html.append( dice_roller );
	}
});

Hooks.once("diceSoNiceReady", (dice3d: Record<any,any>) => {
	dice3d.addSystem({id: "eunos-blades", name: "Euno's Blades"}, "preferred");
	dice3d.addDicePreset({
		type: "d6",
		labels: [1, 2, 3, 4, 5, 6].map((num) => `systems/eunos-blades/assets/dice/faces/${num}.webp`),
		system: "eunos-blades",
		bumpMaps: [1, 2, 3, 4, 5, 6].map((num) => `systems/eunos-blades/assets/dice/bump-maps/${num}.webp`),
		emissiveMaps: [,,,,, "systems/eunos-blades/assets/dice/emission-maps/6.webp"], // eslint-disable-line no-sparse-arrays
		emissive: "#d89300"
	});
});

Hooks.once("renderHeadsUpDisplay", () => {
	setTimeout(() => {
		$("html").attr("class", "-emu-layout");
		$("body.vtt.game.system-eunos-blades").addClass("-emu");
	}, 500);
});