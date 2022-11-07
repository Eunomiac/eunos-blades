/* ****▌███████████████████████████████████████████████████████████████████████████▐**** *\
|*     ▌████░░░░░░░░░░░ Euno's Blades in the Dark for Foundry VTT ░░░░░░░░░░░░░████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░ by Eunomiac ░░░░░░░░░░░░░██████████████████▐     *|
|*     ▌████████████████████████████  License █ v0.1.0 ████████████████████████████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░░░░░░  ░░░░░░░░░░░░░░░░░░███████████████████▐     *|
\* ****▌███████████████████████████████████████████████████████████████████████████▐**** */

import U from "../core/utilities.js";
import BladesItem from "../blades-item.js";
import BladesActor from "../blades-actor.js";
import BladesDialog from "../blades-dialog.js";
import BladesActiveEffect from "../blades-active-effect.js";
class BladesSheet extends ActorSheet {
    async _onItemAddClick(event) {
        event.preventDefault();
        const dataElem$ = $(event.currentTarget).closest(".comp");
        const doc_cat = dataElem$.data("compCat");
        const doc_type = doc_cat in BladesItem.Categories
            ? BladesItem.Categories[doc_cat]
            : BladesActor.Categories[doc_cat];
        const initialParams = [
            this.actor,
            U.tCase(`Add ${doc_type.replace(/_/g, " ")}`),
            doc_type
        ];
        switch (doc_type) {
            case "crew": {
                await BladesDialog.Display(...initialParams, async (actorId) => { this.actor.embedSubActor("pc-crew", BladesActor.get(actorId)); });
            }
            case "item":
            case "crew_upgrade": {
                await BladesDialog.Display(...initialParams, async (itemId) => { BladesItem.Embed(itemId, this.actor); }, {
                    [`${this.actor.playbookName} Items`]: (item) => Boolean(item.playbooks?.includes(this.actor.playbookName ?? "")),
                    "General Items": (item) => Boolean(item.playbooks?.includes("ANY"))
                }, {
                    [`${this.actor.playbookName} Items`]: (item) => item.name.startsWith("Fine"),
                    "General Items": (item) => ["Armor", "Armor, Heavy"].includes(item.name ?? "")
                }, {
                    [`${this.actor.playbookName} Items`]: true,
                    "General Items": false
                });
                break;
            }
            case "ability":
            case "crew_ability": {
                if (!this.actor.playbookName) {
                    return;
                }
                await BladesDialog.Display(...initialParams, async (itemId) => { BladesItem.Embed(itemId, this.actor); }, {
                    [this.actor.playbookName]: (item) => Boolean(item.playbooks?.includes(this.actor.playbookName ?? "")),
                    Veteran: (item) => ![this.actor.playbookName, "Ghost", "Vampire", "Hull"].some((pbName) => item.playbooks.includes(pbName))
                }, {
                    [this.actor.playbookName]: (item) => this.actor.playbook.system.suggested_ability === item.name
                }, {
                    [this.actor.playbookName]: true
                });
                break;
            }
            case "heritage":
            case "background":
            case "vice":
            case "playbook":
            case "crew_playbook": {
                await BladesDialog.Display(...initialParams, async (itemId) => { BladesItem.Embed(itemId, this.actor); });
                break;
            }
        }
    }
    async getData() {
        const data = await super.getData();
        eLog.checkLog4("actor", "[BladesSheet] super.getData()", { ...data });
        const actorData = data.actor;
        const actorSystem = actorData.system;
        const subActors = {};
        Object.entries(actorSystem.subactors ?? {}).forEach(([id, { category, data: subActorData }]) => {
            const actor = game.actors.get(id);
            if (!actor) {
                return;
            }
            subActors[category] ??= [];
            subActors[category].push({ actor, data: subActorData });
        });
        Object.assign(data, {
            editable: this.options.editable,
            isGM: game.user.isGM,
            actor: actorData,
            data: actorSystem,
            playbookData: {
                dotline: {
                    data: this.actor.system.experience.playbook,
                    target: "system.experience.playbook.value",
                    svgKey: "teeth.tall",
                    svgFull: "full|frame",
                    svgEmpty: "full|half|frame"
                }
            },
            coinsData: {
                label: "Coins",
                dotline: {
                    data: this.actor.system.coins,
                    target: "system.coins.value",
                    iconEmpty: "coin-empty.svg",
                    iconEmptyHover: "coin-empty-hover.svg",
                    iconFull: "coin-full.svg",
                    iconFullHover: "coin-full-hover.svg"
                }
            }
        });
        eLog.checkLog4("actor", "[BladesSheet] return getData()", { ...data });
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
                        targetDoc.update({ [targetField]: thisValue });
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
        html.find(".comp-control.comp-add").on("click", (event) => {
            this._onItemAddClick(event);
        });
        html.find(".comp-control.comp-update").on("click", this._onUpdateBoxClick.bind(this));
        html.find(".comp-control.comp-delete").on({
            click: (event) => this._onItemRemoveClick(event)
        });
        if (this.options.submitOnChange) {
            html.on("change", "textarea", this._onChangeInput.bind(this));
        }
        html.find("[data-comp-id]").find(".comp-title").on("click", this._onItemOpenClick.bind(this));
        html.find("[data-roll-attribute]").on("click", this._onRollAttributeDieClick.bind(this));
        const self = this;
        
        html.find(".effect-control").on({
            click: function (event) {
                BladesActiveEffect.onManageActiveEffect(event, self.actor);
            }
        });
    }
    async _onItemRemoveClick(event) {
        event.preventDefault();
        const dataElem$ = $(event.currentTarget).closest(".comp");
        const docID = dataElem$.data("compId");
        await this.actor.removeItem(docID);
        dataElem$.slideUp(200, () => this.render(false));
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
        this.actor.update({ [target]: U.gsap.utils.wrap(0, maxValue + 1, curValue + 1) });
    }
    async _onClockRightClick(event) {
        event.preventDefault();
        const clock$ = $(event.currentTarget).find(".clock[data-target]");
        if (!clock$[0]) {
            return;
        }
        const target = clock$.data("target");
        const curValue = U.pInt(clock$.data("value"));
        this.actor.update({ [target]: Math.max(0, curValue - 1) });
    }
    async _onItemOpenClick(event) {
        event.preventDefault();
        const docID = $(event.currentTarget).closest(".comp").data("compId");
        const doc = BladesItem.get(docID) ?? BladesActor.get(docID);
        if (!doc) {
            return;
        }
        doc.sheet?.render(true);
    }
    async addItemsToSheet(item_type, el) {
        const items = await BladesItem.getAllItemsByType(item_type);
        const items_to_add = [];
        el.find("input:checked").each(function addItems() {
            const item = items.find(e => e.data._id === $(this).val());
            if (item) {
                items_to_add.push(item.data);
            }
        });
        await BladesItem.create(items_to_add, { parent: this.document });
    }
        async _onRollAttributeDieClick(event) {
        const attribute_name = $(event.currentTarget).data("rollAttribute");
        this.actor.rollAttributePopup(attribute_name);
    }
    async _onUpdateBoxClick(event) {
        event.preventDefault();
        const item_id = $(event.currentTarget).data("item");
        let update_value = $(event.currentTarget).data("value");
        const update_type = $(event.currentTarget).data("utype");
        if (update_value === undefined) {
            update_value = document.getElementById("fac-" + update_type + "-" + item_id)?.value;
        }
        let update;
        if (update_type === "status") {
            update = { _id: item_id, data: { status: { value: update_value } } };
        }
        else if (update_type === "hold") {
            update = { _id: item_id, data: { hold: { value: update_value } } };
        }
        else {
            eLog.error("update attempted for type undefined in blades-sheet.js onUpdateBoxClick function");
            return;
        }
        await this.actor.updateEmbeddedDocuments("Item", [update]);
    }
}
export default BladesSheet;