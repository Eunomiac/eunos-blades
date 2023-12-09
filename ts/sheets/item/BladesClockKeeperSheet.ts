
import BladesItemSheet from "./BladesItemSheet";
import BladesClockKeeper from "../../documents/items/BladesClockKeeper";
// import U from "../../core/utilities";
import {BladesItemType} from "../../core/constants";

class BladesClockKeeperSheet extends BladesItemSheet {

  static Get() { return game.eunoblades.ClockKeeper as BladesClockKeeper; }

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
    Hooks.once("ready", async () => {
      let clockKeeper: BladesClockKeeper|undefined = game.items.find((item): item is BladesClockKeeper => item.type === "clock_keeper");
      if (!clockKeeper) {
        clockKeeper = (await BladesClockKeeper.create({
          name: "Clock Keeper",
          type: "clock_keeper",
          img: "systems/eunos-blades/assets/icons/misc-icons/clock-keeper.svg"
        })) as BladesClockKeeper;
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
