/* eslint-disable @typescript-eslint/no-unused-vars */
// #region IMPORTS ~
import { ApplyTooltipAnimations, ApplyConsequenceAnimations } from "../core/gsap.js";
import C, { RollType, Position, RollResult } from "../core/constants.js";
import U from "../core/utilities.js";
import BladesRoll from "./BladesRoll.js";
import BladesConsequence from "./BladesConsequence.js";
class BladesChat extends ChatMessage {
    static Initialize() {
        Hooks.on("renderChatMessage", (msg, html) => {
            ApplyTooltipAnimations(html);
            const { rollData } = msg.flagData;
            if (rollData) {
                ApplyConsequenceAnimations(html);
                BladesConsequence.ApplyChatListeners(html);
            }
            html.addClass("display-ok");
        });
        return loadTemplates([
            "systems/eunos-blades/templates/chat/roll-result/action.hbs",
            "systems/eunos-blades/templates/chat/roll-result/action-clock.hbs",
            "systems/eunos-blades/templates/chat/roll-result/action-acquireasset.hbs",
            "systems/eunos-blades/templates/chat/roll-result/action-reduceheat.hbs",
            "systems/eunos-blades/templates/chat/roll-result/action-clock-recover.hbs",
            "systems/eunos-blades/templates/chat/roll-result/action-gatherinfo.hbs",
            "systems/eunos-blades/templates/chat/roll-result/fortune.hbs",
            "systems/eunos-blades/templates/chat/roll-result/fortune-clock.hbs",
            "systems/eunos-blades/templates/chat/roll-result/fortune-gatherinfo.hbs",
            "systems/eunos-blades/templates/chat/roll-result/fortune-incarceration.hbs",
            "systems/eunos-blades/templates/chat/roll-result/fortune-engagement.hbs",
            "systems/eunos-blades/templates/chat/roll-result/indulgevice.hbs",
            "systems/eunos-blades/templates/chat/roll-result/resistance.hbs",
            "systems/eunos-blades/templates/chat/components/inline-resistance.hbs",
            "systems/eunos-blades/templates/chat/components/die.hbs"
        ]);
    }
    // static async ConstructRollOutput(rollInst: BladesRoll): Promise<BladesChat> {
    //   const rollData = {
    //     ...rollInst.data,
    //     rollTraitVerb: rollInst.rollTraitVerb ?? "",
    //     rollTraitPastVerb: rollInst.rollTraitPastVerb ?? rollInst.rollTraitVerb ?? ""
    //   };
    //   return await BladesChat.create({
    //     speaker: rollInst.getSpeaker(BladesChat.getSpeaker()),
    //     content: await renderTemplate(rollInst.template, rollData),
    //     type: CONST.CHAT_MESSAGE_TYPES.ROLL,
    //     flags: {
    //       "eunos-blades": {
    //         template: rollInst.template,
    //         rollData
    //       }
    //     }
    //   }) as BladesChat;
    // }
    static IsNewestRollResult(rollInst) {
        const lastRollResultID = $("#chat-log .chat-message .blades-roll:not(.inline-roll)")
            .last()
            .attr("id");
        return typeof lastRollResultID === "string"
            && lastRollResultID === rollInst.id;
    }
    get flagData() {
        return this.flags["eunos-blades"];
    }
    get rollData() { return this.flagData.rollData; }
    async setFlagVal(scope, key, val) {
        return await this.setFlag(C.SYSTEM_ID, `${scope}.${key}`, val);
    }
    get allRollConsequences() {
        const returnData = {
            [Position.controlled]: {
                [RollResult.critical]: {},
                [RollResult.success]: {},
                [RollResult.partial]: {},
                [RollResult.fail]: {}
            },
            [Position.risky]: {
                [RollResult.critical]: {},
                [RollResult.success]: {},
                [RollResult.partial]: {},
                [RollResult.fail]: {}
            },
            [Position.desperate]: {
                [RollResult.critical]: {},
                [RollResult.success]: {},
                [RollResult.partial]: {},
                [RollResult.fail]: {}
            }
        };
        const { consequenceData } = this.flagData.rollData ?? {};
        if (!consequenceData) {
            return returnData;
        }
        Object.entries(consequenceData)
            .forEach(([position, positionData]) => {
            Object.entries(positionData)
                .forEach(([rollResult, csqDataSet]) => {
                returnData[position][rollResult] = Object.fromEntries(Object.entries(csqDataSet)
                    .filter(([id, cData]) => cData.id)
                    .map(([id, cData]) => [
                    id,
                    game.eunoblades.Consequences.get(cData.id) ?? new BladesConsequence(cData)
                ]));
            });
        });
        return returnData;
    }
    get rollConsequences() {
        if (!this.parentRoll) {
            return [];
        }
        const { rollPositionFinal, rollResult, consequenceData } = this.parentRoll.data;
        if (!rollPositionFinal || !rollResult || !consequenceData) {
            return [];
        }
        if (typeof rollResult !== "string" || ![RollResult.partial, RollResult.fail].includes(rollResult)) {
            return [];
        }
        const activeConsequences = consequenceData?.[rollPositionFinal]?.[rollResult] ?? {};
        return Object.values(activeConsequences)
            .map((cData) => game.eunoblades.Consequences.get(cData.id) ?? new BladesConsequence(cData));
    }
    get elem$() {
        return $("#chat-log")
            .find(`.chat-message[data-message-id="${this.id}"]`);
    }
    get elem() { return this.elem$[0]; }
    get isRollResult() { return "rollData" in this.flagData; }
    get parentRoll() {
        if (!this.isRollResult) {
            return undefined;
        }
        const { rollData } = this.flagData;
        if (!rollData) {
            return undefined;
        }
        return game.eunoblades.Rolls.get(rollData.id ?? "") ?? new BladesRoll({
            ...rollData,
            isScopingById: false
        });
    }
    get roll$() {
        return this.parentRoll ? this.elem$.find(`#${this.parentRoll.id}`) : undefined;
    }
    async regenerateFromFlags() {
        if (this.isRollResult) {
            await this.update({ content: await renderTemplate(this.flagData.template, this) });
        }
    }
    async render(force) {
        await super.render(force);
        await this.activateListeners();
    }
    async activateListeners() {
        if (!this.elem$) {
            eLog.error("BladesChat", `No BladesChat.elem found for id ${this.id}.`);
            return;
        }
        ApplyTooltipAnimations(this.elem$);
        ApplyConsequenceAnimations(this.elem$);
        BladesConsequence.ApplyChatListeners(this.elem$);
        if (this.parentRoll) {
            this.elem$.addClass(`${this.parentRoll.rollType.toLowerCase()}-roll`);
            if (this.parentRoll.rollType === RollType.Action && this.rollConsequences.some((csq) => !csq.isAccepted)) {
                this.elem$.addClass("unresolved-action-roll");
            }
            else {
                this.elem$.removeClass("unresolved-action-roll");
            }
            if (BladesChat.IsNewestRollResult(this.parentRoll)) {
                $("#chat-log .chat-message").removeClass("active-chat-roll");
                this.elem$.addClass("active-chat-roll");
            }
            else {
                this.elem$.removeClass("active-chat-roll");
            }
        }
        U.gsap.to(this.elem$, { autoAlpha: 1, duration: 0.15, ease: "none" });
    }
}
export default BladesChat;
