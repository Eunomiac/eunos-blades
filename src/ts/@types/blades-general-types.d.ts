// #region IMPORTS ~
import BladesActor from "../BladesActor";
import BladesItem from "../BladesItem";
import BladesActorSheet from "../sheets/actor/BladesActorSheet";
import BladesItemSheet from "../sheets/item/BladesItemSheet";

import BladesActiveEffect from "../documents/BladesActiveEffect";
import BladesChatMessage from "../classes/BladesChatMessage";
import BladesDialog from "../classes/BladesDialog";
import BladesRoll from "../classes/BladesRoll";
import BladesScene from "../classes/BladesScene";

import {gsap} from "gsap/all";
// #endregion

// #region CONFIGURATION OF SYSTEM CLASSES
type ActorDoc = BladesActor; // Actor;
type ItemDoc = BladesItem; // Item;
type ActorSheetDoc = BladesActorSheet; // ActorSheet;
type ItemSheetDoc = BladesItemSheet; // ItemSheet;

type ActiveEffectDoc = BladesActiveEffect; // ActiveEffect;
type ChatMessageDoc = BladesChatMessage; // Chat;
type DialogDoc = BladesDialog; // Dialog;
type RollDoc = BladesRoll; // Roll;
type SceneDoc = BladesScene; // Scene;
type UserDoc = User; // User;
// #endregion

// #region UTILITY TYPES
type HexDigit = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "A" | "B" | "C" | "D" | "E" | "F";
type MaybeSpace = " " | "";
type FlexComma = `${MaybeSpace},${MaybeSpace}`;
// #endregion

declare global {
  // #region MISCELLANEOUS TYPE ALIASES (nonfunctional; for clarity) ~

  // Represents a list of a certain type
  type List<Type = unknown> = Record<key, Type>

  // Represents an index of a certain type
  type Index<Type = unknown> = List<Type> | Type[];

  // Represents a string, false, or undefined
  type MaybeStringOrFalse = string | false | undefined;

  // Represents a function with an unknown number of parameters, returning a value of type R
  type func<R = unknown> = (...args: unknown[]) => R;

  // Represents an async function with an unknown number of parameters, returning a Promise resolving to a value of type R
  type asyncFunc<R = unknown> = (...args: unknown[]) => Promise<R>;

  // Represents any class constructor with an unknown number of parameters
  type AnyClass<T = unknown> = new (...args: unknown[]) => T;

  // Represents a key which can be a string, number, or symbol
  type key = string | number | symbol;

  // Represents a small integer from -10 to 10
  type SmallInt = -10 | -9 | -8 | -7 | -6 | -5 | -4 | -3 | -2 | -1 | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

  // Represents a string-like value
  type StringLike = string | number | boolean | null | undefined;

  // Represents a number represented as a string
  type NumString = `${number}`;

  // Represents an object with number-strings as keys
  type StringArray<T> = Record<NumString, T>;

  // Represents "true" or "false" as a string
  type BoolString = `${boolean}`;

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
  type HTMLCode = string & {__htmlStringBrand: never};

  // Represents a HEX color as a string, allowing for six (RGB) or eight (RGBA) uppercase hexadecimal digits
  type HexColor = `#${HexDigit}${HexDigit}${HexDigit}` | `#${HexDigit}${HexDigit}${HexDigit}${HexDigit}`;

  // Represents an RGB color as a string
  type RGBColor = `rgb(${number}${FlexComma}${number}${FlexComma}${number})` |
    `rgba(${number}${FlexComma}${number}${FlexComma}${number}${FlexComma}${number})`;

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
  type IDString = string & {__idStringBrand: never};

  // Represents a UUID string, of the form /^[A-Za-z]+\.[A-Za-z0-9]{16}$/
  type UUIDString = string & {__uuidStringBrand: never}; // This type is compatible with string, but requires explicit casting, enforcing the UUID pattern.

  // Represents a dotkey
  type DotKey = string & {__dotKeyBrand: never};

  // Represents a dotkey appropriate for an update() data object
  type TargetKey = string & DotKey & {__targetKeyBrand: never};

  // Represents a dotkey point to a a flag instead of the document schema
  type TargetFlagKey = string & DotKey & {__targetFlagKeyBrand: never};

  // Represents a jQuery text term
  type jQueryTextTerm = string | number | boolean | (
    (this: Element, index: number, text: string) => string | number | boolean
  );

  // Represents an object describing dimensions of an HTML element, of form {x: number, y: number, width: number, height: number}
  interface ElemPosData {x: number, y: number, width: number, height: number}

  // Represents an object describing dimensions of an HTML element, in the form of a DOMRect object with mutable properties.
  type MutableRect = Omit<Mutable<DOMRect>, "toJSON">;

  /**
   * Represents a type that may be either of type T or undefined.
   * @template T - The type that may be present or may be undefined.
   */
  type Maybe<T> = T | undefined;

  // Represents a tuple of two elements
  type Tuple<T1, T2 = T1> = [T1, T2];

  // Represents a tuple of three elements
  type Threeple<T1, T2 = T1, T3 = T2> = [T1, T2, T3];

  // Represents an object with frozen properties
  type FreezeProps<T> = {
    [Prop in keyof T as string extends Prop ? never : number extends Prop ? never : Prop]: T[Prop]
  };

  // Represents a deep-partial of an object
  type FullPartial<T> = {
    [P in keyof T]?: T[P] extends object ? FullPartial<T[P]> : T[P];
  };

  // Represents a mutable version of a readonly type
  type Mutable<T> = {
    -readonly [P in keyof T]: T[P];
  };

export type gsapConfig = gsap.TweenVars & {
  duration: number,
  targets: Record<string, JQuery | JQuery[]>
}

export interface GSAPEffect<Defaults extends gsap.TweenVars> {
  effect: (
    targets: gsap.TweenTarget,
    config: Defaults
  ) => gsap.core.Timeline | gsap.core.Tween,
  defaults: Defaults,
  extendTimeline?: boolean
}

  // Represents a gsap animation
  type gsapAnim = gsap.core.Tween | gsap.core.Timeline;

  // Represents a generic Blades document
  type EntityDoc = ActorDoc | ItemDoc;

  // Represents any Blades document sheet
  type EntitySheet = ActorSheetDoc | ItemSheetDoc;

  // Represents any document that can be the target of a BladesTargetLink subclass.
  type TargetLinkDoc = EntityDoc | ChatMessageDoc | UserDoc;

  // Represents a reference to a Blades document
  type DocRef = string | EntityDoc;

  // Represents a reference to a Blades actor
  type ActorRef = string | ActorDoc;

  // Represents a reference to a Blades item
  type ItemRef = string | ItemDoc;

  // Utility Types for Variable Template Values
  interface ValueMax {max: number, value: number}
  type NamedValueMax = ValueMax & {name: string};

  export declare function randomID(length?: number): IDString;
}
