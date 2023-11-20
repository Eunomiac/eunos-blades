import { AttributeTrait, ConsequenceType } from "../../core/constants.js";
/*~ @@DOUBLE-BLANK@@ ~*/
class BladesConsequence {
    /*~ @@DOUBLE-BLANK@@ ~*/
    static async GetFromChatMessage(message) {
        /*~ @@DOUBLE-BLANK@@ ~*/
        const html$ = $(await message.getHTML());
        const rollContainer$ = html$.find(".blades-roll");
        if (!rollContainer$[0]) {
            return [];
        }
        const rollID = rollContainer$.data("roll-id");
        const chatID = message.id;
        const userID = rollContainer$.data("user-id");
        const threeCsqContainer$ = rollContainer$.find(".consequence-container");
        if (!threeCsqContainer$[0]) {
            return [];
        }
        const csqs$ = threeCsqContainer$.find(".comp.consequence-display-container");
        /*~ @@DOUBLE-BLANK@@ ~*/
        function getBaseData(csq$) {
            const id = csq$.data("csq-id");
            const name = csq$.find("consequence-name.base-consequence").text();
            const type = csq$.find(".base-consequence .consequence-icon-img").attr("src")
                ?.replace(/^.+\/[^/-]+-(.*?)\.svg/g, function (_, typeStr) {
                return typeStr.replace(/(?:^|-)(.)/g, function (_$, char) {
                    return char.toUpperCase();
                });
            }) ?? ConsequenceType.None;
            /*~ @@DOUBLE-BLANK@@ ~*/
            return { id, name, type };
        }
        /*~ @@DOUBLE-BLANK@@ ~*/
        function getResistableData(csq$, csqClass) {
            // There will only ever be three possible resistable consequences, all marked out similarly
            // For chained resistances, a dialog popup should appear to the GM when the roll is sent to chat.
            /*~ @@DOUBLE-BLANK@@ ~*/
            // First, check for consequence's existence by looking for its button
            const rCsqButton$ = csq$.find(`.consequence-button-container.${csqClass}`);
            if (!rCsqButton$[0]) {
                return {};
            }
            /*~ @@DOUBLE-BLANK@@ ~*/
            const baseData = getBaseData(csq$);
            /*~ @@DOUBLE-BLANK@@ ~*/
            const resistData = {
                id: rCsqButton$.data("csq-id"),
                chatID, userID, rollID,
                name: csq$.find(`.consequence-name.${csqClass}`).text(),
                type: csq$.find(`${csqClass}. .consequence-icon-img`).attr("src")
                    ?.replace(/^.+\/[^/-]+-(.*?)\.svg/g, function (_, typeStr) {
                    return typeStr.replace(/(?:^|-)(.)/g, function (_$, char) {
                        return char.toUpperCase();
                    });
                }) ?? ConsequenceType.None
            };
            /*~ @@DOUBLE-BLANK@@ ~*/
            // If we're looking for a 'resist-consequence', we need an attribute trait and value
            if (csqClass.startsWith("resist")) {
                const attrMsg$ = csq$.find(".consequence-resist-attribute.resist-consequence");
                return {
                    ...baseData,
                    chatID, userID, rollID,
                    resistTo: resistData,
                    attribute: attrMsg$.text().trim().toLowerCase(),
                    attributeVal: Array.from(attrMsg$.find(".full-dot")).length
                };
            }
            else if (csqClass.startsWith("special")) {
                return {
                    ...baseData,
                    chatID, userID, rollID,
                    specialTo: resistData,
                    footerMsg: csq$.find(`.consequence-footer-container .${csqClass}`)?.text()
                };
            }
            else if (csqClass.startsWith("armor")) {
                return {
                    ...baseData,
                    chatID, userID, rollID,
                    armorTo: resistData
                };
            }
            /*~ @@DOUBLE-BLANK@@ ~*/
            return {};
        }
        /*~ @@DOUBLE-BLANK@@ ~*/
        const bCsqs = [];
        /*~ @@DOUBLE-BLANK@@ ~*/
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
        /*~ @@DOUBLE-BLANK@@ ~*/
        return bCsqs;
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    _id;
    /*~ @@DOUBLE-BLANK@@ ~*/
    _rollID;
    /*~ @@DOUBLE-BLANK@@ ~*/
    _chatMessage;
    /*~ @@DOUBLE-BLANK@@ ~*/
    _user;
    /*~ @@DOUBLE-BLANK@@ ~*/
    _name;
    /*~ @@DOUBLE-BLANK@@ ~*/
    _type;
    /*~ @@DOUBLE-BLANK@@ ~*/
    _resistTo;
    /*~ @@DOUBLE-BLANK@@ ~*/
    _attribute;
    /*~ @@DOUBLE-BLANK@@ ~*/
    _attributeVal;
    /*~ @@DOUBLE-BLANK@@ ~*/
    _armorTo;
    /*~ @@DOUBLE-BLANK@@ ~*/
    _specialTo;
    /*~ @@DOUBLE-BLANK@@ ~*/
    _isAccepted;
    /*~ @@DOUBLE-BLANK@@ ~*/
    constructor(data) {
        const { id, chatID, userID, rollID, name, type, attribute, attributeVal, resistTo, armorTo, specialTo, isAccepted } = data;
        /*~ @@DOUBLE-BLANK@@ ~*/
        if (typeof id !== "string") {
            throw new Error("[new BladesConsequence] Missing 'id' in constructor data object.");
        }
        if (typeof rollID !== "string") {
            throw new Error("[new BladesConsequence] Missing 'rollID' in constructor data object.");
        }
        if (typeof chatID !== "string") {
            throw new Error("[new BladesConsequence] Missing 'chatID' in constructor data object.");
        }
        const chatMessage = game.messages.get(chatID);
        if (!(chatMessage instanceof ChatMessage)) {
            throw new Error(`[new BladesConsequence] No chat message with id '${chatID}' found.`);
        }
        if (typeof userID !== "string") {
            throw new Error("[new BladesConsequence] Missing 'userID' in constructor data object.");
        }
        const user = game.users.get(userID);
        if (!(user instanceof User)) {
            throw new Error(`[new BladesConsequence] No user with id '${userID}' found.`);
        }
        if (typeof name !== "string") {
            throw new Error("[new BladesConsequence] Missing 'name' in constructor data object.");
        }
        if (!(typeof type === "string" && type in ConsequenceType)) {
            throw new Error("[new BladesConsequence] Missing 'type' in constructor data object.");
        }
        /*~ @@DOUBLE-BLANK@@ ~*/
        this._id = id;
        this._rollID = rollID;
        this._chatMessage = chatMessage;
        this._user = user;
        this._name = name;
        this._type = type;
        this._isAccepted = Boolean(isAccepted);
        /*~ @@DOUBLE-BLANK@@ ~*/
        if (resistTo) {
            if (!(typeof attribute === "string" && attribute in AttributeTrait)) {
                throw new Error("[new BladesConsequence] Missing 'attribute' in constructor data object.");
            }
            this._attribute = attribute;
            if (typeof attributeVal !== "number") {
                throw new Error("[new BladesConsequence] Missing 'attributeVal' in constructor data object.");
            }
            this._attributeVal = attributeVal;
            /*~ @@DOUBLE-BLANK@@ ~*/
            if (!resistTo.id) {
                throw new Error("[new BladesConsequence] Missing 'resistTo.id' in constructor data object.");
            }
            if (!resistTo.name) {
                throw new Error("[new BladesConsequence] Missing 'resistTo.name' in constructor data object.");
            }
            if (!resistTo.type) {
                throw new Error("[new BladesConsequence] Missing 'resistTo.type' in constructor data object.");
            }
            this._resistTo = new BladesConsequence(resistTo);
        }
        /*~ @@DOUBLE-BLANK@@ ~*/
        if (armorTo) {
            if (!armorTo.id) {
                throw new Error("[new BladesConsequence] Missing 'armorTo.id' in constructor data object.");
            }
            if (!armorTo.name) {
                throw new Error("[new BladesConsequence] Missing 'armorTo.name' in constructor data object.");
            }
            if (!armorTo.type) {
                throw new Error("[new BladesConsequence] Missing 'armorTo.type' in constructor data object.");
            }
            this._armorTo = new BladesConsequence(armorTo);
        }
        /*~ @@DOUBLE-BLANK@@ ~*/
        if (specialTo) {
            if (!specialTo.id) {
                throw new Error("[new BladesConsequence] Missing 'specialTo.id' in constructor data object.");
            }
            if (!specialTo.name) {
                throw new Error("[new BladesConsequence] Missing 'specialTo.name' in constructor data object.");
            }
            if (!specialTo.type) {
                throw new Error("[new BladesConsequence] Missing 'specialTo.type' in constructor data object.");
            }
            this._specialTo = new BladesConsequence(specialTo);
        }
    }
}
/*~ @@DOUBLE-BLANK@@ ~*/
export default BladesConsequence;
/*~ @@DOUBLE-BLANK@@ ~*/ 
