/* ****▌███████████████████████████████████████████████████████████████████████████▐**** *\
|*     ▌████░░░░░░░░░░░ Euno's Blades in the Dark for Foundry VTT ░░░░░░░░░░░░░████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░ by Eunomiac ░░░░░░░░░░░░░██████████████████▐     *|
|*     ▌████████████████████████████  License █ v0.1.0 ████████████████████████████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░░░░░░  ░░░░░░░░░░░░░░░░░░███████████████████▐     *|
\* ****▌███████████████████████████████████████████████████████████████████████████▐**** */

import U from "./core/utilities.js";
import C, { BladesActorType, BladesItemType, RollPermissions, RollType, RollSubType, RollModStatus, RollModSection, ActionTrait, AttributeTrait, Position, Effect, Factor, RollResult, ConsequenceType } from "./core/constants.js";
import { BladesActor, BladesPC, BladesCrew } from "./documents/BladesActorProxy.js";
import { BladesItem, BladesGMTracker } from "./documents/BladesItemProxy.js";
import { ApplyTooltipListeners } from "./core/gsap.js";
function isRollType(str) {
    return typeof str === "string" && str in RollType;
}
function isAction(trait) {
    return Boolean(trait && typeof trait === "string" && U.lCase(trait) in ActionTrait);
}
function isAttribute(trait) {
    return Boolean(trait && typeof trait === "string" && U.lCase(trait) in AttributeTrait);
}
function isFactor(trait) {
    return Boolean(trait && typeof trait === "string" && U.lCase(trait) in Factor);
}
function isModStatus(str) {
    return typeof str === "string" && str in RollModStatus;
}

class BladesRollMod {
    static ParseDocRollMods(doc) {
        const { roll_mods } = doc.system;
        if (!roll_mods || roll_mods.length === 0) {
            return [];
        }
        return roll_mods
            .filter((elem) => typeof elem === "string")
            .map((modString) => {
            const pStrings = modString.split(/@/);
            const nameString = U.pullElement(pStrings, (v) => typeof v === "string" && /^na/i.test(v));
            const nameVal = (typeof nameString === "string" && nameString.replace(/^.*:/, ""));
            if (!nameVal) {
                throw new Error(`RollMod Missing Name: '${modString}'`);
            }
            const catString = U.pullElement(pStrings, (v) => typeof v === "string" && /^cat/i.test(v));
            const catVal = (typeof catString === "string" && catString.replace(/^.*:/, ""));
            if (!catVal || !(catVal in RollModSection)) {
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
                else if (/^c.{0,10}r?.{0,3}ty/i.test(keyString)) {
                    key = "conditionalRollTypes";
                }
                else if (/^a.{0,3}r?.{0,3}y/i.test(keyString)) {
                    key = "autoRollTypes";
                }
                else if (/^p.{0,10}r?.{0,3}y/i.test(keyString)) {
                    key = "participantRollTypes";
                }
                else if (/^c.{0,10}r?.{0,3}tr/i.test(keyString)) {
                    key = "conditionalRollTraits";
                }
                else if (/^a.{0,3}r?.{0,3}tr/i.test(keyString)) {
                    key = "autoRollTraits";
                }
                else if (/^p.{0,10}r?.{0,3}tr/i.test(keyString)) {
                    key = "participantRollTypes";
                }
                else {
                    throw new Error(`Bad Roll Mod Key: ${keyString}`);
                }
                if (key === "base_status" && val === "Conditional") {
                    val = RollModStatus.Hidden;
                }
                let valProcessed;
                if (["value"].includes(key)) {
                    valProcessed = U.pInt(val);
                }
                else if (["effectKeys", "conditionalRollTypes", "autoRollTypes,", "conditionalRollTraits", "autoRollTraits"].includes(key)) {
                    valProcessed = [val].flat();
                }
                else {
                    valProcessed = val.replace(/%COLON%/g, ":");
                }
                Object.assign(rollModData, { [key]: valProcessed });
            });
            return rollModData;
        });
    }
    get status() {
        if (this.userStatus && [RollModStatus.ForcedOn, RollModStatus.ForcedOff, RollModStatus.Hidden].includes(this.userStatus)) {
            return this.userStatus;
        }
        if (this.heldStatus && [RollModStatus.ToggledOff, RollModStatus.ToggledOn].includes(this.heldStatus)) {
            return this.userStatus ?? this.heldStatus;
        }
        return this.heldStatus ?? this.userStatus ?? this.baseStatus;
    }
    get isActive() { return [RollModStatus.ToggledOn, RollModStatus.ForcedOn].includes(this.status); }
    get isVisible() { return this.status !== RollModStatus.Hidden; }
    _heldStatus;
    get heldStatus() { return this._heldStatus; }
    set heldStatus(val) {
        this._heldStatus = val;
    }
    get flagParams() { return [C.SYSTEM_ID, `rollCollab.rollModsData.${this.id}`]; }
    getFlag() { return this.rollInstance.document.getFlag(...this.flagParams); }
    get userStatus() {
        return this.rollInstance.document.getFlag(...this.flagParams);
    }
    set userStatus(val) {
        if (val === this.userStatus) {
            return;
        }
        if (!val || val === this.baseStatus) {
            this.rollInstance.document.unsetFlag(...this.flagParams).then(() => socketlib.system.executeForEveryone("renderRollCollab", this.rollInstance.rollID));
        }
        else {
            if ([RollModStatus.ForcedOn, RollModStatus.ForcedOff, RollModStatus.Hidden].includes(val)
                && !game.user.isGM) {
                return;
            }
            if (this.userStatus && [RollModStatus.ForcedOn, RollModStatus.ForcedOff, RollModStatus.Hidden].includes(this.userStatus)
                && !game.user.isGM) {
                return;
            }
            this.rollInstance.document.setFlag(...this.flagParams, val).then(() => socketlib.system.executeForEveryone("renderRollCollab", this.rollInstance.rollID));
        }
    }
    get sourceName() { return this._sourceName; }
    get isConditional() {
        return [
            ...this.conditionalRollTraits,
            ...this.autoRollTraits,
            ...this.participantRollTraits,
            ...this.conditionalRollTypes,
            ...this.autoRollTypes,
            ...this.participantRollTypes
        ].length > 0;
    }
    get isInInactiveBlock() {
        if (game.user.isGM) {
            return [RollModStatus.Hidden, RollModStatus.ForcedOff, RollModStatus.ToggledOff].includes(this.status)
                && (this.isConditional || [BladesItemType.ability].includes(this.modType));
        }
        return [RollModStatus.ForcedOff, RollModStatus.ToggledOff].includes(this.status)
            && (this.isConditional || [BladesItemType.ability].includes(this.modType));
    }
    get isPush() {
        return Boolean(U.lCase(this.name) === "push"
            || this.effectKeys.find((eKey) => eKey === "Is-Push"));
    }
    get isBasicPush() { return U.lCase(this.name) === "push"; }
    get stressCost() {
        const costKeys = this.effectKeys.filter((key) => key.startsWith("Cost-Stress"));
        if (costKeys.length === 0) {
            return 0;
        }
        let stressCost = 0;
        costKeys.forEach((key) => {
            const [thisParam] = (key.split(/-/) ?? []).slice(1);
            const [_, valStr] = (/([A-Za-z]+)(\d*)/.exec(thisParam) ?? []).slice(1);
            stressCost += U.pInt(valStr);
        });
        return stressCost;
    }
        setConditionalStatus() {
        if (!this.isConditional) {
            return false;
        }
        const autoTypesOrTraitsApply = this.autoRollTypes.includes(this.rollInstance.rollType)
            || (!this.rollInstance.rollTrait || this.autoRollTraits.includes(this.rollInstance.rollTrait));
        if (autoTypesOrTraitsApply) {
            this.heldStatus = RollModStatus.ForcedOn;
            return false;
        }
        const conditionalTypesOrTraitsApply = this.checkTypesOrTraits(this.conditionalRollTypes, this.conditionalRollTraits);
        if (conditionalTypesOrTraitsApply) {
            this.heldStatus = RollModStatus.ToggledOff;
            return false;
        }
        const participantTypesOrTraitsApply = this.rollInstance.isParticipantRoll
            && this.checkTypesOrTraits(this.participantRollTypes, this.participantRollTraits);
        if (participantTypesOrTraitsApply) {
            this.heldStatus = RollModStatus.ToggledOff;
            return false;
        }
        this.heldStatus = RollModStatus.Hidden;
        return true;
    }
        checkTypesOrTraits(types, traits) {
        const typesApply = Boolean((!this.rollInstance.isParticipantRoll && types.length === 0)
            || types.includes(this.rollInstance.rollType));
        const traitsApply = Boolean((!this.rollInstance.isParticipantRoll && traits.length === 0)
            || (this.rollInstance.rollTrait && traits.includes(this.rollInstance.rollTrait)));
        return typesApply && traitsApply;
    }
        processKey(key) {
        const [thisKey, thisParam] = key.split(/-/) ?? [];
        const positions = [Position.controlled, Position.risky, Position.desperate];
        if (positions.includes(U.lCase(thisParam)) && this.rollInstance.finalPosition === U.lCase(thisParam)) {
            if (thisKey === "AutoRevealOn") {
                this.heldStatus = RollModStatus.ToggledOff;
                return true;
            }
            else if (thisKey === "AutoEnableOn") {
                this.heldStatus = RollModStatus.ForcedOn;
                return true;
            }
        }
        return false;
    }
    setAutoStatus() {
        const holdKeys = this.effectKeys.filter((key) => key.startsWith("Auto"));
        if (holdKeys.length === 0) {
            return false;
        }
        for (const key of holdKeys) {
            if (this.processKey(key)) {
                return false;
            }
        }
        this.heldStatus = RollModStatus.Hidden;
        return true;
    }
    setRelevancyStatus() {
        const holdKeys = this.effectKeys.filter((key) => /^Negate|^Increase/.test(key));
        if (holdKeys.length === 0) {
            return false;
        }
        const relevantKeys = holdKeys
            .filter((key) => {
            const [thisKey, thisParam] = key.split(/-/) ?? [];
            const negateOperations = {
                PushCost: () => this.rollInstance.isPushed(),
                Consequence: () => this.rollInstance.rollType === RollType.Resistance && Boolean(this.rollInstance.rollConsequence),
                HarmLevel: () => this.rollInstance.rollType === RollType.Resistance && this.rollInstance.rollConsequence && [ConsequenceType.Harm1, ConsequenceType.Harm2, ConsequenceType.Harm3, ConsequenceType.Harm4].includes(this.rollInstance.rollConsequence.type),
                QualityPenalty: () => this.rollInstance.isTraitRelevant(Factor.quality) && (this.rollInstance.rollFactors.source[Factor.quality]?.value ?? 0) < (this.rollInstance.rollFactors.opposition[Factor.quality]?.value ?? 0),
                ScalePenalty: () => this.rollInstance.isTraitRelevant(Factor.scale) && (this.rollInstance.rollFactors.source[Factor.scale]?.value ?? 0) < (this.rollInstance.rollFactors.opposition[Factor.scale]?.value ?? 0),
                TierPenalty: () => this.rollInstance.isTraitRelevant(Factor.tier) && (this.rollInstance.rollFactors.source[Factor.tier]?.value ?? 0) < (this.rollInstance.rollFactors.opposition[Factor.tier]?.value ?? 0)
            };
            if (thisKey === "Negate") {
                if (Object.hasOwn(negateOperations, thisParam)) {
                    return negateOperations[thisParam]();
                }
                else {
                    throw new Error(`Unrecognized Negate parameter: ${thisParam}`);
                }
            }
            else if (thisKey === "Increase") {
                const [_, traitStr] = /(\w+)\d+/.exec(thisParam) ?? [];
                return this.rollInstance.isTraitRelevant(traitStr);
            }
            else {
                throw new Error(`Unrecognized Function Key: ${thisKey}`);
            }
        });
        if (relevantKeys.length === 0) {
            this.heldStatus = RollModStatus.Hidden;
            return true;
        }
        return false;
    }
    setPayableStatus() {
        const holdKeys = this.effectKeys.filter((key) => key.startsWith("Cost"));
        if (holdKeys.length === 0) {
            return false;
        }
        const payableKeys = holdKeys
            .filter((key) => {
            const [thisParam] = (key.split(/-/) ?? []).slice(1);
            const [traitStr, valStr] = (/([A-Za-z]+)(\d*)/.exec(thisParam) ?? []).slice(1);
            const { rollPrimaryDoc } = this.rollInstance.rollPrimary ?? {};
            if (!BladesRollPrimary.IsDoc(rollPrimaryDoc)) {
                return false;
            }
            switch (traitStr) {
                case "SpecialArmor": {
                    return BladesActor.IsType(rollPrimaryDoc, BladesActorType.pc)
                        && rollPrimaryDoc.system.armor.active.special
                        && !rollPrimaryDoc.system.armor.checked.special;
                }
                case "Stress": {
                    const val = U.pInt(valStr);
                    return BladesActor.IsType(rollPrimaryDoc, BladesActorType.pc)
                        && rollPrimaryDoc.system.stress.max - rollPrimaryDoc.system.stress.value >= val;
                }
                default: throw new Error(`Unrecognize Payable Key: ${traitStr}`);
            }
        });
        if (payableKeys.length === 0) {
            this.heldStatus = RollModStatus.ForcedOff;
            return true;
        }
        return false;
    }
    applyRollModEffectKeys() {
        if (!this.isActive) {
            return;
        }
        const holdKeys = this.effectKeys.filter((key) => /^Negate|^Increase/.test(key));
        if (holdKeys.length === 0) {
            return;
        }
        holdKeys.forEach((key) => {
            const [thisKey, thisParam] = key.split(/"-"/) ?? [];
            const negateOperations = {
                PushCost: () => {
                    const costlyPushMod = this.rollInstance.getActiveRollMods()
                        .find((mod) => mod.isPush && mod.stressCost > 0);
                    if (costlyPushMod) {
                        U.pullElement(costlyPushMod.effectKeys, (k) => k.startsWith("Cost-Stress"));
                    }
                },
                Consequence: () => {
                                    },
                HarmLevel: () => {
                    if (!this.rollInstance.rollConsequence) {
                        return;
                    }
                    const consequenceType = this.rollInstance.rollConsequence.type;
                    if (!consequenceType?.startsWith("Harm")) {
                        return;
                    }
                    const curLevel = [ConsequenceType.Harm1, ConsequenceType.Harm2, ConsequenceType.Harm3, ConsequenceType.Harm4]
                        .findIndex((cType) => cType === consequenceType) + 1;
                    if (curLevel > 1) {
                        this.rollInstance.rollConsequence.type = `Harm${curLevel - 1}`;
                    }
                    else {
                                            }
                },
                QualityPenalty: () => {
                    this.rollInstance.negateFactorPenalty(Factor.quality);
                },
                ScalePenalty: () => {
                    this.rollInstance.negateFactorPenalty(Factor.scale);
                },
                TierPenalty: () => {
                    this.rollInstance.negateFactorPenalty(Factor.tier);
                }
            };
            if (thisKey === "Negate") {
                if (Object.hasOwn(negateOperations, thisParam)) {
                    return negateOperations[thisParam]();
                }
                else {
                    throw new Error(`Unrecognized Negate parameter: ${thisParam}`);
                }
            }
            else if (thisKey === "Increase") {
                const [_, traitStr] = /(\w+)\d+/.exec(thisParam) ?? [];
                return this.rollInstance.isTraitRelevant(traitStr);
            }
            else {
                throw new Error(`Unrecognized Function Key: ${thisKey}`);
            }
        });
    }
    get tooltip() {
        if (this.sideString) {
            return this._tooltip
                .replace(/%COLON%/g, ":")
                .replace(/%DOC_NAME%/g, this.sideString);
        }
        return this._tooltip.replace(/%COLON%/g, ":");
    }
    get sideString() {
        if (this._sideString) {
            return this._sideString;
        }
        switch (this.category) {
            case RollModSection.roll: {
                if (this.name === "Assist") {
                    const docID = this.rollInstance.document.getFlag("eunos-blades", "rollCollab.docSelections.roll.Assist");
                    if (!docID) {
                        return undefined;
                    }
                    return (game.actors.get(docID) ?? game.items.get(docID))?.name ?? undefined;
                }
                return undefined;
            }
            case RollModSection.position: {
                if (this.name === "Setup") {
                    const docID = this.rollInstance.document.getFlag("eunos-blades", "rollCollab.docSelections.position.Setup");
                    if (!docID) {
                        return undefined;
                    }
                    return (game.actors.get(docID) ?? game.items.get(docID))?.name ?? undefined;
                }
                return undefined;
            }
            case RollModSection.effect: {
                if (this.name === "Setup") {
                    const docID = this.rollInstance.document.getFlag("eunos-blades", "rollCollab.docSelections.effect.Setup");
                    if (!docID) {
                        return undefined;
                    }
                    return (game.actors.get(docID) ?? game.items.get(docID))?.name ?? undefined;
                }
                return undefined;
            }
            default: return undefined;
        }
    }
    get allFlagData() {
        return this.rollInstance.document.getFlag("eunos-blades", "rollCollab");
    }
    get data() {
        return {
            id: this.id,
            name: this.name,
            base_status: this.baseStatus,
            user_status: this.userStatus,
            value: this.value,
            effectKeys: this.effectKeys,
            sideString: this._sideString,
            tooltip: this._tooltip,
            posNeg: this.posNeg,
            isOppositional: this.isOppositional,
            modType: this.modType,
            conditionalRollTypes: this.conditionalRollTypes,
            autoRollTypes: this.autoRollTypes,
            conditionalRollTraits: this.conditionalRollTraits,
            autoRollTraits: this.autoRollTraits,
            category: this.category
        };
    }
    get costs() {
        if (!this.isActive) {
            return undefined;
        }
        const holdKeys = this.effectKeys.filter((key) => key.startsWith("Cost"));
        if (holdKeys.length === 0) {
            return undefined;
        }
        return holdKeys.map((key) => {
            const [thisParam] = (key.split(/-/) ?? []).slice(1);
            const [traitStr, valStr] = (/([A-Za-z]+)(\d*)/.exec(thisParam) ?? []).slice(1);
            let label = this.name;
            if (this.isBasicPush) {
                if (this.posNeg === "negative") {
                    label = `${this.name} (<span class='red-bright'>To Act</span>)`;
                }
                else {
                    const effect = this.category === RollModSection.roll ? "+1d" : "+1 effect";
                    label = `${this.name} (<span class='gold-bright'>${effect}</span>)`;
                }
            }
            return {
                id: this.id,
                label,
                costType: traitStr,
                costAmount: valStr ? U.pInt(valStr) : 1
            };
        });
    }
    id;
    name;
    _sourceName;
    baseStatus;
    value;
    effectKeys;
    _sideString;
    _tooltip;
    posNeg;
    isOppositional;
    modType;
    conditionalRollTypes;
    autoRollTypes;
    participantRollTypes;
    conditionalRollTraits;
    autoRollTraits;
    participantRollTraits;
    category;
    rollInstance;
    constructor(modData, rollInstance) {
        this.rollInstance = rollInstance;
        this.id = modData.id;
        this.name = modData.name;
        this._sourceName = modData.source_name ?? modData.name;
        this.baseStatus = modData.base_status;
        this.value = modData.value;
        this.effectKeys = modData.effectKeys ?? [];
        this._sideString = modData.sideString;
        this._tooltip = modData.tooltip;
        this.posNeg = modData.posNeg;
        this.isOppositional = modData.isOppositional ?? false;
        this.modType = modData.modType;
        this.conditionalRollTypes = modData.conditionalRollTypes ?? [];
        this.autoRollTypes = modData.autoRollTypes ?? [];
        this.participantRollTypes = modData.participantRollTypes ?? [];
        this.conditionalRollTraits = modData.conditionalRollTraits ?? [];
        this.autoRollTraits = modData.autoRollTraits ?? [];
        this.participantRollTraits = modData.participantRollTraits ?? [];
        this.category = modData.category;
    }
}

class BladesRollPrimary {

    static IsValidData(data) {
        if (BladesRollPrimary.IsDoc(data)) {
            return true;
        }
        return U.isList(data)
            && typeof data.rollPrimaryName === "string"
            && typeof data.rollPrimaryType === "string"
            && typeof data.rollPrimaryImg === "string"
            && Array.isArray(data.rollModsData)
            && U.isList(data.rollFactors)
            && (!data.rollPrimaryID || typeof data.rollPrimaryID === "string")
            && (!data.rollPrimaryDoc || BladesRollPrimary.IsDoc(data.rollPrimaryDoc));
    }
    static IsDoc(doc) {
        return BladesActor.IsType(doc, BladesActorType.pc, BladesActorType.crew)
            || BladesItem.IsType(doc, BladesItemType.cohort_expert, BladesItemType.cohort_gang, BladesItemType.gm_tracker);
    }
    rollInstance;
    rollPrimaryID;
    rollPrimaryDoc;
    rollPrimaryName;
    rollPrimaryType;
    rollPrimaryImg;
    _rollModsData;
    get rollModsData() {
        return this.rollPrimaryDoc?.rollModsData ?? this._rollModsData ?? [];
    }
    rollFactors;

    constructor(rollInstance, { rollPrimaryID, rollPrimaryDoc, rollPrimaryName, rollPrimaryType, rollPrimaryImg, rollModsData, rollFactors }) {
        this.rollInstance = rollInstance;
        let doc = rollPrimaryDoc;
        if (!doc && rollPrimaryID) {
            doc = game.items.get(rollPrimaryID) ?? game.actors.get(rollPrimaryID);
        }
        if (!doc && rollPrimaryName) {
            doc = game.items.getName(rollPrimaryName) ?? game.actors.getName(rollPrimaryName);
        }
        if (BladesRollPrimary.IsDoc(doc)) {
            this.rollPrimaryDoc = doc;
        }
        if (BladesRollPrimary.IsDoc(this.rollPrimaryDoc)) {
            this.rollPrimaryID = this.rollPrimaryDoc.rollPrimaryID;
            this.rollPrimaryName = rollPrimaryName ?? this.rollPrimaryDoc.rollPrimaryName;
            this.rollPrimaryType = this.rollPrimaryDoc.rollPrimaryType;
            this.rollPrimaryImg = rollPrimaryImg ?? this.rollPrimaryDoc.rollPrimaryImg ?? "";
            this._rollModsData = rollModsData ?? [];
            this.rollFactors = Object.assign(this.rollPrimaryDoc.rollFactors, rollFactors ?? {});
        }
        else {
            if (!rollPrimaryName) {
                throw new Error("Must include a rollPrimaryName when constructing a BladesRollPrimary object.");
            }
            if (!rollPrimaryImg) {
                throw new Error("Must include a rollPrimaryImg when constructing a BladesRollPrimary object.");
            }
            if (!rollPrimaryType) {
                throw new Error("Must include a rollPrimaryType when constructing a BladesRollPrimary object.");
            }
            if (!rollFactors) {
                throw new Error("Must include a rollFactors when constructing a BladesRollPrimary object.");
            }
            this.rollPrimaryID = rollPrimaryID;
            this.rollPrimaryName = rollPrimaryName;
            this.rollPrimaryType = rollPrimaryType;
            this.rollPrimaryImg = rollPrimaryImg;
            this._rollModsData = rollModsData ?? [];
            this.rollFactors = rollFactors;
        }
    }
}
class BladesRollOpposition {

    static IsValidData(data) {
        if (BladesRollOpposition.IsDoc(data)) {
            return true;
        }
        return U.isList(data)
            && typeof data.rollOppName === "string"
            && typeof data.rollOppType === "string"
            && typeof data.rollOppImg === "string"
            && (!data.rollOppSubName || typeof data.rollOppSubName === "string")
            && (!data.rollOppModsData || Array.isArray(data.rollOppModsData))
            && U.isList(data.rollFactors)
            && (!data.rollOppID || typeof data.rollOppID === "string")
            && (!data.rollOppDoc || BladesRollOpposition.IsDoc(data.rollOppDoc));
    }
    static IsDoc(doc) {
        return BladesActor.IsType(doc, BladesActorType.npc, BladesActorType.faction)
            || BladesItem.IsType(doc, BladesItemType.cohort_expert, BladesItemType.cohort_gang, BladesItemType.gm_tracker, BladesItemType.project, BladesItemType.design, BladesItemType.ritual);
    }
    rollInstance;
    rollOppID;
    rollOppDoc;
    rollOppName;
    rollOppSubName;
    rollOppType;
    rollOppImg;
    rollOppModsData;
    rollFactors;

    constructor(rollInstance, { rollOppID, rollOppDoc, rollOppName, rollOppSubName, rollOppType, rollOppImg, rollOppModsData, rollFactors } = {}) {
        this.rollInstance = rollInstance;
        let doc = rollOppDoc;
        if (!doc && rollOppID) {
            doc = game.items.get(rollOppID) ?? game.actors.get(rollOppID);
        }
        if (!doc && rollOppName) {
            doc = game.items.getName(rollOppName) ?? game.actors.getName(rollOppName);
        }
        if (BladesRollOpposition.IsDoc(doc)) {
            this.rollOppDoc = doc;
        }
        if (BladesRollOpposition.IsDoc(this.rollOppDoc)) {
            this.rollOppID = this.rollOppDoc.rollOppID;
            this.rollOppName = rollOppName ?? this.rollOppDoc.rollOppName;
            this.rollOppSubName = rollOppSubName ?? this.rollOppDoc.rollOppSubName;
            this.rollOppType = this.rollOppDoc.rollOppType;
            this.rollOppImg = rollOppImg ?? this.rollOppDoc.rollOppImg ?? "";
            this.rollOppModsData = [
                ...rollOppModsData ?? [],
                ...this.rollOppDoc.rollOppModsData ?? []
            ];
            this.rollFactors = Object.assign(this.rollOppDoc.rollFactors, rollFactors ?? {});
        }
        else {
            if (!rollOppName) {
                throw new Error("Must include a rollOppName when constructing a BladesRollOpposition object.");
            }
            if (!rollOppSubName) {
                throw new Error("Must include a rollOppSubName when constructing a BladesRollOpposition object.");
            }
            if (!rollOppType) {
                throw new Error("Must include a rollOppType when constructing a BladesRollOpposition object.");
            }
            if (!rollFactors) {
                throw new Error("Must include a rollFactors when constructing a BladesRollOpposition object.");
            }
            this.rollOppID = rollOppID;
            this.rollOppName = rollOppName;
            this.rollOppSubName = rollOppSubName;
            this.rollOppType = rollOppType;
            this.rollOppImg = rollOppImg ?? "";
            this.rollOppModsData = rollOppModsData ?? [];
            this.rollFactors = rollFactors;
        }
        if (this.rollOppModsData.length === 0) {
            this.rollOppModsData = undefined;
        }
    }
}
class BladesRollParticipant {

    static IsValidData(data) {
        if (BladesRollParticipant.IsDoc(data)) {
            return true;
        }
        return U.isList(data)
            && typeof data.rollParticipantName === "string"
            && typeof data.rollParticipantType === "string"
            && typeof data.rollParticipantIcon === "string"
            && (!data.rollParticipantModsData || Array.isArray(data.rollParticipantModsData))
            && U.isList(data.rollFactors)
            && (!data.rollParticipantID || typeof data.rollParticipantID === "string")
            && (!data.rollParticipantDoc || BladesRollParticipant.IsDoc(data.rollParticipantDoc));
    }
    static IsDoc(doc) {
        return BladesActor.IsType(doc, BladesActorType.pc, BladesActorType.crew, BladesActorType.npc)
            || BladesItem.IsType(doc, BladesItemType.cohort_expert, BladesItemType.cohort_gang, BladesItemType.gm_tracker);
    }
    rollInstance;
    rollParticipantID;
    rollParticipantDoc;
    rollParticipantName;
    rollParticipantType;
    rollParticipantIcon;
    rollParticipantModsData;
    rollFactors;

    constructor(rollInstance, { rollParticipantID, rollParticipantDoc, rollParticipantName, rollParticipantType, rollParticipantIcon, rollParticipantModsData, rollFactors } = {}) {
        this.rollInstance = rollInstance;
        let doc = rollParticipantDoc;
        if (!doc && rollParticipantID) {
            doc = game.items.get(rollParticipantID) ?? game.actors.get(rollParticipantID);
        }
        if (!doc && rollParticipantName) {
            doc = game.items.getName(rollParticipantName) ?? game.actors.getName(rollParticipantName);
        }
        if (BladesRollParticipant.IsDoc(doc)) {
            this.rollParticipantDoc = doc;
        }
        if (this.rollParticipantDoc) {
            this.rollParticipantID = this.rollParticipantDoc.rollParticipantID;
            this.rollParticipantName = rollParticipantName ?? this.rollParticipantDoc.rollParticipantName ?? this.rollParticipantDoc.name;
            this.rollParticipantIcon = rollParticipantIcon ?? this.rollParticipantDoc.rollParticipantIcon ?? this.rollParticipantDoc.img;
            this.rollParticipantType = this.rollParticipantDoc.rollParticipantType;
            this.rollParticipantModsData = [
                ...rollParticipantModsData ?? [],
                ...this.rollParticipantDoc.rollParticipantModsData ?? []
            ];
            this.rollFactors = Object.assign(this.rollParticipantDoc.rollFactors, rollFactors ?? {});
        }
        else {
            if (!rollParticipantName) {
                throw new Error("Must include a rollParticipantName when constructing a BladesRollParticipant object.");
            }
            if (!rollParticipantType) {
                throw new Error("Must include a rollParticipantType when constructing a BladesRollParticipant object.");
            }
            if (!rollParticipantIcon) {
                throw new Error("Must include a rollParticipantIcon when constructing a BladesRollParticipant object.");
            }
            if (!rollFactors) {
                throw new Error("Must include a rollFactors when constructing a BladesRollParticipant object.");
            }
            this.rollParticipantID = rollParticipantID;
            this.rollParticipantName = rollParticipantName;
            this.rollParticipantType = rollParticipantType;
            this.rollParticipantIcon = rollParticipantIcon;
            this.rollParticipantModsData = rollParticipantModsData ?? [];
            this.rollFactors = rollFactors;
        }
        if (this.rollParticipantModsData.length === 0) {
            this.rollParticipantModsData = undefined;
        }
    }
}
class BladesRollCollab extends DocumentSheet {

    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            classes: ["eunos-blades", "sheet", "roll-collab", game.user.isGM ? "gm-roll-collab" : ""],
            template: `systems/eunos-blades/templates/roll/roll-collab${game.user.isGM ? "-gm" : ""}.hbs`,
            submitOnChange: true,
            width: 500,
            dragDrop: [
                { dragSelector: null, dropSelector: "[data-action='gm-drop-opposition'" }
            ]
        });
    }
    static Initialize() {
        return loadTemplates([
            "systems/eunos-blades/templates/roll/roll-collab.hbs",
            "systems/eunos-blades/templates/roll/roll-collab-gm.hbs",
            "systems/eunos-blades/templates/roll/partials/roll-collab-gm-number-line.hbs",
            "systems/eunos-blades/templates/roll/partials/roll-collab-gm-select-doc.hbs",
            "systems/eunos-blades/templates/roll/partials/roll-collab-gm-factor-control.hbs",
            "systems/eunos-blades/templates/roll/partials/roll-collab-action.hbs",
            "systems/eunos-blades/templates/roll/partials/roll-collab-action-gm.hbs",
            "systems/eunos-blades/templates/roll/partials/roll-collab-resistance.hbs",
            "systems/eunos-blades/templates/roll/partials/roll-collab-resistance-gm.hbs",
            "systems/eunos-blades/templates/roll/partials/roll-collab-downtime.hbs",
            "systems/eunos-blades/templates/roll/partials/roll-collab-downtime-gm.hbs",
            "systems/eunos-blades/templates/roll/partials/roll-collab-fortune.hbs",
            "systems/eunos-blades/templates/roll/partials/roll-collab-fortune-gm.hbs",
            "systems/eunos-blades/templates/roll/partials/roll-collab-incarceration.hbs",
            "systems/eunos-blades/templates/roll/partials/roll-collab-incarceration-gm.hbs"
        ]);
    }
    static InitSockets() {
        socketlib.system.register("constructRollCollab", BladesRollCollab.ConstructRollCollab);
        socketlib.system.register("renderRollCollab", BladesRollCollab.RenderRollCollab);
        socketlib.system.register("closeRollCollab", BladesRollCollab.CloseRollCollab);
    }
    static get DefaultRollMods() {
        return [
            {
                id: "Push-positive-roll",
                name: "PUSH",
                category: RollModSection.roll,
                base_status: RollModStatus.ToggledOff,
                posNeg: "positive",
                modType: "general",
                value: 1,
                effectKeys: ["ForceOff-Bargain", "Cost-Stress2"],
                tooltip: "<h1>Push for +1d</h1><p>For <strong class='red-bright'>2 Stress</strong>, add <strong class='gold-bright'>1 die</strong> to your pool.</p><p><em>(You <strong>cannot</strong> also accept a <strong class='red-bright'>Devil's Bargain</strong> to increase your dice pool: It's one or the other.)</em></p>"
            },
            {
                id: "Bargain-positive-roll",
                name: "Bargain",
                category: RollModSection.roll,
                base_status: RollModStatus.Hidden,
                posNeg: "positive",
                modType: "general",
                value: 1,
                effectKeys: [],
                tooltip: "<h1 class='red-bright'>Devil's Bargain</h1><p>The GM has offered you a <strong class='red-bright'>Devil's Bargain</strong>.</p><p><strong class='red-bright'>Accept the terms</strong> to add <strong class='gold-bright'>1 die</strong> to your pool.</p><p><em>(You <strong>cannot</strong> also <strong>Push for +1d</strong> to increase your dice pool: It's one or the other.)</em></p>"
            },
            {
                id: "Assist-positive-roll",
                name: "Assist",
                category: RollModSection.roll,
                base_status: RollModStatus.Hidden,
                posNeg: "positive",
                modType: "teamwork",
                value: 1,
                tooltip: "<h1 class='gold-bright'>%DOC_NAME% Assists</h1><p><strong class='gold-bright'>%DOC_NAME%</strong> is <strong>Assisting</strong> your efforts, adding <strong class='gold-bright'>1 die</strong> to your pool.</p>"
            },
            {
                id: "Setup-positive-position",
                name: "Setup",
                category: RollModSection.position,
                base_status: RollModStatus.Hidden,
                posNeg: "positive",
                modType: "teamwork",
                value: 1,
                tooltip: "<h1 class='gold-bright'>%DOC_NAME% Sets You Up</h1><p><strong class='gold-bright'>%DOC_NAME%</strong> has set you up for success with a preceding <strong>Setup</strong> action, increasing your <strong class='gold-bright'>Position</strong> by one level.</p>"
            },
            {
                id: "Push-positive-effect",
                name: "PUSH",
                category: RollModSection.effect,
                base_status: RollModStatus.ToggledOff,
                posNeg: "positive",
                modType: "general",
                value: 1,
                effectKeys: ["Cost-Stress2"],
                tooltip: "<h1>Push for Effect</h1><p>For <strong class='red-bright'>2 Stress</strong>, increase your <strong class='gold-bright'>Effect</strong> by one level.</p>"
            },
            {
                id: "Setup-positive-effect",
                name: "Setup",
                category: RollModSection.effect,
                base_status: RollModStatus.Hidden,
                posNeg: "positive",
                modType: "teamwork",
                value: 1,
                tooltip: "<h1 class='gold-bright'>%DOC_NAME% Sets You Up</h1><p><strong class='gold-bright'>%DOC_NAME%</strong> has set you up for success with a preceding <strong>Setup</strong> action, increasing your <strong class='gold-bright'>Effect</strong> by one level.</p>"
            },
            {
                id: "Potency-positive-effect",
                name: "Potency",
                category: RollModSection.effect,
                base_status: RollModStatus.Hidden,
                posNeg: "positive",
                modType: "general",
                value: 1,
                tooltip: "<h1>Potency</h1><p>By circumstance or advantage, you have <strong>Potency</strong> in this action, increasing your <strong class='gold-bright'>Effect</strong> by one level.</p>"
            },
            {
                id: "Potency-negative-effect",
                name: "Potency",
                category: RollModSection.effect,
                base_status: RollModStatus.Hidden,
                posNeg: "negative",
                modType: "general",
                value: 1,
                tooltip: "<h1 class='red-bright'>Potency</h1><p>By circumstance or advantage, <strong class='red-bright'>@OPPOSITION_NAME@</strong> has <strong>Potency</strong> against you, reducing your <strong class='red-bright'>Effect</strong> by one level."
            }
        ];
    }
    static get DefaultFlagData() {
        return {
            rollModsData: {},
            rollPositionInitial: Position.risky,
            rollEffectInitial: Effect.standard,
            rollPosEffectTrade: false,
            isGMReady: false,
            GMBoosts: {
                [Factor.tier]: 0,
                [Factor.quality]: 0,
                [Factor.scale]: 0,
                [Factor.magnitude]: 0
            },
            GMOppBoosts: {
                [Factor.tier]: 0,
                [Factor.quality]: 0,
                [Factor.scale]: 0,
                [Factor.magnitude]: 0
            },
            rollFactorToggles: {
                source: {
                    [Factor.tier]: {
                        display: "",
                        isActive: false,
                        isPrimary: false,
                        isDominant: false,
                        highFavorsPC: true
                    },
                    [Factor.quality]: {
                        display: "",
                        isActive: false,
                        isPrimary: false,
                        isDominant: false,
                        highFavorsPC: true
                    },
                    [Factor.scale]: {
                        display: "",
                        isActive: false,
                        isPrimary: false,
                        isDominant: false,
                        highFavorsPC: true
                    },
                    [Factor.magnitude]: {
                        display: "",
                        isActive: false,
                        isPrimary: false,
                        isDominant: false,
                        highFavorsPC: true
                    }
                },
                opposition: {
                    [Factor.tier]: {
                        display: "",
                        isActive: false,
                        isPrimary: false,
                        isDominant: false,
                        highFavorsPC: true
                    },
                    [Factor.quality]: {
                        display: "",
                        isActive: false,
                        isPrimary: false,
                        isDominant: false,
                        highFavorsPC: true
                    },
                    [Factor.scale]: {
                        display: "",
                        isActive: false,
                        isPrimary: false,
                        isDominant: false,
                        highFavorsPC: true
                    },
                    [Factor.magnitude]: {
                        display: "",
                        isActive: false,
                        isPrimary: false,
                        isDominant: false,
                        highFavorsPC: true
                    }
                }
            }
        };
    }

    static Current = {};
    static _Active;
    static get Active() {
        if (BladesRollCollab._Active) {
            return BladesRollCollab._Active;
        }
        if (U.objSize(BladesRollCollab.Current) > 0) {
            return Object.values(BladesRollCollab.Current)[0];
        }
        return undefined;
    }
    static set Active(val) {
        BladesRollCollab._Active = val;
    }
    static async ConstructRollCollab({ userID, rollID, rollPermission }) {
        const rollInst = new BladesRollCollab(userID, rollID, rollPermission);
        eLog.checkLog3("rollCollab", "ConstructRollCollab()", { params: { userID, rollID, rollPermission }, rollInst });
        await rollInst._render(true);
    }
    static RenderRollCollab(rollID) {
        BladesRollCollab.Current[rollID]?.render();
    }
    static async CloseRollCollab(rollID) {
        eLog.checkLog3("rollCollab", "CloseRollCollab()", { rollID });
        await BladesRollCollab.Current[rollID]?.close({ rollID });
        delete BladesRollCollab.Current[rollID];
    }
        static async NewRoll(config) {
        if (!isRollType(config.rollType)) {
            throw new Error("[BladesRollCollab.NewRoll()] You must provide a valid rollType in the config object.");
        }
        config.rollUserID ??= game.user.id ?? undefined;
        const rollUser = game.users.get(config.rollUserID ?? "");
        if (!rollUser) {
            throw new Error("[BladesRollCollab.NewRoll()] You must provide a valid rollUserID in the config object.");
        }
        if (!BladesRollPrimary.IsValidData(config.rollPrimaryData)) {
            let rollPrimarySourceData;
            if (BladesPC.IsType(rollUser.character)) {
                rollPrimarySourceData = rollUser.character;
            }
            else {
                throw new Error("[BladesRollCollab.NewRoll()] A valid source of PrimaryDocData must be provided to construct a roll.");
            }
            config.rollPrimaryData = {
                rollPrimaryID: rollPrimarySourceData.rollPrimaryID,
                rollPrimaryName: rollPrimarySourceData.rollPrimaryName,
                rollPrimaryType: rollPrimarySourceData.rollPrimaryType,
                rollPrimaryImg: rollPrimarySourceData.rollPrimaryImg,
                rollModsData: rollPrimarySourceData.rollModsData,
                rollFactors: rollPrimarySourceData.rollFactors
            };
        }
        const rollPrimaryDoc = game.actors.get(config.rollPrimaryData.rollPrimaryID ?? "")
            ?? game.items.get(config.rollPrimaryData.rollPrimaryID ?? "");
        const rollID = randomID();
        const flagUpdateData = {
            ...BladesRollCollab.DefaultFlagData,
            rollID,
            rollType: config.rollType,
            rollPrimaryData: config.rollPrimaryData
        };
        if (U.isInt(config.rollTrait)) {
            flagUpdateData.rollTrait = config.rollTrait;
        }
        else if (!U.isNullish(config.rollTrait)) {
            const rollTrait = typeof config.rollTrait === "string" ? U.lCase(config.rollTrait) : config.rollTrait;
            switch (flagUpdateData.rollType) {
                case RollType.IndulgeVice: {
                    if (BladesPC.IsType(rollPrimaryDoc)) {
                        const minAttrVal = Math.min(...Object.values(rollPrimaryDoc.attributes));
                        flagUpdateData.rollTrait = U.objFindKey(rollPrimaryDoc.attributes, (val) => val === minAttrVal);
                    }
                    break;
                }
                case RollType.Action: {
                    if (!(rollTrait in { ...ActionTrait, ...Factor })) {
                        eLog.error("rollCollab", `[ConstructRollCollab()] Bad RollTrait for Action Roll: ${rollTrait}`, config);
                        return;
                    }
                    flagUpdateData.rollTrait = rollTrait;
                    break;
                }
                case RollType.Fortune: {
                    if (!(rollTrait in { ...ActionTrait, ...AttributeTrait, ...Factor } || U.isInt(rollTrait))) {
                        eLog.error("rollCollab", `[ConstructRollCollab()] Bad RollTrait for Fortune Roll: ${rollTrait}`, config);
                        return;
                    }
                    flagUpdateData.rollTrait = rollTrait;
                    break;
                }
                case RollType.Resistance: {
                    if (!(rollTrait in AttributeTrait)) {
                        eLog.error("rollCollab", `[ConstructRollCollab()] Bad RollTrait for Resistance Roll: ${rollTrait}`, config);
                        return;
                    }
                    break;
                }
                default: throw new Error(`Unrecognized RollType: ${flagUpdateData.rollType}`);
            }
        }
        eLog.checkLog3("bladesRoll", "BladesRollCollab.NewRoll()", { flagUpdateData, rollPrimaryData: flagUpdateData.rollPrimaryData });
        await rollUser.setFlag(C.SYSTEM_ID, "rollCollab", flagUpdateData);
        const userIDs = {
            primary: [],
            participants: [],
            observers: []
        };
        const primaryUserIDs = game.users
            .filter((user) => BladesPC.IsType(user.character) && !user.isGM && typeof user.id === "string")
            .map((user) => user.id);
        const GMUserID = game.users.find((user) => user.isGM)?.id;
        if (!GMUserID) {
            throw new Error("No GM found!");
        }
        if (BladesPC.IsType(rollPrimaryDoc) && typeof rollPrimaryDoc.primaryUser?.id === "string") {
            userIDs.primary.push(rollPrimaryDoc.primaryUser.id);
        }
        else if (BladesCrew.IsType(rollPrimaryDoc)
            || BladesItem.IsType(rollPrimaryDoc, BladesItemType.cohort_gang, BladesItemType.cohort_expert)) {
            userIDs.primary.push(...primaryUserIDs);
        }
        else if (BladesGMTracker.IsType(rollPrimaryDoc)) {
            userIDs.primary.push(GMUserID);
            userIDs.observers.push(...primaryUserIDs);
        }
        if (config.rollParticipantData) {
            const participantUsers = Object.values(flattenObject(config.rollParticipantData))
                .map((pData) => {
                if (BladesRollParticipant.IsDoc(pData)) {
                    return pData;
                }
                if (BladesRollParticipant.IsValidData(pData)) {
                    if (BladesRollParticipant.IsDoc(pData.rollParticipantDoc)) {
                        return pData.rollParticipantDoc;
                    }
                    else if (typeof pData.rollParticipantID === "string") {
                        const pDoc = game.actors.get(pData.rollParticipantID) ?? game.items.get(pData.rollParticipantID);
                        if (BladesRollParticipant.IsDoc(pDoc)) {
                            return pDoc;
                        }
                    }
                }
                return null;
            })
                .map((pDoc) => {
                if (BladesPC.IsType(pDoc) && typeof pDoc.primaryUser?.id === "string") {
                    return pDoc.primaryUser.id;
                }
                else if (BladesCrew.IsType(rollPrimaryDoc)
                    || BladesItem.IsType(rollPrimaryDoc, BladesItemType.cohort_gang, BladesItemType.cohort_expert)) {
                    return primaryUserIDs;
                }
                return null;
            })
                .flat()
                .filter((pUser) => pUser !== null && !userIDs.primary.includes(pUser));
            userIDs.participants.push(...participantUsers);
            userIDs.observers = userIDs.observers.filter((uID) => !userIDs.participants.includes(uID));
        }
        socketlib.system.executeForAllGMs("constructRollCollab", { userID: rollUser.id, rollID, rollPermission: RollPermissions.GM });
        socketlib.system.executeForUsers("constructRollCollab", userIDs.primary, { userID: rollUser.id, rollID, rollPermission: RollPermissions.Primary });
        socketlib.system.executeForUsers("constructRollCollab", userIDs.participants, { userID: rollUser.id, rollID, rollPermission: RollPermissions.Participant });
        socketlib.system.executeForUsers("constructRollCollab", userIDs.observers, { userID: rollUser.id, rollID, rollPermission: RollPermissions.Observer });
    }

    rollID;
    rollPermission;
    _rollPrimary;
    _rollOpposition;
    _rollParticipants;
    constructor(userID, rollID, rollPermission) {
        const rollUser = game.users.get(userID);
        if (!rollUser) {
            throw new Error("[new BladesRollCollab()] Must provide a valid rollUser to roll.");
        }
        super(rollUser);
        this.rollID = rollID;
        this.rollPermission = rollPermission;
        const rollFlagData = rollUser.getFlag(C.SYSTEM_ID, "rollCollab");
        this._rollPrimary = new BladesRollPrimary(this, rollFlagData.rollPrimaryData);
        if (rollFlagData.rollOppData) {
            this._rollOpposition = new BladesRollOpposition(this, rollFlagData.rollOppData);
        }
        if (rollFlagData.rollParticipantData) {
            this._rollParticipants = {};
            for (const [rollSection, rollParticipantList] of Object.entries(rollFlagData.rollParticipantData)) {
                if ([RollModSection.roll, RollModSection.position, RollModSection.effect].includes(rollSection) && !U.isEmpty(rollParticipantList)) {
                    const sectionParticipants = {};
                    for (const [participantType, participantData] of Object.entries(rollParticipantList)) {
                        sectionParticipants[participantType] = new BladesRollParticipant(this, participantData);
                    }
                    this._rollParticipants[rollSection] = sectionParticipants;
                }
            }
        }
        BladesRollCollab.Current[this.rollID] = this;
    }
    
    get flagData() {
        if (!this.document.getFlag(C.SYSTEM_ID, "rollCollab")) {
            throw new Error("[get flags()] No RollCollab Flags Found on User Document");
        }
        return this.document.getFlag(C.SYSTEM_ID, "rollCollab");
    }
    get rollPrimary() {
        return this._rollPrimary;
    }
    get rollPrimaryDoc() {
        if (BladesRollPrimary.IsDoc(this.rollPrimary.rollPrimaryDoc)) {
            return this.rollPrimary.rollPrimaryDoc;
        }
        if (BladesRollPrimary.IsDoc(this.rollPrimary)) {
            return this.rollPrimary;
        }
        return undefined;
    }
    get rollOpposition() {
        if (this._rollOpposition instanceof BladesRollOpposition) {
            return this._rollOpposition;
        }
        return undefined;
    }
    set rollOpposition(val) {
        if (val === undefined) {
            this._rollOpposition = undefined;
        }
        else {
            this._rollOpposition = val;
        }
    }
    get rollParticipants() {
        return this._rollParticipants;
    }
    
    get rollType() { return this.flagData.rollType; }
    get rollSubType() { return this.flagData.rollSubType; }
    get rollDowntimeAction() { return this.flagData.rollDowntimeAction; }
    get rollTrait() { return this.flagData.rollTrait; }
    _rollTraitValOverride;
    get rollTraitValOverride() { return this._rollTraitValOverride; }
    set rollTraitValOverride(val) { this._rollTraitValOverride = val; }
    get rollTraitData() {
        if (BladesActor.IsType(this.rollPrimaryDoc, BladesActorType.pc)) {
            if (isAction(this.rollTrait)) {
                return {
                    name: this.rollTrait,
                    value: this.rollTraitValOverride ?? this.rollPrimaryDoc.actions[this.rollTrait],
                    max: this.rollTraitValOverride ?? this.rollPrimaryDoc.actions[this.rollTrait],
                    pcTooltip: this.rollPrimaryDoc.rollTraitPCTooltipActions,
                    gmTooltip: C.ActionTooltipsGM[this.rollTrait]
                };
            }
            if (isAttribute(this.rollTrait)) {
                return {
                    name: this.rollTrait,
                    value: this.rollTraitValOverride ?? this.rollPrimaryDoc.attributes[this.rollTrait],
                    max: this.rollTraitValOverride ?? this.rollPrimaryDoc.attributes[this.rollTrait],
                    pcTooltip: this.rollPrimaryDoc.rollTraitPCTooltipAttributes,
                    gmTooltip: C.AttributeTooltips[this.rollTrait]
                };
            }
        }
        if (U.isInt(this.rollTrait)) {
            return {
                name: `+${this.rollTraitValOverride ?? this.rollTrait}`,
                value: this.rollTraitValOverride ?? this.rollTrait,
                max: this.rollTraitValOverride ?? this.rollTrait
            };
        }
        if (isFactor(this.rollTrait)) {
            return {
                name: U.tCase(this.rollTrait),
                value: this.rollTraitValOverride ?? this.rollPrimary.rollFactors[this.rollTrait]?.value ?? 0,
                max: this.rollTraitValOverride ?? this.rollPrimary.rollFactors[this.rollTrait]?.max ?? 10
            };
        }
        throw new Error(`[get rollTraitData] Invalid rollTrait: '${this.rollTrait}'`);
    }
    get rollTraitOptions() {
        if (BladesActor.IsType(this.rollPrimaryDoc, BladesActorType.pc)) {
            if (isAction(this.rollTrait)) {
                return Object.values(ActionTrait)
                    .map((action) => ({
                    name: U.uCase(action),
                    value: action
                }));
            }
            if (isAttribute(this.rollTrait)) {
                return Object.values(AttributeTrait)
                    .map((attribute) => ({
                    name: U.uCase(attribute),
                    value: attribute
                }));
            }
        }
        if (U.isInt(this.rollTrait)) {
            return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
                .map((num) => ({
                name: `+${num}`,
                value: num
            }));
        }
        if (isFactor(this.rollTrait)) {
            return [];
        }
        throw new Error(`[get rollTraitOptions] Invalid rollTrait: '${this.rollTrait}'`);
    }
    get posEffectTrade() {
        return this.flagData?.rollPosEffectTrade ?? false;
    }
    get initialPosition() {
        return this.flagData?.rollPositionInitial ?? Position.risky;
    }
    set initialPosition(val) {
        this.document.setFlag(C.SYSTEM_ID, "rollCollab.rollPositionInitial", val).then(() => socketlib.system.executeForEveryone("renderRollCollab", this.rollID));
    }
    get initialEffect() {
        return this.flagData?.rollEffectInitial ?? Effect.standard;
    }
    set initialEffect(val) {
        this.document.setFlag(C.SYSTEM_ID, "rollCollab.rollEffectInitial", val).then(() => socketlib.system.executeForEveryone("renderRollCollab", this.rollID));
    }
    get rollConsequence() {
        return this.flagData?.rollConsequence;
    }

    get finalPosition() {
        return Object.values(Position)[U.clampNum(Object.values(Position)
            .indexOf(this.initialPosition)
            + this.getModsDelta(RollModSection.position)
            + (this.posEffectTrade === "position" ? 1 : 0)
            + (this.posEffectTrade === "effect" ? -1 : 0), [0, 2])];
    }
    get finalEffect() {
        return Object.values(Effect)[U.clampNum(Object.values(Effect)
            .indexOf(this.initialEffect)
            + this.getModsDelta(RollModSection.effect)
            + (this.posEffectTrade === "effect" ? 1 : 0)
            + (this.posEffectTrade === "position" ? -1 : 0), [0, 4])];
    }
    get finalResult() {
        return this.getModsDelta(RollModSection.result)
            + (this.flagData?.GMBoosts.Result ?? 0)
            + (this.tempGMBoosts.Result ?? 0);
    }
    get finalDicePool() {
        return Math.max(0, this.rollTraitData.value
            + this.getModsDelta(RollModSection.roll)
            + (this.flagData.GMBoosts.Dice ?? 0)
            + (this.tempGMBoosts.Dice ?? 0));
    }
    get isRollingZero() {
        return Math.max(0, this.rollTraitData.value
            + this.getModsDelta(RollModSection.roll)
            + (this.flagData.GMBoosts.Dice ?? 0)
            + (this.tempGMBoosts.Dice ?? 0)) <= 0;
    }
    _roll;
    get roll() {
        this._roll ??= new Roll(`${this.isRollingZero ? 2 : this.finalDicePool}d6`, {});
        return this._roll;
    }
    get rollFactors() {
        const sourceFactors = Object.fromEntries(Object.entries(this.rollPrimary.rollFactors)
            .map(([factor, factorData]) => [
            factor,
            {
                ...factorData,
                ...this.flagData.rollFactorToggles.source[factor] ?? []
            }
        ]));
        Object.entries(this.flagData.rollFactorToggles.source).forEach(([factor, factorData]) => {
            if (!(factor in sourceFactors)) {
                sourceFactors[factor] = {
                    name: factor,
                    value: 0,
                    max: 0,
                    baseVal: 0,
                    cssClasses: "factor-gold",
                    isActive: factorData.isActive ?? false,
                    isPrimary: factorData.isPrimary ?? (factor === Factor.tier),
                    isDominant: factorData.isDominant ?? false,
                    highFavorsPC: factorData.highFavorsPC ?? true
                };
            }
        });
        Object.keys(sourceFactors)
            .filter(isFactor)
            .forEach((factor) => {
            const factorData = sourceFactors[factor];
            if (!factorData) {
                return;
            }
            factorData.value ??= 0;
            factorData.value
                += (this.flagData.GMBoosts[factor] ?? 0)
                    + (this.tempGMBoosts[factor] ?? 0);
        });
        const rollOppFactors = this.rollOpposition?.rollFactors
            ?? Object.fromEntries(([
                Factor.tier,
                Factor.quality,
                Factor.scale,
                Factor.magnitude
            ]).map((factor) => [
                factor,
                {
                    name: factor,
                    value: 0,
                    max: 0,
                    baseVal: 0,
                    cssClasses: "factor-gold",
                    isActive: false,
                    isPrimary: factor === Factor.tier,
                    isDominant: false,
                    highFavorsPC: true
                }
            ]));
        const oppFactors = {};
        Object.entries(rollOppFactors)
            .forEach(([factor, factorData]) => {
            if (!isFactor(factor)) {
                return;
            }
            oppFactors[factor] = {
                ...factorData,
                ...this.flagData.rollFactorToggles.opposition[factor] ?? []
            };
        });
        Object.entries(this.flagData.rollFactorToggles.opposition)
            .forEach(([factor, factorData]) => {
            if (!isFactor(factor)) {
                return;
            }
            if (!(factor in oppFactors)) {
                oppFactors[factor] = {
                    name: factor,
                    value: 0,
                    max: 0,
                    baseVal: 0,
                    cssClasses: "factor-gold",
                    isActive: factorData.isActive ?? false,
                    isPrimary: factorData.isPrimary ?? (factor === Factor.tier),
                    isDominant: factorData.isDominant ?? false,
                    highFavorsPC: factorData.highFavorsPC ?? true
                };
            }
        });
        Object.keys(oppFactors).forEach((factor) => {
            if (!isFactor(factor)) {
                return;
            }
            const factorData = oppFactors[factor];
            if (!factorData) {
                return;
            }
            factorData.value += this.flagData.GMOppBoosts[factor] ?? 0;
            if (factor === Factor.tier) {
                factorData.display = U.romanizeNum(factorData.value);
            }
            else {
                factorData.display = `${factorData.value}`;
            }
        });
        return {
            source: sourceFactors,
            opposition: oppFactors
        };
    }
    initRollMods(modsData) {
        this.rollTraitValOverride = undefined;
        this.rollFactorPenaltiesNegated = {};
        this.tempGMBoosts = {};
        this.rollMods = modsData.map((modData) => new BladesRollMod(modData, this));
        const initReport = {};
                
        this.rollMods
            .filter((rollMod) => !rollMod.setConditionalStatus())
            .filter((rollMod) => !rollMod.setAutoStatus())
            .forEach((rollMod) => { rollMod.setPayableStatus(); });
                const parseForceOnKeys = (mod) => {
            const holdKeys = mod.effectKeys.filter((key) => key.startsWith("ForceOn"));
            if (holdKeys.length === 0) {
                return;
            }
            while (holdKeys.length) {
                const thisTarget = holdKeys.pop()?.split(/-/)?.pop();
                if (thisTarget === "BestAction") {
                    if (BladesPC.IsType(this.rollPrimaryDoc)) {
                        this.rollTraitValOverride = Math.max(...Object.values(this.rollPrimaryDoc.actions));
                    }
                }
                else {
                    const [targetName, targetCat, targetPosNeg] = thisTarget?.split(/,/) ?? [];
                    if (!targetName) {
                        throw new Error(`No targetName found in thisTarget: ${thisTarget}.`);
                    }
                    let targetMod = this.getRollModByName(targetName)
                        ?? this.getRollModByName(targetName, targetCat ?? mod.category);
                    if (!targetMod && targetName === "Push") {
                        [targetMod] = [
                            ...this.getActiveBasicPushMods(targetCat ?? mod.category, "negative").filter((m) => m.status === RollModStatus.ToggledOn),
                            ...this.getActiveBasicPushMods(targetCat ?? mod.category, "positive").filter((m) => m.status === RollModStatus.ToggledOn),
                            ...this.getInactiveBasicPushMods(targetCat ?? mod.category, "positive").filter((m) => m.status === RollModStatus.ToggledOff)
                        ];
                    }
                    targetMod ??= this.getRollModByName(targetName, targetCat ?? mod.category, targetPosNeg ?? mod.posNeg);
                    if (!targetMod) {
                        throw new Error(`No mod found matching ${targetName}/${targetCat}/${targetPosNeg}`);
                    }
                    if (!targetMod.isActive) {
                        targetMod.heldStatus = RollModStatus.ForcedOn;
                        parseForceOnKeys(targetMod);
                    }
                    else {
                        targetMod.heldStatus = RollModStatus.ForcedOn;
                    }
                }
            }
        };
        this.getActiveRollMods().forEach((rollMod) => parseForceOnKeys(rollMod));
                
        if (this.isForcePushed()) {
            this.getInactivePushMods()
                .filter((mod) => !mod.isBasicPush)
                .forEach((mod) => { mod.heldStatus = RollModStatus.ForcedOff; });
        }
        [RollModSection.roll, RollModSection.effect].forEach((cat) => {
            if (this.isPushed(cat)) {
                if (cat === RollModSection.roll && this.isPushed(cat, "positive")) {
                    const bargainMod = this.getRollModByID("Bargain-positive-roll");
                    if (bargainMod?.isVisible) {
                        bargainMod.heldStatus = RollModStatus.ForcedOff;
                    }
                }
            }
            else {
                this.getInactivePushMods(cat)
                    .filter((mod) => !mod.isBasicPush)
                    .forEach((mod) => { mod.heldStatus = RollModStatus.Hidden; });
            }
        });
                
        this.getVisibleRollMods()
            .forEach((mod) => { mod.setRelevancyStatus(); });
                
        const activeArmorCostMod = this.getActiveRollMods().find((mod) => mod.effectKeys.includes("Cost-SpecialArmor"));
        if (activeArmorCostMod) {
            this.getVisibleRollMods()
                .filter((mod) => !mod.isActive && mod.effectKeys.includes("Cost-SpecialArmor"))
                .forEach((mod) => { mod.heldStatus = RollModStatus.ForcedOff; });
        }
        eLog.checkLog2("rollMods", "*** initRollMods() PASS ***", initReport);
    }
    isTraitRelevant(trait) {
        if (trait in Factor) {
            const { source, opposition } = this.rollFactors;
            return Boolean(trait in source && trait in opposition && source[trait]?.isActive);
        }
        return false;
    }
    get isParticipantRoll() {
        return (this.rollType === RollType.Fortune && !game.user.isGM)
            || (this.rollSubType === RollSubType.GroupParticipant);
    }
    rollFactorPenaltiesNegated = {};
    negateFactorPenalty(factor) {
        this.rollFactorPenaltiesNegated[factor] = true;
    }
    tempGMBoosts = {};
    isPushed(cat, posNeg) { return this.getActiveBasicPushMods(cat, posNeg).length > 0; }
    hasOpenPush(cat, posNeg) { return this.isPushed(cat) && this.getOpenPushMods(cat, posNeg).length > 0; }
    isForcePushed(cat, posNeg) { return this.isPushed(cat) && this.getForcedPushMods(cat, posNeg).length > 0; }
    get rollCosts() {
        if (!this.isPushed) {
            return 0;
        }
        const harmPush = this.getRollModByID("Push-negative-roll");
        const rollPush = this.getRollModByID("Push-positive-roll");
        const effectPush = this.getRollModByID("Push-positive-effect");
        const negatePushCostMods = this.getActiveRollMods(RollModSection.after, "positive")
            .filter((mod) => mod.effectKeys.includes("Negate-PushCost"));
        return ((harmPush?.isActive && harmPush?.stressCost) || 0)
            + ((rollPush?.isActive && rollPush?.stressCost) || 0)
            + ((effectPush?.isActive && effectPush?.stressCost) || 0)
            - (negatePushCostMods.length * 2);
    }
    get rollCostData() {
        return this.getActiveRollMods()
            .map((rollMod) => rollMod.costs ?? [])
            .flat();
    }
    getRollModByName(name, cat, posNeg) {
        const modMatches = this.rollMods.filter((rollMod) => {
            if (U.lCase(rollMod.name) !== U.lCase(name)) {
                return false;
            }
            if (cat && rollMod.category !== cat) {
                return false;
            }
            if (posNeg && rollMod.posNeg !== posNeg) {
                return false;
            }
            return true;
        });
        if (modMatches.length === 0) {
            return undefined;
        }
        if (modMatches.length > 1) {
            return undefined;
        }
        return modMatches[0];
    }
    getRollModByID(id) { return this.rollMods.find((rollMod) => rollMod.id === id); }
    getRollMods(cat, posNeg) {
        return this.rollMods.filter((rollMod) => (!cat || rollMod.category === cat)
            && (!posNeg || rollMod.posNeg === posNeg));
    }
    getVisibleRollMods(cat, posNeg) {
        return this.getRollMods(cat, posNeg).filter((rollMod) => rollMod.isVisible);
    }
    getActiveRollMods(cat, posNeg) {
        return this.getRollMods(cat, posNeg).filter((rollMod) => rollMod.isActive);
    }
    getVisibleInactiveRollMods(cat, posNeg) {
        return this.getVisibleRollMods(cat, posNeg).filter((rollMod) => !rollMod.isActive);
    }
    getPushMods(cat, posNeg) {
        return this.getRollMods(cat, posNeg).filter((rollMod) => rollMod.isPush);
    }
    getVisiblePushMods(cat, posNeg) {
        return this.getPushMods(cat, posNeg).filter((rollMod) => rollMod.isVisible);
    }
    getActivePushMods(cat, posNeg) {
        return this.getVisiblePushMods(cat, posNeg).filter((rollMod) => rollMod.isActive);
    }
    getActiveBasicPushMods(cat, posNeg) {
        return this.getActivePushMods(cat, posNeg).filter((rollMod) => rollMod.isBasicPush);
    }
    getInactivePushMods(cat, posNeg) {
        return this.getVisiblePushMods(cat, posNeg).filter((rollMod) => !rollMod.isActive);
    }
    getInactiveBasicPushMods(cat, posNeg) {
        return this.getInactivePushMods(cat, posNeg).filter((rollMod) => rollMod.isBasicPush);
    }
    getForcedPushMods(cat, posNeg) {
        return this.getActivePushMods(cat, posNeg)
            .filter((rollMod) => rollMod.isBasicPush
            && rollMod.status === RollModStatus.ForcedOn);
    }
    getOpenPushMods(cat, posNeg) {
        return this.getActivePushMods(cat, posNeg)
            .filter((rollMod) => rollMod.isBasicPush
            && rollMod.status === RollModStatus.ToggledOn);
    }
    getModsDelta = (cat) => {
        return U.sum([
            ...this.getActiveRollMods(cat, "positive").map((mod) => mod.value),
            ...this.getActiveRollMods(cat, "negative").map((mod) => -mod.value)
        ]);
    };
    _rollMods;
        compareMods(modA, modB) {
        const modOrder = ["Bargain", "Assist", "Setup"];
        if (modA.isBasicPush) {
            return -1;
        }
        if (modB.isBasicPush) {
            return 1;
        }
        if (modA.name === "Bargain" && modA.isActive) {
            return -1;
        }
        if (modB.name === "Bargain" && modB.isActive) {
            return 1;
        }
        if (modA.isPush) {
            return -1;
        }
        if (modB.isPush) {
            return 1;
        }
        const modAIndex = modOrder.indexOf(modA.name);
        const modBIndex = modOrder.indexOf(modB.name);
        if (modAIndex !== -1 && modBIndex !== -1) {
            return modAIndex - modBIndex;
        }
        return modA.name.localeCompare(modB.name);
    }
    get rollMods() {
        if (!this._rollMods) {
            throw new Error("[get rollMods] No roll mods found!");
        }
        return [...this._rollMods].sort((modA, modB) => this.compareMods(modA, modB));
    }
    set rollMods(val) { this._rollMods = val; }
    
    
        async getData() {
        const context = super.getData();
        this.initRollMods(this.getRollModsData());
        this.rollMods.forEach((rollMod) => rollMod.applyRollModEffectKeys());
        const sheetData = this.getSheetData(this.getIsGM(), this.getRollCosts());
        return { ...context, ...sheetData };
    }
        getRollModsData() {
        const defaultMods = [
            ...BladesRollCollab.DefaultRollMods,
            ...this.rollPrimary.rollModsData
        ];
        if (this.rollOpposition?.rollOppModsData) {
            return [
                ...defaultMods,
                ...this.rollOpposition.rollOppModsData
            ];
        }
        return defaultMods;
    }
        getIsGM() {
        return game.eunoblades.Tracker?.system.is_spoofing_player ? false : game.user.isGM;
    }
        getRollCosts() {
        return this.getActiveRollMods()
            .map((rollMod) => rollMod.costs)
            .flat()
            .filter((costData) => costData !== undefined);
    }
        getStressCosts(rollCosts) {
        return rollCosts.filter((costData) => costData.costType === "Stress");
    }
        getTotalStressCost(stressCosts) {
        return U.sum(stressCosts.map((costData) => costData.costAmount));
    }
        getSpecArmorCost(rollCosts) {
        return rollCosts.find((costData) => costData.costType === "SpecialArmor");
    }
        getSheetData(isGM, rollCosts) {
        const { flagData: rData, rollPrimary, rollTraitData, rollTraitOptions, finalDicePool, finalPosition, finalEffect, finalResult, rollMods, rollFactors } = this;
        if (!rollPrimary) {
            throw new Error("A primary roll source is required for BladesRollCollab.");
        }
        const baseData = {
            ...this.flagData,
            cssClass: "roll-collab",
            editable: this.options.editable,
            isGM,
            system: this.rollPrimaryDoc?.system,
            rollMods,
            rollPrimary,
            rollTraitData,
            rollTraitOptions,
            diceTotal: finalDicePool,
            rollOpposition: this.rollOpposition,
            rollEffects: Object.values(Effect),
            teamworkDocs: game.actors.filter((actor) => BladesActor.IsType(actor, BladesActorType.pc)),
            rollTraitValOverride: this.rollTraitValOverride,
            rollFactorPenaltiesNegated: this.rollFactorPenaltiesNegated,
            posRollMods: Object.fromEntries(Object.values(RollModSection)
                .map((cat) => [cat, this.getRollMods(cat, "positive")])),
            negRollMods: Object.fromEntries(Object.values(RollModSection)
                .map((cat) => [cat, this.getRollMods(cat, "negative")])),
            hasInactiveConditionals: this.calculateHasInactiveConditionalsData(),
            rollFactors,
            oddsGradient: this.calculateOddsGradient(finalDicePool, finalResult),
            costData: this.parseCostsHTML(this.getStressCosts(rollCosts), this.getSpecArmorCost(rollCosts))
        };
        const rollPositionData = this.calculatePositionData(finalPosition);
        const rollEffectData = this.calculateEffectData(isGM, finalEffect);
        const rollResultData = this.calculateResultData(isGM, finalResult);
        const GMBoostsData = this.calculateGMBoostsData(rData);
        const positionEffectTradeData = this.calculatePositionEffectTradeData();
        return {
            ...baseData,
            ...(this.rollPrimary.rollPrimaryDoc ? { rollPrimary: this.rollPrimary.rollPrimaryDoc } : {}),
            ...rollPositionData,
            ...rollEffectData,
            ...rollResultData,
            ...GMBoostsData,
            ...positionEffectTradeData
        };
    }
    calculatePositionData(finalPosition) {
        return {
            rollPositions: Object.values(Position),
            rollPositionFinal: finalPosition
        };
    }
    calculateEffectData(isGM, finalEffect) {
        return {
            rollEffects: Object.values(Effect),
            rollEffectFinal: finalEffect,
            isAffectingAfter: this.getVisibleRollMods(RollModSection.after).length > 0
                || (isGM && this.getRollMods(RollModSection.after).length > 0)
        };
    }
    calculateResultData(isGM, finalResult) {
        return {
            rollResultFinal: finalResult,
            isAffectingResult: finalResult > 0
                || this.getVisibleRollMods(RollModSection.result).length > 0
                || (isGM && this.getRollMods(RollModSection.result).length > 0)
        };
    }
    calculateGMBoostsData(flagData) {
        return {
            GMBoosts: {
                Dice: flagData.GMBoosts.Dice ?? 0,
                [Factor.tier]: flagData.GMBoosts[Factor.tier] ?? 0,
                [Factor.quality]: flagData.GMBoosts[Factor.quality] ?? 0,
                [Factor.scale]: flagData.GMBoosts[Factor.scale] ?? 0,
                [Factor.magnitude]: flagData.GMBoosts[Factor.magnitude] ?? 0,
                Result: flagData.GMBoosts.Result ?? 0
            },
            GMOppBoosts: {
                [Factor.tier]: flagData.GMOppBoosts[Factor.tier] ?? 0,
                [Factor.quality]: flagData.GMOppBoosts[Factor.quality] ?? 0,
                [Factor.scale]: flagData.GMOppBoosts[Factor.scale] ?? 0,
                [Factor.magnitude]: flagData.GMOppBoosts[Factor.magnitude] ?? 0
            }
        };
    }
        calculateOddsGradient(diceTotal, finalResult) {
        const oddsColors = {
            crit: "var(--blades-cyan)",
            success: "var(--blades-gold)",
            partial: "var(--blades-grey-bright)",
            fail: "var(--blades-black-dark)"
        };
        const odds = { ...C.DiceOdds[diceTotal] };
        if (finalResult < 0) {
            for (let i = finalResult; i < 0; i++) {
                oddsColors.crit = oddsColors.success;
                oddsColors.success = oddsColors.partial;
                oddsColors.partial = oddsColors.fail;
            }
        }
        else if (finalResult > 0) {
            for (let i = 0; i < finalResult; i++) {
                oddsColors.fail = oddsColors.partial;
                oddsColors.partial = oddsColors.success;
                oddsColors.success = oddsColors.crit;
            }
        }
        const gradientStops = {
            fail: odds.fail,
            partial: odds.fail + odds.partial,
            success: odds.fail + odds.partial + odds.success
        };
        gradientStops.fail = Math.min(100, Math.max(0, Math.max(gradientStops.fail / 2, gradientStops.fail - 10)));
        const critSpan = 100 - gradientStops.success;
        gradientStops.success = Math.min(100, Math.max(0, gradientStops.success - Math.max(critSpan / 2, critSpan - 10)));
        return [
            "linear-gradient(to right",
            `${oddsColors.fail} ${gradientStops.fail}%`,
            `${oddsColors.partial} ${gradientStops.partial}%`,
            `${oddsColors.success} ${gradientStops.success}%`,
            `${oddsColors.crit})`
        ].join(", ");
    }
        calculatePositionEffectTradeData() {
        const canTradePosition = this.posEffectTrade === "position" || (this.posEffectTrade === false
            && this.finalPosition !== Position.desperate
            && this.finalEffect !== Effect.extreme);
        const canTradeEffect = this.posEffectTrade === "effect" || (this.posEffectTrade === false
            && this.finalPosition !== Position.controlled
            && this.finalEffect !== Effect.zero);
        return { canTradePosition, canTradeEffect };
    }
        calculateHasInactiveConditionalsData() {
        const hasInactive = {};
        for (const category of Object.values(RollModSection)) {
            hasInactive[category] = this.getRollMods(category).filter((mod) => mod.isInInactiveBlock).length > 0;
        }
        return hasInactive;
    }
        parseCostsHTML(stressCosts, specArmorCost) {
        if (specArmorCost || stressCosts.length > 0) {
            const totalStressCost = this.getTotalStressCost(stressCosts);
            return {
                footerLabel: [
                    "( Roll Costs",
                    totalStressCost > 0 ? `<span class='red-bright'><strong>${totalStressCost} Stress</strong></span>` : null,
                    specArmorCost && totalStressCost ? "and" : null,
                    specArmorCost ? "your <span class='cyan-bright'><strong>Special Armor</strong></span>" : null,
                    ")"
                ].filter((line) => Boolean(line)).join(" "),
                tooltip: [
                    "<h1>Roll Costs</h1><ul>",
                    ...stressCosts.map((costData) => `<li><strong class='shadowed'>${costData.label}: <span class='red-bright'>${costData.costAmount}</span> Stress</strong></li>`),
                    specArmorCost ? `<li><strong class='shadowed'>${specArmorCost.label}: <strong class='cyan-bright'>Special Armor</strong></strong></li>` : null,
                    "</ul>"
                ].filter((line) => Boolean(line)).join("")
            };
        }
        return undefined;
    }

    _dieVals;
    get dieVals() {
        this._dieVals ??= this.roll.terms[0].results
            .map((result) => result.result)
            .sort()
            .reverse();
        return this._dieVals;
    }
    getDieClass(val, i) {
        if (val === 6 && i <= 1 && this.rollResult === RollResult.critical) {
            val++;
        }
        return [
            "",
            "blades-die-fail",
            "blades-die-fail",
            "blades-die-fail",
            "blades-die-partial",
            "blades-die-partial",
            "blades-die-success",
            "blades-die-critical"
        ][val];
    }
    get dieValsHTML() {
        const dieVals = [...this.dieVals];
        const ghostNum = this.isRollingZero ? dieVals.shift() : null;
        if (this.rollType === RollType.Resistance) {
            return [
                ...dieVals.map((val, i) => `<span class='blades-die ${i === 0 ? "blades-die-resistance" : "blades-die-fail"} blades-die-${val}'><img src='systems/eunos-blades/assets/dice/faces/${val}.webp' /></span>`),
                ghostNum ? `<span class='blades-die blades-die-ghost blades-die-${ghostNum}'><img src='systems/eunos-blades/assets/dice/faces/${ghostNum}.webp' /></span>` : null
            ]
                .filter((val) => typeof val === "string")
                .join("");
        }
        else {
            return [
                ...dieVals.map(this.getDieClass),
                ghostNum ? `<span class='blades-die blades-die-ghost blades-die-${ghostNum}'><img src='systems/eunos-blades/assets/dice/faces/${ghostNum}.webp' /></span>` : null
            ]
                .filter((val) => typeof val === "string")
                .join("");
        }
    }
    get rollResult() {
        const dieVals = this.isRollingZero
            ? [[...this.dieVals].pop()]
            : this.dieVals;
        if (dieVals.filter((val) => val === 6).length >= 2) {
            return RollResult.critical;
        }
        if (dieVals.find((val) => val === 6)) {
            return RollResult.success;
        }
        if (dieVals.find((val) => val && val >= 4)) {
            return RollResult.partial;
        }
        return RollResult.fail;
    }
    async outputRollToChat() {
        const speaker = ChatMessage.getSpeaker();
        let renderedHTML;
        switch (this.rollType) {
            case RollType.Action: {
                renderedHTML = await renderTemplate("systems/eunos-blades/templates/chat/action-roll.hbs", {
                    sourceName: this.rollPrimary.rollPrimaryName,
                    oppName: this.rollOpposition?.rollOppName,
                    type: U.lCase(this.rollType),
                    subType: U.lCase(this.rollSubType),
                    downtimeAction: U.lCase(this.rollDowntimeAction),
                    position: this.finalPosition,
                    effect: this.finalEffect,
                    result: this.rollResult,
                    trait_label: typeof this.rollTrait === "number" ? `${this.rollTrait} Dice` : U.tCase(this.rollTrait),
                    dieVals: this.dieValsHTML
                });
                break;
            }
            case RollType.Resistance: {
                renderedHTML = await renderTemplate("systems/eunos-blades/templates/chat/resistance-roll.hbs", {
                    dieVals: this.dieValsHTML,
                    result: this.rollResult,
                    trait_label: typeof this.rollTrait === "number" ? `${this.rollTrait} Dice` : U.tCase(this.rollTrait),
                    stress: this.resistanceStressCost
                });
                break;
            }
            case RollType.Fortune: {
                break;
            }
            case RollType.IndulgeVice: {
                break;
            }
            default: throw new Error(`Unrecognized RollType: ${this.rollType}`);
        }
        const messageData = {
            speaker,
            content: renderedHTML,
            type: CONST.CHAT_MESSAGE_TYPES.ROLL,
            roll: this.roll
        };
        CONFIG.ChatMessage.documentClass.create(messageData, {});
    }
    async makeRoll() {
        await this.roll.evaluate({ async: true });
        await this.outputRollToChat();
        this.close();
    }

    _toggleRollModClick(event) {
        event.preventDefault();
        const elem$ = $(event.currentTarget);
        const id = elem$.data("id");
        const rollMod = this.getRollModByID(id);
        if (!rollMod) {
            throw new Error(`Unable to find roll mod with id '${id}'`);
        }
        switch (rollMod.status) {
            case RollModStatus.Hidden:
                rollMod.userStatus = RollModStatus.ForcedOff;
                return;
            case RollModStatus.ForcedOff:
                rollMod.userStatus = RollModStatus.ToggledOff;
                return;
            case RollModStatus.ToggledOff:
                rollMod.userStatus = RollModStatus.ToggledOn;
                return;
            case RollModStatus.ToggledOn:
                rollMod.userStatus = game.user.isGM ? RollModStatus.ForcedOn : RollModStatus.ToggledOff;
                return;
            case RollModStatus.ForcedOn:
                rollMod.userStatus = RollModStatus.Hidden;
                return;
            default: throw new Error(`Unrecognized RollModStatus: ${rollMod.status}`);
        }
    }
    _toggleRollModContext(event) {
        event.preventDefault();
        if (!game.user.isGM) {
            return;
        }
        const elem$ = $(event.currentTarget);
        const id = elem$.data("id");
        const rollMod = this.getRollModByID(id);
        if (!rollMod) {
            throw new Error(`Unable to find roll mod with id '${id}'`);
        }
        switch (rollMod.status) {
            case RollModStatus.Hidden:
                rollMod.userStatus = RollModStatus.ToggledOff;
                return;
            case RollModStatus.ForcedOff:
                rollMod.userStatus = RollModStatus.Hidden;
                return;
            case RollModStatus.ToggledOff:
                rollMod.userStatus = RollModStatus.ForcedOff;
                return;
            case RollModStatus.ToggledOn:
                rollMod.userStatus = RollModStatus.ToggledOff;
                return;
            case RollModStatus.ForcedOn:
                rollMod.userStatus = RollModStatus.Hidden;
                return;
            default: throw new Error(`Unrecognized RollModStatus: ${rollMod.status}`);
        }
    }
    _gmControlSet(event) {
        event.preventDefault();
        if (!game.user.isGM) {
            return;
        }
        const elem$ = $(event.currentTarget);
        const id = elem$.data("id");
        const status = elem$.data("status");
        if (!isModStatus(status)) {
            return;
        }
        const rollMod = this.getRollModByID(id);
        if (rollMod) {
            rollMod.userStatus = status;
        }
    }
    async _gmControlSetTargetToValue(event) {
        event.preventDefault();
        if (!game.user.isGM) {
            return;
        }
        const elem$ = $(event.currentTarget);
        const target = elem$.data("target").replace(/flags\.eunos-blades\./, "");
        const value = elem$.data("value");
        await this.document.setFlag(C.SYSTEM_ID, target, value).then(() => socketlib.system.executeForEveryone("renderRollCollab", this.rollID));
    }
    async _gmControlResetTarget(event) {
        event.preventDefault();
        if (!game.user.isGM) {
            return;
        }
        const elem$ = $(event.currentTarget);
        const target = elem$.data("target").replace(/flags\.eunos-blades\./, "");
        await this.document.unsetFlag(C.SYSTEM_ID, target).then(() => socketlib.system.executeForEveryone("renderRollCollab", this.rollID));
    }
    _gmControlReset(event) {
        event.preventDefault();
        if (!game.user.isGM) {
            return;
        }
        const elem$ = $(event.currentTarget);
        const id = elem$.data("id");
        const rollMod = this.getRollModByID(id);
        if (rollMod) {
            rollMod.userStatus = undefined;
        }
    }
    _gmControlSetPosition(event) {
        event.preventDefault();
        if (!game.user.isGM) {
            return;
        }
        const elem$ = $(event.currentTarget);
        const position = elem$.data("status");
        this.initialPosition = position;
    }
    _gmControlSetEffect(event) {
        event.preventDefault();
        if (!game.user.isGM) {
            return;
        }
        const elem$ = $(event.currentTarget);
        const effect = elem$.data("status");
        this.initialEffect = effect;
    }
    async _gmControlToggleFactor(event) {
        event.preventDefault();
        if (!game.user.isGM) {
            return;
        }
        const elem$ = $(event.currentTarget);
        const target = elem$.data("target");
        const value = !elem$.data("value");
        eLog.checkLog3("toggleFactor", "_gmControlToggleFactor", { event, target, value });
        if (value && /isPrimary/.test(target)) {
            const [thisSource, thisFactor] = target.split(/\./).slice(-3, -1);
            eLog.checkLog3("toggleFactor", "_gmControlToggleFactor - IN", { thisSource, thisFactor });
            await Promise.all(Object.values(Factor).map((factor) => {
                if (factor === thisFactor) {
                    eLog.checkLog3("toggleFactor", `_gmControlToggleFactor - Checking ${factor} === ${thisFactor} === TRUE`, { factor, thisFactor, target, customTarget: `rollCollab.rollFactorToggles.${thisSource}.${factor}.isPrimary` });
                    return this.document.setFlag(C.SYSTEM_ID, `rollCollab.rollFactorToggles.${thisSource}.${factor}.isPrimary`, true).then(() => socketlib.system.executeForEveryone("renderRollCollab", this.rollID));
                }
                else {
                    eLog.checkLog3("toggleFactor", `_gmControlToggleFactor - Checking ${factor} === ${thisFactor} === FALSE`, { factor, thisFactor, target, customTarget: `rollCollab.rollFactorToggles.${thisSource}.${factor}.isPrimary` });
                    return this.document.setFlag(C.SYSTEM_ID, `rollCollab.rollFactorToggles.${thisSource}.${factor}.isPrimary`, false).then(() => socketlib.system.executeForEveryone("renderRollCollab", this.rollID));
                }
            }));
            eLog.checkLog3("toggleFactor", "_gmControlToggleFactor - ALL DONE", { flags: this.document.getFlag(C.SYSTEM_ID, "rollCollab.rollFactorToggles") });
        }
        else {
            this.document.setFlag(C.SYSTEM_ID, `rollCollab.${target}`, value).then(() => socketlib.system.executeForEveryone("renderRollCollab", this.rollID));
        }
    }
    async _gmControlResetFactor(event) {
        event.preventDefault();
        if (!game.user.isGM) {
            return;
        }
        const elem$ = $(event.currentTarget);
        const target = elem$.data("target");
        await this.document.unsetFlag(C.SYSTEM_ID, `rollCollab.${target}`).then(() => socketlib.system.executeForEveryone("renderRollCollab", this.rollID));
    }
    get resistanceStressCost() {
        const dieVals = this.dieVals;
        if (this.rollResult === RollResult.critical) {
            return -1;
        }
        if (this.isRollingZero) {
            dieVals.shift();
        }
        return 6 - (dieVals.shift() ?? 0);
    }

    activateListeners(html) {
        super.activateListeners(html);
        ApplyTooltipListeners(html);
        html.find(".roll-mod[data-action='toggle']").on({
            click: this._toggleRollModClick.bind(this)
        });
        html.find("[data-action='tradePosition']").on({
            click: (event) => {
                const curVal = `${$(event.currentTarget).data("value")}`;
                if (curVal === "false") {
                    this.document.setFlag(C.SYSTEM_ID, "rollCollab.rollPosEffectTrade", "effect").then(() => socketlib.system.executeForEveryone("renderRollCollab", this.rollID));
                }
                else {
                    this.document.setFlag(C.SYSTEM_ID, "rollCollab.rollPosEffectTrade", false).then(() => socketlib.system.executeForEveryone("renderRollCollab", this.rollID));
                }
            }
        });
        html.find("[data-action='tradeEffect']").on({
            click: (event) => {
                const curVal = `${$(event.currentTarget).data("value")}`;
                if (curVal === "false") {
                    this.document.setFlag(C.SYSTEM_ID, "rollCollab.rollPosEffectTrade", "position").then(() => socketlib.system.executeForEveryone("renderRollCollab", this.rollID));
                }
                else {
                    this.document.setFlag(C.SYSTEM_ID, "rollCollab.rollPosEffectTrade", false).then(() => socketlib.system.executeForEveryone("renderRollCollab", this.rollID));
                }
            }
        });
        html.find("[data-action='roll']").on({
            click: () => this.makeRoll()
        });
        if (!game.user.isGM) {
            return;
        }
        html.on({
            focusin: () => { BladesRollCollab.Active = this; }
        });
        html.find("[data-action='gm-set'").on({
            click: this._gmControlSet.bind(this)
        });
        html.find("[data-action='gm-reset'").on({
            click: this._gmControlReset.bind(this)
        });
        html.find("[data-action='gm-set-position'").on({
            click: this._gmControlSetPosition.bind(this)
        });
        html.find("[data-action='gm-set-effect'").on({
            click: this._gmControlSetEffect.bind(this)
        });
        html.find("[data-action='gm-set-target'").on({
            click: this._gmControlSetTargetToValue.bind(this),
            contextmenu: this._gmControlResetTarget.bind(this)
        });
        html.find("[data-action='gm-toggle-factor'").on({
            click: this._gmControlToggleFactor.bind(this),
            contextmenu: this._gmControlResetFactor.bind(this)
        });
        html.find(".controls-toggle").on({
            click: (event) => {
                event.preventDefault();
                $(event.currentTarget).parents(".controls-panel").toggleClass("active");
            }
        });
    }

    _canDragDrop(selector) {
        eLog.checkLog3("canDragDrop", "Can DragDrop Selector", { selector });
        return game.user.isGM;
    }
    _onDrop(event) {
        const data = TextEditor.getDragEventData(event);
        const { type, uuid } = data;
        const [id] = (new RegExp(`${type}\\.(.+)`).exec(uuid) ?? []).slice(1);
        const oppDoc = game[`${U.lCase(type)}s`].get(id);
        if (BladesRollOpposition.IsDoc(oppDoc)) {
            this.rollOpposition = new BladesRollOpposition(this, { rollOppDoc: oppDoc });
        }
    }
    async _onSubmit(event, { updateData } = {}) {
        return super._onSubmit(event, { updateData, preventClose: true })
            .then((returnVal) => { this.render(); return returnVal; });
    }
    async close(options = {}) {
        if (options.rollID) {
            return super.close({});
        }
        await this.document.setFlag(C.SYSTEM_ID, "rollCollab", null);
        socketlib.system.executeForEveryone("closeRollCollab", this.rollID);
        return undefined;
    }
    render(force = false, options) {
        if (!this.document.getFlag(C.SYSTEM_ID, "rollCollab")) {
            return this;
        }
        return super.render(force, options);
    }
}

export { BladesRollMod, BladesRollPrimary, BladesRollOpposition, BladesRollParticipant };
export default BladesRollCollab;