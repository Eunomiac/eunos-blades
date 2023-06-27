import U from "./utilities.js";
import {BladesActorType, BladesItemType} from "./constants.js";
import BladesActor from "../blades-actor.js";
import BladesItem from "../blades-item.js";


class MixinBuilder<T, M> {
	constructor(private superclass: T) {
		this.superclass = superclass;
	}

	with<U extends T & M & MixinBuilder<T, M>>(...mixins: Array<(cls: U) => U>): U & T & M {
		return mixins.reduce((cls: U, mixin: (cls: U) => U = (x) => x) => mixin(cls), this.superclass as U & T);
	}
}

const MIX = <T extends new (...args: any[]) => any, M>(superclass: T): MixinBuilder<T, M> => {
	return new MixinBuilder(superclass);
};

export default MIX;


// MIXINS:
export const DocGetters = <T extends new (...args: any[]) => any>(superclass: T) => class extends superclass {
	static get All(): Collection<BladesActor|BladesItem> { return superclass instanceof Actor ? game.actors : game.items }

	static Get(docRef: string | BladesDoc): BladesActor | BladesItem | null {
		// If actorRef is already a BladesActor instance, return it immediately
		if (docRef instanceof this) {
			return docRef as InstanceType<T>;
		}
		// Determine if actorRef is a doc ID or a name using the U.isDocID() utility function
		const docID = U.isDocID(docRef);
		// Search through the list of all BladesActor instances to find the one with the matching doc ID or name
		const doc = this.All.find((d): d is InstanceType<T> => (docID ? d.system.world_name === docRef : d.name === docRef));
		// Return the found BladesActor instance, or null if no match was found
		return doc || null;
	}
};

export const HasDOMElements = <T extends { new (...args: any[]): any }>(
	superclass: T
) =>
		class extends superclass {
			get x(): number {
				return U.pFloat(gsap.getProperty(this.elem, "x"));
			}

			get y(): number {
				return U.pFloat(gsap.getProperty(this.elem, "y"));
			}

			get height(): number {
				return U.pFloat(gsap.getProperty(this.elem, "height"));
			}

			get width(): number {
				return U.pFloat(gsap.getProperty(this.elem, "width"));
			}

			get radius(): number {
				return (this.height + this.width) / 4;
			}


			get sel(): string {
				return `#${this.id}`;
			}

			get elem(): HTMLElement {
				return (this._elem = this._elem ?? $(this.sel)?.[0]);
			}

			get $(): JQuery<HTMLElement> {
				return $(this.elem);
			}
		};