import "./euno-blades-roll";
import {BladesHelpers} from "../blades-helpers.js";

declare global {
	declare interface Game {
		i18n: {
			localize: (str: string) => string
		}
	}

	declare const game: Game

	declare const BladesHelpers: typeof BladesHelpers;
}