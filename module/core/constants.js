/* ****▌███████████████████████████████████████████████████████████████████████████▐**** *\
|*     ▌████░░░░░░░░░░░ Euno's Blades in the Dark for Foundry VTT ░░░░░░░░░░░░░████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░ by Eunomiac ░░░░░░░░░░░░░██████████████████▐     *|
|*     ▌████████████████████████████  License █ v0.1.0 ████████████████████████████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░░░░░░  ░░░░░░░░░░░░░░░░░░███████████████████▐     *|
\* ****▌███████████████████████████████████████████████████████████████████████████▐**** */

const C = {
    SYSTEM_ID: "eunos-blades",
    TEMPLATE_ROOT: "systems/eunos-blades/templates",
    ActorTypes: {
        pc: "Player Character",
        npc: "Non-Player Character"
    },
    ItemTypes: {
        move: "Move",
        attack: "Attack",
        advantage: "Advantage",
        disadvantage: "Disadvantage",
        darksecret: "Dark Secret",
        relation: "Relation",
        weapon: "Weapon",
        gear: "Gear"
    },
    Colors: {
        bWHITE: "rgba(255, 255, 255, 1)",
        WHITE: "rgba(200, 200, 200, 1)",
        bGREY: "rgba(170, 170, 170, 1)",
        GREY: "rgba(128, 128, 128, 1)",
        dGREY: "rgba(78, 78, 78, 1)",
        BLACK: "rgba(16, 16, 16, 1)",
        dBLACK: "rgba(0, 0, 0, 1)",
        gGOLD: "rgba(255, 254, 200, 1)",
        bGOLD: "rgba(171, 146, 84, 1)",
        GOLD: "rgba(253, 212, 112, 1)",
        dGOLD: "rgba(65, 61, 46, 1)",
        RED: "rgba(155, 32, 32, 1)",
        dRED: "rgba(70, 14, 14, 1)",
        bRED: "rgba(240, 50, 50, 1)",
        gRED: "rgba(255, 0, 0, 1)",
        BLUE: "rgba(43, 85, 139, 1)",
        dBLUE: "rgba(17, 33, 54, 1)",
        bBLUE: "rgba(69, 137, 224, 1)",
        gBLUE: "rgba(128, 185, 255, 1)"
    }
};
export default C;