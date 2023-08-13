/* ****▌███████████████████████████████████████████████████████████████████████████▐**** *\
|*     ▌████░░░░░░░░░░░ Euno's Blades in the Dark for Foundry VTT ░░░░░░░░░░░░░████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░ by Eunomiac ░░░░░░░░░░░░░██████████████████▐     *|
|*     ▌████████████████████████████  License █ v0.1.0 ████████████████████████████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░░░░░░  ░░░░░░░░░░░░░░░░░░███████████████████▐     *|
\* ****▌███████████████████████████████████████████████████████████████████████████▐**** */


import U from "../../core/utilities.js";
import G from "../../core/gsap.js";
import { BladesActorType } from "../../core/constants.js";
import Tags from "../../core/tags.js";
import BladesActor from "../../blades-actor.js";
import BladesItem from "../../blades-item.js";
import BladesSelectorDialog from "../../blades-dialog.js";
import BladesActiveEffect from "../../blades-active-effect.js";
class BladesSheet extends ActorSheet {
    getData() {
        const context = super.getData();
        const sheetData = {
            cssClass: this.actor.type,
            editable: this.options.editable,
            isGM: game.eunoblades.Tracker.system.is_spoofing_player ? false : game.user.isGM,
            actor: this.actor,
            system: this.actor.system,
            tierTotal: this.actor.getTierTotal() > 0 ? U.romanizeNum(this.actor.getTierTotal()) : "0",
            rollData: this.actor.getRollData(),
            activeEffects: Array.from(this.actor.effects),
            hasFullVision: game.user.isGM || this.actor.testUserPermission(game.user, CONST.DOCUMENT_PERMISSION_LEVELS.OBSERVER),
            hasLimitedVision: game.user.isGM || this.actor.testUserPermission(game.user, CONST.DOCUMENT_PERMISSION_LEVELS.LIMITED),
            hasControl: game.user.isGM || this.actor.testUserPermission(game.user, CONST.DOCUMENT_PERMISSION_LEVELS.OWNER)
        };
        if (BladesActor.IsType(this.actor, BladesActorType.pc, BladesActorType.crew)) {
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
        return {
            ...context,
            ...sheetData
        };
    }
    activateListeners(html) {
        super.activateListeners(html);
        if (game.user.isGM) {
            html.attr("style", "--secret-text-display: initial");
        }
        else {
            html.find('.editor:not(.tinymce) [data-is-secret="true"]').remove();
        }

        html.find(".tooltip").siblings(".comp-body:not(.hide-tooltip)")
            .each(function (i, elem) {
            $(elem).data("hoverTimeline", G.effects.hoverTooltip(elem));
        })
            .on({
            mouseenter: function () {
                $(this).parent().css("z-index", 1);
                $(this).data("hoverTimeline").play();
            },
            mouseleave: function () {
                $(this).data("hoverTimeline").reverse().then(() => {
                    $(this).parent().removeAttr("style");
                });
            }
        });
        Tags.InitListeners(html, this.actor);
        if (!this.options.editable) {
            return;
        }
        html.find(".dotline").each((_, elem) => {
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
                .each((j, dot) => {
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
        html
            .find(".clock-container")
            .on("click", this._onClockLeftClick.bind(this));
        html
            .find(".clock-container")
            .on("contextmenu", this._onClockRightClick.bind(this));
        html
            .find(".comp-control.comp-add-clock")
            .on("click", this._onClockAddClick.bind(this));
        html
            .find(".comp-control.comp-delete-clock")
            .on("click", this._onClockDeleteClick.bind(this));
        html
            .find("[data-comp-id]")
            .find(".comp-title")
            .on("click", this._onItemOpenClick.bind(this));
        html
            .find(".comp-control.comp-add")
            .on("click", this._onItemAddClick.bind(this));
        html
            .find(".comp-control.comp-delete")
            .on("click", this._onItemRemoveClick.bind(this));
        html
            .find(".comp-control.comp-delete-full")
            .on("click", this._onItemFullRemoveClick.bind(this));
        html
            .find(".comp-control.comp-toggle")
            .on("click", this._onItemToggleClick.bind(this));
        html
            .find(".advance-button")
            .on("click", this._onAdvanceClick.bind(this));
        html
            .find("[data-roll-attribute]")
            .on("click", this._onRollAttributeDieClick.bind(this));
        html
            .find(".effect-control")
            .on("click", this._onActiveEffectControlClick.bind(this));
        if (this.options.submitOnChange) {
            html.on("change", "textarea", this._onChangeInput.bind(this));
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

    async _onClockLeftClick(event) {
        event.preventDefault();
        const clock$ = $(event.currentTarget).find(".clock[data-target]");
        if (!clock$[0]) {
            return;
        }
        const target = clock$.data("target");
        const curValue = U.pInt(clock$.data("value"));
        const maxValue = U.pInt(clock$.data("size"));
        G.effects.pulseClockWedges(clock$.find("wedges")).then(() => this.actor.update({
            [target]: G.utils.wrap(0, maxValue + 1, curValue + 1)
        }));
    }
    async _onClockRightClick(event) {
        event.preventDefault();
        const clock$ = $(event.currentTarget).find(".clock[data-target]");
        if (!clock$[0]) {
            return;
        }
        const target = clock$.data("target");
        const curValue = U.pInt(clock$.data("value"));
        G.effects.reversePulseClockWedges(clock$.find("wedges")).then(() => this.actor.update({
            [target]: Math.max(0, curValue - 1)
        }));
    }
    async _onClockAddClick(event) {
        event.preventDefault();
        if (!BladesActor.IsType(this.actor, BladesActorType.faction)) {
            return;
        }
        const clockID = randomID();
        this.actor.update({ [`system.clocks.${clockID}`]: {
                color: "white",
                display: "",
                gm_notes: "",
                isVisible: true,
                isNameVisible: true,
                isActive: true,
                max: 4,
                target: `system.clocks.${clockID}.value`,
                value: 0,
                id: clockID
            } });
    }
    async _onClockDeleteClick(event) {
        event.preventDefault();
        if (!BladesActor.IsType(this.actor, BladesActorType.faction)) {
            return;
        }
        const clockID = $(event.currentTarget).data("clockId");
        if (!clockID) {
            return;
        }
        this.actor.update({ [`system.clocks.-=${clockID}`]: null });
    }

    _getCompData(event) {
        const elem$ = $(event.currentTarget).closest(".comp");
        const compData = {
            elem$,
            docID: elem$.data("compId"),
            docCat: elem$.data("compCat"),
            docType: elem$.data("compType"),
            docTags: (elem$.data("compTags") ?? "").split(/\s+/g)
        };
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
        
        return compData;
    }
    async _onItemOpenClick(event) {
        event.preventDefault();
        const { doc } = this._getCompData(event);
        if (!doc) {
            return;
        }
        doc.sheet?.render(true);
    }
    async _onItemAddClick(event) {
        event.preventDefault();
        const { docCat, docType, dialogDocs, docTags } = this._getCompData(event);
        if (!dialogDocs || !docCat || !docType) {
            return;
        }
        await BladesSelectorDialog.Display(this.actor, U.tCase(`Add ${docCat.replace(/_/g, " ")}`), docType, dialogDocs, docTags);
    }
    async _onItemRemoveClick(event) {
        event.preventDefault();
        const { elem$, doc } = this._getCompData(event);
        if (!doc) {
            return;
        }
        G.effects.blurRemove(elem$).then(() => {
            if (doc instanceof BladesItem) {
                this.actor.remSubItem(doc);
            }
            else {
                this.actor.remSubActor(doc);
            }
        });
    }
    async _onItemFullRemoveClick(event) {
        event.preventDefault();
        const { elem$, doc } = this._getCompData(event);
        if (!doc) {
            return;
        }
        G.effects.blurRemove(elem$).then(() => doc.delete());
    }
    async _onItemToggleClick(event) {
        event.preventDefault();
        const target = $(event.currentTarget).data("target");
        this.actor.update({
            [target]: !getProperty(this.actor, target)
        });
    }
    async _onAdvanceClick(event) {
        event.preventDefault();
        if ($(event.currentTarget).data("action") === "advance-playbook") {
            this.actor.advancePlaybook();
        }
    }

    async _onRollAttributeDieClick(event) {
        const attribute_name = $(event.currentTarget).data("rollAttribute");
        this.actor.rollAttributePopup(attribute_name);
    }

    async _onActiveEffectControlClick(event) {
        BladesActiveEffect.onManageActiveEffect(event, this.actor);
    }
}
export default BladesSheet;