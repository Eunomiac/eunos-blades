import {Attributes, Actions, District} from "../core/constants";
import BladesItem from "../blades-item";
import BladesActor from "../blades-actor";

declare global {
  // Generic Blades Document Type
  type BladesDoc = BladesActor | BladesItem;

  // Reference Types for Blades Documents
  type DocRef = string | BladesDoc;
  type ActorRef = string | BladesActor;
  type ItemRef = string | BladesItem;

  // Utility Types for Variable Template Values
  type ValueMax = { max: number, value: number };
  type NamedValueMax = ValueMax & { name: string };
  type RollableStat = Attributes | Actions;

  // Component Types for Sheets
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
}