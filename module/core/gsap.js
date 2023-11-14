/* ****▌███████████████████████████████████████████████████████████████████████████▐**** *\
|*     ▌█░░░░░░░░░ Euno's Blades in the Dark for Foundry VTT ░░░░░░░░░░░█▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░ by Eunomiac ░░░░░░░░░░░░░██████████████████▐     *|
|*     ▌█  License █ v0.1.0 ██▐     *|
|*     ▌████░░░░  ░░░░█████▐     *|
\* ****▌███████████████████████████████████████████████████████████████████████████▐**** */

import U from "./utilities.js";
import { TextPlugin } from "/scripts/greensock/esm/all.js";
const gsapPlugins = [
    TextPlugin
];
const gsapEffects = {
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
        effect: (targets, config) => U.gsap.timeline({ duration: 0 }),
        defaults: {}
    },
    reversePulseClockWedges: {
        effect: (targets, config) => U.gsap.timeline({ duration: 0 }),
        defaults: {}
    },
    fillCoins: {
        effect: (targets, config) => {
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
            const tl = U.gsap.timeline({ paused: true });
            if (!tooltip) {
                return tl;
            }
            if (config.scalingElems.length > 0) {
                tl.to(config.scalingElems, {
                    scale: "+=0.2",
                    filter: "none",
                    color: "rgba(255, 255, 255, 1)",
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
export function Initialize() {
    if (gsapPlugins.length) {
        U.gsap.registerPlugin(...gsapPlugins);
    }
    Object.entries(gsapEffects).forEach(([name, effect]) => {
        U.gsap.registerEffect(Object.assign(effect, { name }));
    });
}
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
export function ApplyConsequenceListeners(html) {
    html
        .find(".comp.consequence-display-container")
        .each((_i, csqContainer) => {
        const resistButton = $(csqContainer).find(".consequence-resist-button-container")[0];
        const acceptButton = $(csqContainer).find(".consequence-accept-button-container")[0];
        const specialArmorButton = $(csqContainer).find(".consequence-special-armor-button-container")[0];
        const baseElems = Array.from($(csqContainer).find(".base-consequence"));
        const resistElems = Array.from($(csqContainer).find(".resist-consequence"));
        const specialArmorElems = Array.from($(csqContainer).find(".special-armor-consequence"));
        if (resistButton) {
            $(resistButton)
                .on({
                mouseenter: function () {
                    $(resistButton).css("z-index", 10);
                    U.gsap.to(resistButton, {
                        scale: 1.25,
                        filter: "brightness(1.25)",
                        duration: 0.25,
                        ease: "sine.out"
                    });
                    U.gsap.to(acceptButton, {
                        scale: 0.8,
                        filter: "greyscale(1)",
                        duration: 0.5,
                        ease: "sine.inOut"
                    });
                    U.gsap.to(specialArmorButton, {
                        scale: 0.8,
                        filter: "greyscale(1)",
                        duration: 0.5,
                        ease: "sine.inOut"
                    });
                    U.gsap.to(baseElems, {
                        opacity: 0,
                        duration: 0.5,
                        ease: "sine.out"
                    });
                    U.gsap.to(resistElems, {
                        opacity: 1,
                        duration: 0.5,
                        ease: "sine.out"
                    });
                },
                mouseleave: function () {
                    U.gsap.to(resistButton, {
                        scale: 1,
                        filter: "brightness(1)",
                        duration: 0.25,
                        ease: "sine.out"
                    }).then(() => {
                        $(resistButton).css("z-index", "");
                    });
                    U.gsap.to(acceptButton, {
                        scale: 1,
                        filter: "",
                        duration: 0.5,
                        ease: "sine.inOut"
                    });
                    U.gsap.to(specialArmorButton, {
                        scale: 1,
                        filter: "",
                        duration: 0.5,
                        ease: "sine.inOut"
                    });
                    U.gsap.to(baseElems, {
                        opacity: 1,
                        duration: 0.5,
                        ease: "sine.out"
                    });
                    U.gsap.to(resistElems, {
                        opacity: 0,
                        duration: 0.5,
                        ease: "sine.out"
                    });
                }
            });
        }
        if (acceptButton) {
            $(acceptButton)
                .on({
                mouseenter: function () {
                    $(acceptButton).css("z-index", 10);
                    U.gsap.to(acceptButton, {
                        scale: 1.25,
                        filter: "brightness(1.25)",
                        duration: 0.25,
                        ease: "sine.out"
                    });
                    U.gsap.to(baseElems, {
                        filter: "brightness(1.25)",
                        duration: 0.5,
                        ease: "sine.out"
                    });
                },
                mouseleave: function () {
                    U.gsap.to(acceptButton, {
                        scale: 1,
                        filter: "brightness(1)",
                        duration: 0.25,
                        ease: "sine.out"
                    }).then(() => {
                        $(acceptButton).css("z-index", "");
                    });
                    U.gsap.to(baseElems, {
                        filter: "brightness(1)",
                        duration: 0.5,
                        ease: "sine.out"
                    });
                }
            });
        }
    });
}
export default U.gsap;