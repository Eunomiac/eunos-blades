import {ClockColor, Factor} from "../../core/constants";
import U from "../../core/utilities";
import {BladesItem} from "../BladesItemProxy";
import BladesRoll from "../../BladesRoll";

type BladesTargetLinkConfig = {
  id: IDString,
  target: string|BladesDoc,
  targetKey?: string,
  targetFlagKey?: string
}

class BladesTargetLink {

  protected static validateConfig<T extends BladesTargetLinkConfig = BladesTargetLinkConfig>(ref: unknown): ref is T {
    // Check if 'ref' is a simple object literal
    if (!U.isSimpleObj(ref)) { return false; }
    // Confirm a target key or flag key has been provided.
    if (!ref.targetKey && !ref.targetFlagKey) { return false; }
    // Confirm a target has been provided, and that it can be resolved to a Document entity.
    if (!ref.target) { return false; }
    if (U.isDocID(ref.target)) {
      // Convert string id of target to target Document
      ref.target = game.actors.get(ref.target) ?? game.items.get(ref.target);
    }
    if (!(ref.target instanceof Actor || ref.target instanceof Item)) { return false; }
    return true;
  }

  _id: string;

  _targetID: string;

  get targetID() { return this._targetID; }

  _target: BladesDoc;

  get target(): BladesDoc { return this._target; }

  _targetKey = "system";

  get targetKey(): string { return this._targetKey; }

  _targetFlagKey?: string;

  get targetFlagKey(): string|undefined { return this._targetFlagKey; }

  constructor(config: BladesTargetLinkConfig) {
    if (!BladesTargetLink.validateConfig(config)) {
      eLog.error("[new BladesTargetLink] Bad Config File.", config);
      throw new Error("See log.");
    }

    const {id, target, targetKey, targetFlagKey} = config;
    this._id = id;
    this._target = target as BladesDoc;
    this._targetID = this.target.id;
    this._targetKey = targetKey ?? "system";
    this._targetFlagKey = targetFlagKey;
  }

  getSystemData() {
    if (this.targetFlagKey) {
      return this.target.getFlag("eunos-blades", `${this.targetFlagKey}.${this._id}`);
    }
    return getProperty(this.target, `${this.targetKey}.${this._id}`);
  }

  get id() { return this._id; }

  get name(): string { return this.getSystemData().name; }

  protected async updateTarget(prop: string, val: unknown) {
    if (this.targetFlagKey) {
      (this.target as BladesItem).setFlag("eunos-blades", `${this.targetFlagKey}.${this._id}.${prop}`, val);
    } else {
      this.target.update({[`${this.targetKey}.${this._id}.${prop}`]: val});
    }
  }

  protected async updateTargetData(val: unknown) {
    if (this.targetFlagKey) {
      if (val === null) {
        (this.target as BladesItem).unsetFlag("eunos-blades", `${this.targetFlagKey}.${this._id}`);
      } else {
        (this.target as BladesItem).setFlag("eunos-blades", `${this.targetFlagKey}.${this._id}`, val);
      }
    } else if (val === null) {
      this.target.update({[`${this.targetKey}.-=${this._id}`]: null});
    } else {
      this.target.update({[`${this.targetKey}.${this._id}`]: val});
    }
  }

  async delete(): Promise<void> {
    return this.updateTargetData(null);
  }
}


export type BladesClockKeyConfig = Partial<BladesClockKeySystemData> & BladesTargetLinkConfig;

class BladesClockKey extends BladesTargetLink implements BladesClockKeyData,
  BladesRoll.OppositionDocData {

  static get DefaultSchema(): Omit<BladesClockKeySystemData, "target"> {
    return {
      id: randomID(),
      name: "",

      size: 1,

      isVisible: false,
      isActive: false,
      isNameVisible: false,

      clocksData: {}
    };
  }

  static applyConfigDefaults(clockKeyConfig: BladesClockKeyConfig): BladesClockKeySystemData {

    const keyData: BladesClockKeySystemData = {
      ...this.DefaultSchema,
      ...clockKeyConfig
    };

    if (keyData.target instanceof Actor || keyData.target instanceof Item) {
      keyData.target = keyData.target.id;
    }

    const clockID = randomID();

    const clockTargetLinkData: BladesTargetLinkConfig = {
      id: clockID,
      target: keyData.target as string,
      targetKey: keyData.targetKey ? `${keyData.targetKey}.${keyData.id}.clocksData` : undefined,
      targetFlagKey: keyData.targetFlagKey ? `${keyData.targetKey}.${keyData.id}.clocksData` : undefined
    };

    keyData.clocksData[clockID] = {
      ...BladesClock.DefaultSchema,
      ...(clockTargetLinkData as BladesTargetLinkConfig & {target: string})
    };

    return keyData;
  }

  static async Create(clockKeyConfig: BladesClockKeyConfig): Promise<BladesClockKey> {
    if (!this.validateConfig<BladesClockKeyConfig>(clockKeyConfig)) {
      eLog.error("[BladesClockKey.Create()] Invalid Config", clockKeyConfig);
      throw new Error("See log.");
    }
    eLog.checkLog3("[BladesClockKey.Create()] Config", clockKeyConfig);

    // Create the clock key instance, supplying the config.
    // BladesClockKey constructor will apply defaults for missing values.
    const clockKey = new BladesClockKey(clockKeyConfig);

    // Wait for clockKey data to be written to target
    await clockKey.initialize();

    return clockKey;
  }

  get isVisible(): boolean { return this.getSystemData().isVisible; }

  get isActive(): boolean { return this.getSystemData().isActive; }

  get isNameVisible(): boolean { return this.getSystemData().isNameVisible; }

  get size(): 1|2|3|4|5|6 { return this.getSystemData().size; }

  get clocksData(): Record<IDString, BladesClockData> { return this.getSystemData().clocksData; }

  get rollOppName() { return this.name; }

  get rollOppType(): "clock_key" { return "clock_key"; }

  get rollFactors(): Partial<Record<Factor, BladesRoll.FactorData>> {

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

  getFactorTotal(factor: Factor): number {
    switch (factor) {
      case Factor.tier: return this.getSystemData().tier.value;
      case Factor.quality: return this.getFactorTotal(Factor.tier);
      // no default
    }
    return 0;
  }

  get rollOppImg() { return ""; }

  async initialize(): Promise<void> {
    return this.updateTargetData(this._initData);
  }

  _initData: BladesClockKeyData;

  constructor(data: BladesClockKeyConfig) {
    if (!BladesClockKey.validateConfig<BladesClockKeyConfig>(data)) {
      eLog.error("[BladesClockKey Constructor] Invalid Config", data);
      throw new Error("See log.");
    }
    eLog.checkLog3("[BladesClockKey Constructor] Invalid Config", data);
    data.id ??= randomID();
    super(data);

    this._initData = BladesClockKey.applyConfigDefaults(data);
  }

  get currentClockIndex(): number|undefined {
    return this.clocks.find((clock) => clock.value < clock.max)?.index;
  }

  get isComplete(): boolean {
    return this.clocks.every((clock) => clock.isComplete);
  }

  _clocks: Record<IDString, BladesClock> = {};

  get clocks(): BladesClock[] {
    return Object.keys(this.clocksData)
      .map((index: IDString) => this.getClock(index) as BladesClock)
      .sort((a, b) => a.index - b.index);
  }

  get nextOpenSlot(): 0|1|2|3|4|5|undefined {
    if (this.clocks.length >= 6) { return undefined; }
    return this.clocks.length as 0|1|2|3|4|5;
  }

  getClock(clockID: IDString): BladesClock|undefined
  getClock(index?: number): BladesClock|undefined
  getClock(index: IDString|number = 0): BladesClock|undefined {
    if (typeof index === "string" && index in this.clocksData) {
      return (this._clocks[index] ??= new BladesClock(this.clocksData[index]));
    }
    const clockData = Object.values(this.clocksData).find((cData) => cData.index === U.pInt(index));
    if (!clockData) { return undefined; }

    // Convert BladesClockData to BladesClockConfig
    const clockConfig: BladesClockConfig = {
      ...clockData,
      target: typeof clockData.target === "string" ? clockData.target : clockData.target.id,
      targetKey: clockData.targetKey,
      targetFlagKey: clockData.targetFlagKey
    };

    return (this._clocks[clockData.id] ??= new BladesClock(clockConfig));
  }

  getCurrentClock(): BladesClock|undefined {
    return this.isComplete ? undefined : this.getClock(this.currentClockIndex);
  }

  async getHTML(): Promise<string> {
    return await renderTemplate(
      "systems/eunos-blades/templates/overlays/clock-key.hbs",
      this
    );
  }

  async toggleActive(): Promise<void> {
    return await this.updateTarget("isActive", !this.isActive);
  }

  async addClock(): Promise<BladesClock> {
    if (this.clocks.length === this.size) {
      if (this.size >= 6) { throw new Error("[BladesClockKey.addClock()] Cannot add more than six clocks to a key!"); }
      await this.setKeySize(this.size + 1 as 1|2|3|4|5|6);
    }
    const id = randomID();
    return await BladesClock.Create({
      id,
      target: this.target,
      targetKey: this.targetKey ? `${this.targetKey}.${this.id}.clocksData` : undefined,
      targetFlagKey: this._targetFlagKey ? `${this.targetFlagKey}.${this.id}.clocksData` : undefined,
      index: this.nextOpenSlot
    });
  }

  async deleteClock(clockID: IDString): Promise<void>
  async deleteClock(index: number): Promise<void>
  async deleteClock(index: IDString | number): Promise<void> {
    if (typeof index === "string") {
      return await this.getClock(index)?.delete();
    } else if (typeof index === "number") {
      return await this.getClock(index)?.delete();
    }
  }

  async setKeySize(clockCount: 1|2|3|4|5|6): Promise<void> {
    const updateData: {size: 1|2|3|4|5|6, clocksData: Record<IDString, BladesClockData|null>} = {
      size: clockCount,
      clocksData: {}
    };
    while (clockCount > this.size) {
      const newClock = new BladesClock({
        id: randomID(),
        target: this.target,
        targetKey: this.targetKey ? `${this.targetKey}.${this.id}.clocksData` : undefined,
        targetFlagKey: this.targetFlagKey ? `${this.targetFlagKey}.${this.id}.clocksData` : undefined
      });
      updateData.clocksData[newClock.id] = newClock;
      clockCount--;
    }
    const clockIDs = Object.keys(this.clocksData);
    while (clockIDs.length > clockCount) {
      const thisID = clockIDs.pop();
      updateData.clocksData[`-=${thisID}`] = null;
    }
    this._clocks = {};
  }
}

export type BladesClockConfig = Partial<BladesClockData> & BladesTargetLinkConfig;

class BladesClock extends BladesTargetLink implements BladesClockData,
  BladesRoll.OppositionDocData {

  static get DefaultSchema(): Omit<BladesClockData, "target"> {
    return {
      id: randomID(),
      name: "",
      index: 0,

      value: 0,
      max: 8,
      color: ClockColor.white,

      isVisible: false,
      isActive: true,
      isNameVisible: false,
      isHighlighted: false
    };
  }

  static applyConfigDefaults(clockConfig: BladesClockConfig): BladesClockSystemData {
    if (clockConfig.target instanceof Actor || clockConfig.target instanceof Item) {
      clockConfig.target = clockConfig.target.id;
    }

    const clockData: BladesClockSystemData = {
      ...this.DefaultSchema,
      ...(clockConfig as BladesClockConfig & {target: string})
    };

    return clockData;
  }

  static async Create(clockConfig: BladesClockConfig): Promise<BladesClock> {
    if (!this.validateConfig<BladesClockConfig>(clockConfig)) {
      eLog.error("[BladesClock.Create()] Invalid Config", clockConfig);
      throw new Error("See log.");
    }
    eLog.checkLog3("[BladesClock.Create()] Config", clockConfig);

    // Create the clock instance, supplying the config.
    // BladesClock constructor will apply defaults for missing values.
    const clock = new BladesClock(clockConfig);

    // Wait for clockKey data to be written to target
    await clock.initialize();

    return clock;
  }

  static ApplyClockListeners(html: JQuery<HTMLElement>) {
    eLog.checkLog3("ApplyListeners", "ApplyClockListeners", {html, find: html.find(".clock")});
    if (game.user.isGM) {
      html.find(".clock")
        .each((_, clockElem) => {
          const clock = new BladesClock(clockElem);
          if (clock) {
            $(clockElem).on({
              click: () => clock.isActive = !clock.isActive,
              contextmenu: () => clock.isVisible = !clock.isVisible,
              wheel: (event) => {
                if (!(event.originalEvent instanceof WheelEvent)) { return; }
                event.preventDefault();
                if (event.originalEvent.deltaY < 0) {
                  clock.fillSegments(clockElem, 1);
                } else {
                  clock.clearSegments(clockElem, 1);
                }
              }
            });
          }
        });
    } else {
      html.find(".clock")
        .each((_, clockElem) => {
          const clock = new BladesClock(clockElem);
          if (clock && clock.canEdit) {
            $(clockElem).on({
              click: () => clock.fillSegments(clockElem, 1),
              contextmenu: () => clock.clearSegments(clockElem, 1)
            });
          }
        });
    }
  }

  get canEdit(): boolean {
    // return true if user has edit permissions on parent document, and clock is
    // visible and active.
    console.log("NOTE: All Clocks currently Editable; see line 71 of BladesClock.ts");
    return this.isVisible && this.isActive;
  }


  get value(): number { return this.getSystemData().value ?? 0; }
  set value(val: number) { this.updateTarget("value", val); }

  get max(): number { return this.getSystemData().max ?? 0; }
  set max(val: number) { this.updateTarget("max", val); }

  get color(): ClockColor { return this.getSystemData().color as ClockColor ?? ClockColor.white; }
  set color(val: ClockColor) { this.updateTarget("color", val); }

  get isActive(): boolean { return this.getSystemData().isActive ?? false; }
  set isActive(val: boolean) { this.updateTarget("isActive", val); }

  get isNameVisible(): boolean { return this.getSystemData().isNameVisible ?? false; }
  set isNameVisible(val: boolean) { this.updateTarget("isNameVisible", val); }

  get isVisible(): boolean { return this.getSystemData().isVisible ?? false; }
  set isVisible(val: boolean) { this.updateTarget("isVisible", val); }

  get isHighlighted(): boolean { return this.getSystemData().isHighlighted ?? false; }
  set isHighlighted(val: boolean) { this.updateTarget("isHighlighted", val); }

  get index(): number { return this.getSystemData().index ?? 0; }
  set index(val: number) { this.updateTarget("index", val); }

  get display(): Record<string, string> { return this.getSystemData().display ?? {}; }
  set display(val: Record<string, string>) { this.updateTarget("display", val); }

  get tooltip(): string|undefined { return this.getSystemData().tooltip; }
  set tooltip(val: string|undefined) { this.updateTarget("tooltip", val); }

  get isEmpty() { return this.value === 0; }

  get isComplete(): boolean { return this.value >= this.max; }

  get rollOppClock() { return this; }

  get rollOppName() { return this.name; }

  get rollOppType(): "clock" { return "clock"; }

  get rollFactors(): Partial<Record<Factor, BladesRoll.FactorData>> {

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

  getFactorTotal(factor: Factor): number {
    switch (factor) {
      case Factor.tier: return this.getSystemData().tier.value;
      case Factor.quality: return this.getFactorTotal(Factor.tier);
      // no default
    }
    return 0;
  }

  get rollOppImg() { return ""; }

  async initialize(): Promise<void> {
    return this.updateTargetData(this._initData);
  }

  _initData: BladesClockData;

  constructor(data: HTMLElement|JQuery<HTMLElement>)
  constructor(data: BladesClockConfig)
  constructor(data: HTMLElement|JQuery<HTMLElement>|BladesClockConfig) {

    function isHTML(testData: unknown): testData is HTMLElement|JQuery<HTMLElement> {
      return testData instanceof HTMLElement || testData instanceof jQuery;
    }

    let configData: BladesClockConfig;
    let targetLinkData: BladesTargetLinkConfig;

    if (isHTML(data)) {
      data = $(data);
      targetLinkData = {
        id: data.data("id"),
        target: data.data("targetId"),
        targetFlagKey: data.data("targetFlagKey") || undefined,
        targetKey: data.data("targetKey")
      };
      configData = targetLinkData;
    } else {
      const dataAsConfig = data as BladesClockConfig;
      targetLinkData = {
        id: data.id ?? randomID(),
        target: typeof dataAsConfig.target === "string" ? dataAsConfig.target : dataAsConfig.target.id,
        targetFlagKey: dataAsConfig.targetFlagKey || undefined,
        targetKey: dataAsConfig.targetKey || undefined
      };
      configData = {
        ...data as BladesClockConfig,
        ...targetLinkData
      };
    }

    super(targetLinkData);

    this._initData = BladesClock.applyConfigDefaults(configData);
  }


  async getHTML(): Promise<string> {
    return await renderTemplate(
      "systems/eunos-blades/templates/components/clock.hbs",
      this
    );
  }

  getActiveSide(segmentDelta: number): "left"|"right" {
    // Returns which hemisphere of the clock will show the final change if segmentDelta segments are added/removed.
    const finalClockValue = Math.min(this.max, Math.max(0, this.value + segmentDelta));
    const halfClockValue = this.max / 2;
    if (finalClockValue > halfClockValue) { return "left"; }
    return "right";
  }

  private getInteriorStyleString(segmentCount?: number): string {
    segmentCount ??= this.value;
    return `clip-path: url('#${segmentCount}-of-${this.max}');`;
  }

  private getNextInteriorStyleString(segmentCount?: number): string|false {
    segmentCount ??= this.value;
    if (segmentCount + 1 > this.max) { return false; }
    return this.getInteriorStyleString(segmentCount + 1);
  }

  private getLastInteriorStyleString(segmentCount?: number): string|false {
    segmentCount ??= this.value;
    if (segmentCount - 1 < 0) { return false; }
    return this.getInteriorStyleString(segmentCount - 1);
  }

  private _blurInSegment(clockElem: HTMLElement, startSegment?: number): gsap.core.Timeline|false {
    startSegment ??= this.value;

    // Get next clip-path string
    const nextInteriorStyleString = this.getNextInteriorStyleString(startSegment);
    if (!nextInteriorStyleString) { return false; }

    const interiorElem = $(clockElem).find(".clock-interior")[0];

    // Return a timeline that changes style at start, then pulses
    return U.gsap.timeline({
      onStart() {
        $(interiorElem).attr("style", nextInteriorStyleString);
      }
    }).from(interiorElem, {
      scale: 1.25,
      opacity: 0,
      filter: "blur(4px)",
      duration: 0.5,
      ease: "power1.inOut"
    }).to(interiorElem, {
      filter: "brightness(2)",
      scale: 1.1,
      repeat: 1,
      yoyo: true,
      duration: 0.25,
      ease: "none"
    });
  }

  private _blurOutSegment(clockElem: HTMLElement, startSegment?: number): gsap.core.Timeline|false {
    startSegment ??= this.value;

    // Get previous clip-path string
    const prevInteriorStyleString = this.getLastInteriorStyleString(startSegment);
    if (!prevInteriorStyleString) { return false; }

    const interiorElem = $(clockElem).find(".clock-interior")[0];

    // Return a timeline that pulses, then changes style
    return U.gsap.timeline({
      onComplete() {
        $(interiorElem).attr("style", prevInteriorStyleString);
      }
    }).to(interiorElem, {
      filter: "brightness(2)",
      scale: 1.1,
      repeat: 1,
      yoyo: true,
      duration: 0.25,
      ease: "none"
    });
  }

  async fillSegments(clockElem: HTMLElement, count: number): Promise<boolean> {
    // Returns TRUE if clock is complete after segments added.
    const isClockFull = this.value + count >= this.max;
    count = Math.min(this.value + count, this.max) - this.value;
    if (count === 0) { return isClockFull; }

    const firstSegment = this.value + 1;
    const lastSegment = this.value + count;

    // Construct timeline of sequential segment additions
    const tl = U.gsap.timeline({paused: true});

    for (let i = firstSegment; i <= lastSegment; i++) {
      const blurTL = this._blurInSegment(clockElem, i);
      if (!blurTL) { break; }
      tl.add(blurTL);
    }

    return new Promise((resolve) => {
      tl.eventCallback("onComplete", () => {
        this.updateTarget("value", lastSegment)
          .then(() => resolve(isClockFull));
      });
      tl.play();
    });
  }

  async clearSegments(clockElem: HTMLElement, count: number): Promise<boolean> {
    // Returns TRUE if clock is EMPTY after segments added.
    const isClockEmpty = this.value >= count;
    count = Math.min(this.value, count);
    if (count === 0) { return isClockEmpty; }

    const firstSegment = this.value - 1;
    const lastSegment = this.value - count;

    // Construct timeline of sequential segment additions
    const tl = U.gsap.timeline({paused: true});

    for (let i = firstSegment; i >= lastSegment; i--) {
      const blurTL = this._blurOutSegment(clockElem, i);
      if (!blurTL) { break; }
      tl.add(blurTL);
    }

    return new Promise((resolve) => {
      tl.eventCallback("onComplete", () => {
        this.updateTarget("value", lastSegment)
          .then(() => resolve(isClockEmpty));
      });
      tl.play();
    });
  }

  // #region OVERRIDES: _onUpdate
  // override async _onUpdate(...args: Parameters<typeof BladesItem.prototype.callOnUpdate>) {
  //   await super.callOnUpdate(...args);
  //   BladesActor.GetTypeWithTags(BladesActorType.pc).forEach((actor) => actor.render());
  // }
  // #endregion
}

export default BladesClock;

export {BladesClockKey};
