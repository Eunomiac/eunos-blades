import {AttributeTrait, ConsequenceType, Position, Effect, RollResult} from "../core/constants";
import {BladesPC} from "../documents/BladesActorProxy";
import BladesTargetLink from "../classes/BladesTargetLink";
/**
 * @file This file contains the type definitions for the BladesConsequence class and related entities.
 *
 * @description This module contains the type definitions for the BladesConsequence class and related entities.
 */

declare global {

  namespace BladesConsequence {

    export type ResistanceType = "resist"|"armor"|"special";

    export type DisplayType = "base"|"accept"|ResistanceType;

    export type Schema = {
      name: string,
      type: ConsequenceType,
      rollData?: BladesRoll.FlagData,

      isAccepted: boolean,
        acceptanceMode?: DisplayType,

      pcId: IDString, // ID of character who can resist this consequence

      attribute?: AttributeTrait,
      attributeVal?: number,

      resistTo?: Data,
      armorTo?: Data,
      specialTo?: Data,
      footerMsg?: string
    }

    export type Config = BladesTargetLink.Config & Partial<Schema>;

    export interface Data extends BladesTargetLink.Data, Schema {};

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