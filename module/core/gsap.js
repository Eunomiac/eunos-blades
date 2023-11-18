import U from "./utilities.js";
import C from "./constants.js";
// eslint-disable-next-line import/no-unresolved
import { TextPlugin } from "/scripts/greensock/esm/all.js";
/*~ @@DOUBLE-BLANK@@ ~*/
const gsapPlugins = [
    TextPlugin
];
/*~ @@DOUBLE-BLANK@@ ~*/
const gsapEffects = {
    csqEnter: {
        effect: (csqContainer, config) => {
            const csqRoot = U.gsap.utils.selector(csqContainer);
            // ELog.checkLog3("gsap", "gsapEffects.consequenceEnter -> THIS", {this: this, csqRoot});
            const csqIconCircle = csqRoot(".consequence-icon-circle.base-consequence");
            const csqBaseElems = csqRoot(".base-consequence:not(.consequence-icon-circle)");
            const csqAcceptElems = csqRoot(".accept-consequence:not(.consequence-icon-circle):not(.consequence-button-container)");
            /*~ @@DOUBLE-BLANK@@ ~*/
            const tl = U.gsap.timeline({ paused: true, defaults: { overwrite: "auto" } });
            /*~ @@DOUBLE-BLANK@@ ~*/
            // Fade out base-consequence components
            if (csqBaseElems.length > 0) {
                tl.fromTo(csqBaseElems, {
                    opacity: 1
                }, {
                    opacity: 0,
                    duration: config.duration / 3,
                    ease: "none"
                }, 0);
            }
            /*~ @@DOUBLE-BLANK@@ ~*/
            // Fade in accept-consequence components
            if (csqAcceptElems.length > 0) {
                tl.fromTo(csqAcceptElems, {
                    opacity: 0
                }, {
                    opacity: 1,
                    duration: config.duration / 3,
                    ease: "none"
                }, 0);
            }
            /*~ @@DOUBLE-BLANK@@ ~*/
            // Brighten the entire container slightly
            if (csqContainer) {
                tl.fromTo(csqContainer, {
                    filter: "brightness(1)"
                }, {
                    filter: `brightness(${config.brightness})`,
                    duration: config.duration / 3,
                    ease: "none"
                }, 0);
            }
            /*~ @@DOUBLE-BLANK@@ ~*/
            // Enlarge the icon circle, add stroke
            if (csqIconCircle.length > 0) {
                tl.fromTo(csqIconCircle, {
                    // xPercent: -50,
                    // yPercent: -50,
                    scale: 0.75,
                    outlineColor: C.Colors.dBLACK,
                    outlineWidth: 0
                }, {
                    // xPercent: -50,
                    // yPercent: -50,
                    scale: 0.85,
                    outlineColor: C.Colors.GREY,
                    outlineWidth: 1,
                    duration: 0.55,
                    ease: "sine.out"
                }, 0);
            }
            /*~ @@DOUBLE-BLANK@@ ~*/
            return tl;
        },
        defaults: {
            brightness: 1.5,
            duration: 0.5,
            scale: 1.5,
            stagger: 0.05,
            ease: "sine",
            easeStrength: 1.5
        }
    },
    csqClickIcon: {
        effect: (csqIconContainer, config) => {
            const csqRoot = U.gsap.utils.selector(csqIconContainer);
            const csqBackgroundImg = U.gsap.utils.selector($(csqIconContainer).parent())(".consequence-bg-image");
            const csqInteractionPads = csqRoot(".consequence-interaction-pad");
            const csqIconCircleBase = csqRoot(".consequence-icon-circle.base-consequence");
            const csqIconCircleAccept = csqRoot(".consequence-icon-circle.accept-consequence");
            const csqButtonContainers = csqRoot(".consequence-button-container");
            /*~ @@DOUBLE-BLANK@@ ~*/
            const tl = U.gsap.timeline({ paused: true, defaults: { overwrite: "auto" } });
            /*~ @@DOUBLE-BLANK@@ ~*/
            // Initialize interaction pads to display: none
            if (csqInteractionPads.length) {
                tl.set(csqInteractionPads, { display: "none" });
            }
            /*~ @@DOUBLE-BLANK@@ ~*/
            // Slide out the background
            if (csqBackgroundImg.length) {
                tl.fromTo(csqBackgroundImg, {
                    xPercent: -100,
                    yPercent: -50
                }, {
                    xPercent: -60,
                    yPercent: -50,
                    duration: 0.5,
                    ease: "back"
                }, 0);
            }
            /*~ @@DOUBLE-BLANK@@ ~*/
            // Fade out the base consequence icon circle
            if (csqIconCircleBase.length > 0) {
                tl.fromTo(csqIconCircleBase, {
                    opacity: 1
                }, {
                    opacity: 0,
                    duration: 0.25,
                    ease: "none"
                }, 0);
            }
            /*~ @@DOUBLE-BLANK@@ ~*/
            // Fade in the accept consequence icon circle, enlarging the stroke
            if (csqIconCircleAccept.length > 0) {
                tl.fromTo(csqIconCircleAccept, {
                    opacity: 0,
                    // xPercent: -50,
                    // yPercent: -50,
                    scale: 0.85
                }, {
                    opacity: 1,
                    // xPercent: -50,
                    // yPercent: -50,
                    duration: 0.15,
                    ease: "sine"
                }, 0);
            }
            /*~ @@DOUBLE-BLANK@@ ~*/
            if (csqIconCircleAccept.length > 0) {
                tl.fromTo(csqIconCircleAccept, {
                    outlineWidth: 1,
                    // xPercent: -50,
                    // yPercent: -50,
                    scale: 0.85
                }, {
                    scale: 1,
                    // xPercent: -50,
                    // yPercent: -50,
                    outlineWidth: 2,
                    duration: 0.25,
                    ease: "sine"
                }, 0.175);
            }
            /*~ @@DOUBLE-BLANK@@ ~*/
            // Scale and fade in the button containers
            if (csqButtonContainers.length > 0) {
                tl.fromTo(csqButtonContainers, {
                    scale: config.scale,
                    opacity: 0,
                    filter: "blur(25px)"
                }, {
                    scale: 1,
                    opacity: 1,
                    filter: "blur(0px)",
                    stagger: config.stagger,
                    duration: config.duration,
                    ease: `${config.ease}.inOut(${config.easeStrength})`
                }, 0);
            }
            /*~ @@DOUBLE-BLANK@@ ~*/
            // Finally, toggle on interaction pads
            if (csqInteractionPads.length) {
                tl.set(csqInteractionPads, { display: "block" });
            }
            /*~ @@DOUBLE-BLANK@@ ~*/
            return tl;
        },
        defaults: {
            duration: 0.5,
            scale: 1.5,
            stagger: 0.05,
            ease: "sine",
            easeStrength: 1.5
        }
    },
    csqEnterAccept: {
        effect: (csqContainer) => {
            const csqRoot = U.gsap.utils.selector(csqContainer);
            const typeLine = csqRoot(".consequence-type-container .consequence-type.accept-consequence");
            const typeLineBg = csqRoot(".consequence-type-container .consequence-type-bg.accept-consequence");
            const buttonRoot = U.gsap.utils.selector(csqRoot(".consequence-button-container.consequence-accept-button-container"));
            /*~ @@DOUBLE-BLANK@@ ~*/
            const buttonBg = buttonRoot(".consequence-button-bg");
            const buttonIcon = buttonRoot(".button-icon i");
            const buttonLabel = buttonRoot(".consequence-button-label");
            /*~ @@DOUBLE-BLANK@@ ~*/
            const tl = U.gsap.timeline({ paused: true, defaults: { overwrite: "auto" } });
            /*~ @@DOUBLE-BLANK@@ ~*/
            // Turn type line white
            if (typeLine.length > 0) {
                tl.fromTo(typeLine, {
                    color: C.Colors.RED
                }, {
                    color: C.Colors.WHITE,
                    duration: 0.5,
                    ease: "sine.inOut"
                }, 0);
            }
            /*~ @@DOUBLE-BLANK@@ ~*/
            // Slide type line background out from under icon
            if (typeLineBg.length > 0) {
                tl.fromTo(typeLineBg, {
                    x: 5,
                    scaleX: 0,
                    color: C.Colors.RED,
                    skewX: 0
                }, {
                    scaleX: 1,
                    skewX: -45,
                    color: C.Colors.RED,
                    duration: 0.5,
                    ease: "back.out"
                }, 0);
            }
            /*~ @@DOUBLE-BLANK@@ ~*/
            // Slide accept button background out from under icon
            if (buttonBg.length > 0) {
                tl.fromTo(buttonBg, {
                    scaleX: 0,
                    color: C.Colors.RED,
                    skewX: 0
                }, {
                    x: 0,
                    scaleX: 1,
                    skewX: -45,
                    color: C.Colors.RED,
                    duration: 0.25,
                    ease: "back.out"
                }, 0);
            }
            /*~ @@DOUBLE-BLANK@@ ~*/
            // Turn button icon black and scale
            if (buttonIcon.length > 0) {
                tl.fromTo(buttonIcon, {
                    color: C.Colors.GREY,
                    opacity: 0.75,
                    scale: 1
                }, {
                    color: C.Colors.dBLACK,
                    scale: 1.25,
                    opacity: 1,
                    duration: 0.5,
                    ease: "sine"
                }, 0);
            }
            /*~ @@DOUBLE-BLANK@@ ~*/
            // Turn button label black, add letter-spacing, bold
            if (buttonLabel.length > 0) {
                tl.fromTo(buttonLabel, {
                    color: C.Colors.GREY,
                    fontWeight: 400,
                    scale: 1
                }, {
                    color: C.Colors.dBLACK,
                    fontWeight: 800,
                    duration: 0.75,
                    ease: "sine"
                }, 0);
            }
            /*~ @@DOUBLE-BLANK@@ ~*/
            return tl;
        },
        defaults: {}
    },
    csqEnterResist: {
        effect: (csqContainer) => {
            const csqRoot = U.gsap.utils.selector(csqContainer);
            /*~ @@DOUBLE-BLANK@@ ~*/
            const typeLine = csqRoot(".consequence-type-container .consequence-type.resist-consequence");
            /*~ @@DOUBLE-BLANK@@ ~*/
            const acceptElems = csqRoot(".accept-consequence");
            const specialArmorElems = csqRoot(".special-armor-consequence");
            /*~ @@DOUBLE-BLANK@@ ~*/
            const footerBg = csqRoot(".consequence-footer-container .consequence-footer-bg.resist-consequence");
            const attrElem = csqRoot(".consequence-footer-container .consequence-resist-attribute");
            const resistCsqName = csqRoot(".consequence-name.resist-consequence");
            const iconCircle = csqRoot(".consequence-icon-circle.resist-consequence");
            /*~ @@DOUBLE-BLANK@@ ~*/
            const buttonRoot = U.gsap.utils.selector(csqRoot(".consequence-button-container.consequence-resist-button-container"));
            /*~ @@DOUBLE-BLANK@@ ~*/
            const buttonBg = buttonRoot(".consequence-button-bg");
            const buttonIcon = buttonRoot(".button-icon i");
            const buttonLabel = buttonRoot(".consequence-button-label");
            /*~ @@DOUBLE-BLANK@@ ~*/
            const tl = U.gsap.timeline({ paused: true, defaults: { overwrite: "auto" } });
            /*~ @@DOUBLE-BLANK@@ ~*/
            // Fade out all accept elems and special armor elems
            if ([...acceptElems, ...specialArmorElems].length > 0) {
                tl.to([...acceptElems, ...specialArmorElems], {
                    opacity: 0,
                    duration: 0.25,
                    ease: "sine.out"
                });
            }
            /*~ @@DOUBLE-BLANK@@ ~*/
            // Slide out .consequence-type.resist-consequence from left
            if (typeLine.length > 0) {
                tl.fromTo(typeLine, {
                    x: -15,
                    scaleX: 0,
                    opacity: 1,
                    color: C.Colors.dGOLD
                }, {
                    x: 0,
                    scaleX: 1,
                    opacity: 1,
                    color: C.Colors.dGOLD,
                    duration: 0.5,
                    ease: "back.out"
                }, 0);
            }
            /*~ @@DOUBLE-BLANK@@ ~*/
            // Slide out .consequence-resist-button-bg from right
            if (buttonBg.length > 0) {
                tl.fromTo(buttonBg, {
                    scaleX: 0,
                    skewX: 0,
                    opacity: 1
                }, {
                    scaleX: 1,
                    skewX: -45,
                    opacity: 1,
                    duration: 0.5,
                    ease: "back.inOut"
                }, 0);
            }
            /*~ @@DOUBLE-BLANK@@ ~*/
            // Slide out .consequence-footer-bg.resist-consequence from left
            if (footerBg.length > 0) {
                tl.fromTo(footerBg, {
                    scaleX: 0,
                    skewX: 0,
                    opacity: 1
                }, {
                    scaleX: 1,
                    skewX: -45,
                    opacity: 1,
                    duration: 0.5,
                    ease: "back.inOut"
                }, 0);
            }
            /*~ @@DOUBLE-BLANK@@ ~*/
            // Slide out .consequence-resist-attribute from left
            if (attrElem.length > 0) {
                tl.fromTo(attrElem, {
                    scaleX: 0,
                    opacity: 1
                }, {
                    scaleX: 1,
                    opacity: 1,
                    duration: 0.5,
                    ease: "back.inOut"
                }, 0);
            }
            /*~ @@DOUBLE-BLANK@@ ~*/
            // Slide out .consequence-name.resist-consequence from left
            if (resistCsqName.length > 0) {
                tl.fromTo(resistCsqName, {
                    scaleX: 0,
                    opacity: 1
                }, {
                    scaleX: 1,
                    opacity: 1,
                    duration: 0.5,
                    ease: "back.inOut"
                }, 0);
            }
            /*~ @@DOUBLE-BLANK@@ ~*/
            // Fade in .consequence-icon-circle.resist-consequence
            if (iconCircle.length > 0) {
                tl.fromTo(iconCircle, {
                    opacity: 0
                }, {
                    opacity: 1,
                    duration: 0.5,
                    ease: "back.out"
                }, 0);
            }
            /*~ @@DOUBLE-BLANK@@ ~*/
            // Turn button icon black and scale
            if (buttonIcon.length > 0) {
                tl.fromTo(buttonIcon, {
                    color: C.Colors.GREY,
                    opacity: 0.75,
                    scale: 1
                }, {
                    color: C.Colors.dBLACK,
                    scale: 1.25,
                    opacity: 1,
                    duration: 0.5,
                    ease: "sine"
                }, 0);
            }
            /*~ @@DOUBLE-BLANK@@ ~*/
            // Turn button label black, bold
            if (buttonLabel.length > 0) {
                tl.fromTo(buttonLabel, {
                    color: C.Colors.GREY,
                    fontWeight: 400,
                    scale: 1
                }, {
                    color: C.Colors.dBLACK,
                    fontWeight: 800,
                    duration: 0.75,
                    ease: "sine"
                }, 0);
            }
            /*~ @@DOUBLE-BLANK@@ ~*/
            return tl;
        },
        defaults: {}
    },
    csqEnterSpecialArmor: {
        effect: (csqContainer) => {
            const csqRoot = U.gsap.utils.selector(csqContainer);
            /*~ @@DOUBLE-BLANK@@ ~*/
            const typeLine = csqRoot(".consequence-type-container .consequence-type.special-armor-consequence");
            /*~ @@DOUBLE-BLANK@@ ~*/
            const acceptElems = csqRoot(".accept-consequence");
            const resistElems = csqRoot(".resist-consequence");
            /*~ @@DOUBLE-BLANK@@ ~*/
            const footerBg = csqRoot(".consequence-footer-container .consequence-footer-bg.special-armor-consequence");
            const footerMsg = csqRoot(".consequence-footer-container .consequence-special-armor-message");
            const specialArmorCsqName = csqRoot(".consequence-name.special-armor-consequence");
            const iconCircle = csqRoot(".consequence-icon-circle.special-armor-consequence");
            /*~ @@DOUBLE-BLANK@@ ~*/
            const tl = U.gsap.timeline({ paused: true, defaults: { overwrite: "auto" } });
            /*~ @@DOUBLE-BLANK@@ ~*/
            // Fade out all accept elems and resist elems
            if ([...acceptElems, ...resistElems].length > 0) {
                tl.to([...acceptElems, ...resistElems], {
                    opacity: 0,
                    duration: 0.25,
                    ease: "sine.out"
                });
            }
            /*~ @@DOUBLE-BLANK@@ ~*/
            // Slide out .consequence-type.special-armor-consequence from left
            if (typeLine.length > 0) {
                tl.fromTo(typeLine, {
                    x: -15,
                    scaleX: 0,
                    opacity: 1,
                    color: C.Colors.dBLUE
                }, {
                    x: 0,
                    scaleX: 1,
                    opacity: 1,
                    color: C.Colors.dBLUE,
                    duration: 0.5,
                    ease: "back.out"
                }, 0);
            }
            /*~ @@DOUBLE-BLANK@@ ~*/
            // Slide out .consequence-footer-bg.special-armor-consequence from left
            if (footerBg.length > 0) {
                tl.fromTo(footerBg, {
                    scaleX: 0,
                    skewX: 0,
                    opacity: 1
                }, {
                    scaleX: 1,
                    skewX: -45,
                    opacity: 1,
                    duration: 0.5,
                    ease: "back.inOut"
                }, 0);
            }
            /*~ @@DOUBLE-BLANK@@ ~*/
            // Slide out .consequence-special-armor-message from left
            if (footerMsg.length > 0) {
                tl.fromTo(footerMsg, {
                    scaleX: 0,
                    opacity: 1
                }, {
                    scaleX: 1,
                    opacity: 1,
                    duration: 0.5,
                    ease: "back.inOut"
                }, 0);
            }
            /*~ @@DOUBLE-BLANK@@ ~*/
            // Slide out .consequence-name.special-armor-consequence from left
            if (specialArmorCsqName.length > 0) {
                tl.fromTo(specialArmorCsqName, {
                    scaleX: 0,
                    opacity: 1
                }, {
                    scaleX: 1,
                    opacity: 1,
                    duration: 0.5,
                    ease: "back.inOut"
                }, 0);
            }
            /*~ @@DOUBLE-BLANK@@ ~*/
            // Fade in .consequence-icon-circle.special-armor-consequence
            if (iconCircle.length > 0) {
                tl.fromTo(iconCircle, {
                    opacity: 0
                }, {
                    opacity: 1,
                    duration: 0.5,
                    ease: "back.out"
                }, 0);
            }
            /*~ @@DOUBLE-BLANK@@ ~*/
            if (csqRoot(".consequence-button-container.consequence-special-armor-button-container").length > 0) {
                const buttonRoot = U.gsap.utils.selector(csqRoot(".consequence-button-container.consequence-special-armor-button-container"));
                const [buttonBg, buttonIcon, buttonLabel] = [
                    buttonRoot(".consequence-button-bg"),
                    buttonRoot(".button-icon i"),
                    buttonRoot(".consequence-button-label")
                ];
                /*~ @@DOUBLE-BLANK@@ ~*/
                // Slide out .consequence-special-armor-button-bg from right
                if (buttonBg.length > 0) {
                    tl.fromTo(buttonBg, {
                        scaleX: 0,
                        skewX: 0,
                        opacity: 1
                    }, {
                        scaleX: 1,
                        skewX: -45,
                        opacity: 1,
                        duration: 0.5,
                        ease: "back.inOut"
                    }, 0);
                }
                /*~ @@DOUBLE-BLANK@@ ~*/
                // Turn button icon black and scale
                if (buttonIcon.length > 0) {
                    tl.fromTo(buttonIcon, {
                        color: C.Colors.GREY,
                        opacity: 0.75,
                        scale: 1
                    }, {
                        color: C.Colors.dBLACK,
                        scale: 1.25,
                        opacity: 1,
                        duration: 0.5,
                        ease: "sine"
                    }, 0);
                }
                /*~ @@DOUBLE-BLANK@@ ~*/
                // Turn button label black, bold
                if (buttonLabel.length > 0) {
                    tl.fromTo(buttonLabel, {
                        color: C.Colors.GREY,
                        fontWeight: 400,
                        scale: 1
                    }, {
                        color: C.Colors.dBLACK,
                        fontWeight: 800,
                        duration: 0.75,
                        ease: "sine"
                    }, 0);
                }
            }
            /*~ @@DOUBLE-BLANK@@ ~*/
            return tl;
        },
        defaults: {}
    },
    blurRemove: {
        effect: (targets, config) => U.gsap.timeline()
            .to(targets, {
            skewX: config.skewX,
            duration: config.duration / 2,
            ease: "power4.out"
        })
            .to(targets, {
            x: config.x,
            marginBottom(i, target) {
                return U.get(target, "height") * -1;
            },
            marginRight(i, target) {
                return U.get(target, "width") * -1;
            },
            scale: config.scale,
            filter: config.filter,
            duration: (3 / 4) * config.duration
        }, config.duration / 4)
            .to(targets, {
            opacity: 0,
            duration: config.duration / 2,
            ease: "power3.in"
        }, config.duration / 2),
        defaults: {
            skewX: -20,
            duration: 0.5,
            x: "+=300",
            scale: 1.5,
            filter: "blur(10px)"
        }
    },
    slideUp: {
        effect: (targets) => U.gsap.to(targets, {
            height: 0,
            // PaddingTop: 0,
            // paddingBottom: 0,
            duration: 0.5,
            ease: "power3"
        }),
        defaults: {}
    },
    pulse: {
        effect: (targets, config) => U.gsap.to(targets, {
            repeat: config.repCount,
            yoyo: true,
            duration: config.duration / config.repCount,
            ease: config.ease,
            opacity: 0.25
        }),
        defaults: {
            repCount: 3,
            duration: 5,
            ease: "sine.inOut"
        }
    },
    throb: {
        effect: (targets, config) => U.gsap.to(targets, {
            repeat: config.stagger ? undefined : 1,
            yoyo: config.stagger ? undefined : true,
            duration: config.duration / 2,
            scale: config.scale,
            filter: config.filter,
            ease: config.ease,
            stagger: config.stagger
                ? {
                    ...config.stagger,
                    repeat: 1,
                    yoyo: true
                }
                : {}
        }),
        defaults: {
            duration: 1,
            scale: 1,
            filter: "saturate(1) brightness(2)",
            ease: "power2.in"
        },
        extendTimeline: true
    },
    pulseClockWedges: {
        effect: () => U.gsap.timeline({ duration: 0 }),
        defaults: {}
    },
    reversePulseClockWedges: {
        effect: () => U.gsap.timeline({ duration: 0 }),
        defaults: {}
    },
    fillCoins: {
        effect: (targets, config) => {
            // Targets will be all coins from zero to where fill currently is
            // Some will already be full, others not.
            // Stagger in timeline
            // Pulse in size and color
            // Shimmer as they shrink back ?
            /*~ @@DOUBLE-BLANK@@ ~*/
            return U.gsap.effects.throb(targets, { stagger: {
                    amount: 0.25,
                    from: "start",
                    repeat: 1,
                    yoyo: true
                }, ...config ?? {} });
        },
        defaults: {}
    },
    hoverTooltip: {
        effect: (tooltip, config) => {
            const tl = U.gsap.timeline({ paused: true, defaults: { overwrite: "auto" } });
            if (!tooltip) {
                return tl;
            }
            // Tooltip = $(tooltip);
            /*~ @@DOUBLE-BLANK@@ ~*/
            if (config.scalingElems.length > 0) {
                tl.to(config.scalingElems, {
                    scale: "+=0.2",
                    filter: "none",
                    color: C.Colors.WHITE,
                    opacity: 1,
                    duration: 0.125,
                    ease: "back"
                }, 0.5);
            }
            /*~ @@DOUBLE-BLANK@@ ~*/
            if (tooltip) {
                tl.fromTo(tooltip, {
                    filter: "blur(50px)",
                    opacity: 0,
                    scale: 2 * config.tooltipScale
                }, {
                    filter: "none",
                    opacity: 1,
                    scale: config.tooltipScale,
                    x: config.xMotion,
                    duration: 0.25,
                    ease: "power2"
                }, 1);
            }
            /*~ @@DOUBLE-BLANK@@ ~*/
            return tl;
        },
        defaults: {
            xMotion: "+=200",
            tooltipScale: 1.25
        }
    }
};
/*~ @@DOUBLE-BLANK@@ ~*/
/**
 * Registers relevant GSAP plugins and effects.
 */
export function Initialize() {
    if (gsapPlugins.length) {
        U.gsap.registerPlugin(...gsapPlugins);
    }
    Object.entries(gsapEffects).forEach(([name, effect]) => {
        U.gsap.registerEffect(Object.assign(effect, { name }));
    });
}
/*~ @@DOUBLE-BLANK@@ ~*/
/**
 * Applies listeners to '.tooltip-trigger' elements in the document.
 * @param {JQuery<HTMLElement>} html The document to be searched.
 */
export function ApplyTooltipListeners(html) {
    html.find(".tooltip-trigger").each((_, el) => {
        const tooltipElem = $(el).find(".tooltip")[0] ?? $(el).next(".tooltip")[0];
        if (!tooltipElem) {
            return;
        }
        $(el).data("hoverTimeline", U.gsap.effects.hoverTooltip(tooltipElem, {
            scalingElems: [...$(el).find(".tooltip-scaling-elem")].filter((elem) => Boolean(elem)),
            xMotion: $(tooltipElem).hasClass("tooltip-left") ? "-=250" : "+=200",
            tooltipScale: $(tooltipElem).hasClass("tooltip-small") ? 1 : 1.2
        }));
        $(el).on({
            mouseenter: function () {
                $(el).css("z-index", 10);
                $(el).data("hoverTimeline").play();
            },
            mouseleave: function () {
                $(el).data("hoverTimeline").reverse().then(() => {
                    $(el).css("z-index", "");
                });
            }
        });
    });
}
/*~ @@DOUBLE-BLANK@@ ~*/
/**
 * Applies listeners to .consequence-display-container and children found in document.
 * @param {JQuery<HTMLElement>} html The document to be searched.
 */
export function ApplyConsequenceListeners(html) {
    /**
     * TIMELINES
     * .comp.consequence-display-container:mouseenter
     *   = fade in grey interaction buttons
     *   ...:mouseleave = reverse
     *
     * .consequence-accept-button-container:mouseenter
     *   = turn type line white, text shadow
     *     slide out .consequence-accept-button-bg from left
     *     turn .consequence-accept-button i black, and scale
     *     turn .consequence-accept-button-label black, add letter spacing, bold
     *   ...:mouseleave = reverse
     *
     * .consequence-resist-button-container:mouseenter
     *   = slide in .consequence-type-bg.base-consequence to left
     *     fade out all .base-consequence:not(.consequence-type-bg)
     *     slide out .consequence-type.resist-consequence from left
     *     slide out .consequence-resist-button-bg from right
     *     slide out .consequence-footer-bg.resist-consequence from left
     *     slide out .consequence-resist-attribute from left
     *     slide out .consequence-name.resist-consequence from left
     *     fade in .consequence-icon-circle.resist-consequence
     *   ...:mouseleave = reverse
     *   --> IF resistedTo.type === "None", blurRemove the base_consequence name and type instead of sliding them in,
     *                                       and don't slide the resistance ones out at all.
     * */
    /*~ @@DOUBLE-BLANK@@ ~*/
    html
        .find(".comp.consequence-display-container")
        .each((_i, csqContainer) => {
        /*~ @@DOUBLE-BLANK@@ ~*/
        const iconContainer$ = $(csqContainer).find(".consequence-icon-container");
        /*~ @@DOUBLE-BLANK@@ ~*/
        const acceptInteractionPad$ = $(csqContainer).find(".accept-consequence-pad");
        const resistInteractionPad$ = $(csqContainer).find(".resist-consequence-pad");
        const specialArmorInteractionPad$ = $(csqContainer).find(".special-armor-consequence-pad");
        /*~ @@DOUBLE-BLANK@@ ~*/
        $(csqContainer).data("hoverTimeline", U.gsap.effects.csqEnter(csqContainer));
        $(csqContainer).on({
            mouseenter: function () {
                $(csqContainer).css("z-index", 10);
                $(csqContainer).data("hoverTimeline").play();
            },
            mouseleave: function () {
                if (!(iconContainer$.data("isToggled") || iconContainer$.data("isTogglingOn")) || iconContainer$.data("isTogglingOff")) {
                    $(csqContainer).data("hoverTimeline").reverse().then(() => {
                        $(csqContainer).css("z-index", "");
                    });
                }
            }
        });
        /*~ @@DOUBLE-BLANK@@ ~*/
        iconContainer$.data("clickTimeline", U.gsap.effects.csqClickIcon(iconContainer$[0]));
        iconContainer$.on({
            click: function () {
                if (iconContainer$.data("isToggled") || iconContainer$.data("isTogglingOn")) {
                    iconContainer$.data("isTogglingOn", false);
                    iconContainer$.data("isTogglingOff", true);
                    iconContainer$.data("clickTimeline").reverse().then(() => {
                        iconContainer$.data("isTogglingOff", false);
                        iconContainer$.data("isToggled", false);
                    });
                }
                else {
                    iconContainer$.data("isTogglingOn", true);
                    iconContainer$.data("isTogglingOff", false);
                    /*~ @@DOUBLE-BLANK@@ ~*/
                    // Find any siblings with toggled-on iconContainers, and toggle them off
                    Array.from($(csqContainer).siblings(".consequence-display-container"))
                        .forEach((containerElem) => {
                        const iContainer$ = $(containerElem).find(".consequence-icon-container");
                        if (iContainer$?.data("isToggled") || iContainer$?.data("isTogglingOn")) {
                            iContainer$.data("isTogglingOn", false);
                            iContainer$.data("isTogglingOff", true);
                            iContainer$.data("clickTimeline").reverse().then(() => {
                                iContainer$.data("isTogglingOff", false);
                                iContainer$.data("isToggled", false);
                                $(containerElem).data("hoverTimeline").reverse().then(() => {
                                    $(containerElem).css("z-index", "");
                                });
                            });
                        }
                    });
                    iconContainer$.data("clickTimeline").play().then(() => {
                        iconContainer$.data("isTogglingOn", false);
                        iconContainer$.data("isToggled", true);
                    });
                }
            }
        });
        /*~ @@DOUBLE-BLANK@@ ~*/
        acceptInteractionPad$.data("hoverTimeline", U.gsap.effects.csqEnterAccept(csqContainer));
        acceptInteractionPad$.on({
            mouseenter: function () {
                if (iconContainer$.data("isToggled")) {
                    acceptInteractionPad$.data("hoverTimeline").play();
                }
            },
            mouseleave: function () {
                acceptInteractionPad$.data("hoverTimeline").reverse();
            }
        });
        /*~ @@DOUBLE-BLANK@@ ~*/
        resistInteractionPad$.data("hoverTimeline", U.gsap.effects.csqEnterResist(csqContainer));
        resistInteractionPad$.on({
            mouseenter: function () {
                if (iconContainer$.data("isToggled")) {
                    resistInteractionPad$.data("hoverTimeline").play();
                }
            },
            mouseleave: function () {
                if (iconContainer$.data("isToggled")) {
                    resistInteractionPad$.data("hoverTimeline").reverse();
                }
            }
        });
        /*~ @@DOUBLE-BLANK@@ ~*/
        specialArmorInteractionPad$.data("hoverTimeline", U.gsap.effects.csqEnterSpecialArmor(csqContainer));
        specialArmorInteractionPad$.on({
            mouseenter: function () {
                if (iconContainer$.data("isToggled")) {
                    specialArmorInteractionPad$.data("hoverTimeline").play();
                }
            },
            mouseleave: function () {
                if (iconContainer$.data("isToggled")) {
                    specialArmorInteractionPad$.data("hoverTimeline").reverse();
                }
            }
        });
        /*~ @@DOUBLE-BLANK@@ ~*/
    });
    /*~ @@DOUBLE-BLANK@@ ~*/
}
/*~ @@DOUBLE-BLANK@@ ~*/
export default U.gsap;
/*~ @@DOUBLE-BLANK@@ ~*/ 
