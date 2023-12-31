import BladesItemSheet from "./BladesItemSheet.js";
class BladesClockKeeperSheet extends BladesItemSheet {
    // static Get() { return game.eunoblades.ClockKeeper as BladesClockKeeper; }
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            classes: ["eunos-blades", "sheet", "item", "clock-keeper"],
            template: "systems/eunos-blades/templates/items/clock_keeper-sheet.hbs",
            width: 700,
            height: 970
        });
    }
    static async Initialize() {
        Items.registerSheet("blades", BladesClockKeeperSheet, { types: ["clock_keeper"], makeDefault: true });
        return loadTemplates([
            "systems/eunos-blades/templates/items/clock_keeper-sheet.hbs",
            "systems/eunos-blades/templates/parts/clock-sheet-row.hbs"
        ]);
    }
    getData() {
        const context = super.getData();
        const sheetData = {
            sceneOptions: Array.from(game.scenes),
            sceneKeys: this.item.getSceneKeys(this.item.system.targetScene ?? game.scenes.current.id)
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
        html.find("[data-action=\"add-clock\"]").on({
            click(event) {
                event.preventDefault();
                self.item.addClockToKey($(event.currentTarget).data("id"));
            }
        });
        html.find("[data-action=\"delete-clock\"]").on({
            click(event) {
                event.preventDefault();
                const [keyID, id] = $(event.currentTarget).data("id").split(/-/);
                self.item.deleteClockFromKey(keyID, id);
            }
        });
    }
}
export default BladesClockKeeperSheet;
