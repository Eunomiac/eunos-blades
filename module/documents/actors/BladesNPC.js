import { Factor } from "../../core/constants.js";
import BladesActor from "../../BladesActor.js";
/*~ @@DOUBLE-BLANK@@ ~*/
class BladesNPC extends BladesActor {
    /*~ @@DOUBLE-BLANK@@ ~*/
    // #region BladesRoll Implementation
    /*~ @@DOUBLE-BLANK@@ ~*/
    get rollFactors() {
        /*~ @@DOUBLE-BLANK@@ ~*/
        const factorData = super.rollFactors;
        /*~ @@DOUBLE-BLANK@@ ~*/
        factorData[Factor.scale] = {
            name: Factor.scale,
            display: "Scale",
            value: this.getFactorTotal(Factor.scale),
            max: this.getFactorTotal(Factor.scale),
            baseVal: this.getFactorTotal(Factor.scale),
            cssClasses: "factor-grey",
            isActive: false,
            isPrimary: false,
            isDominant: false,
            highFavorsPC: true
        };
        factorData[Factor.magnitude] = {
            name: Factor.magnitude,
            display: "Magnitude",
            value: this.getFactorTotal(Factor.magnitude),
            max: this.getFactorTotal(Factor.magnitude),
            baseVal: this.getFactorTotal(Factor.magnitude),
            isActive: false,
            isPrimary: false,
            isDominant: false,
            highFavorsPC: true
        };
        /*~ @@DOUBLE-BLANK@@ ~*/
        return factorData;
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    // #region BladesRoll.OppositionDoc Implementation
    get rollOppID() { return this.id; }
    /*~ @@DOUBLE-BLANK@@ ~*/
    get rollOppDoc() { return this; }
    /*~ @@DOUBLE-BLANK@@ ~*/
    get rollOppImg() { return this.img; }
    /*~ @@DOUBLE-BLANK@@ ~*/
    get rollOppName() { return this.name; }
    /*~ @@DOUBLE-BLANK@@ ~*/
    get rollOppSubName() { return this.system.subtitle || this.system.concept || " "; }
    /*~ @@DOUBLE-BLANK@@ ~*/
    get rollOppType() { return this.type; }
    /*~ @@DOUBLE-BLANK@@ ~*/
    get rollOppModsData() { return []; }
    // #endregion
    /*~ @@DOUBLE-BLANK@@ ~*/
    // #region BladesRoll.ParticipantDoc Implementation
    get rollParticipantID() { return this.id; }
    /*~ @@DOUBLE-BLANK@@ ~*/
    get rollParticipantDoc() { return this; }
    /*~ @@DOUBLE-BLANK@@ ~*/
    get rollParticipantIcon() { return this.img; }
    /*~ @@DOUBLE-BLANK@@ ~*/
    get rollParticipantName() { return this.name; }
    /*~ @@DOUBLE-BLANK@@ ~*/
    get rollParticipantType() { return this.type; }
    /*~ @@DOUBLE-BLANK@@ ~*/
    get rollParticipantModsData() { return []; }
}
/*~ @@DOUBLE-BLANK@@ ~*/
export default BladesNPC;
/*~ @@DOUBLE-BLANK@@ ~*/ 
