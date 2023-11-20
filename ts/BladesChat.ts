// #region IMPORTS ~
import {ApplyTooltipAnimations, ApplyConsequenceAnimations} from "./core/gsap";

import BladesRoll from "./BladesRoll";
// #endregion

class BladesChat extends ChatMessage {

  static Initialize() {
    Hooks.on("renderChatMessage", (_msg: ChatMessage, html: JQuery<HTMLElement>) => {
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

  static async ConstructRollOutput(rollInst: BladesRoll): Promise<BladesChat> {

    const messageData = {
      speaker: rollInst.getSpeaker(BladesChat.getSpeaker()),
      content: await rollInst.getResultHTML()
    };

    const chatMessage = await BladesChat.create(messageData, {}) as BladesChat;
    chatMessage.rollInst = rollInst;
    return chatMessage;
  }

  _rollInst?: BladesRoll;

  get rollInst(): BladesRoll|undefined { return this._rollInst; }

  set rollInst(rollInst: BladesRoll|undefined) { this._rollInst = rollInst; }

  async reRender(html: string) {
    this.update({content: html});
  }
}


interface BladesChat {

}

export default BladesChat;
