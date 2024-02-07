import { BladesActorType, Tag, District, AttributeTrait, ActionTrait, AdvancementPoint } from "../core/constants";
import BladesActor from "../BladesActor";
import BladesPC from "../documents/actors/BladesPC";
import BladesNPC from "../documents/actors/BladesNPC";
import BladesFaction from "../documents/actors/BladesFaction";
import BladesCrew from "../documents/actors/BladesCrew";
import BladesTargetLink from "../classes/BladesTargetLink";
import BladesChat from "../classes/BladesChat";


declare global {

  type targetingKeys = {targetKey: TargetKey} | {targetFlagKey: TargetFlagKey};

  namespace BladesTargetLink {

    export type StaticThisContext<Schema> = typeof BladesTargetLink
      & (new (data: Data & Schema) => BladesTargetLink & Subclass<Schema>);

    export type LinkData = {
      targetID: UUIDString,
      targetKey: TargetKey
    } | {
      targetID: UUIDString,
      targetFlagKey: TargetFlagKey
    };

    export type Data = LinkData & {
      id: IDString,
      isScopingById: boolean
    };

    export type Config = ({
      target: IDString|UUIDString|BladesDoc|BladesChat|User
    } | {
      targetID: IDString|UUIDString
    }) & ({
      targetKey: TargetKey
    } | {
      targetFlagKey: TargetFlagKey
    }) & {
      id?: IDString,
      isScopingById?: boolean,
      template?: string
    };

    export type PartialConfig = {
      target?: IDString|UUIDString|BladesDoc|BladesChat|User,
      targetID?: IDString|UUIDString,
      targetKey?: TargetKey,
      targetFlagKey?: TargetFlagKey,
      isScopingById?: boolean,
      template?: string
    };

    export type PartialData = {
      id: IDString,
      targetID: UUIDString,
      targetKey?: TargetKey,
      targetFlagKey?: TargetFlagKey,
      isScopingById: boolean,
      template?: string
    }

    export type Instance = Data & {
      target: BladesDoc|BladesChat|User
    }

    export interface Subclass<Schema> extends Instance {

      data: Data & Schema,

      async delete(collection: Collection | false, waitFor?: Promise<unknown>|gsapAnim)

      async updateTarget(prop: string, val: unknown, waitFor?: Promise<unknown>|gsapAnim)

      async updateTargetData(val: Partial<Schema>|null, waitFor?: Promise<unknown>|gsapAnim)

      elem?: HTMLElement
    }
  }
}