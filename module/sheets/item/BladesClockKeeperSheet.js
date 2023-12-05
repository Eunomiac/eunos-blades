import BladesItemSheet from "./BladesItemSheet.js";
import BladesClockKeeper from "../../documents/items/BladesClockKeeper.js";
import U from "../../core/utilities.js";
class BladesClockKeeperSheet extends BladesItemSheet {
    static Get() { return game.eunoblades.ClockKeeper; }
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            classes: ["eunos-blades", "sheet", "item", "clock-keeper"],
            template: "systems/eunos-blades/templates/items/clock_keeper-sheet.hbs",
            width: 700,
            height: 970
        });
    }
    static async Initialize() {
        game.eunoblades ??= {};
        Items.registerSheet("blades", BladesClockKeeperSheet, { types: ["clock_keeper"], makeDefault: true });
        Hooks.once("ready", async () => {
            let clockKeeper = game.items.find((item) => item.type === "clock_keeper");
            if (!clockKeeper) {
                clockKeeper = (await BladesClockKeeper.create({
                    name: "Clock Keeper",
                    type: "clock_keeper",
                    img: "systems/eunos-blades/assets/icons/misc-icons/clock-keeper.svg"
                }));
            }
            game.eunoblades.ClockKeeper = clockKeeper;
            game.eunoblades.ClockKeeper.renderOverlay();
        });
        Hooks.on("canvasReady", async () => { game.eunoblades.ClockKeeper?.renderOverlay(); });
        return loadTemplates([
            "systems/eunos-blades/templates/items/clock_keeper-sheet.hbs",
            "systems/eunos-blades/templates/parts/clock-sheet-row.hbs"
        ]);
    }
    static InitSockets() {
        if (game.eunoblades.ClockKeeper) {
            socketlib.system.register("renderOverlay", game.eunoblades.ClockKeeper.renderOverlay);
            return true;
        }
        return false;
    }
    // Override async _updateObject(event: unknown, formData: any) {
    //   const updateData = await`this.object.update(formData);
    //   socketlib.system.executeForEveryone("renderOverlay");
    //   // this.item.renderOverlay();
    //   return updateData;
    // }
    getData() {
        const context = super.getData();
        const sheetData = {
            sceneOptions: Array.from(game.scenes)
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
    setKeySize(event) {
        event.preventDefault();
        const keyID = event.target.dataset.id;
        if (keyID) {
            this.item.setKeySize(keyID, parseInt(event.target.value, 10));
        }
    }
    async activateListeners(html) {
        super.activateListeners(html);
        const self = this;
        html.find("[data-action=\"add-key\"]").on({
            click(event) {
                event.preventDefault();
                self.item.addClockKey();
            }
        });
        html.find("[data-action=\"delete-key\"]").on({
            click(event) {
                event.preventDefault();
                self.item.deleteClockKey($(event.currentTarget).data("id"));
            }
        });
        html.find(".key-clock-counter").on({
            change(event) {
                event.preventDefault();
                const keyID = $(event.currentTarget).data("id");
                if (keyID) {
                    self.item.setKeySize(keyID, U.pInt($(event.target).val()));
                }
            }
        });
    }
}
export default BladesClockKeeperSheet;
