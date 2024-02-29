var Wa = Object.defineProperty;
var ja = (s, t, e) => t in s ? Wa(s, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : s[t] = e;
var w = (s, t, e) => (ja(s, typeof t != "symbol" ? t + "" : t, e), e), Bt = (s, t, e) => {
  if (!t.has(s))
    throw TypeError("Cannot " + e);
};
var be = (s, t, e) => (Bt(s, t, "read from private field"), e ? e.call(s) : t.get(s)), fe = (s, t, e) => {
  if (t.has(s))
    throw TypeError("Cannot add the same private member more than once");
  t instanceof WeakSet ? t.add(s) : t.set(s, e);
}, X = (s, t, e, a) => (Bt(s, t, "write to private field"), a ? a.call(s, e) : t.set(s, e), e);
var Ke = (s, t, e) => (Bt(s, t, "access private method"), e);
import { gsap as Z, MotionPathPlugin as mt, TextPlugin as as, Flip as rs, Draggable as Pt, SplitText as is, Observer as Ws, CustomEase as js, CustomWiggle as os, CustomBounce as Gs, EasePack as Vs } from "gsap/all";
var Ga = ((s) => (s[s.NONE = CONST.DOCUMENT_PERMISSION_LEVELS.NONE] = "NONE", s[s.BASIC = CONST.DOCUMENT_PERMISSION_LEVELS.LIMITED] = "BASIC", s[s.FULL = CONST.DOCUMENT_PERMISSION_LEVELS.OBSERVER] = "FULL", s[s.OWNER = CONST.DOCUMENT_PERMISSION_LEVELS.OWNER] = "OWNER", s))(Ga || {}), b = /* @__PURE__ */ ((s) => (s.pc = "pc", s.npc = "npc", s.crew = "crew", s.faction = "faction", s))(b || {}), g = /* @__PURE__ */ ((s) => (s.ability = "ability", s.background = "background", s.clock_keeper = "clock_keeper", s.cohort_gang = "cohort_gang", s.cohort_expert = "cohort_expert", s.crew_ability = "crew_ability", s.crew_reputation = "crew_reputation", s.crew_playbook = "crew_playbook", s.crew_upgrade = "crew_upgrade", s.feature = "feature", s.gm_tracker = "gm_tracker", s.heritage = "heritage", s.gear = "gear", s.playbook = "playbook", s.preferred_op = "preferred_op", s.stricture = "stricture", s.vice = "vice", s.project = "project", s.ritual = "ritual", s.design = "design", s.location = "location", s.score = "score", s))(g || {}), kt = /* @__PURE__ */ ((s) => (s.HasActiveItem = "HasActiveItem", s.HasActiveItemsByTag = "HasActiveItemByTag", s.AdvancedPlaybook = "AdvancedPlaybook", s.HasAllTags = "HasAllTags", s.HasAnyTag = "HasAnyTag", s.Not_HasActiveItem = "Not_HasActiveItem", s.Not_HasActiveItemsByTag = "Not_HasActiveItemsByTag", s.Not_AdvancedPlaybook = "Not_AdvancedPlaybook", s.Not_HasAllTags = "Not_HasAllTags", s.Not_HasAnyTag = "Not_HasAnyTag", s))(kt || {}), me = /* @__PURE__ */ ((s) => (s.yellow = "yellow", s.red = "red", s.white = "white", s.cyan = "cyan", s))(me || {}), W = /* @__PURE__ */ ((s) => (s.overlay = "overlay", s.pcSheet = "pcSheet", s.factionSheet = "factionSheet", s.projectSheet = "projectSheet", s.scoreSheet = "scoreSheet", s.rollCollab = "rollCollab", s.chatMessage = "chatMessage", s))(W || {}), ne = /* @__PURE__ */ ((s) => (s.full = "full", s.clocks = "clocks", s.activeClocks = "activeClocks", s.presentCurrentClock = "presentCurrentClock", s.present0 = "present0", s.present1 = "present1", s.present2 = "present2", s.present3 = "present3", s.present4 = "present4", s.present5 = "present5", s))(ne || {}), Te = /* @__PURE__ */ ((s) => (s.push = "push", s))(Te || {}), qs = /* @__PURE__ */ ((s) => (s.Barrowcleft = "Barrowcleft", s.Brightstone = "Brightstone", s.Charhollow = "Charhollow", s.Charterhall = "Charterhall", s.Coalridge = "Coalridge", s["Crows Foot"] = "Crows Foot", s["The Docks"] = "The Docks", s.Dunslough = "Dunslough", s.Nightmarket = "Nightmarket", s.Silkshore = "Silkshore", s["Six Towers"] = "Six Towers", s.Whitecrown = "Whitecrown", s))(qs || {}), zs = /* @__PURE__ */ ((s) => (s["Gaddoc Station"] = "Gaddoc Station", s["The Lost District"] = "The Lost District", s["The Void Sea"] = "The Void Sea", s["Ironhook Prison"] = "Ironhook Prison", s["Old North Port"] = "Old North Port", s.Deathlands = "Deathlands", s))(zs || {}), re = /* @__PURE__ */ ((s) => (s.insight = "insight", s.prowess = "prowess", s.resolve = "resolve", s))(re || {}), Ae = /* @__PURE__ */ ((s) => (s.hunt = "hunt", s.study = "study", s.survey = "survey", s.tinker = "tinker", s.finesse = "finesse", s.prowl = "prowl", s.skirmish = "skirmish", s.wreck = "wreck", s.attune = "attune", s.command = "command", s.consort = "consort", s.sway = "sway", s))(Ae || {}), P = /* @__PURE__ */ ((s) => (s.AcquireAsset = "AcquireAsset", s.IndulgeVice = "IndulgeVice", s.LongTermProject = "LongTermProject", s.Recover = "Recover", s.ReduceHeat = "ReduceHeat", s.Train = "Train", s))(P || {}), Q = /* @__PURE__ */ ((s) => (s.Primary = "Primary", s.Observer = "Observer", s.GM = "GM", s.Participant = "Participant", s))(Q || {}), _ = /* @__PURE__ */ ((s) => (s.Action = "Action", s.Resistance = "Resistance", s.Fortune = "Fortune", s.IndulgeVice = "IndulgeVice", s))(_ || {}), at = /* @__PURE__ */ ((s) => (s.Incarceration = "Incarceration", s.Engagement = "Engagement", s.GatherInfo = "GatherInfo", s.GroupLead = "GroupLead", s.GroupParticipant = "GroupParticipant", s))(at || {}), F = /* @__PURE__ */ ((s) => (s.general = "general", s.harm = "harm", s.teamwork = "teamwork", s.ability = "ability", s.gear = "gear", s.crew_ability = "crew_ability", s.crew_upgrade = "crew_upgrade", s.advantage = "advantage", s.disadvantage = "disadvantage", s))(F || {}), ue = /* @__PURE__ */ ((s) => (s.ReducedEffect = "ReducedEffect", s.ComplicationMinor = "ComplicationMinor", s.ComplicationMajor = "ComplicationMajor", s.ComplicationSerious = "ComplicationSerious", s.LostOpportunity = "LostOpportunity", s.WorsePosition = "WorsePosition", s.InsightHarm1 = "InsightHarm1", s.InsightHarm2 = "InsightHarm2", s.InsightHarm3 = "InsightHarm3", s.InsightHarm4 = "InsightHarm4", s.ProwessHarm1 = "ProwessHarm1", s.ProwessHarm2 = "ProwessHarm2", s.ProwessHarm3 = "ProwessHarm3", s.ProwessHarm4 = "ProwessHarm4", s.ResolveHarm1 = "ResolveHarm1", s.ResolveHarm2 = "ResolveHarm2", s.ResolveHarm3 = "ResolveHarm3", s.ResolveHarm4 = "ResolveHarm4", s.None = "None", s))(ue || {}), T = /* @__PURE__ */ ((s) => (s.Hidden = "Hidden", s.ForcedOff = "ForcedOff", s.ToggledOff = "ToggledOff", s.ToggledOn = "ToggledOn", s.ForcedOn = "ForcedOn", s.Dominant = "Dominant", s))(T || {}), C = /* @__PURE__ */ ((s) => (s.roll = "roll", s.position = "position", s.effect = "effect", s.result = "result", s.after = "after", s))(C || {}), ie = /* @__PURE__ */ ((s) => (s.desperate = "desperate", s.risky = "risky", s.controlled = "controlled", s))(ie || {}), ee = /* @__PURE__ */ ((s) => (s.zero = "zero", s.limited = "limited", s.standard = "standard", s.great = "great", s.extreme = "extreme", s))(ee || {}), m = /* @__PURE__ */ ((s) => (s.tier = "tier", s.quality = "quality", s.scale = "scale", s.magnitude = "magnitude", s))(m || {}), G = /* @__PURE__ */ ((s) => (s.critical = "critical", s.success = "success", s.partial = "partial", s.fail = "fail", s))(G || {}), Me = /* @__PURE__ */ ((s) => (s.Collaboration = "Collaboration", s.AwaitingRoll = "AwaitingRoll", s.AwaitingConsequences = "AwaitingConsequences", s.Complete = "Complete", s))(Me || {}), zt = /* @__PURE__ */ ((s) => (s.Weakened = "Weakened", s.Impaired = "Impaired", s.Broken = "Broken", s.Dead = "Dead", s))(zt || {}), Ys = /* @__PURE__ */ ((s) => (s.Faith = "Faith", s.Gambling = "Gambling", s.Luxury = "Luxury", s.Obligation = "Obligation", s.Pleasure = "Pleasure", s.Stupor = "Stupor", s.Weird = "Weird", s.Worship = "Worship", s.Life_Essence = "Life_Essence", s.Living_Essence = "Living_Essence", s.Electroplasmic_Power = "Electroplasmic_Power", s.Servitude = "Servitude", s))(Ys || {}), rt = /* @__PURE__ */ ((s) => (s.Cutter = "Cutter", s.Hound = "Hound", s.Leech = "Leech", s.Lurk = "Lurk", s.Slide = "Slide", s.Spider = "Spider", s.Whisper = "Whisper", s.Vampire = "Vampire", s.Hull = "Hull", s.Ghost = "Ghost", s.Assassins = "Assassins", s.Bravos = "Bravos", s.Cult = "Cult", s.Hawkers = "Hawkers", s.Shadows = "Shadows", s.Smugglers = "Smugglers", s.Vigilantes = "Vigilantes", s))(rt || {}), Le = /* @__PURE__ */ ((s) => (s.UpgradeOrAbility = "UpgradeOrAbility", s.Ability = "Ability", s.Upgrade = "Upgrade", s.Cohort = "Cohort", s.CohortType = "CohortType", s.GeneralAction = "GeneralAction", s.GeneralInsight = "GeneralInsight", s.GeneralProwess = "GeneralProwess", s.GeneralResolve = "GeneralResolve", s.hunt = "hunt", s.study = "study", s.survey = "survey", s.tinker = "tinker", s.finesse = "finesse", s.prowl = "prowl", s.skirmish = "skirmish", s.wreck = "wreck", s.attune = "attune", s.command = "command", s.consort = "consort", s.sway = "sway", s))(Le || {}), N = /* @__PURE__ */ ((s) => (s.CharGen = "CharGen", s.Freeplay = "Freeplay", s.Score = "Score", s.Downtime = "Downtime", s))(N || {}), A;
((s) => {
  ((t) => {
    t.Archived = "Archived", t.Featured = "Featured", t.Hidden = "Hidden", t.MultiplesOK = "MultiplesOK";
  })(s.System || (s.System = {})), ((t) => {
    t.Fine = "Fine", t.General = "General", t.Advanced = "Advanced", t.Upgraded = "Upgraded";
  })(s.Gear || (s.Gear = {})), ((t) => {
    t.Member = "Member", t.CharacterCrew = "CharacterCrew", t.ActivePC = "ActivePC", t.Small = "Small", t.Medium = "Medium", t.Large = "Large", t.CanHeal = "CanHeal";
  })(s.PC || (s.PC = {})), ((t) => {
    t.Arcane = "Arcane", t.SparkCraft = "SparkCraft", t.Alchemical = "Alchemical", t.Mundane = "Mundane", t.Ritual = "Ritual";
  })(s.Invention || (s.Invention = {})), ((t) => {
    t.ArcaneImplement = "ArcaneImplement", t.Document = "Document", t.GearKit = "GearKit", t.SubterfugeSupplies = "SubterfugeSupplies", t.Tool = "Tool", t.Weapon = "Weapon";
  })(s.GearCategory || (s.GearCategory = {})), ((t) => {
    t.Acquaintance = "Acquaintance", t.VicePurveyor = "VicePurveyor", t.CanHeal = "CanHeal";
  })(s.NPC || (s.NPC = {})), ((t) => {
    t.Thugs = "Thugs", t.Rooks = "Rooks", t.Adepts = "Adepts", t.Rovers = "Rovers", t.Skulks = "Skulks", t.Vehicle = "Vehicle";
  })(s.GangType || (s.GangType = {}));
})(A || (A = {}));
const v = {
  SYSTEM_ID: "eunos-blades",
  SYSTEM_NAME: "Euno's Blades",
  SYSTEM_FULL_NAME: "Euno's Blades In The Dark",
  TEMPLATE_ROOT: "systems/eunos-blades/templates",
  AI_MODELS: {
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
  MIN_MOUSE_MOVEMENT_THRESHOLD: 2e3,
  AI_FILE_IDS: {
    BladesPDF: "file-n72HTTNwt051piPbswQ8isUa"
  },
  ClockKeySquareSize: 100,
  DowntimeActionDisplay: {
    AcquireAsset: "Acquire an Asset",
    IndulgeVice: "Indulge Your Vice",
    LongTermProject: "Work on a Project",
    Recover: "Heal",
    ReduceHeat: "Reduce the Crew's Heat",
    Train: "Train"
  },
  ConsequenceValues: {
    ReducedEffect: void 0,
    LostOpportunity: 2,
    WorsePosition: void 0,
    None: 0,
    InsightHarm4: 4,
    InsightHarm3: 3,
    InsightHarm2: 2,
    InsightHarm1: 1,
    ProwessHarm4: 4,
    ProwessHarm3: 3,
    ProwessHarm2: 2,
    ProwessHarm1: 1,
    ResolveHarm4: 4,
    ResolveHarm3: 3,
    ResolveHarm2: 2,
    ResolveHarm1: 1,
    ComplicationSerious: 3,
    ComplicationMajor: 2,
    ComplicationMinor: 1
  },
  ResistedConsequenceTypes: {
    None: [],
    InsightHarm4: [
      "InsightHarm3"
      /* InsightHarm3 */
    ],
    InsightHarm3: [
      "InsightHarm2"
      /* InsightHarm2 */
    ],
    InsightHarm2: [
      "InsightHarm1"
      /* InsightHarm1 */
    ],
    InsightHarm1: [
      "None"
      /* None */
    ],
    ProwessHarm4: [
      "ProwessHarm3"
      /* ProwessHarm3 */
    ],
    ProwessHarm3: [
      "ProwessHarm2"
      /* ProwessHarm2 */
    ],
    ProwessHarm2: [
      "ProwessHarm1"
      /* ProwessHarm1 */
    ],
    ProwessHarm1: [
      "None"
      /* None */
    ],
    ResolveHarm4: [
      "ResolveHarm3"
      /* ResolveHarm3 */
    ],
    ResolveHarm3: [
      "ResolveHarm2"
      /* ResolveHarm2 */
    ],
    ResolveHarm2: [
      "ResolveHarm1"
      /* ResolveHarm1 */
    ],
    ResolveHarm1: [
      "None"
      /* None */
    ],
    ComplicationSerious: [
      "ComplicationMajor"
      /* ComplicationMajor */
    ],
    ComplicationMajor: [
      "ComplicationMinor"
      /* ComplicationMinor */
    ],
    ComplicationMinor: [
      "None"
      /* None */
    ]
  },
  ConsequenceDisplay: {
    ReducedEffect: "Reduced Effect",
    ComplicationMinor: "Minor Complication",
    ComplicationMajor: "Major Complication",
    ComplicationSerious: "Serious Complication",
    LostOpportunity: "Lost Opportunity",
    WorsePosition: "Worse Position",
    InsightHarm1: "Level 1 Harm (Lesser)",
    InsightHarm2: "Level 2 Harm (Moderate)",
    InsightHarm3: "Level 3 Harm (Severe)",
    InsightHarm4: "Level 4 Harm (FATAL)",
    ProwessHarm1: "Level 1 Harm (Lesser)",
    ProwessHarm2: "Level 2 Harm (Moderate)",
    ProwessHarm3: "Level 3 Harm (Severe)",
    ProwessHarm4: "Level 4 Harm (FATAL)",
    ResolveHarm1: "Level 1 Harm (Lesser)",
    ResolveHarm2: "Level 2 Harm (Moderate)",
    ResolveHarm3: "Level 3 Harm (Severe)",
    ResolveHarm4: "Level 4 Harm (FATAL)",
    None: "None"
  },
  ConsequenceIcons: {
    ReducedEffect: "reduced-effect",
    ComplicationMinor: "complication-minor",
    ComplicationMajor: "complication-major",
    ComplicationSerious: "complication-serious",
    LostOpportunity: "lost-opportunity",
    WorsePosition: "worse-position",
    InsightHarm1: "harm-insight-1",
    InsightHarm2: "harm-insight-2",
    InsightHarm3: "harm-insight-3",
    InsightHarm4: "harm-insight-4",
    ProwessHarm1: "harm-prowess-1",
    ProwessHarm2: "harm-prowess-2",
    ProwessHarm3: "harm-prowess-3",
    ProwessHarm4: "harm-prowess-4",
    ResolveHarm1: "harm-resolve-1",
    ResolveHarm2: "harm-resolve-2",
    ResolveHarm3: "harm-resolve-3",
    ResolveHarm4: "harm-resolve-4",
    None: ""
  },
  RollResultDescriptions: {
    controlled: {
      critical: "You critically succeed from a controlled position!",
      success: "You fully succeed from a controlled position!",
      partial: "You partially succeed from a controlled position!",
      fail: "You fail from a controlled position!"
    },
    risky: {
      critical: "You critically succeed from a risky position!",
      success: "You fully succeed from a risky position!",
      partial: "You partially succeed from a risky position!",
      fail: "You fail from a risky position!"
    },
    desperate: {
      critical: "You critically succeed from a desperate position!",
      success: "You fully succeed from a desperate position!",
      partial: "You partially succeed from a desperate position!",
      fail: "You fail from a desperate position!"
    }
  },
  Colors: {
    /* IMPORT FROM CSS via css-loader */
    bWHITE: "rgba(255, 255, 255, 1)",
    WHITE: "rgba(200, 200, 200, 1)",
    bGREY: "rgba(170, 170, 170, 1)",
    GREY: "rgba(119, 119, 119, 1)",
    dGREY: "rgba(68, 68, 68, 1)",
    BLACK: "rgba(32, 32, 32, 1)",
    dBLACK: "rgba(0, 0, 0, 1)",
    bGOLD: "rgba(255,216, 44, 1)",
    GOLD: "rgba(215,175,  0, 1)",
    dGOLD: "rgba(165,134,  0, 1)",
    ddGOLD: "rgba(103, 83,  0, 1)",
    bRED: "rgba(255, 0, 0, 1)",
    RED: "rgba(200, 0, 0, 1)",
    dRED: "rgba(150,  0,  0, 1)",
    ddRED: "rgba(50,  0,  0, 1)",
    bBLUE: "rgba(   0,224,224, 1)",
    BLUE: "rgba(52,213,213, 1)",
    dBLUE: "rgba(0,118,118, 1)",
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
      { value: "Light", display: "Light" },
      { value: "Normal", display: "Normal" },
      { value: "Heavy", display: "Heavy" }
    ],
    levels: ["BITD.Light", "BITD.Normal", "BITD.Heavy", "BITD.Encumbered", "BITD.OverMax"]
  },
  AttributeTooltips: {
    insight: "<p>Resists consequences from <strong>deception</strong> or <strong>understanding</strong></p>",
    prowess: "<p>Resists consequences from <strong>physical strain</strong> or <strong>injury</strong></p>",
    resolve: "<p>Resists consequences from <strong>mental strain</strong> or <strong>willpower</strong></p>"
  },
  ShortAttributeTooltips: {
    insight: "vs. <strong>deception</strong> or <strong>(mis)understanding</strong>",
    prowess: "vs. <strong>physical strain</strong> or <strong>injury</strong>",
    resolve: "vs. <strong>mental strain</strong> or <strong>willpower</strong>"
  },
  ShortActionTooltips: {
    hunt: "carefully track a target",
    study: "scrutinize details and interpret evidence",
    survey: "observe the situation and anticipate outcomes",
    tinker: "fiddle with devices and mechanisms",
    finesse: "employ dexterity or subtle misdirection",
    prowl: "traverse skillfully and quietly",
    skirmish: "entangle a target in melee so they can't escape",
    wreck: "unleash savage force",
    attune: "open your mind to the ghost field or channel nearby electroplasmic energy through your body",
    command: "compel swift obedience",
    consort: "socialize with friends and contacts",
    sway: "influence someone with guile, charm, or argument"
  },
  ActionTooltips: {
    hunt: "<p>When you <strong>Hunt</strong>, you carefully track a target.</p><ul><li>You might follow a person or discover their location.</li><li>You might arrange an ambush.</li><li>You might attack with precision shooting from a distance.</li></ul><ul><li>You could try to wield your guns in a melee <em>(but <strong>Skirmishing</strong> might be better)</em>.</li></ul>",
    study: "<p>When you <strong>Study</strong>, you scrutinize details and interpret evidence.</p><ul><li>You might gather information from documents, newspapers, and books.</li><li>You might do research on an esoteric topic.</li><li>You might closely analyze a person to detect lies or true feelings.</li></ul><ul><li>You could try to understand a pressing situation <em>(but <strong>Surveying</strong> might be better)</em>.</li></ul>",
    survey: "<p>When you <strong>Survey</strong>, you observe the situation and anticipate outcomes.</p><ul><li>You might spot telltale signs of trouble before it happens.</li><li>You might uncover opportunities or weaknesses.</li></ul><ul><li>You might detect a person's motives or intentions <em>(but <strong>Studying</strong> might be better)</em>.</li><li>You could try to spot a good ambush point <em>(but <strong>Hunting</strong> might be better)</em>.</li></ul>",
    tinker: "<p>When you <strong>Tinker</strong>, you fiddle with devices and mechanisms.</p><ul><li>You might create a new gadget or alter an existing item.</li><li>You might pick a lock or crack a safe.</li><li>You might disable an alarm or trap.</li><li>You might turn the sparkcraft and electroplasmic devices around the city to your advantage.</li></ul><ul><li>You could try to control a vehicle with your tech-savvy <em>(but <strong>Finessing</strong> might be better)</em>.</li></ul>",
    finesse: "<p>When you <strong>Finesse</strong>, you employ dexterity or subtle misdirection.</p><ul><li>You might pick someone's pocket.</li><li>You might handle the controls of a vehicle or direct a mount.</li><li>You might formally duel an opponent with graceful fighting arts.</li></ul><ul><li>You could try to leverage agility in a melee <em>(but <strong>Skirmishing</strong> might be better)</em>.</li><li>You could try to pick a lock <em>(but <strong>Tinkering</strong> might be better)</em>.</li></ul>",
    prowl: "<p>When you <strong>Prowl</strong>, you traverse skillfully and quietly.</p><ul><li>You might sneak past a guard or hide in the shadows.</li><li>You might run and leap across the rooftops.</li><li>You might attack someone from hiding with a back-stab or blackjack.</li></ul><ul><li>You could try to waylay a victim during combat <em>(but <strong>Skirmishing</strong> might be better)</em>.</li></ul>",
    skirmish: "<p>When you <strong>Skirmish</strong>, you entangle a target in melee so they can't escape.</p><ul><li>You might brawl or wrestle with them.</li><li>You might hack and slash.</li><li>You might seize or hold a position in battle.</li></ul><ul><li>You could try to fight in a formal duel <em>(but <strong>Finessing</strong> might be better)</em>.</li></ul>",
    wreck: "<p>When you <strong>Wreck</strong>, you unleash savage force.</p><ul><li>You might smash down a door or wall with a sledgehammer.</li><li>You might use an explosive to do the same.</li><li>You might use chaos or sabotage to create distractions or overcome obstacles.</li></ul><ul><li>You could try to overwhelm an enemy with sheer force in battle <em>(but <strong>Skirmishing</strong> might be better)</em>.</li></ul>",
    attune: "<p>When you <strong>Attune</strong>, you open your mind to the ghost field or channel nearby electroplasmic energy through your body.</p><ul><li>You might communicate with a ghost or understand aspects of spectrology.</li><li>You might peer into the echo of Doskvol in the ghost field.</li></ul><ul><li>You could try to perceive beyond sight in order to better understand your situation <em>(but <strong>Surveying</strong> might be better)</em>.</li></ul>",
    command: "<p>When you <strong>Command</strong>, you compel swift obedience.</p><ul><li>You might intimidate or threaten to get what you want.</li><li>You might lead a gang in a group action.</li></ul><ul><li>You could try to persuade people by giving orders <em>(but <strong>Consorting</strong> might be better)</em>.</li></ul>",
    consort: "<p>When you <strong>Consort</strong>, you socialize with friends and contacts.</p><ul><li>You might gain access to resources, information, people, or places.</li><li>You might make a good impression or win someone over with charm and style.</li><li>You might make new friends or connect with your heritage or background.</li></ul><ul><li>You could try to direct allies with social pressure <em>(but <strong>Commanding</strong> might be better)</em>.</li></ul>",
    sway: "<p>When you <strong>Sway</strong>, you influence someone with guile, charm, or argument.</p><ul><li>You might lie convincingly.</li><li>You might persuade someone to do what you want.</li><li>You might argue a case that leaves no clear rebuttal.</li></ul><ul><li>You could try to trick people into affection or obedience <em>(but <strong>Consorting</strong> or <strong>Commanding</strong> might be better)</em>.</li></ul>"
  },
  ActionTooltipsGM: {
    hunt: "<p>When you <strong>Hunt</strong>, you carefully track a target.</p><ul><li>You might follow a person or discover their location.</li><li>You might arrange an ambush.</li><li>You might attack with precision shooting from a distance.</li></ul><ul><li>You could try to wield your guns in a melee <em>(but <strong>Skirmishing</strong> might be better)</em>.</li></ul><hr><ul><li>How do you hunt them down?</li><li>What methods do you use?</li><li>What do you hope to achieve?</li></ul>",
    study: "<p>When you <strong>Study</strong>, you scrutinize details and interpret evidence.</p><ul><li>You might gather information from documents, newspapers, and books.</li><li>You might do research on an esoteric topic.</li><li>You might closely analyze a person to detect lies or true feelings.</li></ul><ul><li>You could try to understand a pressing situation <em>(but <strong>Surveying</strong> might be better)</em>.</li></ul><hr><ul><li>What do you study?</li><li>What details or evidence do you scrutinize?</li><li>What do you hope to understand?</li></ul>",
    survey: "<p>When you <strong>Survey</strong>, you observe the situation and anticipate outcomes.</p><ul><li>You might spot telltale signs of trouble before it happens.</li><li>You might uncover opportunities or weaknesses.</li></ul><ul><li>You might detect a person's motives or intentions <em>(but <strong>Studying</strong> might be better)</em>.</li><li>You could try to spot a good ambush point <em>(but <strong>Hunting</strong> might be better)</em>.</li></ul><hr><ul><li>How do you survey the situation?</li><li>Is there anything special you're looking out for?</li><li>What do you hope to understand?</li></ul>",
    tinker: "<p>When you <strong>Tinker</strong>, you fiddle with devices and mechanisms.</p><ul><li>You might create a new gadget or alter an existing item.</li><li>You might pick a lock or crack a safe.</li><li>You might disable an alarm or trap.</li><li>You might turn the sparkcraft and electroplasmic devices around the city to your advantage.</li></ul><ul><li>You could try to control a vehicle with your tech-savvy <em>(but <strong>Finessing</strong> might be better)</em>.</li></ul><hr><ul><li>What do you tinker with?</li><li>What do you hope to accomplish?</li></ul>",
    finesse: "<p>When you <strong>Finesse</strong>, you employ dexterity or subtle misdirection.</p><ul><li>You might pick someone's pocket.</li><li>You might handle the controls of a vehicle or direct a mount.</li><li>You might formally duel an opponent with graceful fighting arts.</li></ul><ul><li>You could try to leverage agility in a melee <em>(but <strong>Skirmishing</strong> might be better)</em>.</li><li>You could try to pick a lock <em>(but <strong>Tinkering</strong> might be better)</em>.</li></ul><hr><ul><li>What do you finesse?</li><li>What's graceful or subtle about this?</li><li>What do you hope to achieve?</li></ul>",
    prowl: "<p>When you <strong>Prowl</strong>, you traverse skillfully and quietly.</p><ul><li>You might sneak past a guard or hide in the shadows.</li><li>You might run and leap across the rooftops.</li><li>You might attack someone from hiding with a back-stab or blackjack.</li></ul><ul><li>You could try to waylay a victim during combat <em>(but <strong>Skirmishing</strong> might be better)</em>.</li></ul><hr><ul><li>How do you prowl?</li><li>How do you use the environment around you?</li><li>What do you hope to achieve?</li></ul>",
    skirmish: "<p>When you <strong>Skirmish</strong>, you entangle a target in melee so they can't escape.</p><ul><li>You might brawl or wrestle with them.</li><li>You might hack and slash.</li><li>You might seize or hold a position in battle.</li></ul><ul><li>You could try to fight in a formal duel <em>(but <strong>Finessing</strong> might be better)</em>.</li></ul><hr><ul><li>How do you skirmish with them?</li><li>What combat methods do you use?</li><li>What do you hope to achieve?</li></ul>",
    wreck: "<p>When you <strong>Wreck</strong>, you unleash savage force.</p><ul><li>You might smash down a door or wall with a sledgehammer.</li><li>You might use an explosive to do the same.</li><li>You might use chaos or sabotage to create distractions or overcome obstacles.</li></ul><ul><li>You could try to overwhelm an enemy with sheer force in battle <em>(but <strong>Skirmishing</strong> might be better)</em>.</li></ul><hr><ul><li>What do you wreck?</li><li>What force do you bring to bear?</li><li>What do you hope to accomplish?</li></ul>",
    attune: "<p>When you <strong>Attune</strong>, you open your mind to the ghost field or channel nearby electroplasmic energy through your body.</p><ul><li>You might communicate with a ghost or understand aspects of spectrology.</li><li>You might peer into the echo of Doskvol in the ghost field.</li></ul><ul><li>You could try to perceive beyond sight in order to better understand your situation <em>(but <strong>Surveying</strong> might be better)</em>.</li></ul><hr><ul><li>How do you open your mind to the ghost field?</li><li>What does that look like?</li><li>What energy are you attuning to?</li><li>How are you channeling that energy?</li><li>What do you hope the energy will do?</li></ul>",
    command: "<p>When you <strong>Command</strong>, you compel swift obedience.</p><ul><li>You might intimidate or threaten to get what you want.</li><li>You might lead a gang in a group action.</li></ul><ul><li>You could try to persuade people by giving orders <em>(but <strong>Consorting</strong> might be better)</em>.</li></ul><hr><ul><li>Who do you command?</li><li>How do you do it—what's your leverage here?</li><li>What do you hope they'll do?</li></ul>",
    consort: "<p>When you <strong>Consort</strong>, you socialize with friends and contacts.</p><ul><li>You might gain access to resources, information, people, or places.</li><li>You might make a good impression or win someone over with charm and style.</li><li>You might make new friends or connect with your heritage or background.</li></ul><ul><li>You could try to direct allies with social pressure <em>(but <strong>Commanding</strong> might be better)</em>.</li></ul><hr><ul><li>Who do you consort with?</li><li>Where do you meet?</li><li>What do you talk about?</li><li>What do you hope to achieve?</li></ul>",
    sway: "<p>When you <strong>Sway</strong>, you influence someone with guile, charm, or argument.</p><ul><li>You might lie convincingly.</li><li>You might persuade someone to do what you want.</li><li>You might argue a case that leaves no clear rebuttal.</li></ul><ul><li>You could try to trick people into affection or obedience <em>(but <strong>Consorting</strong> or <strong>Commanding</strong> might be better)</em>.</li></ul><hr><ul><li>Who do you sway?</li><li>What kind of leverage do you have here?</li><li>What do you hope they'll do?</li></ul>"
  },
  ActionVerbs: {
    hunt: "hunts",
    study: "studies",
    survey: "surveys",
    tinker: "tinkers",
    finesse: "finesses",
    prowl: "prowls",
    skirmish: "skirmishes",
    wreck: "wrecks",
    attune: "attunes",
    command: "commands",
    consort: "consorts",
    sway: "sways"
  },
  ActionPastVerbs: {
    hunt: "hunted",
    study: "studied",
    survey: "surveyed",
    tinker: "tinkered",
    finesse: "finessed",
    prowl: "prowled",
    skirmish: "skirmished",
    wreck: "wrecked",
    attune: "attuned",
    command: "commanded",
    consort: "consorted",
    sway: "swayed"
  },
  TraumaTooltips: {
    Cold: "You're not moved by emotional appeals or social bonds.",
    Haunted: "You're often lost in reverie, reliving past horrors, seeing things.",
    Obsessed: "You're enthralled by one thing: an activity, a person, an ideology.",
    Paranoid: "You imagine danger everywhere; you can't trust others.",
    Reckless: "You have little regard for your own safety or best interests.",
    Soft: "You lose your edge; you become sentimental, passive, gentle.",
    Unstable: "Your emotional state is volatile. You can instantly rage, or fall into despair, act impulsively, or freeze up.",
    Vicious: "You seek out opportunities to hurt people, even for no good reason.",
    Chaotic: "You've become so detached from the living that inhibitions fall away, leaving you impulsive and unpredictable.",
    Destructive: "You are easily angered by reminders of all you've lost, and can lash out violently against the trappings of the living world.",
    Furious: "Your ravaged soul is fertile kindling for rage, and your fury is easily ignited.",
    Obsessive: "Your wants and desires become fixations and compulsions, driving you to achieve them at any cost.",
    Territorial: "You see some place as yours: Trespassers are dealt with, and even guests must respect your claim.",
    Savage: "When moved to anger or violence, you act with cruelty and feral malevolence.",
    Clanking: "Your frame has developed a persistent metallic clang with each step, making stealth difficult.",
    Leaking: "You continuously leak oil, leviathan blood, distilled electroplasm or some other potentially-dangerous substance.",
    Fixated: "You have become fixated on a function of your choice, and lose all memory of your humanity when you pursue it.",
    Smoking: "Your frame exudes a constant miasma of acrid, foul-smelling smoke.",
    Sparking: "Electroplasmic energy erupts in arcing sparks from joints and junctions throughout your frame.",
    Ruthless: "You lose any sense of humanity when indulging your Vice or pursuing your most important goal.",
    Secretive: "Knowledge has become so precious to you, that even your closest allies are on a need-to-know basis."
  },
  EdgeTooltips: {
    Fearsome: "<p>The cohort is terrifying in aspect and reputation.</p>",
    Independent: "<p>The cohort can be trusted to make good decisions and act on their own initiative in the absence of direct orders.</p>",
    Loyal: "<p>The cohort can't be bribed or turned against you. </p>",
    Tenacious: "<p>The cohort won't be deterred from a task.</p>",
    Nimble: "<p>The vehicle handles easily. Consider this an <strong>assist</strong> for tricky maneuvers.</p>",
    Simple: "<p>The vehicle is easy to repair. Remove all of its <strong>Harm</strong> during <strong>downtime</strong></p>",
    Sturdy: "<p>The vehicle keeps operating even when <strong>Broken</strong>.</p>",
    "Arrow-Swift": "<p>Your pet gains <strong>Potency</strong> when tracking or fighting the supernatural.</p><p>It can move extremely quickly, outpacing any other creature or vehicle.</p>",
    "Ghost Form": "<p>Your pet gains <strong>Potency</strong> when tracking or fighting the supernatural.</p><p>It can transform into electroplasmic vapor as if it were a spirit.</p>",
    "Mind Link": "<p>Your pet gains <strong>Potency</strong> when tracking or fighting the supernatural.</p><p>You and your pet can share senses and thoughts telepathically.</p>"
  },
  FlawTooltips: {
    Principled: "<p>The cohort has an ethic or values that it won't betray.</p>",
    Savage: "<p>The cohort is excessively violent and cruel.</p>",
    Unreliable: "<p>The cohort isn't always available, due to other obligations, stupefaction from their vices, etc.</p>",
    Wild: "<p>The cohort is drunken, debauched, and loud-mouthed.</p>",
    Costly: "<p>The vehicle costs <strong>1 Coin</strong> per <strong>downtime</strong> to keep it in operation.</p>",
    Distinct: "<p>The vehicle has memorable features. Take <strong>+1 Heat</strong> when you use it on a score.</p>",
    Finicky: "<p>The vehicle has quirks that only one person understands. When operated without them, it has <strong>-1 Quality</strong>.</p>"
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
    { crit: 0, success: 2.8, partial: 22.2, fail: 75 },
    { crit: 0, success: 16.7, partial: 33.3, fail: 50 },
    { crit: 2.8, success: 27.8, partial: 44.4, fail: 25 },
    { crit: 7.4, success: 34.7, partial: 45.4, fail: 12.5 },
    { crit: 13.2, success: 38.6, partial: 42, fail: 6.3 },
    { crit: 19.6, success: 40.2, partial: 37.1, fail: 3.1 },
    { crit: 26.3, success: 40.2, partial: 31.9, fail: 1.6 },
    { crit: 33, success: 39.1, partial: 27.1, fail: 0.8 },
    { crit: 39.5, success: 37.2, partial: 22.9, fail: 0.4 },
    { crit: 45.7, success: 34.9, partial: 19.2, fail: 0.2 },
    { crit: 51.5, success: 32.3, partial: 16.1, fail: 0.1 },
    { crit: 56.9, success: 29.6, partial: 13.4, fail: 0 },
    { crit: 61.9, success: 26.9, partial: 11.2, fail: 0 },
    { crit: 66.3, success: 24.3, partial: 9.3, fail: 0 },
    { crit: 70.4, success: 21.8, partial: 7.8, fail: 0 },
    { crit: 74, success: 19.5, partial: 6.5, fail: 0 },
    { crit: 77.3, success: 17.3, partial: 5.4, fail: 0 },
    { crit: 80.2, success: 15.3, partial: 4.5, fail: 0 },
    { crit: 82.7, success: 13.5, partial: 3.8, fail: 0 },
    { crit: 85, success: 11.9, partial: 3.1, fail: 0 },
    { crit: 87, success: 10.4, partial: 2.6, fail: 0 }
  ],
  DiceOddsResistance: [
    // Stress Cost: [-1, 0, 1, 2, 3, 4, 5]
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
      "system.trauma_conditions": ["Cold", "Haunted", "Obsessed", "Paranoid", "Reckless", "Soft", "Unstable", "Vicious"],
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
      "system.bgImg": "systems/eunos-blades/assets/icons/class-icons/hound-trans.svg",
      "system.tagline": "A Deadly Sharpshooter & Tracker",
      // "system.acquaintances_name": "Deadly Friends & Rivals",
      "system.friends_name": "Deadly Friends",
      "system.rivals_name": "Deadlier Rivals",
      "system.starting_stats.chargen": {
        "system.attributes.insight.hunt.value": 2,
        "system.attributes.insight.survey.value": 1
      },
      "system.experience_clues": [
        "You addressed a challenge with tracking or violence.",
        "You expressed your beliefs, drives, heritage, or background.",
        "You struggled with issues from your vice or traumas during the session."
      ],
      "system.trauma_conditions": ["Cold", "Haunted", "Obsessed", "Paranoid", "Reckless", "Soft", "Unstable", "Vicious"],
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
      "system.bgImg": "systems/eunos-blades/assets/icons/class-icons/leech-trans.svg",
      "system.tagline": "A Saboteur & Technician",
      // "system.acquaintances_name": "Clever Friends & Rivals",
      "system.friends_name": "Clever Friends",
      "system.rivals_name": "Cleverer Rivals",
      "system.starting_stats.chargen": {
        "system.attributes.insight.tinker.value": 2,
        "system.attributes.prowess.wreck.value": 1
      },
      "system.experience_clues": [
        "You addressed a challenge with technical skill or mayhem.",
        "You expressed your beliefs, drives, heritage, or background.",
        "You struggled with issues from your vice or traumas during the session."
      ],
      "system.trauma_conditions": ["Cold", "Haunted", "Obsessed", "Paranoid", "Reckless", "Soft", "Unstable", "Vicious"],
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
      "system.bgImg": "systems/eunos-blades/assets/icons/class-icons/lurk-trans.svg",
      "system.tagline": "A Stealthy Infiltrator & Burglar",
      // "system.acquaintances_name": "Shady Friends & Rivals",
      "system.friends_name": "Shady Friends",
      "system.rivals_name": "Shadier Rivals",
      "system.starting_stats.chargen": {
        "system.attributes.prowess.prowl.value": 2,
        "system.attributes.prowess.finesse.value": 1
      },
      "system.experience_clues": [
        "You addressed a challenge with stealth or evasion.",
        "You expressed your beliefs, drives, heritage, or background.",
        "You struggled with issues from your vice or traumas during the session."
      ],
      "system.trauma_conditions": ["Cold", "Haunted", "Obsessed", "Paranoid", "Reckless", "Soft", "Unstable", "Vicious"],
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
      "system.bgImg": "systems/eunos-blades/assets/icons/class-icons/slide-trans.svg",
      "system.tagline": "A Subtle Manipulator & Spy",
      // "system.acquaintances_name": "Sly Friends & Rivals",
      "system.friends_name": "Sly Friends",
      "system.rivals_name": "Slyer Rivals",
      "system.starting_stats.chargen": {
        "system.attributes.resolve.sway.value": 2,
        "system.attributes.resolve.consort.value": 1
      },
      "system.experience_clues": [
        "You addressed a challenge with deception or influence.",
        "You expressed your beliefs, drives, heritage, or background.",
        "You struggled with issues from your vice or traumas during the session."
      ],
      "system.trauma_conditions": ["Cold", "Haunted", "Obsessed", "Paranoid", "Reckless", "Soft", "Unstable", "Vicious"],
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
      "system.bgImg": "systems/eunos-blades/assets/icons/class-icons/spider-trans.svg",
      "system.tagline": "A Devious Mastermind",
      // "system.acquaintances_name": "Shrewd Friends & Rivals",
      "system.friends_name": "Shrewd Friends",
      "system.rivals_name": "Very Shrewd Rivals",
      "system.starting_stats.chargen": {
        "system.attributes.resolve.consort.value": 2,
        "system.attributes.insight.study.value": 1
      },
      "system.experience_clues": [
        "You addressed a challenge with calculation or conspiracy.",
        "You expressed your beliefs, drives, heritage, or background.",
        "You struggled with issues from your vice or traumas during the session."
      ],
      "system.trauma_conditions": ["Cold", "Haunted", "Obsessed", "Paranoid", "Reckless", "Soft", "Unstable", "Vicious"],
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
      "system.bgImg": "systems/eunos-blades/assets/icons/class-icons/whisper-trans.svg",
      "system.tagline": "An Arcane Adept & Channeler",
      // "system.acquaintances_name": "Strange Friends & Rivals",
      "system.friends_name": "Strange Friends",
      "system.rivals_name": "Stranger Rivals",
      "system.starting_stats.chargen": {
        "system.attributes.resolve.attune.value": 2,
        "system.attributes.insight.study.value": 1
      },
      "system.experience_clues": [
        "You addressed a challenge with knowledge or arcane power.",
        "You expressed your beliefs, drives, heritage, or background.",
        "You struggled with issues from your vice or traumas during the session."
      ],
      "system.trauma_conditions": ["Cold", "Haunted", "Obsessed", "Paranoid", "Reckless", "Soft", "Unstable", "Vicious"],
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
      "system.bgImg": "systems/eunos-blades/assets/icons/class-icons/ghost-trans.svg",
      "system.tagline": "A Vengeful Disembodied Spirit",
      "system.acquaintances_name": "Enemies & Rivals",
      "system.starting_stats.add": {
        "system.attributes.insight.hunt.value": 1,
        "system.attributes.prowess.prowl.value": 1,
        "system.attributes.resolve.attune.value": 1
      },
      "system.experience_clues": [
        "You exacted vengeance upon those whom you deem deserving.",
        "You expressed your outrage or anger, or settled scores from your heritage, or background.",
        "You struggled with issues from your need or glooms during the session."
      ],
      "system.trauma_conditions": ["Chaotic", "Destructive", "Furious", "Obsessive", "Territorial", "Savage"],
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
      "system.bgImg": "systems/eunos-blades/assets/icons/class-icons/hull-trans.svg",
      "system.tagline": "An Animated Spark-Craft Frame",
      "system.acquaintances_name": "Master",
      "system.starting_stats.add": {
        "system.attributes.prowess.skirmish.value": 1,
        "system.attributes.resolve.attune.value": 1
      },
      "system.experience_clues": [
        "You fulfilled your functions despite difficulty or danger.",
        "You suppressed or ignored your former human beliefs, drives, heritage, or background.",
        "You struggled with issues from your wear during the session."
      ],
      "system.trauma_conditions": ["Clanking", "Leaking", "Fixated", "Smoking", "Sparking", "Unstable"],
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
      "system.bgImg": "systems/eunos-blades/assets/icons/class-icons/vampire-trans.svg",
      "system.tagline": "An Animated Undead Body",
      "system.acquaintances_name": "Dark Servants",
      "system.starting_stats.add": {
        "system.attributes.insight.hunt.value": 1,
        "system.attributes.prowess.prowl.value": 1,
        "system.attributes.prowess.skirmish.value": 1,
        "system.attributes.resolve.attune.value": 1,
        "system.attributes.resolve.command.value": 1,
        "system.attributes.resolve.sway.value": 1
      },
      "system.experience_clues": [
        "You displayed your dominance or slayed without mercy.",
        "You expressed your beliefs, drives, heritage, or background.",
        "You struggled with issues from your vice, traumas, or strictures during the session."
      ],
      "system.trauma_conditions": ["Cold", "Haunted", "Obsessed", "Paranoid", "Ruthless", "Secretive", "Unstable", "Vicious"],
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
    "pc",
    "npc",
    "crew",
    "faction"
    /* faction */
  ],
  ItemTypes: [
    "ability",
    "background",
    "clock_keeper",
    "cohort_gang",
    "cohort_expert",
    "crew_ability",
    "crew_reputation",
    "crew_playbook",
    "crew_upgrade",
    "feature",
    "gm_tracker",
    "heritage",
    "gear",
    "playbook",
    "preferred_op",
    "stricture",
    "vice",
    "project",
    "ritual",
    "design",
    "location",
    "score"
    /* score */
  ],
  SimpleItemTypes: [
    "background",
    "crew_reputation",
    "feature",
    "heritage",
    "preferred_op",
    "stricture"
    /* stricture */
  ],
  Attribute: [
    "insight",
    "prowess",
    "resolve"
    /* resolve */
  ],
  Action: {
    insight: [
      "hunt",
      "study",
      "survey",
      "tinker"
      /* tinker */
    ],
    prowess: [
      "finesse",
      "prowl",
      "skirmish",
      "wreck"
      /* wreck */
    ],
    resolve: [
      "attune",
      "command",
      "consort",
      "sway"
      /* sway */
    ]
  },
  Vices: [
    "Faith",
    "Gambling",
    "Luxury",
    "Obligation",
    "Pleasure",
    "Stupor",
    "Weird",
    "Worship",
    "Living_Essence",
    "Life_Essence",
    "Electroplasmic_Power"
    /* Electroplasmic_Power */
  ]
}, H = {
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
      { name: "Infected Wound", category: "Character Effect", effect: "The next time you Recover from Harm, your Physicker is at -1d." },
      { name: "Infected Wound", category: "Character Effect", effect: "The next time you Recover from Harm, your Physicker is at -1d." },
      { name: "Infected Wound", category: "Character Effect", effect: "The next time you Recover from Harm, your Physicker is at -1d." },
      { name: "It's Mine Now", category: "Character Effect", effect: "You discover a small item that belongs to a rival. What is it? Who used to own it? How does this change things for you?" },
      { name: "It's Mine Now", category: "Character Effect", effect: "You discover a small item that belongs to a rival. What is it? Who used to own it? How does this change things for you?" },
      { name: "It's Mine Now", category: "Character Effect", effect: "You discover a small item that belongs to a rival. What is it? Who used to own it? How does this change things for you?" },
      { name: "Mine By Blood", category: "Character Effect", effect: "You discover evidence of the death of a family member during the Score. Who is it? How did they die? How does this change things for your character?" },
      { name: "Mine By Blood", category: "Character Effect", effect: "You discover evidence of the death of a family member during the Score. Who is it? How did they die? How does this change things for your character?" },
      { name: "Mine By Blood", category: "Character Effect", effect: "You discover evidence of the death of a family member during the Score. Who is it? How did they die? How does this change things for your character?" },
      { name: "Mine By Name", category: "Character Effect", effect: "You discover an envelope addressed to you during the Score. What is in it? Who left it here for you to find? How does this change things for your character?" },
      { name: "Mine By Name", category: "Character Effect", effect: "You discover an envelope addressed to you during the Score. What is in it? Who left it here for you to find? How does this change things for your character?" },
      { name: "Mine By Name", category: "Character Effect", effect: "You discover an envelope addressed to you during the Score. What is in it? Who left it here for you to find? How does this change things for your character?" },
      { name: "Mine By Rights", category: "Character Effect", effect: "You discover a small item from your past during the Score. What is it? What does it mean that it's here? Does this change things for your character?" },
      { name: "Mine By Rights", category: "Character Effect", effect: "You discover a small item from your past during the Score. What is it? What does it mean that it's here? Does this change things for your character?" },
      { name: "Mine By Rights", category: "Character Effect", effect: "You discover a small item from your past during the Score. What is it? What does it mean that it's here? Does this change things for your character?" },
      { name: "Not Paying Attention", category: "Character Effect", effect: "Uncheck one of the XP triggers already marked for your character for this Score." },
      { name: "Not Paying Attention", category: "Character Effect", effect: "Uncheck one of the XP triggers already marked for your character for this Score." },
      { name: "Shadow From the Past", category: "Character Effect", effect: "Your intel missed that someone from your past is associated with the target of the Score. Who is it, and how does that change things for you?" },
      { name: "Shadow From the Past", category: "Character Effect", effect: "Your intel missed that someone from your past is associated with the target of the Score. Who is it, and how does that change things for you?" },
      { name: "Shadow From the Past", category: "Character Effect", effect: "Your intel missed that someone from your past is associated with the target of the Score. Who is it, and how does that change things for you?" },
      { name: "Thicker than Blood", category: "Character Effect", effect: "Your intel missed that one of your family members is associated with the target of the Score. How does that change things for you?" },
      { name: "Thicker than Blood", category: "Character Effect", effect: "Your intel missed that one of your family members is associated with the target of the Score. How does that change things for you?" },
      { name: "Thicker than Blood", category: "Character Effect", effect: "Your intel missed that one of your family members is associated with the target of the Score. How does that change things for you?" },
      { name: "Why'd It Have To Be...", category: "Character Effect", effect: "The room you're in triggers a phobia that the Crew didn't know about before. Describe the phobia and take 2 Stress." },
      { name: "Why'd It Have To Be...", category: "Character Effect", effect: "The room you're in triggers a phobia that the Crew didn't know about before. Describe the phobia and take 2 Stress." },
      { name: "Why'd It Have To Be...", category: "Character Effect", effect: "The room you're in triggers a phobia that the Crew didn't know about before. Describe the phobia and take 2 Stress." },
      { name: "Demonic Guest", category: "Crew Effect", effect: "A demonic presence has appeared in your Lair and will need to be dealt with during Free Play." },
      { name: "Demonic Guest", category: "Crew Effect", effect: "A demonic presence has appeared in your Lair and will need to be dealt with during Free Play." },
      { name: "Fracturing Faction", category: "Crew Effect", effect: "If your Hold is Strong, reduce it to Weak. If your Hold is Weak, reduce your Rep to zero." },
      { name: "Lesson Not Learned", category: "Crew Effect", effect: "Uncheck one of the XP triggers already marked for your crew for this Score." },
      { name: "Lesson Not Learned", category: "Crew Effect", effect: "Uncheck one of the XP triggers already marked for your crew for this Score." },
      { name: "Otherworldly Guest", category: "Crew Effect", effect: "A scion of one of the Old Gods has appeared in your Lair and will need to be dealt with during Free Play." },
      { name: "Otherworldly Guest", category: "Crew Effect", effect: "A scion of one of the Old Gods has appeared in your Lair and will need to be dealt with during Free Play." },
      { name: "Rebellious Faction", category: "Crew Effect", effect: "A new crew has taken possession of one of your Claims, and will have to be dealt with in Free Play." },
      { name: "Spectral Guest", category: "Crew Effect", effect: "A ghostly presence has appeared in your Lair and will need to be dealt with during Free Play." },
      { name: "Spectral Guest", category: "Crew Effect", effect: "A ghostly presence has appeared in your Lair and will need to be dealt with during Free Play." },
      { name: "Turncoat", category: "Crew Effect", effect: "One of your Cohorts leaves your crew and joins a rival." },
      { name: "Double-Crossed", category: "Downtime Effect", effect: "After the normal Entanglement roll and result, your Crew takes an additional Flipped result." },
      { name: "Double-Crossed", category: "Downtime Effect", effect: "After the normal Entanglement roll and result, your Crew takes an additional Flipped result." },
      { name: "Double-Crossed", category: "Downtime Effect", effect: "After the normal Entanglement roll and result, your Crew takes an additional Flipped result." },
      { name: "Easily Identified", category: "Downtime Effect", effect: "You left something behind that is easily traced to you. Choose either +2 Heat and −2 Rep, or +1 Heat and −1 Rep." },
      { name: "Easily Identified", category: "Downtime Effect", effect: "You left something behind that is easily traced to you. Choose either +2 Heat and −2 Rep, or +1 Heat and −1 Rep." },
      { name: "Easily Identified", category: "Downtime Effect", effect: "You left something behind that is easily traced to you. Choose either +2 Heat and −2 Rep, or +1 Heat and −1 Rep." },
      { name: "High Profile", category: "Downtime Effect", effect: "This Score gains +2 Heat." },
      { name: "High Profile", category: "Downtime Effect", effect: "This Score gains +2 Heat." },
      { name: "High Profile", category: "Downtime Effect", effect: "This Score gains +2 Heat." },
      { name: "Most Wanted", category: "Downtime Effect", effect: "After the normal Entanglement roll and result, you are the target of an additional Arrest result." },
      { name: "Most Wanted", category: "Downtime Effect", effect: "After the normal Entanglement roll and result, you are the target of an additional Arrest result." },
      { name: "Project Setback", category: "Downtime Effect", effect: "Mark one less Clock segment the first time you work on a Long-Term Project." },
      { name: "Project Setback", category: "Downtime Effect", effect: "Mark one less Clock segment the first time you work on a Long-Term Project." },
      { name: "Project Setback", category: "Downtime Effect", effect: "Mark one less Clock segment the first time you work on a Long-Term Project." },
      { name: "Quelle Horreur!", category: "Downtime Effect", effect: "You suffer nightmares for a week. −1d to all Downtime Actions after this Score." },
      { name: "Quelle Horreur!", category: "Downtime Effect", effect: "You suffer nightmares for a week. −1d to all Downtime Actions after this Score." },
      { name: "Shortchanged", category: "Downtime Effect", effect: "This Score's payoff is −2 Coin." },
      { name: "Shortchanged", category: "Downtime Effect", effect: "This Score's payoff is −2 Coin." },
      { name: "Shortchanged", category: "Downtime Effect", effect: "This Score's payoff is −2 Coin." },
      { name: "Supply Challenges", category: "Downtime Effect", effect: "The next time you pay Coin for an Acquire Asset roll, you must pay 3 instead of 2 Coin per Tier." },
      { name: "Supply Challenges", category: "Downtime Effect", effect: "The next time you pay Coin for an Acquire Asset roll, you must pay 3 instead of 2 Coin per Tier." },
      { name: "Supply Delays", category: "Downtime Effect", effect: "Suffer -1d to your next Acquire Asset roll." },
      { name: "Supply Delays", category: "Downtime Effect", effect: "Suffer -1d to your next Acquire Asset roll." },
      { name: "Supply Delays", category: "Downtime Effect", effect: "Suffer -1d to your next Acquire Asset roll." },
      { name: "Tastes Like Ashes", category: "Downtime Effect", effect: "The next time you indulge your Vice, only clear half as much Stress (rounded down) as normal." },
      { name: "Tastes Like Ashes", category: "Downtime Effect", effect: "The next time you indulge your Vice, only clear half as much Stress (rounded down) as normal." },
      { name: "Thrice-Named", category: "Downtime Effect", effect: "After the normal Entanglement roll and result, your Crew takes an additional Demonic Notice result." },
      { name: "Thrice-Named", category: "Downtime Effect", effect: "After the normal Entanglement roll and result, your Crew takes an additional Demonic Notice result." },
      { name: "Thrice-Named", category: "Downtime Effect", effect: "After the normal Entanglement roll and result, your Crew takes an additional Demonic Notice result." },
      { name: "Warden's Attention", category: "Downtime Effect", effect: "+4 Heat (instead of the normal +2 Heat) if there is a death during this Score." },
      { name: "Warden's Attention", category: "Downtime Effect", effect: "+4 Heat (instead of the normal +2 Heat) if there is a death during this Score." },
      { name: "We Want a Bigger Take!", category: "Downtime Effect", effect: "The gang wants a bigger piece of the action. −2 Coin to Payoff for each Cohort used in this Score." },
      { name: "We Want a Bigger Take!", category: "Downtime Effect", effect: "The gang wants a bigger piece of the action. −2 Coin to Payoff for each Cohort used in this Score." },
      { name: "Weekend Getaway", category: "Downtime Effect", effect: "If you indulge your Vice after this Score, you automatically overindulge." },
      { name: "Weekend Getaway", category: "Downtime Effect", effect: "If you indulge your Vice after this Score, you automatically overindulge." },
      { name: "Weekend Getaway", category: "Downtime Effect", effect: "If you indulge your Vice after this Score, you automatically overindulge." },
      { name: "What's Our Take?", category: "Downtime Effect", effect: "The gang wants a bigger piece of the action. −1 Coin to Payoff for each Cohort used in this Score." },
      { name: "What's Our Take?", category: "Downtime Effect", effect: "The gang wants a bigger piece of the action. −1 Coin to Payoff for each Cohort used in this Score." },
      { name: "What's Our Take?", category: "Downtime Effect", effect: "The gang wants a bigger piece of the action. −1 Coin to Payoff for each Cohort used in this Score." },
      { name: "Accelerating Plans", category: "Faction Relationship Effect", effect: "A rival faction advances one of its Clocks by two before your next Score." },
      { name: "Accelerating Plans", category: "Faction Relationship Effect", effect: "A rival faction advances one of its Clocks by two before your next Score." },
      { name: "Accelerating Plans", category: "Faction Relationship Effect", effect: "A rival faction advances one of its Clocks by two before your next Score." },
      { name: "Escalating Tensions", category: "Faction Relationship Effect", effect: "A faction of your choice that is unfriendly to your crew moves one step towards War." },
      { name: "Escalating Tensions", category: "Faction Relationship Effect", effect: "A faction of your choice that is unfriendly to your crew moves one step towards War." },
      { name: "Forgiveness or Vengeance?", category: "Faction Relationship Effect", effect: "During the Score, one of your Cohorts got in a fight with an neutral Cohort. Choose −2 Rep and +1 faction relationship, or +2 Rep and −1 faction relationship." },
      { name: "Forgiveness or Vengeance?", category: "Faction Relationship Effect", effect: "During the Score, one of your Cohorts got in a fight with an neutral Cohort. Choose −2 Rep and +1 faction relationship, or +2 Rep and −1 faction relationship." },
      { name: "Forgiveness or Vengeance?", category: "Faction Relationship Effect", effect: "During the Score, one of your Cohorts got in a fight with an neutral Cohort. Choose −2 Rep and +1 faction relationship, or +2 Rep and −1 faction relationship." },
      { name: "Hot-Headed Cohort", category: "Faction Relationship Effect", effect: "During the Score, one of your Cohorts picked a fight with an allied Cohort. Pay 2 Coin, lose 2 Rep, or −1 faction relationship." },
      { name: "Hot-Headed Cohort", category: "Faction Relationship Effect", effect: "During the Score, one of your Cohorts picked a fight with an allied Cohort. Pay 2 Coin, lose 2 Rep, or −1 faction relationship." },
      { name: "Hot-Headed Cohort", category: "Faction Relationship Effect", effect: "During the Score, one of your Cohorts picked a fight with an allied Cohort. Pay 2 Coin, lose 2 Rep, or −1 faction relationship." },
      { name: "Mixed Messages", category: "Faction Relationship Effect", effect: "A faction of your choice that is friendly to your crew moves one step towards Neutral." },
      { name: "Mixed Messages", category: "Faction Relationship Effect", effect: "A faction of your choice that is friendly to your crew moves one step towards Neutral." },
      { name: "Mutual Defense", category: "Faction Relationship Effect", effect: "A friendly Faction goes to War with a neutral Faction. Either join their War, or they move to −1 on the relationship chart." },
      { name: "Mutual Defense", category: "Faction Relationship Effect", effect: "A friendly Faction goes to War with a neutral Faction. Either join their War, or they move to −1 on the relationship chart." },
      { name: "Tensions Spread", category: "Faction Relationship Effect", effect: "One Neutral Faction moves a step towards War, and another Neutral Faction moves a step towards Ally." },
      { name: "Tensions Spread", category: "Faction Relationship Effect", effect: "One Neutral Faction moves a step towards War, and another Neutral Faction moves a step towards Ally." },
      { name: "Tensions Spread", category: "Faction Relationship Effect", effect: "One Neutral Faction moves a step towards War, and another Neutral Faction moves a step towards Ally." },
      { name: "The Walls Have Ears", category: "Faction Relationship Effect", effect: "A friendly faction hears you did a Score against their ally. −1 to that faction's relationship rating." },
      { name: "The Walls Have Ears", category: "Faction Relationship Effect", effect: "A friendly faction hears you did a Score against their ally. −1 to that faction's relationship rating." },
      { name: "The Walls Have Ears", category: "Faction Relationship Effect", effect: "A friendly faction hears you did a Score against their ally. −1 to that faction's relationship rating." },
      { name: "The Walls Have Eyes", category: "Faction Relationship Effect", effect: "A friendly faction hears you did a Score against their ally. −1 to both factions' relationship ratings." },
      { name: "The Walls Have Eyes", category: "Faction Relationship Effect", effect: "A friendly faction hears you did a Score against their ally. −1 to both factions' relationship ratings." },
      { name: "...and Into the Fire", category: "Immediate Effect", effect: "You are ambushed by an assassin or bounty hunter. Start a 4-Clock, 'Elite Ambusher' to overcome this new foe." },
      { name: "...and Into the Fire", category: "Immediate Effect", effect: "You are ambushed by an assassin or bounty hunter. Start a 4-Clock, 'Elite Ambusher' to overcome this new foe." },
      { name: "A Familiar Face", category: "Immediate Effect", effect: "You recognize a contact of your choice among the rivals you are running the Score against." },
      { name: "A Familiar Face", category: "Immediate Effect", effect: "You recognize a contact of your choice among the rivals you are running the Score against." },
      { name: "A Familiar Face", category: "Immediate Effect", effect: "You recognize a contact of your choice among the rivals you are running the Score against." },
      { name: "Accidental Discharge", category: "Immediate Effect", effect: "A weapon or item you are carrying loudly discharges and needs to be reloaded before it can be used." },
      { name: "Accidental Discharge", category: "Immediate Effect", effect: "A weapon or item you are carrying loudly discharges and needs to be reloaded before it can be used." },
      { name: "Accidental Discharge", category: "Immediate Effect", effect: "A weapon or item you are carrying loudly discharges and needs to be reloaded before it can be used." },
      { name: "All or Nothing", category: "Immediate Effect", effect: "If you fail this roll, you cannot resist the effects of that failure." },
      { name: "All or Nothing", category: "Immediate Effect", effect: "If you fail this roll, you cannot resist the effects of that failure." },
      { name: "All or Nothing", category: "Immediate Effect", effect: "If you fail this roll, you cannot resist the effects of that failure." },
      { name: "Bishop's Gambit", category: "Immediate Effect", effect: "If you are not in combat, gain +2d for this roll instead of the standard +1d; but you can roll no more than 1d for your next Action." },
      { name: "Bishop's Gambit", category: "Immediate Effect", effect: "If you are not in combat, gain +2d for this roll instead of the standard +1d; but you can roll no more than 1d for your next Action." },
      { name: "Bishop's Gambit", category: "Immediate Effect", effect: "If you are not in combat, gain +2d for this roll instead of the standard +1d; but you can roll no more than 1d for your next Action." },
      { name: "Brute Force Method", category: "Immediate Effect", effect: "You noisily break a weapon of your choice while attempting this Action, even if it is not a combat Action." },
      { name: "Brute Force Method", category: "Immediate Effect", effect: "You noisily break a weapon of your choice while attempting this Action, even if it is not a combat Action." },
      { name: "Brute Force Method", category: "Immediate Effect", effect: "You noisily break a weapon of your choice while attempting this Action, even if it is not a combat Action." },
      { name: "Clear the Board", category: "Immediate Effect", effect: "If you succeed at this roll, clear or fill a Score Clock of your choice. If you fail the roll, you Trauma out of the scene." },
      { name: "Clear the Board", category: "Immediate Effect", effect: "If you succeed at this roll, clear or fill a Score Clock of your choice. If you fail the roll, you Trauma out of the scene." },
      { name: "Devil's Exchange", category: "Immediate Effect", effect: "You gain the normal +1d to this roll, but suffer −1d to your next Action, and cannot take a Devil's Bargain to offset it." },
      { name: "Devil's Exchange", category: "Immediate Effect", effect: "You gain the normal +1d to this roll, but suffer −1d to your next Action, and cannot take a Devil's Bargain to offset it." },
      { name: "Devil's Exchange", category: "Immediate Effect", effect: "You gain the normal +1d to this roll, but suffer −1d to your next Action, and cannot take a Devil's Bargain to offset it." },
      { name: "Ghostly Attention", category: "Immediate Effect", effect: "Whether you succeed in this roll or not, a ghost in the area notices you and begins stalking you." },
      { name: "Ghostly Attention", category: "Immediate Effect", effect: "Whether you succeed in this roll or not, a ghost in the area notices you and begins stalking you." },
      { name: "Ghostly Attention", category: "Immediate Effect", effect: "Whether you succeed in this roll or not, a ghost in the area notices you and begins stalking you." },
      { name: "Gimcrack Gear", category: "Immediate Effect", effect: "Whatever weapon or tool you are using is cheaply made and breaks whether the roll succeeds or not." },
      { name: "Gimcrack Gear", category: "Immediate Effect", effect: "Whatever weapon or tool you are using is cheaply made and breaks whether the roll succeeds or not." },
      { name: "Gimcrack Gear", category: "Immediate Effect", effect: "Whatever weapon or tool you are using is cheaply made and breaks whether the roll succeeds or not." },
      { name: "Gone Rogue", category: "Immediate Effect", effect: "You cannot accept an Assist for the rest of this Score." },
      { name: "Gone Rogue", category: "Immediate Effect", effect: "You cannot accept an Assist for the rest of this Score." },
      { name: "Hunter Becomes Hunted", category: "Immediate Effect", effect: "You've been so preoccupied with the obstacles in front of you that you didn't notice the rival lining up a shot behind you." },
      { name: "Hunter Becomes Hunted", category: "Immediate Effect", effect: "You've been so preoccupied with the obstacles in front of you that you didn't notice the rival lining up a shot behind you." },
      { name: "Hunter Becomes Hunted", category: "Immediate Effect", effect: "You've been so preoccupied with the obstacles in front of you that you didn't notice the rival lining up a shot behind you." },
      { name: "I Know I Packed It!", category: "Immediate Effect", effect: "You must immediately check off 1 Load to no effect, representing equipment you've misplaced." },
      { name: "I Know I Packed It!", category: "Immediate Effect", effect: "You must immediately check off 1 Load to no effect, representing equipment you've misplaced." },
      { name: "I Know I Packed It!", category: "Immediate Effect", effect: "You must immediately check off 1 Load to no effect, representing equipment you've misplaced." },
      { name: "I Know I Packed Them!", category: "Immediate Effect", effect: "You must immediately check off 2 Load to no effect, representing equipment you've misplaced." },
      { name: "I Know I Packed Them!", category: "Immediate Effect", effect: "You must immediately check off 2 Load to no effect, representing equipment you've misplaced." },
      { name: "I Know I Packed Them!", category: "Immediate Effect", effect: "You must immediately check off 2 Load to no effect, representing equipment you've misplaced." },
      { name: "Jangled Nerves", category: "Immediate Effect", effect: "For the rest of the Score, all rolls to Resist generate +1 Stress." },
      { name: "Jangled Nerves", category: "Immediate Effect", effect: "For the rest of the Score, all rolls to Resist generate +1 Stress." },
      { name: "Jangled Nerves", category: "Immediate Effect", effect: "For the rest of the Score, all rolls to Resist generate +1 Stress." },
      { name: "Just a Little Spark", category: "Immediate Effect", effect: "A lamp or candle gets knocked over, catching a curtain or rug on fire. Start a Clock: 'Building is on Fire'." },
      { name: "Just a Little Spark", category: "Immediate Effect", effect: "A lamp or candle gets knocked over, catching a curtain or rug on fire. Start a Clock: 'Building is on Fire'." },
      { name: "Just a Little Spark", category: "Immediate Effect", effect: "A lamp or candle gets knocked over, catching a curtain or rug on fire. Start a Clock: 'Building is on Fire'." },
      { name: "King's Gambit", category: "Immediate Effect", effect: "If you fail at this roll, you are immune to any Harm; but you have a zero rating to your next Action." },
      { name: "King's Gambit", category: "Immediate Effect", effect: "If you fail at this roll, you are immune to any Harm; but you have a zero rating to your next Action." },
      { name: "King's Gambit", category: "Immediate Effect", effect: "If you fail at this roll, you are immune to any Harm; but you have a zero rating to your next Action." },
      { name: "Knight's Gambit", category: "Immediate Effect", effect: "If you are in combat, gain +2d for this roll instead of the standard +1d; but you can roll no more than 1d for your next Action." },
      { name: "Knight's Gambit", category: "Immediate Effect", effect: "If you are in combat, gain +2d for this roll instead of the standard +1d; but you can roll no more than 1d for your next Action." },
      { name: "Knight's Gambit", category: "Immediate Effect", effect: "If you are in combat, gain +2d for this roll instead of the standard +1d; but you can roll no more than 1d for your next Action." },
      { name: "Knuckle Buster", category: "Immediate Effect", effect: "Whether this Action succeeds or not, you accidentally inflict level 1 Harm on your hand, 'Busted Knuckles.'" },
      { name: "Knuckle Buster", category: "Immediate Effect", effect: "Whether this Action succeeds or not, you accidentally inflict level 1 Harm on your hand, 'Busted Knuckles.'" },
      { name: "Knuckle Buster", category: "Immediate Effect", effect: "Whether this Action succeeds or not, you accidentally inflict level 1 Harm on your hand, 'Busted Knuckles.'" },
      { name: "Now or Never", category: "Immediate Effect", effect: "If you fail this roll, you lose this opportunity and cannot retry it for this Score." },
      { name: "Now or Never", category: "Immediate Effect", effect: "If you fail this roll, you lose this opportunity and cannot retry it for this Score." },
      { name: "Now or Never", category: "Immediate Effect", effect: "If you fail this roll, you lose this opportunity and cannot retry it for this Score." },
      { name: "Out of the Frying Pan...", category: "Immediate Effect", effect: "Things are about to go from bad to worse. Start a 4-Clock, 'Surprise Reinforcements'." },
      { name: "Out of the Frying Pan...", category: "Immediate Effect", effect: "Things are about to go from bad to worse. Start a 4-Clock, 'Surprise Reinforcements'." },
      { name: "Out of the Frying Pan...", category: "Immediate Effect", effect: "Things are about to go from bad to worse. Start a 4-Clock, 'Surprise Reinforcements'." },
      { name: "Overextended", category: "Immediate Effect", effect: "Your next Action automatically has reduced Effect." },
      { name: "Overextended", category: "Immediate Effect", effect: "Your next Action automatically has reduced Effect." },
      { name: "Overextended", category: "Immediate Effect", effect: "Your next Action automatically has reduced Effect." },
      { name: "Pawn's Gambit", category: "Immediate Effect", effect: "You cannot use Load for Armor during this Score. You cannot accept this bargain if you already have used Load for Armor." },
      { name: "Pawn's Gambit", category: "Immediate Effect", effect: "You cannot use Load for Armor during this Score. You cannot accept this bargain if you already have used Load for Armor." },
      { name: "Pawn's Gambit", category: "Immediate Effect", effect: "You cannot use Load for Armor during this Score. You cannot accept this bargain if you already have used Load for Armor." },
      { name: "Plan C...", category: "Immediate Effect", effect: "Things are not going according to plan. Flashbacks cost +1 Stress for the rest of the Score." },
      { name: "Plan C...", category: "Immediate Effect", effect: "Things are not going according to plan. Flashbacks cost +1 Stress for the rest of the Score." },
      { name: "Queen's Gambit", category: "Immediate Effect", effect: "You automatically succeed at this Action as if you rolled a 6; but you have a zero rating to your next Action." },
      { name: "Queen's Gambit", category: "Immediate Effect", effect: "You automatically succeed at this Action as if you rolled a 6; but you have a zero rating to your next Action." },
      { name: "Queen's Gambit", category: "Immediate Effect", effect: "You automatically succeed at this Action as if you rolled a 6; but you have a zero rating to your next Action." },
      { name: "Quicksilver Poisoning", category: "Immediate Effect", effect: "Used in electroplasmic containers and devices, you get a noseful of quicksilver vapor, suffering level 1 Harm, 'Silverlung' which starts a 4-Clock Project to heal." },
      { name: "Quicksilver Poisoning", category: "Immediate Effect", effect: "Used in electroplasmic containers and devices, you get a noseful of quicksilver vapor, suffering level 1 Harm, 'Silverlung' which starts a 4-Clock Project to heal." },
      { name: "Quicksilver Poisoning", category: "Immediate Effect", effect: "Used in electroplasmic containers and devices, you get a noseful of quicksilver vapor, suffering level 1 Harm, 'Silverlung' which starts a 4-Clock Project to heal." },
      { name: "Rook's Gambit", category: "Immediate Effect", effect: "You cannot use Load for Unusual or Scary Weapons this Score. You cannot accept this bargain if you already have used Load for these." },
      { name: "Rook's Gambit", category: "Immediate Effect", effect: "You cannot use Load for Unusual or Scary Weapons this Score. You cannot accept this bargain if you already have used Load for these." },
      { name: "Rook's Gambit", category: "Immediate Effect", effect: "You cannot use Load for Unusual or Scary Weapons this Score. You cannot accept this bargain if you already have used Load for these." },
      { name: "Shot Nerves", category: "Immediate Effect", effect: "For the rest of the Score, all rolls to Resist generate +2 Stress." },
      { name: "Shot Nerves", category: "Immediate Effect", effect: "For the rest of the Score, all rolls to Resist generate +2 Stress." },
      { name: "Turned Around", category: "Immediate Effect", effect: "You lose track of your position. Start a 4-Clock, 'Where Am I?' You must use Actions looking for your Crew to rejoin them." },
      { name: "Turned Around", category: "Immediate Effect", effect: "You lose track of your position. Start a 4-Clock, 'Where Am I?' You must use Actions looking for your Crew to rejoin them." },
      { name: "Turned Around", category: "Immediate Effect", effect: "You lose track of your position. Start a 4-Clock, 'Where Am I?' You must use Actions looking for your Crew to rejoin them." },
      { name: "Unsure Footing", category: "Immediate Effect", effect: "Whether you succeed in this roll or not, you loose your footing and fall prone after this Action." },
      { name: "Unsure Footing", category: "Immediate Effect", effect: "Whether you succeed in this roll or not, you loose your footing and fall prone after this Action." },
      { name: "Unsure Footing", category: "Immediate Effect", effect: "Whether you succeed in this roll or not, you loose your footing and fall prone after this Action." },
      { name: "Worse than We thought", category: "Immediate Effect", effect: "A Clock of your choice that is running for this Score is either advanced or set back by two segments (whichever is worse for the Crew)." },
      { name: "Worse than We thought", category: "Immediate Effect", effect: "A Clock of your choice that is running for this Score is either advanced or set back by two segments (whichever is worse for the Crew)." },
      { name: "You're All On Your Own", category: "Immediate Effect", effect: "After this roll, you cannot offer to Assist on anyone else's roll for the rest of the Score." },
      { name: "You're All On Your Own", category: "Immediate Effect", effect: "After this roll, you cannot offer to Assist on anyone else's roll for the rest of the Score." },
      { name: "You're All On Your Own", category: "Immediate Effect", effect: "After this roll, you cannot offer to Assist on anyone else's roll for the rest of the Score." },
      { name: "Death Will Not Stop Me", category: "Long-Term Effect", effect: "The ghost of someone you killed is driven to take you with it. Start a 12-Clock, 'Spectral Vengence'" },
      { name: "That's Enough of That", category: "Long-Term Effect", effect: "Someone whose goals are affected by this Score is going to focus on you now. Start a 8-Clock, 'Cold Vengence'" },
      { name: "That's Enough of That", category: "Long-Term Effect", effect: "Someone whose goals are affected by this Score is going to focus on you now. Start a 8-Clock, 'Cold Vengence'" },
      { name: "The Last Straw", category: "Long-Term Effect", effect: "You've royally pissed off someone with real clout in the city. Start a 12-Clock, 'Furious Vengence'" },
      { name: "You'll Pay For This", category: "Long-Term Effect", effect: "Someone hurt by this Score will come back to collect what's owed. Start a 6-Clock, 'Petty Vengence'" },
      { name: "You'll Pay For This", category: "Long-Term Effect", effect: "Someone hurt by this Score will come back to collect what's owed. Start a 6-Clock, 'Petty Vengence'" },
      { name: "You'll Pay For This", category: "Long-Term Effect", effect: "Someone hurt by this Score will come back to collect what's owed. Start a 6-Clock, 'Petty Vengence'" },
      { name: "Dalgomur, the Heart of the Storm", category: "Mandatory Effect", effect: "If one is not already active for the crew, start a 12-Clock labeled 'The Heart of the Storm' and set it to one. If the Clock is already active, advance it by one." },
      { name: "Dalgomur, the Heart of the Storm", category: "Mandatory Effect", effect: "If one is not already active for the crew, start a 12-Clock labeled 'The Heart of the Storm' and set it to one. If the Clock is already active, advance it by one." },
      { name: "Ulf Ironborn, the Skovlan Agitator", category: "Mandatory Effect", effect: "If one is not already active for the crew, start a 4-Clock labeled 'Skovlander Uprising' and set it to one. If the Clock is already active, advance it by one." },
      { name: "Ulf Ironborn, the Skovlan Agitator", category: "Mandatory Effect", effect: "If one is not already active for the crew, start a 4-Clock labeled 'Skovlander Uprising' and set it to one. If the Clock is already active, advance it by one." },
      { name: "Urumbar, the Closed Eye", category: "Mandatory Effect", effect: "If one is not already active for the crew, start an 8-Clock labeled 'The Closed Eye' and set it to one. If the Clock is already active, advance it by one." },
      { name: "Urumbar, the Closed Eye", category: "Mandatory Effect", effect: "If one is not already active for the crew, start an 8-Clock labeled 'The Closed Eye' and set it to one. If the Clock is already active, advance it by one." },
      { name: "Vaskani, the Crossroads Demon", category: "Mandatory Effect", effect: "If one is not already active for the crew, start a 6-Clock labeled 'The Crossroads Demon' and set it to one. If the Clock is already active, advance it by one." },
      { name: "Vaskani, the Crossroads Demon", category: "Mandatory Effect", effect: "If one is not already active for the crew, start a 6-Clock labeled 'The Crossroads Demon' and set it to one. If the Clock is already active, advance it by one." }
    ],
    Obstacles: [
      {
        name: "Centipedes",
        category: "Animal Guards",
        desc: "Centipedes the length of a forearm are almost noiseless. If they bite, their toxin causes living flesh to blacken and die, leading to amputation if the poison isn't countered. People tend to scream when bit.",
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
        name: "Great Cats",
        category: "Animal Guards",
        desc: "One or more great cats slink through the shadows. They like to attack from high places. Their fur mottles to match the colors and tones and textures around them.",
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
        name: "Hunting Spiders",
        category: "Animal Guards",
        desc: "These lightning-fast nightmares are about twenty pounds and three feet across, built like jumping spiders and loaded with paralytic venom.",
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
        name: "Mastiff Pack",
        category: "Animal Guards",
        desc: "A pack of mastiffs have run of the guarded area when it is not in more public use. They only respond to their masters, who have special tunics, whistles, and gloves. They kill anyone or anything else.",
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
        name: "Venomous Snakes",
        category: "Animal Guards",
        desc: "Venomous snakes have lairs prepared for them in the guarded area.",
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
        name: "Armor Hosts",
        category: "Ghostly Guards",
        desc: "Guardian spirits are able to inhabit a crystal melded to each suit of armor in a guarded area. When melded, the spirit can control the armor. Spirits use the armor to attack intruders.",
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
        name: "Coldrooms",
        category: "Ghostly Guards",
        desc: "The defended area is kept cold. Body heat registers like a plume of blood in the water. Ghosts flood living meat with cold, gorging on body heat, becoming more visible as their outlines swirl with life-blood.",
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
        name: "Cursed Treasure",
        category: "Ghostly Guards",
        desc: "Treasures are infused with a haunting spirit. Anyone touching the treasure will be cursed, dreaming the crimes of the ghost and attracting anger and distaste from strangers. Friends become uncomfortable and suspicious around the cursed scoundrel.",
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
        name: "Darkrooms",
        category: "Ghostly Guards",
        desc: "The defended area is dark. The ragged ghosts hate light. They shriek horribly as they attack light sources with slapping leathery hands, like bat wings. Intruders may glimpse their luminous fangs.",
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
        name: "Dynastic Hive",
        category: "Ghostly Guards",
        desc: "Ancestors have been ritually infused into the defense site, it is a dynastic holding. The spirits are old, and insane, but strategically placed to act out their madness in the most damaging way.",
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
        name: "Hunting Ghostpack",
        category: "Ghostly Guards",
        desc: "A group of weaponized ghosts haunts the defended area. They are capable of scouting to find intruders, descending on them with lethal force.",
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
        name: "Possession Gate",
        category: "Ghostly Guards",
        desc: "If an intruder breaks a clearly marked seal, the intruder is attacked by a possessing spirit that takes on the traits of the most strong-willed, brutal person the seal-breaker ever killed. The possessing spirit and the seal-breaker struggle for control. This counts as a harm.",
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
        name: "Spirit-Infused Art",
        category: "Ghostly Guards",
        desc: "Art works are haunted by spirits that are capable of spying. They observe their area, and may be able to murmur about what they see to a guardian.",
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
        name: "Starving Fog",
        category: "Ghostly Guards",
        desc: "The guarded area is in a clinging cold fog. Fog draws energy from those breathing in it until it manifests shadows that increase target fear, which feeds it more. Eventually it can manifest a killing shape.",
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
        name: "Sweat Nectar",
        category: "Ghostly Guards",
        desc: "The defended area is kept hot. Sweat tastes like nectar to swarming ghosts, who dehydrate targets into mummies. The stolen life force and moisture flows to prepared corpses, so ghosts can ride them again.",
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
        name: "Dartus Weed",
        category: "Supernatural Plants",
        desc: "When something moves near a tangled bank of dartus weed, the vines flex, flicking barbed tips towards the source of motion within arm's reach. The darts are paralytic; a target will pass out for about an hour.",
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
        name: "Dreamspore Shrooms",
        category: "Supernatural Plants",
        desc: "Placed on the ceiling, they drizzle sandy spores when they sense motion below. Victims hallucinate, heightening subconscious emotion (so they are very mellow, or super anxious, or filled with rage, etc.).",
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
        name: "Floormesh",
        category: "Supernatural Plants",
        desc: "Flat vines grow together to make flooring. Connected below is the bulb, covered in venomous spikes. Anyone heavier than a child will fall through. Blood and rot feed the floormesh.",
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
        name: "Ghost Crystal Topiary",
        category: "Supernatural Plants",
        desc: "Ghost crystals are worked into the roots of fancifully trimmed bushes. Ghosts may be able to inhabit the bushes and make them move. This gardening curiosity can be weaponized.",
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
        name: "Keenshrooms",
        category: "Supernatural Plants",
        desc: "These fist-sized mushrooms let out a keening wail when light comes within about thirty feet.",
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
        name: "Murder Tree",
        category: "Supernatural Plants",
        desc: "The willow tree grew around bones wired to it, spirit crystals studded in its bark, and leviathan blood at its roots. lt is dimly self-aware. It senses and hates life, whipping and clubbing any who approach.",
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
        name: "Snatchweed",
        category: "Supernatural Plants",
        desc: "It grows in fresh water, lengthening its long winding tendrils almost to the surface. When touched, it snatches and pulls, coiling down to the bottom and holding for a few minutes before relaxing back up.",
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
        name: "Thirstclimber",
        category: "Supernatural Plants",
        desc: "The vines are red, and when flesh touches them (even through leather) the vine draws blood to the surface in alarming quantities. The vines are slippery, and almost impossible to grasp with wet hands.",
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
        name: "Thirsty Thorns",
        category: "Supernatural Plants",
        desc: "Strategically placed thornbushes grow on walls and serve as decorations. They live on blood. They only flower if something dies on them; the bigger the life, the more impressive the bloom.",
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
        name: "Vine Curtains",
        category: "Supernatural Plants",
        desc: "Curtains of vines connect back to a radiant root that has grown semi­aware, fed on rogue spirits. If touched, the vines slither and writhe to entangle, hoist, and bundle the target for a guardian to find.",
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
        name: "Caul Piercers",
        category: "Traps",
        desc: "Piercers are designed to puncture whoever touches them. They pierce the energy caul of the character's life force in the Ghost Field. This causes a harm condition that worsens or costs stress every down time cycle until the caul can be mended (6 segment project.) Interpret as needed.",
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
        name: "Collapsing Ceilings",
        category: "Traps",
        desc: "If triggered, this trap drops a mass of stone. That seals off the threatened area, and crushes anyone tampering with its defenses.",
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
        name: "Combination or Trick",
        category: "Traps",
        desc: "Various portals and defenses of the site are protected by combination locks or riddles to solve. Lockpicks will not work against them, though finesse may solve them eventually.",
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
        name: "Contact Needles",
        category: "Traps",
        desc: "Small needles are worked into contact surfaces and poisoned, to deter intruders. They may be on doorknobs, seat backs or cushions, doorframes, stair treads, ledges, beds—anywhere, really.",
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
        name: "Excellent Locks",
        category: "Traps",
        desc: "Beyond simple security, these locks are works of art. They are higher potency than they would normally be. Also, they are equipped with poison needle traps, or pick breakers, or redundancies.",
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
        name: "Murder Holes",
        category: "Traps",
        desc: "Intruders go past one door, into a hallway or small room, and the door closes behind them. Arrow slits open in the walls, and slots in the ceiling allow boiling oil to be poured down. Intruders are trapped and vulnerable. These are often in doors through defenses.",
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
        name: "Pit Traps",
        category: "Traps",
        desc: "The defended site has pit traps in strategic places. They are between 10 and 40 feet deep.",
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
        name: "Retractable Spikes",
        category: "Traps",
        desc: "Spring-loaded spears or racks of spears launch at intruders. They can come from the side, behind, ahead, below, or above.",
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
        name: "Secret Doors & Spyholes",
        category: "Traps",
        desc: "Guardians are well trained in the use of numerous secret doors and hidden passages with spyholes. They can attack from unexpected directions, escape without a trace, and watch intruders unobserved.",
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
        name: "Shock Grips",
        category: "Traps",
        desc: "One or more contact points are connected to energy so they will badly shock anyone who touches them. These could be doorknobs, chest lids, floor plates, ladders, and so on.",
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
        name: "Brutal Sadists",
        category: "Twisted Guards",
        desc: "Only brutal sadists are hired on as guards. They have permission to play with captured intruders.",
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
        name: "Close-Knit Guard Network",
        category: "Twisted Guards",
        desc: "Guards are only hired by referral. Failure results in punishment for both the guard and the sponsor. Their loyalty is tested many ways before and after they are hired.",
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
        name: "Compulsive Detail Focus",
        category: "Twisted Guards",
        desc: "Only a certain type is hired; a type that checks every lock and every dark corner. Schedules are strict, thoroughness is a guarantee, and they seem unable to cut corners or skip steps. Everything is by the book.",
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
        name: "Convict Public Service",
        category: "Twisted Guards",
        desc: "Due to prison overcrowding, some criminals are sentenced to indentured service to a noble to work off their debt to society. This site's guardian uses criminals as guards, under the stern eye of professionals.",
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
        name: "Demonic Mutations",
        category: "Twisted Guards",
        desc: "About a quarter of the guards have been mutated by contact with demonic essence. They are strong, and their senses are sharp.",
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
        name: "Enchanted Prosthetics",
        category: "Twisted Guards",
        desc: "Guards are all amputees with at least one prosthetic. Each prosthetic tunes to its owner. The prosthetics can stun on contact.",
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
        name: "Feral Pen",
        category: "Twisted Guards",
        desc: "Some areas of the defended site have free-range maniacs. Destitute and wretched beggars are treated as guard dogs, expected to attack intruders and draw attention to anything unusual.",
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
        name: "Fighting School",
        category: "Twisted Guards",
        desc: "An onsite training school focuses on the lifestyle and skill of a school of fighting. Site defenders are part of a group identity with specialty training.",
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
        name: "Performance Enhancers",
        category: "Twisted Guards",
        desc: "Guards have ready access to drugs. Some of the drugs enhance performance.",
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
        name: "Zealots",
        category: "Twisted Guards",
        desc: "Guards share a religion that binds them together and makes them resistant to intimidation or corruption.",
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
        name: "Ghostport Lock",
        category: "Weird Tech",
        desc: "Keys are tuned to locks that cannot be picked by normal means, or bypassed without whisper expertise. Their access point is in the Ghost Field until the key is present.",
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
        name: "Lightning Walls",
        category: "Weird Tech",
        desc: "Runic energy twisting technology can make pylons that project a curtain of energy between them. The glowing walls are transparent, but crippling to touch and lethal to pass through. They stop projectiles.",
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
        name: "Panopticon",
        category: "Weird Tech",
        desc: "Special crystal lenses transmit their sight through the Ghost Field to mirrors in a central location. From one place, a guardian can monitor views all over the defended site.",
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
        name: "Shadow Lanterns",
        category: "Weird Tech",
        desc: "Guards are equipped with lanterns that detect shadows of recent life force as well as shedding light.",
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
        name: "Shadow Rooms",
        category: "Weird Tech",
        desc: "The Ghost Field sometimes remembers rooms or entire neighborhoods that no longer exist in the material world. Some defended sites hide treasures in these spaces that can only be accessed if you knowhow.",
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
        name: "Arturo Montastic",
        type: "npc",
        concept: "Addicted Gambler",
        arena: "New Money",
        description: "He is impossibly lucky. He wins enough at games of chance to pay for his addictions, and to treat the consequences (transfusions, transplants, cutting-edge treatments.) His relationships are intense but brief. He often loses everything, but then wins it all back and more. He has owned epic treasures many times.",
        notes: "Risk-averse collectors cannot bear his cavalier attitude on winning and losing priceless art. He does not truly appreciate his treasures, and should not be trusted with them. Losers can take their losses hard."
      },
      {
        name: "Baron Kelyr Strathmill",
        type: "npc",
        concept: "Hardened Industrialist",
        arena: "Old Money",
        description: "His family has controlled the docks for many generations. They quietly destroy competition, and get lucrative city contracts to re-develop blighted areas if the money slows down. Graceful, educated, and pleasant, he is ruthless as barbed steel under a cultured veneer. He is proud of his estate's gardens.",
        notes: "Competition doesn't like being crippled. He often hires outsiders for the dirtiest work, and his victims often hire outsiders to get revenge."
      },
      {
        name: "Baroness Thena Hellyers",
        type: "npc",
        concept: "Hazy Art Patron",
        arena: "Old Money",
        description: "Thena is one of the least emotionally scarred survivors in her weird family. She is a leading light in the art world. She is patron to many artists and her criticism and evaluation drives a significant element of Duskwall's art scene. Whispers have noted she has an unusual connection to the Ghost Field.",
        notes: "Sometimes she hires outsiders to sort out one of her artists' problems. She has a private gallery that she updates with her current trending tastes—those in the art market need to know what's in it."
      },
      {
        name: "Calvin Dannos",
        type: "npc",
        concept: "Eerie Assassin",
        arena: "Underworld",
        description: "The Inkvein was a cabal of seven anonymous assassins, named for their maps of the canals. If one of them was identified as a member, the other six were sworn to kill the outed assassin. Dannos was outed a decade ago, and he killed the other members and their undying founder. Now he IS Inkvein.",
        notes: "Easily bored, he prefers interesting challenges to high paying or easy kills. Of course, many bereaved or power hungry individuals want him dead."
      },
      {
        name: "Commissioner Naria Haig",
        type: "npc",
        concept: "Political Matchmaker",
        arena: "City Law",
        description: "She exudes a plump grandmotherly innocence, but she is one of the sharpest politicians in Duskwall. She supervises over the merging of unexpected allies and the schism of monolithic interests. She cares about one thing—the good of Duskwall as a whole. She is Chair of the Ethics Oversight Committee.",
        notes: "Always playing a bigger game, she uses outsiders to manage errands whose purpose they cannot see. Those she outmaneuvers tend to want to get back at her with violence."
      },
      {
        name: "Doc Sarnin",
        type: "npc",
        concept: "Lecherous Leech",
        arena: "Underworld",
        description: `Doc can keep life in you if you're alive (or recently dead) when you get to him. His extreme methods are often horrifying. Still, his concoctions can crush ghosts, re-attach limbs, and more. The Crows, a tough crew, protect him. They give him victims for his "needs," which are emotional, physical, and scientific.`,
        notes: "Sometimes the Crows hire outsiders to go after rare components or victims for Doc. He has many, many enemies who want to either steal him and force him to serve them, or punish him."
      },
      {
        name: "Doctor Ixit Crichelle",
        type: "npc",
        concept: "Elegant Spook",
        arena: "Old Money",
        description: "Crechelle calls himself an Oneiric Master. He interprets dreams for a fee. He enters them, alters them, and moves through veils to understand truths and secrets the dreamer may not grasp. If he touches a target, or one of their possessions, he may enter their dreams. He appears feeble, but his mind is deadly.",
        notes: "Aristocratic patrons invite him to parties. He needs a person's possession to see into their dreams; he pays for objects to visit some people's dreams. Victims will pay to free themselves ."
      },
      {
        name: "Dr. Hansel Kryvanntic",
        type: "npc",
        concept: "Brilliant Scientist",
        arena: "Foreign",
        description: "He is Severosi, bow-legged and wild-haired. His work on electroplasmic poisoning and mutation in animals and humans is ground-breaking. Fleeing persecution because of his ethically questionable methods back in Severos, he found a more open-minded scientific community in Duskwall.",
        notes: "His research has applications in art, medicine, and war. Those with sufficient resources to further his studies want to control him. He has hurt a lot of people, over time, so he has many enemies."
      },
      {
        name: "Dr. Yerial Crabbskidditch",
        type: "npc",
        concept: "Sleazy Lawyer",
        arena: "New Money",
        description: "He firmly believes those who are wealthy should not be pestered with the law. No matter what you do, if you have means you can arrange for an alternate story that favors you. Deaths, frauds, robberies, and other crimes can be reduced to a few fines. He throws money at problems until they disappear.",
        notes: "He routinely hires outsiders to destroy evidence, intimidate witnesses, compel confessions, and so forth. He has countless enemies, both those seeking justice and former clients who ran out of money."
      },
      {
        name: "Duvrel the Snake",
        type: "npc",
        concept: "Cunning Smuggler",
        arena: "Foreign",
        description: "She is Tycherosian, with the eyes and horns of a goat. Snake tattoos coil around her arms. Exotic drugs from the Dagger Isles flow through her distribution network in Duskwall. She hires outsiders to remove stubborn people while she has an alibi, or to retrieve drugs misplaced at incriminating locations.",
        notes: "Inspectors have orders from the Spirit Wardens to take her alive, to study her uncanny ability to flex with the Ghost Field for supernatural stealth."
      },
      {
        name: "Dylayzia Finchester",
        type: "npc",
        concept: "Fashionable Whisper",
        arena: "New Money",
        description: "Her exotic looks, tattoos, and bright green eyes draw attention. She popularized thigh-high buckled leather boots and spirit bane chokers. Her opinions echo in drawing rooms across the city. People enjoy her feud with the Church of the Ecstasy of the Flesh.",
        notes: "Wealthy figures in the fashion world pay top win for sneak peeks at her clothing designs. Her opinions inflame many enemies­-especially the Church. She hires outsiders to get rare components for her rituals."
      },
      {
        name: "Emeline Coleburn",
        type: "npc",
        concept: "Weary Regulator",
        arena: "City Law",
        description: "She inspects buildings and reports to the Duskwall Council whether they are sound, and whether they serve the purpose listed on the owner's taxation form. She is front-line in the tug-of-war between criminals, politicians, and nobles. She no longer cares about the greater good. Now it's about kickbacks.",
        notes: "She takes the path of least resistance in her evaluations, so people pay to make their preference easier and other roads harder. She hires outsiders for off-the-books communication with pushy customers."
      },
      {
        name: "Eric the White",
        type: "npc",
        concept: "Vigilante Rebel",
        arena: "Foreign",
        description: "The War of Skovlan Unity is over, but this slender maniac with a brushy beard can't let it go. He plans to destroy the government and turn Duskwall into a Skovlan colony to punish them for the destructive war. He wants to discredit and disrupt the government at every turn.",
        notes: "He targets gavernment officials as high up as he can reach, hoping to cause enough trouble to make the government vulnerable to change. He has gathered zealots, and he uses outsiders for disposable work."
      },
      {
        name: "Gi Aniru Ga of Sultha",
        type: "npc",
        concept: "Sacrificing Cultist",
        arena: "Supernatural",
        description: "She worships the Gaping Maw, the Runnel of Life, the Cosmic Thirst. She builds a cult, teaching them to hunt and conduct rituals. Then she moves on. Witnesses uneasily describe her supernatural abilities, including shapeshifting, flight, killing people by attacking their shadows, and so on.",
        notes: "Bereaved relatives, rival cultists, and law enforcers all want her stopped. She hires outsiders to threaten, misdirect, or kill law enforcement. Determined inspectors crush cults she trained, need help to catch her."
      },
      {
        name: "Holtz Clermont",
        type: "npc",
        concept: "Reformed Clerk",
        arena: "City Law",
        description: "He used to be a forger. After he served stint in prison, some respectable family friends got him a position as City Clerk for the whole district. He manages correspondence for permit requests and official notices. When corrupt people inside and outside the system need to adjust evidence, they come to him.",
        notes: "Jilted clients can be threatening, leading him to take steps to adjust their attitude by hiring outside help. He's smarter than he looks, and knows how to back people off. He also might know too much."
      },
      {
        name: "Inspector Lorette Salkha",
        type: "npc",
        concept: "Crusading Inspector",
        arena: "City Law",
        description: 'She needs allies in her hopeless quest to clean up the city. Corruption is everywhere, crime runs rampant, and the bluecoats serve the powerful (on both sides of the law.) Some tragedy in her past propels her into a suicidal effort to restore "rule of law.” Her peers muse it is a shame she will die young.',
        notes: "She could be helpful if she focuses on the right bad guys—your enemies. She can't be bought, so maybe someone needs her killed (or otherwise neutralized.)"
      },
      {
        name: "Jemma Dropkick",
        type: "npc",
        concept: "Feminist Vigilante",
        arena: "Underworld",
        description: "She is a legend in the Seven Shallows neighborhood. She attacks men who abuse women. She survives because she has friends—a few bluecoats, a gang of thugs, and a grateful public. She carefully plans attacks to hurt abusers. Lf her victims abuse again, they are mutilated, packed like luggage, and shipped out of town.",
        notes: "Many powerful men would pay for revenge on Jemma. Sometimes she hires outsiders to help out."
      },
      {
        name: "Kheldaria Whinnich",
        type: "npc",
        concept: "Implacable Developer",
        arena: "New Money",
        description: "She has a vision for developing the Crow's Foot district. It will be divided between businesses, estates, and parks. To realize her vision, she has been selectively buying real estate all around the city, bartering for land in Crow's Foot, and using whatever persuasion is needed to convince owners to sell to her.",
        notes: "She has an estate where she stores induce­ments of all sorts, a variety of treasure designed to persuade owners to sell in exchange for what they want most. They say you could find almost anything there."
      },
      {
        name: "Lady Ashlyn Tyrconnel",
        type: "npc",
        concept: "Decadent Duelist",
        description: "For centuries, aristocrats of Duskwall have learned the Tyrconnel Method of swordplay and self defense. The Tyrconnel family produces countless public servants and warriors—but also a share of scoundrels. Ashlyn's trademark suite of moves is to duel, win, bed someone, and drink to unconsciousness.",
        notes: "You're hired to join the spy game in the Tyrconnel family. Or, someone is targeting her. Either way. Watch your back. Outsiders in the games of nobles are uniformly expendable."
      },
      {
        name: "Lady Candra Dunvil",
        type: "npc",
        concept: "Corrupt Fixer",
        arena: "Old Money",
        description: "Her family built Ironhook Prison. Her wealth is built on generations of shady deals with incarcerated aristocrats and business owners. She sees the world as a rigged game and has contempt for anyone who finds corruption shocking or fixable. She is vain, practical, and ruthless.",
        notes: "She hires outsiders to carry out promises she made to inmates. Her family has casually wrecked reputations and lives over centuries, and that leaves a trail of vengeance seekers."
      },
      {
        name: "Lady Polonia Brogan",
        type: "npc",
        concept: "Desirable Dowry",
        arena: "Old Money",
        description: "She's ugly, smelly, stupid, and rude--and also the key to the Brogan fortune. Her lucky spouse will have access to massive wealth and infrastructure among professional builders and shipwrights of Duskwall. Only her aunt, CECILIA DURWITHE, looks out for her best interests with sharp disapproval.",
        notes: "Brogan hires outsiders to punish those who slight her, or to investigate potential partners. She collects fake wills rogues have planted during assassination attempts, trying to leave her fortune to usurpers ."
      },
      {
        name: "Lord Branon Kinclaith",
        type: "npc",
        concept: "Romantic Horseman",
        arena: "Old Money",
        description: "Branon looks like a hero from a legendary story. He manages the family's stables, the finest horses in Duskwall (where horses are a rare luxury.) His tumultuous trysts with both men and women are common knowledge. Business suffers from his impulsive romantic gestures, but benefits from his charm.",
        notes: "Branon sometimes refuses to sell horses, or breed them, if he dislikes the buyer. Some buyers want access to horseflesh anyway. If his horses are attacked, he hires outsiders to get revenge."
      },
      {
        name: "Lord Bulward Skinnester",
        type: "npc",
        concept: "Greedy Banker",
        arena: "New Money",
        description: "This portly curmudgeon does a brisk trade in real estate titles, both lending and foreclosing. He is acutely aware of the value of properties and how neighbors affect value. He takes particular glee in foreclosing on aristocracy and setting up the newly rich in ancient estates.",
        notes: "Sometimes he hires outsiders to solve problems that his hired bluecoats and bribed councilmen cannot manage. He collects sculpture by Duskwall artists. He has ruined the lives of many formerly influential people."
      },
      {
        name: "Lord Orlan Booker",
        type: "npc",
        concept: "Insulated Mastermind",
        arena: "Old Money",
        description: "Ennui is a danger to the wealthy. Booker fills his days by gathering intelligence and planning heists, then selling the plans to ambitious gangs that lack his patience, experience, resources, and insight. Twice a month he goes to the opera, and meets those who have arranged to purchase a score.",
        notes: "Sometimes things go wrong, and it is natural to blame the planner and want revenge. Sometimes a target wants to punish those who acted against them, even if the act was planning."
      },
      {
        name: "Master Slen Dallicore",
        type: "npc",
        concept: "Protective Guilder",
        arena: "New Money",
        description: "Master Dallicore is the Guildmaster for the Docker's Guild. They move all cargo on and off ships, boats, and gondolas. Their role is protected by law, as are the fees they charge. The guild uses low-level violence to discourage non-guild laborers and smugglers. However, some challenges require proper scoundrels.",
        notes: "Dallicore is not above hiring outsiders to punish powerful patrons of smugglers or illegal dock workers. His position of power also gives him access to rare antiquities, both purchased and acquired."
      },
      {
        name: "Minister Fourteen",
        type: "npc",
        concept: "Grungy Fixer",
        arena: "Underworld",
        description: "The blind Skovlander holds court on the docks, moving from one basement to another. He favors baggy shirts, stained vests, shiny jewelry, and fraying lace. He often acts through his massive bodyguard Severen and his weedy messenger Torok.",
        notes: "He is connected in the Skovlander refugee community, and in Skovlan. For a price (either wealth or an errand) he will share information about Skovlanders. He often hires outsiders to handle sensitive tasks."
      },
      {
        name: "Moonslider the Third",
        type: "npc",
        concept: "Eccentric Artist",
        arena: "New Money",
        description: "She feels moon phases. Her family put her in an asylum for a decade. Later, she won her freedom and inherited the family bootmaking fortune. She makes art. She tries to communicate her moon feelings. She uses oil paint, glass blowing, sculpture, song, and dance in multimedia recitals and art pieces.",
        notes: "Her family bought nice things before they all died and she inherited them; she ignores most of it. She needs expensive equipment and supplies for her bizarre art shows."
      },
      {
        name: "Officer Milos Penderyn",
        type: "npc",
        concept: "Corrupt Bailiff",
        arena: "City Law",
        description: "Milos has access to trial evidence, and to prisoners awaiting trial. He can't get people out, but he can silence them. He has a network of corrupt peers, judges, bluecoats, and others so he can trade favors to accomplish the impossible. Huge and greasy, he is built like a bull and he enjoys the scent of fear.",
        notes: "Controlling Milos could mean protecting or killing someone in bluecoat custody. An endless stream of people want revenge on him, and a more select group would like to control or use him."
      },
      {
        name: "Officer Veleris Walund",
        type: "npc",
        concept: "Heroic Bluecoat",
        description: "There are actually songs about him. He is very popular. Veleris is a skilled orator (though he retreats into modesty) and a canny judge of character and situations. (He insists he just tries to do the right thing.) His opinion is influential in his district. He is trusted to guard valuables. His moustaches are his pride and joy.",
        notes: "He has no family, and he seems to be an idealist. Some try to persuade him, others try to threaten him. Threats don't seem to work. He has been known to quietly hire outsiders to get justice."
      },
      {
        name: "Pebbler",
        type: "npc",
        concept: "Demon Spy",
        arena: "Supernatural",
        description: "This earth demon looks like a fat man built around a boulder gut, leaking sand from joints. It is able to see and hear through sand, earth, and stone within a range of miles. It works with non-cultists voluntarily, selling information in exchange for raids into the rare areas protected from its prying.",
        notes: "Dozens of powerful people want Pebbler banished or robbed. However, the demon is a peerless information exchange, valuable even if it is difficult to control."
      },
      {
        name: "Saithernon",
        type: "npc",
        concept: "Exotic Fence",
        arena: "Underworld",
        description: "He drapes his python, DELGRAAZ, around his neck. He wears a turban with a jewel on it. He is willing to buy almost anything, no matter how strange. He also knows what you need, sometimes before you know you need it. His bazaar unfurls below the Kennington market in an abandoned gondola dock.",
        notes: "He pays people to get things for him, then sells them at tremendously inflated prices to those desperate to have them. This can cause hurt feelings among the desperate."
      },
      {
        name: "Serlevica the Brander",
        type: "npc",
        concept: "Spy Whisper",
        arena: "Underworld",
        description: "Gaunt and frizzed, this foul-smelling Whisper has a secret ritual that allows her to control and see through rats she brands. She sells her services as a spy or site guardian. She has survived by retreating into slums and sewers when threatened, and striking from the shadows until it is safe to emerge again.",
        notes: "She is closely tied to the information marketplace, buying and selling secrets. She often hires outsiders to deal with her enemies through theft or violence, and she is in turn a frequent target."
      },
      {
        name: "Sir Mournseller",
        type: "npc",
        concept: "Anarchist Ghost",
        arena: "Supernatural",
        description: "This ghost possesses old men from the Draymach Asylum, breaking them out to find and hire scoundrels for obscure tasks with no independent purpose. Examples include killing an insignificant chandler or stealing a specific stone from a wall in a noble's estate. Payment is the location of hidden treasure.",
        notes: "A decade ago, an astute inspector began picking out the connection between errands, seeing a very long and very dangerous game to unseat the city's rulers emerging."
      },
      {
        name: "Sir Olen Llanwold",
        type: "npc",
        concept: "Piratical Industrialist",
        arena: "New Money",
        description: "He is thin and nervous, easy to underestimate. He specializes in stripping foes of their assets and taking over their operations. His father was a butler, and he grew up hating aristocrats. He understands power structures and corrupts retainers. His top agent, Ellsfielder, is a beautiful and ruthless woman.",
        notes: "Many ruined aristocrats (and their allies) hate Danwold passionately. He does not hesitate to use his assets, legal and otherwise, to defend himself and cripple his foes. He hires outsiders through proxies."
      },
      {
        name: "Sir Tocker Farros",
        type: "npc",
        concept: "Pragmatic Councilman",
        arena: "City Law",
        description: "Sometimes the law works, and sometimes it doesn't. Regardless, the Council must rule and there must be order. Sir Farros ensures the districts he serves do not get too far out of hand before lawless elements are curbed. One way or another. He looks like an affable grandfather, but he has a dark past.",
        notes: "Sir Farros uses inspectors or scoundrels, politicians or housemaids—anyone who will get the job done. He has an endless list of enemies who feel he wronged them, and want revenge. His agents are disposable."
      },
      {
        name: "SLOPSPATTER",
        type: "npc",
        concept: "Canal Hull",
        arena: "Supernatural",
        description: "This hull learned to consume spirits and bolster its strength with theirs. It cannibalizes machinery and rummages in wrecked boats for parts. It has gondola prow shoulder guards and helm, and strange banded armor made of water-logged wood over intricate mechanical parts. It fears destruction.",
        notes: "It assassinates targets, with its body or by possessing machines near them. It hunts whispers, leeches, and scholars, stealing their knowledge and killing them. Their allies want revenge."
      },
      {
        name: "Syla DuTorrivestria",
        type: "npc",
        concept: "Famous Connoisseur",
        arena: "Foreign",
        description: "This mysterious Iruvian hides behind a veil. For years, she has been the final word on Duskwall delicacies. She specializes in evaluating high-end cuisine (including spore wines and cooking with leviathan blood.) She stays in the public eye with racy politics and a string of scandalous romances.",
        notes: 'She must keep any real competitors for her fame weakened and embarrassed, and she has countless enemies. Everyone "knows" she is an Iruvian spy.'
      },
      {
        name: "The Honorable Telia Cray",
        type: "npc",
        concept: "Stern Prosecutor",
        arena: "City Law",
        description: "She's old, she's sour, and she has a reputation for jailing Duskwall's criminals. As thin and hard as an iron poker, she relentlessly pursues her cases, bending the law with a passionate hatred of scoundrels. She runs a special unit of Inspectors dedicated to investigating her cases, run by INSPECTOR ULEK.",
        notes: "If she is taking a case personally ( as she often does) she may hire outsiders to acquire or create evidence. She also conduds a brutal war of counter-intelligence against rogues looking to free their associates."
      },
      {
        name: "The Wooden Judge",
        type: "npc",
        concept: "Haunted Puppet",
        arena: "Underworld",
        description: "This knee-high ventriloquist dummy looks like a caricature of a grim Judge. It is supernaturally animated. The puppet appears unexpectedly, interrupting a scoundrel's routine by offering jobs in a squeaky voice. He pays by revealing the location of hidden caches of ancient coin.",
        notes: "Many angry victims want to know who pulls the strings of the Wooden Judge. The puppet often hires fresh talent for dubious work."
      },
      {
        name: "Theodore Lysander",
        type: "npc",
        concept: "Bard Pimp",
        arena: "Underworld",
        description: "Elegant and charismatic, this well-dressed man runs the Tenpenny Court Network. He manages prostitutes and their customers, his personal connections and charm monetized. He is also a skilled composer and performer, often seen at the Worldsedge Theater in Crow's Foot.",
        notes: "He is a skilled networker. He takes the safety of his friends seriously, and is protedive of his employees, to the point of using blackmail to force powerful patrons to back off."
      },
      {
        name: "Chief Prichard",
        type: "npc",
        description: "The head Overseer of the Ministry of Provisions in Duskwall. Manages the workers and food allotments for the city districts.",
        district: "Barrowcleft",
        traits: [
          "calculating",
          "confident",
          "calm"
        ]
      },
      {
        name: "Lord Strangford",
        type: "npc",
        description: "Operates one of the largest leviathan hunter fleets, serves on the City Council and is a high-ranking member of the secret order within the Church of Ecstasy.",
        district: "Brightstone",
        traits: [
          "secretive",
          "calculating",
          "arrogant"
        ]
      },
      {
        name: "Hutton",
        type: "npc",
        description: "A Skovlander refugee and former soldier, now the leader of an anarchist revolutionary movement, bent on forcing the government to acknowledge Skovlander rights in the Empire.",
        district: "Charhollow",
        traits: [
          "brave",
          "compassionate",
          "wise"
        ]
      },
      {
        name: "Lady Drake",
        type: "npc",
        description: `A magistrate who is "reasonable" when it comes to street crime, so long as the offender's purse is sufficient.`,
        district: "Charterhall",
        traits: [
          "flexible",
          "shrewd",
          "subtle"
        ]
      },
      {
        name: "Master Slane",
        type: "npc",
        description: "A notorious factory foreman known for excessive and cruel punishments for the smallest infractions. Many attempts have been made on his life, but all have failed. Some say he's a devil.",
        district: "Coalridge",
        traits: [
          "cold",
          "cruel",
          "sadistic"
        ]
      },
      {
        name: "Sergeant Lochlan",
        type: "npc",
        description: "The senior Bluecoat squad leader in the district, reporting to Captain Dunvil. Lochlan is flexible and reasonable, taking bribes and payoffs when she can; enforcing the law and making examples when necessary.",
        district: "Crow's Foot",
        traits: [
          "shrewd",
          "tough",
          "commanding"
        ]
      },
      {
        name: "Chief Helker",
        type: "npc",
        description: "One of the most influential senior Dockers. Helker has a lot of sway at the docks, and if you cross him, you might find your cargo tossed into the drink—and possibly you along with it.",
        district: "The Docks",
        traits: [
          "cautious",
          "greedy",
          "vengeful"
        ]
      },
      {
        name: "Master Krocket",
        type: "npc",
        description: "An unsavory, greasy-haired, scarecrow of a man who runs the snarling pack of vicious dogs used by Ironhook to track down escapees and sniff out contraband and tunnels. His dog-handlers can be found around the labor camp and all about Dunslough, using their status with the prison for favors and bribes.",
        district: "Dunslough",
        traits: [
          "cruel",
          "greedy",
          "ruthless"
        ]
      },
      {
        name: "Jira",
        type: "npc",
        description: 'A dealer of fine weapons from the Dagger Isles. Greatly respected by many street toughs in The Dusk—a "jira blade" is a status symbol that many aspire to.',
        district: "Nightmarket",
        traits: [
          "bold",
          "tough",
          "confident"
        ]
      },
      {
        name: "Levyra",
        type: "npc",
        description: 'A medium who invites clients to bring ghosts in bottles to posses her so they can share a few final words before the ghost is "freed" (Levyra hands it off to the waiting Spirit Wardens nearby).',
        district: "Silkshore",
        traits: [
          "weird",
          "daring",
          "dishonest",
          ""
        ]
      },
      {
        name: "Mother Narya",
        type: "npc",
        description: "Runs the Arms of the Weeping Lady charity house.",
        district: "Six Towers",
        traits: [
          "kind",
          "patient",
          "gracious"
        ]
      },
      {
        name: "Maestro Helleren",
        type: "npc",
        description: "Senior composer and conductor of the Spiregarden Theater, premiere performance venue for the elite of the city.",
        district: "Whitecrown",
        traits: [
          "sincere",
          "dramatic",
          "vain"
        ]
      },
      {
        name: "Hester Vale",
        type: "npc",
        description: 'Matriarch of the oldest farm family. The living embodiment of "tough but fair."',
        district: "Barrowcleft",
        traits: [
          "proud",
          "fierce",
          "suspicious"
        ]
      },
      {
        name: "Commander Bowmore",
        type: "npc",
        description: "Chief Officer of the Watch in Brightstone. Bowmore's family financed Bowmore Bridge centuries ago and now holds many positions of power.",
        district: "Brightstone",
        traits: [
          "proud",
          "principled",
          "connected"
        ]
      },
      {
        name: "Briggs",
        type: "npc",
        description: "The owner of a merchant stall at Charhollow market, cover for a network of gossips, spies, and code-smiths among the working class people of the district, selling their services to those who need them.",
        district: "Charhollow",
        traits: [
          "secretive",
          "sneaky",
          "cautious"
        ]
      },
      {
        name: "Lord Penderyn",
        type: "npc",
        description: "Chief Scholar of the Archive of Echoes, authorized by the Emperor to keep a collection of ancient ghosts trapped in spirit bottles, to be consulted in cases where knowledge from the distant past would benefit the operation of the Imperial government. Lord Penderyn also consults the spirits on his own volition, forming the rebellious Path of Echoes society for other elites and nobles who seek communion with the spectral realm.",
        district: "Charterhall",
        traits: [
          "reckless",
          "strange",
          "obsessive"
        ]
      },
      {
        name: "Belle Brogan",
        type: "npc",
        description: "A Skovlander factory worker who's been gaining popularity as a potential union organizer. It's only a matter of time before a factory boss tries make an example of her.",
        district: "Coalridge",
        traits: [
          "charming",
          "confident",
          "bold"
        ]
      },
      {
        name: "Lewit, Jol, Myra, Reyf",
        type: "npc",
        description: "Bluecoat constables; run an extortion racket.",
        district: "Crow's Foot",
        traits: [
          "arrogant",
          "vain",
          "volatile"
        ]
      },
      {
        name: "Tris",
        type: "npc",
        description: "A legendary tattooist who only inks those that have looked upon a leviathan and lived to tell the tale. Getting a tattoo from Tris is a rite of passage for everyone who hunts the demons of the void sea.",
        district: "The Docks",
        traits: [
          "artistic",
          "popular",
          "insightful"
        ]
      },
      {
        name: "Vandra",
        type: "npc",
        description: "A deathlands scavenger that survived six runs and was pardoned. She knows the landscape beyond the barrier very well—but few can make sense of her haunted mumblings.",
        district: "Dunslough",
        traits: [
          "haunted",
          "wise",
          "daring"
        ]
      },
      {
        name: "Leclure",
        type: "npc",
        description: "A purveyor of personal luxuries (soaps, hair oils, perfume, fine silks) who dabbles in fortune telling. Some say her that drowned lover is a ghost that whispers secrets in her ear.",
        district: "Nightmarket",
        traits: [
          "shrewd",
          "tough",
          "commanding"
        ]
      },
      {
        name: "Helene",
        type: "npc",
        description: "The elegant and mysterious proprietor of the Silver Stag Casino. People say she would have been a queen of Severos had she lived in the old days before the Empire.",
        district: "Silkshore",
        traits: [
          "cultured",
          "charming",
          "secretive"
        ]
      },
      {
        name: "Chef Roselle",
        type: "npc",
        description: "One of the best cooks in the city, still operating the legendary Golden Plum restaurant—worth the trip into the haunted streets of Six Towers.",
        district: "Six Towers",
        traits: [
          "creative",
          "insightful",
          "friendly"
        ]
      },
      {
        name: "Lady Freyla",
        type: "npc",
        description: "Regarded by some as the finest sommelier in the Empire. She serves only the most deserving at the Emperor's Cask.",
        district: "Whitecrown",
        traits: [
          "erudite",
          "cultured",
          "charming"
        ]
      },
      {
        name: "Mara Keel",
        type: "npc",
        description: "A former smuggler who's gone into hiding among the farm laborers of Barrowcleft.",
        district: "Barrowcleft",
        traits: [
          "quiet",
          "secretive",
          "patient"
        ]
      },
      {
        name: "Rolan Wott",
        type: "npc",
        description: "An influential magistrate who handles property, endowments, and financial cases. Famous for his extravagant parties.",
        district: "Brightstone",
        traits: [
          "stylish",
          "elitist",
          "shrewd"
        ]
      },
      {
        name: "Corben",
        type: "npc",
        description: "An ex-military Skovlander on the lam for crimes against the empire.",
        district: "Charhollow",
        traits: [
          "tough",
          "reckless",
          "candid"
        ]
      },
      {
        name: "Hopper",
        type: "npc",
        description: 'A drug addict, whisper, and all-around weirdo who perches on rooftops in the district. Hopper claims to see "ghost rails" and "spirit trains" originating deep beneath Coalridge, stretching beyond the horizon.',
        district: "Coalridge",
        traits: [
          "weird",
          "visionary",
          "enthusiastic"
        ]
      },
      {
        name: "Mardin Gull",
        type: "npc",
        description: "Owner and operator of the Leaky Bucket public house. Mardin was the leader of the Crows many years ago, before Roric and Lyssa, and now enjoys a comfortable retirement out of the scoundrel life.",
        district: "Crow's Foot",
        traits: [
          "charming",
          "experienced",
          "respected"
        ]
      },
      {
        name: "Mordis",
        type: "npc",
        description: "A strange merchant which hides its true appearance beneath many layers of robes and hoods. Also fences occult and arcane stolen goods, no questions asked.",
        district: "Nightmarket",
        traits: [
          "secretive",
          "insightful",
          "arcane"
        ]
      },
      {
        name: "Madame Tesslyn",
        type: "npc",
        description: "Operates the Red Lamp brothel, the oldest and most respected institution of its sort in the city.",
        district: "Silkshore",
        traits: [
          "confident",
          "insightful",
          "enthusiastic"
        ]
      },
      {
        name: "Flint",
        type: "npc",
        description: "A spirit trafficker who trades out of a condemned manor house.",
        district: "Six Towers",
        traits: [
          "weird",
          "calculating",
          "suspicious"
        ]
      }
    ],
    Scores: [
      {
        name: "Accidental Death",
        category: "Secret Dirty Work",
        desc: "Not only must the target die, the target must not know how death came. If by some misfortune the ghost of the victim is interrogated, it must not have any special knowledge. There is a ritual and an amulet for the assassins to ensure secrecy. No one living or dead can know who did this deed.",
        narrative: "By the time the crew knows the job, there is a better than even chance their knowledge is too much risk and their employer plans to kill them. They might want some leverage."
      },
      {
        name: "Bayer's Train Heist",
        category: "Misplaced Fortune",
        desc: "Bayer was a rail jack fired for being drunk. Over years, he built a crew with one mission in mind--robbing a train. When lruvia completed negotiations with Akoros to buy an unprecedented mass of leviathan blood to pour into industrialization, Bayer's crew hit the train carrying the payment, sabotaging a bridge. Rescuers found the train in the canyon, but no gold--an impossible feat. Bayer's crew vanished.",
        narrative: 'An Iruvian ingot stamped with the year "802" will attract attention.'
      },
      {
        name: "Bellweather Architectural Plans",
        category: "Historical Curiosity",
        desc: "The Duskwall Archives have the sanitized blueprints of the Bellweather Crematorium on file. The original plans were drawn by a Spirit Warden driven mad by an internal rift, so he haunted himself. He drew peculiar plans with occult underpinnings, and those original drawings were interpreted by architects.",
        narrative: "Are there coded secrets in the original plans that reveal a repellant secret or ominous threat? Or are the plans the scribbling of a madman? Either way, some people would pay top coin to get a good look."
      },
      {
        name: "Book of Walls",
        category: "Historical Curiosity",
        desc: "Long ago, a nameless rogue cultivated a mass of bloodworms in a wall. He wrote a book with their blood. The words were nonsense, but strangely affecting; if the reader tuned in to them, and held the book, the reader could walk through a wall. Spirit Wardens ruined the book with holy smoke.",
        narrative: "A legend, or is there truth to it? Walking through walls is a neat trick, and the book may hold the key to learning it. It is sought by a wide variety of the curious—scholars, collectors, and scoundrels."
      },
      {
        name: "Censer Mace of Udoch",
        category: "Religious Object",
        desc: "The head of this ornately carved mace opens on hinges so incense can be put inside to wisp as the mace swings. The haft has a recipe carved into it, instructions to make special incense out of bone and rare sap and unguents. If that incense bums in the mace, it can destroy ghosts or demons with a single hit.",
        narrative: "This was a founding artifact of the Church of the Ecstasy of the Flesh. If it were returned, they would gain a fresh following from critics who feel the church cannot protect against supernatural threats."
      },
      {
        name: "Charter of Crows",
        category: "Historical Curiosity",
        desc: "This gauntlet is made out of crow beaks. Each beak is carved with arcane symbols. Consulting Whispers officially report it does not have any power in the Ghost Field. It was made by the Spirit Warden who first tamed the deathseeker crows; he claimed it was a treaty that guaranteed their service.",
        narrative: "Spirit Wardens lost this gauntlet decades ago, but they want it back. The idea it is a treaty with the deathseeker crows is probably nonsense. They can't take that chance."
      },
      {
        name: "Combination Harpsichord",
        category: "Weird Scholarship",
        desc: 'TARNALI was a Whisper composer who built a special harpsichord. When two tones are played, often a third "ghost" tone can be heard. By attaching the tuning pegs to crystals and runes, Tarnali built a harpsichord that could interact with the Ghost Field through calculated progressions of played tones.',
        narrative: "This effort is intensely interesting to those who want to find doors hidden in the Ghost Field, draw or repel what lurks Behind the Mirror, or develop more portable tonal energies for non-Whispers ."
      },
      {
        name: "Dyvik's Chaser Mask",
        category: "Weird Artifact",
        desc: "This silvery face mask has the word “Elekthiaron” etched along its inner edge. When the word is spoken, the personality of the one touching the mask is pulled into it. The personality that was in the mask goes in the body. If the one in the body doesn't touch the mask once a week, madness threatens.",
        narrative: "Has someone been using the mask to pose as someone else? How long has that been going on? Is there someone in the mask that needs rescuing? Was the mask used to cheat biological death?"
      },
      {
        name: "Evardian's Song Folios",
        category: "Weird Scholarship",
        desc: 'Four leather-bound volumes, full of musical notation with heavily annotated margins. The "music" is supposed to be transcribed and translated leviathan song. Legend suggests if the music is played correctly, it can drive humans insane with visions of the demon-haunted deep.',
        narrative: "Aristocrats will collect anything. Scholars go to great lengths for research material. Cultists may find religious significance in the folios. (Owning the folios is against the law.)"
      },
      {
        name: "Falheim's Prod",
        category: "Historical Curiosity",
        desc: "This ragged pole with a spear and a silver-cable loop was the first prototype of what became the lightning hook. It doesn't work very well, but it was the first historically known charged object that could consistently interact with the Ghost Field.",
        narrative: "Apparently this bit of history is an important prestige piece in the turbulent intrigues of a number of underground cults led by Whispers. The city government would also like to display it in a museum."
      },
      {
        name: "Fang of Ibiria",
        category: "Religious Object",
        desc: "This brutal stiletto has a green stone in the pommel, and a runic symbol on the blade. The blade transforms electroplasm into a mutagen. The longer the blade is in a victim, the more monstrous the victim becomes. A cut gives nightmares, minutes give mutations, hours or days create a real monster.",
        narrative: "Cultists want this blade so they can make or become monsters."
      },
      {
        name: "Goblet of Eletrachtian",
        category: "Weird Artifact",
        desc: "The silver and gold cup is big enough to hold with two hands, crusted with obsidian stones. The owner puts a drop of a demon's blood in the goblet with certain other liquids, and conducts a ritual. For days afterwards (maybe longer) the owner can see anything the demon uses remote vision to view, just by watching the surface's illusory reflections.",
        narrative: "There are many legends about the creation of the goblet, and the fate of the Whisper who first energized it. Rumor suggests the Duskwall Council entrusted the goblet to a certain family for safekeeping."
      },
      {
        name: "Hollow Shroud",
        category: "Religious Object",
        desc: "The Church of the Ecstasy of the Flesh clergy wrapped the funeral shroud around a heretic, then conducted a ritual that severed the heretic's connection to the body, cutting the spirit loose as a ghost. The shroud transferred the spirit of a faithful but sickly member into the heretic's body. New life!",
        narrative: "The Shroud was stolen almost twenty years ago, and rumors suggest it has been used in debased rituals to summon demons or enflesh echoes of the Forgotten Gods."
      },
      {
        name: "Idol of the Sleeping Lion",
        category: "Religious Object",
        desc: "The hefty iron statue depicts a devilfish-headed humanoid, cloaked in wings. Its presence influences human dreams, so they drift through the ink-black sea but can perceive their surroundings. Sacrificing to the statue gives a cultist a cosmic infection, involving psychic ability and mutations.",
        narrative: "The statue has been retrieved by officers of the law several times, and destroyed several times more. Again and again, it emerges in the heart of fresh tragedy, baleful and singular."
      },
      {
        name: "Ink Fleece",
        category: "Family Heirloom",
        desc: "Long ago, Captain Manarill claimed he could prove that leviathans had fur, or fleece. He brought back a swatch of curling fur as big as a bedspread. He claimed to have harvested it from a leviathan's skin. The mantle served as a symbol of the Manarill family's heritage of exploration and danger. But it was stolen.",
        narrative: "Does it do more than represent heritage? What dreams might one have while wrapped in it? Might a wealthy Whisper pay more for it than the family that owned it? Who took it?"
      },
      {
        name: "Kasavaraya Tea Set",
        category: "Family Heirloom",
        desc: "When the Immortal Emperor visited Akoros four centuries ago, he used this tea set with the patriarch of the Kasavaraya family. They are still one of the most decorated and entrenched military families in Duskwall. Their tea set is a symbol of Duskwall's prominence. However, a saucer and a cup are missing.",
        narrative: "This stuff is priceless, literally, so negotiating a price for its return is tricky. If you could find the missing pieces, or forge them adequately, they would be great hostages to ajfed the family's behavior."
      },
      {
        name: "Kidnap The Heir",
        category: "Secret Dirty Work",
        desc: "People are keys that fit into estate locks. They can be turned to open the way to lots of money. You might be taking a child to ransom back to the guardian, or you might be getting someone out of the way so a more distant heir can inherit. This is about controlling where the money goes.",
        narrative: "How harsh does the employer want this to be? Kid gloves treatment, or is the plan to kill the heir when it is all over? How much input will the employer accept from the hired help? Is the plan already in place?"
      },
      {
        name: "Krogs Broken Heart",
        category: "Misplaced Fortune",
        desc: "Krog was a savage from the Dagger Isles, pressed into service on a hunting ship. He eventually owned a small fleet. He was old when he fell in love with a young woman who robbed him. Heartbroken, he took the rest of his treasure aboard his last hunting ship, Heartsong, and scuttled her in the harbor.",
        narrative: "Whispers like to brag they found a way under the waves to find the wealth. Gracmaas the Pirate claimed to have recovered it all to his hidden lair—before he was killed."
      },
      {
        name: "Limptwitch's Stash",
        category: "Misplaced Fortune",
        desc: "Limptwitch was a Whisper who interrogated ghosts to find the location of hidden treasure. He was famous for his Grotto, the place where he stored all his salvaged wealth. Many factions tried to get his treasure, but he never gave up the secret. Then he was jailed and hanged. The Grotto was never found.",
        narrative: "Did a cellmate in prison hear muttered hints as to its location? Maybe a Whisper has clues based on where he left his mark in the sewers. Has someone finally found a real lead?"
      },
      {
        name: "Mark of the Void",
        category: "Religious Object",
        desc: "It is an eerie black disk of leviathan bone, about the size of a dinner plate but five times as thick. The bone is carved with a strange circular pattern with rays cutting through it. The primitive artwork was polished, and silver inlaid in the pattern, by a decadent nobleman.",
        narrative: "Impressionable people admit the disk whispers to them, they hear the Back of the Mirror when it the disk is near. Many cults see this disk as a conduit to clearer communication with their supernatural patrons."
      },
      {
        name: "Naladicha's Cartography",
        category: "Historical Curiosity",
        desc: "The famous cartographer Naladicha died, and his ghost was woven into a spirit anchor connected to a pen on a wire. The drooping pen scribbled nonstop, dipping to indicate a page turn. Two books were filled with scribbles before the pen stilled. These lines and shapes may be maps of the Ghost Field.",
        narrative: "One consulting Whisper reported that when she attuned to the books using an expensive and difficult ritual, the maps became luminous and four dimensional, revealing lost secrets in Duskwall."
      },
      {
        name: "Norscye's Lament",
        category: "Famous Jewel",
        desc: "This ruby has been set in a series of weapons for the last three centuries. One estimate was that the gem had participated in upwards of a thousand deaths. Legend suggests that the ruby can hold a single ghost, surviving the destruction of the body, bound to the gem until it chooses another guest.",
        narrative: "While the gemstone is priceless because of its unnatural clarity, it is also possible that an important ghost might be inside, and might choose to speak to a Whisper or a blood relative."
      },
      {
        name: "Orb Of Sellivas",
        category: "Weird Artifact",
        desc: "This fist-sized golden orb tunes to one bearer at a time, though it may respond to others. If commanded, it can release a steady light that radiates in the material world and the Ghost Field, revealing what is hidden. The radiation can also draw or repel ghosts and demons.",
        narrative: 'The Sellivas order of witches wrote their research journals in an ink that can only be read by the light of the Orb. If someone had the Orb and the "blank" book, they could crack ancient secrets.'
      },
      {
        name: "Plant Evidence",
        category: "Secret Dirty Work",
        desc: "Someone needs to be found guilty of doing something. For that to work out, you need evidence, put in the wrong place at the wrong time. To manage that, you need proper scoundrels.",
        narrative: "Do you know what the target will be accused of doing? Are you to lead the authorities to the evidence? Must someone be seduced before a hidden witness? Are the scoundrels making evidence, or using what they're given? What if they could do better? Must the evidence fool a court, or a powerful individual?"
      },
      {
        name: "Plasmic Blade Flail",
        category: "Weird Artifact",
        desc: "This weapon can slay ghosts and demons. It appears to be a gladius stitched with runes. Once the bearer attunes to the weapon, it can disconnect into vertebrate-like wedges connected by a steely central cable. The blade-whip is flexible and simmering with energy. It can reform into a straight blade at will.",
        narrative: "Only five of these flails ever existed. One is carried by the Spirit Warden assigned to the Immortal Emperor's defense. The rest are the stuff of legends."
      },
      {
        name: "Remote Writer",
        category: "Weird Artifact",
        desc: "This little book has a peculiar occult symbol on the cover. If an object is placed between the covers for a full 24 hours, then the book will transcribe any conversation happening in earshot of the object until reset. When the book reaches the end, the writing starts over on the first page, clearing pages as it goes.",
        narrative: "The book provides remote reading, eavesdropping of a sort. A target's favorite pen or lucky coin can become the broadcaster, and determined spies can copy the magic book writing so they don't lose it."
      },
      {
        name: "Rylaria's Shield",
        category: "Family Heirloom",
        desc: "Rylaria Graefwold was a soldier who gained title and wealth. She wrote her life's story on the back of the shield she used to save a general. Later generations added to the family story. The shield represents the family's honor. It was lost at sea when their first leviathan hunting ship was wrecked. Or was it?",
        narrative: "Now the family is wealthy, and this artifact would be important to them. Does it have a secret in code?"
      },
      {
        name: "Skovlan Scrip",
        category: "Misplaced Fortune",
        desc: "A dense lockbox filled with paper money issued by the Akorosian government to pay soldiers quelling the Skovlander Insurrection. The scrip can be exchanged for coins or services in Duskwall. Scrip is basically untraceable.",
        narrative: "Some of the military supply that got lost during the war. Does the stashs location implicate a corrupt official or other thief?"
      },
      {
        name: "Sonurian Ghost Key",
        category: "Family Heirloom",
        desc: "The Sonuria family had mansions in the area that is now the Seven Shallows slum. They created a vault for the protected dead, and for their mundane treasures. The only way in is for a family member to present the Sonurian Ghost Key before the hidden location of the vault in the Ghost Field. The key has been lost for decades.",
        narrative: "That key could be hidden anywhere. If it were found, either a family member could be recruited to open the door, or the key could be sold to the family. What does the key look like? What is inside the vault?"
      },
      {
        name: "Soultrap Carnelian",
        category: "Famous Jewel",
        desc: "This semi-precious stone was carved by the Whisper Ichralia. She suffocated people with hot wax and bound their fresh ghosts in wax seals on scrolls or letters with the Soultrap. When the seal was broken, the insane ghost attacked the opener and anyone nearby.",
        narrative: "The Spirit Wardens destroyed this object decades ago. Didn't they? Maybe someone else made another one, or maybe the original survived."
      },
      {
        name: "Steal Blackmail",
        category: "Secret Dirty Work",
        desc: "Secrets must be protected. If they come out, people can get hurt, ruined, killed, and so on. You are hired to adjust the circle of people who can prove something. Will it be bigger? Or smaller?",
        narrative: "Do you know what information you're after, or is that secret from you? If you have a chance, will you peek at it? Are you targeting a blackmailer to remove their hold, or getting evidence to give a blackmailer? Is the evidence to be destroyed? Do you plan to do as you are told?"
      },
      {
        name: "Terrorize",
        category: "Secret Dirty Work",
        desc: "People can be stubborn, to the point where only fear can unseat their decision. Maybe they feel independent and need to reminded that they need protection. Maybe they feel safe and need to be reminded they are not untouchable.",
        narrative: "Are you supposed to be someone in particular, like a random street thug or rival's employee or bluecoat? How far can the terror go? Do you need to trash a home, or maybe converse with a loved one?"
      },
      {
        name: "The Emerald Well",
        category: "Famous Jewel",
        desc: "This depthless gem is a chilly pinhole between the material world and the Ghost Field. It provides energy to Whispers and attracts ghosts. The Emerald Well was protected by the Church of the Ecstasy of the Flesh, but a thief stole it decades ago. It is a hotspot for supernatural activity. Disaster flows in its wake.",
        narrative: "This is one of the few objects pursued by demons, Whispers, inspectors, clergy, and collectors. Scholars suggest demons may be able to turn it inside out, creating a fresh gate to incarnate more demons."
      },
      {
        name: "The Hellwhisper Ring",
        category: "Weird Scholarship",
        desc: `The ring is made of tiny bits of bone wired together. It must be worn for at least a day per year of the bearer's life before it begins to work. When placed on a source of information, the ring sifts it until the ring speaks the information's "language." The bearer can see through riddles, read arcane texts, and break code with ease.`,
        narrative: "Legend says 32 demons voluntarily gave some of their bone to be part of this ring, and it was released among humans to cause chaos through greater understanding."
      },
      {
        name: "The Helsman Inheritance",
        category: "Misplaced Fortune",
        desc: "The final will and testament of the clan's patriarch included a 24 hour locked-house condition. Survivors would split the inheritance. Darayl Helsman left the house at the end of the time with a small bag. Explorers found nothing but corpses in the house, the inheritance was gone. Darayl was found dead the next day, the bag gone. The city locked the house and guards against trespassers.",
        narrative: "Surely Darayl hid the inheritance in the Ghost Field. Find the ghost key and lock in the house, and get it all! Or, did someone else already get it?"
      },
      {
        name: "The Key Lens",
        category: "Weird Scholarship",
        desc: 'The round frame has forty special lenses hinged on its rim. The lenses can layer over each other, flip out past the frame, rotate to take advantage of the angles inside the ground crystal, and take translucent colored filters. Their inventor, VLAS HALDAK, said he had found "the key." He died of shock, the lens on his work table.',
        narrative: "Legends vary. It can see into the Ghost Field, it can see into people, it allows reading demonic texts, it can see the way into ghost neighborhoods, etc. Needs a Whisper to use properly."
      },
      {
        name: "The Leviathan's Eye",
        category: "Famous Jewel",
        desc: "This sapphire turns impossibly black if dipped in leviathan blood. If the still-bloody stone is pressed against a seer's forehead, the sensitive can see what the ocean sees, looking above the waves or probing the deeps. The gem used to be passed around between leviathan hunter captains, but has since been lost.",
        narrative: "One expert said using the Eye was as close as a human could get to a demon seeing through its elemental affinity, and that it began a slow change in the individual who was exposed to its power."
      },
      {
        name: "The Tabissera Diary",
        category: "Weird Scholarship",
        desc: "Warden Khalana Uress was the Head Confessor of the Spirit Wardens. She recorded secrets that were only for the use of the order using a book code, coordinates that pointed to words in a specific book. Without that book, the code cannot be cracked. Daring thieves took the book, then lost it.",
        narrative: "Fakes come on the market all the time. Only the Spirit Warden leadership know what the book looked like, and they aren't telling. What is the Diary about?"
      },
      {
        name: "The Thousand Facet Diamond",
        category: "Famous Jewel",
        desc: "This gem is the elegant centerpiece on the back of a peculiar clockwork gauntlet. A seer can use the gauntlet to travel into the Ghost Field while retaining physical presence, or possibly even other dimensions. Each use burns out some of the diamond facets. The device is reported to have a mind of its own.",
        narrative: "Ever since its theft from the Adelairde family, the gauntlet has surfaced only in rumors of especially daring heists or mind-shattering experiments."
      },
      {
        name: "Whitecrown Signet Ring",
        category: "Family Heirloom",
        desc: "The Whitecrown family schismed in the wake of the theft of the matriarch's signet ring over two centuries ago. They fell from being players in the intrigues around the throne to bickering over dwindling family holdings. Their wealth and influence is low, but not beyond recall.",
        narrative: "If the ring resurfaced, elements of the feud might put aside their differences and reunite. Besides, legends suggest a ghost matriarch is bound to the ring, and she knows their secrets."
      }
    ]
  }
}, Us = {
  1: {
    height: 836,
    width: 230,
    paths: [
      "M217.017,123.52c-1.6-0.8-2.84-1.44-4.1-2.04c-1.12-0.53-2.26-1.04-3.42-1.51 c-1.05-0.43-2.18-0.68-3.18-1.19c-0.89-0.45-1.23-1.23-1.2-2.36c0.09-4.48-0.07-8.97,0.05-13.45c0.08-3.31-0.83-6.47-1.14-9.72 c-0.01-0.14-0.09-0.28-0.14-0.42c-0.57-2.01-1.2-4.01-1.69-6.04c-0.45-1.85-0.75-3.74-1.11-5.61 c-0.012-0.043-0.023-0.085-0.035-0.127c-0.6-1.69-1.348-3.353-1.825-5.083c-0.46-1.66-0.68-3.38-1.03-5.07 c-0.04-0.24-0.16-0.47-0.25-0.7c-0.49-1.32-0.98-2.65-1.47-3.97c-0.55-1.44-0.93-2.97-1.69-4.28c-0.79-1.35-0.65-3.03,0.61-4.19 c0.43-0.39,0.85-0.85,1.08-1.36c0.57-1.3,1.35-2.62,1.44-3.97c0.08-1.11-0.46-3.08-1.14-3.29c-1.58-0.47-3.49-0.42-5.1,0.03 c-1.41,0.4-2.59,1.63-4.07,2.62c-1.15-1.18-2.43-2.41-3.6-3.75c-0.41-0.47-0.43-1.29-0.82-1.78c-0.67-0.84-1.56-1.5-2.23-2.33 c-0.18-0.22-0.08-0.9,0.13-1.16c0.85-1.02,1.78-1.97,2.71-2.92c2.18-2.22,4.37-4.45,6.57-6.65c0.85-0.86,1.78-1.64,2.63-2.5 c1.16-1.17,2.38-2.29,3.37-3.59c0.66-0.88,0.89-2.07,1.42-3.06c0.86-1.63,0.01-3.02-0.68-4.31c-0.23-0.43-1.4-0.4-2.15-0.48 c-0.69-0.08-1.4,0.02-2.09-0.02c-1.71-0.11-3.14,0.17-4.52,1.47c-1.22,1.14-2.96,1.74-4.44,2.62c-0.98,0.59-1.89,1.31-2.88,1.88 c-2.02,1.17-4.2,2.11-6.07,3.47c-1.12,0.81-2.16,1.18-3.49,1.4c-1.28,0.22-2.44,1.1-3.7,1.59c-0.58,0.23-1.72,0.49-1.82,0.3 c-0.91-1.63-2.75-1.79-4.03-2.77c-0.33-0.25-0.58-0.62-0.93-0.82c-1.11-0.64-2.26-1.22-3.38-1.85c-1.48-0.83-2.94-1.7-4.42-2.53 c-0.93-0.53-1.83-1.24-2.84-1.5c-1.37-0.35-2.24-1.96-3.89-1.5c-0.08,0.03-0.19-0.02-0.29-0.04c-1.97-0.58-3.94-1.16-5.91-1.73 c-0.28-0.08-0.76-0.02-0.84-0.18c-0.89-1.7-2.8-1.2-4.1-1.6c-2.83-0.87-5.94-0.87-8.94-1.22c-0.39-0.04-1.05,0.06-1.14-0.13 c-0.79-1.56-2.21-1.01-3.4-1.05c-2.09-0.08-2.68-0.62-2.72-2.65c-0.01-0.84-0.1-1.69-0.24-2.51c-0.16-0.88-0.54-1.72-0.62-2.59 c-0.13-1.24-0.03-2.49-0.11-3.73c-0.06-0.88-0.61-1.45-1.5-1.13c-0.79,0.28-1.59,0.72-2.21,1.28c-1.48,1.36-2.85,2.84-4.29,4.25 c-1.1,1.08-2.08,2.06-3.81,2.55c-1.54,0.44-2.99,1.69-4.63,2.42c-1.79,0.8-3.28,2.25-5.44,2.13c-0.44-0.02-1.16-0.02-1.28,0.22 c-0.7,1.36-1.94,0.82-2.98,0.97c-0.49,0.07-0.99,0.11-1.47,0.24c-1.92,0.49-3.84,0.98-5.75,1.52c-1.74,0.49-3.51,0.95-5.19,1.61 c-1.92,0.74-3.67,1.99-5.63,2.46c-1.64,0.38-3.01,1.13-4.51,1.72c-0.99,0.39-2.52,0.38-3.43-0.13c-1.93-1.09-4.28-1.09-6.03-2.54 c-0.22-0.19-0.67-0.12-1.02-0.13c-0.9-0.02-1.79-0.02-2.69-0.02c-1.37,0.01-2.19,0.72-2.36,2.15c-0.09,0.78-0.06,1.59-0.09,2.38 c-0.01,0.35,0.11,0.87-0.06,1.02c-1.68,1.35-0.89,3.24-1.18,4.9c-0.16,0.88-0.56,1.8-1.1,2.51c-0.75,0.99-1.76,1.79-2.61,2.72 c-1.02,1.1-1.99,2.26-2.99,3.39c-1.49,1.67-2.96,3.37-4.5,5c-1.36,1.45-2.81,2.83-4.2,4.25c-0.16,0.17-0.19,0.46-0.31,0.67 c-0.74,1.29-1.39,2.64-2.25,3.84c-0.89,1.25-2.63,1.86-2.72,3.75c-0.02,0.38-0.57,0.73-0.86,1.11c-0.37,0.49-0.79,0.96-1.07,1.5 c-0.73,1.39-1.26,2.89-2.1,4.21c-1.08,1.71-2.25,3.34-2.65,5.38c-0.07,0.32-0.39,0.6-0.57,0.91c-0.21,0.34-0.45,0.67-0.59,1.05 c-0.43,1.21-0.72,2.48-1.24,3.65c-0.79,1.76-1.75,3.45-2.6,5.19c-1.27,2.6-2.74,5.13-3.69,7.85c-0.5,1.45-0.18,3.23-0.08,4.85 c0.05,0.7,0.68,1.37,0.69,2.06c0.06,6.07,0.06,12.15,0.01,18.23c0,0.71-0.37,1.44-0.63,2.13c-0.35,0.95-1.04,1.85-1.09,2.8 c-0.07,1.31-1.04,1.92-1.62,2.82c-0.91,1.43-2.71,1.9-3.59,3.51c-1.01,1.85-0.94,3.91,0.46,5.41c1.17,1.24,2.59,0.75,3.93,0.97 c1.41,0.22,3.01,0.26,4.12,0.99c1.11,0.74,1.87,2.16,2.5,3.43c0.77,1.56,1.35,3.24,1.8,4.92c0.67,2.5,0.94,5.12,2.32,7.4 c0.56,0.92,1.03,1.9,1.52,2.87c0.51,1.03,0.96,2.09,1.48,3.11c0.56,1.09,1.13,2.18,1.77,3.22c0.29,0.48,0.84,0.8,1.16,1.26 c0.61,0.87,1.11,1.82,1.71,2.69c0.32,0.47,0.83,0.81,1.16,1.27c0.93,1.3,1.79,2.65,2.73,3.95c0.31,0.43,0.83,0.69,1.15,1.11 c0.52,0.69,0.89,1.51,1.44,2.16c0.41,0.48,1.1,0.72,1.54,1.18c1.57,1.66,3,3.46,4.65,5.03c1.3,1.26,2.91,2.18,4.25,3.4 c1.99,1.84,3.82,3.85,5.81,5.7c0.51,0.47,1.42,0.47,1.99,0.9c0.95,0.71,1.78,1.59,2.88,2.59c-0.72,0.66-1.63,1.5-2.55,2.33 c-0.78,0.7-1.61,1.34-2.34,2.07c-1.54,1.55-3.05,3.13-4.54,4.73c-1.24,1.32-2.6,2.56-3.6,4.05c-0.6,0.91-1.1,1.85-1.89,2.63 c-1.23,1.21-1.21,4.03,0.24,4.66c1.03,0.45,2.61,0.53,3.57,0.03c1.41-0.72,2.76-0.5,4.14-0.57c1.93-0.09,3.89,0.02,5.8-0.21 c1.19-0.14,2.33-0.75,3.46-1.2c0.49-0.19,0.89-0.6,1.38-0.76c0.46-0.16,1.13,0.06,1.45-0.21c2.19-1.82,5.18-1.79,7.53-3.48 c1.41-1.01,3.25-2.21,5.36-2.06c0.28,0.02,0.58-0.29,0.88-0.44c0.42-0.22,0.85-0.61,1.29-0.62c3.43-0.04,6.86,0,10.3,0.03 c0.38,0,0.99-0.01,1.11,0.21c0.64,1.13,1.69,0.85,2.63,0.91c1.1,0.06,2.24-0.13,3.27,0.14c2.96,0.79,5.9,1.59,9,1.58 c6.02-0.03,12.05,0.27,18.01-0.93c0.82-0.17,1.69-0.08,2.52-0.24c1.04-0.2,2.05-0.52,3.14-0.81c0.13,0.6,0.21,0.79,0.21,0.98 c0.01,8.226,0.03,16.462,0.01,24.699c-0.001,0.368-0.217,0.882-0.515,1.099c-0.676,0.493-1.572,0.71-2.176,1.273 c-1.37,1.26-2.6,2.68-3.92,4c-0.73,0.73-1.61,1.32-2.31,2.08c-0.98,1.06-0.96,2.42-0.9,3.78c0.07,1.95,0.64,2.62,2.59,2.67 c1.712,0.061,3.434,0.019,5.146,0.03c1.112,0.007,2.014,0.908,2.024,2.02c0.06,6.72,0.08,13.44,0.15,20.16 c0.019,1.205-0.537,1.936-1.437,2.533c-0.23,0.153-0.451,0.318-0.644,0.516c-1.605,1.643-3.165,3.308-4.789,4.931 c-0.63,0.64-1.57,1.05-2.01,1.79c-1.29,2.14-3.22,3.55-5.3,4.69c-2.51,1.38-2.76,1.58-2.61,4.33c0.09,1.65,1.84,3.48,3.41,3.17 c1.82-0.35,3.74-0.85,5.26-1.85c0.77-0.51,1.38-0.68,2.16-0.71c0.95-0.04,1.9-0.01,2.84-0.01c2.59,0.01,3.03,0.46,3.03,3.1 c-0.01,31.18-0.02,62.36-0.04,93.55c0,2.88-0.13,5.78,0.03,8.66c0.16,2.8,0.67,5.58,0.91,8.39c0.15,1.83,0.08,3.68,0.15,5.52 c0.02,0.42,0.14,0.85,0.29,1.25c0.23,0.58,0.66,1.12,0.75,1.72c0.13,0.93-0.34,2.21,0.13,2.78c1.82,2.18-0.35,4.04-0.21,6.04 c0.01,0.2-0.21,0.41-0.31,0.62c-0.53,1.08-1.43,2.14-1.49,3.24c-0.21,4.27-0.19,8.56-0.19,12.84 c-0.01,51.9,0.01,103.81-0.05,155.71c0,4.36-0.54,8.71-0.84,13.06c-0.03,0.34-0.19,0.66-0.31,0.98c-0.25,0.69-0.73,1.36-0.74,2.05 c-0.12,5.68-0.07,11.36-0.23,17.03c-0.11,3.65-0.78,7.31-0.68,10.95c0.12,4.59-0.27,9.16,0.58,13.82 c0.85,4.63,0.19,9.53,0.21,14.31c0.01,1-0.27,2.32,0.24,2.92c1.2,1.39,0.69,2.89,0.79,4.35c0.03,0.33-0.22,0.7-0.37,1.03 c-0.25,0.55-0.55,1.06-0.76,1.62c-0.17,0.44-0.2,0.93-0.36,1.38c-0.47,1.36-0.97,2.72-1.45,4.08c-0.11,0.31-0.11,0.7-0.3,0.94 c-1.58,2-2.33,4.36-2.52,6.8c-0.23,3.07-0.06,6.17-0.08,9.26c-0.02,3.62,0.05,7.24,0.93,10.78c0.07,0.3,0.39,0.56,0.42,0.86 c0.13,1.29,0.2,2.59,0.29,3.88c-0.91,0.05-1.84,0.23-2.72,0.09c-0.66-0.1-1.24-0.71-1.91-0.9c-1.83-0.53-3.81,1.69-3.74,3.17 c0.1,2.16,0.3,4.33,1.59,6.15c1.14,1.6,2.44,3.09,3.73,4.57c1.18,1.36,2.64,2.45,2.25,4.66c-0.47,2.6-0.66,5.25-1.01,8.26 c-4.52,0.25-8.9,0.65-13.3,0.72c-8.65,0.13-17.32,0.08-25.98,0.13c-0.58,0-1.24-0.02-1.74,0.22c-1.03,0.49-1.92,1.28-2.97,1.7 c-1.85,0.75-3.77,1.31-5.65,1.96c-0.22,0.07-0.42,0.22-0.63,0.32c-1.16,0.57-2.28,1.38-3.51,1.64c-1.03,0.21-1.79,0.61-2.49,1.28 c-0.2,0.19-0.4,0.5-0.62,0.51c-1.14,0.08-2.03,0.39-2.85,1.34c-0.63,0.73-1.75,1.04-2.67,1.49c-1.72,0.84-3.48,1.61-5.18,2.49 c-1.48,0.77-3.04,1.49-4.33,2.53c-1.49,1.21-2.68,2.8-4.09,4.14c-0.84,0.79-1.75,1.75-2.79,2.02c-1.46,0.39-2.97,0.34-4.52,0.83 c-2.05,0.64-4.39,0.08-6.57,0.95c-1.38,0.54-3.25-0.48-4.4,1.21c-0.07,0.1-0.38,0.03-0.58,0.05c-2.5,0.25-4.95-0.04-7.53,0.73 c-3.19,0.97-6.74,0.74-10.14,1.08c-0.59,0.06-1.36,0.23-1.7,0.63c-0.83,1.02-0.42,3.75,0.69,4.4c0.91,0.54,2,0.82,3.05,1.07 c0.66,0.15,1.4-0.06,2.08,0.05c1.68,0.29,3.67-0.91,5.01,1.05c0.07,0.1,0.38,0.06,0.58,0.07c4.87,0.2,9.72,0.09,14.61,0.8 c4.38,0.64,8.94-0.01,13.42,0.18c3.03,0.13,5.86-0.88,8.82-1.09c0.14-0.01,0.35-0.06,0.4-0.15c0.61-1.3,1.84-0.85,2.85-1.06 c0.57-0.11,1.2-0.3,1.65-0.65c0.83-0.64,1.45-1.63,2.35-2.1c2.5-1.32,4.56-3.31,7.19-4.45c1-0.43,1.58-0.43,2.51,0.04 c0.62,0.31,1.68,0.25,2.33-0.08c1.06-0.53,1.88-0.64,2.74,0.22c0.76,0.76,1.53,1.51,2.34,2.23c1.14,1.02,2.41,1.91,3.46,3.02 c1.04,1.08,1.85,2.38,2.78,3.56c1.11,1.4,4.49,1.72,5.94,0.58c1.29-1.01,1.57-2.52,1.85-3.97c0.24-1.24,0.03-2.49,0.68-3.78 c0.9-1.75,1.39-2.39,3.41-2.36c2.29,0.02,4.58,0.1,6.87,0.11c1.04,0.01,1.62,0.52,1.84,1.5c0.31,1.31,0.45,2.68,0.96,3.9 c0.36,0.85,1.11,1.71,1.91,2.16c1.23,0.7,4.69-0.66,5.09-2.01c0.53-1.73,1.15-3.6,1-5.35c-0.24-2.82,1.44-4.54,2.89-6.43 c0.3-0.39,1.44-0.68,1.72-0.45c1.45,1.23,3.45,2.17,3.18,4.62c-0.06,0.64,0.09,1.3,0.02,1.94c-0.31,3.01-0.68,6.01-0.98,9.02 c-0.08,0.86-0.01,1.74-0.01,2.77c1.08-0.07,1.88-0.05,2.64-0.18c1.12-0.2,2.2-0.62,3.32-0.73c1.38-0.13,2.78-0.05,4.18-0.04 c1.86,0.01,2.13,0.24,1.82,2.07c-0.17,1-0.42,2.39-1.12,2.8c-1.1,0.65-0.86,1.44-0.87,2.24c-0.05,2.1-0.03,4.19-0.01,6.28 c0.01,0.44,0,1.19,0.2,1.26c1.41,0.53,0.81,1.71,0.98,2.64c0.17,0.9,0.34,1.81,0.64,2.66c0.39,1.08-0.23,3.51-1.19,3.75 c-1.67,0.43-3.39,0.66-5.09,0.99c-1.84,0.36-3.67,0.72-5.5,1.11c-0.22,0.05-0.4,0.28-0.61,0.39c-0.43,0.23-0.85,0.56-1.3,0.63 c-0.594,0.081-1.208,0.05-1.82,0.036c-1.386-0.033-2.643-0.905-3.075-2.222c-0.613-1.87-0.822-3.704-0.936-5.614 c-0.03-0.33-0.6-0.59-0.79-0.96c-0.43-0.85-1.13-1.77-1.07-2.62c0.07-0.98,1.05-1.44,2.19-1.38c0.81,0.04,1.64-0.21,2.44-0.43 c0.59-0.16,1.12-0.55,1.72-0.69c0.52-0.12,1.09-0.06,1.63-0.02c1.25,0.08,1.8-0.43,1.76-1.72c-0.05-1.89,0.01-3.78-0.01-5.68 c-0.01-1.66-0.83-2.55-2.56-2.57c-3.84-0.04-7.67-0.02-11.5,0.02c-1.16,0.01-1.74,0.7-1.85,1.83c-0.05,0.54-0.08,1.09-0.24,1.6 c-0.48,1.6-1.38,3.17-1.45,4.78c-0.08,1.83-0.74,3.01-2.08,4.1c-0.83,0.67-1.56,0.79-2.23,0.04c-1.08-1.22-2.09-2.51-3.04-3.83 c-1.06-1.48-1.88-3.17-3.08-4.51c-0.91-1.03-1.92-2.41-3.7-1.84c-0.51,0.17-0.93,0.69-1.44,0.79c-2.58,0.46-4.33,2.33-6.35,3.7 c-2.13,1.45-4.2,2.53-6.93,2.33c-3.17-0.24-6.37-0.07-9.55-0.09c-0.4,0-0.93,0.1-1.16-0.1c-1.75-1.51-4.32-2.07-5.29-4.5 c-0.06-0.13-0.33-0.24-0.5-0.25c-2.1-0.1-3.95-1.56-6.16-1.07c-0.31,0.07-0.68-0.08-1.02-0.17c-0.9-0.25-1.8-0.73-2.71-0.75 c-4.62-0.08-9.25-0.03-13.88-0.05c-0.46,0-0.94-0.13-1.38-0.29c-0.63-0.24-1.23-0.8-1.85-0.81c-6.97-0.06-13.94-0.01-20.91-0.06 c-1.47-0.01-2.4,0.9-3.11,1.81c-1.58,2.02,0.43,5.8,3.19,6.29c1.71,0.31,3.41,0.64,5.12,0.96c0.19,0.04,0.49,0.05,0.55,0.17 c0.65,1.18,1.78,0.83,2.77,0.94c2.9,0.31,5.78,0.66,8.67,1c0.103,0.019,0.206,0.038,0.308,0.057c2.154,0.545,4.296,1.193,6.481,1.6 c1.241,0.232,2.507,0.15,3.769,0.183c0.284,0.007,0.568,0.119,0.821,0.24c0.62,0.28,1.22,0.6,1.83,0.9 c1.33,0.65,2.68,1.25,3.98,1.96c0.4,0.22,0.6,0.76,0.96,1.06c1.45,1.23,2.93,2.41,4.37,3.64c0.97,0.82,1.92,1.67,2.84,2.54 c1.98,1.86,3.98,3.71,5.89,5.64c1.72,1.72,3.46,3.45,4.97,5.36c1.54,1.93,3.34,2.52,5.79,2.51c18.47-0.08,36.94-0.01,55.4,0.02 c2.17,0,4.19,0.14,5.7-2.14c1.09-1.64,2.99-2.73,4.39-4.2c0.74-0.77,1.1-1.87,1.77-2.73c0.68-0.88,1.47-1.69,2.3-2.45 c1.56-1.45,2.81-3.12,3.91-4.94c0.46-0.76,1.51-1.22,1.86-2.01c0.76-1.74,1.56-3.38,3.08-4.61c0.42-0.34,0.88-0.97,0.86-1.44 c-0.08-1.47,0.99-2.28,1.57-3.39c0.75-1.42,1.61-2.73,1.52-4.59c-0.21-4.42-0.08-8.86-0.05-13.29c0-0.61,0.19-1.23,0.35-1.83 c0.14-0.49,0.55-0.98,0.49-1.43c-0.39-3,0.95-5.77,1.1-8.7c0.01-0.2,0.23-0.39,0.34-0.59c0.26-0.47,0.56-0.92,0.78-1.41 c0.59-1.37,1.1-2.77,1.75-4.11c0.19-0.39,0.85-0.54,1.1-0.93c1.25-1.87,2.56-3.71,3.58-5.7c0.73-1.41,1.8-2.83,1.37-4.6 c-0.1-0.41-0.44-1.03-0.73-1.07c-2.3-0.28-4.43-1.46-6.87-1.09c-1.41,0.21-2.88,0.03-4.32,0.03c-2.22,0-2.56-0.51-2.76-2.74 c-0.2-2.19,1.03-4.66-1.1-6.53c-0.08-0.07-0.02-0.29-0.04-0.44c-0.26-2.65,0.17-5.27-0.75-7.99c-0.82-2.44,0.02-5.23-0.93-7.92 c-0.87-2.51,0.15-5.31-1.06-8.11c-1.14-2.64-0.76-5.92-1.16-8.91c-0.31-2.31,0.38-4.77-0.96-6.94c-0.31-0.5-0.91-0.93-1-1.46 c-0.41-2.24-0.68-4.5-1.01-6.76c-0.32-2.2-0.65-4.4-0.99-6.6c-0.03-0.19-0.09-0.47-0.23-0.53c-1.21-0.55-0.86-1.61-0.88-2.55 c-0.25-12.95,0.26-25.89-0.76-38.84c-0.645-8.159-0.207-16.407-0.21-24.606c0-0.326,0.03-0.655,0.132-0.964 c0.498-1.505,1.628-2.909,1.808-4.439c0.32-2.74,0.57-5.52,0.82-8.26c0.521-5.744,0.168-11.569,0.15-17.363 c-0.001-0.411-0.054-0.823-0.201-1.207c-0.519-1.358-1.356-2.643-1.619-4.039c-0.5-2.67-0.7-5.39-1.02-8.09 c-0.04-0.39-0.08-0.79-0.07-1.19c0.07-3.15-0.3-6.32,0.69-9.42c0.41-1.29-0.17-2.87,1.22-3.88c0.1-0.07,0.06-0.37,0.06-0.57 c0.04-8.32,0.08-16.64,0.08-24.96c0-0.43-0.28-0.88-0.45-1.31c-0.19-0.46-0.56-0.9-0.58-1.36c-0.48-11.05,0.53-22.1-0.75-33.17 c-0.77-6.68-0.15-13.52-0.19-20.29c-0.02-4.13-0.15-8.26-0.15-12.39c-0.01-44.063-0.01-88.115,0-132.178 c0-0.883,0.011-1.77,0.117-2.647c0.323-2.687-0.394-5.417,0.813-8.095c0.54-1.2,0.09-2.85,0.14-4.29c0.01-0.42,0.12-0.86,0.28-1.25 c0.26-0.62,0.63-1.2,0.88-1.82c0.14-0.36,0.1-0.78,0.19-1.16c0.48-2.02,1-4.03,1.44-6.05c0.25-1.17-0.47-2.63,1.09-3.39 c0.11-0.05,0.1-0.36,0.11-0.56c0.28-4.51,0.31-9,0.88-13.53c0.7-5.49,0.44-11.15,0.13-16.71c-0.31-5.55,1.18-10.95,0.94-16.46 c-0.02-0.62,0-1.25,0-1.92c0.98-0.1,1.74-0.1,2.45-0.27c0.7-0.17,1.35-0.53,2.03-0.75c1.92-0.62,2.45-1.33,2.42-3.39 c0-0.43-0.07-0.86-0.12-1.48h-4.97c-1.98-0.01-2.64-0.7-2.65-2.73c-0.01-0.75,0.05-1.5-0.01-2.25c-0.53-6.86,1.3-13.97-2.06-20.55 c0.49-2.24-1.35-4.79,0.96-6.8c1.23-1.08,2.27-2.42,3.62-3.33c1.23-0.83,2.52-1.47,3.3-2.84c0.8-1.42,2.89-2.31,4.31-1.95 c1.05,0.28,2.12,0.53,3.13,0.92c2.26,0.86,4.46,1.89,6.75,2.65c0.94,0.32,2.23,0.47,3.05,0.06c1.77-0.89,2.89-2.77,3.34-4.51 c0.76-2.92,0-5.91-1.12-8.69c-0.5-1.24-0.4-1.92,0.76-2.43c1.71-0.75,3.37-1.59,5.07-2.37c2.07-0.95,3.93-2.43,6.34-2.56 c0.29-0.02,0.55-0.33,0.84-0.5c0.37-0.23,0.78-0.65,1.14-0.63c1.59,0.13,3.06-0.23,4.74,0.92c1.61,1.11,4.13,0.99,6.27,1.19 c1.93,0.17,2.82-0.82,3-2.78c0.04-0.43,0.26-0.88,0.47-1.28c0.39-0.75,1.16-1.46,1.2-2.22c0.07-1.42,0.75-3-1.6-3.85 c-1.72-0.61-2.93-2.52-4.52-3.62c-1.38-0.96-2.98-1.6-4.73-2.51c0.24-0.6,0.46-1.24,0.75-1.85c0.82-1.72,1.67-3.42,2.49-5.13 c0.34-0.73,0.5-1.6,1.01-2.17c1.42-1.63,1.98-3.64,2.79-5.55c0.36-0.87,0.45-1.99,1.06-2.59c1.09-1.06,1.52-2.34,1.98-3.69 c0.29-0.85,0.66-1.68,1.09-2.46c0.51-0.93,1.33-1.73,1.67-2.7c0.81-2.39,2.14-3.18,4.45-2.38c0.31,0.1,0.7,0.11,1.03,0.04 c1.17-0.22,2.36-0.41,3.5-0.76c1.24-0.38,2.44-0.9,3.62-1.43c0.21-0.08,0.37-0.5,0.37-0.77 C217.026,126.28,217.017,124.66,217.017,123.52z M143.507,186.1c-0.82,0.65-1.72,0.95-2.7,1.06c-9.15,3.4-19.04,5.26-29.37,5.26 c-46.57,0-84.32-37.75-84.32-84.32c0-46.56,37.75-84.31,84.32-84.31c46.56,0,84.31,37.75,84.31,84.31 C195.747,143.31,174.167,173.48,143.507,186.1z",
      "M214.327,133.65c-1.07-0.77-2.58-1.24-3.21-2.27c-2.25-3.6-6.31-7.65-5.88-11.05 c1.52-12.04-0.33-23.52-2.8-35.1c-1.17-5.49-2.18-10.99,4.72-14.06c1.08-0.48,1.88-3.13,1.63-4.57c-0.19-1.07-2.16-2.19-3.55-2.64 c-6.7-2.14-12.98-4.88-17.4-10.69c-8.86-11.65-19.24-21.69-32.64-27.85c-6.64-3.05-11.86-6.24-11.09-14.54 c0.07-0.78-0.31-1.64-0.64-2.4c-1.25-2.84-2.56-5.66-3.84-8.48c-2.09,2.6-4.15,5.23-6.27,7.81c-1.41,1.73-2.68,4.5-4.41,4.85 c-5.32,1.1-10.85,1.76-16.28,1.67c-10.63-0.18-20.99,1.14-30.97,4.67c-7.85,2.78-15.14,3.77-22.72-1.31 c-3.42-2.29-8.09-2.69-13.48-4.35c1.1,3.41,1.68,5.25,2.3,7.08c2.66,7.87,2.9,14.94-4.11,21.28c-9.76,8.83-16.78,19.74-21.74,31.96 c-3.43,8.43-7.09,16.77-10.4,25.25c-0.69,1.77-0.76,4.07-0.31,5.93c1.61,6.58,3.4,13.13,5.43,19.59c3.09,9.77,5.6,19.86,9.93,29.08 c3.68,7.83,9.58,14.63,14.68,22.14c-0.79,0.96-2.1,2.1-2.8,3.53c-1.36,2.82-2.37,5.81-3.53,8.72c3.12,0.11,6.55,1.11,9.29,0.15 c8.09-2.86,14.4-0.35,20.54,4.73c2.39,1.98,2.05,3.36,0.46,5.32c-5.83,7.15-10.71,15.15-18.99,20.06 c-0.98,0.57-0.82,3.05-1.18,4.65c1.4,0.24,3.08,1.12,4.16,0.63c10.45-4.67,20.76-9.67,31.2-14.38c6.31-2.84,12.43-5.88,19.84-5.85 c10.42,0.05,20.84-1.07,31.26-1.7c1.76-0.11,3.51-0.28,5.42-0.43c0.16,1.54,0.36,2.51,0.36,3.49 c-0.02,59.51,0.09,119.02-0.28,178.52c-0.04,6.76-2.01,13.66-6.63,19.46c-5.78,7.26-11.13,14.88-16.46,22.49 c-0.72,1.03-0.2,2.93-0.26,4.43c1.3-0.02,2.66,0.24,3.87-0.09c5.76-1.56,11.47-3.28,18.14-5.22c0.62,6.25,1.49,10.98,1.5,15.73 c0.13,47,0.21,94.01,0.09,141.01c-0.02,9.45-0.81,18.9-1.43,28.34c-0.51,7.62-1.87,15.22-1.81,22.82 c0.09,11.27,1.35,22.52,1.59,33.8c0.11,4.87-1.07,9.77-1.69,14.65c-0.95,7.5-2.36,14.98-2.73,22.51c-0.3,6.1,1.55,12.38,0.78,18.37 c-0.97,7.49-5.01,14.53-11.46,18.32c-5.29,3.13-12.04,4.52-18.29,5.09c-7.23,0.66-14.61-0.47-21.92-0.75 c-7.56-0.29-13.36-5.01-15.18-12.31c-0.24-0.97-0.97-2.04-1.79-2.6c-3.54-2.44-7.19-4.7-11.02-7.17 c-6.83,8.88-7.82,11.33-7.65,21.13c0.27,15.78,1.28,31.58,0.87,47.34c-0.19,7.12-0.36,13.84,2.91,20.27 c0.57,1.13,1.4,2.86,2.29,2.97c6.4,0.82,12.69,3.55,19.18-1.16c3.35-2.42,8.23-3.21,12.54-3.72c7.41-0.88,14.92-0.84,22.37-1.43 c4.08-0.32,7.49-1.9,7.64-6.78c0.16-4.95,2.49-7.46,7.41-7.25c1.26,3.22,2.35,6.35,3.73,9.34c0.48,1.05,1.56,2.34,2.55,2.54 c3.24,0.62,6.57,0.74,9.86,1.16c3.38,0.42,5.09-0.92,6.01-4.3c1.78-6.56,3.92-13.02,6.08-19.47c1.92-5.71,2.31-11.28-0.26-16.93 c-0.69-1.51-0.6-3.37-1.02-5.99c2.46,0.64,3.97,1.18,5.52,1.41c2.3,0.33,4.62,0.44,6.93,0.65c-0.07-2.7,0.5-5.64-0.37-8.06 c-1.39-3.88-4.05-7.3-5.6-11.14c-2.34-5.79-5.86-11.75-5.96-17.69c-0.58-35.66-0.34-71.34-0.33-107.01c0-1.81,0.12-3.68,0.57-5.42 c3.38-13.1,3.56-26.5,1.68-39.63c-1.53-10.75-1.54-20.97,1.15-31.44c1.09-4.23,1.29-8.84,1.02-13.23 c-1.21-19.88-3.7-39.73-3.94-59.61c-0.62-50.99-0.29-102-0.34-153.01c0-1.66-0.07-3.35,0.18-4.98c1.91-12.43,4.96-24.78,5.62-37.26 c1.28-24.01,3.36-48.15-1.87-72.06c-0.27-1.25,0.73-3.34,1.8-4.23c9.73-8.05,9.78-8,20.31-1.11c0.7,0.46,1.39,1.05,2.17,1.23 c2.36,0.55,6.51,1.85,6.85,1.21c1.35-2.54,2.6-5.99,1.92-8.6c-2.38-9.22-2.43-17.78,3.82-25.59c2.88-3.6,5.07-8.11,8.66-10.71 c4.75-3.45,10.65-5.28,15.88-8.13c2.41-1.3,5.32-2.92,6.4-5.17C220.707,136.36,216.637,135.31,214.327,133.65z M111.437,192.42 c-46.57,0-84.32-37.75-84.32-84.32c0-46.56,37.75-84.31,84.32-84.31c46.56,0,84.31,37.75,84.31,84.31 C195.747,154.67,157.997,192.42,111.437,192.42z",
      "M216.086,109.69c-0.08-0.48,0.02-1-0.02-1.5c-0.07-0.95,0.16-2.22-0.36-2.76 c-0.73-0.76-2.03-0.97-3.07-1.46c-0.63-0.3-1.24-0.67-1.83-1.05c-0.53-0.33-1.08-0.65-1.53-1.07c-0.8-0.74-1.92-0.81-2.57-2.09 c-1.13-2.22-0.49-4.7-1.75-6.94c-1-1.8,0.07-4.32-0.91-6.51c-0.3-0.67,0.89-2,1.37-3.04c0.65-1.39,2.31-2.03,2.57-3.75 c0.12-0.81,0.64-1.61,1.15-2.28c1.78-2.38,1.16-5.33-1.31-6.02c-1.49-0.42-2.55-1.16-3.72-2.06c-1.21-0.92-2.77-1.49-4.25-1.92 c-1.54-0.44-2.15-1.61-2.84-2.79c-0.59-1.02-1.09-2.11-1.76-3.08c-0.71-1.02-1.59-1.93-2.47-2.98c0.35-0.13,0.74-0.16,0.86-0.35 c1.27-2.02,3.25-2,5.28-1.95c1.15,0.02,2.4,0.21,3.44-0.16c1.28-0.45,2.71-1.16,3.49-2.19c1.24-1.65-0.42-4.48-2.46-4.74 c-1.98-0.25-3.94-0.58-5.91-0.89c-0.18-0.03-0.34-0.15-0.51-0.22c-0.77-0.33-1.52-0.72-2.32-0.95c-0.57-0.16-1.22,0.01-1.79-0.13 c-2.14-0.53-4.24-1.43-6.41-1.61c-1.69-0.14-2.87-0.66-4.02-1.8c-1.28-1.26-2.82-2.26-4.1-3.52c-0.3-0.29-0.23-1.24,0-1.73 c0.44-0.91,1.54-0.97,2.32-1.44c1.74-1.05,3.29-2.45,4.89-3.74c0.52-0.42,1.31-0.9,1.38-1.42c0.19-1.46,0.06-2.96,0.06-4.5 c-2.54-0.33-4.95-0.67-7.38-0.94c-0.89-0.1-1.81-0.01-2.71-0.03c-0.34-0.01-0.68-0.07-1.01-0.16c-0.89-0.23-1.76-0.69-2.64-0.7 c-4.02-0.08-8.04-0.03-12.07-0.05c-0.42,0-1.11,0-1.23-0.23c-1.12-2.09-3.02-1.96-4.92-1.88c-1.14,0.04-1.8-0.46-2.06-1.62 c-0.27-1.22-0.34-2.76-1.12-3.54c-1.17-1.16-0.68-2.45-1.05-3.64c-0.33-1.08-0.81-2.76-1.52-2.93c-2.01-0.5-4.21-0.87-6.23,0.31 c-0.93,0.54-1.88,1.05-2.87,1.44c-1.21,0.48-2.61,0.61-3.7,1.27c-1.77,1.08-3.79,0.89-5.3,0.34c-1.38-0.5-2.66-0.56-4-0.68 c-0.75-0.06-1.5-0.02-2.23-0.16c-0.94-0.18-1.87-0.77-2.76-0.69c-1.9,0.18-3.03-0.91-3.97-2.14c-1.29-1.72-2.14-3.79-3.53-5.41 c-1.31-1.54-1.8-3.71-3.74-4.73c-0.49-0.26-0.96-0.67-1.48-0.73c-0.94-0.12-1.92-0.14-2.85,0c-0.59,0.08-1.26,0.41-1.66,0.85 c-0.55,0.59-0.75,1.49-1.3,2.07c-1.44,1.55-2.99,3-4.48,4.5c-0.13,0.12-0.12,0.38-0.22,0.55c-0.46,0.75-0.9,1.52-1.42,2.22 c-0.5,0.67-1.12,1.24-1.62,1.91c-0.48,0.62-0.79,1.38-1.31,1.96c-1.39,1.54-3.54,0.54-5.35,1.73c-2.13,1.39-5.14,1.6-7.81,1.92 c-2.43,0.29-4.97,0.32-7.37-0.06c-1.44-0.23-2.84-1.32-4.04-2.3c-1.44-1.18-2.57-2.71-4.77-2.47c-0.61,0.06-1.27-0.43-2.23-0.78 c-0.27,0.91-0.79,1.91-0.83,2.92c-0.13,3.22-0.1,6.44-0.1,9.66c0,0.72-0.13,1.16-0.84,1.66c-1.79,1.24-3.39,2.74-5.12,4.08 c-0.33,0.26-0.9,0.26-1.36,0.33c-0.69,0.1-1.75-0.09-2.02,0.28c-0.84,1.21-1.97,0.84-3.05,0.96c-0.53,0.06-1.05,0.27-1.56,0.43 c-1.41,0.44-2.79,0.98-4.23,1.32c-1.4,0.33-3.13-0.6-4.16,1.16c-0.06,0.1-0.38,0.07-0.58,0.08c-1.15,0.07-2.3,0.17-3.45,0.2 c-2.18,0.07-2.94,0.91-2.47,2.97c0.12,0.55,0.55,1.09,0.97,1.51c0.85,0.82,1.83,1.51,2.67,2.35c1.09,1.09,2.1,2.27,2.99,3.24 c-0.99,1.5-1.8,2.84-2.73,4.09c-0.62,0.83-1.51,1.47-2.09,2.32c-1.11,1.6-2.09,3.3-3.12,4.96c-0.31,0.5-0.73,0.96-0.93,1.51 c-0.5,1.33-2.38,2.73-3.8,2.76c-1.15,0.03-2.49-0.24-3.4,0.26c-1.3,0.71-2.55,0.65-3.86,0.66c-2.14,0.01-4.03,0.57-5.36,2.35 c-0.3,0.41-0.32,1.02-0.56,1.48c-0.7,1.31-0.46,3.54,0.67,4.44c0.88,0.71,1.97,1.17,2.86,1.87c0.75,0.58,1.24,1.6,2.06,1.97 c1.26,0.57,1.85,1.38,1.54,2.64c-0.41,1.68,0.4,3.44-0.77,5.14c-0.67,1,0.34,2.85-1.26,3.76c-0.08,0.04-0.05,0.28-0.06,0.43 c-0.07,1.2-0.32,2.3-0.72,3.49c-0.69,2.08-1.06,4.24-2.44,6.06c-1.06,1.41-1.99,2.97-2.99,4.37c-1.47,2.05-3.91,3.38-5.93,5.04 c-0.77,0.63-1.44,1.4-2.26,1.94c-2.24,1.47-2.4,4.44-0.52,6.31c1.02,1.02,2.11,0.63,3.19,0.81c0.52,0.08,1.08,0.08,1.56,0.28 c1.37,0.58,2.71,1.21,4.05,1.87c0.66,0.33,1.54,0.63,1.86,1.2c0.54,0.99,0.73,2.18,1.06,3.29c0.11,0.38,0.15,0.8,0.33,1.14 c0.54,0.96,1.26,1.84,1.67,2.85c1.1,2.69,0.84,5.73,2.18,8.41c0.66,1.31,0.76,2.91,1.15,4.37c0.3,1.13,0.34,2.53,1.05,3.3 c0.9,0.97,0.77,1.95,0.91,3c0.09,0.63,0.37,1.24,0.6,1.95c-0.55,0.45-1.38,0.87-1.82,1.55c-0.96,1.47-1.52,3.18-2.98,4.34 c-1.33,1.06-0.8,2.64-0.82,4.03c-0.02,1.27,1.61,3.18,2.84,3.32c3.02,0.36,6.04,0.64,9.06,0.96c0.33,0.04,0.81,0.04,0.95,0.24 c1,1.45,2.98,2.44,2.17,4.75c-0.11,0.31,0.39,0.78,0.39,1.18c0.02,1.32,0.11,2.68-0.17,3.95c-0.22,1.01-1.1,1.86-1.41,2.87 c-0.54,1.71,0.41,3.02,1.55,4.15c1.28,1.27,1.94,1.24,3.66,0.26c0.96-0.55,1.99-1.12,3.06-1.32c1.94-0.35,3.1,1.4,4.64,2.13 c1.17,0.55,2.17,1.43,3.34,1.98c1.51,0.72,3.1,1.19,4.05,2.8c0.33,0.57,1.26,0.78,1.9,1.19c0.6,0.38,1.4,0.7,1.69,1.26 c0.51,1.03,0.69,2.23,1.05,3.34c0.14,0.4,0.35,0.83,0.65,1.11c0.69,0.66,0.82,3.4,0.13,4.02c-1.03,0.92-1,1.59,0.01,2.49 c0.82,0.73,1.45,1.79,2.39,2.23c0.75,0.36,1.85,0.05,2.78-0.07c0.31-0.04,0.58-0.53,0.9-0.55c3.1-0.24,5.89-1.34,8.58-2.84 c0.3-0.16,0.95-0.17,1.14,0.03c0.76,0.82,2.02,1.28,1.69,2.88c-0.33,1.67,0.2,3.38-1.17,4.99c-1.23,1.45-2.01,3.39-2.64,5.23 c-0.38,1.12-0.54,2.67-0.05,3.67c1.2,2.45,4.7,2.61,6.65,0.57c0.81-0.86,1.69-1.67,2.6-2.42c0.67-0.55,1.47-0.95,2.18-1.46 c0.32-0.22,0.58-0.52,0.85-0.79c0.92-0.91,1.79-1.88,3.23-1.91c0.07-0.01,0.12-0.25,0.21-0.36c0.47-0.55,0.87-1.23,1.45-1.62 c1.52-1.02,3.11-1.93,4.71-2.83c0.26-0.15,0.74-0.13,1.03,0.01c0.92,0.44,2.1,0.77,2.65,1.53c1.27,1.72,2.45,3.58,3.25,5.55 c0.83,2.06,3.35,3.48,5.17,2.57c1.67-0.83,2.63-2.52,4.53-3.18c1.48-0.51,2.62-2,3.93-3.03c0.29-0.22,0.64-0.44,0.98-0.49 c2.46-0.4,4.93-0.75,7.39-1.13c0.2-0.03,0.4-0.06,0.58-0.14c2.21-1.02,3.32-0.31,3.32,2.12c0,14.19-0.05,28.38,0.05,42.57 c0.01,1.86-0.96,2.7-2.18,3.62c-1.74,1.29-3.51,2.55-5.17,3.94c-1.03,0.85-1.73,2.36-2.86,2.77c-2.07,0.74-3.5,2.3-5.3,3.36 c-0.78,0.46-2.38,1.3-1.52,2.46c0.73,0.98,1.51,2.42,3.29,2.29c1.75-0.12,3.52-0.01,5.28,0.04c0.36,0.01,0.79,0.11,1.07,0.32 c0.62,0.47,1.08,1.3,1.76,1.51c2.45,0.76,2.94,2.75,3.4,4.84c0.09,0.38,0.22,0.9,0.49,1.05c1.71,0.98,1.74,2.53,1.65,4.2 c-0.06,1.3,0.03,2.61,0.03,3.92c0,29.84,0.04,59.67-0.06,89.5c-0.01,2.31,0.88,4.73-0.96,7.07c-0.87,1.09-0.54,3.2-0.94,4.86 c-0.58,2.45-0.57,4.95-2.05,7.23c-0.78,1.21-0.76,2.94-1.11,4.44c-0.34,1.49-0.68,2.98-1.03,4.46c-0.03,0.13-0.14,0.34-0.23,0.35 c-1.15,0.18-0.88,1.09-0.84,1.76c0.05,0.94-0.27,1.83,0.87,2.72c0.82,0.63,0.83,2.35,1.12,3.6c0.4,1.74,0.73,3.51,1.09,5.26 c0.03,0.15,0.05,0.32,0.13,0.42c1.29,1.52,1.66,3.35,1.96,5.25c0.2,1.27,0.59,2.51,0.92,3.76c0.03,0.12,0.2,0.2,0.26,0.33 c0.28,0.55,0.77,1.11,0.79,1.68c0.09,3.17,0.09,6.34,0.08,9.51c-0.01,53.22-0.02,106.45-0.08,159.68c0,1.51,0.78,3.34-1.06,4.47 c-0.08,0.05-0.06,0.29-0.07,0.43c-0.29,3.58-0.58,7.16-0.86,10.73c-0.32,4.15-0.63,8.3-0.97,12.45c-0.03,0.37-0.26,0.73-0.4,1.09 c-0.22,0.55-0.64,1.11-0.63,1.66c0.01,2.21,0.17,4.31,0.9,6.56c0.95,2.95,0.48,6.31,0.89,9.51c0.6,4.76,0.19,9.64,0.22,14.47 c0,0.5-0.1,1.11,0.14,1.48c1.42,2.19,0.48,4.57,0.54,6.84c0.04,1.47-0.44,2.98-0.84,4.43c-0.28,0.99-0.67,2.02-1.29,2.82 c-0.83,1.08-1.77,2.01-1.64,3.52c0.05,0.49,0.15,1.21-0.11,1.46c-1.13,1.09-0.65,2.44-0.83,3.69c-0.31,2.06,0.16,4.04-0.82,6.24 c-0.96,2.19-0.26,5.14-0.16,7.75c0.02,0.5,0.87,0.95,0.93,1.47c0.29,2.77-0.03,5.53,0.85,8.32c0.65,2.07,0.26,4.49,0.21,6.75 c-0.04,2.22,0.51,4.38,0.15,6.66c-0.41,2.56-0.2,5.21-0.29,7.83c-0.01,0.43-0.02,1.12-0.27,1.26c-1.4,0.77-2.83,1.57-4.34,2.04 c-1.7,0.53-3.51,0.72-5.26,1.07c-0.15,0.02-0.35,0.06-0.42,0.16c-1.05,1.6-2.96,1.06-4.42,1.69c-1.82,0.79-3.98,0.8-5.99,1.16 c-0.29,0.05-0.67,0.1-0.83,0.3c-1.07,1.37-2.9,1.4-4.18,1.54c-2.35,0.25-4.8-0.49-7.21-0.82c-0.14-0.02-0.32-0.1-0.39-0.21 c-1.13-1.76-2.78-0.72-4.19-0.71c-0.45,0-0.86,0.75-1.36,0.9c-1.49,0.44-3.02,0.74-4.53,1.14c-0.22,0.06-0.35,0.43-0.57,0.58 c-0.67,0.47-1.36,1.26-2.06,1.29c-3.56,0.13-7.14,0.07-10.71,0.04c-0.34,0-0.71-0.21-1.04-0.37c-0.54-0.26-1.05-0.56-1.58-0.84 c-0.82-0.43-1.69-0.79-2.43-1.32c-0.47-0.34-0.64-1.1-1.12-1.39c-1.87-1.14-3.1-2.75-4.11-4.66c-0.29-0.55-1.05-1.17-1.64-1.22 c-2.71-0.22-5.54-0.58-7.69,1.72c-0.83,0.9-1.8,1.06-2.92,1.04c-0.38,0-0.87,0.04-1.14,0.26c-1.57,1.29-3.5,1.51-5.38,1.82 c-2.39,0.39-4.78,0.67-7.17,1.02c-0.22,0.03-0.39,0.29-0.61,0.39c-1.11,0.5-2.2,1.26-3.35,1.41c-2.09,0.25-3.01,0.98-2.64,3.04 c0.19,1.07,0.64,2.49,1.43,2.95c1.21,0.72,2.83,0.7,4.26,1.06c1.65,0.43,3.28,0.93,4.92,1.42c1.01,0.3,2.01,0.63,3.03,0.92 c1.88,0.54,3.74,1.35,5.66,1.53c3.04,0.28,6.13,0.18,9.19,0.18c13.52,0.02,27.05,0,40.57,0.04c1.41,0.01,3.03-0.62,4.13,0.94 c0.1,0.14,0.48,0.07,0.73,0.09c5.48,0.4,11.03-0.61,16.46,0.99c1.95,0.58,4.05,0.68,6.11,1c0.07,1.26,0.61,2.47-0.7,3.3 c-0.85,0.54-1.65,1.22-2.57,1.58c-2.2,0.85-4.44,1.57-6.68,2.32c-0.99,0.34-2.02,0.59-3.01,0.94c-1.67,0.58-3.32,1.21-4.98,1.82 c-0.23,0.09-0.44,0.21-0.66,0.31c-0.53,0.24-1.04,0.64-1.58,0.69c-5.18,0.48-10.35-0.17-15.61,0.68 c-5.76,0.93-11.79-0.18-17.64,1.1c-0.82,0.18-1.73-0.09-2.55,0.08c-1.8,0.37-3.61,0.77-5.32,1.42c-0.58,0.21-1.08,1.13-1.26,1.82 c-0.66,2.45,1.02,5.29,4.03,5.07c1.83-0.13,3.72,0.54,5.59,0.87c0.12,0.02,0.22,0.18,0.34,0.24c0.72,0.31,1.43,0.85,2.17,0.88 c2.51,0.11,5.03,0.09,7.54,0.03c1.18-0.03,2.56,0.41,3.33-1.08c0.07-0.15,0.56-0.11,0.86-0.11c5.22,0.01,10.44,0.02,15.66,0.05 c0.34,0,0.79,0,1,0.19c1.32,1.25,2.86,1.82,4.67,1.79c1.63-0.02,3.26,0.01,4.6,1.25c0.06,0.99-0.12,1.83-1.41,1.95 c-0.23,0.02-0.46,0.31-0.66,0.5c-1.32,1.33-2.56,2.77-3.99,3.98c-1.06,0.89-2.34,2.07-3.56,2.12c-2.5,0.1-4.06,2.03-6.3,2.6 c-1.31,0.34-2.46,1.45-3.98,1.52c-0.29,0.01-0.67,0.07-0.83,0.26c-1.11,1.31-2.62,1.66-4.2,1.76c-1.8,0.12-3.76-0.26-5.37,0.33 c-1.58,0.59-3.07,0.54-4.61,0.59c-1.96,0.05-3.92,0.02-5.88,0c-0.39,0-0.79-0.07-1.16-0.17c-0.83-0.22-1.64-0.59-2.48-0.71 c-2.61-0.36-5.24-0.64-7.85-0.96c-0.15-0.02-0.38-0.06-0.41-0.14c-0.54-1.36-1.74-0.98-2.71-0.99c-4.02-0.06-8.04-0.04-12.07-0.05 c-0.4,0-0.81,0-1.19-0.08c-1.18-0.25-2.34-0.57-3.51-0.81c-0.49-0.09-1.19,0.17-1.47-0.09c-1.49-1.32-3.25-0.64-4.88-0.82 c-0.45-0.05-1.2,0.06-1.3-0.14c-0.68-1.42-1.93-1.03-3.02-1.06c-2.06-0.05-5.27-2.58-6.24-4.39c-0.87-1.64-2.23-3.05-3.48-4.46 c-1.04-1.17-2.36-2.08-3.33-3.29c-0.87-1.07-1.16-2.84-2.21-3.49c-1.93-1.2-2.76-3.77-5.53-3.92c-0.11,0.08-0.58,0.28-0.75,0.63 c-0.28,0.54-0.63,1.29-0.45,1.77c0.48,1.3,1.57,2.45,1.78,3.76c0.36,2.21,2.01,3.73,2.59,5.88c0.45,1.67,1.26,3.48,2.41,5.08 c1.14,1.56,1.41,3.74,2.13,5.63c0.43,1.16,0.89,2.33,1.51,3.4c0.36,0.63,1.01,1.13,1.61,1.59c0.67,0.5,1.52,0.79,2.13,1.35 c0.78,0.7,1.25,1.83,2.11,2.32c1.81,1.02,4.06,1.07,5.77,2.38c0.07,0.06,0.21,0.06,0.3,0.04c2.43-0.53,4.36,1.08,6.06,2.12 c2,1.24,4.52,2.12,5.74,4.61c0.47,0.95,1.67,1.55,3.12,0.54c0.9-0.62,2.18-0.69,3.18-1.48c1.15-0.91,2.59-1.45,3.89-2.16 c0.34-0.18,0.65-0.55,0.97-0.56c2.21-0.07,4.53-0.5,6.59,0.05c1.65,0.44,3.29,0.44,4.91,0.75c3.34,0.63,6.68,1.23,10.11,1.01 c0.19-0.02,0.47-0.04,0.58,0.07c1.69,1.69,4.5-0.27,6.04,1.88c2.64-0.06,5.21,0.33,7.75,1.05c1.35,0.38,2.74,0.65,4.1,0.98 c0.13,0.03,0.21,0.2,0.34,0.27c1.18,0.58,2.33,1.28,3.57,1.7c1.36,0.47,2.81,0.68,4.22,1.01c0.12,0.03,0.22,0.16,0.34,0.24 c0.93,0.58,1.82,1.22,2.8,1.71c1.03,0.51,2.68,0.57,3.1,1.35c1.03,1.92,2.93,2.76,4.5,3.64c1.3,0.73,3.45,0.26,5.09-0.18 c0.46-0.12,0.44-2.05,0.6-3.16c0.06-0.34-0.03-0.71,0.02-1.05c0.29-1.88-1.12-3-1.84-4.46c-0.7-1.42-2.24-1.12-3.03-2.13 c-0.57-0.71-1.11-1.52-1.85-1.99c-1.99-1.26-4.2-2.07-5.98-3.79c-1.42-1.38-3.36-2.21-5.05-3.33c-0.53-0.36-0.97-0.86-1.6-1.43 c1.59-0.28,2.79-0.38,3.91-0.73c1.33-0.42,2.56-1.15,3.88-1.59c1.23-0.41,2.52-0.08,3.86-0.73c1.07-0.51,2.44-1.28,3.54-1.27 c4.9,0.06,9.87-1.42,14.74,0.77c1.85,0.84,4.1,0.89,6.19,1.08c2.2,0.2,4.42,0.08,6.63,0.19c1.39,0.07,2.87-0.36,3.15-1.52 c0.35-1.43-0.11-3.07-0.31-4.61c-0.05-0.35-0.43-0.86-0.75-0.94c-1.89-0.45-3.03-2.61-5.28-2.29c-0.29,0.05-0.76-0.44-0.98-0.79 c-0.55-0.87-1.04-1.78-1.46-2.72c-0.72-1.58-1.07-3.47-2.15-4.72c-1.03-1.21-1.01-2.65-1.64-3.91c-0.95-1.9,1.19-4.82,3.55-5.51 c1.64-0.47,2.56-1.92,3.11-3.23c0.56-1.3,1.48-2.16,2.47-2.65c1.95-1,3.13-2.23,2.85-4.48c-0.15-1.19,0.35-1.95,1.04-2.38 c1,0.29,1.75,0.57,2.54,0.71c0.68,0.12,1.65-0.21,2.05,0.15c1.42,1.25,3.06,0.73,4.59,0.79c1.64,0.07,2.82-1.17,2.72-2.83 c-0.14-2.32,0.71-4.76-1.17-6.9c-1.23-1.41-2.02-3.2-3.05-4.79c-0.22-0.34-0.72-0.52-0.87-0.87c-0.46-1.06-0.77-2.19-1.23-3.25 c-0.29-0.71-0.68-1.39-1.13-2.01c-1.1-1.56-2.04-3.14-1.53-5.37c1.49-0.04,2.78-0.09,3.89-1.32c1.1-1.21,1.2-2.49,1.25-3.92 c0.01-0.23,0.11-0.48,0.24-0.67c1.24-1.84,0.48-3.88,0.58-5.83c0.01-0.15-0.29-0.35-0.49-0.46c-1-0.56-2.03-1.05-3-1.64 c-0.5-0.3-0.84-0.89-1.35-1.13c-1-0.46-2.14-0.66-3.09-1.2c-0.51-0.28-0.94-1-1.07-1.59c-0.43-2.04-0.69-4.12-1.08-6.17 c-0.08-0.39-0.55-0.7-0.63-1.08c-0.19-0.93-0.56-2-0.26-2.78c0.2-0.56,1.73-1.24,2.07-1c1.34,0.91,2.76,0.55,4.13,0.75 c0.3,0.04,0.57,0.28,0.87,0.41c0.5,0.23,0.99,0.58,1.52,0.65c3.46,0.48,6.98-0.42,10.48,0.84c1.88,0.67,4.18,0.23,6.29,0.19 c0.47-0.01,1.28-0.37,1.34-0.69c0.2-1.06,0.29-2.2,0.09-3.25c-0.08-0.41-1.04-0.65-1.59-1c-0.18-0.12-0.3-0.34-0.49-0.47 c-1.59-1.12-3.47-1.86-4.58-3.59c-0.05-0.07-0.2-0.06-0.28-0.11c-0.71-0.43-1.45-0.81-2.11-1.31c-0.61-0.47-1.1-1.11-1.72-1.57 c-0.68-0.5-1.49-0.82-2.16-1.33c-0.65-0.49-1.14-1.21-1.81-1.67c-1.57-1.08-3.21-2.06-4.83-3.08c-0.55-0.35-1.1-0.73-1.69-1.01 c-0.82-0.38-1.8-0.53-2.49-1.06c-0.53-0.41-0.95-1.22-1.04-1.91c-0.29-2.18,0.44-4.47-0.96-6.53c-0.53-0.79-1.11-1.77-1.11-2.66 c-0.06-20.73-0.05-41.46-0.03-62.18c0-0.42,0.15-0.86,0.31-1.25c0.21-0.5,0.64-0.94,0.74-1.45c0.29-1.62,0.18-3.22,0.78-4.9 c0.83-2.34,0.88-4.99,1.09-7.52c0.17-1.95,0.05-3.92,0.11-5.88c0.01-0.47,0.2-0.93,0.37-1.38c0.2-0.51,0.68-0.99,0.69-1.49 c0.05-4.08,0.04-8.15,0.01-12.23c0-0.48-0.04-1.25-0.32-1.39c-0.99-0.49-0.7-1.33-0.78-2.08c-0.35-3.05-0.31-6.21-1.2-9.09 c-0.7-2.29-0.69-4.49-0.62-6.72c0.12-3.64-0.46-7.31,0.67-10.95c0.71-2.26,0.78-4.71,1.14-7.07c0.04-0.24,0.05-0.53,0.19-0.72 c1.27-1.67,1.08-3.79,1.66-5.67c0.44-1.39,0.1-3,0.26-4.5c0.1-0.93,0.2-2.16,0.8-2.68c1.42-1.23,1.05-2.71,1.11-4.18 c0.02-0.75,0.08-1.5,0.08-2.26c0-7.94,0-15.89-0.03-23.84c0-0.4-0.25-0.81-0.42-1.2c-0.21-0.5-0.6-0.97-0.64-1.48 c-0.1-1.3,0.06-2.63-0.09-3.92c-0.13-1.03-0.9-2.06-0.78-3.02c0.31-2.47-0.9-4.62-1.12-6.95c-0.02-0.22-0.23-0.41-0.33-0.63 c-0.25-0.52-0.62-1.03-0.7-1.58c-0.19-1.34,0.04-2.8-0.39-4.03c-0.8-2.24-1.62-4.42-1.62-6.84c0.01-17.65,0.01-35.31,0.01-52.97 c0-0.35,0.01-0.7,0-1.05c-0.02-1.05,0.41-1.5,1.54-1.48c2.96,0.07,5.93,0.14,8.89-0.02c1.36-0.08,2.79-0.5,3.99-1.12 c0.75-0.39,1.46-1.39,1.62-2.23c0.27-1.36,0.17-2.82,0.01-4.2c-0.06-0.53-0.66-1.12-1.16-1.45c-0.95-0.62-2-1.08-3.02-1.6 c-0.99-0.5-1.96-1.06-2.98-1.47c-1.78-0.73-3.61-1.35-5.4-2.06c-0.43-0.18-0.73-0.7-1.16-0.84c-2.24-0.68-2.37-0.81-2.37-3.03 c0.01-25.61,0-51.21,0.02-76.82c0-3.07,0.14-6.13,0.21-9.2c0.01-0.24,0.02-0.5,0.07-0.74c0.27-1.22,0.63-2.42,0.81-3.66 c0.37-2.55,0.64-5.13,0.97-7.69c0.02-0.18,0.12-0.4,0.26-0.51c1.25-1.01,1.6-2.31,1.7-3.89c0.22-3.29,0.67-6.56,1.04-9.84 c0.02-0.18,0.11-0.47,0.23-0.51c1.12-0.39,0.81-1.36,0.9-2.16c0.05-0.55-0.08-1.13,0.06-1.65c0.48-1.75,1.32-3.45,1.53-5.23 c0.29-2.37,0.65-4.96-0.01-7.16c-0.63-2.1-0.45-4.08-0.64-6.11c-0.06-0.75,0.14-1.67-0.22-2.22c-1.07-1.62-0.53-3.36-0.68-5.04 c-0.04-0.45,0-0.91,0-1.36c-0.04-11.77-0.07-23.54-0.12-35.32c0-0.74,0.31-1.64-0.76-2.05c-0.18-0.07-0.26-0.51-0.3-0.79 c-0.28-1.71-0.53-3.42-0.79-5.13c-0.02-0.14-0.04-0.34,0.04-0.43c0.85-1.09,1.42-2.52,3.18-2.48c0.48,0.01,1.01-0.1,1.45-0.3 c1.93-0.87,3.83-1.82,5.76-2.7c0.91-0.41,1.88-0.69,2.8-1.06c0.79-0.32,1.87-0.46,2.28-1.06c1.04-1.51,2.94-0.65,4.08-1.75 c0.2-0.2,0.94-0.09,1.27,0.13c1.02,0.68,1.91,1.57,2.95,2.21c0.97,0.6,2.05,1.01,3.11,1.45c0.77,0.32,1.57,0.54,2.6,0.88 c0.08-0.06,0.43-0.5,0.88-0.68c1.99-0.8,2.28-1.19,2.32-3.33c0.02-0.8-0.16-2.05,0.24-2.3c1.05-0.65,0.8-1.53,0.84-2.37 c0.1-1.85,0.1-3.71,0.2-5.57c0.02-0.46,0.14-1,0.42-1.35c1.19-1.48,2.43-2.92,3.72-4.33c1.85-2.02,3.76-3.98,5.62-5.99 c1.2-1.3,2.41-2.58,3.51-3.96c0.91-1.15,2.34-1.82,2.73-3.48c0.22-0.96,1.04-1.77,1.58-2.66c1.01-1.68,2.08-3.34,2.99-5.07 c0.86-1.63,1.53-3.36,2.33-5.01c0.12-0.24,0.55-0.48,0.82-0.47c0.85,0.06,1.7,0.23,2.56,0.36c1.64-0.37,3.34-0.64,5.04-0.61 c2.2,0.04,4.18-0.16,5.25-2.55c-0.42-0.66-0.75-1.53-1.37-2.07c-1.26-1.13-2.64-2.08-2.54-4.07c0.02-0.43-0.29-0.97-0.6-1.32 c-0.98-1.09-1.88-2.23-2.27-3.68c-0.25-0.92-0.45-1.85-0.7-2.92c0.1-0.16,0.47-0.49,0.53-0.87c0.41-2.81,0.64-5.66,1.19-8.44 c0.36-1.78,1.14-3.48,1.81-5.19c0.13-0.33,0.58-0.58,0.92-0.78c1.21-0.7,2.72-1.11,3.58-2.1c0.87-1,1.89-1.43,2.93-2.05 C215.346,112.2,216.377,111.28,216.086,109.69z M111.437,192.42c-46.57,0-84.32-37.75-84.32-84.32c0-46.56,37.75-84.31,84.32-84.31 c46.56,0,84.31,37.75,84.31,84.31C195.747,154.67,157.997,192.42,111.437,192.42z",
      "M220.041,157.85c-0.55-1.59-1.99-2.91-3.19-4.22c-1.44-1.55-3.06-2.93-4.54-4.44 c-0.94-0.97-2.09-1.91-2.57-3.1c-0.71-1.75-2.03-2.69-3.39-3.77c-0.82-0.65-1.45-1.6-2.05-2.48c-0.5-0.74-0.65-1.96-1.31-2.31 c-1.12-0.62-0.92-1.41-0.84-2.26c0.08-0.9-0.07-2.1,0.44-2.6c0.78-0.78,0.7-1.59,0.82-2.45c0.08-0.56-0.1-1.25,0.16-1.69 c1.35-2.35-0.12-5.35,1.81-7.52c0.27-4.36,0.77-8.72,0.74-13.07c-0.02-4.6-0.55-9.19-0.86-13.78c-0.02-0.23-0.04-0.6-0.18-0.67 c-1.2-0.58-0.74-1.69-0.88-2.62c-0.3-2.03-0.62-4.06-0.94-6.09c-0.03-0.17-0.16-0.32-0.24-0.49c-0.24-0.54-0.6-1.06-0.69-1.62 c-0.13-0.75,0.01-1.54-0.06-2.3c-0.14-1.56,0.39-3.22-0.79-4.65c-0.22-0.28-0.2-1.14,0.05-1.36c1.19-1.08,1.96-2.58,3.68-3.18 c0.9-0.32,1.87-1.42,2.11-2.35c0.36-1.38,0.09-2.92,0.09-4.59c-1.73,0-3.3,0.02-4.87,0c-0.36-0.01-0.98-0.02-1.05-0.2 c-0.46-1.09-1.43-0.72-2.21-0.93c-0.6-0.16-1.47-0.3-1.69-0.73c-0.65-1.26-1.95-1.91-2.51-3.35c-0.54-1.39-1.94-2.48-3.06-3.6 c-1.57-1.58-3.29-3.01-4.82-4.63c-0.9-0.96-1.45-2.23-2.3-3.24c-1.37-1.63-3.13-2.84-3.93-5.04c-0.75-2.04-0.93-2.28,0.91-3.34 c1.13-0.65,2.46-1.26,3.14-2.27c0.61-0.91,1.38-1.33,2.18-1.58c1.22-0.36,1.87-1.27,2.04-2.22c0.26-1.52,0.07-3.12,0.07-4.65 c-0.7-0.18-1.53-0.16-1.73-0.5c-0.54-0.93-1.34-0.88-2.1-0.8c-2.26,0.22-4.43-0.1-6.81,0.91c-2.5,1.06-5.7,0.06-8.58,0.97 c-1.39,0.44-3.04,0.01-4.63-0.49c-1.72-0.54-3.23-1.39-4.81-2.12c-0.53-0.24-0.86-0.92-1.39-1.21c-1.65-0.91-3.34-1.75-5.03-2.58 c-1.13-0.55-2.27-1.12-3.46-1.5c-1.3-0.42-2.67-0.64-4.01-0.96c-0.12-0.03-0.2-0.18-0.32-0.25c-0.49-0.28-0.96-0.69-1.5-0.81 c-1.58-0.38-3.18-0.64-4.78-0.96c-0.14-0.02-0.31-0.04-0.39-0.13c-1.28-1.53-3.33-0.93-4.88-1.77c-0.54-0.3-1.16-0.25-1.76-0.8 c-0.74-0.69-1.95-0.86-2.95-1.27c-0.31-0.13-0.57-0.36-0.88-0.52c-1.82-0.91-2.44-3.41-4.85-3.63c-0.37-0.03-0.84-0.97-0.93-1.54 c-0.16-0.97-0.04-2-0.04-2.77c-1.29-1.4-2.71-1.66-4.31-1.5c-1.04,0.1-3.26,1.89-3.77,2.79c-0.68,1.21-0.49,3.06-2.5,3.4 c-0.54,0.1-1.02,0.85-1.41,1.39c-0.58,0.82-1.24,1.27-2.3,1.24c-2.01-0.06-4.03-0.04-6.04,0.02c-0.52,0.02-1.03,0.31-1.53,0.51 c-0.4,0.16-0.75,0.5-1.15,0.55c-3.09,0.4-6.2,0.74-9.3,1.11c-0.14,0.02-0.31,0.01-0.41,0.1c-1.74,1.46-4.05,1.26-6.01,1.52 c-2.02,0.27-3.57,1.32-5.4,1.82c-1.27,0.35-2.45,1.02-3.69,1.51c-2.06,0.82-4.13,1.61-6.2,2.4c-0.64,0.24-1.35,0.37-1.91,0.73 c-1.46,0.94-2.83,2.01-4.28,2.97c-1.07,0.72-2.2,1.37-3.31,2.04c-0.98,0.59-1.98,1.14-2.94,1.76c-0.49,0.32-0.89,0.79-1.38,1.11 c-0.56,0.35-1.41,0.47-1.71,0.95c-0.49,0.79-1.09,1.06-1.92,1.26c-0.56,0.14-1.09,0.61-1.52,1.04c-0.91,0.91-1.7,1.92-2.6,2.84 c-1.47,1.52-3.01,2.96-4.47,4.49c-1.04,1.1-1.94,2.34-2.99,3.42c-1.05,1.07-2.23,2.02-3.34,3.03c-0.16,0.15-0.42,0.34-0.42,0.49 c0.1,1.74-2.06,1.97-2.29,3.47c-1.95,0.29-1.67,2.42-2.79,3.49c-1.16,1.11-1.61,2.94-2.39,4.45c-0.36,0.68-0.62,1.51-1.17,1.98 c-0.96,0.81-1.45,1.74-1.52,2.96c-0.02,0.38-0.02,0.81-0.2,1.11c-0.84,1.45-1.74,2.87-2.62,4.29c-0.4,0.63-1.03,1.22-1.16,1.9 c-0.25,1.29-0.94,1.6-2.14,1.73c-2.53,0.27-5.17-0.85-7.62,0.97c-0.78,0.57-1.29,0.9-1.28,1.82c0.02,1.15,0.04,2.3,0.09,3.45 c0.01,0.28,0.02,0.64,0.18,0.82c0.91,1.01,1.87,1.99,2.82,2.97c0.3,0.31,0.66,0.56,0.92,0.89c0.54,0.7,0.91,1.58,1.57,2.11 c1.32,1.05,1.76,2.7,0.91,4.16c-0.19,0.32-0.31,0.7-0.37,1.07c-0.33,2.36-0.19,4.68-0.93,7.12c-1.04,3.39-0.76,7.19-0.99,10.82 c-0.084,1.3-0.028,2.609-0.004,3.91c0.006,0.347,0.042,0.913,0.113,1.253c0.215,1.031,0.607,2.038,0.712,3.077 c0.13,1.18,0.02,2.39,0.08,3.59c0.02,0.39,0.24,0.77,0.39,1.15c0.19,0.5,0.5,0.97,0.6,1.49c0.36,1.88,0.66,3.78,0.98,5.67 c0.02,0.14,0.04,0.36,0.12,0.39c1.31,0.58,0.79,1.78,0.95,2.74c0.08,0.47-0.04,1.09,0.21,1.4c1.07,1.27,0.76,2.98,1.64,4.41 c0.92,1.49,0.83,3.53,1.95,5.15c1.07,1.53,1.11,3.52,2.09,5.23c1.14,2,1.76,4.33,3.12,6.29c0.99,1.43,1.86,2.94,2.81,4.39 c0.43,0.64,1.05,1.17,1.38,1.86c0.32,0.66,0.52,1.46,0.46,2.17c-0.02,0.21-1.11,0.37-1.72,0.47c-0.89,0.14-2.03-0.1-2.64,0.37 c-1.27,0.99-2.58,1.6-4.16,1.75c-0.27,0.02-0.66,0.12-0.78,0.31c-0.74,1.2-2.18,0.94-3.19,1.62c-0.9,0.6-1.97,0.95-2.95,1.45 c-0.13,0.06-0.15,0.33-0.22,0.5c-0.29,0.61-0.57,1.22-0.88,1.88c0.22,0.14,0.66,0.26,0.73,0.49c0.44,1.56,1.62,1.71,2.95,1.69 c6-0.1,12,0.28,17.98-0.6c2.02-0.3,2.35-0.04,2.27,1.87c-0.01,0.33,0.33,0.65,0.42,1c0.28,1.08,0.93,2.18-0.3,3.18 c-0.72,0.59-1.28,1.39-1.97,2.04c-0.57,0.55-1.16,1.13-1.84,1.51c-1.53,0.85-3.29,1.33-4.37,2.87c-0.11,0.16-0.38,0.21-0.57,0.32 c-1.53,0.89-3.3,1.54-4.54,2.74c-1.67,1.63-4.03,1.83-5.72,3.3c-0.62,0.53-1.4,0.9-2.1,1.34c-0.35,0.22-0.68,0.57-1.05,0.64 c-1.67,0.33-2.61,1.81-2.12,3.47c0.38,1.29,2.05,1.63,3.29,1.08c1.5-0.67,2.83-2,4.72-1.6c0.23,0.05,0.48-0.03,0.71,0.01 c3.29,0.59,6.38-0.81,9.6-0.9c0.14,0,0.37-0.02,0.4-0.09c0.59-1.47,1.9-0.82,2.92-1.07c1.08-0.27,2.31-0.48,3.12-1.14 c1.34-1.1,3.01-1.42,4.43-1.52c2.07-0.14,3.55-1.64,5.54-1.71c0.53-0.02,1.04-0.3,1.55-0.46c0.45-0.14,0.92-0.22,1.33-0.43 c0.95-0.49,1.87-1.48,2.8-1.47c2.17,0.03,4.33,0.51,6.5,0.83c0.1,0.02,0.16,0.24,0.27,0.29c0.56,0.28,1.11,0.61,1.7,0.78 c1.28,0.37,2.98,0.25,3.8,1.06c1.41,1.37,3.24,0.88,4.73,1.73c0.92,0.53,2.42-0.25,3.25,1.05c0.11,0.17,0.55,0.21,0.82,0.18 c3.28-0.45,5.4,2.03,8.05,3.18c1.02,0.44,1.9,1.2,2.94,1.6c2.28,0.87,4.77,0.75,7.12,1.85c2.1,0.99,4.76,1.09,7.16,1.03 c6.72-0.19,13.49,0.95,20.17-0.71c1.13-0.28,2.39-0.08,3.58-0.17c0.39-0.02,0.78-0.21,1.15-0.37c0.47-0.21,0.91-0.6,1.39-0.67 c1.14-0.15,2.49,0.21,3.39-0.3c1.52-0.84,2.91-0.42,4.47-0.47c0.03,0.81,0.09,1.47,0.09,2.13v170.39c0,1.92,0.01,3.84-0.01,5.76 c0,0.42,0.03,1.13-0.17,1.22c-1.48,0.66-0.88,1.94-0.93,2.97c-0.1,1.67-0.15,3.36-0.02,5.03c0.14,1.95-0.76,4.1,1,5.79 c0.14,0.13,0.07,0.46,0.13,0.69c0.32,1.16,0.64,2.31,1,3.45c0.05,0.18,0.32,0.33,0.52,0.42c1.35,0.57,1.68,1.45,1.02,2.81 c-0.14,0.29-0.42,0.71-0.31,0.88c1.11,1.81,0.69,3.83,0.63,5.73c-0.1,2.98-0.59,5.94-0.76,8.93c-0.14,2.43-0.03,4.89-0.08,7.33 c-0.01,0.6,0.23,1.41-0.8,1.57c-0.12,0.02-0.28,0.37-0.29,0.57c-0.16,3.08-0.36,6.15-0.72,9.24c-0.59,4.97-0.21,10.05-0.21,15.09 c0,44.18,0.01,88.36,0,132.54c0,6.23-0.02,12.47-0.12,18.7c-0.03,1.37,0.13,2.67-0.79,4.12c-0.92,1.43-0.93,3.56-1.02,5.39 c-0.16,3.11-0.07,6.24-0.11,9.36c-0.01,0.51-0.02,1.4-0.24,1.47c-1.21,0.4-0.8,1.35-0.89,2.13c-0.08,0.62-0.03,1.28-0.26,1.84 c-1.03,2.54-0.86,5.31-0.25,7.71c0.44,1.74,0.41,3.39,0.61,5.08c0.09,0.71-0.17,1.75,0.22,2.08c1.12,0.97,0.85,2.16,0.86,3.3 c0.05,10.08,0.08,20.15,0.07,30.22c0,1.21,0.33,2.59-1.03,3.45c-0.18,0.11-0.18,0.53-0.24,0.8c-0.3,1.45-0.59,2.91-0.92,4.36 c-0.04,0.18-0.32,0.29-0.45,0.47c-0.23,0.34-0.53,0.68-0.61,1.06c-0.36,1.69-0.64,3.38-0.96,5.08c-0.02,0.13-0.03,0.36-0.11,0.39 c-1.37,0.57-0.82,1.77-0.87,2.73c-0.07,1.48,0.09,2.98-0.06,4.45c-0.07,0.64-0.56,1.58-1.07,1.74c-1.53,0.48-3.39-0.22-4.66,1.28 c-6.11,0.05-12.2-0.04-18.29,0.83c-3.57,0.51-7.27,0.09-10.91,0.11c-0.52,0-1.34-0.08-1.52,0.2c-0.88,1.4-2.2,0.79-3.34,0.85 c-1.68,0.09-3.36,0.01-5.03,0.03c-2.22,0.03-2.87,0.61-2.88,2.52c-0.01,1.74,1.56,3.66,3.06,3.67c2.44,0.02,4.89-0.03,7.33,0.03 c0.54,0.01,1.1,0.29,1.59,0.56c0.66,0.35,1.23,1.13,1.88,1.17c2.77,0.19,5.5,0.3,8.27,0.8c3.4,0.62,6.97,0.26,10.46,0.39 c1.31,0.04,2.77-0.51,3.81,0.86c0.13,0.16,0.55,0.11,0.83,0.16c1.98,0.31,3.97,0.57,5.93,0.94c1.09,0.21,2.13,0.61,3.19,0.93 c0.13,0.04,0.23,0.15,0.35,0.21c0.62,0.31,1.25,0.59,1.87,0.9c0.71,0.37,1.79,0.59,2.05,1.17c0.56,1.23,0.85,2.64,0.96,4.01 c0.19,2.53,0.15,5.07,0.25,7.61c0.01,0.38,0.22,0.77,0.39,1.12c0.21,0.43,0.67,0.83,0.68,1.24c0.06,2.54,0.03,5.08,0.03,8.02 c-1.66,0.18-3.24,0.45-4.82,0.5c-2.92,0.07-5.85,0-8.77,0.03c-0.79,0-1.59,0.13-2.49,0.22c0.04,1.62-0.73,3.04,0.83,4.49 c1.37,1.26,2.42,2.7,4.52,2.55c0.429-0.031,0.861,0.057,1.262,0.211c2.119,0.81,4.149,1.889,6.518,1.859 c2.647-0.022,3.007,0.673,2.932,3.776c-0.017,0.708,0.025,1.415,0.061,2.122c0.065,1.295-0.44,1.831-1.823,1.812 c-3.69-0.07-7.38-0.03-11.07,0c-0.56,0.01-1.42-0.02-1.62,0.29c-0.74,1.16-1.8,0.84-2.78,0.84c-2.78,0.02-5.56,0.01-8.34,0.01 c-2.64,0-5.27,0.06-7.9-0.01c-1.15-0.03-2.08,0.55-2.33,1.39c-0.7,2.4,0.27,5.56,3.59,5.63c1.2,0.02,2.77-0.38,3.51,0.22 c1.4,1.15,2.84,0.75,4.28,0.95c1.97,0.27,3.93,0.57,5.9,0.89c0.17,0.03,0.3,0.3,0.46,0.45c0.91,0.82,1.76,1.71,3.21,1.47 c0.49-0.09,1.07,0.16,1.57,0.35c0.51,0.19,0.95,0.66,1.45,0.73c3.2,0.43,6.4,0.78,9.69,1.16c0.04,0.17,0.13,0.39,0.14,0.62 c0.03,1.82,0.03,3.65,0.06,5.47c0.01,0.76-0.1,1.57,0.11,2.28c0.5,1.64,0.12,2.28-1.61,2.28c-4.12,0-8.24-0.01-12.36,0.02 c-0.7,0.01-1.77,0-2.02,0.4c-0.59,0.96-1.36,0.7-2.11,0.73c-1.81,0.07-3.64,0.04-5.44,0.19c-1.13,0.1-2.23,0.64-3.35,0.64 c-8.67,0.06-17.35,0.03-26.02,0.05c-0.66,0-1.71-0.04-1.89,0.3c-0.55,1.03-1.38,0.79-2.18,0.88c-1.31,0.17-2.07,1-2.12,2.29 c-0.1,2.71,1.38,4.42,4.05,4.64c0.66,0.06,1.34,0.06,2.01,0.06c11.59,0,23.19-0.04,34.79,0.04c2.11,0.01,4.23,0.53,6.34,0.84 c0.16,0.02,0.3,0.17,0.46,0.26c0.46,0.24,0.9,0.61,1.38,0.7c2.05,0.38,4.12,0.68,6.18,1.02c0.17,0.02,0.32,0.14,0.49,0.22 c0.59,0.27,1.16,0.71,1.77,0.77c1.78,0.18,2.26,0.55,2.18,2.39c-0.13,2.89,0.3,5.79-0.56,8.69c-0.54,1.82,0.44,4.02-1.28,5.61 c-1.07,0.99-1.03,2.72-2.45,3.52c-0.6,0.33-1.11,0.94-1.49,1.53c-0.84,1.31-1.52,2.72-2.37,4.02c-0.39,0.59-1.08,0.97-1.53,1.53 c-0.82,1.05-1.77,2.07-2.29,3.27c-0.73,1.7,0.72,3.6,2.56,3.61c1.2,0,2.39-0.07,3.59-0.14c0.28-0.01,0.76-0.06,0.79-0.18 c0.37-1.48,1.9-1.22,2.79-1.6c1.47-0.63,2.91-1.2,4.18-2.2c0.6-0.47,1.56-0.65,1.91-1.24c0.65-1.1,0.98-2.39,1.44-3.6 c0.17-0.43,0.37-0.84,0.5-1.28c0.4-1.41,0.82-2.81,1.14-4.24c0.15-0.69,0.22-1.46,0.08-2.14c-0.28-1.36,0.93-1.72,1.44-2.55 c0.84-1.38,1.53-1.33,2.36-0.08c0.04,0.06,0.18,0.09,0.27,0.09h5.12c-0.27-2.27,0.54-4.2-0.94-6.39c-1.18-1.72-2.35-3.95-2.25-6.37 c0.02-0.28-0.07-0.57-0.13-0.85c-0.31-1.36-0.62-2.72-0.98-4.33c4.5,0,8.43-0.01,12.35,0.02c0.27,0,0.59,0.24,0.78,0.46 c0.82,0.96,1.75,1.44,3.09,1.4c2.73-0.08,5.46,0.06,8.19,0.06c14.24,0.01,28.47,0,42.7,0c0.67,0,1.35,0.02,2.01-0.07 c0.32-0.05,0.75-0.28,0.88-0.55c0.69-1.38,1.24-2.78,1.07-4.42c-0.22-2-0.91-2.79-2.91-2.81c-2.59-0.03-5.17,0-7.76-0.03 c-0.4,0-0.82-0.09-1.21-0.22c-0.79-0.28-1.56-0.86-2.35-0.87c-4.08-0.1-8.15-0.05-12.22-0.06c-0.39,0-0.91,0.14-1.13-0.05 c-1.49-1.3-3.27-0.63-4.92-0.82c-1.42-0.16-3.03,0.59-4.17-0.93c-0.17-0.22-0.72-0.18-1.1-0.18c-1.29-0.03-2.58-0.02-3.86-0.03 c-0.63,0-1.49,0.23-1.83-0.09c-1.49-1.41-3.58-0.43-5.29-1.62c-1.47-1.03-3.79-0.13-5.71-1.05c-1.26-0.6-2.87,0.1-4.29-1.07 c-1.64-1.35-3.9-1.12-5.98-1.07c-1.17,0.02-1.96-0.78-2.01-1.96c-0.02-0.61,0-1.22,0-1.93c0.7-0.04,1.27-0.05,1.83-0.12 c0.31-0.04,0.62-0.16,0.9-0.3c0.48-0.24,0.93-0.73,1.42-0.78c3.66-0.32,7.33-0.56,10.99-0.82c0.05-0.01,0.1-0.01,0.15-0.01 c1.17-0.12,2.41-1.19,2.51-2.35c0.1-1.23,0.02-2.47,0.02-3.7c-1.73-0.36-3.3-0.9-4.9-0.98c-3.01-0.13-6.03,0-9.05,0.03 c-0.43,0-0.99-0.06-1.25,0.17c-1.07,0.95-2.32,0.59-3.51,0.66c-1.57,0.08-2.62-0.97-2.97-2.16c-0.34-1.18-0.19-2.67,0.24-3.85 c0.41-1.13,3.21-1.2,4.42-0.44c0.97,0.61,2.01,1.16,3.09,1.52c0.79,0.26,1.7,0.21,2.56,0.22c2.42,0.05,3.28-0.79,3.32-3.21 c0.02-1.15,0.11-2.31-0.02-3.45c-0.11-0.94-0.49-1.85-0.77-2.77c-0.35-1.1-0.72-2.18-1.14-3.45c0.69-0.05,0.96-0.09,1.24-0.09 c4.31-0.08,8.62-0.14,12.93-0.23c0.51-0.01,1.03-0.12,1.52-0.26c0.68-0.19,1.33-0.66,1.99-0.67c6.85-0.05,13.71-0.02,20.56-0.04 c0.71,0,1.61,0.13,2.1-0.23c1.18-0.87,2.44-0.56,3.67-0.62c1.29-0.05,2.6,0.05,3.87-0.13c0.76-0.11,1.42-0.83,2.18-0.93 c2.31-0.3,4.64,0.04,6.98-0.78c1.36-0.48,1.89-0.92,1.89-2.21c-0.01-1.05,0-2.09,0-3.07c-1.98-0.4-3.74-0.82-5.52-1.07 c-1.03-0.15-2.1-0.02-3.15-0.04c-0.33,0-0.87,0.04-0.95-0.13c-0.68-1.28-1.88-0.93-2.9-0.94c-4.36-0.05-8.72-0.02-13.08-0.03 c-0.42,0-0.84-0.06-1.25-0.16c-0.85-0.21-1.69-0.65-2.53-0.66c-3.74-0.08-7.48-0.04-11.22-0.07c-0.39,0-0.81-0.11-1.19-0.25 c-0.65-0.26-1.27-0.76-1.93-0.82c-1.661-0.151-3.335-0.019-5.007-0.073c-0.629-0.021-1.638-0.204-2.243-0.375 c-0.66-0.186-1.321-0.376-1.99-0.432c-1.57-0.13-3.16-0.02-4.74-0.05c-0.36,0-0.73-0.1-1.06-0.22c-0.75-0.28-1.46-0.83-2.21-0.87 c-2.29-0.12-4.62,0.13-6.89-0.13c-1-0.11-2.34-0.9-2.73-1.74c-0.4-0.87-0.13-2.37,0.4-3.27c0.641-1.095,1.837-1.878,2.791-2.802 c0.176-0.17,0.314-0.377,0.406-0.604c0.418-1.034,0.692-2.09,1.883-2.644c0.49-0.22,0.73-0.96,1.09-1.46 c0.58-0.8,1.01-1.83,1.79-2.34c1.34-0.86,2.7-1.8,4.39-2.05c0.94-0.14,2.19-0.41,2.65-1.07c0.83-1.21,2.16-0.98,3.16-1.63 c1.45-0.94,3.1-1.57,4.65-2.39c0.2-0.1,0.36-0.48,0.37-0.73c0.03-1.66,0.02-3.32,0.02-5.1c-1.93,0-3.73-0.2-5.46,0.05 c-1.77,0.26-3.54,0.82-5.19,1.53c-0.95,0.41-1.55,0.46-2.52,0.01c-1.67-0.76-3.21-2.09-5.31-1.62c-0.77,0.17-1.62,0.05-2.43,0.02 c-1.31-0.03-2.01-0.77-2.04-2.07c-0.03-1.1,0.24-2.39-0.24-3.26c-0.82-1.47-0.5-2.93-0.57-4.4c-0.07-1.35,0.57-1.94,1.93-1.96 c1.81-0.04,3.65,0.03,5.45-0.16c1.45-0.15,2.85-0.78,4.3-0.91c2.1-0.2,4.21-0.09,6.32-0.19c5.64-0.27,11.27-0.58,16.91-0.89 c0.29-0.01,0.59-0.18,0.87-0.31c0.46-0.22,0.9-0.66,1.36-0.68c2.87-0.12,5.74-0.18,8.61-0.21c1.86-0.01,3.49-0.46,4.72-1.98 c0.73-0.91,0.33-3.4-0.5-3.95c-1.54-1.02-3.21-0.87-4.89-0.91c-0.4-0.01-0.81-0.11-1.19-0.25c-0.76-0.27-1.48-0.83-2.23-0.85 c-3.214-0.102-6.428-0.038-9.642-0.061c-0.354-0.003-0.711-0.029-1.053-0.122c-0.859-0.234-1.683-0.63-2.544-0.697 c-1.48-0.12-2.97-0.01-4.46-0.04c-0.35,0-0.72-0.1-1.05-0.23c-0.7-0.28-1.36-0.79-2.07-0.87c-1.37-0.14-2.78,0.05-4.16-0.06 c-4.36-0.36-8.78,0.74-13.14-0.72c-1.01-0.34-1.88-0.84-2.7-1.35c-0.51-0.31-0.85-1.41-0.73-2.06c0.1-0.55,0.9-1.24,1.51-1.38 c1.69-0.39,3.52,0.23,5.11-1.2c0.68-0.6,1.73-0.79,2.03-1.87c0.46-1.59,0.03-3.2-1.02-4.15c-1.15-1.05-2.8-1.57-4.3-2.17 c-0.95-0.37-1.49-0.84-1.48-1.89c0.03-1.58,0.02-3.17-0.01-4.75c-0.01-0.57,0.08-1.42-0.24-1.65c-1.34-0.97-1.03-2.35-1.03-3.6 c-0.03-12.57-0.2-25.14,0.09-37.7c0.09-4.05-0.94-8.2,0.93-12.27c0.93-2.02,0.71-4.58,1.03-6.89c0.16-1.24-0.47-2.69,1-3.6 c0.14-0.09,0.09-0.54,0.09-0.83c0-4.12,0.01-8.25-0.02-12.37c0-0.41-0.16-0.82-0.29-1.22c-0.19-0.59-0.54-1.16-0.6-1.77 c-0.36-3.45-0.65-6.9-0.98-10.35c-0.03-0.31-0.24-0.6-0.38-0.89c-0.22-0.51-0.58-1-0.66-1.53c-0.24-1.69,0.47-3.51-0.81-5.07 c-0.19-0.23-0.19-0.89,0-1.1c1.13-1.21,0.66-2.69,0.81-4.07c0.03-0.33-0.01-0.85,0.17-0.94c1.18-0.61,0.78-1.71,0.9-2.64 c0.31-2.41,0.6-4.82,0.92-7.23c0.02-0.17,0.16-0.32,0.24-0.48c0.28-0.64,0.56-1.28,0.85-1.91c0.32-0.7,0.59-1.93,1-1.98 c1.63-0.19,2.43-1.42,3.43-2.35c1.11-1.02,1.99-2.29,3.34-3.88c1.88-0.27,4.43-0.62,6.97-0.99c0.244-0.035,0.634-0.127,0.864-0.214 c1.441-0.546,2.865-1.399,4.326-1.486c2.42-0.16,3.88-1.4,5.1-3.21c0.42-0.63,0.74-1.32,1.14-1.95c0.73-1.13,0.46-2.45-0.7-3.13 c-1.06-0.64-2.14-1.26-3.22-1.86c-0.79-0.43-1.66-0.72-2.39-1.23c-1.235-0.87-2.388-1.874-3.593-2.814 c-0.497-0.388-1.371-0.934-1.933-1.221c-0.971-0.497-1.952-0.974-2.934-1.465c-1-0.5-2.02-0.97-3.01-1.5 c-1.6-0.84-3.21-1.67-4.75-2.6c-0.37-0.23-0.71-0.84-0.72-1.29c-0.12-4.45-0.14-8.91-0.24-13.37c-0.01-0.63-0.24-1.27-0.47-1.87 c-0.4-1.04-1.01-2.01-1.27-3.07c-0.41-1.62-0.52-3.32-0.9-4.95c-0.19-0.8-1.03-1.52-1.04-2.28c-0.03-2.59-1.5-4.95-1.05-7.62 c0.23-1.35,0.07-2.78,0.01-4.17c-0.02-0.49-0.22-0.99-0.41-1.46c-0.18-0.47-0.63-0.91-0.64-1.37c-0.1-5.89-0.19-11.79-0.2-17.69 c-0.01-43.36-0.01-86.72,0.01-130.09c0-3.59,0.1-7.19,0.18-10.78c0-0.35,0.13-0.72,0.28-1.04c0.23-0.52,0.69-0.98,0.75-1.51 c0.14-1.13-0.01-2.31,0.15-3.44c0.21-1.41,0.24-3.06,1.01-4.12c1.23-1.69,0.93-3.66,1.6-5.44c0.86-2.26-0.54-4.93,1.14-7.29 c1.15-1.62,1.74-3.65,2.56-5.5c0.27-0.59,0.41-1.24,0.72-1.81c0.54-1.02,1.19-1.98,1.75-2.99c0.58-1.04,1.14-2.09,1.63-3.17 c0.67-1.52,2.22-1.88,3.43-2.66c0.92-0.59,2.03-0.89,3.04-1.36c1.51-0.69,3.02-1.38,4.5-2.12c0.5-0.26,1.18-0.59,1.33-1.04 c0.46-1.4,0.79-2.85,1.02-4.31c0.13-0.82-0.4-1.39-1.27-1.39c-3.26,0-6.51,0.03-9.77,0.06c-0.24,0-0.51,0-0.7,0.11 c-2.29,1.29-4.7,0.26-7.06,0.66c-0.05-0.53-0.1-0.81-0.1-1.1c0-8.53,0.13-17.08-0.04-25.61c-0.18-8.49,0.86-17.02-0.84-25.46 c-0.17-0.87-0.26-1.75-0.48-2.61c-0.13-0.53-0.56-0.99-0.63-1.51c-0.16-1.28,0.11-2.69-0.33-3.83c-0.93-2.37-0.35-3.87,2.08-4.61 c1.47-0.44,2.09-2.42,3.94-2.27c0.03,0,0.06-0.17,0.13-0.23c0.85-0.86,1.58-2.12,2.61-2.47c1.65-0.55,2.44-1.96,3.72-2.84 c0.98-0.67,1.86-1.5,2.82-2.2c0.62-0.46,1.31-0.81,1.96-1.23c0.66-0.42,1.31-0.86,1.95-1.31c0.27-0.2,0.49-0.46,0.76-0.67 c0.8-0.63,1.65-1.2,2.4-1.88c1.08-0.97,2.05-2.05,3.13-3.03c1.21-1.1,2.77-1.94,3.64-3.25c1.25-1.87,2.53-3.64,4.13-5.24 c1.47-1.47,2.88-3.08,3.97-4.84c0.72-1.18,2.37-1.65,2.4-3.29c0-0.06,0.14-0.14,0.22-0.16c1.32-0.35,2.61-0.84,3.95-1 c1.36-0.16,2.93-0.39,3.93,0.85c1.2,1.51,2.76,0.97,4.22,1.05c0.96,0.06,1.93,0.15,2.88,0.04c2.29-0.27,4.18,0.69,6.06,1.78 c0.68,0.4,1.4,0.75,2.09,1.13c0.92,0.51,1.83,1.03,2.85,1.6c0-0.01,0.07-0.17,0.19-0.27c0.97-0.86,2.45-1.54,2.79-2.6 C220.411,161.37,220.561,159.38,220.041,157.85z M111.437,192.42c-43.96,0-80.06-33.63-83.96-76.57c-0.27-0.72-0.3-1.53-0.18-2.4 c-0.12-1.77-0.18-3.55-0.18-5.35c0-46.56,37.75-84.31,84.32-84.31c46.56,0,84.31,37.75,84.31,84.31 C195.747,154.67,157.997,192.42,111.437,192.42z",
      "M230.071,128.64c-0.15-1.08-0.7-2.04-2.08-2.04c-0.28,0-0.57-0.25-0.84-0.39 c-0.47-0.25-0.92-0.61-1.42-0.73c-1.45-0.36-2.93-0.61-4.39-0.92c-0.12-0.03-0.22-0.18-0.34-0.23c-0.69-0.31-1.37-0.67-2.09-0.89 c-0.5-0.15-1.09,0.01-1.58-0.15c-1.59-0.49-3.12-1.21-4.73-1.56c-0.84-0.18-1.56-0.25-1.9-1.1c-0.26-0.64-0.44-1.3-0.58-1.71 c-0.72-0.61-1.66-1-1.81-1.59c-0.47-1.97-0.84-4-0.92-6.01c-0.17-4.38-0.13-8.76-0.19-13.14c0-0.39,0.08-0.98-0.12-1.13 c-1.52-1.11-0.88-2.72-1.05-4.13c-0.09-0.72-0.04-1.47-0.24-2.16c-0.52-1.81-1.24-3.58-1.68-5.41c-0.47-1.99-0.71-4.03-1.05-6.05 c-0.02-0.15-0.03-0.35-0.12-0.41c-1.51-0.98-1.28-2.82-1.53-4.12c-0.44-2.32-1.97-4.02-2.61-6.16c-0.4-1.34-1.17-2.57-1.71-3.87 c-0.68-1.62-1.18-3.32-1.99-4.86c-0.81-1.54-2.08-2.85-2.84-4.42c-0.66-1.35-0.85-2.94-2.05-4.04c-0.1-0.09-0.05-0.51,0.07-0.66 c0.56-0.66,1.05-1.5,1.78-1.88c1.3-0.68,1.3-1.76,1.31-2.91c0.01-1.17-0.04-2.34,0.01-3.51c0.07-1.48-0.62-2.06-2.07-2.04 c-3.26,0.04-6.52,0.06-9.78-0.01c-0.7-0.02-1.46-0.33-2.05-0.72c-1.1-0.72-2.12-1.56-3.13-2.4c-0.54-0.45-0.96-1.03-1.48-1.5 c-0.43-0.39-0.99-0.65-1.4-1.06c-1.1-1.08-2.85-1.27-3.64-2.8c-0.26-0.51-0.8-0.93-1.31-1.26c-1.904-1.241-3.992-2.242-5.711-3.712 c-0.881-0.754-1.89-1.335-2.86-1.97c-0.607-0.397-1.054-1.111-1.699-1.348c-2.2-0.8-3.28-2.91-5.09-4.15 c-1.33-0.92-1.84-2.72-3.74-3.11c-0.83-0.18-1.88-1.09-2.14-1.89c-0.88-2.71-2.14-5.37-1.84-8.36c0.05-0.48,0.01-0.96,0.01-1.34 c-1.25-1.09-2.38-0.97-3.36,0.1c-0.89,0.97-1.57,2.15-2.54,3.02c-1.43,1.29-2.97,2.51-4.61,3.52c-0.69,0.42-1.38,0.67-2.02,1.31 c-0.9,0.89-2.2,1.64-3.43,1.85c-1.8,0.3-3.69,0.07-5.53,0.05c-0.18,0-0.48-0.07-0.53-0.18c-0.47-1.14-1.47-0.93-2.36-0.94 c-6.56-0.01-13.14-0.04-19.7,0.04c-1.54,0.02-3.04-0.25-4.58,0.97c-1.14,0.9-3.14,0.73-4.76,1.02c-2.09,0.36-4.19,0.69-6.29,1.07 c-0.19,0.03-0.33,0.28-0.53,0.39c-0.37,0.22-0.74,0.54-1.14,0.59c-2.19,0.29-4.26,0.71-6.23,1.94c-1.53,0.96-3.44,1.68-5.22,1.77 c-1.75,0.09-2.67,1.41-4.14,1.82c-1.55,0.42-2.99,0.65-4.48-0.1c-0.81-0.405-1.626-0.816-2.452-1.201 c-0.68-0.317-1.835-0.735-2.558-0.934c-1.54-0.425-3.106-0.796-4.66-1.225c-0.36-0.1-0.75-0.28-1-0.54 c-1.13-1.22-3.97-1.95-5.53-1.35c-0.17,0.06-0.44,0.21-0.43,0.31c0.02,1.69-0.44,3.69,0.31,4.96c0.62,1.05,0.67,1.93,0.85,2.94 c0.3,1.71,0.65,3.4,0.99,5.1c0.03,0.13,0.11,0.31,0.22,0.36c1.21,0.52,0.68,1.35,0.48,2.21c-2.65,0-5.23,0-7.8-0.01 c-0.24,0-0.59,0.01-0.69-0.13c-1.25-1.66-3.02-0.97-4.53-0.83c-0.67,0.07-1.56,1.09-1.79,1.86c-0.3,0.97-0.07,2.11,0.02,3.18 c0.03,0.3,0.32,0.68,0.6,0.85c0.79,0.49,1.63,0.88,2.41,1.29c0,1.61-0.25,3.18,0.06,4.61c0.44,1.98-0.79,3.3-1.41,4.84 c-0.37,0.91-1.12,1.68-1.74,2.48c-0.65,0.86-1.47,1.62-1.97,2.56c-1.056,1.961-2.123,3.875-3.665,5.518 c-0.045,0.048-0.085,0.103-0.115,0.162c-0.62,1.2-1.26,2.38-1.81,3.61c-0.52,1.15-0.65,2.41-1.51,3.5c-0.8,1-1.09,2.41-1.63,3.63 c-0.4,0.91-0.89,1.79-1.23,2.73c-0.65,1.77-0.53,3.74-1.91,5.36c-0.96,1.12-1.31,2.75-2.03,4.1c-0.74,1.37-1.69,2.45-3.49,2.5 c-1.86,0.04-3.37,1.92-3.6,3.77c-0.44,3.62,2.49,5.16,4.33,7.38c0.29,0.36,0.73,0.77,0.74,1.17c0.06,1.95,0,3.9-0.04,5.84 c0,0.27-0.16,0.53-0.27,0.79c-0.22,0.58-0.62,1.14-0.66,1.73c-0.1,1.31-0.05,2.63-0.02,3.94c0,0.38,0.07,0.77,0.19,1.13 c0.27,0.77,0.78,1.51,0.84,2.29c0.15,1.79,0.08,3.6,0.11,5.4c0.01,0.78-0.28,1.79,0.1,2.29c1.42,1.91,0.12,4.44,1.72,6.36 c0.72,0.86,0.64,2.41,0.9,3.65c0.5,2.35,1.18,4.66,1.83,6.96c0.68,2.41,2.51,4.36,2.52,7.02c0,0.81,0.91,1.59,1.32,2.43 c0.52,1.07,0.95,2.19,1.43,3.28c0.11,0.24,0.28,0.45,0.41,0.68c0.56,1,1.12,1.99,1.67,2.99c0.32,0.59,0.48,1.5,0.98,1.75 c1.39,0.69,1.07,2.22,1.83,3.18c0.47,0.6,0.82,1.29,1.25,1.92c0.26,0.37,0.56,0.71,0.83,1.08c0.52,0.72,1.09,1.41,1.54,2.17 c0.52,0.89,1.47,2.02,1.24,2.71c-0.31,0.91-1.5,1.63-2.46,2.18c-1.59,0.9-3.29,1.6-4.94,2.38c-0.45,0.21-0.9,0.41-1.35,0.63 c-0.95,0.47-1.92,0.92-2.85,1.45c-0.71,0.42-1.35,0.98-2.05,1.42c-0.99,0.63-2.06,1.14-3,1.82c-0.81,0.58-1.46,1.39-2.27,1.98 c-0.53,0.4-1.41,0.43-1.81,0.9c-0.87,1.04-1.78,2-2.43,3.31c-0.93,1.85-0.62,3.28,0.36,4.67c0.71,1,1.81,1.7,3.22,1.44 c2.79-0.51,5.68,0.59,8.47-0.8c1.08-0.54,2.59-0.18,3.9-0.27c0.42-0.02,1.09-0.02,1.21-0.26c0.52-1.03,1.44-0.76,2.26-0.9 c1.76-0.28,3.52-0.6,5.28-0.92c0.13-0.02,0.33-0.1,0.37-0.21c0.43-1.07,1.39-0.83,2.22-0.9c0.63-0.06,1.27-0.03,1.88-0.15 c2.21-0.43,4.39-1,6.61-1.36c1.77-0.29,3.57-0.02,5.09,0.93c1.33,0.83,2.43,2.06,4.19,1.92c0.07,0,0.14,0.24,0.25,0.32 c0.96,0.71,1.94,1.41,3.11,2.26c-0.03,0.78,0.72,2.01-0.9,2.62c-0.11,0.05-0.12,0.35-0.21,0.52c-0.68,1.31-1.35,2.63-2.06,3.93 c-0.41,0.75-0.86,1.47-1.32,2.17c-0.52,0.79-1.16,1.5-1.6,2.33c-0.46,0.86-0.7,1.84-1.11,2.73c-0.56,1.22-1.46,2.35-1.74,3.63 c-0.31,1.34-0.12,2.81-0.03,4.22c0.08,1.17,0.87,1.95,2,2.03c1.38,0.09,2.83,0.58,4.1-0.64c0.75-0.73,1.82-1.11,2.66-1.76 c0.66-0.5,1.45-1.08,1.73-1.8c0.87-2.3,2.93-3.51,4.48-5.18c0.47-0.51,1.29-0.68,1.83-1.15c1.39-1.22,2.56-2.77,4.1-3.71 c1.46-0.88,3.26-1.31,4.97-1.65c1.24-0.24,2.38,0.18,3.64,0.89c2.31,1.31,5.28,0.57,7.75,2.06c1.12,0.68,2.84,0.67,4.2,0.82 c2.23,0.25,4.29,0.73,6.53,1.79c-0.24,0.43-0.46,0.94-0.77,1.4c-0.4,0.57-0.99,1.05-1.28,1.67c-0.79,1.67-1.35,3.39-1.07,5.31 c0.19,1.25,2.23,3.39,3.42,3.12c1.23-0.27,2.54-0.81,3.48-1.62c1.48-1.28,2.63-2.93,4.01-4.33c1.1-1.12,2.36-2.08,3.53-3.12 c0.71-0.64,1.3-1.64,2.12-1.89c1.76-0.52,3.64-0.61,5.45-0.97c1.79-0.35,3.55,0.17,5.46-0.91c1.89-1.06,4.51-0.98,6.82-1.09 c2.82-0.13,2.63-0.62,2.63,2.59c0,57.42,0.02,114.83-0.06,172.25c0,4.23,0.83,8.54-0.79,12.73c-0.62,1.6-0.25,3.38-1,5.17 c-0.81,1.94-0.89,4.43-1.01,6.62c-0.34,6.56-0.12,13.14-0.11,19.72c0,0.48-0.12,1.18,0.15,1.41c1.43,1.27-0.05,3.62,1.8,4.67 c0.34,3.04,0.98,6.08,0.99,9.12c0.06,52.79,0.04,105.58,0.04,158.37c0,3.16,0,6.33-0.03,9.49c0,0.57-0.12,1.14-0.26,1.69 c-0.19,0.72-0.64,1.41-0.66,2.11c-0.11,3.56-0.11,7.11-0.16,10.67c-0.01,0.42-0.1,0.85-0.21,1.27c-0.2,0.8-0.52,1.58-0.66,2.4 c-0.17,0.95-0.16,1.93-0.31,2.89c-0.16,1.01-0.64,2.01-0.6,2.99c0.16,3.93,0.47,7.84,0.73,11.76c0.01,0.09,0.01,0.19,0.03,0.29 c0.02,0.09,0.03,0.25,0.09,0.26c1.53,0.52,1.01,1.83,1.01,2.84c0.04,8.82,0.12,17.63-0.03,26.45c-0.05,2.65,0.87,5.42-0.97,8.02 c-0.8,1.12-0.72,2.87-1.05,4.32c-0.05,0.23-0.17,0.43-0.26,0.64c-0.55,1.3-1.35,2.55-1.59,3.9c-0.47,2.59-1.33,5.12-1.07,7.86 c0.22,2.37-0.05,4.78,0.08,7.16c0.1,1.83,0.58,3.64,0.72,5.47c0.11,1.56-0.68,2.28-2.23,2.29c-2.87,0.02-5.74-0.01-8.61,0.03 c-0.6,0.01-1.54,0.04-1.74,0.4c-0.54,0.93-1.29,0.71-2.03,0.74c-1.89,0.09-3.92-0.26-5.63,0.33c-1.64,0.56-3.18,0.44-4.77,0.55 c-0.77,0.05-1.56,0-2.33,0.04c-0.39,0.03-0.99,0.03-1.1,0.25c-0.72,1.33-1.93,0.77-2.95,0.89c-0.68,0.07-1.56-0.12-1.99,0.24 c-1.51,1.3-3.91-0.13-5.14,1.79c-2.12-0.02-4.15,0.22-6.23,0.82c-1.96,0.56-2.12,0.32-2.18,2.44c-0.01,0.34-0.01,0.69,0,1.03 c0.06,1.68,2.24,2.98,3.84,2.46c2.01-0.65,4.08-1.5,6.15-1.56c7.1-0.21,14.21-0.12,21.31-0.12c0.47-0.01,0.99,0.07,1.4,0.28 c1.67,0.85,3.32,1.62,5.27,1.47c0.64-0.05,1.32,0.15,1.95,0.35c0.64,0.19,1.22,0.71,1.84,0.75c3.19,0.16,3.22,0.16,3.33,3.45 c0.02,0.47,0.05,1.22,0.31,1.34c2.07,0.98,1.89,2.8,1.64,4.51c-0.1,0.64-0.81,1.33-1.41,1.69c-0.29,0.17-1-0.36-1.53-0.56 c-0.43-0.16-0.87-0.4-1.32-0.42c-1.21-0.07-2.43-0.01-3.65-0.06c-0.4-0.01-0.97-0.03-1.18-0.29c-1.01-1.21-2.46-2.07-2.96-3.72 c-0.12-0.39-0.73-0.77-1.18-0.88c-0.64-0.15-1.36,0-2.03-0.08c-3.01-0.39-4.31,2.14-4.4,4.43c-0.18,4.77-0.13,9.54-0.14,14.31 c-0.01,2.82,2.03,4.69,4.86,4.52c0.33-0.03,0.71,0,1-0.14c0.39-0.2,0.79-0.49,1.05-0.84c0.57-0.81,0.87-2.08,1.62-2.43 c1.73-0.79,3.65-1.22,5.52-1.65c1.12-0.26,2.33-0.11,3.44-0.37c0.5-0.12,0.83-1.12,1.47-0.21c0.36,0.51,0.86,1.02,0.95,1.59 c0.16,0.95,0.03,1.94,0.06,2.91c0.02,0.73-0.3,1.6,0.72,2.02c0.1,0.04,0.07,0.87-0.06,0.92c-0.9,0.37-1.84,0.86-2.77,0.87 c-4.38,0.09-8.76-0.08-13.14,0.08c-4.25,0.15-8.48,0.6-12.73,0.93c-0.14,0.01-0.29,0.04-0.42,0.1c-0.18,0.06-0.46,0.13-0.49,0.24 c-0.27,1.05-1.1,0.74-1.78,0.78c-1.26,0.07-2.71-0.25-3.73,0.27c-1.56,0.79-3.07,0.49-4.61,0.6c-0.83,0.06-1.66-0.02-2.48,0.05 c-0.46,0.04-0.92,0.23-1.36,0.4c-0.57,0.22-1.11,0.68-1.66,0.69c-5.74,0.12-11.48,0.25-17.22,0.19c-2.94-0.03-5.8,0.32-8.66,0.89 c-1.92,0.38-3.87,0.56-5.81,0.84c-0.14,0.02-0.37,0.03-0.41,0.11c-0.64,1.38-1.89,0.79-2.91,0.91c-0.67,0.07-1.58-0.17-1.99,0.19 c-1.16,1-2.45,0.58-3.69,0.69c-0.83,0.07-1.68,0-2.47,0.2c-0.46,0.12-0.79,0.86-1.24,0.91c-2.91,0.37-5.84,0.62-8.76,0.91 c-0.15,0.01-0.35-0.02-0.43,0.06c-0.65,0.68-1.53,1.29-1.85,2.11c-0.31,0.78,0.21,1.51,0.84,2.36c1.3,1.76,2.87,2,4.54,1.69 c2.76-0.49,5.54,0.64,8.38-0.92c1.96-1.08,4.67-0.8,7.06-1.06c1.06-0.12,2.14-0.03,3.21-0.09c0.36-0.02,0.71-0.16,1.05-0.3 c0.57-0.23,1.13-0.71,1.7-0.71c7.2-0.09,14.42,0.25,21.57-0.98c0.95-0.16,1.86-0.79,2.8-0.8c8.27-0.06,16.54-0.03,24.81-0.02 c0.44,0,1.03-0.11,1.28,0.12c1.16,1.09,2.55,0.69,3.86,0.72c2.62,0.06,5.26-0.04,7.88,0.09c3.92,0.2,7.83,0.57,11.75,0.79 c0.98,0.06,1.1,0.61,1.1,1.33c0.03,2.39,0.05,4.78,0.05,7.16c-0.01,2.02-1.87,3.14-3.77,2.39c-0.95-0.37-1.99-0.7-2.98-0.7 c-10.76-0.06-21.51-0.02-32.27-0.07c-1.58-0.01-3.37,0.66-4.65-0.97c-0.08-0.09-0.27-0.11-0.41-0.13 c-2.93-0.32-5.86-0.62-8.79-0.95c-0.4-0.04-0.8-0.18-1.18-0.33c-0.57-0.24-1.13-0.77-1.69-0.77c-7.35-0.03-14.69,0-22.04,0.04 c-0.95,0-2.27,1.35-2.31,2.29c-0.03,0.86-0.1,1.62,1.01,2.08c0.65,0.27,0.96,1.53,1.59,1.68c1.92,0.48,3.91,0.63,5.87,0.93 c1.04,0.15,2.37-0.55,2.94,1.01c0.04,0.1,0.36,0.11,0.55,0.12c3.51,0.33,7.01,0.67,10.52,0.95c1.16,0.1,2.34,0.02,3.5,0.08 c0.4,0.02,0.79,0.25,1.19,0.39c0.5,0.18,1.01,0.52,1.52,0.53c2.43,0.06,4.86,0.01,7.3,0.06c0.65,0.01,1.3,0.23,1.94,0.4 c0.48,0.13,0.93,0.46,1.4,0.46c7.84,0.09,15.67,0.05,23.5,0.23c5.81,0.13,11.61,0.48,17.4,0.86c0.64,0.05,1.54,0.85,1.76,1.49 c0.49,1.43,1.55,2.76,1.15,4.45c-0.06,0.27,0.33,0.63,0.48,0.97c0.55,1.25,1.09,2.51,1.63,3.77c-0.137,0.184-0.17,0.23-0.307,0.414 c-0.944-0.093-1.899-0.132-2.823-0.294c-0.59-0.1-1.13-0.53-1.7-0.54c-6.96-0.1-13.91-0.14-20.87-0.22 c-1.08-0.01-2.29,0.4-3.09-0.88c-0.16-0.27-0.9-0.25-1.38-0.26c-1.6-0.03-3.21-0.01-4.82-0.01c-0.33-0.01-0.83,0.09-0.99-0.09 c-0.91-1.09-2.14-0.72-3.26-0.77c-1.26-0.05-2.53,0.01-3.79-0.02c-0.36-0.01-0.72-0.14-1.05-0.29c-0.58-0.25-1.11-0.75-1.7-0.82 c-2.88-0.32-5.74-0.13-8.66-0.74c-3.27-0.68-6.78-0.21-10.19-0.18c-0.48,0-1.14,0.2-1.4,0.55c-0.9,1.21,0.09,4.17,1.51,4.44 c2.01,0.39,4.05,0.6,6.08,0.87c0.72,0.1,1.84-0.1,2.09,0.29c0.78,1.21,1.85,0.74,2.83,0.84c0.92,0.1,2.04-0.16,2.7,0.29 c1.05,0.71,2.08,0.6,3.16,0.65c1.06,0.05,2.18-0.07,3.19,0.21c1.63,0.45,3.16,1.3,4.8,1.72c1.71,0.45,3.48,0.08,5.27,1.06 c1.43,0.78,3.44,0.32,5.23,0.91c2.13,0.71,4.5-0.02,6.83,0.88c2.46,0.95,5.22,0.01,8.01,1.07c3.13,1.19,6.86,0.81,10.33,1.12 c0.57,0.05,1.18,0.03,1.68,0.26c0.64,0.3,1.17,0.82,1.75,1.24c0.15-0.02,0.31-0.05,0.46-0.08c-0.1,1.18,0.17,2.59-0.39,3.5 c-0.86,1.38-2.53,1.97-4.19,2.02c-3.25,0.08-6.51,0.02-9.76,0.07c-1.86,0.03-2.68,0.94-2.66,2.81c0.01,0.93,1.47,3.14,2.4,3.36 c1.65,0.4,3.33,0.82,5.01,0.9c3.06,0.14,6.13,0.03,9.19,0.05c1.58,0,2.3,0.73,2.31,2.34c0.02,3.12,0.22,6.25-0.07,9.34 c-0.2,2.13,1.22,2.97,2.27,4.19c0.09,0.1,0.56,0.01,0.73-0.14c0.99-0.82,1.37-1.83,1.28-3.18c-0.06-1.03,0.45-2.08,0.6-3.13 c0.26-1.95-0.25-4.06,1.26-5.73c0.28-5.74,0.56-11.48,0.85-17.22c0.04-0.83,0.14-1.66,0.12-2.48c-0.08-3.46,0.65-6.86,0.83-10.28 c0.13-2.46-0.51-4.96-0.75-7.44c-0.12-1.26,0.28-2.76-0.28-3.74c-0.87-1.54-0.47-3.05-0.63-4.58c-0.05-0.53,0.01-1.07-0.06-1.6 c-0.05-0.37-0.12-0.96-0.36-1.06c-0.97-0.44-0.73-1.24-0.75-1.98c-0.04-1.8,0.39-3.78-0.24-5.34c-0.66-1.64-0.54-3.17-0.62-4.76 c-0.07-1.22-0.02-2.44-0.04-3.65c-0.01-0.44,0.04-1.1-0.2-1.26c-1.41-0.94-0.74-2.36-0.95-3.57c-0.24-1.44-0.63-2.87-0.69-4.32 c-0.07-1.59-0.67-3.32,0.58-4.74c0.21-0.24,0.92-0.42,1-0.32c0.42,0.54,0.88,1.15,1.01,1.8c0.31,1.52-0.14,3.06,1.03,4.58 c1.02,1.3,1.22,3.22,1.85,4.85c0.34,0.86,0.86,1.64,1.25,2.49c0.27,0.58,0.43,1.22,0.69,1.82c0.46,1.07,0.96,2.13,1.45,3.19 c0.52,1.12,1.04,2.24,1.56,3.35c0.41,0.87,1.05,1.69,1.2,2.59c0.41,2.58,0.73,5.18,0.87,7.78c0.17,3.21,0.12,6.43,0.19,9.64 c0.01,0.43-0.01,1.08,0.24,1.23c1.04,0.66,0.84,1.66,0.91,2.6c0.27,3.54-0.37,7.08,0.66,10.64c0.5,1.72,1.74,2.57,2.66,3.79 c0.16,0.21,0.75,0.19,1.12,0.12c0.62-0.12,2.42-2.53,2.46-3.18c0.51-8.75-0.35-17.53,0.71-26.29c0.41-3.38-0.31-6.91-0.58-10.36 c-0.09-1.15,0.49-2.57-1.1-3.24c-0.11-0.04-0.11-0.35-0.13-0.54c-0.3-2.81-0.59-5.62-0.9-8.42c-0.05-0.47-0.11-1.21-0.38-1.33 c-1.02-0.43-0.73-1.26-0.78-1.97c-0.08-1.11,0.3-2.53-0.25-3.27c-0.83-1.1-0.52-2.02-0.49-3.05c1.99-0.43,3.75-1.81,5.74-0.95 c0.39,2.88,0.85,5.69,1.14,8.52c0.23,2.29,1.01,4.26,2.89,5.63c0.45,0.33,1.22,0.47,1.77,0.35c0.76-0.15,1.45-0.63,2.3-1.03 c0-2.53-0.02-5.15,0.02-7.78c0.01-0.86-0.14-1.96,0.31-2.53c0.91-1.16,0.53-1.98-0.12-2.77c0.48-1.75,1.76-1.6,3.07-1.64 c6.71-0.25,13.42-0.57,20.13-0.87c0.19,0,0.39-0.03,0.58-0.06c2.915-0.587,5.795-1.362,8.816-1.146 c1.388,0.099,2.779,0.185,4.166,0.067c1.583-0.135,3.2,0.101,4.658-0.921c0.97-0.68,1.69-1.88,1.18-3.28 c-0.25-0.68-1.16-1.55-1.81-1.58c-5.95-0.3-11.92-0.12-17.83-1.11c-0.37-0.06-0.98-0.04-1.06-0.23c-0.47-1.12-1.42-0.85-2.25-0.88 c-1.79-0.07-3.78,0.4-5.34-0.22c-1.54-0.62-2.97-0.51-4.46-0.69c-4.45-0.53-9.09,1.2-13.37-1.14c-0.57-0.31-1.22-0.55-1.66-0.99 c-1.16-1.18-2.18-2.5-3.35-3.68c-1.89-1.9-3.88-3.71-5.77-5.62c-1.11-1.1-1.9-2.74-3.21-3.36c-1.71-0.81-2.94-1.96-4.27-3.2 c-1.45-1.36-3.25-2.35-5.13-3.67v-1.37c2.39,0.23,4.78-0.38,6.81,1.6c0.74,0.73,2.1,1.17,3.17,1.15c2.07-0.06,2.81-1.1,2.83-3.22 c0.012-1.029,0.105-2.072-0.135-3.065c-0.126-0.522-0.594-1.242-0.983-1.612c-0.994-0.944-2.204-1.718-2.982-2.803 c-1.18-1.62-2.71-2.7-4.3-3.8c-0.66-0.45-1.27-1.04-1.77-1.68c-0.62-0.77-1.01-1.75-1.67-2.48c-0.7-0.79-1.07-1.55-1.07-2.66 c0.04-25.52,0.02-51.03,0.09-76.55c0.01-2.45,0.54-4.89,0.86-7.33c0.02-0.2,0.28-0.36,0.38-0.56c0.51-1.02,1.37-2.03,1.42-3.07 c0.2-4.67,0.37-9.36,0.15-14.02c-0.23-4.6,0.89-9.24-0.91-13.86c-0.97-2.5-0.76-5.45-1.08-8.2c-0.06-0.53-0.12-1.06-0.22-1.59 c-0.17-0.92-0.53-1.84-0.54-2.75c0-1.6-0.1-3.16,0.52-4.8c0.54-1.42,0.41-3.2,0.21-4.77c-0.37-2.8,0.82-5.35,0.97-8.05 c0.01-0.14,0.05-0.36,0.14-0.4c1.26-0.61,0.84-1.8,0.99-2.79c0.06-0.43-0.11-1.04,0.12-1.27c1.46-1.45,0.73-3.5,1.61-5.25 c1.1-2.2-0.12-5.19,1.07-7.68c0.04-9.5,0.1-18.99,0.12-28.49c0-1.74,0.34-3.72-0.35-5.18c-0.85-1.83-0.55-3.56-0.74-5.33 c-0.04-0.36-0.16-0.73-0.31-1.07c-0.25-0.56-0.68-1.08-0.79-1.67c-0.37-2.01-0.64-4.05-0.95-6.07 c-0.018-0.064-0.035-0.126-0.053-0.19c-0.547-1.29-1.442-2.513-1.707-3.87c-0.47-2.46-0.88-4.98-0.88-7.47 c-0.04-51.72-0.02-103.44-0.05-155.15c0-2.24,0.68-3.89,2.54-5.13c0.81-0.53,1.5-1.26,2.19-1.96c1.11-1.12,2.13-2.32,3.27-3.39 c0.39-0.36,1.19-0.28,1.57-0.64c1.32-1.26,2.51-2.66,3.81-3.95c1.03-1.02,2.18-1.94,3.2-2.97c1.34-1.36,2.58-2.82,3.92-4.18 c1.21-1.22,2.62-2.26,3.72-3.58c1.17-1.4,2.28-2.77,4.14-3.27c0.14-0.04,0.24-0.28,0.35-0.43c1.26-1.87,1.11-3.98,0.97-6.07 c-0.02-0.38-0.44-0.97-0.78-1.06c-2.42-0.64-4.68,0.12-6.93,0.92c-0.29,1.52-1.89,1.12-2.8,1.7c-1.15,0.74-2.85,0.01-4.3,1.16 c-0.88,0.7-2.61,0.58-3.96,0.92c-1.74,0.44-3.32,1.03-4.92,2.07c-0.1-0.55-0.25-1.01-0.25-1.47c0-2.48-0.03-4.97,0.07-7.45 c0.23-5.62,0.14-11.24,0.73-16.88c0.56-5.39-0.01-10.89-0.04-16.34c-0.03-6.04,0.03-12.08-0.03-18.12 c-0.03-2.15,0.05-4.26-0.48-6.46c-0.76-3.17-0.78-6.51-1.2-9.77c-0.11-0.84-0.54-1.64-0.8-2.46c-0.06-0.22-0.15-0.54-0.04-0.67 c0.72-0.89,1.46-1.75,2.24-2.59c1.82-1.97,3.8-3.81,5.45-5.92c1.33-1.69,2.58-3.28,4.76-3.9c0.76-0.21,1.55-0.62,2.13-1.15 c1.19-1.11,2.12-2.36,3.81-3.06c1.74-0.72,3.12-2.32,4.64-3.56c0.41-0.33,0.73-0.78,1.16-1.07c2.04-1.42,4.11-2.79,6.15-4.21 c0.29-0.2,0.44-0.61,0.73-0.8c1.46-0.91,3.01-1.69,4.41-2.68c1.16-0.81,2.17-1.83,3.2-2.8c0.46-0.44,0.86-0.97,1.18-1.51 c0.4-0.68,0.54-1.55,1.06-2.09c1.159-1.21,1.822-2.544,1.82-4.222c0-0.258,0.046-0.516,0.159-0.747c0.97-1.97,2.06-3.9,2.95-5.92 c1.15-2.6,2.08-5.3,3.24-7.89c1.04-2.33,2.44-4.52,3.34-6.89c0.61-1.59,1.59-2.02,3.03-2.03c3.99-0.03,7.99-0.22,11.96,0.02 c2.25,0.14,3.79-1.49,5.85-1.66c0.717-0.051,1.424-0.522,2.077-0.886c0.846-0.472,1.672-0.976,2.476-1.516 c0.646-0.434,1.381-0.838,1.917-1.398C230.441,131.98,230.311,130.27,230.071,128.64z M111.437,192.42 c-46.57,0-84.32-37.75-84.32-84.32c0-46.56,37.75-84.31,84.32-84.31c46.56,0,84.31,37.75,84.31,84.31 C195.747,154.67,157.997,192.42,111.437,192.42z"
    ],
    clocks: {
      size: 169,
      0: { x: 111.011, y: 108.5 }
    }
  },
  2: {
    height: 625.438,
    width: 197.009,
    path: "M193.86,271.21c-2.234-2.626-5.64-4.792-8.929-5.835c-6.793-2.153-11.841,2.196-17.463,7.369 c-5.009-25.727-17.583-43.987-38.477-54.246l-18.909-21.56v-12l20.773-23.686c19.55-10.446,31.402-28.304,36.229-53.096 c5.622,5.174,10.67,9.523,17.463,7.369c3.289-1.043,6.695-3.208,8.929-5.835c4.877-5.734,3.879-14.302-1.542-19.605 c-6.442-6.301-13.569-5.549-24.852,3.382c-4.816-25.231-17.183-43.587-38.409-54.031h0.158c-1.506-0.732-3.056-1.394-4.625-2.025 c-2.997-1.25-6.144-2.365-9.463-3.327c0,0-0.527-0.089-1.457-0.217c-2.421-0.731-4.757-2.02-7.743-3.273 c2.103-2.282,3.255-3.455,4.321-4.703c5.176-6.057,4.821-14.978-0.792-20.538c-5.647-5.594-14.543-5.829-20.352-0.539 c-6.101,5.556-6.808,14.49-1.648,20.831c4.153,5.103,3.905,5.403-2.49,8.055c-1.793,0.744-3.604,1.465-5.417,2.187 c-10.281,3.032-16.092,6.929-22.875,12.001c-12.415,9.284-19.739,22.385-23.521,37.515c-0.673,2.693-2.08,5.2-3.437,8.492 c-2.262-2.122-3.424-3.284-4.661-4.36c-6.003-5.222-14.845-4.864-20.356,0.799c-5.544,5.698-5.778,14.673-0.534,20.534 c5.507,6.156,14.361,6.869,20.646,1.662c5.058-4.19,5.355-3.94,7.984,2.512c3.394,8.33,6.292,17.054,10.972,24.62 c6.032,9.752,14.303,16.873,24.096,21.915l21.601,23.357v12l-20.223,21.867c-10.232,5.068-18.855,12.348-25.091,22.43 c-4.68,7.566-7.578,16.29-10.972,24.62c-2.629,6.452-2.926,6.702-7.984,2.512c-6.285-5.206-15.139-4.493-20.646,1.662 c-5.243,5.861-5.01,14.837,0.534,20.534c5.511,5.663,14.352,6.021,20.356,0.799c1.237-1.076,2.399-2.238,4.661-4.36 c1.356,3.292,2.764,5.799,3.437,8.492c3.782,15.13,11.106,28.232,23.521,37.515c7.877,5.89,14.425,10.198,28.206,13.404 c1.38,0.321,2.787,0.579,4.201,0.789c0.031,27.796,0.06,69.604,0.085,105.236c0.009,13.829,0.018,26.73,0.026,37.518 c0,0.826-0.08,1.652-0.121,2.436c-3.447,0.597-4.58-0.495-4.682-4.511c-0.072-2.822-0.002-5.649-0.016-8.473 c-0.024-4.802-0.891-5.97-4.609-5.976c-14.432-0.022-28.864-0.01-43.295-0.009c-4.627,0-9.255,0.084-13.881-0.022 c-3.054-0.07-4.428,1.698-4.326,5.623c0.079,3.039,0.085,6.08-0.001,9.119c-0.111,3.933,1.27,5.674,4.317,5.646 c8.372-0.076,16.745-0.038,25.118-0.024c4.14,0.007,4.933,1.055,4.947,6.397c0.024,9.702,0.024,9.702-7.67,9.702 c-7.381-0.001-14.762-0.025-22.143,0.006c-3.558,0.015-4.54,1.209-4.551,5.611c-0.035,13.947-0.943,13.109,10.004,13.035 c6.61-0.045,13.22-0.032,19.83,0.002c3.528,0.018,4.463,1.226,4.534,5.638c0.17,10.455,0.17,10.455-8.056,10.455 c-7.271,0-14.542-0.024-21.813,0.01c-3.492,0.016-4.48,1.263-4.503,5.672c-0.067,12.642-0.701,12.243,9.397,12.129 c6.83-0.077,13.661-0.04,20.491-0.004c3.466,0.018,4.419,1.281,4.484,5.702c0.154,10.39,0.154,10.39-8.106,10.39 c-7.271,0-14.542-0.026-21.813,0.01c-3.447,0.017-4.439,1.296-4.452,5.736c-0.039,13.671-0.908,12.955,9.772,12.916 c17.076-0.063,34.152-0.012,51.227-0.02c4.329-0.002,5.098-1.02,5.1-6.63c0.001-1.977-0.037-3.956,0.007-5.931 c0.094-4.282,1.178-5.371,4.197-4.937c1.031,10.07,1.909,19.99,3.129,29.842c0.425,3.429,1.312,6.98,2.695,9.93 c1.2,2.56,3.388,5.993,5.16,6.013c1.744,0.02,4.469-3.383,5.098-5.954c2.029-8.292,4.037-16.802,4.667-25.395 c0.85-11.612,0.501-23.379,0.517-35.079c0.042-30.977,0.078-68.798,0.115-106.572c0.037-37.246,0.075-74.445,0.121-104.988 c3.105-0.304,5.045-0.635,5.045-0.635c29.872-8.658,46.55-29.062,52.338-59.383c11.283,8.931,18.409,9.683,24.852,3.382 C197.739,285.512,198.737,276.945,193.86,271.21z M44.186,100.381c0-29.823,24.177-54,54-54s54,24.177,54,54 c0,29.823-24.177,54-54,54S44.186,130.205,44.186,100.381z M98.186,334.381c-29.823,0-54-24.177-54-54c0-29.823,24.177-54,54-54 s54,24.177,54,54C152.186,310.205,128.009,334.381,98.186,334.381z",
    clocks: {
      size: 108,
      0: { x: 98.579, y: 280 },
      1: { x: 98.579, y: 100 }
    }
  },
  3: {
    height: 915.936,
    width: 277.634,
    path: "M263.752,257.836c-13.719,1.508,3.345-15.515,3.955-23.109l-0.113,0.113 c8.127-22.574,2.75-46.079-10.802-65.608c14.365-1.735,19.981-6.287,20.122-15.339c0.118-7.617-5.228-14.388-12.762-14.963 c-3.451-0.263-7.412,0.636-10.496,2.245c-6.369,3.324-6.896,10.001-7.248,17.67c-12.146-8.157-24.329-12.988-36.575-14.34 c-2.94-2.54-4.264-6.236-3.879-10.997c0.451-5.587,0.239-11.066-0.572-16.359c0.828-2.872,1.549-5.847,2.156-8.934 c5.672,5.174,10.766,9.523,17.62,7.369c3.319-1.043,6.755-3.208,9.009-5.835c4.921-5.734,3.914-14.302-1.556-19.605 c-6.5-6.301-13.69-5.549-25.075,3.382c-5.055-30.578-25.967-51.62-54.619-60.047c-2.447-0.732-4.807-2.023-7.825-3.278 c2.125-2.286,3.29-3.461,4.367-4.71c11.938-14.551-7.15-33.181-21.367-21.111c-6.165,5.565-6.879,14.513-1.665,20.864 c4.197,5.111,3.946,5.411-2.516,8.068c-1.812,0.745-3.642,1.467-5.474,2.19c-24.645,7.648-40.948,25.21-46.886,49.595 c-0.68,2.698-2.102,5.208-3.473,8.505c-2.286-2.125-3.461-3.29-4.71-4.367c-14.552-11.938-33.18,7.152-21.111,21.367 c5.565,6.165,14.513,6.879,20.864,1.665c4.71-3.867,5.338-3.944,7.487,1.123c-1.309,6.465-1.74,13.174-1.396,20.102 c0.3,6.03-1.497,10.097-5.356,12.617c-8.889,2.044-17.148,6.132-25.567,9.656c-6.448,2.691-6.837,2.656-7.484-3.926 c-0.804-8.178-7.636-14-15.931-13.576c-18.581,1.516-18.918,28.187-0.181,30.036c1.645,0.122,3.299,0.129,6.419,0.243 c-1.366,3.319-2.113,5.992-3.558,8.47c-3.428,5.74-6.123,11.683-7.912,17.811c-4.722,16.154-2.533,34.602,5.996,50.411 c1.801,5.691,8.569,13.392-1.603,12.903c-40,12.971,18.416,54.114,16.704,9.691c34.782,3.225,46.692,41.92,80.447,49.674 c7.963,2.791,11.179,6.671,12.046,13.724c0.012,3.241,0.01,6.503,0,9.829h-0.223c0,2.086,0,5.309,0,5.309s0.065,0.184-0.069,0.268 c-7.211-0.002-14.005-0.041-20.79,0.015c-4.483,0.037-6.154,1.09-6.592,4.667c-0.352,4.638-0.043,9.45-0.131,14.122 c0.062,5.274,1.49,6.69,6.861,6.724c6.999,0.045,13.998,0.011,21.721,0.011v5.671c-7.723,0-14.722-0.034-21.721,0.011 c-5.372,0.035-6.799,1.45-6.861,6.724c0.087,4.671-0.221,9.484,0.131,14.122c0.438,3.577,2.109,4.63,6.592,4.667 c6.785,0.056,13.579,0.017,20.79,0.015c0.134,0.084,0.279,0.175,0.069,0.268v5.406h0.599c0.031,3.784,0.031,7.619,0,12h-0.599 v4.809c0,0,0.065,0.184-0.069,0.268c-7.211-0.002-14.005-0.041-20.79,0.015c-4.483,0.037-6.154,1.09-6.592,4.667 c-0.352,4.638-0.043,9.45-0.131,14.122c0.062,5.274,1.49,6.69,6.861,6.724c6.999,0.045,13.998,0.011,21.721,0.011v5.671 c-7.723,0-14.722-0.034-21.721,0.011c-5.372,0.035-6.799,1.45-6.861,6.724c0.087,4.671-0.221,9.484,0.131,14.122 c0.438,3.577,2.109,4.63,6.592,4.667c6.785,0.056,13.579,0.017,20.79,0.015c0.134,0.084,0.279,0.175,0.069,0.268v4.906h0.599 c0.031,4.284,0.031,8.119,0,12h-0.599v5.309c0.211,0.092,0.065,0.184-0.069,0.268c-7.211-0.002-14.005-0.041-20.79,0.015 c-4.483,0.037-6.154,1.09-6.592,4.667c-0.352,4.638-0.043,9.45-0.131,14.122c0.062,5.274,1.49,6.69,6.861,6.724 c6.999,0.045,21.721,0.011,21.721,0.011v5.671c0,0-14.722-0.034-21.721,0.011c-5.372,0.035-6.799,1.45-6.861,6.724 c0.087,4.671-0.221,9.484,0.131,14.122c0.438,3.577,2.109,4.63,6.592,4.667c6.785,0.056,13.579,0.017,20.79,0.015 c0.134,0.084,0.279,0.175,0.457,0.268c0,1.594,4.559,168.228,4.51,209.286c-0.005,4.1,0.442,9.128,0.442,10.259 c-3.396,0-6.234,0.133-9.054-0.034c-3.499-0.206-5.37,1.456-6.735,4.558c-1.281,2.913-2.803,5.866-4.843,8.27 c-6.58,7.751-16.578,7.84-23.206,0.144c-2.209-2.565-3.736-5.81-5.169-8.932c-1.239-2.699-2.939-4.083-5.916-4.024 c-3.712,0.073-7.428,0.078-11.14-0.009c-3.163-0.074-4.936,1.432-6.143,4.306c-1.141,2.716-2.476,5.469-4.285,7.764 c-8.725,11.281-23.01,6.923-27.966-5.357c-1.496-5.628-5.039-7.274-10.521-6.767c-4.485,0.415-6.285,1.937-6.286,6.612 c-0.001,15.755-0.002,31.511-0.003,47.266c-0.001,16.376-0.012,32.752,0.006,49.127c0.004,3.646,2.039,5.706,5.586,5.765 c4.244-0.151,7.724,1.078,9.747-3.72c1.63-3.566,3.31-7.297,5.811-10.239c5.927-6.969,15.25-7.396,21.596-0.827 c2.91,3.012,4.885,7.078,6.716,10.936c1.245,2.623,2.748,3.896,5.573,3.857c3.96-0.055,7.925-0.102,11.882,0.027 c3.041,0.099,4.629-1.359,5.914-4.011c1.386-2.861,3.016-5.766,5.166-8.063c10.107-10.412,22.254-3.718,27.139,8.037 c1.337,2.907,3.18,4.141,6.281,4.034c3.442-0.119,6.891-0.027,10.523-0.027c1.065,5.652,2.167,11.021,3.856,16.453 c1.228,3.675,2.407,8.536,7.056,8.594c4.923,0.061,6.042-4.987,7.307-8.743c1.456-4.322,2.867-8.847,3.125-13.35 c0.728-12.721,1.152-25.477,1.174-38.219c0.19-111.404,0.292,50.177,0.366-61.227c0.003-5.129,0.201-18.49,0.201-22.46 c0-41.693,4.098-203.286,4.098-209.558c8.112,0,15.82-0.053,23.528,0.021c5.544,0.13,6.64-3.323,6.288-8.201 c0.033-3.547,0.038-7.095-0.007-10.642c-0.066-5.278-1.476-6.669-6.885-6.701c-7.529-0.044-23.121-0.011-23.121-0.011v-5.671 c0,0,15.592,0.033,23.121-0.011c5.408-0.032,6.819-1.423,6.885-6.701c0.044-3.547,0.04-7.095,0.007-10.642 c0.351-4.882-0.742-8.33-6.288-8.201c-7.707,0.073-15.416,0.021-22.724,0.021v-22.76c7.308,0,15.017-0.053,22.724,0.021 c5.544,0.13,6.64-3.323,6.288-8.201c0.033-3.547,0.038-7.095-0.007-10.642c-0.066-5.278-1.476-6.669-6.885-6.701 c-7.529-0.044-15.059-0.011-23.121-0.011v-5.671c8.062,0,15.592,0.033,23.121-0.011c5.408-0.032,6.819-1.423,6.885-6.701 c0.044-3.547,0.04-7.095,0.007-10.642c0.351-4.882-0.742-8.33-6.288-8.201c-7.707,0.073-15.416,0.021-22.724,0.021v-22.76 c7.308,0,15.017-0.053,22.724,0.021c5.544,0.13,6.64-3.323,6.288-8.201c0.033-3.547,0.038-7.095-0.007-10.642 c-0.066-5.278-1.476-6.669-6.885-6.701c-7.529-0.044-15.059-0.011-23.121-0.011v-5.671c8.062,0,15.592,0.033,23.121-0.011 c5.408-0.032,6.819-1.423,6.885-6.701c0.044-3.547,0.04-7.095,0.007-10.642c0.351-4.882-0.742-8.33-6.288-8.201 c-7.707,0.073-15.416,0.021-22.724,0.021v-13.831c0.379-7.638,5.186-13.149,13.162-15.825 c28.456-7.104,41.808-33.352,64.888-48.287c17.492-10.743,9.354,22.937,28.518,19.129 C282.127,286.309,282.455,259.681,263.752,257.836z M105.697,839.074c0.498,2.38,0.15,4.934-3.302,4.884 c-2.295-0.033-3.176,1.042-3.702,3.217c-0.26,1.076-1.713,2.383-2.793,2.559c-0.723,0.118-2.36-1.479-2.505-2.467 c-0.409-2.804-2.004-3.344-4.385-3.299c-3.709,0.07-7.424,0.116-11.131-0.006c-3.83-0.126-3.945,2.278-3.981,5.13 c-0.038,2.976,0.755,4.826,4.142,4.589c1.477-0.103,2.968,0.015,4.451-0.025c2.202-0.059,4.543-0.006,4.579,2.901 c0.039,3.187-2.477,3.119-4.78,3.068c-1.36-0.03-2.728,0.082-4.08-0.025c-3.258-0.257-4.5,1.312-4.272,4.425 c-0.041,4.353,1.027,8.028-4.883,7.506c-7.022,0.039-7.951,0.802-7.543-7.405c0.169-3.39-1.192-4.855-4.554-4.524 c-0.857,0.085-1.922,0.329-2.555-0.056c-1.2-0.729-2.156-1.861-3.213-2.825c1.006-1.017,1.944-2.121,3.057-3.004 c0.38-0.301,1.199-0.042,1.817-0.044c5.007-0.022,7.131-2.986,5.196-7.646c-0.392-0.945-1.974-1.785-3.11-1.944 c-3.651-0.437-7.442,0.158-11.117-0.121c-3.786-0.387-5.894,0.721-5.698,5.061c0.045,0.996-1.78,2.077-2.744,3.119 c-0.848-1.038-2.451-2.105-2.412-3.108c0.153-3.932-1.445-5.27-5.269-5.225c-1.017,0.012-2.491-1.899-2.973-3.215 c-0.52-1.421-0.127-3.18-0.126-4.791c0-5.24-0.002-5.268,5.3-5.954c2.366-0.306,3.023-1.787,2.927-3.889 c-0.098-2.143,0.268-4.425,2.848-4.073c1.034,0.141,2.342,2.528,2.49,3.998c0.282,2.788,1.314,4.039,4.131,3.976 c3.956-0.088,7.919-0.125,11.873,0.011c3.063,0.105,4.168-1.204,4.13-4.212c-0.036-2.816-0.326-5.041-3.916-4.755 c-2.559,0.203-4.468-0.474-4.367-3.527c0.095-2.865,2.016-3.344,4.358-3.173c2.898,0.212,3.849-1.243,3.979-4.019 c0.085-1.821,0.73-5.002,1.563-5.153c3.046-0.553,6.308-0.31,9.408,0.165c0.646,0.099,1.284,2.453,1.345,3.795 c0.224,4.967,0.374,5.207,5.401,5.214c1.361,0.002,2.929-0.422,4.027,0.116c1.271,0.623,2.94,2.09,2.942,3.194 c0.002,1.125-1.621,2.815-2.876,3.241c-1.665,0.565-3.667,0.223-5.518,0.132c-3.18-0.157-3.971,1.57-3.952,4.398 c0.019,2.703,0.495,4.64,3.783,4.569c3.956-0.085,7.916-0.055,11.873-0.012c2.165,0.024,3.322-0.763,3.826-3.068 c0.241-1.105,1.771-1.927,2.718-2.877c0.905,0.971,2.333,1.814,2.605,2.939c0.545,2.256,1.757,2.7,3.843,3.111 C108.401,831.102,105.035,835.914,105.697,839.074z M139.108,46c29.823,0,54,24.177,54,54c0,29.823-24.177,54-54,54 s-54-24.177-54-54C85.108,70.176,109.285,46,139.108,46z M19.108,212c0-29.823,24.177-54,54-54s54,24.177,54,54 c0,29.823-24.177,54-54,54S19.108,241.823,19.108,212z M144.944,857.898c-2.09,2.578-1.865,5.176-1.942,7.953 c-0.024,0.854,0.131,1.914-0.302,2.509c-2.403,3.147-3.159,2.809-5.436-0.185c-0.264-0.306-0.178-0.948-0.184-1.437 c-0.041-3.271,0.536-6.657-2.369-9.253c-0.531-0.475-0.479-1.605-0.957-3.425c1.21-1.271,2.47-3.306,4.294-4.333 c2.379-1.339,5.236-0.58,6.441,1.819C145.405,853.367,145.95,856.658,144.944,857.898z M144.996,807.941 c-2.224,2.677-1.877,5.438-1.992,8.318c-0.086,2.146-0.2,4.578-2.99,4.544c-2.765-0.034-2.874-2.475-2.933-4.614 c-0.08-2.895,0.543-5.919-2.179-8.193c-0.631-0.527-0.645-1.797-1.234-3.633c1.265-1.382,2.48-3.465,4.292-4.5 c2.341-1.338,5.233-0.649,6.476,1.731C145.382,803.404,145.991,806.744,144.996,807.941z M80.062,279.694 c17.171-3.582,56.234-25.446,59.296-50.487c5.518,22.114,30,48.729,61,48.729C162.77,319.773,120.431,321.28,80.062,279.694z M205.108,266c-29.823,0-54-24.177-54-54c0-29.823,24.177-54,54-54s54,24.177,54,54C259.108,241.823,234.932,266,205.108,266z",
    clocks: {
      size: 108,
      0: { x: 138.892, y: 100 },
      1: { x: 72.892, y: 212 },
      2: { x: 204.892, y: 212 }
    }
  },
  4: {
    height: 1041,
    width: 368.697,
    path: "M365.949,178.882c-2.159-2.705-5.464-5.038-8.725-6.201c-7.211-2.57-12.634,1.794-18.155,7.261 c-1.008-3.182-1.811-5.292-2.346-7.468c-7.207-29.311-25.676-46.993-55.052-53.142c-3.565-0.746-4.337-2.365-5.721-5.525 c-10.917-24.928-15.917-32.928-31.863-49.408c-1.625-1.679-3.453-3.192-5.144-4.761c-15.909-14.758-20.909-17.758-43.492-26.71 c-1.882-0.746-3.781-1.782-6.866-3.302c2.349-1.876,3.694-2.659,4.662-3.772c4.695-5.397,4.837-13.436,0.452-19.014 c-5.3-6.742-15-7.806-21.456-2.354c-6.714,5.67-7.304,15.417-1.328,21.919c3.617,3.935,3.297,5.361-1.725,7.153 c-2.044,0.73-4.17,1.226-6.237,1.896c-12.766,4.137-23.255,11.604-31.918,21.798c-2.372,2.791-4.778,5.622-7.539,8.002 c-15.564,13.413-26.166,29.895-31.108,49.904c-0.68,2.752-1.741,4.084-4.825,4.54c-29.053,4.299-51.461,25.809-57.16,54.556 c-0.307,1.549-0.792,3.062-1.25,4.806c-11.35-8.302-18-8.998-24.401-2.862c-5.321,5.101-6.467,13.398-1.935,19.203 c2.036,2.608,5.192,4.836,8.302,6.005c7.137,2.683,12.59-1.579,17.735-6.353c0.583,1.299,1.01,1.874,1.096,2.496 c4.046,29.315,27.997,53.277,57.825,57.393c2.223,0.307,4.062,1.874,4.644,4.041c1.308,4.861,2.891,9.682,4.787,14.345 c9.432,23.198,28.811,38.203,45.823,55.084c5.104,5.065,11.204,9.197,17.156,13.308c5.563,3.842,7.792,8.391,7.788,15.456 c-0.129,188.254-0.004,308.508,0.065,496.762c0,0.102-0.005,0.205-0.006,0.307v41.241c-2.701,0.026-5.102,0.092-7.461-0.047 c-3.499-0.206-5.37,1.456-6.735,4.558c-1.282,2.913-2.803,5.866-4.844,8.27c-6.581,7.751-16.578,7.84-23.206,0.144 c-2.254-2.617-3.797-5.94-5.255-9.119c-1.087-2.369-3.472-3.882-6.078-3.833c-3.63,0.068-7.263,0.071-10.893-0.013 c-3.163-0.074-4.936,1.432-6.143,4.306c-1.141,2.716-2.476,5.469-4.285,7.764c-8.725,11.281-23.01,6.923-27.966-5.357 c-1.496-5.628-5.039-7.274-10.521-6.767c-4.485,0.415-6.285,1.937-6.286,6.612c-0.001,15.755-0.002,31.511-0.003,47.266 c-0.001,16.376-0.012,32.752,0.006,49.127c0.004,3.646,2.039,5.706,5.586,5.765c4.244-0.151,7.724,1.078,9.747-3.72 c1.63-3.566,3.31-7.297,5.811-10.239c5.927-6.969,15.25-7.396,21.596-0.827c2.91,3.012,4.885,7.078,6.716,10.936 c1.457,3.071,3.269,4.292,7.14,3.723c2.897-0.426,5.844-0.506,8.73-0.009c4.108,0.708,6.007-0.762,7.499-3.84 c1.386-2.861,3.016-5.766,5.166-8.063c10.107-10.412,22.254-3.718,27.139,8.037c1.337,2.907,3.181,4.141,6.281,4.034 c2.715-0.094,5.446-0.058,8.257-0.038v2.091c0.319,0.001,0.631,0.004,0.951,0.004c0.362,2.11,0.473,3.786,0.947,5.352 c2.41,7.972,4.19,16.244,7.596,23.773c3.168,7.005,9.289,6.901,12.709-0.011c2.932-5.925,5.134-12.395,6.525-18.868 c4.01-18.662,2.675-37.664,2.696-56.567c0.133-118.853,0.314,0.295,0.392-118.558c0.068-103.934,0.013-377.867,0.064-481.801 c0.001-2.781-0.281-6.125,1.073-8.24c4.886-7.634,8.978-15.851,18.168-20.058c5.139-2.352,9.257-7.045,13.652-10.893 c4.267-3.736,8.16-7.904,12.459-11.599c15.452-13.278,26.023-29.619,30.885-49.451c0.909-3.707,2.926-4.598,6.161-5.73 c8.764-3.067,17.943-5.775,25.742-10.598c14.82-9.164,23.822-23.162,28.263-40.071c0.703-2.678,1.909-5.223,2.991-8.122 c11.076,8.596,18.006,9.328,24.489,3.223C369.187,192.953,370.464,184.538,365.949,178.882z M146.765,952.539 c0.498,2.38,0.15,4.934-3.302,4.884c-2.294-0.033-3.176,1.042-3.702,3.217c-0.26,1.076-1.713,2.383-2.793,2.559 c-0.723,0.118-2.36-1.479-2.504-2.467c-0.409-2.804-2.004-3.344-4.384-3.299c-3.709,0.07-7.424,0.116-11.131-0.006 c-3.83-0.126-3.945,2.278-3.981,5.13c-0.038,2.976,0.755,4.826,4.142,4.589c1.477-0.103,2.968,0.015,4.451-0.025 c2.202-0.059,4.543-0.006,4.579,2.901c0.04,3.187-2.477,3.119-4.78,3.068c-1.36-0.03-2.728,0.082-4.08-0.025 c-3.258-0.257-4.5,1.312-4.272,4.425c-0.041,4.353,1.027,8.028-4.883,7.506c-7.022,0.039-7.951,0.802-7.542-7.405 c0.168-3.39-1.192-4.855-4.555-4.524c-0.857,0.085-1.922,0.329-2.555-0.056c-1.2-0.729-2.156-1.861-3.213-2.825 c1.006-1.017,1.944-2.121,3.057-3.004c0.379-0.301,1.199-0.042,1.817-0.044c5.007-0.022,7.131-2.986,5.197-7.646 c-0.393-0.945-1.975-1.785-3.11-1.944c-3.651-0.437-7.442,0.158-11.117-0.121c-3.786-0.387-5.894,0.721-5.698,5.061 c0.045,0.996-1.78,2.077-2.744,3.119c-0.848-1.038-2.451-2.105-2.412-3.108c0.153-3.932-1.445-5.27-5.269-5.225 c-1.017,0.012-2.491-1.899-2.973-3.215c-0.52-1.422-0.127-3.18-0.126-4.791c0.001-5.24-0.002-5.268,5.3-5.954 c2.366-0.306,3.023-1.787,2.927-3.889c-0.098-2.143,0.268-4.425,2.848-4.073c1.034,0.141,2.342,2.528,2.49,3.998 c0.282,2.788,1.314,4.039,4.131,3.976c3.956-0.088,7.919-0.125,11.872,0.011c3.063,0.105,4.168-1.204,4.13-4.212 c-0.035-2.816-0.326-5.041-3.916-4.755c-2.559,0.203-4.468-0.474-4.367-3.527c0.095-2.865,2.016-3.344,4.358-3.173 c2.898,0.212,3.849-1.243,3.979-4.019c0.085-1.821,0.73-5.002,1.563-5.153c3.046-0.553,6.308-0.31,9.408,0.165 c0.646,0.099,1.284,2.453,1.345,3.795c0.224,4.967,0.375,5.207,5.402,5.214c1.361,0.002,2.928-0.423,4.027,0.116 c1.272,0.623,2.94,2.09,2.943,3.194c0.002,1.125-1.621,2.815-2.876,3.241c-1.666,0.565-3.668,0.223-5.518,0.132 c-3.18-0.157-3.971,1.57-3.952,4.398c0.019,2.703,0.495,4.64,3.783,4.569c3.957-0.085,7.916-0.055,11.874-0.012 c2.166,0.024,3.322-0.763,3.826-3.068c0.242-1.105,1.771-1.927,2.718-2.877c0.905,0.971,2.333,1.814,2.605,2.939 c0.545,2.256,1.757,2.7,3.843,3.111C149.469,944.566,146.104,949.379,146.765,952.539z M252.621,98.898 c0.287-0.167,0.574-0.334,0.861-0.502c2.841,6.521,5.683,13.042,8.739,20.056c-4.719,1.002-8.414,1.787-12.443,2.642 C250.758,113.446,251.689,106.172,252.621,98.898z M184.136,46.188c29.823,0,54,24.177,54,54c0,29.823-24.177,54-54,54 s-54-24.177-54-54C130.136,70.365,154.313,46.188,184.136,46.188z M162.097,165.903c14.218,3.796,27.946,4.565,42.414-0.072 c-3.942,14.414-4.001,28.063,0.302,42.583c-14.189-3.96-27.779-4.487-42.527-0.062C166.547,193.78,166.444,180.286,162.097,165.903 z M114.049,99.643c0.292,0.134,0.583,0.269,0.875,0.403c1.095,7.133,2.19,14.267,3.378,22.01 c-3.852-0.843-7.747-1.695-12.458-2.726C108.69,112.502,111.369,106.072,114.049,99.643z M114.09,275.17 c-2.992-7.299-5.446-13.283-8.044-19.622c4.192-0.951,7.557-1.714,11.303-2.564C116.293,260.174,115.314,266.84,114.09,275.17z  M97.136,240.188c-29.823,0-54-24.177-54-54c0-29.823,24.177-54,54-54s54,24.177,54,54 C151.136,216.012,126.96,240.188,97.136,240.188z M190.317,961.816c-2.889,3.631-2.59,7.316-2.675,11.229 c-0.063,2.929-0.301,6.185-4.102,6.083c-3.718-0.099-3.92-3.373-3.912-6.266c0.01-3.961,0.532-7.956-2.966-11.069 c-0.843-0.75-0.86-2.433-1.653-4.938c1.737-1.842,3.427-4.577,5.876-5.996c3.218-1.864,7.078-0.801,8.743,2.361 C190.908,955.651,191.666,960.12,190.317,961.816z M190.377,894.286c-2.75,3.639-2.754,7.277-2.731,11.231 c0.017,2.954-0.303,6.162-3.967,6.219c-3.722,0.058-4.036-3.156-4.069-6.118c-0.044-3.915,0.729-7.982-2.898-11.07 c-0.855-0.728-0.902-2.408-1.792-5.047c1.877-1.885,3.726-5.163,6.313-5.925c2.41-0.711,6.606,0.411,8.177,2.279 C190.999,887.744,191.681,892.56,190.377,894.286z M190.399,830.196c-3.107,3.329-2.592,6.926-2.795,10.682 c-0.086,1.597-0.323,3.33-1.04,4.717c-1.41,2.725-4.298,2.744-5.822,0.114c-0.63-1.087-1.04-2.453-1.075-3.706 c-0.125-4.43,0.653-9.009-3.304-12.472c-0.62-0.543-0.572-1.852-0.833-2.806c-0.315-0.34-0.629-0.679-0.944-1.019 c2.103-2.244,3.85-5.571,6.413-6.415c2.391-0.788,6.184,0.324,8.392,1.933C192.319,823.355,192.864,827.555,190.399,830.196z  M184.136,328.188c-29.823,0-54-24.177-54-54c0-29.823,24.177-54,54-54s54,24.177,54,54 C238.136,304.012,213.96,328.188,184.136,328.188z M252.789,277.752c-0.265-0.133-0.531-0.265-0.796-0.398 c-1.015-8.257-2.029-16.515-3.086-25.115c4.167,0.862,8.324,1.721,13.585,2.809C259.162,262.841,255.975,270.297,252.789,277.752z  M271.136,240.188c-29.823,0-54-24.177-54-54c0-29.823,24.177-54,54-54c29.823,0,54,24.177,54,54 C325.137,216.012,300.96,240.188,271.136,240.188z",
    clocks: {
      size: 108,
      0: { x: 184.245, y: 100 },
      1: { x: 97.245, y: 186 },
      2: { x: 271.245, y: 186 },
      3: { x: 184.245, y: 274 }
    }
  },
  5: {
    height: 1148.657,
    width: 368.698,
    path: "M364.919,177.185c-5.856-6.593-15.147-6.888-21.897-0.694c-3.717,3.411-4.299,3.242-5.541-1.587 c-0.25-0.972-0.571-1.926-0.803-2.901c-6.223-26.032-22.396-42.736-47.523-51.238c-2.474-0.837-4.808-2.72-6.666-4.641 c-6.618-6.844-12.426-14.598-19.638-20.709c-7.25-6.144-14.426-11.753-15.964-21.863c-0.145-0.952-0.81-1.83-1.262-2.728 c-10.14-20.142-26.293-32.5-48.2-37.503c-2.572-0.587-5.014-1.743-8.025-2.817c1.316-1.702,1.86-2.531,2.526-3.247 c6.502-6.986,6.698-15.783,0.465-21.94c-5.785-5.714-15.027-5.762-20.84-0.11c-6.368,6.191-6.436,15.084,0.239,21.857 c2.991,3.035,1.728,4.561-1.167,5.98c-1.334,0.654-2.844,0.952-4.281,1.387c-24.857,7.514-40.936,23.712-48.399,48.654 c-0.748,2.499-2.69,4.83-4.561,6.77c-8.684,9.004-17.485,17.897-26.377,26.695c-1.782,1.764-3.95,3.591-6.269,4.287 c-27.272,8.186-44.245,25.906-50.386,53.864c-0.306,1.391-0.752,2.75-1.182,4.299c-11.942-8.326-18.43-8.891-24.733-2.424 c-5.16,5.294-6.085,13.716-1.351,19.24c2.253,2.629,5.655,4.841,8.962,5.874c6.77,2.115,12.009-1.8,16.717-6.757 c0.647,1.364,1.068,1.923,1.182,2.539c5.495,29.672,22.939,48.289,51.806,56.504c1.891,0.538,3.666,2.056,5.112,3.503 c8.725,8.731,17.397,17.519,25.942,26.426c1.755,1.83,3.532,4.061,4.227,6.423c5.507,18.702,16.574,32.696,33.076,43.228 c6.667,4.255,11.428,11.52,16.987,17.48c0.5,0.535,0.688,1.544,0.692,2.334c0.044,10.877,0.03,21.753,0.03,32.638 c-1.577,0.516-2.845,0.932-4.113,1.346c-17.135,5.597-30.511,16.033-39.024,31.952c-3.426,6.407-5.333,13.646-7.754,20.57 c-1.76,5.033-3.129,5.54-6.907,2.08c-2.706-2.478-6.172-4.068-9.837-4.235c-8.598-0.392-15.176,6.223-15.67,13.97 c-0.384,6.021,2.865,11.744,8.198,14.44c5.638,2.851,12.01,2.021,16.818-2.189c2.562-2.243,5.668-1.656,6.923,1.51 c1.187,2.993,1.799,6.229,3.124,9.149c2.549,5.62,4.886,11.444,8.247,16.568c9.497,14.478,39.422,28.018,39.422,28.018v28.542 c0,0-0.496,0.466-0.788,0.469c-5.522,0.049-11.045,0.088-16.568,0.095c-9.805,0.013-10.191,0.382-10.188,9.959 c0.001,2.347-0.002,4.695,0,7.042c0.008,7.059,1.061,8.147,7.942,8.157c6.643,0.01,13.286,0.002,20.223,0.002 c-0.115,2.368-0.198,4.098-0.292,6.035c-7.528,0-14.546,0.054-21.562-0.02c-3.56-0.037-6.383,2.854-6.323,6.415 c0.064,3.826-0.011,7.654,0.01,11.481c0.033,5.918,1.364,7.248,7.324,7.269c6.815,0.024,21.22,0.006,21.22,0.006v7.044 c0,0-14.435-0.017-21.108,0.005c-6.069,0.02-7.373,1.289-7.434,7.19c-0.028,2.682,0.18,5.38-0.039,8.044 c-0.443,5.389,0.07,10.039,6.912,10.524c-3.015,31.457-2.572,62.398,2.234,93.196c2.98,19.097,7.19,37.854,16.599,55.063 c1.443,2.639,2.397,5.924,2.406,8.914c0.209,63.543,0.251,127.087,0.325,190.631c0.002,1.795,0,3.59,0,5.442 c-5.238,0.679-7.397-1.369-7.347-5.986c0.035-3.185,0.024-6.371,0.006-9.557c-0.034-5.945-1.325-7.274-7.309-7.285 c-17.074-0.032-34.148-0.022-51.222-0.026c-11.718-0.003-23.435-0.029-35.153,0.013c-5.235,0.019-6.699,1.54-6.756,6.814 c-0.038,3.521-0.04,7.042,0.004,10.563c0.066,5.255,1.516,6.725,6.823,6.744c11.215,0.04,22.431,0.01,33.646,0.013 c11.868,0.003,11.868,0.005,11.75,11.912c-0.059,5.922-1.3,7.16-7.407,7.176c-12.22,0.031-24.439,0.018-36.659,0.029 c-7.054,0.006-8.155,1.08-8.167,7.935c-0.004,2.18-0.006,4.359,0.001,6.539c0.021,6.383,1.222,7.644,7.439,7.655 c11.048,0.02,22.096,0.002,33.144,0.006c11.791,0.005,11.791,0.008,11.648,12.012c-0.067,5.703-1.367,7.062-7.047,7.083 c-10.378,0.04-20.758,0.096-31.135-0.002c-15.122-0.144-14.146-0.478-14.047,14.132c0.038,5.646,1.377,6.992,7.074,7.008 c11.048,0.031,22.096,0.007,33.144,0.01c12.19,0.003,12.19,0.005,12.011,12.153c-0.083,5.597-1.413,6.924-7.187,6.944 c-10.211,0.034-20.423,0.089-30.633-0.001c-15.773-0.139-14.465-0.577-14.406,14.774c0.024,6.173,1.313,7.37,7.73,7.375 c13.726,0.011,27.452,0.005,41.179,0.003c14.898-0.002,29.796,0.018,44.694-0.027c5.339-0.016,6.767-1.487,6.831-6.742 c0.033-2.682-0.046-5.366,0.02-8.047c0.126-5.106,1.839-6.469,8.044-5.697c0,5.722-0.455,11.611,0.097,17.404 c1.078,11.308,2.634,22.631,8.667,32.623c3.709,6.143,9.563,5.816,12.753-0.612c2.984-6.015,5.833-12.625,6.409-19.174 c1.579-17.969,2.543-36.045,2.614-54.083c0.36-91.878,0.35-183.757,0.553-275.636c0.005-2.049,0.733-4.214,1.576-6.124 c3.369-7.639,7.748-14.934,10.257-22.833c11.421-35.946,13.433-72.997,11.755-110.391c-0.269-5.99-0.801-11.968-1.209-17.909 c7.452-1.534,7.775-1.945,7.779-9.588c0.001-2.515,0.011-5.03,0.007-7.545c-0.013-7.75-0.894-8.656-8.46-8.663 c-7.141-0.007-22.406-0.001-22.406-0.001v-7.045c0,0,16.742-0.048,24.561,0.019c4.359,0.038,6.392-2,6.312-6.351 c-0.071-3.855,0.016-7.712-0.019-11.568c-0.053-5.938-1.345-7.219-7.35-7.242c-7.485-0.029-22.504-0.007-22.504-0.007v-6.035 c0,0,15.454,0.033,22.967-0.011c5.362-0.031,6.803-1.454,6.876-6.683c0.049-3.52,0.028-7.042,0.018-10.563 c-0.019-6.708-1.157-7.881-7.7-7.895c-7.319-0.016-21.161-0.004-21.161-0.004v-28.963c0,0,51.319-18.506,51.418-58.803 c13.274,8.8,19.828,9.143,25.982,1.96c4.843-5.653,4.919-13.758,0.181-19.362c-6.121-7.24-12.687-6.904-26.259,1.909 c-5.709-30.27-22.672-50.541-52.587-59.137c0-11.198-0.038-22.249,0.053-33.298c0.01-1.247,0.394-2.826,1.206-3.677 c5.143-5.394,9.736-11.741,15.851-15.695c15.582-10.074,26.618-23.168,32.069-40.997c0.628-2.052,2.154-4.251,3.897-5.472 c12.064-8.448,22.297-18.658,30.858-30.639c1.235-1.728,3.009-3,5.027-3.661c25.276-8.284,41.218-25.241,47.865-51.029 c0.549-2.129,1.536-4.145,2.62-7.008c2.028,1.88,3.182,3.03,4.418,4.083c5.813,4.951,14.202,4.893,19.761-0.107 C369.847,192.788,370.428,183.388,364.919,177.185z M252.394,107.492c4.098,3.415,7.887,6.574,11.677,9.733 c-0.404,0.395-0.807,0.791-1.211,1.186c-4.169,0.785-8.338,1.57-13.15,2.476C250.666,116.112,251.516,111.872,252.394,107.492z  M184.406,46c29.823,0,54,24.177,54,54c0,29.823-24.177,54-54,54s-54-24.177-54-54C130.406,70.177,154.583,46,184.406,46z  M162.373,165.581c14.357,4.18,28.096,4.578,42.513,0.199c-4.092,14.47-3.946,28.113,0.227,42.523 c-14.26-4.037-27.868-4.509-42.273-0.152C166.659,193.831,166.896,180.189,162.373,165.581z M115.827,107.593 c1.197,5.466,2.101,9.598,3.149,14.382c-4.547-0.964-8.521-1.806-13.675-2.899C108.835,115.221,111.958,111.814,115.827,107.593z  M43.406,186c0-29.823,24.177-54,54-54s54,24.177,54,54c0,29.823-24.177,54-54,54S43.406,215.823,43.406,186z M115.278,265.909 c-3.402-3.626-6.248-6.661-9.67-10.309c4.662-1.06,8.192-1.862,12.324-2.801C117.071,257.051,116.27,261.011,115.278,265.909z  M238.406,453c0,29.823-24.177,54-54,54s-54-24.177-54-54s24.177-54,54-54S238.406,423.177,238.406,453z M184.406,328 c-29.823,0-54-24.177-54-54c0-29.823,24.177-54,54-54s54,24.177,54,54C238.406,303.823,214.23,328,184.406,328z M251.958,267.927 c-1.167-5.669-2.154-10.46-3.262-15.84c5.154,0.97,9.935,1.87,14.716,2.77c0.446,0.541,0.892,1.082,1.338,1.623 C260.673,260.129,256.595,263.778,251.958,267.927z M271.406,240c-29.823,0-54-24.177-54-54c0-29.823,24.177-54,54-54 c29.823,0,54,24.177,54,54C325.406,215.823,301.23,240,271.406,240z",
    clocks: {
      size: 108,
      0: { x: 184.245, y: 100 },
      1: { x: 97.245, y: 186 },
      2: { x: 271.245, y: 186 },
      3: { x: 184.245, y: 274 },
      4: { x: 184.245, y: 453 }
    }
  },
  6: {
    height: 1148.98,
    width: 370.141,
    path: "M365.84,176.489c-5.689-5.831-14.774-6.109-20.983-0.642c-4.677,4.118-4.976,4.085-6.414-2.269 c-6.187-27.333-22.732-44.97-49.412-53.347c-1.887-0.593-3.769-2.168-4.983-3.788c-8.33-11.115-18.008-20.785-29.318-28.894 c-1.84-1.32-3.239-3.825-3.948-6.065c-8.013-25.306-24.804-41.278-50.453-47.985c-1.299-0.34-2.628-0.562-3.93-0.89 c-6.029-1.519-6.346-2.456-2.44-7.102c5.378-6.396,4.93-15.201-1.065-20.921c-5.702-5.442-14.806-5.447-20.582-0.013 c-6.006,5.651-6.507,14.545-1.066,20.88c0.962,1.12,2.36,1.865,5.102,3.969c-3.997,1.969-6.466,3.647-9.192,4.455 c-21.058,6.239-37.094,18.816-44.941,39.357c-3.899,10.207-9.562,17.625-17.758,24.394c-6.646,5.489-11.704,12.883-17.615,19.294 c-1.38,1.497-3.203,3.002-5.097,3.546c-28.343,8.127-45.563,26.507-51.567,55.389c-0.195,0.941-0.595,1.84-1.211,3.697 c-4.56-5.357-9.738-8.928-16.367-7.261c-3.226,0.811-6.599,2.778-8.897,5.184c-5.104,5.343-4.779,13.776,0.038,19.336 c6.068,7.004,12.02,6.721,25.619-1.458c0.72,3.007,1.322,5.896,2.106,8.735c7.133,25.831,23.797,42.127,49.404,49.659 c2.498,0.735,4.874,2.61,6.784,4.488c8.593,8.445,17.053,17.028,25.427,25.692c1.767,1.828,3.636,4.007,4.323,6.356 c5.597,19.138,16.997,33.318,33.994,43.913c6.567,4.094,11.118,11.439,16.51,17.374c0.48,0.528,0.534,1.578,0.536,2.386 c0.033,10.743,0.022,21.486,0.022,30.697c-9.552,5.427-18.816,9.569-26.776,15.469c-12.547,9.299-19.949,22.422-23.771,37.578 c-0.68,2.698-2.102,5.208-3.473,8.506c-2.286-2.126-3.461-3.29-4.711-4.367c-6.067-5.231-15.003-4.872-20.573,0.801 c-5.603,5.707-5.839,14.698-0.54,20.569c5.565,6.166,14.515,6.88,20.866,1.665c5.112-4.197,5.412-3.946,8.069,2.516 c3.43,8.344,6.359,17.082,11.089,24.661c8.379,13.426,21.019,21.894,36.078,26.785c1.434,0.466,3.551,2,3.587,3.097 c0.294,8.853,0.165,17.72,0.165,27.124c-7.476,0-14.485-0.043-21.493,0.014c-5.306,0.044-6.687,1.494-6.735,6.878 c-0.033,3.697-0.03,7.394-0.004,11.091c0.042,5.943,1.284,7.157,7.436,7.185c6.702,0.031,13.405,0.007,20.448,0.007 c0,2.034,0,5.598,0,5.598s-13.784-0.034-20.783,0.011c-5.372,0.035-6.799,1.45-6.861,6.724c-0.047,4.026,0.044,8.054-0.023,12.079 c-0.072,4.325,1.898,6.385,6.299,6.345c6.876-0.063,13.753,0.049,20.629,0.113c0.289,0.003,1.739,0.534,1.739,0.534v6.407 c0,0-14.692-0.032-21.682,0.01c-5.652,0.034-7.334,1.395-6.872,7.119c0.694,8.601-1.289,15.249-8.006,21.638 c-8.605,8.185-13.036,19.34-15.463,31.089c-1.309,6.335-2.096,6.555-6.889,2.398c-6.287-5.453-15.195-5.103-20.871,0.819 c-5.657,5.902-5.624,15.003,0.076,20.896c5.702,5.895,14.51,6.153,20.855,0.613c1.117-0.975,2.238-1.945,4.238-3.682 c1.129,2.807,2.274,4.924,2.843,7.186c4.769,18.938,15.137,33.728,31.864,44.051c1.736,1.072,3.27,3.377,3.775,5.392 c3.397,13.548,7.363,26.834,14.685,38.904c0.804,1.325,1.03,3.177,1.033,4.786c0.118,64.926,0.18,129.852,0.239,194.778 c0.001,0.981-0.122,1.963-0.184,2.894c-5.249,0.709-6.974-0.588-7.13-5.358c-0.109-3.352-0.003-6.71-0.024-10.065 c-0.036-5.705-1.357-7.092-7.019-7.099c-21.978-0.026-43.956-0.012-65.933-0.011c-7.046,0-14.094,0.1-21.138-0.026 c-4.635-0.083-6.728,2.003-6.589,6.633c0.109,3.639,0.121,7.278-0.002,10.917c-0.157,4.646,1.947,6.703,6.575,6.67 c12.75-0.09,25.501-0.045,38.251-0.028c6.305,0.008,7.513,1.253,7.533,7.599c0.038,11.525,0.038,11.526-11.68,11.525 c-11.24-0.001-22.481-0.03-33.722,0.007c-5.418,0.018-6.914,1.437-6.931,6.666c-0.053,16.568-1.437,15.572,15.235,15.484 c10.066-0.053,20.132-0.038,30.198,0.002c5.373,0.021,6.796,1.457,6.905,6.697c0.259,12.419,0.259,12.42-12.268,12.419 c-11.073,0-22.146-0.028-33.218,0.011c-5.319,0.019-6.822,1.501-6.857,6.738c-0.102,15.018-1.068,14.544,14.31,14.408 c10.401-0.092,20.803-0.047,31.205-0.005c5.279,0.022,6.729,1.522,6.828,6.773c0.234,12.342,0.234,12.342-12.345,12.342 c-11.073,0-22.146-0.031-33.218,0.012c-5.25,0.02-6.76,1.539-6.779,6.814c-0.06,16.24-1.382,15.39,14.882,15.343 c26.004-0.075,52.009-0.015,78.013-0.024c6.592-0.002,7.763-1.211,7.767-7.876c0.001-2.349-0.056-4.699,0.01-7.046 c0.144-5.087,1.794-6.38,6.391-5.865c1.57,11.962,2.907,23.747,4.765,35.449c0.647,4.073,1.998,8.292,4.104,11.797 c1.828,3.041,5.159,7.119,7.859,7.143c2.656,0.024,6.805-4.019,7.763-7.073c3.09-9.85,6.148-19.959,7.106-30.167 c1.295-13.794,0.763-27.772,0.787-41.671c0.158-91.433,0.238-182.866,0.46-274.299c0.006-2.499,0.844-5.29,2.131-7.444 c7.151-11.972,11.314-25.021,14.283-38.502c0.767-3.483,2.275-5.895,5.318-7.958c14.472-9.809,23.801-23.321,28.184-40.279 c0.711-2.753,1.981-5.361,3.281-8.798c2.096,1.947,3.257,3.114,4.508,4.173c6.274,5.312,15.319,4.747,20.867-1.276 c5.371-5.83,5.28-14.718-0.209-20.541c-5.593-5.933-14.657-6.313-20.861-0.875c-4.91,4.304-5.502,4.183-6.871-2.32 c-2.843-13.501-9.129-25.091-18.636-35.051c-1.059-1.109-1.624-3.064-1.703-4.662c-0.225-4.519-0.177-9.058-0.049-13.584 c0.13-4.584-1.863-6.712-6.52-6.641c-7.688,0.117-23.46,0.032-23.46,0.032v-7.081c0,0,15.513,0.035,23.187-0.012 c5.264-0.032,6.699-1.51,6.757-6.834c0.042-3.858,0.047-7.718-0.001-11.576c-0.066-5.278-1.476-6.669-6.885-6.701 c-7.529-0.044-22.059-0.011-22.059-0.011v-6.073c0,0,14.421,0.036,22.088-0.012c5.373-0.034,6.792-1.451,6.855-6.73 c0.048-4.026-0.055-8.054,0.028-12.079c0.089-4.361-1.944-6.374-6.308-6.332c-7.707,0.073-23.662,0.021-23.662,0.021 s0-18.743,0-28.6c29.397-8.459,46.462-28.621,52.535-59.535c5.681,5.182,10.784,9.539,17.649,7.382 c3.324-1.045,6.767-3.214,9.025-5.845c4.929-5.744,3.921-14.326-1.559-19.637c-6.511-6.312-13.714-5.558-25.117,3.388 c-5.85-30.371-22.706-50.809-52.896-59.482c0-11.328-1.021-22.855,0.356-34.088c0.927-7.564,7.385-13.291,13.943-17.092 c17.546-10.17,29.776-24.263,35.419-43.925c0.495-1.726,2.182-3.403,3.745-4.482c12.023-8.304,22.113-18.494,30.667-30.315 c1.255-1.734,3.402-3.24,5.446-3.923c25.095-8.384,41.101-25.168,47.682-50.873c0.553-2.159,1.517-4.212,2.638-7.26 c1.992,1.814,3.143,2.911,4.345,3.949c6.307,5.446,15.194,5.081,20.928-0.844C371.579,191.607,371.538,182.33,365.84,176.489z M253.55,107.072c4.157,3.613,7.747,6.732,11.337,9.852c-0.326,0.501-0.652,1.003-0.979,1.504 c-4.182,0.798-8.365,1.596-13.163,2.512C251.718,116.132,252.577,111.882,253.55,107.072z M185.289,45.98c29.823,0,54,24.177,54,54 c0,29.823-24.177,54-54,54s-54-24.177-54-54C131.289,70.157,155.466,45.98,185.289,45.98z M164.151,165.773 c13.581,4.334,27.363,4.22,41.777,0.199c-4.474,14.48-3.87,28.139,0.027,42.429c-14.232-4.098-27.748-4.399-41.531-0.444 c0.777-7.312,2.093-14.066,2.044-20.809C166.419,180.244,165.032,173.349,164.151,165.773z M116.538,107.809 c1.209,5.322,2.145,9.436,3.252,14.311c-4.762-1.06-8.731-1.943-13.791-3.07C109.65,115.157,112.775,111.823,116.538,107.809z M98.289,239.98c-29.823,0-54-24.177-54-54c0-29.823,24.177-54,54-54s54,24.177,54,54 C152.289,215.804,128.113,239.98,98.289,239.98z M115.949,265.97c-3.407-3.594-6.205-6.546-9.77-10.308 c5.012-1.059,8.587-1.815,12.604-2.664C117.803,257.484,116.976,261.266,115.949,265.97z M239.289,683.98c0,29.823-24.177,54-54,54 s-54-24.177-54-54s24.177-54,54-54S239.289,654.157,239.289,683.98z M239.289,452.98c0,29.823-24.177,54-54,54s-54-24.177-54-54 s24.177-54,54-54S239.289,423.157,239.289,452.98z M185.289,327.98c-29.823,0-54-24.177-54-54c0-29.823,24.177-54,54-54 s54,24.177,54,54C239.289,303.804,215.113,327.98,185.289,327.98z M253.079,268.69c-1.271-6.405-2.241-11.297-3.279-16.525 c5.356,1.047,10.057,1.966,16.634,3.251C261.644,260.177,257.764,264.034,253.079,268.69z M272.289,239.98 c-29.823,0-54-24.177-54-54c0-29.823,24.177-54,54-54c29.823,0,54,24.177,54,54C326.289,215.804,302.113,239.98,272.289,239.98z",
    clocks: {
      size: 108,
      0: { x: 185.128, y: 100 },
      1: { x: 98.128, y: 186 },
      2: { x: 272.128, y: 186 },
      3: { x: 185.128, y: 274 },
      4: { x: 185.128, y: 453 },
      5: { x: 185.128, y: 684 }
    }
  }
}, Va = {
  teeth: {
    tall: {
      viewBox: "0 0 512 1540",
      paths: {
        frame: "M0,0v1540l512-244.2V0H0z M451,1263.5l-390,186V61h390V1263.5z",
        half: "M0,0v748l512-244.2V0H0z",
        full: "M0,0v1540l512-244.2V0H0z"
      }
    },
    med: {
      viewBox: "0 0 512 1540",
      paths: {
        frame: "M0,0v1388l512-395.6V0H0z M458,965.7L54,1278V53h404V965.7z",
        full: "M0,0v1540l512-244.2V0H0z"
      }
    },
    short: {
      viewBox: "0 0 512 1540",
      paths: {
        frame: "M0,0v991l511.4-247L512,0H0z M470.5,715.2L41,922.6V40h430L470.5,715.2z",
        full: "M0,0v991l511.4-247L512,0H0z"
      }
    }
  },
  armor: {
    viewBox: "0 0 512 512",
    paths: {
      heavy: "M157.5,80.7c-20.6,13.7-46,22.5-69.4,26c6.8,48.9,26.1,84.1,46,97.8 c10.5,7.3,20.4,9,30.4,5.6c8.9-3.1,18.6-11,27.8-25.6C165.3,154.3,160.6,113.5,157.5,80.7L157.5,80.7z M354.5,80.8 c-3.1,32.8-7.8,73.6-34.7,103.8c9.1,14.6,18.9,22.5,27.8,25.6c10,3.4,19.8,1.7,30.4-5.6c19.8-13.7,39.1-48.8,45.9-97.7 C399.3,103.7,376,95.5,354.5,80.8L354.5,80.8z M254.4,67.9c-37.1,0-69.8,8.3-89.6,21c1.2,6.5,2.6,13,4.2,19.3 c19.2-8.2,50.3-16.7,85.4-16.7c35.2,0,66.3,8.5,85.4,16.7c1.7-6.3,3.1-12.8,4.2-19.3C324.2,76.2,291.5,67.9,254.4,67.9z M64.9,127.9l-47.7,45.5c29.8,37.2,63,56.8,86.5,58.7c1.1,0.1,2.3,0.1,3.3,0.2c1.8-7.6,4-15.1,6.5-22.3 C91.7,194.9,74.4,166.1,64.9,127.9L64.9,127.9z M447.1,127.9c-9.6,38.3-26.9,67-48.6,82c0,0-0.1,0-0.1,0.1 c2.5,7.3,4.7,14.7,6.5,22.3c1.1,0,2.2-0.1,3.4-0.2c23.4-1.9,56.8-21.5,86.5-58.7L447.1,127.9L447.1,127.9z M176,139.4 c5.7,12.2,13.1,23.3,22.9,32.8l6.4,6.2l-4.3,7.8c-2.3,4.1-4.6,8-7,11.7c40.8,15,85,14,124-0.2c-2.4-3.6-4.6-7.4-6.9-11.4l-4.3-7.8 l6.4-6.2c9.4-9.1,16.7-19.9,22.3-31.5C280.8,153.8,228.5,151.3,176,139.4L176,139.4z M401.7,243.6c0,0-3.7,38.1-22.9,76.1 l-121.7-32.7l-1.8-0.4l-1.8,0.4l-120.3,32.7c-19-38-22.7-76.1-22.7-76.1s12,3.8,19.5-18.7c10.7,3.2,22,3.3,32.8-0.4 c9.2-3.2,17.8-8.8,25.8-16.9c21.6,8.9,44.2,13.1,66.7,13.1c22.7,0,45.6-4.2,67.4-13.1c8,8,16.8,13.7,26.1,16.9 c10.9,3.7,22.3,3.6,33.1,0.4C389.6,247.4,401.7,243.6,401.7,243.6z M486.1,210.7c-25.4,24.2-52.1,38-76.2,40c-0.4,0-0.9,0-1.3,0.1 c1.2,8.1,2,16.2,2.3,24.4c22.8,3.8,54.7,0.1,90-14.3L486.1,210.7L486.1,210.7z M25.9,210.8l-14.8,50.1c35.3,14.4,67.2,18.1,90,14.3 c0.3-8.2,1.1-16.3,2.3-24.4c-0.4,0-0.9,0-1.3-0.1C78,248.7,51.3,234.9,25.9,210.8L25.9,210.8z M256,305.2l-114.8,28.1 c1.9,7.7,10.1,17.6,15.4,23.8c31.8-7.3,59.3-11.4,94.7-11.6c2.6,0,5.3,0,7.9,0c38.2,0.3,64.9,4.3,95.9,11.6 c5.1-6.2,15.2-15.8,16.8-23.6L256,305.2L256,305.2z M254.1,347.8l-79.3,22.1c5.8,4.8,16,8.5,23.2,13.3c18-5,33.5-7.8,53.5-7.9 c1.5,0,3,0,4.5,0c21.6,0.2,36.6,3,54.1,7.9c9.9-1.8,16.8-6.8,25.5-12.3L254.1,347.8L254.1,347.8z M373.3,377.7 c-68.3,55.6-166.9,55.7-235.3,0.3l-1.8,35.9c4.7,7.9,18.3,17,38,23c21,6.4,48,9.9,75.6,10.2c27.6,0.3,55.8-2.6,79.4-8.7 c21.6-5.6,39.3-14.2,48.8-23.9L373.3,377.7L373.3,377.7z",
      light: "M254.9,88c-23.1,0-44.1,2.8-59.8,8.8c-7.9,3-14.5,6.8-19.5,11.9c-5,5.1-8.4,12.1-8.4,19.9 c0,3.2,0.5,6.2,1.5,9.1c2,37.1-20.9,83.9-46,107.5c5.9,35.9,19.4,72.7,39.6,106.3c23.8,23,54.6,35.4,85.9,37.1v-24 c-9.6-0.1-19-0.5-26.5-1.1l0.8-13.2c7.1,0.6,16.2,1,25.7,1.1v-28.3c-9.1,0.4-17.9,1.8-24.4,4.2l-3.3-12.7 c8.1-2.9,17.8-4.6,27.7-5.1v-23.8c-2.9,0.2-5.8,0.5-8.7,1c-17.2,1-31.8,3.6-45.2,7.5l-0.1-0.2c16.7-14.8,38.1-22.2,59.6-22.2 c21.4,0,42.9,7.4,59.6,22.2l-0.1,0.1c-13.4-3.9-28.1-6.5-45.4-7.5c-2.8-0.5-5.7-0.8-8.5-1v23.8c10,0.5,19.7,2.1,27.7,5.1l-3.3,12.7 c-6.6-2.4-15.4-3.8-24.5-4.2v28.3c9.4-0.1,18.6-0.4,25.7-1.1l0.8,13.2c-7.5,0.7-16.9,1-26.5,1.1v24.1c32.4-0.8,64.6-13,89.4-36.5 c21.1-33.6,34.9-69.9,40.8-105.3c-26.2-23.2-50.7-72.5-47.8-110.7c0.7-2.5,1-5,1-7.7c0-7.8-3.4-14.8-8.4-19.9 c-5-5.1-11.7-8.9-19.6-11.9C298.9,90.8,278,88,254.9,88L254.9,88z M254.9,101.3c22.3,0,42.5,2.9,56.4,8.2c7,2.7,12.4,6,15.7,9.3 c3.3,3.4,4.5,6.3,4.5,9.9c0,1.8-0.3,3.6-1.1,5.5c-21.9-11.9-49.3-17.9-76.7-17.9c-26.6,0-53.2,5.6-74.7,16.8 c-0.5-1.5-0.7-2.9-0.7-4.4c0-3.5,1.2-6.5,4.5-9.9c3.3-3.4,8.7-6.7,15.7-9.3C212.4,104.1,232.6,101.3,254.9,101.3L254.9,101.3z M253.7,130c24.6,0,49.2,4.8,68.6,14.3c-3.1,2.6-6.9,5.1-11.4,7.3c-13.9,7-33.9,11.5-56,11.5s-42-4.5-56-11.5 c-4.9-2.4-9-5.2-12.2-8C205.8,134.5,229.7,130,253.7,130z M232.3,174.9c3.7,0.5,7.5,0.9,11.4,1.2c0.5,3.6,1,7.5,1.6,11.8 c1.6,13,3.3,27.9,3.3,37.5c0,10.8-3.5,20.6-9.5,28.1c-6.1,7.5-14.5,13-24.6,16.5c-11.2,3.9-24.5,5.6-39.3,4.8 c-14.2-2.5-25.1-9.3-35.7-19.6c29.1,8.3,54.5,8.2,71.9,2.1c8.7-3.1,15.4-7.6,19.7-13c4.3-5.4,6.5-11.4,6.5-18.9 c0-7.7-1.6-22.8-3.1-35.6C233.6,184.1,232.9,179,232.3,174.9L232.3,174.9z M275,175.2c-0.6,4-1.3,9-2,14.6 c-1.6,12.7-3.1,27.9-3.1,35.6c0,7.5,2.1,13.6,6.5,18.9c4.3,5.4,11,9.9,19.7,13c17.3,6.1,42.6,6.2,71.6-2.1 c-10.6,10.3-21.5,17.1-35.7,19.6c-14.8,0.8-28-0.9-39.1-4.8c-10.1-3.5-18.5-9-24.6-16.5s-9.5-17.3-9.5-28.1 c0-9.7,1.7-24.6,3.3-37.5c0.5-4.3,1.1-8.2,1.5-11.7C267.4,176,271.2,175.7,275,175.2L275,175.2z M347.1,370.2 c-52.9,43.1-129.3,43.2-182.3,0.3l-1.4,27.8c3.6,6.1,14.2,13.2,29.4,17.8c16.3,4.9,37.2,7.7,58.5,7.9c21.4,0.2,43.2-2,61.5-6.7 c16.8-4.3,30.4-11,37.8-18.5L347.1,370.2L347.1,370.2z",
      special: "M256,14.2c-65.6,98.3-131.1,90.2-196.7,106.5c0,262.3,65.6,327.8,196.7,377 c131.1-49.2,196.7-114.7,196.7-377C387.1,104.4,321.6,112.6,256,14.2z M256,47c5.1,0,9.2,4.1,9.2,9.2s-4.1,9.2-9.2,9.2 s-9.2-4.1-9.2-9.2S250.9,47,256,47z M70.6,138.2c0-5.1,4.1-9.2,9.2-9.2s9.2,4.1,9.2,9.2s-4.1,9.2-9.2,9.2S70.6,143.3,70.6,138.2z M92.1,301.1c-5.1,0-9.2-4.1-9.2-9.2c0-5.1,4.1-9.2,9.2-9.2s9.2,4.1,9.2,9.2C101.3,296.9,97.2,301.1,92.1,301.1z M157.7,432.2 c-5.1,0-9.2-4.1-9.2-9.2c0-5.1,4.1-9.2,9.2-9.2s9.2,4.1,9.2,9.2C166.9,428.1,162.7,432.2,157.7,432.2z M256,483.4 c-5.1,0-9.2-4.1-9.2-9.2s4.1-9.2,9.2-9.2s9.2,4.1,9.2,9.2S261.1,483.4,256,483.4z M354.3,432.2c-5.1,0-9.2-4.1-9.2-9.2 c0-5.1,4.1-9.2,9.2-9.2c5.1,0,9.2,4.1,9.2,9.2C363.6,428.1,359.4,432.2,354.3,432.2z M314.4,426.7c-15.8,11.1-33.7,18.7-51.1,26.8 c-6.7,4.7-14-0.5-20.7-2.5c-44.7-18.3-86.5-49.8-107.6-94.5c-29.8-63.5-33.8-135-36.7-204.3c58.8-9,115.3-28.5,156.2-72.1l1.9-2.1 c4.5,5,9.3,9.8,14.2,14.5c35.8,36.3,85,47,133.9,57.8c2.8,1.2,6.8,0.5,9.1,2c-2.7,66.4-5.7,134.9-33.1,196.4 C367.3,380.9,343.2,407.7,314.4,426.7z M419.9,301.1c-5.1,0-9.2-4.1-9.2-9.2c0-5.1,4.1-9.2,9.2-9.2s9.2,4.1,9.2,9.2 C429.1,296.9,425,301.1,419.9,301.1z M432.2,147.4c-5.1,0-9.2-4.1-9.2-9.2s4.1-9.2,9.2-9.2s9.2,4.1,9.2,9.2 S437.3,147.4,432.2,147.4z M301.1,154.9c0.2,23.3,0.3,46.6,0.5,69.9c0,1,0.4,2.2,0.9,3.1c4.9,8.4,9.8,16.9,15,25.1 c1.6,2.6,0.8,5.1,0.6,7.6c-0.7,9.5-1.7,19-2.6,28.5c-1,10.5-2,21-3,31.6c-0.8,9-1.6,17.9-2.4,26.9c-0.8,9-1.7,17.9-2.5,26.9 c-0.7,7.3-1.3,14.6-2,22c-0.1,1.2-0.6,2.7-1.4,3.6c-12,12-24.1,23.9-36.2,35.9c-0.2,0.2-0.5,0.5-1.1,1c0-1.1,0-1.8,0-2.5 c0.1-66.5,0.3-133,0.5-199.5c0-1.5,0.8-3.2,1.7-4.4c2.2-2.9,2.8-6,2.8-9.6c0-28.5,0.1-57.1,0.2-85.6c0-0.7,0-1.5,0-2.5 c0.8,0,1.5-0.1,2.3-0.1c13.9,0.1,27.8,0.1,41.7,0.1c1.2,0,1.9,0.3,2.3,1.5c0.8,2.2,1.7,4.3,2.7,6.6c-6.2,3.9-12.2,7.6-18.2,11.3 C301.6,152.6,301.1,153.4,301.1,154.9z M245.2,433.7c0,0.9,0,1.7,0,2.6c-0.2,0.1-0.4,0.2-0.6,0.3c-1.4-1.5-2.8-3.1-4.3-4.5 c-10.7-10.6-21.5-21.2-32.2-31.9c-0.9-0.9-1.6-2.5-1.7-3.9c-1-9.2-1.8-18.4-2.6-27.5c-0.7-7.2-1.3-14.3-2-21.5 c-0.8-9.2-1.7-18.4-2.6-27.5c-0.7-7.1-1.3-14.2-1.9-21.3c-0.9-9.3-1.7-18.5-2.6-27.8c-0.5-4.9-1-9.9-1.3-14.8 c-0.1-0.7,0.4-1.6,0.8-2.2c5.1-8.6,10.2-17.1,15.2-25.7c0.5-0.9,0.9-2.1,0.9-3.1c0.2-23.2,0.3-46.4,0.5-69.6c0-1.6-0.5-2.5-1.9-3.4 c-6-3.6-11.9-7.3-18-11.2c1-2.5,2-4.9,3.1-7.4c0.2-0.3,0.8-0.6,1.2-0.6c14.6-0.1,29.3-0.1,43.9-0.1c0.1,0,0.3,0.1,0.6,0.3 c0,0.7,0.1,1.5,0.1,2.3c0.1,29.2,0.2,58.4,0.3,87.7c0,2.1,0.3,4,1.7,5.6c2.5,2.9,3,6.2,3,10C244.9,303.4,245.1,368.5,245.2,433.7z",
      specialBg: "M316.9,432.4c-16.5,11.6-35,19.4-53.1,27.8c-7,4.9-14.6-0.5-21.6-2.6 c-46.5-19-90-51.8-111.9-98.3c-31-66.1-35.1-140.5-38.2-212.4c61.2-9.4,119.9-29.6,162.4-75l2-2.1c4.7,5.2,9.6,10.2,14.7,15.1 c37.2,37.7,88.4,48.9,139.2,60.1c2.9,1.3,7.1,0.5,9.4,2.1c-2.9,69.1-5.9,140.3-34.4,204.3C372,384.8,346.8,412.7,316.9,432.4z"
    }
  },
  ReducedEffect: {
    viewBox: "0 0 512 512",
    paths: {
      main: "M260.7,487.55C133,487.55,28.39,382.92,28.39,255.23S133,24.45,260.7,24.45A230.5,230.5,0,0,1,491.49,255.23c0,127.69-103.1,232.32-230.78,232.32Zm-1.06-82L377,287.58l-23.94-25.1-65.41,37.94V128a167.28,167.28,0,0,1,103.6,268.91,193.71,193.71,0,0,0,61.22-141.63A191.18,191.18,0,0,0,260.7,63.45c-106.39,0-193.31,85.39-193.31,191.78A192.9,192.9,0,0,0,128,395.55,167.3,167.3,0,0,1,231,128.2V296.92l-62.5-35.62-25.09,26.28Z"
    },
    classes: {
      main: "fill-linear"
    }
  },
  ComplicationMinor: {
    viewBox: "0 0 512 512",
    paths: {
      main: "M345.58,263.18l39.74-8.31,73.29-15.3,22.83-4.79,2.81-.58,9.56-2V213.1l-6.33,1.33-79.55,16.62-26.49,5.54-55.93,11.69c-13-11.18-20-24.73-27.16-39.89l-1.67-3.53,34.18-46.76,57.87-79.18,3-4.1,41.19-56.33H409.77L375.26,65.7l-4.09,5.59-60.51,82.78-32.91,45c-15.06-6.36-26.14-17.76-38.57-30.33l-2.34-2.37-4.59-30.28L216.72,33.5l-1-6.47-1.29-8.54h-18.9l2.84,18.75-.11-4.41,15.2,104.1,5.59,37c-11.18,7.5-24.44,12.15-39,15.49l-22.9-28.89L93.8,80.58,44.58,18.49H20.74l53,66.83,4.18,5.26,66.54,84,19.15,24.16-.08.7c-1.93,17.37-8.88,29.63-16.65,43.07L115.3,234.2,25.49,210.61,23.08,210l-4.31-1.14v19.32l2.56.67L112,252.65l27.61,7.25.56,1.4c6.1,15.15,5.39,31.77,2.9,49.71l-30.31,14.2L23.15,367.14l-4.38,2.06v20.62l9.18-4.3,67.92-31.77,17.13-8,28.92-13.54,1.52,1.53c5.85,5.86,10,10.29,11.22,20.75l-31.14,31.3L56.27,453.39l-37.5,37.69v2.43h24l20.91-21h0l77.94-78.36,24.11-24.24,1-.23c23.75-5.79,59.86-6.75,80.11-6.78,4,0,6.81,0,9.35.08l10.4,32.29L293,477.73l1.54,4.78,3.54,11h19.63l-5.19-16.14-2.24-6.95-25.77-80.06-11-34.32c3.55-3.17,8.73-7.63,15-12.42,11.42-8.73,26.21-17.7,35.68-19.62l4.24-.87,25.37,10L442,368.08l4.18,1.66,47.6,18.83V368.48l-37.78-15-5.21-2-82.75-32.74-36.59-14.48c0-13.16,1.4-22.85,9.12-33.93Zm-61.35-41.29c5.12,10.41,11.11,21.1,19.66,30.91l-31.15,6.52a39.69,39.69,0,0,0-6.93-12.22Zm-62.13-28,6,39.74a39.25,39.25,0,0,0-10.25,3.48l-25.18-31.77A132,132,0,0,0,222.1,193.9Zm-43.39,23.92,24.91,31.43a38.6,38.6,0,0,0-4.08,7.07l-33.92-8.92C170.58,238.65,175.45,229.15,178.71,217.82Zm17.49,56.93a39.32,39.32,0,0,0,2.08,10.45L163,301.7c1.05-11.91.92-24.05-2-36.2ZM160,324.27l.09-.55,47.15-22.07h0L169.55,339.5A54.79,54.79,0,0,0,160,324.27Zm28.37,22.85,36.61-36.8a39.43,39.43,0,0,0,10.6,1.45,35.54,35.54,0,0,0,4-.2L250,344.11C236.7,344,212.41,344.2,188.33,347.12ZM250.78,236a35.39,35.39,0,0,0-3.61-1.32L241.46,197a109.45,109.45,0,0,0,25.15,17.38Zm26.37,92.76c-3.9,3-7.1,5.61-9.88,8l-10.1-31.4a39.81,39.81,0,0,0,8.16-7.16l36.5,14.44A169,169,0,0,0,277.15,328.76Zm36-31.76L273.9,281.47c.26-1.14.47-2.29.64-3.44l45.58-9.53C315.5,277.93,313.74,287.39,313.17,297Z"
    },
    classes: {
      main: "fill-radial"
    }
  },
  ComplicationMajor: {
    viewBox: "0 0 512 512",
    paths: {
      main: "M458.26,239.57l22.83-4.78,2.81-.59,9.56-2v-19.1l-6.33,1.33-79.55,16.62-26.49,5.54-55.93,11.69c-13-11.18-20-24.73-27.16-39.89l-1.67-3.53,34.18-46.76.58-.79c9.76,28.37,24.84,58.48,51.36,78.35l24.6-5,1.83-.54L407.07,229c-37.27-19.15-50.45-51.64-61.94-88.83l-.44-1.43,43.69-59.78,3-4.1,41.19-56.34H409.42L374.91,65.7l-4.09,5.6-46.71,63.9c-34.73.23-70.42-3-95.76-22.5l-12-79.19-1-6.47-1.29-8.55H195.2L198,37.24l-.11-4.4,12.18,83.44c-17,16.89-39.15,28.73-67.39,26.48L93.45,80.59,44.23,18.49H20.39l53,66.83,4.18,5.27L129,155.51c-3.16,27.24-16.63,53.33-32.88,73.74l-71-18.63L22.73,210l-4.31-1.13v19.32l2.56.67,71.38,18.74c8.29,26.73,6.3,57.28,2.12,86L22.8,367.15l-4.38,2.05v20.63l9.18-4.3,67.92-31.78,1.09-.51A190.52,190.52,0,0,1,104.47,382c1.33,7.25,2.58,14.68,3.19,19.36l-51.74,52-37.5,37.69v2.43H42.37l20.91-21h0l58.27-58.57c10.1-.83,33.7-2.28,59.06-3.17,7.9-.28,16.15-.45,24.46-.47,23.47-.05,49.4,1.12,67.34,4.45l20.27,63,1.54,4.79,3.54,11h19.63l-5.19-16.14L310,470.43,291.2,412.17c23.43-27.05,48.62-54.87,86-69.58l64.45,25.5,4.18,1.65,47.6,18.84v-20.1l-37.78-15-5.21-2.06-62.74-24.82c-3.11-24.21,8.64-50.64,20.2-76.57ZM266.92,336.72l-10.1-31.4a39.76,39.76,0,0,0,8.16-7.15l36.5,14.44a169,169,0,0,0-24.68,16.16C272.9,331.76,269.7,334.38,266.92,336.72Zm-71.07-62a39.17,39.17,0,0,0,2.08,10.44l-35.27,16.5c1.05-11.9.92-24-2-36.19Zm-30.58-27.35c5-8.75,9.83-18.25,13.09-29.59l24.91,31.43a39.28,39.28,0,0,0-4.08,7.07Zm41.58,54.25h0L169.2,339.51a54.79,54.79,0,0,0-9.59-15.23l.09-.56Zm17.74,8.67a39.43,39.43,0,0,0,10.6,1.45,38,38,0,0,0,4-.2l10.47,32.54c-13.32-.16-37.61.08-61.69,3Zm22.23-75.64L241.11,197a109.17,109.17,0,0,0,25.15,17.39L250.43,236A37.88,37.88,0,0,0,246.82,234.69Zm26.73,46.78c.26-1.13.47-2.28.64-3.43l45.58-9.53c-4.62,9.43-6.38,18.89-6.95,28.5Zm30-28.66-31.15,6.51a39.53,39.53,0,0,0-6.93-12.21l18.42-25.21C289,232.31,295,243,303.54,252.81ZM232.78,136.13c23.18,13.26,50.47,17.92,77,18.68l-32.37,44.3c-15.06-6.37-26.14-17.76-38.57-30.33l-2.34-2.37-4.59-30.28,0-.12Zm-5,97.52a39.25,39.25,0,0,0-10.25,3.48l-25.18-31.77a132,132,0,0,0,29.42-11.45Zm-14.52-96,5.48,36.25c-11.18,7.5-24.44,12.15-39.05,15.49l-22.46-28.34C178.25,159.21,198.58,149.44,213.24,137.65Zm-69.67,36.28.5.63,19.15,24.15-.08.71c-1.93,17.37-8.88,29.63-16.65,43.06L115,234.2l-.07,0C127,217.56,138.38,195.1,143.57,173.93ZM123.4,385.56c-.42-2.17-1.06-4.9-1.43-6.92-1.84-10-4.7-23.39-8.85-33.12l28.45-13.32,1.52,1.53c5.85,5.87,10,10.3,11.22,20.75Zm15.89-125.65.56,1.4c6.1,15.14,5.39,31.77,2.9,49.71l-29,13.58c2.87-22.76,3.42-48.28-2.06-71.93h0Zm72.18,131.64h-6.55c-8.5.05-16.9.25-25,.53-15.57.55-28,1.33-37.85,2.07l.07-.07a7.94,7.94,0,0,1-.82-.06l24-24.11,1-.23c23.75-5.79,59.86-6.75,80.11-6.78,4,0,6.81,0,9.35.07l10.29,32C249.77,392.55,229.58,391.66,211.47,391.55Zm73.59-1.18-.71.53-.17-.53-11-34.32c3.55-3.17,8.73-7.63,15-12.42,11.42-8.73,26.21-17.7,35.68-19.63l4.24-.86,25.37,10C324.89,348,303.58,369.47,285.06,390.37ZM368.49,319l-.77-.31-36.59-14.48c0-13.15,1.4-22.84,9.12-33.92l5-7.14L385,254.88l.12,0C376.44,274.07,368.18,297,368.49,319Z"
    },
    classes: {
      main: "fill-radial"
    }
  },
  ComplicationSerious: {
    viewBox: "0 0 512 512",
    paths: {
      main: "M21.42,17.34,78.56,89.45c-2.73,48.59-23.75,85.79-52.39,120l-6.72-1.76V227l2.56.67C37.36,272.78,31.1,318.54,23.83,366l-4.38,2.05v20.63l9.18-4.29c6.52,10.7,13.66,27,19.06,41.33,4.29,11.33,7.48,21,9.26,26.53l-37.5,37.69v2.43h24L72,463.67c9.27-.36,41.77-1.47,82.7-.75,46.74.83,102.61,4.3,139,13.67l5.08,15.78h19.63L311,469.28c35.94-41.51,71.91-80.52,131.73-102.34l51.78,20.49v-20.1l-43-17c-6.37-39.21,12.76-76.67,30.62-116.68l12.37-2.59V212l-6.33,1.32-5.45-2.8c-56.09-28.83-76.33-78-93.3-132.7L433.6,17.34H410.45l-38.6,52.81c-58.28,1.26-112.48-2.46-154.45-37.79l-2.27-15h-18.9l2.83,18.75c-27.13,29-57.56,48-104.58,43.36L45.26,17.34Zm199.92,41c40.6,26.3,88.49,30.89,136.75,30.63L325,134.32c-36.59.39-69.86-3-95.85-24.64l-7.76-51.33Zm-18.84.44,8.29,54.77c-17.81,18.62-37.29,30.18-68,26.86L109.72,98.68c38.59-.74,68.36-17.15,92.78-39.89ZM375.83,96.38c15.53,47,37.05,92.69,84.55,122.72l-51.77,10.82-.82-.42c-37.27-19.14-50.44-51.64-61.93-88.83l-.72-2.31,30.68-42ZM95.09,110.3l34.39,43.39c-2.52,29.59-15.41,52.66-33.14,74.21L45.93,214.67c23.72-29.78,42.64-63.39,49.16-104.37ZM232.93,135c23.94,13.69,51.05,17.4,78.41,17.94l-32.91,45c-15.06-6.36-26.14-17.75-38.57-30.32l-2.35-2.37L232.93,135Zm-18.77.81,5.59,36.95c-11.18,7.5-24.44,12.15-39.05,15.49l-22.9-28.89c22.71-1.4,41.09-10.68,56.36-23.55ZM331.54,157c9.74,29.15,23.14,58,50.58,78.49l-55.93,11.69c-13-11.18-20-24.74-27.16-39.89l-1.67-3.53ZM145.1,173.41l19.15,24.16-.08.71c-1.93,17.36-8.88,29.63-16.65,43.06L116,233.06c13.21-17.36,23.94-36.83,29.12-59.65Zm77.68,19.35,6,39.75A38.88,38.88,0,0,0,218.54,236l-25.18-31.77a132.49,132.49,0,0,0,29.42-11.45Zm19.36,3.05a109.17,109.17,0,0,0,25.15,17.39l-15.83,21.66c-1.18-.49-2.38-.94-3.61-1.32l-5.71-37.73Zm-62.75,20.86L204.3,248.1a39.37,39.37,0,0,0-4.08,7.07l-33.92-8.9c5-8.76,9.83-18.25,13.09-29.6Zm105.52,4.08c5.12,10.42,11.11,21.1,19.66,30.92l-31.15,6.5A39.64,39.64,0,0,0,266.49,246l18.42-25.21ZM43.14,233.26,92,246.09c9.23,28.21,5.8,57.08,1.2,87.45l-49.07,23c6-40.15,10.29-81.42-1-123.24Zm416.14,5.16c-14.93,32.63-30.11,66.73-27.43,104.13l-43.74-17.31c-3.6-25,8.78-49.44,20.72-76.28l50.45-10.54Zm-346.57,13.1,27.61,7.25.56,1.4c6.1,15.13,5.39,31.77,2.9,49.71l-30.32,14.18c3.22-23.51,5-47.81-.75-72.54ZM386,253.74c-9,19.81-17.8,40.8-17.25,63.84l-36.59-14.47c0-13.15,1.4-22.84,9.12-33.92l5-7.15,39.74-8.3ZM161.64,264.36l35.24,9.26A39.33,39.33,0,0,0,199,284.06l-35.27,16.5c1.05-11.9.92-24.05-2.05-36.2Zm159.16,3c-4.62,9.44-6.38,18.89-6.95,28.5l-39.27-15.54c.26-1.12.47-2.27.64-3.43l45.58-9.53ZM266,297l36.5,14.44a169,169,0,0,0-24.68,16.16c-3.9,3-7.1,5.6-9.88,7.94l-10.11-31.4A39.76,39.76,0,0,0,266,297Zm-58.12,3.48-37.66,37.86a54.85,54.85,0,0,0-9.59-15.24l.09-.55,47.15-22.07Zm17.73,8.67a39.43,39.43,0,0,0,10.6,1.46c1.35,0,2.69-.07,4-.2L250.7,343c-13.32-.16-37.62.07-61.7,3l36.61-36.81ZM329.1,322l25.36,10c-29.4,14.92-50.37,35.89-69.25,57.2l-11-34.32c3.55-3.18,8.73-7.63,15-12.43,11.42-8.73,26.21-17.7,35.68-19.63l4.24-.86Zm-186.5,9.07,1.52,1.52c5.85,5.88,10,10.31,11.22,20.75L124.2,384.64c-.35-2.27-.74-4.63-1.2-7.14-2-10.95-4.45-22.94-9.32-32.9l28.92-13.54Zm235.93,10.49,39.22,15.52c-49.42,22.5-82.92,56.68-113.45,91.47l-12.44-38.65c24.11-27.84,47.68-53.61,86.67-68.34Zm-282,11.06c3,6.84,6.22,18.17,8.07,28.26,1.58,8.61,2.5,16.08,3,20.45L71.72,437.4c-1.68-5-3.78-11-6.55-18.29-5.37-14.22-12-30-19.61-42.64l51-23.86Zm150.86,9.15c4,0,6.81,0,9.35.06l10.39,32.3c-26.25-4.15-58.63-4.19-87-3.18-15.58.55-28,1.32-37.86,2.06l24.11-24.24,1-.23C191,362.74,227.16,361.79,247.41,361.76Zm-42.19,47.39c24.92-.06,50.36,1.26,68.41,5.1L287.06,456c-38.71-8.23-89-11-132.09-11.74-27.22-.48-49.23-.19-63.87.17l30.8-31c7.77-.76,30.71-2.84,58.86-3.84,7.9-.28,16.15-.45,24.46-.47Z"
    },
    classes: {
      main: "fill-radial"
    }
  },
  LostOpportunity: {
    viewBox: "0 0 512 512",
    paths: {
      main: "M373.33,52.76A234.57,234.57,0,0,0,52.77,138.67C-12,250.93,26.41,394.41,138.67,459.23s255.75,26.36,320.56-85.91S485.59,117.58,373.33,52.76Zm-211.87,367A189.1,189.1,0,0,1,81,184.37L327.62,431A188.73,188.73,0,0,1,161.46,419.76Zm211.18-14.87L107.14,139.38a187.3,187.3,0,0,1,32.24-32.29L404.89,372.6A187.71,187.71,0,0,1,372.64,404.89ZM431,327.6,184.41,81A189.12,189.12,0,0,1,431,327.6Z"
    },
    classes: {
      main: "fill-linear"
    }
  },
  WorsePosition: {
    viewBox: "0 0 512 512",
    paths: {
      horizon: "M18.36,227.8v18.68h86.37a98.45,98.45,0,0,0-4.43-18.68Zm379.4,0a110.51,110.51,0,0,1,9.44,18.68h86.44V227.8H397.76Z",
      boot: "M218.67,18.73a162.14,162.14,0,0,0-20,1.32C164,24.39,123.5,39.4,91.23,67.36L124.7,257.55l.35,10.12c42.26,15.79,100.82,24.55,152.87,24.25,27.19-.15,52.64-2.74,73-7.78s35.2-12.82,41.81-20.94l.44.35a113,113,0,0,0-6.53-17.06h.19a95.88,95.88,0,0,0-4.85-8.66c-.09-.14-.16-.3-.25-.44l-.31-.47c-21.46-34.89-63.5-55.87-124.28-29.37l-.16.06a215.37,215.37,0,0,0-34,20.19h-.81c11-15.72,23.26-28.12,35.91-37.28l1.12-11.16c-14.68-4-38.08-4.06-53.53-.09L201,161.14a130.33,130.33,0,0,1,30.34-3.84c1.5,0,3,0,4.5,0a117.66,117.66,0,0,1,25.25,3.12l3.19-32c-21.06-8.07-42.12-6.6-64.57-1.59l-4.06-18.25A170.07,170.07,0,0,1,231,104.17c1.72,0,3.44,0,5.16.07a107,107,0,0,1,30.06,5.12l3.16-31.47c-25.6-7.69-51-8.1-76.91-2.78l-3.78-18.28A188.53,188.53,0,0,1,221.52,53c1.14,0,2.29-.05,3.43-.06A167.36,167.36,0,0,1,271.23,59l.47-4.6c5-23.31-18.75-35.71-53-35.65ZM397.26,284.45c-10.84,8.13-25.26,13.7-41.87,17.82-22.37,5.54-49.07,8.18-77.38,8.34a526.46,526.46,0,0,1-65.09-3.75L225.36,329c80.16,9.44,141.5-1.19,172-21.78a113.13,113.13,0,0,0-.13-22.75ZM125.7,287.77l1,30.47,58.6,8.43,9.59-22.31c-24.55-3.82-48.21-9.37-69.19-16.59Z",
      ice: "M92.61,309.3C82.3,312.37,74,315.76,68,319.36l-.21.12L37.58,334.2,18.36,322v22.16L32,352.8l4.41,2.81,4.72-2.31,22-10.72c11.71,9.8,40.46,18.23,79.4,23.87l-60,28.25,26.63,21L18.36,454.23v39H145.14L188.86,447l51,46.28h27.84L159.11,394.8l35.06-23c20,1.37,41.34,2.15,63.56,2.15,20.7,0,40.66-.67,59.44-1.87l39.06,24.69-66.9,35.71,62.28,60.75H475.52L385,440.64l51.32-39.78-71.5-33.28c45.88-6,79.18-15.67,89.81-27l18,6.43,21.06,22.57V342.17l-8.94-9.56L483.17,331l-2.15-.78L439.8,315.42a141.57,141.57,0,0,0-16.66-6c5.37,3.24,8.28,6.7,8.28,10.28,0,18.59-77.73,33.66-173.62,33.66S84.14,338.29,84.14,319.7c0-3.63,3-7.13,8.47-10.4Z"
    },
    classes: {
      horizon: "fill-dark",
      boot: "fill-bright",
      ice: "fill-radial"
    }
  },
  InsightHarm1: {
    viewBox: "0 0 512 512",
    paths: {
      eye: "M406.09,282.69V352.6c4.19,8.54,8.53,16.73,8.53,27.56,0,13.24-8.75,22.78-18.09,22.78-9.13,0-18.69-10-18.69-23.94,0-12.22,5.1-20.64,9.56-29.59V289.63c-6.51-19.32-16.22-25.45-26.54-21.72V226.24A401.64,401.64,0,0,0,409.07,204h45.2C435.64,222.23,417,244.72,406.09,282.69ZM494.83,158.8c-33,49.83-80.77,87.12-134,108.82a291.28,291.28,0,0,1-90,21.07q-7.2.51-14.42.62a256.33,256.33,0,0,1-89-14,239,239,0,0,1-25.35-10.52A239.65,239.65,0,0,1,82.64,223.9C74.76,216.85,66,208.81,57.89,200c-11.54-12.52-21.66-26.51-25.72-41.23,20.19-37.74,48.7-69.38,84.66-92.29C241.41-14.68,416.3,37.68,494.83,158.8Zm-29.17-.36C373.78,11.86,140.41,12.08,57.19,160.28l.46.39-.46.39a353,353,0,0,0,54.67,42.55c45.21,28.32,92.77,42.1,140.82,42.29h.22C324.81,246.14,397.81,215.94,465.66,158.44Z",
      iris: "M303.7,99.51a65,65,0,0,0-45-18h0a65.26,65.26,0,1,0,45,18Zm-45.4,68.13a23.4,23.4,0,1,1,23.39-23.41A23.42,23.42,0,0,1,258.3,167.64Zm45.4-68.13a65,65,0,0,0-45-18h0a65.26,65.26,0,1,0,45,18Zm-45.4,68.13a23.4,23.4,0,1,1,23.39-23.41A23.42,23.42,0,0,1,258.3,167.64Zm45.4-68.13a65,65,0,0,0-45-18h0a65.26,65.26,0,1,0,45,18Zm-45.4,68.13a23.4,23.4,0,1,1,23.39-23.41A23.42,23.42,0,0,1,258.3,167.64Z"
    },
    classes: {
      eye: "fill-dark",
      iris: "fill-med"
    }
  },
  InsightHarm2: {
    viewBox: "0 0 512 512",
    paths: {
      eye: "M305.51,89.71A78.5,78.5,0,0,0,251.22,68h0a78.81,78.81,0,1,0,54.29,21.71ZM250.71,172a28.25,28.25,0,1,1,28.23-28.27A28.28,28.28,0,0,1,250.71,172Zm54.8-82.26A78.5,78.5,0,0,0,251.22,68h0a78.81,78.81,0,1,0,54.29,21.71ZM250.71,172a28.25,28.25,0,1,1,28.23-28.27A28.28,28.28,0,0,1,250.71,172Zm54.8-82.26A78.5,78.5,0,0,0,251.22,68h0a78.81,78.81,0,1,0,54.29,21.71ZM250.71,172a28.25,28.25,0,1,1,28.23-28.27A28.28,28.28,0,0,1,250.71,172Z",
      iris: "M398.59,282.69V352.6c4.19,8.54,8.53,16.73,8.53,27.56,0,13.24-8.75,22.78-18.09,22.78-9.13,0-18.69-10-18.69-23.94,0-12.22,5.1-20.64,9.56-29.59V289.63c-6.51-19.32-16.22-25.45-26.54-21.72V226.24A401.64,401.64,0,0,0,401.57,204h45.2C428.14,222.23,409.46,244.72,398.59,282.69Zm-264-17.94A239.65,239.65,0,0,1,75.14,223.9c-7.88-7.05-16.67-15.09-24.75-23.86,11.79,18.34,22,39.48,27.42,60.27v50c-4.76,10.14-12.06,17.21-12.06,28.41,0,9.09,11.63,18.09,21,18.09,9.2,0,21.6-9.67,21.59-19.25,0-11.36-7.31-17.81-11.87-27V278.22C103,265.1,117.78,261.12,134.61,264.75ZM487.33,158.8c-33,49.83-80.77,87.12-134,108.82a291.28,291.28,0,0,1-90,21.07q-7.2.51-14.42.62a256.33,256.33,0,0,1-88.95-14,239,239,0,0,1-25.35-10.52A239.65,239.65,0,0,1,75.14,223.9c-7.88-7.05-16.67-15.09-24.75-23.86-11.54-12.52-21.66-26.51-25.72-41.23,20.19-37.74,48.7-69.38,84.66-92.29C233.91-14.68,408.8,37.68,487.33,158.8Zm-29.17-.36C366.28,11.86,132.91,12.08,49.69,160.28l.46.39-.46.39a353,353,0,0,0,54.67,42.55c45.21,28.32,92.77,42.1,140.82,42.29h.22C317.31,246.14,390.31,215.94,458.16,158.44Z"
    },
    classes: {
      eye: "fill-med",
      iris: "fill-med"
    }
  },
  InsightHarm3: {
    viewBox: "0 0 512 512",
    paths: {
      eye: "M398.31,282.69V352.6c4.19,8.54,8.53,16.73,8.53,27.56,0,13.24-8.75,22.78-18.09,22.78-9.13,0-18.69-10-18.69-23.94,0-12.22,5.1-20.64,9.56-29.59V289.63c-6.51-19.32-16.22-25.45-26.54-21.72V226.24A401.64,401.64,0,0,0,401.29,204h45.2C427.86,222.23,409.18,244.72,398.31,282.69Zm-264-17.94A239.65,239.65,0,0,1,74.86,223.9C67,216.85,58.19,208.81,50.11,200c11.79,18.34,22,39.48,27.42,60.27v50c-4.76,10.14-12.06,17.21-12.06,28.41,0,9.09,11.63,18.09,21,18.09,9.2,0,21.6-9.67,21.59-19.25,0-11.36-7.31-17.81-11.87-27V278.22C102.75,265.1,117.5,261.12,134.33,264.75Zm114.3,24.56a256.33,256.33,0,0,1-88.95-14,109.79,109.79,0,0,1,42.38,48.58v80.59c-6.36,10.47-13.62,16.95-13.62,28.87,0,17.89,11.76,24.5,23.93,24.5,11.91,0,21.6-5.66,21.6-24.5,0-9.3-7.44-16.63-13.22-31.06V324.1C227.16,309.18,237.5,294.45,248.63,289.31ZM487.05,158.8c-33,49.83-80.77,87.12-134,108.82a291.28,291.28,0,0,1-90,21.07q-7.2.51-14.42.62a256.33,256.33,0,0,1-88.95-14,239,239,0,0,1-25.35-10.52A239.65,239.65,0,0,1,74.86,223.9C67,216.85,58.19,208.81,50.11,200c-11.54-12.52-21.66-26.51-25.72-41.23,20.19-37.74,48.7-69.38,84.66-92.29C233.63-14.68,408.52,37.68,487.05,158.8Zm-29.17-.36C366,11.86,132.63,12.08,49.41,160.28l.46.39-.46.39a353,353,0,0,0,54.67,42.55c45.21,28.32,92.77,42.1,140.82,42.29h.22C317,246.14,390,215.94,457.88,158.44Z",
      iris: "M314.46,80a91.84,91.84,0,0,0-63.52-25.39h0A92.2,92.2,0,1,0,314.46,80Zm-64.12,96.24a33.05,33.05,0,1,1,33-33.07A33.08,33.08,0,0,1,250.34,176.25ZM314.46,80a91.84,91.84,0,0,0-63.52-25.39h0A92.2,92.2,0,1,0,314.46,80Zm-64.12,96.24a33.05,33.05,0,1,1,33-33.07A33.08,33.08,0,0,1,250.34,176.25ZM314.46,80a91.84,91.84,0,0,0-63.52-25.39h0A92.2,92.2,0,1,0,314.46,80Zm-64.12,96.24a33.05,33.05,0,1,1,33-33.07A33.08,33.08,0,0,1,250.34,176.25Z"
    },
    classes: {
      eye: "fill-med",
      iris: "fill-bright"
    }
  },
  InsightHarm4: {
    viewBox: "0 0 512 512",
    paths: {
      eye: "M244,27.44c-46.86,0-93.53,12.25-134.7,39.08-36,22.91-64.47,54.55-84.66,92.29,4.06,14.72,14.18,28.71,25.72,41.23,8.08,8.77,16.87,16.81,24.75,23.86a239.65,239.65,0,0,0,59.47,40.85A239,239,0,0,0,160,275.27a256.33,256.33,0,0,0,88.95,14q7.22-.1,14.42-.62a291.28,291.28,0,0,0,90-21.07A299.94,299.94,0,0,0,430.12,222a286.46,286.46,0,0,0,57.21-63.16C434.75,77.71,339,27.44,244,27.44ZM245.4,245.9h-.22c-48.05-.19-95.61-14-140.82-42.29a353,353,0,0,1-54.67-42.55l.46-.39-.46-.39c83.22-148.2,316.59-148.42,408.47-1.84C390.31,215.94,317.31,246.14,245.4,245.9Zm17.93,42.79c7.16,3,14.11,11.57,20,28.08,3.54,9.85,6.71,22.54,9.33,38.58v74.84C287.27,440.69,281,449.64,281,462.5s10,22.19,21,22.19c10.74,0,22.18-9.73,22.18-23.34,0-14.45-7.09-23.42-12.81-34.57V342.22h-.22a223.26,223.26,0,0,1,7.48-25.45c9.57-26.37,22.57-44.47,34.73-48.86v-.29A291.28,291.28,0,0,1,263.33,288.69Zm-38.82,28.08c6.37-12.19,15.11-23.17,24.4-27.46a256.33,256.33,0,0,1-88.95-14,109.62,109.62,0,0,1,38.91,41.5q1.84,3.45,3.47,7.08v80.59c-6.36,10.47-13.62,16.95-13.62,28.87,0,17.89,11.76,24.5,23.93,24.5,11.91,0,21.6-5.66,21.6-24.5,0-9.3-7.44-16.63-13.22-31.06V324.1C222.09,321.64,223.26,319.18,224.51,316.77Zm-89.9-52A239.65,239.65,0,0,1,75.14,223.9c-7.88-7.05-16.67-15.09-24.75-23.86,11.79,18.34,22,39.48,27.42,60.27v50c-1.08,2.29-2.28,4.43-3.51,6.49-4.18,7.06-8.55,13.25-8.55,21.92,0,9.09,11.63,18.09,21,18.09,9.2,0,21.6-9.67,21.59-19.25,0-8.63-4.22-14.43-8.25-20.76a67,67,0,0,1-3.62-6.27V278.22C103,265.1,117.78,261.12,134.61,264.75Zm267-60.78a401.64,401.64,0,0,1-48.21,22.27v41.67c10.32-3.73,20,2.4,26.54,21.72v59.78c-4.46,8.95-9.56,17.37-9.56,29.59,0,13.94,9.56,23.94,18.69,23.94,9.34,0,18.09-9.54,18.09-22.78,0-10.83-4.34-19-8.53-27.56V282.69c7.59-26.52,19-45.48,31.53-60.73a225.7,225.7,0,0,1,16.65-18Z",
      iris: "M326.5,67.65a108.84,108.84,0,0,0-75.28-30.08h0A109.22,109.22,0,1,0,326.5,67.65Zm-76,114.06a39.17,39.17,0,1,1,39.15-39.19A39.2,39.2,0,0,1,250.51,181.71Zm76-114.06a108.84,108.84,0,0,0-75.28-30.08h0A109.22,109.22,0,1,0,326.5,67.65Zm-76,114.06a39.17,39.17,0,1,1,39.15-39.19A39.2,39.2,0,0,1,250.51,181.71Zm76-114.06a108.84,108.84,0,0,0-75.28-30.08h0A109.22,109.22,0,1,0,326.5,67.65Zm-76,114.06a39.17,39.17,0,1,1,39.15-39.19A39.2,39.2,0,0,1,250.51,181.71Z"
    },
    classes: {
      eye: "fill-bright",
      iris: "fill-med"
    }
  },
  ProwessHarm1: {
    viewBox: "0 0 512 512",
    paths: {
      scar: "M443.44,434.53Q408.7,409.87,376,383.64c-20-11.91-31.49.3-44.26,16.86,8.8-18.17,13.38-36.95,3.24-50.86l-4.46-3.84-44.85-35.35L237.9,336.93l17.19-25.34c7.31-12.4,3.43-27.17-5.65-41.14q-16.37-16.32-32.22-33c-1.66-1.23-3.31-2.38-4.95-3.5l-66.44,18.87L167.59,227c10.57-17.62,0-41.59-9.84-55.7q-8.4-9.81-16.62-19.75l-43.67,7.29c18.43-7.3,31.37-22.38,16.85-40l2.06,2.33Q91.79,90.29,68.44,58.49q43,32.32,83.86,67.06L188.92,116l-22.11,22q23.38,20.3,46.09,41.39l71.86-30.46L266,178l.3-.24c-21.55,27.54,18.77,86,46,78.42l31.91-17.7L319.4,275l36.88,52.71c.26.3.53.59.79.9,13.64,12.5,31.23,1.71,43.05-14.53l-19.59,42Q412.66,394.28,443.44,434.53Z"
    },
    classes: {
      scar: "fill-dark"
    }
  },
  ProwessHarm2: {
    viewBox: "0 0 512 512",
    paths: {
      scarTissue: "M399,355.08c-15-32.31-18.67-65.87-6.23-94.7-47.19,58.41-76.14,4.41-4.09-70.72-101.67,62.7-147.78,31.47-14-88.26-103,54.66-182.49,69.22-130.93,15.19-37.19,10.63-58.21,5.21-76-2.43A643.42,643.42,0,0,0,55.28,58.49a789.14,789.14,0,0,0,47,77.56c7,18.27,3,38.71-31.46,63.44,124.85-33.45,88.52,47-9.36,104.92,166.21-61.68,207.52-47.41,100.64,78,84-61.07,150.14-44.57,122.89,31.29,31.63-24.51,57.9-29.74,78-20.87q43.39,30.7,90.32,59C436.25,418.27,418.25,386,399,355.08ZM352.11,362c-16.61-9.9-26.17.25-36.79,14,7.32-15.11,11.12-30.72,2.69-42.28l-3.7-3.19L277,301.11l-39.68,22,14.29-21.06c6.08-10.31,2.85-22.58-4.7-34.2q-13.6-13.56-26.78-27.46c-1.38-1-2.75-2-4.11-2.91l-55.23,15.68,18.09-21.41c8.78-14.64,0-34.57-8.18-46.3q-7-8.15-13.82-16.42l-36.3,6.06c15.32-6.06,26.08-18.6,14-33.28l-1.89-2.13c.69.72,1.31,1.42,1.89,2.13l1.71,1.94q-20.43-25.65-39.84-52.09,35.76,26.88,69.71,55.75l30.44-7.93-18.38,18.27q19.44,16.88,38.31,34.41l59.73-25.32L260.68,191l.25-.2c-17.91,22.9,15.6,71.52,38.24,65.19l26.52-14.71-20.6,30.37,30.65,43.82.66.74c11.34,10.39,26,1.42,35.79-12.07L355.9,339q26.72,31.78,52.3,65.24Q379.31,383.76,352.11,362Z"
    },
    classes: {
      scarTissue: "fill-med"
    }
  },
  ProwessHarm3: {
    viewBox: "0 0 512 512",
    paths: {
      scar: "M447.44,434.53Q412.7,409.87,380,383.64c-20-11.91-31.49.3-44.26,16.86,8.8-18.17,13.38-36.95,3.24-50.86l-4.46-3.84-44.85-35.35L241.9,336.93l17.19-25.34c7.31-12.4,3.43-27.17-5.65-41.14q-16.37-16.32-32.22-33c-1.66-1.23-3.31-2.38-4.95-3.5l-66.44,18.87L171.59,227c10.57-17.62,0-41.59-9.84-55.7q-8.4-9.81-16.62-19.75l-43.67,7.29c18.43-7.3,31.37-22.38,16.85-40l2.06,2.33Q95.79,90.29,72.44,58.49q43,32.32,83.86,67.06L192.92,116l-22.11,22q23.38,20.3,46.09,41.39l71.86-30.46L270,178l.3-.24c-21.55,27.54,18.77,86,46,78.42l31.91-17.7L323.4,275l36.88,52.71c.26.3.53.59.79.9,13.64,12.5,31.23,1.71,43.05-14.53l-19.59,42Q416.66,394.28,447.44,434.53Z",
      scarTissue: "M436.33,375.37c-18.07-38.87-22.46-79.24-7.49-113.92-56.77,70.27-91.6,5.3-4.93-85.08C301.61,251.8,246.13,214.23,407,70.19,283.18,136,187.5,153.46,249.53,88.47c-44.75,12.79-70,6.27-91.47-2.93a773.7,773.7,0,0,0-135.18-67,949.58,949.58,0,0,0,56.49,93.31c8.39,22,3.6,46.57-37.84,76.32C191.72,148,148,244.71,30.26,314.42c200-74.2,249.65-57,121.08,93.78C252.42,334.73,332,354.59,299.17,445.84c38.06-29.48,69.66-35.77,93.87-25.1q52.21,36.94,108.66,70.93C481.19,451.39,459.54,412.52,436.33,375.37ZM380,383.64c-20-11.91-31.49.3-44.26,16.86,8.8-18.17,13.38-36.95,3.24-50.86l-4.46-3.84-44.85-35.35L241.9,336.93l17.19-25.34c7.31-12.4,3.43-27.17-5.65-41.14q-16.37-16.32-32.22-33c-1.66-1.23-3.31-2.38-4.95-3.5l-66.44,18.87L171.59,227c10.57-17.62,0-41.59-9.84-55.7q-8.4-9.81-16.62-19.75l-43.67,7.29c18.43-7.3,31.37-22.38,16.85-40L116,116.26c.83.86,1.57,1.71,2.27,2.56l2.06,2.33Q95.79,90.29,72.44,58.49q43,32.32,83.86,67.06L192.92,116l-22.11,22q23.38,20.3,46.09,41.39l71.86-30.46L270,178l.3-.24c-21.55,27.54,18.77,86,46,78.42l31.91-17.7L323.4,275l36.88,52.71c.26.3.53.59.79.9,13.64,12.5,31.23,1.71,43.05-14.53l-19.59,42q32.13,38.23,62.91,78.49Q412.7,409.87,380,383.64Z"
    },
    classes: {
      scar: "fill-dark",
      scarTissue: "fill-med"
    }
  },
  ProwessHarm4: {
    viewBox: "0 0 512 512",
    paths: {
      scar: "M441.44,434.53Q406.7,409.87,374,383.64c-20-11.91-31.49.3-44.26,16.86,8.8-18.17,13.38-36.95,3.24-50.86l-4.46-3.84-44.85-35.35L235.9,336.93l17.19-25.34c7.31-12.4,3.43-27.17-5.65-41.14q-16.37-16.32-32.22-33c-1.66-1.23-3.31-2.38-4.95-3.5l-66.44,18.87L165.59,227c10.57-17.62,0-41.59-9.84-55.7q-8.4-9.81-16.62-19.75l-43.67,7.29c18.43-7.3,31.37-22.38,16.85-40l2.06,2.33Q89.79,90.29,66.44,58.49q43,32.32,83.86,67.06L186.92,116l-22.11,22q23.38,20.3,46.09,41.39l71.86-30.46L264,178l.3-.24c-21.55,27.54,18.77,86,46,78.42l31.91-17.7L317.4,275l36.88,52.71c.26.3.53.59.79.9,13.64,12.5,31.23,1.71,43.05-14.53l-19.59,42Q410.66,394.28,441.44,434.53Z",
      scarTissue: "M430.33,375.37c-18.07-38.87-22.46-79.24-7.49-113.92-56.77,70.27-91.6,5.3-4.93-85.08C295.61,251.8,240.13,214.23,401,70.19,277.18,136,181.5,153.46,243.53,88.47c-44.75,12.79-70,6.27-91.47-2.93a773.7,773.7,0,0,0-135.18-67,949.58,949.58,0,0,0,56.49,93.31c8.39,22,3.6,46.57-37.84,76.32C185.72,148,142,244.71,24.26,314.42c200-74.2,249.65-57,121.08,93.78C246.42,334.73,326,354.59,293.17,445.84c38.06-29.48,69.66-35.77,93.87-25.1q52.21,36.94,108.66,70.93C475.19,451.39,453.54,412.52,430.33,375.37ZM374,383.64c-20-11.91-31.49.3-44.26,16.86,8.8-18.17,13.38-36.95,3.24-50.86l-4.46-3.84-44.85-35.35L235.9,336.93l17.19-25.34c7.31-12.4,3.43-27.17-5.65-41.14q-16.37-16.32-32.22-33c-1.66-1.23-3.31-2.38-4.95-3.5l-66.44,18.87L165.59,227c10.57-17.62,0-41.59-9.84-55.7q-8.4-9.81-16.62-19.75l-43.67,7.29c18.43-7.3,31.37-22.38,16.85-40L110,116.26c.83.86,1.57,1.71,2.27,2.56l2.06,2.33Q89.79,90.29,66.44,58.49q43,32.32,83.86,67.06L186.92,116l-22.11,22q23.38,20.3,46.09,41.39l71.86-30.46L264,178l.3-.24c-21.55,27.54,18.77,86,46,78.42l31.91-17.7L317.4,275l36.88,52.71c.26.3.53.59.79.9,13.64,12.5,31.23,1.71,43.05-14.53l-19.59,42q32.13,38.23,62.91,78.49Q406.7,409.87,374,383.64Z",
      welts: "M414.13,84.19a39.5,39.5,0,1,0,39.57,39.5,39.2,39.2,0,0,0-39.57-39.5ZM308.33,29.83A28.66,28.66,0,1,0,337,58.51a28.51,28.51,0,0,0-28.67-28.68ZM90.17,322.56a49.51,49.51,0,1,0,49.53,49.52A49.36,49.36,0,0,0,90.17,322.56Zm258-171.24A22.79,22.79,0,1,0,371,174.11a22.61,22.61,0,0,0-22.83-22.79ZM261.49,89.88a16.72,16.72,0,1,0,16.73,16.73,16.63,16.63,0,0,0-16.73-16.73ZM91.15,187.65a21.18,21.18,0,1,0,21.18,21.18,21,21,0,0,0-21.18-21.18Zm77.51,94.54a32.09,32.09,0,1,0,32.07,32.1,32,32,0,0,0-32.07-32.1ZM391.6,243.05a16.51,16.51,0,1,0,16.49,16.52,16.41,16.41,0,0,0-16.49-16.52ZM238.11,374.85a48.43,48.43,0,1,0,48.44,48.45A48.29,48.29,0,0,0,238.11,374.85Zm137,59.88A22.86,22.86,0,1,0,398,457.59a22.69,22.69,0,0,0-22.86-22.86Z"
    },
    classes: {
      scar: "fill-bright",
      scarTissue: "fill-dark",
      welts: "fill-bright"
    }
  },
  ResolveHarm1: {
    viewBox: "0 0 512 512",
    paths: {
      spikes: "M256.09,19.1A237.5,237.5,0,0,0,197,27.22C70.63,61.08-4.36,191,29.5,317.31,62.59,440.8,187.39,515.21,311,486.92A132.35,132.35,0,0,1,279.74,475,207,207,0,0,1,122,417.49l-13.48-14.55L94.89,385.42a205.62,205.62,0,0,1-24-47.36l-7.2-17.33L60.71,296.5a205.83,205.83,0,0,1-.18-54.37l3-24.36,7.67-19.51a208.28,208.28,0,0,1,29.16-53.84l105,60.61-68.63-98a205.85,205.85,0,0,1,63.68-34.49l27.24-8.18,23.18-1.89q6.46-.48,12.89-.54a205.54,205.54,0,0,1,61.66,8.84l23.65,11,22,9.09A207.05,207.05,0,0,1,428.2,140.9l13.1,14.44L448.93,173a208,208,0,0,1,16.41,42.22,205.89,205.89,0,0,1,2.52,96.73,133,133,0,0,1,7.74,38.31,235.8,235.8,0,0,0,11.48-155.53C458.51,88.09,361.59,18.05,256.09,19.1Z",
      eyeball: "M344.58,242.53a45.61,45.61,0,0,1,8.95,6.95c12.22,12.21,16.07,29.9,13.26,47.35S354.74,332,340,346.82s-32.54,24-50,26.83-35.13-1-47.35-13.26a48,48,0,0,1-13-24.74,114.74,114.74,0,1,0,114.92-93.12Z",
      iris: "M316.24,254a50.56,50.56,0,0,0-7.08.66c-13,2.09-27.56,9.39-39.76,21.59S249.91,303,247.81,316s.75,23.89,8,31.16S274,357.3,287,355.2s27.56-9.39,39.76-21.59,19.5-26.76,21.59-39.76-.75-23.89-8-31.16c-5.45-5.45-12.94-8.42-21.83-8.68-.74,0-1.49,0-2.25,0Zm-13.81,20.35a16,16,0,0,1,11.86,4.38c7.49,7.5,5.16,22-5.22,32.37s-24.88,12.72-32.38,5.23-5.16-22,5.22-32.38c6.17-6.16,13.78-9.49,20.52-9.6Z"
    },
    classes: {
      spikes: "fill-dark",
      eyeball: "fill-dark",
      iris: "fill-med"
    }
  },
  ResolveHarm2: {
    viewBox: "0 0 512 512",
    paths: {
      spikes: "M261.25,19.1a237.64,237.64,0,0,0-59.11,8.12C75.79,61.08.8,191,34.66,317.31,67.75,440.8,192.55,515.21,316.15,486.92A132.59,132.59,0,0,1,284.89,475a207,207,0,0,1-157.72-57.52l-11.44-12.15-15.68-19.92a205.62,205.62,0,0,1-24-47.36l-7.32-17.33L65.87,296.5a205.41,205.41,0,0,1-.18-54.37l91.84,19.32L76.38,198.26a208,208,0,0,1,29.16-53.84L259.93,252.78,141.87,107a205.79,205.79,0,0,1,63.67-34.49L263.45,141,256,62.45q6.46-.48,12.89-.54a205.54,205.54,0,0,1,61.66,8.84l22.84,8.32,22.83,11.78a207,207,0,0,1,57.17,50.05l13.41,16.85L454.08,173a207.52,207.52,0,0,1,18.93,139,132.67,132.67,0,0,1,7.75,38.31,235.92,235.92,0,0,0,11.48-155.53C463.67,88.09,366.74,18.05,261.25,19.1Z",
      eyeball: "M349.74,242.53a45.61,45.61,0,0,1,8.95,6.95c12.21,12.21,16.07,29.9,13.26,47.35s-12.05,35.21-26.83,50-32.54,24-50,26.83-35.14-1-47.35-13.26a48,48,0,0,1-13-24.74,116.19,116.19,0,0,0-2,21.58,114.73,114.73,0,1,0,117-114.7Z",
      iris: "M321.4,254a50.42,50.42,0,0,0-7.08.66c-13,2.09-27.56,9.39-39.76,21.59S255.06,303,253,316s.75,23.89,8,31.16,18.16,10.12,31.16,8,27.56-9.39,39.76-21.59,19.49-26.76,21.59-39.76-.75-23.89-8-31.16c-5.46-5.45-13-8.42-21.83-8.68-.74,0-1.49,0-2.25,0Zm-13.81,20.35a16,16,0,0,1,11.85,4.38c7.5,7.5,5.16,22-5.22,32.37s-24.87,12.72-32.37,5.23-5.16-22,5.22-32.38c6.16-6.16,13.78-9.49,20.52-9.6Z"
    },
    classes: {
      spikes: "fill-med",
      eyeball: "fill-dark",
      iris: "fill-bright"
    }
  },
  ResolveHarm3: {
    viewBox: "0 0 512 512",
    paths: {
      spikes: "M261.31,19.1a237.51,237.51,0,0,0-59.11,8.12C75.84,61.08.86,191,34.71,317.31,67.8,440.8,192.61,515.21,316.2,486.92A132.35,132.35,0,0,1,285,475a207,207,0,0,1-157.72-57.52l-13.81-16.37-13.31-15.7a206,206,0,0,1-24.06-47.36l83.63-17.33L65.93,296.5a205.41,205.41,0,0,1-.18-54.37l164.66,47.21-154-91.08a208,208,0,0,1,29.15-53.84L260,252.78,141.92,107A205.85,205.85,0,0,1,205.6,72.52l95.49,158.21L256,62.45q6.47-.48,12.9-.54a205.43,205.43,0,0,1,61.65,8.84L353.08,169l23.17-78.14a206.76,206.76,0,0,1,57.16,50.05l13.08,22.41,7.65,9.67a207.52,207.52,0,0,1,18.93,139,132.33,132.33,0,0,1,7.74,38.31,235.8,235.8,0,0,0,11.48-155.53C463.73,88.09,366.8,18.05,261.31,19.1Z",
      eyeball: "M349.79,242.53a45.38,45.38,0,0,1,9,6.95c12.21,12.21,16.07,29.9,13.25,47.35s-12,35.21-26.82,50-32.54,24-50,26.83-35.13-1-47.34-13.26a48,48,0,0,1-13-24.74,116.19,116.19,0,0,0-2,21.58,114.73,114.73,0,1,0,117-114.7Z",
      iris: "M321.45,254a50.56,50.56,0,0,0-7.08.66c-13,2.09-27.55,9.39-39.75,21.59S255.12,303,253,316s.75,23.89,8,31.16,18.16,10.12,31.16,8,27.56-9.39,39.76-21.59,19.49-26.76,21.59-39.76-.75-23.89-8-31.16c-5.45-5.45-12.94-8.42-21.83-8.68-.74,0-1.49,0-2.25,0Zm-13.81,20.35a16,16,0,0,1,11.86,4.38c7.5,7.5,5.16,22-5.22,32.37s-24.88,12.72-32.37,5.23-5.16-22,5.22-32.38c6.16-6.16,13.78-9.49,20.51-9.6Z"
    },
    classes: {
      spikes: "fill-bright",
      eyeball: "fill-med",
      iris: "fill-bright"
    }
  },
  ResolveHarm4: {
    viewBox: "0 0 512 512",
    paths: {
      spikes: "M261.14,19.1A237.51,237.51,0,0,0,202,27.22C75.67,61.08.69,191,34.54,317.31,67.63,440.8,192.44,515.21,316,486.92A132.35,132.35,0,0,1,284.78,475a207,207,0,0,1-157.72-57.52l89.22-30-116.34-2a206,206,0,0,1-24.06-47.36L214,333.21,65.76,296.5a205.41,205.41,0,0,1-.18-54.37l164.66,47.21-154-91.08a208,208,0,0,1,29.15-53.84l154.4,108.36L141.75,107a205.85,205.85,0,0,1,63.68-34.49l95.49,158.21L255.85,62.45q6.47-.48,12.9-.54a205.43,205.43,0,0,1,61.65,8.84L359.77,223.5,376.08,90.85a206.76,206.76,0,0,1,57.16,50.05L415.61,243.13,454,173a207.52,207.52,0,0,1,18.93,139,132.33,132.33,0,0,1,7.74,38.31,235.8,235.8,0,0,0,11.48-155.53C463.55,88.09,366.63,18.05,261.14,19.1Z",
      eyeball: "M349.62,242.53a45.38,45.38,0,0,1,9,6.95c12.21,12.21,16.07,29.9,13.25,47.35s-12,35.21-26.82,50-32.55,24-50,26.83-35.13-1-47.34-13.26a48,48,0,0,1-13-24.74,116.19,116.19,0,0,0-2,21.58,114.73,114.73,0,1,0,117-114.7Z",
      iris: "M321.28,254a50.56,50.56,0,0,0-7.08.66c-13,2.09-27.55,9.39-39.75,21.59S255,303,252.86,316s.75,23.89,8,31.16S279,357.3,292,355.2s27.55-9.39,39.76-21.59,19.49-26.76,21.59-39.76-.75-23.89-8-31.16c-5.45-5.45-12.94-8.42-21.83-8.68-.74,0-1.49,0-2.25,0Zm-13.81,20.35a16,16,0,0,1,11.86,4.38c7.5,7.5,5.16,22-5.22,32.37s-24.88,12.72-32.37,5.23-5.16-22,5.22-32.38c6.16-6.16,13.78-9.49,20.51-9.6Z"
    },
    classes: {
      spikes: "fill-bright",
      eyeball: "fill-bright",
      iris: "fill-bright"
    }
  }
};
Z.registerPlugin(mt);
const qa = "a|above|after|an|and|at|below|but|by|down|for|for|from|in|nor|of|off|on|onto|or|out|so|the|to|under|up|with|yet".split("|").map((s) => new RegExp(`\\b${s}\\b`, "gui")), Cs = [
  "I",
  /[^a-z]{3,}|[.0-9]/gu
].map((s) => /RegExp/.test(Object.prototype.toString.call(s)) ? s : new RegExp(`\\b${s}\\b`, "gui")), za = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse ultricies
nibh sed massa euismod lacinia. Aliquam nec est ac nunc ultricies scelerisque porta vulputate odio.
Integer gravida mattis odio, semper volutpat tellus. Ut elit leo, auctor eget fermentum hendrerit,
aliquet ac nunc. Suspendisse porta turpis vitae mi posuere molestie. Cras lectus lacus, vulputate a
vestibulum in, mattis vel mi. Mauris quis semper mauris. Praesent blandit nec diam eget tincidunt. Nunc
aliquet consequat massa ac lacinia. Ut posuere velit sagittis, vehicula nisl eget, fringilla nibh. Duis
volutpat mattis libero, a porttitor sapien viverra ut. Phasellus vulputate imperdiet ligula, eget
eleifend metus tempor nec. Nam eget sapien risus. Praesent id suscipit elit. Sed pellentesque ligula
diam, non aliquet magna feugiat vitae. Pellentesque ut tortor id erat placerat dignissim. Pellentesque
ut dui vel leo laoreet sodales nec ac tellus. In hac habitasse platea dictumst. Proin sed ex sed augue
sollicitudin interdum. Sed id lacus porttitor nisi vestibulum tincidunt. Nulla facilisi. Vestibulum
feugiat finibus magna in pretium. Proin consectetur lectus nisi, non commodo lectus tempor et. Cras
viverra, mi in consequat aliquet, justo mauris fringilla tellus, at accumsan magna metus in eros. Sed
vehicula, diam ut sagittis semper, purus massa mattis dolor, in posuere.`, Ya = `
aboveboard|account|achiever|acoustics|act|action|activity|actor|addition|adjustment|advertisement|advice|afterglow|afterimage|afterlife|aftermath|afternoon|afterthought|agreement
air|aircraft|airfield|airlift|airline|airmen|airplane|airport|airtime|alarm|allover|allspice|alongside|also|amount|amusement|anger|angle|animal|another|ants|anyhow|anymore
anyone|anyplace|anytime|anywhere|apparatus|apparel|appliance|approval|arch|argument|arithmetic|arm|army|around|art|ashtray|attack|attraction|aunt|authority|babies|baby|babysitter
back|backache|backbone|backbreaker|backdrop|backfire|background|backhand|backlash|backlog|backpack|backside|backslap|backslide|backspace|backspin|backstroke|backtrack|backward
badge|bag|bait|balance|ball|ballroom|bankbook|bankroll|base|baseball|basin|basket|basketball|bat|bath|battle|beachcomb|bead|bear|because|become|bed|bedrock|bedroll|bedroom
beds|bee|beef|beginner|behavior|belief|believe|bell|bellboy|bellhop|bells|below|berry|bike|bikes|bird|birds|birth|birthday|bit|bite|blackball|blackberries|blackbird|blackboard
blackjack|blacklist|blackmail|blackout|blacksmith|blacktop|blade|blood|blow|blowgun|bluebell|blueberry|bluebird|bluefish|bluegrass|blueprint|board|boardwalk|boat|bodyguard
bomb|bone|book|bookcase|bookend|bookkeeper|bookmark|bookmobile|books|bookseller|bookshelf|bookworm|boot|border|bottle|boundary|bowlegs|bowtie|box|boy|brainchild|brake|branch
brass|breath|brick|bridge|brother|bubble|bucket|bugspray|building|bulb|burst|bushes|business|butter|butterball|buttercup|butterfingers|buttermilk|butternut|butterscotch|button
bypass|cabbage|cabdriver|cable|cactus|cake|cakes|calculator|calendar|camera|camp|can|cancan|candlelight|candlestick|cannon|cannot|canvas|cap|caption|car|card|cardsharp|care
carefree|careworn|carfare|carload|carpenter|carpool|carport|carriage|cars|carsick|cart|cartwheel|cast|cat|cats|cattle|catwalk|cause|cave|caveman|celery|cellar|cemetery|cent
centercut|chalk|chance|change|channel|cheese|cheeseburger|cherries|cherry|chess|chicken|chickens|children|chin|church|circle|clam|class|clockwise|cloth|clover|club|coach|coal
coast|coat|cobweb|coffeemaker|coil|collar|color|comeback|committee|commonplace|commonwealth|company|comparison|competition|condition|connection|control|cook|copper|corn|cornmeal
cough|country|courthouse|cover|cow|cows|crack|cracker|crate|crayon|cream|creator|creature|credit|crewcut|crib|crime|crook|crossbow|crossbreed|crosscut|crossover|crosswalk
crow|crowd|crown|cub|cup|current|curtain|curve|cushion|dad|dairymaid|daisywheel|daughter|day|daybed|daybook|daybreak|daydream|daylight|daytime|deadend|deadline|death|debt
decision|deer|degree|design|desire|desk|destruction|detail|development|digestion|dime|dinner|dinosaurs|direction|dirt|discovery|discussion|dishcloth|dishpan|dishwasher|dishwater
diskdrive|distance|distribution|division|dock|doctor|dog|dogs|doll|dolls|donkey|door|doorstop|downtown|downunder|drain|drawbridge|drawer|dress|drink|driveway|driving|drop
duck|duckbill|duckpin|ducks|dust|ear|earache|earring|earth|earthquake|earthward|earthworm|edge|education|effect|egg|egghead|eggnog|eggs|eggshell|elbow|end|engine|error|event
everything|example|exchange|existence|expansion|experience|expert|eye|eyeballs|eyecatching|eyeglasses|eyelash|eyelid|eyes|eyesight|eyewitness|face|fact|fairies|fall|fang|farm
fatherland|fear|feeling|field|finger|fire|fireball|fireboat|firebomb|firebreak|firecracker|firefighter|firehouse|fireman|fireproof|fireworks|fish|fishbowl|fisherman|fisheye
fishhook|fishmonger|fishnet|fishpond|fishtail|flag|flame|flavor|flesh|flight|flock|floor|flower|flowers|fly|fog|fold|food|foot|football|foothill|footlights|footlocker|footprints
forbearer|force|forearm|forebear|forebrain|forecast|foreclose|foreclosure|foredoom|forefather|forefeet|forefinger|forefoot|forego|foregone|forehand|forehead|foreknowledge
foreleg|foreman|forepaws|foresee|foreshadow|forestall|forethought|foretold|forever|forewarn|foreword|forget|fork|forklift|form|fowl|frame|friction|friend|friends|frog|frogs
front|fruit|fruitcup|fuel|furniture|gate|gearshift|geese|ghost|giants|giraffe|girl|girls|glass|glassmaking|glove|gold|goodbye|goodnight|government|governor|grade|grain|grandaunt
granddaughter|grandfather|grandmaster|grandmother|grandnephew|grandparent|grandson|grandstand|granduncle|grape|grass|grassland|graveyard|grip|ground|group|growth|guide|guitar
gumball|gun|hair|haircut|hall|hamburger|hammer|hand|handbook|handgun|handmade|handout|hands|harbor|harmony|hat|hate|head|headache|headlight|headline|headquarters|health|heat
hereafter|hereby|herein|hereupon|highchair|highland|highway|hill|himself|history|hobbies|hole|holiday|home|homemade|hometown|honey|honeybee|honeydew|honeysuckle|hook|hookup
hope|horn|horse|horseback|horsefly|horsehair|horseman|horseplay|horsepower|horseradish|horses|hose|hospital|hot|hour|house|houseboat|household|housekeeper|houses|housetop
however|humor|hydrant|ice|icicle|idea|impulse|income|increase|industry|ink|insect|inside|instrument|insurance|intake|interest|invention|iron|island|itself|jail|jailbait|jam
jar|jeans|jelly|jellybean|jellyfish|jetliner|jetport|jewel|join|judge|juice|jump|jumpshot|kettle|key|keyboard|keyhole|keynote|keypad|keypunch|keystone|keystroke|keyword|kick
kiss|kittens|kitty|knee|knife|knot|knowledge|laborer|lace|ladybug|lake|lamp|land|language|laugh|leather|leg|legs|letter|letters|lettuce|level|library|lifeblood|lifeguard|lifelike
lifeline|lifelong|lifetime|lifework|limelight|limestone|limit|line|linen|lip|liquid|loaf|lock|locket|longhand|look|loss|love|low|lukewarm|lumber|lunch|lunchroom|machine|magic
maid|mailbox|mainline|man|marble|mark|market|mask|mass|match|matchbox|meal|meantime|meanwhile|measure|meat|meeting|memory|men|metal|mice|middle|milk|mind|mine|minister|mint
minute|mist|mitten|mom|money|monkey|month|moon|moonbeam|moonlight|moonlit|moonscape|moonshine|moonstruck|moonwalk|moreover|morning|mother|motion|motorcycle|mountain|mouth
move|muscle|name|nation|nearby|neck|need|needle|nerve|nest|nevermore|newsboy|newsbreak|newscaster|newsdealer|newsletter|newsman|newspaper|newsprint|newsreel|newsroom|night
nightfall|nobody|noise|noisemaker|north|northeast|nose|note|notebook|nowhere|number|nursemaid|nut|nutcracker|oatmeal|observation|ocean|offer|office|oil|oneself|onetime|orange
oranges|order|oven|overboard|overcoat|overflow|overland|pacemaker|page|pail|pan|pancake|paper|parcel|part|partner|party|passbook|passenger|passkey|Passover|passport|payment
peace|pear|pen|pencil|peppermint|person|pest|pet|pets|pickle|pickup|picture|pie|pies|pig|pigs|pin|pinhole|pinstripe|pinup|pinwheel|pipe|pizzas|place|plane|planes|plant|plantation
plants|plastic|plate|play|playback|playground|playhouse|playthings|pleasure|plot|plough|pocket|point|poison|pollution|ponytail|popcorn|porter|position|postcard|pot|potato
powder|power|price|produce|profit|property|prose|protest|pull|pump|punishment|purpose|push|quarter|quartz|queen|question|quicksand|quiet|quill|quilt|quince|quiver|rabbit|rabbits
racquetball|rail|railroad|railway|rain|raincheck|raincoat|rainstorm|rainwater|rake|range|rat|rate|rattlesnake|rattletrap|ray|reaction|reading|reason|receipt|recess|record
regret|relation|religion|repairman|representative|request|respect|rest|reward|rhythm|rice|riddle|rifle|ring|rings|river|riverbanks|road|robin|rock|rod|roll|roof|room|root
rose|route|rub|rubberband|rule|run|sack|sail|sailboat|salesclerk|salt|sand|sandlot|sandstone|saucepan|scale|scapegoat|scarecrow|scarf|scene|scent|school|schoolbook|schoolboy
schoolbus|schoolhouse|science|scissors|screw|sea|seashore|seat|secretary|seed|selection|self|sense|servant|shade|shadyside|shake|shame|shape|sharecropper|sharpshooter|sheep
sheepskin|sheet|shelf|ship|shirt|shock|shoe|shoelace|shoemaker|shoes|shop|shortbread|show|showoff|showplace|side|sidekick|sidewalk|sign|silk|silver|silversmith|sink|sister
sisterhood|sisters|sixfold|size|skate|skateboard|skin|skintight|skirt|sky|skylark|skylight|slave|sleep|sleet|slip|slope|slowdown|slumlord|smash|smell|smile|smoke|snail|snails
snake|snakes|snakeskin|sneeze|snow|snowball|snowbank|snowbird|snowdrift|snowshovel|soap|society|sock|soda|sofa|softball|somebody|someday|somehow|someone|someplace|something
sometimes|somewhat|somewhere|son|song|songs|sort|sound|soundproof|soup|southeast|southwest|soybean|space|spacewalk|spade|spark|spearmint|spiders|spillway|spokesperson|sponge
spoon|spot|spring|spy|square|squirrel|stage|stagehand|stamp|standby|standoff|standout|standpoint|star|starfish|start|statement|station|steam|steamship|steel|stem|step|stepson
stew|stick|sticks|stitch|stocking|stockroom|stomach|stone|stop|stoplight|stopwatch|store|story|stove|stranger|straw|stream|street|stretch|string|stronghold|structure|substance
subway|sugar|suggestion|suit|summer|sun|sunbaked|sunbathe|sundial|sundown|sunfish|sunflower|sunglasses|sunlit|sunray|sunroof|sunup|supercargo|supercharge|supercool|superego
superfine|supergiant|superhero|superhighways|superhuman|superimpose|supermarket|supermen|supernatural|superpower|superscript|supersensitive|supersonic|superstar|superstrong
superstructure|supertanker|superweapon|superwoman|support|surprise|sweater|sweetheart|sweetmeat|swim|swing|system|table|tablecloth|tablespoon|tabletop|tableware|tail|tailcoat
tailgate|taillight|taillike|tailpiece|tailspin|takeoff|takeout|takeover|talebearer|taleteller|talk|tank|tapeworm|taproom|taproot|target|taskmaster|taste|tax|taxicab|taxpayer
teaching|teacup|team|teammate|teamwork|teapot|teaspoon|teenager|teeth|telltale|temper|tendency|tenderfoot|tenfold|tent|territory|test|textbook|texture|theory|therefore|thing
things|thought|thread|thrill|throat|throne|throwaway|throwback|thumb|thunder|thunderbird|thunderstorm|ticket|tiger|time|timekeeper|timesaving|timeshare|timetable|tin|title
toad|toe|toes|together|tomatoes|tongue|toolbox|tooth|toothbrush|toothpaste|toothpick|top|touch|touchdown|town|township|toy|toys|trade|trail|train|trains|tramp|transport|tray
treatment|tree|trees|trick|trip|trouble|trousers|truck|trucks|tub|turkey|turn|turnabout|turnaround|turnbuckle|turndown|turnkey|turnoff|turntable|twig|twist|typewriter|umbrella
uncle|underachieve|underage|underarm|underbelly|underbid|undercharge|underclothes|undercover|undercut|underdevelop|underestimate|underexpose|underfoot|underground|underwear
unit|upbeat|upbringing|upcoming|update|upend|upgrade|upheaval|uphill|uphold|upkeep|upland|uplift|upload|upmarket|upon|uppercase|upperclassman|uppercut|uproar|uproot|upset
upshot|upside|upstage|upstairs|upstanding|upstart|upstate|upstream|uptake|upthrust|uptight|uptime|uptown|upward|upwind|use|vacation|value|van|vase|vegetable|veil|vein|verse
vessel|vest|view|visitor|voice|volcano|volleyball|voyage|waistline|walk|walkways|wall|walleyed|wallpaper|war|wardroom|warfare|warmblooded|warpath|wash|washbowl|washcloth|washhouse
washout|washrag|washroom|washstand|washtub|waste|wastebasket|wasteland|wastepaper|wastewater|watch|watchband|watchdog|watchmaker|watchman|watchtower|watchword|water|watercolor
watercooler|watercraft|waterfall|waterfront|waterline|waterlog|watermelon|waterpower|waterproof|waterscape|watershed|waterside|waterspout|watertight|wave|wavelike|waves|wax
waxwork|way|waybill|wayfarer|waylaid|wayside|wayward|wealth|weather|weathercock|weatherman|weatherproof|week|weekday|weekend|weeknight|weight|whatever|whatsoever|wheel|wheelchair
wheelhouse|whip|whistle|whitecap|whitefish|whitewall|whitewash|widespread|wilderness|wind|window|wine|wing|winter|wipeout|wire|wish|without|woman|women|wood|woodshop|wool
word|work|worm|wound|wren|wrench|wrist|writer|writing|yak|yam|yard|yarn|year|yoke|zebra|zephyr|zinc|zipper|zoo
`.split("|"), De = {
  ones: [
    "zero",
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
    "ten",
    "eleven",
    "twelve",
    "thirteen",
    "fourteen",
    "fifteen",
    "sixteen",
    "seventeen",
    "eighteen",
    "nineteen",
    "twenty"
  ],
  tens: ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"],
  tiers: ["", "thousand", "million", "billion", "trillion", "quadrillion", "quintillion", "sextillion", "septillion", "octillion", "nonillion"],
  bigPrefixes: ["", "un", "duo", "tre", "quattuor", "quin", "sex", "octo", "novem"],
  bigSuffixes: ["", "decillion", "vigintillion", "trigintillion", "quadragintillion", "quinquagintillion", "sexagintillion", "septuagintillion", "octogintillion", "nonagintillion", "centillion"]
}, Is = {
  zero: "zeroeth",
  one: "first",
  two: "second",
  three: "third",
  four: "fourth",
  five: "fifth",
  eight: "eighth",
  nine: "ninth",
  twelve: "twelfth",
  twenty: "twentieth",
  thirty: "thirtieth",
  forty: "fortieth",
  fifty: "fiftieth",
  sixty: "sixtieth",
  seventy: "seventieth",
  eighty: "eightieth",
  ninety: "ninetieth"
}, Ua = {
  grouped: [
    ["", "Ⅰ", "Ⅱ", "Ⅲ", "Ⅳ", "Ⅴ", "Ⅵ", "Ⅶ", "Ⅷ", "Ⅸ"],
    ["", "Ⅹ", "ⅩⅩ", "ⅩⅩⅩ", "ⅩⅬ", "Ⅼ", "ⅬⅩ", "ⅬⅩⅩ", "ⅬⅩⅩⅩ", "ⅩⅭ"],
    ["", "Ⅽ", "ⅭⅭ", "ⅭⅭⅭ", "ⅭⅮ", "Ⅾ", "ⅮⅭ", "ⅮⅭⅭ", "ⅮⅭⅭⅭ", "ⅭⅯ"],
    ["", "Ⅿ", "ⅯⅯ", "ⅯⅯⅯ", "Ⅿↁ", "ↁ", "ↁⅯ", "ↁⅯⅯ", "ↁⅯⅯⅯ", "ↁↂ"],
    ["", "ↂ", "ↂↂ", "ↂↂↂ", "ↂↇ", "ↇ", "ↇↂ", "ↇↂↂ", "ↇↂↂↂ", "ↇↈ"],
    ["", "ↈ", "ↈↈ", "ↈↈↈ"]
  ],
  ungrouped: [
    ["", "Ⅰ", "ⅠⅠ", "ⅠⅠⅠ", "ⅠⅤ", "Ⅴ", "ⅤⅠ", "ⅤⅠⅠ", "ⅤⅠⅠⅠ", "ⅠⅩ"],
    ["", "Ⅹ", "ⅩⅩ", "ⅩⅩⅩ", "ⅩⅬ", "Ⅼ", "ⅬⅩ", "ⅬⅩⅩ", "ⅬⅩⅩⅩ", "ⅩⅭ"],
    ["", "Ⅽ", "ⅭⅭ", "ⅭⅭⅭ", "ⅭⅮ", "Ⅾ", "ⅮⅭ", "ⅮⅭⅭ", "ⅮⅭⅭⅭ", "ⅭⅯ"],
    ["", "Ⅿ", "ⅯⅯ", "ⅯⅯⅯ", "Ⅿↁ", "ↁ", "ↁⅯ", "ↁⅯⅯ", "ↁⅯⅯⅯ", "ↁↂ"],
    ["", "ↂ", "ↂↂ", "ↂↂↂ", "ↂↇ", "ↇ", "ↇↂ", "ↇↂↂ", "ↇↂↂↂ", "ↇↈ"],
    ["", "ↈ", "ↈↈ", "ↈↈↈ"]
  ]
}, Kt = [], Za = () => {
  var s, t;
  return ((t = (s = game == null ? void 0 : game.user) == null ? void 0 : s.find((e) => e.isGM)) == null ? void 0 : t.id) ?? !1;
}, Ot = (s) => typeof s == "number" && !isNaN(s), Zs = (s) => typeof s == "string" && !isNaN(parseFloat(s)) && isFinite(parseFloat(s)), Xs = (s) => typeof s == "string" && (s === "true" || s === "false"), z = (s) => Array.isArray(s), Js = (s) => s === Object(s) && !z(s), Pe = (s) => s === Object(s) && !z(s), Xa = (s) => typeof s == "function", it = (s) => Ot(s) && Math.round(s) === s, Qs = (s) => Ot(s) && /\./.test(`${s}`), Yt = (s) => it(s) && s >= 0, ea = (s) => Pe(s) || z(s), Ja = (s) => typeof s == "object" && s !== null && Symbol.iterator in s, Qa = (s) => typeof s == "string" && /^<.*>$/u.test(s), Mt = (s) => typeof s == "string" && /^#(([0-9a-fA-F]{2}){3,4}|[0-9a-fA-F]{3,4})$/.test(s), xt = (s) => typeof s == "string" && /^rgba?\((\d{1,3},\s*){1,2}?\d{1,3},\s*\d{1,3}(\.\d+)?\)$/.test(s), Ce = (s) => s === void 0, ot = (s) => !Ce(s), ns = (s) => Object.keys(s).length === 0, ls = (s) => !ns(s), er = (s, t) => t instanceof s, tr = (s) => Ce(s) || s === null;
function ta(s, t) {
  let e;
  try {
    e = JSON.stringify(s);
  } catch {
    e = String(s);
  }
  if (s === void 0)
    throw new Error(`Value ${e} is undefined!`);
  if (typeof t == "string") {
    if (typeof s !== t)
      throw new Error(`Value ${e} is not a ${t}!`);
  } else if (!(s instanceof t))
    throw new Error(`Value ${e} is not a ${t.name}!`);
}
const sa = (s, t) => [null, void 0].includes(s) && [null, void 0].includes(t) ? !0 : [null, void 0].includes(s) || [null, void 0].includes(t) ? !1 : typeof s == "number" && typeof t == "number" || typeof s == "boolean" && typeof t == "boolean" || typeof s == "string" && typeof t == "string" ? s === t : typeof s == "number" && typeof t == "string" ? s === Number(t) : typeof s == "string" && typeof t == "number" ? Number(s) === t : typeof s == "boolean" && typeof t == "object" || typeof s == "object" && typeof t == "boolean" ? !1 : typeof s == "boolean" && typeof t == "string" ? s && t !== "" || !s && t === "" : typeof s == "string" && typeof t == "boolean" ? t && s !== "" || !t && s === "" : (typeof s == "number" || typeof s == "string") && typeof t == "object" || typeof s == "object" && (typeof t == "number" || typeof t == "string") ? !1 : typeof s == "object" && typeof t == "object" ? s === t : !1, sr = (...s) => {
  do {
    const t = s.pop();
    if (s.length && !sa(t, s[0]))
      return !1;
  } while (s.length);
  return !0;
}, ye = (s, t, e = !1) => (typeof s == "string" && (s = parseFloat(s)), typeof s == "number" ? isNaN(s) ? e ? NaN : 0 : Ce(t) ? s : Math.round(s * 10 ** t) / 10 ** t : e ? NaN : 0), pe = (s, t, e) => {
  let a = !1;
  return typeof t == "boolean" && (a = t), isNaN(ye(s, 0, a)) ? NaN : Math.round(ye(s, 0, a));
}, ar = (s) => typeof s == "boolean" ? s : [0, null, void 0, ""].includes(s) ? !1 : typeof s == "string" ? !["0", "false", "null", "undefined", ""].includes(s) : !(z(s) && s.length === 0 || Pe(s) && ns(s)), aa = (s, t = !0) => (s = t ? s % (2 * Math.PI) : s, s *= 180 / Math.PI, s), rr = (s, t = !0) => (s = t ? s % 360 : s, s *= Math.PI / 180, s), ir = (s, t) => s in t ? t[s] : null, or = {
  IsInstance: (s) => (t) => typeof s == "function" && t instanceof s
}, ra = (s) => String(s).toUpperCase(), Oe = (s) => String(s).toLowerCase(), cs = (s) => {
  let [t, ...e] = `${s ?? ""}`.split(/\s+/);
  return t = Tt(t, Cs) ? t : `${ra(t.charAt(0))}${Oe(t.slice(1))}`, ls(e) && (e = e.map((a) => Tt(a, Cs) ? a : Oe(a))), [t, ...e].join(" ").trim();
}, nr = (s) => String(s).split(/\s/).map((t, e) => e && Tt(t, qa) ? Oe(t) : cs(t)).join(" ").trim(), Tt = (s, t = [], e = "gui", a = !1) => t.map((r) => r instanceof RegExp ? r : new RegExp(`\\b${r}\\b`, e))[a ? "every" : "some"]((r) => r.test(`${s}`)), We = (s, t, e) => {
  const a = [];
  [...(e ?? "").replace(/g/g, ""), "u"].forEach((o) => {
    o && !a.includes(o) && a.push(o);
  });
  const r = /[)(]/.test(t.toString().replace(/\\\)|\\\(/g, ""));
  r && a.push("g"), e = a.join(""), t = new RegExp(t, e);
  const i = `${s}`.match(t) || [];
  return r ? Array.from(i) : i.pop();
}, lr = (s) => `${s}`.replace(/[\u00AD\u200B]/gu, ""), cr = (s) => `${s}`.replace(/\b([aA])\s([aeiouAEIOU])/gu, "$1n $2"), hr = (s, t = 2, e) => ye(t) === 1 ? s : e ?? `${s.replace(/y$/, "ie").replace(/s$/, "se")}s`, dr = (s, t = !0, e = "and") => {
  if (s.length === 0)
    return "";
  if (s.length === 1)
    return `${s[0]}`;
  const a = s.pop();
  return [
    s.join(", "),
    t ? "," : "",
    ` ${e} `,
    a
  ].join("");
}, ur = (s, t) => {
  const e = String(s);
  return e.length > t ? `${e.slice(0, t - 3)}…` : e;
}, gr = (s, t, e = " ") => {
  const a = `${s}`;
  return a.length < t ? `${e.repeat(t - a.length)}${a}` : a;
}, pr = (s) => (s ?? "").toLowerCase().replace(/ /g, "-").replace(/default/, "DEFAULT"), ia = (s, t = "", e = "+") => {
  let a;
  const r = ye(s);
  return r < 0 ? a = "-" : r === 0 ? a = e : a = "+", `${a}${t}${Math.abs(r)}`;
}, mr = (s, t, e = !1) => {
  const a = e && s >= 0 ? "+" : "", [r, i] = `${ye(s)}`.split(/\./);
  return getType(i) === "int" ? i.length > t ? `${a}${ye(s, t)}` : i.length < t ? `${a}${r}.${i}${"0".repeat(t - i.length)}` : `${a}${ye(s)}` : `${a}${r}.${"0".repeat(t)}`;
}, hs = (s) => {
  var r;
  if (ye(s) === 0)
    return "0";
  const t = Oe(s).replace(/[^\d.e+-]/g, ""), e = We(t, /^-?[\d.]+/), a = pe(We(t, /e([+-]?\d+)$/));
  if (typeof e == "string" && typeof a == "string") {
    let i = We(e, /^-?(\d+)/), o = We(e, /\.(\d+)/);
    if (z(i) && z(o) && (i = (r = i.pop()) == null ? void 0 : r.replace(/^0+/, ""), o = Oe(o == null ? void 0 : o.pop()).replace(/0+$/, ""), !Ce(i) && !Ce(o))) {
      const n = Math.max(0, i.length + a), l = Math.max(0, o.length - a), c = [
        i.slice(0, n),
        o.slice(0, Math.max(0, a))
      ].join("") || "0", d = [
        i.length - n > 0 ? i.slice(i.length - n - 1) : "",
        o.slice(o.length - l)
      ].join("");
      return [
        t.charAt(0) === "-" ? "-" : "",
        c,
        "0".repeat(Math.max(0, n - c.length)),
        d.length ? "." : "",
        "0".repeat(Math.max(0, l - d.length)),
        d
      ].join("");
    }
  }
  return `${s}`;
}, oa = (s) => {
  var l;
  s = hs(s);
  const t = (c) => c < De.tiers.length ? De.tiers[c] : [
    De.bigPrefixes[c % 10 - 1],
    De.bigSuffixes[Math.floor(c / 10)]
  ].join(""), e = (c) => {
    if (pe(c) === 0)
      return "";
    const d = `${c}`.split("").map((u) => pe(u));
    let p = "";
    if (d.length === 3) {
      const u = d.shift();
      if (Ce(u))
        throw new Error(`[U.verbalizeNum] Undefined digit in trio '${d.join("")}'.`);
      p += u > 0 ? `${De.ones[u]} hundred` : "", u && (d[0] || d[1]) && (p += " and ");
    }
    if (pe(d.join("")) <= De.ones.length)
      p += De.ones[pe(d.join(""))];
    else {
      const u = De.tens[pe(d.shift())], f = pe(d[0]) > 0 ? `-${De.ones[pe(d[0])]}` : "";
      p += `${u}${f}`;
    }
    return p;
  }, a = [];
  s.charAt(0) === "-" && a.push("negative");
  const [r, i] = s.replace(/[,\s-]/g, "").split("."), o = ((l = [...r.split("")].reverse().join("").match(/.{1,3}/g)) == null ? void 0 : l.map((c) => [...c.split("")].reverse().join(""))) ?? [], n = [];
  for (; o.length; ) {
    const c = o.pop();
    if (c) {
      const d = e(c);
      d && n.push(`${d} ${t(o.length)}`);
    }
  }
  if (a.push(n.join(", ").trim()), getType(i) === "int") {
    r === "0" && a.push("zero"), a.push("point");
    for (const c of i.split(""))
      a.push(De.ones[pe(c)]);
  }
  return a.join(" ");
}, fr = (s, t = !1) => {
  if (t) {
    const [e, a] = Oe(oa(s)).match(/.*?[-\s]?(\w*)$/i) ?? ["", ""];
    return e.replace(
      new RegExp(`${a}$`),
      a in Is ? Is[a] : `${a}th`
    );
  }
  return /(\.)|(1[1-3]$)/.test(`${s}`) ? `${s}th` : `${s}${["th", "st", "nd", "rd", "th", "th", "th", "th", "th", "th"][pe(`${s}`.charAt(`${s}`.length - 1))]}`;
}, yr = (s, t = !0) => {
  if (Qs(s))
    throw new Error(`Error: Can't Romanize Floats (${s})`);
  if (s >= 4e5)
    throw new Error(`Error: Can't Romanize >= 400,000 (${s})`);
  if (s < 0)
    throw new Error(`Error: Can't Romanize Negative Numbers (${s})`);
  if (s === 0)
    return "0";
  const e = Ua[t ? "grouped" : "ungrouped"], a = [...hs(s).split("")].reverse().map((r, i) => e[i][pe(r)]).reverse().join("");
  return t ? a.replace(/ⅩⅠ/gu, "Ⅺ").replace(/ⅩⅡ/gu, "Ⅻ") : a;
}, br = (s = 200) => {
  const t = za.split(/\n?\s+/g), e = [...t[_t(0, t.length - 1)]];
  for (; e.length < s; )
    e.push(...t);
  return e.length = s, `${cs(e.join(" ")).trim().replace(/[^a-z\s]*$/ui, "")}.`;
}, vr = (s = 5) => Array.from({ length: s }).map(() => String.fromCharCode(ds(...["a", "z"].map((t) => t.charCodeAt(0))))).join(""), wr = (s = 1, t = Ya) => Array.from({ length: s }).map(() => gs([...t])).join(" "), kr = (s) => {
  const t = Math.max(
    0,
    ...Kt.filter(([a]) => a.startsWith(s)).map(([, , a]) => a)
  ) + 1, e = t === 1 ? s : `${s}_${t}`;
  return Kt.push([s, e, t]), eLog.log(`UUIDify(${s}) --> [${e}, ${t}]`), Object.assign(globalThis, { UUIDLOG: Kt }), e;
}, Tr = (s, t) => {
  const [e, a] = [s, t].map((r) => Oe(String(r).replace(/[^a-zA-Z0-9.+-]/g, "").trim()));
  return e.length > 0 && e === a;
}, na = (s, t = [], e = 0) => {
  const a = [
    (n, l) => new RegExp(`^${n}$`, "gu").test(`${l}`),
    (n, l) => new RegExp(`^${n}$`, "gui").test(`${l}`)
  ];
  if (e >= 1) {
    const n = [
      (l, c) => new RegExp(`^${l}`, "gui").test(`${c}`),
      (l, c) => new RegExp(`${l}$`, "gui").test(`${c}`),
      (l, c) => new RegExp(`${l}`, "gui").test(`${c}`),
      (l, c) => new RegExp(`${c}`, "gui").test(`${l}`)
    ];
    a.push(...n), e >= 2 && (a.push(...n.map((l) => (c, d) => l(`${c}`.replace(/\W/g, ""), `${d}`.replace(/\W/gu, "")))), e >= 3 && a.push(() => !1));
  }
  const r = `${s}`, i = (() => {
    if (z(t))
      return [...t];
    if (Pe(t))
      return Object.keys(t);
    try {
      return Array.from(t);
    } catch {
      throw new Error(`Haystack type must be [list, array], not ${typeof t}: ${JSON.stringify(t)}`);
    }
  })();
  if (!z(i))
    return !1;
  let o = -1;
  for (; !Yt(o); ) {
    const n = a.shift();
    if (!n)
      return !1;
    o = i.findIndex((l) => n(r, `${l}`));
  }
  return Yt(o) ? Pe(t) ? Object.values(t)[o] : t[o] : !1;
}, Sr = (s, t) => na(s, t, 0), _t = (s, t, e = 0) => Z.utils.random(s, t, e), ds = (s, t) => _t(s, t, 1), Cr = () => _t(0, 1, 1) === 1, la = (s, [t = 0, e = 1 / 0] = []) => Z.utils.wrap(t, e, s), Ir = (s, [t = 0, e = 1 / 0] = []) => Z.utils.clamp(t, e, s), us = (s, t = [0, 360]) => la(s, t), dt = (s, t = 0) => t === 0 ? pe(s) : ye(s, t), ca = (...s) => Object.values(s.flat()).reduce((t, e) => e + t, 0), Ar = (...s) => ca(...s) / s.flat().length, Dr = ({ x: s, y: t }, { x: e, y: a }) => ((s - e) ** 2 + (t - a) ** 2) ** 0.5, Er = ({ x: s, y: t }, { x: e, y: a }, { x: r, y: i } = { x: 0, y: 0 }, o = [0, 360]) => (s -= r, t -= i, e -= r, a -= i, us(aa(Math.atan2(a - t, e - s)), o)), ha = (s, t, e = [0, 360]) => us(t - s, e), Pr = (s) => {
  let t = 1 / 0, e = 1 / 0, a = -1 / 0, r = -1 / 0;
  for (const c of s) {
    let d, p, u, f;
    if (c.radius !== void 0)
      d = c.x - c.radius, p = c.y - c.radius, u = c.x + c.radius, f = c.y + c.radius;
    else if (c.size !== void 0)
      d = (c.x - c.size) / 2, p = (c.y - c.size) / 2, u = (c.x + c.size) / 2, f = (c.y + c.size) / 2;
    else if (c.width !== void 0 || c.height !== void 0)
      c.width ?? (c.width = c.height), c.height ?? (c.height = c.width), d = (c.x - c.width) / 2, p = (c.y - c.height) / 2, u = (c.x + c.width) / 2, f = (c.y + c.height) / 2;
    else
      throw new Error(`[getBoundingRectangle] Error: shape must be a circle, square, or rectangle, not ${JSON.stringify(c)}`);
    t = Math.min(t, d), e = Math.min(e, p), a = Math.max(a, u), r = Math.max(r, f);
  }
  const i = a - t, o = r - e, n = (t + i) / 2, l = (e + o) / 2;
  return { x: n, y: l, width: i, height: o };
}, gs = (s) => Z.utils.random(s), Or = (s) => ds(0, s.length - 1), Mr = (s, t) => {
  const e = [];
  for (let a = s; a <= t; a++)
    e.push(a);
  return e;
}, xr = (s, t = 0) => {
  const e = Z.utils.wrap(s);
  return t--, function* () {
    for (; ; )
      t++, yield e(t);
  }();
};
function _r(s) {
  if (s = Object.values(s), s.length === 0)
    throw new Error("Cannot get last element of an empty array.");
  return s[s.length - 1];
}
const Lr = (s) => {
  const t = [];
  return s.forEach((e) => {
    t.includes(e) || t.push(e);
  }), t;
}, $r = (s, t) => {
  const e = {};
  return s.forEach((a) => {
    const r = a[t];
    let i = e[r];
    i || (i = [], e[r] = i), i.push(a);
  }), e;
}, Rr = (s, t = 1, e = !0, a = (r, i) => !i.includes(r)) => {
  const r = [];
  let i = 0;
  for (; r.length < t && i < 1e6; ) {
    const o = gs(s);
    e && a(o, r) && r.push(o), i++;
  }
  return r;
}, Fr = (s, t) => s.splice(s.findIndex((e) => e === t));
function da(s, t) {
  let e;
  typeof t != "function" ? e = (r) => r === t : e = t;
  const a = s.findIndex((r, i, o) => e(r, i, o));
  if (a !== -1)
    return s.splice(a, 1).pop();
}
const Nr = (s, t) => da(s, (e, a) => a === t), Hr = (s, t) => {
  const e = [];
  for (; s.length > t; ) {
    const a = [];
    for (; a.length < t; )
      a.push(s.shift());
    e.push(a);
  }
  return e.push(s), e;
}, Br = (s) => {
  let t = s.length, e;
  for (; t !== 0; )
    e = Math.floor(Math.random() * t), t--, [s[t], s[e]] = [
      s[e],
      s[t]
    ];
  return s;
}, Kr = (s) => Z.utils.toArray(s), St = ({ k: s, v: t }, e) => typeof e == "function" ? ot(t) ? e(t, s) : e(s) : (typeof e == "number" && (e = `${e}`), new RegExp(e).test(`${t}`)), Wr = (s, t) => {
  if (z(s)) {
    const e = s.findIndex((a) => St({ v: a }, t));
    if (e >= 0)
      return jr(s, e);
  } else if (Pe(s)) {
    const [e] = Object.entries(s).find(([a, r]) => St({ k: a, v: r }, t)) ?? [];
    if (e)
      return Gr(s, e);
  }
  return !1;
}, jr = (s, t) => {
  let e;
  for (let a = 0; a <= s.length; a++)
    a === t ? e = s.shift() : s.push(s.shift());
  return e;
}, Gr = (s, t) => {
  const e = s[t];
  return delete s[t], e;
}, Vr = (s, t, e) => {
  let a;
  if (Pe(s)) {
    if ([a] = Object.entries(s).find((r) => St({ v: r }, t)) || [!1], a === !1)
      return !1;
  } else if (z(s) && (a = s.findIndex((r) => St({ v: r }, t)), a === -1))
    return !1;
  return typeof a != "number" && (a = `${a}`), typeof e == "function" ? s[a] = e(s[a], a) : s[a] = e, !0;
}, Ut = (s, t = [void 0, null, "", {}, []]) => {
  if (t.map((a) => JSON.stringify(a)).includes(JSON.stringify(s)) || t.includes(s))
    return "KILL";
  if (Array.isArray(s)) {
    const a = s.map((r) => Ut(r, t)).filter((r) => r !== "KILL");
    return Array.isArray(a) && a.length ? a : "KILL";
  }
  if (s && typeof s == "object" && JSON.stringify(s).startsWith("{")) {
    const a = Object.entries(s).map(([r, i]) => [r, Ut(i, t)]).filter(([, r]) => r !== "KILL");
    return a.length ? Object.fromEntries(a) : "KILL";
  }
  return s;
}, qr = (s, t = () => !0) => [
  Ct(s, t),
  Ct(s, (e, a) => !t(e, a))
], zr = (s, t) => {
  if (s.length !== t.length)
    throw new Error("The arrays must be of equal length.");
  if (new Set(s).size !== s.length)
    throw new Error("The keys must be unique.");
  const e = {};
  return s.forEach((a, r) => {
    e[a] = t[r];
  }), e;
};
function ua(s, t, e) {
  let a = e, r = t;
  return a || (a = t, r = !1), r || (r = (i) => i), Array.isArray(s) ? s.map(a) : Object.fromEntries(Object.entries(s).map(([i, o]) => (ta(a, "function"), [r(i, o), a(o, i)])));
}
const ga = (s) => Js(s) ? Object.keys(s).length : z(s) ? s.length : s === !1 || s === null || s === void 0 ? 0 : 1;
function Yr(s, t, e) {
  if (e || (e = t, t = !1), t || (t = (o) => o), z(s))
    return s.findIndex(e);
  const a = t || (() => !0), r = e || (() => !0), i = Object.entries(s).find(([o, n]) => a(o, n) && r(n, o));
  return i ? i[0] : !1;
}
const Ct = (s, t, e, a = !1) => {
  if (e || (e = t, t = !1), t || (t = (o) => o), z(s)) {
    const o = s.filter(e);
    return a ? (s.splice(0, s.length, ...o), s) : o;
  }
  const r = t || (() => !0), i = e || (() => !0);
  if (a) {
    const o = Object.entries(s).filter(([n, l]) => !(r(n, l) && i(l, n)));
    for (const [n] of o)
      delete s[n];
    return s;
  }
  return Object.fromEntries(
    Object.entries(s).filter(([o, n]) => r(o, n) && i(n, o))
  );
}, Ur = (s, t) => {
  z(s) ? s.forEach(t) : Object.entries(s).forEach(([e, a]) => t(a, e));
}, Zr = (s, t = [void 0, null], e = !1) => Ct(s, (a) => !t.includes(a), void 0, e), pa = (s, t = !1) => {
  const e = (r) => [...r], a = (r) => ({ ...r });
  try {
    return JSON.parse(JSON.stringify(s));
  } catch (r) {
    if (t)
      throw r;
    if (Array.isArray(s))
      return e(s);
    if (typeof s == "object")
      return a(s);
  }
  return s;
};
function ma(s, t, {
  isMutatingOk: e = !1,
  isStrictlySafe: a = !1,
  isConcatenatingArrays: r = !0,
  isReplacingArrays: i = !1
} = {}) {
  if (s = e ? s : pa(s, a), t && typeof t == "object" && "id" in t && $t(t.id) || Ce(s))
    return t;
  if (Ce(t) || !ea(t))
    return s;
  for (const [o, n] of Object.entries(t)) {
    const l = s[o];
    i && z(l) && z(n) ? s[o] = n : r && z(l) && z(n) ? s[o].push(...n) : n !== null && typeof n == "object" ? (Ce(l) && !(n instanceof Application) && (s[o] = new (Object.getPrototypeOf(n)).constructor()), s[o] = ma(
      s[o],
      n,
      { isMutatingOk: !0, isStrictlySafe: a }
    )) : s[o] = n;
  }
  return s;
}
function fa(s, t) {
  const e = {}, a = Object.keys(t).filter((i) => Object.hasOwn(t, i) && Object.hasOwn(s, i)), r = Object.keys(t).filter((i) => Object.hasOwn(t, i) && !Object.hasOwn(s, i));
  for (const i of a)
    if (typeof s[i] == "object" && typeof t[i] == "object" && !Array.isArray(s[i]) && !Array.isArray(t[i])) {
      const o = fa(s[i], t[i]);
      Object.keys(o).length > 0 && (e[i] = o);
    } else if (Array.isArray(s[i]) && Array.isArray(t[i])) {
      const o = s[i], n = t[i];
      o.toString() !== n.toString() && (e[i] = t[i]);
    } else
      s[i] !== t[i] && (e[i] = t[i]);
  for (const i of r)
    e[`-=${i}`] = t[i];
  return e;
}
const ya = (s) => {
  const t = {};
  for (const [a, r] of Object.entries(s))
    if (Pe(r)) {
      const i = ya(r);
      setProperty(t, a, i);
    } else
      setProperty(t, a, r);
  function e(a) {
    return Pe(a) ? /^\d+$/.test(Object.keys(a).join("")) ? Object.values(a).map(e) : ua(a, (r) => e(r)) : z(a) ? a.map(e) : a;
  }
  return e(t);
}, ba = (s) => {
  const t = {};
  for (const [e, a] of Object.entries(s))
    if ((z(a) || Pe(a)) && ls(a))
      for (const [r, i] of Object.entries(ba(a)))
        t[`${e}.${r}`] = i;
    else
      t[e] = a;
  return t;
};
function Xr(s) {
  return ea(s) ? Array.isArray(s) ? (s.forEach((t, e) => {
    s[e] = null;
  }), s) : (Object.keys(s).forEach((t) => {
    s[t] = null;
  }), s) : s;
}
function Jr(s, ...t) {
  const e = t[0];
  if (e instanceof Object && !Array.isArray(e)) {
    const a = e;
    for (const r in a)
      if (s[r] === void 0)
        throw new Error(`Missing value for ${r}`);
  } else
    for (const a of t)
      if (s[a] === void 0)
        throw new Error(`Missing value for ${String(a)}`);
  return s;
}
const Qr = (s, t, e) => {
  if (typeof t == "function") {
    const a = { [s](...r) {
      return t(...r);
    } }[s];
    return e ? a.bind(e) : a;
  }
  return !1;
}, ei = (s) => (...t) => (console.log(`calling ${s.name}`), s(...t)), ti = (s, t, e = !1) => {
  s = $(s)[0], t = $(t)[0];
  const a = $(s).parent()[0], r = {
    x: Z.getProperty(s, "x"),
    y: Z.getProperty(s, "y")
  }, i = mt.convertCoordinates(
    a,
    t,
    r
  );
  return eLog.checkLog3("changeContainer", "Target Element", { elem: s, container: t, curContainer: a, curPosition: r, relPos: i }), e && (s = $(s).clone()[0]), $(s).appendTo($(t)), Z.set(s, i), s;
}, va = (s, t, e, a, r = 8) => {
  s = $(s)[0], a ? s.style.setProperty("width", `${a}px`, "important") : s.style.setProperty("width", "max-content", "important");
  function i() {
    s = $(s)[0];
    const u = parseFloat(o.fontSize) * 0.8, f = parseFloat(o.lineHeight) * 0.8;
    return u < r ? !1 : (s.style.fontSize = `${u}px`, s.style.lineHeight = `${f}px`, va(s, t, l ?? e, a, r));
  }
  const o = window.getComputedStyle(s), n = parseFloat(o.lineHeight);
  let l;
  it(e) && e < n && (l = e);
  const c = parseFloat(o.width);
  let d = c, p = !1;
  for (let u = 1; ; u++) {
    const f = n * u, y = c / u;
    if (y / f < t)
      break;
    if (it(l)) {
      if (u > l) {
        if (i())
          return;
        break;
      }
    } else if (e && f > e) {
      if (i())
        return;
      break;
    }
    if (d = y, it(l) && u === l) {
      p = !0;
      break;
    }
  }
  !p && a && d > a && i() || s.style.setProperty("width", `${d}px`, "important");
}, si = (s, t) => {
  const e = getProperty(Va, s);
  if (!e)
    return "";
  const { viewBox: a, paths: r, classes: i } = e;
  return t ?? (t = Object.keys(r).join("|")), typeof t == "string" && (t = t.split("|")), [
    `<svg viewBox="${a}">`,
    ...t.map((o) => `<path class="${o} ${(i == null ? void 0 : i[o]) ?? ""}" d="${r[o] ?? ""}" />`),
    "</svg>"
  ].join(`
`);
}, wa = (s, { x: t, y: e } = { x: 0, y: 0 }) => {
  [s, t, e] = [s, t, e].map((n) => dt(n, 2));
  const [a, r] = [0.4475 * s, (1 - 0.4475) * s], [i, o] = [t, e - s];
  return [[
    i,
    o,
    r,
    0,
    s,
    a,
    s,
    s,
    0,
    r,
    -a,
    s,
    -s,
    s,
    -r,
    0,
    -s,
    -a,
    -s,
    -s,
    0,
    -r,
    a,
    -s,
    s,
    -s
  ]];
}, ai = (s, t) => {
  const [[e, a, ...r]] = wa(s, t), i = [`m ${e} ${a}`];
  return r.forEach((o, n) => {
    n % 6 === 0 && i.push("c"), i.push(o);
  }), i.push("z"), i.join(" ");
}, Lt = (s, t, e, a) => {
  var r;
  return xt(s) && ([s, t, e, a] = s.replace(/[^\d.,]/g, "").split(/,/).map((i) => Ce(i) ? void 0 : parseFloat(i))), Mt(s) && ([4, 5].includes(s.length) && (s = s.replace(/([^#])/g, "$1$1")), [s, t, e, a] = ((r = s.match(/[^#]{2}/g)) == null ? void 0 : r.map((i) => parseInt(i, 16))) ?? []), [s, t, e].every((i) => /^\d+$/.test(`${i}`)) ? [s, t, e, a].filter((i) => /^[\d.]+$/.test(`${i}`)) : null;
}, ka = (s, t, e, a) => {
  if ((xt(s) || Mt(s)) && ([s, t, e, a] = Lt(s) ?? []), [s, t, e].every((r) => /^[.\d]+$/.test(`${r}`))) {
    let r = "rgb";
    const i = [s, t, e];
    return /^[.\d]+$/.test(`${a}`) && (i.push(a >= 1 ? pe(a) : ye(a, 2)), r += "a"), `${r}(${i.join(", ")})`;
  }
  return null;
}, ri = (s, t, e) => {
  function a(r) {
    const i = r.toString(16);
    return i.length === 1 ? `0${i}` : i;
  }
  return Mt(s) ? s : (xt(s) && ([s, t, e] = Lt(s) ?? []), ot(s) && ot(t) && ot(e) && [s, t, e].every((r) => /^[.\d]+$/.test(`${r}`)) ? `#${a(s ?? 0)}${a(t ?? 0)}${a(e ?? 0)}` : null);
}, ii = (...s) => {
  const [t, e, a] = Lt(...s) ?? [];
  return [t, e, a].every(Ot) ? (t * 299 + e * 587 + a * 114) / 1e3 >= 128 ? "rgba(0, 0, 0, 1)" : "rgba(255, 255, 255, 0.8)" : null;
}, oi = () => ka(
  Z.utils.random(0, 255, 1),
  Z.utils.random(0, 255, 1),
  Z.utils.random(0, 255, 1)
), ni = (s) => {
  const t = [];
  return s.parentNode && Array.from(s.parentNode.children).forEach((e) => {
    e !== s && t.push(e);
  }), t;
}, li = (s) => typeof s == "string" ? s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/[`']/g, "&#039;") : s, ci = (s, ...t) => {
  const e = performance.now();
  let a = 0;
  const r = () => {
    if (performance.now() - e < 1e4)
      i(), a++;
    else {
      const o = performance.now() - e, n = dt(o / a / 4e3, 4);
      eLog.checkLog3("performance", `[TestPerformance] Function Ran ${a} Times in ${dt(o / 1e3, 4)}s, Averaging ${n}s per Call`);
    }
  }, i = () => {
    const o = s(...t);
    o instanceof Promise ? o.then(r) : r();
  };
  i();
}, hi = (s, t) => Z.set(s, t);
function di(s, t, e) {
  if (e) {
    const a = We(Z.getProperty(s, t, e), /[\d.]+/);
    if (typeof a == "string")
      return ye(a);
    throw new Error(`Unable to extract property '${t}' in '${e}' units from ${s}`);
  }
  return Z.getProperty(s, t);
}
const gi = (s, t) => ia(dt(ha(s, t), 2)).replace(/^(.)/, "$1="), pi = (s, t) => {
  if (!s || !ga(s.labels))
    return;
  typeof t == "string" && (t = new RegExp(t));
  const e = Object.entries(s.labels).filter(([i]) => t instanceof RegExp ? t.test(i) : !0).sort((i, o) => i[1] - o[1]), a = Z.utils.snap(e.map(([i, o]) => o), s.time()), [r] = e.find(([i, o]) => o === a);
  return r;
}, mi = (s) => {
  if (s.repeat() === -1)
    s.totalTime(s.time());
  else {
    const [t] = s.getChildren(!1, !0, !0, s.time());
    t && t.repeat() === -1 && t.totalTime(t.time()), s.reverse();
  }
  return s;
}, fi = (s) => new Promise(
  (t) => {
    setTimeout(t, s >= 100 ? s : s * 1e3);
  }
);
function Ta(s) {
  return new Promise(
    (t, e) => {
      s instanceof Promise || s instanceof Z.core.Animation ? s.then(() => t()).catch(e) : Array.isArray(s) ? Promise.all(s.map((a) => Ta(a))).then(() => t()).catch(e) : t();
    }
  );
}
const yi = {
  onTextInputBlur: async (s, t) => {
    const e = t.target, { action: a, target: r, flagTarget: i } = e.dataset;
    if (!a)
      throw new Error("Input text elements require a data-action attribute.");
    if (!r && !i)
      throw new Error("Input text elements require a 'data-target' or 'data-flag-target' attribute.");
    r ? await s.document.update({ [r]: e.value }) : i && (e.value === "" ? await s.document.unsetFlag(v.SYSTEM_ID, i) : await s.document.setFlag(v.SYSTEM_ID, i, e.value));
  },
  onSelectChange: async (s, t) => {
    const e = t.currentTarget, { action: a, dtype: r, target: i, flagTarget: o } = e.dataset;
    if (!a)
      throw new Error("Select elements require a data-action attribute.");
    if (!i && !o)
      throw new Error("Select elements require a 'data-target' or 'data-flag-target' attribute.");
    const n = Oe(r);
    let l;
    switch (n) {
      case "number":
        l = ye(e.value);
        break;
      case "boolean":
        l = Oe(`${e.value}`) === "true";
        break;
      case "string":
        l = `${e.value}`;
        break;
      default: {
        if (Zs(l))
          throw new Error(`You must set 'data-dtype="Number"' for <select> elements with number values.`);
        if (Xs(l))
          throw new Error(`You must set 'data-dtype="Boolean"' for <select> elements with boolean values.`);
        l = `${e.value}`;
        break;
      }
    }
    i ? await s.document.update({ [i]: l }) : o && (e.value === "" ? await s.document.unsetFlag(v.SYSTEM_ID, o) : await s.document.setFlag(v.SYSTEM_ID, o, l));
  }
}, $t = (s) => typeof s == "string" && /^[A-Za-z0-9]{16}$/.test(s), Sa = (s) => {
  if (typeof s != "string")
    return !1;
  const [t, e] = s.split(/\./);
  return $t(e) ? game.collections.has(t) : !1;
}, ps = (s) => typeof s == "string", Ca = (s) => ps(s) ? !!(["name", "img", "id", "_id"].includes(s) || s.startsWith("system") || s.startsWith("flag")) : !1, bi = (s) => !(!ps(s) || Ca(s)), vi = (s) => {
  var t;
  if (Sa(s))
    return s;
  if ($t(s)) {
    const e = (t = game.collections.find((a) => a.has(s))) == null ? void 0 : t.get(s);
    if (e && "uuid" in e)
      return e.uuid;
    throw new Error(`[U.parseDocRefToUUID] Unable to find document with id '${s}'`);
  } else if (s && typeof s == "object" && "uuid" in s && typeof s.uuid == "string")
    return s.uuid;
  throw new Error(`[U.parseDocRefToUUID] Unrecognized reference: '${s}'`);
}, Ia = (s, t = {}) => {
  if (/[a-z]/.test(s) && (s = s.replace(new RegExp(`^(${v.SYSTEM_ID}.)*`), `${v.SYSTEM_ID}.`)), typeof game.i18n.localize(s) == "string") {
    for (const [e, a] of Object.entries(t))
      t[e] = Ia(a);
    return game.i18n.format(s, t) || game.i18n.localize(s) || s;
  }
  return s;
}, wi = (s) => {
  if (game.settings.settings.has(`${v.SYSTEM_ID}.${s}`))
    return game.settings.get(v.SYSTEM_ID, s);
};
function Aa(s, t) {
  return typeof t == "string" ? `${v.TEMPLATE_ROOT}/${s}/${t.replace(/\..*$/, "")}.hbs` : t.map((e) => Aa(s, e));
}
function ki(s, t = `systems/${v.SYSTEM_ID}/assets`, e = { top: 200, left: 200 }) {
  return new FilePicker({
    type: "image",
    activeSource: "public",
    displayMode: "tiles",
    callback: s,
    top: e.top ?? 240,
    left: e.left ?? 210
  }).browse(t);
}
const h = {
  // ████████ GETTERS: Basic Data Lookup & Retrieval ████████
  GMID: Za,
  getUID: kr,
  // ████████ TYPES: Type Checking, Validation, Conversion, Casting ████████
  isNumber: Ot,
  isNumString: Zs,
  isBooleanString: Xs,
  isSimpleObj: Js,
  isList: Pe,
  isArray: z,
  isFunc: Xa,
  isInt: it,
  isFloat: Qs,
  isPosInt: Yt,
  isIterable: Ja,
  isHTMLCode: Qa,
  isRGBColor: xt,
  isHexColor: Mt,
  isUndefined: Ce,
  isDefined: ot,
  isEmpty: ns,
  hasItems: ls,
  isInstance: er,
  isNullish: tr,
  areEqual: sr,
  areFuzzyEqual: sa,
  pFloat: ye,
  pInt: pe,
  pBool: ar,
  radToDeg: aa,
  degToRad: rr,
  getKey: ir,
  assertNonNullType: ta,
  FILTERS: or,
  // ████████ REGEXP: Regular Expressions, Replacing, Matching ████████
  testRegExp: Tt,
  regExtract: We,
  // ████████ STRINGS: String Parsing, Manipulation, Conversion ████████
  // ░░░░░░░ Case Conversion ░░░░░░░
  uCase: ra,
  lCase: Oe,
  sCase: cs,
  tCase: nr,
  // ░░░░░░░ Formatting ░░░░░░░
  /* hyphenate, */
  unhyphenate: lr,
  pluralize: hr,
  oxfordize: dr,
  ellipsize: ur,
  pad: gr,
  toKey: pr,
  parseArticles: cr,
  signNum: ia,
  padNum: mr,
  stringifyNum: hs,
  verbalizeNum: oa,
  ordinalizeNum: fr,
  romanizeNum: yr,
  // ░░░░░░░ Content ░░░░░░░
  loremIpsum: br,
  randString: vr,
  randWord: wr,
  // ████████ SEARCHING: Searching Various Data Types w/ Fuzzy Matching ████████
  fuzzyMatch: Tr,
  isIn: na,
  isInExact: Sr,
  // ████████ NUMBERS: Number Casting, Mathematics, Conversion ████████
  randNum: _t,
  randInt: ds,
  coinFlip: Cr,
  cycleNum: la,
  cycleAngle: us,
  roundNum: dt,
  clampNum: Ir,
  sum: ca,
  average: Ar,
  // ░░░░░░░ Positioning ░░░░░░░
  getDistance: Dr,
  getAngle: Er,
  getAngleDelta: ha,
  getBoundingRectangle: Pr,
  // ████████ ARRAYS: Array Manipulation ████████
  randElem: gs,
  randIndex: Or,
  makeIntRange: Mr,
  makeCycler: xr,
  unique: Lr,
  group: $r,
  sample: Rr,
  getLast: _r,
  removeFirst: Fr,
  pullElement: da,
  pullIndex: Nr,
  subGroup: Hr,
  shuffle: Br,
  toArray: Kr,
  // ████████ OBJECTS: Manipulation of Simple Key/Val Objects ████████
  remove: Wr,
  replace: Vr,
  partition: qr,
  zip: zr,
  objClean: Ut,
  objSize: ga,
  objMap: ua,
  objFindKey: Yr,
  objFilter: Ct,
  objForEach: Ur,
  objCompact: Zr,
  objClone: pa,
  objMerge: ma,
  objDiff: fa,
  objExpand: ya,
  objFlatten: ba,
  objNullify: Xr,
  objFreezeProps: Jr,
  // ████████ FUNCTIONS: Function Wrapping, Queuing, Manipulation ████████
  getDynamicFunc: Qr,
  withLog: ei,
  // ████████ HTML: Parsing HTML Code, Manipulating DOM Objects ████████
  getSvgCode: si,
  changeContainer: ti,
  adjustTextContainerAspectRatio: va,
  getRawCirclePath: wa,
  drawCirclePath: ai,
  getColorVals: Lt,
  getRGBString: ka,
  getHEXString: ri,
  getContrastingColor: ii,
  getRandomColor: oi,
  getSiblings: ni,
  escapeHTML: li,
  // ████████ PERFORMANCE: Performance Testing & Metrics ████████
  testFuncPerformance: ci,
  // ░░░░░░░ GreenSock ░░░░░░░
  gsap: Z,
  get: di,
  set: hi,
  getGSAngleDelta: gi,
  getNearestLabel: pi,
  reverseRepeatingTimeline: mi,
  /* to, from, fromTo, */
  TextPlugin: as,
  Flip: rs,
  MotionPathPlugin: mt,
  // ████████ ASYNC: Async Functions, Asynchronous Flow Control ████████
  sleep: fi,
  waitFor: Ta,
  // EVENT HANDLERS
  EventHandlers: yi,
  // ░░░░░░░ SYSTEM: System-Specific Functions (Requires Configuration of System ID in constants.js) ░░░░░░░
  isDocID: $t,
  isDocUUID: Sa,
  isDotKey: ps,
  isTargetKey: Ca,
  isTargetFlagKey: bi,
  parseDocRefToUUID: vi,
  loc: Ia,
  getSetting: wi,
  getTemplatePath: Aa,
  displayImageSelector: ki
}, Ti = function() {
  game.settings.register("eunos-blades", "debug", {
    name: "Debug Level",
    hint: "The verbosity of the debug messages to console.",
    scope: "client",
    // This specifies a world-level setting
    config: !0,
    // This specifies that the setting appears in the configuration view
    type: Number,
    range: {
      // If range is specified, the resulting setting will be a range slider
      min: 0,
      max: 5,
      step: 1
    },
    default: 3
    // The default value for the setting
  }), game.settings.register("eunos-blades", "debugHooks", {
    name: "Debug HOOKS",
    hint: "Whether all Hooks are logged to the console.",
    scope: "client",
    config: !0,
    type: Boolean,
    default: !1
  }), game.settings.register("eunos-blades", "openAPIModelLevel", {
    name: "AI Base Quality",
    hint: "Lower values are cheaper to run, at the cost of quality.",
    scope: "client",
    // This specifies a world-level setting
    config: !0,
    // This specifies that the setting appears in the configuration view
    type: Number,
    range: {
      // If range is specified, the resulting setting will be a range slider
      min: 0,
      max: 2,
      step: 1
    }
  }), game.settings.register("eunos-blades", "blacklist", {
    name: "Debug Blacklist",
    hint: "Comma-delimited list of categories of debug messages to silence.",
    scope: "client",
    // This specifies a world-level setting
    config: !0,
    // This specifies that the setting appears in the configuration view
    type: String,
    default: ""
    // The default value for the setting
  }), game.settings.register("eunos-blades", "openAPIKey", {
    name: "OpenAI API Key",
    hint: "Your personal OpenAI API Key (necessary to enable AI functionality)",
    scope: "client",
    // This specifies a world-level setting
    config: !0,
    // This specifies that the setting appears in the configuration view
    type: String,
    default: ""
    // The default value for the setting
  }), game.settings.register("eunos-blades", "whitelist", {
    name: "Debug Whitelist",
    hint: "Comma-delimited list of categories of debug messages to promote.",
    scope: "client",
    // This specifies a world-level setting
    config: !0,
    // This specifies that the setting appears in the configuration view
    type: String,
    default: ""
    // The default value for the setting
  }), game.settings.register("eunos-blades", "systemMigrationVersion", {
    name: "System Migration Version",
    scope: "world",
    config: !1,
    type: Number,
    default: 0
  });
};
function Si() {
  CONFIG.TinyMCE = {
    ...CONFIG.TinyMCE,
    skin: "skin",
    skin_url: "systems/eunos-blades/tinymce/skin",
    content_css: `systems/eunos-blades/tinymce/content.css?${(/* @__PURE__ */ new Date()).getTime()}`,
    font_css: "systems/eunos-blades/fonts.css",
    max_height: 500,
    min_height: 40,
    autoresize_overflow_padding: 0,
    autoresize_bottom_margin: 0,
    // 25,
    menubar: !1,
    statusbar: !1,
    // True,
    elementPath: !0,
    branding: !1,
    resize: !1,
    plugins: "lists image table code save autoresize searchreplace quickbars template",
    save_enablewhendirty: !1,
    // Table_default_styles: {},
    style_formats: [
      {
        title: "Headings",
        items: [
          { title: "Heading 1", block: "h1", wrapper: !1 },
          { title: "Heading 2", block: "h2", wrapper: !1 },
          { title: "Heading 3", block: "h3", wrapper: !1 },
          { title: "Heading 4", block: "h4", wrapper: !1 }
        ]
      },
      {
        title: "Blocks",
        items: [
          { title: "Paragraph", block: "p", wrapper: !1 },
          { title: "Block Quote", block: "blockquote", wrapper: !0 }
          // {title: "Secret", block: "span", classes: "text-secret", attributes: {"data-is-secret": "true"}, wrapper: false}
        ]
      },
      {
        title: "Inline",
        items: [
          { title: "Bold", inline: "b", wrapper: !1 },
          { title: "Italics", inline: "i", wrapper: !1 },
          { title: "Underline", inline: "u", wrapper: !1 },
          { title: "Secret", inline: "span", classes: "text-secret", attributes: { "data-is-secret": "true" }, wrapper: !1 }
        ]
      }
    ],
    style_formats_merge: !1,
    toolbar: "styles | searchreplace | formatting alignment lists elements | removeformat | code | save",
    toolbar_groups: {
      formatting: {
        icon: "color-picker",
        tooltip: "Formatting",
        items: "bold italic underline"
      },
      alignment: {
        icon: "align-left",
        tooltip: "Alignment",
        items: "alignleft aligncenter alignright alignjustify | outdent indent"
      },
      lists: {
        icon: "unordered-list",
        tooltip: "Lists",
        items: "bullist numlist"
      },
      elements: {
        icon: "duplicate",
        tooltip: "Insert Element",
        items: "tableinsertdialog image hr | template"
      }
    },
    toolbar_mode: "floating",
    quickbars_link_toolbar: !1,
    quickbars_selection_toolbar: "styles | bold italic underline",
    quickbars_insert_toolbar: "hr image table",
    quickbars_table_toolbar: "tableprops tabledelete | tableinsertrowbefore tableinsertrowafter tabledeleterow | tableinsertcolbefore tableinsertcolafter tabledeletecol"
  };
}
function Ci() {
  CONFIG.canvasTextStyle = new PIXI.TextStyle({
    align: "center",
    dropShadow: !0,
    dropShadowAngle: h.degToRad(45),
    dropShadowBlur: 8,
    dropShadowColor: v.Colors.BLACK,
    dropShadowDistance: 4,
    fill: [
      v.Colors.bWHITE,
      v.Colors.bGREY
    ],
    fillGradientType: 1,
    fillGradientStops: [
      0,
      0.3
    ],
    fontFamily: "Kirsty",
    fontSize: 32,
    letterSpacing: 2,
    lineHeight: 32,
    lineJoin: "round",
    padding: 4,
    stroke: v.Colors.dBLACK,
    strokeThickness: 3,
    trim: !0,
    whiteSpace: "normal",
    wordWrap: !0,
    wordWrapWidth: 0.1
  });
}
function Ii() {
  $("body.vtt.game.system-eunos-blades").append(`<div id="backsplash" style="height: 100%; width: 100%; position: absolute; z-index: -1; background: linear-gradient(35deg, ${v.Colors.GREY}, ${v.Colors.BLACK});"></div>`), $("#interface").append(`<div class="lightning-border-container">
    </div>`);
}
async function Ai() {
  const s = [
    // General Components
    "systems/eunos-blades/templates/components/toggle-icon.hbs",
    "systems/eunos-blades/templates/components/button-icon.hbs",
    "systems/eunos-blades/templates/components/dotline.hbs",
    "systems/eunos-blades/templates/components/armor.hbs",
    "systems/eunos-blades/templates/components/comp.hbs",
    "systems/eunos-blades/templates/components/select.hbs",
    "systems/eunos-blades/templates/components/portrait.hbs",
    "systems/eunos-blades/templates/components/clock.hbs",
    "systems/eunos-blades/templates/components/roll-collab-mod.hbs",
    "systems/eunos-blades/templates/components/slide-out-controls.hbs",
    "systems/eunos-blades/templates/components/consequence.hbs",
    "systems/eunos-blades/templates/components/consequence-accepted.hbs",
    // Partials
    "systems/eunos-blades/templates/parts/tier-block.hbs",
    "systems/eunos-blades/templates/parts/turf-list.hbs",
    "systems/eunos-blades/templates/parts/cohort-block.hbs",
    "systems/eunos-blades/templates/parts/roll-opposition-creator.hbs",
    "systems/eunos-blades/templates/parts/active-effects.hbs",
    "systems/eunos-blades/templates/parts/gm-pc-summary.hbs",
    "systems/eunos-blades/templates/components/clock-key.hbs"
  ];
  return loadTemplates(s);
}
const ke = {
  randString(s = 10) {
    return h.randString(s);
  },
  test(s, t, e) {
    const a = {
      true: !0,
      false: !1,
      null: null,
      undefined: void 0
    };
    switch (["!", "not", "=??"].includes(String(s)) && ([t, s] = [String(s), t]), typeof s == "string" && s in a && (s = a[s]), typeof e == "string" && e in a && (e = a[e]), t) {
      case "!":
      case "not":
        return !s;
      case "=??":
        return [void 0, null].includes(s);
      case "&&":
        return s && e;
      case "||":
        return s || e;
      case "==":
        return h.areFuzzyEqual(s, e);
      case "===":
        return s === e;
      case "!=":
      case "!==":
        return s !== e;
      case ">":
        return typeof s == "number" && typeof e == "number" && s > e;
      case "<":
        return typeof s == "number" && typeof e == "number" && s < e;
      case ">=":
        return typeof s == "number" && typeof e == "number" && s >= e;
      case "<=":
        return typeof s == "number" && typeof e == "number" && s <= e;
      case "??":
        return s ?? e;
      case "includes":
        return Array.isArray(s) && s.includes(e);
      case "in":
        return Array.isArray(e) ? e.includes(s) : h.isList(e) && (typeof s == "number" || typeof s == "string") ? s in e : typeof e == "string" ? new RegExp(String(s), "gu").test(String(e)) : !1;
      default:
        return !1;
    }
  },
  calc(...s) {
    const t = {
      "+": (i, o) => h.pInt(i) + h.pInt(o),
      "-": (i, o) => h.pInt(i) - h.pInt(o),
      "*": (i, o) => h.pInt(i) * h.pInt(o),
      "/": (i, o) => h.pInt(i) / h.pInt(o),
      "%": (i, o) => h.pInt(i) % h.pInt(o),
      max: (i, o) => Math.max(h.pInt(i), h.pInt(o)),
      min: (i, o) => Math.min(h.pInt(i), h.pInt(o)),
      ceil: (i) => Math.ceil(h.pFloat(i)),
      floor: (i) => Math.floor(h.pFloat(i))
    }, [e, a, r] = typeof s[0] == "string" && s[0] in t ? [s[1], s[0]] : s;
    return t[a](e, r);
  },
  isIn(...s) {
    const [t, ...e] = s;
    return e.includes(t);
  },
  case(s, t) {
    switch (s) {
      case "upper":
        return h.uCase(t);
      case "lower":
        return h.lCase(t);
      case "sentence":
        return h.sCase(t);
      case "title":
        return h.tCase(t);
      default:
        return t;
    }
  },
  romanize(s) {
    return h.romanizeNum(h.pInt(s));
  },
  count(s) {
    return Array.isArray(s) || h.isList(s) ? Object.values(s).filter((t) => t != null).length : typeof s == "string" ? s.length : s ? 1 : 0;
  },
  // Concat helper
  // Usage: (concat 'first 'second')
  concat(...s) {
    let t = "";
    for (const e of s)
      (typeof e == "string" || typeof e == "number") && (t += e);
    return t;
  },
  // Merge helper - To merge additional properties into a template's context
  merge(s, ...t) {
    return t.pop(), t.reduce((e, a) => Object.assign(e, a), s);
  },
  // For loop: {{#for [from = 0, to, stepSize = 1]}}<html content, this = index>{{/for}}
  for: (...s) => {
    const t = s.pop();
    let [e, a, r] = s;
    if (e = h.pInt(e), a = h.pInt(a), r = h.pInt(r) || 1, e > a)
      return "";
    let i = "";
    for (let o = parseInt(e || 0, 10); o <= parseInt(a || 0, 10); o += r)
      i += t.fn(o);
    return i;
  },
  signNum(s) {
    return h.signNum(s);
  },
  compileSvg(...s) {
    const [t, e] = s;
    return h.getSvgCode(t, e);
  },
  eLog(...s) {
    s.pop();
    let t = 3;
    [0, 1, 2, 3, 4, 5].includes(s[0]) && (t = s.shift()), eLog.hbsLog(...s, t);
  },
  // Does the name of this turf block represent a standard 'Turf' claim?
  isTurfBlock: (s) => h.fuzzyMatch(s, "Turf"),
  // Which other connection does this connector overlap with?
  getConnectorPartner: (s, t) => {
    s = parseInt(`${s}`, 10);
    const e = {
      1: { right: 2, bottom: 6 },
      2: { left: 1, right: 3, bottom: 7 },
      3: { left: 2, right: 4, bottom: 8 },
      4: { left: 3, right: 5, bottom: 9 },
      5: { left: 4, bottom: 10 },
      6: { top: 1, right: 7, bottom: 11 },
      7: { top: 2, left: 6, right: 8, bottom: 12 },
      8: { top: 3, left: 7, right: 9, bottom: 13 },
      9: { top: 4, left: 8, right: 10, bottom: 14 },
      10: { top: 5, left: 9, bottom: 15 },
      11: { top: 6, right: 12 },
      12: { top: 7, left: 11, right: 13 },
      13: { top: 8, left: 12, right: 14 },
      14: { top: 9, left: 13, right: 15 },
      15: { top: 10, left: 14 }
    }, a = { left: "right", right: "left", top: "bottom", bottom: "top" }[t], r = e[s][t] ?? 0;
    return r ? `${r}-${a}` : null;
  },
  // Is the value Turf side.
  isTurfOnEdge: (s, t) => {
    s = parseInt(`${s}`, 10);
    const e = {
      1: ["top", "left"],
      2: ["top"],
      3: ["top"],
      4: ["top"],
      5: ["top", "right"],
      6: ["left"],
      7: [],
      8: [],
      9: [],
      10: ["right"],
      11: ["left", "bottom"],
      12: ["bottom"],
      13: ["bottom"],
      14: ["bottom"],
      15: ["right", "bottom"]
    };
    return s in e ? e[s].includes(t) : !0;
  },
  // Multiboxes
  multiboxes(s, t) {
    let e = t.fn(this);
    return s = [s].flat(1), s.forEach((a) => {
      if (a !== !1) {
        const r = RegExp.escape(Handlebars.escapeExpression(String(a))), i = new RegExp(` value="${r}"`);
        e = e.replace(i, '$& checked="checked"');
      }
    }), e;
  },
  repturf: (s, t) => {
    let e = t.fn(void 0), a = parseInt(s, 10);
    a > 6 && (a = 6);
    for (let r = 13 - a; r <= 12; r++) {
      const i = new RegExp(` value="${r}"`);
      e = e.replace(i, '$& disabled="disabled"');
    }
    return e;
  }
};
ke.eLog1 = function(...s) {
  ke.eLog(1, ...s.slice(0, 7));
};
ke.eLog2 = function(...s) {
  ke.eLog(2, ...s.slice(0, 7));
};
ke.eLog3 = function(...s) {
  ke.eLog(3, ...s.slice(0, 7));
};
ke.eLog4 = function(...s) {
  ke.eLog(4, ...s.slice(0, 7));
};
ke.eLog5 = function(...s) {
  ke.eLog(5, ...s.slice(0, 7));
};
Object.assign(ke);
function Di() {
  Object.entries(ke).forEach(([s, t]) => Handlebars.registerHelper(s, t));
}
const As = [
  as,
  rs,
  mt,
  Pt,
  is,
  Ws,
  js,
  os,
  Gs,
  Vs
], Ei = {
  // #region CLOCK KEYS
  keyDrop: {
    effect: (s, t) => {
      const [e] = $(s).closest(".clock-key-container");
      return h.gsap.timeline({
        onComplete() {
          t.callback && t.callback();
        }
      }).fromTo(e, {
        y: t.yShift
      }, {
        y: 0,
        autoAlpha: 1,
        ease: "bounce",
        duration: t.duration
      });
    },
    defaults: {
      duration: 1,
      yShift: -800
    },
    extendTimeline: !0
  },
  keyPull: {
    effect: (s, t) => {
      const [e] = $(s).closest(".clock-key-container");
      return h.gsap.timeline({
        onComplete() {
          t.callback && t.callback();
        }
      }).to(e, {
        y: t.yDelta,
        ease: t.ease,
        duration: 0.75 * t.duration
      }).to(e, {
        opacity: 0,
        ease: "power2.out",
        duration: 0.25 * t.duration
      }, 0.75 * t.duration);
    },
    defaults: {
      yDelta: -800,
      duration: 1,
      ease: "back.in(1)"
    },
    extendTimeline: !0
  },
  keyControlPanelFlip: {
    effect: (s, t) => h.gsap.timeline({
      delay: t.delay,
      onStart() {
        if (s) {
          const a = $(s).next(".clock-control-flipper");
          a.length && h.gsap.effects.keyControlPanelFlip(a[0], {
            ...t,
            delay: 0.15
          });
        }
      }
    }).to(s, {
      rotateX: t.angle,
      duration: 0.5,
      ease: "back.inOut(2)"
    }),
    defaults: {
      angle: 180,
      delay: 0
    },
    extendTimeline: !0
  },
  // #endregion
  // #region CHAT CONSEQUENCE EFFECTS
  csqEnter: {
    effect: (s, t) => {
      const e = h.gsap.utils.selector(s), a = e(".consequence-icon-circle.base-consequence"), r = e(".consequence-type.base-consequence"), i = e(".consequence-type.accept-consequence"), o = e(".consequence-name.base-consequence"), n = e(".consequence-name.accept-consequence"), l = h.gsap.timeline({ paused: !0, defaults: {} });
      return i.length > 0 && l.set(i, { opacity: 0 }, 0), n.length > 0 && l.set(n, { opacity: 0 }, 0), r.length > 0 && l.fromTo(r, {
        opacity: 1
      }, {
        opacity: 0,
        duration: 0.25,
        ease: "sine"
      }, 0), i.length > 0 && l.fromTo(i, {
        opacity: 0
      }, {
        opacity: 1,
        duration: 0.25,
        ease: "sine"
      }, 0), o.length > 0 && l.fromTo(o, {
        opacity: 1
      }, {
        opacity: 0,
        duration: 0.25,
        ease: "sine"
      }, 0), n.length > 0 && l.fromTo(n, {
        opacity: 0
      }, {
        opacity: 1,
        duration: 0.25,
        ease: "sine"
      }, 0), s && l.fromTo(s, {
        filter: "brightness(1)"
      }, {
        filter: `brightness(${t.brightness})`,
        duration: t.duration / 3,
        ease: "none"
      }, 0), a.length > 0 && l.fromTo(a, {
        scale: 0.75,
        outlineColor: v.Colors.dBLACK,
        outlineWidth: 0
      }, {
        scale: 0.85,
        outlineColor: v.Colors.GREY,
        outlineWidth: 1,
        duration: 0.55,
        ease: "sine.out"
      }, 0), l;
    },
    defaults: {
      brightness: 1.5,
      duration: 0.5,
      scale: 1.5,
      stagger: 0.05,
      ease: "sine",
      easeStrength: 1.5
    }
  },
  csqClickIcon: {
    effect: (s, t) => {
      const e = $(s).closest(".comp.consequence-display-container"), a = h.gsap.utils.selector(e[0]), r = h.gsap.utils.selector(s), i = a(".consequence-bg-image"), o = a(".consequence-interaction-pad"), n = r(".consequence-icon-circle.base-consequence"), l = r(".consequence-icon-circle.accept-consequence"), c = r(".consequence-button-container"), d = h.gsap.timeline({
        paused: !0,
        onComplete: function() {
          $(o).css("pointerEvents", "auto");
        },
        onReverseComplete: function() {
          $(o).css("pointerEvents", "none");
        }
      });
      return i.length && d.fromTo(i, {
        xPercent: 110,
        yPercent: -50
      }, {
        xPercent: -60,
        yPercent: -50,
        duration: 0.5,
        ease: "back"
      }, 0), n.length > 0 && d.fromTo(n, {
        opacity: 1
      }, {
        opacity: 0,
        duration: 0.25,
        ease: "sine.out"
      }, 0), l.length > 0 && d.fromTo(l, {
        opacity: 0
      }, {
        opacity: 1,
        duration: 0.15,
        ease: "sine"
      }, 0).fromTo(l, {
        outlineWidth: 1,
        scale: 0.85
      }, {
        outlineWidth: 2,
        scale: 1,
        duration: 0.25,
        ease: "sine"
      }, 0.175), c.length > 0 && d.fromTo(c, {
        scale: t.scale,
        opacity: 0,
        filter: "blur(25px)"
      }, {
        scale: 1,
        opacity: 1,
        filter: "blur(0px)",
        stagger: t.stagger,
        duration: t.duration,
        ease: `${t.ease}.inOut(${t.easeStrength})`
      }, 0), d;
    },
    defaults: {
      duration: 0.5,
      scale: 1.5,
      stagger: 0.05,
      ease: "sine",
      easeStrength: 1.5
    }
  },
  csqEnterRight: {
    effect: (s) => {
      const t = h.gsap.utils.selector(s), e = t(".consequence-type-container .consequence-type.accept-consequence"), a = t(".consequence-type-container .consequence-type-bg.accept-consequence"), r = h.gsap.utils.selector(t(".consequence-button-container.consequence-accept-button-container")), i = r(".consequence-button-bg"), o = r(".button-icon i"), n = r(".consequence-button-label"), l = h.gsap.timeline({ paused: !0, defaults: {} });
      return e.length > 0 && l.fromTo(
        e,
        {
          color: v.Colors.RED
        },
        {
          color: v.Colors.WHITE,
          duration: 0.5,
          ease: "sine.inOut"
        },
        0
      ), a.length > 0 && l.fromTo(a, {
        x: 5,
        scaleX: 0,
        color: v.Colors.RED,
        skewX: 0
      }, {
        scaleX: 1,
        skewX: -45,
        color: v.Colors.RED,
        duration: 0.5,
        ease: "back.out"
      }, 0), i.length > 0 && l.fromTo(i, {
        scaleX: 0,
        color: v.Colors.RED,
        skewX: 0
      }, {
        x: 0,
        scaleX: 1,
        skewX: -45,
        color: v.Colors.RED,
        duration: 0.25,
        ease: "back.out"
      }, 0), o.length > 0 && l.fromTo(
        o,
        {
          color: v.Colors.GREY,
          opacity: 0.75,
          scale: 1
        },
        {
          color: v.Colors.dBLACK,
          scale: 1.25,
          opacity: 1,
          duration: 0.5,
          ease: "sine"
        },
        0
      ), n.length > 0 && l.fromTo(
        n,
        {
          color: v.Colors.GREY,
          fontWeight: 400,
          scale: 1
        },
        {
          color: v.Colors.dBLACK,
          fontWeight: 800,
          duration: 0.75,
          ease: "sine"
        },
        0
      ), l;
    },
    defaults: {}
  },
  csqEnterLeft: {
    effect: (s) => {
      const t = h.gsap.utils.selector(s), e = t(".consequence-type-container .consequence-type.accept-consequence"), a = t(".consequence-name-container .consequence-name.accept-consequence"), r = t(".consequence-icon-circle.accept-consequence"), i = t(".consequence-button-container.consequence-accept-button-container"), o = h.gsap.timeline({ paused: !0, defaults: {} });
      return e.length > 0 && o.to(
        e,
        {
          opacity: 0,
          duration: 0.15,
          ease: "sine.inOut"
        },
        0
      ), a.length > 0 && o.to(a, {
        opacity: 0,
        duration: 0.15,
        ease: "sine.inOut"
      }, 0), r.length > 0 && o.to(
        r,
        {
          opacity: 0,
          duration: 0.15,
          ease: "sine.inOut"
        },
        0
      ), i.length > 0 && o.fromTo(
        i,
        {
          opacity: 1
        },
        {
          opacity: 0,
          duration: 0.25,
          ease: "sine.inOut"
        },
        0
      ), o;
    },
    defaults: {}
  },
  csqEnterSubLeft: {
    effect: (s, t) => {
      const e = h.gsap.utils.selector(s), a = e(`.consequence-icon-circle.${t.type}-consequence`), r = e(`.consequence-type-container .consequence-type.${t.type}-consequence`), i = e(`.consequence-name.${t.type}-consequence`), o = e(`.consequence-footer-container .consequence-footer-bg.${t.type}-consequence`), n = e(`.consequence-footer-container .consequence-footer-message.${t.type}-consequence`), l = h.gsap.timeline({ paused: !0, defaults: {} });
      if (a.length > 0 && l.fromTo(a, {
        opacity: 0
      }, {
        opacity: 1,
        duration: 0.5,
        ease: "back.out"
      }, 0), r.length > 0 && l.fromTo(r, {
        opacity: 0
      }, {
        opacity: 1,
        duration: 0.5,
        ease: "back.out"
      }, 0), i.length > 0 && l.fromTo(i, {
        scaleX: 0
      }, {
        scaleX: 1,
        duration: 0.5,
        ease: "back.inOut"
      }, 0), o.length > 0 && l.fromTo(o, {
        scaleX: 0,
        skewX: 0,
        opacity: 1
      }, {
        scaleX: 1,
        skewX: -45,
        opacity: 1,
        duration: 0.5,
        ease: "back.inOut"
      }, 0), n.length > 0 && l.fromTo(n, {
        scaleX: 0,
        opacity: 1
      }, {
        scaleX: 1,
        opacity: 1,
        duration: 0.5,
        ease: "back.inOut"
      }, 0), e(`.consequence-button-container.consequence-${t.type}-button-container`).length > 0) {
        const c = h.gsap.utils.selector(e(`.consequence-button-container.consequence-${t.type}-button-container`)), d = c(".consequence-button-bg"), p = c(".button-icon i"), u = c(".consequence-button-label");
        d.length > 0 && l.fromTo(d, {
          scaleX: 0,
          skewX: 0,
          opacity: 1
        }, {
          scaleX: 1,
          skewX: -45,
          opacity: 1,
          duration: 0.5,
          ease: "back.inOut"
        }, 0), p.length > 0 && l.fromTo(
          p,
          {
            color: v.Colors.GREY,
            opacity: 0.75,
            scale: 1
          },
          {
            color: v.Colors.dBLACK,
            scale: 1.25,
            opacity: 1,
            duration: 0.5,
            ease: "sine"
          },
          0
        ), u.length > 0 && l.fromTo(
          u,
          {
            color: v.Colors.GREY,
            fontWeight: 400,
            scale: 1
          },
          {
            color: v.Colors.dBLACK,
            fontWeight: 800,
            duration: 0.75,
            ease: "sine"
          },
          0
        );
      }
      return l;
    },
    defaults: {}
  },
  // #endregion
  // #region CHARACTER SHEET EFFECTS
  fillCoins: {
    effect: (s, t) => h.gsap.to(
      s,
      {
        duration: t.duration / 2,
        scale: t.scale,
        filter: t.filter,
        ease: t.ease,
        stagger: {
          amount: 0.25,
          from: "start",
          repeat: 1,
          yoyo: !0
        }
      }
    ),
    defaults: {
      duration: 1,
      scale: 1,
      filter: "saturate(1) brightness(2)",
      ease: "power2.in"
    },
    extendTimeline: !0
  },
  // #endregion
  // #region GENERAL: 'blurRemove', 'hoverTooltip', 'textJitter'
  blurRemove: {
    effect: (s, t) => h.gsap.timeline({ stagger: t.stagger }).to(
      s,
      {
        skewX: t.skewX,
        duration: t.duration / 2,
        ease: "power4.out"
      }
    ).to(
      s,
      {
        x: t.x,
        marginBottom: t.ignoreMargin ? void 0 : function(e, a) {
          return h.get(a, "height") * -1;
        },
        marginRight: t.ignoreMargin ? void 0 : function(e, a) {
          return h.get(a, "width") * -1;
        },
        scale: t.scale,
        filter: `blur(${t.blur}px)`,
        duration: 3 / 4 * t.duration
      },
      t.duration / 4
    ).to(
      s,
      {
        autoAlpha: 0,
        duration: t.duration / 2,
        ease: "power3.in"
      },
      t.duration / 2
    ),
    defaults: {
      ignoreMargin: !1,
      skewX: -20,
      duration: 0.5,
      x: "+=300",
      scale: 1.5,
      blur: 10,
      stagger: 0
    },
    extendTimeline: !0
  },
  blurReveal: {
    effect: (s, t) => h.gsap.timeline().fromTo(
      s,
      {
        x: t.x,
        marginBottom: t.ignoreMargin ? void 0 : function(e, a) {
          return h.get(a, "height") * -1;
        },
        marginRight: t.ignoreMargin ? void 0 : function(e, a) {
          return h.get(a, "width") * -1;
        },
        scale: t.scale,
        filter: `blur(${t.blur}px)`
      },
      {
        x: 0,
        marginBottom: 0,
        marginRight: 0,
        scale: 1,
        filter: "blur(0px)",
        duration: 3 / 4 * t.duration
      },
      0
    ).fromTo(
      s,
      {
        autoAlpha: 0
      },
      {
        autoAlpha: 1,
        duration: t.duration / 2,
        ease: "power3.in"
      },
      0
    ).fromTo(
      s,
      {
        skewX: t.skewX
      },
      {
        skewX: 0,
        duration: t.duration / 2,
        ease: "power4.out"
      },
      t.duration / 2
    ),
    defaults: {
      ignoreMargin: !1,
      skewX: -20,
      duration: 0.5,
      x: "+=300",
      scale: 1.5,
      blur: 10
    },
    extendTimeline: !0
  },
  scaleUpReveal: {
    effect: (s, t) => h.gsap.timeline().fromTo(s, {
      autoAlpha: 0,
      scale: 0.5 * t.scale
    }, {
      autoAlpha: 1,
      scale: t.scale,
      duration: t.duration,
      ease: t.ease
    }),
    defaults: {
      scale: 1,
      duration: 0.5,
      ease: "power2"
    },
    extendTimeline: !0
  },
  scaleDownRemove: {
    effect: (s, t) => h.gsap.timeline().to(s, {
      autoAlpha: 0,
      scale: 0.5 * t.scale,
      duration: t.duration,
      ease: t.ease
    }),
    defaults: {
      scale: 1,
      duration: 0.5,
      ease: "power2"
    },
    extendTimeline: !0
  },
  blurRevealTooltip: {
    effect: (s, t) => {
      if (!s)
        throw new Error(`blurRevealTooltip effect: tooltip element is ${s === null ? "null" : typeof s}`);
      const e = $(s);
      return h.gsap.timeline({
        paused: !0,
        onReverseComplete: t.onReverseComplete
      }).fromTo(
        e,
        {
          filter: `blur(${t.blurStrength}px)`,
          autoAlpha: 0,
          xPercent: 50,
          yPercent: -200,
          scale: t.scale
        },
        {
          filter: "blur(0px)",
          autoAlpha: 1,
          xPercent: -50,
          yPercent: -100,
          scale: 1,
          ease: t.ease,
          duration: t.duration
        }
      );
    },
    defaults: {
      scale: 1.5,
      blurStrength: 15,
      ease: "back.out",
      duration: 0.25,
      onReverseComplete: void 0
    },
    extendTimeline: !0
  },
  textJitter: {
    effect: (s, t) => {
      const [e] = $(s);
      if (!e)
        throw new Error("textJitter effect: target not found");
      const a = new is(e, { type: "chars" });
      return h.gsap.timeline().to(e, {
        autoAlpha: 1,
        duration: t.duration,
        ease: "none"
      }).fromTo(a.chars, {
        y: -t.yAmp
      }, {
        y: t.yAmp,
        duration: t.duration,
        ease: "sine.inOut",
        stagger: {
          repeat: -1,
          yoyo: !0,
          from: "random",
          each: t.stagger
        }
      }, 0).fromTo(a.chars, {
        rotateZ: -t.rotateAmp
      }, {
        rotateZ: t.rotateAmp,
        duration: t.duration,
        ease: os.create("myWiggle", { wiggles: 10, type: "random" }),
        stagger: {
          repeat: -1,
          from: "random",
          yoyo: !0,
          each: t.stagger
        }
      }, 0);
    },
    defaults: {
      yAmp: 2,
      rotateAmp: 2,
      duration: 1,
      stagger: 0.05
    },
    extendTimeline: !0
  }
  // #endregion
};
function Pi() {
  As.length && (h.gsap.config({
    nullTargetWarn: !0
  }), h.gsap.registerPlugin(...As), Object.assign(
    globalThis,
    {
      TextPlugin: as,
      Flip: rs,
      MotionPathPlugin: mt,
      Dragger: Pt,
      SplitText: is,
      Observer: Ws,
      CustomEase: js,
      CustomWiggle: os,
      CustomBounce: Gs,
      EasePack: Vs
    }
  )), Object.entries(Ei).forEach(([s, t]) => {
    h.gsap.registerEffect(Object.assign(t, { name: s }));
  });
}
function Ue(s) {
  s.find(".tooltip-trigger").each((t, e) => {
    const a = $(e).find(".tooltip")[0] ?? $(e).next(".tooltip")[0];
    if (!a)
      return;
    const r = $(a), i = r.parent();
    i.css("position") !== "relative" && i.css("position") !== "absolute" && i.css("position", "relative"), r.css("position", "absolute");
    const o = `tooltip-${randomID()}`;
    r.attr("id", o), r.hasClass("tooltip-wide") && h.adjustTextContainerAspectRatio(a, 6), $(e).on({
      mouseenter: function() {
        game.eunoblades.Director.displayTooltip(a);
      },
      mouseleave: function() {
        game.eunoblades.Director.clearTooltip(o);
      }
    });
  });
}
const nt = h.gsap;
var At, Da, gt, Zt, Dt, Ea, Et, Pa;
const ht = class ht {
  constructor(t, e) {
    fe(this, Dt);
    fe(this, Et);
    w(this, "_id");
    w(this, "_targetID");
    w(this, "_targetKey");
    w(this, "_targetFlagKey");
    w(this, "_isScopingById", !0);
    w(this, "_initialSchema");
    w(this, "_target");
    w(this, "initPromise");
    w(this, "isInitPromiseResolved", !1);
    var n;
    let a, r;
    const i = this.constructor;
    if (i.IsValidData(t)) {
      ({ linkData: a } = i.PartitionSchemaData(t));
      const l = fromUuidSync(a.targetID);
      if (!l)
        throw new Error(`[new BladesTargetLink()] Unable to resolve target from uuid '${a.targetID}'`);
      "targetKey" in a ? r = getProperty(l, `${a.targetKey}.${a.id}`) : r = l.getFlag(v.SYSTEM_ID, `${a.targetFlagKey}.${a.id}`), this.isInitPromiseResolved = !0;
    } else {
      const l = Ke(n = ht, gt, Zt).call(n, t, e);
      let c;
      ({ linkData: a, partialSchema: c } = i.PartitionSchemaData(l)), r = i._ApplySchemaDefaults(c);
    }
    this._id = a.id, this._targetID = a.targetID, "targetKey" in a ? this._targetKey = a.targetKey : this._targetFlagKey = a.targetFlagKey;
    const o = fromUuidSync(this.targetID);
    if (!o)
      throw new Error(`[new BladesTargetLink()] Unable to resolve target from uuid '${this._targetID}'`);
    this._target = o, this._initialSchema = r;
  }
  // #region STATIC METHODS ~
  static get ValidTargetClasses() {
    return [
      I,
      k,
      Ne,
      User
    ];
  }
  static IsValidConfig(t) {
    return h.isSimpleObj(t) && (h.isDocID(t.target) || h.isDocUUID(t.target) || h.isDocID(t.targetID) || h.isDocUUID(t.targetID) || this.ValidTargetClasses.some((e) => t.target instanceof e)) && (h.isTargetKey(t.targetKey) || h.isTargetFlagKey(t.targetFlagKey)) && !(h.isTargetKey(t.targetKey) && h.isTargetFlagKey(t.targetFlagKey));
  }
  static IsValidData(t) {
    return h.isSimpleObj(t) && h.isDocID(t.id) && h.isDocUUID(t.targetID) && (h.isTargetKey(t.targetKey) || h.isTargetFlagKey(t.targetFlagKey)) && !(h.isTargetKey(t.targetKey) && h.isTargetFlagKey(t.targetFlagKey));
  }
  static BuildLinkConfig(t) {
    if ("target" in t) {
      if ("targetKey" in t)
        return {
          target: t.target,
          targetKey: t.targetKey,
          isScopingById: t.isScopingById
        };
      if ("targetFlagKey" in t)
        return {
          target: t.target,
          targetFlagKey: t.targetFlagKey,
          isScopingById: t.isScopingById
        };
      throw new Error("[BladesTargetLink.BuildConfig] Must provide a targetKey or targetFlagKey.");
    } else if ("targetID" in t) {
      if ("targetKey" in t)
        return {
          targetID: t.targetID,
          targetKey: t.targetKey,
          isScopingById: t.isScopingById
        };
      if ("targetFlagKey" in t)
        return {
          targetID: t.targetID,
          targetFlagKey: t.targetFlagKey,
          isScopingById: t.isScopingById
        };
      throw new Error("[BladesTargetLink.BuildConfig] Must provide a targetKey or targetFlagKey.");
    }
    throw new Error("[BladesTargetLink.BuildConfig] Must provide a target or targetID.");
  }
  /**
   * This static method parses the provided data into a format suitable for BladesTargetLink.
   * Subclasses can override this method to include their own parse logic.
   * If the provided data is already valid, it is returned as is.
   * Otherwise, the data is passed to the private #ParseConfig method for further processing.
   * Note: The 'id' property is defined at the return step, within #ParseConfig: Subclass
   * functionality that depends on the id property should be placed after the super call to this method.
   *
   * @template Schema - The data schema required by the subclass.
   * @param {(BladesTargetLink.Config | BladesTargetLink.Data) & Partial<Schema>} data - The data to be parsed.
   * @returns {BladesTargetLink.Data & Partial<Schema>} - The parsed data, suitable for BladesTargetLink.
   */
  static ParseConfigToData(t, e) {
    return this.IsValidData(t) ? Ke(this, At, Da).call(this, t, e) : Ke(this, gt, Zt).call(this, t, e);
  }
  static PartitionSchemaData(t) {
    const {
      id: e,
      target: a,
      targetID: r,
      targetKey: i,
      targetFlagKey: o,
      isScopingById: n,
      ...l
    } = t, c = l;
    if (h.isDocID(e)) {
      if (!this.IsValidData({ id: e, targetID: r, targetKey: i, targetFlagKey: o, isScopingById: n }))
        throw eLog.error("BladesTargetLink", "Bad Constructor DATA", { dataOrConfig: t }), new Error("[new BladesTargetLink()] Bad Constructor DATA (see log)");
      let d;
      if (i)
        d = { id: e, targetID: r, targetKey: i, isScopingById: n ?? !0 };
      else if (o)
        d = { id: e, targetID: r, targetFlagKey: o, isScopingById: n ?? !0 };
      else
        throw eLog.error("BladesTargetLink", "Bad Constructor DATA", { dataOrConfig: t }), new Error("[BladesTargetLink.PartitionSchemaData] Bad Constructor DATA (see log)");
      return {
        linkData: d,
        partialSchema: c
      };
    }
    return {
      linkConfig: this.BuildLinkConfig({
        isScopingById: n ?? !0,
        ..."targetID" in t ? { targetID: t.targetID } : { target: t.target },
        ..."targetKey" in t ? { targetKey: t.targetKey } : { targetFlagKey: t.targetFlagKey }
      }),
      partialSchema: c
    };
  }
  static _ApplySchemaDefaults(t) {
    return this.ApplySchemaDefaults(t);
  }
  /**
  * This static method applies defaults to any values missing from the class' data Schema.
  * 'Schema' is defined by subclasses to BladesTargetLink.
  * Subclasses must override this method to apply their own defaults.
  *
  * @template Schema - The data schema required by the subclass.
  * @param {Partial<Schema>} schemaData - Schema data overriding the defaults.
  * @returns {Schema} - The schema data with defaults applied.
  * @throws {Error} - Throws an error if this method is not overridden in a subclass.
  */
  static ApplySchemaDefaults(t) {
    throw new Error("[BladesTargetLink.ApplySchemaDefaults] Static Method ApplySchemaDefaults must be overridden in subclass");
  }
  /**
   * Creates a new instance of BladesTargetLink and initializes it with the provided configuration.
   * The configuration is parsed into a data object which is then used to initialize the target link.
   * The function logs the parsed data for debugging purposes.
   *
   * @template Schema - The schema type parameter that extends the data structure.
   * @param {BladesTargetLink.Config & Partial<Schema>} config - The configuration object containing both the target link configuration and the schema configuration.
   *
   * @returns {Promise<BladesTargetLink<Schema> & BladesTargetLink.Subclass<Schema>>} - A promise that resolves to a new instance of BladesTargetLink, initialized with the provided data.
   *
   * @throws {Error} - Throws an error if the initialization of the target link fails.
   */
  static async Create(t, e) {
    const a = new this(t, e);
    return await a.initTargetLink(), a;
  }
  // #endregion
  // #region GETTERS ~
  get isGM() {
    return game.user.isGM;
  }
  get id() {
    return this._id;
  }
  get targetID() {
    return this._targetID;
  }
  get targetKey() {
    return this._targetKey;
  }
  get targetFlagKey() {
    return this._targetFlagKey;
  }
  get isScopingById() {
    return this._isScopingById;
  }
  get initialSchema() {
    return this._initialSchema;
  }
  get targetKeyPrefix() {
    if (this.targetKey)
      return this.isScopingById ? this.targetKey ? `${this.targetKey}.${this.id}` : void 0 : this.targetKey;
  }
  get targetKeyNullPrefix() {
    if (this.targetKey) {
      if (this.isScopingById)
        return `${this.targetKey}.-=${this.id}`;
      if (/^.+\..+$/g.test(this.targetKey))
        return this.targetKey.replace(/\.([^.]+)$/, ".-=$1");
      throw new Error(`[BladesTargetLink.targetKeyNullPrefix] Can't Nullify TargetKey '${this.targetKey}'`);
    }
  }
  get targetFlagKeyPrefix() {
    if (this.targetFlagKey)
      return this.isScopingById ? this.targetFlagKey ? `${this.targetFlagKey}.${this.id}` : void 0 : this.targetFlagKey;
  }
  get isLinkInitialized() {
    return this.isInitPromiseResolved;
  }
  get linkData() {
    if (this.targetKey)
      return {
        id: this.id,
        targetID: this.targetID,
        targetKey: this.targetKey,
        isScopingById: this.isScopingById
      };
    if (this.targetFlagKey)
      return {
        id: this.id,
        targetID: this.targetID,
        targetFlagKey: this.targetFlagKey,
        isScopingById: this.isScopingById
      };
    throw new Error(`[BladesTargetLink.linkData] Missing targetKey and targetFlagKey for '${this.id}'`);
  }
  get target() {
    return this._target;
  }
  get localData() {
    return {
      ...this.initialSchema,
      ...this.linkData
    };
  }
  get data() {
    if (this.isLinkInitialized) {
      let t;
      if (this.targetFlagKeyPrefix ? t = this.target.getFlag(v.SYSTEM_ID, this.targetFlagKeyPrefix) : this.targetKeyPrefix && (t = getProperty(this.target, this.targetKeyPrefix)), !t)
        throw new Error("[BladesTargetLink.data] Error retrieving data.");
      return t;
    } else
      return eLog.warn("BladesTargetLink", "Attempt to access data of uninitiated BladesTargetLink: Returning local data only.", { bladesTargetLink: this, localData: this.localData }), this.localData;
  }
  // #endregion
  // #region ASYNC UPDATE & DELETE METHODS ~
  getDotKeyToProp(t, e = !1) {
    if (this.targetKeyPrefix)
      return t === void 0 ? e ? this.targetKeyNullPrefix : this.targetKeyPrefix : `${this.targetKeyPrefix}.${e ? "-=" : ""}${t}`;
    if (this.targetFlagKeyPrefix)
      return t === void 0 ? this.targetFlagKeyPrefix : `${this.targetFlagKeyPrefix}.${t}`;
    throw new Error("[BladesTargetLink.getDotKeyToProp()] Missing 'targetKeyPrefix' and 'targetFlagKeyPrefix'");
  }
  getFlagParamsToProp(t) {
    return [v.SYSTEM_ID, this.getDotKeyToProp(t)];
  }
  async updateTargetFlag(t, e) {
    this.targetFlagKeyPrefix && (e === null ? await this.target.unsetFlag(...this.getFlagParamsToProp(t)) : this.target instanceof I ? await this.target.setFlag(...this.getFlagParamsToProp(t), e) : this.target instanceof k ? await this.target.setFlag(...this.getFlagParamsToProp(t), e) : this.target instanceof User ? await this.target.setFlag(...this.getFlagParamsToProp(t), e) : this.target instanceof Ne && await this.target.setFlag(...this.getFlagParamsToProp(t), e));
  }
  async updateTargetKey(t, e) {
    this.targetKeyPrefix && await this.target.update({ [this.getDotKeyToProp(t, e === null)]: e }, { render: !1 });
  }
  /**
   * Initializes a target link by updating the target's data with the provided data object.
   * If a targetKey is provided, the data is updated directly on the target.
   * If a targetFlagKey is provided, the data is set as a flag on the target.
   *
   * This method need only be run once, when the document is first created and its data must be written to server storage.
   * External functions can synchronously check the status of initialization via the isInitPromiseResolved property, while
   * asynchronous functions can await the initPromise property.
   *
   * TargetLink documents whose data already exists in server storage can be constructed directly (i.e. new BladesTargetLink(data))
   * without needing to call this method.
   *
   * @param {BladesTargetLink.Data & Schema} data - The combined data object containing both the target link data and the schema data.
   * @returns {Promise<void>} - A promise that resolves when the server update is complete.
   */
  async initTargetLink() {
    this.isInitPromiseResolved = !1;
    const t = {
      ...this.linkData,
      ...this.initialSchema
    };
    return this.initPromise = new Promise((e, a) => {
      if (this.targetKeyPrefix) {
        const r = mergeObject(
          getProperty(this.target, this.targetKeyPrefix) ?? {},
          t
        );
        this.target.update({ [this.targetKeyPrefix]: r }, { render: !1 }).then(() => {
          this.isInitPromiseResolved = !0, e();
        }).catch(a);
      } else if (this.targetFlagKeyPrefix) {
        const r = mergeObject(
          this.target.getFlag(v.SYSTEM_ID, this.targetFlagKeyPrefix) ?? {},
          t
        );
        this.target.setFlag(v.SYSTEM_ID, this.targetFlagKeyPrefix, r).then(() => {
          this.isInitPromiseResolved = !0, e();
        }).catch(a);
      } else
        a();
    }), this.initPromise;
  }
  async updateTarget(t, e, a) {
    if (typeof t == "string")
      return getProperty(this.data, t) === e ? void 0 : Ke(this, Et, Pa).call(this, t, e, a);
    if (typeof t == "object")
      return Ke(this, Dt, Ea).call(this, t, e);
    throw new Error(`[BladesTargetLink.updateTarget()] Bad updateData for id '${this.id}': ${t}`);
  }
  async updateTargetData(t, e) {
    t && (t = {
      ...t,
      ...this.linkData
    }), await h.waitFor([this.initPromise, e]), this.targetFlagKeyPrefix ? await this.updateTargetFlag(void 0, t) : await this.updateTargetKey(void 0, t);
  }
  async delete(t, e) {
    t && t.delete(this.id), await h.waitFor([this.initPromise, e]), await this.updateTargetData(null);
  }
  // #endregion
};
At = new WeakSet(), Da = function(t, e) {
  if (!e)
    return t;
  const a = "targetKey" in e ? [e.targetKey] : [e.targetFlagKey];
  e.isScopingById && a.push(e.id);
  const r = a.join(".");
  if ("targetKey" in t && "targetKey" in e)
    t.targetKey.startsWith(`${r}.`) && (t.targetKey = t.targetKey.slice(r.length + 1)), t.targetKey = [
      e.targetKey,
      e.isScopingById ? e.id : void 0,
      t.targetKey
    ].filter(Boolean).join(".");
  else if ("targetFlagKey" in t && "targetFlagKey" in e)
    t.targetFlagKey.startsWith(`${r}.`) && (t.targetFlagKey = t.targetFlagKey.slice(r.length + 1)), t.targetFlagKey = [
      e.targetFlagKey,
      e.isScopingById ? e.id : void 0,
      t.targetFlagKey
    ].filter(Boolean).join(".");
  else
    throw new Error("[BladesTargetLink.ParseChildLinkData] targetKey/targetFlagKey mismatch between provided partialConfig and parentLinkData.");
  return t;
}, gt = new WeakSet(), Zt = function(t, e) {
  if (this.IsValidData(t))
    return this.ParseConfigToData(t, e);
  const { linkConfig: a, partialSchema: r } = this.PartitionSchemaData(t), i = this.BuildLinkConfig(a);
  return "targetKey" in i ? this.ParseConfigToData({
    id: randomID(),
    ...r,
    targetID: h.parseDocRefToUUID("target" in i ? i.target : i.targetID),
    targetKey: i.targetKey
  }, e) : this.ParseConfigToData({
    id: randomID(),
    ...r,
    targetID: h.parseDocRefToUUID("target" in i ? i.target : i.targetID),
    targetFlagKey: i.targetFlagKey
  }, e);
}, Dt = new WeakSet(), Ea = async function(t, e) {
  if (await h.waitFor(e), this.targetKeyPrefix)
    return t = h.objMap(t, !1, (a) => `${this.targetKeyPrefix || this.targetFlagKeyPrefix}.${a}`), this.target.update(t, { render: !1 });
  if (this.targetFlagKeyPrefix) {
    const a = this.target.getFlag(v.SYSTEM_ID, this.targetFlagKeyPrefix) ?? {}, r = flattenObject(a), i = mergeObject(r, t);
    return this.target.setFlag(v.SYSTEM_ID, this.targetFlagKeyPrefix, i);
  } else
    throw new Error(`[BladesTargetLink.#updateTargetViaMerge] Unable to update target data for BladesTargetLink id '${this.id}': Missing both 'targetKeyPrefix' and 'targetFlagKeyPrefix'`);
}, Et = new WeakSet(), Pa = async function(t, e, a) {
  if (await h.waitFor(a), this.targetKeyPrefix)
    return this.target.update({ [`${this.targetKeyPrefix}.${t}`]: e });
  if (this.targetFlagKeyPrefix)
    return this.updateTargetFlag(t, e);
}, fe(ht, At), /**
 * This private static method is used to transform a configuration object into a data object for BladesTargetLink.
 * It checks if the provided configuration object is already valid data, and if so, returns it directly.
 * Otherwise, it partitions the configuration object into link-specific configuration and additional schema data,
 * constructs a full link configuration, and then creates a data object with a new random ID and the target UUID.
 * The method ensures that either 'targetKey' or 'targetFlagKey' is present and throws an error if the configuration is invalid.
 *
 * @template Schema - The additional schema data required by the subclass.
 * @param {BladesTargetLink.Config | BladesTargetLink.Data & Partial<Schema>} config - The configuration object that may contain BladesTargetLink properties and any subclass-specific schema data.
 * @returns {BladesTargetLink.Data & Partial<Schema>} - The fully constructed data object with necessary properties for BladesTargetLink.
 * @throws {Error} - Throws an error if the configuration object is invalid, lacks a target reference, or if both 'targetKey' and 'targetFlagKey' are provided.
 */
fe(ht, gt);
let we = ht;
function Oi(s) {
  return h.isList(s) && typeof s.x == "number" && typeof s.y == "number" && typeof s.width == "number" && typeof s.height == "number";
}
class le extends we {
  constructor(e) {
    super(e);
    w(this, "positionDragger");
    game.eunoblades.ClockKeys.set(this.id, this), Object.values(e.clocksData ?? {}).forEach((a) => new K(a));
  }
  // #region STATIC METHODS ~
  static Initialize() {
    function e(a) {
      "clocksData" in a.system && Object.values(a.system.clocksData ?? {}).forEach((r) => {
        try {
          new le(r);
        } catch (i) {
          eLog.error("BladesClockKey", "[BladesClockKey.Initialize] Error initializing clock key.", i, r);
        }
      });
    }
    return game.items.contents.filter(
      (a) => k.IsType(
        a,
        g.clock_keeper,
        g.project,
        g.cohort_gang,
        g.cohort_expert,
        g.ritual,
        g.design,
        g.location,
        g.score
      )
    ).forEach(e), game.actors.contents.filter(
      (a) => I.IsType(
        a,
        b.pc,
        b.faction
      )
    ).forEach(e), loadTemplates([
      "systems/eunos-blades/templates/components/clock-key.hbs",
      "systems/eunos-blades/templates/components/clock.hbs"
    ]);
  }
  static ApplySchemaDefaults(e) {
    return {
      name: "",
      isVisible: !1,
      isNameVisible: !1,
      isSpotlit: !1,
      clocksData: {},
      sceneIDs: [],
      displayMode: ne.full,
      oneKeyIndex: h.gsap.utils.random(0, 4, 1),
      ...e
    };
  }
  static async Create(e, a, r = []) {
    r.length > 6 ? (eLog.error("BladesClockKey", "[BladesClockKey.Create] Too many clock configs! (Max 6.) Eliminating extras.", r), r = r.slice(0, 6)) : r.length === 0 && r.push({});
    const i = new we(e);
    if (i.targetKeyPrefix)
      e.clocksData = Object.fromEntries(
        r.map((l, c) => {
          const d = K.ParseConfigToData({
            ...K.ApplySchemaDefaults(l),
            index: c,
            targetID: i.targetID,
            targetKey: `${i.targetKeyPrefix}.clocksData`,
            isScopingById: !0
          });
          return [
            d.id,
            d
          ];
        })
      );
    else if (i.targetFlagKeyPrefix)
      e.clocksData = Object.fromEntries(
        r.map((l, c) => {
          const d = K.ParseConfigToData({
            ...K.ApplySchemaDefaults(l),
            targetID: i.targetID,
            targetFlagKey: `${i.targetFlagKeyPrefix}.clocksData`,
            isScopingById: !0
          });
          return [
            d.id,
            d
          ];
        })
      );
    else
      throw new Error("BladesClockKey.Create: No targetKey or targetFlagKey provided.");
    const o = await super.Create(i.data), n = new le(o.data);
    return n.renderTargetAndKeeper(), n;
  }
  static GetFromElement(e) {
    const a = $(e).closest(".clock-key-container").find(".clock-key");
    if (a.length === 0)
      return;
    const r = a.attr("id");
    if (r)
      return game.eunoblades.ClockKeys.get(r);
  }
  // #endregion
  // #region GETTERS & SETTERS ~
  // #region -- Shortcut Schema Getters ~
  get data() {
    return this.linkData;
  }
  get name() {
    return this.data.name;
  }
  set name(e) {
    this.updateTarget("name", e).then(() => {
      this.renderTargetAndKeeper();
    });
  }
  get isVisible() {
    return this.data.isVisible;
  }
  set isVisible(e) {
    this.updateTarget("isVisible", h.pBool(e)).then(() => {
      this.renderTargetAndKeeper();
    });
  }
  get isNameVisible() {
    return this.data.isNameVisible;
  }
  set isNameVisible(e) {
    this.updateTarget("isNameVisible", h.pBool(e)).then(() => {
      this.renderTargetAndKeeper();
    });
  }
  get isSpotlit() {
    return this.data.isSpotlit;
  }
  set isSpotlit(e) {
    this.updateTarget("isSpotlit", e).then(() => {
      this.renderTargetAndKeeper();
    });
  }
  get clocksData() {
    return this.data.clocksData;
  }
  get displayMode() {
    return this.data.displayMode;
  }
  get oneKeyIndex() {
    let { oneKeyIndex: e } = this.data;
    return e || (e = h.gsap.utils.random(0, 4, 1), this.updateTarget("oneKeyIndex", e).then(() => {
      this.renderTargetAndKeeper();
    })), e;
  }
  get sceneIDs() {
    return this.data.sceneIDs ?? [];
  }
  get overlayPosition() {
    var e;
    return (e = this.data.overlayPosition) == null ? void 0 : e[game.scenes.current.id];
  }
  set overlayPosition(e) {
    e ? this.updateTarget(`overlayPosition.${game.scenes.current.id}`, e).then(() => {
      this.renderTargetAndKeeper();
    }) : this.updateTarget(`overlayPosition.-=${game.scenes.current.id}`, null).then(() => {
      this.renderTargetAndKeeper();
    });
  }
  // #endregion
  get clocks() {
    return new Collection(
      Object.entries(this.clocksData).sort((e, a) => e[1].index - a[1].index).map(([e, a]) => [e, new K(a)])
    );
  }
  getClockByID(e) {
    return this.clocks.get(e);
  }
  getClockByIndex(e) {
    return this.clocks.find((a) => a.index === e);
  }
  get size() {
    return this.clocks.size;
  }
  get isComplete() {
    return Array.from(this.clocks).every((e) => e.isComplete);
  }
  get isClockKeeperKey() {
    return this.target instanceof Rt;
  }
  get isFactionKey() {
    return this.target instanceof et;
  }
  get isProjectKey() {
    return this.target instanceof ft;
  }
  get isScoreKey() {
    return this.target instanceof yt;
  }
  get visibleClocks() {
    return this.clocks.filter((e) => e.isVisible);
  }
  get activeClocks() {
    return this.visibleClocks.filter((e) => e.isActive);
  }
  get inProgressClocks() {
    return this.visibleClocks.filter((e) => !e.isComplete && e.value > 0);
  }
  get unstartedClocks() {
    return this.visibleClocks.filter((e) => e.value === 0);
  }
  get completedClocks() {
    return this.visibleClocks.filter((e) => e.isComplete);
  }
  get currentClock() {
    return this.activeClocks.length > 0 ? this.getEarliestClock(this.activeClocks) : this.completedClocks.length > 0 ? this.getLatestClock(this.completedClocks) : this.visibleClocks.length > 0 ? this.getEarliestClock(this.visibleClocks) : this.getEarliestClock(Array.from(this.clocks));
  }
  get fullDisplayPosData() {
    const e = this.svgData.width / 2, a = this.svgData.height / 2;
    return {
      x: e,
      y: a,
      width: this.svgData.width,
      height: this.svgData.height
    };
  }
  get clocksDisplayPosData() {
    return this.getClocksBoundingBox(Array.from(this.clocks));
  }
  get visibleClocksDisplayPosData() {
    return this.getClocksBoundingBox(this.visibleClocks);
  }
  get activeClocksDisplayPosData() {
    return this.getClocksBoundingBox(this.activeClocks);
  }
  getClocksBoundingBox(e) {
    const { size: a, ...r } = this.svgData.clocks, i = Object.fromEntries(
      Object.entries(r).filter(([u]) => e.map((f) => f.index).includes(h.pInt(u))).map(([u, f]) => [h.pInt(u), f])
    ), o = Object.values(i).sort((u, f) => u.x - f.x), n = Object.values(i).sort((u, f) => u.y - f.y), l = o[0].x, c = o[o.length - 1].x, d = n[0].y, p = n[n.length - 1].y;
    return {
      // Determine the center point in both x and y axes
      x: (l + c) / 2,
      y: (d + p) / 2,
      // Determine height and width of bounding box, accounting for clock size
      width: c - l + a,
      height: p - d + a
    };
  }
  /** This function accepts any number of arrays of BladesClock, then returns an array
   * containing those BladesClock instances that appear in ALL provided arrays.
   */
  getClocksIn(...e) {
    return e.length === 0 ? [] : e.reduce((a, r) => a.filter((i) => r.includes(i)));
  }
  /** This function accepts an array of BladesClock, and returns the BladesClock
   * instance with the lowest index property.
   */
  getEarliestClock(e) {
    if (e.length)
      return e.sort((a, r) => a.index - r.index)[0];
  }
  /** This function accepts an array of BladesClock, and returns the BladesClock
   * instance with the highest index property.
   */
  getLatestClock(e) {
    if (e.length)
      return e.sort((a, r) => r.index - a.index)[0];
  }
  isInScene(e = game.scenes.current.id) {
    return this.sceneIDs.includes(e);
  }
  get isInCurrentScene() {
    return this.isInScene(game.scenes.current.id);
  }
  get displaySelectOptions() {
    const e = [
      { value: ne.full, display: "Full Key" },
      { value: ne.clocks, display: "Clocks" },
      { value: ne.activeClocks, display: "Active Clocks" }
    ];
    for (let a = 0; a < this.size; a++)
      e.push({ value: a, display: `Clock #${a}` }, { value: `present${a}`, display: `Present Clock #${a}` });
    return e;
  }
  // parseClockConfig(config: BladesClock.Config, indexOverride?: ClockIndex): BladesClock.Data {
  //   if (this.size === 6) {throw new Error("Cannot add a clock to a clock key with 6 clocks.");}
  //   if (indexOverride !== undefined && indexOverride < 0) {throw new Error("Cannot add a clock with a negative index.");}
  //   // Remove target so it doesn't conflict with key's targetID
  //   // delete config.target;
  //   const {target, targetID, targetKey, targetFlagKey, ...partialSchema} = config;
  //   const linkData: BladesTargetLink.LinkData = this.targetKey
  //     ? {
  //       targetID: this.targetID,
  //       targetKey: `${this.targetKeyPrefix}.clocksData` as TargetKey
  //     }
  //     : {
  //       targetID: this.targetID,
  //       targetFlagKey: `${this.targetFlagKeyPrefix}.clocksData` as TargetFlagKey
  //     };
  //   // Derive clock's targetID and targetKey/targetFlagKey from key's values
  //   data.targetID = this.targetID;
  //   if (this.targetKey) {
  //     data.targetKey = `${this.targetKeyPrefix}.clocksData` as TargetKey;
  //   } else if (this.targetFlagKey) {
  //     data.targetFlagKey = `${this.targetFlagKeyPrefix}.clocksData` as TargetFlagKey;
  //   }
  //   // Assign 'parentKeyID' and 'index'
  //   config.parentKeyID = this.id;
  //   config.index = indexOverride ?? this.size;
  //   // Parse config to full data object
  //   return BladesClock.ApplySchemaDefaults(
  //     BladesClock.ParseConfigToData(config as BladesClock.Config)
  //   );
  // }
  // #endregion
  // #region HTML INTERACTION ~
  // #region Get Elements$ ~
  getElemFromDisplayContext(e) {
    let a;
    const r = $(".vtt.game.system-eunos-blades");
    switch (e) {
      case W.overlay: {
        a = r.find(`#blades-overlay #${this.id}`);
        break;
      }
      case W.pcSheet: {
        a = r.find(`.actor.sheet .pc #${this.id}`);
        break;
      }
      case W.factionSheet: {
        a = r.find(`.actor.sheet .faction #${this.id}`);
        break;
      }
      case W.projectSheet: {
        a = r.find(`.item.sheet .project #${this.id}`);
        break;
      }
      case W.scoreSheet: {
        a = r.find(`.item.sheet .score #${this.id}`);
        break;
      }
      case W.rollCollab: {
        a = r.find(`.roll-collab-sheet #${this.id}`);
        break;
      }
      case W.chatMessage: {
        a = r.find(`#chat #${this.id}`);
        break;
      }
    }
    if (!a.length)
      throw new Error(`[BladesClockKey.getElemFromDisplayContext] Error elem$ not found for key '${this.id}' for display context '${e}'.`);
    return a;
  }
  getElements$(e) {
    let a;
    if (typeof e == "string" && (e = this.getElemFromDisplayContext(e)), a = $(e).find(`#${this.id}`), a.length || (a = $(e).closest(`#${this.id}`)), !(a != null && a.length))
      throw new Error(`[BladesClockKey.getElements$] Cannot find elements for display context '${e}' of clockKey '${this.id}'.`);
    const r = {
      elem$: a
    };
    if (!a.length)
      throw new Error(`[BladesClockKey.renderClockKey] Error '.clock-key-container' not found for key '${this.id}'.`);
    r.container$ = a.closest(".clock-key-container");
    const i = a.find(".key-image-container");
    if (!i.length)
      throw new Error(`[BladesClockKey.renderClockKey] Error '.key-image-container' not found for key '${this.id}'.`);
    r.imgContainer$ = i;
    const o = a.find(".key-label");
    if (!o.length)
      throw new Error(`[BladesClockKey.renderClockKey] Error label$ not found for key '${this.id}'.`);
    r.label$ = o;
    const n = a.find(".faction-label");
    n.length && (r.factionLabel$ = n);
    const l = a.find(".project-label");
    l.length && (r.projectLabel$ = l);
    const c = a.find(".score-label");
    return c.length && (r.scoreLabel$ = c), this.clocks.forEach((d) => {
      r.clocks ?? (r.clocks = {}), r.clocks[d.id] = d.getElements$(e);
    }), eLog.checkLog3("BladesClockKey", "Clock Key Elements", r), r;
  }
  // #endregion
  // #region Initial Rendering ~
  async renderTo(e) {
    const a = $(e);
    if (!a.length)
      throw new Error(`[BladesClockKey.renderClockKeyTo] Error parent element not provided for key '${this.id}'.`);
    const r = await renderTemplate(
      "systems/eunos-blades/templates/components/clock-key.hbs",
      this
    );
    $(r).appendTo(a);
  }
  /**
   * This function generates a partial GSAP.TweenVars object that will display the key in a given mode within the bounds of a provided container.
   *
   * @param {ClockKeyDisplayMode | number} [displayMode="full"] - The display mode. Options include:
   * - "full" - displays the entire clock key
   * - "clocks" - zooms in to display only the clocks
   * - "activeClocks" - zooms in to the active clocks
   * - "presentN" (where N is a clock index number) - zooms in to the clock at index N, and presents whichever side has the next available segment towards the camera.
   * - A clock index number - zooms in to the clock at index N
   *
   * @param {HTMLElement | JQuery<HTMLElement> | {x: number, y: number, width: number, height: number}} [container$] - The container within which the key will be displayed.
   * This can be:
   * - An HTMLElement
   * - A JQuery<HTMLElement>
   * - A {x, y, width, height} position definition
   * If not provided, it defaults to the clock key's container element (only if the key is already rendered in the DOM).
   *
   * @returns {gsap.TweenVars} - A partial GSAP.TweenVars object that describes how to display the key in the given mode within the bounds of the provided container. The returned object may include the following properties:
   * - 'scale' (number): A multiple to be applied to scale at "full" display mode.
   * - 'top' (number): A delta vertical shift from "full" display mode position.
   * - 'left' (number): A delta horizontal shift from "full" display mode position.
   * - 'transformOrigin': An absolute value.
   * - 'rotationZ': An absolute value for the keySwing axis.
   * - 'rotationY': An absolute value for rotation in/out of the screen.
   * Any variables left undefined default to "full" display mode.
   */
  getVarsForDisplayMode(e, a = ne.full, r) {
    const i = {}, o = {};
    r ?? (r = e.container$);
    let n;
    if (r instanceof HTMLElement || r instanceof jQuery) {
      const d = h.gsap.getProperty($(r)[0]);
      n = {
        x: d("x"),
        y: d("y"),
        width: d("width"),
        height: d("height")
      };
    } else if (Oi(r))
      n = r;
    else
      throw new Error(`[BladesClockKey.getVarsForDisplayMode] Error container$ '${r}' is not a valid type.`);
    let l, c;
    switch (a) {
      case ne.full: {
        c = {
          x: this.svgData.width / 2,
          y: this.svgData.height / 2,
          width: this.svgData.width,
          height: this.svgData.height
        };
        break;
      }
      case ne.clocks: {
        c = this.getClocksBoundingBox(Array.from(this.clocks));
        break;
      }
      case ne.activeClocks: {
        c = this.getClocksBoundingBox(this.getClocksIn(this.activeClocks, this.visibleClocks));
        break;
      }
      case ne.presentCurrentClock:
        l = this.currentClock, a = l.index;
      default: {
        if (typeof a == "string" && a.startsWith("present") && (a = h.pInt(a.toString().slice(7)), l = this.getClockByIndex(a)), !h.isInt(a) || a < 0 || a >= this.size)
          throw new Error(`[BladesClockKey.getVarsForDisplayMode] Error display mode '${a}' is not a valid clock index for key '${this.id}'.`);
        const d = this.svgData.clocks[a];
        c = {
          x: d.x,
          y: d.y,
          width: this.svgData.clocks.size,
          height: this.svgData.clocks.size
        };
        break;
      }
    }
    return i.scale = Math.min(
      n.height / c.height,
      n.width / c.width
    ), o.top = 0.5 * v.ClockKeySquareSize - c.y, o.left = 0.5 * v.ClockKeySquareSize - c.x, o.transformOrigin = `${c.x}px ${c.y}px`, o.rotateY = 0, l && (i.scale *= 2, l.getActiveSide() === "left" ? (o.rotateY = 30, o.left += this.size === 1 ? 45 : 25) : l.getActiveSide() === "right" && (o.rotateY = -30, o.left -= this.size === 1 ? 45 : 25)), { keyTweenVars: i, keyImgContTweenVars: o };
  }
  // public fitKeyToContainer(
  //   keyElems$: ClockKeyElems$,
  //   posOverrides?: Partial<ElemPosData & {
  //     xShift: number,
  //     yShift: number,
  //     scaleMult: number
  //   }>
  // ) {
  //   const {container$, elem$, imgContainer$} = keyElems$;
  //   // Get position data for the container$ element (x, y, width, height)
  //   const keyPosition: ElemPosData = {
  //     x: U.gsap.getProperty(container$[0], "x") as number,
  //     y: U.gsap.getProperty(container$[0], "y") as number,
  //     width: U.gsap.getProperty(container$[0], "width") as number,
  //     height: U.gsap.getProperty(container$[0], "height") as number
  //   };
  //   const {xShift, yShift, scaleMult, ...focusPosOverrides} = posOverrides ?? {};
  //   const focusPosition: ElemPosData = {
  //     ...this.fullDisplayPosData,
  //     ...focusPosOverrides
  //   };
  //   eLog.checkLog3("BladesClockKey", "[BladesClockKey] Key Positions", {
  //     keyPosition,
  //     focusPosition,
  //     widthScale: keyPosition.width / focusPosition.width,
  //     heightScale: keyPosition.height / focusPosition.height
  //   });
  //   // Apply scale factor to elem$ to fit default key position inside container$
  //   U.gsap.set(elem$, {
  //     scale: Math.min(
  //       keyPosition.width / focusPosition.width,
  //       keyPosition.height / focusPosition.height
  //     ) * (scaleMult ?? 1)
  //   });
  //   // Apply top, left and transformOrigin value to keyImgContainer, accounting for x/yPercent -50
  //   U.gsap.set(imgContainer$, {
  //     top: (0.5 * C.ClockKeySquareSize) - focusPosition.y + (yShift ?? 0),
  //     left: (0.5 * C.ClockKeySquareSize) - focusPosition.x + (xShift ?? 0),
  //     transformOrigin: `${focusPosition.x + (xShift ?? 0)}px ${focusPosition.y + (yShift ?? 0)}px`
  //   });
  // }
  formatLabels(e) {
    const { label$: a, clocks: r, factionLabel$: i, projectLabel$: o, scoreLabel$: n } = e;
    [
      [a, 2, 4],
      i ? [i, 2, 2] : void 0,
      o ? [o, 2, 2] : void 0,
      n ? [n, 2, 2] : void 0,
      ...this.clocks.map((l) => [r[l.id].clockLabel$, 2.5, 3])
    ].filter(Boolean).forEach(([l, c, d]) => {
      h.adjustTextContainerAspectRatio(l, c, d);
    });
  }
  setToDisplayMode(e, a, r = !0) {
    const { keyTweenVars: i, keyImgContTweenVars: o } = this.getVarsForDisplayMode(e, a);
    h.gsap.set(e.elem$, i), h.gsap.set(e.imgContainer$, o), r && a !== this.displayMode && this.updateTarget("displayMode", a);
  }
  initElementsInContext(e, a, r = !0) {
    const i = this.getElements$(e);
    return a ?? (a = this.displayMode), this.setToDisplayMode(i, a, r), this.formatLabels(i), (a.toString().startsWith("present") || Number.isInteger(a)) && h.gsap.to(i.container$.find(".clock-label, .clock-key-label"), { autoAlpha: 0, duration: 0 }), i;
  }
  // #endregion
  async addToScene(e = game.scenes.current.id) {
    if (this.isInScene(e))
      return;
    const { sceneIDs: a } = this;
    a.push(e), await this.updateTarget({
      isVisible: !1,
      sceneIDs: a
    }), this.renderTargetAndKeeper();
  }
  async removeFromScene(e = game.scenes.current.id) {
    if (!this.isInScene(e))
      return;
    const { sceneIDs: a } = this;
    h.remove(a, e), await this.updateTarget("sceneIDs", a), this.renderTargetAndKeeper();
  }
  closeClockKey({ container$: e }) {
    e.remove();
  }
  get svgData() {
    if (this.size === 0)
      throw new Error("[BladesClockKey.svgData] Error size is 0.");
    const e = Us[this.size];
    let a;
    if (this.size === 1 && e.paths)
      a = e.paths[this.oneKeyIndex];
    else if (e.path)
      a = e.path;
    else
      throw new Error("[BladesClockKey.svgData] Error path is not defined.");
    return {
      width: e.width,
      height: e.height,
      path: a,
      clocks: e.clocks
    };
  }
  isInOverlay(e) {
    return $(e).hasClass(".overlay-section") || $(e).closest(".overlay-section").length > 0;
  }
  get keyHeight() {
    return this.svgData.height;
  }
  get keyWidth() {
    return this.svgData.width;
  }
  get keyViewbox() {
    return `0 0 ${this.svgData.width} ${this.svgData.height}`;
  }
  get keyPath() {
    return this.svgData.path;
  }
  get clockSize() {
    return this.svgData.clocks.size;
  }
  getClockPosition(e = 0) {
    if (e > this.size)
      throw new Error(`[BladesClockKey.getClockPosition] Error clockIndex '${e}' is greater than key size '${this.size}'.`);
    if (e < 0)
      throw new Error(`[BladesClockKey.getClockPosition] Error clockIndex '${e}' is less than 0.`);
    return this.svgData.clocks[e];
  }
  removePositionDragger() {
    var e, a;
    (e = this.positionDragger) == null || e.target.remove(), (a = this.positionDragger) == null || a.kill(), delete this.positionDragger;
  }
  spawnPositionDragger(e = game.eunoblades.Director.clockKeySection$) {
    const a = this;
    this.positionDragger && this.removePositionDragger();
    const r = $(`<div id="Dragger-${this.id}" class="clock-key-container clock-key-dragger" data-size="${this.size}"></div>`).appendTo(e);
    this.overlayPosition && r.css({
      left: this.overlayPosition.x,
      top: this.overlayPosition.y
    }), this.positionDragger = new Pt(r, {
      type: "top,left",
      onDragStart() {
        $(this.target).css("background", "rgba(255, 255, 0, 0.25)"), $(this.target).css("outlineColor", "rgba(255, 255, 0, 1)");
      },
      onDragEnd() {
        $(this.target).css("background", "rgba(255, 0, 255, 0.25)"), $(this.target).css("outlineColor", "rgba(255, 0, 255, 1)"), a.overlayPosition = { x: this.endX, y: this.endY };
      }
    });
  }
  switchToMode(e, a, r = {}, i = {}, o = !0, n) {
    const { elem$: l, imgContainer$: c } = e, { keyTweenVars: d, keyImgContTweenVars: p } = this.getVarsForDisplayMode(e, a), u = this.displayMode, f = h.gsap.utils.random(1, 1e3, 1);
    return h.gsap.timeline({
      callbackScope: this,
      paused: !0,
      onStart() {
        eLog.checkLog2("BladesClockKey", `switchToMode #${f} - START`, { key: this, keyElems$: e, displayMode: a });
      },
      onComplete() {
        eLog.checkLog3("BladesClockKey", `switchToMode #${f} - COMPLETE`, { key: this, keyElems$: e, displayMode: a }), o && a !== this.currentDisplayMode ? this.updateTarget("displayMode", a).then(() => n == null ? void 0 : n()) : n == null || n();
      },
      onReverseComplete() {
        eLog.checkLog3("BladesClockKey", `switchToMode #${f} - REVERSE COMPLETE`, { key: this, keyElems$: e, displayMode: a }), o && this.updateTarget("displayMode", u);
      }
    }).to(l, { ...d, ...r }, 0).to(c, { ...p, ...i }, 0);
  }
  // #endregion
  // #region ANIMATED UPDATES (Both GM-Only AND Socket Calls)
  //    #region   > SOCKET CALLS: _SocketCall / static _SocketResponse / _Animation
  fadeInName_Animation(e) {
    if (this.name)
      return h.gsap.effects.blurReveal(e.label$, {
        ignoreMargin: !0,
        duration: 0.75
      });
  }
  async fadeInName_SocketCall(e) {
    game.user.isGM && socketlib.system.executeForEveryone("fadeInName_SocketCall", e, this.id);
  }
  static fadeInName_SocketResponse(e, a) {
    const r = game.eunoblades.ClockKeys.get(a);
    r && r.fadeInName_Animation(r.getElements$(e));
  }
  fadeOutName_Animation(e) {
    if (this.name)
      return h.gsap.effects.blurRemove(e.label$, {
        ignoreMargin: !0,
        duration: 0.75
      });
  }
  async fadeOutName_SocketCall(e) {
    game.user.isGM && (this.fadeOutName_Animation(this.getElements$(e)), socketlib.system.executeForOthers("fadeOutName_SocketCall", e, this.id));
  }
  static fadeOutName_SocketResponse(e, a) {
    const r = game.eunoblades.ClockKeys.get(a);
    r && r.fadeOutName_Animation(r.getElements$(e));
  }
  //    #endregion
  // #endregion
  // #region Adding & Removing Clocks ~
  async updateClockIndices() {
    return await this.updateTarget("clocksData", Object.fromEntries(
      Object.entries(this.clocksData).map(([e, a], r) => [e, { ...a, index: r }])
    )), this.clocks;
  }
  async addClock(e = {}) {
    const a = K.ParseConfigToData({
      ...K.ApplySchemaDefaults(e),
      index: this.size,
      targetID: this.targetID,
      targetKey: `${this.targetKeyPrefix}.clocksData`,
      isScopingById: !0
    });
    await this.updateTarget(`clocksData.${a.id}`, a), this.clocks, this.renderTargetAndKeeper();
  }
  async deleteClock(e) {
    var a, r;
    if (this.size <= 1)
      throw new Error("[BladesClockKey.deleteClock()] Cannot reduce number of clocks below 1!");
    e ?? (e = (a = Array.from(this.clocks).pop()) == null ? void 0 : a.id), e && (await ((r = this.getClockByID(e)) == null ? void 0 : r.delete()), await this.updateClockIndices(), this.clocks);
  }
  // #endregion
  // #region OVERRIDES: Async Update Methods
  renderTargetAndKeeper() {
    var e;
    this.renderTarget(), (e = game.eunoblades.ClockKeeper.sheet) == null || e.render();
  }
  renderTarget() {
    var e;
    (e = this.target.sheet) == null || e.render();
  }
  // #endregion
}
class K extends we {
  // #region STATIC METHODS ~
  static ApplySchemaDefaults(t) {
    const e = {
      name: t.name ?? "",
      value: t.value ?? 0,
      max: t.max ?? 8
    };
    return {
      index: 0,
      color: me.white,
      isVisible: !h.isInt(t.index) || t.index === 0,
      isNameVisible: !1,
      isHighlighted: !1,
      isActive: !h.isInt(t.index) || t.index === 0,
      ...t,
      ...e
    };
  }
  // #endregion
  // #region GETTERS & SETTERS ~
  get canEdit() {
    return console.log("NOTE: All Clocks currently Editable; see line 71 of BladesClock.ts"), this.isVisible && this.isActive;
  }
  get data() {
    return this.linkData;
  }
  get name() {
    return this.data.name;
  }
  set name(t) {
    this.updateTarget("name", t).then(() => {
      this.parentKey.renderTargetAndKeeper();
    });
  }
  get value() {
    return h.pInt(this.data.value);
  }
  set value(t) {
    this.updateTarget("value", h.pInt(t)).then(() => {
      this.parentKey.renderTargetAndKeeper();
    });
  }
  get max() {
    return h.pInt(this.data.max);
  }
  set max(t) {
    this.updateTarget("max", h.pInt(t)).then(() => {
      this.parentKey.renderTargetAndKeeper();
    });
  }
  get color() {
    return this.data.color ?? me.white;
  }
  set color(t) {
    this.updateTarget("color", t).then(() => {
      this.parentKey.renderTargetAndKeeper();
    });
  }
  get isActive() {
    return h.pBool(this.data.isActive);
  }
  set isActive(t) {
    this.updateTarget("isActive", h.pBool(t)).then(() => {
      this.parentKey.renderTargetAndKeeper();
    });
  }
  get parentKey() {
    const t = game.eunoblades.ClockKeys.get(this.data.parentKeyID);
    if (!t)
      throw new Error(`[BladesClockKey.parentKey] No parent key found for clock ${this.id}`);
    return t;
  }
  get isNameVisible() {
    return h.pBool(this.data.isNameVisible);
  }
  set isNameVisible(t) {
    this.updateTarget("isNameVisible", h.pBool(t)).then(() => {
      this.parentKey.renderTargetAndKeeper();
    });
  }
  get isVisible() {
    return h.pBool(this.data.isVisible);
  }
  set isVisible(t) {
    this.updateTarget("isVisible", h.pBool(t)).then(() => {
      this.parentKey.renderTargetAndKeeper();
    });
  }
  get isHighlighted() {
    return h.pBool(this.data.isHighlighted);
  }
  set isHighlighted(t) {
    this.updateTarget("isHighlighted", h.pBool(t)).then(() => {
      this.parentKey.renderTargetAndKeeper();
    });
  }
  get index() {
    return h.pInt(this.data.index);
  }
  set index(t) {
    this.updateTarget("index", h.pInt(t)).then(() => {
      this.parentKey.renderTargetAndKeeper();
    });
  }
  get isEmpty() {
    return this.value === 0;
  }
  get isComplete() {
    return this.value >= this.max;
  }
  get rollOppClock() {
    return this;
  }
  get rollOppName() {
    return this.name;
  }
  get rollOppType() {
    return "clock";
  }
  get colorSelectOptions() {
    return [
      { value: me.white, display: "🔘" },
      { value: me.yellow, display: "📀" },
      { value: me.cyan, display: "🔵" },
      { value: me.red, display: "🔴" }
    ];
  }
  get maxSelectOptions() {
    return [
      { value: 2, display: 2 },
      { value: 3, display: 3 },
      { value: 4, display: 4 },
      { value: 5, display: 5 },
      { value: 6, display: 6 },
      { value: 8, display: 8 },
      { value: 10, display: 10 },
      { value: 12, display: 12 }
    ];
  }
  get valueSelectOptions() {
    const t = [];
    for (let e = 0; e <= this.max; e++)
      t.push({ value: e, display: e });
    return t;
  }
  // Returns which hemisphere of the clock will show the final change if segmentDelta segments are added/removed.
  getActiveSide(t = 0) {
    const e = Math.min(this.max, Math.max(0, this.value + t)), a = this.max / 2;
    return t === 0 ? e >= a ? "left" : "right" : e > a ? "left" : "right";
  }
  // #endregion
  // #region HTML INTERACTION ~
  getElemFromDisplayContext(t) {
    let e;
    const a = $(".vtt.game.system-eunos-blades");
    switch (t) {
      case W.overlay: {
        e = a.find(`#blades-overlay #${this.id}`);
        break;
      }
      case W.pcSheet: {
        e = a.find(`.actor.sheet .pc #${this.id}`);
        break;
      }
      case W.factionSheet: {
        e = a.find(`.actor.sheet .faction #${this.id}`);
        break;
      }
      case W.projectSheet: {
        e = a.find(`.item.sheet .project #${this.id}`);
        break;
      }
      case W.scoreSheet: {
        e = a.find(`.item.sheet .score #${this.id}`);
        break;
      }
      case W.rollCollab: {
        e = a.find(`.roll-collab-sheet #${this.id}`);
        break;
      }
      case W.chatMessage: {
        e = a.find(`#chat #${this.id}`);
        break;
      }
    }
    if (!e.length)
      throw new Error(`[BladesClockKey.getElemFromDisplayContext] Error elem$ not found for key '${this.id}' for display context '${t}'.`);
    return e;
  }
  getElements$(t) {
    let e;
    if (typeof t == "string" && (t = this.getElemFromDisplayContext(t)), e = $(t).find(`#${this.id}`), e.length || (e = $(t).closest(`#${this.id}`)), !(e != null && e.length))
      throw new Error(`[BladesClock.getElements$] Cannot find elements for display context '${t}' of clock '${this.id}' of key '${this.parentKey.id}'.`);
    const a = {
      clockElem$: e
    }, r = e.closest(".clock-container");
    if (!r.length)
      throw new Error(`[BladesClock.getElements$] Error '.clock-container' not found for clock '${this.id}' of key '${this.parentKey.id}'.`);
    a.clockContainer$ = r;
    const i = e.find(".clock-label");
    if (!i.length)
      throw new Error(`[BladesClock.getElements$] Error '.clock-label' not found for clock '${this.id}' of key '${this.parentKey.id}'.`);
    a.clockLabel$ = i;
    const o = e.find(".clock-bg");
    if (!o.length)
      throw new Error(`[BladesClock.getElements$] Error '.clock-bg' not found for clock '${this.id}' of key '${this.parentKey.id}'.`);
    a.bg$ = o;
    const n = e.find(".clock-frame");
    if (!n.length)
      throw new Error(`[BladesClock.getElements$] Error '.clock-frame' not found for clock '${this.id}' of key '${this.parentKey.id}'.`);
    a.frame$ = n;
    const l = e.find(".clock-fill");
    if (!l.length)
      throw new Error(`[BladesClock.getElements$] Error '.clock-fill' not found for clock '${this.id}' of key '${this.parentKey.id}'.`);
    a.fill$ = l;
    const c = e.find(".clock-glow");
    if (!c.length)
      throw new Error(`[BladesClock.getElements$] Error '.clock-glow' not found for clock '${this.id}' of key '${this.parentKey.id}'.`);
    a.glow$ = c;
    const d = e.find(".clock-cover");
    if (!d.length)
      throw new Error(`[BladesClock.getElements$] Error '.clock-cover' not found for clock '${this.id}' of key '${this.parentKey.id}'.`);
    a.cover$ = d;
    const p = e.find(".clock-one-segment");
    if (p.length !== 3)
      throw new Error(`[BladesClock.getElements$] Error '.clock-one-segment' elements not found for clock '${this.id}' of key '${this.parentKey.id}'.`);
    return a.oneSegments$ = p, a;
  }
  // #endregion
  // #region ANIMATED UPDATES (Both GM-Only AND Socket Calls)
  reveal_Animation(t, e) {
    const a = [
      t.frame$,
      t.fill$
    ].filter((i) => i !== void 0), r = h.gsap.timeline({
      callbackScope: this,
      onComplete() {
        e == null || e();
      }
    });
    return r.to(t.cover$, { scale: 2, autoAlpha: 0, duration: 0.5, ease: "power2" }), r.fromTo(a, {
      autoAlpha: 0,
      scale: 2
    }, {
      autoAlpha: 1,
      scale: 1,
      duration: 0.5,
      stagger: 0.2,
      ease: "power2"
    }), this.name && this.isNameVisible && r.blurReveal(t.clockLabel$, {
      ignoreMargin: !0,
      duration: 0.75
    }, "<+0.05"), this.isHighlighted && r.scaleUpReveal(t.glow$, {
      scale: 3,
      duration: 0.5
    }, "<+0.05"), this.isActive ? r.add(() => this.activate_Animation(t), "<+0.05") : r.add(() => this.deactivate_Animation(t), "<+0.05"), r;
  }
  async reveal_SocketCall(t) {
    game.user.isGM && socketlib.system.executeForEveryone("reveal_SocketCall", t, this.parentKey.id, this.index);
  }
  static reveal_SocketResponse(t, e, a) {
    const r = game.eunoblades.ClockKeys.get(e);
    if (!(r != null && r.isVisible))
      return;
    const i = r.getClockByIndex(a);
    if (!i)
      return;
    const o = i.getElements$(t);
    i.reveal_Animation(o);
  }
  hide_Animation(t, e) {
    const a = [
      t.frame$,
      t.fill$
    ].filter((i) => i !== void 0), r = h.gsap.timeline({
      callbackScope: this,
      onComplete() {
        e == null || e();
      }
    });
    return r.to(a, {
      autoAlpha: 0,
      scale: 2,
      duration: 0.5,
      stagger: 0.2,
      ease: "power2"
    }), this.name && this.isNameVisible && r.blurRemove(t.clockLabel$, {
      ignoreMargin: !0,
      duration: 0.75
    }, "<+0.05"), this.isHighlighted && r.scaleDownRemove(t.glow$, {
      scale: 3,
      duration: 0.5
    }, "<+0.05"), r.to(t.cover$, { scale: 1, autoAlpha: 1, duration: 0.5, ease: "power2" }), r;
  }
  async hide_SocketCall(t) {
    game.user.isGM && socketlib.system.executeForEveryone("hide_SocketCall", t, this.parentKey.id, this.index);
  }
  static hide_SocketResponse(t, e, a) {
    const r = game.eunoblades.ClockKeys.get(e);
    if (!(r != null && r.isVisible))
      return;
    const i = r.getClockByIndex(a);
    if (!i)
      return;
    const o = i.getElements$(t);
    i.hide_Animation(o);
  }
  activate_Animation(t, e) {
    h.gsap.to(t.bg$, { autoAlpha: 1, duration: 0.5, ease: "power2" }), h.gsap.to(t.frame$, {
      filter: "brightness(0.5)",
      duration: 0.5,
      ease: "power2",
      onComplete: e
    });
  }
  async activate_SocketCall(t) {
    game.user.isGM && socketlib.system.executeForEveryone("activate_SocketCall", t, this.parentKey.id, this.index);
  }
  static activate_SocketResponse(t, e, a) {
    const r = game.eunoblades.ClockKeys.get(e);
    if (!(r != null && r.isVisible))
      return;
    const i = r.getClockByIndex(a);
    i && i.activate_Animation(i.getElements$(t));
  }
  deactivate_Animation(t, e) {
    h.gsap.to(t.bg$, { autoAlpha: 0, duration: 0.5, ease: "power2" }), h.gsap.to(t.frame$, {
      filter: "brightness(1) blur(5px)",
      duration: 0.5,
      ease: "power2",
      onComplete: e
    });
  }
  async deactivate_SocketCall(t) {
    game.user.isGM && socketlib.system.executeForEveryone("deactivate_SocketCall", t, this.parentKey.id, this.index);
  }
  static deactivate_SocketResponse(t, e, a) {
    const r = game.eunoblades.ClockKeys.get(e);
    if (!(r != null && r.isVisible))
      return;
    const i = r.getClockByIndex(a);
    i && i.deactivate_Animation(i.getElements$(t));
  }
  fadeInClockName_Animation(t) {
    h.gsap.effects.blurReveal(t.clockLabel$, {
      ignoreMargin: !0,
      duration: 0.75
    });
  }
  async fadeInClockName_SocketCall(t) {
    game.user.isGM && socketlib.system.executeForEveryone("fadeInClockName_SocketCall", t, this.parentKey.id, this.index);
  }
  static fadeInClockName_SocketResponse(t, e, a) {
    const r = game.eunoblades.ClockKeys.get(e);
    if (!(r != null && r.isVisible))
      return;
    const i = r.getClockByIndex(a);
    i && i.fadeInClockName_Animation(i.getElements$(t));
  }
  fadeOutClockName_Animation(t) {
    h.gsap.effects.blurRemove(t.clockLabel$, {
      ignoreMargin: !0,
      duration: 0.75
    });
  }
  async fadeOutClockName_SocketCall(t) {
    game.user.isGM && socketlib.system.executeForEveryone("fadeOutClockName_SocketCall", t, this.parentKey.id, this.index);
  }
  static fadeOutClockName_SocketResponse(t, e, a) {
    const r = game.eunoblades.ClockKeys.get(e);
    if (!(r != null && r.isVisible))
      return;
    const i = r.getClockByIndex(a);
    i && i.fadeOutClockName_Animation(i.getElements$(t));
  }
  highlight_Animation(t) {
    h.gsap.effects.scaleUpReveal(t.glow$, {
      duration: 0.5,
      scale: 3
    });
  }
  async highlight_SocketCall(t) {
    game.user.isGM && socketlib.system.executeForEveryone("highlight_SocketCall", t, this.parentKey.id, this.index);
  }
  static highlight_SocketResponse(t, e, a) {
    const r = game.eunoblades.ClockKeys.get(e);
    if (!(r != null && r.isVisible))
      return;
    const i = r.getClockByIndex(a);
    i && i.highlight_Animation(i.getElements$(t));
  }
  unhighlight_Animation(t) {
    h.gsap.effects.scaleDownRemove(t.glow$, {
      duration: 0.5,
      scale: 3
    });
  }
  async unhighlight_SocketCall(t) {
    game.user.isGM && socketlib.system.executeForEveryone("unhighlight_SocketCall", t, this.parentKey.id, this.index);
  }
  static unhighlight_SocketResponse(t, e, a) {
    const r = game.eunoblades.ClockKeys.get(e);
    if (!(r != null && r.isVisible))
      return;
    const i = r.getClockByIndex(a);
    i && i.unhighlight_Animation(i.getElements$(t));
  }
  getRotationOfSegment(t) {
    return 360 / this.max * (t - 1);
  }
  initOneSegments(t, e, a) {
    if (e.length > 3)
      throw new Error(`Too many segments: [${e.join(", ")}]`);
    const r = [...t.oneSegments$], i = Array.from(t.oneSegments$).slice(0, e.length);
    for (const o of e) {
      const n = r.shift();
      h.gsap.set(n, {
        rotation: this.getRotationOfSegment(o),
        autoAlpha: a ? 1 : 0
      });
    }
    return a && t.clockElem$.attr("data-value", h.getLast(e) - 1), i;
  }
  changeSegments_Animation(t, e, a, r) {
    e = h.gsap.utils.clamp(0, this.max, e), a = h.gsap.utils.clamp(0, this.max, a);
    let i = a - e;
    if (i === 0)
      return;
    const o = [];
    if (i < 0) {
      for (; Math.abs(i) > e; )
        i++;
      for (let c = e; c > a; c--)
        o.push(c);
    } else {
      for (; a > this.max; )
        i--;
      for (let c = e + 1; c <= a; c++)
        o.push(c);
    }
    const n = this.initOneSegments(t, o, e > a);
    eLog.checkLog3("BladesClock", "changeSegments_Animation", { clockElems$: t, delta: i, segmentNums: o, startVal: e, endVal: a, segmentsToAnimate: n });
    const l = h.gsap.timeline();
    return i > 0 ? l.fromTo(n, {
      autoAlpha: 0,
      scale: 2
    }, {
      autoAlpha: 1,
      scale: 1,
      duration: 0.5,
      stagger: 0.2,
      ease: "power2",
      callbackScope: this,
      onComplete() {
        t.clockElem$.attr("data-value", a), h.gsap.to(n, {
          autoAlpha: 0,
          duration: 0.5,
          stagger: 0.2
          // onComplete() {
          //   // Return clock key to original size and focus
          //   clockFocusTimeline.reverse();
          // }
        });
      }
    }) : l.fromTo(n, {
      autoAlpha: 1,
      scale: 1
    }, {
      autoAlpha: 0,
      scale: 2,
      duration: 0.5,
      stagger: 0.2,
      ease: "power2"
      // onComplete() {
      //   // Return clock key to original size and focus
      //   clockFocusTimeline.reverse();
      // }
    }), l;
  }
  async changeSegments_SocketCall(t, e, a) {
    game.user.isGM && (e = h.gsap.utils.clamp(0, this.max, e), a = h.gsap.utils.clamp(0, this.max, a), socketlib.system.executeForEveryone("changeSegments_SocketCall", t, this.parentKey.id, this.index, e, a));
  }
  static changeSegments_SocketResponse(t, e, a, r, i) {
    const o = game.eunoblades.ClockKeys.get(e);
    if (!(o != null && o.isVisible))
      return;
    const n = o.getClockByIndex(a);
    n && n.changeSegments_Animation(n.getElements$(t), r, i);
  }
  // #endregion
  // #region Adding/Removing Clock Segments ~
  // Returns number of segments beyond max (or 0, if max not met)
  async fillSegments(t, e = !1) {
    const a = Math.max(0, this.value + t - this.max);
    return t = Math.min(this.value + t, this.max) - this.value, t === 0 || (await this.updateTarget("value", this.value + t), e || this.parentKey.renderTargetAndKeeper()), a;
  }
  // Returns (positive) number of segments removed
  // in excess of the number of segments in the clock
  async clearSegments(t, e = !1) {
    const a = Math.max(0, t - this.value);
    return t = Math.min(this.value, t), t === 0 || (await this.updateTarget("value", this.value - t), e || this.parentKey.renderTargetAndKeeper()), a;
  }
  async delete() {
    const { parentKey: t } = this;
    await super.delete(!1), t.updateClockIndices();
  }
  // #endregion
}
const ge = class ge {
  constructor() {
    w(this, "_id");
    // #endregion
    // #endregion
    // #region OVERLAY ~
    // #region  >> Overlay Elements$ ~
    w(this, "_overlayContainer");
    w(this, "_overlayContainer$");
    // - As with notifications: placeholder animation until something more final can be coded.
    // #endregion
    // #region TOOLTIPS ~
    w(this, "_tooltipObserver");
    w(this, "_tooltipElems", /* @__PURE__ */ new Map());
    w(this, "_displayedTooltipID");
    this._id = randomID();
  }
  static getInstance() {
    return ge.instance ?? (ge.instance = new ge());
  }
  // #endregion
  static async Initialize() {
    return Hooks.on("renderApplication", async () => {
      game.eunoblades.Director.initClockKeySection(!0), game.user.isGM && (await game.eunoblades.ClockKeeper.update({ "system.targetScene": game.scenes.current.id }), game.eunoblades.ClockKeeper.render());
    }), loadTemplates([
      "systems/eunos-blades/templates/overlay/blades-overlay.hbs",
      "systems/eunos-blades/templates/overlay/location.hbs",
      "systems/eunos-blades/templates/overlay/score-panel.hbs",
      "systems/eunos-blades/templates/overlay/npc-portrait.hbs",
      "systems/eunos-blades/templates/overlay/pc-portrait.hbs",
      "systems/eunos-blades/templates/overlay/cohort-portrait.hbs",
      "systems/eunos-blades/templates/overlay/crew-status-bar.hbs",
      "systems/eunos-blades/templates/overlay/game-phase-bar.hbs",
      "systems/eunos-blades/templates/overlay/notices/push.hbs"
    ]);
  }
  // #region   >>  Sockets ~
  static InitSockets() {
    const t = ge.getInstance();
    socketlib.system.register("renderOverlay_SocketCall", t.renderOverlay_SocketResponse.bind(t)), t.initClockSockets(), t.initScorePanelSockets(), t.initLocationSockets(), t.initNPCSockets(), t.initPCSockets(), t.initCohortSockets(), t.initCrewSockets(), t.initNotificationSockets(), t.initTransitionSockets();
  }
  get overlayContainer() {
    return this._overlayContainer || ([this._overlayContainer] = $("#blades-overlay")), this._overlayContainer || ($("body.vtt").append('<section id="blades-overlay"></section>'), [this._overlayContainer] = $("#blades-overlay")), this._overlayContainer;
  }
  get overlayContainer$() {
    return this._overlayContainer$ || (this._overlayContainer$ = $(this.overlayContainer)), this._overlayContainer$;
  }
  get clockKeySection$() {
    return this.overlayContainer$.find(".overlay-section-clock-keys");
  }
  get locationSection$() {
    return this.overlayContainer$.find(".overlay-section-location");
  }
  get scorePanelSection$() {
    return this.overlayContainer$.find(".overlay-section-score-panel");
  }
  get npcSection$() {
    return this.overlayContainer$.find(".overlay-section-npcs");
  }
  get playerSection$() {
    return this.overlayContainer$.find(".overlay-section-players");
  }
  get crewSection$() {
    return this.overlayContainer$.find(".overlay-section-crew");
  }
  get notificationSection$() {
    return this.overlayContainer$.find(".overlay-section-notifications");
  }
  get transitionSection$() {
    return this.overlayContainer$.find(".overlay-section-transitions");
  }
  get tooltipSection$() {
    return this.overlayContainer$.find(".overlay-section-tooltips");
  }
  get svgData() {
    return Us;
  }
  // #endregion
  // #region  >> Rendering ~
  renderOverlay_SocketCall() {
    game.user.isGM && this.overlayContainer && socketlib.system.executeForEveryone("renderOverlay_SocketCall");
  }
  async renderOverlay_SocketResponse() {
    const t = await renderTemplate(
      "systems/eunos-blades/templates/overlay/blades-overlay.hbs",
      this
    );
    this.overlayContainer$.empty().append(t), this.initClockKeySection(), this.initTooltipSection();
  }
  // #endregion
  // #endregion
  // #region CLOCKS & CLOCK KEYS ~
  // #region   >> INITIALIZATION ~
  initClockKeySection(t = !1) {
    t && this.clockKeySection$.empty();
    const e = h.shuffle(this.sceneKeys.filter((r) => r.isVisible));
    let a = 0;
    for (; e.length; ) {
      const r = e.shift();
      r && (setTimeout(() => this.renderClockKey(r), a * 1e3), a += 0.5);
    }
    setTimeout(() => {
    }, a * 1e3);
  }
  initClockSockets() {
    socketlib.system.register("renderClockKey_SocketCall", ge.renderClockKey_SocketResponse.bind(ge)), socketlib.system.register("pullKey_SocketCall", ge.pullKey_SocketResponse.bind(ge)), socketlib.system.register("fadeInName_SocketCall", le.fadeInName_SocketResponse.bind(le)), socketlib.system.register("fadeOutName_SocketCall", le.fadeOutName_SocketResponse.bind(le)), socketlib.system.register("reveal_SocketCall", K.reveal_SocketResponse.bind(K)), socketlib.system.register("hide_SocketCall", K.hide_SocketResponse.bind(K)), socketlib.system.register("activate_SocketCall", K.activate_SocketResponse.bind(K)), socketlib.system.register("deactivate_SocketCall", K.deactivate_SocketResponse.bind(K)), socketlib.system.register("fadeInClockName_SocketCall", K.fadeInClockName_SocketResponse.bind(K)), socketlib.system.register("fadeOutClockName_SocketCall", K.fadeOutClockName_SocketResponse.bind(K)), socketlib.system.register("highlight_SocketCall", K.highlight_SocketResponse.bind(K)), socketlib.system.register("unhighlight_SocketCall", K.unhighlight_SocketResponse.bind(K)), socketlib.system.register("changeSegments_SocketCall", K.changeSegments_SocketResponse.bind(K));
  }
  // #endregion
  get sceneKeys() {
    return game.eunoblades.ClockKeeper.getSceneKeys(game.scenes.current.id);
  }
  // #region   >> Rendering (Dropping) Clock Keys ~
  dropKey_Animation(t, e) {
    const {
      container$: a,
      label$: r,
      imgContainer$: i,
      clocks: o
    } = e ?? t.getElements$(game.eunoblades.Director.clockKeySection$), n = i.data("keySwingTimeline"), l = h.gsap.timeline().call(() => {
      n.seek("NEUTRAL").play();
    }).from(a, {
      y: -800,
      ease: "bounce",
      duration: 1
    }, 0).to(a, { autoAlpha: 1, duration: 0.5, ease: "power2" }, 0);
    t.visibleClocks.forEach((c, d) => {
      l.add(
        () => {
          c.reveal_Animation(o[c.id]);
        },
        d === 0 ? ">" : "<+0.15"
      );
    }), t.name && t.isNameVisible && l.blurReveal(r, {
      ignoreMargin: !0,
      duration: 0.75
    }, "<+0.05");
  }
  prepareClockKeyTimelines(t, e) {
    const { container$: a, imgContainer$: r, elem$: i, label$: o, clocks: n } = e;
    h.gsap.set(a, { pointerEvents: "auto" }), h.gsap.set(i, { filter: "brightness(1)" }), h.gsap.set(r, { transformOrigin: "50% 10%" });
    const l = h.gsap.getProperty(a[0], "scale");
    r.data(
      "keySwingTimeline",
      h.gsap.timeline({ paused: !0, repeat: -1, yoyo: !0 }).fromTo(r, { rotateZ: -1 }, { rotateZ: 1, duration: 3, ease: "sine.inOut" }).addLabel("NEUTRAL", 1.5).seek("NEUTRAL")
    ), a.data(
      "hoverOverTimeline",
      h.gsap.timeline({
        paused: !0,
        data: { key: t, imgContainer$: r, label$: o, isNameRevealed: !1 },
        onStart() {
          this.data.imgContainer$.data("keySwingTimeline").tweenTo("NEUTRAL", {
            duration: 0.25,
            ease: "back.out(1.5)"
          }), this.data.key.name && !this.data.key.isNameVisible && (this.data.isNameRevealed = !0, h.gsap.effects.blurReveal(this.data.label$, {
            ignoreMargin: !0,
            duration: 0.5
          }));
        },
        onReverseComplete() {
          this.data.imgContainer$.data("keySwingTimeline").seek("NEUTRAL").play(), this.data.isNameRevealed && (this.data.isNameRevealed = !1, h.gsap.effects.blurRemove(this.data.label$, {
            ignoreMargin: !0,
            duration: 0.5
          }));
        }
      }).to(i, { filter: "brightness(1.5)", scale: l * 1.25, duration: 0.5, ease: "sine" })
    ), t.clocks.forEach((c) => {
      const { clockContainer$: d, clockLabel$: p, clockElem$: u } = n[c.id];
      if (!(d != null && d.length))
        throw new Error(`[BladesDirector.prepareClockKeyTimelines] Error clockContainer$ not found for clock '${c.id}' of key '${t.id}'.`);
      h.gsap.set(d, { pointerEvents: "auto" }), d.data(
        "hoverOverTimeline",
        h.gsap.timeline({
          paused: !0,
          data: { clock: c, clockLabel$: p, isNameRevealed: !1 },
          onStart() {
            this.data.clock.name && !this.data.clock.isNameVisible && (this.data.isNameRevealed = !0, h.gsap.effects.blurReveal(this.data.clockLabel$, {
              ignoreMargin: !0,
              duration: 0.5
            }));
          },
          onReverseComplete() {
            this.data.isNameRevealed && (this.data.isNameRevealed = !1, h.gsap.effects.blurRemove(this.data.clockLabel$, {
              ignoreMargin: !0,
              duration: 0.5
            }));
          }
        }).to(u, { filter: "brightness(1.5)", scale: 1.25, duration: 0.25, ease: "sine" })
      );
    });
  }
  async activateClockKeyListeners(t, e) {
    const { container$: a, clocks: r } = e;
    game.user.isGM ? (a.on("dblclick", async () => {
      var i;
      (i = game.eunoblades.ClockKeeper.sheet) == null || i.render(!0);
    }), a.on("contextmenu", async () => {
      this.pullKey_SocketCall(t.id), t.updateTarget("isVisible", !1);
    })) : (a.on("mouseenter", () => {
      a.data("hoverOverTimeline").play();
    }).on("mouseleave", () => {
      a.data("hoverOverTimeline").reverse();
    }), t.clocks.forEach((i) => {
      const { clockContainer$: o } = r[i.id];
      o.on("mouseenter", () => {
        i.isVisible && o.data("hoverOverTimeline").play();
      }).on("mouseleave", () => {
        i.isVisible && o.data("hoverOverTimeline").reverse();
      });
    }));
  }
  async renderClockKey(t) {
    await t.renderTo(this.clockKeySection$), t.positionDragger && t.removePositionDragger();
    const e = t.initElementsInContext(this.clockKeySection$, ne.full);
    t.overlayPosition && h.gsap.set(e.container$, {
      left: t.overlayPosition.x,
      top: t.overlayPosition.y
    }), this.prepareClockKeyTimelines(t, e), this.activateClockKeyListeners(t, e), this.dropKey_Animation(t, e);
  }
  async renderClockKey_SocketCall(t) {
    game.user.isGM && socketlib.system.executeForEveryone("renderClockKey_SocketCall", t);
  }
  static async renderClockKey_SocketResponse(t) {
    const e = game.eunoblades.ClockKeys.get(t);
    e && game.eunoblades.Director.renderClockKey(e);
  }
  // #endregion
  // #region   >> Un-Rendering (Pulling) Clock Keys ~
  pullKey_Animation(t) {
    const { container$: e } = t.getElements$(game.eunoblades.Director.clockKeySection$);
    h.gsap.timeline().to(e, {
      y: -800,
      ease: "back.in(1)",
      duration: 0.75
    }).to(e, {
      opacity: 0,
      ease: "power2.out",
      duration: 0.25
    }, 0.75).call(() => {
      e.remove();
    });
  }
  async pullKey_SocketCall(t) {
    game.user.isGM && socketlib.system.executeForEveryone("pullKey_SocketCall", t);
  }
  static pullKey_SocketResponse(t) {
    const e = game.eunoblades.ClockKeys.get(t);
    e && game.eunoblades.Director.pullKey_Animation(e);
  }
  // #endregion
  // #endregion
  // #region SCORE PANEL ~
  // #region   >> INITIALIZATION ~
  initScorePanelSockets() {
  }
  // #endregion
  // ## Score Details
  // - Small panel overlapping corner of Location
  // - Engagement roll result
  // - Plan & Detail
  // - Target tier
  activateScorePanelListeners() {
  }
  // #endregion
  // #region LOCATIONS ~
  // #region   >> INITIALIZATION ~
  initLocationSockets() {
  }
  // #endregion
  // ## Locations
  // - District wrapper/header
  // - Faction wrapper/footer
  // - Location main
  // - Slide-scroll of sublocations
  activateLocationListeners() {
  }
  // #endregion
  // #region NPCs ~
  // #region   >> INITIALIZATION ~
  initNPCSockets() {
  }
  // #endregion// ## NPCs
  // - Linked to a location: When location is displayed, so are they.  *(Can be linked to District wrapper, main Location, or sublocations)*
  // - Portrait images close to the central location display, hover-over popups provide more detailed information from sheet or `BladesScore` instance
  activateNPCListeners() {
  }
  // #endregion
  // #region PCs, COHORTs, CREW ~
  // #region   >> INITIALIZATION ~
  initPCSockets() {
  }
  initCohortSockets() {
  }
  initCrewSockets() {
  }
  // #endregion
  // ## PCs
  // - Display panels along bottom
  // - Signal lights
  activatePCListeners() {
  }
  // ## Cohorts
  // - Smaller panels alongside the PCs
  activateCohortListeners() {
  }
  // ## Crew
  // - Limited information displayed, maybe bar beneath PCs showing Heat, Wanted Level…
  activateCrewListeners() {
  }
  // #endregion
  // #region NOTIFICATIONS ~
  // #region   >> INITIALIZATION ~
  initNotificationSockets() {
    socketlib.system.register("pushNotice_SocketCall", ge.pushNotice_SocketResponse.bind(ge));
  }
  // #endregion
  pushNotice_SocketCall(t, e) {
    const a = randomID();
    if (typeof t == "string") {
      if (t === "ALL")
        return socketlib.system.executeForEveryone("pushNotice_SocketCall", a, e);
      if (t === "GM")
        return socketlib.system.executeForAllGMs("pushNotice_SocketCall", a, e);
      t = game.users.filter(
        (r) => {
          var i, o;
          return r.id === t || r.name === t || ((i = r.character) == null ? void 0 : i.id) === t || ((o = r.character) == null ? void 0 : o.name) === t || game.user.isGM;
        }
      ).map((r) => r.id);
    }
    if (t.length > 0)
      return socketlib.system.executeForUsers("pushNotice_SocketCall", t, a, e);
  }
  static async pushNotice_SocketResponse(t, e) {
    const a = game.eunoblades.Director, r = $(await renderTemplate("systems/eunos-blades/templates/overlay/notices/push.hbs", {
      id: t,
      ...e
    })).appendTo(a.notificationSection$).on("click", (i) => {
      a.$removePush(i.currentTarget);
    }).on("contextmenu", (i) => {
      a.$removeAndClear(i.currentTarget);
    });
    h.gsap.fromTo(
      r,
      {
        x: 200,
        skewX: 20,
        autoAlpha: 0,
        filter: "blur(10px)"
      },
      {
        x: 0,
        skewX: 0,
        autoAlpha: 1,
        filter: "blur(0px)",
        duration: 0.5,
        ease: "back"
      }
    );
  }
  async $removePush(t) {
    h.gsap.to(
      t,
      {
        x: "+=200",
        autoAlpha: 0,
        ease: "power2",
        duration: 0.5,
        onComplete: function() {
          $(t).remove();
        }
      }
    );
  }
  async $removeAndClear(t) {
    const e = $(t).prevAll().get().reverse();
    e.unshift(t), h.gsap.to(
      e,
      {
        x: "+=200",
        autoAlpha: 0,
        ease: "power2",
        duration: 0.5,
        stagger: {
          each: 0.5,
          from: "start",
          ease: "power1.inOut"
        },
        onComplete: function() {
          e.forEach((a) => $(a).remove());
        }
      }
    );
  }
  // #endregion
  // #region TRANSITIONS ~
  // #region   >> INITIALIZATION ~
  initTransitionSockets() {
  }
  // #endregion
  // ## Transitions
  async advanceGamePhase(t) {
    var e;
    h.gsap.utils.wrap(
      Object.values(N),
      Object.values(N).indexOf(t ?? ((e = game.eunoblades.Tracker) == null ? void 0 : e.phase) ?? N.Freeplay) + 1
    );
  }
  /**
   * Adjusts the tooltip's position to ensure it remains within its parent container using jQuery methods.
   * @param tooltip - The tooltip element, which can be either an HTMLElement or a JQuery<HTMLElement>.
   */
  adjustTooltipPosition(t) {
    if (t.css("position") !== "absolute")
      throw new Error("Tooltip position must be 'absolute'.");
    const e = t[0].getBoundingClientRect(), a = this.tooltipSection$[0].getBoundingClientRect(), r = t.position().top, i = t.position().left;
    if (e.right > a.right) {
      const o = a.right - e.right;
      t.css("left", `${i + o}px`);
    } else if (e.left < a.left) {
      const o = a.left - e.left;
      t.css("left", `${i + o}px`);
    }
    if (e.bottom > a.bottom) {
      const o = a.bottom - e.bottom;
      t.css("top", `${r + o}px`);
    } else if (e.top < a.top) {
      const o = a.top - e.top;
      t.css("top", `${r + o}px`);
    }
  }
  displayTooltip(t) {
    var a, r;
    if (!t.id)
      throw new Error("Tooltip must have an ID to be cloned to the overlay.");
    this._displayedTooltipID = t.id;
    const e = this;
    if (game.eunoblades.Director.clearTooltips(), !this._tooltipElems.has(t.id)) {
      const i = $(h.changeContainer(
        t,
        game.eunoblades.Director.tooltipSection$[0],
        !0
      ));
      this.adjustTooltipPosition(i);
      const o = h.gsap.effects.blurRevealTooltip(
        i[0],
        {
          onReverseComplete() {
            i.attr("id") === e._displayedTooltipID && delete e._displayedTooltipID, game.eunoblades.Director._tooltipElems.delete(i.attr("id")), game.eunoblades.Director.tooltipSection$.find(`#${i.attr("id")}`).remove(), game.eunoblades.Director.tooltipSection$.children("[style*='opacity: 0'], [style*='opacity:0']").each(function() {
              const n = this.id;
              n !== e._displayedTooltipID && (n && game.eunoblades.Director._tooltipElems.delete(n), $(this).remove());
            });
          }
        }
      );
      i.data("revealTimeline", o), this._tooltipElems.set(t.id, i);
    }
    (r = (a = this._tooltipElems.get(t.id)) == null ? void 0 : a.data("revealTimeline")) == null || r.play();
  }
  clearTooltip(t, e = !0) {
    t === this._displayedTooltipID && delete this._displayedTooltipID;
    const a = game.eunoblades.Director._tooltipElems.get(t);
    if (!a)
      return;
    const r = a.data("revealTimeline");
    r.isActive() && !e || r.reverse();
  }
  clearTooltips() {
    eLog.checkLog3("Observer", "Observer Triggered!"), game.eunoblades.Director._tooltipElems.forEach((t) => {
      t.attr("id") !== this._displayedTooltipID && game.eunoblades.Director.clearTooltip(t.attr("id"), !0);
    });
  }
  initTooltipSection() {
    var e;
    const t = this;
    this.clearTooltips(), (e = this._tooltipObserver) == null || e.kill(), this._tooltipObserver = Observer.create({
      type: "touch,pointer",
      // onMove: throttledOnMove,
      onClick() {
        t.clearTooltips();
      }
    });
  }
  // #endregion
};
// #region INITIALIZATION ~
// #region   >>  Single-Instance Factory Construction ~
w(ge, "instance");
let oe = ge;
class L extends Item {
  constructor() {
    super(...arguments);
    w(this, "dialogCSSClasses", "");
  }
  // #region Static Overrides: Create ~
  static async create(e, a = {}) {
    return Array.isArray(e) && (e = e[0]), e.system = e.system ?? {}, eLog.checkLog2("item", "BladesItem.create(data,options)", { data: e, options: a }), e.system.world_name = e.system.world_name ?? e.name.replace(/[^A-Za-z_0-9 ]/g, "").trim().replace(/ /g, "_"), super.create(e, a);
  }
  // #endregion
  // #region BladesDocument Implementation
  static get All() {
    return game.items;
  }
  static Get(e) {
    return e instanceof L ? e : h.isDocID(e) ? L.All.get(e) : L.All.find((a) => a.system.world_name === e) || L.All.find((a) => a.name === e);
  }
  static GetTypeWithTags(e, ...a) {
    return Array.isArray(e) ? e.map((r) => L.All.filter((i) => i.type === r)).flat() : L.All.filter((r) => r.type === e).filter((r) => r.hasTag(...a));
  }
  static IsType(e, ...a) {
    const r = new Set(a);
    return e instanceof L && r.has(e.type);
  }
  get tags() {
    return this.system.tags ?? [];
  }
  hasTag(...e) {
    return e.every((a) => this.tags.includes(a));
  }
  async addTag(...e) {
    const a = this.tags;
    e.forEach((r) => {
      a.includes(r) || a.push(r);
    }), await this.update({ "system.tags": a });
  }
  async remTag(...e) {
    const a = this.tags.filter((r) => !e.includes(r));
    await this.update({ "system.tags": a });
  }
  get tooltip() {
    const e = [
      this.system.concept,
      this.system.rules,
      this.system.notes
    ].filter(Boolean).join("");
    if (e)
      return new Handlebars.SafeString(e).toString();
  }
  getFactorTotal(e) {
    var a, r, i;
    switch (e) {
      case m.tier:
        return L.IsType(this, g.cohort_gang) ? this.system.tier.value + (((a = this.parent) == null ? void 0 : a.getFactorTotal(m.tier)) ?? 0) : L.IsType(this, g.cohort_expert) ? this.system.tier.value + (((r = this.parent) == null ? void 0 : r.getFactorTotal(m.tier)) ?? 0) : L.IsType(this, g.gear) ? this.system.tier.value + (((i = this.parent) == null ? void 0 : i.getFactorTotal(m.tier)) ?? 0) : this.system.tier.value;
      case m.quality: {
        if (L.IsType(this, g.cohort_gang))
          return this.getFactorTotal(m.tier) + (this.system.quality_bonus ?? 0);
        if (L.IsType(this, g.cohort_expert))
          return this.getFactorTotal(m.tier) + (this.system.quality_bonus ?? 0) + 1;
        if (L.IsType(this, g.gear)) {
          let o = this.getFactorTotal(m.tier) + (this.hasTag("Fine") ? 1 : 0);
          return M.IsType(this.parent) && (o += this.parent.getTaggedItemBonuses(this.tags)), o;
        }
        return L.IsType(this, g.design) ? this.system.min_quality : this.getFactorTotal(m.tier);
      }
      case m.scale:
        return L.IsType(this, g.cohort_gang) ? this.getFactorTotal(m.tier) + (this.system.scale_bonus ?? 0) : L.IsType(this, g.cohort_expert) ? 0 + (this.system.scale_bonus ?? 0) : 0;
      case m.magnitude:
        return L.IsType(this, g.ritual) ? this.system.magnitude.value : 0;
      default:
        return 0;
    }
  }
  // #endregion
  // #region BladesItemDocument Implementation
  async archive() {
    return await this.addTag(A.System.Archived), this;
  }
  async unarchive() {
    return await this.remTag(A.System.Archived), this;
  }
  // #endregion
  // #region BladesRoll Implementation
  get rollFactors() {
    const e = {
      [g.cohort_gang]: [m.quality, m.scale],
      [g.cohort_expert]: [m.quality, m.scale],
      [g.gear]: [m.quality],
      [g.project]: [m.quality],
      [g.ritual]: [m.magnitude],
      [g.design]: [m.quality]
    };
    if (!e[this.type])
      return {};
    const a = e[this.type], r = {};
    return (a ?? []).forEach((i, o) => {
      const n = this.getFactorTotal(i);
      r[i] = {
        name: i,
        value: n,
        max: n,
        baseVal: n,
        display: [m.tier, m.quality].includes(i) ? h.romanizeNum(n) : `${n}`,
        isActive: o === 0,
        isPrimary: o === 0,
        isDominant: !1,
        highFavorsPC: !0,
        cssClasses: `factor-gold${o === 0 ? " factor-main" : ""}`
      };
    }), r;
  }
  // #region BladesRoll.PrimaryDoc Implementation
  get rollPrimaryID() {
    return this.id;
  }
  get rollPrimaryDoc() {
    return this;
  }
  get rollPrimaryName() {
    return this.name;
  }
  get rollPrimaryType() {
    if (![
      g.cohort_gang,
      g.cohort_expert,
      g.gm_tracker,
      g.score
    ].includes(this.type))
      throw new Error(`BladesItem of type '${this.type}' ("${this.name}") cannot be RollPrimary.`);
    return this.type;
  }
  get rollPrimaryImg() {
    return this.img;
  }
  get rollPrimaryModsSchemaSet() {
    return _e.ParseDocModsToSchemaSet(this);
  }
  async applyHarm(e, a) {
    if (L.IsType(this, g.cohort_expert, g.cohort_gang)) {
      const r = this.system.harm.value;
      let i;
      e > r ? i = e : i = r + 1;
      const o = ["is Weakened", "is Impaired", "has been Broken", "has been Killed!"], n = [
        "They act with Reduced Effect.",
        "They act with Reduced Effect and suffer -1d to all rolls.",
        "They cannot do anything until they recover.",
        "You may replace them during Downtime."
      ];
      oe.getInstance().pushNotice_SocketCall(
        "ALL",
        {
          title: `${this.name} ${o[i - 1]}`,
          body: n[i - 1],
          type: Te.push,
          cssClasses: "harm-alert"
        }
      ), await this.update({ "system.harm": e });
    }
  }
  async applyWorsePosition() {
    L.IsType(this, g.cohort_expert, g.cohort_gang) && this.setFlag("eunos-blades", "isWorsePosition", !0);
  }
  // #endregion
  // #region BladesRoll.OppositionDoc Implementation
  get rollOppID() {
    return this.id;
  }
  get rollOppDoc() {
    return this;
  }
  get rollOppImg() {
    return this.img;
  }
  get rollOppName() {
    return this.name;
  }
  get rollOppSubName() {
    return "";
  }
  get rollOppType() {
    if (![
      g.cohort_gang,
      g.cohort_expert,
      g.gm_tracker,
      g.score,
      g.location,
      g.project,
      g.design,
      g.ritual
    ].includes(this.type))
      throw new Error(`BladesItem of type '${this.type}' ("${this.name}") cannot be RollOpposition.`);
    return this.type;
  }
  get rollOppModsSchemaSet() {
    return [];
  }
  // #endregion
  // #region BladesRoll.ParticipantDoc Implementation
  get rollParticipantID() {
    return this.id;
  }
  get rollParticipantDoc() {
    return this;
  }
  get rollParticipantIcon() {
    return this.img;
  }
  get rollParticipantName() {
    return this.name;
  }
  get rollParticipantType() {
    if (![
      g.cohort_gang,
      g.cohort_expert,
      g.gm_tracker
    ].includes(this.type))
      throw new Error(`BladesItem of type '${this.type}' ("${this.name}") cannot be RollParticipant.`);
    return this.type;
  }
  get rollParticipantModsSchemaSet() {
    return [];
  }
  // #endregion
  // #endregion
  // #region PREPARING DERIVED DATA
  prepareDerivedData() {
    super.prepareDerivedData(), L.IsType(this, g.cohort_gang, g.cohort_expert) && this._prepareCohortData(this.system), L.IsType(this, g.crew_playbook) && this._preparePlaybookData(this.system), L.IsType(this, g.gear) && this._prepareGearData(this.system), L.IsType(this, g.playbook) && this._preparePlaybookData(this.system);
  }
  _prepareCohortData(e) {
    if (!L.IsType(this, g.cohort_gang, g.cohort_expert))
      return;
    e.tier.name = "Quality";
    const a = h.unique(Object.values(e.subtypes).map((i) => i.trim()).filter((i) => /[A-Za-z]/.test(i))), r = [
      ...Object.values(e.elite_subtypes)
    ];
    if (de.IsType(this.parent) && r.push(
      ...this.parent.upgrades.filter((i) => (i.name ?? "").startsWith("Elite")).map((i) => (i.name ?? "").trim().replace(/^Elite /, ""))
    ), e.subtypes = Object.fromEntries(a.map((i, o) => [`${o + 1}`, i])), e.elite_subtypes = Object.fromEntries(
      h.unique(
        r.map((i) => i.trim()).filter((i) => /[A-Za-z]/.test(i) && a.includes(i))
      ).map((i, o) => [`${o + 1}`, i])
    ), e.edges = Object.fromEntries(Object.values(e.edges ?? []).filter((i) => /[A-Za-z]/.test(i)).map((i, o) => [`${o + 1}`, i.trim()])), e.flaws = Object.fromEntries(Object.values(e.flaws ?? []).filter((i) => /[A-Za-z]/.test(i)).map((i, o) => [`${o + 1}`, i.trim()])), e.quality = this.getFactorTotal(m.quality), L.IsType(this, g.cohort_gang)) {
      if ([...a, ...r].includes(A.GangType.Vehicle))
        e.scale = this.getFactorTotal(m.scale), e.scaleExample = "(1 vehicle)";
      else {
        e.scale = this.getFactorTotal(m.scale);
        const i = Math.min(6, e.scale);
        e.scaleExample = v.ScaleExamples[i], e.subtitle = v.ScaleSizes[i];
      }
      a.length + r.length === 0 && (e.subtitle = e.subtitle.replace(/\s+of\b/g, "").trim());
    } else
      e.scale = 0, e.scaleExample = [...a, ...r].includes("Pet") ? "(1 animal)" : "(1 person)", e.subtitle = "An Expert";
    a.length + r.length > 0 && ([...a, ...r].includes(A.GangType.Vehicle) ? e.subtitle = v.VehicleDescriptors[Math.min(6, this.getFactorTotal(m.tier))] : e.subtitle += ` ${h.oxfordize([
      ...a.filter((i) => !r.includes(i)),
      ...r.map((i) => `Elite ${i}`)
    ], !1, "&")}`);
  }
  _prepareGearData(e) {
    L.IsType(this, g.gear) && (e.tier.name = "Quality");
  }
  _preparePlaybookData(e) {
    if (!L.IsType(this, g.playbook, g.crew_playbook))
      return;
    const a = {};
    if ([...Object.values(e.experience_clues).filter((r) => /[A-Za-z]/.test(r)), " "].forEach((r, i) => {
      a[(i + 1).toString()] = r;
    }), e.experience_clues = a, L.IsType(this, g.playbook)) {
      const r = {};
      [...Object.values(e.gather_info_questions).filter((i) => /[A-Za-z]/.test(i)), " "].forEach((i, o) => {
        r[(o + 1).toString()] = i;
      }), e.gather_info_questions = r;
    }
  }
  // #endregion
  // Unlock lower-level update method for subclasses
  async callOnUpdate(...e) {
    await this._onUpdate(...e);
  }
}
const k = L, Ee = {}, tt = {
  addItem: async (s, t, e, a = !1) => {
    if (eLog.checkLog("activeEffects", "addItem", { actor: s, funcData: t, isReversing: a }), s.hasActiveSubItemOf(t)) {
      if (a)
        return s.remSubItem(t);
    } else if (!a)
      return s.addSubItem(t);
  },
  addIfChargen: async (s, t, e, a = !1) => {
    var o;
    if (eLog.checkLog("activeEffects", "addIfChargen", { actor: s, funcData: t, isReversing: a }), !a && ((o = game.eunoblades.Tracker) == null ? void 0 : o.system.phase) !== N.CharGen)
      return;
    const [r, i] = t.split(/:/);
    if (a) {
      await s.update({ [r]: h.pInt(getProperty(s, r)) - h.pInt(i) });
      return;
    }
    await s.update({ [r]: h.pInt(getProperty(s, r)) + h.pInt(i) });
  },
  upgradeIfChargen: async (s, t, e, a = !1) => {
    var o;
    if (eLog.checkLog("activeEffects", "upgradeIfChargen", { actor: s, funcData: t, isReversing: a }), !a && ((o = game.eunoblades.Tracker) == null ? void 0 : o.system.phase) !== N.CharGen)
      return;
    const [r, i] = t.split(/:/);
    getProperty(s, r) < h.pInt(i) && await s.update({ [r]: h.pInt(i) });
  },
  APPLYTOMEMBERS: async () => {
  },
  APPLYTOCOHORTS: async () => {
  },
  remItem: async (s, t, e, a = !1) => {
    function r(i, o) {
      return o.startsWith("rX") ? new RegExp(o.replace(/^rX:\/(.*?)\//, "$1")).test(i) : i === o;
    }
    if (t.startsWith("{")) {
      if (a) {
        console.error("Cannot reverse a 'remItem' custom effect that was defined with a JSON object.");
        return;
      }
      const { type: i, tags: o, name: n } = JSON.parse(t);
      let l = s.activeSubItems;
      if (l.length === 0 || (n && (l = l.filter((c) => r(c.name, n))), l.length === 0) || (i && (l = l.filter((c) => r(c.type, i))), l.length === 0) || (o && (l = l.filter((c) => c.hasTag(...o))), l.length === 0))
        return;
      eLog.checkLog("activeEffects", "remItem - JSON OBJECT", { actor: s, funcData: JSON.parse(t), isReversing: a, activeSubItems: l }), l.forEach((c) => s.remSubItem(c));
    }
    if (eLog.checkLog("activeEffects", "remItem", { actor: s, funcData: t, isReversing: a }), s.hasActiveSubItemOf(t))
      return s.remSubItem(t);
    if (a)
      return s.addSubItem(t);
  }
};
class ve extends ActiveEffect {
  static Initialize() {
    CONFIG.ActiveEffect.documentClass = ve, Hooks.on("preCreateActiveEffect", async (t) => {
      var r;
      if (eLog.checkLog3("effect", "PRECREATE ActiveEffect", { effect: t, parent: (r = t.parent) == null ? void 0 : r.name }), !(t.parent instanceof I))
        return;
      if (t.changes.some((i) => i.key === "APPLYTOMEMBERS")) {
        if (I.IsType(t.parent, b.pc) && I.IsType(t.parent.crew, b.crew)) {
          const i = t.parent.crew.members.filter((o) => {
            var n;
            return o.id !== ((n = t.parent) == null ? void 0 : n.id);
          });
          i.length > 0 && (t.changes = t.changes.filter((o) => o.key !== "APPLYTOMEMBERS"), await Promise.all(i.map(async (o) => o.createEmbeddedDocuments("ActiveEffect", [t.toJSON()]))), await t.parent.setFlag("eunos-blades", `memberEffects.${t.id}`, {
            appliedTo: i.map((o) => o.id),
            effect: t.toJSON()
          }));
        } else if (I.IsType(t.parent, b.crew)) {
          const i = h.pullElement(t.changes, (o) => o.key === "APPLYTOMEMBERS");
          if (!i)
            return;
          t.parent.members.length > 0 && await Promise.all(t.parent.members.map(async (o) => o.createEmbeddedDocuments("ActiveEffect", [t.toJSON()]))), await t.parent.setFlag("eunos-blades", `memberEffects.${t.id}`, {
            appliedTo: t.parent.members.map((o) => o.id),
            effect: t
          }), await t.updateSource({ changes: [i] });
        }
      } else
        t.changes.some((i) => i.key === "APPLYTOCOHORTS") && (I.IsType(t.parent, b.pc) || I.IsType(t.parent, b.crew)) && (t.parent.cohorts.length > 0 && await Promise.all(t.parent.cohorts.map(async (i) => i.createEmbeddedDocuments("ActiveEffect", [t.toJSON()]))), await t.parent.setFlag("eunos-blades", `cohortEffects.${t.id}`, {
          appliedTo: t.parent.cohorts.map((i) => i.id),
          effect: t
        }), await t.updateSource({ changes: t.changes.filter((i) => i.key === "APPLYTOCOHORTS") }));
      const [e, a] = h.partition(t.changes, (i) => i.key.startsWith("perm"));
      await t.updateSource({ changes: a });
      for (const i of e) {
        const { key: o, value: n } = i, l = o.replace(/^perm/, "");
        if (l in tt) {
          const c = {
            funcName: l,
            funcData: n,
            isReversing: !1,
            effect: t
          };
          ve.ThrottleCustomFunc(t.parent, c);
        } else if (l === "Add") {
          const [c, d] = n.split(/:/);
          t.parent.update({ [c]: h.pInt(getProperty(t.parent, c)) + h.pInt(d) });
        }
      }
    }), Hooks.on("applyActiveEffect", (t, e) => {
      if (t instanceof I && e.key in tt) {
        const a = {
          funcName: e.key,
          funcData: e.value,
          isReversing: !1,
          effect: e.effect
        };
        ve.ThrottleCustomFunc(t, a);
      }
    }), Hooks.on("updateActiveEffect", (t, { disabled: e }) => {
      if (!(t.parent instanceof I))
        return;
      t.changes.filter((r) => r.mode === 0).forEach(({ key: r, value: i }) => {
        const o = {
          funcName: r,
          funcData: i,
          isReversing: e,
          effect: t
        };
        ve.ThrottleCustomFunc(t.parent, o);
      });
    }), Hooks.on("deleteActiveEffect", async (t) => {
      if (!(t.parent instanceof I))
        return;
      if (t.changes.some((a) => a.key === "APPLYTOMEMBERS"))
        if (I.IsType(t.parent, b.pc) && I.IsType(t.parent.crew, b.crew)) {
          const a = t.parent.crew.members.filter((r) => {
            var i;
            return r.id !== ((i = t.parent) == null ? void 0 : i.id);
          });
          a.length > 0 && await Promise.all(a.map(async (r) => Promise.all(r.effects.filter((i) => i.name === t.name).map(async (i) => i.delete())))), await t.parent.unsetFlag("eunos-blades", `memberEffects.${t.id}`);
        } else
          I.IsType(t.parent, b.crew) && (t.parent.members.length > 0 && await Promise.all(t.parent.members.map(async (a) => Promise.all(a.effects.filter((r) => r.name === t.name).map(async (r) => r.delete())))), await t.parent.unsetFlag("eunos-blades", `memberEffects.${t.id}`));
      else
        t.changes.some((a) => a.key === "APPLYTOCOHORTS") && I.IsType(t.parent, b.pc, b.crew) && (t.parent.cohorts.length > 0 && await Promise.all(t.parent.cohorts.map(async (a) => Promise.all(a.effects.filter((r) => r.name === t.name).map(async (r) => r.delete())))), await t.parent.unsetFlag("eunos-blades", `cohortEffects.${t.id}`));
      t.changes.filter((a) => a.mode === 0).forEach(({ key: a, value: r }) => {
        const i = {
          funcName: a,
          funcData: r,
          isReversing: !0,
          effect: t
        };
        ve.ThrottleCustomFunc(t.parent, i);
      });
    });
  }
  static async AddActiveEffect(t, e, a, r = "systems/eunos-blades/assets/icons/effect-icons/default.png") {
    const i = [a].flat();
    await t.createEmbeddedDocuments("ActiveEffect", [{ name: e, icon: r, changes: i }]);
  }
  static ThrottleCustomFunc(t, e) {
    const { funcName: a, funcData: r, isReversing: i, effect: o } = e;
    if (t.id) {
      if (eLog.checkLog3("activeEffect", `Throttling Func: ${a}(${r}, ${i})`), t.id && t.id in Ee) {
        const n = Ee[t.id].queue.find((l) => JSON.stringify(l) === JSON.stringify(e));
        if (eLog.checkLog("activeEffects", "... Checking Queue", { data: e, FUNCQUEUE: Ee[t.id], matchingQueue: n }), n) {
          eLog.error("... Function ALREADY QUEUED, SKIPPING");
          return;
        }
        Ee[t.id].queue.push(e);
        return;
      }
      eLog.checkLog3("activeEffect", "... Creating New FUNCQUEUE, RUNNING:"), Ee[t.id] = {
        curFunc: ve.RunCustomFunc(t, tt[a](t, r, o, i)),
        queue: []
      };
    }
  }
  static async RunCustomFunc(t, e) {
    if (t.id)
      if (eLog.checkLog("activeEffects", "... Running Func ..."), await e, eLog.checkLog("activeEffects", "... Function Complete!"), Ee[t.id].queue.length) {
        const { funcName: a, funcData: r, isReversing: i, effect: o } = Ee[t.id].queue.shift() ?? {};
        if (!a || !(a in tt) || !r)
          return;
        eLog.checkLog3("activeEffect", `Progressing Queue: ${a}(${r}, ${i}) -- ${Ee[t.id].queue.length} remaining funcs.`), Ee[t.id].curFunc = ve.RunCustomFunc(
          t,
          tt[a](t, r, o, i)
        );
      } else
        eLog.checkLog3("activeEffect", "Function Queue Complete! Deleting."), delete Ee[t.id];
  }
  /**
   * Manage Active Effect instances through the Actor Sheet via effect control buttons.
   * @param {MouseEvent} event      The left-click event on the effect control
   * @param {Actor|Item} owner      The owning entity which manages this effect
   */
  static onManageActiveEffect(t, e) {
    var o;
    t.preventDefault();
    const a = t.currentTarget;
    if (a.dataset.action === "create")
      return e.createEmbeddedDocuments("ActiveEffect", [{
        name: e.name,
        icon: e.img,
        origin: e.uuid
      }]);
    const r = a.closest("tr");
    if (r === null)
      return null;
    const i = r.dataset.effectId ? e.effects.get(r.dataset.effectId) : null;
    if (!i)
      return null;
    switch (a.dataset.action) {
      case "edit":
        return (o = i.sheet) == null ? void 0 : o.render(!0);
      case "delete":
        return eLog.checkLog("activeEffects", "delete effect"), i.delete();
      case "toggle":
        return i.update({ disabled: !i.disabled });
      default:
        return null;
    }
  }
  async _preCreate(t, e, a) {
    eLog.checkLog3("effect", "ActiveEffect._preCreate()", { data: t, options: e, user: a }), await super._preCreate(t, e, a);
  }
  _onDelete(t, e) {
    eLog.checkLog3("effect", "ActiveEffect._onDelete()", { options: t, userID: e }), super._onDelete(t, e);
  }
  get isSuppressed() {
    if (!/Actor.*Item/.test(this.origin))
      return super.isSuppressed;
    const [t, e] = this.origin.replace(/Actor\.|Item\./g, "").split("."), r = game.actors.get(t).items.get(e);
    return super.isSuppressed || (r == null ? void 0 : r.hasTag(A.System.Archived));
  }
}
function Ds(s, t) {
  var e = Object.keys(s);
  if (Object.getOwnPropertySymbols) {
    var a = Object.getOwnPropertySymbols(s);
    t && (a = a.filter(function(r) {
      return Object.getOwnPropertyDescriptor(s, r).enumerable;
    })), e.push.apply(e, a);
  }
  return e;
}
function lt(s) {
  for (var t = 1; t < arguments.length; t++) {
    var e = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Ds(Object(e), !0).forEach(function(a) {
      Mi(s, a, e[a]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(s, Object.getOwnPropertyDescriptors(e)) : Ds(Object(e)).forEach(function(a) {
      Object.defineProperty(s, a, Object.getOwnPropertyDescriptor(e, a));
    });
  }
  return s;
}
function Mi(s, t, e) {
  return t = _i(t), t in s ? Object.defineProperty(s, t, {
    value: e,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : s[t] = e, s;
}
function xi(s, t) {
  if (typeof s != "object" || s === null)
    return s;
  var e = s[Symbol.toPrimitive];
  if (e !== void 0) {
    var a = e.call(s, t || "default");
    if (typeof a != "object")
      return a;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(s);
}
function _i(s) {
  var t = xi(s, "string");
  return typeof t == "symbol" ? t : String(t);
}
const st = (s, t, e, a) => (s = "" + s, t = "" + t, a && (s = s.trim(), t = t.trim()), e ? s == t : s.toLowerCase() == t.toLowerCase()), Es = (s, t) => s && Array.isArray(s) && s.map((e) => Xt(e, t));
function Xt(s, t) {
  var e = {}, a;
  for (a in s)
    t.indexOf(a) < 0 && (e[a] = s[a]);
  return e;
}
function Ps(s) {
  var t = document.createElement("div");
  return s.replace(/\&#?[0-9a-z]+;/gi, function(e) {
    return t.innerHTML = e, t.innerText;
  });
}
function Wt(s) {
  var t = new DOMParser(), e = t.parseFromString(s.trim(), "text/html");
  return e.body.firstElementChild;
}
function Li(s) {
  return s ? s.replace(/\>[\r\n ]+\</g, "><").replace(/(<.*?>)|\s+/g, (t, e) => e || " ") : "";
}
function $i(s) {
  for (var t = document.createNodeIterator(s, NodeFilter.SHOW_TEXT, null, !1), e; e = t.nextNode(); )
    e.textContent.trim() || e.parentNode.removeChild(e);
}
function Os(s, t) {
  for (t = t || "previous"; s = s[t + "Sibling"]; )
    if (s.nodeType == 3)
      return s;
}
function He(s) {
  return typeof s == "string" ? s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/`|'/g, "&#039;") : s;
}
function xe(s) {
  var t = Object.prototype.toString.call(s).split(" ")[1].slice(0, -1);
  return s === Object(s) && t != "Array" && t != "Function" && t != "RegExp" && t != "HTMLUnknownElement";
}
function U(s, t, e) {
  s instanceof Object || (s = {}), a(s, t), e && a(s, e);
  function a(r, i) {
    for (var o in i)
      if (i.hasOwnProperty(o)) {
        if (xe(i[o])) {
          xe(r[o]) ? a(r[o], i[o]) : r[o] = Object.assign({}, i[o]);
          continue;
        }
        if (Array.isArray(i[o])) {
          r[o] = Object.assign([], i[o]);
          continue;
        }
        r[o] = i[o];
      }
  }
  return s;
}
function Ms() {
  const s = [], t = {};
  for (let e of arguments)
    for (let a of e)
      xe(a) ? t[a.value] || (s.push(a), t[a.value] = 1) : s.includes(a) || s.push(a);
  return s;
}
function wt(s) {
  if (!String.prototype.normalize)
    return s;
  if (typeof s == "string")
    return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}
function Ri(s) {
  var t, e = s.cloneNode(!0);
  return e.style.cssText = "position:fixed; top:-9999px; opacity:0", document.body.appendChild(e), t = e.clientHeight, e.parentNode.removeChild(e), t;
}
var xs = () => /(?=.*chrome)(?=.*android)/i.test(navigator.userAgent);
function _s() {
  return ("10000000-1000-4000-8000" + -1e11).replace(/[018]/g, (s) => (s ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> s / 4).toString(16));
}
function je(s) {
  return s && s.classList && s.classList.contains(this.settings.classNames.tag);
}
function Fi() {
  const s = document.getSelection();
  if (s.rangeCount) {
    const t = s.getRangeAt(0), e = t.startContainer, a = t.startOffset;
    let r, i;
    if (a > 0)
      return i = document.createRange(), i.setStart(e, a - 1), i.setEnd(e, a), r = i.getBoundingClientRect(), {
        left: r.right,
        top: r.top,
        bottom: r.bottom
      };
    if (e.getBoundingClientRect)
      return e.getBoundingClientRect();
  }
  return {
    left: -9999,
    top: -9999
  };
}
function Oa(s, t) {
  var e = window.getSelection();
  return t = t || e.getRangeAt(0), typeof s == "string" && (s = document.createTextNode(s)), t && (t.deleteContents(), t.insertNode(s)), s;
}
function V(s, t, e) {
  return s ? (t && (s.__tagifyTagData = e ? t : U({}, s.__tagifyTagData || {}, t)), s.__tagifyTagData) : (console.warn("tag element doesn't exist", s, t), t);
}
var jt = {
  delimiters: ",",
  // [RegEx] split tags by any of these delimiters ("null" to cancel) Example: ",| |."
  pattern: null,
  // RegEx pattern to validate input by. Ex: /[1-9]/
  tagTextProp: "value",
  // tag data Object property which will be displayed as the tag's text
  maxTags: 1 / 0,
  // Maximum number of tags
  callbacks: {},
  // Exposed callbacks object to be triggered on certain events
  addTagOnBlur: !0,
  // automatically adds the text which was inputed as a tag when blur event happens
  onChangeAfterBlur: !0,
  // By default, the native way of inputs' onChange events is kept, and it only fires when the field is blured.
  duplicates: !1,
  // "true" - allow duplicate tags
  whitelist: [],
  // Array of tags to suggest as the user types (can be used along with "enforceWhitelist" setting)
  blacklist: [],
  // A list of non-allowed tags
  enforceWhitelist: !1,
  // Only allow tags from the whitelist
  userInput: !0,
  // disable manually typing/pasting/editing tags (tags may only be added from the whitelist)
  keepInvalidTags: !1,
  // if true, do not remove tags which did not pass validation
  createInvalidTags: !0,
  // if false, do not create invalid tags from invalid user input
  mixTagsAllowedAfter: /,|\.|\:|\s/,
  // RegEx - Define conditions in which mix-tags content allows a tag to be added after
  mixTagsInterpolator: ["[[", "]]"],
  // Interpolation for mix mode. Everything between these will become a tag, if is a valid Object
  backspace: !0,
  // false / true / "edit"
  skipInvalid: !1,
  // If `true`, do not add invalid, temporary, tags before automatically removing them
  pasteAsTags: !0,
  // automatically converts pasted text into tags. if "false", allows for further text editing
  editTags: {
    clicks: 2,
    // clicks to enter "edit-mode": 1 for single click. any other value is considered as double-click
    keepInvalid: !0
    // keeps invalid edits as-is until `esc` is pressed while in focus
  },
  // 1 or 2 clicks to edit a tag. false/null for not allowing editing
  transformTag: () => {
  },
  // Takes a tag input string as argument and returns a transformed value
  trim: !0,
  // whether or not the value provided should be trimmed, before being added as a tag
  a11y: {
    focusableTags: !1
  },
  mixMode: {
    insertAfterTag: " "
    // String/Node to inject after a tag has been added (see #588)
  },
  autoComplete: {
    enabled: !0,
    // Tries to suggest the input's value while typing (match from whitelist) by adding the rest of term as grayed-out text
    rightKey: !1
    // If `true`, when Right key is pressed, use the suggested value to create a tag, else just auto-completes the input. in mixed-mode this is set to "true"
  },
  classNames: {
    namespace: "tagify",
    mixMode: "tagify--mix",
    selectMode: "tagify--select",
    input: "tagify__input",
    focus: "tagify--focus",
    tagNoAnimation: "tagify--noAnim",
    tagInvalid: "tagify--invalid",
    tagNotAllowed: "tagify--notAllowed",
    scopeLoading: "tagify--loading",
    hasMaxTags: "tagify--hasMaxTags",
    hasNoTags: "tagify--noTags",
    empty: "tagify--empty",
    inputInvalid: "tagify__input--invalid",
    dropdown: "tagify__dropdown",
    dropdownWrapper: "tagify__dropdown__wrapper",
    dropdownHeader: "tagify__dropdown__header",
    dropdownFooter: "tagify__dropdown__footer",
    dropdownItem: "tagify__dropdown__item",
    dropdownItemActive: "tagify__dropdown__item--active",
    dropdownItemHidden: "tagify__dropdown__item--hidden",
    dropdownInital: "tagify__dropdown--initial",
    tag: "tagify__tag",
    tagText: "tagify__tag-text",
    tagX: "tagify__tag__removeBtn",
    tagLoading: "tagify__tag--loading",
    tagEditing: "tagify__tag--editable",
    tagFlash: "tagify__tag--flash",
    tagHide: "tagify__tag--hide"
  },
  dropdown: {
    classname: "",
    enabled: 2,
    // minimum input characters to be typed for the suggestions dropdown to show
    maxItems: 10,
    searchKeys: ["value", "searchBy"],
    fuzzySearch: !0,
    caseSensitive: !1,
    accentedSearch: !0,
    includeSelectedTags: !1,
    // Should the suggestions list Include already-selected tags (after filtering)
    highlightFirst: !1,
    // highlights first-matched item in the list
    closeOnSelect: !0,
    // closes the dropdown after selecting an item, if `enabled:0` (which means always show dropdown)
    clearOnSelect: !0,
    // after selecting a suggetion, should the typed text input remain or be cleared
    position: "all",
    // 'manual' / 'text' / 'all'
    appendTarget: null
    // defaults to document.body once DOM has been loaded
  },
  hooks: {
    beforeRemoveTag: () => Promise.resolve(),
    beforePaste: () => Promise.resolve(),
    suggestionClick: () => Promise.resolve()
  }
};
function Ni() {
  this.dropdown = {};
  for (let s in this._dropdown)
    this.dropdown[s] = typeof this._dropdown[s] == "function" ? this._dropdown[s].bind(this) : this._dropdown[s];
  this.dropdown.refs();
}
var Hi = {
  refs() {
    this.DOM.dropdown = this.parseTemplate("dropdown", [this.settings]), this.DOM.dropdown.content = this.DOM.dropdown.querySelector("[data-selector='tagify-suggestions-wrapper']");
  },
  getHeaderRef() {
    return this.DOM.dropdown.querySelector("[data-selector='tagify-suggestions-header']");
  },
  getFooterRef() {
    return this.DOM.dropdown.querySelector("[data-selector='tagify-suggestions-footer']");
  },
  getAllSuggestionsRefs() {
    return [...this.DOM.dropdown.content.querySelectorAll(this.settings.classNames.dropdownItemSelector)];
  },
  /**
   * shows the suggestions select box
   * @param {String} value [optional, filter the whitelist by this value]
   */
  show(s) {
    var t = this.settings, e, a, r = t.mode == "mix" && !t.enforceWhitelist, i = !t.whitelist || !t.whitelist.length, o, n = t.dropdown.position == "manual";
    if (s = s === void 0 ? this.state.inputText : s, !(i && !r && !t.templates.dropdownItemNoMatch || t.dropdown.enable === !1 || this.state.isLoading || this.settings.readonly)) {
      if (clearTimeout(this.dropdownHide__bindEventsTimeout), this.suggestedListItems = this.dropdown.filterListItems(s), s && !this.suggestedListItems.length && (this.trigger("dropdown:noMatch", s), t.templates.dropdownItemNoMatch && (o = t.templates.dropdownItemNoMatch.call(this, {
        value: s
      }))), !o) {
        if (this.suggestedListItems.length)
          s && r && !this.state.editing.scope && !st(this.suggestedListItems[0].value, s) && this.suggestedListItems.unshift({
            value: s
          });
        else if (s && r && !this.state.editing.scope)
          this.suggestedListItems = [{
            value: s
          }];
        else {
          this.input.autocomplete.suggest.call(this), this.dropdown.hide();
          return;
        }
        e = this.suggestedListItems[0], a = "" + (xe(e) ? e.value : e), t.autoComplete && a && a.indexOf(s) == 0 && this.input.autocomplete.suggest.call(this, e);
      }
      this.dropdown.fill(o), t.dropdown.highlightFirst && this.dropdown.highlightOption(this.DOM.dropdown.content.querySelector(t.classNames.dropdownItemSelector)), this.state.dropdown.visible || setTimeout(this.dropdown.events.binding.bind(this)), this.state.dropdown.visible = s || !0, this.state.dropdown.query = s, this.setStateSelection(), n || setTimeout(() => {
        this.dropdown.position(), this.dropdown.render();
      }), setTimeout(() => {
        this.trigger("dropdown:show", this.DOM.dropdown);
      });
    }
  },
  /**
   * Hides the dropdown (if it's not managed manually by the developer)
   * @param {Boolean} overrideManual
   */
  hide(s) {
    var t = this.DOM, e = t.scope, a = t.dropdown, r = this.settings.dropdown.position == "manual" && !s;
    if (!(!a || !document.body.contains(a) || r))
      return window.removeEventListener("resize", this.dropdown.position), this.dropdown.events.binding.call(this, !1), e.setAttribute("aria-expanded", !1), a.parentNode.removeChild(a), setTimeout(() => {
        this.state.dropdown.visible = !1;
      }, 100), this.state.dropdown.query = this.state.ddItemData = this.state.ddItemElm = this.state.selection = null, this.state.tag && this.state.tag.value.length && (this.state.flaggedTags[this.state.tag.baseOffset] = this.state.tag), this.trigger("dropdown:hide", a), this;
  },
  /**
   * Toggles dropdown show/hide
   * @param {Boolean} show forces the dropdown to show
   */
  toggle(s) {
    this.dropdown[this.state.dropdown.visible && !s ? "hide" : "show"]();
  },
  render() {
    var s = Ri(this.DOM.dropdown), t = this.settings, e = typeof t.dropdown.enabled == "number" && t.dropdown.enabled >= 0;
    return e ? (this.DOM.scope.setAttribute("aria-expanded", !0), document.body.contains(this.DOM.dropdown) || (this.DOM.dropdown.classList.add(t.classNames.dropdownInital), this.dropdown.position(s), t.dropdown.appendTarget.appendChild(this.DOM.dropdown), setTimeout(() => this.DOM.dropdown.classList.remove(t.classNames.dropdownInital))), this) : this;
  },
  /**
   * re-renders the dropdown content element (see "dropdownContent" in templates file)
   * @param {String/Array} HTMLContent - optional
   */
  fill(s) {
    s = typeof s == "string" ? s : this.dropdown.createListHTML(s || this.suggestedListItems);
    var t = this.settings.templates.dropdownContent.call(this, s);
    this.DOM.dropdown.content.innerHTML = Li(t);
  },
  /**
   * Re-renders only the header & footer.
   * Used when selecting a suggestion and it is wanted that the suggestions dropdown stays open.
   * Since the list of sugegstions is not being re-rendered completely every time a suggestion is selected (the item is transitioned-out)
   * then the header & footer should be kept in sync with the suggestions data change
   */
  fillHeaderFooter() {
    var s = this.dropdown.filterListItems(this.state.dropdown.query), t = this.parseTemplate("dropdownHeader", [s]), e = this.parseTemplate("dropdownFooter", [s]), a = this.dropdown.getHeaderRef(), r = this.dropdown.getFooterRef();
    t && (a == null || a.parentNode.replaceChild(t, a)), e && (r == null || r.parentNode.replaceChild(e, r));
  },
  /**
   * fill data into the suggestions list
   * (mainly used to update the list when removing tags while the suggestions dropdown is visible, so they will be re-added to the list. not efficient)
   */
  refilter(s) {
    s = s || this.state.dropdown.query || "", this.suggestedListItems = this.dropdown.filterListItems(s), this.dropdown.fill(), this.suggestedListItems.length || this.dropdown.hide(), this.trigger("dropdown:updated", this.DOM.dropdown);
  },
  position(s) {
    var t = this.settings.dropdown;
    if (t.position == "manual")
      return;
    var e, a, r, i, o, n, l = this.DOM.dropdown, c = t.placeAbove, d = t.appendTarget === document.body, p = d ? window.pageYOffset : t.appendTarget.scrollTop, u = document.fullscreenElement || document.webkitFullscreenElement || document.documentElement, f = u.clientHeight, y = Math.max(u.clientWidth || 0, window.innerWidth || 0), S = y > 480 ? t.position : "all", D = this.DOM[S == "input" ? "input" : "scope"];
    s = s || l.clientHeight;
    function O(E) {
      for (var Y = 0, ce = 0; E && E != u; )
        Y += E.offsetLeft || 0, ce += E.offsetTop || 0, E = E.parentNode;
      return {
        left: Y,
        top: ce
      };
    }
    function q() {
      for (var E = 0, Y = t.appendTarget.parentNode; Y; )
        E += Y.scrollTop || 0, Y = Y.parentNode;
      return E;
    }
    if (this.state.dropdown.visible) {
      if (S == "text" ? (e = Fi(), r = e.bottom, a = e.top, i = e.left, o = "auto") : (n = O(t.appendTarget), e = D.getBoundingClientRect(), a = e.top - n.top, r = e.bottom - 1 - n.top, i = e.left - n.left, o = e.width + "px"), !d) {
        let E = q();
        a += E, r += E;
      }
      a = Math.floor(a), r = Math.ceil(r), c = c === void 0 ? f - e.bottom < s : c, l.style.cssText = "left:" + (i + window.pageXOffset) + "px; width:" + o + ";" + (c ? "top: " + (a + p) + "px" : "top: " + (r + p) + "px"), l.setAttribute("placement", c ? "top" : "bottom"), l.setAttribute("position", S);
    }
  },
  events: {
    /**
     * Events should only be binded when the dropdown is rendered and removed when isn't
     * because there might be multiple Tagify instances on a certain page
     * @param  {Boolean} bindUnbind [optional. true when wanting to unbind all the events]
     */
    binding() {
      let s = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : !0;
      var t = this.dropdown.events.callbacks, e = this.listeners.dropdown = this.listeners.dropdown || {
        position: this.dropdown.position.bind(this, null),
        onKeyDown: t.onKeyDown.bind(this),
        onMouseOver: t.onMouseOver.bind(this),
        onMouseLeave: t.onMouseLeave.bind(this),
        onClick: t.onClick.bind(this),
        onScroll: t.onScroll.bind(this)
      }, a = s ? "addEventListener" : "removeEventListener";
      this.settings.dropdown.position != "manual" && (document[a]("scroll", e.position, !0), window[a]("resize", e.position), window[a]("keydown", e.onKeyDown)), this.DOM.dropdown[a]("mouseover", e.onMouseOver), this.DOM.dropdown[a]("mouseleave", e.onMouseLeave), this.DOM.dropdown[a]("mousedown", e.onClick), this.DOM.dropdown.content[a]("scroll", e.onScroll);
    },
    callbacks: {
      onKeyDown(s) {
        if (!(!this.state.hasFocus || this.state.composing)) {
          var t = this.DOM.dropdown.querySelector(this.settings.classNames.dropdownItemActiveSelector), e = this.dropdown.getSuggestionDataByNode(t);
          switch (s.key) {
            case "ArrowDown":
            case "ArrowUp":
            case "Down":
            case "Up": {
              s.preventDefault();
              var a = this.dropdown.getAllSuggestionsRefs(), r = s.key == "ArrowUp" || s.key == "Up";
              t && (t = this.dropdown.getNextOrPrevOption(t, !r)), (!t || !t.matches(this.settings.classNames.dropdownItemSelector)) && (t = a[r ? a.length - 1 : 0]), this.dropdown.highlightOption(t, !0);
              break;
            }
            case "Escape":
            case "Esc":
              this.dropdown.hide();
              break;
            case "ArrowRight":
              if (this.state.actions.ArrowLeft)
                return;
            case "Tab": {
              if (this.settings.mode != "mix" && t && !this.settings.autoComplete.rightKey && !this.state.editing) {
                s.preventDefault();
                var i = this.dropdown.getMappedValue(e);
                return this.input.autocomplete.set.call(this, i), !1;
              }
              return !0;
            }
            case "Enter": {
              s.preventDefault(), this.settings.hooks.suggestionClick(s, {
                tagify: this,
                tagData: e,
                suggestionElm: t
              }).then(() => {
                if (t) {
                  this.dropdown.selectOption(t), t = this.dropdown.getNextOrPrevOption(t, !r), this.dropdown.highlightOption(t);
                  return;
                } else
                  this.dropdown.hide();
                this.settings.mode != "mix" && this.addTags(this.state.inputText.trim(), !0);
              }).catch((o) => o);
              break;
            }
            case "Backspace": {
              if (this.settings.mode == "mix" || this.state.editing.scope)
                return;
              const o = this.input.raw.call(this);
              (o == "" || o.charCodeAt(0) == 8203) && (this.settings.backspace === !0 ? this.removeTags() : this.settings.backspace == "edit" && setTimeout(this.editTag.bind(this), 0));
            }
          }
        }
      },
      onMouseOver(s) {
        var t = s.target.closest(this.settings.classNames.dropdownItemSelector);
        t && this.dropdown.highlightOption(t);
      },
      onMouseLeave(s) {
        this.dropdown.highlightOption();
      },
      onClick(s) {
        if (!(s.button != 0 || s.target == this.DOM.dropdown || s.target == this.DOM.dropdown.content)) {
          var t = s.target.closest(this.settings.classNames.dropdownItemSelector), e = this.dropdown.getSuggestionDataByNode(t);
          this.state.actions.selectOption = !0, setTimeout(() => this.state.actions.selectOption = !1, 50), this.settings.hooks.suggestionClick(s, {
            tagify: this,
            tagData: e,
            suggestionElm: t
          }).then(() => {
            t ? this.dropdown.selectOption(t, s) : this.dropdown.hide();
          }).catch((a) => console.warn(a));
        }
      },
      onScroll(s) {
        var t = s.target, e = t.scrollTop / (t.scrollHeight - t.parentNode.clientHeight) * 100;
        this.trigger("dropdown:scroll", {
          percentage: Math.round(e)
        });
      }
    }
  },
  /**
   * Given a suggestion-item, return the data associated with it
   * @param {HTMLElement} tagElm
   * @returns Object
   */
  getSuggestionDataByNode(s) {
    var t = s && s.getAttribute("value");
    return this.suggestedListItems.find((e) => e.value == t) || null;
  },
  getNextOrPrevOption(s) {
    let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !0;
    var e = this.dropdown.getAllSuggestionsRefs(), a = e.findIndex((r) => r === s);
    return t ? e[a + 1] : e[a - 1];
  },
  /**
   * mark the currently active suggestion option
   * @param {Object}  elm            option DOM node
   * @param {Boolean} adjustScroll   when navigation with keyboard arrows (up/down), aut-scroll to always show the highlighted element
   */
  highlightOption(s, t) {
    var e = this.settings.classNames.dropdownItemActive, a;
    if (this.state.ddItemElm && (this.state.ddItemElm.classList.remove(e), this.state.ddItemElm.removeAttribute("aria-selected")), !s) {
      this.state.ddItemData = null, this.state.ddItemElm = null, this.input.autocomplete.suggest.call(this);
      return;
    }
    a = this.dropdown.getSuggestionDataByNode(s), this.state.ddItemData = a, this.state.ddItemElm = s, s.classList.add(e), s.setAttribute("aria-selected", !0), t && (s.parentNode.scrollTop = s.clientHeight + s.offsetTop - s.parentNode.clientHeight), this.settings.autoComplete && (this.input.autocomplete.suggest.call(this, a), this.dropdown.position());
  },
  /**
   * Create a tag from the currently active suggestion option
   * @param {Object} elm  DOM node to select
   * @param {Object} event The original Click event, if available (since keyboard ENTER key also triggers this method)
   */
  selectOption(s, t) {
    var e = this.settings.dropdown, a = e.clearOnSelect, r = e.closeOnSelect;
    if (!s) {
      this.addTags(this.state.inputText, !0), r && this.dropdown.hide();
      return;
    }
    t = t || {};
    var i = s.getAttribute("value"), o = i == "noMatch", n = this.suggestedListItems.find((l) => (l.value ?? l) == i);
    if (this.trigger("dropdown:select", {
      data: n,
      elm: s,
      event: t
    }), !i || !n && !o) {
      r && setTimeout(this.dropdown.hide.bind(this));
      return;
    }
    this.state.editing ? this.onEditTagDone(null, U({
      __isValid: !0
    }, this.normalizeTags([n])[0])) : this[this.settings.mode == "mix" ? "addMixTags" : "addTags"]([n || this.input.raw.call(this)], a), this.DOM.input.parentNode && (setTimeout(() => {
      this.DOM.input.focus(), this.toggleFocusClass(!0);
    }), r && setTimeout(this.dropdown.hide.bind(this)), s.addEventListener("transitionend", () => {
      this.dropdown.fillHeaderFooter(), setTimeout(() => s.remove(), 100);
    }, {
      once: !0
    }), s.classList.add(this.settings.classNames.dropdownItemHidden));
  },
  // adds all the suggested items, including the ones which are not currently rendered,
  // unless specified otherwise (by the "onlyRendered" argument)
  selectAll(s) {
    this.suggestedListItems.length = 0, this.dropdown.hide(), this.dropdown.filterListItems("");
    var t = this.dropdown.filterListItems("");
    return s || (t = this.state.dropdown.suggestions), this.addTags(t, !0), this;
  },
  /**
   * returns an HTML string of the suggestions' list items
   * @param {String} value string to filter the whitelist by
   * @param {Object} options "exact" - for exact complete match
   * @return {Array} list of filtered whitelist items according to the settings provided and current value
   */
  filterListItems(s, r) {
    var e = this.settings, a = e.dropdown, r = r || {}, i = [], o = [], n = e.whitelist, l = a.maxItems >= 0 ? a.maxItems : 1 / 0, c = a.searchKeys, d, p, u, f, y, S = 0;
    if (s = e.mode == "select" && this.value.length && this.value[0][e.tagTextProp] == s ? "" : s, !s || !c.length)
      return i = a.includeSelectedTags ? n : n.filter((O) => !this.isTagDuplicate(xe(O) ? O.value : O)), this.state.dropdown.suggestions = i, i.slice(0, l);
    y = a.caseSensitive ? "" + s : ("" + s).toLowerCase();
    function D(O, q) {
      return q.toLowerCase().split(" ").every((E) => O.includes(E.toLowerCase()));
    }
    for (; S < n.length; S++) {
      let O, q;
      d = n[S] instanceof Object ? n[S] : {
        value: n[S]
      };
      let E = !Object.keys(d).some((ce) => c.includes(ce)), Y = E ? ["value"] : c;
      a.fuzzySearch && !r.exact ? (u = Y.reduce((ce, j) => ce + " " + (d[j] || ""), "").toLowerCase().trim(), a.accentedSearch && (u = wt(u), y = wt(y)), O = u.indexOf(y) == 0, q = u === y, p = D(u, y)) : (O = !0, p = Y.some((ce) => {
        var j = "" + (d[ce] || "");
        return a.accentedSearch && (j = wt(j), y = wt(y)), a.caseSensitive || (j = j.toLowerCase()), q = j === y, r.exact ? j === y : j.indexOf(y) == 0;
      })), f = !a.includeSelectedTags && this.isTagDuplicate(xe(d) ? d.value : d), p && !f && (q && O ? o.push(d) : a.sortby == "startsWith" && O ? i.unshift(d) : i.push(d));
    }
    return this.state.dropdown.suggestions = o.concat(i), typeof a.sortby == "function" ? a.sortby(o.concat(i), y) : o.concat(i).slice(0, l);
  },
  /**
   * Returns the final value of a tag data (object) with regards to the "mapValueTo" dropdown setting
   * @param {Object} tagData
   * @returns
   */
  getMappedValue(s) {
    var t = this.settings.dropdown.mapValueTo, e = t ? typeof t == "function" ? t(s) : s[t] || s.value : s.value;
    return e;
  },
  /**
   * Creates the dropdown items' HTML
   * @param  {Array} sugegstionsList  [Array of Objects]
   * @return {String}
   */
  createListHTML(s) {
    return U([], s).map((t, e) => {
      (typeof t == "string" || typeof t == "number") && (t = {
        value: t
      });
      var a = this.dropdown.getMappedValue(t);
      return a = typeof a == "string" ? He(a) : a, this.settings.templates.dropdownItem.apply(this, [lt(lt({}, t), {}, {
        mappedValue: a
      }), this]);
    }).join("");
  }
};
const Jt = 1, ut = "@yaireo/tagify/", Bi = (s) => (t) => {
  let e = "/" + t, a;
  if (localStorage.getItem(ut + s + "/v", Jt) == Jt)
    try {
      a = JSON.parse(localStorage[ut + s + e]);
    } catch {
    }
  return a;
}, Ki = (s) => s ? (localStorage.setItem(ut + s + "/v", Jt), (t, e) => {
  let a = "/" + e, r = JSON.stringify(t);
  t && e && (localStorage.setItem(ut + s + a, r), dispatchEvent(new Event("storage")));
}) : () => {
}, Wi = (s) => (t) => {
  const e = ut + "/" + s + "/";
  if (t)
    localStorage.removeItem(e + t);
  else
    for (let a in localStorage)
      a.includes(e) && localStorage.removeItem(a);
};
var ji = {
  empty: "empty",
  exceed: "number of tags exceeded",
  pattern: "pattern mismatch",
  duplicate: "already exists",
  notAllowed: "not allowed"
}, Gi = {
  /**
   *
   * @param {DOM Object} input     Original input DOm element
   * @param {Object}     settings  Tagify instance settings Object
   */
  wrapper(s, t) {
    return `<tags class="${t.classNames.namespace} ${t.mode ? `${t.classNames[t.mode + "Mode"]}` : ""} ${s.className}"
                    ${t.readonly ? "readonly" : ""}
                    ${t.disabled ? "disabled" : ""}
                    ${t.required ? "required" : ""}
                    ${t.mode === "select" ? "spellcheck='false'" : ""}
                    tabIndex="-1">
            <span ${!t.readonly && t.userInput ? "contenteditable" : ""} tabIndex="0" data-placeholder="${t.placeholder || "&#8203;"}" aria-placeholder="${t.placeholder || ""}"
                class="${t.classNames.input}"
                role="textbox"
                aria-autocomplete="both"
                aria-multiline="${t.mode == "mix"}"></span>
                &#8203;
        </tags>`;
  },
  tag(s, t) {
    let e = t.settings;
    return `<tag title="${s.title || s.value}"
                    contenteditable='false'
                    spellcheck='false'
                    tabIndex="${e.a11y.focusableTags ? 0 : -1}"
                    class="${e.classNames.tag} ${s.class || ""}"
                    ${this.getAttributes(s)}>
            <x title='' class="${e.classNames.tagX}" role='button' aria-label='remove tag'></x>
            <div>
                <span class="${e.classNames.tagText}">${s[e.tagTextProp] || s.value}</span>
            </div>
        </tag>`;
  },
  dropdown(s) {
    var t = s.dropdown, e = t.position == "manual", a = `${s.classNames.dropdown}`;
    return `<div class="${e ? "" : a} ${t.classname}" role="listbox" aria-labelledby="dropdown">
                    <div data-selector='tagify-suggestions-wrapper' class="${s.classNames.dropdownWrapper}"></div>
                </div>`;
  },
  dropdownContent(s) {
    var t = this.settings, e = this.state.dropdown.suggestions;
    return `
            ${t.templates.dropdownHeader.call(this, e)}
            ${s}
            ${t.templates.dropdownFooter.call(this, e)}
        `;
  },
  dropdownItem(s) {
    return `<div ${this.getAttributes(s)}
                    class='${this.settings.classNames.dropdownItem} ${s.class ? s.class : ""}'
                    tabindex="0"
                    role="option">${s.mappedValue || s.value}</div>`;
  },
  /**
   * @param {Array} suggestions An array of all the matched suggested items, including those which were sliced away due to the "dropdown.maxItems" setting
   */
  dropdownHeader(s) {
    return `<header data-selector='tagify-suggestions-header' class="${this.settings.classNames.dropdownHeader}"></header>`;
  },
  dropdownFooter(s) {
    var t = s.length - this.settings.dropdown.maxItems;
    return t > 0 ? `<footer data-selector='tagify-suggestions-footer' class="${this.settings.classNames.dropdownFooter}">
                ${t} more items. Refine your search.
            </footer>` : "";
  },
  dropdownItemNoMatch: null
};
function Vi(s) {
  var t = document.createTextNode("");
  function e(a, r, i) {
    i && r.split(/\s+/g).forEach((o) => t[a + "EventListener"].call(t, o, i));
  }
  return {
    off(a, r) {
      return e("remove", a, r), this;
    },
    on(a, r) {
      return r && typeof r == "function" && e("add", a, r), this;
    },
    trigger(a, r, i) {
      var o;
      if (i = i || {
        cloneData: !0
      }, !!a)
        if (s.settings.isJQueryPlugin)
          a == "remove" && (a = "removeTag"), jQuery(s.DOM.originalInput).triggerHandler(a, [r]);
        else {
          try {
            var n = typeof r == "object" ? r : {
              value: r
            };
            if (n = i.cloneData ? U({}, n) : n, n.tagify = this, r.event && (n.event = this.cloneEvent(r.event)), r instanceof Object)
              for (var l in r)
                r[l] instanceof HTMLElement && (n[l] = r[l]);
            o = new CustomEvent(a, {
              detail: n
            });
          } catch (c) {
            console.warn(c);
          }
          t.dispatchEvent(o);
        }
    }
  };
}
var Ls;
function qi() {
  if (!this.settings.mixMode.integrated) {
    var s = this.DOM.originalInput, t = this.state.lastOriginalValueReported !== s.value, e = new CustomEvent("change", {
      bubbles: !0
    });
    t && (this.state.lastOriginalValueReported = s.value, e.simulated = !0, s._valueTracker && s._valueTracker.setValue(Math.random()), s.dispatchEvent(e), this.trigger("change", this.state.lastOriginalValueReported), s.value = this.state.lastOriginalValueReported);
  }
}
var zi = {
  // bind custom events which were passed in the settings
  customBinding() {
    this.customEventsList.forEach((s) => {
      this.on(s, this.settings.callbacks[s]);
    });
  },
  binding() {
    let s = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : !0;
    var t = this.events.callbacks, e, a = s ? "addEventListener" : "removeEventListener";
    if (!(this.state.mainEvents && s)) {
      this.state.mainEvents = s, s && !this.listeners.main && (this.events.bindGlobal.call(this), this.settings.isJQueryPlugin && jQuery(this.DOM.originalInput).on("tagify.removeAllTags", this.removeAllTags.bind(this))), e = this.listeners.main = this.listeners.main || {
        focus: ["input", t.onFocusBlur.bind(this)],
        keydown: ["input", t.onKeydown.bind(this)],
        click: ["scope", t.onClickScope.bind(this)],
        dblclick: ["scope", t.onDoubleClickScope.bind(this)],
        paste: ["input", t.onPaste.bind(this)],
        drop: ["input", t.onDrop.bind(this)],
        compositionstart: ["input", t.onCompositionStart.bind(this)],
        compositionend: ["input", t.onCompositionEnd.bind(this)]
      };
      for (var r in e)
        this.DOM[e[r][0]][a](r, e[r][1]);
      clearInterval(this.listeners.main.originalInputValueObserverInterval), this.listeners.main.originalInputValueObserverInterval = setInterval(t.observeOriginalInputValue.bind(this), 500);
      var i = this.listeners.main.inputMutationObserver || new MutationObserver(t.onInputDOMChange.bind(this));
      i.disconnect(), this.settings.mode == "mix" && i.observe(this.DOM.input, {
        childList: !0
      });
    }
  },
  bindGlobal(s) {
    var t = this.events.callbacks, e = s ? "removeEventListener" : "addEventListener", a;
    if (!(!this.listeners || !s && this.listeners.global)) {
      this.listeners.global = this.listeners.global || [{
        type: this.isIE ? "keydown" : "input",
        // IE cannot register "input" events on contenteditable elements, so the "keydown" should be used instead..
        target: this.DOM.input,
        cb: t[this.isIE ? "onInputIE" : "onInput"].bind(this)
      }, {
        type: "keydown",
        target: window,
        cb: t.onWindowKeyDown.bind(this)
      }, {
        type: "blur",
        target: this.DOM.input,
        cb: t.onFocusBlur.bind(this)
      }, {
        type: "click",
        target: document,
        cb: t.onClickAnywhere.bind(this)
      }];
      for (a of this.listeners.global)
        a.target[e](a.type, a.cb);
    }
  },
  unbindGlobal() {
    this.events.bindGlobal.call(this, !0);
  },
  /**
   * DOM events callbacks
   */
  callbacks: {
    onFocusBlur(s) {
      var p, u;
      var t = this.settings, e = s.target ? this.trim(s.target.textContent) : "", a = (u = (p = this.value) == null ? void 0 : p[0]) == null ? void 0 : u[t.tagTextProp], r = s.type, i = t.dropdown.enabled >= 0, o = {
        relatedTarget: s.relatedTarget
      }, n = this.state.actions.selectOption && (i || !t.dropdown.closeOnSelect), l = this.state.actions.addNew && i, c = s.relatedTarget && je.call(this, s.relatedTarget) && this.DOM.scope.contains(s.relatedTarget), d;
      if (r == "blur") {
        if (s.relatedTarget === this.DOM.scope) {
          this.dropdown.hide(), this.DOM.input.focus();
          return;
        }
        this.postUpdate(), t.onChangeAfterBlur && this.triggerChangeEvent();
      }
      if (!(n || l)) {
        if (this.state.hasFocus = r == "focus" ? +/* @__PURE__ */ new Date() : !1, this.toggleFocusClass(this.state.hasFocus), t.mode == "mix") {
          r == "focus" ? this.trigger("focus", o) : s.type == "blur" && (this.trigger("blur", o), this.loading(!1), this.dropdown.hide(), this.state.dropdown.visible = void 0, this.setStateSelection());
          return;
        }
        if (r == "focus") {
          this.trigger("focus", o), (t.dropdown.enabled === 0 || !t.userInput) && this.dropdown.show(this.value.length ? "" : void 0);
          return;
        } else
          r == "blur" && (this.trigger("blur", o), this.loading(!1), t.mode == "select" && (c && (this.removeTags(), e = ""), a === e && (e = "")), d = e && !this.state.actions.selectOption && t.addTagOnBlur, d && this.addTags(e, !0));
        this.DOM.input.removeAttribute("style"), this.dropdown.hide();
      }
    },
    onCompositionStart(s) {
      this.state.composing = !0;
    },
    onCompositionEnd(s) {
      this.state.composing = !1;
    },
    onWindowKeyDown(s) {
      var t = document.activeElement, e = je.call(this, t), a = e && this.DOM.scope.contains(document.activeElement), r = a && t.hasAttribute("readonly"), i;
      if (!(!a || r))
        switch (i = t.nextElementSibling, s.key) {
          case "Backspace": {
            this.settings.readonly || (this.removeTags(t), (i || this.DOM.input).focus());
            break;
          }
          case "Enter": {
            setTimeout(this.editTag.bind(this), 0, t);
            break;
          }
        }
    },
    onKeydown(s) {
      var t = this.settings;
      if (!(this.state.composing || !t.userInput)) {
        t.mode == "select" && t.enforceWhitelist && this.value.length && s.key != "Tab" && s.preventDefault();
        var e = this.trim(s.target.textContent);
        if (this.trigger("keydown", {
          event: s
        }), t.mode == "mix") {
          switch (s.key) {
            case "Left":
            case "ArrowLeft": {
              this.state.actions.ArrowLeft = !0;
              break;
            }
            case "Delete":
            case "Backspace": {
              if (this.state.editing)
                return;
              var a = document.getSelection(), r = s.key == "Delete" && a.anchorOffset == (a.anchorNode.length || 0), i = a.anchorNode.previousSibling, o = a.anchorNode.nodeType == 1 || !a.anchorOffset && i && i.nodeType == 1 && a.anchorNode.previousSibling;
              Ps(this.DOM.input.innerHTML);
              var n = this.getTagElms(), l, c, d;
              if (t.backspace == "edit" && o) {
                l = a.anchorNode.nodeType == 1 ? null : a.anchorNode.previousElementSibling, setTimeout(this.editTag.bind(this), 0, l), s.preventDefault();
                return;
              }
              if (xs() && o instanceof Element) {
                d = Os(o), o.hasAttribute("readonly") || o.remove(), this.DOM.input.focus(), setTimeout(() => {
                  this.placeCaretAfterNode(d), this.DOM.input.click();
                });
                return;
              }
              if (a.anchorNode.nodeName == "BR")
                return;
              if ((r || o) && a.anchorNode.nodeType == 1 ? a.anchorOffset == 0 ? c = r ? n[0] : null : c = n[Math.min(n.length, a.anchorOffset) - 1] : r ? c = a.anchorNode.nextElementSibling : o instanceof Element && (c = o), a.anchorNode.nodeType == 3 && // node at caret location is a Text node
              !a.anchorNode.nodeValue && // has some text
              a.anchorNode.previousElementSibling && s.preventDefault(), (o || r) && !t.backspace) {
                s.preventDefault();
                return;
              }
              if (a.type != "Range" && !a.anchorOffset && a.anchorNode == this.DOM.input && s.key != "Delete") {
                s.preventDefault();
                return;
              }
              if (a.type != "Range" && c && c.hasAttribute("readonly")) {
                this.placeCaretAfterNode(Os(c));
                return;
              }
              clearTimeout(Ls), Ls = setTimeout(() => {
                var p = document.getSelection();
                Ps(this.DOM.input.innerHTML), !r && p.anchorNode.previousSibling, this.value = [].map.call(n, (u, f) => {
                  var y = V(u);
                  if (u.parentNode || y.readonly)
                    return y;
                  this.trigger("remove", {
                    tag: u,
                    index: f,
                    data: y
                  });
                }).filter((u) => u);
              }, 20);
              break;
            }
          }
          return !0;
        }
        switch (s.key) {
          case "Backspace":
            t.mode == "select" && t.enforceWhitelist && this.value.length ? this.removeTags() : (!this.state.dropdown.visible || t.dropdown.position == "manual") && (s.target.textContent == "" || e.charCodeAt(0) == 8203) && (t.backspace === !0 ? this.removeTags() : t.backspace == "edit" && setTimeout(this.editTag.bind(this), 0));
            break;
          case "Esc":
          case "Escape":
            if (this.state.dropdown.visible)
              return;
            s.target.blur();
            break;
          case "Down":
          case "ArrowDown":
            this.state.dropdown.visible || this.dropdown.show();
            break;
          case "ArrowRight": {
            let p = this.state.inputSuggestion || this.state.ddItemData;
            if (p && t.autoComplete.rightKey) {
              this.addTags([p], !0);
              return;
            }
            break;
          }
          case "Tab": {
            let p = t.mode == "select";
            if (e && !p)
              s.preventDefault();
            else
              return !0;
          }
          case "Enter":
            if (this.state.dropdown.visible && t.dropdown.position != "manual")
              return;
            s.preventDefault(), setTimeout(() => {
              this.state.dropdown.visible || this.state.actions.selectOption || this.addTags(e, !0);
            });
        }
      }
    },
    onInput(s) {
      this.postUpdate();
      var t = this.settings;
      if (t.mode == "mix")
        return this.events.callbacks.onMixTagsInput.call(this, s);
      var e = this.input.normalize.call(this), a = e.length >= t.dropdown.enabled, r = {
        value: e,
        inputElm: this.DOM.input
      }, i = this.validateTag({
        value: e
      });
      t.mode == "select" && this.toggleScopeValidation(i), r.isValid = i, this.state.inputText != e && (this.input.set.call(this, e, !1), e.search(t.delimiters) != -1 ? this.addTags(e) && this.input.set.call(this) : t.dropdown.enabled >= 0 && this.dropdown[a ? "show" : "hide"](e), this.trigger("input", r));
    },
    onMixTagsInput(s) {
      var t, e, a, r, i, o, n = this.settings, l = this.value.length, c, d, p = this.getTagElms(), u = document.createDocumentFragment(), f = window.getSelection().getRangeAt(0), y = [].map.call(p, (S) => V(S).value);
      if (s.inputType == "deleteContentBackward" && xs() && this.events.callbacks.onKeydown.call(this, {
        target: s.target,
        key: "Backspace"
      }), this.value.slice().forEach((S) => {
        S.readonly && !y.includes(S.value) && u.appendChild(this.createTagElem(S));
      }), u.childNodes.length && (f.insertNode(u), this.setRangeAtStartEnd(!1, u.lastChild)), p.length != l) {
        this.value = [].map.call(this.getTagElms(), (S) => V(S)), this.update({
          withoutChangeEvent: !0
        });
        return;
      }
      if (this.hasMaxTags())
        return !0;
      if (window.getSelection && (o = window.getSelection(), o.rangeCount > 0 && o.anchorNode.nodeType == 3)) {
        if (f = o.getRangeAt(0).cloneRange(), f.collapse(!0), f.setStart(o.focusNode, 0), t = f.toString().slice(0, f.endOffset), a = t.split(n.pattern).length - 1, e = t.match(n.pattern), e && (r = t.slice(t.lastIndexOf(e[e.length - 1]))), r) {
          if (this.state.actions.ArrowLeft = !1, this.state.tag = {
            prefix: r.match(n.pattern)[0],
            value: r.replace(n.pattern, "")
            // get rid of the prefix
          }, this.state.tag.baseOffset = o.baseOffset - this.state.tag.value.length, d = this.state.tag.value.match(n.delimiters), d) {
            this.state.tag.value = this.state.tag.value.replace(n.delimiters, ""), this.state.tag.delimiters = d[0], this.addTags(this.state.tag.value, n.dropdown.clearOnSelect), this.dropdown.hide();
            return;
          }
          i = this.state.tag.value.length >= n.dropdown.enabled;
          try {
            c = this.state.flaggedTags[this.state.tag.baseOffset], c = c.prefix == this.state.tag.prefix && c.value[0] == this.state.tag.value[0], this.state.flaggedTags[this.state.tag.baseOffset] && !this.state.tag.value && delete this.state.flaggedTags[this.state.tag.baseOffset];
          } catch {
          }
          (c || a < this.state.mixMode.matchedPatternCount) && (i = !1);
        } else
          this.state.flaggedTags = {};
        this.state.mixMode.matchedPatternCount = a;
      }
      setTimeout(() => {
        this.update({
          withoutChangeEvent: !0
        }), this.trigger("input", U({}, this.state.tag, {
          textContent: this.DOM.input.textContent
        })), this.state.tag && this.dropdown[i ? "show" : "hide"](this.state.tag.value);
      }, 10);
    },
    onInputIE(s) {
      var t = this;
      setTimeout(function() {
        t.events.callbacks.onInput.call(t, s);
      });
    },
    observeOriginalInputValue() {
      this.DOM.originalInput.parentNode || this.destroy(), this.DOM.originalInput.value != this.DOM.originalInput.tagifyValue && this.loadOriginalValues();
    },
    onClickAnywhere(s) {
      s.target != this.DOM.scope && !this.DOM.scope.contains(s.target) && (this.toggleFocusClass(!1), this.state.hasFocus = !1);
    },
    onClickScope(s) {
      var t = this.settings, e = s.target.closest("." + t.classNames.tag), a = +/* @__PURE__ */ new Date() - this.state.hasFocus;
      if (s.target == this.DOM.scope) {
        this.DOM.input.focus();
        return;
      } else if (s.target.classList.contains(t.classNames.tagX)) {
        this.removeTags(s.target.parentNode);
        return;
      } else if (e) {
        this.trigger("click", {
          tag: e,
          index: this.getNodeIndex(e),
          data: V(e),
          event: s
        }), (t.editTags === 1 || t.editTags.clicks === 1) && this.events.callbacks.onDoubleClickScope.call(this, s);
        return;
      } else if (s.target == this.DOM.input && (t.mode == "mix" && this.fixFirefoxLastTagNoCaret(), a > 500)) {
        this.state.dropdown.visible ? this.dropdown.hide() : t.dropdown.enabled === 0 && t.mode != "mix" && this.dropdown.show(this.value.length ? "" : void 0);
        return;
      }
      t.mode == "select" && t.dropdown.enabled === 0 && !this.state.dropdown.visible && this.dropdown.show();
    },
    // special proccess is needed for pasted content in order to "clean" it
    onPaste(s) {
      s.preventDefault();
      var t = this.settings, e = t.mode == "select" && t.enforceWhitelist;
      if (e || !t.userInput)
        return !1;
      var a, r;
      t.readonly || (a = s.clipboardData || window.clipboardData, r = a.getData("Text"), t.hooks.beforePaste(s, {
        tagify: this,
        pastedText: r,
        clipboardData: a
      }).then((i) => {
        i === void 0 && (i = r), i && (this.injectAtCaret(i, window.getSelection().getRangeAt(0)), this.settings.mode == "mix" ? this.events.callbacks.onMixTagsInput.call(this, s) : this.settings.pasteAsTags ? this.addTags(this.state.inputText + i, !0) : this.state.inputText = i);
      }).catch((i) => i));
    },
    onDrop(s) {
      s.preventDefault();
    },
    onEditTagInput(s, t) {
      var e = s.closest("." + this.settings.classNames.tag), a = this.getNodeIndex(e), r = V(e), i = this.input.normalize.call(this, s), o = {
        [this.settings.tagTextProp]: i,
        __tagId: r.__tagId
      }, n = this.validateTag(o), l = this.editTagChangeDetected(U(r, o));
      !l && s.originalIsValid === !0 && (n = !0), e.classList.toggle(this.settings.classNames.tagInvalid, n !== !0), r.__isValid = n, e.title = n === !0 ? r.title || r.value : n, i.length >= this.settings.dropdown.enabled && (this.state.editing && (this.state.editing.value = i), this.dropdown.show(i)), this.trigger("edit:input", {
        tag: e,
        index: a,
        data: U({}, this.value[a], {
          newValue: i
        }),
        event: t
      });
    },
    onEditTagPaste(s, t) {
      var e = t.clipboardData || window.clipboardData, a = e.getData("Text");
      t.preventDefault();
      var r = Oa(a);
      this.setRangeAtStartEnd(!1, r);
    },
    onEditTagFocus(s) {
      this.state.editing = {
        scope: s,
        input: s.querySelector("[contenteditable]")
      };
    },
    onEditTagBlur(s) {
      if (this.state.hasFocus || this.toggleFocusClass(), !!this.DOM.scope.contains(s)) {
        var t = this.settings, e = s.closest("." + t.classNames.tag), a = V(e), r = this.input.normalize.call(this, s), i = {
          [t.tagTextProp]: r,
          __tagId: a.__tagId
        }, o = a.__originalData, n = this.editTagChangeDetected(U(a, i)), l = this.validateTag(i), c, d;
        if (!r) {
          this.onEditTagDone(e);
          return;
        }
        if (!n) {
          this.onEditTagDone(e, o);
          return;
        }
        if (c = this.hasMaxTags(), d = U({}, o, {
          [t.tagTextProp]: this.trim(r),
          __isValid: l
        }), t.transformTag.call(this, d, o), l = (!c || o.__isValid === !0) && this.validateTag(d), l !== !0) {
          if (this.trigger("invalid", {
            data: d,
            tag: e,
            message: l
          }), t.editTags.keepInvalid)
            return;
          t.keepInvalidTags ? d.__isValid = l : d = o;
        } else
          t.keepInvalidTags && (delete d.title, delete d["aria-invalid"], delete d.class);
        this.onEditTagDone(e, d);
      }
    },
    onEditTagkeydown(s, t) {
      if (!this.state.composing)
        switch (this.trigger("edit:keydown", {
          event: s
        }), s.key) {
          case "Esc":
          case "Escape":
            t.parentNode.replaceChild(t.__tagifyTagData.__originalHTML, t), this.state.editing = !1;
          case "Enter":
          case "Tab":
            s.preventDefault(), s.target.blur();
        }
    },
    onDoubleClickScope(s) {
      var t = s.target.closest("." + this.settings.classNames.tag), e = V(t), a = this.settings, r, i;
      !t || !a.userInput || e.editable === !1 || (r = t.classList.contains(this.settings.classNames.tagEditing), i = t.hasAttribute("readonly"), a.mode != "select" && !a.readonly && !r && !i && this.settings.editTags && this.editTag(t), this.toggleFocusClass(!0), this.trigger("dblclick", {
        tag: t,
        index: this.getNodeIndex(t),
        data: V(t)
      }));
    },
    /**
     *
     * @param {Object} m an object representing the observed DOM changes
     */
    onInputDOMChange(s) {
      s.forEach((e) => {
        e.addedNodes.forEach((a) => {
          var r;
          if (a.outerHTML == "<div><br></div>")
            a.replaceWith(document.createElement("br"));
          else if (a.nodeType == 1 && a.querySelector(this.settings.classNames.tagSelector)) {
            let i = document.createTextNode("");
            a.childNodes[0].nodeType == 3 && a.previousSibling.nodeName != "BR" && (i = document.createTextNode(`
`)), a.replaceWith(i, ...[...a.childNodes].slice(0, -1)), this.placeCaretAfterNode(i);
          } else if (je.call(this, a) && (((r = a.previousSibling) == null ? void 0 : r.nodeType) == 3 && !a.previousSibling.textContent && a.previousSibling.remove(), a.previousSibling && a.previousSibling.nodeName == "BR")) {
            a.previousSibling.replaceWith(`
​`);
            let i = a.nextSibling, o = "";
            for (; i; )
              o += i.textContent, i = i.nextSibling;
            o.trim() && this.placeCaretAfterNode(a.previousSibling);
          }
        }), e.removedNodes.forEach((a) => {
          a && a.nodeName == "BR" && je.call(this, t) && (this.removeTags(t), this.fixFirefoxLastTagNoCaret());
        });
      });
      var t = this.DOM.input.lastChild;
      t && t.nodeValue == "" && t.remove(), (!t || t.nodeName != "BR") && this.DOM.input.appendChild(document.createElement("br"));
    }
  }
};
function It(s, t) {
  if (!s) {
    console.warn("Tagify:", "input element not found", s);
    const e = new Proxy(this, {
      get() {
        return () => e;
      }
    });
    return e;
  }
  if (s.__tagify)
    return console.warn("Tagify: ", "input element is already Tagified - Same instance is returned.", s), s.__tagify;
  U(this, Vi(this)), this.isFirefox = /firefox|fxios/i.test(navigator.userAgent) && !/seamonkey/i.test(navigator.userAgent), this.isIE = window.document.documentMode, t = t || {}, this.getPersistedData = Bi(t.id), this.setPersistedData = Ki(t.id), this.clearPersistedData = Wi(t.id), this.applySettings(s, t), this.state = {
    inputText: "",
    editing: !1,
    composing: !1,
    actions: {},
    // UI actions for state-locking
    mixMode: {},
    dropdown: {},
    flaggedTags: {}
    // in mix-mode, when a string is detetced as potential tag, and the user has chocen to close the suggestions dropdown, keep the record of the tasg here
  }, this.value = [], this.listeners = {}, this.DOM = {}, this.build(s), Ni.call(this), this.getCSSVars(), this.loadOriginalValues(), this.events.customBinding.call(this), this.events.binding.call(this), s.autofocus && this.DOM.input.focus(), s.__tagify = this;
}
It.prototype = {
  _dropdown: Hi,
  getSetTagData: V,
  helpers: {
    sameStr: st,
    removeCollectionProp: Es,
    omit: Xt,
    isObject: xe,
    parseHTML: Wt,
    escapeHTML: He,
    extend: U,
    concatWithoutDups: Ms,
    getUID: _s,
    isNodeTag: je
  },
  customEventsList: ["change", "add", "remove", "invalid", "input", "click", "keydown", "focus", "blur", "edit:input", "edit:beforeUpdate", "edit:updated", "edit:start", "edit:keydown", "dropdown:show", "dropdown:hide", "dropdown:select", "dropdown:updated", "dropdown:noMatch", "dropdown:scroll"],
  dataProps: ["__isValid", "__removed", "__originalData", "__originalHTML", "__tagId"],
  // internal-uasge props
  trim(s) {
    return this.settings.trim && s && typeof s == "string" ? s.trim() : s;
  },
  // expose this handy utility function
  parseHTML: Wt,
  templates: Gi,
  parseTemplate(s, t) {
    return s = this.settings.templates[s] || s, Wt(s.apply(this, t));
  },
  set whitelist(s) {
    const t = s && Array.isArray(s);
    this.settings.whitelist = t ? s : [], this.setPersistedData(t ? s : [], "whitelist");
  },
  get whitelist() {
    return this.settings.whitelist;
  },
  generateClassSelectors(s) {
    for (let t in s) {
      let e = t;
      Object.defineProperty(s, e + "Selector", {
        get() {
          return "." + this[e].split(" ")[0];
        }
      });
    }
  },
  applySettings(s, t) {
    var o, n;
    jt.templates = this.templates;
    var e = {
      dropdown: {
        position: "text"
      }
    }, a = U({}, jt, t.mode == "mix" ? e : {}), r = this.settings = U({}, a, t);
    if (r.disabled = s.hasAttribute("disabled"), r.readonly = r.readonly || s.hasAttribute("readonly"), r.placeholder = He(s.getAttribute("placeholder") || r.placeholder || ""), r.required = s.hasAttribute("required"), this.generateClassSelectors(r.classNames), r.dropdown.includeSelectedTags === void 0 && (r.dropdown.includeSelectedTags = r.duplicates), this.isIE && (r.autoComplete = !1), ["whitelist", "blacklist"].forEach((l) => {
      var c = s.getAttribute("data-" + l);
      c && (c = c.split(r.delimiters), c instanceof Array && (r[l] = c));
    }), "autoComplete" in t && !xe(t.autoComplete) && (r.autoComplete = jt.autoComplete, r.autoComplete.enabled = t.autoComplete), r.mode == "mix" && (r.pattern = r.pattern || /@/, r.autoComplete.rightKey = !0, r.delimiters = t.delimiters || null, r.tagTextProp && !r.dropdown.searchKeys.includes(r.tagTextProp) && r.dropdown.searchKeys.push(r.tagTextProp)), s.pattern)
      try {
        r.pattern = new RegExp(s.pattern);
      } catch {
      }
    if (r.delimiters) {
      r._delimiters = r.delimiters;
      try {
        r.delimiters = new RegExp(this.settings.delimiters, "g");
      } catch {
      }
    }
    r.disabled && (r.userInput = !1), this.TEXTS = lt(lt({}, ji), r.texts || {}), (r.mode == "select" && !((o = t.dropdown) != null && o.enabled) || !r.userInput) && (r.dropdown.enabled = 0), r.dropdown.appendTarget = ((n = t.dropdown) == null ? void 0 : n.appendTarget) || document.body;
    let i = this.getPersistedData("whitelist");
    Array.isArray(i) && (this.whitelist = Array.isArray(r.whitelist) ? Ms(r.whitelist, i) : i);
  },
  /**
   * Returns a string of HTML element attributes
   * @param {Object} data [Tag data]
   */
  getAttributes(s) {
    var t = this.getCustomAttributes(s), e = "", a;
    for (a in t)
      e += " " + a + (s[a] !== void 0 ? `="${t[a]}"` : "");
    return e;
  },
  /**
   * Returns an object of attributes to be used for the templates
   */
  getCustomAttributes(s) {
    if (!xe(s))
      return "";
    var t = {}, e;
    for (e in s)
      e.slice(0, 2) != "__" && e != "class" && s.hasOwnProperty(e) && s[e] !== void 0 && (t[e] = He(s[e]));
    return t;
  },
  setStateSelection() {
    var s = window.getSelection(), t = {
      anchorOffset: s.anchorOffset,
      anchorNode: s.anchorNode,
      range: s.getRangeAt && s.rangeCount && s.getRangeAt(0)
    };
    return this.state.selection = t, t;
  },
  /**
   * Get specific CSS variables which are relevant to this script and parse them as needed.
   * The result is saved on the instance in "this.CSSVars"
   */
  getCSSVars() {
    var s = getComputedStyle(this.DOM.scope, null);
    const t = (a) => s.getPropertyValue("--" + a);
    function e(a) {
      if (!a)
        return {};
      a = a.trim().split(" ")[0];
      var r = a.split(/\d+/g).filter((o) => o).pop().trim(), i = +a.split(r).filter((o) => o)[0].trim();
      return {
        value: i,
        unit: r
      };
    }
    this.CSSVars = {
      tagHideTransition: ((a) => {
        let r = a.value;
        return a.unit == "s" ? r * 1e3 : r;
      })(e(t("tag-hide-transition")))
    };
  },
  /**
   * builds the HTML of this component
   * @param  {Object} input [DOM element which would be "transformed" into "Tags"]
   */
  build(s) {
    var t = this.DOM;
    this.settings.mixMode.integrated ? (t.originalInput = null, t.scope = s, t.input = s) : (t.originalInput = s, t.originalInput_tabIndex = s.tabIndex, t.scope = this.parseTemplate("wrapper", [s, this.settings]), t.input = t.scope.querySelector(this.settings.classNames.inputSelector), s.parentNode.insertBefore(t.scope, s), s.tabIndex = -1);
  },
  /**
   * revert any changes made by this component
   */
  destroy() {
    this.events.unbindGlobal.call(this), this.DOM.scope.parentNode.removeChild(this.DOM.scope), this.DOM.originalInput.tabIndex = this.DOM.originalInput_tabIndex, delete this.DOM.originalInput.__tagify, this.dropdown.hide(!0), clearTimeout(this.dropdownHide__bindEventsTimeout), clearInterval(this.listeners.main.originalInputValueObserverInterval);
  },
  /**
   * if the original input has any values, add them as tags
   */
  loadOriginalValues(s) {
    var t, e = this.settings;
    if (this.state.blockChangeEvent = !0, s === void 0) {
      const a = this.getPersistedData("value");
      a && !this.DOM.originalInput.value ? s = a : s = e.mixMode.integrated ? this.DOM.input.textContent : this.DOM.originalInput.value;
    }
    if (this.removeAllTags(), s)
      if (e.mode == "mix")
        this.parseMixTags(s), t = this.DOM.input.lastChild, (!t || t.tagName != "BR") && this.DOM.input.insertAdjacentHTML("beforeend", "<br>");
      else {
        try {
          JSON.parse(s) instanceof Array && (s = JSON.parse(s));
        } catch {
        }
        this.addTags(s, !0).forEach((a) => a && a.classList.add(e.classNames.tagNoAnimation));
      }
    else
      this.postUpdate();
    this.state.lastOriginalValueReported = e.mixMode.integrated ? "" : this.DOM.originalInput.value;
  },
  cloneEvent(s) {
    var t = {};
    for (var e in s)
      e != "path" && (t[e] = s[e]);
    return t;
  },
  /**
   * Toogle global loading state on/off
   * Useful when fetching async whitelist while user is typing
   * @param {Boolean} isLoading
   */
  loading(s) {
    return this.state.isLoading = s, this.DOM.scope.classList[s ? "add" : "remove"](this.settings.classNames.scopeLoading), this;
  },
  /**
   * Toogle a tag loading state on/off
   * @param {Boolean} isLoading
   */
  tagLoading(s, t) {
    return s && s.classList[t ? "add" : "remove"](this.settings.classNames.tagLoading), this;
  },
  /**
   * Toggles class on the main tagify container ("scope")
   * @param {String} className
   * @param {Boolean} force
   */
  toggleClass(s, t) {
    typeof s == "string" && this.DOM.scope.classList.toggle(s, t);
  },
  toggleScopeValidation(s) {
    var t = s === !0 || s === void 0;
    !this.settings.required && s && s === this.TEXTS.empty && (t = !0), this.toggleClass(this.settings.classNames.tagInvalid, !t), this.DOM.scope.title = t ? "" : s;
  },
  toggleFocusClass(s) {
    this.toggleClass(this.settings.classNames.focus, !!s);
  },
  triggerChangeEvent: qi,
  events: zi,
  fixFirefoxLastTagNoCaret() {
  },
  /** https://stackoverflow.com/a/59156872/104380
   * @param {Boolean} start indicating where to place it (start or end of the node)
   * @param {Object}  node  DOM node to place the caret at
   */
  setRangeAtStartEnd(s, t) {
    if (t) {
      s = typeof s == "number" ? s : !!s, t = t.lastChild || t;
      var e = document.getSelection();
      if (e.focusNode instanceof Element && !this.DOM.input.contains(e.focusNode))
        return !0;
      try {
        e.rangeCount >= 1 && ["Start", "End"].forEach((a) => e.getRangeAt(0)["set" + a](t, s || t.length));
      } catch {
      }
    }
  },
  placeCaretAfterNode(s) {
    if (!(!s || !s.parentNode)) {
      var t = s, e = window.getSelection(), a = e.getRangeAt(0);
      e.rangeCount && (a.setStartAfter(t), a.collapse(!0), e.removeAllRanges(), e.addRange(a));
    }
  },
  insertAfterTag(s, t) {
    if (t = t || this.settings.mixMode.insertAfterTag, !(!s || !s.parentNode || !t))
      return t = typeof t == "string" ? document.createTextNode(t) : t, s.parentNode.insertBefore(t, s.nextSibling), t;
  },
  // compares all "__originalData" property values with the current "tagData" properties
  // and returns "true" if something changed.
  editTagChangeDetected(s) {
    var t = s.__originalData;
    for (var e in t)
      if (!this.dataProps.includes(e) && s[e] != t[e])
        return !0;
    return !1;
  },
  // returns the node which has the actual tag's content
  getTagTextNode(s) {
    return s.querySelector(this.settings.classNames.tagTextSelector);
  },
  // sets the text of a tag
  setTagTextNode(s, t) {
    this.getTagTextNode(s).innerHTML = He(t);
  },
  /**
   * Enters a tag into "edit" mode
   * @param {Node} tagElm the tag element to edit. if nothing specified, use last last
   */
  editTag(s, t) {
    s = s || this.getLastTag(), t = t || {}, this.dropdown.hide();
    var e = this.settings, a = this.getTagTextNode(s), r = this.getNodeIndex(s), i = V(s), o = this.events.callbacks, n = this, l = !0, c = function() {
      setTimeout(() => o.onEditTagBlur.call(n, n.getTagTextNode(s)));
    };
    if (!a) {
      console.warn("Cannot find element in Tag template: .", e.classNames.tagTextSelector);
      return;
    }
    if (!(i instanceof Object && "editable" in i && !i.editable))
      return i = V(s, {
        __originalData: U({}, i),
        __originalHTML: s.cloneNode(!0)
      }), V(i.__originalHTML, i.__originalData), a.setAttribute("contenteditable", !0), s.classList.add(e.classNames.tagEditing), a.addEventListener("focus", o.onEditTagFocus.bind(this, s)), a.addEventListener("blur", c), a.addEventListener("input", o.onEditTagInput.bind(this, a)), a.addEventListener("paste", o.onEditTagPaste.bind(this, a)), a.addEventListener("keydown", (d) => o.onEditTagkeydown.call(this, d, s)), a.addEventListener("compositionstart", o.onCompositionStart.bind(this)), a.addEventListener("compositionend", o.onCompositionEnd.bind(this)), t.skipValidation || (l = this.editTagToggleValidity(s)), a.originalIsValid = l, this.trigger("edit:start", {
        tag: s,
        index: r,
        data: i,
        isValid: l
      }), a.focus(), this.setRangeAtStartEnd(!1, a), this;
  },
  /**
   * If a tag is invalid, for any reason, set its class to "not allowed" (see defaults file)
   * @param {Node} tagElm required
   * @param {Object} tagData optional
   * @returns true if valid, a string (reason) if not
   */
  editTagToggleValidity(s, e) {
    var e = e || V(s), a;
    if (!e) {
      console.warn("tag has no data: ", s, e);
      return;
    }
    return a = !("__isValid" in e) || e.__isValid === !0, a || this.removeTagsFromValue(s), this.update(), s.classList.toggle(this.settings.classNames.tagNotAllowed, !a), e.__isValid;
  },
  onEditTagDone(s, t) {
    s = s || this.state.editing.scope, t = t || {};
    var e = {
      tag: s,
      index: this.getNodeIndex(s),
      previousData: V(s),
      data: t
    };
    this.trigger("edit:beforeUpdate", e, {
      cloneData: !1
    }), this.state.editing = !1, delete t.__originalData, delete t.__originalHTML, s && t[this.settings.tagTextProp] ? (s = this.replaceTag(s, t), this.editTagToggleValidity(s, t), this.settings.a11y.focusableTags ? s.focus() : this.placeCaretAfterNode(s)) : s && this.removeTags(s), this.trigger("edit:updated", e), this.dropdown.hide(), this.settings.keepInvalidTags && this.reCheckInvalidTags();
  },
  /**
   * Replaces an exisitng tag with a new one. Used for updating a tag's data
   * @param {Object} tagElm  [DOM node to replace]
   * @param {Object} tagData [data to create new tag from]
   */
  replaceTag(s, t) {
    (!t || !t.value) && (t = s.__tagifyTagData), t.__isValid && t.__isValid != !0 && U(t, this.getInvalidTagAttrs(t, t.__isValid));
    var e = this.createTagElem(t);
    return s.parentNode.replaceChild(e, s), this.updateValueByDOMTags(), e;
  },
  /**
   * update "value" (Array of Objects) by traversing all valid tags
   */
  updateValueByDOMTags() {
    this.value.length = 0, [].forEach.call(this.getTagElms(), (s) => {
      s.classList.contains(this.settings.classNames.tagNotAllowed.split(" ")[0]) || this.value.push(V(s));
    }), this.update();
  },
  /**
   * injects nodes/text at caret position, which is saved on the "state" when "blur" event gets triggered
   * @param {Node} injectedNode [the node to inject at the caret position]
   * @param {Object} selection [optional range Object. must have "anchorNode" & "anchorOffset"]
   */
  injectAtCaret(s, t) {
    var e;
    return t = t || ((e = this.state.selection) == null ? void 0 : e.range), !t && s ? (this.appendMixTags(s), this) : (Oa(s, t), this.setRangeAtStartEnd(!1, s), this.updateValueByDOMTags(), this.update(), this);
  },
  /**
   * input bridge for accessing & setting
   * @type {Object}
   */
  input: {
    set() {
      let s = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !0;
      var e = this.settings.dropdown.closeOnSelect;
      this.state.inputText = s, t && (this.DOM.input.innerHTML = He("" + s)), !s && e && this.dropdown.hide.bind(this), this.input.autocomplete.suggest.call(this), this.input.validate.call(this);
    },
    raw() {
      return this.DOM.input.textContent;
    },
    /**
     * Marks the tagify's input as "invalid" if the value did not pass "validateTag()"
     */
    validate() {
      var s = !this.state.inputText || this.validateTag({
        value: this.state.inputText
      }) === !0;
      return this.DOM.input.classList.toggle(this.settings.classNames.inputInvalid, !s), s;
    },
    // remove any child DOM elements that aren't of type TEXT (like <br>)
    normalize(s) {
      var t = s || this.DOM.input, e = [];
      t.childNodes.forEach((a) => a.nodeType == 3 && e.push(a.nodeValue)), e = e.join(`
`);
      try {
        e = e.replace(/(?:\r\n|\r|\n)/g, this.settings.delimiters.source.charAt(0));
      } catch {
      }
      return e = e.replace(/\s/g, " "), this.trim(e);
    },
    /**
     * suggest the rest of the input's value (via CSS "::after" using "content:attr(...)")
     * @param  {String} s [description]
     */
    autocomplete: {
      suggest(s) {
        if (this.settings.autoComplete.enabled) {
          s = s || {
            value: ""
          }, typeof s == "string" && (s = {
            value: s
          });
          var t = this.dropdown.getMappedValue(s);
          if (typeof t != "number") {
            var e = t.substr(0, this.state.inputText.length).toLowerCase(), a = t.substring(this.state.inputText.length);
            !t || !this.state.inputText || e != this.state.inputText.toLowerCase() ? (this.DOM.input.removeAttribute("data-suggest"), delete this.state.inputSuggestion) : (this.DOM.input.setAttribute("data-suggest", a), this.state.inputSuggestion = s);
          }
        }
      },
      /**
       * sets the suggested text as the input's value & cleanup the suggestion autocomplete.
       * @param {String} s [text]
       */
      set(s) {
        var t = this.DOM.input.getAttribute("data-suggest"), e = s || (t ? this.state.inputText + t : null);
        return e ? (this.settings.mode == "mix" ? this.replaceTextWithNode(document.createTextNode(this.state.tag.prefix + e)) : (this.input.set.call(this, e), this.setRangeAtStartEnd(!1, this.DOM.input)), this.input.autocomplete.suggest.call(this), this.dropdown.hide(), !0) : !1;
      }
    }
  },
  /**
   * returns the index of the the tagData within the "this.value" array collection.
   * since values should be unique, it is suffice to only search by "value" property
   * @param {Object} tagData
   */
  getTagIdx(s) {
    return this.value.findIndex((t) => t.__tagId == (s || {}).__tagId);
  },
  getNodeIndex(s) {
    var t = 0;
    if (s)
      for (; s = s.previousElementSibling; )
        t++;
    return t;
  },
  getTagElms() {
    for (var s = arguments.length, t = new Array(s), e = 0; e < s; e++)
      t[e] = arguments[e];
    var a = "." + [...this.settings.classNames.tag.split(" "), ...t].join(".");
    return [].slice.call(this.DOM.scope.querySelectorAll(a));
  },
  /**
   * gets the last non-readonly, not-in-the-proccess-of-removal tag
   */
  getLastTag() {
    var s = this.DOM.scope.querySelectorAll(`${this.settings.classNames.tagSelector}:not(.${this.settings.classNames.tagHide}):not([readonly])`);
    return s[s.length - 1];
  },
  /**
   * Searches if any tag with a certain value already exis
   * @param  {String/Object} value [text value / tag data object]
   * @param  {Boolean} caseSensitive
   * @return {Number}
   */
  isTagDuplicate(s, t, e) {
    var a = 0, r = this.settings;
    if (r.mode == "select")
      return !1;
    for (let i of this.value)
      st(this.trim("" + s), i.value, t) && e != i.__tagId && a++;
    return a;
  },
  getTagIndexByValue(s) {
    var t = [];
    return this.getTagElms().forEach((e, a) => {
      st(this.trim(e.textContent), s, this.settings.dropdown.caseSensitive) && t.push(a);
    }), t;
  },
  getTagElmByValue(s) {
    var t = this.getTagIndexByValue(s)[0];
    return this.getTagElms()[t];
  },
  /**
   * Temporarily marks a tag element (by value or Node argument)
   * @param  {Object} tagElm [a specific "tag" element to compare to the other tag elements siblings]
   */
  flashTag(s) {
    s && (s.classList.add(this.settings.classNames.tagFlash), setTimeout(() => {
      s.classList.remove(this.settings.classNames.tagFlash);
    }, 100));
  },
  /**
   * checks if text is in the blacklist
   */
  isTagBlacklisted(s) {
    return s = this.trim(s.toLowerCase()), this.settings.blacklist.filter((t) => ("" + t).toLowerCase() == s).length;
  },
  /**
   * checks if text is in the whitelist
   */
  isTagWhitelisted(s) {
    return !!this.getWhitelistItem(s);
  },
  /**
   * Returns the first whitelist item matched, by value (if match found)
   * @param {String} value [text to match by]
   */
  getWhitelistItem(s, r, o) {
    var a, r = r || "value", i = this.settings, o = o || i.whitelist;
    return o.some((n) => {
      var l = typeof n == "string" ? n : n[r] || n.value, c = st(l, s, i.dropdown.caseSensitive, i.trim);
      if (c)
        return a = typeof n == "string" ? {
          value: n
        } : n, !0;
    }), !a && r == "value" && i.tagTextProp != "value" && (a = this.getWhitelistItem(s, i.tagTextProp, o)), a;
  },
  /**
   * validate a tag object BEFORE the actual tag will be created & appeneded
   * @param  {String} s
   * @param  {String} uid      [unique ID, to not inclue own tag when cheking for duplicates]
   * @return {Boolean/String}  ["true" if validation has passed, String for a fail]
   */
  validateTag(s) {
    var t = this.settings, e = "value" in s ? "value" : t.tagTextProp, a = this.trim(s[e] + "");
    return (s[e] + "").trim() ? t.pattern && t.pattern instanceof RegExp && !t.pattern.test(a) ? this.TEXTS.pattern : !t.duplicates && this.isTagDuplicate(a, t.dropdown.caseSensitive, s.__tagId) ? this.TEXTS.duplicate : this.isTagBlacklisted(a) || t.enforceWhitelist && !this.isTagWhitelisted(a) ? this.TEXTS.notAllowed : t.validate ? t.validate(s) : !0 : this.TEXTS.empty;
  },
  getInvalidTagAttrs(s, t) {
    return {
      "aria-invalid": !0,
      class: `${s.class || ""} ${this.settings.classNames.tagNotAllowed}`.trim(),
      title: t
    };
  },
  hasMaxTags() {
    return this.value.length >= this.settings.maxTags ? this.TEXTS.exceed : !1;
  },
  setReadonly(s, t) {
    var e = this.settings;
    document.activeElement.blur(), e[t || "readonly"] = s, this.DOM.scope[(s ? "set" : "remove") + "Attribute"](t || "readonly", !0), this.setContentEditable(!s);
  },
  setContentEditable(s) {
    this.settings.userInput && (this.DOM.input.contentEditable = s, this.DOM.input.tabIndex = s ? 0 : -1);
  },
  setDisabled(s) {
    this.setReadonly(s, "disabled");
  },
  /**
   * pre-proccess the tagsItems, which can be a complex tagsItems like an Array of Objects or a string comprised of multiple words
   * so each item should be iterated on and a tag created for.
   * @return {Array} [Array of Objects]
   */
  normalizeTags(s) {
    var t = this.settings, e = t.whitelist, a = t.delimiters, r = t.mode, i = t.tagTextProp, o = [], n = e ? e[0] instanceof Object : !1, l = Array.isArray(s), c = l && s[0].value, d = (p) => (p + "").split(a).filter((u) => u).map((u) => ({
      [i]: this.trim(u),
      value: this.trim(u)
    }));
    if (typeof s == "number" && (s = s.toString()), typeof s == "string") {
      if (!s.trim())
        return [];
      s = d(s);
    } else
      l && (s = [].concat(...s.map((p) => p.value != null ? p : d(p))));
    return n && !c && (s.forEach((p) => {
      var u = o.map((S) => S.value), f = this.dropdown.filterListItems.call(this, p[i], {
        exact: !0
      });
      this.settings.duplicates || (f = f.filter((S) => !u.includes(S.value)));
      var y = f.length > 1 ? this.getWhitelistItem(p[i], i, f) : f[0];
      y && y instanceof Object ? o.push(y) : r != "mix" && (p.value == null && (p.value = p[i]), o.push(p));
    }), o.length && (s = o)), s;
  },
  /**
   * Parse the initial value of a textarea (or input) element and generate mixed text w/ tags
   * https://stackoverflow.com/a/57598892/104380
   * @param {String} s
   */
  parseMixTags(s) {
    var t = this.settings, e = t.mixTagsInterpolator, a = t.duplicates, r = t.transformTag, i = t.enforceWhitelist, o = t.maxTags, n = t.tagTextProp, l = [];
    return s = s.split(e[0]).map((c, d) => {
      var p = c.split(e[1]), u = p[0], f = l.length == o, y, S, D;
      try {
        if (u == +u)
          throw Error;
        S = JSON.parse(u);
      } catch {
        S = this.normalizeTags(u)[0] || {
          value: u
        };
      }
      if (r.call(this, S), !f && p.length > 1 && (!i || this.isTagWhitelisted(S.value)) && !(!a && this.isTagDuplicate(S.value)))
        y = S[n] ? n : "value", S[y] = this.trim(S[y]), D = this.createTagElem(S), l.push(S), D.classList.add(this.settings.classNames.tagNoAnimation), p[0] = D.outerHTML, this.value.push(S);
      else if (c)
        return d ? e[0] + c : c;
      return p.join("");
    }).join(""), this.DOM.input.innerHTML = s, this.DOM.input.appendChild(document.createTextNode("")), this.DOM.input.normalize(), this.getTagElms().forEach((c, d) => V(c, l[d])), this.update({
      withoutChangeEvent: !0
    }), s;
  },
  /**
   * For mixed-mode: replaces a text starting with a prefix with a wrapper element (tag or something)
   * First there *has* to be a "this.state.tag" which is a string that was just typed and is staring with a prefix
   */
  replaceTextWithNode(s, t) {
    if (!(!this.state.tag && !t)) {
      t = t || this.state.tag.prefix + this.state.tag.value;
      var e, a, r = this.state.selection || window.getSelection(), i = r.anchorNode, o = this.state.tag.delimiters ? this.state.tag.delimiters.length : 0;
      return i.splitText(r.anchorOffset - o), e = i.nodeValue.lastIndexOf(t), e == -1 || (a = i.splitText(e), s && i.parentNode.replaceChild(s, a)), !0;
    }
  },
  /**
   * For selecting a single option (not used for multiple tags, but for "mode:select" only)
   * @param {Object} tagElm   Tag DOM node
   * @param {Object} tagData  Tag data
   */
  selectTag(s, t) {
    var e = this.settings;
    if (!(e.enforceWhitelist && !this.isTagWhitelisted(t.value))) {
      this.input.set.call(this, t[e.tagTextProp] || t.value, !0), this.state.actions.selectOption && setTimeout(() => this.setRangeAtStartEnd(!1, this.DOM.input));
      var a = this.getLastTag();
      return a ? this.replaceTag(a, t) : this.appendTag(s), this.value[0] = t, this.update(), this.trigger("add", {
        tag: s,
        data: t
      }), [s];
    }
  },
  /**
   * add an empty "tag" element in an editable state
   */
  addEmptyTag(s) {
    var t = U({
      value: ""
    }, s || {}), e = this.createTagElem(t);
    V(e, t), this.appendTag(e), this.editTag(e, {
      skipValidation: !0
    });
  },
  /**
   * add a "tag" element to the "tags" component
   * @param {String/Array} tagsItems   [A string (single or multiple values with a delimiter), or an Array of Objects or just Array of Strings]
   * @param {Boolean}      clearInput  [flag if the input's value should be cleared after adding tags]
   * @param {Boolean}      skipInvalid [do not add, mark & remove invalid tags]
   * @return {Array} Array of DOM elements (tags)
   */
  addTags(s, t, e) {
    var a = [], r = this.settings, i = [], o = document.createDocumentFragment();
    if (e = e || r.skipInvalid, !s || s.length == 0)
      return a;
    switch (s = this.normalizeTags(s), r.mode) {
      case "mix":
        return this.addMixTags(s);
      case "select":
        t = !1, this.removeAllTags();
    }
    return this.DOM.input.removeAttribute("style"), s.forEach((n) => {
      var l, c = {}, d = Object.assign({}, n, {
        value: n.value + ""
      });
      if (n = Object.assign({}, d), r.transformTag.call(this, n), n.__isValid = this.hasMaxTags() || this.validateTag(n), n.__isValid !== !0) {
        if (e)
          return;
        if (U(c, this.getInvalidTagAttrs(n, n.__isValid), {
          __preInvalidData: d
        }), n.__isValid == this.TEXTS.duplicate && this.flashTag(this.getTagElmByValue(n.value)), !r.createInvalidTags) {
          i.push(n.value);
          return;
        }
      }
      if ("readonly" in n && (n.readonly ? c["aria-readonly"] = !0 : delete n.readonly), l = this.createTagElem(n, c), a.push(l), r.mode == "select")
        return this.selectTag(l, n);
      o.appendChild(l), n.__isValid && n.__isValid === !0 ? (this.value.push(n), this.trigger("add", {
        tag: l,
        index: this.value.length - 1,
        data: n
      })) : (this.trigger("invalid", {
        data: n,
        index: this.value.length,
        tag: l,
        message: n.__isValid
      }), r.keepInvalidTags || setTimeout(() => this.removeTags(l, !0), 1e3)), this.dropdown.position();
    }), this.appendTag(o), this.update(), s.length && t && (this.input.set.call(this, r.createInvalidTags ? "" : i.join(r._delimiters)), this.setRangeAtStartEnd(!1, this.DOM.input)), r.dropdown.enabled && this.dropdown.refilter(), a;
  },
  /**
   * Adds a mix-content tag
   * @param {String/Array} tagData    A string (single or multiple values with a delimiter), or an Array of Objects or just Array of Strings
   */
  addMixTags(s) {
    if (s = this.normalizeTags(s), s[0].prefix || this.state.tag)
      return this.prefixedTextToTag(s[0]);
    var t = document.createDocumentFragment();
    return s.forEach((e) => {
      var a = this.createTagElem(e);
      t.appendChild(a);
    }), this.appendMixTags(t), t;
  },
  appendMixTags(s) {
    var t = !!this.state.selection;
    t ? this.injectAtCaret(s) : (this.DOM.input.focus(), t = this.setStateSelection(), t.range.setStart(this.DOM.input, t.range.endOffset), t.range.setEnd(this.DOM.input, t.range.endOffset), this.DOM.input.appendChild(s), this.updateValueByDOMTags(), this.update());
  },
  /**
   * Adds a tag which was activly typed by the user
   * @param {String/Array} tagItem   [A string (single or multiple values with a delimiter), or an Array of Objects or just Array of Strings]
   */
  prefixedTextToTag(s) {
    var t = this.settings, e, a = this.state.tag.delimiters;
    if (t.transformTag.call(this, s), s.prefix = s.prefix || this.state.tag ? this.state.tag.prefix : (t.pattern.source || t.pattern)[0], e = this.createTagElem(s), this.replaceTextWithNode(e) || this.DOM.input.appendChild(e), setTimeout(() => e.classList.add(this.settings.classNames.tagNoAnimation), 300), this.value.push(s), this.update(), !a) {
      var r = this.insertAfterTag(e) || e;
      setTimeout(this.placeCaretAfterNode, 0, r);
    }
    return this.state.tag = null, this.trigger("add", U({}, {
      tag: e
    }, {
      data: s
    })), e;
  },
  /**
   * appened (validated) tag to the component's DOM scope
   */
  appendTag(s) {
    var t = this.DOM, e = t.input;
    t.scope.insertBefore(s, e);
  },
  /**
   * creates a DOM tag element and injects it into the component (this.DOM.scope)
   * @param  {Object}  tagData [text value & properties for the created tag]
   * @param  {Object}  extraData [properties which are for the HTML template only]
   * @return {Object} [DOM element]
   */
  createTagElem(s, t) {
    s.__tagId = _s();
    var e, a = U({}, s, lt({
      value: He(s.value + "")
    }, t));
    return e = this.parseTemplate("tag", [a, this]), $i(e), V(e, s), e;
  },
  /**
   * re-check all invalid tags.
   * called after a tag was edited or removed
   */
  reCheckInvalidTags() {
    var s = this.settings;
    this.getTagElms(s.classNames.tagNotAllowed).forEach((t, e) => {
      var a = V(t), r = this.hasMaxTags(), i = this.validateTag(a), o = i === !0 && !r;
      if (s.mode == "select" && this.toggleScopeValidation(i), o)
        return a = a.__preInvalidData ? a.__preInvalidData : {
          value: a.value
        }, this.replaceTag(t, a);
      t.title = r || i;
    });
  },
  /**
   * Removes a tag
   * @param  {Array|Node|String}  tagElms         [DOM element(s) or a String value. if undefined or null, remove last added tag]
   * @param  {Boolean}            silent          [A flag, which when turned on, does not remove any value and does not update the original input value but simply removes the tag from tagify]
   * @param  {Number}             tranDuration    [Transition duration in MS]
   * TODO: Allow multiple tags to be removed at-once
   */
  removeTags(s, t, e) {
    var a, r = this.settings;
    if (s = s && s instanceof HTMLElement ? [s] : s instanceof Array ? s : s ? [s] : [this.getLastTag()], a = s.reduce((i, o) => {
      o && typeof o == "string" && (o = this.getTagElmByValue(o));
      var n = V(o);
      return o && n && !n.readonly && i.push({
        node: o,
        idx: this.getTagIdx(n),
        // this.getNodeIndex(tagElm); // this.getTagIndexByValue(tagElm.textContent)
        data: V(o, {
          __removed: !0
        })
      }), i;
    }, []), e = typeof e == "number" ? e : this.CSSVars.tagHideTransition, r.mode == "select" && (e = 0, this.input.set.call(this)), a.length == 1 && r.mode != "select" && a[0].node.classList.contains(r.classNames.tagNotAllowed) && (t = !0), !!a.length)
      return r.hooks.beforeRemoveTag(a, {
        tagify: this
      }).then(() => {
        function i(n) {
          n.node.parentNode && (n.node.parentNode.removeChild(n.node), t ? r.keepInvalidTags && this.trigger("remove", {
            tag: n.node,
            index: n.idx
          }) : (this.trigger("remove", {
            tag: n.node,
            index: n.idx,
            data: n.data
          }), this.dropdown.refilter(), this.dropdown.position(), this.DOM.input.normalize(), r.keepInvalidTags && this.reCheckInvalidTags()));
        }
        function o(n) {
          n.node.style.width = parseFloat(window.getComputedStyle(n.node).width) + "px", document.body.clientTop, n.node.classList.add(r.classNames.tagHide), setTimeout(i.bind(this), e, n);
        }
        e && e > 10 && a.length == 1 ? o.call(this, a[0]) : a.forEach(i.bind(this)), t || (this.removeTagsFromValue(a.map((n) => n.node)), this.update(), r.mode == "select" && this.setContentEditable(!0));
      }).catch((i) => {
      });
  },
  removeTagsFromDOM() {
    [].slice.call(this.getTagElms()).forEach((s) => s.parentNode.removeChild(s));
  },
  /**
   * @param {Array/Node} tags to be removed from the this.value array
   */
  removeTagsFromValue(s) {
    s = Array.isArray(s) ? s : [s], s.forEach((t) => {
      var e = V(t), a = this.getTagIdx(e);
      a > -1 && this.value.splice(a, 1);
    });
  },
  removeAllTags(s) {
    s = s || {}, this.value = [], this.settings.mode == "mix" ? this.DOM.input.innerHTML = "" : this.removeTagsFromDOM(), this.dropdown.refilter(), this.dropdown.position(), this.state.dropdown.visible && setTimeout(() => {
      this.DOM.input.focus();
    }), this.settings.mode == "select" && (this.input.set.call(this), this.setContentEditable(!0)), this.update(s);
  },
  postUpdate() {
    var a, r;
    this.state.blockChangeEvent = !1;
    var s = this.settings, t = s.classNames, e = s.mode == "mix" ? s.mixMode.integrated ? this.DOM.input.textContent : this.DOM.originalInput.value.trim() : this.value.length + this.input.raw.call(this).length;
    this.toggleClass(t.hasMaxTags, this.value.length >= s.maxTags), this.toggleClass(t.hasNoTags, !this.value.length), this.toggleClass(t.empty, !e), s.mode == "select" && this.toggleScopeValidation((r = (a = this.value) == null ? void 0 : a[0]) == null ? void 0 : r.__isValid);
  },
  setOriginalInputValue(s) {
    var t = this.DOM.originalInput;
    this.settings.mixMode.integrated || (t.value = s, t.tagifyValue = t.value, this.setPersistedData(s, "value"));
  },
  /**
   * update the origianl (hidden) input field's value
   * see - https://stackoverflow.com/q/50957841/104380
   */
  update(s) {
    clearTimeout(this.debouncedUpdateTimeout), this.debouncedUpdateTimeout = setTimeout(e.bind(this), 100);
    function e() {
      var a = this.getInputValue();
      this.setOriginalInputValue(a), (!this.settings.onChangeAfterBlur || !(s || {}).withoutChangeEvent) && !this.state.blockChangeEvent && this.triggerChangeEvent(), this.postUpdate();
    }
  },
  getInputValue() {
    var s = this.getCleanValue();
    return this.settings.mode == "mix" ? this.getMixedTagsAsString(s) : s.length ? this.settings.originalInputValueFormat ? this.settings.originalInputValueFormat(s) : JSON.stringify(s) : "";
  },
  /**
   * removes properties from `this.value` which are only used internally
   */
  getCleanValue(s) {
    return Es(s || this.value, this.dataProps);
  },
  getMixedTagsAsString() {
    var s = "", t = this, e = this.settings, a = e.originalInputValueFormat || JSON.stringify, r = e.mixTagsInterpolator;
    function i(o) {
      o.childNodes.forEach((n) => {
        if (n.nodeType == 1) {
          const l = V(n);
          if (n.tagName == "BR" && (s += `\r
`), l && je.call(t, n)) {
            if (l.__removed)
              return;
            s += r[0] + a(Xt(l, t.dataProps)) + r[1];
          } else
            n.getAttribute("style") || ["B", "I", "U"].includes(n.tagName) ? s += n.textContent : (n.tagName == "DIV" || n.tagName == "P") && (s += `\r
`, i(n));
        } else
          s += n.textContent;
      });
    }
    return i(this.DOM.input), s;
  }
};
It.prototype.removeTag = It.prototype.removeTags;
const Yi = (s, t, e) => {
  const a = s.target.value;
  if (a) {
    const r = JSON.parse(a).map(({ value: i }) => i);
    t.update({ [e]: r });
  } else
    t.update({ [e]: [] });
}, Ma = {
  InitListeners: (s, t) => {
    function e(o, n) {
      const l = new It(o, {
        enforceWhitelist: !0,
        editTags: !1,
        whitelist: Object.entries(n).map(([u, f]) => f.map((y) => ({
          value: new Handlebars.SafeString(y).toString(),
          "data-group": u
        }))).flat(),
        dropdown: {
          enabled: 0,
          maxItems: 1e4,
          placeAbove: !1,
          appendTarget: s[0]
        }
      });
      l.dropdown.createListHTML = (u) => {
        const f = {};
        return structuredClone(u).map((y, S) => {
          const D = l.dropdown.getMappedValue.call(
            l,
            y
          );
          let O = "";
          return f[y["data-group"]] || (f[y["data-group"]] = !0, Object.keys(f).length && (O += "</div>"), O += `
                <div class="tagify__dropdown__itemsGroup">
                <h3>${y["data-group"]}</h3>
              `), y.value = D && typeof D == "string" ? h.escapeHTML(D) : D, O += l.settings.templates.dropdownItem.apply(
            l,
            [y, S]
          ), O;
        }).join("");
      };
      function c(u) {
        for (const [f, y] of Object.entries(n))
          if (y.includes(u))
            return f;
        return !1;
      }
      const d = $(o).data("tagTarget") ?? "system.tags", p = [getProperty(t, d) ?? []].flat().filter(Boolean);
      l.addTags(
        p.filter(c).map((u) => ({
          value: new Handlebars.SafeString(u).toString(),
          "data-group": c(u)
        })),
        !0,
        !0
      ), setTimeout(() => o.addEventListener("change", (u) => {
        Yi(u, t, d);
      }), 1e3);
    }
    const a = {
      "System Tags": Object.values(A.System),
      "Gear Tags": [
        ...Object.values(A.Gear),
        ...Object.values(A.GearCategory)
      ],
      "Actor Tags": [
        ...Object.values(A.PC),
        ...Object.values(A.NPC)
      ],
      Vices: Object.values(Ys),
      Playbooks: Object.values(rt),
      Inventions: Object.values(A.Invention),
      "Gang Types": Object.values(A.GangType)
    }, r = {
      "City Districts": Object.values(qs),
      "Other Districts": Object.values(zs)
    }, i = { Factions: game.actors.filter((o) => o.type === b.faction && o.name !== null).map((o) => o.name) };
    $(s).find(".tags-gm").each((o, n) => e(n, a)), $(s).find(".tags-district").each((o, n) => e(n, r)), $(s).find(".tags-faction").each((o, n) => e(n, i));
  }
};
class Xe extends ItemSheet {
  constructor() {
    super(...arguments);
    w(this, "_getTypedItemData", {
      [g.ability]: (e) => k.IsType(this.item, g.ability) ? {
        ...e,
        ...{}
      } : void 0,
      [g.background]: (e) => k.IsType(this.item, g.background) ? {
        ...e,
        ...{}
      } : void 0,
      [g.clock_keeper]: (e) => {
        if (!k.IsType(this.item, g.clock_keeper))
          return;
        const a = {
          phases: Object.values(N)
        };
        return {
          ...e,
          ...a
        };
      },
      [g.cohort_gang]: (e) => {
        var r, i;
        if (!k.IsType(this.item, g.cohort_gang, g.cohort_expert))
          return;
        e.tierTotal = this.item.system.quality > 0 ? h.romanizeNum(this.item.system.quality) : "0", (r = e.system).subtypes ?? (r.subtypes = {}), (i = e.system).elite_subtypes ?? (i.elite_subtypes = {});
        const a = {
          tierData: {
            class: "comp-tier comp-vertical comp-teeth",
            dotline: {
              data: this.item.system.tier,
              target: "system.tier.value",
              iconEmpty: "dot-empty.svg",
              iconEmptyHover: "dot-empty-hover.svg",
              iconFull: "dot-full.svg",
              iconFullHover: "dot-full-hover.svg"
            }
          }
        };
        return a.edgeData = Object.fromEntries(Object.values(e.system.edges ?? []).filter((o) => /[A-Za-z]/.test(o)).map((o) => [o.trim(), v.EdgeTooltips[o]])), a.flawData = Object.fromEntries(Object.values(e.system.flaws ?? []).filter((o) => /[A-Za-z]/.test(o)).map((o) => [o.trim(), v.FlawTooltips[o]])), {
          ...e,
          ...a
        };
      },
      [g.cohort_expert]: (e) => {
        const a = this._getTypedItemData[g.cohort_gang];
        if (!a)
          throw new Error(`No data for type ${this.item.type}`);
        return a(e);
      },
      [g.crew_ability]: (e) => k.IsType(this.item, g.crew_ability) ? {
        ...e,
        ...{}
      } : void 0,
      [g.crew_reputation]: (e) => k.IsType(this.item, g.crew_reputation) ? {
        ...e,
        ...{}
      } : void 0,
      [g.crew_playbook]: (e) => {
        if (!k.IsType(this.item, g.crew_playbook))
          return;
        if (e.isGM) {
          const r = {};
          [...Object.values(e.system.experience_clues ?? []).filter((i) => /[A-Za-z]/.test(i)), " "].forEach((i, o) => {
            r[(o + 1).toString()] = i;
          }), e.system.experience_clues = r;
        }
        return {
          ...e,
          ...{}
        };
      },
      [g.crew_upgrade]: (e) => k.IsType(this.item, g.crew_upgrade) ? {
        ...e,
        ...{}
      } : void 0,
      [g.feature]: (e) => k.IsType(this.item, g.feature) ? {
        ...e,
        ...{}
      } : void 0,
      [g.gm_tracker]: (e) => {
        if (!k.IsType(this.item, g.gm_tracker))
          return;
        const a = {
          phase: this.item.system.phase,
          phases: Object.values(N)
        };
        return {
          ...e,
          ...a
        };
      },
      [g.heritage]: (e) => k.IsType(this.item, g.heritage) ? {
        ...e,
        ...{}
      } : void 0,
      [g.gear]: (e) => {
        if (!k.IsType(this.item, g.gear))
          return;
        const a = {
          tierData: {
            class: "comp-tier comp-vertical comp-teeth",
            label: "Quality",
            labelClass: "filled-label full-width",
            dotline: {
              data: this.item.system.tier,
              target: "system.tier.value",
              iconEmpty: "dot-empty.svg",
              iconEmptyHover: "dot-empty-hover.svg",
              iconFull: "dot-full.svg",
              iconFullHover: "dot-full-hover.svg"
            }
          }
        };
        return {
          ...e,
          ...a
        };
      },
      [g.playbook]: (e) => {
        if (!k.IsType(this.item, g.playbook))
          return;
        if (e.isGM) {
          const r = {};
          [...Object.values(e.system.experience_clues ?? []).filter((o) => /[A-Za-z]/.test(o)), " "].forEach((o, n) => {
            r[(n + 1).toString()] = o;
          }), e.system.experience_clues = r;
          const i = {};
          [...Object.values(e.system.gather_info_questions ?? []).filter((o) => /[A-Za-z]/.test(o)), " "].forEach((o, n) => {
            i[(n + 1).toString()] = o;
          }), e.system.gather_info_questions = i;
        }
        return {
          ...e,
          ...{}
        };
      },
      [g.preferred_op]: (e) => k.IsType(this.item, g.preferred_op) ? {
        ...e,
        ...{}
      } : void 0,
      [g.stricture]: (e) => k.IsType(this.item, g.stricture) ? {
        ...e,
        ...{}
      } : void 0,
      [g.vice]: (e) => k.IsType(this.item, g.vice) ? {
        ...e,
        ...{}
      } : void 0,
      [g.ritual]: (e) => k.IsType(this.item, g.ritual) ? {
        ...e,
        ...{}
      } : void 0,
      [g.design]: (e) => k.IsType(this.item, g.design) ? {
        ...e,
        ...{}
      } : void 0,
      [g.location]: (e) => k.IsType(this.item, g.location) ? {
        ...e,
        ...{}
      } : void 0,
      [g.score]: (e) => {
        if (k.IsType(this.item, g.score))
          return e;
      }
    });
  }
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["eunos-blades", "sheet", "item"],
      width: 560,
      height: 500,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description" }]
    });
  }
  /* -------------------------------------------- */
  // constructor(item: BladesItem, options: Partial<ItemSheet.Options> = {}) {
  //   options.classes = [...options.classes ?? [], "eunos-blades", "sheet", "item", item.type];
  //   super(item, options);
  // }
  // override async getData() {
  getData() {
    var i;
    const e = super.getData(), a = {
      cssClass: this.item.type,
      editable: this.options.editable,
      isGM: (i = game.eunoblades.Tracker) != null && i.system.is_spoofing_player ? !1 : !!game.user.isGM,
      isEmbeddedItem: !!this.item.parent,
      item: this.item,
      system: this.item.system,
      tierTotal: this.item.getFactorTotal(m.tier) > 0 ? h.romanizeNum(this.item.getFactorTotal(m.tier)) : "0",
      activeEffects: Array.from(this.item.effects)
    }, r = this._getTypedItemData[this.item.type];
    return r ? r({ ...e, ...a }) : {
      ...e,
      ...a
    };
  }
  get template() {
    const e = [
      "systems/eunos-blades/templates/items"
    ];
    return v.SimpleItemTypes.includes(this.item.type) ? e.push("simple-sheet.hbs") : e.push(`${this.item.type}-sheet.hbs`), e.join("/");
  }
  /* -------------------------------------------- */
  addDotlineListeners(e) {
    e.find(".dotline").each((a, r) => {
      if ($(r).hasClass("locked"))
        return;
      const i = this.item, o = $(r).data("target"), n = $(r).closest("comp"), l = h.pInt($(r).data("value"));
      $(r).find(".dot").each((c, d) => {
        $(d).on("click", (p) => {
          p.preventDefault();
          const u = h.pInt($(d).data("value"));
          u !== l && (n.hasClass("comp-coins") || n.hasClass("comp-stash") ? nt.effects.fillCoins($(d).prevAll(".dot")).then(() => i.update({ [o]: u })) : i.update({ [o]: u }));
        }), $(d).on("contextmenu", (p) => {
          p.preventDefault();
          const u = h.pInt($(d).data("value")) - 1;
          u !== l && i.update({ [o]: u });
        });
      });
    });
  }
  async activateListeners(e) {
    await super.activateListeners(e);
    const a = this;
    Ma.InitListeners(e, this.item), Ue(e), this.options.editable && (this.addDotlineListeners(e), k.IsType(this.item, g.cohort_expert, g.cohort_gang) && e.find("[data-harm-click]").on({
      click: (r) => {
        var o;
        r.preventDefault();
        const i = h.pInt($(r.currentTarget).data("harmClick"));
        ((o = this.item.system.harm) == null ? void 0 : o.value) !== i && this.item.update({ "system.harm.value": i });
      },
      contextmenu: (r) => {
        var o;
        r.preventDefault();
        const i = Math.max(0, h.pInt($(r.currentTarget).data("harmClick")) - 1);
        ((o = this.item.system.harm) == null ? void 0 : o.value) !== i && this.item.update({ "system.harm.value": i });
      }
    }), this.options.submitOnChange && e.on("change", "textarea", this._onChangeInput.bind(this)), e.find(".effect-control").on("click", (r) => {
      var i;
      if (a.item.isOwned) {
        (i = ui.notifications) == null || i.warn(game.i18n.localize("BITD.EffectWarning"));
        return;
      }
      ve.onManageActiveEffect(r, a.item);
    }), e.find('[data-action="toggle-turf-connection"').on("click", this.toggleTurfConnection.bind(this)));
  }
  toggleTurfConnection(e) {
    const r = $(e.currentTarget).parent(), i = parseInt(r.data("index") ?? 0, 10), o = r.data("dir");
    if (!i || !o)
      return;
    const n = r.hasClass("no-connect"), l = {
      [`system.turfs.${i}.connects.${o}`]: n
    }, c = r.data("partner");
    if (typeof c == "string" && /-/.test(c)) {
      const [d, p] = c.split("-");
      l[`system.turfs.${d}.connects.${p}`] = n;
    }
    this.item.update(l);
  }
}
class $s extends Xe {
  constructor() {
    super(...arguments);
    w(this, "_htmlContext");
  }
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["eunos-blades", "sheet", "item", "project-sheet"],
      template: "systems/eunos-blades/templates/items/project-sheet.hbs"
    });
  }
  getData() {
    const e = super.getData(), a = {};
    return a.presentingClock = this.presentedClock, {
      ...e,
      ...a
    };
  }
  get presentedClock() {
    const { clockKey: e } = this.document;
    if (!e)
      throw new Error(`ClockKey not initialized for Project ${this.document.name}`);
    let a;
    if (h.isInt(e.displayMode))
      a = e.displayMode;
    else if (e.displayMode === ne.presentCurrentClock)
      a = this.document.currentClock.index;
    else if (e.displayMode.startsWith("present"))
      a = h.pInt(e.displayMode.slice(7));
    else
      return !1;
    return this.document.clockKey.getClockByIndex(a) ?? !1;
  }
  getClockKeyComponents(e) {
    const { clockKey: a } = this.document;
    if (!a)
      throw new Error(`ClockKey not initialized for Project ${this.document.name}`);
    return {
      clockKey: a,
      keyElems$: a.getElements$(e.find(".clock-key-panel"))
    };
  }
  switchToPresentAllClocks(e, a) {
    const { clocks: r } = a, i = e.switchToMode(a, ne.clocks);
    e.size > 1 && e.visibleClocks.forEach((o, n) => {
      const { clockLabel$: l } = r[o.id];
      i.blurReveal(l, n === 0 ? ">" : "<+0.05");
    }), i.play().then(() => {
      this._htmlContext && this.document.currentClock && this._htmlContext.find(".sheet-subtitle").attr("data-action", "current-clock-name").val(this.document.currentClock.name);
    });
  }
  switchToPresentClock(e, a, r) {
    const i = a.switchToMode(
      r,
      e === ne.presentCurrentClock ? e : `present${e}`,
      void 0,
      void 0,
      !0,
      () => {
        eLog.checkLog3("BladesProject", "Clock Switch", { clockRef: e, clockKey: a, keyElems$: r, htmlContext: this._htmlContext, presentedClock: this.presentedClock }), this._htmlContext && this.presentedClock && this._htmlContext.find(".sheet-subtitle").attr("data-action", "presented-clock-name").val(this.presentedClock.name);
      }
    );
    i.to(r.container$.find(".clock-label, .clock-key-label"), { autoAlpha: 0, duration: 0.5, ease: "sine" }, 0), i.play().then();
  }
  activateClockKeyListeners(e, a) {
    eLog.checkLog2("BladesProject", "Clock Key Data", { clockKey: e, keyElems$: a });
    const { container$: r } = a;
    r.css("pointer-events", "auto"), r.on("contextmenu", () => {
      this.switchToPresentAllClocks(e, a);
    }), Object.entries(a.clocks).forEach(([i, o]) => {
      o.clockContainer$.css("pointer-events", "auto"), o.clockContainer$.on("click", () => {
        var n;
        this.switchToPresentClock(
          ((n = e.clocks.get(i)) == null ? void 0 : n.index) ?? ne.presentCurrentClock,
          e,
          a
        );
      });
    });
  }
  async activateListeners(e) {
    this._htmlContext = e, await super.activateListeners(e);
    const { clockKey: a, keyElems$: r } = this.getClockKeyComponents(e);
    e.find("input.sheet-subtitle").on({
      change: (i) => {
        i.preventDefault();
        const o = $(i.currentTarget).data("action");
        eLog.checkLog3("BladesProject", "Clock Name Change", { action: o, value: $(i.currentTarget).val() }), o === "presented-clock-name" && this.presentedClock ? (this.presentedClock.updateTarget("name", $(i.currentTarget).val()), r.clocks[this.presentedClock.id].clockLabel$.text($(i.currentTarget).val())) : o === "current-clock-name" && (this.document.clockKey.currentClock.updateTarget("name", $(i.currentTarget).val()), r.clocks[this.document.clockKey.currentClock.id].clockLabel$.text($(i.currentTarget).val())), a.formatLabels(r);
      }
    }), a.initElementsInContext(e), this.activateClockKeyListeners(a, r), await Promise.all([
      ...a.visibleClocks.map((i) => new Promise((o) => {
        const n = r.clocks[i.id];
        i.reveal_Animation(n, () => {
          o();
        });
      })),
      ...a.activeClocks.map((i) => new Promise((o) => {
        const n = r.clocks[i.id];
        i.activate_Animation(n, () => {
          o();
        });
      }))
    ]);
  }
}
class ms extends k {
  constructor() {
    super(...arguments);
    w(this, "_clockKey");
  }
  // #region INITIALIZATION ~
  static async Initialize() {
    return Object.assign(globalThis, { BladesProject: ms, BladesProjectSheet: $s }), Items.registerSheet("blades", $s, { types: ["project"], makeDefault: !0 }), loadTemplates(["systems/eunos-blades/templates/items/project-sheet.hbs"]);
  }
  // #endregion
  static IsType(e) {
    return super.IsType(e, g.project);
  }
  static async create(e, a = {}) {
    const r = await super.create(e, { ...a, renderSheet: !1 });
    return r._clockKey || (r._clockKey = await le.Create({
      name: r.name,
      target: r,
      targetKey: "system.clocksData",
      isNameVisible: !1,
      isSpotlit: !1,
      isVisible: !0,
      displayMode: ne.clocks
      // oneKeyIndex: U.gsap.utils.random(0, 4, 1) as OneKeyImgIndex
    }, void 0, [{
      name: "",
      index: 0,
      color: me.yellow,
      value: 0,
      max: 8,
      isVisible: !0,
      isActive: !0,
      isNameVisible: !1,
      isHighlighted: !1
    }])), r;
  }
  get clockKey() {
    var r, i, o;
    if (this._clockKey)
      return this._clockKey;
    const e = Object.values(this.system.clocksData);
    if (e.length === 0)
      throw new Error(`ClockKey not initialized for Project ${this.name}`);
    let a;
    if (e.length === 1)
      a = e[0].id;
    else if (this.isEmbedded) {
      if (a = (r = e.find((n) => {
        var l;
        return n.targetID.includes((l = this.parent) == null ? void 0 : l.id);
      })) == null ? void 0 : r.id, !a)
        throw new Error(`ClockKey not initialized for Project ${this.name} embedded in document '${(i = this.parent) == null ? void 0 : i.name}'.`);
    } else if (a = (o = e.find((n) => /^Item\.[^.]{16}$/.exec(n.targetID))) == null ? void 0 : o.id, !a)
      throw new Error(`ClockKey not initialized for Project ${this.name}.`);
    if (this._clockKey = game.eunoblades.ClockKeys.get(a) ?? new le(this.system.clocksData[a]), !this._clockKey)
      throw new Error(`ClockKey not initialized for Project ${this.name}`);
    return this._clockKey;
  }
  get ownerName() {
    if (this.parent)
      return this.parent.name;
  }
  get currentClock() {
    return this.clockKey.currentClock;
  }
  get isComplete() {
    return this.clockKey.isComplete;
  }
  get rollOppClock() {
    var e;
    return (e = this.currentClock) == null ? void 0 : e.data;
  }
  async advanceClock(e = 1) {
    if (this.currentClock)
      return this.currentClock.fillSegments(e);
  }
  get rollFactors() {
    const e = {};
    return [
      m.tier,
      m.quality
    ].forEach((a, r) => {
      const i = this.getFactorTotal(a);
      e[a] = {
        name: a,
        value: i,
        max: i,
        baseVal: i,
        display: a === m.tier ? h.romanizeNum(i) : `${i}`,
        isActive: r === 0,
        isPrimary: r === 0,
        isDominant: !1,
        highFavorsPC: !0,
        cssClasses: `factor-gold${r === 0 ? " factor-main" : ""}`
      };
    }), e;
  }
  getFactorTotal(e) {
    switch (e) {
      case m.tier:
        return this.system.tier.value;
      case m.quality:
        return this.getFactorTotal(m.tier);
    }
    return 0;
  }
  get rollOppImg() {
    return "";
  }
  get keyElem() {
    if (this.clockKey)
      return $(`#${this.clockKey.id}`)[0];
  }
  get currentClockElem() {
    if (this.keyElem && this.currentClock)
      return $(this.keyElem).find(`.clock[data-id="${this.currentClock.id}"]`)[0];
  }
}
const ft = ms;
class xa extends k {
  get rollFactors() {
    const t = {};
    return [
      m.tier,
      m.quality,
      m.scale
    ].forEach((e, a) => {
      const r = this.getFactorTotal(e);
      t[e] = {
        name: e,
        value: r,
        max: r,
        baseVal: r,
        display: e === m.tier ? h.romanizeNum(r) : `${r}`,
        isActive: a === 0,
        isPrimary: a === 0,
        isDominant: !1,
        highFavorsPC: !0,
        cssClasses: `factor-gold${a === 0 ? " factor-main" : ""}`
      };
    }), t;
  }
  getFactorTotal(t) {
    switch (t) {
      case m.tier:
        return this.system.tier.value;
      case m.quality:
        return this.getFactorTotal(m.tier);
      case m.scale:
        return this.system.scale;
    }
    return 0;
  }
  get rollOppImg() {
    return this.img ?? "";
  }
  // #region OVERRIDES: _onUpdate
  // override async _onUpdate(changed: any, options: any, userId: string) {
  //   await super._onUpdate(changed, options, userId);
  //   BladesActor.GetTypeWithTags(BladesActorType.pc).forEach((actor) => actor.render());
  // }
  // #endregion
}
class fs extends k {
  static async Initialize() {
    const t = game.items.find((e) => e.type === "clock_keeper");
    return t ? game.eunoblades.ClockKeeper = t : game.eunoblades.ClockKeeper = await fs.create({
      name: "Clock Keeper",
      type: "clock_keeper",
      img: "systems/eunos-blades/assets/icons/misc-icons/clock-keeper.svg"
    }), loadTemplates([
      "systems/eunos-blades/templates/parts/clock-sheet-key-controls.hbs",
      "systems/eunos-blades/templates/parts/clock-sheet-clock-controls.hbs"
    ]);
  }
  showClockKeyControls(t) {
    var e;
    (e = this.sheet) != null && e.element;
  }
  hideClockKeyControls(t) {
    var e;
    (e = this.sheet) != null && e.element;
  }
  // #region CLOCKS OVERLAY
  get clockKeys() {
    return this.getSceneKeys();
  }
  get currentScene() {
    var t, e;
    return (e = (t = game.scenes) == null ? void 0 : t.current) == null ? void 0 : e.id;
  }
  get currentSceneID() {
    var t;
    if (!((t = game.scenes) != null && t.current))
      throw new Error("[BladesClockKeeper.currentScene] Error retrieving 'game.scenes.current'.");
    return game.scenes.current.id;
  }
  get targetSceneID() {
    return this.system.targetScene ?? this.currentSceneID;
  }
  get keys() {
    return new Collection(
      Object.entries(this.system.clocksData ?? {}).map(([t, e]) => [
        t,
        game.eunoblades.ClockKeys.get(t) ?? new le(e)
      ])
    );
  }
  getSceneKeys(t) {
    return t ?? (t = this.targetSceneID), new Collection(Array.from(game.eunoblades.ClockKeys).filter((e) => e.sceneIDs.includes(t)).map((e) => [e.id, e]));
  }
  async addClockKey(t = {}) {
    var a;
    return (a = t.sceneIDs) != null && a.length || (t.sceneIDs = [this.targetSceneID]), await le.Create({
      target: this,
      targetKey: "system.clocksData",
      ...t
    });
  }
  async deleteClockKey(t) {
    var e;
    await ((e = game.eunoblades.ClockKeys.get(t)) == null ? void 0 : e.delete(game.eunoblades.ClockKeys));
  }
  async addClockToKey(t, e) {
    const a = await game.eunoblades.ClockKeys.get(t);
    a && await a.addClock(e);
  }
  async deleteClockFromKey(t, e) {
    const a = await game.eunoblades.ClockKeys.get(t);
    a && await a.deleteClock(e);
  }
  // #endregion
  // #region OVERRIDES: prepareDerivedData, _onUpdate
  prepareDerivedData() {
    var t, e;
    super.prepareDerivedData(), (e = this.system).targetScene ?? (e.targetScene = ((t = game.scenes.current) == null ? void 0 : t.id) || null);
  }
  // #endregion
}
const Rt = fs;
class Je extends k {
  static async Initialize() {
    const t = game.items.find((e) => k.IsType(e, g.gm_tracker));
    t ? game.eunoblades.Tracker = t : game.eunoblades.Tracker = await Je.create({
      name: "GM Tracker",
      type: "gm_tracker",
      img: "systems/eunos-blades/assets/icons/misc-icons/gm-tracker.svg"
    });
  }
  get phase() {
    return this.system.phase ?? N.Freeplay;
  }
  set phase(t) {
    this.update({ "system.phase": t });
  }
  prepareDerivedData() {
    this.system.phases = Object.values(N);
  }
  // #region OVERRIDES: prepareDerivedData, _onUpdate
  async _onUpdate(...t) {
    await super.callOnUpdate(...t), I.GetTypeWithTags(b.pc).forEach((e) => e.render());
  }
  // #endregion
}
class Rs extends Xe {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["eunos-blades", "sheet", "item", "score-sheet"],
      template: "systems/eunos-blades/templates/items/score-sheet.hbs",
      width: 900,
      submitOnChange: !1,
      height: 970
    });
  }
  async generateRandomizerData(t) {
    const e = {
      Bargains: Object.fromEntries(Object.entries(h.sample(H.GM.Bargains.filter((r) => !Object.values(this.document.system.randomizers.Bargains).some((i) => i.name === r.name || i.effect === r.effect)), 3, !0, (r, i) => i.filter((o) => r.category === o.category).length === 0)).map(([r, i]) => (r = `${r}`, Object.assign(i, { notes: "" }), [r, i]))),
      Obstacles: Object.fromEntries(Object.entries(h.sample(H.GM.Obstacles.filter((r) => !Object.values(this.document.system.randomizers.Obstacles).some((i) => i.name === r.name || i.desc === r.desc)), 3, !0, (r, i) => i.filter((o) => r.category === o.category).length === 0)).map(([r, i]) => (r = `${r}`, Object.assign(i, { notes: "" }), [r, i]))),
      NPCs: Object.fromEntries(Object.entries(h.sample(
        H.GM.NPCs.filter(
          (r) => !Object.values(this.document.system.randomizers.NPCs).some((i) => i.name === r.name || i.description === r.description)
        ),
        3,
        !0,
        (r, i) => i.filter((o) => r.arena === o.arena).length === 0
      )).map(([r, i]) => (r = `${r}`, Object.assign(i, { notes: "" }), [r, i]))),
      Scores: Object.fromEntries(Object.entries(h.sample(H.GM.Scores.filter((r) => !Object.values(this.document.system.randomizers.Scores).some((i) => i.name === r.name || i.desc === r.desc)), 3, !0, (r, i) => i.filter((o) => r.category === o.category).length === 0)).map(([r, i]) => (r = `${r}`, Object.assign(i, { notes: "" }), [r, i])))
    };
    t && Object.keys(e).filter((r) => r !== t).forEach((r) => {
      const i = r;
      e[i] = this.document.system.randomizers[i];
    });
    const a = {
      Bargains: {},
      Obstacles: {},
      NPCs: {},
      Scores: {}
    };
    Object.keys(e).forEach((r) => {
      const i = r;
      Object.keys(e[i]).forEach((o) => {
        var n;
        (n = this.document.system.randomizers) != null && n[i][o].isLocked ? a[i][o] = this.document.system.randomizers[i][o] : a[i][o] = e[i][o];
      });
    }), await this.document.update({ "system.randomizers": a });
  }
  getData() {
    const t = super.getData(), e = {};
    e.playerCharacters = I.GetTypeWithTags(b.pc, A.PC.ActivePC).map((r) => Object.assign(
      r,
      {
        actionData: Object.fromEntries(Object.entries(r.system.attributes).map(([i, o]) => [
          i,
          Object.fromEntries(Object.entries(o).map(([n, l]) => [
            h.uCase(n).slice(0, 3),
            l
          ]))
        ]))
      }
    ));
    const a = {};
    for (const [r, i] of Object.entries(t.system.oppositions))
      !i.rollOppName && !i.rollOppSubName || (a[r] = i);
    return t.system.oppositions = a, {
      ...t,
      ...e
    };
  }
  _toggleRandomizerLock(t) {
    const e = $(t.currentTarget), a = e.data("category"), r = `${e.data("index")}`;
    `${e.data("value")}` == "true" ? this.document.update({ [`system.randomizers.${a}.${r}.isLocked`]: !1 }) : this.document.update({ [`system.randomizers.${a}.${r}.isLocked`]: !0 });
  }
  _selectImage(t) {
    const a = $(t.currentTarget).data("imgNum");
    this.document.update({ "system.imageSelected": a });
  }
  _deselectOrDeleteImage(t) {
    const a = $(t.currentTarget).data("imgNum");
    if (this.document.system.imageSelected === a) {
      this.document.update({ "system.-=imageSelected": null });
      return;
    }
    const r = { ...this.document.system.images };
    this.document.update({ "system.-=images": null }).then(() => this.document.update({
      "system.images": Object.fromEntries(Object.entries(Object.values(r).filter((i, o) => h.pInt(a) !== o)))
    }));
  }
  _addImage() {
    h.displayImageSelector(
      (t) => {
        const e = h.objSize(this.document.system.images);
        return this.document.update({ [`system.images.${e}`]: t });
      },
      "systems/eunos-blades/assets",
      this.position
    );
  }
  _selectRollOpposition(t) {
    var r;
    eLog.checkLog3("Select Roll Opposition", { event: t });
    const a = $(t.currentTarget).data("oppId");
    this.document.update({ "system.oppositionSelected": a }), ((r = yt.Active) == null ? void 0 : r.id) === this.document.id && Ie.Active && (Ie.Active.rollOpposition = new he(
      Ie.Active,
      this.document.system.oppositions[a]
    ));
  }
  _triggerRandomize(t) {
    const a = $(t.currentTarget).data("category");
    a && a in H.GM ? this.generateRandomizerData(a) : this.generateRandomizerData();
  }
  async _updateGMNotesOnPC(t) {
    const e = $(t.currentTarget), a = I.Get(e.data("id"));
    if (!a)
      throw new Error(`Unable to retrieve actor with id '${e.data("id")}'`);
    const r = t.currentTarget.innerHTML;
    eLog.checkLog3("scoreSheet", "Retrieved Text, Updating ...", { updateText: r }), await a.update({ "system.gm_notes": r }), eLog.checkLog3("scoreSheet", "Updated!", { gm_notes: a.system.gm_notes });
  }
  async activateListeners(t) {
    super.activateListeners(t), t.find("[data-action='select-image']").on({
      click: this._selectImage.bind(this),
      contextmenu: this._deselectOrDeleteImage.bind(this)
    }), t.find("[data-action='add-image']").on({
      click: this._addImage.bind(this)
    }), t.find(".roll-opposition-name").on({
      dblclick: this._selectRollOpposition.bind(this)
    }), t.find(".toggle-lock").on({
      click: this._toggleRandomizerLock.bind(this)
    }), t.find("[data-action='randomize'").on({
      click: this._triggerRandomize.bind(this)
    }), t.find("textarea.pc-summary-notes-body").on({
      change: this._updateGMNotesOnPC.bind(this)
    });
  }
  async _onSubmit(t, e = {}) {
    let a = !0;
    const r = this.item.system.phase, i = await super._onSubmit(t, e), o = this.item.system.phase;
    if (r !== o) {
      switch (r) {
        case N.CharGen:
          break;
        case N.Freeplay:
          break;
        case N.Score: {
          a = !1, game.actors.filter((n) => I.IsType(n, b.pc)).forEach((n) => n.clearLoadout());
          break;
        }
        case N.Downtime:
          break;
      }
      switch (o) {
        case N.CharGen:
          break;
        case N.Freeplay:
          break;
        case N.Score:
          break;
        case N.Downtime:
          break;
      }
    }
    return a && game.actors.filter((n) => n.type === b.pc).forEach((n) => {
      var l;
      return (l = n.sheet) == null ? void 0 : l.render();
    }), i;
  }
}
class ys extends k {
  // #region INITIALIZATION ~
  static async Initialize() {
    return Object.assign(globalThis, { BladesScore: ys, BladesScoreSheet: Rs }), Items.registerSheet("blades", Rs, { types: ["score"], makeDefault: !0 }), loadTemplates(["systems/eunos-blades/templates/items/score-sheet.hbs"]);
  }
  // #endregion
  static get Active() {
    return k.GetTypeWithTags(g.score).find((t) => t.system.isActive);
  }
  static set Active(t) {
    var e;
    (e = k.GetTypeWithTags(g.score).find((a) => a.system.isActive)) == null || e.update({ "system.isActive": !1 }).then(() => {
      t && t.update({ "system.isActive": !0 });
    });
  }
  // #region BladesRoll.OppositionData Implementation
  get rollFactors() {
    const t = this.getFactorTotal(m.tier);
    return {
      [m.tier]: {
        name: "Tier",
        value: t,
        max: t,
        baseVal: t,
        display: h.romanizeNum(t),
        isActive: !0,
        isPrimary: !0,
        isDominant: !1,
        highFavorsPC: !0,
        cssClasses: "factor-gold factor-main"
      }
    };
  }
  get rollOppImg() {
    return this.img ?? "";
  }
  getFactorTotal(t) {
    switch (t) {
      case m.tier:
        return this.system.tier.value;
      case m.quality:
        return this.getFactorTotal(m.tier);
      case m.scale:
        return 0;
      case m.magnitude:
        return 0;
      default:
        return 0;
    }
  }
  // #endregion
  // #region OVERRIDES: _onUpdate
  async _onUpdate(t, e, a) {
    super._onUpdate(t, e, a), I.GetTypeWithTags(b.pc).forEach((r) => r.render());
  }
  // #endregion
}
const yt = ys, Gt = {
  [g.clock_keeper]: Rt,
  [g.gm_tracker]: Je,
  [g.location]: xa,
  [g.project]: ft,
  [g.score]: yt
}, Ui = new Proxy(function() {
}, {
  construct(s, t) {
    const [{ type: e }] = t;
    if (!e)
      throw new Error(`Invalid Item Type: ${String(e)}`);
    const a = Gt[e];
    return a ? new a(...t) : new k(...t);
  },
  get(s, t) {
    switch (t) {
      case "create":
      case "createDocuments":
        return function(e, a = {}) {
          if (h.isArray(e))
            return e.map((i) => CONFIG.Item.documentClass.create(i, a));
          const r = Gt[e.type];
          return r ? r.create(e, a) : k.create(e, a);
        };
      case Symbol.hasInstance:
        return function(e) {
          return Object.values(Gt).some((a) => e instanceof a);
        };
      default:
        return k[t];
    }
  }
});
var te = /* @__PURE__ */ ((s) => (s.Heritage = "Heritage", s.Background = "Background", s.Vice = "Vice", s.Playbook = "Playbook", s.Reputation = "Reputation", s.Preferred_Op = "Preferred_Op", s.Gear = "Gear", s.Ability = "Ability", s.Faction = "Faction", s.Upgrade = "Upgrade", s.Cohort_Gang = "Cohort_Gang", s.Cohort_Expert = "Cohort_Expert", s.Feature = "Feature", s.Stricture = "Stricture", s.VicePurveyor = "VicePurveyor", s.Acquaintance = "Acquaintance", s.Friend = "Friend", s.Rival = "Rival", s.Crew = "Crew", s.Member = "Member", s.Contact = "Contact", s))(te || {});
class Ze extends Dialog {
  constructor(e, a) {
    super(e, a);
    w(this, "parent");
    w(this, "tabs");
    w(this, "dialogType");
    w(this, "tags", []);
    w(this, "width");
    w(this, "docType");
    // csqData?: Record<
    // Position,
    // Record<
    //   RollResult.partial|RollResult.fail,
    //   Record<
    //     string,
    //     BladesRoll.ConsequenceData
    //     >
    //   >
    // >;
    w(this, "prompt");
    w(this, "target");
    w(this, "flagTarget");
    switch (this.dialogType = e.dialogType ?? "Selection", this.parent = e.parent, this.width = (a == null ? void 0 : a.width) ?? 500, this.prompt = e.prompt, this.target = e.target, this.flagTarget = e.flagTarget, this.dialogType) {
      case "Input":
        return;
      case "Selection":
        this.constructSelectionData(
          e
          /* , options */
        );
        return;
      default:
        throw new Error(`Unrecognized type for BladesDialog constructor: '${this.dialogType}'`);
    }
  }
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["eunos-blades", "sheet", "dialog"],
      width: "auto",
      height: "auto",
      tabs: [{ navSelector: ".nav-tabs", contentSelector: ".tab-content", initial: "front" }]
    });
  }
  static Initialize() {
    return loadTemplates([
      "systems/eunos-blades/templates/dialog-selection.hbs",
      "systems/eunos-blades/templates/dialog-consequence.hbs",
      "systems/eunos-blades/templates/dialog-input.hbs",
      "systems/eunos-blades/templates/parts/dialog-consequence-block.hbs"
    ]);
  }
  static async DisplaySimpleInputDialog(e, a, r, i) {
    const o = new Ze({
      parent: e,
      title: e instanceof Ie ? "Roll Input" : `${e.name}: Input`,
      dialogType: "Input",
      content: "",
      prompt: a,
      target: r,
      flagTarget: i,
      buttons: {
        apply: {
          icon: '<i class="fa-solid fa-arrow-down-to-arc"></i>',
          label: "Apply",
          callback: (n) => o
          //   .writeToRollInstance(html as JQuery<HTMLElement>)
        },
        cancel: {
          icon: '<i class="fas fa-times"></i>',
          label: game.i18n.localize("Cancel"),
          callback: (n) => (eLog.checkLog3("dialog", "Callback Scope", { this: o, html: n }), !1)
        }
      },
      default: "apply"
    }, { classes: ["eunos-blades", "sheet", "dialog", "simple-input-dialog"] });
    return o._render(!0, { width: o.width }).then(() => eLog.checkLog3("dialog", "Input Dialog Instance", { this: o }));
  }
  static async DisplaySelectionDialog(e, a, r, i, o) {
    const n = new Ze({
      parent: e,
      title: a,
      docType: r,
      tabs: i,
      tags: o == null ? void 0 : o.filter((l) => l !== ""),
      content: "",
      buttons: {
        cancel: {
          icon: '<i class="fas fa-times"></i>',
          label: game.i18n.localize("Cancel"),
          callback: (l) => (eLog.checkLog3("dialog", "Callback Scope", { this: this, html: l }), !1)
        }
      },
      default: "cancel"
    });
    return n.hasItems ? n.render(!0, { width: n.width }) : void 0;
  }
  // static async DisplayRollConsequenceDialog(rollInst: BladesRoll) {
  // const app: BladesDialog = new BladesDialog({
  //   parent: rollInst,
  //   title: "Consequences",
  //   dialogType: BladesDialogType.Consequence,
  //   content: "",
  //   buttons: {
  //     apply: {
  //       icon: '<i class="fa-solid fa-arrow-down-to-arc"></i>',
  //       label: "Apply",
  //       callback: (html: HTMLElement|JQuery<HTMLElement>) => (app as BladesDialog)
  //         .writeToRollInstance(html as JQuery<HTMLElement>)
  //     },
  //     cancel: {
  //       icon: '<i class="fas fa-times"></i>',
  //       label: game.i18n.localize("Cancel"),
  //       callback: (html: JQuery|HTMLElement) => {
  //         eLog.checkLog3("dialog", "Callback Scope", {this: app, html});
  //         return false;
  //       }
  //     }
  //   },
  //   default: "apply"
  // }, {classes: ["eunos-blades", "sheet", "dialog", "consequence-dialog"]});
  // return app._render(true, {width: app.width}).then(() => eLog.checkLog3("dialog", "Dialog Instance", {this: app}));
  // }
  get template() {
    return `systems/eunos-blades/templates/dialog-${h.lCase(this.dialogType)}.hbs`;
  }
  get hasItems() {
    return Object.values(this.tabs ?? []).some((e) => e.length > 0);
  }
  constructSelectionData(e) {
    const a = [];
    if (e.tabs) {
      for (const [r, i] of Object.entries(e.tabs))
        i.length === 0 ? delete e.tabs[r] : a.push(r);
      a.length === 1 && !("Main" in e.tabs) && (e.tabs.Main = [...e.tabs[a[0]]], delete e.tabs[a[0]]), this.docType = e.docType, this.tabs = e.tabs, this.tags = e.tags ?? [], this.width = 150 * Math.ceil(Math.sqrt(Object.values(e.tabs)[0].length));
    }
  }
  // constructConsequenceData(data: BladesDialog.Data/* , options?: Partial<BladesDialog.Options> */) {
  //   eLog.checkLog3("dialog", "constructConsequenceData", {incoming: {...data}});
  //   if (!(this.parent instanceof BladesRoll)) { throw new Error("Cannot call 'constructConsequenceData' without a rollInst parent!"); }
  //   // Get existing consequence data, if any, on roll instance
  //   const rollCsqData = this.parent.data.consequenceData ?? {};
  //   // Extend consequence data by applying new blank consequence instances,
  //   //   so at least three csq entries are available for each position/result combination
  //   (Object.values(Position) as Position[]).forEach((rollPos: Position) => {
  //     rollCsqData[rollPos] ??= {
  //       [RollResult.partial]: {},
  //       [RollResult.fail]: {}
  //     };
  //     ([RollResult.partial, RollResult.fail] as const).forEach((rollResult: RollResult.partial|RollResult.fail) => {
  //       rollCsqData[rollPos] ??= {};
  //       rollCsqData[rollPos][rollResult] ??= {};
  //       while (Object.values(rollCsqData[rollPos][rollResult as RollResult.partial|RollResult.fail]).length < 3) {
  //         const blankCsqData: BladesConsequence.Data = {
  //           id: randomID() as IDString,
  //           name: "",
  //           type: "",
  //           attribute: ""
  //         };
  //         rollCsqData[rollPos][rollResult as RollResult.partial|RollResult.fail][blankCsqData.id] = blankCsqData;
  //       }
  //     });
  //   });
  //   this._consequenceAI = new BladesAI(AGENTS.ConsequenceAdjuster);
  //   return rollCsqData;
  // }
  getData() {
    const e = super.getData();
    switch (this.dialogType) {
      case "Input":
        return this.prepareInputData(e);
      case "Selection":
        return this.prepareSelectionData(e);
      default:
        return null;
    }
  }
  prepareInputData(e) {
    return e.prompt = this.prompt, e.target = this.target, e.flagTarget = this.flagTarget, e;
  }
  prepareSelectionData(e) {
    return e.title = this.title, e.tabs = this.tabs, e.docType = this.docType, e.tags = this.tags, e;
  }
  // prepareConsequenceData(data: BladesDialog.Data) {
  //   eLog.checkLog3("dialog", "prepareConsequenceData this.csqData", {...this.csqData});
  //   eLog.checkLog3("dialog", "prepareConsequenceData", {incoming: {...data}});
  //   data.consequenceData = this.csqData;
  //   data.consequenceTypeOptions = this.consequenceTypeOptions;
  //   data.consequenceTypeOptionsAll = Object.keys(C.ConsequenceDisplay)
  //     .map((cType) => ({value: cType, display: cType}));
  //   data.consequenceAttributeOptions = [
  //     {value: AttributeTrait.insight, display: "Insight"},
  //     {value: AttributeTrait.prowess, display: "Prowess"},
  //     {value: AttributeTrait.resolve, display: "Resolve"}
  //   ];
  //   eLog.checkLog3("dialog", "prepareConsequenceData", {outgoing: {...data}});
  //   return data;
  // }
  // get consequenceTypeOptions(): Record<
  //   Position,
  //   Record<
  //     RollResult.partial|RollResult.fail,
  //     Array<BladesSelectOption<string, ConsequenceType>>
  //   >
  //   > {
  //   if (this.parent instanceof BladesRoll) {
  //     const returnData: Partial<Record<
  //     Position,
  //     Record<
  //       RollResult.partial|RollResult.fail,
  //       Array<BladesSelectOption<string, ConsequenceType>>
  //     >
  //   >> = {};
  //     [Position.controlled, Position.risky, Position.desperate].forEach((pos) => {
  //       returnData[pos] = {
  //         [RollResult.partial]: C.Consequences[pos][RollResult.partial]
  //           .map((cType) => ({value: cType, display: cType})),
  //         [RollResult.fail]: C.Consequences[pos][RollResult.fail]
  //           .map((cType) => ({value: cType, display: cType}))
  //       };
  //     });
  //     return returnData as Record<
  //     Position,
  //     Record<
  //       RollResult.partial|RollResult.fail,
  //       Array<BladesSelectOption<string, ConsequenceType>>
  //     >
  //   >;
  //   }
  //   return {} as never;
  // }
  updateInputText(e) {
    const a = e.val();
    if (this.parent instanceof Ie) {
      const r = e.data("flagTarget");
      eLog.checkLog3("dialog", "updateInputText", { value: a, flagTarget: r }), this.parent.updateTarget(r, a).then(() => this.parent.renderRollCollab_SocketCall());
    } else
      (this.parent instanceof k || this.parent instanceof I) && this.parent.update({ [e.data("target")]: e.val() });
  }
  // updateConsequenceType(csqElem$: JQuery<HTMLElement>, cData: BladesConsequence.Data) {
  //   const type$ = csqElem$.find(".roll-consequence-type-select") as JQuery<HTMLSelectElement>;
  //   const typeVal = type$.val() as string|undefined;
  //   if (typeVal && typeVal in ConsequenceType) {
  //     cData.type = typeVal as ConsequenceType;
  //     cData.icon = C.ConsequenceIcons[cData.type];
  //     cData.typeDisplay = C.ConsequenceDisplay[cData.type];
  //   }
  // }
  // updateConsequenceAttribute(csqElem$: JQuery<HTMLElement>, cData: BladesConsequence.Data) {
  //   if (/Insight/.exec(cData.type)) { cData.attribute = AttributeTrait.insight; }
  //   else if (/Prowess/.exec(cData.type)) { cData.attribute = AttributeTrait.prowess; }
  //   else if (/Resolve/.exec(cData.type)) { cData.attribute = AttributeTrait.resolve; }
  //   else {
  //     const attribute$ = csqElem$.find(".roll-consequence-attribute-select") as JQuery<HTMLSelectElement>;
  //     const attrVal = attribute$.val() as AttributeTrait|undefined;
  //     if (attrVal) {
  //       cData.attribute = attrVal;
  //     }
  //   }
  // }
  // updateConsequenceAttributeVal(cData: BladesConsequence.Data) {
  //   if (this.parent.rollPrimaryDoc instanceof BladesPC) {
  //     cData.attributeVal = this.parent.rollPrimaryDoc.attributes[cData.attribute as AttributeTrait];
  //   } else if (this.parent.rollPrimaryDoc?.parent instanceof BladesPC) {
  //     cData.attributeVal = this.parent.rollPrimaryDoc.parent.attributes[cData.attribute as AttributeTrait];
  //   } else {
  //     eLog.error(`Unable to get attribute from rollPrimaryDoc '${this.parent.rollPrimaryDoc?.name}' of type '${this.parent.rollPrimaryDoc?.rollPrimaryType}' (may need to log via flags if either of the previous show 'undefined'.`);
  //   }
  // }
  // getSelectedResistOption(cData: BladesConsequence.Data): BladesConsequence|false {
  //   return cData.resistTo
  //     ? new BladesConsequence(cData.resistTo)
  //     : false;
  // }
  // updateConsequenceResist(csqElem$: JQuery<HTMLElement>, cData: BladesConsequence.Data) {
  //   const resistOptions: Record<string, BladesRoll.ConsequenceResistOption> = cData.resistOptions ?? {};
  //   // If consequence is already minimal, toggle resistNegates to true and set 'resistTo' to None-type
  //   const minimalCsqTypes = Object.entries(C.ResistedConsequenceTypes)
  //     .filter(([_, rCsqType]) => rCsqType === ConsequenceType.None)
  //     .map(([csqType]) => csqType as ConsequenceType);
  //   if (minimalCsqTypes.includes(cData.type as ConsequenceType)) {
  //     cData.resistNegates = true;
  //     const noneCsq = BladesConsequence.None;
  //     cData.resistOptions = {[noneCsq.id]: noneCsq};
  //     cData.resistTo = noneCsq;
  //     return;
  //   } else {
  //     // Clear 'resistTo' (will be redetermined below)
  //     delete cData.resistTo;
  //     delete cData.resistNegates;
  //     csqElem$.find(".consequence-resist-option").each((_, elem) => {
  //       const resCsqID = $(elem).data("csq-id");
  //       resistOptions[resCsqID] ??= {id: resCsqID, name: "", type: undefined, isSelected: false};
  //       // Update Resistance Option Type
  //       const resType$ = $(elem).find(".roll-consequence-type-select") as JQuery<HTMLSelectElement>;
  //       const resTypeVal = resType$.val() as string|undefined;
  //       if (resTypeVal && resTypeVal in ConsequenceType) {
  //         resistOptions[resCsqID].type = resTypeVal as ConsequenceType;
  //         resistOptions[resCsqID].icon = C.ConsequenceIcons[resistOptions[resCsqID].type as ConsequenceType];
  //         resistOptions[resCsqID].typeDisplay = C.ConsequenceDisplay[resistOptions[resCsqID].type as ConsequenceType];
  //       }
  //       // Update Resistance Option Name
  //       const resName$ = $(elem).find(".consequence-name") as JQuery<HTMLInputElement>;
  //       const resNameVal = resName$.val();
  //       resistOptions[resCsqID].name = resNameVal ?? "";
  //       // If this is selected, update 'resistTo' data as well
  //       if (resistOptions[resCsqID].isSelected) {
  //         cData.resistTo = resistOptions[resCsqID];
  //       }
  //     });
  //   }
  //   cData.resistOptions = resistOptions;
  // }
  // updateConsequenceArmorResist(_csqElem$: JQuery<HTMLElement>, cData: BladesConsequence.Data) {
  //   // If consequence is already minimal, toggle armorNegates to true and set 'armorTo' to None-type
  //   const minimalCsqTypes = Object.entries(C.ResistedConsequenceTypes)
  //     .filter(([_, rCsqType]) => rCsqType === ConsequenceType.None)
  //     .map(([csqType]) => csqType as ConsequenceType);
  //   if (minimalCsqTypes.includes(cData.type as ConsequenceType)) {
  //     cData.armorNegates = true;
  //     cData.armorTo = BladesConsequence.None;
  //   } else {
  //     delete cData.armorNegates;
  //     cData.armorTo = this.getSelectedResistOption(cData);
  //   }
  // }
  // updateConsequenceSpecialArmorResist(_csqElem$: JQuery<HTMLElement>, cData: BladesConsequence.Data) {
  //   // If consequence is already minimal, toggle specialArmorNegates to true and set 'specialTo' to None-type
  //   const minimalCsqTypes = Object.entries(C.ResistedConsequenceTypes)
  //     .filter(([_, rCsqType]) => rCsqType === ConsequenceType.None)
  //     .map(([csqType]) => csqType as ConsequenceType);
  //   if (minimalCsqTypes.includes(cData.type as ConsequenceType)) {
  //     cData.specialArmorNegates = true;
  //     cData.specialTo = BladesConsequence.None;
  //   } else {
  //     delete cData.specialArmorNegates;
  //     cData.specialArmorNegates ??= false;
  //     cData.specialTo = this.getSelectedResistOption(cData);
  //   }
  // }
  // updateConsequenceData(
  //   html: JQuery<HTMLElement|HTMLInputElement>,
  //   cData: BladesConsequence.Data
  // ) {
  //   const csqElem$ = html.find(`.roll-consequence-row[data-csq-id='${cData.id}']`);
  //   // Update Type
  //   this.updateConsequenceType(csqElem$, cData);
  //   // Update Name
  //   if (cData.type === ConsequenceType.None) {
  //     cData.name = "";
  //   } else {
  //     const name$ = csqElem$.find(".consequence-name") as JQuery<HTMLInputElement>;
  //     const nameVal = name$.val();
  //     cData.name = nameVal ?? "";
  //   }
  //   // Update Resistance Attribute
  //   this.updateConsequenceAttribute(csqElem$, cData);
  //   this.updateConsequenceAttributeVal(cData);
  //   // Update Resistance Options
  //   this.updateConsequenceResist(csqElem$, cData);
  //   // Update Armor Options
  //   if ((<BladesRoll> this.parent).canResistWithArmor(cData)) {
  //     cData.isDisplayingArmorToggle = true;
  //     this.updateConsequenceArmorResist(csqElem$, cData);
  //   } else {
  //     cData.isDisplayingArmorToggle = false;
  //   }
  //   // Update Special Armor Options
  //   if ((<BladesRoll> this.parent).canResistWithSpecialArmor(cData)) {
  //     cData.isDisplayingSpecialArmorToggle = true;
  //     this.updateConsequenceSpecialArmorResist(csqElem$, cData);
  //   } else {
  //     cData.isDisplayingSpecialArmorToggle = false;
  //   }
  //   return cData;
  // }
  // updateConsequenceDialog(html: JQuery<HTMLElement|HTMLInputElement>, isRendering = true) {
  //   if (!(this.parent instanceof BladesRoll)) { return; }
  //   if (!this.csqData) { return; }
  //   eLog.checkLog3("dialog", "updateConsequenceDialog() this.csqData INCOMING", {...this.csqData});
  //   const {csqData} = this;
  //   const {rollPrimaryDoc} = this.parent;
  //   if (!(rollPrimaryDoc instanceof BladesPC)) { return; }
  //   (Object.keys(csqData) as Position[]).forEach((rollPos) => {
  //     const positionCsqData = csqData[rollPos];
  //     (Object.keys(csqData[rollPos]) as [RollResult.partial, RollResult.fail]).forEach((rollResult) => {
  //       positionCsqData[rollResult] = U.objMap(
  //         positionCsqData[rollResult],
  //         (cData: BladesConsequence.Data) => this.updateConsequenceData(html, cData)
  //       );
  //     });
  //     csqData[rollPos] = positionCsqData;
  //   });
  //   this.csqData = csqData;
  //   eLog.checkLog3("dialog", "updateConsequenceDialog() this.csqData OUTGOING", {...this.csqData});
  //   if (isRendering) {
  //     this.render();
  //   }
  // }
  // async writeToRollInstance(html: JQuery<HTMLElement>) {
  // if (this.parent instanceof BladesRoll) {
  // this.updateConsequenceDialog(html, false);
  // await this.parent.updateTarget("consequenceData", this.csqData);
  // }
  // }
  // _consequenceAI?: BladesAI;
  // getCsqDataFromElem(elem: HTMLElement, paramCount = 3): string[] {
  //   const dataAction = elem.dataset.action;
  //   if (dataAction) {
  //     const params = dataAction.split(/-/).reverse().slice(0, paramCount);
  //     return params.reverse();
  //   }
  //   return [];
  // }
  // async queryAI(event: ClickEvent) {
  //   if (!this.csqData) { return; }
  //   // If the AI generator has not been initialized, do so.
  //   if (!this._consequenceAI) {
  //     this._consequenceAI = new BladesAI(AGENTS.ConsequenceAdjuster);
  //   }
  //   const [rollPosition, rollResult, csqID] = this.getCsqDataFromElem(event.currentTarget);
  //   const csqName: string|undefined =
  //     this.csqData[rollPosition as Position][rollResult as RollResult.partial|RollResult.fail][csqID]?.name;
  //   if (csqName) {
  //     const response = await this._consequenceAI?.query(csqName, csqName);
  //     if (response) {
  //       this.refreshResistanceOptions(rollPosition as Position, rollResult as RollResult.partial|RollResult.fail, csqID, response.split("|"));
  //     }
  //   }
  // }
  // async spawnBlankResistOption(event: ClickEvent) {
  //   if (!this.csqData) { return; }
  //   const [rollPosition, rollResult, csqID] = this.getCsqDataFromElem(event.currentTarget);
  //   const rCsqID = randomID() as IDString;
  //   this.csqData[rollPosition as Position][rollResult as RollResult.partial|RollResult.fail][csqID]
  //     .resistOptions = {
  //       [rCsqID]: {
  //         id: rCsqID,
  //         name: "",
  //         type: undefined,
  //         isSelected: true
  //       }
  //     };
  //   this.render();
  // }
  // async setFlagVal(target: string, value: unknown) {
  //   if (this.parent instanceof BladesRoll) {
  //     await this.parent.updateTarget(target, value);
  //   }
  // }
  // async refreshResistanceOptions(rollPosition: Position, rollResult: RollResult, cID: string, rOptions: string[]) {
  //   if (!this.csqData) { return; }
  //   const cData = this.csqData[rollPosition][rollResult as RollResult.partial|RollResult.fail][cID];
  //   if (!cData) { return; }
  //   const cType = cData.type as keyof typeof C["ResistedConsequenceTypes"];
  //   const rType = C.ResistedConsequenceTypes[cType] ?? undefined;
  //   const resistOptions: Record<string, BladesRoll.ConsequenceResistOption> = {};
  //   for (let i = 0; i < rOptions.length; i++) {
  //     const rID = randomID() as IDString;
  //     resistOptions[rID] = {
  //       id: rID,
  //       name: rOptions[i],
  //       isSelected: false
  //     };
  //     if (rType) {
  //       resistOptions[rID].type = rType;
  //       resistOptions[rID].typeDisplay = C.ConsequenceDisplay[rType];
  //       resistOptions[rID].icon = C.ConsequenceIcons[rType];
  //     }
  //   }
  //   this.csqData[rollPosition][rollResult as RollResult.partial|RollResult.fail][cID].resistOptions = resistOptions;
  //   eLog.checkLog3("dialog", "addResistanceOptions() this.csqData", {...this.csqData});
  //   this.render();
  // }
  // async selectResistOption(event: ClickEvent) {
  //   if (!this.csqData) { return; }
  //   const [rollPosition, rollResult, csqID, resID] = this.getCsqDataFromElem(event.currentTarget, 4);
  //   eLog.checkLog3("dialog", "... Action Passed", {rollResult, csqIndex: csqID, resIndex: resID});
  //   // Get consequence data
  //   const cData = this.csqData[rollPosition as Position][rollResult as RollResult.partial|RollResult.fail][csqID];
  //   cData.resistOptions ??= {};
  //   // Toggle clicked resistance option
  //   cData.resistOptions[resID].isSelected = !cData.resistOptions[resID].isSelected;
  //   // If resistance option is now selected...
  //   if (cData.resistOptions[resID].isSelected) {
  //     // ... deselect & hide other options
  //     Object.keys(cData.resistOptions)
  //       .filter((key) => key !== resID)
  //       .forEach((key) => {
  //         Object.assign(cData.resistOptions?.[key] ?? {}, {isSelected: false, isVisible: false});
  //       });
  //     // ... and set 'resistTo' to this consequence.
  //     cData.resistTo = cData.resistOptions[resID];
  //   } else {
  //     // Otherwise, set 'resistTo' to false...
  //     cData.resistTo = false;
  //     // ... and unhide other options.
  //     Object.keys(cData.resistOptions)
  //       .filter((key) => key !== resID)
  //       .forEach((key) => {
  //         Object.assign(cData.resistOptions?.[key] ?? {}, {isVisible: true});
  //       });
  //   }
  //   // Assign new cData instance.
  //   this.csqData[rollPosition as Position][rollResult as RollResult.partial|RollResult.fail][csqID] = cData;
  //   this.render();
  // }
  // async clearResistOptions(event: ContextMenuEvent) {
  //   if (!this.csqData) { return; }
  //   const [rollPosition, rollResult, csqID] = this.getCsqDataFromElem(event.currentTarget);
  //   this.csqData[rollPosition as Position][rollResult as RollResult.partial|RollResult.fail][csqID].resistOptions = {};
  //   this.render();
  // }
  // async toggleArmor(event: ClickEvent) {
  //   if (!this.csqData) { return; }
  //   const [rollPosition, rollResult, csqID] = this.getCsqDataFromElem(event.currentTarget);
  //   const cData = this.csqData[rollPosition as Position][rollResult as RollResult.partial|RollResult.fail][csqID];
  //   cData.canArmor = !cData.canArmor;
  //   this.render();
  // }
  // async toggleSpecialArmor(event: ClickEvent) {
  //   if (!this.csqData) { return; }
  //   const [rollPosition, rollResult, csqID] = this.getCsqDataFromElem(event.currentTarget);
  //   const cData = this.csqData[rollPosition as Position][rollResult as RollResult.partial|RollResult.fail][csqID];
  //   cData.canSpecialArmor = !cData.canSpecialArmor;
  //   this.render();
  // }
  activateListeners(e) {
    switch (super.activateListeners(e), Ue(e), this.dialogType) {
      case "Input":
        this.activateInputListeners(e);
        break;
      case "Selection":
        this.activateSelectionListeners(e);
        break;
    }
  }
  activateInputListeners(e) {
    e.find("textarea").on({ change: (a) => this.updateInputText($(a.currentTarget)) });
  }
  activateSelectionListeners(e) {
    const a = this;
    e.find(".nav-tabs .tab-selector").on("click", (r) => {
      const i = h.pInt($(r.currentTarget).data("tab")), o = Object.values(a.tabs ?? [])[i].length, n = h.pInt(150 * Math.ceil(Math.sqrt(o)));
      eLog.checkLog3("nav", "Nav Tab Size Recalculation", { tabIndex: i, numItems: o, width: n }), this.render(!1, { width: n });
    }), e.find("[data-item-id]").on("click", function() {
      if ($(this).parent().hasClass("locked"))
        return;
      const r = $(this).data("itemId"), i = $(this).data("docType");
      eLog.checkLog("dialog", "[BladesDialog] on Click", { elem: this, docId: r, docType: i, parent: a.parent }), a.parent instanceof I && (i === "Actor" ? a.parent.addSubActor(r, a.tags) : i === "Item" && a.parent.addSubItem(r)), a.close();
    });
  }
  async close() {
    $("#eunos-blades-tooltips > *").remove(), super.close();
  }
  // activateConsequenceListeners(html: JQuery<HTMLElement>) {
  // html.find("input").on({change: () => this.updateConsequenceDialog(html)});
  // html.find("select").on({change: () => this.updateConsequenceDialog(html)});
  // html.find('[data-action^="ai-query"]').on({
  //   click: (event) => this.queryAI(event),
  //   contextmenu: (event) => this.clearResistOptions(event)
  // });
  // html.find('[data-action^="blank-option"]').on({
  //   click: (event) => this.spawnBlankResistOption(event),
  //   contextmenu: (event) => this.clearResistOptions(event)
  // });
  // html.find('[data-action^="gm-select-toggle"]').on({click: (event) => this.selectResistOption(event) });
  // html.find('[data-action^="toggle-armor"]').on({click: (event) => this.toggleArmor(event) });
  // html.find('[data-action^="toggle-special"]').on({click: (event) => this.toggleSpecialArmor(event) });
  // }
}
var _a = ((s) => (s[s.CharacterCrew = A.PC.CharacterCrew] = "CharacterCrew", s[s.VicePurveyor = A.NPC.VicePurveyor] = "VicePurveyor", s))(_a || {}), La = ((s) => (s[s.background = g.background] = "background", s[s.vice = g.vice] = "vice", s[s.crew_playbook = g.crew_playbook] = "crew_playbook", s[s.crew_reputation = g.crew_reputation] = "crew_reputation", s[s.heritage = g.heritage] = "heritage", s[s.playbook = g.playbook] = "playbook", s[s.preferred_op = g.preferred_op] = "preferred_op", s))(La || {});
class x extends Actor {
  constructor() {
    super(...arguments);
    // #endregion
    // #region BladesSubActor Implementation ~
    w(this, "parentActor");
  }
  // #region Static Overrides: Create ~
  static async create(e, a = {}) {
    return e.token = e.token || {}, e.system = e.system ?? {}, e.system.world_name = e.system.world_name ?? e.name.replace(/[^A-Za-z_0-9 ]/g, "").trim().replace(/ /g, "_"), await super.create(e, a);
  }
  // #endregion
  // #region BladesDocument Implementation ~
  static get All() {
    return game.actors;
  }
  static Get(e) {
    return e instanceof x ? e : h.isDocID(e) ? x.All.get(e) : x.All.find((a) => a.system.world_name === e) || x.All.find((a) => a.name === e);
  }
  static GetTypeWithTags(e, ...a) {
    return x.All.filter((r) => r.type === e).filter((r) => r.hasTag(...a));
  }
  static IsType(e, ...a) {
    const r = new Set(a);
    return e instanceof x && r.has(e.type);
  }
  get tags() {
    return this.system.tags ?? [];
  }
  hasTag(...e) {
    return e.every((a) => this.tags.includes(a));
  }
  async addTag(...e) {
    const a = this.tags;
    e.forEach((r) => {
      a.includes(r) || a.push(r);
    }), eLog.checkLog2("actor", "BladesActor.addTag(...tags)", { tags: e, curTags: a }), await this.update({ "system.tags": a });
  }
  async remTag(...e) {
    const a = this.tags.filter((r) => !e.includes(r));
    eLog.checkLog2("actor", "BladesActor.remTag(...tags)", { tags: e, curTags: a }), await this.update({ "system.tags": a });
  }
  get tooltip() {
    const e = [this.system.concept, this.system.subtitle].filter(Boolean).join("<br><br>");
    return e ? new Handlebars.SafeString(e).toString() : void 0;
  }
  get dialogCSSClasses() {
    return "";
  }
  getFactorTotal(e) {
    var a;
    switch (e) {
      case m.tier:
        return x.IsType(this, b.pc) ? this.system.tier.value + (((a = this.crew) == null ? void 0 : a.getFactorTotal(m.tier)) ?? 0) : this.system.tier.value;
      case m.quality:
        return this.getFactorTotal(m.tier);
      case m.scale:
        return x.IsType(this, b.npc) ? this.system.scale : 0;
      case m.magnitude:
        return x.IsType(this, b.npc) ? this.system.magnitude : 0;
      default:
        return 0;
    }
  }
  // #endregion
  // #region SubActorControl Implementation ~
  get subActors() {
    return Object.keys(this.system.subactors).map((e) => this.getSubActor(e)).filter((e) => !!e);
  }
  get activeSubActors() {
    return this.subActors.filter((e) => !e.hasTag(A.System.Archived));
  }
  get archivedSubActors() {
    return this.subActors.filter((e) => e.hasTag(A.System.Archived));
  }
  checkActorPrereqs(e) {
    return !!e;
  }
  processEmbeddedActorMatches(e) {
    return e.filter(this.checkActorPrereqs).filter((a) => !this.activeSubActors.some((r) => r.id === a.id)).map((a) => this.getSubActor(a) || a).sort((a, r) => a.name === r.name ? 0 : a.name === null ? 1 : r.name === null ? -1 : a.name > r.name ? 1 : a.name < r.name ? -1 : 0);
  }
  getDialogActors(e) {
    var r;
    const a = {};
    switch (e) {
      case te.Contact:
      case te.Rival:
      case te.Friend:
      case te.Acquaintance:
        return !x.IsType(this, b.pc, b.crew) || this.playbookName === null ? !1 : (a.Main = this.processEmbeddedActorMatches(
          x.GetTypeWithTags(b.npc, this.playbookName)
        ), a);
      case te.VicePurveyor:
        return !x.IsType(this, b.pc) || !((r = this.vice) != null && r.name) ? !1 : (a.Main = this.processEmbeddedActorMatches(
          x.GetTypeWithTags(b.npc, this.vice.name)
        ), a);
      case te.Crew:
        return a.Main = x.GetTypeWithTags(b.crew), a;
      default:
        return !1;
    }
  }
  async addSubActor(e, a) {
    let r;
    if (this.hasSubActorOf(e)) {
      const o = this.getSubActor(e);
      if (!o)
        return;
      o.hasTag(A.System.Archived) && await o.remTag(A.System.Archived), r = o;
    } else {
      const o = x.Get(e);
      if (!o)
        return;
      const n = {};
      a && (n.tags = h.unique([
        ...o.tags,
        ...a
      ])), await this.update({ [`system.subactors.${o.id}`]: n }), r = this.getSubActor(o.id);
    }
    if (!r)
      return;
    const i = r.tags.filter((o) => o in _a);
    i.length > 0 && i.forEach((o) => this.activeSubActors.filter(
      (n) => !!(r != null && r.id && n.id !== r.id && n.hasTag(o))
    ).map((n) => this.remSubActor(n.id)));
  }
  getSubActor(e) {
    const a = x.Get(e);
    if (!(a != null && a.id))
      return;
    if (!x.IsType(a, b.npc, b.faction))
      return a;
    const r = this.system.subactors[a.id] ?? {};
    return Object.assign(
      a.system,
      r
    ), a.parentActor = this, a;
  }
  hasSubActorOf(e) {
    const a = x.Get(e);
    return a && a != null && a.id ? a.id in this.system.subactors : !1;
  }
  async updateSubActor(e, a) {
    const r = h.objExpand(a);
    if (!r.system)
      return;
    const i = x.Get(e);
    if (!i)
      return;
    const o = h.objDiff(i.system, r.system), n = h.objMerge(
      this.system.subactors[i.id] ?? {},
      o,
      { isReplacingArrays: !0, isConcatenatingArrays: !1 }
    );
    if (JSON.stringify(this.system.subactors[i.id]) !== JSON.stringify(n))
      return this.update({ [`system.subactors.${i.id}`]: null }, void 0, !0).then(() => this.update({ [`system.subactors.${i.id}`]: n }, void 0, !0)).then(() => {
        var l;
        return (l = i.sheet) == null ? void 0 : l.render();
      });
  }
  async remSubActor(e) {
    const a = this.getSubActor(e);
    a && await this.update({ "system.subactors": mergeObject(this.system.subactors, { [`-=${a.id}`]: null }) }, void 0, !0);
  }
  async clearSubActors(e = !0) {
    var a;
    this.subActors.forEach((r) => {
      var i;
      ((i = r.parentActor) == null ? void 0 : i.id) === this.id && r.clearParentActor(e);
    }), await ((a = this.sheet) == null ? void 0 : a.render());
  }
  async clearParentActor(e = !0) {
    var r;
    const { parentActor: a } = this;
    a && (this.parentActor = void 0, this.system = this._source.system, this.ownership = this._source.ownership, this.prepareData(), e && await ((r = this.sheet) == null ? void 0 : r.render()));
  }
  // #endregion
  // #region SubItemControl Implementation ~
  get subItems() {
    return Array.from(this.items);
  }
  getSubItemsOfType(e) {
    return this.items.filter((a) => a.type === e);
  }
  get activeSubItems() {
    return this.items.filter((e) => !e.hasTag(A.System.Archived));
  }
  get archivedSubItems() {
    return this.items.filter((e) => e.hasTag(A.System.Archived));
  }
  _checkItemPrereqs(e) {
    if (!e.system.prereqs)
      return !0;
    for (const [a, r] of Object.entries(
      e.system.prereqs
    )) {
      const i = Array.isArray(r) ? r : [r.toString()], o = {};
      if (!this._processPrereqArray(i, a, o))
        return !1;
    }
    return !0;
  }
  _processPrereqArray(e, a, r) {
    for (; e.length; ) {
      const i = e.pop();
      if (r[a] ?? (r[a] = []), !this._processPrereqType(a, i, r))
        return !1;
    }
    return !0;
  }
  _processPrereqType(e, a, r) {
    switch (e) {
      case kt.HasActiveItem:
        return this._processActiveItemPrereq(a, r, e);
      case kt.HasActiveItemsByTag:
        return this._processActiveItemsByTagPrereq(a, r, e);
      case kt.AdvancedPlaybook:
        return this._processAdvancedPlaybookPrereq();
      default:
        return !0;
    }
  }
  _processActiveItemPrereq(e, a, r) {
    var o;
    const i = this.activeSubItems.filter((n) => {
      var l;
      return !((l = a[r]) != null && l.includes(n.id));
    }).find((n) => n.system.world_name === e);
    return i ? ((o = a[r]) == null || o.push(i.id), !0) : !1;
  }
  _processActiveItemsByTagPrereq(e, a, r) {
    var o;
    const i = this.activeSubItems.filter((n) => {
      var l;
      return !((l = a[r]) != null && l.includes(n.id));
    }).find((n) => n.hasTag(e));
    return i ? ((o = a[r]) == null || o.push(i.id), !0) : !1;
  }
  _processAdvancedPlaybookPrereq() {
    return !(!x.IsType(this, b.pc) || !this.playbookName || ![rt.Ghost, rt.Hull, rt.Vampire].includes(this.playbookName));
  }
  _processEmbeddedItemMatches(e) {
    return e.filter((a) => this._checkItemPrereqs(a)).filter((a) => a.hasTag(A.System.MultiplesOK) || (a.system.max_per_score ?? 1) > this.activeSubItems.filter((r) => r.system.world_name === a.system.world_name).length).map((a) => {
      const r = this.archivedSubItems.filter((i) => i.system.world_name === a.system.world_name);
      return r.length > 0 ? r : a;
    }).flat().map((a) => {
      a.dialogCSSClasses = "";
      const r = [];
      return a.isEmbedded && r.push("embedded"), a.hasTag(A.Gear.Fine) && r.push("fine-quality"), a.hasTag(A.System.Featured) && r.push("featured-item"), [g.ability, g.crew_ability].includes(a.type) && (this.getAvailableAdvancements("Ability") === 0 ? r.push("locked") : (a.system.price ?? 1) > this.getAvailableAdvancements("Ability") ? r.push("locked", "unaffordable") : (a.system.price ?? 1) > 1 && r.push("expensive")), [g.crew_upgrade].includes(a.type) && (this.getAvailableAdvancements("Upgrade") === 0 ? r.push("locked") : (a.system.price ?? 1) > this.getAvailableAdvancements("Upgrade") ? r.push("locked", "unaffordable") : (a.system.price ?? 1) > 1 && r.push("expensive")), r.length > 0 && (a.dialogCSSClasses = r.join(" ")), a;
    }).sort((a, r) => a.hasTag(A.System.Featured) && !r.hasTag(A.System.Featured) ? -1 : !a.hasTag(A.System.Featured) && r.hasTag(A.System.Featured) ? 1 : a.hasTag(A.Gear.Fine) && !r.hasTag(A.Gear.Fine) ? -1 : !a.hasTag(A.Gear.Fine) && r.hasTag(A.Gear.Fine) || a.system.world_name > r.system.world_name ? 1 : a.system.world_name < r.system.world_name || a.isEmbedded && !r.isEmbedded ? -1 : !a.isEmbedded && r.isEmbedded ? 1 : a.name === r.name ? 0 : a.name === null ? 1 : r.name === null ? -1 : a.name > r.name ? 1 : a.name < r.name ? -1 : 0);
  }
  getSubItem(e, a = !1) {
    const r = (i) => !a || !i.hasTag(A.System.Archived);
    if (typeof e == "string" && this.items.get(e)) {
      const i = this.items.get(e);
      return i && r(i) ? i : void 0;
    } else {
      const i = k.Get(e);
      return i ? this.items.find((o) => o.name === i.name && r(o)) ?? this.items.find((o) => o.system.world_name === i.system.world_name && r(o)) : void 0;
    }
  }
  hasSubItemOf(e) {
    const a = k.Get(e);
    return a ? !!this.items.find((r) => r.system.world_name === a.system.world_name) : !1;
  }
  hasActiveSubItemOf(e) {
    const a = k.Get(e);
    return a ? !!this.items.find((r) => !r.hasTag(A.System.Archived) && r.system.world_name === a.system.world_name) : !1;
  }
  async addSubItem(e) {
    function a(o) {
      return Object.values(La).includes(o);
    }
    eLog.checkLog3("subitems", "[addSubItem] itemRef", e);
    let r;
    const i = this.getSubItem(e);
    if (i)
      i.hasTag(A.System.Archived) ? (await i.remTag(A.System.Archived), r = i, eLog.checkLog3("subitems", `[addSubItem] IS ARCHIVED EMBEDDED > Removing 'Archived' Tag, '${r.id}':`, r)) : (r = await k.create(
        [i],
        { parent: this }
      ), eLog.checkLog3("subitems", `[addSubItem] IS ACTIVE EMBEDDED > Duplicating, focusItem '${r.id}':`, r));
    else {
      const o = k.Get(e);
      if (eLog.checkLog3("subitems", `[addSubItem] IS NOT EMBEDDED > Fetching Global, globalItem '${o == null ? void 0 : o.id}':`, o), !o)
        return;
      r = await k.create(
        [o],
        { parent: this }
      ), r = this.items.getName(o.name);
    }
    r && a(r.type) && await Promise.all(this.activeSubItems.filter((o) => o.type === (r == null ? void 0 : r.type) && o.system.world_name !== (r == null ? void 0 : r.system.world_name) && !o.hasTag(A.System.Archived)).map(this.remSubItem.bind(this)));
  }
  async remSubItem(e) {
    const a = this.getSubItem(e);
    if (a) {
      if (a.type !== g.gear) {
        this.purgeSubItem(e);
        return;
      }
      eLog.checkLog("actorTrigger", `Removing SubItem ${a.name}`, a), !a.hasTag(A.System.Archived) && await a.addTag(A.System.Archived);
    }
  }
  async purgeSubItem(e) {
    const a = this.getSubItem(e);
    !a || a.hasTag(A.System.Archived) || await a.delete();
  }
  // #endregion
  // #region Advancement Implementation ~
  // get totalAbilityPoints(): number {
  //   if (!BladesActor.IsType(this, BladesActorType.pc, BladesActorType.crew)) { return 0 }
  //   if (!this.playbook) { return 0 }
  //   switch (this.type) {
  //     case BladesActorType.pc: return this.system.advancement.ability ?? 0;
  //     case BladesActorType.crew: return Math.floor(0.5 * (this.system.advancement.general ?? 0))
  //      + (this.system.advancement.ability ?? 0);
  //     default: return 0;
  //   }
  // }
  // get spentAbilityPoints(): number {
  //   if (!BladesActor.IsType(this, BladesActorType.pc, BladesActorType.crew)) { return 0 }
  //   if (!this.playbook) { return 0 }
  //   return this.abilities.reduce((total, ability) => total + (ability.system.price ?? 1), 0);
  // }
  // get getAvailableAdvancements("Ability")(): number {
  //   if (!BladesActor.IsType(this, BladesActorType.pc, BladesActorType.crew)) { return 0 }
  //   if (!this.playbook) { return 0 }
  //   return this.totalAbilityPoints - this.spentAbilityPoints;
  // }
  /* Need simple getters for total ability & upgrade points that check for PRICES of items
        (upgrade.system.price ?? 1) */
  async grantAdvancementPoints(e, a = 1) {
    var i;
    const r = Array.isArray(e) ? [...e].sort((o, n) => o.localeCompare(n)).join("_") : e;
    await this.update({ [`system.advancement_points.${r}`]: (((i = this.system.advancement_points) == null ? void 0 : i[r]) ?? 0) + a });
  }
  async removeAdvancementPoints(e, a = 1) {
    var o;
    const r = Array.isArray(e) ? [...e].sort((n, l) => n.localeCompare(l)).join("_") : e, i = ((o = this.system.advancement_points) == null ? void 0 : o[r]) ?? 0 - a;
    i <= 0 && r in (this.system.advancement_points ?? []) ? await this.update({ [`system.advancement_points.-=${r}`]: null }) : await this.update({ [`system.advancement_points.${r}`]: i });
  }
  getAvailableAdvancements(e) {
    var O, q, E, Y, ce;
    if (!x.IsType(this, b.pc, b.crew))
      return 0;
    if (e in Ae)
      return 1;
    if (e === "Cohort") {
      const j = ((O = this.system.advancement_points) == null ? void 0 : O[Le.Cohort]) ?? 0, B = this.cohorts.length;
      return Math.max(0, j - B);
    }
    const a = ((q = this.system.advancement_points) == null ? void 0 : q[Le.Ability]) ?? 0, r = ((E = this.system.advancement_points) == null ? void 0 : E[Le.CohortType]) ?? 0, i = ((Y = this.system.advancement_points) == null ? void 0 : Y[Le.Upgrade]) ?? 0, o = ((ce = this.system.advancement_points) == null ? void 0 : ce[Le.UpgradeOrAbility]) ?? 0, n = h.sum(this.items.filter((j) => k.IsType(j, g.ability, g.crew_ability)).map((j) => j.system.price ?? 1)), l = h.sum(
      this.cohorts.map((j) => Math.max(0, h.unique(Object.values(j.system.subtypes)).length - 1))
    ), c = h.sum(this.items.filter((j) => k.IsType(j, g.crew_upgrade)).map((j) => j.system.price ?? 1)), d = Math.max(0, c - i), p = Math.max(0, l - r), u = Math.max(0, n - a), f = Math.max(0, a - n), y = Math.max(0, r - l), S = Math.max(0, i - c), D = Math.max(
      0,
      o - d - 2 * u - 2 * p
    );
    return e === "Ability" ? f + Math.floor(0.5 * D) : e === "Upgrade" ? S + D : e === "CohortType" ? y + D : 0;
  }
  get availableAbilityPoints() {
    return this.getAvailableAdvancements("Ability");
  }
  get availableUpgradePoints() {
    return this.getAvailableAdvancements("Upgrade");
  }
  get availableCohortPoints() {
    return this.getAvailableAdvancements("Cohort");
  }
  get availableCohortTypePoints() {
    return this.getAvailableAdvancements("CohortType");
  }
  get canPurchaseAbility() {
    return this.availableAbilityPoints > 0;
  }
  get canPurchaseUpgrade() {
    return this.availableUpgradePoints > 0;
  }
  get canPurchaseCohort() {
    return this.availableCohortPoints > 0;
  }
  get canPurchaseCohortType() {
    return this.availableCohortTypePoints > 0;
  }
  async advancePlaybook() {
    if (!(!x.IsType(this, b.pc, b.crew) || !this.playbook)) {
      if (await this.update({ "system.experience.playbook.value": 0 }), this instanceof M) {
        oe.getInstance().pushNotice_SocketCall(
          "ALL",
          {
            title: `${this.name} Advances their Playbook!`,
            body: `${this.name}, select a new Ability on your Character Sheet.`,
            type: Te.push,
            cssClasses: "advancement-alert"
          }
        ), this.grantAdvancementPoints(Le.Ability);
        return;
      }
      if (this instanceof de) {
        oe.getInstance().pushNotice_SocketCall(
          "ALL",
          {
            title: "You Advance your Crew Playbook!",
            body: "Select new Upgrades and/or Abilities on your Crew Sheet.",
            type: Te.push,
            cssClasses: "advancement-alert crew-advancement-alert"
          }
        );
        const e = this.system.tier.value + 2;
        this.members.forEach((a) => {
          var r, i;
          (r = a.primaryUser) != null && r.id && (oe.getInstance().pushNotice_SocketCall(
            (i = a.primaryUser) == null ? void 0 : i.id,
            {
              title: "Your Stash Increases! <em>(Crew Advancement)</em>",
              type: Te.push,
              body: `You gain ${e} Stash from Crew Advancement.`,
              cssClasses: "stash-alert"
            }
          ), a.addStash(e));
        }), this.grantAdvancementPoints(Le.UpgradeOrAbility, 2);
      }
    }
  }
  async advanceAttribute(e) {
    var r;
    if (!(this instanceof M) || !((r = this.primaryUser) != null && r.id))
      return;
    await this.update({ [`system.experience.${e}.value`]: 0 });
    const a = v.Action[e].map((i) => `<strong>${h.tCase(i)}</strong>`);
    oe.getInstance().pushNotice_SocketCall(
      this.primaryUser.id,
      {
        title: `${this.name} Advances their ${h.uCase(e)}!`,
        body: `${this.name}, add a dot to one of ${h.oxfordize(a, !0, "or")}.`,
        type: Te.push,
        cssClasses: "advancement-alert"
      }
    );
  }
  get isAtWar() {
    var e;
    return Qe.IsType(this) ? !1 : M.IsType(this) ? ((e = this.crew) == null ? void 0 : e.isAtWar) ?? !1 : Object.values(this.system.at_war_with ?? {}).filter((a) => a === !0).length > 0;
  }
  get isSubActor() {
    return this.parentActor !== void 0;
  }
  // #endregion
  // #region BladesRoll Implementation ~
  get rollPrimaryModsSchemaSet() {
    return _e.ParseDocModsToSchemaSet(this);
  }
  get rollFactors() {
    return {
      [m.tier]: {
        name: m.tier,
        display: "Tier",
        value: this.getFactorTotal(m.tier),
        max: this.getFactorTotal(m.tier),
        baseVal: this.getFactorTotal(m.tier),
        isActive: !0,
        isPrimary: !0,
        isDominant: !1,
        highFavorsPC: !0
      },
      [m.quality]: {
        name: m.quality,
        display: "Quality",
        value: this.getFactorTotal(m.quality),
        max: this.getFactorTotal(m.quality),
        baseVal: this.getFactorTotal(m.quality),
        isActive: !1,
        isPrimary: !1,
        isDominant: !1,
        highFavorsPC: !0
      }
    };
  }
  // #region BladesRoll.PrimaryDoc Implementation
  get rollPrimaryID() {
    return this.id;
  }
  get rollPrimaryDoc() {
    return this;
  }
  get rollPrimaryName() {
    return this.name;
  }
  get rollPrimaryType() {
    if (![b.pc, b.crew].includes(this.type))
      throw new Error(`BladesActor of type '${this.type}' ("${this.name}") cannot be RollPrimary.`);
    return this.type;
  }
  get rollPrimaryImg() {
    return this.img;
  }
  // #endregion
  // #endregion
  // #region BladesCrew Implementation ~
  // #endregion
  // #region PREPARING DERIVED DATA ~
  prepareDerivedData() {
    x.IsType(this, b.pc) && this._preparePCData(this.system), x.IsType(this, b.crew) && this._prepareCrewData(this.system);
  }
  _preparePCData(e) {
    x.IsType(this, b.pc) && (this.playbook && (e.experience.clues = [
      ...e.experience.clues,
      ...Object.values(this.playbook.system.experience_clues).filter((a) => !!a.trim())
    ]), this.playbook && (e.gather_info = [
      ...e.gather_info,
      ...Object.values(this.playbook.system.gather_info_questions).filter((a) => !!a.trim())
    ]));
  }
  _prepareCrewData(e) {
    x.IsType(this, b.crew) && this.playbook && (e.experience.clues = [
      ...e.experience.clues,
      ...Object.values(this.playbook.system.experience_clues).filter((a) => !!a.trim())
    ], e.turfs = this.playbook.system.turfs);
  }
  // #endregion
  // #region OVERRIDES: _onCreateDescendantDocuments, update ~
  // @ts-expect-error New method not defined in @league VTT types.
  async _onCreateDescendantDocuments(e, a, r, i, o, n) {
    await Promise.all(r.map(async (l) => {
      k.IsType(l, g.playbook, g.crew_playbook) && await Promise.all(this.activeSubItems.filter((c) => c.type === l.type && c.system.world_name !== l.system.world_name).map((c) => this.remSubItem(c)));
    })), await super._onCreateDescendantDocuments(e, a, r, i, o, n), eLog.checkLog("actorTrigger", "_onCreateDescendantDocuments", { parent: e, collection: a, docs: r, data: i, options: o, userId: n }), r.forEach((l) => {
      k.IsType(l, g.vice) && x.IsType(this, b.pc) && this.activeSubActors.filter((c) => c.hasTag(A.NPC.VicePurveyor) && !c.hasTag(l.name)).forEach((c) => {
        this.remSubActor(c);
      });
    });
  }
  async update(e, a, r = !1) {
    if (!e)
      return super.update(e);
    if (x.IsType(this, b.crew)) {
      if (!this.playbook)
        return;
      eLog.checkLog("actorTrigger", "Updating Crew", { updateData: e });
      const i = Object.fromEntries(
        Object.entries(flattenObject(e)).filter(([n, l]) => n.startsWith("system.turfs."))
      );
      e = Object.fromEntries(Object.entries(flattenObject(e)).filter(([n, l]) => !n.startsWith("system.turfs."))), eLog.checkLog("actorTrigger", "Updating Crew", { crewUpdateData: e, playbookUpdateData: i });
      const o = diffObject(
        flattenObject(this.playbook),
        i
      );
      delete o._id, h.isEmpty(o) || await this.playbook.update(i, a).then(() => {
        var n;
        return (n = this.sheet) == null ? void 0 : n.render(!1);
      });
    } else if ((x.IsType(this, b.npc) || x.IsType(this, b.faction)) && this.parentActor && !r)
      return this.parentActor.updateSubActor(this.id, e).then(() => this);
    return super.update(e, a);
  }
  // #endregion
  // #region Rolling Dice ~
  /**
   * Creates <options> modifiers for dice roll.
   *
   * @param {int} rs
   *  Min die modifier
   * @param {int} re
   *  Max die modifier
   * @param {int} s
   *  Selected die
   */
  createListOfDiceMods(e, a, r) {
    let i = "";
    r === "" && (r = 0);
    for (let o = e; o <= a; o++) {
      let n = "";
      o >= 0 && (n = "+"), i += `<option value="${o}"`, o === r && (i += " selected"), i += `>${n}${o}d</option>`;
    }
    return i;
  }
  // #endregion Rolling Dice
  // #region NPC Randomizers ~
  updateRandomizers() {
    if (!x.IsType(this, b.npc))
      return;
    const e = 0.05, a = 0.01, { persona: r, secret: i, random: o } = this.system;
    function n(u, ...f) {
      return u = u.filter((y) => !f.includes(y)), u.length ? u[Math.floor(Math.random() * u.length)] : "";
    }
    const l = {
      name: (u) => [
        Math.random() <= e ? n(H.NPC.name_title) : "",
        n([
          ...(u ?? "").charAt(0).toLowerCase() !== "m" ? H.NPC.name_first.female : [],
          ...(u ?? "").charAt(0).toLowerCase() !== "f" ? H.NPC.name_first.male : []
        ]),
        `"${n(H.NPC.name_alias)}"`,
        n(H.NPC.name_surname),
        Math.random() <= a ? n(H.NPC.name_suffix) : ""
      ].filter((f) => !!f).join(" "),
      background: () => n(H.NPC.background, o.background.value),
      heritage: () => n(H.NPC.heritage, o.heritage.value),
      profession: () => n(H.NPC.profession, o.profession.value),
      gender: () => n(H.NPC.gender, r.gender.value),
      appearance: () => n(H.NPC.appearance, r.appearance.value),
      goal: () => n(H.NPC.goal, r.goal.value, i.goal.value),
      method: () => n(H.NPC.method, r.method.value, i.method.value),
      trait: () => n(
        H.NPC.trait,
        r.trait1.value,
        r.trait2.value,
        r.trait3.value,
        i.trait.value
      ),
      interests: () => n(H.NPC.interests, r.interests.value, i.interests.value),
      quirk: () => n(H.NPC.quirk, r.quirk.value),
      style: (u = "") => n([
        ...u.charAt(0).toLowerCase() !== "m" ? H.NPC.style.female : [],
        ...u.charAt(0).toLowerCase() !== "f" ? H.NPC.style.male : []
      ], r.style.value)
    }, c = r.gender.isLocked ? r.gender.value : l.gender(), d = [
      ...Object.keys(r).filter((u) => {
        var f;
        return !((f = r[u]) != null && f.isLocked);
      }),
      ...Object.keys(o).filter((u) => {
        var f;
        return !((f = o[u]) != null && f.isLocked);
      }),
      ...Object.keys(i).filter((u) => {
        var f;
        return !((f = i[u]) != null && f.isLocked);
      }).map((u) => `secret-${u}`)
    ];
    eLog.checkLog("Update Keys", { updateKeys: d });
    const p = {};
    d.forEach((u) => {
      switch (u) {
        case "name":
        case "heritage":
        case "background":
        case "profession": {
          const f = l[u]();
          p[`system.random.${u}`] = {
            isLocked: !1,
            value: f || o[u].value
          };
          break;
        }
        case "secret-goal":
        case "secret-interests":
        case "secret-method": {
          u = u.replace(/^secret-/, "");
          const f = l[u]();
          p[`system.secret.${u}`] = {
            isLocked: !1,
            value: f || i[u].value
          };
          break;
        }
        case "gender": {
          p[`system.persona.${u}`] = {
            isLocked: r.gender.isLocked,
            value: c
          };
          break;
        }
        case "trait1":
        case "trait2":
        case "trait3":
        case "secret-trait": {
          const f = r.trait1.isLocked ? r.trait1.value : n(
            H.NPC.trait,
            r.trait1.value,
            r.trait2.value,
            r.trait3.value,
            i.trait.value
          ), y = r.trait2.isLocked ? r.trait2.value : n(
            H.NPC.trait,
            f,
            r.trait1.value,
            r.trait2.value,
            r.trait3.value,
            i.trait.value
          ), S = r.trait3.isLocked ? r.trait3.value : n(
            H.NPC.trait,
            f,
            y,
            r.trait1.value,
            r.trait2.value,
            r.trait3.value,
            i.trait.value
          ), D = i.trait.isLocked ? i.trait.value : n(
            H.NPC.trait,
            f,
            y,
            S,
            r.trait1.value,
            r.trait2.value,
            r.trait3.value,
            i.trait.value
          );
          r.trait1.isLocked || (p["system.persona.trait1"] = {
            isLocked: !1,
            value: f
          }), r.trait2.isLocked || (p["system.persona.trait2"] = {
            isLocked: !1,
            value: y
          }), r.trait3.isLocked || (p["system.persona.trait3"] = {
            isLocked: !1,
            value: S
          }), i.trait.isLocked || (p["system.secret.trait"] = {
            isLocked: !1,
            value: D
          });
          break;
        }
        default: {
          const f = l[u]();
          p[`system.persona.${u}`] = {
            isLocked: !1,
            value: f || r[u].value
          };
          break;
        }
      }
    }), this.update(p);
  }
  // #endregion NPC Randomizers
  // Unlock lower-level update method for subclasses
  async callOnUpdate(...e) {
    await this._onUpdate(...e);
  }
}
const I = x;
class Ft extends ActorSheet {
  /**
   * Override the default getData method to provide additional data for the actor sheet.
   * This includes: cssClass, editable, isGM, actor, system, tierTotal, rollData, activeEffects,
   *                 hasFullVision, hasLimitedVision, hasControl, preparedItems.
   * @returns {BladesActorSheetData} The data object for the actor sheet.
   */
  getData() {
    var a, r;
    const t = super.getData(), e = {
      // Basic actor data.
      cssClass: this.actor.type,
      editable: this.options.editable,
      isGM: (a = game.eunoblades.Tracker) != null && a.system.is_spoofing_player ? !1 : game.user.isGM,
      actor: this.actor,
      system: this.actor.system,
      gamePhase: ((r = game.eunoblades.Tracker) == null ? void 0 : r.phase) || N.Freeplay,
      tierTotal: this.actor.getFactorTotal(m.tier) > 0 ? h.romanizeNum(this.actor.getFactorTotal(m.tier)) : "0",
      rollData: this.actor.getRollData(),
      activeEffects: Array.from(this.actor.effects),
      hasFullVision: game.user.isGM || this.actor.testUserPermission(game.user, CONST.DOCUMENT_PERMISSION_LEVELS.OBSERVER),
      hasLimitedVision: game.user.isGM || this.actor.testUserPermission(game.user, CONST.DOCUMENT_PERMISSION_LEVELS.LIMITED),
      hasControl: game.user.isGM || this.actor.testUserPermission(game.user, CONST.DOCUMENT_PERMISSION_LEVELS.OWNER)
    };
    return (M.IsType(this.actor) || de.IsType(this.actor)) && (e.preparedItems = {
      abilities: [],
      loadout: [],
      cohorts: {
        gang: this.actor.cohorts.filter((i) => i.type === g.cohort_gang).map((i) => {
          const o = h.unique(Object.values(i.system.subtypes).map((c) => c.trim()).filter((c) => /[A-Za-z]/.test(c))), n = [
            ...Object.values(i.system.elite_subtypes)
          ];
          de.IsType(i.parent) && n.push(...(i.parent.upgrades ?? []).map((c) => (c.name ?? "").trim().replace(/^Elite /, "")));
          const l = [...h.unique(
            n.map((c) => c.trim()).filter(
              (c) => /[A-Za-z]/.test(c) && o.includes(c)
            )
          )];
          if (l.length < 2 && l.push(...o.filter((c) => !l.includes(c))), h.unique(l).length === 1)
            i.system.image = Object.values(i.system.elite_subtypes).includes(l[0]) ? `elite-${h.lCase(l[0])}.svg` : `${h.lCase(l[0])}.svg`;
          else if (h.unique(l).length > 1) {
            const [c, d] = l;
            i.system.imageLeft = Object.values(i.system.elite_subtypes).includes(d) ? `elite-${h.lCase(d)}.svg` : `${h.lCase(d)}.svg`, i.system.imageRight = Object.values(i.system.elite_subtypes).includes(c) ? `elite-${h.lCase(c)}.svg` : `${h.lCase(c)}.svg`;
          }
          return Object.assign(
            i.system,
            {
              tierTotal: i.getFactorTotal(m.tier) > 0 ? h.romanizeNum(i.getFactorTotal(m.tier)) : "0",
              cohortRollData: [
                { mode: "untrained", label: "Untrained", color: "transparent", tooltip: "<p>Roll Untrained</p>" }
              ],
              edgeData: Object.fromEntries(Object.values(i.system.edges ?? []).filter((c) => /[A-Za-z]/.test(c)).map((c) => [c.trim(), v.EdgeTooltips[c]])),
              flawData: Object.fromEntries(Object.values(i.system.flaws ?? []).filter((c) => /[A-Za-z]/.test(c)).map((c) => [c.trim(), v.FlawTooltips[c]]))
            }
          ), i;
        }),
        expert: this.actor.activeSubItems.filter((i) => i.type === g.cohort_expert).map((i) => (Object.assign(
          i.system,
          {
            tierTotal: i.getFactorTotal(m.tier) > 0 ? h.romanizeNum(i.getFactorTotal(m.tier)) : "0",
            cohortRollData: [
              { mode: "untrained", label: "Untrained", tooltip: "<h2>Roll Untrained</h2>" }
            ],
            edgeData: Object.fromEntries(Object.values(i.system.edges ?? []).filter((o) => /[A-Za-z]/.test(o)).map((o) => [o.trim(), v.EdgeTooltips[o]])),
            flawData: Object.fromEntries(Object.values(i.system.flaws ?? []).filter((o) => /[A-Za-z]/.test(o)).map((o) => [o.trim(), v.FlawTooltips[o]]))
          }
        ), i))
      },
      projects: []
    }), (I.IsType(this.actor, b.pc) || I.IsType(this.actor, b.crew)) && (e.playbookData = {
      dotline: {
        data: this.actor.system.experience.playbook,
        dotlineClass: "xp-playbook",
        target: "system.experience.playbook.value",
        svgKey: "teeth.tall",
        svgFull: "full|frame",
        svgEmpty: "full|half|frame",
        advanceButton: "advance-playbook"
      }
    }, this.actor.system.experience.playbook.value !== this.actor.system.experience.playbook.max && (e.playbookData.tooltip = new Handlebars.SafeString([
      "<h2>At the End of the Session, Gain XP If ...</h2>",
      "<ul>",
      ...Object.values(this.actor.system.experience.clues ?? []).map((i) => `<li>${i.replace(/^Y/, "... y")}</li>`) ?? [],
      "</ul>"
    ].join("")).toString()), e.coinsData = {
      dotline: {
        data: this.actor.system.coins,
        target: "system.coins.value",
        iconEmpty: "coin-full.svg",
        iconFull: "coin-full.svg"
      }
    }), {
      ...t,
      ...e
    };
  }
  // #region LISTENERS & EVENT HANDLERS
  activateListeners(t) {
    super.activateListeners(t), game.user.isGM ? t.attr("style", "--secret-text-display: initial") : t.find('.editor:not(.tinymce) [data-is-secret="true"]').remove(), Ue(t), Ma.InitListeners(t, this.actor), this.options.editable && (t.find(".dotline").each((e, a) => {
      if ($(a).hasClass("locked"))
        return;
      let r = this.actor, i = $(a).data("target");
      const o = $(a).closest("comp");
      if (i.startsWith("item")) {
        i = i.replace(/^item\./, "");
        const l = $(a).closest("[data-comp-id]").data("compId");
        if (!l)
          return;
        const c = this.actor.items.get(l);
        if (!c)
          return;
        r = c;
      }
      const n = h.pInt($(a).data("value"));
      $(a).find(".dot").each((l, c) => {
        $(c).on("click", (d) => {
          d.preventDefault();
          const p = h.pInt($(c).data("value"));
          p !== n && (o.hasClass("comp-coins") || o.hasClass("comp-stash") ? nt.effects.fillCoins($(c).prevAll(".dot")).then(() => r.update({ [i]: p })) : r.update({ [i]: p }));
        }), $(c).on("contextmenu", (d) => {
          d.preventDefault();
          const p = h.pInt($(c).data("value")) - 1;
          p !== n && r.update({ [i]: p });
        });
      });
    }), t.find("[data-comp-id]").find(".comp-title").on({ click: this._onItemOpenClick.bind(this) }), t.find(".comp-control.comp-add").on({ click: this._onItemAddClick.bind(this) }), t.find(".comp-control.comp-delete").on({ click: this._onItemRemoveClick.bind(this) }), t.find(".comp-control.comp-delete-full").on({ click: this._onItemFullRemoveClick.bind(this) }), t.find(".comp-control.comp-toggle").on({ click: this._onItemToggleClick.bind(this) }), t.find(`
        select[data-action='player-select'],
        select[data-action='gm-select']
      `).on({ change: this._onSelectChange.bind(this) }), t.find("[data-action='toggle-value'").on({ click: this._onToggleValueClick.bind(this) }), t.find(".advance-button").on({ click: this._onAdvanceClick.bind(this) }), t.find(".effect-control").on({ click: this._onActiveEffectControlClick.bind(this) }), t.find("[data-roll-trait]").on({ click: this._onRollTraitClick.bind(this) }), t.find("[data-action*='downtime-action-']").on({ click: this._onDowntimeActionClick.bind(this) }), this.options.submitOnChange && t.on("change", "textarea", this._onChangeInput.bind(this)));
  }
  async _onSubmit(t, e = {}) {
    return !game.user.isGM && !this.actor.testUserPermission(game.user, CONST.DOCUMENT_PERMISSION_LEVELS.OWNER) ? (eLog.checkLog("actorSheetTrigger", "User does not have permission to edit this actor", { user: game.user, actor: this.actor }), {}) : super._onSubmit(t, e);
  }
  async close(t) {
    return this.actor.type === b.pc ? super.close(t).then(() => this.actor.clearSubActors()) : this.actor.type === b.npc && this.actor.parentActor ? super.close(t).then(() => this.actor.clearParentActor(!1)) : super.close(t);
  }
  // #region Component Handlers
  _getCompData(t) {
    const e = $(t.currentTarget).closest(".comp"), a = {
      elem$: e,
      docID: e.data("compId"),
      docCat: e.data("compCat"),
      docType: e.data("compType"),
      docTags: (e.data("compTags") ?? "").split(/\s+/g)
    };
    return eLog.checkLog2("dialog", "Component Data", { elem: e, ...a }), a.docID && a.docType && (a.doc = {
      Actor: this.actor.getSubActor(a.docID),
      Item: this.actor.getSubItem(a.docID)
    }[a.docType]), a.docCat && a.docType && (M.IsType(this.actor) || de.IsType(this.actor)) && (a.dialogDocs = {
      Actor: this.actor.getDialogActors(a.docCat),
      Item: this.actor.getDialogItems(a.docCat)
    }[a.docType]), a;
  }
  _onItemOpenClick(t) {
    var a;
    t.preventDefault();
    const { doc: e } = this._getCompData(t);
    e && ((a = e.sheet) == null || a.render(!0));
  }
  async _onItemAddClick(t) {
    t.preventDefault();
    const e = $(t.currentTarget).closest(".comp").data("addType");
    if (e && e in g) {
      await this.actor.createEmbeddedDocuments("Item", [
        {
          name: {
            [g.cohort_gang]: "A Gang",
            [g.cohort_expert]: "An Expert"
          }[e] ?? randomID(),
          type: e
        }
      ]);
      return;
    }
    const { docCat: a, docType: r, dialogDocs: i, docTags: o } = this._getCompData(t);
    !i || !a || !r || await Ze.DisplaySelectionDialog(
      this.actor,
      h.tCase(`Add ${a.replace(/_/g, " ")}`),
      r,
      i,
      o
    );
  }
  async _onItemRemoveClick(t) {
    t.preventDefault();
    const { elem$: e, doc: a } = this._getCompData(t);
    a && await nt.effects.blurRemove(e).then(async () => {
      a instanceof k ? await this.actor.remSubItem(a) : await this.actor.remSubActor(a);
    });
  }
  async _onItemFullRemoveClick(t) {
    t.preventDefault();
    const { elem$: e, doc: a } = this._getCompData(t);
    a && await nt.effects.blurRemove(e).then(async () => await a.delete());
  }
  async _onItemToggleClick(t) {
    t.preventDefault();
    const e = $(t.currentTarget).data("target");
    await this.actor.update({
      [e]: !getProperty(this.actor, e)
    });
  }
  async _onSelectChange(t) {
    t.preventDefault(), await h.EventHandlers.onSelectChange(this, t);
  }
  async _onToggleValueClick(t) {
    t.preventDefault();
    const e = $(t.currentTarget), a = e.data("target"), r = e.data("toggleOnVal") || "", i = e.data("toggleOffVal") || "";
    getProperty(this.actor, a) === r ? await this.actor.update({ [a]: i }) : await this.actor.update({ [a]: r });
  }
  async _onAdvanceClick(t) {
    t.preventDefault(), $(t.currentTarget).data("action") === "advance-playbook" && await this.actor.advancePlaybook();
  }
  // #endregion
  // #region Roll Handlers
  async _onRollTraitClick(t) {
    const e = $(t.currentTarget).data("rollTrait"), a = $(t.currentTarget).data("rollType"), r = {
      target: this.actor,
      targetFlagKey: "rollCollab"
    };
    h.lCase(e) in { ...Ae, ...re, ...m } ? r.rollTrait = h.lCase(e) : h.isInt(e) && (r.rollTrait = h.pInt(e)), h.tCase(a) in _ ? r.rollType = h.tCase(a) : typeof r.rollTrait == "string" && (r.rollTrait in re ? r.rollType = _.Resistance : r.rollTrait in Ae && (r.rollType = _.Action)), game.user.isGM && (R.IsDoc(this.actor) ? r.rollPrimaryData = this.actor : he.IsDoc(this.actor) && (r.rollOppData = this.actor)), await Ge.New(r);
  }
  // Returns TRUE if can proceed, FALSE if action should stop (i.e. panel revealed for another user click)
  async _validateOrRevealSubData(t, e) {
    switch (t) {
      case P.LongTermProject: {
        if (e === "NewProject")
          return !1;
        const a = game.items.get(e ?? "");
        return !!ft.IsType(a);
      }
      case P.Recover: {
        const a = game.actors.get(e ?? "");
        return !!(a instanceof I && a.hasTag(A.NPC.CanHeal));
      }
      case P.Train:
        return !!/^[a-z]+:\d$/.exec(e ?? "");
      default:
        return !0;
    }
  }
  async _onDowntimeActionClick(t) {
    var o, n, l;
    const e = $(t.currentTarget), a = e.data("action").substring(e.data("action").lastIndexOf("-") + 1), r = e.data("actionSubData");
    if (!await this._validateOrRevealSubData(a, r)) {
      $("#eunos-blades-tooltips").children(".tooltip").remove(), await this.actor.update({ "system.downtime_actions_open_submenu": a }), $("#eunos-blades-tooltips").children(".tooltip").remove();
      return;
    }
    const i = {
      target: this.actor,
      targetFlagKey: "rollCollab",
      rollDowntimeAction: a
    };
    switch (a) {
      case P.AcquireAsset:
      case P.LongTermProject:
      case P.ReduceHeat: {
        i.rollType = _.Action;
        break;
      }
      case P.Recover: {
        i.rollType = _.Action, M.IsType(this.actor) && this.actor.healingClock && (i.rollClockKey = this.actor.healingClock.id);
        break;
      }
      case P.IndulgeVice: {
        i.rollType = _.IndulgeVice;
        break;
      }
      case P.Train: {
        const [c, d] = r.split(/:/);
        c === "playbook" ? this.actor.update({ [`system.experience.${c}.value`]: h.pInt(((n = (o = this.actor.system.experience) == null ? void 0 : o.playbook) == null ? void 0 : n.value) ?? 0) + h.pInt(d) }) : M.IsType(this.actor) && this.actor.update({ [`system.experience.${c}.value`]: h.pInt(this.actor.system.experience[c].value) + h.pInt(d) });
        break;
      }
    }
    await this.actor.update({
      "system.downtime_actions_open_submenu": "",
      "system.downtime_actions.value": (((l = this.actor.system.downtime_actions) == null ? void 0 : l.value) ?? 0) + 1
    }), "rollType" in i && (a === P.IndulgeVice ? Ts.New(i) : Ge.New(i));
  }
  async _onGatherInfoClick(t) {
    $(t.currentTarget).data("isFortuneRoll") ? bt.New({
      target: this.actor,
      targetFlagKey: "rollCollab",
      rollType: _.Fortune
    }) : Ge.New({
      target: this.actor,
      targetFlagKey: "rollCollab",
      rollType: _.Action,
      rollTrait: ""
    });
  }
  // #endregion
  // #region Active Effect Handlers
  _onActiveEffectControlClick(t) {
    ve.onManageActiveEffect(t, this.actor);
  }
  // #endregion
  // #endregion
}
class Qt extends Ft {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["eunos-blades", "sheet", "actor", "pc"],
      template: "systems/eunos-blades/templates/actor-sheet.hbs",
      width: 775,
      height: 775,
      tabs: [{ navSelector: ".nav-tabs", contentSelector: ".tab-content", initial: "abilities" }]
    });
  }
  getData() {
    var o, n, l, c;
    const t = super.getData(), { activeSubItems: e, activeSubActors: a } = this.actor, r = {};
    r.preparedItems = Object.assign(
      t.preparedItems ?? {},
      {
        abilities: e.filter((d) => d.type === g.ability).map((d) => (d.system.uses_per_score.max && Object.assign(d, {
          inRuleDotline: {
            data: d.system.uses_per_score,
            dotlineLabel: "Uses",
            target: "item.system.uses_per_score.value",
            iconEmpty: "dot-empty.svg",
            iconEmptyHover: "dot-empty-hover.svg",
            iconFull: "dot-full.svg",
            iconFullHover: "dot-full-hover.svg"
          }
        }), d)),
        background: e.find((d) => d.type === g.background),
        heritage: e.find((d) => d.type === g.heritage),
        vice: e.find((d) => d.type === g.vice),
        loadout: e.filter((d) => d.type === g.gear).map((d) => (d.system.load && Object.assign(d, {
          numberCircle: d.system.load,
          numberCircleClass: "item-load"
        }), d.system.uses_per_score.max && Object.assign(d, {
          inRuleDotline: {
            data: d.system.uses_per_score,
            dotlineLabel: "Uses",
            target: "item.system.uses_per_score.value",
            iconEmpty: "dot-empty.svg",
            iconEmptyHover: "dot-empty-hover.svg",
            iconFull: "dot-full.svg",
            iconFullHover: "dot-full-hover.svg"
          }
        }), d)),
        playbook: this.actor.playbook,
        projects: e.filter((d) => d.type === g.project),
        cohorts: (o = t.preparedItems) == null ? void 0 : o.cohorts
      }
    ), r.preparedActors = {
      crew: a.find((d) => d.type === b.crew),
      vice_purveyor: a.find((d) => d.hasTag(A.NPC.VicePurveyor)),
      acquaintances: a.filter((d) => d.hasTag(A.NPC.Acquaintance))
    }, r.hasVicePurveyor = !!(((n = this.actor.playbook) == null ? void 0 : n.hasTag(A.Gear.Advanced)) === !1 && e.find((d) => d.type === g.vice)), r.healing_clock = this.actor.healingClock, r.stashData = {
      label: "Stash:",
      dotline: {
        data: this.actor.system.stash,
        target: "system.stash.value",
        iconEmpty: "coin-empty.svg",
        iconEmptyHover: "coin-empty-hover.svg",
        iconFull: "coin-full.svg",
        iconFullHover: "coin-full-hover.svg",
        altIconFull: "coin-ten.svg",
        altIconFullHover: "coin-ten-hover.svg",
        altIconStep: 10
      }
    }, r.stressData = {
      label: this.actor.system.stress.name,
      dotline: {
        data: this.actor.system.stress,
        dotlineClass: this.actor.system.stress.max >= 13 ? "narrow-stress" : "",
        target: "system.stress.value",
        svgKey: "teeth.tall",
        svgFull: "full|half|frame",
        svgEmpty: "full|half|frame"
      }
    }, I.IsType(this.actor, b.pc) && (r.traumaData = {
      label: this.actor.system.trauma.name,
      dotline: {
        data: { value: this.actor.trauma, max: this.actor.system.trauma.max },
        svgKey: "teeth.short",
        svgFull: "full|frame",
        svgEmpty: "frame",
        isLocked: !0
      },
      compContainer: {
        class: "comp-trauma-conditions comp-vertical full-width",
        blocks: [
          this.actor.traumaList.slice(0, Math.ceil(this.actor.traumaList.length / 2)).map((d) => ({
            checkLabel: d,
            checkClasses: {
              active: "comp-toggle-red",
              inactive: "comp-toggle-grey"
            },
            checkTarget: `system.trauma.checked.${d}`,
            checkValue: this.actor.system.trauma.checked[d] ?? !1,
            tooltip: v.TraumaTooltips[d],
            tooltipClass: "tooltip-trauma"
          })),
          this.actor.traumaList.slice(Math.ceil(this.actor.traumaList.length / 2)).map((d) => ({
            checkLabel: d,
            checkClasses: {
              active: "comp-toggle-red",
              inactive: "comp-toggle-grey"
            },
            checkTarget: `system.trauma.checked.${d}`,
            checkValue: this.actor.system.trauma.checked[d] ?? !1,
            tooltip: v.TraumaTooltips[d],
            tooltipClass: "tooltip-trauma"
          }))
        ]
      }
    }), r.abilityData = {
      dotline: {
        dotlineClass: "dotline-right dotline-glow",
        data: {
          value: this.actor.getAvailableAdvancements("Ability"),
          max: this.actor.getAvailableAdvancements("Ability")
        },
        dotlineLabel: "Available Abilities",
        isLocked: !0,
        iconFull: "dot-full.svg"
      }
    }, r.loadData = {
      curLoad: this.actor.currentLoad,
      selLoadCount: this.actor.system.loadout.levels[h.lCase(this.actor.system.loadout.selected)],
      options: v.Loadout.selections,
      selected: this.actor.system.loadout.selected ?? ""
    }, r.armor = Object.fromEntries(Object.entries(this.actor.system.armor.active).filter(([, d]) => d).map(([d]) => [
      d,
      this.actor.system.armor.checked[d]
    ])), r.attributeData = {};
    const i = Object.entries(this.actor.system.attributes);
    for (const [d, p] of i) {
      r.attributeData[d] = {
        tooltip: v.AttributeTooltips[d],
        actions: {}
      };
      const u = Object.entries(p);
      for (const [f, y] of u)
        r.attributeData[d].actions[f] = {
          tooltip: v.ActionTooltips[f],
          value: y.value,
          max: game.eunoblades.Tracker.phase === N.CharGen ? 2 : this.actor.system.attributes[d][f].max
        };
    }
    if (((l = game.eunoblades.Tracker) == null ? void 0 : l.phase) === N.Downtime) {
      const d = {
        [P.AcquireAsset]: "Acquire Asset",
        [P.IndulgeVice]: "Indulge Vice",
        [P.LongTermProject]: "Project",
        [P.Recover]: "Recover",
        [P.ReduceHeat]: "Reduce Heat",
        [P.Train]: "Train"
      }, p = [
        ...I.GetTypeWithTags(b.pc, A.PC.CanHeal),
        ...I.GetTypeWithTags(b.npc, A.NPC.CanHeal)
        /* ALSO NEED TO INCLUDE EXPERT COHORTS WITH CANHEAL TAG */
      ];
      this.actor.stress === 0 && delete d[P.IndulgeVice], (this.actor.harmLevel === 0 || p.length === 0) && delete d[P.Recover], (!this.actor.crew || this.actor.crew.system.heat.value === 0) && delete d[P.ReduceHeat];
      let u;
      switch (this.actor.system.downtime_actions_open_submenu) {
        case P.LongTermProject: {
          u = [
            {
              actionSubData: "NewProject",
              display: "New Project"
            }
          ];
          break;
        }
        case P.Recover: {
          u = [], p.forEach((E) => {
            E.id === this.actor.id ? u == null || u.unshift({
              actionSubData: this.actor.id,
              display: "Heal Self"
            }) : M.IsType(E) ? u == null || u.push({
              actionSubData: E.id,
              display: h.uCase(E.name)
            }) : Qe.IsType(E) && (u == null || u.push({
              actionSubData: E.id,
              display: E.name
            }));
          });
          break;
        }
        case P.Train: {
          const E = ((c = this.actor.crew) == null ? void 0 : c.upgrades.filter((Y) => /^Training_/.exec(Y.system.world_name)).map((Y) => h.lCase(Y.system.world_name.split(/_/)[1]))) ?? [];
          u = [
            {
              actionSubData: `playbook:${E.includes("playbook") ? 2 : 1}`,
              display: `${E.includes("playbook") ? 2 : 1} Playbook XP`
            },
            {
              actionSubData: `insight:${E.includes(re.insight) ? 2 : 1}`,
              display: `${E.includes(re.insight) ? 2 : 1} Insight XP`
            },
            {
              actionSubData: `prowess:${E.includes(re.prowess) ? 2 : 1}`,
              display: `${E.includes(re.prowess) ? 2 : 1} Prowess XP`
            },
            {
              actionSubData: `resolve:${E.includes(re.resolve) ? 2 : 1}`,
              display: `${E.includes(re.resolve) ? 2 : 1} Resolve XP`
            }
          ];
          break;
        }
      }
      const f = {
        [P.AcquireAsset]: `<h1>Acquire an Asset</h1>
        <p>Roll your <strong class='gold-bright'>Tier</strong> to acquire temporary use of an asset or service.</p>
        <p>The <strong>Quality</strong> of the acquired asset depends on the result of your roll:</p>
        <ul>
        <li><strong class='gold-bright'>Critical Success</strong> &mdash; <strong class='gold-bright'>Tier</strong> <strong>+ 2</strong></li>
        <li><strong>Success</strong> &mdash; <strong class='gold-bright'>Tier</strong> <strong>+ 2</strong></li>
        <li><b>Partial Success</b> &mdash; <strong class='gold-bright'>Tier</strong></li>
        <li><strong class='red-bright'>Fail</strong> &mdash; <strong class='gold-bright'>Tier</strong> <strong>− 1</strong></li>
        </ul>`,
        [P.IndulgeVice]: `<h1>Indulge Your Vice</h1>
        <p>Roll your <strong class='red-bright'>lowest</strong> <strong>Attribute</strong>. Clear <strong>Stress</strong> equal to the <strong>highest</strong> die result.</p>
        <p><strong class="red-bright">Warning:</strong> If you clear more <strong>Stress</strong> than you have, you will <strong class="red-bright">overindulge</strong>.</p>`,
        [P.LongTermProject]: `<h1>Work on a Long-Term Project</h1>
        <p>Work to <strong>advance the clock</strong> of one of your existing <strong>Long-Term Projects</strong>, or begin a new one.</p>
        <p>Roll the <strong>Action</strong> most appropriate to the work you are doing. The results of your roll determine how far you will <strong>advance the clock</strong>:</p>
        <ul>
        <li><strong class='gold-bright'>Critical Success</strong> &mdash; <strong class='gold-bright'>Five</strong> Segments</li>
        <li><strong>Success</strong> &mdash;  <strong>Three</strong> Segments</li>
        <li><b>Partial Success</b> &mdash; <b>Two</b> Segments</li>
        <li><strong class='red-bright'>Fail</strong> &mdash; <strong class='red-bright'>One</strong> Segment</li>
        </ul>`,
        [P.Recover]: `<h1>Recover from Harm</h1>
        <p>Make a <strong>healing treatment roll</strong> using the appropriate trait of the character healing you:</p>
        <ul>
        <li><strong>A PC with 'Physicker'</strong> &mdash; <strong>Tinker</strong>. <em>(You can heal yourself this way, but suffer <strong class="red-bright">2 Stress</strong> for doing so.)</em></li>
        <li><strong>An NPC</strong> &mdash; <strong>Quality</strong></li>
        </ul>
        <p>The results of your roll determine how far you will <strong>Advance your healing clock</strong>:</p>
        <ul>
        <li><strong class='gold-bright'>Critical Success</strong> &mdash; <strong class='gold-bright'>Five</strong> Segments</li>
        <li><strong>Success</strong> &mdash;  <strong>Three</strong> Segments</li>
        <li><b>Partial Success</b> &mdash; <b>Two</b> Segments</li>
        <li><strong class='red-bright'>Fail</strong> &mdash; <strong class='red-bright'>One</strong> Segment</li>
        </ul>
        <p>When your <strong>healing clock</strong> is filled, reduce each Harm by one level of severity.</p>`,
        [P.ReduceHeat]: `<h1>Reduce Heat</h1>
        <p>Work to <strong>reduce the Heat</strong> on your Crew.</p>
        <p>Roll the <strong>Action</strong> most appropriate to the measures you are taking. The results of your roll determine how much <strong class="red-bright">Heat</strong> you clear:</p>
        <ul>
        <li><strong class='gold-bright'>Critical Success</strong> &mdash; <strong class='gold-bright'>Five</strong> Heat</li>
        <li><strong>Success</strong> &mdash;  <strong>Three</strong> Heat</li>
        <li><b>Partial Success</b> &mdash; <b>Two</b> Heat</li>
        <li><strong class='red-bright'>Fail</strong> &mdash; <strong class='red-bright'>One</strong> Heat</li>
        </ul>`,
        [P.Train]: `<h1>Train</h1>
        <p>Select an <strong>Experience Track</strong> <em>(i.e. Insight, Prowess, Resolve, or your Playbook)</em>. Gain <strong>1 XP</strong> in that track, or <strong>2 XP</strong> if your Crew has the corresponding <strong>Training Upgrade</strong>.</p>`
      }, y = this.actor.system.downtime_actions.max + this.actor.system.downtime_action_bonus - this.actor.system.downtime_actions.value - (this.actor.isAtWar ? 1 : 0), S = this.actor.system.coins.value >= 1 || this.actor.system.stash.value >= 2, D = !!(this.actor.crew && this.actor.crew.system.rep.value >= 1), O = y <= 0, q = y > 0 || S && this.actor.system.downtime_action_selected_cost === "Coin" || D && this.actor.system.downtime_action_selected_cost === "Rep";
      r.downtimeData = {
        actionsList: d,
        actionsTooltips: f,
        actionsRemaining: y,
        actionsSubmenuData: u,
        canPayCoin: S,
        canPayRep: D,
        isDisplayingCosts: O,
        isDisplayingActions: q,
        dotline: {
          dotlineClass: "dotline-right dotline-glow",
          data: {
            value: y,
            max: y
          },
          dotlineLabel: "Actions Remaining",
          isLocked: !0,
          iconFull: "dot-full.svg"
        }
      };
    }
    return r.gatherInfoTooltip = new Handlebars.SafeString([
      "<h1>Gathering Information</h1>",
      "<h2>Questions to Consider</h2>",
      "<ul>",
      ...Object.values(this.actor.system.gather_info ?? []).map((d) => `<li>${d}</li>`) ?? [],
      "</ul>"
    ].join("")).toString(), eLog.checkLog("Attribute", "[BladesPCSheet] attributeData", { attributeData: r.attributeData }), eLog.checkLog("actor", "[BladesPCSheet] getData()", { ...t, ...r }), { ...t, ...r };
  }
  get activeArmor() {
    return Object.keys(h.objFilter(this.actor.system.armor.active, (t) => t === !0));
  }
  get checkedArmor() {
    return Object.keys(h.objFilter(
      this.actor.system.armor.checked,
      (t, e) => t === !0 && this.actor.system.armor.active[e] === !0
    ));
  }
  get uncheckedArmor() {
    return Object.keys(h.objFilter(
      this.actor.system.armor.active,
      (t, e) => t === !0 && this.actor.system.armor.checked[e] === !1
    ));
  }
  _getHoverArmor() {
    return this.activeArmor.length ? this.activeArmor.includes("heavy") ? this.checkedArmor.includes("heavy") ? "light" : "heavy" : this.activeArmor.includes("light") ? "light" : "special" : !1;
  }
  _getClickArmor() {
    return this.uncheckedArmor.length ? this.uncheckedArmor.includes("heavy") ? "heavy" : this.uncheckedArmor.includes("light") ? "light" : "special" : !1;
  }
  _getContextMenuArmor() {
    return this.checkedArmor.length ? this.checkedArmor.includes("light") ? "light" : this.checkedArmor.includes("heavy") ? "heavy" : "special" : !1;
  }
  async _onAdvanceClick(t) {
    t.preventDefault(), super._onAdvanceClick(t);
    const e = $(t.currentTarget).data("action").replace(/^advance-/, "");
    e in re && await this.actor.advanceAttribute(e);
  }
  activateListeners(t) {
    if (super.activateListeners(t), !this.options.editable)
      return;
    const e = this;
    t.find(".main-armor-control").on({
      click() {
        const a = e._getClickArmor();
        a && e.actor.update({ [`system.armor.checked.${a}`]: !0 });
      },
      contextmenu() {
        const a = e._getContextMenuArmor();
        a && e.actor.update({ [`system.armor.checked.${a}`]: !1 });
      },
      mouseenter() {
        const a = e._getHoverArmor();
        eLog.log4("Mouse Enter", a, this, $(this), $(this).next()), a && $(this).siblings(`.svg-armor.armor-${a}`).addClass("hover-over");
      },
      mouseleave() {
        const a = e._getHoverArmor();
        a && $(this).siblings(`.svg-armor.armor-${a}`).removeClass("hover-over");
      }
    }), t.find(".special-control").on({
      click() {
        e.activeArmor.includes("special") && e.actor.update({ "system.armor.checked.special": e.uncheckedArmor.includes("special") });
      },
      contextmenu() {
        e.activeArmor.includes("special") && e.actor.update({ "system.armor.checked.special": e.uncheckedArmor.includes("special") });
      },
      mouseenter() {
        !e.activeArmor.includes("special") || e.activeArmor.length === 1 || $(this).siblings(".svg-armor.armor-special").addClass("hover-over");
      },
      mouseleave() {
        !e.activeArmor.includes("special") || e.activeArmor.length === 1 || $(this).siblings(".svg-armor.armor-special").removeClass("hover-over");
      }
    });
  }
}
class ct extends I {
  // #region INITIALIZATION ~
  static async Initialize() {
    return Object.assign(globalThis, { BladesPC: ct, BladesPCSheet: Qt }), Actors.registerSheet("blades", Qt, { types: ["pc"], makeDefault: !0 }), Hooks.on("dropActorSheetData", async (t, e, { uuid: a }) => {
      const r = fromUuidSync(a);
      r instanceof I && (t.type === b.crew && r.type === b.pc ? r.addSubActor(t) : t.type === b.pc && r.type === b.crew && t.addSubActor(r));
    }), loadTemplates(["systems/eunos-blades/templates/actor-sheet.hbs"]);
  }
  // #endregion
  // #region Static Overrides: Create, get All ~
  // static override IsType<T extends BladesActorType = BladesActorType.pc>(doc: unknown): doc is BladesActorOfType<T> {
  //   return super.IsType(doc, BladesActorType.pc);
  // }
  static IsType(t) {
    return super.IsType(t, b.pc);
  }
  static GetUser(t) {
    let e;
    return typeof t == "string" ? e = game.users.get(t) ?? game.users.getName(t) : t instanceof User && (e = t), e;
  }
  static GetFromUser(t) {
    var r;
    const e = ct.GetUser(t);
    if (!e)
      throw new Error(`Unable to find user '${t}'`);
    const a = game.actors.get(((r = e.character) == null ? void 0 : r.id) ?? "");
    if (ct.IsType(a))
      return a;
  }
  static async create(t, e = {}) {
    t.token = t.token || {}, t.system = t.system ?? {}, eLog.checkLog2("actor", "BladesPC.create(data,options)", { data: t, options: e }), t.token.actorLink = !0, t.system.experience = {
      playbook: { value: 0, max: 8 },
      insight: { value: 0, max: 6 },
      prowess: { value: 0, max: 6 },
      resolve: { value: 0, max: 6 },
      clues: [],
      ...t.system.experience ?? {}
    };
    const a = await super.create(t, e);
    return await le.Create({
      name: "",
      target: a,
      targetKey: "system.clocksData",
      isVisible: !0,
      isNameVisible: !1,
      isSpotlit: !1
    }, void 0, [
      {
        color: me.white,
        value: 0,
        max: 4,
        index: 0,
        isVisible: !0,
        isActive: !0,
        isNameVisible: !1,
        isHighlighted: !1
      }
    ]), a;
  }
  static get All() {
    return new Collection(
      super.GetTypeWithTags(b.pc).map((t) => [t.id, t])
    );
  }
  // #endregion
  constructor(t) {
    super(t), eLog.checkLog3("pcConstructor", "new BladesPC()", { data: t });
  }
  // #region BladesPrimaryActor Implementation ~
  get primaryUser() {
    var t;
    return ((t = game.users) == null ? void 0 : t.find((e) => {
      var a;
      return ((a = e.character) == null ? void 0 : a.id) === (this == null ? void 0 : this.id);
    })) || null;
  }
  async clearLoadout() {
    await this.update({ "system.loadout.selected": "" }), this.updateEmbeddedDocuments(
      "Item",
      [
        ...this.activeSubItems.filter((t) => k.IsType(t, g.gear) && !t.hasTag(A.System.Archived)).map((t) => ({
          _id: t.id,
          "system.tags": [...t.tags, A.System.Archived],
          "system.uses_per_score.value": 0
        })),
        ...this.activeSubItems.filter((t) => k.IsType(t, g.ability) && t.system.uses_per_score.max).map((t) => ({
          _id: t.id,
          "system.uses_per_score.value": 0
        }))
      ]
    );
  }
  // #endregion
  getSubActor(t) {
    var a;
    const e = super.getSubActor(t);
    if (e)
      return (a = this.primaryUser) != null && a.id && (e.ownership[this.primaryUser.id] = CONST.DOCUMENT_PERMISSION_LEVELS.OWNER), e;
  }
  get isLightArmorEquipped() {
    return this.system.armor.active.light;
  }
  get isLightArmorEquippable() {
    return !this.isLightArmorEquipped && this.remainingLoad >= 2;
  }
  get isLightArmorUsed() {
    return this.system.armor.checked.light;
  }
  get isLightArmorAvailable() {
    return (this.isLightArmorEquipped || this.isLightArmorEquippable) && !this.isLightArmorUsed;
  }
  get isHeavyArmorEquipped() {
    return this.system.armor.active.heavy;
  }
  get isHeavyArmorEquippable() {
    return this.isHeavyArmorEquipped ? !1 : this.isLightArmorEquipped ? this.remainingLoad >= 3 : this.remainingLoad >= 5;
  }
  get isHeavyArmorUsed() {
    return this.system.armor.checked.heavy;
  }
  get isHeavyArmorAvailable() {
    return (this.isHeavyArmorEquipped || this.isHeavyArmorEquippable) && !this.isHeavyArmorUsed;
  }
  get availableArmor() {
    const t = [];
    return this.isLightArmorAvailable && t.push("Light Armor"), this.isHeavyArmorAvailable && t.push("Heavy Armor"), t;
  }
  get isSpecialArmorAvailable() {
    return this.system.armor.active.special && !this.system.armor.checked.special;
  }
  // #region BladesScoundrel Implementation ~
  isMember(t) {
    var e;
    return ((e = this.crew) == null ? void 0 : e.id) === t.id;
  }
  get vice() {
    if (this.type === b.pc)
      return this.activeSubItems.find((t) => t.type === g.vice);
  }
  get crew() {
    return this.activeSubActors.find((t) => I.IsType(t, b.crew));
  }
  get abilities() {
    return this.playbook ? this.activeSubItems.filter((t) => [g.ability, g.crew_ability].includes(t.type)) : [];
  }
  get cohorts() {
    return this.activeSubItems.filter(
      (t) => k.IsType(t, g.cohort_gang, g.cohort_expert)
    );
  }
  get playbookName() {
    var t;
    return (t = this.playbook) == null ? void 0 : t.name;
  }
  get playbook() {
    return this.activeSubItems.find((t) => t.type === g.playbook);
  }
  get attributes() {
    if (I.IsType(this, b.pc))
      return {
        insight: Object.values(this.system.attributes.insight).filter(({ value: t }) => t > 0).length + this.system.resistance_bonus.insight,
        prowess: Object.values(this.system.attributes.prowess).filter(({ value: t }) => t > 0).length + this.system.resistance_bonus.prowess,
        resolve: Object.values(this.system.attributes.resolve).filter(({ value: t }) => t > 0).length + this.system.resistance_bonus.resolve
      };
  }
  get actions() {
    if (I.IsType(this, b.pc))
      return h.objMap({
        ...this.system.attributes.insight,
        ...this.system.attributes.prowess,
        ...this.system.attributes.resolve
      }, ({ value: t, max: e }) => h.gsap.utils.clamp(0, e, t));
  }
  get rollable() {
    if (I.IsType(this, b.pc))
      return {
        ...this.attributes,
        ...this.actions
      };
  }
  get stress() {
    return this.system.stress.value;
  }
  get stressMax() {
    return this.system.stress.max;
  }
  get isHealingClockReady() {
    const [t] = Object.keys(this.system.clocksData);
    return game.eunoblades.ClockKeys.has(t ?? "");
  }
  get healingClock() {
    if (!this.isHealingClockReady)
      return;
    const [t] = Object.keys(this.system.clocksData);
    return game.eunoblades.ClockKeys.get(t ?? "");
  }
  get harmLevel() {
    return this.system.harm.severe.one.length > 1 ? 3 : this.system.harm.moderate.one.length + this.system.harm.moderate.two.length > 0 ? 2 : this.system.harm.lesser.one.length + this.system.harm.lesser.two.length > 0 ? 1 : 0;
  }
  get trauma() {
    return I.IsType(this, b.pc) ? Object.keys(this.system.trauma.checked).filter((t) => (
      // @ts-ignore Compiler linter mismatch.
      this.system.trauma.active[t] && this.system.trauma.checked[t]
    )).length : 0;
  }
  get traumaList() {
    return I.IsType(this, b.pc) ? Object.keys(this.system.trauma.active).filter((t) => this.system.trauma.active[t]) : [];
  }
  get activeTraumaConditions() {
    return I.IsType(this, b.pc) ? h.objFilter(
      this.system.trauma.checked,
      // @ts-ignore Compiler linter mismatch.
      (t, e) => !!(e in this.system.trauma.active && this.system.trauma.active[e])
    ) : {};
  }
  get currentLoad() {
    if (!I.IsType(this, b.pc))
      return 0;
    const t = this.activeSubItems.filter((e) => e.type === g.gear);
    return h.gsap.utils.clamp(0, 10, t.reduce((e, a) => e + h.pInt(a.system.load), 0));
  }
  get remainingLoad() {
    if (!I.IsType(this, b.pc) || !this.system.loadout.selected)
      return 0;
    const t = this.system.loadout.levels[game.i18n.localize(this.system.loadout.selected.toString()).toLowerCase()];
    return Math.max(0, t - this.currentLoad);
  }
  async addStash(t) {
    I.IsType(this, b.pc) && await this.update({ "system.stash.value": Math.min(this.system.stash.value + t, this.system.stash.max) });
  }
  get projects() {
    return this.getSubItemsOfType(g.project);
  }
  get remainingDowntimeActions() {
    return I.IsType(this, b.pc) ? this.system.downtime_actions.max + this.system.downtime_action_bonus - this.system.downtime_actions.value : 0;
  }
  _processAbilityDialogItems(t) {
    this.playbookName && (t[this.playbookName] = this._processEmbeddedItemMatches(
      k.GetTypeWithTags(g.ability, this.playbookName)
    ), t.Veteran = this._processEmbeddedItemMatches(k.GetTypeWithTags(g.ability)).filter((e) => !e.hasTag(this.playbookName)).map((e) => (e.dialogCSSClasses && (e.dialogCSSClasses = e.dialogCSSClasses.replace(/featured-item\s?/g, "")), e)).sort((e, a) => e.system.world_name > a.system.world_name ? 1 : e.system.world_name < a.system.world_name ? -1 : 0));
  }
  processGearDialogItems(t) {
    if (this.playbookName === null)
      return;
    const e = this._processEmbeddedItemMatches([
      ...k.GetTypeWithTags(g.gear, this.playbookName),
      ...k.GetTypeWithTags(g.gear, A.Gear.General)
    ]).filter((a) => this.remainingLoad >= a.system.load);
    t[this.playbookName] = e.filter((a) => a.hasTag(this.playbookName)), t.General = e.filter((a) => a.hasTag(A.Gear.General)).map((a) => (a.dialogCSSClasses && (a.dialogCSSClasses = a.dialogCSSClasses.replace(/featured-item\s?/g, "")), a)).sort((a, r) => a.system.world_name > r.system.world_name ? 1 : a.system.world_name < r.system.world_name ? -1 : 0);
  }
  getDialogItems(t) {
    const e = {}, { playbookName: a } = this;
    return t === te.Heritage ? e.Main = this._processEmbeddedItemMatches(k.GetTypeWithTags(g.heritage)) : t === te.Background ? e.Main = this._processEmbeddedItemMatches(k.GetTypeWithTags(g.background)) : t === te.Vice && a !== null ? e.Main = this._processEmbeddedItemMatches(k.GetTypeWithTags(g.vice, a)) : t === te.Playbook ? (e.Basic = this._processEmbeddedItemMatches(
      k.GetTypeWithTags(g.playbook).filter((r) => !r.hasTag(A.Gear.Advanced))
    ), e.Advanced = this._processEmbeddedItemMatches(
      k.GetTypeWithTags(g.playbook, A.Gear.Advanced)
    )) : t === te.Gear ? this.processGearDialogItems(e) : t === te.Ability && this._processAbilityDialogItems(e), e;
  }
  getTaggedItemBonuses(t) {
    return t.length;
  }
  // #endregion
  // #region BladesRoll.PrimaryDoc Implementation
  get rollPrimaryModsSchemaSet() {
    const t = super.rollPrimaryModsSchemaSet;
    [
      [/1d/, C.roll],
      [/Less Effect/, C.effect]
    ].forEach(([a, r]) => {
      const { one: i, two: o } = Object.values(this.system.harm).find((l) => a.test(l.effect)) ?? {}, n = h.objCompact([i, o === "" ? null : o]).join(" & ");
      n.length > 0 && t.push({
        key: `Harm-negative-${r}`,
        name: n,
        section: r,
        posNeg: "negative",
        base_status: T.ToggledOn,
        modType: F.harm,
        value: 1,
        tooltip: [
          `<h1 class='sur-title'>${r === C.roll ? zt.Impaired : zt.Weakened} (Harm)</h1>`,
          `<h1 class='red-bright'>${n}</h1>`,
          r === C.roll ? "<p>If your injuries apply to the situation at hand, you suffer <strong class='red-bright'>−1d</strong> to your roll.</p>" : "<p>If your injuries apply to the situation at hand, you suffer <strong class='red-bright'>−1 effect</strong>."
        ].join("")
      });
    });
    const { one: e } = Object.values(this.system.harm).find((a) => /Need Help/.test(a.effect)) ?? {};
    return e && e.trim() !== "" && t.push({
      key: "Push-negative-roll",
      name: "PUSH",
      sideString: e.trim(),
      section: C.roll,
      posNeg: "negative",
      base_status: T.ToggledOn,
      modType: F.harm,
      value: 0,
      effectKeys: ["Cost-Stress2"],
      tooltip: [
        "<h1 class='sur-title'>Broken (Harm)</h1>",
        `<h1 class='red-bright'>${e.trim()}</h1>`,
        "<p>If your injuries apply to the situation at hand, you must <strong>Push</strong> to act.</p>"
      ].join("")
    }), t;
  }
  async applyHarm(t, e) {
    if (t === 4) {
      oe.getInstance().pushNotice_SocketCall(
        "ALL",
        {
          title: `${this.name} Suffers <u><strong>FATAL</strong></u> Harm: ${e}`,
          body: `${this.name}, will you continue as a Ghost, or create a new character?`,
          type: Te.push,
          cssClasses: "harm-alert fatal-harm-alert"
        }
      );
      return;
    }
    const a = [
      [["lesser", "one"], ["lesser", "two"]],
      [["moderate", "one"], ["moderate", "two"]],
      [["severe", "one"]]
    ].slice(t - 1).flat(1);
    for (; a.length; ) {
      const r = a.shift();
      if (!r)
        break;
      const [i, o] = r;
      if (!this.system.harm[i][o]) {
        oe.getInstance().pushNotice_SocketCall(
          "ALL",
          {
            title: `${this.name} Suffers ${h.tCase(i)} Harm: ${e}`,
            type: Te.push,
            cssClasses: "harm-alert"
          }
        ), await this.update({ [`system.harm.${i}.${o}`]: e });
        return;
      }
    }
    oe.getInstance().pushNotice_SocketCall(
      "ALL",
      {
        title: `${this.name} Suffers a Catastrophic, Permanent Injury!`,
        body: `${this.name}, you're out of the action - either left for dead, or otherwise dropped from the action. You can choose to return at the beginning of the next Phase with a permanent injury, or die.`,
        type: Te.push,
        cssClasses: "harm-alert fatal-harm-alert"
      }
    );
  }
  async applyWorsePosition() {
    this.setFlag("eunos-blades", "isWorsePosition", !0);
  }
  // #endregion
  // #region BladesRoll.ParticipantDoc Implementation
  get rollParticipantID() {
    return this.id;
  }
  get rollParticipantDoc() {
    return this;
  }
  get rollParticipantIcon() {
    var t;
    return ((t = this.playbook) == null ? void 0 : t.img) ?? this.img;
  }
  get rollParticipantName() {
    return this.name ?? "";
  }
  get rollParticipantType() {
    return this.type;
  }
  get rollParticipantModsSchemaSet() {
    return [];
  }
  // #endregion
  async adjustStress(t) {
    const e = Math.min(this.stressMax, Math.max(0, this.stress + t));
    if (e === this.stressMax) {
      oe.getInstance().pushNotice_SocketCall("ALL", {
        title: `${this.name} breaks under the stress!`,
        body: `${this.name}: Select a Trauma Condition on your sheet. You are taken out of action and will no longer participate in this score. Narrate what happens.`,
        type: Te.push,
        cssClasses: "stress-alert"
      }), await this.update({ "system.stress.value": 0 });
      return;
    }
    await this.update({ "system.stress.value": e });
  }
  async indulgeStress(t) {
    t > this.stress && oe.getInstance().pushNotice_SocketCall("ALL", {
      title: `${this.name} Overindulges!`,
      body: `${this.name}: Select an option from the list below, and narrate how overindulging your vice led to this result: <ul><li><strong>Attract Trouble:</strong> Roll for an <strong>Entanglement</strong>.</li><li><strong>Brag About Your Exploits:</strong> +2 Heat</li><li><strong>Go AWOL</strong> Vanish for a few weeks. <em>(You will play a different character until the next Downtime Phase, at which point you will return with all Harm healed.)</em></li><li><strong>Tapped:</strong> Your current Vice Purveyor cuts you off. <em>(Until you find a new source for your vice, you will be unable to Indulge Vice during Downtime.)</em></li></ul>`,
      type: Te.push,
      cssClasses: "stress-alert"
    }), await this.update({ "system.stress.value": this.stress - t });
  }
  async spendArmor(t) {
    const e = {};
    for (; t > 0; ) {
      if (this.isLightArmorAvailable)
        this.isLightArmorEquipped || (e["system.armor.active.light"] = !0), e["system.armor.checked.light"] = !0;
      else if (this.isHeavyArmorAvailable)
        this.isHeavyArmorEquipped || (e["system.armor.active.heavy"] = !0), e["system.armor.checked.heavy"] = !0;
      else
        throw new Error("No armor available to spend");
      t--;
    }
    this.update(e);
  }
  async spendSpecialArmor() {
    this.system.armor.active.special && !this.system.armor.checked.special && await this.update({ "system.armor.checked.special": !0 });
  }
  get rollTraitPCTooltipActions() {
    const t = ["<table><tbody>"], e = this.actions;
    return Object.values(re).forEach((a) => {
      v.Action[a].forEach((r) => {
        t.push([
          "<tr>",
          `<td><strong>${h.uCase(r)}</strong></td>`,
          `<td>${"⚪".repeat(e[r])}</td>`,
          `<td><em style="font-family: 'Minion Pro Cond'; font-size: 10px;">(${v.ShortActionTooltips[r]})</em></td>`,
          "</tr>"
        ].join(""));
      });
    }), t.push("</tbody></table>"), t.join("");
  }
  get rollTraitPCTooltipAttributes() {
    const t = ["<table><tbody>"], e = this.attributes;
    return Object.values(re).forEach((a) => {
      t.push([
        "<tr>",
        `<td><strong>${h.uCase(a)}</strong></td>`,
        `<td>${"⚪".repeat(e[a])}</td>`,
        `<td><em>(${v.ShortAttributeTooltips[a]})</em></td>`,
        "</tr>"
      ].join(""));
    }), t.push("</tbody></table>"), t.join("");
  }
  // #endregion
  render(t) {
    if (!this.isHealingClockReady) {
      setTimeout(() => this.render(t), 1e3);
      return;
    }
    super.render(t);
  }
}
const M = ct;
class es extends Ft {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["eunos-blades", "sheet", "actor", "npc"],
      template: "systems/eunos-blades/templates/npc-sheet.hbs",
      width: 500,
      height: 400,
      // height: "auto",
      tabs: [{ navSelector: ".nav-tabs", contentSelector: ".tab-content", initial: "description" }]
    });
  }
  getData() {
    const t = super.getData();
    t.isSubActor = t.actor.isSubActor, t.parentActor = t.actor.parentActor, t.persona = t.actor.system.persona, t.random = t.actor.system.random, t.secret = t.actor.system.secret;
    const e = {
      name: { size: 3, label: "Name" },
      gender: { size: "half", label: "Gender" },
      heritage: { size: "third", label: "Heritage" },
      background: { size: "third", label: "Background" },
      profession: { size: "third", label: "Profession" },
      appearance: { size: 2, label: "Appearance" },
      style: { size: 2, label: "Style" },
      quirk: { size: 4, label: "Quirk" },
      goal: { size: 2, label: "Goal" },
      method: { size: 2, label: "Method" },
      interests: { size: 4, label: "Interests" },
      trait: { size: "half", label: "Trait" },
      trait1: { size: "half", label: null },
      trait2: { size: "half", label: null },
      trait3: { size: "half", label: null }
    };
    for (const a of ["persona", "random", "secret"])
      for (const [r] of Object.entries(t[a]))
        r in e && Object.assign(
          t[a][r],
          e[r]
        );
    return console.log({ persona: t.persona, random: t.random, secret: t.secret }), t;
  }
  activateListeners(t) {
    super.activateListeners(t), this.options.editable && (t.find(".gm-alert-header").on("click", async (e) => {
      e.preventDefault(), this.actor.clearParentActor();
    }), t.find('[data-action="randomize"').on("click", () => {
      this.actor.updateRandomizers();
    }), t.find(".comp-status-toggle").on("click", () => {
      const { tags: e } = this.actor;
      this.actor.system.status === 1 ? (h.remove(e, "Friend"), e.push("Rival"), this.actor.update({
        "system.status": -1,
        "system.tags": h.unique(e)
      })) : (h.remove(e, "Rival"), e.push("Friend"), this.actor.update({
        "system.status": 1,
        "system.tags": h.unique(e)
      }));
    }).on("contextmenu", () => {
      this.actor.update({ "system.status": 0 });
    }));
  }
}
class bs extends I {
  // #region INITIALIZATION ~
  static async Initialize() {
    return Object.assign(globalThis, { BladesNPC: bs, BladesNPCSheet: es }), Actors.registerSheet("blades", es, { types: ["npc"], makeDefault: !0 }), loadTemplates(["systems/eunos-blades/templates/npc-sheet.hbs"]);
  }
  // #endregion
  static IsType(t) {
    return super.IsType(t, b.npc);
  }
  // #region BladesRoll Implementation
  get rollFactors() {
    const t = super.rollFactors;
    return t[m.scale] = {
      name: m.scale,
      display: "Scale",
      value: this.getFactorTotal(m.scale),
      max: this.getFactorTotal(m.scale),
      baseVal: this.getFactorTotal(m.scale),
      cssClasses: "factor-grey",
      isActive: !1,
      isPrimary: !1,
      isDominant: !1,
      highFavorsPC: !0
    }, t[m.magnitude] = {
      name: m.magnitude,
      display: "Magnitude",
      value: this.getFactorTotal(m.magnitude),
      max: this.getFactorTotal(m.magnitude),
      baseVal: this.getFactorTotal(m.magnitude),
      isActive: !1,
      isPrimary: !1,
      isDominant: !1,
      highFavorsPC: !0
    }, t;
  }
  // #region BladesRoll.OppositionDoc Implementation
  get rollOppID() {
    return this.id;
  }
  get rollOppDoc() {
    return this;
  }
  get rollOppImg() {
    return this.img;
  }
  get rollOppName() {
    return this.name;
  }
  get rollOppSubName() {
    return this.system.subtitle || this.system.concept || " ";
  }
  get rollOppType() {
    return this.type;
  }
  get rollOppModsSchemaSet() {
    return [];
  }
  // #endregion
  // #region BladesRoll.ParticipantDoc Implementation
  get rollParticipantID() {
    return this.id;
  }
  get rollParticipantDoc() {
    return this;
  }
  get rollParticipantIcon() {
    return this.img;
  }
  get rollParticipantName() {
    return this.name;
  }
  get rollParticipantType() {
    return this.type;
  }
  get rollParticipantModsSchemaSet() {
    return [];
  }
  // #endregion
  // #endregion
}
const Qe = bs;
class ts extends Ft {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["eunos-blades", "sheet", "actor", "faction"],
      template: "systems/eunos-blades/templates/faction-sheet.hbs",
      width: 900,
      height: "auto",
      tabs: [{ navSelector: ".nav-tabs", contentSelector: ".tab-content", initial: "overview" }]
    });
  }
  getData() {
    const t = super.getData();
    if (!I.IsType(this.actor, b.faction))
      return t;
    const e = {
      tierData: {
        class: "comp-tier comp-vertical comp-teeth",
        label: "Tier",
        labelClass: "filled-label full-width",
        dotline: {
          data: this.actor.system.tier,
          target: "system.tier.value",
          svgKey: "teeth.tall",
          svgFull: "full|half|frame",
          svgEmpty: "full|half|frame"
        }
      },
      clockKeys: this.actor.clocks
    };
    return {
      ...t,
      ...e
    };
  }
  async _onClockAddClick(t) {
    t.preventDefault(), this.actor.addClock();
  }
  async _onClockDeleteClick(t) {
    t.preventDefault();
    const e = $(t.currentTarget).data("clockId");
    e && this.actor.deleteClock(e);
  }
  activateListeners(t) {
    super.activateListeners(t), this.options.editable && (t.find(".item-body").on("click", (e) => {
      var i;
      const a = $(e.currentTarget).parents(".item"), r = this.actor.items.get(a.data("itemId"));
      (i = r == null ? void 0 : r.sheet) == null || i.render(!0);
    }), t.find(".comp-control.comp-add-clock").on("click", this._onClockAddClick.bind(this)), t.find(".comp-control.comp-delete-clock").on("click", this._onClockDeleteClick.bind(this)));
  }
}
class vs extends I {
  // #region INITIALIZATION ~
  static async Initialize() {
    return Object.assign(globalThis, { BladesFaction: vs, BladesFactionSheet: ts }), Actors.registerSheet("blades", ts, { types: ["faction"], makeDefault: !0 }), loadTemplates(["systems/eunos-blades/templates/faction-sheet.hbs"]);
  }
  // #endregion
  static get All() {
    return new Collection(
      super.GetTypeWithTags(b.faction).map((t) => [t.id, t])
    );
  }
  static IsType(t) {
    return super.IsType(t, b.faction);
  }
  // #region BladesRoll Implementation
  // #region BladesRoll.OppositionDoc Implementation
  get rollOppID() {
    return this.id;
  }
  get rollOppDoc() {
    return this;
  }
  get rollOppImg() {
    return this.img ?? "";
  }
  get rollOppName() {
    return this.name ?? "";
  }
  get rollOppSubName() {
    return this.system.subtitle || this.system.concept || " ";
  }
  get rollOppType() {
    return this.type;
  }
  get rollOppModsSchemaSet() {
    return [];
  }
  // #endregion
  // #endregion
  // _clocks: Collection<BladesClock> = new Collection();
  // get clocks(): Collection<BladesClock> = {
  //   return new Collection()
  // }
  get clocks() {
    return new Collection(
      Object.entries(this.system.clocksData ?? {}).map(([t, e]) => [
        t,
        game.eunoblades.ClockKeys.get(t) ?? new le(e)
      ])
    );
  }
  async addClock() {
    return await le.Create({
      target: this,
      targetKey: "system.clocksData"
    });
  }
  async deleteClock(t) {
    var e;
    await ((e = game.eunoblades.ClockKeys.get(t)) == null ? void 0 : e.delete(game.eunoblades.ClockKeys));
  }
}
const et = vs;
class ss extends Ft {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["eunos-blades", "sheet", "actor", "crew"],
      template: "systems/eunos-blades/templates/crew-sheet.hbs",
      width: 940,
      height: 820,
      tabs: [{ navSelector: ".nav-tabs", contentSelector: ".tab-content", initial: "claims" }]
    });
  }
  getData() {
    const t = super.getData();
    eLog.checkLog("actor", "[BladesCrewSheet] super.getData()", { ...t });
    const { activeSubItems: e } = this.actor, a = {};
    return a.preparedItems = Object.assign(
      t.preparedItems ?? {},
      {
        abilities: e.filter((r) => r.type === g.crew_ability),
        playbook: this.actor.playbook,
        reputation: e.find((r) => r.type === g.crew_reputation),
        upgrades: e.filter((r) => r.type === g.crew_upgrade),
        preferredOp: e.find((r) => r.type === g.preferred_op)
      }
    ), a.preparedActors = {
      members: this.actor.members,
      contacts: this.actor.contacts
    }, a.tierData = {
      label: "Tier",
      dotline: {
        data: this.actor.system.tier,
        target: "system.tier.value",
        iconEmpty: "dot-empty.svg",
        iconEmptyHover: "dot-empty-hover.svg",
        iconFull: "dot-full.svg",
        iconFullHover: "dot-full-hover.svg"
      }
    }, a.upgradeData = {
      dotline: {
        dotlineClass: "dotline-right",
        data: {
          value: this.actor.availableUpgradePoints,
          max: this.actor.availableUpgradePoints
        },
        dotlineLabel: "Available Upgrade Points",
        isLocked: !0,
        iconFull: "dot-full.svg"
      }
    }, a.abilityData = {
      dotline: {
        dotlineClass: "dotline-right",
        data: {
          value: this.actor.availableAbilityPoints,
          max: this.actor.availableAbilityPoints
        },
        dotlineLabel: "Available Ability Points",
        isLocked: !0,
        iconFull: "dot-full.svg"
      }
    }, a.cohortData = {
      dotline: {
        dotlineClass: "dotline-right",
        data: {
          value: this.actor.availableCohortPoints,
          max: this.actor.availableCohortPoints
        },
        dotlineLabel: "Available Cohort Points",
        isLocked: !0,
        iconFull: "dot-full.svg"
      }
    }, a.repData = {
      label: "Rep",
      dotlines: [
        {
          data: {
            value: Math.min(this.actor.system.rep.value, this.actor.system.rep.max - this.actor.turfCount),
            max: this.actor.system.rep.max - this.actor.turfCount
          },
          target: "system.rep.value",
          svgKey: "teeth.tall",
          svgFull: "full|half|frame",
          svgEmpty: "full|half|frame"
        },
        {
          data: {
            value: this.actor.turfCount,
            max: this.actor.turfCount
          },
          target: "none",
          svgKey: "teeth.tall",
          svgFull: "full|half|frame",
          svgEmpty: "full|half|frame",
          dotlineClass: "flex-row-reverse",
          isLocked: !0
        }
      ]
    }, a.heatData = {
      label: "Heat",
      dotline: {
        data: this.actor.system.heat,
        target: "system.heat.value",
        svgKey: "teeth.tall",
        svgFull: "full|half|frame",
        svgEmpty: "full|half|frame"
      }
    }, a.wantedData = {
      label: "Wanted",
      dotline: {
        data: this.actor.system.wanted,
        target: "system.wanted.value",
        svgKey: "teeth.short",
        svgFull: "full|frame",
        svgEmpty: "frame"
      }
    }, eLog.checkLog("actor", "[BladesCrewSheet] return getData()", { ...t, ...a }), { ...t, ...a };
  }
  activateListeners(t) {
    super.activateListeners(t), this.options.editable && (t.find(".item-sheet-open").on("click", (e) => {
      var i;
      const a = $(e.currentTarget).parents(".item"), r = this.actor.items.get(a.data("itemId"));
      (i = r == null ? void 0 : r.sheet) == null || i.render(!0);
    }), t.find(".hold-toggle").on("click", () => {
      this.actor.update({ "system.hold": this.actor.system.hold === "weak" ? "strong" : "weak" });
    }), t.find(".turf-select").on("click", async (e) => {
      var i;
      const a = $(e.currentTarget).data("turfId"), r = $(e.currentTarget).data("turfStatus");
      (i = this.actor.playbook) == null || i.update({ [`system.turfs.${a}.value`]: !r }).then(() => this.render(!1));
    }));
  }
}
class ws extends I {
  // #region INITIALIZATION ~
  static async Initialize() {
    return Object.assign(globalThis, { BladesCrew: ws, BladesCrewSheet: ss }), Actors.registerSheet("blades", ss, { types: ["crew"], makeDefault: !0 }), loadTemplates(["systems/eunos-blades/templates/crew-sheet.hbs"]);
  }
  // #endregion
  // #region Static Overrides: Create ~
  // static override IsType<T extends BladesActorType = BladesActorType.crew>(doc: unknown): doc is BladesActorOfType<T> {
  //   return super.IsType(doc, BladesActorType.crew);
  // }
  static IsType(t) {
    return super.IsType(t, b.crew);
  }
  static GetFromUser(t) {
    const e = M.GetFromUser(t);
    if (e)
      return e.crew;
  }
  static GetFromPC(t) {
    let e;
    if (typeof t == "string" ? e = game.actors.get(t) ?? game.actors.getName(t) : t instanceof M ? e = t : e ?? (e = M.GetFromUser(t)), !M.IsType(e))
      throw new Error(`Unable to find BladesPC from '${t}'`);
    return e.crew;
  }
  static async create(t, e = {}) {
    return t.token = t.token || {}, t.system = t.system ?? {}, eLog.checkLog2("actor", "BladesActor.create(data,options)", { data: t, options: e }), t.token.actorLink = !0, t.system.world_name = t.system.world_name ?? t.name.replace(/[^A-Za-z_0-9 ]/g, "").trim().replace(/ /g, "_"), t.system.experience = {
      playbook: { value: 0, max: 8 },
      clues: [],
      ...t.system.experience ?? {}
    }, super.create(t, e);
  }
  // #endregion
  // #region BladesCrew Implementation
  getDialogItems(t) {
    const e = {}, { playbookName: a } = this;
    return t === te.Playbook ? e.Main = this._processEmbeddedItemMatches(k.GetTypeWithTags(g.crew_playbook)) : t === te.Reputation ? e.Main = this._processEmbeddedItemMatches(k.GetTypeWithTags(g.crew_reputation)) : t === te.Preferred_Op && a !== null ? e.Main = this._processEmbeddedItemMatches(
      k.GetTypeWithTags(g.preferred_op, a)
    ) : t === te.Ability ? e.Main = this._processEmbeddedItemMatches(
      k.GetTypeWithTags(g.crew_ability, this.playbookName)
    ) : t === te.Upgrade && a !== null && (e[a] = this._processEmbeddedItemMatches(
      k.GetTypeWithTags(g.crew_upgrade, a)
    ), e.General = this._processEmbeddedItemMatches(
      k.GetTypeWithTags(g.crew_upgrade, A.Gear.General)
    )), e;
  }
  get members() {
    if (!I.IsType(this, b.crew))
      return [];
    const t = this;
    return I.GetTypeWithTags(b.pc).filter((e) => e.isMember(t));
  }
  get contacts() {
    if (!I.IsType(this, b.crew) || !this.playbook)
      return [];
    const t = this;
    return this.activeSubActors.filter((e) => e.hasTag(t.playbookName));
  }
  get claims() {
    return !I.IsType(this, b.crew) || !this.playbook ? {} : this.playbook.system.turfs;
  }
  get turfCount() {
    return !I.IsType(this, b.crew) || !this.playbook ? 0 : Object.values(this.playbook.system.turfs).filter((t) => t.isTurf && t.value).length;
  }
  get upgrades() {
    return !I.IsType(this, b.crew) || !this.playbook ? [] : this.activeSubItems.filter((t) => t.type === g.crew_upgrade);
  }
  get cohorts() {
    return this.activeSubItems.filter((t) => [g.cohort_gang, g.cohort_expert].includes(t.type));
  }
  getTaggedItemBonuses(t) {
    return t.length;
  }
  // #endregion
  // #region BladesRoll Implementation
  // #region BladesRoll.ParticipantDoc Implementation
  get rollParticipantID() {
    return this.id;
  }
  get rollParticipantDoc() {
    return this;
  }
  get rollParticipantIcon() {
    var t;
    return ((t = this.playbook) == null ? void 0 : t.img) ?? this.img;
  }
  get rollParticipantName() {
    return this.name;
  }
  get rollParticipantType() {
    return this.type;
  }
  get rollParticipantModsSchemaSet() {
    return [];
  }
  async applyHarm(t, e) {
    console.error("Attempt to apply harm directly to a Crew document.");
  }
  async applyWorsePosition() {
    console.error("Attempt to apply worse position directly to a Crew document.");
  }
  // #endregion
  // #endregion
  get abilities() {
    return this.playbook ? this.activeSubItems.filter((t) => [g.ability, g.crew_ability].includes(t.type)) : [];
  }
  get playbookName() {
    var t;
    return (t = this.playbook) == null ? void 0 : t.name;
  }
  get playbook() {
    return this.activeSubItems.find((t) => t.type === g.crew_playbook);
  }
}
const de = ws, Vt = {
  [b.pc]: M,
  [b.npc]: Qe,
  [b.faction]: et,
  [b.crew]: de
}, Zi = new Proxy(function() {
}, {
  construct(s, t) {
    const [{ type: e }] = t;
    if (!e)
      throw new Error(`Invalid Actor Type: ${String(e)}`);
    const a = Vt[e];
    return a ? new a(...t) : new I(...t);
  },
  get(s, t) {
    switch (t) {
      case "create":
      case "createDocuments":
        return function(e, a = {}) {
          if (h.isArray(e))
            return e.map((i) => CONFIG.Actor.documentClass.create(i, a));
          const r = Vt[e.type];
          return r ? r.create(e, a) : I.create(e, a);
        };
      case Symbol.hasInstance:
        return function(e) {
          return Object.values(Vt).some((a) => e instanceof a);
        };
      default:
        return I[t];
    }
  }
});
class Se extends we {
  // #region Static Methods ~
  static async Initialize() {
    if (!game.messages)
      throw new Error("[BladesConsequence] Messages Not Ready!");
    return (await Promise.all(game.messages.contents.map(async (t) => t.rollConsequences))).flat();
  }
  /**
  * Checks if the given value is valid consequence data for a Resistance Roll.
  * @param val The value to check.
  * @param isCheckingResistedTo If the check is being recursively applied to the 'resistTo' value.
  * @returns True if the val is valid BladesConsequence.Data, false otherwise.
  */
  static IsValidConsequenceData(t, e = !1) {
    return !h.isList(t) || typeof t.type != "string" || !(t.type in ue) || typeof t.name != "string" ? !1 : e ? !0 : !(t.attribute && (typeof t.attribute != "string" || !(t.attribute in re)) || !this.IsValidConsequenceData(t.resistTo, !0));
  }
  static ApplySchemaDefaults(t) {
    if (!t.primaryID)
      throw new Error("A primaryID is required for BladesConsequence.Schema");
    if (typeof t.name == "string" && !t.name && t.type !== ue.None)
      throw new Error(`A name must be provided for non-None-type consequences (${t.name}).`);
    return {
      name: "",
      type: ue.None,
      ...t
    };
  }
  static GetCsqTypeValue(t, e) {
    if (t === ue.WorsePosition) {
      if (!e)
        throw new Error(`Cannot resolve consequence type value for '${t}' without roll data.`);
      let a;
      if ("rollPositionFinal" in e ? a = e.rollPositionFinal : "position" in e && (a = e.position), !a)
        throw new Error(`Cannot resolve consequence type value for '${t}' without roll data that includes final position data.`);
      return {
        [ie.controlled]: 1,
        [ie.risky]: 2,
        [ie.desperate]: 0
      }[a];
    }
    if (t === ue.ReducedEffect) {
      if (!e)
        throw new Error(`Cannot resolve consequence type value for '${t}' without roll data.`);
      let a;
      if ("rollEffectFinal" in e ? a = e.rollEffectFinal : "effect" in e && (a = e.effect), !a)
        throw new Error(`Cannot resolve consequence type value for '${t}' without roll data that includes final effect data.`);
      return {
        [ee.extreme]: 1,
        [ee.great]: 1,
        [ee.standard]: 1,
        [ee.limited]: 2,
        [ee.zero]: 0
      }[a];
    }
    return v.ConsequenceValues[t];
  }
  // #endregion
  // #region *** GETTERS *** ~
  // #region Getters (Target Data) ~
  get primaryID() {
    var t;
    return this.data.primaryID ?? ((t = this.parentConsequence) == null ? void 0 : t.primaryID);
  }
  get parentCsqID() {
    return this.data.parentCsqID;
  }
  get name() {
    return this.data.name;
  }
  get type() {
    return this.data.type;
  }
  get attribute() {
    var t;
    return this.data.attribute ?? ((t = this.parentConsequence) == null ? void 0 : t.attribute);
  }
  get attributeVal() {
    var t;
    return this.data.attributeVal ?? ((t = this.parentConsequence) == null ? void 0 : t.attributeVal);
  }
  get specialFooterMsg() {
    var t;
    return this.data.specialFooterMsg ?? ((t = this.parentConsequence) == null ? void 0 : t.specialFooterMsg);
  }
  // #endregion
  // #region Getters (Derived Data) ~
  get primary() {
    const t = fromUuidSync(this.primaryID);
    if (!R.IsDoc(t))
      throw new Error(`Could not find primary with UUID '${this.primaryID}'`);
    return this.roll ? new R(this.roll, t) : new R(t);
  }
  get parentConsequence() {
    if (!this.parentCsqID)
      return;
    const t = game.eunoblades.Consequences.get(this.parentCsqID);
    if (!t)
      throw new Error(`Error locating parent consequence with id '${this.parentCsqID}'`);
    return t;
  }
  get typeDisplay() {
    return v.ConsequenceDisplay[this.type];
  }
  get icon() {
    return v.ConsequenceIcons[this.type];
  }
  get value() {
    return Se.GetCsqTypeValue(this.type, this);
  }
  // #endregion
  // #region Getters (Resolved Roll Data that Applied This Consequence) ~
  get rollData() {
    var t;
    return this.data.actionRollData ?? ((t = this.parentConsequence) == null ? void 0 : t.rollData);
  }
  get roll() {
    if (this.rollData)
      return game.eunoblades.Rolls.get(this.rollData.id) ?? new Ie({
        ...this.rollData,
        isScopingById: !1
      });
  }
  get position() {
    var t;
    return (t = this.roll) == null ? void 0 : t.rollPositionFinal;
  }
  get effect() {
    var t;
    return (t = this.roll) == null ? void 0 : t.rollEffectFinal;
  }
  get result() {
    var t;
    return (t = this.roll) == null ? void 0 : t.rollResultFinal;
  }
  // #endregion
  // #region Getters (Resistibility & Acceptance Status) ~
  isResistible() {
    return !!(this.type !== ue.None && !this.isAccepted && this.data.resistSchema);
  }
  get resistanceModes() {
    return this.data.resistanceModes ?? [];
  }
  get wasResisted() {
    return !!this.resistanceModes.length;
  }
  get wasResistedByRoll() {
    return this.resistanceModes.includes("resist");
  }
  get wasResistedByArmor() {
    return this.resistanceModes.includes("armor");
  }
  get wasResistedBySpecialArmor() {
    var t;
    return (t = this.resistanceModes) == null ? void 0 : t.includes("special");
  }
  get canResistWithRoll() {
    return !(!this.isResistible() || !M.IsType(this.primary.rollPrimaryDoc) || this.wasResistedByRoll);
  }
  get canResistWithArmor() {
    return !this.isResistible() || !this.data.canResistWithArmor ? !1 : this.primary.availableArmorCount > 0;
  }
  get canResistWithSpecial() {
    return !this.isResistible() || !this.data.canResistWithSpecial || !M.IsType(this.primary.rollPrimaryDoc) || this.wasResistedBySpecialArmor ? !1 : this.primary.hasSpecialArmor;
  }
  get resistWithRollNegates() {
    return this.canResistWithRoll ? this.wasResisted ? !0 : !!this.data.resistWithRollNegates : !1;
  }
  get resistWithArmorNegates() {
    return this.canResistWithArmor ? this.wasResisted ? !0 : !!this.data.resistWithArmorNegates : !1;
  }
  get resistWithSpecialNegates() {
    return this.canResistWithSpecial ? this.wasResisted ? !0 : !!this.data.resistWithSpecialNegates : !1;
  }
  get isAccepted() {
    return "acceptanceMode" in this.data;
  }
  get acceptanceMode() {
    return this.data.acceptanceMode;
  }
  // #endregion
  // #endregion
  // #region *** RESISTING CONSEQUENCES ***
  // #region Constructing Resistable Consequence Schema
  get noneSchema() {
    return {
      name: "",
      type: ue.None,
      primaryID: this.primaryID
    };
  }
  get resistSchema() {
    if (!this.isResistible())
      return;
    const t = {
      name: this.data.resistSchema.name,
      type: this.data.resistSchema.type,
      primaryID: this.primaryID,
      resistSchema: {
        name: "",
        type: ue.None
      },
      resistanceModes: this.resistanceModes,
      resistWithRollNegates: !0,
      attribute: this.attribute,
      attributeVal: this.attributeVal,
      canResistWithArmor: this.canResistWithArmor,
      resistWithArmorNegates: !0,
      canResistWithSpecial: this.canResistWithSpecial,
      resistWithSpecialNegates: !0,
      specialFooterMsg: this.specialFooterMsg
    };
    return this.wasResisted && (t.name = "", t.type = ue.None, delete t.resistSchema, t.canResistWithArmor = !1, t.canResistWithSpecial = !1), t;
  }
  // #endregion
  async resistConsequence(t, e) {
    if (!this.isResistible())
      throw new Error("Cannot resist a consequence that is not resistible.");
    const a = {
      resistanceModes: this.resistanceModes,
      ...this.resistSchema
    };
    if (a.resistanceModes.push(t), a.parentCsqID = void 0, t === "resist") {
      if (!(e != null && e.isResolved))
        throw new Error("Cannot transform to resisted consequence without a resolved resistance roll instance.");
      a.resistanceRollData = e.data;
    }
    this.wasResisted || a.type === ue.None ? a.acceptanceMode = "base" : t === "resist" && !this.canResistWithArmor && !this.canResistWithSpecial && (a.acceptanceMode = t), await this.updateTargetData(a), a.acceptanceMode ? socketlib.system.executeForEveryone("acceptConsequence_SocketCall", this.id) : socketlib.system.executeForEveryone("resistConsequence_SocketCall", this.id);
  }
  // #endregion
  // #region *** ACCEPTING CONSEQUENCES ***
  async acceptConsequence() {
    this.isAccepted || (await this.updateTarget("acceptanceMode", h.getLast(this.resistanceModes) ?? "accept"), socketlib.system.executeForEveryone("acceptConsequence_SocketCall", this.id));
  }
  async applyConsequenceEffects() {
    if (/Harm/.test(this.type))
      this.primary.applyHarm(
        h.pInt(this.type.substring(this.type.length - 1)),
        this.name
      );
    else if (this.type === ue.WorsePosition)
      this.primary.applyWorsePosition();
    else if (this.type === ue.ReducedEffect) {
      const t = Object.values(ee).findIndex((e) => e === this.effect);
      if (t >= 1) {
        const e = Object.values(ee)[t - 1];
        await this.updateTarget("rollData.rollEffectFinal", e);
      }
    }
  }
  // #endregion
  // #region === CONSTRUCTOR === ~
  // constructor(
  //   config: BladesConsequence.Config,
  //   parentCsq?: BladesConsequence.Data
  // )
  // constructor(
  //   data: BladesConsequence.Data
  // )
  // constructor(
  //   schema: Partial<BladesConsequence.Schema>,
  //   parentCsq: BladesConsequence.Data
  // )
  // constructor(
  //   dataConfigOrSchema: BladesConsequence.Config | BladesConsequence.Data | Partial<BladesConsequence.Schema>,
  //   parentCsq?: BladesConsequence.Data
  // ) {
  //   // If a parentCsq is provided...
  //   if (parentCsq) {
  //     super({
  //       ...BladesTargetLink.BuildLinkConfig(parentCsq),
  //       ...dataConfigOrSchema
  //     });
  //   } else {
  //     super(dataConfigOrSchema as BladesConsequence.Config | BladesConsequence.Data);
  //   }
  // }
  // #endregion
  // #region *** HTML INTERACTION ***
  // #region *** BladesDialog *** ~
  // #endregion
  // #region *** BladesChat *** ~
  static ApplyChatListeners(t) {
    t.elem$.find(".comp.consequence-display-container").each((a, r) => {
      if (!$(r).hasClass("consequence-accepted")) {
        const i = $(r).find(".consequence-icon-container"), o = $(r).find(".interaction-pad-right"), n = $(r).find(".interaction-pad-left"), l = $(r).find(".interaction-pad-left-resist"), c = $(r).find(".interaction-pad-left-armor"), d = $(r).find(".interaction-pad-left-special");
        $(r).data("hoverTimeline", h.gsap.effects.csqEnter(r)), $(r).on({
          mouseenter: function() {
            $(r).css("z-index", 10), $(r).data("hoverTimeline").play();
          },
          mouseleave: function() {
            (!(i.data("isToggled") || i.data("isTogglingOn")) || i.data("isTogglingOff")) && $(r).data("hoverTimeline").reverse().then(() => {
              $(r).css("z-index", "");
            });
          }
        }), i.data("clickTimeline", h.gsap.effects.csqClickIcon(i[0])), i.on({
          click: function() {
            i.data("isToggled") || i.data("isTogglingOn") ? (i.data("isTogglingOn", !1), i.data("isTogglingOff", !0), i.data("clickTimeline").reverse().then(() => {
              i.data("isTogglingOff", !1), i.data("isToggled", !1);
            })) : (i.data("isTogglingOn", !0), i.data("isTogglingOff", !1), Array.from($(r).siblings(".consequence-display-container")).forEach((p) => {
              const u = $(p).find(".consequence-icon-container");
              (u != null && u.data("isToggled") || u != null && u.data("isTogglingOn")) && (u.data("isTogglingOn", !1), u.data("isTogglingOff", !0), u.data("clickTimeline").reverse().then(() => {
                u.data("isTogglingOff", !1), u.data("isToggled", !1), $(p).data("hoverTimeline").reverse().then(() => {
                  $(p).css("z-index", "");
                });
              }));
            }), i.data("clickTimeline").play().then(() => {
              i.data("isTogglingOn", !1), i.data("isToggled", !0);
            }));
          }
        }), o.data("hoverTimeline", h.gsap.effects.csqEnterRight(r)), o.on({
          mouseenter: function() {
            i.data("isToggled") && o.data("hoverTimeline").play();
          },
          mouseleave: function() {
            o.data("hoverTimeline").reverse();
          }
        }), n.data("hoverTimeline", h.gsap.effects.csqEnterLeft(r)), n.on({
          mouseenter: function() {
            i.data("isToggled") && n.data("hoverTimeline").play();
          },
          mouseleave: function() {
            n.data("hoverTimeline").reverse();
          }
        }), l.data("hoverTimeline", h.gsap.effects.csqEnterSubLeft(r, { type: "resist" })), l.on({
          mouseenter: function() {
            i.data("isToggled") && l.data("hoverTimeline").play();
          },
          mouseleave: function() {
            i.data("isToggled") && l.data("hoverTimeline").reverse();
          }
        }), c.data("hoverTimeline", h.gsap.effects.csqEnterSubLeft(r, { type: "armor" })), c.on({
          mouseenter: function() {
            i.data("isToggled") && c.data("hoverTimeline").play();
          },
          mouseleave: function() {
            i.data("isToggled") && c.data("hoverTimeline").reverse();
          }
        }), d.data("hoverTimeline", h.gsap.effects.csqEnterSubLeft(r, { type: "special" })), d.on({
          mouseenter: function() {
            i.data("isToggled") && d.data("hoverTimeline").play();
          },
          mouseleave: function() {
            i.data("isToggled") && d.data("hoverTimeline").reverse();
          }
        });
      }
    });
  }
  // #endregion
  // #endregion
}
function Fs(s) {
  return !!(s && typeof s == "string" && h.lCase(s) in Ae);
}
function Ns(s) {
  return !!(s && typeof s == "string" && h.lCase(s) in re);
}
function Hs(s) {
  return !!(s && typeof s == "string" && h.lCase(s) in m);
}
function Xi(s) {
  return typeof s == "string" && s in T;
}
function Ji(s) {
  return [
    C.roll,
    C.position,
    C.effect
  ].includes(s);
}
function Qi(s) {
  return !!(s.startsWith("Group_") || ["Assist", "Setup"].includes(s));
}
class _e extends we {
  constructor(e, a) {
    super(e);
    w(this, "isRerendering", !1);
    w(this, "_rollInstance");
    this._rollInstance = a;
  }
  static ApplySchemaDefaults(e) {
    if (!e.name)
      throw new Error("name is required for BladesRollMod.Schema");
    return {
      key: `${e.name}-positive-roll`,
      modType: F.general,
      section: C.roll,
      posNeg: "positive",
      base_status: T.Hidden,
      value: 1,
      tooltip: "",
      ...e
    };
  }
  static get GMOnlyModStatuses() {
    return [T.ForcedOn, T.ForcedOff, T.Hidden];
  }
  static getSchemaFromStrings(e) {
    const a = h.pullElement(e, (d) => typeof d == "string" && /^na/i.test(d)), r = typeof a == "string" && a.replace(/^.*:/, "");
    if (!r)
      throw new Error(`RollMod Missing Name: '${e.join("@")}'`);
    const i = h.pullElement(e, (d) => typeof d == "string" && /^cat/i.test(d)), o = typeof i == "string" && i.replace(/^.*:/, "");
    if (!o || !(o in C))
      throw new Error(`RollMod Missing Category: '${e.join("@")}'`);
    const l = (h.pullElement(e, (d) => typeof d == "string" && /^p/i.test(d)) || "posNeg:positive").replace(/^.*:/, "");
    return {
      key: `${r}-${l}-${o}`,
      name: r,
      section: o,
      posNeg: l,
      base_status: T.ToggledOff,
      modType: F.general,
      tooltip: "",
      value: 1,
      ...Object.fromEntries(
        e.map(c)
      )
    };
    function c(d) {
      const [p, u] = d.split(/:/);
      let f = /\|/.test(u) ? u.split(/\|/) : u, y;
      if (/^stat/i.test(p))
        y = "base_status";
      else if (/^val/i.test(p))
        y = "value";
      else if (/^eff|^ekey/i.test(p))
        y = "effectKeys";
      else if (/^side|^ss/i.test(p))
        y = "sideString";
      else if (/^s.*ame/i.test(p))
        y = "source_name";
      else if (/^tool|^tip/i.test(p))
        y = "tooltip";
      else if (/^ty/i.test(p))
        y = "modType";
      else if (/^c.{0,10}r?.{0,3}ty/i.test(p))
        y = "conditionalRollTypes";
      else if (/^a.{0,3}r?.{0,3}y/i.test(p))
        y = "autoRollTypes";
      else if (/^p.{0,10}r?.{0,3}y/i.test(p))
        y = "participantRollTypes";
      else if (/^c.{0,10}r?.{0,3}tr/i.test(p))
        y = "conditionalRollTraits";
      else if (/^a.{0,3}r?.{0,3}tr/i.test(p))
        y = "autoRollTraits";
      else if (/^p.{0,10}r?.{0,3}tr/i.test(p))
        y = "participantRollTypes";
      else
        throw new Error(`Bad Roll Mod Key: ${p}`);
      y === "base_status" && f === "Conditional" && (f = T.Hidden);
      let S;
      return ["value"].includes(y) ? S = h.pInt(f) : ["effectKeys", "conditionalRollTypes", "autoRollTypes", "conditionalRollTraits", "autoRollTraits"].includes(y) ? S = [f].flat() : S = f.replace(/%COLON%/g, ":"), [y, S];
    }
  }
  static ParseDocModsToSchemaSet(e) {
    if (e instanceof Ne)
      throw new Error("BladesRollMod.ParseDocRollMods cannot be called on a BladesChat document.");
    const { roll_mods: a } = e.system;
    return !a || a.length === 0 ? [] : a.filter((r) => !!(r && typeof r == "string")).map((r) => this.getSchemaFromStrings(r.split(/@/)));
  }
  get status() {
    return this.userStatus && _e.GMOnlyModStatuses.includes(this.userStatus) ? this.userStatus : this.heldStatus && [T.ToggledOff, T.ToggledOn].includes(this.heldStatus) ? this.userStatus ?? this.heldStatus : this.heldStatus ?? this.userStatus ?? this.baseStatus;
  }
  get isActive() {
    return [T.ToggledOn, T.ForcedOn].includes(this.status);
  }
  get isVisible() {
    return this.status !== T.Hidden;
  }
  // get flagParams() {
  //   return [C.SYSTEM_ID, `rollCollab.rollModsData.${this.id}`] as const;}
  // async setUserStatusFlag(val: RollModStatus | undefined) {
  // }
  get isConditional() {
    return [
      ...this.conditionalRollTraits,
      ...this.autoRollTraits,
      ...this.participantRollTraits,
      ...this.conditionalRollTypes,
      ...this.autoRollTypes,
      ...this.participantRollTypes
    ].length > 0;
  }
  get isInInactiveBlock() {
    return game.user.isGM ? [T.Hidden, T.ForcedOff, T.ToggledOff].includes(this.status) && (this.isConditional || this.modType === F.ability) : [T.ForcedOff, T.ToggledOff].includes(this.status) && (this.isConditional || this.modType === F.ability);
  }
  get isPush() {
    return !!(h.lCase(this.name) === "push" || this.effectKeys.find((e) => e === "Is-Push"));
  }
  get isBasicPush() {
    return h.lCase(this.name) === "push";
  }
  get stressCost() {
    const e = this.effectKeys.filter((r) => r.startsWith("Cost-Stress"));
    if (e.length === 0)
      return 0;
    let a = 0;
    return e.forEach((r) => {
      const [i] = (r.split(/-/) ?? []).slice(1), [o, n] = (/([A-Za-z]+)(\d*)/.exec(i) ?? []).slice(1);
      a += h.pInt(n);
    }), a;
  }
  isValidForRollType() {
    switch (this.rollInstance.rollType) {
      case _.Action:
        return !0;
      case _.Resistance:
      case _.Fortune:
      case _.IndulgeVice:
        return !(this.isPush || ["bargain", "setup", "assist", "potency"].includes(h.lCase(this.name)));
      default:
        return !1;
    }
  }
  /**
   * Checks if any types or traits apply to the roll instance.
   * @param {AnyRollType[]} types The types to check.
   * @param {RollTrait[]} traits The traits to check.
   * @returns {boolean} - Returns true if any types or traits apply, false otherwise.
   */
  checkTypesOrTraits(e, a) {
    const r = [this.rollInstance.rollType, this.rollInstance.rollSubType, this.rollInstance.rollDowntimeAction].filter((n) => !!n), i = !this.rollInstance.isParticipantRoll && e.length === 0 || r.some((n) => e.includes(n)), o = !this.rollInstance.isParticipantRoll && a.length === 0 || this.rollInstance.rollTrait && a.includes(this.rollInstance.rollTrait);
    return !!(i && o);
  }
  /**
   * Sets the conditional status of the roll mod instance.
   * @returns {boolean} - Returns false if the status is ForcedOn or ToggledOff, true if the status is Hidden.
   */
  setConditionalStatus() {
    return this.isConditional ? this.autoRollTypes.includes(this.rollInstance.rollType) || this.rollInstance.rollSubType && this.autoRollTypes.includes(this.rollInstance.rollSubType) || this.rollInstance.rollDowntimeAction && this.autoRollTypes.includes(this.rollInstance.rollDowntimeAction) ? (this.heldStatus = T.ForcedOn, !1) : this.rollInstance.rollTrait && this.autoRollTraits.includes(this.rollInstance.rollTrait) ? (this.heldStatus = T.ForcedOn, !1) : this.checkTypesOrTraits(this.conditionalRollTypes, this.conditionalRollTraits) ? (this.heldStatus = T.ToggledOff, !1) : this.rollInstance.isParticipantRoll && this.checkTypesOrTraits(this.participantRollTypes, this.participantRollTraits) ? (this.heldStatus = T.ToggledOff, !1) : (this.heldStatus = T.Hidden, !0) : !1;
  }
  /**
   * Sets the auto-reveal/enable status of the roll mod instance.
   * @returns {boolean} - Returns false if the status is ForcedOn or ToggledOff, true if the status is Hidden.
   */
  setAutoStatus() {
    const e = this.effectKeys.filter((a) => a.startsWith("Auto"));
    if (e.length === 0)
      return !1;
    for (const a of e) {
      const [r, i] = a.split(/-/) ?? [];
      if (h.lCase(i) in ie && this.rollInstance.rollPositionFinal === h.lCase(i)) {
        if (r === "AutoRevealOn")
          return this.heldStatus = T.ToggledOff, !1;
        if (r === "AutoEnableOn")
          return this.heldStatus = T.ForcedOn, !1;
      }
    }
    return this.heldStatus = T.Hidden, !0;
  }
  /**
   * Sets the relevancy status of the roll mod instance (i.e. hides irrelevant rollMods).
   * @returns {boolean} - Returns true if mod is irrelevant and status is Hidden, false otherwise.
   */
  setRelevancyStatus() {
    const e = this.effectKeys.filter((r) => /^Negate|^Increase/.test(r));
    return e.length === 0 ? !1 : e.filter((r) => {
      const [i, o] = r.split(/-/) ?? [];
      if (i === "Negate") {
        const n = {
          PushCost: () => this.rollInstance.isPushed(),
          QualityPenalty: () => {
            var l, c;
            return this.rollInstance.isTraitRelevant(m.quality) && (((l = this.rollInstance.rollFactors.source[m.quality]) == null ? void 0 : l.value) ?? 0) < (((c = this.rollInstance.rollFactors.opposition[m.quality]) == null ? void 0 : c.value) ?? 0);
          },
          ScalePenalty: () => {
            var l, c;
            return this.rollInstance.isTraitRelevant(m.scale) && (((l = this.rollInstance.rollFactors.source[m.scale]) == null ? void 0 : l.value) ?? 0) < (((c = this.rollInstance.rollFactors.opposition[m.scale]) == null ? void 0 : c.value) ?? 0);
          },
          TierPenalty: () => {
            var l, c;
            return this.rollInstance.isTraitRelevant(m.tier) && (((l = this.rollInstance.rollFactors.source[m.tier]) == null ? void 0 : l.value) ?? 0) < (((c = this.rollInstance.rollFactors.opposition[m.tier]) == null ? void 0 : c.value) ?? 0);
          }
        };
        if (Object.hasOwn(n, o))
          return n[o]();
        throw new Error(`Unrecognized Negate parameter: ${o}`);
      } else if (i === "Increase") {
        const [n, l] = /(\w+)\d+/.exec(o) ?? [];
        return this.rollInstance.isTraitRelevant(l);
      } else
        throw new Error(`Unrecognized Function Key: ${i}`);
    }).length === 0 ? (this.heldStatus = T.Hidden, !0) : !1;
  }
  /**
   * Sets the payable status of the roll mod instance (i.e. forces off rollMods the primary can't pay for).
   * @returns {boolean} - Returns true if mod is unpayable and status is ForcedOff, false otherwise.
   */
  setPayableStatus() {
    const e = this.effectKeys.filter((r) => r.startsWith("Cost"));
    return e.length === 0 ? !1 : e.filter((r) => {
      const [i] = (r.split(/-/) ?? []).slice(1), [o, n] = (/([A-Za-z]+)(\d*)/.exec(i) ?? []).slice(1), { rollPrimaryDoc: l } = this.rollInstance.rollPrimary ?? {};
      if (!R.IsDoc(l))
        return !1;
      switch (o) {
        case "SpecialArmor":
          return I.IsType(l, b.pc) && l.system.armor.active.special && !l.system.armor.checked.special;
        case "Stress": {
          const c = h.pInt(n);
          return I.IsType(l, b.pc) && l.system.stress.max - l.system.stress.value >= c;
        }
        case "Heat":
          return M.IsType(l) && de.IsType(l.crew) || de.IsType(
            l
          );
        default:
          throw new Error(`Unrecognize Payable Key: ${o}`);
      }
    }).length === 0 ? (this.heldStatus = T.ForcedOff, !0) : !1;
  }
  applyRollModEffectKeys() {
    if (!this.isActive)
      return;
    const e = this.effectKeys.filter((a) => /^Negate|^Increase/.test(a)).map((a) => a.split(/-/));
    e.length !== 0 && e.forEach(([a, r]) => {
      if (a === "Negate") {
        const i = {
          PushCost: () => {
            this.rollInstance.negatePushCost();
          },
          QualityPenalty: () => {
            this.rollInstance.negateFactorPenalty(m.quality);
          },
          ScalePenalty: () => {
            this.rollInstance.negateFactorPenalty(m.scale);
          },
          TierPenalty: () => {
            this.rollInstance.negateFactorPenalty(m.tier);
          }
        };
        if (Object.hasOwn(i, r))
          return i[r]();
        throw new Error(`Unrecognized Negate parameter: ${r}`);
      } else if (a === "Increase") {
        const [i, o] = /(\w+)\d+/.exec(r) ?? [];
        return this.rollInstance.isTraitRelevant(o);
      } else
        throw new Error(`Unrecognized Function Key: ${a} (key: ${a})`);
    });
  }
  get selectOptions() {
    return this.modType !== F.teamwork ? null : this.name === "Assist" || this.name === "Setup" ? this.rollInstance.rollParticipantSelectOptions[this.name] : this.name.startsWith("Group_") ? this.rollInstance.rollParticipantSelectOptions.Group : null;
  }
  get selectedParticipant() {
    return this.modType !== F.teamwork ? null : this.rollInstance.getRollParticipant(this.section, this.name);
  }
  get allFlagData() {
    return this.rollInstance.data;
  }
  get costs() {
    if (!this.isActive)
      return;
    const e = this.effectKeys.filter((a) => a.startsWith("Cost"));
    if (e.length !== 0)
      return e.map((a) => {
        const [r] = (a.split(/-/) ?? []).slice(1), [i, o] = (/([A-Za-z]+)(\d*)/.exec(r) ?? []).slice(1);
        let n = this.name;
        if (this.isBasicPush)
          if (this.posNeg === "negative")
            n = `${this.name} (<span class='red-bright'>To Act</span>)`;
          else {
            const l = this.section === C.roll ? "+1d" : "+1 effect";
            n = `${this.name} (<span class='gold-bright'>${l}</span>)`;
          }
        return {
          id: this.id,
          label: n,
          costType: i,
          costAmount: o ? h.pInt(o) : 1
        };
      });
  }
  get rollInstance() {
    return this._rollInstance;
  }
  get name() {
    return this.data.name;
  }
  get modType() {
    return this.data.modType;
  }
  get sourceName() {
    return this.data.source_name ?? this.data.name;
  }
  get section() {
    return this.data.section;
  }
  get posNeg() {
    return this.data.posNeg;
  }
  get userStatus() {
    return this.data.user_status;
  }
  set userStatus(e) {
    if (e === this.userStatus)
      return;
    const { isRerendering: a } = this;
    if (!e || e === this.baseStatus)
      this.updateTarget("user_status", null).then(() => {
        a && this.rollInstance.renderRollCollab_SocketCall();
      });
    else {
      if (!game.user.isGM && (_e.GMOnlyModStatuses.includes(e) || this.userStatus && _e.GMOnlyModStatuses.includes(this.userStatus)))
        return;
      this.updateTarget("user_status", e).then(() => {
        a && this.rollInstance.renderRollCollab_SocketCall();
      });
    }
  }
  get baseStatus() {
    return this.data.base_status;
  }
  get heldStatus() {
    return this.data.held_status;
  }
  set heldStatus(e) {
    if (e === this.heldStatus)
      return;
    const { isRerendering: a } = this;
    e ? this.updateTarget("held_status", e).then(() => {
      a && this.rollInstance.renderRollCollab_SocketCall();
    }) : this.updateTarget("held_status", null).then(() => {
      a && this.rollInstance.renderRollCollab_SocketCall();
    });
  }
  get value() {
    return this.data.value;
  }
  get effectKeys() {
    return this.data.effectKeys ?? [];
  }
  get sideString() {
    if (this.data.sideString)
      return this.data.sideString;
    if (this.selectedParticipant)
      return this.selectedParticipant.rollParticipantName;
  }
  get tooltip() {
    let e = this.data.tooltip.replace(/%COLON%/g, ":");
    return e.includes("%DOC_NAME%") && (e = e.replace(
      /%DOC_NAME%/g,
      this.selectedParticipant ? this.selectedParticipant.rollParticipantName : "an Ally"
    )), e.includes("@OPPOSITION_NAME@") && (e = e.replace(
      /@OPPOSITION_NAME@/g,
      this.rollInstance.rollOpposition ? this.rollInstance.rollOpposition.rollOppName : "Your Opposition"
    )), e;
  }
  get conditionalRollTypes() {
    return this.data.conditionalRollTypes ?? [];
  }
  get autoRollTypes() {
    return this.data.autoRollTypes ?? [];
  }
  get participantRollTypes() {
    return this.data.participantRollTypes ?? [];
  }
  get conditionalRollTraits() {
    return this.data.conditionalRollTraits ?? [];
  }
  get autoRollTraits() {
    return this.data.autoRollTraits ?? [];
  }
  get participantRollTraits() {
    return this.data.participantRollTraits ?? [];
  }
}
class R {
  constructor(...t) {
    // #endregion
    w(this, "rollInstance");
    w(this, "rollPrimaryID");
    w(this, "_rollPrimaryDoc");
    w(this, "rollPrimaryName");
    w(this, "rollPrimaryType");
    w(this, "rollPrimaryImg");
    w(this, "rollPrimaryModsSchemaSet");
    w(this, "rollFactors");
    let e = !1, a = !1;
    if (t[0] instanceof Fe && (this.rollInstance = t[0], t.shift()), R.IsDoc(t[0]) ? a = t[0] : R.IsValidData(t[0]) ? e = t[0] : h.isList(t[0]) && ("rollPrimaryID" in t[0] ? a = R.GetDoc(t[0].rollPrimaryID) : "rollPrimaryName" in t[0] && (a = R.GetDoc(t[0].rollPrimaryName))), a && !R.IsValidData(e) && (e = {
      rollPrimaryID: a.rollPrimaryID,
      rollPrimaryName: a.rollPrimaryName,
      rollPrimaryType: a.rollPrimaryType,
      rollPrimaryImg: a.rollPrimaryImg,
      rollPrimaryModsSchemaSet: a.rollPrimaryModsSchemaSet,
      rollFactors: a.rollFactors
    }), !R.IsValidData(e) && !R.IsDoc(a) && this.rollInstance && (e = this.rollInstance.rollPrimary.data), !R.IsValidData(e))
      throw new Error(`[BladesRoll.constructor] Failed to resolve primary data from provided arguments: ${JSON.stringify(t)}`);
    const {
      rollPrimaryID: r,
      rollPrimaryName: i,
      rollPrimaryType: o,
      rollPrimaryImg: n,
      rollPrimaryModsSchemaSet: l,
      rollFactors: c
    } = e;
    if (this.rollPrimaryID = r, !i)
      throw new Error("Must include a rollPrimaryName when constructing a BladesRollPrimary object.");
    if (!n)
      throw new Error("Must include a rollPrimaryImg when constructing a BladesRollPrimary object.");
    if (!o)
      throw new Error("Must include a rollPrimaryType when constructing a BladesRollPrimary object.");
    if (!c)
      throw new Error("Must include a rollFactors when constructing a BladesRollPrimary object.");
    this.rollPrimaryName = i, this.rollPrimaryType = o, this.rollPrimaryImg = n, this.rollFactors = c, this.rollPrimaryModsSchemaSet = l ?? [];
  }
  // #region Static Methods ~
  static IsValidData(t) {
    return R.IsDoc(t) ? !1 : h.isList(t) && typeof t.rollPrimaryName == "string" && typeof t.rollPrimaryType == "string" && typeof t.rollPrimaryImg == "string" && Array.isArray(t.rollPrimaryModsSchemaSet) && h.isList(t.rollFactors) && (!t.rollPrimaryID || typeof t.rollPrimaryID == "string") && (!t.rollPrimaryDoc || R.IsDoc(t.rollPrimaryDoc));
  }
  static GetDoc(t) {
    let e = t;
    return typeof t == "string" && (e = game.actors.get(t) ?? game.items.get(t) ?? game.actors.getName(t) ?? game.items.getName(t)), R.IsDoc(e) && e;
  }
  static IsDoc(t) {
    return I.IsType(t, b.pc, b.crew) || k.IsType(t, g.cohort_expert, g.cohort_gang, g.gm_tracker);
  }
  static GetDataFromDoc(t) {
    return {
      rollPrimaryID: t.id,
      rollPrimaryName: t.name,
      rollPrimaryType: t.type,
      rollPrimaryImg: t.img,
      rollPrimaryModsSchemaSet: t.rollPrimaryModsSchemaSet,
      rollFactors: t.rollFactors
    };
  }
  static BuildData(t) {
    if (R.IsValidData(t.rollPrimaryData))
      return t.rollPrimaryData;
    let e;
    const a = game.users.get(t.rollUserID ?? game.user.id);
    if ("target" in t && R.IsDoc(t.target))
      e = t.target;
    else if (a && R.IsDoc(a.character))
      e = a.character;
    else
      throw new Error("[BladesRollPrimary.BuildData()] A valid source of PrimaryData must be provided to construct a roll.");
    return {
      rollPrimaryID: e.rollPrimaryID,
      rollPrimaryName: e.rollPrimaryName,
      rollPrimaryType: e.rollPrimaryType,
      rollPrimaryImg: e.rollPrimaryImg,
      rollPrimaryModsSchemaSet: e.rollPrimaryModsSchemaSet,
      rollFactors: e.rollFactors
    };
  }
  static Build(t) {
    return new R(this.BuildData(t));
  }
  get rollPrimaryDoc() {
    if (!this._rollPrimaryDoc) {
      let t;
      this.rollPrimaryID && (t = game.items.get(this.rollPrimaryID) ?? game.actors.get(this.rollPrimaryID)), !t && this.rollPrimaryName && (t = game.items.getName(this.rollPrimaryName) ?? game.actors.getName(this.rollPrimaryName)), R.IsDoc(t) && (this._rollPrimaryDoc = t);
    }
    return this._rollPrimaryDoc;
  }
  get data() {
    return {
      rollPrimaryID: this.rollPrimaryID,
      rollPrimaryName: this.rollPrimaryName,
      rollPrimaryType: this.rollPrimaryType,
      rollPrimaryImg: this.rollPrimaryImg,
      rollPrimaryModsSchemaSet: this.rollPrimaryModsSchemaSet,
      rollFactors: this.rollFactors
    };
  }
  get isWorsePosition() {
    return this.rollPrimaryDoc ? this.rollPrimaryDoc.getFlag("eunos-blades", "isWorsePosition") === !0 : !1;
  }
  async applyHarm(t, e) {
    if (this.rollPrimaryDoc)
      return this.rollPrimaryDoc.applyHarm(t, e);
  }
  async applyWorsePosition() {
    if (this.rollPrimaryDoc)
      return this.rollPrimaryDoc.applyWorsePosition();
  }
  get hasSpecialArmor() {
    return M.IsType(this.rollPrimaryDoc) && this.rollPrimaryDoc.isSpecialArmorAvailable;
  }
  get availableArmorCount() {
    return M.IsType(this.rollPrimaryDoc) ? this.rollPrimaryDoc.availableArmor.length : k.IsType(this.rollPrimaryDoc, g.cohort_gang, g.cohort_expert) ? this.rollPrimaryDoc.system.armor.max - this.rollPrimaryDoc.system.armor.value : 0;
  }
  async spendArmor(t) {
    var e;
    if (!this.rollPrimaryDoc)
      throw new Error("[BladesRollPrimary.spendArmor()] Cannot spend armor when rollPrimaryDoc is not defined.");
    if (t > this.availableArmorCount)
      throw new Error(`[BladesRollPrimary.spendArmor()] Cannot spend more armor (${t}) than ${(e = this.rollPrimaryDoc) == null ? void 0 : e.name} has (${this.availableArmorCount}).`);
    if (M.IsType(this.rollPrimaryDoc)) {
      const a = this.rollPrimaryDoc.availableArmor.slice(0, t), r = {};
      a.includes("Light Armor") && (r["system.armor.active.light"] = !0, r["system.armor.checked.light"] = !0), a.includes("Heavy Armor") && (r["system.armor.active.heavy"] = !0, r["system.armor.checked.heavy"] = !0), await this.rollPrimaryDoc.update(r);
    } else
      k.IsType(this.rollPrimaryDoc, g.cohort_gang, g.cohort_expert) && await this.rollPrimaryDoc.update({ "system.armor.value": this.rollPrimaryDoc.system.armor.value + t });
  }
  // #endregion
}
class he {
  // #region Constructor ~
  constructor(t, {
    rollOppID: e,
    rollOppName: a,
    rollOppSubName: r,
    rollOppType: i,
    rollOppImg: o,
    rollOppModsSchemaSet: n,
    rollFactors: l
  } = {}) {
    // #endregion
    w(this, "rollInstance");
    w(this, "rollOppID");
    w(this, "rollOppDoc");
    w(this, "rollOppName");
    w(this, "rollOppSubName");
    w(this, "rollOppType");
    w(this, "rollOppImg");
    w(this, "rollOppModsSchemaSet");
    w(this, "rollFactors");
    this.rollInstance = t;
    const c = he.GetDoc(e ?? a);
    if (c && (this.rollOppDoc = c, e = c.rollOppID, a ?? (a = c.rollOppName), r ?? (r = c.rollOppSubName), i ?? (i = c.rollOppType), o ?? (o = c.rollOppImg), n = [
      ...n ?? [],
      ...c.rollOppModsSchemaSet ?? []
    ], l = {
      ...c.rollFactors,
      ...l ?? {}
    }), !a)
      throw new Error("Must include a rollOppName when constructing a BladesRollOpposition object.");
    if (!i)
      throw new Error("Must include a rollOppType when constructing a BladesRollOpposition object.");
    if (!l)
      throw new Error("Must include a rollFactors when constructing a BladesRollOpposition object.");
    this.rollOppID = e, this.rollOppName = a, this.rollOppSubName = r, this.rollOppType = i, this.rollOppImg = o ?? "", this.rollOppModsSchemaSet = n ?? [], this.rollFactors = l;
  }
  // #region Static Methods ~
  static IsValidData(t) {
    return he.IsDoc(t) ? !0 : h.isList(t) && typeof t.rollOppName == "string" && typeof t.rollOppType == "string" && typeof t.rollOppImg == "string" && (!t.rollOppSubName || typeof t.rollOppSubName == "string") && (!t.rollOppModsSchemaSet || Array.isArray(t.rollOppModsSchemaSet)) && h.isList(t.rollFactors) && (!t.rollOppID || typeof t.rollOppID == "string");
  }
  static GetDoc(t) {
    let e = t;
    return typeof t == "string" && (e = game.actors.get(t) ?? game.items.get(t) ?? game.actors.getName(t) ?? game.items.getName(t)), he.IsDoc(e) ? e : !1;
  }
  static IsDoc(t) {
    return I.IsType(
      t,
      b.npc,
      b.faction
    ) || k.IsType(
      t,
      g.cohort_expert,
      g.cohort_gang
    );
  }
  static GetDataFromDoc(t) {
    return {
      rollOppID: t.id,
      rollOppName: t.name,
      rollOppType: t.type,
      rollOppImg: t.img,
      rollOppModsSchemaSet: t.rollOppModsSchemaSet,
      rollFactors: t.rollFactors
    };
  }
  // #endregion
  get data() {
    return {
      rollOppID: this.rollOppID,
      rollOppName: this.rollOppName,
      rollOppSubName: this.rollOppSubName,
      rollOppType: this.rollOppType,
      rollOppImg: this.rollOppImg,
      rollOppModsSchemaSet: this.rollOppModsSchemaSet,
      rollFactors: this.rollFactors
    };
  }
  async updateRollFlags() {
    this.rollInstance && (await this.rollInstance.updateTarget("rollOppData", this.data), this.rollInstance.isRendered && socketlib.system.executeForEveryone("renderRollCollab_SocketCall", this.rollInstance.id));
  }
  refresh() {
    if (!this.rollInstance)
      return;
    const t = this.rollInstance.data.rollOppData;
    return t && (this.rollOppID = t.rollOppID, this.rollOppName = t.rollOppName, this.rollOppSubName = t.rollOppSubName, this.rollOppType = t.rollOppType, this.rollOppImg = t.rollOppImg, this.rollOppModsSchemaSet = t.rollOppModsSchemaSet ?? [], this.rollFactors = t.rollFactors), this;
  }
}
class ae {
  constructor(t, e, a, r) {
    // #endregion
    w(this, "rollInstance");
    w(this, "rollParticipantID");
    w(this, "rollParticipantDoc");
    w(this, "rollParticipantName");
    w(this, "rollParticipantType");
    w(this, "rollParticipantIcon");
    w(this, "rollParticipantSection");
    w(this, "rollParticipantSubSection");
    w(this, "rollParticipantModsSchemaSet");
    // As applied to MAIN roll when this participant involved
    w(this, "rollFactors");
    if (this.rollInstance = t, !e)
      throw new Error("Must include a rollParticipantSection when constructing a BladesRollParticipant object.");
    if (!a)
      throw new Error("Must include a rollParticipantSubSection when constructing a BladesRollParticipant object.");
    this.rollParticipantSection = e, this.rollParticipantSubSection = a;
    const i = ae.IsDoc(r) ? r : ae.GetDoc(
      r.rollParticipantID ?? r.rollParticipantName
    );
    if (i && (r = i), !r.rollParticipantName)
      throw new Error("Must include a rollParticipantName when constructing a BladesRollParticipant object.");
    if (!r.rollParticipantType)
      throw new Error("Must include a rollParticipantType when constructing a BladesRollParticipant object.");
    if (!r.rollFactors)
      throw new Error("Must include a rollFactors when constructing a BladesRollParticipant object.");
    this.rollParticipantID = r.rollParticipantID, this.rollParticipantName = r.rollParticipantName, this.rollParticipantType = r.rollParticipantType, this.rollParticipantIcon = r.rollParticipantIcon ?? "", this.rollParticipantModsSchemaSet = r.rollParticipantModsSchemaSet ?? [], this.rollFactors = r.rollFactors;
  }
  // #region Static Methods ~
  static IsValidData(t) {
    return ae.IsDoc(t) ? !0 : h.isList(t) && typeof t.rollParticipantName == "string" && typeof t.rollParticipantType == "string" && typeof t.rollParticipantIcon == "string" && (!t.rollParticipantModsSchemaSet || Array.isArray(t.rollParticipantModsSchemaSet)) && h.isList(t.rollFactors) && (!t.rollParticipantID || typeof t.rollParticipantID == "string") && (!t.rollParticipantDoc || ae.IsDoc(t.rollParticipantDoc));
  }
  static GetDoc(t) {
    let e = t;
    return typeof t == "string" && (e = game.actors.get(t) ?? game.items.get(t) ?? game.actors.getName(t) ?? game.items.getName(t)), ae.IsDoc(e) ? e : !1;
  }
  static IsDoc(t) {
    return I.IsType(t, b.pc, b.crew, b.npc) || k.IsType(t, g.cohort_expert, g.cohort_gang, g.gm_tracker);
  }
  // #endregion
  get data() {
    return {
      rollParticipantID: this.rollParticipantID,
      rollParticipantName: this.rollParticipantName,
      rollParticipantType: this.rollParticipantType,
      rollParticipantIcon: this.rollParticipantIcon,
      rollParticipantModsSchemaSet: this.rollParticipantModsSchemaSet,
      rollFactors: this.rollFactors
    };
  }
  async updateRollFlags() {
    await this.rollInstance.updateTarget(`rollParticipantData.${this.rollParticipantSection}.${this.rollParticipantSubSection}`, this.data), this.rollInstance.isRendered && socketlib.system.executeForEveryone("renderRollCollab_SocketCall", this.rollInstance.id);
  }
  refresh() {
    var e;
    const t = (e = this.rollInstance.data.rollParticipantData) == null ? void 0 : e[this.rollParticipantSection];
    if (t && this.rollParticipantSubSection in t) {
      const a = t[this.rollParticipantSubSection];
      a && (this.rollParticipantID = a.rollParticipantID, this.rollParticipantName = a.rollParticipantName, this.rollParticipantType = a.rollParticipantType, this.rollParticipantIcon = a.rollParticipantIcon, this.rollParticipantModsSchemaSet = a.rollParticipantModsSchemaSet ?? [], this.rollFactors = a.rollFactors);
    }
    return this;
  }
}
const se = class se extends we {
  constructor(e) {
    super(e);
    // #endregion
    // #region *** CONSTRUCTOR *** ~
    w(this, "rollPermission");
    w(this, "_rollPrimary");
    w(this, "_rollOpposition");
    w(this, "_rollParticipants");
    w(this, "projectSelectOptions");
    w(this, "_rollTraitValOverride");
    w(this, "_roll");
    w(this, "rollFactorPenaltiesNegated", {});
    w(this, "tempGMBoosts", {});
    w(this, "getModsDelta", (e) => h.sum([
      ...this.getActiveRollMods(e, "positive").map((a) => a.value),
      ...this.getActiveRollMods(e, "negative").map((a) => -a.value)
    ]));
    w(this, "_rollMods");
    // #endregion
    // #region *** EVALUATING ROLL *** ~
    // #region DICE ~
    w(this, "_dieVals");
    // #endregion
    // #region *** ROLL COLLAB HTML ELEMENT ***
    w(this, "_elem$");
    w(this, "_overlayPosition", { x: 200, y: 200 });
    // Async _gmControlSelect(event: SelectChangeEvent) {
    //   event.preventDefault();
    //   const elem$ = $(event.currentTarget);
    //   const section = elem$.data("rollSection");
    //   const subSection = elem$.data("rollSubSection");
    //   const selectedOption = elem$.val();
    //   if (typeof selectedOption !== "string") { return; }
    //   if (selectedOption === "false") {
    //     await this.document.unsetFlag(C.SYSTEM_ID, `rollCollab.rollParticipantData.${section}.${subSection}`);
    //   }
    //   await this.addRollParticipant(selectedOption, section, subSection);
    // }
    // #endregion
    // #region ACTIVATE LISTENERS ~
    w(this, "_positionDragger");
    if (this.rollPermission = this.data.userPermissions[game.user.id], this._rollPrimary = new R(this, this.data.rollPrimaryData), this.data.rollOppData ? this._rollOpposition = new he(this, this.data.rollOppData) : this.data.rollDowntimeAction === P.LongTermProject && (this.projectSelectOptions = Array.from(game.items).filter((a) => k.IsType(a, g.project)).map((a) => ({ value: a.id ?? "", display: a.name }))), this.data.rollParticipantData) {
      this._rollParticipants = {};
      for (const [a, r] of Object.entries(this.data.rollParticipantData))
        if ([C.roll, C.position, C.effect].includes(a) && !h.isEmpty(r)) {
          const i = {};
          for (const [o, n] of Object.entries(r))
            i[o] = new ae(
              this,
              a,
              o,
              n
            );
          this._rollParticipants[a] = i;
        }
    }
    game.eunoblades.Rolls.set(this.id, this);
  }
  // #region STATIC METHODS: INITIALIZATION & DEFAULTS ~
  static Initialize() {
    return loadTemplates([
      "systems/eunos-blades/templates/roll/partials/roll-collab-gm-number-line.hbs",
      "systems/eunos-blades/templates/roll/partials/roll-collab-gm-select-doc.hbs",
      "systems/eunos-blades/templates/roll/partials/roll-collab-gm-factor-control.hbs",
      "systems/eunos-blades/templates/roll/roll-collab-action.hbs",
      "systems/eunos-blades/templates/roll/roll-collab-action-gm.hbs",
      "systems/eunos-blades/templates/roll/roll-collab-resistance.hbs",
      "systems/eunos-blades/templates/roll/roll-collab-resistance-gm.hbs",
      "systems/eunos-blades/templates/roll/roll-collab-fortune.hbs",
      "systems/eunos-blades/templates/roll/roll-collab-fortune-gm.hbs",
      "systems/eunos-blades/templates/roll/roll-collab-indulgevice.hbs",
      "systems/eunos-blades/templates/roll/roll-collab-indulgevice-gm.hbs"
    ]);
  }
  static InitSockets() {
    socketlib.system.register("constructRollCollab_SocketCall", se.constructRollCollab_SocketResponse.bind(se)), socketlib.system.register("renderRollCollab_SocketCall", se.renderRollCollab_SocketResponse.bind(se)), socketlib.system.register("closeRollCollab_SocketCall", se.closeRollCollab_SocketResponse.bind(se));
  }
  static ParseConfigToData(e, a) {
    if (!game.eunoblades.Rolls.get(a.id))
      throw new Error(`[BladesRoll.ParseConfigToData] No BladesRoll instance found with id ${a.id}.`);
    return e.rollPrimaryData instanceof R && (e.rollPrimaryData = e.rollPrimaryData.data), e.rollOppData instanceof he && (e.rollOppData = e.rollOppData.data), e.rollParticipantData && (e.rollParticipantData[C.roll] && Object.keys(e.rollParticipantData[C.roll]).forEach((i) => {
      var n, l;
      const o = (l = (n = e.rollParticipantData) == null ? void 0 : n[C.roll]) == null ? void 0 : l[i];
      o instanceof ae && (e.rollParticipantData[C.roll][i] = o.data);
    }), e.rollParticipantData[C.position] && Object.keys(e.rollParticipantData[C.position]).forEach((i) => {
      var n, l;
      const o = (l = (n = e.rollParticipantData) == null ? void 0 : n[C.position]) == null ? void 0 : l[i];
      o instanceof ae && (e.rollParticipantData[C.position][i] = o.data);
    }), e.rollParticipantData[C.effect] && Object.keys(e.rollParticipantData[C.effect]).forEach((i) => {
      var n, l;
      const o = (l = (n = e.rollParticipantData) == null ? void 0 : n[C.effect]) == null ? void 0 : l[i];
      o instanceof ae && (e.rollParticipantData[C.effect][i] = o.data);
    })), super.ParseConfigToData(e);
  }
  static ApplySchemaDefaults(e) {
    if (!e.rollType)
      throw new Error("Must include a rollType when constructing a BladesRoll object.");
    return e.rollPhase ?? (e.rollPhase = Me.Collaboration), e.GMBoosts = {
      [m.tier]: 0,
      [m.quality]: 0,
      [m.scale]: 0,
      [m.magnitude]: 0,
      ...e.GMBoosts ?? {}
    }, e.GMOppBoosts = {
      [m.tier]: 0,
      [m.quality]: 0,
      [m.scale]: 0,
      [m.magnitude]: 0,
      ...e.GMOppBoosts ?? {}
    }, e.GMOverrides ?? (e.GMOverrides = {}), e.userPermissions ?? (e.userPermissions = {}), e.rollPrimaryData instanceof R && (e.rollPrimaryData = e.rollPrimaryData.data), e.rollOppData instanceof he && (e.rollOppData = e.rollOppData.data), e;
  }
  // static override get defaultOptions() {
  //   return foundry.utils.mergeObject(super.defaultOptions, {
  //     classes: ["eunos-blades", "sheet", "roll-collab", game.user.isGM ? "gm-roll-collab" : ""],
  //     template: `systems/eunos-blades/templates/roll/roll-collab${game.user.isGM ? "-gm" : ""}.hbs`,
  //     submitOnChange: true,
  //     width: 500,
  //     dragDrop: [
  //       {dragSelector: null, dropSelector: "[data-action='gm-drop-opposition'"}
  //     ]
  //     // Height: 500
  //   });
  // }
  static get DefaultRollModSchemaSet() {
    return [];
  }
  static GetDieClass(e, a, r, i) {
    switch (e) {
      case _.Resistance:
        return r === 6 && i <= 1 && a === -1 ? "blades-die-critical" : i === 0 ? "blades-die-resistance" : "blades-die-fail";
      case _.IndulgeVice:
        return i === 0 ? "blades-die-indulge-vice" : "blades-die-fail";
    }
    return r === 6 && i <= 1 && a === G.critical && r++, [
      "",
      "blades-die-fail",
      "blades-die-fail",
      "blades-die-fail",
      "blades-die-partial",
      "blades-die-partial",
      "blades-die-success",
      "blades-die-critical"
    ][r];
  }
  static GetDieImage(e, a, r, i, o = !1, n = !1) {
    let l = "systems/eunos-blades/assets/dice/image/";
    return o ? l += "ghost-" : [_.Resistance, _.IndulgeVice].includes(e) && (l += "grad-"), l += r, !o && r === 6 && i <= 1 && n && (l += "-crit"), l += ".webp", l;
  }
  static get Active() {
    return h.getLast(game.eunoblades.Rolls.filter((e) => e.isActive));
  }
  // #endregion
  // #region STATIC METHODS: New Roll Creation ~
  // static Current: Record<string, BladesRoll> = {};
  // static _Active?: BladesRoll;
  // static get Active(): BladesRoll | undefined {
  //   if (BladesRoll._Active) {return BladesRoll._Active;}
  //   if (U.objSize(BladesRoll.Current) > 0) {return U.getLast(Object.values(BladesRoll.Current));}
  //   return undefined;
  // }
  // static set Active(val: BladesRoll | undefined) {
  //   BladesRoll._Active = val;
  // }
  static GetUserPermissions(e) {
    var d, p, u, f;
    if (!e.rollPrimaryData)
      throw new Error("[BladesRoll.GetUserPermissions()] Missing rollPrimaryData.");
    const a = (d = game.users.find((y) => y.isGM)) == null ? void 0 : d.id;
    if (!a)
      throw new Error("[BladesRoll.GetUserPermissions()] No GM found!");
    const r = game.users.filter((y) => M.IsType(y.character) && !y.isGM && typeof y.id == "string").map((y) => y.id), i = {
      [Q.GM]: [a],
      [Q.Primary]: [],
      [Q.Participant]: [],
      [Q.Observer]: []
    }, { rollPrimaryDoc: o } = new R(e.rollPrimaryData);
    M.IsType(o) && h.pullElement(r, (p = o.primaryUser) == null ? void 0 : p.id) ? i[Q.Primary].push((u = o.primaryUser) == null ? void 0 : u.id) : de.IsType(o) ? i[Q.Primary].push(...r) : k.IsType(o, g.cohort_gang, g.cohort_expert) ? e.rollUserID === a ? i[Q.Primary].push(...r) : M.IsType(o.parent) && ((f = o.parent.primaryUser) != null && f.id) && i[Q.Primary].push(o.parent.primaryUser.id) : Je.IsType(o) && i[Q.Primary].push(a), e.rollParticipantData && i[Q.Participant].push(...c(e.rollParticipantData, r)), i[Q.Observer] = r.filter((y) => !i[Q.Participant].includes(y));
    const n = {};
    return Object.entries(i).forEach(([y, S]) => {
      for (const D of S)
        n[D] = y;
    }), n;
    function l(y) {
      return Object.values(flattenObject(y)).map((S) => {
        if (ae.IsDoc(S))
          return S;
        if (ae.IsValidData(S) && typeof S.rollParticipantID == "string") {
          const D = game.actors.get(S.rollParticipantID) ?? game.items.get(S.rollParticipantID);
          if (ae.IsDoc(D))
            return D;
        }
        throw new Error(`[getParticipantDocs] Invalid participant data encountered. Data: ${JSON.stringify(S)}, Expected: "BladesRollParticipant or valid participant data", Function Context: "getParticipantDocs", Participant Data: ${JSON.stringify(y)}`);
      });
    }
    function c(y, S) {
      return l(y).map((D) => {
        var O;
        return M.IsType(D) && typeof ((O = D.primaryUser) == null ? void 0 : O.id) == "string" ? D.primaryUser.id : de.IsType(D) || k.IsType(D, g.cohort_gang, g.cohort_expert) ? S : null;
      }).flat().filter((D) => D !== null && !i[Q.Primary].includes(D));
    }
  }
  static BuildLinkConfig(e) {
    const a = {};
    if ("targetKey" in e && e.targetKey ? a.targetKey = e.targetKey : "targetFlagKey" in e && e.targetFlagKey && (a.targetFlagKey = e.targetFlagKey), "target" in e)
      if (h.isDocUUID(e.target))
        a.targetID = e.target;
      else if (h.isDocID(e.target)) {
        const r = game.actors.get(e.target) ?? game.items.get(e.target) ?? game.messages.get(e.target) ?? game.users.get(e.target);
        if (r)
          a.targetID = r.uuid;
        else
          throw new Error(`[BladesRoll.BuildLinkConfig] No target found with id ${e.target}.`);
      } else
        a.targetID = e.target.uuid;
    else if ("targetID" in e)
      a.targetID = e.targetID;
    else
      throw new Error("[BladesRoll.BuildLinkConfig] You must provide a valid target or targetID in the config object.");
    if (!a.targetKey && !a.targetFlagKey && (a.targetFlagKey = "rollCollab"), we.IsValidConfig(a))
      return we.BuildLinkConfig(a);
    throw new Error("[BladesRoll.BuildLinkConfig] Invalid link config.");
  }
  /**
   * Asynchronously creates a new instance of `BladesRoll` or its subclasses.
   *
   * This generic static method is designed to facilitate the creation of roll instances with
   * configurations specific to the type of roll being created. It ensures that the correct type
   * of roll instance is returned based on the class it's called on, allowing for a flexible and
   * type-safe creation process that can be extended to subclasses of `BladesRoll`.
   *
   * @template C The class on which `New` is called. This class must extend `BladesRoll` and
   * must be constructible with a configuration object that is either a `BladesRoll.Config` or
   * a combination of `BladesTargetLink.Data` and a partial `BladesRoll.Schema`. This ensures
   * that any subclass of `BladesRoll` can use this method to create instances of itself while
   * applying any class-specific configurations or behaviors.
   *
   * @param {BladesRoll.Config} config The configuration object for creating a new roll instance.
   * This configuration includes all necessary data to initialize the roll, such as user permissions,
   * roll type, and any modifications or additional data required for the roll's operation.
   *
   * @returns {Promise<InstanceType<C>>} A promise that resolves to an instance of the class
   * from which `New` was called. This allows for the dynamic creation of roll instances based
   * on the subclass calling the method, ensuring that the returned instance is of the correct type.
   *
   * @example
   * // Assuming `MyCustomRoll` is a subclass of `BladesRoll`
   * MyCustomRoll.New(myConfig).then(instance => {
   *   // `instance` is of type `MyCustomRoll`
   * });
   *
   * @remarks
   * - The method performs several key operations as part of the roll instance creation process:
   *   1. Builds link configuration based on the provided config.
   *   2. Prepares roll user flag data to determine permissions for different users.
   *   3. Validates that a roll type is defined in the config, throwing an error if not.
   *   4. Logs the roll data for debugging or auditing purposes.
   *   5. Constructs and initializes the roll instance, including setting up roll modifications
   *      and sending out socket calls to inform all users about the roll.
   * - This method is central to the dynamic and flexible creation of roll instances within the
   *   system, allowing for easy extension and customization in subclasses of `BladesRoll`.
   */
  static async New(e) {
    const a = this.BuildLinkConfig(e);
    if (e.userPermissions = this.GetUserPermissions(e), !e.rollType)
      throw new Error("rollType must be defined in config");
    eLog.checkLog3("bladesRoll", "BladesRoll.NewRoll()", { config: e });
    const r = await this.Create({ ...e, ...a });
    return r.isInitPromiseResolved ? eLog.checkLog3("bladesRoll", "BladesRoll Init Promise Resolved After Awaiting Create") : (eLog.checkLog3("bladesRoll", "BladesRoll Init Promise NOT Resolved After Awaiting Create"), await h.waitFor(r.initPromise)), r.constructRollCollab_SocketCall(r.linkData), r;
  }
  async initTargetLink() {
    this.initialSchema.rollModsData = this.rollModsDataSet, super.initTargetLink();
  }
  get rollModsSchemaSets() {
    var a;
    const e = [];
    return this.rollPrimary && e.push(
      ...this.rollPrimary.rollPrimaryModsSchemaSet.filter((r) => e.every((i) => i.key !== r.key))
    ), (a = this.rollOpposition) != null && a.rollOppModsSchemaSet && e.push(
      ...this.rollOpposition.rollOppModsSchemaSet.filter((r) => e.every((i) => i.key !== r.key))
    ), e.push(...this.constructor.DefaultRollModSchemaSet.filter((r) => e.every((i) => i.key !== r.key))), this.rollDowntimeAction && (e.push({
      key: "HelpFromFriend-positive-roll",
      name: "Help From a Friend",
      section: C.position,
      base_status: T.ToggledOff,
      posNeg: "positive",
      modType: F.general,
      value: 1,
      effectKeys: [],
      tooltip: "<h1>Help From a Friend</h1><p>Add <strong>+1d</strong> if you enlist the help of a friend or contact.</p>"
    }), this.rollDowntimeAction !== P.IndulgeVice && e.push({
      key: "CanBuyResultLevel-positive-after",
      name: "Buying Result Level",
      section: C.after,
      base_status: T.ForcedOn,
      posNeg: "positive",
      modType: F.general,
      value: 0,
      effectKeys: [],
      tooltip: '<h1>Buying Result Level</h1><p>After your roll, you can <strong>increase the result level</strong> by one for each <strong class="gold-bright">Coin</strong> you spend.</p>'
    }), this.rollDowntimeAction === P.AcquireAsset && e.push(
      {
        key: "RepeatPurchase-positive-roll",
        name: "Repeat Purchase",
        section: C.roll,
        base_status: T.ToggledOff,
        posNeg: "positive",
        modType: F.general,
        value: 1,
        effectKeys: [],
        tooltip: "<h1>Repeat Purchase Bonus</h1><p>Add <strong>+1d</strong> if you have previously acquired this asset or service with a <strong>Acquire Asset</strong> Downtime activity.</p>"
      },
      {
        key: "RestrictedItem-negative-after",
        name: "Restricted",
        section: C.after,
        base_status: T.Hidden,
        posNeg: "negative",
        modType: F.general,
        value: 0,
        effectKeys: ["Cost-Heat2"],
        tooltip: '<h1>Restricted</h1><p>Whether contraband goods or dangerous materials, this <strong>Acquire Asset</strong> Downtime activity will add <strong class="red-bright">+2 Heat</strong> to your crew.</p>'
      }
    )), e;
  }
  get rollModsDataSet() {
    const { linkData: e } = this, a = {
      targetID: e.targetID,
      isScopingById: !0,
      ..."targetKey" in e ? { targetKey: `${this.targetKeyPrefix}.rollModsData` } : {},
      ..."targetFlagKey" in e ? { targetFlagKey: `${this.targetFlagKeyPrefix}.rollModsData` } : {}
    };
    return Object.fromEntries(
      this.rollModsSchemaSets.map((r) => {
        const i = we.ParseConfigToData(
          {
            ..._e.ApplySchemaDefaults(r),
            ...a
          }
        );
        return [i.id, i];
      })
    );
  }
  // #endregion
  // #region SOCKET CALLS & RESPONSES ~
  static GetRollSubClass(e) {
    const a = new we(e);
    switch (a.data.rollType) {
      case _.Action:
        return Ge;
      case _.Fortune:
        return a.data.rollSubType === at.Engagement ? Ra : a.data.rollSubType === at.Incarceration ? Fa : bt;
      case _.Resistance:
        return a.data.isInlineResistanceRoll ? $a : ks;
      case _.IndulgeVice:
        return Ts;
    }
  }
  constructRollCollab_SocketCall(e) {
    socketlib.system.executeForEveryone("constructRollCollab_SocketCall", e);
  }
  static constructRollCollab_SocketResponse(e) {
    const a = new (this.GetRollSubClass(e))(e);
    eLog.checkLog3("rollCollab", "constructRollCollab_SocketResponse()", { params: { linkData: e }, rollInst: a }), this.renderRollCollab_SocketResponse(a.id);
  }
  renderRollCollab_SocketCall() {
    socketlib.system.executeForEveryone("renderRollCollab_SocketCall", this.id);
  }
  static renderRollCollab_SocketResponse(e) {
    const a = game.eunoblades.Rolls.get(e);
    if (!a)
      throw new Error(`[BladesRoll.renderRollCollab_SocketResponse] No roll found with id ${e}.`);
    a.renderRollCollab();
  }
  closeRollCollab_Animation() {
    return h.gsap.effects.blurRemove(this.elem$, { ignoreMargins: !0 });
  }
  async closeRollCollab_SocketCall() {
    game.user.isGM && (socketlib.system.executeForOthers("closeRollCollab_SocketCall", this.id), await h.waitFor(this.closeRollCollab_Animation()));
  }
  static closeRollCollab_SocketResponse(e) {
    var a;
    (a = game.eunoblades.Rolls.get(e)) == null || a.closeRollCollab_Animation();
  }
  // #endregion
  // #region Roll Participation & User Permissions
  async addRollParticipant(e, a, r) {
    r || (r = "Assist");
    const i = typeof e == "string" ? game.actors.get(e) ?? game.actors.getName(e) ?? game.items.get(e) ?? game.items.getName(e) : e;
    if (!ae.IsValidData(i))
      throw new Error("Bad data.");
    await new ae(this, a, r, i).updateRollFlags(), this.isRendered && socketlib.system.executeForEveryone("renderRollCollab_SocketCall", this.id);
  }
  async removeRollParticipant(e, a) {
    await this.updateTarget(`rollParticipantData.${e}.${a}`, null);
  }
  async updateUserPermission(e, a) {
  }
  // #endregion
  // #region Basic User Flag Getters/Setters ~
  // get data(): BladesRoll.FlagData {
  //   if (!this.document.getFlag(C.SYSTEM_ID, "rollCollab")) {
  //     throw new Error("[get flags()] No RollCollab Flags Found on User Document");
  //   }
  //   return this.document.getFlag(C.SYSTEM_ID, "rollCollab") as BladesRoll.FlagData;
  // }
  get rollPrimary() {
    return this._rollPrimary;
  }
  get rollPrimaryDoc() {
    return this.rollPrimary.rollPrimaryDoc;
  }
  get rollOpposition() {
    var e;
    return !this._rollOpposition && he.IsValidData(this.data.rollOppData) && (this._rollOpposition = new he(this, this.data.rollOppData)), (e = this._rollOpposition) == null ? void 0 : e.refresh();
  }
  set rollOpposition(e) {
    e === void 0 ? this._rollOpposition = void 0 : (this._rollOpposition = e, e.updateRollFlags());
  }
  get rollClockKey() {
    return this.data.rollClockKey ? game.eunoblades.ClockKeys.get(this.data.rollClockKey) : void 0;
  }
  set rollClockKey(e) {
    this.updateTarget("rollClockKeyID", e ?? null);
  }
  /**
   * This method prepares the roll participant data.
   * It iterates over the roll sections (roll, position, effect) and for each section,
   * it creates a new BladesRollParticipant instance for each participant in that section.
   * The created instances are stored in the rollParticipants object.
   */
  prepareRollParticipantData() {
    const e = this.data.rollParticipantData;
    if (!e)
      return;
    const a = {};
    [
      C.roll,
      C.position,
      C.effect
    ].forEach((r) => {
      const i = e[r];
      if (i) {
        const o = {};
        Object.entries(i).forEach(([n, l]) => {
          l && (o[n] = new ae(this, r, n, l));
        }), a[r] = o;
      }
    }), this._rollParticipants = a;
  }
  get rollParticipants() {
    return this._rollParticipants;
  }
  getRollParticipant(e, a) {
    var r;
    if (Ji(e) && Qi(a)) {
      const i = (r = this.rollParticipants) == null ? void 0 : r[e];
      if (i)
        return i[a] ?? null;
    }
    return null;
  }
  get rollParticipantSelectOptions() {
    const e = M.All.filter((a) => a.hasTag(A.PC.ActivePC) && a.id !== this.rollPrimary.rollPrimaryID).map((a) => ({ value: a.id, display: a.name }));
    return {
      Assist: e,
      Setup: e,
      Group: e
    };
  }
  get rollType() {
    return this.data.rollType;
  }
  get rollSubType() {
    return this.data.rollSubType;
  }
  set rollSubType(e) {
    this.updateTarget("rollSubType", e ?? null);
  }
  get rollPhase() {
    return this.data.rollPhase ?? Me.Collaboration;
  }
  get rollDowntimeAction() {
    return this.data.rollDowntimeAction;
  }
  get rollTrait() {
    return this.data.rollTrait;
  }
  get rollTraitVerb() {
    if (this.rollTrait && this.rollTrait in v.ActionVerbs)
      return v.ActionVerbs[this.rollTrait];
  }
  get rollTraitPastVerb() {
    if (this.rollTrait && this.rollTrait in v.ActionPastVerbs)
      return v.ActionPastVerbs[this.rollTrait];
  }
  get rollTraitValOverride() {
    return this._rollTraitValOverride;
  }
  set rollTraitValOverride(e) {
    this._rollTraitValOverride = e;
  }
  get rollTraitData() {
    var e, a;
    if (I.IsType(this.rollPrimaryDoc, b.pc)) {
      if (Fs(this.rollTrait))
        return {
          name: this.rollTrait,
          value: this.rollTraitValOverride ?? this.rollPrimaryDoc.actions[this.rollTrait],
          max: this.rollTraitValOverride ?? this.rollPrimaryDoc.actions[this.rollTrait],
          pcTooltip: this.rollPrimaryDoc.rollTraitPCTooltipActions,
          gmTooltip: v.ActionTooltipsGM[this.rollTrait]
        };
      if (Ns(this.rollTrait))
        return {
          name: this.rollTrait,
          value: this.rollTraitValOverride ?? this.rollPrimaryDoc.attributes[this.rollTrait],
          max: this.rollTraitValOverride ?? this.rollPrimaryDoc.attributes[this.rollTrait],
          pcTooltip: this.rollPrimaryDoc.rollTraitPCTooltipAttributes,
          gmTooltip: v.AttributeTooltips[this.rollTrait]
        };
    }
    if (h.isInt(this.rollTrait))
      return {
        name: `+${this.rollTraitValOverride ?? this.rollTrait}`,
        value: this.rollTraitValOverride ?? this.rollTrait,
        max: this.rollTraitValOverride ?? this.rollTrait
      };
    if (Hs(this.rollTrait))
      return {
        name: h.tCase(this.rollTrait),
        value: this.rollTraitValOverride ?? ((e = this.rollPrimary.rollFactors[this.rollTrait]) == null ? void 0 : e.value) ?? 0,
        max: this.rollTraitValOverride ?? ((a = this.rollPrimary.rollFactors[this.rollTrait]) == null ? void 0 : a.max) ?? 10
      };
    throw new Error(`[get rollTraitData] Invalid rollTrait: '${this.rollTrait}'`);
  }
  get rollTraitOptions() {
    if (I.IsType(this.rollPrimaryDoc, b.pc)) {
      if (Fs(this.rollTrait))
        return Object.values(Ae).map((e) => ({
          name: h.uCase(e),
          value: e
        }));
      if (Ns(this.rollTrait))
        return Object.values(re).map((e) => ({
          name: h.uCase(e),
          value: e
        }));
    }
    if (h.isInt(this.rollTrait))
      return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((e) => ({
        name: `+${e}`,
        value: e
      }));
    if (Hs(this.rollTrait))
      return [];
    throw new Error(`[get rollTraitOptions] Invalid rollTrait: '${this.rollTrait}'`);
  }
  get posEffectTrade() {
    var e;
    return ((e = this.data) == null ? void 0 : e.rollPosEffectTrade) ?? !1;
  }
  // getFlagVal<T>(flagKey?: string): T | undefined {
  //   if (flagKey) {
  //     return this.document.getFlag(C.SYSTEM_ID, `rollCollab.${flagKey}`.replace(/(rollCollab\.)+/g, "rollCollab.")) as T | undefined;
  //   }
  //   return this.document.getFlag(C.SYSTEM_ID, "rollCollab") as T | undefined;
  // }
  // async setFlagVal(flagKey: string, flagVal: unknown, isRerendering = true) {
  //   await this.document.setFlag(C.SYSTEM_ID, `rollCollab.${flagKey}`.replace(/(rollCollab\.)+/g, "rollCollab."), flagVal);
  //   if (isRerendering) {
  //     socketlib.system.executeForEveryone("renderRollCollab_SocketCall", this.id);
  //   }
  // }
  // async clearFlagVal(flagKey: string, isRerendering = true) {
  //   await this.document.unsetFlag(C.SYSTEM_ID, `rollCollab.${flagKey}`.replace(/(rollCollab\.)+/g, "rollCollab."));
  //   if (isRerendering) {
  //     socketlib.system.executeForEveryone("renderRollCollab_SocketCall", this.id);
  //   }
  // }
  get initialPosition() {
    return this.data.rollPositionInitial ?? ie.risky;
  }
  set initialPosition(e) {
    this.updateTarget("rollPositionInitial", e ?? ie.risky);
  }
  get initialEffect() {
    return this.data.rollEffectInitial ?? ee.standard;
  }
  set initialEffect(e) {
    this.updateTarget("rollEffectInitial", e ?? ee.standard);
  }
  get isApplyingConsequences() {
    return !(this.rollType !== _.Action || !this.rollResult || ![G.partial, G.fail].includes(this.rollResult));
  }
  // Get rollConsequence() --> For resistance rolls.
  get rollConsequence() {
    const { consequence: e } = this.data.resistanceData ?? {};
    if (e != null && e.id)
      return game.eunoblades.Consequences.get(e.id) ?? new Se(e);
  }
  // #endregion
  // #region GETTERS: DERIVED DATA ~
  get rollPositionFinal() {
    return Object.values(ie)[h.clampNum(
      Object.values(ie).indexOf(this.initialPosition) + this.getModsDelta(C.position) + (this.posEffectTrade === "position" ? 1 : 0) + (this.posEffectTrade === "effect" ? -1 : 0),
      [0, 2]
    )];
  }
  get rollEffectFinal() {
    return Object.values(ee)[h.clampNum(
      Object.values(ee).indexOf(this.initialEffect) + this.getModsDelta(C.effect) + (this.posEffectTrade === "effect" ? 1 : 0) + (this.posEffectTrade === "position" ? -1 : 0),
      [0, 4]
    )];
  }
  get rollResultDelta() {
    var e;
    return this.getModsDelta(C.result) + (((e = this.data) == null ? void 0 : e.GMBoosts.Result) ?? 0) + (this.tempGMBoosts.Result ?? 0);
  }
  get rollResultFinal() {
    if (this.rollResult === !1)
      return !1;
    if (this.rollResultDelta === 0)
      return this.rollResult;
    switch (this.rollType) {
      case _.Action:
      case _.Fortune:
        return Object.values(G).toReversed()[h.clampNum(
          Object.values(G).toReversed().indexOf(this.rollResult) + this.rollResultDelta,
          [0, 3]
        )];
      case _.Resistance:
        return this.isCritical ? -1 : h.clampNum(6 - this.highestDieVal - this.rollResultDelta, [-1, 1 / 0]);
      case _.IndulgeVice:
        return h.clampNum(this.highestDieVal + this.rollResultDelta, [0, 1 / 0]);
    }
    return !1;
  }
  get finalDicePool() {
    return Math.max(0, this.rollTraitData.value + this.getModsDelta(C.roll) + (this.data.GMBoosts.Dice ?? 0) + (this.tempGMBoosts.Dice ?? 0));
  }
  get isRollingZero() {
    return Math.max(0, this.rollTraitData.value + this.getModsDelta(C.roll) + (this.data.GMBoosts.Dice ?? 0) + (this.tempGMBoosts.Dice ?? 0)) <= 0;
  }
  get roll() {
    return this._roll ?? (this._roll = new Roll(`${this.isRollingZero ? 2 : this.finalDicePool}d6`, {})), this._roll;
  }
  get rollFactors() {
    const e = {
      [m.tier]: {
        name: "Tier",
        value: 0,
        max: 0,
        baseVal: 0,
        display: "?",
        isActive: !1,
        isPrimary: !0,
        isDominant: !1,
        highFavorsPC: !0,
        cssClasses: "factor-gold"
      },
      [m.quality]: {
        name: "Quality",
        value: 0,
        max: 0,
        baseVal: 0,
        display: "?",
        isActive: !1,
        isPrimary: !1,
        isDominant: !1,
        highFavorsPC: !0,
        cssClasses: "factor-gold"
      },
      [m.scale]: {
        name: "Scale",
        value: 0,
        max: 0,
        baseVal: 0,
        display: "?",
        isActive: !1,
        isPrimary: !1,
        isDominant: !1,
        highFavorsPC: !0,
        cssClasses: "factor-gold"
      },
      [m.magnitude]: {
        name: "Magnitude",
        value: 0,
        max: 0,
        baseVal: 0,
        display: "?",
        isActive: !1,
        isPrimary: !1,
        isDominant: !1,
        highFavorsPC: !0,
        cssClasses: "factor-gold"
      }
    }, a = h.objMerge(
      h.objMerge(
        e,
        this.rollPrimary.rollFactors,
        { isMutatingOk: !1 }
      ),
      this.data.rollFactorToggles.source,
      { isMutatingOk: !1 }
    ), r = this.rollOpposition ? h.objMerge(
      h.objMerge(
        e,
        this.rollOpposition.rollFactors,
        { isMutatingOk: !1 }
      ),
      this.data.rollFactorToggles.opposition,
      { isMutatingOk: !1 }
    ) : {};
    return {
      source: Object.fromEntries(
        Object.entries(a).map(([i, o]) => (o.value += (this.data.GMBoosts[i] ?? 0) + (this.tempGMBoosts[i] ?? 0), i === m.tier ? o.display = h.romanizeNum(o.value) : o.display = `${o.value}`, [i, o]))
      ),
      opposition: Object.fromEntries(
        Object.entries(r).map(([i, o]) => (o.value += this.data.GMOppBoosts[i] ?? 0, i === m.tier ? o.display = h.romanizeNum(o.value) : o.display = `${o.value}`, [i, o]))
      )
    };
  }
  // #endregion
  // #region ROLL MODS: Getters & Update Method ~
  initRollMods() {
    this.rollTraitValOverride = void 0, this.rollFactorPenaltiesNegated = {}, this.tempGMBoosts = {};
    const e = {};
    let a = 0;
    const r = (c) => {
      if (se.Debug.modWatch === !1)
        return;
      const d = `(${a}) == ${c}`, p = this.rollMods.find((u) => se.Debug.modWatch && se.Debug.modWatch.exec(u.name));
      p ? e[`${d} : ${p.status}`] = {
        inst: p,
        data: { ...p.data },
        sourceName: p.sourceName,
        status: {
          ALL: p.status,
          base: p.baseStatus,
          held: p.heldStatus,
          user: p.userStatus
        },
        is: {
          active: p.isActive,
          visible: p.isVisible,
          conditional: p.isConditional,
          inInactiveBlock: p.isInInactiveBlock,
          isPush: p.isPush,
          isBasicPush: p.isBasicPush
        }
      } : e[d] = "MOD NOT FOUND", a++;
    };
    r("INITIAL"), this._rollMods = this.rollMods.filter((c) => c.isValidForRollType()), r("ROLLTYPE VALIDATION");
    const i = this.rollMods.filter((c) => !c.setConditionalStatus());
    r("DISABLE - CONDITIONAL");
    const o = i.filter((c) => !c.setAutoStatus());
    r("DISABLE - AUTO-REVEAL/ENABLE"), o.forEach((c) => {
      c.setPayableStatus();
    }), r("DISABLE - PAYABLE");
    const n = (c) => {
      var p, u;
      const d = c.effectKeys.filter((f) => f.startsWith("ForceOn"));
      if (d.length !== 0)
        for (; d.length; ) {
          const f = (u = (p = d.pop()) == null ? void 0 : p.split(/-/)) == null ? void 0 : u.pop();
          if (f === "BestAction")
            M.IsType(this.rollPrimaryDoc) && (this.rollTraitValOverride = Math.max(...Object.values(this.rollPrimaryDoc.actions)));
          else {
            const [y, S, D] = (f == null ? void 0 : f.split(/,/)) ?? [];
            if (!y)
              throw new Error(`No targetName found in thisTarget: ${f}.`);
            let O = this.getRollModByName(y) ?? this.getRollModByName(y, S ?? c.section);
            if (!O && y === "Push" && ([O] = [
              ...this.getActiveBasicPushMods(S ?? c.section, "negative").filter((q) => q.status === T.ToggledOn),
              ...this.getActiveBasicPushMods(S ?? c.section, "positive").filter((q) => q.status === T.ToggledOn),
              ...this.getInactiveBasicPushMods(S ?? c.section, "positive").filter((q) => q.status === T.ToggledOff)
            ]), O ?? (O = this.getRollModByName(y, S ?? c.section, D ?? c.posNeg)), !O)
              throw new Error(`No mod found matching ${y}/${S}/${D}`);
            O.isActive ? O.heldStatus = T.ForcedOn : (O.heldStatus = T.ForcedOn, n(O));
          }
        }
    };
    this.getActiveRollMods().forEach((c) => n(c)), r("FORCE-ON PASS"), this.isForcePushed() && (this.getInactivePushMods().filter((c) => !c.isBasicPush).forEach((c) => {
      c.heldStatus = T.ForcedOff;
    }), r("PUSH-CHECK: FORCE-OFF IS-PUSH")), [C.roll, C.effect].forEach((c) => {
      if (this.isPushed(c)) {
        if (c === C.roll && this.isPushed(c, "positive")) {
          const d = this.getRollModByKey("Bargain-positive-roll");
          d != null && d.isVisible && (d.heldStatus = T.ForcedOff);
        }
        r("PUSH-CHECK: FORCE OFF BARGAIN");
      } else
        this.getInactivePushMods(c).filter((d) => !d.isBasicPush).forEach((d) => {
          d.heldStatus = T.Hidden;
        }), r("PUSH-CHECK: HIDE IS-PUSH");
    }), this.getVisibleRollMods().forEach((c) => {
      c.setRelevancyStatus();
    }), r("RELEVANCY PASS"), this.getActiveRollMods().find((c) => c.effectKeys.includes("Cost-SpecialArmor")) && (this.getVisibleRollMods().filter((c) => !c.isActive && c.effectKeys.includes("Cost-SpecialArmor")).forEach((c) => {
      c.heldStatus = T.ForcedOff;
    }), r("OVERPAYMENT PASS")), eLog.checkLog2("rollMods", "*** initRollMods() PASS ***", e);
  }
  isTraitRelevant(e) {
    var a;
    if (e in m) {
      const { source: r, opposition: i } = this.rollFactors;
      return !!(e in r && e in i && ((a = r[e]) != null && a.isActive));
    }
    return !1;
  }
  get isParticipantRoll() {
    return this.rollType === _.Fortune && !game.user.isGM || this.rollSubType === at.GroupParticipant;
  }
  negatePushCost() {
    const e = this.getActiveRollMods().find((a) => a.isPush && a.stressCost > 0);
    e && h.pullElement(e.effectKeys, (a) => a.startsWith("Cost-Stress"));
  }
  negateFactorPenalty(e) {
    this.rollFactorPenaltiesNegated[e] = !0;
  }
  isPushed(e, a) {
    return this.getActiveBasicPushMods(e, a).length > 0;
  }
  hasOpenPush(e, a) {
    return this.isPushed(e) && this.getOpenPushMods(e, a).length > 0;
  }
  isForcePushed(e, a) {
    return this.isPushed(e) && this.getForcedPushMods(e, a).length > 0;
  }
  get rollCosts() {
    if (!this.isPushed)
      return 0;
    const e = this.getRollModByKey("Push-negative-roll"), a = this.getRollModByKey("Push-positive-roll"), r = this.getRollModByKey("Push-positive-effect"), i = this.getActiveRollMods(C.after, "positive").filter((o) => o.effectKeys.includes("Negate-PushCost"));
    return ((e == null ? void 0 : e.isActive) && (e == null ? void 0 : e.stressCost) || 0) + ((a == null ? void 0 : a.isActive) && (a == null ? void 0 : a.stressCost) || 0) + ((r == null ? void 0 : r.isActive) && (r == null ? void 0 : r.stressCost) || 0) - i.length * 2;
  }
  get rollCostData() {
    return this.getActiveRollMods().map((e) => e.costs ?? []).flat();
  }
  getRollModByID(e) {
    return this.rollMods.find((a) => a.id === e);
  }
  getRollModByName(e, a, r) {
    const i = this.rollMods.filter((o) => !(h.lCase(o.name) !== h.lCase(e) || a && o.section !== a || r && o.posNeg !== r));
    if (i.length !== 0 && !(i.length > 1))
      return i[0];
  }
  getRollModByKey(e) {
    return this.rollMods.find((a) => a.data.key === e);
  }
  getRollMods(e, a) {
    return this.rollMods.filter((r) => (!e || r.section === e) && (!a || r.posNeg === a));
  }
  getVisibleRollMods(e, a) {
    return this.getRollMods(e, a).filter((r) => r.isVisible);
  }
  getActiveRollMods(e, a) {
    return this.getRollMods(e, a).filter((r) => r.isActive);
  }
  getVisibleInactiveRollMods(e, a) {
    return this.getVisibleRollMods(e, a).filter((r) => !r.isActive);
  }
  getPushMods(e, a) {
    return this.getRollMods(e, a).filter((r) => r.isPush);
  }
  getVisiblePushMods(e, a) {
    return this.getPushMods(e, a).filter((r) => r.isVisible);
  }
  getActivePushMods(e, a) {
    return this.getVisiblePushMods(e, a).filter((r) => r.isActive);
  }
  getActiveBasicPushMods(e, a) {
    return this.getActivePushMods(e, a).filter((r) => r.isBasicPush);
  }
  getInactivePushMods(e, a) {
    return this.getVisiblePushMods(e, a).filter((r) => !r.isActive);
  }
  getInactiveBasicPushMods(e, a) {
    return this.getInactivePushMods(e, a).filter((r) => r.isBasicPush);
  }
  getForcedPushMods(e, a) {
    return this.getActivePushMods(e, a).filter((r) => r.isBasicPush && r.status === T.ForcedOn);
  }
  getOpenPushMods(e, a) {
    return this.getActivePushMods(e, a).filter((r) => r.isBasicPush && r.status === T.ToggledOn);
  }
  /**
   * Compare function for sorting roll mods.
   * @param {BladesRollMod} modA First mod to compare.
   * @param {BladesRollMod} modB Second mod to compare.
   * @returns {number} - Comparison result.
   */
  compareMods(e, a) {
    const r = ["Bargain", "Assist", "Setup"];
    if (e.isBasicPush)
      return -1;
    if (a.isBasicPush)
      return 1;
    if (e.name === "Bargain" && e.isActive)
      return -1;
    if (a.name === "Bargain" && a.isActive)
      return 1;
    if (e.isPush)
      return -1;
    if (a.isPush)
      return 1;
    const i = r.indexOf(e.name), o = r.indexOf(a.name);
    return i !== -1 && o !== -1 ? i - o : e.name.localeCompare(a.name);
  }
  get rollMods() {
    return this._rollMods || (this._rollMods = Object.values(this.data.rollModsData).map((e) => new _e(e, this))), [...this._rollMods].sort((e, a) => this.compareMods(e, a));
  }
  // #endregion
  // #region CONSEQUENCES: Getting, Accepting, Resisting
  get consequences() {
    var a, r;
    const e = (r = (a = this.data.consequenceData) == null ? void 0 : a[this.rollPositionFinal]) == null ? void 0 : r[this.rollResult];
    return e ? Object.values(e).map((i) => new Se(i)) : [];
  }
  getConsequenceByID(e) {
    return this.consequences.find((a) => a.id === e) ?? !1;
  }
  get acceptedConsequences() {
    return [Me.AwaitingConsequences, Me.Complete].includes(this.rollPhase) ? this.consequences.filter((e) => e.isAccepted === !0) : [];
  }
  get unacceptedConsequences() {
    return this.rollPhase === Me.AwaitingConsequences ? this.consequences.filter((e) => e.isAccepted !== !0) : [];
  }
  // #endregion
  // #region *** ROLL COLLAB HTML INTERACTION *** ~
  /**
   * Retrieve the data for rendering the base RollCollab sheet.
   * @returns {Promise<object>} The data which can be used to render the HTML of the sheet.
   */
  get context() {
    return this.initRollMods(), this.rollMods.forEach((e) => e.applyRollModEffectKeys()), this.getTemplateContext();
  }
  /**
   * Determines if the user is a game master.
   * @returns {boolean} Whether the user is a GM.
   */
  getIsGM() {
    var e;
    return (e = game.eunoblades.Tracker) != null && e.system.is_spoofing_player ? !1 : game.user.isGM;
  }
  /**
   * Gets the roll costs.
   * @returns {BladesRoll.CostData[]} The roll costs.
   */
  getRollCosts() {
    return this.getActiveRollMods().map((e) => e.costs).flat().filter((e) => e !== void 0);
  }
  /**
   * Constructs the sheet data.
   * @param {boolean} isGM If the user is a GM.
   * @param {BladesRoll.CostData[]} rollCosts The roll costs.
   * @returns {BladesRoll.Context} The constructed sheet data.
   */
  getTemplateContext() {
    var j;
    const {
      data: e,
      rollPrimary: a,
      rollTraitData: r,
      rollTraitOptions: i,
      rollClockKey: o,
      finalDicePool: n,
      rollPositionFinal: l,
      rollEffectFinal: c,
      rollResultDelta: d,
      rollResultFinal: p,
      rollMods: u,
      rollFactors: f
    } = this;
    if (!a)
      throw new Error("A primary roll source is required for BladesRoll.");
    const y = {
      ...this.data,
      cssClass: "roll-collab",
      isGM: this.isGM,
      system: (j = this.rollPrimaryDoc) == null ? void 0 : j.system,
      rollMods: u,
      rollPrimary: a,
      rollTraitData: r,
      rollTraitOptions: i,
      diceTotal: n,
      rollOpposition: this.rollOpposition,
      rollParticipants: this.rollParticipants,
      rollParticipantOptions: this.rollParticipantSelectOptions,
      rollEffects: Object.values(ee),
      rollTraitValOverride: this.rollTraitValOverride,
      rollFactorPenaltiesNegated: this.rollFactorPenaltiesNegated,
      posRollMods: Object.fromEntries(Object.values(C).map((B) => [B, this.getRollMods(B, "positive")])),
      negRollMods: Object.fromEntries(Object.values(C).map((B) => [B, this.getRollMods(B, "negative")])),
      hasInactiveConditionals: this.calculateHasInactiveConditionalsData(),
      rollFactors: f,
      ...this.calculateOddsHTML(n, d)
    }, S = this.calculateGMBoostsData(e), D = this.calculatePositionEffectTradeData(), O = this.getRollCosts().filter((B) => B.costType === "Stress").map((B) => [B.label, B.costAmount]), q = [];
    if (this.rollPrimaryDoc instanceof M)
      q.push(...this.rollPrimaryDoc.availableArmor);
    else if (k.IsType(
      this.rollPrimaryDoc,
      g.cohort_gang,
      g.cohort_expert
    ))
      for (let B = 0; B < this.rollPrimaryDoc.system.armor.value; B++)
        q.push("Armor");
    const E = this.getRollCosts().filter((B) => B.costType === "Armor").map((B, vt) => [B.label, q[vt]]).filter(([B, vt]) => vt !== void 0), Y = this.getRollCosts().filter((B) => B.costType === "SpecialArmor").map((B) => B.label), ce = y.userPermissions[game.user.id] ?? Q.Observer;
    return {
      ...y,
      rollPrimary: this.rollPrimary,
      rollPositionFinal: l,
      rollEffectFinal: c,
      rollResultFinal: p,
      rollPositions: Object.values(ie),
      rollEffects: Object.values(ee),
      rollResultDelta: d,
      isAffectingResult: d !== 0 || this.getVisibleRollMods(C.result).length > 0 || this.isGM && this.getRollMods(C.result).length > 0,
      isAffectingAfter: this.getVisibleRollMods(C.after).length > 0 || this.isGM && this.getRollMods(C.after).length > 0,
      ...S,
      ...D,
      rollClockKey: this.rollClockKey,
      totalStressCost: O.reduce((B, [vt, Ka]) => B + Ka, 0),
      totalArmorCost: E.length,
      stressCosts: O.length > 0 ? Object.fromEntries(O) : void 0,
      armorCosts: E.length > 0 ? Object.fromEntries(E) : void 0,
      specArmorCost: Y[0],
      userPermission: ce,
      editable: ce === Q.Primary || ce === Q.GM,
      gamePhase: game.eunoblades.Tracker.phase
    };
  }
  // type BladesSelectOption<displayType, valueType = string> = {
  //   value: valueType,
  //   display: displayType
  // };
  // protected processDowntimeActions() {
  //   const downtimeData: Record<string,any>;
  //   if (BladesActor.IsType(this.rollPrimaryDoc, BladesActorType.pc)) {
  //     downtimeData.canDoDowntimeActions = true;
  //     downtimeData.downtimeActionsRemaining = this.rollPrimaryDoc.remainingDowntimeActions;
  //     const availableDowntimeActions: DowntimeAction[] = [];
  //     if (this.rollType === RollType.Action) {
  //       availableDowntimeActions.push(...[
  //         DowntimeAction.AcquireAsset,
  //         DowntimeAction.LongTermProject,
  //         DowntimeAction.Recover,
  //         DowntimeAction.ReduceHeat
  //       ]);
  //     } else if (this.rollType === RollType.Fortune) {
  //       availableDowntimeActions.push(...[
  //         DowntimeAction.
  //       ])
  //     }
  //     downtimeData.downtimeActionOptions =
  //   downtimeActionOptions?: Array<BladesSelectOption<string, DowntimeAction>
  // }
  calculateGMBoostsData(e) {
    return {
      GMBoosts: {
        Dice: e.GMBoosts.Dice ?? 0,
        [m.tier]: e.GMBoosts[m.tier] ?? 0,
        [m.quality]: e.GMBoosts[m.quality] ?? 0,
        [m.scale]: e.GMBoosts[m.scale] ?? 0,
        [m.magnitude]: e.GMBoosts[m.magnitude] ?? 0,
        Result: e.GMBoosts.Result ?? 0
      },
      GMOppBoosts: {
        [m.tier]: e.GMOppBoosts[m.tier] ?? 0,
        [m.quality]: e.GMOppBoosts[m.quality] ?? 0,
        [m.scale]: e.GMOppBoosts[m.scale] ?? 0,
        [m.magnitude]: e.GMOppBoosts[m.magnitude] ?? 0
      }
    };
  }
  calculateOddsHTML(e, a) {
    return this.rollType === _.Resistance ? this.calculateOddsHTML_Resistance(e) : this.calculateOddsHTML_Standard(e, a);
  }
  /**
   * Calculate odds starting & ending HTML based on given dice total.
   * @param {number} diceTotal Total number of dice.
   * @param {number} rollResultDelta
   * @returns {{oddsHTMLStart: string, oddsHTMLStop: string}} Opening & Closing HTML for odds bar display
   */
  calculateOddsHTML_Standard(e, a) {
    const r = {
      crit: "var(--blades-gold)",
      success: "var(--blades-white-bright)",
      partial: "var(--blades-grey)",
      fail: "var(--blades-black-dark)"
    }, i = { ...v.DiceOddsStandard[e] };
    if (a < 0)
      for (let n = a; n < 0; n++)
        r.crit = r.success, r.success = r.partial, r.partial = r.fail;
    else if (a > 0)
      for (let n = 0; n < a; n++)
        r.fail = r.partial, r.partial = r.success, r.success = r.crit;
    const o = [];
    return Object.entries(i).reverse().forEach(([n, l]) => {
      l !== 0 && o.push(`<div class="odds-section" style="height: 100%; width: ${l}%; background: ${r[n]};">&nbsp;</div>`);
    }), {
      oddsHTMLStart: [
        '<div class="roll-odds-section-container">',
        ...o
      ].join(`
`),
      oddsHTMLStop: "</div>"
    };
  }
  /**
   * Calculate odds starting & ending HTML based on given dice total.
   * @param {number} diceTotal Total number of dice.
   * @returns {{oddsHTMLStart: string, oddsHTMLStop: string}} Opening & Closing HTML for odds bar display
   */
  calculateOddsHTML_Resistance(e) {
    const a = [
      "var(--blades-gold)",
      // -1
      "var(--blades-white)",
      // 0
      "var(--blades-red)",
      // 1
      "var(--blades-red)",
      // 2
      "var(--blades-red)",
      // 3
      "var(--blades-red)",
      // 4
      "var(--blades-red)"
      // 5
    ].reverse(), r = [
      "none",
      "none",
      "brightness(0.2)",
      "brightness(0.4)",
      "brightness(0.6)",
      "brightness(0.8)",
      "none"
    ].reverse(), i = [...v.DiceOddsResistance[e]].reverse(), o = [];
    for (let n = 0; n < i.length; n++) {
      const l = i[n];
      if (l > 0) {
        const c = a[n], d = r[n];
        o.push(`<div class="odds-section odds-section-stress" style="height: 100%; width: ${l}%; background: ${c}; filter: ${d};">&nbsp;</div>`);
      }
    }
    return {
      oddsHTMLStart: [
        '<div class="roll-odds-section-container">',
        ...o
      ].join(`
`),
      oddsHTMLStop: "</div>"
    };
  }
  /**
   * Calculate data for position and effect trade.
   * @returns {{canTradePosition: boolean, canTradeEffect: boolean}}
   */
  calculatePositionEffectTradeData() {
    const e = this.posEffectTrade === "position" || this.posEffectTrade === !1 && this.rollPositionFinal !== ie.desperate && this.rollEffectFinal !== ee.extreme, a = this.posEffectTrade === "effect" || this.posEffectTrade === !1 && this.rollPositionFinal !== ie.controlled && this.rollEffectFinal !== ee.zero;
    return { canTradePosition: e, canTradeEffect: a };
  }
  /**
   * Calculate data on whether there are any inactive conditionals.
   * @returns {Record<RollModSection, boolean>} - Data on inactive conditionals.
   */
  calculateHasInactiveConditionalsData() {
    const e = {};
    for (const a of Object.values(C))
      e[a] = this.getRollMods(a).filter((r) => r.isInInactiveBlock).length > 0;
    return e;
  }
  get dieVals() {
    return this.roll.terms[0].results.map((e) => e.result).sort().reverse();
  }
  // Accounts for rolling zero dice by removing highest.
  get finalDieVals() {
    return this.isRollingZero ? this.dieVals.slice(1) : this.dieVals;
  }
  get finalDiceData() {
    eLog.checkLog3("rollCollab", "[get finalDiceData()]", { roll: this, dieVals: this.dieVals });
    const e = [...this.dieVals], a = this.isRollingZero ? e.shift() : null, r = e.filter((o) => o === 6).length >= 2, i = e.map((o, n) => ({
      value: o,
      dieClass: se.GetDieClass(this.rollType, this.rollResult, o, n),
      dieImage: se.GetDieImage(this.rollType, this.rollResult, o, n, !1, r)
    }));
    return a && i.push({
      value: a,
      dieClass: "blades-die-ghost",
      dieImage: se.GetDieImage(this.rollType, this.rollResult, a, i.length, !0, !1)
    }), i;
  }
  // get dieValsHTML(): string {
  //   eLog.checkLog3("rollCollab", "[get dieValsHTML()]", {roll: this, dieVals: this.dieVals});
  //   const dieVals = [...this.dieVals];
  //   const ghostNum = this.isRollingZero ? dieVals.shift() : null;
  //   const isCritical = dieVals.filter((val) => val === 6).length >= 2;
  //   const diceData = dieVals.map((val, i) => ({
  //     value: val,
  //     dieClass: BladesRoll.GetDieClass(this.rollType, this.rollResult, val, i),
  //     dieImage: BladesRoll.GetDieImage(this.rollType, this.rollResult, val, i, false, isCritical)
  //   }));
  //   if (ghostNum) {
  //     diceData.push({
  //       value: ghostNum,
  //       dieClass: "blades-die-ghost",
  //       dieImage: BladesRoll.GetDieImage(this.rollType, this.rollResult, ghostNum, diceData.length, true, false)
  //     });
  //   }
  //   return [
  //     ...dieVals.map((val, i) => `<span class='blades-die ${dieClass} blades-die-${value}'><img src='${dieImage}' /></span>`),
  //     ghostNum ? `<span class='blades-die blades-die-ghost blades-die-${ghostNum}'><img src='${this.getDieImage(ghostNum, 0, true)}' /></span>` : null
  //   ]
  //     .filter((val): val is string => typeof val === "string")
  //     .join("");
  // }
  // #endregion
  // #region RESULT GETTERS ~
  get isCritical() {
    return this.finalDieVals.filter((e) => e === 6).length >= 2;
  }
  get isSuccess() {
    return !!(!this.isCritical && this.finalDieVals.find((e) => e === 6));
  }
  get isPartial() {
    return !!(!this.isCritical && !this.isSuccess && this.finalDieVals.find((e) => e && e >= 4));
  }
  get isFail() {
    return !this.isCritical && !this.isSuccess && !this.isPartial;
  }
  get highestDieVal() {
    return this.finalDieVals[0];
  }
  get rollResult() {
    throw new Error("[BladesRoll.rollResult] Unimplemented by Subclass.");
  }
  // #endregion
  get isResolved() {
    return this.roll.total !== void 0;
  }
  async evaluateRoll() {
    return this.isResolved ? (this.closeRollCollab_Animation(), this.data) : (this.closeRollCollab_SocketCall(), eLog.checkLog3("rollCollab", "[resolveRoll()] Before Evaluation", { roll: this, rollData: { ...this.data } }), await this.roll.evaluate({ async: !0 }), await this.updateTargetData({
      ...this.data,
      rollPositionFinal: this.rollPositionFinal,
      rollEffectFinal: this.rollEffectFinal,
      rollResult: this.rollResult,
      rollTraitVerb: this.rollTraitVerb,
      rollTraitPastVerb: this.rollTraitPastVerb,
      finalDiceData: this.finalDiceData,
      rollPhase: this.isApplyingConsequences ? Me.AwaitingConsequences : Me.Complete
    }));
  }
  async resolveRollResult() {
    throw new Error("[BladesRoll.resolveRollResult] Unimplemented by Subclass.");
  }
  async outputRollToChat() {
    await Ne.create({
      speaker: this.getSpeaker(Ne.getSpeaker()),
      content: await renderTemplate(this.chatTemplate, this.data),
      type: CONST.CHAT_MESSAGE_TYPES.ROLL,
      flags: {
        "eunos-blades": { rollData: this.data }
      }
    });
  }
  async resolveRoll() {
    await this.evaluateRoll(), this.resolveRollResult(), await this.outputRollToChat();
  }
  // #endregion
  // #region *** INTERFACING WITH BLADESCHAT ***
  getSpeaker(e) {
    var n;
    const { rollPrimaryID: a, rollPrimaryName: r, rollPrimaryType: i, rollPrimaryDoc: o } = this.rollPrimary;
    return e.alias = r, [g.cohort_gang, g.cohort_expert].includes(i) ? (e.actor = ((n = o == null ? void 0 : o.parent) == null ? void 0 : n.id) ?? e.actor, (o == null ? void 0 : o.parent) instanceof M && (e.alias = `${e.alias} (${o.parent.name})`)) : [g.gm_tracker, g.score].includes(i) ? (e.actor = null, e.alias = "The Gamemaster") : a && (e.actor = a), e;
  }
  get overlayPosition() {
    return this._overlayPosition;
  }
  set overlayPosition(e) {
    this._overlayPosition = e;
  }
  get elem$() {
    if (this._elem$)
      return this._elem$;
    const e = $(`#${this.id}`);
    return e.length ? this._elem$ = e : (this._elem$ = $(`<div id="${this.id}" class="app window-app ${v.SYSTEM_ID} sheet roll-collab${game.user.isGM ? " gm-roll-collab" : ""}"></div>`).appendTo("body"), this._elem$.css({
      left: `${this.overlayPosition.x}px`,
      top: `${this.overlayPosition.y}px`
    })), this._elem$;
  }
  async renderRollCollab() {
    this.prepareRollParticipantData();
    const e = await renderTemplate(this.collabTemplate, this.context);
    this.elem$.html(e), this.activateListeners();
  }
  get isRendered() {
    var e;
    return !!((e = this._elem$) != null && e.length);
  }
  get collabTemplate() {
    throw new Error("[BladesRoll.collabTemplate] Unimplemented by Subclass.");
  }
  get chatTemplate() {
    throw new Error("[BladesRoll.chatTemplate] Unimplemented by Subclass.");
  }
  // #region LISTENER FUNCTIONS ~
  // async _handleConsequenceClick(event: ClickEvent) {
  //   const clickTarget$ = $(event.currentTarget);
  //   const csqParent$ = clickTarget$.closest(".comp.consequence-display-container");
  //   const csqID = csqParent$.data("csq-id");
  //   const chatElem$ = csqParent$.closest(".blades-roll");
  //   const chatMessage$ = chatElem$.closest(".chat-message");
  //   const chatID = chatMessage$.data("messageId") as IDString;
  //   const chatMessage = game.messages.get(chatID);
  //   if (!chatMessage) {return;}
  //   const csqs = await BladesConsequence.GetFromChatMessage(chatMessage);
  //   const thisCsq = csqs.find((csq) => csq.id === csqID);
  //   if (!thisCsq) {return;}
  //   switch (clickTarget$.data("action")) {
  //     case "accept-consequence": return thisCsq.resolveAccept();
  //     case "resist-consequence": return thisCsq.resistConsequence();
  //     case "armor-consequence": return thisCsq.resistArmorConsequence();
  //     case "special-consequence": return thisCsq.resistSpecialArmorConsequence();
  //   }
  //   return undefined as never;
  // }
  _toggleRollModClick(e) {
    e.preventDefault();
    const r = $(e.currentTarget).data("id"), i = this.getRollModByID(r);
    if (!i)
      throw new Error(`Unable to find roll mod with id '${r}'`);
    switch (i.isRerendering = !0, i.status) {
      case T.Hidden:
        i.userStatus = T.ForcedOff;
        break;
      case T.ForcedOff:
        i.userStatus = T.ToggledOff;
        break;
      case T.ToggledOff:
        i.userStatus = T.ToggledOn;
        break;
      case T.ToggledOn:
        i.userStatus = game.user.isGM ? T.ForcedOn : T.ToggledOff;
        break;
      case T.ForcedOn:
        i.userStatus = T.Hidden;
        break;
      default:
        throw new Error(`Unrecognized RollModStatus: ${i.status}`);
    }
    i.isRerendering = !1;
  }
  /**
   * Handles setting of rollMod status via GM pop-out controls
   * @param {ClickEvent} event JQuery click event sent to listener.
   */
  _gmControlSet(e) {
    if (e.preventDefault(), !game.user.isGM)
      return;
    const a = $(e.currentTarget), r = a.data("id"), i = a.data("status");
    if (!Xi(i) && i !== "Reset")
      return;
    const o = this.getRollModByID(r);
    o && (o.userStatus = i === "Reset" ? void 0 : i);
  }
  /**
   * Handles setting values via GM number line (e.g. roll factor boosts/modifications).
   * @param {ClickEvent} event JQuery click event sent to listener.
   */
  async _gmControlSetTargetToValue(e) {
    if (e.preventDefault(), !game.user.isGM)
      return;
    const a = $(e.currentTarget), r = a.data("target").replace(/flags\.eunos-blades\./, ""), i = a.data("value");
    await this.updateTarget(r, i), socketlib.system.executeForEveryone("renderRollCollab_SocketCall", this.id);
  }
  async _gmControlCycleTarget(e) {
    var d;
    if (e.preventDefault(), !game.user.isGM)
      return;
    const a = $(e.currentTarget), r = a.data("flagTarget"), i = a.data("curVal"), o = (d = a.data("vals")) == null ? void 0 : d.split(/\|/);
    if (!o)
      throw new Error(`Unable to parse cycle values from data-vals = ${a.data("vals")}`);
    const n = o.indexOf(i);
    if (n === -1)
      throw new Error(`Unable to find current value '${i}' in cycle values '${a.data("vals")}'`);
    let l = n + 1;
    l >= o.length && (l = 0);
    const c = o[l];
    eLog.checkLog3("gmControlCycleTarget", "gmControlCycleTarget", { flagTarget: r, curVal: i, cycleVals: o, curValIndex: n, newValIndex: l, newVal: c }), await this.updateTarget(r, c);
  }
  /**
   * Handles resetting value associated with GM number line on a right-click.
   * @param {ClickEvent} event JQuery context menu event sent to listener.
   */
  async _gmControlResetTarget(e) {
    e.preventDefault(), game.user.isGM && (await this.updateTarget($(e.currentTarget).data("target"), void 0), socketlib.system.executeForEveryone("renderRollCollab_SocketCall", this.id));
  }
  /**
   * Handles setting of baseline rollPosition via GM button line
   * @param {ClickEvent} event JQuery click event sent to listener.
   */
  _gmControlSetPosition(e) {
    if (e.preventDefault(), !game.user.isGM)
      return;
    const r = $(e.currentTarget).data("status");
    this.initialPosition = r;
  }
  /**
   * Handles setting of baseline rollPosition via GM button line
   * @param {ClickEvent} event JQuery click event sent to listener.
   */
  _gmControlSetEffect(e) {
    if (e.preventDefault(), !game.user.isGM)
      return;
    const r = $(e.currentTarget).data("status");
    this.initialEffect = r;
  }
  /**
   * Handles setting of Factor toggles: isActive, isPrimary, highFavorsPC, isDominant
   * @param {ClickEvent} event JQuery click event sent to listener.
   */
  async _gmControlToggleFactor(e) {
    if (e.preventDefault(), !game.user.isGM)
      return;
    const a = $(e.currentTarget), r = a.data("target"), i = !a.data("value");
    eLog.checkLog3("toggleFactor", "_gmControlToggleFactor", { event: e, target: r, value: i });
    const o = this.data.rollFactorToggles, [n, l, c] = r.split(/\./).slice(-3);
    switch (["isActive", "isPrimary", "isDominant", "highFavorsPC"].includes(c) || (await this.updateTarget(r, i), socketlib.system.executeForEveryone("renderRollCollab_SocketCall", this.id)), o[n][l] = {
      ...o[n][l] ?? { display: "" },
      [c]: i
    }, c) {
      case "isDominant":
      case "isPrimary": {
        i === !0 && Object.values(m).filter((d) => d !== l).forEach((d) => {
          var p;
          ((p = o[n][d]) == null ? void 0 : p[c]) === !0 && (o[n][d] = {
            ...o[n][d],
            [c]: !1
          });
        });
        break;
      }
      case "isActive": {
        if (i === !0) {
          const d = n === "source" ? "opposition" : "source";
          o[d][l] = {
            ...o[d][l] ?? { display: "" },
            isActive: i
          };
        }
        break;
      }
    }
    await this.updateTarget("rollFactorToggles", o), socketlib.system.executeForEveryone("renderRollCollab_SocketCall", this.id);
  }
  async _onSelectChange(e) {
    e.preventDefault();
    const a = e.currentTarget, { docType: r } = a.dataset;
    if (a.value !== "" && (r != null && r.startsWith("BladesRollParticipant"))) {
      const [i, o, n] = r.split(".");
      await this.addRollParticipant(
        a.value,
        o,
        n
      );
    } else
      await h.EventHandlers.onSelectChange(this, e), socketlib.system.executeForEveryone("renderRollCollab_SocketCall", this.id);
  }
  async _onTextInputBlur(e) {
    await h.EventHandlers.onTextInputBlur(this, e), socketlib.system.executeForEveryone("renderRollCollab_SocketCall", this.id);
  }
  async _onGMPopupClick(e) {
    const a = $(e.currentTarget), r = a.data("prompt"), i = a.data("flagTarget");
    r && i && Ze.DisplaySimpleInputDialog(this, r, void 0, i);
  }
  get positionDragger() {
    return this._positionDragger ? this._positionDragger : this.spawnPositionDragger();
  }
  spawnPositionDragger() {
    var a;
    const e = this;
    if (!this._elem$)
      throw new Error(`[BladesRoll.spawnPositionDragger] No elem$ found for roll ${this.id}.`);
    return (a = this._positionDragger) == null || a.kill(), this._positionDragger = new Pt(this._elem$, {
      type: "top,left",
      trigger: ".window-header.dragger",
      onDragStart() {
        h.gsap.to(this.target, { opacity: 0.25, duration: 0.25, ease: "power2" });
      },
      onDragEnd() {
        h.gsap.to(this.target, { opacity: 1, duration: 0.25, ease: "power2" }), e.overlayPosition = { x: this.endX, y: this.endY };
      }
    });
  }
  activateListeners() {
    Ue(this.elem$), this.spawnPositionDragger(), this.rollClockKey && this.elem$.find(".roll-clock").removeClass("hidden"), this.elem$.find(".roll-mod[data-action='toggle']").on({
      click: this._toggleRollModClick.bind(this)
    }), this.elem$.find("[data-action='tradePosition']").on({
      click: (e) => {
        `${$(e.currentTarget).data("value")}` === "false" ? this.updateTarget("rollPosEffectTrade", "effect").then(() => socketlib.system.executeForEveryone("renderRollCollab_SocketCall", this.id)) : this.updateTarget("rollPosEffectTrade", !1).then(() => socketlib.system.executeForEveryone("renderRollCollab_SocketCall", this.id));
      }
    }), this.elem$.find("[data-action='tradeEffect']").on({
      click: (e) => {
        `${$(e.currentTarget).data("value")}` === "false" ? this.updateTarget("rollPosEffectTrade", "position").then(() => socketlib.system.executeForEveryone("renderRollCollab_SocketCall", this.id)) : this.updateTarget("rollPosEffectTrade", !1).then(() => socketlib.system.executeForEveryone("renderRollCollab_SocketCall", this.id));
      }
    }), this.elem$.find("[data-action='roll']").on({
      click: () => this.resolveRoll()
    }), this.elem$.find("select[data-action='player-select']").on({ change: this._onSelectChange.bind(this) }), game.user.isGM && (this.elem$.find(".controls-toggle").on({
      click: (e) => {
        e.preventDefault(), $(e.currentTarget).parents(".controls-panel").toggleClass("active");
      }
    }), this.elem$.find('[data-action="gm-set"]').on({
      click: this._gmControlSet.bind(this)
    }), this.elem$.find('[data-action="gm-set-position"]').on({
      click: this._gmControlSetPosition.bind(this)
    }), this.elem$.find('[data-action="gm-set-effect"]').on({
      click: this._gmControlSetEffect.bind(this)
    }), this.elem$.find('[data-action="gm-set-target"]').on({
      click: this._gmControlSetTargetToValue.bind(this),
      contextmenu: this._gmControlResetTarget.bind(this)
    }), this.elem$.find('[data-action="gm-cycle-target"]').on({
      click: this._gmControlCycleTarget.bind(this)
    }), this.elem$.find('[data-action="gm-toggle-factor"]').on({
      click: this._gmControlToggleFactor.bind(this)
    }), this.elem$.find("select[data-action='gm-select']").on({ change: this._onSelectChange.bind(this) }), this.elem$.find('[data-action="gm-text-popup"]').on({ click: this._onGMPopupClick.bind(this) }), this.elem$.find("[data-action='gm-text-input']").on({ blur: this._onTextInputBlur.bind(this) }));
  }
  // #endregion
  // #endregion
  // #region OVERRIDES: _canDragDrop, _onDrop, _onSubmit, close, render ~
  // override _canDragDrop() {
  //   return game.user.isGM;
  // }
  // override _onDrop(event: DragEvent) {
  //   const {uuid} = TextEditor.getDragEventData(event) as {uuid: UUIDString};
  //   const dropDoc = fromUuidSync(uuid);
  //   if (BladesRollOpposition.IsDoc(dropDoc)) {
  //     this.rollOpposition = new BladesRollOpposition(this, {rollOppDoc: dropDoc});
  //   } else if (dropDoc instanceof BladesProject && dropDoc.clockKey) {
  //     // Project dropped on roll: Assign project's clock key to roll.
  //     this.rollClockKey = dropDoc.clockKey;
  //   }
  // }
  async submitChange(e, a) {
    await this.updateTarget(e, a), socketlib.system.executeForEveryone("renderRollCollab_SocketCall", this.id);
  }
  // #endregion
};
w(se, "Debug", {
  modWatch: !1,
  watchRollMod(e) {
    typeof e == "string" ? se.Debug.modWatch = new RegExp(e, "g") : se.Debug.modWatch = !1;
  }
});
let Fe = se;
class Ge extends Fe {
  /* Not much -- most action roll things will extend to other rolls, but split out things like Position, Effect, default Mods */
  static ApplySchemaDefaults(t) {
    var r, i;
    if (t.rollType = _.Action, !t.rollPrimaryData)
      throw new Error("Must include a rollPrimaryData when constructing a BladesActionRoll object.");
    if (!(t.rollTrait === "" || h.isInt(t.rollTrait) || h.lCase(t.rollTrait) in { ...Ae, ...m }))
      throw new Error(`[BladesActionRoll.ApplySchemaDefaults()] Bad RollTrait for Action Roll: ${t.rollTrait}`);
    const e = super.ApplySchemaDefaults(t), a = R.Build(e);
    switch (e.rollDowntimeAction) {
      case P.AcquireAsset: {
        e.rollTrait = m.tier;
        break;
      }
      case P.LongTermProject: {
        if (!he.IsValidData(e.rollOppData))
          throw new Error("No rollOppData provided for LongTermProject roll.");
        if (![
          g.project,
          g.design
        ].includes(e.rollOppData.rollOppType))
          throw new Error("rollOppType must be 'project' or 'design' for LongTermProject roll.");
        break;
      }
      case P.Recover: {
        if (M.IsType(a.rollPrimaryDoc)) {
          if (!a.rollPrimaryDoc.abilities.find((o) => o.name === "Physiker"))
            throw new Error("A PC rollPrimary on a Recovery roll must have the Physiker ability.");
          e.rollTrait = Ae.tinker;
        } else if (((r = a.rollPrimaryDoc) == null ? void 0 : r.rollPrimaryType) === b.npc)
          e.rollTrait = m.quality;
        else
          throw new Error("Only a PC with Physiker or an NPC can be rollPrimary on a Recover roll.");
        break;
      }
      case P.ReduceHeat: {
        let o;
        if (a.rollPrimaryDoc) {
          const { parent: n } = a.rollPrimaryDoc;
          de.IsType(n) ? o = n : M.IsType(n) && de.IsType(n.crew) && (o = n.crew);
        }
        if (!de.IsType(o))
          throw new Error(`Could not find crew for rollPrimary '${(i = a.rollPrimaryDoc) == null ? void 0 : i.rollPrimaryName}'`);
        if (o.system.heat.value === 0)
          throw new Error("Attempt to Reduce Heat for a Crew with no Heat.");
        break;
      }
      case void 0:
        break;
      default:
        throw new Error(`Unrecognized Roll Downtime Action: ${e.rollDowntimeAction}`);
    }
    return {
      rollPositionInitial: ie.risky,
      rollEffectInitial: ee.standard,
      rollPosEffectTrade: !1,
      GMBoosts: {
        [m.tier]: 0,
        [m.quality]: 0,
        [m.scale]: 0,
        [m.magnitude]: 0
      },
      GMOppBoosts: {
        [m.tier]: 0,
        [m.quality]: 0,
        [m.scale]: 0,
        [m.magnitude]: 0
      },
      GMOverrides: {},
      rollFactorToggles: {
        source: {
          [m.tier]: {
            display: "",
            isActive: !1,
            isPrimary: !1,
            isDominant: !1,
            highFavorsPC: !0
          },
          [m.quality]: {
            display: "",
            isActive: !1,
            isPrimary: !1,
            isDominant: !1,
            highFavorsPC: !0
          },
          [m.scale]: {
            display: "",
            isActive: !1,
            isPrimary: !1,
            isDominant: !1,
            highFavorsPC: !0
          },
          [m.magnitude]: {
            display: "",
            isActive: !1,
            isPrimary: !1,
            isDominant: !1,
            highFavorsPC: !0
          }
        },
        opposition: {
          [m.tier]: {
            display: "",
            isActive: !1,
            isPrimary: !1,
            isDominant: !1,
            highFavorsPC: !0
          },
          [m.quality]: {
            display: "",
            isActive: !1,
            isPrimary: !1,
            isDominant: !1,
            highFavorsPC: !0
          },
          [m.scale]: {
            display: "",
            isActive: !1,
            isPrimary: !1,
            isDominant: !1,
            highFavorsPC: !0
          },
          [m.magnitude]: {
            display: "",
            isActive: !1,
            isPrimary: !1,
            isDominant: !1,
            highFavorsPC: !0
          }
        }
      },
      ...e,
      rollPrimaryData: a.data,
      rollOppData: e.rollOppData instanceof he ? e.rollOppData.data : e.rollOppData
    };
  }
  static get DefaultRollModSchemaSet() {
    return [
      {
        key: "Push-positive-roll",
        name: "PUSH",
        section: C.roll,
        base_status: T.ToggledOff,
        posNeg: "positive",
        modType: F.general,
        value: 1,
        effectKeys: ["ForceOff-Bargain", "Cost-Stress2"],
        tooltip: "<h1>Push for +1d</h1><p>For <strong class='red-bright'>2 Stress</strong>, add <strong class='gold-bright'>1 die</strong> to your pool.</p><p><em>(You <strong>cannot</strong> also accept a <strong class='red-bright'>Devil's Bargain</strong> to increase your dice pool: It's one or the other.)</em></p>"
      },
      {
        key: "Bargain-positive-roll",
        name: "Bargain",
        section: C.roll,
        base_status: T.Hidden,
        posNeg: "positive",
        modType: F.general,
        value: 1,
        effectKeys: [],
        tooltip: "<h1 class='red-bright'>Devil's Bargain</h1><p>The GM has offered you a <strong class='red-bright'>Devil's Bargain</strong>.</p><p><strong class='red-bright'>Accept the terms</strong> to add <strong class='gold-bright'>1 die</strong> to your pool.</p><p><em>(You <strong>cannot</strong> also <strong>Push for +1d</strong> to increase your dice pool: It's one or the other.)</em></p>"
      },
      {
        key: "Assist-positive-roll",
        name: "Assist",
        section: C.roll,
        base_status: T.Hidden,
        posNeg: "positive",
        modType: F.teamwork,
        value: 1,
        tooltip: "<h1 class='gold-bright'>%DOC_NAME% Assists</h1><p><strong class='gold-bright'>%DOC_NAME%</strong> is <strong>Assisting</strong> your efforts, adding <strong class='gold-bright'>1 die</strong> to your pool.</p>"
      },
      {
        key: "Setup-positive-position",
        name: "Setup",
        section: C.position,
        base_status: T.Hidden,
        posNeg: "positive",
        modType: F.teamwork,
        value: 1,
        tooltip: "<h1 class='gold-bright'>%DOC_NAME% Sets You Up</h1><p><strong class='gold-bright'>%DOC_NAME%</strong> has set you up for success with a preceding <strong>Setup</strong> action, increasing your <strong class='gold-bright'>Position</strong> by one level.</p>"
      },
      {
        key: "Push-positive-effect",
        name: "PUSH",
        section: C.effect,
        base_status: T.ToggledOff,
        posNeg: "positive",
        modType: F.general,
        value: 1,
        effectKeys: ["Cost-Stress2"],
        tooltip: "<h1>Push for Effect</h1><p>For <strong class='red-bright'>2 Stress</strong>, increase your <strong class='gold-bright'>Effect</strong> by one level.</p>"
      },
      {
        key: "Setup-positive-effect",
        name: "Setup",
        section: C.effect,
        base_status: T.Hidden,
        posNeg: "positive",
        modType: F.teamwork,
        value: 1,
        tooltip: "<h1 class='gold-bright'>%DOC_NAME% Sets You Up</h1><p><strong class='gold-bright'>%DOC_NAME%</strong> has set you up for success with a preceding <strong>Setup</strong> action, increasing your <strong class='gold-bright'>Effect</strong> by one level.</p>"
      },
      {
        key: "Potency-positive-effect",
        name: "Potency",
        section: C.effect,
        base_status: T.Hidden,
        posNeg: "positive",
        modType: F.general,
        value: 1,
        tooltip: "<h1>Potency</h1><p>By circumstance or advantage, you have <strong>Potency</strong> in this action, increasing your <strong class='gold-bright'>Effect</strong> by one level.</p>"
      },
      {
        key: "Potency-negative-effect",
        name: "Potency",
        section: C.effect,
        base_status: T.Hidden,
        posNeg: "negative",
        modType: F.general,
        value: 1,
        tooltip: "<h1 class='red-bright'>Potency</h1><p>By circumstance or advantage, <strong class='red-bright'>@OPPOSITION_NAME@</strong> has <strong>Potency</strong> against you, reducing your <strong class='red-bright'>Effect</strong> by one level."
      }
    ];
  }
  /**
   * Asynchronously creates a new instance of this subclass of `BladesRoll`.
   *
   * Overrides the `New` static method from `BladesRoll`, applying subclass-specific configurations
   * to the instance creation process. It ensures that the returned instance is correctly typed
   * and configured for this subclass.
   *
   * @param {BladesRoll.Config} config The configuration object for creating a new roll instance,
   * extended with any subclass-specific configurations or requirements.
   *
   * @returns {Promise<InstanceType<this>>} A promise that resolves to an instance of this subclass.
   *
   * @see {@link BladesRoll.New} for the base method's functionality and the generic creation process
   * for roll instances.
   */
  static async New(t) {
    const e = this.BuildLinkConfig(t), a = {
      ...t,
      ...e
    };
    return await super.New(a);
  }
  get rollModsSchemaSets() {
    const t = super.rollModsSchemaSets;
    return this.rollPrimary.isWorsePosition && t.push({
      key: "WorsePosition-negative-position",
      name: "Worse Position",
      section: C.position,
      base_status: T.ForcedOn,
      posNeg: "negative",
      modType: F.general,
      value: 1,
      effectKeys: [],
      tooltip: "<h1>Worse Position</h1><p>A <strong class='red-bright'>Consequence</strong> on a previous roll has worsened your <strong>Position</strong>.</p>"
    }), this.acceptedConsequences.some((e) => e.type === ue.ReducedEffect) && t.push({
      key: "ReducedEffect-negative-effect",
      name: "Reduced Effect",
      section: C.effect,
      base_status: T.ForcedOn,
      posNeg: "negative",
      modType: F.general,
      value: 1,
      effectKeys: [],
      tooltip: "<h1>Reduced Effect</h1><p>A <strong class='red-bright'>Consequence</strong> has worsened your <strong>Effect</strong>.</p>"
    }), t;
  }
  get collabTemplate() {
    return `systems/eunos-blades/templates/roll/roll-collab-action${game.user.isGM ? "-gm" : ""}.hbs`;
  }
  get chatTemplate() {
    const t = [
      "systems/eunos-blades/templates/chat/roll-result/action",
      this.rollClockKey ? "-clock" : ""
    ];
    return this.rollDowntimeAction && [
      P.AcquireAsset,
      // action-acquireasset
      P.ReduceHeat,
      //   action-reduceheat
      P.Recover
      //       action-clock-recover
    ].includes(this.rollDowntimeAction) ? t.push(`-${h.lCase(this.rollDowntimeAction)}`) : this.rollSubType && [
      at.GatherInfo
      //      action-gatherinfo
    ].includes(this.rollSubType) && t.push(`-${h.lCase(this.rollSubType)}`), t.push(".hbs"), t.join("");
  }
  get rollResult() {
    return this.isResolved ? this.isCritical ? G.critical : this.isSuccess ? G.success : this.isPartial ? G.partial : G.fail : !1;
  }
  async resolveRollResult() {
    var e, a;
    eLog.checkLog2("bladesRoll", "[BladesActionRoll] Costs", this.getRollCosts());
    const t = this.getRollCosts().filter((r) => r.costType === "Armor").length;
    if (this.rollPrimaryDoc instanceof M) {
      const r = this.getRollCosts().filter((o) => o.costType === "Stress").reduce((o, n) => o + n.costAmount, 0);
      r !== 0 && this.rollPrimaryDoc.adjustStress(r), this.getRollCosts().filter((o) => o.costType === "SpecialArmor").length !== 0 && this.rollPrimaryDoc.spendSpecialArmor();
    }
    t !== 0 && this.rollPrimary.spendArmor(t), (e = this.getRollModByKey("WorsePosition-negative-position")) != null && e.isActive && ((a = this.rollPrimaryDoc) == null || a.unsetFlag("eunos-blades", "isWorsePosition"));
  }
}
class ks extends Fe {
  static ApplySchemaDefaults(t) {
    var e;
    if (!t.resistanceData || !Se.IsValidConsequenceData((e = t.resistanceData) == null ? void 0 : e.consequence))
      throw eLog.error("rollCollab", "[PrepareResistanceRoll] Bad Roll Consequence Data.", t), new Error("[PrepareResistanceRoll()] Bad Consequence Data for Resistance Roll");
    return t.rollTrait = t.resistanceData.consequence.attribute, eLog.checkLog3("bladesRoll", "BladesRoll.PrepareResistanceRoll() [1]", { config: t }), t;
  }
  /**
   * Asynchronously creates a new instance of this subclass of `BladesRoll`.
   *
   * Overrides the `New` static method from `BladesRoll`, applying subclass-specific configurations
   * to the instance creation process. It ensures that the returned instance is correctly typed
   * and configured for this subclass.
   *
   * @param {BladesRoll.Config} config The configuration object for creating a new roll instance,
   * extended with any subclass-specific configurations or requirements.
   *
   * @returns {Promise<InstanceType<this>>} A promise that resolves to an instance of this subclass.
   *
   * @see {@link BladesRoll.New} for the base method's functionality and the generic creation process
   * for roll instances.
   */
  static async New(t) {
    const e = this.BuildLinkConfig(t), a = {
      ...t,
      ...e
    };
    return await super.New(a);
  }
  get collabTemplate() {
    return `systems/eunos-blades/templates/roll/roll-collab-resistance${game.user.isGM ? "-gm" : ""}.hbs`;
  }
  get chatTemplate() {
    return "systems/eunos-blades/templates/chat/roll-result/resistance.hbs";
  }
  get stressCost() {
    if (!this.isResolved)
      return 0;
    const t = [...this.finalDieVals];
    return this.isCritical ? -1 : 6 - (t.shift() ?? 0);
  }
  get rollResult() {
    return this.isResolved ? this.stressCost : !1;
  }
  async resolveRollResult() {
    this.rollPrimaryDoc instanceof M && this.stressCost !== 0 && this.rollPrimaryDoc.adjustStress(this.stressCost);
  }
}
class $a extends ks {
  get chatTemplate() {
    return "systems/eunos-blades/templates/chat/components/inline-resistance.hbs";
  }
}
class bt extends Fe {
  static ApplySchemaDefaults(t) {
    if (!(h.isInt(t.rollTrait) || h.lCase(t.rollTrait) in { ...Ae, ...re, ...m }))
      throw new Error(`[PrepareFortuneRoll()] Bad RollTrait for Fortune Roll: ${t.rollTrait}`);
    return t;
  }
  /**
   * Asynchronously creates a new instance of this subclass of `BladesRoll`.
   *
   * Overrides the `New` static method from `BladesRoll`, applying subclass-specific configurations
   * to the instance creation process. It ensures that the returned instance is correctly typed
   * and configured for this subclass.
   *
   * @param {BladesRoll.Config} config The configuration object for creating a new roll instance,
   * extended with any subclass-specific configurations or requirements.
   *
   * @returns {Promise<InstanceType<this>>} A promise that resolves to an instance of this subclass.
   *
   * @see {@link BladesRoll.New} for the base method's functionality and the generic creation process
   * for roll instances.
   */
  static async New(t) {
    const e = this.BuildLinkConfig(t), a = {
      ...t,
      ...e
    };
    return await super.New(a);
  }
}
class Ts extends Fe {
  static ApplySchemaDefaults(t) {
    var i;
    const e = R.GetDoc((i = t.rollPrimaryData) == null ? void 0 : i.rollPrimaryID);
    if (!e || !M.IsType(e))
      throw new Error("[BladesRoll.PrepareIndulgeViceRollConfig] RollPrimary must be a PC for Indulge Vice rolls.");
    const { attributes: a } = e, r = Math.min(...Object.values(a));
    return t.rollTrait = h.sample(
      Object.values(re).filter((o) => a[o] === r)
    )[0], t.rollDowntimeAction = P.IndulgeVice, t;
  }
  /**
   * Asynchronously creates a new instance of this subclass of `BladesRoll`.
   *
   * Overrides the `New` static method from `BladesRoll`, applying subclass-specific configurations
   * to the instance creation process. It ensures that the returned instance is correctly typed
   * and configured for this subclass.
   *
   * @param {BladesRoll.Config} config The configuration object for creating a new roll instance,
   * extended with any subclass-specific configurations or requirements.
   *
   * @returns {Promise<InstanceType<this>>} A promise that resolves to an instance of this subclass.
   *
   * @see {@link BladesRoll.New} for the base method's functionality and the generic creation process
   * for roll instances.
   */
  static async New(t) {
    const e = this.BuildLinkConfig(t), a = {
      ...t,
      ...e
    };
    return await super.New(a);
  }
  get collabTemplate() {
    return `systems/eunos-blades/templates/roll/roll-collab-indulgevice${game.user.isGM ? "-gm" : ""}.hbs`;
  }
  get chatTemplate() {
    return "systems/eunos-blades/templates/chat/roll-result/indulgevice.hbs";
  }
  get rollResult() {
    return this.isResolved ? this.highestDieVal : !1;
  }
  async resolveRollResult() {
    M.IsType(this.rollPrimaryDoc) && this.rollPrimaryDoc.indulgeStress(this.highestDieVal);
  }
}
class Ra extends bt {
  static get DefaultRollModSchemaSet() {
    return [
      {
        key: "BoldPlan-positive-roll",
        name: "Bold Plan",
        section: C.roll,
        base_status: T.ToggledOff,
        posNeg: "positive",
        modType: F.general,
        value: 1,
        effectKeys: [],
        tooltip: "<h1></h1><p></p>"
      },
      {
        key: "ComplexPlan-negative-roll",
        name: "Complex Plan",
        section: C.roll,
        base_status: T.ToggledOff,
        posNeg: "negative",
        modType: F.general,
        value: 1,
        effectKeys: [],
        tooltip: "<h1></h1><p></p>"
      },
      {
        key: "ExploitWeakness-positive-roll",
        name: "Exploiting a Weakness",
        section: C.roll,
        base_status: T.ToggledOff,
        posNeg: "positive",
        modType: F.general,
        value: 1,
        effectKeys: [],
        tooltip: "<h1></h1><p></p>"
      },
      {
        key: "WellDefended-negative-roll",
        name: "Well-Defended",
        section: C.roll,
        base_status: T.ToggledOff,
        posNeg: "negative",
        modType: F.general,
        value: 1,
        effectKeys: [],
        tooltip: "<h1></h1><p></p>"
      },
      {
        key: "HelpFromFriend-positive-roll",
        name: "Help From a Friend",
        section: C.position,
        base_status: T.ToggledOff,
        posNeg: "positive",
        modType: F.general,
        value: 1,
        effectKeys: [],
        tooltip: "<h1>Help From a Friend</h1><p>Add <strong>+1d</strong> if you enlist the help of a friend or contact.</p>"
      },
      {
        key: "EnemyInterference-negative-roll",
        name: "Enemy Interference",
        section: C.roll,
        base_status: T.ToggledOff,
        posNeg: "negative",
        modType: F.general,
        value: 1,
        effectKeys: [],
        tooltip: "<h1></h1><p></p>"
      }
    ];
  }
  get chatTemplate() {
    return "systems/eunos-blades/templates/chat/roll-result/fortune-engagement.hbs";
  }
}
class Fa extends bt {
  get chatTemplate() {
    return "systems/eunos-blades/templates/chat/roll-result/fortune-incarceration.hbs";
  }
}
const Ie = Fe;
class Ss extends ChatMessage {
  static Initialize() {
    return Hooks.on("renderChatMessage", (t, e) => {
      Ue(e);
      const { rollData: a } = t.flagData;
      a && Se.ApplyChatListeners(t), e.addClass("display-ok");
    }), loadTemplates([
      "systems/eunos-blades/templates/chat/roll-result/action.hbs",
      "systems/eunos-blades/templates/chat/roll-result/action-clock.hbs",
      "systems/eunos-blades/templates/chat/roll-result/action-acquireasset.hbs",
      "systems/eunos-blades/templates/chat/roll-result/action-reduceheat.hbs",
      "systems/eunos-blades/templates/chat/roll-result/action-clock-recover.hbs",
      "systems/eunos-blades/templates/chat/roll-result/action-gatherinfo.hbs",
      "systems/eunos-blades/templates/chat/roll-result/fortune.hbs",
      "systems/eunos-blades/templates/chat/roll-result/fortune-clock.hbs",
      "systems/eunos-blades/templates/chat/roll-result/fortune-gatherinfo.hbs",
      "systems/eunos-blades/templates/chat/roll-result/fortune-incarceration.hbs",
      "systems/eunos-blades/templates/chat/roll-result/fortune-engagement.hbs",
      "systems/eunos-blades/templates/chat/roll-result/indulgevice.hbs",
      "systems/eunos-blades/templates/chat/roll-result/resistance.hbs",
      "systems/eunos-blades/templates/chat/components/inline-resistance.hbs",
      "systems/eunos-blades/templates/chat/components/die.hbs"
    ]);
  }
  // static async ConstructRollOutput(rollInst: BladesRoll): Promise<BladesChat> {
  //   const rollData = {
  //     ...rollInst.data,
  //     rollTraitVerb: rollInst.rollTraitVerb ?? "",
  //     rollTraitPastVerb: rollInst.rollTraitPastVerb ?? rollInst.rollTraitVerb ?? ""
  //   };
  //   return await BladesChat.create({
  //     speaker: rollInst.getSpeaker(BladesChat.getSpeaker()),
  //     content: await renderTemplate(rollInst.template, rollData),
  //     type: CONST.CHAT_MESSAGE_TYPES.ROLL,
  //     flags: {
  //       "eunos-blades": {
  //         template: rollInst.template,
  //         rollData
  //       }
  //     }
  //   }) as BladesChat;
  // }
  static IsNewestRollResult(t) {
    const e = $("#chat-log .chat-message .blades-roll:not(.inline-roll)").last().attr("id");
    return typeof e == "string" && e === t.id;
  }
  get flagData() {
    return this.flags["eunos-blades"];
  }
  get rollData() {
    return this.flagData.rollData;
  }
  async setFlagVal(t, e, a) {
    return await this.setFlag(v.SYSTEM_ID, `${t}.${e}`, a);
  }
  get allRollConsequences() {
    const t = {
      [ie.controlled]: {
        [G.critical]: {},
        [G.success]: {},
        [G.partial]: {},
        [G.fail]: {}
      },
      [ie.risky]: {
        [G.critical]: {},
        [G.success]: {},
        [G.partial]: {},
        [G.fail]: {}
      },
      [ie.desperate]: {
        [G.critical]: {},
        [G.success]: {},
        [G.partial]: {},
        [G.fail]: {}
      }
    }, { consequenceData: e } = this.flagData.rollData ?? {};
    return e && Object.entries(e).forEach(([a, r]) => {
      Object.entries(r).forEach(([i, o]) => {
        t[a][i] = Object.fromEntries(
          Object.entries(o).filter(([n, l]) => l.id).map(([n, l]) => [
            n,
            game.eunoblades.Consequences.get(l.id) ?? new Se(l)
          ])
        );
      });
    }), t;
  }
  get rollConsequences() {
    var i;
    if (!this.parentRoll)
      return [];
    const { rollPositionFinal: t, rollResult: e, consequenceData: a } = this.parentRoll.data;
    if (!t || !e || !a)
      return [];
    if (typeof e != "string" || ![G.partial, G.fail].includes(e))
      return [];
    const r = ((i = a == null ? void 0 : a[t]) == null ? void 0 : i[e]) ?? {};
    return Object.values(r).map((o) => game.eunoblades.Consequences.get(o.id) ?? new Se(o));
  }
  get elem$() {
    return $("#chat-log").find(`.chat-message[data-message-id="${this.id}"]`);
  }
  get elem() {
    return this.elem$[0];
  }
  get isRollResult() {
    return "rollData" in this.flagData;
  }
  get parentRoll() {
    if (!this.isRollResult)
      return;
    const { rollData: t } = this.flagData;
    if (t)
      return game.eunoblades.Rolls.get(t.id ?? "") ?? new Ie({
        ...t,
        isScopingById: !1
      });
  }
  get roll$() {
    return this.parentRoll ? this.elem$.find(`#${this.parentRoll.id}`) : void 0;
  }
  async regenerateFromFlags() {
    this.isRollResult && await this.update({ content: await renderTemplate(this.flagData.template, this) });
  }
  async render(t) {
    await super.render(t), await this.activateListeners();
  }
  async activateListeners() {
    if (!this.elem$) {
      eLog.error("BladesChat", `No BladesChat.elem found for id ${this.id}.`);
      return;
    }
    Ue(this.elem$), Se.ApplyChatListeners(this), this.parentRoll && (this.elem$.addClass(`${this.parentRoll.rollType.toLowerCase()}-roll`), this.parentRoll.rollType === _.Action && this.rollConsequences.some((t) => !t.isAccepted) ? this.elem$.addClass("unresolved-action-roll") : this.elem$.removeClass("unresolved-action-roll"), Ss.IsNewestRollResult(this.parentRoll) ? ($("#chat-log .chat-message").removeClass("active-chat-roll"), this.elem$.addClass("active-chat-roll")) : this.elem$.removeClass("active-chat-roll")), h.gsap.to(this.elem$, { autoAlpha: 1, duration: 0.15, ease: "none" });
  }
}
const Ne = Ss, qt = {
  fullName: "eLogger",
  aliases: ["dbLog"],
  stackTraceExclusions: {
    handlebars: [/scripts\/handlebars/]
    // From internal Handlebars module
  }
}, Na = {
  base: {
    background: v.Colors.BLACK,
    color: v.Colors.dGOLD,
    "font-family": "Pragmata Pro",
    padding: "0 25px",
    "margin-right": "25px"
  },
  log0: {
    background: v.Colors.dGOLD,
    color: v.Colors.dBLACK,
    "font-size": "16px"
  },
  log1: {
    background: v.Colors.dBLACK,
    color: v.Colors.bGOLD,
    "font-size": "16px"
  },
  log2: {
    background: v.Colors.dBLACK,
    color: v.Colors.dGOLD,
    "font-size": "16px"
  },
  log3: {
    "font-size": "14px"
  },
  log4: {
    "font-size": "12px"
  },
  log5: {
    background: v.Colors.dGREY,
    color: v.Colors.bGREY,
    "font-size": "10px"
  },
  display: {
    color: v.Colors.bGOLD,
    "font-family": "Kirsty",
    "font-size": "16px",
    "margin-left": "-100px",
    padding: "0 100px"
  },
  warn: {
    color: v.Colors.dBLACK,
    background: v.Colors.dGOLD,
    "font-weight": 500
  },
  error: {
    color: v.Colors.bRED,
    background: v.Colors.ddRED,
    "font-weight": 500
  },
  handlebars: {
    background: v.Colors.GREY,
    color: v.Colors.BLUE,
    "font-family": "Pragmata Pro",
    padding: "0",
    "margin-right": "25px"
  },
  stack: {
    color: v.Colors.GOLD,
    "font-weight": 100,
    "font-size": "10px",
    "font-family": "Pragmata Pro"
  }
}, { base: eo, ...to } = Na, Bs = Object.fromEntries(
  Object.entries(to).map(([s, t]) => [
    s,
    Object.entries({ ...eo, ...t }).map(([e, a]) => `${e}: ${a};`).join(" ")
  ])
), J = (s = "base", ...t) => {
  if (!(["error", "display"].includes(s) || CONFIG.debug.logging))
    return;
  const e = h.getLast(t);
  let a = typeof e == "number" && [0, 1, 2, 3, 4, 5].includes(e) ? t.pop() : 3, r = !1;
  s === "checkLog" && (r = t.shift(), s = `log${a}`);
  const [i, ...o] = t;
  if (r) {
    const d = (h.getSetting("blacklist") ?? "").split(/,/).map((y) => new RegExp(`\\b${y.trim()}\\b`, "igu")), p = (h.getSetting("whitelist") ?? "").split(/,/).map((y) => new RegExp(`\\b${y.trim()}\\b`, "igu")), u = d.some((y) => y.test(r)), f = p.some((y) => y.test(r));
    u && !f && (a = Math.max(4, Math.min(5, a + 2))), f && !u && (a = Math.min(3, Math.max(1, a - 2)));
  }
  if ((h.getSetting("debug") ?? 5) < a)
    return;
  s === "log" && (s = `${s}${a}`);
  const n = s === "display" ? null : c(qt.stackTraceExclusions[s] ?? []);
  let l;
  n ? l = console.groupCollapsed : o.length <= 1 ? l = console.log : l = console.group, o.length === 0 ? typeof i == "string" ? l(`%c${i}`, Bs[s]) : l("%o", i) : (l(`%c${i}${typeof o[0] == "string" ? "" : " %o"}`, Bs[s], o.shift()), o.forEach((d) => {
    typeof d == "string" ? console.log(d) : console.log("%o", d);
  })), n && (console.group("%cSTACK TRACE", `color: ${v.Colors.dGOLD}; font-family: "Pragmata Pro"; font-size: 12px; background: ${v.Colors.BLACK}; font-weight: bold; padding: 0 10px;`), console.log(`%c${n}`, Object.entries(Na.stack).map(([d, p]) => `${d}: ${p};`).join(" ")), console.groupEnd()), console.groupEnd();
  function c(d = []) {
    return d.push(new RegExp(`at (getStackTrace|${qt.fullName}|${qt.aliases.map(String).join("|")}|Object\\.(log|display|hbsLog|error))`), /^Error/), (new Error().stack ?? "").split(/\n/).map((p) => p.trim()).filter((p) => !d.some((u) => u.test(p))).join(`
`);
  }
}, Ha = {
  display: (...s) => J("display", ...s),
  log0: (...s) => J("log", ...s, 0),
  log1: (...s) => J("log", ...s, 1),
  log2: (...s) => J("log", ...s, 2),
  log: (...s) => J("log", ...s, 3),
  log3: (...s) => J("log", ...s, 3),
  log4: (...s) => J("log", ...s, 4),
  log5: (...s) => J("log", ...s, 5),
  checkLog0: (...s) => J("checkLog", ...s, 0),
  checkLog1: (...s) => J("checkLog", ...s, 1),
  checkLog2: (...s) => J("checkLog", ...s, 2),
  checkLog: (...s) => J("checkLog", ...s, 3),
  checkLog3: (...s) => J("checkLog", ...s, 3),
  checkLog4: (...s) => J("checkLog", ...s, 4),
  checkLog5: (...s) => J("checkLog", ...s, 5),
  warn: (...s) => J("warn", ...s),
  error: (...s) => J("error", ...s),
  hbsLog: (...s) => J("handlebars", ...s)
};
class Ba extends Scene {
  async registerClockKey(t) {
    this.update({ [`clockKeys.${t.id}`]: !0 });
  }
  async unregisterClockKey(t) {
    typeof t == "string" ? this.update({ [`clockKeys.-=${t}`]: null }) : this.update({ [`clockKeys.-=${t.id}`]: null });
  }
}
var Ve, Be, $e, qe, Re, ze, Ye, pt;
class so {
  constructor(t, e, a = "gpt-4-1106-preview", { isUsingRetrieval: r, functionTools: i, file_ids: o, metadata: n } = {}) {
    fe(this, Ve, void 0);
    fe(this, Be, void 0);
    fe(this, $e, void 0);
    fe(this, qe, void 0);
    fe(this, Re, void 0);
    fe(this, ze, void 0);
    fe(this, Ye, void 0);
    fe(this, pt, void 0);
    X(this, Be, ""), X(this, $e, ""), X(this, qe, e ?? ""), X(this, Re, []), X(this, ze, a), X(this, Ye, o ?? []), X(this, pt, n ?? {});
    const l = h.getSetting("openAPIKey");
    if (!l)
      throw new Error("API Key required in Settings to use AI features.");
    X(this, Ve, l), e ? (X(this, $e, t), r && be(this, Re).push({ type: "retrieval" }), i && i.length && be(this, Re).push(...i), this.createAssistant()) : (X(this, Be, t), this.retrieveAssistant());
  }
  get name() {
    return be(this, $e);
  }
  async createAssistant() {
    const t = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${be(this, Ve)}`,
        "OpenAI-Beta": "assistants=v1"
      },
      body: JSON.stringify({
        name: be(this, $e),
        instructions: be(this, qe),
        tools: be(this, Re),
        model: be(this, ze),
        file_ids: be(this, Ye)
      })
    };
    eLog.checkLog3("BladesAssistant", "Fetch Request", t);
    const e = await fetch(
      "https://api.openai.com/v1/assistants",
      t
    );
    if (!e.ok)
      throw console.log("Failed AI Request:", JSON.parse(t.body)), new Error(`OpenAI API request failed with status ${e.status}`);
    const a = await e.json();
    t.body = JSON.parse(t.body), eLog.checkLog3("BladesAI", "AI Query", { prompt: t, response: a }), X(this, Be, a.id);
  }
  async retrieveAssistant() {
    const t = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${be(this, Ve)}`,
        "OpenAI-Beta": "assistants=v1"
      }
    }, e = await fetch(
      `https://api.openai.com/v1/assistants/${be(this, Be)}`,
      t
    );
    if (!e.ok)
      throw new Error(`OpenAI API request failed with status ${e.status}`);
    const a = await e.json();
    eLog.checkLog3("BladesAI", "AI Query", { prompt: t, response: a }), X(this, $e, a.name), X(this, qe, a.instructions), X(this, Re, a.tools), X(this, ze, a.model), X(this, Ye, a.file_ids), X(this, pt, a.metadata);
  }
}
Ve = new WeakMap(), Be = new WeakMap(), $e = new WeakMap(), qe = new WeakMap(), Re = new WeakMap(), ze = new WeakMap(), Ye = new WeakMap(), pt = new WeakMap();
class ao {
  /**
   * AI class constructor
   * @param {BladesAI.Config} [config] Configuration settings for the API
   */
  constructor(t) {
    w(this, "apiKey");
    w(this, "model");
    w(this, "temperature", 0.5);
    w(this, "frequency_penalty", 0.8);
    w(this, "presence_penalty", 0.8);
    w(this, "systemMessage");
    w(this, "examplePrompts");
    w(this, "_initialMessages", []);
    w(this, "prompts", {});
    w(this, "responses", {});
    const e = h.getSetting("openAPIKey");
    if (!e)
      throw new Error("You must configure your OpenAI API Key in Settings to use AI features.");
    this.model = h.getSetting("openAPIModelLevel"), typeof this.model != "number" && (eLog.error("BladesAI", "Set base AI quality in settings. Defaulting to lowest."), this.model = 0), this.apiKey = e, this.systemMessage = t.systemMessage, this.examplePrompts = t.examplePrompts, this.temperature = t.temperature ?? this.temperature, this.frequency_penalty = t.frequency_penalty ?? this.frequency_penalty, this.presence_penalty = t.presence_penalty ?? this.presence_penalty;
  }
  static async GetModels(t = !1) {
    const e = h.getSetting("openAPIKey");
    if (!e)
      throw new Error("You must configure your OpenAI API Key in Settings to use AI features.");
    const a = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${e}`
      }
    }, r = await fetch(
      "https://api.openai.com/v1/models",
      a
    );
    if (!r.ok)
      throw new Error(`OpenAI API request failed with status ${r.status}`);
    const i = await r.json(), o = Object.fromEntries(i.map(({ id: n, ...l }) => [n, l]));
    t && eLog.checkLog3("BladesAI", "Available Models", { dataList: o });
  }
  get initialMessages() {
    if (this._initialMessages.length === 0) {
      this._initialMessages.push({
        role: "system",
        content: this.systemMessage
      });
      for (const { human: t, ai: e } of this.examplePrompts)
        this._initialMessages.push({
          role: "user",
          content: t
        }), this._initialMessages.push({
          role: "assistant",
          content: e
        });
    }
    return this._initialMessages;
  }
  getResponse(t) {
    return this.responses[t] ?? null;
  }
  hasQueried(t) {
    return this.prompts[t] !== void 0;
  }
  /**
   * Query OpenAI API
   * @param {string} queryID A label for later retrieval of the query data
   * @param {string} prompt The prompt to send to the API
   * @param {number} [modelMod] Optional modifier to the base model level.
   *                            If provided, the final model quality will be adjusted by this number.
   * @param {boolean} [extendedContext=false] Optional flag to indicate whether to use extended context models.
   *                            If true, extended context models are used; otherwise, base context models are used.
   * @returns {Promise<Response>} The API response
   */
  async query(t, e, a, r = !1) {
    if (!e)
      return;
    this.responses[t] = null;
    const i = typeof a == "number" ? h.clampNum(this.model + a, [0, 2]) : this.model, o = r ? v.AI_MODELS.extendedContext[i] : v.AI_MODELS.baseContext[i], n = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: o,
        temperature: this.temperature,
        frequency_penalty: this.frequency_penalty,
        presence_penalty: this.presence_penalty,
        messages: [
          ...this.initialMessages,
          {
            role: "user",
            content: e
          }
        ]
      })
    }, l = await fetch(
      "https://api.openai.com/v1/chat/completions",
      n
    );
    if (!l.ok)
      throw console.log("Failed AI Request:", JSON.parse(n.body)), new Error(`OpenAI API request failed with status ${l.status}`);
    const c = await l.json();
    return n.body = JSON.parse(n.body), eLog.checkLog3("BladesAI", "AI Query", { prompt: n, response: c }), this.responses[t] = c.choices[0].message.content, this.responses[t];
  }
}
const ro = {
  GeneralContentGenerator: {
    systemMessage: `You will act as a creative content generator for a game of Blades In The Dark set in the city of Duskvol. You will be prompted with some element of the game world (a location, a character, an event, a faction, a dilemma) in the form of a JSON object. Your job is to analyze the JSON object and replace any values that equal "<GEN>" with original content of your own creation. Original content must meet these requirements:  (A) it should align with and be consistent with the provided contextual information, as well as your broader understanding of the game's themes. (B) It should be presented in a format that matches (in length and in style) other entries for that particular value, examples of which will also be provided. (C) It should be creative, interesting, and daring: Be bold with your creativity. Specific context for this prompt is as follows:`,
    examplePrompts: []
  },
  NPCGenerator: {
    systemMessage: `You will play the role of a "creative content generator" for random NPCs generated for the Blades In The Dark roleplaying system. When prompted with a description of a subject (an NPC, a category of NPCs, a faction, or a group of NPCs), you will respond with a pipe-delimited list of sixteen items, divided into four categories, prefacing each category with the associated header in square brackets: [5 KEYWORDS] Five one-word keywords describing the subject. [5 PHRASES] Five evocative phrases that could be used by a GM directly when narrating the subject during play. These should be extremely well-worded, very original, and packed with drama and evocative imagery. Be bold with your responses here. [3 QUIRKS/MOTIFFS] Three phrases describing potential quirks or motiffs that a GM could employ in a scene involving the subject. [3 PLOT HOOKS] Three plot hooks that could directly and specifically involve one or more of the PCs. The PCs are: (1) Alistair, full name Lord Alistair Bram Chesterfield, the crew's boss, a Spider with connections among the nobility; (2) High-Flyer, a former noble himself, now serving as the crew's Slide; (3) Jax, a stoic and laconic Hound with ties to the disenfranchised of Duskvol; (4) Ollie, the youngest of the crew at barely nineteen, a prodigy Leech with knowledge of alchemy and spark-craft, who grew up as an orphan in Duskvol's underground; (5) Wraith, the mysterious Lurk of the crew, who never speaks for reasons unknown; and (6) Spencer, the bookish Whisper of the crew, who harbors a secret fascination for demons and all things related to them.`,
    examplePrompts: [
      {
        human: "The Billhooks, a hack-and-slash gang of toughened thugs. The Billhooks have a bloody reputation, often leaving the butchered corpses of their victims strewn about in a grisly display. Many wonder why the Bluecoats turn a blind eye to their savagery. Based out of their butcher shop headquarters, they are led by Tarvul, who is currently serving life in prison.",
        ai: "[5 KEYWORDS]brutal|unrelenting|savage|fierce|unhinged|[5 PHRASES]blood-flecked, yellowed teeth|eyes that want to flay your skin from your bones|crooked leer like he's looking at his Judas goat|reek like a charnel house|gobbets of a meaty lunch still in his beard|[3 QUIRKS/MOTIFFS]always ready to wreck, vandalize or destroy something|relish in instilling fear in others|have a twisted sense of loyalty|[3 PLOT HOOKS]Tarvul hires the crew to start a war among his most promising underlings, intending to make whoever survives his successor|the Billhooks kidnap a member of High-Flyer's noble family|a Demon of Shadows promises Spencer the answer to three questions, in exchange for an artifact recently stolen by the Billhooks"
      },
      {
        human: "The hooded proprietor of a half-flooded grotto tavern near the docks. 'Strange passageways lead to stranger chambers beyond.' Vice Purveyor - Weird.",
        ai: "[5 KEYWORDS]mysterious|cryptic|enigmatic|peculiar|shrouded|[5 PHRASES]a voice like wet burlap sliding over gravel|the flicker of torchlight dancing on the flooded floor|the scent of brackish water and old spices|a smile that hinted at a thousand secrets hidden in the shadows|hands gnarled as driftwood, eternally damp|[3 QUIRKS/MOTIFFS]has an uncanny knack for knowing patrons' darkest secrets without them telling him|never seems to sleep or leave the tavern, always there no matter what time you visit|always seen with a strange, luminescent creature that lives in one of the flooded chambers behind the bar|[3 PLOT HOOKS]Alistair hears rumors that this tavern is actually a front for a powerful secret society - perhaps they could be useful allies...or dangerous enemies.|The proprietor offers Ollie a rare alchemical ingredient - but it's not for sale. He'll only trade it for something equally valuable.|Wraith overhears whispers about a hidden chamber beneath the tavern where unimaginable treasures are kept."
      },
      {
        human: "Setarra, a Demon. Patient, Defiant, Ruthless, Cold",
        ai: "[5 KEYWORDS]shadowy|sinister|unfathomable|enigmatic|tempting|[5 PHRASES]whispers that crawl under your skin|always watching, always plotting|in tones of silk and venom|intoxicating presence that draws you closer, despite your instincts urging you to run|eyes like black holes, swallowing all light around them|[3 QUIRKS/MOTIFFS]a disorienting mist clings to her form, obscuring her true shape|casually discusses the devastating acts of capricious revenge she has taken on those who crossed her|never forgets a slight or betrayal, no matter how small or insignificant it may seem at the time|[3 PLOT HOOKS]seeks revenge against Alistair for meddling in her affairs years ago|makes Ollie an offer he can't refuse: unlimited access to forbidden alchemical knowledge in exchange for a single favor, to be called in at some future time|tempts Spencer with forbidden knowledge about demons, promising answers to all their questions if they perform a dangerous ritual"
      }
      /*
      "brutish,merciless,terrifying,savage,loyal,
      bloody tools,hulking figures,blood-soaked alleys,grimy aprons,grisly displays,
      never clean their tools,relishes the terror they inspire,occasional laughter among them,
      recruiting a PC to perform a job for them from prison,
      the gang blames one of the PCs for Tarvul's imprisonment and they're out for revenge" */
    ]
  },
  ConsequenceAdjuster: {
    systemMessage: `You will act as a "Setback Adjuster" for a game of Blades In The Dark.  You will be prompted with a short phrase describing an injury, lasting consequence or other setback. Your job is to respond with a pipe-delimited list of three possible alternative consequences that are less severe by one level, using the following scale as a rough guide: Level 1 = Lesser (e.g. 'Battered', 'Drained', 'Distracted', 'Scared', 'Confused'), Level 2 = Moderate (e.g. 'Exhausted', 'Deep Cut to Arm', 'Concussion', 'Panicked', 'Seduced'), Level 3 = Severe (e.g. 'Impaled', 'Broken Leg', 'Shot In Chest', 'Badly Burned', 'Terrified'), Level 4 = Fatal or Ruinous (e.g. 'Impaled Through Heart', 'Electrocuted', 'Headquarters Burned to the Ground'). So, if you determine that the consequence described in the prompt is severity level 3, you should respond with three narratively similar consequences that are severity level 2.  Your three suggestions should be different from each other, but they should all logically follow from the initial harm described: You should not introduce new facts or make assumptions that are not indicated in the initial prompt. The consequences you suggest should always describe a NEGATIVE setback or complication, just one that is less severe than the one described in the prompt.`,
    examplePrompts: [
      { human: "Shattered Right Leg", ai: "Fractured Right Ankle|Dislocated Knee|Broken Foot" },
      { human: "Soul Destroyed", ai: "Fully Corrupted|Lost In Darkness|Spirit Broken" },
      { human: "Humiliated", ai: "Embarrassed|Momentarily Off-Balance|Enraged" },
      { human: "She Escapes!", ai: "She Spots a Means of Escape|She Puts More Distance Between You|She Stops to Gloat" },
      { human: "The fire spreads to the hostages.", ai: "The fire approaches the hostages.|The hostages must be evacuated.|The fire billows choking black smoke." }
    ]
  }
};
class Nt extends Xe {
  // static Get() { return game.eunoblades.Tracker as BladesGMTracker; }
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["eunos-blades", "sheet", "item", "gm-tracker"],
      template: "systems/eunos-blades/templates/items/gm_tracker-sheet.hbs",
      width: 700,
      height: 970
    });
  }
  static async Initialize() {
    return Items.registerSheet("blades", Nt, { types: ["gm_tracker"], makeDefault: !0 }), loadTemplates([
      "systems/eunos-blades/templates/items/gm_tracker-sheet.hbs"
    ]);
  }
  async activateListeners(t) {
    super.activateListeners(t);
  }
  async _onSubmit(t, e = {}) {
    const a = this.item.system.phase, r = await super._onSubmit(t, e), i = this.item.system.phase;
    let o = !0;
    if (a !== i) {
      switch (a) {
        case N.CharGen:
          break;
        case N.Freeplay:
          break;
        case N.Score: {
          o = !1, game.actors.filter((n) => I.IsType(n, b.pc)).forEach((n) => n.clearLoadout());
          break;
        }
        case N.Downtime:
          break;
      }
      switch (i) {
        case N.CharGen:
          break;
        case N.Freeplay:
          break;
        case N.Score:
          break;
        case N.Downtime:
          break;
      }
    }
    return o && game.actors.filter((n) => n.type === b.pc).forEach((n) => {
      var l;
      return (l = n.sheet) == null ? void 0 : l.render();
    }), r;
  }
}
class Ht extends Xe {
  // static Get() { return game.eunoblades.ClockKeeper as BladesClockKeeper; }
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["eunos-blades", "sheet", "item", "clock-keeper"],
      template: "systems/eunos-blades/templates/items/clock_keeper-sheet.hbs",
      width: 700,
      height: 970,
      // submitOnChange: false,
      tabs: [{ navSelector: ".nav-tabs", contentSelector: ".tab-content", initial: "scene-keys" }]
    });
  }
  static async Initialize() {
    return Items.registerSheet("blades", Ht, { types: ["clock_keeper"], makeDefault: !0 }), loadTemplates([
      "systems/eunos-blades/templates/items/clock_keeper-sheet.hbs"
    ]);
  }
  getData() {
    const t = super.getData(), e = {
      currentScene: game.scenes.current.id,
      targetScene: this.item.targetSceneID,
      sceneOptions: Array.from(game.scenes),
      sceneKeys: this.item.getSceneKeys(this.item.system.targetScene ?? game.scenes.current.id),
      pcsWithProjects: M.All.filter((a) => a.projects.length > 0),
      factions: Array.from(et.All)
    };
    return { ...t, ...e };
  }
  addKey(t) {
    t.preventDefault(), this.item.addClockKey();
  }
  deleteKey(t) {
    t.preventDefault();
    const e = t.currentTarget.dataset.id;
    e && this.item.deleteClockKey(e);
  }
  setSelectColor(t, e) {
    switch (e ?? (e = t.data("value")), e) {
      case me.yellow: {
        h.gsap.set(t, {
          color: "var(--blades-black)",
          background: "var(--blades-gold-bright)",
          textShadow: "none"
        });
        break;
      }
      case me.red: {
        h.gsap.set(t, {
          color: "var(--blades-white)",
          background: "var(--blades-red)"
        });
        break;
      }
      case me.cyan: {
        h.gsap.set(t, {
          color: "var(--blades-black)",
          background: "var(--blades-blue-bright)",
          textShadow: "none"
        });
        break;
      }
      case me.white: {
        h.gsap.set(t, {
          color: "var(--blades-black)",
          background: "var(--blades-white)",
          textShadow: "none"
        });
        break;
      }
    }
  }
  async activateListeners(t) {
    await super.activateListeners(t), t.find('[data-action="create-clock-key"').on({
      click: async (o) => {
        o.preventDefault(), await this.item.addClockKey();
      }
    });
    function e(o) {
      const n = $(o.currentTarget).data("keyId") || $(o.currentTarget).closest(".control-flipper").data("clockKeyId");
      if (!n)
        throw new Error("No id found on element");
      const l = game.eunoblades.ClockKeys.get(n);
      if (!l)
        throw new Error(`Clock key with id ${n} not found`);
      return l;
    }
    function a(o) {
      const n = e(o), l = $(o.currentTarget).data("clockId") || $(o.currentTarget).closest(".control-flipper").data("clockId");
      if (!l)
        throw new Error("No clockID found on element");
      const c = n.getClockByID(l);
      if (!c)
        throw new Error(`Clock with id ${l} not found`);
      return [n, c];
    }
    const r = t.find(".clock-key-control-flipper");
    r.find('[data-action="toggle-name-visibility"]').each((o, n) => {
      const l = $(n), c = l.closest(".clock-key-control-flipper");
      l.on({
        click: async (d) => {
          d.preventDefault();
          const p = e(d), u = !p.isNameVisible;
          p.updateTarget("isNameVisible", u), p.isInScene() && p.isVisible && (u ? p.fadeInName_SocketCall(W.overlay) : p.fadeOutName_SocketCall(W.overlay)), c.find('[data-action="toggle-name-visibility"] i').toggleClass("fa-signature").toggleClass("fa-signature-slash").toggleClass("fa-solid").toggleClass("fa-regular");
        }
      });
    }), r.find('[data-action="toggle-spotlight"]').each((o, n) => {
      const l = $(n), c = l.closest(".clock-key-control-flipper");
      l.on({
        click: async (d) => {
          d.preventDefault();
          const p = e(d), u = !p.isSpotlit;
          p.updateTarget("isSpotlit", u), p.isInScene() && p.isVisible, c.find('[data-action="toggle-spotlight"] i').toggleClass("fa-message").toggleClass("fa-message-slash").toggleClass("fa-solid").toggleClass("fa-regular");
        }
      });
    }), r.find('[data-action="pull-clock-key"]').each((o, n) => {
      const l = $(n), c = l.closest(".clock-key-control-flipper");
      l.on({
        click: (d) => {
          d.preventDefault(), h.gsap.effects.keyControlPanelFlip(c, { angle: 180 });
          const p = e(d);
          p.updateTarget("isVisible", !1), game.eunoblades.Director.pullKey_SocketCall(p.id);
        }
      });
    }), r.find('[data-action="drop-clock-key"]').each((o, n) => {
      const l = $(n), c = l.closest(".clock-key-control-flipper");
      l.on({
        click: (d) => {
          d.preventDefault(), h.gsap.effects.keyControlPanelFlip(c, { angle: 0 });
          const p = e(d);
          p.updateTarget("isVisible", !0), game.eunoblades.Director.renderClockKey_SocketCall(p.id);
        }
      });
    }), r.find('[data-action="spawn-position-dragger"]').on({
      click: async (o) => {
        o.preventDefault(), e(o).spawnPositionDragger(game.eunoblades.Director.clockKeySection$);
      }
    }), r.find('[data-action="delete-clock-key"]').on({
      click: async (o) => {
        o.preventDefault(), await e(o).delete(game.eunoblades.ClockKeys);
      }
    }), r.find('[data-action="add-key-to-scene"]').on({
      click: async (o) => {
        o.preventDefault(), await e(o).addToScene(this.document.targetSceneID);
      }
    }), r.find('[data-action="remove-key-from-scene"]').on({
      click: async (o) => {
        o.preventDefault(), await e(o).removeFromScene(this.document.targetSceneID);
      }
    }), r.find('[data-action="add-clock-to-key"]').on({
      click: async (o) => {
        o.preventDefault(), await e(o).addClock();
      }
    }), r.find("input.clock-key-input:not([readonly])").on({
      change: async (o) => {
        o.preventDefault();
        const n = $(o.currentTarget), l = n.val();
        typeof l == "string" && (e(o).updateTarget(n.data("targetProp"), l), r.find("input.clock-key-input").val(l));
      }
    });
    const i = t.find(".clock-control-flipper");
    i.find('[data-action="toggle-visible"]').each((o, n) => {
      const l = $(n), c = l.closest(".clock-control-flipper");
      l.on({
        click: async (d) => {
          d.preventDefault();
          const [p, u] = a(d), f = !u.isVisible;
          u.updateTarget("isVisible", f), p.isInScene() && p.isVisible && (f ? u.reveal_SocketCall(W.overlay) : u.hide_SocketCall(W.overlay)), c.find('[data-action="toggle-visible"] i').toggleClass("fa-eye").toggleClass("fa-eye-slash").toggleClass("fa-solid").toggleClass("fa-regular");
        }
      });
    }), i.find('[data-action="toggle-active"]').each((o, n) => {
      const l = $(n), c = l.closest(".clock-control-flipper");
      l.on({
        click: async (d) => {
          d.preventDefault();
          const [p, u] = a(d), f = !u.isActive;
          u.updateTarget("isActive", f), u.parentKey.isInScene() && u.parentKey.isVisible && u.isVisible && (f ? u.activate_SocketCall(W.overlay) : u.deactivate_SocketCall(W.overlay)), c.find('[data-action="toggle-active"] i').toggleClass("fa-bolt").toggleClass("fa-bolt-slash").toggleClass("fa-solid").toggleClass("fa-regular");
        }
      });
    }), i.find('[data-action="toggle-name-visibility"]').each((o, n) => {
      const l = $(n), c = l.closest(".clock-control-flipper");
      l.on({
        click: async (d) => {
          d.preventDefault();
          const p = a(d)[1], u = !p.isNameVisible;
          p.updateTarget("isNameVisible", u), p.parentKey.isInScene() && p.parentKey.isVisible && p.isVisible && (u ? p.fadeInClockName_SocketCall(W.overlay) : p.fadeOutClockName_SocketCall(W.overlay)), c.find('[data-action="toggle-name-visibility"] i').toggleClass("fa-signature").toggleClass("fa-signature-slash").toggleClass("fa-solid").toggleClass("fa-regular");
        }
      });
    }), i.find('[data-action="toggle-highlight"]').each((o, n) => {
      const l = $(n), c = l.closest(".clock-control-flipper");
      l.on({
        click: async (d) => {
          d.preventDefault();
          const [p, u] = a(d), f = !u.isHighlighted;
          u.updateTarget("isHighlighted", f), u.parentKey.isInScene() && u.parentKey.isVisible && u.isVisible && (f ? u.highlight_SocketCall(W.overlay) : u.unhighlight_SocketCall(W.overlay)), c.find('[data-action="toggle-highlight"] i').toggleClass("fa-lightbulb").toggleClass("fa-lightbulb-slash").toggleClass("fa-solid").toggleClass("fa-regular");
        }
      });
    }), i.find('[data-action="change-segments"]').each((o, n) => {
      const l = $(n), c = l.closest(".clock-control-flipper");
      l.on({
        click: async (d) => {
          d.preventDefault();
          const [p, u] = a(d), f = h.pInt($(d.currentTarget).data("value")), y = h.gsap.utils.clamp(0, u.max, u.value + f);
          f > 0 ? u.fillSegments(f, !0) : u.clearSegments(Math.abs(f), !0), c.find("select.clock-select-value").val(y), u.changeSegments_SocketCall(W.overlay, u.value, y);
        }
      });
    }), i.find("select.clock-control-select").each((o, n) => {
      $(n).hasClass("clock-select-color");
    }).on({
      change: (o) => {
        o.preventDefault();
        const n = $(o.currentTarget), l = n.data("dtype") === "number" ? h.pInt(n.val()) : n.val(), c = n.data("targetProp");
        a(o)[1].updateTarget(c, l), c === "color" && typeof l == "string" && l in me && this.setSelectColor(n, l);
      }
    }), i.find("input.clock-input:not([readonly])").each((o, n) => {
      const l = $(n), c = l.closest(".clock-control-flipper");
      l.on({
        change: (d) => {
          d.preventDefault();
          const p = $(d.currentTarget), u = p.val();
          typeof u == "string" && (a(d)[1].updateTarget(p.data("targetProp"), u), c.find("input.clock-input").val(u));
        }
      });
    }), i.find('[data-action="delete-clock"]').on({
      click: async (o) => {
        o.preventDefault(), await a(o)[1].delete();
      }
    });
  }
}
class io {
  static async GetSampleSchemas(t = {}) {
    const e = t.user || "Alistair", a = t.pc || "Alistair", r = t.npc || "Setarra", i = t.faction || "the Bluecoats", o = game.users.getName(e);
    if (!o)
      throw new Error(`Sample user with name "${e}" not found.`);
    const n = game.actors.getName(a);
    if (!M.IsType(n))
      throw new Error(`Sample BladesPC with name "${a}" not found.`);
    const l = game.actors.getName(r);
    if (!Qe.IsType(l))
      throw new Error(`Sample BladesNPC with name "${r}" not found or is not a valid BladesNPC.`);
    const c = game.actors.getName(i);
    if (!et.IsType(c))
      throw new Error(`Sample BladesFaction with name "${i}" not found or is not a valid BladesFaction.`);
    return {
      BladesActionRoll_Schema: {
        rollType: _.Action,
        // rollSubType: RollSubType.GatherInfo,
        // rollPrompt: "Gathering Information",
        rollTrait: Ae.skirmish,
        // rollUserID: sampleUser.id,
        // rollDowntimeAction: DowntimeAction.AcquireAsset,
        // rollClockKey: U.getLast(game.eunoblades.ClockKeys.contents)?.id,
        rollPrimaryData: R.GetDataFromDoc(n),
        rollOppData: he.GetDataFromDoc(c),
        // rollParticipantData: {},
        // consequenceData: {},
        // resistanceData: {
        //   consequence: {}
        // },
        rollModsData: {},
        rollPositionInitial: ie.risky,
        rollEffectInitial: ee.standard,
        rollPosEffectTrade: !1,
        rollPhase: Me.Collaboration,
        GMBoosts: {},
        GMOppBoosts: {},
        GMOverrides: {},
        rollFactorToggles: {
          source: {},
          opposition: {}
        },
        userPermissions: {
          [o.id]: Q.Primary
        }
        // rollPositionFinal: Position.risky,
        // rollEffectFinal: Effect.standard,
        // rollResult: RollResult.success,
        // rollResultDelta: 0,
        // rollResultFinal: RollResult.success,
        // rollTraitVerb: "skirmishes",
        // rollTraitPastVerb: "skirmished",
        // finalDiceData: [],
        // isInlineResistanceRoll: false
      }
    };
  }
}
CONFIG.debug.logging = !0;
Object.assign(globalThis, { eLog: Ha, BladesDebug: io });
Handlebars.registerHelper("eLog", Ha.hbsLog);
let Ks;
class oo {
  get clockKeys() {
    return game.eunoblades.ClockKeys.filter((t) => t.isInScene() && t.isVisible);
  }
  get roll() {
    return Ie.Active;
  }
  get user() {
    return game.users.getName("Alistair");
  }
  get actor() {
    return game.actors.getName("Alistair");
  }
  get rollTarget() {
    var t;
    return (t = this.roll) == null ? void 0 : t.target;
  }
  get rollData() {
    var t;
    return (t = this.roll) == null ? void 0 : t.data;
  }
  get userFlags() {
    var t, e;
    return (e = (t = this.user) == null ? void 0 : t.flags) == null ? void 0 : e["eunos-blades"];
  }
  get actorFlags() {
    var t, e;
    return (e = (t = this.actor) == null ? void 0 : t.flags) == null ? void 0 : e["eunos-blades"];
  }
  get rollPrimary() {
    var t;
    return (t = this.roll) == null ? void 0 : t.rollPrimary;
  }
  get rollPrimaryDoc() {
    var t;
    return (t = this.roll) == null ? void 0 : t.rollPrimaryDoc;
  }
  get rollOpposition() {
    var t;
    return (t = this.roll) == null ? void 0 : t.rollOpposition;
  }
  get sheetData() {
    var t;
    return (t = this.roll) == null ? void 0 : t.context;
  }
  newActionRoll() {
    var a;
    const t = game.actors.getName("Alistair");
    if (!t)
      return;
    const e = {
      target: t,
      targetFlagKey: "rollCollab",
      rollType: _.Action,
      rollTrait: Ae.finesse,
      rollUserID: (a = game.users.find((r) => {
        var i;
        return ((i = r.character) == null ? void 0 : i.name) === "Alistair";
      })) == null ? void 0 : a.id,
      rollPrimaryData: t
    };
    Ge.New(e);
  }
  // async newResistanceRoll() {
  //   const pc = game.actors.getName("Alistair") as BladesPC|undefined;
  //   if (!pc?.id) { return; }
  //   const csq = await BladesConsequence.Create({
  //     target: pc,
  //     targetFlagKey: "rollConsequence" as TargetFlagKey,
  //     name: "Shattered Knee",
  //     isScopingById: true,
  //     type: ConsequenceType.ProwessHarm3,
  //     primaryID: pc.uuid,
  //     attribute: AttributeTrait.prowess,
  //     attributeVal: 3,
  //     resistSchema: {
  //       name: "Banged Knee",
  //       type: ConsequenceType.ProwessHarm2,
  //       primaryID: pc.uuid,
  //       canResistWithSpecial: true,
  //       resistWithSpecialNegates: true,
  //       specialFooterMsg: "Ability: Spend to Fully Negate."
  //     },
  //     canResistWithRoll: true,
  //     canResistWithSpecial: true,
  //     resistWithSpecialNegates: true,
  //     specialFooterMsg: "Ability: Spend to Fully Negate."
  //   });
  //   const conf: BladesRoll.Config = {
  //     target: pc,
  //     targetFlagKey: "rollCollab" as TargetFlagKey,
  //     rollType: RollType.Resistance,
  //     rollUserID: game.users.find((user) => user.character?.name === "Alistair")?.id as IDString,
  //     rollPrimaryData: pc,
  //     resistanceData: {
  //       consequence: csq.data
  //     }
  //   };
  //   BladesResistanceRoll.New(conf);
  // }
}
Object.assign(
  globalThis,
  {
    get: new oo(),
    // updateClaims,
    // updateContacts,
    // updateOps,
    // updateFactions,
    // updateDescriptions,
    // updateRollMods,
    BladesScene: Ba,
    BladesDirector: oe,
    BladesActor: I,
    BladesPC: M,
    BladesCrew: de,
    BladesNPC: Qe,
    BladesFaction: et,
    BladesPCSheet: Qt,
    BladesCrewSheet: ss,
    BladesFactionSheet: ts,
    BladesClockKey: le,
    BladesNPCSheet: es,
    BladesActiveEffect: ve,
    BladesRoll: Ie,
    BladesRollMod: _e,
    BladesRollPrimary: R,
    BladesRollOpposition: he,
    BladesRollParticipant: ae,
    BladesActionRoll: Ge,
    BladesEngagementRoll: Ra,
    BladesFortuneRoll: bt,
    BladesIncarcerationRoll: Fa,
    BladesIndulgeViceRoll: Ts,
    BladesInlineResistanceRoll: $a,
    BladesResistanceRoll: ks,
    BladesChat: Ne,
    BladesConsequence: Se,
    G: nt,
    U: h,
    C: v,
    BladesItem: k,
    BladesClockKeeper: Rt,
    BladesGMTracker: Je,
    BladesLocation: xa,
    BladesProject: ft,
    BladesScore: yt,
    BladesItemSheet: Xe,
    BladesClockKeeperSheet: Ht,
    BladesGMTrackerSheet: Nt,
    BladesAI: ao,
    AIAssistant: so,
    AGENTS: ro
  }
);
Hooks.once("init", async () => {
  game.eunoblades = {
    Rolls: new Collection(),
    ClockKeys: new Collection(),
    Consequences: new Collection(),
    Director: oe.getInstance(),
    Tooltips: /* @__PURE__ */ new WeakMap()
  }, eLog.display("Initializing Blades In the Dark System"), Ti(), CONFIG.debug.hooks = h.getSetting("debugHooks"), Pi(), CONFIG.Item.documentClass = Ui, CONFIG.Actor.documentClass = Zi, CONFIG.Scene.documentClass = Ba, CONFIG.ChatMessage.documentClass = Ne, Actors.unregisterSheet("core", ActorSheet), Items.unregisterSheet("core", ItemSheet), Items.registerSheet("blades", Xe, { types: v.ItemTypes, makeDefault: !0 }), Di(), Ai(), await Promise.all([
    M.Initialize(),
    de.Initialize(),
    Qe.Initialize(),
    et.Initialize(),
    ve.Initialize(),
    Nt.Initialize(),
    Ht.Initialize(),
    yt.Initialize(),
    Ze.Initialize(),
    Ie.Initialize(),
    ft.Initialize(),
    Ne.Initialize()
  ]);
});
Hooks.once("ready", async () => {
  await Promise.all([
    oe.Initialize(),
    Je.Initialize(),
    Rt.Initialize()
  ]), le.Initialize(), await Se.Initialize(), Ii(), Ci(), Si(), await oe.getInstance().renderOverlay_SocketResponse(), oe.InitSockets(), Ie.InitSockets();
});
Hooks.once("socketlib.ready", () => {
  Ks = socketlib.registerSystem("eunos-blades"), Object.assign(
    globalThis,
    { socket: Ks, socketlib }
  );
});
Hooks.once("diceSoNiceReady", (s) => {
  s.addSystem({ id: "eunos-blades", name: "Euno's Blades" }, "preferred"), s.addDicePreset({
    type: "d6",
    labels: [1, 2, 3, 4, 5, 6].map((t) => `systems/eunos-blades/assets/dice/faces/${t}.webp`),
    system: "eunos-blades",
    bumpMaps: [1, 2, 3, 4, 5, 6].map((t) => `systems/eunos-blades/assets/dice/bump-maps/${t}.webp`),
    emissiveMaps: [void 0, void 0, void 0, void 0, void 0, "systems/eunos-blades/assets/dice/emission-maps/6.webp"],
    emissive: "#d89300"
  });
});
//# sourceMappingURL=blades.js.map
