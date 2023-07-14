/* ****▌███████████████████████████████████████████████████████████████████████████▐**** *\
|*     ▌████░░░░░░░░░░░ Euno's Blades in the Dark for Foundry VTT ░░░░░░░░░░░░░████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░ by Eunomiac ░░░░░░░░░░░░░██████████████████▐     *|
|*     ▌████████████████████████████  License █ v0.1.0 ████████████████████████████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░░░░░░  ░░░░░░░░░░░░░░░░░░███████████████████▐     *|
\* ****▌███████████████████████████████████████████████████████████████████████████▐**** */

export var BladesPermissions;
(function (BladesPermissions) {
    BladesPermissions[BladesPermissions["NONE"] = CONST.DOCUMENT_PERMISSION_LEVELS.NONE] = "NONE";
    BladesPermissions[BladesPermissions["BASIC"] = CONST.DOCUMENT_PERMISSION_LEVELS.LIMITED] = "BASIC";
    BladesPermissions[BladesPermissions["FULL"] = CONST.DOCUMENT_PERMISSION_LEVELS.OBSERVER] = "FULL";
    BladesPermissions[BladesPermissions["OWNER"] = CONST.DOCUMENT_PERMISSION_LEVELS.OWNER] = "OWNER";
})(BladesPermissions || (BladesPermissions = {}));
export var BladesActorType;
(function (BladesActorType) {
    BladesActorType["pc"] = "pc";
    BladesActorType["npc"] = "npc";
    BladesActorType["crew"] = "crew";
})(BladesActorType || (BladesActorType = {}));
export var BladesItemType;
(function (BladesItemType) {
    BladesItemType["ability"] = "ability";
    BladesItemType["background"] = "background";
    BladesItemType["clock_keeper"] = "clock_keeper";
    BladesItemType["cohort"] = "cohort";
    BladesItemType["crew_ability"] = "crew_ability";
    BladesItemType["crew_reputation"] = "crew_reputation";
    BladesItemType["crew_playbook"] = "crew_playbook";
    BladesItemType["crew_upgrade"] = "crew_upgrade";
    BladesItemType["faction"] = "faction";
    BladesItemType["feature"] = "feature";
    BladesItemType["gm_tracker"] = "gm_tracker";
    BladesItemType["heritage"] = "heritage";
    BladesItemType["item"] = "item";
    BladesItemType["playbook"] = "playbook";
    BladesItemType["preferred_op"] = "preferred_op";
    BladesItemType["stricture"] = "stricture";
    BladesItemType["vice"] = "vice";
    BladesItemType["ritual"] = "ritual";
    BladesItemType["design"] = "design";
})(BladesItemType || (BladesItemType = {}));
export var District;
(function (District) {
    District["Barrowcleft"] = "Barrowcleft";
    District["Brightstone"] = "Brightstone";
    District["Charhollow"] = "Charhollow";
    District["Charterhall"] = "Charterhall";
    District["Coalridge"] = "Coalridge";
    District["Crows Foot"] = "Crows Foot";
    District["The Docks"] = "The Docks";
    District["Dunslough"] = "Dunslough";
    District["Nightmarket"] = "Nightmarket";
    District["Silkshore"] = "Silkshore";
    District["Six Towers"] = "Six Towers";
    District["Whitecrown"] = "Whitecrown";
    District["Gaddoc Station"] = "Gaddoc Station";
    District["The Lost District"] = "The Lost District";
    District["The Void Sea"] = "The Void Sea";
    District["Ironhook Prison"] = "Ironhook Prison";
    District["Old North Port"] = "Old North Port";
    District["Deathlands"] = "Deathlands";
})(District || (District = {}));
export var Attributes;
(function (Attributes) {
    Attributes["insight"] = "insight";
    Attributes["prowess"] = "prowess";
    Attributes["resolve"] = "resolve";
})(Attributes || (Attributes = {}));
export var InsightActions;
(function (InsightActions) {
    InsightActions["hunt"] = "hunt";
    InsightActions["study"] = "study";
    InsightActions["survey"] = "survey";
    InsightActions["tinker"] = "tinker";
})(InsightActions || (InsightActions = {}));
export var ProwessActions;
(function (ProwessActions) {
    ProwessActions["finesse"] = "finesse";
    ProwessActions["prowl"] = "prowl";
    ProwessActions["skirmish"] = "skirmish";
    ProwessActions["wreck"] = "wreck";
})(ProwessActions || (ProwessActions = {}));
export var ResolveActions;
(function (ResolveActions) {
    ResolveActions["attune"] = "attune";
    ResolveActions["command"] = "command";
    ResolveActions["consort"] = "consort";
    ResolveActions["sway"] = "sway";
})(ResolveActions || (ResolveActions = {}));
export var Actions;
(function (Actions) {
    Actions["hunt"] = "hunt";
    Actions["study"] = "study";
    Actions["survey"] = "survey";
    Actions["tinker"] = "tinker";
    Actions["finesse"] = "finesse";
    Actions["prowl"] = "prowl";
    Actions["skirmish"] = "skirmish";
    Actions["wreck"] = "wreck";
    Actions["attune"] = "attune";
    Actions["command"] = "command";
    Actions["consort"] = "consort";
    Actions["sway"] = "sway";
})(Actions || (Actions = {}));
export var Positions;
(function (Positions) {
    Positions["controlled"] = "controlled";
    Positions["risky"] = "risky";
    Positions["desperate"] = "desperate";
})(Positions || (Positions = {}));
export var EffectLevels;
(function (EffectLevels) {
    EffectLevels["extreme"] = "extreme";
    EffectLevels["great"] = "great";
    EffectLevels["standard"] = "standard";
    EffectLevels["limited"] = "limited";
    EffectLevels["zero"] = "zero";
})(EffectLevels || (EffectLevels = {}));
export var Vice;
(function (Vice) {
    Vice["Faith"] = "Faith";
    Vice["Gambling"] = "Gambling";
    Vice["Luxury"] = "Luxury";
    Vice["Obligation"] = "Obligation";
    Vice["Pleasure"] = "Pleasure";
    Vice["Stupor"] = "Stupor";
    Vice["Weird"] = "Weird";
    Vice["Worship"] = "Worship";
    Vice["Life_Essence"] = "Life_Essence";
    Vice["Electroplasmic_Power"] = "Electroplasmic_Power";
    Vice["Servitude"] = "Servitude";
})(Vice || (Vice = {}));
export var Playbook;
(function (Playbook) {
    Playbook["Cutter"] = "Cutter";
    Playbook["Hound"] = "Hound";
    Playbook["Leech"] = "Leech";
    Playbook["Lurk"] = "Lurk";
    Playbook["Slide"] = "Slide";
    Playbook["Spider"] = "Spider";
    Playbook["Whisper"] = "Whisper";
    Playbook["Vampire"] = "Vampire";
    Playbook["Hull"] = "Hull";
    Playbook["Ghost"] = "Ghost";
    Playbook["Assassins"] = "Assassins";
    Playbook["Bravos"] = "Bravos";
    Playbook["Cult"] = "Cult";
    Playbook["Hawkers"] = "Hawkers";
    Playbook["Shadows"] = "Shadows";
    Playbook["Smugglers"] = "Smugglers";
    Playbook["Vigilantes"] = "Vigilantes";
})(Playbook || (Playbook = {}));
export var Tag;
(function (Tag) {
    let System;
    (function (System) {
        System["Archived"] = "Archived";
        System["Featured"] = "Featured";
        System["Hidden"] = "Hidden";
        System["MultiplesOK"] = "MultiplesOK";
    })(System = Tag.System || (Tag.System = {}));
    let Item;
    (function (Item) {
        Item["Fine"] = "Fine";
        Item["General"] = "General";
        Item["Advanced"] = "Advanced";
        Item["ViceOverride"] = "ViceOverride";
    })(Item = Tag.Item || (Tag.Item = {}));
    let PC;
    (function (PC) {
        PC["Member"] = "Member";
        PC["CharacterCrew"] = "CharacterCrew";
    })(PC = Tag.PC || (Tag.PC = {}));
    let NPC;
    (function (NPC) {
        NPC["Acquaintance"] = "Acquaintance";
        NPC["Friend"] = "Friend";
        NPC["Rival"] = "Rival";
        NPC["VicePurveyor"] = "VicePurveyor";
    })(NPC = Tag.NPC || (Tag.NPC = {}));
})(Tag || (Tag = {}));
const C = {
    SYSTEM_ID: "eunos-blades",
    SYSTEM_NAME: "Euno's Blades",
    SYSTEM_FULL_NAME: "Euno's Blades In The Dark",
    TEMPLATE_ROOT: "systems/eunos-blades/templates",
    Colors: {
        bWHITE: "rgba(255, 255, 255, 1)",
        WHITE: "rgba(200, 200, 200, 1)",
        bGREY: "rgba(170, 170, 170, 1)",
        GREY: "rgba(128, 128, 128, 1)",
        dGREY: "rgba(78, 78, 78, 1)",
        BLACK: "rgba(16, 16, 16, 1)",
        dBLACK: "rgba(0, 0, 0, 1)",
        gGOLD: "rgba(255, 254, 200, 1)",
        bGOLD: "rgba(171, 146, 84, 1)",
        GOLD: "rgba(253, 212, 112, 1)",
        dGOLD: "rgba(65, 61, 46, 1)",
        RED: "rgba(155, 32, 32, 1)",
        dRED: "rgba(70, 14, 14, 1)",
        bRED: "rgba(240, 50, 50, 1)",
        gRED: "rgba(255, 0, 0, 1)",
        BLUE: "rgba(43, 85, 139, 1)",
        dBLUE: "rgba(17, 33, 54, 1)",
        bBLUE: "rgba(69, 137, 224, 1)",
        gBLUE: "rgba(128, 185, 255, 1)"
    },
    Loadout: {
        selections: ["BITD.Light", "BITD.Normal", "BITD.Heavy", "BITD.Encumbered"],
        levels: ["BITD.Light", "BITD.Normal", "BITD.Heavy", "BITD.Encumbered", "BITD.OverMax"]
    },
    Playbooks: {
        Cutter: {
            "system.bgImg": "systems/eunos-blades/assets/icons/cutter-trans.svg",
            "system.tagline": "A Dangerous & Intimidating Fighter",
            "system.friends_name": "Dangerous Friends",
            "system.rivals_name": "More Dangerous Rivals",
            "system.starting_stats.chargen": {
                "system.attributes.prowess.skirmish.value": 2,
                "system.attributes.resolve.command.value": 1
            },
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
            "system.bgImg": "systems/eunos-blades/assets/icons/hound-trans.svg",
            "system.tagline": "A Deadly Sharpshooter & Tracker",
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
            "system.bgImg": "systems/eunos-blades/assets/icons/leech-trans.svg",
            "system.tagline": "A Saboteur & Technician",
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
            "system.bgImg": "systems/eunos-blades/assets/icons/lurk-trans.svg",
            "system.tagline": "A Stealthy Infiltrator & Burglar",
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
            "system.bgImg": "systems/eunos-blades/assets/icons/slide-trans.svg",
            "system.tagline": "A Subtle Manipulator & Spy",
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
            "system.bgImg": "systems/eunos-blades/assets/icons/spider-trans.svg",
            "system.tagline": "A Devious Mastermind",
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
            "system.bgImg": "systems/eunos-blades/assets/icons/whisper-trans.svg",
            "system.tagline": "An Arcane Adept & Channeler",
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
            "system.bgImg": "systems/eunos-blades/assets/icons/ghost-trans.svg",
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
            "system.bgImg": "systems/eunos-blades/assets/icons/hull-trans.svg",
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
            "system.bgImg": "systems/eunos-blades/assets/icons/vampire-trans.svg",
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
        BladesActorType.pc,
        BladesActorType.npc,
        BladesActorType.crew
    ],
    ItemTypes: [
        BladesItemType.ability,
        BladesItemType.background,
        BladesItemType.clock_keeper,
        BladesItemType.cohort,
        BladesItemType.crew_ability,
        BladesItemType.crew_reputation,
        BladesItemType.crew_playbook,
        BladesItemType.crew_upgrade,
        BladesItemType.faction,
        BladesItemType.feature,
        BladesItemType.gm_tracker,
        BladesItemType.heritage,
        BladesItemType.item,
        BladesItemType.playbook,
        BladesItemType.stricture,
        BladesItemType.vice
    ],
    SimpleItemTypes: [
        BladesItemType.background,
        BladesItemType.crew_reputation,
        BladesItemType.heritage,
        BladesItemType.stricture
    ],
    Attributes: [
        Attributes.insight,
        Attributes.resolve,
        Attributes.prowess
    ],
    Vices: [
        Vice.Faith, Vice.Gambling, Vice.Luxury, Vice.Obligation, Vice.Pleasure, Vice.Stupor, Vice.Weird, Vice.Worship, Vice.Life_Essence, Vice.Electroplasmic_Power
    ]
};
export const Randomizers = {
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
    gender: [
        "Male",
        "Male",
        "Male",
        "Female",
        "Female",
        "Ambiguous/Unknown"
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
        "In prison or under noble’s house arrest.",
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
        "Serves a demon’s agenda (knowingly or not).",
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
};
export const IMPORTDATA = {
    obstacles: [
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
                "The snakes dislike a certain whistle tone. Let out a blast occasionally and they’ll stay away.",
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
                "The only way to be free is to die, undergo electroplasmic surgery while dead, and be revived. Otherwise the curse is protected by the victim’s life force.",
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
                "Once they rise, the desiccated spirit-ridden corpses will chase intruders until they can’t."
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
                "The building’s architecture assumes use of floormesh, the carpets are woven to look like floormesh so the guardians don’t have to cover the actual pits.",
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
                "Annoyed locals keep it trimmed back on outside walls periodically in spite of the guardian’s threats.",
                "Guards know the ingredients to make a special paste, and the symbol to paint on skin with it, to protect from the plant’s effects. A former guard might share the secret."
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
                "The mechanisms are not well maintained. Sometimes they don’t work, and when they do, there is a screech and they are a bit slow.",
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
                "This is an off-site shrine or expansion, where they send troublemakers and those they can’t eject for political or financial reasons.",
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
                "Guards are trained to tune into the life force energy to also hear conversations of the life shadows. Guards can tune into the life force energy to know the owner’s current location, if in the defended area.",
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
    devilsBargains: [
        {
            name: "Infected Wound",
            category: "Character Effect",
            desc: "The next time you Recover from Harm, your Physicker is at -1d.",
            severity: 1
        },
        {
            name: "It's Mine Now",
            category: "Character Effect",
            desc: "You discover a small item that belongs to a rival. What is it? Who used to own it? How does this change things for you?",
            severity: 1
        },
        {
            name: "Mine By Blood",
            category: "Character Effect",
            desc: "You discover evidence of the death of a family member during the Score. Who is it? How did they die? How does this change things for your character?",
            severity: 1
        },
        {
            name: "Mine By Name",
            category: "Character Effect",
            desc: "You discover an envelope addressed to you during the Score. What is in it? Who left it here for you to find? How does this change things for your character?",
            severity: 1
        },
        {
            name: "Mine By Rights",
            category: "Character Effect",
            desc: "You discover a small item from your past during the Score. What is it? What does it mean that it's here? Does this change things for your character?",
            severity: 1
        },
        {
            name: "Not Paying Attention",
            category: "Character Effect",
            desc: "Uncheck one of the XP triggers already marked for your character for this Score.",
            severity: 2
        },
        {
            name: "Shadow From the Past",
            category: "Character Effect",
            desc: "Your intel missed that someone from your past is associated with the target of the Score. Who is it, and how does that change things for you?",
            severity: 1
        },
        {
            name: "Thicker than Blood",
            category: "Character Effect",
            desc: "Your intel missed that one of your family members is associated with the target of the Score. How does that change things for you?",
            severity: 1
        },
        {
            name: "Why'd It Have To Be...",
            category: "Character Effect",
            desc: "The room you're in triggers a phobia that the Crew didn't know about before. Describe the phobia and take 2 Stress.",
            severity: 1
        },
        {
            name: "Demonic Guest",
            category: "Crew Effect",
            desc: "A demonic presence has appeared in your Lair and will need to be dealt with during Free Play.",
            severity: 2
        },
        {
            name: "Fracturing Faction",
            category: "Crew Effect",
            desc: "If your Hold is Strong, reduce it to Weak. If your Hold is Weak, reduce your Rep to zero.",
            severity: 3
        },
        {
            name: "Lesson Not Learned",
            category: "Crew Effect",
            desc: "Uncheck one of the XP triggers already marked for your crew for this Score.",
            severity: 2
        },
        {
            name: "Otherworldly Guest",
            category: "Crew Effect",
            desc: "A scion of one of the Old Gods has appeared in your Lair and will need to be dealt with during Free Play.",
            severity: 2
        },
        {
            name: "Rebellious Faction",
            category: "Crew Effect",
            desc: "A new crew has taken possession of one of your Claims, and will have to be dealt with in Free Play.",
            severity: 3
        },
        {
            name: "Spectral Guest",
            category: "Crew Effect",
            desc: "A ghostly presence has appeared in your Lair and will need to be dealt with during Free Play.",
            severity: 2
        },
        {
            name: "Turncoat",
            category: "Crew Effect",
            desc: "One of your Cohorts leaves your crew and joins a rival.",
            severity: 3
        },
        {
            name: "Double-Crossed",
            category: "Downtime Effect",
            desc: "After the normal Entanglement roll and result, your Crew takes an additional Flipped result.",
            severity: 1
        },
        {
            name: "Easily Identified",
            category: "Downtime Effect",
            desc: "You left something behind that is easily traced to you. Choose either +2 Heat and −2 Rep, or +1 Heat and −1 Rep.",
            severity: 1
        },
        {
            name: "High Profile",
            category: "Downtime Effect",
            desc: "This Score gains +2 Heat.",
            severity: 1
        },
        {
            name: "Most Wanted",
            category: "Downtime Effect",
            desc: "After the normal Entanglement roll and result, you are the target of an additional Arrest result.",
            severity: 2
        },
        {
            name: "Project Setback",
            category: "Downtime Effect",
            desc: "Mark one less Clock segment the first time you work on a Long-Term Project.",
            severity: 1
        },
        {
            name: "Quelle Horreur!",
            category: "Downtime Effect",
            desc: "You suffer nightmares for a week. −1d to all Downtime Actions after this Score.",
            severity: 2
        },
        {
            name: "Shortchanged",
            category: "Downtime Effect",
            desc: "This Score's payoff is −2 Coin.",
            severity: 1
        },
        {
            name: "Supply Challenges",
            category: "Downtime Effect",
            desc: "The next time you pay Coin for an Acquire Asset roll, you must pay 3 instead of 2 Coin per Tier.",
            severity: 2
        },
        {
            name: "Supply Delays",
            category: "Downtime Effect",
            desc: "Suffer -1d to your next Acquire Asset roll.",
            severity: 1
        },
        {
            name: "Tastes Like Ashes",
            category: "Downtime Effect",
            desc: "The next time you indulge your Vice, only clear half as much Stress (rounded down) as normal.",
            severity: 2
        },
        {
            name: "Thrice-Named",
            category: "Downtime Effect",
            desc: "After the normal Entanglement roll and result, your Crew takes an additional Demonic Notice result.",
            severity: 1
        },
        {
            name: "Warden's Attention",
            category: "Downtime Effect",
            desc: "+4 Heat (instead of the normal +2 Heat) if there is a death during this Score.",
            severity: 2
        },
        {
            name: "We Want a Bigger Take!",
            category: "Downtime Effect",
            desc: "The gang wants a bigger piece of the action. −2 Coin to Payoff for each Cohort used in this Score.",
            severity: 2
        },
        {
            name: "Weekend Getaway",
            category: "Downtime Effect",
            desc: "If you indulge your Vice after this Score, you automatically overindulge.",
            severity: 1
        },
        {
            name: "What's Our Take?",
            category: "Downtime Effect",
            desc: "The gang wants a bigger piece of the action. −1 Coin to Payoff for each Cohort used in this Score.",
            severity: 1
        },
        {
            name: "Accelerating Plans",
            category: "Faction Relationship Effect",
            desc: "A rival faction advances one of its Clocks by two before your next Score.",
            severity: 1
        },
        {
            name: "Escalating Tensions",
            category: "Faction Relationship Effect",
            desc: "A faction of your choice that is unfriendly to your crew moves one step towards War.",
            severity: 2
        },
        {
            name: "Forgiveness or Vengeance?",
            category: "Faction Relationship Effect",
            desc: "During the Score, one of your Cohorts got in a fight with an neutral Cohort. Choose −2 Rep and +1 faction relationship, or +2 Rep and −1 faction relationship.",
            severity: 1
        },
        {
            name: "Hot-Headed Cohort",
            category: "Faction Relationship Effect",
            desc: "During the Score, one of your Cohorts picked a fight with an allied Cohort. Pay 2 Coin, lose 2 Rep, or −1 faction relationship.",
            severity: 1
        },
        {
            name: "Mixed Messages",
            category: "Faction Relationship Effect",
            desc: "A faction of your choice that is friendly to your crew moves one step towards Neutral.",
            severity: 2
        },
        {
            name: "Mutual Defense",
            category: "Faction Relationship Effect",
            desc: "A friendly Faction goes to War with a neutral Faction. Either join their War, or they move to −1 on the relationship chart.",
            severity: 2
        },
        {
            name: "Tensions Spread",
            category: "Faction Relationship Effect",
            desc: "One Neutral Faction moves a step towards War, and another Neutral Faction moves a step towards Ally.",
            severity: 1
        },
        {
            name: "The Walls Have Ears",
            category: "Faction Relationship Effect",
            desc: "A friendly faction hears you did a Score against their ally. −1 to that faction's relationship rating.",
            severity: 1
        },
        {
            name: "The Walls Have Eyes",
            category: "Faction Relationship Effect",
            desc: "A friendly faction hears you did a Score against their ally. −1 to both factions' relationship ratings.",
            severity: 2
        },
        {
            name: "...and Into the Fire",
            category: "Immediate Effect",
            desc: "You are ambushed by an assassin or bounty hunter. Start a 4-Clock, \"Elite Ambusher\" to overcome this new foe.",
            severity: 2
        },
        {
            name: "A Familiar Face",
            category: "Immediate Effect",
            desc: "You recognize a contact of your choice among the rivals you are running the Score against.",
            severity: 1
        },
        {
            name: "Accidental Discharge",
            category: "Immediate Effect",
            desc: "A weapon or item you are carrying loudly discharges and needs to be reloaded before it can be used.",
            severity: 1
        },
        {
            name: "All or Nothing",
            category: "Immediate Effect",
            desc: "If you fail this roll, you cannot resist the effects of that failure.",
            severity: 1
        },
        {
            name: "Bishop's Gambit",
            category: "Immediate Effect",
            desc: "If you are not in combat, gain +2d for this roll instead of the standard +1d; but you can roll no more than 1d for your next Action.",
            severity: 1
        },
        {
            name: "Brute Force Method",
            category: "Immediate Effect",
            desc: "You noisily break a weapon of your choice while attempting this Action, even if it is not a combat Action.",
            severity: 1
        },
        {
            name: "Clear the Board",
            category: "Immediate Effect",
            desc: "If you succeed at this roll, clear or fill a Score Clock of your choice. If you fail the roll, you Trauma out of the scene.",
            severity: 2
        },
        {
            name: "Devil's Exchange",
            category: "Immediate Effect",
            desc: "You gain the normal +1d to this roll, but suffer −1d to your next Action, and cannot take a Devil's Bargain to offset it.",
            severity: 1
        },
        {
            name: "Ghostly Attention",
            category: "Immediate Effect",
            desc: "Whether you succeed in this roll or not, a ghost in the area notices you and begins stalking you.",
            severity: 1
        },
        {
            name: "Gimcrack Gear",
            category: "Immediate Effect",
            desc: "Whatever weapon or tool you are using is cheaply made and breaks whether the roll succeeds or not.",
            severity: 1
        },
        {
            name: "Gone Rogue",
            category: "Immediate Effect",
            desc: "You cannot accept an Assist for the rest of this Score.",
            severity: 2
        },
        {
            name: "Hunter Becomes Hunted",
            category: "Immediate Effect",
            desc: "You've been so preoccupied with the obstacles in front of you that you didn't notice the rival lining up a shot behind you.",
            severity: 1
        },
        {
            name: "I Know I Packed It!",
            category: "Immediate Effect",
            desc: "You must immediately check off 1 Load to no effect, representing equipment you've misplaced.",
            severity: 1
        },
        {
            name: "I Know I Packed Them!",
            category: "Immediate Effect",
            desc: "You must immediately check off 2 Load to no effect, representing equipment you've misplaced.",
            severity: 1
        },
        {
            name: "Jangled Nerves",
            category: "Immediate Effect",
            desc: "For the rest of the Score, all rolls to Resist generate +1 Stress.",
            severity: 1
        },
        {
            name: "Just a Little Spark",
            category: "Immediate Effect",
            desc: "A lamp or candle gets knocked over, catching a curtain or rug on fire. Start a Clock: \"Building is on Fire\".",
            severity: 1
        },
        {
            name: "King's Gambit",
            category: "Immediate Effect",
            desc: "If you fail at this roll, you are immune to any Harm; but you have a zero rating to your next Action.",
            severity: 1
        },
        {
            name: "Knight's Gambit",
            category: "Immediate Effect",
            desc: "If you are in combat, gain +2d for this roll instead of the standard +1d; but you can roll no more than 1d for your next Action.",
            severity: 1
        },
        {
            name: "Knuckle Buster",
            category: "Immediate Effect",
            desc: "Whether this Action succeeds or not, you accidentally inflict level 1 Harm on your hand, \"Busted Knuckles.\"",
            severity: 1
        },
        {
            name: "Now or Never",
            category: "Immediate Effect",
            desc: "If you fail this roll, you lose this opportunity and cannot retry it for this Score.",
            severity: 1
        },
        {
            name: "Out of the Frying Pan...",
            category: "Immediate Effect",
            desc: "Things are about to go from bad to worse. Start a 4-Clock, \"Surprise Reinforcements\".",
            severity: 1
        },
        {
            name: "Overextended",
            category: "Immediate Effect",
            desc: "Your next Action automatically has reduced Effect.",
            severity: 1
        },
        {
            name: "Pawn's Gambit",
            category: "Immediate Effect",
            desc: "You cannot use Load for Armor during this Score. You cannot accept this bargain if you already have used Load for Armor.",
            severity: 1
        },
        {
            name: "Plan C...",
            category: "Immediate Effect",
            desc: "Things are not going according to plan. Flashbacks cost +1 Stress for the rest of the Score.",
            severity: 2
        },
        {
            name: "Queen's Gambit",
            category: "Immediate Effect",
            desc: "You automatically succeed at this Action as if you rolled a 6; but you have a zero rating to your next Action.",
            severity: 1
        },
        {
            name: "Quicksilver Poisoning",
            category: "Immediate Effect",
            desc: "Used in electroplasmic containers and devices, you get a noseful of quicksilver vapor, suffering level 1 Harm, \"Silverlung\" which starts a 4-Clock Project to heal.",
            severity: 1
        },
        {
            name: "Rook's Gambit",
            category: "Immediate Effect",
            desc: "You cannot use Load for Unusual or Scary Weapons this Score. You cannot accept this bargain if you already have used Load for these.",
            severity: 1
        },
        {
            name: "Shot Nerves",
            category: "Immediate Effect",
            desc: "For the rest of the Score, all rolls to Resist generate +2 Stress.",
            severity: 2
        },
        {
            name: "Turned Around",
            category: "Immediate Effect",
            desc: "You lose track of your position. Start a 4-Clock, \"Where Am I?\" You must use Actions looking for your Crew to rejoin them.",
            severity: 1
        },
        {
            name: "Unsure Footing",
            category: "Immediate Effect",
            desc: "Whether you succeed in this roll or not, you loose your footing and fall prone after this Action.",
            severity: 1
        },
        {
            name: "Worse than We thought",
            category: "Immediate Effect",
            desc: "A Clock of your choice that is running for this Score is either advanced or set back by two segments (whichever is worse for the Crew).",
            severity: 2
        },
        {
            name: "You're All On Your Own",
            category: "Immediate Effect",
            desc: "After this roll, you cannot offer to Assist on anyone else's roll for the rest of the Score.",
            severity: 1
        },
        {
            name: "Death Will Not Stop Me",
            category: "Long-Term Effect",
            desc: "The ghost of someone you killed is driven to take you with it. Start a 12-Clock, \"Spectral Vengence\"",
            severity: 3
        },
        {
            name: "That's Enough of That",
            category: "Long-Term Effect",
            desc: "Someone whose goals are affected by this Score is going to focus on you now. Start a 8-Clock, \"Cold Vengence\"",
            severity: 2
        },
        {
            name: "The Last Straw",
            category: "Long-Term Effect",
            desc: "You've royally pissed off someone with real clout in the city. Start a 12-Clock, \"Furious Vengence\"",
            severity: 3
        },
        {
            name: "You'll Pay For This",
            category: "Long-Term Effect",
            desc: "Someone hurt by this Score will come back to collect what's owed. Start a 6-Clock, \"Petty Vengence\"",
            severity: 1
        },
        {
            name: "Dalgomur, the Heart of the Storm",
            category: "Mandatory Effect",
            desc: "If one is not already active for the crew, start a 12-Clock labeled \"The Heart of the Storm\" and set it to one. If the Clock is already active, advance it by one.",
            severity: 1
        },
        {
            name: "Ulf Ironborn, the Skovlan Agitator",
            category: "Mandatory Effect",
            desc: "If one is not already active for the crew, start a 4-Clock labeled \"Skovlander Uprising\" and set it to one. If the Clock is already active, advance it by one.",
            severity: 1
        },
        {
            name: "Urumbar, the Closed Eye",
            category: "Mandatory Effect",
            desc: "If one is not already active for the crew, start an 8-Clock labeled \"The Closed Eye\" and set it to one. If the Clock is already active, advance it by one.",
            severity: 1
        },
        {
            name: "Vaskani, the Crossroads Demon",
            category: "Mandatory Effect",
            desc: "If one is not already active for the crew, start a 6-Clock labeled \"The Crossroads Demon\" and set it to one. If the Clock is already active, advance it by one.",
            severity: 1
        }
    ],
    npcs: [
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
            description: "Doc can keep life in you if you're alive (or recently dead) when you get to him. His extreme methods are often horrifying. Still, his concoctions can crush ghosts, re-attach limbs, and more. The Crows, a tough crew, protect him. They give him victims for his \"needs,\" which are emotional, physical, and scientific.",
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
            description: "She needs allies in her hopeless quest to clean up the city. Corruption is everywhere, crime runs rampant, and the bluecoats serve the powerful (on both sides of the law.) Some tragedy in her past propels her into a suicidal effort to restore \"rule of law.” Her peers muse it is a shame she will die young.",
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
            notes: "She must keep any real competitors for her fame weakened and embarrassed, and she has countless enemies. Everyone \"knows\" she is an Iruvian spy."
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
            description: "A magistrate who is \"reasonable\" when it comes to street crime, so long as the offender's purse is sufficient.",
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
            description: "A dealer of fine weapons from the Dagger Isles. Greatly respected by many street toughs in The Dusk—a \"jira blade\" is a status symbol that many aspire to.",
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
            description: "A medium who invites clients to bring ghosts in bottles to posses her so they can share a few final words before the ghost is \"freed\" (Levyra hands it off to the waiting Spirit Wardens nearby).",
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
            description: "Matriarch of the oldest farm family. The living embodiment of \"tough but fair.\"",
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
            description: "A drug addict, whisper, and all-around weirdo who perches on rooftops in the district. Hopper claims to see \"ghost rails\" and \"spirit trains\" originating deep beneath Coalridge, stretching beyond the horizon.",
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
    motivations: [
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
            narrative: "An Iruvian ingot stamped with the year \"802\" will attract attention."
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
            desc: "TARNALI was a Whisper composer who built a special harpsichord. When two tones are played, often a third \"ghost\" tone can be heard. By attaching the tuning pegs to crystals and runes, Tarnali built a harpsichord that could interact with the Ghost Field through calculated progressions of played tones.",
            narrative: "This effort is intensely interesting to those who want to find doors hidden in the Ghost Field, draw or repel what lurks Behind the Mirror, or develop more portable tonal energies for non-Whispers ."
        },
        {
            name: "Dyvik's Chaser Mask",
            category: "Weird Artifact",
            desc: "This silvery face mask has the word “Elekthiaron” etched along its inner edge. When the word is spoken, the personality of the one touching the mask is pulled into it. The personality that was in the mask goes in the body. If the one in the body doesn’t touch the mask once a week, madness threatens.",
            narrative: "Has someone been using the mask to pose as someone else? How long has that been going on? Is there someone in the mask that needs rescuing? Was the mask used to cheat biological death?"
        },
        {
            name: "Evardian's Song Folios",
            category: "Weird Scholarship",
            desc: "Four leather-bound volumes, full of musical notation with heavily annotated margins. The \"music\" is supposed to be transcribed and translated leviathan song. Legend suggests if the music is played correctly, it can drive humans insane with visions of the demon-haunted deep.",
            narrative: "Aristocrats will collect anything. Scholars go to great lengths for research material. Cultists may find religious significance in the folios. (Owning the folios is against the law.)"
        },
        {
            name: "Falheim’s Prod",
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
            name: "Naladicha’s Cartography",
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
            narrative: "The Sellivas order of witches wrote their research journals in an ink that can only be read by the light of the Orb. If someone had the Orb and the \"blank\" book, they could crack ancient secrets."
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
            narrative: "The book provides remote reading, eavesdropping of a sort. A target’s favorite pen or lucky coin can become the broadcaster, and determined spies can copy the magic book writing so they don't lose it."
        },
        {
            name: "Rylaria’s Shield",
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
            narrative: "Are you supposed to be someone in particular, like a random street thug or rival’s employee or bluecoat? How far can the terror go? Do you need to trash a home, or maybe converse with a loved one?"
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
            desc: "The ring is made of tiny bits of bone wired together. It must be worn for at least a day per year of the bearer's life before it begins to work. When placed on a source of information, the ring sifts it until the ring speaks the information's \"language.\" The bearer can see through riddles, read arcane texts, and break code with ease.",
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
            desc: "The round frame has forty special lenses hinged on its rim. The lenses can layer over each other, flip out past the frame, rotate to take advantage of the angles inside the ground crystal, and take translucent colored filters. Their inventor, VLAS HALDAK, said he had found \"the key.\" He died of shock, the lens on his work table.",
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
};
export const SVGDATA = {
    overlayScale: 0.25,
    keys: {
        marginHoriz: 20,
        marginVert: 0,
        alternatingVertShift: 120,
        list: {
            1: {
                height: 455,
                width: 202,
                path: "M195.461,89.149c-6.5-6.301-13.69-5.549-25.075,3.382c-0.81-4.205-1.839-8.212-3.078-12.031h0.316 c-8.044-25.058-24.763-40.893-50.248-47.557c-1.297-0.339-2.624-0.561-3.924-0.889c-6.019-1.517-6.336-2.452-2.436-7.09 c5.369-6.386,4.922-15.175-1.063-20.886c-5.693-5.432-14.781-5.438-20.547-0.013c-5.996,5.642-6.497,14.52-1.064,20.845 c0.96,1.118,2.356,1.862,5.093,3.962c-3.99,1.966-6.455,3.641-9.177,4.448c-15.807,4.683-28.777,12.946-37.571,25.474 c-4.587,6.103-7.966,13.04-10.358,20.565c-0.202,0.381-0.402,0.766-0.611,1.14h0.263c-0.396,1.308-0.772,2.627-1.111,3.968 c-0.679,2.693-2.099,5.2-3.467,8.492c-2.282-2.122-3.455-3.284-4.703-4.36c-6.057-5.222-14.978-4.864-20.538,0.799 c-5.594,5.698-5.83,14.673-0.539,20.534c5.556,6.156,14.49,6.869,20.831,1.662c5.103-4.19,5.403-3.94,8.055,2.512 c3.424,8.33,6.348,17.054,11.07,24.62c8.365,13.404,20.984,21.857,36.018,26.74c1.432,0.465,3.545,1.997,3.581,3.092 c0.217,6.56,0.203,63.149,0.181,69.94h5.978c0.027,25.839,0.056,51.678,0.075,77.518c0.001,0.826-0.081,1.652-0.122,2.436 c-3.477,0.597-4.621-0.495-4.724-4.511c-0.072-2.822-0.002-5.649-0.016-8.473c-0.024-4.802-0.899-5.97-4.65-5.976 c-14.561-0.022-29.123-0.01-43.684-0.009c-4.669,0-9.338,0.084-14.005-0.022c-3.053-0.069-4.442,1.665-4.367,5.515 c0.06,3.105,0.069,6.216-0.001,9.32c-0.087,3.868,1.308,5.581,4.358,5.553c8.447-0.076,16.895-0.038,25.343-0.024 c4.177,0.007,4.977,1.055,4.991,6.397c0.025,9.702,0.025,9.702-7.739,9.702c-7.447-0.001-14.895-0.025-22.342,0.006 c-3.589,0.015-4.581,1.209-4.592,5.611c-0.035,13.947-0.952,13.109,10.094,13.035c6.669-0.045,13.339-0.032,20.008,0.002 c3.56,0.018,4.503,1.226,4.575,5.638c0.172,10.455,0.172,10.455-8.128,10.455c-7.336,0-14.672-0.024-22.009,0.01 c-3.524,0.016-4.52,1.263-4.543,5.672c-0.068,12.642-0.708,12.243,9.481,12.129c6.891-0.077,13.783-0.04,20.675-0.004 c3.497,0.018,4.458,1.281,4.524,5.702c0.155,10.39,0.155,10.39-8.179,10.39c-7.336,0-14.672-0.026-22.009,0.01 c-3.478,0.017-4.479,1.296-4.492,5.736c-0.04,13.671-0.916,12.955,9.86,12.916c17.229-0.063,34.458-0.012,51.687-0.02 c4.367-0.002,5.143-1.02,5.146-6.63c0.001-1.977-0.037-3.956,0.007-5.931c0.095-4.282,1.188-5.371,4.234-4.937 c1.04,10.07,1.926,19.99,3.157,29.842c0.428,3.429,1.324,6.98,2.719,9.93c1.211,2.56,3.418,5.993,5.207,6.013 c1.76,0.02,4.509-3.383,5.143-5.954c2.047-8.292,4.073-16.802,4.708-25.395c0.858-11.612,0.505-23.379,0.521-35.079 c0.066-48.857,0.123-97.715,0.189-146.572h5.502c0-7.238,0-64.435,0-71.846c29.348-8.445,46.384-28.573,52.447-59.435 c5.672,5.174,10.766,9.523,17.62,7.369c3.319-1.043,6.755-3.208,9.009-5.835C201.938,103.019,200.931,94.451,195.461,89.149z  M101,153c-29.823,0-54-24.177-54-54c0-29.823,24.177-54,54-54s54,24.177,54,54C155,128.823,130.823,153,101,153z",
                clocks: {
                    1: { x: 101, y: 99 }
                }
            },
            2: {
                height: 624.438,
                width: 202,
                path: "M197.21,270.21c-2.254-2.626-5.691-4.792-9.009-5.835c-6.854-2.153-11.948,2.196-17.62,7.369 c-5.054-25.727-17.741-43.987-38.822-54.246l-19.078-21.56v-12l20.959-23.686c19.726-10.446,31.684-28.304,36.554-53.096 c5.672,5.174,10.766,9.523,17.62,7.369c3.319-1.043,6.755-3.208,9.009-5.835c4.921-5.734,3.914-14.302-1.556-19.605 c-6.5-6.301-13.69-5.549-25.075,3.382c-4.859-25.231-17.337-43.587-38.754-54.031h0.16c-1.52-0.732-3.083-1.394-4.666-2.025 c-3.023-1.25-6.199-2.365-9.548-3.327c0,0-0.532-0.089-1.47-0.217c-2.443-0.731-4.799-2.02-7.813-3.273 c2.122-2.282,3.284-3.455,4.36-4.703c5.222-6.057,4.864-14.978-0.799-20.538c-5.698-5.594-14.673-5.829-20.535-0.539 c-6.156,5.556-6.869,14.49-1.662,20.831c4.19,5.103,3.94,5.403-2.512,8.055c-1.809,0.744-3.636,1.465-5.466,2.187 c-10.374,3.032-16.236,6.929-23.08,12.001c-12.526,9.284-19.916,22.385-23.732,37.515c-0.679,2.693-2.099,5.2-3.468,8.492 c-2.282-2.122-3.455-3.284-4.703-4.36c-6.057-5.222-14.978-4.864-20.538,0.799c-5.594,5.698-5.829,14.673-0.539,20.534 c5.556,6.156,14.49,6.869,20.831,1.662c5.103-4.19,5.403-3.94,8.055,2.512c3.424,8.33,6.348,17.054,11.07,24.62 c6.086,9.752,14.431,16.873,24.313,21.915l21.795,23.357v12l-20.405,21.867c-10.324,5.068-19.024,12.348-25.317,22.43 c-4.722,7.566-7.646,16.29-11.07,24.62c-2.652,6.452-2.952,6.702-8.055,2.512c-6.341-5.206-15.275-4.493-20.831,1.662 c-5.29,5.861-5.055,14.837,0.539,20.534c5.56,5.663,14.481,6.021,20.538,0.799c1.248-1.076,2.421-2.238,4.703-4.36 c1.369,3.292,2.788,5.799,3.468,8.492c3.816,15.13,11.205,28.232,23.732,37.515c7.947,5.89,14.554,10.198,28.459,13.404 c1.392,0.321,2.812,0.579,4.239,0.789c0.031,27.796,0.061,69.604,0.086,105.236c0.01,13.829,0.018,26.73,0.026,37.518 c0,0.826-0.081,1.652-0.122,2.436c-3.478,0.597-4.621-0.495-4.724-4.511c-0.072-2.822-0.002-5.649-0.016-8.473 c-0.024-4.802-0.899-5.97-4.65-5.976c-14.561-0.022-29.123-0.01-43.684-0.009c-4.669,0-9.338,0.084-14.005-0.022 c-3.053-0.069-4.442,1.665-4.367,5.515c0.06,3.105,0.069,6.216-0.001,9.32c-0.087,3.868,1.308,5.581,4.358,5.553 c8.447-0.076,16.895-0.038,25.343-0.024c4.177,0.007,4.978,1.055,4.991,6.397c0.025,9.702,0.025,9.702-7.739,9.702 c-7.447-0.001-14.895-0.025-22.342,0.006c-3.589,0.015-4.581,1.209-4.592,5.611c-0.035,13.947-0.952,13.109,10.094,13.035 c6.669-0.045,13.339-0.032,20.008,0.002c3.56,0.018,4.503,1.226,4.575,5.638c0.172,10.455,0.172,10.455-8.128,10.455 c-7.336,0-14.672-0.024-22.009,0.01c-3.524,0.016-4.52,1.263-4.543,5.672c-0.068,12.642-0.708,12.243,9.481,12.129 c6.891-0.077,13.783-0.04,20.675-0.004c3.498,0.018,4.458,1.281,4.524,5.702c0.155,10.39,0.155,10.39-8.179,10.39 c-7.336,0-14.673-0.026-22.009,0.01c-3.478,0.017-4.479,1.296-4.492,5.736c-0.04,13.671-0.916,12.955,9.86,12.916 c17.229-0.063,34.458-0.012,51.687-0.02c4.367-0.002,5.143-1.02,5.146-6.63c0.001-1.977-0.037-3.956,0.007-5.931 c0.095-4.282,1.188-5.371,4.234-4.937c1.04,10.07,1.926,19.99,3.157,29.842c0.428,3.429,1.324,6.98,2.719,9.93 c1.211,2.56,3.418,5.993,5.207,6.013c1.76,0.02,4.509-3.383,5.144-5.954c2.047-8.292,4.073-16.802,4.708-25.395 c0.858-11.612,0.505-23.379,0.521-35.079c0.042-30.977,0.079-68.798,0.116-106.572c0.037-37.246,0.076-74.445,0.122-104.988 c3.133-0.304,5.091-0.635,5.091-0.635c30.14-8.658,46.968-29.062,52.808-59.383c11.384,8.931,18.575,9.683,25.075,3.382 C201.124,284.512,202.132,275.945,197.21,270.21z M47,99c0-29.823,24.177-54,54-54s54,24.177,54,54c0,29.823-24.177,54-54,54 S47,128.823,47,99z M101,333c-29.823,0-54-24.177-54-54c0-29.823,24.177-54,54-54s54,24.177,54,54C155,308.823,130.823,333,101,333z",
                clocks: {
                    1: { x: 101, y: 99 },
                    2: { x: 101, y: 279 }
                }
            },
            3: {
                height: 915,
                width: 280,
                path: "M264.644,256.836c-13.719,1.508,3.345-15.515,3.955-23.109l-0.113,0.113 c8.127-22.574,2.75-46.079-10.802-65.608c14.365-1.735,19.981-6.287,20.122-15.339c0.118-7.617-5.228-14.388-12.762-14.963 c-3.451-0.263-7.412,0.636-10.496,2.245c-6.369,3.324-6.896,10.001-7.248,17.67c-12.146-8.157-24.329-12.988-36.575-14.34 c-2.94-2.54-4.264-6.236-3.879-10.997c0.451-5.587,0.239-11.066-0.572-16.359c0.828-2.872,1.549-5.847,2.156-8.934 c5.672,5.174,10.766,9.523,17.62,7.369c3.319-1.043,6.755-3.208,9.009-5.835c4.921-5.734,3.914-14.302-1.556-19.605 c-6.5-6.301-13.69-5.549-25.075,3.382c-4.859-25.231-17.337-43.587-38.753-54.031h0.16c-4.626-2.154-9.17-3.89-14.214-5.352 c0,0-0.531-0.089-1.47-0.217c-2.443-0.731-4.799-2.02-7.813-3.273c2.122-2.282,3.284-3.455,4.36-4.703 c11.919-14.528-7.139-33.128-21.334-21.077c-6.156,5.556-6.869,14.49-1.662,20.831c4.19,5.103,3.94,5.403-2.512,8.055 c-1.809,0.744-3.636,1.465-5.466,2.187c-24.606,7.636-40.884,25.17-46.812,49.517c-0.679,2.693-2.099,5.2-3.468,8.492 c-2.282-2.122-3.455-3.284-4.703-4.36c-14.53-11.92-33.128,7.141-21.077,21.334c5.556,6.156,14.49,6.869,20.831,1.662 c4.703-3.861,5.33-3.938,7.475,1.121c-1.307,6.455-1.737,13.153-1.393,20.07c0.299,6.021-1.495,10.081-5.347,12.597 c-8.875,2.041-17.121,6.122-25.527,9.641c-6.438,2.687-6.826,2.652-7.472-3.919c-0.802-8.165-7.624-13.978-15.906-13.554 c-18.552,1.513-18.888,28.143-0.181,29.989c1.643,0.122,3.294,0.129,6.408,0.242c-1.364,3.314-2.11,5.983-3.553,8.457 c-3.423,5.731-6.113,11.664-7.9,17.783c-4.714,16.129-2.529,34.548,5.987,50.332c1.798,5.682,8.556,13.371-1.601,12.882 c-39.937,12.95,18.387,54.029,16.678,9.675c34.727,3.22,46.619,41.854,80.32,49.596c7.951,2.786,11.162,6.66,12.027,13.702 c0.012,3.236,0.01,6.493,0,9.814h-0.222c0,2.083,0,3.751,0,5.345c-0.178,0.092-0.323,0.184-0.457,0.268 c-7.211-0.002-14.005-0.041-20.79,0.015c-4.483,0.037-6.154,1.09-6.592,4.667c-0.352,4.638-0.043,9.45-0.131,14.122 c0.062,5.274,1.49,6.69,6.861,6.724c6.999,0.045,13.998,0.011,20.973,0.011c0,1.857,0,3.514,0,5.671 c-6.975,0-13.974-0.034-20.973,0.011c-5.372,0.035-6.799,1.45-6.861,6.724c0.087,4.671-0.221,9.484,0.131,14.122 c0.438,3.577,2.109,4.63,6.592,4.667c6.785,0.056,13.579,0.017,20.79,0.015c0.134,0.084,0.279,0.175,0.457,0.268 c0,1.594,0,3.262,0,5.345h0.21c0.031,3.845,0.031,7.68,0,11.525h-0.21c0,2.083,0,3.751,0,5.345 c-0.178,0.092-0.323,0.184-0.457,0.268c-7.211-0.002-14.005-0.041-20.79,0.015c-4.483,0.037-6.154,1.09-6.592,4.667 c-0.352,4.638-0.043,9.45-0.131,14.122c0.062,5.274,1.49,6.69,6.861,6.724c6.999,0.045,13.998,0.011,20.973,0.011 c0,1.857,0,3.514,0,5.671c-6.975,0-13.974-0.034-20.973,0.011c-5.372,0.035-6.799,1.45-6.861,6.724 c0.087,4.671-0.221,9.484,0.131,14.122c0.438,3.577,2.109,4.63,6.592,4.667c6.785,0.056,13.579,0.017,20.79,0.015 c0.134,0.084,0.279,0.175,0.457,0.268c0,1.594,0,3.262,0,5.345h0.21c0.031,3.845,0.031,7.68,0,11.525h-0.21c0,2.083,0,3.751,0,5.345 c-0.178,0.092-0.323,0.184-0.457,0.268c-7.211-0.002-14.005-0.041-20.79,0.015c-4.483,0.037-6.154,1.09-6.592,4.667 c-0.352,4.638-0.043,9.45-0.131,14.122c0.062,5.274,1.49,6.69,6.861,6.724c6.999,0.045,13.998,0.011,20.973,0.011 c0,1.857,0,3.514,0,5.671c-6.975,0-13.974-0.034-20.973,0.011c-5.372,0.035-6.799,1.45-6.861,6.724 c0.087,4.671-0.221,9.484,0.131,14.122c0.438,3.577,2.109,4.63,6.592,4.667c6.785,0.056,13.579,0.017,20.79,0.015 c0.134,0.084,0.279,0.175,0.457,0.268c0,1.594,4.559,168.228,4.51,209.286c-0.005,4.1,0.442,9.128,0.442,10.259 c-3.396,0-6.234,0.133-9.054-0.034c-3.499-0.206-5.37,1.456-6.735,4.558c-1.281,2.913-2.803,5.866-4.843,8.27 c-6.58,7.751-16.578,7.84-23.206,0.144c-2.209-2.565-3.736-5.81-5.169-8.932c-1.239-2.699-2.939-4.083-5.916-4.024 c-3.712,0.073-7.428,0.078-11.14-0.009c-3.163-0.074-4.936,1.432-6.143,4.306c-1.141,2.716-2.476,5.469-4.285,7.764 c-8.725,11.281-23.01,6.923-27.966-5.357c-1.496-5.628-5.039-7.274-10.521-6.767c-4.485,0.415-6.285,1.937-6.286,6.612 c-0.001,15.755-0.002,31.511-0.003,47.266c-0.001,16.376-0.012,32.752,0.006,49.127c0.004,3.646,2.039,5.706,5.586,5.765 c4.244-0.151,7.724,1.078,9.747-3.72c1.63-3.566,3.31-7.297,5.811-10.239c5.927-6.969,15.25-7.396,21.596-0.827 c2.91,3.012,4.885,7.078,6.716,10.936c1.245,2.623,2.748,3.896,5.573,3.857c3.96-0.055,7.925-0.102,11.882,0.027 c3.041,0.099,4.629-1.359,5.914-4.011c1.386-2.861,3.016-5.766,5.166-8.063c10.107-10.412,22.254-3.718,27.139,8.037 c1.337,2.907,3.18,4.141,6.281,4.034c3.442-0.119,6.891-0.027,10.523-0.027c1.065,5.652,2.167,11.021,3.856,16.453 c1.228,3.675,2.407,8.536,7.056,8.594c4.923,0.061,6.042-4.987,7.307-8.743c1.456-4.322,2.867-8.847,3.125-13.35 c0.728-12.721,1.152-25.477,1.174-38.219c0.19-111.404,0.292,50.177,0.366-61.227c0.003-5.129,0.201-18.49,0.201-22.46 c0-41.693,4.098-203.286,4.098-209.558c8.112,0,15.82-0.053,23.528,0.021c5.544,0.13,6.64-3.323,6.288-8.201 c0.033-3.547,0.038-7.095-0.007-10.642c-0.066-5.278-1.476-6.669-6.885-6.701c-7.529-0.044-15.059-0.011-22.958-0.011 c0-1.903,0-3.56,0-5.671c7.899,0,15.429,0.033,22.958-0.011c5.408-0.032,6.819-1.423,6.885-6.701 c0.044-3.547,0.04-7.095,0.007-10.642c0.351-4.882-0.742-8.33-6.288-8.201c-7.707,0.073-15.416,0.021-23.527,0.021 c0-7.602,0-15.147,0-22.76c8.112,0,15.82-0.053,23.528,0.021c5.544,0.13,6.64-3.323,6.288-8.201 c0.033-3.547,0.038-7.095-0.007-10.642c-0.066-5.278-1.476-6.669-6.885-6.701c-7.529-0.044-15.059-0.011-22.958-0.011 c0-1.903,0-3.56,0-5.671c7.899,0,15.429,0.033,22.958-0.011c5.408-0.032,6.819-1.423,6.885-6.701 c0.044-3.547,0.04-7.095,0.007-10.642c0.351-4.882-0.742-8.33-6.288-8.201c-7.707,0.073-15.416,0.021-23.527,0.021 c0-7.602,0-15.147,0-22.76c8.112,0,15.82-0.053,23.528,0.021c5.544,0.13,6.64-3.323,6.288-8.201 c0.033-3.547,0.038-7.095-0.007-10.642c-0.066-5.278-1.476-6.669-6.885-6.701c-7.529-0.044-15.059-0.011-22.958-0.011 c0-1.903,0-3.56,0-5.671c7.899,0,15.429,0.033,22.958-0.011c5.408-0.032,6.819-1.423,6.885-6.701 c0.044-3.547,0.04-7.095,0.007-10.642c0.351-4.882-0.742-8.33-6.288-8.201c-7.707,0.073-15.416,0.021-23.527,0.021 c0-4.636,0-9.23,0-13.831c1.183-7.638,5.989-13.149,13.965-15.825c28.456-7.104,41.808-33.352,64.888-48.287 c17.492-10.743,9.354,22.937,28.518,19.129C283.019,285.31,283.347,258.682,264.644,256.836z M106.588,838.075 c0.498,2.38,0.15,4.934-3.302,4.884c-2.295-0.033-3.176,1.042-3.702,3.217c-0.26,1.076-1.713,2.383-2.793,2.559 c-0.723,0.118-2.36-1.479-2.505-2.467c-0.409-2.804-2.004-3.344-4.385-3.299c-3.709,0.07-7.424,0.116-11.131-0.006 c-3.83-0.126-3.945,2.278-3.981,5.13c-0.038,2.976,0.755,4.826,4.142,4.589c1.477-0.103,2.968,0.015,4.451-0.025 c2.202-0.059,4.543-0.006,4.579,2.901c0.039,3.187-2.477,3.119-4.78,3.068c-1.36-0.03-2.728,0.082-4.08-0.025 c-3.258-0.257-4.5,1.312-4.272,4.425c-0.041,4.353,1.027,8.028-4.883,7.506c-7.022,0.039-7.951,0.802-7.543-7.405 c0.169-3.39-1.192-4.855-4.554-4.524c-0.857,0.085-1.922,0.329-2.555-0.056c-1.2-0.729-2.156-1.861-3.213-2.825 c1.006-1.017,1.944-2.121,3.057-3.004c0.38-0.301,1.199-0.042,1.817-0.044c5.007-0.022,7.131-2.986,5.196-7.646 c-0.392-0.945-1.974-1.785-3.11-1.944c-3.651-0.437-7.442,0.158-11.117-0.121c-3.786-0.387-5.894,0.721-5.698,5.061 c0.045,0.996-1.78,2.077-2.744,3.119c-0.848-1.038-2.451-2.105-2.412-3.108c0.153-3.932-1.445-5.27-5.269-5.225 c-1.017,0.012-2.491-1.899-2.973-3.215c-0.52-1.421-0.127-3.18-0.126-4.791c0-5.24-0.002-5.268,5.3-5.954 c2.366-0.306,3.023-1.787,2.927-3.889c-0.098-2.143,0.268-4.425,2.848-4.073c1.034,0.141,2.342,2.528,2.49,3.998 c0.282,2.788,1.314,4.039,4.131,3.976c3.956-0.088,7.919-0.125,11.873,0.011c3.063,0.105,4.168-1.204,4.13-4.212 c-0.036-2.816-0.326-5.041-3.916-4.755c-2.559,0.203-4.468-0.474-4.367-3.527c0.095-2.865,2.016-3.344,4.358-3.173 c2.898,0.212,3.849-1.243,3.979-4.019c0.085-1.821,0.73-5.002,1.563-5.153c3.046-0.553,6.308-0.31,9.408,0.165 c0.646,0.099,1.284,2.453,1.345,3.795c0.224,4.967,0.374,5.207,5.401,5.214c1.361,0.002,2.929-0.422,4.027,0.116 c1.271,0.623,2.94,2.09,2.942,3.194c0.002,1.125-1.621,2.815-2.876,3.241c-1.665,0.565-3.667,0.223-5.518,0.132 c-3.18-0.157-3.971,1.57-3.952,4.398c0.019,2.703,0.495,4.64,3.783,4.569c3.956-0.085,7.916-0.055,11.873-0.012 c2.165,0.024,3.322-0.763,3.826-3.068c0.241-1.105,1.771-1.927,2.718-2.877c0.905,0.971,2.333,1.814,2.605,2.939 c0.545,2.256,1.757,2.7,3.843,3.111C109.293,830.102,105.927,834.915,106.588,838.075z M140,45c29.823,0,54,24.177,54,54 c0,29.823-24.177,54-54,54s-54-24.177-54-54C86,69.177,110.177,45,140,45z M20,211c0-29.823,24.177-54,54-54s54,24.177,54,54 c0,29.823-24.177,54-54,54S20,240.823,20,211z M145.836,856.899c-2.09,2.578-1.865,5.176-1.942,7.953 c-0.024,0.854,0.131,1.914-0.302,2.509c-2.403,3.147-3.159,2.809-5.436-0.185c-0.264-0.306-0.178-0.948-0.184-1.437 c-0.041-3.271,0.536-6.657-2.369-9.253c-0.531-0.475-0.479-1.605-0.957-3.425c1.21-1.271,2.47-3.306,4.294-4.333 c2.379-1.339,5.236-0.58,6.441,1.819C146.297,852.368,146.841,855.658,145.836,856.899z M145.888,806.942 c-2.224,2.677-1.877,5.438-1.992,8.318c-0.086,2.146-0.2,4.578-2.99,4.544c-2.765-0.034-2.874-2.475-2.933-4.614 c-0.08-2.895,0.543-5.919-2.179-8.193c-0.631-0.527-0.645-1.797-1.234-3.633c1.265-1.382,2.48-3.465,4.292-4.5 c2.341-1.338,5.233-0.649,6.476,1.731C146.273,802.404,146.882,805.745,145.888,806.942z M80.954,278.695 c17.171-3.582,56.234-25.446,59.296-50.487c5.518,22.114,30,48.729,61,48.729C163.662,318.773,121.322,320.28,80.954,278.695z  M206,265c-29.823,0-54-24.177-54-54c0-29.823,24.177-54,54-54s54,24.177,54,54C260,240.823,235.823,265,206,265z",
                clocks: {
                    1: { x: 140, y: 99 },
                    2: { x: 74, y: 211 },
                    3: { x: 206, y: 211 }
                }
            },
            4: {
                height: 1040,
                width: 376,
                path: "M369.601,177.882c-2.159-2.705-5.464-5.038-8.725-6.201c-7.211-2.57-12.634,1.794-18.155,7.261 c-1.008-3.182-1.811-5.292-2.346-7.468c-7.207-29.311-25.676-46.993-55.052-53.142c-3.565-0.746-4.337-2.365-5.721-5.525 c-10.917-24.928-15.917-32.928-31.863-49.408c-1.625-1.679-3.453-3.192-5.144-4.761c-15.909-14.758-20.909-17.758-43.492-26.71 c-1.882-0.746-3.781-1.782-6.866-3.302c2.349-1.876,3.694-2.659,4.662-3.772c4.695-5.397,4.837-13.436,0.452-19.014 c-5.3-6.742-15-7.806-21.456-2.354c-6.714,5.67-7.304,15.417-1.328,21.919c3.617,3.935,3.297,5.361-1.725,7.153 c-2.044,0.73-4.17,1.226-6.237,1.896c-12.766,4.137-23.255,11.604-31.918,21.798c-2.372,2.791-4.778,5.622-7.539,8.002 c-15.564,13.413-26.166,29.895-31.108,49.904c-0.68,2.752-1.741,4.084-4.825,4.54c-29.053,4.299-51.461,25.809-57.16,54.556 c-0.307,1.549-0.792,3.062-1.25,4.806c-11.35-8.302-18-8.998-24.401-2.862c-5.321,5.101-6.467,13.398-1.935,19.203 c2.036,2.608,5.192,4.836,8.302,6.005c7.137,2.683,12.59-1.579,17.735-6.353c0.583,1.299,1.01,1.874,1.096,2.496 c4.046,29.315,27.997,53.277,57.826,57.393c2.746,0.379,3.942,1.437,4.664,4.114c1.304,4.836,2.88,9.632,4.767,14.272 c9.432,23.198,28.811,38.203,45.823,55.084c5.104,5.065,11.204,9.197,17.156,13.308c5.563,3.842,7.792,8.391,7.788,15.456 c-0.129,188.254-0.004,308.508,0.065,496.762c0,0.102-0.005,0.205-0.006,0.307v41.241c-2.701,0.026-5.102,0.092-7.461-0.047 c-3.499-0.206-5.37,1.456-6.735,4.558c-1.282,2.913-2.803,5.866-4.844,8.27c-6.581,7.751-16.578,7.84-23.206,0.144 c-2.209-2.565-3.737-5.81-5.169-8.932c-1.239-2.699-2.938-4.083-5.916-4.024c-3.712,0.073-7.428,0.078-11.14-0.009 c-3.163-0.074-4.936,1.432-6.143,4.306c-1.141,2.716-2.476,5.469-4.285,7.764c-8.725,11.281-23.01,6.923-27.966-5.357 c-1.496-5.628-5.039-7.274-10.521-6.767c-4.485,0.415-6.285,1.937-6.286,6.612c-0.001,15.755-0.002,31.511-0.003,47.266 c-0.001,16.376-0.012,32.752,0.006,49.127c0.004,3.646,2.039,5.706,5.586,5.765c4.244-0.151,7.724,1.078,9.747-3.72 c1.63-3.566,3.31-7.297,5.811-10.239c5.927-6.969,15.25-7.396,21.596-0.827c2.91,3.012,4.885,7.078,6.716,10.936 c1.245,2.623,2.749,3.896,5.573,3.857c3.96-0.055,7.925-0.102,11.882,0.027c3.041,0.099,4.629-1.359,5.914-4.011 c1.386-2.861,3.016-5.766,5.166-8.063c10.107-10.412,22.254-3.718,27.139,8.037c1.337,2.907,3.181,4.141,6.281,4.034 c2.715-0.094,5.446-0.058,8.257-0.038v2.091c0.319,0.001,0.631,0.004,0.951,0.004c0.362,2.11,0.473,3.786,0.947,5.352 c2.41,7.972,4.19,16.244,7.596,23.773c3.168,7.005,9.289,6.901,12.709-0.011c2.932-5.925,5.134-12.395,6.525-18.868 c4.01-18.662,2.675-37.664,2.696-56.567c0.133-118.853,0.314,0.295,0.392-118.558c0.068-103.934,0.013-377.867,0.064-481.801 c0.001-2.781-0.281-6.125,1.073-8.24c4.886-7.634,8.978-15.851,18.168-20.058c5.139-2.352,9.257-7.045,13.652-10.893 c4.267-3.736,8.16-7.904,12.459-11.599c15.452-13.278,26.023-29.619,30.885-49.451c0.909-3.707,2.926-4.598,6.161-5.73 c8.764-3.067,17.943-5.775,25.742-10.598c14.82-9.164,23.822-23.162,28.263-40.071c0.703-2.678,1.909-5.223,2.991-8.122 c11.076,8.596,18.006,9.328,24.489,3.223C372.838,191.953,374.115,183.538,369.601,177.882z M150.628,951.351 c0.498,2.38,0.15,4.934-3.302,4.884c-2.294-0.033-3.176,1.042-3.702,3.217c-0.26,1.076-1.713,2.383-2.793,2.559 c-0.723,0.118-2.36-1.479-2.504-2.467c-0.409-2.804-2.004-3.344-4.384-3.299c-3.709,0.07-7.424,0.116-11.131-0.006 c-3.83-0.126-3.945,2.278-3.981,5.13c-0.038,2.976,0.755,4.826,4.142,4.589c1.477-0.103,2.968,0.015,4.451-0.025 c2.202-0.059,4.543-0.006,4.579,2.901c0.04,3.187-2.477,3.119-4.78,3.068c-1.36-0.03-2.728,0.082-4.08-0.025 c-3.258-0.257-4.5,1.312-4.272,4.425c-0.041,4.353,1.027,8.028-4.883,7.506c-7.022,0.039-7.951,0.802-7.542-7.405 c0.168-3.39-1.192-4.855-4.555-4.524c-0.857,0.085-1.922,0.329-2.555-0.056c-1.2-0.729-2.156-1.861-3.213-2.825 c1.006-1.017,1.944-2.121,3.057-3.004c0.379-0.301,1.199-0.042,1.817-0.044c5.007-0.022,7.131-2.986,5.197-7.646 c-0.393-0.945-1.975-1.785-3.11-1.944c-3.651-0.437-7.442,0.158-11.117-0.121c-3.786-0.387-5.894,0.721-5.698,5.061 c0.045,0.996-1.78,2.077-2.744,3.119c-0.848-1.038-2.451-2.105-2.412-3.108c0.153-3.932-1.445-5.27-5.269-5.225 c-1.017,0.012-2.491-1.899-2.973-3.215c-0.52-1.422-0.127-3.18-0.126-4.791c0.001-5.24-0.002-5.268,5.3-5.954 c2.366-0.306,3.023-1.787,2.927-3.889c-0.098-2.143,0.268-4.425,2.848-4.073c1.034,0.141,2.342,2.528,2.49,3.998 c0.282,2.788,1.314,4.039,4.131,3.976c3.956-0.088,7.919-0.125,11.872,0.011c3.063,0.105,4.168-1.204,4.13-4.212 c-0.035-2.816-0.326-5.041-3.916-4.755c-2.559,0.203-4.468-0.474-4.367-3.527c0.095-2.865,2.016-3.344,4.358-3.173 c2.898,0.212,3.849-1.243,3.979-4.019c0.085-1.821,0.73-5.002,1.563-5.153c3.046-0.553,6.308-0.31,9.408,0.165 c0.646,0.099,1.284,2.453,1.345,3.795c0.224,4.967,0.375,5.207,5.402,5.214c1.361,0.002,2.928-0.423,4.027,0.116 c1.272,0.623,2.94,2.09,2.943,3.194c0.002,1.125-1.621,2.815-2.876,3.241c-1.666,0.565-3.668,0.223-5.518,0.132 c-3.18-0.157-3.971,1.57-3.952,4.398c0.019,2.703,0.495,4.64,3.783,4.569c3.957-0.085,7.916-0.055,11.874-0.012 c2.166,0.024,3.322-0.763,3.826-3.068c0.242-1.105,1.771-1.927,2.718-2.877c0.905,0.971,2.333,1.814,2.605,2.939 c0.545,2.256,1.757,2.7,3.843,3.111C153.332,943.378,149.967,948.19,150.628,951.351z M256.485,97.71 c0.287-0.167,0.574-0.334,0.861-0.502c2.841,6.521,5.683,13.042,8.739,20.056c-4.719,1.002-8.414,1.787-12.443,2.642 C254.621,112.258,255.553,104.984,256.485,97.71z M188,45c29.823,0,54,24.177,54,54c0,29.823-24.177,54-54,54s-54-24.177-54-54 C134,69.177,158.177,45,188,45z M165.961,164.715c14.218,3.796,27.946,4.565,42.414-0.072c-3.942,14.414-4.001,28.063,0.302,42.583 c-14.189-3.96-27.779-4.487-42.527-0.062C170.41,192.592,170.307,179.098,165.961,164.715z M117.913,98.455 c0.292,0.134,0.583,0.269,0.875,0.403c1.095,7.133,2.19,14.267,3.378,22.01c-3.852-0.843-7.747-1.695-12.458-2.726 C112.553,111.314,115.233,104.884,117.913,98.455z M117.953,273.982c-2.992-7.299-5.446-13.283-8.044-19.622 c4.192-0.951,7.557-1.714,11.303-2.564C120.156,258.986,119.177,265.652,117.953,273.982z M101,239c-29.823,0-54-24.177-54-54 c0-29.823,24.177-54,54-54s54,24.177,54,54C155,214.823,130.823,239,101,239z M194.181,960.628 c-2.889,3.631-2.59,7.316-2.675,11.229c-0.063,2.929-0.301,6.185-4.102,6.083c-3.718-0.099-3.92-3.373-3.912-6.266 c0.01-3.961,0.532-7.956-2.966-11.069c-0.843-0.75-0.86-2.433-1.653-4.938c1.737-1.842,3.427-4.577,5.876-5.996 c3.218-1.864,7.078-0.801,8.743,2.361C194.772,954.463,195.53,958.932,194.181,960.628z M194.24,893.097 c-2.75,3.639-2.754,7.277-2.731,11.231c0.017,2.954-0.303,6.162-3.967,6.219c-3.722,0.058-4.036-3.156-4.069-6.118 c-0.044-3.915,0.729-7.982-2.898-11.07c-0.855-0.728-0.902-2.408-1.792-5.047c1.877-1.885,3.726-5.163,6.313-5.925 c2.41-0.711,6.606,0.411,8.177,2.279C194.863,886.556,195.545,891.372,194.24,893.097z M194.262,829.008 c-3.107,3.329-2.592,6.926-2.795,10.682c-0.086,1.597-0.323,3.33-1.04,4.717c-1.41,2.725-4.298,2.744-5.822,0.114 c-0.63-1.087-1.04-2.453-1.075-3.706c-0.125-4.43,0.653-9.009-3.304-12.472c-0.62-0.543-0.572-1.852-0.833-2.806 c-0.315-0.34-0.629-0.679-0.944-1.019c2.103-2.244,3.85-5.571,6.413-6.415c2.391-0.788,6.184,0.324,8.392,1.933 C196.183,822.167,196.727,826.367,194.262,829.008z M188,327c-29.823,0-54-24.177-54-54c0-29.823,24.177-54,54-54s54,24.177,54,54 C242,302.823,217.823,327,188,327z M256.652,276.564c-0.265-0.133-0.531-0.265-0.796-0.398c-1.015-8.257-2.029-16.515-3.086-25.115 c4.167,0.862,8.324,1.721,13.585,2.809C263.025,261.653,259.839,269.108,256.652,276.564z M275,239c-29.823,0-54-24.177-54-54 c0-29.823,24.177-54,54-54c29.823,0,54,24.177,54,54C329,214.823,304.823,239,275,239z",
                clocks: {
                    1: { x: 188, y: 99 },
                    2: { x: 101, y: 185 },
                    3: { x: 275, y: 185 },
                    4: { x: 188, y: 273 }
                }
            },
            5: {
                height: 1140,
                width: 376,
                path: "M368.571,176.185c-5.856-6.593-15.147-6.888-21.897-0.694c-3.717,3.411-4.299,3.242-5.541-1.587 c-0.25-0.972-0.571-1.926-0.803-2.901c-6.223-26.032-22.396-42.736-47.523-51.238c-2.474-0.837-4.808-2.72-6.666-4.641 c-6.618-6.844-12.426-14.598-19.638-20.709c-7.25-6.144-14.426-11.753-15.964-21.863c-0.145-0.952-0.81-1.83-1.262-2.728 c-10.14-20.142-26.293-32.5-48.2-37.503c-2.572-0.587-5.014-1.743-8.025-2.817c1.316-1.702,1.86-2.531,2.526-3.247 c6.502-6.986,6.698-15.783,0.465-21.94c-5.785-5.714-15.027-5.762-20.84-0.11c-6.368,6.191-6.436,15.084,0.239,21.857 c2.991,3.035,1.728,4.561-1.167,5.98c-1.334,0.654-2.844,0.952-4.281,1.387c-24.857,7.514-40.936,23.712-48.399,48.654 c-0.748,2.499-2.69,4.83-4.561,6.77c-8.684,9.004-17.485,17.897-26.377,26.695c-1.782,1.764-3.95,3.591-6.269,4.287 C57.114,128.023,40.142,145.743,34,173.701c-0.306,1.391-0.752,2.75-1.182,4.299c-11.942-8.326-18.43-8.891-24.733-2.424 c-5.16,5.294-6.085,13.716-1.351,19.24c2.253,2.629,5.655,4.841,8.962,5.874c6.77,2.115,12.009-1.8,16.717-6.757 c0.647,1.364,1.068,1.923,1.182,2.539c5.495,29.672,22.939,48.289,51.806,56.504c1.891,0.538,3.666,2.056,5.112,3.503 c8.725,8.731,17.397,17.519,25.942,26.426c1.755,1.83,3.532,4.061,4.227,6.423c5.507,18.702,16.574,32.696,33.076,43.228 c6.667,4.255,11.428,11.52,16.987,17.48c0.5,0.535,0.688,1.544,0.692,2.334c0.044,10.877,0.03,21.753,0.03,32.638 c-1.577,0.516-2.845,0.932-4.113,1.346c-17.135,5.597-30.511,16.033-39.024,31.952c-3.426,6.407-5.333,13.646-7.754,20.57 c-1.772,5.068-3.147,5.547-6.984,2.009c-4.295-3.96-9.283-5.23-14.871-3.538c-5.98,1.811-10.168,7.224-10.559,13.345 c-0.384,6.021,2.865,11.744,8.198,14.44c5.644,2.854,12.024,2.019,16.834-2.202c4.386-3.85,4.832-3.79,6.954,1.641 c1.156,2.96,1.77,6.15,3.077,9.031c2.549,5.62,4.886,11.444,8.247,16.568c9.497,14.478,23.2,23.357,39.755,28.018 c0,9.673,0,19.154,0,28.542c-0.539,0.233-0.829,0.466-1.122,0.469c-5.522,0.049-11.045,0.088-16.568,0.095 c-9.805,0.013-10.191,0.382-10.188,9.959c0.001,2.347-0.002,4.695,0,7.042c0.008,7.059,1.061,8.147,7.942,8.157 c6.643,0.01,13.286,0.002,20.223,0.002c-0.115,2.368-0.198,4.098-0.292,6.035c-7.528,0-14.546,0.054-21.562-0.02 c-4.351-0.046-6.4,1.975-6.325,6.327c0.066,3.855-0.01,7.712,0.012,11.568c0.033,5.918,1.364,7.248,7.324,7.269 c6.815,0.024,13.63,0.006,20.474,0.006c0,2.623,0,4.683,0,7.044c-7.015,0-13.688-0.017-20.362,0.005 c-6.069,0.02-7.373,1.289-7.434,7.19c-0.028,2.682,0.18,5.38-0.039,8.044c-0.443,5.389,0.07,10.039,6.912,10.524 c-3.015,31.457-2.572,62.398,2.234,93.196c2.98,19.097,7.19,37.854,16.599,55.063c1.443,2.639,2.397,5.924,2.406,8.914 c0.209,63.543,0.251,127.087,0.325,190.631c0.002,1.795,0,3.59,0,5.442c-5.238,0.679-7.397-1.369-7.347-5.986 c0.035-3.185,0.024-6.371,0.006-9.557c-0.034-5.945-1.325-7.274-7.309-7.285c-17.074-0.032-34.148-0.022-51.222-0.026 c-11.718-0.003-23.435-0.029-35.153,0.013c-5.235,0.019-6.699,1.54-6.756,6.814c-0.038,3.521-0.04,7.042,0.004,10.562 c0.066,5.255,1.516,6.725,6.823,6.744c11.215,0.04,22.431,0.01,33.646,0.013c11.868,0.003,11.868,0.005,11.75,11.912 c-0.059,5.922-1.3,7.16-7.407,7.176c-12.22,0.031-24.439,0.018-36.659,0.029c-7.054,0.006-8.155,1.08-8.167,7.935 c-0.004,2.18-0.006,4.359,0.001,6.539c0.021,6.383,1.222,7.644,7.439,7.655c11.048,0.02,22.096,0.002,33.144,0.006 c11.791,0.005,11.791,0.008,11.648,12.012c-0.067,5.703-1.367,7.062-7.047,7.083c-10.378,0.04-20.758,0.096-31.135-0.002 c-15.122-0.144-14.146-0.478-14.047,14.132c0.038,5.646,1.377,6.992,7.074,7.008c11.048,0.031,22.096,0.007,33.144,0.01 c12.19,0.003,12.19,0.005,12.011,12.153c-0.083,5.597-1.413,6.924-7.187,6.944c-10.211,0.034-20.423,0.089-30.633-0.001 c-15.773-0.139-14.465-0.577-14.406,14.774c0.024,6.173,1.313,7.37,7.73,7.375c13.726,0.011,27.452,0.005,41.179,0.003 c14.898-0.002,29.796,0.018,44.694-0.027c5.339-0.016,6.767-1.487,6.831-6.742c0.033-2.682-0.046-5.366,0.02-8.047 c0.126-5.106,1.839-6.469,8.044-5.697c0,5.722-0.455,11.611,0.097,17.404c1.067,11.188,2.601,22.392,8.477,32.306 c3.979,6.714,9.383,6.86,12.855-0.118c3.015-6.062,5.915-12.737,6.496-19.35c1.579-17.969,2.543-36.045,2.614-54.083 c0.36-91.878,0.35-183.757,0.553-275.636c0.005-2.049,0.733-4.214,1.576-6.124c3.369-7.639,7.748-14.934,10.257-22.833 c11.421-35.946,13.433-72.997,11.755-110.391c-0.269-5.99-0.801-11.968-1.209-17.909c7.452-1.534,7.775-1.945,7.779-9.588 c0.001-2.515,0.011-5.03,0.007-7.545c-0.013-7.75-0.894-8.656-8.46-8.663c-7.141-0.007-14.283-0.001-21.49-0.001 c0-2.592,0-4.545,0-7.045c8.006,0,15.826-0.048,23.645,0.019c4.359,0.038,6.392-2,6.312-6.351 c-0.071-3.855,0.016-7.712-0.019-11.568c-0.053-5.938-1.345-7.219-7.35-7.242c-7.485-0.029-14.97-0.007-22.425-0.007 c0-2.304,0-4.031,0-6.035c7.861,0,15.375,0.033,22.888-0.011c5.362-0.031,6.803-1.454,6.876-6.683 c0.049-3.52,0.028-7.042,0.018-10.563c-0.019-6.708-1.157-7.881-7.7-7.895c-7.319-0.016-14.638-0.004-22.194-0.004 c0-9.967,0-19.441,0-28.963c29.736-8.515,46.433-28.883,52.451-58.803c13.274,8.8,19.828,9.143,25.982,1.96 c4.843-5.653,4.919-13.758,0.181-19.362c-6.121-7.24-12.687-6.904-26.259,1.909c-5.709-30.27-22.672-50.541-52.587-59.137 c0-11.198-0.038-22.249,0.053-33.298c0.01-1.247,0.394-2.826,1.206-3.677c5.143-5.394,9.736-11.741,15.851-15.695 c15.582-10.074,26.618-23.168,32.069-40.997c0.628-2.052,2.154-4.251,3.897-5.472c12.064-8.448,22.298-18.658,30.858-30.64 c1.152-1.613,3.13-3.039,5.018-3.658c25.281-8.283,41.226-25.241,47.874-51.032c0.549-2.129,1.536-4.145,2.62-7.008 c2.028,1.88,3.182,3.03,4.418,4.083c5.812,4.951,14.202,4.893,19.761-0.107C373.498,191.788,374.08,182.387,368.571,176.185z  M255.988,106.491c4.098,3.415,7.887,6.574,11.677,9.733c-0.404,0.395-0.807,0.791-1.211,1.186c-4.169,0.785-8.338,1.57-13.15,2.476 C254.26,115.112,255.11,110.872,255.988,106.491z M188,45c29.823,0,54,24.177,54,54c0,29.823-24.177,54-54,54s-54-24.177-54-54 C134,69.177,158.177,45,188,45z M165.967,164.581c14.357,4.18,28.096,4.578,42.513,0.199c-4.092,14.47-3.946,28.113,0.227,42.523 c-14.26-4.037-27.868-4.509-42.273-0.152C170.252,192.831,170.49,179.189,165.967,164.581z M119.421,106.593 c1.197,5.466,2.101,9.598,3.149,14.382c-4.547-0.964-8.521-1.806-13.675-2.899C112.429,114.221,115.552,110.814,119.421,106.593z  M47,185c0-29.823,24.177-54,54-54s54,24.177,54,54c0,29.823-24.177,54-54,54S47,214.823,47,185z M118.872,264.908 c-3.402-3.626-6.248-6.661-9.67-10.309c4.662-1.06,8.192-1.862,12.324-2.801C120.665,256.051,119.864,260.011,118.872,264.908z  M242,452c0,29.823-24.177,54-54,54s-54-24.177-54-54s24.177-54,54-54S242,422.177,242,452z M188,327c-29.823,0-54-24.177-54-54 c0-29.823,24.177-54,54-54s54,24.177,54,54C242,302.823,217.823,327,188,327z M255.552,266.927 c-1.167-5.669-2.154-10.46-3.262-15.84c5.154,0.97,9.935,1.87,14.716,2.77c0.446,0.541,0.892,1.082,1.338,1.623 C264.267,259.129,260.189,262.778,255.552,266.927z M275,239c-29.823,0-54-24.177-54-54c0-29.823,24.177-54,54-54 c29.823,0,54,24.177,54,54C329,214.823,304.823,239,275,239z",
                clocks: {
                    1: { x: 188, y: 99 },
                    2: { x: 101, y: 185 },
                    3: { x: 275, y: 185 },
                    4: { x: 188, y: 273 },
                    5: { x: 188, y: 452 }
                }
            },
            6: {
                height: 1150,
                width: 376,
                path: "M368.467,175.695c-5.679-5.821-14.749-6.099-20.948-0.64c-4.669,4.111-4.968,4.078-6.404-2.265 c-6.177-27.288-22.694-44.894-49.329-53.258c-1.884-0.592-3.762-2.164-4.975-3.782c-8.316-11.097-17.978-20.751-29.269-28.846 c-1.837-1.317-3.233-3.819-3.941-6.055c-8-25.264-24.763-41.209-50.369-47.905c-1.297-0.339-2.624-0.561-3.924-0.889 c-6.019-1.517-6.336-2.452-2.436-7.09c5.369-6.386,4.922-15.175-1.063-20.886c-5.693-5.432-14.781-5.438-20.547-0.013 c-5.996,5.642-6.497,14.52-1.064,20.845c0.96,1.118,2.356,1.862,5.093,3.962c-3.99,1.966-6.455,3.641-9.177,4.448 c-21.023,6.229-37.032,18.784-44.866,39.292c-3.893,10.189-9.546,17.596-17.728,24.354c-6.635,5.48-11.684,12.861-17.586,19.262 c-1.378,1.494-3.198,2.997-5.088,3.54c-28.295,8.114-45.487,26.462-51.48,55.296c-0.195,0.939-0.594,1.837-1.209,3.691 c-4.553-5.348-9.722-8.913-16.34-7.249c-3.221,0.81-6.588,2.773-8.882,5.175c-5.095,5.334-4.771,13.753,0.038,19.303 c6.058,6.992,12,6.71,25.577-1.455c0.719,3.002,1.319,5.886,2.102,8.72c7.121,25.788,23.757,42.057,49.321,49.576 c2.493,0.733,4.866,2.606,6.773,4.48c8.579,8.431,17.025,17,25.384,25.649c1.764,1.825,3.63,4,4.316,6.346 c5.587,19.106,16.969,33.263,33.937,43.84c6.556,4.087,11.1,11.42,16.482,17.345c0.479,0.527,0.533,1.575,0.535,2.382 c0.033,10.725,0.022,21.45,0.022,30.645c-9.536,5.418-18.784,9.553-26.732,15.443c-12.526,9.284-19.916,22.385-23.732,37.515 c-0.679,2.693-2.099,5.2-3.468,8.492c-2.282-2.122-3.455-3.284-4.703-4.36c-6.057-5.222-14.978-4.864-20.538,0.799 c-5.594,5.698-5.83,14.673-0.539,20.534c5.556,6.156,14.49,6.869,20.831,1.662c5.103-4.19,5.403-3.94,8.055,2.512 c3.424,8.33,6.348,17.054,11.07,24.62c8.365,13.404,20.984,21.857,36.018,26.74c1.432,0.465,3.545,1.997,3.581,3.092 c0.293,8.838,0.164,17.69,0.164,27.078c-7.464,0-14.461-0.043-21.457,0.014c-5.297,0.043-6.676,1.492-6.724,6.866 c-0.033,3.691-0.03,7.382-0.004,11.072c0.042,5.933,1.282,7.145,7.424,7.173c6.691,0.031,13.383,0.007,20.414,0.007 c0,2.031,0,3.762,0,6.077c-6.975,0-13.974-0.034-20.973,0.011c-5.372,0.035-6.799,1.45-6.861,6.724 c-0.047,4.026,0.044,8.054-0.023,12.079c-0.072,4.325,1.898,6.385,6.299,6.345c6.876-0.063,13.753,0.049,20.629,0.113 c0.289,0.003,0.574,0.279,1.065,0.534c0,1.856,0,3.81,0,6.407c-7.029,0-14.019-0.032-21.009,0.01 c-5.652,0.034-7.334,1.395-6.872,7.119c0.694,8.601-1.289,15.249-8.006,21.638c-8.605,8.185-13.036,19.34-15.463,31.089 c-1.309,6.335-2.096,6.555-6.889,2.398c-6.287-5.453-15.195-5.103-20.871,0.819c-5.657,5.902-5.624,15.003,0.076,20.896 c5.702,5.895,14.51,6.153,20.855,0.613c1.117-0.975,2.238-1.945,4.238-3.682c1.129,2.807,2.274,4.924,2.843,7.186 c4.769,18.938,15.137,33.728,31.864,44.051c1.736,1.072,3.27,3.377,3.775,5.392c3.397,13.548,7.363,26.834,14.685,38.904 c0.804,1.325,1.03,3.177,1.033,4.786c0.118,64.926,0.18,129.852,0.239,194.778c0.001,0.981-0.122,1.963-0.184,2.894 c-5.249,0.709-6.974-0.588-7.13-5.358c-0.109-3.352-0.003-6.71-0.024-10.065c-0.036-5.705-1.357-7.092-7.019-7.099 c-21.978-0.026-43.956-0.012-65.933-0.011c-7.046,0-14.094,0.1-21.138-0.026c-4.607-0.082-6.704,1.978-6.591,6.552 c0.09,3.689,0.104,7.384-0.002,11.072c-0.132,4.595,1.974,6.629,6.578,6.597c12.75-0.09,25.501-0.045,38.251-0.028 c6.305,0.008,7.513,1.253,7.533,7.599c0.038,11.525,0.038,11.526-11.68,11.525c-11.24-0.001-22.481-0.03-33.722,0.007 c-5.418,0.018-6.914,1.437-6.931,6.666c-0.053,16.568-1.437,15.572,15.235,15.484c10.066-0.053,20.132-0.038,30.198,0.002 c5.373,0.021,6.796,1.457,6.905,6.697c0.259,12.419,0.259,12.419-12.268,12.419c-11.073,0-22.146-0.028-33.218,0.011 c-5.319,0.019-6.822,1.501-6.857,6.738c-0.102,15.018-1.068,14.544,14.31,14.408c10.401-0.092,20.803-0.047,31.205-0.005 c5.279,0.022,6.729,1.522,6.828,6.773c0.234,12.342,0.234,12.342-12.345,12.342c-11.073,0-22.146-0.031-33.218,0.012 c-5.25,0.02-6.76,1.539-6.779,6.814c-0.06,16.24-1.382,15.39,14.882,15.343c26.004-0.075,52.009-0.015,78.013-0.024 c6.592-0.002,7.763-1.211,7.767-7.876c0.001-2.349-0.056-4.699,0.01-7.046c0.144-5.087,1.794-6.38,6.391-5.865 c1.57,11.962,2.907,23.747,4.765,35.449c0.647,4.073,1.998,8.292,4.104,11.797c1.828,3.041,5.159,7.119,7.859,7.143 c2.656,0.024,6.805-4.019,7.763-7.073c3.09-9.85,6.148-19.959,7.106-30.167c1.295-13.794,0.763-27.772,0.787-41.671 c0.158-91.433,0.238-182.866,0.46-274.299c0.006-2.499,0.844-5.29,2.131-7.444c7.151-11.972,11.314-25.021,14.283-38.502 c0.767-3.483,2.275-5.895,5.318-7.958c14.472-9.809,23.801-23.321,28.184-40.279c0.711-2.753,1.981-5.361,3.281-8.798 c2.096,1.947,3.257,3.114,4.508,4.173c6.274,5.312,15.319,4.747,20.867-1.276c5.371-5.83,5.28-14.718-0.209-20.541 c-5.593-5.933-14.657-6.313-20.861-0.875c-4.91,4.304-5.502,4.183-6.871-2.32c-2.843-13.501-9.129-25.091-18.636-35.051 c-1.059-1.109-1.624-3.064-1.703-4.662c-0.225-4.519-0.177-9.058-0.049-13.584c0.13-4.584-1.863-6.712-6.52-6.641 c-7.688,0.117-15.378,0.032-23.4,0.032c0-2.437,0-4.497,0-7.081c7.778,0,15.453,0.035,23.127-0.012 c5.264-0.032,6.699-1.51,6.757-6.834c0.042-3.858,0.047-7.718-0.001-11.576c-0.066-5.278-1.476-6.669-6.885-6.701 c-7.529-0.044-15.059-0.011-22.958-0.011c0-2.027,0-3.755,0-6.073c7.653,0,15.321,0.036,22.987-0.012 c5.373-0.034,6.792-1.451,6.855-6.73c0.048-4.026-0.055-8.054,0.028-12.079c0.089-4.361-1.944-6.374-6.308-6.332 c-7.707,0.073-15.416,0.021-23.527,0.021c0-9.685,0-19.148,0-28.989c29.348-8.445,46.384-28.573,52.447-59.435 c5.672,5.174,10.766,9.523,17.619,7.369c3.319-1.043,6.756-3.208,9.01-5.835c4.921-5.734,3.914-14.302-1.556-19.605 c-6.5-6.301-13.691-5.549-25.075,3.382c-5.84-30.32-22.668-50.724-52.808-59.383c0-11.309-1.019-22.817,0.356-34.031 c0.926-7.551,7.373-13.269,13.919-17.063c17.517-10.153,29.726-24.222,35.359-43.852c0.494-1.723,2.178-3.397,3.738-4.475 c12.003-8.29,22.076-18.463,30.615-30.264c1.253-1.731,3.396-3.235,5.437-3.917c25.053-8.37,41.032-25.126,47.602-50.787 c0.552-2.155,1.515-4.205,2.634-7.248c1.988,1.811,3.137,2.906,4.337,3.942c6.297,5.437,15.169,5.072,20.893-0.842 C374.197,190.787,374.156,181.526,368.467,175.695z M256.26,106.092c4.157,3.613,7.747,6.732,11.337,9.852 c-0.326,0.501-0.652,1.003-0.979,1.504c-4.182,0.798-8.365,1.596-13.163,2.512C254.428,115.152,255.288,110.902,256.26,106.092z  M188,45c29.823,0,54,24.177,54,54c0,29.823-24.177,54-54,54s-54-24.177-54-54C134,69.177,158.177,45,188,45z M166.862,164.793 c13.581,4.334,27.363,4.22,41.777,0.199c-4.474,14.48-3.87,28.139,0.027,42.429c-14.232-4.098-27.748-4.399-41.531-0.444 c0.777-7.312,2.093-14.066,2.044-20.809C169.129,179.264,167.742,172.369,166.862,164.793z M119.248,106.829 c1.209,5.322,2.145,9.436,3.252,14.311c-4.762-1.06-8.731-1.943-13.791-3.07C112.36,114.176,115.486,110.843,119.248,106.829z  M101,239c-29.823,0-54-24.177-54-54c0-29.823,24.177-54,54-54s54,24.177,54,54C155,214.823,130.823,239,101,239z M118.659,264.99 c-3.407-3.594-6.205-6.546-9.77-10.308c5.012-1.059,8.587-1.815,12.604-2.664C120.513,256.504,119.687,260.286,118.659,264.99z  M242,683c0,29.823-24.177,54-54,54s-54-24.177-54-54s24.177-54,54-54S242,653.177,242,683z M242,452c0,29.823-24.177,54-54,54 s-54-24.177-54-54s24.177-54,54-54S242,422.177,242,452z M188,327c-29.823,0-54-24.177-54-54c0-29.823,24.177-54,54-54 s54,24.177,54,54C242,302.823,217.823,327,188,327z M255.79,267.71c-1.271-6.405-2.241-11.297-3.279-16.525 c5.356,1.047,10.057,1.966,16.634,3.251C264.355,259.196,260.474,263.053,255.79,267.71z M275,239c-29.823,0-54-24.177-54-54 c0-29.823,24.177-54,54-54c29.823,0,54,24.177,54,54C329,214.823,304.823,239,275,239z",
                clocks: {
                    1: { x: 188, y: 99 },
                    2: { x: 101, y: 185 },
                    3: { x: 275, y: 185 },
                    4: { x: 188, y: 273 },
                    5: { x: 188, y: 452 },
                    6: { x: 188, y: 683 }
                }
            }
        }
    },
    clocks: {
        size: 108,
        glowScale: 3,
        height: 400,
        width: 400,
        segments: {
            2: "M400,200c0,110.46-89.54,200-200,200V0C310.46,0,400,89.54,400,200z",
            3: "M200,0v200l173.229,100.014C390.252,270.593,400,236.436,400,200C400,89.543,310.457,0,200,0z",
            4: "M200,0v200h200C400,89.543,310.457,0,200,0z",
            5: "M390.248,138.185C364.207,57.985,288.881,0,200,0v200L390.248,138.185z",
            6: "M373.229,99.986C338.646,40.215,274.021,0,200,0v200L373.229,99.986z",
            8: "M341.421,58.579C305.229,22.386,255.229,0,200,0v200L341.421,58.579z",
            10: "M317.557,38.197C284.557,14.18,243.938,0,200,0v200L317.557,38.197z",
            12: "M300.014,26.771C270.593,9.748,236.436,0,200,0v200L300.014,26.771z"
        },
        glows: {
        }
    },
    teeth: {
        "tall": {
            viewBox: "0 0 512 1540",
            paths: {
                frame: "M0,0v1540l512-244.2V0H0z M451,1263.5l-390,186V61h390V1263.5z",
                half: "M0,0v748l512-244.2V0H0z",
                full: "M0,0v1540l512-244.2V0H0z"
            }
        },
        "med": {
            viewBox: "0 0 512 1540",
            paths: {
                frame: "M0,0v1388l512-395.6V0H0z M458,965.7L54,1278V53h404V965.7z",
                full: "M0,0v1540l512-244.2V0H0z"
            }
        },
        "short": {
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
    }
};
export default C;