// #region IMPORTS ~
import { ApplyTooltipAnimations, ApplyConsequenceAnimations } from "../core/gsap.js";
import BladesConsequence from "./BladesConsequence.js";
// #endregion
class BladesChat extends ChatMessage {
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
            "systems/eunos-blades/templates/chat/roll-result-action-roll.hbs",
            "systems/eunos-blades/templates/chat/roll-result-resistance-roll.hbs",
            "systems/eunos-blades/templates/chat/roll-result-fortune-roll.hbs",
            "systems/eunos-blades/templates/chat/roll-result-indulgevice-roll.hbs"
        ]);
    }
    static async ConstructRollOutput(rollInst) {
        const messageData = {
            speaker: rollInst.getSpeaker(BladesChat.getSpeaker()),
            content: await rollInst.getResultHTML("")
        };
        const chatMessage = await BladesChat.create(messageData, {});
        await chatMessage.update({ content: await rollInst.getResultHTML(chatMessage.id) });
        chatMessage.rollInst = rollInst;
        return chatMessage;
    }
    _rollInst;
    get rollInst() { return this._rollInst; }
    set rollInst(rollInst) { this._rollInst = rollInst; }
    async reRender(html) {
        this.update({ content: html });
    }
}
export default BladesChat;
