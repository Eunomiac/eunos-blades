
import U from "../../core/utilities";
import BladesItemSheet from "./BladesItemSheet";
import BladesClockKeeper from "../../documents/items/BladesClockKeeper";
// import U from "../../core/utilities";
import {BladesItemType} from "../../core/constants";
import {BladesPC, BladesFaction} from "../../documents/BladesActorProxy";
import BladesClockKey from "../../classes/BladesClocks";

class BladesClockKeeperSheet extends BladesItemSheet {

  // static Get() { return game.eunoblades.ClockKeeper as BladesClockKeeper; }

  static override get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["eunos-blades", "sheet", "item", "clock-keeper"],
      template: "systems/eunos-blades/templates/items/clock_keeper-sheet.hbs",
      width: 700,
      height: 970,
      tabs: [{navSelector: ".nav-tabs", contentSelector: ".tab-content", initial: "scene-keys"}]
    });
  }

  static async Initialize() {
    Items.registerSheet("blades", BladesClockKeeperSheet, {types: ["clock_keeper"], makeDefault: true});
    return loadTemplates([
      "systems/eunos-blades/templates/items/clock_keeper-sheet.hbs"
    ]);
  }

  override getData() {
    const context = super.getData();

    const sheetData: BladesItemDataOfType<BladesItemType.clock_keeper> = {
      sceneOptions: Array.from(game.scenes),
      sceneKeys: this.item.getSceneKeys(this.item.system.targetScene ?? game.scenes.current.id as IDString),
      pcsWithProjects: BladesPC.All.filter((pc) => pc.projects.length > 0),
      factions: Array.from(BladesFaction.All)
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

    function getClockKeyFromEvent(event: ClickEvent): BladesClockKey {
      const id = $(event.currentTarget).data("keyId");
      if (!id) { throw new Error("No id found on element"); }
      const clockKey = game.eunoblades.ClockKeys.get(id as IDString);
      if (!clockKey) { throw new Error(`Clock key with id ${id} not found`); }
      return clockKey;
    }

    html.find("[data-action=\"create-clock-key\"").on({
      click: async (event: ClickEvent) => {
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
      click: async (event: ClickEvent) => {
        event.preventDefault();
        await getClockKeyFromEvent(event).drop_SocketCall();
      }
    });

    html.find("[data-action=\"pull-clock-key\"]").on({
      click: async (event: ClickEvent) => {
        event.preventDefault();
        await getClockKeyFromEvent(event).pull_SocketCall();
      }
    });
  }
}

declare interface BladesClockKeeperSheet {
  item: BladesClockKeeper
}

export default BladesClockKeeperSheet;
