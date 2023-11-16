import BladesActor from "../../BladesActor.js";
/*~ @@DOUBLE-BLANK@@ ~*/
class BladesFaction extends BladesActor {
    /*~ @@DOUBLE-BLANK@@ ~*/
    // #region BladesRoll Implementation
    /*~ @@DOUBLE-BLANK@@ ~*/
    // #region BladesRoll.OppositionDoc Implementation
    get rollOppID() { return this.id; }
    /*~ @@DOUBLE-BLANK@@ ~*/
    get rollOppDoc() { return this; }
    /*~ @@DOUBLE-BLANK@@ ~*/
    get rollOppImg() { return this.img ?? ""; }
    /*~ @@DOUBLE-BLANK@@ ~*/
    get rollOppName() { return this.name ?? ""; }
    /*~ @@DOUBLE-BLANK@@ ~*/
    get rollOppSubName() { return this.system.subtitle || this.system.concept || " "; }
    /*~ @@DOUBLE-BLANK@@ ~*/
    get rollOppType() { return this.type; }
    /*~ @@DOUBLE-BLANK@@ ~*/
    get rollOppModsData() { return []; }
    // #endregion
    /*~ @@DOUBLE-BLANK@@ ~*/
    // #endregion
    /*~ @@DOUBLE-BLANK@@ ~*/
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
        /*~ @@DOUBLE-BLANK@@ ~*/
        return this.update({ [`system.clocks.${clockData.id}`]: clockData });
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    async deleteClock(clockID) {
        return this.update({ [`system.clocks.-=${clockID}`]: null });
    }
}
/*~ @@DOUBLE-BLANK@@ ~*/
export default BladesFaction;
/*~ @@DOUBLE-BLANK@@ ~*/ 
