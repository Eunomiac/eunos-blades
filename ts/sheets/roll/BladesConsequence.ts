/* no-dupe-class-members */

import C, {BladesActorType, AttributeTrait, ConsequenceType, RollResult, RollType, Position, Effect, RollPhase} from "../../core/constants";
import U from "../../core/utilities";
import BladesRoll, {BladesRollPrimary} from "../../BladesRoll";

class BladesConsequence {

  static GetActiveRollChatID(): string | undefined {
    return Array.from(game.messages).filter((msg) => $(msg.content ?? "").data("chat-id")).pop()?.id ?? undefined;
  }

  static ApplyChatListeners(html: JQuery<HTMLElement> | HTMLElement) {
    const html$ = $(html);
    const roll$ = html$.find(".blades-roll");
    if (!roll$[0]) {return;}

    // Add classes to the top chat message defining the roll type
    if (roll$.hasClass("roll-type-action")) {
      roll$.closest(".chat-message").addClass("action-roll");
    } else if (roll$.hasClass("roll-type-resistance")) {
      roll$.closest(".chat-message").addClass("resistance-roll");
    } else if (roll$.hasClass("roll-type-fortune")) {
      roll$.closest(".chat-message").addClass("fortune-roll");
    } else if (roll$.hasClass("roll-type-indulgevice")) {
      roll$.closest(".chat-message").addClass("indulgevice-roll");
    }

    // If this message is the last one, add 'active-chat-roll' class and remove it from all others
    if (BladesConsequence.GetActiveRollChatID() === roll$.data("chatId")) {
      $(document).find(".chat-message").removeClass("active-chat-roll");
      roll$.closest(".chat-message").addClass("active-chat-roll");
    } else {
      roll$.closest(".chat-message").removeClass("active-chat-roll");
    }

    const rollPhase = roll$.data("rollPhase") as RollPhase;
    eLog.checkLog3("rollCollab", "ApplyChatListeners", {html, roll$, rollPhase});
    if (rollPhase !== RollPhase.AwaitingConsequences) {return;}

    html$.find("[data-action*='-consequence']").on({
      click: async (event: ClickEvent) => {
        const csqElem$ = $(event.currentTarget);
        const action = csqElem$.data("action");
        const csq = BladesConsequence.GetFromCsqElem(csqElem$);
        switch (action) {
          case "accept-consequence": {
            await csq.acceptConsequence();
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
        }
      }
    });
  }

  static async GetFromID(msgID: string, csqID: string): Promise<BladesConsequence|undefined>
  static async GetFromID(msgID: string): Promise<BladesConsequence[]>
  static async GetFromID(msgID: string, csqID?: string): Promise<
    BladesConsequence[]
    |BladesConsequence
    |undefined
  > {
    const chatMessage = game.messages.get(msgID);
    if (chatMessage) {
      if (csqID) {
        return BladesConsequence.GetFromChatMessage(chatMessage, csqID);
      }
      return BladesConsequence.GetFromChatMessage(chatMessage);
    }
    return undefined;
  }

  static GetFromCsqElem(csqElem: JQuery<HTMLElement>|HTMLElement): BladesConsequence {
    csqElem = $(csqElem);
    const csq$ = csqElem.closest(".comp.consequence-display-container");
    const chatRoll$ = csq$.closest(".blades-roll");

    const chatID = chatRoll$.data("chat-id");
    const rollID = chatRoll$.data("roll-id");
    const userID = chatRoll$.data("user-id");
    const primaryID = chatRoll$.data("primary-id");
    const primaryType = chatRoll$.data("primary-type") as BladesRoll.PrimaryDocType;
    const position = chatRoll$.data("position") as Position;
    const effect = chatRoll$.data("effect") as Effect;
    const result = chatRoll$.data("result") as RollResult.partial|RollResult.fail;

    function getBaseData(c$: JQuery<HTMLElement>): BladesConsequence.Data.Base {
      const id = c$.data("csq-id");
      const name = c$.find(".consequence-name.base-consequence").text();
      const type = c$.data("csq-type") as ConsequenceType|undefined ?? ConsequenceType.None;

      return {id, name, type};
    }

    function getResistableData(
      c$: JQuery<HTMLElement>,
      csqClass: string
    ): BladesConsequence.Data.Resistable|Record<string, never> {
      // There will only ever be three possible resistable consequences, all marked out similarly
      // For chained resistances, a dialog popup should appear to the GM when the roll is sent to chat.

      // First, check for consequence's existence by looking for its button
      const rCsqButton$ = c$.find(`.consequence-button-container.${csqClass}`);
      if (!rCsqButton$[0]) { return {}; }
      const [rCsqRef] = csqClass.split(/-/);

      const baseData = getBaseData(c$);

      const resistData: BladesConsequence.Data.Main = {
        id: rCsqButton$.data("csq-id"),
        chatID, userID, rollID, primaryID, primaryType,
        position, effect, result,
        name: c$.find(`.consequence-name.${csqClass}`).text(),
        type: c$.data(`${rCsqRef}-type`) as ConsequenceType|undefined ?? ConsequenceType.None
      };

      // If we're looking for a 'resist-consequence', we need an attribute trait and value
      if (csqClass.startsWith("resist")) {
        const attrMsg$ = c$.find(".consequence-resist-attribute.resist-consequence");
        return {
          ...baseData,
          chatID, userID, rollID, primaryID, primaryType,
          position, effect, result,
          resistTo: resistData,
          attribute: attrMsg$.text().trim().toLowerCase() as AttributeTrait,
          attributeVal: Array.from(attrMsg$.find(".full-dot")).length
        };
      } else if (csqClass.startsWith("special")) {
        return {
          ...baseData,
          chatID, userID, rollID, primaryID, primaryType,
          position, effect, result,
          specialTo: resistData,
          footerMsg: c$.find(`.consequence-footer-container .${csqClass}`)?.text()
        };
      } else if (csqClass.startsWith("armor")) {
        return {
          ...baseData,
          chatID, userID, rollID, primaryID, primaryType,
          position, effect, result,
          armorTo: resistData
        };
      }

      return {};
    }

    return new BladesConsequence({
      ...getBaseData(csq$),
      ...getResistableData(csq$, "resist-consequence"),
      ...getResistableData(csq$, "armor-consequence"),
      ...getResistableData(csq$, "special-consequence"),
      isAccepted: csq$.hasClass("consequence-accepted")
    });

  }

  static async GetFromChatMessage(message: ChatMessage, csqId: string): Promise<BladesConsequence|undefined>
  static async GetFromChatMessage(message: ChatMessage): Promise<BladesConsequence[]>
  static async GetFromChatMessage(message: ChatMessage, csqID?: string): Promise<
    BladesConsequence[]
    |BladesConsequence
    |undefined
  > {

    const html$ = $(await message.getHTML());
    const bCsqs: BladesConsequence[] = [];

    html$.find(".blades-roll .consequence-container .comp.consequence-display-container").each((_, elem) => {
      bCsqs.push(BladesConsequence.GetFromCsqElem(elem));
    });

    if (csqID) {
      return bCsqs.find((csq) => csq.id === csqID);
    }

    return bCsqs;
  }

  _id: string;

  get id(): string { return this._id; }

  _rollID: string;

  _primaryID: string;

  _primaryType: BladesRoll.PrimaryDocType;

  _primaryDoc: BladesRoll.PrimaryDoc;

  _chatMessage: ChatMessage;

  _user: User;

  _name: string;

  get name(): string { return this._name; }

  _type: ConsequenceType;

  get type(): ConsequenceType { return this._type; }

  get typeDisplay(): string { return C.ConsequenceDisplay[this.type]; }

  get icon(): string { return C.ConsequenceIcons[this.type]; }

  _position: Position;

  _effect: Effect;

  _result: RollResult.partial|RollResult.fail;

  _resistTo?: BladesConsequence;

  get resistToData(): BladesConsequence.ParsedData.Main|undefined {
    if (!this._resistTo) { return undefined; }
    return {
      id: this._resistTo.id,
      chatID: this._chatMessage.id as string,
      userID: this._user.id as string,
      rollID: this._rollID,
      primaryID: this._primaryID,
      primaryType: this._primaryType,
      position: this._position,
      effect: this._effect,
      result: this._result,
      name: this._resistTo.name,
      type: this._resistTo.type,
      typeDisplay: this._resistTo.typeDisplay,
      icon: this._resistTo.icon
    };
  }

  _attribute?: AttributeTrait;

  get attribute(): AttributeTrait|undefined { return this._attribute; }

  _attributeVal?: number;

  get attributeVal(): number|undefined { return this._attributeVal; }

  _armorTo?: BladesConsequence;

  _specialTo?: BladesConsequence;

  _isAccepted: boolean;

  constructor(
    data: BladesConsequence.Data.Base
      | BladesConsequence.Data.Main
      | BladesConsequence.Data.Resistable
      | BladesConsequence.Data.Accepted
  ) {
    const {
      id, chatID, userID, rollID, primaryID, primaryType,
      name,
      type,
      position, effect, result,
      attribute, attributeVal, resistTo,
      armorTo,
      specialTo,
      isAccepted
    } = data as
      BladesConsequence.Data.Base
      & BladesConsequence.Data.Main
      & BladesConsequence.Data.Resistable
      & BladesConsequence.Data.Accepted;

    eLog.checkLog3("bladesConsequence", "[new BladesConsequence]", {
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
    if (!(chatMessage instanceof ChatMessage)) { throw new Error(`[new BladesConsequence] No chat message with id '${chatID}' found.`); }
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
    this._rollID = rollID;
    this._chatMessage = chatMessage;
    this._user = user;
    this._name = name;
    this._primaryID = primaryID;
    this._primaryType = primaryType;
    this._primaryDoc = primaryDoc;
    this._type = type as ConsequenceType;
    this._position = position as Position;
    this._effect = effect as Effect;
    this._result = result as RollResult.partial|RollResult.fail;
    this._isAccepted = Boolean(isAccepted);

    if (resistTo) {
      if (!(typeof attribute === "string" && attribute in AttributeTrait)) { throw new Error("[new BladesConsequence] Missing 'attribute' in constructor data object."); }
      this._attribute = attribute;
      if (typeof attributeVal !== "number") { throw new Error("[new BladesConsequence] Missing 'attributeVal' in constructor data object."); }
      this._attributeVal = attributeVal;

      if (!resistTo.id) { throw new Error("[new BladesConsequence] Missing 'resistTo.id' in constructor data object."); }
      if (!resistTo.type) { throw new Error("[new BladesConsequence] Missing 'resistTo.type' in constructor data object."); }
      if (!resistTo.name && resistTo.type !== ConsequenceType.None) { throw new Error("[new BladesConsequence] Missing 'resistTo.name' in constructor data object."); }
      this._resistTo = new BladesConsequence(resistTo);
    }

    if (armorTo) {
      if (!armorTo.id) { throw new Error("[new BladesConsequence] Missing 'armorTo.id' in constructor data object."); }
      if (!armorTo.type) { throw new Error("[new BladesConsequence] Missing 'armorTo.type' in constructor data object."); }
      if (!armorTo.name && armorTo.type !== ConsequenceType.None) { throw new Error("[new BladesConsequence] Missing 'armorTo.name' in constructor data object."); }
      this._armorTo = new BladesConsequence(armorTo);
    }

    if (specialTo) {
      if (!specialTo.id) { throw new Error("[new BladesConsequence] Missing 'specialTo.id' in constructor data object."); }
      if (!specialTo.type) { throw new Error("[new BladesConsequence] Missing 'specialTo.type' in constructor data object."); }
      if (!specialTo.name && specialTo.type !== ConsequenceType.None) { throw new Error("[new BladesConsequence] Missing 'specialTo.name' in constructor data object."); }
      this._specialTo = new BladesConsequence(specialTo);
    }
  }

  async applyConsequenceToPrimary() {
    // If HARM -> Apply harm to actor.
    if (/Harm/.exec(this._type)) {
      await this._primaryDoc.applyHarm(
        U.pInt(this._type.substring(this._type.length - 1)) as 1|2|3|4,
        this._name
      );
    // If WORSE POSITION -> Add flag to user to be checked on next Action roll, then cleared
    } else if (this._type === ConsequenceType.WorsePosition) {
      await this._primaryDoc.applyWorsePosition();
    }

    // If REDUCED EFFECT -> No change to rollPrimary.
    // If COMPLICATION -> No change to rollPrimary.
    // If LOST OPPORTUNITY -> No change to rollPrimary.
  }

  async transformToConsequence(typeRef: BladesConsequence.ResistanceType) {
    const message$ = $(await this._chatMessage.getHTML()).find(".blades-roll");

    let icon: string|undefined = undefined;
    let typeDisplay = "";
    let name = "";

    switch (typeRef) {
      case "resist": {
        if (!this._resistTo) { throw new Error(`Cannot transform csq id '${this.id}' into "resist" consequence: no resistTo data found.`); }
        if (this._resistTo.type === ConsequenceType.None) { break; }
        icon = this._resistTo.icon;
        typeDisplay = this._resistTo.typeDisplay;
        name = this._resistTo.name;
        break;
      }
      case "armor": {
        if (!this._armorTo) { throw new Error(`Cannot transform csq id '${this.id}' into "armor" consequence: no armorTo data found.`); }
        if (this._armorTo.type === ConsequenceType.None) { break; }
        icon = this._armorTo.icon;
        typeDisplay = this._armorTo.typeDisplay;
        name = this._armorTo.name;
        break;
      }
      case "special": {
        if (!this._specialTo) { throw new Error(`Cannot transform csq id '${this.id}' into "special" consequence: no specialTo data found.`); }
        if (this._specialTo.type === ConsequenceType.None) { break; }
        icon = this._specialTo.icon;
        typeDisplay = this._specialTo.typeDisplay;
        name = this._specialTo.name;
        break;
      }
    }

    eLog.checkLog2("csqTransform", "Initial Message Code", {message$, message: message$[0]});

    // Locate consequence HTML
    message$.find(`.comp.consequence-display-container[data-csq-id='${this._id}']`)
      // Replace with compiled consequence-accepted template, unless type is None, in which case erase it
      .replaceWith(icon === undefined ? "" : `
      <div class="comp consequence-display-container full-width consequence-accepted" />

      <div class="consequence-icon-container">
        <div class="consequence-icon-circle base-consequence">
          <img class="consequence-icon-img" src="systems/eunos-blades/assets/icons/consequence-icons/base-${icon}.svg" />
        </div>
      </div>

      <div class="consequence-type-container">
        <label class="consequence-type base-consequence">${typeDisplay}</label>
      </div>

      <div class="consequence-name-container">
        <label class="consequence-name base-consequence">${name}</label>
      </div>

    </div>
    `);

    eLog.checkLog2("csqTransform", "Modified Message Code", {message$, message: message$[0], outerHTML: message$[0].outerHTML});

    await this._chatMessage.update({content: message$[0].outerHTML});
  }

  async acceptConsequence() {
    await this.applyConsequenceToPrimary();
    const message$ = $(await this._chatMessage.getHTML()).find(".blades-roll");
    eLog.checkLog2("csqAccept", "Initial Message Code", {message$, message: message$[0], outerHTML: message$[0].outerHTML});

    // If this is a Reduced Effect consequence, edit the chat message roll effect accordingly.
    if (this._type === ConsequenceType.ReducedEffect) {
      const curIndex = Object.values(Effect).findIndex((val) => val === this._effect);
      if (curIndex >= 1) {
        const newEffect = Object.values(Effect)[curIndex - 1];
        message$.find(".roll-outcome-container .roll-state-container .roll-state-effect")
          .removeClass(`roll-state-effect-${this._effect}`)
          .addClass(`roll-state-effect-${newEffect}`)
          .text(U.tCase(newEffect));
      }
    }

    // Locate consequence HTML
    message$.find(`.comp.consequence-display-container[data-csq-id='${this._id}']`)
      // Add class to consequence container
      .addClass("consequence-accepted");

    eLog.checkLog2("csqAccept", "Class Added Message Code", {message$, message: message$[0], outerHTML: message$[0].outerHTML});

    // Strip all unnecessary elements for an accepted consequence
    message$.find(`.comp.consequence-display-container[data-csq-id='${this._id}']`).remove(`
        .consequence-bg-image,
        .consequence-interaction-pad,
        .accept-consequence,
        .resist-consequence,
        .armor-consequence,
        .special-consequence,
        .consequence-footer-container
      `);

    eLog.checkLog2("csqAccept", "Code Stripped Message Code", {message$, message: message$[0], outerHTML: message$[0].outerHTML});

    this._isAccepted = true;

    await this._chatMessage.update({content: message$[0].outerHTML});
  }

  async resistConsequence() {
    eLog.checkLog3("rollCollab", `Resisting Consequence id ${this._id}`);

    if (!this._resistTo || !this.resistToData) { throw new Error(`Cannot find resistTo for resistance roll for csq id '${this._id}' in message '${this._chatMessage.id}'`); }

    // Get rollPrimaryData from archived roll flags on user document.
    let rollFlagData = this._user.getFlag(C.SYSTEM_ID, "rollCollab") as BladesRoll.FlagData;
    if (rollFlagData.rollID !== this._rollID) {
      rollFlagData = this._user.getFlag(C.SYSTEM_ID, `rollCollabArchive.${this._rollID}`) as BladesRoll.FlagData;
    }
    if (!rollFlagData) { throw new Error(`Unable to locate flag data for roll id '${this._rollID}'`); }

    const resistConfig = {
      rollType: RollType.Resistance,
      rollUserID: this._user.id as string,
      rollPrimaryData: rollFlagData.rollPrimaryData,
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

  async applyResistedConsequence() {
    if (this._resistTo) {
      await this._resistTo.applyConsequenceToPrimary();
      await this.transformToConsequence("resist");
    }
  }

  async resistArmorConsequence() {
    /* ... */
  }

  async resistSpecialArmorConsequence() {
    /* ... */
  }

}

interface BladesConsequence {

}

export default BladesConsequence;
