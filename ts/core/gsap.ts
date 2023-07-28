import U from "./utilities.js";
import {TextPlugin} from "gsap/all";

const gsapPlugins: gsap.RegisterablePlugins[] = [
	TextPlugin
];

type gsapEffect = {
	effect: (targets: gsap.TweenTarget, config: gsap.TweenVars & {duration: number}) => gsap.core.Timeline|gsap.core.Tween,
	defaults: gsap.TweenVars,
	extendTimeline?: boolean
}

const gsapEffects: Record<string, gsapEffect> = {
	blurRemove: {
		effect: (targets, config) => U.gsap.timeline()
			.to(
				targets,
				{
					skewX: config.skewX,
					duration: config.duration / 2,
					ease: "power4.out"
				}
			)
			.to(
				targets,
				{
					x: config.x,
					marginBottom(i, target) {
						return U.get(target, "height") as number * -1;
					},
					marginRight(i, target) {
						return U.get(target, "width") as number * -1;
					},
					scale: config.scale,
					filter: config.filter,
					duration: (3 / 4) * config.duration
				},
				config.duration / 4
			)
			.to(
				targets,
				{
					opacity: 0,
					duration: config.duration / 2,
					ease: "power3.in"
				},
				config.duration / 2
			),
		defaults: {
			skewX: -20,
			duration: 0.5,
			x: "+=300",
			scale: 1.5,
			filter: "blur(10px)"
		}
	},
	throb: {
		effect: (targets, config) => U.gsap.to(
			targets,
			{
				repeat: config.stagger ? undefined : 1,
				yoyo: config.stagger ? undefined : true,
				duration: config.duration / 2,
				scale: config.scale,
				filter: config.filter,
				ease: config.ease,
				stagger: config.stagger
					? {
							...config.stagger as gsap.StaggerVars,
							repeat: 1,
							yoyo: true
						}
					: {}
			}
		),
		defaults: {
			duration: 1,
			scale: 1,
			filter: "saturate(1) brightness(2)",
			ease: "power2.in"
		},
		extendTimeline: true
	},
	pulseClockWedges: {
		effect: (targets, config) => U.gsap.timeline({duration: 0}),
		defaults: {}
	},
	reversePulseClockWedges: {
		effect: (targets, config) => U.gsap.timeline({duration: 0}),
		defaults: {}
	},
	fillCoins: {
		effect: (targets, config) => {
			// Targets will be all coins from zero to where fill currently is
			// Some will already be full, others not.
			// Stagger in timeline
			// Pulse in size and color
			// Shimmer as they shrink back ?

			// G.effects.fillCoins(".dot.full-dot", {duration: 0.5, ease: "expo.in", stagger: {amount: 0.75, from: "start", repeat: 1, yoyo: true}})
			return U.gsap.effects.throb(targets, {stagger: {
				amount: 0.25,
				from: "start",
				repeat: 1,
				yoyo: true
			}, ...config ?? {}});
		},
		defaults: { }
	},
	hoverTooltip: {
		effect: (targets, config) => {
			const titleElem = $(targets as string).children(".comp-title")[0];
			const imgElem = $(targets as string).children("img")[0];
			const tooltipElem = $(targets as string).nextAll(".tooltip")[0];
			const tl = U.gsap.timeline({paused: true})
				.to(
					targets,
					{
						// scale: 1.2,
						filter: "blur(0px)",
						opacity: 1,
						duration: 0.25,
						ease: "power2"
					},
					0
				);
			if (titleElem) {
				tl.to(
					titleElem,
					{
						color: "rgb(255, 255, 255)",
						opacity: 1,
						duration: 0.25,
						ease: "power2"
					},
					0
				);
			}
			if (imgElem) {
				tl.to(
					imgElem,
					{
						filter: "blur(0px)",
						opacity: 1,
						duration: 0.25,
						ease: "power2"
					},
					0
				);
			}
			if (tooltipElem) {
				let [xStart, xEnd, yStart, yEnd, scale] = [-200, 0, -100, -100, 1.25];
				if ($(tooltipElem).hasClass("tooltip-low")) {
					yStart = 0;
					yEnd = 0;
				}
				if ($(tooltipElem).hasClass("tooltip-left")) {
					xStart = 100;
					xEnd = -250;
				}
				if ($(tooltipElem).hasClass("tooltip-small")) {
					scale = 1;
				}

				tl.fromTo(
					tooltipElem,
					{
						filter: "blur(50px)",
						opacity: 0,
						scale: 1.25 * scale,
						x: xStart,
						y: yStart
					},
					{
						filter: "blur(0px)",
						opacity: 1,
						scale,
						x: xEnd,
						y: yEnd,
						duration: 0.5,
						ease: "power2"
					},
					0
				);
			}

			return tl;
		},
		defaults: { }
	}
};

export function Initialize() {
	if (gsapPlugins.length) {
		U.gsap.registerPlugin(...gsapPlugins);
	}
	Object.entries(gsapEffects).forEach(([name, effect]) => {
		U.gsap.registerEffect(Object.assign(effect, {name}));
	});
}

export default U.gsap;