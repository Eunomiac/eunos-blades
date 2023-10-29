/* ****▌███████████████████████████████████████████████████████████████████████████▐**** *\
|*     ▌█░░░░░░░░░ Euno's Blades in the Dark for Foundry VTT ░░░░░░░░░░░█▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░ by Eunomiac ░░░░░░░░░░░░░██████████████████▐     *|
|*     ▌█  License █ v0.1.0 ██▐     *|
|*     ▌████░░░░  ░░░░█████▐     *|
\* ****▌███████████████████████████████████████████████████████████████████████████▐**** */

import C, { BladesActorType, BladesItemType, Tag, Factor } from "./core/constants.js";
import U from "./core/utilities.js";
import { BladesActor } from "./documents/BladesActorProxy.js";
import { BladesRollMod } from "./BladesRoll.js";
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
                    return this.getFactorTotal(Factor.tier)
                        + (this.hasTag("Fine") ? 1 : 0)
                        + (this.parent?.getTaggedItemBonuses(this.tags) ?? 0)
                        + (BladesActor.IsType(this.parent, BladesActorType.pc)
                            && BladesActor.IsType(this.parent.crew, BladesActorType.crew)
                            ? this.parent.crew.getTaggedItemBonuses(this.tags)
                            : 0);
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
    
    async archive() {
        await this.addTag(Tag.System.Archived);
        return this;
    }
    async unarchive() {
        await this.remTag(Tag.System.Archived);
        return this;
    }
    
    
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

    get rollPrimaryID() { return this.id; }
    get rollPrimaryDoc() { return this; }
    get rollPrimaryName() { return this.name; }
    get rollPrimaryType() { return this.type; }
    get rollPrimaryImg() { return this.img; }
    get rollModsData() {
        
        return BladesRollMod.ParseDocRollMods(this);
    }
    
    get rollOppID() { return this.id; }
    get rollOppDoc() { return this; }
    get rollOppImg() { return this.img; }
    get rollOppName() { return this.name; }
    get rollOppSubName() { return ""; }
    get rollOppType() { return this.type; }
    get rollOppModsData() { return []; }

    get rollParticipantID() { return this.id; }
    get rollParticipantDoc() { return this; }
    get rollParticipantIcon() { return this.img; }
    get rollParticipantName() { return this.name; }
    get rollParticipantType() { return this.type; }
    get rollParticipantModsData() { return []; }
    
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
        const eliteSubtypes = U.unique([
            ...Object.values(system.elite_subtypes),
            ...(this.parent?.upgrades ?? [])
                .filter((upgrade) => (upgrade.name ?? "").startsWith("Elite"))
                .map((upgrade) => (upgrade.name ?? "").trim().replace(/^Elite /, ""))
        ]
            .map((subtype) => subtype.trim())
            .filter((subtype) => /[A-Za-z]/.test(subtype) && subtypes.includes(subtype)));
        system.subtypes = Object.fromEntries(subtypes.map((subtype, i) => [`${i + 1}`, subtype]));
        system.elite_subtypes = Object.fromEntries(eliteSubtypes.map((subtype, i) => [`${i + 1}`, subtype]));
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
        eLog.checkLog3("experienceClues", { expClueData });
        if (BladesItem.IsType(this, BladesItemType.playbook)) {
            const gatherInfoData = {};
            [...Object.values(system.gather_info_questions).filter((question) => /[A-Za-z]/.test(question)), " "].forEach((question, i) => { gatherInfoData[(i + 1).toString()] = question; });
            system.gather_info_questions = gatherInfoData;
            eLog.checkLog3("gatherInfoQuestions", { gatherInfoData });
        }
    }
}
export default BladesItem;