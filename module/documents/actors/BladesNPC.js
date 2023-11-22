import { Factor } from "../../core/constants.js";
import BladesActor from "../../BladesActor.js";
class BladesNPC extends BladesActor {
    // #region BladesRoll Implementation
    get rollFactors() {
        const factorData = super.rollFactors;
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
        return factorData;
    }
    // #region BladesRoll.OppositionDoc Implementation
    get rollOppID() { return this.id; }
    get rollOppDoc() { return this; }
    get rollOppImg() { return this.img; }
    get rollOppName() { return this.name; }
    get rollOppSubName() { return this.system.subtitle || this.system.concept || " "; }
    get rollOppType() { return this.type; }
    get rollOppModsData() { return []; }
    // #endregion
    // #region BladesRoll.ParticipantDoc Implementation
    get rollParticipantID() { return this.id; }
    get rollParticipantDoc() { return this; }
    get rollParticipantIcon() { return this.img; }
    get rollParticipantName() { return this.name; }
    get rollParticipantType() { return this.type; }
    get rollParticipantModsData() { return []; }
}
export default BladesNPC;
