/* eslint-disable @typescript-eslint/no-unused-vars */
import U from "../../core/utilities";
import C, {BladesActorType, BladesItemType, BladesPhase, Tag, Randomizers, ClockColor, ClockKeyDisplayMode} from "../../core/constants";
import BladesItemSheet from "./BladesItemSheet";

import {BladesActor, BladesPC} from "../../documents/BladesActorProxy";
import {BladesProject} from "../../documents/BladesItemProxy";
import BladesRoll, {BladesRollOpposition} from "../../classes/BladesRoll";
import BladesClockKey, {ClockKeyElems$} from "../../classes/BladesClocks";

class BladesProjectSheet extends BladesItemSheet {

  static override get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["eunos-blades", "sheet", "item", "project-sheet"],
      template: "systems/eunos-blades/templates/items/project-sheet.hbs"
    });
  }

  override getData() {
    const context = super.getData() as ReturnType<BladesItemSheet["getData"]> & {system: ExtractBladesItemSystem<BladesItemType.project>};

    const sheetData: Partial<BladesItemDataOfType<BladesItemType.project>> = {};

    return {
      ...context,
      ...sheetData
    } as ReturnType<BladesItemSheet["getData"]> & {system: ExtractBladesItemSystem<BladesItemType.project>};
  }

  private getClockKeyComponents(html: JQuery<HTMLElement>) {
    const {clockKey} = this.document;

    if (!clockKey) {
      throw new Error(`ClockKey not initialized for Project ${this.document.name}`);
    }

    return {
      clockKey,
      keyElems$: clockKey.getElements$(html.find(".clock-key-panel"))
    };
  }

  private initClockKeyElems(clockKey: BladesClockKey, keyElems$: ClockKeyElems$) {
    // Fit clock key to present current clock
    clockKey.fitKeyToContainer(keyElems$, clockKey.clocksDisplayPosData);

    // this.switchToMode(keyElems$, this.displayMode).play();

    // Initialize label elements
    clockKey.formatLabels(keyElems$);
  }

  private prepareClockKeyTimelines(clockKey: BladesClockKey, keyElems$: ClockKeyElems$) {
    // Timelines
  }

  private activateClockKeyListeners(clockKey: BladesClockKey, keyElems$: ClockKeyElems$) {
    const {container$, clocks} = keyElems$;
    const clickTimeline = clockKey.switchToMode(keyElems$, ClockKeyDisplayMode.full);

    // If there are multiple clocks, reveal labels of visible clocks
    if (clockKey.size > 1) {
      clockKey.visibleClocks.forEach((clock) => {
        const {clockLabel$} = clocks[clock.id];
        clickTimeline.blurReveal(clockLabel$);
      });
    }

    // Attach click timeline to clock key container, activate pointer events
    container$.data("clickTimeline", clickTimeline);
    container$.css("pointer-events", "auto");

    // Add click and hover listeners for player interaction.
    container$.on("click", () => {
      // If timeline is anywhere except at the start, play it, otherwise reverse it.
      const timeline = container$.data("clickTimeline");
      if (timeline.progress() === 0) {
        timeline.play();
      } else {
        timeline.reverse();
      }
    });
  }

  override async activateListeners(html: JQuery<HTMLElement>) {
    super.activateListeners(html);

    const {clockKey, keyElems$} = this.getClockKeyComponents(html);

    // Initialize project clock key elements
    this.initClockKeyElems(clockKey, keyElems$);

    // Prepare animation timelines & attach them to rendered elements
    this.prepareClockKeyTimelines(clockKey, keyElems$);

    // Activate listeners for the rendered key
    this.activateClockKeyListeners(clockKey, keyElems$);

    // Reveal & activate clocks
    await Promise.all([
      ...clockKey.visibleClocks.map((clock) => new Promise<void>((resolve) => {
        const clockElems$ = keyElems$.clocks[clock.id];
        clock.reveal_Animation(clockElems$, () => {resolve();});
      })),
      ...clockKey.activeClocks.map((clock) => new Promise<void>((resolve) => {
        const clockElems$ = keyElems$.clocks[clock.id];
        clock.activate_Animation(clockElems$, () => {resolve();});
      }))
    ]);
  }

}

declare interface BladesProjectSheet {
  get document(): BladesProject
}

export default BladesProjectSheet;
