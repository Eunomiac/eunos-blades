// #region IMPORTS ~
import U from "./core/utilities.js";
import C, {BladesActorType, BladesItemType, RollPermissions, RollType, RollSubType, RollModStatus, RollModSection, ActionTrait, DowntimeAction, AttributeTrait, Position, Effect, Factor, RollResult, ConsequenceType} from "./core/constants.js";
import {BladesActor, BladesPC, BladesCrew} from "./documents/BladesActorProxy.js";
import {BladesItem, BladesGMTracker} from "./documents/BladesItemProxy.js";
import {ApplyTooltipListeners} from "./core/gsap.js";
// #endregion
// #region Types & Type Checking ~
function isRollType(str: unknown): str is RollType {
  return typeof str === "string" && str in RollType;
}
function isAction(trait: unknown): trait is BladesRollCollab.RollTrait & ActionTrait {
  return Boolean(trait && typeof trait === "string" && U.lCase(trait) in ActionTrait);
}
function isAttribute(trait: unknown): trait is BladesRollCollab.RollTrait & AttributeTrait {
  return Boolean(trait && typeof trait === "string" && U.lCase(trait) in AttributeTrait);
}
function isFactor(trait: unknown): trait is BladesRollCollab.RollTrait & Factor {
  return Boolean(trait && typeof trait === "string" && U.lCase(trait) in Factor);
}
function isModStatus(str: unknown): str is RollModStatus {
  return typeof str === "string" && str in RollModStatus;
}
// #endregion

// #region *** CLASS *** BladesRollMod
export class BladesRollMod {

  static ParseDocRollMods(doc: BladesDoc): BladesRollCollab.RollModData[] {

    const {roll_mods} = doc.system;
    if (!roll_mods || roll_mods.length === 0) { return [] }

    return (roll_mods
      .filter((elem) => typeof elem === "string") as string[])
      .map((modString) => {
        const pStrings = modString.split(/@/);
        const nameString = U.pullElement(pStrings, (v) => typeof v === "string" && /^na/i.test(v));
        const nameVal = (typeof nameString === "string" && nameString.replace(/^.*:/, ""));
        if (!nameVal) { throw new Error(`RollMod Missing Name: '${modString}'`) }
        const catString = U.pullElement(pStrings, (v) => typeof v === "string" && /^cat/i.test(v));
        const catVal = (typeof catString === "string" && catString.replace(/^.*:/, "")) as RollModSection|false;
        if (!catVal || !(catVal in RollModSection)) { throw new Error(`RollMod Missing Category: '${modString}'`) }
        const posNegString = (U.pullElement(pStrings, (v) => typeof v === "string" && /^p/i.test(v)) || "posNeg:positive");
        const posNegVal = posNegString.replace(/^.*:/, "") as "positive"|"negative";

        const rollModData: BladesRollCollab.RollModData = {
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
          const [keyString, valString] = pString.split(/:/) as [string, string];
          let val: string|string[] = /\|/.test(valString) ? valString.split(/\|/) : valString;
          let key: KeyOf<BladesRollCollab.RollModData>;
          if (/^stat/i.test(keyString)) { key = "base_status" } else
          if (/^val/i.test(keyString)) { key = "value" } else
          if (/^eff|^ekey/i.test(keyString)) { key = "effectKeys" } else
          if (/^side|^ss/i.test(keyString)) { key = "sideString" } else
          if (/^s.*ame/i.test(keyString)) { key = "source_name" } else
          if (/^tool|^tip/i.test(keyString)) { key = "tooltip" } else
          if (/^ty/i.test(keyString)) { key = "modType" } else
          if (/^c.{0,10}r?.{0,3}ty/i.test(keyString)) {key = "conditionalRollTypes"} else
          if (/^a.{0,3}r?.{0,3}y/i.test(keyString)) {key = "autoRollTypes"} else
          if (/^p.{0,10}r?.{0,3}y/i.test(keyString)) {key = "participantRollTypes"} else
          if (/^c.{0,10}r?.{0,3}tr/i.test(keyString)) {key = "conditionalRollTraits"} else
          if (/^a.{0,3}r?.{0,3}tr/i.test(keyString)) {key = "autoRollTraits"} else
          if (/^p.{0,10}r?.{0,3}tr/i.test(keyString)) {key = "participantRollTypes"} else {
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
    if (this.userStatus && [RollModStatus.ForcedOn, RollModStatus.ForcedOff, RollModStatus.Hidden].includes(this.userStatus)) {
      return this.userStatus;
    }
    if (this.heldStatus && [RollModStatus.ToggledOff, RollModStatus.ToggledOn].includes(this.heldStatus)) {
      return this.userStatus ?? this.heldStatus;
    }
    return this.heldStatus ?? this.userStatus ?? this.baseStatus;
  }

  get isActive() { return [RollModStatus.ToggledOn, RollModStatus.ForcedOn].includes(this.status) }
  get isVisible() { return this.status !== RollModStatus.Hidden }

  _heldStatus?: RollModStatus;
  get heldStatus(): RollModStatus | undefined { return this._heldStatus }
  set heldStatus(val: RollModStatus | undefined) {
    this._heldStatus = val;
  }

  get flagParams() { return [C.SYSTEM_ID, `rollCollab.rollModsData.${this.id}`] as const }
  getFlag() { return this.rollInstance.document.getFlag(...this.flagParams) }

  get userStatus(): RollModStatus | undefined {
    return this.rollInstance.document.getFlag(...this.flagParams) as
      ValOf<BladesRollCollab.FlagData["rollModsData"]> | undefined;
  }
  set userStatus(val: RollModStatus | undefined) {
    if (val === this.userStatus) { return }
    if (!val || val === this.baseStatus) {
      this.rollInstance.document.unsetFlag(...this.flagParams);
    } else {
      if ([RollModStatus.ForcedOn, RollModStatus.ForcedOff, RollModStatus.Hidden].includes(val)
        && !game.user.isGM) { return }
      if (this.userStatus && [RollModStatus.ForcedOn, RollModStatus.ForcedOff, RollModStatus.Hidden].includes(this.userStatus)
        && !game.user.isGM) { return }
      this.rollInstance.document.setFlag(...this.flagParams, val);
    }
  }

  get sourceName(): string { return this._sourceName }

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

  get isBasicPush(): boolean { return U.lCase(this.name) === "push" }

  get stressCost(): number {
    const costKeys = this.effectKeys.filter((key) => key.startsWith("Cost-Stress"));
    if (costKeys.length === 0) { return 0 }
    let stressCost = 0;
    costKeys.forEach((key) => {
      const [thisParam] = (key.split(/-/) ?? []).slice(1);
      const [_, valStr] = (/([A-Za-z]+)(\d*)/.exec(thisParam) ?? []).slice(1);
      stressCost += U.pInt(valStr);
    });
    return stressCost;
  }

  /**
   * Sets the conditional status of the roll instance.
   * @returns {boolean} - Returns false if the status is ForcedOn or ToggledOff, true if the status is Hidden.
   */
  setConditionalStatus(): boolean {
    // If the roll instance is not conditional, return false
    if (!this.isConditional) { return false }

    // If any auto-Traits/Types apply, set status to ForcedOn and return false
    const autoTypesOrTraitsApply = this.autoRollTypes.includes(this.rollInstance.rollType)
      || (!this.rollInstance.rollTrait || this.autoRollTraits.includes(this.rollInstance.rollTrait));
    if (autoTypesOrTraitsApply) {
      this.heldStatus = RollModStatus.ForcedOn;
      return false;
    }

    // If any conditionalTypes apply and any conditionalTraits apply, set status to ToggledOff and return false
    const conditionalTypesOrTraitsApply = this.checkTypesOrTraits(this.conditionalRollTypes, this.conditionalRollTraits);
    if (conditionalTypesOrTraitsApply) {
      this.heldStatus = RollModStatus.ToggledOff;
      return false;
    }

    // If this is a participant roll and any participantTypes apply and any participantTraits apply, set status to ToggledOff and return false
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
   * @param {AnyRollType[]} types - The types to check.
   * @param {RollTrait[]} traits - The traits to check.
   * @returns {boolean} - Returns true if any types or traits apply, false otherwise.
   */
  private checkTypesOrTraits(types: BladesRollCollab.AnyRollType[], traits: BladesRollCollab.RollTrait[]): boolean {
    const typesApply = Boolean((!this.rollInstance.isParticipantRoll && types.length === 0)
      || types.includes(this.rollInstance.rollType));
    const traitsApply = Boolean((!this.rollInstance.isParticipantRoll && traits.length === 0)
      || (this.rollInstance.rollTrait && traits.includes(this.rollInstance.rollTrait)));
    return typesApply && traitsApply;
  }

  /**
   * Helper function to process each key
   * @param {string} key - The key to process
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
    if (holdKeys.length === 0) { return false }

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
    if (holdKeys.length === 0) { return false }

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
            return negateOperations[thisParam as KeyOf<typeof negateOperations>]();
          } else {
            throw new Error(`Unrecognized Negate parameter: ${thisParam}`);
          }
        } else if (thisKey === "Increase") {
          const [_, traitStr] = /(\w+)\d+/.exec(thisParam) ?? [];
          return this.rollInstance.isTraitRelevant(traitStr as BladesRollCollab.RollTrait);
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
    if (holdKeys.length === 0) { return false }

    const payableKeys = holdKeys
      .filter((key) => {
        const [thisParam] = (key.split(/-/) ?? []).slice(1);
        const [traitStr, valStr] = (/([A-Za-z]+)(\d*)/.exec(thisParam) ?? []).slice(1);
        const {rollPrimaryDoc} = this.rollInstance.rollPrimary ?? {};
        if (!BladesRollPrimary.IsDoc(rollPrimaryDoc)) { return false }
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
    if (!this.isActive) { return }

    const holdKeys = this.effectKeys.filter((key) => /^Negate|^Increase/.test(key));
    if (holdKeys.length === 0) { return }

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
          /* Should cancel roll entirely? */
        },
        HarmLevel: () => {
          if (!this.rollInstance.rollConsequence) { return }
          const consequenceType = this.rollInstance.rollConsequence.type;
          if (!consequenceType?.startsWith("Harm")) { return }
          const curLevel = [ConsequenceType.Harm1, ConsequenceType.Harm2, ConsequenceType.Harm3, ConsequenceType.Harm4]
            .findIndex((cType) => cType === consequenceType) + 1;
          if (curLevel > 1) {
            this.rollInstance.rollConsequence.type = `Harm${curLevel - 1}` as ConsequenceType;
          } else {
            /* Should cancel roll entirely? */
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
          return negateOperations[thisParam as KeyOf<typeof negateOperations>]();
        } else {
          throw new Error(`Unrecognized Negate parameter: ${thisParam}`);
        }
      } else if (thisKey === "Increase") {
        const [_, traitStr] = /(\w+)\d+/.exec(thisParam) ?? [];
        return this.rollInstance.isTraitRelevant(traitStr as BladesRollCollab.RollTrait);
      } else {
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

  get sideString(): string | undefined {
    if (this._sideString) { return this._sideString }
    switch (this.category) {
      case RollModSection.roll: {
        if (this.name === "Assist") {
          const docID = this.rollInstance.document.getFlag("eunos-blades", "rollCollab.docSelections.roll.Assist") as MaybeStringOrFalse;
          if (!docID) { return undefined }
          return (game.actors.get(docID) ?? game.items.get(docID))?.name ?? undefined;
        }
        return undefined;
      }
      case RollModSection.position: {
        if (this.name === "Setup") {
          const docID = this.rollInstance.document.getFlag("eunos-blades", "rollCollab.docSelections.position.Setup") as MaybeStringOrFalse;
          if (!docID) { return undefined }
          return (game.actors.get(docID) ?? game.items.get(docID))?.name ?? undefined;
        }
        return undefined;
      }
      case RollModSection.effect: {
        if (this.name === "Setup") {
          const docID = this.rollInstance.document.getFlag("eunos-blades", "rollCollab.docSelections.effect.Setup") as MaybeStringOrFalse;
          if (!docID) { return undefined }
          return (game.actors.get(docID) ?? game.items.get(docID))?.name ?? undefined;
        }
        return undefined;
      }
      default: return undefined;
    }
  }

  get allFlagData(): BladesRollCollab.FlagData {
    return this.rollInstance.document.getFlag("eunos-blades", "rollCollab") as BladesRollCollab.FlagData;
  }

  get data(): BladesRollCollab.RollModData {
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

  get costs(): BladesRollCollab.CostData[] | undefined {
    if (!this.isActive) { return undefined }
    const holdKeys = this.effectKeys.filter((key) => key.startsWith("Cost"));
    if (holdKeys.length === 0) { return undefined }

    return holdKeys.map((key) => {
      const [thisParam] = (key.split(/-/) ?? []).slice(1);
      const [traitStr, valStr] = (/([A-Za-z]+)(\d*)/.exec(thisParam) ?? []).slice(1);

      let label = this.name;
      if (this.isBasicPush) {
        if (this.posNeg === "negative") {
          label = `${this.name} (<span class='red-bright'>To Act</span>)`;
        } else {
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

  id: string;
  name: string;
  _sourceName: string;
  baseStatus: RollModStatus;
  value: number;
  effectKeys: string[];
  _sideString?: string;
  _tooltip: string;
  posNeg: "positive" | "negative";
  isOppositional: boolean;
  modType: BladesRollCollab.ModType;
  conditionalRollTypes: BladesRollCollab.AnyRollType[];
  autoRollTypes: BladesRollCollab.AnyRollType[];
  participantRollTypes: BladesRollCollab.AnyRollType[];
  conditionalRollTraits: BladesRollCollab.RollTrait[];
  autoRollTraits: BladesRollCollab.RollTrait[];
  participantRollTraits: BladesRollCollab.RollTrait[];
  category: RollModSection;

  rollInstance: BladesRollCollab;

  constructor(modData: BladesRollCollab.RollModData, rollInstance: BladesRollCollab) {
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
// #endregion *** CLASS *** BladesRollMod

// #region *** CLASSES *** BladesRollPrimary, BladesRollOpposition, BladesRollParticipant
class BladesRollPrimary implements BladesRollCollab.PrimaryDocData {

  // #region Static Methods ~
  static IsValidData(data: unknown): data is BladesRollCollab.PrimaryDocData {
    if (BladesRollPrimary.IsDoc(data)) { return true }
    return U.isList(data)
      && typeof data.rollPrimaryName === "string"
      && typeof data.rollPrimaryType === "string"
      && typeof data.rollPrimaryImg === "string"
      && Array.isArray(data.rollModsData)
      && U.isList(data.rollFactors)
      && (!data.rollPrimaryID || typeof data.rollPrimaryID === "string")
      && (!data.rollPrimaryDoc || BladesRollPrimary.IsDoc(data.rollPrimaryDoc));
  }
  static IsDoc(doc: unknown): doc is BladesRollCollab.PrimaryDoc {
    return BladesActor.IsType(doc, BladesActorType.pc, BladesActorType.crew)
      || BladesItem.IsType(doc, BladesItemType.cohort_expert, BladesItemType.cohort_gang, BladesItemType.gm_tracker);
  }
  // #endregion

  rollInstance: BladesRollCollab;

  rollPrimaryID: string|undefined;
  rollPrimaryDoc: BladesRollCollab.PrimaryDoc|undefined;

  rollPrimaryName: string;
  rollPrimaryType: string;
  rollPrimaryImg: string;
  rollModsData: BladesRollCollab.RollModData[];
  rollFactors: Partial<Record<Factor,BladesRollCollab.FactorData>>;

  // #region Constructor ~
  constructor(rollInstance: BladesRollCollab, {rollPrimaryID, rollPrimaryDoc, rollPrimaryName, rollPrimaryType, rollPrimaryImg, rollModsData, rollFactors}: BladesRollCollab.PrimaryDocData) {
    // Identify ID, Doc, Name, SubName, Type & Image, to best of ability
    this.rollInstance = rollInstance;
    let doc: BladesDoc|undefined = rollPrimaryDoc;
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
      this.rollModsData = [
        ...rollModsData ?? [],
        ...this.rollPrimaryDoc.rollModsData ?? []
      ];
      this.rollFactors = Object.assign(
        this.rollPrimaryDoc.rollFactors,
        rollFactors ?? {}
      );
    } else {
      if (!rollPrimaryName) { throw new Error("Must include a rollPrimaryName when constructing a BladesRollPrimary object.") }
      if (!rollPrimaryImg) { throw new Error("Must include a rollPrimaryImg when constructing a BladesRollPrimary object.") }
      if (!rollPrimaryType) { throw new Error("Must include a rollPrimaryType when constructing a BladesRollPrimary object.") }
      if (!rollFactors) { throw new Error("Must include a rollFactors when constructing a BladesRollPrimary object.") }

      this.rollPrimaryID = rollPrimaryID;
      this.rollPrimaryName = rollPrimaryName;
      this.rollPrimaryType = rollPrimaryType;
      this.rollPrimaryImg = rollPrimaryImg;
      this.rollModsData = rollModsData ?? [];
      this.rollFactors = rollFactors;
    }
  }
  // #endregion
}

class BladesRollOpposition implements BladesRollCollab.OppositionDocData {

  // #region Static Methods ~
  static IsValidData(data: unknown): data is BladesRollCollab.OppositionDocData {
    if (BladesRollOpposition.IsDoc(data)) { return true }
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
  static IsDoc(doc: unknown): doc is BladesRollCollab.OppositionDoc {
    return BladesActor.IsType(doc, BladesActorType.npc, BladesActorType.faction)
      || BladesItem.IsType(doc, BladesItemType.cohort_expert, BladesItemType.cohort_gang, BladesItemType.gm_tracker, BladesItemType.project, BladesItemType.design, BladesItemType.ritual);
  }
  // #endregion

  rollInstance: BladesRollCollab;
  rollOppID: string|undefined;
  rollOppDoc: BladesRollCollab.OppositionDoc|undefined;
  rollOppName: string;
  rollOppSubName: string;
  rollOppType: string;
  rollOppImg: string;
  rollOppModsData: BladesRollCollab.RollModData[]|undefined;
  rollFactors: Partial<Record<Factor, BladesRollCollab.FactorData>>;

  // #region Constructor ~
  constructor(rollInstance: BladesRollCollab, {rollOppID, rollOppDoc, rollOppName, rollOppSubName, rollOppType, rollOppImg, rollOppModsData, rollFactors}: Partial<BladesRollCollab.OppositionDocData> = {}) {
    // Identify ID, Doc, Name, SubName, Type & Image, to best of ability
    this.rollInstance = rollInstance;
    let doc: BladesDoc|undefined = rollOppDoc;
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
      this.rollFactors = Object.assign(
        this.rollOppDoc.rollFactors,
        rollFactors ?? {}
      );
    } else {
      if (!rollOppName) { throw new Error("Must include a rollOppName when constructing a BladesRollOpposition object.") }
      if (!rollOppSubName) { throw new Error("Must include a rollOppSubName when constructing a BladesRollOpposition object.") }
      if (!rollOppType) { throw new Error("Must include a rollOppType when constructing a BladesRollOpposition object.") }
      if (!rollFactors) { throw new Error("Must include a rollFactors when constructing a BladesRollOpposition object.") }

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
  // #endregion
}

class BladesRollParticipant implements BladesRollCollab.ParticipantDocData {

  // #region Static Methods ~
  static IsValidData(data: unknown): data is BladesRollCollab.ParticipantDocData {
    if (BladesRollParticipant.IsDoc(data)) { return true }
    return U.isList(data)
      && typeof data.rollParticipantName === "string"
      && typeof data.rollParticipantType === "string"
      && typeof data.rollParticipantIcon === "string"
      && (!data.rollParticipantModsData || Array.isArray(data.rollParticipantModsData))
      && U.isList(data.rollFactors)
      && (!data.rollParticipantID || typeof data.rollParticipantID === "string")
      && (!data.rollParticipantDoc || BladesRollParticipant.IsDoc(data.rollParticipantDoc));
  }
  static IsDoc(doc: unknown): doc is BladesRollCollab.ParticipantDoc {
    return BladesActor.IsType(doc, BladesActorType.pc, BladesActorType.crew, BladesActorType.npc)
      || BladesItem.IsType(doc, BladesItemType.cohort_expert, BladesItemType.cohort_gang, BladesItemType.gm_tracker);
  }
  // #endregion

  rollInstance: BladesRollCollab;
  rollParticipantID: string|undefined;
  rollParticipantDoc: BladesRollCollab.ParticipantDoc|undefined;
  rollParticipantName: string;
  rollParticipantType: string;
  rollParticipantIcon: string;

  rollParticipantModsData: BladesRollCollab.RollModData[]|undefined; // As applied to MAIN roll when this participant involved
  rollFactors: Partial<Record<Factor,BladesRollCollab.FactorData>>;

  // #region Constructor ~
  constructor(rollInstance: BladesRollCollab, {rollParticipantID, rollParticipantDoc, rollParticipantName, rollParticipantType, rollParticipantIcon, rollParticipantModsData, rollFactors}: Partial<BladesRollCollab.ParticipantDocData> = {}) {
    // Identify ID, Doc, Name, SubName, Type & Image, to best of ability
    this.rollInstance = rollInstance;
    let doc: BladesDoc|undefined = rollParticipantDoc;
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
      this.rollFactors = Object.assign(
        this.rollParticipantDoc.rollFactors,
        rollFactors ?? {}
      );
    } else {
      if (!rollParticipantName) { throw new Error("Must include a rollParticipantName when constructing a BladesRollParticipant object.") }
      if (!rollParticipantType) { throw new Error("Must include a rollParticipantType when constructing a BladesRollParticipant object.") }
      if (!rollParticipantIcon) { throw new Error("Must include a rollParticipantIcon when constructing a BladesRollParticipant object.") }
      if (!rollFactors) { throw new Error("Must include a rollFactors when constructing a BladesRollParticipant object.") }

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
  // #endregion

}
// #endregion *** CLASSES *** BladesRollPrimary, BladesRollOpposition, BladesRollParticipant

// #region *** CLASS *** BladesRollCollab
class BladesRollCollab extends DocumentSheet {

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
      // height: 500
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
    socketlib.system.register("renderRollCollab", BladesRollCollab.RenderRollCollab);
    socketlib.system.register("closeRollCollab", BladesRollCollab.CloseRollCollab);
  }

  static get DefaultRollMods(): BladesRollCollab.RollModData[] {
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
  static get DefaultFlagData(): Omit<BladesRollCollab.FlagData, "rollPrimaryData"|"rollID"|"storageDocID"|"rollType"> {
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
  // #endregion

  // #region STATIC METHODS: New Roll Creation ~
  static Current: Record<string, BladesRollCollab> = {};

  static _Active?: BladesRollCollab;
  static get Active(): BladesRollCollab|undefined {
    if (BladesRollCollab._Active) { return BladesRollCollab._Active }
    if (U.objSize(BladesRollCollab.Current) > 0) { return Object.values(BladesRollCollab.Current)[0] }
    return undefined;
  }
  static set Active(val: BladesRollCollab|undefined) {
    BladesRollCollab._Active = val;
  }

  static async RenderRollCollab({storageID, rollID, rollPermission}: {userID: string, storageID: string, rollID: string, rollPermission: RollPermissions}) {
    const rollInst = new BladesRollCollab(storageID, rollID, rollPermission);
    await rollInst._render(true);
  }

  static async CloseRollCollab(rollID: string) {
    eLog.checkLog3("rollCollab", "CloseRollCollab()", {rollID});
    await BladesRollCollab.Current[rollID]?.close({rollID});
    delete BladesRollCollab.Current[rollID];
  }

  /**
   * This static method accepts a partial version of the config options required
   * to build a BladesRollCollab instance, sets the requisite flags on the storage
   * document, then sends out a socket call to the relevant users to construct
   * and display the roll instance.
   *
   * @param config - The configuration object for the new roll.
   */
  static async NewRoll(config: Partial<BladesRollCollab.Config>) {
    // If no rollType is provided, throw an error.
    if (!isRollType(config.rollType)) {
      throw new Error("[BladesRollCollab.NewRoll()] You must provide a valid rollType in the config object.");
    }

    // If no rollStorageID is provided, attempt to derive it from the rest of the config object
    if (!config.rollStorageID) {
      if (config.rollPrimaryData instanceof BladesActor || config.rollPrimaryData instanceof BladesItem) {
        config.rollStorageID = config.rollPrimaryData.id;
      } else if (typeof config.rollPrimaryData?.rollPrimaryID === "string") {
        config.rollStorageID = config.rollPrimaryData.rollPrimaryID;
      } else if (!game.user.isGM && game.user instanceof User && BladesRollPrimary.IsDoc(game.user.character)) {
        config.rollStorageID = game.user.character.id;
      }
    }
    const rollStorageDoc = game.actors.get(config.rollStorageID ?? "") ?? game.items.get(config.rollStorageID ?? "") ?? false;
    if (!rollStorageDoc) {
      throw new Error("[BladesRollCollab.NewRoll()] A valid rollStorage document must be provided to construct a roll.");
    }

    // If no rollPrimaryData is provided, attempt to derive it from the rest of the config object
    if (!BladesRollPrimary.IsValidData(config.rollPrimaryData)) {
      let rollPrimarySourceData: BladesRollCollab.PrimaryDocData;
      // If the user is a player with a BladesPC character, assume that is rollPrimary.
      if (!game.user.isGM && BladesPC.IsType(game.user.character)) {
        rollPrimarySourceData = game.user.character;
      // If the storageDoc is a valid rollPrimary, assume that is rollPrimary.
      } else if (BladesRollPrimary.IsDoc(rollStorageDoc)) {
        rollPrimarySourceData = rollStorageDoc;
      } else {
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
    const rollPrimaryDoc: BladesActor|BladesItem|undefined = game.actors.get(config.rollPrimaryData.rollPrimaryID ?? "")
      ?? game.items.get(config.rollPrimaryData.rollPrimaryID ?? "");

    // Create a random ID for storing the roll instance
    const rollID = randomID();

    const flagUpdateData: BladesRollCollab.FlagData = {
      ...BladesRollCollab.DefaultFlagData,
      rollID,
      storageDocID: rollStorageDoc.id,
      rollType: config.rollType,
      rollPrimaryData: config.rollPrimaryData
    };

    // Set the rollTrait based on the rollType and rollPrimary
    if (U.isInt(config.rollTrait)) {
      flagUpdateData.rollTrait = config.rollTrait;
    } else if (!U.isNullish(config.rollTrait)) {
      const rollTrait = typeof config.rollTrait === "string" ? U.lCase(config.rollTrait) : config.rollTrait;
      // Validate the rollTrait based on the rollType
      switch (flagUpdateData.rollType) {
        case RollType.IndulgeVice: {
          if (BladesPC.IsType(rollPrimaryDoc)) {
            const minAttrVal = Math.min(...Object.values(rollPrimaryDoc.attributes));
            flagUpdateData.rollTrait = U.objFindKey(rollPrimaryDoc.attributes, (val: number) => val === minAttrVal) as AttributeTrait;
          }
          break;
        }
        case RollType.Action: {
          if (!(rollTrait in {...ActionTrait, ...Factor})) {
            eLog.error("rollCollab", `[RenderRollCollab()] Bad RollTrait for Action Roll: ${rollTrait}`, config);
            return;
          }
          flagUpdateData.rollTrait = rollTrait as ActionTrait | Factor;
          break;
        }
        case RollType.Fortune: {
          if (!(rollTrait in {...ActionTrait, ...AttributeTrait, ...Factor} || U.isInt(rollTrait))) {
            eLog.error("rollCollab", `[RenderRollCollab()] Bad RollTrait for Fortune Roll: ${rollTrait}`, config);
            return;
          }
          flagUpdateData.rollTrait = rollTrait as ActionTrait | AttributeTrait | Factor | int;
          break;
        }
        case RollType.Resistance: {
          if (!(rollTrait in AttributeTrait)) {
            eLog.error("rollCollab", `[RenderRollCollab()] Bad RollTrait for Resistance Roll: ${rollTrait}`, config);
            return;
          }
          break;
        }
        default: throw new Error(`Unrecognized RollType: ${flagUpdateData.rollType}`);
      }
    }

    // Log the roll data
    eLog.checkLog3("bladesRoll", "BladesRollCollab.NewRoll()", {flagUpdateData, rollPrimaryData: flagUpdateData.rollPrimaryData});

    // Store the roll data on the storage document
    if (rollStorageDoc instanceof BladesActor) {
      await rollStorageDoc.setFlag(C.SYSTEM_ID, `rollCollab.${flagUpdateData.rollID}`, flagUpdateData);
    } else if (rollStorageDoc instanceof BladesItem) {
      await rollStorageDoc.setFlag(C.SYSTEM_ID, `rollCollab.${flagUpdateData.rollID}`, flagUpdateData);
    } else {
      throw new Error("rollStorageDoc must be an instance of Actor or Item");
    }

    // Compile the list of users for whom the roll will be displayed
    const userIDs: {
      primary: string[],
      participants: string[],
      observers: string[]
    } = {
      primary: [],
      participants: [],
      observers: []
    };

    const primaryUserIDs = game.users
      .filter((user) => BladesPC.IsType(user.character) && !user.isGM && typeof user.id === "string")
      .map((user) => user.id as string);
    const GMUserID = game.users.find((user) => user.isGM)?.id;
    if (!GMUserID) {
      throw new Error("No GM found!");
    }
    if (BladesPC.IsType(rollPrimaryDoc) && typeof rollPrimaryDoc.primaryUser?.id === "string") {
      userIDs.primary.push(rollPrimaryDoc.primaryUser.id);
    } else if (BladesCrew.IsType(rollPrimaryDoc)
      || BladesItem.IsType(rollPrimaryDoc, BladesItemType.cohort_gang, BladesItemType.cohort_expert)) {
      userIDs.primary.push(...primaryUserIDs);
    } else if (BladesGMTracker.IsType(rollPrimaryDoc)) {
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
            } else if (typeof pData.rollParticipantID === "string") {
              const pDoc = game.actors.get(pData.rollParticipantID) ?? game.items.get(pData.rollParticipantID);
              if (BladesRollParticipant.IsDoc(pDoc)) {
                return pDoc;
              }
            }
          }
          return null as never;
        })
        .map((pDoc) => {
          if (BladesPC.IsType(pDoc) && typeof pDoc.primaryUser?.id === "string") {
            return pDoc.primaryUser.id;
          } else if (BladesCrew.IsType(rollPrimaryDoc)
            || BladesItem.IsType(rollPrimaryDoc, BladesItemType.cohort_gang, BladesItemType.cohort_expert)) {
            return primaryUserIDs;
          }
          return null as never;
        })
        .flat()
        .filter((pUser) => pUser !== null && !userIDs.primary.includes(pUser));
      userIDs.participants.push(...participantUsers);
      userIDs.observers = userIDs.observers.filter((uID) => !userIDs.participants.includes(uID));
    }

    // Send out socket calls to all users to see the roll.
    socketlib.system.executeForAllGMs("renderRollCollab", {storageID: rollStorageDoc.id, rollID, rollPermission: RollPermissions.GM});
    socketlib.system.executeForUsers("renderRollCollab", userIDs.primary, {storageID: rollStorageDoc.id, rollID, rollPermission: RollPermissions.Primary});
    socketlib.system.executeForUsers("renderRollCollab", userIDs.participants, {storageID: rollStorageDoc.id, rollID, rollPermission: RollPermissions.Participant});
    socketlib.system.executeForUsers("renderRollCollab", userIDs.observers, {storageID: rollStorageDoc.id, rollID, rollPermission: RollPermissions.Observer});
  }
  // #endregion

  // #region Constructor ~
  storageID: string;
  rollID: string;
  rollPermission: RollPermissions;
  _rollPrimary: BladesRollPrimary;
  _rollOpposition?: BladesRollOpposition;
  _rollParticipants?: BladesRollCollab.RollParticipantDocs;

  constructor(storageID: string, rollID: string, rollPermission: RollPermissions) {
    const storageDoc = game.actors.get(storageID) ?? game.items.get(storageID);
    if (!storageDoc) {
      throw new Error(`Unable to retrieve storage document with ID '${storageID}'`);
    }
    super(storageDoc);
    this.storageID = storageID;
    this.rollID = rollID;
    this.rollPermission = rollPermission;
    const rollFlagData = storageDoc.getFlag(C.SYSTEM_ID, `rollCollab.${rollID}`) as BladesRollCollab.FlagData;
    this._rollPrimary = new BladesRollPrimary(this, rollFlagData.rollPrimaryData);
    if (rollFlagData.rollOppData) {
      this._rollOpposition = new BladesRollOpposition(this, rollFlagData.rollOppData);
    }
    if (rollFlagData.rollParticipantData) {
      this._rollParticipants = {};
      for (const [rollSection, rollParticipantList] of Object.entries(rollFlagData.rollParticipantData)) {
        if ([RollModSection.roll, RollModSection.position, RollModSection.effect].includes(rollSection as RollModSection) && !U.isEmpty(rollParticipantList)) {
          const sectionParticipants: Record<string, BladesRollParticipant> = {};
          for (const [participantType, participantData] of Object.entries(rollParticipantList)) {
            sectionParticipants[participantType] = new BladesRollParticipant(this, participantData);
          }
          this._rollParticipants[rollSection as RollModSection.roll|RollModSection.position|RollModSection.effect] = sectionParticipants;
        }
      }
    }
    BladesRollCollab.Current[this.rollID] = this;
  }
  // #endregion
  // #endregion

  // #region Basic User Flag Getters/Setters ~
  get flagData(): BladesRollCollab.FlagData {
    if (!this.document.getFlag(C.SYSTEM_ID, `rollCollab.${this.rollID}`)) {
      throw new Error("[get flags()] No RollCollab Flags Found on Storage Document");
    }
    return this.document.getFlag(C.SYSTEM_ID, `rollCollab.${this.rollID}`) as BladesRollCollab.FlagData;
  }

  get rollPrimary(): BladesRollPrimary {
    return this._rollPrimary;
  }

  get rollOpposition(): BladesRollOpposition|undefined {
    if (this._rollOpposition instanceof BladesRollOpposition) {
      return this._rollOpposition;
    }
    return undefined;
  }
  set rollOpposition(val: BladesRollOpposition | undefined) {
    if (val === undefined) {
      this._rollOpposition = undefined;
    } else {
      this._rollOpposition = val;
    }
  }

  get rollParticipants(): BladesRollCollab.RollParticipantDocs | undefined {
    return this._rollParticipants;
  }

  // get rollParticipants(): Array<BladesRollCollab.


  get rollType(): RollType { return this.flagData.rollType }
  get rollSubType(): RollSubType|undefined { return this.flagData.rollSubType }
  get rollDowntimeAction(): DowntimeAction|undefined { return this.flagData.rollDowntimeAction }
  get rollTrait(): BladesRollCollab.RollTrait|undefined { return this.flagData.rollTrait }

  _rollTraitValOverride?: number;
  get rollTraitValOverride(): number | undefined { return this._rollTraitValOverride }
  set rollTraitValOverride(val: number | undefined) { this._rollTraitValOverride = val }
  get rollTraitData(): NamedValueMax & {gmTooltip?: string, pcTooltip?: string} {
    const {rollPrimaryDoc} = this.rollPrimary ?? {};
    if (!BladesRollPrimary.IsDoc(rollPrimaryDoc)) { throw new Error("[get rollTraitData()] Missing Roll Primary!") }
    if (BladesActor.IsType(rollPrimaryDoc, BladesActorType.pc)) {
      if (isAction(this.rollTrait)) {
        return {
          name: this.rollTrait,
          value: this.rollTraitValOverride ?? rollPrimaryDoc.actions[this.rollTrait],
          max: this.rollTraitValOverride ?? rollPrimaryDoc.actions[this.rollTrait],
          pcTooltip: rollPrimaryDoc.rollTraitPCTooltipActions,
          gmTooltip: C.ActionTooltipsGM[this.rollTrait]
        };
      }
      if (isAttribute(this.rollTrait)) {
        return {
          name: this.rollTrait,
          value: this.rollTraitValOverride ?? rollPrimaryDoc.attributes[this.rollTrait],
          max: this.rollTraitValOverride ?? rollPrimaryDoc.attributes[this.rollTrait],
          pcTooltip: rollPrimaryDoc.rollTraitPCTooltipAttributes,
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
        value: this.rollTraitValOverride ?? this.rollPrimary?.rollFactors[this.rollTrait]?.value ?? 0,
        max: this.rollTraitValOverride ?? this.rollPrimary?.rollFactors[this.rollTrait]?.max ?? 10
      };
    }
    throw new Error(`[get rollTraitData] Invalid rollTrait: '${this.rollTrait}'`);
  }
  get rollTraitOptions(): Array<{ name: string, value: BladesRollCollab.RollTrait }> {
    if (BladesActor.IsType(this.rollPrimary, BladesActorType.pc)) {
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
  get initialPosition(): Position {
    return this.flagData?.rollPositionInitial ?? Position.risky;
  }
  set initialPosition(val: Position) {
    this.document.setFlag(C.SYSTEM_ID, "rollCollab.rollPositionInitial", val);
  }
  get initialEffect(): Effect {
    return this.flagData?.rollEffectInitial ?? Effect.standard;
  }
  set initialEffect(val: Effect) {
    this.document.setFlag(C.SYSTEM_ID, "rollCollab.rollEffectInitial", val);
  }
  get rollConsequence(): BladesRollCollab.ConsequenceData | undefined {
    return this.flagData?.rollConsequence;
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

  get rollFactors(): Record<"source" | "opposition", Partial<Record<Factor, BladesRollCollab.FactorData>>> {
    const sourceFactors: Partial<Record<Factor, BladesRollCollab.FactorData>> = Object.fromEntries((Object.entries(this.rollPrimary?.rollFactors ?? {}) as Array<[Factor, BladesRollCollab.FactorData]>)
      .map(([factor, factorData]) => [
        factor,
        {
          ...factorData,
          ...this.flagData.rollFactorToggles.source[factor] ?? []
        }
      ]));
    Object.entries(this.flagData.rollFactorToggles.source).forEach(([factor, factorData]) => {
      if (!(factor in sourceFactors)) {
        sourceFactors[factor as Factor] = {
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
        if (!factorData) { return }
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
    const oppFactors: Partial<Record<Factor, BladesRollCollab.FactorData>> = {};


    Object.entries(rollOppFactors)
      .forEach(([factor, factorData]) => {
        if (!isFactor(factor)) { return }
        oppFactors[factor] = {
          ...factorData,
          ...this.flagData.rollFactorToggles.opposition[factor] ?? []
        };
      });

    Object.entries(this.flagData.rollFactorToggles.opposition)
      .forEach(([factor, factorData]) => {
        if (!isFactor(factor)) { return }
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
      if (!isFactor(factor)) { return }
      const factorData = oppFactors[factor];
      if (!factorData) { return }
      factorData.value += this.flagData.GMOppBoosts[factor as Factor] ?? 0;
      if (factor === Factor.tier) {
        factorData.display = U.romanizeNum(factorData.value);
      } else {
        factorData.display = `${factorData.value}`;
      }
    });

    return {
      source: sourceFactors,
      opposition: oppFactors
    };
  }
  // #endregion

  // #region ROLL MODS: Getters & Update Method ~

  initRollMods(modsData: BladesRollCollab.RollModData[]) {
    // Reset override values previously enabled by rollmods
    this.rollTraitValOverride = undefined;
    this.rollFactorPenaltiesNegated = {};
    this.tempGMBoosts = {};

    this.rollMods = modsData.map((modData) => new BladesRollMod(modData, this));

    const initReport: Record<string, Record<string, Partial<Record<"mod"|"status"|"user_status"|"held_status"|"base_status",string|BladesRollMod|undefined>>|null>> = {};

    /* *** PASS ONE: DISABLE PASS *** */

    this.rollMods
      // ... Conditional Status Pass
      .filter((rollMod) => !rollMod.setConditionalStatus())
      // ... AutoReveal/AutoEnable Pass
      .filter((rollMod) => !rollMod.setAutoStatus())
      // ... Payable Pass
      .forEach((rollMod) => { rollMod.setPayableStatus() });

    /* *** PASS TWO: FORCE-ON PASS *** */
    const parseForceOnKeys = (mod: BladesRollMod) => {
      const holdKeys = mod.effectKeys.filter((key) => key.startsWith("ForceOn"));
      if (holdKeys.length === 0) { return }

      while (holdKeys.length) {
        const thisTarget = holdKeys.pop()?.split(/-/)?.pop();
        if (thisTarget === "BestAction") {
          const {rollPrimaryDoc} = this.rollPrimary ?? {};
          if (BladesActor.IsType(rollPrimaryDoc, BladesActorType.pc)) {
            this.rollTraitValOverride = Math.max(...Object.values(rollPrimaryDoc.actions));
          }
        } else {
          const [targetName, targetCat, targetPosNeg] = thisTarget?.split(/,/) as [string, RollModSection | undefined, "positive" | "negative" | undefined] | undefined ?? [];
          if (!targetName) { throw new Error(`No targetName found in thisTarget: ${thisTarget}.`)}
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
          if (!targetMod) { throw new Error(`No mod found matching ${targetName}/${targetCat}/${targetPosNeg}`) }
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
        .forEach((mod) => { mod.heldStatus = RollModStatus.ForcedOff });
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
          .forEach((mod) => { mod.heldStatus = RollModStatus.Hidden});
      }
    });

    /* *** PASS FOUR: Relevancy Pass *** */

    this.getVisibleRollMods()
      .forEach((mod) => { mod.setRelevancyStatus() });

    /* *** PASS FIVE: Overpayment Pass *** */

    // ... If 'Cost-SpecialArmor' active, ForceOff other visible Cost-SpecialArmor mods
    const activeArmorCostMod = this.getActiveRollMods().find((mod) => mod.effectKeys.includes("Cost-SpecialArmor"));
    if (activeArmorCostMod) {
      this.getVisibleRollMods()
        .filter((mod) => !mod.isActive && mod.effectKeys.includes("Cost-SpecialArmor"))
        .forEach((mod) => { mod.heldStatus = RollModStatus.ForcedOff });
    }

    eLog.checkLog2("rollMods", "*** initRollMods() PASS ***", initReport);
  }

  isTraitRelevant(trait: BladesRollCollab.RollTrait): boolean {
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

  isPushed(cat?: RollModSection, posNeg?: "positive"|"negative"): boolean { return this.getActiveBasicPushMods(cat, posNeg).length > 0 }
  hasOpenPush(cat?: RollModSection, posNeg?: "positive"|"negative"): boolean { return this.isPushed(cat) && this.getOpenPushMods(cat, posNeg).length > 0 }
  isForcePushed(cat?: RollModSection, posNeg?: "positive"|"negative"): boolean { return this.isPushed(cat) && this.getForcedPushMods(cat, posNeg).length > 0 }


  get rollCosts(): number {
    if (!this.isPushed) { return 0 }
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

  get rollCostData(): BladesRollCollab.CostData[] {
    return this.getActiveRollMods()
      .map((rollMod) => rollMod.costs ?? [])
      .flat();
  }

  getRollModByName(name: string, cat?: RollModSection, posNeg?: "positive" | "negative"): BladesRollMod | undefined {
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
    if (modMatches.length === 0) { return undefined }
    if (modMatches.length > 1) {
      return undefined;
    }
    return modMatches[0];
  }
  getRollModByID(id: string) { return this.rollMods.find((rollMod) => rollMod.id === id) }
  getRollMods(cat?: RollModSection, posNeg?: "positive" | "negative") {
    return this.rollMods.filter((rollMod) =>
      (!cat || rollMod.category === cat)
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
   * @param modA - First mod to compare.
   * @param modB - Second mod to compare.
   * @returns {number} - Comparison result.
   */
  private compareMods(modA: BladesRollMod, modB: BladesRollMod): number {
    // Define the order of mod names for sorting
    const modOrder = ["Bargain", "Assist", "Setup"];

    // Check for basic push
    if (modA.isBasicPush) {return -1}
    if (modB.isBasicPush) {return 1}

    // Check for active Bargain
    if (modA.name === "Bargain" && modA.isActive) {return -1}
    if (modB.name === "Bargain" && modB.isActive) {return 1}

    // Check for push
    if (modA.isPush) {return -1}
    if (modB.isPush) {return 1}

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
    if (!this._rollMods) { throw new Error("[get rollMods] No roll mods found!") }
    return [...this._rollMods].sort((modA: BladesRollMod, modB: BladesRollMod) => this.compareMods(modA, modB));
  }
  set rollMods(val: BladesRollMod[]) { this._rollMods = val }

  // #endregion

  // #region *** GETDATA *** ~

  /**
 * Retrieve the data for rendering the base RollCollab sheet.
 * @returns {Promise<Object>} The data which can be used to render the HTML of the sheet.
 */
  override async getData() {
    const context = super.getData();

    if (!this.rollPrimary) {throw new Error("No roll source configured for roll.")}

    this.initRollMods(this.getRollModsData());
    this.rollMods.forEach((rollMod) => rollMod.applyRollModEffectKeys());

    const sheetData = this.getSheetData(this.getIsGM(), this.getRollCosts());

    return {...context, ...sheetData};
  }

  /**
* Gets the roll modifications data.
* @returns {BladesRollCollab.RollModData[]} The roll modifications data.
*/
  private getRollModsData(): BladesRollCollab.RollModData[] {
    const defaultMods = [
      ...BladesRollCollab.DefaultRollMods,
      ...this.rollPrimary?.rollModsData ?? []
    ];
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
* @returns {BladesRollCollab.CostData[]} The roll costs.
*/
  private getRollCosts(): BladesRollCollab.CostData[] {
    return this.getActiveRollMods()
      .map((rollMod) => rollMod.costs)
      .flat()
      .filter((costData): costData is BladesRollCollab.CostData => costData !== undefined);
  }

  /**
* Filters the roll costs to retrieve stress costs.
* @param {BladesRollCollab.CostData[]} rollCosts - The roll costs.
* @returns {BladesRollCollab.CostData[]} The stress costs.
*/
  private getStressCosts(rollCosts: BladesRollCollab.CostData[]): BladesRollCollab.CostData[] {
    return rollCosts.filter((costData) => costData.costType === "Stress");
  }

  /**
* Calculates the total stress cost.
* @param {BladesRollCollab.CostData[]} stressCosts - The stress costs.
* @returns {number} The total stress cost.
*/
  private getTotalStressCost(stressCosts: BladesRollCollab.CostData[]): number {
    return U.sum(stressCosts.map((costData) => costData.costAmount));
  }


  /**
* Searches for any special armor roll costs.
* @param {BladesRollCollab.CostData[]} rollCosts - The roll costs.
* @returns {BladesRollCollab.CostData[]} The stress costs.
*/
  private getSpecArmorCost(rollCosts: BladesRollCollab.CostData[]): BladesRollCollab.CostData|undefined {
    return rollCosts.find((costData) => costData.costType === "SpecialArmor");
  }

  /**
* Constructs the sheet data.
* @param {boolean} isGM - If the user is a GM.
* @param {BladesRollCollab.CostData[]} rollCosts - The roll costs.
* @param {BladesRollCollab.CostData[]} stressCosts - The stress costs.
* @param {number} totalStressCost - The total stress cost.
* @returns {BladesRollCollab.SheetData} The constructed sheet data.
*/
  private getSheetData(
    isGM: boolean,
    rollCosts: BladesRollCollab.CostData[]
  ): BladesRollCollab.SheetData {
    const {flagData: rData, rollPrimary, rollTraitData, rollTraitOptions, finalDicePool, finalPosition, finalEffect, finalResult, rollMods, rollFactors} = this;
    if (!rollPrimary) {
      throw new Error("A primary roll source is required for BladesRollCollab.");
    }
    const baseData = {
      ...this.flagData,
      cssClass: "roll-collab",
      editable: this.options.editable,
      isGM,
      system: this.rollPrimary?.rollPrimaryDoc?.system,

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
        .map((cat) => [cat, this.getRollMods(cat, "positive")])) as Record<RollModSection, BladesRollMod[]>,
      negRollMods: Object.fromEntries(Object.values(RollModSection)
        .map((cat) => [cat, this.getRollMods(cat, "negative")])) as Record<RollModSection, BladesRollMod[]>,
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
      ...rollPositionData,
      ...rollEffectData,
      ...rollResultData,
      ...GMBoostsData,
      ...positionEffectTradeData
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

  private calculateGMBoostsData(flagData: BladesRollCollab.FlagData) {
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

  // Add additional helper methods for calculateOddsGradient, calculatePositionEffectTradeData, calculateRollModsCategoryData, calculateHasInactiveConditionalsData, calculateCostsData
  // These methods will contain the respective logic for each, using the same structure as the previous helper methods.
  /**
 * Calculate odds gradient based on given dice total.
 * @param diceTotal - Total number of dice.
 * @returns {string} - Gradient string for CSS.
 */
  private calculateOddsGradient(diceTotal: number, finalResult: number): string {
    const oddsColors = {
      crit: "var(--blades-cyan)",
      success: "var(--blades-gold)",
      partial: "var(--blades-grey-bright)",
      fail: "var(--blades-black-dark)"
    };
    const odds = {...C.DiceOdds[diceTotal]};

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

  /**
* Calculate data for position and effect trade.
* @returns {{canTradePosition: boolean, canTradeEffect: boolean}}
*/
  private calculatePositionEffectTradeData(): { canTradePosition: boolean, canTradeEffect: boolean } {
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
    for (const category of Object.values(RollModSection)) {
      hasInactive[category] = this.getRollMods(category).filter((mod) => mod.isInInactiveBlock).length > 0;
    }
    return hasInactive;
  }

  /**
* Calculate data for costs.
* @param stressCosts - Array of stress costs.
* @param specArmorCost - Specific armor cost.
* @returns {{footerLabel: string, tooltip: string} | undefined} - Costs data or undefined.
*/
  private parseCostsHTML(stressCosts: BladesRollCollab.CostData[], specArmorCost: BladesRollCollab.CostData | undefined): {footerLabel: string, tooltip: string} | undefined {
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


  async OLDgetData() {

    const context = super.getData();

    const rData = this.flagData;

    if (!this.rollPrimary) {
      throw new Error("No roll source configured for roll.");
    }

    // Initialize roll mods from all available sources
    const rollModsData: BladesRollCollab.RollModData[] = [
      ...BladesRollCollab.DefaultRollMods,
      ...this.rollPrimary.rollModsData ?? []
    ];

    if (this.rollOpposition?.rollOppModsData) {
      rollModsData.push(...this.rollOpposition.rollOppModsData);
    }

    this.initRollMods(rollModsData);

    this.rollMods.forEach((rollMod) => rollMod.applyRollModEffectKeys());

    const isGM = game.eunoblades.Tracker?.system.is_spoofing_player ? false : game.user.isGM;
    const {rollPrimary, rollOpposition, rollTraitData, rollTraitOptions, finalPosition, finalEffect, finalResult, rollMods, posEffectTrade, rollFactors} = this;

    const rollCosts = this.getActiveRollMods()
      .map((rollMod) => rollMod.costs)
      .flat()
      .filter((costData): costData is BladesRollCollab.CostData => costData !== undefined);
    const stressCosts = rollCosts.filter((costData) => costData.costType === "Stress");
    const specArmorCost = rollCosts.find((costData) => costData.costType === "SpecialArmor");
    const totalStressCost = U.sum(stressCosts.map((costData) => costData.costAmount));

    const sheetData: BladesRollCollab.SheetData = {
      ...rData,
      cssClass: "roll-collab",
      editable: this.options.editable,
      isGM,
      system: this.rollPrimary.rollPrimaryDoc?.system,

      rollMods,
      rollPrimary,
      rollTraitData,
      rollTraitOptions,

      diceTotal: this.finalDicePool,

      rollOpposition,

      rollPositions: Object.values(Position),
      rollEffects: Object.values(Effect),
      teamworkDocs: game.actors.filter((actor) => BladesActor.IsType(actor, BladesActorType.pc)),

      rollPositionFinal: finalPosition,
      rollEffectFinal: finalEffect,
      rollResultFinal: finalResult,
      isAffectingResult: finalResult > 0
        || this.getVisibleRollMods(RollModSection.result).length > 0
        || (isGM && this.getRollMods(RollModSection.result).length > 0),
      isAffectingAfter: this.getVisibleRollMods(RollModSection.after).length > 0
        || (isGM && this.getRollMods(RollModSection.after).length > 0),

      rollFactorPenaltiesNegated: this.rollFactorPenaltiesNegated,

      GMBoosts: {
        Dice: this.flagData.GMBoosts.Dice ?? 0,
        [Factor.tier]: this.flagData.GMBoosts[Factor.tier] ?? 0,
        [Factor.quality]: this.flagData.GMBoosts[Factor.quality] ?? 0,
        [Factor.scale]: this.flagData.GMBoosts[Factor.scale] ?? 0,
        [Factor.magnitude]: this.flagData.GMBoosts[Factor.magnitude] ?? 0,
        Result: this.flagData.GMBoosts.Result ?? 0
      },
      GMOppBoosts: {
        [Factor.tier]: this.flagData.GMOppBoosts[Factor.tier] ?? 0,
        [Factor.quality]: this.flagData.GMOppBoosts[Factor.quality] ?? 0,
        [Factor.scale]: this.flagData.GMOppBoosts[Factor.scale] ?? 0,
        [Factor.magnitude]: this.flagData.GMOppBoosts[Factor.magnitude] ?? 0
      },

      canTradePosition: posEffectTrade === "position"
        || (
          posEffectTrade === false
          && finalPosition !== Position.desperate
          && finalEffect !== Effect.extreme
        ),
      canTradeEffect: posEffectTrade === "effect"
        || (
          posEffectTrade === false
          && finalPosition !== Position.controlled
          && finalEffect !== Effect.zero
        ),

      posRollMods: Object.fromEntries(Object.values(RollModSection)
        .map((cat) => [cat, this.getRollMods(cat, "positive")])) as Record<RollModSection, BladesRollMod[]>,
      negRollMods: Object.fromEntries(Object.values(RollModSection)
        .map((cat) => [cat, this.getRollMods(cat, "negative")])) as Record<RollModSection, BladesRollMod[]>,
      hasInactiveConditionals: {
        [RollModSection.roll]: this.getRollMods(RollModSection.roll)
          .filter((mod) => mod.isInInactiveBlock)
          .length > 0,
        [RollModSection.position]: this.getRollMods(RollModSection.position)
          .filter((mod) => mod.isInInactiveBlock)
          .length > 0,
        [RollModSection.effect]: this.getRollMods(RollModSection.effect)
          .filter((mod) => mod.isInInactiveBlock)
          .length > 0,
        [RollModSection.result]: this.getRollMods(RollModSection.result)
          .filter((mod) => mod.isInInactiveBlock)
          .length > 0,
        [RollModSection.after]: this.getRollMods(RollModSection.after)
          .filter((mod) => mod.isInInactiveBlock)
          .length > 0
      },

      rollFactors,

      oddsGradient: ""
    };

    // Determine final costs for tooltip and footer label
    if (specArmorCost || totalStressCost) {
      sheetData.costData = {
        footerLabel: [
          "( Roll Costs",
          totalStressCost > 0
            ? `<span class='red-bright'><strong>${totalStressCost} Stress</strong></span>`
            : null,
          specArmorCost && totalStressCost
            ? "and"
            : null,
          specArmorCost
            ? "your <span class='cyan-bright'><strong>Special Armor</strong></span>"
            : null,
          ")"
        ]
          .filter((line) => Boolean(line))
          .join(" "),
        tooltip: [
          "<h1>Roll Costs</h1><ul>",
          ...stressCosts.map((costData) => `<li><strong class='shadowed'>${costData.label}: <span class='red-bright'>${costData.costAmount}</span> Stress</strong></li>`),
          specArmorCost
            ? `<li><strong class='shadowed'>${specArmorCost.label}: <strong class='cyan-bright'>Special Armor</strong></strong></li>`
            : null,
          "</ul>"
        ]
          .filter((line) => Boolean(line))
          .join("")
      };
    }

    // Determine style string for odds bar
    const oddsColors = {
      crit: "var(--blades-cyan)",
      success: "var(--blades-gold)",
      partial: "var(--blades-grey-bright)",
      fail: "var(--blades-black-dark)"
    };
    const odds = {...C.DiceOdds[sheetData.diceTotal ?? 0]};

    // Apply changes to odds from result level
    if ((sheetData.rollResultFinal ?? 0) < 0) {
      for (let i = sheetData.rollResultFinal ?? 0; i < 0; i++) {
        // For each negative shift, bump all the colors down one level.
        oddsColors.crit = oddsColors.success;
        oddsColors.success = oddsColors.partial;
        oddsColors.partial = oddsColors.fail;
      }
    } else if ((sheetData.rollResultFinal ?? 0) > 0) {
      for (let i = 0; i < (sheetData.rollResultFinal ?? 0); i++) {
        // For each positive shift, bump all the colors up one level.
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

    // Apply tuning for visuals
    gradientStops.fail = Math.min(100, Math.max(0, Math.max(gradientStops.fail / 2, gradientStops.fail - 10)));
    const critSpan = 100 - gradientStops.success;
    gradientStops.success = Math.min(100, Math.max(0, gradientStops.success - Math.max(critSpan / 2, critSpan - 10)));

    sheetData.oddsGradient = [
      "linear-gradient(to right",
      `${oddsColors.fail} ${gradientStops.fail}%`,
      `${oddsColors.partial} ${gradientStops.partial}%`,
      `${oddsColors.success} ${gradientStops.success}%`,
      `${oddsColors.crit})`
    ].join(", ");

    sheetData.oddsGradientTestHTML = [
      "<div class='odds-gradient-test-html'>",
      `<div class='odds-gradient-box odds-gradient-fail' style='width: ${odds.fail}%;'></div>`,
      `<div class='odds-gradient-box odds-gradient-partial' style='width: ${odds.partial}%;'></div>`,
      `<div class='odds-gradient-box odds-gradient-success' style='width: ${odds.success}%;'></div>`,
      `<div class='odds-gradient-box odds-gradient-crit' style='width: ${odds.crit}%;'></div>`,
      "</div>"
    ].join("");

    return {
      ...context,
      ...sheetData
    };
  }

  // #endregion

  // #region *** EVALUATING & DISPLAYING ROLL TO CHAT *** ~
  _dieVals?: number[];
  get dieVals(): number[] {
    this._dieVals ??= (this.roll.terms as DiceTerm[])[0].results
      .map((result) => result.result)
      .sort()
      .reverse();
    return this._dieVals;
  }

  private getDieClass(val: number, i: number) {
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
        ...dieVals.map(this.getDieClass),
        ghostNum ? `<span class='blades-die blades-die-ghost blades-die-${ghostNum}'><img src='systems/eunos-blades/assets/dice/faces/${ghostNum}.webp' /></span>` : null
      ]
        .filter((val): val is string => typeof val === "string")
        .join("");
    }
  }

  get rollResult(): RollResult {

    // If rollingZero, remove highest die.
    const dieVals = this.isRollingZero
      ? [[...this.dieVals].pop()]
      : this.dieVals;

    // Is this a critical success?
    if (dieVals.filter((val) => val === 6).length >= 2) { return RollResult.critical }

    // A full success?
    if (dieVals.find((val) => val === 6)) { return RollResult.success }

    // A partial?
    if (dieVals.find((val) => val && val >= 4)) { return RollResult.partial }

    return RollResult.fail;

  }

  async outputRollToChat() {
    const speaker = ChatMessage.getSpeaker();

    let renderedHTML;

    switch (this.rollType) {
      case RollType.Action: {
        renderedHTML = await renderTemplate("systems/eunos-blades/templates/chat/action-roll.hbs", {
          sourceName: this.rollPrimary?.rollPrimaryName ?? "",
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
    await this.roll.evaluate({async: true});
    await this.outputRollToChat();
    this.close();
  }
  // #endregion

  // #region LISTENER FUNCTIONS ~
  _toggleRollModClick(event: ClickEvent) {
    event.preventDefault();
    const elem$ = $(event.currentTarget);
    const id = elem$.data("id");
    const rollMod = this.getRollModByID(id);
    if (!rollMod) { throw new Error(`Unable to find roll mod with id '${id}'`) }

    switch (rollMod.status) {
      case RollModStatus.Hidden: rollMod.userStatus = RollModStatus.ForcedOff; return;
      case RollModStatus.ForcedOff: rollMod.userStatus = RollModStatus.ToggledOff; return;
      case RollModStatus.ToggledOff: rollMod.userStatus = RollModStatus.ToggledOn; return;
      case RollModStatus.ToggledOn: rollMod.userStatus = game.user.isGM ? RollModStatus.ForcedOn : RollModStatus.ToggledOff; return;
      case RollModStatus.ForcedOn: rollMod.userStatus = RollModStatus.Hidden; return;
      default: throw new Error(`Unrecognized RollModStatus: ${rollMod.status}`);
    }
  }

  _toggleRollModContext(event: ClickEvent) {
    event.preventDefault();
    if (!game.user.isGM) { return }
    const elem$ = $(event.currentTarget);
    const id = elem$.data("id");
    const rollMod = this.getRollModByID(id);
    if (!rollMod) { throw new Error(`Unable to find roll mod with id '${id}'`) }

    switch (rollMod.status) {
      case RollModStatus.Hidden: rollMod.userStatus = RollModStatus.ToggledOff; return;
      case RollModStatus.ForcedOff: rollMod.userStatus = RollModStatus.Hidden; return;
      case RollModStatus.ToggledOff: rollMod.userStatus = RollModStatus.ForcedOff; return;
      case RollModStatus.ToggledOn: rollMod.userStatus = RollModStatus.ToggledOff; return;
      case RollModStatus.ForcedOn: rollMod.userStatus = RollModStatus.Hidden; return;
      default: throw new Error(`Unrecognized RollModStatus: ${rollMod.status}`);
    }
  }

  _gmControlSet(event: ClickEvent) {
    event.preventDefault();
    if (!game.user.isGM) { return }
    const elem$ = $(event.currentTarget);
    const id = elem$.data("id");
    const status = elem$.data("status");

    if (!isModStatus(status)) { return }

    const rollMod = this.getRollModByID(id);
    if (rollMod) {
      rollMod.userStatus = status;
    }
  }

  async _gmControlSetTargetToValue(event: ClickEvent) {
    event.preventDefault();
    if (!game.user.isGM) { return }
    const elem$ = $(event.currentTarget);
    const target = elem$.data("target").replace(/flags\.eunos-blades\./, "");
    const value = elem$.data("value");

    await this.document.setFlag(C.SYSTEM_ID, target, value);
  }

  async _gmControlResetTarget(event: ClickEvent) {
    event.preventDefault();
    if (!game.user.isGM) { return }
    const elem$ = $(event.currentTarget);
    const target = elem$.data("target").replace(/flags\.eunos-blades\./, "");

    await this.document.unsetFlag(C.SYSTEM_ID, target);
  }

  _gmControlReset(event: ClickEvent) {
    event.preventDefault();
    if (!game.user.isGM) { return }
    const elem$ = $(event.currentTarget);
    const id = elem$.data("id");

    const rollMod = this.getRollModByID(id);
    if (rollMod) {
      rollMod.userStatus = undefined;
    }
  }

  _gmControlSetPosition(event: ClickEvent) {
    event.preventDefault();
    if (!game.user.isGM) { return }
    const elem$ = $(event.currentTarget);
    const position = elem$.data("status") as Position;
    this.initialPosition = position;
  }

  _gmControlSetEffect(event: ClickEvent) {
    event.preventDefault();
    if (!game.user.isGM) { return }
    const elem$ = $(event.currentTarget);
    const effect = elem$.data("status") as Effect;
    this.initialEffect = effect;
  }

  async _gmControlToggleFactor(event: ClickEvent) {
    event.preventDefault();
    if (!game.user.isGM) { return }
    const elem$ = $(event.currentTarget);
    const target = elem$.data("target");
    const value = !elem$.data("value");

    eLog.checkLog3("toggleFactor", "_gmControlToggleFactor", {event, target, value});

    if (value && /isPrimary/.test(target)) {
      const [thisSource, thisFactor] = target.split(/\./).slice(-3, -1) as ["source" | "opposition", Factor];
      eLog.checkLog3("toggleFactor", "_gmControlToggleFactor - IN", {thisSource, thisFactor});
      await Promise.all(Object.values(Factor).map((factor) => {
        if (factor === thisFactor) {
          eLog.checkLog3("toggleFactor", `_gmControlToggleFactor - Checking ${factor} === ${thisFactor} === TRUE`, {factor, thisFactor, target, customTarget: `rollCollab.rollFactorToggles.${thisSource}.${factor}.isPrimary`});
          return this.document.setFlag(C.SYSTEM_ID, `rollCollab.rollFactorToggles.${thisSource}.${factor}.isPrimary`, true);
        } else {
          eLog.checkLog3("toggleFactor", `_gmControlToggleFactor - Checking ${factor} === ${thisFactor} === FALSE`, {factor, thisFactor, target, customTarget: `rollCollab.rollFactorToggles.${thisSource}.${factor}.isPrimary`});
          return this.document.setFlag(C.SYSTEM_ID, `rollCollab.rollFactorToggles.${thisSource}.${factor}.isPrimary`, false);
        }
      }));
      eLog.checkLog3("toggleFactor", "_gmControlToggleFactor - ALL DONE", {flags: this.document.getFlag(C.SYSTEM_ID, "rollCollab.rollFactorToggles")});
    } else {
      this.document.setFlag(C.SYSTEM_ID, `rollCollab.${target}`, value);
    }
  }

  async _gmControlResetFactor(event: ClickEvent) {
    event.preventDefault();
    if (!game.user.isGM) { return }
    const elem$ = $(event.currentTarget);
    const target = elem$.data("target");
    await this.document.unsetFlag(C.SYSTEM_ID, `rollCollab.${target}`);
  }

  get resistanceStressCost(): number {
    const dieVals = this.dieVals;
    if (this.rollResult === RollResult.critical) { return -1 }
    if (this.isRollingZero) { dieVals.shift() }
    return 6 - (dieVals.shift() ?? 0);
  }

  // #endregion
  // #region ACTIVATE LISTENERS ~
  override activateListeners(html: JQuery<HTMLElement>) {
    super.activateListeners(html);
    ApplyTooltipListeners(html);

    // User-Toggleable Roll Mods
    html.find(".roll-mod[data-action='toggle']").on({
      click: this._toggleRollModClick.bind(this)
    });

    html.find("[data-action='tradePosition']").on({
      click: (event) => {
        const curVal = `${$(event.currentTarget).data("value")}`;
        if (curVal === "false") {
          this.document.setFlag(C.SYSTEM_ID, "rollCollab.rollPosEffectTrade", "effect");
        } else {
          this.document.setFlag(C.SYSTEM_ID, "rollCollab.rollPosEffectTrade", false);
        }
      }
    });
    html.find("[data-action='tradeEffect']").on({
      click: (event) => {
        const curVal = `${$(event.currentTarget).data("value")}`;
        if (curVal === "false") {
          this.document.setFlag(C.SYSTEM_ID, "rollCollab.rollPosEffectTrade", "position");
        } else {
          this.document.setFlag(C.SYSTEM_ID, "rollCollab.rollPosEffectTrade", false);
        }
      }
    });

    html.find("[data-action='roll']").on({
      click: () => this.makeRoll()
    });

    if (!game.user.isGM) { return }

    // GM Controls
    html.on({
      focusin: () => { BladesRollCollab.Active = this } // Set reference to top-most, focused roll.
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
  // #endregion

  // #region OVERRIDES: _canDragDrop, _onDrop, _onSubmit, close, render ~
  override _canDragDrop(selector: string) {
    eLog.checkLog3("canDragDrop", "Can DragDrop Selector", {selector});
    return game.user.isGM;
  }

  override _onDrop(event: DragEvent) {
    const data = TextEditor.getDragEventData(event) as { type: "Actor" | "Item", uuid: string };
    const {type, uuid} = data;
    const [id] = (new RegExp(`${type}\\.(.+)`).exec(uuid) ?? []).slice(1);
    const oppDoc = game[`${U.lCase(type)}s`].get(id);
    if (BladesRollOpposition.IsDoc(oppDoc)) {
      this.rollOpposition = new BladesRollOpposition(this, {rollOppDoc: oppDoc});
    }

  }

  override async _onSubmit(event: Event, {updateData}: FormApplication.OnSubmitOptions = {}) {
    return super._onSubmit(event, {updateData, preventClose: true})
      .then((returnVal) => { this.render(); return returnVal });
  }

  override async close(options: FormApplication.CloseOptions & { rollID?: string } = {}) {

    if (options.rollID) { return super.close({}) }
    this.document.setFlag(C.SYSTEM_ID, "rollCollab", null);
    socketlib.system.executeForEveryone("closeRollCollab", this.rollID);

    return undefined;
  }

  override render(force = false, options?: Application.RenderOptions<DocumentSheetOptions>) {
    if (!this.document.getFlag(C.SYSTEM_ID, "rollCollab")) { return this }
    return super.render(force, options);
  }
  // #endregion

}

interface BladesRollCollab {
  get document(): User
}
// #endregion *** CLASS *** BladesRollCollab

// #region EXPORTS ~
export const BladesRollCollabComps = {
  Mod: BladesRollMod,
  Primary: BladesRollPrimary,
  Opposition: BladesRollOpposition,
  Participant: BladesRollParticipant
};

export default BladesRollCollab;
// #endregion
