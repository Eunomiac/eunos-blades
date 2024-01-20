import C, {BladesItemType, BladesPhase, Factor} from "../../core/constants";
import U from "../../core/utilities";
import G, {ApplyTooltipAnimations} from "../../core/gsap";
import BladesActor from "../../BladesActor";
import BladesItem from "../../BladesItem";
import {BladesProject} from "../../documents/BladesItemProxy";
import BladesActiveEffect from "../../documents/BladesActiveEffect";
// import {ApplyClockListeners} from "../../classes/BladesClocks";

import Tags from "../../core/tags";

class BladesItemSheet extends ItemSheet {

  static override get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["eunos-blades", "sheet", "item"],
      width: 560,
      height: 500,
      tabs: [{navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description"}]
    }) as ItemSheet.Options;
  }

  /* -------------------------------------------- */

  // constructor(item: BladesItem, options: Partial<ItemSheet.Options> = {}) {
  //   options.classes = [...options.classes ?? [], "eunos-blades", "sheet", "item", item.type];
  //   super(item, options);
  // }

  // override async getData() {

  override getData() {
    const context = super.getData();

    const sheetData: Partial<BladesItemSheetData> = {
      cssClass: this.item.type,
      editable: this.options.editable,
      isGM: (game.eunoblades.Tracker?.system.is_spoofing_player ? false : Boolean(game.user.isGM)) as boolean,
      isEmbeddedItem: Boolean(this.item.parent),
      item: this.item,
      system: this.item.system,
      tierTotal: this.item.getFactorTotal(Factor.tier) > 0 ? U.romanizeNum(this.item.getFactorTotal(Factor.tier)) : "0",
      activeEffects: Array.from(this.item.effects) as BladesActiveEffect[]
    };

    const typedItemData = this._getTypedItemData[this.item.type];
    if (typedItemData) {
      return typedItemData({...context, ...sheetData} as BladesItemSheetData);
    }

    return {
      ...context,
      ...sheetData
    } as BladesItemSheetData;
  }

  _getTypedItemData: Partial<Record<BladesItemType, (context: BladesItemSheetData) => BladesItemSheetData>> = {
    [BladesItemType.ability]: (context) => {
      if (!BladesItem.IsType(this.item, BladesItemType.ability)) {return undefined as never;}
      const sheetData: BladesItemDataOfType<BladesItemType.ability> = {};
      return {
        ...context,
        ...sheetData
      };
    },
    [BladesItemType.background]: (context) => {
      if (!BladesItem.IsType(this.item, BladesItemType.background)) {return undefined as never;}
      const sheetData: BladesItemDataOfType<BladesItemType.background> = {};
      return {
        ...context,
        ...sheetData
      };
    },
    [BladesItemType.clock_keeper]: (context) => {
      if (!BladesItem.IsType(this.item, BladesItemType.clock_keeper)) {return undefined as never;}
      const sheetData: BladesItemDataOfType<BladesItemType.ability> = {
        phases: Object.values(BladesPhase)
      };
      return {
        ...context,
        ...sheetData
      };
    },
    [BladesItemType.cohort_gang]: (context) => {
      if (!BladesItem.IsType(this.item, BladesItemType.cohort_gang, BladesItemType.cohort_expert)) {
        return undefined as never;
      }
      context.tierTotal = this.item.system.quality > 0 ? U.romanizeNum(this.item.system.quality) : "0";
      context.system.subtypes ??= {};
      context.system.elite_subtypes ??= {};
      const sheetData: Partial<BladesItemDataOfType<BladesItemType.cohort_gang>> = {
        tierData: {
          class: "comp-tier comp-vertical comp-teeth",
          dotline: {
            data: this.item.system.tier,
            target: "system.tier.value",
            iconEmpty: "dot-empty.svg",
            iconEmptyHover: "dot-empty-hover.svg",
            iconFull: "dot-full.svg",
            iconFullHover: "dot-full-hover.svg"
          }
        }
      };

      sheetData.edgeData = Object.fromEntries(Object.values(context.system.edges ?? [])
        .filter((edge) => /[A-Za-z]/.test(edge))
        .map((edge) => [edge.trim(), C.EdgeTooltips[edge as KeyOf<typeof C["EdgeTooltips"]>]]));
      sheetData.flawData = Object.fromEntries(Object.values(context.system.flaws ?? [])
        .filter((flaw) => /[A-Za-z]/.test(flaw))
        .map((flaw) => [flaw.trim(), C.FlawTooltips[flaw as KeyOf<typeof C["FlawTooltips"]>]]));

      return {
        ...context,
        ...sheetData
      };
    },
    [BladesItemType.cohort_expert]: (context) => {
      const typedItemData = this._getTypedItemData[BladesItemType.cohort_gang];
      if (!typedItemData) {
        throw new Error(`No data for type ${this.item.type}`);
      }
      return typedItemData(context);
    },
    [BladesItemType.crew_ability]: (context) => {
      if (!BladesItem.IsType(this.item, BladesItemType.crew_ability)) {return undefined as never;}
      const sheetData: BladesItemDataOfType<BladesItemType.crew_ability> = {};
      return {
        ...context,
        ...sheetData
      };
    },
    [BladesItemType.crew_reputation]: (context) => {
      if (!BladesItem.IsType(this.item, BladesItemType.crew_reputation)) {return undefined as never;}
      const sheetData: BladesItemDataOfType<BladesItemType.crew_reputation> = {};
      return {
        ...context,
        ...sheetData
      };
    },
    [BladesItemType.crew_playbook]: (context) => {
      if (!BladesItem.IsType(this.item, BladesItemType.crew_playbook)) {return undefined as never;}
      if (context.isGM) {
        const expClueData: Record<string, string> = {};
        [...Object.values(context.system.experience_clues ?? []).filter((clue) => /[A-Za-z]/.test(clue)), " "].forEach((clue, i) => {expClueData[(i + 1).toString()] = clue;});
        context.system.experience_clues = expClueData;
      }
      const sheetData: BladesItemDataOfType<BladesItemType.crew_playbook> = {};
      return {
        ...context,
        ...sheetData
      };
    },
    [BladesItemType.crew_upgrade]: (context) => {
      if (!BladesItem.IsType(this.item, BladesItemType.crew_upgrade)) {return undefined as never;}
      const sheetData: BladesItemDataOfType<BladesItemType.crew_upgrade> = {};
      return {
        ...context,
        ...sheetData
      };
    },
    [BladesItemType.feature]: (context) => {
      if (!BladesItem.IsType(this.item, BladesItemType.feature)) {return undefined as never;}
      const sheetData: BladesItemDataOfType<BladesItemType.feature> = {};
      return {
        ...context,
        ...sheetData
      };
    },
    [BladesItemType.gm_tracker]: (context) => {
      if (!BladesItem.IsType(this.item, BladesItemType.gm_tracker)) {return undefined as never;}
      const sheetData: BladesItemDataOfType<BladesItemType.gm_tracker> = {
        phase: this.item.system.phase as BladesPhase,
        phases: Object.values(BladesPhase)
      };
      return {
        ...context,
        ...sheetData
      };
    },
    [BladesItemType.heritage]: (context) => {
      if (!BladesItem.IsType(this.item, BladesItemType.heritage)) {return undefined as never;}
      const sheetData: BladesItemDataOfType<BladesItemType.heritage> = {};
      return {
        ...context,
        ...sheetData
      };
    },
    [BladesItemType.gear]: (context) => {
      if (!BladesItem.IsType(this.item, BladesItemType.gear)) {return undefined as never;}
      const sheetData: BladesItemDataOfType<BladesItemType.gear> = {
        tierData: {
          class: "comp-tier comp-vertical comp-teeth",
          label: "Quality",
          labelClass: "filled-label full-width",
          dotline: {
            data: this.item.system.tier,
            target: "system.tier.value",
            iconEmpty: "dot-empty.svg",
            iconEmptyHover: "dot-empty-hover.svg",
            iconFull: "dot-full.svg",
            iconFullHover: "dot-full-hover.svg"
          }
        }
      };

      return {
        ...context,
        ...sheetData
      };
    },
    [BladesItemType.playbook]: (context) => {
      if (!BladesItem.IsType(this.item, BladesItemType.playbook)) {return undefined as never;}
      if (context.isGM) {
        const expClueData: Record<string, string> = {};
        [...Object.values(context.system.experience_clues ?? []).filter((clue) => /[A-Za-z]/.test(clue)), " "].forEach((clue, i) => {expClueData[(i + 1).toString()] = clue;});
        context.system.experience_clues = expClueData;
        const gatherInfoData: Record<string, string> = {};
        [...Object.values(context.system.gather_info_questions ?? []).filter((question) => /[A-Za-z]/.test(question)), " "].forEach((question, i) => {gatherInfoData[(i + 1).toString()] = question;});
        context.system.gather_info_questions = gatherInfoData;
      }
      const sheetData: BladesItemDataOfType<BladesItemType.playbook> = {};
      return {
        ...context,
        ...sheetData
      };
    },
    [BladesItemType.preferred_op]: (context) => {
      if (!BladesItem.IsType(this.item, BladesItemType.preferred_op)) {return undefined as never;}
      const sheetData: BladesItemDataOfType<BladesItemType.preferred_op> = {};
      return {
        ...context,
        ...sheetData
      };
    },
    [BladesItemType.stricture]: (context) => {
      if (!BladesItem.IsType(this.item, BladesItemType.stricture)) {return undefined as never;}
      const sheetData: BladesItemDataOfType<BladesItemType.stricture> = {};
      return {
        ...context,
        ...sheetData
      };
    },
    [BladesItemType.vice]: (context) => {
      if (!BladesItem.IsType(this.item, BladesItemType.vice)) {return undefined as never;}
      const sheetData: BladesItemDataOfType<BladesItemType.vice> = {};
      return {
        ...context,
        ...sheetData
      };
    },
    [BladesItemType.ritual]: (context) => {
      if (!BladesItem.IsType(this.item, BladesItemType.ritual)) {return undefined as never;}
      const sheetData: BladesItemDataOfType<BladesItemType.ritual> = {};
      return {
        ...context,
        ...sheetData
      };
    },
    [BladesItemType.design]: (context) => {
      if (!BladesItem.IsType(this.item, BladesItemType.design)) {return undefined as never;}
      const sheetData: BladesItemDataOfType<BladesItemType.design> = {};
      return {
        ...context,
        ...sheetData
      };
    },
    [BladesItemType.location]: (context) => {
      if (!BladesItem.IsType(this.item, BladesItemType.location)) {return undefined as never;}
      const sheetData: BladesItemDataOfType<BladesItemType.location> = {};
      return {
        ...context,
        ...sheetData
      };
    },
    [BladesItemType.score]: (context) => {
      if (!BladesItem.IsType(this.item, BladesItemType.score)) {return undefined as never;}
      return context;
    }
  };

  override get template() {
    const pathComps = [
      "systems/eunos-blades/templates/items"
    ];
    if (C.SimpleItemTypes.includes(this.item.type)) {
      pathComps.push("simple-sheet.hbs");
    } else {
      pathComps.push(`${this.item.type}-sheet.hbs`);
    }
    return pathComps.join("/");
  }

  /* -------------------------------------------- */

  private addDotlineListeners(html: JQuery<HTMLElement>) {
    html.find(".dotline").each((__, elem) => {
      if ($(elem).hasClass("locked")) { return; }

      const targetDoc: BladesActor | BladesItem = this.item;
      const targetField = $(elem).data("target");

      const comp$ = $(elem).closest("comp");

      const curValue = U.pInt($(elem).data("value"));
      $(elem)
        .find(".dot")
        .each((_, dot) => {
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
  }

  override async activateListeners(html: JQuery<HTMLElement>) {
    await super.activateListeners(html);
    const self = this;

    Tags.InitListeners(html, this.item);
    ApplyTooltipAnimations(html);

    // Everything below here is only needed if the sheet is editable
    if (!this.options.editable) {return;}

    // Add dotline functionality
    this.addDotlineListeners(html);

    // Harm Bar Functionality for Cohorts
    if (BladesItem.IsType(this.item, BladesItemType.cohort_expert, BladesItemType.cohort_gang)) {
      html.find("[data-harm-click]").on({
        click: (event) => {
          event.preventDefault();
          const harmLevel = U.pInt($(event.currentTarget).data("harmClick"));
          if (this.item.system.harm?.value !== harmLevel) {
            this.item.update({"system.harm.value": harmLevel});
          }
        },
        contextmenu: (event) => {
          event.preventDefault();
          const harmLevel = Math.max(0, U.pInt($(event.currentTarget).data("harmClick")) - 1);
          if (this.item.system.harm?.value !== harmLevel) {
            this.item.update({"system.harm.value": harmLevel});
          }
        }
      });
    }

    // This is a workaround until is being fixed in FoundryVTT.
    if (this.options.submitOnChange) {
      html.on("change", "textarea", this._onChangeInput.bind(this)); // Use delegated listener on the form
    }

    html.find(".effect-control").on("click", (ev) => {
      if ( self.item.isOwned ) {
        ui.notifications?.warn(game.i18n.localize("BITD.EffectWarning"));
        return;
      }
      BladesActiveEffect.onManageActiveEffect(ev, self.item);
    });

    html.find("[data-action=\"toggle-turf-connection\"").on("click", this.toggleTurfConnection.bind(this));
  }

  toggleTurfConnection(event: ClickEvent) {
    const button$ = $(event.currentTarget);
    const connector$ = button$.parent();
    const turfNum = parseInt(connector$.data("index") ?? 0, 10);
    const turfDir = connector$.data("dir");
    if (!turfNum || !turfDir) { return; }
    const toggleState = connector$.hasClass("no-connect");
    const updateData = {
      [`system.turfs.${turfNum}.connects.${turfDir}`]: toggleState
    };
    const partner = connector$.data("partner");
    if (typeof partner === "string" && /-/.test(partner)) {
      const [partnerNum, partnerDir] = partner.split("-");
      updateData[`system.turfs.${partnerNum}.connects.${partnerDir}`] = toggleState;
    }
    this.item.update(updateData);
  }

}

declare interface BladesItemSheet {
  get item(): BladesItem
}

export default BladesItemSheet;
