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
                    .forEach((keyData) => { new BladesClockKey(keyData); });
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
    }
    static ApplySchemaDefaults(schemaData) {
        // Ensure all properties of Schema are provided
        return {
            name: "",
            isVisible: false,
            isActive: false,
            isNameVisible: false,
            isShowingControls: true,
            clocksData: {},
            sceneID: false,
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
    get isActive() { return this.data.isActive; }
    set isActive(val) { this.updateTarget("isActive", U.pBool(val)); }
    get isNameVisible() { return this.data.isNameVisible; }
    set isNameVisible(val) { this.updateTarget("isNameVisible", U.pBool(val)); }
    _keySwingTimeline;
    get keySwingTimeline() {
        if (!this.elem) {
            return undefined;
        }
        if (!this._keySwingTimeline) {
            this._keySwingTimeline = U.gsap.effects.keySwing(this.elem).pause();
        }
        return this._keySwingTimeline;
    }
    _keyControlZoomTimeline;
    get keyControlZoomTimeline() {
        if (!this.elem) {
            return undefined;
        }
        if (!this._keyControlZoomTimeline) {
            this._keyControlZoomTimeline = U.gsap.effects.keyControlZoom(this.elem).pause();
        }
        return this._keyControlZoomTimeline;
    }
    get clocksData() { return this.data.clocksData; }
    get displayMode() {
        if (game.user.isGM && this.isShowingControls) {
            return ClockKeyDisplayMode.full;
        }
        return this.data.displayMode;
    }
    get oneKeyIndex() { return this.data.oneKeyIndex; }
    get sceneID() { return this.data.sceneID; }
    get overlayPosition() {
        return undefined;
    }
    // #endregion
    _clocks = new Collection();
    get clocks() {
        return new Collection(Object.entries(this.clocksData)
            .sort((a, b) => a[1].index - b[1].index)
            .map(([id, data]) => {
            if (!this._clocks.has(id)) {
                const clock = new BladesClock(data);
                this._clocks.set(id, clock);
            }
            return [id, this._clocks.get(id)];
        }));
    }
    getClockByID(clockID) {
        return this.clocks.get(clockID);
    }
    get size() { return this.clocks.size; }
    get isComplete() {
        return Array.from(this.clocks).every((clock) => clock.isComplete);
    }
    get currentClockIndex() {
        return U.pInt(this.currentClock?.index);
    }
    get currentClock() {
        return this.clocks.find((clock) => !clock.isComplete);
    }
    get displaySelectOptions() {
        const options = [
            { value: ClockKeyDisplayMode.full, display: "Full Key" },
            { value: ClockKeyDisplayMode.clocks, display: "Clocks" },
            { value: ClockKeyDisplayMode.currentClock, display: "Current Clock" },
            { value: ClockKeyDisplayMode.presentCurrentClock, display: "Present Current Clock" }
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
        config.index = indexOverride ?? this.clocks.size;
        // Parse config to full data object
        const cData = BladesClock.ParseConfig(config);
        return cData;
    }
    // #endregion
    // #region HTML INTERACTION ~
    async getHTML() {
        return await renderTemplate("systems/eunos-blades/templates/overlays/clock-key.hbs", this);
    }
    get elem() {
        return $(`#${this.id}`)[0];
    }
    get isShowingControls() {
        if (!this.elem) {
            return false;
        }
        if (!game.user.isGM) {
            return false;
        }
        return !$(this.elem).hasClass("controls-hidden");
    }
    async toggleActive() {
        return await this.updateTarget("isActive", !this.isActive);
    }
    get elements() {
        const elemData = {};
        if (!this.elem) {
            return elemData;
        }
        elemData.key = this.elem;
        elemData.keyContainer = $(this.elem).closest(".clock-key-container")[0];
        for (const clock of Array.from(this.clocks)) {
            if (!clock.elem) {
                return elemData;
            }
            const { index, elem } = clock;
            elemData[`clock ${index}`] = elem;
            elemData[`clock ${index} Container`] = $(elem).closest(".clock-container")[0];
        }
        return elemData;
    }
    // Initializes clock key with proper position and scale before displaying via autoAlpha
    async initClockKeyElem(displayMode) {
        displayMode = this.displayMode;
        if (!this.elem) {
            return new Promise((resolve) => {
                setTimeout(async () => resolve(await this.initClockKeyElem(displayMode)), 1000);
            });
        }
        const { elem } = this;
        const { keyTweenVars, keyContTweenVars } = this.getDisplayMode(displayMode);
        const keyImgContainer = $(this.elem).find(".key-image-container")[0];
        return new Promise((resolve) => {
            U.gsap.timeline()
                .set(keyImgContainer, keyContTweenVars)
                .set(elem, keyTweenVars)
                .to(elem, {
                autoAlpha: 1,
                duration: 0.5
            }).then(() => { resolve(); });
        });
    }
    // Given a display mode ("full", "clocks", or a clock index number), will return a GSAP effects
    //  config object to be plugged into any of the 'clockKey' effects.
    // Can optionally provide config values to be included in a second parameter.
    getDisplayMode(displayMode, configOptions = {}) {
        if (!this.elem) {
            return configOptions;
        }
        if (!this.isActive) {
            displayMode = ClockKeyDisplayMode.full;
        }
        configOptions.duration ??= 1;
        configOptions.ease ??= "power2";
        configOptions.autoAlpha ??= 1;
        const keyTweenVars = { ...configOptions };
        const keyContTweenVars = { ...configOptions };
        // Get key data
        const keyPosData = U.objClone(C.ClockKeyPositions[this.size]);
        // Are we presenting? If so, flag it true and parse displayMode to standard clock reference
        let isPresenting = false;
        if (/^present/.exec(`${displayMode}`)) {
            isPresenting = true;
            const suffix = `${displayMode}`.substring(7);
            if (!isNaN(Number(suffix))) {
                displayMode = U.pInt(suffix);
            }
            else {
                displayMode = ClockKeyDisplayMode.currentClock;
            }
        }
        if (!isNaN(Number(displayMode))) {
            displayMode = U.pInt(displayMode);
        }
        // Get position and area dimensions of clock key area focused on by displayMode
        let focusArea;
        let focusPos;
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
                        focusPos = keyPosData.clocks[displayMode];
                        focusArea = { width: 110, height: 110 };
                        if (isPresenting) {
                            focusArea = { width: 55, height: 110 };
                            if (activeClockSide === "left") {
                                focusPos.x -= 30;
                                focusPos.z = -50;
                            }
                            else if (activeClockSide === "right") {
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
            width: U.gsap.getProperty(keyContainer, "width"),
            height: U.gsap.getProperty(keyContainer, "height")
        };
        // If not isActive, adjust 'width' to account for CSS styles
        if (!this.isActive) {
            keyContainerDimensions.width *= 2;
        }
        // Determine scale factor necessary to fit focusArea inside keyContainer
        keyTweenVars.scale = Math.min(keyContainerDimensions.height / focusArea.height, keyContainerDimensions.width / focusArea.width);
        // If not isActive, adjust 'scale' to account for CSS styles
        if (!this.isActive) {
            // keyTweenVars.scale *= 2;
        }
        // Determine top and left values for key-image-container, accounting for x/yPercent -50
        keyContTweenVars.top = (0.5 * 100) - focusPos.y;
        keyContTweenVars.left = (0.5 * 100) - focusPos.x;
        // Set transfer origin of key-image-container to same position, for further animation
        keyContTweenVars.transformOrigin = `${focusPos.x}px ${focusPos.y}px`;
        // Set initial y-rotation to turn clock half towards camera if 'isPresenting'
        if (isPresenting) {
            if (activeClockSide === "left") {
                keyContTweenVars.rotateY = 30;
            }
            else if (activeClockSide === "right") {
                keyContTweenVars.rotateY = -30;
            }
        }
        // If not isActive, adjust 'width' and 'scale' to account for CSS styles
        return { keyTweenVars, keyContTweenVars };
    }
    async switchToMode(displayMode, configOptions = {}, isLocalOnly = false) {
        const self = this;
        const { elem } = self;
        if (!elem) {
            return new Promise((resolve) => {
                setTimeout(async () => resolve(await this.switchToMode(displayMode, configOptions, isLocalOnly)), 1000);
            });
        }
        const { keyTweenVars, keyContTweenVars } = self.getDisplayMode(displayMode, configOptions);
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
    // #region ANIMATIONS (Client-Side Only AND Socket-Triggered)
    showControls() {
        if (!game.user.isGM) {
            return;
        }
        if (!this.elem) {
            return;
        }
        this.keySwingTimeline?.tweenTo(1, { duration: 0.25, ease: "none" });
        this.keyControlZoomTimeline?.play();
    }
    hideControls() {
        if (!game.user.isGM) {
            return;
        }
        if (!this.elem) {
            return;
        }
        this.keySwingTimeline?.resume();
        this.keyControlZoomTimeline?.reverse();
    }
    drop_Animation() {
        if (!this.elem) {
            return;
        }
        U.gsap.effects.keyDrop(this.elem);
        this.keySwingTimeline?.seek(0).play();
    }
    drop_SocketCall() {
        if (!game.user.isGM) {
            return;
        }
        if (!this.elem) {
            return;
        }
        socketlib.system.executeForEveryone("drop_SocketCall", this.id);
    }
    static drop_SocketResponse(keyID) {
        const key = game.eunoblades.ClockKeys.get(keyID);
        if (!key) {
            return;
        }
        key.drop_Animation();
    }
    pull_Animation() {
        if (!this.elem) {
            return;
        }
        U.gsap.effects.keyPull(this.elem);
    }
    pull_SocketCall() {
        if (!game.user.isGM) {
            return;
        }
        if (!this.elem) {
            return;
        }
        socketlib.system.executeForEveryone("pull_SocketCall", this.id);
    }
    static pull_SocketResponse(keyID) {
        const key = game.eunoblades.ClockKeys.get(keyID);
        if (!key) {
            return;
        }
        key.pull_Animation();
    }
    // #endregion
    // #region Adding & Removing Clocks ~
    async updateClockIndices() {
        await this.updateTarget("clocksData", Object.fromEntries(Object.entries(this.clocksData)
            .map(([id, data], index) => [id, { ...data, index }])));
        this._clocks.clear();
        return this.clocks;
    }
    async addClock(clockConfig = {}) {
        // Derive clock data from config
        const clockData = this.parseClockConfig(clockConfig);
        // Write to state
        await this.updateTarget(`clocksData.${clockData.id}`, clockData);
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
            isShowingControls: game.user.isGM,
            sceneID: false,
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
    get parentKey() { return game.eunoblades.ClockKeys.get(this.data.parentKeyID); }
    get isShowingControls() {
        if (this.parentKey && !this.parentKey.isShowingControls) {
            return false;
        }
        return U.pBool(this.data.isShowingControls);
    }
    set isShowingControls(val) { this.updateTarget("isShowingControls", U.pBool(val)); }
    get isNameVisible() { return U.pBool(this.data.isNameVisible); }
    set isNameVisible(val) { this.updateTarget("isNameVisible", U.pBool(val)); }
    get isVisible() { return U.pBool(this.data.isVisible); }
    set isVisible(val) { this.updateTarget("isVisible", U.pBool(val)); }
    get isHighlighted() { return U.pBool(this.data.isHighlighted); }
    set isHighlighted(val) { this.updateTarget("isHighlighted", U.pBool(val)); }
    get index() { return U.pInt(this.data.index); }
    set index(val) { this.updateTarget("index", U.pInt(val)); }
    get tooltip() { return this.data.tooltip; }
    set tooltip(val) { this.updateTarget("tooltip", val); }
    get sceneID() { return this.data.sceneID; }
    set sceneID(val) { this.updateTarget("sceneID", val); }
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
    // #region HTML INTERACTION ~
    get elem() {
        return $(`[data-id="${this.id}"`)[0];
    }
    async getHTML() {
        return await renderTemplate("systems/eunos-blades/templates/components/clock.hbs", this);
    }
    // Returns which hemisphere of the clock will show the final change if segmentDelta segments are added/removed.
    getActiveSide(segmentDelta) {
        const finalClockValue = Math.min(this.max, Math.max(0, this.value + segmentDelta));
        const halfClockValue = this.max / 2;
        if (finalClockValue > halfClockValue) {
            return "left";
        }
        return "right";
    }
    // #endregion
    // #region Adding/Removing Clock Segments
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
export const ApplyClockListeners = async (html, namespace) => {
    eLog.checkLog3("ApplyListeners", "ApplyClockListeners", { html, find: html.find(".clock") });
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
    async function toggleTarget(el, source) {
        if (!source) {
            return;
        }
        const prop = $(el).data("prop");
        eLog.checkLog3("clockControls", "Toggle Event", { source, el, prop, curVal: source.getTargetProp(prop) });
        await source.updateTarget(prop, !source.getTargetProp(prop));
        if (prop === "isShowingControls") {
            if (source instanceof BladesClockKey) {
                const key = source;
                const { isShowingControls } = key;
                if (isShowingControls) {
                    // If controls have been enabled, switch display mode of key to full for user (GM) only.
                    key.switchToMode(ClockKeyDisplayMode.full, undefined, true);
                }
                else {
                    // Otherwise, re-initialize key for GM.
                    key.initClockKeyElem();
                }
            }
        }
    }
    async function setTarget(val, el, source) {
        if (!source) {
            return;
        }
        const prop = $(el).data("prop");
        eLog.checkLog3("clockControls", "Set Event", { val, source, prop, curVal: source.getTargetProp(prop) });
        source.updateTarget(prop, val);
    }
    // Add listeners and animation timelines to clock keys
    U.toArray(html.find(".clock-key-container")).forEach((keyContainerElem) => {
        const keyID = $(keyContainerElem).find(".clock-key")[0].id;
        const key = game.eunoblades.ClockKeys.get(keyID);
        if (!key) {
            throw new Error("Too early for key: no KEY!");
        }
        const { elem } = key ?? {};
        if (!elem) {
            throw new Error("Too early for key: no ELEMENT!");
        }
        // Apply listeners to GM control elements
        if (game.user.isGM) {
            $(keyContainerElem).find("[data-action='key-toggle']")
                .each((_, el) => { $(el).data("hoverTimeline", U.gsap.effects.hoverButton(el)); })
                .off(`.${namespace}`)
                .on({
                [`click.${namespace}`]: (event) => {
                    event.preventDefault();
                    toggleTarget(event.currentTarget, key);
                },
                [`mouseenter.${namespace}`]: (event) => $(event.currentTarget).data("hoverTimeline").play(),
                [`mouseleave.${namespace}`]: (event) => $(event.currentTarget).data("hoverTimeline").reverse()
            });
            $(keyContainerElem).find("input.clock-key-controls-name")
                .on({
                [`change.${namespace}`]: (event) => {
                    event.preventDefault();
                    setTarget($(event.target).val(), event.target, key);
                }
            });
            $(keyContainerElem).find("select.key-select")
                .on({
                [`change.${namespace}`]: (event) => {
                    event.preventDefault();
                    setTarget($(event.target).val(), event.target, key);
                }
            });
            $(keyContainerElem).find("[data-action='add-clock']")
                .each((_, el) => { $(el).data("hoverTimeline", U.gsap.effects.hoverButton(el)); })
                .on({
                [`click.${namespace}`]: (event) => {
                    event.preventDefault();
                    key.addClock();
                },
                [`mouseenter.${namespace}`]: (event) => $(event.currentTarget).data("hoverTimeline").play(),
                [`mouseleave.${namespace}`]: (event) => $(event.currentTarget).data("hoverTimeline").reverse()
            });
            $(keyContainerElem).find("[data-action='delete-key']")
                .each((_, el) => { $(el).data("hoverTimeline", U.gsap.effects.hoverButton(el, { color: "#FF0000" })); })
                .on({
                [`contextmenu.${namespace}`]: (event) => {
                    event.preventDefault();
                    key.delete();
                },
                [`mouseenter.${namespace}`]: (event) => $(event.currentTarget).data("hoverTimeline").play(),
                [`mouseleave.${namespace}`]: (event) => $(event.currentTarget).data("hoverTimeline").reverse()
            });
        }
    });
    // Add listeners to clocks
    html.find(".clock-container").each((_, clockContainerElem) => {
        const clockID = $(clockContainerElem).find(".clock")[0].id;
        const keyID = $(clockContainerElem).closest(".clock-key")[0].id;
        if (!clockID || !keyID) {
            throw new Error("Bad element config: No keyID and/or no clockID found.");
        }
        const clockKey = game.eunoblades.ClockKeys.get(keyID);
        if (!clockKey) {
            throw new Error("No such key found!");
        }
        const clock = clockKey.getClockByID(clockID);
        if (!clock) {
            throw new Error("Too early for clock: no CLOCK!");
        }
        const { elem } = clock ?? {};
        if (!elem) {
            throw new Error("Too early for clock: no ELEMENT!");
        }
        // Apply listeners to GM control elements
        if (game.user.isGM) {
            if (clock.isShowingControls) {
                $(clockContainerElem).find("[data-action='clock-toggle']")
                    .each((__, el) => { $(el).data("hoverTimeline", U.gsap.effects.hoverButton(el)); })
                    .on({
                    [`click.${namespace}`]: (event) => {
                        event.preventDefault();
                        toggleTarget(event.currentTarget, clock);
                    },
                    [`mouseenter.${namespace}`]: (event) => $(event.currentTarget).data("hoverTimeline").play(),
                    [`mouseleave.${namespace}`]: (event) => $(event.currentTarget).data("hoverTimeline").reverse()
                });
                $(clockContainerElem).find("input.clock-controls-name")
                    .on({
                    [`change.${namespace}`]: (event) => {
                        event.preventDefault();
                        setTarget($(event.target).val(), event.target, clock);
                    }
                });
                $(clockContainerElem).find("select.clock-select")
                    .on({
                    [`change.${namespace}`]: (event) => {
                        event.preventDefault();
                        setTarget($(event.target).val(), event.target, clock);
                    }
                });
                $(clockContainerElem).find("[data-action='delete-clock']")
                    .each((__, el) => { $(el).data("hoverTimeline", U.gsap.effects.hoverButton(el, { color: "#FF0000" })); })
                    .on({
                    [`contextmenu.${namespace}`]: (event) => {
                        event.preventDefault();
                        clock.delete();
                    },
                    [`mouseenter.${namespace}`]: (event) => $(event.currentTarget).data("hoverTimeline").play(),
                    [`mouseleave.${namespace}`]: (event) => $(event.currentTarget).data("hoverTimeline").reverse()
                });
            }
            else {
                $(clockContainerElem).find("[data-action='clock-toggle'][data-prop='isShowingControls']")
                    .on({
                    [`click.${namespace}`]: (event) => {
                        event.preventDefault();
                        toggleTarget(event.currentTarget, clock);
                    }
                });
                $(clockContainerElem).find(".clock")
                    .on({
                    [`click.${namespace}`]: () => { clock.updateTarget("isShowingControls", true); },
                    [`contextmenu.${namespace}`]: () => { clock.isVisible = !clock.isVisible; },
                    [`wheel.${namespace}`]: (event) => {
                        if (!(event.originalEvent instanceof WheelEvent)) {
                            return;
                        }
                        event.preventDefault();
                        if (event.originalEvent.deltaY < 0) {
                            clock.fillSegments(1);
                        }
                        else {
                            clock.clearSegments(1);
                        }
                    }
                });
            }
        }
        else if (clock.canEdit && !clock.isShowingControls) {
            // Apply listeners for non-GM users
            $(clockContainerElem).find(".clock")
                .on({
                [`click.${namespace}`]: () => clock.fillSegments(1),
                [`contextmenu.${namespace}`]: () => clock.clearSegments(1)
            });
        }
    });
};
export default BladesClockKey;
