import C, {SVGDATA, BladesActorType, BladesItemType, Tag, BladesPhase, RollModCategory, PrereqType, Factor, RollModStatus} from "./core/constants.js";
import U from "./core/utilities.js";
import BladesActor from "./blades-actor.js";
import BladesRollCollab from "./blades-roll-collab.js";
import {ItemDataConstructorData} from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/itemData.js";

class BladesItem extends Item implements BladesDocument<Item>,
                                          BladesItemSubClass.Ability,
                                          BladesItemSubClass.Background,
                                          BladesItemSubClass.Clock_Keeper,
                                          BladesItemSubClass.Cohort_Gang,
                                          BladesItemSubClass.Cohort_Expert,
                                          BladesItemSubClass.Crew_Ability,
                                          BladesItemSubClass.Crew_Reputation,
                                          BladesItemSubClass.Crew_Playbook,
                                          BladesItemSubClass.Crew_Upgrade,
                                          BladesItemSubClass.Feature,
                                          BladesItemSubClass.Gm_Tracker,
                                          BladesItemSubClass.Heritage,
                                          BladesItemSubClass.Gear,
                                          BladesItemSubClass.Playbook,
                                          BladesItemSubClass.Preferred_Op,
                                          BladesItemSubClass.Stricture,
                                          BladesItemSubClass.Vice,
                                          BladesItemSubClass.Project,
                                          BladesItemSubClass.Ritual,
                                          BladesItemSubClass.Design,
                                          BladesItemSubClass.Location,
                                          BladesItemSubClass.Score,
                                          BladesRollCollab.SourceDoc,
                                          BladesRollCollab.OppositionDoc {

  // #region Static Overrides: Create ~
  static override async create(data: ItemDataConstructorData & { system?: { world_name?: string, description?: string } }, options = {}) {
    if (Array.isArray(data)) { data = data[0] }
    data.system = data.system ?? {};

    eLog.checkLog2("item", "BladesItem.create(data,options)", {data, options});

    //~ Create world_name
    data.system.world_name = data.system.world_name ?? data.name.replace(/[^A-Za-z_0-9 ]/g, "").trim().replace(/ /g, "_");

    return super.create(data, options);
  }
  // #endregion

  // #region BladesDocument Implementation
  static get All() { return game.items }
  static Get(itemRef: ItemRef): BladesItem|undefined {
    if (itemRef instanceof BladesItem) { return itemRef }
    if (U.isDocID(itemRef)) { return BladesItem.All.get(itemRef) }
    return BladesItem.All.find((a) => a.system.world_name === itemRef)
      || BladesItem.All.find((a) => a.name === itemRef);
  }
  static GetTypeWithTags<T extends BladesItemType>(docType: T|T[], ...tags: BladesTag[]): Array<BladesItemOfType<T>> {
    if (Array.isArray(docType)) {
      return docType
        .map((dType) => BladesItem.All.filter((item): item is BladesItemOfType<T> => item.type === dType))
        .flat();
    }
    return BladesItem.All.filter((item): item is BladesItemOfType<T> => item.type === docType)
      .filter((item) => item.hasTag(...tags));
  }

  static IsType<T extends BladesItemType>(doc: unknown, ...types: T[]): doc is BladesItemOfType<T> {
    const typeSet = new Set<BladesItemType>(types);
    return doc instanceof BladesItem && typeSet.has(doc.type);
  }

  get tags(): BladesTag[] { return this.system.tags ?? [] }
  hasTag(...tags: BladesTag[]): boolean {
    return tags.every((tag) => this.tags.includes(tag));
  }
  async addTag(...tags: BladesTag[]) {
    const curTags = this.tags;
    tags.forEach((tag) => {
      if (curTags.includes(tag)) { return }
      curTags.push(tag);
    });
    this.update({"system.tags": curTags});
  }
  async remTag(...tags: BladesTag[]) {
    const curTags = this.tags.filter((tag) => !tags.includes(tag));
    this.update({"system.tags": curTags});
  }

  get tooltip(): string|undefined {
    const tooltipText = [
      this.system.concept,
      this.system.rules,
      this.system.notes
    ].filter(Boolean).join("");
    if (tooltipText) { return (new Handlebars.SafeString(tooltipText)).toString() }
    return undefined;
  }
  dialogCSSClasses = "";

  getFactorTotal(factor: Factor): number {
    switch (factor) {
      case Factor.tier: {
        // if (BladesItem.IsType(this, BladesItemType.ability)) { return this.system.tier.value }
        // if (BladesItem.IsType(this, BladesItemType.background)) { return this.system.tier.value }
        // if (BladesItem.IsType(this, BladesItemType.clock_keeper)) { return this.system.tier.value }
        if (BladesItem.IsType(this, BladesItemType.cohort_gang)) {
          return this.system.tier.value + (this.parent?.getFactorTotal(Factor.tier) ?? 0);
        }
        if (BladesItem.IsType(this, BladesItemType.cohort_expert)) {
          return this.system.tier.value + (this.parent?.getFactorTotal(Factor.tier) ?? 0);
        }
        // if (BladesItem.IsType(this, BladesItemType.crew_ability)) { return this.system.tier.value }
        // if (BladesItem.IsType(this, BladesItemType.crew_reputation)) { return this.system.tier.value }
        // if (BladesItem.IsType(this, BladesItemType.crew_playbook)) { return this.system.tier.value }
        // if (BladesItem.IsType(this, BladesItemType.crew_upgrade)) { return this.system.tier.value }
        // if (BladesItem.IsType(this, BladesItemType.feature)) { return this.system.tier.value }
        // if (BladesItem.IsType(this, BladesItemType.gm_tracker)) { return this.system.tier.value }
        // if (BladesItem.IsType(this, BladesItemType.heritage)) { return this.system.tier.value }
        if (BladesItem.IsType(this, BladesItemType.gear)) {
          return this.system.tier.value + (this.parent?.getFactorTotal(Factor.tier) ?? 0);
        }
        // if (BladesItem.IsType(this, BladesItemType.playbook)) { return this.system.tier.value }
        // if (BladesItem.IsType(this, BladesItemType.preferred_op)) { return this.system.tier.value }
        // if (BladesItem.IsType(this, BladesItemType.stricture)) { return this.system.tier.value }
        // if (BladesItem.IsType(this, BladesItemType.vice)) { return this.system.tier.value }
        // if (BladesItem.IsType(this, BladesItemType.project)) { return this.system.tier.value }
        // if (BladesItem.IsType(this, BladesItemType.ritual)) { return this.system.tier.value }
        // if (BladesItem.IsType(this, BladesItemType.design)) { return this.system.tier.value }
        // if (BladesItem.IsType(this, BladesItemType.location)) { return this.system.tier.value }
        // if (BladesItem.IsType(this, BladesItemType.score)) { return this.system.tier.value }
        return this.system.tier.value;
      }
      case Factor.quality: {
        // if (BladesItem.IsType(this, BladesItemType.ability)) { return this.getFactorTotal(Factor.tier) }
        // if (BladesItem.IsType(this, BladesItemType.background)) { return this.getFactorTotal(Factor.tier) }
        // if (BladesItem.IsType(this, BladesItemType.clock_keeper)) { return this.getFactorTotal(Factor.tier) }
        if (BladesItem.IsType(this, BladesItemType.cohort_gang)) {
          return this.getFactorTotal(Factor.tier) + (this.system.quality_bonus ?? 0);
        }
        if (BladesItem.IsType(this, BladesItemType.cohort_expert)) {
          return this.getFactorTotal(Factor.tier) + (this.system.quality_bonus ?? 0) + 1;
        }
        // if (BladesItem.IsType(this, BladesItemType.crew_ability)) { return this.getFactorTotal(Factor.tier) }
        // if (BladesItem.IsType(this, BladesItemType.crew_reputation)) { return this.getFactorTotal(Factor.tier) }
        // if (BladesItem.IsType(this, BladesItemType.crew_playbook)) { return this.getFactorTotal(Factor.tier) }
        // if (BladesItem.IsType(this, BladesItemType.crew_upgrade)) { return this.getFactorTotal(Factor.tier) }
        // if (BladesItem.IsType(this, BladesItemType.feature)) { return this.getFactorTotal(Factor.tier) }
        // if (BladesItem.IsType(this, BladesItemType.gm_tracker)) { return this.getFactorTotal(Factor.tier) }
        // if (BladesItem.IsType(this, BladesItemType.heritage)) { return this.getFactorTotal(Factor.tier) }
        if (BladesItem.IsType(this, BladesItemType.gear)) {
          return this.getFactorTotal(Factor.tier)
            + (this.hasTag("Fine") ? 1 : 0)
            + (this.parent?.getTaggedItemBonuses(this.tags) ?? 0)
            + (this.parent?.crew ? this.parent.crew.getTaggedItemBonuses(this.tags) : 0);
        }
        // if (BladesItem.IsType(this, BladesItemType.playbook)) { return this.getFactorTotal(Factor.tier) }
        // if (BladesItem.IsType(this, BladesItemType.preferred_op)) { return this.getFactorTotal(Factor.tier) }
        // if (BladesItem.IsType(this, BladesItemType.stricture)) { return this.getFactorTotal(Factor.tier) }
        // if (BladesItem.IsType(this, BladesItemType.vice)) { return this.getFactorTotal(Factor.tier) }
        // if (BladesItem.IsType(this, BladesItemType.project)) { return this.getFactorTotal(Factor.tier) }
        // if (BladesItem.IsType(this, BladesItemType.ritual)) { return this.getFactorTotal(Factor.tier) }
        if (BladesItem.IsType(this, BladesItemType.design)) { return this.system.min_quality }
        // if (BladesItem.IsType(this, BladesItemType.location)) { return this.getFactorTotal(Factor.tier) }
        // if (BladesItem.IsType(this, BladesItemType.score)) { return this.getFactorTotal(Factor.tier) }
        return this.getFactorTotal(Factor.tier);
      }
      case Factor.scale: {
        // if (BladesItem.IsType(this, BladesItemType.ability)) { return 0 }
        // if (BladesItem.IsType(this, BladesItemType.background)) { return 0 }
        // if (BladesItem.IsType(this, BladesItemType.clock_keeper)) { return 0 }
        if (BladesItem.IsType(this, BladesItemType.cohort_gang)) {
          return this.getFactorTotal(Factor.tier) + (this.system.scale_bonus ?? 0);
        }
        if (BladesItem.IsType(this, BladesItemType.cohort_expert)) {
          return 0 + (this.system.scale_bonus ?? 0);
        }
        // if (BladesItem.IsType(this, BladesItemType.crew_ability)) { return 0 }
        // if (BladesItem.IsType(this, BladesItemType.crew_reputation)) { return 0 }
        // if (BladesItem.IsType(this, BladesItemType.crew_playbook)) { return 0 }
        // if (BladesItem.IsType(this, BladesItemType.crew_upgrade)) { return 0 }
        // if (BladesItem.IsType(this, BladesItemType.feature)) { return 0 }
        // if (BladesItem.IsType(this, BladesItemType.gm_tracker)) { return 0 }
        // if (BladesItem.IsType(this, BladesItemType.heritage)) { return 0 }
        // if (BladesItem.IsType(this, BladesItemType.gear)) { return 0 }
        // if (BladesItem.IsType(this, BladesItemType.playbook)) { return 0 }
        // if (BladesItem.IsType(this, BladesItemType.preferred_op)) { return 0 }
        // if (BladesItem.IsType(this, BladesItemType.stricture)) { return 0 }
        // if (BladesItem.IsType(this, BladesItemType.vice)) { return 0 }
        // if (BladesItem.IsType(this, BladesItemType.project)) { return 0 }
        // if (BladesItem.IsType(this, BladesItemType.ritual)) { return 0 }
        // if (BladesItem.IsType(this, BladesItemType.design)) { return 0 }
        // if (BladesItem.IsType(this, BladesItemType.location)) { return 0 }
        // if (BladesItem.IsType(this, BladesItemType.score)) { return 0 }
        return 0;
      }
      case Factor.magnitude: {
        // if (BladesItem.IsType(this, BladesItemType.ability)) { return 0 }
        // if (BladesItem.IsType(this, BladesItemType.background)) { return 0 }
        // if (BladesItem.IsType(this, BladesItemType.clock_keeper)) { return 0 }
        // if (BladesItem.IsType(this, BladesItemType.cohort_gang)) { return 0 }
        // if (BladesItem.IsType(this, BladesItemType.cohort_expert)) { return 0 }
        // if (BladesItem.IsType(this, BladesItemType.crew_ability)) { return 0 }
        // if (BladesItem.IsType(this, BladesItemType.crew_reputation)) { return 0 }
        // if (BladesItem.IsType(this, BladesItemType.crew_playbook)) { return 0 }
        // if (BladesItem.IsType(this, BladesItemType.crew_upgrade)) { return 0 }
        // if (BladesItem.IsType(this, BladesItemType.feature)) { return 0 }
        // if (BladesItem.IsType(this, BladesItemType.gm_tracker)) { return 0 }
        // if (BladesItem.IsType(this, BladesItemType.heritage)) { return 0 }
        // if (BladesItem.IsType(this, BladesItemType.gear)) { return 0 }
        // if (BladesItem.IsType(this, BladesItemType.playbook)) { return 0 }
        // if (BladesItem.IsType(this, BladesItemType.preferred_op)) { return 0 }
        // if (BladesItem.IsType(this, BladesItemType.stricture)) { return 0 }
        // if (BladesItem.IsType(this, BladesItemType.vice)) { return 0 }
        // if (BladesItem.IsType(this, BladesItemType.project)) { return 0 }
        if (BladesItem.IsType(this, BladesItemType.ritual)) {
          return this.system.magnitude.value;
        }
        // if (BladesItem.IsType(this, BladesItemType.design)) { return 0 }
        // if (BladesItem.IsType(this, BladesItemType.location)) { return 0 }
        // if (BladesItem.IsType(this, BladesItemType.score)) { return 0 }
        return 0;
      }
      // no default
    }
    return 0;
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

  // #region BladesGMTracker Implementation

  get phase(): BladesPhase|false { return BladesItem.IsType(this, BladesItemType.gm_tracker) && this.system.phase }
  set phase(phase: BladesPhase|false) {
    if (phase && BladesItem.IsType(this, BladesItemType.gm_tracker)) {
      this.update({"system.phase": phase});
    }
  }

  // #endregion

  // #region BladesRollSource Implementation

  get rollMods(): BladesRollCollab.RollModData[] {
    const {roll_mods} = this.system;
    if (!roll_mods) { return [] }
    const rollMods: BladesRollCollab.RollModData[] = [];

    roll_mods.forEach((modString) => {
      const pStrings = modString.split(/@/);
      const nameString = U.pullElement(pStrings, (v) => typeof v === "string" && /^na/i.test(v));
      const nameVal = (typeof nameString === "string" && nameString.replace(/^.*:/, "")) as string|false;
      if (!nameVal) { throw new Error(`RollMod Missing Name: '${modString}'`) }
      const catString = U.pullElement(pStrings, (v) => typeof v === "string" && /^cat/i.test(v));
      const catVal = (typeof catString === "string" && catString.replace(/^.*:/, "")) as RollModCategory|false;
      if (!catVal || !(catVal in RollModCategory)) { throw new Error(`RollMod Missing Category: '${modString}'`) }
      const posNegString = (U.pullElement(pStrings, (v) => typeof v === "string" && /^p/i.test(v)) || "posNeg:positive");
      const posNegVal = posNegString.replace(/^.*:/, "") as "positive"|"negative";

      const rollMod: BladesRollCollab.RollModData = {
        name: nameVal,
        category: catVal,
        status: RollModStatus.ToggledOff,
        modType: "general",
        value: 1,
        posNeg: posNegVal,
        tooltip: ""
      };

      pStrings.forEach((pString) => {
        const [keyString, valString] = pString.split(/:/) as [string, string];
        const val: string|string[] = /\|/.test(valString) ? valString.split(/\|/) : valString;
        let key: KeyOf<BladesRollCollab.RollModData>;
        if (/^stat/i.test(keyString)) { key = "status" } else
        if (/^val/i.test(keyString)) { key = "value" } else
        if (/^eff|^ekey/i.test(keyString)) { key = "effectKey" } else
        if (/^side|^ss/i.test(keyString)) { key = "sideString" } else
        if (/^tool|^tip/i.test(keyString)) { key = "tooltip" } else
        if (/^ty/i.test(keyString)) { key = "modType" } else
        if (/^c.*r?.*ty/i.test(keyString)) { key = "conditionalRollTypes" } else
        if (/^a.*r?.*y/i.test(keyString)) { key = "autoRollTypes" } else
        if (/^c.*r?.*tr/i.test(keyString)) { key = "conditionalRollTraits" } else
        if (/^a.*r?.*tr/i.test(keyString)) { key = "autoRollTraits" } else {
          throw new Error(`Bad Roll Mod Key: ${keyString}`);
        }

        Object.assign(
          rollMod,
          {[key]: ["value"].includes(key)
            ? U.pInt(val)
            : (["effectKey", "conditionalRollTypes", "autoRollTypes,", "conditionalRollTraits", "autoRollTraits"].includes(key)
                ? [val].flat()
                : val)}
        );
      });

      // name:Alchemist@cat:result@posNeg:positive@type:ability@cTypes:Action|Downtime@cTraits:study|tinker|finesse|wreck|attune@tooltip:<h1>Alchemist</h1><p>When you <strong>invent</strong> or <strong>craft</strong> a creation with <em>alchemical</em> features, you get <strong>+1 result level</strong>to your roll.</p>
      if (
        (rollMod.conditionalRollTypes?.length ?? 0)
        + (rollMod.conditionalRollTraits?.length ?? 0)
        + (rollMod.autoRollTypes?.length ?? 0)
        + (rollMod.autoRollTraits?.length ?? 0) > 0) {
        rollMod.isConditional = true;
        rollMod.status = RollModStatus.Conditional;
      }

      BladesRollCollab.MergeInRollMod(rollMod, rollMods);
    });

    // Add roll mods from harm for cohorts
    // [
    //   [/1d/, RollModCategory.roll] as const,
    //   [/Less Effect/, RollModCategory.effect] as const
    // ].forEach(([effectPat, effectCat]) => {
    //   const {one: harmConditionOne, two: harmConditionTwo} = Object.values(this.system.harm ?? {})
    //     .find((harmData) => effectPat.test(harmData.effect)) ?? {};
    //   const harmString = U.objCompact([harmConditionOne, harmConditionTwo === "" ? null : harmConditionTwo]).join(" & ");
    //   if (harmString.length > 0) {
    //     BladesRollCollab.MergeInRollMod({
    //       name: harmString,
    //       category: effectCat,
    //       posNeg: "negative",
    //       status: RollModStatus.ForcedOn,
    //       modType: "harm",
    //       value: 1,
    //       tooltip: [
    //         `<h1 class='red-bright'><strong>Harm:</strong> ${harmString}</h1>`,
    //         effectCat === RollModCategory.roll
    //           ? "<p>Your injuries reduce your <strong class='red-bright'>dice pool</strong> by one.</p>"
    //           : "<p>Your injuries reduce your <strong class='red-bright'>Effect</strong> by one level."
    //       ].join("")
    //     }, rollMods);
    //   }
    // });

    // eLog.checkLog3("rollCollab", `Roll Mods (${this.name})`, {system: this.system.roll_mods, rollMods});

    return rollMods;
  }

  get rollFactors(): Partial<Record<Factor,BladesRollCollab.FactorData>> & Record<Factor.tier, BladesRollCollab.FactorData> {
    return {
      [Factor.tier]: {
        name: Factor.tier,
        value: this.getFactorTotal(Factor.tier),
        max: this.getFactorTotal(Factor.tier),
        cssClasses: "factor-gold factor-main",
        isActive: true,
        isDominant: false,
        highFavorsPC: true
      },
      [Factor.quality]: {
        name: Factor.quality,
        value: this.getFactorTotal(Factor.quality),
        max: this.getFactorTotal(Factor.quality),
        cssClasses: "factor-gold factor-main",
        isActive: false,
        isDominant: false,
        highFavorsPC: true
      },
      [Factor.scale]: {
        name: Factor.scale,
        value: this.getFactorTotal(Factor.scale),
        max: this.getFactorTotal(Factor.scale),
        cssClasses: "factor-gold",
        isActive: false,
        isDominant: false,
        highFavorsPC: true
      },
      [Factor.magnitude]: {
        name: Factor.magnitude,
        value: this.getFactorTotal(Factor.magnitude),
        max: this.getFactorTotal(Factor.magnitude),
        cssClasses: "factor-gold",
        isActive: false,
        isDominant: false,
        highFavorsPC: true
      }
    };
  }
  get rollOppImg() { return this.img ?? undefined }
  // #endregion

  // #region PREPARING DERIVED DATA
  override prepareDerivedData() {
    // if (BladesItem.IsType(this, BladesItemType.ability)) { this._prepareAbilityData(this.system) }
    // if (BladesItem.IsType(this, BladesItemType.background)) { this._prepareBackgroundData(this.system) }
    if (BladesItem.IsType(this, BladesItemType.clock_keeper)) { this._prepareClockKeeperData(this.system) }
    if (BladesItem.IsType(this, BladesItemType.cohort_gang, BladesItemType.cohort_expert)) { this._prepareCohortData(this.system) }
    // if (BladesItem.IsType(this, BladesItemType.crew_ability)) { this._prepareCrewAbilityData(this.system) }
    // if (BladesItem.IsType(this, BladesItemType.crew_reputation)) { this._prepareCrewReputationData(this.system) }
    if (BladesItem.IsType(this, BladesItemType.crew_playbook)) { this._preparePlaybookData(this.system) }
    // if (BladesItem.IsType(this, BladesItemType.crew_upgrade)) { this._prepareCrewUpgradeData(this.system) }
    // if (BladesItem.IsType(this, BladesItemType.feature)) { this._prepareFeatureData(this.system) }
    if (BladesItem.IsType(this, BladesItemType.gm_tracker)) { this._prepareGmTrackerData(this.system) }
    // if (BladesItem.IsType(this, BladesItemType.heritage)) { this._prepareHeritageData(this.system) }
    if (BladesItem.IsType(this, BladesItemType.gear)) { this._prepareGearData(this.system) }
    if (BladesItem.IsType(this, BladesItemType.playbook)) { this._preparePlaybookData(this.system) }
    // if (BladesItem.IsType(this, BladesItemType.preferred_op)) { this._preparePreferredOpData(this.system) }
    // if (BladesItem.IsType(this, BladesItemType.stricture)) { this._prepareStrictureData(this.system) }
    // if (BladesItem.IsType(this, BladesItemType.vice)) { this._prepareViceData(this.system) }
    // if (BladesItem.IsType(this, BladesItemType.project)) { this._prepareProjectData(this.system) }
    // if (BladesItem.IsType(this, BladesItemType.ritual)) { this._prepareRitualData(this.system) }
    // if (BladesItem.IsType(this, BladesItemType.design)) { this._prepareDesignData(this.system) }
    // if (BladesItem.IsType(this, BladesItemType.location)) { this._prepareLocationData(this.system) }
    // if (BladesItem.IsType(this, BladesItemType.score)) { this._prepareScoreData(this.system) }
  }

  _prepareClockKeeperData(system: ExtractBladesItemSystem<BladesItemType.clock_keeper>) {
    if (!BladesItem.IsType(this, BladesItemType.clock_keeper)) { return }

    system.scenes = game.scenes.map((scene) => ({id: scene.id, name: scene.name ?? ""}));
    system.targetScene ??= game.scenes.current?.id || null;
    system.clock_keys = Object.fromEntries(Object.entries(system.clock_keys ?? {})
      .filter(([keyID, keyData]) => keyData && keyData.id)
      .map(([keyID, keyData]) => {
        if (keyData === null) { return [keyID, null] }
        keyData.clocks = Object.fromEntries(Object.entries(keyData.clocks ?? {})
          .filter(([clockNum, clockData]) => Boolean(clockData)));
        return [keyID, keyData];
      }));
  }

  _prepareCohortData(system: ExtractBladesItemSystem<BladesItemType.cohort_gang|BladesItemType.cohort_expert>) {
    if (!BladesItem.IsType(this, BladesItemType.cohort_gang, BladesItemType.cohort_expert)) { return }

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

    // Add parent-crew's elite subtype upgrades
    // if (BladesActor.IsType(this.parent, BladesActorType.crew)) {
    //   elite_subtypes.push(...this.parent.upgrades
    //     .map((upgrade) => (upgrade.name ?? "").trim().replace(/^Elite /, ""))
    //     .filter((upgradeName) => subtypes.includes(upgradeName)));
    // }

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
      } else {
        system.scale = this.getFactorTotal(Factor.scale);
        const scaleIndex = Math.min(6, system.scale);
        system.scaleExample = C.ScaleExamples[scaleIndex];
        system.subtitle = C.ScaleSizes[scaleIndex];
      }
      if (subtypes.length + elite_subtypes.length === 0) {
        system.subtitle = system.subtitle.replace(/\s+of\s*/g, "");
      }
    } else {
      system.scale = 0;
      system.scaleExample = [...subtypes, ...elite_subtypes].includes("Pet") ? "(1 animal)" : "(1 person)";
      system.subtitle = "An Expert";
    }

    if (subtypes.length + elite_subtypes.length > 0) {
      if ([...subtypes, ...elite_subtypes].includes(Tag.GangType.Vehicle)) {
        system.subtitle = C.VehicleDescriptors[Math.min(6, this.getFactorTotal(Factor.tier))];
      } else {
        system.subtitle += ` ${U.oxfordize([
          ...subtypes.filter((subtype) => !elite_subtypes.includes(subtype)),
          ...elite_subtypes.map((subtype) => `Elite ${subtype}`)
        ], false, "&")}`;
      }
    }
  }

  _prepareGmTrackerData(system: ExtractBladesItemSystem<BladesItemType.gm_tracker>) {
    if (!BladesItem.IsType(this, BladesItemType.gm_tracker)) { return }
    system.phases = Object.values(BladesPhase);
  }

  _prepareGearData(system: ExtractBladesItemSystem<BladesItemType.gear>) {
    if (!BladesItem.IsType(this, BladesItemType.gear)) { return }
    system.tier.name = "Quality";
  }

  _preparePlaybookData(system: ExtractBladesItemSystem<BladesItemType.playbook|BladesItemType.crew_playbook>) {
    if (!BladesItem.IsType(this, BladesItemType.playbook, BladesItemType.crew_playbook)) { return }
    const expClueData: Record<string,string> = {};
    [...Object.values(system.experience_clues).filter((clue) => /[A-Za-z]/.test(clue)), " "].forEach((clue, i) => { expClueData[(i + 1).toString()] = clue });
    system.experience_clues = expClueData as any;
    eLog.checkLog3("experienceClues", {expClueData});

    if (BladesItem.IsType(this, BladesItemType.playbook)) {
      const gatherInfoData: Record<string,string> = {};
      [...Object.values((<ExtractBladesItemSystem<BladesItemType.playbook>>system).gather_info_questions).filter((question) => /[A-Za-z]/.test(question)), " "].forEach((question, i) => { gatherInfoData[(i + 1).toString()] = question });
      (<ExtractBladesItemSystem<BladesItemType.playbook>>system).gather_info_questions = gatherInfoData as any;
      eLog.checkLog3("gatherInfoQuestions", {gatherInfoData});

    }
  }
  // #endregion

  // #region CLOCKS OVERLAY
  _overlayElement?: HTMLElement;
  get overlayElement() {
    this._overlayElement ??= $("#clocks-overlay")[0];
    if (!this._overlayElement) {
      $("body.vtt.game.system-eunos-blades").append("<section id=\"clocks-overlay\"></section>");
      [this._overlayElement] = $("#clocks-overlay");
    }
    return this._overlayElement;
  }

  async renderOverlay() {
    if (!game.scenes?.current) { return }
    if (!game.eunoblades.ClockKeeper) { return }
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
    if (!game?.user?.isGM) { return }
    $("#clocks-overlay").find(".clock-frame").on("wheel", async (event) => {
      if (!event.currentTarget) { return }
      if (!BladesItem.IsType(game.eunoblades.ClockKeeper, BladesItemType.clock_keeper)) { return }
      if (!(event.originalEvent instanceof WheelEvent)) { return }

      event.preventDefault();

      const clock$ = $(event.currentTarget).closest(".clock");
      const [key] = clock$.closest(".clock-key");

      if (!(key instanceof HTMLElement)) { return }

      const keyID = key.id;
      const clockNum = clock$.data("index");
      const curClockVal = U.pInt(clock$.data("value"));
      const delta = event.originalEvent.deltaY < 0 ? 1 : -1;
      const max = U.pInt(clock$.data("size"));

      const newClockVal = U.gsap.utils.clamp(0, max, curClockVal + delta);

      if (curClockVal === newClockVal) { return }

      await game.eunoblades.ClockKeeper.update({
        [`system.clock_keys.${keyID}.clocks.${clockNum}.value`]: `${newClockVal}`
      });
      // socketlib.system.executeForEveryone("renderOverlay");
    });

    // .on({
    //   mouseenter: function() {
    //     $(this).parent().css("z-index", 1);
    //     $(this).data("hoverTimeline").play();
    //   },
    //   mouseleave: function() {
    //     $(this).data("hoverTimeline").reverse().then(() => {
    //       $(this).parent().removeAttr("style");
    //     });
    //   }
    $("#clocks-overlay").find(".key-label").on({
      click: async (event) => {
        if (!event.currentTarget) { return }
        if (!BladesItem.IsType(game.eunoblades.ClockKeeper, BladesItemType.clock_keeper)) { return }

        event.preventDefault();

        const keyID = $(event.currentTarget).data("keyId") as string;
        eLog.checkLog3("clocksOverlay", "Updating Key isActive", {current: game.eunoblades.ClockKeeper.system.clock_keys![keyID]?.isActive, update: !(game.eunoblades.ClockKeeper.system.clock_keys![keyID]?.isActive)});
        await game.eunoblades.ClockKeeper.update({[`system.clock_keys.${keyID}.isActive`]: !(game.eunoblades.ClockKeeper.system.clock_keys![keyID]?.isActive)});
        // socketlib.system.executeForEveryone("renderOverlay");
      },
      contextmenu: () => {
        if (!game?.user?.isGM) { return }
        game.eunoblades.ClockKeeper?.sheet?.render(true);
      }
    });
  }

  async addClockKey(): Promise<BladesItemOfType<BladesItemType.clock_keeper>|undefined> {
    if (!BladesItem.IsType(game.eunoblades.ClockKeeper, BladesItemType.clock_keeper)) { return undefined }
    const keyID = randomID();
    return game.eunoblades.ClockKeeper.update({[`system.clock_keys.${keyID}`]: {
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
    }});
  }

  async deleteClockKey(keyID: string): Promise<BladesItemOfType<BladesItemType.clock_keeper>|undefined> {
    if (!BladesItem.IsType(game.eunoblades.ClockKeeper, BladesItemType.clock_keeper)) { return undefined }
    return game.eunoblades.ClockKeeper.update({[`system.clock_keys.-=${keyID}`]: null});
  }

  async setKeySize(keyID: string, keySize = 1): Promise<BladesItemOfType<BladesItemType.clock_keeper>|undefined> {
    if (!BladesItem.IsType(game.eunoblades.ClockKeeper, BladesItemType.clock_keeper)) { return undefined }
    keySize = parseInt(`${keySize}`);
    const updateData: Record<string, any> = {
      [`system.clock_keys.${keyID}.numClocks`]: keySize
    };
    const clockKey = game.eunoblades.ClockKeeper.system.clock_keys![keyID];
    if (!clockKey) { return game.eunoblades.ClockKeeper }
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
    } else if (currentSize > keySize) {
      for (let i = (keySize + 1); i <= currentSize; i++) {
        updateData[`system.clock_keys.${keyID}.clocks.-=${i}`] = null;
      }
    }
    eLog.checkLog("clock_key", "Clock Key Update Data", {clockKey, updateData});
    return game.eunoblades.ClockKeeper.update(updateData);
    // return socketlib.system.executeForEveryone("renderOverlay");
  }
  // #endregion

  // #region OVERRIDES: _onUpdate
  override async _onUpdate(changed: any, options: any, userId: string) {
    await super._onUpdate(changed, options, userId);
    if (BladesItem.IsType(this, BladesItemType.gm_tracker, BladesItemType.clock_keeper, BladesItemType.location, BladesItemType.score)) {
      BladesActor.GetTypeWithTags(BladesActorType.pc).forEach((actor) => actor.render());
    }
    if (BladesItem.IsType(this, BladesItemType.clock_keeper)) {
      socketlib.system.executeForEveryone("renderOverlay");
    }
  }
  // #endregion

}

declare interface BladesItem {
  get id(): string;
  get type(): BladesItemType,
  parent: BladesActor | null,
  system: BladesItemSystem
}

export default BladesItem;