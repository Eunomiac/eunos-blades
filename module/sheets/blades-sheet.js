/* ****▌███████████████████████████████████████████████████████████████████████████▐**** *\
|*     ▌████░░░░░░░░░░░ Euno's Blades in the Dark for Foundry VTT ░░░░░░░░░░░░░████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░ by Eunomiac ░░░░░░░░░░░░░██████████████████▐     *|
|*     ▌████████████████████████████  License █ v0.1.0 ████████████████████████████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░░░░░░  ░░░░░░░░░░░░░░░░░░███████████████████▐     *|
\* ****▌███████████████████████████████████████████████████████████████████████████▐**** */

import U from "../core/utilities.js";
import G from "../core/gsap.js";
import { Tag } from "../core/constants.js";
import BladesDialog from "../blades-dialog.js";
import BladesActiveEffect from "../blades-active-effect.js";
class BladesSheet extends ActorSheet {
    async _onItemAddClick(event) {
        event.preventDefault();
        const dataElem$ = $(event.currentTarget).closest(".comp");
        const doc_cat = dataElem$.data("compCat");
        const dialogItems = this.actor.getDialogItems(doc_cat);
        if (dialogItems === false) {
            return;
        }
        await BladesDialog.Display(this.actor, U.tCase(`Add ${doc_cat.replace(/_/g, " ")}`), dialogItems, async (docID) => this.actor.addDialogItem(docID));
    }
    async getData() {
        const data = await super.getData();
        eLog.checkLog4("actor", "[BladesSheet] super.getData()", { ...data });
        const actorData = data.actor;
        const actorSystem = actorData.system;
        Object.assign(data, {
            editable: this.options.editable,
            isGM: game.user.isGM,
            actor: actorData,
            data: actorSystem,
            effects: this.actor.effects
        });
        eLog.checkLog5("actor", "[BladesSheet] return getData()", { ...data });
        return data;
    }
    activateListeners(html) {
        super.activateListeners(html);
        if (game.user.isGM) {
            html.attr("style", "--secret-text-display: initial");
        }
        else {
            html.find(".editor:not(.tinymce) [data-is-secret=\"true\"]").remove();
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
            $(elem).find(".dot").each((j, dot) => {
                $(dot).on("click", (event) => {
                    event.preventDefault();
                    const thisValue = U.pInt($(dot).data("value"));
                    if (thisValue !== curValue) {
                        if (comp$.hasClass("comp-coins") || comp$.hasClass("comp-stash")) {
                            G.effects.fillCoins($(dot).prevAll(".dot"))
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
        html.find(".clock-container").on("click", this._onClockLeftClick.bind(this));
        html.find(".clock-container").on("contextmenu", this._onClockRightClick.bind(this));
        html.find("[data-comp-id]").find(".comp-title").on("click", this._onItemOpenClick.bind(this));
        html.find(".comp-control.comp-add").on("click", (event) => {
            this._onItemAddClick(event);
        });
        html.find(".comp-control.comp-delete").on({
            click: (event) => this._onItemRemoveClick(event)
        });
        html.find(".comp-control.comp-delete-full").on({
            click: (event) => this._onItemFullRemoveClick(event)
        });
        html.find(".comp-control.comp-toggle").on({
            click: (event) => this.actor.update({ [$(event.currentTarget).data("target")]: !getProperty(this.actor, $(event.currentTarget).data("target")) })
        });
        if (this.options.submitOnChange) {
            html.on("change", "textarea", this._onChangeInput.bind(this));
        }
        html.find("[data-roll-attribute]").on("click", this._onRollAttributeDieClick.bind(this));
        const self = this;
        
        html.find(".effect-control").on({
            click: function (event) {
                BladesActiveEffect.onManageActiveEffect(event, self.actor);
            }
        });
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
    async _onItemRemoveClick(event) {
        event.preventDefault();
        const self = this;
        const dataElem$ = $(event.currentTarget).closest(".comp");
        const docID = dataElem$.data("compId");
        const item = this.actor.items.get(docID);
        if (!item) {
            return;
        }
        G.effects.blurRemove(dataElem$).then(() => item.addTag(Tag.Archived));
    }
    async _onItemFullRemoveClick(event) {
        event.preventDefault();
        const self = this;
        const dataElem$ = $(event.currentTarget).closest(".comp");
        const docID = dataElem$.data("compId");
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
        G.effects.pulseClockWedges(clock$.find(("wedges"))).then(() => this.actor.update({
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
        G.effects.reversePulseClockWedges(clock$.find(("wedges"))).then(() => this.actor.update({
            [target]: Math.max(0, curValue - 1)
        }));
    }
    async _onItemOpenClick(event) {
        event.preventDefault();
        const docID = $(event.currentTarget).closest(".comp").data("compId");
        const doc = this.actor.getEmbeddedDoc(docID);
        eLog.log("CLICKED!", { docID, doc });
        if (!doc) {
            return;
        }
        doc.sheet?.render(true);
    }
        async _onRollAttributeDieClick(event) {
        const attribute_name = $(event.currentTarget).data("rollAttribute");
        this.actor.rollAttributePopup(attribute_name);
    }
}
export default BladesSheet;