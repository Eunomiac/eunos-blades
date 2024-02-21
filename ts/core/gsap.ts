/* eslint-disable @typescript-eslint/no-unused-vars */
import U from "./utilities";
import C, {ClockDisplayContext} from "./constants";
import BladesClockKey, {BladesClock} from "../classes/BladesClockKey";
// eslint-disable-next-line import/no-unresolved
import {TextPlugin, Flip, Draggable as Dragger, MotionPathPlugin, SplitText, Observer, CustomEase, CustomWiggle, CustomBounce, EasePack} from "gsap/all";

const gsapPlugins: gsap.RegisterablePlugins[] = [
  TextPlugin,
  Flip,
  MotionPathPlugin,
  Dragger,
  SplitText,
  Observer,
  CustomEase,
  CustomWiggle,
  CustomBounce,
  EasePack
];

export type gsapConfig = gsap.TweenVars & {
  duration: number,
  targets: Record<string, JQuery<HTMLElement> | Array<JQuery<HTMLElement>>>
}

export type gsapEffect = {
  effect: (
    targets: gsap.TweenTarget,
    config: gsap.TweenVars & {duration: number}
  ) => gsap.core.Timeline | gsap.core.Tween,
  defaults: gsap.TweenVars,
  extendTimeline?: boolean
}

export const gsapEffects: Record<string, gsapEffect> = {
  // #region CLOCK KEYS
  keyDrop: {
    effect: (clockKey, config) => {
      const [keyContainer] = $(clockKey as HTMLElement).closest(".clock-key-container");
      return U.gsap.timeline({
        onComplete() {
          if (config.callback) {
            config.callback();
          }
        }
      })
        .fromTo(keyContainer, {
          y: config.yShift
        }, {
          y: 0,
          autoAlpha: 1,
          ease: "bounce",
          duration: config.duration
        });
    },
    defaults: {
      duration: 1,
      yShift: -800
    },
    extendTimeline: true
  },
  keyPull: {
    effect: (clockKey, config) => {
      const [keyContainer] = $(clockKey as HTMLElement).closest(".clock-key-container");
      return U.gsap.timeline({
        onComplete() {
          if (config.callback) {
            config.callback();
          }
        }
      })
        .to(keyContainer, {
          y: config.yDelta,
          ease: config.ease,
          duration: 0.75 * config.duration
        })
        .to(keyContainer, {
          opacity: 0,
          ease: "power2.out",
          duration: 0.25 * config.duration
        }, 0.75 * config.duration);
    },
    defaults: {
      yDelta: -800,
      duration: 1,
      ease: "back.in(1)"
    },
    extendTimeline: true
  },
  keyControlPanelFlip: {
    effect: (target, config) => {
      return U.gsap.timeline({
        delay: config.delay as number,
        onStart() {
          if (target) {
            const target$ = $(target as HTMLElement);
            // Get the next sibling of the target element if it has the class "clock-control"
            const nextSibling$ = target$.next(".clock-control-flipper");
            // Check if the nextSibling element exists
            if (nextSibling$.length) {
              U.gsap.effects.keyControlPanelFlip(nextSibling$[0], {
                ...config,
                delay: 0.15
              });
            }
          }
        }
      })
        .to(target, {
          rotateX: config.angle,
          duration: 0.5,
          ease: "back.inOut(2)"
        });
    },
    defaults: {
      angle: 180,
      delay: 0
    },
    extendTimeline: true
  },
  // #endregion

  // #region CHAT CONSEQUENCE EFFECTS
  csqEnter: {
    effect: (csqContainer, config) => {
      const csqRoot = U.gsap.utils.selector(csqContainer);
      // ELog.checkLog3("gsap", "gsapEffects.consequenceEnter -> THIS", {this: this, csqRoot});
      const csqIconCircle = csqRoot(".consequence-icon-circle.base-consequence");
      // const csqBaseElems = csqRoot(".base-consequence:not(.consequence-icon-circle)");
      const csqBaseTypeElem = csqRoot(".consequence-type.base-consequence");
      const csqAcceptTypeElem = csqRoot(".consequence-type.accept-consequence");
      const csqBaseNameElem = csqRoot(".consequence-name.base-consequence");
      const csqAcceptNameElem = csqRoot(".consequence-name.accept-consequence");
      // const csqAcceptElems = csqRoot(".accept-consequence:not(.consequence-icon-circle):not(.consequence-button-container)");

      const tl = U.gsap.timeline({paused: true, defaults: {}});

      // Initialize name and type opacities.
      if (csqAcceptTypeElem.length > 0) {
        tl.set(csqAcceptTypeElem, {opacity: 0}, 0);
      }
      if (csqAcceptNameElem.length > 0) {
        tl.set(csqAcceptNameElem, {opacity: 0}, 0);
      }

      // Crossfade base/accept type lines
      if (csqBaseTypeElem.length > 0) {
        tl.fromTo(csqBaseTypeElem, {
          opacity: 1
        }, {
          opacity: 0,
          duration: 0.25,
          ease: "sine"
        }, 0);
      }
      if (csqAcceptTypeElem.length > 0) {
        tl.fromTo(csqAcceptTypeElem, {
          opacity: 0
        }, {
          opacity: 1,
          duration: 0.25,
          ease: "sine"
        }, 0);
      }

      // Crossfade base/accept name lines
      if (csqBaseNameElem.length > 0) {
        tl.fromTo(csqBaseNameElem, {
          opacity: 1
        }, {
          opacity: 0,
          duration: 0.25,
          ease: "sine"
        }, 0);
      }
      if (csqAcceptNameElem.length > 0) {
        tl.fromTo(csqAcceptNameElem, {
          opacity: 0
        }, {
          opacity: 1,
          duration: 0.25,
          ease: "sine"
        }, 0);
      }

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

      // Enlarge the icon circle, add stroke
      if (csqIconCircle.length > 0) {
        tl.fromTo(csqIconCircle, {
          scale: 0.75,
          outlineColor: C.Colors.dBLACK,
          outlineWidth: 0
        }, {
          scale: 0.85,
          outlineColor: C.Colors.GREY,
          outlineWidth: 1,
          duration: 0.55,
          ease: "sine.out"
        }, 0);
      }

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
      const csqContainer = $(csqIconContainer as HTMLElement).closest(".comp.consequence-display-container");
      const csqRoot = U.gsap.utils.selector(csqContainer[0]);
      const iconRoot = U.gsap.utils.selector(csqIconContainer);

      const csqBackgroundImg = csqRoot(".consequence-bg-image");
      const csqInteractionPads = csqRoot(".consequence-interaction-pad");

      const csqIconCircleBase = iconRoot(".consequence-icon-circle.base-consequence");
      const csqIconCircleAccept = iconRoot(".consequence-icon-circle.accept-consequence");
      const csqButtonContainers = iconRoot(".consequence-button-container");

      const tl = U.gsap.timeline({
        paused: true,
        onComplete: function() {
          $(csqInteractionPads).css("pointerEvents", "auto");
        },
        onReverseComplete: function() {
          $(csqInteractionPads).css("pointerEvents", "none");
        }
      });

      // Slide out the background
      if (csqBackgroundImg.length) {
        tl.fromTo(csqBackgroundImg, {
          xPercent: 110,
          yPercent: -50
        }, {
          xPercent: -60,
          yPercent: -50,
          duration: 0.5,
          ease: "back"
        }, 0);
      }

      // Fade out the base consequence icon circle
      if (csqIconCircleBase.length > 0) {
        tl.fromTo(csqIconCircleBase, {
          opacity: 1
        }, {
          opacity: 0,
          duration: 0.25,
          ease: "sine.out"
        }, 0);
      }

      // Fade in the accept consequence icon circle, enlarging the stroke
      if (csqIconCircleAccept.length > 0) {
        tl.fromTo(csqIconCircleAccept, {
          opacity: 0
        }, {
          opacity: 1,
          duration: 0.15,
          ease: "sine"
        }, 0)
          .fromTo(csqIconCircleAccept, {
            outlineWidth: 1,
            scale: 0.85
          }, {
            outlineWidth: 2,
            scale: 1,
            duration: 0.25,
            ease: "sine"
          }, 0.175);
      }

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
  csqEnterRight: {
    effect: (csqContainer) => {
      const csqRoot = U.gsap.utils.selector(csqContainer);
      const typeLine = csqRoot(".consequence-type-container .consequence-type.accept-consequence");
      const typeLineBg = csqRoot(".consequence-type-container .consequence-type-bg.accept-consequence");
      const buttonRoot = U.gsap.utils.selector(csqRoot(".consequence-button-container.consequence-accept-button-container"));

      const buttonBg = buttonRoot(".consequence-button-bg");
      const buttonIcon = buttonRoot(".button-icon i");
      const buttonLabel = buttonRoot(".consequence-button-label");

      const tl = U.gsap.timeline({paused: true, defaults: {}});

      // Turn type line white
      if (typeLine.length > 0) {
        tl.fromTo(typeLine,
          {
            color: C.Colors.RED
          },
          {
            color: C.Colors.WHITE,
            duration: 0.5,
            ease: "sine.inOut"
          }, 0);
      }

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

      // Turn button icon black and scale
      if (buttonIcon.length > 0) {
        tl.fromTo(buttonIcon,
          {
            color: C.Colors.GREY,
            opacity: 0.75,
            scale: 1
          },
          {
            color: C.Colors.dBLACK,
            scale: 1.25,
            opacity: 1,
            duration: 0.5,
            ease: "sine"
          }, 0);
      }

      // Turn button label black, add letter-spacing, bold
      if (buttonLabel.length > 0) {
        tl.fromTo(buttonLabel,
          {
            color: C.Colors.GREY,
            fontWeight: 400,
            scale: 1
          },
          {
            color: C.Colors.dBLACK,
            fontWeight: 800,
            duration: 0.75,
            ease: "sine"
          }, 0);
      }

      return tl;
    },
    defaults: {}
  },
  csqEnterLeft: {
    effect: (csqContainer) => {
      const csqRoot = U.gsap.utils.selector(csqContainer);
      const typeLine = csqRoot(".consequence-type-container .consequence-type.accept-consequence");
      const nameLine = csqRoot(".consequence-name-container .consequence-name.accept-consequence");
      const acceptIconCircle = csqRoot(".consequence-icon-circle.accept-consequence");
      const acceptButton = csqRoot(".consequence-button-container.consequence-accept-button-container");

      const tl = U.gsap.timeline({paused: true, defaults: {}});

      // Fade out type line
      if (typeLine.length > 0) {
        tl.to(typeLine,
          {
            opacity: 0,
            duration: 0.15,
            ease: "sine.inOut"
          }, 0);
      }

      // Fade out name
      if (nameLine.length > 0) {
        tl.to(nameLine, {
          opacity: 0,
          duration: 0.15,
          ease: "sine.inOut"
        }, 0);
      }

      // Fade out icon
      if (acceptIconCircle.length > 0) {
        tl.to(acceptIconCircle,
          {
            opacity: 0,
            duration: 0.15,
            ease: "sine.inOut"
          }, 0);
      }

      // Fade out accept button
      if (acceptButton.length > 0) {
        tl.fromTo(acceptButton,
          {
            opacity: 1
          },
          {
            opacity: 0,
            duration: 0.25,
            ease: "sine.inOut"
          }, 0);
      }

      return tl;
    },
    defaults: {}
  },
  csqEnterSubLeft: {
    effect: (csqContainer, config) => {
      const csqRoot = U.gsap.utils.selector(csqContainer);

      const iconCircle = csqRoot(`.consequence-icon-circle.${config.type}-consequence`);
      const typeLine = csqRoot(`.consequence-type-container .consequence-type.${config.type}-consequence`);
      const nameLine = csqRoot(`.consequence-name.${config.type}-consequence`);

      const footerBg = csqRoot(`.consequence-footer-container .consequence-footer-bg.${config.type}-consequence`);
      const specialFooterMsg = csqRoot(`.consequence-footer-container .consequence-footer-message.${config.type}-consequence`);

      const tl = U.gsap.timeline({paused: true, defaults: {}});

      // Fade in icon circle
      if (iconCircle.length > 0) {
        tl.fromTo(iconCircle, {
          opacity: 0
        }, {
          opacity: 1,
          duration: 0.5,
          ease: "back.out"
        }, 0);
      }

      // Fade in typeLine
      if (typeLine.length > 0) {
        tl.fromTo(typeLine, {
          opacity: 0
        }, {
          opacity: 1,
          duration: 0.5,
          ease: "back.out"
        }, 0);
      }

      // Slide out nameLine from left
      if (nameLine.length > 0) {
        tl.fromTo(nameLine, {
          scaleX: 0
        }, {
          scaleX: 1,
          duration: 0.5,
          ease: "back.inOut"
        }, 0);
      }

      // Slide out footer background from left
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

      // Slide out attribute from left
      if (specialFooterMsg.length > 0) {
        tl.fromTo(specialFooterMsg, {
          scaleX: 0,
          opacity: 1
        }, {
          scaleX: 1,
          opacity: 1,
          duration: 0.5,
          ease: "back.inOut"
        }, 0);
      }
      if (csqRoot(`.consequence-button-container.consequence-${config.type}-button-container`).length > 0) {
        const buttonRoot = U.gsap.utils.selector(csqRoot(`.consequence-button-container.consequence-${config.type}-button-container`));
        const buttonBg = buttonRoot(".consequence-button-bg");
        const buttonIcon = buttonRoot(".button-icon i");
        const buttonLabel = buttonRoot(".consequence-button-label");

        // Slide out button background from right
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

        // Turn button icon black and scale
        if (buttonIcon.length > 0) {
          tl.fromTo(buttonIcon,
            {
              color: C.Colors.GREY,
              opacity: 0.75,
              scale: 1
            },
            {
              color: C.Colors.dBLACK,
              scale: 1.25,
              opacity: 1,
              duration: 0.5,
              ease: "sine"
            }, 0);
        }

        // Turn button label black, bold
        if (buttonLabel.length > 0) {
          tl.fromTo(buttonLabel,
            {
              color: C.Colors.GREY,
              fontWeight: 400,
              scale: 1
            },
            {
              color: C.Colors.dBLACK,
              fontWeight: 800,
              duration: 0.75,
              ease: "sine"
            }, 0);
        }
      }

      return tl;
    },
    defaults: {}
  },
  // #endregion

  // #region CHARACTER SHEET EFFECTS
  fillCoins: {
    effect: (targets, config) => {
      // Targets will be all coins from zero to where fill currently is
      // Some will already be full, others not.
      // Stagger in timeline
      // Pulse in size and color
      // Shimmer as they shrink back ?
      return U.gsap.to(targets,
        {
          duration: config.duration / 2,
          scale: config.scale,
          filter: config.filter,
          ease: config.ease,
          stagger: {
            amount: 0.25,
            from: "start",
            repeat: 1,
            yoyo: true
          }
        }
      );
    },
    defaults: {
      duration: 1,
      scale: 1,
      filter: "saturate(1) brightness(2)",
      ease: "power2.in"
    },
    extendTimeline: true
  },
  // #endregion

  // #region GENERAL: 'blurRemove', 'hoverTooltip', 'textJitter'
  blurRemove: {
    effect: (targets, config) => U.gsap.timeline({stagger: config.stagger})
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
          marginBottom: config.ignoreMargin
            ? undefined
            : function(i, target) {
              return U.get(target, "height") as number * -1;
            },
          marginRight: config.ignoreMargin
            ? undefined
            : function(i, target) {
              return U.get(target, "width") as number * -1;
            },
          scale: config.scale,
          filter: `blur(${config.blur}px)`,
          duration: (3 / 4) * config.duration
        },
        config.duration / 4
      )
      .to(
        targets,
        {
          autoAlpha: 0,
          duration: config.duration / 2,
          ease: "power3.in"
        },
        config.duration / 2
      ),
    defaults: {
      ignoreMargin: false,
      skewX: -20,
      duration: 0.5,
      x: "+=300",
      scale: 1.5,
      blur: 10,
      stagger: 0
    },
    extendTimeline: true
  },
  blurReveal: {
    effect: (targets, config) => U.gsap.timeline()
      .fromTo(
        targets,
        {
          x: config.x,
          marginBottom: config.ignoreMargin
            ? undefined
            : function(i, target) {
              return U.get(target, "height") as number * -1;
            },
          marginRight: config.ignoreMargin
            ? undefined
            : function(i, target) {
              return U.get(target, "width") as number * -1;
            },
          scale: config.scale,
          filter: `blur(${config.blur}px)`
        }, {
          x: 0,
          marginBottom: 0,
          marginRight: 0,
          scale: 1,
          filter: "blur(0px)",
          duration: (3 / 4) * config.duration
        },
        0
      )
      .fromTo(
        targets,
        {
          autoAlpha: 0
        }, {
          autoAlpha: 1,
          duration: config.duration / 2,
          ease: "power3.in"
        },
        0
      )
      .fromTo(
        targets,
        {
          skewX: config.skewX
        },
        {
          skewX: 0,
          duration: config.duration / 2,
          ease: "power4.out"
        },
        config.duration / 2
      ),
    defaults: {
      ignoreMargin: false,
      skewX: -20,
      duration: 0.5,
      x: "+=300",
      scale: 1.5,
      blur: 10
    },
    extendTimeline: true
  },
  scaleUpReveal: {
    effect: (target, config) => {
      const tl = U.gsap.timeline()
        .fromTo(target, {
          autoAlpha: 0,
          scale: 0.5 * (config.scale as number)
        }, {
          autoAlpha: 1,
          scale: config.scale,
          duration: config.duration,
          ease: config.ease
        });

      return tl;
    },
    defaults: {
      scale: 1,
      duration: 0.5,
      ease: "power2"
    },
    extendTimeline: true
  },
  scaleDownRemove: {
    effect: (target, config) => {
      const tl = U.gsap.timeline()
        .to(target, {
          autoAlpha: 0,
          scale: 0.5 * (config.scale as number),
          duration: config.duration,
          ease: config.ease
        });

      return tl;
    },
    defaults: {
      scale: 1,
      duration: 0.5,
      ease: "power2"
    },
    extendTimeline: true
  },
  blurRevealTooltip: {
    effect: (target, config) => {
      if (!target) { throw new Error(`blurRevealTooltip effect: tooltip element is ${target === null ? "null" : typeof target}`); }
      const tooltip$: JQuery<HTMLElement> = $(target as HTMLElement);

      return U.gsap.timeline({
        paused: true,
        onReverseComplete: config.onReverseComplete
      })
        .fromTo(
          tooltip$,
          {
            filter: `blur(${config.blurStrength}px)`,
            autoAlpha: 0,
            xPercent: 50,
            yPercent: -200,
            scale: config.scale
          },
          {
            filter: "blur(0px)",
            autoAlpha: 1,
            xPercent: -50,
            yPercent: -100,
            scale: 1,
            ease: config.ease,
            duration: config.duration
          }
        );
    },
    defaults: {
      scale: 1.5,
      blurStrength: 15,
      ease: "back.out",
      duration: 0.25,
      onReverseComplete: undefined
    },
    extendTimeline: true
  },
  textJitter: {
    effect: (target, config) => {
      const [targetElem] = $(target as HTMLElement);
      if (!targetElem) { throw new Error("textJitter effect: target not found"); }

      const split = new SplitText(targetElem, {type: "chars"});

      return U.gsap.timeline()
        .to(targetElem, {
          autoAlpha: 1,
          duration: config.duration,
          ease: "none"
        })
        .fromTo(split.chars, {
          y: -config.yAmp
        }, {
          y: config.yAmp,
          duration: config.duration,
          ease: "sine.inOut",
          stagger: {
            repeat: -1,
            yoyo: true,
            from: "random",
            each: config.stagger
          } as gsap.StaggerVars
        }, 0)
        .fromTo(split.chars, {
          rotateZ: -config.rotateAmp
        }, {
          rotateZ: config.rotateAmp,
          duration: config.duration,
          ease: CustomWiggle.create("myWiggle", {wiggles: 10, type: "random"}),
          stagger: {
            repeat: -1,
            from: "random",
            yoyo: true,
            each: config.stagger
          } as gsap.StaggerVars
        }, 0);
    },
    defaults: {
      yAmp: 2,
      rotateAmp: 2,
      duration: 1,
      stagger: 0.05
    },
    extendTimeline: true
  }
  // #endregion
};

/**
 * Registers relevant GSAP plugins and effects.
 */
export function Initialize() {
  if (gsapPlugins.length) {
    U.gsap.config({
      nullTargetWarn: true
    });
    U.gsap.registerPlugin(...gsapPlugins);
    Object.assign(
      globalThis,
      {
        TextPlugin,
        Flip,
        MotionPathPlugin,
        Dragger,
        SplitText,
        Observer,
        CustomEase,
        CustomWiggle,
        CustomBounce,
        EasePack
      }
    );
  }
  Object.entries(gsapEffects).forEach(([name, effect]) => {
    U.gsap.registerEffect(Object.assign(effect, {name}));
  });
}

/**
 * Applies listeners to '.tooltip-trigger' elements in the document.
 * @param {JQuery<HTMLElement>} html The document to be searched.
 */
export function ApplyTooltipAnimations(html: JQuery<HTMLElement>) {

  html.find(".tooltip-trigger").each((_, el) => {
    const tooltipElem = $(el).find(".tooltip")[0] ?? $(el).next(".tooltip")[0];
    if (!tooltipElem) {return;}
    const tooltip$ = $(tooltipElem);

    /**
     * Use the .tooltip-trigger element as the definitive positioning element for the tooltip itself.
     * If the tooltip-trigger's absolute position relative to the viewport is, e.g., near the top,
     * then the tooltip should appear beneath, etc
     */

    // Find the tooltip's parent container. If its position isn't relative or absolute, set it to relative.
    const tooltipContainer$ = tooltip$.parent();
    if (tooltipContainer$.css("position") !== "relative"
      && tooltipContainer$.css("position") !== "absolute") {
      tooltipContainer$.css("position", "relative");
    }

    // Set the tooltip itself to absolute positioning
    tooltip$.css("position", "absolute");

    // Assign a unique ID to the tooltip element
    const tooltipID = `tooltip-${randomID()}`;
    tooltip$.attr("id", tooltipID);

    // For .tooltip-wide tooltips, adjust the aspect ratio accordingly
    if (tooltip$.hasClass("tooltip-wide")) {
      U.adjustTextContainerAspectRatio(tooltipElem, 6);
    }


    $(el).on({
      mouseenter: function() {
        game.eunoblades.Director.displayTooltip(tooltipElem);
      },
      mouseleave: function() {
        game.eunoblades.Director.clearTooltip(tooltipID);
      }
    });
  });
}

/**
 * Applies listeners to .consequence-display-container and children found in document.
 * @param {JQuery<HTMLElement>} html The document to be searched.
 */
export function ApplyConsequenceAnimations(html: JQuery<HTMLElement>) {
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

        const iconContainer$ = $(csqContainer).find(".consequence-icon-container");

        const rightInteractionPad$ = $(csqContainer).find(".interaction-pad-right");
        const leftInteractionPad$ = $(csqContainer).find(".interaction-pad-left");
        const resistInteractionPad$ = $(csqContainer).find(".interaction-pad-left-resist");
        const armorInteractionPad$ = $(csqContainer).find(".interaction-pad-left-armor");
        const specialInteractionPad$ = $(csqContainer).find(".interaction-pad-left-special");

        // Apply master on-enter hover timeline to consequence container.
        $(csqContainer).data("hoverTimeline", U.gsap.effects.csqEnter(csqContainer));
        $(csqContainer).on({
          mouseenter: function() {
            $(csqContainer).css("z-index", 10);
            $(csqContainer).data("hoverTimeline").play();
          },
          mouseleave: function() {
            if (!(iconContainer$.data("isToggled") || iconContainer$.data("isTogglingOn")) || iconContainer$.data("isTogglingOff")) {
              $(csqContainer).data("hoverTimeline").reverse().then(() => {
                $(csqContainer).css("z-index", "");
              });
            }
          }
        });

        // Apply click timeline to icon circle
        iconContainer$.data("clickTimeline", U.gsap.effects.csqClickIcon(iconContainer$[0]));
        iconContainer$.on({
          click: function() {
            if (iconContainer$.data("isToggled") || iconContainer$.data("isTogglingOn")) {
              iconContainer$.data("isTogglingOn", false);
              iconContainer$.data("isTogglingOff", true);
              iconContainer$.data("clickTimeline").reverse().then(() => {
                iconContainer$.data("isTogglingOff", false);
                iconContainer$.data("isToggled", false);
              });
            } else {
              iconContainer$.data("isTogglingOn", true);
              iconContainer$.data("isTogglingOff", false);

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

        // Apply hover timelines to right (accept) interaction pad
        rightInteractionPad$.data("hoverTimeline", U.gsap.effects.csqEnterRight(csqContainer));
        rightInteractionPad$.on({
          mouseenter: function() {
            if (iconContainer$.data("isToggled")) {
              rightInteractionPad$.data("hoverTimeline").play();
            }
          },
          mouseleave: function() {
            rightInteractionPad$.data("hoverTimeline").reverse();
          }
        });

        // Apply hover timeline to left (resist/armor/special) interaction pad
        leftInteractionPad$.data("hoverTimeline", U.gsap.effects.csqEnterLeft(csqContainer));
        leftInteractionPad$.on({
          mouseenter: function() {
            if (iconContainer$.data("isToggled")) {
              leftInteractionPad$.data("hoverTimeline").play();
            }
          },
          mouseleave: function() {
            leftInteractionPad$.data("hoverTimeline").reverse();
          }
        });

        // Apply hover timelines to specific left interaction pads
        resistInteractionPad$.data("hoverTimeline", U.gsap.effects.csqEnterSubLeft(csqContainer, {type: "resist"}));
        resistInteractionPad$.on({
          mouseenter: function() {
            if (iconContainer$.data("isToggled")) {
              resistInteractionPad$.data("hoverTimeline").play();
            }
          },
          mouseleave: function() {
            if (iconContainer$.data("isToggled")) {
              resistInteractionPad$.data("hoverTimeline").reverse();
            }
          }
        });

        armorInteractionPad$.data("hoverTimeline", U.gsap.effects.csqEnterSubLeft(csqContainer, {type: "armor"}));
        armorInteractionPad$.on({
          mouseenter: function() {
            if (iconContainer$.data("isToggled")) {
              armorInteractionPad$.data("hoverTimeline").play();
            }
          },
          mouseleave: function() {
            if (iconContainer$.data("isToggled")) {
              armorInteractionPad$.data("hoverTimeline").reverse();
            }
          }
        });

        specialInteractionPad$.data("hoverTimeline", U.gsap.effects.csqEnterSubLeft(csqContainer, {type: "special"}));
        specialInteractionPad$.on({
          mouseenter: function() {
            if (iconContainer$.data("isToggled")) {
              specialInteractionPad$.data("hoverTimeline").play();
            }
          },
          mouseleave: function() {
            if (iconContainer$.data("isToggled")) {
              specialInteractionPad$.data("hoverTimeline").reverse();
            }
          }
        });

      }


    });


}

export {
  TextPlugin,
  Flip,
  MotionPathPlugin,
  Dragger,
  SplitText,
  Observer,
  CustomEase,
  CustomWiggle,
  CustomBounce,
  EasePack
};

export default U.gsap;
