/* ****▌███████████████████████████████████████████████████████████████████████████▐**** *\
|*     ▌████░░░░░░░░░░░ Euno's Blades in the Dark for Foundry VTT ░░░░░░░░░░░░░████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░ by Eunomiac ░░░░░░░░░░░░░██████████████████▐     *|
|*     ▌████████████████████████████  License █ v0.1.0 ████████████████████████████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░░░░░░  ░░░░░░░░░░░░░░░░░░███████████████████▐     *|
\* ****▌███████████████████████████████████████████████████████████████████████████▐**** */

import C, { IMPORTDATA, BladesActorType } from "./core/constants.js";
import registerSettings, { initTinyMCEStyles, initCanvasStyles, initFonts } from "./core/settings.js";
import H, { registerHandlebarHelpers, preloadHandlebarsTemplates } from "./core/helpers.js";
import U from "./core/utilities.js";
import registerDebugger from "./core/logger.js";
import BladesActor from "./blades-actor.js";
import BladesItem from "./blades-item.js";
import BladesItemSheet from "./sheets/blades-item-sheet.js";
import BladesActorSheet from "./sheets/blades-actor-sheet.js";
import BladesCrewSheet from "./sheets/blades-crew-sheet.js";
import BladesNPCSheet from "./sheets/blades-npc-sheet.js";
import BladesFactionSheet from "./sheets/blades-faction-sheet.js";
import { bladesRoll, simpleRollPopup } from "./blades-roll.js";
import BladesDialog from "./blades-dialog.js";
import BladesActiveEffect from "./blades-active-effect.js";
import BladesTrackerSheet from "./sheets/blades-tracker-sheet.js";
import BladesClockKeeperSheet from "./sheets/blades-clock-keeper-sheet.js";
let socket;
registerDebugger();

Object.assign(globalThis, {
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
        const npcNames = IMPORTDATA.npcs.map(({ name }) => name);
        const npcs = Array.from(game.actors ?? [])
            .filter((actor) => npcNames.includes(actor.name ?? ""));
        return Promise.all(npcs.map((npc) => npc.delete()));
    },
    GenerateNPCs: () => Promise.all(IMPORTDATA.npcs.map(({ name, type, ...data }) => Actor.create({ name, type, data }))),
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
                { patterns: ["Hunt", "Study", "Survey", "Tinker", "Finesse", "Prowl", "Skirmish", "Wreck", "Attune", "Command", "Consort", "Sway", "Insight", "Prowess", "Resolve"]
                        .map((str) => str.toLowerCase()),
                    items: ["Physicker", "Occultist", "Possess", "Interface"] },
                { patterns: ["protect"],
                    items: ["Bodyguard"] },
                { patterns: ["potency", "quality", "magnitude", "potent"],
                    items: ["Ghost Fighter", "Ghost Hunter (Arrow-Swift)", "Ghost Hunter (Ghost Form)", "Ghost Hunter (Mind Link)", "Infiltrator", "Ghost Voice", "Electroplasmic Projectors", "Undead"] },
                { patterns: ["invent", "craft"],
                    items: ["Alchemist"] },
                { patterns: ["assist", "\\d*\\s*drain", "gloom", "compel"],
                    items: ["Foresight", "Ghost Form", "Manifest"] },
                { patterns: ["load", "armor", "functions", "drain"],
                    items: ["Automaton"] },
                { patterns: ["items"],
                    items: ["Compartments"] },
                { patterns: ["frame", "frames", "feature"],
                    items: ["Secondary Hull"] }
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
                { patterns: ["Whenever you would take stress.+instead\\."],
                    items: ["Ghost Form", "Automaton"] },
                { patterns: ["feature"],
                    items: ["Frame Upgrade"] }
            ]
        };
        function getPattern(patStr) {
            return new RegExp(`\\b(${patStr})\\b`, "g");
        }
        const patterns = {
            b: patternParts.b.map(({ items, patterns }) => ({
                items,
                patterns: patterns.map((pat) => getPattern(pat))
            })),
            i: patternParts.i.map(({ items, patterns }) => ({
                items,
                patterns: patterns.map((pat) => getPattern(pat))
            }))
        };
        function createKey(name) {
            return name
                .replace(/ /g, "_")
                .replace(/[^A-Za-z_0-9]/g, "")
                .replace(/^\d+|\d+$/g, "");
        }
        game.items
            .forEach((i) => {
            const updateData = {
                "system.world_name": createKey(i.name)
            };
            let ruleString = i.system.rules;
            if (ruleString) {
                ruleString = ruleString
                    .replace(/<[^> ]*?>/g, "")
                    .replace(/[<>]/g, "");
                updateData["system.description"] = ruleString;
                for (const [wrapper, patParts] of Object.entries(patterns)) {
                    for (const { items, patterns } of patParts) {
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
    GetFlatPackData: async (packName) => {
        const pack = game.packs.find((pack) => pack.metadata.name === packName);
        if (!pack) {
            return;
        }
        const pack_items = await pack.getDocuments();
        const model_item = {};
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
                const prunedObj = [];
                const flatObj = U.objFlatten(pItem);
                for (const [sourceKey, targetKey] of Object.entries(fetchKeysMap)) {
                    prunedObj.push((flatObj[sourceKey] ?? "").trim() || "");
                }
                return prunedObj.join("|");
            })
        ];
        eLog.display("Flattened Pack", flat_items);
    },
    DebugPC: async () => {
        const { clientTop, clientLeft, clientHeight, clientWidth } = document.documentElement;
        const positions = {
            pc: () => ({ top: clientTop, left: clientLeft }),
            crew: ({ pcSheetElem, width }) => ({ top: clientTop, left: pcSheetElem.position().left + pcSheetElem.width() }),
            npc: ({ height, width }) => ({ top: (clientTop + clientHeight) - height, left: (clientLeft + clientWidth) - width })
        };
        const pc = game.actors.filter((actor) => actor.type === BladesActorType.pc).shift();
        if (pc) {
            Object.assign(globalThis, pc);
            if (pc.sheet) {
                pc.sheet.render(true);
            }
        }
        const crew = game.actors.filter((actor) => actor.type === BladesActorType.crew).shift();
        if (crew) {
            Object.assign(globalThis, crew);
            if (crew.sheet) {
                crew.sheet.render(true);
            }
        }
        const npc = game.actors.filter((actor) => actor.type === BladesActorType.npc).shift();
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
                const height = $(npc.sheet.element).height();
                const width = $(npc.sheet.element).width();
                npc.sheet.setPosition(positions.npc({ height, width }));
            }
            if (crew.sheet) {
                const width = $(crew.sheet.element).width();
                crew.sheet.setPosition(positions.crew({ pcSheetElem: pc.sheet.element, width }));
            }
        }, 2000);
    }
});

Hooks.once("init", async () => {
    registerSettings();
    eLog.display("Initializing Blades In the Dark System");
    initFonts();
    CONFIG.Item.documentClass = BladesItem;
    CONFIG.Actor.documentClass = BladesActor;
    Actors.unregisterSheet("core", ActorSheet);
    Actors.registerSheet("blades", BladesCrewSheet, { types: ["crew"], makeDefault: true });
    Actors.registerSheet("blades", BladesFactionSheet, { types: ["factions"], makeDefault: true });
    Actors.registerSheet("blades", BladesNPCSheet, { types: ["npc"], makeDefault: true });
    Items.unregisterSheet("core", ItemSheet);
    Items.registerSheet("blades", BladesItemSheet, { types: ["faction", "item", "playbook", "ability", "heritage", "background", "vice", "crew_upgrade", "cohort", "crew_type", "crew_reputation", "crew_upgrade", "crew_ability"], makeDefault: true });
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