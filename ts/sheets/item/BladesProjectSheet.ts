/* eslint-disable @typescript-eslint/no-unused-vars */
import U from "../../core/utilities";
import C, {BladesActorType, BladesItemType, BladesPhase, Tag, Randomizers, ClockColor, ClockKeyDisplayMode} from "../../core/constants";
import BladesItemSheet from "./BladesItemSheet";

import {BladesActor, BladesPC} from "../../documents/BladesActorProxy";
import {BladesProject} from "../../documents/BladesItemProxy";
import BladesRoll, {BladesRollOpposition} from "../../classes/BladesRoll";
import BladesClockKey, {BladesClock, ClockKeyElems$} from "../../classes/BladesClockKey";

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

    sheetData.presentingClock = this.presentedClock;

    return {
      ...context,
      ...sheetData
    } as ReturnType<BladesItemSheet["getData"]> & {system: ExtractBladesItemSystem<BladesItemType.project>};
  }

  private get presentedClock(): BladesClock|false {
    const {clockKey} = this.document;
    if (!clockKey) {
      throw new Error(`ClockKey not initialized for Project ${this.document.name}`);
    }
    let focusedClockIndex: ClockIndex;
    if (U.isInt(clockKey.displayMode)) {
      focusedClockIndex = clockKey.displayMode;
    } else if (clockKey.displayMode === ClockKeyDisplayMode.presentCurrentClock) {
      focusedClockIndex = this.document.currentClock.index;
    } else if (clockKey.displayMode.startsWith("present")) {
      focusedClockIndex = U.pInt(clockKey.displayMode.slice(7)) as ClockIndex;
    } else {
      return false;
    }

    return this.document.clockKey.getClockByIndex(focusedClockIndex) ?? false;
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

  private switchToPresentAllClocks(clockKey: BladesClockKey, keyElems$: ClockKeyElems$) {
    const {clocks} = keyElems$;
    const timeline = clockKey.switchToMode(keyElems$, ClockKeyDisplayMode.clocks);

    // If there are multiple clocks, reveal labels of visible clocks
    if (clockKey.size > 1) {
      clockKey.visibleClocks.forEach((clock, i) => {
        const {clockLabel$} = clocks[clock.id];
        timeline.blurReveal(clockLabel$, i === 0
          ? ">"
          : "<+0.05");
      });
    }

    timeline.play().then(() => {
      // Change subtitle element to name of current clock
      if (this._htmlContext && this.document.currentClock) {
        this._htmlContext.find(".sheet-subtitle")
          .attr("data-action", "current-clock-name")
          .val(this.document.currentClock.name);
      }
    });
  }

  private switchToPresentClock(
    clockRef: 0|1|2|3|4|5|ClockKeyDisplayMode.presentCurrentClock,
    clockKey: BladesClockKey,
    keyElems$: ClockKeyElems$
  ) {
    const timeline = clockKey.switchToMode(
      keyElems$,
      clockRef === ClockKeyDisplayMode.presentCurrentClock
        ? clockRef
        : (`present${clockRef}`) as ClockKeyDisplayMode,
      undefined,
      undefined,
      true,
      () => {
        eLog.checkLog3("BladesProject", "Clock Switch", {clockRef, clockKey, keyElems$, htmlContext: this._htmlContext, presentedClock: this.presentedClock});
        // Change subtitle element to name of presented clock
        if (this._htmlContext && this.presentedClock) {
          this._htmlContext.find(".sheet-subtitle")
            .attr("data-action", "presented-clock-name")
            .val(this.presentedClock.name);
        }
      });

    // Fade out any visible label elements
    timeline.to(keyElems$.container$.find(".clock-label, .clock-key-label"), {autoAlpha: 0, duration: 0.5, ease: "sine"}, 0);

    timeline.play().then();
  }

  private activateClockKeyListeners(clockKey: BladesClockKey, keyElems$: ClockKeyElems$) {
    eLog.checkLog2("BladesProject", "Clock Key Data", {clockKey, keyElems$});
    const {container$} = keyElems$;

    // Activate pointer events on the container element
    container$.css("pointer-events", "auto");

    container$.on("contextmenu", () => {
      this.switchToPresentAllClocks(clockKey, keyElems$);
    });

    // Add click listeners for player interaction to clock elements
    Object.entries(keyElems$.clocks).forEach(([clockId, clockElems$]) => {
      clockElems$.clockContainer$.css("pointer-events", "auto");

      clockElems$.clockContainer$.on("click", () => {
        this.switchToPresentClock(
          clockKey.clocks.get(clockId)?.index as 0|1|2|3|4|5 ?? ClockKeyDisplayMode.presentCurrentClock,
          clockKey,
          keyElems$
        );
      });
    });
  }

  _htmlContext?: JQuery<HTMLElement>;
  override async activateListeners(html: JQuery<HTMLElement>) {
    this._htmlContext = html;
    await super.activateListeners(html);

    // Get clock key and rendered clock key elements
    const {clockKey, keyElems$} = this.getClockKeyComponents(html);

    // Add listener for contextual clock name depending on display mode
    html.find("input.sheet-subtitle")
      .on({
        change: (event: ChangeEvent) => {
          event.preventDefault();
          const action = $(event.currentTarget).data("action");
          eLog.checkLog3("BladesProject", "Clock Name Change", {action, value: $(event.currentTarget).val()});
          if (action === "presented-clock-name" && this.presentedClock) {
            this.presentedClock.updateTarget("name", $(event.currentTarget).val());
            keyElems$.clocks[this.presentedClock.id].clockLabel$
              .text($(event.currentTarget).val() as string);
          } else if (action === "current-clock-name") {
            this.document.clockKey.currentClock.updateTarget("name", $(event.currentTarget).val());
            keyElems$.clocks[this.document.clockKey.currentClock.id].clockLabel$
              .text($(event.currentTarget).val() as string);
          }
          clockKey.formatLabels(keyElems$);
        }
      });

    // Initialize clock key elements
    clockKey.initElementsInContext(html);

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

    // // Animate to present the currently-active clock
    // clockKey.switchToMode(keyElems$, `present${this.document.currentClock.index}` as ClockKeyDisplayMode)
    //   .play();
  }

}

declare interface BladesProjectSheet {
  get document(): BladesProject
}

export default BladesProjectSheet;
