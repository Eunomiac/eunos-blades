import { BladesItemSheet } from "./blades-item-sheet.js";
import { BladesItem } from "./blades-item.js";

export default class EunoClockKeeperSheet extends BladesItemSheet {
    
        static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            classes: ["eunos-blades", "sheet", "item", "clock-keeper"],
            template: "systems/eunos-blades/templates/clock-keeper-sheet.hbs",
            width: 700,
            height: 970
        });
    }
    
    static async Initialize() {
        game.eunoblades ??= {};
        Items.registerSheet("blades", EunoClockKeeperSheet, { types: ["clock_keeper"], makeDefault: true });
        Hooks.once("ready", async () => {
            let clockKeeper = game.items.find((item) => item.type === "clock_keeper");
            if (!(clockKeeper instanceof BladesItem)) {
                clockKeeper = (await BladesItem.create({
                    name: "Clock Keeper",
                    type: "clock_keeper",
                    img: "systems/eunos-blades/assets/icons/clock-keeper.svg"
                }));
            }
            game.eunoblades.ClockKeeper = clockKeeper;
            game.eunoblades.ClockKeeper.renderOverlay();
        });
        Hooks.on("canvasReady", async () => { game.eunoblades.ClockKeeper?.renderOverlay(); });
        return loadTemplates([
            "systems/eunos-blades/templates/clock-overlay.hbs",
            "systems/eunos-blades/templates/clock-keeper-sheet.hbs",
            "systems/eunos-blades/templates/parts/clock-key.hbs",
            "systems/eunos-blades/templates/parts/clock.hbs",
            "systems/eunos-blades/templates/parts/clock-clip-paths.hbs",
            "systems/eunos-blades/templates/parts/clock-sheet-row.hbs"
        ]);
    }
    
        async _updateObject(event, formData) {
        const updateData = await this.object.update(formData);
        this.item.renderOverlay();
        return updateData;
    }
    
        getData() {
        const data = super.getData();
        data.data.clock_keys = Object.fromEntries(Object.entries(data.data.clock_keys)
            .filter(([keyID, keyData]) => Boolean(keyData && keyData.scene === data.data.targetScene)));
        return data;
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
            this.item.setKeySize(keyID, parseInt(event.target.value));
        }
    }
    
    async activateListeners(html) {
        super.activateListeners(html);
        
        html.find("[data-action=\"add-key\"").on("click", this.addKey.bind(this));
        html.find("[data-action=\"delete-key\"").on("click", this.deleteKey.bind(this));
        html.find(".key-clock-counter").on("change", this.setKeySize.bind(this));
    }
}