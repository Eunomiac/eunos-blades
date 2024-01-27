/* eslint-disable @typescript-eslint/no-unused-vars */
import U from "../core/utilities";
import C from "../core/constants";
import {BladesActor} from "../documents/BladesActorProxy";
import {BladesItem} from "../documents/BladesItemProxy";
import BladesChat from "./BladesChat";
import type {AnyDocumentData} from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/abstract/data.mjs.d.ts";

class BladesTargetLink<Schema> {

  // #region STATIC METHODS ~

  static IsValidConfig(ref: unknown): ref is BladesTargetLink.Config {
    return U.isSimpleObj(ref)
    && (U.isDocID(ref.target)
        || U.isDocUUID(ref.target)
        || U.isDocUUID(ref.targetID)
        || ref.target instanceof BladesActor
        || ref.target instanceof BladesItem
        || ref.target instanceof BladesChat
        || ref.target instanceof User
    )
    && (U.isTargetKey(ref.targetKey) || U.isTargetFlagKey(ref.targetFlagKey))
    && !(U.isTargetKey(ref.targetKey) && U.isTargetFlagKey(ref.targetFlagKey));
  }

  static IsValidData(ref: unknown): ref is BladesTargetLink.Data {
    return U.isSimpleObj(ref)
      && U.isDocID(ref.id)
      && U.isDocUUID(ref.targetID)
      && (U.isTargetKey(ref.targetKey) || U.isTargetFlagKey(ref.targetFlagKey))
      && !(U.isTargetKey(ref.targetKey) && U.isTargetFlagKey(ref.targetFlagKey));
  }

  /**
   * Parses the configuration object to construct a data object for BladesTargetLink.
   * It validates the config object, isolates BladesTargetLink.Config entries from unknown PartialSchema entries,
   * determines the targetUUID from target/targetID, confirms the existence of 'targetKey' or 'targetFlagKey',
   * applies schema defaults, and constructs the final data object to be returned.
   *
   * @template Schema - The data schema required by the subclass.
   * @param {BladesTargetLink.Config & Partial<Schema>} config - The configuration object containing potential BladesTargetLink properties and any subclass-specific schema data.
   * @returns {BladesTargetLink.Data & Schema} - The constructed data object with defaults applied and necessary properties for BladesTargetLink.
   * @throws {Error} - Throws an error if the config object is not a simple object, if it lacks a target reference, if it lacks a valid 'targetKey' or 'targetFlagKey', or if both 'targetKey' and 'targetFlagKey' are provided.
   */
  static #ParseConfig<Schema>(
    this: BladesTargetLink.StaticThisContext<Schema>,
    config: (BladesTargetLink.Config | BladesTargetLink.Data) & Partial<Schema>
  ): BladesTargetLink.Data & Partial<Schema> {

    if (this.IsValidData(config)) { return this.ParseConfig(config); }

    // === VALIDATE CONFIG ===
    // - Confirm 'config' is proper primitive type
    if (!U.isSimpleObj(config)) {
      throw new Error(`[BladesTargetLink.ResolveConfigToData()] Config is Not a Simple Object: '${JSON.stringify(config)}'`);
    }

    // - Isolate BladesTargetLink.Config entries from unknown PartialSchema entries
    const {target, targetID, targetKey, targetFlagKey, ...schemaData} = config;
    const partialSchema = schemaData as Partial<Schema>;

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
    } else if (typeof targetRef.uuid === "string") {
      // If it's a Document, extract UUID directly.
      targetUUID = targetRef.uuid as UUIDString;
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

    // === RETURN CONSTRUCTED DATA OBJECT ===
    // Pass it through public ParseConfigData static method,
    // So subclasses can override it to incorporate their own logic.

    return this.ParseConfig<Schema>({
      ...partialSchema,
      id: randomID() as IDString,
      targetID: targetUUID,
      targetKey,
      targetFlagKey
    });
  }

  /** Subclasses can override this method to include their own parse logic */
  static ParseConfig<Schema>(
    data: (BladesTargetLink.Config | BladesTargetLink.Data) & Partial<Schema>
  ): BladesTargetLink.Data & Partial<Schema> {
    /* Subclasses can override with custom logic here;
        if they don't, the default parsed config is returned */
    if (BladesTargetLink.IsValidData(data)) {
      return data;
    }
    return this.#ParseConfig(data);
  }

  static PartitionSchemaData<Schema>(
    data: BladesTargetLink.Data & Partial<Schema>
  ): BladesTargetLink.Data & {partialSchema: Partial<Schema>} {
    const {id, targetID, targetKey, targetFlagKey, ...schemaData} = data;
    if (!id || !targetID || !(targetKey || targetFlagKey)) {
      eLog.error("BladesTargetLink", "Bad Constructor Data", {data});
      throw new Error("[new BladesTargetLink()] Bad Constructor Data (see log)");
    }
    return {id, targetID, targetKey, targetFlagKey, partialSchema: schemaData as Partial<Schema>};
  }

  static #ApplySchemaDefaults<Schema>(
    this: BladesTargetLink.StaticThisContext<Schema>,
    schemaData: Partial<Schema>,
    linkData: BladesTargetLink.Data
  ): Schema {
    return this.ApplySchemaDefaults(schemaData, linkData);
  }

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
  static ApplySchemaDefaults<Schema>(
    this: BladesTargetLink.StaticThisContext<Schema>,
    schemaData: Partial<Schema>,
    linkData: BladesTargetLink.Data
  ): Schema {
    throw new Error("[BladesTargetLink.ApplySchemaDefaults] Static Method ApplySchemaDefaults must be overridden in subclass");
  }

  /**
   * Creates a new instance of BladesTargetLink and initializes it with the provided configuration.
   * The configuration is parsed into a data object which is then used to initialize the target link.
   * The function logs the parsed data for debugging purposes.
   *
   * @template Schema - The schema type parameter that extends the data structure.
   * @param {BladesTargetLink.Config & Partial<Schema>} config - The configuration object containing both the target link configuration and the schema configuration.
   *
   * @returns {Promise<BladesTargetLink<Schema> & BladesTargetLink.Subclass<Schema>>} - A promise that resolves to a new instance of BladesTargetLink, initialized with the provided data.
   *
   * @throws {Error} - Throws an error if the initialization of the target link fails.
   */
  static async Create<Schema>(
    this: new (config: BladesTargetLink.Config & Partial<Schema>) => BladesTargetLink<Schema>,
    config: BladesTargetLink.Config & Partial<Schema>
  ) {
    const tLink = new this(config);
    await tLink.initTargetLink();
    return tLink;
  }
  // #endregion

  // #region GETTERS ~
  get isGM() {return game.user.isGM;}

  private _id: IDString;
  private _targetID: UUIDString;
  private _targetKey?: TargetKey;
  private _targetFlagKey?: TargetFlagKey;
  private _initialSchema: Schema;

  get id() {return this._id;}
  get targetID() {return this._targetID;}
  get targetKey(): TargetKey | undefined {return this._targetKey;}
  get targetKeyPrefix(): TargetKey | undefined {
    return this._targetKey
      ? `${this._targetKey}.${this.id}` as TargetKey
      : undefined;
  }
  get targetFlagKey(): TargetFlagKey | undefined {return this._targetFlagKey;}
  get targetFlagKeyPrefix(): TargetFlagKey | undefined {
    return this.targetFlagKey
      ? `${this.targetFlagKey}.${this.id}` as TargetFlagKey
      : undefined;
  }
  get linkData(): BladesTargetLink.Data {
    return {
      id: this.id,
      targetID: this.targetID,
      targetKey: this.targetKey,
      targetFlagKey: this.targetFlagKey
    };
  }
  get initialSchema(): Schema { return this._initialSchema; }

  private _target: BladesLinkDoc;
  get target(): BladesLinkDoc {
    return this._target;
  }

  protected get localData(): BladesTargetLink.Data & Schema {
    if (this._target) {
      return this.data;
    }
    return {
      ...this.initialSchema,
      id: this.id,
      targetID: this.targetID,
      targetKey: this.targetKey,
      targetFlagKey: this.targetFlagKey
    };
  }

  get data(): BladesTargetLink.Data & Schema {
    type TargetData = BladesTargetLink.Data & Schema;
    if (this._target) {
      let data: TargetData | undefined;
      if (this.targetFlagKeyPrefix) {
        data = this.target.getFlag(C.SYSTEM_ID, this.targetFlagKeyPrefix) as TargetData | undefined;
      } else if (this.targetKeyPrefix) {
        data = getProperty(this.target, this.targetKeyPrefix);
      }

      if (!data) {
        throw new Error("[BladesTargetLink.data] Error retrieving data.");
      }

      return data;
    } else {
      eLog.warn("BladesTargetLink", "Attempt to access data of uninitiated BladesTargetLink: Returning local data only.", {bladesTargetLink: this, localData: this.localData});
      return this.localData;
    }
  }
  // #endregion

  // #region CONSTRUCTOR ~
  constructor(config: BladesTargetLink.Config & Partial<Schema>)
  constructor(data: BladesTargetLink.Data)
  constructor(dataOrConfig: BladesTargetLink.Config & Partial<Schema> | BladesTargetLink.Data) {

    let linkData: BladesTargetLink.Data;
    let schema: Schema;

    // First, we construct the link data from the config or data object.
    if (BladesTargetLink.IsValidData(dataOrConfig)) {

      // If a simple link data object was provided, acquire the schema from the source document
      linkData = {
        id: dataOrConfig.id,
        targetID: dataOrConfig.targetID,
        targetKey: dataOrConfig.targetKey,
        targetFlagKey: dataOrConfig.targetFlagKey
      };
      const target = fromUuidSync(dataOrConfig.targetID);
      if (!target) {
        throw new Error(`[new BladesTargetLink()] Unable to resolve target from uuid '${dataOrConfig.targetID}'`);
      }

      if (dataOrConfig.targetKey) {
        schema = getProperty(target, `${dataOrConfig.targetKey}.${dataOrConfig.id}`);
      } else {
        schema = target.getFlag(C.SYSTEM_ID, `${dataOrConfig.targetFlagKey}.${dataOrConfig.id}`) as Schema;
      }
    } else {
      // Otherwise, we have to parse the config into a data object, and extract any schema data
      // First we convert the config object to a BladesTargetLink.Data & Partial<Schema> object.
      const partialData: BladesTargetLink.Data & Partial<Schema> = BladesTargetLink.#ParseConfig(dataOrConfig);

      // Next, we partition the data into the target link data and the schema data.
      const {id, targetID, targetKey, targetFlagKey, partialSchema} = BladesTargetLink.PartitionSchemaData(partialData);

      // Now we construct the data object
      linkData = {id, targetID, targetKey, targetFlagKey};

      // And apply any schema defaults to the provided schema data.
      schema = BladesTargetLink.#ApplySchemaDefaults(partialSchema, linkData);
    }

    this._id = linkData.id;
    this._targetID = linkData.targetID;
    this._targetKey = linkData.targetKey;
    this._targetFlagKey = linkData.targetFlagKey;

    const target = fromUuidSync(this.targetID);
    if (!target) {
      throw new Error(`[new BladesTargetLink()] Unable to resolve target from uuid '${this._targetID}'`);
    }
    this._target = target;

    this._initialSchema = schema;
  }
  // #endregion

  // #region ASYNC UPDATE & DELETE METHODS ~
  private getDotKeyToProp(prop: string|number|undefined, isNullifying = false): string {
    if (this.targetKeyPrefix) {
      if (prop === undefined) {
        return isNullifying ? `${this.targetKey}.-=${this.id}` : this.targetKeyPrefix;
      }
      return `${this.targetKeyPrefix}.${isNullifying ? "-=" : ""}${prop}`;
    }
    if (this.targetFlagKeyPrefix) {
      if (prop === undefined) {
        return this.targetFlagKeyPrefix;
      }
      return `${this.targetFlagKeyPrefix}.${prop}`;
    }
    throw new Error("[BladesTargetLink.getDotKeyToProp()] Missing 'targetKeyPrefix' and 'targetFlagKeyPrefix'");
  }

  private getFlagParamsToProp(prop: string|number|undefined) {
    return [C.SYSTEM_ID, this.getDotKeyToProp(prop)] as const;
  }

  private async updateTargetFlag(prop: string|number|undefined, val: unknown) {
    if (!this.targetFlagKeyPrefix) { return; }
    if (val === null) {
      await this.target.unsetFlag(...this.getFlagParamsToProp(prop));
    } else if (this.target instanceof BladesActor) {
      await this.target.setFlag(...this.getFlagParamsToProp(prop), val);
    } else if (this.target instanceof BladesItem) {
      await this.target.setFlag(...this.getFlagParamsToProp(prop), val);
    } else if (this.target instanceof User) {
      await this.target.setFlag(...this.getFlagParamsToProp(prop), val);
    } else if (this.target instanceof BladesChat) {
      await this.target.setFlag(...this.getFlagParamsToProp(prop), val);
    }
  }

  private async updateTargetKey(prop: string|undefined, val: unknown) {
    if (!this.targetKeyPrefix) { return; }
    await this.target.update({[this.getDotKeyToProp(prop, val === null)]: val}, {render: false});
  }

  /**
   * Initializes a target link by updating the target's data with the provided data object.
   * If a targetKey is provided, the data is updated directly on the target.
   * If a targetFlagKey is provided, the data is set as a flag on the target.
   *
   * This method need only be run once, when the document is first created and its data must be written to server storage.
   * TargetLink documents whose data already exists in server storage can be constructed directly (i.e. new BladesTargetLink(data))
   *
   * @param {BladesTargetLink.Data & Schema} data - The combined data object containing both the target link data and the schema data.
   * @returns {Promise<void>} - A promise that resolves when the server update is complete.
   */
  async initTargetLink() {
    // Construct data object
    const data: BladesTargetLink.Data & Schema = {
      id: this.id,
      targetID: this.targetID,
      targetKey: this.targetKey,
      targetFlagKey: this.targetFlagKey,
      ...this.initialSchema
    };

    // Initialize server-side data on target.
    if (data.targetKey) {
      await this.target.update({[`${data.targetKey}.${data.id}`]: data});
    } else if (data.targetFlagKey) {
      await (this.target as BladesItem).setFlag(C.SYSTEM_ID, `${data.targetFlagKey}.${data.id}`, data);
    }
  }

  async updateTarget(prop: string, val: unknown, isSilent = false) {
    if (getProperty(this.data, prop) === val) { return; }
    if (this.targetFlagKeyPrefix) {
      await this.updateTargetFlag(prop, val);
    } else if (this.targetKeyPrefix) {
      await this.updateTargetKey(prop, val);
    }
  }

  async updateTargetData(val: Partial<Schema> | null, isSilent = false) {
    if (val) {
      // Add BladesTargetLink.Data to provided schema
      val = {
        ...val,
        id: this.id,
        targetID: this.targetID,
        targetKey: this.targetKey,
        targetFlagKey: this.targetFlagKey
      };
    }
    if (this.targetFlagKeyPrefix) {
      await this.updateTargetFlag(undefined, val);
    } else {
      await this.updateTargetKey(undefined, val);
    }
  }

  async delete() {
    await this.updateTargetData(null);
  }
  // #endregion
}


export default BladesTargetLink;
