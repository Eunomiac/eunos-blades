import {Attribute, Action, District} from "../core/constants";
import BladesItem from "../blades-item";
import BladesActor from "../blades-actor";
import {gsap} from "gsap/all";


declare global {
  // Type Aliases
  type MaybeStringOrFalse = string | false | undefined;

  type int = number;
  type float = number;
  type posInt = number;
  type posFloat = number;
  type key = string | number | symbol;
  type SmallInt = -10 | -9 | -8 | -7 | -6 | -5 | -4 | -3 | -2 | -1 | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

  type HTMLCode = string;
  type HEXColor = string;
  type RGBColor = string;
  type jQueryTextTerm = string | number | boolean | ((this: Element, index: number, text: string) => string | number | boolean);

  type keyFunc = (key: number | string, val?: any) => unknown;
  type valFunc = (val: any, key?: number | string) => any;
  type testFunc<Type extends keyFunc | valFunc> = (...args: Parameters<Type>) => boolean;
  type mapFunc<Type extends keyFunc | valFunc> = (...args: Parameters<Type>) => unknown;
  type checkTest = ((...args: any[]) => any) | testFunc<keyFunc> | testFunc<valFunc> | RegExp | number | string;

  type List<Type = any> = Record<number | string | symbol, Type>
  type Index<Type = any> = List<Type> | Type[];

  type FreezeProps<T> = {
    [Prop in keyof T as string extends Prop ? never : number extends Prop ? never : Prop]: T[Prop]
  };
  type KeyOf<T> = keyof T;

  type gsapAnim = gsap.core.Tween | gsap.core.Timeline;

  // Generic Blades Document Type
  type BladesDoc = BladesActor | BladesItem;

  // Reference Types for Blades Documents
  type DocRef = string | BladesDoc;
  type ActorRef = string | BladesActor;
  type ItemRef = string | BladesItem;

  // Utility Types for Variable Template Values
  type ValueMax = { max: number, value: number };
  type NamedValueMax = ValueMax & { name: string };
  type RollableStat = Attribute | Action;

  // Component Types for Sheets
  type BladesCompData = {
    class?: string,
    label?: string,
    labelClass?: string,
    tooltip?: string,
    tooltipClass?: string,

    checkLabel?: string,
    checkClasses?: {
      active: string,
      inactive: string
    },
    checkTarget?: string,
    checkValue?: boolean,

    dotline?: BladesDotlineData,
    dotlines?: BladesDotlineData[],

    compContainer?: {
      class?: string,
      blocks: Array<Array<Omit<BladesCompData, "compContainer">>>
    }
  }
  type BladesDotlineData = {
    data: ValueMax,
    dotlineClass?: string,
    dotlineLabel?: string,

    target?: string,
    isLocked?: boolean,

    svgKey?: string,
    svgFull?: string,
    svgEmpty?: string,

    iconEmpty?: string,
    iconEmptyHover?: string,
    iconFull?: string,
    iconFullHover?: string,
    altIconFull?: string,
    altIconFullHover?: string,
    altIconStep?: number,

    advanceButton?: string
  }
  type BladesRandomizer<T extends string = string> = {isLocked: boolean, value: T}

  // Claims Data for Turf Representation
  type BladesClaimData = {
    name: string,
    flavor?: string,
    description: string,
    district?: District,
    value: boolean,
    isTurf: boolean,
    connects: {
      left: boolean,
      right: boolean,
      top: boolean,
      bottom: boolean
    }
  }
}