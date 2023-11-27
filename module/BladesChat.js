// #region IMPORTS ~
import { ApplyTooltipAnimations, ApplyConsequenceAnimations } from "./core/gsap.js";
import BladesConsequence from "./sheets/roll/BladesConsequence.js";
// #endregion
class BladesChat extends ChatMessage {
    static Initialize() {
        Hooks.on("renderChatMessage", (_msg, html) => {
            ApplyTooltipAnimations(html);
            ApplyConsequenceAnimations(html);
            BladesConsequence.ApplyChatListeners(html);
            setTimeout(() => { html.addClass("display-ok"); }, 2000);
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
