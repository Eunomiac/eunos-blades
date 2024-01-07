/* eslint-disable @typescript-eslint/no-unused-vars */
import U from "../core/utilities";
import C from "../core/constants";
import {BladesActor} from "../documents/BladesActorProxy";
import {BladesItem} from "../documents/BladesItemProxy";


class BladesTargetLink<Schema extends BladesTargetLink.UnknownSchema> {

  // #region STATIC METHODS ~

  /**
   * This static method applies defaults to any values missing from the class' data Schema.
   * 'Schema' is defined by subclasses to BladesTargetLink.
   * Subclasses must override this method to apply their own defaults.
   *
   * @template Schema - The data schema required by the subclass.
   * @param {Partial<Schema>} schemaData - Schema data overriding the defaults.
   * @returns {Schema} - The schema data with defaults applied.
   * @throws {Error} - Throws an error if this method is not overridden in a subclass.
   */
  static ApplySchemaDefaults<Schema extends BladesTargetLink.UnknownSchema>(
    this: BladesTargetLink.StaticThisContext<Schema>,
    schemaData: Partial<Schema>
  ): Schema {
    throw new Error("[BladesTargetLink.ApplySchemaDefaults] Static Method ApplySchemaDefaults must be overridden in subclass");
  }

  static ParseConfig<Schema extends BladesTargetLink.UnknownSchema>(
    this: BladesTargetLink.StaticThisContext<Schema>,
    config: BladesTargetLink.Config & Partial<Schema>
  ): BladesTargetLink.Data & Schema {

    // === VALIDATE CONFIG ===
    // - Confirm 'config' is proper primitive type
    if (!U.isSimpleObj(config)) {
      throw new Error(`[BladesTargetLink.ResolveConfigToData()] Config is Not a Simple Object: '${JSON.stringify(config)}'`);
    }

    // - Isolate BladesTargetLink.Config entries from unknown PartialSchema entries
    const {target, targetID, targetKey, targetFlagKey, ...schemaData} = config;

    // - Attempt to determine targetUUID from target/targetID
    const targetRef = target ?? targetID;
    // - ... Confirm target exists
    if (!targetRef) {
      throw new Error(`[BladesTargetLink.ResolveConfigToData()] Data Lacks ANY 'target' / 'targetID': '${JSON.stringify(config)}'`);
    }
    // - ... Convert to UUID
    let targetUUID: UUIDString | undefined;
    if (U.isDocUUID(targetRef)) {
      targetUUID = targetRef;
    } else if (U.isDocID(targetRef)) {
      // If it's a an ID (not a UUID), attempt to get UUID synchronously by checking most common collections:
      targetUUID = (game.actors.get(targetRef) ?? game.items.get(targetRef))?.uuid;
    } else {
      // If it's a Document, extract UUID directly.
      targetUUID = targetRef.uuid;
    }
    // - ... Confirm targetUUID
    if (!U.isDocUUID(targetUUID)) {
      throw new Error(`[BladesTargetLink.ResolveConfigToData()] Unable to find target from '${targetRef}`);
    }

    // - Confirm 'targetKey' or 'targetFlagKey' exists
    if (!(U.isTargetKey(targetKey) || U.isTargetFlagKey(targetFlagKey))) {
      throw new Error(`[BladesTargetLink.ResolveConfigToData()] Data Lacks valid 'targetKey' or 'targetFlagKey': '${JSON.stringify(config)}'`);
    }
    // - Confirm only one of 'targetKey' or 'targetFlagKey' provided, not both
    if (U.isTargetKey(targetKey) && U.isTargetFlagKey(targetFlagKey)) {
      throw new Error(`[BladesTargetLink.ResolveConfigToData()] Data has BOTH 'targetKey' and 'targetFlagKey': '${JSON.stringify(config)}'`);
    }

    // === APPLY SCHEMA DEFAULTS ===
    const schema = this.ApplySchemaDefaults<Schema>(schemaData as Partial<Schema>) as Schema;

    // === RETURN CONSTRUCTED DATA OBJECT ===
    return {
      ...schema,
      id: randomID() as IDString,
      targetID: targetUUID,
      targetKey,
      targetFlagKey
    };
  }

  static async InitTargetLink<Schema extends BladesTargetLink.UnknownSchema>(
    this: BladesTargetLink.StaticThisContext<Schema>,
    data: BladesTargetLink.Data & Schema
  ): Promise<BladesDoc> {
    // Validate target.
    const target = fromUuidSync(data.targetID);
    if (!target) {throw new Error(`[BladesTargetLink.InitTargetLink] No target found with UUID '${data.targetID}'`);}

    // Initialize server-side data on target.
    if (data.targetKey) {
      await target.update({[`${data.targetKey}.${data.id}`]: data});
    } else if (data.targetFlagKey) {
      await (target as BladesItem).setFlag(C.SYSTEM_ID, `${data.targetFlagKey}.${data.id}`, data);
    }
    return target;
  }

  static async Create<Schema extends BladesTargetLink.UnknownSchema>(
    this: BladesTargetLink.StaticThisContext<Schema>,
    config: BladesTargetLink.Config & Partial<Schema>
  ): Promise<BladesTargetLink<Schema> & BladesTargetLink.Subclass<Schema>> {
    const data = this.ParseConfig(config);
    eLog.checkLog2("BladesTargetLink.Create", "Config Parsed to Data", {config: U.objClone(config), data: U.objClone(data)});
    await this.InitTargetLink(data);
    eLog.checkLog3("BladesTargetLink.Create", "After Init Target Link", {data: U.objClone(data)});
    return new this(data) as BladesTargetLink<Schema> & BladesTargetLink.Subclass<Schema>;
  }
  // #endregion

  // #region GETTERS ~
  get isGM() {return game.user.isGM;}

  private _id: IDString;
  private _targetID: UUIDString;
  private _targetKey?: TargetKey;
  private _targetFlagKey?: TargetFlagKey;

  get id() {return this._id;}
  get targetID() {return this._targetID;}
  get targetKey(): TargetKey | undefined {return this._targetKey;}
  get targetKeyPrefix(): TargetKey | undefined {
    return this._targetKey
      ? `${this._targetKey}.${this.id}` as TargetKey
      : undefined;
  }
  get targetFlagKey(): TargetFlagKey | undefined {return this._targetFlagKey;}

  private _target: BladesDoc;
  get target(): BladesDoc {
    return this._target;
  }

  protected get linkData() {
    let linkData: (BladesTargetLink.Data & BladesTargetLink.UnknownSchema) | undefined;
    if (this.targetFlagKey) {
      linkData = this.target.getFlag("eunos-blades", `${this.targetFlagKey}.${this.id}`) as (BladesTargetLink.Data & BladesTargetLink.UnknownSchema) ?? undefined;
    } else if (this.targetKey) {
      linkData = getProperty(this.target, `${this.targetKey}.${this.id}`);
    }

    if (!linkData) {
      throw new Error("[BladesTargetLink.linkData] Error retrieving linkData.");
    }

    return linkData;
  }

  get data() {return this.linkData;}
  // #endregion

  // #region CONSTRUCTOR ~
  constructor(
    data: BladesTargetLink.Data & BladesTargetLink.UnknownSchema
  ) {
    const {id, targetID, targetKey, targetFlagKey} = data;
    if (!id || !targetID || !(targetKey || targetFlagKey)) {
      eLog.error("BladesTargetLink", "Bad Constructor Data", {data});
      throw new Error("[new BladesTargetLink()] Bad Constructor Data (see log)");
    }
    this._id = id;
    this._targetID = targetID;
    if (U.isTargetKey(targetKey)) {
      this._targetKey = targetKey;
    } else if (U.isTargetFlagKey(targetFlagKey)) {
      this._targetFlagKey = targetFlagKey;
    }
    const target = fromUuidSync(this.targetID);
    if (!target) {
      throw new Error(`[new BladesTargetLink()] Unable to resolve target from uuid '${this._targetID}'`);
    }
    this._target = target;
  }
  // #endregion

  // #region ASYNC UPDATE & DELETE METHODS ~
  async updateTarget(prop: string, val: unknown, isSilent = false) {
    if (this.targetFlagKey) {
      (this.target as BladesItem).setFlag("eunos-blades", `${this.targetFlagKey}.${this.id}.${prop}`, val);
    } else {
      this.target.update({[`${this.targetKey}.${this.id}.${prop}`]: val}, {render: !isSilent});
    }
  }

  async updateTargetData<T extends BladesTargetLink.UnknownSchema>(val: T | null, isSilent = false) {
    if (val === null) {
      if (this.targetFlagKey) {
        await (this.target as BladesItem).unsetFlag("eunos-blades", `${this.targetFlagKey}.${this.id}`);
      } else {
        await this.target.update({[`${this.targetKey}.-=${this.id}`]: null});
      }
    } else {
      // Add BladesTargetLink.Data to provided schema
      const linkData: BladesTargetLink.Data & T = {
        ...val,
        id: this.id,
        targetID: this.targetID,
        targetKey: this.targetKey,
        targetFlagKey: this.targetFlagKey
      };
      // Update target
      if (this.targetFlagKey) {
        await (this.target as BladesItem).setFlag("eunos-blades", `${this.targetFlagKey}.${this.id}`, linkData);
      } else {
        await this.target.update({[`${this.targetKey}.${this.id}`]: linkData}, {render: !isSilent});
      }
    }
  }

  async delete() {
    await this.updateTargetData(null);
  }
  // #endregion
}


export default BladesTargetLink;
