import U from "./core/utilities.js";
import {Attributes, Positions, EffectLevels, Actions} from "./core/constants.js";
// import type {Attributes} from "./blades-actor.js";
/**
 * Roll Dice.
 * @param {int} dice_amount
 * @param {string} attribute_name
 * @param {string} position
 * @param {string} effect
 */

export async function bladesRoll(
	dice_amount: number,
	attribute_name: Actions|Attributes|"" = "",
	position: Positions|"" = Positions.risky,
	effect: EffectLevels|"" = EffectLevels.standard,
	note = ""
) {

	// ChatMessage.getSpeaker(controlledToken)
	let zeromode = false;

	if ( dice_amount < 0 ) { dice_amount = 0 }
	if ( dice_amount === 0 ) { zeromode = true; dice_amount = 2 }

	const r = new Roll( `${dice_amount}d6`, {} );

	// show 3d Dice so Nice if enabled
	r.evaluate({async:true});
	await showChatRollMessage(r, zeromode, attribute_name, position, effect, note);
}

/**
 * Shows Chat message.
 *
 * @param {Roll} r
 * @param {Boolean} zeromode
 * @param {String} attribute_name
 * @param {string} position
 * @param {string} effect
 */
async function showChatRollMessage(
	r: Roll,
	zeromode: boolean,
	attribute_name?: Attributes|Actions|"",
	position: Positions|"" = Positions.risky,
	effect: EffectLevels|"" = EffectLevels.standard,
	note = ""
) {
	const speaker = ChatMessage.getSpeaker();

	const rolls = (r.terms as DiceTerm[])[0].results;

	// Retrieve Roll status.
	const roll_status = getBladesRollStatus(rolls, zeromode);

	let result;
	if (attribute_name && attribute_name in Actions) {
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

		result = await renderTemplate("systems/eunos-blades/templates/chat/action-roll.hbs", {rolls: rolls, roll_status: roll_status, attribute_label: U.tCase(attribute_name), position: position, position_localize: position_localize, effect: effect, effect_localize: effect_localize, note: note});
	} else {
		const stress = getBladesRollStress(rolls, zeromode);

		result = await renderTemplate("systems/eunos-blades/templates/chat/resistance-roll.hbs", {rolls: rolls, roll_status: roll_status, attribute_label: U.tCase(attribute_name), stress: stress, note: note});
	}

	const messageData = {
		speaker: speaker,
		content: result,
		type: CONST.CHAT_MESSAGE_TYPES.ROLL,
		roll: r
	};

	CONFIG.ChatMessage.documentClass.create(messageData, {});
}

/**
 * Get status of the Roll.
 *  - failure
 *  - partial-success
 *  - success
 *  - critical-success
 * @param {Array} rolls
 * @param {Boolean} zeromode
 */
export function getBladesRollStatus(rolls: DiceTerm.Result[], zeromode = false) {

	// Sort roll values from lowest to highest.
	const sorted_rolls = rolls.map(i => i.result).sort();

	let roll_status = "failure";

	if (sorted_rolls[0] === 6 && zeromode) {
		roll_status = "critical-success";
	} else {
		let use_die: number, prev_use_die: number|boolean = false;

		if (zeromode) {
			[use_die] = sorted_rolls;
		} else {
			use_die = sorted_rolls[sorted_rolls.length - 1];

			if (sorted_rolls.length - 2 >= 0) {
				prev_use_die = sorted_rolls[sorted_rolls.length - 2];
			}
		}

		// 1,2,3 = failure
		if (use_die <= 3) {
			roll_status = "failure";
		} else if (use_die === 6) { // if 6 - check the prev highest one.
			// 6,6 - critical success
			if (prev_use_die && prev_use_die === 6) {
				roll_status = "critical-success";
			} else { // 6 - success
				roll_status = "success";
			}
		} else { // else (4,5) = partial success
			roll_status = "partial-success";
		}

	}

	return roll_status;

}
/**
 * Get stress of the Roll.
 * @param {Array} rolls
 * @param {Boolean} zeromode
 */
export function getBladesRollStress(rolls: DiceTerm.Result[], zeromode = false) {

	let stress = 6;

	// Sort roll values from lowest to highest.
	const sorted_rolls = rolls.map(i => i.result).sort();

	const roll_status = "failure";

	if (sorted_rolls[0] === 6 && zeromode) {
		stress = -1;
	} else {
		let use_die: number, prev_use_die: number|boolean = false;

		if (zeromode) {
			[use_die] = sorted_rolls;
		} else {
			use_die = sorted_rolls[sorted_rolls.length - 1];

			if (sorted_rolls.length - 2 >= 0) {
				prev_use_die = sorted_rolls[sorted_rolls.length - 2];
			}
		}

		if (use_die === 6 && prev_use_die && prev_use_die === 6) {
			stress = -1;
		} else {
			stress = 6 - use_die;
		}

	}

	return stress;

}


/**
 * Call a Roll popup.
 */
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
					// @ts-expect-error MIGRATION PAINS
					const diceQty = html.find('[name="qty"]')[0].value;
					// @ts-expect-error MIGRATION PAINS
					const note = html.find('[name="note"]')[0].value;
					await bladesRoll(diceQty,"","","",note);
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
