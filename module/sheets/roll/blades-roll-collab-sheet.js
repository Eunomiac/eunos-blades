/* ****▌███████████████████████████████████████████████████████████████████████████▐**** *\
|*     ▌████░░░░░░░░░░░ Euno's Blades in the Dark for Foundry VTT ░░░░░░░░░░░░░████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░ by Eunomiac ░░░░░░░░░░░░░██████████████████▐     *|
|*     ▌████████████████████████████  License █ v0.1.0 ████████████████████████████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░░░░░░  ░░░░░░░░░░░░░░░░░░███████████████████▐     *|
\* ****▌███████████████████████████████████████████████████████████████████████████▐**** */

import U from "../../core/utilities.js";
import C, { BladesActorType, RollType, RollModStatus, RollModCategory, Action, Attribute, Position, Effect, Factor } from "../../core/constants.js";
import BladesActor from "../../blades-actor.js";
import BladesItem from "../../blades-item.js";
import { ApplyTooltipListeners } from "../../core/gsap.js";
function isAction(trait) {
    return Boolean(trait && typeof trait === "string" && trait in Action);
}
function isAttribute(trait) {
    return Boolean(trait && typeof trait === "string" && trait in Attribute);
}
function isTier(trait) { return U.lCase(trait) === "tier"; }
function isNumber(trait) { return U.isInt(trait); }
export const ModEffects = {
    NegateTierPenalty: (mod, sheetData) => {
                return sheetData;
    },
    NegateQualityPenalty: (mod, sheetData) => {
                return sheetData;
    },
    IsPush: (mod, sheetData) => {
        return sheetData;
    }
};
class BladesRollCollabSheet extends DocumentSheet {
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            classes: ["eunos-blades", "sheet", "roll-collab"],
            template: `systems/eunos-blades/templates/roll/roll-collab${game.user.isGM ? "-gm" : ""}.hbs`,
            submitOnChange: true,
            width: 500
        });
    }
    static Initialize() {
        return loadTemplates([
            "systems/eunos-blades/templates/roll/roll-collab.hbs",
            "systems/eunos-blades/templates/roll/roll-collab-gm.hbs",
            "systems/eunos-blades/templates/roll/partials/roll-collab-gm-number-line.hbs",
            "systems/eunos-blades/templates/roll/partials/roll-collab-gm-select-doc.hbs",
            "systems/eunos-blades/templates/roll/partials/roll-collab-action.hbs",
            "systems/eunos-blades/templates/roll/partials/roll-collab-action-gm.hbs",
            "systems/eunos-blades/templates/roll/partials/roll-collab-resistance.hbs",
            "systems/eunos-blades/templates/roll/partials/roll-collab-resistance-gm.hbs",
            "systems/eunos-blades/templates/roll/partials/roll-collab-downtime.hbs",
            "systems/eunos-blades/templates/roll/partials/roll-collab-downtime-gm.hbs",
            "systems/eunos-blades/templates/roll/partials/roll-collab-fortune.hbs",
            "systems/eunos-blades/templates/roll/partials/roll-collab-fortune-gm.hbs",
            "systems/eunos-blades/templates/roll/partials/roll-collab-incarceration.hbs",
            "systems/eunos-blades/templates/roll/partials/roll-collab-incarceration-gm.hbs"
        ]);
    }
    static InitSockets() {
        socketlib.system.register("renderRollCollab", BladesRollCollabSheet.RenderRollCollab);
        socketlib.system.register("closeRollCollab", BladesRollCollabSheet.CloseRollCollab);
    }
    static Current = {};
    static get DefaultFlagData() {
        return {
            rollID: randomID(),
            rollType: RollType.Action,
            rollPrimaryType: "Actor",
            rollPrimaryID: "",
            rollTrait: Factor.tier,
            rollMods: {
                [RollModCategory.roll]: {
                    positive: {
                        Push: {
                            name: "Push",
                            category: RollModCategory.roll,
                            status: RollModStatus.ToggledOff,
                            posNeg: "positive",
                            modType: "general",
                            stressCost: 2,
                            value: 1,
                            tooltip: "<h1>Push for +1d</h1><p>For <strong class='red-bright'>2 Stress</strong>, add <strong class='gold-bright'>1 die</strong> to your pool.</p><p><em>(You <strong>cannot</strong> also accept a <strong class='red-bright'>Devil's Bargain</strong> to increase your dice pool: It's one or the other.)</em></p>"
                        },
                        Bargain: {
                            name: "Bargain",
                            category: RollModCategory.roll,
                            status: RollModStatus.Hidden,
                            posNeg: "positive",
                            modType: "general",
                            value: 1,
                            tooltip: "<h1 class='red-bright'>Devil's Bargain</h1><p>The GM has offered you a <strong class='red-bright'>Devil's Bargain</strong>.</p><p><strong class='red-bright'>Accept the terms</strong> to add <strong class='gold-bright'>1 die</strong> to your pool.</p><p><em>(You <strong>cannot</strong> also <strong>Push for +1d</strong> to increase your dice pool: It's one or the other.)</em></p>"
                        },
                        Assist: {
                            name: "Assist",
                            category: RollModCategory.roll,
                            status: RollModStatus.Hidden,
                            posNeg: "positive",
                            modType: "teamwork",
                            value: 1,
                            sideString: "",
                            tooltip: "<h1 class='gold-bright'>@CHARACTER_NAME@ Assists</h1><p><strong class='gold-bright'>@CHARACTER_NAME@</strong> is <strong>Assisting</strong> your efforts, adding <strong class='gold-bright'>1 die</strong> to your pool.</p>"
                        }
                    },
                    negative: {}
                },
                [RollModCategory.position]: {
                    positive: {
                        Setup: {
                            name: "Setup",
                            category: RollModCategory.position,
                            status: RollModStatus.Hidden,
                            posNeg: "positive",
                            modType: "teamwork",
                            value: 1,
                            sideString: undefined,
                            tooltip: "<h1 class='gold-bright'>@CHARACTER_NAME@ Sets You Up</h1><p><strong class='gold-bright'>@CHARACTER_NAME@</strong> has set you up for success with a preceding <strong>Setup</strong> action, increasing your <strong class='gold-bright'>Position</strong> by one level.</p>"
                        }
                    },
                    negative: {}
                },
                [RollModCategory.effect]: {
                    positive: {
                        Push: {
                            name: "Push",
                            category: RollModCategory.effect,
                            status: RollModStatus.ToggledOff,
                            posNeg: "positive",
                            modType: "general",
                            stressCost: 2,
                            value: 1,
                            tooltip: "<h1>Push for Effect</h1><p>For <strong class='red-bright'>2 Stress</strong>, increase your <strong class='gold-bright'>Effect</strong> by one level.</p>"
                        },
                        Setup: {
                            name: "Setup",
                            category: RollModCategory.effect,
                            status: RollModStatus.Hidden,
                            posNeg: "positive",
                            modType: "teamwork",
                            value: 1,
                            sideString: undefined,
                            tooltip: "<h1 class='gold-bright'>@CHARACTER_NAME@ Sets You Up</h1><p><strong class='gold-bright'>@CHARACTER_NAME@</strong> has set you up for success with a preceding <strong>Setup</strong> action, increasing your <strong class='gold-bright'>Effect</strong> by one level.</p>"
                        },
                        Potency: {
                            name: "Potency",
                            category: RollModCategory.effect,
                            status: RollModStatus.Hidden,
                            posNeg: "positive",
                            modType: "general",
                            value: 1,
                            tooltip: "<h1>Potency</h1><p>By circumstance or advantage, you have <strong>Potency</strong> in this action, increasing your <strong class='gold-bright'>Effect</strong> by one level.</p>"
                        }
                    },
                    negative: {
                        Potency: {
                            name: "Potency",
                            category: RollModCategory.effect,
                            status: RollModStatus.Hidden,
                            posNeg: "negative",
                            modType: "general",
                            value: 1,
                            tooltip: "<h1 class='red-bright'>Potency</h1><p>By circumstance or advantage, <strong class='red-bright'>@OPPOSITION_NAME@</strong> has <strong>Potency</strong> against you, reducing your <strong class='red-bright'>Effect</strong> by one level."
                        }
                    }
                },
                [RollModCategory.result]: { positive: {}, negative: {} },
                [RollModCategory.after]: { positive: {}, negative: {} }
            },
            rollPositionInitial: Position.risky,
            rollEffectInitial: Effect.standard,
            rollPosEffectTrade: false,
            rollFactors: {
                [Factor.tier]: { name: "Tier", cssClasses: "roll-factor roll-factor-tier", value: 0, max: 0, isActive: false, isDominant: false, highFavorsPC: true }
            },
            isGMReady: false,
            GMBoosts: {},
            GMOppBoosts: {},
            docSelections: {
                [RollModCategory.roll]: {
                    Assist: false,
                    Group_1: false,
                    Group_2: false,
                    Group_3: false,
                    Group_4: false,
                    Group_5: false,
                    Group_6: false
                },
                [RollModCategory.position]: {
                    Setup: false
                },
                [RollModCategory.effect]: {
                    Setup: false
                }
            }
        };
    }
    static async RenderRollCollab({ userID, rollID }) {
        const user = game.users.get(userID);
        if (!user) {
            return;
        }
        BladesRollCollabSheet.Current[rollID] = new BladesRollCollabSheet(user, rollID);
        BladesRollCollabSheet.Current[rollID].render(true);
    }
    static async CloseRollCollab(rollID) {
        eLog.checkLog3("rollCollab", "CloseRollCollab()", { rollID });
        await BladesRollCollabSheet.Current[rollID]?.close({ rollID });
        delete BladesRollCollabSheet.Current[rollID];
    }
    static async NewRoll(config) {

        const user = game.users.get(config.userID ?? game.user._id);
        if (!(user instanceof User)) {
            eLog.error("rollCollab", `[NewRoll()] Can't Find User '${config.userID}'`, config);
            return;
        }
        await user.unsetFlag(C.SYSTEM_ID, "rollCollab");
        const flagUpdateData = { ...BladesRollCollabSheet.DefaultFlagData };
        flagUpdateData.rollType = config.rollType;
        if (!(flagUpdateData.rollType in RollType)) {
            eLog.error("rollCollab", `[RenderRollCollab()] Invalid rollType: ${flagUpdateData.rollType}`, config);
            return;
        }
        const rollPrimary = config.rollPrimary ?? user.character;
        if (!(rollPrimary instanceof BladesActor || rollPrimary instanceof BladesItem)) {
            eLog.error("rollCollab", "[RenderRollCollab()] Invalid rollPrimary", { rollPrimary, config });
            return;
        }
        flagUpdateData.rollPrimaryID = rollPrimary.id;
        flagUpdateData.rollPrimaryType = rollPrimary instanceof BladesActor ? "Actor" : "Item";
        if (U.isInt(config.rollTrait)) {
            flagUpdateData.rollTrait = config.rollTrait;
        }
        else if (!config.rollTrait) {
            eLog.error("rollCollab", "[RenderRollCollab()] No RollTrait in Config", config);
            return;
        }
        else {
            switch (flagUpdateData.rollType) {
                case RollType.Action: {
                    if (!(U.lCase(config.rollTrait) in { ...Action, ...Factor })) {
                        eLog.error("rollCollab", `[RenderRollCollab()] Bad RollTrait for Action Roll: ${config.rollTrait}`, config);
                        return;
                    }
                    flagUpdateData.rollTrait = U.lCase(config.rollTrait);
                    break;
                }
                case RollType.Downtime: {
                    if (!(U.lCase(config.rollTrait) in { ...Action, ...Factor })) {
                        eLog.error("rollCollab", `[RenderRollCollab()] Bad RollTrait for Downtime Roll: ${config.rollTrait}`, config);
                        return;
                    }
                    flagUpdateData.rollTrait = U.lCase(config.rollTrait);
                    break;
                }
                case RollType.Fortune: {
                    if (!(U.lCase(config.rollTrait) in { ...Action, ...Attribute, ...Factor })) {
                        eLog.error("rollCollab", `[RenderRollCollab()] Bad RollTrait for Fortune Roll: ${config.rollTrait}`, config);
                        return;
                    }
                    flagUpdateData.rollTrait = U.lCase(config.rollTrait);
                    break;
                }
                case RollType.Resistance: {
                    if (!(U.lCase(config.rollTrait) in Attribute)) {
                        eLog.error("rollCollab", `[RenderRollCollab()] Bad RollTrait for Resistance Roll: ${config.rollTrait}`, config);
                        return;
                    }
                    break;
                }
            }
            flagUpdateData.rollTrait = U.lCase(config.rollTrait);
        }
        await user.setFlag(C.SYSTEM_ID, "rollCollab", flagUpdateData);
        BladesRollCollabSheet.RenderRollCollab({ userID: user._id, rollID: flagUpdateData.rollID });
        socketlib.system.executeForAllGMs("renderRollCollab", { userID: user._id, rollID: flagUpdateData.rollID });
    }
    rollID;
    constructor(user, rollID) {
        super(user);
        this.rollID = rollID;
    }
    get rData() {
        if (!this.document.getFlag(C.SYSTEM_ID, "rollCollab")) {
            eLog.error("rollCollab", "[get flags()] No RollCollab Flags Found on User", { user: this.document, flags: this.document.flags });
            return null;
        }
        return this.document.flags["eunos-blades"].rollCollab;
    }
    get rollPrimary() {
        if (!this.rData) {
            return undefined;
        }
        return this.rData.rollPrimaryType === "Actor"
            ? game.actors.get(this.rData.rollPrimaryID)
            : game.items.get(this.rData.rollPrimaryID);
    }
    getData() {
        const context = super.getData();
        const { rData } = this;
        if (!rData) {
            return context;
        }
        const sheetData = {
            cssClass: "roll-collab",
            editable: this.options.editable,
            isGM: game.eunoblades.Tracker.system.is_spoofing_player ? false : game.user.isGM,
            rollPositions: Object.values(Position),
            rollEffects: Object.values(Effect),
            ...rData
        };
        if (!this.rollPrimary) {
            eLog.error("rollCollab", `[getData()] No '${sheetData.rollPrimaryType}' Found with ID '${sheetData.rollPrimaryID}'`, { user: this.document, rData: rData });
            return null;
        }
        sheetData.system = this.rollPrimary.system;
        sheetData.rollPrimary = this.rollPrimary;
        if (sheetData.rollOppositionID) {
            const rollOpposition = BladesActor.Get(sheetData.rollOppositionID) ?? BladesItem.Get(sheetData.rollOppositionID);
            if (!rollOpposition) {
                throw new Error(`Cannot find Roll Opposition with ID '${sheetData.rollOppositionID}'`);
            }
            sheetData.rollOpposition = rollOpposition;
        }
        if (BladesActor.IsType(this.rollPrimary, BladesActorType.pc) && isAction(sheetData.rollTrait)) {
            const { rollPrimary } = this;
            sheetData.rollTraitData = {
                name: sheetData.rollTrait,
                value: rollPrimary.actions[sheetData.rollTrait],
                max: rollPrimary.actions[sheetData.rollTrait]
            };
            sheetData.rollTraitOptions = Object.values(Action)
                .map((action) => ({
                name: U.uCase(action),
                value: action
            }));
        }
        else if (BladesActor.IsType(this.rollPrimary, BladesActorType.pc) && isAttribute(sheetData.rollTrait)) {
            const { rollPrimary } = this;
            sheetData.rollTraitData = {
                name: sheetData.rollTrait,
                value: rollPrimary.attributes[sheetData.rollTrait],
                max: rollPrimary.attributes[sheetData.rollTrait]
            };
            sheetData.rollTraitOptions = Object.values(Attribute)
                .map((attribute) => ({
                name: U.uCase(attribute),
                value: attribute
            }));
        }
        else if (sheetData.rollTrait === "tier") {
            const { rollPrimary } = this;
            sheetData.rollTraitData = {
                name: "Tier",
                value: rollPrimary.getTierTotal(),
                max: rollPrimary.getTierTotal()
            };
            sheetData.rollTraitOptions = false;
        }
        else if (U.isInt(sheetData.rollTrait)) {
            sheetData.rollTraitData = {
                name: `+${sheetData.rollTrait}`,
                value: sheetData.rollTrait,
                max: sheetData.rollTrait
            };
            sheetData.rollTraitOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
                .map((num) => ({
                name: `+${num}`,
                value: num
            }));
        }
        sheetData.rollMods = mergeObject(sheetData.rollSource.rollMods, sheetData.rollMods);
        function isModAutoActive(mod) {
            const autoRollTypes = mod.autoRollTypes ?? [];
            const autoRollTraits = mod.autoRollTraits ?? [];
            return autoRollTypes.length + autoRollTraits.length > 0
                && (autoRollTypes.length === 0 || autoRollTypes.includes(sheetData.rollType))
                && (autoRollTraits.length === 0 || autoRollTraits.includes(sheetData.rollTrait));
        }
        function isModConditional(mod) {
            const conditionalRollTypes = mod.conditionalRollTypes ?? [];
            const conditionalRollTraits = mod.conditionalRollTraits ?? [];
            return conditionalRollTypes.length + conditionalRollTraits.length > 0
                && (conditionalRollTypes.length === 0 || conditionalRollTypes.includes(sheetData.rollType))
                && (conditionalRollTraits.length === 0 || conditionalRollTraits.includes(sheetData.rollTrait));
        }
        Object.values(RollModCategory).forEach((modCat) => {
            Object.values(sheetData.rollMods[modCat]?.positive ?? {})
                .filter((mod) => mod.isConditional && mod.status === RollModStatus.ToggledOff)
                .forEach((mod) => {
                if (isModAutoActive(mod)) {
                    sheetData.rollMods[modCat].positive[mod.name].status = RollModStatus.ForcedOn;
                }
                else if (!isModConditional(mod)) {
                    sheetData.rollMods[modCat].positive[mod.name].status = RollModStatus.Hidden;
                }
            });
        });
        function getModsDelta(cat) {
            const activePosMods = Object.values(sheetData.rollMods?.[cat]?.positive ?? {})
                .filter((mod) => [RollModStatus.ToggledOn, RollModStatus.ForcedOn].includes(mod.status));
            const posModVals = activePosMods.map((mod) => mod.value);
            const posModSum = U.sum(posModVals);
            const activeNegMods = Object.values(sheetData.rollMods?.[cat]?.negative ?? {})
                .filter((mod) => [RollModStatus.ToggledOn, RollModStatus.ForcedOn].includes(mod.status));
            const negModVals = activeNegMods.map((mod) => mod.value);
            const negModSum = U.sum(negModVals);
            eLog.checkLog3("rollMods", `getModsDelta(${cat})`, { activePosMods, posModVals, posModSum, activeNegMods, negModVals, negModSum, returnVal: U.sum(Object.values(sheetData.rollMods?.[cat]?.positive ?? {})
                    .filter((mod) => [RollModStatus.ToggledOn, RollModStatus.ForcedOn].includes(mod.status))
                    .map((mod) => mod.value))
                    - U.sum(Object.values(sheetData.rollMods?.[cat]?.negative ?? {})
                        .filter((mod) => [RollModStatus.ToggledOn, RollModStatus.ForcedOn].includes(mod.status))
                        .map((mod) => mod.value)) });
            return U.sum(Object.values(sheetData.rollMods?.[cat]?.positive ?? {})
                .filter((mod) => [RollModStatus.ToggledOn, RollModStatus.ForcedOn].includes(mod.status))
                .map((mod) => mod.value))
                - U.sum(Object.values(sheetData.rollMods?.[cat]?.negative ?? {})
                    .filter((mod) => [RollModStatus.ToggledOn, RollModStatus.ForcedOn].includes(mod.status))
                    .map((mod) => mod.value));
        }
        sheetData.diceTotal = Math.max(0, (sheetData.rollTraitData?.value ?? 0)
            + getModsDelta(RollModCategory.roll)
            + (sheetData.GMBoosts.Dice ?? 0));
        let finalPosIndex = Object.values(Position).indexOf(sheetData.rollPositionInitial ?? Position.risky)
            + getModsDelta(RollModCategory.position);
        let finalEffectIndex = Object.values(Effect).indexOf(sheetData.rollEffectInitial ?? Effect.standard)
            + getModsDelta(RollModCategory.effect);
        sheetData.canTradePosition = sheetData.rollPosEffectTrade === "position"
            || (sheetData.rollPosEffectTrade === false && (finalPosIndex > 0 && finalEffectIndex < 4));
        sheetData.canTradeEffect = sheetData.rollPosEffectTrade === "effect"
            || (sheetData.rollPosEffectTrade === false && (finalPosIndex < 2 && finalEffectIndex > 1));
        if (sheetData.rollPosEffectTrade === "position") {
            finalPosIndex++;
            finalEffectIndex--;
        }
        if (sheetData.rollPosEffectTrade === "effect") {
            finalPosIndex--;
            finalEffectIndex++;
        }
        sheetData.rollPositionFinal = Object.values(Position)[U.clampNum(finalPosIndex, [0, 2])];
        sheetData.rollEffectFinal = Object.values(Effect)[U.clampNum(finalEffectIndex, [0, 4])];
        sheetData.isAffectingResult = getModsDelta(RollModCategory.result) !== 0
            || (sheetData.GMBoosts.Result ?? 0) !== 0
            || Object.values({
                ...(sheetData.rollMods.result?.negative ?? {}),
                ...(sheetData.rollMods.result?.positive ?? {})
            }).filter((mod) => sheetData.isGM || mod.status !== RollModStatus.Hidden).length > 0;
        if (sheetData.isAffectingResult) {
            sheetData.rollResultFinal = getModsDelta(RollModCategory.result)
                + (sheetData.GMBoosts.Result ?? 0);
        }
        if (sheetData.rollFactors) {
            for (const [factorName] of Object.entries(sheetData.rollFactors)) {
                if (sheetData.GMBoosts && factorName in sheetData.GMBoosts) {
                    sheetData.rollFactors[factorName].value += sheetData.GMBoosts[factorName] ?? 0;
                }
                if ([Factor.tier, Factor.quality].includes(factorName)) {
                    sheetData.rollFactors[factorName].display = U.romanizeNum(sheetData.rollFactors[factorName].value);
                }
            }
        }
        if (sheetData.rollOpposition) {
            sheetData.rollOppositionFactors = sheetData.rollOpposition.rollFactors;
            if (sheetData.rollOppositionFactors) {
                for (const [factorName] of Object.entries(sheetData.rollOppositionFactors)) {
                    if (sheetData.GMOppBoosts && factorName in sheetData.GMOppBoosts) {
                        sheetData.rollOppositionFactors[factorName].value += sheetData.GMOppBoosts[factorName] ?? 0;
                    }
                    if ([Factor.tier, Factor.quality].includes(factorName)) {
                        sheetData.rollOppositionFactors[factorName].display = U.romanizeNum(sheetData.rollOppositionFactors[factorName].value);
                    }
                }
            }
        }
        sheetData.hasInactiveConditionals = {
            [RollModCategory.roll]: Object.values(sheetData.rollMods?.roll?.positive ?? {})
                .filter((mod) => mod.isConditional && mod.status === RollModStatus.ToggledOff)
                .length > 0,
            [RollModCategory.position]: Object.values(sheetData.rollMods?.position?.positive ?? {})
                .filter((mod) => mod.isConditional && mod.status === RollModStatus.ToggledOff)
                .length > 0,
            [RollModCategory.effect]: Object.values(sheetData.rollMods?.effect?.positive ?? {})
                .filter((mod) => mod.isConditional && mod.status === RollModStatus.ToggledOff)
                .length > 0,
            [RollModCategory.result]: Object.values(sheetData.rollMods?.result?.positive ?? {})
                .filter((mod) => mod.isConditional && mod.status === RollModStatus.ToggledOff)
                .length > 0,
            [RollModCategory.after]: Object.values(sheetData.rollMods?.after?.positive ?? {})
                .filter((mod) => mod.isConditional && mod.status === RollModStatus.ToggledOff)
                .length > 0
        };
        const { success, partial, fail } = C.DiceOdds[sheetData.diceTotal ?? 0];
        sheetData.oddsGradient = [
            "linear-gradient(to right",
            `var(--blades-black-dark) ${fail}%`,
            `var(--blades-grey) ${fail + partial}%`,
            `var(--blades-white-bright) ${fail + partial + success}%`,
            "var(--blades-gold-bright))"
        ].join(", ");
        const stressMods = Object.values(sheetData.rollMods ?? {})
            .map((catModData) => Object.values(catModData)
            .map((posNegModData) => Object.values(posNegModData)))
            .flat(3)
            .filter((modData) => [RollModStatus.ForcedOn, RollModStatus.ToggledOn].includes(modData.status) && (modData.stressCost ?? 0) > 0);
        const stressTotal = U.sum(stressMods.map((mod) => mod.stressCost));
        if (stressTotal > 0) {
            sheetData.stressData = {
                cost: stressTotal,
                tooltip: [
                    `<h1>Stress Cost: <span class='red-bright shadowed'>${stressTotal}</span></h1><ul>`,
                    ...stressMods
                        .map((mod) => `<li><strong class='shadowed'>${mod.name} (${mod.category}):</strong> <strong class='shadowed red-bright'>${mod.stressCost}</strong> Stress.</li>`),
                    "</ul>"
                ].join("")
            };
        }
        eLog.checkLog3("getData", "RollCollab.getData()", { ...context, ...sheetData });
        return {
            ...context,
            ...sheetData
        };
    }
    _toggleRollModClick(target, status) {
        switch (status) {
            case RollModStatus.Hidden: {
                return this.document.setFlag(C.SYSTEM_ID, target, RollModStatus.ForcedOn);
            }
            case RollModStatus.ToggledOff: {
                return this.document.setFlag(C.SYSTEM_ID, target, RollModStatus.ToggledOn);
            }
            case RollModStatus.ToggledOn: {
                return this.document.setFlag(C.SYSTEM_ID, target, RollModStatus.ToggledOff);
            }
            case RollModStatus.ForcedOn: {
                if (game.user.isGM) {
                    return this.document.setFlag(C.SYSTEM_ID, target, RollModStatus.ToggledOff);
                }
                return undefined;
            }
        }
        return undefined;
    }
    async _toggleRollModContext(target, status) {
        if (!game.user.isGM) {
            return undefined;
        }
        switch (status) {
            case RollModStatus.Hidden: {
                return this.document.setFlag(C.SYSTEM_ID, target, RollModStatus.ToggledOff);
            }
            case RollModStatus.ToggledOff: {
                return this.document.setFlag(C.SYSTEM_ID, target, RollModStatus.Hidden);
            }
            case RollModStatus.ToggledOn: {
                return this.document.setFlag(C.SYSTEM_ID, target, RollModStatus.Hidden);
            }
            case RollModStatus.ForcedOn: {
                if (game.user.isGM) {
                    return this.document.setFlag(C.SYSTEM_ID, target, RollModStatus.Hidden);
                }
                return undefined;
            }
        }
        return undefined;
    }
    activateListeners(html) {
        super.activateListeners(html);
        ApplyTooltipListeners(html);
        html.find("[data-action='toggle']").on({
            click: async (event) => {
                event.preventDefault();
                const elem$ = $(event.currentTarget);
                const status = elem$.data("status");
                const cat = elem$.data("cat");
                const posNeg = elem$.data("posNeg");
                const name = elem$.data("name");
                await this._toggleRollModClick(`rollCollab.rollMods.${cat}.${posNeg}.${name}.status`, status);
                const bargainStatus = this.document.getFlag(C.SYSTEM_ID, "rollCollab.rollMods.roll.positive.Bargain.status");
                const pushStatus = this.document.getFlag(C.SYSTEM_ID, "rollCollab.rollMods.roll.positive.Push.status");
                if (name === "Bargain") {
                    if ([RollModStatus.ForcedOn, RollModStatus.ToggledOn].includes(bargainStatus ?? "") && pushStatus !== RollModStatus.Hidden) {
                        await this.document.setFlag(C.SYSTEM_ID, "rollCollab.rollMods.roll.positive.Push.status", RollModStatus.Hidden);
                    }
                    else if ([RollModStatus.ToggledOff, RollModStatus.Hidden].includes(bargainStatus ?? "") && pushStatus === RollModStatus.Hidden) {
                        await this.document.setFlag(C.SYSTEM_ID, "rollCollab.rollMods.roll.positive.Push.status", RollModStatus.ToggledOff);
                    }
                }
            },
            contextmenu: (event) => {
                event.preventDefault();
                const elem$ = $(event.currentTarget);
                const status = elem$.data("status");
                const cat = elem$.data("cat");
                const posNeg = elem$.data("posNeg");
                const name = elem$.data("name");
                this._toggleRollModContext(`rollCollab.rollMods.${cat}.${posNeg}.${name}.status`, status);
            }
        });
        html.find("[data-action='tradePosition']").on({
            click: (event) => {
                const curVal = `${$(event.currentTarget).data("value")}`;
                if (curVal === "false") {
                    this.document.setFlag(C.SYSTEM_ID, "rollCollab.rollPosEffectTrade", "effect");
                }
                else {
                    this.document.setFlag(C.SYSTEM_ID, "rollCollab.rollPosEffectTrade", false);
                }
            }
        });
        html.find("[data-action='tradeEffect']").on({
            click: (event) => {
                const curVal = `${$(event.currentTarget).data("value")}`;
                if (curVal === "false") {
                    this.document.setFlag(C.SYSTEM_ID, "rollCollab.rollPosEffectTrade", "position");
                }
                else {
                    this.document.setFlag(C.SYSTEM_ID, "rollCollab.rollPosEffectTrade", false);
                }
            }
        });
    }
    async _onSubmit(event, { updateData } = {}) {
        return super._onSubmit(event, { updateData, preventClose: true })
            .then((returnVal) => { this.render(); return returnVal; });
    }
    async close(options = {}) {
        eLog.checkLog3("rollCollab", "RollCollab.close()", { options });
        if (options.rollID) {
            return super.close({});
        }
        this.document.setFlag(C.SYSTEM_ID, "rollCollab", null);
        socketlib.system.executeForEveryone("closeRollCollab", this.rollID);
        return undefined;
    }
    render(force, options) {
        if (!this.document.getFlag(C.SYSTEM_ID, "rollCollab")) {
            return this;
        }
        return super.render(force, options);
    }
}
export default BladesRollCollabSheet;
//# sourceMappingURL=blades-roll-collab-sheet.js.map
