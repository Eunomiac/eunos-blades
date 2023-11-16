// #region IMPORTS ~
import U from "./core/utilities.js";
import C, { BladesActorType, BladesItemType, RollPermissions, RollType, RollSubType, RollModStatus, RollModSection, ActionTrait, DowntimeAction, AttributeTrait, Position, Effect, Factor, RollResult, RollPhase, ConsequenceType, Tag } from "./core/constants.js";
import { BladesActor, BladesPC, BladesCrew } from "./documents/BladesActorProxy.js";
import { BladesItem, BladesGMTracker } from "./documents/BladesItemProxy.js";
import { ApplyTooltipListeners, ApplyConsequenceListeners } from "./core/gsap.js";
import BladesDialog from "./BladesDialog.js";
import BladesChat from "./BladesChat.js";
// #endregion
// #region Types & Type Checking ~
/*~ @@DOUBLE-BLANK@@ ~*/
/**
 * Checks if the given string is a RollType.
 * @param {unknown} str The string to check.
 * @returns {boolean} True if the string is a RollType, false otherwise.
 */
function isRollType(str) {
    return typeof str === "string" && str in RollType;
}
/*~ @@DOUBLE-BLANK@@ ~*/
/**
 * Checks if the given trait is an ActionTrait.
 * @param {unknown} trait The trait to check.
 * @returns {boolean} True if the trait is an ActionTrait, false otherwise.
 */
function isAction(trait) {
    return Boolean(trait && typeof trait === "string" && U.lCase(trait) in ActionTrait);
}
/*~ @@DOUBLE-BLANK@@ ~*/
/**
 * Checks if the given trait is an AttributeTrait.
 * @param {unknown} trait The trait to check.
 * @returns {boolean} True if the trait is an AttributeTrait, false otherwise.
 */
function isAttribute(trait) {
    return Boolean(trait && typeof trait === "string" && U.lCase(trait) in AttributeTrait);
}
/*~ @@DOUBLE-BLANK@@ ~*/
/**
 * Checks if the given trait is a Factor.
 * @param {unknown} trait The trait to check.
 * @returns {boolean} True if the trait is a Factor, false otherwise.
 */
function isFactor(trait) {
    return Boolean(trait && typeof trait === "string" && U.lCase(trait) in Factor);
}
/*~ @@DOUBLE-BLANK@@ ~*/
/**
 * Checks if the given string is a RollModStatus.
 * @param {unknown} str The string to check.
 * @returns {boolean} True if the string is a RollModStatus, false otherwise.
 */
function isModStatus(str) {
    return typeof str === "string" && str in RollModStatus;
}
/*~ @@DOUBLE-BLANK@@ ~*/
/**
 * Checks if the given value is valid consequence data for a Resistance Roll.
 * @param {unknown} val The value to check.
 * @param {boolean} [isCheckingResistedTo=false] If the check is being recursively
 *                         applied to the 'resistedTo' value.
 * @returns {boolean} True if the val is valid BladesRoll.ResistanceRollConsequenceData, false otherwise.
 */
function isValidConsequenceData(val, isCheckingResistedTo = false) {
    if (!U.isList(val)) {
        return false;
    }
    if (typeof val.name !== "string") {
        return false;
    }
    if (typeof val.icon !== "string") {
        return false;
    }
    if (typeof val.type !== "string" || !(val.type in ConsequenceType)) {
        return false;
    }
    if (typeof val.typeDisplay !== "string") {
        return false;
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    if (isCheckingResistedTo) {
        return true;
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    if (typeof val.attribute !== "string" || !(val.attribute in AttributeTrait)) {
        return false;
    }
    if (!isValidConsequenceData(val.resistedTo, true)) {
        return false;
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    return true;
}
/*~ @@DOUBLE-BLANK@@ ~*/
/**
 * Checks if the given section can contain BladesRollParticipant documents.
 * @param {RollModSection} section
 */
function isParticipantSection(section) {
    return [
        RollModSection.roll,
        RollModSection.position,
        RollModSection.effect
    ].includes(section);
}
/*~ @@DOUBLE-BLANK@@ ~*/
/**
 * Checks if the given subSection can hold BladesRollParticipant documents.
 * @param {string} subSection
 */
function isParticipantSubSection(subSection) {
    if (subSection.startsWith("Group_")) {
        return true;
    }
    if (["Assist", "Setup"].includes(subSection)) {
        return true;
    }
    return false;
}
// #endregion
// #region Utility Functions ~
/**
 * Prunes the configuration file of flag-incompatible direct document references.
 * @param {BladesRoll.Config} cfg The configuration object to be pruned.
 * @returns {BladesRoll.ConfigFlags} - The pruned configuration object.
 */
function pruneConfig(cfg) {
    return expandObject(U.objFilter(flattenObject(cfg), (v) => !(v instanceof BladesActor) && !(v instanceof BladesItem)));
}
// #endregion
/*~ @@DOUBLE-BLANK@@ ~*/
class BladesRollMod {
    /*~ @@DOUBLE-BLANK@@ ~*/
    static ParseDocRollMods(doc) {
        /*~ @@DOUBLE-BLANK@@ ~*/
        const { roll_mods } = doc.system;
        if (!roll_mods || roll_mods.length === 0) {
            return [];
        }
        /*~ @@DOUBLE-BLANK@@ ~*/
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
            /*~ @@DOUBLE-BLANK@@ ~*/
            const rollModData = {
                id: `${nameVal}-${posNegVal}-${catVal}`,
                name: nameVal,
                section: catVal,
                base_status: RollModStatus.ToggledOff,
                modType: "general",
                value: 1,
                posNeg: posNegVal,
                tooltip: ""
            };
            /*~ @@DOUBLE-BLANK@@ ~*/
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
                /*~ @@DOUBLE-BLANK@@ ~*/
                if (key === "base_status" && val === "Conditional") {
                    val = RollModStatus.Hidden;
                }
                /*~ @@DOUBLE-BLANK@@ ~*/
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
                /*~ @@DOUBLE-BLANK@@ ~*/
                Object.assign(rollModData, { [key]: valProcessed });
            });
            /*~ @@DOUBLE-BLANK@@ ~*/
            return rollModData;
        });
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    get status() {
        if (this.userStatus
            && [RollModStatus.ForcedOn, RollModStatus.ForcedOff, RollModStatus.Hidden].includes(this.userStatus)) {
            return this.userStatus;
        }
        if (this.heldStatus && [RollModStatus.ToggledOff, RollModStatus.ToggledOn].includes(this.heldStatus)) {
            return this.userStatus ?? this.heldStatus;
        }
        return this.heldStatus ?? this.userStatus ?? this.baseStatus;
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    get isActive() { return [RollModStatus.ToggledOn, RollModStatus.ForcedOn].includes(this.status); }
    /*~ @@DOUBLE-BLANK@@ ~*/
    get isVisible() { return this.status !== RollModStatus.Hidden; }
    /*~ @@DOUBLE-BLANK@@ ~*/
    _heldStatus;
    /*~ @@DOUBLE-BLANK@@ ~*/
    get heldStatus() { return this._heldStatus; }
    /*~ @@DOUBLE-BLANK@@ ~*/
    set heldStatus(val) {
        this._heldStatus = val;
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    get flagParams() { return [C.SYSTEM_ID, `rollCollab.rollModsData.${this.id}`]; }
    /*~ @@DOUBLE-BLANK@@ ~*/
    getUserStatusFlag() {
        return this.rollInstance.document.getFlag(...this.flagParams);
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    async setUserStatusFlag(val) {
        if (val === this.userStatus) {
            return;
        }
        if (!val || val === this.baseStatus) {
            await this.rollInstance.document.unsetFlag(...this.flagParams);
        }
        else {
            const lockedToGM = [
                RollModStatus.ForcedOn,
                RollModStatus.ForcedOff,
                RollModStatus.Hidden
            ];
            if (!game.user.isGM
                && (lockedToGM.includes(val)
                    || (this.userStatus && lockedToGM.includes(this.userStatus)))) {
                return;
            }
            await this.rollInstance.document.setFlag(...this.flagParams, val);
        }
        await socketlib.system.executeForEveryone("renderRollCollab", this.rollInstance.rollID);
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    get userStatus() {
        return this.getUserStatusFlag();
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    set userStatus(val) {
        this.setUserStatusFlag(val);
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    get sourceName() { return this._sourceName; }
    /*~ @@DOUBLE-BLANK@@ ~*/
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
    /*~ @@DOUBLE-BLANK@@ ~*/
    get isInInactiveBlock() {
        if (game.user.isGM) {
            return [RollModStatus.Hidden, RollModStatus.ForcedOff, RollModStatus.ToggledOff].includes(this.status)
                && (this.isConditional || [BladesItemType.ability].includes(this.modType));
        }
        return [RollModStatus.ForcedOff, RollModStatus.ToggledOff].includes(this.status)
            && (this.isConditional || [BladesItemType.ability].includes(this.modType));
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    get isPush() {
        return Boolean(U.lCase(this.name) === "push"
            || this.effectKeys.find((eKey) => eKey === "Is-Push"));
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    get isBasicPush() { return U.lCase(this.name) === "push"; }
    /*~ @@DOUBLE-BLANK@@ ~*/
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
    /*~ @@DOUBLE-BLANK@@ ~*/
    isValidForRollType() {
        switch (this.rollInstance.rollType) {
            case RollType.Action: {
                return true;
            }
            case RollType.Resistance:
            case RollType.Fortune:
            case RollType.IndulgeVice: {
                if (this.isPush
                    || ["bargain", "setup", "assist", "potency"].includes(U.lCase(this.name))) {
                    return false;
                }
                return true;
            }
            default: return false;
        }
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    /**
     * Sets the conditional status of the roll instance.
     * @returns {boolean} - Returns false if the status is ForcedOn or ToggledOff, true if the status is Hidden.
     */
    setConditionalStatus() {
        // If the roll instance is not conditional, return false
        if (!this.isConditional) {
            return false;
        }
        /*~ @@DOUBLE-BLANK@@ ~*/
        // If any auto-Traits/Types apply, set status to ForcedOn and return false
        const autoTypesOrTraitsApply = this.autoRollTypes.includes(this.rollInstance.rollType)
            || (!this.rollInstance.rollTrait || this.autoRollTraits.includes(this.rollInstance.rollTrait));
        if (autoTypesOrTraitsApply) {
            this.heldStatus = RollModStatus.ForcedOn;
            return false;
        }
        /*~ @@DOUBLE-BLANK@@ ~*/
        // If any conditionalTypes apply and any conditionalTraits apply, set status to ToggledOff and return false
        const conditionalTypesOrTraitsApply = this.checkTypesOrTraits(this.conditionalRollTypes, this.conditionalRollTraits);
        if (conditionalTypesOrTraitsApply) {
            this.heldStatus = RollModStatus.ToggledOff;
            return false;
        }
        /*~ @@DOUBLE-BLANK@@ ~*/
        // If this is a participant roll
        //   AND any participantTypes apply
        //   AND any participantTraits apply,
        // ... set status to ToggledOff and return false
        const participantTypesOrTraitsApply = this.rollInstance.isParticipantRoll
            && this.checkTypesOrTraits(this.participantRollTypes, this.participantRollTraits);
        if (participantTypesOrTraitsApply) {
            this.heldStatus = RollModStatus.ToggledOff;
            return false;
        }
        /*~ @@DOUBLE-BLANK@@ ~*/
        // If none of the above conditions apply, set status to Hidden and return true
        this.heldStatus = RollModStatus.Hidden;
        return true;
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    /**
     * Checks if any types or traits apply to the roll instance.
     * @param {AnyRollType[]} types The types to check.
     * @param {RollTrait[]} traits The traits to check.
     * @returns {boolean} - Returns true if any types or traits apply, false otherwise.
     */
    checkTypesOrTraits(types, traits) {
        const typesApply = Boolean((!this.rollInstance.isParticipantRoll && types.length === 0)
            || types.includes(this.rollInstance.rollType));
        const traitsApply = Boolean((!this.rollInstance.isParticipantRoll && traits.length === 0)
            || (this.rollInstance.rollTrait && traits.includes(this.rollInstance.rollTrait)));
        return typesApply && traitsApply;
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    /**
     * Helper function to process each key
     * @param {string} key The key to process
     * @returns {boolean} - Whether the processing was successful
     */
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
    /*~ @@DOUBLE-BLANK@@ ~*/
    setAutoStatus() {
        // Check for AutoRevealOn and AutoEnableOn
        const holdKeys = this.effectKeys.filter((key) => key.startsWith("Auto"));
        if (holdKeys.length === 0) {
            return false;
        }
        /*~ @@DOUBLE-BLANK@@ ~*/
        for (const key of holdKeys) {
            if (this.processKey(key)) {
                return false;
            }
        }
        /*~ @@DOUBLE-BLANK@@ ~*/
        this.heldStatus = RollModStatus.Hidden;
        return true;
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    setRelevancyStatus() {
        const holdKeys = this.effectKeys.filter((key) => /^Negate|^Increase/.test(key));
        if (holdKeys.length === 0) {
            return false;
        }
        /*~ @@DOUBLE-BLANK@@ ~*/
        const relevantKeys = holdKeys
            .filter((key) => {
            const [thisKey, thisParam] = key.split(/-/) ?? [];
            /*~ @@DOUBLE-BLANK@@ ~*/
            const negateOperations = {
                PushCost: () => this.rollInstance.isPushed(),
                PushCost0: () => this.rollInstance.isPushed(),
                Consequence: () => this.rollInstance.rollType === RollType.Resistance
                    && Boolean(this.rollInstance.rollConsequence),
                HarmLevel: () => {
                    if (this.rollInstance.rollType !== RollType.Resistance) {
                        return false;
                    }
                    if (!this.rollInstance.rollConsequence?.type) {
                        return false;
                    }
                    const { type: csqType } = this.rollInstance.rollConsequence;
                    return [
                        ConsequenceType.InsightHarm1, ConsequenceType.ProwessHarm1, ConsequenceType.ResolveHarm1,
                        ConsequenceType.InsightHarm2, ConsequenceType.ProwessHarm2, ConsequenceType.ResolveHarm2,
                        ConsequenceType.InsightHarm3, ConsequenceType.ProwessHarm3, ConsequenceType.ResolveHarm3,
                        ConsequenceType.InsightHarm4, ConsequenceType.ProwessHarm4, ConsequenceType.ResolveHarm4
                    ].includes(csqType);
                },
                QualityPenalty: () => this.rollInstance.isTraitRelevant(Factor.quality)
                    && (this.rollInstance.rollFactors.source[Factor.quality]?.value ?? 0)
                        < (this.rollInstance.rollFactors.opposition[Factor.quality]?.value ?? 0),
                ScalePenalty: () => this.rollInstance.isTraitRelevant(Factor.scale)
                    && (this.rollInstance.rollFactors.source[Factor.scale]?.value ?? 0)
                        < (this.rollInstance.rollFactors.opposition[Factor.scale]?.value ?? 0),
                TierPenalty: () => this.rollInstance.isTraitRelevant(Factor.tier)
                    && (this.rollInstance.rollFactors.source[Factor.tier]?.value ?? 0)
                        < (this.rollInstance.rollFactors.opposition[Factor.tier]?.value ?? 0)
            };
            /*~ @@DOUBLE-BLANK@@ ~*/
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
    /*~ @@DOUBLE-BLANK@@ ~*/
    setPayableStatus() {
        const holdKeys = this.effectKeys.filter((key) => key.startsWith("Cost"));
        if (holdKeys.length === 0) {
            return false;
        }
        /*~ @@DOUBLE-BLANK@@ ~*/
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
        /*~ @@DOUBLE-BLANK@@ ~*/
        if (payableKeys.length === 0) {
            this.heldStatus = RollModStatus.ForcedOff;
            return true;
        }
        return false;
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    applyRollModEffectKeys() {
        if (!this.isActive) {
            return;
        }
        /*~ @@DOUBLE-BLANK@@ ~*/
        const holdKeys = this.effectKeys.filter((key) => /^Negate|^Increase/.test(key));
        if (holdKeys.length === 0) {
            return;
        }
        /*~ @@DOUBLE-BLANK@@ ~*/
        holdKeys.forEach((key) => {
            // Console.log({key, split: key.split(/-/)})
            const [thisKey, thisParam] = key.split(/-/) ?? [];
            /*~ @@DOUBLE-BLANK@@ ~*/
            const negateOperations = {
                PushCost: () => {
                    const costlyPushMod = this.rollInstance.getActiveRollMods()
                        .find((mod) => mod.isPush && mod.stressCost > 0);
                    if (costlyPushMod) {
                        U.pullElement(costlyPushMod.effectKeys, (k) => k.startsWith("Cost-Stress"));
                    }
                },
                // PushCost0: negateOperations.PushCost,
                Consequence: () => {
                    /*~ @@DOUBLE-BLANK@@ ~*/
                    /* Should cancel roll entirely? */
                },
                // HarmLevel: () => {
                //   const harmLevels = [
                //     [ConsequenceType.InsightHarm1, ConsequenceType.ProwessHarm1, ConsequenceType.ResolveHarm1],
                //     [ConsequenceType.InsightHarm2, ConsequenceType.ProwessHarm2, ConsequenceType.ResolveHarm2],
                //     [ConsequenceType.InsightHarm3, ConsequenceType.ProwessHarm3, ConsequenceType.ResolveHarm3],
                //     [ConsequenceType.InsightHarm4, ConsequenceType.ProwessHarm4, ConsequenceType.ResolveHarm4]
                //   ];
                //   let harmConsequence: BladesRoll.ResistanceRollConsequenceData|undefined = undefined;
                //   while (!harmConsequence && harmLevels.length > 0) {
                //     harmConsequence = Object.values(this.rollInstance.rollConsequences)
                //       .find(({type}) => (harmLevels.pop() ?? []).includes(type as ConsequenceType));
                //   }
                //   if (harmConsequence) {
                //     harmConsequence.resistedTo = {
                //       name: [
                //         ConsequenceType.InsightHarm1,
                //         ConsequenceType.ProwessHarm1,
                //         ConsequenceType.ResolveHarm1
                //       ].includes(harmConsequence.type as ConsequenceType)
                //         ? "Fully Negated"
                //         : (Object.values(harmConsequence.resistOptions ?? [])[0]?.name ?? harmConsequence.name),
                //       type: C.ResistedConsequenceTypes[harmConsequence.type as KeyOf<typeof C["ResistedConsequenceTypes"]>],
                //       isSelected: true
                //     };
                //   }
                // },
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
            /*~ @@DOUBLE-BLANK@@ ~*/
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
                throw new Error(`Unrecognized Function Key: ${thisKey} (key: ${key})`);
            }
        });
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    get selectOptions() {
        if (this.modType !== "teamwork") {
            return null;
        }
        if (this.name === "Assist" || this.name === "Setup") {
            return this.rollInstance.rollParticipantSelectOptions[this.name];
        }
        else if (this.name.startsWith("Group_")) {
            return this.rollInstance.rollParticipantSelectOptions.Group;
        }
        return null;
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    get selectedParticipant() {
        if (this.modType !== "teamwork") {
            return null;
        }
        return this.rollInstance.getRollParticipant(this.section, this.name);
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    get tooltip() {
        let parsedTooltip = this._tooltip.replace(/%COLON%/g, ":");
        if (parsedTooltip.includes("%DOC_NAME%")) {
            parsedTooltip = parsedTooltip.replace(/%DOC_NAME%/g, this.selectedParticipant
                ? this.selectedParticipant.rollParticipantName
                : "an Ally");
        }
        if (parsedTooltip.includes("@OPPOSITION_NAME@")) {
            parsedTooltip = parsedTooltip.replace(/@OPPOSITION_NAME@/g, this.rollInstance.rollOpposition
                ? this.rollInstance.rollOpposition.rollOppName
                : "Your Opposition");
        }
        return parsedTooltip;
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    get sideString() {
        if (this._sideString) {
            return this._sideString;
        }
        if (this.selectedParticipant) {
            return this.selectedParticipant.rollParticipantName;
        }
        return undefined;
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    get allFlagData() {
        return this.rollInstance.document.getFlag("eunos-blades", "rollCollab");
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
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
            modType: this.modType,
            conditionalRollTypes: this.conditionalRollTypes,
            autoRollTypes: this.autoRollTypes,
            conditionalRollTraits: this.conditionalRollTraits,
            autoRollTraits: this.autoRollTraits,
            section: this.section
        };
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    get costs() {
        if (!this.isActive) {
            return undefined;
        }
        const holdKeys = this.effectKeys.filter((key) => key.startsWith("Cost"));
        if (holdKeys.length === 0) {
            return undefined;
        }
        /*~ @@DOUBLE-BLANK@@ ~*/
        return holdKeys.map((key) => {
            const [thisParam] = (key.split(/-/) ?? []).slice(1);
            const [traitStr, valStr] = (/([A-Za-z]+)(\d*)/.exec(thisParam) ?? []).slice(1);
            /*~ @@DOUBLE-BLANK@@ ~*/
            let label = this.name;
            if (this.isBasicPush) {
                if (this.posNeg === "negative") {
                    label = `${this.name} (<span class='red-bright'>To Act</span>)`;
                }
                else {
                    const effect = this.section === RollModSection.roll ? "+1d" : "+1 effect";
                    label = `${this.name} (<span class='gold-bright'>${effect}</span>)`;
                }
            }
            /*~ @@DOUBLE-BLANK@@ ~*/
            return {
                id: this.id,
                label,
                costType: traitStr,
                costAmount: valStr ? U.pInt(valStr) : 1
            };
        });
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    id;
    /*~ @@DOUBLE-BLANK@@ ~*/
    name;
    /*~ @@DOUBLE-BLANK@@ ~*/
    _sourceName;
    /*~ @@DOUBLE-BLANK@@ ~*/
    baseStatus;
    /*~ @@DOUBLE-BLANK@@ ~*/
    value;
    /*~ @@DOUBLE-BLANK@@ ~*/
    effectKeys;
    /*~ @@DOUBLE-BLANK@@ ~*/
    _sideString;
    /*~ @@DOUBLE-BLANK@@ ~*/
    _tooltip;
    /*~ @@DOUBLE-BLANK@@ ~*/
    posNeg;
    /*~ @@DOUBLE-BLANK@@ ~*/
    modType;
    /*~ @@DOUBLE-BLANK@@ ~*/
    conditionalRollTypes;
    /*~ @@DOUBLE-BLANK@@ ~*/
    autoRollTypes;
    /*~ @@DOUBLE-BLANK@@ ~*/
    participantRollTypes;
    /*~ @@DOUBLE-BLANK@@ ~*/
    conditionalRollTraits;
    /*~ @@DOUBLE-BLANK@@ ~*/
    autoRollTraits;
    /*~ @@DOUBLE-BLANK@@ ~*/
    participantRollTraits;
    /*~ @@DOUBLE-BLANK@@ ~*/
    section;
    /*~ @@DOUBLE-BLANK@@ ~*/
    rollInstance;
    /*~ @@DOUBLE-BLANK@@ ~*/
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
        this.modType = modData.modType;
        this.conditionalRollTypes = modData.conditionalRollTypes ?? [];
        this.autoRollTypes = modData.autoRollTypes ?? [];
        this.participantRollTypes = modData.participantRollTypes ?? [];
        this.conditionalRollTraits = modData.conditionalRollTraits ?? [];
        this.autoRollTraits = modData.autoRollTraits ?? [];
        this.participantRollTraits = modData.participantRollTraits ?? [];
        this.section = modData.section;
    }
}
/*~ @@DOUBLE-BLANK@@ ~*/
class BladesRollPrimary {
    /*~ @@DOUBLE-BLANK@@ ~*/
    // #region Static Methods ~
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
    /*~ @@DOUBLE-BLANK@@ ~*/
    static IsDoc(doc) {
        return BladesActor.IsType(doc, BladesActorType.pc, BladesActorType.crew)
            || BladesItem.IsType(doc, BladesItemType.cohort_expert, BladesItemType.cohort_gang, BladesItemType.gm_tracker);
    }
    // #endregion
    /*~ @@DOUBLE-BLANK@@ ~*/
    rollInstance;
    /*~ @@DOUBLE-BLANK@@ ~*/
    rollPrimaryID;
    /*~ @@DOUBLE-BLANK@@ ~*/
    _rollPrimaryDoc;
    /*~ @@DOUBLE-BLANK@@ ~*/
    get rollPrimaryDoc() {
        if (!this._rollPrimaryDoc) {
            let doc;
            if (this.rollPrimaryID) {
                doc = game.items.get(this.rollPrimaryID)
                    ?? game.actors.get(this.rollPrimaryID);
            }
            if (!doc && this.rollPrimaryName) {
                doc = game.items.getName(this.rollPrimaryName)
                    ?? game.actors.getName(this.rollPrimaryName);
            }
            if (BladesRollPrimary.IsDoc(doc)) {
                this._rollPrimaryDoc = doc;
            }
        }
        return this._rollPrimaryDoc;
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    rollPrimaryName;
    /*~ @@DOUBLE-BLANK@@ ~*/
    rollPrimaryType;
    /*~ @@DOUBLE-BLANK@@ ~*/
    rollPrimaryImg;
    /*~ @@DOUBLE-BLANK@@ ~*/
    _rollModsData;
    /*~ @@DOUBLE-BLANK@@ ~*/
    get rollModsData() {
        return this.rollPrimaryDoc?.rollModsData ?? this._rollModsData ?? [];
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    rollFactors;
    /*~ @@DOUBLE-BLANK@@ ~*/
    // #region Constructor ~
    constructor(rollInstance, { rollPrimaryID, rollPrimaryName, rollPrimaryType, rollPrimaryImg, rollModsData, rollFactors }) {
        // Identify ID, Doc, Name, SubName, Type & Image, to best of ability
        this.rollInstance = rollInstance;
        /*~ @@DOUBLE-BLANK@@ ~*/
        this.rollPrimaryID = rollPrimaryID
            ?? this.rollInstance.rollPrimary.rollPrimaryID
            ?? this.rollInstance.rollPrimary.rollPrimaryDoc?.rollPrimaryID;
        /*~ @@DOUBLE-BLANK@@ ~*/
        rollPrimaryName ??= this.rollInstance.rollPrimary.rollPrimaryName;
        rollPrimaryType ??= this.rollInstance.rollPrimary.rollPrimaryType;
        rollPrimaryImg ??= this.rollInstance.rollPrimary.rollPrimaryImg;
        rollModsData ??= this.rollInstance.rollPrimary.rollModsData;
        rollFactors ??= this.rollInstance.rollPrimary.rollFactors;
        /*~ @@DOUBLE-BLANK@@ ~*/
        if (BladesRollPrimary.IsDoc(this.rollPrimaryDoc)) {
            this.rollPrimaryName = rollPrimaryName ?? this.rollPrimaryDoc.rollPrimaryName;
            this.rollPrimaryType = this.rollPrimaryDoc.rollPrimaryType;
            this.rollPrimaryImg = rollPrimaryImg ?? this.rollPrimaryDoc.rollPrimaryImg ?? "";
            this._rollModsData = rollModsData ?? [];
            this.rollFactors = {
                ...this.rollPrimaryDoc.rollFactors,
                ...rollFactors ?? {}
            };
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
            /*~ @@DOUBLE-BLANK@@ ~*/
            this.rollPrimaryName = rollPrimaryName;
            this.rollPrimaryType = rollPrimaryType;
            this.rollPrimaryImg = rollPrimaryImg;
            this._rollModsData = rollModsData ?? [];
            this.rollFactors = rollFactors;
        }
    }
}
/*~ @@DOUBLE-BLANK@@ ~*/
class BladesRollOpposition {
    /*~ @@DOUBLE-BLANK@@ ~*/
    // #region Static Methods ~
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
            && (!data.rollOppID || typeof data.rollOppID === "string");
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    static GetDoc(docRef) {
        let doc = docRef;
        if (typeof docRef === "string") {
            doc = game.actors.get(docRef)
                ?? game.items.get(docRef)
                ?? game.actors.getName(docRef)
                ?? game.items.getName(docRef);
        }
        if (BladesRollOpposition.IsDoc(doc)) {
            return doc;
        }
        return false;
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    static IsDoc(doc) {
        return BladesActor.IsType(doc, BladesActorType.npc, BladesActorType.faction)
            || BladesItem.IsType(doc, ...[
                BladesItemType.cohort_expert,
                BladesItemType.cohort_gang,
                BladesItemType.gm_tracker,
                BladesItemType.project,
                BladesItemType.design,
                BladesItemType.ritual
            ]);
    }
    // #endregion
    /*~ @@DOUBLE-BLANK@@ ~*/
    rollInstance;
    /*~ @@DOUBLE-BLANK@@ ~*/
    _rollOppID;
    /*~ @@DOUBLE-BLANK@@ ~*/
    get rollOppID() { return this._rollOppID; }
    /*~ @@DOUBLE-BLANK@@ ~*/
    set rollOppID(val) {
        if (val) {
            const doc = BladesRollOpposition.GetDoc(val);
            if (doc) {
                this.rollOppDoc = doc;
            }
        }
        this._rollOppID = val;
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    rollOppDoc;
    /*~ @@DOUBLE-BLANK@@ ~*/
    rollOppName;
    /*~ @@DOUBLE-BLANK@@ ~*/
    rollOppSubName;
    /*~ @@DOUBLE-BLANK@@ ~*/
    rollOppType;
    /*~ @@DOUBLE-BLANK@@ ~*/
    rollOppImg;
    /*~ @@DOUBLE-BLANK@@ ~*/
    rollOppModsData;
    /*~ @@DOUBLE-BLANK@@ ~*/
    rollFactors;
    /*~ @@DOUBLE-BLANK@@ ~*/
    // #region Constructor ~
    constructor(rollInstance, { rollOppID, rollOppDoc, rollOppName, rollOppSubName, rollOppType, rollOppImg, rollOppModsData, rollFactors } = {}) {
        /*~ @@DOUBLE-BLANK@@ ~*/
        this.rollInstance = rollInstance;
        /*~ @@DOUBLE-BLANK@@ ~*/
        // Attempt to fetch an associated BladesActor or BladesItem document
        const doc = BladesRollOpposition.GetDoc(rollOppDoc ?? rollOppID ?? rollOppName);
        /*~ @@DOUBLE-BLANK@@ ~*/
        if (doc) {
            // Derive settings from valid Actor/Item document, unless explicitly set in constructor.
            rollOppID = doc.rollOppID;
            rollOppDoc = doc;
            rollOppName ??= doc.rollOppName;
            rollOppSubName ??= doc.rollOppSubName;
            rollOppType ??= doc.rollOppType;
            rollOppImg ??= doc.rollOppImg;
            rollOppModsData = [
                ...rollOppModsData ?? [],
                ...doc.rollOppModsData ?? []
            ];
            rollFactors = {
                ...doc.rollFactors,
                ...rollFactors ?? {}
            };
        }
        /*~ @@DOUBLE-BLANK@@ ~*/
        // Confirm required settings
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
        /*~ @@DOUBLE-BLANK@@ ~*/
        // Initialize properties
        this.rollOppID = rollOppID;
        this.rollOppName = rollOppName;
        this.rollOppSubName = rollOppSubName;
        this.rollOppType = rollOppType;
        this.rollOppImg = rollOppImg ?? "";
        this.rollOppModsData = rollOppModsData ?? [];
        this.rollFactors = rollFactors;
    }
    // #endregion
    /*~ @@DOUBLE-BLANK@@ ~*/
    get flagParams() {
        return [C.SYSTEM_ID, "rollCollab.rollOppData"];
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    get flagData() {
        return {
            rollOppID: this.rollOppID,
            rollOppName: this.rollOppName,
            rollOppSubName: this.rollOppSubName,
            rollOppType: this.rollOppType,
            rollOppImg: this.rollOppImg,
            /*~ @@DOUBLE-BLANK@@ ~*/
            rollOppModsData: this.rollOppModsData,
            rollFactors: this.rollFactors
        };
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    async updateRollFlags() {
        await this.rollInstance.document.setFlag(...this.flagParams, this.flagData);
        socketlib.system.executeForEveryone("renderRollCollab", this.rollInstance.rollID);
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    refresh() {
        const rollOppFlags = this.rollInstance.flagData.rollOppData;
        if (rollOppFlags) {
            this.rollOppID = rollOppFlags.rollOppID;
            this.rollOppName = rollOppFlags.rollOppName;
            this.rollOppSubName = rollOppFlags.rollOppSubName;
            this.rollOppType = rollOppFlags.rollOppType;
            this.rollOppImg = rollOppFlags.rollOppImg;
            /*~ @@DOUBLE-BLANK@@ ~*/
            this.rollOppModsData = rollOppFlags.rollOppModsData;
            this.rollFactors = rollOppFlags.rollFactors;
        }
        return this;
    }
}
/*~ @@DOUBLE-BLANK@@ ~*/
class BladesRollParticipant {
    /*~ @@DOUBLE-BLANK@@ ~*/
    // #region Static Methods ~
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
    /*~ @@DOUBLE-BLANK@@ ~*/
    static GetDoc(docRef) {
        let doc = docRef;
        if (typeof docRef === "string") {
            doc = game.actors.get(docRef)
                ?? game.items.get(docRef)
                ?? game.actors.getName(docRef)
                ?? game.items.getName(docRef);
        }
        if (BladesRollParticipant.IsDoc(doc)) {
            return doc;
        }
        return false;
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    static IsDoc(doc) {
        return BladesActor.IsType(doc, BladesActorType.pc, BladesActorType.crew, BladesActorType.npc)
            || BladesItem.IsType(doc, BladesItemType.cohort_expert, BladesItemType.cohort_gang, BladesItemType.gm_tracker);
    }
    // #endregion
    /*~ @@DOUBLE-BLANK@@ ~*/
    rollInstance;
    /*~ @@DOUBLE-BLANK@@ ~*/
    _rollParticipantID;
    /*~ @@DOUBLE-BLANK@@ ~*/
    get rollParticipantID() { return this._rollParticipantID; }
    /*~ @@DOUBLE-BLANK@@ ~*/
    set rollParticipantID(val) {
        if (val) {
            const doc = BladesRollParticipant.GetDoc(val);
            if (doc) {
                this.rollParticipantDoc = doc;
            }
        }
        this._rollParticipantID = val;
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    rollParticipantDoc;
    /*~ @@DOUBLE-BLANK@@ ~*/
    rollParticipantName;
    /*~ @@DOUBLE-BLANK@@ ~*/
    rollParticipantType;
    /*~ @@DOUBLE-BLANK@@ ~*/
    rollParticipantIcon;
    /*~ @@DOUBLE-BLANK@@ ~*/
    rollParticipantSection;
    /*~ @@DOUBLE-BLANK@@ ~*/
    rollParticipantSubSection;
    /*~ @@DOUBLE-BLANK@@ ~*/
    rollParticipantModsData; // As applied to MAIN roll when this participant involved
    /*~ @@DOUBLE-BLANK@@ ~*/
    rollFactors;
    /*~ @@DOUBLE-BLANK@@ ~*/
    // #region Constructor ~
    constructor(rollInstance, { rollParticipantSection, rollParticipantSubSection, rollParticipantID, rollParticipantDoc, rollParticipantName, rollParticipantType, rollParticipantIcon, rollParticipantModsData, rollFactors }) {
        /*~ @@DOUBLE-BLANK@@ ~*/
        this.rollInstance = rollInstance;
        /*~ @@DOUBLE-BLANK@@ ~*/
        if (!rollParticipantSection) {
            throw new Error("Must include a rollParticipantSection when constructing a BladesRollParticipant object.");
        }
        if (!rollParticipantSubSection) {
            throw new Error("Must include a rollParticipantSubSection when constructing a BladesRollParticipant object.");
        }
        this.rollParticipantSection = rollParticipantSection;
        this.rollParticipantSubSection = rollParticipantSubSection;
        /*~ @@DOUBLE-BLANK@@ ~*/
        // Attempt to fetch an associated BladesActor or BladesItem document
        const doc = BladesRollParticipant.GetDoc(rollParticipantDoc ?? rollParticipantID ?? rollParticipantName);
        /*~ @@DOUBLE-BLANK@@ ~*/
        if (doc) {
            // Derive settings from valid Actor/Item document, unless explicitly set in constructor.
            rollParticipantID = doc.rollParticipantID;
            rollParticipantDoc = doc;
            rollParticipantName ??= doc.rollParticipantName;
            rollParticipantType ??= doc.rollParticipantType;
            rollParticipantIcon ??= doc.rollParticipantIcon;
            rollParticipantModsData = [
                ...rollParticipantModsData ?? [],
                ...doc.rollParticipantModsData ?? []
            ];
            rollFactors = {
                ...doc.rollFactors,
                ...rollFactors ?? {}
            };
        }
        /*~ @@DOUBLE-BLANK@@ ~*/
        // Confirm required settings
        if (!rollParticipantName) {
            throw new Error("Must include a rollParticipantName when constructing a BladesRollParticipant object.");
        }
        if (!rollParticipantType) {
            throw new Error("Must include a rollParticipantType when constructing a BladesRollParticipant object.");
        }
        if (!rollFactors) {
            throw new Error("Must include a rollFactors when constructing a BladesRollParticipant object.");
        }
        /*~ @@DOUBLE-BLANK@@ ~*/
        // Initialize properties
        this.rollParticipantID = rollParticipantID;
        this.rollParticipantName = rollParticipantName;
        this.rollParticipantType = rollParticipantType;
        this.rollParticipantIcon = rollParticipantIcon ?? "";
        this.rollParticipantModsData = rollParticipantModsData ?? [];
        this.rollFactors = rollFactors;
    }
    // #endregion
    /*~ @@DOUBLE-BLANK@@ ~*/
    get flagParams() {
        return [C.SYSTEM_ID, `rollCollab.rollParticipantData.${this.rollParticipantSection}.${this.rollParticipantSubSection}`];
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    get flagData() {
        return {
            rollParticipantSection: this.rollParticipantSection,
            rollParticipantSubSection: this.rollParticipantSubSection,
            /*~ @@DOUBLE-BLANK@@ ~*/
            rollParticipantID: this.rollParticipantID,
            rollParticipantName: this.rollParticipantName,
            rollParticipantType: this.rollParticipantType,
            rollParticipantIcon: this.rollParticipantIcon,
            /*~ @@DOUBLE-BLANK@@ ~*/
            rollParticipantModsData: this.rollParticipantModsData,
            rollFactors: this.rollFactors
        };
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    async updateRollFlags() {
        await this.rollInstance.document.setFlag(...this.flagParams, this.flagData);
        socketlib.system.executeForEveryone("renderRollCollab", this.rollInstance.rollID);
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    refresh() {
        const rollParticipantFlagData = this.rollInstance.flagData.rollParticipantData?.[this.rollParticipantSection];
        if (rollParticipantFlagData) {
            const rollParticipantFlags = rollParticipantFlagData[this.rollParticipantSubSection];
            if (rollParticipantFlags) {
                this.rollParticipantID = rollParticipantFlags.rollParticipantID;
                /*~ @@DOUBLE-BLANK@@ ~*/
                this.rollParticipantName = rollParticipantFlags.rollParticipantName;
                this.rollParticipantType = rollParticipantFlags.rollParticipantType;
                this.rollParticipantIcon = rollParticipantFlags.rollParticipantIcon;
                this.rollParticipantSection = rollParticipantFlags.rollParticipantSection;
                this.rollParticipantSubSection = rollParticipantFlags.rollParticipantSubSection;
                /*~ @@DOUBLE-BLANK@@ ~*/
                this.rollParticipantModsData = rollParticipantFlags.rollParticipantModsData;
                this.rollFactors = rollParticipantFlags.rollFactors;
            }
        }
        return this;
    }
}
/*~ @@DOUBLE-BLANK@@ ~*/
class BladesRoll extends DocumentSheet {
    /*~ @@DOUBLE-BLANK@@ ~*/
    // #region STATIC METHODS: INITIALIZATION & DEFAULTS ~
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            classes: ["eunos-blades", "sheet", "roll-collab", game.user.isGM ? "gm-roll-collab" : ""],
            template: `systems/eunos-blades/templates/roll/roll-collab${game.user.isGM ? "-gm" : ""}.hbs`,
            submitOnChange: true,
            width: 500,
            dragDrop: [
                { dragSelector: null, dropSelector: "[data-action='gm-drop-opposition'" }
            ]
            // Height: 500
        });
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
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
    /*~ @@DOUBLE-BLANK@@ ~*/
    static InitSockets() {
        socketlib.system.register("constructRollCollab", BladesRoll.ConstructRollCollab);
        socketlib.system.register("renderRollCollab", BladesRoll.RenderRollCollab);
        socketlib.system.register("closeRollCollab", BladesRoll.CloseRollCollab);
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    static get DefaultRollMods() {
        return [
            {
                id: "Push-positive-roll",
                name: "PUSH",
                section: RollModSection.roll,
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
                section: RollModSection.roll,
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
                section: RollModSection.roll,
                base_status: RollModStatus.Hidden,
                posNeg: "positive",
                modType: "teamwork",
                value: 1,
                tooltip: "<h1 class='gold-bright'>%DOC_NAME% Assists</h1><p><strong class='gold-bright'>%DOC_NAME%</strong> is <strong>Assisting</strong> your efforts, adding <strong class='gold-bright'>1 die</strong> to your pool.</p>"
            },
            {
                id: "Setup-positive-position",
                name: "Setup",
                section: RollModSection.position,
                base_status: RollModStatus.Hidden,
                posNeg: "positive",
                modType: "teamwork",
                value: 1,
                tooltip: "<h1 class='gold-bright'>%DOC_NAME% Sets You Up</h1><p><strong class='gold-bright'>%DOC_NAME%</strong> has set you up for success with a preceding <strong>Setup</strong> action, increasing your <strong class='gold-bright'>Position</strong> by one level.</p>"
            },
            {
                id: "Push-positive-effect",
                name: "PUSH",
                section: RollModSection.effect,
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
                section: RollModSection.effect,
                base_status: RollModStatus.Hidden,
                posNeg: "positive",
                modType: "teamwork",
                value: 1,
                tooltip: "<h1 class='gold-bright'>%DOC_NAME% Sets You Up</h1><p><strong class='gold-bright'>%DOC_NAME%</strong> has set you up for success with a preceding <strong>Setup</strong> action, increasing your <strong class='gold-bright'>Effect</strong> by one level.</p>"
            },
            {
                id: "Potency-positive-effect",
                name: "Potency",
                section: RollModSection.effect,
                base_status: RollModStatus.Hidden,
                posNeg: "positive",
                modType: "general",
                value: 1,
                tooltip: "<h1>Potency</h1><p>By circumstance or advantage, you have <strong>Potency</strong> in this action, increasing your <strong class='gold-bright'>Effect</strong> by one level.</p>"
            },
            {
                id: "Potency-negative-effect",
                name: "Potency",
                section: RollModSection.effect,
                base_status: RollModStatus.Hidden,
                posNeg: "negative",
                modType: "general",
                value: 1,
                tooltip: "<h1 class='red-bright'>Potency</h1><p>By circumstance or advantage, <strong class='red-bright'>@OPPOSITION_NAME@</strong> has <strong>Potency</strong> against you, reducing your <strong class='red-bright'>Effect</strong> by one level."
            }
        ];
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    static get DefaultFlagData() {
        return {
            rollModsData: {},
            rollPositionInitial: Position.risky,
            rollEffectInitial: Effect.standard,
            rollPosEffectTrade: false,
            rollPhase: RollPhase.Collaboration,
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
    // #endregion
    /*~ @@DOUBLE-BLANK@@ ~*/
    // #region STATIC METHODS: New Roll Creation ~
    static Current = {};
    /*~ @@DOUBLE-BLANK@@ ~*/
    static _Active;
    /*~ @@DOUBLE-BLANK@@ ~*/
    static get Active() {
        if (BladesRoll._Active) {
            return BladesRoll._Active;
        }
        if (U.objSize(BladesRoll.Current) > 0) {
            return U.getLast(Object.values(BladesRoll.Current));
        }
        return undefined;
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    static set Active(val) {
        BladesRoll._Active = val;
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    static async ConstructRollCollab({ userID, rollID, rollPermission }) {
        const rollInst = new BladesRoll(userID, rollID, rollPermission);
        eLog.checkLog3("rollCollab", "ConstructRollCollab()", { params: { userID, rollID, rollPermission }, rollInst });
        await rollInst._render(true);
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    static RenderRollCollab(rollID) {
        BladesRoll.Current[rollID]?.prepareRollParticipantData();
        BladesRoll.Current[rollID]?.render();
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    static async CloseRollCollab(rollID) {
        eLog.checkLog3("rollCollab", "CloseRollCollab()", { rollID });
        await BladesRoll.Current[rollID]?.close({ rollID });
        delete BladesRoll.Current[rollID];
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    static GetUserPermissions(config) {
        /*~ @@DOUBLE-BLANK@@ ~*/
        // === ONE === GET USER IDS
        /*~ @@DOUBLE-BLANK@@ ~*/
        // Get user ID of GM
        const GMUserID = game.users.find((user) => user.isGM)?.id;
        if (!GMUserID) {
            throw new Error("[BladesRoll.GetUserPermissions()] No GM found!");
        }
        /*~ @@DOUBLE-BLANK@@ ~*/
        // Get user IDs of players
        const playerUserIDs = game.users
            .filter((user) => BladesPC.IsType(user.character) && !user.isGM && typeof user.id === "string")
            .map((user) => user.id);
        /*~ @@DOUBLE-BLANK@@ ~*/
        // Prepare user ID permissions object
        const userIDs = {
            [RollPermissions.GM]: [GMUserID],
            [RollPermissions.Primary]: [],
            [RollPermissions.Participant]: [],
            [RollPermissions.Observer]: []
        };
        /*~ @@DOUBLE-BLANK@@ ~*/
        // === TWO === DETERMINE PRIMARY USER(S)
        /*~ @@DOUBLE-BLANK@@ ~*/
        // Check RollPrimaryDoc to determine how to assign primary users
        const { rollPrimaryDoc } = config.rollPrimaryData;
        if (BladesPC.IsType(rollPrimaryDoc)
            && U.pullElement(playerUserIDs, rollPrimaryDoc.primaryUser?.id)) {
            userIDs[RollPermissions.Primary].push(rollPrimaryDoc.primaryUser?.id);
            /*~ @@DOUBLE-BLANK@@ ~*/
        }
        else if (BladesCrew.IsType(rollPrimaryDoc)) {
            userIDs[RollPermissions.Primary].push(...playerUserIDs);
        }
        else if (BladesItem.IsType(rollPrimaryDoc, BladesItemType.cohort_gang, BladesItemType.cohort_expert)) {
            if (config.rollUserID === GMUserID) {
                userIDs[RollPermissions.Primary].push(...playerUserIDs);
            }
            else {
                userIDs[RollPermissions.Primary].push(config.rollUserID);
            }
        }
        else if (BladesGMTracker.IsType(rollPrimaryDoc)) {
            userIDs[RollPermissions.Primary].push(GMUserID);
        }
        /*~ @@DOUBLE-BLANK@@ ~*/
        // === THREE === DETERMINE ROLL PARTICIPANT USER(S)
        /*~ @@DOUBLE-BLANK@@ ~*/
        // Check config.rollParticipantData to determine if roll starts with any participants
        if (config.rollParticipantData) {
            userIDs[RollPermissions.Participant].push(...getParticipantDocUserIDs(config.rollParticipantData, playerUserIDs));
        }
        /*~ @@DOUBLE-BLANK@@ ~*/
        // Finally, add remaining players as observers.
        userIDs[RollPermissions.Observer] = playerUserIDs
            .filter((uID) => !userIDs[RollPermissions.Participant].includes(uID));
        /*~ @@DOUBLE-BLANK@@ ~*/
        return userIDs;
        /*~ @@DOUBLE-BLANK@@ ~*/
        /**
         * Generates BladesRollParticipant documents from the provided schema data.
         * @param {BladesRoll.RollParticipantData} participantData
         */
        function getParticipantDocs(participantData) {
            return Object.values(flattenObject(participantData))
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
            });
        }
        /*~ @@DOUBLE-BLANK@@ ~*/
        /**
         * Returns the user ids of potential BladesRollParticipants defined in the provided data schema.
         * @param {BladesRoll.RollParticipantData} participantData
         * @param {string[]} unassignedIDs
         */
        function getParticipantDocUserIDs(participantData, unassignedIDs) {
            return getParticipantDocs(participantData)
                .map((pDoc) => {
                if (BladesPC.IsType(pDoc) && typeof pDoc.primaryUser?.id === "string") {
                    return pDoc.primaryUser.id;
                }
                else if (BladesCrew.IsType(pDoc)
                    || BladesItem.IsType(pDoc, BladesItemType.cohort_gang, BladesItemType.cohort_expert)) {
                    return unassignedIDs;
                }
                return null;
            })
                .flat()
                .filter((pUser) => pUser !== null && !userIDs[RollPermissions.Primary].includes(pUser));
        }
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    static async PrepareActionRoll(rollID, config) {
        /*~ @@DOUBLE-BLANK@@ ~*/
        // Validate the rollTrait
        if (!(U.isInt(config.rollTrait) || U.lCase(config.rollTrait) in { ...ActionTrait, ...Factor })) {
            throw new Error(`[PrepareActionRoll()] Bad RollTrait for Action Roll: ${config.rollTrait}`);
        }
        /*~ @@DOUBLE-BLANK@@ ~*/
        // Retrieve the roll users
        const userIDs = BladesRoll.GetUserPermissions(config);
        /*~ @@DOUBLE-BLANK@@ ~*/
        // Prepare roll user flag data
        const userFlagData = {};
        Object.entries(userIDs)
            .forEach(([rollPermission, idsArray]) => {
            for (const id of idsArray) {
                userFlagData[id] = rollPermission;
            }
        });
        /*~ @@DOUBLE-BLANK@@ ~*/
        // Prepare the flag data.
        const flagUpdateData = {
            ...BladesRoll.DefaultFlagData,
            ...pruneConfig(config),
            userPermissions: userFlagData,
            rollID
        };
        /*~ @@DOUBLE-BLANK@@ ~*/
        // Return flagData and roll users
        return {
            flagUpdateData,
            userIDs
        };
        /*~ @@DOUBLE-BLANK@@ ~*/
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    static async PrepareResistanceRoll(rollID, config) {
        /*~ @@DOUBLE-BLANK@@ ~*/
        // Validate consequenceData
        if (!config.resistanceData || !isValidConsequenceData(config.resistanceData?.consequence)) {
            eLog.error("rollCollab", "[PrepareResistanceRoll] Bad Roll Consequence Data.", config);
            throw new Error("[PrepareResistanceRoll()] Bad Consequence Data for Resistance Roll");
        }
        /*~ @@DOUBLE-BLANK@@ ~*/
        // Set rollTrait
        config.rollTrait = config.resistanceData.consequence.attribute;
        /*~ @@DOUBLE-BLANK@@ ~*/
        // Retrieve the roll users
        const userIDs = BladesRoll.GetUserPermissions(config);
        /*~ @@DOUBLE-BLANK@@ ~*/
        // Prepare roll user flag data
        const userFlagData = {};
        Object.entries(userIDs)
            .forEach(([rollPermission, idsArray]) => {
            for (const id of idsArray) {
                userFlagData[id] = rollPermission;
            }
        });
        /*~ @@DOUBLE-BLANK@@ ~*/
        // Prepare the flag data.
        const flagUpdateData = {
            ...BladesRoll.DefaultFlagData,
            ...pruneConfig(config),
            userPermissions: userFlagData,
            rollID
        };
        /*~ @@DOUBLE-BLANK@@ ~*/
        // Return flagData and roll users
        return {
            flagUpdateData,
            userIDs
        };
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    static async PrepareFortuneRoll(rollID, config) {
        /*~ @@DOUBLE-BLANK@@ ~*/
        // Validate the rollTrait
        if (!(U.isInt(config.rollTrait) || U.lCase(config.rollTrait) in { ...ActionTrait, ...AttributeTrait, ...Factor })) {
            throw new Error(`[PrepareFortuneRoll()] Bad RollTrait for Fortune Roll: ${config.rollTrait}`);
        }
        /*~ @@DOUBLE-BLANK@@ ~*/
        // Retrieve the roll users
        const userIDs = BladesRoll.GetUserPermissions(config);
        /*~ @@DOUBLE-BLANK@@ ~*/
        // Prepare roll user flag data
        const userFlagData = {};
        Object.entries(userIDs)
            .forEach(([rollPermission, idsArray]) => {
            for (const id of idsArray) {
                userFlagData[id] = rollPermission;
            }
        });
        /*~ @@DOUBLE-BLANK@@ ~*/
        // Prepare the flag data.
        const flagUpdateData = {
            ...BladesRoll.DefaultFlagData,
            ...pruneConfig(config),
            userPermissions: userFlagData,
            rollID
        };
        /*~ @@DOUBLE-BLANK@@ ~*/
        // Return flagData and roll users
        return {
            flagUpdateData,
            userIDs
        };
        /*~ @@DOUBLE-BLANK@@ ~*/
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    static async PrepareIndulgeViceRoll(rollID, config) {
        /*~ @@DOUBLE-BLANK@@ ~*/
        // If primary doc is given, derive rollTrait from that (i.e. lowest Attribute)
        const { rollPrimaryDoc } = config.rollPrimaryData;
        if (BladesPC.IsType(rollPrimaryDoc)) {
            const minAttrVal = Math.min(...Object.values(rollPrimaryDoc.attributes));
            config.rollTrait = U.sample(Object.values(AttributeTrait).filter((attr) => rollPrimaryDoc.attributes[attr] === minAttrVal))[0];
        }
        if (!(U.isInt(config.rollTrait) || U.lCase(config.rollTrait) in AttributeTrait)) {
            throw new Error(`[PrepareIndulgeViceRoll()] Bad RollTrait for Indulge Vice Roll: ${config.rollTrait}`);
        }
        /*~ @@DOUBLE-BLANK@@ ~*/
        // Set other known config values
        config.rollDowntimeAction = DowntimeAction.IndulgeVice;
        /*~ @@DOUBLE-BLANK@@ ~*/
        // Retrieve the roll users
        const userIDs = BladesRoll.GetUserPermissions(config);
        /*~ @@DOUBLE-BLANK@@ ~*/
        // Prepare roll user flag data
        const userFlagData = {};
        Object.entries(userIDs)
            .forEach(([rollPermission, idsArray]) => {
            for (const id of idsArray) {
                userFlagData[id] = rollPermission;
            }
        });
        /*~ @@DOUBLE-BLANK@@ ~*/
        // Prepare the flag data.
        const flagUpdateData = {
            ...BladesRoll.DefaultFlagData,
            ...pruneConfig(config),
            userPermissions: userFlagData,
            rollID
        };
        /*~ @@DOUBLE-BLANK@@ ~*/
        // Return flagData and roll users
        return {
            flagUpdateData,
            userIDs
        };
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    /**
     * This static method accepts a partial version of the config options required
     * to build a BladesRoll instance, sets the requisite flags on the storage
     * document, then sends out a socket call to the relevant users to construct
     * and display the roll instance.
     *
     * @param {BladesRoll.ConstructorConfig} config The configuration object for the new roll.
     */
    static async NewRoll(config) {
        // If no rollType is provided, throw an error.
        if (!isRollType(config.rollType)) {
            throw new Error("[BladesRoll.NewRoll()] You must provide a valid rollType in the config object.");
        }
        /*~ @@DOUBLE-BLANK@@ ~*/
        // Get User document to serve as flag storage.
        const rollUser = game.users.get(config.rollUserID ?? game.user.id ?? "");
        if (!rollUser?.id) {
            throw new Error("[BladesRoll.NewRoll()] You must provide a valid rollUserID in the config object.");
        }
        /*~ @@DOUBLE-BLANK@@ ~*/
        // If roll flag data is already on user, throw an error.
        const flagData = rollUser.getFlag("eunos-blades", "rollCollab");
        if (flagData) {
            const { rollID } = flagData;
            if (BladesRoll.Current[rollID]) {
                throw new Error(`[BladesRoll.NewRoll()] User ${rollUser.name} already documenting live roll with ID '${rollID}'`);
            }
            await rollUser.setFlag("eunos-blades", `rollCollabArchive.${rollID}`, flagData);
            await rollUser.unsetFlag("eunos-blades", "rollCollab");
        }
        /*~ @@DOUBLE-BLANK@@ ~*/
        // If no rollPrimaryData is provided, attempt to derive it from the rest of the config object
        let { rollPrimaryData } = config;
        if (!BladesRollPrimary.IsValidData(rollPrimaryData)) {
            let rollPrimarySourceData;
            // If the user is a player with a BladesPC character, assume that is rollPrimary.
            if (BladesPC.IsType(rollUser.character)) {
                rollPrimarySourceData = rollUser.character;
                rollPrimaryData = {
                    rollPrimaryID: rollPrimarySourceData.rollPrimaryID,
                    rollPrimaryName: rollPrimarySourceData.rollPrimaryName,
                    rollPrimaryType: rollPrimarySourceData.rollPrimaryType,
                    rollPrimaryImg: rollPrimarySourceData.rollPrimaryImg,
                    rollModsData: rollPrimarySourceData.rollModsData,
                    rollFactors: rollPrimarySourceData.rollFactors
                };
            }
        }
        if (!BladesRollPrimary.IsValidData(rollPrimaryData)) {
            throw new Error("[BladesRoll.NewRoll()] A valid source of PrimaryDocData must be provided to construct a roll.");
        }
        /*~ @@DOUBLE-BLANK@@ ~*/
        // Create a random ID for storing the roll instance
        const rID = randomID();
        /*~ @@DOUBLE-BLANK@@ ~*/
        // Derive user flag data depending on given roll type and subtype
        let userIDs;
        let flagUpdateData;
        /*~ @@DOUBLE-BLANK@@ ~*/
        switch (config.rollType) {
            case RollType.Action: {
                ({ userIDs, flagUpdateData } = await BladesRoll.PrepareActionRoll(rID, {
                    ...config,
                    rollUserID: rollUser.id,
                    rollPrimaryData
                }));
                break;
            }
            case RollType.Resistance: {
                ({ userIDs, flagUpdateData } = await BladesRoll.PrepareResistanceRoll(rID, {
                    ...config,
                    rollUserID: rollUser.id,
                    rollPrimaryData
                }));
                break;
            }
            case RollType.Fortune: {
                ({ userIDs, flagUpdateData } = await BladesRoll.PrepareFortuneRoll(rID, {
                    ...config,
                    rollUserID: rollUser.id,
                    rollPrimaryData
                }));
                break;
            }
            case RollType.IndulgeVice: {
                ({ userIDs, flagUpdateData } = await BladesRoll.PrepareIndulgeViceRoll(rID, {
                    ...config,
                    rollUserID: rollUser.id,
                    rollPrimaryData
                }));
                break;
            }
        }
        /*~ @@DOUBLE-BLANK@@ ~*/
        // Log the roll data
        eLog.checkLog3("bladesRoll", "BladesRoll.NewRoll()", { userIDs, flagUpdateData, rollPrimaryData: flagUpdateData.rollPrimaryData });
        /*~ @@DOUBLE-BLANK@@ ~*/
        // Store the roll data on the storage document
        await rollUser.setFlag(C.SYSTEM_ID, "rollCollab", flagUpdateData);
        /*~ @@DOUBLE-BLANK@@ ~*/
        // Send out socket calls to all users to see the roll.
        socketlib.system.executeForUsers("constructRollCollab", userIDs[RollPermissions.GM], { userID: rollUser.id, rollID: rID, rollPermission: RollPermissions.GM });
        socketlib.system.executeForUsers("constructRollCollab", userIDs[RollPermissions.Primary], { userID: rollUser.id, rollID: rID, rollPermission: RollPermissions.Primary });
        socketlib.system.executeForUsers("constructRollCollab", userIDs[RollPermissions.Observer], { userID: rollUser.id, rollID: rID, rollPermission: RollPermissions.Observer });
        socketlib.system.executeForUsers("constructRollCollab", userIDs[RollPermissions.Participant], { userID: rollUser.id, rollID: rID, rollPermission: RollPermissions.Participant });
    }
    // #endregion
    /*~ @@DOUBLE-BLANK@@ ~*/
    // #region Constructor ~
    rollID;
    /*~ @@DOUBLE-BLANK@@ ~*/
    rollPermission;
    /*~ @@DOUBLE-BLANK@@ ~*/
    _rollPrimary;
    /*~ @@DOUBLE-BLANK@@ ~*/
    _rollOpposition;
    /*~ @@DOUBLE-BLANK@@ ~*/
    _rollParticipants;
    /*~ @@DOUBLE-BLANK@@ ~*/
    constructor(userID, rollID, rollPermission) {
        const rollUser = game.users.get(userID);
        if (!rollUser) {
            throw new Error("[new BladesRoll()] Must provide a valid rollUser to roll.");
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
                if ([RollModSection.roll, RollModSection.position, RollModSection.effect]
                    .includes(rollSection) && !U.isEmpty(rollParticipantList)) {
                    const sectionParticipants = {};
                    for (const [participantType, participantData] of Object.entries(rollParticipantList)) {
                        sectionParticipants[participantType] = new BladesRollParticipant(this, participantData);
                    }
                    this._rollParticipants[rollSection] = sectionParticipants;
                }
            }
        }
        BladesRoll.Current[this.rollID] = this;
    }
    // #endregion
    /*~ @@DOUBLE-BLANK@@ ~*/
    async setRollSubType(subType) {
        await this.setFlagVal("rollSubType", subType);
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    async addRollParticipant(participantRef, rollSection, rollSubSection) {
        /*~ @@DOUBLE-BLANK@@ ~*/
        if (!rollSubSection) {
            /* Insert logic to determine from rollSection and number of existing Group_X members */
            rollSubSection = "Assist";
        }
        /*~ @@DOUBLE-BLANK@@ ~*/
        const participantData = typeof participantRef === "string"
            ? game.actors.get(participantRef)
                ?? game.actors.getName(participantRef)
                ?? game.items.get(participantRef)
                ?? game.items.getName(participantRef)
            : participantRef;
        if (!BladesRollParticipant.IsValidData(participantData)) {
            throw new Error("Bad data.");
        }
        const rollParticipant = new BladesRollParticipant(this, {
            rollParticipantSection: rollSection,
            rollParticipantSubSection: rollSubSection,
            rollParticipantID: participantData.rollParticipantID
        });
        /*~ @@DOUBLE-BLANK@@ ~*/
        await rollParticipant.updateRollFlags();
        socketlib.system.executeForEveryone("renderRollCollab", this.rollID);
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    async removeRollParticipant(rollSection, rollSubSection) {
        await this.clearFlagVal(`rollParticipantData.${rollSection}.${rollSubSection}`);
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    async updateUserPermission(_user, _permission) {
        /* Force-render roll with new permissions */
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    // #region Basic User Flag Getters/Setters ~
    get flagData() {
        if (!this.document.getFlag(C.SYSTEM_ID, "rollCollab")) {
            throw new Error("[get flags()] No RollCollab Flags Found on User Document");
        }
        return this.document.getFlag(C.SYSTEM_ID, "rollCollab");
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    get rollPrimary() {
        return this._rollPrimary;
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    get rollPrimaryDoc() {
        if (BladesRollPrimary.IsDoc(this.rollPrimary.rollPrimaryDoc)) {
            return this.rollPrimary.rollPrimaryDoc;
        }
        if (BladesRollPrimary.IsDoc(this.rollPrimary)) {
            return this.rollPrimary;
        }
        return undefined;
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    get rollOpposition() {
        if (!this._rollOpposition && BladesRollOpposition.IsValidData(this.flagData.rollOppData)) {
            this._rollOpposition = new BladesRollOpposition(this, this.flagData.rollOppData);
        }
        return this._rollOpposition?.refresh();
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    set rollOpposition(val) {
        if (val === undefined) {
            this._rollOpposition = undefined;
        }
        else {
            this._rollOpposition = val;
            val.updateRollFlags();
        }
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    /**
     * This method prepares the roll participant data.
     * It iterates over the roll sections (roll, position, effect) and for each section,
     * it creates a new BladesRollParticipant instance for each participant in that section.
     * The created instances are stored in the rollParticipants object.
     */
    prepareRollParticipantData() {
        const participantFlagData = this.flagData.rollParticipantData;
        if (!participantFlagData) {
            return;
        }
        /*~ @@DOUBLE-BLANK@@ ~*/
        const rollParticipants = {};
        /*~ @@DOUBLE-BLANK@@ ~*/
        [
            RollModSection.roll,
            RollModSection.position,
            RollModSection.effect
        ].forEach((rollSection) => {
            const sectionFlagData = participantFlagData[rollSection];
            if (sectionFlagData) {
                const sectionParticipants = {};
                Object.entries(sectionFlagData).forEach(([subSection, subSectionFlagData]) => {
                    if (subSectionFlagData) {
                        sectionParticipants[subSection] =
                            new BladesRollParticipant(this, {
                                ...subSectionFlagData,
                                rollParticipantSection: rollSection,
                                rollParticipantSubSection: subSection
                            });
                    }
                });
                rollParticipants[rollSection] = sectionParticipants;
            }
        });
        /*~ @@DOUBLE-BLANK@@ ~*/
        this._rollParticipants = rollParticipants;
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    get rollParticipants() {
        return this._rollParticipants;
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    getRollParticipant(section, subSection) {
        if (isParticipantSection(section) && isParticipantSubSection(subSection)) {
            const sectionData = this.rollParticipants?.[section];
            if (sectionData) {
                return sectionData[subSection] ?? null;
            }
        }
        return null;
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    get rollParticipantSelectOptions() {
        const nonPrimaryPCs = BladesPC.All
            .filter((actor) => actor.hasTag(Tag.PC.ActivePC) && actor.id !== this.rollPrimary.rollPrimaryID)
            .map((actor) => ({ value: actor.id, display: actor.name }));
        return {
            Assist: nonPrimaryPCs,
            Setup: nonPrimaryPCs,
            Group: nonPrimaryPCs
        };
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    get rollType() { return this.flagData.rollType; }
    /*~ @@DOUBLE-BLANK@@ ~*/
    get rollSubType() { return this.flagData.rollSubType; }
    /*~ @@DOUBLE-BLANK@@ ~*/
    get rollDowntimeAction() { return this.flagData.rollDowntimeAction; }
    /*~ @@DOUBLE-BLANK@@ ~*/
    get rollTrait() { return this.flagData.rollTrait; }
    /*~ @@DOUBLE-BLANK@@ ~*/
    _rollTraitValOverride;
    /*~ @@DOUBLE-BLANK@@ ~*/
    get rollTraitValOverride() { return this._rollTraitValOverride; }
    /*~ @@DOUBLE-BLANK@@ ~*/
    set rollTraitValOverride(val) { this._rollTraitValOverride = val; }
    /*~ @@DOUBLE-BLANK@@ ~*/
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
    /*~ @@DOUBLE-BLANK@@ ~*/
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
    /*~ @@DOUBLE-BLANK@@ ~*/
    get posEffectTrade() {
        return this.flagData?.rollPosEffectTrade ?? false;
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    getFlagVal(flagKey) {
        if (flagKey) {
            return this.document.getFlag(C.SYSTEM_ID, `rollCollab.${flagKey}`);
        }
        return this.document.getFlag(C.SYSTEM_ID, "rollCollab");
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    async setFlagVal(flagKey, flagVal, isRerendering = true) {
        await this.document.setFlag(C.SYSTEM_ID, `rollCollab.${flagKey}`, flagVal);
        if (isRerendering) {
            socketlib.system.executeForEveryone("renderRollCollab", this.rollID);
        }
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    async clearFlagVal(flagKey, isRerendering = true) {
        await this.document.unsetFlag(C.SYSTEM_ID, `rollCollab.${flagKey}`);
        if (isRerendering) {
            socketlib.system.executeForEveryone("renderRollCollab", this.rollID);
        }
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    get initialPosition() {
        return this.getFlagVal("rollPositionInitial") ?? Position.risky;
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    set initialPosition(val) {
        this.setFlagVal("rollPositionInitial", val ?? Position.risky);
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    get initialEffect() {
        return this.getFlagVal("rollEffectInitial") ?? Effect.standard;
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    set initialEffect(val) {
        this.setFlagVal("rollEffectInitial", val);
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    get isApplyingConsequences() {
        if (this.rollType !== RollType.Action) {
            return false;
        }
        if (!this.rollResult) {
            return false;
        }
        if (![RollResult.partial, RollResult.fail].includes(this.rollResult)) {
            return false;
        }
        return true;
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    // Get rollConsequence() --> For resistance rolls.
    get rollConsequence() {
        return this.getFlagVal("resistanceData.consequence");
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    async applyConsequencesFromDialog(_html) {
        /* Convert values of dialog input fields to flag data */
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    // #endregion
    /*~ @@DOUBLE-BLANK@@ ~*/
    // #region GETTERS: DERIVED DATA ~
    get finalPosition() {
        return Object.values(Position)[U.clampNum(Object.values(Position)
            .indexOf(this.initialPosition)
            + this.getModsDelta(RollModSection.position)
            + (this.posEffectTrade === "position" ? 1 : 0)
            + (this.posEffectTrade === "effect" ? -1 : 0), [0, 2])];
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    get finalEffect() {
        return Object.values(Effect)[U.clampNum(Object.values(Effect)
            .indexOf(this.initialEffect)
            + this.getModsDelta(RollModSection.effect)
            + (this.posEffectTrade === "effect" ? 1 : 0)
            + (this.posEffectTrade === "position" ? -1 : 0), [0, 4])];
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    get finalResult() {
        return this.getModsDelta(RollModSection.result)
            + (this.flagData?.GMBoosts.Result ?? 0)
            + (this.tempGMBoosts.Result ?? 0);
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    get finalDicePool() {
        return Math.max(0, this.rollTraitData.value
            + this.getModsDelta(RollModSection.roll)
            + (this.flagData.GMBoosts.Dice ?? 0)
            + (this.tempGMBoosts.Dice ?? 0));
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    get isRollingZero() {
        return Math.max(0, this.rollTraitData.value
            + this.getModsDelta(RollModSection.roll)
            + (this.flagData.GMBoosts.Dice ?? 0)
            + (this.tempGMBoosts.Dice ?? 0)) <= 0;
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    _roll;
    /*~ @@DOUBLE-BLANK@@ ~*/
    get roll() {
        this._roll ??= new Roll(`${this.isRollingZero ? 2 : this.finalDicePool}d6`, {});
        return this._roll;
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    get rollFactors() {
        /*~ @@DOUBLE-BLANK@@ ~*/
        const defaultFactors = {
            [Factor.tier]: {
                name: "Tier",
                value: 0,
                max: 0,
                baseVal: 0,
                display: "?",
                isActive: false,
                isPrimary: true,
                isDominant: false,
                highFavorsPC: true,
                cssClasses: "factor-gold"
            },
            [Factor.quality]: {
                name: "Quality",
                value: 0,
                max: 0,
                baseVal: 0,
                display: "?",
                isActive: false,
                isPrimary: false,
                isDominant: false,
                highFavorsPC: true,
                cssClasses: "factor-gold"
            },
            [Factor.scale]: {
                name: "Scale",
                value: 0,
                max: 0,
                baseVal: 0,
                display: "?",
                isActive: false,
                isPrimary: false,
                isDominant: false,
                highFavorsPC: true,
                cssClasses: "factor-gold"
            },
            [Factor.magnitude]: {
                name: "Magnitude",
                value: 0,
                max: 0,
                baseVal: 0,
                display: "?",
                isActive: false,
                isPrimary: false,
                isDominant: false,
                highFavorsPC: true,
                cssClasses: "factor-gold"
            }
        };
        /*~ @@DOUBLE-BLANK@@ ~*/
        const mergedSourceFactors = U.objMerge(U.objMerge(defaultFactors, this.rollPrimary.rollFactors, { isMutatingOk: false }), this.flagData.rollFactorToggles.source, { isMutatingOk: false });
        /*~ @@DOUBLE-BLANK@@ ~*/
        const mergedOppFactors = this.rollOpposition
            ? U.objMerge(U.objMerge(defaultFactors, this.rollOpposition.rollFactors, { isMutatingOk: false }), this.flagData.rollFactorToggles.opposition, { isMutatingOk: false })
            : {};
        /*~ @@DOUBLE-BLANK@@ ~*/
        return {
            source: Object.fromEntries(Object.entries(mergedSourceFactors)
                .map(([factor, factorData]) => {
                factorData.value +=
                    (this.flagData.GMBoosts[factor] ?? 0)
                        + (this.tempGMBoosts[factor] ?? 0);
                if (factor === Factor.tier) {
                    factorData.display = U.romanizeNum(factorData.value);
                }
                else {
                    factorData.display = `${factorData.value}`;
                }
                return [factor, factorData];
            })),
            opposition: Object.fromEntries(Object.entries(mergedOppFactors)
                .map(([factor, factorData]) => {
                factorData.value += this.flagData.GMOppBoosts[factor] ?? 0;
                if (factor === Factor.tier) {
                    factorData.display = U.romanizeNum(factorData.value);
                }
                else {
                    factorData.display = `${factorData.value}`;
                }
                return [factor, factorData];
            }))
        };
    }
    // #endregion
    /*~ @@DOUBLE-BLANK@@ ~*/
    // #region ROLL MODS: Getters & Update Method ~
    /*~ @@DOUBLE-BLANK@@ ~*/
    initRollMods(modsData) {
        // Reset override values previously enabled by rollmods
        this.rollTraitValOverride = undefined;
        this.rollFactorPenaltiesNegated = {};
        this.tempGMBoosts = {};
        /*~ @@DOUBLE-BLANK@@ ~*/
        this.rollMods = modsData.map((modData) => new BladesRollMod(modData, this));
        /*~ @@DOUBLE-BLANK@@ ~*/
        const initReport = {};
        /*~ @@DOUBLE-BLANK@@ ~*/
        /* *** PASS ZERO: ROLLTYPE VALIDATION PASS *** */
        this.rollMods = this.rollMods.filter((rollMod) => rollMod.isValidForRollType());
        /*~ @@DOUBLE-BLANK@@ ~*/
        /* *** PASS ONE: DISABLE PASS *** */
        this.rollMods
            // ... Conditional Status Pass
            .filter((rollMod) => !rollMod.setConditionalStatus())
            // ... AutoReveal/AutoEnable Pass
            .filter((rollMod) => !rollMod.setAutoStatus())
            // ... Payable Pass
            .forEach((rollMod) => { rollMod.setPayableStatus(); });
        /*~ @@DOUBLE-BLANK@@ ~*/
        /* *** PASS TWO: FORCE-ON PASS *** */
        const parseForceOnKeys = (mod) => {
            const holdKeys = mod.effectKeys.filter((key) => key.startsWith("ForceOn"));
            if (holdKeys.length === 0) {
                return;
            }
            /*~ @@DOUBLE-BLANK@@ ~*/
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
                        ?? this.getRollModByName(targetName, targetCat ?? mod.section);
                    if (!targetMod && targetName === "Push") {
                        [targetMod] = [
                            ...this.getActiveBasicPushMods(targetCat ?? mod.section, "negative").filter((m) => m.status === RollModStatus.ToggledOn),
                            ...this.getActiveBasicPushMods(targetCat ?? mod.section, "positive").filter((m) => m.status === RollModStatus.ToggledOn),
                            ...this.getInactiveBasicPushMods(targetCat ?? mod.section, "positive").filter((m) => m.status === RollModStatus.ToggledOff)
                        ];
                    }
                    targetMod ??= this.getRollModByName(targetName, targetCat ?? mod.section, targetPosNeg ?? mod.posNeg);
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
        /*~ @@DOUBLE-BLANK@@ ~*/
        /* *** PASS THREE: PUSH-CHECK PASS *** */
        /*~ @@DOUBLE-BLANK@@ ~*/
        // IF ROLL FORCED ...
        if (this.isForcePushed()) {
            // ... Force Off _ALL_ visible, inactive "Is-Push" mods.
            this.getInactivePushMods()
                .filter((mod) => !mod.isBasicPush)
                .forEach((mod) => { mod.heldStatus = RollModStatus.ForcedOff; });
        }
        /*~ @@DOUBLE-BLANK@@ ~*/
        // ... BY CATEGORY ...
        [RollModSection.roll, RollModSection.effect].forEach((cat) => {
            if (this.isPushed(cat)) {
                // ... if pushed by positive mod, Force Off any visible Bargain
                if (cat === RollModSection.roll && this.isPushed(cat, "positive")) {
                    const bargainMod = this.getRollModByID("Bargain-positive-roll");
                    if (bargainMod?.isVisible) {
                        bargainMod.heldStatus = RollModStatus.ForcedOff;
                    }
                }
            }
            else {
                // Otherwise, hide all Is-Push mods
                this.getInactivePushMods(cat)
                    .filter((mod) => !mod.isBasicPush)
                    .forEach((mod) => { mod.heldStatus = RollModStatus.Hidden; });
            }
        });
        /*~ @@DOUBLE-BLANK@@ ~*/
        /* *** PASS FOUR: Relevancy Pass *** */
        /*~ @@DOUBLE-BLANK@@ ~*/
        this.getVisibleRollMods()
            .forEach((mod) => { mod.setRelevancyStatus(); });
        /*~ @@DOUBLE-BLANK@@ ~*/
        /* *** PASS FIVE: Overpayment Pass *** */
        /*~ @@DOUBLE-BLANK@@ ~*/
        // ... If 'Cost-SpecialArmor' active, ForceOff other visible Cost-SpecialArmor mods
        const activeArmorCostMod = this.getActiveRollMods().find((mod) => mod.effectKeys.includes("Cost-SpecialArmor"));
        if (activeArmorCostMod) {
            this.getVisibleRollMods()
                .filter((mod) => !mod.isActive && mod.effectKeys.includes("Cost-SpecialArmor"))
                .forEach((mod) => { mod.heldStatus = RollModStatus.ForcedOff; });
        }
        /*~ @@DOUBLE-BLANK@@ ~*/
        eLog.checkLog2("rollMods", "*** initRollMods() PASS ***", initReport);
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    isTraitRelevant(trait) {
        if (trait in Factor) {
            const { source, opposition } = this.rollFactors;
            return Boolean(trait in source && trait in opposition && source[trait]?.isActive);
        }
        return false;
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    get isParticipantRoll() {
        return (this.rollType === RollType.Fortune && !game.user.isGM)
            || (this.rollSubType === RollSubType.GroupParticipant);
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    rollFactorPenaltiesNegated = {};
    /*~ @@DOUBLE-BLANK@@ ~*/
    negateFactorPenalty(factor) {
        this.rollFactorPenaltiesNegated[factor] = true;
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    tempGMBoosts = {};
    /*~ @@DOUBLE-BLANK@@ ~*/
    isPushed(cat, posNeg) { return this.getActiveBasicPushMods(cat, posNeg).length > 0; }
    /*~ @@DOUBLE-BLANK@@ ~*/
    hasOpenPush(cat, posNeg) { return this.isPushed(cat) && this.getOpenPushMods(cat, posNeg).length > 0; }
    /*~ @@DOUBLE-BLANK@@ ~*/
    isForcePushed(cat, posNeg) { return this.isPushed(cat) && this.getForcedPushMods(cat, posNeg).length > 0; }
    /*~ @@DOUBLE-BLANK@@ ~*/
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
    /*~ @@DOUBLE-BLANK@@ ~*/
    get rollCostData() {
        return this.getActiveRollMods()
            .map((rollMod) => rollMod.costs ?? [])
            .flat();
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    getRollModByName(name, cat, posNeg) {
        const modMatches = this.rollMods.filter((rollMod) => {
            if (U.lCase(rollMod.name) !== U.lCase(name)) {
                return false;
            }
            if (cat && rollMod.section !== cat) {
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
    /*~ @@DOUBLE-BLANK@@ ~*/
    getRollModByID(id) { return this.rollMods.find((rollMod) => rollMod.id === id); }
    /*~ @@DOUBLE-BLANK@@ ~*/
    getRollMods(cat, posNeg) {
        return this.rollMods.filter((rollMod) => (!cat || rollMod.section === cat)
            && (!posNeg || rollMod.posNeg === posNeg));
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    getVisibleRollMods(cat, posNeg) {
        return this.getRollMods(cat, posNeg).filter((rollMod) => rollMod.isVisible);
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    getActiveRollMods(cat, posNeg) {
        return this.getRollMods(cat, posNeg).filter((rollMod) => rollMod.isActive);
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    getVisibleInactiveRollMods(cat, posNeg) {
        return this.getVisibleRollMods(cat, posNeg).filter((rollMod) => !rollMod.isActive);
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    getPushMods(cat, posNeg) {
        return this.getRollMods(cat, posNeg).filter((rollMod) => rollMod.isPush);
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    getVisiblePushMods(cat, posNeg) {
        return this.getPushMods(cat, posNeg).filter((rollMod) => rollMod.isVisible);
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    getActivePushMods(cat, posNeg) {
        return this.getVisiblePushMods(cat, posNeg).filter((rollMod) => rollMod.isActive);
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    getActiveBasicPushMods(cat, posNeg) {
        return this.getActivePushMods(cat, posNeg).filter((rollMod) => rollMod.isBasicPush);
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    getInactivePushMods(cat, posNeg) {
        return this.getVisiblePushMods(cat, posNeg).filter((rollMod) => !rollMod.isActive);
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    getInactiveBasicPushMods(cat, posNeg) {
        return this.getInactivePushMods(cat, posNeg).filter((rollMod) => rollMod.isBasicPush);
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    getForcedPushMods(cat, posNeg) {
        return this.getActivePushMods(cat, posNeg)
            .filter((rollMod) => rollMod.isBasicPush
            && rollMod.status === RollModStatus.ForcedOn);
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    getOpenPushMods(cat, posNeg) {
        return this.getActivePushMods(cat, posNeg)
            .filter((rollMod) => rollMod.isBasicPush
            && rollMod.status === RollModStatus.ToggledOn);
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    getModsDelta = (cat) => {
        return U.sum([
            ...this.getActiveRollMods(cat, "positive").map((mod) => mod.value),
            ...this.getActiveRollMods(cat, "negative").map((mod) => -mod.value)
        ]);
    };
    /*~ @@DOUBLE-BLANK@@ ~*/
    _rollMods;
    /*~ @@DOUBLE-BLANK@@ ~*/
    /**
     * Compare function for sorting roll mods.
     * @param {BladesRollMod} modA First mod to compare.
     * @param {BladesRollMod} modB Second mod to compare.
     * @returns {number} - Comparison result.
     */
    compareMods(modA, modB) {
        // Define the order of mod names for sorting
        const modOrder = ["Bargain", "Assist", "Setup"];
        /*~ @@DOUBLE-BLANK@@ ~*/
        // Check for basic push
        if (modA.isBasicPush) {
            return -1;
        }
        if (modB.isBasicPush) {
            return 1;
        }
        /*~ @@DOUBLE-BLANK@@ ~*/
        // Check for active Bargain
        if (modA.name === "Bargain" && modA.isActive) {
            return -1;
        }
        if (modB.name === "Bargain" && modB.isActive) {
            return 1;
        }
        /*~ @@DOUBLE-BLANK@@ ~*/
        // Check for push
        if (modA.isPush) {
            return -1;
        }
        if (modB.isPush) {
            return 1;
        }
        /*~ @@DOUBLE-BLANK@@ ~*/
        // Check for mod name order
        const modAIndex = modOrder.indexOf(modA.name);
        const modBIndex = modOrder.indexOf(modB.name);
        if (modAIndex !== -1 && modBIndex !== -1) {
            return modAIndex - modBIndex;
        }
        /*~ @@DOUBLE-BLANK@@ ~*/
        // Default to alphabetical order
        return modA.name.localeCompare(modB.name);
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    get rollMods() {
        if (!this._rollMods) {
            throw new Error("[get rollMods] No roll mods found!");
        }
        return [...this._rollMods].sort((modA, modB) => this.compareMods(modA, modB));
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    set rollMods(val) { this._rollMods = val; }
    /*~ @@DOUBLE-BLANK@@ ~*/
    // #endregion
    /*~ @@DOUBLE-BLANK@@ ~*/
    // #region *** GETDATA *** ~
    /*~ @@DOUBLE-BLANK@@ ~*/
    /**
     * Retrieve the data for rendering the base RollCollab sheet.
     * @returns {Promise<object>} The data which can be used to render the HTML of the sheet.
     */
    async getData() {
        const context = super.getData();
        /*~ @@DOUBLE-BLANK@@ ~*/
        this.initRollMods(this.getRollModsData());
        this.rollMods.forEach((rollMod) => rollMod.applyRollModEffectKeys());
        /*~ @@DOUBLE-BLANK@@ ~*/
        const sheetData = this.getSheetData(this.getIsGM(), this.getRollCosts());
        /*~ @@DOUBLE-BLANK@@ ~*/
        return { ...context, ...sheetData };
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    /**
     * Gets the roll modifications data.
     * @returns {BladesRoll.RollModData[]} The roll modifications data.
     */
    getRollModsData() {
        const defaultMods = [
            ...BladesRoll.DefaultRollMods,
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
    /*~ @@DOUBLE-BLANK@@ ~*/
    /**
     * Determines if the user is a game master.
     * @returns {boolean} Whether the user is a GM.
     */
    getIsGM() {
        return game.eunoblades.Tracker?.system.is_spoofing_player ? false : game.user.isGM;
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    /**
     * Gets the roll costs.
     * @returns {BladesRoll.CostData[]} The roll costs.
     */
    getRollCosts() {
        return this.getActiveRollMods()
            .map((rollMod) => rollMod.costs)
            .flat()
            .filter((costData) => costData !== undefined);
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    /**
     * Filters the roll costs to retrieve stress costs.
     * @param {BladesRoll.CostData[]} rollCosts The roll costs.
     * @returns {BladesRoll.CostData[]} The stress costs.
     */
    getStressCosts(rollCosts) {
        return rollCosts.filter((costData) => costData.costType === "Stress");
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    /**
     * Calculates the total stress cost.
     * @param {BladesRoll.CostData[]} stressCosts The stress costs.
     * @returns {number} The total stress cost.
     */
    getTotalStressCost(stressCosts) {
        return U.sum(stressCosts.map((costData) => costData.costAmount));
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    /**
     * Searches for any special armor roll costs.
     * @param {BladesRoll.CostData[]} rollCosts The roll costs.
     * @returns {BladesRoll.CostData[]} The stress costs.
     */
    getSpecArmorCost(rollCosts) {
        return rollCosts.find((costData) => costData.costType === "SpecialArmor");
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    /**
     * Constructs the sheet data.
     * @param {boolean} isGM If the user is a GM.
     * @param {BladesRoll.CostData[]} rollCosts The roll costs.
     * @returns {BladesRoll.SheetData} The constructed sheet data.
     */
    getSheetData(isGM, rollCosts) {
        const { flagData: rData, rollPrimary, rollTraitData, rollTraitOptions, finalDicePool, finalPosition, finalEffect, finalResult, rollMods, rollFactors } = this;
        if (!rollPrimary) {
            throw new Error("A primary roll source is required for BladesRoll.");
        }
        const baseData = {
            ...this.flagData,
            cssClass: "roll-collab",
            editable: this.options.editable,
            isGM,
            system: this.rollPrimaryDoc?.system,
            /*~ @@DOUBLE-BLANK@@ ~*/
            rollMods,
            rollPrimary,
            rollTraitData,
            rollTraitOptions,
            /*~ @@DOUBLE-BLANK@@ ~*/
            diceTotal: finalDicePool,
            /*~ @@DOUBLE-BLANK@@ ~*/
            rollOpposition: this.rollOpposition,
            rollParticipants: this.rollParticipants,
            rollParticipantOptions: this.rollParticipantSelectOptions,
            rollEffects: Object.values(Effect),
            rollTraitValOverride: this.rollTraitValOverride,
            rollFactorPenaltiesNegated: this.rollFactorPenaltiesNegated,
            /*~ @@DOUBLE-BLANK@@ ~*/
            posRollMods: Object.fromEntries(Object.values(RollModSection)
                .map((cat) => [cat, this.getRollMods(cat, "positive")])),
            negRollMods: Object.fromEntries(Object.values(RollModSection)
                .map((cat) => [cat, this.getRollMods(cat, "negative")])),
            hasInactiveConditionals: this.calculateHasInactiveConditionalsData(),
            /*~ @@DOUBLE-BLANK@@ ~*/
            rollFactors,
            ...this.calculateOddsHTML(finalDicePool, finalResult),
            costData: this.getCostsHTML(rollCosts)
        };
        /*~ @@DOUBLE-BLANK@@ ~*/
        const rollPositionData = this.calculatePositionData(finalPosition);
        const rollEffectData = this.calculateEffectData(isGM, finalEffect);
        const rollResultData = this.calculateResultData(isGM, finalResult);
        /*~ @@DOUBLE-BLANK@@ ~*/
        const GMBoostsData = this.calculateGMBoostsData(rData);
        /*~ @@DOUBLE-BLANK@@ ~*/
        const positionEffectTradeData = this.calculatePositionEffectTradeData();
        /*~ @@DOUBLE-BLANK@@ ~*/
        const userPermission = U.objFindKey(baseData.userPermissions, (v) => v.includes(game.user.id ?? ""));
        /*~ @@DOUBLE-BLANK@@ ~*/
        return {
            ...baseData,
            ...(this.rollPrimary.rollPrimaryDoc ? { rollPrimary: this.rollPrimary.rollPrimaryDoc } : {}),
            ...rollPositionData,
            ...rollEffectData,
            ...rollResultData,
            ...GMBoostsData,
            ...positionEffectTradeData,
            userPermission
        };
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    calculatePositionData(finalPosition) {
        return {
            rollPositions: Object.values(Position),
            rollPositionFinal: finalPosition
        };
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    calculateEffectData(isGM, finalEffect) {
        return {
            rollEffects: Object.values(Effect),
            rollEffectFinal: finalEffect,
            isAffectingAfter: this.getVisibleRollMods(RollModSection.after).length > 0
                || (isGM && this.getRollMods(RollModSection.after).length > 0)
        };
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    calculateResultData(isGM, finalResult) {
        return {
            rollResultFinal: finalResult,
            isAffectingResult: finalResult > 0
                || this.getVisibleRollMods(RollModSection.result).length > 0
                || (isGM && this.getRollMods(RollModSection.result).length > 0)
        };
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
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
    /*~ @@DOUBLE-BLANK@@ ~*/
    calculateOddsHTML(diceTotal, finalResult) {
        if (this.rollType === RollType.Resistance) {
            return this.calculateOddsHTML_Resistance(diceTotal);
        }
        return this.calculateOddsHTML_Standard(diceTotal, finalResult);
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    /**
     * Calculate odds starting & ending HTML based on given dice total.
     * @param {number} diceTotal Total number of dice.
     * @param {number} finalResult
     * @returns {{oddsHTMLStart: string, oddsHTMLStop: string}} Opening & Closing HTML for odds bar display
     */
    calculateOddsHTML_Standard(diceTotal, finalResult) {
        const oddsColors = {
            crit: "var(--blades-gold)",
            success: "var(--blades-white-bright)",
            partial: "var(--blades-grey)",
            fail: "var(--blades-black-dark)"
        };
        const odds = { ...C.DiceOddsStandard[diceTotal] };
        /*~ @@DOUBLE-BLANK@@ ~*/
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
        /*~ @@DOUBLE-BLANK@@ ~*/
        const resultElements = [];
        /*~ @@DOUBLE-BLANK@@ ~*/
        Object.entries(odds).reverse().forEach(([result, chance]) => {
            if (chance === 0) {
                return;
            }
            resultElements.push(`<div class="odds-section" style="height: 100%; width: ${chance}%; background: ${oddsColors[result]};">&nbsp;</div>`);
        });
        /*~ @@DOUBLE-BLANK@@ ~*/
        return {
            oddsHTMLStart: [
                "<div class=\"roll-odds-section-container\">",
                ...resultElements
            ].join("\n"),
            oddsHTMLStop: "</div>"
        };
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    /**
     * Calculate odds starting & ending HTML based on given dice total.
     * @param {number} diceTotal Total number of dice.
     * @returns {{oddsHTMLStart: string, oddsHTMLStop: string}} Opening & Closing HTML for odds bar display
     */
    calculateOddsHTML_Resistance(diceTotal) {
        // Const oddsColors = [
        //   "var(--blades-gold)", // -1
        //   "var(--blades-white)", // 0
        //   "var(--blades-red-bright)", // 1
        //   "var(--blades-red-dark)", // 2
        //   "var(--blades-red-bright)", // 3
        //   "var(--blades-red-dark)", // 4
        //   "var(--blades-red-bright)" // 5
        // ].reverse();
        const oddsColors = [
            "var(--blades-gold)",
            "var(--blades-white)",
            "var(--blades-red)",
            "var(--blades-red)",
            "var(--blades-red)",
            "var(--blades-red)",
            "var(--blades-red)" // 5
        ].reverse();
        const oddsFilters = [
            "none",
            "none",
            "brightness(0.2)",
            "brightness(0.4)",
            "brightness(0.6)",
            "brightness(0.8)",
            "none"
        ].reverse();
        const odds = [...C.DiceOddsResistance[diceTotal]].reverse();
        /*~ @@DOUBLE-BLANK@@ ~*/
        const resultElements = [];
        /*~ @@DOUBLE-BLANK@@ ~*/
        for (let index = 0; index < odds.length; index++) {
            const chance = odds[index];
            if (chance > 0) {
                const color = oddsColors[index];
                const filter = oddsFilters[index];
                resultElements.push(...[
                    `<div class="odds-section odds-section-stress" style="height: 100%; width: ${chance}%; background: ${color}; filter: ${filter};">&nbsp;</div>`
                ]);
            }
        }
        /*~ @@DOUBLE-BLANK@@ ~*/
        return {
            oddsHTMLStart: [
                "<div class=\"roll-odds-section-container\">",
                ...resultElements
            ].join("\n"),
            oddsHTMLStop: "</div>"
        };
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    /**
     * Calculate data for position and effect trade.
     * @returns {{canTradePosition: boolean, canTradeEffect: boolean}}
     */
    calculatePositionEffectTradeData() {
        const canTradePosition = this.posEffectTrade === "position" || (this.posEffectTrade === false
            && this.finalPosition !== Position.desperate
            && this.finalEffect !== Effect.extreme);
        const canTradeEffect = this.posEffectTrade === "effect" || (this.posEffectTrade === false
            && this.finalPosition !== Position.controlled
            && this.finalEffect !== Effect.zero);
        /*~ @@DOUBLE-BLANK@@ ~*/
        return { canTradePosition, canTradeEffect };
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    /**
     * Calculate data on whether there are any inactive conditionals.
     * @returns {Record<RollModSection, boolean>} - Data on inactive conditionals.
     */
    calculateHasInactiveConditionalsData() {
        const hasInactive = {};
        for (const section of Object.values(RollModSection)) {
            hasInactive[section] = this.getRollMods(section).filter((mod) => mod.isInInactiveBlock).length > 0;
        }
        return hasInactive;
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    getCostsHTML(rollCosts) {
        switch (this.rollType) {
            case RollType.Action: {
                return this.parseActionRollCostsHTML(this.getStressCosts(rollCosts), this.getSpecArmorCost(rollCosts));
            }
            case RollType.Resistance: {
                return this.parseResistanceRollCostsHTML(this.getStressCosts(rollCosts), this.getSpecArmorCost(rollCosts));
            }
            case RollType.Fortune: {
                return this.parseFortuneRollCostsHTML();
            }
            case RollType.IndulgeVice: {
                return this.parseIndulgeViceRollCostsHTML();
            }
            default: return false;
        }
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    /**
     * Calculate data for costs of Action Roll.
     * @param {BladesRoll.CostData[]} stressCosts Array of stress costs.
     * @param {BladesRoll.CostData} [specArmorCost] Specific armor cost.
     * @returns {{footerLabel: string, tooltip: string} | undefined} - Costs data or undefined.
     */
    parseActionRollCostsHTML(stressCosts, specArmorCost) {
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
    /*~ @@DOUBLE-BLANK@@ ~*/
    parseResistanceRollCostsHTML(stressCosts, specArmorCost) {
        const footerLabelStrings = [
            "( Resisting Costs"
        ];
        if (specArmorCost) {
            footerLabelStrings.push("your <span class='cyan-bright'><strong>Special Armor</strong></span> )");
        }
        else {
            footerLabelStrings.push("<span class='red-bright'><strong>(6 - Best Die)</strong> Stress</span>,<br />or <span class='gold-bright'><strong>Clears 1 Stress</strong></span> on a <span class='gold-bright'>Critical Success</span> )");
        }
        return {
            footerLabel: footerLabelStrings.join(" "),
            tooltip: [
                "<h1>Roll Costs</h1><ul>",
                ...stressCosts.map((costData) => `<li><strong class='shadowed'>${costData.label}: <span class='red-bright'>${costData.costAmount}</span> Stress</strong></li>`),
                specArmorCost ? `<li><strong class='shadowed'>${specArmorCost.label}: <strong class='cyan-bright'>Special Armor</strong></strong></li>` : null,
                "</ul>"
            ].filter((line) => Boolean(line)).join("")
        };
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    parseFortuneRollCostsHTML() {
        return { footerLabel: "Fortune Cost Label", tooltip: "Fortune Cost Tooltip" };
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    parseIndulgeViceRollCostsHTML() {
        return { footerLabel: "Indulge Vice Cost Label", tooltip: "Indulge Vice Cost Tooltip" };
    }
    // #endregion
    /*~ @@DOUBLE-BLANK@@ ~*/
    // #region *** EVALUATING & DISPLAYING ROLL TO CHAT *** ~
    /*~ @@DOUBLE-BLANK@@ ~*/
    // #region DICE ~
    _dieVals;
    /*~ @@DOUBLE-BLANK@@ ~*/
    get dieVals() {
        this._dieVals ??= this.roll.terms[0].results
            .map((result) => result.result)
            .sort()
            .reverse();
        return this._dieVals;
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    getDieClass(val, i) {
        eLog.checkLog3("rollCollab", `getDieClass(${val}, ${i})`, { inst: this });
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
    /*~ @@DOUBLE-BLANK@@ ~*/
    get dieValsHTML() {
        eLog.checkLog3("rollCollab", "[get dieValsHTML()]", { roll: this, dieVals: this.dieVals });
        const dieVals = [...this.dieVals];
        const ghostNum = this.isRollingZero ? dieVals.shift() : null;
        /*~ @@DOUBLE-BLANK@@ ~*/
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
                ...dieVals.map((val, i) => `<span class='blades-die ${this.getDieClass(val, i)} blades-die-${val}'><img src='systems/eunos-blades/assets/dice/faces/${val}.webp' /></span>`),
                ghostNum ? `<span class='blades-die blades-die-ghost blades-die-${ghostNum}'><img src='systems/eunos-blades/assets/dice/faces/${ghostNum}.webp' /></span>` : null
            ]
                .filter((val) => typeof val === "string")
                .join("");
        }
    }
    // #endregion
    /*~ @@DOUBLE-BLANK@@ ~*/
    get rollResult() {
        /*~ @@DOUBLE-BLANK@@ ~*/
        if ([RollPhase.Collaboration, RollPhase.AwaitingRoll].includes(this.rollPhase)) {
            return false;
        }
        /*~ @@DOUBLE-BLANK@@ ~*/
        // If rollingZero, remove highest die.
        const dieVals = this.isRollingZero
            ? [[...this.dieVals].pop()]
            : this.dieVals;
        /*~ @@DOUBLE-BLANK@@ ~*/
        // Is this a critical success?
        if (dieVals.filter((val) => val === 6).length >= 2) {
            return RollResult.critical;
        }
        /*~ @@DOUBLE-BLANK@@ ~*/
        // A full success?
        if (dieVals.find((val) => val === 6)) {
            return RollResult.success;
        }
        /*~ @@DOUBLE-BLANK@@ ~*/
        // A partial?
        if (dieVals.find((val) => val && val >= 4)) {
            return RollResult.partial;
        }
        /*~ @@DOUBLE-BLANK@@ ~*/
        return RollResult.fail;
        /*~ @@DOUBLE-BLANK@@ ~*/
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    get rollPhase() {
        return this.getFlagVal("rollPhase") ?? RollPhase.Collaboration;
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    set rollPhase(phase) {
        this.setFlagVal("rollPhase", phase);
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    async outputRollToChat() {
        BladesChat.ConstructRollOutput(this);
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    async resolveRoll() {
        await this.roll.evaluate({ async: true });
        if (this.isApplyingConsequences) {
            this.rollPhase = RollPhase.ApplyingConsequences;
        }
        eLog.checkLog3("rollCollab", "[resolveRoll()] After Evaluation, Before Chat", { roll: this, dieVals: this.dieVals });
        await this.outputRollToChat();
        this.close();
    }
    // #endregion
    /*~ @@DOUBLE-BLANK@@ ~*/
    // #region LISTENER FUNCTIONS ~
    /*~ @@DOUBLE-BLANK@@ ~*/
    _toggleRollModClick(event) {
        event.preventDefault();
        const elem$ = $(event.currentTarget);
        const id = elem$.data("id");
        const rollMod = this.getRollModByID(id);
        if (!rollMod) {
            throw new Error(`Unable to find roll mod with id '${id}'`);
        }
        /*~ @@DOUBLE-BLANK@@ ~*/
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
                rollMod.userStatus = game.user.isGM
                    ? RollModStatus.ForcedOn
                    : RollModStatus.ToggledOff;
                return;
            case RollModStatus.ForcedOn:
                rollMod.userStatus = RollModStatus.Hidden;
                return;
            default: throw new Error(`Unrecognized RollModStatus: ${rollMod.status}`);
        }
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    /**
     * Handles setting of rollMod status via GM pop-out controls
     * @param {ClickEvent} event JQuery click event sent to listener.
     */
    _gmControlSet(event) {
        event.preventDefault();
        if (!game.user.isGM) {
            return;
        }
        const elem$ = $(event.currentTarget);
        const id = elem$.data("id");
        const status = elem$.data("status");
        if (!isModStatus(status) && status !== "Reset") {
            return;
        }
        const rollMod = this.getRollModByID(id);
        /*~ @@DOUBLE-BLANK@@ ~*/
        if (rollMod) {
            rollMod.userStatus = status === "Reset" ? undefined : status;
        }
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    /**
     * Handles setting values via GM number line (e.g. roll factor boosts/modifications).
     * @param {ClickEvent} event JQuery click event sent to listener.
     */
    async _gmControlSetTargetToValue(event) {
        event.preventDefault();
        if (!game.user.isGM) {
            return;
        }
        const elem$ = $(event.currentTarget);
        const target = elem$.data("target").replace(/flags\.eunos-blades\./, "");
        const value = elem$.data("value");
        /*~ @@DOUBLE-BLANK@@ ~*/
        await this.document.setFlag(C.SYSTEM_ID, target, value).then(() => socketlib.system.executeForEveryone("renderRollCollab", this.rollID));
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    async _gmControlCycleTarget(event) {
        event.preventDefault();
        if (!game.user.isGM) {
            return;
        }
        const elem$ = $(event.currentTarget);
        const flagTarget = elem$.data("flagTarget");
        const curVal = elem$.data("curVal");
        const cycleVals = elem$.data("vals")?.split(/\|/);
        if (!cycleVals) {
            throw new Error(`Unable to parse cycle values from data-vals = ${elem$.data("vals")}`);
        }
        const curValIndex = cycleVals.indexOf(curVal);
        if (curValIndex === -1) {
            throw new Error(`Unable to find current value '${curVal}' in cycle values '${elem$.data("vals")}'`);
        }
        let newValIndex = curValIndex + 1;
        if (newValIndex >= cycleVals.length) {
            newValIndex = 0;
        }
        const newVal = cycleVals[newValIndex];
        eLog.checkLog3("gmControlCycleTarget", "gmControlCycleTarget", { flagTarget, curVal, cycleVals, curValIndex, newValIndex, newVal });
        await this.setFlagVal(flagTarget, newVal);
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    /**
     * Handles resetting value associated with GM number line on a right-click.
     * @param {ClickEvent} event JQuery context menu event sent to listener.
     */
    async _gmControlResetTarget(event) {
        event.preventDefault();
        if (!game.user.isGM) {
            return;
        }
        const elem$ = $(event.currentTarget);
        const target = elem$.data("target").replace(/flags\.eunos-blades\./, "");
        /*~ @@DOUBLE-BLANK@@ ~*/
        await this.document.unsetFlag(C.SYSTEM_ID, target).then(() => socketlib.system.executeForEveryone("renderRollCollab", this.rollID));
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    /**
     * Handles setting of baseline rollPosition via GM button line
     * @param {ClickEvent} event JQuery click event sent to listener.
     */
    _gmControlSetPosition(event) {
        event.preventDefault();
        if (!game.user.isGM) {
            return;
        }
        const elem$ = $(event.currentTarget);
        const position = elem$.data("status");
        this.initialPosition = position;
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    /**
     * Handles setting of baseline rollPosition via GM button line
     * @param {ClickEvent} event JQuery click event sent to listener.
     */
    _gmControlSetEffect(event) {
        event.preventDefault();
        if (!game.user.isGM) {
            return;
        }
        const elem$ = $(event.currentTarget);
        const effect = elem$.data("status");
        this.initialEffect = effect;
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    /**
     * Handles setting of Factor toggles: isActive, isPrimary, highFavorsPC, isDominant
     * @param {ClickEvent} event JQuery click event sent to listener.
     */
    async _gmControlToggleFactor(event) {
        event.preventDefault();
        if (!game.user.isGM) {
            return;
        }
        const elem$ = $(event.currentTarget);
        const target = elem$.data("target");
        const value = !elem$.data("value");
        /*~ @@DOUBLE-BLANK@@ ~*/
        eLog.checkLog3("toggleFactor", "_gmControlToggleFactor", { event, target, value });
        /*~ @@DOUBLE-BLANK@@ ~*/
        const factorToggleData = this.document.getFlag(C.SYSTEM_ID, "rollCollab.rollFactorToggles");
        /*~ @@DOUBLE-BLANK@@ ~*/
        const [thisSource, thisFactor, thisToggle] = target.split(/\./).slice(-3);
        /*~ @@DOUBLE-BLANK@@ ~*/
        // If thisToggle is unrecognized, just toggle whatever value target points at
        if (!["isActive", "isPrimary", "isDominant", "highFavorsPC"].includes(thisToggle)) {
            await this.document.setFlag(C.SYSTEM_ID, `rollCollab.${target}`, value)
                .then(() => socketlib.system.executeForEveryone("renderRollCollab", this.rollID));
        }
        /*~ @@DOUBLE-BLANK@@ ~*/
        // Otherwise, first toggle targeted factor to new value
        factorToggleData[thisSource][thisFactor] = {
            ...factorToggleData[thisSource][thisFactor] ?? { display: "" },
            [thisToggle]: value
        };
        /*~ @@DOUBLE-BLANK@@ ~*/
        // Then perform specific logic depending on toggle targeted:
        switch (thisToggle) {
            case "isDominant":
            case "isPrimary": {
                // Only one factor per sourceType can be declared Primary or Dominant:
                //    If one is being activated, must toggle off the others.
                if (value === true) {
                    Object.values(Factor)
                        .filter((factor) => factor !== thisFactor)
                        .forEach((factor) => {
                        if (factorToggleData[thisSource][factor]?.[thisToggle] === true) {
                            factorToggleData[thisSource][factor] = {
                                ...factorToggleData[thisSource][factor],
                                [thisToggle]: false
                            };
                        }
                    });
                }
                break;
            }
            case "isActive": {
                // 'isActive' should be synchronized when 1) value is true, and 2) the other value is false
                if (value === true) {
                    const otherSource = thisSource === "source" ? "opposition" : "source";
                    factorToggleData[otherSource][thisFactor] = {
                        ...factorToggleData[otherSource][thisFactor] ?? { display: "" },
                        isActive: value
                    };
                }
                break;
            }
            default: break;
        }
        /*~ @@DOUBLE-BLANK@@ ~*/
        await this.document.setFlag(C.SYSTEM_ID, "rollCollab.rollFactorToggles", factorToggleData)
            .then(() => socketlib.system.executeForEveryone("renderRollCollab", this.rollID));
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    async _onSelectChange(event) {
        event.preventDefault();
        const elem = event.currentTarget;
        const { docType } = elem.dataset;
        if (elem.value !== "" && docType?.startsWith("BladesRollParticipant")) {
            const [_, section, subSection] = docType.split(".");
            await this.addRollParticipant(elem.value, section, subSection);
        }
        else {
            await U.EventHandlers.onSelectChange(this, event);
            socketlib.system.executeForEveryone("renderRollCollab", this.rollID);
        }
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    async _onTextInputBlur(event) {
        await U.EventHandlers.onTextInputBlur(this, event);
        socketlib.system.executeForEveryone("renderRollCollab", this.rollID);
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    // Async _gmControlSelect(event: SelectChangeEvent) {
    //   event.preventDefault();
    //   const elem$ = $(event.currentTarget);
    //   const section = elem$.data("rollSection");
    //   const subSection = elem$.data("rollSubSection");
    //   const selectedOption = elem$.val();
    /*~ @@DOUBLE-BLANK@@ ~*/
    //   if (typeof selectedOption !== "string") { return; }
    //   if (selectedOption === "false") {
    //     await this.document.unsetFlag(C.SYSTEM_ID, `rollCollab.rollParticipantData.${section}.${subSection}`);
    //   }
    //   await this.addRollParticipant(selectedOption, section, subSection);
    /*~ @@DOUBLE-BLANK@@ ~*/
    // }
    /*~ @@DOUBLE-BLANK@@ ~*/
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
    /*~ @@DOUBLE-BLANK@@ ~*/
    // #endregion
    // #region ACTIVATE LISTENERS ~
    activateListeners(html) {
        super.activateListeners(html);
        ApplyTooltipListeners(html);
        ApplyConsequenceListeners(html);
        /*~ @@DOUBLE-BLANK@@ ~*/
        // User-Toggleable Roll Mods
        html.find(".roll-mod[data-action='toggle']").on({
            click: this._toggleRollModClick.bind(this)
        });
        /*~ @@DOUBLE-BLANK@@ ~*/
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
        /*~ @@DOUBLE-BLANK@@ ~*/
        html.find("[data-action='roll']").on({
            click: () => this.resolveRoll()
        });
        /*~ @@DOUBLE-BLANK@@ ~*/
        html
            .find("select[data-action='player-select']")
            .on({ change: this._onSelectChange.bind(this) });
        /*~ @@DOUBLE-BLANK@@ ~*/
        if (!game.user.isGM) {
            return;
        }
        /*~ @@DOUBLE-BLANK@@ ~*/
        // GM Controls
        html.on({
            focusin: () => { BladesRoll.Active = this; } // Set reference to top-most, focused roll.
        });
        /**
         * Handles setting of rollMod status via GM pop-out controls
         */
        html.find(".controls-toggle").on({
            click: (event) => {
                event.preventDefault();
                $(event.currentTarget).parents(".controls-panel").toggleClass("active");
            }
        });
        html.find("[data-action=\"gm-set\"]").on({
            click: this._gmControlSet.bind(this)
        });
        /**
         * Handles setting of baseline rollPosition via GM button line
         */
        html.find("[data-action=\"gm-set-position\"]").on({
            click: this._gmControlSetPosition.bind(this)
        });
        /**
         * Handles setting of baseline rollEffect via GM button line
         */
        html.find("[data-action=\"gm-set-effect\"]").on({
            click: this._gmControlSetEffect.bind(this)
        });
        /**
         * Handles setting values via GM number line (e.g. roll factor boosts/modifications).
         * Handles resetting value associated with GM number line on a right-click.
         */
        html.find("[data-action=\"gm-set-target\"]").on({
            click: this._gmControlSetTargetToValue.bind(this),
            contextmenu: this._gmControlResetTarget.bind(this)
        });
        /**
         * Handles setting values via GM number line (e.g. roll factor boosts/modifications).
         * Handles resetting value associated with GM number line on a right-click.
         */
        html.find("[data-action=\"gm-cycle-target\"]").on({
            click: this._gmControlCycleTarget.bind(this)
        });
        /**
         * Handles setting of Factor toggles: isActive, isPrimary, highFavorsPC, isDominant
         */
        html.find("[data-action=\"gm-toggle-factor\"]").on({
            click: this._gmControlToggleFactor.bind(this)
        });
        /*~ @@DOUBLE-BLANK@@ ~*/
        html
            .find("select[data-action='gm-select']")
            .on({ change: this._onSelectChange.bind(this) });
        /*~ @@DOUBLE-BLANK@@ ~*/
        html
            .find("[data-action=\"gm-edit-consequences\"]")
            .on({ click: () => BladesDialog.DisplayRollConsequenceDialog(this) });
        /*~ @@DOUBLE-BLANK@@ ~*/
        html
            .find("[data-action='gm-text-input']")
            .on({ blur: this._onTextInputBlur.bind(this) });
        /*~ @@DOUBLE-BLANK@@ ~*/
    }
    // #endregion
    /*~ @@DOUBLE-BLANK@@ ~*/
    // #region OVERRIDES: _canDragDrop, _onDrop, _onSubmit, close, render ~
    _canDragDrop() {
        return game.user.isGM;
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    _onDrop(event) {
        const { type, uuid } = TextEditor.getDragEventData(event);
        const [id] = (new RegExp(`${type}\\.(.+)`).exec(uuid) ?? []).slice(1);
        const oppDoc = game[`${U.lCase(type)}s`].get(id);
        if (BladesRollOpposition.IsDoc(oppDoc)) {
            this.rollOpposition = new BladesRollOpposition(this, { rollOppDoc: oppDoc });
        }
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    async _onSubmit(event, { updateData } = {}) {
        const returnVal = await super._onSubmit(event, { updateData, preventClose: true });
        await socketlib.system.executeForEveryone("renderRollCollab", this.rollID);
        return returnVal;
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    async close(options = {}) {
        /*~ @@DOUBLE-BLANK@@ ~*/
        if (options.rollID) {
            return super.close({});
        }
        await this.document.setFlag(C.SYSTEM_ID, "rollCollab", null);
        socketlib.system.executeForEveryone("closeRollCollab", this.rollID);
        return undefined;
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    render(force = false, options) {
        if (!this.document.getFlag(C.SYSTEM_ID, "rollCollab")) {
            return this;
        }
        return super.render(force, options);
    }
}
/*~ @@DOUBLE-BLANK@@ ~*/
// #region EXPORTS ~
export { BladesRollMod, BladesRollPrimary, BladesRollOpposition, BladesRollParticipant };
export default BladesRoll;
// #endregion
/*~ @@DOUBLE-BLANK@@ ~*/ 
