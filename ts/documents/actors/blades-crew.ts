import BladesItem from "../../blades-item.js";
import {BladesActorType, Playbook, BladesItemType, RollModCategory, Factor, RollModStatus} from "../../core/constants.js";
import U from "../../core/utilities.js";
import BladesActor from "../../blades-actor.js";
import BladesRollCollab from "../../blades-roll-collab.js";
import type {ActorDataConstructorData} from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/actorData.js";

class BladesCrew extends BladesActor implements BladesActorSubClass.Crew,
  BladesRollCollab.PrimaryDocData,
  BladesRollCollab.ParticipantDocData {

  // #region Static Overrides: Create ~
  static override async create(data: ActorDataConstructorData & {system?: Partial<BladesActorSchema.Crew>}, options = {}) {
    data.token = data.token || {};
    data.system = data.system ?? {};

    eLog.checkLog2("actor", "BladesActor.create(data,options)", {data, options});

    //~ For Crew and PC set the Token to sync with charsheet.
    data.token.actorLink = true;

    //~ Create world_name
    data.system.world_name = data.system.world_name ?? data.name.replace(/[^A-Za-z_0-9 ]/g, "").trim().replace(/ /g, "_");

    //~ Initialize generic experience clues.
    data.system.experience = {
      playbook: {value: 0, max: 8},
      clues: [],
      ...data.system.experience ?? {}
    } as BladesActorSchema.Crew["experience"];


    return super.create(data, options);
  }
  // #endregion


  // #region BladesRollCollab Implementation

  get rollModsData(): BladesRollCollab.RollModData[] {
    const {roll_mods} = this.system;
    if (roll_mods.length === 0) {return []}

    const rollModsData = roll_mods
      .filter((elem): elem is string => elem !== undefined)
      .map((modString) => {
        const pStrings = modString.split(/@/);
        const nameString = U.pullElement(pStrings, (v) => typeof v === "string" && /^na/i.test(v));
        const nameVal = (typeof nameString === "string" && nameString.replace(/^.*:/, "")) as string | false;
        if (!nameVal) {throw new Error(`RollMod Missing Name: '${modString}'`)}
        const catString = U.pullElement(pStrings, (v) => typeof v === "string" && /^cat/i.test(v));
        const catVal = (typeof catString === "string" && catString.replace(/^.*:/, "")) as RollModCategory | false;
        if (!catVal || !(catVal in RollModCategory)) {throw new Error(`RollMod Missing Category: '${modString}'`)}
        const posNegString = (U.pullElement(pStrings, (v) => typeof v === "string" && /^p/i.test(v)) || "posNeg:positive");
        const posNegVal = posNegString.replace(/^.*:/, "") as "positive" | "negative";

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
          let val: string | string[] = /\|/.test(valString) ? valString.split(/\|/) : valString;
          let key: KeyOf<BladesRollCollab.RollModData>;
          if (/^stat/i.test(keyString)) {key = "base_status"} else
          if (/^val/i.test(keyString)) {key = "value"} else
          if (/^eff|^ekey/i.test(keyString)) {key = "effectKeys"} else
          if (/^side|^ss/i.test(keyString)) {key = "sideString"} else
          if (/^s.*ame/i.test(keyString)) {key = "source_name"} else
          if (/^tool|^tip/i.test(keyString)) {key = "tooltip"} else
          if (/^ty/i.test(keyString)) {key = "modType"} else
          if (/^c.{0,10}r?.{0,3}ty/i.test(keyString)) {key = "conditionalRollTypes"} else
          if (/^a.{0,3}r?.{0,3}y/i.test(keyString)) {key = "autoRollTypes"} else
          if (/^c.{0,10}r?.{0,3}tr/i.test(keyString)) {key = "conditionalRollTraits"} else
          if (/^a.{0,3}r?.{0,3}tr/i.test(keyString)) {key = "autoRollTraits"} else {
            throw new Error(`Bad Roll Mod Key: ${keyString}`);
          }

          if (key === "base_status" && val === "Conditional") {
            val = RollModStatus.Hidden;
          }
          let processedVal: any;
          if (["effectKeys", "conditionalRollTypes", "autoRollTypes,", "conditionalRollTraits", "autoRollTraits"].includes(key)) {
            processedVal = [val].flat();
          } else {
            processedVal = (val as string).replace(/%COLON%/g, ":");
          }

          const value = key === "value" ? U.pInt(val) : processedVal;

          Object.assign(rollModData, {[key]: value});
        });

        return rollModData;
      });

    return rollModsData;
  }

  get rollFactors(): Partial<Record<Factor, BladesRollCollab.FactorData>> {
    const factorData: Partial<Record<Factor, BladesRollCollab.FactorData>> = {
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
  get rollPrimaryID() {return this.id}
  get rollPrimaryDoc() {return this}
  get rollPrimaryName() {return this.name!}
  get rollPrimaryType() {return this.type}
  get rollPrimaryImg() {return this.img!}
  // #endregion

  // #region BladesRollCollab.ParticipantDoc Implementation
  get rollParticipantID() {return this.id}
  get rollParticipantDoc() {return this}
  get rollParticipantIcon() {return this.playbook?.img ?? this.img!}
  get rollParticipantName() {return this.name!}
  get rollParticipantType() {return this.type}

  get rollParticipantModsData(): BladesRollCollab.RollModData[] {return []}
  // #endregion


  // #endregion


  get abilities(): BladesItem[] {
    if (!this.playbook) {return []}
    return this.activeSubItems.filter((item) => [BladesItemType.ability, BladesItemType.crew_ability].includes(item.type));
  }

  get playbookName() {
    return this.playbook?.name as (BladesTag & Playbook) | undefined;
  }
  get playbook(): BladesItemOfType<BladesItemType.crew_playbook> | undefined {
    return this.activeSubItems.find((item): item is BladesItemOfType<BladesItemType.crew_playbook> => item.type === BladesItemType.crew_playbook);
  }

}

declare interface BladesCrew {
  type: BladesActorType.crew,
  system: BladesActorSchema.Crew
}

export default BladesCrew;