/* ****▌███████████████████████████████████████████████████████████████████████████▐**** *\
|*     ▌████░░░░░░░░░░░ Euno's Blades in the Dark for Foundry VTT ░░░░░░░░░░░░░████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░ by Eunomiac ░░░░░░░░░░░░░██████████████████▐     *|
|*     ▌████████████████████████████  License █ v0.1.0 ████████████████████████████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░░░░░░  ░░░░░░░░░░░░░░░░░░███████████████████▐     *|
\* ****▌███████████████████████████████████████████████████████████████████████████▐**** */

import C, { SVGDATA, BladesItemType } from "./core/constants.js";
import U from "./core/utilities.js";
import BladesActor from "./blades-actor.js";
class BladesItem extends Item {
    static CategoryTypes = {
        ability: BladesItemType.ability,
        background: BladesItemType.background,
        cohort: BladesItemType.cohort,
        crew_ability: BladesItemType.crew_ability,
        crew_reputation: BladesItemType.crew_reputation,
        crew_playbook: BladesItemType.crew_playbook,
        crew_upgrade: BladesItemType.crew_upgrade,
        faction: BladesItemType.faction,
        feature: BladesItemType.feature,
        heritage: BladesItemType.heritage,
        item: BladesItemType.item,
        playbook: BladesItemType.playbook,
        preferred_op: BladesItemType.preferred_op,
        stricture: BladesItemType.stricture,
        vice: BladesItemType.vice
    };
    static CategoryDefaults = {
        [BladesItemType.ability]: "ability",
        [BladesItemType.background]: "background",
        [BladesItemType.cohort]: "cohort",
        [BladesItemType.crew_ability]: "crew_ability",
        [BladesItemType.crew_reputation]: "crew_reputation",
        [BladesItemType.crew_playbook]: "crew_playbook",
        [BladesItemType.crew_upgrade]: "crew_upgrade",
        [BladesItemType.faction]: "faction",
        [BladesItemType.feature]: "feature",
        [BladesItemType.heritage]: "heritage",
        [BladesItemType.item]: "item",
        [BladesItemType.playbook]: "playbook",
        [BladesItemType.preferred_op]: "preferred_op",
        [BladesItemType.stricture]: "stricture",
        [BladesItemType.vice]: "vice"
    };
    static CategoryFilters = {};
    static CategoryUniques = {
        ability: false,
        background: true,
        clock_keeper: false,
        cohort: false,
        crew_ability: false,
        crew_reputation: true,
        crew_playbook: true,
        crew_upgrade: false,
        faction: false,
        feature: false,
        gm_tracker: false,
        heritage: true,
        item: false,
        playbook: true,
        preferred_op: true,
        stricture: false,
        vice: true
    };
    static get All() { return game.items; }
    static async getAllGlobalItems() {
        const items = Array.from(BladesItem.All);
        const packs = game.packs.filter((pack) => C.ItemTypes.includes(pack.metadata.name));
        const packItems = (await Promise.all(packs.map(async (pack) => {
            const packDocs = await pack.getDocuments();
            return packDocs.filter((packItem) => !items.some((itm) => itm.system.world_name === packItem.system.world_name));
        }))).flat();
        items.push(...packItems);
        items.sort(function (a, b) {
            const nameA = (a.name ?? "").toUpperCase();
            const nameB = (b.name ?? "").toUpperCase();
            return nameA.localeCompare(nameB);
        });
        return items;
    }
    static async getItemsByCat(itemCat) {
        if (!(itemCat in BladesItem.CategoryTypes)) {
            return [];
        }
        const allItems = await BladesItem.getAllGlobalItems();
        const allTypeItems = allItems.filter((item) => item.type === BladesItem.CategoryTypes[itemCat]);
        if (itemCat in BladesItem.CategoryFilters) {
            return BladesItem.CategoryFilters[itemCat](allTypeItems);
        }
        return allTypeItems;
    }

    static async GetGlobal(itemRef, itemCat) {
        if (itemCat) {
            if (!(itemCat in BladesItem.CategoryTypes)) {
                return null;
            }
            if (itemRef instanceof BladesItem) {
                if (itemRef.type !== BladesItem.CategoryTypes[itemCat]) {
                    return null;
                }
                itemRef = itemRef.system.world_name ?? itemRef.id;
            }
        }
        else if (itemRef instanceof BladesItem) {
            itemCat = itemRef.type;
            itemRef = itemRef.system.world_name ?? itemRef.id;
        }
        const items = await (itemCat ? BladesItem.getItemsByCat(itemCat) : BladesItem.getAllGlobalItems());
        if (U.isDocID(itemRef)) {
            return items.find((item) => item.id === itemRef) ?? null;
        }
        else {
            return items.find((item) => item.name === itemRef)
                ?? items.find((item) => item.system.world_name === itemRef)
                ?? null;
        }
    }
    static async GetPersonal(itemRef, parent) {
        if (!itemRef) {
            return null;
        }
        if (itemRef instanceof BladesItem && itemRef.id) {
            itemRef = itemRef.system.world_name ?? itemRef.id;
        }
        if (!itemRef) {
            return null;
        }
        let item;
        if (U.isDocID(itemRef)) {
            item = parent.items.find((item) => item.id === itemRef) ?? null;
        }
        else {
            item = parent.items.find((item) => item.name === itemRef)
                ?? parent.items.find((item) => item.system.world_name === itemRef)
                ?? null;
        }
        if (item) {
            return item;
        }
        item = await BladesItem.GetGlobal(itemRef);
        if (item) {
            return item;
        }
        return null;
    }

    static async Embed(itemRef, category, parent) {
        eLog.log2("[BladesItem.Embed(itemRef, category, parent)]", { itemRef, category, parent });
        if (!(category in BladesItem.CategoryTypes)) {
            return null;
        }
        if (U.isDocID(itemRef)) {
            const foundItem = parent.items.get(itemRef) ?? await BladesItem.GetGlobal(itemRef);
            if (foundItem) {
                itemRef = foundItem;
            }
        }
        if (itemRef instanceof BladesItem) {
            itemRef = itemRef.system.world_name;
        }

        const embItem = parent.items.find((i) => i.system?.world_name === itemRef);
        if (embItem) {
            await embItem.update({ "system.isArchived": false });
            return embItem;
        }

        const globalItem = await BladesItem.GetGlobal(itemRef);
        if (!globalItem?.id) {
            return null;
        }

        if (BladesItem.CategoryUniques[category]) {
            const categoryItems = await BladesItem.GetEmbeddedCategoryItems(category, parent);
            await Promise.all(categoryItems.map((i) => BladesItem.Remove(i, category, parent)));
        }

        return BladesItem.create([globalItem], { parent });
    }

    static async Remove(itemRef, category, parent, isFullRemoval = false) {
        eLog.log2("[BladesItem.Remove(itemRef, category, parent)]", { itemRef, category, parent });
        if (!(category in BladesItem.CategoryTypes)) {
            return;
        }

        const embItem = await BladesItem.GetPersonal(itemRef, parent);
        if (!embItem?.id) {
            return;
        }
        if (BladesItem.CategoryUniques[category] || isFullRemoval) {
            await embItem.delete();
        }
        else {
            await embItem.update({ "system.isArchived": true });
        }
    }

    static async GetEmbeddedItems(parent) {
        return Array.from(parent.items);
    }

    static async GetEmbeddedCategoryItems(cat, parent) {
        if (!(cat in BladesItem.CategoryTypes)) {
            return [];
        }
        const typeItems = parent.items.filter((item) => item.type === BladesItem.CategoryTypes[cat]);
        if (cat in BladesItem.CategoryFilters) {
            return BladesItem.CategoryFilters[cat](typeItems);
        }
        return typeItems;
    }

    static async GetActiveCategoryItems(cat, parent) {
        const embItems = await BladesItem.GetEmbeddedCategoryItems(cat, parent);
        return embItems.filter((item) => !item.isArchived);
    }

    static async GetGlobalCategoryItems(category, parent) {
        const globalItems = await BladesItem.getItemsByCat(category);
        if (!parent) {
            return globalItems;
        }
        const embItems = await BladesItem.GetEmbeddedCategoryItems(category, parent);
        const customizedItems = globalItems.map((gItem) => {
            return embItems.find((i) => i.system.world_name === gItem.system.world_name) ?? gItem;
        });
        return customizedItems;
    }
    async _preCreate(data, options, user) {
        await super._preCreate(data, options, user);
        if (user.id !== game.user?.id) {
            return;
        }
        if (this.parent?.documentName !== "Actor") {
            return;
        }
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
    get isArchived() { return this.system.isArchived; }
    get playbooks() { return this.system.playbooks ?? []; }
    get tooltip() {
        const tooltipText = [
            this.system.rules
        ].find((str) => Boolean(str));
        if (tooltipText) {
            return (new Handlebars.SafeString(tooltipText)).toString();
        }
        return tooltipText;
    }
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
    async isValidForDoc(doc) {
        let isValid = true;
        if (doc instanceof BladesActor) {
            if (["item", "crew_upgrade"].includes(this.type)) {
                isValid = Boolean(this.playbooks.includes("ANY") || (doc.playbookName && this.playbooks.includes(doc.playbookName)));
            }
            else if (this.type === "ability") {
                isValid = Boolean((doc.playbookName && this.playbooks.includes(doc.playbookName))
                    || (!this.playbooks.includes("Ghost")
                        && !this.playbooks.includes("Hull")
                        && !this.playbooks.includes("Vampire")));
            }
            if (!isValid) {
                return false;
            }

            if (this.type === "item") {
                isValid = (this.system.load ?? 0) <= doc.remainingLoad;
            }
            if (!isValid) {
                return false;
            }

            const activeItems = await BladesItem.GetActiveCategoryItems(this.type, doc);
            const dupeItems = activeItems
                .filter((item) => item.system.world_name === this.system.world_name);
            if (dupeItems.length) {
                isValid = (this.system.num_available ?? 1) > dupeItems.length;
            }
            if (!isValid) {
                return false;
            }

            for (let [dotKey, val] of Object.entries(flattenObject(this.system.prereqs ?? {}))) {
                if (dotKey.startsWith("item")) {
                    dotKey = dotKey.replace(/^item\.?/, "");
                    if (activeItems.filter((item) => getProperty(item, dotKey) === val).length === 0) {
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