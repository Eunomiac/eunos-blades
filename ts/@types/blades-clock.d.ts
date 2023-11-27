// declare global {



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