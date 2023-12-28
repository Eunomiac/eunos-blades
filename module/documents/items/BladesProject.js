import { BladesItemType, Factor } from "../../core/constants.js";
import U from "../../core/utilities.js";
import { BladesItem } from "../BladesItemProxy.js";
import { BladesClockKey } from "../../classes/BladesClock.js";
class BladesProject extends BladesItem {
    static Initialize() {
        return loadTemplates([
            "systems/eunos-blades/templates/items/project-sheet.hbs"
        ]);
    }
    static IsType(doc) {
        return super.IsType(doc, BladesItemType.project);
    }
    _clockKey;
    get clockKey() {
        if (this._clockKey) {
            return this._clockKey;
        }
        const { keys } = this.system.clocksData ?? {};
        if (keys) {
            const keyData = Object.values(keys)[0];
            this._clockKey = new BladesClockKey({
                ...keyData,
                targetID: this.uuid
            });
            return this._clockKey;
        }
        return undefined;
    }
    get currentClock() {
        return this.clockKey?.currentClock;
    }
    get isComplete() {
        return this.clockKey?.isComplete;
    }
    get rollOppClock() { return this.currentClock?.data; }
    async advanceClock(segments = 1) {
        if (!this.currentClock) {
            return undefined;
        }
        return this.currentClock.fillSegments(segments);
    }
    get rollFactors() {
        const factorData = {};
        [
            Factor.tier,
            Factor.quality
        ].forEach((factor, i) => {
            const factorTotal = this.getFactorTotal(factor);
            factorData[factor] = {
                name: factor,
                value: factorTotal,
                max: factorTotal,
                baseVal: factorTotal,
                display: factor === Factor.tier ? U.romanizeNum(factorTotal) : `${factorTotal}`,
                isActive: i === 0,
                isPrimary: i === 0,
                isDominant: false,
                highFavorsPC: true,
                cssClasses: `factor-gold${i === 0 ? " factor-main" : ""}`
            };
        });
        return factorData;
    }
    getFactorTotal(factor) {
        switch (factor) {
            case Factor.tier: return this.system.tier.value;
            case Factor.quality: return this.getFactorTotal(Factor.tier);
            // no default
        }
        return 0;
    }
    get rollOppImg() { return ""; }
    async _onCreate(...args) {
        await super._onCreate(...args);
        await BladesClockKey.Create({
            target: this,
            targetKey: "system.clocksData.keys",
            isActive: true,
            isVisible: true
        });
    }
    get keyElem() {
        if (!this.clockKey) {
            return undefined;
        }
        return $(`#${this.clockKey.id}`)[0];
    }
    get currentClockElem() {
        if (!this.keyElem) {
            return undefined;
        }
        if (!this.currentClock) {
            return undefined;
        }
        return $(this.keyElem).find(`.clock[data-id="${this.currentClock.id}"]`)[0];
    }
    animateProjectKey() {
        const keyID = this.clockKey?.id;
        if (!keyID) {
            return undefined;
        }
        const keyElem = $(`#${keyID}`)[0];
        const keyContainerElem = $(keyElem).closest(".clock-key-container")[0];
        const curClockID = this.currentClock?.id;
        if (!curClockID) {
            return undefined;
        }
        const clockElem = $(`.clock[data-id="${curClockID}"]`)[0];
        const clockContainerElem = $(clockElem).closest(".clock-container")[0];
        const sheetRootElem = $(keyElem).closest(".sheet-root")[0];
        // Find current position of active clock element in .sheet-root space:
        const cPosInRoot = U.MotionPathPlugin.convertCoordinates(keyElem, sheetRootElem, {
            x: U.gsap.getProperty(clockElem, "top"),
            y: U.gsap.getProperty(clockElem, "left")
        });
        // Find current position of active clock container element in .sheet-root space:
        const cContPosInRoot = U.MotionPathPlugin.convertCoordinates(keyElem, sheetRootElem, {
            x: U.gsap.getProperty(clockContainerElem, "top"),
            y: U.gsap.getProperty(clockContainerElem, "left")
        });
        // Target position for active clock in .sheet-root space:
        //    top: 33%
        //    left: 100% - 0.5 * key container width
        const targetCContPosInRoot = {
            x: U.gsap.getProperty(sheetRootElem, "width")
                - (0.75 * U.gsap.getProperty(keyContainerElem, "width")),
            y: 0.5 * U.gsap.getProperty(sheetRootElem, "height")
        };
        // Find delta from current position to target position, for entire key to traverse:
        const keyDeltaX = targetCContPosInRoot.x - cContPosInRoot.x;
        const keyDeltaY = targetCContPosInRoot.y - cContPosInRoot.y;
        eLog.checkLog3("animateProjectKey", "[AnimateProjectKey] Positions & Elements", {
            elements: {
                sheetRootElem,
                keyElem,
                clockElem,
                keyContainerElem,
                clockContainerElem
            },
            positions: {
                "1) clockContainer in Root": cContPosInRoot,
                "1.5) clock in Root": cPosInRoot,
                "2) target Pos in Root": targetCContPosInRoot,
                "3) deltas": { x: keyDeltaX, y: keyDeltaY }
            }
        });
        // Construct timeline:
        const tl = U.gsap.timeline({
            repeat: -1,
            yoyo: true,
            delay: 10
        })
            // Add scaling timeline:
            .fromTo(keyElem, { xPercent: -50, yPercent: -50, scale: 0.95 }, { scale: 2, duration: 20, ease: "sine.inOut" }, 0)
            // Initialize gentle rotation:
            .fromTo(keyElem, { xPercent: -50, yPercent: -50, rotateX: 0, rotateY: 0, rotateZ: 0 }, { rotateX: 5, rotateY: 5, rotateZ: 5, duration: 5, ease: "sine.inOut" }, 0)
            // Continue rotation:
            .to(keyElem, { rotateX: -5, rotateY: -5, rotateZ: -5, duration: 5, repeat: 8, yoyo: true, ease: "sine.inOut" }, 5)
            // Add positioning timeline:
            .to(keyElem, { x: `+=${keyDeltaX}`, y: `+=${keyDeltaY}`, duration: 20, ease: "sine.inOut" }, 0);
        // Seek timeline to midway point
        tl.seek(20);
        // Play timeline
        tl.play();
        // Return timeline;
        return tl;
    }
}
export default BladesProject;
