/* ****▌███████████████████████████████████████████████████████████████████████████▐**** *\
|*     ▌█░░░░░░░░░ Euno's Blades in the Dark for Foundry VTT ░░░░░░░░░░░█▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░ by Eunomiac ░░░░░░░░░░░░░██████████████████▐     *|
|*     ▌█  License █ v0.1.0 ██▐     *|
|*     ▌████░░░░  ░░░░█████▐     *|
\* ****▌███████████████████████████████████████████████████████████████████████████▐**** */

import BladesActor from "../../BladesActor.js";
class BladesFaction extends BladesActor {

    get rollOppID() { return this.id; }
    get rollOppDoc() { return this; }
    get rollOppImg() { return this.img ?? ""; }
    get rollOppName() { return this.name ?? ""; }
    get rollOppSubName() { return this.system.subtitle || this.system.concept || " "; }
    get rollOppType() { return this.type; }
    get rollOppModsData() { return []; }
    
    async addClock(clockData = {}) {
        clockData.id ??= clockData.id ?? randomID();
        clockData.color ??= "white";
        clockData.display ??= "";
        clockData.isVisible ??= false;
        clockData.isNameVisible ??= false;
        clockData.isActive ??= false;
        clockData.max ??= 4;
        clockData.target ??= `system.clocks.${clockData.id}.value`;
        clockData.value ??= 0;
        return this.update({ [`system.clocks.${clockData.id}`]: clockData });
    }
    async deleteClock(clockID) {
        return this.update({ [`system.clocks.-=${clockID}`]: null });
    }
}
export default BladesFaction;