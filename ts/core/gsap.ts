import U from "./utilities";
import {TextPlugin} from "gsap/all";

const gsapPlugins: gsap.RegisterablePlugins[] = [
  TextPlugin
];

type gsapConfig = gsap.TweenVars & {
  duration: number,
  targets: Record<string, JQuery<HTMLElement>|Array<JQuery<HTMLElement>>>
}

type gsapEffect = {
  effect: (targets: BladesTweenTarget, config: gsapConfig) => gsap.core.Timeline|gsap.core.Tween,
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
  slideUp: {
    effect: (targets) => U.gsap.to(
      targets,
      {
        height: 0,
        // paddingTop: 0,
        // paddingBottom: 0,
        duration: 0.5,
        ease: "power3"
      }
    ),
    defaults: {}
  },
  pulse: {
    effect: (targets, config) => U.gsap.to(
      targets,
      {
        repeat: config.repCount,
        yoyo: true,
        duration: config.duration / config.repCount,
        ease: config.ease,
        opacity: 0.25
      }
    ),
    defaults: {
      repCount: 3,
      duration: 5,
      ease: "sine.inOut"
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
    effect: (tooltip, config) => {
      const tl = U.gsap.timeline({paused: true});
      if (!tooltip) { return tl }
      // tooltip = $(tooltip);
      // const scalingElems = [config.scalingElems as JQuery<HTMLElement>|Array<JQuery<HTMLElement>>|undefined ?? []].flat().filter((elem$) => Boolean(elem$[0]));

      if (config.scalingElems.length > 0) {
        tl.to(
          config.scalingElems,
          {
            scale: "+=0.2",
            filter: "none",
            color: "rgba(255, 255, 255, 1)",
            opacity: 1,
            duration: 0.125,
            ease: "back"
          },
          0.5
        );
      }

      if (tooltip) {
        tl.fromTo(
          tooltip,
          {
            filter: "blur(50px)",
            opacity: 0,
            scale: 2 * config.tooltipScale
          },
          {
            filter: "none",
            opacity: 1,
            scale: config.tooltipScale,
            x: config.xMotion,
            duration: 0.25,
            ease: "power2"
          },
          1
        );
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
    U.gsap.registerEffect(Object.assign(effect, {name}));
  });
}

export function ApplyTooltipListeners(html: JQuery<HTMLElement>) {
  html.find(".tooltip-trigger").each((_, elem) => {
    const tooltipElem = $(elem).find(".tooltip")[0] ?? $(elem).next(".tooltip")[0];
    if (!tooltipElem) { return }
    $(elem).data("hoverTimeline", U.gsap.effects.hoverTooltip(
      tooltipElem,
      {
        scalingElems: [...$(elem).find(".tooltip-scaling-elem")].filter((elem) => Boolean(elem)),
        xMotion: $(tooltipElem).hasClass("tooltip-left") ? "-=250" : "+=200",
        tooltipScale: $(tooltipElem).hasClass("tooltip-small") ? 1 : 1.2
      }
    ));
    $(elem).on({
      mouseenter: function() {
        $(elem).css("z-index", 10);
        $(elem).data("hoverTimeline").play();
      },
      mouseleave: function() {
        $(elem).data("hoverTimeline").reverse().then(() => {
          $(elem).css("z-index", "");
        });
      }
    });
  });
}

export default U.gsap;