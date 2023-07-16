import { BladesActorType, BladesItemType, Tag, Vice, District, Playbook } from "../core/constants";
import BladesItem, { PrereqType } from "../blades-item";
import BladesActor from "../blades-actor";
import { bladesRoll } from "../blades-roll";
import BladesSelectorDialog from "../blades-dialog";
import BladesItemSheet from "../sheets/blades-item-sheet";
import BladesTrackerSheet from "../sheets/blades-tracker-sheet.js";
import type gsap from "/scripts/greensock/esm/all";


import "./blades-actor";
import "./blades-item";
import "./blades-sheet";
import "./blades-dialog";

import "./blades-clock";
import "./blades-tags";

declare global {

	declare const gsap: gsap;

	namespace SystemDocs {
		export type Actor = BladesActor;
		export type Item = BladesItem;
		export type ActorSheet = BladesSheet;
		export type ItemSheet = BladesItemSheet;

		export type Sheet = BladesSheet | BladesItemSheet;
	}
	declare interface Game {
		items: Collection<BladesItem>,
		actors: Collection<BladesActor>,
		user: User,
		eunoblades: {
			ClockKeeper?: BladesItem,
			Tracker?: BladesItem,
		},
		system: {
			model: {
				Actor: {
					pc: {
						attributes: Record<string, {
							label: string,
							skills: Record<string, { label: string }>
						}>
					}
				}
			}
		}
	}

	type BladesDoc = BladesActor | BladesItem;

	type DocRef = string | BladesDoc;
	type ActorRef = string | BladesActor;
	type ItemRef = string | BladesItem;



	declare abstract class BladesDocument<T extends Actor | Item> {

		static get All(): T extends Actor ? BladesActor[] : BladesItem[];
		static Get(docRef: DocRef): (T extends Actor ? BladesActor[] : BladesItem[]) | undefined;
		static GetTypeWithTags(type: BladesActorType | BladesItemType, ...tags: BladesTag[]): T extends Actor ? BladesActor[] : BladesItem[];

		tags: BladesTag[];
		hasTag(...tags: BladesTag[]): boolean
		addTag(...tags: BladesTag[]): Promise<void>
		remTag(...tags: BladesTag[]): Promise<void>

		tooltip?: string;

		dialogCSSClasses?: string;
	}








	type eLogParams = [string, ...any[]];
	declare const eLog: Record<string, (...content: eLogParams) => void>

	interface LenientGlobalVariableTypes { game: never }


	type ClickEvent = JQuery.ClickEvent<HTMLElement, undefined, HTMLElement, HTMLElement>;
	type ContextMenuEvent = JQuery.ContextMenuEvent<HTMLElement, undefined, HTMLElement, HTMLElement>;
	type TriggerEvent = JQuery.TriggeredEvent<HTMLElement, undefined, HTMLElement, HTMLElement>;

	// #region ████████ SocketLib: SocketLib Types ████████ ~
	type SocketFunction = (...params: unknown[]) => unknown
	interface Socket {

		register(funcName: string, func: SocketFunction): void;

		/**
		 * Chooses One Connected GM Client (at random, if multiple).
		 * Executes 'handler' on that Client, passing it 'parameters'.
		 * Can 'await' return value of passed handler function.
		 */
		executeAsGM<S extends SocketFunction>(handler: string | S, ...parameters: Parameters<S>): Promise<ReturnType<S>>

		/**
			* Chooses Specified User Client, if Connected.
			* Executes 'handler' on that Client, passing it 'parameters'.
		* Can 'await' return value of passed handler function.
			*/
		executeAsUser<S extends SocketFunction>(handler: S, userId: string, ...parameters: Parameters<S>): Promise<ReturnType<S>>

		/**
		 * Chooses GM Clients.
		 * Executes 'handler' on ALL, passing it 'parameters'.
		 * CANNOT 'await' return value.
		 */
		executeForAllGMs<S extends SocketFunction>(handler: string | S, ...parameters: Parameters<S>): Promise<void>

		/**
			* Chooses GM Clients EXCEPT Caller.
			* Executes 'handler' on ALL, passing it 'parameters'.
			* CANNOT 'await' return value.
			*/
		executeForOtherGMs<S extends SocketFunction>(handler: string | S, ...parameters: Parameters<S>): Promise<void>

		/**
	 * Chooses ALL Clients.
	 * Executes 'handler' on ALL, passing it 'parameters'.
		 * CANNOT 'await' return value.
	 */
		executeForEveryone<S extends SocketFunction>(handler: string | S, ...parameters: Parameters<S>): Promise<void>
		/**
			* Chooses ALL Clients EXCEPT Caller.
			* Executes 'handler' on ALL, passing it 'parameters'.
			* CANNOT 'await' return value.
			*/
		executeForOthers<S extends SocketFunction>(handler: string | S, ...parameters: Parameters<S>): Promise<void>
		/**
			* Chooses ALL Specified User Clients, if Connected.
			* Executes 'handler' on ALL, passing it 'parameters'.
			* CANNOT 'await' return value.
			*/
		executeForUsers<S extends SocketFunction>(handler: string | S, userIDs: string[], ...parameters: Parameters<S>): Promise<void>


	}
	interface SocketLib {
		registerModule(modName: string): Socket;
		registerSystem(sysName: string): Socket;

		system: Socket;
	}

	declare const socketlib: SocketLib;
	// #endregion ▄▄▄▄▄ SocketLib ▄▄▄▄▄

	type ValueMax = {
		max: number,
		value: number
	}

	type NamedValueMax = ValueMax & { name: string };
}