/* eslint-disable @typescript-eslint/no-unused-vars */
import U from "../core/utilities";
import {SVGDATA, BladesPhase, BladesActorType, BladesItemType} from "../core/constants";
// import U from "../core/utilities";
import {BladesActor} from "../documents/BladesActorProxy";
import {BladesItem} from "../documents/BladesItemProxy";
import BladesClockKey from "./BladesClocks";

import {gsapEffects, gsapEffect, gsapConfig} from "../core/gsap";

namespace BladesDirector {

  export interface PushNoticeConfig {

  }
}

const ObserverIgnoreStrings: string[] = [];


class BladesDirector {

  // #region SINGLE INSTANCE FACTORY METHODS
  private static instance: BladesDirector;

  _id: IDString;

  private constructor() {
    this._id = randomID() as IDString;
  }

  public static getInstance(): BladesDirector {
    return (BladesDirector.instance ??= new BladesDirector());
  }

  public static async Initialize() {
    // Return asynchronous template loading.
    return loadTemplates([
      "systems/eunos-blades/templates/overlay/blades-overlay.hbs",
      "systems/eunos-blades/templates/overlay/location.hbs",
      "systems/eunos-blades/templates/overlay/score-panel.hbs",
      "systems/eunos-blades/templates/overlay/npc-portrait.hbs",
      "systems/eunos-blades/templates/overlay/pc-portrait.hbs",
      "systems/eunos-blades/templates/overlay/cohort-portrait.hbs",
      "systems/eunos-blades/templates/overlay/crew-status-bar.hbs",
      "systems/eunos-blades/templates/overlay/game-phase-bar.hbs",

      "systems/eunos-blades/templates/overlay/notices/push.hbs"
    ]);
  }
  // #endregion

  // #region OVERLAY
  private _overlayContainer?: HTMLElement;
  private _overlayContainer$?: JQuery<HTMLElement>;
  private get overlayContainer(): HTMLElement {
    if (!this._overlayContainer) {
      [this._overlayContainer] = $("#blades-overlay");
    }
    if (!this._overlayContainer) {
      $("body.vtt").append("<section id=\"blades-overlay\"></section>");
      [this._overlayContainer] = $("#blades-overlay");
    }
    return this._overlayContainer;
  }
  private get overlayContainer$(): JQuery<HTMLElement> {
    if (!this._overlayContainer$) {
      this._overlayContainer$ = $(this.overlayContainer);
    }
    return this._overlayContainer$;
  }


  private get clockKeySection$(): JQuery<HTMLElement> {
    return this.overlayContainer$.find(".overlay-section-clock-keys");
  }

  public async appendClockKeyToOverlay(clockKey: BladesClockKey): Promise<JQuery<HTMLElement>> {
    const clockKeyHTML = await clockKey.getHTML();
    $(clockKeyHTML).appendTo(this.clockKeySection$);
    if (!clockKey.containerElem$) { throw new Error("ClockKey container element not found."); }
    this.activateClockListeners(clockKey.containerElem$);
    return clockKey.containerElem$;
  }

  public removeClockKeyFromOverlay(clockKey: BladesClockKey): void {
    delete clockKey._hoverOverTimeline;
    delete clockKey._keySwingTimeline;
    clockKey.containerElem$?.remove();
  }

  private get locationSection$(): JQuery<HTMLElement> {
    return this.overlayContainer$.find(".overlay-section-location");
  }

  private get scorePanelSection$(): JQuery<HTMLElement> {
    return this.overlayContainer$.find(".overlay-section-score-panel");
  }

  private get npcSection$(): JQuery<HTMLElement> {
    return this.overlayContainer$.find(".overlay-section-npcs");
  }

  private get playerSection$(): JQuery<HTMLElement> {
    return this.overlayContainer$.find(".overlay-section-players");
  }

  private get crewSection$(): JQuery<HTMLElement> {
    return this.overlayContainer$.find(".overlay-section-crew");
  }

  private get notificationSection$(): JQuery<HTMLElement> {
    return this.overlayContainer$.find(".overlay-section-notifications");
  }

  private get transitionSection$(): JQuery<HTMLElement> {
    return this.overlayContainer$.find(".overlay-section-transitions");
  }

  private get svgData() {return SVGDATA;}
  // #endregion

  get sceneKeys() {return game.eunoblades.ClockKeeper.getSceneKeys();}

  renderOverlay_SocketCall() {
    if (!game.user.isGM) {return;}
    if (!this.overlayContainer) {return;}
    socketlib.system.executeForEveryone("renderOverlay_SocketCall");
  }
  async renderOverlay_SocketResponse() {

    // Render the overlay element
    const overlayContent = await renderTemplate(
      "systems/eunos-blades/templates/overlay/blades-overlay.hbs",
      this
    );
    this.overlayContainer$.empty().append(overlayContent);

    // Display keys that are visible
    this.sceneKeys
      .filter((key) => key.isVisible)
      .forEach((key) => key.drop_Animation((async () => {
        await game.eunoblades.Director.activateClockListeners(key.containerElem$);
        if (key.isNameVisible) {
          key.nameFadeInTimeline.progress(0.99).play();
        }
      })));
  }


  private async activateClockListeners(keyContainers$: JQuery<HTMLElement> = this.clockKeySection$.find(".clock-key-container")) {

    keyContainers$.each((_, keyContainer) => {
      const keyContainer$ = $(keyContainer);
      const clockKey = game.eunoblades.ClockKeys.get(keyContainer$.find(".clock-key").attr("id") ?? "");
      if (!clockKey) {return;}

      // The ".key-bg" child is actually the correct shape, so that will be our listener object.
      const keyListener$ = clockKey.elem$?.find(".key-bg");
      if (!keyListener$?.[0]) { return; }

      // Enable pointer events on the key-bg, so that the hover-over timeline can be played,
      //   and remove any existing listeners to avoid duplication
      keyListener$.css("pointer-events", "auto");
      keyListener$.off();

      // Do the same for clocks contained by the key
      clockKey.clocks.forEach((clock) => {
        if (!clock.elem$) {return;}
        clock.elem$.css("pointer-events", "auto");
        clock.elem$.off();
      });

      if (game.user.isGM) {
        // === GM-ONLY LISTENERS ===

        // Double-Click a Clock Key = SocketPull it, Open ClockKeeper sheet
        keyListener$.on("dblclick", async () => {
          clockKey.pull_SocketCall();
          if (!game.eunoblades.ClockKeeper.sheet?.rendered) {
            game.eunoblades.ClockKeeper.render(true);
          }
        });

        // Right-Click a Clock Key = Open ClockKeeper sheet.
        keyListener$.on("dblclick", async () => {
          if (!game.eunoblades.ClockKeeper.sheet?.rendered) {
            game.eunoblades.ClockKeeper.render(true);
          }
        });

        // Mouse-Wheel a Clock = Add/Remove Segments one-by-one.
        //   -- can UPDATE the server data immediately
        //   -- at end of each animated segment, check server data to see if another one should be animated in
        //   -- need animations for COMPLETING a clock, and for EMPTYING a clock.

        clockKey.clocks.forEach((clock) => {
          if (!clock.elem) {return;}
          const clockElem$ = $(clock.elem);
          clockElem$.on("wheel", async (event) => {
            if (!(event.originalEvent instanceof WheelEvent)) {return;}
            event.preventDefault();
            const delta = event.originalEvent.deltaY ?? 0;
            if (delta > 0) {
              await clock.fillSegments(1);
            } else if (delta < 0) {
              await clock.clearSegments(1);
            }
            // === TEMPORARY: RERENDER DIRECTOR OVERLAY TO SEE CLOCK CHANGES ===
            // (replace with socketlib call to animation effect within fillSegments/clearSegments methods)
            this.renderOverlay_SocketCall();
          });
        });

      } else {
        // === PLAYER-ONLY LISTENERS ===

        // Add listeners to container for mouseenter and mouseleave, that play and reverse timeline attached to element
        keyListener$.on("mouseenter", () => {
          clockKey.hoverOverTimeline.play();
        }).on("mouseleave", () => {
          U.reverseRepeatingTimeline(clockKey.hoverOverTimeline);
        });

        // Now repeat this for each clock in the clock key
        clockKey.clocks.forEach((clock) => {
          if (!clock.elem) {return;}
          const clockElem$ = $(clock.elem);

          // Add listeners to clock for mouseenter and mouseleave, that play and reverse timeline attached to element
          clockElem$.on("mouseenter", () => {
            clock.hoverOverTimeline?.play();
          }).on("mouseleave", () => {
            if (clock.hoverOverTimeline) {
              U.reverseRepeatingTimeline(clock.hoverOverTimeline);
            }
          });
        });
      }
    });
  }

  private activateScorePanelListeners() {
    // tbd...
  }

  private activateLocationListeners() {
    // tbd...
  }

  private activateNPCListeners() {
    // tbd...
  }

  private activatePCListeners() {
    // tbd...
  }

  private activateCohortListeners() {
    // tbd...
  }

  private activateCrewListeners() {
    // tbd...
  }
  // #endregion

  // #region SOCKETS
  public static InitSockets() {
    const director = BladesDirector.getInstance();

    socketlib.system.register("renderOverlay_SocketCall", director.renderOverlay_SocketResponse.bind(director));

    director.initClockSockets();
    director.initScorePanelSockets();
    director.initLocationSockets();
    director.initNPCSockets();
    director.initPCSockets();
    director.initCohortSockets();
    director.initCrewSockets();
    director.initNotificationSockets();
    director.initTransitionSockets();
  }

  private initClockSockets() {
    // socketlib.system.register("$addClockKey", this.$addClockKey.bind(this));
    // socketlib.system.register("$deleteClockKey", this.$deleteClockKey.bind(this));
    // socketlib.system.register("$changeClockKeyDisplay", this.$changeClockKeyDisplay.bind(this));
    // socketlib.system.register("$addClock", this.$addClock.bind(this));
    // socketlib.system.register("$deleteClock", this.$deleteClock.bind(this));
    // socketlib.system.register("$addSegments", this.$addSegments.bind(this));
    // socketlib.system.register("$removeSegments", this.$removeSegments.bind(this));
    // socketlib.system.register("$changeClockDisplay", this.$changeClockDisplay.bind(this));
  }

  // addClockKey(key: BladesClockKey) {
  //   if (!game.user.isGM) {return;}
  //   socketlib.system.executeForEveryone("$addClockKey", key.data);
  // }

  private initScorePanelSockets() {
    // tbd...
  }

  private initLocationSockets() {
    // tbd...
  }

  private initNPCSockets() {
    // tbd...
  }

  private initPCSockets() {
    // tbd...
  }

  private initCohortSockets() {
    // tbd...
  }

  private initCrewSockets() {
    // tbd...
  }

  private initNotificationSockets() {
    // tbd...
  }

  private initTransitionSockets() {
    // tbd...
  }

  // #endregion

  // #region CLOCKS & CLOCK KEYS
  // ## Clock Keys


  // - Set hard-coded locations for up to six keys along the sides
  // - Drag from here to rolls to display relevant clocks
  // #endregion

  // #region SCORE PANEL
  // ## Score Details
  // - Small panel overlapping corner of Location
  // - Engagement roll result
  // - Plan & Detail
  // - Target tier
  // #endregion

  // #region LOCATIONS
  // ## Locations
  // - District wrapper/header
  // - Faction wrapper/footer
  // - Location main
  // - Slide-scroll of sublocations
  // #endregion

  // #region NPCs
  // ## NPCs
  // - Linked to a location: When location is displayed, so are they.  *(Can be linked to District wrapper, main Location, or sublocations)*
  // - Portrait images close to the central location display, hover-over popups provide more detailed information from sheet or `BladesScore` instance
  // #endregion

  // #region PCs, COHORTs, CREW
  // ## PCs
  // - Display panels along bottom
  // - Signal lights

  // ## Cohorts
  // - Smaller panels alongside the PCs

  // ## Crew
  // - Limited information displayed, maybe bar beneath PCs showing Heat, Wanted Level…
  // #endregion

  // #region NOTIFICATIONS

  public push(targets: string[] | string, config: BladesDirector.PushNoticeConfig) {
    const pushID = randomID();
    if (typeof targets === "string") {
      if (targets === "ALL") {
        return socketlib.system.executeForEveryone("$push", pushID, config);
      } else if (targets === "GM") {
        return socketlib.system.executeForAllGMs("$push", pushID, config);
      } else {
        targets = game.users.filter((user) =>
          user.id === targets
          || user.name === targets
          || user.character?.id === targets
          || user.character?.name === targets
        ).map((user) => user.id as string);
      }
    }
    if (targets.length > 0) {
      return socketlib.system.executeForUsers("$push", targets, pushID, config);
    }

    return undefined;
  }

  private async $push(pushID: IDString, config: BladesDirector.PushNoticeConfig) {
    const pushElem$ = $(await renderTemplate("systems/eunos-blades/templates/overlay/notices/push.hbs", {
      id: pushID,
      ...config
    }))
      .appendTo(this.notificationSection$)
      .on("click", (event: ClickEvent) => {this.$removePush(event.currentTarget);})
      .on("contextmenu", (event: ContextMenuEvent) => {this.$removeAndClear(event.currentTarget);});

    U.gsap.fromTo(
      pushElem$,
      {
        x: 200,
        skewX: 20,
        autoAlpha: 0,
        filter: "blur(10px)"
      }, {
        x: 0,
        skewX: 0,
        autoAlpha: 1,
        filter: "blur(0px)",
        duration: 0.5,
        ease: "back"
      });
  }

  private async $removePush(target: HTMLElement) {
    U.gsap.to(
      target,
      {
        x: "+=200",
        autoAlpha: 0,
        ease: "power2",
        duration: 0.5,
        onComplete: function() {
          $(target).remove();
        }
      });
  }

  private async $removeAndClear(target: HTMLElement) {
    const targets = $(target).prevAll().get().reverse();
    targets.unshift(target);
    U.gsap.to(
      targets,
      {
        x: "+=200",
        autoAlpha: 0,
        ease: "power2",
        duration: 0.5,
        stagger: {
          each: 0.5,
          from: "start",
          ease: "power1.inOut"
        },
        onComplete: function() {
          targets.forEach((targ) => $(targ).remove());
        }
      });
  }
  // #endregion

  // #region TRANSITIONS
  // ## Transitions
  async advanceGamePhase(phase?: BladesPhase) {
    const nextPhase = U.gsap.utils.wrap(
      Object.values(BladesPhase),
      Object.values(BladesPhase).indexOf(phase ?? game.eunoblades.Tracker?.phase ?? BladesPhase.Freeplay) + 1
    );

  }
  // - As with notifications: placeholder animation until something more final can be coded.
  // #endregion

  // #region CLOCKS OVERLAY


}

export default BladesDirector;
