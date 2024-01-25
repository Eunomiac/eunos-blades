/* no-dupe-class-members */

import C, {BladesActorType, AttributeTrait, ConsequenceType, RollResult, RollType, Position, Effect, RollPhase} from "../core/constants";
import U from "../core/utilities";
import BladesRoll, {BladesRollPrimary} from "./BladesRoll";
import BladesChat from "./BladesChat";

class BladesConsequence {

  static async Initialize() {
    if (!game.messages) { throw new Error("[BladesConsequence] Messages Not Ready!"); }
    return Promise.all(game.messages.contents
      .map(async (msg) => BladesConsequence.GetFromChatMessage(msg))
    );
  }

  static get None() {
    return {
      id: randomID() as IDString,
      name: "",
      type: ConsequenceType.None,
      isSelected: true,
      isVisible: true
    };
  }

  static GetActiveRollChatID(): string | undefined {
    return Array.from(game.messages).filter((msg) => $(msg.content ?? "").data("chat-id")).pop()?.id ?? undefined;
  }

  static ApplyChatListeners(html: JQuery<HTMLElement> | HTMLElement) {
    const html$ = $(html);
    const roll$ = html$.find(".blades-roll");
    if (!roll$[0]) {return;}
    const chat$ = roll$.closest(".chat-message");
    const message = game.messages.get(chat$.data("message-id") as IDString);
    if (!message) { return; }

    // Add classes to the top chat message defining the roll type
    if (roll$.hasClass("roll-type-action")) {
      chat$.addClass("action-roll");
    } else if (roll$.hasClass("roll-type-resistance")) {
      chat$.addClass("resistance-roll");
    } else if (roll$.hasClass("roll-type-fortune")) {
      chat$.addClass("fortune-roll");
    } else if (roll$.hasClass("roll-type-indulgevice")) {
      chat$.addClass("indulgevice-roll");
    }

    // If this message is an action roll result AND there are unresolved consequences, add 'unresolved-action-roll' class.
    if (
      roll$.hasClass("roll-type-action")
      && Array.from(roll$.find(".comp.consequence-display-container:not(.consequence-accepted)")).length >= 1
    ) {
      chat$.addClass("unresolved-action-roll");
    } else {
      chat$.removeClass("unresolved-action-roll");
    }

    // If this message is the last one, add 'active-chat-roll' class and remove it from all others
    if (BladesConsequence.GetActiveRollChatID() === roll$.data("chatId")) {
      $(document).find(".chat-message").removeClass("active-chat-roll");
      chat$.addClass("active-chat-roll");
    } else {
      chat$.removeClass("active-chat-roll");
    }

    const rollPhase = roll$.data("rollPhase") as RollPhase;
    if (rollPhase !== RollPhase.AwaitingConsequences) {return;}

    html$.find("[data-action*='-consequence']").on({
      click: async (event: ClickEvent) => {
        const csqElem$ = $(event.currentTarget);
        const action = csqElem$.data("action");
        const csqID = csqElem$.closest(".comp.consequence-display-container").data("csq-id") as IDString;
        const csq = BladesConsequence.GetFromChatMessage(message, csqID);
        if (!csq) { throw new Error(`Could not find consequence with ID ${csqID} in message ${message.id}`); }
        switch (action) {
          case "accept-consequence": {
            await csq.accept();
            break;
          }
          case "resist-consequence": {
            await csq.resistConsequence();
            break;
          }
          case "armor-consequence": {
            await csq.resistArmorConsequence();
            break;
          }
          case "special-consequence": {
            await csq.resistSpecialArmorConsequence();
            break;
          }
          default:
        }
      }
    });
  }

  static GetFromChatMessage(msg: BladesChat, csqId: IDString): BladesConsequence|undefined
  static GetFromChatMessage(msg: BladesChat): BladesConsequence[]
  static GetFromChatMessage(msg: BladesChat, csqID?: IDString):
    BladesConsequence[]
    |BladesConsequence
    |undefined {

    if (!csqID) {
      const csqIDs = Object.values(msg.rollConsequencesData).map((cData) => cData.id);
      return csqIDs
        .map((id) => BladesConsequence.GetFromChatMessage(msg, id))
        .filter(Boolean) as BladesConsequence[];
    }

    const csqData = msg.rollConsequencesData.find((cData) => cData.id === csqID);
    if (!csqData) {
      throw new Error(`Could not find consequence data for ID ${csqID} in message ${msg.id}`);
    }
    const {type, resistTo, armorTo, specialArmorTo: specialTo} = csqData;
    if (!(type in ConsequenceType)) {
      throw new Error(`Consequence type ${type} is not a valid consequence type`);
    }

    return new BladesConsequence({
      ...csqData,
      type: type as ConsequenceType,
      chatID: msg.id as IDString,
      rollID: msg.flags.rollID as IDString,
      userID: msg.flags.rollUserID,
      primaryID: msg.flags.rollPrimaryData.rollPrimaryID as IDString,
      primaryType: msg.flags.rollPrimaryData.rollPrimaryType,
      position: msg.flags.finalPosition,
      effect: msg.flags.finalEffect,
      result: msg.flags.rollResult as RollResult.partial | RollResult.fail,
      resistTo: resistTo as BladesConsequence.Data.Base || undefined,
      armorTo: armorTo as BladesConsequence.Data.Base || undefined,
      specialTo: specialTo as BladesConsequence.Data.Base || undefined
    });
  }

  _id: IDString;

  get id(): IDString { return this._id; }

  chatID: IDString;

  rollID: IDString;

  userID: IDString;

  primaryID: IDString;

  primaryType: BladesRoll.PrimaryDocType;

  primaryDoc: BladesRollPrimary;

  chatMessage: BladesChat;
  get targetChatKey(): TargetKey {
    const {finalPosition, rollResult} = this.chatMessage.flags;
    return `flags.consequenceData.${finalPosition}.${rollResult}.${this._id}` as TargetKey;
  }
  user: User;

  name: string;

  type: ConsequenceType;

  get typeDisplay(): string { return C.ConsequenceDisplay[this.type]; }

  get icon(): string { return C.ConsequenceIcons[this.type]; }

  position: Position;

  effect: Effect;

  result: RollResult.partial|RollResult.fail;

  resistTo?: BladesConsequence;

  get resistToData(): BladesConsequence.ParsedData.Main|undefined {
    if (!this.resistTo) { return undefined; }
    return {
      id: this.resistTo.id,
      chatID: this.chatMessage.id as IDString,
      userID: this.user.id as IDString,
      rollID: this.rollID,
      primaryID: this.primaryID,
      primaryType: this.primaryType,
      position: this.position,
      effect: this.effect,
      result: this.result,
      name: this.resistTo.name,
      type: this.resistTo.type,
      typeDisplay: this.resistTo.typeDisplay,
      icon: this.resistTo.icon
    };
  }

  attribute?: AttributeTrait|"";

  attributeVal?: number;

  armorTo?: BladesConsequence;

  specialTo?: BladesConsequence;

  isAccepted: boolean;

  constructor(
    data: BladesConsequence.Data.Base
      | BladesConsequence.Data.Main
      | BladesConsequence.Data.Resistable
      | BladesConsequence.Data.Accepted,
    parentCsq?: BladesConsequence
  ) {
    const {
      id, chatID, userID, rollID, primaryID, primaryType,
      position, effect, result
    } = {...parentCsq ?? {}, ...data} as
      BladesConsequence.Data.Base
      & BladesConsequence.Data.Main
      & BladesConsequence.Data.Resistable
      & BladesConsequence.Data.Accepted;

    const {
      name, type,
      attribute, attributeVal,
      resistTo,
      armorTo,
      specialTo,
      isAccepted
    } = data as
      BladesConsequence.Data.Base
      & BladesConsequence.Data.Main
      & BladesConsequence.Data.Resistable
      & BladesConsequence.Data.Accepted;

    eLog.checkLog3("bladesConsequence", "[new BladesConsequence]", {
      parentCsq,
      id, chatID, userID, rollID, primaryID, primaryType,
      name,
      type,
      position, effect, result,
      attribute, attributeVal, resistTo,
      armorTo,
      specialTo,
      isAccepted
    });

    if (typeof id !== "string") { throw new Error("[new BladesConsequence] Missing 'id' in constructor data object."); }
    if (typeof rollID !== "string") { throw new Error("[new BladesConsequence] Missing 'rollID' in constructor data object."); }
    if (typeof chatID !== "string") { throw new Error("[new BladesConsequence] Missing 'chatID' in constructor data object."); }
    const chatMessage = game.messages.get(chatID);
    if (!(chatMessage instanceof BladesChat)) { throw new Error(`[new BladesConsequence] No chat message with id '${chatID}' found.`); }
    if (typeof userID !== "string") { throw new Error("[new BladesConsequence] Missing 'userID' in constructor data object."); }
    const user = game.users.get(userID);
    if (!(user instanceof User)) { throw new Error(`[new BladesConsequence] No user with id '${userID}' found.`); }
    if (typeof primaryID !== "string") { throw new Error("[new BladesConsequence] Missing 'primaryID' in constructor data object."); }
    if (typeof primaryType !== "string") { throw new Error("[new BladesConsequence] Missing 'primaryType' in constructor data object."); }
    const primaryCollection = primaryType in BladesActorType ? game.actors : game.items;
    const primaryDoc = primaryCollection.get(primaryID);
    if (!(BladesRollPrimary.IsDoc(primaryDoc))) { throw new Error(`[new BladesConsequence] No primary document with id '${primaryID}' of type '${primaryType}' found.`); }
    if (typeof name !== "string") { throw new Error("[new BladesConsequence] Missing 'name' in constructor data object."); }
    if (!(typeof type === "string" && type in ConsequenceType)) { throw new Error("[new BladesConsequence] Missing 'type' in constructor data object."); }
    if (!(typeof position === "string" && position in Position)) { throw new Error("[new BladesConsequence] Missing 'position' in constructor data object."); }
    if (!(typeof effect === "string")) { throw new Error("[new BladesConsequence] Missing 'effect' in constructor data object."); }
    if (!(typeof result === "string" && [RollResult.partial, RollResult.fail].includes(result))) { throw new Error("[new BladesConsequence] Missing 'result' in constructor data object."); }

    this._id = id;
    this.rollID = rollID;
    this.chatMessage = chatMessage;
    this.chatID = chatMessage.id;
    this.user = user;
    this.userID = user.id as IDString;
    this.name = name;
    this.primaryID = primaryID;
    this.primaryType = primaryType;
    this.primaryDoc = new BladesRollPrimary(undefined, primaryDoc);
    this.type = type as ConsequenceType;
    this.position = position as Position;
    this.effect = effect as Effect;
    this.result = result as RollResult.partial|RollResult.fail;
    this.isAccepted = Boolean(isAccepted);

    if (resistTo) {
      if (!(typeof attribute === "string" && attribute in AttributeTrait)) { throw new Error("[new BladesConsequence] Missing 'attribute' in constructor data object."); }
      this.attribute = attribute;
      if (typeof attributeVal !== "number") { throw new Error("[new BladesConsequence] Missing 'attributeVal' in constructor data object."); }
      this.attributeVal = attributeVal;

      if (!resistTo.id) { throw new Error("[new BladesConsequence] Missing 'resistTo.id' in constructor data object."); }
      if (!resistTo.type) { throw new Error("[new BladesConsequence] Missing 'resistTo.type' in constructor data object."); }
      if (!resistTo.name && resistTo.type !== ConsequenceType.None) { throw new Error("[new BladesConsequence] Missing 'resistTo.name' in constructor data object."); }
      this.resistTo = new BladesConsequence(resistTo, this);
    }

    if (armorTo) {
      if (!armorTo.id) { throw new Error("[new BladesConsequence] Missing 'armorTo.id' in constructor data object."); }
      if (!armorTo.type) { throw new Error("[new BladesConsequence] Missing 'armorTo.type' in constructor data object."); }
      if (!armorTo.name && armorTo.type !== ConsequenceType.None) { throw new Error("[new BladesConsequence] Missing 'armorTo.name' in constructor data object."); }
      this.armorTo = new BladesConsequence(armorTo, this);
    }

    if (specialTo) {
      if (!specialTo.id) { throw new Error("[new BladesConsequence] Missing 'specialTo.id' in constructor data object."); }
      if (!specialTo.type) { throw new Error("[new BladesConsequence] Missing 'specialTo.type' in constructor data object."); }
      if (!specialTo.name && specialTo.type !== ConsequenceType.None) { throw new Error("[new BladesConsequence] Missing 'specialTo.name' in constructor data object."); }
      this.specialTo = new BladesConsequence(specialTo, this);
    }

    game.eunoblades.Consequences.set(this.id, this);
  }


  async accept() {
    const messageUpdateData: Record<string, unknown> = {
      [`${this.targetChatKey}.isAccepted`]: true
    };
    // If HARM -> Apply harm to actor.
    if (/Harm/.exec(this.type)) {
      await this.primaryDoc.applyHarm(
        U.pInt(this.type.substring(this.type.length - 1)) as harmLevel,
        this.name
      );
    // If WORSE POSITION -> Add flag to user to be checked on next Action roll, then cleared
    } else if (this.type === ConsequenceType.WorsePosition) {
      await this.primaryDoc.applyWorsePosition();
    // If REDUCED EFFECT -> Update chat message flag to reduced effect level.
    } else if (this.type === ConsequenceType.ReducedEffect) {
      const curIndex = Object.values(Effect).findIndex((val) => val === this.chatMessage.flags.finalEffect);
      if (curIndex >= 1) {
        const newEffect = Object.values(Effect)[curIndex - 1];
        messageUpdateData["flags.finalEffect"] = newEffect;
      }
    }
    // If COMPLICATION -> No change.
    // If LOST OPPORTUNITY -> No change.
    await this.chatMessage.update(messageUpdateData);
    await this.chatMessage.regenerateFromFlags();
  }

  async resist(typeRef: BladesConsequence.ResistanceType) {
    const rCsq = {
      resist: this.resistTo,
      armor: this.armorTo,
      special: this.specialTo
    }[typeRef];

    // If consequence is fully negated, transform to "None" consequence and accept it.

    // Otherwise, get OTHER possible resistance options.  If there are any, convert them into full-negation resist options for this new resisted consequence
    //  (we're assuming that if a player resists a consequence twice, they should be able to fully negate it)
    // Need to check if 'armor' can be used twice -- i.e. via heavy armor

    // If there are NO other possible resistance options, transform to resisted consequence and accept it.
  }

  async transformToConsequence(typeRef: BladesConsequence.ResistanceType, rollHTML?: string) {

    const transformRecord: Record<string, string> = {};

    // Create HTML for accepted version of this consequence
    let csqAcceptedHTML = await renderTemplate(
      "systems/eunos-blades/templates/components/consequence-accepted.hbs",
      Object.assign(this, {blockClass: "consequence-resisted"})
    );

    transformRecord["1) csqAcceptedHTML"] = csqAcceptedHTML;

    // Get the resisted consequence data according to typeRef
    const rCsq = {
      resist: this.resistTo,
      armor: this.armorTo,
      special: this.specialTo
    }[typeRef];
    if (!rCsq) { return; }


    // Get HTML for the consequence it resisted to
    let csqResistedHTML = await renderTemplate(
      "systems/eunos-blades/templates/components/consequence-accepted.hbs",
      rCsq
    );


    // Add a class, identifying this ".comp.comp-consequence-display-container" as a 'sub-consequence' that resulted from resisting a worse consequence
    csqResistedHTML = $(csqResistedHTML)
      .addClass("sub-consequence-resisted")[0].outerHTML;
    transformRecord["2) csqResistedHTML"] = csqResistedHTML;

    // If roll HTML provided, extract attribute, icon, dice roll strip and stress cost message, and prepend them to sub-consequence container

    /**
     *     <div class="blades-roll roll-type-resistance">
            <div class="chat-message-bg"></div>
            <div class="resistance-roll-one-line flex-horizontal full-width">
              <img class="consequence-icon-img"
                src="systems/eunos-blades/assets/icons/consequence-icons/base-worse-position.svg">
              <div class="resistance-roll-vertical-right flex-vertical full-width">
                <div class="resistance-roll-attr-dice flex-horizontal full-width">
                  <span class="trait-label">RESOLVE: </span>
                  <div class="dice-roll-strip"><span class="blades-die blades-die-critical blades-die-6"><img
                        src="systems/eunos-blades/assets/dice/image/grad-6-crit.webp"></span><span
                      class="blades-die blades-die-critical blades-die-6"><img
                        src="systems/eunos-blades/assets/dice/image/grad-6-crit.webp"></span><span
                      class="blades-die blades-die-fail blades-die-2"><img
                        src="systems/eunos-blades/assets/dice/image/grad-2.webp"></span><span
                      class="blades-die blades-die-fail blades-die-1"><img
                        src="systems/eunos-blades/assets/dice/image/grad-1.webp"></span><span
                      class="blades-die blades-die-fail blades-die-1"><img
                        src="systems/eunos-blades/assets/dice/image/grad-1.webp"></span></div>
                </div>
                <div class="resistance-cost-row cost-bonus">
                  <h3>Alistair <em>Recovers</em> 1 Stress</h3>
                </div>
              </div>
            </div>
          </div>
     */


    if (rollHTML) {
      const rollHTML$ = $(rollHTML);
      const rollDetailContainer$ = $("<div class='roll-detail-container flex-horizontal full-width'></div>").appendTo($(csqResistedHTML));

      // rollHTML$.find(".consequence-icon-img").addClass("csq-resisted").appendTo(csqHTML$);
      rollHTML$.find(".trait-label").addClass("csq-resisted").appendTo(rollDetailContainer$);
      rollHTML$.find(".dice-roll-strip").addClass("csq-resisted").appendTo(rollDetailContainer$);
      rollHTML$.find(".resistance-cost-row").addClass("csq-resisted").appendTo(rollDetailContainer$);

      csqResistedHTML = rollDetailContainer$.parent()[0].outerHTML;
      transformRecord["2.2) csqResistedHTML + rollHTML"] = csqResistedHTML;
    }

    // Add the roll overlay
    csqResistedHTML = $(csqResistedHTML).prepend($(`
    <div class="resist-overlay ${typeRef}-resist-overlay">
      <img class="resist-overlay-img ${typeRef}-resist-overlay-img" src="systems/eunos-blades/assets/icons/misc-icons/${typeRef}-resist.svg" />
    </div>`))[0].outerHTML;
    transformRecord["2.3) csqResistedHTML + overlay"] = csqResistedHTML;

    // Prepend the resisted consequence HTML to the accepted consequence HTML
    csqAcceptedHTML = $(csqAcceptedHTML).prepend($(csqResistedHTML))[0].outerHTML;

    transformRecord["3) csqAcceptedHTML + csqResistedHTML"] = csqAcceptedHTML;

    // Get message HTML
    const message$ = $(await this.chatMessage.getHTML());

    transformRecord["4) message$ before Replace"] = message$[0].outerHTML;

    // Replace consequence with new data
    message$.find(`.comp.consequence-display-container[data-csq-id='${this._id}']`)
      .replaceWith(csqAcceptedHTML);

    transformRecord["4.5) message$ after Replace"] = message$[0].outerHTML;
    transformRecord["5) message$.find(.blades-roll) = CONTENT"] = message$.find(".blades-roll")[0].outerHTML;

    await this.chatMessage.update({content: message$.find(".blades-roll")[0].outerHTML});

    eLog.checkLog2("transformConsequence", "Transform Record", transformRecord);
  }

  // get rollFlagData(): BladesRoll.FlagData {
  //   // Get rollPrimaryData from archived roll flags on user document.
  //   let rollFlagData = this._user.getFlag(C.SYSTEM_ID, "rollCollab") as BladesRoll.FlagData;
  //   if (rollFlagData.rollID !== this._rollID) {
  //     rollFlagData = this._user.getFlag(C.SYSTEM_ID, `rollCollabArchive.${this._rollID}`) as BladesRoll.FlagData;
  //   }
  //   if (!rollFlagData) { throw new Error(`Unable to locate flag data for roll id '${this._rollID}'`); }
  //   return rollFlagData;
  // }

  async resistConsequence() {
    eLog.checkLog3("rollCollab", `Resisting Consequence id ${this._id}`);

    if (!this.resistTo || !this.resistToData) { throw new Error(`Cannot find resistTo for resistance roll for csq id '${this._id}' in message '${this.chatMessage.id}'`); }

    const resistConfig = {
      rollType: RollType.Resistance,
      rollUserID: this.user.id as IDString,
      rollPrimaryData: this.chatMessage.flags.rollPrimaryData,
      resistanceData: {
        consequence: {
          id: this.id,
          name: this.name,
          type: this.type,
          icon: this.icon,
          typeDisplay: this.typeDisplay,
          attribute: this.attribute as AttributeTrait,
          attributeVal: this.attributeVal as number,
          resistTo: this.resistToData
        }
      }
    };
    BladesRoll.NewRoll(resistConfig);
  }

  async applyResistedConsequence(resistType: "resist"|"armor"|"special", rollHTML: string) {
    const rCsq = {
      resist: this.resistTo,
      armor: this.armorTo,
      special: this.specialTo
    }[resistType];
    if (rCsq) {
      await rCsq.accept();
    }
    await this.transformToConsequence(resistType, rollHTML);
  }

  async resistArmorConsequence() {
    if (this.armorTo) {
      this.primaryDoc.spendArmor();
      this.applyResistedConsequence("armor", await renderTemplate(
        "systems/eunos-blades/templates/components/consequence-accepted.hbs",
        Object.assign(
          this.armorTo,
          {isArmorResist: true}
        )
      ));
    }
  }

  async resistSpecialArmorConsequence() {
    if (this.specialTo) {
      this.primaryDoc.spendSpecialArmor();
      this.applyResistedConsequence("special", await renderTemplate(
        "systems/eunos-blades/templates/components/consequence-accepted.hbs",
        Object.assign(
          this.specialTo,
          {isSpecialArmorResist: true}
        )
      ));
    }
  }
}

interface BladesConsequence {

}

export default BladesConsequence;
