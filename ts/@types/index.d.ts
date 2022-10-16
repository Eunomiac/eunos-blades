import "./euno-blades-roll";
import BladesHelpers from "../euno-helpers.js";
import type ClockKeeper from "../euno-clocks.js";
import { BladesItem } from "../blades-item";
import { BladesActor } from "../blades-actor";
import { bladesRoll } from "../blades-roll";

declare global {
	declare interface Game {
		i18n: {
			localize: (str: string) => string
		},
		blades: {
			dice: typeof bladesRoll
		}
		items: Collection<StoredDocument<BladesItem>>,
		actors: Collection<StoredDocument<BladesActor>>,
		eunoblades: {
			ClockKeeper?: ClockKeeper
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
			bobclocks: {
				sizes: number[]
			}
		}
	}

	declare const game: Game

	declare const BladesHelpers: typeof BladesHelpers;
}