import BladesHelpers from "./euno-helpers.js";

export class BladesItem extends Item {
    
        async _preCreate(data, options, user) {
        await super._preCreate(data, options, user);
        
        if (user.id !== game.user?.id) {
            return;
        }
        if (this.parent?.documentName !== "Actor") {
            return;
        }
        
        await this.parent.deleteEmbeddedDocuments("Item", BladesHelpers.removeDuplicatedItemType(data, this.parent));
    }
    

    

    

    
        prepareData() {
        super.prepareData();
        
        if (this.data.type === "faction") {
            this._prepareFaction();
        }
        if (this.data.type === "clock_keeper") {
            this._prepareClockKeeper();
        }
        if (this.data.type === "cohort") {
            this._prepareCohort();
        }
    }
    
    _prepareFaction() {
        if (this.type === "faction") {
            this.system.goal_1_clock_value ??= 0;
            if (this.system.goal_1_clock_max === 0) {
                this.system.goal_1_clock_max = 4;
            }
            this.system.goal_2_clock_value ??= 0;
            if (this.system.goal_2_clock_max === 0) {
                this.system.goal_2_clock_max = 4;
            }
            this.system.size_list_1 = BladesHelpers.createListOfClockSizes(game.system.bobclocks.sizes, this.system.goal_1_clock_max ?? 4, parseInt(`${this.system.goal_1_clock_max ?? 4}`));
            this.system.size_list_2 = BladesHelpers.createListOfClockSizes(game.system.bobclocks.sizes, this.system.goal_2_clock_max ?? 4, parseInt(`${this.system.goal_2_clock_max ?? 4}`));
        }
    }
    
    _prepareClockKeeper() {
        this.system.scenes = game.scenes?.map((scene) => ({ id: scene.id, name: scene.name ?? "" }));
        this.system.targetScene ??= game.scenes?.current?.id;
        this.system.clock_keys = Object.fromEntries(Object.entries(this.system.clock_keys ?? {})
            .filter(([keyID, keyData]) => Boolean(keyData))
            .map(([keyID, keyData]) => {
            if (keyData === null) {
                return [keyID, null];
            }
            keyData.clocks = Object.fromEntries(Object.entries(keyData.clocks)
                .filter(([clockNum, clockData]) => Boolean(clockData)));
            return [keyID, keyData];
        }));
        
    }
    
    get tier() { return parseInt(this.parent?.system?.tiar || 0); }
    
    _prepareCohort() {
        if (this.parent?.documentName !== "Actor") {
            return;
        }
        if (!this.system.cohort) {
            return;
        }
        this.system.scale = { Gang: this.tier, Expert: 0 }[this.system.cohort];
        this.system.quality = { Gang: this.tier, Expert: this.tier + 1 }[this.system.cohort];
    }
    
    async activateOverlayListeners() {
        $("#euno-clock-keeper-overlay").find(".euno-clock").on("wheel", async (event) => {
            console.log("Wheel Event!", { event });
            if (!game?.user?.isGM) {
                return;
            }
            if (!event.currentTarget) {
                return;
            }
            if (!game.eunoblades.ClockKeeper) {
                return;
            }
            
            event.preventDefault();
            
            const clock$ = $(event.currentTarget);
            const key$ = clock$.closest(".euno-clock-key");
            
            console.log("... Elements", { clock$, key$ });
            if (!(key$[0] instanceof HTMLElement)) {
                return;
            }
            if (!(event.originalEvent instanceof WheelEvent)) {
                return;
            }
            
            const keyID = key$[0].id;
            const clockNum = clock$.data("index");
            const curClockVal = parseInt(clock$.data("value"));
            const delta = event.originalEvent.deltaY < 0 ? 1 : -1;
            const size = parseInt(clock$.data("size"));
            const newClockVal = curClockVal + delta;
            
            console.log("... Details", { keyID, clockNum, curClockVal, size, delta, newClockVal });
            if (curClockVal === newClockVal) {
                return;
            }
            
            await this.update({
                [`system.clock_keys.${keyID}.clocks.${clockNum}.value`]: `${newClockVal}`
            });
            this.renderOverlay();
        });
    }
    async addClockKey() {
        const keyID = randomID();
        return this.update({ [`system.clock_keys.${keyID}`]: {
                id: keyID,
                display: "",
                isVisible: false,
                isNameVisible: true,
                isActive: false,
                scene: this.system.targetScene,
                numClocks: 1,
                clocks: {
                    1: {
                        display: "",
                        isVisible: true,
                        isNameVisible: true,
                        isActive: true,
                        color: "yellow",
                        size: 4,
                        value: 0
                    }
                }
            } });
    }
    
    async deleteClockKey(keyID) {
        const clockKeys = this.system.clock_keys ?? {};
        clockKeys[keyID] = null;
        return this.update({ "system.clock_keys": clockKeys });
    }
    
    async setKeySize(keyID, keySize = 1) {
        keySize = parseInt(`${keySize}`);
        const clockKey = this.system.clock_keys[keyID];
        if (!clockKey) {
            return this;
        }
        clockKey.numClocks = keySize;
        [...new Array(keySize)].map((_, i) => i + 1)
            .forEach((clockNum) => {
            clockKey.clocks[clockNum] ??= {
                display: "",
                isVisible: false,
                isNameVisible: false,
                isActive: false,
                color: "yellow",
                size: 4,
                value: 0
            };
        });
        [...new Array(6 - keySize)].map((_, i) => keySize + i + 1)
            .forEach((clockNum) => {
            clockKey.clocks[clockNum] = null;
        });
        return this.update({ [`system.clock_keys.${keyID}`]: clockKey });
    }
    
    _overlayElement;
    get overlayElement() {
        this._overlayElement ??= $("#euno-clock-keeper-overlay")[0];
        if (!this._overlayElement) {
            $("body.vtt.game.system-eunos-blades").append("<section id=\"euno-clock-keeper-overlay\"></section>");
            this._overlayElement = $("#euno-clock-keeper-overlay")[0];
        }
        return this._overlayElement;
    }
    
    async renderOverlay() {
        if (!game.scenes?.current) {
            return;
        }
        this.overlayElement.innerHTML = (await getTemplate("systems/eunos-blades/templates/clock-overlay.hbs"))({ ...this.system, currentScene: game.scenes?.current.id });
        this.activateOverlayListeners();
    }
}