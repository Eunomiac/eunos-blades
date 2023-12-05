import { ClockColor, Factor } from "../../core/constants.js";
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
        return getProperty(this.target, `${this.targetKey}.${this._id}`);
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
    static get DefaultSchema() {
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
    static applyConfigDefaults(clockKeyConfig) {
        const keyData = {
            ...this.DefaultSchema,
            ...clockKeyConfig
        };
        if (keyData.target instanceof Actor || keyData.target instanceof Item) {
            keyData.target = keyData.target.id;
        }
        const clockID = randomID();
        const clockTargetLinkData = {
            id: clockID,
            target: keyData.target,
            targetKey: keyData.targetKey ? `${keyData.targetKey}.${keyData.id}.clocksData` : undefined,
            targetFlagKey: keyData.targetFlagKey ? `${keyData.targetKey}.${keyData.id}.clocksData` : undefined
        };
        keyData.clocksData[clockID] = {
            ...BladesClock.DefaultSchema,
            ...clockTargetLinkData
        };
        return keyData;
    }
    static async Create(clockKeyConfig) {
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
        return clockKey;
    }
    get isVisible() { return this.getSystemData().isVisible; }
    get isActive() { return this.getSystemData().isActive; }
    get isNameVisible() { return this.getSystemData().isNameVisible; }
    get size() { return this.getSystemData().size; }
    get clocksData() { return this.getSystemData().clocksData; }
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
    async initialize() {
        return this.updateTargetData(this._initData);
    }
    _initData;
    constructor(data) {
        if (!BladesClockKey.validateConfig(data)) {
            eLog.error("[BladesClockKey Constructor] Invalid Config", data);
            throw new Error("See log.");
        }
        eLog.checkLog3("[BladesClockKey Constructor] Invalid Config", data);
        data.id ??= randomID();
        super(data);
        this._initData = BladesClockKey.applyConfigDefaults(data);
    }
    get currentClockIndex() {
        return this.clocks.find((clock) => clock.value < clock.max)?.index;
    }
    get isComplete() {
        return this.clocks.every((clock) => clock.isComplete);
    }
    _clocks = {};
    get clocks() {
        return Object.keys(this.clocksData)
            .map((index) => this.getClock(index))
            .sort((a, b) => a.index - b.index);
    }
    get nextOpenSlot() {
        if (this.clocks.length >= 6) {
            return undefined;
        }
        return this.clocks.length;
    }
    getClock(index = 0) {
        if (typeof index === "string" && index in this.clocksData) {
            return (this._clocks[index] ??= new BladesClock(this.clocksData[index]));
        }
        const clockData = Object.values(this.clocksData).find((cData) => cData.index === U.pInt(index));
        if (!clockData) {
            return undefined;
        }
        // Convert BladesClockData to BladesClockConfig
        const clockConfig = {
            ...clockData,
            target: typeof clockData.target === "string" ? clockData.target : clockData.target.id,
            targetKey: clockData.targetKey,
            targetFlagKey: clockData.targetFlagKey
        };
        return (this._clocks[clockData.id] ??= new BladesClock(clockConfig));
    }
    getCurrentClock() {
        return this.isComplete ? undefined : this.getClock(this.currentClockIndex);
    }
    async getHTML() {
        return await renderTemplate("systems/eunos-blades/templates/overlays/clock-key.hbs", this);
    }
    async toggleActive() {
        return await this.updateTarget("isActive", !this.isActive);
    }
    async addClock() {
        if (this.clocks.length === this.size) {
            if (this.size >= 6) {
                throw new Error("[BladesClockKey.addClock()] Cannot add more than six clocks to a key!");
            }
            await this.setKeySize(this.size + 1);
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
    async deleteClock(index) {
        if (typeof index === "string") {
            return await this.getClock(index)?.delete();
        }
        else if (typeof index === "number") {
            return await this.getClock(index)?.delete();
        }
    }
    async setKeySize(clockCount) {
        const updateData = {
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
class BladesClock extends BladesTargetLink {
    static get DefaultSchema() {
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
        // Wait for clockKey data to be written to target
        await clock.initialize();
        return clock;
    }
    static ApplyClockListeners(html) {
        eLog.checkLog3("ApplyListeners", "ApplyClockListeners", { html, find: html.find(".clock") });
        if (game.user.isGM) {
            html.find(".clock")
                .each((_, clockElem) => {
                const clock = new BladesClock(clockElem);
                if (clock) {
                    $(clockElem).on({
                        click: () => clock.isActive = !clock.isActive,
                        contextmenu: () => clock.isVisible = !clock.isVisible,
                        wheel: (event) => {
                            if (!(event.originalEvent instanceof WheelEvent)) {
                                return;
                            }
                            event.preventDefault();
                            if (event.originalEvent.deltaY < 0) {
                                clock.fillSegments(clockElem, 1);
                            }
                            else {
                                clock.clearSegments(clockElem, 1);
                            }
                        }
                    });
                }
            });
        }
        else {
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
    get canEdit() {
        // return true if user has edit permissions on parent document, and clock is
        // visible and active.
        console.log("NOTE: All Clocks currently Editable; see line 71 of BladesClock.ts");
        return this.isVisible && this.isActive;
    }
    get value() { return this.getSystemData().value ?? 0; }
    set value(val) { this.updateTarget("value", val); }
    get max() { return this.getSystemData().max ?? 0; }
    set max(val) { this.updateTarget("max", val); }
    get color() { return this.getSystemData().color ?? ClockColor.white; }
    set color(val) { this.updateTarget("color", val); }
    get isActive() { return this.getSystemData().isActive ?? false; }
    set isActive(val) { this.updateTarget("isActive", val); }
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
    get isEmpty() { return this.value === 0; }
    get isComplete() { return this.value >= this.max; }
    get rollOppClock() { return this; }
    get rollOppName() { return this.name; }
    get rollOppType() { return "clock"; }
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
    async initialize() {
        return this.updateTargetData(this._initData);
    }
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
                id: data.id ?? randomID(),
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
        this._initData = BladesClock.applyConfigDefaults(configData);
    }
    async getHTML() {
        return await renderTemplate("systems/eunos-blades/templates/components/clock.hbs", this);
    }
    getActiveSide(segmentDelta) {
        // Returns which hemisphere of the clock will show the final change if segmentDelta segments are added/removed.
        const finalClockValue = Math.min(this.max, Math.max(0, this.value + segmentDelta));
        const halfClockValue = this.max / 2;
        if (finalClockValue > halfClockValue) {
            return "left";
        }
        return "right";
    }
    getInteriorStyleString(segmentCount) {
        segmentCount ??= this.value;
        return `clip-path: url('#${segmentCount}-of-${this.max}');`;
    }
    getNextInteriorStyleString(segmentCount) {
        segmentCount ??= this.value;
        if (segmentCount + 1 > this.max) {
            return false;
        }
        return this.getInteriorStyleString(segmentCount + 1);
    }
    getLastInteriorStyleString(segmentCount) {
        segmentCount ??= this.value;
        if (segmentCount - 1 < 0) {
            return false;
        }
        return this.getInteriorStyleString(segmentCount - 1);
    }
    _blurInSegment(clockElem, startSegment) {
        startSegment ??= this.value;
        // Get next clip-path string
        const nextInteriorStyleString = this.getNextInteriorStyleString(startSegment);
        if (!nextInteriorStyleString) {
            return false;
        }
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
    _blurOutSegment(clockElem, startSegment) {
        startSegment ??= this.value;
        // Get previous clip-path string
        const prevInteriorStyleString = this.getLastInteriorStyleString(startSegment);
        if (!prevInteriorStyleString) {
            return false;
        }
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
    async fillSegments(clockElem, count) {
        // Returns TRUE if clock is complete after segments added.
        const isClockFull = this.value + count >= this.max;
        count = Math.min(this.value + count, this.max) - this.value;
        if (count === 0) {
            return isClockFull;
        }
        const firstSegment = this.value + 1;
        const lastSegment = this.value + count;
        // Construct timeline of sequential segment additions
        const tl = U.gsap.timeline({ paused: true });
        for (let i = firstSegment; i <= lastSegment; i++) {
            const blurTL = this._blurInSegment(clockElem, i);
            if (!blurTL) {
                break;
            }
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
    async clearSegments(clockElem, count) {
        // Returns TRUE if clock is EMPTY after segments added.
        const isClockEmpty = this.value >= count;
        count = Math.min(this.value, count);
        if (count === 0) {
            return isClockEmpty;
        }
        const firstSegment = this.value - 1;
        const lastSegment = this.value - count;
        // Construct timeline of sequential segment additions
        const tl = U.gsap.timeline({ paused: true });
        for (let i = firstSegment; i >= lastSegment; i--) {
            const blurTL = this._blurOutSegment(clockElem, i);
            if (!blurTL) {
                break;
            }
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
}
export default BladesClock;
export { BladesClockKey };
