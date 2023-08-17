/* ****▌███████████████████████████████████████████████████████████████████████████▐**** *\
|*     ▌████░░░░░░░░░░░ Euno's Blades in the Dark for Foundry VTT ░░░░░░░░░░░░░████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░ by Eunomiac ░░░░░░░░░░░░░██████████████████▐     *|
|*     ▌████████████████████████████  License █ v0.1.0 ████████████████████████████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░░░░░░  ░░░░░░░░░░░░░░░░░░███████████████████▐     *|
\* ****▌███████████████████████████████████████████████████████████████████████████▐**** */

class BladesRollCollabSheet extends DocumentSheet {
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            classes: ["eunos-blades", "sheet", "roll-collab"],
            template: "systems/eunos-blades/templates/roll-collab.hbs",
            submitOnChange: true,
            width: 500,
            height: 500
        });
    }
    static Render(rollSheet) { rollSheet.render(true); }
    static Initialize() {
        return loadTemplates([
            "systems/eunos-blades/templates/roll-collab.hbs"
        ]);
    }
    static Current = {};
    static RenderRollCollab(config = {}) {
        const user = game.users?.get(config.userID ?? "");
        if (!(user instanceof User)) {
            return;
        }
        config.rollSource ??= user.character;
        if (!config.rollSource) {
            return;
        }
        config.rollID = randomID();
        BladesRollCollabSheet.Current[config.rollID] = new BladesRollCollabSheet(user, config);
        BladesRollCollabSheet.Current[config.rollID].render(true);
    }
    static NewRoll(config = {}) {
        if (game.user.isGM) {
            eLog.error("rollCollab", "GM Cannot Use New Roll!");
            return;
        }
        config.userID ??= game.user._id;
        BladesRollCollabSheet.RenderRollCollab(config);
        socketlib.system.executeForAllGMs("renderRollCollab", config);
    }
    rollSource;
    rollID;
    rollUser;
    constructor(user, config) {
        super(user);
        this.rollUser = user;
        this.rollID = config.rollID;
        this.rollSource = config.rollSource;
    }
    getData() {
        const context = super.getData();
        const sheetData = {
            cssClass: "roll-collab",
            editable: this.options.editable,
            isGM: game.eunoblades.Tracker.system.is_spoofing_player ? false : game.user.isGM,
            rollSource: this.rollSource,
            system: this.rollSource.system,
            flags: this.rollUser.flags ?? {}
        };
        return {
            ...context,
            ...sheetData
        };
    }
    activateListeners(html) {
        super.activateListeners(html);
    }
    async close() {
        await super.close();
        delete BladesRollCollabSheet.Current[this.rollID];
    }
}
export default BladesRollCollabSheet;