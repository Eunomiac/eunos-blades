/* ****▌███████████████████████████████████████████████████████████████████████████▐**** *\
|*     ▌████░░░░░░░░░░░ Euno's Blades in the Dark for Foundry VTT ░░░░░░░░░░░░░████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░ by Eunomiac ░░░░░░░░░░░░░██████████████████▐     *|
|*     ▌████████████████████████████  License █ v0.1.0 ████████████████████████████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░░░░░░  ░░░░░░░░░░░░░░░░░░███████████████████▐     *|
\* ****▌███████████████████████████████████████████████████████████████████████████▐**** */

import C, { IMPORTDATA, BladesActorType } from "./core/constants.js";
import registerSettings, { initTinyMCEStyles, initCanvasStyles, initFonts } from "./core/settings.js";
import { registerHandlebarHelpers, preloadHandlebarsTemplates } from "./core/helpers.js";
import U from "./core/utilities.js";
import registerDebugger from "./core/logger.js";
import G, { Initialize as GsapInitialize } from "./core/gsap.js";
import BladesActor from "./blades-actor.js";
import BladesItem from "./blades-item.js";
import BladesItemSheet from "./sheets/item/blades-item-sheet.js";
import BladesActorSheet from "./sheets/actor/blades-actor-sheet.js";
import BladesCrewSheet from "./sheets/actor/blades-crew-sheet.js";
import BladesNPCSheet from "./sheets/actor/blades-npc-sheet.js";
import BladesFactionSheet from "./sheets/actor/blades-faction-sheet.js";
import { bladesRoll, simpleRollPopup } from "./blades-roll.js";
import BladesSelectorDialog from "./blades-dialog.js";
import BladesActiveEffect from "./blades-active-effect.js";
import BladesTrackerSheet from "./sheets/item/blades-tracker-sheet.js";
import BladesClockKeeperSheet from "./sheets/item/blades-clock-keeper-sheet.js";
import { UpdateClaims, UpdateContacts, UpdateOps } from "./data-import/data-import.js";
let socket;
registerDebugger();

Object.assign(globalThis, {
    UpdateClaims,
    UpdateContacts,
    UpdateOps,
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
    G,
    U,
    C,
    BladesItem,
    BladesItemSheet,
    MutateItems: () => {
        const patternParts = {
            strong: [
                {
                    items: ["all"],
                    patterns: [
                        "(?:[^ a-zA-Z]<>)?\\d+d",
                        ...[
                            "effect",
                            "result level",
                            "faction status(?:es)?",
                            "dot",
                            "stash",
                            "(?:free )?load",
                            "drain",
                            "armor",
                            "scale",
                            "potency",
                            "coin",
                            "quality",
                            "quality",
                            "xp",
                            "stress(?: box)?",
                            "rep",
                            "trauma(?: box)?"
                        ].map((pat) => `!B(?:[^ a-zA-Z<>])?\\d+ ${pat}`),
                        ...["Hunt", "Study", "Survey", "Tinker", "Finesse", "Prowl", "Skirmish", "Wreck", "Attune", "Command", "Consort", "Sway", "Insight", "Prowess", "Resolve"],
                        ...[
                            "crew xp",
                            "special armor",
                            "push yourself",
                            "gather info",
                            "cohorts?",
                            "xp trigger",
                            "downtime",
                            "one tick",
                            "two ticks",
                            "long-?term project",
                            "Tier(?:\\s*[^ a-zA-Z]\\d+)?",
                            "acquire an asset",
                            "!B(?:(?:[^ a-zA-Z<>])?\\d+ )?(?:reduce\\s*)?heat",
                            "incarcerated",
                            "gather information",
                            "engagement(?: roll)?",
                            "hull",
                            "hollow",
                            "half the coin",
                            "entanglements",
                            "group action",
                            "teamwork(?:\\s* maneuvers)?",
                            "rep",
                            "wanted level",
                            "resistance)(\\s*rolls?",
                            "healing)(\\s*(?:treatment\\s*)?rolls?"
                        ]
                    ]
                },
                { patterns: ["Hunt", "Study", "Survey", "Tinker", "Finesse", "Prowl", "Skirmish", "Wreck", "Attune", "Command", "Consort", "Sway", "Insight", "Prowess", "Resolve"]
                        .map((str) => str.toLowerCase()),
                    items: ["Physicker", "Occultist", "Possess", "Interface"] },
                { patterns: ["protect"],
                    items: ["Bodyguard"] },
                { patterns: ["potency", "quality", "magnitude", "potent"],
                    items: ["The Good Stuff", "Ghost Fighter", "Ghost Hunter (Arrow-Swift)", "Ghost Hunter (Ghost Form)", "Ghost Hunter (Mind Link)", "Infiltrator", "Ghost Voice", "Electroplasmic Projectors", "Undead", "Like Part of the Family"] },
                { patterns: ["invent", "craft"],
                    items: ["Alchemist"] },
                { patterns: ["assist", "\\d*\\s*drain", "gloom", "compel"],
                    items: ["Foresight", "Ghost Form", "Manifest"] },
                { patterns: ["load", "armor", "functions", "drain"],
                    items: ["Automaton", "Reavers"] },
                { patterns: ["items"],
                    items: ["Compartments"] },
                { patterns: ["frame", "frames", "feature"],
                    items: ["Secondary Hull"] },
                { patterns: ["turf"],
                    items: ["Accord", "Fiends"] },
                { patterns: ["heat", "rep"],
                    items: ["Crow's Veil"] },
                { patterns: ["Vice", "assist"],
                    items: ["Conviction", "Vault"] },
                { patterns: ["workshop", "coin"],
                    items: ["Ritual Sanctum in Lair"] },
                { patterns: ["quality rating", "Documents", "Gear", "Arcane Implements", "Subterfuge Supplies", "Tools", "Weapons"],
                    items: ["Quality"] }
            ],
            em: [
                {
                    items: ["all"],
                    patterns: [
                        ...[
                            "Thugs",
                            "Skulks",
                            "Adepts",
                            "Rovers",
                            "Rooks",
                            "!BYou got payback against someone who harmed you or someone you care about.!B"
                        ],
                        ...[
                            "alchemical)(\\s*features",
                            "spark-craft)(\\s*features",
                            "arcane)(\\s*features"
                        ],
                        ...[
                            "This factors into effect\\."
                        ],
                        "!B\\([^)]+\\)!B"
                    ]
                },
                { patterns: ["Whenever you would.+instead"],
                    items: ["Ghost Form", "Automaton"] },
                { patterns: ["feature"],
                    items: ["Frame Upgrade"] },
                { patterns: ["Worship"],
                    items: ["Conviction"] },
                { patterns: ["savage", "unreliable", "wild"],
                    items: ["Hooked"] }
            ]
        };
        function getPattern(patStr) {
            return new RegExp(`\\b(${patStr})\\b`
                .replace(/^\\b\(!B/, "(")
                .replace(/!B\)\\b$/, ")"), "g");
        }
        const patterns = {
            strong: patternParts.strong.map(({ items, patterns }) => ({
                items: items.map(getWorldName),
                patterns: patterns.map((pat) => getPattern(pat))
            })),
            em: patternParts.em.map(({ items, patterns }) => ({
                items: items.map(getWorldName),
                patterns: patterns.map((pat) => getPattern(pat))
            }))
        };
        function getWorldName(name) {
            return name
                .replace(/[^A-Za-z_0-9 ]/g, "")
                .trim()
                .replace(/ /g, "_");
        }
        function getPrimaryName(name) {
            return name
                .replace(/^\s*\d+\s*|\s*\d+\s*$/g, "")
                .replace(/:.*$/, "")
                .replace(/\(.*?\)/g, "")
                .trim();
        }
        game.items
            .forEach((i) => {
            const updateData = {};
            let ruleString = i.system.rules;
            if (ruleString) {
                ruleString = ruleString
                    .replace(/<strong>|<\/strong>|<em>|<\/em>/g, "");
                updateData["system.description"] = ruleString;
                for (const [wrapper, patParts] of Object.entries(patterns)) {
                    for (const { items, patterns } of patParts) {
                        if (items.includes("all") || items.includes(i.system.world_name) || items.includes(getPrimaryName(i.name)) || items.includes(getWorldName(getPrimaryName(i.name)))) {
                            patterns.forEach((patr) => {
                                ruleString = ruleString
                                    .trim()
                                    .replace(/-(\d+)/g, "−$1")
                                    .replace(patr, `<${wrapper}>$1</${wrapper}>$2`)
                                    .replace(/\$2/g, "")
                                    .replace(new RegExp(`(<${wrapper}>)+`, "g"), `<${wrapper}>`)
                                    .replace(new RegExp(`(</${wrapper}>)+`, "g"), `</${wrapper}>`)
                                    .replace(/<(strong|em)>( +)/g, "$2<$1>")
                                    .replace(/( +)<\/(strong|em)>/g, "</$2>$1")
                                    .replace(/ +/g, " ")
                                    .trim();
                            });
                        }
                    }
                }
                updateData["system.rules"] = ruleString;
            }
            i.update(updateData);
        });
    },
    DebugPC: async () => {
    },
    TransferBladesRandomizer: async () => {
        const npcs = game.actors.filter((actor) => actor.type === BladesActorType.npc);
        npcs.forEach((npc) => {
            npc.update({
                "system.randomizers.name.isLocked": false,
                "system.randomizers.trait_1.isLocked": false,
                "system.randomizers.trait_2.isLocked": false,
                "system.randomizers.trait_3.isLocked": false,
                "system.randomizers.quirk.isLocked": false
            });
        });
    }
});

Hooks.once("init", async () => {
    registerSettings();
    eLog.display("Initializing Blades In the Dark System");
    GsapInitialize();
    initFonts();
    CONFIG.Item.documentClass = BladesItem;
    CONFIG.Actor.documentClass = BladesActor;
    Actors.unregisterSheet("core", ActorSheet);
    Actors.registerSheet("blades", BladesCrewSheet, { types: ["crew"], makeDefault: true });
    Actors.registerSheet("blades", BladesFactionSheet, { types: ["faction"], makeDefault: true });
    Actors.registerSheet("blades", BladesNPCSheet, { types: ["npc"], makeDefault: true });
    Items.unregisterSheet("core", ItemSheet);
    Items.registerSheet("blades", BladesItemSheet, { types: ["gear", "playbook", "ability", "heritage", "background", "vice", "crew_upgrade", "cohort", "crew_playbook", "crew_reputation", "crew_upgrade", "crew_ability"], makeDefault: true });
    await Promise.all([
        BladesActorSheet.Initialize(),
        BladesActiveEffect.Initialize(),
        BladesTrackerSheet.Initialize(),
        BladesSelectorDialog.Initialize(),
        BladesClockKeeperSheet.Initialize(),
        preloadHandlebarsTemplates()
    ]);
    registerHandlebarHelpers();
});
Hooks.once("ready", async () => {
    initCanvasStyles();
    initTinyMCEStyles();
    DebugPC();
});

Hooks.once("socketlib.ready", () => {
    socket = socketlib.registerSystem("eunos-blades");
    Object.assign(globalThis, { socket, socketlib });     socket.register("renderOverlay", () => game.eunoblades.ClockKeeper?.renderOverlay());
});

Hooks.once("renderSceneControls", async (app, html) => {
    const dice_roller = $('<li class="scene-control" title="Dice Roll"><i class="fas fa-dice"></i></li>');
    dice_roller.click(async () => {
        await simpleRollPopup();
    });
    if (!foundry.utils.isNewerVersion("9", game.version ?? game.data.version)) {
        html.children().first().append(dice_roller);
    }
    else {
        html.append(dice_roller);
    }
});

Hooks.once("diceSoNiceReady", (dice3d) => {
    dice3d.addSystem({ id: "eunos-blades", name: "Euno's Blades" }, "preferred");
    dice3d.addDicePreset({
        type: "d6",
        labels: [1, 2, 3, 4, 5, 6].map((num) => `systems/eunos-blades/assets/dice/faces/${num}.webp`),
        system: "eunos-blades",
        bumpMaps: [1, 2, 3, 4, 5, 6].map((num) => `systems/eunos-blades/assets/dice/bump-maps/${num}.webp`),
        emissiveMaps: [, , , , , "systems/eunos-blades/assets/dice/emission-maps/6.webp"],
        emissive: "#d89300"
    });
});