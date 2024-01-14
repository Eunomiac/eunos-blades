/* eslint-disable @typescript-eslint/no-unused-vars */
import U from "../core/utilities.js";
import C, { ClockKey_SVGDATA, BladesPhase } from "../core/constants.js";
import BladesClockKey, { BladesClock } from "./BladesClocks.js";
class BladesDirector {
    // #region INITIALIZATION ~
    // #region   >>  Single-Instance Factory Construction ~
    static instance;
    _id;
    constructor() {
        this._id = randomID();
    }
    static getInstance() {
        return (BladesDirector.instance ??= new BladesDirector());
    }
    // #endregion
    static async Initialize() {
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
    // #region   >>  Sockets ~
    static InitSockets() {
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
    // #endregion
    // #endregion
    // #region OVERLAY ~
    // #region  >> Overlay Elements$ ~
    _overlayContainer;
    _overlayContainer$;
    get overlayContainer() {
        if (!this._overlayContainer) {
            [this._overlayContainer] = $("#blades-overlay");
        }
        if (!this._overlayContainer) {
            $("body.vtt").append("<section id=\"blades-overlay\"></section>");
            [this._overlayContainer] = $("#blades-overlay");
        }
        return this._overlayContainer;
    }
    get overlayContainer$() {
        if (!this._overlayContainer$) {
            this._overlayContainer$ = $(this.overlayContainer);
        }
        return this._overlayContainer$;
    }
    get clockKeySection$() {
        return this.overlayContainer$.find(".overlay-section-clock-keys");
    }
    get locationSection$() {
        return this.overlayContainer$.find(".overlay-section-location");
    }
    get scorePanelSection$() {
        return this.overlayContainer$.find(".overlay-section-score-panel");
    }
    get npcSection$() {
        return this.overlayContainer$.find(".overlay-section-npcs");
    }
    get playerSection$() {
        return this.overlayContainer$.find(".overlay-section-players");
    }
    get crewSection$() {
        return this.overlayContainer$.find(".overlay-section-crew");
    }
    get notificationSection$() {
        return this.overlayContainer$.find(".overlay-section-notifications");
    }
    get transitionSection$() {
        return this.overlayContainer$.find(".overlay-section-transitions");
    }
    get tooltipSection$() {
        return this.overlayContainer$.find(".overlay-section-tooltips");
    }
    get svgData() { return ClockKey_SVGDATA; }
    // #endregion
    // #region  >> Rendering ~
    renderOverlay_SocketCall() {
        if (!game.user.isGM) {
            return;
        }
        if (!this.overlayContainer) {
            return;
        }
        socketlib.system.executeForEveryone("renderOverlay_SocketCall");
    }
    initClockKeySection() {
        // Render keys that are visible
        const visibleSceneKeys = U.shuffle(this.sceneKeys.filter((key) => key.isVisible));
        let staggerDelay = 0;
        while (visibleSceneKeys.length) {
            const key = visibleSceneKeys.shift();
            if (key) {
                setTimeout(() => this.renderClockKey(key), staggerDelay * 1000);
                staggerDelay += 0.5;
            }
        }
        // Apply item dragger
        setTimeout(() => {
            // Create dragger instance for dragging clocks & clock keys onto, e.g, rolls
        }, staggerDelay * 1000);
    }
    async renderOverlay_SocketResponse() {
        // Render the overlay element
        const overlayContent = await renderTemplate("systems/eunos-blades/templates/overlay/blades-overlay.hbs", this);
        this.overlayContainer$.empty().append(overlayContent);
        // Initialize clock key section
        this.initClockKeySection();
        // Initialize tooltip section
        this.initTooltipSection();
    }
    // #endregion
    // #endregion
    // #region CLOCKS & CLOCK KEYS
    // #region   >> INITIALIZATION ~
    initClockSockets() {
        socketlib.system.register("renderClockKey_SocketCall", BladesDirector.renderClockKey_SocketResponse.bind(BladesDirector));
        socketlib.system.register("pullKey_SocketCall", BladesDirector.pullKey_SocketResponse.bind(BladesDirector));
        socketlib.system.register("fadeInName_SocketCall", BladesClockKey.fadeInName_SocketResponse.bind(BladesClockKey));
        socketlib.system.register("fadeOutName_SocketCall", BladesClockKey.fadeOutName_SocketResponse.bind(BladesClockKey));
        socketlib.system.register("reveal_SocketCall", BladesClock.reveal_SocketResponse.bind(BladesClock));
        socketlib.system.register("hide_SocketCall", BladesClock.hide_SocketResponse.bind(BladesClock));
        socketlib.system.register("activate_SocketCall", BladesClock.activate_SocketResponse.bind(BladesClock));
        socketlib.system.register("deactivate_SocketCall", BladesClock.deactivate_SocketResponse.bind(BladesClock));
        socketlib.system.register("fadeInClockName_SocketCall", BladesClock.fadeInClockName_SocketResponse.bind(BladesClock));
        socketlib.system.register("fadeOutClockName_SocketCall", BladesClock.fadeOutClockName_SocketResponse.bind(BladesClock));
        socketlib.system.register("highlight_SocketCall", BladesClock.highlight_SocketResponse.bind(BladesClock));
        socketlib.system.register("unhighlight_SocketCall", BladesClock.unhighlight_SocketResponse.bind(BladesClock));
        socketlib.system.register("changeSegments_SocketCall", BladesClock.changeSegments_SocketResponse.bind(BladesClock));
    }
    // #endregion
    get sceneKeys() { return game.eunoblades.ClockKeeper.getSceneKeys(); }
    // #region   >> Rendering (Dropping) Clock Keys ~
    dropKey_Animation(key, keyElems$) {
        const { container$, label$, imgContainer$, clocks } = keyElems$ ?? key.getElements$(game.eunoblades.Director.clockKeySection$);
        const keySwingTimeline = imgContainer$.data("keySwingTimeline");
        // Construct timeline for revealing clock key
        const tl = U.gsap.timeline()
            .call(() => { keySwingTimeline.seek("NEUTRAL").play(); })
            .from(container$, {
            y: -800,
            ease: "bounce",
            duration: 1
        }, 0)
            .to(container$, { autoAlpha: 1, duration: 0.5, ease: "power2" }, 0);
        // Reveal visible clocks
        key.visibleClocks.forEach((clock, i) => {
            tl.add(() => { clock.reveal_Animation(clocks[clock.id]); }, i === 0 ? ">" : "<+0.15");
        });
        // Reveal key label, if visible
        if (key.name && key.isNameVisible) {
            tl.blurReveal(label$, {
                ignoreMargin: true,
                duration: 0.75
            }, "<+0.05");
        }
    }
    prepareClockKeyTimelines(key, keyElems$) {
        const { container$, imgContainer$, elem$, label$, clocks } = keyElems$;
        // Initialize element starting properties
        U.gsap.set(container$, { pointerEvents: "auto" });
        U.gsap.set(elem$, { filter: "brightness(1)" });
        U.gsap.set(imgContainer$, { transformOrigin: "50% 10%" });
        // Retrieve element starting properties
        const keyElemScale = U.gsap.getProperty(container$[0], "scale");
        // Timeline: Swinging key timeline
        imgContainer$.data("keySwingTimeline", U.gsap.timeline({ paused: true, repeat: -1, yoyo: true })
            .fromTo(imgContainer$, { rotateZ: -1 }, { rotateZ: 1, duration: 3, ease: "sine.inOut" })
            .addLabel("NEUTRAL", 1.5)
            .seek("NEUTRAL"));
        // Timeline: Hover over clock key
        container$.data("hoverOverTimeline", U.gsap.timeline({
            paused: true,
            data: { key, imgContainer$, label$, isNameRevealed: false },
            onStart() {
                this.data.imgContainer$.data("keySwingTimeline")
                    .tweenTo("NEUTRAL", {
                    duration: 0.25,
                    ease: "back.out(1.5)"
                });
                if (this.data.key.name && !this.data.key.isNameVisible) {
                    this.data.isNameRevealed = true;
                    U.gsap.effects.blurReveal(this.data.label$, {
                        ignoreMargin: true,
                        duration: 0.5
                    });
                }
            },
            onReverseComplete() {
                this.data.imgContainer$.data("keySwingTimeline")
                    .seek("NEUTRAL")
                    .play();
                if (this.data.isNameRevealed) {
                    this.data.isNameRevealed = false;
                    U.gsap.effects.blurRemove(this.data.label$, {
                        ignoreMargin: true,
                        duration: 0.5
                    });
                }
            }
        })
            .to(elem$, { filter: "brightness(1.5)", scale: keyElemScale * 1.25, duration: 0.5, ease: "sine" }));
        // Timelines: Hover over clocks
        key.clocks.forEach((clock) => {
            const { clockContainer$, clockLabel$, clockElem$ } = clocks[clock.id];
            if (!clockContainer$?.length) {
                throw new Error(`[BladesDirector.prepareClockKeyTimelines] Error clockContainer$ not found for clock '${clock.id}' of key '${key.id}'.`);
            }
            U.gsap.set(clockContainer$, { pointerEvents: "auto" });
            clockContainer$.data("hoverOverTimeline", U.gsap.timeline({
                paused: true,
                data: { clock, clockLabel$, isNameRevealed: false },
                onStart() {
                    if (this.data.clock.name && !this.data.clock.isNameVisible) {
                        this.data.isNameRevealed = true;
                        U.gsap.effects.blurReveal(this.data.clockLabel$, {
                            ignoreMargin: true,
                            duration: 0.5
                        });
                    }
                },
                onReverseComplete() {
                    if (this.data.isNameRevealed) {
                        this.data.isNameRevealed = false;
                        U.gsap.effects.blurRemove(this.data.clockLabel$, {
                            ignoreMargin: true,
                            duration: 0.5
                        });
                    }
                }
            })
                .to(clockElem$, { filter: "brightness(1.5)", scale: 1.25, duration: 0.25, ease: "sine" }));
        });
    }
    async activateClockKeyListeners(key, keyElems$) {
        const { container$, clocks } = keyElems$;
        if (game.user.isGM) {
            // === GM-ONLY LISTENERS ===
            // Double-Click a Clock Key = Open ClockKeeper sheet
            container$.on("dblclick", async () => {
                game.eunoblades.ClockKeeper.sheet?.render(true);
            });
            // Right-Click a Clock Key = Pull it
            container$.on("contextmenu", async () => {
                this.pullKey_SocketCall(key.id);
                key.updateTarget("isVisible", false, true);
            });
        }
        else {
            // === PLAYER-ONLY LISTENERS ===
            // Add listeners to container for mouseenter and mouseleave, that play and reverse timeline attached to element
            container$.on("mouseenter", () => {
                container$.data("hoverOverTimeline").play();
            }).on("mouseleave", () => {
                container$.data("hoverOverTimeline").reverse();
            });
            // Now repeat this for each clock in the clock key
            key.clocks.forEach((clock) => {
                const { clockContainer$ } = clocks[clock.id];
                // Add listeners to clock for mouseenter and mouseleave, that play and reverse timeline attached to element
                clockContainer$.on("mouseenter", () => {
                    if (clock.isVisible) {
                        clockContainer$.data("hoverOverTimeline").play();
                    }
                }).on("mouseleave", () => {
                    if (clock.isVisible) {
                        clockContainer$.data("hoverOverTimeline").reverse();
                    }
                });
            });
        }
    }
    async renderClockKey(key) {
        await key.renderTo(this.clockKeySection$);
        const keyElems$ = key.getElements$(this.clockKeySection$);
        const { container$, imgContainer$, elem$, label$, factionLabel$, projectLabel$, scoreLabel$, clocks } = keyElems$;
        // If a position-dragger is present, remove it.
        if (key.positionDragger) {
            key.removePositionDragger();
        }
        // If an overlayPosition has been set, apply to the container element:
        if (key.overlayPosition) {
            U.gsap.set(container$, {
                left: key.overlayPosition.x,
                top: key.overlayPosition.y
            });
        }
        // Get position data for the container$ element (x, y, width, height)
        const keyPosition = {
            x: U.gsap.getProperty(container$[0], "x"),
            y: U.gsap.getProperty(container$[0], "y"),
            width: U.gsap.getProperty(container$[0], "width"),
            height: U.gsap.getProperty(container$[0], "height")
        };
        // Get default position data for this clock key
        const keyDefaultPosition = {
            ...C.ClockKeyPositions[key.size].keyCenter,
            ...C.ClockKeyPositions[key.size].keyDimensions
        };
        eLog.checkLog3("BladesDirector", "Key Positions", { keyPosition, keyDefaultPosition, widthScale: keyPosition.width / keyDefaultPosition.width, heightScale: keyPosition.height / keyDefaultPosition.height });
        // Apply scale factor to elem$ to fit default key position inside container$
        U.gsap.set(elem$, {
            scale: Math.min(keyPosition.width / keyDefaultPosition.width, keyPosition.height / keyDefaultPosition.height)
        });
        // Apply top, left and transformOrigin value to keyImgContainer, accounting for x/yPercent -50
        U.gsap.set(imgContainer$, {
            top: (0.5 * C.ClockKeyPositions.elemSquareSize) - keyDefaultPosition.y,
            left: (0.5 * C.ClockKeyPositions.elemSquareSize) - keyDefaultPosition.x,
            transformOrigin: `${keyDefaultPosition.x}px ${keyDefaultPosition.y}px`
        });
        // Collect relevant label elements, desired aspect ratio, and maximum line count, then apply adjustments to the label container for a pleasing aspect ratio
        [
            [label$, 2, 4],
            key.isFactionKey ? [factionLabel$, 2, 2] : undefined,
            key.isProjectKey ? [projectLabel$, 2, 2] : undefined,
            key.isScoreKey ? [scoreLabel$, 2, 2] : undefined,
            ...key.clocks.map((clock) => [clocks[clock.id].clockLabel$, 2.5, 3])
        ].filter(Boolean).forEach(([labelElem$, aspectRatio, maxLines]) => {
            U.adjustTextContainerAspectRatio(labelElem$, aspectRatio, maxLines);
        });
        // Prepare animation timelines & attach them to rendered elements
        this.prepareClockKeyTimelines(key, keyElems$);
        // Activate listeners for the rendered key
        this.activateClockKeyListeners(key, keyElems$);
        // Animate the key dropping into the overlay
        this.dropKey_Animation(key, keyElems$);
    }
    async renderClockKey_SocketCall(keyID) {
        if (!game.user.isGM) {
            return;
        }
        socketlib.system.executeForEveryone("renderClockKey_SocketCall", keyID);
    }
    static async renderClockKey_SocketResponse(keyID) {
        const key = game.eunoblades.ClockKeys.get(keyID);
        if (!key) {
            return;
        }
        game.eunoblades.Director.renderClockKey(key);
    }
    // #endregion
    // #region   >> Un-Rendering (Pulling) Clock Keys ~
    pullKey_Animation(key) {
        const { container$ } = key.getElements$(game.eunoblades.Director.clockKeySection$);
        U.gsap.timeline()
            .to(container$, {
            y: -800,
            ease: "back.in(1)",
            duration: 0.75
        })
            .to(container$, {
            opacity: 0,
            ease: "power2.out",
            duration: 0.25
        }, 0.75)
            .call(() => { container$.remove(); });
    }
    async pullKey_SocketCall(keyID) {
        if (!game.user.isGM) {
            return;
        }
        socketlib.system.executeForEveryone("pullKey_SocketCall", keyID);
    }
    static pullKey_SocketResponse(keyID) {
        const key = game.eunoblades.ClockKeys.get(keyID);
        if (!key) {
            return;
        }
        game.eunoblades.Director.pullKey_Animation(key);
    }
    // #endregion
    // #endregion
    // #region SCORE PANEL
    // #region   >> INITIALIZATION ~
    initScorePanelSockets() {
        // tbd...
    }
    // #endregion
    // ## Score Details
    // - Small panel overlapping corner of Location
    // - Engagement roll result
    // - Plan & Detail
    // - Target tier
    activateScorePanelListeners() {
        // tbd...
    }
    // #endregion
    // #region LOCATIONS
    // #region   >> INITIALIZATION ~
    initLocationSockets() {
        // tbd...
    }
    // #endregion
    // ## Locations
    // - District wrapper/header
    // - Faction wrapper/footer
    // - Location main
    // - Slide-scroll of sublocations
    activateLocationListeners() {
        // tbd...
    }
    // #endregion
    // #region NPCs
    // #region   >> INITIALIZATION ~
    initNPCSockets() {
        // tbd...
    }
    // #endregion// ## NPCs
    // - Linked to a location: When location is displayed, so are they.  *(Can be linked to District wrapper, main Location, or sublocations)*
    // - Portrait images close to the central location display, hover-over popups provide more detailed information from sheet or `BladesScore` instance
    activateNPCListeners() {
        // tbd...
    }
    // #endregion
    // #region PCs, COHORTs, CREW
    // #region   >> INITIALIZATION ~
    initPCSockets() {
        // tbd...
    }
    initCohortSockets() {
        // tbd...
    }
    initCrewSockets() {
        // tbd...
    }
    // #endregion
    // ## PCs
    // - Display panels along bottom
    // - Signal lights
    activatePCListeners() {
        // tbd...
    }
    // ## Cohorts
    // - Smaller panels alongside the PCs
    activateCohortListeners() {
        // tbd...
    }
    // ## Crew
    // - Limited information displayed, maybe bar beneath PCs showing Heat, Wanted Level…
    activateCrewListeners() {
        // tbd...
    }
    // #endregion
    // #region NOTIFICATIONS
    // #region   >> INITIALIZATION ~
    initNotificationSockets() {
        socketlib.system.register("pushNotice_SocketCall", BladesDirector.pushNotice_SocketResponse.bind(BladesDirector));
    }
    // #endregion
    pushNotice_SocketCall(targets, config) {
        const pushID = randomID();
        if (typeof targets === "string") {
            if (targets === "ALL") {
                return socketlib.system.executeForEveryone("pushNotice_SocketCall", pushID, config);
            }
            else if (targets === "GM") {
                return socketlib.system.executeForAllGMs("pushNotice_SocketCall", pushID, config);
            }
            else {
                targets = game.users.filter((user) => user.id === targets
                    || user.name === targets
                    || user.character?.id === targets
                    || user.character?.name === targets
                    || game.user.isGM).map((user) => user.id);
            }
        }
        if (targets.length > 0) {
            return socketlib.system.executeForUsers("pushNotice_SocketCall", targets, pushID, config);
        }
        return undefined;
    }
    static async pushNotice_SocketResponse(pushID, config) {
        const director = game.eunoblades.Director;
        const pushElem$ = $(await renderTemplate("systems/eunos-blades/templates/overlay/notices/push.hbs", {
            id: pushID,
            ...config
        }))
            .appendTo(director.notificationSection$)
            .on("click", (event) => { director.$removePush(event.currentTarget); })
            .on("contextmenu", (event) => { director.$removeAndClear(event.currentTarget); });
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
    // #region   >> INITIALIZATION ~
    initTransitionSockets() {
        // tbd...
    }
    // #endregion
    // ## Transitions
    async advanceGamePhase(phase) {
        const nextPhase = U.gsap.utils.wrap(Object.values(BladesPhase), Object.values(BladesPhase).indexOf(phase ?? game.eunoblades.Tracker?.phase ?? BladesPhase.Freeplay) + 1);
    }
    // - As with notifications: placeholder animation until something more final can be coded.
    // #endregion
    // #region TOOLTIPS ~
    _tooltipObserver;
    clearTooltips() {
        // Look for tooltip elements in the overlay container, and reverse their timelines.
        game.eunoblades.Director.tooltipSection$.find(".tooltip").each((i, el) => {
            game.eunoblades.Tooltips.get(el)?.reverse();
        });
    }
    initTooltipSection() {
        const self = this;
        // Reset tooltip observer
        this._tooltipObserver?.kill();
        this._tooltipObserver = Observer.create({
            type: "touch,pointer",
            onClick: () => {
                self.clearTooltips();
            },
            onMove: (obs) => {
                if (obs.deltaX >= obs.vars.tolerance
                    || obs.deltaY >= obs.vars.tolerance) {
                    self.clearTooltips();
                }
            },
            tolerance: 100
        });
    }
}
export default BladesDirector;
