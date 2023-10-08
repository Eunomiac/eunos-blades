import {BladesActorType, Factor} from "../../core/constants";
import BladesActor from "../../BladesActor";
import BladesRollCollab from "../../BladesRollCollab";

class BladesNPC extends BladesActor implements BladesActorSubClass.NPC,
                                               BladesRollCollab.OppositionDocData,
                                               BladesRollCollab.ParticipantDocData {


  // #region BladesRollCollab Implementation

  get rollFactors(): Partial<Record<Factor, BladesRollCollab.FactorData>> {
    const factorData: Partial<Record<Factor, BladesRollCollab.FactorData>> = {
      [Factor.tier]: {
        name: Factor.tier,
        value: this.getFactorTotal(Factor.tier),
        max: this.getFactorTotal(Factor.tier),
        baseVal: this.getFactorTotal(Factor.tier),
        isActive: true,
        isPrimary: true,
        isDominant: false,
        highFavorsPC: true
      },
      [Factor.quality]: {
        name: Factor.quality,
        value: this.getFactorTotal(Factor.quality),
        max: this.getFactorTotal(Factor.quality),
        baseVal: this.getFactorTotal(Factor.quality),
        isActive: false,
        isPrimary: false,
        isDominant: false,
        highFavorsPC: true
      }
    };

    if (BladesActor.IsType(this, BladesActorType.npc)) {
      factorData[Factor.scale] = {
        name: Factor.scale,
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
        value: this.getFactorTotal(Factor.magnitude),
        max: this.getFactorTotal(Factor.magnitude),
        baseVal: this.getFactorTotal(Factor.magnitude),
        isActive: false,
        isPrimary: false,
        isDominant: false,
        highFavorsPC: true
      };
    }

    return factorData;
  }

  // #region BladesRollCollab.OppositionDoc Implementation
  get rollOppID() { return this.id; }

  get rollOppDoc() { return this; }

  get rollOppImg() { return this.img; }

  get rollOppName() { return this.name; }

  get rollOppSubName() { return this.system.subtitle || this.system.concept || " "; }

  get rollOppType() { return this.type; }

  get rollOppModsData(): BladesRollCollab.RollModData[] { return []; }
  // #endregion

  // #region BladesRollCollab.ParticipantDoc Implementation
  get rollParticipantID() { return this.id; }

  get rollParticipantDoc() { return this; }

  get rollParticipantIcon() { return this.img; }

  get rollParticipantName() { return this.name; }

  get rollParticipantType() { return this.type; }

  get rollParticipantModsData(): BladesRollCollab.RollModData[] { return []; }
  // #endregion

  // #endregion


}

declare interface BladesNPC {
  type: BladesActorType.npc,
  system: BladesActorSchema.NPC
}

export default BladesNPC;
