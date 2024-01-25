/* eslint-disable @typescript-eslint/no-unused-vars */
// #region IMPORTS ~
import { ApplyTooltipAnimations, ApplyConsequenceAnimations } from "../core/gsap.js";
import { Position, RollResult } from "../core/constants.js";
import BladesConsequence from "./BladesConsequence.js";
class BladesChat extends ChatMessage {
    // static override defineSchema() {
    //   return Object.assign(super.defineSchema(), {
    //     csqData: new foundry.data.fields.ObjectField()
    //   });
    // }
    static Initialize() {
        // let lastMessageID: string|false = Array.from(game.messages).pop()?.id ?? "";
        Hooks.on("renderChatMessage", (msg, html) => {
            ApplyTooltipAnimations(html);
            if (msg.isRollResult) {
                ApplyConsequenceAnimations(html);
                BladesConsequence.ApplyChatListeners(html);
            }
            html.addClass("display-ok");
            // if (lastMessageID && _msg.id === lastMessageID) {
            //   setTimeout(() => {
            //     $(document).find("#chat .chat-message:not([class*='-roll'])")
            //       .remove();
            //   }, 500);
            //   lastMessageID = false;
            // }
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
            "systems/eunos-blades/templates/chat/components/die.hbs"
        ]);
    }
    static async ConstructRollOutput(rollInst) {
        // Expand rollInst flag data to include results & consequences
        const { flagData, finalPosition, finalEffect, rollResult, rollTraitVerb, rollTraitPastVerb, finalDiceData, resultChatTemplate } = rollInst;
        const rollFlags = {
            template: resultChatTemplate,
            ...flagData,
            finalPosition,
            finalEffect,
            rollResult,
            rollTraitVerb: rollTraitVerb ?? "",
            rollTraitPastVerb: rollTraitPastVerb ?? rollTraitVerb ?? "",
            finalDiceData
        };
        return await BladesChat.create({
            speaker: rollInst.getSpeaker(BladesChat.getSpeaker()),
            content: await renderTemplate(resultChatTemplate, rollFlags),
            type: CONST.CHAT_MESSAGE_TYPES.ROLL,
            flags: rollFlags
        });
    }
    get allRollConsequencesData() {
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
        const { consequenceData } = this.flags;
        if (!consequenceData) {
            return returnData;
        }
        Object.entries(consequenceData)
            .forEach(([position, positionData]) => {
            Object.entries(positionData)
                .forEach(([rollResult, csqData]) => {
                returnData[position][rollResult] = csqData;
            });
        });
        return returnData;
    }
    get rollConsequencesData() {
        if (!this.isRollResult) {
            return [];
        }
        const { finalPosition, rollResult, consequenceData } = this.flags;
        if (typeof rollResult !== "string" || ![RollResult.partial, RollResult.fail].includes(rollResult)) {
            return [];
        }
        const activeConsequences = consequenceData?.[finalPosition]?.[rollResult] ?? {};
        return Object.values(activeConsequences);
    }
    get elem() { return $("#chat-log").find(`.chat-message[data-message-id="${this.id}"]`)[0]; }
    get isRollResult() { return this.type === CONST.CHAT_MESSAGE_TYPES.ROLL; }
    async regenerateFromFlags() {
        await this.update({ content: await renderTemplate(this.flags.template, this.flags) });
    }
    async render(force) {
        await super.render(force);
        if (!this.elem) {
            eLog.error("BladesChat", `No BladesChat.elem found for id ${this.id}.`);
            return;
        }
        const elem$ = $(this.elem);
        ApplyTooltipAnimations(elem$);
        ApplyConsequenceAnimations(elem$);
        BladesConsequence.ApplyChatListeners(elem$);
        elem$.addClass("display-ok");
    }
}
export default BladesChat;
