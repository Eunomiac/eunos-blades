/* eslint-disable @typescript-eslint/no-unused-vars */
import U from "../../core/utilities.js";
import { ClockKeyDisplayMode } from "../../core/constants.js";
import BladesItemSheet from "./BladesItemSheet.js";
class BladesProjectSheet extends BladesItemSheet {
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            classes: ["eunos-blades", "sheet", "item", "project-sheet"],
            template: "systems/eunos-blades/templates/items/project-sheet.hbs"
        });
    }
    getData() {
        const context = super.getData();
        const sheetData = {};
        sheetData.presentingClock = this.presentedClock;
        return {
            ...context,
            ...sheetData
        };
    }
    get presentedClock() {
        const { clockKey } = this.document;
        if (!clockKey) {
            throw new Error(`ClockKey not initialized for Project ${this.document.name}`);
        }
        let focusedClockIndex;
        if (U.isInt(clockKey.displayMode)) {
            focusedClockIndex = clockKey.displayMode;
        }
        else if (clockKey.displayMode === ClockKeyDisplayMode.presentCurrentClock) {
            focusedClockIndex = this.document.currentClock.index;
        }
        else if (clockKey.displayMode.startsWith("present")) {
            focusedClockIndex = U.pInt(clockKey.displayMode.slice(7));
        }
        else {
            return false;
        }
        return this.document.clockKey.getClockByIndex(focusedClockIndex) ?? false;
    }
    getClockKeyComponents(html) {
        const { clockKey } = this.document;
        if (!clockKey) {
            throw new Error(`ClockKey not initialized for Project ${this.document.name}`);
        }
        return {
            clockKey,
            keyElems$: clockKey.getElements$(html.find(".clock-key-panel"))
        };
    }
    switchToPresentAllClocks(clockKey, keyElems$) {
        const { clocks } = keyElems$;
        const timeline = clockKey.switchToMode(keyElems$, ClockKeyDisplayMode.clocks);
        // If there are multiple clocks, reveal labels of visible clocks
        if (clockKey.size > 1) {
            clockKey.visibleClocks.forEach((clock, i) => {
                const { clockLabel$ } = clocks[clock.id];
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
    switchToPresentClock(clockRef, clockKey, keyElems$) {
        const timeline = clockKey.switchToMode(keyElems$, clockRef === ClockKeyDisplayMode.presentCurrentClock
            ? clockRef
            : (`present${clockRef}`), undefined, undefined, true, () => {
            eLog.checkLog3("BladesProject", "Clock Switch", { clockRef, clockKey, keyElems$, htmlContext: this._htmlContext, presentedClock: this.presentedClock });
            // Change subtitle element to name of presented clock
            if (this._htmlContext && this.presentedClock) {
                this._htmlContext.find(".sheet-subtitle")
                    .attr("data-action", "presented-clock-name")
                    .val(this.presentedClock.name);
            }
        });
        // Fade out any visible label elements
        timeline.to(keyElems$.container$.find(".clock-label, .clock-key-label"), { autoAlpha: 0, duration: 0.5, ease: "sine" }, 0);
        timeline.play().then();
    }
    activateClockKeyListeners(clockKey, keyElems$) {
        eLog.checkLog2("BladesProject", "Clock Key Data", { clockKey, keyElems$ });
        const { container$ } = keyElems$;
        // Activate pointer events on the container element
        container$.css("pointer-events", "auto");
        container$.on("contextmenu", () => {
            this.switchToPresentAllClocks(clockKey, keyElems$);
        });
        // Add click listeners for player interaction to clock elements
        Object.entries(keyElems$.clocks).forEach(([clockId, clockElems$]) => {
            clockElems$.clockContainer$.css("pointer-events", "auto");
            clockElems$.clockContainer$.on("click", () => {
                this.switchToPresentClock(clockKey.clocks.get(clockId)?.index ?? ClockKeyDisplayMode.presentCurrentClock, clockKey, keyElems$);
            });
        });
    }
    _htmlContext;
    async activateListeners(html) {
        this._htmlContext = html;
        await super.activateListeners(html);
        // Get clock key and rendered clock key elements
        const { clockKey, keyElems$ } = this.getClockKeyComponents(html);
        // Add listener for contextual clock name depending on display mode
        html.find("input.sheet-subtitle")
            .on({
            change: (event) => {
                event.preventDefault();
                const action = $(event.currentTarget).data("action");
                eLog.checkLog3("BladesProject", "Clock Name Change", { action, value: $(event.currentTarget).val() });
                if (action === "presented-clock-name" && this.presentedClock) {
                    this.presentedClock.updateTarget("name", $(event.currentTarget).val());
                    keyElems$.clocks[this.presentedClock.id].clockLabel$
                        .text($(event.currentTarget).val());
                }
                else if (action === "current-clock-name") {
                    this.document.clockKey.currentClock.updateTarget("name", $(event.currentTarget).val());
                    keyElems$.clocks[this.document.clockKey.currentClock.id].clockLabel$
                        .text($(event.currentTarget).val());
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
            ...clockKey.visibleClocks.map((clock) => new Promise((resolve) => {
                const clockElems$ = keyElems$.clocks[clock.id];
                clock.reveal_Animation(clockElems$, () => { resolve(); });
            })),
            ...clockKey.activeClocks.map((clock) => new Promise((resolve) => {
                const clockElems$ = keyElems$.clocks[clock.id];
                clock.activate_Animation(clockElems$, () => { resolve(); });
            }))
        ]);
        // // Animate to present the currently-active clock
        // clockKey.switchToMode(keyElems$, `present${this.document.currentClock.index}` as ClockKeyDisplayMode)
        //   .play();
    }
}
export default BladesProjectSheet;
