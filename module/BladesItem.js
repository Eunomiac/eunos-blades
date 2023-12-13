import C, { BladesItemType, Tag, Factor } from "./core/constants.js";
import U from "./core/utilities.js";
import { BladesCrew, BladesPC } from "./documents/BladesActorProxy.js";
import { BladesRollMod } from "./classes/BladesRoll.js";
import BladesPushAlert from "./classes/BladesPushAlert.js";
class BladesItem extends Item {
    // #region Static Overrides: Create ~
    static async create(data, options = {}) {
        if (Array.isArray(data)) {
            data = data[0];
        }
        data.system = data.system ?? {};
        eLog.checkLog2("item", "BladesItem.create(data,options)", { data, options });
        // ~ Create world_name
        data.system.world_name = data.system.world_name ?? data.name.replace(/[^A-Za-z_0-9 ]/g, "").trim().replace(/ /g, "_");
        return super.create(data, options);
    }
    // #endregion
    // #region BladesDocument Implementation
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
        await this.update({ "system.tags": curTags });
    }
    async remTag(...tags) {
        const curTags = this.tags.filter((tag) => !tags.includes(tag));
        await this.update({ "system.tags": curTags });
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
                    let thisQuality = this.getFactorTotal(Factor.tier)
                        + (this.hasTag("Fine") ? 1 : 0);
                    if (BladesPC.IsType(this.parent)) {
                        thisQuality += this.parent.getTaggedItemBonuses(this.tags);
                    }
                    return thisQuality;
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
                return 0;
            }
            case Factor.magnitude: {
                if (BladesItem.IsType(this, BladesItemType.ritual)) {
                    return this.system.magnitude.value;
                }
                return 0;
            }
            default: return 0;
        }
    }
    // #endregion
    // #region BladesItemDocument Implementation
    async archive() {
        await this.addTag(Tag.System.Archived);
        return this;
    }
    async unarchive() {
        await this.remTag(Tag.System.Archived);
        return this;
    }
    // #endregion
    // #region BladesRoll Implementation
    get rollFactors() {
        const factorsMap = {
            [BladesItemType.cohort_gang]: [Factor.quality, Factor.scale],
            [BladesItemType.cohort_expert]: [Factor.quality, Factor.scale],
            [BladesItemType.gear]: [Factor.quality],
            [BladesItemType.project]: [Factor.quality],
            [BladesItemType.ritual]: [Factor.magnitude],
            [BladesItemType.design]: [Factor.quality]
        };
        if (!factorsMap[this.type]) {
            return {};
        }
        const factors = factorsMap[this.type];
        const factorData = {};
        (factors ?? []).forEach((factor, i) => {
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
    // #region BladesRoll.PrimaryDoc Implementation
    get rollPrimaryID() { return this.id; }
    get rollPrimaryDoc() { return this; }
    get rollPrimaryName() { return this.name; }
    get rollPrimaryType() {
        if (![
            BladesItemType.cohort_gang,
            BladesItemType.cohort_expert,
            BladesItemType.gm_tracker,
            BladesItemType.score
        ].includes(this.type)) {
            throw new Error(`BladesItem of type '${this.type}' ("${this.name}") cannot be RollPrimary.`);
        }
        return this.type;
    }
    get rollPrimaryImg() { return this.img; }
    get rollModsData() {
        // Const rollModData = BladesRollMod.ParseDocRollMods(this);
        // Add roll mods from COHORT harm
        return BladesRollMod.ParseDocRollMods(this);
    }
    async applyHarm(amount, _name) {
        if (BladesItem.IsType(this, BladesItemType.cohort_expert, BladesItemType.cohort_gang)) {
            const curHarm = this.system.harm.value;
            let newHarm;
            if (amount > curHarm) {
                newHarm = amount;
            }
            else {
                newHarm = curHarm + 1;
            }
            const harmVerb = ["is Weakened", "is Impaired", "has been Broken", "has been Killed!"];
            const harmEffect = [
                "They act with Reduced Effect.",
                "They act with Reduced Effect and suffer -1d to all rolls.",
                "They cannot do anything until they recover.",
                "You may replace them during Downtime."
            ];
            await this.update({ "system.harm": amount });
            BladesPushAlert.Get().pushToAll("GM", `${this.name} ${harmVerb[newHarm - 1]}`, harmEffect[newHarm - 1], "harm-alert");
        }
    }
    async applyWorsePosition() {
        if (BladesItem.IsType(this, BladesItemType.cohort_expert, BladesItemType.cohort_gang)) {
            this.setFlag("eunos-blades", "isWorsePosition", true);
        }
    }
    // #endregion
    // #region BladesRoll.OppositionDoc Implementation
    get rollOppID() { return this.id; }
    get rollOppDoc() { return this; }
    get rollOppImg() { return this.img; }
    get rollOppName() { return this.name; }
    get rollOppSubName() { return ""; }
    get rollOppType() {
        if (![
            BladesItemType.cohort_gang,
            BladesItemType.cohort_expert,
            BladesItemType.gm_tracker,
            BladesItemType.score,
            BladesItemType.location,
            BladesItemType.project,
            BladesItemType.design,
            BladesItemType.ritual
        ].includes(this.type)) {
            throw new Error(`BladesItem of type '${this.type}' ("${this.name}") cannot be RollOpposition.`);
        }
        return this.type;
    }
    get rollOppModsData() { return []; }
    // #endregion
    // #region BladesRoll.ParticipantDoc Implementation
    get rollParticipantID() { return this.id; }
    get rollParticipantDoc() { return this; }
    get rollParticipantIcon() { return this.img; }
    get rollParticipantName() { return this.name; }
    get rollParticipantType() {
        if (![
            BladesItemType.cohort_gang,
            BladesItemType.cohort_expert,
            BladesItemType.gm_tracker
        ].includes(this.type)) {
            throw new Error(`BladesItem of type '${this.type}' ("${this.name}") cannot be RollParticipant.`);
        }
        return this.type;
    }
    get rollParticipantModsData() { return []; }
    // #endregion
    // #endregion
    // #region PREPARING DERIVED DATA
    prepareDerivedData() {
        super.prepareDerivedData();
        if (BladesItem.IsType(this, BladesItemType.cohort_gang, BladesItemType.cohort_expert)) {
            this._prepareCohortData(this.system);
        }
        if (BladesItem.IsType(this, BladesItemType.crew_playbook)) {
            this._preparePlaybookData(this.system);
        }
        if (BladesItem.IsType(this, BladesItemType.gear)) {
            this._prepareGearData(this.system);
        }
        if (BladesItem.IsType(this, BladesItemType.playbook)) {
            this._preparePlaybookData(this.system);
        }
    }
    _prepareCohortData(system) {
        if (!BladesItem.IsType(this, BladesItemType.cohort_gang, BladesItemType.cohort_expert)) {
            return;
        }
        system.tier.name = "Quality";
        const subtypes = U.unique(Object.values(system.subtypes)
            .map((subtype) => subtype.trim())
            .filter((subtype) => /[A-Za-z]/.test(subtype)));
        const eliteSubtypes = [
            ...Object.values(system.elite_subtypes)
        ];
        if (BladesCrew.IsType(this.parent)) {
            eliteSubtypes.push(...this.parent.upgrades
                .filter((upgrade) => (upgrade.name ?? "").startsWith("Elite"))
                .map((upgrade) => (upgrade.name ?? "").trim().replace(/^Elite /, "")));
        }
        system.subtypes = Object.fromEntries(subtypes.map((subtype, i) => [`${i + 1}`, subtype]));
        system.elite_subtypes = Object.fromEntries(U.unique(eliteSubtypes
            .map((subtype) => subtype.trim())
            .filter((subtype) => /[A-Za-z]/.test(subtype) && subtypes.includes(subtype)))
            .map((subtype, i) => [`${i + 1}`, subtype]));
        system.edges = Object.fromEntries(Object.values(system.edges ?? [])
            .filter((edge) => /[A-Za-z]/.test(edge))
            .map((edge, i) => [`${i + 1}`, edge.trim()]));
        system.flaws = Object.fromEntries(Object.values(system.flaws ?? [])
            .filter((flaw) => /[A-Za-z]/.test(flaw))
            .map((flaw, i) => [`${i + 1}`, flaw.trim()]));
        system.quality = this.getFactorTotal(Factor.quality);
        if (BladesItem.IsType(this, BladesItemType.cohort_gang)) {
            if ([...subtypes, ...eliteSubtypes].includes(Tag.GangType.Vehicle)) {
                system.scale = this.getFactorTotal(Factor.scale);
                system.scaleExample = "(1 vehicle)";
            }
            else {
                system.scale = this.getFactorTotal(Factor.scale);
                const scaleIndex = Math.min(6, system.scale);
                system.scaleExample = C.ScaleExamples[scaleIndex];
                system.subtitle = C.ScaleSizes[scaleIndex];
            }
            if (subtypes.length + eliteSubtypes.length === 0) {
                system.subtitle = system.subtitle.replace(/\s+of\b/g, "").trim();
            }
        }
        else {
            system.scale = 0;
            system.scaleExample = [...subtypes, ...eliteSubtypes].includes("Pet") ? "(1 animal)" : "(1 person)";
            system.subtitle = "An Expert";
        }
        if (subtypes.length + eliteSubtypes.length > 0) {
            if ([...subtypes, ...eliteSubtypes].includes(Tag.GangType.Vehicle)) {
                system.subtitle = C.VehicleDescriptors[Math.min(6, this.getFactorTotal(Factor.tier))];
            }
            else {
                system.subtitle += ` ${U.oxfordize([
                    ...subtypes.filter((subtype) => !eliteSubtypes.includes(subtype)),
                    ...eliteSubtypes.map((subtype) => `Elite ${subtype}`)
                ], false, "&")}`;
            }
        }
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
        // eLog.checkLog3("experienceClues", {expClueData})
        if (BladesItem.IsType(this, BladesItemType.playbook)) {
            const gatherInfoData = {};
            [...Object.values(system.gather_info_questions).filter((question) => /[A-Za-z]/.test(question)), " "].forEach((question, i) => { gatherInfoData[(i + 1).toString()] = question; });
            system.gather_info_questions = gatherInfoData;
            // eLog.checkLog3("gatherInfoQuestions", {gatherInfoData});
        }
    }
    // #endregion
    // Unlock lower-level update method for subclasses
    async callOnUpdate(...args) {
        await this._onUpdate(...args);
    }
}
export default BladesItem;
