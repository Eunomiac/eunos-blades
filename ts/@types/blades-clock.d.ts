/*
    export interface Clock_Keeper {
      scenes: Record<IDString, Record<NumString, BladesClockKeyData>>,
      targetScene: string | null
    }
*/

interface BladesClockKeyData {
  id: IDString,
  name: string,
  size: 1|2|3|4|5|6,

  isVisible: boolean,
  isActive: boolean,
  isNameVisible: boolean,

  target: string|BladesDoc,
  targetKey?: string,
  targetFlagKey?: string

  clocksData: Record<IDString, BladesClockData>
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

  target: string|BladesDoc,
  targetKey?: string,
  targetFlagKey?: string

  tooltip?: string,
  gm_notes?: string
}

type BladesClockSystemData = BladesClockData & {target: string};

type BladesClockKeySystemData = BladesClockKeyData & {clocksData: Record<IDString, BladesClockSystemData> }