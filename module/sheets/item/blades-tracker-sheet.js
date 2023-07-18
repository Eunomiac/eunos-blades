/* ****▌███████████████████████████████████████████████████████████████████████████▐**** *\
|*     ▌████░░░░░░░░░░░ Euno's Blades in the Dark for Foundry VTT ░░░░░░░░░░░░░████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░ by Eunomiac ░░░░░░░░░░░░░██████████████████▐     *|
|*     ▌████████████████████████████  License █ v0.1.0 ████████████████████████████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░░░░░░  ░░░░░░░░░░░░░░░░░░███████████████████▐     *|
\* ****▌███████████████████████████████████████████████████████████████████████████▐**** */

import { BladesPhase } from "../../core/constants.js";
import BladesItemSheet from "./blades-item-sheet.js";
import BladesItem from "../../blades-item.js";
import { BladesActorType } from "../../../module_staging_1/core/constants.js";
export var BladesTipContext;
(function (BladesTipContext) {
    BladesTipContext["DiceRoll"] = "DiceRoll";
    BladesTipContext["Combat"] = "Combat";
    BladesTipContext["General"] = "General";
})(BladesTipContext || (BladesTipContext = {}));
class BladesTipGenerator {
    static get Tips() {
        return {
            [BladesTipContext.DiceRoll]: [],
            [BladesTipContext.Combat]: [
                "Every combat encounter should advance the main plot, or else it's filler.",
                "Inject dialogue into combat encounters, especially from important adversaries.",
                "Combat encounters should be a challenge, but not a slog. Don't be afraid to end them early.",
                "Infiltrate/Rescue/Destroy: Use these as additional/secondary goals in combat encounters.",
                "Tell the next player in the initiative order that they're on deck.",
                "Don't trigger combats automatically: Use alternate objectives to incite the players to fight, giving them agency.",
                "Add another layer by drawing focus to collateral effects of the combat: a fire, a hostage, a collapsing building, innocents in danger"
            ],
            [BladesTipContext.General]: [
                "Rolling the dice always means SOMETHING happens.",
                "Jump straight to the action; don't waste time on establishing scenes or filler.",
                "Invoke elements of characters' backstories or beliefs to make any scene more personal."
            ]
        };
    }
    tipContext;
    constructor(tipContext) {
        this.tipContext = tipContext;
    }
}
class BladesTrackerSheet extends BladesItemSheet {
    static async Get() {
        return game.eunoblades.Tracker || (await BladesItem.create({
            name: "GM Tracker",
            type: "gm_tracker",
            img: "systems/eunos-blades/assets/icons/gm-tracker.svg"
        }));
    }
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            classes: ["eunos-blades", "sheet", "item", "gm-tracker"],
            template: "systems/eunos-blades/templates/items/gm_tracker-sheet.hbs",
            width: 700,
            height: 970
        });
    }
    static async Initialize() {
        game.eunoblades ??= {};
        Items.registerSheet("blades", BladesTrackerSheet, { types: ["gm_tracker"], makeDefault: true });
        Hooks.once("ready", async () => {
            let tracker = game.items.find((item) => item.type === "gm_tracker");
            if (!(tracker instanceof BladesItem)) {
                tracker = (await BladesItem.create({
                    name: "GM Tracker",
                    type: "gm_tracker",
                    img: "systems/eunos-blades/assets/icons/gm-tracker.svg"
                }));
            }
            game.eunoblades.Tracker = tracker;
        });
        return loadTemplates([
            "systems/eunos-blades/templates/items/gm_tracker-sheet.hbs"
        ]);
    }
    get phase() { return this.item.system.game_phase; }
    set phase(phase) { this.item.update({ system: { game_phase: phase } }); }
    get actionMax() { return this.phase === BladesPhase.CharGen ? 2 : undefined; }
    async getData() {
        const context = await super.getData();
        context.system.phases = Object.values(BladesPhase);
        return context;
    }
    async activateListeners(html) {
        super.activateListeners(html);
    }
    async _onSubmit(event, params = {}) {
        const submitData = await super._onSubmit(event, params);
        game.actors.filter((actor) => actor.type === BladesActorType.pc)
            .forEach((actor) => actor.sheet?.render());
        return submitData;
    }
}
export default BladesTrackerSheet;