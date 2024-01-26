/* eslint-disable @typescript-eslint/no-unused-vars */
// #region IMPORTS ~
import {ApplyTooltipAnimations, ApplyConsequenceAnimations} from "../core/gsap";
import {Position, Effect, RollResult} from "../core/constants";

import BladesRoll from "./BladesRoll";
import BladesConsequence from "./BladesConsequence";
import {ChatMessageData} from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/module.mjs";
import {ChatMessageDataConstructorData} from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/chatMessageData";
// #endregion

namespace BladesChat {
  export interface Data extends ChatMessageDataConstructorData { }

  export interface Flags {
    template: string,
    rollData?: BladesRoll.FlagData
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
    Hooks.on("renderChatMessage", (msg: BladesChat, html: JQuery<HTMLElement>) => {
      ApplyTooltipAnimations(html);
      if (msg.flags.rollData) {
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

  static async ConstructRollOutput(rollInst: BladesRoll): Promise<BladesChat> {
    const template = rollInst.resultChatTemplate;

    const rollFlags = {
      ...rollInst.flagData,
      rollTraitVerb: rollInst.rollTraitVerb ?? "",
      rollTraitPastVerb: rollInst.rollTraitPastVerb ?? rollInst.rollTraitVerb ?? ""
    };

    return await BladesChat.create({
      speaker: rollInst.getSpeaker(BladesChat.getSpeaker()),
      content: await renderTemplate(template, rollFlags),
      type: CONST.CHAT_MESSAGE_TYPES.ROLL,
      flags: {
        template,
        rollData: rollFlags
      }
    }) as BladesChat;
  }

  get allRollConsequences():
    Record<Position,
      Record<RollResult,
        Record<IDString, BladesConsequence>
    >> {
    const returnData:
      Record<Position,
        Record<RollResult,
          Record<IDString, BladesConsequence>
        >
      > = {
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
    const {consequenceData} = this.flags.rollData ?? {};
    if (!consequenceData) { return returnData; }

    Object.entries(consequenceData)
      .forEach(([position, positionData]) => {
        Object.entries(positionData)
          .forEach(([rollResult, csqData]) => {
            returnData[position as Position][rollResult as RollResult] = Object.fromEntries(
              Object.entries(csqData)
                .filter(([id, cData]) => cData.id)
                .map(([id, cData]) => [id, game.eunoblades.Consequences.get(cData.id)] as [IDString, BladesConsequence])
            );
          });
      });

    return returnData;
  }

  get rollConsequences(): BladesConsequence[] {
    if (!this.flags.rollData) { return []; }
    const {finalPosition, rollResult, consequenceData} = this.flags.rollData;
    if (!finalPosition || !rollResult || !consequenceData) { return []; }
    if (typeof rollResult !== "string" || !([RollResult.partial, RollResult.fail] as RollResult[]).includes(rollResult)) { return []; }
    const activeConsequences = consequenceData
      ?.[finalPosition]
      ?.[rollResult as RollResult.partial | RollResult.fail] ?? {};
    return Object.values(activeConsequences)
      .map((cData) => game.eunoblades.Consequences.get(cData.id))
      .filter(Boolean) as BladesConsequence[];
  }

  get elem(): HTMLElement|undefined { return $("#chat-log").find(`.chat-message[data-message-id="${this.id}"]`)[0]; }

  async regenerateFromFlags() {
    await this.update({content: await renderTemplate(this.flags.template, this.flags)});
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
  get id(): IDString;
  content?: string;
  flags: BladesChat.Flags;
}

export default BladesChat;
