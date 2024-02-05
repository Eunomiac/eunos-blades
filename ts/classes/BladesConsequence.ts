/* no-dupe-class-members */
/* eslint-disable @typescript-eslint/no-unused-vars */
import C, {BladesActorType, BladesItemType, AttributeTrait, ConsequenceType, RollResult, RollType, Position, Effect, RollPhase} from "../core/constants";
import U from "../core/utilities";
import BladesRoll, {BladesRollPrimary} from "./BladesRoll";
import BladesChat from "./BladesChat";
import BladesTargetLink from "./BladesTargetLink";
import {BladesPC} from "../documents/BladesActorProxy";
import {BladesItem} from "../documents/BladesItemProxy";
/* eslint-enable @typescript-eslint/no-unused-vars */

class BladesConsequence extends BladesTargetLink<BladesConsequence.Schema> {

  static async Initialize() {
    if (!game.messages) { throw new Error("[BladesConsequence] Messages Not Ready!"); }
    return Promise.all(game.messages.contents
      .map(async (msg) => BladesConsequence.GetFromChatMessage(msg))
    );
  }

  /**
 * Checks if the given value is valid consequence data for a Resistance Roll.
 * @param val The value to check.
 * @param isCheckingResistedTo If the check is being recursively applied to the 'resistTo' value.
 * @returns True if the val is valid BladesConsequence.Data, false otherwise.
 */
  static IsValidConsequenceData(
    val: unknown,
    isCheckingResistedTo = false
  ): val is BladesConsequence.Data {
    if (!U.isList(val)) {return false;}
    if (typeof val.type !== "string" || !(val.type in ConsequenceType)) {return false;}
    if (typeof val.name !== "string") {return false;}

    if (isCheckingResistedTo) {return true;}

    if (val.attribute && (typeof val.attribute !== "string" || !(val.attribute in AttributeTrait))) {return false;}
    if (!this.IsValidConsequenceData(val.resistTo, true)) {return false;}

    return true;
  }

  static override ApplySchemaDefaults<Schema = BladesConsequence.Schema>(
    schemaData: Partial<BladesConsequence.Schema>
  ) {
    // Ensure all properties of Schema are provided
    if (!schemaData.primaryID) { throw new Error("A primaryID is required for BladesConsequence.Schema"); }
    if (typeof schemaData.name === "string" && schemaData.name.length > 0 && !schemaData.type) {
      throw new Error(`If consequence name is provided (${schemaData.name}), its type must also be provided.`);
    }
    return {
      ...this.PartialNoneSchema,
      isAccepted: false,
      ...schemaData
    } as Schema;
  }

  static get PartialNoneSchema(): Partial<BladesConsequence.Schema> {
    return {
      name: "",
      type: ConsequenceType.None,
      isAccepted: true,
      wasResisted: false,
      canResistWithRoll: false,
      canResistWithArmor: false,
      canResistWithSpecial: false
    };
  }

  static GetActiveRollChatID(): string | undefined {
    return Array.from(game.messages).filter((msg) => $(msg.content ?? "").data("chat-id")).pop()?.id ?? undefined;
  }

  static ApplyChatListeners(html: JQuery<HTMLElement> | HTMLElement) {
    const html$ = $(html);
    html$.find(".blades-roll").each((_i, elem: HTMLElement) => {
      const roll$ = $(elem);
      const chat$ = roll$.closest(".chat-message");
      const message = game.messages.get(chat$.data("message-id") as IDString);
      if (!message) {
        throw new Error(`Could not find message with ID ${chat$.data("message-id")}`);
      }
      if (!message.flagData.rollData) {
        throw new Error(`Could not find rollData in message ${message.id}`);
      }
      const {rollData} = message.flagData;
      const {rollPhase} = rollData;
      if (rollPhase !== RollPhase.AwaitingConsequences) { return; }
      message.rollConsequences.forEach((csq) => {
        if (csq.isAccepted) { return; }
        const csq$ = roll$.find(`#${csq.id}`);
        csq$.find("[data-action='accept-consequence']").on({
          click: csq.resolveAccept.bind(csq)
        });
        csq$.find("[data-action='resist-consequence']").on({
          click: csq.resolveResist.bind(csq, "resist")
        });
        csq$.find("[data-action='armor-consequence']").on({
          click: csq.resolveResist.bind(csq, "armor")
        });
        csq$.find("[data-action='special-consequence']").on({
          click: csq.resolveResist.bind(csq, "special")
        });
      });
    });
  }

  static GetFromChatMessage(msg: BladesChat, csqId: IDString): BladesConsequence|undefined
  static GetFromChatMessage(msg: BladesChat): BladesConsequence[]
  static GetFromChatMessage(msg: BladesChat, csqID?: IDString): BladesConsequence[]|BladesConsequence|undefined {
    if (!csqID) {
      return msg.rollConsequences;
    }
    return msg.rollConsequences.find((cs) => cs.id === csqID);
  }

  get name(): string { return this.data.name; }
  get type(): ConsequenceType { return this.data.type; }
  get rollData(): BladesRoll.Data | undefined { return this.data.rollData; }
  get isAccepted(): boolean { return this.data.isAccepted ?? false; }
  get acceptanceMode(): BladesConsequence.DisplayType | undefined {
    if (!this.isAccepted) { return undefined; }
    return this.data.acceptanceMode ?? "accept";
  }
  get wasResisted(): boolean { return this.data.wasResisted ?? false; }
  get resistanceMode(): BladesConsequence.ResistanceType | undefined {
    if (!this.wasResisted) { return undefined; }
    if (!this.data.resistanceMode) {
      throw new Error("Consequence was resisted, but no resistance mode was set.");
    }
    return this.data.resistanceMode;
  }
  get primaryID(): UUIDString { return this.data.primaryID; }
  get resistData(): Record<IDString, BladesConsequence.Data> | undefined { return this.data.resistData; }
  get parentCsqID(): IDString | undefined { return this.data.parentCsqID; }
  get canResistWithRoll(): boolean { return this.data.canResistWithRoll ?? false; }
  get resistWithRollNegates(): boolean { return this.data.resistWithRollNegates ?? false; }
  get attribute(): AttributeTrait | undefined { return this.data.attribute; }
  get attributeVal(): number | undefined { return this.data.attributeVal; }
  get canResistWithArmor(): boolean { return this.data.canResistWithArmor ?? false; }
  get resistWithArmorNegates(): boolean { return this.data.resistWithArmorNegates ?? false; }
  get canResistWithSpecial(): boolean { return this.data.canResistWithSpecial ?? false; }
  get resistWithSpecialNegates(): boolean { return this.data.resistWithSpecialNegates ?? false; }
  get specialFooterMsg(): string | undefined { return this.data.specialFooterMsg; }

  get roll(): BladesRoll | undefined {
    if (!this.rollData) { return undefined; }
    return game.eunoblades.Rolls.get(this.rollData.id) ?? new BladesRoll({
      ...this.rollData,
      isScopingById: false
    });
  }
  get position(): Position | undefined { return this.roll?.rollPositionFinal; }
  get effect(): Effect | undefined { return this.roll?.rollEffectFinal; }
  get result(): RollResult | undefined { return this.roll?.rollResultFinal as RollResult | undefined; }
  get consequenceNone(): BladesConsequence {
    // If a None-type consequence is defined within data.resistData, return it.
    let noneCsq: BladesConsequence|undefined = this.resistConsequences.find((csq) => csq.type === ConsequenceType.None);
    if (noneCsq) { return noneCsq; }
    // Otherwise, return a new BladesConsequence with the default None schema, and initialize it.
    noneCsq = new BladesConsequence(BladesConsequence.PartialNoneSchema, this);
    noneCsq.initTargetLink();
    return noneCsq;
  }
  get resistConsequences(): BladesConsequence[] {
    if (!this.resistData) { return []; }
    return Object.values(this.resistData)
      .map((csqData) => game.eunoblades.Consequences.get(csqData.id) ?? new BladesConsequence(csqData, this));
  }
  get parentConsequence(): BladesConsequence|undefined {
    if (!this.parentCsqID) { return undefined; }
    const parentCsq = game.eunoblades.Consequences.get(this.parentCsqID);
    if (!parentCsq) {
      throw new Error(`Error locating parent consequence with id '${this.parentCsqID}'`);
    }
    return parentCsq;
  }

  get typeDisplay(): string { return C.ConsequenceDisplay[this.type]; }
  get icon(): string { return C.ConsequenceIcons[this.type]; }

  get primary(): BladesRollPrimary {
    const primary = fromUuidSync(this.primaryID);
    if (!primary) { throw new Error(`Could not find primary with UUID '${this.primaryID}'`); }
    return new BladesRollPrimary(this.roll, primary as BladesRoll.PrimaryDoc);
  }
  get resistTo(): BladesConsequence|undefined {
    if (this.isAccepted) { return undefined; }
    if (!this.canResistWithRoll) { return undefined; }
    if (this.resistWithRollNegates) { return this.consequenceNone; }
    if (this.resistConsequences.length === 1) { return this.resistConsequences[0]; }
    return this.resistConsequences.find((csq) => csq.type !== ConsequenceType.None);
  }
  get armorTo(): BladesConsequence|undefined {
    if (this.isAccepted) { return undefined; }
    if (!this.canResistWithArmor) { return undefined; }
    if (!(
      this.primary instanceof BladesPC
      || BladesItem.IsType(this.primary, BladesItemType.cohort_expert, BladesItemType.cohort_gang)
    )) {
      return undefined;
    }
    if (!this.primary.hasArmor) { return undefined; }
    if (this.resistWithArmorNegates) { return this.consequenceNone; }
    if (this.resistConsequences.length === 1) { return this.resistConsequences[0]; }
    return this.resistConsequences.find((csq) => csq.type !== ConsequenceType.None);
  }
  get specialTo(): BladesConsequence|undefined {
    if (this.isAccepted) { return undefined; }
    if (!this.canResistWithSpecial) { return undefined; }
    if (!(this.primary instanceof BladesPC)) { return undefined; }
    if (!this.primary.hasSpecialArmor) { return undefined; }
    if (this.resistWithSpecialNegates) { return this.consequenceNone; }
    if (this.resistConsequences.length === 1) { return this.resistConsequences[0]; }
    return this.resistConsequences.find((csq) => csq.type !== ConsequenceType.None);
  }

  constructor(
    config: BladesConsequence.Config,
    parentCsq?: BladesConsequence|BladesConsequence.Data
  )
  constructor(
    data: BladesConsequence.Data
  )
  constructor(
    schema: Partial<BladesConsequence.Schema>,
    parentCsq: BladesConsequence|BladesConsequence.Data
  )
  constructor(
    dataConfigOrSchema: BladesConsequence.Config|BladesConsequence.Data|Partial<BladesConsequence.Schema>,
    parentCsq?: BladesConsequence|BladesConsequence.Data
  ) {
    // If a parentCsq is provided...
    if (parentCsq) {
      // ... use it to construct a BladesTargetLink.Config object
      const linkConfig = BladesTargetLink.BuildLinkConfig(parentCsq);
      if ("targetKey" in linkConfig) {
        linkConfig.targetKey = `${linkConfig.targetKey}.${parentCsq.id}.resistData` as TargetKey;
      } else {
        linkConfig.targetFlagKey = `${linkConfig.targetFlagKey}.${parentCsq.id}.resistData` as TargetFlagKey;
      }
      // ... supplement missing schema values with those from parentCsq
      const {rollData, primaryID, attribute, attributeVal, specialFooterMsg} = parentCsq;
      dataConfigOrSchema.rollData = rollData;
      dataConfigOrSchema.primaryID ??= primaryID;
      dataConfigOrSchema.attribute = attribute;
      dataConfigOrSchema.attributeVal ??= attributeVal;
      dataConfigOrSchema.specialFooterMsg = specialFooterMsg;
      dataConfigOrSchema.parentCsqID = parentCsq.id;
      super({...dataConfigOrSchema, ...linkConfig});
      if (!this.isLinkInitialized) {
        this.initTargetLink();
      }
    } else {
      super(dataConfigOrSchema);
    }
    game.eunoblades.Consequences.set(this.id, this);
  }

  async initResist(typeRef: BladesConsequence.ResistanceType) {

    if (typeRef === "resist") {
      if (!this.resistTo) { return; }
      // Initiate resistance roll.
      const resistConfig: BladesRoll.Config = {
        target: this.target,
        targetFlagKey: "storedRollsData" as TargetFlagKey,
        rollType: RollType.Resistance,
        rollUserID: game.user.id,
        rollPrimaryData: this.primary.data,
        resistanceData: {
          consequence: this.resistTo.data
        }
      };
      BladesRoll.NewRoll(resistConfig);
      return;
    }

    this.resolveResist(typeRef);
  }

  async resolveResist(typeRef: BladesConsequence.ResistanceType, resistRoll?: BladesRoll) {

    // If consequence is fully negated, transform to "None" consequence and accept it.

    // Otherwise, get OTHER possible ResistanceType options.  If there are any, convert them into full-negation resist options for this new resisted consequence
    //  (we're assuming that if a player resists a consequence twice, they should be able to fully negate it)
    // Need to check if 'armor' can be used twice -- i.e. via heavy armor

    // If there are NO other possible resistance options, transform to resisted consequence and accept it.

    /** Originally in BladesRoll.resolveRoll()
     *
     *   const {id: csqID} = this.rollConsequence ?? {};
     *   const {chatID} = this.rollConsequence?.resistTo ?? {};
     *   const chatMessage = game.messages.get(chatID ?? "");
     *   if (chatMessage && csqID) {
     *     const resistedCsq = BladesConsequence.GetFromChatMessage(chatMessage, csqID);
     *     if (resistedCsq && this.rollConsequence?.resistTo) {
     *       const rollHTML = await renderTemplate(this.resultChatTemplate, Object.assign(this, {icon: this.rollConsequence.resistTo.icon ?? ""}));
     *       await resistedCsq.applyResistedConsequence("resist", rollHTML);
     *     }
     *   }
     */
  }

  async resolveAccept() {
    if (!(this.target instanceof BladesChat)) {
      throw new Error("Attempt to accept a consequence that is not a chat message.");
    }
    const {data} = this;
    data.isAccepted = true;
    data.wasResisted = false;
    data.acceptanceMode = "accept";
    // If HARM -> Apply harm to actor.
    if (/Harm/.exec(this.type)) {
      this.primary.applyHarm(
        U.pInt(this.type.substring(this.type.length - 1)) as harmLevel,
        this.name
      );
    // If WORSE POSITION -> Add flag to user to be checked on next Action roll, then cleared
    } else if (this.type === ConsequenceType.WorsePosition) {
      this.primary.applyWorsePosition();
    // If REDUCED EFFECT -> Update chat message flag to reduced effect level.
    } else if (this.type === ConsequenceType.ReducedEffect) {

      const curIndex = Object.values(Effect)
        .findIndex((val) => val === (this.target as BladesChat).flagData.rollData?.rollEffectFinal);
      if (curIndex >= 1) {
        const newEffect = Object.values(Effect)[curIndex - 1];
        await this.target.setFlagVal("rollData", "rollEffectFinal", newEffect);
      }
    }
    // If COMPLICATION -> No change.
    // If LOST OPPORTUNITY -> No change.
    await this.updateTargetData(data);
    await this.target.regenerateFromFlags();
  }

  async transformToCsq(csqSchema: BladesConsequence.Schema) {
    const newSchemaData: BladesConsequence.Data = {
      ...csqSchema,
      ...this.linkData
    };

    return await this.updateTargetData(newSchemaData);
  }
}


interface BladesConsequence {

}

export default BladesConsequence;
