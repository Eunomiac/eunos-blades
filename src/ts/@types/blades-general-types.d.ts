import {AttributeTrait, ActionTrait, District} from "../core/constants";
import BladesItem from "../BladesItem";
import BladesActor from "../BladesActor";
import BladesChat from "../classes/BladesChat";
import BladesActorSheet from "../sheets/actor/BladesActorSheet";
import BladesItemSheet from "../sheets/item/BladesItemSheet";
// import BladesClockKey, {BladesClock} from "../classes/BladesClockKey";
// import BladesConsequence from "../classes/BladesConsequence";
// import BladesRoll, {BladesRollMod} from "../classes/BladesRoll";
import {gsap} from "gsap/all";


declare global {
  // #region MISCELLANEOUS TYPE ALIASES (nonfunctional; for clarity) ~

  // Represents a list of a certain type
  type List<Type = unknown> = Record<key, Type>

  // Represents an index of a certain type
  type Index<Type = unknown> = List<Type> | Type[];

  // Represents a string, false, or undefined
  type MaybeStringOrFalse = string | false | undefined;

  // Represents an integer
  type int = number;

  // Represents a floating point number
  type float = number;

  // Represents a positive integer
  type posInt = number;

  // Represents a positive floating point number
  type posFloat = number;

  // Represents a key which can be a string, number, or symbol
  type key = string | number | symbol;

  // Represents a small integer from -10 to 10
  type SmallInt = -10 | -9 | -8 | -7 | -6 | -5 | -4 | -3 | -2 | -1 | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

  // Represents a string-like value
  type StringLike = string | number | boolean | null | undefined;

  // Represents a number represented as a string
  type NumString = string;

  // Represents an object with number-strings as keys
  type StringArray<T> = Record<NumString, T>;

  // Represents "true" or "false" as a string
  type BoolString = string;

  // Represents falsy values and empty objects to be pruned when cleaning list of values
  type UncleanValues = false | null | undefined | "" | 0 | Record<string, never> | never[];

  // Represents a string conversion to title case
  type tCase<S extends string> = S extends `${infer A} ${infer B}`
    ? `${tCase<A>} ${tCase<B>}`
    : Capitalize<Lowercase<S>>;

  // Represents an allowed gender key
  type Gender = "M" | "F" | "U" | "X";

  // Represents an allowed direction
  type Direction = "top" | "bottom" | "left" | "right";

  // Represents an allowed string case
  type StringCase = "upper" | "lower" | "sentence" | "title";

  // Represents HTML code as a string
  type HTMLCode = string;

  // Represents a HEX color as a string
  type HEXColor = string;

  // Represents an RGB color as a string
  type RGBColor = string;

  // Represents a key of a certain type
  type KeyOf<T> = keyof T;

  // Represents a value of a certain type
  type ValOf<T> = T extends unknown[] | readonly unknown[] ? T[number] : T[keyof T];

  // Represents a function that takes a key and an optional value and returns unknown
  type keyFunc = (key: key, val?: unknown) => unknown;

  // Represents a function that takes a value and an optional key and returns any
  type valFunc = (val: unknown, key?: key) => unknown;

  // Represents a test function
  type testFunc<Type extends keyFunc | valFunc> = (...args: Parameters<Type>) => boolean;

  // Represents a map function
  type mapFunc<Type extends keyFunc | valFunc> = (...args: Parameters<Type>) => ReturnType<Type>;

  // Represents a check test
  type checkTest = ((...args: unknown[]) => unknown) | testFunc<keyFunc> | testFunc<valFunc> | RegExp | number | string;

  // #endregion


  // Represents a document id as a string
  type IDString = string & { __idStringBrand: never };

  // Represents a UUID string, of the form /^[A-Za-z]+\.[A-Za-z0-9]{16}$/
  type UUIDString = string & { __uuidStringBrand: never }; // This type is compatible with string, but requires explicit casting, enforcing the UUID pattern.

  // Represents a dotkey
  type DotKey = string & { __dotKeyBrand: never };

  // Represents a dotkey appropriate for an update() data object
  type TargetKey = string & DotKey & { __targetKeyBrand: never };

  // Represents a dotkey point to a a flag instead of the document schema
  type TargetFlagKey = string & DotKey & { __targetFlagKeyBrand: never };

  // Represents a jQuery text term
  type jQueryTextTerm = string | number | boolean | (
    (this: Element, index: number, text: string) => string | number | boolean
  );

  // Represents an object describing dimensions of an HTML element, of form {x: number, y: number, width: number, height: number}
  type ElemPosData = {x: number, y: number, width: number, height: number};

  // Represents an object with frozen properties
  type FreezeProps<T> = {
    [Prop in keyof T as string extends Prop ? never : number extends Prop ? never : Prop]: T[Prop]
  };

  // Represents a deep-partial of an object
  type FullPartial<T> = {
    [P in keyof T]?: T[P] extends object ? FullPartial<T[P]> : T[P];
  };

  // Represents a gsap animation
  type gsapAnim = gsap.core.Tween | gsap.core.Timeline;

  // Represents a generic Blades document
  type BladesDoc = BladesActor | BladesItem;

  // Represents any Blades document sheet
  type BladesSheet = BladesActorSheet | BladesItemSheet;

  // Represents any document that can be the target of a BladesTargetLink subclass.
  type BladesLinkDoc = BladesDoc | BladesChat | User;

  // Represents a reference to a Blades document
  type DocRef = string | BladesDoc;

  // Represents a reference to a Blades actor
  type ActorRef = string | BladesActor;

  // Represents a reference to a Blades item
  type ItemRef = string | BladesItem;

  // Utility Types for Variable Template Values
  type ValueMax = {max: number, value: number};
  type NamedValueMax = ValueMax & {name: string};
  type RollableStat = AttributeTrait | ActionTrait;

  // Component Types for Sheets
  type BladesSelectOption<displayType, valueType = string> = {
    value: valueType,
    display: displayType
  };

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
  export declare function randomID(length?: number): IDString;
}
