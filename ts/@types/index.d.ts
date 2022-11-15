import BladesItem from "../blades-item";
import BladesActor from "../blades-actor";
import { bladesRoll } from "../blades-roll";
import BladesDialog from "../blades-dialog";
import BladesItemSheet from "../sheets/blades-item-sheet";

declare global {

	namespace SystemDocs {
		export type Actor = BladesActor;
		export type Item = BladesItem;
		export type ActorSheet = BladesSheet;
		export type ItemSheet = BladesItemSheet;

		export type Sheet = BladesSheet|BladesItemSheet;
	}



	declare interface Game {
		items: Collection<BladesItem>,
		actors: Collection<BladesActor>,
		user: {
			name: string,
			id: string,
			isGM: boolean
		}
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
							skills: Record<string, {label: string}>
						}>
					}
				}
			}
		}
	}

	type BladesDoc = BladesActor|BladesItem|EmbeddedBladesActor;

	type DocRef = string|BladesDoc;
	type ActorRef = string|BladesActor|EmbeddedBladesActor;
	type ItemRef = string|BladesItem;

	namespace BladesActor {
		export type ID = string;
		export type SubActorCategory = string;

		export type RandomizerData = {
			isLocked: boolean,
			value: string,
			size: 1|2|4,
			label: string|null
		}

		interface SubActorData {
			id: string,
			category: SubActorCategory,
			system: Partial<Omit<BladesActor["system"],"subactors">>,
			isArchived?: boolean
		}
	}

	type EmbeddedBladesActor = BladesActor & {
		category: keyof typeof BladesActor.CategoryTypes,
		isArchived?: boolean,
		system: BladesActor["system"] & Record<string,any>
	}

	namespace BladesItem {

	}

	type clockData = {
		size: 2|3|4|5|6|8|10|12,
		value: 0|1|2|3|4|5|6|7|8|9|10|11|12,
		color: "yellow"|"blue"|"red"|"white",
		display: string,
		isActive: boolean,
		isNameVisible: boolean,
		isVisible: boolean
	}
	type clockKeyData = {
		clocks: Record<number, clockData|null>,
		numClocks: number,
		id: string,
		display: string,
		isActive: boolean,
		isNameVisible: boolean,
		isVisible: boolean,
		scene: string
	};

	namespace BladesDialog {
    interface Options extends DialogOptions {
		}
		interface Data extends Dialog.Data {
			doc: BladesActor|BladesItem;
			category: KeyOf<typeof BladesDialog.Categories>;
			callback: (docID: string) => Promise<void>;
			tabs?: Record<string, {featured: Array<BladesActor|BladesItem>, other: Array<BladesActor|BladesItem>}>
		}
	}

	type eLogParams = [string, ...any[]];
	// const eLog = {
	// 	display: (...content: eLogParams) => eLogger("display", ...content),
	// 	log0: (...content: eLogParams) => eLogger("log", ...content, 0),
	// 	log1: (...content: eLogParams) => eLogger("log", ...content, 1),
	// 	log2: (...content: eLogParams) => eLogger("log", ...content, 2),
	// 	log: (...content: eLogParams) => eLogger("log", ...content, 3),
	// 	log4: (...content: eLogParams) => eLogger("log", ...content, 4),
	// 	log5: (...content: eLogParams) => eLogger("log", ...content, 5),
	// 	checkLog0: (...content: eLogParams) => eLogger("checkLog", ...content, 0),
	// 	checkLog1: (...content: eLogParams) => eLogger("checkLog", ...content, 1),
	// 	checkLog2: (...content: eLogParams) => eLogger("checkLog", ...content, 2),
	// 	checkLog: (...content: eLogParams) => eLogger("checkLog", ...content, 3),
	// 	checkLog4: (...content: eLogParams) => eLogger("checkLog", ...content, 4),
	// 	checkLog5: (...content: eLogParams) => eLogger("checkLog", ...content, 5),
	// 	error: (...content: eLogParams) => eLogger("error", ...content),
	// 	hbsLog: (...content: eLogParams) => eLogger("handlebars", ...content)
	// };

	declare const eLog: Record<string, (...content: eLogParams) => void>

	interface LenientGlobalVariableTypes {
    game: never;
  }


	type ClickEvent = JQuery.ClickEvent<HTMLElement, undefined, HTMLElement, HTMLElement>;
	type ContextMenuEvent = JQuery.ContextMenuEvent<HTMLElement, undefined, HTMLElement, HTMLElement>;
	type TriggerEvent = JQuery.TriggeredEvent<HTMLElement, undefined, HTMLElement, HTMLElement>;

	// declare function $clamp(element: HTMLElement, options: Record<string,any>): {
	// 	original: string,
	// 	clamped: string
	// }

	// #region ████████ SocketLib: SocketLib Types ████████ ~
	type SocketFunction = (...params: unknown[]) => unknown
	interface Socket {

		register(funcName: string, func: SocketFunction): void;

	/**
	 * Chooses One Connected GM Client (at random, if multiple).
	 * Executes 'handler' on that Client, passing it 'parameters'.
	 * Can 'await' return value of passed handler function.
	 */
	executeAsGM<S extends SocketFunction>(handler: string|S, ...parameters: Parameters<S>): Promise<ReturnType<S>>

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
		executeForAllGMs<S extends SocketFunction>(handler: string|S, ...parameters: Parameters<S>): Promise<void>

	/**
		* Chooses GM Clients EXCEPT Caller.
		* Executes 'handler' on ALL, passing it 'parameters'.
		* CANNOT 'await' return value.
		*/
		executeForOtherGMs<S extends SocketFunction>(handler: string|S, ...parameters: Parameters<S>): Promise<void>

		/**
	 * Chooses ALL Clients.
	 * Executes 'handler' on ALL, passing it 'parameters'.
		 * CANNOT 'await' return value.
	 */
	executeForEveryone<S extends SocketFunction>(handler: string|S, ...parameters: Parameters<S>): Promise<void>
	/**
		* Chooses ALL Clients EXCEPT Caller.
		* Executes 'handler' on ALL, passing it 'parameters'.
		* CANNOT 'await' return value.
		*/
		executeForOthers<S extends SocketFunction>(handler: string|S, ...parameters: Parameters<S>): Promise<void>
	/**
		* Chooses ALL Specified User Clients, if Connected.
		* Executes 'handler' on ALL, passing it 'parameters'.
		* CANNOT 'await' return value.
		*/
		executeForUsers<S extends SocketFunction>(handler: string|S, userIDs: string[], ...parameters: Parameters<S>): Promise<void>


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

	type NamedValueMax = ValueMax & {name: string};
}