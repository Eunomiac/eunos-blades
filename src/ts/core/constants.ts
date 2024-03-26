// #region ENUMS ~
export enum BladesPermissions {
  NONE = CONST.DOCUMENT_PERMISSION_LEVELS.NONE,
  BASIC = CONST.DOCUMENT_PERMISSION_LEVELS.LIMITED,
  FULL = CONST.DOCUMENT_PERMISSION_LEVELS.OBSERVER,
  OWNER = CONST.DOCUMENT_PERMISSION_LEVELS.OWNER
}

export enum BladesActorType {
  pc = "pc",
  npc = "npc",
  crew = "crew",
  faction = "faction"
}

export enum BladesItemType {
  ability = "ability",
  background = "background",
  clock_keeper = "clock_keeper",
  cohort_gang = "cohort_gang",
  cohort_expert = "cohort_expert",
  crew_ability = "crew_ability",
  crew_reputation = "crew_reputation",
  crew_playbook = "crew_playbook",
  crew_upgrade = "crew_upgrade",
  feature = "feature",
  gm_tracker = "gm_tracker",
  heritage = "heritage",
  gear = "gear",
  playbook = "playbook",
  preferred_op = "preferred_op",
  stricture = "stricture",
  vice = "vice",
  project = "project",
  ritual = "ritual",
  design = "design",
  location = "location",
  score = "score"
}

export enum PrereqType {
  HasActiveItem = "HasActiveItem", // Item will only appear in selector if character has Item with world_name (value)
  HasActiveItemsByTag = "HasActiveItemByTag", // For each Tag, character must have an active Item with that tag.
  AdvancedPlaybook = "AdvancedPlaybook", // Item will only appear in selector if character is a Ghost, Hull or Vampire
  HasAllTags = "HasAllTags", // Item will only appear if character has all matching tags.
  HasAnyTag = "HasAnyTag", // Item will appear if character has any matching tag.

  Not_HasActiveItem = "Not_HasActiveItem",
  Not_HasActiveItemsByTag = "Not_HasActiveItemsByTag",
  Not_AdvancedPlaybook = "Not_AdvancedPlaybook",
  Not_HasAllTags = "Not_HasAllTags",
  Not_HasAnyTag = "Not_HasAnyTag"
}

export enum ClockColor {
  yellow = "yellow",
  red = "red",
  white = "white",
  cyan = "cyan"
}

export enum ClockDisplayContext {
  overlay = "overlay",
  pcSheet = "pcSheet",
  factionSheet = "factionSheet",
  projectSheet = "projectSheet",
  scoreSheet = "scoreSheet",
  rollCollab = "rollCollab",
  chatMessage = "chatMessage"
}

export enum ClockKeyUpdateAction {
  RenderAll = "RenderAll",
  RenderNonClockKeeper = "RenderNonClockKeeper",
  RenderNone = "RenderNone"
}

export enum ClockKeyDisplayMode {
  full = "full",
  clocks = "clocks",
  activeClocks = "activeClocks",
  presentCurrentClock = "presentCurrentClock",
  present0 = "present0",
  present1 = "present1",
  present2 = "present2",
  present3 = "present3",
  present4 = "present4",
  present5 = "present5"
}

export enum BladesNoticeType {
  push = "push"
}

export enum District {
  Barrowcleft = "Barrowcleft",
  Brightstone = "Brightstone",
  Charhollow = "Charhollow",
  Charterhall = "Charterhall",
  Coalridge = "Coalridge",
  "Crows Foot" = "Crows Foot",
  "The Docks" = "The Docks",
  Dunslough = "Dunslough",
  Nightmarket = "Nightmarket",
  Silkshore = "Silkshore",
  "Six Towers" = "Six Towers",
  Whitecrown = "Whitecrown",
  "Gaddoc Station" = "Gaddoc Station",
  "The Lost District" = "The Lost District",
  "The Void Sea" = "The Void Sea",
  "Ironhook Prison" = "Ironhook Prison",
  "Old North Port" = "Old North Port",
  Deathlands = "Deathlands"
}
export enum MainDistrict {
  Barrowcleft = "Barrowcleft",
  Brightstone = "Brightstone",
  Charhollow = "Charhollow",
  Charterhall = "Charterhall",
  Coalridge = "Coalridge",
  "Crows Foot" = "Crows Foot",
  "The Docks" = "The Docks",
  Dunslough = "Dunslough",
  Nightmarket = "Nightmarket",
  Silkshore = "Silkshore",
  "Six Towers" = "Six Towers",
  Whitecrown = "Whitecrown"
}
export enum OtherDistrict {
  "Gaddoc Station" = "Gaddoc Station",
  "The Lost District" = "The Lost District",
  "The Void Sea" = "The Void Sea",
  "Ironhook Prison" = "Ironhook Prison",
  "Old North Port" = "Old North Port",
  Deathlands = "Deathlands"
}

export enum AttributeTrait {
  insight = "insight",
  prowess = "prowess",
  resolve = "resolve"
}
export enum InsightActions {
  hunt = "hunt",
  study = "study",
  survey = "survey",
  tinker = "tinker"
}
export enum ProwessActions {
  finesse = "finesse",
  prowl = "prowl",
  skirmish = "skirmish",
  wreck = "wreck"
}
export enum ResolveActions {
  attune = "attune",
  command = "command",
  consort = "consort",
  sway = "sway"
}
export enum ActionTrait {
  hunt = "hunt",
  study = "study",
  survey = "survey",
  tinker = "tinker",
  finesse = "finesse",
  prowl = "prowl",
  skirmish = "skirmish",
  wreck = "wreck",
  attune = "attune",
  command = "command",
  consort = "consort",
  sway = "sway"
}

export enum DowntimeAction {
  AcquireAsset = "AcquireAsset",
  IndulgeVice = "IndulgeVice",
  LongTermProject = "LongTermProject",
  Recover = "Recover",
  ReduceHeat = "ReduceHeat",
  Train = "Train"
}

export enum RollPermissions {
  Primary = "Primary",
  Observer = "Observer",
  GM = "GM",
  Participant = "Participant"
}

export enum RollType {
  Action = "Action",
  Resistance = "Resistance",
  Fortune = "Fortune",
  IndulgeVice = "IndulgeVice"
}

export enum RollSubType {
  Incarceration = "Incarceration",
  Engagement = "Engagement",
  GatherInfo = "GatherInfo",
  GroupLead = "GroupLead",
  GroupParticipant = "GroupParticipant"
}

export enum RollModType {
  general = "general",
  harm = "harm",
  teamwork = "teamwork",
  ability = "ability",
  gear = "gear",
  crew_ability = "crew_ability",
  crew_upgrade = "crew_upgrade",
  advantage = "advantage",
  disadvantage = "disadvantage"
}

export enum ConsequenceType {
  ReducedEffect = "ReducedEffect",
  ComplicationMinor = "ComplicationMinor",
  ComplicationMajor = "ComplicationMajor",
  ComplicationSerious = "ComplicationSerious",
  LostOpportunity = "LostOpportunity",
  WorsePosition = "WorsePosition",
  InsightHarm1 = "InsightHarm1",
  InsightHarm2 = "InsightHarm2",
  InsightHarm3 = "InsightHarm3",
  InsightHarm4 = "InsightHarm4",
  ProwessHarm1 = "ProwessHarm1",
  ProwessHarm2 = "ProwessHarm2",
  ProwessHarm3 = "ProwessHarm3",
  ProwessHarm4 = "ProwessHarm4",
  ResolveHarm1 = "ResolveHarm1",
  ResolveHarm2 = "ResolveHarm2",
  ResolveHarm3 = "ResolveHarm3",
  ResolveHarm4 = "ResolveHarm4",
  None = "None"
}

export enum RollModStatus {
  Hidden = "Hidden",
  ForcedOff = "ForcedOff",
  ToggledOff = "ToggledOff",
  ToggledOn = "ToggledOn",
  ForcedOn = "ForcedOn",
  Dominant = "Dominant"
}

export enum RollModSection {
  roll = "roll",
  position = "position",
  effect = "effect",
  result = "result",
  after = "after"
}
export enum Position {
  desperate = "desperate",
  risky = "risky",
  controlled = "controlled"
}
export enum Effect {
  zero = "zero",
  limited = "limited",
  standard = "standard",
  great = "great",
  extreme = "extreme"
}
export enum Factor {
  tier = "tier",
  quality = "quality",
  scale = "scale",
  magnitude = "magnitude"
}

export enum RollResult {
  critical = "critical",
  success = "success",
  partial = "partial",
  fail = "fail"
}

export enum RollPhase {
  // Collaboration: Before GM toggles "Roll" button for player to click.
  Collaboration = "Collaboration",
  // AwaitingRoll: Waiting for player to click "ROLL"
  AwaitingRoll = "AwaitingRoll",
  // AwaitingConsequences: Waiting for player to resist or accept consequences
  //                        in chat. Only moves to 'Complete' when all consequences
  //                        have been accepted or negated. (Resisted consequences
  //                        must still be accepted, since player could elect to use armor.)
  AwaitingConsequences = "AwaitingConsequences",
  // Complete: Roll finished.
  Complete = "Complete"
}

export enum Harm {
  Weakened = "Weakened",
  Impaired = "Impaired",
  Broken = "Broken",
  Dead = "Dead"
}

export enum Vice {
  Faith = "Faith",
  Gambling = "Gambling",
  Luxury = "Luxury",
  Obligation = "Obligation",
  Pleasure = "Pleasure",
  Stupor = "Stupor",
  Weird = "Weird",
  Worship = "Worship",
  Life_Essence = "Life_Essence",
  Living_Essence = "Living_Essence",
  Electroplasmic_Power = "Electroplasmic_Power",
  Servitude = "Servitude"
}

export enum Playbook {
  Cutter = "Cutter",
  Hound = "Hound",
  Leech = "Leech",
  Lurk = "Lurk",
  Slide = "Slide",
  Spider = "Spider",
  Whisper = "Whisper",
  Vampire = "Vampire",
  Hull = "Hull",
  Ghost = "Ghost",
  Assassins = "Assassins",
  Bravos = "Bravos",
  Cult = "Cult",
  Hawkers = "Hawkers",
  Shadows = "Shadows",
  Smugglers = "Smugglers",
  Vigilantes = "Vigilantes"
}

export enum AdvancementPoint {
  UpgradeOrAbility = "UpgradeOrAbility",
  Ability = "Ability",
  Upgrade = "Upgrade",
  Cohort = "Cohort",
  CohortType = "CohortType",
  GeneralAction = "GeneralAction",
  GeneralInsight = "GeneralInsight",
  GeneralProwess = "GeneralProwess",
  GeneralResolve = "GeneralResolve",
  hunt = "hunt",
  study = "study",
  survey = "survey",
  tinker = "tinker",
  finesse = "finesse",
  prowl = "prowl",
  skirmish = "skirmish",
  wreck = "wreck",
  attune = "attune",
  command = "command",
  consort = "consort",
  sway = "sway"
}

export enum BladesPhase {
  CharGen = "CharGen",
  Freeplay = "Freeplay",
  Score = "Score",
  Downtime = "Downtime"
}
export namespace Tag {

  export enum System {
    Archived = "Archived",
    Featured = "Featured",
    Hidden = "Hidden",
    MultiplesOK = "MultiplesOK"
  }
  export enum Gear {
    Fine = "Fine",
    General = "General",
    Advanced = "Advanced",
    Upgraded = "Upgraded"
  }
  export enum PC {
    Member = "Member",
    CharacterCrew = "CharacterCrew",
    ActivePC = "ActivePC",
    Small = "Small",
    Medium = "Medium",
    Large = "Large",
    CanHeal = "CanHeal"
  }
  export enum Invention {
    Arcane = "Arcane", // Arcane Designs
    SparkCraft = "SparkCraft", // Spark-Craft Schematics
    Alchemical = "Alchemical", // Alchemical Formulae
    Mundane = "Mundane", // Inventions
    Ritual = "Ritual" // Rituals
  }
  export enum GearCategory {
    ArcaneImplement = "ArcaneImplement",
    Document = "Document",
    GearKit = "GearKit",
    SubterfugeSupplies = "SubterfugeSupplies",
    Tool = "Tool",
    Weapon = "Weapon"
  }
  export enum NPC {
    Acquaintance = "Acquaintance",
    VicePurveyor = "VicePurveyor",
    CanHeal = "CanHeal"
  }
  export enum GangType {
    Thugs = "Thugs",
    Rooks = "Rooks",
    Adepts = "Adepts",
    Rovers = "Rovers",
    Skulks = "Skulks",
    Vehicle = "Vehicle"
  }
}
// #endregion

// #region 'C' CONSTANTS DEFINITIONS ~
const C = {
  SYSTEM_ID:        "eunos-blades",
  SYSTEM_NAME:      "Euno's Blades",
  SYSTEM_FULL_NAME: "Euno's Blades In The Dark",
  TEMPLATE_ROOT:    "systems/eunos-blades/templates",
  AI_MODELS:        {
    baseContext: [
      "babbage-002",
      "gpt-3.5-turbo",
      "gpt-4"
    ],
    extendedContext: [
      "gpt-3.5-turbo-16k",
      "gpt-3.5-turbo-16k",
      "gpt-4-32k"
    ]
  },
  MIN_MOUSE_MOVEMENT_THRESHOLD: 2000,
  AI_FILE_IDS:                  {
    BladesPDF: "file-n72HTTNwt051piPbswQ8isUa"
  },
  ClockKeySquareSize:    100,
  DowntimeActionDisplay: {
    [DowntimeAction.AcquireAsset]:    "Acquire an Asset",
    [DowntimeAction.IndulgeVice]:     "Indulge Your Vice",
    [DowntimeAction.LongTermProject]: "Work on a Project",
    [DowntimeAction.Recover]:         "Heal",
    [DowntimeAction.ReduceHeat]:      "Reduce the Crew's Heat",
    [DowntimeAction.Train]:           "Train"
  },
  ConsequenceValues: {
    [ConsequenceType.ReducedEffect]:       undefined,
    [ConsequenceType.LostOpportunity]:     2,
    [ConsequenceType.WorsePosition]:       undefined,
    [ConsequenceType.None]:                0,
    [ConsequenceType.InsightHarm4]:        4,
    [ConsequenceType.InsightHarm3]:        3,
    [ConsequenceType.InsightHarm2]:        2,
    [ConsequenceType.InsightHarm1]:        1,
    [ConsequenceType.ProwessHarm4]:        4,
    [ConsequenceType.ProwessHarm3]:        3,
    [ConsequenceType.ProwessHarm2]:        2,
    [ConsequenceType.ProwessHarm1]:        1,
    [ConsequenceType.ResolveHarm4]:        4,
    [ConsequenceType.ResolveHarm3]:        3,
    [ConsequenceType.ResolveHarm2]:        2,
    [ConsequenceType.ResolveHarm1]:        1,
    [ConsequenceType.ComplicationSerious]: 3,
    [ConsequenceType.ComplicationMajor]:   2,
    [ConsequenceType.ComplicationMinor]:   1
  },
  ResistedConsequenceTypes: {
    [ConsequenceType.None]:                [],
    [ConsequenceType.InsightHarm4]:        [ConsequenceType.InsightHarm3],
    [ConsequenceType.InsightHarm3]:        [ConsequenceType.InsightHarm2],
    [ConsequenceType.InsightHarm2]:        [ConsequenceType.InsightHarm1],
    [ConsequenceType.InsightHarm1]:        [ConsequenceType.None],
    [ConsequenceType.ProwessHarm4]:        [ConsequenceType.ProwessHarm3],
    [ConsequenceType.ProwessHarm3]:        [ConsequenceType.ProwessHarm2],
    [ConsequenceType.ProwessHarm2]:        [ConsequenceType.ProwessHarm1],
    [ConsequenceType.ProwessHarm1]:        [ConsequenceType.None],
    [ConsequenceType.ResolveHarm4]:        [ConsequenceType.ResolveHarm3],
    [ConsequenceType.ResolveHarm3]:        [ConsequenceType.ResolveHarm2],
    [ConsequenceType.ResolveHarm2]:        [ConsequenceType.ResolveHarm1],
    [ConsequenceType.ResolveHarm1]:        [ConsequenceType.None],
    [ConsequenceType.ComplicationSerious]: [ConsequenceType.ComplicationMajor],
    [ConsequenceType.ComplicationMajor]:   [ConsequenceType.ComplicationMinor],
    [ConsequenceType.ComplicationMinor]:   [ConsequenceType.None]
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
  ConsequenceIcons: {
    [ConsequenceType.ReducedEffect]:       "reduced-effect",
    [ConsequenceType.ComplicationMinor]:   "complication-minor",
    [ConsequenceType.ComplicationMajor]:   "complication-major",
    [ConsequenceType.ComplicationSerious]: "complication-serious",
    [ConsequenceType.LostOpportunity]:     "lost-opportunity",
    [ConsequenceType.WorsePosition]:       "worse-position",
    [ConsequenceType.InsightHarm1]:        "harm-insight-1",
    [ConsequenceType.InsightHarm2]:        "harm-insight-2",
    [ConsequenceType.InsightHarm3]:        "harm-insight-3",
    [ConsequenceType.InsightHarm4]:        "harm-insight-4",
    [ConsequenceType.ProwessHarm1]:        "harm-prowess-1",
    [ConsequenceType.ProwessHarm2]:        "harm-prowess-2",
    [ConsequenceType.ProwessHarm3]:        "harm-prowess-3",
    [ConsequenceType.ProwessHarm4]:        "harm-prowess-4",
    [ConsequenceType.ResolveHarm1]:        "harm-resolve-1",
    [ConsequenceType.ResolveHarm2]:        "harm-resolve-2",
    [ConsequenceType.ResolveHarm3]:        "harm-resolve-3",
    [ConsequenceType.ResolveHarm4]:        "harm-resolve-4",
    [ConsequenceType.None]:                ""
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

  Colors: {/* IMPORT FROM CSS via css-loader */
    bWHITE: "rgba(255, 255, 255, 1)",
    WHITE:  "rgba(200, 200, 200, 1)",
    bGREY:  "rgba(170, 170, 170, 1)",
    GREY:   "rgba(119, 119, 119, 1)",
    dGREY:  "rgba(68, 68, 68, 1)",
    BLACK:  "rgba(32, 32, 32, 1)",
    dBLACK: "rgba(0, 0, 0, 1)",

    bGOLD:  "rgba(255,216, 44, 1)",
    GOLD:   "rgba(215,175,  0, 1)",
    dGOLD:  "rgba(165,134,  0, 1)",
    ddGOLD: "rgba(103, 83,  0, 1)",

    bRED:  "rgba(255, 0, 0, 1)",
    RED:   "rgba(200, 0, 0, 1)",
    dRED:  "rgba(150,  0,  0, 1)",
    ddRED: "rgba(50,  0,  0, 1)",

    bBLUE:  "rgba(   0,224,224, 1)",
    BLUE:   "rgba(52,213,213, 1)",
    dBLUE:  "rgba(0,118,118, 1)",
    ddBLUE: "rgba(0, 77, 77, 1)"
  },
  // ClockKeyPositions: {
  //   elemSquareSize: 100,
  //   0: {
  //     keyDimensions: {width: 0, height: 0},
  //     keyCenter: {x: 0, y: 0},
  //     clocksCenter: {x: 0, y: 0},
  //     clocksCenterDimensions: {width: 0, height: 0},
  //     clocks: {}
  //   },
  //   1: {
  //     keyDimensions: {width: 230, height: 836},
  //     keyCenter: {x: 115, y: 418},
  //     clocksCenter: {x: 111.011, y: 108.5},
  //     clocksCenterDimensions: {width: 169, height: 169},
  //     clocks: {
  //       0: {x: 111.011, y: 108.5, size: 169}
  //     }
  //   },
  //   2: {
  //     keyDimensions: {width: 202, height: 625},
  //     keyCenter: {x: 101, y: 312},
  //     clocksCenter: {x: 101, y: 189},
  //     clocksCenterDimensions: {width: 110, height: 290},
  //     clocks: {
  //       0: {x: 101, y: 99, size: 108},
  //       1: {x: 101, y: 279, size: 108}
  //     }
  //   },
  //   3: {
  //     keyDimensions: {width: 280, height: 915},
  //     keyCenter: {x: 140, y: 457},
  //     clocksCenter: {x: 140, y: 169},
  //     clocksCenterDimensions: {width: 242, height: 222},
  //     clocks: {
  //       0: {x: 140, y: 99, size: 108},
  //       1: {x: 74, y: 211, size: 108},
  //       2: {x: 206, y: 211, size: 108}
  //     }
  //   },
  //   4: {
  //     keyDimensions: {width: 376, height: 1140},
  //     keyCenter: {x: 188, y: 570},
  //     clocksCenter: {x: 188, y: 185},
  //     clocksCenterDimensions: {width: 284, height: 282},
  //     clocks: {
  //       0: {x: 188, y: 99, size: 108}, // yTop = 45
  //       1: {x: 101, y: 185, size: 108},
  //       2: {x: 275, y: 185, size: 108},
  //       3: {x: 188, y: 273, size: 108} // yBottom = 327
  //     }
  //   },
  //   5: {
  //     keyDimensions: {width: 376, height: 1140},
  //     keyCenter: {x: 188, y: 570},
  //     clocksCenter: {x: 188, y: 185},
  //     clocksCenterDimensions: {width: 284, height: 384},
  //     clocks: {
  //       0: {x: 188, y: 99, size: 108}, // yTop = 45
  //       1: {x: 101, y: 185, size: 108},
  //       2: {x: 275, y: 185, size: 108},
  //       3: {x: 188, y: 273, size: 108},
  //       4: {x: 188, y: 452, size: 108} // yBottom = 506
  //     }
  //   },
  //   6: {
  //     keyDimensions: {width: 376, height: 1140},
  //     keyCenter: {x: 188, y: 570},
  //     clocksCenter: {x: 188, y: 391},
  //     clocksCenterDimensions: {width: 284, height: 692},
  //     clocks: {
  //       0: {x: 188, y: 99, size: 108}, // yTop = 45
  //       1: {x: 101, y: 185, size: 108},
  //       2: {x: 275, y: 185, size: 108},
  //       3: {x: 188, y: 273, size: 108},
  //       4: {x: 188, y: 452, size: 108},
  //       5: {x: 188, y: 683, size: 108} // yBottom = 737
  //     }
  //   }
  // },
  Loadout: {
    selections: [
      {value: "Light", display: "Light"},
      {value: "Normal", display: "Normal"},
      {value: "Heavy", display: "Heavy"}
    ],
    levels: ["BITD.Light", "BITD.Normal", "BITD.Heavy", "BITD.Encumbered", "BITD.OverMax"]
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
  ActionVerbs: {
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
  ActionPastVerbs: {
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
  DiceOddsStandard: [
    {crit: 0, success: 2.8, partial: 22.2, fail: 75},
    {crit: 0, success: 16.7, partial: 33.3, fail: 50},
    {crit: 2.8, success: 27.8, partial: 44.4, fail: 25},
    {crit: 7.4, success: 34.7, partial: 45.4, fail: 12.5},
    {crit: 13.2, success: 38.6, partial: 42, fail: 6.3},
    {crit: 19.6, success: 40.2, partial: 37.1, fail: 3.1},
    {crit: 26.3, success: 40.2, partial: 31.9, fail: 1.6},
    {crit: 33, success: 39.1, partial: 27.1, fail: 0.8},
    {crit: 39.5, success: 37.2, partial: 22.9, fail: 0.4},
    {crit: 45.7, success: 34.9, partial: 19.2, fail: 0.2},
    {crit: 51.5, success: 32.3, partial: 16.1, fail: 0.1},
    {crit: 56.9, success: 29.6, partial: 13.4, fail: 0},
    {crit: 61.9, success: 26.9, partial: 11.2, fail: 0},
    {crit: 66.3, success: 24.3, partial: 9.3, fail: 0},
    {crit: 70.4, success: 21.8, partial: 7.8, fail: 0},
    {crit: 74, success: 19.5, partial: 6.5, fail: 0},
    {crit: 77.3, success: 17.3, partial: 5.4, fail: 0},
    {crit: 80.2, success: 15.3, partial: 4.5, fail: 0},
    {crit: 82.7, success: 13.5, partial: 3.8, fail: 0},
    {crit: 85, success: 11.9, partial: 3.1, fail: 0},
    {crit: 87, success: 10.4, partial: 2.6, fail: 0}
  ],
  DiceOddsResistance: [ // Stress Cost: [-1, 0, 1, 2, 3, 4, 5]
    [0, 2.8, 8.3, 13.9, 19.4, 25, 30.6],
    [0, 16.7, 16.7, 16.7, 16.6, 16.7, 16.7],
    [2.8, 27.8, 25, 19.4, 13.9, 8.3, 2.8],
    [7.4, 34.7, 28.3, 17.1, 8.8, 3.2, 0.5],
    [13.2, 38.6, 28.5, 13.5, 5, 1.2, 0.1],
    [19.6, 40.2, 27, 10.1, 2.7, 0.4, 0],
    [26.3, 40.2, 24.7, 7.2, 1.4, 0.1, 0]
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
      ],
      "system.suggested_ability": "Battleborn"
    },
    Hound: {
      "system.bgImg":                  "systems/eunos-blades/assets/icons/class-icons/hound-trans.svg",
      "system.tagline":                "A Deadly Sharpshooter & Tracker",
      // "system.acquaintances_name": "Deadly Friends & Rivals",
      "system.friends_name":           "Deadly Friends",
      "system.rivals_name":            "Deadlier Rivals",
      "system.starting_stats.chargen": {
        "system.attributes.insight.hunt.value":   2,
        "system.attributes.insight.survey.value": 1
      },
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
      ],
      "system.suggested_ability": "Sharpshooter"
    },
    Leech: {
      "system.bgImg":                  "systems/eunos-blades/assets/icons/class-icons/leech-trans.svg",
      "system.tagline":                "A Saboteur & Technician",
      // "system.acquaintances_name": "Clever Friends & Rivals",
      "system.friends_name":           "Clever Friends",
      "system.rivals_name":            "Cleverer Rivals",
      "system.starting_stats.chargen": {
        "system.attributes.insight.tinker.value": 2,
        "system.attributes.prowess.wreck.value":  1
      },
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
      ],
      "system.suggested_ability": "Alchemist"
    },
    Lurk: {
      "system.bgImg":                  "systems/eunos-blades/assets/icons/class-icons/lurk-trans.svg",
      "system.tagline":                "A Stealthy Infiltrator & Burglar",
      // "system.acquaintances_name": "Shady Friends & Rivals",
      "system.friends_name":           "Shady Friends",
      "system.rivals_name":            "Shadier Rivals",
      "system.starting_stats.chargen": {
        "system.attributes.prowess.prowl.value":   2,
        "system.attributes.prowess.finesse.value": 1
      },
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
      ],
      "system.suggested_ability": "Infiltrator"
    },
    Slide: {
      "system.bgImg":                  "systems/eunos-blades/assets/icons/class-icons/slide-trans.svg",
      "system.tagline":                "A Subtle Manipulator & Spy",
      // "system.acquaintances_name": "Sly Friends & Rivals",
      "system.friends_name":           "Sly Friends",
      "system.rivals_name":            "Slyer Rivals",
      "system.starting_stats.chargen": {
        "system.attributes.resolve.sway.value":    2,
        "system.attributes.resolve.consort.value": 1
      },
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
      ],
      "system.suggested_ability": "Rook's Gambit"
    },
    Spider: {
      "system.bgImg":                  "systems/eunos-blades/assets/icons/class-icons/spider-trans.svg",
      "system.tagline":                "A Devious Mastermind",
      // "system.acquaintances_name": "Shrewd Friends & Rivals",
      "system.friends_name":           "Shrewd Friends",
      "system.rivals_name":            "Very Shrewd Rivals",
      "system.starting_stats.chargen": {
        "system.attributes.resolve.consort.value": 2,
        "system.attributes.insight.study.value":   1
      },
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
      ],
      "system.suggested_ability": "Foresight"
    },
    Whisper: {
      "system.bgImg":                  "systems/eunos-blades/assets/icons/class-icons/whisper-trans.svg",
      "system.tagline":                "An Arcane Adept & Channeler",
      // "system.acquaintances_name": "Strange Friends & Rivals",
      "system.friends_name":           "Strange Friends",
      "system.rivals_name":            "Stranger Rivals",
      "system.starting_stats.chargen": {
        "system.attributes.resolve.attune.value": 2,
        "system.attributes.insight.study.value":  1
      },
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
      ],
      "system.suggested_ability": "Compel"
    },
    Ghost: {
      "system.bgImg":              "systems/eunos-blades/assets/icons/class-icons/ghost-trans.svg",
      "system.tagline":            "A Vengeful Disembodied Spirit",
      "system.acquaintances_name": "Enemies & Rivals",
      "system.starting_stats.add": {
        "system.attributes.insight.hunt.value":   1,
        "system.attributes.prowess.prowl.value":  1,
        "system.attributes.resolve.attune.value": 1
      },
      "system.experience_clues": [
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
      ],
      "system.auto_abilities": ["Ghost Form"]
    },
    Hull: {
      "system.bgImg":              "systems/eunos-blades/assets/icons/class-icons/hull-trans.svg",
      "system.tagline":            "An Animated Spark-Craft Frame",
      "system.acquaintances_name": "Master",
      "system.starting_stats.add": {
        "system.attributes.prowess.skirmish.value": 1,
        "system.attributes.resolve.attune.value":   1
      },
      "system.experience_clues": [
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
      ],
      "system.auto_abilities": ["Automaton"]
    },
    Vampire: {
      "system.bgImg":              "systems/eunos-blades/assets/icons/class-icons/vampire-trans.svg",
      "system.tagline":            "An Animated Undead Body",
      "system.acquaintances_name": "Dark Servants",
      "system.starting_stats.add": {
        "system.attributes.insight.hunt.value":     1,
        "system.attributes.prowess.prowl.value":    1,
        "system.attributes.prowess.skirmish.value": 1,
        "system.attributes.resolve.attune.value":   1,
        "system.attributes.resolve.command.value":  1,
        "system.attributes.resolve.sway.value":     1
      },
      "system.experience_clues": [
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
      ],
      "system.auto_abilities": ["Undead"]
    }
  },
  ClockSizes: [1, 2, 3, 4, 5, 6, 8, 10, 12],
  ActorTypes: [
    BladesActorType.pc,
    BladesActorType.npc,
    BladesActorType.crew,
    BladesActorType.faction
  ],
  ItemTypes: [
    BladesItemType.ability,
    BladesItemType.background,
    BladesItemType.clock_keeper,
    BladesItemType.cohort_gang,
    BladesItemType.cohort_expert,
    BladesItemType.crew_ability,
    BladesItemType.crew_reputation,
    BladesItemType.crew_playbook,
    BladesItemType.crew_upgrade,
    BladesItemType.feature,
    BladesItemType.gm_tracker,
    BladesItemType.heritage,
    BladesItemType.gear,
    BladesItemType.playbook,
    BladesItemType.preferred_op,
    BladesItemType.stricture,
    BladesItemType.vice,
    BladesItemType.project,
    BladesItemType.ritual,
    BladesItemType.design,
    BladesItemType.location,
    BladesItemType.score
  ],
  SimpleItemTypes: [
    BladesItemType.background,
    BladesItemType.crew_reputation,
    BladesItemType.feature,
    BladesItemType.heritage,
    BladesItemType.preferred_op,
    BladesItemType.stricture
  ],
  Attribute: [
    AttributeTrait.insight,
    AttributeTrait.prowess,
    AttributeTrait.resolve
  ],
  Action: {
    [AttributeTrait.insight]: [ActionTrait.hunt, ActionTrait.study, ActionTrait.survey, ActionTrait.tinker],
    [AttributeTrait.prowess]: [ActionTrait.finesse, ActionTrait.prowl, ActionTrait.skirmish, ActionTrait.wreck],
    [AttributeTrait.resolve]: [ActionTrait.attune, ActionTrait.command, ActionTrait.consort, ActionTrait.sway]
  },
  Vices: [
    Vice.Faith,
    Vice.Gambling,
    Vice.Luxury,
    Vice.Obligation,
    Vice.Pleasure,
    Vice.Stupor,
    Vice.Weird,
    Vice.Worship,
    Vice.Living_Essence,
    Vice.Life_Essence,
    Vice.Electroplasmic_Power
  ]
};
// #endregion

// #region RANDOMIZER DATA
export const Randomizers = {
  NPC: {
    heritage: [
      "Akorosi",
      "Akorosi",
      "Akorosi",
      "Akorosi",
      "Akorosi",
      "Akorosi",
      "Dagger Islander",
      "Iruvian",
      "Severosi",
      "Skovlander",
      "Skovlander",
      "Tycherosi"
    ],
    background: [
      "Academic",
      "Academic",
      "Academic",
      "Labor",
      "Labor",
      "Labor",
      "Labor",
      "Law",
      "Law",
      "Law",
      "Military",
      "Military",
      "Military",
      "Military",
      "Military",
      "New Money",
      "New Money",
      "Old Money",
      "Old Money",
      "Politics",
      "Politics",
      "Trade",
      "Trade",
      "Trade",
      "Underworld",
      "Underworld",
      "Underworld",
      "Underworld",
      "Underworld",
      "Weird"
    ],
    gender: [
      "M",
      "M",
      "M",
      "M",
      "F",
      "F",
      "F",
      "U",
      "X"
    ],
    appearance: [
      "Athletic",
      "Beard",
      "Bony",
      "Chiseled",
      "Crippled / Prosthetic",
      "Cute",
      "Dark",
      "Delicate",
      "Disfigured / Maimed",
      "Elegant",
      "Fair",
      "Glasses / Monocle",
      "Handsome",
      "Large",
      "Long Hair",
      "Lovely",
      "Old",
      "Plain",
      "Plump",
      "Rough",
      "Scarred",
      "Sexy",
      "Shaved Bald",
      "Short",
      "Slim",
      "Stooped",
      "Stout",
      "Strange",
      "Striking",
      "Stylish",
      "Tall",
      "Tattooed",
      "Weathered",
      "Wig",
      "Wild",
      "Wiry",
      "Worn",
      "Young"
    ],
    goal: [
      "Achievement",
      "Authority",
      "Change",
      "Chaos / Destruction",
      "Control",
      "Cooperation",
      "Freedom",
      "Happiness",
      "Infamy / Fear",
      "Justice",
      "Knowledge",
      "Love",
      "Pleasure",
      "Power",
      "Prestige / Fame",
      "Respect",
      "Revenge",
      "Wealth"
    ],
    method: [
      "Alchemy",
      "Arcane",
      "Blackmail",
      "Chaos",
      "Commerce",
      "Espionage",
      "Hard Work",
      "Law / Politics",
      "Manipulation",
      "Negotiation",
      "Sabotage",
      "Strategy",
      "Study",
      "Subterfuge",
      "Teamwork",
      "Theft",
      "Threats",
      "Violence"
    ],
    profession: [
      "Advocate",
      "Apiarist",
      "Architect",
      "Artist",
      "Author",
      "Bailiff",
      "Baker",
      "Baker",
      "Baker",
      "Banker",
      "Barber",
      "Barber",
      "Barber",
      "Blacksmith",
      "Blacksmith",
      "Blacksmith",
      "Bounty Hunter",
      "Brewer",
      "Brewer",
      "Brewer",
      "Butcher",
      "Butcher",
      "Butcher",
      "Captain",
      "Carpenter",
      "Carpenter",
      "Carpenter",
      "Cartwright",
      "Cartwright",
      "Cartwright",
      "Chandler",
      "Chandler",
      "Chandler",
      "Clerk",
      "Clerk",
      "Clerk",
      "Clockmaker",
      "Cobbler",
      "Cobbler",
      "Cobbler",
      "Composer",
      "Cooper",
      "Cooper",
      "Cooper",
      "Courtesan",
      "Criminal",
      "Criminal",
      "Criminal",
      "Cultivator",
      "Cultivator",
      "Cultivator",
      "Diplomat",
      "Driver",
      "Driver",
      "Driver",
      "Dyer",
      "Dyer",
      "Dyer",
      "Embroiderer",
      "Embroiderer",
      "Embroiderer",
      "Explorer",
      "Fishmonger",
      "Fishmonger",
      "Fishmonger",
      "Furrier",
      "Glass Blower",
      "Goat Herd",
      "Goat Herd",
      "Goat Herd",
      "Gondolier",
      "Gondolier",
      "Gondolier",
      "Guard",
      "Guard",
      "Guard",
      "Jailer",
      "Jeweler",
      "Journalist",
      "Leatherworker",
      "Leatherworker",
      "Leatherworker",
      "Leech",
      "Locksmith",
      "Magistrate",
      "Mason",
      "Mason",
      "Mason",
      "Merchant",
      "Merchant",
      "Merchant",
      "Messenger",
      "Messenger",
      "Messenger",
      "Musician",
      "Physicker",
      "Plumber",
      "Printer",
      "Rail Jack",
      "Roofer",
      "Roofer",
      "Roofer",
      "Ropemaker",
      "Ropemaker",
      "Ropemaker",
      "Rug Maker",
      "Rug Maker",
      "Rug Maker",
      "Sailor",
      "Sailor",
      "Sailor",
      "Scholar",
      "Scribe",
      "Servant",
      "Servant",
      "Servant",
      "Shipwright",
      "Shipwright",
      "Shipwright",
      "Soldier",
      "Sparkwright",
      "Spirit Warden",
      "Steward",
      "Tailor",
      "Tailor",
      "Tailor",
      "Tanner",
      "Tanner",
      "Tanner",
      "Tax Collector",
      "Tinkerer",
      "Tinkerer",
      "Tinkerer",
      "Treasurer",
      "Vendor",
      "Vendor",
      "Vendor",
      "Weaver",
      "Weaver",
      "Weaver",
      "Whisper",
      "Woodworker",
      "Woodworker",
      "Woodworker"
    ],
    trait: [
      "Arcane",
      "Arrogant",
      "Artistic",
      "Bold",
      "Brash",
      "Brave",
      "Calculating",
      "Calm",
      "Candid",
      "Careless",
      "Cautious",
      "Cavalier",
      "Charming",
      "Cold",
      "Commanding",
      "Compassionate",
      "Confident",
      "Connected",
      "Cooperative",
      "Creative",
      "Cruel",
      "Cultured",
      "Daring",
      "Defiant",
      "Dishonest",
      "Dramatic",
      "Elitist",
      "Enigmatic",
      "Enthusiastic",
      "Erudite",
      "Experienced",
      "Fierce",
      "Flexible",
      "Friendly",
      "Gracious",
      "Greedy",
      "Haunted",
      "Insightful",
      "Kind",
      "Melancholy",
      "Moody",
      "Obsessive",
      "Paranoid",
      "Patient",
      "Popular",
      "Principled",
      "Proud",
      "Quiet",
      "Reckless",
      "Respected",
      "Ruthless",
      "Sadistic",
      "Savage",
      "Secretive",
      "Shrewd",
      "Sincere",
      "Sneaky",
      "Sophisticated",
      "Strange",
      "Stylish",
      "Subtle",
      "Suspicious",
      "Tough",
      "Vain",
      "Vengeful",
      "Vicious",
      "Visionary",
      "Volatile",
      "Weird",
      "Wise"
    ],
    interests: [
      "Alchemy, medicine",
      "Antiques, artifacts, curios",
      "Arcane books, rituals",
      "Architecture, furnishings",
      "Church of Ecstasy",
      "Cooking, gardening",
      "Craft (leatherwork, etc.)",
      "Demon lore, legends",
      "Drugs, essences, tobacco",
      "Essences, alchemy",
      "Exploration, adventure",
      "Fine arts, opera, theater",
      "Fine clothes, jewelry, furs",
      "Fine food, restaurants",
      "Fine whiskey, wine, beer",
      "Forgotten gods",
      "Gadgets, new technology",
      "Gambling, cards, dice",
      "History, legends",
      "Horses, riding",
      "Hunting, shooting",
      "Lovers, romance, trysts",
      "Music, instruments, dance",
      "Natural philosophy",
      "Painting, drawing, sculpture",
      "Parties, social events",
      "Path of Echoes",
      "Pets (birds, dogs, cats)",
      "Pit-fighting, duels",
      "Poetry, novels, writing",
      "Politics, journalism",
      "Pre-cataclysm legends",
      "Ships, boating",
      "Spectrology, electroplasm",
      "Weapons collector",
      "Weeping Lady, charity"
    ],
    quirk: [
      "A fraud. Some important aspect is fabricated.",
      "Bigoted against culture / belief / social class.",
      "Black sheep / outcast from family or organization.",
      "Blind to flaws in friends, allies, family, etc.",
      "Celebrity. Popularized in print / song / theater.",
      "Concerned with appearances, gossip, peers.",
      "Cursed, haunted, harassed by spirits or demon.",
      "Deeply traditional. Opposed to new ideas.",
      "Devoted to their family.",
      "Drug / alcohol abuser. Often impaired by their vice.",
      "Extensive education on every scholarly subject.",
      "Has chronic illness that requires frequent care.",
      "Holds their position due to blackmail.",
      "Holds their position to spy for another faction.",
      "In prison or under noble's house arrest.",
      "Inherited their position. May not deserve / want it.",
      "Intense, unreasonable phobia or loathing.",
      "Involved with war crimes from the Unity War.",
      "Is blindly faithful to an ideal, group, or tradition.",
      "Keeps detailed journals, notes, records, ledgers.",
      "Leads a double life using cover identity.",
      "Married into important / powerful family.",
      "Massive debts (to banks / criminals / family)",
      "Once hollowed, then restored. Immune to spirits.",
      "Proud of heritage, traditions, native language.",
      "Reclusive. Prefers to interact via messengers.",
      "Relies on council to make decisions.",
      "Revolutionary. Plots against the Imperium.",
      "Scandalous reputation (deserved or not).",
      "Secretly (openly?) controlled by possessing spirit.",
      "Serves a demon's agenda (knowingly or not).",
      "Spotless reputation. Highly regarded.",
      "Superstitious. Believes in signs, magic numbers.",
      "Surrounded by sycophants, supplicants, toadies.",
      "Visionary. Holds radical views for future.",
      "Well-traveled. Connections outside Doskvol."
    ],
    style: {
      male: [
        "Apron",
        "Cane",
        "Collared Shirt",
        "Crutches",
        "Eelskin Bodysuit",
        "Face Mask",
        "Fitted Leggings",
        "Heavy Cloak",
        "Heavy Gloves",
        "Hide & Furs",
        "Hood & Veil",
        "Hooded Coat",
        "Knit Cap",
        "Leathers",
        "Long Coat",
        "Long Scarf",
        "Loose Silks",
        "Mask & Robes",
        "Rough Tunic",
        "Sharp Trousers",
        "Short Cloak",
        "Slim Jacket",
        "Soft Boots",
        "Suit & Vest",
        "Suspenders",
        "Tall Boots",
        "Tatters",
        "Thick Greatcoat",
        "Tool Belt",
        "Tricorn Hat",
        "Uniform",
        "Waxed Coat",
        "Wheelchair",
        "Wide Belt",
        "Work Boots"
      ],
      female: [
        "Apron",
        "Cane",
        "Crutches",
        "Eelskin Bodysuit",
        "Face Mask",
        "Fitted Dress",
        "Fitted Leggings",
        "Heavy Cloak",
        "Heavy Gloves",
        "Hide & Furs",
        "Hood & Veil",
        "Hooded Coat",
        "Knit Cap",
        "Leathers",
        "Long Coat",
        "Long Scarf",
        "Loose Silks",
        "Mask & Robes",
        "Rough Tunic",
        "Sharp Trousers",
        "Short Cloak",
        "Skirt & Blouse",
        "Slim Jacket",
        "Soft Boots",
        "Suspenders",
        "Tall Boots",
        "Tatters",
        "Thick Greatcoat",
        "Tool Belt",
        "Uniform",
        "Waxed Coat",
        "Wheelchair",
        "Wide Belt",
        "Work Boots"
      ]
    },
    name_title: [
      "Adept",
      "Archivist",
      "Captain",
      "Charter",
      "Scrivener"
    ],
    name_first: {
      male: [
        "Abel",
        "Abenthy",
        "Adric",
        "Airic",
        "Alabaster",
        "Alastair",
        "Aldo",
        "Alen",
        "Aleph",
        "Ambrose",
        "Amosen",
        "Andal",
        "Andrel",
        "Anton",
        "Aquilla",
        "Aradan",
        "Aram",
        "Archibald",
        "Archie",
        "Arden",
        "Arliden",
        "Arlyn",
        "Armand",
        "Arquo",
        "Arrell",
        "Arvus",
        "Asher",
        "Aurelio",
        "Benedict",
        "Bolster",
        "Brace",
        "Bran",
        "Brance",
        "Branon",
        "Bricks",
        "Brock",
        "Brutus",
        "Caius",
        "Carro",
        "Casian",
        "Cato",
        "Cavelle",
        "Cedric",
        "Chance",
        "Chauncey",
        "Cid",
        "Clave",
        "Cliff",
        "Cornelius",
        "Cross",
        "Crowl",
        "Cym",
        "Cyrus",
        "Declan",
        "Del",
        "Drav",
        "Drazhan",
        "Drem",
        "Edlun",
        "Edmund",
        "Edrom",
        "Edwin",
        "Elan",
        "Elend",
        "Elias",
        "Elodin",
        "Ephrim",
        "Erasmus",
        "Eremon",
        "Ethan",
        "Everitt",
        "Feldspar",
        "Fero",
        "Finn",
        "Fisher",
        "Galen",
        "Gallahad",
        "Garner",
        "Gilbert",
        "Glint",
        "Gnik",
        "Gregalos",
        "Grey",
        "Greyson",
        "Grifter",
        "Grine",
        "Gristofer",
        "Hadrian",
        "Hagran",
        "Hammond",
        "Hix",
        "Holtz",
        "Hugo",
        "Iden",
        "Irton",
        "Isaac",
        "Ivellios",
        "Jabari",
        "Jericho",
        "Jerod",
        "Kazimir",
        "Kellan",
        "Kelvyn",
        "Kelyr",
        "Khafra",
        "Kobb",
        "Kristov",
        "Kyrilu",
        "Lael",
        "Lafayette",
        "Laudius",
        "Lawrence",
        "Leif",
        "Lem",
        "Lenny",
        "Logan",
        "Lucas",
        "Lucius",
        "Lysander",
        "Milos",
        "Mord",
        "Morketh",
        "Morlan",
        "Myre",
        "Narcus",
        "Nehi",
        "Noggs",
        "Norton",
        "Obel",
        "Obelas",
        "Octavius",
        "Odelay",
        "Orem",
        "Orlan",
        "Orth",
        "Orton",
        "Pavel",
        "Perceval",
        "Percival",
        "Peregrine",
        "Phin",
        "Phineas",
        "Porto",
        "Preston",
        "Primo",
        "Quess",
        "Quill",
        "Rafe",
        "Rasmus",
        "Raul",
        "Resh",
        "Rias",
        "Ring",
        "Rivallo",
        "Rodmund",
        "Roethe",
        "Roose",
        "Roric",
        "Sethla",
        "Silas",
        "Sindri",
        "Snitch",
        "Sol",
        "Solomon",
        "Sprig",
        "Stavrul",
        "Stellan",
        "Stev",
        "Sym",
        "Tacitus",
        "Tarn",
        "Taylor",
        "Thackeray",
        "Thaddeus",
        "Thane",
        "Thelian",
        "Theo",
        "Theron",
        "Thurston",
        "Timoth",
        "Tisk",
        "Tocker",
        "Tristero",
        "Ulric",
        "Vask",
        "Veleris",
        "Ventaro",
        "Virgil",
        "Vond",
        "Wax",
        "Wayne",
        "Weaver",
        "Wester",
        "Winsley"
      ],
      female: [
        "Adaire",
        "Adelaide",
        "Adella",
        "Adroit",
        "Ailen",
        "Aina",
        "Akilah",
        "Albinia",
        "Althaea",
        "Alyosha",
        "Ansa",
        "Arabella",
        "Arwyl",
        "Ashlyn",
        "Avora",
        "Brena",
        "Brenna",
        "Calienthe",
        "Camilla",
        "Candor",
        "Candra",
        "Carissa",
        "Cascabel",
        "Casslyn",
        "Castille",
        "Celeste",
        "Chen",
        "Claret",
        "Clementine",
        "Constance",
        "Cordelia",
        "Corille",
        "Corsica",
        "Cyrene",
        "Dahlia",
        "Daphnia",
        "Delia",
        "Dena",
        "Denna",
        "Desmona",
        "Dolores",
        "Drenna",
        "Edie",
        "Eira",
        "Elsie",
        "Emeline",
        "Etta",
        "Fela",
        "Felicity",
        "Galenica",
        "Galina",
        "Gitta",
        "Gloria",
        "Gwen",
        "Hedy",
        "Hella",
        "Helles",
        "Henrietta",
        "Iduna",
        "Iona",
        "Isa",
        "Isabella",
        "Iskra",
        "Isolde",
        "Jasna",
        "Jaxi",
        "Joan",
        "Juno",
        "Kamelin",
        "Kari",
        "Koli",
        "Lauria",
        "Lenia",
        "Leona",
        "Leyva",
        "Lieu",
        "Lilith",
        "Lin",
        "Lizete",
        "Lorette",
        "Lucella",
        "Lynthia",
        "Lyra",
        "Maia",
        "Maiathah",
        "Maie",
        "Mara",
        "Marasi",
        "Marielda",
        "Marisol",
        "Marris",
        "Mira",
        "Naria",
        "Nasha",
        "Octavia",
        "Odrienne",
        "Olivia",
        "Ora",
        "Ordenna",
        "Oressia",
        "Orsella",
        "Pardenna",
        "Penelope",
        "Penny",
        "Phoebe",
        "Polonia",
        "Pravda",
        "Prudence",
        "Quelenna",
        "Raisa",
        "Redji",
        "Remira",
        "Rey",
        "Riven",
        "Runa",
        "Sabina",
        "Sabinia",
        "Sabrina",
        "Sadeh",
        "Sahar",
        "Selma",
        "Sesereth",
        "Severea",
        "Silaqui",
        "Skannon",
        "Sprig",
        "Stabitha",
        "Syra",
        "Tabitha",
        "Talitha",
        "Tamsyn",
        "Tasi",
        "Terra",
        "Tesslyn",
        "Thava",
        "Thena",
        "Tiff",
        "Una",
        "Vaurin",
        "Veretta",
        "Vesna",
        "Vestine",
        "Vey",
        "Victoria",
        "Vin",
        "Vita",
        "Volette",
        "Vorka",
        "Wander",
        "Ylva",
        "Zahra",
        "Zaida",
        "Zamira",
        "Zarya"
      ]
    },
    name_surname: [
      "Abberwick",
      "Adelbury",
      "Adleton",
      "Aloro",
      "Alsa",
      "Ankhayat",
      "Arran",
      "Ashton",
      "Ashweather",
      "Athanoch",
      "Axelrod",
      "Backworth",
      "Barrow",
      "Basran",
      "Black",
      "Blackford",
      "Blackpool",
      "Blackthorne",
      "Bluff",
      "Boden",
      "Booker",
      "Boulder",
      "Bowman",
      "Braeside",
      "Bramble",
      "Braum",
      "Bray",
      "Breakiron",
      "Bristle",
      "Brocken",
      "Brogan",
      "Bromley",
      "Burnsides",
      "Caebrek",
      "Cartwright",
      "Carver",
      "Childermass",
      "Claw",
      "Clelland",
      "Clemont",
      "Clermont",
      "Cobblecarver",
      "Coleburn",
      "Combe",
      "Comber",
      "Crofty",
      "Cunningham",
      "Daava",
      "Dal",
      "Dalmore",
      "Danfield",
      "Drawlight",
      "Drigg",
      "Dunvil",
      "Elmore",
      "Eveningeyes",
      "Evensteps",
      "Eventide",
      "Everpenny",
      "Fairplay",
      "Farros",
      "Fellwater",
      "Fogg",
      "Gatcombe",
      "Glasseye",
      "Goldsworth",
      "Grave",
      "Graythwaite",
      "Greysteel",
      "Grine",
      "Haig",
      "Half-Off",
      "Havelton",
      "Havenhorst",
      "Hectares",
      "Helker",
      "Helles",
      "Hellyers",
      "Hemme",
      "Hightower",
      "Hightown",
      "Highwater",
      "Hill",
      "Hitchcock",
      "Innerwick",
      "Jayan",
      "Jeduin",
      "Kardera",
      "Karstas",
      "Keel",
      "Kempt",
      "Kessarin",
      "Kinclaith",
      "King",
      "Lake",
      "Larriston",
      "Leake",
      "Lomond",
      "Longstaff",
      "Lorewood",
      "Maroden",
      "Mayson",
      "Merriweather",
      "Michter",
      "Mindwell",
      "Morcombe",
      "Morriston",
      "Mortimer",
      "Netherton",
      "Night",
      "Nighteyre",
      "Nightly",
      "Noctoft",
      "Notherhome",
      "Orchard",
      "Orchid",
      "Path",
      "Peak",
      "Pegg",
      "Penderyn",
      "Pond",
      "Pool",
      "Prichard",
      "Raines",
      "Ravenglass",
      "Ravenwood",
      "Reigns",
      "Reyes",
      "Reynes",
      "Rhodes",
      "Riverford",
      "Robel",
      "Rowan",
      "Sable",
      "Sage",
      "Salkara",
      "Salos",
      "Sevoy",
      "Shilbottle",
      "Shillmoor",
      "Shook",
      "Skelkallan",
      "Skora",
      "Slane",
      "Song",
      "Steadystep",
      "Stoutale",
      "Stovestoker",
      "Strange",
      "Strangford",
      "Strathmill",
      "Sunder",
      "Sunderland",
      "Swiftwhistle",
      "Tailor",
      "Tallfellow",
      "Templeton",
      "Tenpenny",
      "Tevilton",
      "Thistle",
      "Thrysus",
      "Thurston",
      "Tinmouth",
      "Tower",
      "Tristé",
      "Tyrconnell",
      "Vale",
      "Valentine",
      "Veldaire",
      "Venture",
      "Walund",
      "Warren",
      "Waters",
      "Wecker",
      "Welker",
      "Wend",
      "Wharver",
      "Whythe",
      "Woodall"
    ],
    name_alias: [
      "Bell",
      "Birch",
      "Bird",
      "Bliss",
      "Bricks",
      "Bug",
      "Chime",
      "Coil",
      "Cricket",
      "Cross",
      "Crow",
      "Echo",
      "Flint",
      "Frog",
      "Frost",
      "Goods",
      "Grip",
      "Gunner",
      "Hammer",
      "Hook",
      "Ink",
      "Junker",
      "Mist",
      "Moon",
      "Nail",
      "Needle",
      "Ogre",
      "Pool",
      "Ring",
      "Ruby",
      "Silver",
      "Skinner",
      "Song",
      "Spur",
      "Tackle",
      "Thistle",
      "Thorn",
      "Tick",
      "Tick-Tock",
      "Tock",
      "Trick",
      "Twelves",
      "Vixen",
      "Whip",
      "Wicker"
    ],
    name_suffix: [
      "Jr.",
      "Sr.",
      "III",
      "IV"
    ]
  },
  GM: {
    Bargains: [
      {name: "Infected Wound", category: "Character Effect", effect: "The next time you Recover from Harm, your Physicker is at -1d."},
      {name: "Infected Wound", category: "Character Effect", effect: "The next time you Recover from Harm, your Physicker is at -1d."},
      {name: "Infected Wound", category: "Character Effect", effect: "The next time you Recover from Harm, your Physicker is at -1d."},
      {name: "It's Mine Now", category: "Character Effect", effect: "You discover a small item that belongs to a rival. What is it? Who used to own it? How does this change things for you?"},
      {name: "It's Mine Now", category: "Character Effect", effect: "You discover a small item that belongs to a rival. What is it? Who used to own it? How does this change things for you?"},
      {name: "It's Mine Now", category: "Character Effect", effect: "You discover a small item that belongs to a rival. What is it? Who used to own it? How does this change things for you?"},
      {name: "Mine By Blood", category: "Character Effect", effect: "You discover evidence of the death of a family member during the Score. Who is it? How did they die? How does this change things for your character?"},
      {name: "Mine By Blood", category: "Character Effect", effect: "You discover evidence of the death of a family member during the Score. Who is it? How did they die? How does this change things for your character?"},
      {name: "Mine By Blood", category: "Character Effect", effect: "You discover evidence of the death of a family member during the Score. Who is it? How did they die? How does this change things for your character?"},
      {name: "Mine By Name", category: "Character Effect", effect: "You discover an envelope addressed to you during the Score. What is in it? Who left it here for you to find? How does this change things for your character?"},
      {name: "Mine By Name", category: "Character Effect", effect: "You discover an envelope addressed to you during the Score. What is in it? Who left it here for you to find? How does this change things for your character?"},
      {name: "Mine By Name", category: "Character Effect", effect: "You discover an envelope addressed to you during the Score. What is in it? Who left it here for you to find? How does this change things for your character?"},
      {name: "Mine By Rights", category: "Character Effect", effect: "You discover a small item from your past during the Score. What is it? What does it mean that it's here? Does this change things for your character?"},
      {name: "Mine By Rights", category: "Character Effect", effect: "You discover a small item from your past during the Score. What is it? What does it mean that it's here? Does this change things for your character?"},
      {name: "Mine By Rights", category: "Character Effect", effect: "You discover a small item from your past during the Score. What is it? What does it mean that it's here? Does this change things for your character?"},
      {name: "Not Paying Attention", category: "Character Effect", effect: "Uncheck one of the XP triggers already marked for your character for this Score."},
      {name: "Not Paying Attention", category: "Character Effect", effect: "Uncheck one of the XP triggers already marked for your character for this Score."},
      {name: "Shadow From the Past", category: "Character Effect", effect: "Your intel missed that someone from your past is associated with the target of the Score. Who is it, and how does that change things for you?"},
      {name: "Shadow From the Past", category: "Character Effect", effect: "Your intel missed that someone from your past is associated with the target of the Score. Who is it, and how does that change things for you?"},
      {name: "Shadow From the Past", category: "Character Effect", effect: "Your intel missed that someone from your past is associated with the target of the Score. Who is it, and how does that change things for you?"},
      {name: "Thicker than Blood", category: "Character Effect", effect: "Your intel missed that one of your family members is associated with the target of the Score. How does that change things for you?"},
      {name: "Thicker than Blood", category: "Character Effect", effect: "Your intel missed that one of your family members is associated with the target of the Score. How does that change things for you?"},
      {name: "Thicker than Blood", category: "Character Effect", effect: "Your intel missed that one of your family members is associated with the target of the Score. How does that change things for you?"},
      {name: "Why'd It Have To Be...", category: "Character Effect", effect: "The room you're in triggers a phobia that the Crew didn't know about before. Describe the phobia and take 2 Stress."},
      {name: "Why'd It Have To Be...", category: "Character Effect", effect: "The room you're in triggers a phobia that the Crew didn't know about before. Describe the phobia and take 2 Stress."},
      {name: "Why'd It Have To Be...", category: "Character Effect", effect: "The room you're in triggers a phobia that the Crew didn't know about before. Describe the phobia and take 2 Stress."},
      {name: "Demonic Guest", category: "Crew Effect", effect: "A demonic presence has appeared in your Lair and will need to be dealt with during Free Play."},
      {name: "Demonic Guest", category: "Crew Effect", effect: "A demonic presence has appeared in your Lair and will need to be dealt with during Free Play."},
      {name: "Fracturing Faction", category: "Crew Effect", effect: "If your Hold is Strong, reduce it to Weak. If your Hold is Weak, reduce your Rep to zero."},
      {name: "Lesson Not Learned", category: "Crew Effect", effect: "Uncheck one of the XP triggers already marked for your crew for this Score."},
      {name: "Lesson Not Learned", category: "Crew Effect", effect: "Uncheck one of the XP triggers already marked for your crew for this Score."},
      {name: "Otherworldly Guest", category: "Crew Effect", effect: "A scion of one of the Old Gods has appeared in your Lair and will need to be dealt with during Free Play."},
      {name: "Otherworldly Guest", category: "Crew Effect", effect: "A scion of one of the Old Gods has appeared in your Lair and will need to be dealt with during Free Play."},
      {name: "Rebellious Faction", category: "Crew Effect", effect: "A new crew has taken possession of one of your Claims, and will have to be dealt with in Free Play."},
      {name: "Spectral Guest", category: "Crew Effect", effect: "A ghostly presence has appeared in your Lair and will need to be dealt with during Free Play."},
      {name: "Spectral Guest", category: "Crew Effect", effect: "A ghostly presence has appeared in your Lair and will need to be dealt with during Free Play."},
      {name: "Turncoat", category: "Crew Effect", effect: "One of your Cohorts leaves your crew and joins a rival."},
      {name: "Double-Crossed", category: "Downtime Effect", effect: "After the normal Entanglement roll and result, your Crew takes an additional Flipped result."},
      {name: "Double-Crossed", category: "Downtime Effect", effect: "After the normal Entanglement roll and result, your Crew takes an additional Flipped result."},
      {name: "Double-Crossed", category: "Downtime Effect", effect: "After the normal Entanglement roll and result, your Crew takes an additional Flipped result."},
      {name: "Easily Identified", category: "Downtime Effect", effect: "You left something behind that is easily traced to you. Choose either +2 Heat and −2 Rep, or +1 Heat and −1 Rep."},
      {name: "Easily Identified", category: "Downtime Effect", effect: "You left something behind that is easily traced to you. Choose either +2 Heat and −2 Rep, or +1 Heat and −1 Rep."},
      {name: "Easily Identified", category: "Downtime Effect", effect: "You left something behind that is easily traced to you. Choose either +2 Heat and −2 Rep, or +1 Heat and −1 Rep."},
      {name: "High Profile", category: "Downtime Effect", effect: "This Score gains +2 Heat."},
      {name: "High Profile", category: "Downtime Effect", effect: "This Score gains +2 Heat."},
      {name: "High Profile", category: "Downtime Effect", effect: "This Score gains +2 Heat."},
      {name: "Most Wanted", category: "Downtime Effect", effect: "After the normal Entanglement roll and result, you are the target of an additional Arrest result."},
      {name: "Most Wanted", category: "Downtime Effect", effect: "After the normal Entanglement roll and result, you are the target of an additional Arrest result."},
      {name: "Project Setback", category: "Downtime Effect", effect: "Mark one less Clock segment the first time you work on a Long-Term Project."},
      {name: "Project Setback", category: "Downtime Effect", effect: "Mark one less Clock segment the first time you work on a Long-Term Project."},
      {name: "Project Setback", category: "Downtime Effect", effect: "Mark one less Clock segment the first time you work on a Long-Term Project."},
      {name: "Quelle Horreur!", category: "Downtime Effect", effect: "You suffer nightmares for a week. −1d to all Downtime Actions after this Score."},
      {name: "Quelle Horreur!", category: "Downtime Effect", effect: "You suffer nightmares for a week. −1d to all Downtime Actions after this Score."},
      {name: "Shortchanged", category: "Downtime Effect", effect: "This Score's payoff is −2 Coin."},
      {name: "Shortchanged", category: "Downtime Effect", effect: "This Score's payoff is −2 Coin."},
      {name: "Shortchanged", category: "Downtime Effect", effect: "This Score's payoff is −2 Coin."},
      {name: "Supply Challenges", category: "Downtime Effect", effect: "The next time you pay Coin for an Acquire Asset roll, you must pay 3 instead of 2 Coin per Tier."},
      {name: "Supply Challenges", category: "Downtime Effect", effect: "The next time you pay Coin for an Acquire Asset roll, you must pay 3 instead of 2 Coin per Tier."},
      {name: "Supply Delays", category: "Downtime Effect", effect: "Suffer -1d to your next Acquire Asset roll."},
      {name: "Supply Delays", category: "Downtime Effect", effect: "Suffer -1d to your next Acquire Asset roll."},
      {name: "Supply Delays", category: "Downtime Effect", effect: "Suffer -1d to your next Acquire Asset roll."},
      {name: "Tastes Like Ashes", category: "Downtime Effect", effect: "The next time you indulge your Vice, only clear half as much Stress (rounded down) as normal."},
      {name: "Tastes Like Ashes", category: "Downtime Effect", effect: "The next time you indulge your Vice, only clear half as much Stress (rounded down) as normal."},
      {name: "Thrice-Named", category: "Downtime Effect", effect: "After the normal Entanglement roll and result, your Crew takes an additional Demonic Notice result."},
      {name: "Thrice-Named", category: "Downtime Effect", effect: "After the normal Entanglement roll and result, your Crew takes an additional Demonic Notice result."},
      {name: "Thrice-Named", category: "Downtime Effect", effect: "After the normal Entanglement roll and result, your Crew takes an additional Demonic Notice result."},
      {name: "Warden's Attention", category: "Downtime Effect", effect: "+4 Heat (instead of the normal +2 Heat) if there is a death during this Score."},
      {name: "Warden's Attention", category: "Downtime Effect", effect: "+4 Heat (instead of the normal +2 Heat) if there is a death during this Score."},
      {name: "We Want a Bigger Take!", category: "Downtime Effect", effect: "The gang wants a bigger piece of the action. −2 Coin to Payoff for each Cohort used in this Score."},
      {name: "We Want a Bigger Take!", category: "Downtime Effect", effect: "The gang wants a bigger piece of the action. −2 Coin to Payoff for each Cohort used in this Score."},
      {name: "Weekend Getaway", category: "Downtime Effect", effect: "If you indulge your Vice after this Score, you automatically overindulge."},
      {name: "Weekend Getaway", category: "Downtime Effect", effect: "If you indulge your Vice after this Score, you automatically overindulge."},
      {name: "Weekend Getaway", category: "Downtime Effect", effect: "If you indulge your Vice after this Score, you automatically overindulge."},
      {name: "What's Our Take?", category: "Downtime Effect", effect: "The gang wants a bigger piece of the action. −1 Coin to Payoff for each Cohort used in this Score."},
      {name: "What's Our Take?", category: "Downtime Effect", effect: "The gang wants a bigger piece of the action. −1 Coin to Payoff for each Cohort used in this Score."},
      {name: "What's Our Take?", category: "Downtime Effect", effect: "The gang wants a bigger piece of the action. −1 Coin to Payoff for each Cohort used in this Score."},
      {name: "Accelerating Plans", category: "Faction Relationship Effect", effect: "A rival faction advances one of its Clocks by two before your next Score."},
      {name: "Accelerating Plans", category: "Faction Relationship Effect", effect: "A rival faction advances one of its Clocks by two before your next Score."},
      {name: "Accelerating Plans", category: "Faction Relationship Effect", effect: "A rival faction advances one of its Clocks by two before your next Score."},
      {name: "Escalating Tensions", category: "Faction Relationship Effect", effect: "A faction of your choice that is unfriendly to your crew moves one step towards War."},
      {name: "Escalating Tensions", category: "Faction Relationship Effect", effect: "A faction of your choice that is unfriendly to your crew moves one step towards War."},
      {name: "Forgiveness or Vengeance?", category: "Faction Relationship Effect", effect: "During the Score, one of your Cohorts got in a fight with an neutral Cohort. Choose −2 Rep and +1 faction relationship, or +2 Rep and −1 faction relationship."},
      {name: "Forgiveness or Vengeance?", category: "Faction Relationship Effect", effect: "During the Score, one of your Cohorts got in a fight with an neutral Cohort. Choose −2 Rep and +1 faction relationship, or +2 Rep and −1 faction relationship."},
      {name: "Forgiveness or Vengeance?", category: "Faction Relationship Effect", effect: "During the Score, one of your Cohorts got in a fight with an neutral Cohort. Choose −2 Rep and +1 faction relationship, or +2 Rep and −1 faction relationship."},
      {name: "Hot-Headed Cohort", category: "Faction Relationship Effect", effect: "During the Score, one of your Cohorts picked a fight with an allied Cohort. Pay 2 Coin, lose 2 Rep, or −1 faction relationship."},
      {name: "Hot-Headed Cohort", category: "Faction Relationship Effect", effect: "During the Score, one of your Cohorts picked a fight with an allied Cohort. Pay 2 Coin, lose 2 Rep, or −1 faction relationship."},
      {name: "Hot-Headed Cohort", category: "Faction Relationship Effect", effect: "During the Score, one of your Cohorts picked a fight with an allied Cohort. Pay 2 Coin, lose 2 Rep, or −1 faction relationship."},
      {name: "Mixed Messages", category: "Faction Relationship Effect", effect: "A faction of your choice that is friendly to your crew moves one step towards Neutral."},
      {name: "Mixed Messages", category: "Faction Relationship Effect", effect: "A faction of your choice that is friendly to your crew moves one step towards Neutral."},
      {name: "Mutual Defense", category: "Faction Relationship Effect", effect: "A friendly Faction goes to War with a neutral Faction. Either join their War, or they move to −1 on the relationship chart."},
      {name: "Mutual Defense", category: "Faction Relationship Effect", effect: "A friendly Faction goes to War with a neutral Faction. Either join their War, or they move to −1 on the relationship chart."},
      {name: "Tensions Spread", category: "Faction Relationship Effect", effect: "One Neutral Faction moves a step towards War, and another Neutral Faction moves a step towards Ally."},
      {name: "Tensions Spread", category: "Faction Relationship Effect", effect: "One Neutral Faction moves a step towards War, and another Neutral Faction moves a step towards Ally."},
      {name: "Tensions Spread", category: "Faction Relationship Effect", effect: "One Neutral Faction moves a step towards War, and another Neutral Faction moves a step towards Ally."},
      {name: "The Walls Have Ears", category: "Faction Relationship Effect", effect: "A friendly faction hears you did a Score against their ally. −1 to that faction's relationship rating."},
      {name: "The Walls Have Ears", category: "Faction Relationship Effect", effect: "A friendly faction hears you did a Score against their ally. −1 to that faction's relationship rating."},
      {name: "The Walls Have Ears", category: "Faction Relationship Effect", effect: "A friendly faction hears you did a Score against their ally. −1 to that faction's relationship rating."},
      {name: "The Walls Have Eyes", category: "Faction Relationship Effect", effect: "A friendly faction hears you did a Score against their ally. −1 to both factions' relationship ratings."},
      {name: "The Walls Have Eyes", category: "Faction Relationship Effect", effect: "A friendly faction hears you did a Score against their ally. −1 to both factions' relationship ratings."},
      {name: "...and Into the Fire", category: "Immediate Effect", effect: "You are ambushed by an assassin or bounty hunter. Start a 4-Clock, 'Elite Ambusher' to overcome this new foe."},
      {name: "...and Into the Fire", category: "Immediate Effect", effect: "You are ambushed by an assassin or bounty hunter. Start a 4-Clock, 'Elite Ambusher' to overcome this new foe."},
      {name: "A Familiar Face", category: "Immediate Effect", effect: "You recognize a contact of your choice among the rivals you are running the Score against."},
      {name: "A Familiar Face", category: "Immediate Effect", effect: "You recognize a contact of your choice among the rivals you are running the Score against."},
      {name: "A Familiar Face", category: "Immediate Effect", effect: "You recognize a contact of your choice among the rivals you are running the Score against."},
      {name: "Accidental Discharge", category: "Immediate Effect", effect: "A weapon or item you are carrying loudly discharges and needs to be reloaded before it can be used."},
      {name: "Accidental Discharge", category: "Immediate Effect", effect: "A weapon or item you are carrying loudly discharges and needs to be reloaded before it can be used."},
      {name: "Accidental Discharge", category: "Immediate Effect", effect: "A weapon or item you are carrying loudly discharges and needs to be reloaded before it can be used."},
      {name: "All or Nothing", category: "Immediate Effect", effect: "If you fail this roll, you cannot resist the effects of that failure."},
      {name: "All or Nothing", category: "Immediate Effect", effect: "If you fail this roll, you cannot resist the effects of that failure."},
      {name: "All or Nothing", category: "Immediate Effect", effect: "If you fail this roll, you cannot resist the effects of that failure."},
      {name: "Bishop's Gambit", category: "Immediate Effect", effect: "If you are not in combat, gain +2d for this roll instead of the standard +1d; but you can roll no more than 1d for your next Action."},
      {name: "Bishop's Gambit", category: "Immediate Effect", effect: "If you are not in combat, gain +2d for this roll instead of the standard +1d; but you can roll no more than 1d for your next Action."},
      {name: "Bishop's Gambit", category: "Immediate Effect", effect: "If you are not in combat, gain +2d for this roll instead of the standard +1d; but you can roll no more than 1d for your next Action."},
      {name: "Brute Force Method", category: "Immediate Effect", effect: "You noisily break a weapon of your choice while attempting this Action, even if it is not a combat Action."},
      {name: "Brute Force Method", category: "Immediate Effect", effect: "You noisily break a weapon of your choice while attempting this Action, even if it is not a combat Action."},
      {name: "Brute Force Method", category: "Immediate Effect", effect: "You noisily break a weapon of your choice while attempting this Action, even if it is not a combat Action."},
      {name: "Clear the Board", category: "Immediate Effect", effect: "If you succeed at this roll, clear or fill a Score Clock of your choice. If you fail the roll, you Trauma out of the scene."},
      {name: "Clear the Board", category: "Immediate Effect", effect: "If you succeed at this roll, clear or fill a Score Clock of your choice. If you fail the roll, you Trauma out of the scene."},
      {name: "Devil's Exchange", category: "Immediate Effect", effect: "You gain the normal +1d to this roll, but suffer −1d to your next Action, and cannot take a Devil's Bargain to offset it."},
      {name: "Devil's Exchange", category: "Immediate Effect", effect: "You gain the normal +1d to this roll, but suffer −1d to your next Action, and cannot take a Devil's Bargain to offset it."},
      {name: "Devil's Exchange", category: "Immediate Effect", effect: "You gain the normal +1d to this roll, but suffer −1d to your next Action, and cannot take a Devil's Bargain to offset it."},
      {name: "Ghostly Attention", category: "Immediate Effect", effect: "Whether you succeed in this roll or not, a ghost in the area notices you and begins stalking you."},
      {name: "Ghostly Attention", category: "Immediate Effect", effect: "Whether you succeed in this roll or not, a ghost in the area notices you and begins stalking you."},
      {name: "Ghostly Attention", category: "Immediate Effect", effect: "Whether you succeed in this roll or not, a ghost in the area notices you and begins stalking you."},
      {name: "Gimcrack Gear", category: "Immediate Effect", effect: "Whatever weapon or tool you are using is cheaply made and breaks whether the roll succeeds or not."},
      {name: "Gimcrack Gear", category: "Immediate Effect", effect: "Whatever weapon or tool you are using is cheaply made and breaks whether the roll succeeds or not."},
      {name: "Gimcrack Gear", category: "Immediate Effect", effect: "Whatever weapon or tool you are using is cheaply made and breaks whether the roll succeeds or not."},
      {name: "Gone Rogue", category: "Immediate Effect", effect: "You cannot accept an Assist for the rest of this Score."},
      {name: "Gone Rogue", category: "Immediate Effect", effect: "You cannot accept an Assist for the rest of this Score."},
      {name: "Hunter Becomes Hunted", category: "Immediate Effect", effect: "You've been so preoccupied with the obstacles in front of you that you didn't notice the rival lining up a shot behind you."},
      {name: "Hunter Becomes Hunted", category: "Immediate Effect", effect: "You've been so preoccupied with the obstacles in front of you that you didn't notice the rival lining up a shot behind you."},
      {name: "Hunter Becomes Hunted", category: "Immediate Effect", effect: "You've been so preoccupied with the obstacles in front of you that you didn't notice the rival lining up a shot behind you."},
      {name: "I Know I Packed It!", category: "Immediate Effect", effect: "You must immediately check off 1 Load to no effect, representing equipment you've misplaced."},
      {name: "I Know I Packed It!", category: "Immediate Effect", effect: "You must immediately check off 1 Load to no effect, representing equipment you've misplaced."},
      {name: "I Know I Packed It!", category: "Immediate Effect", effect: "You must immediately check off 1 Load to no effect, representing equipment you've misplaced."},
      {name: "I Know I Packed Them!", category: "Immediate Effect", effect: "You must immediately check off 2 Load to no effect, representing equipment you've misplaced."},
      {name: "I Know I Packed Them!", category: "Immediate Effect", effect: "You must immediately check off 2 Load to no effect, representing equipment you've misplaced."},
      {name: "I Know I Packed Them!", category: "Immediate Effect", effect: "You must immediately check off 2 Load to no effect, representing equipment you've misplaced."},
      {name: "Jangled Nerves", category: "Immediate Effect", effect: "For the rest of the Score, all rolls to Resist generate +1 Stress."},
      {name: "Jangled Nerves", category: "Immediate Effect", effect: "For the rest of the Score, all rolls to Resist generate +1 Stress."},
      {name: "Jangled Nerves", category: "Immediate Effect", effect: "For the rest of the Score, all rolls to Resist generate +1 Stress."},
      {name: "Just a Little Spark", category: "Immediate Effect", effect: "A lamp or candle gets knocked over, catching a curtain or rug on fire. Start a Clock: 'Building is on Fire'."},
      {name: "Just a Little Spark", category: "Immediate Effect", effect: "A lamp or candle gets knocked over, catching a curtain or rug on fire. Start a Clock: 'Building is on Fire'."},
      {name: "Just a Little Spark", category: "Immediate Effect", effect: "A lamp or candle gets knocked over, catching a curtain or rug on fire. Start a Clock: 'Building is on Fire'."},
      {name: "King's Gambit", category: "Immediate Effect", effect: "If you fail at this roll, you are immune to any Harm; but you have a zero rating to your next Action."},
      {name: "King's Gambit", category: "Immediate Effect", effect: "If you fail at this roll, you are immune to any Harm; but you have a zero rating to your next Action."},
      {name: "King's Gambit", category: "Immediate Effect", effect: "If you fail at this roll, you are immune to any Harm; but you have a zero rating to your next Action."},
      {name: "Knight's Gambit", category: "Immediate Effect", effect: "If you are in combat, gain +2d for this roll instead of the standard +1d; but you can roll no more than 1d for your next Action."},
      {name: "Knight's Gambit", category: "Immediate Effect", effect: "If you are in combat, gain +2d for this roll instead of the standard +1d; but you can roll no more than 1d for your next Action."},
      {name: "Knight's Gambit", category: "Immediate Effect", effect: "If you are in combat, gain +2d for this roll instead of the standard +1d; but you can roll no more than 1d for your next Action."},
      {name: "Knuckle Buster", category: "Immediate Effect", effect: "Whether this Action succeeds or not, you accidentally inflict level 1 Harm on your hand, 'Busted Knuckles.'"},
      {name: "Knuckle Buster", category: "Immediate Effect", effect: "Whether this Action succeeds or not, you accidentally inflict level 1 Harm on your hand, 'Busted Knuckles.'"},
      {name: "Knuckle Buster", category: "Immediate Effect", effect: "Whether this Action succeeds or not, you accidentally inflict level 1 Harm on your hand, 'Busted Knuckles.'"},
      {name: "Now or Never", category: "Immediate Effect", effect: "If you fail this roll, you lose this opportunity and cannot retry it for this Score."},
      {name: "Now or Never", category: "Immediate Effect", effect: "If you fail this roll, you lose this opportunity and cannot retry it for this Score."},
      {name: "Now or Never", category: "Immediate Effect", effect: "If you fail this roll, you lose this opportunity and cannot retry it for this Score."},
      {name: "Out of the Frying Pan...", category: "Immediate Effect", effect: "Things are about to go from bad to worse. Start a 4-Clock, 'Surprise Reinforcements'."},
      {name: "Out of the Frying Pan...", category: "Immediate Effect", effect: "Things are about to go from bad to worse. Start a 4-Clock, 'Surprise Reinforcements'."},
      {name: "Out of the Frying Pan...", category: "Immediate Effect", effect: "Things are about to go from bad to worse. Start a 4-Clock, 'Surprise Reinforcements'."},
      {name: "Overextended", category: "Immediate Effect", effect: "Your next Action automatically has reduced Effect."},
      {name: "Overextended", category: "Immediate Effect", effect: "Your next Action automatically has reduced Effect."},
      {name: "Overextended", category: "Immediate Effect", effect: "Your next Action automatically has reduced Effect."},
      {name: "Pawn's Gambit", category: "Immediate Effect", effect: "You cannot use Load for Armor during this Score. You cannot accept this bargain if you already have used Load for Armor."},
      {name: "Pawn's Gambit", category: "Immediate Effect", effect: "You cannot use Load for Armor during this Score. You cannot accept this bargain if you already have used Load for Armor."},
      {name: "Pawn's Gambit", category: "Immediate Effect", effect: "You cannot use Load for Armor during this Score. You cannot accept this bargain if you already have used Load for Armor."},
      {name: "Plan C...", category: "Immediate Effect", effect: "Things are not going according to plan. Flashbacks cost +1 Stress for the rest of the Score."},
      {name: "Plan C...", category: "Immediate Effect", effect: "Things are not going according to plan. Flashbacks cost +1 Stress for the rest of the Score."},
      {name: "Queen's Gambit", category: "Immediate Effect", effect: "You automatically succeed at this Action as if you rolled a 6; but you have a zero rating to your next Action."},
      {name: "Queen's Gambit", category: "Immediate Effect", effect: "You automatically succeed at this Action as if you rolled a 6; but you have a zero rating to your next Action."},
      {name: "Queen's Gambit", category: "Immediate Effect", effect: "You automatically succeed at this Action as if you rolled a 6; but you have a zero rating to your next Action."},
      {name: "Quicksilver Poisoning", category: "Immediate Effect", effect: "Used in electroplasmic containers and devices, you get a noseful of quicksilver vapor, suffering level 1 Harm, 'Silverlung' which starts a 4-Clock Project to heal."},
      {name: "Quicksilver Poisoning", category: "Immediate Effect", effect: "Used in electroplasmic containers and devices, you get a noseful of quicksilver vapor, suffering level 1 Harm, 'Silverlung' which starts a 4-Clock Project to heal."},
      {name: "Quicksilver Poisoning", category: "Immediate Effect", effect: "Used in electroplasmic containers and devices, you get a noseful of quicksilver vapor, suffering level 1 Harm, 'Silverlung' which starts a 4-Clock Project to heal."},
      {name: "Rook's Gambit", category: "Immediate Effect", effect: "You cannot use Load for Unusual or Scary Weapons this Score. You cannot accept this bargain if you already have used Load for these."},
      {name: "Rook's Gambit", category: "Immediate Effect", effect: "You cannot use Load for Unusual or Scary Weapons this Score. You cannot accept this bargain if you already have used Load for these."},
      {name: "Rook's Gambit", category: "Immediate Effect", effect: "You cannot use Load for Unusual or Scary Weapons this Score. You cannot accept this bargain if you already have used Load for these."},
      {name: "Shot Nerves", category: "Immediate Effect", effect: "For the rest of the Score, all rolls to Resist generate +2 Stress."},
      {name: "Shot Nerves", category: "Immediate Effect", effect: "For the rest of the Score, all rolls to Resist generate +2 Stress."},
      {name: "Turned Around", category: "Immediate Effect", effect: "You lose track of your position. Start a 4-Clock, 'Where Am I?' You must use Actions looking for your Crew to rejoin them."},
      {name: "Turned Around", category: "Immediate Effect", effect: "You lose track of your position. Start a 4-Clock, 'Where Am I?' You must use Actions looking for your Crew to rejoin them."},
      {name: "Turned Around", category: "Immediate Effect", effect: "You lose track of your position. Start a 4-Clock, 'Where Am I?' You must use Actions looking for your Crew to rejoin them."},
      {name: "Unsure Footing", category: "Immediate Effect", effect: "Whether you succeed in this roll or not, you loose your footing and fall prone after this Action."},
      {name: "Unsure Footing", category: "Immediate Effect", effect: "Whether you succeed in this roll or not, you loose your footing and fall prone after this Action."},
      {name: "Unsure Footing", category: "Immediate Effect", effect: "Whether you succeed in this roll or not, you loose your footing and fall prone after this Action."},
      {name: "Worse than We thought", category: "Immediate Effect", effect: "A Clock of your choice that is running for this Score is either advanced or set back by two segments (whichever is worse for the Crew)."},
      {name: "Worse than We thought", category: "Immediate Effect", effect: "A Clock of your choice that is running for this Score is either advanced or set back by two segments (whichever is worse for the Crew)."},
      {name: "You're All On Your Own", category: "Immediate Effect", effect: "After this roll, you cannot offer to Assist on anyone else's roll for the rest of the Score."},
      {name: "You're All On Your Own", category: "Immediate Effect", effect: "After this roll, you cannot offer to Assist on anyone else's roll for the rest of the Score."},
      {name: "You're All On Your Own", category: "Immediate Effect", effect: "After this roll, you cannot offer to Assist on anyone else's roll for the rest of the Score."},
      {name: "Death Will Not Stop Me", category: "Long-Term Effect", effect: "The ghost of someone you killed is driven to take you with it. Start a 12-Clock, 'Spectral Vengence'"},
      {name: "That's Enough of That", category: "Long-Term Effect", effect: "Someone whose goals are affected by this Score is going to focus on you now. Start a 8-Clock, 'Cold Vengence'"},
      {name: "That's Enough of That", category: "Long-Term Effect", effect: "Someone whose goals are affected by this Score is going to focus on you now. Start a 8-Clock, 'Cold Vengence'"},
      {name: "The Last Straw", category: "Long-Term Effect", effect: "You've royally pissed off someone with real clout in the city. Start a 12-Clock, 'Furious Vengence'"},
      {name: "You'll Pay For This", category: "Long-Term Effect", effect: "Someone hurt by this Score will come back to collect what's owed. Start a 6-Clock, 'Petty Vengence'"},
      {name: "You'll Pay For This", category: "Long-Term Effect", effect: "Someone hurt by this Score will come back to collect what's owed. Start a 6-Clock, 'Petty Vengence'"},
      {name: "You'll Pay For This", category: "Long-Term Effect", effect: "Someone hurt by this Score will come back to collect what's owed. Start a 6-Clock, 'Petty Vengence'"},
      {name: "Dalgomur, the Heart of the Storm", category: "Mandatory Effect", effect: "If one is not already active for the crew, start a 12-Clock labeled 'The Heart of the Storm' and set it to one. If the Clock is already active, advance it by one."},
      {name: "Dalgomur, the Heart of the Storm", category: "Mandatory Effect", effect: "If one is not already active for the crew, start a 12-Clock labeled 'The Heart of the Storm' and set it to one. If the Clock is already active, advance it by one."},
      {name: "Ulf Ironborn, the Skovlan Agitator", category: "Mandatory Effect", effect: "If one is not already active for the crew, start a 4-Clock labeled 'Skovlander Uprising' and set it to one. If the Clock is already active, advance it by one."},
      {name: "Ulf Ironborn, the Skovlan Agitator", category: "Mandatory Effect", effect: "If one is not already active for the crew, start a 4-Clock labeled 'Skovlander Uprising' and set it to one. If the Clock is already active, advance it by one."},
      {name: "Urumbar, the Closed Eye", category: "Mandatory Effect", effect: "If one is not already active for the crew, start an 8-Clock labeled 'The Closed Eye' and set it to one. If the Clock is already active, advance it by one."},
      {name: "Urumbar, the Closed Eye", category: "Mandatory Effect", effect: "If one is not already active for the crew, start an 8-Clock labeled 'The Closed Eye' and set it to one. If the Clock is already active, advance it by one."},
      {name: "Vaskani, the Crossroads Demon", category: "Mandatory Effect", effect: "If one is not already active for the crew, start a 6-Clock labeled 'The Crossroads Demon' and set it to one. If the Clock is already active, advance it by one."},
      {name: "Vaskani, the Crossroads Demon", category: "Mandatory Effect", effect: "If one is not already active for the crew, start a 6-Clock labeled 'The Crossroads Demon' and set it to one. If the Clock is already active, advance it by one."}
    ],
    Obstacles: [
      {
        name:      "Centipedes",
        category:  "Animal Guards",
        desc:      "Centipedes the length of a forearm are almost noiseless. If they bite, their toxin causes living flesh to blacken and die, leading to amputation if the poison isn't countered. People tend to scream when bit.",
        questions: [
          "Were the centipedes brought in as guardians, or are they a local nuisance?",
          "There are many different breeds, how will you describe the appearance of yours?",
          "Do they have a nasty local nickname?"
        ],
        modsHarder: [
          "When one attacks it releases a scent that enrages others nearby, so they tend to swarm.",
          "They are excellent swimmers, and they hunt in bog-like areas under the surface."
        ],
        modsEasier: [
          "They are bright yellow and red, and hiss before striking, giving all the warning possible.",
          "All the guardians and neighbors carry the antidote, the local apothecary knows what you need."
        ]
      },
      {
        name:      "Great Cats",
        category:  "Animal Guards",
        desc:      "One or more great cats slink through the shadows. They like to attack from high places. Their fur mottles to match the colors and tones and textures around them.",
        questions: [
          "Did the current owners bring them in, or are they inherited from a previous owner?",
          "Do they stay on the estate, or go hunting in the local neighborhood?"
        ],
        modsHarder: [
          "The cats are trained to alert guards (or wear charm jewelry to alert supernatural guardians) when they detect intruders with their keen senses.",
          "Massive old trees draped with moss, or many ledges and overlooks, provide the cats cover."
        ],
        modsEasier: [
          "There is only one, with a regular feeding time and place.",
          "The cats are well fed and lazy, mostly for show unless provoked."
        ]
      },
      {
        name:      "Hunting Spiders",
        category:  "Animal Guards",
        desc:      "These lightning-fast nightmares are about twenty pounds and three feet across, built like jumping spiders and loaded with paralytic venom.",
        questions: [
          "Were these spiders bred for a decadent aristocrat, or warped to this impossible size by an insane whisper?",
          "Can they survive away from a spirit well?",
          "What noise do they make?",
          "How do they smell?"
        ],
        modsHarder: [
          "They are mostly trained, their handler using a slide whistle to give orders to hunt, attack, withdraw, or guard.",
          "The color of the stone, the shape of the underbrush, the leaf litter--everything matches the spider color scheme and hides its movement."
        ],
        modsEasier: [
          "Little lasting harm at first; paralyzed prey is dragged back to a lair and webbed up. You have a day or so to rescue the prey before the spider injects acid into the web bundle so it can drink its victim.",
          "The poison is weak and easy to resist, requiring several successful bites to put a human down."
        ]
      },
      {
        name:      "Mastiff Pack",
        category:  "Animal Guards",
        desc:      "A pack of mastiffs have run of the guarded area when it is not in more public use. They only respond to their masters, who have special tunics, whistles, and gloves. They kill anyone or anything else.",
        questions: [
          "What is their heraldry?",
          "How many mastiffs are in the pack?",
          "Are they trained well enough to ignore poisoned meat or live animal distractions?"
        ],
        modsHarder: [
          "Each one is precious to the site owner, who will tirelessly seek vengeance if they are hurt.",
          "The pack masters are elite veterans with firearms and excellent tracking and hunting skills."
        ],
        modsEasier: [
          "The equipment is properly installed, its vulnerable parts behind the energy curtain, directly guarding what needs protecting.",
          "The lightning walls attract loose spirits, intruders may also have to contend with confused ghosts."
        ]
      },
      {
        name:      "Venomous Snakes",
        category:  "Animal Guards",
        desc:      "Venomous snakes have lairs prepared for them in the guarded area.",
        questions: [
          "How fast acting is their venom?",
          "How aggressive are they?",
          "Is their hide camouflage for hunting, or bright to warn away predators?",
          "Are there only a few big ones, or many small snakes?",
          "Do the site guardians feed them, or can they find enough vermin on their own?"
        ],
        modsHarder: [
          "Knee-deep plants and elevation shifts intentionally make it difficult to see snakes.",
          "Other guardians have a side business in selling venom and meat and hides. They have venom blowdarts and poisoned daggers."
        ],
        modsEasier: [
          "The snakes dislike a certain whistle tone. Let out a blast occasionally and they'll stay away.",
          "A former employee knows how guardians got around the site with minimal risk of snakes."
        ]
      },
      {
        name:      "Armor Hosts",
        category:  "Ghostly Guards",
        desc:      "Guardian spirits are able to inhabit a crystal melded to each suit of armor in a guarded area. When melded, the spirit can control the armor. Spirits use the armor to attack intruders.",
        questions: [
          "Were the suits of armor built for this purpose, or retrofitted by a spirit trafficker?",
          "Are the guardian spirits loyal, or were they stripped of their will by a ritual or other power?",
          "Are the suits visibly paranormal?"
        ],
        modsHarder: [
          "A single powerful (relatively sane) spirit can flit from armor to armor, backed up by two slave spirits. The guardian can form an electroplasmic face in the helmet to sneer at intruders.",
          "A swarm of spirits are eager to take their turn in armor. When one tires another drops in.",
          "Ceaseless patrol."
        ],
        modsEasier: [
          "The ghost(s) that animate the armor are murderous and difficult to control.",
          "The guardians can play a chime to recall them to a restraining prism.",
          "The suits of armor are old, battered, and prone to physical failure."
        ]
      },
      {
        name:      "Coldrooms",
        category:  "Ghostly Guards",
        desc:      "The defended area is kept cold. Body heat registers like a plume of blood in the water. Ghosts flood living meat with cold, gorging on body heat, becoming more visible as their outlines swirl with life-blood.",
        questions: [
          "Were they created by ritually starving victims to death in the defended space?",
          "Were they stolen from the site of a massive horrific disaster?",
          "Does a spirit trafficker maintain the wards on the space?"
        ],
        modsHarder: [
          "A dead whisper leads them, countering defensive charms and magic, sniffing out breath even if heat is concealed, dueling any supernatural defense.",
          "The guarded area is powerfully warded and underground where temperature is easy to maintain."
        ],
        modsEasier: [
          "The guarded area is vulnerable to weather conditions. It is sharp in the cold, but almost dormant in the heat.",
          "A relatively simple spirit bane charm can keep them at bay if created in tune with the site."
        ]
      },
      {
        name:      "Cursed Treasure",
        category:  "Ghostly Guards",
        desc:      "Treasures are infused with a haunting spirit. Anyone touching the treasure will be cursed, dreaming the crimes of the ghost and attracting anger and distaste from strangers. Friends become uncomfortable and suspicious around the cursed scoundrel.",
        questions: [
          "Were those sacrificed to make the haunts loyal, serving past death, or punished by undeath?",
          "Is the treasure marked as cursed?"
        ],
        modsHarder: [
          "The haunting is so deadly that it drives most victims to suicide within a week. Resourceful scoundrels with access to spirit traffickers have days to somehow break the hold. Others are doomed.",
          "Electroplasmic poisoning begins, and within a week the scoundrel will become a vampire."
        ],
        modsEasier: [
          "All the bad luck waiting in the wings (unfinished clocks from foes, poorly protected stashes, jilted lovers, false identities) go wrong in quick succession. Then the curse is over.",
          "A competent occultist can break the curse as a down time project with a four segment clock."
        ]
      },
      {
        name:      "Darkrooms",
        category:  "Ghostly Guards",
        desc:      "The defended area is dark. The ragged ghosts hate light. They shriek horribly as they attack light sources with slapping leathery hands, like bat wings. Intruders may glimpse their luminous fangs.",
        questions: [
          "Were these ghosts placed here intentionally, or are they the result of some horror that left a print in the Ghost Field?",
          "Is this defense maintained, or passive?"
        ],
        modsHarder: [
          "Another guardian lurks in the dark and takes advantage of the distraction to steal from intruders, perhaps killing them too.",
          "The ghosts are aggressive, pushing intruders. Surroundings include long drops, spikes, mazes, or other hazards difficult to navigate in darkness."
        ],
        modsEasier: [
          "While annoying, they do no real damage, and forewarned scoundrels may prepare unbreakable light sources or supernatural dark vision.",
          "There is enough ambient light to see."
        ]
      },
      {
        name:      "Dynastic Hive",
        category:  "Ghostly Guards",
        desc:      "Ancestors have been ritually infused into the defense site, it is a dynastic holding. The spirits are old, and insane, but strategically placed to act out their madness in the most damaging way.",
        questions: [
          "Did the family get special permission to harbor ghosts?",
          "Do they have connections to limmers?",
          "Are spirits tied to leviathan bone shards?",
          "Are they moving pictures, or conversationalists with clues?"
        ],
        modsHarder: [
          "The ghosts are legally protected, like landmarks or artwork. Damaging them is a serious crime.",
          "Some of the more powerful or canny ghosts are still somewhat sane collaborators with the site owners."
        ],
        modsEasier: [
          "They are out of control, and few dare to enter the site now (or it is abandoned.)",
          "They will not harm family members (but may not react well to hostages.)"
        ]
      },
      {
        name:      "Hunting Ghostpack",
        category:  "Ghostly Guards",
        desc:      "A group of weaponized ghosts haunts the defended area. They are capable of scouting to find intruders, descending on them with lethal force.",
        questions: [
          "Do they appear as a pack with a mounted hunter, spectral hounds, and a ghostly horn call?",
          "Or an armored warband?",
          "Shapeless lethal electroplasmic stalkers?",
          "Are the wounds they inflict bloody cuts, or hard frostbite?",
          "Is their area surrounded with runes that let them see into the material world?"
        ],
        modsHarder: [
          "The ghost leader feels all life force in its hunting ground, knowing its location.",
          "The hunt can only rise when certain conditions like anniversaries, moon phases, etc. are met. However, they have a treasure that can only be taken from them when they manifest."
        ],
        modsEasier: [
          "The attack is purely psychological, killing with supernatural fear. The effect can be resisted.",
          "They are summoned and directed by a command artifact like a hunting horn or special weapon. If someone else tunes to the weapon, control (and its obligations) may shift to a new bearer."
        ]
      },
      {
        name:      "Possession Gate",
        category:  "Ghostly Guards",
        desc:      "If an intruder breaks a clearly marked seal, the intruder is attacked by a possessing spirit that takes on the traits of the most strong-willed, brutal person the seal-breaker ever killed. The possessing spirit and the seal-breaker struggle for control. This counts as a harm.",
        questions: [
          "Is the possessing spirit a ghost, or a shape-shifting construct made by an expert that makes a shape out of something in the target?",
          "If an innocent triggers the trap, what form does the spirit take then?"
        ],
        modsHarder: [
          "The only way to be free is to die, undergo electroplasmic surgery while dead, and be revived. Otherwise the curse is protected by the victim's life force.",
          "The haunting spirit tries to take possession once a day or so, sending the host into a blackout and acting out vicious crimes against allies, loved ones, and bluecoats."
        ],
        modsEasier: [
          "The condition can be reduced with a resist roll, but still is likely a 6 segment clock to clear.",
          "The curse haunt would rather have a host ally than kill its victim, and may bargain for shared control."
        ]
      },
      {
        name:      "Spirit-Infused Art",
        category:  "Ghostly Guards",
        desc:      "Art works are haunted by spirits that are capable of spying. They observe their area, and may be able to murmur about what they see to a guardian.",
        questions: [
          "Was art repurposed to host spirits, or was it created for them and around them?",
          "Is the art mosaics, portraits, statues, or some other form?",
          "How sane and coherent are the spirits?",
          "How loyal are they?",
          "Do they have the power to attack intruders?"
        ],
        modsHarder: [
          "One or more guardians has a signet ring tuned to the haunted art pieces, and can hear what they whisper as they spy.",
          "The ghosts inhabiting the art can move from one piece to another, following intruders or retreating to report."
        ],
        modsEasier: [
          "One spirit per art piece, and each spirit has its own unbalanced personality.",
          "Unhinged art is violent, so it has to be shrouded or restrained when guardians go through the defended area."
        ]
      },
      {
        name:      "Starving Fog",
        category:  "Ghostly Guards",
        desc:      "The guarded area is in a clinging cold fog. Fog draws energy from those breathing in it until it manifests shadows that increase target fear, which feeds it more. Eventually it can manifest a killing shape.",
        questions: [
          "What do intruders in the fog see when it reflects their fears?",
          "Are there sound effects, smells, and sounds, or just fleeting glimpses and silhouettes?",
          "Does it project hallucinations or trigger memories?"
        ],
        modsHarder: [
          "The fog strengthens the Ghost Field, making ghosts within it more powerful.",
          "The fog can move, summoned or controlled by other guardians to provide backup or help search."
        ],
        modsEasier: [
          "The fog is generated by an artifact. If the artifact is neutralized so is the fog.",
          "Those with the proper energy keyed amulet or other trinket are invisible to the fog."
        ]
      },
      {
        name:      "Sweat Nectar",
        category:  "Ghostly Guards",
        desc:      "The defended area is kept hot. Sweat tastes like nectar to swarming ghosts, who dehydrate targets into mummies. The stolen life force and moisture flows to prepared corpses, so ghosts can ride them again.",
        questions: [
          "Were they created by dehydrating sacrifices to death in the defended space?",
          "Were they gathered from outside the lightning walls to stand guard here?",
          "Does a spirit trafficker maintain the wards on the space?"
        ],
        modsHarder: [
          "Many prepared corpses are stashed in unexpected places, bursting into combat when rejuvenated.",
          "Once they rise, the desiccated spirit-ridden corpses will chase intruders until they can't."
        ],
        modsEasier: [
          "Only a few corpses are left to revive.",
          "The site is difficult to keep hot enough to extract the necessary sweat from intruders."
        ]
      },
      {
        name:      "Dartus Weed",
        category:  "Supernatural Plants",
        desc:      "When something moves near a tangled bank of dartus weed, the vines flex, flicking barbed tips towards the source of motion within arm's reach. The darts are paralytic; a target will pass out for about an hour.",
        questions: [
          "Do they have a distinctive flower or smell?",
          "What is the aftertaste of the poison's effect?"
        ],
        modsHarder: [
          "Hounds with chemically toughened hides patrol the weed banks, brutally killing intruders.",
          "Weed banks are cultivated strategically, flanking important doorways or draped over arborwalks, straggling along verges."
        ],
        modsEasier: [
          "The weeds are young. Darts can be stopped with thick leather.",
          "Weed banks are out of the way of defended valuables, but too close to very annoyed neighbors who may hold a grudge."
        ]
      },
      {
        name:      "Dreamspore Shrooms",
        category:  "Supernatural Plants",
        desc:      "Placed on the ceiling, they drizzle sandy spores when they sense motion below. Victims hallucinate, heightening subconscious emotion (so they are very mellow, or super anxious, or filled with rage, etc.).",
        questions: [
          "Were these intended to be a site defense?",
          "Did they instead serve a religious or recreational function?",
          "Are there special techniques for harvesting them, perhaps selling them to alchemists?"
        ],
        modsHarder: [
          "A more intense strain, these can knock out those who succumb, and give them vivid dreams for several hours.",
          "They are placed near other guardians as well as hazards like a steep drop or running water."
        ],
        modsEasier: [
          "Other guardians come here recreationally, their effectiveness reduced.",
          "The spores are weak and easier to resist."
        ]
      },
      {
        name:      "Floormesh",
        category:  "Supernatural Plants",
        desc:      "Flat vines grow together to make flooring. Connected below is the bulb, covered in venomous spikes. Anyone heavier than a child will fall through. Blood and rot feed the floormesh.",
        questions: [
          "Have site defenders put carpet over the flat vines to further hide the threat?",
          "What colors, textures, and patterns does this version have?",
          "How dangerous is the venom?"
        ],
        modsHarder: [
          "The building's architecture assumes use of floormesh, the carpets are woven to look like floormesh so the guardians don't have to cover the actual pits.",
          "The mesh itself has venomous thorns in it, so stepping on it or falling through poisons the target."
        ],
        modsEasier: [
          "The pit is not cleaned, the area near it stinks heavily of corpserot. The mesh sags visibly.",
          "Floormesh is mostly hung like tapestries, living decorations, rather than forming pit traps."
        ]
      },
      {
        name:      "Ghost Crystal Topiary",
        category:  "Supernatural Plants",
        desc:      "Ghost crystals are worked into the roots of fancifully trimmed bushes. Ghosts may be able to inhabit the bushes and make them move. This gardening curiosity can be weaponized.",
        questions: [
          "Is this a currently maintained garden, or one that is overgrown and abandoned?",
          "Who provides the necessary skilled care to create or maintain the topiary?",
          "Is there a theme to the sculptures?"
        ],
        modsHarder: [
          "Certain of the most powerful bushes can uproot and move around like living green golems driven by electroplasmic energy.",
          "The bushes hardly move, but the powerful energies of the crystals make ghosts much more coherent and powerful in the garden."
        ],
        modsEasier: [
          "Left unprotected at one point, the garden was raided by thieves after the ghost crystals. Few crystals are left in the shaggy bushes.",
          "Incompetent handling has drained most of the power from the crystals."
        ]
      },
      {
        name:      "Keenshrooms",
        category:  "Supernatural Plants",
        desc:      "These fist-sized mushrooms let out a keening wail when light comes within about thirty feet.",
        questions: [
          "What do they look like?",
          "Is their smell distinctive?",
          "Are they good eating?"
        ],
        modsHarder: [
          "They are strategically placed to surprise intruders; inside doors, on ceilings, in alcoves, behind statues.",
          "Masses of keenshrooms have been allowed to coat walls or fill rooms, and their keen is strong enough to deafen or kill."
        ],
        modsEasier: [
          "The keenshrooms were placed too close to trafficked paths inside or outside the defended site. Constant false alarms dull vigilance.",
          "Too far from site defenders, their keens are seldom investigated."
        ]
      },
      {
        name:      "Murder Tree",
        category:  "Supernatural Plants",
        desc:      "The willow tree grew around bones wired to it, spirit crystals studded in its bark, and leviathan blood at its roots. lt is dimly self-aware. It senses and hates life, whipping and clubbing any who approach.",
        questions: [
          "How do guardians move around the tree?",
          "Suggestions include knowing passwords, having enchanted amulets, or attuning to its blind spots. How many guard the site?",
          "Who had the expertise to cultivate this living weapon, how long ago?"
        ],
        modsHarder: [
          "The chorus of semi-aware spirits that fuel the tree are enslaved by one domineering will. The tree is as coherent as a person.",
          "Multiple murder trees are connected by roots and share knowledge with each other (and any other site guardians.)"
        ],
        modsEasier: [
          "No one can communicate with the murder tree, or control it, so it is isolated from other defenses.",
          "The tree sleeps most of the time, and it is difficult to rouse it to fighting fury."
        ]
      },
      {
        name:      "Snatchweed",
        category:  "Supernatural Plants",
        desc:      "It grows in fresh water, lengthening its long winding tendrils almost to the surface. When touched, it snatches and pulls, coiling down to the bottom and holding for a few minutes before relaxing back up.",
        questions: [
          "Is their growth boosted supernaturally, and can you see faces reflecting from the Ghost Field beneath their fronds?",
          "Are the locals aware of the threat, willing to talk about it?"
        ],
        modsHarder: [
          "Snatchweed is cultivated in areas where intruders must enter the water to get past other obstacles.",
          "The bottom of the water has two foot spikes, victims are pulled down onto them."
        ],
        modsEasier: [
          "A sign warns of the hazard, as required by law.",
          "This particular breed of snatchweed recoils from salt; put enough on the surface and tendrils recoil."
        ]
      },
      {
        name:      "Thirstclimber",
        category:  "Supernatural Plants",
        desc:      "The vines are red, and when flesh touches them (even through leather) the vine draws blood to the surface in alarming quantities. The vines are slippery, and almost impossible to grasp with wet hands.",
        questions: [
          "Are the vines clearly visible to those who can see in the Ghost Field?",
          "Do the vines cause damage that must be healed, or does the blood only flow when they are nearby?"
        ],
        modsHarder: [
          "The site has guard creatures that track by scent and are drawn to attack things that smell bloody.",
          "Thirstclimber is cultivated at the mid-point of a really difficult climb."
        ],
        modsEasier: [
          "Annoyed locals keep it trimmed back on outside walls periodically in spite of the guardian's threats.",
          "Guards know the ingredients to make a special paste, and the symbol to paint on skin with it, to protect from the plant's effects. A former guard might share the secret."
        ]
      },
      {
        name:      "Thirsty Thorns",
        category:  "Supernatural Plants",
        desc:      "Strategically placed thornbushes grow on walls and serve as decorations. They live on blood. They only flower if something dies on them; the bigger the life, the more impressive the bloom.",
        questions: [
          "Do they feed on radiant light?",
          "Are they along the interior walls, lining the walks, and climbing walls outside?",
          "Are there thorns inside, along windows or protecting secret doors?"
        ],
        modsHarder: [
          "The thorns are poisonous, inflicting some condition on those who fail to resist.",
          "Possibilities include sleep, death by choking, blinding blood from the eyes, or paralysis.",
          "The thorns are considered a gardening achievement, with some fame and support as local culture."
        ],
        modsEasier: [
          "A custom amulet tuned to their life energy turns the thorns away, allowing its bearer to push through them unharmed. A site defender may have one, or one could be made.",
          "They are old and brittle, dying by inches and neglected."
        ]
      },
      {
        name:      "Vine Curtains",
        category:  "Supernatural Plants",
        desc:      "Curtains of vines connect back to a radiant root that has grown semi­aware, fed on rogue spirits. If touched, the vines slither and writhe to entangle, hoist, and bundle the target for a guardian to find.",
        questions: [
          "What do the vines look like?",
          "Do they use their scent to attract or repel?",
          "Where is the root relative to the curtain?"
        ],
        modsHarder: [
          "Many curtains and roots of different sizes (some quite big) connect back to a central bulb somewhere in the defense site.",
          "The vines also have a contact poison that makes their target go limp for 10-60 minutes."
        ],
        modsEasier: [
          "The site owner does not have legal permission to have the vine curtains, so they are only used inside.",
          "The vine curtains grow wild and the lazy site owner does not keep them trimmed back, so other guards must stay away from them."
        ]
      },
      {
        name:      "Caul Piercers",
        category:  "Traps",
        desc:      "Piercers are designed to puncture whoever touches them. They pierce the energy caul of the character's life force in the Ghost Field. This causes a harm condition that worsens or costs stress every down time cycle until the caul can be mended (6 segment project.) Interpret as needed.",
        questions: [
          "Do the piercers resemble knives, nails, or thorn-like carvings?",
          "What sadistic expert crafted these dire traps?",
          "If pried out of their settings, how long do they retain potency?"
        ],
        modsHarder: [
          "Those affected will trail life energy like a wounded fish bleeding in the water; demons and ghosts alike will investigate the scent.",
          "They are worked into important doorknobs, strategic ledges, and concealed flooring."
        ],
        modsEasier: [
          "They all look alike and are similarly placed, relying on surprise to be effective.",
          "They are only on the main treasure."
        ]
      },
      {
        name:      "Collapsing Ceilings",
        category:  "Traps",
        desc:      "If triggered, this trap drops a mass of stone. That seals off the threatened area, and crushes anyone tampering with its defenses.",
        questions: [
          "Who put valuables behind a trap that could seal them away for good?",
          "How old is this defense, and who takes care of it?",
          "What warning signs tip off an intruder that continuing is dangerous?"
        ],
        modsHarder: [
          "Hidden mechanisms can raise the block back up to the ceiling, so the trap can be reused (or defeated remotely.)",
          "More than one block falls; the first one cuts off escape, then death seems inevitable."
        ],
        modsEasier: [
          "The stone dropped long ago. Site guardians or intruders have developed ways to climb over it or get past it. Other blocks may still be untriggered, but some of them are no longer dangerous.",
          "More like a mine collapse, difficult to control and possible to tunnel past."
        ]
      },
      {
        name:      "Combination or Trick",
        category:  "Traps",
        desc:      "Various portals and defenses of the site are protected by combination locks or riddles to solve. Lockpicks will not work against them, though finesse may solve them eventually.",
        questions: [
          "Are there a series of combination locks expressing a religious or eccentric worldview?",
          "Are there picture arranging puzzles, or unusual  keys  to go in sculpture locks?",
          "Are the locks mechanical or supernatural?"
        ],
        modsHarder: [
          "Powerful runic work or enslaved ghosts make the obstacle difficult to smash or trick--the right combination or object must be used to bypass it.",
          "Clues and needed items are spread across a large estate, or multiple estates."
        ],
        modsEasier: [
          "The combination or solution to the puzzle is in a scholarly work, and can be found or bought ahead of time.",
          "The solutions are painfully obvious to someone with the right upbringing and background."
        ]
      },
      {
        name:      "Contact Needles",
        category:  "Traps",
        desc:      "Small needles are worked into contact surfaces and poisoned, to deter intruders. They may be on doorknobs, seat backs or cushions, doorframes, stair treads, ledges, beds—anywhere, really.",
        questions: [
          "Are the needles easily visible if you look for them, or camouflaged?",
          "Are they retractable if you know what you're doing?",
          "What kind of poison is on them?",
          "Will the victim sleep, freeze, die, or hallucinate?"
        ],
        modsHarder: [
          "The needles are only corporeal to those who touch them without wearing a certain amulet. Important site guardians are immune to the needles.",
          "Anything important or at an unguarded entry point is going to be festooned with needles."
        ],
        modsEasier: [
          "They are not well maintained. Many have snapped off, and few retain much poison.",
          "They are only on the most important objects or the most useful trap objects (like a chair for guests.)"
        ]
      },
      {
        name:      "Excellent Locks",
        category:  "Traps",
        desc:      "Beyond simple security, these locks are works of art. They are higher potency than they would normally be. Also, they are equipped with poison needle traps, or pick breakers, or redundancies.",
        questions: [
          "Who put in these superior locks, and for what reason?",
          "Are the locks designed to defeat entry, or actively punish intruders?",
          "Do the specialized keys have a distinctive look, like two flanges?",
          "Is there a master key?"
        ],
        modsHarder: [
          "Everything is locked, and all the locks are good. Somebody had a real lock problem.",
          "The locks involve supernatural components, like hidden keyholes or paralyzing energy."
        ],
        modsEasier: [
          "The locks are in poor repair, of variable quality after indifferent maintenance and many intrusion attempts.",
          "Very fancy locks, but they are padlocks, and bolt cutters can circumvent the problem."
        ]
      },
      {
        name:      "Murder Holes",
        category:  "Traps",
        desc:      "Intruders go past one door, into a hallway or small room, and the door closes behind them. Arrow slits open in the walls, and slots in the ceiling allow boiling oil to be poured down. Intruders are trapped and vulnerable. These are often in doors through defenses.",
        questions: [
          "Was the original site builder often under siege?",
          "Are the murder holes obvious or concealed?"
        ],
        modsHarder: [
          "Murder holes are automated with self- slamming doors and pre-boiling oil, so a few defenders can trap and/or kill many intruders.",
          "The whole layout is built with many murder hole areas to deter invasion."
        ],
        modsEasier: [
          "The walls are wooden, and determined captives can break through to face their attackers.",
          "This area does not have enough staff to monitor intruders and make best use of murder holes."
        ]
      },
      {
        name:      "Pit Traps",
        category:  "Traps",
        desc:      "The defended site has pit traps in strategic places. They are between 10 and 40 feet deep.",
        questions: [
          "Do they have slick sides?",
          "Are there spikes at the bottom?",
          "Are the covers mechanized, or flimsy boards and carpets, grass turf, or leaves over canvas?",
          "Are the sides stone, earth, or clay?"
        ],
        modsHarder: [
          "Fist sized tunnels connect pits. Predatory creatures (crabs, snakes, spiders, rats) scurry to devour victims.",
          "Once someone falls into the pit the covers close again, and will not open until unlocked."
        ],
        modsEasier: [
          "The pits drop into a lower area, mostly abandoned except for predators. It is possible to find a way out.",
          "The pits are mostly open and filled with junk."
        ]
      },
      {
        name:      "Retractable Spikes",
        category:  "Traps",
        desc:      "Spring-loaded spears or racks of spears launch at intruders. They can come from the side, behind, ahead, below, or above.",
        questions: [
          "Are the defenses standardized to protect guardians, or random to confuse intruders?",
          "Are they in an area that site defenders use, or in an isolated off-limits area?",
          "How long have they been in use, and how often are they maintained?"
        ],
        modsHarder: [
          "After doing their killing work, they retract, and the launch points are not obvious.",
          "The spears are slathered with some toxin, further affecting the victim."
        ],
        modsEasier: [
          "The mechanisms are not well maintained. Sometimes they don't work, and when they do, there is a screech and they are a bit slow.",
          "The spears are designed to pin an intruder in place, to be interrogated and punished, rather than to kill outright."
        ]
      },
      {
        name:      "Secret Doors & Spyholes",
        category:  "Traps",
        desc:      "Guardians are well trained in the use of numerous secret doors and hidden passages with spyholes. They can attack from unexpected directions, escape without a trace, and watch intruders unobserved.",
        questions: [
          "Was this site built by a spy, or a cult, or a paranoid aristocrat?",
          "Are there consistent tells, a code built into the decor and architecture, or must all secrets be known individually?"
        ],
        modsHarder: [
          "Ongoing rearrangement and construction means old information from plans or people ages out fast.",
          "Supernatural locks and keys mean that triggers and spyholes and seams may not be visible in the material world at all."
        ],
        modsEasier: [
          "Frequent use has made secret doors easier to spot. Poor baffling of lights may reveal spyholes in use.",
          "Current residents are only aware of some secrets; intruders may use back ways to elude security."
        ]
      },
      {
        name:      "Shock Grips",
        category:  "Traps",
        desc:      "One or more contact points are connected to energy so they will badly shock anyone who touches them. These could be doorknobs, chest lids, floor plates, ladders, and so on.",
        questions: [
          "Are they powered by batteries or enslaved ghosts?",
          "Does the site have legal permission to use them?",
          "How loud is the shock?",
          "How do site guardians avoid getting shocked?"
        ],
        modsHarder: [
          "The shock grips are numerous and concealed, connected to their energy source through the Ghost Field.",
          "The shock is designed to stop the heart and kill the victim (possibly setting hair on fire.)"
        ],
        modsEasier: [
          "The shock grips are connected to control boxes and energy sources by cables.",
          "Shock grips are marked by a rune, and shiny, and also give out a palpable hum of energy. They are easy to detect."
        ]
      },
      {
        name:      "Brutal Sadists",
        category:  "Twisted Guards",
        desc:      "Only brutal sadists are hired on as guards. They have permission to play with captured intruders.",
        questions: [
          "Is the owner of the protected property aware of this cultural rule, or are guards hired by an employee?",
          "Do they share cultural roots (slaughterhouse workers, leviathan hunters, soldiers, city guards, etc)?",
          "How do the neighbors feel about their occasional scandals?"
        ],
        modsHarder: [
          "Several of them are skilled in both torture and interrogation; they extract secrets from intruders. A side business in blackmail helps them avoid legal trouble.",
          "They are hardened veterans, exceptionally tough and dangerous. They aim to incapacitate."
        ],
        modsEasier: [
          "Their ugly tactics and poorly chosen victims have earned them (and their employer) enemies in lots of unexpected places.",
          "They really, really like to drink."
        ]
      },
      {
        name:      "Close-Knit Guard Network",
        category:  "Twisted Guards",
        desc:      "Guards are only hired by referral. Failure results in punishment for both the guard and the sponsor. Their loyalty is tested many ways before and after they are hired.",
        questions: [
          "Do they favor bastards of the employer?",
          "Are they connected to one military unit?",
          "Are they refugees from another place?",
          "Do they come from a single neighborhood?",
          "Does punishment extend to their families?"
        ],
        modsHarder: [
          "They are connected to a larger sponsoring organization that would seek vengeance if they are attacked or insulted, and also offer them favors.",
          "They speak in code and have passwords that include safewords and warnings."
        ],
        modsEasier: [
          "Nepotism has pulled in some really incompetent guards.",
          "Endless drama from working with family and friends."
        ]
      },
      {
        name:      "Compulsive Detail Focus",
        category:  "Twisted Guards",
        desc:      "Only a certain type is hired; a type that checks every lock and every dark corner. Schedules are strict, thoroughness is a guarantee, and they seem unable to cut corners or skip steps. Everything is by the book.",
        questions: [
          "Are they altered to be like this, or just screened for a mindset?",
          "What are the detailed parts of the defended site that need this kind of attention?",
          "How does their gear reflect this fussy attention to detail?"
        ],
        modsHarder: [
          "There are other elements of the defended site that require their focus, like a pattern of stepping over tiles to avoid triggering traps or complex combination locks or dozens of cells with dangerous prisoners.",
          "They are trusted with specialty items like firearms or charms because they are responsible with them."
        ],
        modsEasier: [
          "Everyone knows that they fall apart if things deviate from the pattern, like distractions or chaos.",
          "The locals pick on them when they are off duty, teasing them for their compulsions. They have enemies, and could use friends."
        ]
      },
      {
        name:      "Convict Public Service",
        category:  "Twisted Guards",
        desc:      "Due to prison overcrowding, some criminals are sentenced to indentured service to a noble to work off their debt to society. This site's guardian uses criminals as guards, under the stern eye of professionals.",
        questions: [
          "Are casualties high due to danger from intruders or other site defenses?",
          "Is the patron benevolent and trying to rehabilitate criminals, or using them as disposable fodder?",
          "How do the convicts like this place?"
        ],
        modsHarder: [
          "Serving here is a known post among criminals, both a resume builder and networking site.",
          "Angering these guards could bring consequences from unexpected directions in the criminal underworld.",
          "Hand picked as the hardest and deadliest, these criminal guards are canny and tough."
        ],
        modsEasier: [
          "Convicts are eager to assist anyone with enough Coin or pull to secure their pardon and freedom.",
          "The convicts are bullied and sullen, as much a hindrance to defenders as a defense themselves."
        ]
      },
      {
        name:      "Demonic Mutations",
        category:  "Twisted Guards",
        desc:      "About a quarter of the guards have been mutated by contact with demonic essence. They are strong, and their senses are sharp.",
        questions: [
          "Do they share one demon patron?",
          "Did they become guards to gain this power?",
          "Are they worshippers or mercenaries?",
          "Did they volunteer or are they victims?",
          "What element is their demonic affinity?"
        ],
        modsHarder: [
          "They share a supernatural connection and can sense when other demonic guards are in trouble.",
          "They are highly resistant to normal damage. They may be vulnerable to supernatural attacks or a specific allergy (silver, garlic, salt, etc.) Or, they may be resistant to supernatural attacks instead."
        ],
        modsEasier: [
          "They become physically impressive, but their minds are lost to incoherent lusts and fury.",
          "The rest of the staff resent or fear the demonic guards. Loyalty and morale are low among mundane employees."
        ]
      },
      {
        name:      "Enchanted Prosthetics",
        category:  "Twisted Guards",
        desc:      "Guards are all amputees with at least one prosthetic. Each prosthetic tunes to its owner. The prosthetics can stun on contact.",
        questions: [
          "Are the false limbs the work of one genius?",
          "Are they part of a collection?",
          "Were they made for this use?",
          "Is a ghost bound to each?",
          "Are they scientific, with batteries?",
          "Are they powered by the bearer's life force?"
        ],
        modsHarder: [
          "All guards have some adept training and spirit bane charms, alert against supernatural forces.",
          "Veteran guards have learned to tune to their prosthetics to get an additional effect, like life detection or firing energy blasts."
        ],
        modsEasier: [
          "Only one use between recharges.",
          "The guards are mostly old or broken, relying on reputation and supernatural energy to be effective."
        ]
      },
      {
        name:      "Feral Pen",
        category:  "Twisted Guards",
        desc:      "Some areas of the defended site have free-range maniacs. Destitute and wretched beggars are treated as guard dogs, expected to attack intruders and draw attention to anything unusual.",
        questions: [
          "Does the guarded site pretend to be charitable, or a madhouse, or a prison?",
          "What philosophy leads to treating people this way?",
          "How do the city authorities feel about the site?",
          "Religious authorities?",
          "Does the site feed into the Ghost Field in an unusual way?"
        ],
        modsHarder: [
          "Most of the feral guards are killers, possibly haunted, and extremely dangerous.",
          "This pet project is as much art and religion as defense, and has support from a variety of decadent aristocrats in positions of power."
        ],
        modsEasier: [
          "The rest of the site guards hate the feral pen and ignore it as best they can.",
          "It is as much prison hospice as guard dog kennel. Its victims are weak, sick, and starving."
        ]
      },
      {
        name:      "Fighting School",
        category:  "Twisted Guards",
        desc:      "An onsite training school focuses on the lifestyle and skill of a school of fighting. Site defenders are part of a group identity with specialty training.",
        questions: [
          "Is the school's focus on dueling, a martial art, commando training, or something else?",
          "What is their crest, uniform, motto, and lore?",
          "What sort of training space do they have?"
        ],
        modsHarder: [
          "The school itself is an impressive fortress or defense.",
          "The school has an impressive alumni network that visits occasionally and would avenge wrongs to the honor of the school."
        ],
        modsEasier: [
          "This is an off-site shrine or expansion, where they send troublemakers and those they can't eject for political or financial reasons.",
          "Leadership is riddled with rivalries and power struggles. Outsiders know some details."
        ]
      },
      {
        name:      "Performance Enhancers",
        category:  "Twisted Guards",
        desc:      "Guards have ready access to drugs. Some of the drugs enhance performance.",
        questions: [
          "Do the drugs give them a burst of combat effectiveness?",
          "Are the drugs recreational, making them popular with a customer base that pays well and owes favors?",
          "Who provides them with drugs?"
        ],
        modsHarder: [
          "As dealers, the guards are difficult to bribe or intimidate, as they have money and prestige.",
          "Guards can medicate flexibly, with concoctions to enhance perception (even to see the supernatural,) gain combat prowess, or heal."
        ],
        modsEasier: [
          "Their peddling of illegal drugs has made enemies among bluecoats and inspectors.",
          "The guards are junkies. Their employer uses addiction to control them, keeping them near the edge. They are often distractible or unconscious."
        ]
      },
      {
        name:      "Zealots",
        category:  "Twisted Guards",
        desc:      "Guards share a religion that binds them together and makes them resistant to intimidation or corruption.",
        questions: [
          "Do they worship one of the Forgotten Gods? The Church of the Ecstasy of the Flesh? Weeping Lady?",
          "Have they sworn oaths?",
          "What does religion require them to hate, or to love?"
        ],
        modsHarder: [
          "The defended site includes a shrine or temple. Violating the site angers offended worshippers.",
          "Serving as a site guardian is part of a religious duty. Unexpectedly seasoned warriors or important people may serve as lowly guards for a time."
        ],
        modsEasier: [
          "Mandatory prayer times, unclean objects or places left uninspected, and restricted areas may create holes in security.",
          "Enemies of their religion may offer help to embarrass, discredit, or injure the zealots."
        ]
      },
      {
        name:      "Ghostport Lock",
        category:  "Weird Tech",
        desc:      "Keys are tuned to locks that cannot be picked by normal means, or bypassed without whisper expertise. Their access point is in the Ghost Field until the key is present.",
        questions: [
          "Are these locks modem scientific triumphs, or old arcane defenses?",
          "Does he key look like a key, or does it look like a missing decoration, or a gem?",
          "Is the key physical, or energy, like living blood of the right family?"
        ],
        modsHarder: [
          "The locks are hidden and trapped. Messing with the lock could hollow the intruder (tearing the spirit out of the body) or other unpleasantness.",
          "The precise location of the lock must be known, and it is not near what it is locking."
        ],
        modsEasier: [
          "The ghostport lock has been a fad several times in Duskwall. Each time, there was some mass production, and a key to a similar lock might work with a little help.",
          "The owner may have stiffed a whisper locksmith on the fee, or otherwise offended the expert, who is knowledgeable and disgruntled."
        ]
      },
      {
        name:      "Lightning Walls",
        category:  "Weird Tech",
        desc:      "Runic energy twisting technology can make pylons that project a curtain of energy between them. The glowing walls are transparent, but crippling to touch and lethal to pass through. They stop projectiles.",
        questions: [
          "Does the site have the technology legally, or is it stolen?",
          "Maybe cobbled together from leftovers by a mad alchemist?",
          "Is it on all the time (expensive to fuel) or only if the alarm is raised?",
          "Where are the fuel cells kept?"
        ],
        modsHarder: [
          "The equipment is properly installed, its vulnerable parts behind the energy curtain, directly guarding what needs protecting.",
          "The lightning walls attract loose spirits, intruders may also have to contend with confused ghosts."
        ],
        modsEasier: [
          "The walls guard a few key access points, but there are multiple ways around.",
          "The walls are installed poorly, so their machinery is vulnerable from the outside while it is on. If no other guards are present, they can be wrecked."
        ]
      },
      {
        name:      "Panopticon",
        category:  "Weird Tech",
        desc:      "Special crystal lenses transmit their sight through the Ghost Field to mirrors in a central location. From one place, a guardian can monitor views all over the defended site.",
        questions: [
          "Is this new industrial alchemical technology, or an ancient enchanted construction?",
          "Does the current owner know how to get the most functionality out of it?",
          "Who maintains the system?"
        ],
        modsHarder: [
          "The lenses are hidden in mirror frames, statues, and other decor. They are difficult to spot.",
          "The lenses can see into the Ghost Field as well, observing ghosts or occult work, and life force."
        ],
        modsEasier: [
          "The guardians watching the mirrors are somewhat lax.",
          "Over time, many lenses have not been replaced or repaired. Views are limited."
        ]
      },
      {
        name:      "Shadow Lanterns",
        category:  "Weird Tech",
        desc:      "Guards are equipped with lanterns that detect shadows of recent life force as well as shedding light.",
        questions: [
          "Are the lanterns traditional lantern shape, or a glowing ball, or something else?",
          "Does an expert keep the guardians supplied, or is their supply jealously guarded?",
          "Does it cost the guards something to activate the lanterns?",
          "Will the lanterns work if taken off-site?"
        ],
        modsHarder: [
          "Guards are trained to tune into the life force energy to also hear conversations of the life shadows. Guards can tune into the life force energy to know the owner's current location, if in the defended area.",
          "Untended lanterns can be set to transmit detection of a life force to a nearby guardian."
        ],
        modsEasier: [
          "The lanterns can be rendered blind by properly tuning a spiritbane charm while near one.",
          "Every sunrise wipes all traces of past life forces, and they only work at night."
        ]
      },
      {
        name:      "Shadow Rooms",
        category:  "Weird Tech",
        desc:      "The Ghost Field sometimes remembers rooms or entire neighborhoods that no longer exist in the material world. Some defended sites hide treasures in these spaces that can only be accessed if you knowhow.",
        questions: [
          "How are colors different in these shadow rooms?",
          "Is there a smell or sound that lingers?",
          "How does it feel to step out of the material world?",
          "What natural laws work differently here, like fire not flickering?"
        ],
        modsHarder: [
          "The access point to the shadow rooms is an enchanted lock, its location is known and guarded.",
          "The shadow rooms are only connected to the material world a few times a year, or less."
        ],
        modsEasier: [
          "Transitioning from the material world to the shadow rooms involves certain proscribed movements; cross the courtyard three times, then back down stairs with eyes closed (for example.) Too many people know the formula.",
          "The current site owners do not know these rooms exist."
        ]
      }
    ],
    NPCs: [
      {
        name:        "Arturo Montastic",
        type:        "npc",
        concept:     "Addicted Gambler",
        arena:       "New Money",
        description: "He is impossibly lucky. He wins enough at games of chance to pay for his addictions, and to treat the consequences (transfusions, transplants, cutting-edge treatments.) His relationships are intense but brief. He often loses everything, but then wins it all back and more. He has owned epic treasures many times.",
        notes:       "Risk-averse collectors cannot bear his cavalier attitude on winning and losing priceless art. He does not truly appreciate his treasures, and should not be trusted with them. Losers can take their losses hard."
      },
      {
        name:        "Baron Kelyr Strathmill",
        type:        "npc",
        concept:     "Hardened Industrialist",
        arena:       "Old Money",
        description: "His family has controlled the docks for many generations. They quietly destroy competition, and get lucrative city contracts to re-develop blighted areas if the money slows down. Graceful, educated, and pleasant, he is ruthless as barbed steel under a cultured veneer. He is proud of his estate's gardens.",
        notes:       "Competition doesn't like being crippled. He often hires outsiders for the dirtiest work, and his victims often hire outsiders to get revenge."
      },
      {
        name:        "Baroness Thena Hellyers",
        type:        "npc",
        concept:     "Hazy Art Patron",
        arena:       "Old Money",
        description: "Thena is one of the least emotionally scarred survivors in her weird family. She is a leading light in the art world. She is patron to many artists and her criticism and evaluation drives a significant element of Duskwall's art scene. Whispers have noted she has an unusual connection to the Ghost Field.",
        notes:       "Sometimes she hires outsiders to sort out one of her artists' problems. She has a private gallery that she updates with her current trending tastes—those in the art market need to know what's in it."
      },
      {
        name:        "Calvin Dannos",
        type:        "npc",
        concept:     "Eerie Assassin",
        arena:       "Underworld",
        description: "The Inkvein was a cabal of seven anonymous assassins, named for their maps of the canals. If one of them was identified as a member, the other six were sworn to kill the outed assassin. Dannos was outed a decade ago, and he killed the other members and their undying founder. Now he IS Inkvein.",
        notes:       "Easily bored, he prefers interesting challenges to high paying or easy kills. Of course, many bereaved or power hungry individuals want him dead."
      },
      {
        name:        "Commissioner Naria Haig",
        type:        "npc",
        concept:     "Political Matchmaker",
        arena:       "City Law",
        description: "She exudes a plump grandmotherly innocence, but she is one of the sharpest politicians in Duskwall. She supervises over the merging of unexpected allies and the schism of monolithic interests. She cares about one thing—the good of Duskwall as a whole. She is Chair of the Ethics Oversight Committee.",
        notes:       "Always playing a bigger game, she uses outsiders to manage errands whose purpose they cannot see. Those she outmaneuvers tend to want to get back at her with violence."
      },
      {
        name:        "Doc Sarnin",
        type:        "npc",
        concept:     "Lecherous Leech",
        arena:       "Underworld",
        description: "Doc can keep life in you if you're alive (or recently dead) when you get to him. His extreme methods are often horrifying. Still, his concoctions can crush ghosts, re-attach limbs, and more. The Crows, a tough crew, protect him. They give him victims for his \"needs,\" which are emotional, physical, and scientific.",
        notes:       "Sometimes the Crows hire outsiders to go after rare components or victims for Doc. He has many, many enemies who want to either steal him and force him to serve them, or punish him."
      },
      {
        name:        "Doctor Ixit Crichelle",
        type:        "npc",
        concept:     "Elegant Spook",
        arena:       "Old Money",
        description: "Crechelle calls himself an Oneiric Master. He interprets dreams for a fee. He enters them, alters them, and moves through veils to understand truths and secrets the dreamer may not grasp. If he touches a target, or one of their possessions, he may enter their dreams. He appears feeble, but his mind is deadly.",
        notes:       "Aristocratic patrons invite him to parties. He needs a person's possession to see into their dreams; he pays for objects to visit some people's dreams. Victims will pay to free themselves ."
      },
      {
        name:        "Dr. Hansel Kryvanntic",
        type:        "npc",
        concept:     "Brilliant Scientist",
        arena:       "Foreign",
        description: "He is Severosi, bow-legged and wild-haired. His work on electroplasmic poisoning and mutation in animals and humans is ground-breaking. Fleeing persecution because of his ethically questionable methods back in Severos, he found a more open-minded scientific community in Duskwall.",
        notes:       "His research has applications in art, medicine, and war. Those with sufficient resources to further his studies want to control him. He has hurt a lot of people, over time, so he has many enemies."
      },
      {
        name:        "Dr. Yerial Crabbskidditch",
        type:        "npc",
        concept:     "Sleazy Lawyer",
        arena:       "New Money",
        description: "He firmly believes those who are wealthy should not be pestered with the law. No matter what you do, if you have means you can arrange for an alternate story that favors you. Deaths, frauds, robberies, and other crimes can be reduced to a few fines. He throws money at problems until they disappear.",
        notes:       "He routinely hires outsiders to destroy evidence, intimidate witnesses, compel confessions, and so forth. He has countless enemies, both those seeking justice and former clients who ran out of money."
      },
      {
        name:        "Duvrel the Snake",
        type:        "npc",
        concept:     "Cunning Smuggler",
        arena:       "Foreign",
        description: "She is Tycherosian, with the eyes and horns of a goat. Snake tattoos coil around her arms. Exotic drugs from the Dagger Isles flow through her distribution network in Duskwall. She hires outsiders to remove stubborn people while she has an alibi, or to retrieve drugs misplaced at incriminating locations.",
        notes:       "Inspectors have orders from the Spirit Wardens to take her alive, to study her uncanny ability to flex with the Ghost Field for supernatural stealth."
      },
      {
        name:        "Dylayzia Finchester",
        type:        "npc",
        concept:     "Fashionable Whisper",
        arena:       "New Money",
        description: "Her exotic looks, tattoos, and bright green eyes draw attention. She popularized thigh-high buckled leather boots and spirit bane chokers. Her opinions echo in drawing rooms across the city. People enjoy her feud with the Church of the Ecstasy of the Flesh.",
        notes:       "Wealthy figures in the fashion world pay top win for sneak peeks at her clothing designs. Her opinions inflame many enemies­-especially the Church. She hires outsiders to get rare components for her rituals."
      },
      {
        name:        "Emeline Coleburn",
        type:        "npc",
        concept:     "Weary Regulator",
        arena:       "City Law",
        description: "She inspects buildings and reports to the Duskwall Council whether they are sound, and whether they serve the purpose listed on the owner's taxation form. She is front-line in the tug-of-war between criminals, politicians, and nobles. She no longer cares about the greater good. Now it's about kickbacks.",
        notes:       "She takes the path of least resistance in her evaluations, so people pay to make their preference easier and other roads harder. She hires outsiders for off-the-books communication with pushy customers."
      },
      {
        name:        "Eric the White",
        type:        "npc",
        concept:     "Vigilante Rebel",
        arena:       "Foreign",
        description: "The War of Skovlan Unity is over, but this slender maniac with a brushy beard can't let it go. He plans to destroy the government and turn Duskwall into a Skovlan colony to punish them for the destructive war. He wants to discredit and disrupt the government at every turn.",
        notes:       "He targets gavernment officials as high up as he can reach, hoping to cause enough trouble to make the government vulnerable to change. He has gathered zealots, and he uses outsiders for disposable work."
      },
      {
        name:        "Gi Aniru Ga of Sultha",
        type:        "npc",
        concept:     "Sacrificing Cultist",
        arena:       "Supernatural",
        description: "She worships the Gaping Maw, the Runnel of Life, the Cosmic Thirst. She builds a cult, teaching them to hunt and conduct rituals. Then she moves on. Witnesses uneasily describe her supernatural abilities, including shapeshifting, flight, killing people by attacking their shadows, and so on.",
        notes:       "Bereaved relatives, rival cultists, and law enforcers all want her stopped. She hires outsiders to threaten, misdirect, or kill law enforcement. Determined inspectors crush cults she trained, need help to catch her."
      },
      {
        name:        "Holtz Clermont",
        type:        "npc",
        concept:     "Reformed Clerk",
        arena:       "City Law",
        description: "He used to be a forger. After he served stint in prison, some respectable family friends got him a position as City Clerk for the whole district. He manages correspondence for permit requests and official notices. When corrupt people inside and outside the system need to adjust evidence, they come to him.",
        notes:       "Jilted clients can be threatening, leading him to take steps to adjust their attitude by hiring outside help. He's smarter than he looks, and knows how to back people off. He also might know too much."
      },
      {
        name:        "Inspector Lorette Salkha",
        type:        "npc",
        concept:     "Crusading Inspector",
        arena:       "City Law",
        description: "She needs allies in her hopeless quest to clean up the city. Corruption is everywhere, crime runs rampant, and the bluecoats serve the powerful (on both sides of the law.) Some tragedy in her past propels her into a suicidal effort to restore \"rule of law.” Her peers muse it is a shame she will die young.",
        notes:       "She could be helpful if she focuses on the right bad guys—your enemies. She can't be bought, so maybe someone needs her killed (or otherwise neutralized.)"
      },
      {
        name:        "Jemma Dropkick",
        type:        "npc",
        concept:     "Feminist Vigilante",
        arena:       "Underworld",
        description: "She is a legend in the Seven Shallows neighborhood. She attacks men who abuse women. She survives because she has friends—a few bluecoats, a gang of thugs, and a grateful public. She carefully plans attacks to hurt abusers. Lf her victims abuse again, they are mutilated, packed like luggage, and shipped out of town.",
        notes:       "Many powerful men would pay for revenge on Jemma. Sometimes she hires outsiders to help out."
      },
      {
        name:        "Kheldaria Whinnich",
        type:        "npc",
        concept:     "Implacable Developer",
        arena:       "New Money",
        description: "She has a vision for developing the Crow's Foot district. It will be divided between businesses, estates, and parks. To realize her vision, she has been selectively buying real estate all around the city, bartering for land in Crow's Foot, and using whatever persuasion is needed to convince owners to sell to her.",
        notes:       "She has an estate where she stores induce­ments of all sorts, a variety of treasure designed to persuade owners to sell in exchange for what they want most. They say you could find almost anything there."
      },
      {
        name:        "Lady Ashlyn Tyrconnel",
        type:        "npc",
        concept:     "Decadent Duelist",
        description: "For centuries, aristocrats of Duskwall have learned the Tyrconnel Method of swordplay and self defense. The Tyrconnel family produces countless public servants and warriors—but also a share of scoundrels. Ashlyn's trademark suite of moves is to duel, win, bed someone, and drink to unconsciousness.",
        notes:       "You're hired to join the spy game in the Tyrconnel family. Or, someone is targeting her. Either way. Watch your back. Outsiders in the games of nobles are uniformly expendable."
      },
      {
        name:        "Lady Candra Dunvil",
        type:        "npc",
        concept:     "Corrupt Fixer",
        arena:       "Old Money",
        description: "Her family built Ironhook Prison. Her wealth is built on generations of shady deals with incarcerated aristocrats and business owners. She sees the world as a rigged game and has contempt for anyone who finds corruption shocking or fixable. She is vain, practical, and ruthless.",
        notes:       "She hires outsiders to carry out promises she made to inmates. Her family has casually wrecked reputations and lives over centuries, and that leaves a trail of vengeance seekers."
      },
      {
        name:        "Lady Polonia Brogan",
        type:        "npc",
        concept:     "Desirable Dowry",
        arena:       "Old Money",
        description: "She's ugly, smelly, stupid, and rude--and also the key to the Brogan fortune. Her lucky spouse will have access to massive wealth and infrastructure among professional builders and shipwrights of Duskwall. Only her aunt, CECILIA DURWITHE, looks out for her best interests with sharp disapproval.",
        notes:       "Brogan hires outsiders to punish those who slight her, or to investigate potential partners. She collects fake wills rogues have planted during assassination attempts, trying to leave her fortune to usurpers ."
      },
      {
        name:        "Lord Branon Kinclaith",
        type:        "npc",
        concept:     "Romantic Horseman",
        arena:       "Old Money",
        description: "Branon looks like a hero from a legendary story. He manages the family's stables, the finest horses in Duskwall (where horses are a rare luxury.) His tumultuous trysts with both men and women are common knowledge. Business suffers from his impulsive romantic gestures, but benefits from his charm.",
        notes:       "Branon sometimes refuses to sell horses, or breed them, if he dislikes the buyer. Some buyers want access to horseflesh anyway. If his horses are attacked, he hires outsiders to get revenge."
      },
      {
        name:        "Lord Bulward Skinnester",
        type:        "npc",
        concept:     "Greedy Banker",
        arena:       "New Money",
        description: "This portly curmudgeon does a brisk trade in real estate titles, both lending and foreclosing. He is acutely aware of the value of properties and how neighbors affect value. He takes particular glee in foreclosing on aristocracy and setting up the newly rich in ancient estates.",
        notes:       "Sometimes he hires outsiders to solve problems that his hired bluecoats and bribed councilmen cannot manage. He collects sculpture by Duskwall artists. He has ruined the lives of many formerly influential people."
      },
      {
        name:        "Lord Orlan Booker",
        type:        "npc",
        concept:     "Insulated Mastermind",
        arena:       "Old Money",
        description: "Ennui is a danger to the wealthy. Booker fills his days by gathering intelligence and planning heists, then selling the plans to ambitious gangs that lack his patience, experience, resources, and insight. Twice a month he goes to the opera, and meets those who have arranged to purchase a score.",
        notes:       "Sometimes things go wrong, and it is natural to blame the planner and want revenge. Sometimes a target wants to punish those who acted against them, even if the act was planning."
      },
      {
        name:        "Master Slen Dallicore",
        type:        "npc",
        concept:     "Protective Guilder",
        arena:       "New Money",
        description: "Master Dallicore is the Guildmaster for the Docker's Guild. They move all cargo on and off ships, boats, and gondolas. Their role is protected by law, as are the fees they charge. The guild uses low-level violence to discourage non-guild laborers and smugglers. However, some challenges require proper scoundrels.",
        notes:       "Dallicore is not above hiring outsiders to punish powerful patrons of smugglers or illegal dock workers. His position of power also gives him access to rare antiquities, both purchased and acquired."
      },
      {
        name:        "Minister Fourteen",
        type:        "npc",
        concept:     "Grungy Fixer",
        arena:       "Underworld",
        description: "The blind Skovlander holds court on the docks, moving from one basement to another. He favors baggy shirts, stained vests, shiny jewelry, and fraying lace. He often acts through his massive bodyguard Severen and his weedy messenger Torok.",
        notes:       "He is connected in the Skovlander refugee community, and in Skovlan. For a price (either wealth or an errand) he will share information about Skovlanders. He often hires outsiders to handle sensitive tasks."
      },
      {
        name:        "Moonslider the Third",
        type:        "npc",
        concept:     "Eccentric Artist",
        arena:       "New Money",
        description: "She feels moon phases. Her family put her in an asylum for a decade. Later, she won her freedom and inherited the family bootmaking fortune. She makes art. She tries to communicate her moon feelings. She uses oil paint, glass blowing, sculpture, song, and dance in multimedia recitals and art pieces.",
        notes:       "Her family bought nice things before they all died and she inherited them; she ignores most of it. She needs expensive equipment and supplies for her bizarre art shows."
      },
      {
        name:        "Officer Milos Penderyn",
        type:        "npc",
        concept:     "Corrupt Bailiff",
        arena:       "City Law",
        description: "Milos has access to trial evidence, and to prisoners awaiting trial. He can't get people out, but he can silence them. He has a network of corrupt peers, judges, bluecoats, and others so he can trade favors to accomplish the impossible. Huge and greasy, he is built like a bull and he enjoys the scent of fear.",
        notes:       "Controlling Milos could mean protecting or killing someone in bluecoat custody. An endless stream of people want revenge on him, and a more select group would like to control or use him."
      },
      {
        name:        "Officer Veleris Walund",
        type:        "npc",
        concept:     "Heroic Bluecoat",
        description: "There are actually songs about him. He is very popular. Veleris is a skilled orator (though he retreats into modesty) and a canny judge of character and situations. (He insists he just tries to do the right thing.) His opinion is influential in his district. He is trusted to guard valuables. His moustaches are his pride and joy.",
        notes:       "He has no family, and he seems to be an idealist. Some try to persuade him, others try to threaten him. Threats don't seem to work. He has been known to quietly hire outsiders to get justice."
      },
      {
        name:        "Pebbler",
        type:        "npc",
        concept:     "Demon Spy",
        arena:       "Supernatural",
        description: "This earth demon looks like a fat man built around a boulder gut, leaking sand from joints. It is able to see and hear through sand, earth, and stone within a range of miles. It works with non-cultists voluntarily, selling information in exchange for raids into the rare areas protected from its prying.",
        notes:       "Dozens of powerful people want Pebbler banished or robbed. However, the demon is a peerless information exchange, valuable even if it is difficult to control."
      },
      {
        name:        "Saithernon",
        type:        "npc",
        concept:     "Exotic Fence",
        arena:       "Underworld",
        description: "He drapes his python, DELGRAAZ, around his neck. He wears a turban with a jewel on it. He is willing to buy almost anything, no matter how strange. He also knows what you need, sometimes before you know you need it. His bazaar unfurls below the Kennington market in an abandoned gondola dock.",
        notes:       "He pays people to get things for him, then sells them at tremendously inflated prices to those desperate to have them. This can cause hurt feelings among the desperate."
      },
      {
        name:        "Serlevica the Brander",
        type:        "npc",
        concept:     "Spy Whisper",
        arena:       "Underworld",
        description: "Gaunt and frizzed, this foul-smelling Whisper has a secret ritual that allows her to control and see through rats she brands. She sells her services as a spy or site guardian. She has survived by retreating into slums and sewers when threatened, and striking from the shadows until it is safe to emerge again.",
        notes:       "She is closely tied to the information marketplace, buying and selling secrets. She often hires outsiders to deal with her enemies through theft or violence, and she is in turn a frequent target."
      },
      {
        name:        "Sir Mournseller",
        type:        "npc",
        concept:     "Anarchist Ghost",
        arena:       "Supernatural",
        description: "This ghost possesses old men from the Draymach Asylum, breaking them out to find and hire scoundrels for obscure tasks with no independent purpose. Examples include killing an insignificant chandler or stealing a specific stone from a wall in a noble's estate. Payment is the location of hidden treasure.",
        notes:       "A decade ago, an astute inspector began picking out the connection between errands, seeing a very long and very dangerous game to unseat the city's rulers emerging."
      },
      {
        name:        "Sir Olen Llanwold",
        type:        "npc",
        concept:     "Piratical Industrialist",
        arena:       "New Money",
        description: "He is thin and nervous, easy to underestimate. He specializes in stripping foes of their assets and taking over their operations. His father was a butler, and he grew up hating aristocrats. He understands power structures and corrupts retainers. His top agent, Ellsfielder, is a beautiful and ruthless woman.",
        notes:       "Many ruined aristocrats (and their allies) hate Danwold passionately. He does not hesitate to use his assets, legal and otherwise, to defend himself and cripple his foes. He hires outsiders through proxies."
      },
      {
        name:        "Sir Tocker Farros",
        type:        "npc",
        concept:     "Pragmatic Councilman",
        arena:       "City Law",
        description: "Sometimes the law works, and sometimes it doesn't. Regardless, the Council must rule and there must be order. Sir Farros ensures the districts he serves do not get too far out of hand before lawless elements are curbed. One way or another. He looks like an affable grandfather, but he has a dark past.",
        notes:       "Sir Farros uses inspectors or scoundrels, politicians or housemaids—anyone who will get the job done. He has an endless list of enemies who feel he wronged them, and want revenge. His agents are disposable."
      },
      {
        name:        "SLOPSPATTER",
        type:        "npc",
        concept:     "Canal Hull",
        arena:       "Supernatural",
        description: "This hull learned to consume spirits and bolster its strength with theirs. It cannibalizes machinery and rummages in wrecked boats for parts. It has gondola prow shoulder guards and helm, and strange banded armor made of water-logged wood over intricate mechanical parts. It fears destruction.",
        notes:       "It assassinates targets, with its body or by possessing machines near them. It hunts whispers, leeches, and scholars, stealing their knowledge and killing them. Their allies want revenge."
      },
      {
        name:        "Syla DuTorrivestria",
        type:        "npc",
        concept:     "Famous Connoisseur",
        arena:       "Foreign",
        description: "This mysterious Iruvian hides behind a veil. For years, she has been the final word on Duskwall delicacies. She specializes in evaluating high-end cuisine (including spore wines and cooking with leviathan blood.) She stays in the public eye with racy politics and a string of scandalous romances.",
        notes:       "She must keep any real competitors for her fame weakened and embarrassed, and she has countless enemies. Everyone \"knows\" she is an Iruvian spy."
      },
      {
        name:        "The Honorable Telia Cray",
        type:        "npc",
        concept:     "Stern Prosecutor",
        arena:       "City Law",
        description: "She's old, she's sour, and she has a reputation for jailing Duskwall's criminals. As thin and hard as an iron poker, she relentlessly pursues her cases, bending the law with a passionate hatred of scoundrels. She runs a special unit of Inspectors dedicated to investigating her cases, run by INSPECTOR ULEK.",
        notes:       "If she is taking a case personally ( as she often does) she may hire outsiders to acquire or create evidence. She also conduds a brutal war of counter-intelligence against rogues looking to free their associates."
      },
      {
        name:        "The Wooden Judge",
        type:        "npc",
        concept:     "Haunted Puppet",
        arena:       "Underworld",
        description: "This knee-high ventriloquist dummy looks like a caricature of a grim Judge. It is supernaturally animated. The puppet appears unexpectedly, interrupting a scoundrel's routine by offering jobs in a squeaky voice. He pays by revealing the location of hidden caches of ancient coin.",
        notes:       "Many angry victims want to know who pulls the strings of the Wooden Judge. The puppet often hires fresh talent for dubious work."
      },
      {
        name:        "Theodore Lysander",
        type:        "npc",
        concept:     "Bard Pimp",
        arena:       "Underworld",
        description: "Elegant and charismatic, this well-dressed man runs the Tenpenny Court Network. He manages prostitutes and their customers, his personal connections and charm monetized. He is also a skilled composer and performer, often seen at the Worldsedge Theater in Crow's Foot.",
        notes:       "He is a skilled networker. He takes the safety of his friends seriously, and is protedive of his employees, to the point of using blackmail to force powerful patrons to back off."
      },
      {
        name:        "Chief Prichard",
        type:        "npc",
        description: "The head Overseer of the Ministry of Provisions in Duskwall. Manages the workers and food allotments for the city districts.",
        district:    "Barrowcleft",
        traits:      [
          "calculating",
          "confident",
          "calm"
        ]
      },
      {
        name:        "Lord Strangford",
        type:        "npc",
        description: "Operates one of the largest leviathan hunter fleets, serves on the City Council and is a high-ranking member of the secret order within the Church of Ecstasy.",
        district:    "Brightstone",
        traits:      [
          "secretive",
          "calculating",
          "arrogant"
        ]
      },
      {
        name:        "Hutton",
        type:        "npc",
        description: "A Skovlander refugee and former soldier, now the leader of an anarchist revolutionary movement, bent on forcing the government to acknowledge Skovlander rights in the Empire.",
        district:    "Charhollow",
        traits:      [
          "brave",
          "compassionate",
          "wise"
        ]
      },
      {
        name:        "Lady Drake",
        type:        "npc",
        description: "A magistrate who is \"reasonable\" when it comes to street crime, so long as the offender's purse is sufficient.",
        district:    "Charterhall",
        traits:      [
          "flexible",
          "shrewd",
          "subtle"
        ]
      },
      {
        name:        "Master Slane",
        type:        "npc",
        description: "A notorious factory foreman known for excessive and cruel punishments for the smallest infractions. Many attempts have been made on his life, but all have failed. Some say he's a devil.",
        district:    "Coalridge",
        traits:      [
          "cold",
          "cruel",
          "sadistic"
        ]
      },
      {
        name:        "Sergeant Lochlan",
        type:        "npc",
        description: "The senior Bluecoat squad leader in the district, reporting to Captain Dunvil. Lochlan is flexible and reasonable, taking bribes and payoffs when she can; enforcing the law and making examples when necessary.",
        district:    "Crow's Foot",
        traits:      [
          "shrewd",
          "tough",
          "commanding"
        ]
      },
      {
        name:        "Chief Helker",
        type:        "npc",
        description: "One of the most influential senior Dockers. Helker has a lot of sway at the docks, and if you cross him, you might find your cargo tossed into the drink—and possibly you along with it.",
        district:    "The Docks",
        traits:      [
          "cautious",
          "greedy",
          "vengeful"
        ]
      },
      {
        name:        "Master Krocket",
        type:        "npc",
        description: "An unsavory, greasy-haired, scarecrow of a man who runs the snarling pack of vicious dogs used by Ironhook to track down escapees and sniff out contraband and tunnels. His dog-handlers can be found around the labor camp and all about Dunslough, using their status with the prison for favors and bribes.",
        district:    "Dunslough",
        traits:      [
          "cruel",
          "greedy",
          "ruthless"
        ]
      },
      {
        name:        "Jira",
        type:        "npc",
        description: "A dealer of fine weapons from the Dagger Isles. Greatly respected by many street toughs in The Dusk—a \"jira blade\" is a status symbol that many aspire to.",
        district:    "Nightmarket",
        traits:      [
          "bold",
          "tough",
          "confident"
        ]
      },
      {
        name:        "Levyra",
        type:        "npc",
        description: "A medium who invites clients to bring ghosts in bottles to posses her so they can share a few final words before the ghost is \"freed\" (Levyra hands it off to the waiting Spirit Wardens nearby).",
        district:    "Silkshore",
        traits:      [
          "weird",
          "daring",
          "dishonest",
          ""
        ]
      },
      {
        name:        "Mother Narya",
        type:        "npc",
        description: "Runs the Arms of the Weeping Lady charity house.",
        district:    "Six Towers",
        traits:      [
          "kind",
          "patient",
          "gracious"
        ]
      },
      {
        name:        "Maestro Helleren",
        type:        "npc",
        description: "Senior composer and conductor of the Spiregarden Theater, premiere performance venue for the elite of the city.",
        district:    "Whitecrown",
        traits:      [
          "sincere",
          "dramatic",
          "vain"
        ]
      },
      {
        name:        "Hester Vale",
        type:        "npc",
        description: "Matriarch of the oldest farm family. The living embodiment of \"tough but fair.\"",
        district:    "Barrowcleft",
        traits:      [
          "proud",
          "fierce",
          "suspicious"
        ]
      },
      {
        name:        "Commander Bowmore",
        type:        "npc",
        description: "Chief Officer of the Watch in Brightstone. Bowmore's family financed Bowmore Bridge centuries ago and now holds many positions of power.",
        district:    "Brightstone",
        traits:      [
          "proud",
          "principled",
          "connected"
        ]
      },
      {
        name:        "Briggs",
        type:        "npc",
        description: "The owner of a merchant stall at Charhollow market, cover for a network of gossips, spies, and code-smiths among the working class people of the district, selling their services to those who need them.",
        district:    "Charhollow",
        traits:      [
          "secretive",
          "sneaky",
          "cautious"
        ]
      },
      {
        name:        "Lord Penderyn",
        type:        "npc",
        description: "Chief Scholar of the Archive of Echoes, authorized by the Emperor to keep a collection of ancient ghosts trapped in spirit bottles, to be consulted in cases where knowledge from the distant past would benefit the operation of the Imperial government. Lord Penderyn also consults the spirits on his own volition, forming the rebellious Path of Echoes society for other elites and nobles who seek communion with the spectral realm.",
        district:    "Charterhall",
        traits:      [
          "reckless",
          "strange",
          "obsessive"
        ]
      },
      {
        name:        "Belle Brogan",
        type:        "npc",
        description: "A Skovlander factory worker who's been gaining popularity as a potential union organizer. It's only a matter of time before a factory boss tries make an example of her.",
        district:    "Coalridge",
        traits:      [
          "charming",
          "confident",
          "bold"
        ]
      },
      {
        name:        "Lewit, Jol, Myra, Reyf",
        type:        "npc",
        description: "Bluecoat constables; run an extortion racket.",
        district:    "Crow's Foot",
        traits:      [
          "arrogant",
          "vain",
          "volatile"
        ]
      },
      {
        name:        "Tris",
        type:        "npc",
        description: "A legendary tattooist who only inks those that have looked upon a leviathan and lived to tell the tale. Getting a tattoo from Tris is a rite of passage for everyone who hunts the demons of the void sea.",
        district:    "The Docks",
        traits:      [
          "artistic",
          "popular",
          "insightful"
        ]
      },
      {
        name:        "Vandra",
        type:        "npc",
        description: "A deathlands scavenger that survived six runs and was pardoned. She knows the landscape beyond the barrier very well—but few can make sense of her haunted mumblings.",
        district:    "Dunslough",
        traits:      [
          "haunted",
          "wise",
          "daring"
        ]
      },
      {
        name:        "Leclure",
        type:        "npc",
        description: "A purveyor of personal luxuries (soaps, hair oils, perfume, fine silks) who dabbles in fortune telling. Some say her that drowned lover is a ghost that whispers secrets in her ear.",
        district:    "Nightmarket",
        traits:      [
          "shrewd",
          "tough",
          "commanding"
        ]
      },
      {
        name:        "Helene",
        type:        "npc",
        description: "The elegant and mysterious proprietor of the Silver Stag Casino. People say she would have been a queen of Severos had she lived in the old days before the Empire.",
        district:    "Silkshore",
        traits:      [
          "cultured",
          "charming",
          "secretive"
        ]
      },
      {
        name:        "Chef Roselle",
        type:        "npc",
        description: "One of the best cooks in the city, still operating the legendary Golden Plum restaurant—worth the trip into the haunted streets of Six Towers.",
        district:    "Six Towers",
        traits:      [
          "creative",
          "insightful",
          "friendly"
        ]
      },
      {
        name:        "Lady Freyla",
        type:        "npc",
        description: "Regarded by some as the finest sommelier in the Empire. She serves only the most deserving at the Emperor's Cask.",
        district:    "Whitecrown",
        traits:      [
          "erudite",
          "cultured",
          "charming"
        ]
      },
      {
        name:        "Mara Keel",
        type:        "npc",
        description: "A former smuggler who's gone into hiding among the farm laborers of Barrowcleft.",
        district:    "Barrowcleft",
        traits:      [
          "quiet",
          "secretive",
          "patient"
        ]
      },
      {
        name:        "Rolan Wott",
        type:        "npc",
        description: "An influential magistrate who handles property, endowments, and financial cases. Famous for his extravagant parties.",
        district:    "Brightstone",
        traits:      [
          "stylish",
          "elitist",
          "shrewd"
        ]
      },
      {
        name:        "Corben",
        type:        "npc",
        description: "An ex-military Skovlander on the lam for crimes against the empire.",
        district:    "Charhollow",
        traits:      [
          "tough",
          "reckless",
          "candid"
        ]
      },
      {
        name:        "Hopper",
        type:        "npc",
        description: "A drug addict, whisper, and all-around weirdo who perches on rooftops in the district. Hopper claims to see \"ghost rails\" and \"spirit trains\" originating deep beneath Coalridge, stretching beyond the horizon.",
        district:    "Coalridge",
        traits:      [
          "weird",
          "visionary",
          "enthusiastic"
        ]
      },
      {
        name:        "Mardin Gull",
        type:        "npc",
        description: "Owner and operator of the Leaky Bucket public house. Mardin was the leader of the Crows many years ago, before Roric and Lyssa, and now enjoys a comfortable retirement out of the scoundrel life.",
        district:    "Crow's Foot",
        traits:      [
          "charming",
          "experienced",
          "respected"
        ]
      },
      {
        name:        "Mordis",
        type:        "npc",
        description: "A strange merchant which hides its true appearance beneath many layers of robes and hoods. Also fences occult and arcane stolen goods, no questions asked.",
        district:    "Nightmarket",
        traits:      [
          "secretive",
          "insightful",
          "arcane"
        ]
      },
      {
        name:        "Madame Tesslyn",
        type:        "npc",
        description: "Operates the Red Lamp brothel, the oldest and most respected institution of its sort in the city.",
        district:    "Silkshore",
        traits:      [
          "confident",
          "insightful",
          "enthusiastic"
        ]
      },
      {
        name:        "Flint",
        type:        "npc",
        description: "A spirit trafficker who trades out of a condemned manor house.",
        district:    "Six Towers",
        traits:      [
          "weird",
          "calculating",
          "suspicious"
        ]
      }
    ],
    Scores: [
      {
        name:      "Accidental Death",
        category:  "Secret Dirty Work",
        desc:      "Not only must the target die, the target must not know how death came. If by some misfortune the ghost of the victim is interrogated, it must not have any special knowledge. There is a ritual and an amulet for the assassins to ensure secrecy. No one living or dead can know who did this deed.",
        narrative: "By the time the crew knows the job, there is a better than even chance their knowledge is too much risk and their employer plans to kill them. They might want some leverage."
      },
      {
        name:      "Bayer's Train Heist",
        category:  "Misplaced Fortune",
        desc:      "Bayer was a rail jack fired for being drunk. Over years, he built a crew with one mission in mind--robbing a train. When lruvia completed negotiations with Akoros to buy an unprecedented mass of leviathan blood to pour into industrialization, Bayer's crew hit the train carrying the payment, sabotaging a bridge. Rescuers found the train in the canyon, but no gold--an impossible feat. Bayer's crew vanished.",
        narrative: "An Iruvian ingot stamped with the year \"802\" will attract attention."
      },
      {
        name:      "Bellweather Architectural Plans",
        category:  "Historical Curiosity",
        desc:      "The Duskwall Archives have the sanitized blueprints of the Bellweather Crematorium on file. The original plans were drawn by a Spirit Warden driven mad by an internal rift, so he haunted himself. He drew peculiar plans with occult underpinnings, and those original drawings were interpreted by architects.",
        narrative: "Are there coded secrets in the original plans that reveal a repellant secret or ominous threat? Or are the plans the scribbling of a madman? Either way, some people would pay top coin to get a good look."
      },
      {
        name:      "Book of Walls",
        category:  "Historical Curiosity",
        desc:      "Long ago, a nameless rogue cultivated a mass of bloodworms in a wall. He wrote a book with their blood. The words were nonsense, but strangely affecting; if the reader tuned in to them, and held the book, the reader could walk through a wall. Spirit Wardens ruined the book with holy smoke.",
        narrative: "A legend, or is there truth to it? Walking through walls is a neat trick, and the book may hold the key to learning it. It is sought by a wide variety of the curious—scholars, collectors, and scoundrels."
      },
      {
        name:      "Censer Mace of Udoch",
        category:  "Religious Object",
        desc:      "The head of this ornately carved mace opens on hinges so incense can be put inside to wisp as the mace swings. The haft has a recipe carved into it, instructions to make special incense out of bone and rare sap and unguents. If that incense bums in the mace, it can destroy ghosts or demons with a single hit.",
        narrative: "This was a founding artifact of the Church of the Ecstasy of the Flesh. If it were returned, they would gain a fresh following from critics who feel the church cannot protect against supernatural threats."
      },
      {
        name:      "Charter of Crows",
        category:  "Historical Curiosity",
        desc:      "This gauntlet is made out of crow beaks. Each beak is carved with arcane symbols. Consulting Whispers officially report it does not have any power in the Ghost Field. It was made by the Spirit Warden who first tamed the deathseeker crows; he claimed it was a treaty that guaranteed their service.",
        narrative: "Spirit Wardens lost this gauntlet decades ago, but they want it back. The idea it is a treaty with the deathseeker crows is probably nonsense. They can't take that chance."
      },
      {
        name:      "Combination Harpsichord",
        category:  "Weird Scholarship",
        desc:      "TARNALI was a Whisper composer who built a special harpsichord. When two tones are played, often a third \"ghost\" tone can be heard. By attaching the tuning pegs to crystals and runes, Tarnali built a harpsichord that could interact with the Ghost Field through calculated progressions of played tones.",
        narrative: "This effort is intensely interesting to those who want to find doors hidden in the Ghost Field, draw or repel what lurks Behind the Mirror, or develop more portable tonal energies for non-Whispers ."
      },
      {
        name:      "Dyvik's Chaser Mask",
        category:  "Weird Artifact",
        desc:      "This silvery face mask has the word “Elekthiaron” etched along its inner edge. When the word is spoken, the personality of the one touching the mask is pulled into it. The personality that was in the mask goes in the body. If the one in the body doesn't touch the mask once a week, madness threatens.",
        narrative: "Has someone been using the mask to pose as someone else? How long has that been going on? Is there someone in the mask that needs rescuing? Was the mask used to cheat biological death?"
      },
      {
        name:      "Evardian's Song Folios",
        category:  "Weird Scholarship",
        desc:      "Four leather-bound volumes, full of musical notation with heavily annotated margins. The \"music\" is supposed to be transcribed and translated leviathan song. Legend suggests if the music is played correctly, it can drive humans insane with visions of the demon-haunted deep.",
        narrative: "Aristocrats will collect anything. Scholars go to great lengths for research material. Cultists may find religious significance in the folios. (Owning the folios is against the law.)"
      },
      {
        name:      "Falheim's Prod",
        category:  "Historical Curiosity",
        desc:      "This ragged pole with a spear and a silver-cable loop was the first prototype of what became the lightning hook. It doesn't work very well, but it was the first historically known charged object that could consistently interact with the Ghost Field.",
        narrative: "Apparently this bit of history is an important prestige piece in the turbulent intrigues of a number of underground cults led by Whispers. The city government would also like to display it in a museum."
      },
      {
        name:      "Fang of Ibiria",
        category:  "Religious Object",
        desc:      "This brutal stiletto has a green stone in the pommel, and a runic symbol on the blade. The blade transforms electroplasm into a mutagen. The longer the blade is in a victim, the more monstrous the victim becomes. A cut gives nightmares, minutes give mutations, hours or days create a real monster.",
        narrative: "Cultists want this blade so they can make or become monsters."
      },
      {
        name:      "Goblet of Eletrachtian",
        category:  "Weird Artifact",
        desc:      "The silver and gold cup is big enough to hold with two hands, crusted with obsidian stones. The owner puts a drop of a demon's blood in the goblet with certain other liquids, and conducts a ritual. For days afterwards (maybe longer) the owner can see anything the demon uses remote vision to view, just by watching the surface's illusory reflections.",
        narrative: "There are many legends about the creation of the goblet, and the fate of the Whisper who first energized it. Rumor suggests the Duskwall Council entrusted the goblet to a certain family for safekeeping."
      },
      {
        name:      "Hollow Shroud",
        category:  "Religious Object",
        desc:      "The Church of the Ecstasy of the Flesh clergy wrapped the funeral shroud around a heretic, then conducted a ritual that severed the heretic's connection to the body, cutting the spirit loose as a ghost. The shroud transferred the spirit of a faithful but sickly member into the heretic's body. New life!",
        narrative: "The Shroud was stolen almost twenty years ago, and rumors suggest it has been used in debased rituals to summon demons or enflesh echoes of the Forgotten Gods."
      },
      {
        name:      "Idol of the Sleeping Lion",
        category:  "Religious Object",
        desc:      "The hefty iron statue depicts a devilfish-headed humanoid, cloaked in wings. Its presence influences human dreams, so they drift through the ink-black sea but can perceive their surroundings. Sacrificing to the statue gives a cultist a cosmic infection, involving psychic ability and mutations.",
        narrative: "The statue has been retrieved by officers of the law several times, and destroyed several times more. Again and again, it emerges in the heart of fresh tragedy, baleful and singular."
      },
      {
        name:      "Ink Fleece",
        category:  "Family Heirloom",
        desc:      "Long ago, Captain Manarill claimed he could prove that leviathans had fur, or fleece. He brought back a swatch of curling fur as big as a bedspread. He claimed to have harvested it from a leviathan's skin. The mantle served as a symbol of the Manarill family's heritage of exploration and danger. But it was stolen.",
        narrative: "Does it do more than represent heritage? What dreams might one have while wrapped in it? Might a wealthy Whisper pay more for it than the family that owned it? Who took it?"
      },
      {
        name:      "Kasavaraya Tea Set",
        category:  "Family Heirloom",
        desc:      "When the Immortal Emperor visited Akoros four centuries ago, he used this tea set with the patriarch of the Kasavaraya family. They are still one of the most decorated and entrenched military families in Duskwall. Their tea set is a symbol of Duskwall's prominence. However, a saucer and a cup are missing.",
        narrative: "This stuff is priceless, literally, so negotiating a price for its return is tricky. If you could find the missing pieces, or forge them adequately, they would be great hostages to ajfed the family's behavior."
      },
      {
        name:      "Kidnap The Heir",
        category:  "Secret Dirty Work",
        desc:      "People are keys that fit into estate locks. They can be turned to open the way to lots of money. You might be taking a child to ransom back to the guardian, or you might be getting someone out of the way so a more distant heir can inherit. This is about controlling where the money goes.",
        narrative: "How harsh does the employer want this to be? Kid gloves treatment, or is the plan to kill the heir when it is all over? How much input will the employer accept from the hired help? Is the plan already in place?"
      },
      {
        name:      "Krogs Broken Heart",
        category:  "Misplaced Fortune",
        desc:      "Krog was a savage from the Dagger Isles, pressed into service on a hunting ship. He eventually owned a small fleet. He was old when he fell in love with a young woman who robbed him. Heartbroken, he took the rest of his treasure aboard his last hunting ship, Heartsong, and scuttled her in the harbor.",
        narrative: "Whispers like to brag they found a way under the waves to find the wealth. Gracmaas the Pirate claimed to have recovered it all to his hidden lair—before he was killed."
      },
      {
        name:      "Limptwitch's Stash",
        category:  "Misplaced Fortune",
        desc:      "Limptwitch was a Whisper who interrogated ghosts to find the location of hidden treasure. He was famous for his Grotto, the place where he stored all his salvaged wealth. Many factions tried to get his treasure, but he never gave up the secret. Then he was jailed and hanged. The Grotto was never found.",
        narrative: "Did a cellmate in prison hear muttered hints as to its location? Maybe a Whisper has clues based on where he left his mark in the sewers. Has someone finally found a real lead?"
      },
      {
        name:      "Mark of the Void",
        category:  "Religious Object",
        desc:      "It is an eerie black disk of leviathan bone, about the size of a dinner plate but five times as thick. The bone is carved with a strange circular pattern with rays cutting through it. The primitive artwork was polished, and silver inlaid in the pattern, by a decadent nobleman.",
        narrative: "Impressionable people admit the disk whispers to them, they hear the Back of the Mirror when it the disk is near. Many cults see this disk as a conduit to clearer communication with their supernatural patrons."
      },
      {
        name:      "Naladicha's Cartography",
        category:  "Historical Curiosity",
        desc:      "The famous cartographer Naladicha died, and his ghost was woven into a spirit anchor connected to a pen on a wire. The drooping pen scribbled nonstop, dipping to indicate a page turn. Two books were filled with scribbles before the pen stilled. These lines and shapes may be maps of the Ghost Field.",
        narrative: "One consulting Whisper reported that when she attuned to the books using an expensive and difficult ritual, the maps became luminous and four dimensional, revealing lost secrets in Duskwall."
      },
      {
        name:      "Norscye's Lament",
        category:  "Famous Jewel",
        desc:      "This ruby has been set in a series of weapons for the last three centuries. One estimate was that the gem had participated in upwards of a thousand deaths. Legend suggests that the ruby can hold a single ghost, surviving the destruction of the body, bound to the gem until it chooses another guest.",
        narrative: "While the gemstone is priceless because of its unnatural clarity, it is also possible that an important ghost might be inside, and might choose to speak to a Whisper or a blood relative."
      },
      {
        name:      "Orb Of Sellivas",
        category:  "Weird Artifact",
        desc:      "This fist-sized golden orb tunes to one bearer at a time, though it may respond to others. If commanded, it can release a steady light that radiates in the material world and the Ghost Field, revealing what is hidden. The radiation can also draw or repel ghosts and demons.",
        narrative: "The Sellivas order of witches wrote their research journals in an ink that can only be read by the light of the Orb. If someone had the Orb and the \"blank\" book, they could crack ancient secrets."
      },
      {
        name:      "Plant Evidence",
        category:  "Secret Dirty Work",
        desc:      "Someone needs to be found guilty of doing something. For that to work out, you need evidence, put in the wrong place at the wrong time. To manage that, you need proper scoundrels.",
        narrative: "Do you know what the target will be accused of doing? Are you to lead the authorities to the evidence? Must someone be seduced before a hidden witness? Are the scoundrels making evidence, or using what they're given? What if they could do better? Must the evidence fool a court, or a powerful individual?"
      },
      {
        name:      "Plasmic Blade Flail",
        category:  "Weird Artifact",
        desc:      "This weapon can slay ghosts and demons. It appears to be a gladius stitched with runes. Once the bearer attunes to the weapon, it can disconnect into vertebrate-like wedges connected by a steely central cable. The blade-whip is flexible and simmering with energy. It can reform into a straight blade at will.",
        narrative: "Only five of these flails ever existed. One is carried by the Spirit Warden assigned to the Immortal Emperor's defense. The rest are the stuff of legends."
      },
      {
        name:      "Remote Writer",
        category:  "Weird Artifact",
        desc:      "This little book has a peculiar occult symbol on the cover. If an object is placed between the covers for a full 24 hours, then the book will transcribe any conversation happening in earshot of the object until reset. When the book reaches the end, the writing starts over on the first page, clearing pages as it goes.",
        narrative: "The book provides remote reading, eavesdropping of a sort. A target's favorite pen or lucky coin can become the broadcaster, and determined spies can copy the magic book writing so they don't lose it."
      },
      {
        name:      "Rylaria's Shield",
        category:  "Family Heirloom",
        desc:      "Rylaria Graefwold was a soldier who gained title and wealth. She wrote her life's story on the back of the shield she used to save a general. Later generations added to the family story. The shield represents the family's honor. It was lost at sea when their first leviathan hunting ship was wrecked. Or was it?",
        narrative: "Now the family is wealthy, and this artifact would be important to them. Does it have a secret in code?"
      },
      {
        name:      "Skovlan Scrip",
        category:  "Misplaced Fortune",
        desc:      "A dense lockbox filled with paper money issued by the Akorosian government to pay soldiers quelling the Skovlander Insurrection. The scrip can be exchanged for coins or services in Duskwall. Scrip is basically untraceable.",
        narrative: "Some of the military supply that got lost during the war. Does the stashs location implicate a corrupt official or other thief?"
      },
      {
        name:      "Sonurian Ghost Key",
        category:  "Family Heirloom",
        desc:      "The Sonuria family had mansions in the area that is now the Seven Shallows slum. They created a vault for the protected dead, and for their mundane treasures. The only way in is for a family member to present the Sonurian Ghost Key before the hidden location of the vault in the Ghost Field. The key has been lost for decades.",
        narrative: "That key could be hidden anywhere. If it were found, either a family member could be recruited to open the door, or the key could be sold to the family. What does the key look like? What is inside the vault?"
      },
      {
        name:      "Soultrap Carnelian",
        category:  "Famous Jewel",
        desc:      "This semi-precious stone was carved by the Whisper Ichralia. She suffocated people with hot wax and bound their fresh ghosts in wax seals on scrolls or letters with the Soultrap. When the seal was broken, the insane ghost attacked the opener and anyone nearby.",
        narrative: "The Spirit Wardens destroyed this object decades ago. Didn't they? Maybe someone else made another one, or maybe the original survived."
      },
      {
        name:      "Steal Blackmail",
        category:  "Secret Dirty Work",
        desc:      "Secrets must be protected. If they come out, people can get hurt, ruined, killed, and so on. You are hired to adjust the circle of people who can prove something. Will it be bigger? Or smaller?",
        narrative: "Do you know what information you're after, or is that secret from you? If you have a chance, will you peek at it? Are you targeting a blackmailer to remove their hold, or getting evidence to give a blackmailer? Is the evidence to be destroyed? Do you plan to do as you are told?"
      },
      {
        name:      "Terrorize",
        category:  "Secret Dirty Work",
        desc:      "People can be stubborn, to the point where only fear can unseat their decision. Maybe they feel independent and need to reminded that they need protection. Maybe they feel safe and need to be reminded they are not untouchable.",
        narrative: "Are you supposed to be someone in particular, like a random street thug or rival's employee or bluecoat? How far can the terror go? Do you need to trash a home, or maybe converse with a loved one?"
      },
      {
        name:      "The Emerald Well",
        category:  "Famous Jewel",
        desc:      "This depthless gem is a chilly pinhole between the material world and the Ghost Field. It provides energy to Whispers and attracts ghosts. The Emerald Well was protected by the Church of the Ecstasy of the Flesh, but a thief stole it decades ago. It is a hotspot for supernatural activity. Disaster flows in its wake.",
        narrative: "This is one of the few objects pursued by demons, Whispers, inspectors, clergy, and collectors. Scholars suggest demons may be able to turn it inside out, creating a fresh gate to incarnate more demons."
      },
      {
        name:      "The Hellwhisper Ring",
        category:  "Weird Scholarship",
        desc:      "The ring is made of tiny bits of bone wired together. It must be worn for at least a day per year of the bearer's life before it begins to work. When placed on a source of information, the ring sifts it until the ring speaks the information's \"language.\" The bearer can see through riddles, read arcane texts, and break code with ease.",
        narrative: "Legend says 32 demons voluntarily gave some of their bone to be part of this ring, and it was released among humans to cause chaos through greater understanding."
      },
      {
        name:      "The Helsman Inheritance",
        category:  "Misplaced Fortune",
        desc:      "The final will and testament of the clan's patriarch included a 24 hour locked-house condition. Survivors would split the inheritance. Darayl Helsman left the house at the end of the time with a small bag. Explorers found nothing but corpses in the house, the inheritance was gone. Darayl was found dead the next day, the bag gone. The city locked the house and guards against trespassers.",
        narrative: "Surely Darayl hid the inheritance in the Ghost Field. Find the ghost key and lock in the house, and get it all! Or, did someone else already get it?"
      },
      {
        name:      "The Key Lens",
        category:  "Weird Scholarship",
        desc:      "The round frame has forty special lenses hinged on its rim. The lenses can layer over each other, flip out past the frame, rotate to take advantage of the angles inside the ground crystal, and take translucent colored filters. Their inventor, VLAS HALDAK, said he had found \"the key.\" He died of shock, the lens on his work table.",
        narrative: "Legends vary. It can see into the Ghost Field, it can see into people, it allows reading demonic texts, it can see the way into ghost neighborhoods, etc. Needs a Whisper to use properly."
      },
      {
        name:      "The Leviathan's Eye",
        category:  "Famous Jewel",
        desc:      "This sapphire turns impossibly black if dipped in leviathan blood. If the still-bloody stone is pressed against a seer's forehead, the sensitive can see what the ocean sees, looking above the waves or probing the deeps. The gem used to be passed around between leviathan hunter captains, but has since been lost.",
        narrative: "One expert said using the Eye was as close as a human could get to a demon seeing through its elemental affinity, and that it began a slow change in the individual who was exposed to its power."
      },
      {
        name:      "The Tabissera Diary",
        category:  "Weird Scholarship",
        desc:      "Warden Khalana Uress was the Head Confessor of the Spirit Wardens. She recorded secrets that were only for the use of the order using a book code, coordinates that pointed to words in a specific book. Without that book, the code cannot be cracked. Daring thieves took the book, then lost it.",
        narrative: "Fakes come on the market all the time. Only the Spirit Warden leadership know what the book looked like, and they aren't telling. What is the Diary about?"
      },
      {
        name:      "The Thousand Facet Diamond",
        category:  "Famous Jewel",
        desc:      "This gem is the elegant centerpiece on the back of a peculiar clockwork gauntlet. A seer can use the gauntlet to travel into the Ghost Field while retaining physical presence, or possibly even other dimensions. Each use burns out some of the diamond facets. The device is reported to have a mind of its own.",
        narrative: "Ever since its theft from the Adelairde family, the gauntlet has surfaced only in rumors of especially daring heists or mind-shattering experiments."
      },
      {
        name:      "Whitecrown Signet Ring",
        category:  "Family Heirloom",
        desc:      "The Whitecrown family schismed in the wake of the theft of the matriarch's signet ring over two centuries ago. They fell from being players in the intrigues around the throne to bickering over dwindling family holdings. Their wealth and influence is low, but not beyond recall.",
        narrative: "If the ring resurfaced, elements of the feud might put aside their differences and reunite. Besides, legends suggest a ghost matriarch is bound to the ring, and she knows their secrets."
      }
    ]
  }
};
// #endregion

// #region SVG DATA~

export type ClockKeySVGData = {
  width: number,
  height: number,
  path: string,
  clocks: Partial<Record<ClockIndex, gsap.Point2D>> & {size: number}
}

export const ClockKey_SVGDATA: Record<
Exclude<ClockKeySize, 0>,
{
  height: number,
  width: number,
  path?: string,
  paths?: string[],
  clocks: Partial<Record<ClockIndex, gsap.Point2D>> & {size: number}
}
> = {
  1: {
    height: 836,
    width:  230,
    paths:  [
      "M217.017,123.52c-1.6-0.8-2.84-1.44-4.1-2.04c-1.12-0.53-2.26-1.04-3.42-1.51 c-1.05-0.43-2.18-0.68-3.18-1.19c-0.89-0.45-1.23-1.23-1.2-2.36c0.09-4.48-0.07-8.97,0.05-13.45c0.08-3.31-0.83-6.47-1.14-9.72 c-0.01-0.14-0.09-0.28-0.14-0.42c-0.57-2.01-1.2-4.01-1.69-6.04c-0.45-1.85-0.75-3.74-1.11-5.61 c-0.012-0.043-0.023-0.085-0.035-0.127c-0.6-1.69-1.348-3.353-1.825-5.083c-0.46-1.66-0.68-3.38-1.03-5.07 c-0.04-0.24-0.16-0.47-0.25-0.7c-0.49-1.32-0.98-2.65-1.47-3.97c-0.55-1.44-0.93-2.97-1.69-4.28c-0.79-1.35-0.65-3.03,0.61-4.19 c0.43-0.39,0.85-0.85,1.08-1.36c0.57-1.3,1.35-2.62,1.44-3.97c0.08-1.11-0.46-3.08-1.14-3.29c-1.58-0.47-3.49-0.42-5.1,0.03 c-1.41,0.4-2.59,1.63-4.07,2.62c-1.15-1.18-2.43-2.41-3.6-3.75c-0.41-0.47-0.43-1.29-0.82-1.78c-0.67-0.84-1.56-1.5-2.23-2.33 c-0.18-0.22-0.08-0.9,0.13-1.16c0.85-1.02,1.78-1.97,2.71-2.92c2.18-2.22,4.37-4.45,6.57-6.65c0.85-0.86,1.78-1.64,2.63-2.5 c1.16-1.17,2.38-2.29,3.37-3.59c0.66-0.88,0.89-2.07,1.42-3.06c0.86-1.63,0.01-3.02-0.68-4.31c-0.23-0.43-1.4-0.4-2.15-0.48 c-0.69-0.08-1.4,0.02-2.09-0.02c-1.71-0.11-3.14,0.17-4.52,1.47c-1.22,1.14-2.96,1.74-4.44,2.62c-0.98,0.59-1.89,1.31-2.88,1.88 c-2.02,1.17-4.2,2.11-6.07,3.47c-1.12,0.81-2.16,1.18-3.49,1.4c-1.28,0.22-2.44,1.1-3.7,1.59c-0.58,0.23-1.72,0.49-1.82,0.3 c-0.91-1.63-2.75-1.79-4.03-2.77c-0.33-0.25-0.58-0.62-0.93-0.82c-1.11-0.64-2.26-1.22-3.38-1.85c-1.48-0.83-2.94-1.7-4.42-2.53 c-0.93-0.53-1.83-1.24-2.84-1.5c-1.37-0.35-2.24-1.96-3.89-1.5c-0.08,0.03-0.19-0.02-0.29-0.04c-1.97-0.58-3.94-1.16-5.91-1.73 c-0.28-0.08-0.76-0.02-0.84-0.18c-0.89-1.7-2.8-1.2-4.1-1.6c-2.83-0.87-5.94-0.87-8.94-1.22c-0.39-0.04-1.05,0.06-1.14-0.13 c-0.79-1.56-2.21-1.01-3.4-1.05c-2.09-0.08-2.68-0.62-2.72-2.65c-0.01-0.84-0.1-1.69-0.24-2.51c-0.16-0.88-0.54-1.72-0.62-2.59 c-0.13-1.24-0.03-2.49-0.11-3.73c-0.06-0.88-0.61-1.45-1.5-1.13c-0.79,0.28-1.59,0.72-2.21,1.28c-1.48,1.36-2.85,2.84-4.29,4.25 c-1.1,1.08-2.08,2.06-3.81,2.55c-1.54,0.44-2.99,1.69-4.63,2.42c-1.79,0.8-3.28,2.25-5.44,2.13c-0.44-0.02-1.16-0.02-1.28,0.22 c-0.7,1.36-1.94,0.82-2.98,0.97c-0.49,0.07-0.99,0.11-1.47,0.24c-1.92,0.49-3.84,0.98-5.75,1.52c-1.74,0.49-3.51,0.95-5.19,1.61 c-1.92,0.74-3.67,1.99-5.63,2.46c-1.64,0.38-3.01,1.13-4.51,1.72c-0.99,0.39-2.52,0.38-3.43-0.13c-1.93-1.09-4.28-1.09-6.03-2.54 c-0.22-0.19-0.67-0.12-1.02-0.13c-0.9-0.02-1.79-0.02-2.69-0.02c-1.37,0.01-2.19,0.72-2.36,2.15c-0.09,0.78-0.06,1.59-0.09,2.38 c-0.01,0.35,0.11,0.87-0.06,1.02c-1.68,1.35-0.89,3.24-1.18,4.9c-0.16,0.88-0.56,1.8-1.1,2.51c-0.75,0.99-1.76,1.79-2.61,2.72 c-1.02,1.1-1.99,2.26-2.99,3.39c-1.49,1.67-2.96,3.37-4.5,5c-1.36,1.45-2.81,2.83-4.2,4.25c-0.16,0.17-0.19,0.46-0.31,0.67 c-0.74,1.29-1.39,2.64-2.25,3.84c-0.89,1.25-2.63,1.86-2.72,3.75c-0.02,0.38-0.57,0.73-0.86,1.11c-0.37,0.49-0.79,0.96-1.07,1.5 c-0.73,1.39-1.26,2.89-2.1,4.21c-1.08,1.71-2.25,3.34-2.65,5.38c-0.07,0.32-0.39,0.6-0.57,0.91c-0.21,0.34-0.45,0.67-0.59,1.05 c-0.43,1.21-0.72,2.48-1.24,3.65c-0.79,1.76-1.75,3.45-2.6,5.19c-1.27,2.6-2.74,5.13-3.69,7.85c-0.5,1.45-0.18,3.23-0.08,4.85 c0.05,0.7,0.68,1.37,0.69,2.06c0.06,6.07,0.06,12.15,0.01,18.23c0,0.71-0.37,1.44-0.63,2.13c-0.35,0.95-1.04,1.85-1.09,2.8 c-0.07,1.31-1.04,1.92-1.62,2.82c-0.91,1.43-2.71,1.9-3.59,3.51c-1.01,1.85-0.94,3.91,0.46,5.41c1.17,1.24,2.59,0.75,3.93,0.97 c1.41,0.22,3.01,0.26,4.12,0.99c1.11,0.74,1.87,2.16,2.5,3.43c0.77,1.56,1.35,3.24,1.8,4.92c0.67,2.5,0.94,5.12,2.32,7.4 c0.56,0.92,1.03,1.9,1.52,2.87c0.51,1.03,0.96,2.09,1.48,3.11c0.56,1.09,1.13,2.18,1.77,3.22c0.29,0.48,0.84,0.8,1.16,1.26 c0.61,0.87,1.11,1.82,1.71,2.69c0.32,0.47,0.83,0.81,1.16,1.27c0.93,1.3,1.79,2.65,2.73,3.95c0.31,0.43,0.83,0.69,1.15,1.11 c0.52,0.69,0.89,1.51,1.44,2.16c0.41,0.48,1.1,0.72,1.54,1.18c1.57,1.66,3,3.46,4.65,5.03c1.3,1.26,2.91,2.18,4.25,3.4 c1.99,1.84,3.82,3.85,5.81,5.7c0.51,0.47,1.42,0.47,1.99,0.9c0.95,0.71,1.78,1.59,2.88,2.59c-0.72,0.66-1.63,1.5-2.55,2.33 c-0.78,0.7-1.61,1.34-2.34,2.07c-1.54,1.55-3.05,3.13-4.54,4.73c-1.24,1.32-2.6,2.56-3.6,4.05c-0.6,0.91-1.1,1.85-1.89,2.63 c-1.23,1.21-1.21,4.03,0.24,4.66c1.03,0.45,2.61,0.53,3.57,0.03c1.41-0.72,2.76-0.5,4.14-0.57c1.93-0.09,3.89,0.02,5.8-0.21 c1.19-0.14,2.33-0.75,3.46-1.2c0.49-0.19,0.89-0.6,1.38-0.76c0.46-0.16,1.13,0.06,1.45-0.21c2.19-1.82,5.18-1.79,7.53-3.48 c1.41-1.01,3.25-2.21,5.36-2.06c0.28,0.02,0.58-0.29,0.88-0.44c0.42-0.22,0.85-0.61,1.29-0.62c3.43-0.04,6.86,0,10.3,0.03 c0.38,0,0.99-0.01,1.11,0.21c0.64,1.13,1.69,0.85,2.63,0.91c1.1,0.06,2.24-0.13,3.27,0.14c2.96,0.79,5.9,1.59,9,1.58 c6.02-0.03,12.05,0.27,18.01-0.93c0.82-0.17,1.69-0.08,2.52-0.24c1.04-0.2,2.05-0.52,3.14-0.81c0.13,0.6,0.21,0.79,0.21,0.98 c0.01,8.226,0.03,16.462,0.01,24.699c-0.001,0.368-0.217,0.882-0.515,1.099c-0.676,0.493-1.572,0.71-2.176,1.273 c-1.37,1.26-2.6,2.68-3.92,4c-0.73,0.73-1.61,1.32-2.31,2.08c-0.98,1.06-0.96,2.42-0.9,3.78c0.07,1.95,0.64,2.62,2.59,2.67 c1.712,0.061,3.434,0.019,5.146,0.03c1.112,0.007,2.014,0.908,2.024,2.02c0.06,6.72,0.08,13.44,0.15,20.16 c0.019,1.205-0.537,1.936-1.437,2.533c-0.23,0.153-0.451,0.318-0.644,0.516c-1.605,1.643-3.165,3.308-4.789,4.931 c-0.63,0.64-1.57,1.05-2.01,1.79c-1.29,2.14-3.22,3.55-5.3,4.69c-2.51,1.38-2.76,1.58-2.61,4.33c0.09,1.65,1.84,3.48,3.41,3.17 c1.82-0.35,3.74-0.85,5.26-1.85c0.77-0.51,1.38-0.68,2.16-0.71c0.95-0.04,1.9-0.01,2.84-0.01c2.59,0.01,3.03,0.46,3.03,3.1 c-0.01,31.18-0.02,62.36-0.04,93.55c0,2.88-0.13,5.78,0.03,8.66c0.16,2.8,0.67,5.58,0.91,8.39c0.15,1.83,0.08,3.68,0.15,5.52 c0.02,0.42,0.14,0.85,0.29,1.25c0.23,0.58,0.66,1.12,0.75,1.72c0.13,0.93-0.34,2.21,0.13,2.78c1.82,2.18-0.35,4.04-0.21,6.04 c0.01,0.2-0.21,0.41-0.31,0.62c-0.53,1.08-1.43,2.14-1.49,3.24c-0.21,4.27-0.19,8.56-0.19,12.84 c-0.01,51.9,0.01,103.81-0.05,155.71c0,4.36-0.54,8.71-0.84,13.06c-0.03,0.34-0.19,0.66-0.31,0.98c-0.25,0.69-0.73,1.36-0.74,2.05 c-0.12,5.68-0.07,11.36-0.23,17.03c-0.11,3.65-0.78,7.31-0.68,10.95c0.12,4.59-0.27,9.16,0.58,13.82 c0.85,4.63,0.19,9.53,0.21,14.31c0.01,1-0.27,2.32,0.24,2.92c1.2,1.39,0.69,2.89,0.79,4.35c0.03,0.33-0.22,0.7-0.37,1.03 c-0.25,0.55-0.55,1.06-0.76,1.62c-0.17,0.44-0.2,0.93-0.36,1.38c-0.47,1.36-0.97,2.72-1.45,4.08c-0.11,0.31-0.11,0.7-0.3,0.94 c-1.58,2-2.33,4.36-2.52,6.8c-0.23,3.07-0.06,6.17-0.08,9.26c-0.02,3.62,0.05,7.24,0.93,10.78c0.07,0.3,0.39,0.56,0.42,0.86 c0.13,1.29,0.2,2.59,0.29,3.88c-0.91,0.05-1.84,0.23-2.72,0.09c-0.66-0.1-1.24-0.71-1.91-0.9c-1.83-0.53-3.81,1.69-3.74,3.17 c0.1,2.16,0.3,4.33,1.59,6.15c1.14,1.6,2.44,3.09,3.73,4.57c1.18,1.36,2.64,2.45,2.25,4.66c-0.47,2.6-0.66,5.25-1.01,8.26 c-4.52,0.25-8.9,0.65-13.3,0.72c-8.65,0.13-17.32,0.08-25.98,0.13c-0.58,0-1.24-0.02-1.74,0.22c-1.03,0.49-1.92,1.28-2.97,1.7 c-1.85,0.75-3.77,1.31-5.65,1.96c-0.22,0.07-0.42,0.22-0.63,0.32c-1.16,0.57-2.28,1.38-3.51,1.64c-1.03,0.21-1.79,0.61-2.49,1.28 c-0.2,0.19-0.4,0.5-0.62,0.51c-1.14,0.08-2.03,0.39-2.85,1.34c-0.63,0.73-1.75,1.04-2.67,1.49c-1.72,0.84-3.48,1.61-5.18,2.49 c-1.48,0.77-3.04,1.49-4.33,2.53c-1.49,1.21-2.68,2.8-4.09,4.14c-0.84,0.79-1.75,1.75-2.79,2.02c-1.46,0.39-2.97,0.34-4.52,0.83 c-2.05,0.64-4.39,0.08-6.57,0.95c-1.38,0.54-3.25-0.48-4.4,1.21c-0.07,0.1-0.38,0.03-0.58,0.05c-2.5,0.25-4.95-0.04-7.53,0.73 c-3.19,0.97-6.74,0.74-10.14,1.08c-0.59,0.06-1.36,0.23-1.7,0.63c-0.83,1.02-0.42,3.75,0.69,4.4c0.91,0.54,2,0.82,3.05,1.07 c0.66,0.15,1.4-0.06,2.08,0.05c1.68,0.29,3.67-0.91,5.01,1.05c0.07,0.1,0.38,0.06,0.58,0.07c4.87,0.2,9.72,0.09,14.61,0.8 c4.38,0.64,8.94-0.01,13.42,0.18c3.03,0.13,5.86-0.88,8.82-1.09c0.14-0.01,0.35-0.06,0.4-0.15c0.61-1.3,1.84-0.85,2.85-1.06 c0.57-0.11,1.2-0.3,1.65-0.65c0.83-0.64,1.45-1.63,2.35-2.1c2.5-1.32,4.56-3.31,7.19-4.45c1-0.43,1.58-0.43,2.51,0.04 c0.62,0.31,1.68,0.25,2.33-0.08c1.06-0.53,1.88-0.64,2.74,0.22c0.76,0.76,1.53,1.51,2.34,2.23c1.14,1.02,2.41,1.91,3.46,3.02 c1.04,1.08,1.85,2.38,2.78,3.56c1.11,1.4,4.49,1.72,5.94,0.58c1.29-1.01,1.57-2.52,1.85-3.97c0.24-1.24,0.03-2.49,0.68-3.78 c0.9-1.75,1.39-2.39,3.41-2.36c2.29,0.02,4.58,0.1,6.87,0.11c1.04,0.01,1.62,0.52,1.84,1.5c0.31,1.31,0.45,2.68,0.96,3.9 c0.36,0.85,1.11,1.71,1.91,2.16c1.23,0.7,4.69-0.66,5.09-2.01c0.53-1.73,1.15-3.6,1-5.35c-0.24-2.82,1.44-4.54,2.89-6.43 c0.3-0.39,1.44-0.68,1.72-0.45c1.45,1.23,3.45,2.17,3.18,4.62c-0.06,0.64,0.09,1.3,0.02,1.94c-0.31,3.01-0.68,6.01-0.98,9.02 c-0.08,0.86-0.01,1.74-0.01,2.77c1.08-0.07,1.88-0.05,2.64-0.18c1.12-0.2,2.2-0.62,3.32-0.73c1.38-0.13,2.78-0.05,4.18-0.04 c1.86,0.01,2.13,0.24,1.82,2.07c-0.17,1-0.42,2.39-1.12,2.8c-1.1,0.65-0.86,1.44-0.87,2.24c-0.05,2.1-0.03,4.19-0.01,6.28 c0.01,0.44,0,1.19,0.2,1.26c1.41,0.53,0.81,1.71,0.98,2.64c0.17,0.9,0.34,1.81,0.64,2.66c0.39,1.08-0.23,3.51-1.19,3.75 c-1.67,0.43-3.39,0.66-5.09,0.99c-1.84,0.36-3.67,0.72-5.5,1.11c-0.22,0.05-0.4,0.28-0.61,0.39c-0.43,0.23-0.85,0.56-1.3,0.63 c-0.594,0.081-1.208,0.05-1.82,0.036c-1.386-0.033-2.643-0.905-3.075-2.222c-0.613-1.87-0.822-3.704-0.936-5.614 c-0.03-0.33-0.6-0.59-0.79-0.96c-0.43-0.85-1.13-1.77-1.07-2.62c0.07-0.98,1.05-1.44,2.19-1.38c0.81,0.04,1.64-0.21,2.44-0.43 c0.59-0.16,1.12-0.55,1.72-0.69c0.52-0.12,1.09-0.06,1.63-0.02c1.25,0.08,1.8-0.43,1.76-1.72c-0.05-1.89,0.01-3.78-0.01-5.68 c-0.01-1.66-0.83-2.55-2.56-2.57c-3.84-0.04-7.67-0.02-11.5,0.02c-1.16,0.01-1.74,0.7-1.85,1.83c-0.05,0.54-0.08,1.09-0.24,1.6 c-0.48,1.6-1.38,3.17-1.45,4.78c-0.08,1.83-0.74,3.01-2.08,4.1c-0.83,0.67-1.56,0.79-2.23,0.04c-1.08-1.22-2.09-2.51-3.04-3.83 c-1.06-1.48-1.88-3.17-3.08-4.51c-0.91-1.03-1.92-2.41-3.7-1.84c-0.51,0.17-0.93,0.69-1.44,0.79c-2.58,0.46-4.33,2.33-6.35,3.7 c-2.13,1.45-4.2,2.53-6.93,2.33c-3.17-0.24-6.37-0.07-9.55-0.09c-0.4,0-0.93,0.1-1.16-0.1c-1.75-1.51-4.32-2.07-5.29-4.5 c-0.06-0.13-0.33-0.24-0.5-0.25c-2.1-0.1-3.95-1.56-6.16-1.07c-0.31,0.07-0.68-0.08-1.02-0.17c-0.9-0.25-1.8-0.73-2.71-0.75 c-4.62-0.08-9.25-0.03-13.88-0.05c-0.46,0-0.94-0.13-1.38-0.29c-0.63-0.24-1.23-0.8-1.85-0.81c-6.97-0.06-13.94-0.01-20.91-0.06 c-1.47-0.01-2.4,0.9-3.11,1.81c-1.58,2.02,0.43,5.8,3.19,6.29c1.71,0.31,3.41,0.64,5.12,0.96c0.19,0.04,0.49,0.05,0.55,0.17 c0.65,1.18,1.78,0.83,2.77,0.94c2.9,0.31,5.78,0.66,8.67,1c0.103,0.019,0.206,0.038,0.308,0.057c2.154,0.545,4.296,1.193,6.481,1.6 c1.241,0.232,2.507,0.15,3.769,0.183c0.284,0.007,0.568,0.119,0.821,0.24c0.62,0.28,1.22,0.6,1.83,0.9 c1.33,0.65,2.68,1.25,3.98,1.96c0.4,0.22,0.6,0.76,0.96,1.06c1.45,1.23,2.93,2.41,4.37,3.64c0.97,0.82,1.92,1.67,2.84,2.54 c1.98,1.86,3.98,3.71,5.89,5.64c1.72,1.72,3.46,3.45,4.97,5.36c1.54,1.93,3.34,2.52,5.79,2.51c18.47-0.08,36.94-0.01,55.4,0.02 c2.17,0,4.19,0.14,5.7-2.14c1.09-1.64,2.99-2.73,4.39-4.2c0.74-0.77,1.1-1.87,1.77-2.73c0.68-0.88,1.47-1.69,2.3-2.45 c1.56-1.45,2.81-3.12,3.91-4.94c0.46-0.76,1.51-1.22,1.86-2.01c0.76-1.74,1.56-3.38,3.08-4.61c0.42-0.34,0.88-0.97,0.86-1.44 c-0.08-1.47,0.99-2.28,1.57-3.39c0.75-1.42,1.61-2.73,1.52-4.59c-0.21-4.42-0.08-8.86-0.05-13.29c0-0.61,0.19-1.23,0.35-1.83 c0.14-0.49,0.55-0.98,0.49-1.43c-0.39-3,0.95-5.77,1.1-8.7c0.01-0.2,0.23-0.39,0.34-0.59c0.26-0.47,0.56-0.92,0.78-1.41 c0.59-1.37,1.1-2.77,1.75-4.11c0.19-0.39,0.85-0.54,1.1-0.93c1.25-1.87,2.56-3.71,3.58-5.7c0.73-1.41,1.8-2.83,1.37-4.6 c-0.1-0.41-0.44-1.03-0.73-1.07c-2.3-0.28-4.43-1.46-6.87-1.09c-1.41,0.21-2.88,0.03-4.32,0.03c-2.22,0-2.56-0.51-2.76-2.74 c-0.2-2.19,1.03-4.66-1.1-6.53c-0.08-0.07-0.02-0.29-0.04-0.44c-0.26-2.65,0.17-5.27-0.75-7.99c-0.82-2.44,0.02-5.23-0.93-7.92 c-0.87-2.51,0.15-5.31-1.06-8.11c-1.14-2.64-0.76-5.92-1.16-8.91c-0.31-2.31,0.38-4.77-0.96-6.94c-0.31-0.5-0.91-0.93-1-1.46 c-0.41-2.24-0.68-4.5-1.01-6.76c-0.32-2.2-0.65-4.4-0.99-6.6c-0.03-0.19-0.09-0.47-0.23-0.53c-1.21-0.55-0.86-1.61-0.88-2.55 c-0.25-12.95,0.26-25.89-0.76-38.84c-0.645-8.159-0.207-16.407-0.21-24.606c0-0.326,0.03-0.655,0.132-0.964 c0.498-1.505,1.628-2.909,1.808-4.439c0.32-2.74,0.57-5.52,0.82-8.26c0.521-5.744,0.168-11.569,0.15-17.363 c-0.001-0.411-0.054-0.823-0.201-1.207c-0.519-1.358-1.356-2.643-1.619-4.039c-0.5-2.67-0.7-5.39-1.02-8.09 c-0.04-0.39-0.08-0.79-0.07-1.19c0.07-3.15-0.3-6.32,0.69-9.42c0.41-1.29-0.17-2.87,1.22-3.88c0.1-0.07,0.06-0.37,0.06-0.57 c0.04-8.32,0.08-16.64,0.08-24.96c0-0.43-0.28-0.88-0.45-1.31c-0.19-0.46-0.56-0.9-0.58-1.36c-0.48-11.05,0.53-22.1-0.75-33.17 c-0.77-6.68-0.15-13.52-0.19-20.29c-0.02-4.13-0.15-8.26-0.15-12.39c-0.01-44.063-0.01-88.115,0-132.178 c0-0.883,0.011-1.77,0.117-2.647c0.323-2.687-0.394-5.417,0.813-8.095c0.54-1.2,0.09-2.85,0.14-4.29c0.01-0.42,0.12-0.86,0.28-1.25 c0.26-0.62,0.63-1.2,0.88-1.82c0.14-0.36,0.1-0.78,0.19-1.16c0.48-2.02,1-4.03,1.44-6.05c0.25-1.17-0.47-2.63,1.09-3.39 c0.11-0.05,0.1-0.36,0.11-0.56c0.28-4.51,0.31-9,0.88-13.53c0.7-5.49,0.44-11.15,0.13-16.71c-0.31-5.55,1.18-10.95,0.94-16.46 c-0.02-0.62,0-1.25,0-1.92c0.98-0.1,1.74-0.1,2.45-0.27c0.7-0.17,1.35-0.53,2.03-0.75c1.92-0.62,2.45-1.33,2.42-3.39 c0-0.43-0.07-0.86-0.12-1.48h-4.97c-1.98-0.01-2.64-0.7-2.65-2.73c-0.01-0.75,0.05-1.5-0.01-2.25c-0.53-6.86,1.3-13.97-2.06-20.55 c0.49-2.24-1.35-4.79,0.96-6.8c1.23-1.08,2.27-2.42,3.62-3.33c1.23-0.83,2.52-1.47,3.3-2.84c0.8-1.42,2.89-2.31,4.31-1.95 c1.05,0.28,2.12,0.53,3.13,0.92c2.26,0.86,4.46,1.89,6.75,2.65c0.94,0.32,2.23,0.47,3.05,0.06c1.77-0.89,2.89-2.77,3.34-4.51 c0.76-2.92,0-5.91-1.12-8.69c-0.5-1.24-0.4-1.92,0.76-2.43c1.71-0.75,3.37-1.59,5.07-2.37c2.07-0.95,3.93-2.43,6.34-2.56 c0.29-0.02,0.55-0.33,0.84-0.5c0.37-0.23,0.78-0.65,1.14-0.63c1.59,0.13,3.06-0.23,4.74,0.92c1.61,1.11,4.13,0.99,6.27,1.19 c1.93,0.17,2.82-0.82,3-2.78c0.04-0.43,0.26-0.88,0.47-1.28c0.39-0.75,1.16-1.46,1.2-2.22c0.07-1.42,0.75-3-1.6-3.85 c-1.72-0.61-2.93-2.52-4.52-3.62c-1.38-0.96-2.98-1.6-4.73-2.51c0.24-0.6,0.46-1.24,0.75-1.85c0.82-1.72,1.67-3.42,2.49-5.13 c0.34-0.73,0.5-1.6,1.01-2.17c1.42-1.63,1.98-3.64,2.79-5.55c0.36-0.87,0.45-1.99,1.06-2.59c1.09-1.06,1.52-2.34,1.98-3.69 c0.29-0.85,0.66-1.68,1.09-2.46c0.51-0.93,1.33-1.73,1.67-2.7c0.81-2.39,2.14-3.18,4.45-2.38c0.31,0.1,0.7,0.11,1.03,0.04 c1.17-0.22,2.36-0.41,3.5-0.76c1.24-0.38,2.44-0.9,3.62-1.43c0.21-0.08,0.37-0.5,0.37-0.77 C217.026,126.28,217.017,124.66,217.017,123.52z M143.507,186.1c-0.82,0.65-1.72,0.95-2.7,1.06c-9.15,3.4-19.04,5.26-29.37,5.26 c-46.57,0-84.32-37.75-84.32-84.32c0-46.56,37.75-84.31,84.32-84.31c46.56,0,84.31,37.75,84.31,84.31 C195.747,143.31,174.167,173.48,143.507,186.1z",
      "M214.327,133.65c-1.07-0.77-2.58-1.24-3.21-2.27c-2.25-3.6-6.31-7.65-5.88-11.05 c1.52-12.04-0.33-23.52-2.8-35.1c-1.17-5.49-2.18-10.99,4.72-14.06c1.08-0.48,1.88-3.13,1.63-4.57c-0.19-1.07-2.16-2.19-3.55-2.64 c-6.7-2.14-12.98-4.88-17.4-10.69c-8.86-11.65-19.24-21.69-32.64-27.85c-6.64-3.05-11.86-6.24-11.09-14.54 c0.07-0.78-0.31-1.64-0.64-2.4c-1.25-2.84-2.56-5.66-3.84-8.48c-2.09,2.6-4.15,5.23-6.27,7.81c-1.41,1.73-2.68,4.5-4.41,4.85 c-5.32,1.1-10.85,1.76-16.28,1.67c-10.63-0.18-20.99,1.14-30.97,4.67c-7.85,2.78-15.14,3.77-22.72-1.31 c-3.42-2.29-8.09-2.69-13.48-4.35c1.1,3.41,1.68,5.25,2.3,7.08c2.66,7.87,2.9,14.94-4.11,21.28c-9.76,8.83-16.78,19.74-21.74,31.96 c-3.43,8.43-7.09,16.77-10.4,25.25c-0.69,1.77-0.76,4.07-0.31,5.93c1.61,6.58,3.4,13.13,5.43,19.59c3.09,9.77,5.6,19.86,9.93,29.08 c3.68,7.83,9.58,14.63,14.68,22.14c-0.79,0.96-2.1,2.1-2.8,3.53c-1.36,2.82-2.37,5.81-3.53,8.72c3.12,0.11,6.55,1.11,9.29,0.15 c8.09-2.86,14.4-0.35,20.54,4.73c2.39,1.98,2.05,3.36,0.46,5.32c-5.83,7.15-10.71,15.15-18.99,20.06 c-0.98,0.57-0.82,3.05-1.18,4.65c1.4,0.24,3.08,1.12,4.16,0.63c10.45-4.67,20.76-9.67,31.2-14.38c6.31-2.84,12.43-5.88,19.84-5.85 c10.42,0.05,20.84-1.07,31.26-1.7c1.76-0.11,3.51-0.28,5.42-0.43c0.16,1.54,0.36,2.51,0.36,3.49 c-0.02,59.51,0.09,119.02-0.28,178.52c-0.04,6.76-2.01,13.66-6.63,19.46c-5.78,7.26-11.13,14.88-16.46,22.49 c-0.72,1.03-0.2,2.93-0.26,4.43c1.3-0.02,2.66,0.24,3.87-0.09c5.76-1.56,11.47-3.28,18.14-5.22c0.62,6.25,1.49,10.98,1.5,15.73 c0.13,47,0.21,94.01,0.09,141.01c-0.02,9.45-0.81,18.9-1.43,28.34c-0.51,7.62-1.87,15.22-1.81,22.82 c0.09,11.27,1.35,22.52,1.59,33.8c0.11,4.87-1.07,9.77-1.69,14.65c-0.95,7.5-2.36,14.98-2.73,22.51c-0.3,6.1,1.55,12.38,0.78,18.37 c-0.97,7.49-5.01,14.53-11.46,18.32c-5.29,3.13-12.04,4.52-18.29,5.09c-7.23,0.66-14.61-0.47-21.92-0.75 c-7.56-0.29-13.36-5.01-15.18-12.31c-0.24-0.97-0.97-2.04-1.79-2.6c-3.54-2.44-7.19-4.7-11.02-7.17 c-6.83,8.88-7.82,11.33-7.65,21.13c0.27,15.78,1.28,31.58,0.87,47.34c-0.19,7.12-0.36,13.84,2.91,20.27 c0.57,1.13,1.4,2.86,2.29,2.97c6.4,0.82,12.69,3.55,19.18-1.16c3.35-2.42,8.23-3.21,12.54-3.72c7.41-0.88,14.92-0.84,22.37-1.43 c4.08-0.32,7.49-1.9,7.64-6.78c0.16-4.95,2.49-7.46,7.41-7.25c1.26,3.22,2.35,6.35,3.73,9.34c0.48,1.05,1.56,2.34,2.55,2.54 c3.24,0.62,6.57,0.74,9.86,1.16c3.38,0.42,5.09-0.92,6.01-4.3c1.78-6.56,3.92-13.02,6.08-19.47c1.92-5.71,2.31-11.28-0.26-16.93 c-0.69-1.51-0.6-3.37-1.02-5.99c2.46,0.64,3.97,1.18,5.52,1.41c2.3,0.33,4.62,0.44,6.93,0.65c-0.07-2.7,0.5-5.64-0.37-8.06 c-1.39-3.88-4.05-7.3-5.6-11.14c-2.34-5.79-5.86-11.75-5.96-17.69c-0.58-35.66-0.34-71.34-0.33-107.01c0-1.81,0.12-3.68,0.57-5.42 c3.38-13.1,3.56-26.5,1.68-39.63c-1.53-10.75-1.54-20.97,1.15-31.44c1.09-4.23,1.29-8.84,1.02-13.23 c-1.21-19.88-3.7-39.73-3.94-59.61c-0.62-50.99-0.29-102-0.34-153.01c0-1.66-0.07-3.35,0.18-4.98c1.91-12.43,4.96-24.78,5.62-37.26 c1.28-24.01,3.36-48.15-1.87-72.06c-0.27-1.25,0.73-3.34,1.8-4.23c9.73-8.05,9.78-8,20.31-1.11c0.7,0.46,1.39,1.05,2.17,1.23 c2.36,0.55,6.51,1.85,6.85,1.21c1.35-2.54,2.6-5.99,1.92-8.6c-2.38-9.22-2.43-17.78,3.82-25.59c2.88-3.6,5.07-8.11,8.66-10.71 c4.75-3.45,10.65-5.28,15.88-8.13c2.41-1.3,5.32-2.92,6.4-5.17C220.707,136.36,216.637,135.31,214.327,133.65z M111.437,192.42 c-46.57,0-84.32-37.75-84.32-84.32c0-46.56,37.75-84.31,84.32-84.31c46.56,0,84.31,37.75,84.31,84.31 C195.747,154.67,157.997,192.42,111.437,192.42z",
      "M216.086,109.69c-0.08-0.48,0.02-1-0.02-1.5c-0.07-0.95,0.16-2.22-0.36-2.76 c-0.73-0.76-2.03-0.97-3.07-1.46c-0.63-0.3-1.24-0.67-1.83-1.05c-0.53-0.33-1.08-0.65-1.53-1.07c-0.8-0.74-1.92-0.81-2.57-2.09 c-1.13-2.22-0.49-4.7-1.75-6.94c-1-1.8,0.07-4.32-0.91-6.51c-0.3-0.67,0.89-2,1.37-3.04c0.65-1.39,2.31-2.03,2.57-3.75 c0.12-0.81,0.64-1.61,1.15-2.28c1.78-2.38,1.16-5.33-1.31-6.02c-1.49-0.42-2.55-1.16-3.72-2.06c-1.21-0.92-2.77-1.49-4.25-1.92 c-1.54-0.44-2.15-1.61-2.84-2.79c-0.59-1.02-1.09-2.11-1.76-3.08c-0.71-1.02-1.59-1.93-2.47-2.98c0.35-0.13,0.74-0.16,0.86-0.35 c1.27-2.02,3.25-2,5.28-1.95c1.15,0.02,2.4,0.21,3.44-0.16c1.28-0.45,2.71-1.16,3.49-2.19c1.24-1.65-0.42-4.48-2.46-4.74 c-1.98-0.25-3.94-0.58-5.91-0.89c-0.18-0.03-0.34-0.15-0.51-0.22c-0.77-0.33-1.52-0.72-2.32-0.95c-0.57-0.16-1.22,0.01-1.79-0.13 c-2.14-0.53-4.24-1.43-6.41-1.61c-1.69-0.14-2.87-0.66-4.02-1.8c-1.28-1.26-2.82-2.26-4.1-3.52c-0.3-0.29-0.23-1.24,0-1.73 c0.44-0.91,1.54-0.97,2.32-1.44c1.74-1.05,3.29-2.45,4.89-3.74c0.52-0.42,1.31-0.9,1.38-1.42c0.19-1.46,0.06-2.96,0.06-4.5 c-2.54-0.33-4.95-0.67-7.38-0.94c-0.89-0.1-1.81-0.01-2.71-0.03c-0.34-0.01-0.68-0.07-1.01-0.16c-0.89-0.23-1.76-0.69-2.64-0.7 c-4.02-0.08-8.04-0.03-12.07-0.05c-0.42,0-1.11,0-1.23-0.23c-1.12-2.09-3.02-1.96-4.92-1.88c-1.14,0.04-1.8-0.46-2.06-1.62 c-0.27-1.22-0.34-2.76-1.12-3.54c-1.17-1.16-0.68-2.45-1.05-3.64c-0.33-1.08-0.81-2.76-1.52-2.93c-2.01-0.5-4.21-0.87-6.23,0.31 c-0.93,0.54-1.88,1.05-2.87,1.44c-1.21,0.48-2.61,0.61-3.7,1.27c-1.77,1.08-3.79,0.89-5.3,0.34c-1.38-0.5-2.66-0.56-4-0.68 c-0.75-0.06-1.5-0.02-2.23-0.16c-0.94-0.18-1.87-0.77-2.76-0.69c-1.9,0.18-3.03-0.91-3.97-2.14c-1.29-1.72-2.14-3.79-3.53-5.41 c-1.31-1.54-1.8-3.71-3.74-4.73c-0.49-0.26-0.96-0.67-1.48-0.73c-0.94-0.12-1.92-0.14-2.85,0c-0.59,0.08-1.26,0.41-1.66,0.85 c-0.55,0.59-0.75,1.49-1.3,2.07c-1.44,1.55-2.99,3-4.48,4.5c-0.13,0.12-0.12,0.38-0.22,0.55c-0.46,0.75-0.9,1.52-1.42,2.22 c-0.5,0.67-1.12,1.24-1.62,1.91c-0.48,0.62-0.79,1.38-1.31,1.96c-1.39,1.54-3.54,0.54-5.35,1.73c-2.13,1.39-5.14,1.6-7.81,1.92 c-2.43,0.29-4.97,0.32-7.37-0.06c-1.44-0.23-2.84-1.32-4.04-2.3c-1.44-1.18-2.57-2.71-4.77-2.47c-0.61,0.06-1.27-0.43-2.23-0.78 c-0.27,0.91-0.79,1.91-0.83,2.92c-0.13,3.22-0.1,6.44-0.1,9.66c0,0.72-0.13,1.16-0.84,1.66c-1.79,1.24-3.39,2.74-5.12,4.08 c-0.33,0.26-0.9,0.26-1.36,0.33c-0.69,0.1-1.75-0.09-2.02,0.28c-0.84,1.21-1.97,0.84-3.05,0.96c-0.53,0.06-1.05,0.27-1.56,0.43 c-1.41,0.44-2.79,0.98-4.23,1.32c-1.4,0.33-3.13-0.6-4.16,1.16c-0.06,0.1-0.38,0.07-0.58,0.08c-1.15,0.07-2.3,0.17-3.45,0.2 c-2.18,0.07-2.94,0.91-2.47,2.97c0.12,0.55,0.55,1.09,0.97,1.51c0.85,0.82,1.83,1.51,2.67,2.35c1.09,1.09,2.1,2.27,2.99,3.24 c-0.99,1.5-1.8,2.84-2.73,4.09c-0.62,0.83-1.51,1.47-2.09,2.32c-1.11,1.6-2.09,3.3-3.12,4.96c-0.31,0.5-0.73,0.96-0.93,1.51 c-0.5,1.33-2.38,2.73-3.8,2.76c-1.15,0.03-2.49-0.24-3.4,0.26c-1.3,0.71-2.55,0.65-3.86,0.66c-2.14,0.01-4.03,0.57-5.36,2.35 c-0.3,0.41-0.32,1.02-0.56,1.48c-0.7,1.31-0.46,3.54,0.67,4.44c0.88,0.71,1.97,1.17,2.86,1.87c0.75,0.58,1.24,1.6,2.06,1.97 c1.26,0.57,1.85,1.38,1.54,2.64c-0.41,1.68,0.4,3.44-0.77,5.14c-0.67,1,0.34,2.85-1.26,3.76c-0.08,0.04-0.05,0.28-0.06,0.43 c-0.07,1.2-0.32,2.3-0.72,3.49c-0.69,2.08-1.06,4.24-2.44,6.06c-1.06,1.41-1.99,2.97-2.99,4.37c-1.47,2.05-3.91,3.38-5.93,5.04 c-0.77,0.63-1.44,1.4-2.26,1.94c-2.24,1.47-2.4,4.44-0.52,6.31c1.02,1.02,2.11,0.63,3.19,0.81c0.52,0.08,1.08,0.08,1.56,0.28 c1.37,0.58,2.71,1.21,4.05,1.87c0.66,0.33,1.54,0.63,1.86,1.2c0.54,0.99,0.73,2.18,1.06,3.29c0.11,0.38,0.15,0.8,0.33,1.14 c0.54,0.96,1.26,1.84,1.67,2.85c1.1,2.69,0.84,5.73,2.18,8.41c0.66,1.31,0.76,2.91,1.15,4.37c0.3,1.13,0.34,2.53,1.05,3.3 c0.9,0.97,0.77,1.95,0.91,3c0.09,0.63,0.37,1.24,0.6,1.95c-0.55,0.45-1.38,0.87-1.82,1.55c-0.96,1.47-1.52,3.18-2.98,4.34 c-1.33,1.06-0.8,2.64-0.82,4.03c-0.02,1.27,1.61,3.18,2.84,3.32c3.02,0.36,6.04,0.64,9.06,0.96c0.33,0.04,0.81,0.04,0.95,0.24 c1,1.45,2.98,2.44,2.17,4.75c-0.11,0.31,0.39,0.78,0.39,1.18c0.02,1.32,0.11,2.68-0.17,3.95c-0.22,1.01-1.1,1.86-1.41,2.87 c-0.54,1.71,0.41,3.02,1.55,4.15c1.28,1.27,1.94,1.24,3.66,0.26c0.96-0.55,1.99-1.12,3.06-1.32c1.94-0.35,3.1,1.4,4.64,2.13 c1.17,0.55,2.17,1.43,3.34,1.98c1.51,0.72,3.1,1.19,4.05,2.8c0.33,0.57,1.26,0.78,1.9,1.19c0.6,0.38,1.4,0.7,1.69,1.26 c0.51,1.03,0.69,2.23,1.05,3.34c0.14,0.4,0.35,0.83,0.65,1.11c0.69,0.66,0.82,3.4,0.13,4.02c-1.03,0.92-1,1.59,0.01,2.49 c0.82,0.73,1.45,1.79,2.39,2.23c0.75,0.36,1.85,0.05,2.78-0.07c0.31-0.04,0.58-0.53,0.9-0.55c3.1-0.24,5.89-1.34,8.58-2.84 c0.3-0.16,0.95-0.17,1.14,0.03c0.76,0.82,2.02,1.28,1.69,2.88c-0.33,1.67,0.2,3.38-1.17,4.99c-1.23,1.45-2.01,3.39-2.64,5.23 c-0.38,1.12-0.54,2.67-0.05,3.67c1.2,2.45,4.7,2.61,6.65,0.57c0.81-0.86,1.69-1.67,2.6-2.42c0.67-0.55,1.47-0.95,2.18-1.46 c0.32-0.22,0.58-0.52,0.85-0.79c0.92-0.91,1.79-1.88,3.23-1.91c0.07-0.01,0.12-0.25,0.21-0.36c0.47-0.55,0.87-1.23,1.45-1.62 c1.52-1.02,3.11-1.93,4.71-2.83c0.26-0.15,0.74-0.13,1.03,0.01c0.92,0.44,2.1,0.77,2.65,1.53c1.27,1.72,2.45,3.58,3.25,5.55 c0.83,2.06,3.35,3.48,5.17,2.57c1.67-0.83,2.63-2.52,4.53-3.18c1.48-0.51,2.62-2,3.93-3.03c0.29-0.22,0.64-0.44,0.98-0.49 c2.46-0.4,4.93-0.75,7.39-1.13c0.2-0.03,0.4-0.06,0.58-0.14c2.21-1.02,3.32-0.31,3.32,2.12c0,14.19-0.05,28.38,0.05,42.57 c0.01,1.86-0.96,2.7-2.18,3.62c-1.74,1.29-3.51,2.55-5.17,3.94c-1.03,0.85-1.73,2.36-2.86,2.77c-2.07,0.74-3.5,2.3-5.3,3.36 c-0.78,0.46-2.38,1.3-1.52,2.46c0.73,0.98,1.51,2.42,3.29,2.29c1.75-0.12,3.52-0.01,5.28,0.04c0.36,0.01,0.79,0.11,1.07,0.32 c0.62,0.47,1.08,1.3,1.76,1.51c2.45,0.76,2.94,2.75,3.4,4.84c0.09,0.38,0.22,0.9,0.49,1.05c1.71,0.98,1.74,2.53,1.65,4.2 c-0.06,1.3,0.03,2.61,0.03,3.92c0,29.84,0.04,59.67-0.06,89.5c-0.01,2.31,0.88,4.73-0.96,7.07c-0.87,1.09-0.54,3.2-0.94,4.86 c-0.58,2.45-0.57,4.95-2.05,7.23c-0.78,1.21-0.76,2.94-1.11,4.44c-0.34,1.49-0.68,2.98-1.03,4.46c-0.03,0.13-0.14,0.34-0.23,0.35 c-1.15,0.18-0.88,1.09-0.84,1.76c0.05,0.94-0.27,1.83,0.87,2.72c0.82,0.63,0.83,2.35,1.12,3.6c0.4,1.74,0.73,3.51,1.09,5.26 c0.03,0.15,0.05,0.32,0.13,0.42c1.29,1.52,1.66,3.35,1.96,5.25c0.2,1.27,0.59,2.51,0.92,3.76c0.03,0.12,0.2,0.2,0.26,0.33 c0.28,0.55,0.77,1.11,0.79,1.68c0.09,3.17,0.09,6.34,0.08,9.51c-0.01,53.22-0.02,106.45-0.08,159.68c0,1.51,0.78,3.34-1.06,4.47 c-0.08,0.05-0.06,0.29-0.07,0.43c-0.29,3.58-0.58,7.16-0.86,10.73c-0.32,4.15-0.63,8.3-0.97,12.45c-0.03,0.37-0.26,0.73-0.4,1.09 c-0.22,0.55-0.64,1.11-0.63,1.66c0.01,2.21,0.17,4.31,0.9,6.56c0.95,2.95,0.48,6.31,0.89,9.51c0.6,4.76,0.19,9.64,0.22,14.47 c0,0.5-0.1,1.11,0.14,1.48c1.42,2.19,0.48,4.57,0.54,6.84c0.04,1.47-0.44,2.98-0.84,4.43c-0.28,0.99-0.67,2.02-1.29,2.82 c-0.83,1.08-1.77,2.01-1.64,3.52c0.05,0.49,0.15,1.21-0.11,1.46c-1.13,1.09-0.65,2.44-0.83,3.69c-0.31,2.06,0.16,4.04-0.82,6.24 c-0.96,2.19-0.26,5.14-0.16,7.75c0.02,0.5,0.87,0.95,0.93,1.47c0.29,2.77-0.03,5.53,0.85,8.32c0.65,2.07,0.26,4.49,0.21,6.75 c-0.04,2.22,0.51,4.38,0.15,6.66c-0.41,2.56-0.2,5.21-0.29,7.83c-0.01,0.43-0.02,1.12-0.27,1.26c-1.4,0.77-2.83,1.57-4.34,2.04 c-1.7,0.53-3.51,0.72-5.26,1.07c-0.15,0.02-0.35,0.06-0.42,0.16c-1.05,1.6-2.96,1.06-4.42,1.69c-1.82,0.79-3.98,0.8-5.99,1.16 c-0.29,0.05-0.67,0.1-0.83,0.3c-1.07,1.37-2.9,1.4-4.18,1.54c-2.35,0.25-4.8-0.49-7.21-0.82c-0.14-0.02-0.32-0.1-0.39-0.21 c-1.13-1.76-2.78-0.72-4.19-0.71c-0.45,0-0.86,0.75-1.36,0.9c-1.49,0.44-3.02,0.74-4.53,1.14c-0.22,0.06-0.35,0.43-0.57,0.58 c-0.67,0.47-1.36,1.26-2.06,1.29c-3.56,0.13-7.14,0.07-10.71,0.04c-0.34,0-0.71-0.21-1.04-0.37c-0.54-0.26-1.05-0.56-1.58-0.84 c-0.82-0.43-1.69-0.79-2.43-1.32c-0.47-0.34-0.64-1.1-1.12-1.39c-1.87-1.14-3.1-2.75-4.11-4.66c-0.29-0.55-1.05-1.17-1.64-1.22 c-2.71-0.22-5.54-0.58-7.69,1.72c-0.83,0.9-1.8,1.06-2.92,1.04c-0.38,0-0.87,0.04-1.14,0.26c-1.57,1.29-3.5,1.51-5.38,1.82 c-2.39,0.39-4.78,0.67-7.17,1.02c-0.22,0.03-0.39,0.29-0.61,0.39c-1.11,0.5-2.2,1.26-3.35,1.41c-2.09,0.25-3.01,0.98-2.64,3.04 c0.19,1.07,0.64,2.49,1.43,2.95c1.21,0.72,2.83,0.7,4.26,1.06c1.65,0.43,3.28,0.93,4.92,1.42c1.01,0.3,2.01,0.63,3.03,0.92 c1.88,0.54,3.74,1.35,5.66,1.53c3.04,0.28,6.13,0.18,9.19,0.18c13.52,0.02,27.05,0,40.57,0.04c1.41,0.01,3.03-0.62,4.13,0.94 c0.1,0.14,0.48,0.07,0.73,0.09c5.48,0.4,11.03-0.61,16.46,0.99c1.95,0.58,4.05,0.68,6.11,1c0.07,1.26,0.61,2.47-0.7,3.3 c-0.85,0.54-1.65,1.22-2.57,1.58c-2.2,0.85-4.44,1.57-6.68,2.32c-0.99,0.34-2.02,0.59-3.01,0.94c-1.67,0.58-3.32,1.21-4.98,1.82 c-0.23,0.09-0.44,0.21-0.66,0.31c-0.53,0.24-1.04,0.64-1.58,0.69c-5.18,0.48-10.35-0.17-15.61,0.68 c-5.76,0.93-11.79-0.18-17.64,1.1c-0.82,0.18-1.73-0.09-2.55,0.08c-1.8,0.37-3.61,0.77-5.32,1.42c-0.58,0.21-1.08,1.13-1.26,1.82 c-0.66,2.45,1.02,5.29,4.03,5.07c1.83-0.13,3.72,0.54,5.59,0.87c0.12,0.02,0.22,0.18,0.34,0.24c0.72,0.31,1.43,0.85,2.17,0.88 c2.51,0.11,5.03,0.09,7.54,0.03c1.18-0.03,2.56,0.41,3.33-1.08c0.07-0.15,0.56-0.11,0.86-0.11c5.22,0.01,10.44,0.02,15.66,0.05 c0.34,0,0.79,0,1,0.19c1.32,1.25,2.86,1.82,4.67,1.79c1.63-0.02,3.26,0.01,4.6,1.25c0.06,0.99-0.12,1.83-1.41,1.95 c-0.23,0.02-0.46,0.31-0.66,0.5c-1.32,1.33-2.56,2.77-3.99,3.98c-1.06,0.89-2.34,2.07-3.56,2.12c-2.5,0.1-4.06,2.03-6.3,2.6 c-1.31,0.34-2.46,1.45-3.98,1.52c-0.29,0.01-0.67,0.07-0.83,0.26c-1.11,1.31-2.62,1.66-4.2,1.76c-1.8,0.12-3.76-0.26-5.37,0.33 c-1.58,0.59-3.07,0.54-4.61,0.59c-1.96,0.05-3.92,0.02-5.88,0c-0.39,0-0.79-0.07-1.16-0.17c-0.83-0.22-1.64-0.59-2.48-0.71 c-2.61-0.36-5.24-0.64-7.85-0.96c-0.15-0.02-0.38-0.06-0.41-0.14c-0.54-1.36-1.74-0.98-2.71-0.99c-4.02-0.06-8.04-0.04-12.07-0.05 c-0.4,0-0.81,0-1.19-0.08c-1.18-0.25-2.34-0.57-3.51-0.81c-0.49-0.09-1.19,0.17-1.47-0.09c-1.49-1.32-3.25-0.64-4.88-0.82 c-0.45-0.05-1.2,0.06-1.3-0.14c-0.68-1.42-1.93-1.03-3.02-1.06c-2.06-0.05-5.27-2.58-6.24-4.39c-0.87-1.64-2.23-3.05-3.48-4.46 c-1.04-1.17-2.36-2.08-3.33-3.29c-0.87-1.07-1.16-2.84-2.21-3.49c-1.93-1.2-2.76-3.77-5.53-3.92c-0.11,0.08-0.58,0.28-0.75,0.63 c-0.28,0.54-0.63,1.29-0.45,1.77c0.48,1.3,1.57,2.45,1.78,3.76c0.36,2.21,2.01,3.73,2.59,5.88c0.45,1.67,1.26,3.48,2.41,5.08 c1.14,1.56,1.41,3.74,2.13,5.63c0.43,1.16,0.89,2.33,1.51,3.4c0.36,0.63,1.01,1.13,1.61,1.59c0.67,0.5,1.52,0.79,2.13,1.35 c0.78,0.7,1.25,1.83,2.11,2.32c1.81,1.02,4.06,1.07,5.77,2.38c0.07,0.06,0.21,0.06,0.3,0.04c2.43-0.53,4.36,1.08,6.06,2.12 c2,1.24,4.52,2.12,5.74,4.61c0.47,0.95,1.67,1.55,3.12,0.54c0.9-0.62,2.18-0.69,3.18-1.48c1.15-0.91,2.59-1.45,3.89-2.16 c0.34-0.18,0.65-0.55,0.97-0.56c2.21-0.07,4.53-0.5,6.59,0.05c1.65,0.44,3.29,0.44,4.91,0.75c3.34,0.63,6.68,1.23,10.11,1.01 c0.19-0.02,0.47-0.04,0.58,0.07c1.69,1.69,4.5-0.27,6.04,1.88c2.64-0.06,5.21,0.33,7.75,1.05c1.35,0.38,2.74,0.65,4.1,0.98 c0.13,0.03,0.21,0.2,0.34,0.27c1.18,0.58,2.33,1.28,3.57,1.7c1.36,0.47,2.81,0.68,4.22,1.01c0.12,0.03,0.22,0.16,0.34,0.24 c0.93,0.58,1.82,1.22,2.8,1.71c1.03,0.51,2.68,0.57,3.1,1.35c1.03,1.92,2.93,2.76,4.5,3.64c1.3,0.73,3.45,0.26,5.09-0.18 c0.46-0.12,0.44-2.05,0.6-3.16c0.06-0.34-0.03-0.71,0.02-1.05c0.29-1.88-1.12-3-1.84-4.46c-0.7-1.42-2.24-1.12-3.03-2.13 c-0.57-0.71-1.11-1.52-1.85-1.99c-1.99-1.26-4.2-2.07-5.98-3.79c-1.42-1.38-3.36-2.21-5.05-3.33c-0.53-0.36-0.97-0.86-1.6-1.43 c1.59-0.28,2.79-0.38,3.91-0.73c1.33-0.42,2.56-1.15,3.88-1.59c1.23-0.41,2.52-0.08,3.86-0.73c1.07-0.51,2.44-1.28,3.54-1.27 c4.9,0.06,9.87-1.42,14.74,0.77c1.85,0.84,4.1,0.89,6.19,1.08c2.2,0.2,4.42,0.08,6.63,0.19c1.39,0.07,2.87-0.36,3.15-1.52 c0.35-1.43-0.11-3.07-0.31-4.61c-0.05-0.35-0.43-0.86-0.75-0.94c-1.89-0.45-3.03-2.61-5.28-2.29c-0.29,0.05-0.76-0.44-0.98-0.79 c-0.55-0.87-1.04-1.78-1.46-2.72c-0.72-1.58-1.07-3.47-2.15-4.72c-1.03-1.21-1.01-2.65-1.64-3.91c-0.95-1.9,1.19-4.82,3.55-5.51 c1.64-0.47,2.56-1.92,3.11-3.23c0.56-1.3,1.48-2.16,2.47-2.65c1.95-1,3.13-2.23,2.85-4.48c-0.15-1.19,0.35-1.95,1.04-2.38 c1,0.29,1.75,0.57,2.54,0.71c0.68,0.12,1.65-0.21,2.05,0.15c1.42,1.25,3.06,0.73,4.59,0.79c1.64,0.07,2.82-1.17,2.72-2.83 c-0.14-2.32,0.71-4.76-1.17-6.9c-1.23-1.41-2.02-3.2-3.05-4.79c-0.22-0.34-0.72-0.52-0.87-0.87c-0.46-1.06-0.77-2.19-1.23-3.25 c-0.29-0.71-0.68-1.39-1.13-2.01c-1.1-1.56-2.04-3.14-1.53-5.37c1.49-0.04,2.78-0.09,3.89-1.32c1.1-1.21,1.2-2.49,1.25-3.92 c0.01-0.23,0.11-0.48,0.24-0.67c1.24-1.84,0.48-3.88,0.58-5.83c0.01-0.15-0.29-0.35-0.49-0.46c-1-0.56-2.03-1.05-3-1.64 c-0.5-0.3-0.84-0.89-1.35-1.13c-1-0.46-2.14-0.66-3.09-1.2c-0.51-0.28-0.94-1-1.07-1.59c-0.43-2.04-0.69-4.12-1.08-6.17 c-0.08-0.39-0.55-0.7-0.63-1.08c-0.19-0.93-0.56-2-0.26-2.78c0.2-0.56,1.73-1.24,2.07-1c1.34,0.91,2.76,0.55,4.13,0.75 c0.3,0.04,0.57,0.28,0.87,0.41c0.5,0.23,0.99,0.58,1.52,0.65c3.46,0.48,6.98-0.42,10.48,0.84c1.88,0.67,4.18,0.23,6.29,0.19 c0.47-0.01,1.28-0.37,1.34-0.69c0.2-1.06,0.29-2.2,0.09-3.25c-0.08-0.41-1.04-0.65-1.59-1c-0.18-0.12-0.3-0.34-0.49-0.47 c-1.59-1.12-3.47-1.86-4.58-3.59c-0.05-0.07-0.2-0.06-0.28-0.11c-0.71-0.43-1.45-0.81-2.11-1.31c-0.61-0.47-1.1-1.11-1.72-1.57 c-0.68-0.5-1.49-0.82-2.16-1.33c-0.65-0.49-1.14-1.21-1.81-1.67c-1.57-1.08-3.21-2.06-4.83-3.08c-0.55-0.35-1.1-0.73-1.69-1.01 c-0.82-0.38-1.8-0.53-2.49-1.06c-0.53-0.41-0.95-1.22-1.04-1.91c-0.29-2.18,0.44-4.47-0.96-6.53c-0.53-0.79-1.11-1.77-1.11-2.66 c-0.06-20.73-0.05-41.46-0.03-62.18c0-0.42,0.15-0.86,0.31-1.25c0.21-0.5,0.64-0.94,0.74-1.45c0.29-1.62,0.18-3.22,0.78-4.9 c0.83-2.34,0.88-4.99,1.09-7.52c0.17-1.95,0.05-3.92,0.11-5.88c0.01-0.47,0.2-0.93,0.37-1.38c0.2-0.51,0.68-0.99,0.69-1.49 c0.05-4.08,0.04-8.15,0.01-12.23c0-0.48-0.04-1.25-0.32-1.39c-0.99-0.49-0.7-1.33-0.78-2.08c-0.35-3.05-0.31-6.21-1.2-9.09 c-0.7-2.29-0.69-4.49-0.62-6.72c0.12-3.64-0.46-7.31,0.67-10.95c0.71-2.26,0.78-4.71,1.14-7.07c0.04-0.24,0.05-0.53,0.19-0.72 c1.27-1.67,1.08-3.79,1.66-5.67c0.44-1.39,0.1-3,0.26-4.5c0.1-0.93,0.2-2.16,0.8-2.68c1.42-1.23,1.05-2.71,1.11-4.18 c0.02-0.75,0.08-1.5,0.08-2.26c0-7.94,0-15.89-0.03-23.84c0-0.4-0.25-0.81-0.42-1.2c-0.21-0.5-0.6-0.97-0.64-1.48 c-0.1-1.3,0.06-2.63-0.09-3.92c-0.13-1.03-0.9-2.06-0.78-3.02c0.31-2.47-0.9-4.62-1.12-6.95c-0.02-0.22-0.23-0.41-0.33-0.63 c-0.25-0.52-0.62-1.03-0.7-1.58c-0.19-1.34,0.04-2.8-0.39-4.03c-0.8-2.24-1.62-4.42-1.62-6.84c0.01-17.65,0.01-35.31,0.01-52.97 c0-0.35,0.01-0.7,0-1.05c-0.02-1.05,0.41-1.5,1.54-1.48c2.96,0.07,5.93,0.14,8.89-0.02c1.36-0.08,2.79-0.5,3.99-1.12 c0.75-0.39,1.46-1.39,1.62-2.23c0.27-1.36,0.17-2.82,0.01-4.2c-0.06-0.53-0.66-1.12-1.16-1.45c-0.95-0.62-2-1.08-3.02-1.6 c-0.99-0.5-1.96-1.06-2.98-1.47c-1.78-0.73-3.61-1.35-5.4-2.06c-0.43-0.18-0.73-0.7-1.16-0.84c-2.24-0.68-2.37-0.81-2.37-3.03 c0.01-25.61,0-51.21,0.02-76.82c0-3.07,0.14-6.13,0.21-9.2c0.01-0.24,0.02-0.5,0.07-0.74c0.27-1.22,0.63-2.42,0.81-3.66 c0.37-2.55,0.64-5.13,0.97-7.69c0.02-0.18,0.12-0.4,0.26-0.51c1.25-1.01,1.6-2.31,1.7-3.89c0.22-3.29,0.67-6.56,1.04-9.84 c0.02-0.18,0.11-0.47,0.23-0.51c1.12-0.39,0.81-1.36,0.9-2.16c0.05-0.55-0.08-1.13,0.06-1.65c0.48-1.75,1.32-3.45,1.53-5.23 c0.29-2.37,0.65-4.96-0.01-7.16c-0.63-2.1-0.45-4.08-0.64-6.11c-0.06-0.75,0.14-1.67-0.22-2.22c-1.07-1.62-0.53-3.36-0.68-5.04 c-0.04-0.45,0-0.91,0-1.36c-0.04-11.77-0.07-23.54-0.12-35.32c0-0.74,0.31-1.64-0.76-2.05c-0.18-0.07-0.26-0.51-0.3-0.79 c-0.28-1.71-0.53-3.42-0.79-5.13c-0.02-0.14-0.04-0.34,0.04-0.43c0.85-1.09,1.42-2.52,3.18-2.48c0.48,0.01,1.01-0.1,1.45-0.3 c1.93-0.87,3.83-1.82,5.76-2.7c0.91-0.41,1.88-0.69,2.8-1.06c0.79-0.32,1.87-0.46,2.28-1.06c1.04-1.51,2.94-0.65,4.08-1.75 c0.2-0.2,0.94-0.09,1.27,0.13c1.02,0.68,1.91,1.57,2.95,2.21c0.97,0.6,2.05,1.01,3.11,1.45c0.77,0.32,1.57,0.54,2.6,0.88 c0.08-0.06,0.43-0.5,0.88-0.68c1.99-0.8,2.28-1.19,2.32-3.33c0.02-0.8-0.16-2.05,0.24-2.3c1.05-0.65,0.8-1.53,0.84-2.37 c0.1-1.85,0.1-3.71,0.2-5.57c0.02-0.46,0.14-1,0.42-1.35c1.19-1.48,2.43-2.92,3.72-4.33c1.85-2.02,3.76-3.98,5.62-5.99 c1.2-1.3,2.41-2.58,3.51-3.96c0.91-1.15,2.34-1.82,2.73-3.48c0.22-0.96,1.04-1.77,1.58-2.66c1.01-1.68,2.08-3.34,2.99-5.07 c0.86-1.63,1.53-3.36,2.33-5.01c0.12-0.24,0.55-0.48,0.82-0.47c0.85,0.06,1.7,0.23,2.56,0.36c1.64-0.37,3.34-0.64,5.04-0.61 c2.2,0.04,4.18-0.16,5.25-2.55c-0.42-0.66-0.75-1.53-1.37-2.07c-1.26-1.13-2.64-2.08-2.54-4.07c0.02-0.43-0.29-0.97-0.6-1.32 c-0.98-1.09-1.88-2.23-2.27-3.68c-0.25-0.92-0.45-1.85-0.7-2.92c0.1-0.16,0.47-0.49,0.53-0.87c0.41-2.81,0.64-5.66,1.19-8.44 c0.36-1.78,1.14-3.48,1.81-5.19c0.13-0.33,0.58-0.58,0.92-0.78c1.21-0.7,2.72-1.11,3.58-2.1c0.87-1,1.89-1.43,2.93-2.05 C215.346,112.2,216.377,111.28,216.086,109.69z M111.437,192.42c-46.57,0-84.32-37.75-84.32-84.32c0-46.56,37.75-84.31,84.32-84.31 c46.56,0,84.31,37.75,84.31,84.31C195.747,154.67,157.997,192.42,111.437,192.42z",
      "M220.041,157.85c-0.55-1.59-1.99-2.91-3.19-4.22c-1.44-1.55-3.06-2.93-4.54-4.44 c-0.94-0.97-2.09-1.91-2.57-3.1c-0.71-1.75-2.03-2.69-3.39-3.77c-0.82-0.65-1.45-1.6-2.05-2.48c-0.5-0.74-0.65-1.96-1.31-2.31 c-1.12-0.62-0.92-1.41-0.84-2.26c0.08-0.9-0.07-2.1,0.44-2.6c0.78-0.78,0.7-1.59,0.82-2.45c0.08-0.56-0.1-1.25,0.16-1.69 c1.35-2.35-0.12-5.35,1.81-7.52c0.27-4.36,0.77-8.72,0.74-13.07c-0.02-4.6-0.55-9.19-0.86-13.78c-0.02-0.23-0.04-0.6-0.18-0.67 c-1.2-0.58-0.74-1.69-0.88-2.62c-0.3-2.03-0.62-4.06-0.94-6.09c-0.03-0.17-0.16-0.32-0.24-0.49c-0.24-0.54-0.6-1.06-0.69-1.62 c-0.13-0.75,0.01-1.54-0.06-2.3c-0.14-1.56,0.39-3.22-0.79-4.65c-0.22-0.28-0.2-1.14,0.05-1.36c1.19-1.08,1.96-2.58,3.68-3.18 c0.9-0.32,1.87-1.42,2.11-2.35c0.36-1.38,0.09-2.92,0.09-4.59c-1.73,0-3.3,0.02-4.87,0c-0.36-0.01-0.98-0.02-1.05-0.2 c-0.46-1.09-1.43-0.72-2.21-0.93c-0.6-0.16-1.47-0.3-1.69-0.73c-0.65-1.26-1.95-1.91-2.51-3.35c-0.54-1.39-1.94-2.48-3.06-3.6 c-1.57-1.58-3.29-3.01-4.82-4.63c-0.9-0.96-1.45-2.23-2.3-3.24c-1.37-1.63-3.13-2.84-3.93-5.04c-0.75-2.04-0.93-2.28,0.91-3.34 c1.13-0.65,2.46-1.26,3.14-2.27c0.61-0.91,1.38-1.33,2.18-1.58c1.22-0.36,1.87-1.27,2.04-2.22c0.26-1.52,0.07-3.12,0.07-4.65 c-0.7-0.18-1.53-0.16-1.73-0.5c-0.54-0.93-1.34-0.88-2.1-0.8c-2.26,0.22-4.43-0.1-6.81,0.91c-2.5,1.06-5.7,0.06-8.58,0.97 c-1.39,0.44-3.04,0.01-4.63-0.49c-1.72-0.54-3.23-1.39-4.81-2.12c-0.53-0.24-0.86-0.92-1.39-1.21c-1.65-0.91-3.34-1.75-5.03-2.58 c-1.13-0.55-2.27-1.12-3.46-1.5c-1.3-0.42-2.67-0.64-4.01-0.96c-0.12-0.03-0.2-0.18-0.32-0.25c-0.49-0.28-0.96-0.69-1.5-0.81 c-1.58-0.38-3.18-0.64-4.78-0.96c-0.14-0.02-0.31-0.04-0.39-0.13c-1.28-1.53-3.33-0.93-4.88-1.77c-0.54-0.3-1.16-0.25-1.76-0.8 c-0.74-0.69-1.95-0.86-2.95-1.27c-0.31-0.13-0.57-0.36-0.88-0.52c-1.82-0.91-2.44-3.41-4.85-3.63c-0.37-0.03-0.84-0.97-0.93-1.54 c-0.16-0.97-0.04-2-0.04-2.77c-1.29-1.4-2.71-1.66-4.31-1.5c-1.04,0.1-3.26,1.89-3.77,2.79c-0.68,1.21-0.49,3.06-2.5,3.4 c-0.54,0.1-1.02,0.85-1.41,1.39c-0.58,0.82-1.24,1.27-2.3,1.24c-2.01-0.06-4.03-0.04-6.04,0.02c-0.52,0.02-1.03,0.31-1.53,0.51 c-0.4,0.16-0.75,0.5-1.15,0.55c-3.09,0.4-6.2,0.74-9.3,1.11c-0.14,0.02-0.31,0.01-0.41,0.1c-1.74,1.46-4.05,1.26-6.01,1.52 c-2.02,0.27-3.57,1.32-5.4,1.82c-1.27,0.35-2.45,1.02-3.69,1.51c-2.06,0.82-4.13,1.61-6.2,2.4c-0.64,0.24-1.35,0.37-1.91,0.73 c-1.46,0.94-2.83,2.01-4.28,2.97c-1.07,0.72-2.2,1.37-3.31,2.04c-0.98,0.59-1.98,1.14-2.94,1.76c-0.49,0.32-0.89,0.79-1.38,1.11 c-0.56,0.35-1.41,0.47-1.71,0.95c-0.49,0.79-1.09,1.06-1.92,1.26c-0.56,0.14-1.09,0.61-1.52,1.04c-0.91,0.91-1.7,1.92-2.6,2.84 c-1.47,1.52-3.01,2.96-4.47,4.49c-1.04,1.1-1.94,2.34-2.99,3.42c-1.05,1.07-2.23,2.02-3.34,3.03c-0.16,0.15-0.42,0.34-0.42,0.49 c0.1,1.74-2.06,1.97-2.29,3.47c-1.95,0.29-1.67,2.42-2.79,3.49c-1.16,1.11-1.61,2.94-2.39,4.45c-0.36,0.68-0.62,1.51-1.17,1.98 c-0.96,0.81-1.45,1.74-1.52,2.96c-0.02,0.38-0.02,0.81-0.2,1.11c-0.84,1.45-1.74,2.87-2.62,4.29c-0.4,0.63-1.03,1.22-1.16,1.9 c-0.25,1.29-0.94,1.6-2.14,1.73c-2.53,0.27-5.17-0.85-7.62,0.97c-0.78,0.57-1.29,0.9-1.28,1.82c0.02,1.15,0.04,2.3,0.09,3.45 c0.01,0.28,0.02,0.64,0.18,0.82c0.91,1.01,1.87,1.99,2.82,2.97c0.3,0.31,0.66,0.56,0.92,0.89c0.54,0.7,0.91,1.58,1.57,2.11 c1.32,1.05,1.76,2.7,0.91,4.16c-0.19,0.32-0.31,0.7-0.37,1.07c-0.33,2.36-0.19,4.68-0.93,7.12c-1.04,3.39-0.76,7.19-0.99,10.82 c-0.084,1.3-0.028,2.609-0.004,3.91c0.006,0.347,0.042,0.913,0.113,1.253c0.215,1.031,0.607,2.038,0.712,3.077 c0.13,1.18,0.02,2.39,0.08,3.59c0.02,0.39,0.24,0.77,0.39,1.15c0.19,0.5,0.5,0.97,0.6,1.49c0.36,1.88,0.66,3.78,0.98,5.67 c0.02,0.14,0.04,0.36,0.12,0.39c1.31,0.58,0.79,1.78,0.95,2.74c0.08,0.47-0.04,1.09,0.21,1.4c1.07,1.27,0.76,2.98,1.64,4.41 c0.92,1.49,0.83,3.53,1.95,5.15c1.07,1.53,1.11,3.52,2.09,5.23c1.14,2,1.76,4.33,3.12,6.29c0.99,1.43,1.86,2.94,2.81,4.39 c0.43,0.64,1.05,1.17,1.38,1.86c0.32,0.66,0.52,1.46,0.46,2.17c-0.02,0.21-1.11,0.37-1.72,0.47c-0.89,0.14-2.03-0.1-2.64,0.37 c-1.27,0.99-2.58,1.6-4.16,1.75c-0.27,0.02-0.66,0.12-0.78,0.31c-0.74,1.2-2.18,0.94-3.19,1.62c-0.9,0.6-1.97,0.95-2.95,1.45 c-0.13,0.06-0.15,0.33-0.22,0.5c-0.29,0.61-0.57,1.22-0.88,1.88c0.22,0.14,0.66,0.26,0.73,0.49c0.44,1.56,1.62,1.71,2.95,1.69 c6-0.1,12,0.28,17.98-0.6c2.02-0.3,2.35-0.04,2.27,1.87c-0.01,0.33,0.33,0.65,0.42,1c0.28,1.08,0.93,2.18-0.3,3.18 c-0.72,0.59-1.28,1.39-1.97,2.04c-0.57,0.55-1.16,1.13-1.84,1.51c-1.53,0.85-3.29,1.33-4.37,2.87c-0.11,0.16-0.38,0.21-0.57,0.32 c-1.53,0.89-3.3,1.54-4.54,2.74c-1.67,1.63-4.03,1.83-5.72,3.3c-0.62,0.53-1.4,0.9-2.1,1.34c-0.35,0.22-0.68,0.57-1.05,0.64 c-1.67,0.33-2.61,1.81-2.12,3.47c0.38,1.29,2.05,1.63,3.29,1.08c1.5-0.67,2.83-2,4.72-1.6c0.23,0.05,0.48-0.03,0.71,0.01 c3.29,0.59,6.38-0.81,9.6-0.9c0.14,0,0.37-0.02,0.4-0.09c0.59-1.47,1.9-0.82,2.92-1.07c1.08-0.27,2.31-0.48,3.12-1.14 c1.34-1.1,3.01-1.42,4.43-1.52c2.07-0.14,3.55-1.64,5.54-1.71c0.53-0.02,1.04-0.3,1.55-0.46c0.45-0.14,0.92-0.22,1.33-0.43 c0.95-0.49,1.87-1.48,2.8-1.47c2.17,0.03,4.33,0.51,6.5,0.83c0.1,0.02,0.16,0.24,0.27,0.29c0.56,0.28,1.11,0.61,1.7,0.78 c1.28,0.37,2.98,0.25,3.8,1.06c1.41,1.37,3.24,0.88,4.73,1.73c0.92,0.53,2.42-0.25,3.25,1.05c0.11,0.17,0.55,0.21,0.82,0.18 c3.28-0.45,5.4,2.03,8.05,3.18c1.02,0.44,1.9,1.2,2.94,1.6c2.28,0.87,4.77,0.75,7.12,1.85c2.1,0.99,4.76,1.09,7.16,1.03 c6.72-0.19,13.49,0.95,20.17-0.71c1.13-0.28,2.39-0.08,3.58-0.17c0.39-0.02,0.78-0.21,1.15-0.37c0.47-0.21,0.91-0.6,1.39-0.67 c1.14-0.15,2.49,0.21,3.39-0.3c1.52-0.84,2.91-0.42,4.47-0.47c0.03,0.81,0.09,1.47,0.09,2.13v170.39c0,1.92,0.01,3.84-0.01,5.76 c0,0.42,0.03,1.13-0.17,1.22c-1.48,0.66-0.88,1.94-0.93,2.97c-0.1,1.67-0.15,3.36-0.02,5.03c0.14,1.95-0.76,4.1,1,5.79 c0.14,0.13,0.07,0.46,0.13,0.69c0.32,1.16,0.64,2.31,1,3.45c0.05,0.18,0.32,0.33,0.52,0.42c1.35,0.57,1.68,1.45,1.02,2.81 c-0.14,0.29-0.42,0.71-0.31,0.88c1.11,1.81,0.69,3.83,0.63,5.73c-0.1,2.98-0.59,5.94-0.76,8.93c-0.14,2.43-0.03,4.89-0.08,7.33 c-0.01,0.6,0.23,1.41-0.8,1.57c-0.12,0.02-0.28,0.37-0.29,0.57c-0.16,3.08-0.36,6.15-0.72,9.24c-0.59,4.97-0.21,10.05-0.21,15.09 c0,44.18,0.01,88.36,0,132.54c0,6.23-0.02,12.47-0.12,18.7c-0.03,1.37,0.13,2.67-0.79,4.12c-0.92,1.43-0.93,3.56-1.02,5.39 c-0.16,3.11-0.07,6.24-0.11,9.36c-0.01,0.51-0.02,1.4-0.24,1.47c-1.21,0.4-0.8,1.35-0.89,2.13c-0.08,0.62-0.03,1.28-0.26,1.84 c-1.03,2.54-0.86,5.31-0.25,7.71c0.44,1.74,0.41,3.39,0.61,5.08c0.09,0.71-0.17,1.75,0.22,2.08c1.12,0.97,0.85,2.16,0.86,3.3 c0.05,10.08,0.08,20.15,0.07,30.22c0,1.21,0.33,2.59-1.03,3.45c-0.18,0.11-0.18,0.53-0.24,0.8c-0.3,1.45-0.59,2.91-0.92,4.36 c-0.04,0.18-0.32,0.29-0.45,0.47c-0.23,0.34-0.53,0.68-0.61,1.06c-0.36,1.69-0.64,3.38-0.96,5.08c-0.02,0.13-0.03,0.36-0.11,0.39 c-1.37,0.57-0.82,1.77-0.87,2.73c-0.07,1.48,0.09,2.98-0.06,4.45c-0.07,0.64-0.56,1.58-1.07,1.74c-1.53,0.48-3.39-0.22-4.66,1.28 c-6.11,0.05-12.2-0.04-18.29,0.83c-3.57,0.51-7.27,0.09-10.91,0.11c-0.52,0-1.34-0.08-1.52,0.2c-0.88,1.4-2.2,0.79-3.34,0.85 c-1.68,0.09-3.36,0.01-5.03,0.03c-2.22,0.03-2.87,0.61-2.88,2.52c-0.01,1.74,1.56,3.66,3.06,3.67c2.44,0.02,4.89-0.03,7.33,0.03 c0.54,0.01,1.1,0.29,1.59,0.56c0.66,0.35,1.23,1.13,1.88,1.17c2.77,0.19,5.5,0.3,8.27,0.8c3.4,0.62,6.97,0.26,10.46,0.39 c1.31,0.04,2.77-0.51,3.81,0.86c0.13,0.16,0.55,0.11,0.83,0.16c1.98,0.31,3.97,0.57,5.93,0.94c1.09,0.21,2.13,0.61,3.19,0.93 c0.13,0.04,0.23,0.15,0.35,0.21c0.62,0.31,1.25,0.59,1.87,0.9c0.71,0.37,1.79,0.59,2.05,1.17c0.56,1.23,0.85,2.64,0.96,4.01 c0.19,2.53,0.15,5.07,0.25,7.61c0.01,0.38,0.22,0.77,0.39,1.12c0.21,0.43,0.67,0.83,0.68,1.24c0.06,2.54,0.03,5.08,0.03,8.02 c-1.66,0.18-3.24,0.45-4.82,0.5c-2.92,0.07-5.85,0-8.77,0.03c-0.79,0-1.59,0.13-2.49,0.22c0.04,1.62-0.73,3.04,0.83,4.49 c1.37,1.26,2.42,2.7,4.52,2.55c0.429-0.031,0.861,0.057,1.262,0.211c2.119,0.81,4.149,1.889,6.518,1.859 c2.647-0.022,3.007,0.673,2.932,3.776c-0.017,0.708,0.025,1.415,0.061,2.122c0.065,1.295-0.44,1.831-1.823,1.812 c-3.69-0.07-7.38-0.03-11.07,0c-0.56,0.01-1.42-0.02-1.62,0.29c-0.74,1.16-1.8,0.84-2.78,0.84c-2.78,0.02-5.56,0.01-8.34,0.01 c-2.64,0-5.27,0.06-7.9-0.01c-1.15-0.03-2.08,0.55-2.33,1.39c-0.7,2.4,0.27,5.56,3.59,5.63c1.2,0.02,2.77-0.38,3.51,0.22 c1.4,1.15,2.84,0.75,4.28,0.95c1.97,0.27,3.93,0.57,5.9,0.89c0.17,0.03,0.3,0.3,0.46,0.45c0.91,0.82,1.76,1.71,3.21,1.47 c0.49-0.09,1.07,0.16,1.57,0.35c0.51,0.19,0.95,0.66,1.45,0.73c3.2,0.43,6.4,0.78,9.69,1.16c0.04,0.17,0.13,0.39,0.14,0.62 c0.03,1.82,0.03,3.65,0.06,5.47c0.01,0.76-0.1,1.57,0.11,2.28c0.5,1.64,0.12,2.28-1.61,2.28c-4.12,0-8.24-0.01-12.36,0.02 c-0.7,0.01-1.77,0-2.02,0.4c-0.59,0.96-1.36,0.7-2.11,0.73c-1.81,0.07-3.64,0.04-5.44,0.19c-1.13,0.1-2.23,0.64-3.35,0.64 c-8.67,0.06-17.35,0.03-26.02,0.05c-0.66,0-1.71-0.04-1.89,0.3c-0.55,1.03-1.38,0.79-2.18,0.88c-1.31,0.17-2.07,1-2.12,2.29 c-0.1,2.71,1.38,4.42,4.05,4.64c0.66,0.06,1.34,0.06,2.01,0.06c11.59,0,23.19-0.04,34.79,0.04c2.11,0.01,4.23,0.53,6.34,0.84 c0.16,0.02,0.3,0.17,0.46,0.26c0.46,0.24,0.9,0.61,1.38,0.7c2.05,0.38,4.12,0.68,6.18,1.02c0.17,0.02,0.32,0.14,0.49,0.22 c0.59,0.27,1.16,0.71,1.77,0.77c1.78,0.18,2.26,0.55,2.18,2.39c-0.13,2.89,0.3,5.79-0.56,8.69c-0.54,1.82,0.44,4.02-1.28,5.61 c-1.07,0.99-1.03,2.72-2.45,3.52c-0.6,0.33-1.11,0.94-1.49,1.53c-0.84,1.31-1.52,2.72-2.37,4.02c-0.39,0.59-1.08,0.97-1.53,1.53 c-0.82,1.05-1.77,2.07-2.29,3.27c-0.73,1.7,0.72,3.6,2.56,3.61c1.2,0,2.39-0.07,3.59-0.14c0.28-0.01,0.76-0.06,0.79-0.18 c0.37-1.48,1.9-1.22,2.79-1.6c1.47-0.63,2.91-1.2,4.18-2.2c0.6-0.47,1.56-0.65,1.91-1.24c0.65-1.1,0.98-2.39,1.44-3.6 c0.17-0.43,0.37-0.84,0.5-1.28c0.4-1.41,0.82-2.81,1.14-4.24c0.15-0.69,0.22-1.46,0.08-2.14c-0.28-1.36,0.93-1.72,1.44-2.55 c0.84-1.38,1.53-1.33,2.36-0.08c0.04,0.06,0.18,0.09,0.27,0.09h5.12c-0.27-2.27,0.54-4.2-0.94-6.39c-1.18-1.72-2.35-3.95-2.25-6.37 c0.02-0.28-0.07-0.57-0.13-0.85c-0.31-1.36-0.62-2.72-0.98-4.33c4.5,0,8.43-0.01,12.35,0.02c0.27,0,0.59,0.24,0.78,0.46 c0.82,0.96,1.75,1.44,3.09,1.4c2.73-0.08,5.46,0.06,8.19,0.06c14.24,0.01,28.47,0,42.7,0c0.67,0,1.35,0.02,2.01-0.07 c0.32-0.05,0.75-0.28,0.88-0.55c0.69-1.38,1.24-2.78,1.07-4.42c-0.22-2-0.91-2.79-2.91-2.81c-2.59-0.03-5.17,0-7.76-0.03 c-0.4,0-0.82-0.09-1.21-0.22c-0.79-0.28-1.56-0.86-2.35-0.87c-4.08-0.1-8.15-0.05-12.22-0.06c-0.39,0-0.91,0.14-1.13-0.05 c-1.49-1.3-3.27-0.63-4.92-0.82c-1.42-0.16-3.03,0.59-4.17-0.93c-0.17-0.22-0.72-0.18-1.1-0.18c-1.29-0.03-2.58-0.02-3.86-0.03 c-0.63,0-1.49,0.23-1.83-0.09c-1.49-1.41-3.58-0.43-5.29-1.62c-1.47-1.03-3.79-0.13-5.71-1.05c-1.26-0.6-2.87,0.1-4.29-1.07 c-1.64-1.35-3.9-1.12-5.98-1.07c-1.17,0.02-1.96-0.78-2.01-1.96c-0.02-0.61,0-1.22,0-1.93c0.7-0.04,1.27-0.05,1.83-0.12 c0.31-0.04,0.62-0.16,0.9-0.3c0.48-0.24,0.93-0.73,1.42-0.78c3.66-0.32,7.33-0.56,10.99-0.82c0.05-0.01,0.1-0.01,0.15-0.01 c1.17-0.12,2.41-1.19,2.51-2.35c0.1-1.23,0.02-2.47,0.02-3.7c-1.73-0.36-3.3-0.9-4.9-0.98c-3.01-0.13-6.03,0-9.05,0.03 c-0.43,0-0.99-0.06-1.25,0.17c-1.07,0.95-2.32,0.59-3.51,0.66c-1.57,0.08-2.62-0.97-2.97-2.16c-0.34-1.18-0.19-2.67,0.24-3.85 c0.41-1.13,3.21-1.2,4.42-0.44c0.97,0.61,2.01,1.16,3.09,1.52c0.79,0.26,1.7,0.21,2.56,0.22c2.42,0.05,3.28-0.79,3.32-3.21 c0.02-1.15,0.11-2.31-0.02-3.45c-0.11-0.94-0.49-1.85-0.77-2.77c-0.35-1.1-0.72-2.18-1.14-3.45c0.69-0.05,0.96-0.09,1.24-0.09 c4.31-0.08,8.62-0.14,12.93-0.23c0.51-0.01,1.03-0.12,1.52-0.26c0.68-0.19,1.33-0.66,1.99-0.67c6.85-0.05,13.71-0.02,20.56-0.04 c0.71,0,1.61,0.13,2.1-0.23c1.18-0.87,2.44-0.56,3.67-0.62c1.29-0.05,2.6,0.05,3.87-0.13c0.76-0.11,1.42-0.83,2.18-0.93 c2.31-0.3,4.64,0.04,6.98-0.78c1.36-0.48,1.89-0.92,1.89-2.21c-0.01-1.05,0-2.09,0-3.07c-1.98-0.4-3.74-0.82-5.52-1.07 c-1.03-0.15-2.1-0.02-3.15-0.04c-0.33,0-0.87,0.04-0.95-0.13c-0.68-1.28-1.88-0.93-2.9-0.94c-4.36-0.05-8.72-0.02-13.08-0.03 c-0.42,0-0.84-0.06-1.25-0.16c-0.85-0.21-1.69-0.65-2.53-0.66c-3.74-0.08-7.48-0.04-11.22-0.07c-0.39,0-0.81-0.11-1.19-0.25 c-0.65-0.26-1.27-0.76-1.93-0.82c-1.661-0.151-3.335-0.019-5.007-0.073c-0.629-0.021-1.638-0.204-2.243-0.375 c-0.66-0.186-1.321-0.376-1.99-0.432c-1.57-0.13-3.16-0.02-4.74-0.05c-0.36,0-0.73-0.1-1.06-0.22c-0.75-0.28-1.46-0.83-2.21-0.87 c-2.29-0.12-4.62,0.13-6.89-0.13c-1-0.11-2.34-0.9-2.73-1.74c-0.4-0.87-0.13-2.37,0.4-3.27c0.641-1.095,1.837-1.878,2.791-2.802 c0.176-0.17,0.314-0.377,0.406-0.604c0.418-1.034,0.692-2.09,1.883-2.644c0.49-0.22,0.73-0.96,1.09-1.46 c0.58-0.8,1.01-1.83,1.79-2.34c1.34-0.86,2.7-1.8,4.39-2.05c0.94-0.14,2.19-0.41,2.65-1.07c0.83-1.21,2.16-0.98,3.16-1.63 c1.45-0.94,3.1-1.57,4.65-2.39c0.2-0.1,0.36-0.48,0.37-0.73c0.03-1.66,0.02-3.32,0.02-5.1c-1.93,0-3.73-0.2-5.46,0.05 c-1.77,0.26-3.54,0.82-5.19,1.53c-0.95,0.41-1.55,0.46-2.52,0.01c-1.67-0.76-3.21-2.09-5.31-1.62c-0.77,0.17-1.62,0.05-2.43,0.02 c-1.31-0.03-2.01-0.77-2.04-2.07c-0.03-1.1,0.24-2.39-0.24-3.26c-0.82-1.47-0.5-2.93-0.57-4.4c-0.07-1.35,0.57-1.94,1.93-1.96 c1.81-0.04,3.65,0.03,5.45-0.16c1.45-0.15,2.85-0.78,4.3-0.91c2.1-0.2,4.21-0.09,6.32-0.19c5.64-0.27,11.27-0.58,16.91-0.89 c0.29-0.01,0.59-0.18,0.87-0.31c0.46-0.22,0.9-0.66,1.36-0.68c2.87-0.12,5.74-0.18,8.61-0.21c1.86-0.01,3.49-0.46,4.72-1.98 c0.73-0.91,0.33-3.4-0.5-3.95c-1.54-1.02-3.21-0.87-4.89-0.91c-0.4-0.01-0.81-0.11-1.19-0.25c-0.76-0.27-1.48-0.83-2.23-0.85 c-3.214-0.102-6.428-0.038-9.642-0.061c-0.354-0.003-0.711-0.029-1.053-0.122c-0.859-0.234-1.683-0.63-2.544-0.697 c-1.48-0.12-2.97-0.01-4.46-0.04c-0.35,0-0.72-0.1-1.05-0.23c-0.7-0.28-1.36-0.79-2.07-0.87c-1.37-0.14-2.78,0.05-4.16-0.06 c-4.36-0.36-8.78,0.74-13.14-0.72c-1.01-0.34-1.88-0.84-2.7-1.35c-0.51-0.31-0.85-1.41-0.73-2.06c0.1-0.55,0.9-1.24,1.51-1.38 c1.69-0.39,3.52,0.23,5.11-1.2c0.68-0.6,1.73-0.79,2.03-1.87c0.46-1.59,0.03-3.2-1.02-4.15c-1.15-1.05-2.8-1.57-4.3-2.17 c-0.95-0.37-1.49-0.84-1.48-1.89c0.03-1.58,0.02-3.17-0.01-4.75c-0.01-0.57,0.08-1.42-0.24-1.65c-1.34-0.97-1.03-2.35-1.03-3.6 c-0.03-12.57-0.2-25.14,0.09-37.7c0.09-4.05-0.94-8.2,0.93-12.27c0.93-2.02,0.71-4.58,1.03-6.89c0.16-1.24-0.47-2.69,1-3.6 c0.14-0.09,0.09-0.54,0.09-0.83c0-4.12,0.01-8.25-0.02-12.37c0-0.41-0.16-0.82-0.29-1.22c-0.19-0.59-0.54-1.16-0.6-1.77 c-0.36-3.45-0.65-6.9-0.98-10.35c-0.03-0.31-0.24-0.6-0.38-0.89c-0.22-0.51-0.58-1-0.66-1.53c-0.24-1.69,0.47-3.51-0.81-5.07 c-0.19-0.23-0.19-0.89,0-1.1c1.13-1.21,0.66-2.69,0.81-4.07c0.03-0.33-0.01-0.85,0.17-0.94c1.18-0.61,0.78-1.71,0.9-2.64 c0.31-2.41,0.6-4.82,0.92-7.23c0.02-0.17,0.16-0.32,0.24-0.48c0.28-0.64,0.56-1.28,0.85-1.91c0.32-0.7,0.59-1.93,1-1.98 c1.63-0.19,2.43-1.42,3.43-2.35c1.11-1.02,1.99-2.29,3.34-3.88c1.88-0.27,4.43-0.62,6.97-0.99c0.244-0.035,0.634-0.127,0.864-0.214 c1.441-0.546,2.865-1.399,4.326-1.486c2.42-0.16,3.88-1.4,5.1-3.21c0.42-0.63,0.74-1.32,1.14-1.95c0.73-1.13,0.46-2.45-0.7-3.13 c-1.06-0.64-2.14-1.26-3.22-1.86c-0.79-0.43-1.66-0.72-2.39-1.23c-1.235-0.87-2.388-1.874-3.593-2.814 c-0.497-0.388-1.371-0.934-1.933-1.221c-0.971-0.497-1.952-0.974-2.934-1.465c-1-0.5-2.02-0.97-3.01-1.5 c-1.6-0.84-3.21-1.67-4.75-2.6c-0.37-0.23-0.71-0.84-0.72-1.29c-0.12-4.45-0.14-8.91-0.24-13.37c-0.01-0.63-0.24-1.27-0.47-1.87 c-0.4-1.04-1.01-2.01-1.27-3.07c-0.41-1.62-0.52-3.32-0.9-4.95c-0.19-0.8-1.03-1.52-1.04-2.28c-0.03-2.59-1.5-4.95-1.05-7.62 c0.23-1.35,0.07-2.78,0.01-4.17c-0.02-0.49-0.22-0.99-0.41-1.46c-0.18-0.47-0.63-0.91-0.64-1.37c-0.1-5.89-0.19-11.79-0.2-17.69 c-0.01-43.36-0.01-86.72,0.01-130.09c0-3.59,0.1-7.19,0.18-10.78c0-0.35,0.13-0.72,0.28-1.04c0.23-0.52,0.69-0.98,0.75-1.51 c0.14-1.13-0.01-2.31,0.15-3.44c0.21-1.41,0.24-3.06,1.01-4.12c1.23-1.69,0.93-3.66,1.6-5.44c0.86-2.26-0.54-4.93,1.14-7.29 c1.15-1.62,1.74-3.65,2.56-5.5c0.27-0.59,0.41-1.24,0.72-1.81c0.54-1.02,1.19-1.98,1.75-2.99c0.58-1.04,1.14-2.09,1.63-3.17 c0.67-1.52,2.22-1.88,3.43-2.66c0.92-0.59,2.03-0.89,3.04-1.36c1.51-0.69,3.02-1.38,4.5-2.12c0.5-0.26,1.18-0.59,1.33-1.04 c0.46-1.4,0.79-2.85,1.02-4.31c0.13-0.82-0.4-1.39-1.27-1.39c-3.26,0-6.51,0.03-9.77,0.06c-0.24,0-0.51,0-0.7,0.11 c-2.29,1.29-4.7,0.26-7.06,0.66c-0.05-0.53-0.1-0.81-0.1-1.1c0-8.53,0.13-17.08-0.04-25.61c-0.18-8.49,0.86-17.02-0.84-25.46 c-0.17-0.87-0.26-1.75-0.48-2.61c-0.13-0.53-0.56-0.99-0.63-1.51c-0.16-1.28,0.11-2.69-0.33-3.83c-0.93-2.37-0.35-3.87,2.08-4.61 c1.47-0.44,2.09-2.42,3.94-2.27c0.03,0,0.06-0.17,0.13-0.23c0.85-0.86,1.58-2.12,2.61-2.47c1.65-0.55,2.44-1.96,3.72-2.84 c0.98-0.67,1.86-1.5,2.82-2.2c0.62-0.46,1.31-0.81,1.96-1.23c0.66-0.42,1.31-0.86,1.95-1.31c0.27-0.2,0.49-0.46,0.76-0.67 c0.8-0.63,1.65-1.2,2.4-1.88c1.08-0.97,2.05-2.05,3.13-3.03c1.21-1.1,2.77-1.94,3.64-3.25c1.25-1.87,2.53-3.64,4.13-5.24 c1.47-1.47,2.88-3.08,3.97-4.84c0.72-1.18,2.37-1.65,2.4-3.29c0-0.06,0.14-0.14,0.22-0.16c1.32-0.35,2.61-0.84,3.95-1 c1.36-0.16,2.93-0.39,3.93,0.85c1.2,1.51,2.76,0.97,4.22,1.05c0.96,0.06,1.93,0.15,2.88,0.04c2.29-0.27,4.18,0.69,6.06,1.78 c0.68,0.4,1.4,0.75,2.09,1.13c0.92,0.51,1.83,1.03,2.85,1.6c0-0.01,0.07-0.17,0.19-0.27c0.97-0.86,2.45-1.54,2.79-2.6 C220.411,161.37,220.561,159.38,220.041,157.85z M111.437,192.42c-43.96,0-80.06-33.63-83.96-76.57c-0.27-0.72-0.3-1.53-0.18-2.4 c-0.12-1.77-0.18-3.55-0.18-5.35c0-46.56,37.75-84.31,84.32-84.31c46.56,0,84.31,37.75,84.31,84.31 C195.747,154.67,157.997,192.42,111.437,192.42z",
      "M230.071,128.64c-0.15-1.08-0.7-2.04-2.08-2.04c-0.28,0-0.57-0.25-0.84-0.39 c-0.47-0.25-0.92-0.61-1.42-0.73c-1.45-0.36-2.93-0.61-4.39-0.92c-0.12-0.03-0.22-0.18-0.34-0.23c-0.69-0.31-1.37-0.67-2.09-0.89 c-0.5-0.15-1.09,0.01-1.58-0.15c-1.59-0.49-3.12-1.21-4.73-1.56c-0.84-0.18-1.56-0.25-1.9-1.1c-0.26-0.64-0.44-1.3-0.58-1.71 c-0.72-0.61-1.66-1-1.81-1.59c-0.47-1.97-0.84-4-0.92-6.01c-0.17-4.38-0.13-8.76-0.19-13.14c0-0.39,0.08-0.98-0.12-1.13 c-1.52-1.11-0.88-2.72-1.05-4.13c-0.09-0.72-0.04-1.47-0.24-2.16c-0.52-1.81-1.24-3.58-1.68-5.41c-0.47-1.99-0.71-4.03-1.05-6.05 c-0.02-0.15-0.03-0.35-0.12-0.41c-1.51-0.98-1.28-2.82-1.53-4.12c-0.44-2.32-1.97-4.02-2.61-6.16c-0.4-1.34-1.17-2.57-1.71-3.87 c-0.68-1.62-1.18-3.32-1.99-4.86c-0.81-1.54-2.08-2.85-2.84-4.42c-0.66-1.35-0.85-2.94-2.05-4.04c-0.1-0.09-0.05-0.51,0.07-0.66 c0.56-0.66,1.05-1.5,1.78-1.88c1.3-0.68,1.3-1.76,1.31-2.91c0.01-1.17-0.04-2.34,0.01-3.51c0.07-1.48-0.62-2.06-2.07-2.04 c-3.26,0.04-6.52,0.06-9.78-0.01c-0.7-0.02-1.46-0.33-2.05-0.72c-1.1-0.72-2.12-1.56-3.13-2.4c-0.54-0.45-0.96-1.03-1.48-1.5 c-0.43-0.39-0.99-0.65-1.4-1.06c-1.1-1.08-2.85-1.27-3.64-2.8c-0.26-0.51-0.8-0.93-1.31-1.26c-1.904-1.241-3.992-2.242-5.711-3.712 c-0.881-0.754-1.89-1.335-2.86-1.97c-0.607-0.397-1.054-1.111-1.699-1.348c-2.2-0.8-3.28-2.91-5.09-4.15 c-1.33-0.92-1.84-2.72-3.74-3.11c-0.83-0.18-1.88-1.09-2.14-1.89c-0.88-2.71-2.14-5.37-1.84-8.36c0.05-0.48,0.01-0.96,0.01-1.34 c-1.25-1.09-2.38-0.97-3.36,0.1c-0.89,0.97-1.57,2.15-2.54,3.02c-1.43,1.29-2.97,2.51-4.61,3.52c-0.69,0.42-1.38,0.67-2.02,1.31 c-0.9,0.89-2.2,1.64-3.43,1.85c-1.8,0.3-3.69,0.07-5.53,0.05c-0.18,0-0.48-0.07-0.53-0.18c-0.47-1.14-1.47-0.93-2.36-0.94 c-6.56-0.01-13.14-0.04-19.7,0.04c-1.54,0.02-3.04-0.25-4.58,0.97c-1.14,0.9-3.14,0.73-4.76,1.02c-2.09,0.36-4.19,0.69-6.29,1.07 c-0.19,0.03-0.33,0.28-0.53,0.39c-0.37,0.22-0.74,0.54-1.14,0.59c-2.19,0.29-4.26,0.71-6.23,1.94c-1.53,0.96-3.44,1.68-5.22,1.77 c-1.75,0.09-2.67,1.41-4.14,1.82c-1.55,0.42-2.99,0.65-4.48-0.1c-0.81-0.405-1.626-0.816-2.452-1.201 c-0.68-0.317-1.835-0.735-2.558-0.934c-1.54-0.425-3.106-0.796-4.66-1.225c-0.36-0.1-0.75-0.28-1-0.54 c-1.13-1.22-3.97-1.95-5.53-1.35c-0.17,0.06-0.44,0.21-0.43,0.31c0.02,1.69-0.44,3.69,0.31,4.96c0.62,1.05,0.67,1.93,0.85,2.94 c0.3,1.71,0.65,3.4,0.99,5.1c0.03,0.13,0.11,0.31,0.22,0.36c1.21,0.52,0.68,1.35,0.48,2.21c-2.65,0-5.23,0-7.8-0.01 c-0.24,0-0.59,0.01-0.69-0.13c-1.25-1.66-3.02-0.97-4.53-0.83c-0.67,0.07-1.56,1.09-1.79,1.86c-0.3,0.97-0.07,2.11,0.02,3.18 c0.03,0.3,0.32,0.68,0.6,0.85c0.79,0.49,1.63,0.88,2.41,1.29c0,1.61-0.25,3.18,0.06,4.61c0.44,1.98-0.79,3.3-1.41,4.84 c-0.37,0.91-1.12,1.68-1.74,2.48c-0.65,0.86-1.47,1.62-1.97,2.56c-1.056,1.961-2.123,3.875-3.665,5.518 c-0.045,0.048-0.085,0.103-0.115,0.162c-0.62,1.2-1.26,2.38-1.81,3.61c-0.52,1.15-0.65,2.41-1.51,3.5c-0.8,1-1.09,2.41-1.63,3.63 c-0.4,0.91-0.89,1.79-1.23,2.73c-0.65,1.77-0.53,3.74-1.91,5.36c-0.96,1.12-1.31,2.75-2.03,4.1c-0.74,1.37-1.69,2.45-3.49,2.5 c-1.86,0.04-3.37,1.92-3.6,3.77c-0.44,3.62,2.49,5.16,4.33,7.38c0.29,0.36,0.73,0.77,0.74,1.17c0.06,1.95,0,3.9-0.04,5.84 c0,0.27-0.16,0.53-0.27,0.79c-0.22,0.58-0.62,1.14-0.66,1.73c-0.1,1.31-0.05,2.63-0.02,3.94c0,0.38,0.07,0.77,0.19,1.13 c0.27,0.77,0.78,1.51,0.84,2.29c0.15,1.79,0.08,3.6,0.11,5.4c0.01,0.78-0.28,1.79,0.1,2.29c1.42,1.91,0.12,4.44,1.72,6.36 c0.72,0.86,0.64,2.41,0.9,3.65c0.5,2.35,1.18,4.66,1.83,6.96c0.68,2.41,2.51,4.36,2.52,7.02c0,0.81,0.91,1.59,1.32,2.43 c0.52,1.07,0.95,2.19,1.43,3.28c0.11,0.24,0.28,0.45,0.41,0.68c0.56,1,1.12,1.99,1.67,2.99c0.32,0.59,0.48,1.5,0.98,1.75 c1.39,0.69,1.07,2.22,1.83,3.18c0.47,0.6,0.82,1.29,1.25,1.92c0.26,0.37,0.56,0.71,0.83,1.08c0.52,0.72,1.09,1.41,1.54,2.17 c0.52,0.89,1.47,2.02,1.24,2.71c-0.31,0.91-1.5,1.63-2.46,2.18c-1.59,0.9-3.29,1.6-4.94,2.38c-0.45,0.21-0.9,0.41-1.35,0.63 c-0.95,0.47-1.92,0.92-2.85,1.45c-0.71,0.42-1.35,0.98-2.05,1.42c-0.99,0.63-2.06,1.14-3,1.82c-0.81,0.58-1.46,1.39-2.27,1.98 c-0.53,0.4-1.41,0.43-1.81,0.9c-0.87,1.04-1.78,2-2.43,3.31c-0.93,1.85-0.62,3.28,0.36,4.67c0.71,1,1.81,1.7,3.22,1.44 c2.79-0.51,5.68,0.59,8.47-0.8c1.08-0.54,2.59-0.18,3.9-0.27c0.42-0.02,1.09-0.02,1.21-0.26c0.52-1.03,1.44-0.76,2.26-0.9 c1.76-0.28,3.52-0.6,5.28-0.92c0.13-0.02,0.33-0.1,0.37-0.21c0.43-1.07,1.39-0.83,2.22-0.9c0.63-0.06,1.27-0.03,1.88-0.15 c2.21-0.43,4.39-1,6.61-1.36c1.77-0.29,3.57-0.02,5.09,0.93c1.33,0.83,2.43,2.06,4.19,1.92c0.07,0,0.14,0.24,0.25,0.32 c0.96,0.71,1.94,1.41,3.11,2.26c-0.03,0.78,0.72,2.01-0.9,2.62c-0.11,0.05-0.12,0.35-0.21,0.52c-0.68,1.31-1.35,2.63-2.06,3.93 c-0.41,0.75-0.86,1.47-1.32,2.17c-0.52,0.79-1.16,1.5-1.6,2.33c-0.46,0.86-0.7,1.84-1.11,2.73c-0.56,1.22-1.46,2.35-1.74,3.63 c-0.31,1.34-0.12,2.81-0.03,4.22c0.08,1.17,0.87,1.95,2,2.03c1.38,0.09,2.83,0.58,4.1-0.64c0.75-0.73,1.82-1.11,2.66-1.76 c0.66-0.5,1.45-1.08,1.73-1.8c0.87-2.3,2.93-3.51,4.48-5.18c0.47-0.51,1.29-0.68,1.83-1.15c1.39-1.22,2.56-2.77,4.1-3.71 c1.46-0.88,3.26-1.31,4.97-1.65c1.24-0.24,2.38,0.18,3.64,0.89c2.31,1.31,5.28,0.57,7.75,2.06c1.12,0.68,2.84,0.67,4.2,0.82 c2.23,0.25,4.29,0.73,6.53,1.79c-0.24,0.43-0.46,0.94-0.77,1.4c-0.4,0.57-0.99,1.05-1.28,1.67c-0.79,1.67-1.35,3.39-1.07,5.31 c0.19,1.25,2.23,3.39,3.42,3.12c1.23-0.27,2.54-0.81,3.48-1.62c1.48-1.28,2.63-2.93,4.01-4.33c1.1-1.12,2.36-2.08,3.53-3.12 c0.71-0.64,1.3-1.64,2.12-1.89c1.76-0.52,3.64-0.61,5.45-0.97c1.79-0.35,3.55,0.17,5.46-0.91c1.89-1.06,4.51-0.98,6.82-1.09 c2.82-0.13,2.63-0.62,2.63,2.59c0,57.42,0.02,114.83-0.06,172.25c0,4.23,0.83,8.54-0.79,12.73c-0.62,1.6-0.25,3.38-1,5.17 c-0.81,1.94-0.89,4.43-1.01,6.62c-0.34,6.56-0.12,13.14-0.11,19.72c0,0.48-0.12,1.18,0.15,1.41c1.43,1.27-0.05,3.62,1.8,4.67 c0.34,3.04,0.98,6.08,0.99,9.12c0.06,52.79,0.04,105.58,0.04,158.37c0,3.16,0,6.33-0.03,9.49c0,0.57-0.12,1.14-0.26,1.69 c-0.19,0.72-0.64,1.41-0.66,2.11c-0.11,3.56-0.11,7.11-0.16,10.67c-0.01,0.42-0.1,0.85-0.21,1.27c-0.2,0.8-0.52,1.58-0.66,2.4 c-0.17,0.95-0.16,1.93-0.31,2.89c-0.16,1.01-0.64,2.01-0.6,2.99c0.16,3.93,0.47,7.84,0.73,11.76c0.01,0.09,0.01,0.19,0.03,0.29 c0.02,0.09,0.03,0.25,0.09,0.26c1.53,0.52,1.01,1.83,1.01,2.84c0.04,8.82,0.12,17.63-0.03,26.45c-0.05,2.65,0.87,5.42-0.97,8.02 c-0.8,1.12-0.72,2.87-1.05,4.32c-0.05,0.23-0.17,0.43-0.26,0.64c-0.55,1.3-1.35,2.55-1.59,3.9c-0.47,2.59-1.33,5.12-1.07,7.86 c0.22,2.37-0.05,4.78,0.08,7.16c0.1,1.83,0.58,3.64,0.72,5.47c0.11,1.56-0.68,2.28-2.23,2.29c-2.87,0.02-5.74-0.01-8.61,0.03 c-0.6,0.01-1.54,0.04-1.74,0.4c-0.54,0.93-1.29,0.71-2.03,0.74c-1.89,0.09-3.92-0.26-5.63,0.33c-1.64,0.56-3.18,0.44-4.77,0.55 c-0.77,0.05-1.56,0-2.33,0.04c-0.39,0.03-0.99,0.03-1.1,0.25c-0.72,1.33-1.93,0.77-2.95,0.89c-0.68,0.07-1.56-0.12-1.99,0.24 c-1.51,1.3-3.91-0.13-5.14,1.79c-2.12-0.02-4.15,0.22-6.23,0.82c-1.96,0.56-2.12,0.32-2.18,2.44c-0.01,0.34-0.01,0.69,0,1.03 c0.06,1.68,2.24,2.98,3.84,2.46c2.01-0.65,4.08-1.5,6.15-1.56c7.1-0.21,14.21-0.12,21.31-0.12c0.47-0.01,0.99,0.07,1.4,0.28 c1.67,0.85,3.32,1.62,5.27,1.47c0.64-0.05,1.32,0.15,1.95,0.35c0.64,0.19,1.22,0.71,1.84,0.75c3.19,0.16,3.22,0.16,3.33,3.45 c0.02,0.47,0.05,1.22,0.31,1.34c2.07,0.98,1.89,2.8,1.64,4.51c-0.1,0.64-0.81,1.33-1.41,1.69c-0.29,0.17-1-0.36-1.53-0.56 c-0.43-0.16-0.87-0.4-1.32-0.42c-1.21-0.07-2.43-0.01-3.65-0.06c-0.4-0.01-0.97-0.03-1.18-0.29c-1.01-1.21-2.46-2.07-2.96-3.72 c-0.12-0.39-0.73-0.77-1.18-0.88c-0.64-0.15-1.36,0-2.03-0.08c-3.01-0.39-4.31,2.14-4.4,4.43c-0.18,4.77-0.13,9.54-0.14,14.31 c-0.01,2.82,2.03,4.69,4.86,4.52c0.33-0.03,0.71,0,1-0.14c0.39-0.2,0.79-0.49,1.05-0.84c0.57-0.81,0.87-2.08,1.62-2.43 c1.73-0.79,3.65-1.22,5.52-1.65c1.12-0.26,2.33-0.11,3.44-0.37c0.5-0.12,0.83-1.12,1.47-0.21c0.36,0.51,0.86,1.02,0.95,1.59 c0.16,0.95,0.03,1.94,0.06,2.91c0.02,0.73-0.3,1.6,0.72,2.02c0.1,0.04,0.07,0.87-0.06,0.92c-0.9,0.37-1.84,0.86-2.77,0.87 c-4.38,0.09-8.76-0.08-13.14,0.08c-4.25,0.15-8.48,0.6-12.73,0.93c-0.14,0.01-0.29,0.04-0.42,0.1c-0.18,0.06-0.46,0.13-0.49,0.24 c-0.27,1.05-1.1,0.74-1.78,0.78c-1.26,0.07-2.71-0.25-3.73,0.27c-1.56,0.79-3.07,0.49-4.61,0.6c-0.83,0.06-1.66-0.02-2.48,0.05 c-0.46,0.04-0.92,0.23-1.36,0.4c-0.57,0.22-1.11,0.68-1.66,0.69c-5.74,0.12-11.48,0.25-17.22,0.19c-2.94-0.03-5.8,0.32-8.66,0.89 c-1.92,0.38-3.87,0.56-5.81,0.84c-0.14,0.02-0.37,0.03-0.41,0.11c-0.64,1.38-1.89,0.79-2.91,0.91c-0.67,0.07-1.58-0.17-1.99,0.19 c-1.16,1-2.45,0.58-3.69,0.69c-0.83,0.07-1.68,0-2.47,0.2c-0.46,0.12-0.79,0.86-1.24,0.91c-2.91,0.37-5.84,0.62-8.76,0.91 c-0.15,0.01-0.35-0.02-0.43,0.06c-0.65,0.68-1.53,1.29-1.85,2.11c-0.31,0.78,0.21,1.51,0.84,2.36c1.3,1.76,2.87,2,4.54,1.69 c2.76-0.49,5.54,0.64,8.38-0.92c1.96-1.08,4.67-0.8,7.06-1.06c1.06-0.12,2.14-0.03,3.21-0.09c0.36-0.02,0.71-0.16,1.05-0.3 c0.57-0.23,1.13-0.71,1.7-0.71c7.2-0.09,14.42,0.25,21.57-0.98c0.95-0.16,1.86-0.79,2.8-0.8c8.27-0.06,16.54-0.03,24.81-0.02 c0.44,0,1.03-0.11,1.28,0.12c1.16,1.09,2.55,0.69,3.86,0.72c2.62,0.06,5.26-0.04,7.88,0.09c3.92,0.2,7.83,0.57,11.75,0.79 c0.98,0.06,1.1,0.61,1.1,1.33c0.03,2.39,0.05,4.78,0.05,7.16c-0.01,2.02-1.87,3.14-3.77,2.39c-0.95-0.37-1.99-0.7-2.98-0.7 c-10.76-0.06-21.51-0.02-32.27-0.07c-1.58-0.01-3.37,0.66-4.65-0.97c-0.08-0.09-0.27-0.11-0.41-0.13 c-2.93-0.32-5.86-0.62-8.79-0.95c-0.4-0.04-0.8-0.18-1.18-0.33c-0.57-0.24-1.13-0.77-1.69-0.77c-7.35-0.03-14.69,0-22.04,0.04 c-0.95,0-2.27,1.35-2.31,2.29c-0.03,0.86-0.1,1.62,1.01,2.08c0.65,0.27,0.96,1.53,1.59,1.68c1.92,0.48,3.91,0.63,5.87,0.93 c1.04,0.15,2.37-0.55,2.94,1.01c0.04,0.1,0.36,0.11,0.55,0.12c3.51,0.33,7.01,0.67,10.52,0.95c1.16,0.1,2.34,0.02,3.5,0.08 c0.4,0.02,0.79,0.25,1.19,0.39c0.5,0.18,1.01,0.52,1.52,0.53c2.43,0.06,4.86,0.01,7.3,0.06c0.65,0.01,1.3,0.23,1.94,0.4 c0.48,0.13,0.93,0.46,1.4,0.46c7.84,0.09,15.67,0.05,23.5,0.23c5.81,0.13,11.61,0.48,17.4,0.86c0.64,0.05,1.54,0.85,1.76,1.49 c0.49,1.43,1.55,2.76,1.15,4.45c-0.06,0.27,0.33,0.63,0.48,0.97c0.55,1.25,1.09,2.51,1.63,3.77c-0.137,0.184-0.17,0.23-0.307,0.414 c-0.944-0.093-1.899-0.132-2.823-0.294c-0.59-0.1-1.13-0.53-1.7-0.54c-6.96-0.1-13.91-0.14-20.87-0.22 c-1.08-0.01-2.29,0.4-3.09-0.88c-0.16-0.27-0.9-0.25-1.38-0.26c-1.6-0.03-3.21-0.01-4.82-0.01c-0.33-0.01-0.83,0.09-0.99-0.09 c-0.91-1.09-2.14-0.72-3.26-0.77c-1.26-0.05-2.53,0.01-3.79-0.02c-0.36-0.01-0.72-0.14-1.05-0.29c-0.58-0.25-1.11-0.75-1.7-0.82 c-2.88-0.32-5.74-0.13-8.66-0.74c-3.27-0.68-6.78-0.21-10.19-0.18c-0.48,0-1.14,0.2-1.4,0.55c-0.9,1.21,0.09,4.17,1.51,4.44 c2.01,0.39,4.05,0.6,6.08,0.87c0.72,0.1,1.84-0.1,2.09,0.29c0.78,1.21,1.85,0.74,2.83,0.84c0.92,0.1,2.04-0.16,2.7,0.29 c1.05,0.71,2.08,0.6,3.16,0.65c1.06,0.05,2.18-0.07,3.19,0.21c1.63,0.45,3.16,1.3,4.8,1.72c1.71,0.45,3.48,0.08,5.27,1.06 c1.43,0.78,3.44,0.32,5.23,0.91c2.13,0.71,4.5-0.02,6.83,0.88c2.46,0.95,5.22,0.01,8.01,1.07c3.13,1.19,6.86,0.81,10.33,1.12 c0.57,0.05,1.18,0.03,1.68,0.26c0.64,0.3,1.17,0.82,1.75,1.24c0.15-0.02,0.31-0.05,0.46-0.08c-0.1,1.18,0.17,2.59-0.39,3.5 c-0.86,1.38-2.53,1.97-4.19,2.02c-3.25,0.08-6.51,0.02-9.76,0.07c-1.86,0.03-2.68,0.94-2.66,2.81c0.01,0.93,1.47,3.14,2.4,3.36 c1.65,0.4,3.33,0.82,5.01,0.9c3.06,0.14,6.13,0.03,9.19,0.05c1.58,0,2.3,0.73,2.31,2.34c0.02,3.12,0.22,6.25-0.07,9.34 c-0.2,2.13,1.22,2.97,2.27,4.19c0.09,0.1,0.56,0.01,0.73-0.14c0.99-0.82,1.37-1.83,1.28-3.18c-0.06-1.03,0.45-2.08,0.6-3.13 c0.26-1.95-0.25-4.06,1.26-5.73c0.28-5.74,0.56-11.48,0.85-17.22c0.04-0.83,0.14-1.66,0.12-2.48c-0.08-3.46,0.65-6.86,0.83-10.28 c0.13-2.46-0.51-4.96-0.75-7.44c-0.12-1.26,0.28-2.76-0.28-3.74c-0.87-1.54-0.47-3.05-0.63-4.58c-0.05-0.53,0.01-1.07-0.06-1.6 c-0.05-0.37-0.12-0.96-0.36-1.06c-0.97-0.44-0.73-1.24-0.75-1.98c-0.04-1.8,0.39-3.78-0.24-5.34c-0.66-1.64-0.54-3.17-0.62-4.76 c-0.07-1.22-0.02-2.44-0.04-3.65c-0.01-0.44,0.04-1.1-0.2-1.26c-1.41-0.94-0.74-2.36-0.95-3.57c-0.24-1.44-0.63-2.87-0.69-4.32 c-0.07-1.59-0.67-3.32,0.58-4.74c0.21-0.24,0.92-0.42,1-0.32c0.42,0.54,0.88,1.15,1.01,1.8c0.31,1.52-0.14,3.06,1.03,4.58 c1.02,1.3,1.22,3.22,1.85,4.85c0.34,0.86,0.86,1.64,1.25,2.49c0.27,0.58,0.43,1.22,0.69,1.82c0.46,1.07,0.96,2.13,1.45,3.19 c0.52,1.12,1.04,2.24,1.56,3.35c0.41,0.87,1.05,1.69,1.2,2.59c0.41,2.58,0.73,5.18,0.87,7.78c0.17,3.21,0.12,6.43,0.19,9.64 c0.01,0.43-0.01,1.08,0.24,1.23c1.04,0.66,0.84,1.66,0.91,2.6c0.27,3.54-0.37,7.08,0.66,10.64c0.5,1.72,1.74,2.57,2.66,3.79 c0.16,0.21,0.75,0.19,1.12,0.12c0.62-0.12,2.42-2.53,2.46-3.18c0.51-8.75-0.35-17.53,0.71-26.29c0.41-3.38-0.31-6.91-0.58-10.36 c-0.09-1.15,0.49-2.57-1.1-3.24c-0.11-0.04-0.11-0.35-0.13-0.54c-0.3-2.81-0.59-5.62-0.9-8.42c-0.05-0.47-0.11-1.21-0.38-1.33 c-1.02-0.43-0.73-1.26-0.78-1.97c-0.08-1.11,0.3-2.53-0.25-3.27c-0.83-1.1-0.52-2.02-0.49-3.05c1.99-0.43,3.75-1.81,5.74-0.95 c0.39,2.88,0.85,5.69,1.14,8.52c0.23,2.29,1.01,4.26,2.89,5.63c0.45,0.33,1.22,0.47,1.77,0.35c0.76-0.15,1.45-0.63,2.3-1.03 c0-2.53-0.02-5.15,0.02-7.78c0.01-0.86-0.14-1.96,0.31-2.53c0.91-1.16,0.53-1.98-0.12-2.77c0.48-1.75,1.76-1.6,3.07-1.64 c6.71-0.25,13.42-0.57,20.13-0.87c0.19,0,0.39-0.03,0.58-0.06c2.915-0.587,5.795-1.362,8.816-1.146 c1.388,0.099,2.779,0.185,4.166,0.067c1.583-0.135,3.2,0.101,4.658-0.921c0.97-0.68,1.69-1.88,1.18-3.28 c-0.25-0.68-1.16-1.55-1.81-1.58c-5.95-0.3-11.92-0.12-17.83-1.11c-0.37-0.06-0.98-0.04-1.06-0.23c-0.47-1.12-1.42-0.85-2.25-0.88 c-1.79-0.07-3.78,0.4-5.34-0.22c-1.54-0.62-2.97-0.51-4.46-0.69c-4.45-0.53-9.09,1.2-13.37-1.14c-0.57-0.31-1.22-0.55-1.66-0.99 c-1.16-1.18-2.18-2.5-3.35-3.68c-1.89-1.9-3.88-3.71-5.77-5.62c-1.11-1.1-1.9-2.74-3.21-3.36c-1.71-0.81-2.94-1.96-4.27-3.2 c-1.45-1.36-3.25-2.35-5.13-3.67v-1.37c2.39,0.23,4.78-0.38,6.81,1.6c0.74,0.73,2.1,1.17,3.17,1.15c2.07-0.06,2.81-1.1,2.83-3.22 c0.012-1.029,0.105-2.072-0.135-3.065c-0.126-0.522-0.594-1.242-0.983-1.612c-0.994-0.944-2.204-1.718-2.982-2.803 c-1.18-1.62-2.71-2.7-4.3-3.8c-0.66-0.45-1.27-1.04-1.77-1.68c-0.62-0.77-1.01-1.75-1.67-2.48c-0.7-0.79-1.07-1.55-1.07-2.66 c0.04-25.52,0.02-51.03,0.09-76.55c0.01-2.45,0.54-4.89,0.86-7.33c0.02-0.2,0.28-0.36,0.38-0.56c0.51-1.02,1.37-2.03,1.42-3.07 c0.2-4.67,0.37-9.36,0.15-14.02c-0.23-4.6,0.89-9.24-0.91-13.86c-0.97-2.5-0.76-5.45-1.08-8.2c-0.06-0.53-0.12-1.06-0.22-1.59 c-0.17-0.92-0.53-1.84-0.54-2.75c0-1.6-0.1-3.16,0.52-4.8c0.54-1.42,0.41-3.2,0.21-4.77c-0.37-2.8,0.82-5.35,0.97-8.05 c0.01-0.14,0.05-0.36,0.14-0.4c1.26-0.61,0.84-1.8,0.99-2.79c0.06-0.43-0.11-1.04,0.12-1.27c1.46-1.45,0.73-3.5,1.61-5.25 c1.1-2.2-0.12-5.19,1.07-7.68c0.04-9.5,0.1-18.99,0.12-28.49c0-1.74,0.34-3.72-0.35-5.18c-0.85-1.83-0.55-3.56-0.74-5.33 c-0.04-0.36-0.16-0.73-0.31-1.07c-0.25-0.56-0.68-1.08-0.79-1.67c-0.37-2.01-0.64-4.05-0.95-6.07 c-0.018-0.064-0.035-0.126-0.053-0.19c-0.547-1.29-1.442-2.513-1.707-3.87c-0.47-2.46-0.88-4.98-0.88-7.47 c-0.04-51.72-0.02-103.44-0.05-155.15c0-2.24,0.68-3.89,2.54-5.13c0.81-0.53,1.5-1.26,2.19-1.96c1.11-1.12,2.13-2.32,3.27-3.39 c0.39-0.36,1.19-0.28,1.57-0.64c1.32-1.26,2.51-2.66,3.81-3.95c1.03-1.02,2.18-1.94,3.2-2.97c1.34-1.36,2.58-2.82,3.92-4.18 c1.21-1.22,2.62-2.26,3.72-3.58c1.17-1.4,2.28-2.77,4.14-3.27c0.14-0.04,0.24-0.28,0.35-0.43c1.26-1.87,1.11-3.98,0.97-6.07 c-0.02-0.38-0.44-0.97-0.78-1.06c-2.42-0.64-4.68,0.12-6.93,0.92c-0.29,1.52-1.89,1.12-2.8,1.7c-1.15,0.74-2.85,0.01-4.3,1.16 c-0.88,0.7-2.61,0.58-3.96,0.92c-1.74,0.44-3.32,1.03-4.92,2.07c-0.1-0.55-0.25-1.01-0.25-1.47c0-2.48-0.03-4.97,0.07-7.45 c0.23-5.62,0.14-11.24,0.73-16.88c0.56-5.39-0.01-10.89-0.04-16.34c-0.03-6.04,0.03-12.08-0.03-18.12 c-0.03-2.15,0.05-4.26-0.48-6.46c-0.76-3.17-0.78-6.51-1.2-9.77c-0.11-0.84-0.54-1.64-0.8-2.46c-0.06-0.22-0.15-0.54-0.04-0.67 c0.72-0.89,1.46-1.75,2.24-2.59c1.82-1.97,3.8-3.81,5.45-5.92c1.33-1.69,2.58-3.28,4.76-3.9c0.76-0.21,1.55-0.62,2.13-1.15 c1.19-1.11,2.12-2.36,3.81-3.06c1.74-0.72,3.12-2.32,4.64-3.56c0.41-0.33,0.73-0.78,1.16-1.07c2.04-1.42,4.11-2.79,6.15-4.21 c0.29-0.2,0.44-0.61,0.73-0.8c1.46-0.91,3.01-1.69,4.41-2.68c1.16-0.81,2.17-1.83,3.2-2.8c0.46-0.44,0.86-0.97,1.18-1.51 c0.4-0.68,0.54-1.55,1.06-2.09c1.159-1.21,1.822-2.544,1.82-4.222c0-0.258,0.046-0.516,0.159-0.747c0.97-1.97,2.06-3.9,2.95-5.92 c1.15-2.6,2.08-5.3,3.24-7.89c1.04-2.33,2.44-4.52,3.34-6.89c0.61-1.59,1.59-2.02,3.03-2.03c3.99-0.03,7.99-0.22,11.96,0.02 c2.25,0.14,3.79-1.49,5.85-1.66c0.717-0.051,1.424-0.522,2.077-0.886c0.846-0.472,1.672-0.976,2.476-1.516 c0.646-0.434,1.381-0.838,1.917-1.398C230.441,131.98,230.311,130.27,230.071,128.64z M111.437,192.42 c-46.57,0-84.32-37.75-84.32-84.32c0-46.56,37.75-84.31,84.32-84.31c46.56,0,84.31,37.75,84.31,84.31 C195.747,154.67,157.997,192.42,111.437,192.42z"
    ],
    clocks: {
      size: 169,
      0:    {x: 111.011, y: 108.5}
    }
  },
  2: {
    height: 625.438,
    width:  197.009,
    path:   "M193.86,271.21c-2.234-2.626-5.64-4.792-8.929-5.835c-6.793-2.153-11.841,2.196-17.463,7.369 c-5.009-25.727-17.583-43.987-38.477-54.246l-18.909-21.56v-12l20.773-23.686c19.55-10.446,31.402-28.304,36.229-53.096 c5.622,5.174,10.67,9.523,17.463,7.369c3.289-1.043,6.695-3.208,8.929-5.835c4.877-5.734,3.879-14.302-1.542-19.605 c-6.442-6.301-13.569-5.549-24.852,3.382c-4.816-25.231-17.183-43.587-38.409-54.031h0.158c-1.506-0.732-3.056-1.394-4.625-2.025 c-2.997-1.25-6.144-2.365-9.463-3.327c0,0-0.527-0.089-1.457-0.217c-2.421-0.731-4.757-2.02-7.743-3.273 c2.103-2.282,3.255-3.455,4.321-4.703c5.176-6.057,4.821-14.978-0.792-20.538c-5.647-5.594-14.543-5.829-20.352-0.539 c-6.101,5.556-6.808,14.49-1.648,20.831c4.153,5.103,3.905,5.403-2.49,8.055c-1.793,0.744-3.604,1.465-5.417,2.187 c-10.281,3.032-16.092,6.929-22.875,12.001c-12.415,9.284-19.739,22.385-23.521,37.515c-0.673,2.693-2.08,5.2-3.437,8.492 c-2.262-2.122-3.424-3.284-4.661-4.36c-6.003-5.222-14.845-4.864-20.356,0.799c-5.544,5.698-5.778,14.673-0.534,20.534 c5.507,6.156,14.361,6.869,20.646,1.662c5.058-4.19,5.355-3.94,7.984,2.512c3.394,8.33,6.292,17.054,10.972,24.62 c6.032,9.752,14.303,16.873,24.096,21.915l21.601,23.357v12l-20.223,21.867c-10.232,5.068-18.855,12.348-25.091,22.43 c-4.68,7.566-7.578,16.29-10.972,24.62c-2.629,6.452-2.926,6.702-7.984,2.512c-6.285-5.206-15.139-4.493-20.646,1.662 c-5.243,5.861-5.01,14.837,0.534,20.534c5.511,5.663,14.352,6.021,20.356,0.799c1.237-1.076,2.399-2.238,4.661-4.36 c1.356,3.292,2.764,5.799,3.437,8.492c3.782,15.13,11.106,28.232,23.521,37.515c7.877,5.89,14.425,10.198,28.206,13.404 c1.38,0.321,2.787,0.579,4.201,0.789c0.031,27.796,0.06,69.604,0.085,105.236c0.009,13.829,0.018,26.73,0.026,37.518 c0,0.826-0.08,1.652-0.121,2.436c-3.447,0.597-4.58-0.495-4.682-4.511c-0.072-2.822-0.002-5.649-0.016-8.473 c-0.024-4.802-0.891-5.97-4.609-5.976c-14.432-0.022-28.864-0.01-43.295-0.009c-4.627,0-9.255,0.084-13.881-0.022 c-3.054-0.07-4.428,1.698-4.326,5.623c0.079,3.039,0.085,6.08-0.001,9.119c-0.111,3.933,1.27,5.674,4.317,5.646 c8.372-0.076,16.745-0.038,25.118-0.024c4.14,0.007,4.933,1.055,4.947,6.397c0.024,9.702,0.024,9.702-7.67,9.702 c-7.381-0.001-14.762-0.025-22.143,0.006c-3.558,0.015-4.54,1.209-4.551,5.611c-0.035,13.947-0.943,13.109,10.004,13.035 c6.61-0.045,13.22-0.032,19.83,0.002c3.528,0.018,4.463,1.226,4.534,5.638c0.17,10.455,0.17,10.455-8.056,10.455 c-7.271,0-14.542-0.024-21.813,0.01c-3.492,0.016-4.48,1.263-4.503,5.672c-0.067,12.642-0.701,12.243,9.397,12.129 c6.83-0.077,13.661-0.04,20.491-0.004c3.466,0.018,4.419,1.281,4.484,5.702c0.154,10.39,0.154,10.39-8.106,10.39 c-7.271,0-14.542-0.026-21.813,0.01c-3.447,0.017-4.439,1.296-4.452,5.736c-0.039,13.671-0.908,12.955,9.772,12.916 c17.076-0.063,34.152-0.012,51.227-0.02c4.329-0.002,5.098-1.02,5.1-6.63c0.001-1.977-0.037-3.956,0.007-5.931 c0.094-4.282,1.178-5.371,4.197-4.937c1.031,10.07,1.909,19.99,3.129,29.842c0.425,3.429,1.312,6.98,2.695,9.93 c1.2,2.56,3.388,5.993,5.16,6.013c1.744,0.02,4.469-3.383,5.098-5.954c2.029-8.292,4.037-16.802,4.667-25.395 c0.85-11.612,0.501-23.379,0.517-35.079c0.042-30.977,0.078-68.798,0.115-106.572c0.037-37.246,0.075-74.445,0.121-104.988 c3.105-0.304,5.045-0.635,5.045-0.635c29.872-8.658,46.55-29.062,52.338-59.383c11.283,8.931,18.409,9.683,24.852,3.382 C197.739,285.512,198.737,276.945,193.86,271.21z M44.186,100.381c0-29.823,24.177-54,54-54s54,24.177,54,54 c0,29.823-24.177,54-54,54S44.186,130.205,44.186,100.381z M98.186,334.381c-29.823,0-54-24.177-54-54c0-29.823,24.177-54,54-54 s54,24.177,54,54C152.186,310.205,128.009,334.381,98.186,334.381z",
    clocks: {
      size: 108,
      0:    {x: 98.579, y: 280},
      1:    {x: 98.579, y: 100}
    }
  },
  3: {
    height: 915.936,
    width:  277.634,
    path:   "M263.752,257.836c-13.719,1.508,3.345-15.515,3.955-23.109l-0.113,0.113 c8.127-22.574,2.75-46.079-10.802-65.608c14.365-1.735,19.981-6.287,20.122-15.339c0.118-7.617-5.228-14.388-12.762-14.963 c-3.451-0.263-7.412,0.636-10.496,2.245c-6.369,3.324-6.896,10.001-7.248,17.67c-12.146-8.157-24.329-12.988-36.575-14.34 c-2.94-2.54-4.264-6.236-3.879-10.997c0.451-5.587,0.239-11.066-0.572-16.359c0.828-2.872,1.549-5.847,2.156-8.934 c5.672,5.174,10.766,9.523,17.62,7.369c3.319-1.043,6.755-3.208,9.009-5.835c4.921-5.734,3.914-14.302-1.556-19.605 c-6.5-6.301-13.69-5.549-25.075,3.382c-5.055-30.578-25.967-51.62-54.619-60.047c-2.447-0.732-4.807-2.023-7.825-3.278 c2.125-2.286,3.29-3.461,4.367-4.71c11.938-14.551-7.15-33.181-21.367-21.111c-6.165,5.565-6.879,14.513-1.665,20.864 c4.197,5.111,3.946,5.411-2.516,8.068c-1.812,0.745-3.642,1.467-5.474,2.19c-24.645,7.648-40.948,25.21-46.886,49.595 c-0.68,2.698-2.102,5.208-3.473,8.505c-2.286-2.125-3.461-3.29-4.71-4.367c-14.552-11.938-33.18,7.152-21.111,21.367 c5.565,6.165,14.513,6.879,20.864,1.665c4.71-3.867,5.338-3.944,7.487,1.123c-1.309,6.465-1.74,13.174-1.396,20.102 c0.3,6.03-1.497,10.097-5.356,12.617c-8.889,2.044-17.148,6.132-25.567,9.656c-6.448,2.691-6.837,2.656-7.484-3.926 c-0.804-8.178-7.636-14-15.931-13.576c-18.581,1.516-18.918,28.187-0.181,30.036c1.645,0.122,3.299,0.129,6.419,0.243 c-1.366,3.319-2.113,5.992-3.558,8.47c-3.428,5.74-6.123,11.683-7.912,17.811c-4.722,16.154-2.533,34.602,5.996,50.411 c1.801,5.691,8.569,13.392-1.603,12.903c-40,12.971,18.416,54.114,16.704,9.691c34.782,3.225,46.692,41.92,80.447,49.674 c7.963,2.791,11.179,6.671,12.046,13.724c0.012,3.241,0.01,6.503,0,9.829h-0.223c0,2.086,0,5.309,0,5.309s0.065,0.184-0.069,0.268 c-7.211-0.002-14.005-0.041-20.79,0.015c-4.483,0.037-6.154,1.09-6.592,4.667c-0.352,4.638-0.043,9.45-0.131,14.122 c0.062,5.274,1.49,6.69,6.861,6.724c6.999,0.045,13.998,0.011,21.721,0.011v5.671c-7.723,0-14.722-0.034-21.721,0.011 c-5.372,0.035-6.799,1.45-6.861,6.724c0.087,4.671-0.221,9.484,0.131,14.122c0.438,3.577,2.109,4.63,6.592,4.667 c6.785,0.056,13.579,0.017,20.79,0.015c0.134,0.084,0.279,0.175,0.069,0.268v5.406h0.599c0.031,3.784,0.031,7.619,0,12h-0.599 v4.809c0,0,0.065,0.184-0.069,0.268c-7.211-0.002-14.005-0.041-20.79,0.015c-4.483,0.037-6.154,1.09-6.592,4.667 c-0.352,4.638-0.043,9.45-0.131,14.122c0.062,5.274,1.49,6.69,6.861,6.724c6.999,0.045,13.998,0.011,21.721,0.011v5.671 c-7.723,0-14.722-0.034-21.721,0.011c-5.372,0.035-6.799,1.45-6.861,6.724c0.087,4.671-0.221,9.484,0.131,14.122 c0.438,3.577,2.109,4.63,6.592,4.667c6.785,0.056,13.579,0.017,20.79,0.015c0.134,0.084,0.279,0.175,0.069,0.268v4.906h0.599 c0.031,4.284,0.031,8.119,0,12h-0.599v5.309c0.211,0.092,0.065,0.184-0.069,0.268c-7.211-0.002-14.005-0.041-20.79,0.015 c-4.483,0.037-6.154,1.09-6.592,4.667c-0.352,4.638-0.043,9.45-0.131,14.122c0.062,5.274,1.49,6.69,6.861,6.724 c6.999,0.045,21.721,0.011,21.721,0.011v5.671c0,0-14.722-0.034-21.721,0.011c-5.372,0.035-6.799,1.45-6.861,6.724 c0.087,4.671-0.221,9.484,0.131,14.122c0.438,3.577,2.109,4.63,6.592,4.667c6.785,0.056,13.579,0.017,20.79,0.015 c0.134,0.084,0.279,0.175,0.457,0.268c0,1.594,4.559,168.228,4.51,209.286c-0.005,4.1,0.442,9.128,0.442,10.259 c-3.396,0-6.234,0.133-9.054-0.034c-3.499-0.206-5.37,1.456-6.735,4.558c-1.281,2.913-2.803,5.866-4.843,8.27 c-6.58,7.751-16.578,7.84-23.206,0.144c-2.209-2.565-3.736-5.81-5.169-8.932c-1.239-2.699-2.939-4.083-5.916-4.024 c-3.712,0.073-7.428,0.078-11.14-0.009c-3.163-0.074-4.936,1.432-6.143,4.306c-1.141,2.716-2.476,5.469-4.285,7.764 c-8.725,11.281-23.01,6.923-27.966-5.357c-1.496-5.628-5.039-7.274-10.521-6.767c-4.485,0.415-6.285,1.937-6.286,6.612 c-0.001,15.755-0.002,31.511-0.003,47.266c-0.001,16.376-0.012,32.752,0.006,49.127c0.004,3.646,2.039,5.706,5.586,5.765 c4.244-0.151,7.724,1.078,9.747-3.72c1.63-3.566,3.31-7.297,5.811-10.239c5.927-6.969,15.25-7.396,21.596-0.827 c2.91,3.012,4.885,7.078,6.716,10.936c1.245,2.623,2.748,3.896,5.573,3.857c3.96-0.055,7.925-0.102,11.882,0.027 c3.041,0.099,4.629-1.359,5.914-4.011c1.386-2.861,3.016-5.766,5.166-8.063c10.107-10.412,22.254-3.718,27.139,8.037 c1.337,2.907,3.18,4.141,6.281,4.034c3.442-0.119,6.891-0.027,10.523-0.027c1.065,5.652,2.167,11.021,3.856,16.453 c1.228,3.675,2.407,8.536,7.056,8.594c4.923,0.061,6.042-4.987,7.307-8.743c1.456-4.322,2.867-8.847,3.125-13.35 c0.728-12.721,1.152-25.477,1.174-38.219c0.19-111.404,0.292,50.177,0.366-61.227c0.003-5.129,0.201-18.49,0.201-22.46 c0-41.693,4.098-203.286,4.098-209.558c8.112,0,15.82-0.053,23.528,0.021c5.544,0.13,6.64-3.323,6.288-8.201 c0.033-3.547,0.038-7.095-0.007-10.642c-0.066-5.278-1.476-6.669-6.885-6.701c-7.529-0.044-23.121-0.011-23.121-0.011v-5.671 c0,0,15.592,0.033,23.121-0.011c5.408-0.032,6.819-1.423,6.885-6.701c0.044-3.547,0.04-7.095,0.007-10.642 c0.351-4.882-0.742-8.33-6.288-8.201c-7.707,0.073-15.416,0.021-22.724,0.021v-22.76c7.308,0,15.017-0.053,22.724,0.021 c5.544,0.13,6.64-3.323,6.288-8.201c0.033-3.547,0.038-7.095-0.007-10.642c-0.066-5.278-1.476-6.669-6.885-6.701 c-7.529-0.044-15.059-0.011-23.121-0.011v-5.671c8.062,0,15.592,0.033,23.121-0.011c5.408-0.032,6.819-1.423,6.885-6.701 c0.044-3.547,0.04-7.095,0.007-10.642c0.351-4.882-0.742-8.33-6.288-8.201c-7.707,0.073-15.416,0.021-22.724,0.021v-22.76 c7.308,0,15.017-0.053,22.724,0.021c5.544,0.13,6.64-3.323,6.288-8.201c0.033-3.547,0.038-7.095-0.007-10.642 c-0.066-5.278-1.476-6.669-6.885-6.701c-7.529-0.044-15.059-0.011-23.121-0.011v-5.671c8.062,0,15.592,0.033,23.121-0.011 c5.408-0.032,6.819-1.423,6.885-6.701c0.044-3.547,0.04-7.095,0.007-10.642c0.351-4.882-0.742-8.33-6.288-8.201 c-7.707,0.073-15.416,0.021-22.724,0.021v-13.831c0.379-7.638,5.186-13.149,13.162-15.825 c28.456-7.104,41.808-33.352,64.888-48.287c17.492-10.743,9.354,22.937,28.518,19.129 C282.127,286.309,282.455,259.681,263.752,257.836z M105.697,839.074c0.498,2.38,0.15,4.934-3.302,4.884 c-2.295-0.033-3.176,1.042-3.702,3.217c-0.26,1.076-1.713,2.383-2.793,2.559c-0.723,0.118-2.36-1.479-2.505-2.467 c-0.409-2.804-2.004-3.344-4.385-3.299c-3.709,0.07-7.424,0.116-11.131-0.006c-3.83-0.126-3.945,2.278-3.981,5.13 c-0.038,2.976,0.755,4.826,4.142,4.589c1.477-0.103,2.968,0.015,4.451-0.025c2.202-0.059,4.543-0.006,4.579,2.901 c0.039,3.187-2.477,3.119-4.78,3.068c-1.36-0.03-2.728,0.082-4.08-0.025c-3.258-0.257-4.5,1.312-4.272,4.425 c-0.041,4.353,1.027,8.028-4.883,7.506c-7.022,0.039-7.951,0.802-7.543-7.405c0.169-3.39-1.192-4.855-4.554-4.524 c-0.857,0.085-1.922,0.329-2.555-0.056c-1.2-0.729-2.156-1.861-3.213-2.825c1.006-1.017,1.944-2.121,3.057-3.004 c0.38-0.301,1.199-0.042,1.817-0.044c5.007-0.022,7.131-2.986,5.196-7.646c-0.392-0.945-1.974-1.785-3.11-1.944 c-3.651-0.437-7.442,0.158-11.117-0.121c-3.786-0.387-5.894,0.721-5.698,5.061c0.045,0.996-1.78,2.077-2.744,3.119 c-0.848-1.038-2.451-2.105-2.412-3.108c0.153-3.932-1.445-5.27-5.269-5.225c-1.017,0.012-2.491-1.899-2.973-3.215 c-0.52-1.421-0.127-3.18-0.126-4.791c0-5.24-0.002-5.268,5.3-5.954c2.366-0.306,3.023-1.787,2.927-3.889 c-0.098-2.143,0.268-4.425,2.848-4.073c1.034,0.141,2.342,2.528,2.49,3.998c0.282,2.788,1.314,4.039,4.131,3.976 c3.956-0.088,7.919-0.125,11.873,0.011c3.063,0.105,4.168-1.204,4.13-4.212c-0.036-2.816-0.326-5.041-3.916-4.755 c-2.559,0.203-4.468-0.474-4.367-3.527c0.095-2.865,2.016-3.344,4.358-3.173c2.898,0.212,3.849-1.243,3.979-4.019 c0.085-1.821,0.73-5.002,1.563-5.153c3.046-0.553,6.308-0.31,9.408,0.165c0.646,0.099,1.284,2.453,1.345,3.795 c0.224,4.967,0.374,5.207,5.401,5.214c1.361,0.002,2.929-0.422,4.027,0.116c1.271,0.623,2.94,2.09,2.942,3.194 c0.002,1.125-1.621,2.815-2.876,3.241c-1.665,0.565-3.667,0.223-5.518,0.132c-3.18-0.157-3.971,1.57-3.952,4.398 c0.019,2.703,0.495,4.64,3.783,4.569c3.956-0.085,7.916-0.055,11.873-0.012c2.165,0.024,3.322-0.763,3.826-3.068 c0.241-1.105,1.771-1.927,2.718-2.877c0.905,0.971,2.333,1.814,2.605,2.939c0.545,2.256,1.757,2.7,3.843,3.111 C108.401,831.102,105.035,835.914,105.697,839.074z M139.108,46c29.823,0,54,24.177,54,54c0,29.823-24.177,54-54,54 s-54-24.177-54-54C85.108,70.176,109.285,46,139.108,46z M19.108,212c0-29.823,24.177-54,54-54s54,24.177,54,54 c0,29.823-24.177,54-54,54S19.108,241.823,19.108,212z M144.944,857.898c-2.09,2.578-1.865,5.176-1.942,7.953 c-0.024,0.854,0.131,1.914-0.302,2.509c-2.403,3.147-3.159,2.809-5.436-0.185c-0.264-0.306-0.178-0.948-0.184-1.437 c-0.041-3.271,0.536-6.657-2.369-9.253c-0.531-0.475-0.479-1.605-0.957-3.425c1.21-1.271,2.47-3.306,4.294-4.333 c2.379-1.339,5.236-0.58,6.441,1.819C145.405,853.367,145.95,856.658,144.944,857.898z M144.996,807.941 c-2.224,2.677-1.877,5.438-1.992,8.318c-0.086,2.146-0.2,4.578-2.99,4.544c-2.765-0.034-2.874-2.475-2.933-4.614 c-0.08-2.895,0.543-5.919-2.179-8.193c-0.631-0.527-0.645-1.797-1.234-3.633c1.265-1.382,2.48-3.465,4.292-4.5 c2.341-1.338,5.233-0.649,6.476,1.731C145.382,803.404,145.991,806.744,144.996,807.941z M80.062,279.694 c17.171-3.582,56.234-25.446,59.296-50.487c5.518,22.114,30,48.729,61,48.729C162.77,319.773,120.431,321.28,80.062,279.694z M205.108,266c-29.823,0-54-24.177-54-54c0-29.823,24.177-54,54-54s54,24.177,54,54C259.108,241.823,234.932,266,205.108,266z",
    clocks: {
      size: 108,
      0:    {x: 138.892, y: 100},
      1:    {x: 72.892, y: 212},
      2:    {x: 204.892, y: 212}
    }
  },
  4: {
    height: 1041,
    width:  368.697,
    path:   "M365.949,178.882c-2.159-2.705-5.464-5.038-8.725-6.201c-7.211-2.57-12.634,1.794-18.155,7.261 c-1.008-3.182-1.811-5.292-2.346-7.468c-7.207-29.311-25.676-46.993-55.052-53.142c-3.565-0.746-4.337-2.365-5.721-5.525 c-10.917-24.928-15.917-32.928-31.863-49.408c-1.625-1.679-3.453-3.192-5.144-4.761c-15.909-14.758-20.909-17.758-43.492-26.71 c-1.882-0.746-3.781-1.782-6.866-3.302c2.349-1.876,3.694-2.659,4.662-3.772c4.695-5.397,4.837-13.436,0.452-19.014 c-5.3-6.742-15-7.806-21.456-2.354c-6.714,5.67-7.304,15.417-1.328,21.919c3.617,3.935,3.297,5.361-1.725,7.153 c-2.044,0.73-4.17,1.226-6.237,1.896c-12.766,4.137-23.255,11.604-31.918,21.798c-2.372,2.791-4.778,5.622-7.539,8.002 c-15.564,13.413-26.166,29.895-31.108,49.904c-0.68,2.752-1.741,4.084-4.825,4.54c-29.053,4.299-51.461,25.809-57.16,54.556 c-0.307,1.549-0.792,3.062-1.25,4.806c-11.35-8.302-18-8.998-24.401-2.862c-5.321,5.101-6.467,13.398-1.935,19.203 c2.036,2.608,5.192,4.836,8.302,6.005c7.137,2.683,12.59-1.579,17.735-6.353c0.583,1.299,1.01,1.874,1.096,2.496 c4.046,29.315,27.997,53.277,57.825,57.393c2.223,0.307,4.062,1.874,4.644,4.041c1.308,4.861,2.891,9.682,4.787,14.345 c9.432,23.198,28.811,38.203,45.823,55.084c5.104,5.065,11.204,9.197,17.156,13.308c5.563,3.842,7.792,8.391,7.788,15.456 c-0.129,188.254-0.004,308.508,0.065,496.762c0,0.102-0.005,0.205-0.006,0.307v41.241c-2.701,0.026-5.102,0.092-7.461-0.047 c-3.499-0.206-5.37,1.456-6.735,4.558c-1.282,2.913-2.803,5.866-4.844,8.27c-6.581,7.751-16.578,7.84-23.206,0.144 c-2.254-2.617-3.797-5.94-5.255-9.119c-1.087-2.369-3.472-3.882-6.078-3.833c-3.63,0.068-7.263,0.071-10.893-0.013 c-3.163-0.074-4.936,1.432-6.143,4.306c-1.141,2.716-2.476,5.469-4.285,7.764c-8.725,11.281-23.01,6.923-27.966-5.357 c-1.496-5.628-5.039-7.274-10.521-6.767c-4.485,0.415-6.285,1.937-6.286,6.612c-0.001,15.755-0.002,31.511-0.003,47.266 c-0.001,16.376-0.012,32.752,0.006,49.127c0.004,3.646,2.039,5.706,5.586,5.765c4.244-0.151,7.724,1.078,9.747-3.72 c1.63-3.566,3.31-7.297,5.811-10.239c5.927-6.969,15.25-7.396,21.596-0.827c2.91,3.012,4.885,7.078,6.716,10.936 c1.457,3.071,3.269,4.292,7.14,3.723c2.897-0.426,5.844-0.506,8.73-0.009c4.108,0.708,6.007-0.762,7.499-3.84 c1.386-2.861,3.016-5.766,5.166-8.063c10.107-10.412,22.254-3.718,27.139,8.037c1.337,2.907,3.181,4.141,6.281,4.034 c2.715-0.094,5.446-0.058,8.257-0.038v2.091c0.319,0.001,0.631,0.004,0.951,0.004c0.362,2.11,0.473,3.786,0.947,5.352 c2.41,7.972,4.19,16.244,7.596,23.773c3.168,7.005,9.289,6.901,12.709-0.011c2.932-5.925,5.134-12.395,6.525-18.868 c4.01-18.662,2.675-37.664,2.696-56.567c0.133-118.853,0.314,0.295,0.392-118.558c0.068-103.934,0.013-377.867,0.064-481.801 c0.001-2.781-0.281-6.125,1.073-8.24c4.886-7.634,8.978-15.851,18.168-20.058c5.139-2.352,9.257-7.045,13.652-10.893 c4.267-3.736,8.16-7.904,12.459-11.599c15.452-13.278,26.023-29.619,30.885-49.451c0.909-3.707,2.926-4.598,6.161-5.73 c8.764-3.067,17.943-5.775,25.742-10.598c14.82-9.164,23.822-23.162,28.263-40.071c0.703-2.678,1.909-5.223,2.991-8.122 c11.076,8.596,18.006,9.328,24.489,3.223C369.187,192.953,370.464,184.538,365.949,178.882z M146.765,952.539 c0.498,2.38,0.15,4.934-3.302,4.884c-2.294-0.033-3.176,1.042-3.702,3.217c-0.26,1.076-1.713,2.383-2.793,2.559 c-0.723,0.118-2.36-1.479-2.504-2.467c-0.409-2.804-2.004-3.344-4.384-3.299c-3.709,0.07-7.424,0.116-11.131-0.006 c-3.83-0.126-3.945,2.278-3.981,5.13c-0.038,2.976,0.755,4.826,4.142,4.589c1.477-0.103,2.968,0.015,4.451-0.025 c2.202-0.059,4.543-0.006,4.579,2.901c0.04,3.187-2.477,3.119-4.78,3.068c-1.36-0.03-2.728,0.082-4.08-0.025 c-3.258-0.257-4.5,1.312-4.272,4.425c-0.041,4.353,1.027,8.028-4.883,7.506c-7.022,0.039-7.951,0.802-7.542-7.405 c0.168-3.39-1.192-4.855-4.555-4.524c-0.857,0.085-1.922,0.329-2.555-0.056c-1.2-0.729-2.156-1.861-3.213-2.825 c1.006-1.017,1.944-2.121,3.057-3.004c0.379-0.301,1.199-0.042,1.817-0.044c5.007-0.022,7.131-2.986,5.197-7.646 c-0.393-0.945-1.975-1.785-3.11-1.944c-3.651-0.437-7.442,0.158-11.117-0.121c-3.786-0.387-5.894,0.721-5.698,5.061 c0.045,0.996-1.78,2.077-2.744,3.119c-0.848-1.038-2.451-2.105-2.412-3.108c0.153-3.932-1.445-5.27-5.269-5.225 c-1.017,0.012-2.491-1.899-2.973-3.215c-0.52-1.422-0.127-3.18-0.126-4.791c0.001-5.24-0.002-5.268,5.3-5.954 c2.366-0.306,3.023-1.787,2.927-3.889c-0.098-2.143,0.268-4.425,2.848-4.073c1.034,0.141,2.342,2.528,2.49,3.998 c0.282,2.788,1.314,4.039,4.131,3.976c3.956-0.088,7.919-0.125,11.872,0.011c3.063,0.105,4.168-1.204,4.13-4.212 c-0.035-2.816-0.326-5.041-3.916-4.755c-2.559,0.203-4.468-0.474-4.367-3.527c0.095-2.865,2.016-3.344,4.358-3.173 c2.898,0.212,3.849-1.243,3.979-4.019c0.085-1.821,0.73-5.002,1.563-5.153c3.046-0.553,6.308-0.31,9.408,0.165 c0.646,0.099,1.284,2.453,1.345,3.795c0.224,4.967,0.375,5.207,5.402,5.214c1.361,0.002,2.928-0.423,4.027,0.116 c1.272,0.623,2.94,2.09,2.943,3.194c0.002,1.125-1.621,2.815-2.876,3.241c-1.666,0.565-3.668,0.223-5.518,0.132 c-3.18-0.157-3.971,1.57-3.952,4.398c0.019,2.703,0.495,4.64,3.783,4.569c3.957-0.085,7.916-0.055,11.874-0.012 c2.166,0.024,3.322-0.763,3.826-3.068c0.242-1.105,1.771-1.927,2.718-2.877c0.905,0.971,2.333,1.814,2.605,2.939 c0.545,2.256,1.757,2.7,3.843,3.111C149.469,944.566,146.104,949.379,146.765,952.539z M252.621,98.898 c0.287-0.167,0.574-0.334,0.861-0.502c2.841,6.521,5.683,13.042,8.739,20.056c-4.719,1.002-8.414,1.787-12.443,2.642 C250.758,113.446,251.689,106.172,252.621,98.898z M184.136,46.188c29.823,0,54,24.177,54,54c0,29.823-24.177,54-54,54 s-54-24.177-54-54C130.136,70.365,154.313,46.188,184.136,46.188z M162.097,165.903c14.218,3.796,27.946,4.565,42.414-0.072 c-3.942,14.414-4.001,28.063,0.302,42.583c-14.189-3.96-27.779-4.487-42.527-0.062C166.547,193.78,166.444,180.286,162.097,165.903 z M114.049,99.643c0.292,0.134,0.583,0.269,0.875,0.403c1.095,7.133,2.19,14.267,3.378,22.01 c-3.852-0.843-7.747-1.695-12.458-2.726C108.69,112.502,111.369,106.072,114.049,99.643z M114.09,275.17 c-2.992-7.299-5.446-13.283-8.044-19.622c4.192-0.951,7.557-1.714,11.303-2.564C116.293,260.174,115.314,266.84,114.09,275.17z  M97.136,240.188c-29.823,0-54-24.177-54-54c0-29.823,24.177-54,54-54s54,24.177,54,54 C151.136,216.012,126.96,240.188,97.136,240.188z M190.317,961.816c-2.889,3.631-2.59,7.316-2.675,11.229 c-0.063,2.929-0.301,6.185-4.102,6.083c-3.718-0.099-3.92-3.373-3.912-6.266c0.01-3.961,0.532-7.956-2.966-11.069 c-0.843-0.75-0.86-2.433-1.653-4.938c1.737-1.842,3.427-4.577,5.876-5.996c3.218-1.864,7.078-0.801,8.743,2.361 C190.908,955.651,191.666,960.12,190.317,961.816z M190.377,894.286c-2.75,3.639-2.754,7.277-2.731,11.231 c0.017,2.954-0.303,6.162-3.967,6.219c-3.722,0.058-4.036-3.156-4.069-6.118c-0.044-3.915,0.729-7.982-2.898-11.07 c-0.855-0.728-0.902-2.408-1.792-5.047c1.877-1.885,3.726-5.163,6.313-5.925c2.41-0.711,6.606,0.411,8.177,2.279 C190.999,887.744,191.681,892.56,190.377,894.286z M190.399,830.196c-3.107,3.329-2.592,6.926-2.795,10.682 c-0.086,1.597-0.323,3.33-1.04,4.717c-1.41,2.725-4.298,2.744-5.822,0.114c-0.63-1.087-1.04-2.453-1.075-3.706 c-0.125-4.43,0.653-9.009-3.304-12.472c-0.62-0.543-0.572-1.852-0.833-2.806c-0.315-0.34-0.629-0.679-0.944-1.019 c2.103-2.244,3.85-5.571,6.413-6.415c2.391-0.788,6.184,0.324,8.392,1.933C192.319,823.355,192.864,827.555,190.399,830.196z  M184.136,328.188c-29.823,0-54-24.177-54-54c0-29.823,24.177-54,54-54s54,24.177,54,54 C238.136,304.012,213.96,328.188,184.136,328.188z M252.789,277.752c-0.265-0.133-0.531-0.265-0.796-0.398 c-1.015-8.257-2.029-16.515-3.086-25.115c4.167,0.862,8.324,1.721,13.585,2.809C259.162,262.841,255.975,270.297,252.789,277.752z  M271.136,240.188c-29.823,0-54-24.177-54-54c0-29.823,24.177-54,54-54c29.823,0,54,24.177,54,54 C325.137,216.012,300.96,240.188,271.136,240.188z",
    clocks: {
      size: 108,
      0:    {x: 184.245, y: 100},
      1:    {x: 97.245, y: 186},
      2:    {x: 271.245, y: 186},
      3:    {x: 184.245, y: 274}
    }
  },
  5: {
    height: 1148.657,
    width:  368.698,
    path:   "M364.919,177.185c-5.856-6.593-15.147-6.888-21.897-0.694c-3.717,3.411-4.299,3.242-5.541-1.587 c-0.25-0.972-0.571-1.926-0.803-2.901c-6.223-26.032-22.396-42.736-47.523-51.238c-2.474-0.837-4.808-2.72-6.666-4.641 c-6.618-6.844-12.426-14.598-19.638-20.709c-7.25-6.144-14.426-11.753-15.964-21.863c-0.145-0.952-0.81-1.83-1.262-2.728 c-10.14-20.142-26.293-32.5-48.2-37.503c-2.572-0.587-5.014-1.743-8.025-2.817c1.316-1.702,1.86-2.531,2.526-3.247 c6.502-6.986,6.698-15.783,0.465-21.94c-5.785-5.714-15.027-5.762-20.84-0.11c-6.368,6.191-6.436,15.084,0.239,21.857 c2.991,3.035,1.728,4.561-1.167,5.98c-1.334,0.654-2.844,0.952-4.281,1.387c-24.857,7.514-40.936,23.712-48.399,48.654 c-0.748,2.499-2.69,4.83-4.561,6.77c-8.684,9.004-17.485,17.897-26.377,26.695c-1.782,1.764-3.95,3.591-6.269,4.287 c-27.272,8.186-44.245,25.906-50.386,53.864c-0.306,1.391-0.752,2.75-1.182,4.299c-11.942-8.326-18.43-8.891-24.733-2.424 c-5.16,5.294-6.085,13.716-1.351,19.24c2.253,2.629,5.655,4.841,8.962,5.874c6.77,2.115,12.009-1.8,16.717-6.757 c0.647,1.364,1.068,1.923,1.182,2.539c5.495,29.672,22.939,48.289,51.806,56.504c1.891,0.538,3.666,2.056,5.112,3.503 c8.725,8.731,17.397,17.519,25.942,26.426c1.755,1.83,3.532,4.061,4.227,6.423c5.507,18.702,16.574,32.696,33.076,43.228 c6.667,4.255,11.428,11.52,16.987,17.48c0.5,0.535,0.688,1.544,0.692,2.334c0.044,10.877,0.03,21.753,0.03,32.638 c-1.577,0.516-2.845,0.932-4.113,1.346c-17.135,5.597-30.511,16.033-39.024,31.952c-3.426,6.407-5.333,13.646-7.754,20.57 c-1.76,5.033-3.129,5.54-6.907,2.08c-2.706-2.478-6.172-4.068-9.837-4.235c-8.598-0.392-15.176,6.223-15.67,13.97 c-0.384,6.021,2.865,11.744,8.198,14.44c5.638,2.851,12.01,2.021,16.818-2.189c2.562-2.243,5.668-1.656,6.923,1.51 c1.187,2.993,1.799,6.229,3.124,9.149c2.549,5.62,4.886,11.444,8.247,16.568c9.497,14.478,39.422,28.018,39.422,28.018v28.542 c0,0-0.496,0.466-0.788,0.469c-5.522,0.049-11.045,0.088-16.568,0.095c-9.805,0.013-10.191,0.382-10.188,9.959 c0.001,2.347-0.002,4.695,0,7.042c0.008,7.059,1.061,8.147,7.942,8.157c6.643,0.01,13.286,0.002,20.223,0.002 c-0.115,2.368-0.198,4.098-0.292,6.035c-7.528,0-14.546,0.054-21.562-0.02c-3.56-0.037-6.383,2.854-6.323,6.415 c0.064,3.826-0.011,7.654,0.01,11.481c0.033,5.918,1.364,7.248,7.324,7.269c6.815,0.024,21.22,0.006,21.22,0.006v7.044 c0,0-14.435-0.017-21.108,0.005c-6.069,0.02-7.373,1.289-7.434,7.19c-0.028,2.682,0.18,5.38-0.039,8.044 c-0.443,5.389,0.07,10.039,6.912,10.524c-3.015,31.457-2.572,62.398,2.234,93.196c2.98,19.097,7.19,37.854,16.599,55.063 c1.443,2.639,2.397,5.924,2.406,8.914c0.209,63.543,0.251,127.087,0.325,190.631c0.002,1.795,0,3.59,0,5.442 c-5.238,0.679-7.397-1.369-7.347-5.986c0.035-3.185,0.024-6.371,0.006-9.557c-0.034-5.945-1.325-7.274-7.309-7.285 c-17.074-0.032-34.148-0.022-51.222-0.026c-11.718-0.003-23.435-0.029-35.153,0.013c-5.235,0.019-6.699,1.54-6.756,6.814 c-0.038,3.521-0.04,7.042,0.004,10.563c0.066,5.255,1.516,6.725,6.823,6.744c11.215,0.04,22.431,0.01,33.646,0.013 c11.868,0.003,11.868,0.005,11.75,11.912c-0.059,5.922-1.3,7.16-7.407,7.176c-12.22,0.031-24.439,0.018-36.659,0.029 c-7.054,0.006-8.155,1.08-8.167,7.935c-0.004,2.18-0.006,4.359,0.001,6.539c0.021,6.383,1.222,7.644,7.439,7.655 c11.048,0.02,22.096,0.002,33.144,0.006c11.791,0.005,11.791,0.008,11.648,12.012c-0.067,5.703-1.367,7.062-7.047,7.083 c-10.378,0.04-20.758,0.096-31.135-0.002c-15.122-0.144-14.146-0.478-14.047,14.132c0.038,5.646,1.377,6.992,7.074,7.008 c11.048,0.031,22.096,0.007,33.144,0.01c12.19,0.003,12.19,0.005,12.011,12.153c-0.083,5.597-1.413,6.924-7.187,6.944 c-10.211,0.034-20.423,0.089-30.633-0.001c-15.773-0.139-14.465-0.577-14.406,14.774c0.024,6.173,1.313,7.37,7.73,7.375 c13.726,0.011,27.452,0.005,41.179,0.003c14.898-0.002,29.796,0.018,44.694-0.027c5.339-0.016,6.767-1.487,6.831-6.742 c0.033-2.682-0.046-5.366,0.02-8.047c0.126-5.106,1.839-6.469,8.044-5.697c0,5.722-0.455,11.611,0.097,17.404 c1.078,11.308,2.634,22.631,8.667,32.623c3.709,6.143,9.563,5.816,12.753-0.612c2.984-6.015,5.833-12.625,6.409-19.174 c1.579-17.969,2.543-36.045,2.614-54.083c0.36-91.878,0.35-183.757,0.553-275.636c0.005-2.049,0.733-4.214,1.576-6.124 c3.369-7.639,7.748-14.934,10.257-22.833c11.421-35.946,13.433-72.997,11.755-110.391c-0.269-5.99-0.801-11.968-1.209-17.909 c7.452-1.534,7.775-1.945,7.779-9.588c0.001-2.515,0.011-5.03,0.007-7.545c-0.013-7.75-0.894-8.656-8.46-8.663 c-7.141-0.007-22.406-0.001-22.406-0.001v-7.045c0,0,16.742-0.048,24.561,0.019c4.359,0.038,6.392-2,6.312-6.351 c-0.071-3.855,0.016-7.712-0.019-11.568c-0.053-5.938-1.345-7.219-7.35-7.242c-7.485-0.029-22.504-0.007-22.504-0.007v-6.035 c0,0,15.454,0.033,22.967-0.011c5.362-0.031,6.803-1.454,6.876-6.683c0.049-3.52,0.028-7.042,0.018-10.563 c-0.019-6.708-1.157-7.881-7.7-7.895c-7.319-0.016-21.161-0.004-21.161-0.004v-28.963c0,0,51.319-18.506,51.418-58.803 c13.274,8.8,19.828,9.143,25.982,1.96c4.843-5.653,4.919-13.758,0.181-19.362c-6.121-7.24-12.687-6.904-26.259,1.909 c-5.709-30.27-22.672-50.541-52.587-59.137c0-11.198-0.038-22.249,0.053-33.298c0.01-1.247,0.394-2.826,1.206-3.677 c5.143-5.394,9.736-11.741,15.851-15.695c15.582-10.074,26.618-23.168,32.069-40.997c0.628-2.052,2.154-4.251,3.897-5.472 c12.064-8.448,22.297-18.658,30.858-30.639c1.235-1.728,3.009-3,5.027-3.661c25.276-8.284,41.218-25.241,47.865-51.029 c0.549-2.129,1.536-4.145,2.62-7.008c2.028,1.88,3.182,3.03,4.418,4.083c5.813,4.951,14.202,4.893,19.761-0.107 C369.847,192.788,370.428,183.388,364.919,177.185z M252.394,107.492c4.098,3.415,7.887,6.574,11.677,9.733 c-0.404,0.395-0.807,0.791-1.211,1.186c-4.169,0.785-8.338,1.57-13.15,2.476C250.666,116.112,251.516,111.872,252.394,107.492z  M184.406,46c29.823,0,54,24.177,54,54c0,29.823-24.177,54-54,54s-54-24.177-54-54C130.406,70.177,154.583,46,184.406,46z  M162.373,165.581c14.357,4.18,28.096,4.578,42.513,0.199c-4.092,14.47-3.946,28.113,0.227,42.523 c-14.26-4.037-27.868-4.509-42.273-0.152C166.659,193.831,166.896,180.189,162.373,165.581z M115.827,107.593 c1.197,5.466,2.101,9.598,3.149,14.382c-4.547-0.964-8.521-1.806-13.675-2.899C108.835,115.221,111.958,111.814,115.827,107.593z  M43.406,186c0-29.823,24.177-54,54-54s54,24.177,54,54c0,29.823-24.177,54-54,54S43.406,215.823,43.406,186z M115.278,265.909 c-3.402-3.626-6.248-6.661-9.67-10.309c4.662-1.06,8.192-1.862,12.324-2.801C117.071,257.051,116.27,261.011,115.278,265.909z  M238.406,453c0,29.823-24.177,54-54,54s-54-24.177-54-54s24.177-54,54-54S238.406,423.177,238.406,453z M184.406,328 c-29.823,0-54-24.177-54-54c0-29.823,24.177-54,54-54s54,24.177,54,54C238.406,303.823,214.23,328,184.406,328z M251.958,267.927 c-1.167-5.669-2.154-10.46-3.262-15.84c5.154,0.97,9.935,1.87,14.716,2.77c0.446,0.541,0.892,1.082,1.338,1.623 C260.673,260.129,256.595,263.778,251.958,267.927z M271.406,240c-29.823,0-54-24.177-54-54c0-29.823,24.177-54,54-54 c29.823,0,54,24.177,54,54C325.406,215.823,301.23,240,271.406,240z",
    clocks: {
      size: 108,
      0:    {x: 184.245, y: 100},
      1:    {x: 97.245, y: 186},
      2:    {x: 271.245, y: 186},
      3:    {x: 184.245, y: 274},
      4:    {x: 184.245, y: 453}
    }
  },
  6: {
    height: 1148.98,
    width:  370.141,
    path:   "M365.84,176.489c-5.689-5.831-14.774-6.109-20.983-0.642c-4.677,4.118-4.976,4.085-6.414-2.269 c-6.187-27.333-22.732-44.97-49.412-53.347c-1.887-0.593-3.769-2.168-4.983-3.788c-8.33-11.115-18.008-20.785-29.318-28.894 c-1.84-1.32-3.239-3.825-3.948-6.065c-8.013-25.306-24.804-41.278-50.453-47.985c-1.299-0.34-2.628-0.562-3.93-0.89 c-6.029-1.519-6.346-2.456-2.44-7.102c5.378-6.396,4.93-15.201-1.065-20.921c-5.702-5.442-14.806-5.447-20.582-0.013 c-6.006,5.651-6.507,14.545-1.066,20.88c0.962,1.12,2.36,1.865,5.102,3.969c-3.997,1.969-6.466,3.647-9.192,4.455 c-21.058,6.239-37.094,18.816-44.941,39.357c-3.899,10.207-9.562,17.625-17.758,24.394c-6.646,5.489-11.704,12.883-17.615,19.294 c-1.38,1.497-3.203,3.002-5.097,3.546c-28.343,8.127-45.563,26.507-51.567,55.389c-0.195,0.941-0.595,1.84-1.211,3.697 c-4.56-5.357-9.738-8.928-16.367-7.261c-3.226,0.811-6.599,2.778-8.897,5.184c-5.104,5.343-4.779,13.776,0.038,19.336 c6.068,7.004,12.02,6.721,25.619-1.458c0.72,3.007,1.322,5.896,2.106,8.735c7.133,25.831,23.797,42.127,49.404,49.659 c2.498,0.735,4.874,2.61,6.784,4.488c8.593,8.445,17.053,17.028,25.427,25.692c1.767,1.828,3.636,4.007,4.323,6.356 c5.597,19.138,16.997,33.318,33.994,43.913c6.567,4.094,11.118,11.439,16.51,17.374c0.48,0.528,0.534,1.578,0.536,2.386 c0.033,10.743,0.022,21.486,0.022,30.697c-9.552,5.427-18.816,9.569-26.776,15.469c-12.547,9.299-19.949,22.422-23.771,37.578 c-0.68,2.698-2.102,5.208-3.473,8.506c-2.286-2.126-3.461-3.29-4.711-4.367c-6.067-5.231-15.003-4.872-20.573,0.801 c-5.603,5.707-5.839,14.698-0.54,20.569c5.565,6.166,14.515,6.88,20.866,1.665c5.112-4.197,5.412-3.946,8.069,2.516 c3.43,8.344,6.359,17.082,11.089,24.661c8.379,13.426,21.019,21.894,36.078,26.785c1.434,0.466,3.551,2,3.587,3.097 c0.294,8.853,0.165,17.72,0.165,27.124c-7.476,0-14.485-0.043-21.493,0.014c-5.306,0.044-6.687,1.494-6.735,6.878 c-0.033,3.697-0.03,7.394-0.004,11.091c0.042,5.943,1.284,7.157,7.436,7.185c6.702,0.031,13.405,0.007,20.448,0.007 c0,2.034,0,5.598,0,5.598s-13.784-0.034-20.783,0.011c-5.372,0.035-6.799,1.45-6.861,6.724c-0.047,4.026,0.044,8.054-0.023,12.079 c-0.072,4.325,1.898,6.385,6.299,6.345c6.876-0.063,13.753,0.049,20.629,0.113c0.289,0.003,1.739,0.534,1.739,0.534v6.407 c0,0-14.692-0.032-21.682,0.01c-5.652,0.034-7.334,1.395-6.872,7.119c0.694,8.601-1.289,15.249-8.006,21.638 c-8.605,8.185-13.036,19.34-15.463,31.089c-1.309,6.335-2.096,6.555-6.889,2.398c-6.287-5.453-15.195-5.103-20.871,0.819 c-5.657,5.902-5.624,15.003,0.076,20.896c5.702,5.895,14.51,6.153,20.855,0.613c1.117-0.975,2.238-1.945,4.238-3.682 c1.129,2.807,2.274,4.924,2.843,7.186c4.769,18.938,15.137,33.728,31.864,44.051c1.736,1.072,3.27,3.377,3.775,5.392 c3.397,13.548,7.363,26.834,14.685,38.904c0.804,1.325,1.03,3.177,1.033,4.786c0.118,64.926,0.18,129.852,0.239,194.778 c0.001,0.981-0.122,1.963-0.184,2.894c-5.249,0.709-6.974-0.588-7.13-5.358c-0.109-3.352-0.003-6.71-0.024-10.065 c-0.036-5.705-1.357-7.092-7.019-7.099c-21.978-0.026-43.956-0.012-65.933-0.011c-7.046,0-14.094,0.1-21.138-0.026 c-4.635-0.083-6.728,2.003-6.589,6.633c0.109,3.639,0.121,7.278-0.002,10.917c-0.157,4.646,1.947,6.703,6.575,6.67 c12.75-0.09,25.501-0.045,38.251-0.028c6.305,0.008,7.513,1.253,7.533,7.599c0.038,11.525,0.038,11.526-11.68,11.525 c-11.24-0.001-22.481-0.03-33.722,0.007c-5.418,0.018-6.914,1.437-6.931,6.666c-0.053,16.568-1.437,15.572,15.235,15.484 c10.066-0.053,20.132-0.038,30.198,0.002c5.373,0.021,6.796,1.457,6.905,6.697c0.259,12.419,0.259,12.42-12.268,12.419 c-11.073,0-22.146-0.028-33.218,0.011c-5.319,0.019-6.822,1.501-6.857,6.738c-0.102,15.018-1.068,14.544,14.31,14.408 c10.401-0.092,20.803-0.047,31.205-0.005c5.279,0.022,6.729,1.522,6.828,6.773c0.234,12.342,0.234,12.342-12.345,12.342 c-11.073,0-22.146-0.031-33.218,0.012c-5.25,0.02-6.76,1.539-6.779,6.814c-0.06,16.24-1.382,15.39,14.882,15.343 c26.004-0.075,52.009-0.015,78.013-0.024c6.592-0.002,7.763-1.211,7.767-7.876c0.001-2.349-0.056-4.699,0.01-7.046 c0.144-5.087,1.794-6.38,6.391-5.865c1.57,11.962,2.907,23.747,4.765,35.449c0.647,4.073,1.998,8.292,4.104,11.797 c1.828,3.041,5.159,7.119,7.859,7.143c2.656,0.024,6.805-4.019,7.763-7.073c3.09-9.85,6.148-19.959,7.106-30.167 c1.295-13.794,0.763-27.772,0.787-41.671c0.158-91.433,0.238-182.866,0.46-274.299c0.006-2.499,0.844-5.29,2.131-7.444 c7.151-11.972,11.314-25.021,14.283-38.502c0.767-3.483,2.275-5.895,5.318-7.958c14.472-9.809,23.801-23.321,28.184-40.279 c0.711-2.753,1.981-5.361,3.281-8.798c2.096,1.947,3.257,3.114,4.508,4.173c6.274,5.312,15.319,4.747,20.867-1.276 c5.371-5.83,5.28-14.718-0.209-20.541c-5.593-5.933-14.657-6.313-20.861-0.875c-4.91,4.304-5.502,4.183-6.871-2.32 c-2.843-13.501-9.129-25.091-18.636-35.051c-1.059-1.109-1.624-3.064-1.703-4.662c-0.225-4.519-0.177-9.058-0.049-13.584 c0.13-4.584-1.863-6.712-6.52-6.641c-7.688,0.117-23.46,0.032-23.46,0.032v-7.081c0,0,15.513,0.035,23.187-0.012 c5.264-0.032,6.699-1.51,6.757-6.834c0.042-3.858,0.047-7.718-0.001-11.576c-0.066-5.278-1.476-6.669-6.885-6.701 c-7.529-0.044-22.059-0.011-22.059-0.011v-6.073c0,0,14.421,0.036,22.088-0.012c5.373-0.034,6.792-1.451,6.855-6.73 c0.048-4.026-0.055-8.054,0.028-12.079c0.089-4.361-1.944-6.374-6.308-6.332c-7.707,0.073-23.662,0.021-23.662,0.021 s0-18.743,0-28.6c29.397-8.459,46.462-28.621,52.535-59.535c5.681,5.182,10.784,9.539,17.649,7.382 c3.324-1.045,6.767-3.214,9.025-5.845c4.929-5.744,3.921-14.326-1.559-19.637c-6.511-6.312-13.714-5.558-25.117,3.388 c-5.85-30.371-22.706-50.809-52.896-59.482c0-11.328-1.021-22.855,0.356-34.088c0.927-7.564,7.385-13.291,13.943-17.092 c17.546-10.17,29.776-24.263,35.419-43.925c0.495-1.726,2.182-3.403,3.745-4.482c12.023-8.304,22.113-18.494,30.667-30.315 c1.255-1.734,3.402-3.24,5.446-3.923c25.095-8.384,41.101-25.168,47.682-50.873c0.553-2.159,1.517-4.212,2.638-7.26 c1.992,1.814,3.143,2.911,4.345,3.949c6.307,5.446,15.194,5.081,20.928-0.844C371.579,191.607,371.538,182.33,365.84,176.489z M253.55,107.072c4.157,3.613,7.747,6.732,11.337,9.852c-0.326,0.501-0.652,1.003-0.979,1.504 c-4.182,0.798-8.365,1.596-13.163,2.512C251.718,116.132,252.577,111.882,253.55,107.072z M185.289,45.98c29.823,0,54,24.177,54,54 c0,29.823-24.177,54-54,54s-54-24.177-54-54C131.289,70.157,155.466,45.98,185.289,45.98z M164.151,165.773 c13.581,4.334,27.363,4.22,41.777,0.199c-4.474,14.48-3.87,28.139,0.027,42.429c-14.232-4.098-27.748-4.399-41.531-0.444 c0.777-7.312,2.093-14.066,2.044-20.809C166.419,180.244,165.032,173.349,164.151,165.773z M116.538,107.809 c1.209,5.322,2.145,9.436,3.252,14.311c-4.762-1.06-8.731-1.943-13.791-3.07C109.65,115.157,112.775,111.823,116.538,107.809z M98.289,239.98c-29.823,0-54-24.177-54-54c0-29.823,24.177-54,54-54s54,24.177,54,54 C152.289,215.804,128.113,239.98,98.289,239.98z M115.949,265.97c-3.407-3.594-6.205-6.546-9.77-10.308 c5.012-1.059,8.587-1.815,12.604-2.664C117.803,257.484,116.976,261.266,115.949,265.97z M239.289,683.98c0,29.823-24.177,54-54,54 s-54-24.177-54-54s24.177-54,54-54S239.289,654.157,239.289,683.98z M239.289,452.98c0,29.823-24.177,54-54,54s-54-24.177-54-54 s24.177-54,54-54S239.289,423.157,239.289,452.98z M185.289,327.98c-29.823,0-54-24.177-54-54c0-29.823,24.177-54,54-54 s54,24.177,54,54C239.289,303.804,215.113,327.98,185.289,327.98z M253.079,268.69c-1.271-6.405-2.241-11.297-3.279-16.525 c5.356,1.047,10.057,1.966,16.634,3.251C261.644,260.177,257.764,264.034,253.079,268.69z M272.289,239.98 c-29.823,0-54-24.177-54-54c0-29.823,24.177-54,54-54c29.823,0,54,24.177,54,54C326.289,215.804,302.113,239.98,272.289,239.98z",
    clocks: {
      size: 108,
      0:    {x: 185.128, y: 100},
      1:    {x: 98.128, y: 186},
      2:    {x: 272.128, y: 186},
      3:    {x: 185.128, y: 274},
      4:    {x: 185.128, y: 453},
      5:    {x: 185.128, y: 684}
    }
  }
};

export type HbsSvgData = {
  viewBox: string,
  paths: Record<string, string>,
  classes?: Record<string, string>
};

export const SVGDATA = {
  teeth: {
    tall: {
      viewBox: "0 0 512 1540",
      paths:   {
        frame: "M0,0v1540l512-244.2V0H0z M451,1263.5l-390,186V61h390V1263.5z",
        half:  "M0,0v748l512-244.2V0H0z",
        full:  "M0,0v1540l512-244.2V0H0z"
      }
    },
    med: {
      viewBox: "0 0 512 1540",
      paths:   {
        frame: "M0,0v1388l512-395.6V0H0z M458,965.7L54,1278V53h404V965.7z",
        full:  "M0,0v1540l512-244.2V0H0z"
      }
    },
    short: {
      viewBox: "0 0 512 1540",
      paths:   {
        frame: "M0,0v991l511.4-247L512,0H0z M470.5,715.2L41,922.6V40h430L470.5,715.2z",
        full:  "M0,0v991l511.4-247L512,0H0z"
      }
    }
  },
  armor: {
    viewBox: "0 0 512 512",
    paths:   {
      heavy:     "M157.5,80.7c-20.6,13.7-46,22.5-69.4,26c6.8,48.9,26.1,84.1,46,97.8 c10.5,7.3,20.4,9,30.4,5.6c8.9-3.1,18.6-11,27.8-25.6C165.3,154.3,160.6,113.5,157.5,80.7L157.5,80.7z M354.5,80.8 c-3.1,32.8-7.8,73.6-34.7,103.8c9.1,14.6,18.9,22.5,27.8,25.6c10,3.4,19.8,1.7,30.4-5.6c19.8-13.7,39.1-48.8,45.9-97.7 C399.3,103.7,376,95.5,354.5,80.8L354.5,80.8z M254.4,67.9c-37.1,0-69.8,8.3-89.6,21c1.2,6.5,2.6,13,4.2,19.3 c19.2-8.2,50.3-16.7,85.4-16.7c35.2,0,66.3,8.5,85.4,16.7c1.7-6.3,3.1-12.8,4.2-19.3C324.2,76.2,291.5,67.9,254.4,67.9z M64.9,127.9l-47.7,45.5c29.8,37.2,63,56.8,86.5,58.7c1.1,0.1,2.3,0.1,3.3,0.2c1.8-7.6,4-15.1,6.5-22.3 C91.7,194.9,74.4,166.1,64.9,127.9L64.9,127.9z M447.1,127.9c-9.6,38.3-26.9,67-48.6,82c0,0-0.1,0-0.1,0.1 c2.5,7.3,4.7,14.7,6.5,22.3c1.1,0,2.2-0.1,3.4-0.2c23.4-1.9,56.8-21.5,86.5-58.7L447.1,127.9L447.1,127.9z M176,139.4 c5.7,12.2,13.1,23.3,22.9,32.8l6.4,6.2l-4.3,7.8c-2.3,4.1-4.6,8-7,11.7c40.8,15,85,14,124-0.2c-2.4-3.6-4.6-7.4-6.9-11.4l-4.3-7.8 l6.4-6.2c9.4-9.1,16.7-19.9,22.3-31.5C280.8,153.8,228.5,151.3,176,139.4L176,139.4z M401.7,243.6c0,0-3.7,38.1-22.9,76.1 l-121.7-32.7l-1.8-0.4l-1.8,0.4l-120.3,32.7c-19-38-22.7-76.1-22.7-76.1s12,3.8,19.5-18.7c10.7,3.2,22,3.3,32.8-0.4 c9.2-3.2,17.8-8.8,25.8-16.9c21.6,8.9,44.2,13.1,66.7,13.1c22.7,0,45.6-4.2,67.4-13.1c8,8,16.8,13.7,26.1,16.9 c10.9,3.7,22.3,3.6,33.1,0.4C389.6,247.4,401.7,243.6,401.7,243.6z M486.1,210.7c-25.4,24.2-52.1,38-76.2,40c-0.4,0-0.9,0-1.3,0.1 c1.2,8.1,2,16.2,2.3,24.4c22.8,3.8,54.7,0.1,90-14.3L486.1,210.7L486.1,210.7z M25.9,210.8l-14.8,50.1c35.3,14.4,67.2,18.1,90,14.3 c0.3-8.2,1.1-16.3,2.3-24.4c-0.4,0-0.9,0-1.3-0.1C78,248.7,51.3,234.9,25.9,210.8L25.9,210.8z M256,305.2l-114.8,28.1 c1.9,7.7,10.1,17.6,15.4,23.8c31.8-7.3,59.3-11.4,94.7-11.6c2.6,0,5.3,0,7.9,0c38.2,0.3,64.9,4.3,95.9,11.6 c5.1-6.2,15.2-15.8,16.8-23.6L256,305.2L256,305.2z M254.1,347.8l-79.3,22.1c5.8,4.8,16,8.5,23.2,13.3c18-5,33.5-7.8,53.5-7.9 c1.5,0,3,0,4.5,0c21.6,0.2,36.6,3,54.1,7.9c9.9-1.8,16.8-6.8,25.5-12.3L254.1,347.8L254.1,347.8z M373.3,377.7 c-68.3,55.6-166.9,55.7-235.3,0.3l-1.8,35.9c4.7,7.9,18.3,17,38,23c21,6.4,48,9.9,75.6,10.2c27.6,0.3,55.8-2.6,79.4-8.7 c21.6-5.6,39.3-14.2,48.8-23.9L373.3,377.7L373.3,377.7z",
      light:     "M254.9,88c-23.1,0-44.1,2.8-59.8,8.8c-7.9,3-14.5,6.8-19.5,11.9c-5,5.1-8.4,12.1-8.4,19.9 c0,3.2,0.5,6.2,1.5,9.1c2,37.1-20.9,83.9-46,107.5c5.9,35.9,19.4,72.7,39.6,106.3c23.8,23,54.6,35.4,85.9,37.1v-24 c-9.6-0.1-19-0.5-26.5-1.1l0.8-13.2c7.1,0.6,16.2,1,25.7,1.1v-28.3c-9.1,0.4-17.9,1.8-24.4,4.2l-3.3-12.7 c8.1-2.9,17.8-4.6,27.7-5.1v-23.8c-2.9,0.2-5.8,0.5-8.7,1c-17.2,1-31.8,3.6-45.2,7.5l-0.1-0.2c16.7-14.8,38.1-22.2,59.6-22.2 c21.4,0,42.9,7.4,59.6,22.2l-0.1,0.1c-13.4-3.9-28.1-6.5-45.4-7.5c-2.8-0.5-5.7-0.8-8.5-1v23.8c10,0.5,19.7,2.1,27.7,5.1l-3.3,12.7 c-6.6-2.4-15.4-3.8-24.5-4.2v28.3c9.4-0.1,18.6-0.4,25.7-1.1l0.8,13.2c-7.5,0.7-16.9,1-26.5,1.1v24.1c32.4-0.8,64.6-13,89.4-36.5 c21.1-33.6,34.9-69.9,40.8-105.3c-26.2-23.2-50.7-72.5-47.8-110.7c0.7-2.5,1-5,1-7.7c0-7.8-3.4-14.8-8.4-19.9 c-5-5.1-11.7-8.9-19.6-11.9C298.9,90.8,278,88,254.9,88L254.9,88z M254.9,101.3c22.3,0,42.5,2.9,56.4,8.2c7,2.7,12.4,6,15.7,9.3 c3.3,3.4,4.5,6.3,4.5,9.9c0,1.8-0.3,3.6-1.1,5.5c-21.9-11.9-49.3-17.9-76.7-17.9c-26.6,0-53.2,5.6-74.7,16.8 c-0.5-1.5-0.7-2.9-0.7-4.4c0-3.5,1.2-6.5,4.5-9.9c3.3-3.4,8.7-6.7,15.7-9.3C212.4,104.1,232.6,101.3,254.9,101.3L254.9,101.3z M253.7,130c24.6,0,49.2,4.8,68.6,14.3c-3.1,2.6-6.9,5.1-11.4,7.3c-13.9,7-33.9,11.5-56,11.5s-42-4.5-56-11.5 c-4.9-2.4-9-5.2-12.2-8C205.8,134.5,229.7,130,253.7,130z M232.3,174.9c3.7,0.5,7.5,0.9,11.4,1.2c0.5,3.6,1,7.5,1.6,11.8 c1.6,13,3.3,27.9,3.3,37.5c0,10.8-3.5,20.6-9.5,28.1c-6.1,7.5-14.5,13-24.6,16.5c-11.2,3.9-24.5,5.6-39.3,4.8 c-14.2-2.5-25.1-9.3-35.7-19.6c29.1,8.3,54.5,8.2,71.9,2.1c8.7-3.1,15.4-7.6,19.7-13c4.3-5.4,6.5-11.4,6.5-18.9 c0-7.7-1.6-22.8-3.1-35.6C233.6,184.1,232.9,179,232.3,174.9L232.3,174.9z M275,175.2c-0.6,4-1.3,9-2,14.6 c-1.6,12.7-3.1,27.9-3.1,35.6c0,7.5,2.1,13.6,6.5,18.9c4.3,5.4,11,9.9,19.7,13c17.3,6.1,42.6,6.2,71.6-2.1 c-10.6,10.3-21.5,17.1-35.7,19.6c-14.8,0.8-28-0.9-39.1-4.8c-10.1-3.5-18.5-9-24.6-16.5s-9.5-17.3-9.5-28.1 c0-9.7,1.7-24.6,3.3-37.5c0.5-4.3,1.1-8.2,1.5-11.7C267.4,176,271.2,175.7,275,175.2L275,175.2z M347.1,370.2 c-52.9,43.1-129.3,43.2-182.3,0.3l-1.4,27.8c3.6,6.1,14.2,13.2,29.4,17.8c16.3,4.9,37.2,7.7,58.5,7.9c21.4,0.2,43.2-2,61.5-6.7 c16.8-4.3,30.4-11,37.8-18.5L347.1,370.2L347.1,370.2z",
      special:   "M256,14.2c-65.6,98.3-131.1,90.2-196.7,106.5c0,262.3,65.6,327.8,196.7,377 c131.1-49.2,196.7-114.7,196.7-377C387.1,104.4,321.6,112.6,256,14.2z M256,47c5.1,0,9.2,4.1,9.2,9.2s-4.1,9.2-9.2,9.2 s-9.2-4.1-9.2-9.2S250.9,47,256,47z M70.6,138.2c0-5.1,4.1-9.2,9.2-9.2s9.2,4.1,9.2,9.2s-4.1,9.2-9.2,9.2S70.6,143.3,70.6,138.2z M92.1,301.1c-5.1,0-9.2-4.1-9.2-9.2c0-5.1,4.1-9.2,9.2-9.2s9.2,4.1,9.2,9.2C101.3,296.9,97.2,301.1,92.1,301.1z M157.7,432.2 c-5.1,0-9.2-4.1-9.2-9.2c0-5.1,4.1-9.2,9.2-9.2s9.2,4.1,9.2,9.2C166.9,428.1,162.7,432.2,157.7,432.2z M256,483.4 c-5.1,0-9.2-4.1-9.2-9.2s4.1-9.2,9.2-9.2s9.2,4.1,9.2,9.2S261.1,483.4,256,483.4z M354.3,432.2c-5.1,0-9.2-4.1-9.2-9.2 c0-5.1,4.1-9.2,9.2-9.2c5.1,0,9.2,4.1,9.2,9.2C363.6,428.1,359.4,432.2,354.3,432.2z M314.4,426.7c-15.8,11.1-33.7,18.7-51.1,26.8 c-6.7,4.7-14-0.5-20.7-2.5c-44.7-18.3-86.5-49.8-107.6-94.5c-29.8-63.5-33.8-135-36.7-204.3c58.8-9,115.3-28.5,156.2-72.1l1.9-2.1 c4.5,5,9.3,9.8,14.2,14.5c35.8,36.3,85,47,133.9,57.8c2.8,1.2,6.8,0.5,9.1,2c-2.7,66.4-5.7,134.9-33.1,196.4 C367.3,380.9,343.2,407.7,314.4,426.7z M419.9,301.1c-5.1,0-9.2-4.1-9.2-9.2c0-5.1,4.1-9.2,9.2-9.2s9.2,4.1,9.2,9.2 C429.1,296.9,425,301.1,419.9,301.1z M432.2,147.4c-5.1,0-9.2-4.1-9.2-9.2s4.1-9.2,9.2-9.2s9.2,4.1,9.2,9.2 S437.3,147.4,432.2,147.4z M301.1,154.9c0.2,23.3,0.3,46.6,0.5,69.9c0,1,0.4,2.2,0.9,3.1c4.9,8.4,9.8,16.9,15,25.1 c1.6,2.6,0.8,5.1,0.6,7.6c-0.7,9.5-1.7,19-2.6,28.5c-1,10.5-2,21-3,31.6c-0.8,9-1.6,17.9-2.4,26.9c-0.8,9-1.7,17.9-2.5,26.9 c-0.7,7.3-1.3,14.6-2,22c-0.1,1.2-0.6,2.7-1.4,3.6c-12,12-24.1,23.9-36.2,35.9c-0.2,0.2-0.5,0.5-1.1,1c0-1.1,0-1.8,0-2.5 c0.1-66.5,0.3-133,0.5-199.5c0-1.5,0.8-3.2,1.7-4.4c2.2-2.9,2.8-6,2.8-9.6c0-28.5,0.1-57.1,0.2-85.6c0-0.7,0-1.5,0-2.5 c0.8,0,1.5-0.1,2.3-0.1c13.9,0.1,27.8,0.1,41.7,0.1c1.2,0,1.9,0.3,2.3,1.5c0.8,2.2,1.7,4.3,2.7,6.6c-6.2,3.9-12.2,7.6-18.2,11.3 C301.6,152.6,301.1,153.4,301.1,154.9z M245.2,433.7c0,0.9,0,1.7,0,2.6c-0.2,0.1-0.4,0.2-0.6,0.3c-1.4-1.5-2.8-3.1-4.3-4.5 c-10.7-10.6-21.5-21.2-32.2-31.9c-0.9-0.9-1.6-2.5-1.7-3.9c-1-9.2-1.8-18.4-2.6-27.5c-0.7-7.2-1.3-14.3-2-21.5 c-0.8-9.2-1.7-18.4-2.6-27.5c-0.7-7.1-1.3-14.2-1.9-21.3c-0.9-9.3-1.7-18.5-2.6-27.8c-0.5-4.9-1-9.9-1.3-14.8 c-0.1-0.7,0.4-1.6,0.8-2.2c5.1-8.6,10.2-17.1,15.2-25.7c0.5-0.9,0.9-2.1,0.9-3.1c0.2-23.2,0.3-46.4,0.5-69.6c0-1.6-0.5-2.5-1.9-3.4 c-6-3.6-11.9-7.3-18-11.2c1-2.5,2-4.9,3.1-7.4c0.2-0.3,0.8-0.6,1.2-0.6c14.6-0.1,29.3-0.1,43.9-0.1c0.1,0,0.3,0.1,0.6,0.3 c0,0.7,0.1,1.5,0.1,2.3c0.1,29.2,0.2,58.4,0.3,87.7c0,2.1,0.3,4,1.7,5.6c2.5,2.9,3,6.2,3,10C244.9,303.4,245.1,368.5,245.2,433.7z",
      specialBg: "M316.9,432.4c-16.5,11.6-35,19.4-53.1,27.8c-7,4.9-14.6-0.5-21.6-2.6 c-46.5-19-90-51.8-111.9-98.3c-31-66.1-35.1-140.5-38.2-212.4c61.2-9.4,119.9-29.6,162.4-75l2-2.1c4.7,5.2,9.6,10.2,14.7,15.1 c37.2,37.7,88.4,48.9,139.2,60.1c2.9,1.3,7.1,0.5,9.4,2.1c-2.9,69.1-5.9,140.3-34.4,204.3C372,384.8,346.8,412.7,316.9,432.4z"
    }
  },
  [ConsequenceType.ReducedEffect]: {
    viewBox: "0 0 512 512",
    paths:   {
      main: "M260.7,487.55C133,487.55,28.39,382.92,28.39,255.23S133,24.45,260.7,24.45A230.5,230.5,0,0,1,491.49,255.23c0,127.69-103.1,232.32-230.78,232.32Zm-1.06-82L377,287.58l-23.94-25.1-65.41,37.94V128a167.28,167.28,0,0,1,103.6,268.91,193.71,193.71,0,0,0,61.22-141.63A191.18,191.18,0,0,0,260.7,63.45c-106.39,0-193.31,85.39-193.31,191.78A192.9,192.9,0,0,0,128,395.55,167.3,167.3,0,0,1,231,128.2V296.92l-62.5-35.62-25.09,26.28Z"
    },
    classes: {
      main: "fill-linear"
    }
  },
  [ConsequenceType.ComplicationMinor]: {
    viewBox: "0 0 512 512",
    paths:   {
      main: "M345.58,263.18l39.74-8.31,73.29-15.3,22.83-4.79,2.81-.58,9.56-2V213.1l-6.33,1.33-79.55,16.62-26.49,5.54-55.93,11.69c-13-11.18-20-24.73-27.16-39.89l-1.67-3.53,34.18-46.76,57.87-79.18,3-4.1,41.19-56.33H409.77L375.26,65.7l-4.09,5.59-60.51,82.78-32.91,45c-15.06-6.36-26.14-17.76-38.57-30.33l-2.34-2.37-4.59-30.28L216.72,33.5l-1-6.47-1.29-8.54h-18.9l2.84,18.75-.11-4.41,15.2,104.1,5.59,37c-11.18,7.5-24.44,12.15-39,15.49l-22.9-28.89L93.8,80.58,44.58,18.49H20.74l53,66.83,4.18,5.26,66.54,84,19.15,24.16-.08.7c-1.93,17.37-8.88,29.63-16.65,43.07L115.3,234.2,25.49,210.61,23.08,210l-4.31-1.14v19.32l2.56.67L112,252.65l27.61,7.25.56,1.4c6.1,15.15,5.39,31.77,2.9,49.71l-30.31,14.2L23.15,367.14l-4.38,2.06v20.62l9.18-4.3,67.92-31.77,17.13-8,28.92-13.54,1.52,1.53c5.85,5.86,10,10.29,11.22,20.75l-31.14,31.3L56.27,453.39l-37.5,37.69v2.43h24l20.91-21h0l77.94-78.36,24.11-24.24,1-.23c23.75-5.79,59.86-6.75,80.11-6.78,4,0,6.81,0,9.35.08l10.4,32.29L293,477.73l1.54,4.78,3.54,11h19.63l-5.19-16.14-2.24-6.95-25.77-80.06-11-34.32c3.55-3.17,8.73-7.63,15-12.42,11.42-8.73,26.21-17.7,35.68-19.62l4.24-.87,25.37,10L442,368.08l4.18,1.66,47.6,18.83V368.48l-37.78-15-5.21-2-82.75-32.74-36.59-14.48c0-13.16,1.4-22.85,9.12-33.93Zm-61.35-41.29c5.12,10.41,11.11,21.1,19.66,30.91l-31.15,6.52a39.69,39.69,0,0,0-6.93-12.22Zm-62.13-28,6,39.74a39.25,39.25,0,0,0-10.25,3.48l-25.18-31.77A132,132,0,0,0,222.1,193.9Zm-43.39,23.92,24.91,31.43a38.6,38.6,0,0,0-4.08,7.07l-33.92-8.92C170.58,238.65,175.45,229.15,178.71,217.82Zm17.49,56.93a39.32,39.32,0,0,0,2.08,10.45L163,301.7c1.05-11.91.92-24.05-2-36.2ZM160,324.27l.09-.55,47.15-22.07h0L169.55,339.5A54.79,54.79,0,0,0,160,324.27Zm28.37,22.85,36.61-36.8a39.43,39.43,0,0,0,10.6,1.45,35.54,35.54,0,0,0,4-.2L250,344.11C236.7,344,212.41,344.2,188.33,347.12ZM250.78,236a35.39,35.39,0,0,0-3.61-1.32L241.46,197a109.45,109.45,0,0,0,25.15,17.38Zm26.37,92.76c-3.9,3-7.1,5.61-9.88,8l-10.1-31.4a39.81,39.81,0,0,0,8.16-7.16l36.5,14.44A169,169,0,0,0,277.15,328.76Zm36-31.76L273.9,281.47c.26-1.14.47-2.29.64-3.44l45.58-9.53C315.5,277.93,313.74,287.39,313.17,297Z"
    },
    classes: {
      main: "fill-radial"
    }
  },
  [ConsequenceType.ComplicationMajor]: {
    viewBox: "0 0 512 512",
    paths:   {
      main: "M458.26,239.57l22.83-4.78,2.81-.59,9.56-2v-19.1l-6.33,1.33-79.55,16.62-26.49,5.54-55.93,11.69c-13-11.18-20-24.73-27.16-39.89l-1.67-3.53,34.18-46.76.58-.79c9.76,28.37,24.84,58.48,51.36,78.35l24.6-5,1.83-.54L407.07,229c-37.27-19.15-50.45-51.64-61.94-88.83l-.44-1.43,43.69-59.78,3-4.1,41.19-56.34H409.42L374.91,65.7l-4.09,5.6-46.71,63.9c-34.73.23-70.42-3-95.76-22.5l-12-79.19-1-6.47-1.29-8.55H195.2L198,37.24l-.11-4.4,12.18,83.44c-17,16.89-39.15,28.73-67.39,26.48L93.45,80.59,44.23,18.49H20.39l53,66.83,4.18,5.27L129,155.51c-3.16,27.24-16.63,53.33-32.88,73.74l-71-18.63L22.73,210l-4.31-1.13v19.32l2.56.67,71.38,18.74c8.29,26.73,6.3,57.28,2.12,86L22.8,367.15l-4.38,2.05v20.63l9.18-4.3,67.92-31.78,1.09-.51A190.52,190.52,0,0,1,104.47,382c1.33,7.25,2.58,14.68,3.19,19.36l-51.74,52-37.5,37.69v2.43H42.37l20.91-21h0l58.27-58.57c10.1-.83,33.7-2.28,59.06-3.17,7.9-.28,16.15-.45,24.46-.47,23.47-.05,49.4,1.12,67.34,4.45l20.27,63,1.54,4.79,3.54,11h19.63l-5.19-16.14L310,470.43,291.2,412.17c23.43-27.05,48.62-54.87,86-69.58l64.45,25.5,4.18,1.65,47.6,18.84v-20.1l-37.78-15-5.21-2.06-62.74-24.82c-3.11-24.21,8.64-50.64,20.2-76.57ZM266.92,336.72l-10.1-31.4a39.76,39.76,0,0,0,8.16-7.15l36.5,14.44a169,169,0,0,0-24.68,16.16C272.9,331.76,269.7,334.38,266.92,336.72Zm-71.07-62a39.17,39.17,0,0,0,2.08,10.44l-35.27,16.5c1.05-11.9.92-24-2-36.19Zm-30.58-27.35c5-8.75,9.83-18.25,13.09-29.59l24.91,31.43a39.28,39.28,0,0,0-4.08,7.07Zm41.58,54.25h0L169.2,339.51a54.79,54.79,0,0,0-9.59-15.23l.09-.56Zm17.74,8.67a39.43,39.43,0,0,0,10.6,1.45,38,38,0,0,0,4-.2l10.47,32.54c-13.32-.16-37.61.08-61.69,3Zm22.23-75.64L241.11,197a109.17,109.17,0,0,0,25.15,17.39L250.43,236A37.88,37.88,0,0,0,246.82,234.69Zm26.73,46.78c.26-1.13.47-2.28.64-3.43l45.58-9.53c-4.62,9.43-6.38,18.89-6.95,28.5Zm30-28.66-31.15,6.51a39.53,39.53,0,0,0-6.93-12.21l18.42-25.21C289,232.31,295,243,303.54,252.81ZM232.78,136.13c23.18,13.26,50.47,17.92,77,18.68l-32.37,44.3c-15.06-6.37-26.14-17.76-38.57-30.33l-2.34-2.37-4.59-30.28,0-.12Zm-5,97.52a39.25,39.25,0,0,0-10.25,3.48l-25.18-31.77a132,132,0,0,0,29.42-11.45Zm-14.52-96,5.48,36.25c-11.18,7.5-24.44,12.15-39.05,15.49l-22.46-28.34C178.25,159.21,198.58,149.44,213.24,137.65Zm-69.67,36.28.5.63,19.15,24.15-.08.71c-1.93,17.37-8.88,29.63-16.65,43.06L115,234.2l-.07,0C127,217.56,138.38,195.1,143.57,173.93ZM123.4,385.56c-.42-2.17-1.06-4.9-1.43-6.92-1.84-10-4.7-23.39-8.85-33.12l28.45-13.32,1.52,1.53c5.85,5.87,10,10.3,11.22,20.75Zm15.89-125.65.56,1.4c6.1,15.14,5.39,31.77,2.9,49.71l-29,13.58c2.87-22.76,3.42-48.28-2.06-71.93h0Zm72.18,131.64h-6.55c-8.5.05-16.9.25-25,.53-15.57.55-28,1.33-37.85,2.07l.07-.07a7.94,7.94,0,0,1-.82-.06l24-24.11,1-.23c23.75-5.79,59.86-6.75,80.11-6.78,4,0,6.81,0,9.35.07l10.29,32C249.77,392.55,229.58,391.66,211.47,391.55Zm73.59-1.18-.71.53-.17-.53-11-34.32c3.55-3.17,8.73-7.63,15-12.42,11.42-8.73,26.21-17.7,35.68-19.63l4.24-.86,25.37,10C324.89,348,303.58,369.47,285.06,390.37ZM368.49,319l-.77-.31-36.59-14.48c0-13.15,1.4-22.84,9.12-33.92l5-7.14L385,254.88l.12,0C376.44,274.07,368.18,297,368.49,319Z"
    },
    classes: {
      main: "fill-radial"
    }
  },
  [ConsequenceType.ComplicationSerious]: {
    viewBox: "0 0 512 512",
    paths:   {
      main: "M21.42,17.34,78.56,89.45c-2.73,48.59-23.75,85.79-52.39,120l-6.72-1.76V227l2.56.67C37.36,272.78,31.1,318.54,23.83,366l-4.38,2.05v20.63l9.18-4.29c6.52,10.7,13.66,27,19.06,41.33,4.29,11.33,7.48,21,9.26,26.53l-37.5,37.69v2.43h24L72,463.67c9.27-.36,41.77-1.47,82.7-.75,46.74.83,102.61,4.3,139,13.67l5.08,15.78h19.63L311,469.28c35.94-41.51,71.91-80.52,131.73-102.34l51.78,20.49v-20.1l-43-17c-6.37-39.21,12.76-76.67,30.62-116.68l12.37-2.59V212l-6.33,1.32-5.45-2.8c-56.09-28.83-76.33-78-93.3-132.7L433.6,17.34H410.45l-38.6,52.81c-58.28,1.26-112.48-2.46-154.45-37.79l-2.27-15h-18.9l2.83,18.75c-27.13,29-57.56,48-104.58,43.36L45.26,17.34Zm199.92,41c40.6,26.3,88.49,30.89,136.75,30.63L325,134.32c-36.59.39-69.86-3-95.85-24.64l-7.76-51.33Zm-18.84.44,8.29,54.77c-17.81,18.62-37.29,30.18-68,26.86L109.72,98.68c38.59-.74,68.36-17.15,92.78-39.89ZM375.83,96.38c15.53,47,37.05,92.69,84.55,122.72l-51.77,10.82-.82-.42c-37.27-19.14-50.44-51.64-61.93-88.83l-.72-2.31,30.68-42ZM95.09,110.3l34.39,43.39c-2.52,29.59-15.41,52.66-33.14,74.21L45.93,214.67c23.72-29.78,42.64-63.39,49.16-104.37ZM232.93,135c23.94,13.69,51.05,17.4,78.41,17.94l-32.91,45c-15.06-6.36-26.14-17.75-38.57-30.32l-2.35-2.37L232.93,135Zm-18.77.81,5.59,36.95c-11.18,7.5-24.44,12.15-39.05,15.49l-22.9-28.89c22.71-1.4,41.09-10.68,56.36-23.55ZM331.54,157c9.74,29.15,23.14,58,50.58,78.49l-55.93,11.69c-13-11.18-20-24.74-27.16-39.89l-1.67-3.53ZM145.1,173.41l19.15,24.16-.08.71c-1.93,17.36-8.88,29.63-16.65,43.06L116,233.06c13.21-17.36,23.94-36.83,29.12-59.65Zm77.68,19.35,6,39.75A38.88,38.88,0,0,0,218.54,236l-25.18-31.77a132.49,132.49,0,0,0,29.42-11.45Zm19.36,3.05a109.17,109.17,0,0,0,25.15,17.39l-15.83,21.66c-1.18-.49-2.38-.94-3.61-1.32l-5.71-37.73Zm-62.75,20.86L204.3,248.1a39.37,39.37,0,0,0-4.08,7.07l-33.92-8.9c5-8.76,9.83-18.25,13.09-29.6Zm105.52,4.08c5.12,10.42,11.11,21.1,19.66,30.92l-31.15,6.5A39.64,39.64,0,0,0,266.49,246l18.42-25.21ZM43.14,233.26,92,246.09c9.23,28.21,5.8,57.08,1.2,87.45l-49.07,23c6-40.15,10.29-81.42-1-123.24Zm416.14,5.16c-14.93,32.63-30.11,66.73-27.43,104.13l-43.74-17.31c-3.6-25,8.78-49.44,20.72-76.28l50.45-10.54Zm-346.57,13.1,27.61,7.25.56,1.4c6.1,15.13,5.39,31.77,2.9,49.71l-30.32,14.18c3.22-23.51,5-47.81-.75-72.54ZM386,253.74c-9,19.81-17.8,40.8-17.25,63.84l-36.59-14.47c0-13.15,1.4-22.84,9.12-33.92l5-7.15,39.74-8.3ZM161.64,264.36l35.24,9.26A39.33,39.33,0,0,0,199,284.06l-35.27,16.5c1.05-11.9.92-24.05-2.05-36.2Zm159.16,3c-4.62,9.44-6.38,18.89-6.95,28.5l-39.27-15.54c.26-1.12.47-2.27.64-3.43l45.58-9.53ZM266,297l36.5,14.44a169,169,0,0,0-24.68,16.16c-3.9,3-7.1,5.6-9.88,7.94l-10.11-31.4A39.76,39.76,0,0,0,266,297Zm-58.12,3.48-37.66,37.86a54.85,54.85,0,0,0-9.59-15.24l.09-.55,47.15-22.07Zm17.73,8.67a39.43,39.43,0,0,0,10.6,1.46c1.35,0,2.69-.07,4-.2L250.7,343c-13.32-.16-37.62.07-61.7,3l36.61-36.81ZM329.1,322l25.36,10c-29.4,14.92-50.37,35.89-69.25,57.2l-11-34.32c3.55-3.18,8.73-7.63,15-12.43,11.42-8.73,26.21-17.7,35.68-19.63l4.24-.86Zm-186.5,9.07,1.52,1.52c5.85,5.88,10,10.31,11.22,20.75L124.2,384.64c-.35-2.27-.74-4.63-1.2-7.14-2-10.95-4.45-22.94-9.32-32.9l28.92-13.54Zm235.93,10.49,39.22,15.52c-49.42,22.5-82.92,56.68-113.45,91.47l-12.44-38.65c24.11-27.84,47.68-53.61,86.67-68.34Zm-282,11.06c3,6.84,6.22,18.17,8.07,28.26,1.58,8.61,2.5,16.08,3,20.45L71.72,437.4c-1.68-5-3.78-11-6.55-18.29-5.37-14.22-12-30-19.61-42.64l51-23.86Zm150.86,9.15c4,0,6.81,0,9.35.06l10.39,32.3c-26.25-4.15-58.63-4.19-87-3.18-15.58.55-28,1.32-37.86,2.06l24.11-24.24,1-.23C191,362.74,227.16,361.79,247.41,361.76Zm-42.19,47.39c24.92-.06,50.36,1.26,68.41,5.1L287.06,456c-38.71-8.23-89-11-132.09-11.74-27.22-.48-49.23-.19-63.87.17l30.8-31c7.77-.76,30.71-2.84,58.86-3.84,7.9-.28,16.15-.45,24.46-.47Z"
    },
    classes: {
      main: "fill-radial"
    }
  },
  [ConsequenceType.LostOpportunity]: {
    viewBox: "0 0 512 512",
    paths:   {
      main: "M373.33,52.76A234.57,234.57,0,0,0,52.77,138.67C-12,250.93,26.41,394.41,138.67,459.23s255.75,26.36,320.56-85.91S485.59,117.58,373.33,52.76Zm-211.87,367A189.1,189.1,0,0,1,81,184.37L327.62,431A188.73,188.73,0,0,1,161.46,419.76Zm211.18-14.87L107.14,139.38a187.3,187.3,0,0,1,32.24-32.29L404.89,372.6A187.71,187.71,0,0,1,372.64,404.89ZM431,327.6,184.41,81A189.12,189.12,0,0,1,431,327.6Z"
    },
    classes: {
      main: "fill-linear"
    }
  },
  [ConsequenceType.WorsePosition]: {
    viewBox: "0 0 512 512",
    paths:   {
      horizon: "M18.36,227.8v18.68h86.37a98.45,98.45,0,0,0-4.43-18.68Zm379.4,0a110.51,110.51,0,0,1,9.44,18.68h86.44V227.8H397.76Z",
      boot:    "M218.67,18.73a162.14,162.14,0,0,0-20,1.32C164,24.39,123.5,39.4,91.23,67.36L124.7,257.55l.35,10.12c42.26,15.79,100.82,24.55,152.87,24.25,27.19-.15,52.64-2.74,73-7.78s35.2-12.82,41.81-20.94l.44.35a113,113,0,0,0-6.53-17.06h.19a95.88,95.88,0,0,0-4.85-8.66c-.09-.14-.16-.3-.25-.44l-.31-.47c-21.46-34.89-63.5-55.87-124.28-29.37l-.16.06a215.37,215.37,0,0,0-34,20.19h-.81c11-15.72,23.26-28.12,35.91-37.28l1.12-11.16c-14.68-4-38.08-4.06-53.53-.09L201,161.14a130.33,130.33,0,0,1,30.34-3.84c1.5,0,3,0,4.5,0a117.66,117.66,0,0,1,25.25,3.12l3.19-32c-21.06-8.07-42.12-6.6-64.57-1.59l-4.06-18.25A170.07,170.07,0,0,1,231,104.17c1.72,0,3.44,0,5.16.07a107,107,0,0,1,30.06,5.12l3.16-31.47c-25.6-7.69-51-8.1-76.91-2.78l-3.78-18.28A188.53,188.53,0,0,1,221.52,53c1.14,0,2.29-.05,3.43-.06A167.36,167.36,0,0,1,271.23,59l.47-4.6c5-23.31-18.75-35.71-53-35.65ZM397.26,284.45c-10.84,8.13-25.26,13.7-41.87,17.82-22.37,5.54-49.07,8.18-77.38,8.34a526.46,526.46,0,0,1-65.09-3.75L225.36,329c80.16,9.44,141.5-1.19,172-21.78a113.13,113.13,0,0,0-.13-22.75ZM125.7,287.77l1,30.47,58.6,8.43,9.59-22.31c-24.55-3.82-48.21-9.37-69.19-16.59Z",
      ice:     "M92.61,309.3C82.3,312.37,74,315.76,68,319.36l-.21.12L37.58,334.2,18.36,322v22.16L32,352.8l4.41,2.81,4.72-2.31,22-10.72c11.71,9.8,40.46,18.23,79.4,23.87l-60,28.25,26.63,21L18.36,454.23v39H145.14L188.86,447l51,46.28h27.84L159.11,394.8l35.06-23c20,1.37,41.34,2.15,63.56,2.15,20.7,0,40.66-.67,59.44-1.87l39.06,24.69-66.9,35.71,62.28,60.75H475.52L385,440.64l51.32-39.78-71.5-33.28c45.88-6,79.18-15.67,89.81-27l18,6.43,21.06,22.57V342.17l-8.94-9.56L483.17,331l-2.15-.78L439.8,315.42a141.57,141.57,0,0,0-16.66-6c5.37,3.24,8.28,6.7,8.28,10.28,0,18.59-77.73,33.66-173.62,33.66S84.14,338.29,84.14,319.7c0-3.63,3-7.13,8.47-10.4Z"
    },
    classes: {
      horizon: "fill-dark",
      boot:    "fill-bright",
      ice:     "fill-radial"
    }
  },
  [ConsequenceType.InsightHarm1]: {
    viewBox: "0 0 512 512",
    paths:   {
      eye:  "M406.09,282.69V352.6c4.19,8.54,8.53,16.73,8.53,27.56,0,13.24-8.75,22.78-18.09,22.78-9.13,0-18.69-10-18.69-23.94,0-12.22,5.1-20.64,9.56-29.59V289.63c-6.51-19.32-16.22-25.45-26.54-21.72V226.24A401.64,401.64,0,0,0,409.07,204h45.2C435.64,222.23,417,244.72,406.09,282.69ZM494.83,158.8c-33,49.83-80.77,87.12-134,108.82a291.28,291.28,0,0,1-90,21.07q-7.2.51-14.42.62a256.33,256.33,0,0,1-89-14,239,239,0,0,1-25.35-10.52A239.65,239.65,0,0,1,82.64,223.9C74.76,216.85,66,208.81,57.89,200c-11.54-12.52-21.66-26.51-25.72-41.23,20.19-37.74,48.7-69.38,84.66-92.29C241.41-14.68,416.3,37.68,494.83,158.8Zm-29.17-.36C373.78,11.86,140.41,12.08,57.19,160.28l.46.39-.46.39a353,353,0,0,0,54.67,42.55c45.21,28.32,92.77,42.1,140.82,42.29h.22C324.81,246.14,397.81,215.94,465.66,158.44Z",
      iris: "M303.7,99.51a65,65,0,0,0-45-18h0a65.26,65.26,0,1,0,45,18Zm-45.4,68.13a23.4,23.4,0,1,1,23.39-23.41A23.42,23.42,0,0,1,258.3,167.64Zm45.4-68.13a65,65,0,0,0-45-18h0a65.26,65.26,0,1,0,45,18Zm-45.4,68.13a23.4,23.4,0,1,1,23.39-23.41A23.42,23.42,0,0,1,258.3,167.64Zm45.4-68.13a65,65,0,0,0-45-18h0a65.26,65.26,0,1,0,45,18Zm-45.4,68.13a23.4,23.4,0,1,1,23.39-23.41A23.42,23.42,0,0,1,258.3,167.64Z"
    },
    classes: {
      eye:  "fill-dark",
      iris: "fill-med"
    }
  },
  [ConsequenceType.InsightHarm2]: {
    viewBox: "0 0 512 512",
    paths:   {
      eye:  "M305.51,89.71A78.5,78.5,0,0,0,251.22,68h0a78.81,78.81,0,1,0,54.29,21.71ZM250.71,172a28.25,28.25,0,1,1,28.23-28.27A28.28,28.28,0,0,1,250.71,172Zm54.8-82.26A78.5,78.5,0,0,0,251.22,68h0a78.81,78.81,0,1,0,54.29,21.71ZM250.71,172a28.25,28.25,0,1,1,28.23-28.27A28.28,28.28,0,0,1,250.71,172Zm54.8-82.26A78.5,78.5,0,0,0,251.22,68h0a78.81,78.81,0,1,0,54.29,21.71ZM250.71,172a28.25,28.25,0,1,1,28.23-28.27A28.28,28.28,0,0,1,250.71,172Z",
      iris: "M398.59,282.69V352.6c4.19,8.54,8.53,16.73,8.53,27.56,0,13.24-8.75,22.78-18.09,22.78-9.13,0-18.69-10-18.69-23.94,0-12.22,5.1-20.64,9.56-29.59V289.63c-6.51-19.32-16.22-25.45-26.54-21.72V226.24A401.64,401.64,0,0,0,401.57,204h45.2C428.14,222.23,409.46,244.72,398.59,282.69Zm-264-17.94A239.65,239.65,0,0,1,75.14,223.9c-7.88-7.05-16.67-15.09-24.75-23.86,11.79,18.34,22,39.48,27.42,60.27v50c-4.76,10.14-12.06,17.21-12.06,28.41,0,9.09,11.63,18.09,21,18.09,9.2,0,21.6-9.67,21.59-19.25,0-11.36-7.31-17.81-11.87-27V278.22C103,265.1,117.78,261.12,134.61,264.75ZM487.33,158.8c-33,49.83-80.77,87.12-134,108.82a291.28,291.28,0,0,1-90,21.07q-7.2.51-14.42.62a256.33,256.33,0,0,1-88.95-14,239,239,0,0,1-25.35-10.52A239.65,239.65,0,0,1,75.14,223.9c-7.88-7.05-16.67-15.09-24.75-23.86-11.54-12.52-21.66-26.51-25.72-41.23,20.19-37.74,48.7-69.38,84.66-92.29C233.91-14.68,408.8,37.68,487.33,158.8Zm-29.17-.36C366.28,11.86,132.91,12.08,49.69,160.28l.46.39-.46.39a353,353,0,0,0,54.67,42.55c45.21,28.32,92.77,42.1,140.82,42.29h.22C317.31,246.14,390.31,215.94,458.16,158.44Z"
    },
    classes: {
      eye:  "fill-med",
      iris: "fill-med"
    }
  },
  [ConsequenceType.InsightHarm3]: {
    viewBox: "0 0 512 512",
    paths:   {
      eye:  "M398.31,282.69V352.6c4.19,8.54,8.53,16.73,8.53,27.56,0,13.24-8.75,22.78-18.09,22.78-9.13,0-18.69-10-18.69-23.94,0-12.22,5.1-20.64,9.56-29.59V289.63c-6.51-19.32-16.22-25.45-26.54-21.72V226.24A401.64,401.64,0,0,0,401.29,204h45.2C427.86,222.23,409.18,244.72,398.31,282.69Zm-264-17.94A239.65,239.65,0,0,1,74.86,223.9C67,216.85,58.19,208.81,50.11,200c11.79,18.34,22,39.48,27.42,60.27v50c-4.76,10.14-12.06,17.21-12.06,28.41,0,9.09,11.63,18.09,21,18.09,9.2,0,21.6-9.67,21.59-19.25,0-11.36-7.31-17.81-11.87-27V278.22C102.75,265.1,117.5,261.12,134.33,264.75Zm114.3,24.56a256.33,256.33,0,0,1-88.95-14,109.79,109.79,0,0,1,42.38,48.58v80.59c-6.36,10.47-13.62,16.95-13.62,28.87,0,17.89,11.76,24.5,23.93,24.5,11.91,0,21.6-5.66,21.6-24.5,0-9.3-7.44-16.63-13.22-31.06V324.1C227.16,309.18,237.5,294.45,248.63,289.31ZM487.05,158.8c-33,49.83-80.77,87.12-134,108.82a291.28,291.28,0,0,1-90,21.07q-7.2.51-14.42.62a256.33,256.33,0,0,1-88.95-14,239,239,0,0,1-25.35-10.52A239.65,239.65,0,0,1,74.86,223.9C67,216.85,58.19,208.81,50.11,200c-11.54-12.52-21.66-26.51-25.72-41.23,20.19-37.74,48.7-69.38,84.66-92.29C233.63-14.68,408.52,37.68,487.05,158.8Zm-29.17-.36C366,11.86,132.63,12.08,49.41,160.28l.46.39-.46.39a353,353,0,0,0,54.67,42.55c45.21,28.32,92.77,42.1,140.82,42.29h.22C317,246.14,390,215.94,457.88,158.44Z",
      iris: "M314.46,80a91.84,91.84,0,0,0-63.52-25.39h0A92.2,92.2,0,1,0,314.46,80Zm-64.12,96.24a33.05,33.05,0,1,1,33-33.07A33.08,33.08,0,0,1,250.34,176.25ZM314.46,80a91.84,91.84,0,0,0-63.52-25.39h0A92.2,92.2,0,1,0,314.46,80Zm-64.12,96.24a33.05,33.05,0,1,1,33-33.07A33.08,33.08,0,0,1,250.34,176.25ZM314.46,80a91.84,91.84,0,0,0-63.52-25.39h0A92.2,92.2,0,1,0,314.46,80Zm-64.12,96.24a33.05,33.05,0,1,1,33-33.07A33.08,33.08,0,0,1,250.34,176.25Z"
    },
    classes: {
      eye:  "fill-med",
      iris: "fill-bright"
    }
  },
  [ConsequenceType.InsightHarm4]: {
    viewBox: "0 0 512 512",
    paths:   {
      eye:  "M244,27.44c-46.86,0-93.53,12.25-134.7,39.08-36,22.91-64.47,54.55-84.66,92.29,4.06,14.72,14.18,28.71,25.72,41.23,8.08,8.77,16.87,16.81,24.75,23.86a239.65,239.65,0,0,0,59.47,40.85A239,239,0,0,0,160,275.27a256.33,256.33,0,0,0,88.95,14q7.22-.1,14.42-.62a291.28,291.28,0,0,0,90-21.07A299.94,299.94,0,0,0,430.12,222a286.46,286.46,0,0,0,57.21-63.16C434.75,77.71,339,27.44,244,27.44ZM245.4,245.9h-.22c-48.05-.19-95.61-14-140.82-42.29a353,353,0,0,1-54.67-42.55l.46-.39-.46-.39c83.22-148.2,316.59-148.42,408.47-1.84C390.31,215.94,317.31,246.14,245.4,245.9Zm17.93,42.79c7.16,3,14.11,11.57,20,28.08,3.54,9.85,6.71,22.54,9.33,38.58v74.84C287.27,440.69,281,449.64,281,462.5s10,22.19,21,22.19c10.74,0,22.18-9.73,22.18-23.34,0-14.45-7.09-23.42-12.81-34.57V342.22h-.22a223.26,223.26,0,0,1,7.48-25.45c9.57-26.37,22.57-44.47,34.73-48.86v-.29A291.28,291.28,0,0,1,263.33,288.69Zm-38.82,28.08c6.37-12.19,15.11-23.17,24.4-27.46a256.33,256.33,0,0,1-88.95-14,109.62,109.62,0,0,1,38.91,41.5q1.84,3.45,3.47,7.08v80.59c-6.36,10.47-13.62,16.95-13.62,28.87,0,17.89,11.76,24.5,23.93,24.5,11.91,0,21.6-5.66,21.6-24.5,0-9.3-7.44-16.63-13.22-31.06V324.1C222.09,321.64,223.26,319.18,224.51,316.77Zm-89.9-52A239.65,239.65,0,0,1,75.14,223.9c-7.88-7.05-16.67-15.09-24.75-23.86,11.79,18.34,22,39.48,27.42,60.27v50c-1.08,2.29-2.28,4.43-3.51,6.49-4.18,7.06-8.55,13.25-8.55,21.92,0,9.09,11.63,18.09,21,18.09,9.2,0,21.6-9.67,21.59-19.25,0-8.63-4.22-14.43-8.25-20.76a67,67,0,0,1-3.62-6.27V278.22C103,265.1,117.78,261.12,134.61,264.75Zm267-60.78a401.64,401.64,0,0,1-48.21,22.27v41.67c10.32-3.73,20,2.4,26.54,21.72v59.78c-4.46,8.95-9.56,17.37-9.56,29.59,0,13.94,9.56,23.94,18.69,23.94,9.34,0,18.09-9.54,18.09-22.78,0-10.83-4.34-19-8.53-27.56V282.69c7.59-26.52,19-45.48,31.53-60.73a225.7,225.7,0,0,1,16.65-18Z",
      iris: "M326.5,67.65a108.84,108.84,0,0,0-75.28-30.08h0A109.22,109.22,0,1,0,326.5,67.65Zm-76,114.06a39.17,39.17,0,1,1,39.15-39.19A39.2,39.2,0,0,1,250.51,181.71Zm76-114.06a108.84,108.84,0,0,0-75.28-30.08h0A109.22,109.22,0,1,0,326.5,67.65Zm-76,114.06a39.17,39.17,0,1,1,39.15-39.19A39.2,39.2,0,0,1,250.51,181.71Zm76-114.06a108.84,108.84,0,0,0-75.28-30.08h0A109.22,109.22,0,1,0,326.5,67.65Zm-76,114.06a39.17,39.17,0,1,1,39.15-39.19A39.2,39.2,0,0,1,250.51,181.71Z"
    },
    classes: {
      eye:  "fill-bright",
      iris: "fill-med"
    }
  },
  [ConsequenceType.ProwessHarm1]: {
    viewBox: "0 0 512 512",
    paths:   {
      scar: "M443.44,434.53Q408.7,409.87,376,383.64c-20-11.91-31.49.3-44.26,16.86,8.8-18.17,13.38-36.95,3.24-50.86l-4.46-3.84-44.85-35.35L237.9,336.93l17.19-25.34c7.31-12.4,3.43-27.17-5.65-41.14q-16.37-16.32-32.22-33c-1.66-1.23-3.31-2.38-4.95-3.5l-66.44,18.87L167.59,227c10.57-17.62,0-41.59-9.84-55.7q-8.4-9.81-16.62-19.75l-43.67,7.29c18.43-7.3,31.37-22.38,16.85-40l2.06,2.33Q91.79,90.29,68.44,58.49q43,32.32,83.86,67.06L188.92,116l-22.11,22q23.38,20.3,46.09,41.39l71.86-30.46L266,178l.3-.24c-21.55,27.54,18.77,86,46,78.42l31.91-17.7L319.4,275l36.88,52.71c.26.3.53.59.79.9,13.64,12.5,31.23,1.71,43.05-14.53l-19.59,42Q412.66,394.28,443.44,434.53Z"
    },
    classes: {
      scar: "fill-dark"
    }
  },
  [ConsequenceType.ProwessHarm2]: {
    viewBox: "0 0 512 512",
    paths:   {
      scarTissue: "M399,355.08c-15-32.31-18.67-65.87-6.23-94.7-47.19,58.41-76.14,4.41-4.09-70.72-101.67,62.7-147.78,31.47-14-88.26-103,54.66-182.49,69.22-130.93,15.19-37.19,10.63-58.21,5.21-76-2.43A643.42,643.42,0,0,0,55.28,58.49a789.14,789.14,0,0,0,47,77.56c7,18.27,3,38.71-31.46,63.44,124.85-33.45,88.52,47-9.36,104.92,166.21-61.68,207.52-47.41,100.64,78,84-61.07,150.14-44.57,122.89,31.29,31.63-24.51,57.9-29.74,78-20.87q43.39,30.7,90.32,59C436.25,418.27,418.25,386,399,355.08ZM352.11,362c-16.61-9.9-26.17.25-36.79,14,7.32-15.11,11.12-30.72,2.69-42.28l-3.7-3.19L277,301.11l-39.68,22,14.29-21.06c6.08-10.31,2.85-22.58-4.7-34.2q-13.6-13.56-26.78-27.46c-1.38-1-2.75-2-4.11-2.91l-55.23,15.68,18.09-21.41c8.78-14.64,0-34.57-8.18-46.3q-7-8.15-13.82-16.42l-36.3,6.06c15.32-6.06,26.08-18.6,14-33.28l-1.89-2.13c.69.72,1.31,1.42,1.89,2.13l1.71,1.94q-20.43-25.65-39.84-52.09,35.76,26.88,69.71,55.75l30.44-7.93-18.38,18.27q19.44,16.88,38.31,34.41l59.73-25.32L260.68,191l.25-.2c-17.91,22.9,15.6,71.52,38.24,65.19l26.52-14.71-20.6,30.37,30.65,43.82.66.74c11.34,10.39,26,1.42,35.79-12.07L355.9,339q26.72,31.78,52.3,65.24Q379.31,383.76,352.11,362Z"
    },
    classes: {
      scarTissue: "fill-med"
    }
  },
  [ConsequenceType.ProwessHarm3]: {
    viewBox: "0 0 512 512",
    paths:   {
      scar:       "M447.44,434.53Q412.7,409.87,380,383.64c-20-11.91-31.49.3-44.26,16.86,8.8-18.17,13.38-36.95,3.24-50.86l-4.46-3.84-44.85-35.35L241.9,336.93l17.19-25.34c7.31-12.4,3.43-27.17-5.65-41.14q-16.37-16.32-32.22-33c-1.66-1.23-3.31-2.38-4.95-3.5l-66.44,18.87L171.59,227c10.57-17.62,0-41.59-9.84-55.7q-8.4-9.81-16.62-19.75l-43.67,7.29c18.43-7.3,31.37-22.38,16.85-40l2.06,2.33Q95.79,90.29,72.44,58.49q43,32.32,83.86,67.06L192.92,116l-22.11,22q23.38,20.3,46.09,41.39l71.86-30.46L270,178l.3-.24c-21.55,27.54,18.77,86,46,78.42l31.91-17.7L323.4,275l36.88,52.71c.26.3.53.59.79.9,13.64,12.5,31.23,1.71,43.05-14.53l-19.59,42Q416.66,394.28,447.44,434.53Z",
      scarTissue: "M436.33,375.37c-18.07-38.87-22.46-79.24-7.49-113.92-56.77,70.27-91.6,5.3-4.93-85.08C301.61,251.8,246.13,214.23,407,70.19,283.18,136,187.5,153.46,249.53,88.47c-44.75,12.79-70,6.27-91.47-2.93a773.7,773.7,0,0,0-135.18-67,949.58,949.58,0,0,0,56.49,93.31c8.39,22,3.6,46.57-37.84,76.32C191.72,148,148,244.71,30.26,314.42c200-74.2,249.65-57,121.08,93.78C252.42,334.73,332,354.59,299.17,445.84c38.06-29.48,69.66-35.77,93.87-25.1q52.21,36.94,108.66,70.93C481.19,451.39,459.54,412.52,436.33,375.37ZM380,383.64c-20-11.91-31.49.3-44.26,16.86,8.8-18.17,13.38-36.95,3.24-50.86l-4.46-3.84-44.85-35.35L241.9,336.93l17.19-25.34c7.31-12.4,3.43-27.17-5.65-41.14q-16.37-16.32-32.22-33c-1.66-1.23-3.31-2.38-4.95-3.5l-66.44,18.87L171.59,227c10.57-17.62,0-41.59-9.84-55.7q-8.4-9.81-16.62-19.75l-43.67,7.29c18.43-7.3,31.37-22.38,16.85-40L116,116.26c.83.86,1.57,1.71,2.27,2.56l2.06,2.33Q95.79,90.29,72.44,58.49q43,32.32,83.86,67.06L192.92,116l-22.11,22q23.38,20.3,46.09,41.39l71.86-30.46L270,178l.3-.24c-21.55,27.54,18.77,86,46,78.42l31.91-17.7L323.4,275l36.88,52.71c.26.3.53.59.79.9,13.64,12.5,31.23,1.71,43.05-14.53l-19.59,42q32.13,38.23,62.91,78.49Q412.7,409.87,380,383.64Z"
    },
    classes: {
      scar:       "fill-dark",
      scarTissue: "fill-med"
    }
  },
  [ConsequenceType.ProwessHarm4]: {
    viewBox: "0 0 512 512",
    paths:   {
      scar:       "M441.44,434.53Q406.7,409.87,374,383.64c-20-11.91-31.49.3-44.26,16.86,8.8-18.17,13.38-36.95,3.24-50.86l-4.46-3.84-44.85-35.35L235.9,336.93l17.19-25.34c7.31-12.4,3.43-27.17-5.65-41.14q-16.37-16.32-32.22-33c-1.66-1.23-3.31-2.38-4.95-3.5l-66.44,18.87L165.59,227c10.57-17.62,0-41.59-9.84-55.7q-8.4-9.81-16.62-19.75l-43.67,7.29c18.43-7.3,31.37-22.38,16.85-40l2.06,2.33Q89.79,90.29,66.44,58.49q43,32.32,83.86,67.06L186.92,116l-22.11,22q23.38,20.3,46.09,41.39l71.86-30.46L264,178l.3-.24c-21.55,27.54,18.77,86,46,78.42l31.91-17.7L317.4,275l36.88,52.71c.26.3.53.59.79.9,13.64,12.5,31.23,1.71,43.05-14.53l-19.59,42Q410.66,394.28,441.44,434.53Z",
      scarTissue: "M430.33,375.37c-18.07-38.87-22.46-79.24-7.49-113.92-56.77,70.27-91.6,5.3-4.93-85.08C295.61,251.8,240.13,214.23,401,70.19,277.18,136,181.5,153.46,243.53,88.47c-44.75,12.79-70,6.27-91.47-2.93a773.7,773.7,0,0,0-135.18-67,949.58,949.58,0,0,0,56.49,93.31c8.39,22,3.6,46.57-37.84,76.32C185.72,148,142,244.71,24.26,314.42c200-74.2,249.65-57,121.08,93.78C246.42,334.73,326,354.59,293.17,445.84c38.06-29.48,69.66-35.77,93.87-25.1q52.21,36.94,108.66,70.93C475.19,451.39,453.54,412.52,430.33,375.37ZM374,383.64c-20-11.91-31.49.3-44.26,16.86,8.8-18.17,13.38-36.95,3.24-50.86l-4.46-3.84-44.85-35.35L235.9,336.93l17.19-25.34c7.31-12.4,3.43-27.17-5.65-41.14q-16.37-16.32-32.22-33c-1.66-1.23-3.31-2.38-4.95-3.5l-66.44,18.87L165.59,227c10.57-17.62,0-41.59-9.84-55.7q-8.4-9.81-16.62-19.75l-43.67,7.29c18.43-7.3,31.37-22.38,16.85-40L110,116.26c.83.86,1.57,1.71,2.27,2.56l2.06,2.33Q89.79,90.29,66.44,58.49q43,32.32,83.86,67.06L186.92,116l-22.11,22q23.38,20.3,46.09,41.39l71.86-30.46L264,178l.3-.24c-21.55,27.54,18.77,86,46,78.42l31.91-17.7L317.4,275l36.88,52.71c.26.3.53.59.79.9,13.64,12.5,31.23,1.71,43.05-14.53l-19.59,42q32.13,38.23,62.91,78.49Q406.7,409.87,374,383.64Z",
      welts:      "M414.13,84.19a39.5,39.5,0,1,0,39.57,39.5,39.2,39.2,0,0,0-39.57-39.5ZM308.33,29.83A28.66,28.66,0,1,0,337,58.51a28.51,28.51,0,0,0-28.67-28.68ZM90.17,322.56a49.51,49.51,0,1,0,49.53,49.52A49.36,49.36,0,0,0,90.17,322.56Zm258-171.24A22.79,22.79,0,1,0,371,174.11a22.61,22.61,0,0,0-22.83-22.79ZM261.49,89.88a16.72,16.72,0,1,0,16.73,16.73,16.63,16.63,0,0,0-16.73-16.73ZM91.15,187.65a21.18,21.18,0,1,0,21.18,21.18,21,21,0,0,0-21.18-21.18Zm77.51,94.54a32.09,32.09,0,1,0,32.07,32.1,32,32,0,0,0-32.07-32.1ZM391.6,243.05a16.51,16.51,0,1,0,16.49,16.52,16.41,16.41,0,0,0-16.49-16.52ZM238.11,374.85a48.43,48.43,0,1,0,48.44,48.45A48.29,48.29,0,0,0,238.11,374.85Zm137,59.88A22.86,22.86,0,1,0,398,457.59a22.69,22.69,0,0,0-22.86-22.86Z"
    },
    classes: {
      scar:       "fill-bright",
      scarTissue: "fill-dark",
      welts:      "fill-bright"
    }
  },
  [ConsequenceType.ResolveHarm1]: {
    viewBox: "0 0 512 512",
    paths:   {
      spikes:  "M256.09,19.1A237.5,237.5,0,0,0,197,27.22C70.63,61.08-4.36,191,29.5,317.31,62.59,440.8,187.39,515.21,311,486.92A132.35,132.35,0,0,1,279.74,475,207,207,0,0,1,122,417.49l-13.48-14.55L94.89,385.42a205.62,205.62,0,0,1-24-47.36l-7.2-17.33L60.71,296.5a205.83,205.83,0,0,1-.18-54.37l3-24.36,7.67-19.51a208.28,208.28,0,0,1,29.16-53.84l105,60.61-68.63-98a205.85,205.85,0,0,1,63.68-34.49l27.24-8.18,23.18-1.89q6.46-.48,12.89-.54a205.54,205.54,0,0,1,61.66,8.84l23.65,11,22,9.09A207.05,207.05,0,0,1,428.2,140.9l13.1,14.44L448.93,173a208,208,0,0,1,16.41,42.22,205.89,205.89,0,0,1,2.52,96.73,133,133,0,0,1,7.74,38.31,235.8,235.8,0,0,0,11.48-155.53C458.51,88.09,361.59,18.05,256.09,19.1Z",
      eyeball: "M344.58,242.53a45.61,45.61,0,0,1,8.95,6.95c12.22,12.21,16.07,29.9,13.26,47.35S354.74,332,340,346.82s-32.54,24-50,26.83-35.13-1-47.35-13.26a48,48,0,0,1-13-24.74,114.74,114.74,0,1,0,114.92-93.12Z",
      iris:    "M316.24,254a50.56,50.56,0,0,0-7.08.66c-13,2.09-27.56,9.39-39.76,21.59S249.91,303,247.81,316s.75,23.89,8,31.16S274,357.3,287,355.2s27.56-9.39,39.76-21.59,19.5-26.76,21.59-39.76-.75-23.89-8-31.16c-5.45-5.45-12.94-8.42-21.83-8.68-.74,0-1.49,0-2.25,0Zm-13.81,20.35a16,16,0,0,1,11.86,4.38c7.49,7.5,5.16,22-5.22,32.37s-24.88,12.72-32.38,5.23-5.16-22,5.22-32.38c6.17-6.16,13.78-9.49,20.52-9.6Z"
    },
    classes: {
      spikes:  "fill-dark",
      eyeball: "fill-dark",
      iris:    "fill-med"
    }
  },
  [ConsequenceType.ResolveHarm2]: {
    viewBox: "0 0 512 512",
    paths:   {
      spikes:  "M261.25,19.1a237.64,237.64,0,0,0-59.11,8.12C75.79,61.08.8,191,34.66,317.31,67.75,440.8,192.55,515.21,316.15,486.92A132.59,132.59,0,0,1,284.89,475a207,207,0,0,1-157.72-57.52l-11.44-12.15-15.68-19.92a205.62,205.62,0,0,1-24-47.36l-7.32-17.33L65.87,296.5a205.41,205.41,0,0,1-.18-54.37l91.84,19.32L76.38,198.26a208,208,0,0,1,29.16-53.84L259.93,252.78,141.87,107a205.79,205.79,0,0,1,63.67-34.49L263.45,141,256,62.45q6.46-.48,12.89-.54a205.54,205.54,0,0,1,61.66,8.84l22.84,8.32,22.83,11.78a207,207,0,0,1,57.17,50.05l13.41,16.85L454.08,173a207.52,207.52,0,0,1,18.93,139,132.67,132.67,0,0,1,7.75,38.31,235.92,235.92,0,0,0,11.48-155.53C463.67,88.09,366.74,18.05,261.25,19.1Z",
      eyeball: "M349.74,242.53a45.61,45.61,0,0,1,8.95,6.95c12.21,12.21,16.07,29.9,13.26,47.35s-12.05,35.21-26.83,50-32.54,24-50,26.83-35.14-1-47.35-13.26a48,48,0,0,1-13-24.74,116.19,116.19,0,0,0-2,21.58,114.73,114.73,0,1,0,117-114.7Z",
      iris:    "M321.4,254a50.42,50.42,0,0,0-7.08.66c-13,2.09-27.56,9.39-39.76,21.59S255.06,303,253,316s.75,23.89,8,31.16,18.16,10.12,31.16,8,27.56-9.39,39.76-21.59,19.49-26.76,21.59-39.76-.75-23.89-8-31.16c-5.46-5.45-13-8.42-21.83-8.68-.74,0-1.49,0-2.25,0Zm-13.81,20.35a16,16,0,0,1,11.85,4.38c7.5,7.5,5.16,22-5.22,32.37s-24.87,12.72-32.37,5.23-5.16-22,5.22-32.38c6.16-6.16,13.78-9.49,20.52-9.6Z"
    },
    classes: {
      spikes:  "fill-med",
      eyeball: "fill-dark",
      iris:    "fill-bright"
    }
  },
  [ConsequenceType.ResolveHarm3]: {
    viewBox: "0 0 512 512",
    paths:   {
      spikes:  "M261.31,19.1a237.51,237.51,0,0,0-59.11,8.12C75.84,61.08.86,191,34.71,317.31,67.8,440.8,192.61,515.21,316.2,486.92A132.35,132.35,0,0,1,285,475a207,207,0,0,1-157.72-57.52l-13.81-16.37-13.31-15.7a206,206,0,0,1-24.06-47.36l83.63-17.33L65.93,296.5a205.41,205.41,0,0,1-.18-54.37l164.66,47.21-154-91.08a208,208,0,0,1,29.15-53.84L260,252.78,141.92,107A205.85,205.85,0,0,1,205.6,72.52l95.49,158.21L256,62.45q6.47-.48,12.9-.54a205.43,205.43,0,0,1,61.65,8.84L353.08,169l23.17-78.14a206.76,206.76,0,0,1,57.16,50.05l13.08,22.41,7.65,9.67a207.52,207.52,0,0,1,18.93,139,132.33,132.33,0,0,1,7.74,38.31,235.8,235.8,0,0,0,11.48-155.53C463.73,88.09,366.8,18.05,261.31,19.1Z",
      eyeball: "M349.79,242.53a45.38,45.38,0,0,1,9,6.95c12.21,12.21,16.07,29.9,13.25,47.35s-12,35.21-26.82,50-32.54,24-50,26.83-35.13-1-47.34-13.26a48,48,0,0,1-13-24.74,116.19,116.19,0,0,0-2,21.58,114.73,114.73,0,1,0,117-114.7Z",
      iris:    "M321.45,254a50.56,50.56,0,0,0-7.08.66c-13,2.09-27.55,9.39-39.75,21.59S255.12,303,253,316s.75,23.89,8,31.16,18.16,10.12,31.16,8,27.56-9.39,39.76-21.59,19.49-26.76,21.59-39.76-.75-23.89-8-31.16c-5.45-5.45-12.94-8.42-21.83-8.68-.74,0-1.49,0-2.25,0Zm-13.81,20.35a16,16,0,0,1,11.86,4.38c7.5,7.5,5.16,22-5.22,32.37s-24.88,12.72-32.37,5.23-5.16-22,5.22-32.38c6.16-6.16,13.78-9.49,20.51-9.6Z"
    },
    classes: {
      spikes:  "fill-bright",
      eyeball: "fill-med",
      iris:    "fill-bright"
    }
  },
  [ConsequenceType.ResolveHarm4]: {
    viewBox: "0 0 512 512",
    paths:   {
      spikes:  "M261.14,19.1A237.51,237.51,0,0,0,202,27.22C75.67,61.08.69,191,34.54,317.31,67.63,440.8,192.44,515.21,316,486.92A132.35,132.35,0,0,1,284.78,475a207,207,0,0,1-157.72-57.52l89.22-30-116.34-2a206,206,0,0,1-24.06-47.36L214,333.21,65.76,296.5a205.41,205.41,0,0,1-.18-54.37l164.66,47.21-154-91.08a208,208,0,0,1,29.15-53.84l154.4,108.36L141.75,107a205.85,205.85,0,0,1,63.68-34.49l95.49,158.21L255.85,62.45q6.47-.48,12.9-.54a205.43,205.43,0,0,1,61.65,8.84L359.77,223.5,376.08,90.85a206.76,206.76,0,0,1,57.16,50.05L415.61,243.13,454,173a207.52,207.52,0,0,1,18.93,139,132.33,132.33,0,0,1,7.74,38.31,235.8,235.8,0,0,0,11.48-155.53C463.55,88.09,366.63,18.05,261.14,19.1Z",
      eyeball: "M349.62,242.53a45.38,45.38,0,0,1,9,6.95c12.21,12.21,16.07,29.9,13.25,47.35s-12,35.21-26.82,50-32.55,24-50,26.83-35.13-1-47.34-13.26a48,48,0,0,1-13-24.74,116.19,116.19,0,0,0-2,21.58,114.73,114.73,0,1,0,117-114.7Z",
      iris:    "M321.28,254a50.56,50.56,0,0,0-7.08.66c-13,2.09-27.55,9.39-39.75,21.59S255,303,252.86,316s.75,23.89,8,31.16S279,357.3,292,355.2s27.55-9.39,39.76-21.59,19.49-26.76,21.59-39.76-.75-23.89-8-31.16c-5.45-5.45-12.94-8.42-21.83-8.68-.74,0-1.49,0-2.25,0Zm-13.81,20.35a16,16,0,0,1,11.86,4.38c7.5,7.5,5.16,22-5.22,32.37s-24.88,12.72-32.37,5.23-5.16-22,5.22-32.38c6.16-6.16,13.78-9.49,20.51-9.6Z"
    },
    classes: {
      spikes:  "fill-bright",
      eyeball: "fill-bright",
      iris:    "fill-bright"
    }
  }
};
// #endregion

export default C;
