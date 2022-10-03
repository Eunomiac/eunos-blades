// Import Modules
import {registerSystemSettings} from "./settings.js";
import {preloadHandlebarsTemplates} from "./blades-templates.js";
// import {bladesRoll, simpleRollPopup} from "./blades-roll.js";
import {BladesHelpers} from "./blades-helpers.js";
import {BladesActor} from "./blades-actor.js";
import {BladesItem} from "./blades-item.js";
import {BladesItemSheet} from "./blades-item-sheet.js";
import {BladesActorSheet} from "./blades-actor-sheet.js";
import {BladesActiveEffect} from "./blades-active-effect.js";
import {BladesCrewSheet} from "./blades-crew-sheet.js";
import {BladesClockSheet} from "./blades-clock-sheet.js";
import {BladesNPCSheet} from "./blades-npc-sheet.js";
import {BladesFactionSheet} from "./blades-faction-sheet.js";

import DATA from "./data-importer.js";
import {bladesRoll, simpleRollPopup} from "./euno-blades-roll.js";
import EunoTrackerSheet from "./euno-tracker-sheet.js";


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


/* -------------------------------------------- */

/*  Foundry VTT Initialization                  */

/* -------------------------------------------- */

Hooks.once("init", async () => {
	console.log("Initializing Blades In the Dark System");

	$("html").addClass("-emu-layout");
	$("html").addClass("-emu-subtle-layout");
	$("body.vtt.game.system-eunos-blades").addClass("-emu");


	// @ts-expect-error MIGRATION PAINS
	game.blades = {

		dice: bladesRoll

	};
	// @ts-expect-error MIGRATION PAINS
	game.system.bobclocks = {

		sizes: [ 4, 6, 8 ]

	};


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

	// Actors.registerSheet("blades", BladesClockSheet, {types: ["\uD83D\uDD5B clock"], makeDefault: true});


	Items.unregisterSheet("core", ItemSheet);
	Items.registerSheet("blades", BladesItemSheet, {types: ["faction", "item", "class", "ability", "heritage", "background", "vice", "crew_upgrade", "cohort", "crew_type", "crew_reputation", "crew_upgrade", "crew_ability"], makeDefault: true});
	Items.registerSheet("blades", EunoTrackerSheet, {types: ["gm_tracker"], makeDefault: true});

	await preloadHandlebarsTemplates();
	await loadTemplates([EunoTrackerSheet.template]);

	// Is the value Turf side.
	Handlebars.registerHelper("is_turf_side", function isTurfSide(value, options) {
		if (["left", "right", "top", "bottom"].includes(value)) {
			// @ts-expect-error MIGRATION PAINS
			return options.fn(this);
		} else {
			// @ts-expect-error MIGRATION PAINS
			return options.inverse(this);
		}
	});

	// Multiboxes.
	Handlebars.registerHelper("multiboxes", function multiboxes(selected, options) {
		// @ts-expect-error MIGRATION PAINS
		let html = options.fn(this);

		// Fix for single non-array values.
		if ( !Array.isArray(selected) ) {
			selected = [selected];
		}

		if (typeof selected !== "undefined") {
			// @ts-expect-error MIGRATION PAINS
			selected.forEach(selected_value => {
				if (selected_value !== false) {
					const escapedValue = RegExp.escape(Handlebars.escapeExpression(selected_value));
					const rgx = new RegExp(' value=\"' + escapedValue + '\"');
					html = html.replace(rgx, "$& checked=\"checked\"");
				}
			});
		}

		return html;
	});

	// Trauma Counter
	Handlebars.registerHelper("traumacounter", function traumacounter(selected, options) {
		// @ts-expect-error MIGRATION PAINS
		const html = options.fn(this);
		let count = 0;
		for (const trauma in selected) {
			if (selected[trauma] === true) {
				count++;
			}
		}
		if (count > 4) {count = 4}
		const rgx = new RegExp(' value=\"' + count + '\"');
		return html.replace(rgx, "$& checked=\"checked\"");
	});

	// NotEquals handlebar.
	Handlebars.registerHelper("noteq", (a, b, options) => (a !== b ? options.fn(this) : ""));

	// ReputationTurf handlebar.
	Handlebars.registerHelper("repturf", (turfs_amount, options) => {
		let html = options.fn(this),
		 turfs_amount_int = parseInt(turfs_amount);

		// Can't be more than 6.
		if (turfs_amount_int > 6) {
			turfs_amount_int = 6;
		}

		for (let i = 13 - turfs_amount_int; i <= 12; i++) {
			const rgx = new RegExp(' value=\"' + i + '\"');
			html = html.replace(rgx, "$& disabled=\"disabled\"");
		}

		return html;
	});


	Handlebars.registerHelper("crew_vault_coins", (max_coins, options) => {
		let html = options.fn(this);
		for (let i = 1; i <= max_coins; i++) {
			html += "<input type=\"radio\" id=\"crew-coins-vault-" + i + "\" name=\"data.vault.value\" value=\"" + i + "\"><label for=\"crew-coins-vault-" + i + "\"></label>";
		}
		return html;
	});


	Handlebars.registerHelper("crew_experience", (actor, options) => {
		let html = options.fn(this);
		for (let i = 1; i <= 10; i++) {
			html += `<input type="radio" id="crew-${actor._id}-experience-${i}" name="data.experience" value="${i}" dtype="Radio"><label for="crew-${actor._id}-experience-${i}"></label>`;
		}
		return html;
	});

	// Enrich the HTML replace /n with <br>
	Handlebars.registerHelper("html", (options) => {
		const text = options.hash.text.replace(/\n/g, "<br />");
		return new Handlebars.SafeString(text);
	});

	// "N Times" loop for handlebars.
	//  Block is executed N times starting from n=1.
	//
	// Usage:
	// {{#times_from_1 10}}
	//   <span>{{this}}</span>
	// {{/times_from_1}}

	Handlebars.registerHelper("times_from_1", (n, block) => {
		let accum = "";
		for (let i = 1; i <= n; ++i) {
			accum += block.fn(i);
		}
		return accum;
	});

	// "N Times" loop for handlebars.
	//  Block is executed N times starting from n=0.
	//
	// Usage:
	// {{#times_from_0 10}}
	//   <span>{{this}}</span>
	// {{/times_from_0}}

	Handlebars.registerHelper("times_from_0", (n, block) => {
		let accum = "";
		for (let i = 0; i <= n; ++i) {
			accum += block.fn(i);
		}
		return accum;
	});

	// Concat helper
	// https://gist.github.com/adg29/f312d6fab93652944a8a1026142491b1
	// Usage: (concat 'first 'second')
	Handlebars.registerHelper("concat", function() {
		let outStr = "";
		for(const arg in arguments){
			if(typeof arguments[arg]!=="object"){
				outStr += arguments[arg];
			}
		}
		return outStr;
	});

	/**
   * @inheritDoc
   * Takes label from Selected option instead of just plain value.
   */
	Handlebars.registerHelper("selectOptionsWithLabel", (choices: any[], options) => {
		const localize = options.hash.localize ?? false;
		let selected = options.hash.selected ?? null;
		const blank = options.hash.blank || null;
		selected = selected instanceof Array ? selected.map(String) : [String(selected)];

		// Create an option
		const option = (key: string, object: Record<string,any>) => {
			if ( localize ) {object.label = game.i18n.localize(object.label)}
			const isSelected = selected.includes(key);
			html += `<option value="${key}" ${isSelected ? "selected" : ""}>${object.label}</option>`;
		};

		// Create the options
		let html = "";
		if ( blank ) {option("", blank)}
		Object.entries(choices).forEach(e => option(...e));

		return new Handlebars.SafeString(html);
	});

	/**
   * Create appropriate Blades clock
   */
	Handlebars.registerHelper("blades-clock", (parameter_name, type, current_value, uniq_id) => {
		let html = "";
		if (current_value === null || current_value === "null") {
			current_value = 0;
		}
		if (parseInt(current_value) > parseInt(type)) {
			current_value = type;
		}

		// Label for 0
		html += `<label class="clock-zero-label" for="clock-0-${uniq_id}}"><i class="fab fa-creative-commons-zero nullifier"></i></label>`;
		html += `<div id="blades-clock-${uniq_id}" class="blades-clock clock-${type} clock-${type}-${current_value}" style="background-image:url('systems/eunos-blades/assets/progressclocks-svg/Progress Clock ${type}-${current_value}.svg');">`;
		const zero_checked = (parseInt(current_value) === 0) ? 'checked="checked"' : "";
		html += `<input type="radio" value="0" id="clock-0-${uniq_id}}" name="${parameter_name}" ${zero_checked}>`;

		for (let i = 1; i <= parseInt(type); i++) {
			const checked = (parseInt(current_value) === i) ? 'checked="checked"' : "";
			html += `
        <input type="radio" value="${i}" id="clock-${i}-${uniq_id}" name="${parameter_name}" ${checked}>
        <label for="clock-${i}-${uniq_id}"></label>
      `;
		}

		html += "</div>";
		return html;
	});

	/**
	 * Remove class indicators from item names
	 */
	Handlebars.registerHelper("removeClassPrefix", (classStr: string) => classStr.replace(/^\(.*?\)\s*/, ""));

	/**
	 * Count number of non-null, non-undefined elements in an array or values of an object.
	 */
	Handlebars.registerHelper("count", (arr: unknown[]|Record<string,unknown>) => Object.values(arr)
		.filter((val) => val !== null && val !== undefined)
		.length);
});

// getSceneControlButtons
Hooks.on("renderSceneControls", async (app: unknown, html: JQuery<HTMLElement>) => {

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

Hooks.on("diceSoNiceReady", (dice3d: Record<any,any>) => {
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

const ISAPPLYINGWEATHER = false;

Hooks.once("sequencerEffectManagerReady", () => {

	// @ts-expect-error MIGRATION PAINS
	if (game.scenes.current.name === "City of Knives" && ISAPPLYINGWEATHER) {
		Hooks.call("fxmaster.updateParticleEffects", [
			{
				type: "raintop",
				options: {
					scale: 1, speed: 1, lifetime: 1, density: 0.3,
					tint: {apply: false, value: "#ffffff"}
				}
			}, {
				type: "crows",
				options: {
					scale: 5, speed: 1, lifetime: 2, density: 0.001,
					tint: {apply: false, value: "#ffffff"}
				}
			}
		]);
		// @ts-expect-error MIGRATION PAINS
		FXMASTER.filters.setFilters([
			{
				type: "fog",
				options:
					{
						dimensions: 1, speed: 5, density: 0.15,
						color: {apply: false, value: "#ffffff"}
					}
			}, {
				type: "lightning",
				options: {
					frequency: 5500, spark_duration: 700, brightness: 2
				}
			}, {
				type: "bloom",
				options: {
					blur: 2, bloomScale: 0.5, threshold: 0.5
				}
			}
		]);

	}
});