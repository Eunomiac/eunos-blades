/* ****▌███████████████████████████████████████████████████████████████████████████▐**** *\
|*     ▌████░░░░░░░░░░░ Euno's Blades in the Dark for Foundry VTT ░░░░░░░░░░░░░████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░ by Eunomiac ░░░░░░░░░░░░░██████████████████▐     *|
|*     ▌████████████████████████████  License █ v0.1.0 ████████████████████████████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░░░░░░  ░░░░░░░░░░░░░░░░░░███████████████████▐     *|
\* ****▌███████████████████████████████████████████████████████████████████████████▐**** */

import U from "./core/utilities.js";
import { Positions, EffectLevels, Action } from "./core/constants.js";
export async function bladesRoll(dice_amount, attribute_name = "", position = Positions.risky, effect = EffectLevels.standard, note = "") {
    let zeromode = false;
    if (dice_amount < 0) {
        dice_amount = 0;
    }
    if (dice_amount === 0) {
        zeromode = true;
        dice_amount = 2;
    }
    const r = new Roll(`${dice_amount}d6`, {});
    r.evaluate({ async: true });
    await showChatRollMessage(r, zeromode, attribute_name, position, effect, note);
}
async function showChatRollMessage(r, zeromode, attribute_name, position = Positions.risky, effect = EffectLevels.standard, note = "") {
    const speaker = ChatMessage.getSpeaker();
    const rolls = r.terms[0].results;
    const roll_status = getBladesRollStatus(rolls, zeromode);
    let result;
    if (attribute_name && attribute_name in Action) {
        let position_localize = "";
        switch (position) {
            case Positions.controlled:
                position_localize = "BITD.PositionControlled";
                break;
            case Positions.desperate:
                position_localize = "BITD.PositionDesperate";
                break;
            case Positions.risky:
            default:
                position_localize = "BITD.PositionRisky";
        }
        let effect_localize = "";
        switch (effect) {
            case EffectLevels.limited:
                effect_localize = "BITD.EffectLimited";
                break;
            case EffectLevels.great:
                effect_localize = "BITD.EffectGreat";
                break;
            case EffectLevels.zero:
                effect_localize = "Zero Effect";
                break;
            case EffectLevels.extreme:
                effect_localize = "Extreme Effect";
                break;
            case EffectLevels.standard:
            default:
                effect_localize = "BITD.EffectStandard";
        }
        result = await renderTemplate("systems/eunos-blades/templates/chat/action-roll.hbs", { rolls: rolls, roll_status: roll_status, attribute_label: U.tCase(attribute_name), position: position, position_localize: position_localize, effect: effect, effect_localize: effect_localize, note: note });
    }
    else {
        const stress = getBladesRollStress(rolls, zeromode);
        result = await renderTemplate("systems/eunos-blades/templates/chat/resistance-roll.hbs", { rolls: rolls, roll_status: roll_status, attribute_label: U.tCase(attribute_name), stress: stress, note: note });
    }
    const messageData = {
        speaker: speaker,
        content: result,
        type: CONST.CHAT_MESSAGE_TYPES.ROLL,
        roll: r
    };
    CONFIG.ChatMessage.documentClass.create(messageData, {});
}
export function getBladesRollStatus(rolls, zeromode = false) {
    const sorted_rolls = rolls.map(i => i.result).sort();
    let roll_status = "failure";
    if (sorted_rolls[0] === 6 && zeromode) {
        roll_status = "critical-success";
    }
    else {
        let use_die, prev_use_die = false;
        if (zeromode) {
            [use_die] = sorted_rolls;
        }
        else {
            use_die = sorted_rolls[sorted_rolls.length - 1];
            if (sorted_rolls.length - 2 >= 0) {
                prev_use_die = sorted_rolls[sorted_rolls.length - 2];
            }
        }
        if (use_die <= 3) {
            roll_status = "failure";
        }
        else if (use_die === 6) {
            if (prev_use_die && prev_use_die === 6) {
                roll_status = "critical-success";
            }
            else {
                roll_status = "success";
            }
        }
        else {
            roll_status = "partial-success";
        }
    }
    return roll_status;
}
export function getBladesRollStress(rolls, zeromode = false) {
    let stress = 6;
    const sorted_rolls = rolls.map(i => i.result).sort();
    const roll_status = "failure";
    if (sorted_rolls[0] === 6 && zeromode) {
        stress = -1;
    }
    else {
        let use_die, prev_use_die = false;
        if (zeromode) {
            [use_die] = sorted_rolls;
        }
        else {
            use_die = sorted_rolls[sorted_rolls.length - 1];
            if (sorted_rolls.length - 2 >= 0) {
                prev_use_die = sorted_rolls[sorted_rolls.length - 2];
            }
        }
        if (use_die === 6 && prev_use_die && prev_use_die === 6) {
            stress = -1;
        }
        else {
            stress = 6 - use_die;
        }
    }
    return stress;
}
export async function simpleRollPopup() {
    new Dialog({
        "title": "Simple Roll",
        "content": `
      <h2>${game.i18n.localize("BITD.RollSomeDice")}</h2>
      <p>${game.i18n.localize("BITD.RollTokenDescription")}</p>
      <form>
        <div class="form-group">
          <label>${game.i18n.localize("BITD.RollNumberOfDice")}:</label>
          <select id="qty" name="qty">
            ${[...new Array(11)].map((item, i) => `<option value="${i}">${i}d</option>`).join("")}
          </select>
        </div>
        <div className="form-group">
          <label>${game.i18n.localize("BITD.Notes")}:</label>
          <input id="note" name="note" type="text" value="">
        </div><br/>
      </form>
    `,
        "buttons": {
            yes: {
                icon: "<i class='fas fa-check'></i>",
                label: "Roll",
                callback: async (html) => {
                    const diceQty = html.find('[name="qty"]')[0].value;
                    const note = html.find('[name="note"]')[0].value;
                    await bladesRoll(diceQty, "", "", "", note);
                }
            },
            no: {
                icon: "<i class='fas fa-times'></i>",
                label: game.i18n.localize("Cancel")
            }
        },
        "default": "yes"
    }).render(true);
}