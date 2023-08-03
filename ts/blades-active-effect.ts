import BladesActor from "./blades-actor.js";
import U from "./core/utilities.js";
import type {ItemData} from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/module.mjs";
import BladesItem from "./blades-item.js";
import {Tag, BladesPhase} from "./core/constants.js";

const FUNCQUEUE: Record<string, {
  curFunc: Promise<void>,
  queue: BladesCustomFuncData[]
}> = {};
// {type: "ability", name: "rX:/^(?!Ghost)/"}
const CUSTOMFUNCS: Record<string, (actor: BladesActor, funcData: string, isReversing: boolean) => Promise<void>> = {
  addItem: async (actor: BladesActor, funcData: string, isReversing = false) => {
    eLog.checkLog("activeEffects", "addItem", {actor, funcData, isReversing});
    if (actor.hasActiveSubItemOf(funcData)) {
      if (isReversing) {
        return actor.remSubItem(funcData);
      }
    } else {
      if (!isReversing) {
        return actor.addSubItem(funcData);
      }
    }
    return undefined;
  },
  addIfChargen: async (actor: BladesActor, funcData: string, isReversing = false) => {
    eLog.checkLog("activeEffects", "addIfChargen", {actor, funcData, isReversing});
    if (!isReversing && game.eunoblades.Tracker!.system.phase !== BladesPhase.CharGen) { return undefined }
    const [target, qty] = funcData.split(/:/);
    if (isReversing) {
      return actor.update({[target]: U.pInt(getProperty(actor, target)) - U.pInt(qty)});
    }
    return actor.update({[target]: U.pInt(getProperty(actor, target)) + U.pInt(qty)});
  },
  // applyToMembers: async (crew: BladesActor, changeData: EffectChangeData, isReversing = false) => {

  // },
  remItem: async (actor: BladesActor, funcData: string, isReversing = false) => {

    function testString(targetString: string, testDef: string) {
      if (/^rX/.test(testDef)) {
        const pat = new RegExp(testDef.replace(/^rX:\/(.*?)\//, "$1"));
        return pat.test(targetString);
      }
      return targetString === testDef;
    }

    if (/^{/.test(funcData)) {
      if (isReversing) {
        console.error("Cannot reverse a 'remItem' custom effect that was defined with a JSON object.");
        return undefined;
      }
      const {type, tags, name} = JSON.parse(funcData);
      let activeSubItems = actor.activeSubItems;
      if (activeSubItems.length === 0) { return undefined }
      if (name) { activeSubItems = activeSubItems.filter((item) => testString(item.name!, name)) }
      if (activeSubItems.length === 0) { return undefined }
      if (type) { activeSubItems = activeSubItems.filter((item) => testString(item.type, type)) }
      if (activeSubItems.length === 0) { return undefined }
      if (tags) { activeSubItems = activeSubItems.filter((item) => item.hasTag(...tags)) }
      if (activeSubItems.length === 0) { return undefined }
      eLog.checkLog("activeEffects", "remItem - JSON OBJECT", {actor, funcData: JSON.parse(funcData), isReversing, activeSubItems});
      activeSubItems.forEach((item) => actor.remSubItem(item));
    }
    eLog.checkLog("activeEffects", "remItem", {actor, funcData, isReversing});
    if (actor.hasActiveSubItemOf(funcData)) {
      return actor.remSubItem(funcData);
    }
    if (isReversing) {
      return actor.addSubItem(funcData);
    }
    return undefined;
  }
};

type EffectChangeData = {
  effect: BladesActiveEffect,
  key: string,
  mode: number,
  priority: number,
  value: string
};

type BladesCustomFuncName = KeyOf<typeof CUSTOMFUNCS>;
type BladesCustomFuncData = {
  funcName: BladesCustomFuncName,
  funcData: string,
  isReversing: boolean
}

// type BladesCustomFuncParams = Parameters<ValueOf<typeof CUSTOMFUNCS>>[1];

// type BladesCustomFunc = (actor: BladesActor, params: BladesCustomFuncParams) => Promise<void>;
// type BladesCustomResult = ReturnType<BladesCustomFunc>;

// type BladesCustomEffectData = {
//   func: BladesCustomFuncName,
//   params: BladesCustomFuncParams
// }

class BladesActiveEffect extends ActiveEffect {
  static Initialize() {
    CONFIG.ActiveEffect.documentClass = BladesActiveEffect;

    Hooks.on("preCreateActiveEffect", async (effect: BladesActiveEffect) => {

      if (!(effect.parent instanceof BladesActor)) { return }
      // Partition effect.changes into permanent and non-permanent changes:

      const [permChanges, changes] = U.partition(effect.changes, (change) => /^perm/.test(change.key));
      await effect.updateSource({changes});

      for (const permChange of permChanges) {
        const {key, value} = permChange;
        const permFuncName = key.replace(/^perm/, "");
        if (permFuncName in CUSTOMFUNCS) {
          const funcData: BladesCustomFuncData = {
            funcName: permFuncName as BladesCustomFuncName,
            funcData: value,
            isReversing: false
          };
          BladesActiveEffect.ThrottleCustomFunc(effect.parent as BladesActor, funcData);
        } else {
          switch(permFuncName) {
            case "Add": {
              const [target, qty] = value.split(/:/);
              (<BladesActor>effect.parent).update({[target]: U.pInt(getProperty(<BladesActor>effect.parent, target)) + U.pInt(qty)});
            }
            // no default
          }
        }
      }
    });

    Hooks.on("applyActiveEffect", (actor: BladesActor, changeData: EffectChangeData) => {

      if (!(actor instanceof BladesActor)) { return }

      if (changeData.key in CUSTOMFUNCS) {
        const funcData: BladesCustomFuncData = {
          funcName: changeData.key as BladesCustomFuncName,
          funcData: changeData.value,
          isReversing: false
        };
        BladesActiveEffect.ThrottleCustomFunc(actor, funcData);
      }
    });

    Hooks.on("updateActiveEffect", (effect: BladesActiveEffect, {disabled}: {disabled: boolean}) => {
      if (!(effect.parent instanceof BladesActor)) { return }
      const customEffects = effect.changes.filter((changes: EffectChangeData) => changes.mode === 0);
      customEffects.forEach(({key, value}) => {
        const funcData: BladesCustomFuncData = {
          funcName: key as BladesCustomFuncName,
          funcData: value,
          isReversing: disabled
        };
        BladesActiveEffect.ThrottleCustomFunc(effect.parent as BladesActor, funcData);
      });
    });

    Hooks.on("deleteActiveEffect", (effect: BladesActiveEffect) => {
      if (!(effect.parent instanceof BladesActor)) { return }
      const customEffects = effect.changes.filter((changes: EffectChangeData) => changes.mode === 0);
      customEffects.forEach(({key, value}) => {
        const funcData: BladesCustomFuncData = {
          funcName: key as BladesCustomFuncName,
          funcData: value,
          isReversing: true
        };
        BladesActiveEffect.ThrottleCustomFunc(effect.parent as BladesActor, funcData);
      });
    });
  }

  static ThrottleCustomFunc(actor: BladesActor, data: BladesCustomFuncData) {
    const {funcName, funcData, isReversing} = data;
    if (!actor.id) { return }
    eLog.display(`Throttling Func: ${funcName}(${funcData}, ${isReversing})`);
    // Is there a currently-running function for this actor?
    if (actor.id && actor.id in FUNCQUEUE) {
      // Is this a duplicate of a function already queued?
      const matchingQueue = FUNCQUEUE[actor.id].queue.find((fData: BladesCustomFuncData) => JSON.stringify(fData) === JSON.stringify(data));
      eLog.checkLog("activeEffects", "... Checking Queue", {data, FUNCQUEUE: FUNCQUEUE[actor.id], matchingQueue});
      if (matchingQueue) {
        eLog.error("... Function ALREADY QUEUED, SKIPPING");
        return;
      }
      FUNCQUEUE[actor.id].queue.push(data);
      return;
    }
    // If not, create FUNCQUEUE entry and run first function.
    eLog.display("... Creating New FUNCQUEUE, RUNNING:");
    FUNCQUEUE[actor.id] = {
      curFunc: BladesActiveEffect.RunCustomFunc(actor, CUSTOMFUNCS[funcName](actor, funcData, isReversing)),
      queue: []
    };
  }

  static async RunCustomFunc(actor: BladesActor, funcPromise: Promise<void>): Promise<void> {
    if (!actor.id) { return }
    eLog.checkLog("activeEffects", "... Running Func ...");
    await funcPromise;
    eLog.checkLog("activeEffects", "... Function Complete!");
    if (FUNCQUEUE[actor.id].queue.length) {
      const {funcName, funcData, isReversing} = FUNCQUEUE[actor.id].queue.shift()!;
      eLog.display(`Progressing Queue: ${funcName}(${funcData}, ${isReversing}) -- ${FUNCQUEUE[actor.id].queue.length} remaining funcs.`);
      FUNCQUEUE[actor.id].curFunc = BladesActiveEffect.RunCustomFunc(actor, CUSTOMFUNCS[funcName](actor, funcData, isReversing));
    } else {
      eLog.display("Function Queue Complete! Deleting.");
      delete FUNCQUEUE[actor.id];
    }
  }
  /**
   * Manage Active Effect instances through the Actor Sheet via effect control buttons.
   * @param {MouseEvent} event      The left-click event on the effect control
   * @param {Actor|Item} owner      The owning entity which manages this effect
   */
  static onManageActiveEffect(event: ClickEvent, owner: Actor|Item) {
    event.preventDefault();
    const a = event.currentTarget as HTMLElement;
    if (a.dataset.action === "create") {
      return owner.createEmbeddedDocuments("ActiveEffect", [{
        name: "New Effect",
        icon: "systems/eunos-blades/assets/icons/Icon.3_13.png",
        origin: owner.uuid
      }]);
    }
    const selector = a.closest("tr");
    if (selector === null) { return null }
    const effect = selector.dataset.effectId ? owner.effects.get(selector.dataset.effectId) as BladesActiveEffect : null;
    if (!effect) { return null }
    switch ( a.dataset.action ) {
      case "edit":
        return effect.sheet?.render(true);
      case "delete":
        eLog.checkLog("activeEffects", "delete effect");
        return effect.delete();
      case "toggle":
        return effect.update({disabled: !effect.disabled});
      // no default
    }
    return null;
  }

  override get isSuppressed() {
    // Get source item from 'origin' field -- of form 'Actor.<id>.Item.<id>'
    if (!/Actor.*Item/.test(this.origin)) { return super.isSuppressed }
    const [actorID, itemID] = this.origin.replace(/Actor\.|Item\./g, "").split(".");
    const actor = game.actors.get(actorID) as BladesActor;
    const item = actor.items.get(itemID) as BladesItem;
    return super.isSuppressed || item?.hasTag(Tag.System.Archived);
  }
}

declare interface BladesActiveEffect {
  origin: string
  disabled: boolean
  changes: EffectChangeData[]
  updateSource(updateData: List<any>): Promise<void>
}

export default BladesActiveEffect;