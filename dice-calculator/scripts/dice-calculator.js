// eslint-disable-next-line max-len
const templatePath = 'modules/dice-calculator/templates/calculator.html';
const diceIconSelector = '#chat-controls .chat-control-icon .fa-dice-d20';

/**
 * Helper function for bracket notation. [DEPRECATED]
 *
 * @param {string} input
 *   String value of inline roll to parse.
 *
 * @return {undefined}
 */
function dcParseInlineRolls(input) {
  // Find out if the message includes an actor ID.
  let actorId = input.match(/data-actor-id="(.[^"]+)"/);
  let actor = false;
  actorId = actorId && actorId[1].length > 0 ? actorId[1] : false;

  // Load the actor via ID.
  if (actorId) {
    actor = game.actors.get(actorId);

    if (actor === null) {
      actor = game.actors.tokens[actorId];
    }
  }
  // Otherwise, load the currently selected actor.
  else {
    let controlledTokens = canvas.tokens.controlled;
    actor = controlledTokens.length > 0 ? controlledTokens[0].actor : false;
  }

  // If this isn't the owner, don't allow them to access attributes.
  if (actor == null || !actor.owner) {
    actor = false;
  }

  // Replace dice.
  let output = input.replace(/\[\[(.*?)\]\]/g, (matched, index, original) => {
    if (index !== 0) {
      // Get rid of the outer match characters.
      let formula = matched.replace('[[', '').replace(']]', '');
      formula = formula.replace(/@abil\./g, '@abilities.').replace(/@attr\./g, '@attributes.');

      // If there's no actor and the user tried to use a stat, warn them.
      if (!actor && input.includes('@')) {
        ui.notifications.warn('A token attribute was specified in your roll, but no token was selected.');
      }

      // Build the roll.
      let data = actor ? actor.getRollData() : {};
      let roll = new Roll(formula, data);

      // Roll the dice.
      roll.roll();

      // Get the combined parts.
      let parts = '';
      for (let i = 0; i < roll.terms.length; i++) {
        let part = roll.terms[i];
        if (part.results) {
          parts += '[' + part.results.map(function(r) {
            return !r.discarded ? r.roll : `<span class="dc-discarded">${r.roll}</span>`;
          }).join(', ') + ']';
        }
        else {
          parts += ' ' + part;
        }
      }
      // Return result if successfull, or the original characters otherwise.
      if (roll.total) {
        return `<span class="dc-inline-roll"><span class="dc-inline-roll__result">${roll.total}</span><span class="dc-inline-roll__parts"><span class="dc-formula">${roll.formula}</span><span class="dc-parts">${parts}</span></span></span>`;
      }
      else {
        return matched;
      }
    }
    // Return the original characters for non-matches.
    else {
      return matched;
    }
  });

  // Return the parsed output.
  return output;
}

/**
 * Helper function to roll dice formula and output to chat.
 *
 * @param {object} actor (optional)
 *   The actor to use for rolls, if any.
 *
 * @return {undefined}
 */
function dcRollDice(actor = false) {
  // Retrieve the formula.
  let formula = $('.dice-calculator textarea').val();
  // Replace shorthand.
  formula = formula.replace(/@abil\./g, '@abilities.').replace(/@attr\./g, '@attributes.');
  // Roll the dice!
  let data = actor ? actor.getRollData() : {};
  let r = new Roll(formula, data);
  r.toMessage();
  // Throw a warning to the user if they tried to use a stat without a token.
  // If there's no actor and the user tried to use a stat, warn them.
  if (!actor && formula.includes('@')) {
    ui.notifications.warn('A token attribute was specified in your roll, but no token was selected.');
  }
  // Store it for later.
  let formulaArray = Cookies.getJSON('dice_formula');
  formulaArray = !formulaArray ? [] : formulaArray;
  // Only update if this is a new formula.
  if ($.inArray(formula, formulaArray) === -1) {
    formulaArray.unshift(formula);
    formulaArray = formulaArray.slice(0, 10);
    Cookies.set('dice_formula', formulaArray);
  }
}

/**
 * Define settings.
 */
Hooks.on('init', () => {
  // Hide the dice calculator.
  game.settings.register('dice-calculator', 'enableDiceCalculator', {
    name: game.i18n.localize("DICE_TRAY.settings.enableDiceCalculator.name"),
    hint: game.i18n.localize("DICE_TRAY.settings.enableDiceCalculator.hint"),
    scope: 'world',
    config: true,
    default: true,
    type: Boolean,
  });

  // Hide the dice tray.
  game.settings.register('dice-calculator', 'enableDiceTray', {
    name: game.i18n.localize("DICE_TRAY.settings.enableDiceTray.name"),
    hint: game.i18n.localize("DICE_TRAY.settings.enableDiceTray.hint"),
    scope: 'world',
    config: true,
    default: true,
    type: Boolean,
  });

  // Override system.
  game.settings.register('dice-calculator', 'systemOverride', {
    name: game.i18n.localize("DICE_TRAY.settings.systemOverride.name"),
    hint: game.i18n.localize("DICE_TRAY.settings.systemOverride.hint"),
    scope: 'world',
    config: true,
    default: 'none',
    type: String,
    choices: {
      none: game.i18n.localize('DICE_TRAY.SETTINGS.systemOverride.none'),
      generic: game.i18n.localize('DICE_TRAY.SETTINGS.systemOverride.generic'),
      swade: game.i18n.localize('DICE_TRAY.SETTINGS.systemOverride.swade'),
      fatex: game.i18n.localize('DICE_TRAY.SETTINGS.systemOverride.fatex'),
      ModularFate: game.i18n.localize('DICE_TRAY.SETTINGS.systemOverride.ModularFate'),
      'fate-core-official': game.i18n.localize('DICE_TRAY.SETTINGS.systemOverride.fate-core-official'),
      dnd5e: game.i18n.localize('DICE_TRAY.SETTINGS.systemOverride.dnd5e'),
      pf2e: game.i18n.localize('DICE_TRAY.SETTINGS.systemOverride.pf2e'),
      dcc: game.i18n.localize('DICE_TRAY.SETTINGS.systemOverride.dcc'),
    },
    onChange: () => window.location.reload()
  });

  // Enable pips on the d6.
  game.settings.register('dice-calculator', 'enableD6Pips', {
    name: game.i18n.localize("DICE_TRAY.settings.enableD6Pips.name"),
    hint: game.i18n.localize("DICE_TRAY.settings.enableD6Pips.hint"),
    scope: 'world',
    config: true,
    default: false,
    type: Boolean,
  });

  // Show the d20 and d100
  if (game.system.id == 'swade' || game.settings.get('dice-calculator', 'systemOverride') == 'swade') {
    game.settings.register('dice-calculator', 'enableExtraDiceInSwade', {
      name: game.i18n.localize("DICE_TRAY.settings.enableExtraDiceInSwade.name"),
      hint: game.i18n.localize("DICE_TRAY.settings.enableExtraDiceInSwade.hint"),
      scope: 'world',
      config: true,
      default: false,
      type: Boolean,
    });
  }
});

Hooks.on('ready', () => {
  // Exit early if the dice calc is disabled.
  let diceCalcEnabled = game.settings.get('dice-calculator', 'enableDiceCalculator');
  if (!diceCalcEnabled) return;

  $(diceIconSelector).addClass('dice-calculator-toggle');

  // Render a modal on click.
  $(document).on('click', diceIconSelector, ev => {
    ev.preventDefault();

    let $dialog = $('.dialog--dice-calculator');

    if ($dialog.length < 1) {

      const dialogOptions = {
        width: 400,
        top: event.clientY - 80,
        left: window.innerWidth - 710,
        classes: ['dialog', 'dialog--dice-calculator']
      };

      let controlledTokens = canvas.tokens.controlled;
      let actor = controlledTokens.length > 0 ? controlledTokens[0].actor : false;

      let abilities = false;
      let attributes = false;
      let customButtons = [];

      var whitelist = {};
      whitelist[game.system.data.name] = {
        abilities: [],
        attributes: []
      };

      if (game.system.data.name == 'dnd5e' || game.system.data.name == 'archmage') {
        whitelist[game.system.data.name].flags = { adv: true };
      }

      if (actor !== false) {
        whitelist.dnd5e = {
          flags: {
            adv: true
          },
          abilities: [
            'str',
            'dex',
            'con',
            'int',
            'wis',
            'cha'
          ],
          attributes: [
            'init',
            'prof',
          ],
          custom: {
            attributes: {
              profHalf: {
                label: 'prof_half',
                name: '1/2 Prof',
                formula: actor.data.data?.attributes?.prof !== undefined ? Math.floor(actor.data.data.attributes.prof / 2) : 0
              },
              levelHalf: {
                label: 'level_half',
                name: '1/2 Level',
                formula: actor.data.data?.details?.level !== undefined ? Math.floor(actor.data.data.details.level?.value ?? actor.data.data.details.level / 2) : 0
              },
              profDouble: {
                label: 'prof_double',
                name: '2x Prof',
                formula: actor.data.data?.attributes?.prof !== undefined ? '(2 * @attr.prof)' : 0
              }
            }
          }
        };
        whitelist.pf2e = {
          flags: {
            adv: false
          },
          abilities: [
            'str',
            'dex',
            'con',
            'int',
            'wis',
            'cha'
          ],
          attributes: [
            'perception',
          ],
          custom: {
            attributes: {
              profTrained: {
                label: 'prof_t',
                name: 'Trained',
                formula: '(2 + @details.level.value)'
              },
              profExpert: {
                label: 'prof_e',
                name: 'Expert',
                formula: '(4 + @details.level.value)'
              },
              profMaster: {
                label: 'prof_m',
                name: 'Master',
                formula: '(6 + @details.level.value)'
              },
              profLegendary: {
                label: 'prof_l',
                name: 'Legendary',
                formula: '(8 + @details.level.value)'
              }
            }
          }
        };
        whitelist.dcc = {
          flags: {
            adv: false
          },
          abilities: [
            'str',
            'agl',
            'sta',
            'per',
            'int',
            'lck'
          ],
          attributes: [],
          custom: {}
        };

        // Let systems or other modules modify the buttons whitelist.
        Hooks.call('dcCalcWhitelist', whitelist, actor);

        // Build abilities.
        abilities = [];
        for (let prop in actor.data.data.abilities) {
          if (whitelist[game.system.data.name].abilities.includes(prop)) {
            let formula = '';
            if (actor.data.data.abilities[prop].mod !== undefined) {
              formula = `@abil.${prop}.mod`;
            }
            else if (actor.data.data.abilities[prop].value !== undefined) {
              formula = `@abil.${prop}.value`;
            }
            else {
              formula = `@abil.${prop}`;
            }
            abilities.push({
              label: prop,
              name: prop,
              formula: formula
            });
          }
        }

        // Build attributes.
        attributes = [];

        // Add level for systems that place it in details.
        if (actor.data.data.attributes !== undefined) {
          if (actor.data.data.attributes.level === undefined && actor.data.data?.details?.level !== undefined) {
            attributes.push({
              label: 'level',
              name: 'level',
              formula: actor.data.data.details.level?.value ? '@details.level.value' : '@details.level'
            });
          }

          for (let prop in actor.data.data.attributes) {
            if (whitelist[game.system.data.name].attributes.includes(prop)) {
              let formula = '';
              if (actor.data.data.attributes[prop].mod !== undefined) {
                formula = `@attr.${prop}.mod`;
              }
              else if (actor.data.data.attributes[prop].value !== undefined) {
                formula = `@attr.${prop}.value`;
              }
              else {
                formula = `@attr.${prop}`;
              }
              attributes.push({
                label: prop,
                name: prop,
                formula: formula
              });
            }
          }
        }

        // Add custom attributes.
        customButtons = [];
        if (whitelist[game.system.data.name].custom !== undefined) {
          // Iterate through the kinds of properties, such as 'abilities' or
          // 'attributes'.
          for (let customProps in whitelist[game.system.data.name].custom) {
            // Loop through the properties in that attribute.
            for (let prop in whitelist[game.system.data.name].custom[customProps]) {
              let customButton = {
                label: prop,
                name: whitelist[game.system.data.name].custom[customProps][prop].name,
                formula: whitelist[game.system.data.name].custom[customProps][prop].formula
              };

              if (customProps === 'abilities') {
                // Replace existing.
                let updated = false;
                abilities.find((element, index) => {
                  if (element.label !== undefined && element.label === prop) {
                    abilities[index] = customButton;
                    updated = true;
                  }
                });
                // Otherwise, append.
                if (!updated) {
                  abilities.push(customButton);
                }
              }
              else if (customProps === 'attributes') {
                // Replace existing.
                let updated = false;
                attributes.find((element, index) => {
                  if (element.label !== undefined && element.label === prop) {
                    attributes[index] = customButton;
                    updated = true;
                  }
                });
                // Otherwise, append.
                if (!updated) {
                  attributes.push(customButton);
                }
              }
              else {
                customButtons.push(customButton);
              }
            }
          }
        }
      }

      // Add funky dice buttons
      if (game.system.data.name === 'dcc') {
        const funkyDice = [
          {
            "label": "d3",
            "name": "d3",
            "formula": "1d3"
          },
          {
            "label": "d5",
            "name": "d5",
            "formula": "1d5"
          },
          {
            "label": "d7",
            "name": "d7",
            "formula": "1d7"
          },
          {
            "label": "d14",
            "name": "d14",
            "formula": "1d14"
          },
          {
            "label": "d16",
            "name": "d16",
            "formula": "1d16"
          },
          {
            "label": "d24",
            "name": "d24",
            "formula": "1d24"
          },
          {
            "label": "d30",
            "name": "d30",
            "formula": "1d30"
          }
        ];
        customButtons = funkyDice.concat(customButtons);
      }

      // Build the template.
      let templateData = {
        'rolls': Cookies.getJSON('dice_formula'),
        'abilities': abilities,
        'attributes': attributes,
        'customButtons': customButtons,
        'adv': whitelist[game.system.data.name].flags !== undefined ? whitelist[game.system.data.name].flags.adv : false
      };

      // Render the modal.
      renderTemplate(templatePath, templateData).then(dlg => {
        new Dialog({
          title: game.i18n.localize('DICE_TRAY.RollDice'),
          content: dlg,
          buttons: {
            roll: {
              label: game.i18n.localize("DICE_TRAY.Roll"),
              callback: () => dcRollDice(actor)
            }
          }
        }, dialogOptions).render(true);
      });
    }
    else {
      $dialog.remove();
    }
  });

  // Toggle the memory display.
  $(document).on('focus', '.dice-calculator__text-input', function(event) {
    $('.dice-calculator__rolls--hidden').addClass('visible');
  });

  $(document).on('blur', '.dice-calculator__text-input', function(event) {
    setTimeout(() => {
      $('.dice-calculator__rolls--hidden').removeClass('visible');
    }, 250);
  });

  // Replace with the selected die formula.
  $(document).on('click', '.dice-calculator__roll', function(event) {
    let formula = $(this).text();
    $('.dice-calculator__text-input').val(formula);
  });

  // Update the dice formula.
  $(document).on('click', '.dice-calculator--button', ev => {
    ev.preventDefault();

    // Retrieve variables to start things off.
    let buttonFormula = String($(ev.currentTarget).data('formula'));
    let $formulaInput = $(document).find('.dice-calculator textarea');
    let currentFormula = $formulaInput.val();
    let currentFormulaArray = currentFormula.split(' ');
    let last = currentFormulaArray.slice(-1)[0];
    let skip = false;

    // Used for determining when to add directly.
    const standardDice = [
      'd3',
      'd4',
      'd6',
      'd8',
      'd10',
      'd12',
      'd20',
      'd30',
      'd100'
    ];

    // Used to prevent doubling up on operations/symbols.
    const opFormulas = [
      '/',
      '*',
      '+',
      '-'
    ];
    const parenthesesFormulas = [
      '(',
      ')'
    ];

    // If the last item and the incoming item are both math operations,
    // skip adding it.
    if (opFormulas.includes(last) && opFormulas.includes(buttonFormula)) {
      skip = true;
    }

    // If the incoming item is either an operation or parentheses, skip it
    // in certain cases.
    if (opFormulas.includes(buttonFormula)
      || parenthesesFormulas.includes(buttonFormula)) {
      if (last == buttonFormula) {
        skip = true;
      }

      if (opFormulas.includes(last) || parenthesesFormulas.includes(last)) {
        skip = true;
      }
    }

    // Handle clear.
    if (buttonFormula === 'CLEAR') {
      currentFormula = '';
    }
    // Handle backspace/delete.
    else if (buttonFormula === 'DELETE') {
      currentFormulaArray.pop();
      currentFormula = currentFormulaArray.join(' ');
    }
    // Handle token attributes and abilities.
    else if (last.includes('@') || buttonFormula.includes('@')) {
      let joiner = opFormulas.includes(last) || opFormulas.includes(buttonFormula) ? ' ' : ' + ';
      joiner = last.length < 1 ? '' : joiner;
      currentFormula = currentFormula + joiner + buttonFormula;
    }
    // Handle inputs such as 'd4' and 'd6'
    else if (buttonFormula.includes('d')) {
      let updated = false;
      let count = 0;
      // @TODO: Investigate whether this option is worthwhile, perhaps as a
      // a setting.
      // -----------------------------------------------------------------------
      // Loop through all existing items in the formula array to see if this
      // die type has been used before. If so, increase the count on that entry.
      // for (let i = 0; i < currentFormulaArray.length; i++) {
      //   if (currentFormulaArray[i].includes(buttonFormula)) {
      //     let result = currentFormulaArray[i].split('d');
      //     if (result[0] && (result[0].length !== 0 || !isNaN(result[0]))) {
      //       count = parseInt(result[0]);
      //     }
      //     else {
      //       count = 1;
      //     }
      //     updated = true;
      //     currentFormulaArray[i] = (count + 1) + buttonFormula;
      //   }
      // }

      // Update the number of dice in the last item if it's the same as the
      // button formula.
      if (last.includes(buttonFormula)) {
        let result = last.split('d');
        if (result[0] && (result[0].length !== 0 || !isNaN(result[0]))) {
          count = parseInt(result[0]);
        }
        else {
          count = 1;
        }
        updated = true;
        currentFormulaArray[currentFormulaArray.length - 1] = (count + 1) + buttonFormula;
      }
      // If we updated an item, create a new text version of the formula.
      if (updated) {
        currentFormula = currentFormulaArray.join(' ');
      }
      // Otherwise, append to the original.
      else {
        let joiner = ' ';
        if (last.includes('d')) {
          joiner = ' + ';
        }
        else if (!isNaN(last)) {
          joiner = '';
        }
        currentFormula = currentFormula + joiner + buttonFormula;
      }
    }
    // Handle adv/dis.
    else if (buttonFormula.includes('k')) {
      if (last.includes('d')) {
        // If the last item isn't kh or kl, append.
        let lastArray = last.split('k');
        if (!last.includes('k')) {
          if (last === 'd20') {
            last = '2d20';
          }

          currentFormula = currentFormula.slice(0, -1 * last.length);
          currentFormula = currentFormula + ' ' + last + buttonFormula;
        }
        // Otherwise check to see if we should either replace (such as going
        // from kh to kl) or increase the count.
        else {
          if (lastArray[1]) {
            let dieCount = lastArray[0].split('d')[0];
            let lastType = lastArray[1].substr(0, 1);
            let buttonType = buttonFormula.substr(1, buttonFormula.length);
            let lastCount = lastArray[1].substr(1, lastArray[1].length);
            let count = parseInt(lastCount);
            dieCount = parseInt(dieCount);
            dieCount = isNaN(dieCount) ? 1 : dieCount;
            count = isNaN(count) ? 2 : count + 1;

            // We need to avoid allowing more dice to be kept than are being
            // rolled.
            if (count >= dieCount) {
              count = dieCount - 1;
            }

            if (count === 1) {
              count = '';
            }

            // Build the new string.
            currentFormulaArray.pop();
            currentFormula = currentFormulaArray.join(' ') + lastArray[0]
              + 'k' + buttonType;

            if (buttonType === lastType) {
              currentFormula = currentFormula + count;
            }
          }
        }
      }
      else {
        skip = true;
      }
    }
    // Handle custom dice.
    else if (buttonFormula === 'd') {
      let joiner = last.includes('d') || isNaN(last) ? ' + ' : '';
      currentFormula = currentFormula + joiner + buttonFormula;
    }
    // Handle numbers appended to custom dice..
    else if ((last === 'd' || last.includes('k')
      || parenthesesFormulas.includes(last)) && !isNaN(buttonFormula)) {
      currentFormula = currentFormula + buttonFormula;
    }
    // All other inputs.
    else {
      // Normally we want to append with either an empty string or a space.
      let joiner = '';
      if (currentFormula.length === 0) {
        joiner = '';
      }
      if (opFormulas.includes(buttonFormula)) {
        joiner = ' ';
      }
      // If the last item is a die, append with as addition.
      else if (last.includes('d')) {
        if (standardDice.includes(last) && buttonFormula !== '0') {
          joiner = ' + ';
        }
        // If the last item isn't a complete die (such as "3d") and this is
        // a number, append directly.
        else {
          if (!isNaN(last) || !isNaN(parseInt(buttonFormula))) {
            joiner = '';
          }
          else {
            joiner = ' ';
          }
        }
      }
      else if (isNaN(parseInt(last))) {
        joiner = ' ';
      }
      currentFormula = currentFormula + joiner + buttonFormula;
    }

    // If no operations said to skip this entry, update the input.
    if (!skip) {
      $formulaInput.val(currentFormula);
    }
  });
});
