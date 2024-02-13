/* eslint-disable @typescript-eslint/no-unused-vars */
// #region ▮▮▮▮▮▮▮ IMPORTS ▮▮▮▮▮▮▮ ~
import { RollPermissions, ActionTrait, RollPhase, Effect, RollType, Position } from "../core/constants.js";
import { BladesPC, BladesNPC } from "../documents/BladesActorProxy.js";
import { BladesRollPrimary } from "../classes/BladesRoll.js";
// #endregion ▮▮▮▮[IMPORTS]▮▮▮▮
class BladesDebug {
    static async GetSampleSchemas() {
        // Documents
        const SAMPLE_USER_NAME = "Alistair";
        const SAMPLE_PC_NAME = "Alistair";
        const SAMPLE_NPC_NAME = "Setarra";
        const sampleUser = game.users.getName(SAMPLE_USER_NAME);
        if (!sampleUser) {
            throw new Error(`Sample user with name "${SAMPLE_USER_NAME}" not found.`);
        }
        const samplePC = game.actors.getName(SAMPLE_PC_NAME);
        if (!BladesPC.IsType(samplePC)) {
            throw new Error(`Sample BladesPC with name "${SAMPLE_PC_NAME}" not found.`);
        }
        const sampleNPC = game.actors.getName(SAMPLE_NPC_NAME);
        if (!BladesNPC.IsType(sampleNPC)) {
            throw new Error(`Sample BladesNPC with name "${SAMPLE_NPC_NAME}" not found or is not a valid BladesNPC.`);
        }
        // BladesActionRoll
        const BladesActionRoll_Schema = {
            rollType: RollType.Action,
            // rollSubType: RollSubType.GatherInfo,
            // rollPrompt: "Gathering Information",
            rollTrait: ActionTrait.skirmish,
            // rollUserID: sampleUser.id,
            // rollDowntimeAction: DowntimeAction.AcquireAsset,
            // rollClockKey: U.getLast(game.eunoblades.ClockKeys.contents)?.id,
            rollPrimaryData: BladesRollPrimary.GetDataFromDoc(samplePC),
            // rollOppData: sampleNPC,
            // rollParticipantData: {},
            // consequenceData: {},
            // resistanceData: {
            //   consequence: {}
            // },
            rollModsData: {},
            rollPositionInitial: Position.risky,
            rollEffectInitial: Effect.standard,
            rollPosEffectTrade: false,
            rollPhase: RollPhase.Collaboration,
            GMBoosts: {},
            GMOppBoosts: {},
            GMOverrides: {},
            rollFactorToggles: {
                source: {},
                opposition: {}
            },
            userPermissions: {
                [sampleUser.id]: RollPermissions.Primary
            }
            // rollPositionFinal: Position.risky,
            // rollEffectFinal: Effect.standard,
            // rollResult: RollResult.success,
            // rollResultDelta: 0,
            // rollResultFinal: RollResult.success,
            // rollTraitVerb: "skirmishes",
            // rollTraitPastVerb: "skirmished",
            // finalDiceData: [],
            // isInlineResistanceRoll: false
        };
        return {
            BladesActionRoll_Schema
        };
    }
}
export default BladesDebug;
