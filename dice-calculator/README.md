# Install

1. Go to the setup page and choose **Add-on Modules**.
2. Click the **Install Module** button, and paste in this manifest link:
    * Foundry 0.3.x: [https://gitlab.com/asacolips-projects/foundry-mods/foundry-vtt-dice-calculator/raw/0.3.12/module.json](https://gitlab.com/asacolips-projects/foundry-mods/foundry-vtt-dice-calculator/raw/0.3.12/module.json)
    * Foundry 0.4.x: [https://gitlab.com/asacolips-projects/foundry-mods/foundry-vtt-dice-calculator/raw/0.4.0/module.json](https://gitlab.com/asacolips-projects/foundry-mods/foundry-vtt-dice-calculator/raw/0.4.0/module.json)
    * Foundry 0.5.x: [https://gitlab.com/asacolips-projects/foundry-mods/foundry-vtt-dice-calculator/raw/master/module.json](https://gitlab.com/asacolips-projects/foundry-mods/foundry-vtt-dice-calculator/raw/master/module.json)

- Finally, enable the module on the module settings form under Help.

Compatible with FoundryVTT 0.3.x

> ## NOTE ABOUT CLONING
> If you install this module by cloning the git repository, you'll need to rename the folder to `dice-calculator` so that Foundry will recognize it.

# Description

This module turns the d20 icon near the chat prompt into a clickable link that opens up a new dice calculator dialog. The dice calculator includes buttons for dice, numbers, and simple math.

![Screenshot of dice calculator](https://i.imgur.com/53XmxEN.png)

# Inline rolls

This module also includes an optional inline dice roll system that can intercept chat messages an roll an dice notation between `[[ ]]` brackets, such as `[[2d20kh + @abil.str.mod + @attr.prof.value]]`. To enable this feature, click the **?** tab in the right sidebar, and go to **Configure Settings** > **Module Settings**. Turn on the _Enable Inline Rolls_ setting under **Dice Calculator**, and new chat messages will automatically parse inline dice rolls.

In order to use actor attributes in your inline rolls, you must either select a token or enter the inline roll inside a chat message that will include the `data-actor-id` attribute (such as a spell description).

> **NOTE:** Do not enable this setting if you're using another module that also provides macros using the `[[ ]]` syntax!

# Adding custom buttons

Custom buttons can be added to the bottom of the calculator, or existing attribute and ability buttons can be modified. For a quick example, see this snippet from the archmage system:

```js
Hooks.on('dcCalcWhitelist', (whitelist, actor) => {
  // Add whitelist support for the calculator.
  whitelist.archmage = {
    // Currently, the only flag that's supported is the adv flag (whether to
    // say "Adv." or "kh" on the kh/kl buttons).
    flags: {
      adv: false
    },
    // List any abilities on actor.data.data.abilities that should be allowed.
    abilities: [
      'str',
      'dex',
      'con',
      'int',
      'wis',
      'cha'
    ],
    // List any attributes on actor.data.data.attributes that should be allowed.
    // Level is automatically pulled from actor.data.data.details and added to
    // this array as well.
    attributes: [
      'init',
    ],
    // The custom section can be used to replace abilities or attributes outright,
    // or it can be used to add a third row of custom buttons. Anything added
    // to this section needs to have 3 keys: label, name, and formula.
    custom: {
      abilities: {},
      attributes: {
        levelHalf: {
          label: 'level_half',
          name: '1/2 Level',
          // Formulas either need to be a computed integer OR they need to be
          // string that's valid for a dice roll, such as `d6`. The calculator
          // supplies the `actor.data.data` object to the Roll class when
          // rolling, so you can also do things like `@abilities.str.mod` or
          // `@attributes.hp.value`. Finally, you can use `@abil` or `@attr` as
          // short hand for the calculator.
          formula: actor.data.data.attributes.level !== undefined ? Math.floor(actor.data.data.attributes.level.value / 2) : 0
        },
        levelDouble: {
          label: 'level_double',
          name: '2x Level',
          formula: actor.data.data.attributes.level !== undefined ? actor.data.data.attributes.level.value * 2 : 0
        }
      },
      custom: {}
    }
  };

  // Add a custom row of buttons based on 13th Age's ability damage at high levels.
  let levelMultiplier = 1;
  if (actor.data.data.attributes.level.value >= 5) {
    levelMultiplier = 2;
  }
  if (actor.data.data.attributes.level.value >= 8) {
    levelMultiplier = 3;
  }

  if (levelMultiplier > 1) {
    for (let prop of whitelist.archmage.abilities) {
      whitelist.archmage.custom.custom[prop] = {
        label: prop,
        name: `${levelMultiplier}${prop}`,
        formula: `(${levelMultiplier} * @abil.str.mod)`
      };
    }
  }
});
```