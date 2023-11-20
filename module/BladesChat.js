// #region IMPORTS ~
import { ApplyTooltipAnimations, ApplyConsequenceAnimations } from "./core/gsap.js";
/*~ @@DOUBLE-BLANK@@ ~*/
import BladesRoll from "./BladesRoll.js";
// #endregion
/*~ @@DOUBLE-BLANK@@ ~*/
class BladesChat extends ChatMessage {
    /*~ @@DOUBLE-BLANK@@ ~*/
    static Initialize() {
        Hooks.on("renderChatMessage", (_msg, html) => {
            ApplyTooltipAnimations(html);
            ApplyConsequenceAnimations(html);
            BladesRoll.ApplyChatListeners(html);
        });
        return loadTemplates([
            "systems/eunos-blades/templates/chat/roll-result-action-roll.hbs",
            "systems/eunos-blades/templates/chat/roll-result-resistance-roll.hbs",
            "systems/eunos-blades/templates/chat/roll-result-fortune-roll.hbs",
            "systems/eunos-blades/templates/chat/roll-result-indulgevice-roll.hbs"
        ]);
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    static async ConstructRollOutput(rollInst) {
        /*~ @@DOUBLE-BLANK@@ ~*/
        const messageData = {
            speaker: rollInst.getSpeaker(BladesChat.getSpeaker()),
            content: await rollInst.getResultHTML()
        };
        /*~ @@DOUBLE-BLANK@@ ~*/
        const chatMessage = await BladesChat.create(messageData, {});
        chatMessage.rollInst = rollInst;
        return chatMessage;
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    _rollInst;
    /*~ @@DOUBLE-BLANK@@ ~*/
    get rollInst() { return this._rollInst; }
    /*~ @@DOUBLE-BLANK@@ ~*/
    set rollInst(rollInst) { this._rollInst = rollInst; }
    /*~ @@DOUBLE-BLANK@@ ~*/
    async reRender(html) {
        this.update({ content: html });
    }
}
/*~ @@DOUBLE-BLANK@@ ~*/
export default BladesChat;
/*~ @@DOUBLE-BLANK@@ ~*/ 
