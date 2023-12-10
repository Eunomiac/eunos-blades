import C, {ClockColor, ClockKeyDisplayMode, Factor} from "../../core/constants";
import U from "../../core/utilities";
import {BladesItem} from "../BladesItemProxy";
import BladesRoll from "../../BladesRoll";

type BladesTargetLinkConfig = {
  target: string | BladesDoc,
  id?: IDString,
  targetKey?: string,
  targetFlagKey?: string
}

class BladesTargetLink {

  protected static validateConfig<T extends BladesTargetLinkConfig = BladesTargetLinkConfig>(ref: unknown):
    ref is T & {id: IDString} {
    // Check if 'ref' is a simple object literal
    if (!U.isSimpleObj(ref)) {return false;}
    // Confirm a target key or flag key has been provided.
    if (!ref.targetKey && !ref.targetFlagKey) {return false;}
    // Confirm a target has been provided, and that it can be resolved to a Document entity.
    if (!ref.target) {return false;}
    if (U.isDocID(ref.target)) {
      // Convert string id of target to target Document
      ref.target = game.actors.get(ref.target) ?? game.items.get(ref.target);
    }
    if (!(ref.target instanceof Actor || ref.target instanceof Item)) {return false;}
    // Create a random ID if one not provided.
    if (!ref.id) {ref.id = randomID();}
    return true;
  }

  _id: string;

  _targetID: string;

  get targetID() {return this._targetID;}

  _target: BladesDoc;

  get target(): BladesDoc {return this._target;}

  _targetKey = "system";

  get targetKey(): string {return this._targetKey;}

  _targetFlagKey?: string;

  get targetFlagKey(): string | undefined {return this._targetFlagKey;}

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
    return getProperty(this.target, `${this.targetKey}.${this._id}`) ?? {};
  }

  get id() {return this._id;}

  get name(): string {return this.getSystemData().name;}

  getTargetProp(prop: string): unknown {
    return this.getSystemData()[prop];
  }

  async updateTarget(prop: string, val: unknown) {
    if (this.targetFlagKey) {
      (this.target as BladesItem).setFlag("eunos-blades", `${this.targetFlagKey}.${this._id}.${prop}`, val);
    } else {
      this.target.update({[`${this.targetKey}.${this._id}.${prop}`]: val});
    }
  }

  async updateTargetData(val: unknown) {
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

  // #region STATIC METHODS ~
  static get DefaultSchema(): Omit<BladesClockKeySystemData, "target" | "id"> {
    return {
      name: "",

      isVisible: true,
      isActive: false,
      isNameVisible: false,
      isShowingControls: game.user.isGM,

      clocksData: {}
    };
  }

  static applyConfigDefaults(clockKeyConfig: BladesClockKeyConfig): BladesClockKeySystemData {

    const keyData: BladesClockKeySystemData = {
      ...this.DefaultSchema,
      ...clockKeyConfig
    } as BladesClockKeySystemData;

    if (keyData.target instanceof Actor || keyData.target instanceof Item) {
      keyData.target = keyData.target.id;
    }

    return keyData;
  }

  static async Create(
    clockKeyConfig: BladesClockKeyConfig,
    clockConfig: Partial<BladesClockData> = {}
  ): Promise<BladesClockKey> {
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

    // If key created without clock data, initialize with a single clock
    if (clockKey.size === 0) {
      await clockKey.addClock(clockConfig);
    }

    return clockKey;
  }
  // #endregion

  // #region GETTERS & SETTERS ~
  get clocksData(): Record<IDString, BladesClockData> {return this.getSystemData().clocksData ?? {};}

  get clocks(): Collection<BladesClock> {
    return new Collection(
      Object.entries(this.clocksData ?? {})
        .sort((a, b) => a[1].index - b[1].index)
        .map(([id, data]) => [
          id,
          game.eunoblades.Clocks.get(id) ?? new BladesClock(data)
        ])
    );
  }

  get isGM(): boolean {return game.user.isGM;}

  get isVisible(): boolean {return U.pBool(this.getSystemData().isVisible);}

  get displayMode(): ClockKeyDisplayMode|number {
    if (this.isGM && this.isShowingControls) {
      return ClockKeyDisplayMode.full;
    }
    return this.getSystemData().displayMode ?? ClockKeyDisplayMode.full;
  }

  get setDisplayMode(): ClockKeyDisplayMode|number {
    return this.getSystemData().displayMode ?? ClockKeyDisplayMode.full;
  }

  get sceneID(): IDString | undefined {return this.getSystemData().sceneID;}

  get isActive(): boolean {return U.pBool(this.getSystemData().isActive);}

  get isNameVisible(): boolean {return U.pBool(this.getSystemData().isNameVisible);}

  get size(): 0 | 1 | 2 | 3 | 4 | 5 | 6 {return this.clocks.size as 0 | 1 | 2 | 3 | 4 | 5 | 6;}

  get rollOppName() {return this.name;}

  get rollOppType(): "clock_key" {return "clock_key";}

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

  get rollOppImg() {return "";}

  get isComplete(): boolean {
    return Array.from(this.clocks).every((clock) => clock.isComplete);
  }

  get currentClockIndex(): 0 | 1 | 2 | 3 | 4 | 5 {
    return U.pInt(this.currentClock?.index) as 0 | 1 | 2 | 3 | 4 | 5;
  }

  get currentClock(): BladesClock | undefined {
    return this.clocks.find((clock) => !clock.isComplete);
  }

  get displaySelectOptions(): Array<BladesSelectOption<string, ClockKeyDisplayMode|number>> {
    const options: Array<BladesSelectOption<string, ClockKeyDisplayMode|number>> = [
      {value: ClockKeyDisplayMode.full, display: "Full Key"},
      {value: ClockKeyDisplayMode.clocks, display: "Clocks"},
      {value: ClockKeyDisplayMode.currentClock, display: "Current Clock"},
      {value: ClockKeyDisplayMode.presentCurrentClock, display: "Present Current Clock"}
    ];

    for (let i = 0; i < this.size; i++) {
      options.push(...[
        {value: i, display: `Clock #${i}`},
        {value: `present${i}`, display: `Present Clock #${i}`}
      ] as Array<BladesSelectOption<string, ClockKeyDisplayMode|number>>);
    }

    return options;
  }
  // #endregion

  // #region ~~~ CONSTRUCTOR & INITIALIZATION ~~~
  _initData: BladesClockKeyData;

  constructor(data: BladesClockKeyConfig) {
    if (!BladesClockKey.validateConfig<BladesClockKeyConfig>(data)) {
      eLog.error("[BladesClockKey Constructor] Invalid Config", data);
      throw new Error("See log.");
    }
    eLog.checkLog3("[BladesClockKey Constructor] Valid Config", data);

    super(data);

    data.id = this.id;

    this._initData = BladesClockKey.applyConfigDefaults(data);

    game.eunoblades.ClockKeys.set(this.id, this);
  }

  async initialize(): Promise<void> {
    await this.updateTargetData(this._initData);
  }
  // #endregion

  // #region HTML INTERACTION ~
  async getHTML(): Promise<string> {
    return await renderTemplate(
      "systems/eunos-blades/templates/overlays/clock-key.hbs",
      this
    );
  }

  get elem(): HTMLElement | undefined {
    return $(`#${this.id}`)[0];
  }

  get isShowingControls(): boolean {
    return U.pBool(this.getSystemData().isShowingControls);
  }
  set isShowingControls(val: boolean) {
    this.updateTarget("isShowingControls", U.pBool(val));
  }

  async toggleActive(): Promise<void> {
    return await this.updateTarget("isActive", !this.isActive);
  }

  get elements() {
    const elemData: Record<string, HTMLElement> = {};
    if (!this.elem) {return elemData;}

    elemData.key = this.elem;
    elemData.keyContainer = $(this.elem).closest(".clock-key-container")[0];

    for (const clock of Array.from(this.clocks)) {
      if (!clock.elem) { return elemData; }
      const {index, elem} = clock;
      elemData[`clock ${index}`] = elem;
      elemData[`clock ${index} Container`] = $(elem).closest(".clock-container")[0];
    }

    return elemData;
  }

  // Initializes clock key with proper position and scale before displaying via autoAlpha
  async initClockKeyElem(displayMode?: ClockKeyDisplayMode | number): Promise<void> {
    displayMode = this.displayMode;
    if (!this.elem) {
      return new Promise((resolve) => {
        setTimeout(async () => resolve(await this.initClockKeyElem(displayMode)), 1000);
      });
    }
    const {elem} = this;

    const {keyTweenVars, keyContTweenVars} = this.getDisplayMode(displayMode);
    const keyImgContainer = $(this.elem).find(".key-image-container")[0];

    return new Promise((resolve) => {
      U.gsap.timeline()
        .set(keyImgContainer, keyContTweenVars)
        .set(elem, keyTweenVars)
        .to(
          elem,
          {
            autoAlpha: 1,
            duration: 0.5
          }
        ).then(() => {resolve(); });
    });
  }

  // Given a display mode ("full", "clocks", or a clock index number), will return a GSAP effects
  //  config object to be plugged into any of the 'clockKey' effects.
  // Can optionally provide config values to be included in a second parameter.
  getDisplayMode(
    displayMode: ClockKeyDisplayMode | number,
    configOptions: Partial<gsap.TweenVars> = {}
  ): gsap.TweenVars {
    if (!this.elem) {return configOptions;}

    configOptions.duration ??= 1;
    configOptions.ease ??= "power2";
    configOptions.autoAlpha ??= 1;

    const keyTweenVars: gsap.TweenVars = {...configOptions};
    const keyContTweenVars: gsap.TweenVars = {...configOptions};

    // Get key data
    const keyPosData = U.objClone(C.ClockKeyPositions[this.size]);

    // Are we presenting? If so, flag it true and parse displayMode to standard clock reference
    let isPresenting = false;
    if (/^present/.exec(`${displayMode}`)) {
      isPresenting = true;
      const suffix = `${displayMode}`.substring(7);
      if (!isNaN(Number(suffix))) {
        displayMode = U.pInt(suffix);
      } else {
        displayMode = ClockKeyDisplayMode.currentClock;
      }
    }
    if (!isNaN(Number(displayMode))) {
      displayMode = U.pInt(displayMode);
    }

    // Get position and area dimensions of clock key area focused on by displayMode
    let focusArea: {width: number, height: number};
    let focusPos: {x: number, y: number, z?: number};
    const activeClockSide = this.currentClock?.getActiveSide(0);
    switch (displayMode) {
      case ClockKeyDisplayMode.full: {
        focusPos = keyPosData.keyCenter;
        focusArea = keyPosData.keyDimensions;
        break;
      }
      case ClockKeyDisplayMode.clocks: {
        focusPos = keyPosData.clocksCenter;
        focusArea = keyPosData.clocksCenterDimensions;
        break;
      }
      case ClockKeyDisplayMode.currentClock: {
        displayMode = this.currentClockIndex;
      }
      // falls through
      default: {
        if (typeof displayMode === "number") {
          if (displayMode in keyPosData.clocks) {
            focusPos = keyPosData.clocks[displayMode as KeyOf<typeof keyPosData["clocks"]>];
            focusArea = {width: 110, height: 110};
            if (isPresenting) {
              focusArea = {width: 55, height: 110};
              if (activeClockSide === "left") {
                focusPos.x -= 30;
                focusPos.z = -50;
              } else if (activeClockSide === "right") {
                focusPos.x += 35;
                // focusPos.z = 1350;
              }
            }
            break;
          }
        }
        throw new Error(`[BladesClockKey.getDisplayMode] Error display key '${this.id}' in mode '${displayMode}'.`);
      }
    }

    // Get height and width of clock key container
    const keyContainer = $(this.elem).closest(".clock-key-container")[0];
    const keyContainerDimensions = {
      width: U.gsap.getProperty(keyContainer, "width") as number,
      height: U.gsap.getProperty(keyContainer, "height") as number
    };

    // Determine scale factor necessary to fit focusArea inside keyContainer
    keyTweenVars.scale = Math.min(
      keyContainerDimensions.height / focusArea.height,
      keyContainerDimensions.width / focusArea.width
    );

    // Determine top and left values for key-image-container, accounting for x/yPercent -50
    keyContTweenVars.top = (0.5 * 100) - focusPos.y;
    keyContTweenVars.left = (0.5 * 100) - focusPos.x;

    // Set transfer origin of key-image-container to same position, for further animation
    keyContTweenVars.transformOrigin = `${focusPos.x}px ${focusPos.y}px`;

    // Set initial y-rotation to turn clock half towards camera if 'isPresenting'
    if (isPresenting) {
      if (activeClockSide === "left") {
        keyContTweenVars.rotateY = 30;
      } else if (activeClockSide === "right") {
        keyContTweenVars.rotateY = -30;
      }
    }

    return {keyTweenVars, keyContTweenVars};
  }

  async switchToMode(
    displayMode: ClockKeyDisplayMode | number,
    configOptions: Partial<gsap.TweenVars> = {},
    isLocalOnly = false
  ): Promise<void> {
    const self = this;
    const {elem} = self;
    if (!elem) {
      return new Promise((resolve) => {
        setTimeout(async () => resolve(await this.switchToMode(displayMode, configOptions, isLocalOnly)), 1000);
      });
    }

    const {keyTweenVars, keyContTweenVars} = self.getDisplayMode(displayMode, configOptions);

    const keyImgContainer = $(elem).find(".key-image-container")[0];

    return new Promise((resolve) => {
      U.gsap.timeline({
        onComplete() {
          if (!isLocalOnly) {
            self.updateTarget("displayMode", displayMode)
              .then(() => resolve());
          }
        }
      })
        .to(elem, keyTweenVars, 0)
        .to(keyImgContainer, keyContTweenVars, 0);
    });
  }
  // #endregion

  // #region Adding & Removing Clocks ~
  async addClock(clockData: Partial<BladesClockData> = {}): Promise<BladesClock> {
    return await BladesClock.Create({
      target: this.target,
      targetKey: this.targetKey ? `${this.targetKey}.${this.id}.clocksData` : undefined,
      targetFlagKey: this._targetFlagKey ? `${this.targetFlagKey}.${this.id}.clocksData` : undefined,
      index: this.clocks.size,
      ...clockData
    });
  }

  async deleteClock(clockID?: IDString) {
    if (this.size <= 1) {throw new Error("[BladesClockKey.deleteClock()] Cannot reduce number of clocks below 1!");}
    clockID ??= Array.from(this.clocks).pop()?.id;
    await game.eunoblades.Clocks.get(clockID ?? "")?.delete();
  }
  // #endregion


  /*
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
      .fromTo(keyElem, {scale: 0.95}, {scale: 2, duration: 20, ease: "sine.inOut"}, 0)
      // Initialize gentle rotation:
      .fromTo(keyElem, {rotateX: 0, rotateY: 0, rotateZ: 0}, {rotateX: 5, rotateY: 5, rotateZ: 5, duration: 5, ease: "sine.inOut"}, 0)
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
  */

}

export type BladesClockConfig = Partial<BladesClockData> & BladesTargetLinkConfig;

class BladesClock extends BladesTargetLink implements BladesClockData,
  BladesRoll.OppositionDocData {

  // #region STATIC METHODS ~
  static get DefaultSchema(): Omit<BladesClockData, "target" | "id"> {
    return {
      name: "",
      index: 0,

      value: 0,
      max: 8,
      color: ClockColor.white,

      isVisible: true,
      isNameVisible: true,
      isHighlighted: false,
      isActive: true,
      isShowingControls: game.user.isGM
    };
  }

  static applyConfigDefaults(clockConfig: BladesClockConfig): BladesClockSystemData {
    if (clockConfig.target instanceof Actor || clockConfig.target instanceof Item) {
      clockConfig.target = clockConfig.target.id;
    }

    const clockData: BladesClockSystemData = {
      ...this.DefaultSchema,
      ...(clockConfig as BladesClockConfig & {target: string})
    } as BladesClockSystemData;

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

    // Wait for clock data to be written to target
    await clock.initialize();

    return clock;
  }

  // #endregion

  // #region GETTERS & SETTERS ~
  get canEdit(): boolean {
    // return true if user has edit permissions on parent document, and clock is
    // visible and active.
    console.log("NOTE: All Clocks currently Editable; see line 71 of BladesClock.ts");
    return this.isVisible && this.isActive;
  }

  get isGM(): boolean {return game.user.isGM;}

  get value(): number {return U.pInt(this.getSystemData().value);}
  set value(val: number) {this.updateTarget("value", U.pInt(val));}

  get max(): number {return U.pInt(this.getSystemData().max);}
  set max(val: number) {this.updateTarget("max", U.pInt(val));}

  get color(): ClockColor {return this.getSystemData().color as ClockColor ?? ClockColor.white;}
  set color(val: ClockColor) {this.updateTarget("color", val);}

  get isActive(): boolean {return U.pBool(this.getSystemData().isActive);}
  set isActive(val: boolean) {this.updateTarget("isActive", U.pBool(val));}

  get isShowingControls(): boolean {return U.pBool(this.getSystemData().isShowingControls);}
  set isShowingControls(val: boolean) {this.updateTarget("isShowingControls", U.pBool(val));}


  get isNameVisible(): boolean {return U.pBool(this.getSystemData().isNameVisible);}
  set isNameVisible(val: boolean) {this.updateTarget("isNameVisible", U.pBool(val));}

  get isVisible(): boolean {return U.pBool(this.getSystemData().isVisible);}
  set isVisible(val: boolean) {this.updateTarget("isVisible", U.pBool(val));}

  get isHighlighted(): boolean {return U.pBool(this.getSystemData().isHighlighted);}
  set isHighlighted(val: boolean) {this.updateTarget("isHighlighted", U.pBool(val));}

  get index(): number {return U.pInt(this.getSystemData().index);}
  set index(val: number) {this.updateTarget("index", U.pInt(val));}

  get display(): Record<string, string> {return this.getSystemData().display ?? {};}
  set display(val: Record<string, string>) {this.updateTarget("display", val);}

  get tooltip(): string | undefined {return this.getSystemData().tooltip;}
  set tooltip(val: string | undefined) {this.updateTarget("tooltip", val);}

  get sceneID(): IDString | undefined {return this.getSystemData().sceneID;}
  set sceneID(val: IDString | undefined) {this.updateTarget("sceneID", val);}

  get isEmpty() {return this.value === 0;}

  get isComplete(): boolean {return this.value >= this.max;}

  get rollOppClock() {return this;}

  get rollOppName() {return this.name;}

  get rollOppType(): "clock" {return "clock";}

  get colorSelectOptions(): Array<BladesSelectOption<string, ClockColor>> {
    return [
      {value: ClockColor.white, display: "🔘"},
      {value: ClockColor.yellow, display: "📀"},
      {value: ClockColor.cyan, display: "🔵"},
      {value: ClockColor.red, display: "🔴"}
    ];
  }

  get maxSelectOptions(): Array<BladesSelectOption<number, number>> {
    return [
      {value: 2, display: 2},
      {value: 3, display: 3},
      {value: 4, display: 4},
      {value: 5, display: 5},
      {value: 6, display: 6},
      {value: 8, display: 8},
      {value: 10, display: 10},
      {value: 12, display: 12}
    ];
  }

  get valueSelectOptions(): Array<BladesSelectOption<number, number>> {
    const returnVals: Array<BladesSelectOption<number, number>> = [];
    for (let i = 0; i <= this.max; i++) {
      returnVals.push({value: i, display: i});
    }
    return returnVals;
  }

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

  get rollOppImg() {return "";}
  // #endregion


  // #region ~~ CONSTRUCTOR ~~

  _initData: BladesClockData;

  constructor(data: HTMLElement | JQuery<HTMLElement>)
  constructor(data: BladesClockConfig)
  constructor(data: HTMLElement | JQuery<HTMLElement> | BladesClockConfig) {

    function isHTML(testData: unknown): testData is HTMLElement | JQuery<HTMLElement> {
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
        id: data.id,
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

    configData.id = this.id;

    this._initData = BladesClock.applyConfigDefaults(configData);

    game.eunoblades.Clocks.set(this.id, this);
  }

  async initialize(): Promise<void> {
    return this.updateTargetData(this._initData);
  }
  // #endregion

  // #region HTML INTERACTION ~
  get elem(): HTMLElement | undefined {
    return $(`[data-id="${this.id}"`)[0];
  }

  async getHTML(): Promise<string> {
    return await renderTemplate(
      "systems/eunos-blades/templates/components/clock.hbs",
      this
    );
  }

  // Returns which hemisphere of the clock will show the final change if segmentDelta segments are added/removed.
  getActiveSide(segmentDelta: number): "left" | "right" {
    const finalClockValue = Math.min(this.max, Math.max(0, this.value + segmentDelta));
    const halfClockValue = this.max / 2;
    if (finalClockValue > halfClockValue) {return "left";}

    return "right";
  }
  // #endregion


  // #region Adding/Removing Clock Segments
  // Returns number of segments beyond max (or 0, if max not met)
  async fillSegments(count: number): Promise<number> {
    // Amount added beyond max:
    const clockOverflow = Math.max(0, this.value + count - this.max);
    // Clamp count to max:
    count = Math.min(this.value + count, this.max) - this.value;

    if (count === 0) {return clockOverflow;}

    await this.updateTarget("value", this.value + count);

    return clockOverflow;
  }
  // Returns (positive) number of segments removed
  // in excess of the number of segments in the clock
  async clearSegments(count: number): Promise<number> {
    // Amount removed beyond 0:
    const clockOverflow = Math.max(0, count - this.value);

    // Clamp count to min:
    count = Math.min(this.value, count);

    if (count === 0) {return clockOverflow;}

    await this.updateTarget("value", this.value - count);

    return clockOverflow;
  }
  // #endregion

}

export const ApplyClockListeners = async (html: JQuery<HTMLElement>) => {
  eLog.checkLog3("ApplyListeners", "ApplyClockListeners", {html, find: html.find(".clock")});
  // Step One: Find any clock keys and initialize them
  await Promise.all(Array.from(html.find(".clock-key"))
    .map(async (keyElem) => {
      const key = game.eunoblades.ClockKeys.get(keyElem.id);
      if (key) {
        return await key.initClockKeyElem();
      }
      return undefined;
    }));

  // Utility functions
  async function toggleTarget(el: HTMLElement, source: BladesTargetLink) {
    if (!source) { return; }
    const prop = $(el).data("prop");
    eLog.checkLog3("clockControls", "Toggle Event", {source, el, prop, curVal: source.getTargetProp(prop)});
    await source.updateTarget(prop, !source.getTargetProp(prop));
    if (prop === "isShowingControls") {
      if (source instanceof BladesClockKey) {
        const key = source as BladesClockKey;
        const {isShowingControls} = key;
        if (isShowingControls) {
          // If controls have been enabled, switch display mode of key to full for user (GM) only.
          key.switchToMode(ClockKeyDisplayMode.full, undefined, true);
        } else {
          // Otherwise, re-initialize key for GM.
          key.initClockKeyElem();
        }
      }

    }
  }
  async function setTarget(val: unknown, el: HTMLElement, source: BladesTargetLink) {
    if (!source) { return; }
    const prop = $(el).data("prop");
    eLog.checkLog3("clockControls", "Set Event", {val, source, prop, curVal: source.getTargetProp(prop)});
    source.updateTarget(prop, val);
  }

  // Add listeners to clock keys
  html.find(".clock-key-container").each((_, keyContainerElem) => {
    const keyID = $(keyContainerElem).find(".clock-key")[0].id;
    const key = game.eunoblades.ClockKeys.get(keyID);
    if (!key) { throw new Error("Too early for key: no KEY!"); }
    const {elem} = key ?? {};
    if (!elem) { throw new Error("Too early for key: no ELEMENT!"); }

    // Apply listeners to GM control elements
    if (game.user.isGM) {
      $(keyContainerElem).find("[data-action='key-toggle']")
        .on({
          click: (event) => {
            event.preventDefault();
            toggleTarget(event.currentTarget, key);
          }
        });
      $(keyContainerElem).find("input.clock-key-controls-name").on({
        change: (event) => {
          event.preventDefault();
          setTarget($(event.target).val(), event.target, key);
        }
      });
      $(keyContainerElem).find("select.key-select").on({
        change: (event) => {
          event.preventDefault();
          setTarget($(event.target).val(), event.target, key);
        }
      });
      $(keyContainerElem).find("[data-action='add-clock']").on({
        click: (event) => {
          event.preventDefault();
          key.addClock();
        }
      });
      $(keyContainerElem).find("[data-action='delete-key']").on({
        contextmenu: (event) => {
          event.preventDefault();
          key.delete();
        }
      });
    }
  });

  // Add listeners to clocks
  html.find(".clock-container").each((_, clockContainerElem) => {
    const clockID = $(clockContainerElem).find(".clock")[0].id;
    const clock = game.eunoblades.Clocks.get(clockID);
    if (!clock) { throw new Error("Too early for clock: no CLOCK!"); }
    const {elem} = clock ?? {};
    if (!elem) { throw new Error("Too early for clock: no ELEMENT!"); }

    // Apply listeners to GM control elements
    if (game.user.isGM) {
      if (clock.isShowingControls) {
        $(clockContainerElem).find("[data-action='clock-toggle']").on({
          click: (event) => {
            event.preventDefault();
            toggleTarget(event.currentTarget, clock);
          }
        });
        $(clockContainerElem).find("input.clock-controls-name").on({
          change: (event) => {
            event.preventDefault();
            setTarget($(event.target).val(), event.target, clock);
          }
        });
        $(clockContainerElem).find("select.clock-select").on({
          change: (event) => {
            event.preventDefault();
            setTarget($(event.target).val(), event.target, clock);
          }
        });
        $(clockContainerElem).find("[data-action='delete-clock']").on({
          contextmenu: (event) => {
            event.preventDefault();
            clock.delete();
          }
        });
      } else {
        $(clockContainerElem).find("[data-action='clock-toggle'][data-prop='isShowingControls']").on({
          click: (event) => {
            event.preventDefault();
            toggleTarget(event.currentTarget, clock);
          }
        });
        $(clockContainerElem).on({
          click: () => { clock.isActive = !clock.isActive; },
          contextmenu: () => { clock.isVisible = !clock.isVisible; },
          wheel: (event) => {
            if (!(event.originalEvent instanceof WheelEvent)) {return;}
            event.preventDefault();
            if (event.originalEvent.deltaY < 0) {
              clock.fillSegments(1);
            } else {
              clock.clearSegments(1);
            }
          }
        });
      }
    } else if (clock.canEdit && !clock.isShowingControls) {
    // Apply listeners for non-GM users
      $(clockContainerElem).on({
        click: () => clock.fillSegments(1),
        contextmenu: () => clock.clearSegments(1)
      });
    }
  });
};

export default BladesClock;

export {BladesClockKey};
