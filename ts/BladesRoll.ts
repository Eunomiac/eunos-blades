// #region IMPORTS ~
import U from "./core/utilities";
import C, {BladesActorType, BladesItemType, RollPermissions, RollType, RollSubType, RollModStatus, RollModSection, ActionTrait, DowntimeAction, AttributeTrait, Position, Effect, Factor, RollResult, RollPhase, ConsequenceType, Tag} from "./core/constants";
import {BladesActor, BladesPC, BladesCrew} from "./documents/BladesActorProxy";
import {BladesItem, BladesGMTracker} from "./documents/BladesItemProxy";
import {ApplyTooltipAnimations, ApplyConsequenceAnimations} from "./core/gsap";
import BladesConsequence from "./sheets/roll/BladesConsequence";
import BladesDialog from "./BladesDialog";
import BladesChat from "./BladesChat";

import type {PropertiesToSource} from "@league-of-foundry-developers/foundry-vtt-types/src/types/helperTypes";
import type {ChatSpeakerDataProperties} from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/chatSpeakerData";
// #endregion
// #region Types & Type Checking ~

/**
 * Checks if the given string is a RollType.
 * @param {unknown} str The string to check.
 * @returns {boolean} True if the string is a RollType, false otherwise.
 */
function isRollType(str: unknown): str is RollType {
  return typeof str === "string" && str in RollType;
}

/**
 * Checks if the given trait is an ActionTrait.
 * @param {unknown} trait The trait to check.
 * @returns {boolean} True if the trait is an ActionTrait, false otherwise.
 */
function isAction(trait: unknown): trait is BladesRoll.RollTrait & ActionTrait {
  return Boolean(trait && typeof trait === "string" && U.lCase(trait) in ActionTrait);
}

/**
 * Checks if the given trait is an AttributeTrait.
 * @param {unknown} trait The trait to check.
 * @returns {boolean} True if the trait is an AttributeTrait, false otherwise.
 */
function isAttribute(trait: unknown): trait is BladesRoll.RollTrait & AttributeTrait {
  return Boolean(trait && typeof trait === "string" && U.lCase(trait) in AttributeTrait);
}

/**
 * Checks if the given trait is a Factor.
 * @param {unknown} trait The trait to check.
 * @returns {boolean} True if the trait is a Factor, false otherwise.
 */
function isFactor(trait: unknown): trait is BladesRoll.RollTrait & Factor {
  return Boolean(trait && typeof trait === "string" && U.lCase(trait) in Factor);
}

/**
 * Checks if the given string is a RollModStatus.
 * @param {unknown} str The string to check.
 * @returns {boolean} True if the string is a RollModStatus, false otherwise.
 */
function isModStatus(str: unknown): str is RollModStatus {
  return typeof str === "string" && str in RollModStatus;
}

/**
 * Checks if the given value is valid consequence data for a Resistance Roll.
 * @param {unknown} val The value to check.
 * @param {boolean} [isCheckingResistedTo=false] If the check is being recursively
 *                         applied to the 'resistTo' value.
 * @returns {boolean} True if the val is valid BladesRoll.ResistanceRollConsequenceData, false otherwise.
 */
function isValidConsequenceData(
  val: unknown,
  isCheckingResistedTo = false
): val is BladesRoll.ResistanceRollConsequenceData {
  if (!U.isList(val)) {return false;}
  if (typeof val.type !== "string" || !(val.type in ConsequenceType)) {return false;}
  if (val.type === ConsequenceType.None) { return true; }

  if (typeof val.name !== "string") {return false;}
  if (typeof val.icon !== "string") {return false;}
  if (typeof val.typeDisplay !== "string") {return false;}

  if (isCheckingResistedTo) {return true;}

  if (typeof val.attribute !== "string" || !(val.attribute in AttributeTrait)) {return false;}
  if (!isValidConsequenceData(val.resistTo, true)) {return false;}

  return true;
}

/**
 * Checks if the given section can contain BladesRollParticipant documents.
 * @param {RollModSection} section
 */
function isParticipantSection(section: RollModSection): section is BladesRoll.RollParticipantSection & RollModSection {
  return [
    RollModSection.roll,
    RollModSection.position,
    RollModSection.effect
  ].includes(section);
}

/**
 * Checks if the given subSection can hold BladesRollParticipant documents.
 * @param {string} subSection
 */
function isParticipantSubSection(subSection: string): subSection is BladesRoll.RollParticipantSubSection {
  if (subSection.startsWith("Group_")) {return true;}
  if (["Assist", "Setup"].includes(subSection)) {return true;}
  return false;
}
// #endregion
// #region Utility Functions ~
/**
 * Prunes the configuration file of flag-incompatible direct document references.
 * @param {BladesRoll.Config} cfg The configuration object to be pruned.
 * @returns {BladesRoll.ConfigFlags} - The pruned configuration object.
 */
function pruneConfig(cfg: BladesRoll.Config & Record<string, unknown>): BladesRoll.ConfigFlags {
  if (cfg.rollPrimaryData instanceof BladesRollPrimary) {
    cfg.rollPrimaryData = cfg.rollPrimaryData.flagData;
  }
  if (cfg.rollOppData instanceof BladesRollOpposition) {
    cfg.rollOppData = cfg.rollOppData.flagData;
  }
  if (cfg.rollParticipantData) {
    if (cfg.rollParticipantData[RollModSection.roll]) {
      Object.keys(cfg.rollParticipantData[RollModSection.roll]).forEach((key) => {
        const thisParticipant = cfg.rollParticipantData?.[RollModSection.roll]?.[key as Exclude<BladesRoll.RollParticipantSubSection, "Setup">];
        if (thisParticipant instanceof BladesRollParticipant) {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          cfg.rollParticipantData![RollModSection.roll]![key as Exclude<BladesRoll.RollParticipantSubSection, "Setup">] = thisParticipant.flagData;
        }
      });
    }
    if (cfg.rollParticipantData[RollModSection.position]) {
      Object.keys(cfg.rollParticipantData[RollModSection.position]).forEach((key) => {
        const thisParticipant = cfg.rollParticipantData?.[RollModSection.position]?.[key as "Setup"];
        if (thisParticipant instanceof BladesRollParticipant) {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          cfg.rollParticipantData![RollModSection.position]![key as "Setup"] = thisParticipant.flagData;
        }
      });
    }
    if (cfg.rollParticipantData[RollModSection.effect]) {
      Object.keys(cfg.rollParticipantData[RollModSection.effect]).forEach((key) => {
        const thisParticipant = cfg.rollParticipantData?.[RollModSection.effect]?.[key as "Setup"];
        if (thisParticipant instanceof BladesRollParticipant) {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          cfg.rollParticipantData![RollModSection.effect]![key as "Setup"] = thisParticipant.flagData;
        }
      });
    }
  }
  return JSON.parse(JSON.stringify(cfg)) as BladesRoll.ConfigFlags;
}
// #endregion

class BladesRollMod {

  static ParseDocRollMods(doc: BladesDoc): BladesRoll.RollModData[] {

    const {roll_mods} = doc.system;
    if (!roll_mods || roll_mods.length === 0) {return [];}

    return (roll_mods
      .filter((elem) => typeof elem === "string") as string[])
      .map((modString) => {
        const pStrings = modString.split(/@/);
        const nameString = U.pullElement(pStrings, (v) => typeof v === "string" && /^na/i.test(v));
        const nameVal = (typeof nameString === "string" && nameString.replace(/^.*:/, ""));
        if (!nameVal) {throw new Error(`RollMod Missing Name: '${modString}'`);}
        const catString = U.pullElement(pStrings, (v) => typeof v === "string" && /^cat/i.test(v));
        const catVal = (typeof catString === "string" && catString.replace(/^.*:/, "")) as RollModSection | false;
        if (!catVal || !(catVal in RollModSection)) {throw new Error(`RollMod Missing Category: '${modString}'`);}
        const posNegString = (U.pullElement(pStrings, (v) => typeof v === "string" && /^p/i.test(v)) || "posNeg:positive");
        const posNegVal = posNegString.replace(/^.*:/, "") as "positive" | "negative";

        const rollModData: BladesRoll.RollModData = {
          id: `${nameVal}-${posNegVal}-${catVal}`,
          name: nameVal,
          section: catVal,
          base_status: RollModStatus.ToggledOff,
          modType: "general",
          value: 1,
          posNeg: posNegVal,
          tooltip: ""
        };

        pStrings.forEach((pString) => {
          const [keyString, valString] = pString.split(/:/) as [string, string];
          let val: string | string[] = /\|/.test(valString) ? valString.split(/\|/) : valString;
          let key: KeyOf<BladesRoll.RollModData>;
          if (/^stat/i.test(keyString)) {key = "base_status";} else
            if (/^val/i.test(keyString)) {key = "value";} else
              if (/^eff|^ekey/i.test(keyString)) {key = "effectKeys";} else
                if (/^side|^ss/i.test(keyString)) {key = "sideString";} else
                  if (/^s.*ame/i.test(keyString)) {key = "source_name";} else
                    if (/^tool|^tip/i.test(keyString)) {key = "tooltip";} else
                      if (/^ty/i.test(keyString)) {key = "modType";} else
                        if (/^c.{0,10}r?.{0,3}ty/i.test(keyString)) {key = "conditionalRollTypes";} else
                          if (/^a.{0,3}r?.{0,3}y/i.test(keyString)) {key = "autoRollTypes";} else
                            if (/^p.{0,10}r?.{0,3}y/i.test(keyString)) {key = "participantRollTypes";} else
                              if (/^c.{0,10}r?.{0,3}tr/i.test(keyString)) {key = "conditionalRollTraits";} else
                                if (/^a.{0,3}r?.{0,3}tr/i.test(keyString)) {key = "autoRollTraits";} else
                                  if (/^p.{0,10}r?.{0,3}tr/i.test(keyString)) {key = "participantRollTypes";} else {
                                    throw new Error(`Bad Roll Mod Key: ${keyString}`);
                                  }

          if (key === "base_status" && val === "Conditional") {
            val = RollModStatus.Hidden;
          }

          let valProcessed;
          if (["value"].includes(key)) {
            valProcessed = U.pInt(val);
          } else if (["effectKeys", "conditionalRollTypes", "autoRollTypes,", "conditionalRollTraits", "autoRollTraits"].includes(key)) {
            valProcessed = [val].flat();
          } else {
            valProcessed = (val as string).replace(/%COLON%/g, ":");
          }

          Object.assign(
            rollModData,
            {[key]: valProcessed}
          );
        });

        return rollModData;
      });
  }

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

  get isActive() {return [RollModStatus.ToggledOn, RollModStatus.ForcedOn].includes(this.status);}

  get isVisible() {return this.status !== RollModStatus.Hidden;}

  _heldStatus?: RollModStatus;

  get heldStatus(): RollModStatus | undefined {return this._heldStatus;}

  set heldStatus(val: RollModStatus | undefined) {
    this._heldStatus = val;
  }

  get flagParams() {return [C.SYSTEM_ID, `rollCollab.rollModsData.${this.id}`] as const;}

  getUserStatusFlag() {
    return this.rollInstance.document.getFlag(...this.flagParams) as
      RollModStatus | undefined;
  }

  async setUserStatusFlag(val: RollModStatus | undefined) {
    if (val === this.userStatus) {return;}
    if (!val || val === this.baseStatus) {
      await this.rollInstance.document.unsetFlag(...this.flagParams);
    } else {
      const lockedToGM = [
        RollModStatus.ForcedOn,
        RollModStatus.ForcedOff,
        RollModStatus.Hidden
      ];
      if (
        !game.user.isGM
        && (
          lockedToGM.includes(val)
          || (this.userStatus && lockedToGM.includes(this.userStatus))
        )
      ) {return;}
      await this.rollInstance.document.setFlag(...this.flagParams, val);
    }
    await socketlib.system.executeForEveryone("renderRollCollab", this.rollInstance.rollID);
  }

  get userStatus(): RollModStatus | undefined {
    return this.getUserStatusFlag();
  }

  set userStatus(val: RollModStatus | undefined) {
    this.setUserStatusFlag(val);
  }

  get sourceName(): string {return this._sourceName;}

  get isConditional(): boolean {
    return [
      ...this.conditionalRollTraits,
      ...this.autoRollTraits,
      ...this.participantRollTraits,
      ...this.conditionalRollTypes,
      ...this.autoRollTypes,
      ...this.participantRollTypes
    ].length > 0;
  }

  get isInInactiveBlock(): boolean {
    if (game.user.isGM) {
      return [RollModStatus.Hidden, RollModStatus.ForcedOff, RollModStatus.ToggledOff].includes(this.status)
        && (this.isConditional || [BladesItemType.ability].includes(this.modType as BladesItemType));
    }
    return [RollModStatus.ForcedOff, RollModStatus.ToggledOff].includes(this.status)
      && (this.isConditional || [BladesItemType.ability].includes(this.modType as BladesItemType));
  }

  get isPush(): boolean {
    return Boolean(U.lCase(this.name) === "push"
      || this.effectKeys.find((eKey) => eKey === "Is-Push"));
  }

  get isBasicPush(): boolean {return U.lCase(this.name) === "push";}

  get stressCost(): number {
    const costKeys = this.effectKeys.filter((key) => key.startsWith("Cost-Stress"));
    if (costKeys.length === 0) {return 0;}
    let stressCost = 0;
    costKeys.forEach((key) => {
      const [thisParam] = (key.split(/-/) ?? []).slice(1);
      const [_, valStr] = (/([A-Za-z]+)(\d*)/.exec(thisParam) ?? []).slice(1);
      stressCost += U.pInt(valStr);
    });
    return stressCost;
  }

  isValidForRollType() {
    switch (this.rollInstance.rollType) {
      case RollType.Action: {
        return true;
      }
      case RollType.Resistance:
      case RollType.Fortune:
      case RollType.IndulgeVice: {
        if (
          this.isPush
          || ["bargain", "setup", "assist", "potency"].includes(U.lCase(this.name))
        ) {
          return false;
        }
        return true;
      }
      default: return false as never;
    }
  }

  /**
   * Sets the conditional status of the roll instance.
   * @returns {boolean} - Returns false if the status is ForcedOn or ToggledOff, true if the status is Hidden.
   */
  setConditionalStatus(): boolean {
    // If the roll instance is not conditional, return false
    if (!this.isConditional) {return false;}

    // If any auto-Traits/Types apply, set status to ForcedOn and return false
    const autoTypesOrTraitsApply = this.autoRollTypes.includes(this.rollInstance.rollType)
      || (!this.rollInstance.rollTrait || this.autoRollTraits.includes(this.rollInstance.rollTrait));
    if (autoTypesOrTraitsApply) {
      this.heldStatus = RollModStatus.ForcedOn;
      return false;
    }

    // If any conditionalTypes apply and any conditionalTraits apply, set status to ToggledOff and return false
    const conditionalTypesOrTraitsApply = this.checkTypesOrTraits(
      this.conditionalRollTypes,
      this.conditionalRollTraits
    );
    if (conditionalTypesOrTraitsApply) {
      this.heldStatus = RollModStatus.ToggledOff;
      return false;
    }

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

    // If none of the above conditions apply, set status to Hidden and return true
    this.heldStatus = RollModStatus.Hidden;
    return true;
  }

  /**
   * Checks if any types or traits apply to the roll instance.
   * @param {AnyRollType[]} types The types to check.
   * @param {RollTrait[]} traits The traits to check.
   * @returns {boolean} - Returns true if any types or traits apply, false otherwise.
   */
  private checkTypesOrTraits(types: BladesRoll.AnyRollType[], traits: BladesRoll.RollTrait[]): boolean {
    const typesApply = Boolean((!this.rollInstance.isParticipantRoll && types.length === 0)
      || types.includes(this.rollInstance.rollType));
    const traitsApply = Boolean((!this.rollInstance.isParticipantRoll && traits.length === 0)
      || (this.rollInstance.rollTrait && traits.includes(this.rollInstance.rollTrait)));
    return typesApply && traitsApply;
  }

  /**
   * Helper function to process each key
   * @param {string} key The key to process
   * @returns {boolean} - Whether the processing was successful
   */
  private processKey(key: string): boolean {
    const [thisKey, thisParam] = key.split(/-/) ?? [];
    const positions = [Position.controlled, Position.risky, Position.desperate];
    if (positions.includes(U.lCase(thisParam) as Position) && this.rollInstance.finalPosition === U.lCase(thisParam)) {
      if (thisKey === "AutoRevealOn") {
        this.heldStatus = RollModStatus.ToggledOff;
        return true;
      } else if (thisKey === "AutoEnableOn") {
        this.heldStatus = RollModStatus.ForcedOn;
        return true;
      }
    }
    return false;
  }

  setAutoStatus(): boolean {
    // Check for AutoRevealOn and AutoEnableOn
    const holdKeys = this.effectKeys.filter((key) => key.startsWith("Auto"));
    if (holdKeys.length === 0) {return false;}

    for (const key of holdKeys) {
      if (this.processKey(key)) {
        return false;
      }
    }

    this.heldStatus = RollModStatus.Hidden;
    return true;
  }

  setRelevancyStatus(): boolean {
    const holdKeys = this.effectKeys.filter((key) => /^Negate|^Increase/.test(key));
    if (holdKeys.length === 0) {return false;}

    const relevantKeys = holdKeys
      .filter((key) => {
        const [thisKey, thisParam] = key.split(/-/) ?? [];

        const negateOperations: Record<key, () => boolean> = {
          PushCost: () => this.rollInstance.isPushed(),
          PushCost0: () => this.rollInstance.isPushed(),
          Consequence: () => this.rollInstance.rollType === RollType.Resistance
            && Boolean(this.rollInstance.rollConsequence),
          HarmLevel: () => {
            if (this.rollInstance.rollType !== RollType.Resistance) {return false;}
            if (!this.rollInstance.rollConsequence?.type) {return false;}
            const {type: csqType} = this.rollInstance.rollConsequence;
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

        if (thisKey === "Negate") {
          if (Object.hasOwn(negateOperations, thisParam)) {
            return negateOperations[thisParam as KeyOf<typeof negateOperations>]();
          } else {
            throw new Error(`Unrecognized Negate parameter: ${thisParam}`);
          }
        } else if (thisKey === "Increase") {
          const [_, traitStr] = /(\w+)\d+/.exec(thisParam) ?? [];
          return this.rollInstance.isTraitRelevant(traitStr as BladesRoll.RollTrait);
        } else {
          throw new Error(`Unrecognized Function Key: ${thisKey}`);
        }
      });
    if (relevantKeys.length === 0) {
      this.heldStatus = RollModStatus.Hidden;
      return true;
    }
    return false;
  }

  setPayableStatus(): boolean {
    const holdKeys = this.effectKeys.filter((key) => key.startsWith("Cost"));
    if (holdKeys.length === 0) {return false;}

    const payableKeys = holdKeys
      .filter((key) => {
        const [thisParam] = (key.split(/-/) ?? []).slice(1);
        const [traitStr, valStr] = (/([A-Za-z]+)(\d*)/.exec(thisParam) ?? []).slice(1);
        const {rollPrimaryDoc} = this.rollInstance.rollPrimary ?? {};
        if (!BladesRollPrimary.IsDoc(rollPrimaryDoc)) {return false;}
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
    if (!this.isActive) {return;}

    const holdKeys = this.effectKeys.filter((key) => /^Negate|^Increase/.test(key));
    if (holdKeys.length === 0) {return;}

    holdKeys.forEach((key) => {
      // Console.log({key, split: key.split(/-/)})
      const [thisKey, thisParam] = key.split(/-/) ?? [];


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
        //     harmConsequence.resistTo = {
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

      if (thisKey === "Negate") {
        if (Object.hasOwn(negateOperations, thisParam)) {
          return negateOperations[thisParam as KeyOf<typeof negateOperations>]();
        } else {
          throw new Error(`Unrecognized Negate parameter: ${thisParam}`);
        }
      } else if (thisKey === "Increase") {
        const [_, traitStr] = /(\w+)\d+/.exec(thisParam) ?? [];
        return this.rollInstance.isTraitRelevant(traitStr as BladesRoll.RollTrait);
      } else {
        throw new Error(`Unrecognized Function Key: ${thisKey} (key: ${key})`);
      }
    });
  }

  get selectOptions(): Array<BladesSelectOption<string>> | null {
    if (this.modType !== "teamwork") {return null;}
    if (this.name === "Assist" || this.name === "Setup") {
      return this.rollInstance.rollParticipantSelectOptions[this.name];
    } else if (this.name.startsWith("Group_")) {
      return this.rollInstance.rollParticipantSelectOptions.Group;
    }
    return null;
  }

  get selectedParticipant(): BladesRollParticipant | null {
    if (this.modType !== "teamwork") {return null;}
    return this.rollInstance.getRollParticipant(this.section, this.name);
  }

  get tooltip() {
    let parsedTooltip = this._tooltip.replace(/%COLON%/g, ":");
    if (parsedTooltip.includes("%DOC_NAME%")) {
      parsedTooltip = parsedTooltip.replace(
        /%DOC_NAME%/g,
        this.selectedParticipant
          ? this.selectedParticipant.rollParticipantName
          : "an Ally"
      );
    }
    if (parsedTooltip.includes("@OPPOSITION_NAME@")) {
      parsedTooltip = parsedTooltip.replace(
        /@OPPOSITION_NAME@/g,
        this.rollInstance.rollOpposition
          ? this.rollInstance.rollOpposition.rollOppName
          : "Your Opposition"
      );
    }
    return parsedTooltip;
  }

  get sideString(): string | undefined {
    if (this._sideString) {return this._sideString;}
    if (this.selectedParticipant) {
      return this.selectedParticipant.rollParticipantName;
    }
    return undefined;
  }

  get allFlagData(): BladesRoll.FlagData {
    return this.rollInstance.document.getFlag("eunos-blades", "rollCollab") as BladesRoll.FlagData;
  }

  get data(): BladesRoll.RollModData {
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

  get costs(): BladesRoll.CostData[] | undefined {
    if (!this.isActive) {return undefined;}
    const holdKeys = this.effectKeys.filter((key) => key.startsWith("Cost"));
    if (holdKeys.length === 0) {return undefined;}

    return holdKeys.map((key) => {
      const [thisParam] = (key.split(/-/) ?? []).slice(1);
      const [traitStr, valStr] = (/([A-Za-z]+)(\d*)/.exec(thisParam) ?? []).slice(1);

      let label = this.name;
      if (this.isBasicPush) {
        if (this.posNeg === "negative") {
          label = `${this.name} (<span class='red-bright'>To Act</span>)`;
        } else {
          const effect = this.section === RollModSection.roll ? "+1d" : "+1 effect";
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

  id: string;

  name: string;

  _sourceName: string;

  baseStatus: RollModStatus;

  value: number;

  effectKeys: string[];

  _sideString?: string;

  _tooltip: string;

  posNeg: "positive" | "negative";

  modType: BladesRoll.ModType;

  conditionalRollTypes: BladesRoll.AnyRollType[];

  autoRollTypes: BladesRoll.AnyRollType[];

  participantRollTypes: BladesRoll.AnyRollType[];

  conditionalRollTraits: BladesRoll.RollTrait[];

  autoRollTraits: BladesRoll.RollTrait[];

  participantRollTraits: BladesRoll.RollTrait[];

  section: RollModSection;

  rollInstance: BladesRoll;

  constructor(modData: BladesRoll.RollModData, rollInstance: BladesRoll) {
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

class BladesRollPrimary implements BladesRoll.PrimaryDocData {

  // #region Static Methods ~
  static IsValidData(data: unknown): data is BladesRoll.PrimaryDocData {
    if (BladesRollPrimary.IsDoc(data)) {return true;}
    return U.isList(data)
      && typeof data.rollPrimaryName === "string"
      && typeof data.rollPrimaryType === "string"
      && typeof data.rollPrimaryImg === "string"
      && Array.isArray(data.rollModsData)
      && U.isList(data.rollFactors)
      && (!data.rollPrimaryID || typeof data.rollPrimaryID === "string")
      && (!data.rollPrimaryDoc || BladesRollPrimary.IsDoc(data.rollPrimaryDoc));
  }

  static IsDoc(doc: unknown): doc is BladesRoll.PrimaryDoc {
    return BladesActor.IsType(doc, BladesActorType.pc, BladesActorType.crew)
      || BladesItem.IsType(doc, BladesItemType.cohort_expert, BladesItemType.cohort_gang, BladesItemType.gm_tracker);
  }
  // #endregion

  rollInstance: BladesRoll;

  rollPrimaryID: string | undefined;

  _rollPrimaryDoc: BladesRoll.PrimaryDoc | undefined;

  get rollPrimaryDoc() {
    if (!this._rollPrimaryDoc) {
      let doc: unknown;
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

  get flagData(): BladesRoll.PrimaryDocData {
    return {
      rollPrimaryID: this.rollPrimaryID,
      rollPrimaryName: this.rollPrimaryName,
      rollPrimaryType: this.rollPrimaryType,
      rollPrimaryImg: this.rollPrimaryImg,
      rollModsData: this.rollModsData,
      rollFactors: this.rollFactors
    };
  }

  rollPrimaryName: string;

  rollPrimaryType: string;

  rollPrimaryImg: string;

  _rollModsData: BladesRoll.RollModData[];

  get rollModsData(): BladesRoll.RollModData[] {
    return this.rollPrimaryDoc?.rollModsData ?? this._rollModsData ?? [];
  }

  rollFactors: Partial<Record<Factor, BladesRoll.FactorData>>;

  get isWorsePosition(): boolean {
    if (this.rollPrimaryDoc) {
      return this.rollPrimaryDoc.getFlag("eunos-blades", "isWorsePosition") === true;
    }
    return false;
  }

  async applyHarm(amount: 1|2|3|4, name: string) {
    if (this.rollPrimaryDoc) {
      return this.rollPrimaryDoc.applyHarm(amount, name);
    }
  }

  async applyWorsePosition() {
    if (this.rollPrimaryDoc) {
      return this.rollPrimaryDoc.applyWorsePosition();
    }
  }

  // #region Constructor ~
  constructor(
    rollInstance: BladesRoll,
    {
      rollPrimaryID,
      rollPrimaryName,
      rollPrimaryType,
      rollPrimaryImg,
      rollModsData,
      rollFactors
    }: BladesRoll.PrimaryDocData) {
    // Identify ID, Doc, Name, SubName, Type & Image, to best of ability
    this.rollInstance = rollInstance;

    this.rollPrimaryID = rollPrimaryID
      ?? this.rollInstance.rollPrimary.rollPrimaryID
      ?? this.rollInstance.rollPrimary.rollPrimaryDoc?.rollPrimaryID;

    rollPrimaryName ??= this.rollInstance.rollPrimary.rollPrimaryName;
    rollPrimaryType ??= this.rollInstance.rollPrimary.rollPrimaryType;
    rollPrimaryImg ??= this.rollInstance.rollPrimary.rollPrimaryImg;
    rollModsData ??= this.rollInstance.rollPrimary.rollModsData;
    rollFactors ??= this.rollInstance.rollPrimary.rollFactors;

    if (BladesRollPrimary.IsDoc(this.rollPrimaryDoc)) {
      this.rollPrimaryName = rollPrimaryName ?? this.rollPrimaryDoc.rollPrimaryName;
      this.rollPrimaryType = this.rollPrimaryDoc.rollPrimaryType;
      this.rollPrimaryImg = rollPrimaryImg ?? this.rollPrimaryDoc.rollPrimaryImg ?? "";
      this._rollModsData = rollModsData ?? [];
      this.rollFactors = {
        ...this.rollPrimaryDoc.rollFactors,
        ...rollFactors ?? {}
      };
    } else {
      if (!rollPrimaryName) {throw new Error("Must include a rollPrimaryName when constructing a BladesRollPrimary object.");}
      if (!rollPrimaryImg) {throw new Error("Must include a rollPrimaryImg when constructing a BladesRollPrimary object.");}
      if (!rollPrimaryType) {throw new Error("Must include a rollPrimaryType when constructing a BladesRollPrimary object.");}
      if (!rollFactors) {throw new Error("Must include a rollFactors when constructing a BladesRollPrimary object.");}

      this.rollPrimaryName = rollPrimaryName;
      this.rollPrimaryType = rollPrimaryType;
      this.rollPrimaryImg = rollPrimaryImg;
      this._rollModsData = rollModsData ?? [];
      this.rollFactors = rollFactors;
    }
  }
  // #endregion
}

class BladesRollOpposition implements BladesRoll.OppositionDocData {

  // #region Static Methods ~
  static IsValidData(data: unknown): data is BladesRoll.OppositionDocData {
    if (BladesRollOpposition.IsDoc(data)) {return true;}
    return U.isList(data)
      && typeof data.rollOppName === "string"
      && typeof data.rollOppType === "string"
      && typeof data.rollOppImg === "string"
      && (!data.rollOppSubName || typeof data.rollOppSubName === "string")
      && (!data.rollOppModsData || Array.isArray(data.rollOppModsData))
      && U.isList(data.rollFactors)
      && (!data.rollOppID || typeof data.rollOppID === "string");
  }

  static GetDoc(docRef: unknown): BladesRoll.OppositionDoc | false {
    let doc: unknown = docRef;
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

  static IsDoc(doc: unknown): doc is BladesRoll.OppositionDoc {
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

  rollInstance: BladesRoll;

  _rollOppID: string | undefined;

  get rollOppID() {return this._rollOppID;}

  set rollOppID(val: string | undefined) {
    if (val) {
      const doc = BladesRollOpposition.GetDoc(val);
      if (doc) {
        this.rollOppDoc = doc;
      }
    }
    this._rollOppID = val;
  }

  rollOppDoc: BladesRoll.OppositionDoc | undefined;

  rollOppName: string;

  rollOppSubName?: string;

  rollOppType: string;

  rollOppImg: string;

  rollOppModsData: BladesRoll.RollModData[] | undefined;

  rollFactors: Partial<Record<Factor, BladesRoll.FactorData>>;

  // #region Constructor ~
  constructor(rollInstance: BladesRoll,
    {
      rollOppID,
      rollOppDoc,
      rollOppName,
      rollOppSubName,
      rollOppType,
      rollOppImg,
      rollOppModsData,
      rollFactors
    }: Partial<BladesRoll.OppositionDocData> = {}) {

    this.rollInstance = rollInstance;

    // Attempt to fetch an associated BladesActor or BladesItem document
    const doc = BladesRollOpposition.GetDoc(rollOppDoc ?? rollOppID ?? rollOppName);

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

    // Confirm required settings
    if (!rollOppName) {throw new Error("Must include a rollOppName when constructing a BladesRollOpposition object.");}
    if (!rollOppSubName) {throw new Error("Must include a rollOppSubName when constructing a BladesRollOpposition object.");}
    if (!rollOppType) {throw new Error("Must include a rollOppType when constructing a BladesRollOpposition object.");}
    if (!rollFactors) {throw new Error("Must include a rollFactors when constructing a BladesRollOpposition object.");}

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

  get flagParams() {
    return [C.SYSTEM_ID, "rollCollab.rollOppData"] as const;
  }

  get flagData(): BladesRoll.OppositionDocData {
    return {
      rollOppID: this.rollOppID,
      rollOppName: this.rollOppName,
      rollOppSubName: this.rollOppSubName,
      rollOppType: this.rollOppType,
      rollOppImg: this.rollOppImg,

      rollOppModsData: this.rollOppModsData,
      rollFactors: this.rollFactors
    };
  }

  async updateRollFlags() {
    await this.rollInstance.document.setFlag(...this.flagParams, this.flagData);
    socketlib.system.executeForEveryone("renderRollCollab", this.rollInstance.rollID);
  }

  refresh() {
    const rollOppFlags = this.rollInstance.flagData.rollOppData;
    if (rollOppFlags) {
      this.rollOppID = rollOppFlags.rollOppID;
      this.rollOppName = rollOppFlags.rollOppName;
      this.rollOppSubName = rollOppFlags.rollOppSubName;
      this.rollOppType = rollOppFlags.rollOppType;
      this.rollOppImg = rollOppFlags.rollOppImg;

      this.rollOppModsData = rollOppFlags.rollOppModsData;
      this.rollFactors = rollOppFlags.rollFactors;
    }
    return this;
  }

}

class BladesRollParticipant implements BladesRoll.ParticipantDocData {

  // #region Static Methods ~
  static IsValidData(data: unknown): data is BladesRoll.ParticipantDocData {
    if (BladesRollParticipant.IsDoc(data)) {return true;}
    return U.isList(data)
      && typeof data.rollParticipantName === "string"
      && typeof data.rollParticipantType === "string"
      && typeof data.rollParticipantIcon === "string"
      && (!data.rollParticipantModsData || Array.isArray(data.rollParticipantModsData))
      && U.isList(data.rollFactors)
      && (!data.rollParticipantID || typeof data.rollParticipantID === "string")
      && (!data.rollParticipantDoc || BladesRollParticipant.IsDoc(data.rollParticipantDoc));
  }

  static GetDoc(docRef: unknown): BladesRoll.ParticipantDoc | false {
    let doc: unknown = docRef;
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

  static IsDoc(doc: unknown): doc is BladesRoll.ParticipantDoc {
    return BladesActor.IsType(doc, BladesActorType.pc, BladesActorType.crew, BladesActorType.npc)
      || BladesItem.IsType(doc, BladesItemType.cohort_expert, BladesItemType.cohort_gang, BladesItemType.gm_tracker);
  }
  // #endregion

  rollInstance: BladesRoll;

  _rollParticipantID: string | undefined;

  get rollParticipantID() {return this._rollParticipantID;}

  set rollParticipantID(val: string | undefined) {
    if (val) {
      const doc = BladesRollParticipant.GetDoc(val);
      if (doc) {
        this.rollParticipantDoc = doc;
      }
    }
    this._rollParticipantID = val;
  }

  rollParticipantDoc: BladesRoll.ParticipantDoc | undefined;

  rollParticipantName: string;

  rollParticipantType: string;

  rollParticipantIcon: string;

  rollParticipantSection: BladesRoll.RollParticipantSection;

  rollParticipantSubSection: BladesRoll.RollParticipantSubSection;

  rollParticipantModsData: BladesRoll.RollModData[] | undefined; // As applied to MAIN roll when this participant involved

  rollFactors: Partial<Record<Factor, BladesRoll.FactorData>>;

  // #region Constructor ~
  constructor(rollInstance: BladesRoll,
    {
      rollParticipantSection,
      rollParticipantSubSection,
      rollParticipantID,
      rollParticipantDoc,
      rollParticipantName,
      rollParticipantType,
      rollParticipantIcon,
      rollParticipantModsData,
      rollFactors
    }: BladesRoll.ParticipantConstructorData) {

    this.rollInstance = rollInstance;

    if (!rollParticipantSection) {throw new Error("Must include a rollParticipantSection when constructing a BladesRollParticipant object.");}
    if (!rollParticipantSubSection) {throw new Error("Must include a rollParticipantSubSection when constructing a BladesRollParticipant object.");}
    this.rollParticipantSection = rollParticipantSection;
    this.rollParticipantSubSection = rollParticipantSubSection as BladesRoll.RollParticipantSubSection;

    // Attempt to fetch an associated BladesActor or BladesItem document
    const doc = BladesRollParticipant.GetDoc(rollParticipantDoc ?? rollParticipantID ?? rollParticipantName);

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

    // Confirm required settings
    if (!rollParticipantName) {throw new Error("Must include a rollParticipantName when constructing a BladesRollParticipant object.");}
    if (!rollParticipantType) {throw new Error("Must include a rollParticipantType when constructing a BladesRollParticipant object.");}
    if (!rollFactors) {throw new Error("Must include a rollFactors when constructing a BladesRollParticipant object.");}

    // Initialize properties
    this.rollParticipantID = rollParticipantID;
    this.rollParticipantName = rollParticipantName;
    this.rollParticipantType = rollParticipantType;
    this.rollParticipantIcon = rollParticipantIcon ?? "";
    this.rollParticipantModsData = rollParticipantModsData ?? [];
    this.rollFactors = rollFactors;
  }
  // #endregion


  get flagParams() {
    return [C.SYSTEM_ID, `rollCollab.rollParticipantData.${this.rollParticipantSection}.${this.rollParticipantSubSection}`] as const;
  }

  get flagData(): BladesRoll.ParticipantDocData & BladesRoll.ParticipantSectionData {
    return {
      rollParticipantSection: this.rollParticipantSection,
      rollParticipantSubSection: this.rollParticipantSubSection,

      rollParticipantID: this.rollParticipantID,
      rollParticipantName: this.rollParticipantName,
      rollParticipantType: this.rollParticipantType,
      rollParticipantIcon: this.rollParticipantIcon,

      rollParticipantModsData: this.rollParticipantModsData,
      rollFactors: this.rollFactors
    };
  }

  async updateRollFlags() {
    await this.rollInstance.document.setFlag(...this.flagParams, this.flagData);
    socketlib.system.executeForEveryone("renderRollCollab", this.rollInstance.rollID);
  }

  refresh() {
    const rollParticipantFlagData = this.rollInstance.flagData.rollParticipantData?.[this.rollParticipantSection];
    if (rollParticipantFlagData) {
      const rollParticipantFlags = rollParticipantFlagData[
        this.rollParticipantSubSection as KeyOf<typeof rollParticipantFlagData>
      ] as Omit<BladesRoll.ParticipantDocData, "rollParticipantDoc"> & BladesRoll.ParticipantSectionData
        | undefined;
      if (rollParticipantFlags) {
        this.rollParticipantID = rollParticipantFlags.rollParticipantID;

        this.rollParticipantName = rollParticipantFlags.rollParticipantName;
        this.rollParticipantType = rollParticipantFlags.rollParticipantType;
        this.rollParticipantIcon = rollParticipantFlags.rollParticipantIcon;
        this.rollParticipantSection = rollParticipantFlags.rollParticipantSection;
        this.rollParticipantSubSection = rollParticipantFlags.rollParticipantSubSection;

        this.rollParticipantModsData = rollParticipantFlags.rollParticipantModsData;
        this.rollFactors = rollParticipantFlags.rollFactors;
      }
    }
    return this;
  }
}

class BladesRoll extends DocumentSheet {

  // #region STATIC METHODS: INITIALIZATION & DEFAULTS ~
  static override get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["eunos-blades", "sheet", "roll-collab", game.user.isGM ? "gm-roll-collab" : ""],
      template: `systems/eunos-blades/templates/roll/roll-collab${game.user.isGM ? "-gm" : ""}.hbs`,
      submitOnChange: true,
      width: 500,
      dragDrop: [
        {dragSelector: null, dropSelector: "[data-action='gm-drop-opposition'"}
      ]
      // Height: 500
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
    socketlib.system.register("constructRollCollab", BladesRoll.ConstructRollCollab);
    socketlib.system.register("renderRollCollab", BladesRoll.RenderRollCollab);
    socketlib.system.register("closeRollCollab", BladesRoll.CloseRollCollab);
  }

  static get DefaultRollMods(): BladesRoll.RollModData[] {
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

  static get DefaultFlagData(): Omit<BladesRoll.FlagData, "rollUserID" | "rollPrimaryData" | "rollID" | "rollType" | "userPermissions"> {
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

  // #region STATIC METHODS: New Roll Creation ~
  static Current: Record<string, BladesRoll> = {};

  static _Active?: BladesRoll;

  static get Active(): BladesRoll | undefined {
    if (BladesRoll._Active) {return BladesRoll._Active;}
    if (U.objSize(BladesRoll.Current) > 0) {return U.getLast(Object.values(BladesRoll.Current));}
    return undefined;
  }

  static set Active(val: BladesRoll | undefined) {
    BladesRoll._Active = val;
  }

  static async ConstructRollCollab({
    userID,
    rollID,
    rollPermission
  }: {userID: string, rollID: string, rollPermission: RollPermissions}) {
    const rollInst = new BladesRoll(userID, rollID, rollPermission);
    eLog.checkLog3("rollCollab", "ConstructRollCollab()", {params: {userID, rollID, rollPermission}, rollInst});
    BladesRoll._Active = rollInst;
    await rollInst._render(true);
  }

  static RenderRollCollab(rollID: string) {
    BladesRoll.Current[rollID]?.prepareRollParticipantData();
    BladesRoll.Current[rollID]?.render();
  }

  static async CloseRollCollab(rollID: string) {
    eLog.checkLog3("rollCollab", "CloseRollCollab()", {rollID});
    await BladesRoll.Current[rollID]?.close({rollID});
    // delete BladesRoll.Current[rollID];
  }

  static GetUserPermissions(config: BladesRoll.Config): Record<RollPermissions, string[]> {

    // === ONE === GET USER IDS

    // Get user ID of GM
    const GMUserID = game.users.find((user) => user.isGM)?.id;
    if (!GMUserID) {
      throw new Error("[BladesRoll.GetUserPermissions()] No GM found!");
    }

    // Get user IDs of players
    const playerUserIDs = game.users
      .filter((user) => BladesPC.IsType(user.character) && !user.isGM && typeof user.id === "string")
      .map((user) => user.id as string);

    // Prepare user ID permissions object
    const userIDs: Record<RollPermissions, string[]> = {
      [RollPermissions.GM]: [GMUserID],
      [RollPermissions.Primary]: [],
      [RollPermissions.Participant]: [],
      [RollPermissions.Observer]: []
    };

    // === TWO === DETERMINE PRIMARY USER(S)

    // Check RollPrimaryDoc to determine how to assign primary users
    const {rollPrimaryDoc} = config.rollPrimaryData;
    if (
      BladesPC.IsType(rollPrimaryDoc)
      && U.pullElement(playerUserIDs, rollPrimaryDoc.primaryUser?.id)
    ) {
      userIDs[RollPermissions.Primary].push(rollPrimaryDoc.primaryUser?.id as string);

    } else if (
      BladesCrew.IsType(rollPrimaryDoc)
    ) {
      userIDs[RollPermissions.Primary].push(...playerUserIDs);
    } else if (
      BladesItem.IsType(rollPrimaryDoc, BladesItemType.cohort_gang, BladesItemType.cohort_expert)
    ) {
      if (config.rollUserID === GMUserID) {
        userIDs[RollPermissions.Primary].push(...playerUserIDs);
      } else {
        userIDs[RollPermissions.Primary].push(config.rollUserID);
      }
    } else if (
      BladesGMTracker.IsType(rollPrimaryDoc)
    ) {
      userIDs[RollPermissions.Primary].push(GMUserID);
    }

    // === THREE === DETERMINE ROLL PARTICIPANT USER(S)


    // Check config.rollParticipantData to determine if roll starts with any participants
    if (config.rollParticipantData) {
      userIDs[RollPermissions.Participant].push(...getParticipantDocUserIDs(config.rollParticipantData, playerUserIDs));
    }

    // Finally, add remaining players as observers.
    userIDs[RollPermissions.Observer] = playerUserIDs
      .filter((uID) => !userIDs[RollPermissions.Participant].includes(uID));

    return userIDs;

    /**
     * Generates BladesRollParticipant documents from the provided schema data.
     * @param {BladesRoll.RollParticipantData} participantData
     */
    function getParticipantDocs(participantData: BladesRoll.RollParticipantData) {
      return Object.values(flattenObject(participantData))
        .map((pData) => {
          if (BladesRollParticipant.IsDoc(pData)) {
            return pData;
          }
          if (BladesRollParticipant.IsValidData(pData)) {
            if (BladesRollParticipant.IsDoc(pData.rollParticipantDoc)) {
              return pData.rollParticipantDoc;
            } else if (typeof pData.rollParticipantID === "string") {
              const pDoc = game.actors.get(pData.rollParticipantID) ?? game.items.get(pData.rollParticipantID);
              if (BladesRollParticipant.IsDoc(pDoc)) {
                return pDoc;
              }
            }
          }
          return null as never;
        });
    }

    /**
     * Returns the user ids of potential BladesRollParticipants defined in the provided data schema.
     * @param {BladesRoll.RollParticipantData} participantData
     * @param {string[]} unassignedIDs
     */
    function getParticipantDocUserIDs(
      participantData: BladesRoll.RollParticipantData,
      unassignedIDs: string[]
    ): string[] {
      return getParticipantDocs(participantData)
        .map((pDoc) => {
          if (
            BladesPC.IsType(pDoc) && typeof pDoc.primaryUser?.id === "string"
          ) {
            return pDoc.primaryUser.id;
          } else if (
            BladesCrew.IsType(pDoc)
            || BladesItem.IsType(pDoc, BladesItemType.cohort_gang, BladesItemType.cohort_expert)
          ) {
            return unassignedIDs;
          }
          return null as never;
        })
        .flat()
        .filter((pUser) => pUser !== null && !userIDs[RollPermissions.Primary].includes(pUser));
    }
  }

  static async PrepareActionRoll(rollID: string, config: BladesRoll.Config) {

    // Validate the rollTrait
    if (!(U.isInt(config.rollTrait) || U.lCase(config.rollTrait) in {...ActionTrait, ...Factor})) {
      throw new Error(`[PrepareActionRoll()] Bad RollTrait for Action Roll: ${config.rollTrait}`);
    }

    // Retrieve the roll users
    const userIDs = BladesRoll.GetUserPermissions(config);

    // Prepare roll user flag data
    const userFlagData: Record<string, RollPermissions> = {};
    (Object.entries(userIDs) as Array<[RollPermissions, string[]]>)
      .forEach(([rollPermission, idsArray]) => {
        for (const id of idsArray) {
          userFlagData[id] = rollPermission;
        }
      });

    // Prepare the flag data.
    const flagUpdateData: BladesRoll.FlagData = {
      ...BladesRoll.DefaultFlagData,
      ...pruneConfig(config as BladesRoll.Config & Record<string, unknown>),
      userPermissions: userFlagData,
      rollID
    };

    // Return flagData and roll users
    return {
      flagUpdateData,
      userIDs
    };

  }

  static async PrepareResistanceRoll(rollID: string, config: BladesRoll.Config) {

    // Validate consequenceData
    if (!config.resistanceData || !isValidConsequenceData(config.resistanceData?.consequence)) {
      eLog.error("rollCollab", "[PrepareResistanceRoll] Bad Roll Consequence Data.", config);
      throw new Error("[PrepareResistanceRoll()] Bad Consequence Data for Resistance Roll");
    }

    // Set rollTrait
    config.rollTrait = config.resistanceData.consequence.attribute;

    eLog.checkLog3("bladesRoll", "BladesRoll.PrepareResistanceRoll() [1]", {rollID, config});

    // Retrieve the roll users
    const userIDs = BladesRoll.GetUserPermissions(config);
    eLog.checkLog3("bladesRoll", "BladesRoll.PrepareResistanceRoll() [2]", {userIDs});

    // Prepare roll user flag data
    const userFlagData: Record<string, RollPermissions> = {};
    (Object.entries(userIDs) as Array<[RollPermissions, string[]]>)
      .forEach(([rollPermission, idsArray]) => {
        for (const id of idsArray) {
          userFlagData[id] = rollPermission;
        }
      });
    eLog.checkLog3("bladesRoll", "BladesRoll.PrepareResistanceRoll() [3]", {userFlagData});

    // Prepare the flag data.
    const flagUpdateData: BladesRoll.FlagData = {
      ...BladesRoll.DefaultFlagData,
      ...pruneConfig(config as BladesRoll.Config & Record<string, unknown>),
      userPermissions: userFlagData,
      rollID
    };
    eLog.checkLog3("bladesRoll", "BladesRoll.PrepareResistanceRoll() [4]", {flagUpdateData});

    // Return flagData and roll users
    return {
      flagUpdateData,
      userIDs
    };
  }

  static async PrepareFortuneRoll(rollID: string, config: BladesRoll.Config) {

    // Validate the rollTrait
    if (!(U.isInt(config.rollTrait) || U.lCase(config.rollTrait) in {...ActionTrait, ...AttributeTrait, ...Factor})) {
      throw new Error(`[PrepareFortuneRoll()] Bad RollTrait for Fortune Roll: ${config.rollTrait}`);
    }

    // Retrieve the roll users
    const userIDs = BladesRoll.GetUserPermissions(config);

    // Prepare roll user flag data
    const userFlagData: Record<string, RollPermissions> = {};
    (Object.entries(userIDs) as Array<[RollPermissions, string[]]>)
      .forEach(([rollPermission, idsArray]) => {
        for (const id of idsArray) {
          userFlagData[id] = rollPermission;
        }
      });

    // Prepare the flag data.
    const flagUpdateData: BladesRoll.FlagData = {
      ...BladesRoll.DefaultFlagData,
      ...pruneConfig(config as BladesRoll.Config & Record<string, unknown>),
      userPermissions: userFlagData,
      rollID
    };

    // Return flagData and roll users
    return {
      flagUpdateData,
      userIDs
    };

  }

  static async PrepareIndulgeViceRoll(rollID: string, config: BladesRoll.Config) {

    // If primary doc is given, derive rollTrait from that (i.e. lowest Attribute)
    const {rollPrimaryDoc} = config.rollPrimaryData;
    if (BladesPC.IsType(rollPrimaryDoc)) {
      const minAttrVal = Math.min(...Object.values(rollPrimaryDoc.attributes));
      config.rollTrait = U.sample(
        Object.values(AttributeTrait).filter((attr) => rollPrimaryDoc.attributes[attr] === minAttrVal)
      )[0];
    }
    if (!(U.isInt(config.rollTrait) || U.lCase(config.rollTrait) in AttributeTrait)) {
      throw new Error(`[PrepareIndulgeViceRoll()] Bad RollTrait for Indulge Vice Roll: ${config.rollTrait}`);
    }

    // Set other known config values
    config.rollDowntimeAction = DowntimeAction.IndulgeVice;

    // Retrieve the roll users
    const userIDs = BladesRoll.GetUserPermissions(config);

    // Prepare roll user flag data
    const userFlagData: Record<string, RollPermissions> = {};
    (Object.entries(userIDs) as Array<[RollPermissions, string[]]>)
      .forEach(([rollPermission, idsArray]) => {
        for (const id of idsArray) {
          userFlagData[id] = rollPermission;
        }
      });

    // Prepare the flag data.
    const flagUpdateData: BladesRoll.FlagData = {
      ...BladesRoll.DefaultFlagData,
      ...pruneConfig(config as BladesRoll.Config & Record<string, unknown>),
      userPermissions: userFlagData,
      rollID
    };

    // Return flagData and roll users
    return {
      flagUpdateData,
      userIDs
    };
  }

  /**
   * This static method accepts a partial version of the config options required
   * to build a BladesRoll instance, sets the requisite flags on the storage
   * document, then sends out a socket call to the relevant users to construct
   * and display the roll instance.
   *
   * @param {BladesRoll.ConstructorConfig} config The configuration object for the new roll.
   */
  static async NewRoll(config: BladesRoll.ConstructorConfig) {
    // If no rollType is provided, throw an error.
    if (!isRollType(config.rollType)) {
      throw new Error("[BladesRoll.NewRoll()] You must provide a valid rollType in the config object.");
    }

    // Get User document to serve as flag storage.
    const rollUser = game.users.get(config.rollUserID ?? game.user.id ?? "");
    if (!rollUser?.id) {
      throw new Error("[BladesRoll.NewRoll()] You must provide a valid rollUserID in the config object.");
    }
    eLog.checkLog3("bladesRoll", "BladesRoll.NewRoll() [1]", {config, rollUser});

    // If roll flag data is already on user.
    const flagData = rollUser.getFlag("eunos-blades", "rollCollab") as BladesRoll.FlagData | undefined;
    if (flagData) {
      const {rollID} = flagData;
      // If user is documenting a roll with a dialog window open, disallow starting a new roll.
      if ($(document).find(`.roll-collab-sheet .sheet-topper[data-roll-id='${rollID}']`)[0]) {
        throw new Error(`[BladesRoll.NewRoll()] User ${rollUser.name} already documenting live roll with ID '${rollID}'`);
      }

      // Otherwise, archive the existing roll and prepare for a new one by clearing the main rollCollab flag.
      await rollUser.setFlag("eunos-blades", `rollCollabArchive.${rollID}`, flagData);
      await rollUser.unsetFlag("eunos-blades", "rollCollab");
      eLog.checkLog3("bladesRoll", "BladesRoll.NewRoll() [2]", {userFlags: rollUser.flags});
    }

    // If no rollPrimaryData is provided, attempt to derive it from the rest of the config object
    let {rollPrimaryData} = config;
    if (!BladesRollPrimary.IsValidData(rollPrimaryData)) {
      let rollPrimarySourceData: BladesRoll.PrimaryDocData;
      // If the user is a player with a BladesPC character, assume that is rollPrimary.
      if (BladesPC.IsType(rollUser.character)) {
        rollPrimarySourceData = rollUser.character;
        rollPrimaryData = {
          rollPrimaryID: rollPrimarySourceData.rollPrimaryID,
          rollPrimaryName: rollPrimarySourceData.rollPrimaryName,
          rollPrimaryType: rollPrimarySourceData.rollPrimaryType,
          rollPrimaryImg: rollPrimarySourceData.rollPrimaryImg,
          rollModsData: rollPrimarySourceData.rollModsData,
          rollFactors: rollPrimarySourceData.rollFactors,
          applyHarm: rollPrimarySourceData.applyHarm,
          applyWorsePosition: rollPrimarySourceData.applyWorsePosition
        };
      }
    }
    if (!BladesRollPrimary.IsValidData(rollPrimaryData)) {
      throw new Error("[BladesRoll.NewRoll()] A valid source of PrimaryDocData must be provided to construct a roll.");
    }

    // Create a random ID for storing the roll instance
    const rID = randomID();

    // Derive user flag data depending on given roll type and subtype
    let userIDs: Record<RollPermissions, string[]>;
    let flagUpdateData: BladesRoll.FlagData;

    switch (config.rollType) {
      case RollType.Action: {
        ({userIDs, flagUpdateData} = await BladesRoll.PrepareActionRoll(
          rID,
          {
            ...config,
            rollUserID: rollUser.id,
            rollPrimaryData
          }
        ));
        break;
      }
      case RollType.Resistance: {
        eLog.checkLog3("bladesRoll", "BladesRoll.NewRoll() [3]");
        ({userIDs, flagUpdateData} = await BladesRoll.PrepareResistanceRoll(
          rID,
          {
            ...config,
            rollUserID: rollUser.id,
            rollPrimaryData
          }
        ));
        eLog.checkLog3("bladesRoll", "BladesRoll.NewRoll() [4] -> Resistance Roll Prepared", {userIDs, flagUpdateData});
        break;
      }
      case RollType.Fortune: {
        ({userIDs, flagUpdateData} = await BladesRoll.PrepareFortuneRoll(
          rID,
          {
            ...config,
            rollUserID: rollUser.id,
            rollPrimaryData
          }
        ));
        break;
      }
      case RollType.IndulgeVice: {
        ({userIDs, flagUpdateData} = await BladesRoll.PrepareIndulgeViceRoll(
          rID,
          {
            ...config,
            rollUserID: rollUser.id,
            rollPrimaryData
          }
        ));
        break;
      }
    }

    // Log the roll data
    eLog.checkLog3("bladesRoll", "BladesRoll.NewRoll()", {userIDs, flagUpdateData, rollPrimaryData: flagUpdateData.rollPrimaryData});

    // Store the roll data on the storage document
    await rollUser.setFlag(C.SYSTEM_ID, "rollCollab", flagUpdateData);

    // Send out socket calls to all users to see the roll.
    socketlib.system.executeForUsers("constructRollCollab",
      userIDs[RollPermissions.GM],
      {userID: rollUser.id, rollID: rID, rollPermission: RollPermissions.GM}
    );
    socketlib.system.executeForUsers("constructRollCollab",
      userIDs[RollPermissions.Primary],
      {userID: rollUser.id, rollID: rID, rollPermission: RollPermissions.Primary}
    );
    socketlib.system.executeForUsers("constructRollCollab",
      userIDs[RollPermissions.Observer],
      {userID: rollUser.id, rollID: rID, rollPermission: RollPermissions.Observer}
    );
    socketlib.system.executeForUsers("constructRollCollab",
      userIDs[RollPermissions.Participant],
      {userID: rollUser.id, rollID: rID, rollPermission: RollPermissions.Participant}
    );
  }
  // #endregion

  static ApplyChatListeners(html: JQuery<HTMLElement> | HTMLElement) {
    const html$ = $(html);
    const roll$ = html$.find(".blades-roll");
    if (!roll$[0]) {return;}
    const rollPhase = roll$.data("rollPhase") as RollPhase;
    eLog.checkLog3("rollCollab", "ApplyChatListeners", {html, roll$, rollPhase});
    if (rollPhase !== RollPhase.AwaitingConsequences) {return;}
    const rollId = roll$.data("rollId");
    if (!rollId) {throw new Error("No roll ID found in chat message.");}
    const rollInst = BladesRoll.Current[rollId];
    if (!rollInst) {
      html$.addClass("dead-roll");
      return;
    }

    html$.find("[data-action*='-consequence']").on({
      click: rollInst._handleConsequenceClick.bind(rollInst)
    });
  }

  // #region Constructor ~
  rollID: string;

  rollPermission: RollPermissions;

  _rollPrimary: BladesRollPrimary;

  _rollOpposition?: BladesRollOpposition;

  _rollParticipants?: BladesRoll.RollParticipantDocs;

  constructor(userID: string, rollID: string, rollPermission: RollPermissions) {
    const rollUser = game.users.get(userID);
    if (!rollUser) {
      throw new Error("[new BladesRoll()] Must provide a valid rollUser to roll.");
    }
    super(rollUser);
    this.rollID = rollID;
    this.rollPermission = rollPermission;
    const rollFlagData = rollUser.getFlag(C.SYSTEM_ID, "rollCollab") as BladesRoll.FlagData;
    this._rollPrimary = new BladesRollPrimary(this, rollFlagData.rollPrimaryData);
    if (rollFlagData.rollOppData) {
      this._rollOpposition = new BladesRollOpposition(this, rollFlagData.rollOppData);
    }
    if (rollFlagData.rollParticipantData) {
      this._rollParticipants = {};
      for (const [rollSection, rollParticipantList] of Object.entries(rollFlagData.rollParticipantData)) {
        if ([RollModSection.roll, RollModSection.position, RollModSection.effect]
          .includes(rollSection as RollModSection) && !U.isEmpty(rollParticipantList)) {
          const sectionParticipants: Record<string, BladesRollParticipant> = {};
          for (const [participantType, participantData] of Object.entries(rollParticipantList)) {
            sectionParticipants[participantType] = new BladesRollParticipant(
              this,
              participantData as BladesRoll.ParticipantConstructorData
            );
          }
          this._rollParticipants[rollSection as BladesRoll.RollParticipantSection] = sectionParticipants;
        }
      }
    }
    BladesRoll.Current[this.rollID] = this;
  }
  // #endregion


  async addRollParticipant(
    participantRef: BladesRollParticipant | BladesRoll.ParticipantDocData | string,
    rollSection: BladesRoll.RollParticipantSection,
    rollSubSection?: BladesRoll.RollParticipantSubSection
  ) {

    if (!rollSubSection) {
      /* Insert logic to determine from rollSection and number of existing Group_X members */
      rollSubSection = "Assist";
    }

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

    await rollParticipant.updateRollFlags();
    socketlib.system.executeForEveryone("renderRollCollab", this.rollID);
  }

  async removeRollParticipant(
    rollSection: BladesRoll.RollParticipantSection,
    rollSubSection: BladesRoll.RollParticipantSubSection
  ) {
    await this.clearFlagVal(`rollParticipantData.${rollSection}.${rollSubSection}`);
  }

  async updateUserPermission(
    _user: User,
    _permission: RollPermissions
  ) {
    /* Force-render roll with new permissions */
  }

  // #region Basic User Flag Getters/Setters ~
  get flagData(): BladesRoll.FlagData {
    if (!this.document.getFlag(C.SYSTEM_ID, "rollCollab")) {
      throw new Error("[get flags()] No RollCollab Flags Found on User Document");
    }
    return this.document.getFlag(C.SYSTEM_ID, "rollCollab") as BladesRoll.FlagData;
  }

  get rollPrimary(): BladesRollPrimary {
    return this._rollPrimary;
  }

  get rollPrimaryDoc(): BladesRoll.PrimaryDoc | undefined {
    if (BladesRollPrimary.IsDoc(this.rollPrimary.rollPrimaryDoc)) {
      return this.rollPrimary.rollPrimaryDoc;
    }
    if (BladesRollPrimary.IsDoc(this.rollPrimary)) {
      return this.rollPrimary;
    }
    return undefined;
  }

  get rollOpposition(): BladesRollOpposition | undefined {
    if (!this._rollOpposition && BladesRollOpposition.IsValidData(this.flagData.rollOppData)) {
      this._rollOpposition = new BladesRollOpposition(this, this.flagData.rollOppData);
    }
    return this._rollOpposition?.refresh();
  }

  set rollOpposition(val: BladesRollOpposition | undefined) {
    if (val === undefined) {
      this._rollOpposition = undefined;
    } else {
      this._rollOpposition = val;
      val.updateRollFlags();
    }
  }

  /**
   * This method prepares the roll participant data.
   * It iterates over the roll sections (roll, position, effect) and for each section,
   * it creates a new BladesRollParticipant instance for each participant in that section.
   * The created instances are stored in the rollParticipants object.
   */
  private prepareRollParticipantData(): void {
    const participantFlagData = this.flagData.rollParticipantData;
    if (!participantFlagData) {return;}

    const rollParticipants: BladesRoll.RollParticipantDocs = {};

    ([
      RollModSection.roll,
      RollModSection.position,
      RollModSection.effect
    ] as Array<KeyOf<BladesRoll.RollParticipantDocs>>).forEach((rollSection) => {
      const sectionFlagData = participantFlagData[rollSection] as ValOf<BladesRoll.RollParticipantFlagData> | undefined;
      if (sectionFlagData) {
        const sectionParticipants: Partial<Record<
          BladesRoll.RollParticipantSubSection,
          BladesRollParticipant
        >> = {};
        (Object.entries(sectionFlagData) as Array<[
          BladesRoll.RollParticipantSubSection,
          BladesRoll.RollParticipantData
        ]>).forEach(([subSection, subSectionFlagData]) => {
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

    this._rollParticipants = rollParticipants;
  }

  get rollParticipants(): BladesRoll.RollParticipantDocs | undefined {
    return this._rollParticipants;
  }


  getRollParticipant(
    section: RollModSection,
    subSection: string
  ): BladesRollParticipant | null {
    if (isParticipantSection(section) && isParticipantSubSection(subSection)) {
      const sectionData = this.rollParticipants?.[section];
      if (sectionData) {
        return sectionData[subSection as KeyOf<typeof sectionData>] ?? null;
      }
    }
    return null;
  }

  get rollParticipantSelectOptions(): Record<
    "Assist" | "Setup" | "Group",
    Array<BladesSelectOption<string>>
    > {
    const nonPrimaryPCs = BladesPC.All
      .filter((actor) => actor.hasTag(Tag.PC.ActivePC) && actor.id !== this.rollPrimary.rollPrimaryID)
      .map((actor) => ({value: actor.id, display: actor.name}));
    return {
      Assist: nonPrimaryPCs,
      Setup: nonPrimaryPCs,
      Group: nonPrimaryPCs
    };
  }

  get rollType(): RollType {return this.flagData.rollType;}

  get rollSubType(): RollSubType | undefined {return this.flagData.rollSubType;}

  set rollSubType(val: RollSubType | undefined) {
    this.setFlagVal("rollSubType", val);
  }

  get rollPhase(): RollPhase {
    return this.getFlagVal<RollPhase>("rollPhase") ?? RollPhase.Collaboration;
  }

  async setRollPhase(rollPhase: RollPhase) {
    await this.setFlagVal("rollPhase", rollPhase);
  }

  get rollDowntimeAction(): DowntimeAction | undefined {return this.flagData.rollDowntimeAction;}

  get rollTrait(): BladesRoll.RollTrait | undefined {return this.flagData.rollTrait;}

  _rollTraitValOverride?: number;

  get rollTraitValOverride(): number | undefined {return this._rollTraitValOverride;}

  set rollTraitValOverride(val: number | undefined) {this._rollTraitValOverride = val;}

  get rollTraitData(): NamedValueMax & {gmTooltip?: string, pcTooltip?: string} {
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

  get rollTraitOptions(): Array<{name: string, value: BladesRoll.RollTrait}> {
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

  get posEffectTrade(): "position" | "effect" | false {
    return this.flagData?.rollPosEffectTrade ?? false;
  }

  getFlagVal<T>(flagKey?: string): T | undefined {
    if (flagKey) {
      return this.document.getFlag(C.SYSTEM_ID, `rollCollab.${flagKey}`) as T | undefined;
    }
    return this.document.getFlag(C.SYSTEM_ID, "rollCollab") as T | undefined;
  }

  async setFlagVal(flagKey: string, flagVal: unknown, isRerendering = true) {
    await this.document.setFlag(C.SYSTEM_ID, `rollCollab.${flagKey}`, flagVal);
    if (isRerendering) {
      socketlib.system.executeForEveryone("renderRollCollab", this.rollID);
    }
  }

  async clearFlagVal(flagKey: string, isRerendering = true) {
    await this.document.unsetFlag(C.SYSTEM_ID, `rollCollab.${flagKey}`);
    if (isRerendering) {
      socketlib.system.executeForEveryone("renderRollCollab", this.rollID);
    }
  }


  get initialPosition(): Position {
    return this.getFlagVal<Position>("rollPositionInitial") ?? Position.risky;
  }

  set initialPosition(val: Position) {
    this.setFlagVal("rollPositionInitial", val ?? Position.risky);
  }

  get initialEffect(): Effect {
    return this.getFlagVal<Effect>("rollEffectInitial") ?? Effect.standard;
  }

  set initialEffect(val: Effect) {
    this.setFlagVal("rollEffectInitial", val);
  }

  get isApplyingConsequences(): boolean {
    if (this.rollType !== RollType.Action) {return false;}
    if (!this.rollResult) {return false;}
    if (![RollResult.partial, RollResult.fail].includes(this.rollResult as RollResult)) {return false;}
    return true;
  }

  // Get rollConsequence() --> For resistance rolls.
  get rollConsequence(): BladesRoll.ResistanceRollConsequenceData | undefined {
    return this.getFlagVal<BladesRoll.ResistanceRollConsequenceData>("resistanceData.consequence");
  }

  // #endregion

  // #region GETTERS: DERIVED DATA ~
  get finalPosition(): Position {
    return Object.values(Position)[U.clampNum(
      Object.values(Position)
        .indexOf(this.initialPosition)
      + this.getModsDelta(RollModSection.position)
      + (this.posEffectTrade === "position" ? 1 : 0)
      + (this.posEffectTrade === "effect" ? -1 : 0),
      [0, 2]
    )];
  }

  get finalEffect(): Effect {
    return Object.values(Effect)[U.clampNum(
      Object.values(Effect)
        .indexOf(this.initialEffect)
      + this.getModsDelta(RollModSection.effect)
      + (this.posEffectTrade === "effect" ? 1 : 0)
      + (this.posEffectTrade === "position" ? -1 : 0),
      [0, 4]
    )];
  }

  get finalResult(): number {
    return this.getModsDelta(RollModSection.result)
      + (this.flagData?.GMBoosts.Result ?? 0)
      + (this.tempGMBoosts.Result ?? 0);
  }

  get finalDicePool(): number {
    return Math.max(0, this.rollTraitData.value
      + this.getModsDelta(RollModSection.roll)
      + (this.flagData.GMBoosts.Dice ?? 0)
      + (this.tempGMBoosts.Dice ?? 0));
  }

  get isRollingZero(): boolean {
    return Math.max(0, this.rollTraitData.value
      + this.getModsDelta(RollModSection.roll)
      + (this.flagData.GMBoosts.Dice ?? 0)
      + (this.tempGMBoosts.Dice ?? 0)) <= 0;
  }

  _roll?: Roll;

  get roll(): Roll {
    this._roll ??= new Roll(`${this.isRollingZero ? 2 : this.finalDicePool}d6`, {});
    return this._roll;
  }

  get rollFactors(): Record<"source" | "opposition", Partial<Record<Factor, BladesRoll.FactorData>>> {


    const defaultFactors: Record<Factor, BladesRoll.FactorData> = {
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

    const mergedSourceFactors =
      U.objMerge(
        U.objMerge(
          defaultFactors,
          this.rollPrimary.rollFactors,
          {isMutatingOk: false}
        ),
        this.flagData.rollFactorToggles.source,
        {isMutatingOk: false}
      ) as Record<Factor, BladesRoll.FactorData>;

    const mergedOppFactors = this.rollOpposition
      ? U.objMerge(
        U.objMerge(
          defaultFactors,
          this.rollOpposition.rollFactors,
          {isMutatingOk: false}
        ),
        this.flagData.rollFactorToggles.opposition,
        {isMutatingOk: false}
      ) as Record<Factor, BladesRoll.FactorData>
      : {};

    return {
      source: Object.fromEntries(
        (Object.entries(mergedSourceFactors) as Array<[Factor, BladesRoll.FactorData]>)
          .map(([factor, factorData]) => {
            factorData.value +=
              (this.flagData.GMBoosts[factor] ?? 0)
              + (this.tempGMBoosts[factor] ?? 0);
            if (factor === Factor.tier) {
              factorData.display = U.romanizeNum(factorData.value);
            } else {
              factorData.display = `${factorData.value}`;
            }
            return [factor, factorData];
          })
      ) as Record<Factor, BladesRoll.FactorData>,
      opposition: Object.fromEntries(
        (Object.entries(mergedOppFactors) as Array<[Factor, BladesRoll.FactorData]>)
          .map(([factor, factorData]) => {
            factorData.value += this.flagData.GMOppBoosts[factor] ?? 0;
            if (factor === Factor.tier) {
              factorData.display = U.romanizeNum(factorData.value);
            } else {
              factorData.display = `${factorData.value}`;
            }
            return [factor, factorData];
          })
      ) as Record<Factor, BladesRoll.FactorData>
    };
  }
  // #endregion

  // #region ROLL MODS: Getters & Update Method ~

  initRollMods(modsData: BladesRoll.RollModData[]) {
    // Reset override values previously enabled by rollmods
    this.rollTraitValOverride = undefined;
    this.rollFactorPenaltiesNegated = {};
    this.tempGMBoosts = {};

    this.rollMods = modsData.map((modData) => new BladesRollMod(modData, this));

    const initReport: Record<string, BladesRollMod[]> = {};

    /* *** PASS ZERO: ROLLTYPE VALIDATION PASS *** */
    this.rollMods = this.rollMods.filter((rollMod) => rollMod.isValidForRollType());

    /* *** PASS ONE: DISABLE PASS *** */
    this.rollMods
      // ... Conditional Status Pass
      .filter((rollMod) => !rollMod.setConditionalStatus())
      // ... AutoReveal/AutoEnable Pass
      .filter((rollMod) => !rollMod.setAutoStatus())
      // ... Payable Pass
      .forEach((rollMod) => {rollMod.setPayableStatus();});

    /* *** PASS TWO: FORCE-ON PASS *** */
    const parseForceOnKeys = (mod: BladesRollMod) => {
      const holdKeys = mod.effectKeys.filter((key) => key.startsWith("ForceOn"));
      if (holdKeys.length === 0) {return;}

      while (holdKeys.length) {
        const thisTarget = holdKeys.pop()?.split(/-/)?.pop();
        if (thisTarget === "BestAction") {
          if (BladesPC.IsType(this.rollPrimaryDoc)) {
            this.rollTraitValOverride = Math.max(...Object.values(this.rollPrimaryDoc.actions));
          }
        } else {
          const [targetName, targetCat, targetPosNeg] = thisTarget?.split(/,/) as [string, RollModSection | undefined, "positive" | "negative" | undefined] | undefined ?? [];
          if (!targetName) {throw new Error(`No targetName found in thisTarget: ${thisTarget}.`);}
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
          if (!targetMod) {throw new Error(`No mod found matching ${targetName}/${targetCat}/${targetPosNeg}`);}
          if (!targetMod.isActive) {
            targetMod.heldStatus = RollModStatus.ForcedOn;
            parseForceOnKeys(targetMod);
          } else {
            targetMod.heldStatus = RollModStatus.ForcedOn;
          }
        }
      }
    };
    this.getActiveRollMods().forEach((rollMod) => parseForceOnKeys(rollMod));

    /* *** PASS THREE: PUSH-CHECK PASS *** */

    // IF ROLL FORCED ...
    if (this.isForcePushed()) {
      // ... Force Off _ALL_ visible, inactive "Is-Push" mods.
      this.getInactivePushMods()
        .filter((mod) => !mod.isBasicPush)
        .forEach((mod) => {mod.heldStatus = RollModStatus.ForcedOff;});
    }

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
      } else {
        // Otherwise, hide all Is-Push mods
        this.getInactivePushMods(cat)
          .filter((mod) => !mod.isBasicPush)
          .forEach((mod) => {mod.heldStatus = RollModStatus.Hidden;});
      }
    });

    /* *** PASS FOUR: Relevancy Pass *** */

    this.getVisibleRollMods()
      .forEach((mod) => {mod.setRelevancyStatus();});

    /* *** PASS FIVE: Overpayment Pass *** */

    // ... If 'Cost-SpecialArmor' active, ForceOff other visible Cost-SpecialArmor mods
    const activeArmorCostMod = this.getActiveRollMods().find((mod) => mod.effectKeys.includes("Cost-SpecialArmor"));
    if (activeArmorCostMod) {
      this.getVisibleRollMods()
        .filter((mod) => !mod.isActive && mod.effectKeys.includes("Cost-SpecialArmor"))
        .forEach((mod) => {mod.heldStatus = RollModStatus.ForcedOff;});
    }

    eLog.checkLog2("rollMods", "*** initRollMods() PASS ***", initReport);
  }

  isTraitRelevant(trait: BladesRoll.RollTrait): boolean {
    if (trait in Factor) {
      const {source, opposition} = this.rollFactors;
      return Boolean(trait in source && trait in opposition && source[trait as Factor]?.isActive);
    }
    return false;
  }

  get isParticipantRoll() {
    return (this.rollType === RollType.Fortune && !game.user.isGM)
      || (this.rollSubType === RollSubType.GroupParticipant);
  }

  rollFactorPenaltiesNegated: Partial<Record<Factor, boolean>> = {};

  negateFactorPenalty(factor: Factor) {
    this.rollFactorPenaltiesNegated[factor] = true;
  }

  tempGMBoosts: Partial<Record<"Dice" | Factor | "Result", number>> = {};

  isPushed(cat?: RollModSection, posNeg?: "positive" | "negative"): boolean {return this.getActiveBasicPushMods(cat, posNeg).length > 0;}

  hasOpenPush(cat?: RollModSection, posNeg?: "positive" | "negative"): boolean {return this.isPushed(cat) && this.getOpenPushMods(cat, posNeg).length > 0;}

  isForcePushed(cat?: RollModSection, posNeg?: "positive" | "negative"): boolean {return this.isPushed(cat) && this.getForcedPushMods(cat, posNeg).length > 0;}


  get rollCosts(): number {
    if (!this.isPushed) {return 0;}
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

  get rollCostData(): BladesRoll.CostData[] {
    return this.getActiveRollMods()
      .map((rollMod) => rollMod.costs ?? [])
      .flat();
  }

  getRollModByName(name: string, cat?: RollModSection, posNeg?: "positive" | "negative"): BladesRollMod | undefined {
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
    if (modMatches.length === 0) {return undefined;}
    if (modMatches.length > 1) {
      return undefined;
    }
    return modMatches[0];
  }

  getRollModByID(id: string) {return this.rollMods.find((rollMod) => rollMod.id === id);}

  getRollMods(cat?: RollModSection, posNeg?: "positive" | "negative") {
    return this.rollMods.filter((rollMod) =>
      (!cat || rollMod.section === cat)
      && (!posNeg || rollMod.posNeg === posNeg));
  }

  getVisibleRollMods(cat?: RollModSection, posNeg?: "positive" | "negative") {
    return this.getRollMods(cat, posNeg).filter((rollMod) => rollMod.isVisible);
  }

  getActiveRollMods(cat?: RollModSection, posNeg?: "positive" | "negative") {
    return this.getRollMods(cat, posNeg).filter((rollMod) => rollMod.isActive);
  }

  getVisibleInactiveRollMods(cat?: RollModSection, posNeg?: "positive" | "negative") {
    return this.getVisibleRollMods(cat, posNeg).filter((rollMod) => !rollMod.isActive);
  }

  getPushMods(cat?: RollModSection, posNeg?: "positive" | "negative") {
    return this.getRollMods(cat, posNeg).filter((rollMod) => rollMod.isPush);
  }

  getVisiblePushMods(cat?: RollModSection, posNeg?: "positive" | "negative") {
    return this.getPushMods(cat, posNeg).filter((rollMod) => rollMod.isVisible);
  }

  getActivePushMods(cat?: RollModSection, posNeg?: "positive" | "negative") {
    return this.getVisiblePushMods(cat, posNeg).filter((rollMod) => rollMod.isActive);
  }

  getActiveBasicPushMods(cat?: RollModSection, posNeg?: "positive" | "negative") {
    return this.getActivePushMods(cat, posNeg).filter((rollMod) => rollMod.isBasicPush);
  }

  getInactivePushMods(cat?: RollModSection, posNeg?: "positive" | "negative") {
    return this.getVisiblePushMods(cat, posNeg).filter((rollMod) => !rollMod.isActive);
  }

  getInactiveBasicPushMods(cat?: RollModSection, posNeg?: "positive" | "negative") {
    return this.getInactivePushMods(cat, posNeg).filter((rollMod) => rollMod.isBasicPush);
  }

  getForcedPushMods(cat?: RollModSection, posNeg?: "positive" | "negative") {
    return this.getActivePushMods(cat, posNeg)
      .filter((rollMod) => rollMod.isBasicPush
        && rollMod.status === RollModStatus.ForcedOn);
  }

  getOpenPushMods(cat?: RollModSection, posNeg?: "positive" | "negative") {
    return this.getActivePushMods(cat, posNeg)
      .filter((rollMod) => rollMod.isBasicPush
        && rollMod.status === RollModStatus.ToggledOn);
  }


  getModsDelta = (cat: RollModSection) => {
    return U.sum([
      ...this.getActiveRollMods(cat, "positive").map((mod) => mod.value),
      ...this.getActiveRollMods(cat, "negative").map((mod) => -mod.value)
    ]);
  };

  _rollMods?: BladesRollMod[];

  /**
   * Compare function for sorting roll mods.
   * @param {BladesRollMod} modA First mod to compare.
   * @param {BladesRollMod} modB Second mod to compare.
   * @returns {number} - Comparison result.
   */
  private compareMods(modA: BladesRollMod, modB: BladesRollMod): number {
    // Define the order of mod names for sorting
    const modOrder = ["Bargain", "Assist", "Setup"];

    // Check for basic push
    if (modA.isBasicPush) {return -1;}
    if (modB.isBasicPush) {return 1;}

    // Check for active Bargain
    if (modA.name === "Bargain" && modA.isActive) {return -1;}
    if (modB.name === "Bargain" && modB.isActive) {return 1;}

    // Check for push
    if (modA.isPush) {return -1;}
    if (modB.isPush) {return 1;}

    // Check for mod name order
    const modAIndex = modOrder.indexOf(modA.name);
    const modBIndex = modOrder.indexOf(modB.name);
    if (modAIndex !== -1 && modBIndex !== -1) {
      return modAIndex - modBIndex;
    }

    // Default to alphabetical order
    return modA.name.localeCompare(modB.name);
  }

  get rollMods(): BladesRollMod[] {
    if (!this._rollMods) {throw new Error("[get rollMods] No roll mods found!");}
    return [...this._rollMods].sort((modA: BladesRollMod, modB: BladesRollMod) => this.compareMods(modA, modB));
  }

  set rollMods(val: BladesRollMod[]) {this._rollMods = val;}

  // #endregion

  // #region CONSEQUENCES: Getting, Accepting, Resisting

  private get _csqData(): BladesRoll.ConsequenceData[] {
    const csqData = this.flagData.consequenceData?.
      [this.finalPosition]?.
      [this.rollResult as RollResult.partial|RollResult.fail];
    if (csqData) {
      return Object.values(csqData);
    }
    return [];
  }

  getConsequenceByID(csqID: string): BladesRoll.ConsequenceData|false {
    return this._csqData.find((cData) => cData.id === csqID) ?? false;
  }

  get acceptedConsequences(): BladesRoll.AcceptedConsequenceData[] {
    if ([RollPhase.AwaitingConsequences, RollPhase.Complete].includes(this.rollPhase)) {
      return this._csqData.filter((cData) => cData.isAccepted === true) as BladesRoll.AcceptedConsequenceData[];
    }
    return [];
  }

  get unacceptedConsequences(): BladesRoll.ConsequenceData[] {
    if (this.rollPhase === RollPhase.AwaitingConsequences) {
      return this._csqData.filter((cData) => cData.isAccepted !== true);
    }
    return [];
  }


  // #endregion

  // #region *** GETDATA *** ~


  /**
   * Retrieve the data for rendering the base RollCollab sheet.
   * @returns {Promise<object>} The data which can be used to render the HTML of the sheet.
   */
  override async getData() {
    const context = super.getData();

    this.initRollMods(this.getRollModsData());
    this.rollMods.forEach((rollMod) => rollMod.applyRollModEffectKeys());

    const sheetData = this.getSheetData(
      this.getIsGM(),
      this.getRollCosts()
    );

    return {...context, ...sheetData};
  }

  /**
   * Gets the roll modifications data.
   * @returns {BladesRoll.RollModData[]} The roll modifications data.
   */
  private getRollModsData(): BladesRoll.RollModData[] {
    const defaultMods = [
      ...BladesRoll.DefaultRollMods,
      ...this.rollPrimary.rollModsData
    ];
    if (this.rollType === RollType.Action && this.rollPrimary.isWorsePosition) {
      defaultMods.push({
        id: "WorsePosition-negative-position",
        name: "Worse Position",
        section: RollModSection.position,
        base_status: RollModStatus.ForcedOn,
        posNeg: "negative",
        modType: "general",
        value: 1,
        effectKeys: [],
        tooltip: "<h1>Worse Position</h1><p>A <strong class='red-bright'>Consequence</strong> on a previous roll has worsened your <strong>Position</strong>.</p>"
      });
    }
    if (
      this.rollType === RollType.Action
      && this.acceptedConsequences.some((csq) => csq.type === ConsequenceType.ReducedEffect)
    ) {
      defaultMods.push({
        id: "ReducedEffect-negative-effect",
        name: "Reduced Effect",
        section: RollModSection.effect,
        base_status: RollModStatus.ForcedOn,
        posNeg: "negative",
        modType: "general",
        value: 1,
        effectKeys: [],
        tooltip: "<h1>Reduced Effect</h1><p>A <strong class='red-bright'>Consequence</strong> has worsened your <strong>Effect</strong>.</p>"
      });
    }
    if (this.rollOpposition?.rollOppModsData) {
      return [
        ...defaultMods,
        ...this.rollOpposition.rollOppModsData
      ];
    }
    return defaultMods;
  }

  /**
   * Determines if the user is a game master.
   * @returns {boolean} Whether the user is a GM.
   */
  private getIsGM(): boolean {
    return game.eunoblades.Tracker?.system.is_spoofing_player ? false : game.user.isGM;
  }

  /**
   * Gets the roll costs.
   * @returns {BladesRoll.CostData[]} The roll costs.
   */
  private getRollCosts(): BladesRoll.CostData[] {
    return this.getActiveRollMods()
      .map((rollMod) => rollMod.costs)
      .flat()
      .filter((costData): costData is BladesRoll.CostData => costData !== undefined);
  }

  /**
   * Filters the roll costs to retrieve stress costs.
   * @param {BladesRoll.CostData[]} rollCosts The roll costs.
   * @returns {BladesRoll.CostData[]} The stress costs.
   */
  private getStressCosts(rollCosts: BladesRoll.CostData[]): BladesRoll.CostData[] {
    return rollCosts.filter((costData) => costData.costType === "Stress");
  }

  /**
   * Calculates the total stress cost.
   * @param {BladesRoll.CostData[]} stressCosts The stress costs.
   * @returns {number} The total stress cost.
   */
  private getTotalStressCost(stressCosts: BladesRoll.CostData[]): number {
    return U.sum(stressCosts.map((costData) => costData.costAmount));
  }


  /**
   * Searches for any special armor roll costs.
   * @param {BladesRoll.CostData[]} rollCosts The roll costs.
   * @returns {BladesRoll.CostData[]} The stress costs.
   */
  private getSpecArmorCost(rollCosts: BladesRoll.CostData[]): BladesRoll.CostData | undefined {
    return rollCosts.find((costData) => costData.costType === "SpecialArmor");
  }

  /**
   * Constructs the sheet data.
   * @param {boolean} isGM If the user is a GM.
   * @param {BladesRoll.CostData[]} rollCosts The roll costs.
   * @returns {BladesRoll.SheetData} The constructed sheet data.
   */
  private getSheetData(
    isGM: boolean,
    rollCosts: BladesRoll.CostData[]
  ): BladesRoll.SheetData {
    const {
      flagData: rData,
      rollPrimary,
      rollTraitData,
      rollTraitOptions,
      finalDicePool,
      finalPosition,
      finalEffect,
      finalResult,
      rollMods,
      rollFactors
    } = this;
    if (!rollPrimary) {
      throw new Error("A primary roll source is required for BladesRoll.");
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
      rollParticipants: this.rollParticipants,
      rollParticipantOptions: this.rollParticipantSelectOptions,
      rollEffects: Object.values(Effect),
      rollTraitValOverride: this.rollTraitValOverride,
      rollFactorPenaltiesNegated: this.rollFactorPenaltiesNegated,


      posRollMods: Object.fromEntries(Object.values(RollModSection)
        .map((cat) => [cat, this.getRollMods(cat, "positive")])) as Record<RollModSection, BladesRollMod[]>,
      negRollMods: Object.fromEntries(Object.values(RollModSection)
        .map((cat) => [cat, this.getRollMods(cat, "negative")])) as Record<RollModSection, BladesRollMod[]>,
      hasInactiveConditionals: this.calculateHasInactiveConditionalsData(),

      rollFactors,
      ...this.calculateOddsHTML(finalDicePool, finalResult),
      costData: this.getCostsHTML(rollCosts)
    };

    const rollPositionData = this.calculatePositionData(finalPosition);
    const rollEffectData = this.calculateEffectData(isGM, finalEffect);
    const rollResultData = this.calculateResultData(isGM, finalResult);

    const GMBoostsData = this.calculateGMBoostsData(rData);

    const positionEffectTradeData = this.calculatePositionEffectTradeData();

    const userPermission = U.objFindKey(
      baseData.userPermissions,
      (v: string[]) => v.includes(game.user.id ?? "")
    );

    return {
      ...baseData,
      ...(this.rollPrimary.rollPrimaryDoc ? {rollPrimary: this.rollPrimary.rollPrimaryDoc} : {}),
      ...rollPositionData,
      ...rollEffectData,
      ...rollResultData,
      ...GMBoostsData,
      ...positionEffectTradeData,
      userPermission
    };
  }

  private calculatePositionData(finalPosition: Position) {
    return {
      rollPositions: Object.values(Position),
      rollPositionFinal: finalPosition
    };
  }

  private calculateEffectData(isGM: boolean, finalEffect: Effect) {
    return {
      rollEffects: Object.values(Effect),
      rollEffectFinal: finalEffect,
      isAffectingAfter: this.getVisibleRollMods(RollModSection.after).length > 0
        || (isGM && this.getRollMods(RollModSection.after).length > 0)
    };
  }

  private calculateResultData(isGM: boolean, finalResult: number) {
    return {
      rollResultFinal: finalResult,
      isAffectingResult: finalResult > 0
        || this.getVisibleRollMods(RollModSection.result).length > 0
        || (isGM && this.getRollMods(RollModSection.result).length > 0)
    };
  }

  private calculateGMBoostsData(flagData: BladesRoll.FlagData) {
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

  private calculateOddsHTML(
    diceTotal: number,
    finalResult: number
  ): {oddsHTMLStart: string, oddsHTMLStop: string} {
    if (this.rollType === RollType.Resistance) {
      return this.calculateOddsHTML_Resistance(diceTotal);
    }
    return this.calculateOddsHTML_Standard(diceTotal, finalResult);
  }

  /**
   * Calculate odds starting & ending HTML based on given dice total.
   * @param {number} diceTotal Total number of dice.
   * @param {number} finalResult
   * @returns {{oddsHTMLStart: string, oddsHTMLStop: string}} Opening & Closing HTML for odds bar display
   */
  private calculateOddsHTML_Standard(
    diceTotal: number,
    finalResult: number
  ): {oddsHTMLStart: string, oddsHTMLStop: string} {
    const oddsColors = {
      crit: "var(--blades-gold)",
      success: "var(--blades-white-bright)",
      partial: "var(--blades-grey)",
      fail: "var(--blades-black-dark)"
    };
    const odds = {...C.DiceOddsStandard[diceTotal]};

    if (finalResult < 0) {
      for (let i = finalResult; i < 0; i++) {
        oddsColors.crit = oddsColors.success;
        oddsColors.success = oddsColors.partial;
        oddsColors.partial = oddsColors.fail;
      }
    } else if (finalResult > 0) {
      for (let i = 0; i < finalResult; i++) {
        oddsColors.fail = oddsColors.partial;
        oddsColors.partial = oddsColors.success;
        oddsColors.success = oddsColors.crit;
      }
    }

    const resultElements: string[] = [];

    (Object.entries(odds).reverse() as Array<[KeyOf<typeof odds>, number]>).forEach(([result, chance]) => {
      if (chance === 0) {return;}
      resultElements.push(`<div class="odds-section" style="height: 100%; width: ${chance}%; background: ${oddsColors[result]};">&nbsp;</div>`);
    });

    return {
      oddsHTMLStart: [
        "<div class=\"roll-odds-section-container\">",
        ...resultElements
      ].join("\n"),
      oddsHTMLStop: "</div>"
    };
  }

  /**
   * Calculate odds starting & ending HTML based on given dice total.
   * @param {number} diceTotal Total number of dice.
   * @returns {{oddsHTMLStart: string, oddsHTMLStop: string}} Opening & Closing HTML for odds bar display
   */
  private calculateOddsHTML_Resistance(
    diceTotal: number
  ): {oddsHTMLStart: string, oddsHTMLStop: string} {
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
      "var(--blades-gold)", // -1
      "var(--blades-white)", // 0
      "var(--blades-red)", // 1
      "var(--blades-red)", // 2
      "var(--blades-red)", // 3
      "var(--blades-red)", // 4
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

    const resultElements: string[] = [];

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

    return {
      oddsHTMLStart: [
        "<div class=\"roll-odds-section-container\">",
        ...resultElements
      ].join("\n"),
      oddsHTMLStop: "</div>"
    };
  }


  /**
   * Calculate data for position and effect trade.
   * @returns {{canTradePosition: boolean, canTradeEffect: boolean}}
   */
  private calculatePositionEffectTradeData(): {canTradePosition: boolean, canTradeEffect: boolean} {
    const canTradePosition = this.posEffectTrade === "position" || (
      this.posEffectTrade === false
      && this.finalPosition !== Position.desperate
      && this.finalEffect !== Effect.extreme
    );
    const canTradeEffect = this.posEffectTrade === "effect" || (
      this.posEffectTrade === false
      && this.finalPosition !== Position.controlled
      && this.finalEffect !== Effect.zero
    );

    return {canTradePosition, canTradeEffect};
  }

  /**
   * Calculate data on whether there are any inactive conditionals.
   * @returns {Record<RollModSection, boolean>} - Data on inactive conditionals.
   */
  private calculateHasInactiveConditionalsData(): Record<RollModSection, boolean> {
    const hasInactive = {} as Record<RollModSection, boolean>;
    for (const section of Object.values(RollModSection)) {
      hasInactive[section] = this.getRollMods(section).filter((mod) => mod.isInInactiveBlock).length > 0;
    }
    return hasInactive;
  }

  getCostsHTML(rollCosts: BladesRoll.CostData[]) {
    switch (this.rollType) {
      case RollType.Action: {
        return this.parseActionRollCostsHTML(
          this.getStressCosts(rollCosts),
          this.getSpecArmorCost(rollCosts)
        );
      }
      case RollType.Resistance: {
        return this.parseResistanceRollCostsHTML(
          this.getStressCosts(rollCosts),
          this.getSpecArmorCost(rollCosts)
        );
      }
      case RollType.Fortune: {
        return this.parseFortuneRollCostsHTML();
      }
      case RollType.IndulgeVice: {
        return this.parseIndulgeViceRollCostsHTML();
      }
      default: return false as never;
    }
  }


  /**
   * Calculate data for costs of Action Roll.
   * @param {BladesRoll.CostData[]} stressCosts Array of stress costs.
   * @param {BladesRoll.CostData} [specArmorCost] Specific armor cost.
   * @returns {{footerLabel: string, tooltip: string} | undefined} - Costs data or undefined.
   */
  private parseActionRollCostsHTML(
    stressCosts: BladesRoll.CostData[],
    specArmorCost?: BladesRoll.CostData
  ): {footerLabel: string, tooltip: string} | undefined {
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

  private parseResistanceRollCostsHTML(
    stressCosts: BladesRoll.CostData[],
    specArmorCost?: BladesRoll.CostData
  ): {footerLabel: string, tooltip: string} | undefined {
    const footerLabelStrings: string[] = [
      "( Resisting Costs"
    ];
    if (specArmorCost) {
      footerLabelStrings.push("your <span class='cyan-bright'><strong>Special Armor</strong></span> )");
    } else {
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

  private parseFortuneRollCostsHTML(): {footerLabel: string, tooltip: string} | undefined {
    return {footerLabel: "Fortune Cost Label", tooltip: "Fortune Cost Tooltip"};
  }

  private parseIndulgeViceRollCostsHTML(): {footerLabel: string, tooltip: string} | undefined {
    return {footerLabel: "Indulge Vice Cost Label", tooltip: "Indulge Vice Cost Tooltip"};
  }
  // #endregion

  // #region *** EVALUATING ROLL *** ~

  // #region DICE ~
  _dieVals?: number[];

  get dieVals(): number[] {
    this._dieVals ??= (this.roll.terms as DiceTerm[])[0].results
      .map((result) => result.result)
      .sort()
      .reverse();
    return this._dieVals;
  }

  // Accounts for rolling zero dice by removing highest.
  get finalDieVals(): number[] {
    return this.isRollingZero ? this.dieVals.slice(1) : this.dieVals;
  }

  private getDieClass(val: number, i: number) {
    eLog.checkLog3("rollCollab", `getDieClass(${val}, ${i})`, {inst: this});
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

  get dieValsHTML(): string {
    eLog.checkLog3("rollCollab", "[get dieValsHTML()]", {roll: this, dieVals: this.dieVals});
    const dieVals = [...this.dieVals];
    const ghostNum = this.isRollingZero ? dieVals.shift() : null;


    if (this.rollType === RollType.Resistance) {
      return [
        ...dieVals.map((val, i) => `<span class='blades-die ${i === 0 ? "blades-die-resistance" : "blades-die-fail"} blades-die-${val}'><img src='systems/eunos-blades/assets/dice/faces/${val}.webp' /></span>`),
        ghostNum ? `<span class='blades-die blades-die-ghost blades-die-${ghostNum}'><img src='systems/eunos-blades/assets/dice/faces/${ghostNum}.webp' /></span>` : null
      ]
        .filter((val): val is string => typeof val === "string")
        .join("");
    } else {
      return [
        ...dieVals.map((val, i) => `<span class='blades-die ${this.getDieClass(val, i)} blades-die-${val}'><img src='systems/eunos-blades/assets/dice/faces/${val}.webp' /></span>`),
        ghostNum ? `<span class='blades-die blades-die-ghost blades-die-${ghostNum}'><img src='systems/eunos-blades/assets/dice/faces/${ghostNum}.webp' /></span>` : null
      ]
        .filter((val): val is string => typeof val === "string")
        .join("");
    }
  }
  // #endregion

  // #region RESULT GETTERS ~
  get isCritical(): boolean {
    return this.finalDieVals.filter((val) => val === 6).length >= 2;
  }

  get isSuccess(): boolean {
    return Boolean(!this.isCritical && this.finalDieVals.find((val) => val === 6));
  }

  get isPartial(): boolean {
    return Boolean(!this.isCritical && !this.isSuccess && this.finalDieVals.find((val) => val && val >= 4));
  }

  get isFail(): boolean {
    return !this.isCritical && !this.isSuccess && !this.isPartial;
  }

  get highestDieVal(): number {
    return this.finalDieVals[0];
  }

  get rollResult(): RollResult | number | false {

    if ([RollPhase.Collaboration, RollPhase.AwaitingRoll].includes(this.rollPhase)) {
      return false;
    }

    switch (this.rollType) {
      case RollType.Action:
      case RollType.Fortune: {
        if (this.isCritical) {return RollResult.critical;}
        if (this.isSuccess) {return RollResult.success;}
        if (this.isPartial) {return RollResult.partial;}
        return RollResult.fail;
      }
      case RollType.Resistance: { // Return stress cost of resisting
        if (this.isCritical) {return -1;}
        return 6 - this.highestDieVal;
      }
      case RollType.IndulgeVice: { // Return stress cleared from indulging
        return this.highestDieVal;
      }
    }

    return false as never;
  }
  // #endregion

  async resolveRoll() {
    await this.roll.evaluate({async: true});
    await this.setRollPhase(RollPhase.AwaitingConsequences);
    switch (this.rollType) {
      case RollType.Action: {
        if (this.isApplyingConsequences) {
          await this.setRollPhase(RollPhase.AwaitingConsequences);
        } else {
          await this.setRollPhase(RollPhase.Complete);
        }
        await this.outputRollToChat();
        if (this.rollPrimary.rollPrimaryDoc) {
          this.rollPrimary.rollPrimaryDoc.unsetFlag("eunos-blades", "isWorsePosition");
        }
        this.close();
        break;
      }
      case RollType.Resistance: {
        await this.setRollPhase(RollPhase.Complete);
        await this.outputRollToChat();
        this.close();
        break;
      }
    }
    if (this.isApplyingConsequences) {
      await this.setRollPhase(RollPhase.AwaitingConsequences);
    }
    eLog.checkLog3("rollCollab", "[resolveRoll()] After Evaluation, Before Chat", {roll: this, dieVals: this.dieVals});
  }
  // #endregion

  // #region *** INTERFACING WITH BLADESCHAT ***
  getSpeaker(chatSpeaker: PropertiesToSource<ChatSpeakerDataProperties>) {
    // Compare against rollPrimary and modify accordingly.
    const {rollPrimaryID, rollPrimaryName, rollPrimaryType, rollPrimaryDoc} = this.rollPrimary;

    chatSpeaker.alias = rollPrimaryName;

    if ([BladesItemType.cohort_gang, BladesItemType.cohort_expert].includes(rollPrimaryType as BladesItemType)) {
      chatSpeaker.actor = rollPrimaryDoc?.parent?.id ?? chatSpeaker.actor;
      if (rollPrimaryDoc?.parent instanceof BladesPC) {
        chatSpeaker.alias = `${chatSpeaker.alias} (${rollPrimaryDoc.parent.name})`;
      }
    } else if ([BladesItemType.gm_tracker, BladesItemType.score].includes(rollPrimaryType as BladesItemType)) {
      chatSpeaker.actor = null;
      chatSpeaker.alias = "The Gamemaster";
    } else if (rollPrimaryID) {
      chatSpeaker.actor = rollPrimaryID;
    }

    chatSpeaker.alias = `${chatSpeaker.alias} Rolls ...`;

    return chatSpeaker;
  }

  async getResultHTML() {
    return await renderTemplate(
      `systems/eunos-blades/templates/chat/roll-result-${U.lCase(this.rollType)}-roll.hbs`,
      this
    );
  }

  _chatMessageID?: string;

  _chatMessageTemp?: BladesChat;

  get chatMessage(): BladesChat | undefined {
    if (!this._chatMessageID) {return undefined;}
    return this._chatMessageTemp;
  }

  set chatMessage(val: BladesChat | undefined) {
    if (val && val.id) {
      this._chatMessageID = val.id;
      this._chatMessageTemp = val;
    }
  }

  async outputRollToChat() {
    const chatMessage = await BladesChat.ConstructRollOutput(this);
    this.chatMessage = chatMessage;
  }
  // #endregion

  // #region LISTENER FUNCTIONS ~


  async _handleConsequenceClick(event: ClickEvent) {
    const clickTarget$ = $(event.currentTarget);
    const csqParent$ = clickTarget$.closest(".comp.consequence-display-container");
    const csqID = csqParent$.data("csq-id");
    const chatElem$ = csqParent$.closest(".blades-roll");
    const chatID = chatElem$.data("chat-id");
    const chatMessage = game.messages.get(chatID);
    if (!chatMessage) { return; }
    const csqs = await BladesConsequence.GetFromChatMessage(chatMessage);
    const thisCsq = csqs.find((csq) => csq.id === csqID);
    if (!thisCsq) { return; }
    switch (clickTarget$.data("action")) {
      case "accept-consequence": return thisCsq.acceptConsequence();
      case "resist-consequence": return thisCsq.resistConsequence();
      case "armor-consequence": return thisCsq.resistArmorConsequence();
      case "special-armor-consequence": return thisCsq.resistSpecialArmorConsequence();
    }
    return undefined as never;
  }

  _toggleRollModClick(event: ClickEvent) {
    event.preventDefault();
    const elem$ = $(event.currentTarget);
    const id = elem$.data("id");
    const rollMod = this.getRollModByID(id);
    if (!rollMod) {throw new Error(`Unable to find roll mod with id '${id}'`);}

    switch (rollMod.status) {
      case RollModStatus.Hidden: rollMod.userStatus = RollModStatus.ForcedOff; return;
      case RollModStatus.ForcedOff: rollMod.userStatus = RollModStatus.ToggledOff; return;
      case RollModStatus.ToggledOff: rollMod.userStatus = RollModStatus.ToggledOn; return;
      case RollModStatus.ToggledOn: rollMod.userStatus = game.user.isGM
        ? RollModStatus.ForcedOn
        : RollModStatus.ToggledOff;
        return;
      case RollModStatus.ForcedOn: rollMod.userStatus = RollModStatus.Hidden; return;
      default: throw new Error(`Unrecognized RollModStatus: ${rollMod.status}`);
    }
  }

  /**
   * Handles setting of rollMod status via GM pop-out controls
   * @param {ClickEvent} event JQuery click event sent to listener.
   */
  _gmControlSet(event: ClickEvent) {
    event.preventDefault();
    if (!game.user.isGM) {return;}
    const elem$ = $(event.currentTarget);
    const id = elem$.data("id");
    const status = elem$.data("status");
    if (!isModStatus(status) && status !== "Reset") {return;}
    const rollMod = this.getRollModByID(id);

    if (rollMod) {
      rollMod.userStatus = status === "Reset" ? undefined : status;
    }
  }

  /**
   * Handles setting values via GM number line (e.g. roll factor boosts/modifications).
   * @param {ClickEvent} event JQuery click event sent to listener.
   */
  async _gmControlSetTargetToValue(event: ClickEvent) {
    event.preventDefault();
    if (!game.user.isGM) {return;}
    const elem$ = $(event.currentTarget);
    const target = elem$.data("target").replace(/flags\.eunos-blades\./, "");
    const value = elem$.data("value");

    await this.document.setFlag(C.SYSTEM_ID, target, value).then(() => socketlib.system.executeForEveryone("renderRollCollab", this.rollID));
  }

  async _gmControlCycleTarget(event: ClickEvent) {
    event.preventDefault();
    if (!game.user.isGM) {return;}
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
    eLog.checkLog3("gmControlCycleTarget", "gmControlCycleTarget", {flagTarget, curVal, cycleVals, curValIndex, newValIndex, newVal});
    await this.setFlagVal(flagTarget, newVal);
  }

  /**
   * Handles resetting value associated with GM number line on a right-click.
   * @param {ClickEvent} event JQuery context menu event sent to listener.
   */
  async _gmControlResetTarget(event: ClickEvent) {
    event.preventDefault();
    if (!game.user.isGM) {return;}
    const elem$ = $(event.currentTarget);
    const target = elem$.data("target").replace(/flags\.eunos-blades\./, "");

    await this.document.unsetFlag(C.SYSTEM_ID, target).then(() => socketlib.system.executeForEveryone("renderRollCollab", this.rollID));
  }

  /**
   * Handles setting of baseline rollPosition via GM button line
   * @param {ClickEvent} event JQuery click event sent to listener.
   */
  _gmControlSetPosition(event: ClickEvent) {
    event.preventDefault();
    if (!game.user.isGM) {return;}
    const elem$ = $(event.currentTarget);
    const position = elem$.data("status") as Position;
    this.initialPosition = position;
  }

  /**
   * Handles setting of baseline rollPosition via GM button line
   * @param {ClickEvent} event JQuery click event sent to listener.
   */
  _gmControlSetEffect(event: ClickEvent) {
    event.preventDefault();
    if (!game.user.isGM) {return;}
    const elem$ = $(event.currentTarget);
    const effect = elem$.data("status") as Effect;
    this.initialEffect = effect;
  }

  /**
   * Handles setting of Factor toggles: isActive, isPrimary, highFavorsPC, isDominant
   * @param {ClickEvent} event JQuery click event sent to listener.
   */
  async _gmControlToggleFactor(event: ClickEvent) {
    event.preventDefault();
    if (!game.user.isGM) {return;}
    const elem$ = $(event.currentTarget);
    const target = elem$.data("target");
    const value = !elem$.data("value");

    eLog.checkLog3("toggleFactor", "_gmControlToggleFactor", {event, target, value});

    const factorToggleData = this.document.getFlag(C.SYSTEM_ID, "rollCollab.rollFactorToggles") as Record<"source" | "opposition", Record<Factor, BladesRoll.FactorFlagData>>;

    const [thisSource, thisFactor, thisToggle] = target.split(/\./).slice(-3) as ["source" | "opposition", Factor, BladesRoll.FactorToggle];

    // If thisToggle is unrecognized, just toggle whatever value target points at
    if (!["isActive", "isPrimary", "isDominant", "highFavorsPC"].includes(thisToggle)) {
      await this.document.setFlag(C.SYSTEM_ID, `rollCollab.${target}`, value)
        .then(() => socketlib.system.executeForEveryone("renderRollCollab", this.rollID));
    }

    // Otherwise, first toggle targeted factor to new value
    factorToggleData[thisSource][thisFactor] = {
      ...factorToggleData[thisSource][thisFactor] ?? {display: ""},
      [thisToggle]: value
    };

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
            ...factorToggleData[otherSource][thisFactor] ?? {display: ""},
            isActive: value
          };
        }
        break;
      }
      default: break;
    }

    await this.document.setFlag(C.SYSTEM_ID, "rollCollab.rollFactorToggles", factorToggleData)
      .then(() => socketlib.system.executeForEveryone("renderRollCollab", this.rollID));
  }

  async _onSelectChange(event: SelectChangeEvent) {
    event.preventDefault();
    const elem = event.currentTarget;
    const {docType} = elem.dataset;
    if (elem.value !== "" && docType?.startsWith("BladesRollParticipant")) {
      const [_, section, subSection] = docType.split(".");
      await this.addRollParticipant(
        elem.value,
        section as BladesRoll.RollParticipantSection,
        subSection as BladesRoll.RollParticipantSubSection
      );
    } else {
      await U.EventHandlers.onSelectChange(this, event);
      socketlib.system.executeForEveryone("renderRollCollab", this.rollID);
    }
  }

  async _onTextInputBlur(event: InputChangeEvent) {
    await U.EventHandlers.onTextInputBlur(this, event);
    socketlib.system.executeForEveryone("renderRollCollab", this.rollID);
  }

  // Async _gmControlSelect(event: SelectChangeEvent) {
  //   event.preventDefault();
  //   const elem$ = $(event.currentTarget);
  //   const section = elem$.data("rollSection");
  //   const subSection = elem$.data("rollSubSection");
  //   const selectedOption = elem$.val();

  //   if (typeof selectedOption !== "string") { return; }
  //   if (selectedOption === "false") {
  //     await this.document.unsetFlag(C.SYSTEM_ID, `rollCollab.rollParticipantData.${section}.${subSection}`);
  //   }
  //   await this.addRollParticipant(selectedOption, section, subSection);

  // }

  get resistanceStressCost(): number {
    const dieVals = this.dieVals;
    if (this.rollResult === RollResult.critical) {return -1;}
    if (this.isRollingZero) {dieVals.shift();}
    return 6 - (dieVals.shift() ?? 0);
  }

  // #endregion
  // #region ACTIVATE LISTENERS ~
  override activateListeners(html: JQuery<HTMLElement>) {
    super.activateListeners(html);
    ApplyTooltipAnimations(html);
    ApplyConsequenceAnimations(html);

    // User-Toggleable Roll Mods
    html.find(".roll-mod[data-action='toggle']").on({
      click: this._toggleRollModClick.bind(this)
    });

    html.find("[data-action='tradePosition']").on({
      click: (event) => {
        const curVal = `${$(event.currentTarget).data("value")}`;
        if (curVal === "false") {
          this.document.setFlag(C.SYSTEM_ID, "rollCollab.rollPosEffectTrade", "effect").then(() => socketlib.system.executeForEveryone("renderRollCollab", this.rollID));
        } else {
          this.document.setFlag(C.SYSTEM_ID, "rollCollab.rollPosEffectTrade", false).then(() => socketlib.system.executeForEveryone("renderRollCollab", this.rollID));
        }
      }
    });
    html.find("[data-action='tradeEffect']").on({
      click: (event) => {
        const curVal = `${$(event.currentTarget).data("value")}`;
        if (curVal === "false") {
          this.document.setFlag(C.SYSTEM_ID, "rollCollab.rollPosEffectTrade", "position").then(() => socketlib.system.executeForEveryone("renderRollCollab", this.rollID));
        } else {
          this.document.setFlag(C.SYSTEM_ID, "rollCollab.rollPosEffectTrade", false).then(() => socketlib.system.executeForEveryone("renderRollCollab", this.rollID));
        }
      }
    });

    html.find("[data-action='roll']").on({
      click: () => this.resolveRoll()
    });

    html
      .find("select[data-action='player-select']")
      .on({change: this._onSelectChange.bind(this)});

    if (!game.user.isGM) {return;}

    // GM Controls
    html.on({
      focusin: () => {BladesRoll.Active = this;} // Set reference to top-most, focused roll.
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

    html
      .find("select[data-action='gm-select']")
      .on({change: this._onSelectChange.bind(this)});

    html
      .find("[data-action=\"gm-edit-consequences\"]")
      .on({click: () => BladesDialog.DisplayRollConsequenceDialog(this)});

    html
      .find("[data-action='gm-text-input']")
      .on({blur: this._onTextInputBlur.bind(this)});

  }
  // #endregion

  // #region OVERRIDES: _canDragDrop, _onDrop, _onSubmit, close, render ~
  override _canDragDrop() {
    return game.user.isGM;
  }

  override _onDrop(event: DragEvent) {
    const {type, uuid} = TextEditor.getDragEventData(event) as {type: "Actor" | "Item", uuid: string};
    const [id] = (new RegExp(`${type}\\.(.+)`).exec(uuid) ?? []).slice(1);
    const oppDoc = game[`${U.lCase(type)}s`].get(id);
    if (BladesRollOpposition.IsDoc(oppDoc)) {
      this.rollOpposition = new BladesRollOpposition(this, {rollOppDoc: oppDoc});
    }
  }

  override async _onSubmit(event: Event, {updateData}: FormApplication.OnSubmitOptions = {}) {
    const returnVal = await super._onSubmit(event, {updateData, preventClose: true});
    await socketlib.system.executeForEveryone("renderRollCollab", this.rollID);
    return returnVal;
  }

  override async close(options: FormApplication.CloseOptions & {rollID?: string} = {}) {

    if (options.rollID) {return super.close({});}
    // await this.document.setFlag(C.SYSTEM_ID, "rollCollab", null);
    socketlib.system.executeForEveryone("closeRollCollab", this.rollID);
    return undefined;
  }

  override render(force = false, options?: Application.RenderOptions<DocumentSheetOptions>) {
    if (!this.document.getFlag(C.SYSTEM_ID, "rollCollab")) {return this;}
    return super.render(force, options);
  }
  // #endregion

}

interface BladesRoll {
  get document(): User
}

// #region EXPORTS ~
export {BladesRollMod, BladesRollPrimary, BladesRollOpposition, BladesRollParticipant};
export default BladesRoll;
// #endregion
