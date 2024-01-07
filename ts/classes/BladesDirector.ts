/* eslint-disable @typescript-eslint/no-unused-vars */
import U from "../core/utilities";
import {ClockKey_SVGDATA, BladesPhase, BladesActorType, BladesItemType} from "../core/constants";
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

  private get svgData() {return ClockKey_SVGDATA;}
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

    // Render keys that are visible
    const visibleSceneKeys = U.shuffle(this.sceneKeys.filter((key) => key.isVisible)) as BladesClockKey[];
    let staggerDelay = 0;
    while (visibleSceneKeys.length) {
      const key = visibleSceneKeys.shift();
      setTimeout(() => {
        if (key) {
          key.renderClockKey(this.clockKeySection$);
        }
      }, staggerDelay * 1000);
      staggerDelay += 0.5;
    }
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
