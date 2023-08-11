
import {BladesItemType} from "../../core/constants.js";
import BladesItemSheet from "./blades-item-sheet.js";
import BladesItem from "../../blades-item.js";

type BladesClockKeeperSheetData = Partial<BladesItemSheetData> & {
  clock_keys: Record<string, BladesMultiClockData>
};

export default class BladesClockKeeperSheet extends BladesItemSheet {

  static Get() { return game.eunoblades.ClockKeeper as BladesItemOfType<BladesItemType.gm_tracker> }

  static override get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["eunos-blades", "sheet", "item", "clock-keeper"],
      template: "systems/eunos-blades/templates/items/clock_keeper-sheet.hbs",
      width: 700,
      height: 970
    });
  }

  static async Initialize() {
    game.eunoblades ??= {};
    Items.registerSheet("blades", BladesClockKeeperSheet, {types: ["clock_keeper"], makeDefault: true});
    Hooks.once("ready", async () => {
      let clockKeeper: BladesItem|undefined = game.items.find((item) => item.type === "clock_keeper");
      if (!(clockKeeper instanceof BladesItem)) {
        clockKeeper = (await BladesItem.create({
          name: "Clock Keeper",
          type: "clock_keeper",
          img: "systems/eunos-blades/assets/icons/misc-icons/clock-keeper.svg"
        })) as BladesItem;
      }
      game.eunoblades.ClockKeeper = clockKeeper;
      game.eunoblades.ClockKeeper.renderOverlay();
    });
    Hooks.on("canvasReady", async () => { game.eunoblades.ClockKeeper?.renderOverlay() });
    return loadTemplates([
      "systems/eunos-blades/templates/items/clock_keeper-sheet.hbs",
      "systems/eunos-blades/templates/parts/clock-sheet-row.hbs"
    ]);
  }


  // override async _updateObject(event: unknown, formData: any) {
  //   const updateData = await this.object.update(formData);
  //   socketlib.system.executeForEveryone("renderOverlay");
  //   // this.item.renderOverlay();
  //   return updateData;
  // }

  override getData() {
    const context = super.getData() as ReturnType<BladesItemSheet["getData"]> & List<any>;

    const sheetData: BladesClockKeeperSheetData = {
      clock_keys: Object.fromEntries((Object.entries(context.system.clock_keys ?? {})
        .filter(([keyID, keyData]) => Boolean(keyData && keyData.scene === context.system.targetScene)))) as Record<string, BladesMultiClockData>
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

  setKeySize(event: InputEvent) {
    event.preventDefault();
    const keyID = (event.target as HTMLInputElement).dataset.id;
    if (keyID) {
      this.item.setKeySize(keyID, parseInt((event.target as HTMLInputElement).value));
    }
  }

  override async activateListeners(html: JQuery<HTMLElement>) {
    super.activateListeners(html);

    // @ts-expect-error Fuck.
    html.find("[data-action=\"add-key\"").on("click", this.addKey.bind(this));
    // @ts-expect-error Fuck.
    html.find("[data-action=\"delete-key\"").on("click", this.deleteKey.bind(this));
    // @ts-expect-error Fuck.
    html.find(".key-clock-counter").on("change", this.setKeySize.bind(this));
  }
}
