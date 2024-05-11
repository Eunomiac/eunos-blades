import {AttributeTrait, ActionTrait, District} from "../core/constants";

declare global {

  type RollableStat = AttributeTrait | ActionTrait;

  // Component Types for Sheets
  interface BladesSelectOption<displayType, valueType = string> {
    value: valueType,
    display: displayType
  }

  interface BladesCompData {
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
  interface BladesDotlineData {
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
  interface BladesRandomizer<T extends string = string> {isLocked: boolean, value: T}

  // Claims Data for Turf Representation
  interface BladesClaimData {
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