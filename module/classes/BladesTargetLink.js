/* eslint-disable @typescript-eslint/no-unused-vars */
import U from "../core/utilities.js";
import C from "../core/constants.js";
class BladesTargetLink {
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
    static ApplySchemaDefaults(schemaData) {
        throw new Error("[BladesTargetLink.ApplySchemaDefaults] Static Method ApplySchemaDefaults must be overridden in subclass");
    }
    static ParseConfig(config) {
        // === VALIDATE CONFIG ===
        // - Confirm 'config' is proper primitive type
        if (!U.isSimpleObj(config)) {
            throw new Error(`[BladesTargetLink.ResolveConfigToData()] Config is Not a Simple Object: '${JSON.stringify(config)}'`);
        }
        // - Isolate BladesTargetLink.Config entries from unknown PartialSchema entries
        const { target, targetID, targetKey, targetFlagKey, ...schemaData } = config;
        // - Attempt to determine targetUUID from target/targetID
        const targetRef = target ?? targetID;
        // - ... Confirm target exists
        if (!targetRef) {
            throw new Error(`[BladesTargetLink.ResolveConfigToData()] Data Lacks ANY 'target' / 'targetID': '${JSON.stringify(config)}'`);
        }
        // - ... Convert to UUID
        let targetUUID;
        if (U.isDocUUID(targetRef)) {
            targetUUID = targetRef;
        }
        else if (U.isDocID(targetRef)) {
            // If it's a an ID (not a UUID), attempt to get UUID synchronously by checking most common collections:
            targetUUID = (game.actors.get(targetRef) ?? game.items.get(targetRef))?.uuid;
        }
        else {
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
        const schema = this.ApplySchemaDefaults(schemaData);
        // === RETURN CONSTRUCTED DATA OBJECT ===
        return {
            ...schema,
            id: randomID(),
            targetID: targetUUID,
            targetKey,
            targetFlagKey
        };
    }
    static async InitTargetLink(data) {
        // Validate target.
        const target = fromUuidSync(data.targetID);
        if (!target) {
            throw new Error(`[BladesTargetLink.InitTargetLink] No target found with UUID '${data.targetID}'`);
        }
        // Initialize server-side data on target.
        if (data.targetKey) {
            await target.update({ [`${data.targetKey}.${data.id}`]: data });
        }
        else if (data.targetFlagKey) {
            await target.setFlag(C.SYSTEM_ID, `${data.targetFlagKey}.${data.id}`, data);
        }
        return target;
    }
    static async Create(config) {
        const data = this.ParseConfig(config);
        eLog.checkLog2("BladesTargetLink.Create", "Config Parsed to Data", { config: U.objClone(config), data: U.objClone(data) });
        await this.InitTargetLink(data);
        eLog.checkLog3("BladesTargetLink.Create", "After Init Target Link", { data: U.objClone(data) });
        return new this(data);
    }
    // #endregion
    // #region GETTERS ~
    get isGM() { return game.user.isGM; }
    _id;
    _targetID;
    _targetKey;
    _targetFlagKey;
    get id() { return this._id; }
    get targetID() { return this._targetID; }
    get targetKey() { return this._targetKey; }
    get targetKeyPrefix() {
        return this._targetKey
            ? `${this._targetKey}.${this.id}`
            : undefined;
    }
    get targetFlagKey() { return this._targetFlagKey; }
    get targetFlagKeyPrefix() {
        return this.targetFlagKey
            ? `${this.targetFlagKey}.${this.id}`
            : undefined;
    }
    _target;
    get target() {
        return this._target;
    }
    get linkData() {
        let linkData;
        if (this.targetFlagKeyPrefix) {
            linkData = this.target.getFlag("eunos-blades", this.targetFlagKeyPrefix) ?? undefined;
        }
        else if (this.targetKeyPrefix) {
            linkData = getProperty(this.target, this.targetKeyPrefix);
        }
        if (!linkData) {
            throw new Error("[BladesTargetLink.linkData] Error retrieving linkData.");
        }
        return linkData;
    }
    get data() { return this.linkData; }
    // #endregion
    // #region CONSTRUCTOR ~
    constructor(data) {
        const { id, targetID, targetKey, targetFlagKey } = data;
        if (!id || !targetID || !(targetKey || targetFlagKey)) {
            eLog.error("BladesTargetLink", "Bad Constructor Data", { data });
            throw new Error("[new BladesTargetLink()] Bad Constructor Data (see log)");
        }
        this._id = id;
        this._targetID = targetID;
        if (U.isTargetKey(targetKey)) {
            this._targetKey = targetKey;
        }
        else if (U.isTargetFlagKey(targetFlagKey)) {
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
    async updateTarget(prop, val, isSilent = false) {
        if (this.targetFlagKeyPrefix) {
            await this.target.setFlag("eunos-blades", `${this.targetFlagKeyPrefix}.${prop}`, val);
        }
        else if (this.targetKeyPrefix) {
            await this.target.update({ [`${this.targetKeyPrefix}.${prop}`]: val }, { render: !isSilent });
        }
    }
    async updateTargetData(val, isSilent = false) {
        if (val === null) {
            if (this.targetFlagKeyPrefix) {
                await this.target.unsetFlag("eunos-blades", `${this.targetFlagKeyPrefix}`);
            }
            else {
                await this.target.update({ [`${this.targetKey}.-=${this.id}`]: null });
            }
        }
        else {
            // Add BladesTargetLink.Data to provided schema
            const linkData = {
                ...val,
                id: this.id,
                targetID: this.targetID,
                targetKey: this.targetKey,
                targetFlagKey: this.targetFlagKey
            };
            // Update target
            if (this.targetFlagKeyPrefix) {
                await this.target.setFlag("eunos-blades", this.targetFlagKeyPrefix, linkData);
            }
            else if (this.targetKeyPrefix) {
                await this.target.update({ [this.targetKeyPrefix]: linkData }, { render: !isSilent });
            }
        }
    }
    async delete() {
        await this.updateTargetData(null);
    }
}
export default BladesTargetLink;
