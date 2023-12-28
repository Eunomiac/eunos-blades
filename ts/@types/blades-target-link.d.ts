import { BladesActorType, Tag, District, AttributeTrait, ActionTrait, AdvancementPoint } from "../core/constants";
import BladesActor from "../BladesActor";
import BladesPC from "../documents/actors/BladesPC";
import BladesNPC from "../documents/actors/BladesNPC";
import BladesFaction from "../documents/actors/BladesFaction";
import BladesCrew from "../documents/actors/BladesCrew";
import BladesTargetLink from "../classes/BladesTargetLink";


declare global {

  type targetingKeys = {targetKey: TargetKey} | {targetFlagKey: TargetFlagKey};

  namespace BladesTargetLink {

    export type UnknownSchema = Record<any, any>;

    export type StaticThisContext<Schema extends UnknownSchema> = typeof BladesTargetLink
      & (new (data: Data & Schema) => BladesTargetLink & Subclass<Schema>);

    export type Config = {
      target?: IDString|UUIDString|BladesDoc,
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
      target: BladesDoc
    }

    export interface Subclass<Schema extends UnknownSchema> extends Instance {

      data: Data & Schema,

      async delete()

      getTargetProp(prop: string): unknown

      async updateTarget(prop: string, val: unknown)

      async updateTargetData(val: Schema|null)

      elem?: HTMLElement
    }
  }
}