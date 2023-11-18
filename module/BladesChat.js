// #region IMPORTS ~
/* import U from "./core/utilities.js";
import C, {
  BladesActorType, BladesItemType, RollPermissions, RollType, RollSubType,
  RollModStatus, RollModSection, ActionTrait, DowntimeAction, AttributeTrait,
  Position, Effect, Factor, RollResult, RollPhase, ConsequenceType, Tag
} from "./core/constants.js";
import {BladesActor, BladesPC, BladesCrew} from "./documents/BladesActorProxy.js";
import {BladesItem, BladesGMTracker} from "./documents/BladesItemProxy.js";
import {ApplyTooltipListeners, ApplyConsequenceListeners} from "./core/gsap.js";
import BladesDialog from "./BladesDialog.js"; */
/*~ @@DOUBLE-BLANK@@ ~*/
import U from "./core/utilities.js";
import C, { BladesItemType } from "./core/constants.js";
import { BladesPC } from "./documents/BladesActorProxy.js";
import { BladesItem } from "./documents/BladesItemProxy.js";
import { ApplyTooltipListeners, ApplyConsequenceListeners } from "./core/gsap.js";
// #endregion
/*~ @@DOUBLE-BLANK@@ ~*/
class BladesChat extends ChatMessage {
    /*~ @@DOUBLE-BLANK@@ ~*/
    static Initialize() {
        Hooks.on("renderChatMessage", (_msg, html) => {
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
    /*~ @@DOUBLE-BLANK@@ ~*/
    static GetRollSpeaker(rollInst) {
        /*~ @@DOUBLE-BLANK@@ ~*/
        // Get initial speaker data
        const speaker = BladesChat.getSpeaker();
        /*~ @@DOUBLE-BLANK@@ ~*/
        // Compare against rollInst.rollPrimary and modify accordingly.
        const { rollPrimaryID, rollPrimaryName, rollPrimaryType, rollPrimaryDoc } = rollInst.rollPrimary;
        /*~ @@DOUBLE-BLANK@@ ~*/
        speaker.alias = rollPrimaryName;
        /*~ @@DOUBLE-BLANK@@ ~*/
        if (BladesItem.IsType(BladesItemType.cohort_gang, BladesItemType.cohort_expert)) {
            speaker.actor = rollPrimaryDoc?.parent?.id ?? speaker.actor;
            if (rollPrimaryDoc?.parent instanceof BladesPC) {
                speaker.alias = `${speaker.alias} (${rollPrimaryDoc.parent.name})`;
            }
        }
        else if (BladesItem.IsType(BladesItemType.gm_tracker, BladesItemType.score)) {
            speaker.actor = null;
            speaker.alias = "The Gamemaster";
        }
        else if (rollPrimaryID) {
            speaker.actor = rollPrimaryID;
        }
        /*~ @@DOUBLE-BLANK@@ ~*/
        speaker.alias = `${speaker.alias} Rolls ...`;
        /*~ @@DOUBLE-BLANK@@ ~*/
        return speaker;
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    static async ConstructRollOutput(rollInst) {
        const speaker = BladesChat.GetRollSpeaker(rollInst);
        /*~ @@DOUBLE-BLANK@@ ~*/
        const template = `systems/eunos-blades/templates/chat/roll-result-${U.lCase(rollInst.rollType)}-roll.hbs`;
        /*~ @@DOUBLE-BLANK@@ ~*/
        const templateData = rollInst;
        templateData.rollFlags = { ...rollInst.flagData };
        /*~ @@DOUBLE-BLANK@@ ~*/
        eLog.checkLog3("bladesRoll", "ConstructRollOutput Data", { rollInst, templateData });
        /*~ @@DOUBLE-BLANK@@ ~*/
        if (rollInst.rollResult) {
            templateData.rollResultDescription = C.RollResultDescriptions[rollInst.finalPosition][rollInst.rollResult];
        }
        /*~ @@DOUBLE-BLANK@@ ~*/
        const renderedHTML = await renderTemplate(template, rollInst);
        /*~ @@DOUBLE-BLANK@@ ~*/
        const messageData = {
            speaker,
            content: renderedHTML
        };
        /*~ @@DOUBLE-BLANK@@ ~*/
        BladesChat.create(messageData, {});
    }
}
/*~ @@DOUBLE-BLANK@@ ~*/
export default BladesChat;
/*~ @@DOUBLE-BLANK@@ ~*/ 
