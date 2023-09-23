import BladesItem from "../../blades-item.js";
import C, {Playbook, Attribute, Action, Harm, BladesActorType, BladesItemType, Tag, RollModCategory, Factor, RollModStatus} from "../../core/constants.js";
import U from "../../core/utilities.js";
import BladesActor from "../../blades-actor.js";
import BladesCrew from "./blades-crew.js";
import BladesRollCollab from "../../blades-roll-collab.js";
import type {ActorDataConstructorData} from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/actorData.js";


class BladesPC extends BladesActor implements BladesActorSubClass.Scoundrel,
                                              BladesRollCollab.PrimaryDocData,
                                              BladesRollCollab.ParticipantDocData {

  // #region Static Overrides: Create ~
  static override async create(data: ActorDataConstructorData & { system?: Partial<BladesActorSchema.Scoundrel> }, options = {}) {
    data.token = data.token || {};
    data.system = data.system ?? {};

    eLog.checkLog2("actor", "BladesPC.create(data,options)", {data, options});

    //~ Set the Token to sync with charsheet.
    data.token.actorLink = true;

    //~ Initialize generic experience clues.
    data.system.experience = {
      playbook: {value: 0, max: 8},
      insight: {value: 0, max: 6},
      prowess: {value: 0, max: 6},
      resolve: {value: 0, max: 6},
      clues: [],
      ...data.system.experience ?? {}
    };
    return super.create(data, options);
  }
  // #endregion

  // #region BladesPrimaryActor Implementation ~
  get primaryUser(): User | null {
    return game.users?.find((user) => user.character?.id === this?.id) || null;
  }
  async clearLoadout() {
    this.update({"system.loadout.selected": ""});
    this.updateEmbeddedDocuments(
      "Item",
      [
        ...this.activeSubItems.filter((item) => BladesItem.IsType(item, BladesItemType.gear) && !item.hasTag(Tag.System.Archived))
          .map((item) => ({
            "_id": item.id,
            "system.tags": [... item.tags, Tag.System.Archived],
            "system.uses_per_score.value": 0
          })),
        ...this.activeSubItems.filter((item) => BladesItem.IsType(item, BladesItemType.ability) && item.system.uses_per_score.max)
          .map((item) => ({
            "_id": item.id,
            "system.uses_per_score.value": 0
          }))
      ]
    );
  }
  // #endregion

  override getSubActor(actorRef: ActorRef): BladesActor | undefined {
    const actor = super.getSubActor(actorRef);
    if (!actor) { return undefined }
    if (this.primaryUser?.id) {
      actor.ownership[this.primaryUser.id] = CONST.DOCUMENT_PERMISSION_LEVELS.OWNER;
    }
    return actor;
  }

  get armorStatus() {
    const armorData: Partial<ValueMax & {special?: boolean}> = {};
    if (this.system.armor.active.special) {
      armorData.special = this.system.armor.checked.special;
    }
    if (this.system.armor.active.heavy) {
      armorData.max = 2;
      if (this.system.armor.checked.light) {
        armorData.value = 0;
      } else if (this.system.armor.checked.heavy) {
        armorData.value = 1;
      } else {
        armorData.value = 2;
      }
    } else if (this.system.armor.active.light) {
      armorData.max = 1;
      if (this.system.armor.checked.light) {
        armorData.value = 0;
      } else {
        armorData.value = 1;
      }
    } else {
      armorData.max = 0;
      armorData.value = 0;
    }
    return armorData as ValueMax & {special?: boolean};
  }

  // #region BladesScoundrel Implementation ~

  isMember(crew: BladesCrew) { return this.crew?.id === crew.id }

  get vice(): BladesItem | undefined {
    if (this.type !== BladesActorType.pc) { return undefined }
    return this.activeSubItems.find((item) => item.type === BladesItemType.vice);
  }

  get crew(): BladesCrew | undefined {
    return this.activeSubActors.find((subActor): subActor is BladesCrew => BladesActor.IsType(subActor, BladesActorType.crew));
  }

  get abilities(): BladesItem[] {
    if (!this.playbook) { return [] }
    return this.activeSubItems.filter((item) => [BladesItemType.ability, BladesItemType.crew_ability].includes(item.type));
  }

  get playbookName() {
    return this.playbook?.name as (BladesTag & Playbook) | undefined;
  }
  get playbook(): BladesItemOfType<BladesItemType.playbook>|undefined {
    return this.activeSubItems.find((item): item is BladesItemOfType<BladesItemType.playbook> => item.type === BladesItemType.playbook);
  }

  get attributes(): Record<Attribute, number> {
    if (!BladesActor.IsType(this, BladesActorType.pc)) { return undefined as never }
    return {
      insight: Object.values(this.system.attributes.insight).filter(({value}) => value > 0).length + this.system.resistance_bonus.insight,
      prowess: Object.values(this.system.attributes.prowess).filter(({value}) => value > 0).length + this.system.resistance_bonus.prowess,
      resolve: Object.values(this.system.attributes.resolve).filter(({value}) => value > 0).length + this.system.resistance_bonus.resolve
    };
  }
  get actions(): Record<Action, number> {
    if (!BladesActor.IsType(this, BladesActorType.pc)) { return undefined as never }
    return U.objMap({
      ...this.system.attributes.insight,
      ...this.system.attributes.prowess,
      ...this.system.attributes.resolve
    }, ({value, max}: ValueMax) => U.gsap.utils.clamp(0, max, value)) as Record<Action, number>;
  }
  get rollable(): Record<Attribute | Action, number> {
    if (!BladesActor.IsType(this, BladesActorType.pc)) { return undefined as never }
    return {
      ...this.attributes,
      ...this.actions
    };
  }
  get trauma(): number {
    if (!BladesActor.IsType(this, BladesActorType.pc)) { return 0 }
    return Object.keys(this.system.trauma.checked)
      .filter((traumaName) => {
        // @ts-ignore Compiler linter mismatch.
        return this.system.trauma.active[traumaName] && this.system.trauma.checked[traumaName];
      })
      .length;
  }
  get traumaList(): string[] {
    // @ts-ignore Compiler linter mismatch.
    return BladesActor.IsType(this, BladesActorType.pc) ? Object.keys(this.system.trauma.active).filter((key) => this.system.trauma.active[key]) : [];
  }
  get activeTraumaConditions(): Record<string, boolean> {
    if (!BladesActor.IsType(this, BladesActorType.pc)) { return {} }
    return U.objFilter(
      this.system.trauma.checked,
      // @ts-ignore Compiler linter mismatch.
      (v: unknown, traumaName: string): boolean => Boolean(traumaName in this.system.trauma.active && this.system.trauma.active[traumaName])
    ) as Record<string, boolean>;
  }
  get currentLoad(): number {
    if (!BladesActor.IsType(this, BladesActorType.pc)) { return 0 }
    const activeLoadItems = this.activeSubItems.filter((item) => item.type === BladesItemType.gear);
    return U.gsap.utils.clamp(0, 10, activeLoadItems.reduce((tot, i) => tot + U.pInt(i.system.load), 0));
  }
  get remainingLoad(): number {
    if (!BladesActor.IsType(this, BladesActorType.pc)) { return 0 }
    if (!this.system.loadout.selected) { return 0 }
    const maxLoad = this.system.loadout.levels[game.i18n.localize(this.system.loadout.selected.toString()).toLowerCase() as KeyOf<typeof this.system.loadout.levels>];
    return Math.max(0, maxLoad - this.currentLoad);
  }

  async addStash(amount: number): Promise<void> {
    if (!BladesActor.IsType(this, BladesActorType.pc)) { return undefined }
    return this.update({"system.stash.value": Math.min(this.system.stash.value + amount, this.system.stash.max)});
  }
  // #endregion

  // #region BladesRollCollab Implementation

  get rollFactors(): Partial<Record<Factor,BladesRollCollab.FactorData>> {
    const factorData: Partial<Record<Factor,BladesRollCollab.FactorData>> = {
      [Factor.tier]: {
        name: Factor.tier,
        value: this.getFactorTotal(Factor.tier),
        max: this.getFactorTotal(Factor.tier),
        baseVal: this.getFactorTotal(Factor.tier),
        isActive: true,
        isPrimary: true,
        isDominant: false,
        highFavorsPC: true
      },
      [Factor.quality]: {
        name: Factor.quality,
        value: this.getFactorTotal(Factor.quality),
        max: this.getFactorTotal(Factor.quality),
        baseVal: this.getFactorTotal(Factor.quality),
        isActive: false,
        isPrimary: false,
        isDominant: false,
        highFavorsPC: true
      }
    };

    return factorData;
  }

  // #region BladesRollCollab.PrimaryDoc Implementation

  get rollPrimaryID() { return this.id }
  get rollPrimaryDoc() { return this }
  get rollPrimaryName() { return this.name! }
  get rollPrimaryType() { return this.type }
  get rollPrimaryImg() { return this.img! }

  get rollModsData(): BladesRollCollab.RollModData[] {
    const {roll_mods} = this.system;
    if (roll_mods.length === 0) { return [] }

    const rollModsData = roll_mods
      .filter((elem): elem is string => elem !== undefined)
      .map((modString) => {
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
          if (/^c.{0,10}r?.{0,3}ty/i.test(keyString)) {key = "conditionalRollTypes"} else
          if (/^a.{0,3}r?.{0,3}y/i.test(keyString)) {key = "autoRollTypes"} else
          if (/^c.{0,10}r?.{0,3}tr/i.test(keyString)) {key = "conditionalRollTraits"} else
          if (/^a.{0,3}r?.{0,3}tr/i.test(keyString)) {key = "autoRollTraits"} else {
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

    // Add roll mods from harm
    [[/1d/, RollModCategory.roll] as const, [/Less Effect/, RollModCategory.effect] as const].forEach(([effectPat, effectCat]) => {
      const {one: harmConditionOne, two: harmConditionTwo} = Object.values(this.system.harm)
        .find((harmData) => effectPat.test(harmData.effect)) ?? {};
      const harmString = U.objCompact([harmConditionOne, harmConditionTwo === "" ? null : harmConditionTwo]).join(" & ");
      if (harmString.length > 0) {
        rollModsData.push({
          id: `Harm-negative-${effectCat}`,
          name: harmString,
          category: effectCat,
          posNeg: "negative",
          base_status: RollModStatus.ToggledOn,
          modType: "harm",
          value: 1,
          tooltip: [
            `<h1 class='sur-title'>${effectCat === RollModCategory.roll ? Harm.Impaired : Harm.Weakened} (Harm)</h1>`,
            `<h1 class='red-bright'>${harmString}</h1>`,
            effectCat === RollModCategory.roll
              ? "<p>If your injuries apply to the situation at hand, you suffer <strong class='red-bright'>−1d</strong> to your roll.</p>"
              : "<p>If your injuries apply to the situation at hand, you suffer <strong class='red-bright'>−1 effect</strong>."
          ].join("")
        });
      }
    });
    const {one: harmCondition} = Object.values(this.system.harm!).find((harmData) => /Need Help/.test(harmData.effect)) ?? {};
    if (harmCondition && harmCondition.trim() !== "") {
      rollModsData.push({
        id: "Push-negative-roll",
        name: "PUSH",
        sideString: harmCondition.trim(),
        category: RollModCategory.roll,
        posNeg: "negative",
        base_status: RollModStatus.ToggledOn,
        modType: "harm",
        value: 0,
        effectKeys: ["Cost-Stress2"],
        tooltip: [
          "<h1 class='sur-title'>Broken (Harm)</h1>",
          `<h1 class='red-bright'>${harmCondition.trim()}</h1>`,
          "<p>If your injuries apply to the situation at hand, you must <strong>Push</strong> to act.</p>"
        ].join("")
      });
    }

    return rollModsData;
  }

  // #endregion

  // #region BladesRollCollab.ParticipantDoc Implementation

  get rollParticipantID() { return this.id }
  get rollParticipantDoc() { return this }
  get rollParticipantIcon() { return this.playbook?.img ?? this.img! }
  get rollParticipantName() { return this.name ?? "" }
  get rollParticipantType() { return this.type }
  get rollParticipantModsData(): BladesRollCollab.RollModData[] { return [] }

  // #endregion

  get rollTraitPCTooltipActions(): string {
    const tooltipStrings: string[] = ["<table><tbody>"];
    const actionRatings = this.actions;
    Object.values(Attribute).forEach((attribute) => {
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
    Object.values(Attribute).forEach((attribute) => {
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
}

declare interface BladesPC {
  type: BladesActorType.pc,
  system: BladesActorSchema.Scoundrel
}

export default BladesPC;