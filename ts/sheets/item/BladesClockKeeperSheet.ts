
import BladesItemSheet from "./BladesItemSheet";
import BladesClockKeeper from "../../documents/items/BladesClockKeeper";
// import U from "../../core/utilities";
import {BladesItemType} from "../../core/constants";

class BladesClockKeeperSheet extends BladesItemSheet {

  // static Get() { return game.eunoblades.ClockKeeper as BladesClockKeeper; }

  static override get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["eunos-blades", "sheet", "item", "clock-keeper"],
      template: "systems/eunos-blades/templates/items/clock_keeper-sheet.hbs",
      width: 700,
      height: 970
    });
  }

  static async Initialize() {
    Items.registerSheet("blades", BladesClockKeeperSheet, {types: ["clock_keeper"], makeDefault: true});
    return loadTemplates([
      "systems/eunos-blades/templates/items/clock_keeper-sheet.hbs",
      "systems/eunos-blades/templates/parts/clock-sheet-row.hbs"
    ]);
  }

  override getData() {
    const context = super.getData();

    const sheetData: BladesItemDataOfType<BladesItemType.clock_keeper> = {
      sceneOptions: Array.from(game.scenes),
      sceneKeys: this.item.getSceneKeys()
    };

    return {...context, ...sheetData} as BladesItemSheetData;
  }

  addKey(event: MouseEvent) {
    event.preventDefault();
    this.item.addClockKey();
  }

  deleteKey(event: MouseEvent) {
    event.preventDefault();
    const keyID = (event.currentTarget as HTMLElement).dataset.id;
    if (keyID) {
      this.item.deleteClockKey(keyID);
    }
  }

  override async activateListeners(html: JQuery<HTMLElement>) {
    super.activateListeners(html);

    const self = this;

    html.find("[data-action=\"add-key\"]").on({
      click(event: ClickEvent) {
        event.preventDefault();
        self.item.addClockKey();
      }
    });

    html.find("[data-action=\"delete-key\"]").on({
      click(event: ClickEvent) {
        event.preventDefault();
        self.item.deleteClockKey($(event.currentTarget).data("id"));
      }
    });

    html.find("[data-action=\"add-clock\"]").on({
      click(event: ClickEvent) {
        event.preventDefault();
        self.item.addClockToKey($(event.currentTarget).data("id"));
      }
    });

    html.find("[data-action=\"delete-clock\"]").on({
      click(event: ClickEvent) {
        event.preventDefault();
        const [keyID, id] = $(event.currentTarget).data("id").split(/-/);
        self.item.deleteClockFromKey(keyID, id);
      }
    });
  }
}

declare interface BladesClockKeeperSheet {
  item: BladesClockKeeper
}

export default BladesClockKeeperSheet;
