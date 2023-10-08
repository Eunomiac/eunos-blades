import U from "./core/utilities";

export default class BladesPushController {

  static Get(): BladesPushController {
    if (!game.eunoblades.PushController) {
      throw new Error("Attempt to Get BladesPushController before 'ready' hook.");
    }
    return game.eunoblades.PushController;
  }

  static isInitialized = false;
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

  static InitSockets() {
    if (game.eunoblades.PushController) {
      socketlib.system.register("pushNotice", game.eunoblades.PushController.push);
      return true;
    }
    return false;
  }

  initOverlay() {
    $("#sidebar").append($("<div id='blades-push-notifications'></div>"));
    BladesPushController.isInitialized = true;
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
    const users = (args.pop() as User[]|undefined ?? [])
      .filter((user): user is User & {id: string} => Boolean(user?.id));
    if (!users || users.length === 0) { return }
    const pushArgs = args.slice(0, 3) as [string, string, string|undefined];
    socketlib.system.executeForUsers("pushNotice", users.map((user) => user.id), "", ...pushArgs);
  }

  pushToGM(...args: [string, string, string|undefined]) {
    socketlib.system.executeForAllGMs("pushNotice", "to-gm-notice", ...args);
  }

}