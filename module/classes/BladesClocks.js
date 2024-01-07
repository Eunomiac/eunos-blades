/* eslint-disable @typescript-eslint/no-unused-vars */
import C, { ClockKey_SVGDATA, BladesActorType, BladesItemType, ClockColor, ClockKeyDisplayMode } from "../core/constants.js";
import { Dragger } from "../core/gsap.js";
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
            oneKeyIndex: U.gsap.utils.random(0, 4, 1),
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
            oneKeyIndex = U.gsap.utils.random(0, 4, 1);
            this.updateTarget("oneKeyIndex", oneKeyIndex);
        }
        return oneKeyIndex;
    }
    get sceneIDs() { return this.data.sceneIDs ?? []; }
    get overlayPosition() { return this.data.overlayPosition?.[game.scenes.current.id]; }
    set overlayPosition(val) {
        if (val) {
            this.updateTarget(`overlayPosition.${game.scenes.current.id}`, val);
        }
        else {
            this.updateTarget(`overlayPosition.-=${game.scenes.current.id}`, null);
        }
    }
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
    get isOnDisplay() {
        return this.isInCurrentScene && this.isVisible;
    }
    async addToScene(sceneID = game.scenes.current.id) {
        if (this.isInScene(sceneID)) {
            return;
        }
        const { sceneIDs } = this;
        sceneIDs.push(sceneID);
        await this.updateTarget("sceneIDs", sceneIDs);
    }
    async removeFromScene(sceneID = game.scenes.current.id) {
        if (!this.isInScene(sceneID)) {
            return;
        }
        const { sceneIDs } = this;
        U.remove(sceneIDs, sceneID);
        await this.updateTarget("sceneIDs", sceneIDs);
    }
    async activateClockListeners() {
        if (!this.elem$) {
            return;
        }
        // The ".key-bg" child is actually the correct shape, so that will be our listener object.
        const keyListener$ = this.elem$.find(".key-bg");
        if (!keyListener$[0]) {
            return;
        }
        // Enable pointer events on the key-bg
        keyListener$.css("pointer-events", "auto");
        keyListener$.off();
        // Enable pointer events on each of the clocks
        this.clocks.forEach((clock) => {
            if (!clock.elem$) {
                return;
            }
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
        }
        else {
            // === PLAYER-ONLY LISTENERS ===
            // Add listeners to container for mouseenter and mouseleave, that play and reverse timeline attached to element
            keyListener$.on("mouseenter", () => {
                this.hoverOverTimeline.play();
            }).on("mouseleave", () => {
                U.reverseRepeatingTimeline(this.hoverOverTimeline);
            });
            // Now repeat this for each clock in the clock key
            this.clocks.forEach((clock) => {
                if (!clock.elem) {
                    return;
                }
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
    async renderClockKey(containerElem$, callback) {
        const clockKeyHTML = await renderTemplate("systems/eunos-blades/templates/components/clock-key.hbs", this);
        $(clockKeyHTML).appendTo(containerElem$);
        this.removePositionDragger();
        this.initClockKeyElem();
        this.activateClockListeners();
        this.initOverlayElement(callback);
    }
    initOverlayElement(callback) {
        if (!this.elem$) {
            return;
        }
        this.drop_Animation(callback);
    }
    closeClockKey() {
        this.deleteTimelines();
        this.containerElem$?.remove();
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
    get svgData() {
        if (this.size === 0) {
            throw new Error("[BladesClockKey.svgData] Error size is 0.");
        }
        const keyData = ClockKey_SVGDATA[this.size];
        let path;
        if (this.size === 1 && keyData.paths) {
            path = keyData.paths[this.oneKeyIndex];
        }
        else if (keyData.path) {
            path = keyData.path;
        }
        else {
            throw new Error("[BladesClockKey.svgData] Error path is not defined.");
        }
        return {
            width: keyData.width,
            height: keyData.height,
            path,
            clocks: keyData.clocks
        };
    }
    get keyHeight() { return this.svgData.height; }
    get keyWidth() { return this.svgData.width; }
    get keyViewbox() { return `0 0 ${this.svgData.width} ${this.svgData.height}`; }
    get keyPath() { return this.svgData.path; }
    get clockSize() { return this.svgData.clocks.size; }
    getClockPosition(clockIndex = 0) {
        if (clockIndex > this.size) {
            throw new Error(`[BladesClockKey.getClockPosition] Error clockIndex '${clockIndex}' is greater than key size '${this.size}'.`);
        }
        if (clockIndex < 0) {
            throw new Error(`[BladesClockKey.getClockPosition] Error clockIndex '${clockIndex}' is less than 0.`);
        }
        return this.svgData.clocks[clockIndex];
    }
    initClockKeyElem() {
        if (!this.containerElem$) {
            throw new Error(`[BladesClockKey.initClockKeyElem] Error containerElem$ not found for key '${this.id}'.`);
        }
        if (!this.elem$) {
            throw new Error(`[BladesClockKey.initClockKeyElem] Error elem$ not found for key '${this.id}'.`);
        }
        // If an overlayPosition has been set, apply to the container element:
        if (this.overlayPosition) {
            this.containerElem$.css({
                left: this.overlayPosition.x,
                top: this.overlayPosition.y
            });
        }
        const { keyTweenVars, keyContTweenVars } = this.getVarsForDisplayMode(this.displayMode);
        const keyImgContainer = this.elem$.find(".key-image-container")[0];
        if (!keyImgContainer) {
            throw new Error(`[BladesClockKey.initOverlayElement] Error keyImgContainer not found for key '${this.id}'.`);
        }
        // Initialize key with display mode vars
        U.gsap.set(keyImgContainer, keyContTweenVars);
        U.gsap.set(this.elem$, keyTweenVars);
    }
    _positionDragger;
    spawnPositionDragger(containerElem$ = game.eunoblades.Director.clockKeySection$) {
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
            onDragStart() {
                $(this.target).css("background", "rgba(255, 255, 0, 0.25)");
                $(this.target).css("outlineColor", "rgba(255, 255, 0, 1)");
            },
            onDragEnd() {
                $(this.target).css("background", "rgba(255, 0, 255, 0.25)");
                $(this.target).css("outlineColor", "rgba(255, 0, 255, 1)");
                console.log(`Positioning at {x: ${this.endX}, y: ${this.endY}}`);
                self.overlayPosition = { x: this.endX, y: this.endY };
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
    deleteTimelines() {
        delete this._keySwingTimeline;
        delete this._hoverOverTimeline;
        delete this._nameFadeInTimeline;
    }
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
    _nameFadeInTimeline;
    get nameFadeInTimeline() {
        if (!this.elem) {
            throw new Error("elem is not defined for nameFadeInTimeline");
        }
        if (!$(this.elem).parents("#blades-overlay").length) {
            throw new Error("elem is not a child of #blades-overlay");
        }
        if (!this._nameFadeInTimeline) {
            this._nameFadeInTimeline = U.gsap.timeline()
                .blurReveal(this.labelElem$, {
                ignoreMargin: true,
                duration: 0.75
            })
                .textJitter(this.labelElem$);
        }
        return this._nameFadeInTimeline;
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
    //    #endregion
    //    #region   > SOCKET CALLS: _SocketCall / static _SocketResponse / _Animation
    drop_Animation(callback) {
        // U.gsap.effects.keyDrop(this.elem, {callback});
        // this.keySwingTimeline?.seek(0).play();
        // Construct timeline for revealing clock key
        const tl = U.gsap.timeline({
            callbackScope: this,
            onStart() {
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
        if (!game.user.isGM) {
            return;
        }
        this.renderClockKey(game.eunoblades.Director.clockKeySection$);
        socketlib.system.executeForOthers("drop_SocketCall", this.id);
        this.isVisible = true;
    }
    static drop_SocketResponse(keyID) {
        const key = game.eunoblades.ClockKeys.get(keyID);
        if (!key) {
            return;
        }
        key.renderClockKey(game.eunoblades.Director.clockKeySection$);
    }
    pull_Animation(callback) {
        return U.gsap.timeline({
            callbackScope: this,
            onComplete() {
                this.closeClockKey();
                callback?.();
            }
        })
            .keyPull(this.elem, { callback });
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
        this.pull_Animation();
        socketlib.system.executeForOthers("pull_SocketCall", this.id);
        this.isVisible = false;
    }
    static pull_SocketResponse(keyID) {
        const key = game.eunoblades.ClockKeys.get(keyID);
        if (!key) {
            return;
        }
        key.pull_Animation();
    }
    fadeInName_Animation() {
        if (!this.labelElem$) {
            return undefined;
        }
        if (!this.name) {
            return undefined;
        }
        return this.nameFadeInTimeline.play();
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
        this.isNameVisible = true;
    }
    static fadeInName_SocketResponse(keyID) {
        const key = game.eunoblades.ClockKeys.get(keyID);
        if (!key) {
            return;
        }
        key.fadeInName_Animation();
    }
    fadeOutName_Animation() {
        if (!this.labelElem$) {
            return undefined;
        }
        if (!this.name) {
            return undefined;
        }
        return U.reverseRepeatingTimeline(this.nameFadeInTimeline);
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
        this.isNameVisible = false;
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
    get labelElem() {
        return this.elem$?.find(".clock-label")[0];
    }
    get labelElem$() {
        return this.labelElem ? $(this.labelElem) : undefined;
    }
    get frameElem() {
        return this.elem$?.find(".clock-frame")[0];
    }
    get frameElem$() {
        return this.frameElem ? $(this.frameElem) : undefined;
    }
    get fillElem() {
        return this.elem$?.find(".clock-fill")[0];
    }
    get fillElem$() {
        return this.fillElem ? $(this.fillElem) : undefined;
    }
    get glowElem() {
        return this.elem$?.find(".clock-glow")[0];
    }
    get glowElem$() {
        return this.glowElem ? $(this.glowElem) : undefined;
    }
    get isOnDisplay() {
        return this.parentKey.isOnDisplay && this.isVisible;
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
    _nameFadeInTimeline;
    get nameFadeInTimeline() {
        if (!this.elem) {
            throw new Error("elem is not defined for nameFadeInTimeline");
        }
        if (!$(this.elem).parents("#blades-overlay").length) {
            throw new Error("elem is not a child of #blades-overlay");
        }
        if (!this._nameFadeInTimeline) {
            this._nameFadeInTimeline = U.gsap.timeline({
                callbackScope: this,
                data: {},
                onComplete() {
                    this.nameFadeInTimeline.data.textJitterTimeline = U.gsap.effects.textJitter(this.labelElem$).play();
                },
                onReverseComplete() {
                    this.nameFadeInTimeline.data.textJitterTimeline.kill();
                }
            }).blurReveal(this.labelElem$, {
                ignoreMargin: true,
                duration: 0.75
            }, 0);
        }
        return this._nameFadeInTimeline;
    }
    _highlightTimeline;
    get highlightTimeline() {
        if (!this.glowElem$) {
            throw new Error("glowElem$ is not defined for highlightTimeline");
        }
        if (!this.elem) {
            throw new Error("elem is not defined for nameFadeInTimeline");
        }
        if (!$(this.elem).parents("#blades-overlay").length) {
            throw new Error("elem is not a child of #blades-overlay");
        }
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
    // clock.activate_SocketCall();
    activate_Animation(callback) {
        // U.gsap.effects.keyDrop(this.elem, {callback});
        // this.keySwingTimeline?.seek(0).play();
        // Identify elements for fading in
        const fadeInElements = [
            this.elem$,
            this.frameElem$,
            this.fillElem$
        ].filter((el$) => el$ !== undefined);
        // Construct timeline for activating clock
        const tl = U.gsap.timeline({
            callbackScope: this,
            onComplete() {
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
        if (!game.user.isGM) {
            return;
        }
        this.activate_Animation();
        socketlib.system.executeForOthers("activate_SocketCall", this.parentKey.id, this.index);
        this.isActive = true;
    }
    static activate_SocketResponse(keyID, index) {
        const key = game.eunoblades.ClockKeys.get(keyID);
        if (!key?.isVisible) {
            return;
        }
        key.getClockByIndex(index)?.activate_Animation();
    }
    // clock.deactivate_SocketCall();
    // clock.fadeInClockName_SocketCall();
    // clock.fadeOutClockName_SocketCall();
    // clock.highlight_SocketCall();
    // clock.unhighlight_SocketCall();
    // clock.changeSegments_SocketCall(value)
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
