
import BladesItem from "../blades-item";
import BladesActor from "../blades-actor";
import BladesPushController from "../blades-push-notifications";
import type gsap from "/scripts/greensock/esm/all";

import "./blades-general-types";

import "./blades-document";

import "./blades-actor";
import "./blades-actor-sheet";

import "./blades-item";
import "./blades-item-sheet";

import "./blades-roll";
import "./blades-dialog";
import "./blades-clock";
import "./blades-tags";

declare global {

  // Foundry Game Document & Lenient Config for 'game' object
  declare interface Game {
    items: Collection<BladesItem>,
    actors: Collection<BladesActor>,
    user: User,
    users: Collection<User>,
    scenes: Scenes,
    model: {
      Actor: Record<BladesActorType, BladesActorSystem>,
      Item: Record<BladesItemType, BladesItemSystem>
    },
    eunoblades: {
      ClockKeeper?: BladesItem,
      Tracker?: BladesItem,
      PushController?: BladesPushController
    }
  }
  declare interface User {
    _id: string,
    flags: {
      ["eunos-blades"]?: Record<string,any>
    }
  }
  interface LenientGlobalVariableTypes { game: never }

  // GreenSock Accessor Object
  declare const gsap: gsap;
  type BladesTweenTarget = JQuery<HTMLElement> | gsap.TweenTarget;

  // Global Debugger/Logger
  type eLogParams = [string, ...any[]];
  declare const eLog: Record<string, (...content: eLogParams) => void>

  // JQuery Simplified Events
  type ClickEvent = JQuery.ClickEvent<HTMLElement, undefined, HTMLElement, HTMLElement>;
  type ContextMenuEvent = JQuery.ContextMenuEvent<HTMLElement, undefined, HTMLElement, HTMLElement>;
  type TriggerEvent = JQuery.TriggeredEvent<HTMLElement, undefined, HTMLElement, HTMLElement>;
  type InputChangeEvent = JQuery.TypeEventHandler<HTMLInputElement, undefined, HTMLInputElement, HTMLInputElement, "change">;
  type BlurEvent = JQuery.TypeEventHandler<HTMLElement, undefined, HTMLElement, HTMLElement, "blur">;

}