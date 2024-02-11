import {BladesItemType, Factor, ClockColor, ClockKeyDisplayMode} from "../../core/constants";
import U from "../../core/utilities";
import {BladesItem} from "../BladesItemProxy";
import BladesProjectSheet from "../../sheets/item/BladesProjectSheet";
import BladesClockKey from "../../classes/BladesClocks";
import BladesRoll from "../../classes/BladesRoll";
import type {ItemDataConstructorData} from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/itemData";

class BladesProject extends BladesItem implements BladesItemSubClass.Project,
  BladesRoll.OppositionData {

  // #region INITIALIZATION ~
  static async Initialize() {
    Object.assign(globalThis, {BladesProject, BladesProjectSheet});
    Items.registerSheet("blades", BladesProjectSheet, {types: ["project"], makeDefault: true});
    return loadTemplates(["systems/eunos-blades/templates/items/project-sheet.hbs"]);
  }
  // #endregion

  static override IsType<T extends BladesItemType = BladesItemType.project>(doc: unknown): doc is BladesItemOfType<T> {
    return super.IsType(doc, BladesItemType.project);
  }

  static override async create(
    data: ItemDataConstructorData & { system?: { world_name?: string, description?: string } },
    options = {}
  ) {
    const project = (await super.create(data, {...options, renderSheet: false})) as BladesProject;

    if (!project._clockKey) {
      project._clockKey = await BladesClockKey.Create({
        name: project.name,
        target: project,
        targetKey: "system.clocksData" as TargetKey,
        isNameVisible: false,
        isSpotlit: false,
        isVisible: true,
        displayMode: ClockKeyDisplayMode.clocks
        // oneKeyIndex: U.gsap.utils.random(0, 4, 1) as OneKeyImgIndex
      }, undefined, [{
        name: "",
        index: 0,
        color: ClockColor.yellow,
        value: 0,
        max: 8,
        isVisible: true,
        isActive: true,
        isNameVisible: false,
        isHighlighted: false
      }]);
    }

    return project as unknown as Promise<StoredDocument<Item> | undefined>;
  }

  _clockKey?: BladesClockKey;
  get clockKey(): BladesClockKey {
    if (this._clockKey) { return this._clockKey; }
    const keysData = Object.values(this.system.clocksData);
    if (keysData.length === 0) {
      throw new Error(`ClockKey not initialized for Project ${this.name}`);
    }
    let keyID: IDString|undefined;
    if (keysData.length === 1) {
      keyID = keysData[0].id;
    } else if (this.isEmbedded) {
      // Find the key data with a targetID that includes the parent document's id
      keyID = keysData.find((keyData) => keyData.targetID.includes(this.parent?.id as string))?.id;
      if (!keyID) {
        throw new Error(`ClockKey not initialized for Project ${this.name} embedded in document '${this.parent?.name}'.`);
      }
    } else {
      // Find the key of form 'Item.<IDString>' in the ClockKeys collection
      keyID = keysData.find((keyData) => /^Item\.[^.]{16}$/.exec(keyData.targetID))?.id;
      if (!keyID) {
        throw new Error(`ClockKey not initialized for Project ${this.name}.`);
      }
    }
    this._clockKey = game.eunoblades.ClockKeys.get(keyID) ?? new BladesClockKey(this.system.clocksData[keyID]);
    if (!this._clockKey) {
      throw new Error(`ClockKey not initialized for Project ${this.name}`);
    }
    return this._clockKey;
  }

  get ownerName(): string|undefined {
    if (this.parent) {
      return this.parent.name;
    }
    return undefined;
  }

  get currentClock() {
    return this.clockKey.currentClock;
  }

  get isComplete() {
    return this.clockKey.isComplete;
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

  get keyElem(): HTMLElement|undefined {
    if (!this.clockKey) { return undefined; }
    return $(`#${this.clockKey.id}`)[0];
  }

  get currentClockElem(): HTMLElement|undefined {
    if (!this.keyElem) { return undefined; }
    if (!this.currentClock) { return undefined; }
    return $(this.keyElem).find(`.clock[data-id="${this.currentClock.id}"]`)[0];
  }
}

declare interface BladesProject {
  type: BladesItemType.project,
  system: BladesItemSchema.Project
}

export default BladesProject;
