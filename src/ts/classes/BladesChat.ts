// #region IMPORTS ~
/* eslint-disable @typescript-eslint/no-unused-vars */
import {ApplyTooltipAnimations} from "../core/gsap";
import C, {RollType, Position, RollResult} from "../core/constants";
import U from "../core/utilities";

import {BladesActor} from "../documents/BladesActorProxy";
import BladesRoll from "./BladesRoll";
import BladesConsequence from "./BladesConsequence";
import {ChatMessageDataConstructorData} from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/chatMessageData";
/* eslint-enable @typescript-eslint/no-unused-vars */
// #endregion

enum BladesChatType {
  Roll = "Roll",
  Chat = "Chat",
  Whisper = "Whisper"
}

namespace BladesChat {
  export interface Data extends ChatMessageDataConstructorData {
    bladesRoll?: BladesRoll
  }

  export interface Flags {
    template: string,
    rollData?: BladesRoll.Data,
    resistRollData?: BladesRoll.Data
  }

  export interface Context extends Data {
    speakerName?: string,
    speakerPortrait?: string,
    blockClasses?: string
  }
}

class BladesChat extends ChatMessage {

  static Initialize() {

    Hooks.on("renderChatMessage", (msg: BladesChat, html: JQuery) => {
      ApplyTooltipAnimations(html);
      if (msg.isBladesRoll) {
        html.addClass("blades-chat-message");
        html.addClass("blades-roll-message");
        BladesConsequence.ApplyChatListeners(msg);
      }
    });

    return loadTemplates([
      "systems/eunos-blades/templates/chat/blades-message.hbs",

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

  static get template() {return "systems/eunos-blades/templates/chat/blades-message.hbs";}

  static override async create(data: BladesChat.Data, options: DocumentModificationContext = {}) {
    if (data.bladesRoll) {
      ({data, options} = await BladesChat.ConstructBladesRollData(
        data as BladesChat.Data & {bladesRoll: BladesRoll},
        options
      ));
    } else {
      ({data, options} = await BladesChat.ConstructBladesChatMessageData(
        data,
        options
      ));
    }
    return super.create<typeof BladesChat>(data, options) as Promise<BladesChat | undefined>;
  }

  static async ConstructBladesRollData(data: BladesChat.Data & {bladesRoll: BladesRoll}, options: DocumentModificationContext = {}) {
    const {bladesRoll, ...baseChatData} = data;
    const msgData = {
      speaker: bladesRoll.getSpeaker(BladesChat.getSpeaker()),
      content: await renderTemplate(bladesRoll.chatTemplate, bladesRoll.data),
      type:    CONST.CHAT_MESSAGE_TYPES.ROLL,
      flags:   {
        "eunos-blades": {
          template: bladesRoll.chatTemplate,
          rollData: bladesRoll.data
        }
      }
    };
    return {
      data: {
        ...baseChatData,
        ...msgData
      }, options
    };
  }

  static async ConstructBladesChatMessageData(
    data: BladesChat.Data,
    options: DocumentModificationContext = {}
  ) {

    function getUser(cData: BladesChat.Data): User | undefined {
      if (typeof cData.user === "string") {
        return game.users.get(cData.user);
      } else if (cData.user instanceof User) {
        return cData.user;
      }
      return undefined;
    }

    const context: BladesChat.Context = {
      ...data
    };
    const blockClasses: string[] = [];
    const user: User | undefined = getUser(data);

    if (data.type === CONST.CHAT_MESSAGE_TYPES.OOC) {
      blockClasses.push("blades-ooc-message");
      if (user) {
        context.speakerName = user.name ?? undefined;
        if (user.isGM) {
          blockClasses.push("blades-gm-message");
          context.speakerPortrait = C.GM_PORTRAIT;
        } else if (user.character) {
          context.speakerPortrait = user.character.img;
        }
      }
    } else {
      blockClasses.push("blades-ic-message");
      let speakingChar: BladesActor | undefined;
      if (data.speaker?.actor) {
        if (typeof data.speaker.actor === "string") {
          speakingChar = game.actors.get(data.speaker.actor);
        } else if (data.speaker.actor instanceof BladesActor) {
          speakingChar = data.speaker.actor;
        }
      }
      if (!speakingChar) {
        if (user?.isGM) {
          blockClasses.push("blades-gm-message");
          context.speakerName = "The Gamemaster";
          context.speakerPortrait = C.GM_PORTRAIT;
        } else if (user?.character) {
          speakingChar = user.character;
        }
      }
      if (speakingChar && !context.speakerPortrait) {
        context.speakerName = speakingChar.name;
        context.speakerPortrait = speakingChar.img;
      }
    }

    context.blockClasses = blockClasses.join(" ");

    data.content = await renderTemplate(BladesChat.template, context);

    return {data, options};
  }

  static IsNewestRollResult(rollInst: BladesRoll): boolean {
    const lastRollResultID = $("#chat-log .chat-message .blades-roll:not(.inline-roll)")
      .last()
      .attr("id") as IDString | undefined;
    return typeof lastRollResultID === "string"
      && lastRollResultID === rollInst.id;
  }

  get whisperTargets(): User[] {
    return this.whisper.map((userID: IDString) => game.users.get(userID)).filter(Boolean) as User[];
  }

  get isWhisper() {return this.type === CONST.CHAT_MESSAGE_TYPES.WHISPER;}
  get isWhisperToGM() {return this.whisperTargets.some((user) => user.isGM);}
  get isWhisperFromGM() {return this.isWhisper && this.user?.isGM;}

  get isBladesRoll(): boolean {return this.flagData && "rollData" in this.flagData;}
  get isOtherRoll() {return !this.isBladesRoll && this.type === CONST.CHAT_MESSAGE_TYPES.ROLL;}
  get isEmote() {return this.type === CONST.CHAT_MESSAGE_TYPES.EMOTE;}
  get isOOC() {return this.type === CONST.CHAT_MESSAGE_TYPES.OOC;}
  get isIC() {return this.type === CONST.CHAT_MESSAGE_TYPES.IC;}


  get flagData() {
    return this.flags?.["eunos-blades"] ?? {};
  }

  get rollData() {return this.flagData.rollData;}

  get parentRoll(): BladesRoll | undefined {
    if (!this.isBladesRoll) {return undefined;}
    const {rollData} = this.flagData;
    if (!rollData) {return undefined;}
    return game.eunoblades.Rolls.get(rollData.id ?? "") ?? new BladesRoll({
      ...rollData,
      isScopingById: false
    });
  }

  async setFlagVal(scope: KeyOf<BladesChat.Flags>, key: string, val: unknown) {
    return this.setFlag(C.SYSTEM_ID, `${scope}.${key}`, val);
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
        [RollResult.success]:  {},
        [RollResult.partial]:  {},
        [RollResult.fail]:     {}
      },
      [Position.risky]: {
        [RollResult.critical]: {},
        [RollResult.success]:  {},
        [RollResult.partial]:  {},
        [RollResult.fail]:     {}
      },
      [Position.desperate]: {
        [RollResult.critical]: {},
        [RollResult.success]:  {},
        [RollResult.partial]:  {},
        [RollResult.fail]:     {}
      }
    };
    const {consequenceData} = this.flagData.rollData ?? {};
    if (!consequenceData) {return returnData;}

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
    if (!this.parentRoll) {return [];}
    const {rollPositionFinal, rollResult, consequenceData} = this.parentRoll.data;
    if (!rollPositionFinal || !rollResult || !consequenceData) {return [];}
    if (typeof rollResult !== "string" || !([RollResult.partial, RollResult.fail] as RollResult[]).includes(rollResult)) {return [];}

    const activeConsequences = consequenceData
      ?.[rollPositionFinal]
      ?.[rollResult as RollResult.partial | RollResult.fail] ?? {};
    return Object.values(activeConsequences)
      .map((cData) => game.eunoblades.Consequences.get(cData.id) ?? new BladesConsequence(cData));
  }

  get elem$(): JQuery {
    return $("#chat-log")
      .find(`.chat-message[data-message-id="${this.id}"]`);
  }
  get elem(): HTMLElement | undefined {return this.elem$[0];}

  get roll$(): JQuery | undefined {
    return this.parentRoll ? this.elem$.find(`#${this.parentRoll.id}`) : undefined;
  }

  async regenerateFromFlags() {
    if (this.isBladesRoll) {
      await this.update({content: await renderTemplate(this.flagData.template, this)});
    }
  }

  override render(force: boolean): Promise<void> | void {
    super.render(force);
    return this.activateListeners();
  }

  async activateListeners() {
    if (!this.elem$) {eLog.error("BladesChat", `No BladesChat.elem found for id ${this.id}.`); return;}
    ApplyTooltipAnimations(this.elem$);
    BladesConsequence.ApplyChatListeners(this);
    if (this.isBladesRoll) {
      const {parentRoll} = this;
      if (!parentRoll) {throw new Error(`BladesChat.activateListeners: No parentRoll found for id ${this.id}.`);}
      this.elem$.addClass(`${parentRoll.rollType.toLowerCase()}-roll`);

      if (parentRoll.rollType === RollType.Action && this.rollConsequences.some((csq) => !csq.isAccepted)) {
        this.elem$.addClass("unresolved-action-roll");
      } else {
        this.elem$.removeClass("unresolved-action-roll");
      }

      if (BladesChat.IsNewestRollResult(parentRoll)) {
        $("#chat-log .chat-message").removeClass("active-chat-roll");
        this.elem$.addClass("active-chat-roll");
      } else {
        this.elem$.removeClass("active-chat-roll");
      }
    }

    if (this.isWhisper) {
      if (this.isWhisperToGM) {
        this.elem$.addClass("blades-whisper-to-gm");
      } else if (this.isWhisperFromGM) {
        this.elem$.addClass("blades-whisper-from-gm");
      } else {
        this.elem$.addClass("blades-player-whisper");
      }
    }

    if (this.isEmote) {
      this.elem$.addClass("blades-emote");
    }

    if (this.isIC) {
      this.elem$.addClass("blades-ic");
    }

    if (this.isOOC) {
      this.elem$.addClass("blades-ooc");
    }

    U.gsap.to(this.elem$, {autoAlpha: 1, duration: 0.15, ease: "none"});
  }
}


interface BladesChat {
  get id(): IDString;
  content?: string;
  whisper: IDString[];
  flags: {
    "eunos-blades": BladesChat.Flags
  };
}

export default BladesChat;
