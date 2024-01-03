import {BladesItemType, Factor} from "../../core/constants";
import U from "../../core/utilities";
import {BladesItem} from "../BladesItemProxy";
import BladesClockKey from "../../classes/BladesClocks";
import BladesRoll from "../../classes/BladesRoll";

class BladesProject extends BladesItem implements BladesItemSubClass.Project,
  BladesRoll.OppositionDocData {

  static Initialize() {
    return loadTemplates([
      "systems/eunos-blades/templates/items/project-sheet.hbs"
    ]);
  }

  static override IsType<T extends BladesItemType = BladesItemType.project>(doc: unknown): doc is BladesItemOfType<T> {
    return super.IsType(doc, BladesItemType.project);
  }

  _clockKey?: BladesClockKey;
  get clockKey(): BladesClockKey|undefined {
    if (this._clockKey) { return this._clockKey; }
    this._clockKey = game.eunoblades.ClockKeys.get(Object.keys(this.system.clocksData)[0]);
    return this._clockKey;
  }

  get ownerName(): string|undefined {
    if (this.parent) {
      return this.parent.name;
    }
    return undefined;
  }

  get currentClock() {
    return this.clockKey?.activeClocks[0];
  }

  get isComplete() {
    return this.clockKey?.isComplete;
  }

  get rollOppClock() { return this.currentClock?.data; }

  async advanceClock(segments = 1) {
    if (!this.currentClock) { return undefined; }
    return this.currentClock.fillSegments(segments);
  }

  override get rollFactors(): Partial<Record<Factor, BladesRoll.FactorData>> {

    const factorData: Partial<Record<Factor, BladesRoll.FactorData>> = {};
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

  override getFactorTotal(factor: Factor): number {
    switch (factor) {
      case Factor.tier: return this.system.tier.value;
      case Factor.quality: return this.getFactorTotal(Factor.tier);
      // no default
    }
    return 0;
  }

  override get rollOppImg() { return ""; }

  override async _onCreate(...args: Parameters<BladesItem["_onCreate"]>) {
    await super._onCreate(...args);
    await BladesClockKey.Create({
      target: this,
      targetKey: "system.clocksData" as TargetKey,
      isActive: true,
      isVisible: true
    });
  }

  get keyElem(): HTMLElement|undefined {
    if (!this.clockKey) { return undefined; }
    return $(`#${this.clockKey.id}`)[0];
  }

  get currentClockElem(): HTMLElement|undefined {
    if (!this.keyElem) { return undefined; }
    if (!this.currentClock) { return undefined; }
    return $(this.keyElem).find(`.clock[data-id="${this.currentClock.id}"]`)[0];
  }

  animateProjectKey(): gsap.core.Timeline|undefined {
    const keyID = this.clockKey?.id;
    if (!keyID) { return undefined; }
    const keyElem = $(`#${keyID}`)[0];

    const keyContainerElem = $(keyElem).closest(".clock-key-container")[0];

    const curClockID = this.currentClock?.id;
    if (!curClockID) { return undefined; }
    const clockElem = $(`.clock[data-id="${curClockID}"]`)[0];

    const clockContainerElem = $(clockElem).closest(".clock-container")[0];

    const sheetRootElem = $(keyElem).closest(".sheet-root")[0];

    // Find current position of active clock element in .sheet-root space:
    const cPosInRoot = U.MotionPathPlugin.convertCoordinates(
      keyElem,
      sheetRootElem,
      {
        x: U.gsap.getProperty(clockElem, "top") as number,
        y: U.gsap.getProperty(clockElem, "left") as number
      });

    // Find current position of active clock container element in .sheet-root space:
    const cContPosInRoot = U.MotionPathPlugin.convertCoordinates(
      keyElem,
      sheetRootElem,
      {
        x: U.gsap.getProperty(clockContainerElem, "top") as number,
        y: U.gsap.getProperty(clockContainerElem, "left") as number
      });

    // Target position for active clock in .sheet-root space:
    //    top: 33%
    //    left: 100% - 0.5 * key container width
    const targetCContPosInRoot: gsap.Point2D = {
      x: (U.gsap.getProperty(sheetRootElem, "width") as number)
        - (0.75 * (U.gsap.getProperty(keyContainerElem, "width") as number)),
      y: 0.5 * (U.gsap.getProperty(sheetRootElem, "height") as number)
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
        "3) deltas": {x: keyDeltaX, y: keyDeltaY}
      }
    });

    // Construct timeline:
    const tl = U.gsap.timeline({
      repeat: -1,
      yoyo: true,
      delay: 10
    })
      // Add scaling timeline:
      .fromTo(keyElem, {xPercent: -50, yPercent: -50, scale: 0.95}, {scale: 2, duration: 20, ease: "sine.inOut"}, 0)
      // Initialize gentle rotation:
      .fromTo(keyElem, {xPercent: -50, yPercent: -50, rotateX: 0, rotateY: 0, rotateZ: 0}, {rotateX: 5, rotateY: 5, rotateZ: 5, duration: 5, ease: "sine.inOut"}, 0)
      // Continue rotation:
      .to(keyElem, {rotateX: -5, rotateY: -5, rotateZ: -5, duration: 5, repeat: 8, yoyo: true, ease: "sine.inOut"}, 5)
      // Add positioning timeline:
      .to(keyElem, {x: `+=${keyDeltaX}`, y: `+=${keyDeltaY}`, duration: 20, ease: "sine.inOut"}, 0);

    // Seek timeline to midway point
    tl.seek(20);
    // Play timeline
    tl.play();

    // Return timeline;
    return tl;
  }


  // async addClock()

}

declare interface BladesProject {
  type: BladesItemType.project,
  system: BladesItemSchema.Project
}

export default BladesProject;
