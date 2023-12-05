import BladesActor from "../../BladesActor.js";
import BladesActorSheet from "./BladesActorSheet.js";
import { BladesActorType } from "../../core/constants.js";
class BladesFactionSheet extends BladesActorSheet {
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            classes: ["eunos-blades", "sheet", "actor", "faction"],
            template: "systems/eunos-blades/templates/faction-sheet.hbs",
            width: 900,
            height: "auto",
            tabs: [{ navSelector: ".nav-tabs", contentSelector: ".tab-content", initial: "overview" }]
        });
    }
    getData() {
        const context = super.getData();
        if (!BladesActor.IsType(this.actor, BladesActorType.faction)) {
            return context;
        }
        const sheetData = {
            tierData: {
                class: "comp-tier comp-vertical comp-teeth",
                label: "Tier",
                labelClass: "filled-label full-width",
                dotline: {
                    data: this.actor.system.tier,
                    target: "system.tier.value",
                    svgKey: "teeth.tall",
                    svgFull: "full|half|frame",
                    svgEmpty: "full|half|frame"
                }
            },
            clocks: this.actor.getClocks()
        };
        return {
            ...context,
            ...sheetData
        };
    }
    async _onClockAddClick(event) {
        event.preventDefault();
        this.actor.addClock();
    }
    async _onClockDeleteClick(event) {
        event.preventDefault();
        const clockID = $(event.currentTarget).data("clockId");
        if (!clockID) {
            return;
        }
        this.actor.deleteClock(clockID);
    }
    activateListeners(html) {
        super.activateListeners(html);
        // Everything below here is only needed if the sheet is editable
        if (!this.options.editable) {
            return;
        }
        // Update Inventory Item
        html.find(".item-body").on("click", (event) => {
            const element = $(event.currentTarget).parents(".item");
            const item = this.actor.items.get(element.data("itemId"));
            item?.sheet?.render(true);
        });
        html
            .find(".comp-control.comp-add-clock")
            .on("click", this._onClockAddClick.bind(this));
        html
            .find(".comp-control.comp-delete-clock")
            .on("click", this._onClockDeleteClick.bind(this));
    }
}
export default BladesFactionSheet;
