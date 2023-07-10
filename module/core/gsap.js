/* ****▌███████████████████████████████████████████████████████████████████████████▐**** *\
|*     ▌████░░░░░░░░░░░ Euno's Blades in the Dark for Foundry VTT ░░░░░░░░░░░░░████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░ by Eunomiac ░░░░░░░░░░░░░██████████████████▐     *|
|*     ▌████████████████████████████  License █ v0.1.0 ████████████████████████████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░░░░░░  ░░░░░░░░░░░░░░░░░░███████████████████▐     *|
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
    hoverDialogItem: {
        effect: (targets, config) => {
            const titleElem = $(targets).children(".comp-title")[0];
            const imgElem = $(targets).children("img")[0];
            const tooltipElem = $(targets).nextAll(".tooltip")[0];
            const tl = U.gsap.timeline({ paused: true })
                .to(targets, {
                scale: 1.2,
                filter: "blur(0px)",
                opacity: 1,
                duration: 0.25,
                ease: "power2"
            }, 0);
            if (titleElem) {
                tl.to(titleElem, {
                    color: "rgb(255, 255, 255)",
                    opacity: 1,
                    duration: 0.25,
                    ease: "power2"
                }, 0);
            }
            if (imgElem) {
                tl.to(imgElem, {
                    filter: "blur(0px)",
                    opacity: 1,
                    duration: 0.25,
                    ease: "power2"
                }, 0);
            }
            if (tooltipElem) {
                tl.fromTo(tooltipElem, {
                    filter: "blur(50px)",
                    opacity: 0,
                    scale: 1.4,
                    x: "-=200"
                }, {
                    filter: "blur(0px)",
                    opacity: 1,
                    scale: 1.25,
                    x: 0,
                    y: 0,
                    duration: 0.5,
                    ease: "power2"
                }, 0);
            }
            return tl;
        },
        defaults: {}
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
export default U.gsap;