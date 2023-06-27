/* ****▌███████████████████████████████████████████████████████████████████████████▐**** *\
|*     ▌████░░░░░░░░░░░ Euno's Blades in the Dark for Foundry VTT ░░░░░░░░░░░░░████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░ by Eunomiac ░░░░░░░░░░░░░██████████████████▐     *|
|*     ▌████████████████████████████  License █ v0.1.0 ████████████████████████████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░░░░░░  ░░░░░░░░░░░░░░░░░░███████████████████▐     *|
\* ****▌███████████████████████████████████████████████████████████████████████████▐**** */

import U from "./utilities.js";
class MixinBuilder {
    superclass;
    constructor(superclass) {
        this.superclass = superclass;
        this.superclass = superclass;
    }
    with(...mixins) {
        return mixins.reduce((cls, mixin = (x) => x) => mixin(cls), this.superclass);
    }
}
const MIX = (superclass) => {
    return new MixinBuilder(superclass);
};
export default MIX;
export const DocGetters = (superclass) => class extends superclass {
    static get All() { return superclass instanceof Actor ? game.actors : game.items; }
    static Get(docRef) {
        if (docRef instanceof this) {
            return docRef;
        }
        const docID = U.isDocID(docRef);
        const doc = this.All.find((d) => (docID ? d.system.world_name === docRef : d.name === docRef));
        return doc || null;
    }
};
export const HasDOMElements = (superclass) => class extends superclass {
    get x() {
        return U.pFloat(gsap.getProperty(this.elem, "x"));
    }
    get y() {
        return U.pFloat(gsap.getProperty(this.elem, "y"));
    }
    get height() {
        return U.pFloat(gsap.getProperty(this.elem, "height"));
    }
    get width() {
        return U.pFloat(gsap.getProperty(this.elem, "width"));
    }
    get radius() {
        return (this.height + this.width) / 4;
    }
    get sel() {
        return `#${this.id}`;
    }
    get elem() {
        return (this._elem = this._elem ?? $(this.sel)?.[0]);
    }
    get $() {
        return $(this.elem);
    }
};