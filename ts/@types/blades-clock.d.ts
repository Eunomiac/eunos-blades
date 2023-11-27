// declare global {

  type BladesClockData = {
    id: string,
    display: string,
    value: number,
    max: number,
    color: string,
    isActive: boolean,
    isNameVisible: boolean,
    isVisible: boolean,
    scene?: string,
    target?: string,
    flagTarget?: string,
    gm_notes?: string
  }

  type BladesMultiClockData = {
    id: string,
    display: string,
    clocks: Record<string, BladesClockData>,
    isActive: boolean,
    isNameVisible: boolean,
    isVisible: boolean,
    scene: string
  }
// }