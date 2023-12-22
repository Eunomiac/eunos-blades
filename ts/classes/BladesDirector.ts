import U from "../core/utilities";
import {SVGDATA, BladesPhase, BladesActorType, BladesItemType} from "../core/constants";
// import U from "../core/utilities";
import {BladesActor} from "../documents/BladesActorProxy";
import {BladesItem} from "../documents/BladesItemProxy";
import BladesClock, {BladesClockKey, ApplyClockListeners} from "./BladesClock";

import {gsapEffects, gsapEffect, gsapConfig} from "../core/gsap";

namespace BladesDirector {

  export interface PushNoticeConfig {

  }
}

class BladesDirector {

  // #region SINGLE INSTANCE FACTORY METHODS
  private static instance: BladesDirector;

  private constructor() { // eslint-disable-line no-useless-constructor
    // intentionally left blank
  }

  public static getInstance(): BladesDirector {
    return (BladesDirector.instance ??= new BladesDirector());
  }

  public static async Initialize() {
    // Trigger the instantiation of the Singleton by calling the getter
    const director = BladesDirector.getInstance();

    // Initialize the overlay element once canvas loaded
    Hooks.on("canvasReady", async () => {director.renderOverlay();});

    // Return asynchronous template loading.
    return loadTemplates([
      "systems/eunos-blades/templates/overlay/blades-overlay.hbs",
      "systems/eunos-blades/templates/overlay/clock-key.hbs",
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
  private _overlayElement?: HTMLElement;

  private get overlayElement(): HTMLElement {
    if (!this._overlayElement) {
      [this._overlayElement] = $("#blades-overlay");
    }
    if (!this._overlayElement) {
      $("body.vtt").append("<section id=\"blades-overlay\"></section>");
      [this._overlayElement] = $("#blades-overlay");
    }
    return this._overlayElement;
  }

  private get clockKeySectionElem(): HTMLElement {
    return $(this.overlayElement).find(".overlay-section-clock-keys")[0];
  }

  private get locationSectionElem(): HTMLElement {
    return $(this.overlayElement).find(".overlay-section-location")[0];
  }

  private get scorePanelSectionElem(): HTMLElement {
    return $(this.overlayElement).find(".overlay-section-score-panel")[0];
  }

  private get npcSectionElem(): HTMLElement {
    return $(this.overlayElement).find(".overlay-section-npcs")[0];
  }

  private get playerSectionElem(): HTMLElement {
    return $(this.overlayElement).find(".overlay-section-players")[0];
  }

  private get crewSectionElem(): HTMLElement {
    return $(this.overlayElement).find(".overlay-section-crew")[0];
  }

  private get notificationSectionElem(): HTMLElement {
    return $(this.overlayElement).find(".overlay-section-notifications")[0];
  }

  private get transitionSectionElem(): HTMLElement {
    return $(this.overlayElement).find(".overlay-section-transitions")[0];
  }

  private get svgData() {return SVGDATA;}

  public async renderOverlay() {
    // Render the overlay element
    this.overlayElement.innerHTML = await renderTemplate(
      "systems/eunos-blades/templates/overlay/blades-overlay.hbs",
      this
    );

    // Clear previously-applied listeners
    $(this.overlayElement).find("*").addBack().off(".blades-director");

    // Reactivate event listeners
    this.activateClockListeners();
    this.activateScorePanelListeners();
    this.activateLocationListeners();
    this.activateNPCListeners();
    this.activatePCListeners();
    this.activateCohortListeners();
    this.activateCrewListeners();
  }

  private activateClockListeners() {
    // tbd...
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
    socketlib.system.register("$addClockKey", this.$addClockKey.bind(this));
    // socketlib.system.register("$deleteClockKey", this.$deleteClockKey.bind(this));
    // socketlib.system.register("$changeClockKeyDisplay", this.$changeClockKeyDisplay.bind(this));
    // socketlib.system.register("$addClock", this.$addClock.bind(this));
    // socketlib.system.register("$deleteClock", this.$deleteClock.bind(this));
    // socketlib.system.register("$addSegments", this.$addSegments.bind(this));
    // socketlib.system.register("$removeSegments", this.$removeSegments.bind(this));
    // socketlib.system.register("$changeClockDisplay", this.$changeClockDisplay.bind(this));
  }

  addClockKey(key: BladesClockKey) {
    if (!game.user.isGM) {return;}
    socketlib.system.executeForEveryone("$addClockKey", key._initData);
  }

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

  async $addClockKey(
    keyData: BladesClockKeySystemData
  ) {
    const key = await BladesClockKey.Create(keyData);
    const keyHTML = await renderTemplate(
      "systems/eunos-blades/templates/overlay/clock-key.hbs",
      key
    );
    const keyElem = $(keyHTML).appendTo(this.clockKeySectionElem)[0];
    U.gsap.from(keyElem, {
      scale: 0.5,
      x: -1500,
      skewX: 50,
      filter: "blur(100px)",
      autoAlpha: 0,
      ease: "elastic.out(0.4, 0.25)",
      duration: 6
    }).then(() => U.gsap.effects.keyHang(keyElem).play());
  }

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

  public push(targets: string[]|string, config: BladesDirector.PushNoticeConfig) {
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
      .appendTo($(this.notificationSectionElem))
      .on("click", (event: ClickEvent) => { this.$removePush(event.currentTarget); })
      .on("contextmenu", (event: ContextMenuEvent) => { this.$removeAndClear(event.currentTarget); });

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
          targets.forEach((target) => $(target).remove());
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
