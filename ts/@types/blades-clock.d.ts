// declare global {

  type BladesClockData = {
    title: string,
    tooltip?: string,
    target?: string,
    value: number,
    max: number,
    color: string,
    scene?: string,
    isClockVisible?: boolean,
    isTitleVisible?: boolean,
    isFocused?: boolean
  }

  type BladesMultiClockData = {
    title: string,
    clocks: Record<number, BladesClockData>,
    isKeyVisible?: boolean,
    isTitleVisible?: boolean,
    isFocused?: boolean,
    scene: string
  }
// }