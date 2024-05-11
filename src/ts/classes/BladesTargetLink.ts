/* eslint-disable @typescript-eslint/no-unused-vars */
import U from "../core/utilities";
import C from "../core/constants";
import {BladesActor} from "../documents/BladesActorProxy";
import {BladesItem} from "../documents/BladesItemProxy";
import BladesChatMessage from "./BladesChatMessage";

class BladesTargetLink<Schema> {

  // #region STATIC METHODS ~

  static get ValidTargetClasses() {
    return [
      BladesActor,
      BladesItem,
      BladesChatMessage,
      User
    ] as const;
  }

  static HasValidID(ref: Record<key, unknown>) {
    return U.isDocID(ref.target) || U.isDocID(ref.targetID);
  }

  static HasValidUUID(ref: Record<key, unknown>) {
    return U.isDocUUID(ref.target) || U.isDocUUID(ref.targetID);
  }

  static HasValidKey(ref: Record<key, unknown>) {
    // Return false if ref has neither targetKey nor targetFlagKey
    if (!U.isTargetKey(ref.targetKey) && !U.isTargetFlagKey(ref.targetFlagKey)) { return false; }
    // Return false if ref has BOTH targetKey and targetFlagKey
    if (U.isTargetKey(ref.targetKey) && U.isTargetFlagKey(ref.targetFlagKey)) { return false; }
    // Return true if exactly one is set
    return true;
  }

  static HasValidTargetRef(ref: Record<key, unknown>) {
    return this.HasValidID(ref)
      || this.HasValidUUID(ref)
      || this.ValidTargetClasses.some((cls) => ref.target instanceof cls);
  }

  static IsValidConfig(ref: unknown): ref is BladesTargetLink.Config {
    if (!U.isSimpleObj(ref)) { return false; }
    return this.HasValidKey(ref) && this.HasValidTargetRef(ref);
  }

  static IsValidData(ref: unknown): ref is BladesTargetLink.Data {
    if (!U.isSimpleObj(ref)) { return false; }
    return U.isDocID(ref.id)
      && U.isDocUUID(ref.targetID)
      && this.HasValidKey(ref);
  }

  static #ParseChildLinkData<Schema>(
    childData: BladesTargetLink.Data & Partial<Schema>,
    parentLinkData?: BladesTargetLink.Data
  ): BladesTargetLink.Data & Partial<Schema> {
    if (!parentLinkData) { return childData; }
    const keyPrefixParts: string[] = "targetKey" in parentLinkData
      ? [parentLinkData.targetKey]
      : [parentLinkData.targetFlagKey];
    if (parentLinkData.isScopingById) {
      keyPrefixParts.push(parentLinkData.id);
    }
    const keyPrefix = keyPrefixParts.join(".");

    if ("targetKey" in childData && "targetKey" in parentLinkData) {
      if (childData.targetKey.startsWith(`${keyPrefix}.`)) {
        // Remove the keyPrefix and the following dot from childData.targetKey
        childData.targetKey = childData.targetKey.slice(keyPrefix.length + 1) as TargetKey;
      }
      childData.targetKey = [
        parentLinkData.targetKey,
        parentLinkData.isScopingById ? parentLinkData.id : undefined,
        childData.targetKey
      ].filter(Boolean).join(".") as TargetKey;
    } else if ("targetFlagKey" in childData && "targetFlagKey" in parentLinkData) {
      if (childData.targetFlagKey.startsWith(`${keyPrefix}.`)) {
        // Remove the keyPrefix and the following dot from childData.targetFlagKey
        childData.targetFlagKey = childData.targetFlagKey.slice(keyPrefix.length + 1) as TargetFlagKey;
      }
      childData.targetFlagKey = [
        parentLinkData.targetFlagKey,
        parentLinkData.isScopingById ? parentLinkData.id : undefined,
        childData.targetFlagKey
      ].filter(Boolean).join(".") as TargetFlagKey;
    } else {
      throw new Error("[BladesTargetLink.ParseChildLinkData] targetKey/targetFlagKey mismatch between provided partialConfig and parentLinkData.");
    }
    return childData;
  }

  static BuildLinkConfig(
    partialConfig: BladesTargetLink.Config
  ): BladesTargetLink.Config {
    // const {target, targetID, targetKey, targetFlagKey, isScopingById} = partialConfig;

    if ("target" in partialConfig) {
      if ("targetKey" in partialConfig) {
        return {
          target:        partialConfig.target,
          targetKey:     partialConfig.targetKey,
          isScopingById: partialConfig.isScopingById
        };
      } else if ("targetFlagKey" in partialConfig) {
        return {
          target:        partialConfig.target,
          targetFlagKey: partialConfig.targetFlagKey,
          isScopingById: partialConfig.isScopingById
        };
      }
      throw new Error("[BladesTargetLink.BuildConfig] Must provide a targetKey or targetFlagKey.");
    } else if ("targetID" in partialConfig) {
      if ("targetKey" in partialConfig) {
        return {
          targetID:      partialConfig.targetID,
          targetKey:     partialConfig.targetKey,
          isScopingById: partialConfig.isScopingById
        };
      } else if ("targetFlagKey" in partialConfig) {
        return {
          targetID:      partialConfig.targetID,
          targetFlagKey: partialConfig.targetFlagKey,
          isScopingById: partialConfig.isScopingById
        };
      }
      throw new Error("[BladesTargetLink.BuildConfig] Must provide a targetKey or targetFlagKey.");
    }
    throw new Error("[BladesTargetLink.BuildConfig] Must provide a target or targetID.");
  }

  /**
   * This private static method is used to transform a configuration object into a data object for BladesTargetLink.
   * It checks if the provided configuration object is already valid data, and if so, returns it directly.
   * Otherwise, it partitions the configuration object into link-specific configuration and additional schema data,
   * constructs a full link configuration, and then creates a data object with a new random ID and the target UUID.
   * The method ensures that either 'targetKey' or 'targetFlagKey' is present and throws an error if the configuration is invalid.
   *
   * @template Schema - The additional schema data required by the subclass.
   * @param {BladesTargetLink.Config | BladesTargetLink.Data & Partial<Schema>} config - The configuration object that may contain BladesTargetLink properties and any subclass-specific schema data.
   * @returns {BladesTargetLink.Data & Partial<Schema>} - The fully constructed data object with necessary properties for BladesTargetLink.
   * @throws {Error} - Throws an error if the configuration object is invalid, lacks a target reference, or if both 'targetKey' and 'targetFlagKey' are provided.
   */
  static #ParseConfigToData<Schema>(
    this: BladesTargetLink.StaticThisContext<Schema>,
    config: (BladesTargetLink.Config | BladesTargetLink.Data) & Partial<Schema>,
    parentLinkData?: BladesTargetLink.Data
  ): BladesTargetLink.Data & Partial<Schema> {

    if (this.IsValidData(config)) { return this.ParseConfigToData(config, parentLinkData); }

    const {linkConfig, partialSchema} = this.PartitionSchemaData(config);

    const fullConfig = this.BuildLinkConfig(linkConfig);
    // === CONVERT CONFIG TO DATA OBJECT ===
    // - Send through public ParseConfigToData method, so subclasses can include their own logic.
    if ("targetKey" in fullConfig) {
      return this.ParseConfigToData<Schema>({
        id:        randomID() as IDString,
        ...partialSchema,
        targetID:  U.parseDocRefToUUID("target" in fullConfig ? fullConfig.target : fullConfig.targetID),
        targetKey: fullConfig.targetKey
      }, parentLinkData);
    }
    return this.ParseConfigToData<Schema>({
      id:            randomID() as IDString,
      ...partialSchema,
      targetID:      U.parseDocRefToUUID("target" in fullConfig ? fullConfig.target : fullConfig.targetID),
      targetFlagKey: fullConfig.targetFlagKey
    }, parentLinkData);
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
   * @param {(BladesTargetLink.Config | BladesTargetLink.Data) & Partial<Schema>} data - The data to be parsed.
   * @returns {BladesTargetLink.Data & Partial<Schema>} - The parsed data, suitable for BladesTargetLink.
   */
  static ParseConfigToData<Schema>(
    data: (BladesTargetLink.Config | BladesTargetLink.Data) & Partial<Schema>,
    parentLinkData?: BladesTargetLink.Data
  ): BladesTargetLink.Data & Partial<Schema> {
    if (this.IsValidData(data)) { return this.#ParseChildLinkData(data, parentLinkData); }
    return this.#ParseConfigToData(data, parentLinkData);
  }

  static PartitionSchemaData<Schema>(
    dataOrConfig: BladesTargetLink.Data & Partial<Schema>
  ): {linkData: BladesTargetLink.Data, partialSchema: Partial<Schema>};
  static PartitionSchemaData<Schema>(
    dataOrConfig: BladesTargetLink.Config & Partial<Schema>
  ): {linkConfig: BladesTargetLink.Config, partialSchema: Partial<Schema>};
  static PartitionSchemaData<Schema, T extends BladesTargetLink.Config | BladesTargetLink.Data>(
    dataOrConfig: T & Partial<Schema>
  ): {linkData: BladesTargetLink.Data, partialSchema: Partial<Schema>}
    | {linkConfig: BladesTargetLink.Config, partialSchema: Partial<Schema>} {
    const {
      id, target, targetID, targetKey, targetFlagKey, isScopingById,
      ...schemaData
    } = dataOrConfig as T & Partial<Schema> & {
      id?: IDString,
      target?: TargetLinkDoc,
      targetID?: IDString,
      targetKey?: TargetKey,
      targetFlagKey?: TargetFlagKey
    };
    const partialSchema = schemaData as Partial<Schema>;

    if (U.isDocID(id)) {
      // A Data object was submitted.
      if (!this.IsValidData({id, targetID, targetKey, targetFlagKey, isScopingById})) {
        eLog.error("BladesTargetLink", "Bad Constructor DATA", {dataOrConfig});
        throw new Error("[new BladesTargetLink()] Bad Constructor DATA (see log)");
      }

      let linkData: BladesTargetLink.Data;
      if (targetKey) {
        linkData = {id, targetID: targetID as UUIDString, targetKey, isScopingById: isScopingById ?? true};
      } else if (targetFlagKey) {
        linkData = {id, targetID: targetID as UUIDString, targetFlagKey, isScopingById: isScopingById ?? true};
      } else {
        eLog.error("BladesTargetLink", "Bad Constructor DATA", {dataOrConfig});
        throw new Error("[BladesTargetLink.PartitionSchemaData] Bad Constructor DATA (see log)");
      }

      return {
        linkData,
        partialSchema
      };
    }
    // A Config object was submitted.
    return {
      linkConfig: this.BuildLinkConfig({
        ...{isScopingById: isScopingById ?? true},
        ...("targetID" in dataOrConfig
          ? {targetID: dataOrConfig.targetID}
          : {target: dataOrConfig.target}),
        ...("targetKey" in dataOrConfig
          ? {targetKey: dataOrConfig.targetKey}
          : {targetFlagKey: dataOrConfig.targetFlagKey})
      }),
      partialSchema
    };
  }

  static _ApplySchemaDefaults<Schema>(
    this: BladesTargetLink.StaticThisContext<Schema>,
    schemaData: Partial<Schema>
  ): Schema {
    return this.ApplySchemaDefaults(schemaData);
  }

  /**
 * This static method applies defaults to any values missing from the class' data Schema.
 * 'Schema' is defined by subclasses to BladesTargetLink.
 * Subclasses must override this method to apply their own defaults.
 *
 * @template Schema - The data schema required by the subclass.
 * @param {Partial<Schema>} _schemaData - Schema data overriding the defaults.
 * @returns {Schema} - The schema data with defaults applied.
 * @throws {Error} - Throws an error if this method is not overridden in a subclass.
 */
  static ApplySchemaDefaults<Schema>(
    this: BladesTargetLink.StaticThisContext<Schema>,
    _schemaData: Partial<Schema>
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
  static async Create<C extends new(
    configType: BladesTargetLink.Config & Partial<Schema>,
    parentLinkDataType?: BladesTargetLink.Data & Schema
  ) => BladesTargetLink<Schema>, Schema>(
    this: C,
    config: BladesTargetLink.Config & Partial<Schema>,
    parentLinkData?: BladesTargetLink.Data & Schema
  ): Promise<InstanceType<C>> {
    const tLink = new this(config, parentLinkData);
    await tLink.initTargetLink();
    return tLink as InstanceType<C>;
  }
  // #endregion

  // #region GETTERS ~
  get isGM() {return game.user.isGM;}

  private readonly _id: IDString;
  private readonly _targetID: UUIDString;
  private readonly _targetKey?: TargetKey;
  private readonly _targetFlagKey?: TargetFlagKey;
  private readonly _isScopingById = true;
  private readonly _initialSchema: Schema;

  get id() { return this._id; }
  get targetID() { return this._targetID; }
  get targetKey(): TargetKey | undefined {return this._targetKey;}
  get targetFlagKey(): TargetFlagKey | undefined {return this._targetFlagKey;}
  get isScopingById(): boolean { return this._isScopingById; }
  get initialSchema(): Schema { return this._initialSchema; }

  get targetKeyPrefix(): TargetKey | undefined {
    if (!this.targetKey) { return undefined; }
    if (!this.isScopingById) { return this.targetKey; }
    return this.targetKey
      ? `${this.targetKey}.${this.id}` as TargetKey
      : undefined;
  }
  get targetKeyNullPrefix(): TargetKey | undefined {
    if (!this.targetKey) { return undefined; }
    if (this.isScopingById) {
      return `${this.targetKey}.-=${this.id}` as TargetKey;
    }
    if (/^.+\..+$/g.test(this.targetKey)) {
      return this.targetKey.replace(/\.([^.]+)$/, ".-=$1") as TargetKey;
    }
    throw new Error(`[BladesTargetLink.targetKeyNullPrefix] Can't Nullify TargetKey '${this.targetKey}'`);
  }

  get targetFlagKeyPrefix(): TargetFlagKey | undefined {
    if (!this.targetFlagKey) { return undefined; }
    if (!this.isScopingById) { return this.targetFlagKey; }
    return this.targetFlagKey
      ? `${this.targetFlagKey}.${this.id}` as TargetFlagKey
      : undefined;
  }

  get isLinkInitialized(): boolean { return this.isInitPromiseResolved; }

  get linkData(): BladesTargetLink.Data {
    if (this.targetKey) {
      return {
        id:            this.id,
        targetID:      this.targetID,
        targetKey:     this.targetKey,
        isScopingById: this.isScopingById
      };
    }
    if (this.targetFlagKey) {
      return {
        id:            this.id,
        targetID:      this.targetID,
        targetFlagKey: this.targetFlagKey,
        isScopingById: this.isScopingById
      };
    }
    throw new Error(`[BladesTargetLink.linkData] Missing targetKey and targetFlagKey for '${this.id}'`);
  }


  private readonly _target: TargetLinkDoc;
  get target(): TargetLinkDoc { return this._target; }

  protected get localData(): BladesTargetLink.Data & Schema {
    return {
      ...this.initialSchema,
      ...this.linkData
    };
  }

  get data(): BladesTargetLink.Data & Schema {
    if (this.isLinkInitialized) {
      let data: BladesTargetLink.Data & Schema | undefined;
      if (this.targetFlagKeyPrefix) {
        data = this.target.getFlag(C.SYSTEM_ID, this.targetFlagKeyPrefix) as BladesTargetLink.Data & Schema | undefined;
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
  constructor(
    config: BladesTargetLink.Config & Partial<Schema>,
    parentLinkData?: BladesTargetLink.Data & Partial<Schema>
  )
  constructor(
    data: BladesTargetLink.Data,
    parentLinkData?: BladesTargetLink.Data & Partial<Schema>
  )
  constructor(
    dataOrConfig: BladesTargetLink.Config & Partial<Schema>
      | BladesTargetLink.Data,
    parentLinkData?: BladesTargetLink.Data & Partial<Schema>
  ) {

    let linkData: BladesTargetLink.Data;
    let schema: Schema;

    const subclassConstructor = this.constructor as typeof BladesTargetLink<Schema>;

    // First, we construct the link data from the config or data object.
    if (subclassConstructor.IsValidData(dataOrConfig)) {
      // If a simple link data object was provided, acquire the schema from the source document
      ({linkData} = subclassConstructor.PartitionSchemaData(dataOrConfig));
      const linkTarget = fromUuidSync(linkData.targetID);
      if (!linkTarget) {
        throw new Error(`[new BladesTargetLink()] Unable to resolve target from uuid '${linkData.targetID}'`);
      }
      if ("targetKey" in linkData) {
        schema = getProperty(linkTarget, `${linkData.targetKey}.${linkData.id}`);
      } else {
        schema = linkTarget.getFlag(C.SYSTEM_ID, `${linkData.targetFlagKey}.${linkData.id}`) as Schema;
      }
      // Set the isInitPromiseResolved flag to true
      this.isInitPromiseResolved = true;
    } else {
      // Otherwise, we have to parse the config into a data object, and extract any schema data

      // First we convert the config object to a BladesTargetLink.Data & Partial<Schema> object.
      const parsedData = BladesTargetLink.#ParseConfigToData(
        dataOrConfig,
        parentLinkData
      );

      // Next we separate the linkData and the schemaData from the parsedData object.
      let partialSchema: Partial<Schema>;
      ({linkData, partialSchema} = subclassConstructor.PartitionSchemaData<Schema>(parsedData));

      // And apply any schema defaults to the provided schema data.
      schema = subclassConstructor._ApplySchemaDefaults<Schema>(partialSchema);
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
  private getDotKeyToProp(prop: Maybe<string|number>, isNullifying = false): string {
    if (this.targetKeyPrefix) {
      if (prop === undefined) {
        return isNullifying ? this.targetKeyNullPrefix as TargetKey : this.targetKeyPrefix;
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

  private getFlagParamsToProp(prop: Maybe<string|number>) {
    return [C.SYSTEM_ID, this.getDotKeyToProp(prop)] as const;
  }

  private async updateTargetFlag(prop: Maybe<string|number>, val: unknown) {
    if (!this.targetFlagKeyPrefix) { return; }
    if (val === null) {
      await this.target.unsetFlag(...this.getFlagParamsToProp(prop));
    } else if (this.target instanceof BladesActor) {
      await this.target.setFlag(...this.getFlagParamsToProp(prop), val);
    } else if (this.target instanceof BladesItem) {
      await this.target.setFlag(...this.getFlagParamsToProp(prop), val);
    } else if (this.target instanceof User) {
      await this.target.setFlag(...this.getFlagParamsToProp(prop), val);
    } else if (this.target instanceof BladesChatMessage) {
      await this.target.setFlag(...this.getFlagParamsToProp(prop), val);
    }
  }

  private async updateTargetKey(prop: string|undefined, val: unknown) {
    if (!this.targetKeyPrefix) { return; }
    await this.target.update({[this.getDotKeyToProp(prop, val === null)]: val}, {render: false});
  }

  initPromise?: Promise<void>;
  isInitPromiseResolved = false;
  /**
   * Initializes a target link by updating the target's data with the provided data object.
   * If a targetKey is provided, the data is updated directly on the target.
   * If a targetFlagKey is provided, the data is set as a flag on the target.
   *
   * This method need only be run once, when the document is first created and its data must be written to server storage.
   * External functions can synchronously check the status of initialization via the isInitPromiseResolved property, while
   * asynchronous functions can await the initPromise property.
   *
   * TargetLink documents whose data already exists in server storage can be constructed directly (i.e. new BladesTargetLink(data))
   * without needing to call this method.
   *
   * @param {BladesTargetLink.Data & Schema} data - The combined data object containing both the target link data and the schema data.
   * @returns {Promise<void>} - A promise that resolves when the server update is complete.
   */
  async initTargetLink() {
    this.isInitPromiseResolved = false;

    // Construct data object
    const data: BladesTargetLink.Data & Schema = {
      ...this.linkData,
      ...this.initialSchema
    };

    this.initPromise = new Promise((resolve, reject) => {
      if (this.targetKeyPrefix) {
        const updateData = mergeObject(
          (getProperty(this.target, this.targetKeyPrefix) ?? {}) as Partial<BladesTargetLink.Data & Schema>,
          data
        );
        this.target.update({[this.targetKeyPrefix]: updateData}, {render: false}).then(() => {
          this.isInitPromiseResolved = true;
          resolve();
        }).catch(reject);
      } else if (this.targetFlagKeyPrefix) {
        const updateData = mergeObject(
          (this.target.getFlag(C.SYSTEM_ID, this.targetFlagKeyPrefix) ?? {}) as Partial<BladesTargetLink.Data & Schema>,
          data
        );
        (this.target as BladesItem).setFlag(C.SYSTEM_ID, this.targetFlagKeyPrefix, updateData).then(() => {
          this.isInitPromiseResolved = true;
          resolve();
        }).catch(reject);
      } else {
        reject(new Error(`[BladesTargetLink.#updateTargetViaMerge] Unable to update target data for BladesTargetLink id '${this.id}': Missing both 'targetKeyPrefix' and 'targetFlagKeyPrefix'`));
      }
    });

    return this.initPromise;
  }

  async #updateTargetViaMerge(updateData: Record<string, unknown>, waitFor?: Promise<unknown>|gsapAnim) {
    await U.waitFor(waitFor);
    if (this.targetKeyPrefix) {
      // First, prepend targetKeyPrefix or targetFlagKeyPrefix (as appropriate) to each key of updateData
      updateData = U.objMap(updateData, false, (key) => `${this.targetKeyPrefix ?? this.targetFlagKeyPrefix}.${String(key)}`) as Record<string, unknown>;
      return this.target.update(updateData, {render: false});
    } else if (this.targetFlagKeyPrefix) {
      // We must retrieve the existing flag data, flattenObject it, then merge it with updateData
      const existingFlagData = this.target.getFlag(C.SYSTEM_ID, this.targetFlagKeyPrefix) ?? {};
      const flattenedFlagData = flattenObject(existingFlagData as BladesTargetLink.Data & Schema);
      const mergedFlagData = mergeObject(flattenedFlagData, updateData);

      return (this.target as BladesItem).setFlag(C.SYSTEM_ID, this.targetFlagKeyPrefix, mergedFlagData);
    } else {
      throw new Error(`[BladesTargetLink.#updateTargetViaMerge] Unable to update target data for BladesTargetLink id '${this.id}': Missing both 'targetKeyPrefix' and 'targetFlagKeyPrefix'`);
    }
  }

  async #updateTargetPropVal(prop: string, val: unknown, waitFor?: Promise<unknown>|gsapAnim) {
    await U.waitFor(waitFor);
    if (this.targetKeyPrefix) {
      return this.target.update({[`${this.targetKeyPrefix}.${prop}`]: val});
    } else if (this.targetFlagKeyPrefix) {
      return this.updateTargetFlag(prop, val);
    } else {
      throw new Error(`[BladesTargetLink.#updateTargetPropVal] Unable to update target data for BladesTargetLink id '${this.id}': Missing both 'targetKeyPrefix' and 'targetFlagKeyPrefix'`);
    }
  }

  async updateTarget(updateData: Record<string, unknown>, waitFor?: Promise<unknown>|gsapAnim): Promise<unknown>
  async updateTarget(prop: string, val: unknown, waitFor?: Promise<unknown>|gsapAnim): Promise<unknown>
  async updateTarget(
    propOrData: unknown,
    valOrWaitFor?: unknown,
    waitFor?: Promise<unknown>|gsapAnim
  ): Promise<unknown> {

    // If the provided data is an object, we assume it is a full data object and we update the target with it.
    if (typeof propOrData === "string") {
      if (getProperty(this.data, propOrData) === valOrWaitFor) { return Promise.resolve(); }
      return this.#updateTargetPropVal(propOrData, valOrWaitFor, waitFor);
    }
    if (U.isList(propOrData)) {
      return this.#updateTargetViaMerge(propOrData, valOrWaitFor as Promise<unknown>|gsapAnim|undefined);
    }
    throw new Error(`[BladesTargetLink.updateTarget()] Bad updateData for id '${this.id}': ${String(propOrData)}`);
  }

  async updateTargetData(val: Partial<Schema> | null, waitFor?: Promise<unknown>|gsapAnim) {
    if (val) {
      // Add BladesTargetLink.Data to provided schema
      val = {
        ...val,
        ...this.linkData
      };
    }
    await U.waitFor([this.initPromise, waitFor]);
    if (this.targetFlagKeyPrefix) {
      await this.updateTargetFlag(undefined, val);
    } else {
      await this.updateTargetKey(undefined, val);
    }
  }

  async delete(collection: Collection<unknown> | false, waitFor?: Promise<unknown>|gsapAnim) {
    if (collection) {
      collection.delete(this.id);
    }
    await U.waitFor([this.initPromise, waitFor]);
    await this.updateTargetData(null);
  }
  // #endregion
}


export default BladesTargetLink;
