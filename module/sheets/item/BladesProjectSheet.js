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
        return {
            ...context,
            ...sheetData
        };
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
    initClockKeyElems(clockKey, keyElems$) {
        // Fit clock key to present current clock
        clockKey.fitKeyToContainer(keyElems$, clockKey.clocksDisplayPosData);
        // this.switchToMode(keyElems$, this.displayMode).play();
        // Initialize label elements
        clockKey.formatLabels(keyElems$);
    }
    prepareClockKeyTimelines(clockKey, keyElems$) {
        // Timelines
    }
    activateClockKeyListeners(clockKey, keyElems$) {
        const { container$, clocks } = keyElems$;
        const clickTimeline = clockKey.switchToMode(keyElems$, ClockKeyDisplayMode.full);
        // If there are multiple clocks, reveal labels of visible clocks
        if (clockKey.size > 1) {
            clockKey.visibleClocks.forEach((clock) => {
                const { clockLabel$ } = clocks[clock.id];
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
            }
            else {
                timeline.reverse();
            }
        });
    }
    async activateListeners(html) {
        super.activateListeners(html);
        const { clockKey, keyElems$ } = this.getClockKeyComponents(html);
        // Initialize project clock key elements
        this.initClockKeyElems(clockKey, keyElems$);
        // Prepare animation timelines & attach them to rendered elements
        this.prepareClockKeyTimelines(clockKey, keyElems$);
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
    }
}
export default BladesProjectSheet;
