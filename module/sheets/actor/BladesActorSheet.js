// #region IMPORTS~
/*~ @@DOUBLE-BLANK@@ ~*/
import U from "../../core/utilities.js";
import G, { ApplyTooltipAnimations } from "../../core/gsap.js";
import C, { BladesActorType, BladesItemType, AttributeTrait, ActionTrait, Factor, RollType } from "../../core/constants.js";
import Tags from "../../core/tags.js";
import BladesActor from "../../BladesActor.js";
import BladesItem from "../../BladesItem.js";
import BladesDialog from "../../BladesDialog.js";
import BladesActiveEffect from "../../BladesActiveEffect.js";
import BladesRoll, { BladesRollPrimary, BladesRollOpposition } from "../../BladesRoll.js";
/*~ @@DOUBLE-BLANK@@ ~*/
// #endregion
/*~ @@DOUBLE-BLANK@@ ~*/
class BladesActorSheet extends ActorSheet {
    /*~ @@DOUBLE-BLANK@@ ~*/
    /**
     * Override the default getData method to provide additional data for the actor sheet.
     * This includes: cssClass, editable, isGM, actor, system, tierTotal, rollData, activeEffects,
     *                 hasFullVision, hasLimitedVision, hasControl, preparedItems.
     * @returns {BladesActorSheetData} The data object for the actor sheet.
     */
    getData() {
        /*~ @@DOUBLE-BLANK@@ ~*/
        // Get the base data context from the parent class.
        const context = super.getData();
        /*~ @@DOUBLE-BLANK@@ ~*/
        // Prepare additional data specific to this actor's sheet.
        const sheetData = {
            // Basic actor data.
            cssClass: this.actor.type,
            editable: this.options.editable,
            isGM: game.eunoblades.Tracker?.system.is_spoofing_player ? false : game.user.isGM,
            actor: this.actor,
            system: this.actor.system,
            tierTotal: this.actor.getFactorTotal(Factor.tier) > 0 ? U.romanizeNum(this.actor.getFactorTotal(Factor.tier)) : "0",
            rollData: this.actor.getRollData(),
            activeEffects: Array.from(this.actor.effects),
            hasFullVision: game.user.isGM
                || this.actor.testUserPermission(game.user, CONST.DOCUMENT_PERMISSION_LEVELS.OBSERVER),
            hasLimitedVision: game.user.isGM
                || this.actor.testUserPermission(game.user, CONST.DOCUMENT_PERMISSION_LEVELS.LIMITED),
            hasControl: game.user.isGM || this.actor.testUserPermission(game.user, CONST.DOCUMENT_PERMISSION_LEVELS.OWNER),
            /*~ @@DOUBLE-BLANK@@ ~*/
            // Prepare items for display on the actor sheet.
            preparedItems: {
                cohorts: {
                    gang: this.actor.activeSubItems
                        .filter((item) => item.type === BladesItemType.cohort_gang)
                        .map((item) => {
                        // Prepare gang cohort items.
                        const subtypes = U.unique(Object.values(item.system.subtypes)
                            .map((subtype) => subtype.trim())
                            .filter((subtype) => /[A-Za-z]/.test(subtype)));
                        const eliteSubtypes = U.unique([
                            ...Object.values(item.system.elite_subtypes),
                            ...(item.parent?.upgrades ?? [])
                                .map((upgrade) => (upgrade.name ?? "").trim().replace(/^Elite /, ""))
                        ]
                            .map((subtype) => subtype.trim())
                            .filter((subtype) => /[A-Za-z]/
                            .test(subtype) && subtypes.includes(subtype)));
                        /*~ @@DOUBLE-BLANK@@ ~*/
                        // Prepare images for gang cohort items.
                        const imgTypes = [...eliteSubtypes];
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
                        /*~ @@DOUBLE-BLANK@@ ~*/
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
            }
        };
        /*~ @@DOUBLE-BLANK@@ ~*/
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
            /*~ @@DOUBLE-BLANK@@ ~*/
            sheetData.coinsData = {
                dotline: {
                    data: this.actor.system.coins,
                    target: "system.coins.value",
                    iconEmpty: "coin-full.svg",
                    iconFull: "coin-full.svg"
                }
            };
        }
        /*~ @@DOUBLE-BLANK@@ ~*/
        // Return the combined data context for the actor sheet.
        return {
            ...context,
            ...sheetData
        };
        /*~ @@DOUBLE-BLANK@@ ~*/
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    // #region LISTENERS & EVENT HANDLERS
    /*~ @@DOUBLE-BLANK@@ ~*/
    activateListeners(html) {
        super.activateListeners(html);
        /*~ @@DOUBLE-BLANK@@ ~*/
        // Handle removal or revealing of secret information content.
        if (game.user.isGM) {
            html.attr("style", "--secret-text-display: initial");
        }
        else {
            html.find('.editor:not(.tinymce) [data-is-secret="true"]').remove();
        }
        /*~ @@DOUBLE-BLANK@@ ~*/
        // ~ Tooltips
        ApplyTooltipAnimations(html);
        /*~ @@DOUBLE-BLANK@@ ~*/
        Tags.InitListeners(html, this.actor);
        /*~ @@DOUBLE-BLANK@@ ~*/
        // Everything below here is only needed if the sheet is editable
        if (!this.options.editable) {
            return;
        }
        /*~ @@DOUBLE-BLANK@@ ~*/
        // Add dotline functionality
        html.find(".dotline").each((__, elem) => {
            if ($(elem).hasClass("locked")) {
                return;
            }
            /*~ @@DOUBLE-BLANK@@ ~*/
            let targetDoc = this.actor;
            let targetField = $(elem).data("target");
            /*~ @@DOUBLE-BLANK@@ ~*/
            const comp$ = $(elem).closest("comp");
            /*~ @@DOUBLE-BLANK@@ ~*/
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
            /*~ @@DOUBLE-BLANK@@ ~*/
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
        /*~ @@DOUBLE-BLANK@@ ~*/
        // Clock Functionality
        html
            .find(".clock-container")
            .on({ click: this._onClockLeftClick.bind(this) });
        html
            .find(".clock-container")
            .on({ contextmenu: this._onClockRightClick.bind(this) });
        /*~ @@DOUBLE-BLANK@@ ~*/
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
        /*~ @@DOUBLE-BLANK@@ ~*/
        html
            .find(".advance-button")
            .on({ click: this._onAdvanceClick.bind(this) });
        /*~ @@DOUBLE-BLANK@@ ~*/
        // Active Effects Functionality
        html
            .find(".effect-control")
            .on({ click: this._onActiveEffectControlClick.bind(this) });
        /*~ @@DOUBLE-BLANK@@ ~*/
        // Roll Functionality
        html
            .find("[data-roll-trait]")
            .on({ click: this._onRollTraitClick.bind(this) });
        /*~ @@DOUBLE-BLANK@@ ~*/
        // This is a workaround until is being fixed in FoundryVTT.
        if (this.options.submitOnChange) {
            html.on("change", "textarea", this._onChangeInput.bind(this)); // Use delegated listener on the form
        }
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    async _onSubmit(event, params = {}) {
        if (!game.user.isGM && !this.actor.testUserPermission(game.user, CONST.DOCUMENT_PERMISSION_LEVELS.OWNER)) {
            eLog.checkLog("actorSheetTrigger", "User does not have permission to edit this actor", { user: game.user, actor: this.actor });
            return {};
        }
        return super._onSubmit(event, params);
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    async close(options) {
        if (this.actor.type === BladesActorType.pc) {
            return super.close(options).then(() => this.actor.clearSubActors());
        }
        else if (this.actor.type === BladesActorType.npc && this.actor.parentActor) {
            return super.close(options).then(() => this.actor.clearParentActor(false));
        }
        return super.close(options);
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    // #region Clock Handlers ~
    async _onClockLeftClick(event) {
        event.preventDefault();
        const clock$ = $(event.currentTarget).find(".clock[data-target]");
        if (!clock$[0]) {
            return;
        }
        const target = clock$.data("target");
        const curValue = U.pInt(clock$.data("value"));
        const maxValue = U.pInt(clock$.data("size"));
        /*~ @@DOUBLE-BLANK@@ ~*/
        await G.effects.pulseClockWedges(clock$.find("wedges")).then(async () => await this.actor.update({
            [target]: G.utils.wrap(0, maxValue + 1, curValue + 1)
        }));
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    async _onClockRightClick(event) {
        event.preventDefault();
        const clock$ = $(event.currentTarget).find(".clock[data-target]");
        if (!clock$[0]) {
            return;
        }
        const target = clock$.data("target");
        const curValue = U.pInt(clock$.data("value"));
        /*~ @@DOUBLE-BLANK@@ ~*/
        await G.effects.reversePulseClockWedges(clock$.find("wedges")).then(async () => await this.actor.update({
            [target]: Math.max(0, curValue - 1)
        }));
    }
    // #endregion
    /*~ @@DOUBLE-BLANK@@ ~*/
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
        /*~ @@DOUBLE-BLANK@@ ~*/
        if (compData.docID && compData.docType) {
            compData.doc = {
                Actor: this.actor.getSubActor(compData.docID),
                Item: this.actor.getSubItem(compData.docID)
            }[compData.docType];
        }
        if (compData.docCat && compData.docType) {
            compData.dialogDocs = {
                Actor: this.actor.getDialogActors(compData.docCat),
                Item: this.actor.getDialogItems(compData.docCat)
            }[compData.docType];
        }
        /*~ @@DOUBLE-BLANK@@ ~*/
        return compData;
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    _onItemOpenClick(event) {
        event.preventDefault();
        const { doc } = this._getCompData(event);
        if (!doc) {
            return;
        }
        doc.sheet?.render(true);
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
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
    /*~ @@DOUBLE-BLANK@@ ~*/
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
    /*~ @@DOUBLE-BLANK@@ ~*/
    async _onItemFullRemoveClick(event) {
        event.preventDefault();
        const { elem$, doc } = this._getCompData(event);
        if (!doc) {
            return;
        }
        await G.effects.blurRemove(elem$).then(async () => await doc.delete());
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    async _onItemToggleClick(event) {
        event.preventDefault();
        const target = $(event.currentTarget).data("target");
        await this.actor.update({
            [target]: !getProperty(this.actor, target)
        });
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    async _onSelectChange(event) {
        event.preventDefault();
        await U.EventHandlers.onSelectChange(this, event);
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    async _onAdvanceClick(event) {
        event.preventDefault();
        if ($(event.currentTarget).data("action") === "advance-playbook") {
            await this.actor.advancePlaybook();
        }
    }
    // #endregion
    /*~ @@DOUBLE-BLANK@@ ~*/
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
        /*~ @@DOUBLE-BLANK@@ ~*/
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
        /*~ @@DOUBLE-BLANK@@ ~*/
        if (game.user.isGM) {
            if (BladesRollPrimary.IsDoc(this.actor)) {
                rollData.rollPrimaryData = this.actor;
            }
            else if (BladesRollOpposition.IsDoc(this.actor)) {
                rollData.rollOppData = this.actor;
            }
        }
        /*~ @@DOUBLE-BLANK@@ ~*/
        await BladesRoll.NewRoll(rollData);
    }
    // #endregion
    /*~ @@DOUBLE-BLANK@@ ~*/
    // #region Active Effect Handlers
    _onActiveEffectControlClick(event) {
        BladesActiveEffect.onManageActiveEffect(event, this.actor);
    }
}
/*~ @@DOUBLE-BLANK@@ ~*/
export default BladesActorSheet;
/*~ @@DOUBLE-BLANK@@ ~*/ 
