/* ****▌███████████████████████████████████████████████████████████████████████████▐**** *\
|*     ▌████░░░░░░░░░░░ Euno's Blades in the Dark for Foundry VTT ░░░░░░░░░░░░░████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░ by Eunomiac ░░░░░░░░░░░░░██████████████████▐     *|
|*     ▌████████████████████████████  License █ v0.1.0 ████████████████████████████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░░░░░░  ░░░░░░░░░░░░░░░░░░███████████████████▐     *|
\* ****▌███████████████████████████████████████████████████████████████████████████▐**** */

const testStrings = [
  "Quality2",
  "SpecialArmor"
];

testStrings.map((testString) => {
  const [traitStr, valStr] = (testString.match(/([A-Za-z]+)([0-9]*)/) ?? []).slice(1);
  console.log(`tS: '${traitStr}', tV: '${valStr}'`);
})


const IS_TESTINGMIXINS = false;
// #region  Testing Mixins
class MixinBuilder {
  constructor(superclass) { this.superclass = superclass }
  with(...mixins) { return mixins.reduce((cls, mixin = (x) => x) => mixin(cls), this.superclass) }
}
const MIX = (superclass) => new MixinBuilder(superclass);

const CloseButton = (superclass) => class extends superclass {
  activateListeners(html) {
      super.activateListeners(html);
      if (this instanceof ActorSheet) {
        console.log(`MIXED ActorSheet.activateListeners(${html})`);
      } else if (this instanceof ItemSheet) {
        console.log(`MIXED ItemSheet.activateListeners(${html})`);
      }
    }
};

const game = {
  Actors: ["ActorA", "ActorB"],
  Items: ["ItemA", "ItemB"]
};

const StaticGetAll = (superclass) => class extends superclass {
  static get All() {
    if (superclass instanceof ActorSheet) {
      return game.Actors;
    } else if (superclass instanceof ItemSheet) {
      return game.Items;
    }
    // return "NO MATCH";
    return {constructor: superclass.constructor, superclass, "THIS": this.constructor, "InstanceOf": (this.constructor instanceof SubActorSheet) || (this.constructor instanceof SubItemSheet), "Equality": (this === ActorSheet || this === ItemSheet)};
  }
}

class ActorSheet {
  activateListeners(html) {
    console.log(`ActorSheet.activateListeners(${html})`);
  }
}

class ItemSheet {
  activateListeners(html) {
    console.log(`ItemSheet.activateListeners(${html})`);
  }
}

class SubActorSheet extends MIX(ActorSheet).with(CloseButton, StaticGetAll) {

}

class SubItemSheet extends MIX(ItemSheet).with(CloseButton, StaticGetAll) {

}

const subActorSheet = new SubActorSheet();
const subItemSheet = new SubItemSheet();

if (IS_TESTINGMIXINS) {
  console.log(SubActorSheet.All);
  console.log(SubItemSheet.All);
  subActorSheet.activateListeners("SubActorSheet");
  subItemSheet.activateListeners("SubItemSheet");
}
// #endregion

const IS_CALCULATINGODDS = false;
// #region  Calculating Odds
const rollDie = () => Math.floor(Math.random() * 6) + 1;
const rollPool = (poolSize) => {
  if (poolSize === 0) { return [Math.min(rollDie(), rollDie())] }
  return [...new Array(poolSize)].map(rollDie);
};
const getResult = (diceRolls) => {
  if (diceRolls.filter((roll) => roll === 6).length >= 2) { return "crit" }
  if (diceRolls.filter((roll) => roll === 6).length > 0) { return "success" }
  if (diceRolls.filter((roll) => roll >= 4).length > 0) { return "partial" }
  return "fail";
}
const runTrial = (poolSize, numRuns) => {
  const trialResults = {
    crit: 0,
    success: 0,
    partial: 0,
    fail: 0
  };
  for (let i = 0; i <= numRuns; i++) {
    trialResults[getResult(rollPool(poolSize))]++;
  }
  ["crit", "success", "partial", "fail"].forEach((result) => {
    trialResults[result] /= (numRuns / 1000);
    trialResults[result] = `${Math.round(trialResults[result]) / 10}%`;
  });
  return trialResults;
}

const runTrials = (maxDice, numRuns) => {
  const runResults = [];
  for (let pSize = 0; pSize <= maxDice; pSize++) {
    runResults.push(runTrial(pSize, numRuns));
  }
  return runResults;
}

if (IS_CALCULATINGODDS) {
  console.log(runTrials(20, 10000000));
}
// #endregion
