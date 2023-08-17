import U from "../core/utilities.js";
import BladesActor from "../blades-actor.js";
import BladesItem from "../blades-item.js";

type BladesRollCollabSheetData = {
  cssClass: string,
  editable: boolean,
  isGM: boolean,
  rollSource: BladesActor|BladesItem,
  system: BladesActorSystem|BladesItemSystem,
  flags: Record<string,any>
};
interface BladesRollCollabOptions {
  userID: string
  rollID: string
  rollSource: BladesActor|BladesItem
}

class BladesRollCollabSheet extends DocumentSheet {

  static override get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["eunos-blades", "sheet", "roll-collab"],
      template: "systems/eunos-blades/templates/roll-collab.hbs",
      submitOnChange: true,
      width: 500,
      height: 500
    });
  }

  static Render(rollSheet: BladesRollCollabSheet) { rollSheet.render(true) }

  static Initialize() {
    return loadTemplates([
      "systems/eunos-blades/templates/roll-collab.hbs"
    ]);
  }

  static Current: Record<string, BladesRollCollabSheet> = {};

  static RenderRollCollab(config: Partial<BladesRollCollabOptions> = {}) {
    const user = game.users?.get(config.userID ?? "");
    if (!(user instanceof User)) { return }
    config.rollSource ??= user.character;
    if (!config.rollSource) { return }
    config.rollID = randomID();
    BladesRollCollabSheet.Current[config.rollID] = new BladesRollCollabSheet(user, config as BladesRollCollabOptions);
    BladesRollCollabSheet.Current[config.rollID].render(true);
  }

  static NewRoll(config: Partial<BladesRollCollabOptions> = {}) {
    // This just determines which socket function to run: Each client has to run the logic themselves
    if (game.user.isGM) {
      eLog.error("rollCollab", "GM Cannot Use New Roll!");
      return;
    }
    config.userID ??= game.user._id;
    BladesRollCollabSheet.RenderRollCollab(config);
    socketlib.system.executeForAllGMs("renderRollCollab", config);
  }

  rollSource: BladesActor|BladesItem;
  rollID: string;
  rollUser: User;

  constructor(user: User, config: BladesRollCollabOptions) {
    super(user);
    this.rollUser = user;
    this.rollID = config.rollID;
    this.rollSource = config.rollSource;
  }

  override getData() {

    const context = super.getData();

    const sheetData: BladesRollCollabSheetData = {
      cssClass: "roll-collab",
      editable: this.options.editable,
      isGM: game.eunoblades.Tracker!.system.is_spoofing_player ? false : game.user.isGM,
      rollSource: this.rollSource,
      system: this.rollSource.system,
      flags: this.rollUser.flags ?? {}
    };

    return {
      ...context,
      ...sheetData
    };
  }

  override activateListeners(html: JQuery<HTMLElement>) {
    super.activateListeners(html);

  }

  override async close() {
    await super.close();
    delete BladesRollCollabSheet.Current[this.rollID];
  }
}

interface BladesRollCollabSheet { }

export default BladesRollCollabSheet;