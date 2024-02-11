import {AttributeTrait, ConsequenceType, Position, Effect, RollResult} from "../core/constants";
import {BladesPC} from "../documents/BladesActorProxy";
import BladesTargetLink from "../classes/BladesTargetLink";
/**
export enum ConsequenceType {
  ReducedEffect
  ComplicationMinor
  ComplicationMajor
  ComplicationSerious
  LostOpportunity
  WorsePosition
  InsightHarm1
  InsightHarm2
  InsightHarm3
  InsightHarm4
  ProwessHarm1
  ProwessHarm2
  ProwessHarm3
  ProwessHarm4
  ResolveHarm1
  ResolveHarm2
  ResolveHarm3
  ResolveHarm4
  None = "None"
}
 */

declare global {

  namespace BladesConsequence {

    export type ResistanceType = "resist"|"armor"|"special";

    export type DisplayType = "base"|"accept"|ResistanceType;

    export type Schema = {
      name: string,
      type: ConsequenceType,
      rollData?: BladesRoll.Data,

      isAccepted?: boolean,
        acceptanceMode?: DisplayType,
      wasResisted?: boolean,
        resistanceMode?: ResistanceType,

      primaryID: UUIDString, // ID of PrimaryDoc who can resist this consequence

      resistSchema?: Schema,
      parentCsqID?: IDString,


      canResistWithRoll?: boolean,
      resistWithRollNegates?: boolean,
      attribute?: AttributeTrait,
      attributeVal?: number,

      canResistWithArmor?: boolean,
      resistWithArmorNegates?: boolean,

      canResistWithSpecial?: boolean,
      resistWithSpecialNegates?: boolean,
      specialFooterMsg?: string
    }

    export type Config = BladesTargetLink.Config & Partial<Schema>;

    export type Data = BladesTargetLink.Data & Schema;

    export interface Context extends Data {
      typeDisplay: string,
      icon: string,

      pc: BladesPC,

      resistTo?: BladesConsequence,
      armorTo?: BladesConsequence,
      specialTo?: BladesConsequence
    }
  }
}