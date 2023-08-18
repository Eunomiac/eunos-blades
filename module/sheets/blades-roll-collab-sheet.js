/* ****▌███████████████████████████████████████████████████████████████████████████▐**** *\
|*     ▌████░░░░░░░░░░░ Euno's Blades in the Dark for Foundry VTT ░░░░░░░░░░░░░████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░ by Eunomiac ░░░░░░░░░░░░░██████████████████▐     *|
|*     ▌████████████████████████████  License █ v0.1.0 ████████████████████████████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░░░░░░  ░░░░░░░░░░░░░░░░░░███████████████████▐     *|
\* ****▌███████████████████████████████████████████████████████████████████████████▐**** */

import U from "../core/utilities.js";
import { BladesActorType, Action, Attribute, Position, Effect, Factor } from "../core/constants.js";
import BladesActor from "../blades-actor.js";
import BladesItem from "../blades-item.js";
var BladesRollType;
(function (BladesRollType) {
    BladesRollType["Action"] = "Action";
    BladesRollType["Downtime"] = "Downtime";
    BladesRollType["Resistance"] = "Resistance";
    BladesRollType["Fortune"] = "Fortune";
})(BladesRollType || (BladesRollType = {}));
const config = { rollType: "Action", rollTrait: "Consort" };
var RollModStatus;
(function (RollModStatus) {
    RollModStatus["Hidden"] = "Hidden";
    RollModStatus["ToggledOff"] = "ToggledOff";
    RollModStatus["ToggledOn"] = "ToggledOn";
    RollModStatus["ForcedOff"] = "ForcedOff";
    RollModStatus["ForcedOn"] = "ForcedOn";
})(RollModStatus || (RollModStatus = {}));
function isAction(trait) {
    return Boolean(trait && typeof trait === "string" && trait in Action);
}
function isAttribute(trait) {
    return Boolean(trait && typeof trait === "string" && trait in Attribute);
}
function isTier(trait) { return trait === "Tier"; }
function isNumber(trait) { return U.isInt(trait); }
class BladesRollCollabSheet extends DocumentSheet {
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            classes: ["eunos-blades", "sheet", "roll-collab"],
            template: "systems/eunos-blades/templates/roll-collab.hbs",
            submitOnChange: true,
            width: 500,
            height: 500
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
    static async RenderRollCollab(config) {
        const user = game.users.get(config.userID);
        BladesRollCollabSheet.Current[user.flags.eunoblades.rollCollab.rollID] = new BladesRollCollabSheet(user);
        BladesRollCollabSheet.Current[user.flags.eunoblades.rollCollab.rollID].render(true);
    }
    static CloseRollCollab(rollID) {
        BladesRollCollabSheet.Current[rollID]?.close({}, true);
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
        const flagUpdateData = {};
        flagUpdateData.rollID = randomID();
        flagUpdateData.rollType = config.rollType;
        if (!(flagUpdateData.rollType in BladesRollType)) {
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
        switch (flagUpdateData.rollType) {
            case BladesRollType.Action: {
                if ((!config.rollTrait && !U.isInt(config.rollTrait))
                    || !(U.lCase(config.rollTrait) in Action || U.lCase(config.rollTrait !== "tier"))) {
                    eLog.error("rollCollab", `[RenderRollCollab()] Bad RollTrait for Action Roll: ${config.rollTrait}`, config);
                    return;
                }
                flagUpdateData.rollTrait = U.isInt(config.rollTrait) ? config.rollTrait : U.lCase(config.rollTrait);
                break;
            }
            case BladesRollType.Downtime: {
                if ((!config.rollTrait && config.rollTrait !== 0)
                    || !(U.lCase(config.rollTrait) in Action || U.lCase(config.rollTrait !== "tier"))) {
                    eLog.error("rollCollab", `[RenderRollCollab()] Bad RollTrait for Downtime Roll: ${config.rollTrait}`, config);
                    return;
                }
                flagUpdateData.rollTrait = U.isInt(config.rollTrait) ? config.rollTrait : U.lCase(config.rollTrait);
                break;
            }
            case BladesRollType.Fortune: {
                config.rollTrait ??= 0;
                if (!U.isInt(config.rollTrait)) {
                    eLog.error("rollCollab", `[RenderRollCollab()] Bad RollTrait for Fortune Roll: ${config.rollTrait}`, config);
                    return;
                }
                break;
            }
            case BladesRollType.Resistance: {
                if (!config.rollTrait || !(U.lCase(config.rollTrait) in Attribute)) {
                    eLog.error("rollCollab", `[RenderRollCollab()] Bad RollTrait for Resistance Roll: ${config.rollTrait}`, config);
                    return;
                }
                break;
            }
        }
                flagUpdateData.rollMods = {
            roll: {
                positive: {
                    Push: RollModStatus.ToggledOff,
                    Assist: RollModStatus.ForcedOn
                },
                negative: {
                    Wounded: RollModStatus.ForcedOn
                }
            },
            position: {
                positive: {
                    Setup: RollModStatus.ForcedOn
                },
                negative: {}
            },
            effect: {
                positive: {
                    Push: RollModStatus.ToggledOn,
                    Setup: RollModStatus.ForcedOn,
                    Potency: RollModStatus.ForcedOn
                },
                negative: {
                    Wounded: RollModStatus.ForcedOn,
                    Opposition: RollModStatus.ForcedOn
                }
            },
            result: { positive: {}, negative: {} }
        };
        flagUpdateData.rollPositionInitial = Position.desperate;
        flagUpdateData.rollEffectInitial = Effect.great;
        flagUpdateData.rollPosEffectTrade = "effect";
        flagUpdateData.rollFactors = {
            [Factor.Tier]: {
                name: "Tier",
                value: 2,
                max: 2,
                isActive: false,
                isDominant: false,
                highFavorsPC: true
            },
            [Factor.Quality]: {
                name: "Quality",
                value: 3,
                max: 3,
                isActive: true,
                isDominant: false,
                highFavorsPC: true
            },
            [Factor.Scale]: {
                name: "Scale",
                value: 2,
                max: 2,
                isActive: true,
                isDominant: false,
                highFavorsPC: false
            },
            [Factor.Magnitude]: {
                name: "Force",
                value: 2,
                max: 2,
                isActive: false,
                isDominant: false,
                highFavorsPC: true
            }
        };
        flagUpdateData.rollOppositionID = undefined;
        flagUpdateData.isGMReady = false;
        flagUpdateData.GMBoosts = {
            [Factor.Quality]: -1,
            Position: 1
        };
        await user.update({
            "flags.eunoblades.rollCollab": flagUpdateData
        });
        BladesRollCollabSheet.RenderRollCollab({ ...config, userID: user._id });
        socketlib.system.executeForAllGMs("renderRollCollab", { ...config, userID: user._id });
    }

    get rData() {
        if (!this.document.flags.eunoblades?.rollCollab) {
            eLog.error("rollCollab", "[get flags()] No RollCollab Flags Found on User", { user: this.document, flags: this.document.flags });
            return null;
        }
        return this.document.flags.eunoblades.rollCollab;
    }
    get rollSource() {
        return this.rData.rollSourceType === "Actor"
            ? game.actors.get(this.rData.rollSourceID)
            : game.items.get(this.rData.rollSourceID);
    }
    getData() {
        const context = super.getData();
        const sheetData = {
            cssClass: "roll-collab",
            editable: this.options.editable,
            isGM: game.eunoblades.Tracker.system.is_spoofing_player ? false : game.user.isGM,
            ...this.rData
        };
        if (!this.rollSource) {
            eLog.error("rollCollab", `[getData()] No '${this.rData.rollSourceType}' Found with ID '${this.rData.rollSourceID}'`, { user: this.document, rData: this.rData });
            return null;
        }
        sheetData.system = this.rollSource.system;
        if (BladesActor.IsType(this.rollSource, BladesActorType.pc) && isAction(this.rData.rollTrait)) {
            const { rollSource } = this;
            sheetData.rollTraitData = {
                name: this.rData.rollTrait,
                value: rollSource.actions[this.rData.rollTrait],
                max: rollSource.actions[this.rData.rollTrait]
            };
            sheetData.rollTraitOptions = Object.values(Action)
                .map((action) => ({
                name: `${action} ${"●".repeat(rollSource.actions[action])}`,
                value: action
            }));
        }
        else if (BladesActor.IsType(this.rollSource, BladesActorType.pc) && isAttribute(this.rData.rollTrait)) {
            const { rollSource } = this;
            sheetData.rollTraitData = {
                name: this.rData.rollTrait,
                value: this.rollSource.attributes[this.rData.rollTrait],
                max: this.rollSource.attributes[this.rData.rollTrait]
            };
            sheetData.rollTraitOptions = Object.values(Attribute)
                .map((attribute) => ({
                name: `${attribute} ${"●".repeat(rollSource.attributes[attribute])}`,
                value: attribute
            }));
        }
        else if (this.rData.rollTrait === "tier") {
            sheetData.rollTraitData = {
                name: "Tier",
                value: this.rollSource.getTierTotal(),
                max: this.rollSource.getTierTotal()
            };
            sheetData.rollTraitOptions = false;
        }
        else if (U.isInt(this.rData.rollTrait)) {
            sheetData.rollTraitData = {
                name: `+${this.rData.rollTrait}`,
                value: this.rData.rollTrait,
                max: this.rData.rollTrait
            };
            sheetData.rollTraitOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
                .map((num) => ({
                name: `+${num}`,
                value: num
            }));
        }
                
        sheetData.diceTotal = 4;
        sheetData.rollFactorData = [
            { name: Factor.Quality, value: U.romanizeNum(2), cssClasses: "factor-gold factor-main" },
            { name: Factor.Scale, value: `${2}`, cssClasses: "factor-gold" }
        ];
        sheetData.rollOpposition = undefined;
        sheetData.rollPositionInitial = Position.desperate;
        sheetData.rollPositionFinal = Position.risky;
        sheetData.rollEffectFinal = Effect.superior;
        sheetData.isAffectingResult = true;
        sheetData.rollResultFinal = 1;
        sheetData.rollOddsData = [
            { odds: 15, result: "Failure", cssClasses: "odds-fail", tooltip: "<p>A failure!</p>" },
            { odds: 50, result: "Partial", cssClasses: "odds-partial", tooltip: "<p>A partial!</p>" },
            { odds: 30, result: "Success", cssClasses: "odds-success", tooltip: "<p>A success!</p>" },
            { odds: 5, result: "Critical", cssClasses: "odds-critical", tooltip: "<p>A critical!</p>" }
        ];
        sheetData.stressData = { cost: 4, tooltip: "<ul><li><strong>2</strong> Stress from Pushing for +1d</li><li><strong>2</strong> Stress from Pushing for Effect</li></ul>" };
        eLog.checkLog3("getData", "RollCollab.getData()", { ...context, ...sheetData });
        return {
            ...context,
            ...sheetData
        };
    }
    activateListeners(html) {
        super.activateListeners(html);
    }
    async _onSubmit(event, { updateData } = {}) {
        return super._onSubmit(event, { updateData, preventClose: true })
            .then((returnVal) => { this.render(); return returnVal; });
    }
    async close(options, isFromSocket = false) {
        if (!isFromSocket) {
            await socketlib.system.executeForEveryone("closeRollCollab", this.rData.rollID);
            this.document.update({ "flags.eunoblades.-=rollCollab": null });
        }
    }
}
export default BladesRollCollabSheet;