import {ClockColor} from "../core/constants";
import {BladesClockKey} from "../classes/BladesClockKey";

declare global {

  type ClockKeySize = 0|1|2|3|4|5|6;
  type ClockIndex = 0|1|2|3|4|5;
  type OneKeyImgIndex = 0|1|2|3|4;

  namespace BladesClockKey {

    export type Schema = {
      name: string,

      isVisible: boolean,
      isNameVisible: boolean,
      isSpotlit: boolean,

      clocksData: Record<IDString, BladesClock.Data>,

      displayMode: ClockKeyDisplayMode|number,
      oneKeyIndex: OneKeyImgIndex

      sceneIDs: IDString[],
      overlayPosition?: Record<IDString, gsap.Point2D>
    }

    export type Config = BladesTargetLink.Config & Partial<Schema>;

    export type Data = BladesTargetLink.Data & Schema;

    export interface Subclass extends BladesTargetLink.Subclass<Schema>,
      Pick<Schema, "name" | "isVisible" | "isNameVisible" | "isSpotlit" | "displayMode" | "oneKeyIndex" | "sceneIDs" | "overlayPosition"> {
      clocks: Collection<BladesClock>
    }
  }

  namespace BladesClock {

    export type Schema = NamedValueMax & {
      color: ClockColor,

      isVisible: boolean, // whether clock is visible at all
      isActive: boolean, //  true: This clock is 'live' and its value can be changed.
                         // false: Clock is dormant, either completed or yet to start.
      isNameVisible: boolean, // whether clock's name is displayed as a <label>
      isHighlighted: boolean, // whether background nova animation is displayed

      parentKeyID: IDString, // Must be associated with a clock key (size 1, by default); key can display clock on its own
      index: ClockIndex, // Location within clock key, starting at 0
    }

    export type Config = {parentKey: BladesClockKey} & Partial<Schema>;

    export type Data = BladesTargetLink.Data & Schema;

    export interface Subclass extends BladesTargetLink.Subclass<Schema> {
      parentKey: BladesClockKey;
    }
  }
}