// @ts-nocheck

/* #region Localization of General Terms */

/* Just fill in the translation inside the quotes. */
const TERMS = {
  "downtime":             "",
  "downtime action":      "",
  "consequence":          "",
  "roll":                 "",
  "position":             "",
  "effect":               "",
  "die":                  "", // one die
  "dice":                 "", // multiple dice
  "result":               "",
  "loadout":              "",
  "attribute":            "",
  "action":               "",
  "tooltip":              "",
  "Gamemaster":           "",
  "GM":                   "",
  "difficulty":           "",
  "controlled":           "",
  "risky":                "",
  "desperate":            "",
  "critical":             "",
  "success":              "",
  "fail":                 "",
  // Attributes
  "insight":              "",
  "prowess":              "",
  "resolve":              "",
  // Actions
  "hunt":                 "",
  "study":                "",
  "survey":               "",
  "tinker":               "",
  "finesse":              "",
  "prowl":                "",
  "skirmish":             "",
  "wreck":                "",
  "attune":               "",
  "command":              "",
  "consort":              "",
  "sway":                 "",
  // Playbooks (Scoundrel)
  "cutter":               "",
  "hound":                "",
  "leech":                "",
  "lurk":                 "",
  "slide":                "",
  "spider":               "",
  "whisper":              "",
  "ghost":                "",
  "hull":                 "",
  "vampire":              "",
  // Playbooks (Crew)
  "assassins":            "",
  "bravos":               "",
  "cult":                 "",
  "hawkers":              "",
  "shadows":              "",
  "smugglers":            "",
  // Vices
  "faith":                "",
  "gambling":             "",
  "luxury":               "",
  "obligation":           "",
  "pleasure":             "",
  "stupor":               "",
  "weird":                "",
  "worship":              "", // (special cult vice)
  "living essence":       "", // (ghosts)
  "life essence":         "", // (vampires)
  "electroplasmic power": "" // (hulls)
};
// #endregion

// #region Localization of Hard-Coded Values

/* Only translate the values (i.e. the quoted strings on the right); don't change the keys, as they are hard-coded (but won't be displayed anyways). */
const C = {
  SYSTEM_NAME:           "Euno's Blades",
  SYSTEM_FULL_NAME:      "Euno's Blades In The Dark",
  DowntimeActionDisplay: {
    [DowntimeAction.AcquireAsset]:    "Acquire an Asset",
    [DowntimeAction.IndulgeVice]:     "Indulge Your Vice",
    [DowntimeAction.LongTermProject]: "Work on a Project",
    [DowntimeAction.Recover]:         "Heal",
    [DowntimeAction.ReduceHeat]:      "Reduce the Crew's Heat",
    [DowntimeAction.Train]:           "Train"
  },
  ConsequenceDisplay: {
    [ConsequenceType.ReducedEffect]:       "Reduced Effect",
    [ConsequenceType.ComplicationMinor]:   "Minor Complication",
    [ConsequenceType.ComplicationMajor]:   "Major Complication",
    [ConsequenceType.ComplicationSerious]: "Serious Complication",
    [ConsequenceType.LostOpportunity]:     "Lost Opportunity",
    [ConsequenceType.WorsePosition]:       "Worse Position",
    [ConsequenceType.InsightHarm1]:        "Level 1 Harm (Lesser)",
    [ConsequenceType.InsightHarm2]:        "Level 2 Harm (Moderate)",
    [ConsequenceType.InsightHarm3]:        "Level 3 Harm (Severe)",
    [ConsequenceType.InsightHarm4]:        "Level 4 Harm (FATAL)",
    [ConsequenceType.ProwessHarm1]:        "Level 1 Harm (Lesser)",
    [ConsequenceType.ProwessHarm2]:        "Level 2 Harm (Moderate)",
    [ConsequenceType.ProwessHarm3]:        "Level 3 Harm (Severe)",
    [ConsequenceType.ProwessHarm4]:        "Level 4 Harm (FATAL)",
    [ConsequenceType.ResolveHarm1]:        "Level 1 Harm (Lesser)",
    [ConsequenceType.ResolveHarm2]:        "Level 2 Harm (Moderate)",
    [ConsequenceType.ResolveHarm3]:        "Level 3 Harm (Severe)",
    [ConsequenceType.ResolveHarm4]:        "Level 4 Harm (FATAL)",
    [ConsequenceType.None]:                "None"
  },
  RollResultDescriptions: {
    [Position.controlled]: {
      [RollResult.critical]: "You critically succeed from a controlled position!",
      [RollResult.success]:  "You fully succeed from a controlled position!",
      [RollResult.partial]:  "You partially succeed from a controlled position!",
      [RollResult.fail]:     "You fail from a controlled position!"
    },
    [Position.risky]: {
      [RollResult.critical]: "You critically succeed from a risky position!",
      [RollResult.success]:  "You fully succeed from a risky position!",
      [RollResult.partial]:  "You partially succeed from a risky position!",
      [RollResult.fail]:     "You fail from a risky position!"
    },
    [Position.desperate]: {
      [RollResult.critical]: "You critically succeed from a desperate position!",
      [RollResult.success]:  "You fully succeed from a desperate position!",
      [RollResult.partial]:  "You partially succeed from a desperate position!",
      [RollResult.fail]:     "You fail from a desperate position!"
    }
  },

  Loadout: {
    selections: [ /* Leave 'value' unchanged; only translate 'display' */
      {value: "Light", display: "Light"},
      {value: "Normal", display: "Normal"},
      {value: "Heavy", display: "Heavy"}
    ]
  },
  AttributeTooltips: {
    [AttributeTrait.insight]: "<p>Resists consequences from <strong>deception</strong> or <strong>understanding</strong></p>",
    [AttributeTrait.prowess]: "<p>Resists consequences from <strong>physical strain</strong> or <strong>injury</strong></p>",
    [AttributeTrait.resolve]: "<p>Resists consequences from <strong>mental strain</strong> or <strong>willpower</strong></p>"
  },
  ShortAttributeTooltips: {
    [AttributeTrait.insight]: "vs. <strong>deception</strong> or <strong>(mis)understanding</strong>",
    [AttributeTrait.prowess]: "vs. <strong>physical strain</strong> or <strong>injury</strong>",
    [AttributeTrait.resolve]: "vs. <strong>mental strain</strong> or <strong>willpower</strong>"
  },
  ShortActionTooltips: {
    [ActionTrait.hunt]:     "carefully track a target",
    [ActionTrait.study]:    "scrutinize details and interpret evidence",
    [ActionTrait.survey]:   "observe the situation and anticipate outcomes",
    [ActionTrait.tinker]:   "fiddle with devices and mechanisms",
    [ActionTrait.finesse]:  "employ dexterity or subtle misdirection",
    [ActionTrait.prowl]:    "traverse skillfully and quietly",
    [ActionTrait.skirmish]: "entangle a target in melee so they can't escape",
    [ActionTrait.wreck]:    "unleash savage force",
    [ActionTrait.attune]:   "open your mind to the ghost field or channel nearby electroplasmic energy through your body",
    [ActionTrait.command]:  "compel swift obedience",
    [ActionTrait.consort]:  "socialize with friends and contacts",
    [ActionTrait.sway]:     "influence someone with guile, charm, or argument"
  },
  ActionTooltips: {
    [ActionTrait.hunt]:     "<p>When you <strong>Hunt</strong>, you carefully track a target.</p><ul><li>You might follow a person or discover their location.</li><li>You might arrange an ambush.</li><li>You might attack with precision shooting from a distance.</li></ul><ul><li>You could try to wield your guns in a melee <em>(but <strong>Skirmishing</strong> might be better)</em>.</li></ul>",
    [ActionTrait.study]:    "<p>When you <strong>Study</strong>, you scrutinize details and interpret evidence.</p><ul><li>You might gather information from documents, newspapers, and books.</li><li>You might do research on an esoteric topic.</li><li>You might closely analyze a person to detect lies or true feelings.</li></ul><ul><li>You could try to understand a pressing situation <em>(but <strong>Surveying</strong> might be better)</em>.</li></ul>",
    [ActionTrait.survey]:   "<p>When you <strong>Survey</strong>, you observe the situation and anticipate outcomes.</p><ul><li>You might spot telltale signs of trouble before it happens.</li><li>You might uncover opportunities or weaknesses.</li></ul><ul><li>You might detect a person's motives or intentions <em>(but <strong>Studying</strong> might be better)</em>.</li><li>You could try to spot a good ambush point <em>(but <strong>Hunting</strong> might be better)</em>.</li></ul>",
    [ActionTrait.tinker]:   "<p>When you <strong>Tinker</strong>, you fiddle with devices and mechanisms.</p><ul><li>You might create a new gadget or alter an existing item.</li><li>You might pick a lock or crack a safe.</li><li>You might disable an alarm or trap.</li><li>You might turn the sparkcraft and electroplasmic devices around the city to your advantage.</li></ul><ul><li>You could try to control a vehicle with your tech-savvy <em>(but <strong>Finessing</strong> might be better)</em>.</li></ul>",
    [ActionTrait.finesse]:  "<p>When you <strong>Finesse</strong>, you employ dexterity or subtle misdirection.</p><ul><li>You might pick someone's pocket.</li><li>You might handle the controls of a vehicle or direct a mount.</li><li>You might formally duel an opponent with graceful fighting arts.</li></ul><ul><li>You could try to leverage agility in a melee <em>(but <strong>Skirmishing</strong> might be better)</em>.</li><li>You could try to pick a lock <em>(but <strong>Tinkering</strong> might be better)</em>.</li></ul>",
    [ActionTrait.prowl]:    "<p>When you <strong>Prowl</strong>, you traverse skillfully and quietly.</p><ul><li>You might sneak past a guard or hide in the shadows.</li><li>You might run and leap across the rooftops.</li><li>You might attack someone from hiding with a back-stab or blackjack.</li></ul><ul><li>You could try to waylay a victim during combat <em>(but <strong>Skirmishing</strong> might be better)</em>.</li></ul>",
    [ActionTrait.skirmish]: "<p>When you <strong>Skirmish</strong>, you entangle a target in melee so they can't escape.</p><ul><li>You might brawl or wrestle with them.</li><li>You might hack and slash.</li><li>You might seize or hold a position in battle.</li></ul><ul><li>You could try to fight in a formal duel <em>(but <strong>Finessing</strong> might be better)</em>.</li></ul>",
    [ActionTrait.wreck]:    "<p>When you <strong>Wreck</strong>, you unleash savage force.</p><ul><li>You might smash down a door or wall with a sledgehammer.</li><li>You might use an explosive to do the same.</li><li>You might use chaos or sabotage to create distractions or overcome obstacles.</li></ul><ul><li>You could try to overwhelm an enemy with sheer force in battle <em>(but <strong>Skirmishing</strong> might be better)</em>.</li></ul>",
    [ActionTrait.attune]:   "<p>When you <strong>Attune</strong>, you open your mind to the ghost field or channel nearby electroplasmic energy through your body.</p><ul><li>You might communicate with a ghost or understand aspects of spectrology.</li><li>You might peer into the echo of Doskvol in the ghost field.</li></ul><ul><li>You could try to perceive beyond sight in order to better understand your situation <em>(but <strong>Surveying</strong> might be better)</em>.</li></ul>",
    [ActionTrait.command]:  "<p>When you <strong>Command</strong>, you compel swift obedience.</p><ul><li>You might intimidate or threaten to get what you want.</li><li>You might lead a gang in a group action.</li></ul><ul><li>You could try to persuade people by giving orders <em>(but <strong>Consorting</strong> might be better)</em>.</li></ul>",
    [ActionTrait.consort]:  "<p>When you <strong>Consort</strong>, you socialize with friends and contacts.</p><ul><li>You might gain access to resources, information, people, or places.</li><li>You might make a good impression or win someone over with charm and style.</li><li>You might make new friends or connect with your heritage or background.</li></ul><ul><li>You could try to direct allies with social pressure <em>(but <strong>Commanding</strong> might be better)</em>.</li></ul>",
    [ActionTrait.sway]:     "<p>When you <strong>Sway</strong>, you influence someone with guile, charm, or argument.</p><ul><li>You might lie convincingly.</li><li>You might persuade someone to do what you want.</li><li>You might argue a case that leaves no clear rebuttal.</li></ul><ul><li>You could try to trick people into affection or obedience <em>(but <strong>Consorting</strong> or <strong>Commanding</strong> might be better)</em>.</li></ul>"
  },
  ActionTooltipsGM: {
    [ActionTrait.hunt]:     "<p>When you <strong>Hunt</strong>, you carefully track a target.</p><ul><li>You might follow a person or discover their location.</li><li>You might arrange an ambush.</li><li>You might attack with precision shooting from a distance.</li></ul><ul><li>You could try to wield your guns in a melee <em>(but <strong>Skirmishing</strong> might be better)</em>.</li></ul><hr><ul><li>How do you hunt them down?</li><li>What methods do you use?</li><li>What do you hope to achieve?</li></ul>",
    [ActionTrait.study]:    "<p>When you <strong>Study</strong>, you scrutinize details and interpret evidence.</p><ul><li>You might gather information from documents, newspapers, and books.</li><li>You might do research on an esoteric topic.</li><li>You might closely analyze a person to detect lies or true feelings.</li></ul><ul><li>You could try to understand a pressing situation <em>(but <strong>Surveying</strong> might be better)</em>.</li></ul><hr><ul><li>What do you study?</li><li>What details or evidence do you scrutinize?</li><li>What do you hope to understand?</li></ul>",
    [ActionTrait.survey]:   "<p>When you <strong>Survey</strong>, you observe the situation and anticipate outcomes.</p><ul><li>You might spot telltale signs of trouble before it happens.</li><li>You might uncover opportunities or weaknesses.</li></ul><ul><li>You might detect a person's motives or intentions <em>(but <strong>Studying</strong> might be better)</em>.</li><li>You could try to spot a good ambush point <em>(but <strong>Hunting</strong> might be better)</em>.</li></ul><hr><ul><li>How do you survey the situation?</li><li>Is there anything special you're looking out for?</li><li>What do you hope to understand?</li></ul>",
    [ActionTrait.tinker]:   "<p>When you <strong>Tinker</strong>, you fiddle with devices and mechanisms.</p><ul><li>You might create a new gadget or alter an existing item.</li><li>You might pick a lock or crack a safe.</li><li>You might disable an alarm or trap.</li><li>You might turn the sparkcraft and electroplasmic devices around the city to your advantage.</li></ul><ul><li>You could try to control a vehicle with your tech-savvy <em>(but <strong>Finessing</strong> might be better)</em>.</li></ul><hr><ul><li>What do you tinker with?</li><li>What do you hope to accomplish?</li></ul>",
    [ActionTrait.finesse]:  "<p>When you <strong>Finesse</strong>, you employ dexterity or subtle misdirection.</p><ul><li>You might pick someone's pocket.</li><li>You might handle the controls of a vehicle or direct a mount.</li><li>You might formally duel an opponent with graceful fighting arts.</li></ul><ul><li>You could try to leverage agility in a melee <em>(but <strong>Skirmishing</strong> might be better)</em>.</li><li>You could try to pick a lock <em>(but <strong>Tinkering</strong> might be better)</em>.</li></ul><hr><ul><li>What do you finesse?</li><li>What's graceful or subtle about this?</li><li>What do you hope to achieve?</li></ul>",
    [ActionTrait.prowl]:    "<p>When you <strong>Prowl</strong>, you traverse skillfully and quietly.</p><ul><li>You might sneak past a guard or hide in the shadows.</li><li>You might run and leap across the rooftops.</li><li>You might attack someone from hiding with a back-stab or blackjack.</li></ul><ul><li>You could try to waylay a victim during combat <em>(but <strong>Skirmishing</strong> might be better)</em>.</li></ul><hr><ul><li>How do you prowl?</li><li>How do you use the environment around you?</li><li>What do you hope to achieve?</li></ul>",
    [ActionTrait.skirmish]: "<p>When you <strong>Skirmish</strong>, you entangle a target in melee so they can't escape.</p><ul><li>You might brawl or wrestle with them.</li><li>You might hack and slash.</li><li>You might seize or hold a position in battle.</li></ul><ul><li>You could try to fight in a formal duel <em>(but <strong>Finessing</strong> might be better)</em>.</li></ul><hr><ul><li>How do you skirmish with them?</li><li>What combat methods do you use?</li><li>What do you hope to achieve?</li></ul>",
    [ActionTrait.wreck]:    "<p>When you <strong>Wreck</strong>, you unleash savage force.</p><ul><li>You might smash down a door or wall with a sledgehammer.</li><li>You might use an explosive to do the same.</li><li>You might use chaos or sabotage to create distractions or overcome obstacles.</li></ul><ul><li>You could try to overwhelm an enemy with sheer force in battle <em>(but <strong>Skirmishing</strong> might be better)</em>.</li></ul><hr><ul><li>What do you wreck?</li><li>What force do you bring to bear?</li><li>What do you hope to accomplish?</li></ul>",
    [ActionTrait.attune]:   "<p>When you <strong>Attune</strong>, you open your mind to the ghost field or channel nearby electroplasmic energy through your body.</p><ul><li>You might communicate with a ghost or understand aspects of spectrology.</li><li>You might peer into the echo of Doskvol in the ghost field.</li></ul><ul><li>You could try to perceive beyond sight in order to better understand your situation <em>(but <strong>Surveying</strong> might be better)</em>.</li></ul><hr><ul><li>How do you open your mind to the ghost field?</li><li>What does that look like?</li><li>What energy are you attuning to?</li><li>How are you channeling that energy?</li><li>What do you hope the energy will do?</li></ul>",
    [ActionTrait.command]:  "<p>When you <strong>Command</strong>, you compel swift obedience.</p><ul><li>You might intimidate or threaten to get what you want.</li><li>You might lead a gang in a group action.</li></ul><ul><li>You could try to persuade people by giving orders <em>(but <strong>Consorting</strong> might be better)</em>.</li></ul><hr><ul><li>Who do you command?</li><li>How do you do it—what's your leverage here?</li><li>What do you hope they'll do?</li></ul>",
    [ActionTrait.consort]:  "<p>When you <strong>Consort</strong>, you socialize with friends and contacts.</p><ul><li>You might gain access to resources, information, people, or places.</li><li>You might make a good impression or win someone over with charm and style.</li><li>You might make new friends or connect with your heritage or background.</li></ul><ul><li>You could try to direct allies with social pressure <em>(but <strong>Commanding</strong> might be better)</em>.</li></ul><hr><ul><li>Who do you consort with?</li><li>Where do you meet?</li><li>What do you talk about?</li><li>What do you hope to achieve?</li></ul>",
    [ActionTrait.sway]:     "<p>When you <strong>Sway</strong>, you influence someone with guile, charm, or argument.</p><ul><li>You might lie convincingly.</li><li>You might persuade someone to do what you want.</li><li>You might argue a case that leaves no clear rebuttal.</li></ul><ul><li>You could try to trick people into affection or obedience <em>(but <strong>Consorting</strong> or <strong>Commanding</strong> might be better)</em>.</li></ul><hr><ul><li>Who do you sway?</li><li>What kind of leverage do you have here?</li><li>What do you hope they'll do?</li></ul>"
  },
  ActionVerbs: {/* for sentences like "<name> <verb>s", e.g. "Alistair hunts" */
    [ActionTrait.hunt]:     "hunts",
    [ActionTrait.study]:    "studies",
    [ActionTrait.survey]:   "surveys",
    [ActionTrait.tinker]:   "tinkers",
    [ActionTrait.finesse]:  "finesses",
    [ActionTrait.prowl]:    "prowls",
    [ActionTrait.skirmish]: "skirmishes",
    [ActionTrait.wreck]:    "wrecks",
    [ActionTrait.attune]:   "attunes",
    [ActionTrait.command]:  "commands",
    [ActionTrait.consort]:  "consorts",
    [ActionTrait.sway]:     "sways"
  },
  ActionPastVerbs: {/* for past-tense sentences like "<name> <verb>ed", e.g. "Alistair hunted" */
    [ActionTrait.hunt]:     "hunted",
    [ActionTrait.study]:    "studied",
    [ActionTrait.survey]:   "surveyed",
    [ActionTrait.tinker]:   "tinkered",
    [ActionTrait.finesse]:  "finessed",
    [ActionTrait.prowl]:    "prowled",
    [ActionTrait.skirmish]: "skirmished",
    [ActionTrait.wreck]:    "wrecked",
    [ActionTrait.attune]:   "attuned",
    [ActionTrait.command]:  "commanded",
    [ActionTrait.consort]:  "consorted",
    [ActionTrait.sway]:     "swayed"
  },
  TraumaTooltips: {
    Cold:        "You're not moved by emotional appeals or social bonds.",
    Haunted:     "You're often lost in reverie, reliving past horrors, seeing things.",
    Obsessed:    "You're enthralled by one thing: an activity, a person, an ideology.",
    Paranoid:    "You imagine danger everywhere; you can't trust others.",
    Reckless:    "You have little regard for your own safety or best interests.",
    Soft:        "You lose your edge; you become sentimental, passive, gentle.",
    Unstable:    "Your emotional state is volatile. You can instantly rage, or fall into despair, act impulsively, or freeze up.",
    Vicious:     "You seek out opportunities to hurt people, even for no good reason.",
    Chaotic:     "You've become so detached from the living that inhibitions fall away, leaving you impulsive and unpredictable.",
    Destructive: "You are easily angered by reminders of all you've lost, and can lash out violently against the trappings of the living world.",
    Furious:     "Your ravaged soul is fertile kindling for rage, and your fury is easily ignited.",
    Obsessive:   "Your wants and desires become fixations and compulsions, driving you to achieve them at any cost.",
    Territorial: "You see some place as yours: Trespassers are dealt with, and even guests must respect your claim.",
    Savage:      "When moved to anger or violence, you act with cruelty and feral malevolence.",
    Clanking:    "Your frame has developed a persistent metallic clang with each step, making stealth difficult.",
    Leaking:     "You continuously leak oil, leviathan blood, distilled electroplasm or some other potentially-dangerous substance.",
    Fixated:     "You have become fixated on a function of your choice, and lose all memory of your humanity when you pursue it.",
    Smoking:     "Your frame exudes a constant miasma of acrid, foul-smelling smoke.",
    Sparking:    "Electroplasmic energy erupts in arcing sparks from joints and junctions throughout your frame.",
    Ruthless:    "You lose any sense of humanity when indulging your Vice or pursuing your most important goal.",
    Secretive:   "Knowledge has become so precious to you, that even your closest allies are on a need-to-know basis."
  },
  EdgeTooltips: {
    "Fearsome":      "<p>The cohort is terrifying in aspect and reputation.</p>",
    "Independent":   "<p>The cohort can be trusted to make good decisions and act on their own initiative in the absence of direct orders.</p>",
    "Loyal":         "<p>The cohort can't be bribed or turned against you. </p>",
    "Tenacious":     "<p>The cohort won't be deterred from a task.</p>",
    "Nimble":        "<p>The vehicle handles easily. Consider this an <strong>assist</strong> for tricky maneuvers.</p>",
    "Simple":        "<p>The vehicle is easy to repair. Remove all of its <strong>Harm</strong> during <strong>downtime</strong></p>",
    "Sturdy":        "<p>The vehicle keeps operating even when <strong>Broken</strong>.</p>",
    "Arrow-Swift": "<p>Your pet gains <strong>Potency</strong> when tracking or fighting the supernatural.</p><p>It can move extremely quickly, outpacing any other creature or vehicle.</p>",
    "Ghost Form":  "<p>Your pet gains <strong>Potency</strong> when tracking or fighting the supernatural.</p><p>It can transform into electroplasmic vapor as if it were a spirit.</p>",
    "Mind Link":   "<p>Your pet gains <strong>Potency</strong> when tracking or fighting the supernatural.</p><p>You and your pet can share senses and thoughts telepathically.</p>"
  },
  FlawTooltips: {
    Principled: "<p>The cohort has an ethic or values that it won't betray.</p>",
    Savage:     "<p>The cohort is excessively violent and cruel.</p>",
    Unreliable: "<p>The cohort isn't always available, due to other obligations, stupefaction from their vices, etc.</p>",
    Wild:       "<p>The cohort is drunken, debauched, and loud-mouthed.</p>",
    Costly:     "<p>The vehicle costs <strong>1 Coin</strong> per <strong>downtime</strong> to keep it in operation.</p>",
    Distinct:   "<p>The vehicle has memorable features. Take <strong>+1 Heat</strong> when you use it on a score.</p>",
    Finicky:    "<p>The vehicle has quirks that only one person understands. When operated without them, it has <strong>-1 Quality</strong>.</p>"
  },
  QualityDescriptors: [
    "Poor",
    "Adequate",
    "Good",
    "Excellent",
    "Superior",
    "Impeccable",
    "Legendary"
  ],
  ForceDescriptors: [
    "Weak",
    "Moderate",
    "Strong",
    "Serious",
    "Powerful",
    "Overwhelming",
    "Devastating"
  ],
  VehicleDescriptors: [
    "A Vehicle?",
    "A Vehicle",
    "A Respectable Vehicle",
    "A Respected Vehicle",
    "A Precision-Built Vehicle",
    "A Powerful, Advanced Vehicle",
    "A Uniquely Strong, Extremely Advanced Vehicle"
  ],
  PetDescriptors: [
    "A Weak Hunting Pet",
    "A Hunting Pet",
    "A Strong Hunting Pet",
    "A Serious Hunting Pet",
    "A Powerful Hunting Pet",
    "An Overwhelmingly Powerful Hunting Pet",
    "A Devastating Hunting Pet"
  ],
  AreaExamples: [
    "a closet",
    "a small room",
    "a large room",
    "several rooms",
    "a small building",
    "a large building",
    "a city block"
  ],
  ScaleExamples: [
    "(1 or 2 members)",
    "(3 - 6 members)",
    "(~12 members)",
    "(~20 members)",
    "(~40 members)",
    "(~80 members)",
    "(~160 members)"
  ],
  ScaleSizes: [
    "A Few ",
    "A Small Gang of ",
    "A Gang of ",
    "A Large Gang of ",
    "A Small Army of ",
    "An Army of ",
    "A Massive Army of "
  ],
  ExperienceClues: {
    Scoundrel: [
      "You expressed your beliefs, drives, heritage, or background.",
      "You struggled with issues from your vice or traumas during the session."
    ],
    Crew: [
      "You contended with challenges above your current station.",
      "You bolstered your crew's reputation, or developed a new one.",
      "You expressed the goals, drives, inner conflict, or essential nature of the crew."
    ]
  },
  GatherInfoQuestions: {
    Cutter: [
      "How can I hurt them?",
      "Who's most afraid of me?",
      "Who's most dangerous here?",
      "What do they intend to do?",
      "How can I get them to [X]?",
      "Are they telling the truth?",
      "What's really going on here?"
    ],
    Hound: [
      "What do they intend to do?",
      "How can I get them to [X]?",
      "What are they really feeling?",
      "Where are they vulnerable?",
      "Where did [X] go?",
      "How can I find [X]?",
      "What's really going on here?"
    ],
    Leech: [
      "What do they intend to do?",
      "How can I get them to [X]?",
      "Are they telling the truth?",
      "What can I tinker with here?",
      "What might happen if I [X]?",
      "How can I find [X]?",
      "What's really going on here?"
    ],
    Lurk: [
      "What do they intend to do?",
      "How can I get them to [X]?",
      "What should I look out for?",
      "What's the best way in?",
      "Where can I hide here?",
      "How can I find [X]?",
      "What's really going on here?"
    ],
    Slide: [
      "What do they intend to do?",
      "How can I get them to [X]?",
      "Are they telling the truth?",
      "What are they really feeling?",
      "What do they really care about?",
      "How can I blend in here?",
      "What's really going on here?"
    ],
    Spider: [
      "What do they want most?",
      "What should I look out for?",
      "Where's the leverage here?",
      "How can I discover [X]?",
      "What do they intend to do?",
      "How can I get them to [X]?",
      "What's really going on here?"
    ],
    Whisper: [
      "What is arcane or weird here?",
      "What echoes in the ghost field?",
      "What is hidden or lost here?",
      "What do they intend to do?",
      "What drives them to do this?",
      "How can I reveal [X]?",
      "What's really going on here?"
    ],
    Ghost: [
      "What do they intend to do?",
      "How can I get them to [X]?",
      "What are they really feeling?",
      "What should I lookout for?",
      "Where's the weakness here?",
      "How can I find [X]?",
      "What's really going on here?"
    ],
    Hull: [
      "What do they intend to do?",
      "How can I get them to [X]?",
      "What are they really doing?",
      "What should I lookout for?",
      "Where's the weakness here?",
      "How can I find [X]?",
      "What's really going on here?"
    ],
    Vampire: [
      "What do they intend to do?",
      "How can I get them to [X]?",
      "What are they really feeling?",
      "What should I lookout for?",
      "Where's the weakness here?",
      "How can I find [X]?",
      "What's really going on here?"
    ]
  },
  Playbooks: {
    Cutter: {
      "system.tagline":                "A Dangerous & Intimidating Fighter",
      "system.friends_name":           "Dangerous Friends",
      "system.rivals_name":            "Dangerouser Rivals",
      "system.experience_clues": [
        "You addressed a challenge with violence or coercion.",
        "You expressed your beliefs, drives, heritage, or background.",
        "You struggled with issues from your vice or traumas during the session."
      ],
      "system.trauma_conditions":     ["Cold", "Haunted", "Obsessed", "Paranoid", "Reckless", "Soft", "Unstable", "Vicious"],
      "system.gather_info_questions": [
        "How can I hurt them?",
        "Who's most afraid of me?",
        "Who's most dangerous here?",
        "What do they intend to do?",
        "How can I get them to [X]?",
        "Are they telling the truth?",
        "What's really going on here?"
      ]
    },
    Hound: {
      "system.tagline":                "A Deadly Sharpshooter & Tracker",
      "system.friends_name":           "Deadly Friends",
      "system.rivals_name":            "Deadlier Rivals",
      "system.experience_clues": [
        "You addressed a challenge with tracking or violence.",
        "You expressed your beliefs, drives, heritage, or background.",
        "You struggled with issues from your vice or traumas during the session."
      ],
      "system.trauma_conditions":     ["Cold", "Haunted", "Obsessed", "Paranoid", "Reckless", "Soft", "Unstable", "Vicious"],
      "system.gather_info_questions": [
        "What do they intend to do?",
        "How can I get them to [X]?",
        "What are they really feeling?",
        "Where are they vulnerable?",
        "Where did [X] go?",
        "How can I find [X]?",
        "What's really going on here?"
      ]
    },
    Leech: {
      "system.tagline":                "A Saboteur & Technician",
      "system.friends_name":           "Clever Friends",
      "system.rivals_name":            "Cleverer Rivals",
      "system.experience_clues": [
        "You addressed a challenge with technical skill or mayhem.",
        "You expressed your beliefs, drives, heritage, or background.",
        "You struggled with issues from your vice or traumas during the session."
      ],
      "system.trauma_conditions":     ["Cold", "Haunted", "Obsessed", "Paranoid", "Reckless", "Soft", "Unstable", "Vicious"],
      "system.gather_info_questions": [
        "What do they intend to do?",
        "How can I get them to [X]?",
        "Are they telling the truth?",
        "What can I tinker with here?",
        "What might happen if I [X]?",
        "How can I find [X]?",
        "What's really going on here?"
      ]
    },
    Lurk: {
      "system.tagline":                "A Stealthy Infiltrator & Burglar",
      "system.friends_name":           "Shady Friends",
      "system.rivals_name":            "Shadier Rivals",
      "system.experience_clues": [
        "You addressed a challenge with stealth or evasion.",
        "You expressed your beliefs, drives, heritage, or background.",
        "You struggled with issues from your vice or traumas during the session."
      ],
      "system.trauma_conditions":     ["Cold", "Haunted", "Obsessed", "Paranoid", "Reckless", "Soft", "Unstable", "Vicious"],
      "system.gather_info_questions": [
        "What do they intend to do?",
        "How can I get them to [X]?",
        "What should I look out for?",
        "What's the best way in?",
        "Where can I hide here?",
        "How can I find [X]?",
        "What's really going on here?"
      ]
    },
    Slide: {
      "system.tagline":                "A Subtle Manipulator & Spy",
      "system.friends_name":           "Sly Friends",
      "system.rivals_name":            "Slyer Rivals",
      "system.experience_clues": [
        "You addressed a challenge with deception or influence.",
        "You expressed your beliefs, drives, heritage, or background.",
        "You struggled with issues from your vice or traumas during the session."
      ],
      "system.trauma_conditions":     ["Cold", "Haunted", "Obsessed", "Paranoid", "Reckless", "Soft", "Unstable", "Vicious"],
      "system.gather_info_questions": [
        "What do they intend to do?",
        "How can I get them to [X]?",
        "Are they telling the truth?",
        "What are they really feeling?",
        "What do they really care about?",
        "How can I blend in here?",
        "What's really going on here?"
      ]
    },
    Spider: {
      "system.tagline":                "A Devious Mastermind",
      "system.friends_name":           "Shrewd Friends",
      "system.rivals_name":            "Very Shrewd Rivals",
      "system.experience_clues": [
        "You addressed a challenge with calculation or conspiracy.",
        "You expressed your beliefs, drives, heritage, or background.",
        "You struggled with issues from your vice or traumas during the session."
      ],
      "system.trauma_conditions":     ["Cold", "Haunted", "Obsessed", "Paranoid", "Reckless", "Soft", "Unstable", "Vicious"],
      "system.gather_info_questions": [
        "What do they want most?",
        "What should I look out for?",
        "Where's the leverage here?",
        "How can I discover [X]?",
        "What do they intend to do?",
        "How can I get them to [X]?",
        "What's really going on here?"
      ]
    },
    Whisper: {
      "system.tagline":                "An Arcane Adept & Channeler",
      "system.friends_name":           "Strange Friends",
      "system.rivals_name":            "Stranger Rivals",
      "system.experience_clues": [
        "You addressed a challenge with knowledge or arcane power.",
        "You expressed your beliefs, drives, heritage, or background.",
        "You struggled with issues from your vice or traumas during the session."
      ],
      "system.trauma_conditions":     ["Cold", "Haunted", "Obsessed", "Paranoid", "Reckless", "Soft", "Unstable", "Vicious"],
      "system.gather_info_questions": [
        "What is arcane or weird here?",
        "What echoes in the ghost field?",
        "What is hidden or lost here?",
        "What do they intend to do?",
        "What drives them to do this?",
        "How can I reveal [X]?",
        "What's really going on here?"
      ]
    },
    Ghost: {
      "system.tagline":            "A Vengeful Disembodied Spirit",
      "system.acquaintances_name": "Enemies & Rivals",
      "system.experience_clues":   [
        "You exacted vengeance upon those whom you deem deserving.",
        "You expressed your outrage or anger, or settled scores from your heritage, or background.",
        "You struggled with issues from your need or glooms during the session."
      ],
      "system.trauma_conditions":     ["Chaotic", "Destructive", "Furious", "Obsessive", "Territorial", "Savage"],
      "system.gather_info_questions": [
        "What do they intend to do?",
        "How can I get them to [X]?",
        "What are they really feeling?",
        "What should I lookout for?",
        "Where's the weakness here?",
        "How can I find [X]?",
        "What's really going on here?"
      ]
    },
    Hull: {
      "system.tagline":            "An Animated Spark-Craft Frame",
      "system.acquaintances_name": "Master",
      "system.experience_clues":   [
        "You fulfilled your functions despite difficulty or danger.",
        "You suppressed or ignored your former human beliefs, drives, heritage, or background.",
        "You struggled with issues from your wear during the session."
      ],
      "system.trauma_conditions":     ["Clanking", "Leaking", "Fixated", "Smoking", "Sparking", "Unstable"],
      "system.gather_info_questions": [
        "What do they intend to do?",
        "How can I get them to [X]?",
        "What are they really doing?",
        "What should I lookout for?",
        "Where's the weakness here?",
        "How can I find [X]?",
        "What's really going on here?"
      ]
    },
    Vampire: {
      "system.tagline":            "An Animated Undead Body",
      "system.acquaintances_name": "Dark Servants",
      "system.experience_clues":   [
        "You displayed your dominance or slayed without mercy.",
        "You expressed your beliefs, drives, heritage, or background.",
        "You struggled with issues from your vice, traumas, or strictures during the session."
      ],
      "system.trauma_conditions":     ["Cold", "Haunted", "Obsessed", "Paranoid", "Ruthless", "Secretive", "Unstable", "Vicious"],
      "system.gather_info_questions": [
        "What do they intend to do?",
        "How can I get them to [X]?",
        "What are they really feeling?",
        "What should I lookout for?",
        "Where's the weakness here?",
        "How can I find [X]?",
        "What's really going on here?"
      ]
    }
  }
};
// #endregion