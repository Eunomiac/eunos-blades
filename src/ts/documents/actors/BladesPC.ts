import C, {Playbook, BladesNoticeType, ClockColor, AttributeTrait, ActionTrait, Harm, BladesActorType, BladesItemType, Tag, RollModType, RollModSection, RollModStatus} from "../../core/constants";
import U from "../../core/utilities";
import {BladesActor, BladesCrew} from "../BladesActorProxy";
import BladesPCSheet from "../../sheets/actor/BladesPCSheet";
import {BladesItem, BladesProject} from "../BladesItemProxy";
import BladesRoll from "../../classes/BladesRoll";
import BladesClockKey from "../../classes/BladesClockKey";
import BladesDirector from "../../classes/BladesDirector";
import {SelectionCategory} from "../../classes/BladesDialog";
import type {ActorDataConstructorData} from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/actorData";

class BladesPC extends BladesActor implements BladesActorSubClass.Scoundrel,
                                              BladesRoll.PrimaryData,
                                              BladesRoll.ParticipantData {


  // #region INITIALIZATION ~
  static async Initialize() {
    Object.assign(globalThis, {BladesPC, BladesPCSheet});
    Actors.registerSheet("blades", BladesPCSheet, {types: ["pc"], makeDefault: true});
    Hooks.on("dropActorSheetData", async (parentActor: BladesActor, _, {uuid}: {uuid: string}) => {
      const doc = fromUuidSync(uuid);
      if (doc instanceof BladesActor) {
        if (parentActor.type === BladesActorType.crew && doc.type === BladesActorType.pc) {
          // Dropping a PC onto a Crew Sheet: Add Crew to PC
          doc.addSubActor(parentActor);
        } else if (parentActor.type === BladesActorType.pc && doc.type === BladesActorType.crew) {
          // Dropping a Crew onto a PC Sheet: Add
          parentActor.addSubActor(doc);
        }
      }
    });
    return loadTemplates(["systems/eunos-blades/templates/actor-sheet.hbs"]);
  }
  // #endregion

  // #region Static Overrides: Create, get All ~
  // static override IsType<T extends BladesActorType = BladesActorType.pc>(doc: unknown): doc is BladesActorOfType<T> {
  //   return super.IsType(doc, BladesActorType.pc);
  // }

  static override IsType<T extends BladesActorType = BladesActorType.pc>(
    doc: unknown
  ): doc is BladesPC & BladesActorOfType<T> {
    return super.IsType(doc, BladesActorType.pc);
  }

  static GetUser(userRef: unknown): User|undefined {
    let user: User|undefined;
    if (typeof userRef === "string") {
      user = game.users.get(userRef) ?? game.users.getName(userRef);
    } else if (userRef instanceof User) {
      user = userRef;
    }
    return user;
  }

  static GetFromUser(userRef: unknown): BladesPC|undefined {
    const user = BladesPC.GetUser(userRef);
    if (!user) { throw new Error(`Unable to find user '${userRef}'`); }

    const actor = game.actors.get(user.character?.id ?? "");
    if (BladesPC.IsType(actor)) {
      return actor;
    }

    return undefined;
  }

  static override async create(
    data: ActorDataConstructorData & {
      system?: Partial<BladesActorSchema.Scoundrel>
    },
    options = {}
  ) {
    data.token = data.token || {};
    data.system = data.system ?? {};

    eLog.checkLog2("actor", "BladesPC.create(data,options)", {data, options});

    // ~ Set the Token to sync with charsheet.
    data.token.actorLink = true;

    // ~ Initialize generic experience clues.
    data.system.experience = {
      playbook: {value: 0, max: 8},
      insight:  {value: 0, max: 6},
      prowess:  {value: 0, max: 6},
      resolve:  {value: 0, max: 6},
      clues:    [],
      ...data.system.experience ?? {}
    };

    const pc = (await super.create(data, options)) as BladesPC;
    await BladesClockKey.Create({
      name:          "",
      target:        pc,
      targetKey:     "system.clocksData" as TargetKey,
      isVisible:     true,
      isNameVisible: false,
      isSpotlit:     false
    }, undefined, [
      {
        color:         ClockColor.white,
        value:         0,
        max:           4,
        index:         0,
        isVisible:     true,
        isActive:      true,
        isNameVisible: false,
        isHighlighted: false
      }
    ]);
    return pc as unknown as Promise<StoredDocument<Actor> | undefined>;
  }

  static override get All(): Collection<BladesPC> {
    return new Collection<BladesPC>(
      (super.GetTypeWithTags(BladesActorType.pc) as BladesPC[])
        .map((pc) => [pc.id, pc])
    );
  }
  // #endregion

  // #region BladesPrimaryActor Implementation ~
  get primaryUser(): User | null {
    return game.users?.find((user) => user.character?.id === this?.id) || null;
  }

  async clearLoadout() {
    await this.update({"system.loadout.selected": ""});
    this.updateEmbeddedDocuments(
      "Item",
      [
        ...this.activeSubItems
          .filter((item) => BladesItem.IsType(item, BladesItemType.gear)
            && !item.hasTag(Tag.System.Archived))
          .map((item) => ({
            "_id":                           item.id,
            "system.tags":                 [...item.tags, Tag.System.Archived],
            "system.uses_per_score.value": 0
          })),
        ...this.activeSubItems
          .filter((item) => BladesItem.IsType(item, BladesItemType.ability)
            && item.system.uses_per_score.max)
          .map((item) => ({
            "_id":                           item.id,
            "system.uses_per_score.value": 0
          }))
      ]
    );
  }
  // #endregion

  override getSubActor(actorRef: ActorRef): BladesActor | undefined {
    const actor = super.getSubActor(actorRef);
    if (!actor) { return undefined; }
    if (this.primaryUser?.id) {
      actor.ownership[this.primaryUser.id] = CONST.DOCUMENT_PERMISSION_LEVELS.OWNER;
    }
    return actor;
  }

  get isLightArmorEquipped() { return this.system.armor.active.light; }

  get isLightArmorEquippable() { return !this.isLightArmorEquipped && this.remainingLoad >= 2; }

  get isLightArmorUsed() { return this.system.armor.checked.light; }

  get isLightArmorAvailable() {
    return (this.isLightArmorEquipped || this.isLightArmorEquippable)
      && !this.isLightArmorUsed;
  }

  get isHeavyArmorEquipped() { return this.system.armor.active.heavy; }

  get isHeavyArmorEquippable() {
    if (this.isHeavyArmorEquipped) { return false; }
    if (this.isLightArmorEquipped) { return this.remainingLoad >= 3; }
    return this.remainingLoad >= 5;
  }

  get isHeavyArmorUsed() { return this.system.armor.checked.heavy; }

  get isHeavyArmorAvailable() {
    return (this.isHeavyArmorEquipped || this.isHeavyArmorEquippable)
      && !this.isHeavyArmorUsed;
  }

  get availableArmor(): Array<"Light Armor"|"Heavy Armor"> {
    const armor: Array<"Light Armor"|"Heavy Armor"> = [];
    if (this.isLightArmorAvailable) {
      armor.push("Light Armor");
    }
    if (this.isHeavyArmorAvailable) {
      armor.push("Heavy Armor");
    }
    return armor;
  }

  get isSpecialArmorAvailable() {
    return this.system.armor.active.special && !this.system.armor.checked.special;
  }

  // #region BladesScoundrel Implementation ~

  isMember(crew: BladesCrew) { return this.crew?.id === crew.id; }

  get vice(): BladesItem | undefined {
    if (this.type !== BladesActorType.pc) { return undefined; }
    return this.activeSubItems.find((item) => item.type === BladesItemType.vice);
  }

  get crew(): BladesCrew | undefined {
    return this.activeSubActors
      .find((subActor): subActor is BladesCrew => BladesActor.IsType(subActor, BladesActorType.crew));
  }

  get abilities(): BladesItem[] {
    if (!this.playbook) { return []; }
    return this.activeSubItems
      .filter((item) => [BladesItemType.ability, BladesItemType.crew_ability].includes(item.type));
  }

  get cohorts(): Array<BladesItemOfType<BladesItemType.cohort_gang|BladesItemType.cohort_expert>> {
    return this.activeSubItems
      .filter((item) =>
        BladesItem.IsType(item, BladesItemType.cohort_gang, BladesItemType.cohort_expert)
      ) as Array<BladesItemOfType<BladesItemType.cohort_gang|BladesItemType.cohort_expert>>;
  }

  get playbookName() {
    return this.playbook?.name as (BladesTag & Playbook) | undefined;
  }

  get playbook(): BladesItemOfType<BladesItemType.playbook>|undefined {
    return this.activeSubItems
      .find((item): item is BladesItemOfType<BladesItemType.playbook> => item.type === BladesItemType.playbook);
  }

  get attributes(): Record<AttributeTrait, number> {
    if (!BladesActor.IsType(this, BladesActorType.pc)) { return undefined as never; }
    return {
      insight: Object.values(this.system.attributes.insight)
        .filter(({value}) => value > 0).length
          + this.system.resistance_bonus.insight,
      prowess: Object.values(this.system.attributes.prowess)
        .filter(({value}) => value > 0).length
          + this.system.resistance_bonus.prowess,
      resolve: Object.values(this.system.attributes.resolve)
        .filter(({value}) => value > 0).length
          + this.system.resistance_bonus.resolve
    };
  }

  get actions(): Record<ActionTrait, number> {
    if (!BladesActor.IsType(this, BladesActorType.pc)) { return undefined as never; }
    return U.objMap<Record<ActionTrait, number>>(
      {
        ...this.system.attributes.insight,
        ...this.system.attributes.prowess,
        ...this.system.attributes.resolve
      },
      (({value, max}: ValueMax) => U.gsap.utils.clamp(0, max, value)) as mapFunc<valFunc>
    ) as Record<ActionTrait, number>;
  }

  get rollable(): Record<AttributeTrait | ActionTrait, number> {
    if (!BladesActor.IsType(this, BladesActorType.pc)) { return undefined as never; }
    return {
      ...this.attributes,
      ...this.actions
    };
  }

  get stress(): number {
    return this.system.stress.value;
  }

  get stressMax(): number {
    return this.system.stress.max;
  }

  private get isHealingClockReady(): boolean {
    const [clockKeyID] = Object.keys(this.system.clocksData);
    return game.eunoblades.ClockKeys.has(clockKeyID ?? "");
  }

  get healingClock(): BladesClockKey|undefined {
    if (!this.isHealingClockReady) { return undefined; }
    const [clockKeyID] = Object.keys(this.system.clocksData);
    return game.eunoblades.ClockKeys.get(clockKeyID ?? "");
  }

  get harmLevel(): number {
    if (this.system.harm.severe.one.length > 1) { return 3; }
    if ((this.system.harm.moderate.one.length + this.system.harm.moderate.two.length) > 0) { return 2; }
    if ((this.system.harm.lesser.one.length + this.system.harm.lesser.two.length) > 0) { return 1; }
    return 0;
  }

  get trauma(): number {
    if (!BladesActor.IsType(this, BladesActorType.pc)) { return 0; }
    return Object.keys(this.system.trauma.checked)
      .filter((traumaName) =>
        // @ts-ignore Compiler linter mismatch.
        this.system.trauma.active[traumaName] && this.system.trauma.checked[traumaName])
      .length;
  }

  get traumaList(): string[] {
    // @ts-ignore Compiler linter mismatch.
    return BladesActor.IsType(this, BladesActorType.pc)
      ? Object.keys(this.system.trauma.active).filter((key) => this.system.trauma.active[key])
      : [];
  }

  get activeTraumaConditions(): Record<string, boolean> {
    if (!BladesActor.IsType(this, BladesActorType.pc)) { return {}; }
    return U.objFilter(
      this.system.trauma.checked,
      // @ts-ignore Compiler linter mismatch.
      (_v: unknown, traumaName: string): boolean => Boolean(
        traumaName in this.system.trauma.active
        && this.system.trauma.active[traumaName]
      )
    );
  }

  get currentLoad(): number {
    if (!BladesActor.IsType(this, BladesActorType.pc)) { return 0; }
    const activeLoadItems = this.activeSubItems.filter((item) => item.type === BladesItemType.gear);
    return U.gsap.utils.clamp(0, 10, activeLoadItems.reduce((tot, i) => tot + U.pInt(i.system.load), 0));
  }

  get remainingLoad(): number {
    if (!BladesActor.IsType(this, BladesActorType.pc)) { return 0; }
    if (!this.system.loadout.selected) { return 0; }
    const maxLoad = this.system.loadout.levels[
      game.i18n.localize(this.system.loadout.selected.toString())
        .toLowerCase() as KeyOf<typeof this.system.loadout.levels>
    ];
    return Math.max(0, maxLoad - this.currentLoad);
  }

  async addStash(amount: number): Promise<void> {
    if (!BladesActor.IsType(this, BladesActorType.pc)) { return; }
    await this.update({"system.stash.value": Math.min(this.system.stash.value + amount, this.system.stash.max)});
  }

  get projects(): BladesProject[] {
    return this.getSubItemsOfType(BladesItemType.project) as BladesProject[];
  }

  get remainingDowntimeActions(): number {
    if (!BladesActor.IsType(this, BladesActorType.pc)) { return 0; }
    return this.system.downtime_actions.max + this.system.downtime_action_bonus - this.system.downtime_actions.value;

  }

  protected _processAbilityDialogItems(dialogData: Record<string, BladesItem[]>): void {
    if (!this.playbookName) { return; }

    dialogData[this.playbookName] = this._processEmbeddedItemMatches(
      BladesItem.GetTypeWithTags(BladesItemType.ability, this.playbookName)
    );
    dialogData.Veteran = this._processEmbeddedItemMatches(BladesItem.GetTypeWithTags(BladesItemType.ability))
      .filter((item) => !item.hasTag(this.playbookName))
    // Remove featured class from Veteran items
      .map((item) => {
        if (item.dialogCSSClasses) {
          item.dialogCSSClasses = item.dialogCSSClasses.replace(/featured-item\s?/g, "");
        }
        return item;
      })
    // Re-sort by world_name
      .sort((a, b) => {
        if (a.system.world_name > b.system.world_name) { return 1; }
        if (a.system.world_name < b.system.world_name) { return -1; }
        return 0;
      });
  }

  private processGearDialogItems(dialogData: Record<string, BladesItem[]>): void {
    if (this.playbookName === null) { return; }
    const gearItems = this._processEmbeddedItemMatches([
      ...BladesItem.GetTypeWithTags(BladesItemType.gear, this.playbookName),
      ...BladesItem.GetTypeWithTags(BladesItemType.gear, Tag.Gear.General)
    ])
      .filter((item) => this.remainingLoad >= item.system.load);

    // Two tabs, one for playbook and the other for general items
    dialogData[this.playbookName] = gearItems.filter((item) => item.hasTag(this.playbookName));
    dialogData.General = gearItems
      .filter((item) => item.hasTag(Tag.Gear.General))
    // Remove featured class from General items
      .map((item) => {
        if (item.dialogCSSClasses) {
          item.dialogCSSClasses = item.dialogCSSClasses.replace(/featured-item\s?/g, "");
        }
        return item;
      })
    // Re-sort by world_name
      .sort((a, b) => {
        if (a.system.world_name > b.system.world_name) { return 1; }
        if (a.system.world_name < b.system.world_name) { return -1; }
        return 0;
      });
  }

  getDialogItems(category: SelectionCategory): Record<string, BladesItem[]> {
    const dialogData: Record<string, BladesItem[]> = {};
    const {playbookName} = this;

    if (category === SelectionCategory.Heritage) {
      dialogData.Main = this._processEmbeddedItemMatches(BladesItem.GetTypeWithTags(BladesItemType.heritage));
    } else if (category === SelectionCategory.Background) {
      dialogData.Main = this._processEmbeddedItemMatches(BladesItem.GetTypeWithTags(BladesItemType.background));
    } else if (category === SelectionCategory.Vice && playbookName !== null) {
      dialogData.Main = this._processEmbeddedItemMatches(BladesItem.GetTypeWithTags(BladesItemType.vice, playbookName));
    } else if (category === SelectionCategory.Playbook) {
      dialogData.Basic = this._processEmbeddedItemMatches(
        BladesItem.GetTypeWithTags(BladesItemType.playbook)
          .filter((item) => !item.hasTag(Tag.Gear.Advanced))
      );
      dialogData.Advanced = this._processEmbeddedItemMatches(
        BladesItem.GetTypeWithTags(BladesItemType.playbook, Tag.Gear.Advanced)
      );
    } else if (category === SelectionCategory.Gear) {
      this.processGearDialogItems(dialogData);
    } else if (category === SelectionCategory.Ability) {
      this._processAbilityDialogItems(dialogData);
    }

    return dialogData;
  }

  getTaggedItemBonuses(tags: BladesTag[]): number {
    // Given a list of item tags, will return the total bonuses to that item
    // Won't return a number, but an object literal that includes things like extra load space or concealability
    // Check ACTIVE EFFECTS supplied by ability against submitted tags?
    // Should INCLUDE bonuses from crew.
    return tags.length; // Placeholder to avoid linter error
  }
  // #endregion

  // #region BladesRoll.PrimaryDoc Implementation
  override get rollPrimaryModsSchemaSet(): BladesRollMod.Schema[] {

    const rollModsSchemaSet = super.rollPrimaryModsSchemaSet;

    // Add roll mods from harm
    [
      [/1d/, RollModSection.roll] as const,
      [/Less Effect/, RollModSection.effect] as const
    ].forEach(([effectPat, effectCat]) => {
      const {one: harmConditionOne, two: harmConditionTwo} = Object.values(this.system.harm)
        .find((harmData) => effectPat.test(harmData.effect)) ?? {};
      const harmString = U.objCompact([harmConditionOne, harmConditionTwo === "" ? null : harmConditionTwo]).join(" & ");
      if (harmString.length > 0) {
        rollModsSchemaSet.push({
          key:         `Harm-negative-${effectCat}`,
          name:        harmString,
          section:     effectCat,
          posNeg:      "negative",
          base_status: RollModStatus.ToggledOn,
          modType:     RollModType.harm,
          value:       1,
          tooltip:     [
            `<h1 class='sur-title'>${effectCat === RollModSection.roll ? Harm.Impaired : Harm.Weakened} (Harm)</h1>`,
            `<h1 class='red-bright'>${harmString}</h1>`,
            effectCat === RollModSection.roll
              ? "<p>If your injuries apply to the situation at hand, you suffer <strong class='red-bright'>−1d</strong> to your roll.</p>"
              : "<p>If your injuries apply to the situation at hand, you suffer <strong class='red-bright'>−1 effect</strong>."
          ].join("")
        });
      }
    });
    const {one: harmCondition} = Object.values(this.system.harm)
      .find((harmData) => /Need Help/.test(harmData.effect)) ?? {};
    if (harmCondition && harmCondition.trim() !== "") {
      rollModsSchemaSet.push({
        key:         "Push-negative-roll",
        name:        "PUSH",
        sideString:  harmCondition.trim(),
        section:     RollModSection.roll,
        posNeg:      "negative",
        base_status: RollModStatus.ToggledOn,
        modType:     RollModType.harm,
        value:       0,
        effectKeys:  ["Cost-Stress2"],
        tooltip:     [
          "<h1 class='sur-title'>Broken (Harm)</h1>",
          `<h1 class='red-bright'>${harmCondition.trim()}</h1>`,
          "<p>If your injuries apply to the situation at hand, you must <strong>Push</strong> to act.</p>"
        ].join("")
      });
    }

    return rollModsSchemaSet;
  }


  async applyHarm(num: harmLevel, name: string) {
    if (num === 4) {
      BladesDirector.getInstance().pushNotice_SocketCall(
        "ALL",
        {
          title:      `${this.name} Suffers <u><strong>FATAL</strong></u> Harm: ${name}`,
          body:       `${this.name}, will you continue as a Ghost, or create a new character?`,
          type:       BladesNoticeType.push,
          cssClasses: "harm-alert fatal-harm-alert"
        }
      );
      return;
    }

    // Construct sequence of harm keys to check, starting with given harm level.
    const harmSequence = ([
      [["lesser", "one"], ["lesser", "two"]],
      [["moderate", "one"], ["moderate", "two"]],
      [["severe", "one"]]
    ] as const).slice(num - 1).flat(1);

    while (harmSequence.length) {
      const theseHarmKeys = harmSequence.shift();
      if (!theseHarmKeys) { break; }
      const [thisHarmLevel, thisHarmKey] = theseHarmKeys;
      const thisHarmVal = this.system.harm[thisHarmLevel][thisHarmKey];
      if (!thisHarmVal) {
        BladesDirector.getInstance().pushNotice_SocketCall(
          "ALL",
          {
            title:      `${this.name} Suffers ${U.tCase(thisHarmLevel)} Harm: ${name}`,
            type:       BladesNoticeType.push,
            cssClasses: "harm-alert"
          });
        await this.update({[`system.harm.${thisHarmLevel}.${thisHarmKey}`]: name});
        return;
      }
    }

    BladesDirector.getInstance().pushNotice_SocketCall(
      "ALL",
      {
        title:      `${this.name} Suffers a Catastrophic, Permanent Injury!`,
        body:       `${this.name}, you're out of the action - either left for dead, or otherwise dropped from the action. You can choose to return at the beginning of the next Phase with a permanent injury, or die.`,
        type:       BladesNoticeType.push,
        cssClasses: "harm-alert fatal-harm-alert"
      }
    );
  }

  async applyWorsePosition() {
    this.setFlag("eunos-blades", "isWorsePosition", true);
  }

  // #endregion

  // #region BladesRoll.ParticipantDoc Implementation

  get rollParticipantID() { return this.id; }

  get rollParticipantDoc() { return this; }

  get rollParticipantIcon() { return this.playbook?.img ?? this.img; }

  get rollParticipantName() { return this.name ?? ""; }

  get rollParticipantType() { return this.type; }

  get rollParticipantModsSchemaSet(): BladesRollMod.Schema[] { return []; }

  // #endregion

  async adjustStress(deltaStress: number) {
    const newStress = Math.min(this.stressMax, Math.max(0, this.stress + deltaStress));

    if (newStress === this.stressMax) {
      BladesDirector.getInstance().pushNotice_SocketCall("ALL", {
        title:      `${this.name} breaks under the stress!`,
        body:       `${this.name}: Select a Trauma Condition on your sheet. You are taken out of action and will no longer participate in this score. Narrate what happens.`,
        type:       BladesNoticeType.push,
        cssClasses: "stress-alert"
      });
      await this.update({"system.stress.value": 0});
      return;
    }

    await this.update({"system.stress.value": newStress});
  }

  async indulgeStress(deltaStress: number) {
    if (deltaStress > this.stress) {
      BladesDirector.getInstance().pushNotice_SocketCall("ALL", {
        title:      `${this.name} Overindulges!`,
        body:       `${this.name}: Select an option from the list below, and narrate how overindulging your vice led to this result: <ul><li><strong>Attract Trouble:</strong> Roll for an <strong>Entanglement</strong>.</li><li><strong>Brag About Your Exploits:</strong> +2 Heat</li><li><strong>Go AWOL</strong> Vanish for a few weeks. <em>(You will play a different character until the next Downtime Phase, at which point you will return with all Harm healed.)</em></li><li><strong>Tapped:</strong> Your current Vice Purveyor cuts you off. <em>(Until you find a new source for your vice, you will be unable to Indulge Vice during Downtime.)</em></li></ul>`,
        type:       BladesNoticeType.push,
        cssClasses: "stress-alert"
      });
    }
    await this.update({"system.stress.value": this.stress - deltaStress});
  }

  async spendArmor(amount: number) {
    const updateData: Record<string, unknown> = {};
    while (amount > 0) {
      if (this.isLightArmorAvailable) {
        if (!this.isLightArmorEquipped) {
          updateData["system.armor.active.light"] = true;
        }
        updateData["system.armor.checked.light"] = true;
      } else if (this.isHeavyArmorAvailable) {
        if (!this.isHeavyArmorEquipped) {
          updateData["system.armor.active.heavy"] = true;
        }
        updateData["system.armor.checked.heavy"] = true;
      } else {
        throw new Error("No armor available to spend");
      }
      amount--;
    }
    this.update(updateData);
  }

  async spendSpecialArmor() {
    if (this.system.armor.active.special && !this.system.armor.checked.special) {
      await this.update({"system.armor.checked.special": true});
    }
  }

  get rollTraitPCTooltipActions(): string {
    const tooltipStrings: string[] = ["<table><tbody>"];
    const actionRatings = this.actions;
    Object.values(AttributeTrait).forEach((attribute) => {
      C.Action[attribute].forEach((action) => {
        tooltipStrings.push([
          "<tr>",
          `<td><strong>${U.uCase(action)}</strong></td>`,
          `<td>${"⚪".repeat(actionRatings[action])}</td>`,
          `<td><em style="font-family: 'Minion Pro Cond'; font-size: 10px;">(${C.ShortActionTooltips[action]})</em></td>`,
          "</tr>"
        ].join(""));
      });
    });
    tooltipStrings.push("</tbody></table>");
    return tooltipStrings.join("");
  }

  get rollTraitPCTooltipAttributes(): string {
    const tooltipStrings: string[] = ["<table><tbody>"];
    const attributeRatings = this.attributes;
    Object.values(AttributeTrait).forEach((attribute) => {
      tooltipStrings.push([
        "<tr>",
        `<td><strong>${U.uCase(attribute)}</strong></td>`,
        `<td>${"⚪".repeat(attributeRatings[attribute])}</td>`,
        `<td><em>(${C.ShortAttributeTooltips[attribute]})</em></td>`,
        "</tr>"
      ].join(""));
    });
    tooltipStrings.push("</tbody></table>");
    return tooltipStrings.join("");
  }
  // #endregion

  override render(force = false) {
    // if (!this.isHealingClockReady) {
    //   setTimeout(() => this.render(force), 1000);
    //   return;
    // }
    super.render(force);
  }
}

declare interface BladesPC {
  type: BladesActorType.pc,
  system: BladesActorSchema.Scoundrel
}

export default BladesPC;
