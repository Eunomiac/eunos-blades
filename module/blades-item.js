/* ****▌███████████████████████████████████████████████████████████████████████████▐**** *\
|*     ▌████░░░░░░░░░░░ Euno's Blades in the Dark for Foundry VTT ░░░░░░░░░░░░░████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░ by Eunomiac ░░░░░░░░░░░░░██████████████████▐     *|
|*     ▌████████████████████████████  License █ v0.1.0 ████████████████████████████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░░░░░░  ░░░░░░░░░░░░░░░░░░███████████████████▐     *|
\* ****▌███████████████████████████████████████████████████████████████████████████▐**** */

import C, { SVGDATA, BladesActorType, BladesItemType, Tag, BladesPhase, RollModCategory, Factor, RollModStatus } from "./core/constants.js";
import U from "./core/utilities.js";
import BladesActor from "./blades-actor.js";
class BladesItem extends Item {

    static async create(data, options = {}) {
        if (Array.isArray(data)) {
            data = data[0];
        }
        data.system = data.system ?? {};
        eLog.checkLog2("item", "BladesItem.create(data,options)", { data, options });

        data.system.world_name = data.system.world_name ?? data.name.replace(/[^A-Za-z_0-9 ]/g, "").trim().replace(/ /g, "_");
        return super.create(data, options);
    }

    static get All() { return game.items; }
    static Get(itemRef) {
        if (itemRef instanceof BladesItem) {
            return itemRef;
        }
        if (U.isDocID(itemRef)) {
            return BladesItem.All.get(itemRef);
        }
        return BladesItem.All.find((a) => a.system.world_name === itemRef)
            || BladesItem.All.find((a) => a.name === itemRef);
    }
    static GetTypeWithTags(docType, ...tags) {
        if (Array.isArray(docType)) {
            return docType
                .map((dType) => BladesItem.All.filter((item) => item.type === dType))
                .flat();
        }
        return BladesItem.All.filter((item) => item.type === docType)
            .filter((item) => item.hasTag(...tags));
    }
    static IsType(doc, ...types) {
        const typeSet = new Set(types);
        return doc instanceof BladesItem && typeSet.has(doc.type);
    }
    get tags() { return this.system.tags ?? []; }
    hasTag(...tags) {
        return tags.every((tag) => this.tags.includes(tag));
    }
    async addTag(...tags) {
        const curTags = this.tags;
        tags.forEach((tag) => {
            if (curTags.includes(tag)) {
                return;
            }
            curTags.push(tag);
        });
        this.update({ "system.tags": curTags });
    }
    async remTag(...tags) {
        const curTags = this.tags.filter((tag) => !tags.includes(tag));
        this.update({ "system.tags": curTags });
    }
    get tooltip() {
        const tooltipText = [
            this.system.concept,
            this.system.rules,
            this.system.notes
        ].filter(Boolean).join("");
        if (tooltipText) {
            return (new Handlebars.SafeString(tooltipText)).toString();
        }
        return undefined;
    }
    dialogCSSClasses = "";
    getFactorTotal(factor) {
        switch (factor) {
            case Factor.tier: {
                if (BladesItem.IsType(this, BladesItemType.cohort_gang)) {
                    return this.system.tier.value + (this.parent?.getFactorTotal(Factor.tier) ?? 0);
                }
                if (BladesItem.IsType(this, BladesItemType.cohort_expert)) {
                    return this.system.tier.value + (this.parent?.getFactorTotal(Factor.tier) ?? 0);
                }
                if (BladesItem.IsType(this, BladesItemType.gear)) {
                    return this.system.tier.value + (this.parent?.getFactorTotal(Factor.tier) ?? 0);
                }
                return this.system.tier.value;
            }
            case Factor.quality: {
                if (BladesItem.IsType(this, BladesItemType.cohort_gang)) {
                    return this.getFactorTotal(Factor.tier) + (this.system.quality_bonus ?? 0);
                }
                if (BladesItem.IsType(this, BladesItemType.cohort_expert)) {
                    return this.getFactorTotal(Factor.tier) + (this.system.quality_bonus ?? 0) + 1;
                }
                if (BladesItem.IsType(this, BladesItemType.gear)) {
                    return this.getFactorTotal(Factor.tier)
                        + (this.hasTag("Fine") ? 1 : 0)
                        + (this.parent?.getTaggedItemBonuses(this.tags) ?? 0)
                        + (this.parent?.crew ? this.parent.crew.getTaggedItemBonuses(this.tags) : 0);
                }
                if (BladesItem.IsType(this, BladesItemType.design)) {
                    return this.system.min_quality;
                }
                return this.getFactorTotal(Factor.tier);
            }
            case Factor.scale: {
                if (BladesItem.IsType(this, BladesItemType.cohort_gang)) {
                    return this.getFactorTotal(Factor.tier) + (this.system.scale_bonus ?? 0);
                }
                if (BladesItem.IsType(this, BladesItemType.cohort_expert)) {
                    return 0 + (this.system.scale_bonus ?? 0);
                }
                if (BladesItem.IsType(this, BladesItemType.location)) {
                    return this.system.scale;
                }
                return 0;
            }
            case Factor.magnitude: {
                if (BladesItem.IsType(this, BladesItemType.ritual)) {
                    return this.system.magnitude.value;
                }
                return 0;
            }
        }
        return 0;
    }
    
    async archive() {
        await this.addTag(Tag.System.Archived);
        return this;
    }
    async unarchive() {
        await this.remTag(Tag.System.Archived);
        return this;
    }
    
    
    get phase() { return BladesItem.IsType(this, BladesItemType.gm_tracker) && this.system.phase; }
    set phase(phase) {
        if (phase && BladesItem.IsType(this, BladesItemType.gm_tracker)) {
            this.update({ "system.phase": phase });
        }
    }
    
    
    get rollModsData() {
        const { roll_mods } = this.system;
        if (!roll_mods) {
            return [];
        }
        const rollModsData = roll_mods.map((modString) => {
            const pStrings = modString.split(/@/);
            const nameString = U.pullElement(pStrings, (v) => typeof v === "string" && /^na/i.test(v));
            const nameVal = (typeof nameString === "string" && nameString.replace(/^.*:/, ""));
            if (!nameVal) {
                throw new Error(`RollMod Missing Name: '${modString}'`);
            }
            const catString = U.pullElement(pStrings, (v) => typeof v === "string" && /^cat/i.test(v));
            const catVal = (typeof catString === "string" && catString.replace(/^.*:/, ""));
            if (!catVal || !(catVal in RollModCategory)) {
                throw new Error(`RollMod Missing Category: '${modString}'`);
            }
            const posNegString = (U.pullElement(pStrings, (v) => typeof v === "string" && /^p/i.test(v)) || "posNeg:positive");
            const posNegVal = posNegString.replace(/^.*:/, "");
            const rollModData = {
                id: `${nameVal}-${posNegVal}-${catVal}`,
                name: nameVal,
                category: catVal,
                base_status: RollModStatus.ToggledOff,
                modType: "general",
                value: 1,
                posNeg: posNegVal,
                tooltip: ""
            };
            pStrings.forEach((pString) => {
                const [keyString, valString] = pString.split(/:/);
                let val = /\|/.test(valString) ? valString.split(/\|/) : valString;
                let key;
                if (/^stat/i.test(keyString)) {
                    key = "base_status";
                }
                else if (/^val/i.test(keyString)) {
                    key = "value";
                }
                else if (/^eff|^ekey/i.test(keyString)) {
                    key = "effectKeys";
                }
                else if (/^side|^ss/i.test(keyString)) {
                    key = "sideString";
                }
                else if (/^s.*ame/i.test(keyString)) {
                    key = "source_name";
                }
                else if (/^tool|^tip/i.test(keyString)) {
                    key = "tooltip";
                }
                else if (/^ty/i.test(keyString)) {
                    key = "modType";
                }
                else if (/^c.*r?.*ty/i.test(keyString)) {
                    key = "conditionalRollTypes";
                }
                else if (/^a.*r?.*y/i.test(keyString)) {
                    key = "autoRollTypes";
                }
                else if (/^c.*r?.*tr/i.test(keyString)) {
                    key = "conditionalRollTraits";
                }
                else if (/^a.*r?.*tr/i.test(keyString)) {
                    key = "autoRollTraits";
                }
                else {
                    throw new Error(`Bad Roll Mod Key: ${keyString}`);
                }
                if (key === "base_status" && val === "Conditional") {
                    val = RollModStatus.Hidden;
                }
                Object.assign(rollModData, { [key]: ["value"].includes(key)
                        ? U.pInt(val)
                        : (["effectKeys", "conditionalRollTypes", "autoRollTypes,", "conditionalRollTraits", "autoRollTraits"].includes(key)
                            ? [val].flat()
                            : val.replace(/%COLON%/g, ":")) });
            });
            return rollModData;
        });
        
        return rollModsData;
    }
    get rollFactors() {
        const factors = {
            [BladesItemType.ability]: [],
            [BladesItemType.background]: [],
            [BladesItemType.clock_keeper]: [],
            [BladesItemType.cohort_gang]: [Factor.quality, Factor.scale],
            [BladesItemType.cohort_expert]: [Factor.quality, Factor.scale],
            [BladesItemType.crew_ability]: [],
            [BladesItemType.crew_reputation]: [],
            [BladesItemType.crew_playbook]: [],
            [BladesItemType.crew_upgrade]: [],
            [BladesItemType.feature]: [],
            [BladesItemType.gm_tracker]: [],
            [BladesItemType.heritage]: [],
            [BladesItemType.gear]: [Factor.quality],
            [BladesItemType.playbook]: [],
            [BladesItemType.preferred_op]: [],
            [BladesItemType.stricture]: [],
            [BladesItemType.vice]: [],
            [BladesItemType.project]: [Factor.quality],
            [BladesItemType.ritual]: [Factor.magnitude],
            [BladesItemType.design]: [Factor.quality],
            [BladesItemType.location]: [Factor.tier, Factor.quality, Factor.scale],
            [BladesItemType.score]: [Factor.tier]
        }[this.type];
        const factorData = {};
        factors.forEach((factor, i) => {
            const factorTotal = this.getFactorTotal(factor);
            factorData[factor] = {
                name: factor,
                value: factorTotal,
                max: factorTotal,
                baseVal: factorTotal,
                display: [Factor.tier, Factor.quality].includes(factor) ? U.romanizeNum(factorTotal) : `${factorTotal}`,
                isActive: i === 0,
                isPrimary: i === 0,
                isDominant: false,
                highFavorsPC: true,
                cssClasses: `factor-gold${i === 0 ? " factor-main" : ""}`
            };
        });
        return factorData;
    }
    get rollOppImg() { return this.img ?? undefined; }

    prepareDerivedData() {
        if (BladesItem.IsType(this, BladesItemType.clock_keeper)) {
            this._prepareClockKeeperData(this.system);
        }
        if (BladesItem.IsType(this, BladesItemType.cohort_gang, BladesItemType.cohort_expert)) {
            this._prepareCohortData(this.system);
        }
        if (BladesItem.IsType(this, BladesItemType.crew_playbook)) {
            this._preparePlaybookData(this.system);
        }
        if (BladesItem.IsType(this, BladesItemType.gm_tracker)) {
            this._prepareGmTrackerData(this.system);
        }
        if (BladesItem.IsType(this, BladesItemType.gear)) {
            this._prepareGearData(this.system);
        }
        if (BladesItem.IsType(this, BladesItemType.playbook)) {
            this._preparePlaybookData(this.system);
        }
    }
    _prepareClockKeeperData(system) {
        if (!BladesItem.IsType(this, BladesItemType.clock_keeper)) {
            return;
        }
        system.scenes = game.scenes.map((scene) => ({ id: scene.id, name: scene.name ?? "" }));
        system.targetScene ??= game.scenes.current?.id || null;
        system.clock_keys = Object.fromEntries(Object.entries(system.clock_keys ?? {})
            .filter(([keyID, keyData]) => keyData && keyData.id)
            .map(([keyID, keyData]) => {
            if (keyData === null) {
                return [keyID, null];
            }
            keyData.clocks = Object.fromEntries(Object.entries(keyData.clocks ?? {})
                .filter(([clockNum, clockData]) => Boolean(clockData)));
            return [keyID, keyData];
        }));
    }
    _prepareCohortData(system) {
        if (!BladesItem.IsType(this, BladesItemType.cohort_gang, BladesItemType.cohort_expert)) {
            return;
        }
        system.tier.name = "Quality";
        const subtypes = U.unique(Object.values(system.subtypes)
            .map((subtype) => subtype.trim())
            .filter((subtype) => /[A-Za-z]/.test(subtype)));
        const elite_subtypes = U.unique([
            ...Object.values(system.elite_subtypes),
            ...(this.parent?.upgrades ?? [])
                .filter((upgrade) => /^Elite/.test(upgrade.name ?? ""))
                .map((upgrade) => (upgrade.name ?? "").trim().replace(/^Elite /, ""))
        ]
            .map((subtype) => subtype.trim())
            .filter((subtype) => /[A-Za-z]/.test(subtype) && subtypes.includes(subtype)));
        system.subtypes = Object.fromEntries(subtypes.map((subtype, i) => [`${i + 1}`, subtype]));
        system.elite_subtypes = Object.fromEntries(elite_subtypes.map((subtype, i) => [`${i + 1}`, subtype]));
        system.edges = Object.fromEntries(Object.values(system.edges ?? [])
            .filter((edge) => /[A-Za-z]/.test(edge))
            .map((edge, i) => [`${i + 1}`, edge.trim()]));
        system.flaws = Object.fromEntries(Object.values(system.flaws ?? [])
            .filter((flaw) => /[A-Za-z]/.test(flaw))
            .map((flaw, i) => [`${i + 1}`, flaw.trim()]));
        system.quality = this.getFactorTotal(Factor.quality);
        if (BladesItem.IsType(this, BladesItemType.cohort_gang)) {
            if ([...subtypes, ...elite_subtypes].includes(Tag.GangType.Vehicle)) {
                system.scale = this.getFactorTotal(Factor.scale);
                system.scaleExample = "(1 vehicle)";
            }
            else {
                system.scale = this.getFactorTotal(Factor.scale);
                const scaleIndex = Math.min(6, system.scale);
                system.scaleExample = C.ScaleExamples[scaleIndex];
                system.subtitle = C.ScaleSizes[scaleIndex];
            }
            if (subtypes.length + elite_subtypes.length === 0) {
                system.subtitle = system.subtitle.replace(/\s+of\s*/g, "");
            }
        }
        else {
            system.scale = 0;
            system.scaleExample = [...subtypes, ...elite_subtypes].includes("Pet") ? "(1 animal)" : "(1 person)";
            system.subtitle = "An Expert";
        }
        if (subtypes.length + elite_subtypes.length > 0) {
            if ([...subtypes, ...elite_subtypes].includes(Tag.GangType.Vehicle)) {
                system.subtitle = C.VehicleDescriptors[Math.min(6, this.getFactorTotal(Factor.tier))];
            }
            else {
                system.subtitle += ` ${U.oxfordize([
                    ...subtypes.filter((subtype) => !elite_subtypes.includes(subtype)),
                    ...elite_subtypes.map((subtype) => `Elite ${subtype}`)
                ], false, "&")}`;
            }
        }
    }
    _prepareGmTrackerData(system) {
        if (!BladesItem.IsType(this, BladesItemType.gm_tracker)) {
            return;
        }
        system.phases = Object.values(BladesPhase);
    }
    _prepareGearData(system) {
        if (!BladesItem.IsType(this, BladesItemType.gear)) {
            return;
        }
        system.tier.name = "Quality";
    }
    _preparePlaybookData(system) {
        if (!BladesItem.IsType(this, BladesItemType.playbook, BladesItemType.crew_playbook)) {
            return;
        }
        const expClueData = {};
        [...Object.values(system.experience_clues).filter((clue) => /[A-Za-z]/.test(clue)), " "].forEach((clue, i) => { expClueData[(i + 1).toString()] = clue; });
        system.experience_clues = expClueData;
        eLog.checkLog3("experienceClues", { expClueData });
        if (BladesItem.IsType(this, BladesItemType.playbook)) {
            const gatherInfoData = {};
            [...Object.values(system.gather_info_questions).filter((question) => /[A-Za-z]/.test(question)), " "].forEach((question, i) => { gatherInfoData[(i + 1).toString()] = question; });
            system.gather_info_questions = gatherInfoData;
            eLog.checkLog3("gatherInfoQuestions", { gatherInfoData });
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
        if (!game.eunoblades.ClockKeeper) {
            return;
        }
        if (!game.eunoblades.ClockKeeper.overlayElement) {
            eLog.error("clocksOverlay", "[ClocksOverlay] Cannot locate overlay element.");
            return;
        }
        game.eunoblades.ClockKeeper.overlayElement.innerHTML = (await getTemplate("systems/eunos-blades/templates/overlays/clock-overlay.hbs"))({
            ...game.eunoblades.ClockKeeper.system,
            currentScene: game.scenes?.current.id,
            clockSizes: C.ClockSizes,
            svgData: SVGDATA
        });
        game.eunoblades.ClockKeeper.activateOverlayListeners();
    }
    async activateOverlayListeners() {
        if (!game?.user?.isGM) {
            return;
        }
        $("#clocks-overlay").find(".clock-frame").on("wheel", async (event) => {
            if (!event.currentTarget) {
                return;
            }
            if (!BladesItem.IsType(game.eunoblades.ClockKeeper, BladesItemType.clock_keeper)) {
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
            const max = U.pInt(clock$.data("size"));
            const newClockVal = U.gsap.utils.clamp(0, max, curClockVal + delta);
            if (curClockVal === newClockVal) {
                return;
            }
            await game.eunoblades.ClockKeeper.update({
                [`system.clock_keys.${keyID}.clocks.${clockNum}.value`]: `${newClockVal}`
            });
        });

        $("#clocks-overlay").find(".key-label").on({
            click: async (event) => {
                if (!event.currentTarget) {
                    return;
                }
                if (!BladesItem.IsType(game.eunoblades.ClockKeeper, BladesItemType.clock_keeper)) {
                    return;
                }
                event.preventDefault();
                const keyID = $(event.currentTarget).data("keyId");
                eLog.checkLog3("clocksOverlay", "Updating Key isActive", { current: game.eunoblades.ClockKeeper.system.clock_keys[keyID]?.isActive, update: !(game.eunoblades.ClockKeeper.system.clock_keys[keyID]?.isActive) });
                await game.eunoblades.ClockKeeper.update({ [`system.clock_keys.${keyID}.isActive`]: !(game.eunoblades.ClockKeeper.system.clock_keys[keyID]?.isActive) });
            },
            contextmenu: () => {
                if (!game?.user?.isGM) {
                    return;
                }
                game.eunoblades.ClockKeeper?.sheet?.render(true);
            }
        });
    }
    async addClockKey() {
        if (!BladesItem.IsType(game.eunoblades.ClockKeeper, BladesItemType.clock_keeper)) {
            return undefined;
        }
        const keyID = randomID();
        return game.eunoblades.ClockKeeper.update({ [`system.clock_keys.${keyID}`]: {
                id: keyID,
                display: "",
                isVisible: false,
                isNameVisible: true,
                isActive: true,
                scene: game.eunoblades.ClockKeeper.system.targetScene,
                numClocks: 1,
                clocks: {
                    1: {
                        display: "",
                        isVisible: false,
                        isNameVisible: false,
                        isActive: false,
                        color: "yellow",
                        max: 4,
                        value: 0
                    }
                }
            } });
    }
    async deleteClockKey(keyID) {
        if (!BladesItem.IsType(game.eunoblades.ClockKeeper, BladesItemType.clock_keeper)) {
            return undefined;
        }
        return game.eunoblades.ClockKeeper.update({ [`system.clock_keys.-=${keyID}`]: null });
    }
    async setKeySize(keyID, keySize = 1) {
        if (!BladesItem.IsType(game.eunoblades.ClockKeeper, BladesItemType.clock_keeper)) {
            return undefined;
        }
        keySize = parseInt(`${keySize}`);
        const updateData = {
            [`system.clock_keys.${keyID}.numClocks`]: keySize
        };
        const clockKey = game.eunoblades.ClockKeeper.system.clock_keys[keyID];
        if (!clockKey) {
            return game.eunoblades.ClockKeeper;
        }
        const currentSize = Object.values(clockKey.clocks).length;
        if (currentSize < keySize) {
            for (let i = (currentSize + 1); i <= keySize; i++) {
                updateData[`system.clock_keys.${keyID}.clocks.${i}`] = {
                    display: "",
                    value: 0,
                    max: 4,
                    color: "yellow",
                    isVisible: false,
                    isNameVisible: true,
                    isActive: false
                };
            }
        }
        else if (currentSize > keySize) {
            for (let i = (keySize + 1); i <= currentSize; i++) {
                updateData[`system.clock_keys.${keyID}.clocks.-=${i}`] = null;
            }
        }
        eLog.checkLog("clock_key", "Clock Key Update Data", { clockKey, updateData });
        return game.eunoblades.ClockKeeper.update(updateData);
    }

    async _onUpdate(changed, options, userId) {
        await super._onUpdate(changed, options, userId);
        if (BladesItem.IsType(this, BladesItemType.gm_tracker, BladesItemType.clock_keeper, BladesItemType.location, BladesItemType.score)) {
            BladesActor.GetTypeWithTags(BladesActorType.pc).forEach((actor) => actor.render());
        }
        if (BladesItem.IsType(this, BladesItemType.clock_keeper)) {
            socketlib.system.executeForEveryone("renderOverlay");
        }
    }
}
export default BladesItem;