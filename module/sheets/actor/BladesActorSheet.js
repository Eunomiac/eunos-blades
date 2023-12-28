// #region IMPORTS~
import U from "../../core/utilities.js";
import G, { ApplyTooltipAnimations } from "../../core/gsap.js";
import C, { BladesActorType, BladesPhase, BladesItemType, DowntimeAction, AttributeTrait, Tag, ActionTrait, Factor, RollType } from "../../core/constants.js";
import Tags from "../../core/tags.js";
import { BladesActor, BladesPC, BladesCrew } from "../../documents/BladesActorProxy.js";
import { BladesItem, BladesProject } from "../../documents/BladesItemProxy.js";
import { ApplyClockListeners } from "../../classes/BladesClock.js";
import BladesDialog from "../../classes/BladesDialog.js";
import BladesActiveEffect from "../../documents/BladesActiveEffect.js";
import BladesRoll, { BladesRollPrimary, BladesRollOpposition } from "../../classes/BladesRoll.js";
// #endregion
class BladesActorSheet extends ActorSheet {
    /**
     * Override the default getData method to provide additional data for the actor sheet.
     * This includes: cssClass, editable, isGM, actor, system, tierTotal, rollData, activeEffects,
     *                 hasFullVision, hasLimitedVision, hasControl, preparedItems.
     * @returns {BladesActorSheetData} The data object for the actor sheet.
     */
    getData() {
        // Get the base data context from the parent class.
        const context = super.getData();
        // Prepare additional data specific to this actor's sheet.
        const sheetData = {
            // Basic actor data.
            cssClass: this.actor.type,
            editable: this.options.editable,
            isGM: game.eunoblades.Tracker?.system.is_spoofing_player ? false : game.user.isGM,
            actor: this.actor,
            system: this.actor.system,
            gamePhase: game.eunoblades.Tracker?.phase || BladesPhase.Freeplay,
            tierTotal: this.actor.getFactorTotal(Factor.tier) > 0 ? U.romanizeNum(this.actor.getFactorTotal(Factor.tier)) : "0",
            rollData: this.actor.getRollData(),
            activeEffects: Array.from(this.actor.effects),
            hasFullVision: game.user.isGM
                || this.actor.testUserPermission(game.user, CONST.DOCUMENT_PERMISSION_LEVELS.OBSERVER),
            hasLimitedVision: game.user.isGM
                || this.actor.testUserPermission(game.user, CONST.DOCUMENT_PERMISSION_LEVELS.LIMITED),
            hasControl: game.user.isGM || this.actor.testUserPermission(game.user, CONST.DOCUMENT_PERMISSION_LEVELS.OWNER)
        };
        if (BladesPC.IsType(this.actor) || BladesCrew.IsType(this.actor)) {
            // Prepare items for display on the actor sheet.
            sheetData.preparedItems = {
                abilities: [],
                loadout: [],
                cohorts: {
                    gang: this.actor.cohorts
                        .filter((item) => item.type === BladesItemType.cohort_gang)
                        .map((item) => {
                        // Prepare gang cohort items.
                        const subtypes = U.unique(Object.values(item.system.subtypes)
                            .map((subtype) => subtype.trim())
                            .filter((subtype) => /[A-Za-z]/.test(subtype)));
                        const eliteSubtypes = [
                            ...Object.values(item.system.elite_subtypes)
                        ];
                        if (BladesCrew.IsType(item.parent)) {
                            eliteSubtypes.push(...(item.parent.upgrades ?? [])
                                .map((upgrade) => (upgrade.name ?? "").trim().replace(/^Elite /, "")));
                        }
                        // Prepare images for gang cohort items.
                        const imgTypes = [...U.unique(eliteSubtypes.map((subtype) => subtype.trim())
                                .filter((subtype) => /[A-Za-z]/
                                .test(subtype) && subtypes.includes(subtype)))];
                        if (imgTypes.length < 2) {
                            imgTypes.push(...subtypes.filter((subtype) => !imgTypes.includes(subtype)));
                        }
                        if (U.unique(imgTypes).length === 1) {
                            item.system.image = Object.values(item.system.elite_subtypes).includes(imgTypes[0]) ? `elite-${U.lCase(imgTypes[0])}.svg` : `${U.lCase(imgTypes[0])}.svg`;
                        }
                        else if (U.unique(imgTypes).length > 1) {
                            const [rightType, leftType] = imgTypes;
                            item.system.imageLeft = Object.values(item.system.elite_subtypes).includes(leftType) ? `elite-${U.lCase(leftType)}.svg` : `${U.lCase(leftType)}.svg`;
                            item.system.imageRight = Object.values(item.system.elite_subtypes).includes(rightType) ? `elite-${U.lCase(rightType)}.svg` : `${U.lCase(rightType)}.svg`;
                        }
                        // Prepare additional data for gang cohort items.
                        Object.assign(item.system, {
                            tierTotal: item.getFactorTotal(Factor.tier) > 0 ? U.romanizeNum(item.getFactorTotal(Factor.tier)) : "0",
                            cohortRollData: [
                                { mode: "untrained", label: "Untrained", color: "transparent", tooltip: "<p>Roll Untrained</p>" }
                            ],
                            edgeData: Object.fromEntries(Object.values(item.system.edges ?? [])
                                .filter((edge) => /[A-Za-z]/.test(edge))
                                .map((edge) => [edge.trim(), C.EdgeTooltips[edge]])),
                            flawData: Object.fromEntries(Object.values(item.system.flaws ?? [])
                                .filter((flaw) => /[A-Za-z]/.test(flaw))
                                .map((flaw) => [flaw.trim(), C.FlawTooltips[flaw]]))
                        });
                        return item;
                    }),
                    expert: this.actor.activeSubItems
                        .filter((item) => item.type === BladesItemType.cohort_expert)
                        .map((item) => {
                        // Prepare expert cohort items.
                        Object.assign(item.system, {
                            tierTotal: item.getFactorTotal(Factor.tier) > 0 ? U.romanizeNum(item.getFactorTotal(Factor.tier)) : "0",
                            cohortRollData: [
                                { mode: "untrained", label: "Untrained", tooltip: "<h2>Roll Untrained</h2>" }
                            ],
                            edgeData: Object.fromEntries(Object.values(item.system.edges ?? [])
                                .filter((edge) => /[A-Za-z]/.test(edge))
                                .map((edge) => [edge.trim(), C.EdgeTooltips[edge]])),
                            flawData: Object.fromEntries(Object.values(item.system.flaws ?? [])
                                .filter((flaw) => /[A-Za-z]/.test(flaw))
                                .map((flaw) => [flaw.trim(), C.FlawTooltips[flaw]]))
                        });
                        return item;
                    })
                }
            };
        }
        // Prepare additional data for PC and Crew actors.
        if (BladesActor.IsType(this.actor, BladesActorType.pc) || BladesActor.IsType(this.actor, BladesActorType.crew)) {
            sheetData.playbookData = {
                dotline: {
                    data: this.actor.system.experience.playbook,
                    dotlineClass: "xp-playbook",
                    target: "system.experience.playbook.value",
                    svgKey: "teeth.tall",
                    svgFull: "full|frame",
                    svgEmpty: "full|half|frame",
                    advanceButton: "advance-playbook"
                }
            };
            if (this.actor.system.experience.playbook.value !== this.actor.system.experience.playbook.max) {
                sheetData.playbookData.tooltip = (new Handlebars.SafeString([
                    "<h2>At the End of the Session, Gain XP If ...</h2>",
                    "<ul>",
                    ...Object.values(this.actor.system.experience.clues ?? []).map((line) => `<li>${line.replace(/^Y/, "... y")}</li>`) ?? [],
                    "</ul>"
                ].join(""))).toString();
            }
            sheetData.coinsData = {
                dotline: {
                    data: this.actor.system.coins,
                    target: "system.coins.value",
                    iconEmpty: "coin-full.svg",
                    iconFull: "coin-full.svg"
                }
            };
        }
        // Return the combined data context for the actor sheet.
        return {
            ...context,
            ...sheetData
        };
    }
    // #region LISTENERS & EVENT HANDLERS
    activateListeners(html) {
        super.activateListeners(html);
        // Handle removal or revealing of secret information content.
        if (game.user.isGM) {
            html.attr("style", "--secret-text-display: initial");
        }
        else {
            html.find('.editor:not(.tinymce) [data-is-secret="true"]').remove();
        }
        // ~ Tooltips
        ApplyTooltipAnimations(html);
        ApplyClockListeners(html, `Actor-${this.actor.id}`);
        Tags.InitListeners(html, this.actor);
        // Everything below here is only needed if the sheet is editable
        if (!this.options.editable) {
            return;
        }
        // Add dotline functionality
        html.find(".dotline").each((__, elem) => {
            if ($(elem).hasClass("locked")) {
                return;
            }
            let targetDoc = this.actor;
            let targetField = $(elem).data("target");
            const comp$ = $(elem).closest("comp");
            if (targetField.startsWith("item")) {
                targetField = targetField.replace(/^item\./, "");
                const itemId = $(elem).closest("[data-comp-id]").data("compId");
                if (!itemId) {
                    return;
                }
                const item = this.actor.items.get(itemId);
                if (!item) {
                    return;
                }
                targetDoc = item;
            }
            const curValue = U.pInt($(elem).data("value"));
            $(elem)
                .find(".dot")
                .each((_, dot) => {
                $(dot).on("click", (event) => {
                    event.preventDefault();
                    const thisValue = U.pInt($(dot).data("value"));
                    if (thisValue !== curValue) {
                        if (comp$.hasClass("comp-coins")
                            || comp$.hasClass("comp-stash")) {
                            G.effects
                                .fillCoins($(dot).prevAll(".dot"))
                                .then(() => targetDoc.update({ [targetField]: thisValue }));
                        }
                        else {
                            targetDoc.update({ [targetField]: thisValue });
                        }
                    }
                });
                $(dot).on("contextmenu", (event) => {
                    event.preventDefault();
                    const thisValue = U.pInt($(dot).data("value")) - 1;
                    if (thisValue !== curValue) {
                        targetDoc.update({ [targetField]: thisValue });
                    }
                });
            });
        });
        // Component Functionality: Open, Add (via SelectorDialog), Archive, Delete, Toggle, Select
        html
            .find("[data-comp-id]")
            .find(".comp-title")
            .on({ click: this._onItemOpenClick.bind(this) });
        html
            .find(".comp-control.comp-add")
            .on({ click: this._onItemAddClick.bind(this) });
        html
            .find(".comp-control.comp-delete")
            .on({ click: this._onItemRemoveClick.bind(this) });
        html
            .find(".comp-control.comp-delete-full")
            .on({ click: this._onItemFullRemoveClick.bind(this) });
        html
            .find(".comp-control.comp-toggle")
            .on({ click: this._onItemToggleClick.bind(this) });
        html
            .find(`
        select[data-action='player-select'],
        select[data-action='gm-select']
      `)
            .on({ change: this._onSelectChange.bind(this) });
        html
            .find("[data-action='toggle-value'")
            .on({ click: this._onToggleValueClick.bind(this) });
        html
            .find(".advance-button")
            .on({ click: this._onAdvanceClick.bind(this) });
        // Active Effects Functionality
        html
            .find(".effect-control")
            .on({ click: this._onActiveEffectControlClick.bind(this) });
        // Roll Functionality
        html
            .find("[data-roll-trait]")
            .on({ click: this._onRollTraitClick.bind(this) });
        // Downtime Actions
        html
            .find("[data-action*='downtime-action-']")
            .on({ click: this._onDowntimeActionClick.bind(this) });
        // This is a workaround until is being fixed in FoundryVTT.
        if (this.options.submitOnChange) {
            html.on("change", "textarea", this._onChangeInput.bind(this)); // Use delegated listener on the form
        }
    }
    async _onSubmit(event, params = {}) {
        if (!game.user.isGM && !this.actor.testUserPermission(game.user, CONST.DOCUMENT_PERMISSION_LEVELS.OWNER)) {
            eLog.checkLog("actorSheetTrigger", "User does not have permission to edit this actor", { user: game.user, actor: this.actor });
            return {};
        }
        return super._onSubmit(event, params);
    }
    async close(options) {
        if (this.actor.type === BladesActorType.pc) {
            return super.close(options).then(() => this.actor.clearSubActors());
        }
        else if (this.actor.type === BladesActorType.npc && this.actor.parentActor) {
            return super.close(options).then(() => this.actor.clearParentActor(false));
        }
        return super.close(options);
    }
    // #region Component Handlers
    _getCompData(event) {
        const elem$ = $(event.currentTarget).closest(".comp");
        const compData = {
            elem$,
            docID: elem$.data("compId"),
            docCat: elem$.data("compCat"),
            docType: elem$.data("compType"),
            docTags: (elem$.data("compTags") ?? "").split(/\s+/g)
        };
        eLog.checkLog2("dialog", "Component Data", { elem: elem$, ...compData });
        if (compData.docID && compData.docType) {
            compData.doc = {
                Actor: this.actor.getSubActor(compData.docID),
                Item: this.actor.getSubItem(compData.docID)
            }[compData.docType];
        }
        if (compData.docCat && compData.docType && (BladesPC.IsType(this.actor) || BladesCrew.IsType(this.actor))) {
            compData.dialogDocs = {
                Actor: this.actor.getDialogActors(compData.docCat),
                Item: this.actor.getDialogItems(compData.docCat)
            }[compData.docType];
        }
        return compData;
    }
    _onItemOpenClick(event) {
        event.preventDefault();
        const { doc } = this._getCompData(event);
        if (!doc) {
            return;
        }
        doc.sheet?.render(true);
    }
    async _onItemAddClick(event) {
        event.preventDefault();
        const addType = $(event.currentTarget).closest(".comp").data("addType");
        if (addType && addType in BladesItemType) {
            await this.actor.createEmbeddedDocuments("Item", [
                {
                    name: {
                        [BladesItemType.cohort_gang]: "A Gang",
                        [BladesItemType.cohort_expert]: "An Expert"
                    }[addType] ?? randomID(),
                    type: addType
                }
            ]);
            return;
        }
        const { docCat, docType, dialogDocs, docTags } = this._getCompData(event);
        if (!dialogDocs || !docCat || !docType) {
            return;
        }
        await BladesDialog.DisplaySelectionDialog(this.actor, U.tCase(`Add ${docCat.replace(/_/g, " ")}`), docType, dialogDocs, docTags);
    }
    async _onItemRemoveClick(event) {
        event.preventDefault();
        const { elem$, doc } = this._getCompData(event);
        if (!doc) {
            return;
        }
        await G.effects.blurRemove(elem$).then(async () => {
            if (doc instanceof BladesItem) {
                await this.actor.remSubItem(doc);
            }
            else {
                await this.actor.remSubActor(doc);
            }
        });
    }
    async _onItemFullRemoveClick(event) {
        event.preventDefault();
        const { elem$, doc } = this._getCompData(event);
        if (!doc) {
            return;
        }
        await G.effects.blurRemove(elem$).then(async () => await doc.delete());
    }
    async _onItemToggleClick(event) {
        event.preventDefault();
        const target = $(event.currentTarget).data("target");
        await this.actor.update({
            [target]: !getProperty(this.actor, target)
        });
    }
    async _onSelectChange(event) {
        event.preventDefault();
        await U.EventHandlers.onSelectChange(this, event);
    }
    async _onToggleValueClick(event) {
        event.preventDefault();
        const elem$ = $(event.currentTarget);
        const targetKey = elem$.data("target");
        const toggleOnVal = elem$.data("toggleOnVal") || "";
        const toggleOffVal = elem$.data("toggleOffVal") || "";
        if (getProperty(this.actor, targetKey) === toggleOnVal) {
            await this.actor.update({ [targetKey]: toggleOffVal });
        }
        else {
            await this.actor.update({ [targetKey]: toggleOnVal });
        }
    }
    async _onAdvanceClick(event) {
        event.preventDefault();
        if ($(event.currentTarget).data("action") === "advance-playbook") {
            await this.actor.advancePlaybook();
        }
    }
    // #endregion
    // #region Roll Handlers
    async _onRollTraitClick(event) {
        const traitName = $(event.currentTarget).data("rollTrait");
        const rollType = $(event.currentTarget).data("rollType");
        const rollData = {};
        if (U.lCase(traitName) in { ...ActionTrait, ...AttributeTrait, ...Factor }) {
            rollData.rollTrait = U.lCase(traitName);
        }
        else if (U.isInt(traitName)) {
            rollData.rollTrait = U.pInt(traitName);
        }
        if (U.tCase(rollType) in RollType) {
            rollData.rollType = U.tCase(rollType);
        }
        else if (typeof rollData.rollTrait === "string") {
            if (rollData.rollTrait in AttributeTrait) {
                rollData.rollType = RollType.Resistance;
            }
            else if (rollData.rollTrait in ActionTrait) {
                rollData.rollType = RollType.Action;
            }
        }
        if (game.user.isGM) {
            if (BladesRollPrimary.IsDoc(this.actor)) {
                rollData.rollPrimaryData = this.actor;
            }
            else if (BladesRollOpposition.IsDoc(this.actor)) {
                rollData.rollOppData = this.actor;
            }
        }
        await BladesRoll.NewRoll(rollData);
    }
    // Returns TRUE if can proceed, FALSE if action should stop (i.e. panel revealed for another user click)
    async _validateOrRevealSubData(downtimeAction, actionSubData) {
        switch (downtimeAction) {
            case DowntimeAction.LongTermProject: {
                // actionSubData must be "NewProject" or an id string to a project owned by this actor.
                if (actionSubData === "NewProject") {
                    // Create new blank project owned by this.actor and render it for actor to edit.
                    return false;
                }
                const projectItem = game.items.get(actionSubData ?? "");
                if (BladesProject.IsType(projectItem)) {
                    return true;
                }
                // actionSubData isn't provided, which means this was the basic "Project" action button and sub-buttons must be revealed.
                // Record Flip state of Downtime mid-bar
                // Construct sub-button container, append it to Downtime mid-bar
                // Construct "NewProject" button, append it to sub-button container
                // Construct buttons for each owned project, append to sub-button container
                // Run Flip.from animation
                return false;
            }
            case DowntimeAction.Recover: {
                // actionSubData must be a valid actor ID, who will become rollPrimary.
                const healerActor = game.actors.get(actionSubData ?? "");
                if (healerActor instanceof BladesActor && healerActor.hasTag(Tag.NPC.CanHeal)) {
                    return true;
                }
                // actionSubData isn't provided, which means this was the basic "Recover" action button and sub-buttons must be revealed.
                // Record Flip state of Downtime mid-bar
                // Construct sub-button container, append it to Downtime mid-bar
                // Compile list of PC characters with CanHeal tag.
                // Compile list of _visible_ NPC characters with CanHeal tag.
                // Append buttons to sub-button container
                // Run Flip.from animation
                return false;
            }
            case DowntimeAction.Train: {
                // actionSubData must be of form 'playbook:2'
                return Boolean(/^[a-z]+:\d$/.exec(actionSubData ?? ""));
            }
            // Other actions do not need subData validation and can always proceed:
            default: return true;
        }
    }
    async _onDowntimeActionClick(event) {
        const elem$ = $(event.currentTarget);
        // Extract the downtimeAction -- the substring of elem$.data("action") following the last hyphen (-)
        const downtimeAction = elem$.data("action").substring(elem$.data("action").lastIndexOf("-") + 1);
        // Extract the subData attribute
        const actionSubData = elem$.data("actionSubData");
        // Validate subData: If invalid, subData buttons will be revealed -- return and wait for one to be clicked.
        if (!(await this._validateOrRevealSubData(downtimeAction, actionSubData))) {
            $("#eunos-blades-tooltips").children(".tooltip").remove();
            await this.actor.update({ "system.downtime_actions_open_submenu": downtimeAction });
            $("#eunos-blades-tooltips").children(".tooltip").remove();
            return;
        }
        const config = {
            rollDowntimeAction: downtimeAction
        };
        // Set necessary fields on roll construction config object, depending on downtime action
        switch (downtimeAction) {
            case DowntimeAction.AcquireAsset:
            case DowntimeAction.LongTermProject:
            case DowntimeAction.ReduceHeat: {
                config.rollType = RollType.Action;
                break;
            }
            case DowntimeAction.Recover: {
                config.rollType = RollType.Action;
                if (BladesPC.IsType(this.actor) && this.actor.healingClock) {
                    config.rollOppClock = this.actor.healingClock.data;
                }
                // rollOpposition = user character's healing clock
                // rollPrimary = this.actor is NPC?
                break;
            }
            case DowntimeAction.IndulgeVice: {
                config.rollType = RollType.IndulgeVice;
                break;
            }
            case DowntimeAction.Train: {
                const [attr, value] = actionSubData.split(/:/);
                if (attr === "playbook") {
                    this.actor.update({ [`system.experience.${attr}.value`]: U.pInt((this.actor.system.experience?.playbook?.value ?? 0)) + U.pInt(value) });
                }
                else if (BladesPC.IsType(this.actor)) {
                    this.actor.update({ [`system.experience.${attr}.value`]: U.pInt(this.actor.system.experience[attr].value) + U.pInt(value) });
                }
                // Increase track XP: If above max, set rollover value
                break;
            }
            default: {
                // This is for custom downtime actions added by, e.g., ActiveEffects.
                break;
            }
        }
        // Clear any open submenus, and add one to downtime actions used.
        await this.actor.update({
            "system.downtime_actions_open_submenu": "",
            "system.downtime_actions.value": (this.actor.system.downtime_actions?.value ?? 0) + 1
        });
        if ("rollType" in config) {
            BladesRoll.NewRoll(config);
        }
    }
    async _onGatherInfoClick(event) {
        const elem$ = $(event.currentTarget);
        if (elem$.data("isFortuneRoll")) {
            BladesRoll.NewRoll({
                rollType: RollType.Fortune
            });
        }
        else {
            BladesRoll.NewRoll({
                rollType: RollType.Action,
                rollTrait: ""
            });
        }
    }
    // #endregion
    // #region Active Effect Handlers
    _onActiveEffectControlClick(event) {
        BladesActiveEffect.onManageActiveEffect(event, this.actor);
    }
}
export default BladesActorSheet;
