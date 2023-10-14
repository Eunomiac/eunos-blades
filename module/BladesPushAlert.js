/* ****▌███████████████████████████████████████████████████████████████████████████▐**** *\
|*     ▌█░░░░░░░░░ Euno's Blades in the Dark for Foundry VTT ░░░░░░░░░░░█▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░ by Eunomiac ░░░░░░░░░░░░░██████████████████▐     *|
|*     ▌█  License █ v0.1.0 ██▐     *|
|*     ▌████░░░░  ░░░░█████▐     *|
\* ****▌███████████████████████████████████████████████████████████████████████████▐**** */

import U from "./core/utilities.js";
export default class BladesPushAlert {
    static Get() {
        if (!game.eunoblades.PushController) {
            throw new Error("Attempt to Get BladesPushAlert before 'ready' hook.");
        }
        return game.eunoblades.PushController;
    }
    static isInitialized = false;
    static Initialize() {
        game.eunoblades ??= {};
        Hooks.once("ready", async () => {
            let pushController = game.eunoblades.PushController;
            if (!(pushController instanceof BladesPushAlert)) {
                pushController = new BladesPushAlert();
            }
            game.eunoblades.PushController = pushController;
            pushController.initOverlay();
        });
        Hooks.on("canvasReady", async () => { game.eunoblades.PushController?.initOverlay(); });
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
        BladesPushAlert.isInitialized = true;
    }
    get elem$() { return $("#blades-push-notifications"); }
    get elem() { return this.elem$[0]; }
    activeNotifications = {};
    push(blockClass, charName, titleText, bodyText) {
        const pushController = BladesPushAlert.Get();
        const pushID = randomID();
        const pushLines = [
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
        U.gsap.from(pushElem$[0], {
            x: "-=200",
            scale: 1.25,
            duration: 1,
            ease: "power2"
        });
        U.gsap.from(pushElem$[0], {
            background: "rgb(255, 231, 92)",
            borderColor: "rgb(255, 255, 255)",
            duration: 10,
            ease: "power2"
        });
    }
    removePush(pushElem) {
        U.gsap.effects.slideUp(pushElem)
            .then(() => $(pushElem).remove());
    }
    pushToAll(...args) {
        socketlib.system.executeForEveryone("pushNotice", "", ...args);
    }
    pushToSome(...args) {
        const users = (args.pop() ?? [])
            .filter((user) => Boolean(user?.id));
        if (!users || users.length === 0) {
            return;
        }
        const pushArgs = args.slice(0, 3);
        socketlib.system.executeForUsers("pushNotice", users.map(user => user.id), "", ...pushArgs);
    }
    pushToGM(...args) {
        socketlib.system.executeForAllGMs("pushNotice", "to-gm-notice", ...args);
    }
}