/* eslint-disable @typescript-eslint/no-unused-vars */
import C, { BladesActorType, BladesItemType, ClockColor, ClockKeyDisplayMode } from "../core/constants.js";
import BladesTargetLink from "./BladesTargetLink.js";
import U from "../core/utilities.js";
import { BladesActor } from "../documents/BladesActorProxy.js";
import { BladesItem } from "../documents/BladesItemProxy.js";
class BladesClockKey extends BladesTargetLink {
    // #region STATIC METHODS ~
    static Initialize() {
        function registerClockKeys(doc) {
            if ("clocksData" in doc.system) {
                Object.values(doc.system.clocksData ?? {})
                    .forEach((keyData) => {
                    try {
                        new BladesClockKey(keyData);
                    }
                    catch (err) {
                        eLog.error("BladesClockKey", "[BladesClockKey.Initialize] Error initializing clock key.", err, keyData);
                    }
                });
            }
        }
        game.items.contents
            .filter((item) => BladesItem.IsType(item, BladesItemType.clock_keeper, BladesItemType.project, BladesItemType.cohort_gang, BladesItemType.cohort_expert, BladesItemType.ritual, BladesItemType.design, BladesItemType.location, BladesItemType.score))
            .forEach(registerClockKeys);
        game.actors.contents
            .filter((actor) => BladesActor.IsType(actor, BladesActorType.pc, BladesActorType.faction))
            .forEach(registerClockKeys);
        socketlib.system.register("pull_SocketCall", BladesClockKey.pull_SocketResponse.bind(this));
        socketlib.system.register("drop_SocketCall", BladesClockKey.drop_SocketResponse.bind(this));
        socketlib.system.register("fadeInName_SocketCall", BladesClockKey.fadeInName_SocketResponse.bind(this));
        socketlib.system.register("fadeOutName_SocketCall", BladesClockKey.fadeOutName_SocketResponse.bind(this));
        return loadTemplates([
            "systems/eunos-blades/templates/components/clock-key.hbs",
            "systems/eunos-blades/templates/components/clock.hbs"
        ]);
    }
    static ApplySchemaDefaults(schemaData) {
        // Ensure all properties of Schema are provided
        return {
            name: "",
            isVisible: false,
            isNameVisible: false,
            isSpotlit: false,
            clocksData: {},
            sceneIDs: [],
            displayMode: ClockKeyDisplayMode.full,
            oneKeyIndex: U.gsap.utils.random(1, 5, 1),
            ...schemaData
        };
    }
    static async Create(config, clockConfigs = []) {
        // Confirm at least one, but no more than six, clockConfigs provided:
        if (clockConfigs.length > 6) {
            // If too many clock keys, alert user and discard excess.
            eLog.error("BladesClockKey", "[BladesClockKey.Create] Too many clock configs! (Max 6.) Eliminating extras.", clockConfigs);
            clockConfigs = clockConfigs.slice(0, 6);
        }
        else if (clockConfigs.length === 0) {
            // If no clocks provided, add one default clock.
            clockConfigs.push({});
        }
        // Create and initialize the target link
        const clockKey = (await super.Create(config));
        // Convert clock configs to full clock data objects.
        const clocksData = Object.fromEntries(clockConfigs.map((clockConfig, i) => {
            clockConfig.index = i;
            const cData = clockKey.parseClockConfig(clockConfig);
            return [cData.id, cData];
        }));
        // Update the clock key with the new clock data
        await clockKey.updateTarget("clocksData", clocksData);
        return clockKey;
    }
    // #endregion
    // #region GETTERS & SETTERS ~
    // #region -- Shortcut Schema Getters ~
    get data() { return this.linkData; }
    get name() { return this.data.name; }
    set name(val) { this.updateTarget("name", val); }
    get isVisible() { return this.data.isVisible; }
    set isVisible(val) { this.updateTarget("isVisible", U.pBool(val)); }
    get isNameVisible() { return this.data.isNameVisible; }
    set isNameVisible(val) { this.updateTarget("isNameVisible", U.pBool(val)); }
    get isSpotlit() { return this.data.isSpotlit; }
    set isSpotlit(val) { this.updateTarget("isSpotlit", val); }
    get clocksData() { return this.data.clocksData; }
    get displayMode() { return this.data.displayMode; }
    get oneKeyIndex() {
        let { oneKeyIndex } = this.data;
        if (!oneKeyIndex) {
            oneKeyIndex = U.gsap.utils.random(1, 5, 1);
            this.updateTarget("oneKeyIndex", oneKeyIndex);
        }
        return oneKeyIndex;
    }
    get sceneIDs() { return this.data.sceneIDs ?? []; }
    get overlayPosition() { return this.data.overlayPosition?.[game.scenes.current.id]; }
    // #endregion
    get clocks() {
        return new Collection(Object.entries(this.clocksData)
            .sort((a, b) => a[1].index - b[1].index)
            .map(([id, data]) => {
            return [id, new BladesClock(data)];
        }));
    }
    getClockByID(clockID) {
        return this.clocks.get(clockID);
    }
    getClockByIndex(index) {
        return this.clocks.find((clock) => clock.index === index);
    }
    get size() { return this.clocks.size; }
    get isComplete() {
        return Array.from(this.clocks).every((clock) => clock.isComplete);
    }
    get activeClocks() {
        return this.clocks.filter((clock) => clock.isActive && !clock.isComplete);
    }
    get displaySelectOptions() {
        const options = [
            { value: ClockKeyDisplayMode.full, display: "Full Key" },
            { value: ClockKeyDisplayMode.clocks, display: "Clocks" },
            { value: ClockKeyDisplayMode.activeClocks, display: "Active Clocks" }
        ];
        for (let i = 0; i < this.size; i++) {
            options.push(...[
                { value: i, display: `Clock #${i}` },
                { value: `present${i}`, display: `Present Clock #${i}` }
            ]);
        }
        return options;
    }
    // #endregion
    // #region ~~~ CONSTRUCTOR & CLOCK CONFIG PARSER ~~~
    constructor(data) {
        super(data);
        game.eunoblades.ClockKeys.set(this.id, this);
        Object.values(data.clocksData).forEach((clockData) => new BladesClock(clockData));
    }
    parseClockConfig(config, indexOverride) {
        if (this.size === 6) {
            throw new Error("Cannot add a clock to a clock key with 6 clocks.");
        }
        if (indexOverride !== undefined && indexOverride < 0) {
            throw new Error("Cannot add a clock with a negative index.");
        }
        // Remove target so it doesn't conflict with key's targetID
        delete config.target;
        // Derive clock's targetID and targetKey/targetFlagKey from key's values
        config.targetID = this.targetID;
        if (this.targetKey) {
            config.targetKey = `${this.targetKey}.${this.id}.clocksData`;
            delete config.targetFlagKey;
        }
        else if (this.targetFlagKey) {
            config.targetFlagKey = `${this.targetFlagKey}.${this.id}.clocksData`;
            delete config.targetKey;
        }
        // Assign 'parentKeyID' and 'index'
        config.parentKeyID = this.id;
        config.index = indexOverride ?? this.size;
        // Parse config to full data object
        const cData = BladesClock.ParseConfig(config);
        return cData;
    }
    // #endregion
    // #region HTML INTERACTION ~
    isInScene(sceneID = game.scenes.current.id) {
        return this.sceneIDs.includes(sceneID);
    }
    get isInCurrentScene() { return this.isInScene(); }
    async getHTML() {
        return await renderTemplate("systems/eunos-blades/templates/components/clock-key.hbs", this);
    }
    get elem() {
        return $(`#${this.id}`)[0];
    }
    get elem$() {
        return this.elem ? $(this.elem) : undefined;
    }
    get containerElem() {
        return this.elem$?.parents(".clock-key-container")[0];
    }
    get containerElem$() {
        return this.containerElem ? $(this.containerElem) : undefined;
    }
    get labelElem() {
        return this.elem$ ? this.elem$.find(".key-label")[0] : undefined;
    }
    get labelElem$() {
        return this.elem$ ? this.elem$.find(".key-label") : undefined;
    }
    // Initializes clock key with proper position and scale before displaying via autoAlpha
    async initClockKeyElem(displayMode) {
        displayMode = this.displayMode;
        if (!this.elem) {
            return new Promise((resolve) => {
                setTimeout(async () => resolve(await this.initClockKeyElem(displayMode)), 1000);
            });
        }
        const self = this;
        const { elem } = this;
        const { keyTweenVars, keyContTweenVars } = this.getVarsForDisplayMode(displayMode);
        const keyImgContainer = $(this.elem).find(".key-image-container")[0];
        return new Promise((resolve) => {
            const tl = U.gsap.timeline()
                .set(keyImgContainer, keyContTweenVars)
                .set(elem, keyTweenVars);
            if (this.isVisible) {
                tl.to(elem, {
                    autoAlpha: 1,
                    duration: 0.5,
                    onComplete() {
                        self.keySwingTimeline?.play();
                        resolve();
                    }
                });
            }
            else {
                resolve();
            }
        });
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
     * - 'top' (number): A delta vertical shift from "full.js" display mode position.
     * - 'left' (number): A delta horizontal shift from "full.js" display mode position.
     * - 'transformOrigin': An absolute value.
     * - 'rotationZ': An absolute value for the keySwing axis.
     * - 'rotationY': An absolute value for rotation in/out of the screen.
     * Any variables left undefined default to "full" display mode.
     */
    getVarsForDisplayMode(displayMode = ClockKeyDisplayMode.full, containerElement) {
        const keyTweenVars = {};
        const keyContTweenVars = {};
        containerElement ??= this.containerElem;
        if (!containerElement) {
            throw new Error(`[BladesClockKey.getVarsForDisplayMode] Error containerElement is not defined for key '${this.id}'.`);
        }
        // Convert containerElement (HTMLElement / JQuery<HTMLElement> / {x: number, y: number, width: number, height: number})
        // into a {x: number, y: number, width: number, height: number} object, using U.gsap.getProperty
        const containerPosData = U.gsap.getProperty(containerElement);
        containerElement = {
            x: containerPosData("x"),
            y: containerPosData("y"),
            width: containerPosData("width"),
            height: containerPosData("height")
        };
        // Get key data
        const keyPosData = U.objClone(C.ClockKeyPositions[this.size]);
        // Adjust displayMode according to current status of key and its clocks
        let presentingClock;
        if (displayMode === ClockKeyDisplayMode.activeClocks) {
            // Are we zooming into active clocks?
            if (this.activeClocks.length === 0) {
                //    If so, and there are no active clocks, default to "clocks"
                displayMode = ClockKeyDisplayMode.clocks;
            }
            else if (this.activeClocks.length === 1) {
                //    If so, and there is only one active clock, default to that clock's index.
                displayMode = this.activeClocks[0].index;
            }
        }
        else if (/^present/.exec(`${displayMode}`)) {
            // Are we presenting? If so, get the presentingClock and reduce displayMode to the clock index.
            displayMode = U.pInt(`${displayMode}`.replace("present", "")) - 1;
            if (displayMode < 0 || displayMode >= this.size) {
                throw new Error(`[BladesClockKey.getVarsForDisplayMode] Error display mode 'present${displayMode + 1}' is not a valid clock index for key '${this.id}'.`);
            }
            presentingClock = this.getClockByIndex(displayMode);
        }
        // Get position and area dimensions of clock key area focused on by displayMode
        let focusArea;
        switch (displayMode) {
            case ClockKeyDisplayMode.full: {
                focusArea = { ...keyPosData.keyCenter, ...keyPosData.keyDimensions };
                break;
            }
            case ClockKeyDisplayMode.clocks: {
                focusArea = { ...keyPosData.clocksCenter, ...keyPosData.clocksCenterDimensions };
                break;
            }
            case ClockKeyDisplayMode.activeClocks: {
                // Create array of position data for each active clock.
                const activeClockPositions = this.activeClocks.map((clock) => {
                    const { index } = clock;
                    if (!(index in keyPosData.clocks)) {
                        throw new Error(`[BladesClockKey.getVarsForDisplayMode] Error display mode 'activeClocks' - clock '${clock.id}' index '${clock.index}' not found in position data for key '${this.id}' of size ${this.size}.`);
                    }
                    const { x, y } = keyPosData.clocks[index];
                    return { x, y, width: 110, height: 110 };
                });
                focusArea = U.getBoundingRectangle(activeClockPositions);
                break;
            }
            default: {
                if (typeof displayMode === "number") {
                    const clockPosData = keyPosData.clocks[displayMode];
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
        keyTweenVars.scale = Math.min(containerElement.height / focusArea.height, containerElement.width / focusArea.width);
        // Determine top and left values for key-image-container, accounting for x/yPercent -50
        keyContTweenVars.top = (0.5 * 100) - focusArea.y;
        keyContTweenVars.left = (0.5 * 100) - focusArea.x;
        // Set transfer origin of key-image-container to same position, for further animation
        keyContTweenVars.transformOrigin = `${focusArea.x}px ${focusArea.y}px`;
        // Set initial y-rotation to turn clock half towards camera if 'isPresenting'
        if (presentingClock) {
            if (presentingClock.getActiveSide() === "left") {
                keyContTweenVars.rotateY = 30;
            }
            else if (presentingClock.getActiveSide() === "right") {
                keyContTweenVars.rotateY = -30;
            }
        }
        return { keyTweenVars, keyContTweenVars };
    }
    async switchToMode(displayMode, extendKeyVars = {}, extendKeyContainerVars = {}, isLocalOnly = false) {
        const { elem$, containerElem$ } = this;
        if (!elem$) {
            throw new Error(`[BladesClockKey.switchToMode] Error elem$ is not defined for key '${this.id}'.`);
        }
        if (!containerElem$) {
            throw new Error(`[BladesClockKey.switchToMode] Error containerElem$ is not defined for key '${this.id}'.`);
        }
        const { keyTweenVars, keyContTweenVars } = this.getVarsForDisplayMode(displayMode);
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
                .to(elem$, { ...keyTweenVars, ...extendKeyVars }, 0)
                .to(containerElem$, { ...keyContTweenVars, ...extendKeyContainerVars }, 0);
        });
    }
    // #endregion
    // #region ANIMATED UPDATES (Both GM-Only AND Socket Calls)
    //    #region   > TIMELINES ~
    _keySwingTimeline;
    get keySwingTimeline() {
        if (!this.elem) {
            throw new Error("elem is not defined for keySwingTimeline");
        }
        if (!$(this.elem).parents("#blades-overlay").length) {
            throw new Error("elem is not a child of #blades-overlay");
        }
        if (!this._keySwingTimeline) {
            this._keySwingTimeline = U.gsap.effects.keySwing(this.elem).pause();
        }
        return this._keySwingTimeline;
    }
    _hoverOverTimeline;
    get hoverOverTimeline() {
        if (!this.elem) {
            throw new Error("elem is not defined for hoverOverTimeline");
        }
        if (!$(this.elem).parents("#blades-overlay").length) {
            throw new Error("elem is not a child of #blades-overlay");
        }
        if (!this._hoverOverTimeline) {
            this._hoverOverTimeline = U.gsap.effects.hoverOverClockKey(this.elem);
        }
        return this._hoverOverTimeline;
    }
    _nameFadeInTimeline;
    get nameFadeInTimeline() {
        if (!this.labelElem$) {
            throw new Error("labelElem$ is not defined for nameFadeInTimeline");
        }
        if (!this.elem$?.parents("#blades-overlay")?.length) {
            throw new Error("elem is not a child of #blades-overlay");
        }
        if (!this._nameFadeInTimeline) {
            U.gsap.killTweensOf(this.labelElem$);
            this._nameFadeInTimeline = U.gsap.effects.blurReveal(this.labelElem$, {
                ignoreMargin: true,
                duration: 1.5,
                callbackScope: this,
                onStart() {
                    this.labelElem$.removeClass("label-hidden");
                },
                onComplete() {
                    U.gsap.effects.textJitter(this.labelElem$);
                },
                onReverseComplete() {
                    this.labelElem$.addClass("label-hidden");
                    U.gsap.killTweensOf(this.labelElem$);
                    delete this._nameFadeInTimeline;
                }
            }).pause();
        }
        return this._nameFadeInTimeline;
    }
    //    #endregion
    //    #region   > SOCKET CALLS: _SocketCall / static _SocketResponse / _Animation
    async drop_Animation(callback) {
        await game.eunoblades.Director.appendClockKeyToOverlay(this);
        U.gsap.effects.keyDrop(this.elem, { callback });
        this.keySwingTimeline?.seek(0).play();
    }
    async drop_SocketCall() {
        if (!game.user.isGM) {
            return;
        }
        this.drop_Animation(() => game.eunoblades.ClockKeeper.flipControlPanel(this));
        socketlib.system.executeForOthers("drop_SocketCall", this.id);
    }
    static drop_SocketResponse(keyID) {
        const key = game.eunoblades.ClockKeys.get(keyID);
        if (!key) {
            return;
        }
        key.drop_Animation();
    }
    async pull_Animation(callback) {
        if (!this.elem) {
            return;
        }
        await new Promise((resolve) => {
            U.gsap.effects.keyPull(this.elem, { callback }).then(resolve);
        });
        game.eunoblades.Director.removeClockKeyFromOverlay(this);
    }
    async pull_SocketCall() {
        if (!game.user.isGM) {
            return;
        }
        if (!this.elem) {
            return;
        }
        if (!$(this.elem).parents("#blades-overlay").length) {
            return;
        }
        this.pull_Animation(() => game.eunoblades.ClockKeeper.flipControlPanel(this));
        socketlib.system.executeForOthers("pull_SocketCall", this.id);
    }
    static pull_SocketResponse(keyID) {
        const key = game.eunoblades.ClockKeys.get(keyID);
        if (!key) {
            return;
        }
        key.pull_Animation();
    }
    async fadeInName_Animation(callback) {
        if (!this.labelElem$) {
            return;
        }
        if (!this.name) {
            return;
        }
        this.nameFadeInTimeline.play();
        if (callback) {
            U.gsap.delayedCall(2, callback);
        }
    }
    async fadeInName_SocketCall() {
        if (!game.user.isGM) {
            return;
        }
        if (!this.elem) {
            return;
        }
        if (!$(this.elem).parents("#blades-overlay").length) {
            return;
        }
        this.fadeInName_Animation();
        socketlib.system.executeForOthers("fadeInName_SocketCall", this.id);
    }
    static fadeInName_SocketResponse(keyID) {
        const key = game.eunoblades.ClockKeys.get(keyID);
        if (!key) {
            return;
        }
        key.fadeInName_Animation();
    }
    async fadeOutName_Animation(callback) {
        if (!this.labelElem$) {
            return;
        }
        if (!this.name) {
            return;
        }
        this.nameFadeInTimeline.reverse();
        if (callback) {
            U.gsap.delayedCall(2, callback);
        }
    }
    async fadeOutName_SocketCall() {
        if (!game.user.isGM) {
            return;
        }
        if (!this.elem) {
            return;
        }
        if (!$(this.elem).parents("#blades-overlay").length) {
            return;
        }
        this.fadeOutName_Animation();
        socketlib.system.executeForOthers("fadeOutName_SocketCall", this.id);
    }
    static fadeOutName_SocketResponse(keyID) {
        const key = game.eunoblades.ClockKeys.get(keyID);
        if (!key) {
            return;
        }
        key.fadeOutName_Animation();
    }
    //    #endregion
    // #endregion
    // #region Adding & Removing Clocks ~
    async updateClockIndices() {
        await this.updateTarget("clocksData", Object.fromEntries(Object.entries(this.clocksData)
            .map(([id, data], index) => [id, { ...data, index }])));
        return this.clocks;
    }
    async addClock(clockConfig = {}) {
        // Derive clock data from config
        const clockData = this.parseClockConfig(clockConfig);
        // Write to state
        await this.updateTarget(`clocksData.${clockData.id}`, clockData);
        // Regnerate clocks collection
        void this.clocks;
    }
    async deleteClock(clockID) {
        if (this.size <= 1) {
            throw new Error("[BladesClockKey.deleteClock()] Cannot reduce number of clocks below 1!");
        }
        clockID ??= Array.from(this.clocks).pop()?.id;
        if (!clockID) {
            return;
        }
        await this.getClockByID(clockID)?.delete();
        await this.updateClockIndices();
        // Regnerate clocks collection
        void this.clocks;
    }
}
class BladesClock extends BladesTargetLink {
    // #region STATIC METHODS ~
    static ApplySchemaDefaults(schemaData) {
        const namedValueMax = {
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
        };
    }
    // #endregion
    // #region GETTERS & SETTERS ~
    get canEdit() {
        // return true if user has edit permissions on parent document, and clock is
        // visible and active.
        console.log("NOTE: All Clocks currently Editable; see line 71 of BladesClock.ts");
        return this.isVisible && this.isActive;
    }
    get data() { return this.linkData; }
    get name() { return this.data.name; }
    set name(val) { this.updateTarget("name", val); }
    get value() { return U.pInt(this.data.value); }
    set value(val) { this.updateTarget("value", U.pInt(val)); }
    get max() { return U.pInt(this.data.max); }
    set max(val) { this.updateTarget("max", U.pInt(val)); }
    get color() { return this.data.color ?? ClockColor.white; }
    set color(val) { this.updateTarget("color", val); }
    get isActive() { return U.pBool(this.data.isActive); }
    set isActive(val) { this.updateTarget("isActive", U.pBool(val)); }
    get parentKey() {
        const pKey = game.eunoblades.ClockKeys.get(this.data.parentKeyID);
        if (!pKey) {
            throw new Error(`[BladesClockKey.parentKey] No parent key found for clock ${this.id}`);
        }
        return pKey;
    }
    get isNameVisible() { return U.pBool(this.data.isNameVisible); }
    set isNameVisible(val) { this.updateTarget("isNameVisible", U.pBool(val)); }
    get isVisible() { return U.pBool(this.data.isVisible); }
    set isVisible(val) { this.updateTarget("isVisible", U.pBool(val)); }
    get isHighlighted() { return U.pBool(this.data.isHighlighted); }
    set isHighlighted(val) { this.updateTarget("isHighlighted", U.pBool(val)); }
    get index() { return U.pInt(this.data.index); }
    set index(val) { this.updateTarget("index", U.pInt(val)); }
    get isEmpty() { return this.value === 0; }
    get isComplete() { return this.value >= this.max; }
    get rollOppClock() { return this; }
    get rollOppName() { return this.name; }
    get rollOppType() { return "clock"; }
    get colorSelectOptions() {
        return [
            { value: ClockColor.white, display: "🔘" },
            { value: ClockColor.yellow, display: "📀" },
            { value: ClockColor.cyan, display: "🔵" },
            { value: ClockColor.red, display: "🔴" }
        ];
    }
    get maxSelectOptions() {
        return [
            { value: 2, display: 2 },
            { value: 3, display: 3 },
            { value: 4, display: 4 },
            { value: 5, display: 5 },
            { value: 6, display: 6 },
            { value: 8, display: 8 },
            { value: 10, display: 10 },
            { value: 12, display: 12 }
        ];
    }
    get valueSelectOptions() {
        const returnVals = [];
        for (let i = 0; i <= this.max; i++) {
            returnVals.push({ value: i, display: i });
        }
        return returnVals;
    }
    // #endregion
    // #region HTML INTERACTION ~
    get elem() {
        return $(`#${this.id}`)[0];
    }
    get elem$() {
        return this.elem ? $(this.elem) : undefined;
    }
    get containerElem() {
        return this.elem$?.parents(".clock-container")[0];
    }
    get containerElem$() {
        return this.containerElem ? $(this.containerElem) : undefined;
    }
    async getHTML() {
        return await renderTemplate("systems/eunos-blades/templates/components/clock.hbs", this);
    }
    // Returns which hemisphere of the clock will show the final change if segmentDelta segments are added/removed.
    getActiveSide(segmentDelta = 0) {
        const finalClockValue = Math.min(this.max, Math.max(0, this.value + segmentDelta));
        const halfClockValue = this.max / 2;
        if (finalClockValue > halfClockValue) {
            return "left";
        }
        return "right";
    }
    // #endregion
    // #region ANIMATED UPDATES (Both GM-Only AND Socket Calls)
    //    #region   > TIMELINES ~
    _hoverOverTimeline;
    get hoverOverTimeline() {
        if (!this.elem) {
            return undefined;
        }
        if (!this._hoverOverTimeline) {
            this._hoverOverTimeline = U.gsap.effects.hoverOverClock(this);
        }
        return this._hoverOverTimeline;
    }
    //    #endregion
    // #endregion
    // #region Adding/Removing Clock Segments ~
    // Returns number of segments beyond max (or 0, if max not met)
    async fillSegments(count) {
        // Amount added beyond max:
        const clockOverflow = Math.max(0, this.value + count - this.max);
        // Clamp count to max:
        count = Math.min(this.value + count, this.max) - this.value;
        if (count === 0) {
            return clockOverflow;
        }
        await this.updateTarget("value", this.value + count);
        return clockOverflow;
    }
    // Returns (positive) number of segments removed
    // in excess of the number of segments in the clock
    async clearSegments(count) {
        // Amount removed beyond 0:
        const clockOverflow = Math.max(0, count - this.value);
        // Clamp count to min:
        count = Math.min(this.value, count);
        if (count === 0) {
            return clockOverflow;
        }
        await this.updateTarget("value", this.value - count);
        return clockOverflow;
    }
    async delete() {
        await super.delete();
        this.parentKey?.updateClockIndices();
    }
}
export default BladesClockKey;
export { BladesClock };
