// #region IMPORTS ~
/* import U from "./core/utilities";
import C, {
  BladesActorType, BladesItemType, RollPermissions, RollType, RollSubType,
  RollModStatus, RollModSection, ActionTrait, DowntimeAction, AttributeTrait,
  Position, Effect, Factor, RollResult, RollPhase, ConsequenceType, Tag
} from "./core/constants";
import {BladesActor, BladesPC, BladesCrew} from "./documents/BladesActorProxy";
import {BladesItem, BladesGMTracker} from "./documents/BladesItemProxy";
import {ApplyTooltipListeners, ApplyConsequenceListeners} from "./core/gsap";
import BladesDialog from "./BladesDialog"; */

import U from "./core/utilities";
import C, {BladesActorType, BladesItemType, RollType, RollResult} from "./core/constants";
import {BladesPC, BladesCrew} from "./documents/BladesActorProxy";
import {BladesItem} from "./documents/BladesItemProxy";
import {ApplyTooltipListeners, ApplyConsequenceListeners} from "./core/gsap";

import BladesRoll from "./BladesRoll";
// #endregion

class BladesChat extends ChatMessage {

  static Initialize() {
    Hooks.on("renderChatMessage", (_msg: ChatMessage, html: JQuery<HTMLElement>) => {
      ApplyTooltipListeners(html);
      ApplyConsequenceListeners(html);
    });
    return loadTemplates([
      "systems/eunos-blades/templates/chat/roll-result-action-roll.hbs",
      "systems/eunos-blades/templates/chat/roll-result-resistance-roll.hbs",
      "systems/eunos-blades/templates/chat/roll-result-fortune-roll.hbs",
      "systems/eunos-blades/templates/chat/roll-result-indulgevice-roll.hbs"
    ]);
  }

  static GetRollSpeaker(rollInst: BladesRoll) {

    // Get initial speaker data
    const speaker = BladesChat.getSpeaker();

    // Compare against rollInst.rollPrimary and modify accordingly.
    const {rollPrimaryID, rollPrimaryName, rollPrimaryType, rollPrimaryDoc} = rollInst.rollPrimary;

    speaker.alias = rollPrimaryName;

    if (BladesItem.IsType(BladesItemType.cohort_gang, BladesItemType.cohort_expert)) {
      speaker.actor = rollPrimaryDoc?.parent?.id ?? speaker.actor;
      if (rollPrimaryDoc?.parent instanceof BladesPC) {
        speaker.alias = `${speaker.alias} (${rollPrimaryDoc.parent.name})`;
      }
    } else if (BladesItem.IsType(BladesItemType.gm_tracker, BladesItemType.score)) {
      speaker.actor = null;
      speaker.alias = "The Gamemaster";
    } else if (rollPrimaryID) {
      speaker.actor = rollPrimaryID;
    }

    speaker.alias = `${speaker.alias} Rolls ...`;

    return speaker;
  }

  static async ConstructRollOutput(rollInst: BladesRoll) {
    const speaker = BladesChat.GetRollSpeaker(rollInst);

    const template = `systems/eunos-blades/templates/chat/roll-result-${U.lCase(rollInst.rollType)}-roll.hbs`;

    const templateData: BladesRoll & {
      rollResultDescription?: string, rollFlags?: BladesRoll.FlagData} = rollInst;
    templateData.rollFlags = {...rollInst.flagData};

    eLog.checkLog3("bladesRoll", "ConstructRollOutput Data", {rollInst, templateData});

    if (rollInst.rollResult) {
      templateData.rollResultDescription = C.RollResultDescriptions[rollInst.finalPosition][rollInst.rollResult];
    }

    const renderedHTML = await renderTemplate(template, rollInst);

    const messageData = {
      speaker,
      content: renderedHTML
    };

    BladesChat.create(messageData, {});
  }
}


interface BladesChat {

}

export default BladesChat;
