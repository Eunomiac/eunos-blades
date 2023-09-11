import C, {SVGDATA, BladesActorType, BladesItemType, Tag, BladesPhase, RollModCategory, PrereqType, Factor, RollModStatus} from "./core/constants.js";
import U from "./core/utilities.js";
import BladesActor from "./blades-actor.js";
import BladesPC from "./documents/actors/blades-pc.js";
import BladesNPC from "./documents/actors/blades-npc.js";
import BladesFaction from "./documents/actors/blades-faction.js";
import BladesCrew from "./documents/actors/blades-crew.js";
import BladesRollCollab from "./blades-roll-collab.js";
import type {ItemDataConstructorData} from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/itemData.js";

class BladesItem extends Item implements BladesDocument<Item>,
                                          BladesItemSubClass.Ability,
                                          BladesItemSubClass.Background,
                                          BladesItemSubClass.Cohort_Gang,
                                          BladesItemSubClass.Cohort_Expert,
                                          BladesItemSubClass.Crew_Ability,
                                          BladesItemSubClass.Crew_Reputation,
                                          BladesItemSubClass.Crew_Playbook,
                                          BladesItemSubClass.Crew_Upgrade,
                                          BladesItemSubClass.Feature,
                                          BladesItemSubClass.Heritage,
                                          BladesItemSubClass.Gear,
                                          BladesItemSubClass.Playbook,
                                          BladesItemSubClass.Preferred_Op,
                                          BladesItemSubClass.Stricture,
                                          BladesItemSubClass.Vice,
                                          BladesItemSubClass.Project,
                                          BladesItemSubClass.Ritual,
                                          BladesItemSubClass.Design,
                                          BladesRollCollab.SourceDocData,
                                          BladesRollCollab.OppositionDocData {

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
        return this.system.tier.value;
      }
      case Factor.quality: {
        // if (BladesItem.IsType(this, BladesItemType.ability)) { return this.getFactorTotal(Factor.tier) }
        // if (BladesItem.IsType(this, BladesItemType.background)) { return this.getFactorTotal(Factor.tier) }
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
        // if (BladesItem.IsType(this, BladesItemType.heritage)) { return this.getFactorTotal(Factor.tier) }
        if (BladesItem.IsType(this, BladesItemType.gear)) {
          return this.getFactorTotal(Factor.tier)
            + (this.hasTag("Fine") ? 1 : 0)
            + (this.parent?.getTaggedItemBonuses(this.tags) ?? 0)
            + (BladesActor.IsType(this.parent, BladesActorType.pc) && this.parent?.crew ? this.parent.crew.getTaggedItemBonuses(this.tags) : 0);
        }
        // if (BladesItem.IsType(this, BladesItemType.playbook)) { return this.getFactorTotal(Factor.tier) }
        // if (BladesItem.IsType(this, BladesItemType.preferred_op)) { return this.getFactorTotal(Factor.tier) }
        // if (BladesItem.IsType(this, BladesItemType.stricture)) { return this.getFactorTotal(Factor.tier) }
        // if (BladesItem.IsType(this, BladesItemType.vice)) { return this.getFactorTotal(Factor.tier) }
        // if (BladesItem.IsType(this, BladesItemType.project)) { return this.getFactorTotal(Factor.tier) }
        // if (BladesItem.IsType(this, BladesItemType.ritual)) { return this.getFactorTotal(Factor.tier) }
        if (BladesItem.IsType(this, BladesItemType.design)) { return this.system.min_quality }
        return this.getFactorTotal(Factor.tier);
      }
      case Factor.scale: {
        // if (BladesItem.IsType(this, BladesItemType.ability)) { return 0 }
        // if (BladesItem.IsType(this, BladesItemType.background)) { return 0 }
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
        // if (BladesItem.IsType(this, BladesItemType.heritage)) { return 0 }
        // if (BladesItem.IsType(this, BladesItemType.gear)) { return 0 }
        // if (BladesItem.IsType(this, BladesItemType.playbook)) { return 0 }
        // if (BladesItem.IsType(this, BladesItemType.preferred_op)) { return 0 }
        // if (BladesItem.IsType(this, BladesItemType.stricture)) { return 0 }
        // if (BladesItem.IsType(this, BladesItemType.vice)) { return 0 }
        // if (BladesItem.IsType(this, BladesItemType.project)) { return 0 }
        // if (BladesItem.IsType(this, BladesItemType.ritual)) { return 0 }
        // if (BladesItem.IsType(this, BladesItemType.design)) { return 0 }
        return 0;
      }
      case Factor.magnitude: {
        // if (BladesItem.IsType(this, BladesItemType.ability)) { return 0 }
        // if (BladesItem.IsType(this, BladesItemType.background)) { return 0 }
        // if (BladesItem.IsType(this, BladesItemType.cohort_gang)) { return 0 }
        // if (BladesItem.IsType(this, BladesItemType.cohort_expert)) { return 0 }
        // if (BladesItem.IsType(this, BladesItemType.crew_ability)) { return 0 }
        // if (BladesItem.IsType(this, BladesItemType.crew_reputation)) { return 0 }
        // if (BladesItem.IsType(this, BladesItemType.crew_playbook)) { return 0 }
        // if (BladesItem.IsType(this, BladesItemType.crew_upgrade)) { return 0 }
        // if (BladesItem.IsType(this, BladesItemType.feature)) { return 0 }
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

  // #region BladesRollSource Implementation

  get rollSourceID() { return this.id }
  get rollSourceDoc() { return this }
  get rollSourceImg() { return this.img ?? undefined }
  get rollSourceName() { return this.name ?? "" }
  get rollSourceType() { return this.type }

  get rollOppID() { return this.id }
  get rollOppDoc() { return this }
  get rollOppImg() { return this.img ?? undefined }
  get rollOppName() { return this.name ?? "" }
  get rollOppSubName() { return "" }
  get rollOppType() { return this.type }

  get rollModsData(): BladesRollCollab.RollModData[] {
    const {roll_mods} = this.system;
    if (!roll_mods) { return [] }

    const rollModsData: BladesRollCollab.RollModData[] = roll_mods.map((modString) => {
      const pStrings = modString.split(/@/);
      const nameString = U.pullElement(pStrings, (v) => typeof v === "string" && /^na/i.test(v));
      const nameVal = (typeof nameString === "string" && nameString.replace(/^.*:/, "")) as string|false;
      if (!nameVal) { throw new Error(`RollMod Missing Name: '${modString}'`) }
      const catString = U.pullElement(pStrings, (v) => typeof v === "string" && /^cat/i.test(v));
      const catVal = (typeof catString === "string" && catString.replace(/^.*:/, "")) as RollModCategory|false;
      if (!catVal || !(catVal in RollModCategory)) { throw new Error(`RollMod Missing Category: '${modString}'`) }
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
        if (/^c.*r?.*ty/i.test(keyString)) { key = "conditionalRollTypes" } else
        if (/^a.*r?.*y/i.test(keyString)) { key = "autoRollTypes" } else
        if (/^c.*r?.*tr/i.test(keyString)) { key = "conditionalRollTraits" } else
        if (/^a.*r?.*tr/i.test(keyString)) { key = "autoRollTraits" } else {
          throw new Error(`Bad Roll Mod Key: ${keyString}`);
        }

        if (key === "base_status" && val === "Conditional") {
          val = RollModStatus.Hidden;
        }

        Object.assign(
          rollModData,
          {[key]: ["value"].includes(key)
            ? U.pInt(val)
            : (["effectKeys", "conditionalRollTypes", "autoRollTypes,", "conditionalRollTraits", "autoRollTraits"].includes(key)
                ? [val].flat()
                : (val as string).replace(/%COLON%/g, ":"))}
        );
      });

      return rollModData;
    });

    // Add roll mods from COHORT harm
    // [[/1d/, RollModCategory.roll] as const, [/Less Effect/, RollModCategory.effect] as const].forEach(([effectPat, effectCat]) => {
    //   const {one: harmConditionOne, two: harmConditionTwo} = Object.values(this.system.harm ?? {})
    //     .find((harmData) => effectPat.test(harmData.effect)) ?? {};
    //   const harmString = U.objCompact([harmConditionOne, harmConditionTwo === "" ? null : harmConditionTwo]).join(" & ");
    //   if (harmString.length > 0) {
    //     rollModsData.push({
    //       id: `Harm-negative-${effectCat}`,
    //       name: harmString,
    //       category: effectCat,
    //       posNeg: "negative",
    //       base_status: RollModStatus.ToggledOn,
    //       modType: "harm",
    //       value: 1,
    //       tooltip: [
    //         `<h1 class='red-bright'><strong>Harm:</strong> ${harmString}</h1>`,
    //         effectCat === RollModCategory.roll
    //           ? "<p>If your injuries apply to the situation at hand, you suffer <strong class='red-bright'>−1d</strong> to your roll.</p>"
    //           : "<p>If your injuries apply to the situation at hand, you suffer <strong class='red-bright'>−1 effect</strong>."
    //       ].join("")
    //     });
    //   }
    // });

    // eLog.checkLog3("rollCollab", `Roll Mods (${this.name})`, {system: this.system.roll_mods, rollMods});

    return rollModsData;
  }

  get rollFactors(): Partial<Record<Factor,BladesRollCollab.FactorData>> {
    const factorsMap: Partial<Record<BladesItemType, Factor[]>> = {
      [BladesItemType.ability]: [],
      [BladesItemType.background]: [],
      [BladesItemType.cohort_gang]: [Factor.quality, Factor.scale],
      [BladesItemType.cohort_expert]: [Factor.quality, Factor.scale],
      [BladesItemType.crew_ability]: [],
      [BladesItemType.crew_reputation]: [],
      [BladesItemType.crew_playbook]: [],
      [BladesItemType.crew_upgrade]: [],
      [BladesItemType.feature]: [],
      [BladesItemType.heritage]: [],
      [BladesItemType.gear]: [Factor.quality],
      [BladesItemType.playbook]: [],
      [BladesItemType.preferred_op]: [],
      [BladesItemType.stricture]: [],
      [BladesItemType.vice]: [],
      [BladesItemType.project]: [Factor.quality],
      [BladesItemType.ritual]: [Factor.magnitude],
      [BladesItemType.design]: [Factor.quality]
    };
    if (!factorsMap[this.type]) { return {} }

    const factors = factorsMap[this.type];

    const factorData: Partial<Record<Factor,BladesRollCollab.FactorData>> = {};
    factors!.forEach((factor, i) => {
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
  // #endregion

  // #region PREPARING DERIVED DATA
  override prepareDerivedData() {
    super.prepareDerivedData();
    // if (BladesItem.IsType(this, BladesItemType.ability)) { this._prepareAbilityData(this.system) }
    // if (BladesItem.IsType(this, BladesItemType.background)) { this._prepareBackgroundData(this.system) }
    if (BladesItem.IsType(this, BladesItemType.cohort_gang, BladesItemType.cohort_expert)) { this._prepareCohortData(this.system) }
    // if (BladesItem.IsType(this, BladesItemType.crew_ability)) { this._prepareCrewAbilityData(this.system) }
    // if (BladesItem.IsType(this, BladesItemType.crew_reputation)) { this._prepareCrewReputationData(this.system) }
    if (BladesItem.IsType(this, BladesItemType.crew_playbook)) { this._preparePlaybookData(this.system) }
    // if (BladesItem.IsType(this, BladesItemType.crew_upgrade)) { this._prepareCrewUpgradeData(this.system) }
    // if (BladesItem.IsType(this, BladesItemType.feature)) { this._prepareFeatureData(this.system) }
    // if (BladesItem.IsType(this, BladesItemType.heritage)) { this._prepareHeritageData(this.system) }
    if (BladesItem.IsType(this, BladesItemType.gear)) { this._prepareGearData(this.system) }
    if (BladesItem.IsType(this, BladesItemType.playbook)) { this._preparePlaybookData(this.system) }
    // if (BladesItem.IsType(this, BladesItemType.preferred_op)) { this._preparePreferredOpData(this.system) }
    // if (BladesItem.IsType(this, BladesItemType.stricture)) { this._prepareStrictureData(this.system) }
    // if (BladesItem.IsType(this, BladesItemType.vice)) { this._prepareViceData(this.system) }
    // if (BladesItem.IsType(this, BladesItemType.project)) { this._prepareProjectData(this.system) }
    // if (BladesItem.IsType(this, BladesItemType.ritual)) { this._prepareRitualData(this.system) }
    // if (BladesItem.IsType(this, BladesItemType.design)) { this._prepareDesignData(this.system) }
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
}

declare interface BladesItem {
  get id(): string;
  get type(): BladesItemType,
  parent: BladesActor | null,
  system: BladesItemSystem
}

export default BladesItem;