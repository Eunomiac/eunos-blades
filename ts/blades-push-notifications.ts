import U from "./core/utilities.js";

export default class BladesPushController {

  static Get() { return game.eunoblades.PushController! }
  static Initialize() {
    game.eunoblades ??= {};
    Hooks.once("ready", async () => {
      let pushController: BladesPushController|undefined = game.eunoblades.PushController;
      if (!(pushController instanceof BladesPushController)) {
        pushController = new BladesPushController();
      }
      game.eunoblades.PushController = pushController;
      pushController.initOverlay();
    });
    Hooks.on("canvasReady", async () => { game.eunoblades.PushController?.initOverlay() });
  }

  initOverlay() {
    $("#sidebar").append($("<div id='blades-push-notifications'></div>"));
  }

  get elem$() { return $("#blades-push-notifications") }
  get elem() { return this.elem$[0] }

  activeNotifications: Record<string, JQuery<HTMLElement>> = {};

  push(blockClass: string, charName: string, titleText?: string, bodyText?: string) {
    const pushController = BladesPushController.Get();
    const pushID = randomID();
    const pushLines: string[] = [
      `<div id="#blades-push-${pushID}" class="push-notice${charName === "GM" ? " gm-notice" : ""} ${blockClass}">`
    ];
    if (charName !== "GM") {
      pushLines.push(`    <div class="author">${charName}</div>`);
    }
    if (titleText) {
      pushLines.push(`    <div class="header">${titleText}</div>`);
    }
    if (bodyText) {
      pushLines.push(`    <div class="body${titleText ? "" : " no-border"}">${bodyText}</div>`);
    }
    pushLines.push("</div>");
    const pushElem$ = $(pushLines.join("\n"));

    pushController.elem$.append(pushElem$);
    pushElem$.on("click", () => pushController.removePush(pushElem$[0]));
    U.gsap.from(
      pushElem$[0],
      {
        x: "-=200",
        scale: 1.25,
        duration: 1,
        ease: "power2"
      }
    );
    U.gsap.from(
      pushElem$[0],
      {
        background: "rgb(255, 231, 92)",
        borderColor: "rgb(255, 255, 255)",
        duration: 10,
        ease: "power2"
      }
    );
  }

  removePush(pushElem: HTMLElement) {
    U.gsap.effects.slideUp(pushElem)
      .then(() => $(pushElem).remove());
  }

  pushToAll(...args: [string, string, string|undefined]) {
    socketlib.system.executeForEveryone("pushNotice", "", ...args);
  }

  pushToSome(...args: [string, string, string|undefined, User[]]) {
    const users = (args.pop() as User[]).map((user) => user.id!);
    const pushArgs = args.slice(0, 3) as [string, string, string|undefined];
    socketlib.system.executeForUsers("pushNotice", users, "", ...args);
  }

  pushToGM(...args: [string, string, string|undefined]) {
    socketlib.system.executeForAllGMs("pushNotice", "to-gm-notice", ...args);
  }

}