import { BladesItemType, Factor, ClockColor, ClockKeyDisplayMode } from "../../core/constants.js";
import U from "../../core/utilities.js";
import { BladesItem } from "../BladesItemProxy.js";
import BladesProjectSheet from "../../sheets/item/BladesProjectSheet.js";
import BladesClockKey from "../../classes/BladesClocks.js";
class BladesProject extends BladesItem {
    // #region INITIALIZATION ~
    static async Initialize() {
        Object.assign(globalThis, { BladesProject, BladesProjectSheet });
        Items.registerSheet("blades", BladesProjectSheet, { types: ["project"], makeDefault: true });
        return loadTemplates(["systems/eunos-blades/templates/items/project-sheet.hbs"]);
    }
    // #endregion
    static IsType(doc) {
        return super.IsType(doc, BladesItemType.project);
    }
    static async create(data, options = {}) {
        const project = (await super.create(data, { ...options, renderSheet: false }));
        if (!project._clockKey) {
            project._clockKey = await BladesClockKey.Create({
                name: project.name,
                target: project,
                targetKey: "system.clocksData",
                isNameVisible: false,
                isSpotlit: false,
                isVisible: true,
                displayMode: ClockKeyDisplayMode.clocks
                // oneKeyIndex: U.gsap.utils.random(0, 4, 1) as OneKeyImgIndex
            }, [{
                    name: "",
                    index: 0,
                    color: ClockColor.yellow,
                    value: 0,
                    max: 8,
                    isVisible: true,
                    isActive: true,
                    isNameVisible: false,
                    isHighlighted: false
                }]);
        }
        return project;
    }
    _clockKey;
    get clockKey() {
        if (this._clockKey) {
            return this._clockKey;
        }
        const keysData = Object.values(this.system.clocksData);
        if (keysData.length === 0) {
            throw new Error(`ClockKey not initialized for Project ${this.name}`);
        }
        let keyID;
        if (keysData.length === 1) {
            keyID = keysData[0].id;
        }
        else if (this.isEmbedded) {
            // Find the key data with a targetID that includes the parent document's id
            keyID = keysData.find((keyData) => keyData.targetID.includes(this.parent?.id))?.id;
            if (!keyID) {
                throw new Error(`ClockKey not initialized for Project ${this.name} embedded in document '${this.parent?.name}'.`);
            }
        }
        else {
            // Find the key of form 'Item.<IDString>' in the ClockKeys collection
            keyID = keysData.find((keyData) => /^Item\.[^.]{16}$/.exec(keyData.targetID))?.id;
            if (!keyID) {
                throw new Error(`ClockKey not initialized for Project ${this.name}.`);
            }
        }
        this._clockKey = game.eunoblades.ClockKeys.get(keyID) ?? new BladesClockKey(this.system.clocksData[keyID]);
        if (!this._clockKey) {
            throw new Error(`ClockKey not initialized for Project ${this.name}`);
        }
        return this._clockKey;
    }
    get ownerName() {
        if (this.parent) {
            return this.parent.name;
        }
        return undefined;
    }
    get currentClock() {
        return this.clockKey.currentClock;
    }
    get isComplete() {
        return this.clockKey.isComplete;
    }
    get rollOppClock() { return this.currentClock?.data; }
    async advanceClock(segments = 1) {
        if (!this.currentClock) {
            return undefined;
        }
        return this.currentClock.fillSegments(segments);
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
            case Factor.tier: return this.system.tier.value;
            case Factor.quality: return this.getFactorTotal(Factor.tier);
            // no default
        }
        return 0;
    }
    get rollOppImg() { return ""; }
    get keyElem() {
        if (!this.clockKey) {
            return undefined;
        }
        return $(`#${this.clockKey.id}`)[0];
    }
    get currentClockElem() {
        if (!this.keyElem) {
            return undefined;
        }
        if (!this.currentClock) {
            return undefined;
        }
        return $(this.keyElem).find(`.clock[data-id="${this.currentClock.id}"]`)[0];
    }
}
export default BladesProject;
