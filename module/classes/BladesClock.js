import C, { BladesActorType, BladesItemType, ClockColor, ClockKeyDisplayMode, Factor } from "../core/constants.js";
import BladesTargetLink from "./BladesTargetLink.js";
import U from "../core/utilities.js";
import { BladesActor } from "../documents/BladesActorProxy.js";
import { BladesItem } from "../documents/BladesItemProxy.js";
class BladesClockKey extends BladesTargetLink {
    // #region STATIC METHODS ~
    static Initialize() {
        game.items?.contents
            .filter((item) => BladesItem.IsType(item, BladesItemType.clock_keeper, BladesItemType.project, BladesItemType.cohort_gang, BladesItemType.cohort_expert, BladesItemType.ritual, BladesItemType.design, BladesItemType.location, BladesItemType.score))
            .forEach((item) => {
            Object.values(item.system.clocksData?.keys ?? {})
                .forEach((keyData) => new BladesClockKey(keyData));
            Object.values(item.system.clocksData?.clocks ?? {})
                .forEach((clockData) => new BladesClock(clockData));
        });
        game.actors?.contents
            .filter((actor) => BladesActor.IsType(actor, BladesActorType.pc, BladesActorType.faction))
            .forEach((actor) => {
            Object.values(actor.system.clocksData?.keys ?? {})
                .forEach((keyData) => new BladesClockKey(keyData));
            Object.values(actor.system.clocksData?.clocks ?? {})
                .forEach((clockData) => new BladesClock(clockData));
        });
    }
    static get DefaultSchema() {
        return {
            name: "",
            isVisible: true,
            isActive: false,
            isNameVisible: false,
            isShowingControls: game.user.isGM,
            clocksData: {},
            oneKeyIndex: U.gsap.utils.random(1, 5, 1)
        };
    }
    static applyConfigDefaults(clockKeyConfig) {
        const keyData = {
            ...this.DefaultSchema,
            ...clockKeyConfig
        };
        if (keyData.target instanceof Actor || keyData.target instanceof Item) {
            keyData.target = keyData.target.id;
        }
        return keyData;
    }
    static async Create(clockKeyConfig, clockConfig = {}) {
        if (!this.validateConfig(clockKeyConfig)) {
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
    get clocksData() { return this.getSystemData().clocksData ?? {}; }
    get clocks() {
        return new Collection(Object.entries(this.clocksData ?? {})
            .sort((a, b) => a[1].index - b[1].index)
            .map(([id, data]) => [
            id,
            game.eunoblades.Clocks.get(id) ?? new BladesClock(data)
        ]));
    }
    get isGM() { return game.user.isGM; }
    get isVisible() { return U.pBool(this.getSystemData().isVisible); }
    get oneKeyIndex() { return U.pInt(this.getSystemData().oneKeyIndex); }
    get displayMode() {
        if (this.isGM && this.isShowingControls) {
            return ClockKeyDisplayMode.full;
        }
        return this.getSystemData().displayMode ?? ClockKeyDisplayMode.full;
    }
    get setDisplayMode() {
        return this.getSystemData().displayMode ?? ClockKeyDisplayMode.full;
    }
    get sceneID() { return this.getSystemData().sceneID; }
    get isActive() { return U.pBool(this.getSystemData().isActive); }
    get isNameVisible() { return U.pBool(this.getSystemData().isNameVisible); }
    get size() { return Object.keys(this.clocksData).length; }
    get rollOppName() { return this.name; }
    get rollOppType() { return "clock_key"; }
    get rollFactors() {
        const factorData = {};
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
    getFactorTotal(factor) {
        switch (factor) {
            case Factor.tier: return this.getSystemData().tier.value;
            case Factor.quality: return this.getFactorTotal(Factor.tier);
            // no default
        }
        return 0;
    }
    get rollOppImg() { return ""; }
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
    // #region ~~~ CONSTRUCTOR & INITIALIZATION ~~~
    _initData;
    constructor(data) {
        if (!BladesClockKey.validateConfig(data)) {
            eLog.error("[BladesClockKey Constructor] Invalid Config", data);
            throw new Error("See log.");
        }
        eLog.checkLog3("[BladesClockKey Constructor] Valid Config", data);
        super(data);
        data.id = this.id;
        this._initData = BladesClockKey.applyConfigDefaults(data);
        game.eunoblades.ClockKeys.set(this.id, this);
    }
    async initialize() {
        await this.updateTargetData(this._initData);
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
        return U.pBool(this.getSystemData().isShowingControls);
    }
    set isShowingControls(val) {
        this.updateTarget("isShowingControls", U.pBool(val));
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
    // #region Adding & Removing Clocks ~
    async updateClockIndices() {
        await this.updateTarget("clocksData", Object.fromEntries(Object.entries(this.clocksData)
            .map(([id, data], index) => [id, { ...data, index }])));
        return this.clocks;
    }
    async addClock(clockData = {}) {
        await this.updateClockIndices();
        eLog.checkLog3("bladesClock", "[BladesClockKey.addClock]", {
            passedData: clockData,
            derivedData: {
                target: this.target,
                targetKey: this.targetKey ? `${this.targetKey}.${this.id}.clocksData` : undefined,
                targetFlagKey: this._targetFlagKey ? `${this.targetFlagKey}.${this.id}.clocksData` : undefined,
                index: this.clocks.size
            },
            createData: {
                target: this.target,
                targetKey: this.targetKey ? `${this.targetKey}.${this.id}.clocksData` : undefined,
                targetFlagKey: this._targetFlagKey ? `${this.targetFlagKey}.${this.id}.clocksData` : undefined,
                index: this.clocks.size,
                ...clockData
            }
        });
        return await BladesClock.Create({
            target: this.target,
            targetKey: this.targetKey ? `${this.targetKey}.${this.id}.clocksData` : undefined,
            targetFlagKey: this._targetFlagKey ? `${this.targetFlagKey}.${this.id}.clocksData` : undefined,
            index: this.clocks.size,
            ...clockData
        });
    }
    async deleteClock(clockID) {
        if (this.size <= 1) {
            throw new Error("[BladesClockKey.deleteClock()] Cannot reduce number of clocks below 1!");
        }
        clockID ??= Array.from(this.clocks).pop()?.id;
        await game.eunoblades.Clocks.get(clockID ?? "")?.delete();
        await this.updateClockIndices();
    }
}
class BladesClock extends BladesTargetLink {
    // #region STATIC METHODS ~
    static get DefaultSchema() {
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
    static applyConfigDefaults(clockConfig) {
        if (clockConfig.target instanceof Actor || clockConfig.target instanceof Item) {
            clockConfig.target = clockConfig.target.id;
        }
        const clockData = {
            ...this.DefaultSchema,
            ...clockConfig
        };
        return clockData;
    }
    static async Create(clockConfig) {
        if (!this.validateConfig(clockConfig)) {
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
    get canEdit() {
        // return true if user has edit permissions on parent document, and clock is
        // visible and active.
        console.log("NOTE: All Clocks currently Editable; see line 71 of BladesClock.ts");
        return this.isVisible && this.isActive;
    }
    get isGM() { return game.user.isGM; }
    get value() { return U.pInt(this.getSystemData().value); }
    set value(val) { this.updateTarget("value", U.pInt(val)); }
    get max() { return U.pInt(this.getSystemData().max); }
    set max(val) { this.updateTarget("max", U.pInt(val)); }
    get color() { return this.getSystemData().color ?? ClockColor.white; }
    set color(val) { this.updateTarget("color", val); }
    get isActive() { return U.pBool(this.getSystemData().isActive); }
    set isActive(val) { this.updateTarget("isActive", U.pBool(val)); }
    get parentKey() {
        const keyID = this.targetKey.match(/\.keys\.([^.]+)/)?.[1];
        if (!keyID) {
            return undefined;
        }
        return game.eunoblades.ClockKeys.get(keyID);
    }
    get isShowingControls() {
        if (this.parentKey && !this.parentKey.isShowingControls) {
            return false;
        }
        return U.pBool(this.getSystemData().isShowingControls);
    }
    set isShowingControls(val) { this.updateTarget("isShowingControls", U.pBool(val)); }
    get isNameVisible() { return U.pBool(this.getSystemData().isNameVisible); }
    set isNameVisible(val) { this.updateTarget("isNameVisible", U.pBool(val)); }
    get isVisible() { return U.pBool(this.getSystemData().isVisible); }
    set isVisible(val) { this.updateTarget("isVisible", U.pBool(val)); }
    get isHighlighted() { return U.pBool(this.getSystemData().isHighlighted); }
    set isHighlighted(val) { this.updateTarget("isHighlighted", U.pBool(val)); }
    get index() { return U.pInt(this.getSystemData().index); }
    set index(val) { this.updateTarget("index", U.pInt(val)); }
    get display() { return this.getSystemData().display ?? {}; }
    set display(val) { this.updateTarget("display", val); }
    get tooltip() { return this.getSystemData().tooltip; }
    set tooltip(val) { this.updateTarget("tooltip", val); }
    get sceneID() { return this.getSystemData().sceneID; }
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
    get rollFactors() {
        const factorData = {};
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
    getFactorTotal(factor) {
        switch (factor) {
            case Factor.tier: return this.getSystemData().tier.value;
            case Factor.quality: return this.getFactorTotal(Factor.tier);
            // no default
        }
        return 0;
    }
    get rollOppImg() { return ""; }
    // #endregion
    // #region ~~ CONSTRUCTOR ~~
    _initData;
    constructor(data) {
        function isHTML(testData) {
            return testData instanceof HTMLElement || testData instanceof jQuery;
        }
        let configData;
        let targetLinkData;
        if (isHTML(data)) {
            data = $(data);
            targetLinkData = {
                id: data.data("id"),
                target: data.data("targetId"),
                targetFlagKey: data.data("targetFlagKey") || undefined,
                targetKey: data.data("targetKey")
            };
            configData = targetLinkData;
        }
        else {
            const dataAsConfig = data;
            targetLinkData = {
                id: data.id,
                target: typeof dataAsConfig.target === "string" ? dataAsConfig.target : dataAsConfig.target.id,
                targetFlagKey: dataAsConfig.targetFlagKey || undefined,
                targetKey: dataAsConfig.targetKey || undefined
            };
            configData = {
                ...data,
                ...targetLinkData
            };
        }
        super(targetLinkData);
        configData.id = this.id;
        this._initData = BladesClock.applyConfigDefaults(configData);
        game.eunoblades.Clocks.set(this.id, this);
    }
    async initialize() {
        return this.updateTargetData(this._initData);
    }
    // #endregion
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
        return this.parentKey?.updateClockIndices();
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
        const clock = game.eunoblades.Clocks.get(clockID);
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
                    .each((_, el) => { $(el).data("hoverTimeline", U.gsap.effects.hoverButton(el)); })
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
                    .each((_, el) => { $(el).data("hoverTimeline", U.gsap.effects.hoverButton(el, { color: "#FF0000" })); })
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
export default BladesClock;
export { BladesClockKey };
