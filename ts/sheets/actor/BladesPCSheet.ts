
import C, {BladesActorType, BladesItemType, AttributeTrait, Tag, ActionTrait, BladesPhase} from "../../core/constants";
import U from "../../core/utilities";
import BladesActorSheet from "./BladesActorSheet";
import {BladesActor, BladesPC} from "../../documents/BladesActorProxy";
import {BladesClock} from "../../documents/BladesItemProxy";
import BladesGMTrackerSheet from "../item/BladesGMTrackerSheet";

class BladesPCSheet extends BladesActorSheet {

  static override get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["eunos-blades", "sheet", "actor", "pc"],
      template: "systems/eunos-blades/templates/actor-sheet.hbs",
      width: 775,
      height: 775,
      tabs: [{navSelector: ".nav-tabs", contentSelector: ".tab-content", initial: "abilities"}]
    });
  }

  static Initialize() {
    Actors.registerSheet("blades", BladesPCSheet, {types: ["pc"], makeDefault: true});

    Hooks.on("dropActorSheetData", async (parentActor: BladesActor, _, {uuid}: {uuid: string}) => {
      const doc = await fromUuid(uuid) as BladesDoc|null;
      if (doc instanceof BladesActor) {
        if (parentActor.type === BladesActorType.crew && doc.type === BladesActorType.pc) {
          // Dropping a PC onto a Crew Sheet: Add Crew to PC
          doc.addSubActor(parentActor);
        } else if (parentActor.type === BladesActorType.pc && doc.type === BladesActorType.crew) {
          // Dropping a Crew onto a PC Sheet: Add
          parentActor.addSubActor(doc);
        }
      }
    });
    return loadTemplates([
      "systems/eunos-blades/templates/items/clock_keeper-sheet.hbs",
      "systems/eunos-blades/templates/parts/clock-sheet-row.hbs"
    ]);
  }

  override getData() {
    const context = super.getData();

    const {activeSubItems, activeSubActors} = this.actor;

    const sheetData: Partial<BladesActorDataOfType<BladesActorType.pc>> = {};

    // ~ Assemble embedded actors and items
    sheetData.preparedItems = Object.assign(
      context.preparedItems ?? {},
      {
        abilities: activeSubItems
          .filter((item): item is BladesItemOfType<BladesItemType.ability> => item.type === BladesItemType.ability)
          .map((item) => {
            // ~ Assign dotlines to abilities with usage data
            if (item.system.uses_per_score.max) {
              Object.assign(item, {
                inRuleDotline: {
                  data: item.system.uses_per_score,
                  dotlineLabel: "Uses",
                  target: "item.system.uses_per_score.value",
                  iconEmpty: "dot-empty.svg",
                  iconEmptyHover: "dot-empty-hover.svg",
                  iconFull: "dot-full.svg",
                  iconFullHover: "dot-full-hover.svg"
                }
              });
            }
            return item;
          }),
        background: activeSubItems.find((item) => item.type === BladesItemType.background),
        heritage: activeSubItems.find((item) => item.type === BladesItemType.heritage),
        vice: activeSubItems.find((item) => item.type === BladesItemType.vice),
        loadout: activeSubItems
          .filter((item): item is BladesItemOfType<BladesItemType.gear> => item.type === BladesItemType.gear)
          .map((item) => {
          // Assign load and usage data to gear
            if (item.system.load) {
              Object.assign(item, {
                numberCircle: item.system.load,
                numberCircleClass: "item-load"
              });
            }
            if (item.system.uses_per_score.max) {
              Object.assign(item, {
                inRuleDotline: {
                  data: item.system.uses_per_score,
                  dotlineLabel: "Uses",
                  target: "item.system.uses_per_score.value",
                  iconEmpty: "dot-empty.svg",
                  iconEmptyHover: "dot-empty-hover.svg",
                  iconFull: "dot-full.svg",
                  iconFullHover: "dot-full-hover.svg"
                }
              });
            }
            return item;
          }),
        playbook: this.actor.playbook
      }
    ) as BladesActorDataOfType<BladesActorType.pc>["preparedItems"];

    sheetData.preparedActors = {
      crew: activeSubActors
        .find((actor): actor is BladesActorOfType<BladesActorType.crew> => actor.type === BladesActorType.crew),
      vice_purveyor: activeSubActors
        .find((actor): actor is BladesActorOfType<BladesActorType.npc> => actor.hasTag(Tag.NPC.VicePurveyor)),
      acquaintances: activeSubActors
        .filter((actor): actor is BladesActorOfType<BladesActorType.npc> => actor.hasTag(Tag.NPC.Acquaintance))
    };

    sheetData.hasVicePurveyor = Boolean(this.actor.playbook?.hasTag(Tag.Gear.Advanced) === false
                                        && activeSubItems.find((item) => item.type === BladesItemType.vice));

    sheetData.healing_clock = new BladesClock({
      name: "Healing",
      type: BladesItemType.clock,
      data: {
        targetID: this.actor.id,
        targetKey: "system.healing.value",
        color: "white",
        isVisible: "true",
        isNameVisible: false,
        isActive: false,
        ...this.actor.system.healing
      }
    });

    sheetData.stashData = {
      label: "Stash:",
      dotline: {
        data: this.actor.system.stash,
        target: "system.stash.value",
        iconEmpty: "coin-empty.svg",
        iconEmptyHover: "coin-empty-hover.svg",
        iconFull: "coin-full.svg",
        iconFullHover: "coin-full-hover.svg",
        altIconFull: "coin-ten.svg",
        altIconFullHover: "coin-ten-hover.svg",
        altIconStep: 10
      }
    };

    sheetData.stressData = {
      label: this.actor.system.stress.name,
      dotline: {
        data: this.actor.system.stress,
        dotlineClass: this.actor.system.stress.max >= 13 ? "narrow-stress" : "",
        target: "system.stress.value",
        svgKey: "teeth.tall",
        svgFull: "full|half|frame",
        svgEmpty: "full|half|frame"
      }
    };

    if (BladesActor.IsType(this.actor, BladesActorType.pc)) {
      sheetData.traumaData = {
        label: this.actor.system.trauma.name,
        dotline: {
          data: {value: this.actor.trauma, max: this.actor.system.trauma.max},
          svgKey: "teeth.short",
          svgFull: "full|frame",
          svgEmpty: "frame",
          isLocked: true
        },
        compContainer: {
          class: "comp-trauma-conditions comp-vertical full-width",
          blocks: [
            this.actor.traumaList.slice(0, Math.ceil(this.actor.traumaList.length / 2))
              .map((tName) => ({
                checkLabel: tName,
                checkClasses: {
                  active: "comp-toggle-red",
                  inactive: "comp-toggle-grey"
                },
                checkTarget: `system.trauma.checked.${tName}`,
                checkValue: this.actor.system.trauma.checked[tName] ?? false,
                tooltip: C.TraumaTooltips[tName as KeyOf<typeof C.TraumaTooltips>],
                tooltipClass: "tooltip-trauma"
              })),
            this.actor.traumaList.slice(Math.ceil(this.actor.traumaList.length / 2))
              .map((tName) => ({
                checkLabel: tName,
                checkClasses: {
                  active: "comp-toggle-red",
                  inactive: "comp-toggle-grey"
                },
                checkTarget: `system.trauma.checked.${tName}`,
                checkValue: this.actor.system.trauma.checked[tName] ?? false,
                tooltip: C.TraumaTooltips[tName as KeyOf<typeof C.TraumaTooltips>],
                tooltipClass: "tooltip-trauma"
              }))
          ]
        }
      };
    }

    sheetData.abilityData = {
      dotline: {
        dotlineClass: "dotline-right dotline-glow",
        data: {
          value: this.actor.getAvailableAdvancements("Ability"),
          max: this.actor.getAvailableAdvancements("Ability")
        },
        dotlineLabel: "Available Abilities",
        isLocked: true,
        iconFull: "dot-full.svg"
      }
    };

    sheetData.loadData = {
      curLoad: this.actor.currentLoad,
      selLoadCount: this.actor.system.loadout.levels[
        U.lCase(this.actor.system.loadout.selected as Loadout)
      ],
      options: C.Loadout.selections,
      selected: this.actor.system.loadout.selected ?? ""
    };

    sheetData.armor = Object.fromEntries(Object.entries(this.actor.system.armor.active)
      .filter(([, isActive]) => isActive)
      .map(([armor]) => [
        armor,
        this.actor.system.armor.checked[armor as KeyOf<typeof this.actor.system.armor.checked>]
      ]));

    sheetData.attributeData = {} as Record<AttributeTrait, {
      tooltip: string,
      actions: Record<ActionTrait, ValueMax & {tooltip: string}>
    }>;
    const attrEntries = Object.entries(this.actor.system.attributes) as Array<
      [AttributeTrait, Record<ActionTrait, ValueMax>]
    >;
    for (const [attribute, attrData] of attrEntries) {
      sheetData.attributeData[attribute] = {
        tooltip: C.AttributeTooltips[attribute],
        actions: {} as Record<ActionTrait, ValueMax & {tooltip: string}>
      };
      const actionEntries = Object.entries(attrData) as Array<[ActionTrait, ValueMax]>;
      for (const [action, actionData] of actionEntries) {
        sheetData.attributeData[attribute].actions[action] = {
          tooltip: C.ActionTooltips[action],
          value: actionData.value,
          max: BladesGMTrackerSheet.Get().phase === BladesPhase.CharGen
            ? 2
            : this.actor.system.attributes[attribute][action].max
        };
      }
    }

    sheetData.gatherInfoTooltip = (new Handlebars.SafeString([
      "<h2>Gathering Information: Questions to Consider</h2>",
      "<ul>",
      ...Object.values(this.actor.system.gather_info ?? []).map((line) => `<li>${line}</li>`) ?? [],
      "</ul>"
    ].join(""))).toString();

    eLog.checkLog("Attribute", "[BladesPCSheet] attributeData", {attributeData: sheetData.attributeData});

    eLog.checkLog("actor", "[BladesPCSheet] getData()", {...context, ...sheetData});

    return {...context, ...sheetData} as BladesActorSheetData;
  }

  get activeArmor() {
    return Object.keys(U.objFilter(this.actor.system.armor.active, (val: boolean) => val === true));
  }

  get checkedArmor() {
    return Object.keys(U.objFilter(
      this.actor.system.armor.checked,
      (val: string|number|boolean, key: KeyOf<typeof this.actor.system.armor.checked>) => val === true
        && this.actor.system.armor.active[key] === true
    ));
  }

  get uncheckedArmor() {
    return Object.keys(U.objFilter(
      this.actor.system.armor.active,
      (val: string|number|boolean, key: KeyOf<typeof this.actor.system.armor.active>) => val === true
        && this.actor.system.armor.checked[key] === false
    ));
  }

  _getHoverArmor(): string|false {
    if (!this.activeArmor.length) { return false; }
    if (this.activeArmor.includes("heavy")) {
      return this.checkedArmor.includes("heavy") ? "light" : "heavy";
    } else if (this.activeArmor.includes("light")) { return "light"; }
    return "special";
  }

  _getClickArmor(): string|false {
    if (!this.uncheckedArmor.length) { return false; }
    if (this.uncheckedArmor.includes("heavy")) { return "heavy"; }
    if (this.uncheckedArmor.includes("light")) { return "light"; }
    return "special";
  }

  _getContextMenuArmor(): string|false {
    if (!this.checkedArmor.length) { return false; }
    if (this.checkedArmor.includes("light")) { return "light"; }
    if (this.checkedArmor.includes("heavy")) { return "heavy"; }
    return "special";
  }

  override async _onAdvanceClick(event: ClickEvent) {
    event.preventDefault();
    super._onAdvanceClick(event);
    const action = $(event.currentTarget).data("action").replace(/^advance-/, "");
    if (action in AttributeTrait) {
      await this.actor.advanceAttribute(action);
    }
  }

  override activateListeners(html: JQuery<HTMLElement>) {

    super.activateListeners(html);

    // ~ Everything below here is only needed if the sheet is editable
    if (!this.options.editable) {return;}

    const self = this;

    // ~ Armor Control
    html.find(".main-armor-control").on({
      click() {
        const targetArmor = self._getClickArmor();
        if (!targetArmor) { return; }
        self.actor.update({[`system.armor.checked.${targetArmor}`]: true});
      },
      contextmenu() {
        const targetArmor = self._getContextMenuArmor();
        if (!targetArmor) { return; }
        self.actor.update({[`system.armor.checked.${targetArmor}`]: false});
      },
      mouseenter() {
        const targetArmor = self._getHoverArmor();
        eLog.log4("Mouse Enter", targetArmor, this, $(this), $(this).next());
        if (!targetArmor) { return; }
        $(this).siblings(`.svg-armor.armor-${targetArmor}`).addClass("hover-over");
      },
      mouseleave() {
        const targetArmor = self._getHoverArmor();
        if (!targetArmor) { return; }
        $(this).siblings(`.svg-armor.armor-${targetArmor}`).removeClass("hover-over");
      }
    });
    html.find(".special-control").on({
      click() {
        if (!self.activeArmor.includes("special")) { return; }
        self.actor.update({"system.armor.checked.special": self.uncheckedArmor.includes("special")});
      },
      contextmenu() {
        if (!self.activeArmor.includes("special")) { return; }
        self.actor.update({"system.armor.checked.special": self.uncheckedArmor.includes("special")});
      },
      mouseenter() {
        if (!self.activeArmor.includes("special") || self.activeArmor.length === 1) { return; }
        $(this).siblings(".svg-armor.armor-special").addClass("hover-over");
      },
      mouseleave() {
        if (!self.activeArmor.includes("special") || self.activeArmor.length === 1) { return; }
        $(this).siblings(".svg-armor.armor-special").removeClass("hover-over");
      }
    });

  }

}

declare interface BladesPCSheet {
  actor: BladesPC;
}

export default BladesPCSheet;
