import BladesChat from "../../BladesChat";
import C, {AttributeTrait, ConsequenceType, RollResult, RollType, Position, Effect} from "../../core/constants";
import BladesRoll from "../../BladesRoll";

class BladesConsequence {

  static async GetFromChatMessage(message: ChatMessage): Promise<BladesConsequence[]> {

    const html$ = $(await message.getHTML());
    const rollContainer$ = html$.find(".blades-roll");
    if (!rollContainer$[0]) { return []; }
    const rollID = rollContainer$.data("roll-id");
    const chatID = message.id as string;
    const userID = rollContainer$.data("user-id");
    const position = rollContainer$.data("position") as Position;
    const effect = rollContainer$.data("effect") as Effect;
    const result = rollContainer$.data("result") as RollResult.partial|RollResult.fail;
    const threeCsqContainer$ = rollContainer$.find(".consequence-container");
    if (!threeCsqContainer$[0]) { return []; }
    const csqs$ = threeCsqContainer$.find(".comp.consequence-display-container");

    function getBaseData(csq$: JQuery<HTMLElement>): BladesConsequence.Data.Base {
      const id = csq$.data("csq-id");
      const name = csq$.find("consequence-name.base-consequence").text();
      const type = csq$.find(".base-consequence .consequence-icon-img").attr("src")
        ?.replace(/^.+\/[^/-]+-(.*?)\.svg/g, function(_, typeStr) {
          return typeStr.replace(/(?:^|-)(.)/g, function(_$: never, char: string) {
            return char.toUpperCase();
          });
        }) as ConsequenceType|undefined ?? ConsequenceType.None;

      return {id, name, type};
    }

    function getResistableData(
      csq$: JQuery<HTMLElement>,
      csqClass: string
    ): BladesConsequence.Data.Resistable|Record<string, never> {
      // There will only ever be three possible resistable consequences, all marked out similarly
      // For chained resistances, a dialog popup should appear to the GM when the roll is sent to chat.

      // First, check for consequence's existence by looking for its button
      const rCsqButton$ = csq$.find(`.consequence-button-container.${csqClass}`);
      if (!rCsqButton$[0]) { return {}; }

      const baseData = getBaseData(csq$);

      const resistData: BladesConsequence.Data.Main = {
        id: rCsqButton$.data("csq-id"),
        chatID, userID, rollID,
        position, effect, result,
        name: csq$.find(`.consequence-name.${csqClass}`).text(),
        type: csq$.find(`${csqClass}. .consequence-icon-img`).attr("src")
          ?.replace(/^.+\/[^/-]+-(.*?)\.svg/g, function(_, typeStr) {
            return typeStr.replace(/(?:^|-)(.)/g, function(_$: never, char: string) {
              return char.toUpperCase();
            });
          }) as ConsequenceType|undefined ?? ConsequenceType.None
      };

      // If we're looking for a 'resist-consequence', we need an attribute trait and value
      if (csqClass.startsWith("resist")) {
        const attrMsg$ = csq$.find(".consequence-resist-attribute.resist-consequence");
        return {
          ...baseData,
          chatID, userID, rollID,
          position, effect, result,
          resistTo: resistData,
          attribute: attrMsg$.text().trim().toLowerCase() as AttributeTrait,
          attributeVal: Array.from(attrMsg$.find(".full-dot")).length
        };
      } else if (csqClass.startsWith("special")) {
        return {
          ...baseData,
          chatID, userID, rollID,
          position, effect, result,
          specialTo: resistData,
          footerMsg: csq$.find(`.consequence-footer-container .${csqClass}`)?.text()
        };
      } else if (csqClass.startsWith("armor")) {
        return {
          ...baseData,
          chatID, userID, rollID,
          position, effect, result,
          armorTo: resistData
        };
      }

      return {};
    }

    const bCsqs: BladesConsequence[] = [];

    csqs$.each((_, elem) => {
      const elem$ = $(elem);
      const csqData = {
        ...getBaseData(elem$),
        ...getResistableData(elem$, "resist-consequence"),
        ...getResistableData(elem$, "armor-consequence"),
        ...getResistableData(elem$, "special-armor-consequence")
      };
      bCsqs.push(new BladesConsequence(csqData));
    });

    return bCsqs;
  }

  _id: string;

  get id(): string { return this._id; }

  _rollID: string;

  _chatMessage: ChatMessage;

  _user: User;

  _name: string;

  _type: ConsequenceType;

  _position: Position;

  _effect: Effect;

  _result: RollResult.partial|RollResult.fail;

  _resistTo?: BladesConsequence;

  _attribute?: AttributeTrait;

  _attributeVal?: number;

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
      id, chatID, userID, rollID,
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

    if (typeof id !== "string") { throw new Error("[new BladesConsequence] Missing 'id' in constructor data object."); }
    if (typeof rollID !== "string") { throw new Error("[new BladesConsequence] Missing 'rollID' in constructor data object."); }
    if (typeof chatID !== "string") { throw new Error("[new BladesConsequence] Missing 'chatID' in constructor data object."); }
    const chatMessage = game.messages.get(chatID);
    if (!(chatMessage instanceof ChatMessage)) { throw new Error(`[new BladesConsequence] No chat message with id '${chatID}' found.`); }
    if (typeof userID !== "string") { throw new Error("[new BladesConsequence] Missing 'userID' in constructor data object."); }
    const user = game.users.get(userID);
    if (!(user instanceof User)) { throw new Error(`[new BladesConsequence] No user with id '${userID}' found.`); }
    if (typeof name !== "string") { throw new Error("[new BladesConsequence] Missing 'name' in constructor data object."); }
    if (!(typeof type === "string" && type in ConsequenceType)) { throw new Error("[new BladesConsequence] Missing 'type' in constructor data object."); }
    if (!(typeof position === "string" && position in Position)) { throw new Error("[new BladesConsequence] Missing 'position' in constructor data object."); }
    if (!(typeof effect === "string" && type in Effect)) { throw new Error("[new BladesConsequence] Missing 'effect' in constructor data object."); }
    if (!(typeof result === "string" && [RollResult.partial, RollResult.fail].includes(result))) { throw new Error("[new BladesConsequence] Missing 'result' in constructor data object."); }

    this._id = id;
    this._rollID = rollID;
    this._chatMessage = chatMessage;
    this._user = user;
    this._name = name;
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
      if (!resistTo.name) { throw new Error("[new BladesConsequence] Missing 'resistTo.name' in constructor data object."); }
      if (!resistTo.type) { throw new Error("[new BladesConsequence] Missing 'resistTo.type' in constructor data object."); }
      this._resistTo = new BladesConsequence(resistTo);
    }

    if (armorTo) {
      if (!armorTo.id) { throw new Error("[new BladesConsequence] Missing 'armorTo.id' in constructor data object."); }
      if (!armorTo.name) { throw new Error("[new BladesConsequence] Missing 'armorTo.name' in constructor data object."); }
      if (!armorTo.type) { throw new Error("[new BladesConsequence] Missing 'armorTo.type' in constructor data object."); }
      this._armorTo = new BladesConsequence(armorTo);
    }

    if (specialTo) {
      if (!specialTo.id) { throw new Error("[new BladesConsequence] Missing 'specialTo.id' in constructor data object."); }
      if (!specialTo.name) { throw new Error("[new BladesConsequence] Missing 'specialTo.name' in constructor data object."); }
      if (!specialTo.type) { throw new Error("[new BladesConsequence] Missing 'specialTo.type' in constructor data object."); }
      this._specialTo = new BladesConsequence(specialTo);
    }
  }

  async applyConsequence() {
    // If HARM -> Apply harm to actor.
    if (/Harm/.exec(csqData.type)) {
      await this.rollPrimary.applyHarm(
        U.pInt(csqData.type.substring(csqData.type.length - 1)) as 1|2|3|4,
        csqData.name
      );
    } else if (csqData.type === ConsequenceType.WorsePosition) {
      await this.rollPrimary.applyWorsePosition();
    }

    // If COMPLICATION -> ???

    // If REDUCED EFFECT -> Edit effect on roll instance to one lower

    // If WORSE POSITION -> Add flag to user to be checked on next Action roll, then cleared

    // If LOST OPPORTUNITY -> No change

    // ... then rerender chat message with updated consequences
  }

  async acceptConsequence() {
    const acceptedCsqData: BladesRoll.AcceptedConsequenceData = {
      ...csqData,
      isAccepted: true,
      type: csqData.type as ConsequenceType,
      typeDisplay: C.ConsequenceDisplay[csqData.type as ConsequenceType],
      icon: C.ConsequenceIcons[csqData.type as ConsequenceType]
    };
    await this.updateConsequence(acceptedCsqData);
    await this.applyConsequence(acceptedCsqData);
  }

  async updateConsequence(cData: BladesRoll.ConsequenceData|BladesRoll.AcceptedConsequenceData) {
    const {finalPosition, rollResult} = this;
    if (typeof rollResult === "string" && rollResult in RollResult) {
      await this.setFlagVal(`consequenceData.${finalPosition}.${rollResult}.${cData.id}`, null);
      await this.setFlagVal(`consequenceData.${finalPosition}.${rollResult}.${cData.id}`, cData);
      await this.chatMessage?.reRender(await this.getResultHTML());
    }
  }

  async resistConsequence(csqID: string) {
    eLog.checkLog3("rollCollab", `Resisting Consequence id ${csqID}`);
    const csq = this.getConsequenceByID(csqID);
    if (!csq) { throw new Error(`No consequence with id '${csqID}' found.`); }
    if (!(csq.attribute in AttributeTrait)) { throw new Error("blah"); }
    if (!csq.resistTo) { throw new Error("blach"); }
    if (typeof csq.attributeVal !== "number") { throw new Error("blah"); }
    const resistConfig = {
      rollType: RollType.Resistance,
      rollUserID: this.flagData.rollUserID,
      rollPrimaryData: this.rollPrimary,
      resistanceData: {
        consequence: {
          id: csq.id,
          name: csq.name,
          type: csq.type,
          icon: csq.icon,
          typeDisplay: csq.typeDisplay,
          attribute: csq.attribute as AttributeTrait,
          attributeVal: csq.attributeVal as number,
          resistTo: csq.resistTo
        }
      }
    };
    BladesRoll.NewRoll(resistConfig);
  }

  async resistArmorConsequence(csqID: string) {
    eLog.checkLog3("rollCollab", `Armoring Consequence id ${csqID}`);
    /* ... */
  }

  async resistSpecialArmorConsequence(csqID: string) {
    eLog.checkLog3("rollCollab", `SpecArmoring Consequence id ${csqID}`);
    /* ... */
  }

}

interface BladesConsequence {

}

export default BladesConsequence;
