import { ClockColor } from "../core/constants";
import { BladesClockKey } from "../classes/BladesClockKey";

declare global {

  namespace BladesClockKey {

    export type Schema = {
      name: string,

      isVisible: boolean,
      isActive: boolean,
      isNameVisible: boolean,
      isShowingControls: boolean,

      clocksData: Record<IDString, BladesClock.Data>,

      displayMode: ClockKeyDisplayMode|number,
      oneKeyIndex: 1|2|3|4|5

      sceneID: IDString|false, // Regardless of where stored, will be displayed within a 1-key in the scene overlay
      overlayPosition?: gsap.Point2D // Where in overlay key-container is positioned, if in overlay
      tier?: ValueMax
    }

    export type Config = BladesTargetLink.Config & Partial<Schema>;

    export type Data = BladesTargetLink.Data & Schema;

    export interface Subclass extends BladesTargetLink.Subclass<Schema> {
      clocks: Collection<BladesClock>
    }
  }

  namespace BladesClock {

    export type Schema = NamedValueMax & {
      color: ClockColor,

      isVisible: boolean, // whether clock is visible at all
      isActive: boolean, //  true: This is the clock targeted by any rolls.
                         // false: Clock is complete or waiting on a preceding clock to finish.
      isNameVisible: boolean, // whether clock's name is displayed as a <label>
      isHighlighted: boolean, // whether background nova animation is displayed
      isShowingControls: boolean,

      sceneID: IDString|false, // Regardless of where stored, will be displayed within a 1-key in the scene overlay

      parentKeyID: IDString, // Must be associated with a clock key (size 1, by default); key can display clock on its own
      index: 0|1|2|3|4|5, // Location within clock key, starting at 0

      tooltip?: string,
      gm_notes?: string,
      tier?: ValueMax
    }

    export type Config = BladesTargetLink.Config & Partial<Schema>
      & Required<Pick<Schema, "parentKeyID">>;

    export type Data = BladesTargetLink.Data & Schema;

    export interface Subclass extends BladesTargetLink.Subclass<Schema> {
      parentKey: BladesClockKey;
    }
  }
}