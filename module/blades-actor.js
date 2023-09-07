/* ****▌███████████████████████████████████████████████████████████████████████████▐**** *\
|*     ▌████░░░░░░░░░░░ Euno's Blades in the Dark for Foundry VTT ░░░░░░░░░░░░░████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░ by Eunomiac ░░░░░░░░░░░░░██████████████████▐     *|
|*     ▌████████████████████████████  License █ v0.1.0 ████████████████████████████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░░░░░░  ░░░░░░░░░░░░░░░░░░███████████████████▐     *|
\* ****▌███████████████████████████████████████████████████████████████████████████▐**** */

import U from "./core/utilities.js";
import C, { BladesActorType, Tag, BladesItemType, Attribute, Action, Position, Effect, AdvancementPoint, Randomizers, RollModCategory, RollModStatus, Factor } from "./core/constants.js";
import { bladesRoll } from "./blades-roll.js";
import BladesItem from "./blades-item.js";
class BladesActor extends Actor {
    
    static async create(data, options = {}) {
        data.token = data.token || {};
        data.system = data.system ?? {};

        data.system.world_name = data.system.world_name ?? data.name.replace(/[^A-Za-z_0-9 ]/g, "").trim().replace(/ /g, "_");
        return super.create(data, options);
    }

    static get All() { return game.actors; }
    static Get(actorRef) {
        if (actorRef instanceof BladesActor) {
            return actorRef;
        }
        if (U.isDocID(actorRef)) {
            return BladesActor.All.get(actorRef);
        }
        return BladesActor.All.find((a) => a.system.world_name === actorRef)
            || BladesActor.All.find((a) => a.name === actorRef);
    }
    static GetTypeWithTags(docType, ...tags) {
        return BladesActor.All
            .filter((actor) => actor.type === docType)
            .filter((actor) => actor.hasTag(...tags));
    }
    static IsType(doc, ...types) {
        const typeSet = new Set(types);
        return doc instanceof BladesActor && typeSet.has(doc.type);
    }
    get tags() { return this.system.tags ?? []; }
    hasTag(...tags) {
        return tags.every((tag) => this.tags.includes(tag));
    }
    async addTag(...tags) {
        const curTags = this.tags;
        tags.forEach((tag) => {
            if (curTags.includes(tag)) {
                return;
            }
            curTags.push(tag);
        });
        eLog.checkLog2("actor", "BladesActor.addTag(...tags)", { tags, curTags });
        this.update({ "system.tags": curTags });
    }
    async remTag(...tags) {
        const curTags = this.tags.filter((tag) => !tags.includes(tag));
        eLog.checkLog2("actor", "BladesActor.remTag(...tags)", { tags, curTags });
        this.update({ "system.tags": curTags });
    }
    get tooltip() {
        const tooltipText = [this.system.concept, this.system.subtitle]
            .filter(Boolean)
            .join("<br><br>");
        return tooltipText ? (new Handlebars.SafeString(tooltipText)).toString() : undefined;
    }
    get dialogCSSClasses() { return ""; }
    getFactorTotal(factor) {
        switch (factor) {
            case Factor.tier: {
                if (BladesActor.IsType(this, BladesActorType.pc)) {
                    return this.system.tier.value + (this.crew?.getFactorTotal(Factor.tier) ?? 0);
                }
                return this.system.tier.value;
            }
            case Factor.quality: return this.getFactorTotal(Factor.tier);
            case Factor.scale: {
                if (BladesActor.IsType(this, BladesActorType.npc)) {
                    return this.system.scale;
                }
                return 0;
            }
            case Factor.magnitude: {
                if (BladesActor.IsType(this, BladesActorType.npc)) {
                    return this.system.magnitude;
                }
                return 0;
            }
        }
        return 0;
    }
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
        
    async grantAdvancementPoints(allowedTypes, amount = 1) {
        const aPtKey = Array.isArray(allowedTypes)
            ? allowedTypes.sort().join("_")
            : allowedTypes;
        this.update({ [`system.advancement_points.${aPtKey}`]: (this.system.advancement_points?.[aPtKey] ?? 0) + amount });
    }
    async removeAdvancementPoints(allowedTypes, amount = 1) {
        const aPtKey = Array.isArray(allowedTypes)
            ? allowedTypes.sort().join("_")
            : allowedTypes;
        const newCount = this.system.advancement_points?.[aPtKey] ?? 0 - amount;
        if (newCount <= 0 && aPtKey in (this.system.advancement_points ?? [])) {
            return this.update({ [`system.advancement_points.-=${aPtKey}`]: null });
        }
        return this.update({ [`system.advancement_points.${aPtKey}`]: newCount });
    }
    getAvailableAdvancements(trait) {
        if (!BladesActor.IsType(this, BladesActorType.pc, BladesActorType.crew)) {
            return 0;
        }
        if (trait in Action) {
            return 1;
        }
        if (trait === "Cohort") {
            const pointsCohort = this.system.advancement_points?.[AdvancementPoint.Cohort] ?? 0;
            const spentCohort = this.cohorts.length;
            return Math.max(0, pointsCohort - spentCohort);
        }
        const pointsAbility = this.system.advancement_points?.[AdvancementPoint.Ability] ?? 0;
        const pointsCohortType = this.system.advancement_points?.[AdvancementPoint.CohortType] ?? 0;
        const pointsUpgrade = this.system.advancement_points?.[AdvancementPoint.Upgrade] ?? 0;
        const pointsUpgradeOrAbility = this.system.advancement_points?.[AdvancementPoint.UpgradeOrAbility] ?? 0;
        const spentAbility = U.sum(this.items
            .filter((item) => BladesItem.IsType(item, BladesItemType.ability, BladesItemType.crew_ability))
            .map((abil) => abil.system.price ?? 1));
        const spentCohortType = U.sum(this.cohorts.map((cohort) => Math.max(0, U.unique(Object.values(cohort.system.subtypes)).length - 1)));
        const spentUpgrade = U.sum(this.items
            .filter((item) => BladesItem.IsType(item, BladesItemType.crew_upgrade))
            .map((upgrade) => upgrade.system.price ?? 1));
        const excessUpgrade = Math.max(0, spentUpgrade - pointsUpgrade);
        const excessCohortType = Math.max(0, spentCohortType - pointsCohortType);
        const excessAbility = Math.max(0, spentAbility - pointsAbility);
        const remainingAbility = Math.max(0, pointsAbility - spentAbility);
        const remainingCohortType = Math.max(0, pointsCohortType - spentCohortType);
        const remainingUpgrade = Math.max(0, pointsUpgrade - spentUpgrade);
        const remainingUpgradeOrAbility = Math.max(0, pointsUpgradeOrAbility - excessUpgrade - (2 * excessAbility) - (2 * excessCohortType));
        if (trait === "Ability") {
            return remainingAbility + Math.floor(0.5 * remainingUpgradeOrAbility);
        }
        if (trait === "Upgrade") {
            return remainingUpgrade + remainingUpgradeOrAbility;
        }
        if (trait === "CohortType") {
            return remainingCohortType + remainingUpgradeOrAbility;
        }
        return 0;
    }
    get availableAbilityPoints() { return this.getAvailableAdvancements("Ability"); }
    get availableUpgradePoints() { return this.getAvailableAdvancements("Upgrade"); }
    get availableCohortPoints() { return this.getAvailableAdvancements("Cohort"); }
    get availableCohortTypePoints() { return this.getAvailableAdvancements("CohortType"); }
    get canPurchaseAbility() { return this.availableAbilityPoints > 0; }
    get canPurchaseUpgrade() { return this.availableUpgradePoints > 0; }
    get canPurchaseCohort() { return this.availableCohortPoints > 0; }
    get canPurchaseCohortType() { return this.availableCohortTypePoints > 0; }
    async advancePlaybook() {
        if (!(BladesActor.IsType(this, BladesActorType.pc) || BladesActor.IsType(this, BladesActorType.crew)) || !this.playbook) {
            return undefined;
        }
        await this.update({ "system.experience.playbook.value": 0 });
        if (BladesActor.IsType(this, BladesActorType.pc)) {
            game.eunoblades.PushController.pushToAll("GM", `${this.name} Advances their Playbook!`, `${this.name}, select a new Ability on your Character Sheet.`);
            return this.grantAdvancementPoints(AdvancementPoint.Ability);
        }
        if (BladesActor.IsType(this, BladesActorType.crew)) {
            game.eunoblades.PushController.pushToAll("GM", `${this.name} Advances their Playbook!`, "Select new Upgrades and/or Abilities on your Crew Sheet.");
            this.members.forEach((member) => {
                const coinGained = this.system.tier.value + 2;
                game.eunoblades.PushController.pushToAll("GM", `${member.name} Gains ${coinGained} Stash (Crew Advancement)`, undefined);
                member.addStash(coinGained);
            });
            return this.grantAdvancementPoints(AdvancementPoint.UpgradeOrAbility, 2);
        }
        return undefined;
    }
    async advanceAttribute(attribute) {
        await this.update({ [`system.experience.${attribute}.value`]: 0 });
        const actions = C.Action[attribute].map((action) => `<strong>${U.tCase(action)}</strong>`);
        game.eunoblades.PushController.pushToAll("GM", `${this.name} Advances their ${U.uCase(attribute)}!`, `${this.name}, add a dot to one of ${U.oxfordize(actions, true, "or")}.`);
    }
    
    
    
    
    
    get rollModsData() {
        if (!(BladesActor.IsType(this, BladesActorType.pc) || BladesActor.IsType(this, BladesActorType.crew))) {
            return [];
        }
        const { roll_mods } = this.system;
        if (roll_mods.length === 0) {
            return [];
        }
        const rollModsData = roll_mods
            .filter((elem) => elem !== undefined)
            .map((modString) => {
            const pStrings = modString.split(/@/);
            const nameString = U.pullElement(pStrings, (v) => typeof v === "string" && /^na/i.test(v));
            const nameVal = (typeof nameString === "string" && nameString.replace(/^.*:/, ""));
            if (!nameVal) {
                throw new Error(`RollMod Missing Name: '${modString}'`);
            }
            const catString = U.pullElement(pStrings, (v) => typeof v === "string" && /^cat/i.test(v));
            const catVal = (typeof catString === "string" && catString.replace(/^.*:/, ""));
            if (!catVal || !(catVal in RollModCategory)) {
                throw new Error(`RollMod Missing Category: '${modString}'`);
            }
            const posNegString = (U.pullElement(pStrings, (v) => typeof v === "string" && /^p/i.test(v)) || "posNeg:positive");
            const posNegVal = posNegString.replace(/^.*:/, "");
            const rollModData = {
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
                const [keyString, valString] = pString.split(/:/);
                let val = /\|/.test(valString) ? valString.split(/\|/) : valString;
                let key;
                if (/^stat/i.test(keyString)) {
                    key = "base_status";
                }
                else if (/^val/i.test(keyString)) {
                    key = "value";
                }
                else if (/^eff|^ekey/i.test(keyString)) {
                    key = "effectKeys";
                }
                else if (/^side|^ss/i.test(keyString)) {
                    key = "sideString";
                }
                else if (/^s.*ame/i.test(keyString)) {
                    key = "source_name";
                }
                else if (/^tool|^tip/i.test(keyString)) {
                    key = "tooltip";
                }
                else if (/^ty/i.test(keyString)) {
                    key = "modType";
                }
                else if (/^c.*r?.*ty/i.test(keyString)) {
                    key = "conditionalRollTypes";
                }
                else if (/^a.*r?.*y/i.test(keyString)) {
                    key = "autoRollTypes";
                }
                else if (/^c.*r?.*tr/i.test(keyString)) {
                    key = "conditionalRollTraits";
                }
                else if (/^a.*r?.*tr/i.test(keyString)) {
                    key = "autoRollTraits";
                }
                else {
                    throw new Error(`Bad Roll Mod Key: ${keyString}`);
                }
                if (key === "base_status" && val === "Conditional") {
                    val = RollModStatus.Hidden;
                }
                Object.assign(rollModData, { [key]: ["value"].includes(key)
                        ? U.pInt(val)
                        : (["effectKeys", "conditionalRollTypes", "autoRollTypes,", "conditionalRollTraits", "autoRollTraits"].includes(key)
                            ? [val].flat()
                            : val.replace(/%COLON%/g, ":")) });
            });
            return rollModData;
        });
        return rollModsData;
    }
    get rollFactors() {
        const factorData = {
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
        if (BladesActor.IsType(this, BladesActorType.npc)) {
            factorData[Factor.scale] = {
                name: Factor.scale,
                value: this.getFactorTotal(Factor.scale),
                max: this.getFactorTotal(Factor.scale),
                baseVal: this.getFactorTotal(Factor.scale),
                cssClasses: "factor-grey",
                isActive: false,
                isPrimary: false,
                isDominant: false,
                highFavorsPC: true
            };
            factorData[Factor.magnitude] = {
                name: Factor.magnitude,
                value: this.getFactorTotal(Factor.magnitude),
                max: this.getFactorTotal(Factor.magnitude),
                baseVal: this.getFactorTotal(Factor.magnitude),
                isActive: false,
                isPrimary: false,
                isDominant: false,
                highFavorsPC: true
            };
        }
        return factorData;
    }
    get rollOppImg() { return this.img ?? undefined; }
    
    prepareDerivedData() {
        if (BladesActor.IsType(this, BladesActorType.pc)) {
            this._preparePCData(this.system);
        }
        if (BladesActor.IsType(this, BladesActorType.crew)) {
            this._prepareCrewData(this.system);
        }
        if (BladesActor.IsType(this, BladesActorType.npc)) {
            this._prepareNPCData(this.system);
        }
        if (BladesActor.IsType(this, BladesActorType.faction)) {
            this._prepareFactionData(this.system);
        }
    }
    _preparePCData(system) {
        if (!BladesActor.IsType(this, BladesActorType.pc)) {
            return;
        }
        if (this.playbook) {
            system.experience.clues = [...system.experience.clues, ...Object.values(this.playbook.system.experience_clues).filter((clue) => Boolean(clue.trim()))];
        }
        if (this.playbook) {
            system.gather_info = [...system.gather_info, ...Object.values(this.playbook.system.gather_info_questions).filter((question) => Boolean(question.trim()))];
        }
    }
    _prepareCrewData(system) {
        if (!BladesActor.IsType(this, BladesActorType.crew)) {
            return;
        }
        if (this.playbook) {
            system.experience.clues = [...system.experience.clues, ...Object.values(this.playbook.system.experience_clues).filter((clue) => Boolean(clue.trim()))];
            system.turfs = this.playbook.system.turfs;
        }
    }
    _prepareNPCData(system) {
        if (!BladesActor.IsType(this, BladesActorType.npc)) {
            return;
        }
    }
    _prepareFactionData(system) {
        if (!BladesActor.IsType(this, BladesActorType.faction)) {
            return;
        }
    }
    
    async _onCreateDescendantDocuments(parent, collection, docs, data, options, userId) {
        docs.forEach(async (doc) => {
            if (doc instanceof BladesItem && [BladesItemType.playbook, BladesItemType.crew_playbook].includes(doc.type)) {
                await Promise.all(this.activeSubItems
                    .filter((aItem) => aItem.type === doc.type && aItem.system.world_name !== doc.system.world_name)
                    .map((aItem) => this.remSubItem(aItem)));
            }
        });
        await super._onCreateDescendantDocuments(parent, collection, docs, data, options, userId);
        eLog.checkLog("actorTrigger", "_onCreateDescendantDocuments", { parent, collection, docs, data, options, userId });
        docs.forEach(async (doc) => {
            if (doc instanceof BladesItem) {
                switch (doc.type) {
                    case BladesItemType.vice: {
                        if (!BladesActor.IsType(this, BladesActorType.pc)) {
                            return;
                        }
                        this.activeSubActors
                            .filter((subActor) => subActor.hasTag(Tag.NPC.VicePurveyor) && !subActor.hasTag(doc.name))
                            .forEach((subActor) => this.remSubActor(subActor));
                        break;
                    }
                }
            }
        });
    }
    async update(updateData, context, isSkippingSubActorCheck = false) {
        if (!updateData) {
            return super.update(updateData);
        }
        if (BladesActor.IsType(this, BladesActorType.crew)) {
            if (!this.playbook) {
                return undefined;
            }
            eLog.checkLog("actorTrigger", "Updating Crew", { updateData });
            const playbookUpdateData = Object.fromEntries(Object.entries(flattenObject(updateData))
                .filter(([key, _]) => key.startsWith("system.turfs.")));
            updateData = Object.fromEntries(Object.entries(flattenObject(updateData))
                .filter(([key, _]) => !key.startsWith("system.turfs.")));
            eLog.checkLog("actorTrigger", "Updating Crew", { crewUpdateData: updateData, playbookUpdateData });
            const diffPlaybookData = diffObject(flattenObject(this.playbook), playbookUpdateData);
            delete diffPlaybookData._id;
            if (!U.isEmpty(diffPlaybookData)) {
                await this.playbook.update(playbookUpdateData, context)
                    .then(() => this.sheet?.render(false));
            }
        }
        else if (BladesActor.IsType(this, BladesActorType.npc) || BladesActor.IsType(this, BladesActorType.faction)) {
            if (this.parentActor && !isSkippingSubActorCheck) {
                return this.parentActor.updateSubActor(this.id, updateData);
            }
        }
        return super.update(updateData, context);
    }
    
    rollAttributePopup(attribute_name) {
        const test = Action;
        const attribute_label = U.tCase(attribute_name);
        let content = `
        <h2>${game.i18n.localize("BITD.Roll")} ${attribute_label}</h2>
        <form>
          <div class="form-group">
            <label>${game.i18n.localize("BITD.Modifier")}:</label>
            <select id="mod" name="mod">
              ${this.createListOfDiceMods(-3, +3, 0)}
            </select>
          </div>`;
        if ([...Object.keys(Attribute), ...Object.keys(Action)].includes(attribute_name)) {
            content += `
            <div class="form-group">
              <label>${game.i18n.localize("BITD.Position")}:</label>
              <select id="pos" name="pos">
                <option value="controlled">${game.i18n.localize("BITD.PositionControlled")}</option>
                <option value="risky" selected>${game.i18n.localize("BITD.PositionRisky")}</option>
                <option value="desperate">${game.i18n.localize("BITD.PositionDesperate")}</option>
              </select>
            </div>
            <div class="form-group">
              <label>${game.i18n.localize("BITD.Effect")}:</label>
              <select id="fx" name="fx">
                <option value="limited">${game.i18n.localize("BITD.EffectLimited")}</option>
                <option value="standard" selected>${game.i18n.localize("BITD.EffectStandard")}</option>
                <option value="great">${game.i18n.localize("BITD.EffectGreat")}</option>
              </select>
            </div>`;
        }
        else {
            content += `
            <input id="pos" name="pos" type="hidden" value="">
            <input id="fx" name="fx" type="hidden" value="">`;
        }
        content += `
        <div className="form-group">
          <label>${game.i18n.localize("BITD.Notes")}:</label>
          <input id="note" name="note" type="text" value="">
        </div><br/>
        </form>
      `;
        new Dialog({
            "title": `${game.i18n.localize("BITD.Roll")} ${attribute_label}`,
            "content": content,
            "buttons": {
                yes: {
                    icon: "<i class='fas fa-check'></i>",
                    label: game.i18n.localize("BITD.Roll"),
                    callback: async (html) => {
                        if (html instanceof HTMLElement) {
                            html = $(html);
                        }
                        const modifier = parseInt(`${html.find('[name="mod"]').attr("value") ?? 0}`);
                        const position = `${html.find('[name="pos"]').attr("value") ?? Position.risky}`;
                        const effect = `${html.find('[name="fx"]').attr("value") ?? Effect.standard}`;
                        const note = `${html.find('[name="note"]').attr("value") ?? 0}`;
                        await this.rollAttribute(attribute_name, modifier, position, effect, note);
                    }
                },
                no: {
                    icon: "<i class='fas fa-times'></i>",
                    label: game.i18n.localize("Close")
                }
            },
            "default": "yes"
        }).render(true);
    }
    async rollAttribute(attribute_name, additional_dice_amount = 0, position = Position.risky, effect = Effect.standard, note) {
        if (!BladesActor.IsType(this, BladesActorType.pc)) {
            return;
        }
        bladesRoll(this.rollable[attribute_name] + additional_dice_amount, attribute_name, position, effect, note);
    }
        createListOfDiceMods(rs, re, s) {
        let text = "";
        if (s === "") {
            s = 0;
        }
        for (let i = rs; i <= re; i++) {
            let plus = "";
            if (i >= 0) {
                plus = "+";
            }
            text += `<option value="${i}"`;
            if (i === s) {
                text += " selected";
            }
            text += `>${plus}${i}d</option>`;
        }
        return text;
    }
    
    updateRandomizers() {
        if (!BladesActor.IsType(this, BladesActorType.npc)) {
            return;
        }
        const titleChance = 0.05;
        const suffixChance = 0.01;
        const { persona, secret, random } = this.system;
        function sampleArray(arr, ...curVals) {
            arr = arr.filter((elem) => !curVals.includes(elem));
            if (!arr.length) {
                return "";
            }
            return arr[Math.floor(Math.random() * arr.length)];
        }
        const randomGen = {
            name: (gender) => {
                return [
                    Math.random() <= titleChance
                        ? sampleArray(Randomizers.name_title)
                        : "",
                    sampleArray([
                        ...((gender ?? "").charAt(0).toLowerCase() !== "m" ? Randomizers.name_first.female : []),
                        ...((gender ?? "").charAt(0).toLowerCase() !== "f" ? Randomizers.name_first.male : [])
                    ]),
                    `"${sampleArray(Randomizers.name_alias)}"`,
                    sampleArray(Randomizers.name_surname),
                    Math.random() <= suffixChance
                        ? sampleArray(Randomizers.name_suffix)
                        : ""
                ].filter((val) => Boolean(val)).join(" ");
            },
            background: () => sampleArray(Randomizers.background, random.background.value),
            heritage: () => sampleArray(Randomizers.heritage, random.heritage.value),
            profession: () => sampleArray(Randomizers.profession, random.profession.value),
            gender: () => sampleArray(Randomizers.gender, persona.gender.value),
            appearance: () => sampleArray(Randomizers.appearance, persona.appearance.value),
            goal: () => sampleArray(Randomizers.goal, persona.goal.value, secret.goal.value),
            method: () => sampleArray(Randomizers.method, persona.method.value, secret.method.value),
            trait: () => sampleArray(Randomizers.trait, persona.trait1.value, persona.trait2.value, persona.trait3.value, secret.trait.value),
            interests: () => sampleArray(Randomizers.interests, persona.interests.value, secret.interests.value),
            quirk: () => sampleArray(Randomizers.quirk, persona.quirk.value),
            style: (gender = "") => sampleArray([
                ...(gender.charAt(0).toLowerCase() !== "m" ? Randomizers.style.female : []),
                ...(gender.charAt(0).toLowerCase() !== "f" ? Randomizers.style.male : [])
            ], persona.style.value)
        };
        const gender = persona.gender.isLocked ? persona.gender.value : randomGen.gender();
        const updateKeys = [
            ...Object.keys(persona).filter((key) => !persona[key]?.isLocked),
            ...Object.keys(random).filter((key) => !random[key]?.isLocked),
            ...Object.keys(secret).filter((key) => !secret[key]?.isLocked)
                .map((secretKey) => `secret-${secretKey}`)
        ];
        eLog.checkLog("Update Keys", { updateKeys });
        const updateData = {};
        updateKeys.forEach((key) => {
            switch (key) {
                case "name":
                case "heritage":
                case "background":
                case "profession": {
                    const randomVal = randomGen[key]();
                    updateData[`system.random.${key}`] = {
                        isLocked: false,
                        value: randomVal || random[key].value
                    };
                    break;
                }
                case "secret-goal":
                case "secret-interests":
                case "secret-method": {
                    key = key.replace(/^secret-/, "");
                    const randomVal = randomGen[key]();
                    updateData[`system.secret.${key}`] = {
                        isLocked: false,
                        value: randomVal || secret[key].value
                    };
                    break;
                }
                case "gender": {
                    updateData[`system.persona.${key}`] = {
                        isLocked: persona.gender.isLocked,
                        value: gender
                    };
                    break;
                }
                case "trait1":
                case "trait2":
                case "trait3":
                case "secret-trait": {
                    const trait1 = persona.trait1.isLocked
                        ? persona.trait1.value
                        : sampleArray(Randomizers.trait, persona.trait1.value, persona.trait2.value, persona.trait3.value, secret.trait.value);
                    const trait2 = persona.trait2.isLocked
                        ? persona.trait2.value
                        : sampleArray(Randomizers.trait, trait1, persona.trait1.value, persona.trait2.value, persona.trait3.value, secret.trait.value);
                    const trait3 = persona.trait3.isLocked
                        ? persona.trait3.value
                        : sampleArray(Randomizers.trait, trait1, trait2, persona.trait1.value, persona.trait2.value, persona.trait3.value, secret.trait.value);
                    const secretTrait = secret.trait.isLocked
                        ? secret.trait.value
                        : sampleArray(Randomizers.trait, trait1, trait2, trait3, persona.trait1.value, persona.trait2.value, persona.trait3.value, secret.trait.value);
                    if (!persona.trait1.isLocked) {
                        updateData["system.persona.trait1"] = {
                            isLocked: false,
                            value: trait1
                        };
                    }
                    if (!persona.trait2.isLocked) {
                        updateData["system.persona.trait2"] = {
                            isLocked: false,
                            value: trait2
                        };
                    }
                    if (!persona.trait3.isLocked) {
                        updateData["system.persona.trait3"] = {
                            isLocked: false,
                            value: trait3
                        };
                    }
                    if (!secret.trait.isLocked) {
                        updateData["system.secret.trait"] = {
                            isLocked: false,
                            value: secretTrait
                        };
                    }
                    break;
                }
                default: {
                    const randomVal = randomGen[key]();
                    updateData[`system.persona.${key}`] = {
                        isLocked: false,
                        value: randomVal || persona[key].value
                    };
                    break;
                }
            }
        });
        this.update(updateData);
    }
}
export default BladesActor;