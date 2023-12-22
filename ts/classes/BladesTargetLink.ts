import C, {BladesActorType, BladesItemType, ClockColor, ClockKeyDisplayMode, Factor} from "../core/constants";
import {Observer, Dragger} from "../core/gsap";
import U from "../core/utilities";
import {BladesActor} from "../documents/BladesActorProxy";
import {BladesItem} from "../documents/BladesItemProxy";
import BladesRoll from "./BladesRoll";

declare global {
  namespace BladesTargetLink {

    export interface Config {
      id?: IDString,
      target: IDString | BladesDoc | UUIDString,
      targetKey?: TargetKey,
      targetFlagKey?: TargetFlagKey
    }

    export type Schema = Config & { target: UUIDString }
  }
}

class BladesTargetLink {

  protected static validateConfig<T = BladesTargetLink.Config>(ref: unknown):
    ref is T & {id: IDString} {
    // Check if 'ref' is a simple object literal
    if (!U.isSimpleObj(ref)) {return false;}
    // Confirm a target key or flag key has been provided.
    if (!U.isTargetKey(ref.targetKey) && !U.isTargetFlagKey(ref.targetFlagKey)) {return false;}
    // Confirm a target has been provided, and that it can be resolved to a Document entity.
    if (!ref.target) {return false;}
    if (U.isDocUUID(ref.target)) {
      ref.target = fromUuid(ref.target);
    }
    if (U.isDocID(ref.target)) {
      // Convert string id of target to target Document
      ref.target = game.actors.get(ref.target) ?? game.items.get(ref.target);
    }
    if (!(ref.target instanceof Actor || ref.target instanceof Item)) {return false;}
    // Create a random ID if one not provided.
    if (!ref.id) {ref.id = randomID();}
    return true;
  }

  _id: string;

  _targetID: string;

  get targetID() {return this._targetID;}

  _target: BladesDoc;

  get target(): BladesDoc {return this._target;}

  _targetKey: TargetKey = "system" as TargetKey;

  get targetKey(): TargetKey {return this._targetKey;}

  _targetFlagKey?: TargetFlagKey;

  get targetFlagKey(): TargetFlagKey | undefined {return this._targetFlagKey;}

  constructor(config: BladesTargetLink.Config) {
    if (!BladesTargetLink.validateConfig(config)) {
      eLog.error("[new BladesTargetLink] Bad Config File.", config);
      throw new Error("See log.");
    }

    const {id, target, targetKey, targetFlagKey} = config;
    this._id = id;
    this._target = target as BladesDoc;
    this._targetID = this.target.id;
    if (U.isTargetKey(targetKey)) {
      this._targetKey = targetKey;
    }
    if (U.isTargetFlagKey(targetFlagKey)) {
      this._targetFlagKey = targetFlagKey;
    }
  }

  getSystemData() {
    if (this.targetFlagKey) {
      return this.target.getFlag("eunos-blades", `${this.targetFlagKey}.${this._id}`);
    }
    return getProperty(this.target, `${this.targetKey}.${this._id}`) ?? {};
  }

  get id() {return this._id as IDString;}

  get name(): string {return this.getSystemData().name;}

  getTargetProp(prop: string): unknown {
    return this.getSystemData()[prop];
  }

  async updateTarget(prop: string, val: unknown) {
    if (this.targetFlagKey) {
      (this.target as BladesItem).setFlag("eunos-blades", `${this.targetFlagKey}.${this._id}.${prop}`, val);
    } else {
      this.target.update({[`${this.targetKey}.${this._id}.${prop}`]: val});
    }
  }

  async updateTargetData(val: unknown) {
    if (this.targetFlagKey) {
      if (val === null) {
        return (this.target as BladesItem).unsetFlag("eunos-blades", `${this.targetFlagKey}.${this._id}`);
      } else {
        return (this.target as BladesItem).setFlag("eunos-blades", `${this.targetFlagKey}.${this._id}`, val);
      }
    } else if (val === null) {
      return this.target.update({[`${this.targetKey}.-=${this._id}`]: null});
    } else {
      return this.target.update({[`${this.targetKey}.${this._id}`]: val});
    }
  }

  async delete(): Promise<unknown> {
    return this.updateTargetData(null);
  }
}


export default BladesTargetLink;
