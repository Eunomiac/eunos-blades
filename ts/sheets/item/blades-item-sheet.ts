import C, {Tag, District, Playbook, Vice} from "../../core/constants.js";
import U from "../../core/utilities.js";
import type BladesItem from "../../blades-item.js";
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

  constructor(item: BladesItem, options: Partial<ItemSheet.Options> = {}) {
    options.classes = [...options.classes ?? [], "eunos-blades", "sheet", "item", item.type];
    super(item, options);
  }

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

  override async getData() {
    const context = (await super.getData()) as ReturnType<ItemSheet["getData"]> & List<any>;

    context.editable = this.options.editable;
    context.isGM = game.user.isGM;
    context.isEmbeddedItem = this.item.parent !== null;
    context.item = this.item;
    context.system = this.item.system;
    context.activeEffects = this.item.effects;

    return context;
  }
}

declare interface BladesItemSheet {
  get item(): BladesItem
}

export default BladesItemSheet;