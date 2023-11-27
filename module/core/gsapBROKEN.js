import U from "./utilities.js";
import C from "./constants.js";
// eslint-disable-next-line import/no-unresolved
import { TextPlugin } from "/scripts/greensock/esm/all.js";
const gsapPlugins = [
    TextPlugin
];
const gsapEffects = {
    /* Basic Element Effects */
    fadeOut: {
        effect: (targets, config) => {
            const tl = U.gsap.timeline({
                paused: config.paused,
                runBackwards: config.reversed
            })
                .to(targets, {
                autoAlpha: 0,
                duration: config.duration,
                ease: config.ease
            });
            // if (config.reversed) {
            //   tl.seek(config.duration);
            // }
            return tl;
        },
        defaults: {
            paused: false,
            reversed: false,
            duration: 0.5,
            ease: "power4.out"
        }
    },
    blurOut: {
        effect: (targets, config) => {
            const tl = U.gsap.timeline({
                paused: config.paused,
                runBackwards: config.reversed
            })
                .to(targets, {
                skewX: config.skewX,
                duration: 0.5 * config.duration,
                ease: "power4.out"
            })
                .to(targets, {
                x: `+=${config.rangeX}`,
                marginBottom(i, target) {
                    return U.get(target, "height") * -1;
                },
                marginRight(i, target) {
                    return U.get(target, "width") * -1;
                },
                scale: config.scale,
                filter: `blur(${config.blurStrength}px)`,
                duration: 0.75 * config.duration
            }, 0.25 * config.duration)
                .to(targets, {
                autoAlpha: 0,
                duration: 0.5 * config.duration,
                ease: "power3.in"
            }, 0.5 * config.duration);
            // if (config.reversed) {
            //   tl.seek(config.duration);
            // }
            return tl;
        },
        defaults: {
            paused: false,
            reversed: false,
            duration: 0.5,
            skewX: -20,
            rangeX: 300,
            scale: 1.5,
            blurStrength: 10
        }
    },
    slideOut: {
        effect: (targets, config) => {
            const scaleKey = ["up", "down"].includes(config.dir) ? "scaleY" : "scaleX";
            const tl = U.gsap.timeline({
                paused: config.paused,
                runBackwards: config.reversed
            })
                .to(targets, {
                [scaleKey]: 0,
                duration: config.duration,
                ease: config.ease
            });
            // if (config.reversed) {
            //   tl.seek(config.duration);
            // }
            return tl;
        },
        defaults: {
            paused: false,
            reversed: false,
            duration: 0.5,
            ease: "back.out(3)"
        }
    },
    brighten: {
        effect: (targets, config) => {
            const tl = U.gsap.timeline({
                paused: config.paused,
                runBackwards: config.reversed
            })
                .fromTo(targets, {
                filter: `brightness(${config.startStrength})`
            }, {
                filter: `brightness(${config.strength})`,
                duration: config.duration,
                ease: config.ease
            });
            return tl;
        },
        defaults: {
            paused: false,
            reversed: false,
            initialStrength: 1,
            strength: 1.5,
            duration: 0.5,
            ease: "none"
        }
    },
    enlarge: {
        effect: (targets, config) => {
            const tl = U.gsap.timeline({
                paused: config.paused,
                runBackwards: config.reversed
            })
                .fromTo(targets, {
                scale: config.startScale
            }, {
                scale: config.scale,
                duration: config.duration,
                ease: config.ease
            });
            return tl;
        },
        defaults: {
            paused: false,
            reversed: false,
            startScale: 1,
            scale: 1.5,
            duration: 0.5,
            ease: "sine.out"
        }
    },
    changeColor: {
        effect: (targets, config) => {
            const tl = U.gsap.timeline({
                paused: config.paused,
                runBackwards: config.reversed
            })
                .to(targets, {
                color: config.color,
                duration: config.duration,
                ease: config.ease
            });
            return tl;
        },
        defaults: {
            paused: false,
            reversed: false,
            color: C.Colors.bWHITE,
            duration: 0.5,
            ease: "sine"
        }
    },
    skewX: {
        effect: (targets, config) => {
            const tl = U.gsap.timeline({
                paused: config.paused,
                runBackwards: config.reversed
            })
                .to(targets, {
                skewX: config.angle,
                duration: config.duration,
                ease: config.ease
            });
            return tl;
        },
        defaults: {
            paused: false,
            reversed: false,
            angle: -45,
            duration: 0.5,
            ease: "sine"
        }
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
            const tl = U.gsap.timeline({ paused: true, defaults: {} });
            if (!tooltip) {
                return tl;
            }
            // Tooltip = $(tooltip);
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
            return tl;
        },
        defaults: {
            xMotion: "+=200",
            tooltipScale: 1.25
        }
    }
};
/**
 * Registers relevant GSAP plugins and effects.
 */
export function Initialize() {
    if (gsapPlugins.length) {
        U.gsap.registerPlugin(...gsapPlugins);
    }
    Object.entries(gsapEffects).forEach(([name, effect]) => {
        U.gsap.registerEffect(Object.assign(effect, { name, extendTimeline: true }));
    });
}
/**
 * Applies listeners to '.tooltip-trigger' elements in the document.
 * @param {JQuery<HTMLElement>} html The document to be searched.
 */
export function ApplyTooltipAnimations(html) {
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
/**
 * Applies listeners to .consequence-display-container and children found in document.
 * @param {JQuery<HTMLElement>} html The document to be searched.
 */
export function ApplyConsequenceAnimations(html) {
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
     *   --> IF resistTo.type === "None", blurRemove the base_consequence name and type instead of sliding them in,
     *                                       and don't slide the resistance ones out at all.
     * */
    html
        .find(".comp.consequence-display-container")
        .each((_i, csqContainer) => {
        if (!$(csqContainer).hasClass("consequence-accepted")) {
            const csqRoot = U.gsap.utils.selector(csqContainer);
            const csqBgImg = csqRoot(".consequence-bg-image");
            const [iconContainer] = csqRoot(".consequence-icon-container");
            const iconRoot = U.gsap.utils.selector(iconContainer);
            const typeRoot = U.gsap.utils.selector(csqRoot(".consequence-type-container")[0]);
            const nameRoot = U.gsap.utils.selector(csqRoot(".consequence-name-container")[0]);
            const footerRoot = U.gsap.utils.selector(csqRoot(".consequence-footer-container")[0]);
            const csqOptions = ["base", "accept"];
            ["resist", "armor", "special"].forEach((csqOpt) => {
                if (iconRoot(`.${csqOpt}-consequence`).length) {
                    csqOptions.push(csqOpt);
                }
            });
            const interactionPads = {};
            const iconCircles = {};
            const buttonContainers = {};
            const buttonBGs = {};
            const buttonIcons = {};
            const buttonLabels = {};
            const typeLabels = {};
            const typeBGs = {};
            const nameLabels = {};
            const nameBGs = {};
            const footerLabels = {};
            const footerBGs = {};
            ["right", "left", "left-resist", "left-armor", "left-special"].forEach((iPadOpt) => {
                [interactionPads[iPadOpt]] = csqRoot(`.consequence-interaction-pad.interaction-pad-${iPadOpt}`);
            });
            ["base", "accept", "resist", "armor", "special"].forEach((csqOpt) => {
                [iconCircles[csqOpt]] = iconRoot(`.consequence-icon-circle.${csqOpt}-consequence`);
                [buttonContainers[csqOpt]] = iconRoot(`.consequence-button-container.${csqOpt}-consequence`);
                [buttonBGs[csqOpt]] = iconRoot(`.consequence-button-container.${csqOpt}-consequence .consequence-button-bg`);
                [buttonIcons[csqOpt]] = iconRoot(`.consequence-button-container.${csqOpt}-consequence .button-icon i`);
                [buttonLabels[csqOpt]] = iconRoot(`.consequence-button-container.${csqOpt}-consequence .consequence-button-label`);
                [typeLabels[csqOpt]] = typeRoot(`.consequence-type.${csqOpt}-consequence`);
                if (csqOpt === "accept") {
                    [typeBGs[csqOpt]] = typeRoot(`.consequence-type-bg.${csqOpt}-consequence`);
                }
                [nameLabels[csqOpt]] = nameRoot(`.consequence-name.${csqOpt}-consequence`);
                [nameBGs[csqOpt]] = nameRoot(`.consequence-name-bg.${csqOpt}-consequence`);
                [footerLabels[csqOpt]] = footerRoot(`.consequence-footer-message.${csqOpt}-consequence`);
                [footerBGs[csqOpt]] = footerRoot(`.consequence-footer-bg.${csqOpt}-consequence`);
            });
            [
                interactionPads,
                iconCircles,
                buttonContainers, buttonBGs, buttonIcons, buttonLabels,
                typeLabels, typeBGs,
                nameLabels, nameBGs,
                footerLabels, footerBGs
            ]
                .forEach((elemRecord) => U.objCompact(elemRecord, [undefined, null, false], true));
            // Apply master on-enter hover timeline to consequence container.
            $(csqContainer).data("hoverTimelines", [
                U.gsap.effects.fadeOut([typeLabels.base, nameLabels.base], { paused: true, duration: 0.5 }),
                U.gsap.effects.fadeOut([typeLabels.accept, nameLabels.accept], { paused: true, reversed: true, duration: 0.25 }),
                U.gsap.effects.brighten([csqContainer], { paused: true, duration: 0.5 }),
                U.gsap.effects.enlarge([iconCircles.base], { paused: true, duration: 0.75, startScale: 0.75, scale: 0.85 })
            ]);
            $(csqContainer).on({
                mouseenter: function () {
                    $(csqContainer).css("z-index", 10);
                    $(csqContainer).data("hoverTimelines").forEach((tl) => tl.play());
                },
                mouseleave: function () {
                    if (!($(iconContainer).data("isToggled"))) {
                        $(csqContainer).css("z-index", "");
                        $(csqContainer).data("hoverTimelines").forEach((tl) => tl.reverse());
                    }
                }
            });
            // Apply click timeline to icon circle
            $(iconContainer).data("clickTimelines", [
                U.gsap.timeline({ paused: true })
                    .fromTo([csqBgImg], {
                    xPercent: 110,
                    yPercent: -50
                }, {
                    xPercent: -60,
                    yPercent: -50,
                    duration: 0.5,
                    ease: "back"
                }),
                U.gsap.effects.fadeOut([iconCircles.base], { paused: true }),
                U.gsap.effects.fadeOut([iconCircles.accept], { paused: true, reversed: true }),
                U.gsap.effects.blurOut([buttonContainers], { paused: true, reversed: true })
            ]);
            $(iconContainer).on({
                click: function () {
                    if ($(iconContainer).data("isToggled")) {
                        $(iconContainer).data("isToggled", false);
                        $(iconContainer).data("clickTimelines").forEach((tl) => tl.reverse());
                    }
                    else {
                        $(iconContainer).data("isToggled", true);
                        $(iconContainer).data("clickTimelines").forEach((tl) => tl.play());
                        // Find any siblings with toggled-on iconContainers, and toggle them off
                        Array.from($(csqContainer).siblings(".consequence-display-container"))
                            .forEach((containerElem) => {
                            const iContainer$ = $(containerElem).find(".consequence-icon-container");
                            if (iContainer$?.data("isToggled")) {
                                iContainer$.data("isToggled", false);
                                $(containerElem).css("z-index", "");
                                [
                                    ...iContainer$.data("clickTimelines"),
                                    ...$(containerElem).data("hoverTimelines")
                                ].forEach((tl) => tl.reverse());
                            }
                        });
                    }
                }
            });
            // Apply hover timelines to right (accept) interaction pad
            $(interactionPads.right).data("hoverTimelines", [
                U.gsap.effects.changeColor([typeLabels.accept], { paused: true, color: C.Colors.WHITE }),
                U.gsap.effects.slideOut([typeBGs.accept, buttonBGs.accept], { paused: true, reversed: true, dir: "left" }),
                U.gsap.effects.skewX([typeBGs.accept, buttonBGs.accept], { paused: true, angle: -45 }),
                U.gsap.effects.changeColor([buttonIcons.accept, buttonLabels.accept], { paused: true, color: C.Colors.dBLACK }),
                U.gsap.effects.enlarge([buttonIcons.accept], { paused: true, scale: 1.25 })
            ]);
            $(interactionPads.right).on({
                mouseenter: function () {
                    if ($(iconContainer).data("isToggled")) {
                        $(interactionPads.right).data("hoverTimelines").forEach((tl) => tl.play());
                    }
                },
                mouseleave: function () {
                    if ($(iconContainer).data("isToggled")) {
                        $(interactionPads.right).data("hoverTimelines").forEach((tl) => tl.reverse());
                    }
                }
            });
            // Apply hover timeline to left (resist/armor/special) interaction pad
            $(interactionPads.left).data("hoverTimelines", [
                U.gsap.effects.fadeOut([typeLabels.accept, nameLabels.accept, iconCircles.accept, buttonContainers.accept], { paused: true, duration: 0.25 })
            ]);
            $(interactionPads.left).on({
                mouseenter: function () {
                    if ($(iconContainer).data("isToggled")) {
                        $(interactionPads.left).data("hoverTimelines").forEach((tl) => tl.play());
                    }
                },
                mouseleave: function () {
                    if ($(iconContainer).data("isToggled")) {
                        $(interactionPads.left).data("hoverTimelines").forEach((tl) => tl.reverse());
                    }
                }
            });
            // Apply hover timelines to specific left interaction pads where they exist
            ["resist", "armor", "special"].forEach((csqOpt) => {
                if (interactionPads[`left-${csqOpt}`]) {
                    $(interactionPads[`left-${csqOpt}`]).data("hoverTimelines", [
                        U.gsap.effects.fadeOut([iconCircles[csqOpt], typeLabels[csqOpt]], { paused: true, reversed: true }),
                        U.gsap.effects.slideOut([buttonBGs[csqOpt], nameLabels[csqOpt], footerBGs[csqOpt], footerLabels[csqOpt]], { paused: true, reversed: true, dir: "left" }),
                        U.gsap.effects.skewX([buttonBGs[csqOpt], nameLabels[csqOpt], footerBGs[csqOpt], footerLabels[csqOpt]], { paused: true, angle: -45 }),
                        U.gsap.effects.changeColor([buttonIcons[csqOpt], buttonLabels[csqOpt]], { paused: true, color: C.Colors.dBLACK }),
                        U.gsap.effects.enlarge([buttonIcons[csqOpt]], { paused: true, scale: 1.25 })
                    ]);
                    $(interactionPads[`left-${csqOpt}`]).on({
                        mouseenter: function () {
                            if ($(iconContainer).data("isToggled")) {
                                $(interactionPads[`left-${csqOpt}`]).data("hoverTimelines").forEach((tl) => tl.play());
                            }
                        },
                        mouseleave: function () {
                            if ($(iconContainer).data("isToggled")) {
                                $(interactionPads[`left-${csqOpt}`]).data("hoverTimelines").forEach((tl) => tl.reverse());
                            }
                        }
                    });
                }
            });
        }
    });
}
export default U.gsap;
