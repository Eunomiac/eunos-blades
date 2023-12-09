import C, { ClockColor, ClockKeyDisplayMode, Factor } from "../../core/constants.js";
import U from "../../core/utilities.js";
class BladesTargetLink {
    static validateConfig(ref) {
        // Check if 'ref' is a simple object literal
        if (!U.isSimpleObj(ref)) {
            return false;
        }
        // Confirm a target key or flag key has been provided.
        if (!ref.targetKey && !ref.targetFlagKey) {
            return false;
        }
        // Confirm a target has been provided, and that it can be resolved to a Document entity.
        if (!ref.target) {
            return false;
        }
        if (U.isDocID(ref.target)) {
            // Convert string id of target to target Document
            ref.target = game.actors.get(ref.target) ?? game.items.get(ref.target);
        }
        if (!(ref.target instanceof Actor || ref.target instanceof Item)) {
            return false;
        }
        // Create a random ID if one not provided.
        if (!ref.id) {
            ref.id = randomID();
        }
        return true;
    }
    _id;
    _targetID;
    get targetID() { return this._targetID; }
    _target;
    get target() { return this._target; }
    _targetKey = "system";
    get targetKey() { return this._targetKey; }
    _targetFlagKey;
    get targetFlagKey() { return this._targetFlagKey; }
    constructor(config) {
        if (!BladesTargetLink.validateConfig(config)) {
            eLog.error("[new BladesTargetLink] Bad Config File.", config);
            throw new Error("See log.");
        }
        const { id, target, targetKey, targetFlagKey } = config;
        this._id = id;
        this._target = target;
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
    get id() { return this._id; }
    get name() { return this.getSystemData().name; }
    async updateTarget(prop, val) {
        if (this.targetFlagKey) {
            this.target.setFlag("eunos-blades", `${this.targetFlagKey}.${this._id}.${prop}`, val);
        }
        else {
            this.target.update({ [`${this.targetKey}.${this._id}.${prop}`]: val });
        }
    }
    async updateTargetData(val) {
        if (this.targetFlagKey) {
            if (val === null) {
                this.target.unsetFlag("eunos-blades", `${this.targetFlagKey}.${this._id}`);
            }
            else {
                this.target.setFlag("eunos-blades", `${this.targetFlagKey}.${this._id}`, val);
            }
        }
        else if (val === null) {
            this.target.update({ [`${this.targetKey}.-=${this._id}`]: null });
        }
        else {
            this.target.update({ [`${this.targetKey}.${this._id}`]: val });
        }
    }
    async delete() {
        return this.updateTargetData(null);
    }
}
class BladesClockKey extends BladesTargetLink {
    // #region STATIC METHODS ~
    static get DefaultSchema() {
        return {
            name: "",
            isVisible: true,
            isActive: false,
            isNameVisible: false,
            isShowingControls: game.user.isGM,
            clocksData: {}
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
    get isVisible() { return this.getSystemData().isVisible; }
    get sceneID() { return this.getSystemData().sceneID; }
    get isActive() { return this.getSystemData().isActive; }
    get isNameVisible() { return this.getSystemData().isNameVisible; }
    get size() { return this.clocks.size; }
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
        return (this.currentClock?.index ?? 0);
    }
    get currentClock() {
        return this.clocks.find((clock) => !clock.isComplete);
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
        return this.getSystemData().isShowingControls;
    }
    set isShowingControls(val) {
        this.updateTarget("isShowingControls", val);
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
    async initClockKeyElem(displayMode = ClockKeyDisplayMode.full) {
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
        configOptions.duration ??= 1;
        configOptions.ease ??= "power2";
        configOptions.autoAlpha ??= 1;
        const keyTweenVars = { ...configOptions };
        const keyContTweenVars = { ...configOptions };
        // Get key data
        const keyPosData = C.ClockKeyPositions[this.size];
        // Get position and area dimensions of clock key area focused on by displayMode
        let focusArea;
        let focusPos;
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
        // Determine scale factor necessary to fit focusArea inside keyContainer
        keyTweenVars.scale = Math.min(keyContainerDimensions.height / focusArea.height, keyContainerDimensions.width / focusArea.width);
        // Determine top and left values for key-image-container, accounting for x/yPercent -50
        keyContTweenVars.top = (0.5 * 100) - focusPos.y;
        keyContTweenVars.left = (0.5 * 100) - focusPos.x;
        // Set transfer origin of key-image-container to same position, for further animation
        keyContTweenVars.transformOrigin = `${focusPos.x}px ${focusPos.y}px`;
        return { keyTweenVars, keyContTweenVars };
    }
    async switchToMode(displayMode, configOptions = {}) {
        if (!this.elem) {
            return new Promise((resolve) => {
                setTimeout(async () => resolve(await this.switchToMode(displayMode, configOptions)), 1000);
            });
        }
        const { elem } = this;
        const { keyTweenVars, keyContTweenVars } = this.getDisplayMode(displayMode, configOptions);
        const keyImgContainer = $(this.elem).find(".key-image-container")[0];
        return new Promise((resolve) => {
            U.gsap.timeline({
                onComplete() { resolve(); }
            })
                .to(elem, keyTweenVars, 0)
                .to(keyImgContainer, keyContTweenVars, 0);
        });
    }
    // #endregion
    // #region Adding & Removing Clocks ~
    async addClock(clockData = {}) {
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
    get value() { return this.getSystemData().value ?? 0; }
    set value(val) { this.updateTarget("value", val); }
    get max() { return this.getSystemData().max ?? 0; }
    set max(val) { this.updateTarget("max", val); }
    get color() { return this.getSystemData().color ?? ClockColor.white; }
    set color(val) { this.updateTarget("color", val); }
    get isActive() { return this.getSystemData().isActive ?? false; }
    set isActive(val) { this.updateTarget("isActive", val); }
    get isShowingControls() { return this.getSystemData().isShowingControls; }
    set isShowingControls(val) { this.updateTarget("isShowingControls", val); }
    get isNameVisible() { return this.getSystemData().isNameVisible ?? false; }
    set isNameVisible(val) { this.updateTarget("isNameVisible", val); }
    get isVisible() { return this.getSystemData().isVisible ?? false; }
    set isVisible(val) { this.updateTarget("isVisible", val); }
    get isHighlighted() { return this.getSystemData().isHighlighted ?? false; }
    set isHighlighted(val) { this.updateTarget("isHighlighted", val); }
    get index() { return this.getSystemData().index ?? 0; }
    set index(val) { this.updateTarget("index", val); }
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
        gsap.registerEffect({});
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
}
export const ApplyClockListeners = async (html) => {
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
    if (game.user.isGM) {
        html.find(".clock")
            .each((_, clockElem) => {
            const clock = game.eunoblades.Clocks.get(clockElem.id) ?? new BladesClock(clockElem);
            if (clock) {
                if ($(clockElem).data("isShowingControls")) {
                    /* Put Controls Listeners in here -- can't base controls on Form Submit b/c clockoverlay, etc */
                }
                else {
                    $(clockElem).on({
                        click: () => clock.isActive = !clock.isActive,
                        contextmenu: () => clock.isVisible = !clock.isVisible,
                        wheel: (event) => {
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
        });
    }
    else {
        html.find(".clock:not([data-is-showing-controls='true']")
            .each((_, clockElem) => {
            const clock = new BladesClock(clockElem);
            if (clock && clock.canEdit) {
                $(clockElem).on({
                    click: () => clock.fillSegments(1),
                    contextmenu: () => clock.clearSegments(1)
                });
            }
        });
    }
};
export default BladesClock;
export { BladesClockKey };
