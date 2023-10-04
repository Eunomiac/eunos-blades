/* ****▌███████████████████████████████████████████████████████████████████████████▐**** *\
|*     ▌████░░░░░░░░░░░ Euno's Blades in the Dark for Foundry VTT ░░░░░░░░░░░░░████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░ by Eunomiac ░░░░░░░░░░░░░██████████████████▐     *|
|*     ▌████████████████████████████  License █ v0.1.0 ████████████████████████████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░░░░░░  ░░░░░░░░░░░░░░░░░░███████████████████▐     *|
\* ****▌███████████████████████████████████████████████████████████████████████████▐**** */

import BladesItem from "../../BladesItem.js";
import C, { AttributeTrait, Harm, BladesActorType, BladesItemType, Tag, RollModSection, Factor, RollModStatus } from "../../core/constants.js";
import U from "../../core/utilities.js";
import BladesActor from "../../BladesActor.js";
import { BladesRollMod } from "../../BladesRollCollab.js";
class BladesPC extends BladesActor {

    static IsType(doc) {
        return super.IsType(doc, BladesActorType.pc);
    }
    static async create(data, options = {}) {
        data.token = data.token || {};
        data.system = data.system ?? {};
        eLog.checkLog2("actor", "BladesPC.create(data,options)", { data, options });

        data.token.actorLink = true;

        data.system.experience = {
            playbook: { value: 0, max: 8 },
            insight: { value: 0, max: 6 },
            prowess: { value: 0, max: 6 },
            resolve: { value: 0, max: 6 },
            clues: [],
            ...data.system.experience ?? {}
        };
        return super.create(data, options);
    }

    get primaryUser() {
        return game.users?.find((user) => user.character?.id === this?.id) || null;
    }
    async clearLoadout() {
        await this.update({ "system.loadout.selected": "" });
        this.updateEmbeddedDocuments("Item", [
            ...this.activeSubItems.filter((item) => BladesItem.IsType(item, BladesItemType.gear) && !item.hasTag(Tag.System.Archived))
                .map((item) => ({
                "_id": item.id,
                "system.tags": [...item.tags, Tag.System.Archived],
                "system.uses_per_score.value": 0
            })),
            ...this.activeSubItems.filter((item) => BladesItem.IsType(item, BladesItemType.ability) && item.system.uses_per_score.max)
                .map((item) => ({
                "_id": item.id,
                "system.uses_per_score.value": 0
            }))
        ]);
    }
    getSubActor(actorRef) {
        const actor = super.getSubActor(actorRef);
        if (!actor) {
            return undefined;
        }
        if (this.primaryUser?.id) {
            actor.ownership[this.primaryUser.id] = CONST.DOCUMENT_PERMISSION_LEVELS.OWNER;
        }
        return actor;
    }
    get armorStatus() {
        const armorData = {};
        if (this.system.armor.active.special) {
            armorData.special = this.system.armor.checked.special;
        }
        if (this.system.armor.active.heavy) {
            armorData.max = 2;
            if (this.system.armor.checked.light) {
                armorData.value = 0;
            }
            else if (this.system.armor.checked.heavy) {
                armorData.value = 1;
            }
            else {
                armorData.value = 2;
            }
        }
        else if (this.system.armor.active.light) {
            armorData.max = 1;
            if (this.system.armor.checked.light) {
                armorData.value = 0;
            }
            else {
                armorData.value = 1;
            }
        }
        else {
            armorData.max = 0;
            armorData.value = 0;
        }
        return armorData;
    }
    isMember(crew) { return this.crew?.id === crew.id; }
    get vice() {
        if (this.type !== BladesActorType.pc) {
            return undefined;
        }
        return this.activeSubItems.find((item) => item.type === BladesItemType.vice);
    }
    get crew() {
        return this.activeSubActors.find((subActor) => BladesActor.IsType(subActor, BladesActorType.crew));
    }
    get abilities() {
        if (!this.playbook) {
            return [];
        }
        return this.activeSubItems.filter((item) => [BladesItemType.ability, BladesItemType.crew_ability].includes(item.type));
    }
    get playbookName() {
        return this.playbook?.name;
    }
    get playbook() {
        return this.activeSubItems.find((item) => item.type === BladesItemType.playbook);
    }
    get attributes() {
        if (!BladesActor.IsType(this, BladesActorType.pc)) {
            return undefined;
        }
        return {
            insight: Object.values(this.system.attributes.insight).filter(({ value }) => value > 0).length + this.system.resistance_bonus.insight,
            prowess: Object.values(this.system.attributes.prowess).filter(({ value }) => value > 0).length + this.system.resistance_bonus.prowess,
            resolve: Object.values(this.system.attributes.resolve).filter(({ value }) => value > 0).length + this.system.resistance_bonus.resolve
        };
    }
    get actions() {
        if (!BladesActor.IsType(this, BladesActorType.pc)) {
            return undefined;
        }
        return U.objMap({
            ...this.system.attributes.insight,
            ...this.system.attributes.prowess,
            ...this.system.attributes.resolve
        }, ({ value, max }) => U.gsap.utils.clamp(0, max, value));
    }
    get rollable() {
        if (!BladesActor.IsType(this, BladesActorType.pc)) {
            return undefined;
        }
        return {
            ...this.attributes,
            ...this.actions
        };
    }
    get trauma() {
        if (!BladesActor.IsType(this, BladesActorType.pc)) {
            return 0;
        }
        return Object.keys(this.system.trauma.checked)
            .filter((traumaName) => 
        this.system.trauma.active[traumaName] && this.system.trauma.checked[traumaName])
            .length;
    }
    get traumaList() {
        return BladesActor.IsType(this, BladesActorType.pc) ? Object.keys(this.system.trauma.active).filter((key) => this.system.trauma.active[key]) : [];
    }
    get activeTraumaConditions() {
        if (!BladesActor.IsType(this, BladesActorType.pc)) {
            return {};
        }
        return U.objFilter(this.system.trauma.checked, 
        (_v, traumaName) => Boolean(traumaName in this.system.trauma.active && this.system.trauma.active[traumaName]));
    }
    get currentLoad() {
        if (!BladesActor.IsType(this, BladesActorType.pc)) {
            return 0;
        }
        const activeLoadItems = this.activeSubItems.filter((item) => item.type === BladesItemType.gear);
        return U.gsap.utils.clamp(0, 10, activeLoadItems.reduce((tot, i) => tot + U.pInt(i.system.load), 0));
    }
    get remainingLoad() {
        if (!BladesActor.IsType(this, BladesActorType.pc)) {
            return 0;
        }
        if (!this.system.loadout.selected) {
            return 0;
        }
        const maxLoad = this.system.loadout.levels[game.i18n.localize(this.system.loadout.selected.toString()).toLowerCase()];
        return Math.max(0, maxLoad - this.currentLoad);
    }
    async addStash(amount) {
        if (!BladesActor.IsType(this, BladesActorType.pc)) {
            return;
        }
        await this.update({ "system.stash.value": Math.min(this.system.stash.value + amount, this.system.stash.max) });
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
        return factorData;
    }
    get rollPrimaryID() { return this.id; }
    get rollPrimaryDoc() { return this; }
    get rollPrimaryName() { return this.name; }
    get rollPrimaryType() { return this.type; }
    get rollPrimaryImg() { return this.img; }
    get rollModsData() {
        const rollModsData = BladesRollMod.ParseDocRollMods(this);
        [[/1d/, RollModSection.roll], [/Less Effect/, RollModSection.effect]].forEach(([effectPat, effectCat]) => {
            const { one: harmConditionOne, two: harmConditionTwo } = Object.values(this.system.harm)
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
                        `<h1 class='sur-title'>${effectCat === RollModSection.roll ? Harm.Impaired : Harm.Weakened} (Harm)</h1>`,
                        `<h1 class='red-bright'>${harmString}</h1>`,
                        effectCat === RollModSection.roll
                            ? "<p>If your injuries apply to the situation at hand, you suffer <strong class='red-bright'>−1d</strong> to your roll.</p>"
                            : "<p>If your injuries apply to the situation at hand, you suffer <strong class='red-bright'>−1 effect</strong>."
                    ].join("")
                });
            }
        });
        const { one: harmCondition } = Object.values(this.system.harm).find((harmData) => /Need Help/.test(harmData.effect)) ?? {};
        if (harmCondition && harmCondition.trim() !== "") {
            rollModsData.push({
                id: "Push-negative-roll",
                name: "PUSH",
                sideString: harmCondition.trim(),
                category: RollModSection.roll,
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
    
    
    get rollParticipantID() { return this.id; }
    get rollParticipantDoc() { return this; }
    get rollParticipantIcon() { return this.playbook?.img ?? this.img; }
    get rollParticipantName() { return this.name ?? ""; }
    get rollParticipantType() { return this.type; }
    get rollParticipantModsData() { return []; }
    
    get rollTraitPCTooltipActions() {
        const tooltipStrings = ["<table><tbody>"];
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
    get rollTraitPCTooltipAttributes() {
        const tooltipStrings = ["<table><tbody>"];
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
}
export default BladesPC;
//# sourceMappingURL=BladesPC.js.map
//# sourceMappingURL=BladesPC.js.map
