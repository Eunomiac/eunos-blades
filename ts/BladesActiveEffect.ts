import BladesActor from "./BladesActor";
import U from "./core/utilities";
import BladesItem from "./BladesItem";
import {Tag, BladesPhase, BladesActorType} from "./core/constants";
import type {ActiveEffectDataConstructorData} from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/activeEffectData";
import {DocumentModificationOptions} from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/abstract/document.mjs";

const FUNCQUEUE: Record<string, {
  curFunc: Promise<void>,
  queue: BladesCustomFuncData[]
}> = {};
// {type: "ability", name: "rX:/^(?!Ghost)/"}
const CUSTOMFUNCS: Record<string, (actor: BladesActor, funcData: string, effect?: BladesActiveEffect, isReversing?: boolean) => Promise<void>> = {
  addItem: async (actor: BladesActor, funcData: string, _, isReversing = false) => {
    eLog.checkLog("activeEffects", "addItem", {actor, funcData, isReversing});
    if (actor.hasActiveSubItemOf(funcData)) {
      if (isReversing) {
        return actor.remSubItem(funcData);
      }
    } else if (!isReversing) {
      return actor.addSubItem(funcData);
    }
    return undefined;
  },
  addIfChargen: async (actor, funcData, _, isReversing = false) => {
    eLog.checkLog("activeEffects", "addIfChargen", {actor, funcData, isReversing});
    if (!isReversing && game.eunoblades.Tracker?.system.phase !== BladesPhase.CharGen) { return }
    const [target, qty] = funcData.split(/:/);
    if (isReversing) {
      await actor.update({[target]: U.pInt(getProperty(actor, target)) - U.pInt(qty)});
      return;
    }
    await actor.update({[target]: U.pInt(getProperty(actor, target)) + U.pInt(qty)});
  },
  upgradeIfChargen: async (actor, funcData, _, isReversing = false) => {
    eLog.checkLog("activeEffects", "upgradeIfChargen", {actor, funcData, isReversing});
    if (!isReversing && game.eunoblades.Tracker?.system.phase !== BladesPhase.CharGen) { return }
    const [target, qty] = funcData.split(/:/);
    if (getProperty(actor, target) < U.pInt(qty)) {
      await actor.update({[target]: U.pInt(qty)});
    }
  },
  APPLYTOMEMBERS: async () => new Promise(() => undefined),
  APPLYTOCOHORTS: async () => new Promise(() => undefined),
  remItem: async (actor, funcData, _, isReversing = false) => {

    function testString(targetString: string, testDef: string) {
      if (testDef.startsWith("rX")) {
        const pat = new RegExp(testDef.replace(/^rX:\/(.*?)\//, "$1"));
        return pat.test(targetString);
      }
      return targetString === testDef;
    }

    if (funcData.startsWith("{")) {
      if (isReversing) {
        console.error("Cannot reverse a 'remItem' custom effect that was defined with a JSON object.");
        return undefined;
      }
      const {type, tags, name} = JSON.parse(funcData);
      let activeSubItems = actor.activeSubItems;
      if (activeSubItems.length === 0) { return undefined }
      if (name) { activeSubItems = activeSubItems.filter((item) => testString(item.name, name)) }
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

enum EffectMode {
  Custom,
  Multiply,
  Add,
  Downgrade,
  Upgrade,
  Override
}

type EffectChangeData = {
  key: string,
  mode: EffectMode,
  priority: number|null,
  value: string
};

type BladesCustomFuncName = KeyOf<typeof CUSTOMFUNCS>;
type BladesCustomFuncData = {
  funcName: BladesCustomFuncName,
  funcData: string,
  isReversing: boolean,
  effect: BladesActiveEffect
}

class BladesActiveEffect extends ActiveEffect {
  static Initialize() {
    CONFIG.ActiveEffect.documentClass = BladesActiveEffect;

    Hooks.on("preCreateActiveEffect", async (effect: BladesActiveEffect) => {

      eLog.checkLog3("effect", "PRECREATE ActiveEffect", {effect, parent: effect.parent?.name});

      if (!(effect.parent instanceof BladesActor)) { return }

      // Does this effect have an "APPLYTOMEMBERS" or "APPLYTOCOHORTS" CUSTOM effect?
      if (effect.changes.some((change) => change.key === "APPLYTOMEMBERS")) {

        if (BladesActor.IsType(effect.parent, BladesActorType.pc) && BladesActor.IsType(effect.parent.crew, BladesActorType.crew)) {
          const otherMembers = effect.parent.crew.members.filter((member) => member.id !== effect.parent?.id);
          if (otherMembers.length > 0) {
            // If PC & APPLYTOMEMBERS   --> Create effect on members MINUS the 'APPLYTOMEMBERS' key, leave PC's effect unchanged.
            effect.changes = effect.changes.filter((change) => change.key !== "APPLYTOMEMBERS");
            await Promise.all(otherMembers.map(async (member) => member.createEmbeddedDocuments("ActiveEffect", [effect.toJSON()])));
            // Set flag with effect's data on member, so future members can have effect applied to them.
            await effect.parent.setFlag("eunos-blades", `memberEffects.${effect.id}`, {
              appliedTo: otherMembers.map((member) => member.id),
              effect: effect.toJSON()
            });
          }
        } else if (BladesActor.IsType(effect.parent, BladesActorType.crew)) {
          const changeKey = U.pullElement(effect.changes, (change) => change.key === "APPLYTOMEMBERS");
          if (!changeKey) { return }
          if (effect.parent.members.length > 0) {
            // If Crew & APPLYTOMEMBERS --> Create effect on members MINUS the 'APPLYTOMEMBERS' key
            await Promise.all(effect.parent.members.map(async (member) => member.createEmbeddedDocuments("ActiveEffect", [effect.toJSON()])));
          }
          // Set flag with effect's data on crew, so future members can have effect applied to them.
          await effect.parent.setFlag("eunos-blades", `memberEffects.${effect.id}`, {
            appliedTo: effect.parent.members.map((member) => member.id),
            effect
          });
          // Update effect on crew-parent to only include 'APPLYTOMEMBERS' change
          await effect.updateSource({changes: [changeKey]});
        }
      } else if (effect.changes.some((change) => change.key === "APPLYTOCOHORTS")
        && (BladesActor.IsType(effect.parent, BladesActorType.pc) || BladesActor.IsType(effect.parent, BladesActorType.crew))) {
        if (effect.parent.cohorts.length > 0) {
          // If APPLYTOCOHORTS   --> Create effect on cohorts
          await Promise.all(effect.parent.cohorts.map(async (cohort) => cohort.createEmbeddedDocuments("ActiveEffect", [effect.toJSON()])));
        }
        // Set flag with effect's data on parent, so future cohorts can have effect applied to them.
        await (effect.parent as BladesActor).setFlag("eunos-blades", `cohortEffects.${effect.id}`, {
          appliedTo: effect.parent.cohorts.map((cohort) => cohort.id),
          effect
        });
        // Update effect on parent to only include 'APPLYTOCOHORTS' change
        await effect.updateSource({changes: effect.changes.filter((change) => change.key === "APPLYTOCOHORTS")});
      }

      // Partition effect.changes into permanent and non-permanent changes:
      const [permChanges, changes] = U.partition(effect.changes, (change) => change.key.startsWith("perm"));
      await effect.updateSource({changes});

      for (const permChange of permChanges) {
        const {key, value} = permChange;
        const permFuncName = key.replace(/^perm/, "");
        if (permFuncName in CUSTOMFUNCS) {
          const funcData: BladesCustomFuncData = {
            funcName: permFuncName,
            funcData: value,
            isReversing: false,
            effect
          };
          BladesActiveEffect.ThrottleCustomFunc(effect.parent as BladesActor, funcData);
        } else if (permFuncName === "Add") {
          const [target, qty] = value.split(/:/);
          effect.parent.update({[target]: U.pInt(getProperty(effect.parent, target)) + U.pInt(qty)});
        }
      }
    });

    Hooks.on("applyActiveEffect", (actor: BladesActor, changeData: EffectChangeData & {effect: BladesActiveEffect}) => {

      if (!(actor instanceof BladesActor)) { return }

      if (changeData.key in CUSTOMFUNCS) {
        const funcData: BladesCustomFuncData = {
          funcName: changeData.key,
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
          funcName: key,
          funcData: value,
          isReversing: disabled,
          effect
        };
        BladesActiveEffect.ThrottleCustomFunc(effect.parent as BladesActor, funcData);
      });
    });

    Hooks.on("deleteActiveEffect", async (effect: BladesActiveEffect) => {
      if (!(effect.parent instanceof BladesActor)) { return }

      // Does this effect have an "APPLYTOMEMBERS" or "APPLYTOCOHORTS" CUSTOM effect?
      if (effect.changes.some((change) => change.key === "APPLYTOMEMBERS")) {
        if (BladesActor.IsType(effect.parent, BladesActorType.pc) && BladesActor.IsType(effect.parent.crew, BladesActorType.crew)) {
          const otherMembers = effect.parent.crew.members.filter((member) => member.id !== effect.parent?.id);
          if (otherMembers.length > 0) {
            // If PC & APPLYTOMEMBERS   --> Delete effect on all other members.
            await Promise.all(otherMembers
              .map(async (member) => Promise.all(member.effects
                .filter((e) => e.name === effect.name)
                .map(async (e) => e.delete()))));
          }
          // Clear flag from parent
          await effect.parent.unsetFlag("eunos-blades", `memberEffects.${effect.id}`);
        } else if (BladesActor.IsType(effect.parent, BladesActorType.crew)) {
          if (effect.parent.members.length > 0) {
            // If CREW & APPLYTOMEMBERS   --> Delete effect on all other members.
            await Promise.all(effect.parent.members
              .map(async (member) => Promise.all(member.effects
                .filter((e) => e.name === effect.name)
                .map(async (e) => e.delete()))));
          }
          // Clear flag from parent
          await effect.parent.unsetFlag("eunos-blades", `memberEffects.${effect.id}`);
        }
      } else if (effect.changes.some((change) => change.key === "APPLYTOCOHORTS")
        && (BladesActor.IsType(effect.parent, BladesActorType.pc, BladesActorType.crew))) {
        if (effect.parent.cohorts.length > 0) {
          // If APPLYTOCOHORTS   --> Delete effect on cohorts.
          await Promise.all(effect.parent.cohorts
            .map(async (cohort) => Promise.all(cohort.effects
              .filter((e) => e.name === effect.name)
              .map(async (e) => e.delete()))));
        }
        // Clear flag from parent
        await effect.parent.unsetFlag("eunos-blades", `cohortEffects.${effect.id}`);
      }

      const customEffects = effect.changes.filter((changes: EffectChangeData) => changes.mode === 0);
      customEffects.forEach(({key, value}) => {
        const funcData: BladesCustomFuncData = {
          funcName: key,
          funcData: value,
          isReversing: true,
          effect
        };
        BladesActiveEffect.ThrottleCustomFunc(effect.parent as BladesActor, funcData);
      });
    });
  }

  static async AddActiveEffect(doc: BladesDoc, name: string, eChanges: EffectChangeData|EffectChangeData[], icon = "systems/eunos-blades/assets/icons/effect-icons/default.png") {
    const changes = [eChanges].flat();
    await doc.createEmbeddedDocuments("ActiveEffect", [{name, icon, changes}]);
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
      const {funcName, funcData, isReversing, effect} = FUNCQUEUE[actor.id].queue.shift() ?? {};
      if (!funcName || !(funcName in CUSTOMFUNCS)) { return }
      if (!funcData) { return }
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
    const a = event.currentTarget;
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
      default: return null;
    }
  }

  override async _preCreate(data: ActiveEffectDataConstructorData, options: DocumentModificationOptions, user: User) {
    eLog.checkLog3("effect", "ActiveEffect._preCreate()", {data, options, user});
    await super._preCreate(data, options, user);
  }
  override _onDelete(options: DocumentModificationOptions, userID: string) {
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
  icon: string,
  origin: string
  disabled: boolean
  changes: EffectChangeData[]
  updateSource(updateData: {changes: EffectChangeData[]}): Promise<void>
}

export default BladesActiveEffect;