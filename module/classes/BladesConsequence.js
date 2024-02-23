/* eslint-disable @typescript-eslint/no-unused-vars */
import C, { AttributeTrait, ConsequenceType, Position, Effect } from "../core/constants.js";
import U from "../core/utilities.js";
import BladesRoll, { BladesRollPrimary } from "./BladesRoll.js";
import BladesTargetLink from "./BladesTargetLink.js";
import { BladesPC } from "../documents/BladesActorProxy.js";
/* eslint-enable @typescript-eslint/no-unused-vars */
class BladesConsequence extends BladesTargetLink {
    // #region Static Methods ~
    static async Initialize() {
        if (!game.messages) {
            throw new Error("[BladesConsequence] Messages Not Ready!");
        }
        return (await Promise.all(game.messages.contents
            .map(async (msg) => msg.rollConsequences)))
            .flat();
    }
    /**
   * Checks if the given value is valid consequence data for a Resistance Roll.
   * @param val The value to check.
   * @param isCheckingResistedTo If the check is being recursively applied to the 'resistTo' value.
   * @returns True if the val is valid BladesConsequence.Data, false otherwise.
   */
    static IsValidConsequenceData(val, isCheckingResistedTo = false) {
        if (!U.isList(val)) {
            return false;
        }
        if (typeof val.type !== "string" || !(val.type in ConsequenceType)) {
            return false;
        }
        if (typeof val.name !== "string") {
            return false;
        }
        if (isCheckingResistedTo) {
            return true;
        }
        if (val.attribute && (typeof val.attribute !== "string" || !(val.attribute in AttributeTrait))) {
            return false;
        }
        if (!this.IsValidConsequenceData(val.resistTo, true)) {
            return false;
        }
        return true;
    }
    static ApplySchemaDefaults(schemaData) {
        // Ensure all properties of Schema are provided
        if (!schemaData.primaryID) {
            throw new Error("A primaryID is required for BladesConsequence.Schema");
        }
        if (typeof schemaData.name === "string" && (!schemaData.name && schemaData.type !== ConsequenceType.None)) {
            throw new Error(`A name must be provided for non-None-type consequences (${schemaData.name}).`);
        }
        return {
            name: "",
            type: ConsequenceType.None,
            ...schemaData
        };
    }
    static GetCsqTypeValue(cType, rollData) {
        if (cType === ConsequenceType.WorsePosition) {
            // Requires position data to resolve.
            if (!rollData) {
                throw new Error(`Cannot resolve consequence type value for '${cType}' without roll data.`);
            }
            let position;
            if ("rollPositionFinal" in rollData) {
                position = rollData.rollPositionFinal;
            }
            else if ("position" in rollData) {
                position = rollData.position;
            }
            if (!position) {
                throw new Error(`Cannot resolve consequence type value for '${cType}' without roll data that includes final position data.`);
            }
            return {
                [Position.controlled]: 1,
                [Position.risky]: 2,
                [Position.desperate]: 0
            }[position];
        }
        if (cType === ConsequenceType.ReducedEffect) {
            // Requires effect data to resolve.
            if (!rollData) {
                throw new Error(`Cannot resolve consequence type value for '${cType}' without roll data.`);
            }
            let effect;
            if ("rollEffectFinal" in rollData) {
                effect = rollData.rollEffectFinal;
            }
            else if ("effect" in rollData) {
                effect = rollData.effect;
            }
            if (!effect) {
                throw new Error(`Cannot resolve consequence type value for '${cType}' without roll data that includes final effect data.`);
            }
            return {
                [Effect.extreme]: 1,
                [Effect.great]: 1,
                [Effect.standard]: 1,
                [Effect.limited]: 2,
                [Effect.zero]: 0
            }[effect];
        }
        // All other values are constant for each consequence type.
        return C.ConsequenceValues[cType];
    }
    // #endregion
    // #region *** GETTERS *** ~
    // #region Getters (Target Data) ~
    get primaryID() { return this.data.primaryID ?? this.parentConsequence?.primaryID; }
    get parentCsqID() { return this.data.parentCsqID; }
    get name() { return this.data.name; }
    get type() { return this.data.type; }
    get attribute() { return this.data.attribute ?? this.parentConsequence?.attribute; }
    get attributeVal() { return this.data.attributeVal ?? this.parentConsequence?.attributeVal; }
    get specialFooterMsg() {
        return this.data.specialFooterMsg ?? this.parentConsequence?.specialFooterMsg;
    }
    // #endregion
    // #region Getters (Derived Data) ~
    get primary() {
        const primary = fromUuidSync(this.primaryID);
        if (!BladesRollPrimary.IsDoc(primary)) {
            throw new Error(`Could not find primary with UUID '${this.primaryID}'`);
        }
        if (this.roll) {
            return new BladesRollPrimary(this.roll, primary);
        }
        return new BladesRollPrimary(primary);
    }
    get parentConsequence() {
        if (!this.parentCsqID) {
            return undefined;
        }
        const parentCsq = game.eunoblades.Consequences.get(this.parentCsqID);
        if (!parentCsq) {
            throw new Error(`Error locating parent consequence with id '${this.parentCsqID}'`);
        }
        return parentCsq;
    }
    get typeDisplay() { return C.ConsequenceDisplay[this.type]; }
    get icon() { return C.ConsequenceIcons[this.type]; }
    get value() { return BladesConsequence.GetCsqTypeValue(this.type, this); }
    // #endregion
    // #region Getters (Resolved Roll Data that Applied This Consequence) ~
    get rollData() {
        return this.data.actionRollData ?? this.parentConsequence?.rollData;
    }
    get roll() {
        if (!this.rollData) {
            return undefined;
        }
        return game.eunoblades.Rolls.get(this.rollData.id) ?? new BladesRoll({
            ...this.rollData,
            isScopingById: false
        });
    }
    get position() { return this.roll?.rollPositionFinal; }
    get effect() { return this.roll?.rollEffectFinal; }
    get result() { return this.roll?.rollResultFinal; }
    // #endregion
    // #region Getters (Resistibility & Acceptance Status) ~
    isResistible() {
        return Boolean(this.type !== ConsequenceType.None && !this.isAccepted && this.data.resistSchema);
    }
    get resistanceModes() { return this.data.resistanceModes ?? []; }
    get wasResisted() { return Boolean(this.resistanceModes.length); }
    get wasResistedByRoll() { return this.resistanceModes.includes("resist"); }
    get wasResistedByArmor() { return this.resistanceModes.includes("armor"); }
    get wasResistedBySpecialArmor() { return this.resistanceModes?.includes("special"); }
    get canResistWithRoll() {
        if (!this.isResistible()) {
            return false;
        }
        // Only PCs can roll to resist consequences.
        if (!BladesPC.IsType(this.primary.rollPrimaryDoc)) {
            return false;
        }
        // A consequence can only be resisted by roll once.
        if (this.wasResistedByRoll) {
            return false;
        }
        // Otherwise, a consequence can ALWAYS be resisted by roll once by a PC.
        return true;
    }
    get canResistWithArmor() {
        if (!this.isResistible()) {
            return false;
        }
        // The consequence must be explicitly flagged as resistable by armor.
        if (!this.data.canResistWithArmor) {
            return false;
        }
        // Unlike resistance rolls, a Primary could conceivably resist twice using multiple armor boxes.
        // So, a resistanceMode previously set to "armor" does not disqualify another resist, if the
        // Primary has armor to spare.
        return this.primary.availableArmorCount > 0;
    }
    get canResistWithSpecial() {
        if (!this.isResistible()) {
            return false;
        }
        // The consequence must be explicitly flagged as resistable by special armor.
        if (!this.data.canResistWithSpecial) {
            return false;
        }
        // Only PCs can resist consequences with special armor.
        if (!BladesPC.IsType(this.primary.rollPrimaryDoc)) {
            return false;
        }
        // A consequence can only be resisted by special armor once.
        if (this.wasResistedBySpecialArmor) {
            return false;
        }
        // Otherwise, the PC can resist if they have special armor to spare.
        return this.primary.hasSpecialArmor;
    }
    get resistWithRollNegates() {
        if (!this.canResistWithRoll) {
            return false;
        }
        // If this is the second resistance, it automatically negates.
        if (this.wasResisted) {
            return true;
        }
        // Otherwise, it negates if explicitly flagged to do so.
        return Boolean(this.data.resistWithRollNegates);
    }
    get resistWithArmorNegates() {
        if (!this.canResistWithArmor) {
            return false;
        }
        // If this is the second resistance, it automatically negates.
        if (this.wasResisted) {
            return true;
        }
        // Otherwise, it negates if explicitly flagged to do so.
        return Boolean(this.data.resistWithArmorNegates);
    }
    get resistWithSpecialNegates() {
        if (!this.canResistWithSpecial) {
            return false;
        }
        // If this is the second resistance, it automatically negates.
        if (this.wasResisted) {
            return true;
        }
        // Otherwise, it negates if explicitly flagged to do so.
        return Boolean(this.data.resistWithSpecialNegates);
    }
    get isAccepted() { return "acceptanceMode" in this.data; }
    get acceptanceMode() {
        return this.data.acceptanceMode;
    }
    // #endregion
    // #endregion
    // #region *** RESISTING CONSEQUENCES ***
    // #region Constructing Resistable Consequence Schema
    get noneSchema() {
        return {
            name: "",
            type: ConsequenceType.None,
            primaryID: this.primaryID
        };
    }
    get resistSchema() {
        // If this consequence can't be resisted, return undefined.
        if (!this.isResistible()) {
            return undefined;
        }
        // Expand the resistSchema into a full BladesConsequence.Schema object
        const resSchema = {
            name: this.data.resistSchema.name,
            type: this.data.resistSchema.type,
            primaryID: this.primaryID,
            resistSchema: {
                name: "",
                type: ConsequenceType.None
            },
            resistanceModes: this.resistanceModes,
            resistWithRollNegates: true,
            attribute: this.attribute,
            attributeVal: this.attributeVal,
            canResistWithArmor: this.canResistWithArmor,
            resistWithArmorNegates: true,
            canResistWithSpecial: this.canResistWithSpecial,
            resistWithSpecialNegates: true,
            specialFooterMsg: this.specialFooterMsg
        };
        // If this consequence has already been resisted once, convert the resistSchema to a None-type schema.
        if (this.wasResisted) {
            resSchema.name = "";
            resSchema.type = ConsequenceType.None;
            delete resSchema.resistSchema;
            resSchema.canResistWithArmor = false;
            resSchema.canResistWithSpecial = false;
        }
        return resSchema;
    }
    // #endregion
    async resistConsequence(resistMode, rollInstance) {
        if (!this.isResistible()) {
            throw new Error("Cannot resist a consequence that is not resistible.");
        }
        const updateData = {
            resistanceModes: this.resistanceModes,
            ...this.resistSchema
        };
        updateData.resistanceModes.push(resistMode);
        updateData.parentCsqID = undefined;
        if (resistMode === "resist") {
            if (!rollInstance?.isResolved) {
                throw new Error("Cannot transform to resisted consequence without a resolved resistance roll instance.");
            }
            updateData.resistanceRollData = rollInstance.data;
        }
        // Now check updated schema to see whether this consequence should be automatically accepted:
        // ... if this is the second time the consequence has been resisted = verify None-type and accept
        // ... if the resulting resisted consequence is None-type = verify None-type and accept
        // ... if resistMode = "resist" and csq can't be resisted with armor or special = transform and accept
        //       ... (all other cases are already caught by "second time" check above)
        if (this.wasResisted || updateData.type === ConsequenceType.None) {
            updateData.acceptanceMode = "base"; // Use 'base' for None-type consequences so they appear faded out
        }
        else if (resistMode === "resist" && !this.canResistWithArmor && !this.canResistWithSpecial) {
            updateData.acceptanceMode = resistMode;
        }
        await this.updateTargetData(updateData);
        if (updateData.acceptanceMode) {
            socketlib.system.executeForEveryone("acceptConsequence_SocketCall", this.id);
        }
        else {
            socketlib.system.executeForEveryone("resistConsequence_SocketCall", this.id);
        }
    }
    // #endregion
    // #region *** ACCEPTING CONSEQUENCES ***
    async acceptConsequence() {
        if (this.isAccepted) {
            return;
        }
        await this.updateTarget("acceptanceMode", U.getLast(this.resistanceModes) ?? "accept");
        socketlib.system.executeForEveryone("acceptConsequence_SocketCall", this.id);
    }
    async applyConsequenceEffects() {
        // If HARM -> Apply harm to actor.
        if (/Harm/.test(this.type)) {
            this.primary.applyHarm(U.pInt(this.type.substring(this.type.length - 1)), this.name);
            // If WORSE POSITION -> Add flag to user to be checked on next Action roll, then cleared
        }
        else if (this.type === ConsequenceType.WorsePosition) {
            this.primary.applyWorsePosition();
            // If REDUCED EFFECT -> Update chat message flag to reduced effect level.
        }
        else if (this.type === ConsequenceType.ReducedEffect) {
            const curIndex = Object.values(Effect)
                .findIndex((val) => val === this.effect);
            if (curIndex >= 1) {
                const newEffect = Object.values(Effect)[curIndex - 1];
                await this.updateTarget("rollData.rollEffectFinal", newEffect);
            }
        }
        // If COMPLICATION -> No change.
        // If LOST OPPORTUNITY -> No change.
    }
    // #endregion
    // #region === CONSTRUCTOR === ~
    // constructor(
    //   config: BladesConsequence.Config,
    //   parentCsq?: BladesConsequence.Data
    // )
    // constructor(
    //   data: BladesConsequence.Data
    // )
    // constructor(
    //   schema: Partial<BladesConsequence.Schema>,
    //   parentCsq: BladesConsequence.Data
    // )
    // constructor(
    //   dataConfigOrSchema: BladesConsequence.Config | BladesConsequence.Data | Partial<BladesConsequence.Schema>,
    //   parentCsq?: BladesConsequence.Data
    // ) {
    //   // If a parentCsq is provided...
    //   if (parentCsq) {
    //     super({
    //       ...BladesTargetLink.BuildLinkConfig(parentCsq),
    //       ...dataConfigOrSchema
    //     });
    //   } else {
    //     super(dataConfigOrSchema as BladesConsequence.Config | BladesConsequence.Data);
    //   }
    // }
    // #endregion
    // #region *** HTML INTERACTION ***
    // #region *** BladesDialog *** ~
    // #endregion
    // #region *** BladesChat *** ~
    static ApplyChatListeners(message) {
        /**
         * TIMELINES
         * .comp.consequence-display-container:mouseenter
         *   = fade in grey interaction buttons
         *   ...:mouseleave = reverse
         *
         * .consequence-accept-button-container:mouseenter
         *   = turn type line white, text shadow
         *     slide out .consequence-accept-button-bg from left
         *     turn .consequence-accept-button i black, and scale
         *     turn .consequence-accept-button-label black, add letter spacing, bold
         *   ...:mouseleave = reverse
         *
         * .consequence-resist-button-container:mouseenter
         *   = slide in .consequence-type-bg.base-consequence to left
         *     fade out all .base-consequence:not(.consequence-type-bg)
         *     slide out .consequence-type.resist-consequence from left
         *     slide out .consequence-resist-button-bg from right
         *     slide out .consequence-footer-bg.resist-consequence from left
         *     slide out .consequence-resist-attribute from left
         *     slide out .consequence-name.resist-consequence from left
         *     fade in .consequence-icon-circle.resist-consequence
         *   ...:mouseleave = reverse
         *   --> IF resistTo.type === "None", blurRemove the base_consequence name and type instead of sliding them in,
         *                                       and don't slide the resistance ones out at all.
         * */
        const html$ = message.elem$;
        html$
            .find(".comp.consequence-display-container")
            .each((_i, csqContainer) => {
            if (!$(csqContainer).hasClass("consequence-accepted")) {
                const iconContainer$ = $(csqContainer).find(".consequence-icon-container");
                const rightInteractionPad$ = $(csqContainer).find(".interaction-pad-right");
                const leftInteractionPad$ = $(csqContainer).find(".interaction-pad-left");
                const resistInteractionPad$ = $(csqContainer).find(".interaction-pad-left-resist");
                const armorInteractionPad$ = $(csqContainer).find(".interaction-pad-left-armor");
                const specialInteractionPad$ = $(csqContainer).find(".interaction-pad-left-special");
                // Apply master on-enter hover timeline to consequence container.
                $(csqContainer).data("hoverTimeline", U.gsap.effects.csqEnter(csqContainer));
                $(csqContainer).on({
                    mouseenter: function () {
                        $(csqContainer).css("z-index", 10);
                        $(csqContainer).data("hoverTimeline").play();
                    },
                    mouseleave: function () {
                        if (!(iconContainer$.data("isToggled") || iconContainer$.data("isTogglingOn")) || iconContainer$.data("isTogglingOff")) {
                            $(csqContainer).data("hoverTimeline").reverse().then(() => {
                                $(csqContainer).css("z-index", "");
                            });
                        }
                    }
                });
                // Apply click timeline to icon circle
                iconContainer$.data("clickTimeline", U.gsap.effects.csqClickIcon(iconContainer$[0]));
                iconContainer$.on({
                    click: function () {
                        if (iconContainer$.data("isToggled") || iconContainer$.data("isTogglingOn")) {
                            iconContainer$.data("isTogglingOn", false);
                            iconContainer$.data("isTogglingOff", true);
                            iconContainer$.data("clickTimeline").reverse().then(() => {
                                iconContainer$.data("isTogglingOff", false);
                                iconContainer$.data("isToggled", false);
                            });
                        }
                        else {
                            iconContainer$.data("isTogglingOn", true);
                            iconContainer$.data("isTogglingOff", false);
                            // Find any siblings with toggled-on iconContainers, and toggle them off
                            Array.from($(csqContainer).siblings(".consequence-display-container"))
                                .forEach((containerElem) => {
                                const iContainer$ = $(containerElem).find(".consequence-icon-container");
                                if (iContainer$?.data("isToggled") || iContainer$?.data("isTogglingOn")) {
                                    iContainer$.data("isTogglingOn", false);
                                    iContainer$.data("isTogglingOff", true);
                                    iContainer$.data("clickTimeline").reverse().then(() => {
                                        iContainer$.data("isTogglingOff", false);
                                        iContainer$.data("isToggled", false);
                                        $(containerElem).data("hoverTimeline").reverse().then(() => {
                                            $(containerElem).css("z-index", "");
                                        });
                                    });
                                }
                            });
                            iconContainer$.data("clickTimeline").play().then(() => {
                                iconContainer$.data("isTogglingOn", false);
                                iconContainer$.data("isToggled", true);
                            });
                        }
                    }
                });
                // Apply hover timelines to right (accept) interaction pad
                rightInteractionPad$.data("hoverTimeline", U.gsap.effects.csqEnterRight(csqContainer));
                rightInteractionPad$.on({
                    mouseenter: function () {
                        if (iconContainer$.data("isToggled")) {
                            rightInteractionPad$.data("hoverTimeline").play();
                        }
                    },
                    mouseleave: function () {
                        rightInteractionPad$.data("hoverTimeline").reverse();
                    }
                });
                // Apply hover timeline to left (resist/armor/special) interaction pad
                leftInteractionPad$.data("hoverTimeline", U.gsap.effects.csqEnterLeft(csqContainer));
                leftInteractionPad$.on({
                    mouseenter: function () {
                        if (iconContainer$.data("isToggled")) {
                            leftInteractionPad$.data("hoverTimeline").play();
                        }
                    },
                    mouseleave: function () {
                        leftInteractionPad$.data("hoverTimeline").reverse();
                    }
                });
                // Apply hover timelines to specific left interaction pads
                resistInteractionPad$.data("hoverTimeline", U.gsap.effects.csqEnterSubLeft(csqContainer, { type: "resist" }));
                resistInteractionPad$.on({
                    mouseenter: function () {
                        if (iconContainer$.data("isToggled")) {
                            resistInteractionPad$.data("hoverTimeline").play();
                        }
                    },
                    mouseleave: function () {
                        if (iconContainer$.data("isToggled")) {
                            resistInteractionPad$.data("hoverTimeline").reverse();
                        }
                    }
                });
                armorInteractionPad$.data("hoverTimeline", U.gsap.effects.csqEnterSubLeft(csqContainer, { type: "armor" }));
                armorInteractionPad$.on({
                    mouseenter: function () {
                        if (iconContainer$.data("isToggled")) {
                            armorInteractionPad$.data("hoverTimeline").play();
                        }
                    },
                    mouseleave: function () {
                        if (iconContainer$.data("isToggled")) {
                            armorInteractionPad$.data("hoverTimeline").reverse();
                        }
                    }
                });
                specialInteractionPad$.data("hoverTimeline", U.gsap.effects.csqEnterSubLeft(csqContainer, { type: "special" }));
                specialInteractionPad$.on({
                    mouseenter: function () {
                        if (iconContainer$.data("isToggled")) {
                            specialInteractionPad$.data("hoverTimeline").play();
                        }
                    },
                    mouseleave: function () {
                        if (iconContainer$.data("isToggled")) {
                            specialInteractionPad$.data("hoverTimeline").reverse();
                        }
                    }
                });
            }
        });
    }
}
export default BladesConsequence;
