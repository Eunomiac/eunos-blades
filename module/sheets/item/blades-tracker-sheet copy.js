/* ****▌███████████████████████████████████████████████████████████████████████████▐**** *\
|*     ▌████░░░░░░░░░░░ Euno's Blades in the Dark for Foundry VTT ░░░░░░░░░░░░░████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░ by Eunomiac ░░░░░░░░░░░░░██████████████████▐     *|
|*     ▌████████████████████████████  License █ v0.1.0 ████████████████████████████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░░░░░░  ░░░░░░░░░░░░░░░░░░███████████████████▐     *|
\* ****▌███████████████████████████████████████████████████████████████████████████▐**** */

import { BladesActorType, BladesItemType, BladesPhase } from "../../core/constants.js";
import BladesItemSheet from "./blades-item-sheet.js";
import BladesItem from "../../blades-item.js";
import BladesGMTracker from "../../documents/items/blades-gm-tracker.js";
import BladesActor from "../../blades-actor.js";
import BladesPC from "../../documents/actors/blades-pc.js";
export var BladesTipContext;
(function (BladesTipContext) {
    BladesTipContext["DiceRoll"] = "DiceRoll";
    BladesTipContext["Combat"] = "Combat";
    BladesTipContext["General"] = "General";
})(BladesTipContext || (BladesTipContext = {}));
class BladesTipGenerator {
    static Test(pcActor) {
        if (BladesActor.IsType(pcActor, BladesActorType.pc)) {
            return pcActor;
        }
        return undefined;
    }
    testActor = new BladesPC({ name: "blah", type: "pc" });
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
    static Get() { return game.eunoblades.Tracker; }
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
            let tracker = game.items.find((item) => BladesItem.IsType(item, BladesItemType.gm_tracker));
            if (!tracker) {
                tracker = (await BladesGMTracker.create({
                    name: "GM Tracker",
                    type: "gm_tracker",
                    img: "systems/eunos-blades/assets/icons/misc-icons/gm-tracker.svg"
                }));
            }
            game.eunoblades.Tracker = tracker;
        });
        return loadTemplates([
            "systems/eunos-blades/templates/items/gm_tracker-sheet.hbs"
        ]);
    }
    
    
    async activateListeners(html) {
        super.activateListeners(html);
    }
    async _onSubmit(event, params = {}) {
        const prevPhase = this.item.system.phase;
        const submitData = await super._onSubmit(event, params);
        const newPhase = this.item.system.phase;
        let isForcingRender = true;
        if (prevPhase !== newPhase) {
            switch (prevPhase) {
                case BladesPhase.CharGen: {
                    break;
                }
                case BladesPhase.Freeplay: {
                    break;
                }
                case BladesPhase.Score: {
                    isForcingRender = false;
                    game.actors.filter((actor) => BladesActor.IsType(actor, BladesActorType.pc))
                        .forEach((actor) => actor.clearLoadout());
                    break;
                }
                case BladesPhase.Downtime: {
                    break;
                }
            }
            switch (newPhase) {
                case BladesPhase.CharGen: {
                    break;
                }
                case BladesPhase.Freeplay: {
                    break;
                }
                case BladesPhase.Score: {
                    break;
                }
                case BladesPhase.Downtime: {
                    break;
                }
            }
        }
        if (isForcingRender) {
            game.actors.filter((actor) => actor.type === BladesActorType.pc)
                .forEach((actor) => actor.sheet?.render());
        }
        return submitData;
    }
}
export default BladesTrackerSheet;
//# sourceMappingURL=blades-tracker-sheet copy.js.map