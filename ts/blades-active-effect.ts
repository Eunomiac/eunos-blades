import BladesActor from "./blades-actor.js";
import U from "./core/utilities.js";
import BladesItem from "./blades-item.js";
import {Tag, BladesPhase, BladesActorType, BladesItemType, Attribute, InsightActions, ProwessActions, ResolveActions} from "./core/constants.js";

const FUNCQUEUE: Record<string, {
  curFunc: Promise<void>,
  queue: BladesCustomFuncData[]
}> = {};
// {type: "ability", name: "rX:/^(?!Ghost)/"}
const CUSTOMFUNCS: Record<string, (actor: BladesActor, funcData: string, effect: BladesActiveEffect, isReversing: boolean) => Promise<void>> = {
  addItem: async (actor: BladesActor, funcData: string, effect, isReversing = false) => {
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
  addIfChargen: async (actor, funcData, effect, isReversing = false) => {
    eLog.checkLog("activeEffects", "addIfChargen", {actor, funcData, isReversing});
    if (!isReversing && game.eunoblades.Tracker!.system.phase !== BladesPhase.CharGen) { return undefined }
    const [target, qty] = funcData.split(/:/);
    if (isReversing) {
      return actor.update({[target]: U.pInt(getProperty(actor, target)) - U.pInt(qty)});
    }
    return actor.update({[target]: U.pInt(getProperty(actor, target)) + U.pInt(qty)});
  },
  upgradeIfChargen: async (actor, funcData, effect, isReversing = false) => {
    eLog.checkLog("activeEffects", "upgradeIfChargen", {actor, funcData, isReversing});
    if (!isReversing && game.eunoblades.Tracker!.system.phase !== BladesPhase.CharGen) { return undefined }
    const [target, qty] = funcData.split(/:/);
    if (getProperty(actor, target) < U.pInt(qty)) {
      return actor.update({[target]: U.pInt(qty)});
    }
    return undefined;
  },
  APPLYTOMEMBERS: async () => { return undefined },
  APPLYTOCOHORTS: async () => { return undefined },
  remItem: async (actor, funcData, effect, isReversing = false) => {

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
  isReversing: boolean,
  effect: BladesActiveEffect
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

      eLog.checkLog3("effect", "TESTING PRE CREATE", {parent: effect.parent?.name});

      if (!(effect.parent instanceof BladesActor)) { return }

      // Does this effect have an "APPLYTOMEMBERS" or "APPLYTOCOHORTS" CUSTOM effect?
      if (BladesActor.IsType(effect.parent, BladesActorType.crew)) {
        if (effect.parent.members.length > 0 && effect.changes.some((change) => change.key === "APPLYTOMEMBERS")) {
          // Copy the effect, apply it to all members of the crew, then delete changes from original effect so only the APPLYTOMEMBERS key remains.
          // @ts-expect-error Useless typing for createEmbeddedDocuments
          await Promise.all(effect.parent.members.map(async (member) => member.createEmbeddedDocuments("ActiveEffect", [effect])));
          await effect.updateSource({changes: effect.changes.filter((change) => change.key === "APPLYTOMEMBERS")});
        } else if (effect.parent.cohorts.length > 0 && effect.changes.some((change) => change.key === "APPLYTOCOHORTS")) {
          // Copy the effect, apply it to all cohorts of the crew, then delete changes from original effect so only the APPLYTOCOHORTS key remains.
          // @ts-expect-error Useless typing for createEmbeddedDocuments
          await Promise.all(effect.parent.cohorts.map(async (cohort) => cohort.createEmbeddedDocuments("ActiveEffect", [effect])));
          await effect.updateSource({changes: effect.changes.filter((change) => change.key === "APPLYTOCOHORTS")});
        }
        return;
      }

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
            isReversing: false,
            effect
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
          isReversing: false,
          effect: changeData.effect
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
          isReversing: disabled,
          effect
        };
        BladesActiveEffect.ThrottleCustomFunc(effect.parent as BladesActor, funcData);
      });
    });

    Hooks.on("deleteActiveEffect", async (effect: BladesActiveEffect) => {
      if (!(effect.parent instanceof BladesActor)) { return }

      if (BladesActor.IsType(effect.parent, BladesActorType.crew)) {
        // Does this effect have an "APPLYTOMEMBERS" / "APPLYTOCOHORTS" CUSTOM effect?
        if (effect.parent.members.length > 0 && effect.changes.some((change) => change.key === "APPLYTOMEMBERS")) {
          // Delete matching ActiveEffects from all members.
          await Promise.all(effect.parent.members
            .map(async (member) => Promise.all(member.effects
              .filter((e) => e.name === effect.name)
              .map(async (e) => e.delete()))));
        } else if (effect.parent.cohorts.length > 0 && effect.changes.some((change) => change.key === "APPLYTOCOHORTS")) {
          // Delete matching ActiveEffects from all cohorts.
          await Promise.all(effect.parent.cohorts
            .map(async (cohort) => Promise.all(cohort.effects
              .filter((e) => e.name === effect.name)
              .map(async (e) => e.delete()))));

        }
      }
      const customEffects = effect.changes.filter((changes: EffectChangeData) => changes.mode === 0);
      customEffects.forEach(({key, value}) => {
        const funcData: BladesCustomFuncData = {
          funcName: key as BladesCustomFuncName,
          funcData: value,
          isReversing: true,
          effect
        };
        BladesActiveEffect.ThrottleCustomFunc(effect.parent as BladesActor, funcData);
      });
    });
  }

  static ThrottleCustomFunc(actor: BladesActor, data: BladesCustomFuncData) {
    const {funcName, funcData, isReversing, effect} = data;
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
      curFunc: BladesActiveEffect.RunCustomFunc(actor, CUSTOMFUNCS[funcName](actor, funcData, effect, isReversing)),
      queue: []
    };
  }

  static async RunCustomFunc(actor: BladesActor, funcPromise: Promise<void>): Promise<void> {
    if (!actor.id) { return }
    eLog.checkLog("activeEffects", "... Running Func ...");
    await funcPromise;
    eLog.checkLog("activeEffects", "... Function Complete!");
    if (FUNCQUEUE[actor.id].queue.length) {
      const {funcName, funcData, isReversing, effect} = FUNCQUEUE[actor.id].queue.shift()!;
      eLog.display(`Progressing Queue: ${funcName}(${funcData}, ${isReversing}) -- ${FUNCQUEUE[actor.id].queue.length} remaining funcs.`);
      FUNCQUEUE[actor.id].curFunc = BladesActiveEffect.RunCustomFunc(actor, CUSTOMFUNCS[funcName](actor, funcData, effect, isReversing));
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
        name: owner.name,
        icon: owner.img,
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

  override async _preCreate(data: any, options: any, user: User) {
    eLog.checkLog3("effect", "ActiveEffect._preCreate()", {data, options, user});
    super._preCreate(data, options, user);
  }
  override async _onDelete(options: any, userID: string) {
    eLog.checkLog3("effect", "ActiveEffect._onDelete()", {options, userID});
    super._onDelete(options, userID);
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