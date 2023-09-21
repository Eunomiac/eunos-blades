/* ****▌███████████████████████████████████████████████████████████████████████████▐**** *\
|*     ▌████░░░░░░░░░░░ Euno's Blades in the Dark for Foundry VTT ░░░░░░░░░░░░░████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░ by Eunomiac ░░░░░░░░░░░░░██████████████████▐     *|
|*     ▌████████████████████████████  License █ v0.1.0 ████████████████████████████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░░░░░░  ░░░░░░░░░░░░░░░░░░███████████████████▐     *|
\* ****▌███████████████████████████████████████████████████████████████████████████▐**** */

import U from "../core/utilities.js";
import C, { BladesActorType, RollType, RollModStatus, RollModCategory, Action, Attribute, Position, Effect, Factor, Harm } from "../core/constants.js";
import BladesActor from "../blades-actor.js";
import BladesItem from "../blades-item.js";
import { ApplyTooltipListeners } from "../core/gsap.js";
function isAction(trait) {
    return Boolean(trait && typeof trait === "string" && trait in Action);
}
function isAttribute(trait) {
    return Boolean(trait && typeof trait === "string" && trait in Attribute);
}
function isTier(trait) { return U.lCase(trait) === "tier"; }
function isNumber(trait) { return U.isInt(trait); }
class BladesRollCollabSheet extends DocumentSheet {
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            classes: ["eunos-blades", "sheet", "roll-collab"],
            template: `systems/eunos-blades/templates/roll-collab${game.user.isGM ? "-gm" : ""}.hbs`,
            submitOnChange: true,
            width: 500
        });
    }
    static Initialize() {
        return loadTemplates([
            "systems/eunos-blades/templates/roll-collab-gm.hbs",
            "systems/eunos-blades/templates/roll-collab.hbs"
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
            rollSourceType: "Actor",
            rollSourceID: "",
            rollTrait: Factor.tier,
            rollMods: {
                [RollModCategory.roll]: {
                    positive: {
                        Push: {
                            status: RollModStatus.ToggledOff,
                            value: 1,
                            tooltip: "<p>Take <strong class='shadowed red-bright'>2 Stress</strong> to add <strong class='shadowed'>1 die</strong> to your pool. <em>(You cannot also accept a <strong class='shadowed'>Devil's Bargain</strong> to increase your dice pool: It's one or the other.)</em></p>"
                        },
                        Bargain: {
                            status: RollModStatus.ForcedOff,
                            value: 1,
                            tooltip: "<p>Accept a <strong class='shadowed red-bright'>Devil's Bargain</strong> from the GM to add <strong class='shadowed'>1 die</strong> to your pool <em>(You cannot also <strong class='shadowed'>Push</strong> to increase your dice pool: It's one or the other. You can, however, <strong class='shadowed'>Push</strong> to increase your <strong class='shadowed'>Effect</strong>.)</em></p>"
                        },
                        Assist: {
                            status: RollModStatus.Hidden,
                            value: 1,
                            sideString: "",
                            tooltip: "<p>Another character is <strong class='shadowed'>Assisting</strong> your efforts, adding <strong class='shadowed'>1 die</strong> to your pool. <em>(It costs them <span class='shadowed red-bright'>1 Stress</span> to do so.)</em></p>"
                        }
                    },
                    negative: {}
                },
                [RollModCategory.position]: {
                    positive: {
                        Setup: {
                            status: RollModStatus.Hidden,
                            value: 1,
                            sideString: undefined,
                            tooltip: "<p>Another character has set you up for success, increasing your <strong class='shadowed'>Position</strong> by one level.</p>"
                        }
                    },
                    negative: {}
                },
                [RollModCategory.effect]: {
                    positive: {
                        Push: {
                            status: RollModStatus.ToggledOff,
                            value: 1,
                            tooltip: "<p>Take <strong class='shadowed red-bright'>2 Stress</strong> to increase your <strong class='shadowed'>Effect</strong> by one level. <em>(You can both <strong class='shadowed'>Push for Effect</strong> and <strong class='shadowed'>Push for +1d</strong> if you like, for a total cost of <strong class='shadowed red-bright'>4 Stress</strong>.)</em></p>"
                        },
                        Setup: {
                            status: RollModStatus.Hidden,
                            value: 1,
                            sideString: undefined,
                            tooltip: "<p>Another character has set you up for success, increasing your <strong class='shadowed'>Effect</strong> by one level.</p>"
                        },
                        Potency: {
                            status: RollModStatus.Hidden,
                            value: 1,
                            tooltip: ""
                        }
                    },
                    negative: {}
                },
                [RollModCategory.result]: { positive: {}, negative: {} },
                [RollModCategory.after]: { positive: {}, negative: {} }
            },
            rollPositionInitial: Position.risky,
            rollEffectInitial: Effect.standard,
            rollPosEffectTrade: false,
            rollFactors: {
                [Factor.tier]: { name: "Tier", value: 0, max: 0, isActive: false, isDominant: false, highFavorsPC: true },
                [Factor.quality]: { name: "Quality", value: 0, max: 0, isActive: false, isDominant: false, highFavorsPC: true },
                [Factor.force]: { name: "Force", value: 0, max: 0, isActive: false, isDominant: false, highFavorsPC: true },
                [Factor.scale]: { name: "Scale", value: 0, max: 0, isActive: false, isDominant: false, highFavorsPC: true },
                [Factor.area]: { name: "Area", value: 0, max: 0, isActive: false, isDominant: false, highFavorsPC: true },
                [Factor.duration]: { name: "Duration", value: 0, max: 0, isActive: false, isDominant: false, highFavorsPC: true },
                [Factor.range]: { name: "Range", value: 0, max: 0, isActive: false, isDominant: false, highFavorsPC: true },
                [Factor.magnitude]: { name: "Magnitude", value: 0, max: 0, isActive: false, isDominant: false, highFavorsPC: true }
            },
            isGMReady: false,
            GMBoosts: {
                Dice: 0,
                [Factor.tier]: 0,
                [Factor.quality]: 0,
                [Factor.force]: 0,
                [Factor.scale]: 0,
                [Factor.area]: 0,
                [Factor.duration]: 0,
                [Factor.range]: 0,
                [Factor.magnitude]: 0,
                Result: 0
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
        if (game.user.isGM) {
            eLog.error("rollCollab", "GM Cannot Use New Roll!");
            return;
        }
        const user = game.users.get(config.userID ?? game.user._id);
        if (!(user instanceof User)) {
            eLog.error("rollCollab", `[NewRoll()] Can't Find User '${config.userID}'`, config);
            return;
        }
        const flagUpdateData = BladesRollCollabSheet.DefaultFlagData;
        flagUpdateData.rollType = config.rollType;
        if (!(flagUpdateData.rollType in RollType)) {
            eLog.error("rollCollab", `[RenderRollCollab()] Invalid rollType: ${flagUpdateData.rollType}`, config);
            return;
        }
        const rollSource = config.rollSource ?? user.character;
        if (!(rollSource instanceof BladesActor || rollSource instanceof BladesItem)) {
            eLog.error("rollCollab", "[RenderRollCollab()] Invalid rollSource", { rollSource, config });
            return;
        }
        flagUpdateData.rollSourceID = rollSource.id;
        flagUpdateData.rollSourceType = rollSource instanceof BladesActor ? "Actor" : "Item";
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

        flagUpdateData.rollMods = {
            [RollModCategory.roll]: {
                positive: {
                    "Push": {
                        status: RollModStatus.ToggledOff,
                        value: 1,
                        tooltip: "<p>Take <strong class='shadowed red-bright'>2 Stress</strong> to add <strong class='shadowed'>1 die</strong> to your pool.</p><p><em>(You cannot also accept a <strong class='shadowed'>Devil's Bargain</strong> to increase your dice pool: It's one or the other.)</em></p>"
                    },
                    "Bargain": {
                        status: RollModStatus.Hidden,
                        value: 1,
                        tooltip: "<p>Accept a <strong class='shadowed red-bright'>Devil's Bargain</strong> from the GM to add <strong class='shadowed'>1 die</strong> to your pool.</p><p><em>(You cannot also <strong class='shadowed'>Push</strong> to increase your dice pool: It's one or the other. You can, however, <strong class='shadowed'>Push</strong> to increase your <strong class='shadowed'>Effect</strong>.)</em></p>"
                    },
                    "Assist": {
                        status: RollModStatus.ForcedOn,
                        value: 1,
                        sideString: "Ollie",
                        tooltip: "<p><strong class='shadowed gold-bright'>Ollie</strong> is <strong class='shadowed'>Assisting</strong> your efforts, adding <strong class='shadowed'>1 die</strong> to your pool. <em>(It costs them <strong class='shadowed red-bright'>1 Stress</strong> to do so.)</em></p>"
                    },
                    "Mastermind": {
                        status: RollModStatus.ToggledOff,
                        value: 1,
                        isAbility: true,
                        tooltip: "<p>You may expend your <strong>special armor</strong> to protect a teammate, or to <strong>push yourself</strong> when you <strong>gather information</strong> or work on a <strong>long-term project</strong>.</p>"
                    },
                    "Trust In Me": {
                        status: RollModStatus.ToggledOn,
                        value: 1,
                        isAbility: true,
                        tooltip: "<p>You may expend your <strong>special armor</strong> to protect a teammate, or to <strong>push yourself</strong> when you <strong>gather information</strong> or work on a <strong>long-term project</strong>.</p>"
                    },
                    "Forged in the Fire": {
                        status: RollModStatus.ToggledOff,
                        value: 1,
                        isAbility: true,
                        tooltip: "<p>You may expend your <strong>special armor</strong> to protect a teammate, or to <strong>push yourself</strong> when you <strong>gather information</strong> or work on a <strong>long-term project</strong>.</p>"
                    },
                    "A Little Something on the Side": {
                        status: RollModStatus.ToggledOff,
                        value: 1,
                        isAbility: true,
                        tooltip: "<p>You may expend your <strong>special armor</strong> to protect a teammate, or to <strong>push yourself</strong> when you <strong>gather information</strong> or work on a <strong>long-term project</strong>.</p>"
                    },
                    "Ghost Hunter (Arrow-Swift)": {
                        status: RollModStatus.ToggledOff,
                        value: 1,
                        isAbility: true,
                        tooltip: "<p>You may expend your <strong>special armor</strong> to protect a teammate, or to <strong>push yourself</strong> when you <strong>gather information</strong> or work on a <strong>long-term project</strong>.</p>"
                    }
                },
                negative: {
                    [Harm.Impaired]: {
                        status: RollModStatus.ForcedOn,
                        value: 1,
                        tooltip: `<p><strong class='shadowed uppercase red-bright'>${Harm.Impaired}:</strong> Your injuries reduce your <strong class='shadowed'>dice pool</strong> by one.</p>`
                    }
                }
            },
            [RollModCategory.position]: {
                positive: {
                    Setup: {
                        status: RollModStatus.ForcedOn,
                        value: 1,
                        sideString: "Jax",
                        tooltip: "<p><strong class='shadowed gold-bright'>Jax</strong> has set you up for success with a preceding action, increasing your <strong class='shadowed'>Position</strong> by one level.</p>"
                    }
                },
                negative: {}
            },
            [RollModCategory.effect]: {
                positive: {
                    "Push": {
                        status: RollModStatus.ToggledOn,
                        value: 1,
                        tooltip: "<p>Take <strong class='shadowed red-bright'>2 Stress</strong> to increase your <strong class='shadowed'>Effect</strong> by one level.</p><p><em>(You can both <strong class='shadowed'>Push for Effect</strong> and <strong class='shadowed'>Push for +1d</strong>, for a total cost of <strong class='shadowed red-bright'>4 Stress</strong>.)</em></p>"
                    },
                    "Setup": {
                        status: RollModStatus.ForcedOn,
                        value: 1,
                        sideString: "High-Flyer",
                        tooltip: "<p><strong class='shadowed gold-bright'>High-Flyer</strong> has set you up for success with a preceding action, increasing your <strong class='shadowed'>Effect</strong> by one level.</p>"
                    },
                    "Potency": {
                        status: RollModStatus.Hidden,
                        value: 1,
                        tooltip: "<p>Circumstances in your favor make this action especially <strong class='shadowed'>Potent</strong>, increasing your <strong class='shadowed'>Effect</strong> by one level.</p>"
                    },
                    "Cloak & Dagger": {
                        status: RollModStatus.ToggledOff,
                        value: 1,
                        isAbility: true,
                        tooltip: "<p>You may expend your <strong>special armor</strong> to protect a teammate, or to <strong>push yourself</strong> when you <strong>gather information</strong> or work on a <strong>long-term project</strong>.</p>"
                    }
                },
                negative: {
                    [Harm.Impaired]: {
                        status: RollModStatus.ForcedOn,
                        value: 1,
                        tooltip: `<p><strong class='shadowed uppercase red-bright'>${Harm.Impaired}:</strong> Your injuries reduce your <strong class='shadowed'>Effect</strong> by one level.</p>`
                    },
                    Opposition: {
                        status: RollModStatus.ForcedOn,
                        value: 1,
                        tooltip: "<p>The following <strong class='shadowed'>Factors</strong> combine to reduce your <strong class='shadowed'>Effect</strong> by one level:</p><ul><li>Inferior Quality</li><li>Detrimental Scale</li></ul>"
                    }
                }
            },
            [RollModCategory.result]: {
                positive: {
                    Mastermind: {
                        status: RollModStatus.ToggledOff,
                        value: 1,
                        isAbility: true,
                        tooltip: "<p>You may expend your <strong>special armor</strong> to protect a teammate, or to <strong>push yourself</strong> when you <strong>gather information</strong> or work on a <strong>long-term project</strong>.</p>"
                    }
                }, negative: {}
            },
            [RollModCategory.after]: {
                positive: {
                    Mesmerism: {
                        status: RollModStatus.ToggledOff,
                        value: 1,
                        isAbility: true,
                        tooltip: "<p>You may expend your <strong>special armor</strong> to protect a teammate, or to <strong>push yourself</strong> when you <strong>gather information</strong> or work on a <strong>long-term project</strong>.</p>"
                    }
                },
                negative: {}
            }
        };
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
    get rollSource() {
        if (!this.rData) {
            return undefined;
        }
        return this.rData.rollSourceType === "Actor"
            ? game.actors.get(this.rData.rollSourceID)
            : game.items.get(this.rData.rollSourceID);
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
            ...rData
        };
        if (!this.rollSource) {
            eLog.error("rollCollab", `[getData()] No '${rData.rollSourceType}' Found with ID '${rData.rollSourceID}'`, { user: this.document, rData: rData });
            return null;
        }
        sheetData.system = this.rollSource.system;
        sheetData.rollSource = this.rollSource;
        if (BladesActor.IsType(this.rollSource, BladesActorType.pc) && isAction(rData.rollTrait)) {
            const { rollSource } = this;
            sheetData.rollTraitData = {
                name: rData.rollTrait,
                value: rollSource.actions[rData.rollTrait],
                max: rollSource.actions[rData.rollTrait]
            };
            sheetData.rollTraitOptions = Object.values(Action)
                .map((action) => ({
                name: U.uCase(action),
                value: action
            }));
        }
        else if (BladesActor.IsType(this.rollSource, BladesActorType.pc) && isAttribute(rData.rollTrait)) {
            const { rollSource } = this;
            sheetData.rollTraitData = {
                name: rData.rollTrait,
                value: rollSource.attributes[rData.rollTrait],
                max: rollSource.attributes[rData.rollTrait]
            };
            sheetData.rollTraitOptions = Object.values(Attribute)
                .map((attribute) => ({
                name: U.uCase(attribute),
                value: attribute
            }));
        }
        else if (rData.rollTrait === "tier") {
            const { rollSource } = this;
            sheetData.rollTraitData = {
                name: "Tier",
                value: rollSource.getTierTotal(),
                max: rollSource.getTierTotal()
            };
            sheetData.rollTraitOptions = false;
        }
        else if (U.isInt(rData.rollTrait)) {
            sheetData.rollTraitData = {
                name: `+${rData.rollTrait}`,
                value: rData.rollTrait,
                max: rData.rollTrait
            };
            sheetData.rollTraitOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
                .map((num) => ({
                name: `+${num}`,
                value: num
            }));
        }

        sheetData.rollFactorData = [
            { name: Factor.quality, value: U.romanizeNum(2), cssClasses: "factor-gold factor-main" },
            { name: Factor.scale, value: `${2}`, cssClasses: "factor-gold" }
        ];
        sheetData.rollOpposition = undefined;
        sheetData.stressData = { cost: 4, tooltip: "<ul><li><strong class='shadowed'>2</strong> Stress from Pushing for +1d</li><li><strong class='shadowed'>2</strong> Stress from Pushing for Effect</li></ul>" };
        const getModsDelta = (cat) => {
            const activePosMods = Object.values(sheetData.rollMods?.[cat]?.positive ?? {})
                .filter((mod) => [RollModStatus.ToggledOn, RollModStatus.ForcedOn].includes(mod.status));
            const posModVals = activePosMods.map((mod) => mod.value);
            const posModSum = U.sum(posModVals);
            const activeNegMods = Object.values(sheetData.rollMods?.[cat]?.negative ?? {})
                .filter((mod) => [RollModStatus.ToggledOn, RollModStatus.ForcedOn].includes(mod.status));
            const negModVals = activeNegMods.map((mod) => mod.value);
            const negModSum = U.sum(negModVals);
            eLog.checkLog3("rollMods", `getModsDelta(${cat}`, { activePosMods, posModVals, posModSum, activeNegMods, negModVals, negModSum, returnVal: U.sum(Object.values(sheetData.rollMods?.[cat]?.positive ?? {})
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
        };
        sheetData.diceTotal = Math.max(0, (sheetData.rollTraitData?.value ?? 0)
            + getModsDelta(RollModCategory.roll)
            + (rData.GMBoosts.Dice ?? 0));
        let finalPosIndex = Object.values(Position).indexOf(sheetData.rollPositionInitial ?? Position.risky)
            + getModsDelta(RollModCategory.position);
        let finalEffectIndex = Object.values(Effect).indexOf(sheetData.rollEffectInitial ?? Effect.standard)
            + getModsDelta(RollModCategory.effect);
        const isPosEffectTradeValid = rData.rollPosEffectTrade === "position"
            ? (finalPosIndex < 2 && finalEffectIndex > 0)
            : (rData.rollPosEffectTrade === "effect"
                ? (finalPosIndex > 0 && finalEffectIndex < 4)
                : true);
        if (isPosEffectTradeValid) {
            if (rData.rollPosEffectTrade === "position") {
                finalPosIndex++;
                finalEffectIndex--;
            }
            if (rData.rollPosEffectTrade === "effect") {
                finalPosIndex--;
                finalEffectIndex++;
            }
        }
        sheetData.rollPositionFinal = Object.values(Position)[U.clampNum(finalPosIndex, [0, 2])];
        sheetData.rollEffectFinal = Object.values(Effect)[U.clampNum(finalEffectIndex, [0, 4])];
        sheetData.isAffectingResult = getModsDelta(RollModCategory.result) !== 0
            || (rData.GMBoosts.Result ?? 0) !== 0;
        if (sheetData.isAffectingResult) {
            sheetData.rollResultFinal = getModsDelta(RollModCategory.result)
                + (rData.GMBoosts.Result ?? 0);
        }
        sheetData.hasInactiveAbilities = {
            [RollModCategory.roll]: Object.values(rData.rollMods.roll?.positive ?? {})
                .filter((mod) => mod.isAbility && mod.status === RollModStatus.ToggledOff)
                .length > 0,
            [RollModCategory.position]: Object.values(rData.rollMods.position?.positive ?? {})
                .filter((mod) => mod.isAbility && mod.status === RollModStatus.ToggledOff)
                .length > 0,
            [RollModCategory.effect]: Object.values(rData.rollMods.effect?.positive ?? {})
                .filter((mod) => mod.isAbility && mod.status === RollModStatus.ToggledOff)
                .length > 0,
            [RollModCategory.result]: Object.values(rData.rollMods.result?.positive ?? {})
                .filter((mod) => mod.isAbility && mod.status === RollModStatus.ToggledOff)
                .length > 0,
            [RollModCategory.after]: Object.values(rData.rollMods.after?.positive ?? {})
                .filter((mod) => mod.isAbility && mod.status === RollModStatus.ToggledOff)
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
        
        eLog.checkLog3("getData", "RollCollab.getData()", { ...context, ...sheetData });
        return {
            ...context,
            ...sheetData
        };
    }
    activateListeners(html) {
        super.activateListeners(html);
        ApplyTooltipListeners(html);
        const trade$ = html.find("[data-action='trade']");
        eLog.checkLog3("rollCollab", "Trade$", { trade: trade$ });
        html.find("[data-action='trade']").on({
            click: (event) => {
                const curVal = `${$(event.currentTarget).data("value")}`;
                eLog.checkLog3("rollCollab", "Click Event", { event, curVal });
                if (curVal === "false") {
                    this.document.setFlag(C.SYSTEM_ID, "rollCollab.rollPosEffectTrade", "position");
                }
                else {
                    this.document.setFlag(C.SYSTEM_ID, "rollCollab.rollPosEffectTrade", false);
                }
            },
            contextmenu: (event) => {
                const curVal = `${$(event.currentTarget).data("value")}`;
                eLog.checkLog3("rollCollab", "Context Event", { event, curVal });
                if (curVal === "false") {
                    this.document.setFlag(C.SYSTEM_ID, "rollCollab.rollPosEffectTrade", "effect");
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
