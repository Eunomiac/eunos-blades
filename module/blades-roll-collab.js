/* ****▌███████████████████████████████████████████████████████████████████████████▐**** *\
|*     ▌████░░░░░░░░░░░ Euno's Blades in the Dark for Foundry VTT ░░░░░░░░░░░░░████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░ by Eunomiac ░░░░░░░░░░░░░██████████████████▐     *|
|*     ▌████████████████████████████  License █ v0.1.0 ████████████████████████████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░░░░░░  ░░░░░░░░░░░░░░░░░░███████████████████▐     *|
\* ****▌███████████████████████████████████████████████████████████████████████████▐**** */

import U from "./core/utilities.js";
import C, { BladesActorType, BladesItemType, RollType, RollModStatus, RollModCategory, Action, Attribute, Position, Effect, Factor, RollResult, ConsequenceType } from "./core/constants.js";
import BladesActor from "./blades-actor.js";
import BladesItem from "./blades-item.js";
import { ApplyTooltipListeners } from "./core/gsap.js";
const DescriptionChanges = {
    "Battleborn": "<p><em>If you 'reduce harm' that means the level of harm you're facing right now is reduced by one.</em></p><p><em>If you use this ability to push yourself, you get one of the benefits (+1d, +1 effect, act despite severe harm) but you don't take 2 stress.</em></p><p><em>Your special armor is restored at the beginning of downtime.</em></p>",
    "Bodyguard": "<p><em>The protect teamwork maneuver lets you face a consequence for a teammate.</em></p><p><em>If you choose to resist that consequence, this ability gives you +1d to your resistance roll.</em></p><p><em>Also, when you read a situation to gather information about hidden dangers or potential attackers, you get +1 effect—which means more detailed information.</em></p>",
    "Ghost Fighter": "<p><em>When you're imbued, you can strongly interact with ghosts and spirit-stuff, rather than weakly interact.</em></p><p><em>When you imbue yourself with spirit energy, how do you do it? What does it look like when the energy manifests?</em></p>",
    "Leader": "<p><em>This ability makes your cohorts more effective in battle and also allows them to resist harm by using armor.</em></p><p><em>While you lead your cohorts, they won't stop fighting until they take fatal harm (level 4) or you order them to cease.</em></p><p><em>What do you do to inspire such bravery in battle?</em></p>",
    "Mule": "<p><em>This ability is great if you want to wear heavy armor and pack a heavy weapon without attracting lots of attention. Since your exact gear is determined on-the-fly during an operation, having more load also gives you more options to get creative with when dealing with problems during a score.</em></p>",
    "Not to Be Trifled With": "<p><em>When you push yourself to activate this ability, you still get one of the normal benefits of pushing yourself (+1d, +1 effect, etc.) in addition to the special ability.</em></p><p><em>If you perform a feat that verges on the superhuman, you might break a metal weapon with your bare hands, tackle a galloping horse, lift a huge weight, etc.</em></p><p><em>If you engage a small gang on equal footing, you don't suffer reduced effect due to scale against a small gang (up to six people).</em></p>",
    "Savage": "<p><em>You instill fear in those around you when you get violent. How they react depends on the person. Some people will flee from you, some will be impressed, some will get violent in return. The GM judges the response of a given NPC.</em></p><p><em>In addition, when you Command someone who's affected by fear (from this ability or otherwise), take +1d to your roll.</em></p>",
    "Vigorous": "<p><em>Your healing clock becomes a 3-clock, and you get a bonus die when you recover.</em></p>",
    "Sharpshooter": "<p><em>When you push yourself to activate this ability, you still get one of the normal benefits of pushing yourself (+1d, +1 effect, etc.) in addition to the special ability.</em></p><p><em>The first use of this ability allows you to attempt long-range sniper shots that would otherwise be impossible with the rudimentary firearms of Duskwall.</em></p><p><em>The second use allows you to keep up a steady rate of fire in a battle (enough to 'suppress' a small gang up to six people), rather than stopping for a slow reload or discarding a gun after each shot. When an enemy is suppressed, they're reluctant to maneuver or attack (usually calling for a fortune roll to see if they can manage it).</em></p>",
    "Focused": "<p><em>If you 'resist a consequence' of the appropriate type, you avoid it completely.</em></p><p><em>If you use this ability to push yourself, you get one of the benefits (+1d, +1 effect, act despite severe harm) but you don't take 2 stress.</em></p><p><em>Your special armor is restored at the beginning of downtime.</em></p>",
    "Ghost Hunter (Arrow-Swift)": "<p><em>Your pet functions as a <strong>cohort (Expert: Hunter)</strong>.</em></p><p><em>This ability gives them potency against supernatural targets and the arcane ability to move extremely quickly, out-pacing any other creature or vehicle.</em></p>",
    "Ghost Hunter (Ghost Form)": "<p><em>Your pet functions as a <strong>cohort (Expert: Hunter)</strong>.</em></p><p><em>This ability gives them potency against supernatural targets and the arcane ability to transform into electroplasmic vapor as if it were a spirit.</em></p>",
    "Ghost Hunter (Mind Link)": "<p><em>Your pet functions as a <strong>cohort (Expert: Hunter)</strong>.</em></p><p><em>This ability gives them potency against supernatural targets and the arcane ability to share senses and thoughts telepathically with their master.</em></p>",
    "Scout": "<p><em>A 'target' can be a person, a destination, a good ambush spot, an item, etc.</em></p>",
    "Survivor": "<p><em>This ability gives you an additional stress box, so you have 10 instead of 9. The maximum number of stress boxes a PC can have (from any number of additional special abilities or upgrades) is 12.</em></p>",
    "Tough As Nails": "<p><em>With this ability, level 3 harm doesn't incapacitate you; instead you take -1d to your rolls (as if it were level 2 harm). Level 2 harm affects you as if it were level 1 (less effect). Level 1 harm has no effect on you (but you still write it on your sheet, and must recover to heal it). Record the harm at its original level—for healing purposes, the original harm level applies.</em></p>",
    "Alchemist": "<p><em>Follow the Inventing procedure with the GM (page 224) to define your first special alchemical formula.</em></p>",
    "Artificer": "<p><em>Follow the Inventing procedure with the GM (page 224) to define your first spark-craft design.</em></p>",
    "Fortitude": "<p><em>If you 'resist a consequence' of the appropriate type, you avoid it completely.</em></p><p><em>If you use this ability to push yourself, you get one of the benefits (+1d, +1 effect, act despite severe harm) but you don't take 2 stress.</em></p><p><em>Your special armor is restored at the beginning of downtime.</em></p>",
    "Ghost Ward": "<p><em>If you make an area anathema to spirits, they will do everything they can to avoid it, and will suffer torment if forced inside the area.</em></p><p><em>If you make an area enticing to spirits, they will seek it out and linger in the area, and will suffer torment if forced to leave.</em></p><p><em>This effect lasts for several days over an area the size of a small room.</em></p><p><em>Particularly powerful or prepared spirits may roll their quality or arcane magnitude to see how well they're able to resist the effect.</em></p>",
    "Physicker": "<p><em>Knowledge of anatomy and healing is a rare and esoteric thing in Duskwall. Without this ability, any attempts at treatment are likely to fail or make things worse.</em></p><p><em>You can use this ability to give first aid (rolling <strong>Tinker</strong>) to allow your patient to ignore a harm penalty for an hour or two.</em></p>",
    "Saboteur": "<p><em>You can drill holes in things, melt stuff with acid, even use a muffled explosive, and it will all be very quiet and extremely hard to notice.</em></p>",
    "Venomous": "<p><em>You choose the type of drug or poison when you get this ability. Only a single drug or poison may be chosen—you can't become immune to any essences, oils, or other alchemical substances.</em></p><p><em>You may change the drug or poison by completing a <strong>long-term project</strong>.</em></p><p><em>When you push yourself to activate this ability, you still get one of the normal benefits of pushing yourself (+1d, +1 effect, etc.) if you're making a roll, in addition to the special ability.</em></p>",
    "Infiltrator": "<p><em>This ability lets you contend with higher-Tier enemies on equal footing. When you're cracking a safe, picking a lock, or sneaking past elite guards, your effect level is never reduced due to superior Tier or quality level of your opposition.</em></p><p><em>Are you a renowned safe cracker? Do people tell stories of how you slipped under the noses of two Chief Inspectors, or are your exceptional talents yet to be discovered?</em></p>",
    "Ambush": "<p><em>This ability benefits from preparation— so don't forget you can do that in a flashback.</em></p>",
    "Daredevil": "<p><em>This special ability is a bit of a gamble. The bonus die helps you, but if you suffer consequences, they'll probably be more costly to resist. But hey, you're a daredevil, so no big deal, right?</em></p>",
    "The Devil's Footsteps": "<p><em>When you push yourself to activate this ability, you still get one of the normal benefits of pushing yourself (+1d, +1 effect, etc.) if you're making a roll, in addition to the special ability.</em></p><p><em>If you perform an athletic feat (running, tumbling, balance, climbing, etc.) that verges on the superhuman, you might climb a sheer surface that lacks good hand-holds, tumble safely out of a three-story fall, leap a shocking distance, etc.</em></p><p><em>If you maneuver to confuse your enemies, they attack each other for a moment before they realize their mistake. The GM might make a fortune roll to see how badly they harm or interfere with each other.</em></p>",
    "Expertise": "<p><em>This special ability is good for covering for your team. If they're all terrible at your favored action, you don't have to worry about suffering a lot of stress when you lead their group action.</em></p>",
    "Ghost Veil": "<p><em>This ability transforms you into an intangible shadow for a few moments. If you spend additional stress, you can extend the effect for additional benefits, which may improve your position or effect for action rolls, depending on the circumstances, as usual.</em></p>",
    "Reflexes": "<p><em>This ability gives you the initiative in most situations. Some specially trained NPCs (and some demons and spirits) might also have reflexes, but otherwise, you're always the first to act, and can interrupt anyone else who tries to beat you to the punch.</em></p><p><em>This ability usually doesn't negate the need to make an action roll that you would otherwise have to make, but it may improve your position or effect.</em></p>",
    "Shadow": "<p><em>If you 'resist a consequence' of the appropriate type, you avoid it completely.</em></p><p><em>If you use this ability to push yourself, you get one of the benefits (+1d, +1 effect, act despite severe harm) but you don't take 2 stress.</em></p><p><em>Your special armor is restored at the beginning of downtime.</em></p>",
    "Rook's Gambit": "<p><em>This is the 'jack-of-all-trades' ability. If you want to attempt lots of different sorts of actions and still have a good dice pool to roll, this is the special ability for you.</em></p>",
    "Cloak & Dagger": "<p><em>This ability gives you the chance to more easily get out of trouble if a covert operation goes haywire. Also, don't forget your <strong class='cyan-bright'>fine</strong> <strong>disguise kit</strong> gear, which boosts the effect of your covert deception methods.</em></p>",
    "Ghost Voice": "<p><em>The first part of this ability gives you permission to do something that is normally impossible: when you speak to a spirit, it always listens and understands you, even if it would otherwise be too bestial or insane to do so.</em></p><p><em>The second part of the ability increases your effect when you use social actions with the supernatural.</em></p>",
    "Like Looking Into a Mirror": "<p><em>This ability works in all situations without restriction. It is very powerful, but also a bit of a curse. You see though every lie, even the kind ones.</em></p>",
    "A Little Something on the Side": "<p><em>Since this money comes at the end of downtime, after all downtime actions are resolved, you can't remove it from your stash and spend it on extra activities until your next downtime phase.</em></p>",
    "Mesmerism": "<p><em>The victims' memory 'glosses over' the missing time, so it's not suspicious that they've forgotten something.</em></p><p><em>When you next interact with the victim, they remember everything clearly, including the strange effect of this ability.</em></p>",
    "Subterfuge": "<p><em>If you 'resist a consequence' of the appropriate type, you avoid it completely.</em></p><p><em>If you use this ability to push yourself, you get one of the benefits (+1d, +1 effect, act despite severe harm) but you don't take 2 stress.</em></p><p><em>Your special armor is restored at the beginning of downtime.</em></p>",
    "Trust in Me": "<p><em>This ability isn't just for social interactions. Any action can get the bonus. 'Intimate' is for you and the group to define, it need not exclusively mean romantic intimacy.</em></p>",
    "Foresight": "<p><em>You can narrate an event in the past that helps your teammate now, or you might explain how you expected this situation and planned a helpful contingency that you reveal now.</em></p>",
    "Calculating": "<p><em>If you forget to use this ability during downtime, you can still activate it during the score and flashback to the previous downtime when the extra activity happened.</em></p>",
    "Connected": "<p><em>Your array of underworld connections can be leveraged to loan assets, pressure a vendor to give you a better deal, intimidate witnesses, etc.</em></p>",
    "Functioning Vice": "<p><em>If you indulged your vice and rolled a 4, you could increase the result to 5 or 6, or you could reduce the result to 3 or 2 (perhaps to avoid overindulgence).</em></p><p><em>Allies that join you don't need to have the same vice as you, just one that could be indulged alongside yours somehow.</em></p>",
    "Ghost Contract": "<p><em>The mark of the oath is obvious to anyone who sees it (perhaps a magical rune appears on the skin).</em></p><p><em>When you suffer 'Cursed' harm, you're incapacitated by withering: enfeebled muscles, hair falling out, bleeding from the eyes and ears, etc., until you either fulfill the deal or discover a way to heal the curse.</em></p>",
    "Jail Bird": "<p><em>Zero is the minimum wanted level; this ability can't make your wanted level negative.</em></p>",
    "Mastermind": "<p><em>If you protect a teammate, this ability negates or reduces the severity of a consequence or harm that your teammate is facing. You don't have to be present to use this ability—say how you prepared for this situation in the past.</em></p><p><em>If you use this ability to push yourself, you get one of the benefits (+1d, +1 effect, act despite severe harm) but you don't take 2 stress.</em></p><p><em>Your special armor is restored at the beginning of downtime.</em></p>",
    "Weaving the Web": "<p><em>Your network of underworld connections can always be leveraged to gain insight for a job—even when your contacts aren't aware that they're helping you.</em></p>",
    "Compel": "<p><em>The GM will tell you if you sense any ghosts nearby. If you don't, you can <strong>gather information</strong> (maybe <strong>Attune</strong>, <strong>Survey</strong>, or <strong>Study</strong>) to attempt to locate one.</em></p><p><em>By default, a ghost wants to satisfy its need for life essence and to exact vengeance. When you compel it, you can give it a general or specific command, but the more general it is (like 'Protect me') the more the ghost will interpret it according to its own desires.</em></p><p><em>Your control over the ghost lasts until the command is fulfilled, or until a day has passed, whichever comes first.</em></p>",
    "Iron Will": "<p><em>With this ability, you do not freeze up or flee when confronted by any kind of supernatural entity or strange occult event.</em></p>",
    "Occultist": "<p><em>Consorting with a given entity may require special preparations or travel to a specific place. The GM will tell you about any requirements.</em></p><p><em>You get the bonus die to your Command rolls because you can demonstrate a secret knowledge of or influence over the entity when you interact with cultists.</em></p>",
    "Ritual": "<p><em>Without this special ability, the study and practice of rituals leaves you utterly vulnerable to the powers you supplicate. Such endeavors are not recommended.</em></p>",
    "Strange Methods": "<p><em>Follow the Inventing procedure with the GM (page 224) to define your first arcane design.</em></p>",
    "Tempest": "<p><em>When you push yourself to activate this ability, you still get one of the normal benefits of pushing yourself (+1d, +1 effect, etc.) if you're making a roll, in addition to the special ability.</em></p><p><em>When you unleash lightning as a weapon, the GM will describe its effect level and significant collateral damage. If you unleash it in combat against an enemy who's threatening you, you'll still make an action roll in the fight (usually with Attune).</em></p><p><em>When you summon a storm, the GM will describe its effect level. If you're using this power as cover or distraction, it's probably a setup teamwork maneuver, using Attune.</em></p>",
    "Warded": "<p><em>If you resist a consequence, this ability negates it completely.</em></p><p><em>If you use this ability to push yourself, you get one of the benefits (+1d, +1 effect, act despite severe harm) but you don't take 2 stress.</em></p><p><em>Your special armor is restored at the beginning of downtime.</em></p>",
    "Deadly": "<p><em>Each player may choose the action they prefer (you don't all have to choose the same one).</em></p><p><em>If you take this ability during initial character and crew creation, it supersedes the normal starting limit for action ratings.</em></p>",
    "Crow's Veil": "<p><em>The bells don't ring at the crematorium when a member of your crew kills someone. Do you have a 'membership ritual' now that conveys this talent?</em></p>",
    "Emberdeath": "<p><em>This ability activates at the moment of the target's death (spend 3 stress then or lose the opportunity to use it). It can only be triggered by a killing blow. Some particularly powerful supernatural entities or specially protected targets may be resistant or immune to this ability.</em></p>",
    "No Traces": "<p><em>There are many clients who value quiet operations. This ability rewards you for keeping a low profile.</em></p>",
    "Patron": "<p><em>Who is your patron? Why do they help you?</em></p>",
    "Predators": "<p><em>This ability applies when the goal is murder. It doesn't apply to other stealth or deception operations you attempt that happen to involve killing.</em></p>",
    "Vipers": "<p><em>The poison immunity lasts for the entire score, until you next have downtime.</em></p>",
    "Dangerous": "<p><em>Each player may choose the action they prefer (you don't all have to choose the same one).</em></p><p><em>If you take this ability during initial character and crew creation, it supersedes the normal starting limit for action ratings.</em></p>",
    "Blood Brothers": "<p><em>If you have the Elite Thugs upgrade, it stacks with this ability. So, if you had an Adepts gang cohort, and the Elite Thugs upgrade, and then took Blood Brothers, your Adepts would add the Thugs type and also get +1d to rolls when they did Thug-type actions.</em></p><p><em>This ability may result in a gang with three types, surpassing the normal limit of two.</em></p>",
    "Door Kickers": "<p><em>This ability applies when the goal is to attack an enemy. It doesn't apply to other operations you attempt that happen to involve fighting.</em></p>",
    "Fiends": "<p><em>The maximum wanted level is 4. Regardless of how much turf you hold (from this ability or otherwise) the minimum rep cost to advance your Tier is always 6.</em></p>",
    "Forged In The Fire": "<p><em>This ability applies to PCs in the crew. It doesn't confer any special toughness to your cohorts.</em></p>",
    "Chosen": "<p><em>Each player may choose the action they prefer (you don't all have to choose the same one).</em></p><p><em>If you take this ability during initial character and crew creation, it supersedes the normal starting limit for action ratings.</em></p>",
    "Bound in Darkness": "<p><em>By what occult means does your teamwork manifest over distance? How is it strange or disturbing? By what ritualistic method are cult members initiated into this ability?</em></p>",
    "Conviction": "<p><em>What sort of sacrifice does your deity find pleasing?</em></p>",
    "Silver Tongues": "<p><em>Each player may choose the action they prefer (you don't all have to choose the same one).</em></p><p><em>If you take this ability during initial character and crew creation, it supersedes the normal starting limit for action ratings.</em></p>",
    "Accord": "<p><em>If your status changes, you lose the turf until it becomes +3 again. Regardless of how much turf you hold (from this ability or otherwise) the minimum rep cost to advance your Tier is always 6.</em></p>",
    "Ghost Market": "<p><em>They do not pay in coin. What do they pay with?</em></p><p><em>The GM will certainly have an idea about how your strange new clients pay, but jump in with your own ideas, too! This ability is usually a big shift in the game, so talk it out and come up with something that everyone is excited about. If it's a bit mysterious and uncertain, that's good. You have more to explore that way.</em></p>",
    "The Good Stuff": "<p><em>The quality of your product might be used for a fortune roll to find out how impressed a potential client is, to find out how enthralled or incapacitated a user is in their indulgence of it, to discover if a strange variation has side-effects, etc.</em></p>",
    "Everyone Steals": "<p><em>Each player may choose the action they prefer (you don't all have to choose the same one).</em></p><p><em>If you take this ability during initial character and crew creation, it supersedes the normal starting limit for action ratings.</em></p>",
    "Ghost Echoes": "<p><em>You might explore the echo of an ancient building, crumbled to dust in the real world, but still present in the ghost field; or discern the electroplasmic glow of treasures lost in the depths of the canals; or use a sorcerous ghost door from the pre-cataclysm to infiltrate an otherwise secure location; etc.</em></p><p><em>The GM will tell you what echoes persist nearby when you gather information about them. You might also undertake investigations to discover particular echoes you hope to find.</em></p>",
    "Pack Rats": "<p><em>This ability might mean that you actually have the item you need in your pile of stuff, or it could mean you have extra odds and ends to barter with.</em></p>",
    "Slippery": "<p><em>The GM might sometimes want to choose an entanglement instead of rolling. In that case, they'll choose two and you can pick between them.</em></p>",
    "Synchronized": "<p><em>For example, Lyric leads a group action to Attune to the ghost field to overcome a magical ward on the Dimmer Sisters' door. Emily, Lyric's player, rolls and gets a 6, and so does Matt! Because the crew has Synchronized, their two separate 6s count as a critical success on the roll.</em></p>",
    "Ghost Passage": "<p><em>What do you do to 'carry' a spirit? Must the spirit consent, or can you use this ability to trap an unwilling spirit within?</em></p>",
    "Reavers": "<p><em>If your vehicle already has armor, this ability gives an additional armor box.</em></p>",
    "Renegades": "<p><em>Each player may choose the action they prefer (you don't all have to choose the same one).</em></p><p><em>If you take this ability during initial character and crew creation, it supersedes the normal starting limit for action ratings.</em></p>"
};
const RollCollabEffectChanges = {
    [BladesItemType.ability]: {
        "Battleborn": [
            {
                key: "system.roll_mods",
                mode: 2,
                priority: null,
                value: "name:Battleborn@cat:after@type:ability@cTypes:Action@cTraits:hunt|finesse|prowl|skirmish|wreck|attune|command@eKey:Negate-PushCost|Cost-SpecialArmor@status:Hidden@tooltip:<h1>Battleborn</h1><p>You may expend your <strong class='cyan-bright'>special armor</strong> instead of paying <strong class='red-bright'>2 stress</strong> to <strong>Push</strong> yourself during a fight.</p>"
            },
            {
                key: "system.roll_mods",
                mode: 2,
                priority: null,
                value: "name:Battleborn@cat:roll@type:ability@cTypes:Resistance@val:0@eKey:Cost-SpecialArmor|Negate-HarmLevel@status:Hidden@tooltip:<h1>Battleborn</h1><p>You may expend your <strong class='cyan-bright'>special armor</strong> to reduce the level of <strong class='red-bright'>harm</strong> you are resisting by one.</p>"
            }
        ],
        "Bodyguard": [
            {
                key: "system.roll_mods",
                mode: 2,
                priority: null,
                value: "name:Bodyguard@cat:roll@type:ability@cTypes:Resistance@status:Hidden@tooltip:<h1>Bodyguard</h1><p>When you <strong class='cyan-bright'>protect</strong> a teammate, take <strong class='gold-bright'>+1d</strong> to your <strong>resistance</strong> roll.</p>"
            },
            {
                key: "system.roll_mods",
                mode: 2,
                priority: null,
                value: "name:Bodyguard@cat:effect@type:ability@cTypes:Engagement@status:Hidden@tooltip:<h1>Bodyguard</h1><p>When you <strong class='cyan-bright'>gather information</strong> to anticipate possible threats in the current situation, you get <strong class='gold-bright'>+1 effect</strong>.</p>"
            }
        ],
        "Ghost Fighter": [
            {
                key: "system.roll_mods",
                mode: 2,
                priority: null,
                value: "name:Ghost Fighter@cat:effect@type:ability@cTypes:Action@cTraits:hunt|finesse|prowl|skirmish|wreck|attune|command@val:0@eKey:ForceOn-Potency@status:Hidden@tooltip:<h1>Ghost Fighter</h1><p>You may <strong class='cyan-bright'>imbue</strong> your hands, melee weapons, or tools with spirit energy, giving you <strong class='gold-bright'>Potency</strong> in combat vs. the supernatural.</p><p>You may also grapple with spirits to restrain and capture them.</p>"
            }
        ],
        "Leader": [
            {
                key: "system.roll_mods",
                mode: 2,
                priority: null,
                isCohort: true,
                value: "name:Leader@cat:effect@type:ability@cTypes:Action@cTraits:command@status:Hidden@tooltip:<h1>Leader</h1><p>When a <strong class='cyan-bright'>Leader</strong> <strong>Command</strong>s this cohort in combat, it gains <strong class='gold-bright'>+1 effect</strong>.</p>"
            }
        ],
        "Not to Be Trifled With": [
            {
                key: "system.roll_mods",
                mode: 2,
                priority: null,
                value: "name:Superhuman Feat@cat:roll@type:ability@cTypes:Action@cTraits:hunt|finesse|prowl|skirmish|wreck|command@val:0@eKey:Is-Push|ForceOn-Push@sourceName:Not to Be Trifled With@status:Hidden@tooltip:<h1>Not to Be Trifled With — Superhuman Feat</h1><p>You can <strong>Push</strong> yourself to perform a feat of physical force that verges on the superhuman <em>(you might break a metal weapon with your bare hands, tackle a galloping horse, lift a huge weight, etc.)</em>.</p><p>You still gain <strong class='gold-bright'>+1d</strong> to your roll at the cost of <strong class='red-bright'>2 stress</strong>, as normal for a <strong>Push</strong>.</p>"
            },
            {
                key: "system.roll_mods",
                mode: 2,
                priority: null,
                value: "name:Superhuman Feat@cat:effect@type:ability@cTypes:Action@cTraits:hunt|finesse|prowl|skirmish|wreck|command@val:0@eKey:Is-Push|ForceOn-Push@sourceName:Not to Be Trifled With@status:Hidden@tooltip:<h1>Not to Be Trifled With — Superhuman Feat</h1><p>You can <strong>Push</strong> yourself to perform a feat of physical force that verges on the superhuman <em>(you might break a metal weapon with your bare hands, tackle a galloping horse, lift a huge weight, etc.)</em>.</p><p>You still gain <strong class='gold-bright'>+1 effect</strong> at the cost of <strong class='red-bright'>2 stress</strong>, as normal for a <strong>Push</strong>.</p>"
            },
            {
                key: "system.roll_mods",
                mode: 2,
                priority: null,
                value: "name:Engage Gang@cat:roll@type:ability@cTypes:Action@cTraits:hunt|finesse|prowl|skirmish|wreck|attune|command@val:0@eKey:Is-Push|ForceOn-Push|Negate-ScalePenalty@sourceName:Not to Be Trifled With@status:Hidden@tooltip:<h1>Not to Be Trifled With — Engage Gang</h1><p>You can <strong>Push</strong> yourself to engage a gang of up to six members on equal footing (negating any <strong>Scale</strong> penalties).</p><p>You still gain <strong class='gold-bright'>+1d</strong> to your roll at the cost of <strong class='red-bright'>2 stress</strong>, as normal for a <strong>Push</strong>.</p>"
            },
            {
                key: "system.roll_mods",
                mode: 2,
                priority: null,
                value: "name:Engage Gang@cat:effect@type:ability@cTypes:Action@cTraits:hunt|finesse|prowl|skirmish|wreck|attune|command@val:0@eKey:Is-Push|ForceOn-Push|Negate-ScalePenalty@sourceName:Not to Be Trifled With@status:Hidden@tooltip:<h1>Not to Be Trifled With — Engage Gang</h1><p>You can <strong>Push</strong> yourself to engage a gang of up to six members on equal footing (negating any <strong>Scale</strong> penalties).</p><p>You still gain <strong class='gold-bright'>+1 effect</strong> at the cost of <strong class='red-bright'>2 stress</strong>, as normal for a <strong>Push</strong>.</p>"
            }
        ],
        "Savage": [
            {
                key: "system.roll_mods",
                mode: 2,
                priority: null,
                value: "name:Savage@cat:roll@type:ability@cTypes:Action@cTraits:command@status:Hidden@tooltip:<h1>Savage</h1><p>When you <strong>Command</strong> a fightened target, gain <strong class='gold-bright'>+1d</strong> to your roll.</p>"
            }
        ],
        "Vigorous": [
            {
                key: "system.roll_mods",
                mode: 2,
                priority: null,
                value: "name:Vigorous@cat:roll@type:ability@cTypes:Downtime@aTypes:Incarceration@status:Hidden@tooltip:<h1>Vigorous</h1><p>You gain <strong class='gold-bright'>+1d</strong> to <strong>healing treatment</strong> rolls.</p>"
            }
        ],
        "Sharpshooter": [
            {
                key: "system.roll_mods",
                mode: 2,
                priority: null,
                value: "name:Extreme Range@cat:roll@type:ability@cTypes:Action@cTraits:hunt|finesse|prowl|skirmish|wreck@val:0@eKey:Is-Push|ForceOn-Push@sourceName:Sharpshooter@status:Hidden@tooltip:<h1>Sharpshooter — Extreme Range</h1><p>You can <strong>Push</strong> yourself to make a ranged attack at extreme distance, one that would otherwise be impossible with the rudimentary firearms of Duskwall.</p><p>You still gain <strong class='gold-bright'>+1d</strong> to your roll at the cost of <strong class='red-bright'>2 stress</strong>, as normal for a <strong>Push</strong>.</p>"
            },
            {
                key: "system.roll_mods",
                mode: 2,
                priority: null,
                value: "name:Extreme Range@cat:effect@type:ability@cTypes:Action@cTraits:hunt|finesse|prowl|skirmish|wreck@val:0@eKey:Is-Push|ForceOn-Push@sourceName:Sharpshooter@status:Hidden@tooltip:<h1>Sharpshooter — Extreme Range</h1><p>You can <strong>Push</strong> yourself to make a ranged attack at extreme distance, one that would otherwise be impossible with the rudimentary firearms of Duskwall.</p><p>You still gain <strong class='gold-bright'>+1 effect</strong> at the cost of <strong class='red-bright'>2 stress</strong>, as normal for a <strong>Push</strong>.</p>"
            },
            {
                key: "system.roll_mods",
                mode: 2,
                priority: null,
                value: "name:Suppression Fire@cat:roll@type:ability@cTypes:Action@cTraits:hunt|finesse|prowl|skirmish|wreck@val:0@eKey:Is-Push|ForceOn-Push@sourceName:Sharpshooter@status:Hidden@tooltip:<h1>Sharpshooter — Suppression Fire</h1><p>You can <strong>Push</strong> yourself to maintain a steady rate of suppression fire during a battle, enough to suppress a small gang of up to six members. <em>(When an enemy is suppressed, they're reluctant to maneuver or attack, usually calling for a <strong>fortune</strong> roll to see if they can manage it.)</em></p><p>You still gain <strong class='gold-bright'>+1d</strong> to your roll at the cost of <strong class='red-bright'>2 stress</strong>, as normal for a <strong>Push</strong>.</p>"
            },
            {
                key: "system.roll_mods",
                mode: 2,
                priority: null,
                value: "name:Suppression Fire@cat:effect@type:ability@cTypes:Action@cTraits:hunt|finesse|prowl|skirmish|wreck@val:0@eKey:Is-Push|ForceOn-Push@sourceName:Sharpshooter@status:Hidden@tooltip:<h1>Sharpshooter — Suppression Fire</h1><p>You can <strong>Push</strong> yourself to maintain a steady rate of suppression fire during a battle, enough to suppress a small gang of up to six members. <em>When an enemy is suppressed, they're reluctant to maneuver or attack, usually calling for a <strong>fortune</strong> roll to see if they can manage it.</em></p><p>You still gain <strong class='gold-bright'>+1 effect</strong> at the cost of <strong class='red-bright'>2 stress</strong>, as normal for a <strong>Push</strong>.</p>"
            }
        ],
        "Focused": [
            {
                key: "system.roll_mods",
                mode: 2,
                priority: null,
                value: "name:Focused@cat:roll@type:ability@cTypes:Resistance@cTraits:Insight|Resolve@val:0@eKey:Cost-SpecialArmor|Negate-Consequence@status:Hidden@tooltip:<h1>Focused</h1><p>You may expend your <strong class='cyan-bright'>special armor</strong> to completely negate a <strong>consequence</strong> of <strong class='red-bright'>surprise</strong> or <strong class='red-bright'>mental harm</strong>.</p>"
            },
            {
                key: "system.roll_mods",
                mode: 2,
                priority: null,
                value: "name:Focused@cat:after@type:ability@cTypes:Action@cTraits:hunt|study|survey|finesse|prowl|skirmish|wreck@eKey:Negate-PushCost|Cost-SpecialArmor@status:Hidden@tooltip:<h1>Focused</h1><p>You may expend your <strong class='cyan-bright'>special armor</strong> instead of paying <strong class='red-bright'>2 stress</strong> to <strong>Push</strong> yourself for ranged combat or tracking.</p>"
            }
        ],
        "Ghost Hunter (Arrow-Swift)": [
            {
                key: "system.roll_mods",
                mode: 2,
                priority: null,
                isCohort: true,
                value: "name:Ghost Hunter (Arrow-Swift)@cat:effect@type:ability@cTypes:Action@cTraits:quality@val:0@eKey:ForceOn-Potency@status:Hidden@tooltip:<h1>Ghost Hunter (Arrow-Swift)</h1><p>This cohort is <strong class='cyan-bright'>imbued</strong> with spirit energy, granting it <strong class='gold-bright'>Potency</strong> against the supernatural.</p>"
            }
        ],
        "Ghost Hunter (Ghost Form)": [
            {
                key: "system.roll_mods",
                mode: 2,
                priority: null,
                isCohort: true,
                value: "name:Ghost Hunter (Ghost Form)@cat:effect@type:ability@cTypes:Action@cTraits:quality@val:0@eKey:ForceOn-Potency@status:Hidden@tooltip:<h1>Ghost Hunter (Ghost Form)</h1><p>This cohort is <strong class='cyan-bright'>imbued</strong> with spirit energy, granting it <strong class='gold-bright'>Potency</strong> against the supernatural.</p>"
            }
        ],
        "Ghost Hunter (Mind Link)": [
            {
                key: "system.roll_mods",
                mode: 2,
                priority: null,
                isCohort: true,
                value: "name:Ghost Hunter (Mind Link)@cat:effect@type:ability@cTypes:Action@cTraits:quality@val:0@eKey:ForceOn-Potency@status:Hidden@tooltip:<h1>Ghost Hunter (Mind Link)</h1><p>This cohort is <strong class='cyan-bright'>imbued</strong> with spirit energy, granting it <strong class='gold-bright'>Potency</strong> against the supernatural.</p>"
            }
        ],
        "Scout": [
            {
                key: "system.roll_mods",
                mode: 2,
                priority: null,
                value: "name:Scout@cat:effect@type:ability@cTypes:Action|Downtime|Clock@cTraits:hunt|study|survey|attune|consort|sway@status:Hidden@tooltip:<h1>Scout</h1><p>When you <strong>gather information</strong> to discover the location of a target <em>(a person, a destination, a good ambush spot, etc)</em>, you gain <strong class='gold-bright'>+1 effect</strong>.</p>"
            },
            {
                key: "system.roll_mods",
                mode: 2,
                priority: null,
                value: "name:Scout@cat:roll@type:ability@cTypes:Action@cTraits:hunt|finesse|prowl@status:Hidden@tooltip:<h1>Scout</h1><p>When you hide in a prepared position or use camouflage, you get <strong class='gold-bright'>+1d</strong> to rolls to avoid detection.</p>"
            }
        ],
        "Alchemist": [
            {
                key: "system.roll_mods",
                mode: 2,
                priority: null,
                value: "name:Alchemist@cat:result@type:ability@cTypes:Downtime|GatherInfo|Craft@status:Hidden@tooltip:<h1>Alchemist</h1><p>When you <strong>invent</strong> or <strong>craft</strong> a creation with <em>alchemical</em> features, you gain <strong class='gold-bright'>+1 result level</strong> to your roll.</p>"
            }
        ],
        "Artificer": [
            {
                key: "system.roll_mods",
                mode: 2,
                priority: null,
                value: "name:Artificer@cat:result@type:ability@cTypes:Downtime|GatherInfo|Craft@cTraits:study|tinker@status:Hidden@tooltip:<h1>Artificer</h1><p>When you <strong>invent</strong> or <strong>craft</strong> a creation with <em>spark-craft</em> features, you gain <strong class='gold-bright'>+1 result level</strong> to your roll.</p>"
            }
        ],
        "Fortitude": [
            {
                key: "system.roll_mods",
                mode: 2,
                priority: null,
                value: "name:Fortitude@cat:roll@type:ability@cTypes:Resistance@val:0@eKey:Cost-SpecialArmor|Negate-Consequence@status:Hidden@tooltip:<h1>Fortitude</h1><p>You may expend your <strong class='cyan-bright'>special armor</strong> to completely negate a <strong>consequence</strong> of <strong class='red-bright'>fatigue</strong>, <strong class='red-bright'>weakness</strong>, or <strong class='red-bright'>chemical effects</strong>.</p>"
            },
            {
                key: "system.roll_mods",
                mode: 2,
                priority: null,
                value: "name:Fortitude@cat:after@type:ability@cTypes:Action@cTraits:study|survey|tinker|finesse|skirmish|wreck@eKey:Negate-PushCost|Cost-SpecialArmor@status:Hidden@tooltip:<h1>Fortitude</h1><p>You may expend your <strong class='cyan-bright'>special armor</strong> instead of paying <strong class='red-bright'>2 stress</strong> to <strong>Push</strong> yourself when working with technical skill or handling alchemicals.</p>"
            }
        ],
        "Ghost Ward": [
            {
                key: "system.roll_mods",
                mode: 2,
                priority: null,
                value: "name:Ghost Ward@cat:after@type:ability@cTypes:Action@cTraits:wreck@val:0@status:Hidden@tooltip:<h1>Ghost Ward</h1><p>When you <strong>Wreck</strong> an area with <em>arcane</em> substances, ruining it for any other use, it becomes <strong class='cyan-bright'>anathema</strong> or <strong class='cyan-bright'>enticing</strong> to spirits (your choice).</p>"
            }
        ],
        "Physicker": [
            {
                key: "system.roll_mods",
                mode: 2,
                priority: null,
                isMember: true,
                value: "name:Physicker@cat:roll@type:ability@cTypes:Downtime@aTypes:Incarceration@status:Hidden@tooltip:<h1>Physicker</h1><p>You gain <strong class='gold-bright'>+1d</strong> to your <strong>healing treatment</strong> rolls.</p>"
            }
        ],
        "Saboteur": [
            {
                key: "system.roll_mods",
                mode: 2,
                priority: null,
                value: "name:Saboteur@cat:after@type:ability@cTypes:Action|Downtime|Clock@aTraits:wreck@val:0@status:Hidden@tooltip:<h1>Saboteur</h1><p>When you <strong>Wreck</strong>, your work is much quieter than it should be and the damage is very well-hidden from casual inspection.</p>"
            }
        ],
        "Venomous": [
            {
                key: "system.roll_mods",
                mode: 2,
                priority: null,
                value: "name:Venomous@cat:roll@type:ability@cTypes:Action@val:0@eKey:Is-Push|ForceOn-Push@status:Hidden@tooltip:<h1>Venomous</h1><p>You can <strong>Push</strong> yourself to secrete your chosen drug or poison through your skin or saliva, or exhale it as a vapor.</p><p>You still gain <strong class='gold-bright'>+1d</strong> to your roll at the cost of <strong class='red-bright'>2 stress</strong>, as normal for a <strong>Push</strong>.</p>"
            },
            {
                key: "system.roll_mods",
                mode: 2,
                priority: null,
                value: "name:Venomous@cat:effect@type:ability@cTypes:Action@val:0@eKey:Is-Push|ForceOn-Push@status:Hidden@tooltip:<h1>Venomous</h1><p>You can <strong>Push</strong> yourself to secrete your chosen drug or poison through your skin or saliva, or exhale it as a vapor.</p><p>You still gain <strong class='gold-bright'>+1 effect</strong> at the cost of <strong class='red-bright'>2 stress</strong>, as normal for a <strong>Push</strong>.</p>"
            }
        ],
        "Infiltrator": [
            {
                key: "system.roll_mods",
                mode: 2,
                priority: null,
                value: "name:Infiltrator@cat:effect@type:ability@cTypes:Action|Downtime|Clock@cTraits:tinker|finesse|wreck|attune@val:0@eKey:Negate-QualityPenalty|Negate-TierPenalty@status:Hidden@tooltip:<h1>Infiltrator</h1><p>You are not affected by low <strong class='red-bright'>Quality</strong> or <strong class='red-bright'>Tier</strong> when you bypass security measures.</p>"
            }
        ],
        "Ambush": [
            {
                key: "system.roll_mods",
                mode: 2,
                priority: null,
                value: "name:Ambush@cat:roll@type:ability@cTypes:Action@cTraits:hunt|finesse|prowl|skirmish|wreck|attune@status:Hidden@tooltip:<h1>Ambush</h1><p>When you attack from hiding or spring a trap, you get <strong class='gold-bright'>+1d</strong> to your roll.</p>"
            }
        ],
        "Daredevil": [
            {
                key: "system.roll_mods",
                mode: 2,
                priority: null,
                value: "name:Daredevil@cat:roll@type:ability@eKey:AutoRevealOn-Desperate|ForceOn-(Daredevil),after@status:ToggledOff@tooltip:<h1>Daredevil</h1><p>When you make a <strong class='red-bright'>desperate</strong> <strong>action</strong> roll, you may gain <strong class='gold-bright'>+1d</strong> to your roll, if you also take <strong class='red-bright'>−1d</strong> to <strong>resistance</strong> rolls against any consequences.</p>"
            },
            {
                key: "system.roll_mods",
                mode: 2,
                priority: null,
                value: "name:Daredevil@cat:roll@posNeg:negative@type:ability@cTypes:Resistance@status:Hidden@tooltip:<h1 class='red-bright'>Daredevil</h1><p>By choosing to gain <strong>+1d</strong> to your <strong class='red-bright'>desperate</strong> <strong>action</strong> roll, you suffer <strong class='red-bright'>−1d</strong> to <strong>resistance</strong> rolls against the consequences of that action.</p>"
            },
            {
                key: "system.roll_mods",
                mode: 2,
                priority: null,
                value: "name:(Daredevil)@cat:after@posNeg:negative@type:ability@val:0@sourceName:Daredevil@status:Hidden@tooltip:<h1 class='red-bright'>Daredevil</h1><p>You will suffer <strong class='red-bright'>−1d</strong> to <strong>resistance</strong> rolls against any consequences of this <strong>action</strong> roll.</p>"
            }
        ],
        "The Devil's Footsteps": [
            {
                key: "system.roll_mods",
                mode: 2,
                priority: null,
                value: "name:Superhuman Feat@cat:roll@type:ability@val:0@eKey:Is-Push|ForceOn-Push@sourceName:The Devil's Footsteps@status:ToggledOff@tooltip:<h1>The Devil's Footsteps — Superhuman Feat</h1><p>You can <strong>Push</strong> yourself to perform a feat of physical force that verges on the superhuman <em>(you might climb a sheer surface that lacks good hand-holds, tumble safely out of a three-story fall, leap a shocking distance, etc.)</em>.</p><p>You still gain <strong class='gold-bright'>+1d</strong> to your roll at the cost of <strong class='red-bright'>2 stress</strong>, as normal for a <strong>Push</strong>.</p>"
            },
            {
                key: "system.roll_mods",
                mode: 2,
                priority: null,
                value: "name:Superhuman Feat@cat:effect@type:ability@val:0@eKey:Is-Push|ForceOn-Push@sourceName:The Devil's Footsteps@status:ToggledOff@tooltip:<h1>The Devil's Footsteps — Superhuman Feat</h1><p>You can <strong>Push</strong> yourself to perform a feat of physical force that verges on the superhuman <em>(you might climb a sheer surface that lacks good hand-holds, tumble safely out of a three-story fall, leap a shocking distance, etc.)</em>.</p><p>You still gain <strong class='gold-bright'>+1 effect</strong> at the cost of <strong class='red-bright'>2 stress</strong>, as normal for a <strong>Push</strong>.</p>"
            },
            {
                key: "system.roll_mods",
                mode: 2,
                priority: null,
                value: "name:Sow Confusion@cat:roll@type:ability@val:0@eKey:Is-Push|ForceOn-Push@sourceName:The Devil's Footsteps@status:ToggledOff@tooltip:<h1>The Devil's Footsteps — Sow Confusion</h1><p>You can <strong>Push</strong> yourself to maneuver to confuse your enemies so they mistakenly attack each other. <em>(They attack each other for a moment before they realize their mistake. The GM might make a <strong>fortune</strong> roll to see how badly they harm or interfere with each other.)</em>.</p><p>You still gain <strong class='gold-bright'>+1d</strong> to your roll at the cost of <strong class='red-bright'>2 stress</strong>, as normal for a <strong>Push</strong>.</p>"
            },
            {
                key: "system.roll_mods",
                mode: 2,
                priority: null,
                value: "name:Sow Confusion@cat:effect@type:ability@val:0@eKey:Is-Push|ForceOn-Push@sourceName:The Devil's Footsteps@status:ToggledOff@tooltip:<h1>The Devil's Footsteps — Sow Confusion</h1><p>You can <strong>Push</strong> yourself to maneuver to confuse your enemies so they mistakenly attack each other. <em>(They attack each other for a moment before they realize their mistake. The GM might make a <strong>fortune</strong> roll to see how badly they harm or interfere with each other.)</em>.</p><p>You still gain <strong class='gold-bright'>+1 effect</strong> at the cost of <strong class='red-bright'>2 stress</strong>, as normal for a <strong>Push</strong>.</p>"
            }
        ],
        "Shadow": [
            {
                key: "system.roll_mods",
                mode: 2,
                priority: null,
                value: "name:Shadow@cat:after@type:ability@cTypes:Action@cTraits:hunt|study|survey|tinker|finesse|prowl|skirmish|wreck@eKey:Negate-PushCost|Cost-SpecialArmor@status:Hidden@tooltip:<h1>Shadow</h1><p>You may expend your <strong class='cyan-bright'>special armor</strong> instead of paying <strong class='red-bright'>2 stress</strong> to <strong>Push</strong> yourself for a feat of athletics or stealth.</p>"
            },
            {
                key: "system.roll_mods",
                mode: 2,
                priority: null,
                value: "name:Shadow@cat:roll@type:ability@cTypes:Resistance@val:0@eKey:Cost-SpecialArmor|Negate-HarmLevel@status:Hidden@tooltip:<h1>Shadow</h1><p>You may expend your <strong class='cyan-bright'>special armor</strong> to completely negate a <strong>consequence</strong> of <strong class='red-bright'>detection</strong> or <strong class='red-bright'>security measures</strong>.</p>"
            }
        ],
        "Rook's Gambit": [
            {
                key: "system.roll_mods",
                mode: 2,
                priority: null,
                value: "name:Rook's Gambit@cat:roll@type:ability@cTypes:Action|Downtime|GatherInfo|Craft|Acquire|Clock@val:0@eKey:ForceOn-BestAction|Cost-Stress2@status:Hidden@tooltip:<h1>Rook's Gambit</h1><p>Take <strong class='red-bright'>2 stress</strong> to roll your <strong class='gold-bright'>best action rating</strong> while performing a different action.</p><p><em>(Describe how you adapt your skill to this use.)</em></p>"
            }
        ],
        "Cloak & Dagger": [
            {
                key: "system.roll_mods",
                mode: 2,
                priority: null,
                value: "name:Cloak & Dagger@cat:roll@type:ability@cTypes:Action|Resistance@cTraits:finesse|prowl|attune|command|consort|sway|Insight@status:Hidden@tooltip:<h1>Cloak & Dagger</h1><p>When you use a disguise or other form of covert misdirection, you get <strong class='gold-bright'>+1d</strong> to rolls to confuse or deflect suspicion.</p>"
            }
        ],
        "Ghost Voice": [
            {
                key: "system.roll_mods",
                mode: 2,
                priority: null,
                value: "name:Ghost Voice@cat:effect@type:ability@cTypes:Action|Downtime|Clock@cTraits:attune|command|consort|sway@val:0@eKey:ForceOn-Potency@status:Hidden@tooltip:<h1>Ghost Voice</h1><p>You gain <strong class='gold-bright'>Potency</strong> when communicating with the supernatural.</p>"
            }
        ],
        "Mesmerism": [
            {
                key: "system.roll_mods",
                mode: 2,
                priority: null,
                value: "name:Mesmerism@cat:after@type:ability@cTypes:Action@cTraits:sway@val:0@status:Hidden@tooltip:<h1>Mesmerism</h1><p>When you <strong>Sway</strong> someone, you may cause them to forget that it's happened until they next interact with you.</p>"
            }
        ],
        "Subterfuge": [
            {
                key: "system.roll_mods",
                mode: 2,
                priority: null,
                value: "name:Subterfuge@cat:roll@type:ability@cTypes:Resistance@cTraits:Insight@val:0@eKey:Cost-SpecialArmor|Negate-Consequence@status:Hidden@tooltip:<h1>Subterfuge</h1><p>You may expend your <strong class='cyan-bright'>special armor</strong> to completely negate a <strong>consequence</strong> of <strong class='red-bright'>suspicion</strong> or <strong class='red-bright'>persuasion</strong>.</p>"
            },
            {
                key: "system.roll_mods",
                mode: 2,
                priority: null,
                value: "name:Subterfuge@cat:after@type:ability@cTypes:Action@cTraits:finesse|attune|consort|sway@eKey:Negate-PushCost|Cost-SpecialArmor@status:Hidden@tooltip:<h1>Subterfuge</h1><p>You may expend your <strong class='cyan-bright'>special armor</strong> instead of paying <strong class='red-bright'>2 stress</strong> to <strong>Push</strong> yourself for subterfuge.</p>"
            }
        ],
        "Trust in Me": [
            {
                key: "system.roll_mods",
                mode: 2,
                priority: null,
                value: "name:Trust in Me@cat:roll@type:ability@cTypes:Action|Downtime|Clock@cTraits:hunt|study|survey|tinker|finesse|prowl|skirmish|wreck|attune|command|consort|sway|Insight|Prowess|Resolve|tier|quality|magnitude|number@status:Hidden@tooltip:<h1>Trust in Me</h1><p>You gain <strong class='gold-bright'>+1d</strong> to rolls opposed by a target with whom you have an intimate relationship.</p>"
            }
        ],
        "Connected": [
            {
                key: "system.roll_mods",
                mode: 2,
                priority: null,
                value: "name:Connected@cat:result@type:ability@cTypes:Downtime@aTypes:Heat|Acquire@status:Hidden@tooltip:<h1>Connected</h1><p>When you <strong>acquire an asset</strong> or <strong>reduce heat</strong>, you get <strong class='gold-bright'>+1 result level</strong>.</p>"
            }
        ],
        "Jail Bird": [
            {
                key: "system.roll_mods",
                mode: 2,
                priority: null,
                value: "name:Jail Bird@cat:effect@type:ability@cTypes:Downtime@eKey:Increase-Tier1@status:Hidden@tooltip:<h1>Jail Bird</h1><p>You gain <strong class='gold-bright'>+1 Tier</strong> while <strong class='cyan-bright'>incarcerated</strong>.</p>"
            }
        ],
        "Mastermind": [
            {
                key: "system.roll_mods",
                mode: 2,
                priority: null,
                value: "name:Mastermind@cat:after@type:ability@cTypes:Action|Downtime|GatherInfo|Craft|Clock@eKey:Negate-PushCost|Cost-SpecialArmor@status:Hidden@tooltip:<h1>Mastermind</h1><p>You may expend your <strong class='cyan-bright'>special armor</strong> instead of paying <strong class='red-bright'>2 stress</strong> to <strong>Push</strong> yourself when you <strong>gather information</strong> or work on a <strong>long-term project</strong>.</p>"
            }
        ],
        "Weaving the Web": [
            {
                key: "system.roll_mods",
                mode: 2,
                priority: null,
                value: "name:Weaving the Web@cat:roll@type:ability@cTypes:Action|Downtime|Clock@cTraits:consort@status:Hidden@tooltip:<h1>Weaving the Web</h1><p>You gain <strong class='gold-bright'>+1d</strong> to <strong>Consort</strong> when you <strong>gather information</strong> on a target for a <strong>score</strong>.</p>"
            },
            {
                key: "system.roll_mods",
                mode: 2,
                priority: null,
                value: "name:Weaving the Web@cat:roll@type:ability@cTypes:Healing@status:Hidden@tooltip:<h1>Weaving the Web</h1><p>You gain <strong class='gold-bright'>+1d</strong> to the <strong>engagement roll</strong> for the targeted <strong>score</strong>.</p>"
            }
        ],
        "Ghost Mind": [
            {
                key: "system.roll_mods",
                mode: 2,
                priority: null,
                value: "name:Ghost Mind@cat:roll@type:ability@cTypes:Action|Downtime|Clock@cTraits:hunt|study|survey|tinker|prowl|attune|command|consort|sway@status:Hidden@tooltip:<h1>Ghost Mind</h1><p>You gain <strong class='gold-bright'>+1d</strong> to rolls to <strong>gather information</strong> about the supernatural by any means.</p>"
            }
        ],
        "Iron Will": [
            {
                key: "system.roll_mods",
                mode: 2,
                priority: null,
                value: "name:Iron Will@cat:roll@type:ability@cTypes:Resistance@aTraits:Resolve@status:Hidden@tooltip:<h1>Iron Will</h1><p>You gain <strong class='gold-bright'>+1d</strong> to <strong>Resolve resistance</strong> rolls.</p>"
            }
        ],
        "Occultist": [
            {
                key: "system.roll_mods",
                mode: 2,
                priority: null,
                value: "name:Occultist@cat:roll@type:ability@cTypes:Action|Downtime|Clock@cTraits:command@status:Hidden@tooltip:<h1>Occultist</h1><p>You gain <strong class='gold-bright'>+1d</strong> to rolls to <strong>Command</strong> cultists following ancient powers, forgotten gods or demons with whom you have previously <strong>Consort</strong>ed</p>"
            }
        ],
        "Strange Methods": [
            {
                key: "system.roll_mods",
                mode: 2,
                priority: null,
                value: "name:Strange Methods@cat:result@type:ability@cTypes:Downtime|GatherInfo|Craft@status:Hidden@tooltip:<h1>Strange Methods</h1><p>When you <strong>invent</strong> or <strong>craft</strong> a creation with <em>arcane</em> features, you gain <strong class='gold-bright'>+1 result level</strong> to your roll.</p>"
            }
        ],
        "Tempest": [
            {
                key: "system.roll_mods",
                mode: 2,
                priority: null,
                value: "name:Throw Lightning@cat:roll@type:ability@cTypes:Action@val:0@eKey:Is-Push|ForceOn-Push@sourceName:Tempest@status:Hidden@tooltip:<h1>Tempest — Throw Lightning</h1><p>You can <strong>Push</strong> yourself to unleash a stroke of lightning as a weapon. The GM will describe its <strong>effect level</strong> and significant collateral damage.</p><p>If you unleash it in combat against an enemy who's threatening you, you'll still make an <strong>action</strong> roll in the fight (usually with <strong>Attune</strong>).</p><p>You still gain <strong class='gold-bright'>+1d</strong> to your roll at the cost of <strong class='red-bright'>2 stress</strong>, as normal for a <strong>Push</strong>.</p>"
            },
            {
                key: "system.roll_mods",
                mode: 2,
                priority: null,
                value: "name:Throw Lightning@cat:effect@type:ability@cTypes:Action@val:0@eKey:Is-Push|ForceOn-Push@sourceName:Tempest@status:Hidden@tooltip:<h1>Tempest — Throw Lightning</h1><p>You can <strong>Push</strong> yourself to unleash a stroke of lightning as a weapon. The GM will describe its <strong>effect level</strong> and significant collateral damage.</p><p>If you unleash it in combat against an enemy who's threatening you, you'll still make an <strong>action</strong> roll in the fight (usually with <strong>Attune</strong>).</p><p>You still gain <strong class='gold-bright'>+1 effect</strong> at the cost of <strong class='red-bright'>2 stress</strong>, as normal for a <strong>Push</strong>.</p>"
            },
            {
                key: "system.roll_mods",
                mode: 2,
                priority: null,
                value: "name:Summon Storm@cat:roll@type:ability@cTypes:Action@val:0@eKey:Is-Push|ForceOn-Push@sourceName:Tempest@status:Hidden@tooltip:<h1>Tempest — Summon Storm</h1><p>You can <strong>Push</strong> yourself to summon a storm in your immediate vicinity <em>(torrential rain, roaring winds, heavy fog, chilling frost and snow, etc.)</em>. The GM will describe its <strong>effect level</strong>.</p><p>If you're using this power as cover or distraction, it's probably a <strong>Setup teamwork</strong> maneuver, using <strong>Attune</strong>.</p><p>You still gain <strong class='gold-bright'>+1d</strong> to your roll at the cost of <strong class='red-bright'>2 stress</strong>, as normal for a <strong>Push</strong>.</p>"
            },
            {
                key: "system.roll_mods",
                mode: 2,
                priority: null,
                value: "name:Summon Storm@cat:effect@type:ability@cTypes:Action@val:0@eKey:Is-Push|ForceOn-Push@sourceName:Tempest@status:Hidden@tooltip:<h1>Tempest — Summon Storm</h1><p>You can <strong>Push</strong> yourself to summon a storm in your immediate vicinity <em>(torrential rain, roaring winds, heavy fog, chilling frost and snow, etc.)</em>. The GM will describe its <strong>effect level</strong>.</p><p>If you're using this power as cover or distraction, it's probably a <strong>Setup teamwork</strong> maneuver, using <strong>Attune</strong>.</p><p>You still gain <strong class='gold-bright'>+1 effect</strong> at the cost of <strong class='red-bright'>2 stress</strong>, as normal for a <strong>Push</strong>.</p>"
            }
        ],
        "Warded": [
            {
                key: "system.roll_mods",
                mode: 2,
                priority: null,
                value: "name:Warded@cat:roll@type:ability@cTypes:Resistance@val:0@eKey:Cost-SpecialArmor|Negate-Consequence@status:Hidden@tooltip:<h1>Warded</h1><p>You may expend your <strong class='cyan-bright'>special armor</strong> to completely negate a <strong>consequence</strong> of <strong class='red-bright'>supernatural</strong> origin.</p>"
            },
            {
                key: "system.roll_mods",
                mode: 2,
                priority: null,
                value: "name:Warded@cat:after@type:ability@cTypes:Action@eKey:Negate-PushCost|Cost-SpecialArmor@status:Hidden@tooltip:<h1>Warded</h1><p>You may expend your <strong class='cyan-bright'>special armor</strong> instead of paying <strong class='red-bright'>2 stress</strong> to <strong>Push</strong> yourself when you contend with or employ <em>arcane</em> forces.</p>"
            }
        ]
    },
    [BladesItemType.crew_ability]: {
        "Predators": [
            {
                key: "system.roll_mods",
                mode: 2,
                priority: null,
                value: "name:Predators@cat:roll@type:crew_ability@cTypes:Healing@val@status:Hidden@tooltip:<h1>Predators</h1><p>When you use a <strong><em>stealth</em></strong> or <strong><em>deception</em> plan</strong> to commit murder, take <strong class='gold-bright'>+1d</strong> to the <strong>engagement</strong> roll.</p>"
            }
        ],
        "Vipers": [
            {
                key: "system.roll_mods",
                mode: 2,
                priority: null,
                isMember: true,
                value: "name:Vipers (Crew Ability)@cat:result@type:crew_ability@cTypes:GatherInfo|Craft|Acquire@val@sourceName:Vipers@status:Hidden@tooltip:<h1>Vipers (Crew Ability)</h1><p>When you <strong>acquire</strong> or <strong>craft</strong> poisons, you get <strong class='gold-bright'>+1 result level</strong> to your roll.</p>"
            }
        ],
        "Blood Brothers": [
            {
                key: "system.roll_mods",
                mode: 2,
                priority: null,
                isCohort: true,
                value: "name:Blood Brothers (Crew Ability)@cat:roll@type:crew_ability@cTypes:Action@cTraits:hunt|finesse|prowl|skirmish|wreck|attune|command@val@sourceName:Blood Brothers@status:Hidden@tooltip:<h1>Blood Brothers (Crew Ability)</h1><p>When fighting alongside crew members in combat, gain <strong class='gold-bright'>+1d</strong> for <strong>assist</strong>, <strong>setup</strong> and <strong>group teamwork actions</strong>.</p>"
            }
        ],
        "Door Kickers": [
            {
                key: "system.roll_mods",
                mode: 2,
                priority: null,
                value: "name:Door Kickers@cat:roll@type:crew_ability@cTypes:Healing@val@status:Hidden@tooltip:<h1>Door Kickers</h1><p>When you use an <strong><em>assault</em> plan</strong>, take <strong class='gold-bright'>+1d</strong> to the <strong>engagement</strong> roll.</p>"
            }
        ],
        "Anointed": [
            {
                key: "system.roll_mods",
                mode: 2,
                priority: null,
                isMember: true,
                value: "name:Anointed (Crew Ability)@cat:roll@type:crew_ability@cTypes:Resistance@val@sourceName:Anointed@status:Hidden@tooltip:<h1>Anointed (Crew Ability)</h1><p>Gain <strong class='gold-bright'>+1d</strong> to <strong>resistance</strong> rolls against supernatural threats.</p>"
            },
            {
                key: "system.roll_mods",
                mode: 2,
                priority: null,
                isMember: true,
                value: "name:Anointed (Crew Ability) (Crew Ability)@cat:roll@type:crew_ability@cTypes:Incarceration@val@sourceName:Anointed@status:Hidden@tooltip:<h1>Anointed (Crew Ability) (Crew Ability)</h1><p>Gain <strong class='gold-bright'>+1d</strong> to <strong>healing treatment</strong> rolls when you have supernatural <strong class='red-bright'>harm</strong>.</p>"
            }
        ],
        "Conviction": [
            {
                key: "system.roll_mods",
                mode: 2,
                priority: null,
                isMember: true,
                value: "name:Conviction (Crew Ability)@cat:roll@type:crew_ability@cTypes:Action@val@sourceName:Conviction@status:Hidden@tooltip:<h1>Conviction (Crew Ability)</h1><p>You may call upon your deity to <strong>assist</strong> any one <strong>action</strong> roll you make.</p><p>You cannot use this ability again until you indulge your <strong><em>Worship</em></strong> vice.</p>"
            }
        ],
        "Zealotry": [
            {
                key: "system.roll_mods",
                mode: 2,
                priority: null,
                isCohort: true,
                value: "name:Zealotry (Crew Ability)@cat:roll@type:crew_ability@cTypes:Action|Downtime@val@sourceName:Zealotry@status:Hidden@tooltip:<h1>Zealotry (Crew Ability)</h1><p>Gain <strong class='gold-bright'>+1d</strong> when acting against enemies of the faith.</p>"
            }
        ],
        "The Good Stuff": [
            {
                key: "system.roll_mods",
                mode: 2,
                priority: null,
                isMember: true,
                value: "name:The Good Stuff (Crew Ability)@cat:effect@type:crew_ability@cTypes:Action|Downtime@val:0@eKey:Increase-Quality2@sourceName:The Good Stuff@status:Hidden@tooltip:<h1>The Good Stuff (Crew Ability)</h1><p>The quality of your product is equal to your <strong class='gold-bright'>Tier +2</strong>.</p>"
            }
        ],
        "High Society": [
            {
                key: "system.roll_mods",
                mode: 2,
                priority: null,
                isMember: true,
                value: "name:High Society (Crew Ability)@cat:roll@type:crew_ability@cTypes:Engagement@val@sourceName:High Society@status:Hidden@tooltip:<h1>High Society (Crew Ability)</h1><p>Gain <strong class='gold-bright'>+1d</strong> to <strong>gather information</strong> about the city's elite.</p>"
            }
        ],
        "Pack Rats": [
            {
                key: "system.roll_mods",
                mode: 2,
                priority: null,
                isMember: true,
                value: "name:Pack Rats (Crew Ability)@cat:roll@type:crew_ability@aTypes:Acquire@val@sourceName:Pack Rats@status:Hidden@tooltip:<h1>Pack Rats (Crew Ability)</h1><p>Gain <strong class='gold-bright'>+1d</strong> to <strong>acquire an asset</strong>.</p>"
            }
        ],
        "Second Story": [
            {
                key: "system.roll_mods",
                mode: 2,
                priority: null,
                value: "name:Second Story@cat:roll@type:crew_ability@cTypes:Healing@val@status:Hidden@tooltip:<h1>Second Story</h1><p>When you execute a <strong>clandestine infiltration plan</strong>, gain <strong class='gold-bright'>+1d</strong> to the <strong>engagement</strong> roll.</p>"
            }
        ],
        "Slippery": [
            {
                key: "system.roll_mods",
                mode: 2,
                priority: null,
                isMember: true,
                value: "name:Slippery (Crew Ability)@cat:roll@type:crew_ability@aTypes:Heat@val@sourceName:Slippery@status:Hidden@tooltip:<h1>Slippery (Crew Ability)</h1><p>Gain <strong class='gold-bright'>+1d</strong> to <strong>reduce heat</strong> rolls.</p>"
            }
        ],
        "Synchronized": [
            {
                key: "system.roll_mods",
                mode: 2,
                priority: null,
                isMember: true,
                isCohort: true,
                value: "name:Synchronized (Crew Ability)@cat:after@type:crew_ability@cTypes:Action@val@sourceName:Synchronized@status:Hidden@tooltip:<h1>Synchronized (Crew Ability)</h1><p>When you perform a <strong>group teamwork action</strong>, you may count <strong class='cyan-bright'>multiple 6s from different rolls</strong> as a <strong class='gold-bright'>critical success</strong>.</p>"
            }
        ],
        "Just Passing Through": [
            {
                key: "system.roll_mods",
                mode: 2,
                priority: null,
                isMember: true,
                value: "name:Just Passing Through (Crew Ability)@cat:roll@type:crew_ability@cTypes:Action|Downtime@cTraits:finesse|prowl|consort|sway@val@sourceName:Just Passing Through@status:Hidden@tooltip:<h1>Just Passing Through (Crew Ability)</h1><p>When your <strong class='red-bright'>heat</strong> is <strong>4 or less</strong>, gain <strong class='gold-bright'>+1d</strong> to rolls to deceive people when you pass yourself off as ordinary citizens.</p>"
            }
        ],
        "Reavers": [
            {
                key: "system.roll_mods",
                mode: 2,
                priority: null,
                isMember: true,
                value: "name:Reavers (Crew Ability)@cat:effect@type:crew_ability@cTypes:Action@cTraits:hunt|finesse|prowl|skirmish|wreck@val@sourceName:Reavers@status:Hidden@tooltip:<h1>Reavers (Crew Ability)</h1><p>When you go into conflict aboard a <strong class='cyan-bright'>vehicle</strong>, gain <strong class='gold-bright'>+1 effect</strong> for vehicle damage and speed.</p>"
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
            isMember: true,
            value: "name:Ironhook Contacts@cat:roll@type:ability@cTypes:Downtime@eKey:Increase-Tier1@status:Conditional@tooltip:<h1>Ironhook Contacts</h1><p>Gain G>+1 Tier< while in prison, including the >incarceration< roll.</p>"
        }
    ]
};
export const ApplyRollEffects = async () => {
    Object.entries(RollCollabEffectChanges[BladesItemType.ability])
        .forEach(async ([aName, eData]) => {
        const abilityDoc = game.items.getName(aName);
        if (!abilityDoc) {
            eLog.error("applyRollEffects", `ApplyRollEffects: Ability ${aName} Not Found.`);
            return;
        }
        const abilityEffects = Array.from(abilityDoc.effects ?? []);
        const toMemberEffects = abilityEffects.filter((effect) => effect.changes.some((change) => change.key === "APPLYTOMEMBERS"));
        const toCohortEffects = abilityEffects.filter((effect) => effect.changes.some((change) => change.key === "APPLYTOCOHORTS"));
        const standardEffects = abilityEffects.filter((effect) => effect.changes.every((change) => !["APPLYTOMEMBERS", "APPLYTOCOHORTS"].includes(change.key)));
        const testChange = eData[0];
        if ((testChange.isMember && eData.some((change) => !change.isMember))
            || (!testChange.isMember && eData.some((change) => change.isMember))) {
            eLog.error("applyRollEffects", `ApplyRollEffects: Ability ${aName} has inconsistent 'isMember' entries.`);
            return;
        }
        if ((testChange.isCohort && eData.some((change) => !change.isCohort))
            || (!testChange.isCohort && eData.some((change) => change.isCohort))) {
            eLog.error("applyRollEffects", `ApplyRollEffects: Ability ${aName} has inconsistent 'isCohort' entries.`);
            return;
        }
        if (testChange.isMember) {
            if (toMemberEffects.length > 1) {
                eLog.error("applyRollEffects", `ApplyRollEffects: Ability ${aName} Has Multiple 'APPLYTOMEMBERS' Active Effects`);
                return;
            }
            const effectData = {
                name: aName,
                icon: abilityDoc.img ?? "",
                changes: eData.map((change) => {
                    delete change.isMember;
                    return change;
                })
            };
            if (toMemberEffects.length === 1) {
                const abilityEffect = toMemberEffects[0];
                effectData.name = abilityEffect.name ?? effectData.name;
                effectData.icon = abilityEffect.icon ?? effectData.icon;
                effectData.changes.unshift(...abilityEffect.changes.filter((change) => change.key !== "system.roll_mods"));
                await abilityEffect.delete();
            }
            else {
                effectData.changes.unshift({
                    key: "APPLYTOMEMBERS",
                    mode: 0,
                    priority: null,
                    value: `${aName.replace(/\s*\([^()]*? (Ability|Upgrade)\)\s*$/, "")} (Scoundrel Ability)`
                });
            }
            await abilityDoc.createEmbeddedDocuments("ActiveEffect", [effectData]);
        }
        else if (testChange.isCohort) {
            if (toCohortEffects.length > 1) {
                eLog.error("applyRollEffects", `ApplyRollEffects: Ability ${aName} Has Multiple 'APPLYTOCOHORTS' Active Effects`);
                return;
            }
            const effectData = {
                name: aName,
                icon: abilityDoc.img ?? "",
                changes: eData.map((change) => {
                    delete change.isCohort;
                    return change;
                })
            };
            if (toCohortEffects.length === 1) {
                const abilityEffect = toCohortEffects[0];
                effectData.name = abilityEffect.name ?? effectData.name;
                effectData.icon = abilityEffect.icon ?? effectData.icon;
                effectData.changes.unshift(...abilityEffect.changes.filter((change) => change.key !== "system.roll_mods"));
                await abilityEffect.delete();
            }
            else {
                effectData.changes.unshift({
                    key: "APPLYTOCOHORTS",
                    mode: 0,
                    priority: null,
                    value: `${aName.replace(/\s*\([^()]*? (Ability|Upgrade)\)\s*$/, "")} (Scoundrel Ability)`
                });
            }
            await abilityDoc.createEmbeddedDocuments("ActiveEffect", [effectData]);
        }
        else {
            if (standardEffects.length > 1) {
                eLog.error("applyRollEffects", `ApplyRollEffects: Ability ${aName} Has Multiple Active Effects`);
                return;
            }
            const effectData = {
                name: aName,
                icon: abilityDoc.img ?? "",
                changes: eData
            };
            if (standardEffects.length === 1) {
                const abilityEffect = standardEffects[0];
                effectData.name = abilityEffect.name ?? effectData.name;
                effectData.icon = abilityEffect.icon ?? effectData.icon;
                effectData.changes.unshift(...abilityEffect.changes.filter((change) => change.key !== "system.roll_mods"));
                await abilityEffect.delete();
            }
            await abilityDoc.createEmbeddedDocuments("ActiveEffect", [effectData]);
        }
    });
    Object.entries(RollCollabEffectChanges[BladesItemType.crew_ability])
        .forEach(async ([aName, eData]) => {
        const crewAbilityDoc = game.items.getName(aName);
        if (!crewAbilityDoc) {
            eLog.error("applyRollEffects", `ApplyRollEffects: Crew Ability ${aName} Not Found.`);
            return;
        }
        const abilityEffects = Array.from(crewAbilityDoc.effects ?? []);
        const toMemberEffects = abilityEffects.filter((effect) => effect.changes.some((change) => change.key === "APPLYTOMEMBERS"));
        const toCohortEffects = abilityEffects.filter((effect) => effect.changes.some((change) => change.key === "APPLYTOCOHORTS"));
        const standardEffects = abilityEffects.filter((effect) => effect.changes.every((change) => !["APPLYTOMEMBERS", "APPLYTOCOHORTS"].includes(change.key)));
        const testChange = eData[0];
        if ((testChange.isMember && eData.some((change) => !change.isMember))
            || (!testChange.isMember && eData.some((change) => change.isMember))) {
            eLog.error("applyRollEffects", `ApplyRollEffects: Crew Ability ${aName} has inconsistent 'isMember' entries.`);
            return;
        }
        if ((testChange.isCohort && eData.some((change) => !change.isCohort))
            || (!testChange.isCohort && eData.some((change) => change.isCohort))) {
            eLog.error("applyRollEffects", `ApplyRollEffects: Crew Ability ${aName} has inconsistent 'isCohort' entries.`);
            return;
        }
        if (testChange.isMember) {
            if (toMemberEffects.length > 1) {
                eLog.error("applyRollEffects", `ApplyRollEffects: Crew Ability ${aName} Has Multiple 'APPLYTOMEMBERS' Active Effects`);
                return;
            }
            const effectData = {
                name: aName,
                icon: crewAbilityDoc.img ?? "",
                changes: eData.map((change) => {
                    delete change.isMember;
                    return change;
                })
            };
            if (toMemberEffects.length === 1) {
                const abilityEffect = toMemberEffects[0];
                effectData.name = abilityEffect.name ?? effectData.name;
                effectData.icon = abilityEffect.icon ?? effectData.icon;
                effectData.changes.unshift(...abilityEffect.changes.filter((change) => change.key !== "system.roll_mods"));
                await abilityEffect.delete();
            }
            else {
                effectData.changes.unshift({
                    key: "APPLYTOMEMBERS",
                    mode: 0,
                    priority: null,
                    value: `${aName.replace(/\s*\([^()]*? (Ability|Upgrade)\)\s*$/, "")} (Crew Ability)`
                });
            }
            await crewAbilityDoc.createEmbeddedDocuments("ActiveEffect", [effectData]);
        }
        else if (testChange.isCohort) {
            if (toCohortEffects.length > 1) {
                eLog.error("applyRollEffects", `ApplyRollEffects: Crew Ability ${aName} Has Multiple 'APPLYTOCOHORTS' Active Effects`);
                return;
            }
            const effectData = {
                name: aName,
                icon: crewAbilityDoc.img ?? "",
                changes: eData.map((change) => {
                    delete change.isCohort;
                    return change;
                })
            };
            if (toCohortEffects.length === 1) {
                const abilityEffect = toCohortEffects[0];
                effectData.name = abilityEffect.name ?? effectData.name;
                effectData.icon = abilityEffect.icon ?? effectData.icon;
                effectData.changes.unshift(...abilityEffect.changes.filter((change) => change.key !== "system.roll_mods"));
                await abilityEffect.delete();
            }
            else {
                effectData.changes.unshift({
                    key: "APPLYTOCOHORTS",
                    mode: 0,
                    priority: null,
                    value: `${aName.replace(/\s*\([^()]*? (Ability|Upgrade)\)\s*$/, "")} (Crew Ability)`
                });
            }
            await crewAbilityDoc.createEmbeddedDocuments("ActiveEffect", [effectData]);
        }
        else {
            if (standardEffects.length > 1) {
                eLog.error("applyRollEffects", `ApplyRollEffects: Crew Ability ${aName} Has Multiple Active Effects`);
                return;
            }
            const effectData = {
                name: aName,
                icon: crewAbilityDoc.img ?? "",
                changes: eData
            };
            if (standardEffects.length === 1) {
                const abilityEffect = standardEffects[0];
                effectData.name = abilityEffect.name ?? effectData.name;
                effectData.icon = abilityEffect.icon ?? effectData.icon;
                effectData.changes.unshift(...abilityEffect.changes.filter((change) => change.key !== "system.roll_mods"));
                await abilityEffect.delete();
            }
            await crewAbilityDoc.createEmbeddedDocuments("ActiveEffect", [effectData]);
        }
    });
    Object.entries(RollCollabEffectChanges[BladesItemType.crew_upgrade])
        .forEach(async ([aName, eData]) => {
        const crewUpgradeDoc = game.items.getName(aName);
        if (!crewUpgradeDoc) {
            eLog.error("applyRollEffects", `ApplyRollEffects: Crew Upgrade ${aName} Not Found.`);
            return;
        }
        const abilityEffects = Array.from(crewUpgradeDoc.effects ?? []);
        const toMemberEffects = abilityEffects.filter((effect) => effect.changes.some((change) => change.key === "APPLYTOMEMBERS"));
        const toCohortEffects = abilityEffects.filter((effect) => effect.changes.some((change) => change.key === "APPLYTOCOHORTS"));
        const standardEffects = abilityEffects.filter((effect) => effect.changes.every((change) => !["APPLYTOMEMBERS", "APPLYTOCOHORTS"].includes(change.key)));
        const testChange = eData[0];
        if ((testChange.isMember && eData.some((change) => !change.isMember))
            || (!testChange.isMember && eData.some((change) => change.isMember))) {
            eLog.error("applyRollEffects", `ApplyRollEffects: Crew Upgrade ${aName} has inconsistent 'isMember' entries.`);
            return;
        }
        if ((testChange.isCohort && eData.some((change) => !change.isCohort))
            || (!testChange.isCohort && eData.some((change) => change.isCohort))) {
            eLog.error("applyRollEffects", `ApplyRollEffects: Crew Upgrade ${aName} has inconsistent 'isCohort' entries.`);
            return;
        }
        if (testChange.isMember) {
            if (toMemberEffects.length > 1) {
                eLog.error("applyRollEffects", `ApplyRollEffects: Crew Upgrade ${aName} Has Multiple 'APPLYTOMEMBERS' Active Effects`);
                return;
            }
            const effectData = {
                name: aName,
                icon: crewUpgradeDoc.img ?? "",
                changes: eData.map((change) => {
                    delete change.isMember;
                    return change;
                })
            };
            if (toMemberEffects.length === 1) {
                const abilityEffect = toMemberEffects[0];
                effectData.name = abilityEffect.name ?? effectData.name;
                effectData.icon = abilityEffect.icon ?? effectData.icon;
                effectData.changes.unshift(...abilityEffect.changes.filter((change) => change.key !== "system.roll_mods"));
                await abilityEffect.delete();
            }
            else {
                effectData.changes.unshift({
                    key: "APPLYTOMEMBERS",
                    mode: 0,
                    priority: null,
                    value: `${aName.replace(/\s*\([^()]*? (Ability|Upgrade)\)\s*$/, "")} (Crew Upgrade)`
                });
            }
            await crewUpgradeDoc.createEmbeddedDocuments("ActiveEffect", [effectData]);
        }
        else if (testChange.isCohort) {
            if (toCohortEffects.length > 1) {
                eLog.error("applyRollEffects", `ApplyRollEffects: Crew Upgrade ${aName} Has Multiple 'APPLYTOCOHORTS' Active Effects`);
                return;
            }
            const effectData = {
                name: aName,
                icon: crewUpgradeDoc.img ?? "",
                changes: eData.map((change) => {
                    delete change.isCohort;
                    return change;
                })
            };
            if (toCohortEffects.length === 1) {
                const abilityEffect = toCohortEffects[0];
                effectData.name = abilityEffect.name ?? effectData.name;
                effectData.icon = abilityEffect.icon ?? effectData.icon;
                effectData.changes.unshift(...abilityEffect.changes.filter((change) => change.key !== "system.roll_mods"));
                await abilityEffect.delete();
            }
            else {
                effectData.changes.unshift({
                    key: "APPLYTOCOHORTS",
                    mode: 0,
                    priority: null,
                    value: `${aName.replace(/\s*\([^()]*? (Ability|Upgrade)\)\s*$/, "")} (Crew Upgrade)`
                });
            }
            await crewUpgradeDoc.createEmbeddedDocuments("ActiveEffect", [effectData]);
        }
        else {
            if (standardEffects.length > 1) {
                eLog.error("applyRollEffects", `ApplyRollEffects: Crew Upgrade ${aName} Has Multiple Active Effects`);
                return;
            }
            const effectData = {
                name: aName,
                icon: crewUpgradeDoc.img ?? "",
                changes: eData
            };
            if (standardEffects.length === 1) {
                const abilityEffect = standardEffects[0];
                effectData.name = abilityEffect.name ?? effectData.name;
                effectData.icon = abilityEffect.icon ?? effectData.icon;
                effectData.changes.unshift(...abilityEffect.changes.filter((change) => change.key !== "system.roll_mods"));
                await abilityEffect.delete();
            }
            await crewUpgradeDoc.createEmbeddedDocuments("ActiveEffect", [effectData]);
        }
    });
};
export const ApplyDescriptions = async () => {
    Object.entries(DescriptionChanges)
        .forEach(async ([aName, desc]) => {
        const itemDoc = game.items.getName(aName);
        if (!itemDoc) {
            eLog.error("applyRollEffects", `ApplyDescriptions: Item Doc ${aName} Not Found.`);
            return;
        }
        itemDoc.update({ "system.notes": desc });
    });
};
function compareRollModStatus(mod, lastStatusData) {
    const lastStatus = JSON.parse(lastStatusData);
    const statusChangeData = {};
    if (lastStatus.status !== mod.status) {
        statusChangeData.status = `${lastStatus.status} -> ${mod.status}`;
    }
    if (lastStatus.base_status !== mod.base_status) {
        statusChangeData.base_status = `${lastStatus.base_status} -> ${mod.base_status}`;
    }
    if (lastStatus.held_status !== mod.held_status) {
        statusChangeData.held_status = `${lastStatus.held_status} -> ${mod.held_status}`;
    }
    if (lastStatus.user_status !== mod.user_status) {
        statusChangeData.user_status = `${lastStatus.user_status} -> ${mod.user_status}`;
    }
    return statusChangeData;
}
function isAction(trait) {
    return Boolean(trait && typeof trait === "string" && U.lCase(trait) in Action);
}
function isAttribute(trait) {
    return Boolean(trait && typeof trait === "string" && U.lCase(trait) in Attribute);
}
function isFactor(trait) {
    return Boolean(trait && typeof trait === "string" && U.lCase(trait) in Factor);
}
function isNumber(trait) { return U.isInt(trait); }
export class BladesRollMod {
    get status() {
        if (this.user_status && [RollModStatus.ForcedOn, RollModStatus.ForcedOff, RollModStatus.Hidden].includes(this.user_status)) {
            return this.user_status;
        }
        if (this.held_status && [RollModStatus.ToggledOff, RollModStatus.ToggledOn].includes(this.held_status)) {
            return this.user_status ?? this.held_status;
        }
        return this.held_status ?? this.user_status ?? this.base_status;
    }
    get isActive() { return [RollModStatus.ToggledOn, RollModStatus.ForcedOn].includes(this.status); }
    get isVisible() { return this.status !== RollModStatus.Hidden; }
    _held_status;
    get held_status() { return this._held_status; }
    set held_status(val) {
        this._held_status = val;
    }
    get flagParams() { return [C.SYSTEM_ID, `rollCollab.rollModsData.${this.id}`]; }
    getFlag() { return this.rollInstance.document.getFlag(...this.flagParams); }
    get user_status() {
        return this.rollInstance.document.getFlag(...this.flagParams);
    }
    set user_status(val) {
        if (val === this.user_status) {
            return;
        }
        if (!val || val === this.base_status) {
            this.rollInstance.document.unsetFlag(...this.flagParams);
        }
        else {
            if ([RollModStatus.ForcedOn, RollModStatus.ForcedOff, RollModStatus.Hidden].includes(val)
                && !game.user.isGM) {
                return;
            }
            if (this.user_status && [RollModStatus.ForcedOn, RollModStatus.ForcedOff, RollModStatus.Hidden].includes(this.user_status)
                && !game.user.isGM) {
                return;
            }
            this.rollInstance.document.setFlag(...this.flagParams, val);
        }
    }
    get sourceName() { return this.source_name; }
    get isConditional() {
        return [
            ...this.conditionalRollTraits,
            ...this.autoRollTraits,
            ...this.conditionalRollTypes,
            ...this.autoRollTypes
        ].length > 0;
    }
    get isInInactiveBlock() {
        if (game.user.isGM) {
            return [RollModStatus.Hidden, RollModStatus.ForcedOff, RollModStatus.ToggledOff].includes(this.status)
                && (this.isConditional || [BladesItemType.ability].includes(this.modType));
        }
        return [RollModStatus.ForcedOff, RollModStatus.ToggledOff].includes(this.status)
            && (this.isConditional || [BladesItemType.ability].includes(this.modType));
    }
    get isPush() {
        return Boolean(U.lCase(this.name) === "push"
            || this.effectKeys.find((eKey) => eKey === "Is-Push"));
    }
    get isBasicPush() { return U.lCase(this.name) === "push"; }
    get stressCost() {
        const costKeys = this.effectKeys.filter((key) => /^Cost-Stress/.test(key));
        if (costKeys.length === 0) {
            return 0;
        }
        let stressCost = 0;
        costKeys.forEach((key) => {
            const [thisParam] = (key.split(/-/) ?? []).slice(1);
            const [_, valStr] = (thisParam.match(/([A-Za-z]+)(\d*)/) ?? []).slice(1);
            stressCost += U.pInt(valStr);
        });
        return stressCost;
    }
    setConditionalStatus() {
        if (!this.isConditional) {
            return false;
        }
        if (this.autoRollTypes.includes(this.rollInstance.rollType)
            || this.autoRollTraits.includes(this.rollInstance.rollTrait)) {
            this.held_status = RollModStatus.ForcedOn;
            return false;
        }
        if ((this.conditionalRollTypes.length === 0 || this.conditionalRollTypes.includes(this.rollInstance.rollType))
            && (this.conditionalRollTraits.length === 0 || this.conditionalRollTraits.includes(this.rollInstance.rollTrait))) {
            this.held_status = RollModStatus.ToggledOff;
            return false;
        }
        this.held_status = RollModStatus.Hidden;
        return true;
    }
    setAutoStatus() {
        const holdKeys = this.effectKeys.filter((key) => /^Auto/.test(key));
        if (holdKeys.length === 0) {
            return false;
        }
        while (holdKeys.length) {
            const [thisKey, thisParam] = holdKeys.pop()?.split(/-/) ?? [];
            switch (U.lCase(thisParam)) {
                case Position.controlled:
                case Position.risky:
                case Position.desperate: {
                    if (this.rollInstance.finalPosition === U.lCase(thisParam)) {
                        if (thisKey === "AutoRevealOn") {
                            this.held_status = RollModStatus.ToggledOff;
                            return false;
                        }
                        else if (thisKey === "AutoEnableOn") {
                            this.held_status = RollModStatus.ForcedOn;
                            return false;
                        }
                    }
                    break;
                }
            }
        }
        this.held_status = RollModStatus.Hidden;
        return true;
    }
    setRelevancyStatus() {
        const holdKeys = this.effectKeys.filter((key) => /^Negate|^Increase/.test(key));
        if (holdKeys.length === 0) {
            return false;
        }
        const relevantKeys = holdKeys
            .filter((key) => {
            const [thisKey, thisParam] = key.split(/-/) ?? [];
            switch (thisKey) {
                case "Negate": {
                    switch (thisParam) {
                        case "PushCost": {
                            return this.rollInstance.isPushed()
                                && this.rollInstance.rollCostData.some((costData) => /Push/.test(costData.id)
                                    && costData.costType === "Stress"
                                    && costData.costAmount > 0);
                        }
                        case "Consequence": {
                            return this.rollInstance.rollType === RollType.Resistance
                                && Boolean(this.rollInstance.rollConsequence);
                        }
                        case "HarmLevel": {
                            return this.rollInstance.rollType === RollType.Resistance
                                && this.rollInstance.rollConsequence
                                && [ConsequenceType.Harm1, ConsequenceType.Harm2, ConsequenceType.Harm3, ConsequenceType.Harm4].includes(this.rollInstance.rollConsequence.type);
                        }
                        case "QualityPenalty": {
                            if (!this.rollInstance.isTraitRelevant(Factor.quality)) {
                                return false;
                            }
                            const { source, opposition } = this.rollInstance.rollFactors;
                            return (source[Factor.quality]?.value ?? 0) < (opposition[Factor.quality]?.value ?? 0);
                        }
                        case "ScalePenalty": {
                            if (!this.rollInstance.isTraitRelevant(Factor.scale)) {
                                return false;
                            }
                            const { source, opposition } = this.rollInstance.rollFactors;
                            return (source[Factor.scale]?.value ?? 0) < (opposition[Factor.scale]?.value ?? 0);
                        }
                        case "TierPenalty": {
                            if (!this.rollInstance.isTraitRelevant(Factor.tier)) {
                                return false;
                            }
                            const { source, opposition } = this.rollInstance.rollFactors;
                            return (source[Factor.tier]?.value ?? 0) < (opposition[Factor.tier]?.value ?? 0);
                        }
                    }
                    break;
                }
                case "Increase": {
                    const [_, traitStr] = thisParam.match(/(\w+)\d+/) ?? [];
                    return this.rollInstance.isTraitRelevant(traitStr);
                }
            }
            return undefined;
        });
        if (relevantKeys.length === 0) {
            this.held_status = RollModStatus.Hidden;
            return true;
        }
        return false;
    }
    setPayableStatus() {
        const holdKeys = this.effectKeys.filter((key) => /^Cost/.test(key));
        if (holdKeys.length === 0) {
            return false;
        }
        const payableKeys = holdKeys
            .filter((key) => {
            const [thisParam] = (key.split(/-/) ?? []).slice(1);
            const [traitStr, valStr] = (thisParam.match(/([A-Za-z]+)(\d*)/) ?? []).slice(1);
            switch (traitStr) {
                case "SpecialArmor": {
                    return BladesActor.IsType(this.rollInstance.rollPrimary?.rollPrimaryDoc, BladesActorType.pc)
                        && this.rollInstance.rollPrimary.rollPrimaryDoc.system.armor.active.special
                        && !this.rollInstance.rollPrimary.rollPrimaryDoc.system.armor.checked.special;
                }
                case "Stress": {
                    const val = U.pInt(valStr);
                    return BladesActor.IsType(this.rollInstance.rollPrimary?.rollPrimaryDoc, BladesActorType.pc)
                        && this.rollInstance.rollPrimary.rollPrimaryDoc.system.stress.max - this.rollInstance.rollPrimary.rollPrimaryDoc.system.stress.value >= val;
                }
            }
            return null;
        });
        if (payableKeys.length === 0) {
            this.held_status = RollModStatus.ForcedOff;
            return true;
        }
        return false;
    }
    applyRollModEffectKeys() {
        if (!this.isActive) {
            return;
        }
        const holdKeys = this.effectKeys.filter((key) => /^Negate|^Increase/.test(key));
        if (holdKeys.length === 0) {
            return;
        }
        holdKeys.forEach((key) => {
            const [thisKey, thisParam] = key.split(/-/) ?? [];
            switch (thisKey) {
                case "Negate": {
                    switch (thisParam) {
                        case "PushCost": {
                            const costlyPushMod = this.rollInstance.getActiveRollMods()
                                .find((mod) => mod.isPush && mod.stressCost > 0);
                            if (costlyPushMod) {
                                U.pullElement(costlyPushMod.effectKeys, (key) => /^Cost-Stress/.test(key));
                            }
                            return;
                        }
                        case "Consequence": {
                                                        return;
                        }
                        case "HarmLevel": {
                            if (!this.rollInstance.rollConsequence) {
                                return;
                            }
                            const consequenceType = this.rollInstance.rollConsequence.type;
                            if (!consequenceType || !/^Harm/.test(consequenceType)) {
                                return;
                            }
                            const curLevel = [ConsequenceType.Harm1, ConsequenceType.Harm2, ConsequenceType.Harm3, ConsequenceType.Harm4]
                                .findIndex((cType) => cType === consequenceType) + 1;
                            if (curLevel > 1) {
                                this.rollInstance.rollConsequence.type = `Harm${curLevel - 1}`;
                            }
                            else {
                                                            }
                            return;
                        }
                        case "QualityPenalty": {
                            this.rollInstance.negateFactorPenalty(Factor.quality);
                            return;
                        }
                        case "ScalePenalty": {
                            this.rollInstance.negateFactorPenalty(Factor.scale);
                            return;
                        }
                        case "TierPenalty": {
                            this.rollInstance.negateFactorPenalty(Factor.tier);
                            return;
                        }
                    }
                    break;
                }
                case "Increase": {
                    const [traitStr, valStr] = (thisParam.match(/([A-Za-z]+)(\d*)/) ?? []).slice(1);
                    this.rollInstance.tempGMBoosts[traitStr] = U.pInt(valStr);
                    return;
                }
            }
        });
    }
    get tooltip() {
        if (this.sideString) {
            return this._tooltip
                .replace(/%COLON%/g, ":")
                .replace(/%DOC_NAME%/g, this.sideString);
        }
        return this._tooltip.replace(/%COLON%/g, ":");
    }
    get sideString() {
        if (this._sideString) {
            return this._sideString;
        }
        switch (this.category) {
            case RollModCategory.roll: {
                if (this.name === "Assist") {
                    const docID = this.rollInstance.document.getFlag("eunos-blades", "rollCollab.docSelections.roll.Assist");
                    if (!docID) {
                        return undefined;
                    }
                    return (game.actors.get(docID) ?? game.items.get(docID))?.name ?? undefined;
                }
                return undefined;
            }
            case RollModCategory.position: {
                if (this.name === "Setup") {
                    const docID = this.rollInstance.document.getFlag("eunos-blades", "rollCollab.docSelections.position.Setup");
                    if (!docID) {
                        return undefined;
                    }
                    return (game.actors.get(docID) ?? game.items.get(docID))?.name ?? undefined;
                }
                return undefined;
            }
            case RollModCategory.effect: {
                if (this.name === "Setup") {
                    const docID = this.rollInstance.document.getFlag("eunos-blades", "rollCollab.docSelections.effect.Setup");
                    if (!docID) {
                        return undefined;
                    }
                    return (game.actors.get(docID) ?? game.items.get(docID))?.name ?? undefined;
                }
                return undefined;
            }
        }
        return undefined;
    }
    get allFlagData() {
        return this.rollInstance.document.getFlag("eunos-blades", "rollCollab");
    }
    get data() {
        return {
            id: this.id,
            name: this.name,
            base_status: this.base_status,
            user_status: this.user_status,
            value: this.value,
            effectKeys: this.effectKeys,
            sideString: this._sideString,
            tooltip: this._tooltip,
            posNeg: this.posNeg,
            isOppositional: this.isOppositional,
            modType: this.modType,
            conditionalRollTypes: this.conditionalRollTypes,
            autoRollTypes: this.autoRollTypes,
            conditionalRollTraits: this.conditionalRollTraits,
            autoRollTraits: this.autoRollTraits,
            category: this.category
        };
    }
    get costs() {
        if (!this.isActive) {
            return undefined;
        }
        const holdKeys = this.effectKeys.filter((key) => /^Cost/.test(key));
        if (holdKeys.length === 0) {
            return undefined;
        }
        return holdKeys.map((key) => {
            const [thisParam] = (key.split(/-/) ?? []).slice(1);
            const [traitStr, valStr] = (thisParam.match(/([A-Za-z]+)(\d*)/) ?? []).slice(1);
            let label = this.name;
            if (this.isBasicPush) {
                if (this.posNeg === "negative") {
                    label = `${this.name} (<span class='red-bright'>To Act</span>)`;
                }
                else {
                    const effect = this.category === RollModCategory.roll ? "+1d" : "+1 effect";
                    label = `${this.name} (<span class='gold-bright'>${effect}</span>)`;
                }
            }
            return {
                id: this.id,
                label: label,
                costType: traitStr,
                costAmount: valStr ? U.pInt(valStr) : 1
            };
        });
    }
    id;
    name;
    source_name;
    base_status;
    value;
    effectKeys;
    _sideString;
    _tooltip;
    posNeg;
    isOppositional;
    modType;
    conditionalRollTypes;
    autoRollTypes;
    conditionalRollTraits;
    autoRollTraits;
    category;
    rollInstance;
    constructor(modData, rollInstance) {
        this.rollInstance = rollInstance;
        this.id = modData.id;
        this.name = modData.name;
        this.source_name = modData.source_name ?? modData.name;
        this.base_status = modData.base_status;
        this.value = modData.value;
        this.effectKeys = modData.effectKeys ?? [];
        this._sideString = modData.sideString;
        this._tooltip = modData.tooltip;
        this.posNeg = modData.posNeg;
        this.isOppositional = modData.isOppositional ?? false;
        this.modType = modData.modType;
        this.conditionalRollTypes = modData.conditionalRollTypes ?? [];
        this.autoRollTypes = modData.autoRollTypes ?? [];
        this.conditionalRollTraits = modData.conditionalRollTraits ?? [];
        this.autoRollTraits = modData.autoRollTraits ?? [];
        this.category = modData.category;
    }
}
class BladesRollPrimary {
    static IsDoc(doc) {
        return BladesActor.IsType(doc, BladesActorType.pc, BladesActorType.crew)
            || BladesItem.IsType(doc, BladesItemType.cohort_expert, BladesItemType.cohort_gang, BladesItemType.gm_tracker);
    }
    rollInstance;
    rollPrimaryID;
    rollPrimaryDoc;
    rollPrimaryName;
    rollPrimaryType;
    rollPrimaryImg;
    rollModsData;
    rollFactors;
    constructor(rollInstance, { rollPrimaryID, rollPrimaryDoc, rollPrimaryName, rollPrimaryType, rollPrimaryImg, rollModsData, rollFactors } = {}) {
        this.rollInstance = rollInstance;
        let doc = rollPrimaryDoc;
        if (!doc && rollPrimaryID) {
            doc = game.items.get(rollPrimaryID) ?? game.actors.get(rollPrimaryID);
        }
        if (!doc && rollPrimaryName) {
            doc = game.items.getName(rollPrimaryName) ?? game.actors.getName(rollPrimaryName);
        }
        if (BladesRollPrimary.IsDoc(doc)) {
            this.rollPrimaryDoc = doc;
        }
        if (BladesRollPrimary.IsDoc(this.rollPrimaryDoc)) {
            this.rollPrimaryID = this.rollPrimaryDoc.rollPrimaryID;
            this.rollPrimaryName = rollPrimaryName ?? this.rollPrimaryDoc.rollPrimaryName;
            this.rollPrimaryType = this.rollPrimaryDoc.rollPrimaryType;
            this.rollPrimaryImg = rollPrimaryImg ?? this.rollPrimaryDoc.rollPrimaryImg ?? "";
            this.rollModsData = [
                ...rollModsData ?? [],
                ...this.rollPrimaryDoc.rollModsData ?? []
            ];
            this.rollFactors = Object.assign(this.rollPrimaryDoc.rollFactors, rollFactors ?? {});
        }
        else {
            if (!rollPrimaryName) {
                throw new Error("Must include a rollPrimaryName when constructing a BladesRollPrimary object.");
            }
            if (!rollPrimaryImg) {
                throw new Error("Must include a rollPrimaryImg when constructing a BladesRollPrimary object.");
            }
            if (!rollPrimaryType) {
                throw new Error("Must include a rollPrimaryType when constructing a BladesRollPrimary object.");
            }
            if (!rollFactors) {
                throw new Error("Must include a rollFactors when constructing a BladesRollPrimary object.");
            }
            this.rollPrimaryID = rollPrimaryID;
            this.rollPrimaryName = rollPrimaryName;
            this.rollPrimaryType = rollPrimaryType;
            this.rollPrimaryImg = rollPrimaryImg;
            this.rollModsData = rollModsData ?? [];
            this.rollFactors = rollFactors;
        }
    }
}
class BladesRollOpposition {
    static IsDoc(doc) {
        return BladesActor.IsType(doc, BladesActorType.npc, BladesActorType.faction)
            || BladesItem.IsType(doc, BladesItemType.cohort_expert, BladesItemType.cohort_gang, BladesItemType.gm_tracker, BladesItemType.project, BladesItemType.design, BladesItemType.ritual);
    }
    rollInstance;
    rollOppID;
    rollOppDoc;
    rollOppName;
    rollOppSubName;
    rollOppType;
    rollOppImg;
    rollOppModsData;
    rollFactors;
    constructor(rollInstance, { rollOppID, rollOppDoc, rollOppName, rollOppSubName, rollOppType, rollOppImg, rollOppModsData, rollFactors } = {}) {
        this.rollInstance = rollInstance;
        let doc = rollOppDoc;
        if (!doc && rollOppID) {
            doc = game.items.get(rollOppID) ?? game.actors.get(rollOppID);
        }
        if (!doc && rollOppName) {
            doc = game.items.getName(rollOppName) ?? game.actors.getName(rollOppName);
        }
        if (BladesRollOpposition.IsDoc(doc)) {
            this.rollOppDoc = doc;
        }
        if (BladesRollOpposition.IsDoc(this.rollOppDoc)) {
            this.rollOppID = this.rollOppDoc.rollOppID;
            this.rollOppName = rollOppName ?? this.rollOppDoc.rollOppName;
            this.rollOppSubName = rollOppSubName ?? this.rollOppDoc.rollOppSubName;
            this.rollOppType = this.rollOppDoc.rollOppType;
            this.rollOppImg = rollOppImg ?? this.rollOppDoc.rollOppImg ?? "";
            this.rollOppModsData = [
                ...rollOppModsData ?? [],
                ...this.rollOppDoc.rollOppModsData ?? []
            ];
            this.rollFactors = Object.assign(this.rollOppDoc.rollFactors, rollFactors ?? {});
        }
        else {
            if (!rollOppName) {
                throw new Error("Must include a rollOppName when constructing a BladesRollOpposition object.");
            }
            if (!rollOppSubName) {
                throw new Error("Must include a rollOppSubName when constructing a BladesRollOpposition object.");
            }
            if (!rollOppType) {
                throw new Error("Must include a rollOppType when constructing a BladesRollOpposition object.");
            }
            if (!rollFactors) {
                throw new Error("Must include a rollFactors when constructing a BladesRollOpposition object.");
            }
            this.rollOppID = rollOppID;
            this.rollOppName = rollOppName;
            this.rollOppSubName = rollOppSubName;
            this.rollOppType = rollOppType;
            this.rollOppImg = rollOppImg ?? "";
            this.rollOppModsData = rollOppModsData ?? [];
            this.rollFactors = rollFactors;
        }
        if (this.rollOppModsData.length === 0) {
            this.rollOppModsData = undefined;
        }
    }
}
class BladesRollParticipant {
    static IsDoc(doc) {
        return BladesActor.IsType(doc, BladesActorType.pc, BladesActorType.crew, BladesActorType.npc)
            || BladesItem.IsType(doc, BladesItemType.cohort_expert, BladesItemType.cohort_gang, BladesItemType.gm_tracker);
    }
    rollInstance;
    rollParticipantID;
    rollParticipantDoc;
    rollParticipantName;
    rollParticipantType;
    rollParticipantIcon;
    rollParticipantModsData;
    rollFactors;
    constructor(rollInstance, { rollParticipantID, rollParticipantDoc, rollParticipantName, rollParticipantType, rollParticipantIcon, rollParticipantModsData, rollFactors } = {}) {
        this.rollInstance = rollInstance;
        let doc = rollParticipantDoc;
        if (!doc && rollParticipantID) {
            doc = game.items.get(rollParticipantID) ?? game.actors.get(rollParticipantID);
        }
        if (!doc && rollParticipantName) {
            doc = game.items.getName(rollParticipantName) ?? game.actors.getName(rollParticipantName);
        }
        if (BladesRollParticipant.IsDoc(doc)) {
            this.rollParticipantDoc = doc;
        }
        if (this.rollParticipantDoc) {
            this.rollParticipantID = this.rollParticipantDoc.rollParticipantID;
            this.rollParticipantName = rollParticipantName ?? this.rollParticipantDoc.rollParticipantName ?? this.rollParticipantDoc.name;
            this.rollParticipantIcon = rollParticipantIcon ?? this.rollParticipantDoc.rollParticipantIcon ?? this.rollParticipantDoc.img;
            this.rollParticipantType = this.rollParticipantDoc.rollParticipantType;
            this.rollParticipantModsData = [
                ...rollParticipantModsData ?? [],
                ...this.rollParticipantDoc.rollParticipantModsData ?? []
            ];
            this.rollFactors = Object.assign(this.rollParticipantDoc.rollFactors, rollFactors ?? {});
        }
        else {
            if (!rollParticipantName) {
                throw new Error("Must include a rollParticipantName when constructing a BladesRollParticipant object.");
            }
            if (!rollParticipantType) {
                throw new Error("Must include a rollParticipantType when constructing a BladesRollParticipant object.");
            }
            if (!rollParticipantIcon) {
                throw new Error("Must include a rollParticipantIcon when constructing a BladesRollParticipant object.");
            }
            if (!rollFactors) {
                throw new Error("Must include a rollFactors when constructing a BladesRollParticipant object.");
            }
            this.rollParticipantID = rollParticipantID;
            this.rollParticipantName = rollParticipantName;
            this.rollParticipantType = rollParticipantType;
            this.rollParticipantIcon = rollParticipantIcon;
            this.rollParticipantModsData = rollParticipantModsData ?? [];
            this.rollFactors = rollFactors;
        }
        if (this.rollParticipantModsData.length === 0) {
            this.rollParticipantModsData = undefined;
        }
    }
}

class BladesRollCollab extends DocumentSheet {

    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            classes: ["eunos-blades", "sheet", "roll-collab", game.user.isGM ? "gm-roll-collab" : ""],
            template: `systems/eunos-blades/templates/roll/roll-collab${game.user.isGM ? "-gm" : ""}.hbs`,
            submitOnChange: true,
            width: 500,
            dragDrop: [
                { dragSelector: null, dropSelector: "[data-action='gm-drop-opposition'" }
            ]
        });
    }
    static Initialize() {
        
        return loadTemplates([
            "systems/eunos-blades/templates/roll/roll-collab.hbs",
            "systems/eunos-blades/templates/roll/roll-collab-gm.hbs",
            "systems/eunos-blades/templates/roll/partials/roll-collab-gm-number-line.hbs",
            "systems/eunos-blades/templates/roll/partials/roll-collab-gm-select-doc.hbs",
            "systems/eunos-blades/templates/roll/partials/roll-collab-gm-factor-control.hbs",
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
    static get DefaultRollMods() {
        return [
            {
                id: "Push-positive-roll",
                name: "PUSH",
                category: RollModCategory.roll,
                base_status: RollModStatus.ToggledOff,
                posNeg: "positive",
                modType: "general",
                value: 1,
                effectKeys: ["ForceOff-Bargain", "Cost-Stress2"],
                tooltip: "<h1>Push for +1d</h1><p>For <strong class='red-bright'>2 Stress</strong>, add <strong class='gold-bright'>1 die</strong> to your pool.</p><p><em>(You <strong>cannot</strong> also accept a <strong class='red-bright'>Devil's Bargain</strong> to increase your dice pool: It's one or the other.)</em></p>"
            },
            {
                id: "Bargain-positive-roll",
                name: "Bargain",
                category: RollModCategory.roll,
                base_status: RollModStatus.Hidden,
                posNeg: "positive",
                modType: "general",
                value: 1,
                effectKeys: [],
                tooltip: "<h1 class='red-bright'>Devil's Bargain</h1><p>The GM has offered you a <strong class='red-bright'>Devil's Bargain</strong>.</p><p><strong class='red-bright'>Accept the terms</strong> to add <strong class='gold-bright'>1 die</strong> to your pool.</p><p><em>(You <strong>cannot</strong> also <strong>Push for +1d</strong> to increase your dice pool: It's one or the other.)</em></p>"
            },
            {
                id: "Assist-positive-roll",
                name: "Assist",
                category: RollModCategory.roll,
                base_status: RollModStatus.Hidden,
                posNeg: "positive",
                modType: "teamwork",
                value: 1,
                tooltip: "<h1 class='gold-bright'>%DOC_NAME% Assists</h1><p><strong class='gold-bright'>%DOC_NAME%</strong> is <strong>Assisting</strong> your efforts, adding <strong class='gold-bright'>1 die</strong> to your pool.</p>"
            },
            {
                id: "Setup-positive-position",
                name: "Setup",
                category: RollModCategory.position,
                base_status: RollModStatus.Hidden,
                posNeg: "positive",
                modType: "teamwork",
                value: 1,
                tooltip: "<h1 class='gold-bright'>%DOC_NAME% Sets You Up</h1><p><strong class='gold-bright'>%DOC_NAME%</strong> has set you up for success with a preceding <strong>Setup</strong> action, increasing your <strong class='gold-bright'>Position</strong> by one level.</p>"
            },
            {
                id: "Push-positive-effect",
                name: "PUSH",
                category: RollModCategory.effect,
                base_status: RollModStatus.ToggledOff,
                posNeg: "positive",
                modType: "general",
                value: 1,
                effectKeys: ["Cost-Stress2"],
                tooltip: "<h1>Push for Effect</h1><p>For <strong class='red-bright'>2 Stress</strong>, increase your <strong class='gold-bright'>Effect</strong> by one level.</p>"
            },
            {
                id: "Setup-positive-effect",
                name: "Setup",
                category: RollModCategory.effect,
                base_status: RollModStatus.Hidden,
                posNeg: "positive",
                modType: "teamwork",
                value: 1,
                tooltip: "<h1 class='gold-bright'>%DOC_NAME% Sets You Up</h1><p><strong class='gold-bright'>%DOC_NAME%</strong> has set you up for success with a preceding <strong>Setup</strong> action, increasing your <strong class='gold-bright'>Effect</strong> by one level.</p>"
            },
            {
                id: "Potency-positive-effect",
                name: "Potency",
                category: RollModCategory.effect,
                base_status: RollModStatus.Hidden,
                posNeg: "positive",
                modType: "general",
                value: 1,
                tooltip: "<h1>Potency</h1><p>By circumstance or advantage, you have <strong>Potency</strong> in this action, increasing your <strong class='gold-bright'>Effect</strong> by one level.</p>"
            },
            {
                id: "Potency-negative-effect",
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
    static get DefaultFlagData() {
        return {
            rollID: randomID(),
            rollType: RollType.Action,
            rollPrimaryType: BladesActorType.pc,
            rollPrimaryID: "",
            rollTrait: Factor.tier,
            rollModsData: {},
            rollPositionInitial: Position.risky,
            rollEffectInitial: Effect.standard,
            rollPosEffectTrade: false,
            isGMReady: false,
            GMBoosts: {
                [Factor.tier]: 0,
                [Factor.quality]: 0,
                [Factor.scale]: 0,
                [Factor.magnitude]: 0
            },
            GMOppBoosts: {
                [Factor.tier]: 0,
                [Factor.quality]: 0,
                [Factor.scale]: 0,
                [Factor.magnitude]: 0
            },
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
            },
            rollFactorToggles: {
                source: {
                    [Factor.tier]: {
                        display: "",
                        isActive: false,
                        isPrimary: false,
                        isDominant: false,
                        highFavorsPC: true
                    },
                    [Factor.quality]: {
                        display: "",
                        isActive: false,
                        isPrimary: false,
                        isDominant: false,
                        highFavorsPC: true
                    },
                    [Factor.scale]: {
                        display: "",
                        isActive: false,
                        isPrimary: false,
                        isDominant: false,
                        highFavorsPC: true
                    },
                    [Factor.magnitude]: {
                        display: "",
                        isActive: false,
                        isPrimary: false,
                        isDominant: false,
                        highFavorsPC: true
                    }
                },
                opposition: {
                    [Factor.tier]: {
                        display: "",
                        isActive: false,
                        isPrimary: false,
                        isDominant: false,
                        highFavorsPC: true
                    },
                    [Factor.quality]: {
                        display: "",
                        isActive: false,
                        isPrimary: false,
                        isDominant: false,
                        highFavorsPC: true
                    },
                    [Factor.scale]: {
                        display: "",
                        isActive: false,
                        isPrimary: false,
                        isDominant: false,
                        highFavorsPC: true
                    },
                    [Factor.magnitude]: {
                        display: "",
                        isActive: false,
                        isPrimary: false,
                        isDominant: false,
                        highFavorsPC: true
                    }
                }
            }
        };
    }

    static Current = {};
    static _Active;
    static get Active() {
        if (BladesRollCollab._Active) {
            return BladesRollCollab._Active;
        }
        if (U.objSize(BladesRollCollab.Current) > 0) {
            return Object.values(BladesRollCollab.Current)[0];
        }
        return undefined;
    }
    static set Active(val) {
        BladesRollCollab._Active = val;
    }
    static async RenderRollCollab({ userID, rollID }) {
        const user = game.users.get(userID);
        if (!user) {
            return;
        }
        BladesRollCollab.Current[rollID] = new BladesRollCollab(user, rollID);
        BladesRollCollab.Current[rollID].render(true);
    }
    static async CloseRollCollab(rollID) {
        eLog.checkLog3("rollCollab", "CloseRollCollab()", { rollID });
        await BladesRollCollab.Current[rollID]?.close({ rollID });
        delete BladesRollCollab.Current[rollID];
    }
    static async NewRoll(config) {
        if (game.user.isGM && BladesActor.IsType(config.rollPrimary, BladesActorType.pc)) {
            const rSource = config.rollPrimary;
            if (rSource.primaryUser?.id) {
                config.userID = rSource.primaryUser.id;
            }
        }
        const user = game.users.get(config.userID ?? game.user._id);
        if (!(user instanceof User)) {
            eLog.error("rollCollab", `[NewRoll()] Can't Find User '${config.userID}'`, config);
            return;
        }
        await user.unsetFlag(C.SYSTEM_ID, "rollCollab");
        const flagUpdateData = { ...BladesRollCollab.DefaultFlagData };
        flagUpdateData.rollType = config.rollType;
        if (!(flagUpdateData.rollType in RollType)) {
            eLog.error("rollCollab", `[RenderRollCollab()] Invalid rollType: ${flagUpdateData.rollType}`, config);
            return;
        }
        const rollPrimaryData = config.rollPrimary ?? user.character;
        if (!rollPrimaryData) {
            eLog.error("rollCollab", "[RenderRollCollab()] Invalid rollPrimary", { rollPrimaryData, config });
            return;
        }
        flagUpdateData.rollPrimaryID = rollPrimaryData.rollPrimaryID;
        flagUpdateData.rollPrimaryType = rollPrimaryData.rollPrimaryType;
        if (U.isInt(config.rollTrait)) {
            flagUpdateData.rollTrait = config.rollTrait;
        }
        else if (!config.rollTrait) {
            eLog.error("rollCollab", "[RenderRollCollab()] No RollTrait in Config", config);
            return;
        }
        else {
            switch (flagUpdateData.rollType) {
                case RollType.Action: {
                    if (!(U.lCase(config.rollTrait) in { ...Action, ...Factor })) {
                        eLog.error("rollCollab", `[RenderRollCollab()] Bad RollTrait for Action Roll: ${config.rollTrait}`, config);
                        return;
                    }
                    flagUpdateData.rollTrait = U.lCase(config.rollTrait);
                    break;
                }
                case RollType.Downtime: {
                    if (!(U.lCase(config.rollTrait) in { ...Action, ...Factor })) {
                        eLog.error("rollCollab", `[RenderRollCollab()] Bad RollTrait for Downtime Roll: ${config.rollTrait}`, config);
                        return;
                    }
                    flagUpdateData.rollTrait = U.lCase(config.rollTrait);
                    break;
                }
                case RollType.Fortune: {
                    if (!(U.lCase(config.rollTrait) in { ...Action, ...Attribute, ...Factor })) {
                        eLog.error("rollCollab", `[RenderRollCollab()] Bad RollTrait for Fortune Roll: ${config.rollTrait}`, config);
                        return;
                    }
                    flagUpdateData.rollTrait = U.lCase(config.rollTrait);
                    break;
                }
                case RollType.Resistance: {
                    if (!(U.lCase(config.rollTrait) in Attribute)) {
                        eLog.error("rollCollab", `[RenderRollCollab()] Bad RollTrait for Resistance Roll: ${config.rollTrait}`, config);
                        return;
                    }
                    break;
                }
            }
            flagUpdateData.rollTrait = U.lCase(config.rollTrait);
        }
        await user.setFlag(C.SYSTEM_ID, "rollCollab", flagUpdateData);
        BladesRollCollab.RenderRollCollab({ userID: user._id, rollID: flagUpdateData.rollID });
        socketlib.system.executeForAllGMs("renderRollCollab", { userID: user._id, rollID: flagUpdateData.rollID });
    }
    rollID;
    constructor(user, rollID) {
        super(user);
        this.rollID = rollID;
    }

    get rData() {
        if (!this.document.getFlag(C.SYSTEM_ID, "rollCollab")) {
            throw new Error("[get flags()] No RollCollab Flags Found on User");
        }
        return this.document.getFlag(C.SYSTEM_ID, "rollCollab");
    }
    _rollPrimary;
    get rollPrimary() {
        if (!this._rollPrimary) {
            if (this.rData.rollPrimaryData) {
                this._rollPrimary = new BladesRollPrimary(this, this.rData.rollPrimaryData);
            }
        }
        if (this._rollPrimary instanceof BladesRollPrimary) {
            return this._rollPrimary;
        }
        return undefined;
    }
    set rollPrimary(val) {
        if (val === undefined) {
            this._rollPrimary = undefined;
        }
        else {
            this._rollPrimary = new BladesRollPrimary(this, val);
        }
    }
    _rollParticipants = [];
    _rollOpposition;
    get rollOpposition() {
        if (!this._rollOpposition) {
            if (this.rData.rollOppositionData) {
                this._rollOpposition = new BladesRollOpposition(this, this.rData.rollOppositionData);
            }
        }
        if (this._rollOpposition instanceof BladesRollOpposition) {
            return this._rollOpposition;
        }
        return undefined;
    }
    set rollOpposition(val) {
        if (val === undefined) {
            this._rollOpposition = undefined;
        }
        else {
            this._rollOpposition = new BladesRollOpposition(this, val);
        }
    }
    get rollType() { return this.rData.rollType; }
    get rollSubType() { return this.rData.rollSubType; }
    get rollDowntimeAction() { return this.rData.rollDowntimeAction; }
    get rollTrait() { return this.rData.rollTrait; }
    _rollTraitValOverride;
    get rollTraitValOverride() { return this._rollTraitValOverride; }
    set rollTraitValOverride(val) { this._rollTraitValOverride = val; }
    get rollTraitData() {
        if (BladesActor.IsType(this.rollPrimary?.rollPrimaryDoc, BladesActorType.pc)) {
            if (isAction(this.rollTrait)) {
                return {
                    name: this.rollTrait,
                    value: this.rollTraitValOverride ?? this.rollPrimary.rollPrimaryDoc.actions[this.rollTrait],
                    max: this.rollTraitValOverride ?? this.rollPrimary.rollPrimaryDoc.actions[this.rollTrait],
                    pcTooltip: this.rollPrimary.rollPrimaryDoc.rollTraitPCTooltipActions,
                    gmTooltip: C.ActionTooltipsGM[this.rollTrait]
                };
            }
            if (isAttribute(this.rollTrait)) {
                return {
                    name: this.rollTrait,
                    value: this.rollTraitValOverride ?? this.rollPrimary.rollPrimaryDoc.attributes[this.rollTrait],
                    max: this.rollTraitValOverride ?? this.rollPrimary.rollPrimaryDoc.attributes[this.rollTrait],
                    pcTooltip: this.rollPrimary.rollPrimaryDoc.rollTraitPCTooltipAttributes,
                    gmTooltip: C.AttributeTooltips[this.rollTrait]
                };
            }
        }
        if (U.isInt(this.rollTrait)) {
            return {
                name: `+${this.rollTraitValOverride ?? this.rollTrait}`,
                value: this.rollTraitValOverride ?? this.rollTrait,
                max: this.rollTraitValOverride ?? this.rollTrait
            };
        }
        if (isFactor(this.rollTrait)) {
            return {
                name: U.tCase(this.rollTrait),
                value: this.rollTraitValOverride ?? this.rollPrimary?.rollFactors[this.rollTrait]?.value ?? 0,
                max: this.rollTraitValOverride ?? this.rollPrimary?.rollFactors[this.rollTrait]?.max ?? 10
            };
        }
        throw new Error(`[get rollTraitData] Invalid rollTrait: '${this.rollTrait}'`);
    }
    get rollTraitOptions() {
        if (BladesActor.IsType(this.rollPrimary, BladesActorType.pc)) {
            if (isAction(this.rollTrait)) {
                return Object.values(Action)
                    .map((action) => ({
                    name: U.uCase(action),
                    value: action
                }));
            }
            if (isAttribute(this.rollTrait)) {
                return Object.values(Attribute)
                    .map((attribute) => ({
                    name: U.uCase(attribute),
                    value: attribute
                }));
            }
        }
        if (U.isInt(this.rollTrait)) {
            return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
                .map((num) => ({
                name: `+${num}`,
                value: num
            }));
        }
        if (isFactor(this.rollTrait)) {
            return [];
        }
        throw new Error(`[get rollTraitOptions] Invalid rollTrait: '${this.rollTrait}'`);
    }
    get posEffectTrade() {
        return this.rData?.rollPosEffectTrade ?? false;
    }
    get initialPosition() {
        return this.rData?.rollPositionInitial ?? Position.risky;
    }
    set initialPosition(val) {
        this.document.setFlag(C.SYSTEM_ID, "rollCollab.rollPositionInitial", val);
    }
    get initialEffect() {
        return this.rData?.rollEffectInitial ?? Effect.standard;
    }
    set initialEffect(val) {
        this.document.setFlag(C.SYSTEM_ID, "rollCollab.rollEffectInitial", val);
    }
    get rollConsequence() {
        return this.rData?.rollConsequence;
    }

    get finalPosition() {
        return Object.values(Position)[U.clampNum(Object.values(Position)
            .indexOf(this.initialPosition)
            + this.getModsDelta(RollModCategory.position)
            + (this.posEffectTrade === "position" ? 1 : 0)
            + (this.posEffectTrade === "effect" ? -1 : 0), [0, 2])];
    }
    get finalEffect() {
        return Object.values(Effect)[U.clampNum(Object.values(Effect)
            .indexOf(this.initialEffect)
            + this.getModsDelta(RollModCategory.effect)
            + (this.posEffectTrade === "effect" ? 1 : 0)
            + (this.posEffectTrade === "position" ? -1 : 0), [0, 4])];
    }
    get finalResult() {
        return this.getModsDelta(RollModCategory.result)
            + (this.rData?.GMBoosts.Result ?? 0)
            + (this.tempGMBoosts.Result ?? 0);
    }
    get finalDicePool() {
        return Math.max(0, this.rollTraitData.value
            + this.getModsDelta(RollModCategory.roll)
            + (this.rData.GMBoosts.Dice ?? 0)
            + (this.tempGMBoosts.Dice ?? 0));
    }
    get isRollingZero() {
        return Math.max(0, this.rollTraitData.value
            + this.getModsDelta(RollModCategory.roll)
            + (this.rData.GMBoosts.Dice ?? 0)
            + (this.tempGMBoosts.Dice ?? 0)) <= 0;
    }
    _roll;
    get roll() {
        this._roll ??= new Roll(`${this.isRollingZero ? 2 : this.finalDicePool}d6`, {});
        return this._roll;
    }
    get rollFactors() {
        const sourceFactors = Object.fromEntries(Object.entries(this.rollPrimary?.rollFactors ?? {})
            .map(([factor, factorData]) => [
            factor,
            {
                ...factorData,
                ...this.rData.rollFactorToggles.source[factor] ?? []
            }
        ]));
        Object.entries(this.rData.rollFactorToggles.source).forEach(([factor, factorData]) => {
            if (!(factor in sourceFactors)) {
                sourceFactors[factor] = {
                    name: factor,
                    value: 0,
                    max: 0,
                    baseVal: 0,
                    cssClasses: "factor-gold",
                    isActive: factorData.isActive ?? false,
                    isPrimary: factorData.isPrimary ?? (factor === Factor.tier),
                    isDominant: factorData.isDominant ?? false,
                    highFavorsPC: factorData.highFavorsPC ?? true
                };
            }
        });
        Object.keys(sourceFactors).forEach((factor) => {
            sourceFactors[factor].value
                += (this.rData.GMBoosts[factor] ?? 0)
                    + (this.tempGMBoosts[factor] ?? 0);
            if (factor === Factor.tier) {
                sourceFactors[factor].display = U.romanizeNum(sourceFactors[factor].value);
            }
            else {
                sourceFactors[factor].display = `${sourceFactors[factor].value}`;
            }
        });
        const rollOppFactors = this.rollOpposition?.rollFactors
            ?? Object.fromEntries(([
                Factor.tier,
                Factor.quality,
                Factor.scale,
                Factor.magnitude
            ]).map((factor) => [
                factor,
                {
                    name: factor,
                    value: 0,
                    max: 0,
                    baseVal: 0,
                    cssClasses: "factor-gold",
                    isActive: false,
                    isPrimary: factor === Factor.tier,
                    isDominant: false,
                    highFavorsPC: true
                }
            ]));
        const oppFactors = {};
        Object.entries(rollOppFactors)
            .forEach(([factor, factorData]) => {
            oppFactors[factor] = {
                ...factorData,
                ...this.rData.rollFactorToggles.opposition[factor] ?? []
            };
        });
        Object.entries(this.rData.rollFactorToggles.opposition).forEach(([factor, factorData]) => {
            if (!(factor in oppFactors)) {
                oppFactors[factor] = {
                    name: factor,
                    value: 0,
                    max: 0,
                    baseVal: 0,
                    cssClasses: "factor-gold",
                    isActive: factorData.isActive ?? false,
                    isPrimary: factorData.isPrimary ?? (factor === Factor.tier),
                    isDominant: factorData.isDominant ?? false,
                    highFavorsPC: factorData.highFavorsPC ?? true
                };
            }
        });
        Object.keys(oppFactors).forEach((factor) => {
            oppFactors[factor].value += this.rData.GMOppBoosts[factor] ?? 0;
            if (factor === Factor.tier) {
                oppFactors[factor].display = U.romanizeNum(oppFactors[factor].value);
            }
            else {
                oppFactors[factor].display = `${oppFactors[factor].value}`;
            }
        });
        return {
            source: sourceFactors,
            opposition: oppFactors
        };
    }
    initRollMods(modsData) {
        this.rollTraitValOverride = undefined;
        this.rollFactorPenaltiesNegated = {};
        this.tempGMBoosts = {};
        this.rollMods = modsData.map((modData) => new BladesRollMod(modData, this));
        const initReport = {};
                
        this.rollMods
            .filter((rollMod) => !rollMod.setConditionalStatus())
            .filter((rollMod) => !rollMod.setAutoStatus())
            .forEach((rollMod) => { rollMod.setPayableStatus(); });
                
        const parseForceOnKeys = (mod) => {
            const holdKeys = mod.effectKeys.filter((key) => /^ForceOn/.test(key));
            if (holdKeys.length === 0) {
                return;
            }
            while (holdKeys.length) {
                const thisTarget = holdKeys.pop().split(/-/).pop();
                if (thisTarget === "BestAction") {
                    if (BladesActor.IsType(this.rollPrimary?.rollPrimaryDoc, BladesActorType.pc)) {
                        this.rollTraitValOverride = Math.max(...Object.values(this.rollPrimary.rollPrimaryDoc.actions));
                    }
                    continue;
                }
                const [targetName, targetCat, targetPosNeg] = thisTarget.split(/,/);
                let targetMod = this.getRollModByName(targetName)
                    ?? this.getRollModByName(targetName, targetCat ?? mod.category);
                if (!targetMod && targetName === "Push") {
                    [targetMod] = [
                        ...this.getActiveBasicPushMods(targetCat ?? mod.category, "negative").filter((mod) => mod.status === RollModStatus.ToggledOn),
                        ...this.getActiveBasicPushMods(targetCat ?? mod.category, "positive").filter((mod) => mod.status === RollModStatus.ToggledOn),
                        ...this.getInactiveBasicPushMods(targetCat ?? mod.category, "positive").filter((mod) => mod.status === RollModStatus.ToggledOff)
                    ];
                }
                targetMod ??= this.getRollModByName(targetName, targetCat ?? mod.category, targetPosNeg ?? mod.posNeg);
                if (!targetMod) {
                    throw new Error(`No mod found matching ${targetName}/${targetCat}/${targetPosNeg}`);
                }
                if (!targetMod.isActive) {
                    targetMod.held_status = RollModStatus.ForcedOn;
                    parseForceOnKeys(targetMod);
                }
                else {
                    targetMod.held_status = RollModStatus.ForcedOn;
                }
            }
        };
        this.getActiveRollMods().forEach((rollMod) => parseForceOnKeys(rollMod));
                
        if (this.isForcePushed()) {
            this.getInactivePushMods()
                .filter((mod) => !mod.isBasicPush)
                .forEach((mod) => { mod.held_status = RollModStatus.ForcedOff; });
        }
        [RollModCategory.roll, RollModCategory.effect].forEach((cat, i) => {
            if (this.isPushed(cat)) {
                if (cat === RollModCategory.roll && this.isPushed(cat, "positive")) {
                    const bargainMod = this.getRollModByID("Bargain-positive-roll");
                    if (bargainMod?.isVisible) {
                        bargainMod.held_status = RollModStatus.ForcedOff;
                    }
                }
            }
            else {
                this.getInactivePushMods(cat)
                    .filter((mod) => !mod.isBasicPush)
                    .forEach((mod) => { mod.held_status = RollModStatus.Hidden; });
            }
        });
                
        this.getVisibleRollMods()
            .forEach((mod) => { mod.setRelevancyStatus(); });
                
        const activeArmorCostMod = this.getActiveRollMods().find((mod) => mod.effectKeys.includes("Cost-SpecialArmor"));
        if (activeArmorCostMod) {
            this.getVisibleRollMods()
                .filter((mod) => !mod.isActive && mod.effectKeys.includes("Cost-SpecialArmor"))
                .forEach((mod) => { mod.held_status = RollModStatus.ForcedOff; });
        }
        eLog.checkLog2("rollMods", "*** initRollMods() PASS ***", initReport);
    }
    isTraitRelevant(trait) {
        if (trait in Factor) {
            const { source, opposition } = this.rollFactors;
            return Boolean(trait in source && trait in opposition && source[trait]?.isActive);
        }
        return false;
    }
    rollFactorPenaltiesNegated = {};
    negateFactorPenalty(factor) {
        this.rollFactorPenaltiesNegated[factor] = true;
    }
    tempGMBoosts = {};
    isPushed(cat, posNeg) { return this.getActiveBasicPushMods(cat, posNeg).length > 0; }
    hasOpenPush(cat, posNeg) { return this.isPushed(cat) && this.getOpenPushMods(cat, posNeg).length > 0; }
    isForcePushed(cat, posNeg) { return this.isPushed(cat) && this.getForcedPushMods(cat, posNeg).length > 0; }
    get rollCosts() {
        if (!this.isPushed) {
            return 0;
        }
        const harmPush = this.getRollModByID("Push-negative-roll");
        const rollPush = this.getRollModByID("Push-positive-roll");
        const effectPush = this.getRollModByID("Push-positive-effect");
        const negatePushCostMods = this.getActiveRollMods(RollModCategory.after, "positive")
            .filter((mod) => mod.effectKeys.includes("Negate-PushCost"));
        return ((harmPush?.isActive && harmPush?.stressCost) || 0)
            + ((rollPush?.isActive && rollPush?.stressCost) || 0)
            + ((effectPush?.isActive && effectPush?.stressCost) || 0)
            - (negatePushCostMods.length * 2);
    }
    get rollCostData() {
        return this.getActiveRollMods()
            .map((rollMod) => rollMod.costs ?? [])
            .flat();
    }
    getRollModByName(name, cat, posNeg) {
        const modMatches = this.rollMods.filter((rollMod) => U.lCase(rollMod.name) === U.lCase(name)
            && (!cat || rollMod.category === cat)
            && (!posNeg || rollMod.posNeg === posNeg));
        if (modMatches.length === 0) {
            return undefined;
        }
        if (modMatches.length > 1) {
            return undefined;
        }
        return modMatches[0];
    }
    getRollModByID(id) { return this.rollMods.find((rollMod) => rollMod.id === id); }
    getRollMods(cat, posNeg) {
        return this.rollMods.filter((rollMod) => (!cat || rollMod.category === cat)
            && (!posNeg || rollMod.posNeg === posNeg));
    }
    getVisibleRollMods(cat, posNeg) {
        return this.getRollMods(cat, posNeg).filter((rollMod) => rollMod.isVisible);
    }
    getActiveRollMods(cat, posNeg) {
        return this.getRollMods(cat, posNeg).filter((rollMod) => rollMod.isActive);
    }
    getVisibleInactiveRollMods(cat, posNeg) {
        return this.getVisibleRollMods(cat, posNeg).filter((rollMod) => !rollMod.isActive);
    }
    getPushMods(cat, posNeg) {
        return this.getRollMods(cat, posNeg).filter((rollMod) => rollMod.isPush);
    }
    getVisiblePushMods(cat, posNeg) {
        return this.getPushMods(cat, posNeg).filter((rollMod) => rollMod.isVisible);
    }
    getActivePushMods(cat, posNeg) {
        return this.getVisiblePushMods(cat, posNeg).filter((rollMod) => rollMod.isActive);
    }
    getActiveBasicPushMods(cat, posNeg) {
        return this.getActivePushMods(cat, posNeg).filter((rollMod) => rollMod.isBasicPush);
    }
    getInactivePushMods(cat, posNeg) {
        return this.getVisiblePushMods(cat, posNeg).filter((rollMod) => !rollMod.isActive);
    }
    getInactiveBasicPushMods(cat, posNeg) {
        return this.getInactivePushMods(cat, posNeg).filter((rollMod) => rollMod.isBasicPush);
    }
    getForcedPushMods(cat, posNeg) {
        return this.getActivePushMods(cat, posNeg)
            .filter((rollMod) => rollMod.isBasicPush
            && rollMod.status === RollModStatus.ForcedOn);
    }
    getOpenPushMods(cat, posNeg) {
        return this.getActivePushMods(cat, posNeg)
            .filter((rollMod) => rollMod.isBasicPush
            && rollMod.status === RollModStatus.ToggledOn);
    }
    getModsDelta = (cat) => {
        return U.sum([
            ...this.getActiveRollMods(cat, "positive").map((mod) => mod.value),
            ...this.getActiveRollMods(cat, "negative").map((mod) => -mod.value)
        ]);
    };
    _rollMods;
        compareMods(modA, modB) {
        const modOrder = ["Bargain", "Assist", "Setup"];
        if (modA.isBasicPush) {
            return -1;
        }
        if (modB.isBasicPush) {
            return 1;
        }
        if (modA.name === "Bargain" && modA.isActive) {
            return -1;
        }
        if (modB.name === "Bargain" && modB.isActive) {
            return 1;
        }
        if (modA.isPush) {
            return -1;
        }
        if (modB.isPush) {
            return 1;
        }
        const modAIndex = modOrder.indexOf(modA.name);
        const modBIndex = modOrder.indexOf(modB.name);
        if (modAIndex !== -1 && modBIndex !== -1) {
            return modAIndex - modBIndex;
        }
        return modA.name.localeCompare(modB.name);
    }
    get rollMods() {
        if (!this._rollMods) {
            throw new Error("[get rollMods] No roll mods found!");
        }
        return this._rollMods.sort((modA, modB) => this.compareMods(modA, modB));
    }
    set rollMods(val) { this._rollMods = val; }
    
    
        async getData() {
        const context = super.getData();
        if (!this.rollPrimary) {
            throw new Error("No roll source configured for roll.");
        }
        this.initRollMods(this.getRollModsData());
        this.rollMods.forEach((rollMod) => rollMod.applyRollModEffectKeys());
        const sheetData = this.getSheetData(this.getIsGM(), this.getRollCosts());
        return { ...context, ...sheetData };
    }
        getRollModsData() {
        const defaultMods = [
            ...BladesRollCollab.DefaultRollMods,
            ...this.rollPrimary?.rollModsData ?? []
        ];
        if (this.rollOpposition?.rollOppModsData) {
            return [
                ...defaultMods,
                ...this.rollOpposition.rollOppModsData
            ];
        }
        return defaultMods;
    }
        getIsGM() {
        return game.eunoblades.Tracker.system.is_spoofing_player ? false : game.user.isGM;
    }
        getRollCosts() {
        return this.getActiveRollMods()
            .map((rollMod) => rollMod.costs)
            .flat()
            .filter((costData) => costData !== undefined);
    }
        getStressCosts(rollCosts) {
        return rollCosts.filter((costData) => costData.costType === "Stress");
    }
        getTotalStressCost(stressCosts) {
        return U.sum(stressCosts.map((costData) => costData.costAmount));
    }
        getSpecArmorCost(rollCosts) {
        return rollCosts.find((costData) => costData.costType === "SpecialArmor");
    }
        getSheetData(isGM, rollCosts) {
        const { rData, rollPrimary, rollTraitData, rollTraitOptions, finalDicePool, finalPosition, finalEffect, finalResult, rollMods, rollFactors } = this;
        if (!rollPrimary) {
            throw new Error("A primary roll source is required for BladesRollCollab.");
        }
        const baseData = {
            ...this.rData,
            cssClass: "roll-collab",
            editable: this.options.editable,
            isGM,
            system: this.rollPrimary?.rollPrimaryDoc?.system,
            rollMods,
            rollPrimary,
            rollTraitData,
            rollTraitOptions,
            diceTotal: finalDicePool,
            rollOpposition: this.rollOpposition,
            rollEffects: Object.values(Effect),
            teamworkDocs: game.actors.filter((actor) => BladesActor.IsType(actor, BladesActorType.pc)),
            rollTraitValOverride: this.rollTraitValOverride,
            rollFactorPenaltiesNegated: this.rollFactorPenaltiesNegated,
            posRollMods: Object.fromEntries(Object.values(RollModCategory)
                .map((cat) => [cat, this.getRollMods(cat, "positive")])),
            negRollMods: Object.fromEntries(Object.values(RollModCategory)
                .map((cat) => [cat, this.getRollMods(cat, "negative")])),
            hasInactiveConditionals: this.calculateHasInactiveConditionalsData(),
            rollFactors,
            oddsGradient: this.calculateOddsGradient(finalDicePool, finalResult),
            costData: this.parseCostsHTML(this.getStressCosts(rollCosts), this.getSpecArmorCost(rollCosts))
        };
        const rollPositionData = this.calculatePositionData(finalPosition);
        const rollEffectData = this.calculateEffectData(isGM, finalEffect);
        const rollResultData = this.calculateResultData(isGM, finalResult);
        const GMBoostsData = this.calculateGMBoostsData(rData);
        const positionEffectTradeData = this.calculatePositionEffectTradeData();
        return {
            ...baseData,
            ...rollPositionData,
            ...rollEffectData,
            ...rollResultData,
            ...GMBoostsData,
            ...positionEffectTradeData
        };
    }
    calculatePositionData(finalPosition) {
        return {
            rollPositions: Object.values(Position),
            rollPositionFinal: finalPosition
        };
    }
    calculateEffectData(isGM, finalEffect) {
        return {
            rollEffects: Object.values(Effect),
            rollEffectFinal: finalEffect,
            isAffectingAfter: this.getVisibleRollMods(RollModCategory.after).length > 0
                || (isGM && this.getRollMods(RollModCategory.after).length > 0)
        };
    }
    calculateResultData(isGM, finalResult) {
        return {
            rollResultFinal: finalResult,
            isAffectingResult: finalResult > 0
                || this.getVisibleRollMods(RollModCategory.result).length > 0
                || (isGM && this.getRollMods(RollModCategory.result).length > 0)
        };
    }
    calculateGMBoostsData(flagData) {
        return {
            GMBoosts: {
                Dice: flagData.GMBoosts.Dice ?? 0,
                [Factor.tier]: flagData.GMBoosts[Factor.tier] ?? 0,
                [Factor.quality]: flagData.GMBoosts[Factor.quality] ?? 0,
                [Factor.scale]: flagData.GMBoosts[Factor.scale] ?? 0,
                [Factor.magnitude]: flagData.GMBoosts[Factor.magnitude] ?? 0,
                Result: flagData.GMBoosts.Result ?? 0
            },
            GMOppBoosts: {
                [Factor.tier]: flagData.GMOppBoosts[Factor.tier] ?? 0,
                [Factor.quality]: flagData.GMOppBoosts[Factor.quality] ?? 0,
                [Factor.scale]: flagData.GMOppBoosts[Factor.scale] ?? 0,
                [Factor.magnitude]: flagData.GMOppBoosts[Factor.magnitude] ?? 0
            }
        };
    }

        calculateOddsGradient(diceTotal, finalResult) {
        const oddsColors = {
            crit: "var(--blades-cyan)",
            success: "var(--blades-gold)",
            partial: "var(--blades-grey-bright)",
            fail: "var(--blades-black-dark)"
        };
        const odds = { ...C.DiceOdds[diceTotal] };
        if (finalResult < 0) {
            for (let i = finalResult; i < 0; i++) {
                oddsColors.crit = oddsColors.success;
                oddsColors.success = oddsColors.partial;
                oddsColors.partial = oddsColors.fail;
            }
        }
        else if (finalResult > 0) {
            for (let i = 0; i < finalResult; i++) {
                oddsColors.fail = oddsColors.partial;
                oddsColors.partial = oddsColors.success;
                oddsColors.success = oddsColors.crit;
            }
        }
        const gradientStops = {
            fail: odds.fail,
            partial: odds.fail + odds.partial,
            success: odds.fail + odds.partial + odds.success
        };
        gradientStops.fail = Math.min(100, Math.max(0, Math.max(gradientStops.fail / 2, gradientStops.fail - 10)));
        const critSpan = 100 - gradientStops.success;
        gradientStops.success = Math.min(100, Math.max(0, gradientStops.success - Math.max(critSpan / 2, critSpan - 10)));
        return [
            "linear-gradient(to right",
            `${oddsColors.fail} ${gradientStops.fail}%`,
            `${oddsColors.partial} ${gradientStops.partial}%`,
            `${oddsColors.success} ${gradientStops.success}%`,
            `${oddsColors.crit})`
        ].join(", ");
    }
        calculatePositionEffectTradeData() {
        const canTradePosition = this.posEffectTrade === "position" || (this.posEffectTrade === false
            && this.finalPosition !== Position.desperate
            && this.finalEffect !== Effect.extreme);
        const canTradeEffect = this.posEffectTrade === "effect" || (this.posEffectTrade === false
            && this.finalPosition !== Position.controlled
            && this.finalEffect !== Effect.zero);
        return { canTradePosition, canTradeEffect };
    }
        calculateHasInactiveConditionalsData() {
        const hasInactive = {};
        for (const category of Object.values(RollModCategory)) {
            hasInactive[category] = this.getRollMods(category).filter((mod) => mod.isInInactiveBlock).length > 0;
        }
        return hasInactive;
    }
        parseCostsHTML(stressCosts, specArmorCost) {
        if (specArmorCost || stressCosts.length > 0) {
            const totalStressCost = this.getTotalStressCost(stressCosts);
            return {
                footerLabel: [
                    "( Roll Costs",
                    totalStressCost > 0 ? `<span class='red-bright'><strong>${totalStressCost} Stress</strong></span>` : null,
                    specArmorCost && totalStressCost ? "and" : null,
                    specArmorCost ? "your <span class='cyan-bright'><strong>Special Armor</strong></span>" : null,
                    ")"
                ].filter((line) => Boolean(line)).join(" "),
                tooltip: [
                    "<h1>Roll Costs</h1><ul>",
                    ...stressCosts.map((costData) => `<li><strong class='shadowed'>${costData.label}: <span class='red-bright'>${costData.costAmount}</span> Stress</strong></li>`),
                    specArmorCost ? `<li><strong class='shadowed'>${specArmorCost.label}: <strong class='cyan-bright'>Special Armor</strong></strong></li>` : null,
                    "</ul>"
                ].filter((line) => Boolean(line)).join("")
            };
        }
        return undefined;
    }
    async OLDgetData() {
        const context = super.getData();
        const rData = this.rData;
        if (!this.rollPrimary) {
            throw new Error("No roll source configured for roll.");
        }
        const rollModsData = [
            ...BladesRollCollab.DefaultRollMods,
            ...this.rollPrimary.rollModsData ?? []
        ];
        if (this.rollOpposition?.rollOppModsData) {
            rollModsData.push(...this.rollOpposition.rollOppModsData);
        }
        this.initRollMods(rollModsData);
        this.rollMods.forEach((rollMod) => rollMod.applyRollModEffectKeys());
        const isGM = game.eunoblades.Tracker.system.is_spoofing_player ? false : game.user.isGM;
        const { rollPrimary, rollOpposition, rollTraitData, rollTraitOptions, finalPosition, finalEffect, finalResult, rollMods, posEffectTrade, rollFactors } = this;
        const rollCosts = this.getActiveRollMods()
            .map((rollMod) => rollMod.costs)
            .flat()
            .filter((costData) => costData !== undefined);
        const stressCosts = rollCosts.filter((costData) => costData.costType === "Stress");
        const specArmorCost = rollCosts.find((costData) => costData.costType === "SpecialArmor");
        const totalStressCost = U.sum(stressCosts.map((costData) => costData.costAmount));
        const sheetData = {
            ...rData,
            cssClass: "roll-collab",
            editable: this.options.editable,
            isGM,
            system: this.rollPrimary.rollPrimaryDoc?.system,
            rollMods,
            rollPrimary,
            rollTraitData,
            rollTraitOptions,
            diceTotal: this.finalDicePool,
            rollOpposition,
            rollPositions: Object.values(Position),
            rollEffects: Object.values(Effect),
            teamworkDocs: game.actors.filter((actor) => BladesActor.IsType(actor, BladesActorType.pc)),
            rollPositionFinal: finalPosition,
            rollEffectFinal: finalEffect,
            rollResultFinal: finalResult,
            isAffectingResult: finalResult > 0
                || this.getVisibleRollMods(RollModCategory.result).length > 0
                || (isGM && this.getRollMods(RollModCategory.result).length > 0),
            isAffectingAfter: this.getVisibleRollMods(RollModCategory.after).length > 0
                || (isGM && this.getRollMods(RollModCategory.after).length > 0),
            rollFactorPenaltiesNegated: this.rollFactorPenaltiesNegated,
            GMBoosts: {
                Dice: this.rData.GMBoosts.Dice ?? 0,
                [Factor.tier]: this.rData.GMBoosts[Factor.tier] ?? 0,
                [Factor.quality]: this.rData.GMBoosts[Factor.quality] ?? 0,
                [Factor.scale]: this.rData.GMBoosts[Factor.scale] ?? 0,
                [Factor.magnitude]: this.rData.GMBoosts[Factor.magnitude] ?? 0,
                Result: this.rData.GMBoosts.Result ?? 0
            },
            GMOppBoosts: {
                [Factor.tier]: this.rData.GMOppBoosts[Factor.tier] ?? 0,
                [Factor.quality]: this.rData.GMOppBoosts[Factor.quality] ?? 0,
                [Factor.scale]: this.rData.GMOppBoosts[Factor.scale] ?? 0,
                [Factor.magnitude]: this.rData.GMOppBoosts[Factor.magnitude] ?? 0
            },
            canTradePosition: posEffectTrade === "position"
                || (posEffectTrade === false
                    && finalPosition !== Position.desperate
                    && finalEffect !== Effect.extreme),
            canTradeEffect: posEffectTrade === "effect"
                || (posEffectTrade === false
                    && finalPosition !== Position.controlled
                    && finalEffect !== Effect.zero),
            posRollMods: Object.fromEntries(Object.values(RollModCategory)
                .map((cat) => [cat, this.getRollMods(cat, "positive")])),
            negRollMods: Object.fromEntries(Object.values(RollModCategory)
                .map((cat) => [cat, this.getRollMods(cat, "negative")])),
            hasInactiveConditionals: {
                [RollModCategory.roll]: this.getRollMods(RollModCategory.roll)
                    .filter((mod) => mod.isInInactiveBlock)
                    .length > 0,
                [RollModCategory.position]: this.getRollMods(RollModCategory.position)
                    .filter((mod) => mod.isInInactiveBlock)
                    .length > 0,
                [RollModCategory.effect]: this.getRollMods(RollModCategory.effect)
                    .filter((mod) => mod.isInInactiveBlock)
                    .length > 0,
                [RollModCategory.result]: this.getRollMods(RollModCategory.result)
                    .filter((mod) => mod.isInInactiveBlock)
                    .length > 0,
                [RollModCategory.after]: this.getRollMods(RollModCategory.after)
                    .filter((mod) => mod.isInInactiveBlock)
                    .length > 0
            },
            rollFactors,
            oddsGradient: ""
        };
        if (specArmorCost || totalStressCost) {
            sheetData.costData = {
                footerLabel: [
                    "( Roll Costs",
                    totalStressCost > 0
                        ? `<span class='red-bright'><strong>${totalStressCost} Stress</strong></span>`
                        : null,
                    specArmorCost && totalStressCost
                        ? "and"
                        : null,
                    specArmorCost
                        ? "your <span class='cyan-bright'><strong>Special Armor</strong></span>"
                        : null,
                    ")"
                ]
                    .filter((line) => Boolean(line))
                    .join(" "),
                tooltip: [
                    "<h1>Roll Costs</h1><ul>",
                    ...stressCosts.map((costData) => `<li><strong class='shadowed'>${costData.label}: <span class='red-bright'>${costData.costAmount}</span> Stress</strong></li>`),
                    specArmorCost
                        ? `<li><strong class='shadowed'>${specArmorCost.label}: <strong class='cyan-bright'>Special Armor</strong></strong></li>`
                        : null,
                    "</ul>"
                ]
                    .filter((line) => Boolean(line))
                    .join("")
            };
        }
        const oddsColors = {
            crit: "var(--blades-cyan)",
            success: "var(--blades-gold)",
            partial: "var(--blades-grey-bright)",
            fail: "var(--blades-black-dark)"
        };
        const odds = { ...C.DiceOdds[sheetData.diceTotal ?? 0] };
        if ((sheetData.rollResultFinal ?? 0) < 0) {
            for (let i = sheetData.rollResultFinal ?? 0; i < 0; i++) {
                oddsColors.crit = oddsColors.success;
                oddsColors.success = oddsColors.partial;
                oddsColors.partial = oddsColors.fail;
            }
        }
        else if ((sheetData.rollResultFinal ?? 0) > 0) {
            for (let i = 0; i < (sheetData.rollResultFinal ?? 0); i++) {
                oddsColors.fail = oddsColors.partial;
                oddsColors.partial = oddsColors.success;
                oddsColors.success = oddsColors.crit;
            }
        }
        const gradientStops = {
            fail: odds.fail,
            partial: odds.fail + odds.partial,
            success: odds.fail + odds.partial + odds.success
        };
        gradientStops.fail = Math.min(100, Math.max(0, Math.max(gradientStops.fail / 2, gradientStops.fail - 10)));
        const critSpan = 100 - gradientStops.success;
        gradientStops.success = Math.min(100, Math.max(0, gradientStops.success - Math.max(critSpan / 2, critSpan - 10)));
        sheetData.oddsGradient = [
            "linear-gradient(to right",
            `${oddsColors.fail} ${gradientStops.fail}%`,
            `${oddsColors.partial} ${gradientStops.partial}%`,
            `${oddsColors.success} ${gradientStops.success}%`,
            `${oddsColors.crit})`
        ].join(", ");
        sheetData.oddsGradientTestHTML = [
            "<div class='odds-gradient-test-html'>",
            `<div class='odds-gradient-box odds-gradient-fail' style='width: ${odds.fail}%;'></div>`,
            `<div class='odds-gradient-box odds-gradient-partial' style='width: ${odds.partial}%;'></div>`,
            `<div class='odds-gradient-box odds-gradient-success' style='width: ${odds.success}%;'></div>`,
            `<div class='odds-gradient-box odds-gradient-crit' style='width: ${odds.crit}%;'></div>`,
            "</div>"
        ].join("");
        return {
            ...context,
            ...sheetData
        };
    }
    
    _dieVals;
    get dieVals() {
        this._dieVals ??= this.roll.terms[0].results
            .map((result) => result.result)
            .sort()
            .reverse();
        return this._dieVals;
    }
    getDieClass(val, i) {
        if (val === 6 && i <= 1 && this.rollResult === RollResult.critical) {
            val++;
        }
        return [
            "",
            "blades-die-fail",
            "blades-die-fail",
            "blades-die-fail",
            "blades-die-partial",
            "blades-die-partial",
            "blades-die-success",
            "blades-die-critical"
        ][val];
    }
    get dieValsHTML() {
        const dieVals = [...this.dieVals];
        const ghostNum = this.isRollingZero ? dieVals.shift() : null;
        if (this.rollType === RollType.Resistance) {
            return [
                ...dieVals.map((val, i) => `<span class='blades-die ${i === 0 ? "blades-die-resistance" : "blades-die-fail"} blades-die-${val}'><img src='systems/eunos-blades/assets/dice/faces/${val}.webp' /></span>`),
                ghostNum ? `<span class='blades-die blades-die-ghost blades-die-${ghostNum}'><img src='systems/eunos-blades/assets/dice/faces/${ghostNum}.webp' /></span>` : null
            ]
                .filter((val) => typeof val === "string")
                .join("");
        }
        else {
            return [
                ...dieVals.map(this.getDieClass),
                ghostNum ? `<span class='blades-die blades-die-ghost blades-die-${ghostNum}'><img src='systems/eunos-blades/assets/dice/faces/${ghostNum}.webp' /></span>` : null
            ]
                .filter((val) => typeof val === "string")
                .join("");
        }
    }
    get rollResult() {
        const dieVals = this.isRollingZero
            ? [[...this.dieVals].pop()]
            : this.dieVals;
        if (dieVals.filter((val) => val === 6).length >= 2) {
            return RollResult.critical;
        }
        if (dieVals.find((val) => val === 6)) {
            return RollResult.success;
        }
        if (dieVals.find((val) => val && val >= 4)) {
            return RollResult.partial;
        }
        return RollResult.fail;
    }
    async outputRollToChat() {
        const speaker = ChatMessage.getSpeaker();
        let renderedHTML;
        switch (this.rollType) {
            case RollType.Action: {
                renderedHTML = await renderTemplate("systems/eunos-blades/templates/chat/action-roll.hbs", {
                    sourceName: this.rollPrimary?.rollPrimaryName ?? "",
                    oppName: this.rollOpposition?.rollOppName,
                    type: U.lCase(this.rollType),
                    subType: U.lCase(this.rollSubType),
                    downtimeAction: U.lCase(this.rollDowntimeAction),
                    position: this.finalPosition,
                    effect: this.finalEffect,
                    result: this.rollResult,
                    trait_label: typeof this.rollTrait === "number" ? `${this.rollTrait} Dice` : U.tCase(this.rollTrait),
                    dieVals: this.dieValsHTML
                });
                break;
            }
            case RollType.Resistance: {
                renderedHTML = await renderTemplate("systems/eunos-blades/templates/chat/resistance-roll.hbs", {
                    dieVals: this.dieValsHTML,
                    result: this.rollResult,
                    trait_label: typeof this.rollTrait === "number" ? `${this.rollTrait} Dice` : U.tCase(this.rollTrait),
                    stress: this.resistanceStressCost
                });
                break;
            }
            case RollType.Downtime: {
                break;
            }
            case RollType.Fortune: {
                break;
            }
        }
        const messageData = {
            speaker: speaker,
            content: renderedHTML,
            type: CONST.CHAT_MESSAGE_TYPES.ROLL,
            roll: this.roll
        };
        CONFIG.ChatMessage.documentClass.create(messageData, {});
    }
    async makeRoll() {
        await this.roll.evaluate({ async: true });
        await this.outputRollToChat();
        this.close();
    }

    async _toggleRollModClick(event) {
        event.preventDefault();
        const elem$ = $(event.currentTarget);
        const id = elem$.data("id");
        const rollMod = this.getRollModByID(id);
        if (!rollMod) {
            throw new Error(`Unable to find roll mod with id '${id}'`);
        }
        switch (rollMod.status) {
            case RollModStatus.Hidden:
                rollMod.user_status = RollModStatus.ForcedOff;
                return;
            case RollModStatus.ForcedOff:
                rollMod.user_status = RollModStatus.ToggledOff;
                return;
            case RollModStatus.ToggledOff:
                rollMod.user_status = RollModStatus.ToggledOn;
                return;
            case RollModStatus.ToggledOn:
                rollMod.user_status = game.user.isGM ? RollModStatus.ForcedOn : RollModStatus.ToggledOff;
                return;
            case RollModStatus.ForcedOn:
                rollMod.user_status = RollModStatus.Hidden;
                return;
        }
    }
    async _toggleRollModContext(event) {
        event.preventDefault();
        if (!game.user.isGM) {
            return;
        }
        const elem$ = $(event.currentTarget);
        const id = elem$.data("id");
        const rollMod = this.getRollModByID(id);
        if (!rollMod) {
            throw new Error(`Unable to find roll mod with id '${id}'`);
        }
        switch (rollMod.status) {
            case RollModStatus.Hidden:
                rollMod.user_status = RollModStatus.ToggledOff;
                return;
            case RollModStatus.ForcedOff:
                rollMod.user_status = RollModStatus.Hidden;
                return;
            case RollModStatus.ToggledOff:
                rollMod.user_status = RollModStatus.ForcedOff;
                return;
            case RollModStatus.ToggledOn:
                rollMod.user_status = RollModStatus.ToggledOff;
                return;
            case RollModStatus.ForcedOn:
                rollMod.user_status = RollModStatus.Hidden;
                return;
        }
    }
    async _gmControlSet(event) {
        event.preventDefault();
        if (!game.user.isGM) {
            return;
        }
        const elem$ = $(event.currentTarget);
        const id = elem$.data("id");
        const status = elem$.data("status");
        this.getRollModByID(id).user_status = status;
    }
    async _gmControlSetTargetToValue(event) {
        event.preventDefault();
        if (!game.user.isGM) {
            return;
        }
        const elem$ = $(event.currentTarget);
        const target = elem$.data("target").replace(/flags\.eunos-blades\./, "");
        const value = elem$.data("value");
        this.document.setFlag(C.SYSTEM_ID, target, value);
    }
    async _gmControlResetTarget(event) {
        event.preventDefault();
        if (!game.user.isGM) {
            return;
        }
        const elem$ = $(event.currentTarget);
        const target = elem$.data("target").replace(/flags\.eunos-blades\./, "");
        this.document.unsetFlag(C.SYSTEM_ID, target);
    }
    async _gmControlReset(event) {
        event.preventDefault();
        if (!game.user.isGM) {
            return;
        }
        const elem$ = $(event.currentTarget);
        const id = elem$.data("id");
        this.getRollModByID(id).user_status = undefined;
    }
    async _gmControlSetPosition(event) {
        event.preventDefault();
        if (!game.user.isGM) {
            return;
        }
        const elem$ = $(event.currentTarget);
        const position = elem$.data("status");
        this.initialPosition = position;
    }
    async _gmControlSetEffect(event) {
        event.preventDefault();
        if (!game.user.isGM) {
            return;
        }
        const elem$ = $(event.currentTarget);
        const effect = elem$.data("status");
        this.initialEffect = effect;
    }
    async _gmControlToggleFactor(event) {
        event.preventDefault();
        if (!game.user.isGM) {
            return;
        }
        const elem$ = $(event.currentTarget);
        const target = elem$.data("target");
        const value = !elem$.data("value");
        eLog.checkLog3("toggleFactor", "_gmControlToggleFactor", { event, target, value });
        if (value && /isPrimary/.test(target)) {
            const [_, thisSource, thisFactor] = target.match(/([^.]+)\.([^.]+)\.isPrimary/);
            eLog.checkLog3("toggleFactor", "_gmControlToggleFactor - IN", { thisSource, thisFactor });
            await Promise.all(Object.values(Factor).map((factor) => {
                if (factor === thisFactor) {
                    eLog.checkLog3("toggleFactor", `_gmControlToggleFactor - Checking ${factor} === ${thisFactor} === TRUE`, { factor, thisFactor, target, customTarget: `rollCollab.rollFactorToggles.${thisSource}.${factor}.isPrimary` });
                    return this.document.setFlag(C.SYSTEM_ID, `rollCollab.rollFactorToggles.${thisSource}.${factor}.isPrimary`, true);
                }
                else {
                    eLog.checkLog3("toggleFactor", `_gmControlToggleFactor - Checking ${factor} === ${thisFactor} === FALSE`, { factor, thisFactor, target, customTarget: `rollCollab.rollFactorToggles.${thisSource}.${factor}.isPrimary` });
                    return this.document.setFlag(C.SYSTEM_ID, `rollCollab.rollFactorToggles.${thisSource}.${factor}.isPrimary`, false);
                }
            }));
            eLog.checkLog3("toggleFactor", "_gmControlToggleFactor - ALL DONE", { flags: this.document.getFlag(C.SYSTEM_ID, "rollCollab.rollFactorToggles") });
        }
        else {
            this.document.setFlag(C.SYSTEM_ID, `rollCollab.${target}`, value);
        }
    }
    async _gmControlResetFactor(event) {
        event.preventDefault();
        if (!game.user.isGM) {
            return;
        }
        const elem$ = $(event.currentTarget);
        const target = elem$.data("target");
        this.document.unsetFlag(C.SYSTEM_ID, `rollCollab.${target}`);
    }
    get resistanceStressCost() {
        const dieVals = this.dieVals;
        if (this.rollResult === RollResult.critical) {
            return -1;
        }
        if (this.isRollingZero) {
            dieVals.shift();
        }
        return 6 - dieVals.shift();
    }

    activateListeners(html) {
        super.activateListeners(html);
        ApplyTooltipListeners(html);
        html.find(".roll-mod[data-action='toggle']").on({
            click: this._toggleRollModClick.bind(this)
        });
        html.find("[data-action='tradePosition']").on({
            click: (event) => {
                const curVal = `${$(event.currentTarget).data("value")}`;
                if (curVal === "false") {
                    this.document.setFlag(C.SYSTEM_ID, "rollCollab.rollPosEffectTrade", "effect");
                }
                else {
                    this.document.setFlag(C.SYSTEM_ID, "rollCollab.rollPosEffectTrade", false);
                }
            }
        });
        html.find("[data-action='tradeEffect']").on({
            click: (event) => {
                const curVal = `${$(event.currentTarget).data("value")}`;
                if (curVal === "false") {
                    this.document.setFlag(C.SYSTEM_ID, "rollCollab.rollPosEffectTrade", "position");
                }
                else {
                    this.document.setFlag(C.SYSTEM_ID, "rollCollab.rollPosEffectTrade", false);
                }
            }
        });
        html.find("[data-action='roll']").on({
            click: () => this.makeRoll()
        });
        if (!game.user.isGM) {
            return;
        }
        html.on({
            focusin: () => { BladesRollCollab.Active = this; }
        });
        html.find("[data-action='gm-set'").on({
            click: this._gmControlSet.bind(this)
        });
        html.find("[data-action='gm-reset'").on({
            click: this._gmControlReset.bind(this)
        });
        html.find("[data-action='gm-set-position'").on({
            click: this._gmControlSetPosition.bind(this)
        });
        html.find("[data-action='gm-set-effect'").on({
            click: this._gmControlSetEffect.bind(this)
        });
        html.find("[data-action='gm-set-target'").on({
            click: this._gmControlSetTargetToValue.bind(this),
            contextmenu: this._gmControlResetTarget.bind(this)
        });
        html.find("[data-action='gm-toggle-factor'").on({
            click: this._gmControlToggleFactor.bind(this),
            contextmenu: this._gmControlResetFactor.bind(this)
        });
        html.find(".controls-toggle").on({
            click: (event) => {
                event.preventDefault();
                $(event.currentTarget).parents(".controls-panel").toggleClass("active");
            }
        });
    }

    _canDragDrop(selector) {
        eLog.checkLog3("canDragDrop", "Can DragDrop Selector", { selector });
        return game.user.isGM;
    }
    _onDrop(event) {
        const data = TextEditor.getDragEventData(event);
        const { type, uuid } = data;
        const [id] = (uuid.match(new RegExp(`${type}\\.(.+)`)) ?? []).slice(1);
        const oppDoc = game[`${U.lCase(type)}s`].get(id);
        if (BladesRollOpposition.IsDoc(oppDoc)) {
            this.rollOpposition = oppDoc;
        }
    }
    async _onSubmit(event, { updateData } = {}) {
        return super._onSubmit(event, { updateData, preventClose: true })
            .then((returnVal) => { this.render(); return returnVal; });
    }
    async close(options = {}) {
        if (options.rollID) {
            return super.close({});
        }
        this.document.setFlag(C.SYSTEM_ID, "rollCollab", null);
        socketlib.system.executeForEveryone("closeRollCollab", this.rollID);
        return undefined;
    }
    render(force, options) {
        if (!this.document.getFlag(C.SYSTEM_ID, "rollCollab")) {
            return this;
        }
        return super.render(force, options);
    }
}
export const BladesRollCollabComps = {
    Mod: BladesRollMod,
    Primary: BladesRollPrimary,
    Opposition: BladesRollOpposition,
    Participant: BladesRollParticipant
};
export default BladesRollCollab;
//# sourceMappingURL=blades-roll-collab.js.map
//# sourceMappingURL=blades-roll-collab.js.map
