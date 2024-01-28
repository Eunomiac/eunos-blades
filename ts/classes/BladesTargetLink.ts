/* eslint-disable @typescript-eslint/no-unused-vars */
import U from "../core/utilities";
import C from "../core/constants";
import {BladesActor} from "../documents/BladesActorProxy";
import {BladesItem} from "../documents/BladesItemProxy";
import BladesChat from "./BladesChat";
import type {AnyDocumentData} from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/abstract/data.mjs.d.ts";

type PartitionSchemaDataReturnType<T> = T extends BladesTargetLink.PartialData
  ? {linkData: BladesTargetLink.Data}
  : {linkConfig: BladesTargetLink.Config};

class BladesTargetLink<Schema> {

  // #region STATIC METHODS ~

  static readonly ValidTargetClasses = [
    BladesActor,
    BladesItem,
    BladesChat,
    User
  ] as const;

  static IsValidConfig(ref: unknown): ref is BladesTargetLink.Config {
    return U.isSimpleObj(ref)
    && (U.isDocID(ref.target)
        || U.isDocUUID(ref.target)
        || U.isDocID(ref.targetID)
        || U.isDocUUID(ref.targetID)
        || this.ValidTargetClasses.some((cls) => ref.target instanceof cls)
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

  static BuildLinkConfig(partialConfig: BladesTargetLink.PartialConfig): BladesTargetLink.Config {
    const {target, targetID, targetKey, targetFlagKey} = partialConfig;
    if (target) {
      if (targetKey) {
        return {target, targetKey};
      } else if (targetFlagKey) {
        return {target, targetFlagKey};
      }
      throw new Error("[BladesTargetLink.BuildConfig] Must provide a targetKey or targetFlagKey.");
    } else if (targetID) {
      if (targetKey) {
        return {targetID, targetKey};
      } else if (targetFlagKey) {
        return {targetID, targetFlagKey};
      }
      throw new Error("[BladesTargetLink.BuildConfig] Must provide a targetKey or targetFlagKey.");
    }
    throw new Error("[BladesTargetLink.BuildConfig] Must provide a target or targetID.");
  }

  static BuildLinkData(partialData: BladesTargetLink.PartialData): BladesTargetLink.Data {
    const {id, targetID, targetKey, targetFlagKey} = partialData;
    if (targetKey) {
      return {id, targetID, targetKey};
    }
    return {id, targetID, targetFlagKey} as BladesTargetLink.Data;
  }

  /**
   * This private static method is used to transform a configuration object into a data object for BladesTargetLink.
   * It checks if the provided configuration object is already valid data, and if so, returns it directly.
   * Otherwise, it partitions the configuration object into link-specific configuration and additional schema data,
   * constructs a full link configuration, and then creates a data object with a new random ID and the target UUID.
   * The method ensures that either 'targetKey' or 'targetFlagKey' is present and throws an error if the configuration is invalid.
   *
   * @template Schema - The additional schema data required by the subclass.
   * @param {BladesTargetLink.PartialConfig | BladesTargetLink.Data & Partial<Schema>} config - The configuration object that may contain BladesTargetLink properties and any subclass-specific schema data.
   * @returns {BladesTargetLink.Data & Partial<Schema>} - The fully constructed data object with necessary properties for BladesTargetLink.
   * @throws {Error} - Throws an error if the configuration object is invalid, lacks a target reference, or if both 'targetKey' and 'targetFlagKey' are provided.
   */
  static #ParseConfigToData<Schema>(
    this: BladesTargetLink.StaticThisContext<Schema>,
    config: (BladesTargetLink.PartialConfig | BladesTargetLink.Data) & Partial<Schema>
  ): BladesTargetLink.Data & Partial<Schema> {

    if (this.IsValidData(config)) { return this.ParseConfigToData(config); }

    const {linkConfig, partialSchema} = this.PartitionSchemaData(config);

    const fullConfig = this.BuildLinkConfig(linkConfig);

    // === CONVERT CONFIG TO DATA OBJECT ===
    // - Send through public ParseConfigToData method, so subclasses can include their own logic.
    if ("targetKey" in fullConfig) {
      return this.ParseConfigToData<Schema>({
        ...partialSchema,
        id: randomID() as IDString,
        targetID: U.parseDocRefToUUID("target" in fullConfig ? fullConfig.target : fullConfig.targetID),
        targetKey: fullConfig.targetKey
      });
    }
    return this.ParseConfigToData<Schema>({
      ...partialSchema,
      id: randomID() as IDString,
      targetID: U.parseDocRefToUUID("target" in fullConfig ? fullConfig.target : fullConfig.targetID),
      targetFlagKey: fullConfig.targetFlagKey
    });
  }

  /**
   * This static method parses the provided data into a format suitable for BladesTargetLink.
   * Subclasses can override this method to include their own parse logic.
   * If the provided data is already valid, it is returned as is.
   * Otherwise, the data is passed to the private #ParseConfig method for further processing.
   * Note: The 'id' property is defined at the return step, within #ParseConfig: Subclass
   * functionality that depends on the id property should be placed after the super call to this method.
   *
   * @template Schema - The data schema required by the subclass.
   * @param {(BladesTargetLink.PartialConfig | BladesTargetLink.Data) & Partial<Schema>} data - The data to be parsed.
   * @returns {BladesTargetLink.Data & Partial<Schema>} - The parsed data, suitable for BladesTargetLink.
   */
  static ParseConfigToData<Schema>(
    data: (BladesTargetLink.PartialConfig | BladesTargetLink.Data) & Partial<Schema>
  ): BladesTargetLink.Data & Partial<Schema> {
    if (BladesTargetLink.IsValidData(data)) {
      return data;
    }
    return this.#ParseConfigToData(data);
  }

  static PartitionSchemaData<Schema>(
    dataOrConfig: BladesTargetLink.PartialData & Partial<Schema>
  ): {linkData: BladesTargetLink.Data, partialSchema: Partial<Schema>};
  static PartitionSchemaData<Schema>(
    dataOrConfig: BladesTargetLink.PartialConfig & Partial<Schema>
  ): {linkConfig: BladesTargetLink.Config, partialSchema: Partial<Schema>};
  static PartitionSchemaData<Schema, T extends BladesTargetLink.PartialConfig | BladesTargetLink.PartialData>(
    dataOrConfig: T & Partial<Schema>
  ): {linkData: BladesTargetLink.Data, partialSchema: Partial<Schema>}
    | {linkConfig: BladesTargetLink.Config, partialSchema: Partial<Schema>} {
    const {
      id, target, targetID, targetKey, targetFlagKey,
      ...schemaData
    } = dataOrConfig as T & Partial<Schema> & {id?: IDString, target?: BladesLinkDoc};
    const partialSchema = schemaData as Partial<Schema>;

    if (U.isDocID(id)) {
      // A PartialData object was submitted.
      if (!this.IsValidData({id, targetID, targetKey, targetFlagKey})) {
        eLog.error("BladesTargetLink", "Bad Constructor DATA", {dataOrConfig});
        throw new Error("[new BladesTargetLink()] Bad Constructor DATA (see log)");
      }

      let linkData: BladesTargetLink.Data;
      if (targetKey) {
        linkData = {id, targetID, targetKey} as BladesTargetLink.Data;
      } else {
        linkData = {id, targetID, targetFlagKey} as BladesTargetLink.Data;
      }

      return {
        linkData,
        partialSchema
      };
    }
    // A PartialConfig object was submitted.
    const linkConfig = this.BuildLinkConfig({target, targetID, targetKey, targetFlagKey});

    return {
      linkConfig,
      partialSchema
    };
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
    if (this.targetKey) {
      return {
        id: this.id,
        targetID: this.targetID,
        targetKey: this.targetKey
      };
    }
    return {
      id: this.id,
      targetID: this.targetID,
      targetFlagKey: this.targetFlagKey
    } as BladesTargetLink.Data;
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
      ...this.linkData
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
  constructor(config: BladesTargetLink.PartialConfig & Partial<Schema>)
  constructor(data: BladesTargetLink.Data)
  constructor(dataOrConfig: BladesTargetLink.PartialConfig & Partial<Schema> | BladesTargetLink.Data) {

    let linkData: BladesTargetLink.Data;
    let schema: Schema;

    // First, we construct the link data from the config or data object.
    if (BladesTargetLink.IsValidData(dataOrConfig)) {
      // If a simple link data object was provided, acquire the schema from the source document
      ({linkData} = BladesTargetLink.PartitionSchemaData(dataOrConfig));
      const target = fromUuidSync(linkData.targetID);
      if (!target) {
        throw new Error(`[new BladesTargetLink()] Unable to resolve target from uuid '${linkData.targetID}'`);
      }
      if ("targetKey" in linkData) {
        schema = getProperty(target, `${linkData.targetKey}.${linkData.id}`);
      } else {
        schema = target.getFlag(C.SYSTEM_ID, `${linkData.targetFlagKey}.${linkData.id}`) as Schema;
      }
    } else {
      // Otherwise, we have to parse the config into a data object, and extract any schema data

      // First we convert the config object to a BladesTargetLink.Data & Partial<Schema> object.
      const parsedData = BladesTargetLink.#ParseConfigToData(dataOrConfig) as BladesTargetLink.PartialData;

      // Next we separate the linkData and the schemaData from the parsedData object.
      let partialSchema: Partial<Schema>;
      ({linkData, partialSchema} = BladesTargetLink.PartitionSchemaData(parsedData));

      // And apply any schema defaults to the provided schema data.
      schema = BladesTargetLink.#ApplySchemaDefaults(partialSchema, linkData);
    }

    this._id = linkData.id;
    this._targetID = linkData.targetID;
    if ("targetKey" in linkData) {
      this._targetKey = linkData.targetKey;
    } else {
      this._targetFlagKey = linkData.targetFlagKey;
    }

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
      ...this.linkData,
      ...this.initialSchema
    };

    // Initialize server-side data on target.
    if (this.targetKey) {
      await this.target.update({[`${this.targetKey}.${this.id}`]: data});
    } else {
      await (this.target as BladesItem).setFlag(C.SYSTEM_ID, `${this.targetFlagKey}.${this.id}`, data);
    }
  }

  async updateTarget(prop: string, val: unknown) {
    if (getProperty(this.data, prop) === val) { return; }
    if (this.targetFlagKeyPrefix) {
      await this.updateTargetFlag(prop, val);
    } else if (this.targetKeyPrefix) {
      await this.updateTargetKey(prop, val);
    }
  }

  async updateTargetData(val: Partial<Schema> | null) {
    if (val) {
      // Add BladesTargetLink.Data to provided schema
      val = {
        ...val,
        ...this.linkData
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
