import BladesActor from "../BladesActor.js";
import U from "../core/utilities.js";
import { Tag, BladesPhase, BladesActorType } from "../core/constants.js";
const FUNCQUEUE = {};
// {type: "ability", name: "rX:/^(?!Ghost)/"}
const CUSTOMFUNCS = {
    addItem: async (actor, funcData, _, isReversing = false) => {
        eLog.checkLog("activeEffects", "addItem", { actor, funcData, isReversing });
        if (actor.hasActiveSubItemOf(funcData)) {
            if (isReversing) {
                return actor.remSubItem(funcData);
            }
        }
        else if (!isReversing) {
            return actor.addSubItem(funcData);
        }
        return undefined;
    },
    addIfChargen: async (actor, funcData, _, isReversing = false) => {
        eLog.checkLog("activeEffects", "addIfChargen", { actor, funcData, isReversing });
        if (!isReversing && game.eunoblades.Tracker?.system.phase !== BladesPhase.CharGen) {
            return;
        }
        const [target, qty] = funcData.split(/:/);
        if (isReversing) {
            await actor.update({ [target]: U.pInt(getProperty(actor, target)) - U.pInt(qty) });
            return;
        }
        await actor.update({ [target]: U.pInt(getProperty(actor, target)) + U.pInt(qty) });
    },
    upgradeIfChargen: async (actor, funcData, _, isReversing = false) => {
        eLog.checkLog("activeEffects", "upgradeIfChargen", { actor, funcData, isReversing });
        if (!isReversing && game.eunoblades.Tracker?.system.phase !== BladesPhase.CharGen) {
            return;
        }
        const [target, qty] = funcData.split(/:/);
        if (getProperty(actor, target) < U.pInt(qty)) {
            await actor.update({ [target]: U.pInt(qty) });
        }
    },
    APPLYTOMEMBERS: async () => undefined,
    APPLYTOCOHORTS: async () => undefined,
    remItem: async (actor, funcData, _, isReversing = false) => {
        function testString(targetString, testDef) {
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
var EffectMode;
(function (EffectMode) {
    EffectMode[EffectMode["Custom"] = 0] = "Custom";
    EffectMode[EffectMode["Multiply"] = 1] = "Multiply";
    EffectMode[EffectMode["Add"] = 2] = "Add";
    EffectMode[EffectMode["Downgrade"] = 3] = "Downgrade";
    EffectMode[EffectMode["Upgrade"] = 4] = "Upgrade";
    EffectMode[EffectMode["Override"] = 5] = "Override";
})(EffectMode || (EffectMode = {}));
class BladesActiveEffect extends ActiveEffect {
    static Initialize() {
        CONFIG.ActiveEffect.documentClass = BladesActiveEffect;
        Hooks.on("preCreateActiveEffect", async (effect) => {
            eLog.checkLog3("effect", "PRECREATE ActiveEffect", { effect, parent: effect.parent?.name });
            if (!(effect.parent instanceof BladesActor)) {
                return;
            }
            // Does this effect have an "APPLYTOMEMBERS" or "APPLYTOCOHORTS" CUSTOM effect?
            if (effect.changes.some((change) => change.key === "APPLYTOMEMBERS")) {
                if (BladesActor.IsType(effect.parent, BladesActorType.pc)
                    && BladesActor.IsType(effect.parent.crew, BladesActorType.crew)) {
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
                }
                else if (BladesActor.IsType(effect.parent, BladesActorType.crew)) {
                    const changeKey = U.pullElement(effect.changes, (change) => change.key === "APPLYTOMEMBERS");
                    if (!changeKey) {
                        return;
                    }
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
                    await effect.updateSource({ changes: [changeKey] });
                }
            }
            else if (effect.changes.some((change) => change.key === "APPLYTOCOHORTS")
                && (BladesActor.IsType(effect.parent, BladesActorType.pc)
                    || BladesActor.IsType(effect.parent, BladesActorType.crew))) {
                if (effect.parent.cohorts.length > 0) {
                    // If APPLYTOCOHORTS   --> Create effect on cohorts
                    await Promise.all(effect.parent.cohorts.map(async (cohort) => cohort.createEmbeddedDocuments("ActiveEffect", [effect.toJSON()])));
                }
                // Set flag with effect's data on parent, so future cohorts can have effect applied to them.
                await effect.parent.setFlag("eunos-blades", `cohortEffects.${effect.id}`, {
                    appliedTo: effect.parent.cohorts.map((cohort) => cohort.id),
                    effect
                });
                // Update effect on parent to only include 'APPLYTOCOHORTS' change
                await effect.updateSource({ changes: effect.changes.filter((change) => change.key === "APPLYTOCOHORTS") });
            }
            // Partition effect.changes into permanent and non-permanent changes:
            const [permChanges, changes] = U.partition(effect.changes, (change) => change.key.startsWith("perm"));
            await effect.updateSource({ changes });
            for (const permChange of permChanges) {
                const { key, value } = permChange;
                const permFuncName = key.replace(/^perm/, "");
                if (permFuncName in CUSTOMFUNCS) {
                    const funcData = {
                        funcName: permFuncName,
                        funcData: value,
                        isReversing: false,
                        effect
                    };
                    BladesActiveEffect.ThrottleCustomFunc(effect.parent, funcData);
                }
                else if (permFuncName === "Add") {
                    const [target, qty] = value.split(/:/);
                    effect.parent.update({ [target]: U.pInt(getProperty(effect.parent, target)) + U.pInt(qty) });
                }
            }
        });
        Hooks.on("applyActiveEffect", (actor, changeData) => {
            if (!(actor instanceof BladesActor)) {
                return;
            }
            if (changeData.key in CUSTOMFUNCS) {
                const funcData = {
                    funcName: changeData.key,
                    funcData: changeData.value,
                    isReversing: false,
                    effect: changeData.effect
                };
                BladesActiveEffect.ThrottleCustomFunc(actor, funcData);
            }
        });
        Hooks.on("updateActiveEffect", (effect, { disabled }) => {
            if (!(effect.parent instanceof BladesActor)) {
                return;
            }
            const customEffects = effect.changes.filter((changes) => changes.mode === 0);
            customEffects.forEach(({ key, value }) => {
                const funcData = {
                    funcName: key,
                    funcData: value,
                    isReversing: disabled,
                    effect
                };
                BladesActiveEffect.ThrottleCustomFunc(effect.parent, funcData);
            });
        });
        Hooks.on("deleteActiveEffect", async (effect) => {
            if (!(effect.parent instanceof BladesActor)) {
                return;
            }
            // Does this effect have an "APPLYTOMEMBERS" or "APPLYTOCOHORTS" CUSTOM effect?
            if (effect.changes.some((change) => change.key === "APPLYTOMEMBERS")) {
                if (BladesActor.IsType(effect.parent, BladesActorType.pc)
                    && BladesActor.IsType(effect.parent.crew, BladesActorType.crew)) {
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
                }
                else if (BladesActor.IsType(effect.parent, BladesActorType.crew)) {
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
            }
            else if (effect.changes.some((change) => change.key === "APPLYTOCOHORTS")
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
            const customEffects = effect.changes.filter((changes) => changes.mode === 0);
            customEffects.forEach(({ key, value }) => {
                const funcData = {
                    funcName: key,
                    funcData: value,
                    isReversing: true,
                    effect
                };
                BladesActiveEffect.ThrottleCustomFunc(effect.parent, funcData);
            });
        });
    }
    static async AddActiveEffect(doc, name, eChanges, icon = "systems/eunos-blades/assets/icons/effect-icons/default.png") {
        const changes = [eChanges].flat();
        await doc.createEmbeddedDocuments("ActiveEffect", [{ name, icon, changes }]);
    }
    static ThrottleCustomFunc(actor, data) {
        const { funcName, funcData, isReversing, effect } = data;
        if (!actor.id) {
            return;
        }
        eLog.checkLog3("activeEffect", `Throttling Func: ${funcName}(${funcData}, ${isReversing})`);
        // Is there a currently-running function for this actor?
        if (actor.id && actor.id in FUNCQUEUE) {
            // Is this a duplicate of a function already queued?
            const matchingQueue = FUNCQUEUE[actor.id].queue
                .find((fData) => JSON.stringify(fData) === JSON.stringify(data));
            eLog.checkLog("activeEffects", "... Checking Queue", { data, FUNCQUEUE: FUNCQUEUE[actor.id], matchingQueue });
            if (matchingQueue) {
                eLog.error("... Function ALREADY QUEUED, SKIPPING");
                return;
            }
            FUNCQUEUE[actor.id].queue.push(data);
            return;
        }
        // If not, create FUNCQUEUE entry and run first function.
        eLog.checkLog3("activeEffect", "... Creating New FUNCQUEUE, RUNNING:");
        FUNCQUEUE[actor.id] = {
            curFunc: BladesActiveEffect.RunCustomFunc(actor, CUSTOMFUNCS[funcName](actor, funcData, effect, isReversing)),
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
            const { funcName, funcData, isReversing, effect } = FUNCQUEUE[actor.id].queue.shift() ?? {};
            if (!funcName || !(funcName in CUSTOMFUNCS)) {
                return;
            }
            if (!funcData) {
                return;
            }
            eLog.checkLog3("activeEffect", `Progressing Queue: ${funcName}(${funcData}, ${isReversing}) -- ${FUNCQUEUE[actor.id].queue.length} remaining funcs.`);
            FUNCQUEUE[actor.id].curFunc = BladesActiveEffect.RunCustomFunc(actor, CUSTOMFUNCS[funcName](actor, funcData, effect, isReversing));
        }
        else {
            eLog.checkLog3("activeEffect", "Function Queue Complete! Deleting.");
            delete FUNCQUEUE[actor.id];
        }
    }
    /**
     * Manage Active Effect instances through the Actor Sheet via effect control buttons.
     * @param {MouseEvent} event      The left-click event on the effect control
     * @param {Actor|Item} owner      The owning entity which manages this effect
     */
    static onManageActiveEffect(event, owner) {
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
        if (selector === null) {
            return null;
        }
        const effect = selector.dataset.effectId
            ? owner.effects.get(selector.dataset.effectId)
            : null;
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
            default: return null;
        }
    }
    async _preCreate(data, options, user) {
        eLog.checkLog3("effect", "ActiveEffect._preCreate()", { data, options, user });
        await super._preCreate(data, options, user);
    }
    _onDelete(options, userID) {
        eLog.checkLog3("effect", "ActiveEffect._onDelete()", { options, userID });
        super._onDelete(options, userID);
    }
    get isSuppressed() {
        // Get source item from "origin.js" field -- of form 'Actor.<id>.Item.<id>'
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
