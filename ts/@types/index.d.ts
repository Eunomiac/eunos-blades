import { BladesActorType, BladesItemType, Tag, Vice, District, Playbook } from "../core/constants";
import BladesItem, { PrereqType } from "../blades-item";
import BladesActor from "../blades-actor";
import { bladesRoll } from "../blades-roll";
import BladesSelectorDialog from "../blades-dialog";
import BladesItemSheet from "../sheets/blades-item-sheet";
import type gsap from "/scripts/greensock/esm/all";

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
			Tracker?: BladesItem
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

	type BladesTag = Vice
		| Playbook
		| District
		| Tag.System
		| Tag.Item
		| Tag.NPC
		| Tag.PC;

	namespace BladesActor {
		export type ID = string;
		export type RandomizerData = {
			isLocked: boolean,
			value: string,
			size: 1 | 2 | 4,
			label: string | null
		}

		interface SubActorData {
			id: string,
			system: Partial<BladesActor["system"]>
		}
	}

	interface TagifyState {
		state: {
			inputText: boolean,
			editing: boolean
		}
	}

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

	type clockData = {
		size: 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12,
		value: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12,
		color: "yellow" | "blue" | "red" | "white",
		display: string,
		isActive: boolean,
		isNameVisible: boolean,
		isVisible: boolean
	}
	type clockKeyData = {
		clocks: Record<number, clockData | null>,
		numClocks: number,
		id: string,
		display: string,
		isActive: boolean,
		isNameVisible: boolean,
		isVisible: boolean,
		scene: string
	};

	declare class BladesSheet<
									Options extends BladesSheet.Options = BladesSheet.Options,
									Data extends object = BladesSheet.Data<Options>
								> extends ActorSheet<BladesSheet.Options, BladesSheet.Data> {

		override getData(options?: Partial<Options>): BladesSheet.Data | Promise<BladesSheet.Data>;

	}

	declare class Tagify {
		dropdown: Record<string, any>
	}

	namespace BladesSheet {
		interface Options extends ActorSheet.Options { }

		interface Data<Opts extends Options = Options> extends ActorSheet.Data<Opts> {
			items: EmbeddedCollection<typeof BladesItem, BladesActor["data"]>
			& ToObjectFalseType<EmbeddedCollection<typeof BladesItem, BladesActor["data"]>>,
			system: BladesActor["system"]
		}
	}

	namespace BladesDialog {
		interface Options extends DialogOptions {
		}
		interface Data extends Dialog.Data {
			parent: BladesActor;
			docType: "Actor"|"Item";
			tabs: Record<string, BladesActor[] | BladesItem[]>;
			tags?: BladesTag[];
		}
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