/*
    export interface Clock_Keeper {
      scenes: Record<IDString, Record<NumString, BladesClockKeyData>>,
      targetScene: string | null
    }
*/

// import {ClockColor, ClockDisplayMode} from "../core/constants";

interface BladesClockKeyData {
  id: IDString,
  name: string,

  isVisible: boolean,
  isActive: boolean,
  isNameVisible: boolean,

  target: IDString|UUIDString|BladesDoc,
  targetKey?: TargetKey,
  targetFlagKey?: TargetFlagKey

  clocksData: Record<IDString, BladesClockData>,

  isShowingControls?: boolean,
  displayMode?: ClockKeyDisplayMode|number,
  sceneID?: IDString,
  oneKeyIndex: 1|2|3|4|5,
  overlayPosition?: number // Slot occupied by key when displayed in overlay
}

interface BladesClockData extends NamedValueMax {
  id: IDString,
  name: string,
  index: number, // Starting from '0', the sequence order of this clock in, e.g., a project with multiple clocks
  value: number,
  max: number,
  color: ClockColor,

  isVisible: boolean, // whether clock is visible at all
  isActive: boolean, //  true: This is the clock targeted by any rolls.
                     // false: Clock is complete or waiting on a preceding clock to finish.
  isNameVisible: boolean, // whether clock's name is displayed as a <label>
  isHighlighted: boolean, // whether background nova animation is displayed

  target: IDString|UUIDString|BladesDoc,
  targetKey?: TargetKey,
  targetFlagKey?: TargetFlagKey

  tooltip?: string,
  gm_notes?: string,

  isShowingControls?: boolean,
  sceneID?: IDString, // Regardless of where stored, will be displayed within a 1-key in the scene overlay
}

type BladesClockSystemData = BladesClockData & {target: UUIDString};

type BladesClockKeySystemData = BladesClockKeyData & {target: UUIDString, clocksData: Record<IDString, BladesClockSystemData> }