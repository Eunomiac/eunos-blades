import U from "./core/utilities.js";
import C, {BladesActorType, BladesItemType, RollType, RollModStatus, RollModCategory, Action, Attribute, Position, Effect, Factor, Harm} from "./core/constants.js";
import BladesActor from "./blades-actor.js";
import BladesItem from "./blades-item.js";
import BladesActiveEffect from "./blades-active-effect.js";
import {ApplyTooltipListeners} from "./core/gsap.js";
import {EffectChangeData} from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/effectChangeData.js";

type EffectData = {
  key: "system.roll_mods",
  mode: 2,
  priority: null,
  value: string
};

const RollCollabEffectChanges: Partial<Record<BladesItemType.ability|BladesItemType.crew_ability|BladesItemType.crew_upgrade,Record<string,EffectData[]>>> = {
  [BladesItemType.ability]: {
    "Battleborn": [
      {
        key: "system.roll_mods",
        mode: 2,
        priority: null,
        value: "name:Battleborn@cat:roll@type:ability@cTypes:Action@cTraits:hunt|finesse|prowl|skirmish|wreck|attune|command@eKey:ForceOff-Bargain|ForceOff-Push|Cost-SpecialArmor@status:Conditional@tooltip:<h1>Battleborn</h1><p>You may expend your <strong class='cyan-bright'>special armor</strong> instead of paying <strong class='red-bright'>2 stress</strong> to <strong>Push</strong> yourself during a fight.</p>"
      },
      {
        key: "system.roll_mods",
        mode: 2,
        priority: null,
        value: "name:Battleborn@cat:effect@type:ability@cTypes:Action@cTraits:hunt|finesse|prowl|skirmish|wreck|attune|command@eKey:ForceOff-Push|Cost-SpecialArmor@status:Conditional@tooltip:<h1>Battleborn</h1><p>You may expend your <strong class='cyan-bright'>special armor</strong> instead of paying <strong class='red-bright'>2 stress</strong> to <strong>Push</strong> yourself during a fight.</p>"
      },
      {
        key: "system.roll_mods",
        mode: 2,
        priority: null,
        value: "name:Battleborn@cat:roll@type:ability@cTypes:Resistance@val:0@eKey:Cost-SpecialArmor|Decrease-Harm1@status:Conditional@tooltip:<h1>Battleborn</h1><p>You may expend your <strong class='cyan-bright'>special armor</strong> to reduce the level of <strong class='red-bright'>harm</strong> you are resisting by one.</p>"
      }
    ],
    "Bodyguard": [
      {
        key: "system.roll_mods",
        mode: 2,
        priority: null,
        value: "name:Bodyguard@cat:roll@type:ability@cTypes:Resistance@status:Conditional@tooltip:<h1>Bodyguard</h1><p>When you <strong class='cyan-bright'>protect</strong> a teammate, take <strong class='gold-bright'>+1d</strong> to your <strong>resistance</strong> roll.</p>"
      },
      {
        key: "system.roll_mods",
        mode: 2,
        priority: null,
        value: "name:Bodyguard@cat:effect@type:ability@cTypes:Engagement@status:Conditional@tooltip:<h1>Bodyguard</h1><p>When you <strong class='cyan-bright'>gather information</strong> to anticipate possible threats in the current situation, you get <strong class='gold-bright'>+1 effect</strong>.</p>"
      }
    ],
    "Ghost Fighter": [
      {
        key: "system.roll_mods",
        mode: 2,
        priority: null,
        value: "name:Ghost Fighter@cat:effect@type:ability@cTypes:Action@cTraits:hunt|finesse|prowl|skirmish|wreck|attune|command@val:0@eKey:ForceOn-Potency@status:Conditional@tooltip:<h1>Ghost Fighter</h1><p>You may <strong class='cyan-bright'>imbue</strong> your hands, melee weapons, or tools with spirit energy, giving you <strong class='gold-bright'>Potency</strong> in combat vs. the supernatural. You may also grapple with spirits to restrain and capture them.</p>"
      }
    ],
    "Leader": [
      {
        key: "system.roll_mods",
        mode: 2,
        priority: null,
        value: "name:Leader@cat:effect@type:ability@cTypes:Action@cTraits:command@eKey:ToGroupCohorts@status:Conditional@tooltip:<h1>Leader</h1><p>Strong leadership grants this cohort <strong class='gold-bright'>+1 effect</strong> during combat.</p>"
      }
    ],
    "Not To Be Trifled With": [
      {
        key: "system.roll_mods",
        mode: 2,
        priority: null,
        value: "name:Not To Be Trifled With@cat:roll@type:ability@cTypes:Action@cTraits:hunt|finesse|prowl|skirmish|wreck|command@val:0@eKey:ForceOn-Push@status:Conditional@tooltip:<h1>Not to Be Trifled With%COLON% Superhuman Feat</h1><p>You can <strong>Push</strong> yourself to perform a feat of physical force that verges on the superhuman <em>(you might break a metal weapon with your bare hands, tackle a galloping horse, lift a huge weight, etc.)</em>. You still gain <strong class='gold-bright'>+1d</strong> to your roll at the cost of <strong class='red-bright'>2 stress</strong>, as normal for a <strong>Push</strong>.</p>"
      },
      {
        key: "system.roll_mods",
        mode: 2,
        priority: null,
        value: "name:Not To Be Trifled With@cat:effect@type:ability@cTypes:Action@cTraits:hunt|finesse|prowl|skirmish|wreck|command@val:0@eKey:ForceOn-Push@status:Conditional@tooltip:<h1>Not to Be Trifled With%COLON% Superhuman Feat</h1><p>You can <strong>Push</strong> yourself to perform a feat of physical force that verges on the superhuman <em>(you might break a metal weapon with your bare hands, tackle a galloping horse, lift a huge weight, etc.)</em>. You still gain <strong class='gold-bright'>+1 effect</strong> at the cost of <strong class='red-bright'>2 stress</strong>, as normal for a <strong>Push</strong>.</p>"
      },
      {
        key: "system.roll_mods",
        mode: 2,
        priority: null,
        value: "name:Not To Be Trifled With@cat:roll@type:ability@cTypes:Action@cTraits:hunt|finesse|prowl|skirmish|wreck|attune|command@val:0@eKey:ForceOn-Push|Negate-ScalePenalty@status:Conditional@tooltip:<h1>Not to Be Trifled With%COLON% Engage Gang</h1><p>You can <strong>Push</strong> yourself to engage a gang of up to six members on equal footing (negating any <strong>Scale</strong> penalties). You still gain <strong class='gold-bright'>+1d</strong> to your roll at the cost of <strong class='red-bright'>2 stress</strong>, as normal for a <strong>Push</strong>.</p>"
      },
      {
        key: "system.roll_mods",
        mode: 2,
        priority: null,
        value: "name:Not To Be Trifled With@cat:effect@type:ability@cTypes:Action@cTraits:hunt|finesse|prowl|skirmish|wreck|attune|command@val:0@eKey:ForceOn-Push|Negate-ScalePenalty@status:Conditional@tooltip:<h1>Not to Be Trifled With%COLON% Engage Gang</h1><p>You can <strong>Push</strong> yourself to engage a gang of up to six members on equal footing (negating any <strong>Scale</strong> penalties). You still gain <strong class='gold-bright'>+1 effect</strong> at the cost of <strong class='red-bright'>2 stress</strong>, as normal for a <strong>Push</strong>.</p>"
      }
    ],
    "Savage": [
      {
        key: "system.roll_mods",
        mode: 2,
        priority: null,
        value: "name:Savage@cat:roll@type:ability@cTypes:Action@cTraits:command@status:Conditional@tooltip:<h1>Savage</h1><p>When you <strong>Command</strong> a fightened target, gain <strong class='gold-bright'>+1d</strong> to your roll.</p>"
      }
    ],
    "Vigorous": [
      {
        key: "system.roll_mods",
        mode: 2,
        priority: null,
        value: "name:Vigorous@cat:roll@type:ability@cTypes:Downtime@aTypes:Incarceration@status:Conditional@tooltip:<h1>Vigorous</h1><p>You gain <strong class='gold-bright'>+1d</strong> to <strong>healing treatment</strong> rolls.</p>"
      }
    ],
    "Sharpshooter": [
      {
        key: "system.roll_mods",
        mode: 2,
        priority: null,
        value: "name:Sharpshooter@cat:roll@type:ability@cTypes:Action@cTraits:hunt|finesse|prowl|skirmish|wreck@val:0@eKey:ForceOn-Push@status:Conditional@tooltip:<h1>Sharpshooter%COLON% Extreme Range</h1><p>You can <strong>Push</strong> yourself to make a ranged attack at extreme distance, one that would otherwise be impossible with the rudimentary firearms of Duskwall. You still gain <strong class='gold-bright'>+1d</strong> to your roll at the cost of <strong class='red-bright'>2 stress</strong>, as normal for a <strong>Push</strong>.</p>"
      },
      {
        key: "system.roll_mods",
        mode: 2,
        priority: null,
        value: "name:Sharpshooter@cat:effect@type:ability@cTypes:Action@cTraits:hunt|finesse|prowl|skirmish|wreck@val:0@eKey:ForceOn-Push@status:Conditional@tooltip:<h1>Sharpshooter%COLON% Extreme Range</h1><p>You can <strong>Push</strong> yourself to make a ranged attack at extreme distance, one that would otherwise be impossible with the rudimentary firearms of Duskwall. You still gain <strong class='gold-bright'>+1 effect</strong> at the cost of <strong class='red-bright'>2 stress</strong>, as normal for a <strong>Push</strong>.</p>"
      },
      {
        key: "system.roll_mods",
        mode: 2,
        priority: null,
        value: "name:Sharpshooter@cat:roll@type:ability@cTypes:Action@cTraits:hunt|finesse|prowl|skirmish|wreck@val:0@eKey:ForceOn-Push@status:Conditional@tooltip:<h1>Sharpshooter%COLON% Suppression Fire</h1><p>You can <strong>Push</strong> yourself to maintain a steady rate of suppression fire during a battle, enough to suppress a small gang of up to six members. <em>(When an enemy is suppressed, they're reluctant to maneuver or attack, usually calling for a <strong>fortune</strong> roll to see if they can manage it.)</em> You still gain <strong class='gold-bright'>+1d</strong> to your roll at the cost of <strong class='red-bright'>2 stress</strong>, as normal for a <strong>Push</strong>.</p>"
      },
      {
        key: "system.roll_mods",
        mode: 2,
        priority: null,
        value: "name:Sharpshooter@cat:effect@type:ability@cTypes:Action@cTraits:hunt|finesse|prowl|skirmish|wreck@val:0@eKey:ForceOn-Push@status:Conditional@tooltip:<h1>Sharpshooter%COLON% Suppression Fire</h1><p>You can <strong>Push</strong> yourself to maintain a steady rate of suppression fire during a battle, enough to suppress a small gang of up to six members. <em>When an enemy is suppressed, they're reluctant to maneuver or attack, usually calling for a <strong>fortune</strong> roll to see if they can manage it.</em> You still gain <strong class='gold-bright'>+1 effect</strong> at the cost of <strong class='red-bright'>2 stress</strong>, as normal for a <strong>Push</strong>.</p>"
      }
    ],
    "Focused": [
      {
        key: "system.roll_mods",
        mode: 2,
        priority: null,
        value: "name:Focused@cat:roll@type:ability@cTypes:Resistance@cTraits:Insight|Resolve@val:0@eKey:Cost-SpecialArmor|Negate-Consequence@status:Conditional@tooltip:<h1>Focused</h1><p>You may expend your <strong class='cyan-bright'>special armor</strong> to completely negate a <strong>consequence</strong> of <strong class='red-bright'>surprise</strong> or <strong class='red-bright'>mental harm</strong>.</p>"
      },
      {
        key: "system.roll_mods",
        mode: 2,
        priority: null,
        value: "name:Focused@cat:roll@type:ability@cTypes:Action@cTraits:hunt|study|survey|finesse|prowl|skirmish|wreck@eKey:ForceOff-Bargain|ForceOff-Push|Cost-SpecialArmor@status:Conditional@tooltip:<h1>Focused</h1><p>You may expend your <strong class='cyan-bright'>special armor</strong> instead of paying <strong class='red-bright'>2 stress</strong> to <strong>Push</strong> yourself for ranged combat or tracking.</p>"
      },
      {
        key: "system.roll_mods",
        mode: 2,
        priority: null,
        value: "name:Focused@cat:effect@type:ability@cTypes:Action@cTraits:hunt|study|survey|finesse|prowl|skirmish|wreck@eKey:ForceOff-Push|Cost-SpecialArmor@status:Conditional@tooltip:<h1>Focused</h1><p>You may expend your <strong class='cyan-bright'>special armor</strong> instead of paying <strong class='red-bright'>2 stress</strong> to <strong>Push</strong> yourself for ranged combat or tracking.</p>"
      }
    ],
    "Ghost Hunter": [
      {
        key: "system.roll_mods",
        mode: 2,
        priority: null,
        value: "name:Ghost Hunter@cat:effect@type:ability@cTypes:Action@cTraits:quality@val:0@eKey:ForceOn-Potency@status:Conditional@tooltip:<h1>Ghost Hunter</h1><p>This cohort is <strong class='cyan-bright'>imbued</strong> with spirit energy, granting it <strong class='gold-bright'>Potency</strong> against the supernatural.</p>"
      }
    ],
    "Your Hunting Pet Is Imbued With Spirit Energy. It Gains Potency When Tracking Or Fighting The Supernatural, And Gains An Arcane Ability: Ghost-Form, Mind-Link, Or Arrow-Swift. Take This Ability Again To Choose An Additional Arcane Ability For Your Pet.": [
      {
        key: "system.roll_mods",
        mode: 2,
        priority: null,
        value: "name:Your Hunting Pet Is Imbued With Spirit Energy. It Gains Potency When Tracking Or Fighting The Supernatural, And Gains An Arcane Ability: Ghost-Form, Mind-Link, Or Arrow-Swift. Take This Ability Again To Choose An Additional Arcane Ability For Your Pet.@cat:effect@type:ability@cTypes:Action@cTraits:quality@val:0@eKey:ForceOn-Potency@status:Conditional@tooltip:<h1>Your Hunting Pet Is Imbued With Spirit Energy. It Gains Potency When Tracking Or Fighting The Supernatural, And Gains An Arcane Ability: Ghost-Form, Mind-Link, Or Arrow-Swift. Take This Ability Again To Choose An Additional Arcane Ability For Your Pet.</h1><p>This cohort is <strong class='cyan-bright'>imbued</strong> with spirit energy, granting it <strong class='gold-bright'>Potency</strong> against the supernatural.</p>"
      }
    ],
    "Your Pet Functions As A Cohort (Expert: Hunter). This Ability Gives Them Potency Against Supernatural Targets And An Arcane Ability Of Your Choice. Ghost-Form Allows The Pet To Transform Into Electroplasmic Vapor As If It Were A Spirit. Mind- Link Allows The Pet And Hunter To Share Their Senses And Thoughts Telepathically. Arrow-Swift Allows The Pet To Move Extremely Quickly, Out-Pacing Any Other Creature Or Vehicle. For More Details About Cohorts, See Page 96.": [
      {
        key: "system.roll_mods",
        mode: 2,
        priority: null,
        value: "name:Your Pet Functions As A Cohort (Expert: Hunter). This Ability Gives Them Potency Against Supernatural Targets And An Arcane Ability Of Your Choice. Ghost-Form Allows The Pet To Transform Into Electroplasmic Vapor As If It Were A Spirit. Mind- Link Allows The Pet And Hunter To Share Their Senses And Thoughts Telepathically. Arrow-Swift Allows The Pet To Move Extremely Quickly, Out-Pacing Any Other Creature Or Vehicle. For More Details About Cohorts, See Page 96.@cat:effect@type:ability@cTypes:Action@cTraits:quality@val:0@eKey:ForceOn-Potency@status:Conditional@tooltip:<h1>Your Pet Functions As A Cohort (Expert: Hunter). This Ability Gives Them Potency Against Supernatural Targets And An Arcane Ability Of Your Choice. Ghost-Form Allows The Pet To Transform Into Electroplasmic Vapor As If It Were A Spirit. Mind- Link Allows The Pet And Hunter To Share Their Senses And Thoughts Telepathically. Arrow-Swift Allows The Pet To Move Extremely Quickly, Out-Pacing Any Other Creature Or Vehicle. For More Details About Cohorts, See Page 96.</h1><p>This cohort is <strong class='cyan-bright'>imbued</strong> with spirit energy, granting it <strong class='gold-bright'>Potency</strong> against the supernatural.</p>"
      }
    ],
    "Scout": [
      {
        key: "system.roll_mods",
        mode: 2,
        priority: null,
        value: "name:Scout@cat:effect@type:ability@cTypes:Action|Downtime|Clock@cTraits:hunt|study|survey|attune|consort|sway@status:Conditional@tooltip:<h1>Scout</h1><p>When you <strong>gather information</strong> to discover the location of a target <em>(a person, a destination, a good ambush spot, etc)</em>, you gain <strong class='gold-bright'>+1 effect</strong>.</p>"
      },
      {
        key: "system.roll_mods",
        mode: 2,
        priority: null,
        value: "name:Scout@cat:roll@type:ability@cTypes:Action@cTraits:hunt|finesse|prowl@status:Conditional@tooltip:<h1>Scout</h1><p>When you hide in a prepared position or use camouflage, you get <strong class='gold-bright'>+1d</strong> to rolls to avoid detection.</p>"
      }
    ],
    "Alchemist": [
      {
        key: "system.roll_mods",
        mode: 2,
        priority: null,
        value: "name:Alchemist@cat:result@type:ability@cTypes:Downtime|GatherInfo|Craft@status:Conditional@tooltip:<h1>Alchemist</h1><p>When you <strong>invent</strong> or <strong>craft</strong> a creation with <em>alchemical</em> features, you gain <strong class='gold-bright'>+1 result level</strong> to your roll.</p>"
      }
    ],
    "Artificer": [
      {
        key: "system.roll_mods",
        mode: 2,
        priority: null,
        value: "name:Artificer@cat:result@type:ability@cTypes:Downtime|GatherInfo|Craft@cTraits:study|tinker@status:Conditional@tooltip:<h1>Artificer</h1><p>When you <strong>invent</strong> or <strong>craft</strong> a creation with <em>spark-craft</em> features, you gain <strong class='gold-bright'>+1 result level</strong> to your roll.</p>"
      }
    ],
    "Fortitude": [
      {
        key: "system.roll_mods",
        mode: 2,
        priority: null,
        value: "name:Fortitude@cat:roll@type:ability@cTypes:Resistance@val:0@eKey:Cost-SpecialArmor|Negate-Consequence@status:Conditional@tooltip:<h1>Fortitude</h1><p>You may expend your <strong class='cyan-bright'>special armor</strong> to completely negate a <strong>consequence</strong> of <strong class='red-bright'>fatigue</strong>, <strong class='red-bright'>weakness</strong>, or <strong class='red-bright'>chemical effects</strong>.</p>"
      },
      {
        key: "system.roll_mods",
        mode: 2,
        priority: null,
        value: "name:Fortitude@cat:roll@type:ability@cTypes:Action@cTraits:study|survey|tinker|finesse|skirmish|wreck@eKey:ForceOff-Bargain|ForceOff-Push|Cost-SpecialArmor@status:Conditional@tooltip:<h1>Fortitude</h1><p>You may expend your <strong class='cyan-bright'>special armor</strong> instead of paying <strong class='red-bright'>2 stress</strong> to <strong>Push</strong> yourself when working with technical skill or handling alchemicals.</p>"
      },
      {
        key: "system.roll_mods",
        mode: 2,
        priority: null,
        value: "name:Fortitude@cat:effect@type:ability@cTypes:Action@cTraits:study|survey|tinker|finesse|skirmish|wreck@eKey:ForceOff-Push|Cost-SpecialArmor@status:Conditional@tooltip:<h1>Fortitude</h1><p>You may expend your <strong class='cyan-bright'>special armor</strong> instead of paying <strong class='red-bright'>2 stress</strong> to <strong>Push</strong> yourself when working with technical skill or handling alchemicals.</p>"
      }
    ],
    "Ghost Ward": [
      {
        key: "system.roll_mods",
        mode: 2,
        priority: null,
        value: "name:Ghost Ward@cat:after@type:ability@cTypes:Action@cTraits:wreck@val:0@status:Conditional@tooltip:<h1>Ghost Ward</h1><p>When you <strong>Wreck</strong> an area with <emarcane</em> substances, ruining it for any other use, it becomes <strong>anathema</strong> or <strong>enticing</strong> to spirits (your choice).</p>"
      }
    ],
    "Physicker": [
      {
        key: "system.roll_mods",
        mode: 2,
        priority: null,
        value: "name:Physicker@cat:roll@type:ability@cTypes:Downtime@aTypes:Incarceration@status:Conditional@tooltip:<h1>Physicker</h1><p>You gain <strong class='gold-bright'>+1d</strong> to your <strong>healing treatment</strong> rolls.</p>"
      }
    ],
    "Saboteur": [
      {
        key: "system.roll_mods",
        mode: 2,
        priority: null,
        value: "name:Saboteur@cat:after@type:ability@cTypes:Action|Downtime|Clock@aTraits:wreck@val:0@status:Conditional@tooltip:<h1>Saboteur</h1><p>When you Wreck, your work is much quieter than it should be and the damage is very well-hidden from casual inspection.</p>"
      }
    ],
    "Venomous": [
      {
        key: "system.roll_mods",
        mode: 2,
        priority: null,
        value: "name:Venomous@cat:roll@type:ability@cTypes:Action@val:0@eKey:ForceOn-Push@status:Conditional@tooltip:<h1>Venomous</h1><p>You can <strong>Push</strong> yourself to secrete your chosen drug or poison through your skin or saliva, or exhale it as a vapor. You still gain <strong class='gold-bright'>+1d</strong> to your roll at the cost of <strong class='red-bright'>2 stress</strong>, as normal for a <strong>Push</strong>.</p>"
      },
      {
        key: "system.roll_mods",
        mode: 2,
        priority: null,
        value: "name:Venomous@cat:effect@type:ability@cTypes:Action@val:0@eKey:ForceOn-Push@status:Conditional@tooltip:<h1>Venomous</h1><p>You can <strong>Push</strong> yourself to secrete your chosen drug or poison through your skin or saliva, or exhale it as a vapor. You still gain <strong class='gold-bright'>+1 effect</strong> at the cost of <strong class='red-bright'>2 stress</strong>, as normal for a <strong>Push</strong>.</p>"
      }
    ],
    "Infiltrator": [
      {
        key: "system.roll_mods",
        mode: 2,
        priority: null,
        value: "name:Infiltrator@cat:effect@type:ability@cTypes:Action|Downtime|Clock@cTraits:tinker|finesse|wreck|attune@val:0@eKey:Negate-QualityPenalty|Negate-TierPenalty@status:Conditional@tooltip:<h1>Infiltrator</h1><p>You are not affected by low <strong class='red-bright'>Quality</strong> or <strong class='red-bright'>Tier</strong> when you bypass security measures.</p>"
      }
    ],
    "Ambush": [
      {
        key: "system.roll_mods",
        mode: 2,
        priority: null,
        value: "name:Ambush@cat:roll@type:ability@cTypes:Action@cTraits:hunt|finesse|prowl|skirmish|wreck|attune@status:Conditional@tooltip:<h1>Ambush</h1><p>When you attack from hiding or spring a trap, you get <strong class='gold-bright'>+1d</strong> to your roll.</p>"
      }
    ],
    "Daredevil": [
      {
        key: "system.roll_mods",
        mode: 2,
        priority: null,
        value: "name:Daredevil@cat:roll@type:ability@cTypes:Action@eKey:AutoRevealOn-Desperate|ForceOn-(Daredevil),after@status:Conditional@tooltip:<h1>Daredevil</h1><p>When you make a <strong class='red-bright'>desperate</strong> <strong>action</strong> roll, you may gain <strong>+1d</strong> to your roll, if you also take <strong class='red-bright'>−1d</strong> to <strong>resistance</strong> rolls against any consequences.</p>"
      },
      {
        key: "system.roll_mods",
        mode: 2,
        priority: null,
        value: "name:Daredevil@cat:roll@type:ability@cTypes:Resistance@status:Conditional@tooltip:<h1 class='red-bright'>Daredevil</h1><p>By choosing to gain <strong>+1d</strong> to your <strong class='red-bright'>desperate</strong> <strong>action</strong> roll, you suffer <strong class='red-bright'>−1d</strong> to <strong>resistance</strong> rolls against the consequences of that action.</p>"
      },
      {
        key: "system.roll_mods",
        mode: 2,
        priority: null,
        value: "name:Daredevil@cat:after@type:ability@val:0@status:Hidden@tooltip:<h1 class='red-bright'>Daredevil</h1><p>You will suffer <strong class='red-bright'>−1d</strong> to <strong>resistance</strong> rolls against any consequences of this <strong>action</strong> roll.</p>"
      }
    ],
    "The Devil's Footsteps": [
      {
        key: "system.roll_mods",
        mode: 2,
        priority: null,
        value: "name:The Devil'S Footsteps@cat:roll@type:ability@val:0@eKey:ForceOn-Push@status:Conditional@tooltip:<h1>The Devil's Footsteps%COLON% Superhuman Feat</h1><p>You can <strong>Push</strong> yourself to perform a feat of physical force that verges on the superhuman <em>(you might climb a sheer surface that lacks good hand-holds, tumble safely out of a three-story fall, leap a shocking distance, etc.)</em>. You still gain <strong class='gold-bright'>+1d</strong> to your roll at the cost of <strong class='red-bright'>2 stress</strong>, as normal for a <strong>Push</strong>.</p>"
      },
      {
        key: "system.roll_mods",
        mode: 2,
        priority: null,
        value: "name:The Devil'S Footsteps@cat:effect@type:ability@val:0@eKey:ForceOn-Push@status:Conditional@tooltip:<h1>The Devil's Footsteps%COLON% Superhuman Feat</h1><p>You can <strong>Push</strong> yourself to perform a feat of physical force that verges on the superhuman <em>(you might climb a sheer surface that lacks good hand-holds, tumble safely out of a three-story fall, leap a shocking distance, etc.)</em>. You still gain <strong class='gold-bright'>+1 effect</strong> at the cost of <strong class='red-bright'>2 stress</strong>, as normal for a <strong>Push</strong>.</p>"
      },
      {
        key: "system.roll_mods",
        mode: 2,
        priority: null,
        value: "name:The Devil'S Footsteps@cat:roll@type:ability@val:0@eKey:ForceOn-Push@status:Conditional@tooltip:<h1>The Devil's Footsteps%COLON% Sow Confusion</h1><p>You can <strong>Push</strong> yourself to maneuver to confuse your enemies so they mistakenly attack each other. <em>(They attack each other for a moment before they realize their mistake. The GM might make a <strong>fortune</strong> roll to see how badly they harm or interfere with each other.)</em>. You still gain <strong class='gold-bright'>+1d</strong> to your roll at the cost of <strong class='red-bright'>2 stress</strong>, as normal for a <strong>Push</strong>.</p>"
      },
      {
        key: "system.roll_mods",
        mode: 2,
        priority: null,
        value: "name:The Devil'S Footsteps@cat:effect@type:ability@val:0@eKey:ForceOn-Push@status:Conditional@tooltip:<h1>The Devil's Footsteps%COLON% Sow Confusion</h1><p>You can <strong>Push</strong> yourself to maneuver to confuse your enemies so they mistakenly attack each other. <em>(They attack each other for a moment before they realize their mistake. The GM might make a <strong>fortune</strong> roll to see how badly they harm or interfere with each other.)</em>. You still gain <strong class='gold-bright'>+1 effect</strong> at the cost of <strong class='red-bright'>2 stress</strong>, as normal for a <strong>Push</strong>.</p>"
      }
    ],
    "Shadow": [
      {
        key: "system.roll_mods",
        mode: 2,
        priority: null,
        value: "name:Shadow@cat:roll@type:ability@cTypes:Action@cTraits:hunt|study|survey|tinker|finesse|prowl|skirmish|wreck@eKey:ForceOff-Bargain|ForceOff-Push|Cost-SpecialArmor@status:Conditional@tooltip:<h1>Shadow</h1><p>You may expend your <strong class='cyan-bright'>special armor</strong> instead of paying <strong class='red-bright'>2 stress</strong> to <strong>Push</strong> yourself for a feat of athletics or stealth.</p>"
      },
      {
        key: "system.roll_mods",
        mode: 2,
        priority: null,
        value: "name:Shadow@cat:effect@type:ability@cTypes:Action@cTraits:hunt|study|survey|tinker|finesse|prowl|skirmish|wreck@eKey:ForceOff-Push|Cost-SpecialArmor@status:Conditional@tooltip:<h1>Shadow</h1><p>You may expend your <strong class='cyan-bright'>special armor</strong> instead of paying <strong class='red-bright'>2 stress</strong> to <strong>Push</strong> yourself for a feat of athletics or stealth.</p>"
      },
      {
        key: "system.roll_mods",
        mode: 2,
        priority: null,
        value: "name:Shadow@cat:roll@type:ability@cTypes:Resistance@val:0@eKey:Cost-SpecialArmor|Decrease-Harm1@status:Conditional@tooltip:<h1>Shadow</h1><p>You may expend your <strong class='cyan-bright'>special armor</strong> to completely negate a <strong>consequence</strong> of <strong class='red-bright'>detection</strong> or <strong class='red-bright'>security measures</strong>.</p>"
      }
    ],
    "Rook's Gambit": [
      {
        key: "system.roll_mods",
        mode: 2,
        priority: null,
        value: "name:Rook'S Gambit@cat:roll@type:ability@cTypes:Action|Downtime|GatherInfo|Craft|Acquire|Clock@val:0@eKey:ForceOn-BestAction|Cost-Stress2@status:Conditional@tooltip:<h1>Rook'S Gambit</h1><p>Take <strong class='red-bright'>2 stress</strong> to roll your best action rating while performing a different action. <em>(Describe how you adapt your skill to this use.)</em></p>"
      }
    ],
    "Cloak & Dagger": [
      {
        key: "system.roll_mods",
        mode: 2,
        priority: null,
        value: "name:Cloak & Dagger@cat:roll@type:ability@cTypes:Action|Resistance@cTraits:finesse|prowl|attune|command|consort|sway|Insight@status:Conditional@tooltip:<h1>Cloak & Dagger</h1><p>When you use a disguise or other form of covert misdirection, you get <strong class='gold-bright'>+1d</strong> to rolls to confuse or deflect suspicion.</p>"
      }
    ],
    "Ghost Voice": [
      {
        key: "system.roll_mods",
        mode: 2,
        priority: null,
        value: "name:Ghost Voice@cat:effect@type:ability@cTypes:Action|Downtime|Clock@cTraits:attune|command|consort|sway@val:0@eKey:ForceOn-Potency@status:Conditional@tooltip:<h1>Ghost Voice</h1><p>You gain <strong class='gold-bright'>Potency</strong> when communicating with the supernatural.</p>"
      }
    ],
    "Mesmerism": [
      {
        key: "system.roll_mods",
        mode: 2,
        priority: null,
        value: "name:Mesmerism@cat:after@type:ability@cTypes:Action@cTraits:sway@val:0@status:Conditional@tooltip:<h1>Mesmerism</h1><p>When you <strong>Sway</strong> someone, you may cause them to forget that it's happened until they next interact with you.</p>"
      }
    ],
    "Subterfuge": [
      {
        key: "system.roll_mods",
        mode: 2,
        priority: null,
        value: "name:Subterfuge@cat:roll@type:ability@cTypes:Resistance@cTraits:Insight@val:0@eKey:Cost-SpecialArmor|Negate-Consequence@status:Conditional@tooltip:<h1>Subterfuge</h1><p>You may expend your <strong class='cyan-bright'>special armor</strong> to completely negate a <strong>consequence</strong> of <strong class='red-bright'>suspicion</strong> or <strong class='red-bright'>persuasion</strong>.</p>"
      },
      {
        key: "system.roll_mods",
        mode: 2,
        priority: null,
        value: "name:Subterfuge@cat:roll@type:ability@cTypes:Action@cTraits:finesse|attune|consort|sway@eKey:ForceOff-Push|Cost-SpecialArmor@status:Conditional@tooltip:<h1>Subterfuge</h1><p>You may expend your <strong class='cyan-bright'>special armor</strong> instead of paying <strong class='red-bright'>2 stress</strong> to <strong>Push</strong> yourself for subterfuge.</p>"
      },
      {
        key: "system.roll_mods",
        mode: 2,
        priority: null,
        value: "name:Subterfuge@cat:effect@type:ability@cTypes:Action@cTraits:finesse|attune|consort|sway@eKey:ForceOff-Bargain|ForceOff-Push|Cost-SpecialArmor@status:Conditional@tooltip:<h1>Subterfuge</h1><p>You may expend your <strong class='cyan-bright'>special armor</strong> instead of paying <strong class='red-bright'>2 stress</strong> to <strong>Push</strong> yourself for subterfuge.</p>"
      }
    ],
    "Trust In Me": [
      {
        key: "system.roll_mods",
        mode: 2,
        priority: null,
        value: "name:Trust In Me@cat:roll@type:ability@cTypes:Action|Downtime|Clock@cTraits:hunt|study|survey|tinker|finesse|prowl|skirmish|wreck|attune|command|consort|sway|Insight|Prowess|Resolve|tier|quality|magnitude|number@status:Conditional@tooltip:<h1>Trust In Me</h1><p>You gain <strong class='gold-bright'>+1d</strong> to rolls opposed by a target with whom you have an intimate relationship.</p>"
      }
    ],
    "Connected": [
      {
        key: "system.roll_mods",
        mode: 2,
        priority: null,
        value: "name:Connected@cat:result@type:ability@cTypes:Downtime@aTypes:Heat|Acquire@status:Conditional@tooltip:<h1>Connected</h1><p>When you <strong>acquire an asset</strong> or <strong>reduce heat</strong>, you get <strong class='gold-bright'>+1 result level</strong>.</p>"
      }
    ],
    "Jail Bird": [
      {
        key: "system.roll_mods",
        mode: 2,
        priority: null,
        value: "name:Jail Bird@cat:effect@type:ability@cTypes:Downtime@eKey:Increase-Tier1@status:Conditional@tooltip:<h1>Jail Bird</h1><p>You gain <strong class='gold-bright'>+1 Tier</strong> while <strong>incarcerated</strong>.</p>"
      }
    ],
    "Mastermind": [
      {
        key: "system.roll_mods",
        mode: 2,
        priority: null,
        value: "name:Mastermind@cat:roll@type:ability@cTypes:Action|Downtime@aTypes:GatherInfo|Craft|Clock@eKey:ForceOff-Push|Cost-SpecialArmor@status:Conditional@tooltip:<h1>Mastermind</h1><p>You may expend your <strong class='cyan-bright'>special armor</strong> instead of paying <strong class='red-bright'>2 stress</strong> to <strong>Push</strong> yourself when you <strong>gather information</strong> or work on a <strong>long-term project</strong>.</p>"
      },
      {
        key: "system.roll_mods",
        mode: 2,
        priority: null,
        value: "name:Mastermind@cat:effect@type:ability@cTypes:Action|Downtime@eKey:ForceOff-Bargain|ForceOff-Push|Cost-SpecialArmor@status:Conditional@tooltip:<h1>Mastermind</h1><p>You may expend your <strong class='cyan-bright'>special armor</strong> instead of paying <strong class='red-bright'>2 stress</strong> to <strong>Push</strong> yourself when you <strong>gather information</strong> or work on a <strong>long-term project</strong>.</p>"
      }
    ],
    "Weaving The Web": [
      {
        key: "system.roll_mods",
        mode: 2,
        priority: null,
        value: "name:Weaving The Web@cat:roll@type:ability@cTypes:Action|Downtime|Clock@cTraits:consort@status:Conditional@tooltip:<h1>Weaving The Web</h1><p>You gain <strong class='gold-bright'>+1d</strong> to <strong>Consort</strong> when you <strong>gather information</strong> on a target for a <strong>score</strong>.</p>"
      },
      {
        key: "system.roll_mods",
        mode: 2,
        priority: null,
        value: "name:Weaving The Web@cat:roll@type:ability@cTypes:Healing@status:Conditional@tooltip:<h1>Weaving The Web</h1><p>You gain <strong class='gold-bright'>+1d</strong> to the <strong>engagement roll</strong> for the targeted <strong>score</strong>.</p>"
      }
    ],
    "Ghost Mind": [
      {
        key: "system.roll_mods",
        mode: 2,
        priority: null,
        value: "name:Ghost Mind@cat:roll@type:ability@cTypes:Action|Downtime|Clock@cTraits:hunt|study|survey|tinker|prowl|attune|command|consort|sway@status:Conditional@tooltip:<h1>Ghost Mind</h1><p>You gain <strong class='gold-bright'>+1d</strong> to rolls to <strong>gather information</strong> about the supernatural by any means.</p>"
      }
    ],
    "Iron Will": [
      {
        key: "system.roll_mods",
        mode: 2,
        priority: null,
        value: "name:Iron Will@cat:roll@type:ability@cTypes:Resistance@aTraits:Resolve@status:Conditional@tooltip:<h1>Iron Will</h1><p>You gain <strong class='gold-bright'>+1d</strong> to <strong>Resolve resistance</strong> rolls.</p>"
      }
    ],
    "Occultist": [
      {
        key: "system.roll_mods",
        mode: 2,
        priority: null,
        value: "name:Occultist@cat:roll@type:ability@cTypes:Action|Downtime|Clock@cTraits:command@status:Conditional@tooltip:<h1>Occultist</h1><p>You gain <strong class='gold-bright'>+1d</strong> to rolls to <strong>Command</strong> cultists following ancient powers, forgotten gods or demons with whom you have previously <strong>Consort</strong>ed</p>"
      }
    ],
    "Strange Methods": [
      {
        key: "system.roll_mods",
        mode: 2,
        priority: null,
        value: "name:Strange Methods@cat:result@type:ability@cTypes:Downtime|GatherInfo|Craft@status:Conditional@tooltip:<h1>Strange Methods</h1><p>When you <strong>invent</strong> or <strong>craft</strong> a creation with <em>arcane</em> features, you gain <strong class='gold-bright'>+1 result level</strong> to your roll.</p>"
      }
    ],
    "Tempest": [
      {
        key: "system.roll_mods",
        mode: 2,
        priority: null,
        value: "name:Tempest@cat:roll@type:ability@cTypes:Action@val:0@eKey:ForceOn-Push@status:Conditional@tooltip:<h1>Tempest%COLON% Unleash Lightning</h1><p>You can <strong>Push</strong> yourself to unleash a stroke of lightning as a weapon. The GM will describe its <strong>effect level</strong> and significant collateral damage. If you unleash it in combat against an enemy who's threatening you, you'll still make an <strong>action</strong> roll in the fight (usually with <strong>Attune</strong>). You still gain <strong class='gold-bright'>+1d</strong> to your roll at the cost of <strong class='red-bright'>2 stress</strong>, as normal for a <strong>Push</strong>.</p>"
      },
      {
        key: "system.roll_mods",
        mode: 2,
        priority: null,
        value: "name:Tempest@cat:effect@type:ability@cTypes:Action@val:0@eKey:ForceOn-Push@status:Conditional@tooltip:<h1>Tempest%COLON% Unleash Lightning</h1><p>You can <strong>Push</strong> yourself to unleash a stroke of lightning as a weapon. The GM will describe its <strong>effect level</strong> and significant collateral damage. If you unleash it in combat against an enemy who's threatening you, you'll still make an <strong>action</strong> roll in the fight (usually with <strong>Attune</strong>). You still gain <strong class='gold-bright'>+1 effect</strong> at the cost of <strong class='red-bright'>2 stress</strong>, as normal for a <strong>Push</strong>.</p>"
      },
      {
        key: "system.roll_mods",
        mode: 2,
        priority: null,
        value: "name:Tempest@cat:roll@type:ability@cTypes:Action@val:0@eKey:ForceOn-Push@status:Conditional@tooltip:<h1>Tempest%COLON% Call Storm</h1><p>You can <strong>Push</strong> yourself to summon a storm in your immediate vicinity <em>(torrential rain, roaring winds, heavy fog, chilling frost and snow, etc.)</em>. The GM will describe its <strong>effect level</strong>. If you're using this power as cover or distraction, it's probably a <strong>Setup teamwork</strong> maneuver, using <strong>Attune</strong>. You still gain <strong class='gold-bright'>+1d</strong> to your roll at the cost of <strong class='red-bright'>2 stress</strong>, as normal for a <strong>Push</strong>.</p>"
      },
      {
        key: "system.roll_mods",
        mode: 2,
        priority: null,
        value: "name:Tempest@cat:effect@type:ability@cTypes:Action@val:0@eKey:ForceOn-Push@status:Conditional@tooltip:<h1>Tempest%COLON% Call Storm</h1><p>You can <strong>Push</strong> yourself to summon a storm in your immediate vicinity <em>(torrential rain, roaring winds, heavy fog, chilling frost and snow, etc.)</em>. The GM will describe its <strong>effect level</strong>. If you're using this power as cover or distraction, it's probably a <strong>Setup teamwork</strong> maneuver, using <strong>Attune</strong>. You still gain <strong class='gold-bright'>+1 effect</strong> at the cost of <strong class='red-bright'>2 stress</strong>, as normal for a <strong>Push</strong>.</p>"
      }
    ],
    "Warded": [
      {
        key: "system.roll_mods",
        mode: 2,
        priority: null,
        value: "name:Warded@cat:roll@type:ability@cTypes:Resistance@val:0@eKey:Cost-SpecialArmor|Negate-Consequence@status:Conditional@tooltip:<h1>Warded</h1><p>You may expend your <strong class='cyan-bright'>special armor</strong> to completely negate a <strong>consequence</strong> of <strong class='red-bright'>supernatural</strong> origin.</p>"
      },
      {
        key: "system.roll_mods",
        mode: 2,
        priority: null,
        value: "name:Warded@cat:roll@type:ability@cTypes:Action@eKey:ForceOff-Push|Cost-SpecialArmor@status:Conditional@tooltip:<h1>Warded</h1><p>You may expend your <strong class='cyan-bright'>special armor</strong> instead of paying <strong class='red-bright'>2 stress</strong> to <strong>Push</strong> yourself when you contend with or employ <em>arcane</em> forces.</p>"
      },
      {
        key: "system.roll_mods",
        mode: 2,
        priority: null,
        value: "name:Warded@cat:effect@type:ability@cTypes:Action@eKey:ForceOff-Bargain|ForceOff-Push|Cost-SpecialArmor@status:Conditional@tooltip:<h1>Warded</h1><p>You may expend your <strong class='cyan-bright'>special armor</strong> instead of paying <strong class='red-bright'>2 stress</strong> to <strong>Push</strong> yourself when you contend with or employ <em>arcane</em> forces.</p>"
      }
    ]
  },
  [BladesItemType.crew_ability]: {
    "Predators": [
      {
        key: "system.roll_mods",
        mode: 2,
        priority: null,
        value: "name:Predators@cat:roll@type:crew_ability@cTypes:Healing@status:Conditional@tooltip:<h1>Predators</h1><p>When you use a <strong><em>stealth</em></strong> or <strong><em>deception</em> plan</strong> to commit murder, take <strong class='gold-bright'>+1d</strong> to the <strong>engagement</strong> roll.</p>"
      }
    ],
    "Vipers": [
      {
        key: "system.roll_mods",
        mode: 2,
        priority: null,
        value: "name:Vipers@cat:result@type:crew_ability@cTypes:GatherInfo|Craft|Acquire@status:Conditional@tooltip:<h1>Vipers</h1><p>When you <strong>acquire</strong> or <strong>craft</strong> poisons, you get <strong class='gold-bright'>+1 result level</strong> to your roll.</p>"
      }
    ],
    "Blood Brothers": [
      {
        key: "system.roll_mods",
        mode: 2,
        priority: null,
        value: "name:Blood Brothers@cat:roll@type:crew_ability@cTypes:Action@cTraits:hunt|finesse|prowl|skirmish|wreck|attune|command@status:Conditional@tooltip:<h1>Blood Brothers</h1><p>Gain <strong class='gold-bright'>+1d</strong> for <strong>assist</strong>, <strong>setup</strong> and <strong>group teamwork actions</strong>.</p>"
      }
    ],
    "Door Kickers": [
      {
        key: "system.roll_mods",
        mode: 2,
        priority: null,
        value: "name:Door Kickers@cat:roll@type:crew_ability@cTypes:Healing@status:Conditional@tooltip:<h1>Door Kickers</h1><p>When you use an <strong><em>assault</em> plan</strong>, take <strong class='gold-bright'>+1d</strong> to the <strong>engagement</strong> roll.</p>"
      }
    ],
    "Forged In The Fire": [
      {
        key: "system.roll_mods",
        mode: 2,
        priority: null,
        value: "name:Forged In The Fire@cat:roll@type:crew_ability@aTypes:Resistance@status:Conditional@tooltip:<h1>Forged In The Fire</h1><p>Gain <strong class='gold-bright'>+1d</strong> to <strong>resistance</strong> rolls.</p>"
      }
    ],
    "Anointed": [
      {
        key: "system.roll_mods",
        mode: 2,
        priority: null,
        value: "name:Anointed@cat:roll@type:crew_ability@cTypes:Resistance@status:Conditional@tooltip:<h1>Anointed</h1><p>Gain <strong class='gold-bright'>+1d</strong> to <strong>resistance</strong> rolls against supernatural threats.</p>"
      },
      {
        key: "system.roll_mods",
        mode: 2,
        priority: null,
        value: "name:Anointed@cat:roll@type:crew_ability@cTypes:Heat@status:Conditional@tooltip:<h1>Anointed</h1><p>Gain <strong class='gold-bright'>+1d</strong> to <strong>healing treatment</strong> rolls when you have supernatural <strong class='red-bright'>harm</strong>.</p>"
      }
    ],
    "Conviction": [
      {
        key: "system.roll_mods",
        mode: 2,
        priority: null,
        value: "name:Conviction@cat:roll@type:crew_ability@cTypes:Action@status:Conditional@tooltip:<h1>Conviction</h1><p>You may call upon your deity to <strong>assist</strong> any one <strong>action</strong> roll you make. You cannot use this ability again until you indulge your <strong><em>Worship</em></strong> vice.</p>"
      }
    ],
    "Zealotry": [
      {
        key: "system.roll_mods",
        mode: 2,
        priority: null,
        value: "name:Zealotry@cat:roll@type:crew_ability@cTypes:Action|Downtime@status:Conditional@tooltip:<h1>Zealotry</h1><p>Gain <strong class='gold-bright'>+1d</strong> when acting against enemies of the faith.</p>"
      }
    ],
    "The Good Stuff": [
      {
        key: "system.roll_mods",
        mode: 2,
        priority: null,
        value: "name:The Good Stuff@cat:effect@type:crew_ability@cTypes:Action|Downtime@val:0@eKey:Increase-Quality2@status:Conditional@tooltip:<h1>The Good Stuff</h1><p>The quality of your product is equal to your <strong>Tier</strong> <strong class='gold-bright'>+2</strong>.</p>"
      }
    ],
    "High Society": [
      {
        key: "system.roll_mods",
        mode: 2,
        priority: null,
        value: "name:High Society@cat:roll@type:crew_ability@cTypes:Engagement@status:Conditional@tooltip:<h1>High Society</h1><p>Gain <strong class='gold-bright'>+1d</strong> to <strong>gather information</strong> about the city's elite.</p>"
      }
    ],
    "Pack Rats": [
      {
        key: "system.roll_mods",
        mode: 2,
        priority: null,
        value: "name:Pack Rats@cat:roll@type:crew_ability@aTypes:Acquire@status:Conditional@tooltip:<h1>Pack Rats</h1><p>Gain <strong class='gold-bright'>+1d</strong> to <strong>acquire an asset</strong>.</p>"
      }
    ],
    "Second Story": [
      {
        key: "system.roll_mods",
        mode: 2,
        priority: null,
        value: "name:Second Story@cat:roll@type:crew_ability@cTypes:Healing@status:Conditional@tooltip:<h1>Second Story</h1><p>When you execute a <strong>clandestine infiltration plan</strong>, gain <strong class='gold-bright'>+1d</strong> to the <strong>engagement</strong> roll.</p>"
      }
    ],
    "Slippery": [
      {
        key: "system.roll_mods",
        mode: 2,
        priority: null,
        value: "name:Slippery@cat:roll@type:crew_ability@aTypes:Heat@status:Conditional@tooltip:<h1>Slippery</h1><p>Gain <strong class='gold-bright'>+1d</strong> to <strong>reduce heat</strong> rolls.</p>"
      }
    ],
    "Synchronized": [
      {
        key: "system.roll_mods",
        mode: 2,
        priority: null,
        value: "name:Synchronized@cat:after@type:crew_ability@cTypes:Action@status:Conditional@tooltip:<h1>Synchronized</h1><p>When you perform a <strong>group teamwork action</strong>, you may count multiple 6s from different rolls as a <strong class='gold-bright'>critical success</strong>.</p>"
      }
    ],
    "Just Passing Through": [
      {
        key: "system.roll_mods",
        mode: 2,
        priority: null,
        value: "name:Just Passing Through@cat:roll@type:crew_ability@cTypes:Action|Downtime@cTraits:finesse|prowl|consort|sway@status:Conditional@tooltip:<h1>Just Passing Through</h1><p>When your <strong class='red-bright'>heat</strong> is <strong>4 or less</strong>, gain <strong class='gold-bright'>+1d</strong> to rolls to deceive people when you pass yourself off as ordinary citizens.</p>"
      }
    ],
    "Reavers": [
      {
        key: "system.roll_mods",
        mode: 2,
        priority: null,
        value: "name:Reavers@cat:effect@type:crew_ability@cTypes:Action@cTraits:hunt|finesse|prowl|skirmish|wreck@status:Conditional@tooltip:<h1>Reavers</h1><p>When you go into conflict aboard a <strong class='cyan-bright'>vehicle</strong>, gain <strong class='gold-bright'>+1 effect</strong> for vehicle damage and speed.</p>"
      }
    ]
  }
};

RollCollabEffectChanges[BladesItemType.crew_upgrade] = {
  "Ironhook Contacts": [
    {
      key: "system.roll_mods",
      mode: 2,
      priority: null,
      value: "name:Ironhook Contacts@cat:roll@type:ability@cTypes:Downtime@eKey:Increase-Tier1@status:Conditional@tooltip:<h1>Ironhook Contacts</h1><p>Gain G>+1 Tier< while in prison, including the >incarceration< roll.</p>"
    }
  ]
};

export const ApplyRollEffects = async () => {
  Object.entries(RollCollabEffectChanges[BladesItemType.ability]!)
    .forEach(async ([aName, eData]) => {
      // Get ability doc
      const abilityDoc = game.items.getName(aName);
      if (!abilityDoc) {
        eLog.error("applyRollEffects", `ApplyRollEffects: Ability ${aName} Not Found.`);
        return;
      }
      // Check eData for tooltips: If not there, create one from ability rules
      eData = eData.map((cData) => {
        if (/tooltip:/.test(cData.value)) { return cData }
        let effectName = ((cData.value.match(/name:(.*?)@/) ?? [])[1] ?? aName).replace(/[()]/g, "");
        if (effectName !== aName) {
          effectName = `${aName} - ${effectName}`;
        }
        cData.value += `@tooltip:<h1>${effectName}</h1>${abilityDoc.system.rules}`;
        return cData;
      });
      await Promise.all(abilityDoc.effects
        .filter((effect) => /Test$/.test(effect.name ?? ""))
        .map(async (effect) => effect.delete()));
      const abilityEffects = Array.from(abilityDoc.effects ?? []);
      if (abilityEffects.length > 1) {
        eLog.error("applyRollEffects", `ApplyRollEffects: Ability ${aName} Has Multiple Active Effects`);
        return;
      }
      const effectData: {
        name: string,
        icon: string,
        changes: Array<Partial<EffectChangeData>>
      } = {
        name: aName,
        icon: abilityDoc.img ?? "",
        changes: eData
      };
      if (abilityEffects.length === 1) {
        const abilityEffect = abilityEffects[0] as BladesActiveEffect;
        effectData.name = abilityEffect.name ?? effectData.name;
        effectData.icon = abilityEffect.icon ?? effectData.icon;
        effectData.changes.unshift(...abilityEffect.changes.filter((change) => change.key !== "system.roll_mods"));
        await abilityEffect.delete();
      }
      // effectData.name = `${effectData.name} Test`;
      await abilityDoc.createEmbeddedDocuments("ActiveEffect", [effectData]);
    });
};

function isAction(trait: unknown): trait is BladesRollCollab.RollTrait & Action {
  return Boolean(trait && typeof trait === "string" && U.lCase(trait) in Action);
}
function isAttribute(trait: unknown): trait is BladesRollCollab.RollTrait & Attribute {
  return Boolean(trait && typeof trait === "string" && U.lCase(trait) in Attribute);
}
function isFactor(trait: unknown): trait is BladesRollCollab.RollTrait & Factor {
  return Boolean(trait && typeof trait === "string" && U.lCase(trait) in Factor);
}
function isNumber(trait: string | number): trait is BladesRollCollab.RollTrait & number { return U.isInt(trait) }

class BladesRollCollab extends DocumentSheet {

  static override get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["eunos-blades", "sheet", "roll-collab"],
      template: `systems/eunos-blades/templates/roll/roll-collab${game.user.isGM ? "-gm" : ""}.hbs`,
      submitOnChange: true,
      width: 500
      // height: 500
    });
  }

  // #region STATIC METHODS: INITIALIZATION & DEFAULTS ~
  static Initialize() {
    Hooks.on("preUpdateUser", async (user: User, updateData: Record<string,any>) => {
      const flatData = flattenObject(updateData);
      const docSelectKeys = Object.keys(flatData)
        .filter((key) => /docSelections/.test(key) && flatData[key] !== false);
      if (docSelectKeys.length > 0) {
        docSelectKeys.forEach((key) => {
          const [_, category, name] = key.match(/docSelections\.(.*?)\.(.*)/) as [never, RollModCategory, string];
          const rollMods = ((user.getFlag("eunos-blades", "rollCollab.rollMods") ?? []) as BladesRollCollab.RollModData[]);
          const rollMod = U.pullElement(rollMods, (mod: BladesRollCollab.RollModData|undefined) => mod?.name === name && mod?.category === category);
          if (!rollMod || !rollMod.tooltip) { return }
          const curSidestring = rollMod.sideString;
          const newSidestring = (BladesActor.Get(flatData[key]) ?? BladesItem.Get(flatData[key]) ?? {name: ""}).name;
          if (newSidestring === null) { return }
          // if (curSidestring === newSidestring) { return }
          rollMod.tooltip = rollMod.tooltip.replace(new RegExp(curSidestring || "%DOC_NAME%", "g"), newSidestring);
          rollMod.sideString = newSidestring;
          rollMods.push(rollMod);
          user.setFlag("eunos-blades", "rollCollab.rollMods", rollMods);
        });
      }

    });
    return loadTemplates([
      "systems/eunos-blades/templates/roll/roll-collab.hbs",
      "systems/eunos-blades/templates/roll/roll-collab-gm.hbs",
      "systems/eunos-blades/templates/roll/partials/roll-collab-gm-number-line.hbs",
      "systems/eunos-blades/templates/roll/partials/roll-collab-gm-select-doc.hbs",
      "systems/eunos-blades/templates/roll/partials/roll-collab-action.hbs",
      "systems/eunos-blades/templates/roll/partials/roll-collab-action-gm.hbs",
      "systems/eunos-blades/templates/roll/partials/roll-collab-resistance.hbs",
      "systems/eunos-blades/templates/roll/partials/roll-collab-resistance-gm.hbs",
      "systems/eunos-blades/templates/roll/partials/roll-collab-downtime.hbs",
      "systems/eunos-blades/templates/roll/partials/roll-collab-downtime-gm.hbs",
      "systems/eunos-blades/templates/roll/partials/roll-collab-fortune.hbs",
      "systems/eunos-blades/templates/roll/partials/roll-collab-fortune-gm.hbs",
      "systems/eunos-blades/templates/roll/partials/roll-collab-incarceration.hbs",
      "systems/eunos-blades/templates/roll/partials/roll-collab-incarceration-gm.hbs"
    ]);
  }
  static InitSockets() {
    socketlib.system.register("renderRollCollab", BladesRollCollab.RenderRollCollab);
    socketlib.system.register("closeRollCollab", BladesRollCollab.CloseRollCollab);
  }
  static get DefaultRollMods(): BladesRollCollab.RollModData[] {
    return [
      {
        name: "Push",
        category: RollModCategory.roll,
        base_status: RollModStatus.ToggledOff,
        posNeg: "positive",
        modType: "general",
        value: 1,
        stressCost: 2,
        effectKey: ["ToggleOff-Bargain"],
        tooltip: "<h1>Push for +1d</h1><p>For <strong class='red-bright'>2 Stress</strong>, add <strong class='gold-bright'>1 die</strong> to your pool.</p><p><em>(You <strong>cannot</strong> also accept a <strong class='red-bright'>Devil's Bargain</strong> to increase your dice pool: It's one or the other.)</em></p>"
      },
      {
        name: "Bargain",
        category: RollModCategory.roll,
        base_status: RollModStatus.Hidden,
        posNeg: "positive",
        modType: "general",
        value: 1,
        effectKey: ["ToggleOff-Push"],
        tooltip: "<h1 class='red-bright'>Devil's Bargain</h1><p>The GM has offered you a <strong class='red-bright'>Devil's Bargain</strong>.</p><p><strong class='red-bright'>Accept the terms</strong> to add <strong class='gold-bright'>1 die</strong> to your pool.</p><p><em>(You <strong>cannot</strong> also <strong>Push for +1d</strong> to increase your dice pool: It's one or the other.)</em></p>"
      },
      {
        name: "Assist",
        category: RollModCategory.roll,
        base_status: RollModStatus.Hidden,
        posNeg: "positive",
        effectKey: ["DocSelect-roll.Assist"],
        modType: "teamwork",
        value: 1,
        sideString: "",
        tooltip: "<h1 class='gold-bright'>%DOC_NAME% Assists</h1><p><strong class='gold-bright'>%DOC_NAME%</strong> is <strong>Assisting</strong> your efforts, adding <strong class='gold-bright'>1 die</strong> to your pool.</p>"
      },
      {
        name: "Setup",
        category: RollModCategory.position,
        base_status: RollModStatus.Hidden,
        posNeg: "positive",
        effectKey: ["DocSelect-position.Setup"],
        modType: "teamwork",
        value: 1,
        sideString: "",
        tooltip: "<h1 class='gold-bright'>%DOC_NAME% Sets You Up</h1><p><strong class='gold-bright'>%DOC_NAME%</strong> has set you up for success with a preceding <strong>Setup</strong> action, increasing your <strong class='gold-bright'>Position</strong> by one level.</p>"
      },
      {
        name: "Push",
        category: RollModCategory.effect,
        base_status: RollModStatus.ToggledOff,
        posNeg: "positive",
        modType: "general",
        stressCost: 2,
        value: 1,
        tooltip: "<h1>Push for Effect</h1><p>For <strong class='red-bright'>2 Stress</strong>, increase your <strong class='gold-bright'>Effect</strong> by one level.</p>"
      },
      {
        name: "Setup",
        category: RollModCategory.effect,
        base_status: RollModStatus.Hidden,
        posNeg: "positive",
        modType: "teamwork",
        effectKey: ["DocSelect-effect.Setup"],
        value: 1,
        sideString: "",
        tooltip: "<h1 class='gold-bright'>%DOC_NAME% Sets You Up</h1><p><strong class='gold-bright'>%DOC_NAME%</strong> has set you up for success with a preceding <strong>Setup</strong> action, increasing your <strong class='gold-bright'>Effect</strong> by one level.</p>"
      },
      {
        name: "Potency",
        category: RollModCategory.effect,
        base_status: RollModStatus.Hidden,
        posNeg: "positive",
        modType: "general",
        value: 1,
        tooltip: "<h1>Potency</h1><p>By circumstance or advantage, you have <strong>Potency</strong> in this action, increasing your <strong class='gold-bright'>Effect</strong> by one level.</p>"
      },
      {
        name: "Potency",
        category: RollModCategory.effect,
        base_status: RollModStatus.Hidden,
        posNeg: "negative",
        modType: "general",
        value: 1,
        tooltip: "<h1 class='red-bright'>Potency</h1><p>By circumstance or advantage, <strong class='red-bright'>@OPPOSITION_NAME@</strong> has <strong>Potency</strong> against you, reducing your <strong class='red-bright'>Effect</strong> by one level."
      }
    ];
  }
  static get DefaultFlagData(): BladesRollCollab.FlagData {
    return {
      rollID: randomID(),
      rollType: RollType.Action,
      rollSourceType: "Actor",
      rollSourceID: "",
      rollTrait: Factor.tier,
      rollMods: [],
      rollPositionInitial: Position.risky,
      rollEffectInitial: Effect.standard,
      rollPosEffectTrade: false,
      rollFactors: {
        [Factor.tier]: {name: "Tier", cssClasses: "roll-factor roll-factor-tier", value: 0, max: 0, isActive: false, isDominant: false, highFavorsPC: true}
      },
      isGMReady: false,
      GMBoosts: {},
      GMOppBoosts: {},
      docSelections: {
        [RollModCategory.roll]: {
          Assist: false,
          Group_1: false,
          Group_2: false,
          Group_3: false,
          Group_4: false,
          Group_5: false,
          Group_6: false
        },
        [RollModCategory.position]: {
          Setup: false
        },
        [RollModCategory.effect]: {
          Setup: false
        }
      }
    };
  }
  // #endregion

  // #region NEW ROLL CREATION: Rendering, Constructor ~
  static Current: Record<string, BladesRollCollab> = {};

  static async RenderRollCollab({userID, rollID}: { userID: string, rollID: string }) {
    const user = game.users.get(userID); // as User & {flags: {["eunos-blades"]: {rollCollab: BladesRollCollab.FlagData}}};
    if (!user) { return }
    BladesRollCollab.Current[rollID] = new BladesRollCollab(user, rollID);
    BladesRollCollab.Current[rollID].render(true);
  }

  static async CloseRollCollab(rollID: string) {
    eLog.checkLog3("rollCollab", "CloseRollCollab()", {rollID});
    await BladesRollCollab.Current[rollID]?.close({rollID});
    delete BladesRollCollab.Current[rollID];
  }

  static async NewRoll(config: BladesRollCollab.Config) {
    // All flags initialized on user must be set here, or everyone triggered by socket will run updates
    // if (game.user.isGM) { eLog.error("rollCollab", "GM Cannot Use New Roll!"); return }

    // let user: User|undefined;
    // if (config.userID) {
    //   user = game.users.get(config.userID);
    //   if (!(user instanceof User)) { throw new Error(`[BladesRollCollab.NewRoll] Bad UserID: '${config.userID}'`) }
    // } else if (game.user.isGM) {
    //   user =
    //   if (config.RollSource && config.rollSource)
    // }

    const user = game.users.get(config.userID ?? game.user._id);
    if (!(user instanceof User)) {
      eLog.error("rollCollab", `[NewRoll()] Can't Find User '${config.userID}'`, config);
      return;
    }
    await user.unsetFlag(C.SYSTEM_ID, "rollCollab");

    const flagUpdateData: BladesRollCollab.FlagData = {...BladesRollCollab.DefaultFlagData};

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
          flagUpdateData.rollTrait = U.lCase(config.rollTrait) as Action | Factor;
          break;
        }
        case RollType.Downtime: {
          if (!(U.lCase(config.rollTrait) in {...Action, ...Factor})) {
            eLog.error("rollCollab", `[RenderRollCollab()] Bad RollTrait for Downtime Roll: ${config.rollTrait}`, config);
            return;
          }
          flagUpdateData.rollTrait = U.lCase(config.rollTrait) as Action | Factor;
          break;
        }
        case RollType.Fortune: {
          if (!(U.lCase(config.rollTrait) in {...Action, ...Attribute, ...Factor})) {
            eLog.error("rollCollab", `[RenderRollCollab()] Bad RollTrait for Fortune Roll: ${config.rollTrait}`, config);
            return;
          }
          flagUpdateData.rollTrait = U.lCase(config.rollTrait) as Action | Attribute | Factor;
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

    await user.setFlag(C.SYSTEM_ID, "rollCollab", flagUpdateData);
    BladesRollCollab.RenderRollCollab({userID: user._id, rollID: flagUpdateData.rollID});
    socketlib.system.executeForAllGMs("renderRollCollab", {userID: user._id, rollID: flagUpdateData.rollID});
  }

  rollID: string;
  constructor(user: User, rollID: string) {
    super(user);
    this.rollID = rollID;
  }
  // #endregion

  MOD_EFFECTS = {
    PreApply: {
      /* Roll Mods to be applied BEFORE getData() Processing. */
      AutoEnableOn: (mod: BladesRollCollab.RollModData, sheetData: BladesRollCollab.PartialSheetData, param: string) => {
        param = U.lCase(param);
        switch (param) {
          case Position.controlled:
          case Position.risky:
          case Position.desperate: {
            if (this._getFinalPosition(sheetData) === param && ![RollModStatus.ForcedOn, RollModStatus.ForcedOff].includes(mod.status ?? mod.held_status ?? mod.base_status)) {
              // if (game.user.id === this.document.id) {
              //   this.updateRollMod({status: RollModStatus.ForcedOn}, mod.name, mod.category, mod.posNeg);
              // }
              mod.status = RollModStatus.ForcedOn;
            } else if (this._getFinalPosition(sheetData) !== param && mod.status !== RollModStatus.Hidden) {
              // if (game.user.id === this.document.id) {
              //   this.updateRollMod({status: RollModStatus.Hidden}, mod.name, mod.category, mod.posNeg);
              // }
              mod.status = RollModStatus.Hidden;
            }
            break;
          }
          // no default
        }
        BladesRollCollab.MergeInRollMod(mod, sheetData.rollMods);
        return sheetData;
      },
      AutoRevealOn: (mod: BladesRollCollab.RollModData, sheetData: BladesRollCollab.PartialSheetData, param: string) => {
        if (!sheetData.rollMods) { return sheetData }
        param = U.lCase(param);
        switch (param) {
          case Position.controlled:
          case Position.risky:
          case Position.desperate: {
            if (this._getFinalPosition(sheetData) === param && mod.status !== RollModStatus.ToggledOn) {
              // if (game.user.id === this.document.id) {
              //   this.updateRollMod({status: RollModStatus.ForcedOn}, mod.name, mod.category, mod.posNeg);
              // }
              mod.status = RollModStatus.ToggledOff;
            } else if (this._getFinalPosition(sheetData) !== param && mod.status !== RollModStatus.Hidden) {
              // if (game.user.id === this.document.id) {
              //   this.updateRollMod({status: RollModStatus.Hidden}, mod.name, mod.category, mod.posNeg);
              // }
              mod.status = RollModStatus.Hidden;
            }
            break;
          }
          // no default
        }
        BladesRollCollab.MergeInRollMod(mod, sheetData.rollMods);
        return sheetData;
      },
      ForceOn: (mod: BladesRollCollab.RollModData, sheetData: BladesRollCollab.PartialSheetData, param: string) => {
        if (!sheetData.rollMods) { return sheetData }
        if (![RollModStatus.ToggledOn, RollModStatus.ForcedOn].includes(mod.status ?? mod.held_status ?? mod.base_status)) { return sheetData }
        const [targetName, targetCat, targetPosNeg] = param.split(/,/);
        const targetMod = this._getMod(
          targetName,
          <RollModCategory|undefined>targetCat ?? mod.category,
          <"positive"|"negative"|undefined>targetPosNeg,
          sheetData.rollMods
        );
        if (!targetMod) { throw new Error(`Unable to find target mod '${targetName}' in category '${targetCat ?? mod.category}'`) }

        if (targetMod.name === "Push" && targetMod.category === RollModCategory.roll) {
          const bargainMod = this._getMod("Bargain");
          if (bargainMod.status === RollModStatus.ToggledOn) {
            bargainMod.status = RollModStatus.ToggledOff;
            BladesRollCollab.MergeInRollMod(bargainMod, sheetData.rollMods);
          }
        }

        targetMod.status = RollModStatus.ForcedOn;
        BladesRollCollab.MergeInRollMod(targetMod, sheetData.rollMods);
        return sheetData;
      },
      ForceOff: (mod: BladesRollCollab.RollModData, sheetData: BladesRollCollab.PartialSheetData, param: string) => {
        if (!sheetData.rollMods) { return sheetData }
        if (![RollModStatus.ToggledOn, RollModStatus.ForcedOn].includes(mod.status ?? mod.held_status ?? mod.base_status)) { return sheetData }
        const [targetName, targetCat, targetPosNeg] = param.split(/,/);
        const targetMod = this._getMod(
          targetName,
          <RollModCategory|undefined>targetCat ?? mod.category,
          <"positive"|"negative"|undefined>targetPosNeg,
          sheetData.rollMods
        );
        if (!targetMod) { throw new Error(`Unable to find target mod '${targetName}' in category '${targetCat ?? mod.category}'`) }
        if (targetMod.status === RollModStatus.Hidden) { return sheetData }
        targetMod.status = RollModStatus.ForcedOff;
        BladesRollCollab.MergeInRollMod(targetMod, sheetData.rollMods);
        return sheetData;
      },
      ToggleOff: (mod: BladesRollCollab.RollModData, sheetData: BladesRollCollab.PartialSheetData, param: string) => {
        if (!sheetData.rollMods) { return sheetData }
        if (![RollModStatus.ToggledOn, RollModStatus.ForcedOn].includes(mod.status ?? mod.held_status ?? mod.base_status)) { return sheetData }
        const [targetName, targetCat, targetPosNeg] = param.split(/,/);
        const targetMod = this._getMod(
          targetName,
          <RollModCategory|undefined>targetCat ?? mod.category,
          <"positive"|"negative"|undefined>targetPosNeg,
          sheetData.rollMods
        );
        if (!targetMod) { throw new Error(`Unable to find target mod '${targetName}' in category '${targetCat ?? mod.category}'`) }
        if ([RollModStatus.Hidden, RollModStatus.ForcedOn, RollModStatus.ToggledOff].includes(targetMod.status ?? targetMod.held_status ?? targetMod.base_status)) { return sheetData }
        targetMod.status = RollModStatus.ToggledOff;
        BladesRollCollab.MergeInRollMod(targetMod, sheetData.rollMods);
        return sheetData;
      },
      ForceHide: (mod: BladesRollCollab.RollModData, sheetData: BladesRollCollab.PartialSheetData, param: string) => {
        if (!sheetData.rollMods) { return sheetData }
        if (![RollModStatus.ToggledOn, RollModStatus.ForcedOn].includes(mod.status ?? mod.held_status ?? mod.base_status)) { return sheetData }
        const [targetName, targetCat, targetPosNeg] = param.split(/,/);
        const targetMod = this._getMod(
          targetName,
          <RollModCategory|undefined>targetCat ?? mod.category,
          <"positive"|"negative"|undefined>targetPosNeg,
          sheetData.rollMods
        );
        if (!targetMod) { throw new Error(`Unable to find target mod '${targetName}' in category '${targetCat ?? mod.category}'`) }
        targetMod.status = RollModStatus.Hidden;
        BladesRollCollab.MergeInRollMod(targetMod, sheetData.rollMods);
        return sheetData;
      },
      DocSelect: (mod: BladesRollCollab.RollModData, sheetData: BladesRollCollab.PartialSheetData, param: string) => {
        if (!sheetData.rollMods) { return sheetData }
        if (![RollModStatus.ToggledOn, RollModStatus.ForcedOn].includes(mod.status ?? mod.held_status ?? mod.base_status)) { return sheetData }
        const docID = getProperty(sheetData.docSelections, param);
        if (typeof docID !== "string") { return sheetData }
        const doc = BladesActor.Get(docID) ?? BladesItem.Get(docID);
        if (!(doc instanceof BladesActor || doc instanceof BladesItem) || !doc.name) { return sheetData }
        mod.sideString = doc.name;
        if (mod.tooltip) {
          mod.tooltip = mod.tooltip.replace(/%DOC_NAME%/g, doc.name);
        }
        BladesRollCollab.MergeInRollMod(mod, sheetData.rollMods);
        return sheetData;
      }
    },
    PostApply: {
      /* Roll Mods to be applied AFTER getData() Processing. */
      Cost: (mod: BladesRollCollab.RollModData, sheetData: BladesRollCollab.PartialSheetData, param: string) => {
        if (!sheetData.rollMods) { return sheetData }
        if (![RollModStatus.ToggledOn, RollModStatus.ForcedOn].includes(mod.status ?? mod.held_status ?? mod.base_status)) { return sheetData }

        return sheetData;
      },
      Decrease: (mod: BladesRollCollab.RollModData, sheetData: BladesRollCollab.PartialSheetData, param: string) => {
        if (!sheetData.rollMods) { return sheetData }
        if (![RollModStatus.ToggledOn, RollModStatus.ForcedOn].includes(mod.status ?? mod.held_status ?? mod.base_status)) { return sheetData }

        return sheetData;
      },
      Increase: (mod: BladesRollCollab.RollModData, sheetData: BladesRollCollab.PartialSheetData, param: string) => {
        if (!sheetData.rollMods) { return sheetData }
        if (![RollModStatus.ToggledOn, RollModStatus.ForcedOn].includes(mod.status ?? mod.held_status ?? mod.base_status)) { return sheetData }

        return sheetData;
      },
      Negate: (mod: BladesRollCollab.RollModData, sheetData: BladesRollCollab.PartialSheetData, param: string) => {
        if (!sheetData.rollMods) { return sheetData }
        if (![RollModStatus.ToggledOn, RollModStatus.ForcedOn].includes(mod.status ?? mod.held_status ?? mod.base_status)) { return sheetData }

        return sheetData;
      }
    }
  };

  get rData(): BladesRollCollab.FlagData | null {
    if (!this.document.getFlag(C.SYSTEM_ID, "rollCollab")) {
      eLog.error("rollCollab", "[get flags()] No RollCollab Flags Found on User", {user: this.document, flags: this.document.flags});
      return null;
    }
    return this.document.flags["eunos-blades"]!.rollCollab;
  }
  get rollSource(): BladesActor | BladesItem | undefined {
    if (!this.rData) { return undefined }
    return this.rData.rollSourceType === "Actor"
      ? game.actors.get(this.rData.rollSourceID)
      : game.items.get(this.rData.rollSourceID);
  }

  // #region ROLL MODS: Getters & Update Method ~
  isModActive(mod: BladesRollCollab.RollModData) { return [RollModStatus.ForcedOn, RollModStatus.ToggledOn].includes(mod.status ?? mod.held_status ?? mod.base_status) }

  // async forceOnPush(category: RollModCategory.roll|RollModCategory.effect, isFromEffectKey = false) {
  //   const flagData = (this.document.getFlag("eunos-blades", "rollCollab.rollMods") ?? []) as BladesRollCollab.RollModData[];
  //   const pushMod = this._getMod("Push", category);
  //   if (pushMod.status === RollModStatus.ForcedOn) { return }

  //   // Force On
  //   pushMod.status = RollModStatus.ForcedOn;
  //   BladesRollCollab.MergeInRollMod(pushMod, flagData);

  //   // Set Devil's Bargain Accordingly
  //   if (category === RollModCategory.roll && ![RollModStatus.ForcedOff, RollModStatus.Hidden].includes(this._getMod("Bargain")!.status)) {
  //     const bargainMod = this._getMod("Bargain");
  //     bargainMod.status = RollModStatus.ForcedOff;
  //     BladesRollCollab.MergeInRollMod(bargainMod, flagData);
  //   }

  //   // Update Flags
  //   await this.document.unsetFlag("eunos-blades", "rollCollab.rollMods");
  //   this.document.setFlag("eunos-blades", "rollCollab.rollMods", flagData);
  // }
  // async forceOffPush(category: RollModCategory.roll|RollModCategory.effect, isFromEffectKey = false) {
  //   const flagData = (this.document.getFlag("eunos-blades", "rollCollab.rollMods") ?? []) as BladesRollCollab.RollModData[];
  //   const pushMod = this._getMod("Push", category);
  //   if (pushMod.status === RollModStatus.ForcedOff) { return }

  //   // Force Off
  //   pushMod.status = RollModStatus.ForcedOff;
  //   BladesRollCollab.MergeInRollMod(pushMod, flagData);

  //   // Devil's Bargain: It can be on, off, whatever.
  //   // Only need to convert ForcedOff to ToggledOff
  //   if (category === RollModCategory.roll && this._getMod("Bargain")!.status === RollModStatus.ForcedOff) {
  //     const bargainMod = this._getMod("Bargain");
  //     bargainMod.status = RollModStatus.ToggledOff;
  //     BladesRollCollab.MergeInRollMod(bargainMod, flagData);
  //   }

  //   // Update Flags
  //   await this.document.unsetFlag("eunos-blades", "rollCollab.rollMods");
  //   this.document.setFlag("eunos-blades", "rollCollab.rollMods", flagData);
  // }
  // async toggleOnPush(category: RollModCategory.roll|RollModCategory.effect, isFromEffectKey = false) {
  //   const flagData = (this.document.getFlag("eunos-blades", "rollCollab.rollMods") ?? []) as BladesRollCollab.RollModData[];
  //   const pushMod = this._getMod("Push", category);
  //   /* TEST IF POSSIBLE */
  //   if (this.isModActive(pushMod)) { return }
  //   if (pushMod.status === RollModStatus.ForcedOff
  //     && !(isFromEffectKey || game.user.isGM)) { return }
  //   if (category === RollModCategory.roll
  //     && this._getMod("Bargain")!.status === RollModStatus.ForcedOn) { return }

  //   // Toggle On
  //   pushMod.status = RollModStatus.ToggledOn;
  //   BladesRollCollab.MergeInRollMod(pushMod, flagData);

  //   // Set Devil's Bargain Accordingly
  //   if (category === RollModCategory.roll && this._getMod("Bargain")!.status === RollModStatus.ToggledOn) {
  //     const bargainMod = this._getMod("Bargain");
  //     bargainMod.status = RollModStatus.ToggledOff;
  //     BladesRollCollab.MergeInRollMod(bargainMod, flagData);
  //   }

  //   // Update Flags
  //   await this.document.unsetFlag("eunos-blades", "rollCollab.rollMods");
  //   this.document.setFlag("eunos-blades", "rollCollab.rollMods", flagData);
  // }
  // async toggleOffPush(category: RollModCategory.roll|RollModCategory.effect, isFromEffectKey = false) {
  //   const flagData = (this.document.getFlag("eunos-blades", "rollCollab.rollMods") ?? []) as BladesRollCollab.RollModData[];
  //   const pushMod = this._getMod("Push", category);

  //   /* TEST IF POSSIBLE */
  //   if (!this.isModActive(pushMod)) { return }
  //   if (pushMod.status === RollModStatus.ForcedOn
  //     && !(isFromEffectKey || game.user.isGM)) { return }

  //   // Toggle On
  //   pushMod.status = RollModStatus.ToggledOff;
  //   BladesRollCollab.MergeInRollMod(pushMod, flagData);

  //   // Don't need to do anything for Devil's Bargain

  //   // Update Flags
  //   await this.document.unsetFlag("eunos-blades", "rollCollab.rollMods");
  //   this.document.setFlag("eunos-blades", "rollCollab.rollMods", flagData);
  // }
  // async offerBargain() {
  //   const flagData = (this.document.getFlag("eunos-blades", "rollCollab.rollMods") ?? []) as BladesRollCollab.RollModData[];
  //   const bargainMod = this._getMod("Bargain");
  //   if (bargainMod.status !== RollModStatus.Hidden) { return }

  //   // Reveal, toggled off
  //   bargainMod.status = RollModStatus.ToggledOff;
  //   BladesRollCollab.MergeInRollMod(bargainMod, flagData);

  //   // Update Flags
  //   await this.document.unsetFlag("eunos-blades", "rollCollab.rollMods");
  //   this.document.setFlag("eunos-blades", "rollCollab.rollMods", flagData);
  // }
  // async rescindBargain() {
  //   const flagData = (this.document.getFlag("eunos-blades", "rollCollab.rollMods") ?? []) as BladesRollCollab.RollModData[];
  //   const bargainMod = this._getMod("Bargain");
  //   if (bargainMod.status === RollModStatus.Hidden) { return }

  //   bargainMod.status = RollModStatus.Hidden;
  //   BladesRollCollab.MergeInRollMod(bargainMod, flagData);

  //   // Update Flags
  //   await this.document.unsetFlag("eunos-blades", "rollCollab.rollMods");
  //   this.document.setFlag("eunos-blades", "rollCollab.rollMods", flagData);

  // }
  // async toggleOnBargain() {
  //   const flagData = (this.document.getFlag("eunos-blades", "rollCollab.rollMods") ?? []) as BladesRollCollab.RollModData[];
  //   const pushMod = this._getMod("Push", RollModCategory.roll);
  //   if (pushMod.status === RollModStatus.ForcedOn) { return }
  //   const bargainMod = this._getMod("Bargain");
  //   if (bargainMod.status !== RollModStatus.ToggledOff) { return }

  //   bargainMod.status = RollModStatus.ToggledOn;
  //   BladesRollCollab.MergeInRollMod(bargainMod, flagData);

  //   if (pushMod.status === RollModStatus.ToggledOn) {
  //     pushMod.status = RollModStatus.ToggledOff;
  //     BladesRollCollab.MergeInRollMod(pushMod, flagData);
  //   }

  //   // Update Flags
  //   await this.document.unsetFlag("eunos-blades", "rollCollab.rollMods");
  //   this.document.setFlag("eunos-blades", "rollCollab.rollMods", flagData);
  // }
  // async toggleOffBargain() {
  //   const flagData = (this.document.getFlag("eunos-blades", "rollCollab.rollMods") ?? []) as BladesRollCollab.RollModData[];
  //   const bargainMod = this._getMod("Bargain");
  //   if (bargainMod.status === RollModStatus.ToggledOff) { return }

  //   if (bargainMod.status === RollModStatus.ForcedOn) { return }

  //   bargainMod.status = RollModStatus.ToggledOff;
  //   BladesRollCollab.MergeInRollMod(bargainMod, flagData);

  //   // Update Flags
  //   await this.document.unsetFlag("eunos-blades", "rollCollab.rollMods");
  //   this.document.setFlag("eunos-blades", "rollCollab.rollMods", flagData);

  // }
  // async resetTeamwork(category: RollModCategory, docKey: string) {
  //   const flagData = (this.document.getFlag("eunos-blades", "rollCollab") ?? []) as BladesRollCollab.FlagData;
  //   if (!flagData) { return }

  //   // Clear documentSelection
  //   Object.assign(
  //     flagData.docSelections[category as KeyOf<BladesRollCollab.FlagData["docSelections"]>],
  //     {[docKey]: false}
  //   );
  //   // Remove flag from rollmods so default is used
  //   U.pullElement(flagData.rollMods, (mod) => mod?.category === category && mod?.name === docKey);

  //   // Update Flags
  //   await this.document.unsetFlag("eunos-blades", "rollCollab");
  //   this.document.setFlag("eunos-blades", "rollCollab", flagData);
  // }

  static MergeInRollMod(mod: BladesRollCollab.RollModData, modList: BladesRollCollab.RollModData[]): BladesRollCollab.RollModData[] {
    // Pull matching mod in modList --> Same name, same category, same posNeg
    U.pullElement(modList, (listMod) => mod && listMod
      && mod.name === listMod.name
      && mod.category === listMod.category
      && mod.posNeg === listMod.posNeg);
    // Push new mod into modList and return
    modList.push(mod);
    return modList;
  }

  _getMod(name: string, cat?: RollModCategory, posNeg?: "positive" | "negative", rollMods = this.currentRollMods) {
    const matchingMods = rollMods.filter((mod) =>
      mod.name === name
      && (!cat || mod.category === cat)
      && (!posNeg || mod.posNeg === posNeg));
    if (matchingMods.length === 0) { throw new Error(`Cannot find mod ('${name}', cat: '${cat}', posNeg: '${posNeg}')`) }
    if (matchingMods.length > 1) { throw new Error(`${matchingMods.length} Matching Mods ('${name}', cat: '${cat}', posNeg: '${posNeg}'): Narrow Parameters`) }
    return matchingMods[0];
  }
  _getMods(cat?: RollModCategory, posNeg?: "positive" | "negative", rollMods = this.currentRollMods) {
    return rollMods.filter((mod) => (!cat || mod.category === cat) && (!posNeg || mod.posNeg === posNeg));
  }
  _getVisibleMods(cat?: RollModCategory, posNeg?: "positive" | "negative", rollMods = this.currentRollMods) {
    return this._getMods(cat, posNeg, rollMods)
      .filter((mod) => ![RollModStatus.Conditional, RollModStatus.Hidden].includes(mod.status ?? mod.held_status ?? mod.base_status));
  }
  _getActiveMods(cat?: RollModCategory, posNeg?: "positive" | "negative", rollMods = this.currentRollMods) {
    return this._getMods(cat, posNeg, rollMods)
      .filter((mod) => [RollModStatus.ToggledOn, RollModStatus.ForcedOn].includes(mod.status ?? mod.held_status ?? mod.base_status));
  }
  _sortMods(rollMods = this.currentRollMods) {
    return rollMods.sort((modA, modB) => {
      if (modA.name === "Push") { return -1 }
      if (modB.name === "Push") { return 1 }
      if (modA.name === "Bargain") { return -1 }
      if (modB.name === "Bargain") { return 1 }
      if (modA.name === "Assist") { return -1 }
      if (modB.name === "Assist") { return 1 }
      if (modA.name === "Setup") { return -1 }
      if (modB.name === "Setup") { return 1 }
      return modA.name.localeCompare(modB.name);
    });
  }

  _getModsDelta = (cat: RollModCategory, rollMods = this.currentRollMods) => {
    return U.sum([
      ...this._getActiveMods(cat, "positive", rollMods).map((mod) => mod.value),
      ...this._getActiveMods(cat, "negative", rollMods).map((mod) => -mod.value)
    ]);
  };

  _getConditionalModStatus(mod: BladesRollCollab.RollModData, sheetData: BladesRollCollab.PartialSheetData): RollModStatus {
    // if (mod.base_status !== RollModStatus.Conditional) { return mod.base_status }
    const autoRollTypes = mod.autoRollTypes ?? [];
    const autoRollTraits = mod.autoRollTraits ?? [];
    const conditionalRollTypes = mod.conditionalRollTypes ?? [];
    const conditionalRollTraits = mod.conditionalRollTraits ?? [];
    if (autoRollTypes.length + autoRollTraits.length > 0
      && (autoRollTypes.length === 0 || autoRollTypes.includes(sheetData.rollType))
      && (autoRollTraits.length === 0 || autoRollTraits.includes(sheetData.rollTrait))) {
      return RollModStatus.ForcedOn;
    } else if (conditionalRollTypes.length + conditionalRollTraits.length > 0
      && (conditionalRollTypes.length === 0 || conditionalRollTypes.includes(sheetData.rollType))
      && (conditionalRollTraits.length === 0 || conditionalRollTraits.includes(sheetData.rollTrait))) {
      return RollModStatus.ToggledOff;
    }
    return RollModStatus.Hidden;
  }

  _currentRollMods?: BladesRollCollab.RollModData[];
  get currentRollMods(): BladesRollCollab.RollModData[] {
    return this._currentRollMods ?? this.rData?.rollMods ?? [];
  }
  set currentRollMods(val: BladesRollCollab.RollModData[] | undefined) {
    this._currentRollMods = val;
  }

  async updateRollMod(updateData: Partial<BladesRollCollab.RollModData>, name: string, cat: RollModCategory, posNeg?: "positive" | "negative") {
    // if (game.user.id !== BladesRollCollab.Current.document.id) { return }
    const originalMod = this._getMod(name, cat, posNeg);
    if (!originalMod) {
      throw new Error(`Cannot find original mod ('${name}', cat: '${cat}', posNeg: '${posNeg}')`);
    }
    const newMod = mergeObject(originalMod, updateData) as BladesRollCollab.RollModData;
    const flagMods = this.rData?.rollMods ?? [];
    eLog.checkLog3("rollCollab", "UpdateRollMod", {originalMod, newMod, flagMods});
    BladesRollCollab.MergeInRollMod(newMod, flagMods);
    this.document.setFlag("eunos-blades", "rollCollab.rollMods", flagMods);
  }
  // #endregion

  // #region *** GETDATA ***

  _getFinalDicePool(sheetData: BladesRollCollab.PartialSheetData): number {
    return Math.max(0, (sheetData.rollTraitData?.value ?? 0)
      + this._getModsDelta(RollModCategory.roll, sheetData.rollMods)
      + (sheetData.GMBoosts?.Dice ?? 0));
  }
  _getFinalPosition(sheetData: BladesRollCollab.PartialSheetData): Position {
    return Object.values(Position)[U.clampNum(
      Object.values(Position)
        .indexOf(sheetData.rollPositionInitial ?? Position.risky)
          + this._getModsDelta(RollModCategory.position, sheetData.rollMods)
          + (sheetData.rollPosEffectTrade === "position" ? 1 : 0)
          + (sheetData.rollPosEffectTrade === "effect" ? -1 : 0),
      [0, 2]
    )];
  }
  _getFinalEffect(sheetData: BladesRollCollab.PartialSheetData): Effect {
    return Object.values(Effect)[U.clampNum(
      Object.values(Effect)
        .indexOf(sheetData.rollEffectInitial ?? Effect.standard)
          + this._getModsDelta(RollModCategory.effect, sheetData.rollMods)
          + (sheetData.rollPosEffectTrade === "effect" ? 1 : 0)
          + (sheetData.rollPosEffectTrade === "position" ? -1 : 0),
      [0, 4]
    )];
  }
  _processPreApplyEffectKeys(sheetData: BladesRollCollab.PartialSheetData): BladesRollCollab.PartialSheetData {
    sheetData.rollMods?.forEach((mod) => {
      const effectKeys = mod.effectKey ?? [];
      if (effectKeys.length === 0) { return }
      effectKeys.forEach((keyString) => {
        const [effectKey, effectParam] = keyString.split(/-/);
        if (effectKey in this.MOD_EFFECTS.PreApply) {
          sheetData = this.MOD_EFFECTS.PreApply[effectKey as KeyOf<typeof this.MOD_EFFECTS.PreApply>](mod, sheetData, effectParam);
        }
      });
    });
    return sheetData;
  }
  _processPostApplyEffectKeys(sheetData: BladesRollCollab.PartialSheetData): BladesRollCollab.PartialSheetData {
    sheetData.rollMods?.forEach((mod) => {
      const effectKeys = mod.effectKey ?? [];
      if (effectKeys.length === 0) { return }
      effectKeys.forEach((keyString) => {
        const [effectKey, effectParam] = keyString.split(/-/);
        if (effectKey in this.MOD_EFFECTS.PostApply) {
          sheetData = this.MOD_EFFECTS.PostApply[effectKey as KeyOf<typeof this.MOD_EFFECTS.PostApply>](mod, sheetData, effectParam);
        }
      });
    });
    return sheetData;
  }

  override async getData() {

    const context = super.getData();

    const {rData} = this;
    if (!rData) { return context }

    let sheetData: BladesRollCollab.PartialSheetData = {
      cssClass: "roll-collab",
      editable: this.options.editable,
      isGM: game.eunoblades.Tracker!.system.is_spoofing_player ? false : game.user.isGM,
      rollPositions: Object.values(Position),
      rollEffects: Object.values(Effect),
      teamworkDocs: game.actors.filter((actor) => BladesActor.IsType(actor, BladesActorType.pc)),
      ...rData
    };

    if (!this.rollSource) {
      eLog.error("rollCollab", `[getData()] No '${sheetData.rollSourceType}' Found with ID '${sheetData.rollSourceID}'`, {user: this.document, rData: rData});
      return null as never;
    }

    sheetData.system = this.rollSource.system;
    sheetData.rollSource = this.rollSource;

    // Derive Opposition Source from rollOppositionID
    if (sheetData.rollOppositionID) {
      const rollOpposition = BladesActor.Get(sheetData.rollOppositionID) ?? BladesItem.Get(sheetData.rollOppositionID);
      if (!rollOpposition) { throw new Error(`Cannot find Roll Opposition with ID '${sheetData.rollOppositionID}'`) }
      sheetData.rollOpposition = rollOpposition;
    }

    // Parse data depending on type of roll
    switch (sheetData.rollType) {
      case RollType.Action: {
        sheetData = this._getData_Action(sheetData);
        break;
      }
      case RollType.Resistance: {
        sheetData = this._getData_Resistance(sheetData);
        break;
      }
      case RollType.Downtime: {
        sheetData = this._getData_Downtime(sheetData);
        break;
      }
      case RollType.Fortune: {
        sheetData = this._getData_Fortune(sheetData);
        break;
      }
      // no default
    }

    const debugReport: Record<string, BladesRollCollab.SheetData | BladesRollCollab.RollModData[]> = {
      ["0) Initial Context"]: {...context} as any,
      ["0) Initial SheetData"]: {...sheetData} as BladesRollCollab.SheetData,
      ["1) Default Mods"]: U.objClone(BladesRollCollab.DefaultRollMods),
      ["2) From Source"]: U.objClone(sheetData.rollSource?.rollMods ?? []),
      ["3) From Opposition"]: U.objClone(sheetData.rollOpposition?.rollMods ?? []),
      ["4) From Flags"]: U.objClone(this.rData?.rollMods ?? [])
    };

    const mergedRollMods: BladesRollCollab.RollModData[] = [...BladesRollCollab.DefaultRollMods];
    // Merge source mods onto default mods
    (sheetData.rollSource?.rollMods ?? []).forEach((rollMod) => BladesRollCollab.MergeInRollMod(rollMod, mergedRollMods));
    // Merge opposition mods onto source + default mods
    (sheetData.rollOpposition?.rollMods ?? []).forEach((rollMod) => BladesRollCollab.MergeInRollMod(rollMod, mergedRollMods));
    // Merge flag mods onto opposition + source + default mods
    (this.rData?.rollMods ?? []).forEach((rollMod) => BladesRollCollab.MergeInRollMod(rollMod, mergedRollMods));

    sheetData.rollMods = mergedRollMods;
    this.currentRollMods = sheetData.rollMods;

    debugReport["5) MERGED"] = U.objClone(sheetData.rollMods);

    // *** ROLL-MODS: PREAPPLY EFFECT KEYS ***
    // Apply 'pre-apply' roll mod effect keys
    sheetData = this._processPreApplyEffectKeys(sheetData);

    debugReport["6) EFFECT KEYS: PRE-APPLY"] = U.objClone(sheetData.rollMods);

    // Set status of conditional roll mods
    const conditionalRollMods = sheetData.rollMods
      .filter((mod) => mod.status === RollModStatus.Conditional)
      .map((mod) => {
        mod.status = this._getConditionalModStatus(mod, sheetData);
        return mod;
      });

    conditionalRollMods
      .forEach((mod) => {
        BladesRollCollab.MergeInRollMod(mod, sheetData.rollMods);
      });

    debugReport["7) CONDITIONALIZED"] = U.objClone(sheetData.rollMods);

    // Derive final dice pool
    sheetData.diceTotal = this._getFinalDicePool(sheetData);

    // Derive final position and effect values
    sheetData.rollPositionFinal = this._getFinalPosition(sheetData);
    sheetData.rollEffectFinal = this._getFinalEffect(sheetData);

    sheetData.canTradePosition = sheetData.rollPosEffectTrade === "position"
      || (
        sheetData.rollPosEffectTrade === false
        && sheetData.rollPositionFinal !== Position.desperate
        && sheetData.rollEffectFinal !== Effect.extreme
      );
    sheetData.canTradeEffect = sheetData.rollPosEffectTrade === "effect"
      || (
        sheetData.rollPosEffectTrade === false
        && sheetData.rollEffectFinal !== Effect.zero
        && sheetData.rollPositionFinal !== Position.controlled
      );

    // Determine if any roll mods or GM boosts alter the standard result level
    sheetData.isAffectingResult = this._getVisibleMods(RollModCategory.result, undefined, sheetData.rollMods).length > 0
      || (sheetData.GMBoosts.Result ?? 0) !== 0
      || (sheetData.isGM && this._getMods(RollModCategory.result, undefined, sheetData.rollMods).length > 0);

    if (sheetData.isAffectingResult) {
      sheetData.rollResultFinal = this._getModsDelta(RollModCategory.result, sheetData.rollMods)
        + (sheetData.GMBoosts.Result ?? 0);
    }

    // Determine if any roll mods or GM boosts apply "after" the roll
    sheetData.isAffectingAfter = this._getVisibleMods(RollModCategory.after, undefined, sheetData.rollMods).length > 0
      || (sheetData.isGM && this._getMods(RollModCategory.after, undefined, sheetData.rollMods).length > 0);

    // Parse roll factors and apply GM Boosts
    if (sheetData.rollFactors) {
      for (const [factorName] of Object.entries(sheetData.rollFactors) as Array<[Factor, BladesRollCollab.FactorData]>) {
        if (sheetData.GMBoosts && factorName in sheetData.GMBoosts) {
          sheetData.rollFactors[factorName]!.value += sheetData.GMBoosts[factorName] ?? 0;
        }
        if ([Factor.tier, Factor.quality].includes(factorName)) {
          sheetData.rollFactors[factorName]!.display = U.romanizeNum(sheetData.rollFactors[factorName]!.value);
        }
      }
    }

    // Parse roll factors from opposition source, if present
    if (sheetData.rollOpposition) {
      sheetData.rollOppositionFactors = sheetData.rollOpposition.rollFactors;

      if (sheetData.rollOppositionFactors) {
        for (const [factorName] of Object.entries(sheetData.rollOppositionFactors) as Array<[Factor, BladesRollCollab.FactorData]>) {
          if (sheetData.GMOppBoosts && factorName in sheetData.GMOppBoosts) {
            sheetData.rollOppositionFactors[factorName]!.value += sheetData.GMOppBoosts[factorName] ?? 0;
          }
          if ([Factor.tier, Factor.quality].includes(factorName)) {
            sheetData.rollOppositionFactors[factorName]!.display = U.romanizeNum(sheetData.rollOppositionFactors[factorName]!.value);
          }
        }
      }
    }

    // Determine final Stress Cost
    const stressMods = this._getActiveMods(undefined, undefined, sheetData.rollMods)
      .filter((mod): mod is BladesRollCollab.RollModData & { stressCost: number } => Boolean(mod.stressCost));
    const stressTotal = U.sum(stressMods.map((mod) => mod.stressCost));

    if (stressTotal > 0) {
      sheetData.stressData = {
        cost: stressTotal,
        tooltip: [
          `<h1>Stress Cost: <span class='red-bright shadowed'>${stressTotal}</span></h1><ul>`,
          ...stressMods
            .map((mod) => `<li><strong class='shadowed'>${mod.name} (${mod.category}):</strong> <strong class='shadowed red-bright'>${mod.stressCost}</strong> Stress.</li>`),
          "</ul>"
        ].join("")
      };
    }

    this.currentRollMods = sheetData.rollMods;

    // *** ROLL-MODS: POSTAPPLY EFFECT KEYS ***
    // Apply 'post-apply' roll mod effect keys
    sheetData = this._processPostApplyEffectKeys(sheetData);

    debugReport["8) EFFECT KEYS: POST-APPLY"] = U.objClone(sheetData.rollMods);

    // Configure floating side menus for inactive Abilities
    sheetData.hasInactiveConditionals = {
      [RollModCategory.roll]: this._getMods(RollModCategory.roll, undefined, sheetData.rollMods)
        .filter((mod) => mod.isConditional
          && (mod.status === RollModStatus.ToggledOff || sheetData.isGM))
        .length > 0,
      [RollModCategory.position]: this._getMods(RollModCategory.position, undefined, sheetData.rollMods)
        .filter((mod) => mod.isConditional
          && (mod.status === RollModStatus.ToggledOff || sheetData.isGM))
        .length > 0,
      [RollModCategory.effect]: this._getMods(RollModCategory.effect, undefined, sheetData.rollMods)
        .filter((mod) => mod.isConditional
          && (mod.status === RollModStatus.ToggledOff || sheetData.isGM))
        .length > 0,
      [RollModCategory.result]: this._getMods(RollModCategory.result, undefined, sheetData.rollMods)
        .filter((mod) => mod.isConditional
          && (mod.status === RollModStatus.ToggledOff || sheetData.isGM))
        .length > 0,
      [RollModCategory.after]: this._getMods(RollModCategory.after, undefined, sheetData.rollMods)
        .filter((mod) => mod.isConditional
          && (mod.status === RollModStatus.ToggledOff || sheetData.isGM))
        .length > 0
    };

    this.currentRollMods = sheetData.rollMods;

    sheetData.posRollMods = {};
    sheetData.negRollMods = {};
    Object.values(RollModCategory).forEach((cat) => {
      sheetData.posRollMods![cat] = this._sortMods(this._getMods(cat, "positive", sheetData.rollMods));
      sheetData.negRollMods![cat] = this._sortMods(this._getMods(cat, "negative", sheetData.rollMods));
    });

    debugReport["8) FINAL MODS"] = sheetData.rollMods;
    debugReport["8.1) FINAL POS MODS"] = sheetData.posRollMods as BladesRollCollab.RollModData[];
    debugReport["8.2) FINAL NEG MODS"] = sheetData.negRollMods as BladesRollCollab.RollModData[];
    debugReport["9) FINAL SHEETDATA"] = sheetData as BladesRollCollab.SheetData;

    // Determine style string for odds bar
    const oddsColors = {
      crit: "var(--blades-gold-bright)",
      success: "var(--blades-white-bright)",
      partial: "var(--blades-black)",
      fail: "var(--blades-black-dark)"
    };
    const odds = C.DiceOdds[sheetData.diceTotal ?? 0];

    // Apply changes to odds from result level
    if ((sheetData.rollResultFinal ?? 0) < 0) {
      for (let i = sheetData.rollResultFinal ?? 0; i < 0; i++) {
        // For each negative shift, bump all the colors down one level.
        oddsColors.crit = oddsColors.success;
        oddsColors.success = oddsColors.partial;
        oddsColors.partial = oddsColors.fail;
      }
    } else if ((sheetData.rollResultFinal ?? 0) > 0) {
      for (let i = 0; i < (sheetData.rollResultFinal ?? 0); i++) {
        // For each positive shift, bump all the colors up one level.
        oddsColors.fail = oddsColors.partial;
        oddsColors.partial = oddsColors.success;
        oddsColors.success = oddsColors.crit;
      }
    }

    sheetData.oddsGradient = [
      "linear-gradient(to right",
      `${oddsColors.fail} ${odds.fail}%`,
      `${oddsColors.partial} ${odds.fail + odds.partial}%`,
      `${oddsColors.success} ${odds.fail + odds.partial + odds.success}%`,
      `${oddsColors.crit})`
    ].join(", ");

    // eLog.checkLog3("getData", "RollCollab.getData()", {...context, ...sheetData});

    debugReport["9.5) FINAL CONTEXT"] = {
      ...context,
      ...sheetData
    } as BladesRollCollab.SheetData;

    eLog.checkLog2("rollCollab", "Roll Mods by Source", debugReport);

    return {
      ...context,
      ...sheetData
    };
  }

  _getData_Action(sheetData: BladesRollCollab.PartialSheetData): BladesRollCollab.PartialSheetData {

    // Derive data for rolled trait
    if (BladesActor.IsType(this.rollSource, BladesActorType.pc) && isAction(sheetData.rollTrait)) {
      const {rollSource} = this;
      sheetData.rollTraitData = {
        name: sheetData.rollTrait,
        value: rollSource.actions[sheetData.rollTrait],
        max: rollSource.actions[sheetData.rollTrait]
      };
      sheetData.rollTraitOptions = Object.values(Action)
        .map((action) => ({
          name: U.uCase(action),
          value: action
        }));
    } else if (BladesActor.IsType(this.rollSource, BladesActorType.pc) && isFactor(sheetData.rollTrait)) {
      const {rollSource} = this;
      sheetData.rollTraitData = {
        name: U.tCase(sheetData.rollTrait),
        value: rollSource.getFactorTotal(sheetData.rollTrait),
        max: rollSource.getFactorTotal(sheetData.rollTrait)
      };
      sheetData.rollTraitOptions = false;
    } else if (U.isInt(sheetData.rollTrait)) {
      sheetData.rollTraitData = {
        name: `+${sheetData.rollTrait}`,
        value: sheetData.rollTrait,
        max: sheetData.rollTrait
      };
      sheetData.rollTraitOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
        .map((num) => ({
          name: `+${num}`,
          value: num
        }));
    }

    return sheetData;
  }
  _getData_Resistance(sheetData: BladesRollCollab.PartialSheetData): BladesRollCollab.PartialSheetData {

    // Derive data for rolled trait
    if (BladesActor.IsType(this.rollSource, BladesActorType.pc) && isAttribute(sheetData.rollTrait)) {
      const {rollSource} = this;
      sheetData.rollTraitData = {
        name: sheetData.rollTrait,
        value: rollSource.attributes[sheetData.rollTrait],
        max: rollSource.attributes[sheetData.rollTrait]
      };
      sheetData.rollTraitOptions = Object.values(Attribute)
        .map((attribute) => ({
          name: U.uCase(attribute),
          value: attribute
        }));
    } else if (U.isInt(sheetData.rollTrait)) {
      sheetData.rollTraitData = {
        name: `+${sheetData.rollTrait}`,
        value: sheetData.rollTrait,
        max: sheetData.rollTrait
      };
      sheetData.rollTraitOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
        .map((num) => ({
          name: `+${num}`,
          value: num
        }));
    }

    return sheetData;
  }
  _getData_Downtime(context: BladesRollCollab.PartialSheetData): BladesRollCollab.PartialSheetData {

    return context;
  }
  _getData_Fortune(context: BladesRollCollab.PartialSheetData): BladesRollCollab.PartialSheetData {

    return context;
  }

  // #endregion
  async _toggleRollModClick(event: ClickEvent) {
    event.preventDefault();
    const elem$ = $(event.currentTarget);
    const status = elem$.data("status") as RollModStatus;
    const cat = elem$.data("cat");
    const posNeg = elem$.data("posNeg");
    const name = elem$.data("name");

    switch (status) {
      case RollModStatus.Hidden: {
        return this.updateRollMod({base_status: RollModStatus.ToggledOff}, name, cat, posNeg);
      }
      case RollModStatus.ForcedOff: {
        if (game.user.isGM) {
          return this.updateRollMod({base_status: RollModStatus.ToggledOff}, name, cat, posNeg);
        }
        break;
      }
      case RollModStatus.ToggledOff: {
        return this.updateRollMod({base_status: RollModStatus.ToggledOn}, name, cat, posNeg);
      }
      case RollModStatus.ToggledOn: {
        return this.updateRollMod({base_status: game.user.isGM ? RollModStatus.ForcedOn : RollModStatus.ToggledOff}, name, cat, posNeg);
      }
      case RollModStatus.ForcedOn: {
        if (game.user.isGM) {
          return this.updateRollMod({base_status: RollModStatus.ToggledOff}, name, cat, posNeg);
        }
      }
      // no default
    }
    return undefined;
  }

  async _toggleRollModContext(event: ClickEvent) {
    event.preventDefault();
    if (!game.user.isGM) { return undefined }
    const elem$ = $(event.currentTarget);
    const status = elem$.data("status") as RollModStatus;
    const cat = elem$.data("cat");
    const posNeg = elem$.data("posNeg");
    const name = elem$.data("name");

    switch (status) {
      case RollModStatus.Hidden: {
        return this.updateRollMod({base_status: RollModStatus.ToggledOff}, name, cat, posNeg);
      }
      case RollModStatus.ForcedOff: {
        return this.updateRollMod({base_status: RollModStatus.Hidden}, name, cat, posNeg);
      }
      case RollModStatus.ToggledOff: {
        return this.updateRollMod({base_status: RollModStatus.ForcedOff}, name, cat, posNeg);
      }
      case RollModStatus.ToggledOn: {
        return this.updateRollMod({base_status: RollModStatus.ToggledOff}, name, cat, posNeg);
      }
      case RollModStatus.ForcedOn: {
        return this.updateRollMod({base_status: RollModStatus.ToggledOn}, name, cat, posNeg);
      }
      // no default
    }
    return undefined;
  }

  override activateListeners(html: JQuery<HTMLElement>) {
    super.activateListeners(html);
    ApplyTooltipListeners(html);

    // Toggleable Roll Mods
    html.find("[data-action='toggle']").on({
      click: this._toggleRollModClick.bind(this),
      contextmenu: this._toggleRollModContext.bind(this)
    });

    html.find("[data-action='tradePosition']").on({
      click: (event) => {
        const curVal = `${$(event.currentTarget).data("value")}`;
        if (curVal === "false") {
          this.document.setFlag(C.SYSTEM_ID, "rollCollab.rollPosEffectTrade", "effect");
        } else {
          this.document.setFlag(C.SYSTEM_ID, "rollCollab.rollPosEffectTrade", false);
        }
      }
    });
    html.find("[data-action='tradeEffect']").on({
      click: (event) => {
        const curVal = `${$(event.currentTarget).data("value")}`;
        if (curVal === "false") {
          this.document.setFlag(C.SYSTEM_ID, "rollCollab.rollPosEffectTrade", "position");
        } else {
          this.document.setFlag(C.SYSTEM_ID, "rollCollab.rollPosEffectTrade", false);
        }
      }
    });
  }

  override async _onSubmit(event: Event, {updateData}: FormApplication.OnSubmitOptions = {}) {
    return super._onSubmit(event, {updateData, preventClose: true})
      .then((returnVal) => { this.render(); return returnVal });
  }

  override async close(options: FormApplication.CloseOptions & { rollID?: string } = {}) {
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

interface BladesRollCollab {
  get document(): User
}

export default BladesRollCollab;