/* eslint-disable @typescript-eslint/no-unused-vars */

import U from "../../core/utilities";
import BladesItemSheet from "./BladesItemSheet";
import BladesClockKeeper from "../../documents/items/BladesClockKeeper";
// import U from "../../core/utilities";
import {BladesItemType, ClockColor, ClockDisplayContext, ClockKeyUpdateAction} from "../../core/constants";
import {BladesPC, BladesFaction} from "../../documents/BladesActorProxy";
import BladesClockKey, {BladesClock} from "../../classes/BladesClocks";

class BladesClockKeeperSheet extends BladesItemSheet {

  // static Get() { return game.eunoblades.ClockKeeper as BladesClockKeeper; }

  static override get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["eunos-blades", "sheet", "item", "clock-keeper"],
      template: "systems/eunos-blades/templates/items/clock_keeper-sheet.hbs",
      width: 700,
      height: 970,
      // submitOnChange: false,
      tabs: [{navSelector: ".nav-tabs", contentSelector: ".tab-content", initial: "scene-keys"}]
    });
  }

  static async Initialize() {
    Items.registerSheet("blades", BladesClockKeeperSheet, {types: ["clock_keeper"], makeDefault: true});
    return loadTemplates([
      "systems/eunos-blades/templates/items/clock_keeper-sheet.hbs"
    ]);
  }

  override getData() {
    const context = super.getData();

    const sheetData: BladesItemDataOfType<BladesItemType.clock_keeper> = {
      currentScene: game.scenes.current.id,
      targetScene: this.item.targetSceneID,
      sceneOptions: Array.from(game.scenes),
      sceneKeys: this.item.getSceneKeys(this.item.system.targetScene ?? game.scenes.current.id as IDString),
      pcsWithProjects: BladesPC.All.filter((pc) => pc.projects.length > 0),
      factions: Array.from(BladesFaction.All)
    };

    return {...context, ...sheetData} as BladesItemSheetData;
  }

  addKey(event: MouseEvent) {
    event.preventDefault();
    this.item.addClockKey();
  }

  deleteKey(event: MouseEvent) {
    event.preventDefault();
    const keyID = (event.currentTarget as HTMLElement).dataset.id;
    if (keyID) {
      this.item.deleteClockKey(keyID);
    }
  }

  setSelectColor(select$: JQuery<HTMLSelectElement>, value?: ClockColor) {
    value ??= select$.data("value") as ClockColor;
    switch (value) {
      case ClockColor.yellow: {
        U.gsap.set(select$, {
          color: "var(--blades-black)",
          background: "var(--blades-gold-bright)",
          textShadow: "none"
        });
        break;
      }
      case ClockColor.red: {
        U.gsap.set(select$, {
          color: "var(--blades-white)",
          background: "var(--blades-red)"
        });
        break;
      }
      case ClockColor.cyan: {
        U.gsap.set(select$, {
          color: "var(--blades-black)",
          background: "var(--blades-blue-bright)",
          textShadow: "none"
        });
        break;
      }
      case ClockColor.white: {
        U.gsap.set(select$, {
          color: "var(--blades-black)",
          background: "var(--blades-white)",
          textShadow: "none"
        });
        break;
      }
      default: break;
    }
  }

  override async activateListeners(html: JQuery<HTMLElement>) {
    await super.activateListeners(html);

    // *** CREATE CLOCK KEY *** ~
    html.find("[data-action=\"create-clock-key\"").on({
      click: async (event: ClickEvent) => {
        event.preventDefault();
        await this.item.addClockKey();
        // Notify GM
      }
    });

    // #region Helper Functions to Retrieve Clock Keys & Clocks ~
    function getClockKeyFromEvent(event: ClickEvent | ChangeEvent): BladesClockKey {
      const id = $(event.currentTarget).data("keyId")
        || $(event.currentTarget).closest(".control-flipper").data("clockKeyId");
      if (!id) {throw new Error("No id found on element");}
      const clockKey = game.eunoblades.ClockKeys.get(id as IDString);
      if (!clockKey) {throw new Error(`Clock key with id ${id} not found`);}
      return clockKey;
    }

    function getClockFromEvent(event: ClickEvent | ChangeEvent): [BladesClockKey, BladesClock] {
      const clockKey = getClockKeyFromEvent(event);
      const clockID = $(event.currentTarget).data("clockId")
        || $(event.currentTarget).closest(".control-flipper").data("clockId");
      if (!clockID) {throw new Error("No clockID found on element");}
      const clock = clockKey.getClockByID(clockID);
      if (!clock) {throw new Error(`Clock with id ${clockID} not found`);}
      return [clockKey, clock];
    }
    // #endregion

    // #region Initializing Flip Control Panels ~
    // const flipControls$ = html.find(".control-flipper");
    // setTimeout(() => {
    //   U.gsap.set(flipControls$.find(".controls-back"), {
    //     translateZ: -2,
    //     rotateX: 180,
    //     autoAlpha: 1
    //   });
    //   U.gsap.set(flipControls$.find(".controls-front"), {
    //     translateZ: 2,
    //     autoAlpha: 1
    //   });
    //   U.gsap.set(html.find(".control-flipper.controls-flipped"), {
    //     rotateX: 180
    //   });
    // }, 500);
    // #endregion

    // #region *** CLOCK KEYS *** ~

    const clockKeyControls$ = html.find(".clock-key-control-flipper");

    // #region isOnDisplay === TRUE OR FALSE (Conditional Animation Checks Required) ~
    clockKeyControls$.find("[data-action=\"toggle-name-visibility\"]")
      .each((i, elem) => {
        const elem$ = $(elem as HTMLButtonElement);
        const control$ = elem$.closest(".clock-key-control-flipper");
        elem$.on({
          click: async (event: ClickEvent) => {
            event.preventDefault();
            const clockKey = getClockKeyFromEvent(event);

            const isNameVisible = !clockKey.isNameVisible;
            clockKey.updateTarget("isNameVisible", isNameVisible);

            // If clockKey is on display (in scene & visible), sent out animation socket calls
            if (clockKey.isInScene() && clockKey.isVisible) {
              if (isNameVisible) {
                clockKey.fadeInName_SocketCall(ClockDisplayContext.overlay);
              } else {
                clockKey.fadeOutName_SocketCall(ClockDisplayContext.overlay);
              }
            }

            // Toggle class names on icon
            control$.find("[data-action=\"toggle-name-visibility\"] i")
              .toggleClass("fa-signature")
              .toggleClass("fa-signature-slash")
              .toggleClass("fa-solid")
              .toggleClass("fa-regular");
          }
        });
      });

    clockKeyControls$.find("[data-action=\"toggle-spotlight\"]")
      .each((i, elem) => {
        const elem$ = $(elem as HTMLButtonElement);
        const control$ = elem$.closest(".clock-key-control-flipper");
        elem$.on({
          click: async (event: ClickEvent) => {
            event.preventDefault();
            const clockKey = getClockKeyFromEvent(event);
            const isSpotlit = !clockKey.isSpotlit;
            clockKey.updateTarget("isSpotlit", isSpotlit);

            // If clockKey is on display (in scene & visible), sent out animation socket calls
            if (clockKey.isInScene() && clockKey.isVisible) {
              if (isSpotlit) {
                // clockKey.unspotlight_SocketCall(ClockDisplayContext.overlay);
              } else {
                // clockKey.spotlight_SocketCall(ClockDisplayContext.overlay);
              }
            }

            // Toggle class names on icon
            control$.find("[data-action=\"toggle-spotlight\"] i")
              .toggleClass("fa-message")
              .toggleClass("fa-message-slash")
              .toggleClass("fa-solid")
              .toggleClass("fa-regular");
          }
        });
      });
    // #endregion

    // #region isOnDisplay === TRUE ~
    clockKeyControls$.find("[data-action=\"pull-clock-key\"]")
      .each((i, elem) => {
        const elem$ = $(elem as HTMLButtonElement);
        const control$ = elem$.closest(".clock-key-control-flipper");
        elem$.on({
          click: (event: ClickEvent) => {
            event.preventDefault();
            U.gsap.effects.keyControlPanelFlip(control$, {angle: 180});
            const clockKey = getClockKeyFromEvent(event);
            clockKey.updateTarget("isVisible", false);
            game.eunoblades.Director.pullKey_SocketCall(clockKey.id);
          }
        });
      });
    // #endregion

    // #region isOnDisplay === FALSE ~
    clockKeyControls$.find("[data-action=\"drop-clock-key\"]")
      .each((i, elem) => {
        const elem$ = $(elem as HTMLButtonElement);
        const control$ = elem$.closest(".clock-key-control-flipper");
        elem$.on({
          click: (event: ClickEvent) => {
            event.preventDefault();
            U.gsap.effects.keyControlPanelFlip(control$, {angle: 0});
            const clockKey = getClockKeyFromEvent(event);
            clockKey.updateTarget("isVisible", true);
            game.eunoblades.Director.renderClockKey_SocketCall(clockKey.id);
          }
        });
      });

    clockKeyControls$.find("[data-action=\"spawn-position-dragger\"]").on({
      click: async (event: ClickEvent) => {
        event.preventDefault();
        const clockKey = getClockKeyFromEvent(event);
        clockKey.spawnPositionDragger(game.eunoblades.Director.clockKeySection$);
      }
    });

    clockKeyControls$.find("[data-action=\"delete-clock-key\"]").on({
      click: async (event: ClickEvent) => {
        event.preventDefault();
        await getClockKeyFromEvent(event).delete(game.eunoblades.ClockKeys);
      }
    });

    clockKeyControls$.find("[data-action=\"add-key-to-scene\"]").on({
      click: async (event: ClickEvent) => {
        event.preventDefault();
        await getClockKeyFromEvent(event).addToScene(this.document.targetSceneID);
      }
    });

    clockKeyControls$.find("[data-action=\"remove-key-from-scene\"]").on({
      click: async (event: ClickEvent) => {
        event.preventDefault();
        await getClockKeyFromEvent(event).removeFromScene(this.document.targetSceneID);
      }
    });

    clockKeyControls$.find("[data-action=\"add-clock-to-key\"]").on({
      click: async (event: ClickEvent) => {
        event.preventDefault();
        await getClockKeyFromEvent(event).addClock();
      }
    });

    clockKeyControls$.find("input.clock-key-input:not([readonly])").on({
      change: async (event: ChangeEvent) => {
        event.preventDefault();
        const input$ = $(event.currentTarget);
        const inputVal = input$.val();
        if (typeof inputVal === "string") {
          getClockKeyFromEvent(event).updateTarget(input$.data("targetProp"), inputVal);
          clockKeyControls$.find("input.clock-key-input").val(inputVal);
        }
      }
    });
    // #endregion

    // #endregion

    // #region *** CLOCKS *** ~

    const clockControls$ = html.find(".clock-control-flipper");

    // #region isOnDisplay === TRUE OR FALSE (Conditional Animation Checks Required) ~

    clockControls$.find("[data-action=\"toggle-visible\"]")
      .each((i, elem) => {
        const elem$ = $(elem as HTMLButtonElement);
        const control$ = elem$.closest(".clock-control-flipper");
        elem$.on({
          click: async (event: ClickEvent) => {
            event.preventDefault();
            const [clockKey, clock] = getClockFromEvent(event);
            const isVisible = !clock.isVisible;
            clock.updateTarget("isVisible", isVisible);

            // If clock key is on display (in scene & visible), sent out animation socket calls
            if (clockKey.isInScene() && clockKey.isVisible) {
              if (isVisible) {
                clock.reveal_SocketCall(ClockDisplayContext.overlay);
              } else {
                clock.hide_SocketCall(ClockDisplayContext.overlay);
              }
            }

            // Toggle class names on icon
            control$.find("[data-action=\"toggle-visible\"] i")
              .toggleClass("fa-eye")
              .toggleClass("fa-eye-slash")
              .toggleClass("fa-solid")
              .toggleClass("fa-regular");
          }
        });
      });

    clockControls$.find("[data-action=\"toggle-active\"]")
      .each((i, elem) => {
        const elem$ = $(elem as HTMLButtonElement);
        const control$ = elem$.closest(".clock-control-flipper");
        elem$.on({
          click: async (event: ClickEvent) => {
            event.preventDefault();
            const [clockKey, clock] = getClockFromEvent(event);
            const isActive = !clock.isActive;
            clock.updateTarget("isActive", isActive);

            // If clock AND clock key is on display (in scene & visible), sent out animation socket calls
            if (clock.parentKey.isInScene() && clock.parentKey.isVisible && clock.isVisible) {
              if (isActive) {
                clock.activate_SocketCall(ClockDisplayContext.overlay);
              } else {
                clock.deactivate_SocketCall(ClockDisplayContext.overlay);
              }
            }

            // Toggle class names on icon
            control$.find("[data-action=\"toggle-active\"] i")
              .toggleClass("fa-bolt")
              .toggleClass("fa-bolt-slash")
              .toggleClass("fa-solid")
              .toggleClass("fa-regular");
          }
        });
      });

    clockControls$.find("[data-action=\"toggle-name-visibility\"]")
      .each((i, elem) => {
        const elem$ = $(elem as HTMLButtonElement);
        const control$ = elem$.closest(".clock-control-flipper");
        elem$.on({
          click: async (event: ClickEvent) => {
            event.preventDefault();
            const clock = getClockFromEvent(event)[1];

            const isNameVisible = !clock.isNameVisible;
            clock.updateTarget("isNameVisible", isNameVisible);

            // If clock is on display (in scene & visible), sent out animation socket calls
            if (clock.parentKey.isInScene() && clock.parentKey.isVisible && clock.isVisible) {
              if (isNameVisible) {
                clock.fadeInClockName_SocketCall(ClockDisplayContext.overlay);
              } else {
                clock.fadeOutClockName_SocketCall(ClockDisplayContext.overlay);
              }
            }
            // Toggle class names on icon
            control$.find("[data-action=\"toggle-name-visibility\"] i")
              .toggleClass("fa-signature")
              .toggleClass("fa-signature-slash")
              .toggleClass("fa-solid")
              .toggleClass("fa-regular");
          }
        });
      });

    clockControls$.find("[data-action=\"toggle-highlight\"]")
      .each((i, elem) => {
        const elem$ = $(elem as HTMLButtonElement);
        const control$ = elem$.closest(".clock-control-flipper");
        elem$.on({
          click: async (event: ClickEvent) => {
            event.preventDefault();
            const [clockKey, clock] = getClockFromEvent(event);
            const isHighlighted = !clock.isHighlighted;
            clock.updateTarget("isHighlighted", isHighlighted);

            // If clock is on display (in scene & visible), sent out animation socket calls
            if (clock.parentKey.isInScene() && clock.parentKey.isVisible && clock.isVisible) {
              if (isHighlighted) {
                clock.highlight_SocketCall(ClockDisplayContext.overlay);
              } else {
                clock.unhighlight_SocketCall(ClockDisplayContext.overlay);
              }
            }
            // Toggle class names on icon
            control$.find("[data-action=\"toggle-highlight\"] i")
              .toggleClass("fa-lightbulb")
              .toggleClass("fa-lightbulb-slash")
              .toggleClass("fa-solid")
              .toggleClass("fa-regular");
          }
        });
      });
    // #endregion

    // #region isOnDisplay === TRUE ~
    clockControls$.find("[data-action=\"change-segments\"]")
      .each((i, elem) => {
        const elem$ = $(elem as HTMLInputElement);
        const control$ = elem$.closest(".clock-control-flipper");
        elem$.on({
          click: async (event: ClickEvent) => {
            event.preventDefault();
            const [clockKey, clock] = getClockFromEvent(event);
            const delta = U.pInt($(event.currentTarget).data("value"));
            const finalVal = U.gsap.utils.clamp(0, clock.max, clock.value + delta);

            if (delta > 0) {
              clock.fillSegments(delta, true);
            } else {
              clock.clearSegments(Math.abs(delta), true);
            }

            control$.find("select.clock-select-value").val(finalVal);

            clock.changeSegments_SocketCall(ClockDisplayContext.overlay, clock.value, finalVal);
          }
        });
      });

    // #endregion

    // #region isOnDisplay === FALSE ~
    clockControls$.find("select.clock-control-select")
      .each((i, elem) => {
        const elem$ = $(elem as HTMLSelectElement);
        if (elem$.hasClass("clock-select-color")) {
          // this.setSelectColor(elem$);
        }
      })
      .on({
        change: (event: SelectChangeEvent) => {
          event.preventDefault();
          const select$ = $(event.currentTarget);
          const value = select$.data("dtype") === "number"
            ? U.pInt(select$.val())
            : select$.val();
          const prop = select$.data("targetProp");
          getClockFromEvent(event)[1].updateTarget(prop, value);

          if (prop === "color" && typeof value === "string" && value in ClockColor) {
            this.setSelectColor(select$, value as ClockColor);
          }
        }
      });

    clockControls$.find("input.clock-input:not([readonly])")
      .each((i, elem) => {
        const elem$ = $(elem as HTMLInputElement);
        const control$ = elem$.closest(".clock-control-flipper");
        elem$.on({
          change: (event: ChangeEvent) => {
            event.preventDefault();
            const input$ = $(event.currentTarget);
            const inputVal = input$.val();
            if (typeof inputVal === "string") {
              getClockFromEvent(event)[1].updateTarget(input$.data("targetProp"), inputVal);
              control$.find("input.clock-input").val(inputVal);
            }
          }
        });
      });

    clockControls$.find("[data-action=\"delete-clock\"]").on({
      click: async (event: ClickEvent) => {
        event.preventDefault();
        await getClockFromEvent(event)[1].delete();
      }
    });
    // #endregion

    // #endregion
  }
}

declare interface BladesClockKeeperSheet {
  item: BladesClockKeeper,
  get document(): BladesClockKeeper
}

export default BladesClockKeeperSheet;
