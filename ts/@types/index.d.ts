import BladesItem from "../blades-item";
import BladesActor from "../blades-actor";
import { bladesRoll } from "../blades-roll";
import BladesDialog from "../blades-dialog";

declare global {

	declare enum BladesActorType {
		pc = "character",
		npc = "npc",
		crew = "crew"
	}

	declare enum BladesItemType {
		ability = "ability",
		background = "background",
		clock_keeper = "clock_keeper",
		cohort = "cohort",
		crew_ability = "crew_ability",
		crew_reputation = "crew_reputation",
		crew_playbook = "crew_playbook",
		crew_upgrade = "crew_upgrade",
		faction = "faction",
		feature = "feature",
		gm_tracker = "gm_tracker",
		heritage = "heritage",
		item = "item",
		playbook = "playbook",
		stricture = "stricture",
		vice = "vice"
	}

	declare enum Attributes {
		insight = "insight",
		prowess = "prowess",
		resolve = "resolve"
	}
	declare enum InsightActions {
		hunt = "hunt",
		study = "study",
		survey = "survey",
		tinker = "tinker"
	}
	declare enum ProwessActions {
		finesse = "finesse",
		prowl = "prowl",
		skirmish = "skirmish",
		wreck = "wreck"
	}
	declare enum ResolveActions {
		attune = "attune",
		command = "command",
		consort = "consort",
		sway = "sway"
	}
	declare enum Actions {
		hunt = "hunt",
		study = "study",
		survey = "survey",
		tinker = "tinker",
		finesse = "finesse",
		prowl = "prowl",
		skirmish = "skirmish",
		wreck = "wreck",
		attune = "attune",
		command = "command",
		consort = "consort",
		sway = "sway"
	}

	declare enum Positions {
		controlled = "controlled",
		risky = "risky",
		desperate = "desperate"
	}
	declare enum EffectLevels {
		extreme = "extreme",
		great = "great",
		standard = "standard",
		limited = "limited",
		zero = "zero"
	}

	namespace SystemDocs {
		export type Actor = BladesActor;
		export type Item = BladesItem;
		export type ActorSheet = BladesSheet;
		export type ItemSheet = BladesItemSheet;

		export type Sheet = BladesSheet|BladesItemSheet;
	}

	declare interface Game {
		items: Collection<StoredDocument<BladesItem>>,
		actors: Collection<StoredDocument<BladesActor>>,
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
			data: Partial<Omit<BladesActor["system"],"subactors">>
		}
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