/*~ @@DOUBLE-BLANK@@ ~*/
import BladesItemSheet from "./BladesItemSheet.js";
import BladesClockKeeper from "../../documents/items/BladesClockKeeper.js";
/*~ @@DOUBLE-BLANK@@ ~*/
class BladesClockKeeperSheet extends BladesItemSheet {
    /*~ @@DOUBLE-BLANK@@ ~*/
    static Get() { return game.eunoblades.ClockKeeper; }
    /*~ @@DOUBLE-BLANK@@ ~*/
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            classes: ["eunos-blades", "sheet", "item", "clock-keeper"],
            template: "systems/eunos-blades/templates/items/clock_keeper-sheet.hbs",
            width: 700,
            height: 970
        });
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
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
    /*~ @@DOUBLE-BLANK@@ ~*/
    static InitSockets() {
        if (game.eunoblades.ClockKeeper) {
            socketlib.system.register("renderOverlay", game.eunoblades.ClockKeeper.renderOverlay);
            return true;
        }
        return false;
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    // Override async _updateObject(event: unknown, formData: any) {
    //   const updateData = await`this.object.update(formData);
    //   socketlib.system.executeForEveryone("renderOverlay");
    //   // this.item.renderOverlay();
    //   return updateData;
    // }
    /*~ @@DOUBLE-BLANK@@ ~*/
    getData() {
        const context = super.getData();
        /*~ @@DOUBLE-BLANK@@ ~*/
        const sheetData = {
            clock_keys: Object.fromEntries((Object.entries(context.system.clock_keys ?? {})
                .filter(([keyID, keyData]) => Boolean(keyData && keyData.scene === context.system.targetScene))))
        };
        /*~ @@DOUBLE-BLANK@@ ~*/
        return { ...context, ...sheetData };
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    addKey(event) {
        event.preventDefault();
        this.item.addClockKey();
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    deleteKey(event) {
        event.preventDefault();
        const keyID = event.currentTarget.dataset.id;
        if (keyID) {
            this.item.deleteClockKey(keyID);
        }
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    setKeySize(event) {
        event.preventDefault();
        const keyID = event.target.dataset.id;
        if (keyID) {
            this.item.setKeySize(keyID, parseInt(event.target.value, 10));
        }
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    async activateListeners(html) {
        super.activateListeners(html);
        /*~ @@DOUBLE-BLANK@@ ~*/
        // @ts-expect-error Fuck.
        html.find("[data-action=\"add-key\"").on("click", this.addKey.bind(this));
        // @ts-expect-error Fuck.
        html.find("[data-action=\"delete-key\"").on("click", this.deleteKey.bind(this));
        // @ts-expect-error Fuck.
        html.find(".key-clock-counter").on("change", this.setKeySize.bind(this));
    }
}
/*~ @@DOUBLE-BLANK@@ ~*/
export default BladesClockKeeperSheet;
/*~ @@DOUBLE-BLANK@@ ~*/ 
