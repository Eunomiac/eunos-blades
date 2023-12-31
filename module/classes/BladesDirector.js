/* eslint-disable @typescript-eslint/no-unused-vars */
import U from "../core/utilities.js";
import { SVGDATA, BladesPhase } from "../core/constants.js";
class BladesDirector {
    // #region SINGLE INSTANCE FACTORY METHODS
    static instance;
    constructor() {
        // intentionally left blank
    }
    static getInstance() {
        return (BladesDirector.instance ??= new BladesDirector());
    }
    static async Initialize() {
        // Trigger the instantiation of the Singleton by calling the getter
        const director = BladesDirector.getInstance();
        // Initialize the overlay element once canvas loaded
        Hooks.on("canvasReady", async () => { director.renderOverlay(); });
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
    _overlayElement;
    get overlayElement() {
        if (!this._overlayElement) {
            [this._overlayElement] = $("#blades-overlay");
        }
        if (!this._overlayElement) {
            $("body.vtt").append("<section id=\"blades-overlay\"></section>");
            [this._overlayElement] = $("#blades-overlay");
        }
        return this._overlayElement;
    }
    get clockKeySectionElem() {
        return $(this.overlayElement).find(".overlay-section-clock-keys")[0];
    }
    get locationSectionElem() {
        return $(this.overlayElement).find(".overlay-section-location")[0];
    }
    get scorePanelSectionElem() {
        return $(this.overlayElement).find(".overlay-section-score-panel")[0];
    }
    get npcSectionElem() {
        return $(this.overlayElement).find(".overlay-section-npcs")[0];
    }
    get playerSectionElem() {
        return $(this.overlayElement).find(".overlay-section-players")[0];
    }
    get crewSectionElem() {
        return $(this.overlayElement).find(".overlay-section-crew")[0];
    }
    get notificationSectionElem() {
        return $(this.overlayElement).find(".overlay-section-notifications")[0];
    }
    get transitionSectionElem() {
        return $(this.overlayElement).find(".overlay-section-transitions")[0];
    }
    get svgData() { return SVGDATA; }
    async renderOverlay() {
        // Render the overlay element
        this.overlayElement.innerHTML = await renderTemplate("systems/eunos-blades/templates/overlay/blades-overlay.hbs", this);
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
    activateClockListeners() {
        // tbd...
    }
    activateScorePanelListeners() {
        // tbd...
    }
    activateLocationListeners() {
        // tbd...
    }
    activateNPCListeners() {
        // tbd...
    }
    activatePCListeners() {
        // tbd...
    }
    activateCohortListeners() {
        // tbd...
    }
    activateCrewListeners() {
        // tbd...
    }
    // #endregion
    // #region SOCKETS
    static InitSockets() {
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
    initClockSockets() {
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
    initScorePanelSockets() {
        // tbd...
    }
    initLocationSockets() {
        // tbd...
    }
    initNPCSockets() {
        // tbd...
    }
    initPCSockets() {
        // tbd...
    }
    initCohortSockets() {
        // tbd...
    }
    initCrewSockets() {
        // tbd...
    }
    initNotificationSockets() {
        // tbd...
    }
    initTransitionSockets() {
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
    push(targets, config) {
        const pushID = randomID();
        if (typeof targets === "string") {
            if (targets === "ALL") {
                return socketlib.system.executeForEveryone("$push", pushID, config);
            }
            else if (targets === "GM") {
                return socketlib.system.executeForAllGMs("$push", pushID, config);
            }
            else {
                targets = game.users.filter((user) => user.id === targets
                    || user.name === targets
                    || user.character?.id === targets
                    || user.character?.name === targets).map((user) => user.id);
            }
        }
        if (targets.length > 0) {
            return socketlib.system.executeForUsers("$push", targets, pushID, config);
        }
        return undefined;
    }
    async $push(pushID, config) {
        const pushElem$ = $(await renderTemplate("systems/eunos-blades/templates/overlay/notices/push.hbs", {
            id: pushID,
            ...config
        }))
            .appendTo($(this.notificationSectionElem))
            .on("click", (event) => { this.$removePush(event.currentTarget); })
            .on("contextmenu", (event) => { this.$removeAndClear(event.currentTarget); });
        U.gsap.fromTo(pushElem$, {
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
    async $removePush(target) {
        U.gsap.to(target, {
            x: "+=200",
            autoAlpha: 0,
            ease: "power2",
            duration: 0.5,
            onComplete: function () {
                $(target).remove();
            }
        });
    }
    async $removeAndClear(target) {
        const targets = $(target).prevAll().get().reverse();
        targets.unshift(target);
        U.gsap.to(targets, {
            x: "+=200",
            autoAlpha: 0,
            ease: "power2",
            duration: 0.5,
            stagger: {
                each: 0.5,
                from: "start",
                ease: "power1.inOut"
            },
            onComplete: function () {
                targets.forEach((targ) => $(targ).remove());
            }
        });
    }
    // #endregion
    // #region TRANSITIONS
    // ## Transitions
    async advanceGamePhase(phase) {
        const nextPhase = U.gsap.utils.wrap(Object.values(BladesPhase), Object.values(BladesPhase).indexOf(phase ?? game.eunoblades.Tracker?.phase ?? BladesPhase.Freeplay) + 1);
    }
}
export default BladesDirector;
