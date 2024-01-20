/* eslint-disable @typescript-eslint/no-unused-vars */
// #region IMPORTS ~
import { ApplyTooltipAnimations, ApplyConsequenceAnimations } from "../core/gsap.js";
import BladesConsequence from "./BladesConsequence.js";
class BladesChat extends ChatMessage {
    // static override defineSchema() {
    //   return Object.assign(super.defineSchema(), {
    //     csqData: new foundry.data.fields.ObjectField()
    //   });
    // }
    static Initialize() {
        // let lastMessageID: string|false = Array.from(game.messages).pop()?.id ?? "";
        Hooks.on("renderChatMessage", (_msg, html) => {
            ApplyTooltipAnimations(html);
            ApplyConsequenceAnimations(html);
            BladesConsequence.ApplyChatListeners(html);
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
            "systems/eunos-blades/templates/chat/roll-result/resistance.hbs"
        ]);
    }
    static async ConstructRollOutput(rollInst) {
        const messageData = {
            speaker: rollInst.getSpeaker(BladesChat.getSpeaker()),
            content: await rollInst.getResultHTML(""),
            type: CONST.CHAT_MESSAGE_TYPES.ROLL,
            csqData: rollInst.csqData
        };
        const chatMessage = await BladesChat.create(messageData, {});
        await chatMessage.update({ content: await rollInst.getResultHTML(chatMessage.id) });
        chatMessage.rollInst = rollInst;
        return chatMessage;
    }
    _rollInst;
    get rollInst() { return this._rollInst; }
    set rollInst(rollInst) { this._rollInst = rollInst; }
    get elem() { return $("#chat-log").find(`.chat-message[data-message-id="${this.id}"]`)[0]; }
    get isRollResult() { return this.type === CONST.CHAT_MESSAGE_TYPES.ROLL; }
    async reRender(html) {
        this.update({ content: html });
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
