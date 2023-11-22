import {AttributeTrait, ConsequenceType, Position, Effect, RollResult} from "../core/constants";

/**
 * @file This file contains the type definitions for the BladesConsequence class and related entities.
 *
 * @description This module contains the type definitions for the BladesConsequence class and related entities.
 */

declare global {

  namespace BladesConsequence {

    export type ResistanceType = "resist"|"armor"|"specialArmor";

    export namespace Data {

      export interface Base {
        id: string,
        name: string,
        type: ConsequenceType,
        isAccepted?: boolean
      }

      export interface Main extends Base {
        chatID: string,
        userID: string,
        rollID: string,
        primaryID: string,
        primaryType: BladesRoll.PrimaryDocType,
        position: Position,
        effect: Effect,
        result: RollResult.partial|RollResult.fail
      }

      interface Resistable extends Main {
        attribute?: AttributeTrait,
        attributeVal?: number,
        resistTo?: Base,
        armorTo?: Base,
        specialTo?: Base,
        footerMsg?: string
      }

      export interface Accepted extends Main {
        isAccepted: true
      }
    }

    export namespace ParsedData {

      export interface Main extends Data.Main {
        typeDisplay: string,
        icon: string
      }
    }
  }
}