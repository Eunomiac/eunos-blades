import U from "../../core/utilities.js";
import BladesItemSheet from "./BladesItemSheet.js";
import { BladesPC, BladesFaction } from "../../documents/BladesActorProxy.js";
class BladesClockKeeperSheet extends BladesItemSheet {
    // static Get() { return game.eunoblades.ClockKeeper as BladesClockKeeper; }
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            classes: ["eunos-blades", "sheet", "item", "clock-keeper"],
            template: "systems/eunos-blades/templates/items/clock_keeper-sheet.hbs",
            width: 700,
            height: 970,
            tabs: [{ navSelector: ".nav-tabs", contentSelector: ".tab-content", initial: "scene-keys" }]
        });
    }
    static async Initialize() {
        Items.registerSheet("blades", BladesClockKeeperSheet, { types: ["clock_keeper"], makeDefault: true });
        return loadTemplates([
            "systems/eunos-blades/templates/items/clock_keeper-sheet.hbs"
        ]);
    }
    getData() {
        const context = super.getData();
        const sheetData = {
            sceneOptions: Array.from(game.scenes),
            sceneKeys: this.item.getSceneKeys(this.item.system.targetScene ?? game.scenes.current.id),
            pcsWithProjects: BladesPC.All.filter((pc) => pc.projects.length > 0),
            factions: Array.from(BladesFaction.All)
        };
        return { ...context, ...sheetData };
    }
    addKey(event) {
        event.preventDefault();
        this.item.addClockKey();
    }
    deleteKey(event) {
        event.preventDefault();
        const keyID = event.currentTarget.dataset.id;
        if (keyID) {
            this.item.deleteClockKey(keyID);
        }
    }
    async activateListeners(html) {
        super.activateListeners(html);
        function getClockKeyFromEvent(event) {
            const id = $(event.currentTarget).data("keyId")
                || $(event.currentTarget).closest(".clock-key-control-flipper").data("clockKeyId");
            if (!id) {
                throw new Error("No id found on element");
            }
            const clockKey = game.eunoblades.ClockKeys.get(id);
            if (!clockKey) {
                throw new Error(`Clock key with id ${id} not found`);
            }
            return clockKey;
        }
        html.find("[data-action=\"create-clock-key\"").on({
            click: async (event) => {
                event.preventDefault();
                await this.item.addClockKey();
                // this.render();
            }
        });
        const flipControls$ = html.find(".clock-key-control-flipper");
        U.gsap.set(flipControls$.find(".clock-key-control-panel.controls-back"), {
            translateZ: -2,
            rotateX: 180,
            autoAlpha: 1
        });
        U.gsap.set(flipControls$.find(".clock-key-control-panel.controls-front"), {
            translateZ: 2,
            autoAlpha: 1
        });
        U.gsap.set(html.find(".clock-key-control-flipper.controls-flipped"), {
            rotateX: 180
        });
        html.find("[data-action=\"drop-clock-key\"]").on({
            click: async (event) => {
                event.preventDefault();
                await getClockKeyFromEvent(event).drop_SocketCall();
            }
        });
        html.find("[data-action=\"pull-clock-key\"]").on({
            click: async (event) => {
                event.preventDefault();
                await getClockKeyFromEvent(event).pull_SocketCall();
            }
        });
        html.find("[data-action=\"toggle-name-visibility\"]").on({
            click: async (event) => {
                event.preventDefault();
                const clockKey = getClockKeyFromEvent(event);
                clockKey.updateTarget("isNameVisible", !clockKey.isNameVisible);
                // If clockKey is in this scene and isVisible, must send out socket calls for animating name fading in/out
                if (clockKey.isInCurrentScene && clockKey.isVisible) {
                    if (clockKey.isNameVisible) {
                        clockKey.fadeOutName_SocketCall();
                    }
                    else {
                        clockKey.fadeInName_SocketCall();
                    }
                }
            }
        });
        html.find("input.clock-key-input:not([readonly])").on({ change: async (event) => {
                const input$ = $(event.currentTarget);
                await getClockKeyFromEvent(event).updateTarget(input$.data("targetProp"), input$.val());
            } });
    }
}
export default BladesClockKeeperSheet;
