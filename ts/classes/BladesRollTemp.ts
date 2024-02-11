// @ts-nocheck
/* eslint-disable @typescript-eslint/no-unused-vars */
// #region IMPORTS ~
import U from "../core/utilities";
import C, {BladesActorType, BladesItemType, BladesPhase, RollPermissions, RollType, RollSubType, RollModType, RollModStatus, RollModSection, ActionTrait, DowntimeAction, AttributeTrait, Position, Effect, Factor, RollResult, RollPhase, ConsequenceType, Tag} from "../core/constants";
import {BladesActor, BladesPC, BladesCrew} from "../documents/BladesActorProxy";
import {BladesItem, BladesGMTracker, BladesProject} from "../documents/BladesItemProxy";
import {ApplyTooltipAnimations, ApplyConsequenceAnimations} from "../core/gsap";
import BladesConsequence from "./BladesConsequence";
import BladesClockKey from "./BladesClocks";
import BladesDialog from "./BladesDialog";
import BladesChat from "./BladesChat";
import BladesTargetLink from "./BladesTargetLink";

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
 * Checks if the given section can contain BladesRollParticipant documents.
 * @param {RollModSection} section
 */
function isParticipantSection(section: RollModSection): section is BladesRoll.ParticipantSection & RollModSection {
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
function isParticipantSubSection(subSection: string): subSection is BladesRoll.ParticipantSubSection {
  if (subSection.startsWith("Group_")) {return true;}
  if (["Assist", "Setup"].includes(subSection)) {return true;}
  return false;
}
// #endregion
// #region Utility Functions ~


// #endregion

class BladesRollMod extends BladesTargetLink<BladesRollMod.Schema> {

  static override ApplySchemaDefaults<Schema = BladesRollMod.Schema>(
    schemaData: Partial<BladesRollMod.Schema>
  ): Schema {
    // Ensure all properties of Schema are provided
    if (!schemaData.name) {throw new Error("name is required for BladesRollMod.Schema");}
    return {
      key: `${schemaData.name}-positive-roll`,
      modType: RollModType.general,
      section: RollModSection.roll,
      posNeg: "positive",
      base_status: RollModStatus.Hidden,
      value: 1,
      tooltip: "",
      ...schemaData
    } as Schema;
  }

  static get GMOnlyModStatuses() {
    return [RollModStatus.ForcedOn, RollModStatus.ForcedOff, RollModStatus.Hidden];
  }

  protected static getSchemaFromStrings(mStrings: string[]): BladesRollMod.Schema {

    const nameString = U.pullElement(mStrings, (v) => typeof v === "string" && /^na/i.test(v));
    const nameVal = (typeof nameString === "string" && nameString.replace(/^.*:/, ""));
    if (!nameVal) {
      throw new Error(`RollMod Missing Name: '${mStrings.join("@")}'`);
    }

    const catString = U.pullElement(mStrings, (v) => typeof v === "string" && /^cat/i.test(v));
    const catVal = (typeof catString === "string" && catString.replace(/^.*:/, "")) as RollModSection | false;
    if (!catVal || !(catVal in RollModSection)) {
      throw new Error(`RollMod Missing Category: '${mStrings.join("@")}'`);
    }

    const posNegString = (U.pullElement(mStrings, (v) => typeof v === "string" && /^p/i.test(v)) || "posNeg:positive");
    const posNegVal = posNegString.replace(/^.*:/, "") as "positive" | "negative";

    return {
      key: `${nameVal}-${posNegVal}-${catVal}`,
      name: nameVal,
      section: catVal,
      posNeg: posNegVal,
      base_status: RollModStatus.ToggledOff,
      modType: RollModType.general,
      tooltip: "",
      value: 1,
      ...Object.fromEntries(
        mStrings.map(getModParameterKeyVal)
      )
    };

    function getModParameterKeyVal(mString: string) {
      const [keyString, valString] = mString.split(/:/) as [string, string];
      let val: string | string[] = /\|/.test(valString) ? valString.split(/\|/) : valString;
      let key: KeyOf<BladesRollMod.Schema>;

      if (/^stat/i.test(keyString)) {
        key = "base_status";
      } else if (/^val/i.test(keyString)) {
        key = "value";
      } else if (/^eff|^ekey/i.test(keyString)) {
        key = "effectKeys";
      } else if (/^side|^ss/i.test(keyString)) {
        key = "sideString";
      } else if (/^s.*ame/i.test(keyString)) {
        key = "source_name";
      } else if (/^tool|^tip/i.test(keyString)) {
        key = "tooltip";
      } else if (/^ty/i.test(keyString)) {
        key = "modType";
      } else if (/^c.{0,10}r?.{0,3}ty/i.test(keyString)) {
        key = "conditionalRollTypes";
      } else if (/^a.{0,3}r?.{0,3}y/i.test(keyString)) {
        key = "autoRollTypes";
      } else if (/^p.{0,10}r?.{0,3}y/i.test(keyString)) {
        key = "participantRollTypes";
      } else if (/^c.{0,10}r?.{0,3}tr/i.test(keyString)) {
        key = "conditionalRollTraits";
      } else if (/^a.{0,3}r?.{0,3}tr/i.test(keyString)) {
        key = "autoRollTraits";
      } else if (/^p.{0,10}r?.{0,3}tr/i.test(keyString)) {
        key = "participantRollTypes";
      } else {
        throw new Error(`Bad Roll Mod Key: ${keyString}`);
      }

      if (key === "base_status" && val === "Conditional") {
        val = RollModStatus.Hidden;
      }

      let valProcessed;
      if (["value"].includes(key)) {
        valProcessed = U.pInt(val);
      } else if (["effectKeys", "conditionalRollTypes", "autoRollTypes", "conditionalRollTraits", "autoRollTraits"].includes(key)) {
        valProcessed = [val].flat();
      } else {
        valProcessed = (val as string).replace(/%COLON%/g, ":");
      }

      return [key, valProcessed] as const;
    }
  }

  static ParseDocModsToSchemaSet(doc: BladesDoc): BladesRollMod.Schema[] {

    if (doc instanceof BladesChat) {
      throw new Error("BladesRollMod.ParseDocRollMods cannot be called on a BladesChat document.");
    }

    const {roll_mods} = doc.system;
    if (!roll_mods || roll_mods.length === 0) {return [];}

    return roll_mods
      .filter((elem) => Boolean(elem && typeof elem === "string"))
      .map((modString) => {
        return this.getSchemaFromStrings((modString as string).split(/@/));
      });
  }

  get status() {
    // USER STATUS of "ForcedOn", "ForcedOff", or "Hidden" trumps all other status values.
    if (this.userStatus && BladesRollMod.GMOnlyModStatuses.includes(this.userStatus)) {
      return this.userStatus;
    }

    // HELD STATUS of "ToggledOff" or "ToggledOn" can be overridden by User Status
    if (this.heldStatus && [RollModStatus.ToggledOff, RollModStatus.ToggledOn].includes(this.heldStatus)) {
      return this.userStatus ?? this.heldStatus;
    }

    // Otherwise, return the first status that is set out of held, user, and base.
    return this.heldStatus ?? this.userStatus ?? this.baseStatus;
  }

  get isActive() {return [RollModStatus.ToggledOn, RollModStatus.ForcedOn].includes(this.status);}

  get isVisible() {return this.status !== RollModStatus.Hidden;}

  // get flagParams() {
  //   return [C.SYSTEM_ID, `rollCollab.rollModsData.${this.id}`] as const;}

  // async setUserStatusFlag(val: RollModStatus | undefined) {
  // }

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
        && (this.isConditional || this.modType === RollModType.ability);
    }
    return [RollModStatus.ForcedOff, RollModStatus.ToggledOff].includes(this.status)
      && (this.isConditional || this.modType === RollModType.ability);
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
   * Checks if any types or traits apply to the roll instance.
   * @param {AnyRollType[]} types The types to check.
   * @param {RollTrait[]} traits The traits to check.
   * @returns {boolean} - Returns true if any types or traits apply, false otherwise.
   */
  protected checkTypesOrTraits(types: BladesRoll.AnyRollType[], traits: BladesRoll.RollTrait[]): boolean {

    const rollTypes = [this.rollInstance.rollType, this.rollInstance.rollSubType, this.rollInstance.rollDowntimeAction]
      .filter((rType): rType is BladesRoll.AnyRollType => Boolean(rType));

    const typesApply = (!this.rollInstance.isParticipantRoll && types.length === 0)
      || rollTypes.some((rType) => types.includes(rType));

    const traitsApply = (!this.rollInstance.isParticipantRoll && traits.length === 0)
      || (this.rollInstance.rollTrait && traits.includes(this.rollInstance.rollTrait));

    return Boolean(typesApply && traitsApply);
  }

  /**
   * Sets the conditional status of the roll mod instance.
   * @returns {boolean} - Returns false if the status is ForcedOn or ToggledOff, true if the status is Hidden.
   */
  setConditionalStatus(): boolean {
    // If the roll mod instance is not conditional, return false
    if (!this.isConditional) {return false;}

    // If any auto-Types apply, set status to ForcedOn and return false
    if (
      this.autoRollTypes.includes(this.rollInstance.rollType)
      || (this.rollInstance.rollSubType && this.autoRollTypes.includes(this.rollInstance.rollSubType))
      || (this.rollInstance.rollDowntimeAction && this.autoRollTypes.includes(this.rollInstance.rollDowntimeAction))
    ) {
      this.heldStatus = RollModStatus.ForcedOn;
      return false;
    }

    // If any auto-Traits apply, set status to ForcedOn and return false
    if (this.rollInstance.rollTrait && this.autoRollTraits.includes(this.rollInstance.rollTrait)) {
      this.heldStatus = RollModStatus.ForcedOn;
      return false;
    }

    // If any conditionalTypes or conditionalTraits apply, set status to ToggledOff and return false
    if (this.checkTypesOrTraits(this.conditionalRollTypes, this.conditionalRollTraits)) {
      this.heldStatus = RollModStatus.ToggledOff;
      return false;
    }

    // If this is a participant roll
    //   AND any participantTypes or participantTraits apply,
    // ... set status to ToggledOff and return false
    if (
      this.rollInstance.isParticipantRoll
      && this.checkTypesOrTraits(this.participantRollTypes, this.participantRollTraits)
    ) {
      this.heldStatus = RollModStatus.ToggledOff;
      return false;
    }

    // If none of the above conditions apply, set status to Hidden and return true
    this.heldStatus = RollModStatus.Hidden;
    return true;
  }
  /**
   * Sets the auto-reveal/enable status of the roll mod instance.
   * @returns {boolean} - Returns false if the status is ForcedOn or ToggledOff, true if the status is Hidden.
   */
  setAutoStatus(): boolean {
    // Check for AutoRevealOn and AutoEnableOn
    const holdKeys = this.effectKeys.filter((key) => key.startsWith("Auto"));
    if (holdKeys.length === 0) {return false;}

    for (const key of holdKeys) {
      const [thisKey, thisParam] = key.split(/-/) ?? [];

      if (U.lCase(thisParam) in Position && this.rollInstance.rollPositionFinal === U.lCase(thisParam)) {
        if (thisKey === "AutoRevealOn") {
          this.heldStatus = RollModStatus.ToggledOff;
          return false;
        } else if (thisKey === "AutoEnableOn") {
          this.heldStatus = RollModStatus.ForcedOn;
          return false;
        }
      }
    }

    this.heldStatus = RollModStatus.Hidden;
    return true;
  }
  /**
   * Sets the relevancy status of the roll mod instance (i.e. hides irrelevant rollMods).
   * @returns {boolean} - Returns true if mod is irrelevant and status is Hidden, false otherwise.
   */
  setRelevancyStatus(): boolean {
    const holdKeys = this.effectKeys.filter((key) => /^Negate|^Increase/.test(key));
    if (holdKeys.length === 0) {return false;}

    const relevantKeys = holdKeys
      .filter((key) => {
        const [thisKey, thisParam] = key.split(/-/) ?? [];
        if (thisKey === "Negate") {
          const negateOperations: Record<key, () => boolean> = {
            PushCost: () => this.rollInstance.isPushed(),
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
  /**
   * Sets the payable status of the roll mod instance (i.e. forces off rollMods the primary can't pay for).
   * @returns {boolean} - Returns true if mod is unpayable and status is ForcedOff, false otherwise.
   */
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
          case "Heat": {
            return (
              BladesPC.IsType(rollPrimaryDoc) && BladesCrew.IsType(rollPrimaryDoc.crew))
              || BladesCrew.IsType(rollPrimaryDoc
              );
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

    const holdKeyParams = this.effectKeys
      .filter((key) => /^Negate|^Increase/.test(key))
      .map((key) => key.split(/-/));
    if (holdKeyParams.length === 0) {return;}

    holdKeyParams.forEach(([key, param]) => {

      if (key === "Negate") {
        const negateOperations = {
          PushCost: () => {
            this.rollInstance.negatePushCost();
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
        if (Object.hasOwn(negateOperations, param)) {
          return negateOperations[param as KeyOf<typeof negateOperations>]();
        } else {
          throw new Error(`Unrecognized Negate parameter: ${param}`);
        }
      } else if (key === "Increase") {
        const [_, traitStr] = /(\w+)\d+/.exec(param) ?? [];
        return this.rollInstance.isTraitRelevant(traitStr as BladesRoll.RollTrait);
      } else {
        throw new Error(`Unrecognized Function Key: ${key} (key: ${key})`);
      }
    });
  }

  get selectOptions(): Array<BladesSelectOption<string>> | null {
    if (this.modType !== RollModType.teamwork) {return null;}
    if (this.name === "Assist" || this.name === "Setup") {
      return this.rollInstance.rollParticipantSelectOptions[this.name];
    } else if (this.name.startsWith("Group_")) {
      return this.rollInstance.rollParticipantSelectOptions.Group;
    }
    return null;
  }

  get selectedParticipant(): BladesRollParticipant | null {
    if (this.modType !== RollModType.teamwork) {return null;}
    return this.rollInstance.getRollParticipant(this.section, this.name);
  }

  get allFlagData(): BladesRoll.Data {
    return this.rollInstance.data;
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

  _rollInstance: BladesRoll;

  constructor(modData: BladesRollMod.Data, rollInstance: BladesRoll) {
    super(modData);
    this._rollInstance = rollInstance;
  }

  get rollInstance(): BladesRoll {return this._rollInstance;}
  get name(): string {return this.data.name;}
  get modType(): RollModType {return this.data.modType;}
  get sourceName(): string {return this.data.source_name ?? this.data.name;}
  get section(): RollModSection {return this.data.section;}
  get posNeg(): "positive" | "negative" {return this.data.posNeg;}

  get userStatus(): RollModStatus | undefined {return this.data.user_status;}
  set userStatus(val: RollModStatus | undefined) {
    if (val === this.userStatus) {return;}
    if (!val || val === this.baseStatus) {
      this.updateTarget("user_status", null)
        .then(this.rollInstance.renderRollCollab_SocketCall.bind(this.rollInstance));
    } else {
      if (!game.user.isGM
        && (BladesRollMod.GMOnlyModStatuses.includes(val)
          || (this.userStatus && BladesRollMod.GMOnlyModStatuses.includes(this.userStatus)))
      ) {
        return;
      }
      this.updateTarget("user_status", val)
        .then(this.rollInstance.renderRollCollab_SocketCall.bind(this.rollInstance));
    }
  }

  get baseStatus(): RollModStatus {return this.data.base_status;}
  get heldStatus(): RollModStatus | undefined {return this.data.held_status;}
  set heldStatus(val: RollModStatus | undefined) {
    if (val === this.heldStatus) {return;}
    if (!val) {
      this.updateTarget("held_status", null)
        .then(this.rollInstance.renderRollCollab_SocketCall.bind(this.rollInstance));
    } else {
      this.updateTarget("held_status", val)
        .then(this.rollInstance.renderRollCollab_SocketCall.bind(this.rollInstance));
    }
  }

  get value(): number {return this.data.value;}
  get effectKeys(): string[] {return this.data.effectKeys ?? [];}

  get sideString(): string | undefined {
    if (this.data.sideString) {return this.data.sideString;}
    if (this.selectedParticipant) {
      return this.selectedParticipant.rollParticipantName;
    }
    return undefined;
  }
  get tooltip() {
    let parsedTooltip = this.data.tooltip.replace(/%COLON%/g, ":");
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

  get conditionalRollTypes(): BladesRoll.AnyRollType[] {
    return this.data.conditionalRollTypes ?? [];
  }
  get autoRollTypes(): BladesRoll.AnyRollType[] {
    return this.data.autoRollTypes ?? [];
  }
  get participantRollTypes(): BladesRoll.AnyRollType[] {
    return this.data.participantRollTypes ?? [];
  }

  get conditionalRollTraits(): BladesRoll.RollTrait[] {
    return this.data.conditionalRollTraits ?? [];
  }
  get autoRollTraits(): BladesRoll.RollTrait[] {
    return this.data.autoRollTraits ?? [];
  }
  get participantRollTraits(): BladesRoll.RollTrait[] {
    return this.data.participantRollTraits ?? [];
  }
}

class BladesRollPrimary implements BladesRoll.PrimaryData {

  // #region Static Methods ~
  static IsValidData(data: unknown): data is BladesRoll.PrimaryData {
    if (BladesRollPrimary.IsDoc(data)) {return true;}
    return U.isList(data)
      && typeof data.rollPrimaryName === "string"
      && typeof data.rollPrimaryType === "string"
      && typeof data.rollPrimaryImg === "string"
      && Array.isArray(data.rollModsData)
      && U.isList(data.rollFactors)
      && (!data.rollPrimaryID || typeof data.rollPrimaryID === "string");
  }

  static GetDoc(docRef: unknown): BladesRoll.PrimaryDoc {
    let doc: unknown = docRef;
    if (typeof docRef === "string") {
      doc = game.actors.get(docRef)
        ?? game.items.get(docRef)
        ?? game.actors.getName(docRef)
        ?? game.items.getName(docRef);
    }
    if (BladesRollPrimary.IsDoc(doc)) {
      return doc;
    }
    throw new Error(`[BladesRollPrimary.GetDoc] Unable to resolve document reference. Provided reference: ${JSON.stringify(docRef)}`);
  }

  static IsDoc(doc: unknown): doc is BladesRoll.PrimaryDoc {
    return BladesActor.IsType(doc, BladesActorType.pc, BladesActorType.crew)
      || BladesItem.IsType(doc, BladesItemType.cohort_expert, BladesItemType.cohort_gang, BladesItemType.gm_tracker);
  }

  static #buildData(config: BladesRoll.Config): BladesRoll.PrimaryData {
    if (BladesRollPrimary.IsValidData(config.rollPrimaryData)) {
      return config.rollPrimaryData;
    }
    let rollPrimary: BladesRoll.PrimaryDoc;
    const rollUser = game.users.get(config.rollUserID ?? game.user.id);
    if ("target" in config && BladesRollPrimary.IsDoc(config.target)) {
      rollPrimary = config.target;
    } else if (BladesRollPrimary.IsDoc(rollUser?.character)) {
      rollPrimary = rollUser.character as BladesRoll.PrimaryDoc;
    } else {
      throw new Error("[BladesRollPrimary.BuildData()] A valid source of PrimaryData must be provided to construct a roll.");
    }

    return {
      rollPrimaryID: rollPrimary.rollPrimaryID,
      rollPrimaryName: rollPrimary.rollPrimaryName,
      rollPrimaryType: rollPrimary.rollPrimaryType,
      rollPrimaryImg: rollPrimary.rollPrimaryImg,
      rollPrimaryModsSchemaSet: rollPrimary.rollModsSchemaSet,
      rollFactors: rollPrimary.rollFactors
    };
  }

  static Build(config: BladesRoll.Config): BladesRollPrimary {
    return new BladesRollPrimary(this.#buildData(config));
  }
  // #endregion

  rollInstance?: BladesRoll;

  rollPrimaryID: IDString;

  _rollPrimaryDoc: BladesRoll.PrimaryDoc | undefined;
  get rollPrimaryDoc() {
    return (this._rollPrimaryDoc ??= BladesRollPrimary.GetDoc(this.rollPrimaryID));
  }

  get rollPrimaryName(): string { return this.rollPrimaryDoc.rollPrimaryName; }
  get rollPrimaryType(): BladesRoll.PrimaryType { return this.rollPrimaryDoc.rollPrimaryType; }
  get rollPrimaryImg(): string { return this.rollPrimaryDoc.rollPrimaryImg; }
  get rollPrimaryModsSchemaSet() { return this.rollPrimaryDoc.rollModsSchemaSet; }
  get rollFactors() { return this.rollPrimaryDoc.rollFactors; }

  get isWorsePosition(): boolean {
    if (this.rollPrimaryDoc) {
      return this.rollPrimaryDoc.getFlag("eunos-blades", "isWorsePosition") === true;
    }
    return false;
  }

  async applyHarm(amount: harmLevel, name: string) {
    if (this.rollPrimaryDoc) {
      return this.rollPrimaryDoc.applyHarm(amount, name);
    }
  }

  async applyWorsePosition() {
    if (this.rollPrimaryDoc) {
      return this.rollPrimaryDoc.applyWorsePosition();
    }
  }

  get hasArmor() {
    if (!this.rollPrimaryDoc) {return false;}
    if (this.rollPrimaryType === BladesActorType.pc) {
      const rollPrimaryDoc = this.rollPrimaryDoc as BladesPC;

      // Can PC spend normal armor?
      if (
        !rollPrimaryDoc.system.armor.checked.light
        && (
          rollPrimaryDoc.system.armor.active.light
          || rollPrimaryDoc.remainingLoad >= 2
        )
      ) {return true;}

      // Otherwise, can PC spend heavy armor?
      if (
        !rollPrimaryDoc.system.armor.checked.heavy
        && (
          rollPrimaryDoc.system.armor.active.heavy
          || rollPrimaryDoc.remainingLoad >= 3
        )
      ) {return true;}
    }
    if (BladesItem.IsType(this.rollPrimaryDoc, BladesItemType.cohort_gang, BladesItemType.cohort_expert)) {
      const {value, max} = this.rollPrimaryDoc.system.armor;
      return max - value > 1;
    }
    return false;
  }

  get hasSpecialArmor() {
    if (!this.rollPrimaryDoc) {return false;}
    if (!BladesPC.IsType(this.rollPrimaryDoc)) {return false;}
    if (!this.rollPrimaryDoc.system.armor.active.special) {return false;}
    if (this.rollPrimaryDoc.system.armor.checked.special) {return false;}
    return true;
  }

  async spendArmor(count: number) {
    if (this.hasArmor) {
      if (BladesPC.IsType(this.rollPrimaryDoc)) {
        const updateData = {
          "system.armor.checked.heavy": this.rollPrimaryDoc.system.armor.checked.heavy,
          "system.armor.checked.light": this.rollPrimaryDoc.system.armor.checked.light
        };
        while (count > 0) {
          if (updateData["system.armor.checked.light"]) {
            if (updateData["system.armor.checked.heavy"]) {
              throw new Error(`[BladesRollPrimary.spendArmor()] Cannot spend more armor (${count}) than PC has.`);
            }
            updateData["system.armor.checked.heavy"] = true;
          } else {
            updateData["system.armor.checked.light"] = true;
          }
          count--;
        }
      } else if (BladesItem.IsType(this.rollPrimaryDoc, BladesItemType.cohort_gang, BladesItemType.cohort_expert)) {
        await this.rollPrimaryDoc.update({"system.armor.value": this.rollPrimaryDoc.system.armor.value + count});
      }
    }
  }

  // #region Constructor ~
  constructor(
    rollPrimaryDoc: BladesRoll.PrimaryDoc
  )
  constructor(
    rollPrimaryData: BladesRoll.PrimaryData
  )
  constructor(
    rollInst: BladesRoll,
    rollPrimaryDoc: BladesRoll.PrimaryDoc
  )
  constructor(
    rollInst: BladesRoll,
    rollPrimaryData?: Partial<BladesRoll.PrimaryData>
  )
  constructor(...args: unknown[]) {

    let primaryDoc: BladesRoll.PrimaryDoc|false = false;

    if (args[0] instanceof BladesRoll) {
      this.rollInstance = args[0];
      args.shift();
    }
    if (BladesRollPrimary.IsDoc(args[0])) {
      primaryDoc = args[0];
    } else if (U.isList(args[0])) {
      if ("rollPrimaryID" in args[0]) {
        primaryDoc = BladesRollPrimary.GetDoc(args[0].rollPrimaryID);
      } else if ("rollPrimaryName" in args[0]) {
        primaryDoc = BladesRollPrimary.GetDoc(args[0].rollPrimaryName);
      }
    } else if (this.rollInstance) {
      primaryDoc = this.rollInstance.rollPrimary.rollPrimaryDoc ?? false;
    }

    if (!primaryDoc) {
      throw new Error(`[BladesRollPrimary.constructor] Failed to resolve primary document or data from provided arguments: ${JSON.stringify(args)}`);
    }

    this.rollPrimaryID = primaryDoc.rollPrimaryID;
    this._rollPrimaryDoc = primaryDoc;
  }
  // #endregion
}

class BladesRollOpposition implements BladesRoll.OppositionData {

  // #region Static Methods ~
  static IsValidData(data: unknown): data is BladesRoll.OppositionData {
    if (BladesRollOpposition.IsDoc(data)) {return true;}
    return U.isList(data)
      && typeof data.rollOppName === "string"
      && typeof data.rollOppType === "string"
      && typeof data.rollOppImg === "string"
      && (!data.rollOppSubName || typeof data.rollOppSubName === "string")
      && (!data.rollOppModsSchemaSet || Array.isArray(data.rollOppModsSchemaSet))
      && U.isList(data.rollFactors)
      && (!data.rollOppID || typeof data.rollOppID === "string");
  }

  static GetDoc(docRef: unknown): BladesRoll.OppositionDoc {
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
    throw new Error(`[BladesRollOpposition.GetDoc] Unable to resolve document reference. Provided reference: ${JSON.stringify(docRef)}`);
  }

  static IsDoc(doc: unknown): doc is BladesRoll.OppositionDoc {
    return BladesActor.IsType(doc,
      BladesActorType.npc,
      BladesActorType.faction
    ) || BladesItem.IsType(doc,
      BladesItemType.cohort_expert,
      BladesItemType.cohort_gang
    );
  }
  // #endregion

  rollInstance: BladesRoll;

  rollOppID: IDString;

  _rollOppDoc: BladesRoll.OppositionDoc | undefined;
  get rollOppDoc() {
    return (this._rollOppDoc ??= BladesRollOpposition.GetDoc(this.rollOppID));
  }

  get rollOppName(): string { return this.rollOppDoc.rollOppName; }
  get rollOppSubName(): string | undefined { return this.rollOppDoc.rollOppSubName; }
  get rollOppType(): BladesRoll.OppositionType { return this.rollOppDoc.rollOppType; }
  get rollOppImg(): string { return this.rollOppDoc.rollOppImg; }
  get rollOppModsSchemaSet() { return this.rollOppDoc.rollOppModsSchemaSet; }
  get rollFactors() { return this.rollOppDoc.rollFactors; }

  // #region Constructor ~
  constructor(
    rollInst: BladesRoll,
    rollOppDoc: BladesRoll.OppositionDoc
  )
  constructor(
    rollInst: BladesRoll,
    rollOppData?: Partial<BladesRoll.OppositionData>
  )
  constructor(...args: unknown[]) {

    let oppDoc: BladesRoll.OppositionDoc|false = false;

    if (args[0] instanceof BladesRoll) {
      this.rollInstance = args[0];
      args.shift();
    } else {
      throw new Error(`[BladesRollOpp.constructor] First argument is not an instance of BladesRoll. Received arguments: ${JSON.stringify(args)}`);
    }
    if (BladesRollOpposition.IsDoc(args[0])) {
      oppDoc = args[0];
    } else if (U.isList(args[0])) {
      if ("rollOppID" in args[0]) {
        oppDoc = BladesRollOpposition.GetDoc(args[0].rollOppID);
      } else if ("rollOppName" in args[0]) {
        oppDoc = BladesRollOpposition.GetDoc(args[0].rollOppName);
      }
    } else if (this.rollInstance) {
      oppDoc = this.rollInstance.rollOpposition?.rollOppDoc ?? false;
    }

    if (!oppDoc) {
      throw new Error(`[BladesRollOpp.constructor] Failed to resolve Opp document or data from provided arguments: ${JSON.stringify(args)}`);
    }

    this.rollOppID = oppDoc.rollOppID;
    this._rollOppDoc = oppDoc;
  }
  // #endregion

  async updateRollFlags() {
    if (!this.rollInstance) {return;}
    await this.rollInstance.updateTarget("rollOppData", this);
    socketlib.system.executeForEveryone("renderRollCollab_SocketCall", this.rollInstance.id);
  }
}

class BladesRollParticipant implements BladesRoll.ParticipantData {

  // #region Static Methods ~
  static IsValidData(data: unknown): data is BladesRoll.ParticipantData {
    if (BladesRollParticipant.IsDoc(data)) {return true;}
    return U.isList(data)
      && typeof data.rollParticipantName === "string"
      && typeof data.rollParticipantType === "string"
      && typeof data.rollParticipantIcon === "string"
      && (!data.rollParticipantModsSchemaSet || Array.isArray(data.rollParticipantModsSchemaSet))
      && U.isList(data.rollFactors)
      && (!data.rollParticipantID || typeof data.rollParticipantID === "string")
      && (!data.rollParticipantDoc || BladesRollParticipant.IsDoc(data.rollParticipantDoc));
  }

  static GetDoc(docRef: unknown): BladesRoll.ParticipantDoc {
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
    throw new Error(`[BladesRollParticipant.GetDoc] Unable to resolve document reference. Provided reference: ${JSON.stringify(docRef)}`);
  }

  static IsDoc(doc: unknown): doc is BladesRoll.ParticipantDoc {
    return BladesActor.IsType(doc, BladesActorType.pc, BladesActorType.crew, BladesActorType.npc)
      || BladesItem.IsType(doc, BladesItemType.cohort_expert, BladesItemType.cohort_gang, BladesItemType.gm_tracker);
  }
  // #endregion

  rollInstance: BladesRoll;

  rollParticipantID: IDString;

  rollParticipantSection: BladesRoll.ParticipantSection;

  rollParticipantSubSection: BladesRoll.ParticipantSubSection;

  _rollParticipantDoc: BladesRoll.ParticipantDoc | undefined;
  get rollParticipantDoc() {
    return (this._rollParticipantDoc ??= BladesRollParticipant.GetDoc(this.rollParticipantID));
  }

  get rollParticipantName(): string { return this.rollParticipantDoc.rollParticipantName; }
  get rollParticipantType(): BladesRoll.ParticipantType { return this.rollParticipantDoc.rollParticipantType; }
  get rollParticipantIcon(): string { return this.rollParticipantDoc.rollParticipantIcon; }
  get rollParticipantModsSchemaSet() { return this.rollParticipantDoc.rollParticipantModsSchemaSet; }
  get rollFactors() { return this.rollParticipantDoc.rollFactors; }

  get data(): BladesRoll.ParticipantData {
    return {
      rollParticipantID: this.rollParticipantID,
      rollParticipantName: this.rollParticipantName,
      rollParticipantType: this.rollParticipantType,
      rollParticipantIcon: this.rollParticipantIcon,
      rollParticipantModsSchemaSet: this.rollParticipantModsSchemaSet,
      rollFactors: this.rollFactors
    };
  }

  // #region Constructor ~
  constructor(
    rollInstance: BladesRoll,
    section: BladesRoll.ParticipantSection,
    subSection: BladesRoll.ParticipantSubSection,
    rollParticipantDoc: BladesRoll.ParticipantDoc
  )
  constructor(
    rollInstance: BladesRoll,
    section: BladesRoll.ParticipantSection,
    subSection: BladesRoll.ParticipantSubSection,
    rollParticipantData?: BladesRoll.ParticipantData
  )
  constructor(
    rollInstance: BladesRoll,
    section: BladesRoll.ParticipantSection,
    subSection: BladesRoll.ParticipantSubSection,
    rollParticipantDataOrDoc?: BladesRoll.ParticipantDoc | BladesRoll.ParticipantData
  ) {

    this.rollInstance = rollInstance;
    this.rollParticipantSection = section;
    this.rollParticipantSubSection = subSection;

    let participantDoc: BladesRoll.ParticipantDoc|false = false;

    if (BladesRollParticipant.IsDoc(rollParticipantDataOrDoc)) {
      participantDoc = rollParticipantDataOrDoc;
    } else if (U.isList(rollParticipantDataOrDoc)) {
      if ("rollParticipantID" in rollParticipantDataOrDoc) {
        participantDoc = BladesRollParticipant.GetDoc(rollParticipantDataOrDoc.rollParticipantID);
      } else if ("rollParticipantName" in rollParticipantDataOrDoc) {
        participantDoc = BladesRollParticipant.GetDoc(rollParticipantDataOrDoc.rollParticipantName);
      }
    } else if (this.rollInstance
      && this.rollInstance.rollParticipants
      && section in this.rollInstance.rollParticipants
      && this.rollInstance.rollParticipants[section]
      && subSection in (this.rollInstance.rollParticipants[section] ?? {})
    ) {
      const participants = this.rollInstance.rollParticipants[section] as Record<
        BladesRoll.ParticipantSubSection,
        BladesRollParticipant
      >;
      participantDoc = participants[subSection].rollParticipantDoc ?? false;
    }

    if (!participantDoc) {
      throw new Error(`[BladesRollParticipant.constructor] Failed to resolve Participant document or data from provided arguments: ${JSON.stringify({
        rollInstance, section, subSection, rollParticipantDataOrDoc
      })}`);
    }

    this.rollParticipantID = participantDoc.rollParticipantID;
    this._rollParticipantDoc = participantDoc;
  }
  // #endregion

  async updateRollFlags() {
    await this.rollInstance.updateTarget(`rollParticipantData.${this.rollParticipantSection}.${this.rollParticipantSubSection}`, this);
    socketlib.system.executeForEveryone("renderRollCollab_SocketCall", this.rollInstance.id);
  }
}

class BladesRoll extends BladesTargetLink<BladesRoll.Schema> {

  static Debug = {
    modWatch: false as RegExp | false,
    watchRollMod(name: string | false) {
      if (typeof name === "string") {
        BladesRoll.Debug.modWatch = new RegExp(name, "g");
      } else {
        BladesRoll.Debug.modWatch = false;
      }
    }
  };

  // #region STATIC METHODS: INITIALIZATION & DEFAULTS ~
  static Initialize() {
    return loadTemplates([
      "systems/eunos-blades/templates/roll/partials/roll-collab-gm-number-line.hbs",
      "systems/eunos-blades/templates/roll/partials/roll-collab-gm-select-doc.hbs",
      "systems/eunos-blades/templates/roll/partials/roll-collab-gm-factor-control.hbs",

      "systems/eunos-blades/templates/roll/roll-collab-action.hbs",
      "systems/eunos-blades/templates/roll/roll-collab-action-gm.hbs",
      "systems/eunos-blades/templates/roll/roll-collab-resistance.hbs",
      "systems/eunos-blades/templates/roll/roll-collab-resistance-gm.hbs",
      "systems/eunos-blades/templates/roll/roll-collab-fortune.hbs",
      "systems/eunos-blades/templates/roll/roll-collab-fortune-gm.hbs",
      "systems/eunos-blades/templates/roll/roll-collab-indulgevice.hbs",
      "systems/eunos-blades/templates/roll/roll-collab-indulgevice-gm.hbs"
    ]);
  }

  static InitSockets() {

    socketlib.system.register("constructRollCollab_SocketCall", BladesRoll.constructRollCollab_SocketResponse.bind(BladesRoll));
    socketlib.system.register("renderRollCollab_SocketCall", BladesRoll.renderRollCollab_SocketResponse.bind(BladesRoll));
    socketlib.system.register("closeRollCollab_SocketCall", BladesRoll.closeRollCollab_SocketResponse.bind(BladesRoll));

  }

  static override ParseConfigToData<Schema = BladesRoll.Schema>(
    data: BladesTargetLink.Config & Partial<BladesRoll.Schema>,
    parentRoll: BladesRoll
  ): BladesTargetLink.Data & Partial<Schema> {
    if (data.rollPrimaryData instanceof BladesRollPrimary) {
      data.rollPrimaryData = data.rollPrimaryData.data;
    }
    if (data.rollOppData instanceof BladesRollOpposition) {
      data.rollOppData = data.rollOppData.data;
    }
    if (data.rollParticipantData) {
      if (data.rollParticipantData[RollModSection.roll]) {
        Object.keys(data.rollParticipantData[RollModSection.roll]).forEach((key) => {
          const thisParticipant = data.rollParticipantData?.[RollModSection.roll]?.[key as Exclude<BladesRoll.ParticipantSubSection, "Setup">];
          if (thisParticipant instanceof BladesRollParticipant) {
            ((data.rollParticipantData as NonNullable<BladesRoll.Config["rollParticipantData"]>)[RollModSection.roll] as Record<string, BladesRoll.ParticipantData & BladesRoll.ParticipantSectionData>)[key as Exclude<BladesRoll.ParticipantSubSection, "Setup">] = thisParticipant.data;
          }
        });
      }
      if (data.rollParticipantData[RollModSection.position]) {
        Object.keys(data.rollParticipantData[RollModSection.position]).forEach((key) => {
          const thisParticipant = data.rollParticipantData?.[RollModSection.position]?.[key as "Setup"];
          if (thisParticipant instanceof BladesRollParticipant) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            data.rollParticipantData![RollModSection.position]![key as "Setup"] = thisParticipant.data;
          }
        });
      }
      if (data.rollParticipantData[RollModSection.effect]) {
        Object.keys(data.rollParticipantData[RollModSection.effect]).forEach((key) => {
          const thisParticipant = data.rollParticipantData?.[RollModSection.effect]?.[key as "Setup"];
          if (thisParticipant instanceof BladesRollParticipant) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            data.rollParticipantData![RollModSection.effect]![key as "Setup"] = thisParticipant.data;
          }
        });
      }
    }
    data.rollModsData = this.GetRollModsDataSet(parentRoll, Object.values(data.rollModsData ?? {}));
    return BladesTargetLink.ParseConfigToData(data) as BladesTargetLink.Data & Partial<Schema>;
  }

  static override ApplySchemaDefaults<Schema = BladesRoll.Schema>(
    schemaData: Partial<BladesRoll.Schema>
  ) {
    // Ensure all properties of Schema are provided
    if (!schemaData.rollType) {
      throw new Error("Must include a rollType when constructing a BladesRoll object.");
    }

    schemaData.rollPhase ??= RollPhase.Collaboration;
    schemaData.GMBoosts = {
      [Factor.tier]: 0,
      [Factor.quality]: 0,
      [Factor.scale]: 0,
      [Factor.magnitude]: 0,
      ...schemaData.GMBoosts ?? {}
    };
    schemaData.GMOppBoosts = {
      [Factor.tier]: 0,
      [Factor.quality]: 0,
      [Factor.scale]: 0,
      [Factor.magnitude]: 0,
      ...schemaData.GMOppBoosts ?? {}
    };
    schemaData.GMOverrides ??= {};
    schemaData.userPermissions ??= {};

    if (schemaData.rollPrimaryData instanceof BladesRollPrimary) {
      schemaData.rollPrimaryData = schemaData.rollPrimaryData.data;
    }

    if (schemaData.rollOppData instanceof BladesRollOpposition) {
      schemaData.rollOppData = schemaData.rollOppData.data;
    }

    return schemaData as Schema;
  }

  // static override get defaultOptions() {
  //   return foundry.utils.mergeObject(super.defaultOptions, {
  //     classes: ["eunos-blades", "sheet", "roll-collab", game.user.isGM ? "gm-roll-collab" : ""],
  //     template: `systems/eunos-blades/templates/roll/roll-collab${game.user.isGM ? "-gm" : ""}.hbs`,
  //     submitOnChange: true,
  //     width: 500,
  //     dragDrop: [
  //       {dragSelector: null, dropSelector: "[data-action='gm-drop-opposition'"}
  //     ]
  //     // Height: 500
  //   });
  // }

  protected static get DefaultRollModSchemaSet(): BladesRollMod.Schema[] {
    /* Subclass overrides determine default roll mods. */
    return [];
  }

  static GetRollModsDataSet(
    rollInst: BladesRoll,
    rollModsSchemaSet: BladesRollMod.Schema[]
  ): Record<IDString, BladesRollMod.Data> {
    const {linkData} = rollInst;
    const modLinkConfig = {
      targetID: linkData.targetID,
      targetKey: "targetKey" in linkData
        ? "rollModsData" as TargetKey
        : undefined,
      targetFlagKey: "targetFlagKey" in linkData
        ? "rollModsData" as TargetFlagKey
        : undefined,
      isScopingById: true
    } as BladesTargetLink.Config;

    const compiledModSchemaSets = [...rollModsSchemaSet];

    // Add roll mods on rollPrimary
    if (rollInst.rollPrimary) {
      compiledModSchemaSets.push(...rollInst.rollPrimary.rollPrimaryModsSchemaSet
        .filter((pSchema) => compiledModSchemaSets.every((mSchema) => mSchema.key !== pSchema.key))
      );
    }

    // Add roll mods on rollOpposition
    if (rollInst.rollOpposition?.rollOppModsSchemaSet) {
      compiledModSchemaSets.push(...rollInst.rollOpposition.rollOppModsSchemaSet
        .filter((oSchema) => compiledModSchemaSets.every((mSchema) => mSchema.key !== oSchema.key))
      );
    }

    // Add default roll mods
    compiledModSchemaSets.push(...this.DefaultRollModSchemaSet
      .filter((dSchema) => compiledModSchemaSets.every((mSchema) => mSchema.key !== dSchema.key)));

    return Object.fromEntries(compiledModSchemaSets
      .map((modSchema) => {
        const modData = BladesTargetLink.ParseConfigToData(
          {
            ...BladesRollMod.ApplySchemaDefaults(modSchema),
            ...modLinkConfig
          }
        ) as BladesRollMod.Data;
        return [modData.id, modData];
      })
    );
  }

  static GetDieClass(rollType: RollType, rollResult: number | false | RollResult, dieVal: number, dieIndex: number) {
    switch (rollType) {
      case RollType.Resistance: {
        if (dieVal === 6 && dieIndex <= 1 && rollResult === -1) {
          return "blades-die-critical";
        }
        if (dieIndex === 0) {
          return "blades-die-resistance";
        }
        return "blades-die-fail";
      }
      case RollType.IndulgeVice: {
        if (dieIndex === 0) {
          return "blades-die-indulge-vice";
        }
        return "blades-die-fail";
      }
      default: break;
    }

    if (dieVal === 6 && dieIndex <= 1 && rollResult === RollResult.critical) {
      dieVal++;
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
    ][dieVal];
  }

  static GetDieImage(
    rollType: RollType,
    rollResult: number | false | RollResult,
    dieVal: number,
    dieIndex: number,
    isGhost = false,
    isCritical = false
  ) {
    let imgPath = "systems/eunos-blades/assets/dice/image/";
    if (isGhost) {
      imgPath += "ghost-";
    } else if ([RollType.Resistance, RollType.IndulgeVice].includes(rollType)) {
      imgPath += "grad-";
    }
    imgPath += dieVal;
    if (!isGhost && dieVal === 6 && dieIndex <= 1 && isCritical) {
      imgPath += "-crit";
    }
    imgPath += ".webp";

    return imgPath;
  }

  static get Active(): BladesRoll | undefined {
    return U.getLast(game.eunoblades.Rolls.filter((roll) => roll.isActive));
  }

  // #endregion

  // #region STATIC METHODS: New Roll Creation ~
  // static Current: Record<string, BladesRoll> = {};

  // static _Active?: BladesRoll;

  // static get Active(): BladesRoll | undefined {
  //   if (BladesRoll._Active) {return BladesRoll._Active;}
  //   if (U.objSize(BladesRoll.Current) > 0) {return U.getLast(Object.values(BladesRoll.Current));}
  //   return undefined;
  // }

  // static set Active(val: BladesRoll | undefined) {
  //   BladesRoll._Active = val;
  // }


  static GetUserPermissions(config: BladesRoll.Config): Record<IDString, RollPermissions> {
    if (!config.rollPrimaryData) {
      throw new Error("[BladesRoll.GetUserPermissions()] Missing rollPrimaryData.");
    }

    // === ONE === GET USER IDS

    // Get user ID of GM
    const GMUserID = game.users.find((user) => user.isGM)?.id as IDString;
    if (!GMUserID) {
      throw new Error("[BladesRoll.GetUserPermissions()] No GM found!");
    }

    // Get user IDs of players
    const playerUserIDs = game.users
      .filter((user) => BladesPC.IsType(user.character) && !user.isGM && typeof user.id === "string")
      .map((user) => user.id as IDString);

    // Prepare user ID permissions object
    const userIDs: Record<RollPermissions, IDString[]> = {
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
      userIDs[RollPermissions.Primary].push(rollPrimaryDoc.primaryUser?.id as IDString);

    } else if (
      BladesCrew.IsType(rollPrimaryDoc)
    ) {
      userIDs[RollPermissions.Primary].push(...playerUserIDs);
    } else if (
      BladesItem.IsType(rollPrimaryDoc, BladesItemType.cohort_gang, BladesItemType.cohort_expert)
    ) {
      if (config.rollUserID === GMUserID) {
        userIDs[RollPermissions.Primary].push(...playerUserIDs);
      } else if (BladesPC.IsType(rollPrimaryDoc.parent)
        && rollPrimaryDoc.parent.primaryUser?.id) {
        userIDs[RollPermissions.Primary].push(rollPrimaryDoc.parent.primaryUser.id as IDString);
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

    // === FOUR === ASSIGN ROLL OBSERVERS
    // Add remaining players as observers.
    userIDs[RollPermissions.Observer] = playerUserIDs
      .filter((uID) => !userIDs[RollPermissions.Participant].includes(uID));

    // === FIVE === PARSE INTO {ID: PERMISSION} FORMAT
    const userFlagData: Record<IDString, RollPermissions> = {};
    (Object.entries(userIDs) as Array<[RollPermissions, IDString[]]>)
      .forEach(([rollPermission, idsArray]) => {
        for (const id of idsArray) {
          userFlagData[id] = rollPermission;
        }
      });

    return userFlagData;

    /**
     * Generates BladesRollParticipant documents from the provided schema data.
     * @param {BladesRoll.RollParticipantDataSet} participantData
     */
    function getParticipantDocs(participantData: BladesRoll.RollParticipantDataSet) {
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
     * @param {BladesRoll.RollParticipantDataSet} participantData
     * @param {IDString[]} unassignedIDs
     */
    function getParticipantDocUserIDs(
      participantData: BladesRoll.RollParticipantDataSet,
      unassignedIDs: IDString[]
    ): IDString[] {
      return getParticipantDocs(participantData)
        .map((pDoc) => {
          if (
            BladesPC.IsType(pDoc) && typeof pDoc.primaryUser?.id === "string"
          ) {
            return pDoc.primaryUser.id as IDString;
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


  static override BuildLinkConfig(config: BladesRoll.Config): BladesTargetLink.Config {
    // Prepare partial target link config
    const partialLinkConfig: BladesTargetLink.Config = {
      target: "target" in config ? config.target : undefined,
      targetID: "targetID" in config ? config.targetID : undefined,
      targetKey: "targetKey" in config ? config.targetKey : undefined,
      targetFlagKey: "targetFlagKey" in config ? config.targetFlagKey : undefined
    };

    // If neither target nor targetID are provided, set target to rollUser or currentUser
    if (!partialLinkConfig.target && !partialLinkConfig.targetID) {
      const rollUser = game.users.get(config.rollUserID ?? game.user.id);
      if (!rollUser) {
        throw new Error("[BladesRoll.NewRoll()] You must provide a valid rollUserID, target, or targetID in the config object.");
      }
      partialLinkConfig.target = rollUser;
    }

    // If neither targetKey nor targetFlagKey are provided, set targetFlagKey to 'rollCollab'.
    if (!partialLinkConfig.targetKey && !partialLinkConfig.targetFlagKey) {
      partialLinkConfig.targetFlagKey = "rollCollab" as TargetFlagKey;
    }

    // Build target link config
    return BladesTargetLink.BuildLinkConfig(partialLinkConfig);
  }

  /**
   * This static method accepts a partial version of the config options required
   * to build a BladesRoll instance, sets the requisite flags on the storage
   * document, then sends out a socket call to the relevant users to construct
   * and display the roll instance.
   *
   * @param {BladesRoll.Config} config The configuration object for the new roll.
   */
  static async New(config: BladesRoll.Config) {

    // Build link config
    const linkConfig = this.BuildLinkConfig(config);

    // Prepare roll user flag data
    config.userPermissions = this.GetUserPermissions(config);

    // Ensure rollType is defined
    if (!config.rollType) {
      throw new Error("rollType must be defined in config");
    }

    // Log the roll data
    eLog.checkLog3("bladesRoll", "BladesRoll.NewRoll()", {config});

    // Construct and initialize the BladesRoll/BladesTargetLink instance
    const rollInst = await BladesRoll.Create({...config, ...linkConfig});

    // Send out socket calls to all users to see the roll.
    rollInst.constructRollCollab_SocketCall(rollInst.linkData);

    return rollInst;
  }
  // #endregion

  // #region SOCKET CALLS & RESPONSES ~
  constructRollCollab_SocketCall(linkData: BladesTargetLink.Data) {
    socketlib.system.executeForEveryone("constructRollCollab_SocketCall", linkData);
  }

  static constructRollCollab_SocketResponse(linkData: BladesTargetLink.Data) {
    const rollInst = new BladesRoll(linkData);
    eLog.checkLog3("rollCollab", "constructRollCollab_SocketResponse()", {params: {linkData}, rollInst});
    this.renderRollCollab_SocketResponse(rollInst.id);
  }

  _elem$?: JQuery<HTMLElement>;

  get elem$(): JQuery<HTMLElement> {
    if (this._elem$) { return this._elem$; }
    this._elem$ = $(`#${this.id}`) ?? $(`<div id="${this.id}" class="blades-roll-collab window-content"></div>`).appendTo("body");
    return this._elem$;
  }

  async renderRollCollab() {
    this.prepareRollParticipantData();
    const html = await renderTemplate("systems/eunoblades/templates/rolls/roll-collab.hbs", this.context);
    this.elem$.html(html);
    this.activateListeners();
  }

  renderRollCollab_SocketCall() {
    socketlib.system.executeForEveryone("renderRollCollab_SocketCall", this.id);
  }

  static renderRollCollab_SocketResponse(id: IDString) {
    const rollInst = game.eunoblades.Rolls.get(id);
    if (!rollInst) {
      throw new Error(`[BladesRoll.renderRollCollab_SocketResponse] No roll found with id ${id}.`);
    }
    rollInst.renderRollCollab();
  }

  closeRollCollab_Animation(): gsap.core.Timeline {
    return U.gsap.effects.blurRemove(this.elem$, {ignoreMargins: true});
  }

  async closeRollCollab_SocketCall(): Promise<void> {
    if (!game.user.isGM) {return;}
    socketlib.system.executeForOthers("closeRollCollab_SocketCall", this.id);
    await U.waitFor(this.closeRollCollab_Animation());
  }

  static closeRollCollab_SocketResponse(id: IDString) {
    game.eunoblades.Rolls.get(id)?.closeRollCollab_Animation();
  }
  // #endregion

  // #region *** CONSTRUCTOR *** ~
  rollPermission: RollPermissions;

  _rollPrimary: BladesRollPrimary;

  _rollOpposition?: BladesRollOpposition;

  _rollParticipants?: BladesRoll.RollParticipantDocs;

  projectSelectOptions?: Array<BladesSelectOption<string, string>>;

  constructor(config: BladesRoll.Config)
  constructor(data: BladesTargetLink.Data & Partial<BladesRoll.Schema>)
  constructor(dataOrConfig: BladesRoll.Config | BladesTargetLink.Data & Partial<BladesRoll.Schema>) {
    super(dataOrConfig);
    this.rollPermission = this.data.userPermissions[game.user.id as IDString];
    this._rollPrimary = new BladesRollPrimary(this, this.data.rollPrimaryData);
    if (this.data.rollOppData) {
      this._rollOpposition = new BladesRollOpposition(this, this.data.rollOppData);
    } else if (this.data.rollDowntimeAction === DowntimeAction.LongTermProject) {
      this.projectSelectOptions = Array.from(game.items)
        .filter((item) => BladesItem.IsType(item, BladesItemType.project))
        .map((project) => ({value: project.id ?? "", display: project.name}));
    }
    if (this.data.rollParticipantData) {
      this._rollParticipants = {};
      for (const [rollSection, rollParticipantList] of Object.entries(this.data.rollParticipantData)) {
        if ([RollModSection.roll, RollModSection.position, RollModSection.effect]
          .includes(rollSection as RollModSection) && !U.isEmpty(rollParticipantList)) {
          const sectionParticipants: Record<string, BladesRollParticipant> = {};
          for (const [participantType, participantData] of Object.entries(rollParticipantList)) {
            sectionParticipants[participantType] = new BladesRollParticipant(
              this,
              participantData as BladesRoll.ParticipantConstructorData
            );
          }
          this._rollParticipants[rollSection as BladesRoll.ParticipantSection] = sectionParticipants;
        }
      }
    }
    game.eunoblades.Rolls.set(this.id, this);
  }
  // #endregion

  // #region Roll Participation & User Permissions
  async addRollParticipant(
    participantRef: BladesRollParticipant | BladesRoll.ParticipantData | string,
    rollSection: BladesRoll.ParticipantSection,
    rollSubSection?: BladesRoll.ParticipantSubSection
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
    socketlib.system.executeForEveryone("renderRollCollab_SocketCall", this.id);
  }

  async removeRollParticipant(
    rollSection: BladesRoll.ParticipantSection,
    rollSubSection: BladesRoll.ParticipantSubSection
  ) {
    await this.updateTarget(`rollParticipantData.${rollSection}.${rollSubSection}`, null);
  }

  async updateUserPermission(
    _user: User,
    _permission: RollPermissions
  ) {
    /* Force-render roll with new permissions */
  }
  // #endregion

  // #region Basic User Flag Getters/Setters ~
  // get data(): BladesRoll.FlagData {
  //   if (!this.document.getFlag(C.SYSTEM_ID, "rollCollab")) {
  //     throw new Error("[get flags()] No RollCollab Flags Found on User Document");
  //   }
  //   return this.document.getFlag(C.SYSTEM_ID, "rollCollab") as BladesRoll.FlagData;
  // }

  get rollPrimary(): BladesRollPrimary {
    return this._rollPrimary;
  }

  get rollPrimaryDoc(): BladesRoll.PrimaryDoc | undefined {
    if (BladesRollPrimary.IsDoc(this.rollPrimaryDoc)) {
      return this.rollPrimaryDoc;
    }
    if (BladesRollPrimary.IsDoc(this.rollPrimary)) {
      return this.rollPrimary;
    }
    return undefined;
  }

  get rollOpposition(): BladesRollOpposition | undefined {
    if (!this._rollOpposition && BladesRollOpposition.IsValidData(this.data.rollOppData)) {
      this._rollOpposition = new BladesRollOpposition(this, this.data.rollOppData);
    }
    return this._rollOpposition;
  }

  set rollOpposition(val: BladesRollOpposition | undefined) {
    if (val === undefined) {
      this._rollOpposition = undefined;
    } else {
      this._rollOpposition = val;
      val.updateRollFlags();
    }
  }

  get rollOppClockKey(): BladesClockKey | undefined {
    return this.rollOpposition?.rollOppClockKey;
  }

  get rollClockKey(): BladesClockKey | undefined {
    return this.data.rollClockKeyID
      ? game.eunoblades.ClockKeys.get(this.data.rollClockKeyID)
      : undefined;
  }

  set rollClockKey(val: BladesClockKey | undefined) {
    this.updateTarget("rollClockKeyID", val ?? null);
  }

  /**
   * This method prepares the roll participant data.
   * It iterates over the roll sections (roll, position, effect) and for each section,
   * it creates a new BladesRollParticipant instance for each participant in that section.
   * The created instances are stored in the rollParticipants object.
   */
  protected prepareRollParticipantData(): void {
    const participantFlagData = this.data.rollParticipantData;
    if (!participantFlagData) {return;}

    const rollParticipants: BladesRoll.RollParticipantDocs = {};

    ([
      RollModSection.roll,
      RollModSection.position,
      RollModSection.effect
    ] as Array<KeyOf<BladesRoll.RollParticipantDocs>>).forEach((rollSection) => {
      const sectionFlagData = participantFlagData[rollSection] as ValOf<BladesRoll.RollParticipantDataSet> | undefined;
      if (sectionFlagData) {
        const sectionParticipants: Partial<Record<
          BladesRoll.ParticipantSubSection,
          BladesRollParticipant
        >> = {};
        (Object.entries(sectionFlagData) as Array<[
          BladesRoll.ParticipantSubSection,
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

  get rollType(): RollType {return this.data.rollType as RollType;}

  get rollSubType(): RollSubType | undefined {return this.data.rollSubType;}

  set rollSubType(val: RollSubType | undefined) {
    this.updateTarget("rollSubType", val ?? null);
  }

  get rollPhase(): RollPhase {
    return this.data.rollPhase ?? RollPhase.Collaboration;
  }

  get rollDowntimeAction(): DowntimeAction | undefined {return this.data.rollDowntimeAction;}

  get rollTrait(): BladesRoll.RollTrait | undefined {return this.data.rollTrait;}

  get rollTraitVerb(): ValueOf<typeof C["ActionVerbs"]> | undefined {
    if (!this.rollTrait) {return undefined;}
    if (!(this.rollTrait in C.ActionVerbs)) {return undefined;}
    return C.ActionVerbs[this.rollTrait as ActionTrait] as ValueOf<typeof C["ActionVerbs"]> | undefined;
  }

  get rollTraitPastVerb(): ValueOf<typeof C["ActionPastVerbs"]> | undefined {
    if (!this.rollTrait) {return undefined;}
    if (!(this.rollTrait in C.ActionPastVerbs)) {return undefined;}
    return C.ActionPastVerbs[this.rollTrait as ActionTrait] as ValueOf<typeof C["ActionPastVerbs"]> | undefined;

  }

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
    return this.data?.rollPosEffectTrade ?? false;
  }

  // getFlagVal<T>(flagKey?: string): T | undefined {
  //   if (flagKey) {
  //     return this.document.getFlag(C.SYSTEM_ID, `rollCollab.${flagKey}`.replace(/(rollCollab\.)+/g, "rollCollab.")) as T | undefined;
  //   }
  //   return this.document.getFlag(C.SYSTEM_ID, "rollCollab") as T | undefined;
  // }

  // async setFlagVal(flagKey: string, flagVal: unknown, isRerendering = true) {
  //   await this.document.setFlag(C.SYSTEM_ID, `rollCollab.${flagKey}`.replace(/(rollCollab\.)+/g, "rollCollab."), flagVal);
  //   if (isRerendering) {
  //     socketlib.system.executeForEveryone("renderRollCollab_SocketCall", this.id);
  //   }
  // }

  // async clearFlagVal(flagKey: string, isRerendering = true) {
  //   await this.document.unsetFlag(C.SYSTEM_ID, `rollCollab.${flagKey}`.replace(/(rollCollab\.)+/g, "rollCollab."));
  //   if (isRerendering) {
  //     socketlib.system.executeForEveryone("renderRollCollab_SocketCall", this.id);
  //   }
  // }


  get initialPosition(): Position {
    return this.data.rollPositionInitial ?? Position.risky;
  }

  set initialPosition(val: Position) {
    this.updateTarget("rollPositionInitial", val ?? Position.risky);
  }

  get initialEffect(): Effect {
    return this.data.rollEffectInitial ?? Effect.standard;
  }

  set initialEffect(val: Effect) {
    this.updateTarget("rollEffectInitial", val ?? Effect.standard);
  }

  get isApplyingConsequences(): boolean {
    if (this.rollType !== RollType.Action) {return false;}
    if (!this.rollResult) {return false;}
    if (![RollResult.partial, RollResult.fail].includes(this.rollResult as RollResult)) {return false;}
    return true;
  }

  // Get rollConsequence() --> For resistance rolls.
  get rollConsequence(): BladesConsequence | undefined {
    const {consequence} = this.data.resistanceData ?? {};
    if (!consequence?.id) {return undefined;}
    return game.eunoblades.Consequences.get(consequence.id)
      ?? new BladesConsequence(consequence);
  }

  // #endregion

  // #region GETTERS: DERIVED DATA ~
  get rollPositionFinal(): Position {
    return Object.values(Position)[
      U.clampNum(
        Object.values(Position).indexOf(this.initialPosition)
        + this.getModsDelta(RollModSection.position)
        + (this.posEffectTrade === "position" ? 1 : 0)
        + (this.posEffectTrade === "effect" ? -1 : 0),
        [0, 2]
      )
    ];
  }

  get rollEffectFinal(): Effect {
    return Object.values(Effect)[
      U.clampNum(
        Object.values(Effect).indexOf(this.initialEffect)
        + this.getModsDelta(RollModSection.effect)
        + (this.posEffectTrade === "effect" ? 1 : 0)
        + (this.posEffectTrade === "position" ? -1 : 0),
        [0, 4]
      )];
  }

  get rollResultDelta(): number {
    return this.getModsDelta(RollModSection.result)
      + (this.data?.GMBoosts.Result ?? 0)
      + (this.tempGMBoosts.Result ?? 0);
  }

  get rollResultFinal(): RollResult | number | false {
    if (this.rollResult === false) {return false;}
    if (this.rollResultDelta === 0) {return this.rollResult;}

    switch (this.rollType) {
      case RollType.Action:
      case RollType.Fortune: {
        return Object.values(RollResult).toReversed()[
          U.clampNum(
            Object.values(RollResult).toReversed().indexOf(this.rollResult as RollResult)
            + this.rollResultDelta,
            [0, 3]
          )];
      }
      case RollType.Resistance: { // Return stress cost of resisting
        if (this.isCritical) {return -1;}
        return U.clampNum(6 - this.highestDieVal - this.rollResultDelta, [-1, Infinity]);
      }
      case RollType.IndulgeVice: { // Return stress cleared from indulging
        return U.clampNum(this.highestDieVal + this.rollResultDelta, [0, Infinity]);
      }
    }

    return false as never;
  }

  get finalDicePool(): number {
    return Math.max(0, this.rollTraitData.value
      + this.getModsDelta(RollModSection.roll)
      + (this.data.GMBoosts.Dice ?? 0)
      + (this.tempGMBoosts.Dice ?? 0));
  }

  get isRollingZero(): boolean {
    return Math.max(0, this.rollTraitData.value
      + this.getModsDelta(RollModSection.roll)
      + (this.data.GMBoosts.Dice ?? 0)
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
        this.data.rollFactorToggles.source,
        {isMutatingOk: false}
      ) as Record<Factor, BladesRoll.FactorData>;

    const mergedOppFactors = this.rollOpposition
      ? U.objMerge(
        U.objMerge(
          defaultFactors,
          this.rollOpposition.rollFactors,
          {isMutatingOk: false}
        ),
        this.data.rollFactorToggles.opposition,
        {isMutatingOk: false}
      ) as Record<Factor, BladesRoll.FactorData>
      : {};

    return {
      source: Object.fromEntries(
        (Object.entries(mergedSourceFactors) as Array<[Factor, BladesRoll.FactorData]>)
          .map(([factor, factorData]) => {
            factorData.value +=
              (this.data.GMBoosts[factor] ?? 0)
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
            factorData.value += this.data.GMOppBoosts[factor] ?? 0;
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

  initRollMods() {
    // Reset override values previously enabled by rollmods
    this.rollTraitValOverride = undefined;
    this.rollFactorPenaltiesNegated = {};
    this.tempGMBoosts = {};

    this.rollMods = Object.values(this.data.rollModsData).map((modData) => new BladesRollMod(modData, this));

    // ESLINT DISABLE: Dev Code.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const initReport: Record<string, any> = {};

    let initReportCount = 0;
    const watchMod = (label: string) => {
      if (BladesRoll.Debug.modWatch === false) {return;}
      const reportLabel = `(${initReportCount}) == ${label}`;
      const rollMod = this.rollMods
        .find((mod) => BladesRoll.Debug.modWatch && BladesRoll.Debug.modWatch.exec(mod.name));
      if (rollMod) {
        initReport[`${reportLabel} : ${rollMod.status}`] = {
          inst: rollMod,
          data: {...rollMod.data},
          sourceName: rollMod.sourceName,
          status: {
            ALL: rollMod.status,
            base: rollMod.baseStatus,
            held: rollMod.heldStatus,
            user: rollMod.userStatus
          },
          is: {
            active: rollMod.isActive,
            visible: rollMod.isVisible,
            conditional: rollMod.isConditional,
            inInactiveBlock: rollMod.isInInactiveBlock,
            isPush: rollMod.isPush,
            isBasicPush: rollMod.isBasicPush
          }
        };
      } else {
        initReport[reportLabel] = "MOD NOT FOUND";
      }
      initReportCount++;
    };

    watchMod("INITIAL");

    /* *** PASS ZERO: ROLLTYPE VALIDATION PASS *** */
    this.rollMods = this.rollMods.filter((rollMod) => rollMod.isValidForRollType());

    watchMod("ROLLTYPE VALIDATION");

    /* *** PASS ONE: DISABLE PASS *** */
    // ... Conditional Status Pass

    const conditionalDisablePass = this.rollMods.filter((rollMod) => !rollMod.setConditionalStatus());
    watchMod("DISABLE - CONDITIONAL");

    // ... AutoReveal/AutoEnable Pass
    const autoRevealDisablePass = conditionalDisablePass.filter((rollMod) => !rollMod.setAutoStatus());
    watchMod("DISABLE - AUTO-REVEAL/ENABLE");

    // ... Payable Pass
    autoRevealDisablePass.forEach((rollMod) => {rollMod.setPayableStatus();});
    watchMod("DISABLE - PAYABLE");

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
    watchMod("FORCE-ON PASS");

    /* *** PASS THREE: PUSH-CHECK PASS *** */

    // IF ROLL FORCED ...
    if (this.isForcePushed()) {
      // ... Force Off _ALL_ visible, inactive "Is-Push" mods.
      this.getInactivePushMods()
        .filter((mod) => !mod.isBasicPush)
        .forEach((mod) => {mod.heldStatus = RollModStatus.ForcedOff;});
      watchMod("PUSH-CHECK: FORCE-OFF IS-PUSH");
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
        watchMod("PUSH-CHECK: FORCE OFF BARGAIN");
      } else {
        // Otherwise, hide all Is-Push mods
        this.getInactivePushMods(cat)
          .filter((mod) => !mod.isBasicPush)
          .forEach((mod) => {mod.heldStatus = RollModStatus.Hidden;});
        watchMod("PUSH-CHECK: HIDE IS-PUSH");
      }
    });

    /* *** PASS FOUR: Relevancy Pass *** */

    this.getVisibleRollMods()
      .forEach((mod) => {mod.setRelevancyStatus();});
    watchMod("RELEVANCY PASS");

    /* *** PASS FIVE: Overpayment Pass *** */

    // ... If 'Cost-SpecialArmor' active, ForceOff other visible Cost-SpecialArmor mods
    const activeArmorCostMod = this.getActiveRollMods().find((mod) => mod.effectKeys.includes("Cost-SpecialArmor"));
    if (activeArmorCostMod) {
      this.getVisibleRollMods()
        .filter((mod) => !mod.isActive && mod.effectKeys.includes("Cost-SpecialArmor"))
        .forEach((mod) => {mod.heldStatus = RollModStatus.ForcedOff;});
      watchMod("OVERPAYMENT PASS");
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

  negatePushCost() {
    const costlyPushMod = this.getActiveRollMods()
      .find((mod) => mod.isPush && mod.stressCost > 0);
    if (costlyPushMod) {
      U.pullElement(costlyPushMod.effectKeys, (k) => k.startsWith("Cost-Stress"));
    }
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
  protected compareMods(modA: BladesRollMod, modB: BladesRollMod): number {
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

  canResistWithArmor(csq: BladesConsequence) {
    if (!this.rollPrimary.hasArmor) {return false;}
    return csq.attribute === AttributeTrait.prowess;
  }

  canResistWithSpecialArmor(csq: BladesConsequence) {
    if (!BladesPC.IsType(this.rollPrimaryDoc)) {
      return false;
    }
    return this.rollPrimaryDoc.isSpecialArmorAvailable;
  }

  // #endregion

  // #region CONSEQUENCES: Getting, Accepting, Resisting

  get consequences(): BladesConsequence[] {
    const csqDataSet = this.data.consequenceData?.
      [this.rollPositionFinal]?.
      [this.rollResult as RollResult.partial | RollResult.fail];
    if (csqDataSet) {
      return Object.values(csqDataSet).map((csqData) => new BladesConsequence(csqData));
    }
    return [];
  }

  getConsequenceByID(csqID: string): BladesConsequence | false {
    return this.consequences.find((csq) => csq.id === csqID) ?? false;
  }

  get acceptedConsequences(): BladesConsequence[] {
    if ([RollPhase.AwaitingConsequences, RollPhase.Complete].includes(this.rollPhase)) {
      return this.consequences.filter((csq) => csq.isAccepted === true);
    }
    return [];
  }

  get unacceptedConsequences(): BladesConsequence[] {
    if (this.rollPhase === RollPhase.AwaitingConsequences) {
      return this.consequences.filter((csq) => csq.isAccepted !== true);
    }
    return [];
  }


  // #endregion

  // #region *** ROLL COLLAB CONTEXT *** ~


  /**
   * Retrieve the data for rendering the base RollCollab sheet.
   * @returns {Promise<object>} The data which can be used to render the HTML of the sheet.
   */
  get context() {

    this.initRollMods();
    this.rollMods.forEach((rollMod) => rollMod.applyRollModEffectKeys());

    return this.getTemplateContext();
  }

  getFortuneRollModsSchemaSet(): BladesRollMod.Schema[] {
    const modsData: BladesRollMod.Schema[] = [];

    if (this.rollSubType === RollSubType.Engagement) {
      modsData.push({
        key: "BoldPlan-positive-roll",
        name: "Bold Plan",
        section: RollModSection.roll,
        base_status: RollModStatus.ToggledOff,
        posNeg: "positive",
        modType: RollModType.general,
        value: 1,
        effectKeys: [],
        tooltip: "<h1></h1><p></p>"
      });
      modsData.push({
        key: "ComplexPlan-negative-roll",
        name: "Complex Plan",
        section: RollModSection.roll,
        base_status: RollModStatus.ToggledOff,
        posNeg: "negative",
        modType: RollModType.general,
        value: 1,
        effectKeys: [],
        tooltip: "<h1></h1><p></p>"
      });
      modsData.push({
        key: "ExploitWeakness-positive-roll",
        name: "Exploiting a Weakness",
        section: RollModSection.roll,
        base_status: RollModStatus.ToggledOff,
        posNeg: "positive",
        modType: RollModType.general,
        value: 1,
        effectKeys: [],
        tooltip: "<h1></h1><p></p>"
      });
      modsData.push({
        key: "WellDefended-negative-roll",
        name: "Well-Defended",
        section: RollModSection.roll,
        base_status: RollModStatus.ToggledOff,
        posNeg: "negative",
        modType: RollModType.general,
        value: 1,
        effectKeys: [],
        tooltip: "<h1></h1><p></p>"
      });
      modsData.push({
        key: "HelpFromFriend-positive-roll",
        name: "Help From a Friend",
        section: RollModSection.position,
        base_status: RollModStatus.ToggledOff,
        posNeg: "positive",
        modType: RollModType.general,
        value: 1,
        effectKeys: [],
        tooltip: "<h1>Help From a Friend</h1><p>Add <strong>+1d</strong> if you enlist the help of a friend or contact.</p>"
      });
      modsData.push({
        key: "EnemyInterference-negative-roll",
        name: "Enemy Interference",
        section: RollModSection.roll,
        base_status: RollModStatus.ToggledOff,
        posNeg: "negative",
        modType: RollModType.general,
        value: 1,
        effectKeys: [],
        tooltip: "<h1></h1><p></p>"
      });
    }

    return modsData;
  }

  getDowntimeActionRollModsSchemaSet(): BladesRollMod.Schema[] {
    const modsData: BladesRollMod.Schema[] = [];
    modsData.push({
      key: "HelpFromFriend-positive-roll",
      name: "Help From a Friend",
      section: RollModSection.position,
      base_status: RollModStatus.ToggledOff,
      posNeg: "positive",
      modType: RollModType.general,
      value: 1,
      effectKeys: [],
      tooltip: "<h1>Help From a Friend</h1><p>Add <strong>+1d</strong> if you enlist the help of a friend or contact.</p>"
    });
    if (this.rollDowntimeAction !== DowntimeAction.IndulgeVice) {
      modsData.push({
        key: "CanBuyResultLevel-positive-after",
        name: "Buying Result Level",
        section: RollModSection.after,
        base_status: RollModStatus.ForcedOn,
        posNeg: "positive",
        modType: RollModType.general,
        value: 0,
        effectKeys: [],
        tooltip: "<h1>Buying Result Level</h1><p>After your roll, you can <strong>increase the result level</strong> by one for each <strong class=\"gold-bright\">Coin</strong> you spend.</p>"
      });
    }
    switch (this.rollDowntimeAction) {
      case DowntimeAction.AcquireAsset: {
        modsData.push({
          key: "RepeatPurchase-positive-roll",
          name: "Repeat Purchase",
          section: RollModSection.roll,
          base_status: RollModStatus.ToggledOff,
          posNeg: "positive",
          modType: RollModType.general,
          value: 1,
          effectKeys: [],
          tooltip: "<h1>Repeat Purchase Bonus</h1><p>Add <strong>+1d</strong> if you have previously acquired this asset or service with a <strong>Acquire Asset</strong> Downtime activity.</p>"
        });
        modsData.push({
          key: "RestrictedItem-negative-after",
          name: "Restricted",
          section: RollModSection.after,
          base_status: RollModStatus.Hidden,
          posNeg: "negative",
          modType: RollModType.general,
          value: 0,
          effectKeys: ["Cost-Heat2"],
          tooltip: "<h1>Restricted</h1><p>Whether contraband goods or dangerous materials, this <strong>Acquire Asset</strong> Downtime activity will add <strong class=\"red-bright\">+2 Heat</strong> to your crew.</p>"
        });
        break;
      }
      default: break;
    }

    /*
    modsData.push({
      id: "--",
      name: "",
      section: RollModSection,
      base_status: RollModStatus,
      posNeg: "",
      modType: RollModType.general,
      value: 1,
      effectKeys: [],
      tooltip: "<h1></h1><p></p>"
    })
*/
    return modsData;
  }

  /**
   * Gets the roll modifications data.
   * @returns {BladesRollMod.Data[]} The roll modifications data.
   */
  protected getRollModsData(): BladesRollMod.Data[] {
    const defaultMods: BladesRollMod.Schema[] = [];
    if (this.rollType === RollType.Fortune) {
      defaultMods.push(...this.getFortuneRollModsSchemaSet());
    }
    if (this.rollDowntimeAction) {
      defaultMods.push(...this.getDowntimeActionRollModsSchemaSet());
    }
    if (this.rollType === RollType.Action) {
      if (this.rollPrimary.isWorsePosition) {
        defaultMods.push({
          key: "WorsePosition-negative-position",
          name: "Worse Position",
          section: RollModSection.position,
          base_status: RollModStatus.ForcedOn,
          posNeg: "negative",
          modType: RollModType.general,
          value: 1,
          effectKeys: [],
          tooltip: "<h1>Worse Position</h1><p>A <strong class='red-bright'>Consequence</strong> on a previous roll has worsened your <strong>Position</strong>.</p>"
        });
      }
    }
    if (
      this.rollType === RollType.Action
      && this.acceptedConsequences.some((csq) => csq.type === ConsequenceType.ReducedEffect)
    ) {
      defaultMods.push({
        key: "ReducedEffect-negative-effect",
        name: "Reduced Effect",
        section: RollModSection.effect,
        base_status: RollModStatus.ForcedOn,
        posNeg: "negative",
        modType: RollModType.general,
        value: 1,
        effectKeys: [],
        tooltip: "<h1>Reduced Effect</h1><p>A <strong class='red-bright'>Consequence</strong> has worsened your <strong>Effect</strong>.</p>"
      });
    }
    return Object.values(BladesRoll.GetRollModsDataSet(
      this,
      [
        ...defaultMods,
        ...this.rollOpposition?.rollOppModsSchemaSet ?? []
      ]));
  }

  /**
   * Determines if the user is a game master.
   * @returns {boolean} Whether the user is a GM.
   */
  protected getIsGM(): boolean {
    return game.eunoblades.Tracker?.system.is_spoofing_player ? false : game.user.isGM;
  }

  /**
   * Gets the roll costs.
   * @returns {BladesRoll.CostData[]} The roll costs.
   */
  protected getRollCosts(): BladesRoll.CostData[] {
    return this.getActiveRollMods()
      .map((rollMod) => rollMod.costs)
      .flat()
      .filter((costData): costData is BladesRoll.CostData => costData !== undefined);
  }

  /**
   * Constructs the sheet data.
   * @param {boolean} isGM If the user is a GM.
   * @param {BladesRoll.CostData[]} rollCosts The roll costs.
   * @returns {BladesRoll.Context} The constructed sheet data.
   */
  protected getTemplateContext(): BladesRoll.Context {
    const {
      data: rData,
      rollPrimary,
      rollTraitData,
      rollTraitOptions,
      rollOppClockKey,
      rollClockKey,
      finalDicePool,
      rollPositionFinal,
      rollEffectFinal,
      rollResultDelta,
      rollResultFinal,
      rollMods,
      rollFactors
    } = this;
    if (!rollPrimary) {
      throw new Error("A primary roll source is required for BladesRoll.");
    }
    const baseData = {
      ...this.data,
      cssClass: "roll-collab",
      isGM: this.isGM,
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
      ...this.calculateOddsHTML(finalDicePool, rollResultDelta)
    };

    const GMBoostsData = this.calculateGMBoostsData(rData);

    const positionEffectTradeData = this.calculatePositionEffectTradeData();

    const stressCostDataSet = this.getRollCosts()
      .filter((costData) => costData.costType === "Stress")
      .map((costData) => [costData.label, costData.costAmount] as const);

    const availableArmor: string[] = [];
    if (this.rollPrimaryDoc instanceof BladesPC) {
      availableArmor.push(...this.rollPrimaryDoc.availableArmor);
    } else if (BladesItem.IsType(
      this.rollPrimaryDoc,
      BladesItemType.cohort_gang,
      BladesItemType.cohort_expert
    )) {
      // Gang or Expert Cohort
      for (let index = 0; index < this.rollPrimaryDoc.system.armor.value; index++) {
        availableArmor.push("Armor");
      }
    }
    const armorCostDataSet = this.getRollCosts()
      .filter((costData) => costData.costType === "Armor")
      .map((costData, index) => [costData.label, availableArmor[index]] as const)
      .filter(([_label, armorType]) => armorType !== undefined);

    const specialArmorCostDataSet = this.getRollCosts()
      .filter((costData) => costData.costType === "SpecialArmor")
      .map((costData) => costData.label);

    const userPermission = baseData.userPermissions[game.user.id] ?? RollPermissions.Observer;

    // const downtimeData = this.processDowntimeActions();

    return {
      ...baseData,
      ...(this.rollPrimaryDoc ? {rollPrimary: this.rollPrimaryDoc} : {}),
      rollPositionFinal,
      rollEffectFinal,
      rollResultFinal,
      rollPositions: Object.values(Position),
      rollEffects: Object.values(Effect),
      rollResultDelta,
      isAffectingResult: rollResultDelta !== 0
        || this.getVisibleRollMods(RollModSection.result).length > 0
        || (this.isGM && this.getRollMods(RollModSection.result).length > 0),
      isAffectingAfter: this.getVisibleRollMods(RollModSection.after).length > 0
        || (this.isGM && this.getRollMods(RollModSection.after).length > 0),
      ...GMBoostsData,
      ...positionEffectTradeData,
      ...(rollOppClockKey ? {rollClockKey: rollOppClockKey} : {}),
      ...(rollClockKey ? {rollClockKey} : {}),
      totalStressCost: stressCostDataSet.reduce((acc, [_label, amount]) => acc + amount, 0),
      totalArmorCost: armorCostDataSet.length,
      stressCosts: stressCostDataSet.length > 0
        ? Object.fromEntries(stressCostDataSet)
        : undefined,
      armorCosts: armorCostDataSet.length > 0
        ? Object.fromEntries(armorCostDataSet)
        : undefined,
      specArmorCost: specialArmorCostDataSet[0],
      userPermission,
      editable: userPermission === RollPermissions.Primary || userPermission === RollPermissions.GM,
      gamePhase: game.eunoblades.Tracker.phase
    };
  }
  // type BladesSelectOption<displayType, valueType = string> = {
  //   value: valueType,
  //   display: displayType
  // };
  // protected processDowntimeActions() {
  //   const downtimeData: Record<string,any>;
  //   if (BladesActor.IsType(this.rollPrimaryDoc, BladesActorType.pc)) {
  //     downtimeData.canDoDowntimeActions = true;
  //     downtimeData.downtimeActionsRemaining = this.rollPrimaryDoc.remainingDowntimeActions;
  //     const availableDowntimeActions: DowntimeAction[] = [];
  //     if (this.rollType === RollType.Action) {
  //       availableDowntimeActions.push(...[
  //         DowntimeAction.AcquireAsset,
  //         DowntimeAction.LongTermProject,
  //         DowntimeAction.Recover,
  //         DowntimeAction.ReduceHeat
  //       ]);
  //     } else if (this.rollType === RollType.Fortune) {
  //       availableDowntimeActions.push(...[
  //         DowntimeAction.
  //       ])
  //     }
  //     downtimeData.downtimeActionOptions =
  //   downtimeActionOptions?: Array<BladesSelectOption<string, DowntimeAction>
  // }

  protected calculateGMBoostsData(data: BladesRoll.Data) {
    return {
      GMBoosts: {
        Dice: data.GMBoosts.Dice ?? 0,
        [Factor.tier]: data.GMBoosts[Factor.tier] ?? 0,
        [Factor.quality]: data.GMBoosts[Factor.quality] ?? 0,
        [Factor.scale]: data.GMBoosts[Factor.scale] ?? 0,
        [Factor.magnitude]: data.GMBoosts[Factor.magnitude] ?? 0,
        Result: data.GMBoosts.Result ?? 0
      },
      GMOppBoosts: {
        [Factor.tier]: data.GMOppBoosts[Factor.tier] ?? 0,
        [Factor.quality]: data.GMOppBoosts[Factor.quality] ?? 0,
        [Factor.scale]: data.GMOppBoosts[Factor.scale] ?? 0,
        [Factor.magnitude]: data.GMOppBoosts[Factor.magnitude] ?? 0
      }
    };
  }

  protected calculateOddsHTML(
    diceTotal: number,
    rollResultDelta: number
  ): {oddsHTMLStart: string, oddsHTMLStop: string} {
    if (this.rollType === RollType.Resistance) {
      return this.calculateOddsHTML_Resistance(diceTotal);
    }
    return this.calculateOddsHTML_Standard(diceTotal, rollResultDelta);
  }

  /**
   * Calculate odds starting & ending HTML based on given dice total.
   * @param {number} diceTotal Total number of dice.
   * @param {number} rollResultDelta
   * @returns {{oddsHTMLStart: string, oddsHTMLStop: string}} Opening & Closing HTML for odds bar display
   */
  protected calculateOddsHTML_Standard(
    diceTotal: number,
    rollResultDelta: number
  ): {oddsHTMLStart: string, oddsHTMLStop: string} {
    const oddsColors = {
      crit: "var(--blades-gold)",
      success: "var(--blades-white-bright)",
      partial: "var(--blades-grey)",
      fail: "var(--blades-black-dark)"
    };
    const odds = {...C.DiceOddsStandard[diceTotal]};

    if (rollResultDelta < 0) {
      for (let i = rollResultDelta; i < 0; i++) {
        oddsColors.crit = oddsColors.success;
        oddsColors.success = oddsColors.partial;
        oddsColors.partial = oddsColors.fail;
      }
    } else if (rollResultDelta > 0) {
      for (let i = 0; i < rollResultDelta; i++) {
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
  protected calculateOddsHTML_Resistance(
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
  protected calculatePositionEffectTradeData(): {canTradePosition: boolean, canTradeEffect: boolean} {
    const canTradePosition = this.posEffectTrade === "position" || (
      this.posEffectTrade === false
      && this.rollPositionFinal !== Position.desperate
      && this.rollEffectFinal !== Effect.extreme
    );
    const canTradeEffect = this.posEffectTrade === "effect" || (
      this.posEffectTrade === false
      && this.rollPositionFinal !== Position.controlled
      && this.rollEffectFinal !== Effect.zero
    );

    return {canTradePosition, canTradeEffect};
  }

  /**
   * Calculate data on whether there are any inactive conditionals.
   * @returns {Record<RollModSection, boolean>} - Data on inactive conditionals.
   */
  protected calculateHasInactiveConditionalsData(): Record<RollModSection, boolean> {
    const hasInactive = {} as Record<RollModSection, boolean>;
    for (const section of Object.values(RollModSection)) {
      hasInactive[section] = this.getRollMods(section).filter((mod) => mod.isInInactiveBlock).length > 0;
    }
    return hasInactive;
  }
  // #endregion

  // #region *** EVALUATING ROLL *** ~

  // #region DICE ~
  _dieVals?: number[];

  get dieVals(): number[] {
    return (this.roll.terms as DiceTerm[])[0].results
      .map((result) => result.result)
      .sort()
      .reverse();
    // return this._dieVals;
  }

  // Accounts for rolling zero dice by removing highest.
  get finalDieVals(): number[] {
    return this.isRollingZero ? this.dieVals.slice(1) : this.dieVals;
  }

  get finalDiceData(): BladesRoll.DieData[] {
    eLog.checkLog3("rollCollab", "[get finalDiceData()]", {roll: this, dieVals: this.dieVals});
    const dieVals = [...this.dieVals];
    const ghostNum = this.isRollingZero ? dieVals.shift() : null;
    const isCritical = dieVals.filter((val) => val === 6).length >= 2;

    const diceData: BladesRoll.DieData[] = dieVals.map((val, i) => ({
      value: val,
      dieClass: BladesRoll.GetDieClass(this.rollType, this.rollResult, val, i),
      dieImage: BladesRoll.GetDieImage(this.rollType, this.rollResult, val, i, false, isCritical)
    }));

    if (ghostNum) {
      diceData.push({
        value: ghostNum,
        dieClass: "blades-die-ghost",
        dieImage: BladesRoll.GetDieImage(this.rollType, this.rollResult, ghostNum, diceData.length, true, false)
      });
    }

    return diceData;
  }

  // get dieValsHTML(): string {
  //   eLog.checkLog3("rollCollab", "[get dieValsHTML()]", {roll: this, dieVals: this.dieVals});
  //   const dieVals = [...this.dieVals];
  //   const ghostNum = this.isRollingZero ? dieVals.shift() : null;
  //   const isCritical = dieVals.filter((val) => val === 6).length >= 2;

  //   const diceData = dieVals.map((val, i) => ({
  //     value: val,
  //     dieClass: BladesRoll.GetDieClass(this.rollType, this.rollResult, val, i),
  //     dieImage: BladesRoll.GetDieImage(this.rollType, this.rollResult, val, i, false, isCritical)
  //   }));

  //   if (ghostNum) {
  //     diceData.push({
  //       value: ghostNum,
  //       dieClass: "blades-die-ghost",
  //       dieImage: BladesRoll.GetDieImage(this.rollType, this.rollResult, ghostNum, diceData.length, true, false)
  //     });
  //   }

  //   return [
  //     ...dieVals.map((val, i) => `<span class='blades-die ${dieClass} blades-die-${value}'><img src='${dieImage}' /></span>`),
  //     ghostNum ? `<span class='blades-die blades-die-ghost blades-die-${ghostNum}'><img src='${this.getDieImage(ghostNum, 0, true)}' /></span>` : null
  //   ]
  //     .filter((val): val is string => typeof val === "string")
  //     .join("");
  // }
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
    /* Subclass overrides determine how roll result is communicated. */
    throw new Error("[BladesRoll.rollResult] Unimplemented by Subclass.");
  }
  // #endregion

  get isResolved() {return this.roll.total !== undefined;}

  async evaluateRoll() {
    // If this command is called on an already-resolved roll, close the roll collab element and return.
    if (this.isResolved) {
      this.closeRollCollab_Animation();
      return this.data;
    }

    this.closeRollCollab_SocketCall();

    eLog.checkLog3("rollCollab", "[resolveRoll()] Before Evaluation", {roll: this, rollData: {...this.data}});

    await this.roll.evaluate({async: true});

    return await this.updateTargetData({
      ...this.data,
      rollPositionFinal: this.rollPositionFinal,
      rollEffectFinal: this.rollEffectFinal,
      rollResult: this.rollResult,
      rollTraitVerb: this.rollTraitVerb,
      rollTraitPastVerb: this.rollTraitPastVerb,
      finalDiceData: this.finalDiceData,
      rollPhase: this.isApplyingConsequences
        ? RollPhase.AwaitingConsequences
        : RollPhase.Complete
    });
  }

  async resolveRollResult() {
    /* Subclass overrides determine how result affects roll participants */
    throw new Error("[BladesRoll.resolveRollResult] Unimplemented by Subclass.");
  }

  async outputRollToChat() {
    await BladesChat.create({
      speaker: this.getSpeaker(BladesChat.getSpeaker()),
      content: await renderTemplate(this.chatTemplate, this.data),
      type: CONST.CHAT_MESSAGE_TYPES.ROLL,
      flags: {
        "eunos-blades": {rollData: this.data}
      }
    }) as BladesChat;
  }

  async resolveRoll() {
    await this.evaluateRoll();
    this.resolveRollResult();
    await this.outputRollToChat();
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

    // chatSpeaker.alias = `${chatSpeaker.alias} Rolls ...`;

    return chatSpeaker;
  }
  // #endregion


  // #region *** ROLL COLLAB HTML ELEMENT ***

  get collabTemplate(): string {
    /* Subclass overrides determine template against which data is parsed */
    throw new Error("[BladesRoll.collabTemplate] Unimplemented by Subclass.");
  }
  get chatTemplate(): string {
    /* Subclass overrides determine template against which data is parsed */
    throw new Error("[BladesRoll.chatTemplate] Unimplemented by Subclass.");
  }

  // #region LISTENER FUNCTIONS ~


  // async _handleConsequenceClick(event: ClickEvent) {
  //   const clickTarget$ = $(event.currentTarget);
  //   const csqParent$ = clickTarget$.closest(".comp.consequence-display-container");
  //   const csqID = csqParent$.data("csq-id");
  //   const chatElem$ = csqParent$.closest(".blades-roll");
  //   const chatMessage$ = chatElem$.closest(".chat-message");
  //   const chatID = chatMessage$.data("messageId") as IDString;
  //   const chatMessage = game.messages.get(chatID);
  //   if (!chatMessage) {return;}
  //   const csqs = await BladesConsequence.GetFromChatMessage(chatMessage);
  //   const thisCsq = csqs.find((csq) => csq.id === csqID);
  //   if (!thisCsq) {return;}
  //   switch (clickTarget$.data("action")) {
  //     case "accept-consequence": return thisCsq.resolveAccept();
  //     case "resist-consequence": return thisCsq.resistConsequence();
  //     case "armor-consequence": return thisCsq.resistArmorConsequence();
  //     case "special-consequence": return thisCsq.resistSpecialArmorConsequence();
  //   }
  //   return undefined as never;
  // }

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

    await this.updateTarget(target, value);
    socketlib.system.executeForEveryone("renderRollCollab_SocketCall", this.id);
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
    await this.updateTarget(flagTarget, newVal);
  }

  /**
   * Handles resetting value associated with GM number line on a right-click.
   * @param {ClickEvent} event JQuery context menu event sent to listener.
   */
  async _gmControlResetTarget(event: ClickEvent) {
    event.preventDefault();
    if (!game.user.isGM) {return;}
    await this.updateTarget($(event.currentTarget).data("target"), undefined);
    socketlib.system.executeForEveryone("renderRollCollab_SocketCall", this.id);
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

    const factorToggleData = this.data.rollFactorToggles;

    const [thisSource, thisFactor, thisToggle] = target.split(/\./).slice(-3) as ["source" | "opposition", Factor, BladesRoll.FactorToggle];

    // If thisToggle is unrecognized, just toggle whatever value target points at
    if (!["isActive", "isPrimary", "isDominant", "highFavorsPC"].includes(thisToggle)) {
      await this.updateTarget(target, value);
      socketlib.system.executeForEveryone("renderRollCollab_SocketCall", this.id);
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
                } as BladesRoll.FactorFlagData;
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

    await this.updateTarget("rollFactorToggles", factorToggleData);
    socketlib.system.executeForEveryone("renderRollCollab_SocketCall", this.id);
  }

  async _onSelectChange(event: SelectChangeEvent) {
    event.preventDefault();
    const elem = event.currentTarget;
    const {docType} = elem.dataset;
    if (elem.value !== "" && docType?.startsWith("BladesRollParticipant")) {
      const [_, section, subSection] = docType.split(".");
      await this.addRollParticipant(
        elem.value,
        section as BladesRoll.ParticipantSection,
        subSection as BladesRoll.ParticipantSubSection
      );
    } else {
      await U.EventHandlers.onSelectChange(this, event);
      socketlib.system.executeForEveryone("renderRollCollab_SocketCall", this.id);
    }
  }

  async _onTextInputBlur(event: InputChangeEvent) {
    await U.EventHandlers.onTextInputBlur(this, event);
    socketlib.system.executeForEveryone("renderRollCollab_SocketCall", this.id);
  }

  async _onGMPopupClick(event: ClickEvent) {

    /**
     * <element
     *  data-action="gm-text-popup"
     *  data-prompt="Enter text for Major Advantage."
     *  data-flag-target="rollCollab.advantages.{{calc (count data.advantages) '+' 1)}}
     * >
     *
     * */
    const elem$ = $(event.currentTarget);
    const prompt = elem$.data("prompt");
    const flagTarget = elem$.data("flagTarget");

    if (prompt && flagTarget) {
      BladesDialog.DisplaySimpleInputDialog(this, prompt, undefined, flagTarget);
    }
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

  // #endregion
  // #region ACTIVATE LISTENERS ~
  activateListeners() {
    ApplyTooltipAnimations(this.elem$);
    ApplyConsequenceAnimations(this.elem$);

    // If a rollClockKey exists, initialize its elements
    if (this.rollClockKey) {
      this.elem$.find(".roll-clock").removeClass("hidden");
    }

    // User-Toggleable Roll Mods
    this.elem$.find(".roll-mod[data-action='toggle']").on({
      click: this._toggleRollModClick.bind(this)
    });

    this.elem$.find("[data-action='tradePosition']").on({
      click: (event) => {
        const curVal = `${$(event.currentTarget).data("value")}`;
        if (curVal === "false") {
          this.updateTarget("rollPosEffectTrade", "effect")
            .then(() => socketlib.system.executeForEveryone("renderRollCollab_SocketCall", this.id));
        } else {
          this.updateTarget("rollPosEffectTrade", false)
            .then(() => socketlib.system.executeForEveryone("renderRollCollab_SocketCall", this.id));
        }
      }
    });
    this.elem$.find("[data-action='tradeEffect']").on({
      click: (event) => {
        const curVal = `${$(event.currentTarget).data("value")}`;
        if (curVal === "false") {
          this.updateTarget("rollPosEffectTrade", "position")
            .then(() => socketlib.system.executeForEveryone("renderRollCollab_SocketCall", this.id));
        } else {
          this.updateTarget("rollPosEffectTrade", false)
            .then(() => socketlib.system.executeForEveryone("renderRollCollab_SocketCall", this.id));
        }
      }
    });

    this.elem$.find("[data-action='roll']").on({
      click: () => this.resolveRoll()
    });

    this.elem$
      .find("select[data-action='player-select']")
      .on({change: this._onSelectChange.bind(this)});

    if (!game.user.isGM) {return;}

    /**
     * Handles setting of rollMod status via GM pop-out controls
     */
    this.elem$.find(".controls-toggle").on({
      click: (event) => {
        event.preventDefault();
        $(event.currentTarget).parents(".controls-panel").toggleClass("active");
      }
    });
    this.elem$.find("[data-action=\"gm-set\"]").on({
      click: this._gmControlSet.bind(this)
    });
    /**
     * Handles setting of baseline rollPosition via GM button line
     */
    this.elem$.find("[data-action=\"gm-set-position\"]").on({
      click: this._gmControlSetPosition.bind(this)
    });
    /**
     * Handles setting of baseline rollEffect via GM button line
     */
    this.elem$.find("[data-action=\"gm-set-effect\"]").on({
      click: this._gmControlSetEffect.bind(this)
    });
    /**
     * Handles setting values via GM number line (e.g. roll factor boosts/modifications).
     * Handles resetting value associated with GM number line on a right-click.
     */
    this.elem$.find("[data-action=\"gm-set-target\"]").on({
      click: this._gmControlSetTargetToValue.bind(this),
      contextmenu: this._gmControlResetTarget.bind(this)
    });
    /**
     * Handles setting values via GM number line (e.g. roll factor boosts/modifications).
     * Handles resetting value associated with GM number line on a right-click.
     */
    this.elem$.find("[data-action=\"gm-cycle-target\"]").on({
      click: this._gmControlCycleTarget.bind(this)
    });
    /**
     * Handles setting of Factor toggles: isActive, isPrimary, highFavorsPC, isDominant
     */
    this.elem$.find("[data-action=\"gm-toggle-factor\"]").on({
      click: this._gmControlToggleFactor.bind(this)
    });

    this.elem$
      .find("select[data-action='gm-select']")
      .on({change: this._onSelectChange.bind(this)});

    this.elem$
      .find("[data-action=\"gm-edit-consequences\"]")
      .on({click: () => BladesDialog.DisplayRollConsequenceDialog(this)});

    this.elem$
      .find("[data-action=\"gm-text-popup\"]")
      .on({click: this._onGMPopupClick.bind(this)});


    this.elem$
      .find("[data-action='gm-text-input']")
      .on({blur: this._onTextInputBlur.bind(this)});

  }
  // #endregion

  // #endregion

  // #region OVERRIDES: _canDragDrop, _onDrop, _onSubmit, close, render ~
  // override _canDragDrop() {
  //   return game.user.isGM;
  // }

  // override _onDrop(event: DragEvent) {
  //   const {uuid} = TextEditor.getDragEventData(event) as {uuid: UUIDString};
  //   const dropDoc = fromUuidSync(uuid);
  //   if (BladesRollOpposition.IsDoc(dropDoc)) {
  //     this.rollOpposition = new BladesRollOpposition(this, {rollOppDoc: dropDoc});
  //   } else if (dropDoc instanceof BladesProject && dropDoc.clockKey) {
  //     // Project dropped on roll: Assign project's clock key to roll.
  //     this.rollClockKey = dropDoc.clockKey;
  //   }
  // }

  async submitChange(prop: string, val: unknown) {
    await this.updateTarget(prop, val);
    socketlib.system.executeForEveryone("renderRollCollab_SocketCall", this.id);
  }
  // #endregion

}

class BladesActionRoll extends BladesRoll {
  /* Not much -- most action roll things will extend to other rolls, but split out things like Position, Effect, default Mods */
  static override ApplySchemaDefaults<Schema = BladesRoll.Schema>(
    schemaData: Partial<BladesRoll.Schema>
  ) {
    schemaData.rollType = RollType.Action;
    if (!schemaData.rollPrimaryData) {
      throw new Error("Must include a rollPrimaryData when constructing a BladesActionRoll object.");
    }
    // Validate the rollTrait
    if (!(schemaData.rollTrait === "" || U.isInt(schemaData.rollTrait) || U.lCase(schemaData.rollTrait) in {...ActionTrait, ...Factor})) {
      throw new Error(`[BladesActionRoll.ApplySchemaDefaults()] Bad RollTrait for Action Roll: ${schemaData.rollTrait}`);
    }

    schemaData = super.ApplySchemaDefaults(schemaData);

    const rollPrimary = BladesRollPrimary.Build(schemaData);

    // Modify Config object depending on downtime action where necessary.
    switch (schemaData.rollDowntimeAction) { // Remember: Can be done outside of Downtime during Flashbacks!
      case DowntimeAction.AcquireAsset: {
        schemaData.rollTrait = Factor.tier;
        break;
      }
      case DowntimeAction.LongTermProject: {
        // Validate that rollOppData points to a project item
        if (!BladesRollOpposition.IsValidData(schemaData.rollOppData)) {
          throw new Error("No rollOppData provided for LongTermProject roll.");
        }
        const rollOpp = new BladesRollOpposition(undefined, schemaData.rollOppData);
        if (![
          BladesItemType.project,
          BladesItemType.design
        ].includes(rollOpp.rollOppType as BladesItemType)) {
          throw new Error("rollOppType must be 'project' or 'design' for LongTermProject roll.");
        }
        break;
      }
      case DowntimeAction.Recover: {
        // Validate that rollPrimary is an NPC or a PC with Physiker.
        if (BladesPC.IsType(rollPrimary.rollPrimaryDoc)) {
          if (!rollPrimary.rollPrimaryDoc.abilities.find((ability) => ability.name === "Physiker")) {
            throw new Error("A PC rollPrimary on a Recovery roll must have the Physiker ability.");
          }
          schemaData.rollTrait = ActionTrait.tinker;
        } else if (rollPrimary.rollPrimaryDoc?.rollPrimaryType === BladesActorType.npc) {
          schemaData.rollTrait = Factor.quality;
        } else {
          throw new Error("Only a PC with Physiker or an NPC can be rollPrimary on a Recover roll.");
        }
        break;
      }
      case DowntimeAction.ReduceHeat: {
        // rollPrimary must be a cohort with a parent PC or Crew,
        // and PC must be member of a crew
        // and Crew must not have zero Heat.
        let parentCrew: BladesCrew | undefined = undefined;
        if (rollPrimary.rollPrimaryDoc) {
          const {parent} = rollPrimary.rollPrimaryDoc;
          if (BladesCrew.IsType(parent)) {
            parentCrew = parent;
          } else if (BladesPC.IsType(parent) && BladesCrew.IsType(parent.crew)) {
            parentCrew = parent.crew;
          }
        }

        if (!BladesCrew.IsType(parentCrew)) {
          throw new Error(`Could not find crew for rollPrimary '${rollPrimary.rollPrimaryDoc?.rollPrimaryName}'`);
        }
        if (parentCrew.system.heat.value === 0) {
          throw new Error("Attempt to Reduce Heat for a Crew with no Heat.");
        }
        break;
      }
      case undefined: break;
      default: throw new Error(`Unrecognized Roll Downtime Action: ${schemaData.rollDowntimeAction}`);
    }

    return {
      rollPositionInitial: Position.risky,
      rollEffectInitial: Effect.standard,
      rollPosEffectTrade: false,
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
      GMOverrides: {},
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
      },
      ...schemaData,
      rollPrimaryData: rollPrimary.data,
      rollOppData: schemaData.rollOppData instanceof BladesRollOpposition
        ? schemaData.rollOppData.data
        : schemaData.rollOppData
    } as Schema;
  }

  static override get DefaultRollModSchemaSet(): BladesRollMod.Schema[] {
    return [
      {
        key: "Push-positive-roll",
        name: "PUSH",
        section: RollModSection.roll,
        base_status: RollModStatus.ToggledOff,
        posNeg: "positive",
        modType: RollModType.general,
        value: 1,
        effectKeys: ["ForceOff-Bargain", "Cost-Stress2"],
        tooltip: "<h1>Push for +1d</h1><p>For <strong class='red-bright'>2 Stress</strong>, add <strong class='gold-bright'>1 die</strong> to your pool.</p><p><em>(You <strong>cannot</strong> also accept a <strong class='red-bright'>Devil's Bargain</strong> to increase your dice pool: It's one or the other.)</em></p>"
      },
      {
        key: "Bargain-positive-roll",
        name: "Bargain",
        section: RollModSection.roll,
        base_status: RollModStatus.Hidden,
        posNeg: "positive",
        modType: RollModType.general,
        value: 1,
        effectKeys: [],
        tooltip: "<h1 class='red-bright'>Devil's Bargain</h1><p>The GM has offered you a <strong class='red-bright'>Devil's Bargain</strong>.</p><p><strong class='red-bright'>Accept the terms</strong> to add <strong class='gold-bright'>1 die</strong> to your pool.</p><p><em>(You <strong>cannot</strong> also <strong>Push for +1d</strong> to increase your dice pool: It's one or the other.)</em></p>"
      },
      {
        key: "Assist-positive-roll",
        name: "Assist",
        section: RollModSection.roll,
        base_status: RollModStatus.Hidden,
        posNeg: "positive",
        modType: RollModType.teamwork,
        value: 1,
        tooltip: "<h1 class='gold-bright'>%DOC_NAME% Assists</h1><p><strong class='gold-bright'>%DOC_NAME%</strong> is <strong>Assisting</strong> your efforts, adding <strong class='gold-bright'>1 die</strong> to your pool.</p>"
      },
      {
        key: "Setup-positive-position",
        name: "Setup",
        section: RollModSection.position,
        base_status: RollModStatus.Hidden,
        posNeg: "positive",
        modType: RollModType.teamwork,
        value: 1,
        tooltip: "<h1 class='gold-bright'>%DOC_NAME% Sets You Up</h1><p><strong class='gold-bright'>%DOC_NAME%</strong> has set you up for success with a preceding <strong>Setup</strong> action, increasing your <strong class='gold-bright'>Position</strong> by one level.</p>"
      },
      {
        key: "Push-positive-effect",
        name: "PUSH",
        section: RollModSection.effect,
        base_status: RollModStatus.ToggledOff,
        posNeg: "positive",
        modType: RollModType.general,
        value: 1,
        effectKeys: ["Cost-Stress2"],
        tooltip: "<h1>Push for Effect</h1><p>For <strong class='red-bright'>2 Stress</strong>, increase your <strong class='gold-bright'>Effect</strong> by one level.</p>"
      },
      {
        key: "Setup-positive-effect",
        name: "Setup",
        section: RollModSection.effect,
        base_status: RollModStatus.Hidden,
        posNeg: "positive",
        modType: RollModType.teamwork,
        value: 1,
        tooltip: "<h1 class='gold-bright'>%DOC_NAME% Sets You Up</h1><p><strong class='gold-bright'>%DOC_NAME%</strong> has set you up for success with a preceding <strong>Setup</strong> action, increasing your <strong class='gold-bright'>Effect</strong> by one level.</p>"
      },
      {
        key: "Potency-positive-effect",
        name: "Potency",
        section: RollModSection.effect,
        base_status: RollModStatus.Hidden,
        posNeg: "positive",
        modType: RollModType.general,
        value: 1,
        tooltip: "<h1>Potency</h1><p>By circumstance or advantage, you have <strong>Potency</strong> in this action, increasing your <strong class='gold-bright'>Effect</strong> by one level.</p>"
      },
      {
        key: "Potency-negative-effect",
        name: "Potency",
        section: RollModSection.effect,
        base_status: RollModStatus.Hidden,
        posNeg: "negative",
        modType: RollModType.general,
        value: 1,
        tooltip: "<h1 class='red-bright'>Potency</h1><p>By circumstance or advantage, <strong class='red-bright'>@OPPOSITION_NAME@</strong> has <strong>Potency</strong> against you, reducing your <strong class='red-bright'>Effect</strong> by one level."
      }
    ];
  }

  static override async New(config: BladesRoll.Config): Promise<BladesActionRoll> {

    // Build link config
    const linkConfig = this.BuildLinkConfig(config);

    const parsedConfig = {
      ...config,
      ...linkConfig
    };

    const rollInst = await this.Create(parsedConfig) as BladesActionRoll;

    return rollInst;
  }

  override get collabTemplate(): string {
    return `systems/eunos-blades/templates/roll/roll-collab-action${game.user.isGM ? "-gm" : ""}.hbs`;
  }

  override get chatTemplate(): string {
    const templateParts: string[] = [
      "systems/eunos-blades/templates/chat/roll-result/action",
      this.rollClockKey ? "-clock" : ""
    ];

    if (this.rollDowntimeAction && [
      DowntimeAction.AcquireAsset, // action-acquireasset
      DowntimeAction.ReduceHeat, //   action-reduceheat
      DowntimeAction.Recover //       action-clock-recover
    ].includes(this.rollDowntimeAction)) {
      templateParts.push(`-${U.lCase(this.rollDowntimeAction)}`);
    } else if (this.rollSubType && [
      RollSubType.GatherInfo //      action-gatherinfo
    ].includes(this.rollSubType)) {
      templateParts.push(`-${U.lCase(this.rollSubType)}`);
    }

    templateParts.push(".hbs");
    return templateParts.join("");
  }

  override get rollResult(): RollResult|false {
    if (!this.isResolved) { return false; }
    if (this.isCritical) {return RollResult.critical;}
    if (this.isSuccess) {return RollResult.success;}
    if (this.isPartial) {return RollResult.partial;}
    return RollResult.fail;
  }

  override async resolveRollResult() {
    eLog.checkLog2("bladesRoll", "[BladesActionRoll] Costs", this.getRollCosts());

    const armorCost = this.getRollCosts()
      .filter((costData) => costData.costType === "Armor")
      .length;

    if (this.rollPrimaryDoc instanceof BladesPC) {
      const stressCost = this.getRollCosts()
        .filter((costData) => costData.costType === "Stress")
        .reduce((acc, costData) => acc + costData.costAmount, 0);
      if (stressCost !== 0) {
        this.rollPrimaryDoc.adjustStress(stressCost);
      }
      const specArmorCost = this.getRollCosts()
        .filter((costData) => costData.costType === "SpecialArmor")
        .length;
      if (specArmorCost !== 0) {
        this.rollPrimaryDoc.spendSpecialArmor();
      }
    }

    if (armorCost !== 0) {
      this.rollPrimary.spendArmor(armorCost);
    }

    this.rollPrimaryDoc?.unsetFlag("eunos-blades", "isWorsePosition");
  }


}

class BladesResistanceRoll extends BladesRoll {

  static override ApplySchemaDefaults<Schema>(config: BladesRoll.Config) {

    // Validate consequenceData
    if (!config.resistanceData || !BladesConsequence.IsValidConsequenceData(config.resistanceData?.consequence)) {
      eLog.error("rollCollab", "[PrepareResistanceRoll] Bad Roll Consequence Data.", config);
      throw new Error("[PrepareResistanceRoll()] Bad Consequence Data for Resistance Roll");
    }

    // Set rollTrait
    config.rollTrait = config.resistanceData.consequence.attribute;

    eLog.checkLog3("bladesRoll", "BladesRoll.PrepareResistanceRoll() [1]", {config});

    return config as Schema;
  }

  static override async New(config: BladesRoll.Config): Promise<BladesResistanceRoll> {

    // Build link config
    const linkConfig = this.BuildLinkConfig(config);

    const parsedConfig = {
      ...config,
      ...linkConfig
    };

    const rollInst = await this.Create(parsedConfig) as BladesResistanceRoll;

    return rollInst;
  }

  override get collabTemplate(): string {
    return `systems/eunos-blades/templates/roll/roll-collab-resistance${game.user.isGM ? "-gm" : ""}.hbs`;
  }

  override get chatTemplate(): string {
    return "systems/eunos-blades/templates/chat/roll-result/resistance.hbs";
  }

  get stressCost(): number {
    if (!this.isResolved) { return 0; }
    const dieVals = [...this.finalDieVals];
    if (this.isCritical) {return -1;}
    return 6 - (dieVals.shift() ?? 0);
  }

  override get rollResult(): number|false {
    if (!this.isResolved) { return false; }
    return this.stressCost;
  }

  override async resolveRollResult() {
    if (this.rollPrimaryDoc instanceof BladesPC && this.stressCost !== 0) {
      this.rollPrimaryDoc.adjustStress(this.stressCost);
    }
  }
}

class BladesInlineResistanceRoll extends BladesResistanceRoll {

  override get chatTemplate(): string {
    return "systems/eunos-blades/templates/chat/components/inline-resistance.hbs";
  }

}

class BladesFortuneRoll extends BladesRoll {

  static override ApplySchemaDefaults<Schema>(config: BladesRoll.Config) {

    // Validate the rollTrait
    if (!(U.isInt(config.rollTrait) || U.lCase(config.rollTrait) in {...ActionTrait, ...AttributeTrait, ...Factor})) {
      throw new Error(`[PrepareFortuneRoll()] Bad RollTrait for Fortune Roll: ${config.rollTrait}`);
    }

    return config as Schema;
  }

  static override async New(config: BladesRoll.Config): Promise<BladesFortuneRoll> {

    // Build link config
    const linkConfig = this.BuildLinkConfig(config);

    const parsedConfig = {
      ...config,
      ...linkConfig
    };

    const rollInst = await this.Create(parsedConfig) as BladesFortuneRoll;

    return rollInst;
  }
}

class BladesIndulgeViceRoll extends BladesRoll {

  static override ApplySchemaDefaults<Schema>(config: BladesRoll.Config) {

    // Validate rollPrimary
    if (!config.rollPrimaryData || !BladesPC.IsType(config.rollPrimaryData.rollPrimaryDoc)) {
      throw new Error("[BladesRoll.PrepareIndulgeViceRollConfig] RollPrimary must be a PC for Indulge Vice rolls.");
    }

    // Set rollTrait
    const {attributes} = config.rollPrimaryData.rollPrimaryDoc;
    const minAttrVal = Math.min(...Object.values(attributes));
    config.rollTrait = U.sample(
      Object.values(AttributeTrait).filter((attr) => attributes[attr] === minAttrVal)
    )[0];

    // Set other known config values
    config.rollDowntimeAction = DowntimeAction.IndulgeVice;

    return config as Schema;
  }

  static override async New(config: BladesRoll.Config): Promise<BladesIndulgeViceRoll> {

    // Build link config
    const linkConfig = this.BuildLinkConfig(config);

    const parsedConfig = {
      ...config,
      ...linkConfig
    };

    const rollInst = await this.Create(parsedConfig) as BladesIndulgeViceRoll;

    return rollInst;
  }

  override get collabTemplate(): string {
    return `systems/eunos-blades/templates/roll/roll-collab-indulgevice${game.user.isGM ? "-gm" : ""}.hbs`;
  }

  override get chatTemplate(): string {
    return "systems/eunos-blades/templates/chat/roll-result/indulgevice.hbs";
  }

  override get rollResult(): number|false {
    if (!this.isResolved) { return false; }
    return this.highestDieVal;
  }
  override async resolveRollResult() {
    if (BladesPC.IsType(this.rollPrimaryDoc)) {
      this.rollPrimaryDoc.indulgeStress(this.highestDieVal);
    }
  }


}

class BladesEngagementRoll extends BladesFortuneRoll {

  override get chatTemplate(): string {
    return "systems/eunos-blades/templates/chat/roll-result/fortune-engagement.hbs";
  }
}

class BladesIncarcerationRoll extends BladesFortuneRoll {

  override get chatTemplate(): string {
    return "systems/eunos-blades/templates/chat/roll-result/fortune-incarceration.hbs";
  }

}

// #region EXPORTS ~
export {
  BladesRollMod,
  BladesRollPrimary,
  BladesRollOpposition,
  BladesRollParticipant
};

export default BladesRoll;

export {
  BladesActionRoll,
  BladesResistanceRoll,
  BladesInlineResistanceRoll,
  BladesFortuneRoll,
  BladesIndulgeViceRoll,
  BladesEngagementRoll,
  BladesIncarcerationRoll
};
// #endregion
