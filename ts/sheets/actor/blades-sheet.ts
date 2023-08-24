// #region IMPORTS~

import U from "../../core/utilities.js";
import G, {ApplyTooltipListeners} from "../../core/gsap.js";
import C, {Tag, BladesActorType, BladesItemType, BladesPermissions, Factor} from "../../core/constants.js";
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


// #endregion

class BladesSheet extends ActorSheet {

  override getData() {

    const context = super.getData();

    const sheetData: DeepPartial<BladesActorSheetData
    & BladesActorDataOfType<BladesActorType.pc>
    & BladesActorDataOfType<BladesActorType.crew>
    & BladesActorDataOfType<BladesActorType.npc>
    & BladesActorDataOfType<BladesActorType.faction>
    > = {
      cssClass: this.actor.type,
      editable: this.options.editable,
      isGM: game.eunoblades.Tracker!.system.is_spoofing_player ? false : game.user.isGM,
      actor: this.actor,
      system: this.actor.system,
      tierTotal: this.actor.getFactorTotal(Factor.tier) > 0 ? U.romanizeNum(this.actor.getFactorTotal(Factor.tier)) : "0",
      rollData: this.actor.getRollData(),
      activeEffects: Array.from(this.actor.effects) as BladesActiveEffect[],
      hasFullVision: game.user.isGM || this.actor.testUserPermission(game.user, CONST.DOCUMENT_PERMISSION_LEVELS.OBSERVER),
      hasLimitedVision: game.user.isGM || this.actor.testUserPermission(game.user, CONST.DOCUMENT_PERMISSION_LEVELS.LIMITED),
      hasControl: game.user.isGM || this.actor.testUserPermission(game.user, CONST.DOCUMENT_PERMISSION_LEVELS.OWNER),
      preparedItems: {
        cohorts: {
          gang: this.actor.activeSubItems
            .filter((item): item is BladesItemOfType<BladesItemType.cohort_gang> => item.type === BladesItemType.cohort_gang)
            .map((item) => {
              const subtypes = U.unique(Object.values(item.system.subtypes)
                .map((subtype) => subtype.trim())
                .filter((subtype) => /[A-Za-z]/.test(subtype))) as Tag.GangType[];
              const elite_subtypes = U.unique([
                ...Object.values(item.system.elite_subtypes),
                ...(item.parent?.upgrades ?? [])
                  .map((upgrade) => (upgrade.name ?? "").trim().replace(/^Elite /, ""))
              ]
                .map((subtype) => subtype.trim())
                .filter((subtype) => /[A-Za-z]/.test(subtype) && subtypes.includes(subtype as Tag.GangType))) as Tag.GangType[];

              const imgTypes = [...elite_subtypes];
              if (imgTypes.length < 2) {
                imgTypes.push(...subtypes.filter((subtype) => !imgTypes.includes(subtype)));
              }
              if (U.unique(imgTypes).length === 1) {
                item.system.image = Object.values(item.system.elite_subtypes).includes(imgTypes[0]) ? `elite-${U.lCase(imgTypes[0])}.svg` : `${U.lCase(imgTypes[0])}.svg`;
              } else if (U.unique(imgTypes).length > 1) {
                const [rightType, leftType] = imgTypes;
                item.system.imageLeft = Object.values(item.system.elite_subtypes).includes(leftType) ? `elite-${U.lCase(leftType)}.svg` : `${U.lCase(leftType)}.svg`;
                item.system.imageRight = Object.values(item.system.elite_subtypes).includes(rightType) ? `elite-${U.lCase(rightType)}.svg` : `${U.lCase(rightType)}.svg`;
              }

              Object.assign(
                item.system,
                {
                  tierTotal: item.getFactorTotal(Factor.tier) > 0 ? U.romanizeNum(item.getFactorTotal(Factor.tier)) : "0",
                  cohortRollData: [
                    {mode: "untrained", label: "Untrained", color: "transparent", tooltip: "<p>Roll Untrained</p>"}
                  ],
                  edgeData: Object.fromEntries(Object.values(item.system.edges ?? [])
                    .filter((edge) => /[A-Za-z]/.test(edge))
                    .map((edge) => [edge.trim(), C.EdgeTooltips[edge as KeyOf<typeof C["EdgeTooltips"]>]])),
                  flawData: Object.fromEntries(Object.values(item.system.flaws ?? [])
                    .filter((flaw) => /[A-Za-z]/.test(flaw))
                    .map((flaw) => [flaw.trim(), C.FlawTooltips[flaw as KeyOf<typeof C["FlawTooltips"]>]]))
                }
              );
              return item;
            }),
          expert: this.actor.activeSubItems
            .filter((item): item is BladesItemOfType<BladesItemType.cohort_expert> => item.type === BladesItemType.cohort_expert)
            .map((item) => {
              Object.assign(
                item.system,
                {
                  tierTotal: item.getFactorTotal(Factor.tier) > 0 ? U.romanizeNum(item.getFactorTotal(Factor.tier)) : "0",
                  cohortRollData: [
                    {mode: "untrained", label: "Untrained", tooltip: "<h2>Roll Untrained</h2>"}
                  ],
                  edgeData: Object.fromEntries(Object.values(item.system.edges ?? [])
                    .filter((edge) => /[A-Za-z]/.test(edge))
                    .map((edge) => [edge.trim(), C.EdgeTooltips[edge as KeyOf<typeof C["EdgeTooltips"]>]])),
                  flawData: Object.fromEntries(Object.values(item.system.flaws ?? [])
                    .filter((flaw) => /[A-Za-z]/.test(flaw))
                    .map((flaw) => [flaw.trim(), C.FlawTooltips[flaw as KeyOf<typeof C["FlawTooltips"]>]]))
                }
              );
              return item;
            })
        }
      }
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
          ... Object.values(this.actor.system.experience.clues ?? []).map((line) => `<li>${line.replace(/^Y/, "... y")}</li>`) ?? [],
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
    } as BladesActorSheetData;

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
    ApplyTooltipListeners(html);

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
    html
      .find(".comp-control.comp-add-clock")
      .on("click", this._onClockAddClick.bind(this));
    html
      .find(".comp-control.comp-delete-clock")
      .on("click", this._onClockDeleteClick.bind(this));

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

    html
      .find(".advance-button")
      .on("click", this._onAdvanceClick.bind(this));

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

  async _onClockAddClick(event: ClickEvent) {
    event.preventDefault();
    if (!BladesActor.IsType(this.actor, BladesActorType.faction)) { return }
    const clockID = randomID();
    this.actor.update({[`system.clocks.${clockID}`]: {
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
    }});
  }

  async _onClockDeleteClick(event: ClickEvent) {
    event.preventDefault();
    if (!BladesActor.IsType(this.actor, BladesActorType.faction)) { return }
    const clockID = $(event.currentTarget).data("clockId");
    if (!clockID) { return }
    this.actor.update({[`system.clocks.-=${clockID}`]: null});
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
    eLog.checkLog2("dialog", "Component Data", {elem: elem$, ...compData});

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
    const addType = $(event.currentTarget).closest(".comp").data("addType") as string|undefined;
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

  async _onAdvanceClick(event: ClickEvent) {
    event.preventDefault();
    if ($(event.currentTarget).data("action") === "advance-playbook") {
      this.actor.advancePlaybook();
    }
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
