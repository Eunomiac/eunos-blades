import C, {BladesActorType, BladesItemType, Tag, Factor} from "./core/constants.js";
import U from "./core/utilities.js";
import {BladesActor, BladesCrew} from "./documents/blades-actor-proxy.js";
import {BladesRollMod} from "./blades-roll-collab.js";
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
                                          BladesItemSubClass.Design {

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
            + (
              BladesActor.IsType(this.parent, BladesActorType.pc)
                && BladesActor.IsType(this.parent.crew, BladesActorType.crew)
                ? this.parent.crew.getTaggedItemBonuses(this.tags)
                : 0
            );
        }
        if (BladesItem.IsType(this, BladesItemType.design)) { return this.system.min_quality }
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

  // #region BladesRollCollab Implementation

  get rollFactors(): Partial<Record<Factor,BladesRollCollab.FactorData>> {
    const factorsMap: Partial<Record<BladesItemType, Factor[]>> = {
      [BladesItemType.cohort_gang]: [Factor.quality, Factor.scale],
      [BladesItemType.cohort_expert]: [Factor.quality, Factor.scale],
      [BladesItemType.gear]: [Factor.quality],
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

  // #region BladesRollCollab.PrimaryDoc Implementation
  get rollPrimaryID() { return this.id }
  get rollPrimaryDoc() { return this }
  get rollPrimaryName() { return this.name }
  get rollPrimaryType() { return this.type }
  get rollPrimaryImg() { return this.img }

  get rollModsData(): BladesRollCollab.RollModData[] {
    const rollModData = BladesRollMod.ParseDocRollMods(this);

    // Add roll mods from COHORT harm

    return rollModData;
  }

  // #endregion

  // #region BladesRollCollab.OppositionDoc Implementation
  get rollOppID() { return this.id }
  get rollOppDoc() { return this }
  get rollOppImg() { return this.img! }
  get rollOppName() { return this.name! }
  get rollOppSubName() { return "" }
  get rollOppType() { return this.type }

  get rollOppModsData(): BladesRollCollab.RollModData[] { return [] }
  // #endregion

  // #region BladesRollCollab.ParticipantDoc Implementation
  get rollParticipantID() { return this.id }
  get rollParticipantDoc() { return this }
  get rollParticipantIcon() { return this.img! }
  get rollParticipantName() { return this.name! }
  get rollParticipantType() { return this.type }

  get rollParticipantModsData(): BladesRollCollab.RollModData[] { return [] }
  // #endregion

  // #endregion

  // #region PREPARING DERIVED DATA
  override prepareDerivedData() {
    super.prepareDerivedData();
    if (BladesItem.IsType(this, BladesItemType.cohort_gang, BladesItemType.cohort_expert)) { this._prepareCohortData(this.system) }
    if (BladesItem.IsType(this, BladesItemType.crew_playbook)) { this._preparePlaybookData(this.system) }
    if (BladesItem.IsType(this, BladesItemType.gear)) { this._prepareGearData(this.system) }
    if (BladesItem.IsType(this, BladesItemType.playbook)) { this._preparePlaybookData(this.system) }
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
        system.subtitle = system.subtitle.replace(/\s+of\b/g, "").trim();
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
  get name(): string;
  get img(): string;
  get type(): BladesItemType,
  parent: BladesActor | null,
  system: BladesItemSystem
}

export default BladesItem;