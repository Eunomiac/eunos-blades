import { BladesItem } from "../blades-item";
import { BladesActor } from "../blades-actor";
import { bladesRoll } from "../blades-roll";

declare global {

	declare interface Game {
		items: Collection<StoredDocument<BladesItem>>,
		actors: Collection<StoredDocument<BladesActor>>,
		user: {
			name: string,
			id: string,
			isGM: boolean
		}
		eunoblades: {
			ClockKeeper?: BladesItem
		},
		system: {
			model: {
				Actor: {
					character: {
						attributes: Record<string, {
							label: string,
							skills: Record<string, {label: string}>
						}>
					}
				}
			}
		}
	}

	declare const eLog: {
		display: (...content: [string, ...any[]]) => void,
		log: (...content: [string, ...any[]]) => void,
		error: (...content: [string, ...any[]]) => void,
		hbsLog: (...content: [string, ...any[]]) => void
	};

	interface LenientGlobalVariableTypes {
    game: never;
  }


	type ClickEvent = JQuery.ClickEvent<HTMLElement, undefined, HTMLElement, HTMLElement>;

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

}