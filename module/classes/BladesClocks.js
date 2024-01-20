/* eslint-disable @typescript-eslint/no-unused-vars */
import C, { ClockKey_SVGDATA, ClockDisplayContext, BladesActorType, BladesItemType, ClockColor, ClockKeyDisplayMode, ClockKeyUpdateAction } from "../core/constants.js";
import { Dragger } from "../core/gsap.js";
import BladesTargetLink from "./BladesTargetLink.js";
import U from "../core/utilities.js";
import { BladesActor } from "../documents/BladesActorProxy.js";
import { BladesItem } from "../documents/BladesItemProxy.js";
function isElemPosData(obj) {
    if (!U.isList(obj)) {
        return false;
    }
    return typeof obj.x === "number" && typeof obj.y === "number" && typeof obj.width === "number" && typeof obj.height === "number";
}
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
        await clockKey.updateTarget("clocksData", clocksData, ClockKeyUpdateAction.RenderAll);
        return clockKey;
    }
    static GetFromElement(elem) {
        const keyElem$ = $(elem).closest(".clock-key-container").find(".clock-key");
        if (keyElem$.length === 0) {
            return undefined;
        }
        const clockKeyID = keyElem$.attr("id");
        if (!clockKeyID) {
            return undefined;
        }
        return game.eunoblades.ClockKeys.get(clockKeyID);
    }
    // #endregion
    // #region GETTERS & SETTERS ~
    // #region -- Shortcut Schema Getters ~
    get data() { return this.linkData; }
    get name() { return this.data.name; }
    set name(val) { this.updateTarget("name", val, ClockKeyUpdateAction.RenderAll); }
    get isVisible() { return this.data.isVisible; }
    set isVisible(val) { this.updateTarget("isVisible", U.pBool(val), ClockKeyUpdateAction.RenderAll); }
    get isNameVisible() { return this.data.isNameVisible; }
    set isNameVisible(val) { this.updateTarget("isNameVisible", U.pBool(val), ClockKeyUpdateAction.RenderAll); }
    get isSpotlit() { return this.data.isSpotlit; }
    set isSpotlit(val) { this.updateTarget("isSpotlit", val, ClockKeyUpdateAction.RenderAll); }
    get clocksData() { return this.data.clocksData; }
    get displayMode() { return this.data.displayMode; }
    get oneKeyIndex() {
        let { oneKeyIndex } = this.data;
        if (!oneKeyIndex) {
            oneKeyIndex = U.gsap.utils.random(0, 4, 1);
            this.updateTarget("oneKeyIndex", oneKeyIndex, ClockKeyUpdateAction.RenderAll);
        }
        return oneKeyIndex;
    }
    get sceneIDs() { return this.data.sceneIDs ?? []; }
    get overlayPosition() { return this.data.overlayPosition?.[game.scenes.current.id]; }
    set overlayPosition(val) {
        if (val) {
            this.updateTarget(`overlayPosition.${game.scenes.current.id}`, val, ClockKeyUpdateAction.RenderNone);
        }
        else {
            this.updateTarget(`overlayPosition.-=${game.scenes.current.id}`, null, ClockKeyUpdateAction.RenderNone);
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
    get isClockKeeperKey() {
        return this.target.type === BladesItemType.clock_keeper;
    }
    get isFactionKey() {
        return this.target.type === BladesActorType.faction;
    }
    get isProjectKey() {
        return this.target.type === BladesItemType.project;
    }
    get isScoreKey() {
        return this.target.type === BladesItemType.score;
    }
    get visibleClocks() {
        return this.clocks.filter((clock) => clock.isVisible);
    }
    get activeClocks() {
        return this.visibleClocks.filter((clock) => clock.isActive);
    }
    get inProgressClocks() {
        return this.visibleClocks.filter((clock) => !clock.isComplete && clock.value > 0);
    }
    get unstartedClocks() {
        return this.visibleClocks.filter((clock) => clock.value === 0);
    }
    get completedClocks() {
        return this.visibleClocks.filter((clock) => clock.isComplete);
    }
    get currentClock() {
        // If there are visible, active clocks that are not complete, return the earliest (by index property)
        //    active clock that is not complete.
        if (this.activeClocks.length > 0) {
            return this.getEarliestClock(this.activeClocks);
        }
        // Otherwise, if there are any visible, completed clocks, return the latest visible, completed clock
        if (this.completedClocks.length > 0) {
            return this.getLatestClock(this.completedClocks);
        }
        // Otherwise, if there are any visible clocks, return the earliest visible clock.
        if (this.visibleClocks.length > 0) {
            return this.getEarliestClock(this.visibleClocks);
        }
        // Finally, if all clocks are hidden, return the clock at index 0
        return this.getEarliestClock(Array.from(this.clocks));
    }
    get fullDisplayPosData() {
        const x = this.svgData.width / 2;
        const y = this.svgData.height / 2;
        return {
            x, y, width: this.svgData.width, height: this.svgData.height
        };
    }
    get clocksDisplayPosData() {
        return this.getClocksBoundingBox(Array.from(this.clocks));
    }
    get visibleClocksDisplayPosData() {
        return this.getClocksBoundingBox(this.visibleClocks);
    }
    get activeClocksDisplayPosData() {
        return this.getClocksBoundingBox(this.activeClocks);
    }
    getClocksBoundingBox(clocks) {
        const { size, ...allClocksPosData } = this.svgData.clocks;
        // Filter 'allClocksPosData' to include only those entries with index properties of elements in 'clocks'
        const clocksPosData = Object.fromEntries(Object.entries(allClocksPosData)
            .filter(([index]) => clocks.map((clock) => clock.index).includes(U.pInt(index)))
            .map(([index, posData]) => [U.pInt(index), posData]));
        // Sort the values of clocksPosData by their positions
        const clockWidthPosData = Object.values(clocksPosData).sort((a, b) => a.x - b.x);
        const clockHeightPosData = Object.values(clocksPosData).sort((a, b) => a.y - b.y);
        // Get the highest and lowest values for each set of positions
        const xLowest = clockWidthPosData[0].x;
        const xHighest = clockWidthPosData[clockWidthPosData.length - 1].x;
        const yLowest = clockHeightPosData[0].y;
        const yHighest = clockHeightPosData[clockHeightPosData.length - 1].y;
        return {
            // Determine the center point in both x and y axes
            x: (xLowest + xHighest) / 2,
            y: (yLowest + yHighest) / 2,
            // Determine height and width of bounding box, accounting for clock size
            width: xHighest - xLowest + size,
            height: yHighest - yLowest + size
        };
    }
    /** This function accepts any number of arrays of BladesClock, then returns an array
     * containing those BladesClock instances that appear in ALL provided arrays.
     */
    getClocksIn(...clockArrays) {
        if (clockArrays.length === 0)
            return [];
        return clockArrays.reduce((acc, currentArray) => {
            return acc.filter((clock) => currentArray.includes(clock));
        });
    }
    /** This function accepts an array of BladesClock, and returns the BladesClock
     * instance with the lowest index property.
     */
    getEarliestClock(clockArray) {
        if (clockArray.length) {
            return clockArray.sort((a, b) => a.index - b.index)[0];
        }
        return undefined;
    }
    /** This function accepts an array of BladesClock, and returns the BladesClock
     * instance with the highest index property.
     */
    getLatestClock(clockArray) {
        if (clockArray.length) {
            return clockArray.sort((a, b) => b.index - a.index)[0];
        }
        return undefined;
    }
    isInScene(sceneID = game.scenes.current.id) {
        return this.sceneIDs.includes(sceneID);
    }
    get isInCurrentScene() {
        return this.isInScene(game.scenes.current.id);
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
    // #region Get Elements$ ~
    getElemFromDisplayContext(displayContext) {
        let elem$;
        const DOM$ = $(".vtt.game.system-eunos-blades");
        switch (displayContext) {
            case ClockDisplayContext.overlay: {
                elem$ = DOM$.find(`#blades-overlay #${this.id}`);
                break;
            }
            case ClockDisplayContext.pcSheet: {
                elem$ = DOM$.find(`.actor.sheet .pc #${this.id}`);
                break;
            }
            case ClockDisplayContext.factionSheet: {
                elem$ = DOM$.find(`.actor.sheet .faction #${this.id}`);
                break;
            }
            case ClockDisplayContext.projectSheet: {
                elem$ = DOM$.find(`.item.sheet .project #${this.id}`);
                break;
            }
            case ClockDisplayContext.scoreSheet: {
                elem$ = DOM$.find(`.item.sheet .score #${this.id}`);
                break;
            }
            case ClockDisplayContext.rollCollab: {
                elem$ = DOM$.find(`.roll-collab-sheet #${this.id}`);
                break;
            }
            case ClockDisplayContext.chatMessage: {
                elem$ = DOM$.find(`#chat #${this.id}`);
                break;
            }
        }
        if (!elem$.length) {
            throw new Error(`[BladesClockKey.getElemFromDisplayContext] Error elem$ not found for key '${this.id}' for display context '${displayContext}'.`);
        }
        return elem$;
    }
    getElements$(displayContext) {
        let elem$;
        if (typeof displayContext === "string") {
            displayContext = this.getElemFromDisplayContext(displayContext);
        }
        elem$ = $(displayContext).find(`#${this.id}`);
        if (!elem$.length) {
            elem$ = $(displayContext).closest(`#${this.id}`);
        }
        if (!elem$?.length) {
            throw new Error(`[BladesClockKey.getElements$] Cannot find elements for display context '${displayContext}' of clockKey '${this.id}'.`);
        }
        // Using elem$ as a reference, locate relevant clock key elements and return them in a dictionary.
        const keyElems$ = {
            elem$
        };
        // Get elements that will be there regardless of context, throwing errors if not found.
        // const container$ = elem$.closest(".clock-key-container");
        if (!elem$.length) {
            throw new Error(`[BladesClockKey.renderClockKey] Error '.clock-key-container' not found for key '${this.id}'.`);
        }
        keyElems$.container$ = elem$.closest(".clock-key-container");
        const imgContainer$ = elem$.find(".key-image-container");
        if (!imgContainer$.length) {
            throw new Error(`[BladesClockKey.renderClockKey] Error '.key-image-container' not found for key '${this.id}'.`);
        }
        keyElems$.imgContainer$ = imgContainer$;
        const label$ = elem$.find(".key-label");
        if (!label$.length) {
            throw new Error(`[BladesClockKey.renderClockKey] Error label$ not found for key '${this.id}'.`);
        }
        keyElems$.label$ = label$;
        // Check for optional elements and silently exclude them from dictionary if not found.
        const factionLabel$ = elem$.find(".faction-label");
        if (factionLabel$.length) {
            keyElems$.factionLabel$ = factionLabel$;
        }
        const projectLabel$ = elem$.find(".project-label");
        if (projectLabel$.length) {
            keyElems$.projectLabel$ = projectLabel$;
        }
        const scoreLabel$ = elem$.find(".score-label");
        if (scoreLabel$.length) {
            keyElems$.scoreLabel$ = scoreLabel$;
        }
        // Register each clock under its id, retrieving the elements for each.
        this.clocks.forEach((clock) => {
            keyElems$.clocks ??= {};
            keyElems$.clocks[clock.id] = clock.getElements$(displayContext);
        });
        eLog.checkLog3("BladesClockKey", "Clock Key Elements", keyElems$);
        return keyElems$;
    }
    // #endregion
    // #region Initial Rendering ~
    async renderTo(parentElem) {
        const parent$ = $(parentElem);
        if (!parent$.length) {
            throw new Error(`[BladesClockKey.renderClockKeyTo] Error parent element not provided for key '${this.id}'.`);
        }
        // Render clock key template and append it to parent element
        const clockKeyHTML = await renderTemplate("systems/eunos-blades/templates/components/clock-key.hbs", this);
        $(clockKeyHTML).appendTo(parent$);
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
     * @param {HTMLElement | JQuery<HTMLElement> | {x: number, y: number, width: number, height: number}} [container$] - The container within which the key will be displayed.
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
    getVarsForDisplayMode(keyElems$, displayMode = ClockKeyDisplayMode.full, container$) {
        const keyTweenVars = {};
        const keyImgContTweenVars = {};
        container$ ??= keyElems$.container$;
        // === TARGET CONTAINER ELEMENT ===
        // container$ refers to the element that the desired clocks will be made to fit within, and can be either an
        //   HTMLElement (or JQuery reference to such), or an Element Position object ({x, y, height, width}).
        // We first convert any HTMLElements or JQuery<HTMLElement>s to an Element Position object:
        let targetPosData;
        if (container$ instanceof HTMLElement || container$ instanceof jQuery) {
            const containerPosData = U.gsap.getProperty($(container$)[0]);
            targetPosData = {
                x: containerPosData("x"),
                y: containerPosData("y"),
                width: containerPosData("width"),
                height: containerPosData("height")
            };
        }
        else if (isElemPosData(container$)) {
            targetPosData = container$;
        }
        else {
            throw new Error(`[BladesClockKey.getVarsForDisplayMode] Error container$ '${container$}' is not a valid type.`);
        }
        // === TARGET FOCUS AREA ===
        // The focus area is the area of the key that we want to display in the container.
        // This area is determined by the display mode, and may be the full key, the clocks, the active clocks, or a single clock.
        // We will use this area to determine the scale and position of the key within the container.
        let presentingClock;
        let focusPosData;
        switch (displayMode) {
            case ClockKeyDisplayMode.full: {
                focusPosData = {
                    x: this.svgData.width / 2,
                    y: this.svgData.height / 2,
                    width: this.svgData.width,
                    height: this.svgData.height
                };
                break;
            }
            case ClockKeyDisplayMode.clocks: {
                focusPosData = this.getClocksBoundingBox(Array.from(this.clocks));
                break;
            }
            case ClockKeyDisplayMode.activeClocks: {
                focusPosData = this.getClocksBoundingBox(this.getClocksIn(this.activeClocks, this.visibleClocks));
                break;
            }
            case ClockKeyDisplayMode.presentCurrentClock: {
                presentingClock = this.currentClock;
                displayMode = presentingClock.index;
            }
            // falls through
            default: {
                if (typeof displayMode === "string" && displayMode.startsWith("present")) {
                    displayMode = U.pInt(displayMode.toString().slice(7));
                    presentingClock = this.getClockByIndex(displayMode);
                }
                // Confirm that displayMode is an integer between 0 and this.size
                if (!U.isInt(displayMode) || displayMode < 0 || displayMode >= this.size) {
                    throw new Error(`[BladesClockKey.getVarsForDisplayMode] Error display mode '${displayMode}' is not a valid clock index for key '${this.id}'.`);
                }
                // Set focusPosData to the center of the clock, with width and height equal to size
                const focusClockData = this.svgData.clocks[displayMode];
                focusPosData = {
                    x: focusClockData.x,
                    y: focusClockData.y,
                    width: this.svgData.clocks.size,
                    height: this.svgData.clocks.size
                };
                break;
            }
        }
        // === FIT FOCUS AREA INSIDE TARGET CONTAINER ===
        // Determine scale factor necessary to fit focusArea inside keyContainer
        keyTweenVars.scale = Math.min(targetPosData.height / focusPosData.height, targetPosData.width / focusPosData.width);
        // Determine top and left values for key-image-container, accounting for x/yPercent -50
        keyImgContTweenVars.top = (0.5 * C.ClockKeySquareSize) - focusPosData.y;
        keyImgContTweenVars.left = (0.5 * C.ClockKeySquareSize) - focusPosData.x;
        // Set transfer origin of key-image-container to same position, for further animation
        keyImgContTweenVars.transformOrigin = `${focusPosData.x}px ${focusPosData.y}px`;
        // Initialize rotation of key to 0
        keyImgContTweenVars.rotateY = 0;
        // If 'isPresenting',
        // ... rotate clock slightly towards camera
        // ... increase scale of key
        // ... shift key image container horizontally
        if (presentingClock) {
            keyTweenVars.scale *= 2;
            if (presentingClock.getActiveSide() === "left") {
                keyImgContTweenVars.rotateY = 30;
                keyImgContTweenVars.left += this.size === 1 ? 45 : 25;
            }
            else if (presentingClock.getActiveSide() === "right") {
                keyImgContTweenVars.rotateY = -30;
                keyImgContTweenVars.left -= this.size === 1 ? 45 : 25;
            }
        }
        return { keyTweenVars, keyImgContTweenVars };
    }
    // public fitKeyToContainer(
    //   keyElems$: ClockKeyElems$,
    //   posOverrides?: Partial<ElemPosData & {
    //     xShift: number,
    //     yShift: number,
    //     scaleMult: number
    //   }>
    // ) {
    //   const {container$, elem$, imgContainer$} = keyElems$;
    //   // Get position data for the container$ element (x, y, width, height)
    //   const keyPosition: ElemPosData = {
    //     x: U.gsap.getProperty(container$[0], "x") as number,
    //     y: U.gsap.getProperty(container$[0], "y") as number,
    //     width: U.gsap.getProperty(container$[0], "width") as number,
    //     height: U.gsap.getProperty(container$[0], "height") as number
    //   };
    //   const {xShift, yShift, scaleMult, ...focusPosOverrides} = posOverrides ?? {};
    //   const focusPosition: ElemPosData = {
    //     ...this.fullDisplayPosData,
    //     ...focusPosOverrides
    //   };
    //   eLog.checkLog3("BladesClockKey", "[BladesClockKey] Key Positions", {
    //     keyPosition,
    //     focusPosition,
    //     widthScale: keyPosition.width / focusPosition.width,
    //     heightScale: keyPosition.height / focusPosition.height
    //   });
    //   // Apply scale factor to elem$ to fit default key position inside container$
    //   U.gsap.set(elem$, {
    //     scale: Math.min(
    //       keyPosition.width / focusPosition.width,
    //       keyPosition.height / focusPosition.height
    //     ) * (scaleMult ?? 1)
    //   });
    //   // Apply top, left and transformOrigin value to keyImgContainer, accounting for x/yPercent -50
    //   U.gsap.set(imgContainer$, {
    //     top: (0.5 * C.ClockKeySquareSize) - focusPosition.y + (yShift ?? 0),
    //     left: (0.5 * C.ClockKeySquareSize) - focusPosition.x + (xShift ?? 0),
    //     transformOrigin: `${focusPosition.x + (xShift ?? 0)}px ${focusPosition.y + (yShift ?? 0)}px`
    //   });
    // }
    formatLabels(keyElems$) {
        const { label$, clocks, factionLabel$, projectLabel$, scoreLabel$ } = keyElems$;
        // Collect relevant label elements, desired aspect ratio, and maximum line count, then apply adjustments to the label container for a pleasing aspect ratio
        [
            [label$, 2, 4],
            factionLabel$ ? [factionLabel$, 2, 2] : undefined,
            projectLabel$ ? [projectLabel$, 2, 2] : undefined,
            scoreLabel$ ? [scoreLabel$, 2, 2] : undefined,
            ...this.clocks.map((clock) => [clocks[clock.id].clockLabel$, 2.5, 3])
        ].filter(Boolean).forEach(([labelElem$, aspectRatio, maxLines]) => {
            U.adjustTextContainerAspectRatio(labelElem$, aspectRatio, maxLines);
        });
    }
    setToDisplayMode(keyElems$, displayMode, isUpdatingTarget = true) {
        const { keyTweenVars, keyImgContTweenVars } = this.getVarsForDisplayMode(keyElems$, displayMode);
        U.gsap.set(keyElems$.elem$, keyTweenVars);
        U.gsap.set(keyElems$.imgContainer$, keyImgContTweenVars);
        if (isUpdatingTarget && displayMode !== this.displayMode) {
            this.updateTarget("displayMode", displayMode, ClockKeyUpdateAction.RenderNone);
        }
    }
    initElementsInContext(html, displayMode, isUpdatingTarget = true) {
        const keyElems$ = this.getElements$(html);
        displayMode ??= this.displayMode;
        this.setToDisplayMode(keyElems$, displayMode, isUpdatingTarget);
        this.formatLabels(keyElems$);
        // If displayMode starts with 'present' or is an integer, fade out all label elements
        if (displayMode.toString().startsWith("present") || Number.isInteger(displayMode)) {
            U.gsap.to(keyElems$.container$.find(".clock-label, .clock-key-label"), { autoAlpha: 0, duration: 0 });
        }
        return keyElems$;
    }
    // #endregion
    async addToScene(sceneID = game.scenes.current.id) {
        if (this.isInScene(sceneID)) {
            return;
        }
        const { sceneIDs } = this;
        sceneIDs.push(sceneID);
        await this.updateTarget("isVisible", false, ClockKeyUpdateAction.RenderNone);
        await this.updateTarget("sceneIDs", sceneIDs, ClockKeyUpdateAction.RenderAll);
    }
    async removeFromScene(sceneID = game.scenes.current.id) {
        if (!this.isInScene(sceneID)) {
            return;
        }
        const { sceneIDs } = this;
        U.remove(sceneIDs, sceneID);
        await this.updateTarget("sceneIDs", sceneIDs, ClockKeyUpdateAction.RenderAll);
    }
    closeClockKey({ container$ }) {
        container$.remove();
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
    isInOverlay(elem) {
        return $(elem).hasClass(".overlay-section") || $(elem).closest(".overlay-section").length > 0;
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
    positionDragger;
    removePositionDragger() {
        this.positionDragger?.target.remove();
        this.positionDragger?.kill();
        delete this.positionDragger;
    }
    spawnPositionDragger(containerElem$ = game.eunoblades.Director.clockKeySection$) {
        const self = this;
        if (this.positionDragger) {
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
        this.positionDragger = new Dragger(dragElem$, {
            type: "top,left",
            onDragStart() {
                $(this.target).css("background", "rgba(255, 255, 0, 0.25)");
                $(this.target).css("outlineColor", "rgba(255, 255, 0, 1)");
            },
            onDragEnd() {
                $(this.target).css("background", "rgba(255, 0, 255, 0.25)");
                $(this.target).css("outlineColor", "rgba(255, 0, 255, 1)");
                self.overlayPosition = { x: this.endX, y: this.endY };
            }
        });
    }
    switchToMode(keyElems$, displayMode, extendKeyVars = {}, extendKeyContainerVars = {}, isUpdatingTarget = true, callback) {
        const { elem$, imgContainer$ } = keyElems$;
        const { keyTweenVars, keyImgContTweenVars } = this.getVarsForDisplayMode(keyElems$, displayMode);
        const currentDisplayMode = this.displayMode;
        const randomID = U.gsap.utils.random(1, 1000, 1);
        return U.gsap.timeline({
            callbackScope: this,
            paused: true,
            onStart() {
                eLog.checkLog2("BladesClockKey", `switchToMode #${randomID} - START`, { key: this, keyElems$, displayMode });
            },
            onComplete() {
                eLog.checkLog3("BladesClockKey", `switchToMode #${randomID} - COMPLETE`, { key: this, keyElems$, displayMode });
                if (isUpdatingTarget && displayMode !== this.currentDisplayMode) {
                    this.updateTarget("displayMode", displayMode, ClockKeyUpdateAction.RenderNone)
                        .then(() => callback?.());
                }
                else {
                    callback?.();
                }
            },
            onReverseComplete() {
                eLog.checkLog3("BladesClockKey", `switchToMode #${randomID} - REVERSE COMPLETE`, { key: this, keyElems$, displayMode });
                if (isUpdatingTarget) {
                    this.updateTarget("displayMode", currentDisplayMode, ClockKeyUpdateAction.RenderNone);
                }
            }
        })
            .to(elem$, { ...keyTweenVars, ...extendKeyVars }, 0)
            .to(imgContainer$, { ...keyImgContTweenVars, ...extendKeyContainerVars }, 0);
    }
    // #endregion
    // #region ANIMATED UPDATES (Both GM-Only AND Socket Calls)
    //    #region   > SOCKET CALLS: _SocketCall / static _SocketResponse / _Animation
    fadeInName_Animation(keyElems$) {
        if (!this.name) {
            return undefined;
        }
        return U.gsap.effects.blurReveal(keyElems$.label$, {
            ignoreMargin: true,
            duration: 0.75
        });
    }
    async fadeInName_SocketCall(displayContext) {
        if (!game.user.isGM) {
            return;
        }
        socketlib.system.executeForEveryone("fadeInName_SocketCall", displayContext, this.id);
    }
    static fadeInName_SocketResponse(displayContext, keyID) {
        const key = game.eunoblades.ClockKeys.get(keyID);
        if (!key) {
            return;
        }
        key.fadeInName_Animation(key.getElements$(displayContext));
    }
    fadeOutName_Animation(keyElems$) {
        if (!this.name) {
            return undefined;
        }
        return U.gsap.effects.blurRemove(keyElems$.label$, {
            ignoreMargin: true,
            duration: 0.75
        });
    }
    async fadeOutName_SocketCall(displayContext) {
        if (!game.user.isGM) {
            return;
        }
        this.fadeOutName_Animation(this.getElements$(displayContext));
        socketlib.system.executeForOthers("fadeOutName_SocketCall", displayContext, this.id);
    }
    static fadeOutName_SocketResponse(displayContext, keyID) {
        const key = game.eunoblades.ClockKeys.get(keyID);
        if (!key) {
            return;
        }
        key.fadeOutName_Animation(key.getElements$(displayContext));
    }
    //    #endregion
    // #endregion
    // #region Adding & Removing Clocks ~
    async updateClockIndices() {
        await this.updateTarget("clocksData", Object.fromEntries(Object.entries(this.clocksData)
            .map(([id, data], index) => [id, { ...data, index }])), ClockKeyUpdateAction.RenderNone);
        return this.clocks;
    }
    async addClock(clockConfig = {}) {
        // Derive clock data from config
        const clockData = this.parseClockConfig(clockConfig);
        // Write to state
        await this.updateTarget(`clocksData.${clockData.id}`, clockData, ClockKeyUpdateAction.RenderAll);
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
        // Regenerate clocks collection
        void this.clocks;
    }
    // #endregion
    // #region OVERRIDES: Async Update Methods
    async delete() {
        game.eunoblades.ClockKeys.delete(this.id);
        return super.delete();
    }
    postUpdateRender(postUpdateAction) {
        if (postUpdateAction === ClockKeyUpdateAction.RenderNone || postUpdateAction === false) {
            return;
        }
        this.target.sheet?.render();
        if (postUpdateAction === ClockKeyUpdateAction.RenderAll) {
            game.eunoblades.ClockKeeper.sheet?.render();
        }
    }
    async updateTarget(prop, val, postUpdateAction = false) {
        await super.updateTarget(prop, val, true);
        this.postUpdateRender(postUpdateAction);
    }
    async updateTargetData(val, postUpdateAction = false) {
        await super.updateTargetData(val, true);
        this.postUpdateRender(postUpdateAction);
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
            isVisible: !U.isInt(schemaData.index) || schemaData.index === 0,
            isNameVisible: false,
            isHighlighted: false,
            isActive: !U.isInt(schemaData.index) || schemaData.index === 0,
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
    set name(val) { this.updateTarget("name", val, ClockKeyUpdateAction.RenderAll); }
    get value() { return U.pInt(this.data.value); }
    set value(val) { this.updateTarget("value", U.pInt(val), ClockKeyUpdateAction.RenderAll); }
    get max() { return U.pInt(this.data.max); }
    set max(val) { this.updateTarget("max", U.pInt(val), ClockKeyUpdateAction.RenderAll); }
    get color() { return this.data.color ?? ClockColor.white; }
    set color(val) { this.updateTarget("color", val, ClockKeyUpdateAction.RenderAll); }
    get isActive() { return U.pBool(this.data.isActive); }
    set isActive(val) { this.updateTarget("isActive", U.pBool(val), ClockKeyUpdateAction.RenderAll); }
    get parentKey() {
        const pKey = game.eunoblades.ClockKeys.get(this.data.parentKeyID);
        if (!pKey) {
            throw new Error(`[BladesClockKey.parentKey] No parent key found for clock ${this.id}`);
        }
        return pKey;
    }
    get isNameVisible() { return U.pBool(this.data.isNameVisible); }
    set isNameVisible(val) { this.updateTarget("isNameVisible", U.pBool(val), ClockKeyUpdateAction.RenderAll); }
    get isVisible() { return U.pBool(this.data.isVisible); }
    set isVisible(val) { this.updateTarget("isVisible", U.pBool(val), ClockKeyUpdateAction.RenderAll); }
    get isHighlighted() { return U.pBool(this.data.isHighlighted); }
    set isHighlighted(val) { this.updateTarget("isHighlighted", U.pBool(val), ClockKeyUpdateAction.RenderAll); }
    get index() { return U.pInt(this.data.index); }
    set index(val) { this.updateTarget("index", U.pInt(val), ClockKeyUpdateAction.RenderAll); }
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
    // Returns which hemisphere of the clock will show the final change if segmentDelta segments are added/removed.
    getActiveSide(segmentDelta = 0) {
        const finalClockValue = Math.min(this.max, Math.max(0, this.value + segmentDelta));
        const halfClockValue = this.max / 2;
        if (segmentDelta === 0) {
            return finalClockValue >= halfClockValue
                ? "left"
                : "right";
        }
        return finalClockValue > halfClockValue
            ? "left"
            : "right";
    }
    // #endregion
    // #region HTML INTERACTION ~
    getElemFromDisplayContext(displayContext) {
        let elem$;
        const DOM$ = $(".vtt.game.system-eunos-blades");
        switch (displayContext) {
            case ClockDisplayContext.overlay: {
                elem$ = DOM$.find(`#blades-overlay #${this.id}`);
                break;
            }
            case ClockDisplayContext.pcSheet: {
                elem$ = DOM$.find(`.actor.sheet .pc #${this.id}`);
                break;
            }
            case ClockDisplayContext.factionSheet: {
                elem$ = DOM$.find(`.actor.sheet .faction #${this.id}`);
                break;
            }
            case ClockDisplayContext.projectSheet: {
                elem$ = DOM$.find(`.item.sheet .project #${this.id}`);
                break;
            }
            case ClockDisplayContext.scoreSheet: {
                elem$ = DOM$.find(`.item.sheet .score #${this.id}`);
                break;
            }
            case ClockDisplayContext.rollCollab: {
                elem$ = DOM$.find(`.roll-collab-sheet #${this.id}`);
                break;
            }
            case ClockDisplayContext.chatMessage: {
                elem$ = DOM$.find(`#chat #${this.id}`);
                break;
            }
        }
        if (!elem$.length) {
            throw new Error(`[BladesClockKey.getElemFromDisplayContext] Error elem$ not found for key '${this.id}' for display context '${displayContext}'.`);
        }
        return elem$;
    }
    getElements$(displayContext) {
        let elem$;
        if (typeof displayContext === "string") {
            displayContext = this.getElemFromDisplayContext(displayContext);
        }
        elem$ = $(displayContext).find(`#${this.id}`);
        if (!elem$.length) {
            elem$ = $(displayContext).closest(`#${this.id}`);
        }
        if (!elem$?.length) {
            throw new Error(`[BladesClock.getElements$] Cannot find elements for display context '${displayContext}' of clock '${this.id}' of key '${this.parentKey.id}'.`);
        }
        // Using elem$ as a reference, locate relevant clock elements and return them in a dictionary.
        const clockElems$ = {
            clockElem$: elem$
        };
        // Get elements that will be there regardless of context, throwing errors if not found.
        const container$ = elem$.closest(".clock-container");
        if (!container$.length) {
            throw new Error(`[BladesClock.getElements$] Error '.clock-container' not found for clock '${this.id}' of key '${this.parentKey.id}'.`);
        }
        clockElems$.clockContainer$ = container$;
        const label$ = elem$.find(".clock-label");
        if (!label$.length) {
            throw new Error(`[BladesClock.getElements$] Error '.clock-label' not found for clock '${this.id}' of key '${this.parentKey.id}'.`);
        }
        clockElems$.clockLabel$ = label$;
        const bg$ = elem$.find(".clock-bg");
        if (!bg$.length) {
            throw new Error(`[BladesClock.getElements$] Error '.clock-bg' not found for clock '${this.id}' of key '${this.parentKey.id}'.`);
        }
        clockElems$.bg$ = bg$;
        const frame$ = elem$.find(".clock-frame");
        if (!frame$.length) {
            throw new Error(`[BladesClock.getElements$] Error '.clock-frame' not found for clock '${this.id}' of key '${this.parentKey.id}'.`);
        }
        clockElems$.frame$ = frame$;
        const fill$ = elem$.find(".clock-fill");
        if (!fill$.length) {
            throw new Error(`[BladesClock.getElements$] Error '.clock-fill' not found for clock '${this.id}' of key '${this.parentKey.id}'.`);
        }
        clockElems$.fill$ = fill$;
        const glow$ = elem$.find(".clock-glow");
        if (!glow$.length) {
            throw new Error(`[BladesClock.getElements$] Error '.clock-glow' not found for clock '${this.id}' of key '${this.parentKey.id}'.`);
        }
        clockElems$.glow$ = glow$;
        const cover$ = elem$.find(".clock-cover");
        if (!cover$.length) {
            throw new Error(`[BladesClock.getElements$] Error '.clock-cover' not found for clock '${this.id}' of key '${this.parentKey.id}'.`);
        }
        clockElems$.cover$ = cover$;
        const oneSegments$ = elem$.find(".clock-one-segment");
        if (oneSegments$.length !== 3) {
            throw new Error(`[BladesClock.getElements$] Error '.clock-one-segment' elements not found for clock '${this.id}' of key '${this.parentKey.id}'.`);
        }
        clockElems$.oneSegments$ = oneSegments$;
        return clockElems$;
    }
    // #endregion
    // #region ANIMATED UPDATES (Both GM-Only AND Socket Calls)
    reveal_Animation(clockElems$, callback) {
        // Identify elements for fading in
        const fadeInElements = [
            clockElems$.frame$,
            clockElems$.fill$
        ].filter((el$) => el$ !== undefined);
        // Construct timeline for revealing clock
        const tl = U.gsap.timeline({
            callbackScope: this,
            onComplete() {
                callback?.();
            }
        });
        // Fade out cover hiding clock
        tl.to(clockElems$.cover$, { scale: 2, autoAlpha: 0, duration: 0.5, ease: "power2" });
        // Fade in clock elements
        tl.fromTo(fadeInElements, {
            autoAlpha: 0,
            scale: 2
        }, {
            autoAlpha: 1,
            scale: 1,
            duration: 0.5,
            stagger: 0.2,
            ease: "power2"
        });
        // Fade in name, if name is visible.
        if (this.name && this.isNameVisible) {
            tl.blurReveal(clockElems$.clockLabel$, {
                ignoreMargin: true,
                duration: 0.75
            }, "<+0.05");
        }
        // Fade in glow, if highlighted
        if (this.isHighlighted) {
            tl.scaleUpReveal(clockElems$.glow$, {
                scale: 3,
                duration: 0.5
            }, "<+0.05");
        }
        if (this.isActive) {
            tl.add(() => this.activate_Animation(clockElems$), "<+0.05");
        }
        else {
            tl.add(() => this.deactivate_Animation(clockElems$), "<+0.05");
        }
        return tl;
    }
    async reveal_SocketCall(displayContext) {
        if (!game.user.isGM) {
            return;
        }
        socketlib.system.executeForEveryone("reveal_SocketCall", displayContext, this.parentKey.id, this.index);
    }
    static reveal_SocketResponse(displayContext, keyID, index) {
        const key = game.eunoblades.ClockKeys.get(keyID);
        if (!key?.isVisible) {
            return;
        }
        const clock = key.getClockByIndex(index);
        if (!clock) {
            return;
        }
        const clockElems$ = clock.getElements$(displayContext);
        clock.reveal_Animation(clockElems$);
    }
    hide_Animation(clockElems$, callback) {
        // Identify elements for fading out
        const fadeOutElements = [
            clockElems$.frame$,
            clockElems$.fill$
        ].filter((el$) => el$ !== undefined);
        // Construct timeline for hiding clock
        const tl = U.gsap.timeline({
            callbackScope: this,
            onComplete() {
                callback?.();
            }
        });
        // Fade out clock elements
        tl.to(fadeOutElements, {
            autoAlpha: 0,
            scale: 2,
            duration: 0.5,
            stagger: 0.2,
            ease: "power2"
        });
        // Fade out name, if name visible
        if (this.name && this.isNameVisible) {
            tl.blurRemove(clockElems$.clockLabel$, {
                ignoreMargin: true,
                duration: 0.75
            }, "<+0.05");
        }
        // Fade out glow, if highlighted
        if (this.isHighlighted) {
            tl.scaleDownRemove(clockElems$.glow$, {
                scale: 3,
                duration: 0.5
            }, "<+0.05");
        }
        // Fade in cover element
        tl.to(clockElems$.cover$, { scale: 1, autoAlpha: 1, duration: 0.5, ease: "power2" });
        return tl;
    }
    async hide_SocketCall(displayContext) {
        if (!game.user.isGM) {
            return;
        }
        socketlib.system.executeForEveryone("hide_SocketCall", displayContext, this.parentKey.id, this.index);
    }
    static hide_SocketResponse(displayContext, keyID, index) {
        const key = game.eunoblades.ClockKeys.get(keyID);
        if (!key?.isVisible) {
            return;
        }
        const clock = key.getClockByIndex(index);
        if (!clock) {
            return;
        }
        const clockElems$ = clock.getElements$(displayContext);
        clock.hide_Animation(clockElems$);
    }
    activate_Animation(clockElems$, callback) {
        U.gsap.to(clockElems$.bg$, { autoAlpha: 1, duration: 0.5, ease: "power2" });
        U.gsap.to(clockElems$.frame$, {
            filter: "brightness(0.5)",
            duration: 0.5,
            ease: "power2",
            onComplete: callback
        });
    }
    async activate_SocketCall(displayContext) {
        if (!game.user.isGM) {
            return;
        }
        socketlib.system.executeForEveryone("activate_SocketCall", displayContext, this.parentKey.id, this.index);
    }
    static activate_SocketResponse(displayContext, keyID, index) {
        const key = game.eunoblades.ClockKeys.get(keyID);
        if (!key?.isVisible) {
            return;
        }
        const clock = key.getClockByIndex(index);
        if (!clock) {
            return;
        }
        clock.activate_Animation(clock.getElements$(displayContext));
    }
    deactivate_Animation(clockElems$, callback) {
        U.gsap.to(clockElems$.bg$, { autoAlpha: 0, duration: 0.5, ease: "power2" });
        U.gsap.to(clockElems$.frame$, {
            filter: "brightness(1) blur(5px)",
            duration: 0.5,
            ease: "power2",
            onComplete: callback
        });
    }
    async deactivate_SocketCall(displayContext) {
        if (!game.user.isGM) {
            return;
        }
        socketlib.system.executeForEveryone("deactivate_SocketCall", displayContext, this.parentKey.id, this.index);
    }
    static deactivate_SocketResponse(displayContext, keyID, index) {
        const key = game.eunoblades.ClockKeys.get(keyID);
        if (!key?.isVisible) {
            return;
        }
        const clock = key.getClockByIndex(index);
        if (!clock) {
            return;
        }
        clock.deactivate_Animation(clock.getElements$(displayContext));
    }
    fadeInClockName_Animation(clockElems$) {
        U.gsap.effects.blurReveal(clockElems$.clockLabel$, {
            ignoreMargin: true,
            duration: 0.75
        });
    }
    async fadeInClockName_SocketCall(displayContext) {
        if (!game.user.isGM) {
            return;
        }
        socketlib.system.executeForEveryone("fadeInClockName_SocketCall", displayContext, this.parentKey.id, this.index);
    }
    static fadeInClockName_SocketResponse(displayContext, keyID, index) {
        const key = game.eunoblades.ClockKeys.get(keyID);
        if (!key?.isVisible) {
            return;
        }
        const clock = key.getClockByIndex(index);
        if (!clock) {
            return;
        }
        clock.fadeInClockName_Animation(clock.getElements$(displayContext));
    }
    fadeOutClockName_Animation(clockElems$) {
        U.gsap.effects.blurRemove(clockElems$.clockLabel$, {
            ignoreMargin: true,
            duration: 0.75
        });
    }
    async fadeOutClockName_SocketCall(displayContext) {
        if (!game.user.isGM) {
            return;
        }
        socketlib.system.executeForEveryone("fadeOutClockName_SocketCall", displayContext, this.parentKey.id, this.index);
    }
    static fadeOutClockName_SocketResponse(displayContext, keyID, index) {
        const key = game.eunoblades.ClockKeys.get(keyID);
        if (!key?.isVisible) {
            return;
        }
        const clock = key.getClockByIndex(index);
        if (!clock) {
            return;
        }
        clock.fadeOutClockName_Animation(clock.getElements$(displayContext));
    }
    highlight_Animation(clockElems$) {
        U.gsap.effects.scaleUpReveal(clockElems$.glow$, {
            duration: 0.5,
            scale: 3
        });
    }
    async highlight_SocketCall(displayContext) {
        if (!game.user.isGM) {
            return;
        }
        socketlib.system.executeForEveryone("highlight_SocketCall", displayContext, this.parentKey.id, this.index);
    }
    static highlight_SocketResponse(displayContext, keyID, index) {
        const key = game.eunoblades.ClockKeys.get(keyID);
        if (!key?.isVisible) {
            return;
        }
        const clock = key.getClockByIndex(index);
        if (!clock) {
            return;
        }
        clock.highlight_Animation(clock.getElements$(displayContext));
    }
    unhighlight_Animation(clockElems$) {
        U.gsap.effects.scaleDownRemove(clockElems$.glow$, {
            duration: 0.5,
            scale: 3
        });
    }
    async unhighlight_SocketCall(displayContext) {
        if (!game.user.isGM) {
            return;
        }
        socketlib.system.executeForEveryone("unhighlight_SocketCall", displayContext, this.parentKey.id, this.index);
    }
    static unhighlight_SocketResponse(displayContext, keyID, index) {
        const key = game.eunoblades.ClockKeys.get(keyID);
        if (!key?.isVisible) {
            return;
        }
        const clock = key.getClockByIndex(index);
        if (!clock) {
            return;
        }
        clock.unhighlight_Animation(clock.getElements$(displayContext));
    }
    getRotationOfSegment(segment) {
        const stepSize = 360 / this.max;
        return stepSize * (segment - 1);
    }
    initOneSegments(clockElems$, segmentNums, isReversing) {
        if (segmentNums.length > 3) {
            throw new Error(`Too many segments: [${segmentNums.join(", ")}]`);
        }
        // For each segment number, initialize a one-segment to that position,
        //  and initialize its autoAlpha depending on isReversing.
        const oneSegs = [...clockElems$.oneSegments$];
        const oneSegsToAnimate = Array.from(clockElems$.oneSegments$).slice(0, segmentNums.length);
        for (const segmentNum of segmentNums) {
            const oneSegment = oneSegs.shift();
            U.gsap.set(oneSegment, {
                rotation: this.getRotationOfSegment(segmentNum),
                autoAlpha: isReversing ? 1 : 0
            });
        }
        // If reversing, set clock element's value to the final value for proper clipping.
        if (isReversing) {
            clockElems$.clockElem$.attr("data-value", U.getLast(segmentNums) - 1);
        }
        return oneSegsToAnimate;
    }
    changeSegments_Animation(clockElems$, startVal, endVal, callback) {
        startVal = U.gsap.utils.clamp(0, this.max, startVal);
        endVal = U.gsap.utils.clamp(0, this.max, endVal);
        let delta = endVal - startVal;
        if (delta === 0) {
            return;
        }
        // Determine position and sequence of one-segments
        const segmentNums = [];
        if (delta < 0) {
            while (Math.abs(delta) > startVal) {
                delta++;
            }
            for (let i = startVal; i > endVal; i--) {
                segmentNums.push(i);
            }
        }
        else {
            while (endVal > this.max) {
                delta--;
            }
            for (let i = startVal + 1; i <= endVal; i++) {
                segmentNums.push(i);
            }
        }
        // Initialize oneSegments at determined positions
        const segmentsToAnimate = this.initOneSegments(clockElems$, segmentNums, startVal > endVal);
        eLog.checkLog3("BladesClock", "changeSegments_Animation", { clockElems$, delta, segmentNums, startVal, endVal, segmentsToAnimate });
        // Initialize master timeline
        const tl = U.gsap.timeline();
        // Enlarge clock key and focus clock
        // const clockFocusTimeline: gsap.core.Timeline = this.parentKey.getClockFocusTimeline(this.index);
        // tl.add(clockFocusTimeline);
        // Animate one-segments
        if (delta > 0) {
            tl.fromTo(segmentsToAnimate, {
                autoAlpha: 0,
                scale: 2
            }, {
                autoAlpha: 1,
                scale: 1,
                duration: 0.5,
                stagger: 0.2,
                ease: "power2",
                callbackScope: this,
                onComplete() {
                    clockElems$.clockElem$.attr("data-value", endVal);
                    U.gsap.to(segmentsToAnimate, {
                        autoAlpha: 0,
                        duration: 0.5,
                        stagger: 0.2
                        // onComplete() {
                        //   // Return clock key to original size and focus
                        //   clockFocusTimeline.reverse();
                        // }
                    });
                }
            });
        }
        else {
            tl.fromTo(segmentsToAnimate, {
                autoAlpha: 1,
                scale: 1
            }, {
                autoAlpha: 0,
                scale: 2,
                duration: 0.5,
                stagger: 0.2,
                ease: "power2"
                // onComplete() {
                //   // Return clock key to original size and focus
                //   clockFocusTimeline.reverse();
                // }
            });
        }
        return tl;
    }
    async changeSegments_SocketCall(displayContext, startVal, endVal) {
        if (!game.user.isGM) {
            return;
        }
        startVal = U.gsap.utils.clamp(0, this.max, startVal);
        endVal = U.gsap.utils.clamp(0, this.max, endVal);
        socketlib.system.executeForEveryone("changeSegments_SocketCall", displayContext, this.parentKey.id, this.index, startVal, endVal);
    }
    static changeSegments_SocketResponse(displayContext, keyID, index, startVal, endVal) {
        const key = game.eunoblades.ClockKeys.get(keyID);
        if (!key?.isVisible) {
            return;
        }
        const clock = key.getClockByIndex(index);
        if (!clock) {
            return;
        }
        clock.changeSegments_Animation(clock.getElements$(displayContext), startVal, endVal);
    }
    // #endregion
    // #region Adding/Removing Clock Segments ~
    // Returns number of segments beyond max (or 0, if max not met)
    async fillSegments(count, isSilent = false) {
        // Amount added beyond max:
        const clockOverflow = Math.max(0, this.value + count - this.max);
        // Clamp count to max:
        count = Math.min(this.value + count, this.max) - this.value;
        if (count === 0) {
            return clockOverflow;
        }
        await this.updateTarget("value", this.value + count, isSilent === true
            ? ClockKeyUpdateAction.RenderNone
            : ClockKeyUpdateAction.RenderAll);
        return clockOverflow;
    }
    // Returns (positive) number of segments removed
    // in excess of the number of segments in the clock
    async clearSegments(count, isSilent = false) {
        // Amount removed beyond 0:
        const clockOverflow = Math.max(0, count - this.value);
        // Clamp count to min:
        count = Math.min(this.value, count);
        if (count === 0) {
            return clockOverflow;
        }
        await this.updateTarget("value", this.value - count, isSilent === true
            ? ClockKeyUpdateAction.RenderNone
            : ClockKeyUpdateAction.RenderAll);
        return clockOverflow;
    }
    async delete() {
        const { parentKey } = this;
        await super.delete();
        parentKey.updateClockIndices();
    }
    // #endregion
    // #region OVERRIDES: Async Update Methods
    postUpdateRender(postUpdateAction) {
        if (postUpdateAction === ClockKeyUpdateAction.RenderNone || postUpdateAction === false) {
            return;
        }
        this.target.sheet?.render();
        if (postUpdateAction === ClockKeyUpdateAction.RenderAll) {
            game.eunoblades.ClockKeeper.sheet?.render();
        }
    }
    async updateTarget(prop, val, postUpdateAction = false) {
        await super.updateTarget(prop, val, true);
        this.postUpdateRender(postUpdateAction);
    }
    async updateTargetData(val, postUpdateAction = false) {
        await super.updateTargetData(val, true);
        this.postUpdateRender(postUpdateAction);
    }
}
export default BladesClockKey;
export { BladesClock };
