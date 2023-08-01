// #region IMPORTS~

import U from "../../core/utilities.js";
import G from "../../core/gsap.js";
import {Tag, BladesActorType, BladesPermissions} from "../../core/constants.js";
import Tags from "../../core/tags.js";
import BladesActor from "../../blades-actor.js";
import BladesItem from "../../blades-item.js";
import BladesSelectorDialog, {SelectionCategory} from "../../blades-dialog.js";
import BladesActiveEffect from "../../blades-active-effect.js";
// #endregion
// #region TYPES: BladesCompData ~
type BladesCompData = {
  elem$: JQuery<HTMLElement>;
  docID?: string;
  docCat?: SelectionCategory;
  docType?: "Actor" | "Item";
  docTags?: BladesTag[];
  doc?: BladesActor | BladesItem | false;
  dialogDocs?: Record<string, BladesActor[] | BladesItem[]> | false;
};


interface BladesActorSheetData {
    editable: boolean,
    isGM: boolean,
    actor: BladesActor,
    system: BladesActorSystem,
    rollData: BladesActorRollData,
    activeEffects: BladesActiveEffect[],
    hasFullVision: boolean,
    hasLimitedVision: boolean,
    hasControl: boolean,
    playbookData?: {tooltip: string, dotline: BladesDotlineData},
    coinsData?: {dotline: BladesDotlineData}
}
// #endregion

class BladesSheet extends ActorSheet {

  override getData() {

    const context = super.getData();

    const sheetData: BladesActorSheetData = {
      editable: this.options.editable,
      isGM: game.user.isGM,
      actor: this.actor,
      system: this.actor.system,
      rollData: this.actor.getRollData(),
      activeEffects: Array.from(this.actor.effects) as BladesActiveEffect[],
      hasFullVision: game.user.isGM || this.actor.testUserPermission(game.user, CONST.DOCUMENT_PERMISSION_LEVELS.OBSERVER),
      hasLimitedVision: game.user.isGM || this.actor.testUserPermission(game.user, CONST.DOCUMENT_PERMISSION_LEVELS.LIMITED),
      hasControl: game.user.isGM || this.actor.testUserPermission(game.user, CONST.DOCUMENT_PERMISSION_LEVELS.OWNER)
    };

    if (BladesActor.IsType(this.actor, BladesActorType.pc, BladesActorType.crew)) {
      sheetData.playbookData = {
        tooltip: (new Handlebars.SafeString([
          "<ul>",
          ... this.actor.system.experience.clues?.map((line) => `<li>${line}</li>`) ?? [],
          "</ul>"
        ].join(""))).toString(),
        dotline: {
          data: this.actor.system.experience.playbook,
          target: "system.experience.playbook.value",
          svgKey: "teeth.tall",
          svgFull: "full|frame",
          svgEmpty: "full|half|frame"
        }
      };

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

  // #region LISTENERS & EVENT HANDLERS

  override activateListeners(html: JQuery<HTMLElement>) {
    super.activateListeners(html);

    // Handle removal or revealing of secret information content.
    if (game.user.isGM) {
      html.attr("style", "--secret-text-display: initial");
    } else {
      html.find('.editor:not(.tinymce) [data-is-secret="true"]').remove();
    }

    //~ Tooltips
    html.find(".tooltip").siblings(".comp-body")
      .each(function(i, elem) {
        $(elem).data("hoverTimeline", G.effects.hoverTooltip(elem));
      })
      .on({
        mouseenter: function() {
          $(this).parent().css("z-index", 1);
          $(this).data("hoverTimeline").play();
        },
        mouseleave: function() {
          $(this).data("hoverTimeline").reverse().then(() => {
            $(this).parent().removeAttr("style");
          });
        }
      });

    Tags.InitListeners(html, this.actor);

    // Everything below here is only needed if the sheet is editable
    if (!this.options.editable) { return }

    // Add dotline functionality
    html.find(".dotline").each((_, elem) => {
      if ($(elem).hasClass("locked")) { return }

      let targetDoc: BladesActor | BladesItem = this.actor as BladesActor;
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
        targetDoc = item as BladesItem;
      }

      const curValue = U.pInt($(elem).data("value"));
      $(elem)
        .find(".dot")
        .each((j, dot) => {
          $(dot).on("click", (event: ClickEvent) => {
            event.preventDefault();
            const thisValue = U.pInt($(dot).data("value"));
            if (thisValue !== curValue) {
              if (
                comp$.hasClass("comp-coins")
                || comp$.hasClass("comp-stash")
              ) {
                G.effects
                  .fillCoins($(dot).prevAll(".dot"))
                  .then(() => targetDoc.update({[targetField]: thisValue}));
              } else {
                targetDoc.update({[targetField]: thisValue});
              }
            }
          });
          $(dot).on("contextmenu", (event: ContextMenuEvent) => {
            event.preventDefault();
            const thisValue = U.pInt($(dot).data("value")) - 1;
            if (thisValue !== curValue) {
              targetDoc.update({[targetField]: thisValue});
            }
          });
        });
    });

    // Clock Functionality
    html
      .find(".clock-container")
      .on("click", this._onClockLeftClick.bind(this));
    html
      .find(".clock-container")
      .on("contextmenu", this._onClockRightClick.bind(this));

    // Component Functionality: Open, Add (via SelectorDialog), Archive, Delete, Toggle
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

    // Roll Functionality
    html
      .find("[data-roll-attribute]")
      .on("click", this._onRollAttributeDieClick.bind(this));

    // Active Effects Functionality
    html
      .find(".effect-control")
      .on("click", this._onActiveEffectControlClick.bind(this));


    // This is a workaround until is being fixed in FoundryVTT.
    if (this.options.submitOnChange) {
      html.on("change", "textarea", this._onChangeInput.bind(this)); // Use delegated listener on the form
    }
  }

  override async _onSubmit(event: Event, params: List<any> = {}) {
    if (!game.user.isGM && !this.actor.testUserPermission(game.user, CONST.DOCUMENT_PERMISSION_LEVELS.OWNER)) {
      eLog.checkLog("actorSheetTrigger", "User does not have permission to edit this actor", {user: game.user, actor: this.actor});
      return {};
    }
    // eLog.checkLog("actorSheetTrigger", "Submitting Form Data", {parentActor: this.actor.parentActor, systemTags: this.actor.system.tags, sourceTags: this.actor._source.system.tags, params});
    return super._onSubmit(event, params);
  }


  override async close(options?: FormApplication.CloseOptions): Promise<void> {
    if (this.actor.type === BladesActorType.pc) {
      return super.close(options).then(() => this.actor.clearSubActors());
    } else if (this.actor.type === BladesActorType.npc && this.actor.parentActor) {
      return super.close(options).then(() => this.actor.clearParentActor(false));
    }
    return super.close(options);
  }

  // #region Clock Handlers ~
  async _onClockLeftClick(event: ClickEvent) {
    event.preventDefault();
    const clock$ = $(event.currentTarget).find(".clock[data-target]");
    if (!clock$[0]) {
      return;
    }
    const target = clock$.data("target");
    const curValue = U.pInt(clock$.data("value"));
    const maxValue = U.pInt(clock$.data("size"));

    G.effects.pulseClockWedges(clock$.find("wedges")).then(() =>
      this.actor.update({
        [target]: G.utils.wrap(0, maxValue + 1, curValue + 1)
      }));
  }

  async _onClockRightClick(event: ContextMenuEvent) {
    event.preventDefault();
    const clock$ = $(event.currentTarget).find(".clock[data-target]");
    if (!clock$[0]) {
      return;
    }
    const target = clock$.data("target");
    const curValue = U.pInt(clock$.data("value"));

    G.effects.reversePulseClockWedges(clock$.find("wedges")).then(() =>
      this.actor.update({
        [target]: Math.max(0, curValue - 1)
      }));
  }
  // #endregion

  // #region Component Handlers
  private _getCompData(event: ClickEvent): BladesCompData {
    const elem$ = $(event.currentTarget).closest(".comp");
    const compData: BladesCompData = {
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

    // eLog.checkLog2("dialog", "Component Data", {...compData});

    return compData;
  }
  async _onItemOpenClick(event: ClickEvent) {
    event.preventDefault();
    const {doc} = this._getCompData(event);
    if (!doc) {
      return;
    }
    doc.sheet?.render(true);
  }

  async _onItemAddClick(event: ClickEvent) {
    event.preventDefault();
    const {docCat, docType, dialogDocs, docTags} = this._getCompData(event);
    // eLog.checkLog("_onItemAddClick", {docCat, dialogDocs});
    if (!dialogDocs || !docCat || !docType) {
      return;
    }
    await BladesSelectorDialog.Display(
      this.actor,
      U.tCase(`Add ${docCat.replace(/_/g, " ")}`),
      docType,
      dialogDocs,
      docTags
    );
  }

  async _onItemRemoveClick(event: ClickEvent) {
    event.preventDefault();
    const {elem$, doc} = this._getCompData(event);
    if (!doc) {
      return;
    }
    G.effects.blurRemove(elem$).then(() => {
      if (doc instanceof BladesItem) {
        this.actor.remSubItem(doc);
      } else {
        this.actor.remSubActor(doc);
      }
    });
  }

  async _onItemFullRemoveClick(event: ClickEvent) {
    event.preventDefault();
    const {elem$, doc} = this._getCompData(event);
    if (!doc) {
      return;
    }
    G.effects.blurRemove(elem$).then(() => doc.delete());
  }

  async _onItemToggleClick(event: ClickEvent) {
    event.preventDefault();
    const target = $(event.currentTarget).data("target");
    this.actor.update({
      [target]: !getProperty(this.actor, target)
    });
  }
  // #endregion

  // #region Roll Handlers
  async _onRollAttributeDieClick(event: ClickEvent) {
    const attribute_name = $(event.currentTarget).data("rollAttribute");
    this.actor.rollAttributePopup(attribute_name);
  }
  // #endregion

  // #region Active Effect Handlers
  async _onActiveEffectControlClick(event: ClickEvent) {
    BladesActiveEffect.onManageActiveEffect(event, this.actor);
  }
  // #endregion

  // #endregion
}

interface BladesSheet {
  get actor(): BladesActor;
}

export default BladesSheet;
