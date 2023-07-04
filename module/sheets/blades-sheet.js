/* ****▌███████████████████████████████████████████████████████████████████████████▐**** *\
|*     ▌████░░░░░░░░░░░ Euno's Blades in the Dark for Foundry VTT ░░░░░░░░░░░░░████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░ by Eunomiac ░░░░░░░░░░░░░██████████████████▐     *|
|*     ▌████████████████████████████  License █ v0.1.0 ████████████████████████████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░░░░░░  ░░░░░░░░░░░░░░░░░░███████████████████▐     *|
\* ****▌███████████████████████████████████████████████████████████████████████████▐**** */


import U from "../core/utilities.js";
import G from "../core/gsap.js";
import { Tag, District, Playbook, Vice } from "../core/constants.js";
import Tagify from "../../lib/tagify/tagify.esm.js";
import BladesSelectorDialog from "../blades-dialog.js";
import BladesActiveEffect from "../blades-active-effect.js";
class BladesSheet extends ActorSheet {
    async getData() {
        const context = (await super.getData());
        eLog.checkLog("actor", "[BladesSheet] super.getData()", { ...context });
        context.editable = this.options.editable;
        context.isGM = game.user.isGM;
        context.activeEffects = this.actor.effects;
        eLog.checkLog("actor", "[BladesSheet] return getData()", { ...context });
        return {
            ...context,
            actor: this.actor,
            system: this.actor.system
        };
    }

    get playbookData() {
        return {
            dotline: {
                data: this.actor.system.experience.playbook,
                target: "system.experience.playbook.value",
                svgKey: "teeth.tall",
                svgFull: "full|frame",
                svgEmpty: "full|half|frame"
            }
        };
    }
    get coinsData() {
        return {
            dotline: {
                data: this.actor.system.coins,
                target: "system.coins.value",
                iconEmpty: "coin-full.svg",
                iconFull: "coin-full.svg"
            }
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
        if (!this.options.editable) {
            return;
        }
        html.find(".dotline").each((i, elem) => {
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
            .find("[data-roll-attribute]")
            .on("click", this._onRollAttributeDieClick.bind(this));
        html
            .find(".effect-control")
            .on("click", this._onActiveEffectControlClick.bind(this));
        const tagElem = html.find(".tag-entry")[0];
        if (tagElem) {
            const tagify = new Tagify(tagElem, {
                enforceWhitelist: true,
                editTags: false,
                whitelist: [
                    ...Object.values(Tag.System).map((tag) => ({
                        "value": tag,
                        "data-group": "System Tags"
                    })),
                    ...Object.values(Tag.Item).map((tag) => ({
                        "value": tag,
                        "data-group": "Item Tags"
                    })),
                    ...Object.values(Tag.PC).map((tag) => ({
                        "value": tag,
                        "data-group": "Actor Tags"
                    })),
                    ...Object.values(Tag.NPC).map((tag) => ({
                        "value": tag,
                        "data-group": "Actor Tags"
                    })),
                    ...Object.values(District).map((tag) => ({
                        "value": tag,
                        "data-group": "Districts"
                    })),
                    ...Object.values(Vice).map((tag) => ({
                        "value": tag,
                        "data-group": "Vices"
                    })),
                    ...Object.values(Playbook).map((tag) => ({
                        "value": tag,
                        "data-group": "Playbooks"
                    }))
                ],
                dropdown: {
                    enabled: 0,
                    maxItems: 10000,
                    placeAbove: false,
                    appendTarget: html[0]
                }
            });
            tagify.dropdown.createListHTML = (optionsArr) => {
                const map = {};
                return structuredClone(optionsArr)
                    .map((suggestion, idx) => {
                    const value = tagify.dropdown.getMappedValue.call(tagify, suggestion);
                    let tagHTMLString = "";
                    if (!map[suggestion["data-group"]]) {
                        map[suggestion["data-group"]] = true;
                        if (Object.keys(map).length) {
                            tagHTMLString += "</div>";
                        }
                        tagHTMLString += `
								<div class="tagify__dropdown__itemsGroup">
								<h3>${suggestion["data-group"]}</h3>
							`;
                    }
                    suggestion.value
                        = value && typeof value === "string" ? U.escapeHTML(value) : value;
                    tagHTMLString += tagify.settings.templates.dropdownItem.apply(tagify, [suggestion, idx]);
                    return tagHTMLString;
                })
                    .join("");
            };
            tagify.addTags(this.actor.tags.map((tag) => {
                if (Object.values(Tag.System).includes(tag)) {
                    return { "value": tag, "data-group": "System Tags" };
                }
                if (Object.values(Tag.Item).includes(tag)) {
                    return { "value": tag, "data-group": "Item Tags" };
                }
                if (Object.values(Tag.PC).includes(tag) || Object.values(Tag.NPC).includes(tag)) {
                    return { "value": tag, "data-group": "Actor Tags" };
                }
                if (Object.values(District).includes(tag)) {
                    return { "value": tag, "data-group": "Districts" };
                }
                if (Object.values(Playbook).includes(tag)) {
                    return { "value": tag, "data-group": "Playbooks" };
                }
                if (Object.values(Vice).includes(tag)) {
                    return { "value": tag, "data-group": "Vices" };
                }
                return { "value": tag, "data-group": "Other" };
            }), false, false);
            tagElem.addEventListener("change", this._onTagifyChange.bind(this));
        }
        if (this.options.submitOnChange) {
            html.on("change", "textarea", this._onChangeInput.bind(this));
        }
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
    async _onTagifyChange(event) {
        const tagString = event.target.value;
        if (tagString) {
            const tags = JSON.parse(tagString).map(({ value }) => value);
            this.actor.update({ "system.tags": tags });
        }
        else {
            this.actor.update({ "system.tags": [] });
        }
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
        eLog.checkLog2("dialog", "Component Data", { ...compData });
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
        eLog.checkLog("_onItemAddClick", { docCat, dialogDocs });
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
        G.effects.blurRemove(elem$).then(() => doc.addTag(Tag.System.Archived));
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

    async _onRollAttributeDieClick(event) {
        const attribute_name = $(event.currentTarget).data("rollAttribute");
        this.actor.rollAttributePopup(attribute_name);
    }

    async _onActiveEffectControlClick(event) {
        BladesActiveEffect.onManageActiveEffect(event, this.actor);
    }
}
export default BladesSheet;