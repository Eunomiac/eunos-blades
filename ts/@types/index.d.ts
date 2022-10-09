import "./euno-blades-roll";
import BladesHelpers from "../euno-helpers.js";
import type ClockKeeper from "../euno-clocks.js";

declare global {
	declare interface Game {
		i18n: {
			localize: (str: string) => string
		},
		eunoblades: {
			clockData: ClockKeeper[]
		}
	}

	declare const game: Game

	declare const BladesHelpers: typeof BladesHelpers;
}