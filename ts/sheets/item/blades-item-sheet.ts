import C, {BladesItemType, BladesPhase, Tag, District, Playbook, Vice} from "../../core/constants.js";
import U from "../../core/utilities.js";
import BladesItem from "../../blades-item.js";
import BladesActiveEffect from "../../blades-active-effect.js";

// import Tagify from "../../../lib/tagify/tagify.esm.js";
import Tags from "../../core/tags.js";
import type {KeydownEventData, TagData, TagEventData} from "@yaireo/tagify";

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
    const context = super.getData() as BladesBaseItemSheetContext;

    context.editable = this.options.editable;
    context.isGM = game.user.isGM;
    context.isEmbeddedItem = this.item.parent !== null;
    context.item = this.item;
    context.system = this.item.system;
    context.activeEffects = Array.from(this.item.effects) as BladesActiveEffect[];

    return this._getTypedItemData[this.item.type]!(context);
  }

  _getTypedItemData: Record<BladesItemType, (context: BladesBaseItemSheetContext) => BladesItemSheetData> = {
    [BladesItemType.ability]: (context) => {
      if (!BladesItem.IsType(this.item, BladesItemType.ability)) { return undefined as never }
      const sheetData: BladesItemDataOfType<BladesItemType.ability> = {};
      return {
        ...context,
        ...sheetData
      };
    },
    [BladesItemType.background]: (context) => {
      if (!BladesItem.IsType(this.item, BladesItemType.background)) { return undefined as never }
      const sheetData: BladesItemDataOfType<BladesItemType.background> = {
      };
      return {
        ...context,
        ...sheetData
      };
    },
    [BladesItemType.clock_keeper]: (context) => {
      if (!BladesItem.IsType(this.item, BladesItemType.clock_keeper)) { return undefined as never }
      const sheetData: BladesItemDataOfType<BladesItemType.ability> = {
        phases: Object.values(BladesPhase)
      };
      return {
        ...context,
        ...sheetData
      };
    },
    [BladesItemType.cohort_gang]: (context) => {
      if (!BladesItem.IsType(this.item, BladesItemType.cohort_gang)) { return undefined as never }
      const sheetData: BladesItemDataOfType<BladesItemType.cohort_gang> = {
      };
      return {
        ...context,
        ...sheetData
      };
    },
    [BladesItemType.cohort_expert]: (context) => {
      if (!BladesItem.IsType(this.item, BladesItemType.cohort_expert)) { return undefined as never }
      const sheetData: BladesItemDataOfType<BladesItemType.cohort_expert> = {
      };
      return {
        ...context,
        ...sheetData
      };
    },
    [BladesItemType.crew_ability]: (context) => {
      if (!BladesItem.IsType(this.item, BladesItemType.crew_ability)) { return undefined as never }
      const sheetData: BladesItemDataOfType<BladesItemType.crew_ability> = {
      };
      return {
        ...context,
        ...sheetData
      };
    },
    [BladesItemType.crew_reputation]: (context) => {
      if (!BladesItem.IsType(this.item, BladesItemType.crew_reputation)) { return undefined as never }
      const sheetData: BladesItemDataOfType<BladesItemType.crew_reputation> = {
      };
      return {
        ...context,
        ...sheetData
      };
    },
    [BladesItemType.crew_playbook]: (context) => {
      if (!BladesItem.IsType(this.item, BladesItemType.crew_playbook)) { return undefined as never }
      const sheetData: BladesItemDataOfType<BladesItemType.crew_playbook> = {
      };
      return {
        ...context,
        ...sheetData
      };
    },
    [BladesItemType.crew_upgrade]: (context) => {
      if (!BladesItem.IsType(this.item, BladesItemType.crew_upgrade)) { return undefined as never }
      const sheetData: BladesItemDataOfType<BladesItemType.crew_upgrade> = {
      };
      return {
        ...context,
        ...sheetData
      };
    },
    [BladesItemType.feature]: (context) => {
      if (!BladesItem.IsType(this.item, BladesItemType.feature)) { return undefined as never }
      const sheetData: BladesItemDataOfType<BladesItemType.feature> = {
      };
      return {
        ...context,
        ...sheetData
      };
    },
    [BladesItemType.gm_tracker]: (context) => {
      if (!BladesItem.IsType(this.item, BladesItemType.gm_tracker)) { return undefined as never }
      const sheetData: BladesItemDataOfType<BladesItemType.gm_tracker> = {
      };
      return {
        ...context,
        ...sheetData
      };
    },
    [BladesItemType.heritage]: (context) => {
      if (!BladesItem.IsType(this.item, BladesItemType.heritage)) { return undefined as never }
      const sheetData: BladesItemDataOfType<BladesItemType.heritage> = {
      };
      return {
        ...context,
        ...sheetData
      };
    },
    [BladesItemType.item]: (context) => {
      if (!BladesItem.IsType(this.item, BladesItemType.item)) { return undefined as never }
      const sheetData: BladesItemDataOfType<BladesItemType.item> = {
        tierData: {
          "class": "comp-tier comp-vertical comp-teeth",
          "label": "Tier",
          "labelClass": "filled-label full-width",
          "dotline": {
            data: this.item.system.tier,
            target: "system.tier.value",
            svgKey: "teeth.tall",
            svgFull: "full|half|frame",
            svgEmpty: "full|half|frame"
          }
        }
      };

      return {
        ...context,
        ...sheetData
      };
    },
    [BladesItemType.playbook]: (context) => {
      if (!BladesItem.IsType(this.item, BladesItemType.playbook)) { return undefined as never }
      const sheetData: BladesItemDataOfType<BladesItemType.playbook> = {
      };
      return {
        ...context,
        ...sheetData
      };
    },
    [BladesItemType.preferred_op]: (context) => {
      if (!BladesItem.IsType(this.item, BladesItemType.preferred_op)) { return undefined as never }
      const sheetData: BladesItemDataOfType<BladesItemType.preferred_op> = {
      };
      return {
        ...context,
        ...sheetData
      };
    },
    [BladesItemType.stricture]: (context) => {
      if (!BladesItem.IsType(this.item, BladesItemType.stricture)) { return undefined as never }
      const sheetData: BladesItemDataOfType<BladesItemType.stricture> = {
      };
      return {
        ...context,
        ...sheetData
      };
    },
    [BladesItemType.vice]: (context) => {
      if (!BladesItem.IsType(this.item, BladesItemType.vice)) { return undefined as never }
      const sheetData: BladesItemDataOfType<BladesItemType.vice> = {
      };
      return {
        ...context,
        ...sheetData
      };
    },
    [BladesItemType.project]: (context) => {
      if (!BladesItem.IsType(this.item, BladesItemType.project)) { return undefined as never }
      const sheetData: BladesItemDataOfType<BladesItemType.project> = {
      };
      return {
        ...context,
        ...sheetData
      };
    },
    [BladesItemType.ritual]: (context) => {
      if (!BladesItem.IsType(this.item, BladesItemType.ritual)) { return undefined as never }
      const sheetData: BladesItemDataOfType<BladesItemType.ritual> = {
      };
      return {
        ...context,
        ...sheetData
      };
    },
    [BladesItemType.design]: (context) => {
      if (!BladesItem.IsType(this.item, BladesItemType.design)) { return undefined as never }
      const sheetData: BladesItemDataOfType<BladesItemType.design> = {
      };
      return {
        ...context,
        ...sheetData
      };
    },
    [BladesItemType.location]: (context) => {
      if (!BladesItem.IsType(this.item, BladesItemType.location)) { return undefined as never }
      const sheetData: BladesItemDataOfType<BladesItemType.location> = {
      };
      return {
        ...context,
        ...sheetData
      };
    },
    [BladesItemType.score]: (context) => {
      if (!BladesItem.IsType(this.item, BladesItemType.score)) { return undefined as never }
      const sheetData: BladesItemDataOfType<BladesItemType.score> = {
      };
      return {
        ...context,
        ...sheetData
      };
    }
  };

  //   switch (this.item.type) {
  //     case BladesItemType.item: return this._getItemData(context);
  //     case BladesItemType.ability: return this._getAbilityData(context);
  //     // no default
  //   }

  //   return context;
  // }

  // _getItemData(context) {
  //   if (!BladesItem.IsType(this.item, BladesItemType.item)) { return undefined as never }

  //   const sheetData: Partial<BladesItemSchema.Item> & BladesItemSheetData.Item = {
  //     clocks: this.item.system.clocks,
  //     tierData: {
  //       "class": "comp-tier comp-vertical comp-teeth",
  //       "label": "Tier",
  //       "labelClass": "filled-label full-width",
  //       "dotline": {
  //         data: this.item.system.tier,
  //         target: "system.tier.value",
  //         svgKey: "teeth.tall",
  //         svgFull: "full|half|frame",
  //         svgEmpty: "full|half|frame"
  //       }
  //     }
  //   };

  //   return {
  //     ...context,
  //     ...sheetData
  //   };
  // }

  // _getAbilityData(context: ItemSheet.Data<DocumentSheetOptions>) {
  //   if (!BladesItem.IsType(this.item, BladesItemType.ability)) { return undefined as never }

  //   const sheetData: Partial<BladesItemSchema.Ability> & BladesItemSheetData.Ability = { };

  //   return {
  //     ...context,
  //     ...sheetData
  //   };
  // }

  // }

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

  override activateListeners(html: JQuery<HTMLElement>) {
    super.activateListeners(html);
    const self = this;

    Tags.InitListeners(html, this.item);

    // Everything below here is only needed if the sheet is editable
    if (!this.options.editable) {return}

    // This is a workaround until is being fixed in FoundryVTT.
    if (this.options.submitOnChange) {
      html.on("change", "textarea", this._onChangeInput.bind(this)); // Use delegated listener on the form
    }

    html.find(".effect-control").on("click", (ev) => {
      if ( self.item.isOwned ) {
        ui.notifications!.warn(game.i18n.localize("BITD.EffectWarning"));
        return;
      }
      BladesActiveEffect.onManageActiveEffect(ev, self.item);
    });

    html.find("[data-action=\"toggle-turf-connection\"").on("click", this.toggleTurfConnection.bind(this));
  }

  toggleTurfConnection(event: ClickEvent) {
    const button$ = $(event.currentTarget);
    const connector$ = button$.parent();
    const turfNum = parseInt(connector$.data("index") ?? 0);
    const turfDir = connector$.data("dir");
    if (!turfNum || !turfDir) { return }
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