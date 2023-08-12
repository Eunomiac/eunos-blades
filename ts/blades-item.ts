import C, {SVGDATA, BladesActorType, BladesItemType, Tag, BladesPhase} from "./core/constants.js";
import U from "./core/utilities.js";
import BladesActor from "./blades-actor.js";
import {ItemDataConstructorData} from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/itemData.js";


export enum PrereqType {
  HasActiveItem = "HasActiveItem", // Item will only appear in selector if character has Item with world_name (value)
  HasActiveItemsByTag = "HasActiveItemByTag", // For each Tag, character must have an active Item with that tag.
  AdvancedPlaybook = "AdvancedPlaybook", // Item will only appear in selector if character is a Ghost, Hull or Vampire
  HasAllTags = "HasAllTags", // Item will only appear if character has all matching tags.
  HasAnyTag = "HasAnyTag", // Item will appear if character has any matching tag.

  Not_HasActiveItem = "Not_HasActiveItem",
  Not_HasActiveItemsByTag = "Not_HasActiveItemsByTag",
  Not_AdvancedPlaybook = "Not_AdvancedPlaybook",
  Not_HasAllTags = "Not_HasAllTags",
  Not_HasAnyTag = "Not_HasAnyTag"
}

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
                                          BladesItemSubClass.Score {

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
  // #endregion

  getTierTotal() {
    // if (BladesItem.IsType(this, BladesItemType.ability)) { this._prepareAbilityData(this.system) }
    // if (BladesItem.IsType(this, BladesItemType.background)) { this._prepareBackgroundData(this.system) }
    // if (BladesItem.IsType(this, BladesItemType.clock_keeper)) { this._prepareClockKeeperData(this.system) }
    if (this.parent instanceof BladesActor && BladesItem.IsType(this, BladesItemType.cohort_gang)) {
      return this.system.tier.value + this.parent.getTierTotal() + this.system.quality_bonus;
    }
    if (this.parent instanceof BladesActor && BladesItem.IsType(this, BladesItemType.cohort_expert)) {
      return this.system.tier.value + this.parent.getTierTotal() + this.system.quality_bonus + 1;
    }
    // if (BladesItem.IsType(this, BladesItemType.crew_ability)) { this._prepareCrewAbilityData(this.system) }
    // if (BladesItem.IsType(this, BladesItemType.crew_reputation)) { this._prepareCrewReputationData(this.system) }
    // if (BladesItem.IsType(this, BladesItemType.crew_playbook)) { this._preparePlaybookData(this.system) }
    // if (BladesItem.IsType(this, BladesItemType.crew_upgrade)) { this._prepareCrewUpgradeData(this.system) }
    // if (BladesItem.IsType(this, BladesItemType.feature)) { this._prepareFeatureData(this.system) }
    // if (BladesItem.IsType(this, BladesItemType.gm_tracker)) { this._prepareGmTrackerData(this.system) }
    // if (BladesItem.IsType(this, BladesItemType.heritage)) { this._prepareHeritageData(this.system) }
    if (BladesItem.IsType(this, BladesItemType.gear)) {
      return this.system.tier.value
        + (this.parent?.getTierTotal() ?? 0)
        + (this.hasTag("Fine") ? 1 : 0)
        + (this.parent?.getTaggedItemBonuses(this.tags) ?? 0)
        + (this.parent?.crew ? this.parent.crew.getTaggedItemBonuses(this.tags) : 0);
    }
    // if (BladesItem.IsType(this, BladesItemType.playbook)) { this._preparePlaybookData(this.system) }
    // if (BladesItem.IsType(this, BladesItemType.preferred_op)) { this._preparePreferredOpData(this.system) }
    // if (BladesItem.IsType(this, BladesItemType.stricture)) { this._prepareStrictureData(this.system) }
    // if (BladesItem.IsType(this, BladesItemType.vice)) { this._prepareViceData(this.system) }
    if (BladesItem.IsType(this, BladesItemType.project)) { return this.system.tier.value }
    if (BladesItem.IsType(this, BladesItemType.ritual)) { return this.system.tier.value }
    if (BladesItem.IsType(this, BladesItemType.design)) { return this.system.tier.value }
    // if (BladesItem.IsType(this, BladesItemType.location)) { this._prepareLocationData(this.system) }
    // if (BladesItem.IsType(this, BladesItemType.score)) { this._prepareScoreData(this.system) }
    return null as never;
  }

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
  override async _preCreate( data: any, options: any, user: User ) {
    await super._preCreate( data, options, user );

    if (user.id !== game.user?.id) { return }
    if (this.parent?.documentName !== "Actor") { return }
  }

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
    if (!this.parent || !BladesActor.IsType(this.parent, BladesActorType.pc, BladesActorType.crew)) { return }

    system.tier.name = "Quality";
    if (BladesItem.IsType(this, BladesItemType.cohort_gang)) {
      system.scale = this.getTierTotal() + this.system.scale_bonus;
      system.quality = this.getTierTotal();
    }
    if (BladesItem.IsType(this, BladesItemType.cohort_expert)) {
      system.scale = 0;
      system.quality = this.getTierTotal();
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

  async activateOverlayListeners() {
    if (!BladesItem.IsType(this, BladesItemType.clock_keeper)) { return }
    $("#clocks-overlay").find(".clock-frame").on("wheel", async (event) => {
      if (!game?.user?.isGM) { return }
      if (!event.currentTarget) { return }
      if (!game.eunoblades.ClockKeeper) { return }
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

      await this.update({
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
        if (!game?.user?.isGM) { return }
        if (!event.currentTarget) { return }
        if (!game.eunoblades.ClockKeeper) { return }

        event.preventDefault();

        const keyID = $(event.currentTarget).data("keyId") as string;
        eLog.checkLog3("Updating Key isActive", {current: this.system.clock_keys![keyID]?.isActive, update: !(this.system.clock_keys![keyID]?.isActive)});
        await this.update({[`system.clock_keys.${keyID}.isActive`]: !(this.system.clock_keys![keyID]?.isActive)});
        // socketlib.system.executeForEveryone("renderOverlay");
      },
      contextmenu: () => {
        if (!game?.user?.isGM) { return }
        game.eunoblades.ClockKeeper?.sheet?.render(true);
      }
    });
  }

  async addClockKey() {
    const keyID = randomID();
    return this.update({[`system.clock_keys.${keyID}`]: {
      id: keyID,
      display: "",
      isVisible: false,
      isNameVisible: true,
      isActive: true,
      scene: this.system.targetScene,
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

  async deleteClockKey(keyID: string) {
    return this.update({[`system.clock_keys.-=${keyID}`]: null});
  }

  async setKeySize(keyID: string, keySize = 1) {
    console.log("Setting Key Size");
    keySize = parseInt(`${keySize}`);
    const updateData: Record<string, any> = {
      [`system.clock_keys.${keyID}.numClocks`]: keySize
    };
    const clockKey = this.system.clock_keys![keyID];
    if (!clockKey) { return this }
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
    return this.update(updateData);
    // return socketlib.system.executeForEveryone("renderOverlay");
  }

  override async _onUpdate(changed: any, options: any, userId: string) {
    await super._onUpdate(changed, options, userId);
    if (BladesItem.IsType(this, BladesItemType.gm_tracker, BladesItemType.clock_keeper, BladesItemType.location, BladesItemType.score)) {
      BladesActor.GetTypeWithTags(BladesActorType.pc).forEach((actor) => actor.render());
    }
    if (BladesItem.IsType(this, BladesItemType.clock_keeper)) {
      socketlib.system.executeForEveryone("renderOverlay");
    }
  }

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
    this.overlayElement.innerHTML = (await getTemplate("systems/eunos-blades/templates/overlays/clock-overlay.hbs"))({
      ...this.system,
      currentScene: game.scenes?.current.id,
      clockSizes: C.ClockSizes,
      svgData: SVGDATA
    });
    this.activateOverlayListeners();
  }
}

declare interface BladesItem {
  get type(): BladesItemType,
  parent: BladesActor | null,
  system: BladesItemSystem
}

export default BladesItem;