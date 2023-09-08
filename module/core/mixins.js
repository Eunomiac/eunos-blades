/* ****▌███████████████████████████████████████████████████████████████████████████▐**** *\
|*     ▌████░░░░░░░░░░░ Euno's Blades in the Dark for Foundry VTT ░░░░░░░░░░░░░████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░ by Eunomiac ░░░░░░░░░░░░░██████████████████▐     *|
|*     ▌████████████████████████████  License █ v0.1.0 ████████████████████████████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░░░░░░  ░░░░░░░░░░░░░░░░░░███████████████████▐     *|
\* ****▌███████████████████████████████████████████████████████████████████████████▐**** */

import { BladesItemType } from "./constants.js";
import BladesItem from "../blades-item.js";
class MixinBuilder {
    superclass;
    constructor(superclass) { this.superclass = superclass; }
    with(...mixins) {
        return mixins.reduce((cls, mixin = (x) => x) => mixin(cls), this.superclass);
    }
}
const MIX = (superclass) => new MixinBuilder(superclass);
export const HasPlaybook = (superclass) => class extends superclass {
    get playbookName() {
        return this.playbook?.name;
    }
    get playbook() {
        return this.activeSubItems.find((item) => BladesItem.IsType(item, BladesItemType.playbook, BladesItemType.crew_playbook));
    }
};
export default MIX;