import C, { AttributeTrait, Harm, BladesActorType, BladesItemType, Tag, RollModSection, RollModStatus } from "../../core/constants.js";
import U from "../../core/utilities.js";
import { BladesActor } from "../BladesActorProxy.js";
import { BladesItem } from "../BladesItemProxy.js";
import BladesPushAlert from "../../BladesPushAlert.js";
import { SelectionCategory } from "../../BladesDialog.js";
class BladesPC extends BladesActor {
    // #region Static Overrides: Create ~
    static IsType(doc) {
        return super.IsType(doc, BladesActorType.pc);
    }
    static GetUser(userRef) {
        let user;
        if (typeof userRef === "string") {
            user = game.users.get(userRef) ?? game.users.getName(userRef);
        }
        else if (userRef instanceof User) {
            user = userRef;
        }
        return user;
    }
    static GetFromUser(userRef) {
        const user = BladesPC.GetUser(userRef);
        if (!user) {
            throw new Error(`Unable to find user '${userRef}'`);
        }
        const actor = game.actors.get(user.character?.id ?? "");
        if (BladesPC.IsType(actor)) {
            return actor;
        }
        return undefined;
    }
    static async create(data, options = {}) {
        data.token = data.token || {};
        data.system = data.system ?? {};
        eLog.checkLog2("actor", "BladesPC.create(data,options)", { data, options });
        // ~ Set the Token to sync with charsheet.
        data.token.actorLink = true;
        // ~ Initialize generic experience clues.
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
    // #endregion
    constructor(data) {
        super(data);
        eLog.checkLog3("pcConstructor", "new BladesPC()", { data });
    }
    // #region BladesPrimaryActor Implementation ~
    get primaryUser() {
        return game.users?.find((user) => user.character?.id === this?.id) || null;
    }
    async clearLoadout() {
        await this.update({ "system.loadout.selected": "" });
        this.updateEmbeddedDocuments("Item", [
            ...this.activeSubItems
                .filter((item) => BladesItem.IsType(item, BladesItemType.gear)
                && !item.hasTag(Tag.System.Archived))
                .map((item) => ({
                _id: item.id,
                "system.tags": [...item.tags, Tag.System.Archived],
                "system.uses_per_score.value": 0
            })),
            ...this.activeSubItems
                .filter((item) => BladesItem.IsType(item, BladesItemType.ability)
                && item.system.uses_per_score.max)
                .map((item) => ({
                _id: item.id,
                "system.uses_per_score.value": 0
            }))
        ]);
    }
    // #endregion
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
    // #region BladesScoundrel Implementation ~
    isMember(crew) { return this.crew?.id === crew.id; }
    get vice() {
        if (this.type !== BladesActorType.pc) {
            return undefined;
        }
        return this.activeSubItems.find((item) => item.type === BladesItemType.vice);
    }
    get crew() {
        return this.activeSubActors
            .find((subActor) => BladesActor.IsType(subActor, BladesActorType.crew));
    }
    get abilities() {
        if (!this.playbook) {
            return [];
        }
        return this.activeSubItems
            .filter((item) => [BladesItemType.ability, BladesItemType.crew_ability].includes(item.type));
    }
    get cohorts() {
        return this.activeSubItems
            .filter((item) => BladesItem.IsType(item, BladesItemType.cohort_gang, BladesItemType.cohort_expert));
    }
    get playbookName() {
        return this.playbook?.name;
    }
    get playbook() {
        return this.activeSubItems
            .find((item) => item.type === BladesItemType.playbook);
    }
    get attributes() {
        if (!BladesActor.IsType(this, BladesActorType.pc)) {
            return undefined;
        }
        return {
            insight: Object.values(this.system.attributes.insight)
                .filter(({ value }) => value > 0).length
                + this.system.resistance_bonus.insight,
            prowess: Object.values(this.system.attributes.prowess)
                .filter(({ value }) => value > 0).length
                + this.system.resistance_bonus.prowess,
            resolve: Object.values(this.system.attributes.resolve)
                .filter(({ value }) => value > 0).length
                + this.system.resistance_bonus.resolve
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
    get stress() {
        return this.system.stress.value;
    }
    get stressMax() {
        return this.system.stress.max;
    }
    get trauma() {
        if (!BladesActor.IsType(this, BladesActorType.pc)) {
            return 0;
        }
        return Object.keys(this.system.trauma.checked)
            .filter((traumaName) => 
        // @ts-ignore Compiler linter mismatch.
        this.system.trauma.active[traumaName] && this.system.trauma.checked[traumaName])
            .length;
    }
    get traumaList() {
        // @ts-ignore Compiler linter mismatch.
        return BladesActor.IsType(this, BladesActorType.pc)
            ? Object.keys(this.system.trauma.active).filter((key) => this.system.trauma.active[key])
            : [];
    }
    get activeTraumaConditions() {
        if (!BladesActor.IsType(this, BladesActorType.pc)) {
            return {};
        }
        return U.objFilter(this.system.trauma.checked, 
        // @ts-ignore Compiler linter mismatch.
        (_v, traumaName) => Boolean(traumaName in this.system.trauma.active
            && this.system.trauma.active[traumaName]));
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
        const maxLoad = this.system.loadout.levels[game.i18n.localize(this.system.loadout.selected.toString())
            .toLowerCase()];
        return Math.max(0, maxLoad - this.currentLoad);
    }
    async addStash(amount) {
        if (!BladesActor.IsType(this, BladesActorType.pc)) {
            return;
        }
        await this.update({ "system.stash.value": Math.min(this.system.stash.value + amount, this.system.stash.max) });
    }
    get remainingDowntimeActions() {
        if (!BladesActor.IsType(this, BladesActorType.pc)) {
            return 0;
        }
        return this.system.downtime_actions.max + this.system.downtime_action_bonus - this.system.downtime_actions.value;
    }
    _processAbilityDialogItems(dialogData) {
        if (!this.playbookName) {
            return;
        }
        dialogData[this.playbookName] = this._processEmbeddedItemMatches(BladesItem.GetTypeWithTags(BladesItemType.ability, this.playbookName));
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
            if (a.system.world_name > b.system.world_name) {
                return 1;
            }
            if (a.system.world_name < b.system.world_name) {
                return -1;
            }
            return 0;
        });
    }
    processGearDialogItems(dialogData) {
        if (this.playbookName === null) {
            return;
        }
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
            if (a.system.world_name > b.system.world_name) {
                return 1;
            }
            if (a.system.world_name < b.system.world_name) {
                return -1;
            }
            return 0;
        });
    }
    getDialogItems(category) {
        const dialogData = {};
        const { playbookName } = this;
        if (category === SelectionCategory.Heritage) {
            dialogData.Main = this._processEmbeddedItemMatches(BladesItem.GetTypeWithTags(BladesItemType.heritage));
        }
        else if (category === SelectionCategory.Background) {
            dialogData.Main = this._processEmbeddedItemMatches(BladesItem.GetTypeWithTags(BladesItemType.background));
        }
        else if (category === SelectionCategory.Vice && playbookName !== null) {
            dialogData.Main = this._processEmbeddedItemMatches(BladesItem.GetTypeWithTags(BladesItemType.vice, playbookName));
        }
        else if (category === SelectionCategory.Playbook) {
            dialogData.Basic = this._processEmbeddedItemMatches(BladesItem.GetTypeWithTags(BladesItemType.playbook)
                .filter((item) => !item.hasTag(Tag.Gear.Advanced)));
            dialogData.Advanced = this._processEmbeddedItemMatches(BladesItem.GetTypeWithTags(BladesItemType.playbook, Tag.Gear.Advanced));
        }
        else if (category === SelectionCategory.Gear) {
            this.processGearDialogItems(dialogData);
        }
        else if (category === SelectionCategory.Ability) {
            this._processAbilityDialogItems(dialogData);
        }
        return dialogData;
    }
    getTaggedItemBonuses(tags) {
        // Given a list of item tags, will return the total bonuses to that item
        // Won't return a number, but an object literal that includes things like extra load space or concealability
        // Check ACTIVE EFFECTS supplied by ability against submitted tags?
        // Should INCLUDE bonuses from crew.
        return tags.length; // Placeholder to avoid linter error
    }
    // #endregion
    // #region BladesRoll.PrimaryDoc Implementation
    get rollModsData() {
        const rollModsData = super.rollModsData;
        // Add roll mods from harm
        [
            [/1d/, RollModSection.roll],
            [/Less Effect/, RollModSection.effect]
        ].forEach(([effectPat, effectCat]) => {
            const { one: harmConditionOne, two: harmConditionTwo } = Object.values(this.system.harm)
                .find((harmData) => effectPat.test(harmData.effect)) ?? {};
            const harmString = U.objCompact([harmConditionOne, harmConditionTwo === "" ? null : harmConditionTwo]).join(" & ");
            if (harmString.length > 0) {
                rollModsData.push({
                    id: `Harm-negative-${effectCat}`,
                    name: harmString,
                    section: effectCat,
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
        const { one: harmCondition } = Object.values(this.system.harm)
            .find((harmData) => /Need Help/.test(harmData.effect)) ?? {};
        if (harmCondition && harmCondition.trim() !== "") {
            rollModsData.push({
                id: "Push-negative-roll",
                name: "PUSH",
                sideString: harmCondition.trim(),
                section: RollModSection.roll,
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
    async applyHarm(num, name) {
        if (num === 4) {
            BladesPushAlert.Get().pushToAll("GM", `${this.name} Suffers FATAL Harm: ${name}`, `${this.name}, will you continue as a Ghost, or create a new character?`, "harm-alert fatal-harm-alert");
            return;
        }
        // Construct sequence of harm keys to check, starting with given harm level.
        const harmSequence = [
            [["lesser", "one"], ["lesser", "two"]],
            [["moderate", "one"], ["moderate", "two"]],
            [["severe", "one"]]
        ].slice(num - 1).flat(1);
        while (harmSequence.length) {
            const theseHarmKeys = harmSequence.shift();
            if (!theseHarmKeys) {
                break;
            }
            const [thisHarmLevel, thisHarmKey] = theseHarmKeys;
            const thisHarmVal = this.system.harm[thisHarmLevel][thisHarmKey];
            if (!thisHarmVal) {
                await this.update({ [`system.harm.${thisHarmLevel}.${thisHarmKey}`]: name });
                BladesPushAlert.Get().pushToAll("GM", `${this.name} Suffers ${U.tCase(thisHarmLevel)} Harm: ${name}`, null, "harm-alert");
                return;
            }
        }
        BladesPushAlert.Get().pushToAll("GM", `${this.name} Suffers a Catastrophic, Permanent Injury!`, `${this.name}, you're out of the action - either left for dead, or otherwise dropped from the action. You can choose to return at the beginning of the next Phase with a permanent injury, or die.`, "harm-alert fatal-harm-alert");
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
    get rollParticipantModsData() { return []; }
    // #endregion
    async adjustStress(deltaStress) {
        const newStress = Math.min(this.stressMax, Math.max(0, this.stress + deltaStress));
        if (newStress === this.stressMax) {
            /* PUSH NOTICE: Player must select Trauma & is removed from Score. */
        }
        await this.update({ "system.stress.value": newStress });
    }
    async spendSpecialArmor() {
        if (this.system.armor.active.special && !this.system.armor.checked.special) {
            await this.update({ "system.armor.checked.special": true });
            /* PUSH NOTICE: Spent Special Armor */
        }
    }
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
