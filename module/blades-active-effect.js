/* ****▌███████████████████████████████████████████████████████████████████████████▐**** *\
|*     ▌████░░░░░░░░░░░ Euno's Blades in the Dark for Foundry VTT ░░░░░░░░░░░░░████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░ by Eunomiac ░░░░░░░░░░░░░██████████████████▐     *|
|*     ▌████████████████████████████  License █ v0.1.0 ████████████████████████████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░░░░░░  ░░░░░░░░░░░░░░░░░░███████████████████▐     *|
\* ****▌███████████████████████████████████████████████████████████████████████████▐**** */

import U from "./core/utilities.js";
import { Tag, BladesPhase } from "./core/constants.js";
const FUNCQUEUE = {};
const CUSTOMFUNCS = {
    addItem: async (actor, funcData, isReversing = false) => {
        eLog.checkLog("activeEffects", "addItem", { actor, funcData, isReversing });
        if (!actor) {
            return undefined;
        }
        if (actor.hasActiveSubItemOf(funcData)) {
            if (isReversing) {
                return actor.remSubItem(funcData);
            }
        }
        else {
            if (!isReversing) {
                return actor.addSubItem(funcData);
            }
        }
        return undefined;
    },
    addIfChargen: async (actor, funcData, isReversing = false) => {
        eLog.checkLog("activeEffects", "addIfChargen", { actor, funcData, isReversing });
        if (!actor) {
            return undefined;
        }
        if (!isReversing && game.eunoblades.Tracker.system.phase !== BladesPhase.CharGen) {
            return undefined;
        }
        const [target, qty] = funcData.split(/:/);
        if (isReversing) {
            return actor.update({ [target]: U.pInt(getProperty(actor, target)) - U.pInt(qty) });
        }
        return actor.update({ [target]: U.pInt(getProperty(actor, target)) + U.pInt(qty) });
    },
    remItem: async (actor, funcData, isReversing = false) => {
        if (!actor) {
            return undefined;
        }
        function testString(targetString, testDef) {
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
            const { type, tags, name } = JSON.parse(funcData);
            let activeSubItems = actor.activeSubItems;
            if (activeSubItems.length === 0) {
                return undefined;
            }
            if (name) {
                activeSubItems = activeSubItems.filter((item) => testString(item.name, name));
            }
            if (activeSubItems.length === 0) {
                return undefined;
            }
            if (type) {
                activeSubItems = activeSubItems.filter((item) => testString(item.type, type));
            }
            if (activeSubItems.length === 0) {
                return undefined;
            }
            if (tags) {
                activeSubItems = activeSubItems.filter((item) => item.hasTag(...tags));
            }
            if (activeSubItems.length === 0) {
                return undefined;
            }
            eLog.checkLog("activeEffects", "remItem - JSON OBJECT", { actor, funcData: JSON.parse(funcData), isReversing, activeSubItems });
            activeSubItems.forEach((item) => actor.remSubItem(item));
        }
        eLog.checkLog("activeEffects", "remItem", { actor, funcData, isReversing });
        if (actor.hasActiveSubItemOf(funcData)) {
            return actor.remSubItem(funcData);
        }
        if (isReversing) {
            return actor.addSubItem(funcData);
        }
        return undefined;
    }
};
class BladesActiveEffect extends ActiveEffect {
    static Initialize() {
        CONFIG.ActiveEffect.documentClass = BladesActiveEffect;
        Hooks.on("preCreateActiveEffect", async (effect) => {
            
            const [permChanges, changes] = U.partition(effect.changes, (change) => /^perm/.test(change.key));
            await effect.updateSource({ changes });
            for (const permChange of permChanges) {
                const { key, value } = permChange;
                const permFuncName = key.replace(/^perm/, "");
                if (permFuncName in CUSTOMFUNCS) {
                    const funcData = {
                        funcName: permFuncName,
                        funcData: value,
                        isReversing: false
                    };
                    BladesActiveEffect.ThrottleCustomFunc(effect.parent, funcData);
                }
                else {
                    switch (permFuncName) {
                        case "Add": {
                            const [target, qty] = value.split(/:/);
                            effect.parent.update({ [target]: U.pInt(getProperty(effect.parent, target)) + U.pInt(qty) });
                        }
                    }
                }
            }
        });
        Hooks.on("applyActiveEffect", (actor, changeData) => {
            if (changeData.key in CUSTOMFUNCS) {
                const funcData = {
                    funcName: changeData.key,
                    funcData: changeData.value,
                    isReversing: false
                };
                BladesActiveEffect.ThrottleCustomFunc(actor, funcData);
            }
        });
        Hooks.on("updateActiveEffect", (effect, { disabled }) => {
            const customEffects = effect.changes.filter((changes) => changes.mode === 0);
            customEffects.forEach(({ key, value }) => {
                const funcData = {
                    funcName: key,
                    funcData: value,
                    isReversing: disabled
                };
                BladesActiveEffect.ThrottleCustomFunc(effect.parent, funcData);
            });
        });
        Hooks.on("deleteActiveEffect", (effect) => {
            const customEffects = effect.changes.filter((changes) => changes.mode === 0);
            customEffects.forEach(({ key, value }) => {
                const funcData = {
                    funcName: key,
                    funcData: value,
                    isReversing: true
                };
                BladesActiveEffect.ThrottleCustomFunc(effect.parent, funcData);
            });
        });
    }
    static ThrottleCustomFunc(actor, data) {
        const { funcName, funcData, isReversing } = data;
        if (!actor.id) {
            return;
        }
        eLog.display(`Throttling Func: ${funcName}(${funcData}, ${isReversing})`);
        if (actor.id && actor.id in FUNCQUEUE) {
            const matchingQueue = FUNCQUEUE[actor.id].queue.find((fData) => JSON.stringify(fData) === JSON.stringify(data));
            eLog.checkLog("activeEffects", "... Checking Queue", { data, FUNCQUEUE: FUNCQUEUE[actor.id], matchingQueue });
            if (matchingQueue) {
                eLog.error("... Function ALREADY QUEUED, SKIPPING");
                return;
            }
            FUNCQUEUE[actor.id].queue.push(data);
            return;
        }
        eLog.display("... Creating New FUNCQUEUE, RUNNING:");
        FUNCQUEUE[actor.id] = {
            curFunc: BladesActiveEffect.RunCustomFunc(actor, CUSTOMFUNCS[funcName](actor, funcData, isReversing)),
            queue: []
        };
    }
    static async RunCustomFunc(actor, funcPromise) {
        if (!actor.id) {
            return;
        }
        eLog.checkLog("activeEffects", "... Running Func ...");
        await funcPromise;
        eLog.checkLog("activeEffects", "... Function Complete!");
        if (FUNCQUEUE[actor.id].queue.length) {
            const { funcName, funcData, isReversing } = FUNCQUEUE[actor.id].queue.shift();
            eLog.display(`Progressing Queue: ${funcName}(${funcData}, ${isReversing}) -- ${FUNCQUEUE[actor.id].queue.length} remaining funcs.`);
            FUNCQUEUE[actor.id].curFunc = BladesActiveEffect.RunCustomFunc(actor, CUSTOMFUNCS[funcName](actor, funcData, isReversing));
        }
        else {
            eLog.display("Function Queue Complete! Deleting.");
            delete FUNCQUEUE[actor.id];
        }
    }
        static onManageActiveEffect(event, owner) {
        event.preventDefault();
        const a = event.currentTarget;
        if (a.dataset.action === "create") {
            return owner.createEmbeddedDocuments("ActiveEffect", [{
                    label: "New Effect",
                    icon: "systems/eunos-blades/assets/icons/Icon.3_13.png",
                    origin: owner.uuid
                }]);
        }
        const selector = a.closest("tr");
        if (selector === null) {
            return null;
        }
        const effect = selector.dataset.effectId ? owner.effects.get(selector.dataset.effectId) : null;
        if (!effect) {
            return null;
        }
        switch (a.dataset.action) {
            case "edit":
                return effect.sheet?.render(true);
            case "delete":
                eLog.checkLog("activeEffects", "delete effect");
                return effect.delete();
            case "toggle":
                return effect.update({ disabled: !effect.disabled });
        }
        return null;
    }
    get isSuppressed() {
        if (!/Actor.*Item/.test(this.origin)) {
            return super.isSuppressed;
        }
        const [actorID, itemID] = this.origin.replace(/Actor\.|Item\./g, "").split(".");
        const actor = game.actors.get(actorID);
        const item = actor.items.get(itemID);
        return super.isSuppressed || item?.hasTag(Tag.System.Archived);
    }
}
export default BladesActiveEffect;