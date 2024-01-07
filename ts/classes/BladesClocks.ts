/* eslint-disable @typescript-eslint/no-unused-vars */
import C, {ClockKey_SVGDATA, ClockKeySVGData, BladesActorType, BladesItemType, ClockColor, ClockKeyDisplayMode, Factor} from "../core/constants";
import {Observer, Dragger} from "../core/gsap";
import BladesTargetLink from "./BladesTargetLink";
import U from "../core/utilities";
import {BladesActor} from "../documents/BladesActorProxy";
import {BladesItem, BladesClockKeeper} from "../documents/BladesItemProxy";
import BladesRoll from "./BladesRoll";

class BladesClockKey extends BladesTargetLink<BladesClockKey.Schema> implements BladesClockKey.Subclass {

  // #region STATIC METHODS ~
  static Initialize() {

    function registerClockKeys(doc: BladesDoc) {
      if ("clocksData" in doc.system) {
        (Object.values(doc.system.clocksData ?? {}) as BladesClockKey.Data[])
          .forEach((keyData) => {
            try {
              new BladesClockKey(keyData);
            } catch(err) {
              eLog.error("BladesClockKey", "[BladesClockKey.Initialize] Error initializing clock key.", err, keyData);
            }
          });
      }
    }

    game.items.contents
      .filter((item) =>
        BladesItem.IsType(item,
          BladesItemType.clock_keeper,
          BladesItemType.project,
          BladesItemType.cohort_gang,
          BladesItemType.cohort_expert,
          BladesItemType.ritual,
          BladesItemType.design,
          BladesItemType.location,
          BladesItemType.score
        )
      )
      .forEach(registerClockKeys);

    game.actors.contents
      .filter((actor) =>
        BladesActor.IsType(actor,
          BladesActorType.pc,
          BladesActorType.faction
        )
      )
      .forEach(registerClockKeys);

    socketlib.system.register("pull_SocketCall", BladesClockKey.pull_SocketResponse.bind(this));
    socketlib.system.register("drop_SocketCall", BladesClockKey.drop_SocketResponse.bind(this));
    socketlib.system.register("fadeInName_SocketCall", BladesClockKey.fadeInName_SocketResponse.bind(this));
    socketlib.system.register("fadeOutName_SocketCall", BladesClockKey.fadeOutName_SocketResponse.bind(this));

    socketlib.system.register("activate_SocketCall", BladesClock.activate_SocketResponse.bind(BladesClock));
    // socketlib.system.register("deactivate_SocketCall", BladesClock.deactivate_SocketResponse.bind(BladesClock));
    // socketlib.system.register("fadeInClockName_SocketCall", BladesClock.fadeInName_SocketResponse.bind(BladesClock));
    // socketlib.system.register("fadeOutClockName_SocketCall", BladesClock.fadeOutName_SocketResponse.bind(BladesClock));
    // socketlib.system.register("highlight_SocketCall", BladesClock.highlight_SocketResponse.bind(BladesClock));
    // socketlib.system.register("unhighlight_SocketCall", BladesClock.unhighlight_SocketResponse.bind(BladesClock));
    // socketlib.system.register("changeSegments_SocketCall", BladesClock.changeSegments_SocketResponse.bind(BladesClock));

    return loadTemplates([
      "systems/eunos-blades/templates/components/clock-key.hbs",
      "systems/eunos-blades/templates/components/clock.hbs"
    ]);
  }

  static override ApplySchemaDefaults<Schema = BladesClockKey.Schema>(
    schemaData: Partial<BladesClockKey.Schema>
  ) {
    // Ensure all properties of Schema are provided
    return {
      name: "",
      isVisible: false,
      isNameVisible: false,
      isSpotlit: false,
      clocksData: {},
      sceneIDs: [],
      displayMode: ClockKeyDisplayMode.full,
      oneKeyIndex: U.gsap.utils.random(0, 4, 1) as OneKeyImgIndex,
      ...schemaData
    } as Schema;
  }

  static override async Create<Schema extends BladesTargetLink.UnknownSchema = BladesClockKey.Schema>(
    config: BladesClockKey.Config & Partial<Schema>,
    clockConfigs: Array<Partial<BladesClock.Config>> = []
  ) {

    // Confirm at least one, but no more than six, clockConfigs provided:
    if (clockConfigs.length > 6) {
      // If too many clock keys, alert user and discard excess.
      eLog.error("BladesClockKey", "[BladesClockKey.Create] Too many clock configs! (Max 6.) Eliminating extras.", clockConfigs);
      clockConfigs = clockConfigs.slice(0, 6);
    } else if (clockConfigs.length === 0) {
      // If no clocks provided, add one default clock.
      clockConfigs.push({});
    }

    // Create and initialize the target link
    const clockKey = (await super.Create<BladesClockKey.Schema>(config)) as BladesClockKey;

    // Convert clock configs to full clock data objects.
    const clocksData: Record<IDString, BladesClock.Data> = Object.fromEntries(
      clockConfigs.map((clockConfig, i) => {
        clockConfig.index = i as ClockIndex;
        const cData = clockKey.parseClockConfig(clockConfig);
        return [cData.id, cData];
      })
    );

    // Update the clock key with the new clock data
    await clockKey.updateTarget("clocksData", clocksData);

    return clockKey as BladesClockKey & BladesTargetLink.Subclass<Schema>;
  }
  // #endregion

  // #region GETTERS & SETTERS ~

  // #region -- Shortcut Schema Getters ~
  override get data() {return this.linkData as BladesTargetLink.Data & BladesClockKey.Schema;}

  get name(): string {return this.data.name;}
  set name(val: string) {this.updateTarget("name", val);}

  get isVisible(): boolean { return this.data.isVisible; }
  set isVisible(val: boolean) {this.updateTarget("isVisible", U.pBool(val));}
  get isNameVisible(): boolean {return this.data.isNameVisible;}
  set isNameVisible(val: boolean) {this.updateTarget("isNameVisible", U.pBool(val));}
  get isSpotlit(): boolean { return this.data.isSpotlit; }
  set isSpotlit(val: boolean) { this.updateTarget("isSpotlit", val); }

  get clocksData(): Record<IDString, BladesClock.Data> {return this.data.clocksData;}

  get displayMode(): ClockKeyDisplayMode | number { return this.data.displayMode; }

  get oneKeyIndex(): OneKeyImgIndex {
    let {oneKeyIndex} = this.data;
    if (!oneKeyIndex) {
      oneKeyIndex = U.gsap.utils.random(0, 4, 1) as OneKeyImgIndex;
      this.updateTarget("oneKeyIndex", oneKeyIndex);
    }
    return oneKeyIndex;
  }

  get sceneIDs(): IDString[] {return this.data.sceneIDs ?? [];}
  get overlayPosition(): gsap.Point2D | undefined { return this.data.overlayPosition?.[game.scenes.current.id]; }
  set overlayPosition(val: gsap.Point2D | undefined) {
    if (val) {
      this.updateTarget(`overlayPosition.${game.scenes.current.id}`, val);
    } else {
      this.updateTarget(`overlayPosition.-=${game.scenes.current.id}`, null);
    }
  }
  // #endregion

  get clocks(): Collection<BladesClock> {
    return new Collection(
      Object.entries(this.clocksData)
        .sort((a, b) => a[1].index - b[1].index)
        .map(([id, data]) => {
          return [id, new BladesClock(data)];
        })
    );
  }

  getClockByID(clockID: IDString): BladesClock | undefined {
    return this.clocks.get(clockID);
  }
  getClockByIndex(index: ClockIndex): BladesClock | undefined {
    return this.clocks.find((clock) => clock.index === index);
  }

  get size() {return this.clocks.size as ClockKeySize;}

  get isComplete(): boolean {
    return Array.from(this.clocks).every((clock) => clock.isComplete);
  }

  get activeClocks(): BladesClock[] {
    return this.clocks.filter((clock) => clock.isActive && !clock.isComplete);
  }

  get displaySelectOptions(): Array<BladesSelectOption<string, ClockKeyDisplayMode | number>> {
    const options: Array<BladesSelectOption<string, ClockKeyDisplayMode | number>> = [
      {value: ClockKeyDisplayMode.full, display: "Full Key"},
      {value: ClockKeyDisplayMode.clocks, display: "Clocks"},
      {value: ClockKeyDisplayMode.activeClocks, display: "Active Clocks"}
    ];

    for (let i = 0; i < this.size; i++) {
      options.push(...[
        {value: i, display: `Clock #${i}`},
        {value: `present${i}`, display: `Present Clock #${i}`}
      ] as Array<BladesSelectOption<string, ClockKeyDisplayMode | number>>);
    }

    return options;
  }
  // #endregion

  // #region ~~~ CONSTRUCTOR & CLOCK CONFIG PARSER ~~~

  constructor(data: BladesClockKey.Data) {
    super(data);
    game.eunoblades.ClockKeys.set(this.id, this);
    Object.values(data.clocksData).forEach((clockData) => new BladesClock(clockData));
  }

  parseClockConfig(config: Partial<BladesClock.Config>, indexOverride?: ClockIndex): BladesClock.Data {
    if (this.size === 6) {throw new Error("Cannot add a clock to a clock key with 6 clocks.");}
    if (indexOverride !== undefined && indexOverride < 0) {throw new Error("Cannot add a clock with a negative index.");}

    // Remove target so it doesn't conflict with key's targetID
    delete config.target;

    // Derive clock's targetID and targetKey/targetFlagKey from key's values
    config.targetID = this.targetID;
    if (this.targetKey) {
      config.targetKey = `${this.targetKey}.${this.id}.clocksData` as TargetKey;
      delete config.targetFlagKey;
    } else if (this.targetFlagKey) {
      config.targetFlagKey = `${this.targetFlagKey}.${this.id}.clocksData` as TargetFlagKey;
      delete config.targetKey;
    }

    // Assign 'parentKeyID' and 'index'
    config.parentKeyID = this.id;
    config.index = indexOverride ?? this.size;

    // Parse config to full data object
    const cData = BladesClock.ParseConfig<BladesClock.Schema>(config as BladesClock.Config);

    return cData;
  }

  // #endregion

  // #region HTML INTERACTION ~

  isInScene(sceneID: IDString = game.scenes.current.id) {
    return this.sceneIDs.includes(sceneID);
  }
  get isInCurrentScene() { return this.isInScene(); }

  get isOnDisplay() {
    return this.isInCurrentScene && this.isVisible;
  }

  async addToScene(sceneID: IDString = game.scenes.current.id) {
    if (this.isInScene(sceneID)) { return; }
    const {sceneIDs} = this;
    sceneIDs.push(sceneID);
    await this.updateTarget("sceneIDs", sceneIDs);
  }

  async removeFromScene(sceneID: IDString = game.scenes.current.id) {
    if (!this.isInScene(sceneID)) { return; }
    const {sceneIDs} = this;
    U.remove(sceneIDs, sceneID);
    await this.updateTarget("sceneIDs", sceneIDs);
  }

  private async activateClockListeners() {

    if (!this.elem$) { return; }

    // The ".key-bg" child is actually the correct shape, so that will be our listener object.
    const keyListener$ = this.elem$.find(".key-bg");
    if (!keyListener$[0]) { return; }

    // Enable pointer events on the key-bg
    keyListener$.css("pointer-events", "auto");
    keyListener$.off();

    // Enable pointer events on each of the clocks
    this.clocks.forEach((clock) => {
      if (!clock.elem$) {return;}
      clock.elem$.css("pointer-events", "auto");
    });

    if (game.user.isGM) {
      // === GM-ONLY LISTENERS ===

      // Double-Click a Clock Key = Open ClockKeeper sheet
      keyListener$.on("dblclick", async () => {
        game.eunoblades.ClockKeeper.sheet?.render(true);
      });

      // Right-Click a Clock Key = Pull it
      keyListener$.on("contextmenu", async () => {
        this.pull_SocketCall();
      });

    } else {
      // === PLAYER-ONLY LISTENERS ===

      // Add listeners to container for mouseenter and mouseleave, that play and reverse timeline attached to element
      keyListener$.on("mouseenter", () => {
        this.hoverOverTimeline.play();
      }).on("mouseleave", () => {
        U.reverseRepeatingTimeline(this.hoverOverTimeline);
      });

      // Now repeat this for each clock in the clock key
      this.clocks.forEach((clock) => {
        if (!clock.elem) {return;}
        const clockElem$ = $(clock.elem);

        // Add listeners to clock for mouseenter and mouseleave, that play and reverse timeline attached to element
        clockElem$.on("mouseenter", () => {
          clock.hoverOverTimeline?.play();
        }).on("mouseleave", () => {
          if (clock.hoverOverTimeline) {
            U.reverseRepeatingTimeline(clock.hoverOverTimeline);
          }
        });
      });
    }
  }

  public async renderClockKey(
    containerElem$: HTMLElement | JQuery<HTMLElement>,
    callback?: () => void
  ) {
    const clockKeyHTML = await renderTemplate(
      "systems/eunos-blades/templates/components/clock-key.hbs",
      this
    );
    $(clockKeyHTML).appendTo(containerElem$);
    this.removePositionDragger();
    this.initClockKeyElem(ClockKeyDisplayMode.full);
    this.activateClockListeners();
    this.initOverlayElement(callback);
  }

  private initOverlayElement(callback?: () => void) {
    if (!this.elem$) { return; }
    this.drop_Animation(callback);
  }

  public closeClockKey(): void {
    this.deleteTimelines();
    this.containerElem$?.remove();
  }

  get elem(): HTMLElement | undefined {
    return $(`#${this.id}`)[0];
  }
  get elem$(): JQuery<HTMLElement> | undefined {
    return this.elem ? $(this.elem) : undefined;
  }
  get containerElem(): HTMLElement | undefined {
    return this.elem$?.parents(".clock-key-container")[0];
  }
  get containerElem$(): JQuery<HTMLElement> | undefined {
    return this.containerElem ? $(this.containerElem) : undefined;
  }
  get labelElem(): HTMLInputElement | undefined {
    return this.elem$ ? this.elem$.find(".key-label")[0] as HTMLInputElement : undefined;
  }
  get labelElem$(): JQuery<HTMLInputElement> | undefined {
    return this.elem$ ? this.elem$.find(".key-label") as JQuery<HTMLInputElement>: undefined;
  }

  get svgData(): ClockKeySVGData {
    if (this.size === 0) { throw new Error("[BladesClockKey.svgData] Error size is 0."); }
    const keyData = ClockKey_SVGDATA[this.size];
    let path: string;
    if (this.size === 1 && keyData.paths) {
      path = keyData.paths[this.oneKeyIndex];
    } else if (keyData.path) {
      path = keyData.path;
    } else {
      throw new Error("[BladesClockKey.svgData] Error path is not defined.");
    }

    return {
      width: keyData.width,
      height: keyData.height,
      path,
      clocks: keyData.clocks
    };
  }

  get keyHeight(): number { return this.svgData.height; }
  get keyWidth(): number { return this.svgData.width; }
  get keyViewbox(): string { return `0 0 ${this.svgData.width} ${this.svgData.height}`; }
  get keyPath(): string { return this.svgData.path; }
  get clockSize(): number { return this.svgData.clocks.size; }
  getClockPosition(clockIndex: ClockIndex = 0) {
    if (clockIndex > this.size) { throw new Error(`[BladesClockKey.getClockPosition] Error clockIndex '${clockIndex}' is greater than key size '${this.size}'.`); }
    if (clockIndex < 0) { throw new Error(`[BladesClockKey.getClockPosition] Error clockIndex '${clockIndex}' is less than 0.`); }
    return this.svgData.clocks[clockIndex];
  }


  initClockKeyElem(displayModeOverride?: ClockKeyDisplayMode | number): void {
    if (!this.containerElem$) { throw new Error(`[BladesClockKey.initClockKeyElem] Error containerElem$ not found for key '${this.id}'.`); }
    if (!this.elem$) { throw new Error(`[BladesClockKey.initClockKeyElem] Error elem$ not found for key '${this.id}'.`); }

    // If an overlayPosition has been set, apply to the container element:
    if (this.overlayPosition) {
      this.containerElem$.css({
        left: this.overlayPosition.x,
        top: this.overlayPosition.y
      });
    }

    // If the key has a name, apply adjustments to the label container for a pleasing aspect ratio
    if (this.name && this.labelElem$) {
      U.adjustTextContainerAspectRatio(this.labelElem$, 2, 100);
    }

    const {keyTweenVars, keyContTweenVars} = this.getVarsForDisplayMode(displayModeOverride ?? this.displayMode);
    const keyImgContainer = this.elem$.find(".key-image-container")[0];

    if (!keyImgContainer) { throw new Error(`[BladesClockKey.initOverlayElement] Error keyImgContainer not found for key '${this.id}'.`); }

    // Initialize key with display mode vars
    U.gsap.set(keyImgContainer, keyContTweenVars);
    U.gsap.set(this.elem$, keyTweenVars);
  }

  _positionDragger?: Dragger;
  spawnPositionDragger(containerElem$: HTMLElement | JQuery<HTMLElement> = game.eunoblades.Director.clockKeySection$) {
    const self = this;
    if (this._positionDragger) {
      this.removePositionDragger();
    }
    const dragElem$ = $(`<div id="Dragger-${this.id}" class="clock-key-container clock-key-dragger" data-size="${this.size}"></div>`)
      .appendTo(containerElem$);

    if (this.overlayPosition) {
      dragElem$.css({
        left: this.overlayPosition.x,
        top: this.overlayPosition.y
      });
    }

    this._positionDragger = new Dragger(dragElem$, {
      type: "top,left",
      onDragStart(this: Dragger) {
        $(this.target).css("background", "rgba(255, 255, 0, 0.25)");
        $(this.target).css("outlineColor", "rgba(255, 255, 0, 1)");
      },
      onDragEnd(this: Dragger) {
        $(this.target).css("background", "rgba(255, 0, 255, 0.25)");
        $(this.target).css("outlineColor", "rgba(255, 0, 255, 1)");
        console.log(`Positioning at {x: ${this.endX}, y: ${this.endY}}`);
        self.overlayPosition = {x: this.endX, y: this.endY};
      }
    });
  }

  removePositionDragger() {
    if (this._positionDragger) {
      $(this._positionDragger.target).remove();
      this._positionDragger = undefined;
    }
  }

  /**
   * This function generates a partial GSAP.TweenVars object that will display the key in a given mode within the bounds of a provided container.
   *
   * @param {ClockKeyDisplayMode | number} [displayMode="full"] - The display mode. Options include:
   * - "full" - displays the entire clock key
   * - "clocks" - zooms in to display only the clocks
   * - "activeClocks" - zooms in to the active clocks
   * - "presentN" (where N is a clock index number) - zooms in to the clock at index N, and presents whichever side has the next available segment towards the camera.
   * - A clock index number - zooms in to the clock at index N
   *
   * @param {HTMLElement | JQuery<HTMLElement> | {x: number, y: number, width: number, height: number}} [containerElement] - The container within which the key will be displayed.
   * This can be:
   * - An HTMLElement
   * - A JQuery<HTMLElement>
   * - A {x, y, width, height} position definition
   * If not provided, it defaults to the clock key's container element (only if the key is already rendered in the DOM).
   *
   * @returns {gsap.TweenVars} - A partial GSAP.TweenVars object that describes how to display the key in the given mode within the bounds of the provided container. The returned object may include the following properties:
   * - 'scale' (number): A multiple to be applied to scale at "full" display mode.
   * - 'top' (number): A delta vertical shift from "full" display mode position.
   * - 'left' (number): A delta horizontal shift from "full" display mode position.
   * - 'transformOrigin': An absolute value.
   * - 'rotationZ': An absolute value for the keySwing axis.
   * - 'rotationY': An absolute value for rotation in/out of the screen.
   * Any variables left undefined default to "full" display mode.
   */
  getVarsForDisplayMode(
    displayMode: ClockKeyDisplayMode | number = ClockKeyDisplayMode.full,
    containerElement?: HTMLElement | JQuery<HTMLElement> | {x: number, y: number, width: number, height: number}
  ): gsap.TweenVars {

    const keyTweenVars: gsap.TweenVars = {};
    const keyContTweenVars: gsap.TweenVars = {};

    containerElement ??= this.containerElem;
    if (!containerElement) { throw new Error(`[BladesClockKey.getVarsForDisplayMode] Error containerElement is not defined for key '${this.id}'.`); }

    // Convert containerElement (HTMLElement / JQuery<HTMLElement> / {x: number, y: number, width: number, height: number})
    // into a {x: number, y: number, width: number, height: number} object, using U.gsap.getProperty
    const containerPosData = U.gsap.getProperty(containerElement) as (property: string) => number;
    containerElement = {
      x: containerPosData("x"),
      y: containerPosData("y"),
      width: containerPosData("width"),
      height: containerPosData("height")
    };

    // Get key data
    const keyPosData = U.objClone(C.ClockKeyPositions[this.size]);

    // Adjust displayMode according to current status of key and its clocks
    let presentingClock: BladesClock|undefined;
    if (displayMode === ClockKeyDisplayMode.activeClocks) {
      // Are we zooming into active clocks?
      if (this.activeClocks.length === 0) {
        //    If so, and there are no active clocks, default to "clocks"
        displayMode = ClockKeyDisplayMode.clocks;
      } else if (this.activeClocks.length === 1) {
        //    If so, and there is only one active clock, default to that clock's index.
        displayMode = this.activeClocks[0].index;
      }
    } else if (/^present/.exec(`${displayMode}`)) {
      // Are we presenting? If so, get the presentingClock and the clock index.
      displayMode = U.pInt(`${displayMode}`.replace("present", ""));
      if (displayMode < 0 || displayMode >= this.size) {
        throw new Error(`[BladesClockKey.getVarsForDisplayMode] Error display mode 'present${displayMode}' is not a valid clock index for key '${this.id}'.`);
      }
      presentingClock = this.getClockByIndex(displayMode as ClockIndex);
    }

    // Get position and area dimensions of clock key area focused on by displayMode
    let focusArea: {x: number, y: number, z?: number, width: number, height: number};
    switch (displayMode) {
      case ClockKeyDisplayMode.full: {
        focusArea = {...keyPosData.keyCenter, ...keyPosData.keyDimensions};
        break;
      }
      case ClockKeyDisplayMode.clocks: {
        focusArea = {...keyPosData.clocksCenter, ...keyPosData.clocksCenterDimensions};
        break;
      }
      case ClockKeyDisplayMode.activeClocks: {
        // Create array of position data for each active clock.
        const activeClockPositions = this.activeClocks.map((clock) => {
          const {index} = clock;
          if (!(index in keyPosData.clocks)) {
            throw new Error(`[BladesClockKey.getVarsForDisplayMode] Error display mode 'activeClocks' - clock '${clock.id}' index '${clock.index}' not found in position data for key '${this.id}' of size ${this.size}.`);
          }
          const {x, y} = keyPosData.clocks[index as KeyOf<typeof keyPosData["clocks"]>];
          return {x, y, width: 110, height: 110};
        });
        focusArea = U.getBoundingRectangle(activeClockPositions);
        break;
      }
      default: {
        if (typeof displayMode === "number") {
          const clockPosData: {x: number, y: number} = keyPosData.clocks[displayMode as KeyOf<typeof keyPosData["clocks"]>];
          focusArea = {
            ...clockPosData,
            width: 110,
            height: 110
          };
          break;
        }
        throw new Error(`[BladesClockKey.getVarsForDisplayMode] Error display key '${this.id}' in mode '${displayMode}'.`);
      }
    }

    // Determine scale factor necessary to fit focusArea inside keyContainer
    keyTweenVars.scale = Math.min(
      containerElement.height / focusArea.height,
      containerElement.width / focusArea.width
    );

    // Determine top and left values for key-image-container, accounting for x/yPercent -50
    keyContTweenVars.top = (0.5 * 100) - focusArea.y;
    keyContTweenVars.left = (0.5 * 100) - focusArea.x;

    // Set transfer origin of key-image-container to same position, for further animation
    keyContTweenVars.transformOrigin = `${focusArea.x}px ${focusArea.y}px`;

    // Set initial y-rotation to turn clock half towards camera if 'isPresenting'
    if (presentingClock) {
      if (presentingClock.getActiveSide() === "left") {
        keyContTweenVars.rotateY = 30;
      } else if (presentingClock.getActiveSide() === "right") {
        keyContTweenVars.rotateY = -30;
      }
    }

    return {keyTweenVars, keyContTweenVars};
  }

  async switchToMode(
    displayMode: ClockKeyDisplayMode | number,
    extendKeyVars: Partial<gsap.TweenVars> = {},
    extendKeyContainerVars: Partial<gsap.TweenVars> = {},
    isLocalOnly = false
  ): Promise<void> {
    const {elem$, containerElem$} = this;
    if (!elem$) { throw new Error(`[BladesClockKey.switchToMode] Error elem$ is not defined for key '${this.id}'.`); }
    if (!containerElem$) { throw new Error(`[BladesClockKey.switchToMode] Error containerElem$ is not defined for key '${this.id}'.`); }

    const {keyTweenVars, keyContTweenVars} = this.getVarsForDisplayMode(displayMode);

    return new Promise((resolve) => {
      U.gsap.timeline({
        callbackScope: this,
        onComplete() {
          if (!isLocalOnly) {
            this.updateTarget("displayMode", displayMode)
              .then(() => resolve());
          }
        }
      })
        .to(elem$, {...keyTweenVars, ...extendKeyVars}, 0)
        .to(containerElem$, {...keyContTweenVars, ...extendKeyContainerVars}, 0);
    });
  }
  // #endregion

  // #region ANIMATED UPDATES (Both GM-Only AND Socket Calls)

  //    #region   > TIMELINES ~
  private deleteTimelines() {
    delete this._keySwingTimeline;
    delete this._hoverOverTimeline;
    delete this._nameFadeInTimeline;
  }

  _keySwingTimeline?: gsap.core.Timeline;
  get keySwingTimeline(): gsap.core.Timeline {
    if (!this.elem) {throw new Error("elem is not defined for keySwingTimeline");}
    if (!$(this.elem).parents("#blades-overlay").length) {throw new Error("elem is not a child of #blades-overlay");}
    if (!this._keySwingTimeline) {
      this._keySwingTimeline = U.gsap.effects.keySwing(this.elem).pause();
    }
    return this._keySwingTimeline as gsap.core.Timeline;
  }

  _nameFadeInTimeline?: gsap.core.Timeline;
  get nameFadeInTimeline(): gsap.core.Timeline {
    if (!this.elem) {throw new Error("elem is not defined for nameFadeInTimeline");}
    if (!$(this.elem).parents("#blades-overlay").length) {throw new Error("elem is not a child of #blades-overlay");}
    if (!this._nameFadeInTimeline) {
      this._nameFadeInTimeline = U.gsap.timeline()
        .blurReveal(this.labelElem$, {
          ignoreMargin: true,
          duration: 0.75
        })
        .to(this.labelElem$, {xPercent: -50, duration: 0.75}, 0);
      // .textJitter(this.labelElem$);
    }
    return this._nameFadeInTimeline as gsap.core.Timeline;
  }

  _hoverOverTimeline?: gsap.core.Timeline;
  get hoverOverTimeline(): gsap.core.Timeline {
    if (!this.elem) {throw new Error("elem is not defined for hoverOverTimeline");}
    if (!$(this.elem).parents("#blades-overlay").length) {throw new Error("elem is not a child of #blades-overlay");}
    if (!this._hoverOverTimeline) {
      this._hoverOverTimeline = U.gsap.effects.hoverOverClockKey(this.elem);
    }
    return this._hoverOverTimeline as gsap.core.Timeline;
  }
  //    #endregion

  //    #region   > SOCKET CALLS: _SocketCall / static _SocketResponse / _Animation
  drop_Animation(callback?: () => void): gsap.core.Timeline {
    // U.gsap.effects.keyDrop(this.elem, {callback});
    // this.keySwingTimeline?.seek(0).play();

    // Construct timeline for revealing clock key
    const tl = U.gsap.timeline({
      callbackScope: this,
      onStart(this: BladesClockKey) {
        this.keySwingTimeline.seek("NEUTRAL").play();
      }
    })
      .keyDrop(this.elem);

    // Call clock fade-in timelines for each visible clock.
    this.activeClocks.forEach((clock, i) => {
      tl.add(clock.activate_Animation(), i === 0 ? ">" : "<+0.15");
    });

    // Fade in name, if name is visible.
    if (this.name && this.isNameVisible) {
      tl.add(this.nameFadeInTimeline);
    }

    return tl;
  }
  async drop_SocketCall() {
    if (!game.user.isGM) {return;}
    this.renderClockKey(game.eunoblades.Director.clockKeySection$);
    socketlib.system.executeForOthers("drop_SocketCall", this.id);
    this.isVisible = true;
  }
  static drop_SocketResponse(keyID: IDString) {
    const key = game.eunoblades.ClockKeys.get(keyID);
    if (!key) {return;}
    key.renderClockKey(game.eunoblades.Director.clockKeySection$);
  }

  pull_Animation(callback?: () => void): gsap.core.Timeline {

    return U.gsap.timeline({
      callbackScope: this,
      onComplete(this: BladesClockKey) {
        this.closeClockKey();
        callback?.();
      }
    })
      .keyPull(this.elem, {callback});
  }
  async pull_SocketCall() {
    if (!game.user.isGM) {return;}
    if (!this.elem) {return;}
    if (!$(this.elem).parents("#blades-overlay").length) {return;}
    this.pull_Animation();
    socketlib.system.executeForOthers("pull_SocketCall", this.id);
    this.isVisible = false;
  }
  static pull_SocketResponse(keyID: IDString) {
    const key = game.eunoblades.ClockKeys.get(keyID);
    if (!key) {return;}
    key.pull_Animation();
  }

  fadeInName_Animation(): gsap.core.Timeline|undefined {
    if (!this.labelElem$) { return undefined; }
    if (!this.name) { return undefined; }
    return this.nameFadeInTimeline.play();
  }
  async fadeInName_SocketCall() {
    if (!game.user.isGM) {return;}
    if (!this.elem) {return;}
    if (!$(this.elem).parents("#blades-overlay").length) {return;}
    this.fadeInName_Animation();
    socketlib.system.executeForOthers("fadeInName_SocketCall", this.id);
    this.isNameVisible = true;
  }
  static fadeInName_SocketResponse(keyID: IDString) {
    const key = game.eunoblades.ClockKeys.get(keyID);
    if (!key) {return;}
    key.fadeInName_Animation();
  }

  fadeOutName_Animation(): gsap.core.Timeline|undefined {
    if (!this.labelElem$) { return undefined; }
    if (!this.name) { return undefined; }
    return U.reverseRepeatingTimeline(this.nameFadeInTimeline);
  }
  async fadeOutName_SocketCall() {
    if (!game.user.isGM) {return;}
    if (!this.elem) {return;}
    if (!$(this.elem).parents("#blades-overlay").length) {return;}
    this.fadeOutName_Animation();
    socketlib.system.executeForOthers("fadeOutName_SocketCall", this.id);
    this.isNameVisible = false;
  }
  static fadeOutName_SocketResponse(keyID: IDString) {
    const key = game.eunoblades.ClockKeys.get(keyID);
    if (!key) {return;}
    key.fadeOutName_Animation();
  }
  //    #endregion

  // #endregion

  // #region Adding & Removing Clocks ~
  async updateClockIndices() {
    await this.updateTarget("clocksData", Object.fromEntries(
      Object.entries(this.clocksData)
        .map(([id, data], index) => [id, {...data, index}])
    ));
    return this.clocks;
  }

  async addClock(clockConfig: Partial<BladesClock.Config> = {}): Promise<void> {
    // Derive clock data from config
    const clockData = this.parseClockConfig(clockConfig);

    // Write to state
    await this.updateTarget(`clocksData.${clockData.id}`, clockData);

    // Regnerate clocks collection
    void this.clocks;
  }

  async deleteClock(clockID?: IDString) {
    if (this.size <= 1) {throw new Error("[BladesClockKey.deleteClock()] Cannot reduce number of clocks below 1!");}
    clockID ??= Array.from(this.clocks).pop()?.id;
    if (!clockID) {return;}
    await this.getClockByID(clockID)?.delete();
    await this.updateClockIndices();
    // Regnerate clocks collection
    void this.clocks;
  }
  // #endregion
}

class BladesClock extends BladesTargetLink<BladesClock.Schema> implements BladesClock.Subclass {

  // #region STATIC METHODS ~
  static override ApplySchemaDefaults<Schema = BladesClock.Schema>(
    schemaData: Partial<BladesClock.Schema>
  ) {

    const namedValueMax: NamedValueMax = {
      name: schemaData.name ?? "",
      value: schemaData.value ?? 0,
      max: schemaData.max ?? 8
    };

    return {
      index: 0,
      color: ClockColor.white,

      isVisible: true,
      isNameVisible: true,
      isHighlighted: false,
      isActive: true,

      ...schemaData,
      ...namedValueMax
    } as Schema;
  }
  // #endregion

  // #region GETTERS & SETTERS ~
  get canEdit(): boolean {
    // return true if user has edit permissions on parent document, and clock is
    // visible and active.
    console.log("NOTE: All Clocks currently Editable; see line 71 of BladesClock.ts");
    return this.isVisible && this.isActive;
  }

  override get data() {return this.linkData as BladesTargetLink.Data & BladesClock.Schema;}

  get name(): string {return this.data.name;}
  set name(val: string) {this.updateTarget("name", val);}

  get value(): number {return U.pInt(this.data.value);}
  set value(val: number) {this.updateTarget("value", U.pInt(val));}

  get max(): number {return U.pInt(this.data.max);}
  set max(val: number) {this.updateTarget("max", U.pInt(val));}

  get color(): ClockColor {return this.data.color as ClockColor ?? ClockColor.white;}
  set color(val: ClockColor) {this.updateTarget("color", val);}

  get isActive(): boolean {return U.pBool(this.data.isActive);}
  set isActive(val: boolean) {this.updateTarget("isActive", U.pBool(val));}

  get parentKey() {
    const pKey = game.eunoblades.ClockKeys.get(this.data.parentKeyID);
    if (!pKey) { throw new Error(`[BladesClockKey.parentKey] No parent key found for clock ${this.id}`);}
    return pKey;
  }

  get isNameVisible(): boolean {return U.pBool(this.data.isNameVisible);}
  set isNameVisible(val: boolean) {this.updateTarget("isNameVisible", U.pBool(val));}

  get isVisible(): boolean {return U.pBool(this.data.isVisible);}
  set isVisible(val: boolean) {this.updateTarget("isVisible", U.pBool(val));}

  get isHighlighted(): boolean {return U.pBool(this.data.isHighlighted);}
  set isHighlighted(val: boolean) {this.updateTarget("isHighlighted", U.pBool(val));}

  get index(): number {return U.pInt(this.data.index);}
  set index(val: number) {this.updateTarget("index", U.pInt(val));}

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

  // #endregion

  // #region HTML INTERACTION ~
  get elem(): HTMLElement | undefined {
    return $(`#${this.id}`)[0];
  }
  get elem$(): JQuery<HTMLElement> | undefined {
    return this.elem ? $(this.elem) : undefined;
  }
  get containerElem(): HTMLElement | undefined {
    return this.elem$?.parents(".clock-container")[0];
  }
  get containerElem$(): JQuery<HTMLElement> | undefined {
    return this.containerElem ? $(this.containerElem) : undefined;
  }
  get labelElem(): HTMLElement | undefined {
    return this.elem$?.find(".clock-label")[0];
  }
  get labelElem$(): JQuery<HTMLElement> | undefined {
    return this.labelElem ? $(this.labelElem) : undefined;
  }
  get frameElem(): HTMLElement | undefined {
    return this.elem$?.find(".clock-frame")[0];
  }
  get frameElem$(): JQuery<HTMLElement> | undefined {
    return this.frameElem ? $(this.frameElem) : undefined;
  }
  get fillElem(): HTMLElement | undefined {
    return this.elem$?.find(".clock-fill")[0];
  }
  get fillElem$(): JQuery<HTMLElement> | undefined {
    return this.fillElem ? $(this.fillElem) : undefined;
  }
  get glowElem(): HTMLElement | undefined {
    return this.elem$?.find(".clock-glow")[0];
  }
  get glowElem$(): JQuery<HTMLElement> | undefined {
    return this.glowElem ? $(this.glowElem) : undefined;
  }

  get isOnDisplay() {
    return this.parentKey.isOnDisplay && this.isVisible;
  }

  async getHTML(): Promise<string> {
    return await renderTemplate(
      "systems/eunos-blades/templates/components/clock.hbs",
      this
    );
  }

  // Returns which hemisphere of the clock will show the final change if segmentDelta segments are added/removed.
  getActiveSide(segmentDelta = 0): "left" | "right" {
    const finalClockValue = Math.min(this.max, Math.max(0, this.value + segmentDelta));
    const halfClockValue = this.max / 2;
    if (finalClockValue > halfClockValue) {return "left";}

    return "right";
  }
  // #endregion

  // #region ANIMATED UPDATES (Both GM-Only AND Socket Calls)

  //    #region   > TIMELINES ~

  _nameFadeInTimeline?: gsap.core.Timeline;
  get nameFadeInTimeline(): gsap.core.Timeline {
    if (!this.elem) {throw new Error("elem is not defined for nameFadeInTimeline");}
    if (!$(this.elem).parents("#blades-overlay").length) {throw new Error("elem is not a child of #blades-overlay");}
    if (!this._nameFadeInTimeline) {
      this._nameFadeInTimeline = U.gsap.timeline({
        callbackScope: this,
        data: {}
        // onComplete() {
        //  this.nameFadeInTimeline.data.textJitterTimeline = U.gsap.effects.textJitter(this.labelElem$).play();
        // },
        // onReverseComplete() {
        //  this.nameFadeInTimeline.data.textJitterTimeline.kill();
        // }
      }).blurReveal(this.labelElem$, {
        ignoreMargin: true,
        duration: 0.75
      }, 0);
    }
    return this._nameFadeInTimeline as gsap.core.Timeline;
  }

  _highlightTimeline?: gsap.core.Timeline;
  get highlightTimeline(): gsap.core.Timeline {
    if (!this.glowElem$) {throw new Error("glowElem$ is not defined for highlightTimeline");}
    if (!this.elem) {throw new Error("elem is not defined for nameFadeInTimeline");}
    if (!$(this.elem).parents("#blades-overlay").length) {throw new Error("elem is not a child of #blades-overlay");}
    if (!this._highlightTimeline) {
      this._highlightTimeline = U.gsap.timeline()
        .to(this.glowElem$, {
          autoAlpha: 1,
          duration: 1,
          ease: "sine"
        });
    }

    return this._highlightTimeline;
  }

  _hoverOverTimeline?: gsap.core.Timeline;
  get hoverOverTimeline() {
    if (!this.elem) {return undefined;}
    if (!this._hoverOverTimeline) {
      this._hoverOverTimeline = U.gsap.effects.hoverOverClock(this);
    }
    return this._hoverOverTimeline;
  }
  //    #endregion

  // clock.activate_SocketCall();
  activate_Animation(callback?: () => void): gsap.core.Timeline {
    // U.gsap.effects.keyDrop(this.elem, {callback});
    // this.keySwingTimeline?.seek(0).play();

    // Identify elements for fading in
    const fadeInElements: Array<JQuery<HTMLElement>> = [
      this.elem$,
      this.frameElem$,
      this.fillElem$
    ].filter((el$) => el$ !== undefined) as Array<JQuery<HTMLElement>>;

    // Construct timeline for activating clock
    const tl = U.gsap.timeline({
      callbackScope: this,
      onComplete(this: BladesClock) {
        callback?.();
      }
    })
      .to(fadeInElements, {
        autoAlpha: 1,
        duration: 0.5,
        stagger: 0.2,
        ease: "power2"
      });

    // Fade in name, if name is visible.
    if (this.name && this.isNameVisible) {
      tl.add(this.nameFadeInTimeline);
    }
    // Fade in glow, if highlighted
    if (this.glowElem$ && this.isHighlighted) {
      tl.add(this.highlightTimeline, "<+0.05");
    }

    return tl;
  }
  async activate_SocketCall() {
    if (!game.user.isGM) {return;}
    this.activate_Animation();
    socketlib.system.executeForOthers("activate_SocketCall", this.parentKey.id, this.index);
    this.isActive = true;
  }
  static activate_SocketResponse(keyID: IDString, index: ClockIndex) {
    const key = game.eunoblades.ClockKeys.get(keyID);
    if (!key?.isVisible) {return;}
    key.getClockByIndex(index)?.activate_Animation();
  }

  // clock.deactivate_SocketCall();
  // clock.fadeInClockName_SocketCall();
  // clock.fadeOutClockName_SocketCall();
  // clock.highlight_SocketCall();
  // clock.unhighlight_SocketCall();
  changeSegments_Animation(delta: number, callback?: () => void): gsap.core.Timeline {
    const tl = U.gsap.timeline({
      callbackScope: this,
      onComplete() {
        callback?.();
      }
    });

    return tl;

    // const clockKey = game.eunoblades.ClockKeys.get("brMaMG9ogeEvvuXD");
    // const clock = Array.from(clockKey.clocks)[1];
    // const oneSegments = Array.from(clock.elem$.find(".clock-one-segment"));
    // function getRotationAngle(clock, segment) {
    //   const stepSize = 360 / clock.max;
    //   return stepSize * (segment - 1);
    // }
    // function rotateOneSegment(clock, oneSegment, segmentNum) {
    //   const angle = getRotationAngle(clock, segmentNum);
    //   U.gsap.set(oneSegment, {rotation: angle});
    // }
    // function addSegments(amount) {
    //   while (clock.value + amount > clock.max) { amount--; }
    //   const oneSegs = [...oneSegments].slice(0, amount);
    //   for (let i = 1; i <= amount; i++) {
    //     const thisSegment = clock.value + i;
    //     rotateOneSegment(clock, oneSegs[i-1], thisSegment);
    //   }
    //   U.gsap.fromTo(oneSegs, {scale: 1.5}, {scale: 1, autoAlpha: 1, duration: 1, stagger: 0.5, onComplete() {
    //     U.gsap.to(oneSegs, {autoAlpha: 0, duration: 1, delay: 2});
    //   }
    //   });
    // }
  }
  // clock.changeSegments_SocketCall(value)

  // #endregion

  // #region Adding/Removing Clock Segments ~
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

  override async delete() {
    const {parentKey} = this;
    await super.delete();
    parentKey.updateClockIndices();
  }
  // #endregion

}


export default BladesClockKey;

export {BladesClock};
