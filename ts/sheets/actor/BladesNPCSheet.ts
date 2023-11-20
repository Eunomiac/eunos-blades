
import BladesActorSheet from "./BladesActorSheet";
import U from "../../core/utilities";
class BladesNPCSheet extends BladesActorSheet {

  static override get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["eunos-blades", "sheet", "actor", "npc"],
      template: "systems/eunos-blades/templates/npc-sheet.hbs",
      width: 500,
      height: 400,
      // height: "auto",
      tabs: [{navSelector: ".nav-tabs", contentSelector: ".tab-content", initial: "description"}]
    });
  }

  override getData() {
    const context = super.getData() as ReturnType<BladesActorSheet["getData"]> & Record<string, unknown>;

    context.isSubActor = context.actor.isSubActor;
    context.parentActor = context.actor.parentActor;
    context.persona = context.actor.system.persona;
    context.random = context.actor.system.random;
    context.secret = context.actor.system.secret;

    const rStatus: Record<string, {size: "third"|"half"|number, label: string|null}> = {
      name: {size: 3, label: "Name"},
      gender: {size: "half", label: "Gender"},

      heritage: {size: "third", label: "Heritage"},
      background: {size: "third", label: "Background"},
      profession: {size: "third", label: "Profession"},

      appearance: {size: 2, label: "Appearance"},
      style: {size: 2, label: "Style"},
      quirk: {size: 4, label: "Quirk"},

      goal: {size: 2, label: "Goal"},
      method: {size: 2, label: "Method"},

      interests: {size: 4, label: "Interests"},

      trait: {size: "half", label: "Trait"},
      trait1: {size: "half", label: null},
      trait2: {size: "half", label: null},
      trait3: {size: "half", label: null}
    };
    for (const cat of ["persona", "random", "secret"]) {
      for (const [key] of Object.entries(context[cat] as Record<string, Record<string, unknown>>)) {
        if (key in rStatus) {
          Object.assign(
            (context[cat] as Record<string, Record<string, unknown>>)[key],
            rStatus[key]
          );
        }
      }
    }

    console.log({persona: context.persona, random: context.random, secret: context.secret});

    return context;
  }

  override activateListeners(html: JQuery<HTMLElement>) {
    super.activateListeners(html);

    // Everything below here is only needed if the sheet is editable
    if (!this.options.editable) {return;}

    html.find(".gm-alert-header").on("click", async (event) => {
      event.preventDefault();

      this.actor.clearParentActor();
    });

    // ~ Configure Tagify input elements
    // const inputElement = document.querySelector('input[name="system.harm.severe.one"]');
    // if (inputElement instanceof HTMLInputElement) { new Tagify(inputElement, {}) } else { console.log("Not an HTMLInputElement")}

    // ~ Enable Randomize Button for NPCs
    html.find("[data-action=\"randomize\"").on("click", () => {
      this.actor.updateRandomizers();
    });

    // ~ Enable status toggles for NPC subactors
    html.find(".comp-status-toggle")
      .on("click", () => {
        const {tags} = this.actor;
        if (this.actor.system.status === 1) {
          U.remove(tags, "Friend");
          tags.push("Rival");
          this.actor.update({
            "system.status": -1,
            "system.tags": U.unique(tags)
          });
        } else {
          U.remove(tags, "Rival");
          tags.push("Friend");
          this.actor.update({
            "system.status": 1,
            "system.tags": U.unique(tags)
          });
        }
      })
      .on("contextmenu", () => {
        this.actor.update({"system.status": 0});
      });

  }
}

export default BladesNPCSheet;
