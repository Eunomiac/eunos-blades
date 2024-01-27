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

    export type Config = {
      target?: IDString|UUIDString|BladesDoc|BladesChat|User,
      targetID?: IDString|UUIDString,
      targetKey?: TargetKey,
      targetFlagKey?: TargetFlagKey
    }

    export type Data = {
      id: IDString,
      targetID: UUIDString,
      targetKey?: TargetKey,
      targetFlagKey?: TargetFlagKey
    }

    export type Instance = Data & {
      target: BladesDoc|BladesChat|User
    }

    export interface Subclass<Schema> extends Instance {

      data: Data & Schema,

      async delete()

      async updateTarget(prop: string, val: unknown)

      async updateTargetData(val: Schema|null)

      elem?: HTMLElement
    }
  }
}