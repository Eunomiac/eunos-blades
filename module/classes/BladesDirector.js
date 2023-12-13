import U from "../core/utilities.js";
import { SVGDATA } from "../core/constants.js";
import { BladesClockKey } from "./BladesClock.js";
class BladesDirector {
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
            "systems/eunos-blades/templates/overlay/game-phase-bar.hbs"
        ]);
    }
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
        socketlib.system.register("$addClockKey", this.$addClockKey.bind(this));
        // socketlib.system.register("$deleteClockKey", this.$deleteClockKey.bind(this));
        // socketlib.system.register("$changeClockKeyDisplay", this.$changeClockKeyDisplay.bind(this));
        // socketlib.system.register("$addClock", this.$addClock.bind(this));
        // socketlib.system.register("$deleteClock", this.$deleteClock.bind(this));
        // socketlib.system.register("$addSegments", this.$addSegments.bind(this));
        // socketlib.system.register("$removeSegments", this.$removeSegments.bind(this));
        // socketlib.system.register("$changeClockDisplay", this.$changeClockDisplay.bind(this));
    }
    addClockKey(key) {
        if (!game.user.isGM) {
            return;
        }
        socketlib.system.executeForEveryone("$addClockKey", key._initData);
    }
    async $addClockKey(keyData) {
        const key = await BladesClockKey.Create(keyData);
        const keyHTML = await renderTemplate("systems/eunos-blades/templates/overlay/clock-key.hbs", key);
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
}
export default BladesDirector;
