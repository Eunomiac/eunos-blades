import {BladesItemType, Factor} from "../../core/constants";
import U from "../../core/utilities";
import {BladesItem} from "../BladesItemProxy";
import BladesClock, {BladesClockKey} from "./BladesClock";
import BladesRoll from "../../BladesRoll";

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
    const {keys} = this.system.clocksData ?? {};
    if (keys) {
      const keyData = Object.values(keys)[0];
      this._clockKey = new BladesClockKey(...[{
        ...keyData,
        target: this
      }] as ConstructorParameters<typeof BladesClockKey>);
      return this._clockKey;
    }
    return undefined;
  }

  get currentClock(): BladesClock|undefined {
    return this.clockKey?.getCurrentClock();
  }

  get isComplete() {
    return this.clockKey?.isComplete;
  }

  get rollOppClock() { return this.clockKey?.getCurrentClock(); }

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
      id: randomID(),
      target: this,
      targetKey: "system.clocksData.keys"
    });
  }


  // async addClock()

}

declare interface BladesProject {
  type: BladesItemType.project,
  system: BladesItemSchema.Project
}

export default BladesProject;
