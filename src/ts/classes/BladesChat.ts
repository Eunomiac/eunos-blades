// #region IMPORTS ~
/* eslint-disable @typescript-eslint/no-unused-vars */
import {ApplyTooltipAnimations} from "../core/gsap";
import C, {RollType, Position, Effect, RollResult} from "../core/constants";
import U from "../core/utilities";

import BladesRoll from "./BladesRoll";
import BladesConsequence from "./BladesConsequence";
import {ChatMessageData} from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/module.mjs";
import {ChatMessageDataConstructorData} from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/chatMessageData";
/* eslint-enable @typescript-eslint/no-unused-vars */
// #endregion

namespace BladesChat {
  export interface Data extends ChatMessageDataConstructorData { }

  export interface Flags {
    template: string,
    rollData?: BladesRoll.Data,
    resistRollData?: BladesRoll.Data
  }
}

class BladesChat extends ChatMessage {

  static Initialize() {

    Hooks.on("renderChatMessage", (msg: BladesChat, html: JQuery<HTMLElement>) => {
      ApplyTooltipAnimations(html);
      const {rollData} = msg.flagData;
      if (rollData) {
        BladesConsequence.ApplyChatListeners(msg);
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

  static IsNewestRollResult(rollInst: BladesRoll): boolean {
    const lastRollResultID = $("#chat-log .chat-message .blades-roll:not(.inline-roll)")
      .last()
      .attr("id") as IDString|undefined;
    return typeof lastRollResultID === "string"
      && lastRollResultID === rollInst.id;
  }

  get flagData() {
    return this.flags["eunos-blades"];
  }

  get rollData() { return this.flagData.rollData; }

  async setFlagVal(scope: KeyOf<BladesChat.Flags>, key: string, val: unknown) {
    return await this.setFlag(C.SYSTEM_ID, `${scope}.${key}`, val);
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
        [Position.controlled] : {
          [RollResult.critical]: {},
          [RollResult.success]:  {},
          [RollResult.partial]:  {},
          [RollResult.fail]:     {}
        },
        [Position.risky] : {
          [RollResult.critical]: {},
          [RollResult.success]:  {},
          [RollResult.partial]:  {},
          [RollResult.fail]:     {}
        },
        [Position.desperate] : {
          [RollResult.critical]: {},
          [RollResult.success]:  {},
          [RollResult.partial]:  {},
          [RollResult.fail]:     {}
        }
      };
    const {consequenceData} = this.flagData.rollData ?? {};
    if (!consequenceData) { return returnData; }

    Object.entries(consequenceData)
      .forEach(([position, positionData]) => {
        Object.entries(positionData)
          .forEach(([rollResult, csqDataSet]) => {
            returnData[position as Position][rollResult as RollResult] = Object.fromEntries(
              Object.entries(csqDataSet)
                .filter(([_id, cData]) => cData.id)
                .map(([id, cData]) => [
                  id,
                  game.eunoblades.Consequences.get(cData.id) ?? new BladesConsequence(cData)
                ])
            );
          });
      });

    return returnData;
  }

  get rollConsequences(): BladesConsequence[] {
    if (!this.parentRoll) { return []; }
    const {rollPositionFinal, rollResult, consequenceData} = this.parentRoll.data;
    if (!rollPositionFinal || !rollResult || !consequenceData) { return []; }
    if (typeof rollResult !== "string" || !([RollResult.partial, RollResult.fail] as RollResult[]).includes(rollResult)) { return []; }

    const activeConsequences = consequenceData
      ?.[rollPositionFinal]
      ?.[rollResult as RollResult.partial | RollResult.fail] ?? {};
    return Object.values(activeConsequences)
      .map((cData) => game.eunoblades.Consequences.get(cData.id) ?? new BladesConsequence(cData));
  }

  get elem$(): JQuery<HTMLElement> {
    return $("#chat-log")
      .find(`.chat-message[data-message-id="${this.id}"]`);
  }
  get elem(): HTMLElement|undefined { return this.elem$[0]; }

  get isRollResult(): boolean { return this.flagData && "rollData" in this.flagData; }

  get parentRoll(): BladesRoll|undefined {
    if (!this.isRollResult) { return undefined; }
    const {rollData} = this.flagData;
    if (!rollData) { return undefined; }
    return game.eunoblades.Rolls.get(rollData.id ?? "") ?? new BladesRoll({
      ...rollData,
      isScopingById : false
    });
  }

  get roll$(): JQuery<HTMLElement>|undefined {
    return this.parentRoll ? this.elem$.find(`#${this.parentRoll.id}`) : undefined;
  }

  async regenerateFromFlags() {
    if (this.isRollResult) {
      await this.update({content: await renderTemplate(this.flagData.template, this)});
    }
  }

  override async render(force: boolean) {
    await super.render(force);
    await this.activateListeners();
  }

  async activateListeners() {
    if (!this.elem$) { eLog.error("BladesChat", `No BladesChat.elem found for id ${this.id}.`); return; }
    ApplyTooltipAnimations(this.elem$);
    BladesConsequence.ApplyChatListeners(this);
    if (this.parentRoll) {
      this.elem$.addClass(`${this.parentRoll.rollType.toLowerCase()}-roll`);

      if (this.parentRoll.rollType === RollType.Action && this.rollConsequences.some((csq) => !csq.isAccepted)) {
        this.elem$.addClass("unresolved-action-roll");
      } else {
        this.elem$.removeClass("unresolved-action-roll");
      }

      if (BladesChat.IsNewestRollResult(this.parentRoll)) {
        $("#chat-log .chat-message").removeClass("active-chat-roll");
        this.elem$.addClass("active-chat-roll");
      } else {
        this.elem$.removeClass("active-chat-roll");
      }
    }
    U.gsap.to(this.elem$, {autoAlpha: 1, duration: 0.15, ease: "none"});
  }
}


interface BladesChat {
  get id(): IDString;
  content?: string;
  flags: {
    "eunos-blades": BladesChat.Flags
  };
}

export default BladesChat;
