/* eslint-disable @typescript-eslint/no-unused-vars */

import C, {BladesActorType, BladesItemType, AttributeTrait, Tag, ActionTrait, DowntimeAction, BladesPhase} from "../../core/constants";
import U from "../../core/utilities";
import BladesActorSheet from "./BladesActorSheet";
import {BladesActor, BladesPC, BladesNPC} from "../../documents/BladesActorProxy";

class BladesPCSheet extends BladesActorSheet {

  static override get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes:  ["eunos-blades", "sheet", "actor", "pc"],
      template: "systems/eunos-blades/templates/actor-sheet.hbs",
      width:    775,
      height:   775,
      tabs:     [{navSelector: ".nav-tabs", contentSelector: ".tab-content", initial: "abilities"}]
    });
  }

  override async getData() {
    const context = await super.getData();

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
                  data:           item.system.uses_per_score,
                  dotlineLabel:   "Uses",
                  target:         "item.system.uses_per_score.value",
                  iconEmpty:      "dot-empty.svg",
                  iconEmptyHover: "dot-empty-hover.svg",
                  iconFull:       "dot-full.svg",
                  iconFullHover:  "dot-full-hover.svg"
                }
              });
            }
            return item;
          }),
        background: activeSubItems.find((item) => item.type === BladesItemType.background),
        heritage:   activeSubItems.find((item) => item.type === BladesItemType.heritage),
        vice:       activeSubItems.find((item) => item.type === BladesItemType.vice),
        loadout:    activeSubItems
          .filter((item): item is BladesItemOfType<BladesItemType.gear> => item.type === BladesItemType.gear)
          .map((item) => {
          // Assign load and usage data to gear
            if (item.system.load) {
              Object.assign(item, {
                numberCircle:      item.system.load,
                numberCircleClass: "item-load"
              });
            }
            if (item.system.uses_per_score.max) {
              Object.assign(item, {
                inRuleDotline: {
                  data:           item.system.uses_per_score,
                  dotlineLabel:   "Uses",
                  target:         "item.system.uses_per_score.value",
                  iconEmpty:      "dot-empty.svg",
                  iconEmptyHover: "dot-empty-hover.svg",
                  iconFull:       "dot-full.svg",
                  iconFullHover:  "dot-full-hover.svg"
                }
              });
            }
            return item;
          }),
        playbook: this.actor.playbook,
        projects: activeSubItems.filter((item) => item.type === BladesItemType.project),
        cohorts:  context.preparedItems?.cohorts
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

    sheetData.healing_clock = this.actor.healingClock;

    sheetData.stashData = {
      label:   "Stash:",
      dotline: {
        data:             this.actor.system.stash,
        target:           "system.stash.value",
        iconEmpty:        "coin-empty.svg",
        iconEmptyHover:   "coin-empty-hover.svg",
        iconFull:         "coin-full.svg",
        iconFullHover:    "coin-full-hover.svg",
        altIconFull:      "coin-ten.svg",
        altIconFullHover: "coin-ten-hover.svg",
        altIconStep:      10
      }
    };

    sheetData.stressData = {
      label:   this.actor.system.stress.name,
      dotline: {
        data:         this.actor.system.stress,
        dotlineClass: this.actor.system.stress.max >= 13 ? "narrow-stress" : "",
        target:       "system.stress.value",
        svgKey:       "teeth.tall",
        svgFull:      "full|half|frame",
        svgEmpty:     "full|half|frame"
      }
    };

    if (BladesActor.IsType(this.actor, BladesActorType.pc)) {
      sheetData.traumaData = {
        label:   this.actor.system.trauma.name,
        dotline: {
          data:     {value: this.actor.trauma, max: this.actor.system.trauma.max},
          svgKey:   "teeth.short",
          svgFull:  "full|frame",
          svgEmpty: "frame",
          isLocked: true
        },
        compContainer: {
          class:  "comp-trauma-conditions comp-vertical full-width",
          blocks: [
            this.actor.traumaList.slice(0, Math.ceil(this.actor.traumaList.length / 2))
              .map((tName) => ({
                checkLabel:   tName,
                checkClasses: {
                  active:   "comp-toggle-red",
                  inactive: "comp-toggle-grey"
                },
                checkTarget:  `system.trauma.checked.${tName}`,
                checkValue:   this.actor.system.trauma.checked[tName] ?? false,
                tooltip:      C.TraumaTooltips[tName as KeyOf<typeof C.TraumaTooltips>],
                tooltipClass: "tooltip-trauma"
              })),
            this.actor.traumaList.slice(Math.ceil(this.actor.traumaList.length / 2))
              .map((tName) => ({
                checkLabel:   tName,
                checkClasses: {
                  active:   "comp-toggle-red",
                  inactive: "comp-toggle-grey"
                },
                checkTarget:  `system.trauma.checked.${tName}`,
                checkValue:   this.actor.system.trauma.checked[tName] ?? false,
                tooltip:      C.TraumaTooltips[tName as KeyOf<typeof C.TraumaTooltips>],
                tooltipClass: "tooltip-trauma"
              }))
          ]
        }
      };
    }

    sheetData.abilityData = {
      dotline: {
        dotlineClass: "dotline-right dotline-glow",
        data:         {
          value: this.actor.getAvailableAdvancements("Ability"),
          max:   this.actor.getAvailableAdvancements("Ability")
        },
        dotlineLabel: "Available Abilities",
        isLocked:     true,
        iconFull:     "dot-full.svg"
      }
    };

    sheetData.loadData = {
      curLoad:      this.actor.currentLoad,
      selLoadCount: this.actor.system.loadout.levels[
        U.lCase(this.actor.system.loadout.selected as Loadout)
      ],
      options:  C.Loadout.selections as Array<BladesSelectOption<string>>,
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
          value:   actionData.value,
          max:     game.eunoblades.Tracker.phase === BladesPhase.CharGen
            ? 2
            : this.actor.system.attributes[attribute][action].max
        };
      }
    }

    if (game.eunoblades.Tracker?.phase === BladesPhase.Downtime) {
      const actionsList: Partial<Record<DowntimeAction, string>> = {
        [DowntimeAction.AcquireAsset]:    "Acquire Asset",
        [DowntimeAction.IndulgeVice]:     "Indulge Vice",
        [DowntimeAction.LongTermProject]: "Project",
        [DowntimeAction.Recover]:         "Recover",
        [DowntimeAction.ReduceHeat]:      "Reduce Heat",
        [DowntimeAction.Train]:           "Train"
      };

      // Get PCs, NPCs capable of rolling for the Recover action
      const healCapableDocs = [
        ...BladesActor.GetTypeWithTags(BladesActorType.pc, Tag.PC.CanHeal),
        ...BladesActor.GetTypeWithTags(BladesActorType.npc, Tag.NPC.CanHeal)
        /* ALSO NEED TO INCLUDE EXPERT COHORTS WITH CANHEAL TAG */
      ];

      // delete any Actions that aren't applicable
      if (this.actor.stress === 0) {
        delete actionsList[DowntimeAction.IndulgeVice];
      }
      if (this.actor.harmLevel === 0 || healCapableDocs.length === 0) {
        delete actionsList[DowntimeAction.Recover];
      }
      if (!this.actor.crew || this.actor.crew.system.heat.value === 0) {
        delete actionsList[DowntimeAction.ReduceHeat];
      }

      let actionsSubmenuData: Array<{
        actionSubData: string,
        display: string
      }>|undefined = undefined;
      switch (this.actor.system.downtime_actions_open_submenu) {
        case DowntimeAction.LongTermProject: {
          actionsSubmenuData = [
            {
              actionSubData: "NewProject",
              display:       "New Project"
            }
          ];
          // ... and add one for each Project on the PC.
          break;
        }
        case DowntimeAction.Recover: {
          actionsSubmenuData = [];
          healCapableDocs.forEach((hDoc) => {
            if (hDoc.id === this.actor.id) {
              actionsSubmenuData?.unshift({
                actionSubData: this.actor.id,
                display:       "Heal Self"
              });
            } else if (BladesPC.IsType(hDoc)) {
              actionsSubmenuData?.push({
                actionSubData: hDoc.id,
                display:       U.uCase(hDoc.name)
              });
            } else if (BladesNPC.IsType(hDoc)) {
              actionsSubmenuData?.push({
                actionSubData: hDoc.id,
                display:       hDoc.name
              });
            } /* NEED CHECK FOR COHORT HEALERS TOO */
          });
          break;
        }
        case DowntimeAction.Train: {
          const crewTrainingUpgrades = (this.actor.crew?.upgrades
            .filter((upgrade) => /^Training_/.exec(upgrade.system.world_name))
            .map((upgrade) => U.lCase(upgrade.system.world_name.split(/_/)[1])) ?? []) as Array<AttributeTrait|"playbook">;
          actionsSubmenuData = [
            {
              actionSubData: `playbook:${crewTrainingUpgrades.includes("playbook") ? 2 : 1}`,
              display:       `${crewTrainingUpgrades.includes("playbook") ? 2 : 1} Playbook XP`
            },
            {
              actionSubData: `insight:${crewTrainingUpgrades.includes(AttributeTrait.insight) ? 2 : 1}`,
              display:       `${crewTrainingUpgrades.includes(AttributeTrait.insight) ? 2 : 1} Insight XP`
            },
            {
              actionSubData: `prowess:${crewTrainingUpgrades.includes(AttributeTrait.prowess) ? 2 : 1}`,
              display:       `${crewTrainingUpgrades.includes(AttributeTrait.prowess) ? 2 : 1} Prowess XP`
            },
            {
              actionSubData: `resolve:${crewTrainingUpgrades.includes(AttributeTrait.resolve) ? 2 : 1}`,
              display:       `${crewTrainingUpgrades.includes(AttributeTrait.resolve) ? 2 : 1} Resolve XP`
            }
          ];
          break;
        }

      }

      const actionsTooltips = {
        [DowntimeAction.AcquireAsset]: `<h1>Acquire an Asset</h1>
        <p>Roll your <strong class='gold-bright'>Tier</strong> to acquire temporary use of an asset or service.</p>
        <p>The <strong>Quality</strong> of the acquired asset depends on the result of your roll:</p>
        <ul>
        <li><strong class='gold-bright'>Critical Success</strong> &mdash; <strong class='gold-bright'>Tier</strong> <strong>+ 2</strong></li>
        <li><strong>Success</strong> &mdash; <strong class='gold-bright'>Tier</strong> <strong>+ 2</strong></li>
        <li><b>Partial Success</b> &mdash; <strong class='gold-bright'>Tier</strong></li>
        <li><strong class='red-bright'>Fail</strong> &mdash; <strong class='gold-bright'>Tier</strong> <strong>− 1</strong></li>
        </ul>`,
        [DowntimeAction.IndulgeVice]: `<h1>Indulge Your Vice</h1>
        <p>Roll your <strong class='red-bright'>lowest</strong> <strong>Attribute</strong>. Clear <strong>Stress</strong> equal to the <strong>highest</strong> die result.</p>
        <p><strong class="red-bright">Warning:</strong> If you clear more <strong>Stress</strong> than you have, you will <strong class="red-bright">overindulge</strong>.</p>`,
        [DowntimeAction.LongTermProject]: `<h1>Work on a Long-Term Project</h1>
        <p>Work to <strong>advance the clock</strong> of one of your existing <strong>Long-Term Projects</strong>, or begin a new one.</p>
        <p>Roll the <strong>Action</strong> most appropriate to the work you are doing. The results of your roll determine how far you will <strong>advance the clock</strong>:</p>
        <ul>
        <li><strong class='gold-bright'>Critical Success</strong> &mdash; <strong class='gold-bright'>Five</strong> Segments</li>
        <li><strong>Success</strong> &mdash;  <strong>Three</strong> Segments</li>
        <li><b>Partial Success</b> &mdash; <b>Two</b> Segments</li>
        <li><strong class='red-bright'>Fail</strong> &mdash; <strong class='red-bright'>One</strong> Segment</li>
        </ul>`,
        [DowntimeAction.Recover]: `<h1>Recover from Harm</h1>
        <p>Make a <strong>healing treatment roll</strong> using the appropriate trait of the character healing you:</p>
        <ul>
        <li><strong>A PC with 'Physicker'</strong> &mdash; <strong>Tinker</strong>. <em>(You can heal yourself this way, but suffer <strong class="red-bright">2 Stress</strong> for doing so.)</em></li>
        <li><strong>An NPC</strong> &mdash; <strong>Quality</strong></li>
        </ul>
        <p>The results of your roll determine how far you will <strong>Advance your healing clock</strong>:</p>
        <ul>
        <li><strong class='gold-bright'>Critical Success</strong> &mdash; <strong class='gold-bright'>Five</strong> Segments</li>
        <li><strong>Success</strong> &mdash;  <strong>Three</strong> Segments</li>
        <li><b>Partial Success</b> &mdash; <b>Two</b> Segments</li>
        <li><strong class='red-bright'>Fail</strong> &mdash; <strong class='red-bright'>One</strong> Segment</li>
        </ul>
        <p>When your <strong>healing clock</strong> is filled, reduce each Harm by one level of severity.</p>`,
        [DowntimeAction.ReduceHeat]: `<h1>Reduce Heat</h1>
        <p>Work to <strong>reduce the Heat</strong> on your Crew.</p>
        <p>Roll the <strong>Action</strong> most appropriate to the measures you are taking. The results of your roll determine how much <strong class="red-bright">Heat</strong> you clear:</p>
        <ul>
        <li><strong class='gold-bright'>Critical Success</strong> &mdash; <strong class='gold-bright'>Five</strong> Heat</li>
        <li><strong>Success</strong> &mdash;  <strong>Three</strong> Heat</li>
        <li><b>Partial Success</b> &mdash; <b>Two</b> Heat</li>
        <li><strong class='red-bright'>Fail</strong> &mdash; <strong class='red-bright'>One</strong> Heat</li>
        </ul>`,
        [DowntimeAction.Train]: `<h1>Train</h1>
        <p>Select an <strong>Experience Track</strong> <em>(i.e. Insight, Prowess, Resolve, or your Playbook)</em>. Gain <strong>1 XP</strong> in that track, or <strong>2 XP</strong> if your Crew has the corresponding <strong>Training Upgrade</strong>.</p>`
      };

      const actionsRemaining =
        this.actor.system.downtime_actions.max
        + this.actor.system.downtime_action_bonus
        - this.actor.system.downtime_actions.value
        - (this.actor.isAtWar ? 1 : 0);

      const canPayCoin = Boolean(
        this.actor.system.coins.value >= 1
          || this.actor.system.stash.value >= 2
      );
      const canPayRep = Boolean(
        this.actor.crew
          && this.actor.crew.system.rep.value >= 1
      );
      const isDisplayingCosts = actionsRemaining <= 0;
      const isDisplayingActions =
        actionsRemaining > 0
        || (canPayCoin && this.actor.system.downtime_action_selected_cost === "Coin")
        || (canPayRep && this.actor.system.downtime_action_selected_cost === "Rep");

      sheetData.downtimeData = {
        actionsList,
        actionsTooltips,
        actionsRemaining,
        actionsSubmenuData,
        canPayCoin,
        canPayRep,
        isDisplayingCosts,
        isDisplayingActions,
        dotline: {
          dotlineClass: "dotline-right dotline-glow",
          data:         {
            value: actionsRemaining,
            max:   actionsRemaining
          },
          dotlineLabel: "Actions Remaining",
          isLocked:     true,
          iconFull:     "dot-full.svg"
        }
      };
    }

    sheetData.gatherInfoTooltip = (new Handlebars.SafeString([
      "<h1>Gathering Information</h1>",
      "<h2>Questions to Consider</h2>",
      "<ul>",
      ...Object.values(this.actor.system.gather_info ?? []).map((line) => `<li>${line}</li>`) ?? [],
      "</ul>"
    ].join(""))).toString();

    eLog.checkLog("Attribute", "[BladesPCSheet] attributeData", {attributeData: sheetData.attributeData});

    eLog.checkLog("actor", "[BladesPCSheet] getData()", {...context, ...sheetData});

    return {...context, ...sheetData} as BladesActorSheetData;
  }

  get activeArmor() {
    return Object.keys(U.objFilter(
      this.actor.system.armor.active,
      ((val: boolean) => val === true) as testFunc<valFunc>
    ));
  }

  get checkedArmor() {
    return Object.keys(U.objFilter(
      this.actor.system.armor.checked,
      ((val: string|number|boolean, key: KeyOf<typeof this.actor.system.armor.checked>) => val === true
        && this.actor.system.armor.active[key] === true) as testFunc<keyFunc>
    ));
  }

  get uncheckedArmor() {
    return Object.keys(U.objFilter(
      this.actor.system.armor.active,
      ((val: string|number|boolean, key: KeyOf<typeof this.actor.system.armor.active>) => val === true
        && this.actor.system.armor.checked[key] === false) as testFunc<keyFunc>
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

  override activateListeners(html: JQuery) {

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
