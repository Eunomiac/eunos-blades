
// import BladesItem from "../BladesItem";
import BladesActor from "../BladesActor";
// import BladesClockKeeper from "../documents/items/BladesClockKeeper";
import {BladesItem, BladesClockKeeper, BladesGMTracker} from "../documents/BladesItemProxy";
import BladesConsequence from "../classes/BladesConsequence";
// import BladesGMTracker from "../documents/items/BladesGMTracker";
import BladesClock, {BladesClockKey} from "../classes/BladesClock";
import BladesPushAlert from "../classes/BladesPushAlert";
import BladesChat from "../classes/BladesChat";
import C from "../core/constants";
import type gsap from "/scripts/greensock/esm/all";


import "./blades-general-types";

import "./blades-document";

import "./blades-actor";
import "./blades-pc-sheet";

import "./blades-item";
import "./blades-item-sheet";

import "./blades-roll";
import "./blades-dialog";
import "./blades-clock";
import "./blades-tags";

declare module 'gsap/all';





declare global {

  // Foundry Game Document & Lenient Config for 'game' object
  declare interface Game {
    items: Collection<BladesItem>,
    actors: Collection<BladesActor>,
    user: User,
    users: Collection<User>,
    messages: Collection<BladesChat>,
    scenes: Scenes,
    model: {
      Actor: Record<BladesActorType, BladesActorSystem>,
      Item: Record<BladesItemType, BladesItemSystem>
    },
    eunoblades: {
      ClockKeeper?: BladesClockKeeper,
      Tracker?: BladesGMTracker,
      PushController?: BladesPushAlert,
      Clocks: Collection<BladesClock>,
      ClockKeys: Collection<BladesClockKey>,
      Consequences: Collection<BladesConsequence>
    }
  }
  declare interface User {
    _id: string,
    flags: {
      ["eunos-blades"]?: Record<string,any>
    }
  }
  declare interface CONFIG {
    debug: {
      logging: boolean
    }
  }
  interface LenientGlobalVariableTypes { game: never }

  interface FlagConfig {
    User: {
      [C.SYSTEM_ID]?: {
        rollCollab?: BladesRoll.FlagData
      }
    };
  }

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
  type InputChangeEvent = JQuery.ChangeEvent<HTMLInputElement, undefined, HTMLInputElement, HTMLInputElement>;
  type BlurEvent = JQuery.TypeEventHandler<HTMLElement, undefined, HTMLElement, HTMLElement, "blur">;
  // type DropEvent = JQuery.TypeEventHandler<HTMLElement, undefined, HTMLElement, HTMLElement, "drop">;
  type DropEvent = JQuery.DropEvent<HTMLElement,undefined, HTMLElement, HTMLElement>;
  type OnSubmitEvent = Event & ClickEvent & {
    result: Promise<Record<string,string|number|boolean>>
  }
  type ChangeEvent = JQuery.ChangeEvent<HTMLElement, undefined, HTMLElement, HTMLElement>;
  type SelectChangeEvent = JQuery.ChangeEvent<HTMLSelectElement, undefined, HTMLSelectElement, HTMLSelectElement>;


}