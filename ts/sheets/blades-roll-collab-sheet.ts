import U from "../core/utilities.js";
import C, {BladesActorType, BladesItemType, RollType, RollModStatus, RollModCategory, Action, Attribute, Position, Effect, Factor, Harm} from "../core/constants.js";
import BladesActor from "../blades-actor.js";
import BladesItem from "../blades-item.js";
import {ApplyTooltipListeners} from "../core/gsap.js";


function isAction(trait: string|number): trait is BladesRollCollab.RollTrait & Action {
  return Boolean(trait && typeof trait === "string" && trait in Action);
}
function isAttribute(trait: string|number): trait is BladesRollCollab.RollTrait & Attribute {
  return Boolean(trait && typeof trait === "string" && trait in Attribute);
}
function isTier(trait: string|number): trait is BladesRollCollab.RollTrait & "tier" { return U.lCase(trait) === "tier" }
function isNumber(trait: string|number): trait is BladesRollCollab.RollTrait & number { return U.isInt(trait) }

class BladesRollCollabSheet extends DocumentSheet {

  static override get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["eunos-blades", "sheet", "roll-collab"],
      template: `systems/eunos-blades/templates/roll-collab${game.user.isGM ? "-gm" : ""}.hbs`,
      submitOnChange: true,
      width: 500
      // height: 500
    });
  }

  static Initialize() {
    return loadTemplates([
      "systems/eunos-blades/templates/roll-collab-gm.hbs",
      "systems/eunos-blades/templates/roll-collab.hbs"
    ]);
  }

  static InitSockets() {
    socketlib.system.register("renderRollCollab", BladesRollCollabSheet.RenderRollCollab);
    socketlib.system.register("closeRollCollab", BladesRollCollabSheet.CloseRollCollab);
  }

  static Current: Record<string, BladesRollCollabSheet> = {};

  static get DefaultFlagData(): BladesRollCollab.FlagData {
    return {
      rollID: randomID(),
      rollType: RollType.Action,
      rollSourceType: "Actor",
      rollSourceID: "",
      rollTrait: Factor.tier,
      rollMods: {
        [RollModCategory.roll]: {
          positive: {
            Push: {
              status: RollModStatus.ToggledOff,
              tooltip: "<p>Take <strong class='shadowed red-bright'>2 Stress</strong> to add <strong class='shadowed'>1 die</strong> to your pool. <em>(You cannot also accept a <strong class='shadowed'>Devil's Bargain</strong> to increase your dice pool: It's one or the other.)</em></p>"
            },
            Bargain: {
              status: RollModStatus.ForcedOff,
              tooltip: "<p>Accept a <strong class='shadowed red-bright'>Devil's Bargain</strong> from the GM to add <strong class='shadowed'>1 die</strong> to your pool <em>(You cannot also <strong class='shadowed'>Push</strong> to increase your dice pool: It's one or the other. You can, however, <strong class='shadowed'>Push</strong> to increase your <strong class='shadowed'>Effect</strong>.)</em></p>"
            },
            Assist: {
              status: RollModStatus.Hidden,
              sideString: "",
              tooltip: "<p>Another character is <strong class='shadowed'>Assisting</strong> your efforts, adding <strong class='shadowed'>1 die</strong> to your pool. <em>(It costs them <span class='shadowed red-bright'>1 Stress</span> to do so.)</em></p>"
            }
          },
          negative: {}
        },
        [RollModCategory.position]: {
          positive: {
            Setup: {
              status: RollModStatus.Hidden,
              sideString: undefined,
              tooltip: "<p>Another character has set you up for success, increasing your <strong class='shadowed'>Position</strong> by one level.</p>"
            }
          },
          negative: {}
        },
        [RollModCategory.effect]: {
          positive: {
            Push: {
              status: RollModStatus.ToggledOff,
              tooltip: "<p>Take <strong class='shadowed red-bright'>2 Stress</strong> to increase your <strong class='shadowed'>Effect</strong> by one level. <em>(You can both <strong class='shadowed'>Push for Effect</strong> and <strong class='shadowed'>Push for +1d</strong> if you like, for a total cost of <strong class='shadowed red-bright'>4 Stress</strong>.)</em></p>"
            },
            Setup: {
              status: RollModStatus.Hidden,
              sideString: undefined,
              tooltip: "<p>Another character has set you up for success, increasing your <strong class='shadowed'>Effect</strong> by one level.</p>"
            },
            Potency: {
              status: RollModStatus.Hidden,
              tooltip: ""
            }
          },
          negative: {}
        },
        [RollModCategory.result]: {positive: {}, negative: {}},
        [RollModCategory.after]: {positive: {}, negative: {}}
      },
      rollPositionInitial: Position.risky,
      rollEffectInitial: Effect.standard,
      rollPosEffectTrade: false,
      rollFactors: {
        [Factor.tier]: {name: "Tier", value: 0, max: 0, isActive: false, isDominant: false, highFavorsPC: true},
        [Factor.quality]: {name: "Quality", value: 0, max: 0, isActive: false, isDominant: false, highFavorsPC: true},
        [Factor.force]: {name: "Force", value: 0, max: 0, isActive: false, isDominant: false, highFavorsPC: true},
        [Factor.scale]: {name: "Scale", value: 0, max: 0, isActive: false, isDominant: false, highFavorsPC: true},
        [Factor.area]: {name: "Area", value: 0, max: 0, isActive: false, isDominant: false, highFavorsPC: true},
        [Factor.duration]: {name: "Duration", value: 0, max: 0, isActive: false, isDominant: false, highFavorsPC: true},
        [Factor.range]: {name: "Range", value: 0, max: 0, isActive: false, isDominant: false, highFavorsPC: true},
        [Factor.magnitude]: {name: "Magnitude", value: 0, max: 0, isActive: false, isDominant: false, highFavorsPC: true}
      },
      isGMReady: false,
      GMBoosts: {
        Dice: 0,
        [Factor.tier]: 0,
        [Factor.quality]: 0,
        [Factor.force]: 0,
        [Factor.scale]: 0,
        [Factor.area]: 0,
        [Factor.duration]: 0,
        [Factor.range]: 0,
        [Factor.magnitude]: 0,
        Result: 0
      }
    };
  }

  static async RenderRollCollab({userID, rollID}: {userID: string, rollID: string}) {
    const user = game.users.get(userID); // as User & {flags: {["eunos-blades"]: {rollCollab: BladesRollCollab.FlagData}}};
    if (!user) { return }
    BladesRollCollabSheet.Current[rollID] = new BladesRollCollabSheet(user, rollID);
    BladesRollCollabSheet.Current[rollID].render(true);
  }

  static async CloseRollCollab(rollID: string) {
    eLog.checkLog3("rollCollab", "CloseRollCollab()", {rollID});
    await BladesRollCollabSheet.Current[rollID]?.close({rollID});
    delete BladesRollCollabSheet.Current[rollID];
  }

  static async NewRoll(config: BladesRollCollab.Config) {
    // All flags initialized on user must be set here, or everyone triggered by socket will run updates
    if (game.user.isGM) { eLog.error("rollCollab", "GM Cannot Use New Roll!"); return }
    const user = game.users.get(config.userID ?? game.user._id);
    if (!(user instanceof User)) {
      eLog.error("rollCollab", `[NewRoll()] Can't Find User '${config.userID}'`, config);
      return;
    }

    const flagUpdateData: BladesRollCollab.FlagData = BladesRollCollabSheet.DefaultFlagData;

    flagUpdateData.rollType = config.rollType;
    if (!(flagUpdateData.rollType in RollType)) {
      eLog.error("rollCollab", `[RenderRollCollab()] Invalid rollType: ${flagUpdateData.rollType}`, config);
      return;
    }
    const rollSource = config.rollSource ?? user.character;
    if (!(rollSource instanceof BladesActor || rollSource instanceof BladesItem)) {
      eLog.error("rollCollab", "[RenderRollCollab()] Invalid rollSource", {rollSource, config});
      return;
    }
    flagUpdateData.rollSourceID = rollSource.id;
    flagUpdateData.rollSourceType = rollSource instanceof BladesActor ? "Actor" : "Item";
    if (U.isInt(config.rollTrait)) {
      flagUpdateData.rollTrait = config.rollTrait;
    } else if (!config.rollTrait) {
      eLog.error("rollCollab", "[RenderRollCollab()] No RollTrait in Config", config);
      return;
    } else {
      switch (flagUpdateData.rollType) {
        case RollType.Action: {
          if (!(U.lCase(config.rollTrait) in {...Action, ...Factor})) {
            eLog.error("rollCollab", `[RenderRollCollab()] Bad RollTrait for Action Roll: ${config.rollTrait}`, config);
            return;
          }
          flagUpdateData.rollTrait = U.lCase(config.rollTrait) as Action|Factor;
          break;
        }
        case RollType.Downtime: {
          if (!(U.lCase(config.rollTrait) in {...Action, ...Factor})) {
            eLog.error("rollCollab", `[RenderRollCollab()] Bad RollTrait for Downtime Roll: ${config.rollTrait}`, config);
            return;
          }
          flagUpdateData.rollTrait = U.lCase(config.rollTrait) as Action|Factor;
          break;
        }
        case RollType.Fortune: {
          if (!(U.lCase(config.rollTrait) in {...Action, ...Attribute, ...Factor})) {
            eLog.error("rollCollab", `[RenderRollCollab()] Bad RollTrait for Fortune Roll: ${config.rollTrait}`, config);
            return;
          }
          flagUpdateData.rollTrait = U.lCase(config.rollTrait) as Action|Attribute|Factor;
          break;
        }
        case RollType.Resistance: {
          if (!(U.lCase(config.rollTrait) in Attribute)) {
            eLog.error("rollCollab", `[RenderRollCollab()] Bad RollTrait for Resistance Roll: ${config.rollTrait}`, config);
            return;
          }
          break;
        }
        // no default
      }
      flagUpdateData.rollTrait = U.lCase(config.rollTrait) as BladesRollCollab.RollTrait;
    }

    /* DUMMY DATA FOR DEV PURPOSES */
    flagUpdateData.rollMods = {
      [RollModCategory.roll]: {
        positive: {
          "Push": {
            status: RollModStatus.ToggledOff,
            tooltip: "<p>Take <strong class='shadowed red-bright'>2 Stress</strong> to add <strong class='shadowed'>1 die</strong> to your pool.</p><p><em>(You cannot also accept a <strong class='shadowed'>Devil's Bargain</strong> to increase your dice pool: It's one or the other.)</em></p>"
          },
          "Bargain": {
            status: RollModStatus.Hidden,
            tooltip: "<p>Accept a <strong class='shadowed red-bright'>Devil's Bargain</strong> from the GM to add <strong class='shadowed'>1 die</strong> to your pool.</p><p><em>(You cannot also <strong class='shadowed'>Push</strong> to increase your dice pool: It's one or the other. You can, however, <strong class='shadowed'>Push</strong> to increase your <strong class='shadowed'>Effect</strong>.)</em></p>"
          },
          "Assist": {
            status: RollModStatus.ForcedOn,
            sideString: "Ollie",
            tooltip: "<p><strong class='shadowed gold-bright'>Ollie</strong> is <strong class='shadowed'>Assisting</strong> your efforts, adding <strong class='shadowed'>1 die</strong> to your pool. <em>(It costs them <strong class='shadowed red-bright'>1 Stress</strong> to do so.)</em></p>"
          },
          "Mastermind": {
            status: RollModStatus.ToggledOff,
            isAbility: true,
            tooltip: "<p>You may expend your <strong>special armor</strong> to protect a teammate, or to <strong>push yourself</strong> when you <strong>gather information</strong> or work on a <strong>long-term project</strong>.</p>"
          },
          "Trust In Me": {
            status: RollModStatus.ToggledOn,
            isAbility: true,
            tooltip: "<p>You may expend your <strong>special armor</strong> to protect a teammate, or to <strong>push yourself</strong> when you <strong>gather information</strong> or work on a <strong>long-term project</strong>.</p>"
          }
        },
        negative: {
          [Harm.Impaired]: {
            status: RollModStatus.ForcedOn,
            tooltip: `<p><strong class='shadowed uppercase red-bright'>${Harm.Impaired}:</strong> Your injuries reduce your <strong class='shadowed'>dice pool</strong> by one.</p>`
          }
        }
      },
      [RollModCategory.position]: {
        positive: {
          Setup: {
            status: RollModStatus.ForcedOn,
            sideString: "Jax",
            tooltip: "<p><strong class='shadowed gold-bright'>Jax</strong> has set you up for success with a preceding action, increasing your <strong class='shadowed'>Position</strong> by one level.</p>"
          }
        },
        negative: {}
      },
      [RollModCategory.effect]: {
        positive: {
          "Push": {
            status: RollModStatus.ToggledOn,
            tooltip: "<p>Take <strong class='shadowed red-bright'>2 Stress</strong> to increase your <strong class='shadowed'>Effect</strong> by one level.</p><p><em>(You can both <strong class='shadowed'>Push for Effect</strong> and <strong class='shadowed'>Push for +1d</strong>, for a total cost of <strong class='shadowed red-bright'>4 Stress</strong>.)</em></p>"
          },
          "Setup": {
            status: RollModStatus.ForcedOn,
            sideString: "High-Flyer",
            tooltip: "<p><strong class='shadowed gold-bright'>High-Flyer</strong> has set you up for success with a preceding action, increasing your <strong class='shadowed'>Effect</strong> by one level.</p>"
          },
          "Potency": {
            status: RollModStatus.Hidden,
            tooltip: "<p>Circumstances in your favor make this action especially <strong class='shadowed'>Potent</strong>, increasing your <strong class='shadowed'>Effect</strong> by one level.</p>"
          },
          "Cloak & Dagger": {
            status: RollModStatus.ToggledOff,
            isAbility: true,
            tooltip: "<p>You may expend your <strong>special armor</strong> to protect a teammate, or to <strong>push yourself</strong> when you <strong>gather information</strong> or work on a <strong>long-term project</strong>.</p>"
          }
        },
        negative: {
          [Harm.Impaired]: {
            status: RollModStatus.ForcedOn,
            tooltip: `<p><strong class='shadowed uppercase red-bright'>${Harm.Impaired}:</strong> Your injuries reduce your <strong class='shadowed'>Effect</strong> by one level.</p>`
          },
          Opposition: {
            status: RollModStatus.ForcedOn,
            tooltip: "<p>The following <strong class='shadowed'>Factors</strong> combine to reduce your <strong class='shadowed'>Effect</strong> by one level:</p><ul><li>Inferior Quality</li><li>Detrimental Scale</li></ul>"
          }
        }
      },
      [RollModCategory.result]: {
        positive: {
          Mastermind: {
            status: RollModStatus.ToggledOff,
            isAbility: true,
            tooltip: "<p>You may expend your <strong>special armor</strong> to protect a teammate, or to <strong>push yourself</strong> when you <strong>gather information</strong> or work on a <strong>long-term project</strong>.</p>"
          }
        }, negative: {}},
      [RollModCategory.after]: {
        positive: {
          Mesmerism: {
            status: RollModStatus.ToggledOff,
            isAbility: true,
            tooltip: "<p>You may expend your <strong>special armor</strong> to protect a teammate, or to <strong>push yourself</strong> when you <strong>gather information</strong> or work on a <strong>long-term project</strong>.</p>"
          }
        },
        negative: {}
      }
    };

    await user.setFlag(C.SYSTEM_ID, "rollCollab", flagUpdateData);
    BladesRollCollabSheet.RenderRollCollab({userID: user._id, rollID: flagUpdateData.rollID});
    socketlib.system.executeForAllGMs("renderRollCollab", {userID: user._id, rollID: flagUpdateData.rollID});
  }

  rollID: string;
  constructor(user: User, rollID: string) {
    super(user);
    this.rollID = rollID;
  }

  get rData(): BladesRollCollab.FlagData|null {
    if (!this.document.getFlag(C.SYSTEM_ID, "rollCollab")) {
      eLog.error("rollCollab", "[get flags()] No RollCollab Flags Found on User", {user: this.document, flags: this.document.flags});
      return null;
    }
    return this.document.flags["eunos-blades"]!.rollCollab;
  }
  get rollSource(): BladesActor|BladesItem|undefined {
    if (!this.rData) { return undefined }
    return this.rData.rollSourceType === "Actor"
      ? game.actors.get(this.rData.rollSourceID)
      : game.items.get(this.rData.rollSourceID);
  }

  override getData() {

    const context = super.getData();

    const {rData} = this;
    if (!rData) { return context }

    const sheetData: Partial<BladesRollCollab.SheetData> = {
      cssClass: "roll-collab",
      editable: this.options.editable,
      isGM: game.eunoblades.Tracker!.system.is_spoofing_player ? false : game.user.isGM,
      ...rData
    };

    if (!this.rollSource) {
      eLog.error("rollCollab", `[getData()] No '${rData.rollSourceType}' Found with ID '${rData.rollSourceID}'`, {user: this.document, rData: rData});
      return null as never;
    }

    sheetData.system = this.rollSource.system;
    sheetData.rollSource = this.rollSource;

    if (BladesActor.IsType(this.rollSource, BladesActorType.pc) && isAction(rData.rollTrait)) {
      const {rollSource} = this;
      sheetData.rollTraitData = {
        name: rData.rollTrait,
        value: rollSource.actions[rData.rollTrait],
        max: rollSource.actions[rData.rollTrait]
      };
      sheetData.rollTraitOptions = Object.values(Action)
        .map((action) => ({
          name: U.uCase(action),
          value: action
        }));
    } else if (BladesActor.IsType(this.rollSource, BladesActorType.pc) && isAttribute(rData.rollTrait)) {
      const {rollSource} = this;
      sheetData.rollTraitData = {
        name: rData.rollTrait,
        value: rollSource.attributes[rData.rollTrait],
        max: rollSource.attributes[rData.rollTrait]
      };
      sheetData.rollTraitOptions = Object.values(Attribute)
        .map((attribute) => ({
          name: U.uCase(attribute),
          value: attribute
        }));
    } else if (rData.rollTrait === "tier") {
      const {rollSource} = this;
      sheetData.rollTraitData = {
        name: "Tier",
        value: rollSource.getTierTotal(),
        max: rollSource.getTierTotal()
      };
      sheetData.rollTraitOptions = false;
    } else if (U.isInt(rData.rollTrait)) {
      sheetData.rollTraitData = {
        name: `+${rData.rollTrait}`,
        value: rData.rollTrait,
        max: rData.rollTrait
      };
      sheetData.rollTraitOptions = [1,2,3,4,5,6,7,8,9,10]
        .map((num) => ({
          name: `+${num}`,
          value: num
        }));
    }

    /* DUMMY DATA FOR DEV PURPOSES */

    sheetData.diceTotal = 4;
    sheetData.rollFactorData = [
      {name: Factor.quality, value: U.romanizeNum(2), cssClasses: "factor-gold factor-main"},
      {name: Factor.scale, value: `${2}`, cssClasses: "factor-gold"}
    ];

    sheetData.rollOpposition = undefined;

    sheetData.rollPositionInitial = Position.desperate;
    sheetData.rollPositionFinal = Position.risky;

    sheetData.rollEffectFinal = Effect.extreme;

    sheetData.isAffectingResult = true;
    sheetData.rollResultFinal = 1;

    sheetData.rollOddsData = [
      {odds: 15, result: "Failure", cssClasses: "odds-fail", tooltip: "<p>A failure!</p>"},
      {odds: 50, result: "Partial", cssClasses: "odds-partial", tooltip: "<p>A partial!</p>"},
      {odds: 30, result: "Success", cssClasses: "odds-success", tooltip: "<p>A success!</p>"},
      {odds: 5, result: "Critical", cssClasses: "odds-critical", tooltip: "<p>A critical!</p>"}
    ];

    sheetData.stressData = {cost: 4, tooltip: "<ul><li><strong class='shadowed'>2</strong> Stress from Pushing for +1d</li><li><strong class='shadowed'>2</strong> Stress from Pushing for Effect</li></ul>"};

    eLog.checkLog3("getData", "RollCollab.getData()", {...context, ...sheetData});

    return {
      ...context,
      ...sheetData
    };
  }

  override activateListeners(html: JQuery<HTMLElement>) {
    super.activateListeners(html);
    ApplyTooltipListeners(html);
  }

  override async _onSubmit(event: Event, {updateData}: FormApplication.OnSubmitOptions = {}) {
    return super._onSubmit(event, {updateData, preventClose: true})
      .then((returnVal) => {this.render(); return returnVal});
  }

  override async close(options: FormApplication.CloseOptions & {rollID?: string} = {}) {
    eLog.checkLog3("rollCollab", "RollCollab.close()", {options});
    if (options.rollID) { return super.close({}) }
    this.document.setFlag(C.SYSTEM_ID, "rollCollab", null);
    socketlib.system.executeForEveryone("closeRollCollab", this.rollID);

    return undefined;
  }

  override render(force?: boolean, options?: Application.RenderOptions<DocumentSheetOptions>) {
    if (!this.document.getFlag(C.SYSTEM_ID, "rollCollab")) { return this }
    return super.render(force, options);
  }
}

interface BladesRollCollabSheet {
  get document(): User
}

export default BladesRollCollabSheet;