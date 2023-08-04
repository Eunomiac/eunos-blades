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

class BladesItem extends Item implements BladesDocument<Item> {

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
  static GetTypeWithTags<T extends BladesItemType>(docType: T, ...tags: BladesTag[]): Array<BladesItemOfType<T>> {
    return BladesItem.All.filter((item): item is BladesItemOfType<T> => item.type === docType)
      .filter((item) => item.hasTag(...tags));
  }

  static IsType<T extends BladesItemType>(doc: BladesDoc, ...types: T[]): doc is BladesItemOfType<T> {
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
      this.system.description,
      this.system.rules
    ].filter(Boolean).join("");
    if (tooltipText) { return (new Handlebars.SafeString(tooltipText)).toString() }
    return undefined;
  }
  dialogCSSClasses = "";
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

  // get load() { return this.system.load ?? 0 }
  // get maxPerScore() { return this.system.max_per_score ?? 1 }
  // get usesPerScore() { return this.system.uses_per_score?.max ?? 1 }
  // get usesRemaining() { return Math.max(0, this.usesPerScore - (this.system.uses_per_score?.value ?? 0)) }
  // #endregion

  // #region BladesGMTracker Implementation

  get phase(): BladesPhase|false { return BladesItem.IsType(this, BladesItemType.gm_tracker) && this.system.phase }
  set phase(phase: BladesPhase|false) {
    if (phase && BladesItem.IsType(this, BladesItemType.gm_tracker)) {
      this.update({"system.phase": phase});
    }
  }

  get actionMax() { return this.phase === BladesPhase.CharGen ? 2 : undefined}

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
    // if (BladesItem.IsType(this, BladesItemType.crew_playbook)) { this._prepareCrewPlaybookData(this.system) }
    // if (BladesItem.IsType(this, BladesItemType.crew_upgrade)) { this._prepareCrewUpgradeData(this.system) }
    // if (BladesItem.IsType(this, BladesItemType.feature)) { this._prepareFeatureData(this.system) }
    if (BladesItem.IsType(this, BladesItemType.gm_tracker)) { this._prepareGmTrackerData(this.system) }
    // if (BladesItem.IsType(this, BladesItemType.heritage)) { this._prepareHeritageData(this.system) }
    // if (BladesItem.IsType(this, BladesItemType.gear)) { this._prepareItemData(this.system) }
    // if (BladesItem.IsType(this, BladesItemType.playbook)) { this._preparePlaybookData(this.system) }
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
      .filter(([keyID, keyData]) => Boolean(keyData))
      .map(([keyID, keyData]) => {
        if (keyData === null) { return [keyID, null] }
        keyData.clocks = Object.fromEntries(Object.entries(keyData.clocks)
          .filter(([clockNum, clockData]) => Boolean(clockData)));
        return [keyID, keyData];
      }));
  }

  _prepareGmTrackerData(system: ExtractBladesItemSystem<BladesItemType.gm_tracker>) {
    if (!BladesItem.IsType(this, BladesItemType.gm_tracker)) { return }
    system.phases = Object.values(BladesPhase);
  }

  _prepareCohortData(system: ExtractBladesItemSystem<BladesItemType.cohort_gang|BladesItemType.cohort_expert>) {
    if (!BladesItem.IsType(this, BladesItemType.cohort_gang, BladesItemType.cohort_expert)) { return }
    if (!this.parent || !BladesActor.IsType(this.parent, BladesActorType.pc, BladesActorType.crew)) { return }
    if (BladesItem.IsType(this, BladesItemType.cohort_gang)) {
      system.scale = system.tier.value + this.system.tier.value;
      system.quality = system.tier.value + this.system.tier.value;
    }
    if (BladesItem.IsType(this, BladesItemType.cohort_expert)) {
      system.scale = 0;
      system.quality = system.tier.value + this.system.tier.value + 1;
    }
  }

  async activateOverlayListeners() {
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
      const size = U.pInt(clock$.data("size"));

      const newClockVal = U.gsap.utils.clamp(0, size, curClockVal + delta);

      if (curClockVal === newClockVal) { return }

      await this.update({
        [`system.clock_keys.${keyID}.clocks.${clockNum}.value`]: `${newClockVal}`
      });
      socketlib.system.executeForEveryone("renderOverlay");
    });

    $("#clocks-overlay").find(".clock").on("click", async (event) => {
      if (!event.currentTarget) { return }
      if (!game.eunoblades.ClockKeeper) { return }

      event.preventDefault();
      const [key] = $(event.currentTarget).closest(".clock-key");
      if (!(key instanceof HTMLElement)) { return }

      $(key).toggleClass("key-faded");
    });
  }

  async addClockKey() {
    const keyID = randomID();
    return this.update({[`system.clock_keys.${keyID}`]: {
      id: keyID,
      display: "",
      isVisible: false,
      isNameVisible: true,
      isActive: false,
      scene: this.system.targetScene,
      numClocks: 1,
      clocks: {
        1: {
          display: "",
          isVisible: true,
          isNameVisible: true,
          isActive: true,
          color: "yellow",
          size: 4,
          value: 0
        }
      }
    }});
  }

  async deleteClockKey(keyID: string) {
    const clockKeys = this.system.clock_keys ?? {};
    clockKeys[keyID] = null;
    return this.update({"system.clock_keys": clockKeys});
  }

  async setKeySize(keyID: string, keySize = 1) {
    keySize = parseInt(`${keySize}`);
    const clockKey = this.system.clock_keys![keyID];
    if (!clockKey) { return this }
    [...new Array(keySize)].map((_, i) => i + 1)
      .forEach((clockNum) => {
        clockKey.clocks[clockNum] ??= {
          title: "",
          value: 0,
          max: 4,
          color: "yellow",
          isClockVisible: false,
          isTitleVisible: false,
          isFocused: false
        };
      });
    [...new Array(6 - keySize)].map((_, i) => keySize + i + 1)
      .forEach((clockNum) => {
        delete clockKey.clocks[clockNum];
      });
    return this.update({[`system.clock_keys.${keyID}`]: clockKey});
  }

  override async _onUpdate(changed: any, options: any, userId: string) {
    await super._onUpdate(changed, options, userId);
    if (BladesItem.IsType(this, BladesItemType.gm_tracker)) {
      BladesActor.GetTypeWithTags(BladesActorType.pc).forEach((actor) => actor.render());
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
  get type(): string & BladesItemType,
  parent: BladesActor | null,
  system: BladesItemSystem
}

export default BladesItem;