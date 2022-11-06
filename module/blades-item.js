/* ****▌███████████████████████████████████████████████████████████████████████████▐**** *\
|*     ▌████░░░░░░░░░░░ Euno's Blades in the Dark for Foundry VTT ░░░░░░░░░░░░░████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░ by Eunomiac ░░░░░░░░░░░░░██████████████████▐     *|
|*     ▌████████████████████████████  License █ v0.1.0 ████████████████████████████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░░░░░░  ░░░░░░░░░░░░░░░░░░███████████████████▐     *|
\* ****▌███████████████████████████████████████████████████████████████████████████▐**** */

import H from "./core/helpers.js";
import C, { SVGDATA } from "./core/constants.js";
import U from "./core/utilities.js";
import BladesActor from "./blades-actor.js";
class BladesItem extends Item {
        static async getAllItemsByType(item_type, isIncludingPacks = false) {
        if (!game.items) {
            return [];
        }
        const items = game.items.filter((item) => item.type === item_type);
        if (isIncludingPacks || items.length === 0) {
            const pack = game.packs.find((pack) => pack.metadata.name === item_type);
            if (pack) {
                const pack_items = await pack.getDocuments();
                items.push(...pack_items);
            }
        }
        items.sort(function (a, b) {
            const nameA = a.data.name.toUpperCase();
            const nameB = b.data.name.toUpperCase();
            return nameA.localeCompare(nameB);
        });
        return items;
    }
    async _preCreate(data, options, user) {
        await super._preCreate(data, options, user);
        if (user.id !== game.user?.id) {
            return;
        }
        if (this.parent?.documentName !== "Actor") {
            return;
        }
        await this.parent.deleteEmbeddedDocuments("Item", H.removeDuplicatedItemType(data, this.parent));
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
    get tier() { return U.pInt(this.parent?.system?.tier); }
    get isCustomizedItem() { return this.isEmbedded && this.system.isCustomized; }
    isKept(actor) {
        if (this.type !== "ability") {
            return null;
        }
        const playbook = actor.playbookName;
        if (!playbook) {
            return null;
        }
        if (this.system.playbooks?.includes(actor.playbookName)) {
            return true;
        }
        if (["Ghost", "Hull", "Vampire"].includes(actor.playbookName) && this.system.keepAsGhost) {
            return true;
        }
        return false;
    }
    isValidForDoc(doc) {
        let isValid = true;
        if (doc instanceof BladesActor) {
            if (this.type === "item") {
                isValid = Boolean(this.system.playbooks.includes("ANY")
                    || (doc.playbookName && this.system.playbooks.includes(doc.playbookName)));
            }
            if (this.type === "ability") {
                isValid = Boolean((doc.playbookName && this.system.playbooks.includes(doc.playbookName))
                    || (!this.system.playbooks.includes("Ghost")
                        && !this.system.playbooks.includes("Hull")
                        && !this.system.playbooks.includes("Vampire")));
            }
            if (!isValid) {
                return false;
            }

            if ("load" in this.system) {
                isValid = this.system.load <= doc.remainingLoad;
            }
            if (!isValid) {
                return false;
            }

            isValid = doc.items.filter((i) => i.name === this.name).length < (this.system.num_available ?? 1);
            if (!isValid) {
                return false;
            }

            for (let [dotKey, val] of Object.entries(flattenObject(this.system.prereqs ?? {}))) {
                if (dotKey.startsWith("item")) {
                    dotKey = dotKey.replace(/^item\.?/, "");
                    if (doc.items.filter((item) => getProperty(item, dotKey) === val).length === 0) {
                        isValid = false;
                        break;
                    }
                }
                else {
                    if (getProperty(doc, dotKey) !== val) {
                        isValid = false;
                        break;
                    }
                }
            }
        }
        else {
            isValid = false;
        }
        return isValid;
    }
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
        $("#clocks-overlay").find(".clock-frame").on("wheel", async (event) => {
            if (!game?.user?.isGM) {
                return;
            }
            if (!event.currentTarget) {
                return;
            }
            if (!game.eunoblades.ClockKeeper) {
                return;
            }
            if (!(event.originalEvent instanceof WheelEvent)) {
                return;
            }
            event.preventDefault();
            const clock$ = $(event.currentTarget).closest(".clock");
            const [key] = clock$.closest(".clock-key");
            if (!(key instanceof HTMLElement)) {
                return;
            }
            const keyID = key.id;
            const clockNum = clock$.data("index");
            const curClockVal = U.pInt(clock$.data("value"));
            const delta = event.originalEvent.deltaY < 0 ? 1 : -1;
            const size = U.pInt(clock$.data("size"));
            const newClockVal = U.gsap.utils.clamp(0, size, curClockVal + delta);
            if (curClockVal === newClockVal) {
                return;
            }
            await this.update({
                [`system.clock_keys.${keyID}.clocks.${clockNum}.value`]: `${newClockVal}`
            });
            socketlib.system.executeForEveryone("renderOverlay");
        });
        $("#clocks-overlay").find(".clock").on("click", async (event) => {
            if (!event.currentTarget) {
                return;
            }
            if (!game.eunoblades.ClockKeeper) {
                return;
            }
            event.preventDefault();
            const [key] = $(event.currentTarget).closest(".clock-key");
            if (!(key instanceof HTMLElement)) {
                return;
            }
            $(key).toggleClass("key-faded");
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
    async _onUpdate(changed, options, userId) {
        await super._onUpdate(changed, options, userId);
        if (this.isEmbedded && "isCustomized" in this.system && this.system.isCustomized === false) {
            this.update({ "system.isCustomized": true });
        }
    }
    _overlayElement;
    get overlayElement() {
        this._overlayElement ??= $("#clocks-overlay")[0];
        if (!this._overlayElement) {
            $("body.vtt.game.system-eunos-blades").append("<section id=\"clocks-overlay\"></section>");
            [this._overlayElement] = $("#clocks-overlay");
        }
        return this._overlayElement;
    }
    async renderOverlay() {
        if (!game.scenes?.current) {
            return;
        }
        this.overlayElement.innerHTML = (await getTemplate("systems/eunos-blades/templates/overlays/clock-overlay.hbs"))({
            ...this.system,
            currentScene: game.scenes?.current.id,
            clockSizes: C.ClockSizes,
            svgData: SVGDATA
        });
        this.activateOverlayListeners();
    }
}
export default BladesItem;