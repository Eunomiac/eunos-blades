/* eslint-disable @typescript-eslint/no-unused-vars */
// #region IMPORTS ~
import {ApplyTooltipAnimations, ApplyConsequenceAnimations} from "../core/gsap";

import BladesRoll from "./BladesRoll";
import BladesConsequence from "./BladesConsequence";
import {ChatMessageData} from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/module.mjs";
import {ChatMessageDataConstructorData} from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/chatMessageData";
// #endregion

namespace BladesChat {
  export interface Data extends ChatMessageDataConstructorData {
    csqData?: Record<string, BladesRoll.ConsequenceData>
   }
}

class BladesChat extends ChatMessage {

  // static override defineSchema() {
  //   return Object.assign(super.defineSchema(), {
  //     csqData: new foundry.data.fields.ObjectField()
  //   });
  // }

  static Initialize() {
    // let lastMessageID: string|false = Array.from(game.messages).pop()?.id ?? "";
    Hooks.on("renderChatMessage", (_msg: ChatMessage, html: JQuery<HTMLElement>) => {
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

  static async ConstructRollOutput(rollInst: BladesRoll): Promise<BladesChat> {

    const messageData: BladesChat.Data = {
      speaker: rollInst.getSpeaker(BladesChat.getSpeaker()),
      content: await rollInst.getResultHTML(""),
      type: CONST.CHAT_MESSAGE_TYPES.ROLL,
      csqData: rollInst.csqData
    };

    const chatMessage = await BladesChat.create(messageData, {}) as BladesChat;
    await chatMessage.update({content: await rollInst.getResultHTML(chatMessage.id as string)});
    chatMessage.rollInst = rollInst;
    return chatMessage;
  }


  _rollInst?: BladesRoll;

  get rollInst(): BladesRoll|undefined { return this._rollInst; }

  set rollInst(rollInst: BladesRoll|undefined) { this._rollInst = rollInst; }

  get elem(): HTMLElement|undefined { return $("#chat-log").find(`.chat-message[data-message-id="${this.id}"]`)[0]; }

  get isRollResult() { return this.type === CONST.CHAT_MESSAGE_TYPES.ROLL; }

  constructor(data?: BladesChat.Data) {
    super(data);
  }

  async reRender(html: string) {
    this.update({content: html});
  }

  override async render(force: boolean) {
    await super.render(force);
    if (!this.elem) { eLog.error("BladesChat", `No BladesChat.elem found for id ${this.id}.`); return; }
    const elem$ = $(this.elem);
    ApplyTooltipAnimations(elem$);
    ApplyConsequenceAnimations(elem$);
    BladesConsequence.ApplyChatListeners(elem$);
    elem$.addClass("display-ok");
  }
}


interface BladesChat {
  content?: string;

}

export default BladesChat;
