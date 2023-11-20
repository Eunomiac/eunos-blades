import U from "./core/utilities.js";
import C from "./core/constants.js";
/*~ @@DOUBLE-BLANK@@ ~*/
export default class BladesPushAlert {
    /*~ @@DOUBLE-BLANK@@ ~*/
    static Get() {
        if (!game.eunoblades.PushController) {
            throw new Error("Attempt to Get BladesPushAlert before 'ready' hook.");
        }
        return game.eunoblades.PushController;
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    static isInitialized = false;
    /*~ @@DOUBLE-BLANK@@ ~*/
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
    /*~ @@DOUBLE-BLANK@@ ~*/
    static InitSockets() {
        if (game.eunoblades.PushController) {
            socketlib.system.register("pushNotice", game.eunoblades.PushController.push);
            return true;
        }
        return false;
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    initOverlay() {
        $("#sidebar").append($("<div id='blades-push-notifications'></div>"));
        BladesPushAlert.isInitialized = true;
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    get elem$() { return $("#blades-push-notifications"); }
    /*~ @@DOUBLE-BLANK@@ ~*/
    get elem() { return this.elem$[0]; }
    /*~ @@DOUBLE-BLANK@@ ~*/
    activeNotifications = {};
    /*~ @@DOUBLE-BLANK@@ ~*/
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
        /*~ @@DOUBLE-BLANK@@ ~*/
        pushController.elem$.append(pushElem$);
        pushElem$.on("click", () => pushController.removePush(pushElem$[0]));
        U.gsap.from(pushElem$[0], {
            x: "-=200",
            scale: 1.25,
            duration: 1,
            ease: "power2"
        });
        U.gsap.from(pushElem$[0], {
            background: C.Colors.bGOLD,
            borderColor: C.Colors.WHITE,
            duration: 10,
            ease: "power2"
        });
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    removePush(pushElem) {
        U.gsap.effects.slideUp(pushElem)
            .then(() => $(pushElem).remove());
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    pushToAll(charName, titleText, bodyText, blockClass) {
        socketlib.system.executeForEveryone("pushNotice", blockClass ?? "", charName, titleText, bodyText);
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    pushToSome(...args) {
        const users = (args.pop() ?? [])
            .filter((user) => Boolean(user?.id));
        if (!users || users.length === 0) {
            return;
        }
        const pushArgs = args.slice(0, 3);
        socketlib.system.executeForUsers("pushNotice", users.map((user) => user.id), "", ...pushArgs);
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    pushToGM(...args) {
        socketlib.system.executeForAllGMs("pushNotice", "to-gm-notice", ...args);
    }
}
/*~ @@DOUBLE-BLANK@@ ~*/ 
