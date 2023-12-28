// import {BladesActorType, BladesItemType, Playbook} from "../core/constants";
// import U from "../core/utilities";
// import {BladesNPC, BladesFaction} from "../documents/BladesActorProxy";
// import {BladesItem} from "../documents/BladesItemProxy";
// import BladesActiveEffect from "../BladesActiveEffect";

// import type {EffectChangeData} from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/effectChangeData";

// type CrewObject = {
//   type: string;
//   playbook: string;
//   name: string;
//   description?: string;
//   rules?: string;
//   flavor?: string;
//   hints?: string[];
// };

// type FactionData = Partial<BladesActorSchema.Faction> & {
//   name: string,
//   clocksArray?: Array<Partial<BladesClock.Data> & {display: string, value: number, max: number}>,
//   npcsData?: Array<Record<string,string|string[]>>,
//   turfStrings?: string[],
//   assetStrings?: string[],
//   alliesStrings?: string[],
//   enemiesStrings?: string[]
// };
// type EffectData = {
//   key: "system.roll_mods",
//   mode: 2,
//   priority: null,
//   value: string
// };
// type BLADES_IMPORT_DATA = {
//   FACTIONS: Record<string, FactionData>,
//   CREW_OBJECTS: CrewObject[],
//   ABILITIES: {
//     Descriptions: Record<string, string>,
//     RollMods: Record<string, Array<EffectData & {isMember?: boolean, isCohort?: boolean}>>
//   },
//   CREW_ABILITIES: {
//     Descriptions: Record<string, string>,
//     RollMods: Record<string, Array<EffectData & {isMember?: boolean, isCohort?: boolean}>>
//   },
//   CREW_UPGRADES: {
//     Descriptions: Record<string, string>,
//     RollMods: Record<string, Array<EffectData & {isMember?: boolean, isCohort?: boolean}>>
//   }
// };

// const JSONDATA: BLADES_IMPORT_DATA = {
//   FACTIONS: {
//     "the Billhooks": {
//       name: "the Billhooks",
//       subtitle: "a Hack-and-Slash Gang of Toughened Thugs",
//       concept: "A tough gang of thugs who prefer hatchets, meat hooks, and pole arms.",
//       description: "The Billhooks have a bloody reputation, often leaving the butchered corpses of their victims strewn about in a grisly display. Many wonder why the Bluecoats turn a blind eye to their savagery. Based out of their butcher shop headquarters, they are led by Tarvul, who is currently serving life in prison.",
//       gm_notes: "Erin and Coran both want to take control of the Billhooks gang, either when Tarvul gets too old (which will be soon) or by taking the position by force. There is no love lost between Erin and Corran and they'll have no qualms about fighting a family member for leadership. Meanwhile, the rest of the gang wants to continue their reign of terror to pressure a magistrate to pardon Tarvul and other gang members and release them from Ironhook.",
//       clocksArray: [
//         {
//           display: "Terrorize magistrates to pardon members in prison",
//           value: 0,
//           max: 8
//         }
//       ],
//       npcsData: [
//         {
//           name: "Tarvul",
//           gender: "m",
//           keyPhrases: [
//             "Savage",
//             "Arrogant",
//             "Family Man"
//           ],
//           other: "Leader of the Billhooks, currently serving life in prison."
//         },
//         {
//           name: "Erin",
//           gender: "f",
//           keyPhrases: [
//             "Confident",
//             "Deadly",
//             "Ambitious"
//           ],
//           other: "Billhooks Captain, sister to Tarvul."
//         },
//         {
//           name: "Coran",
//           gender: "m",
//           keyPhrases: [
//             "Fierce",
//             "Loyal",
//             "Quiet"
//           ],
//           other: "Billhooks thug, Tarvul's son."
//         }
//       ],
//       turfStrings: [
//         "a butcher shop (HQ), stockyard & slaughterhouse",
//         "animal fighting pits",
//         "gambling dens",
//         "several terrified merchants & businesses (which they extort)"
//       ],
//       assetStrings: [
//         "a large gang of bloodthirsty butchers",
//         "a pack of death-dogs"
//       ],
//       alliesStrings: [
//         "the Bluecoats",
//         "the Ministry of Preservation"
//       ],
//       enemiesStrings: [
//         "Citizens of Crow's Foot",
//         "Citizens of the Docks",
//         "Ulf Ironborn",
//         "the Lost"
//       ]
//     },
//     "the Bluecoats": {
//       name: "the Bluecoats",
//       subtitle: "the Corrupt City Watch of Duskvol",
//       concept: "The City Watch of Duskwall. Known as the meanest gang in the city. Corrupt, violent, and cruel.",
//       description: "The Bluecoats claim the whole city as their turf, but find their influence severely limited in Whitecrown, where the Imperial Military garrison holds sway under command of the Lord Governor. They are divided into companies by district, and have fierce rivalries, often good-natured, but sometimes violent.",
//       gm_notes: "The Bluecoats have become jealous of the elite hardware and vehicles used by the Imperial Military. They want to refit their watch-guards in heavy armor and weapons, to better strike fear into those they prey upon.",
//       clocksArray: [
//         {
//           display: "Procure bigger budget, military arms & equipment",
//           value: 0,
//           max: 8
//         }
//       ],
//       npcsData: [
//         {
//           name: "Commander Clelland",
//           gender: "m",
//           keyPhrases: [
//             "Corrupt",
//             "Cruel",
//             "Arrogant"
//           ],
//           other: "Chief commissioner of the City Watch."
//         },
//         {
//           name: "Captain Michter",
//           gender: "m",
//           keyPhrases: [
//             "Ambitious",
//             "Fierce",
//             "Confident"
//           ],
//           other: "Chief instructor."
//         },
//         {
//           name: "Captain Vale",
//           gender: "m",
//           keyPhrases: [
//             "Loyal",
//             "Insightful",
//             "Quiet"
//           ],
//           other: "Quartermaster."
//         }
//       ],
//       turfStrings: [
//         "The whole city, except Whitecrown"
//       ],
//       assetStrings: [
//         "Many large gangs of vicious thugs in uniform",
//         "Armored coaches and canal patrol boats",
//         "Public punishment sites (pillories, stocks, hanging cages)"
//       ],
//       alliesStrings: [
//         "Ironhook Prison",
//         "Lord Scurlock",
//         "the Billhooks",
//         "the City Council",
//         "the Crows",
//         "the Unseen"
//       ],
//       enemiesStrings: [
//         "the Imperial Military"
//       ]
//     },
//     "the Church of Ecstasy": {
//       name: "the Church of Ecstasy",
//       subtitle: "the State Religion Honoring Life and Abhorring Spirits",
//       concept: "The “state religion” honors the life of the body and abhors the corrupted spirit world. Essentially a secret society.",
//       description: "The Church of Ecstasy, the state religion, venerates the sanctity of the physical body while condemning the tainted realm of spirits. Operating as a clandestine organization, zealous believers occasionally volunteer to be hollowed to 'become purified'. This practice was once common among the ancient cult of the Empty Vessel, which preceded the Church.",
//       gm_notes: "According to the Church's secret teachings, the purest entities are those devoid of spirits: the demons. These demons, immortal and uncorrupted by the madness that afflicts rogue human spirits and vampires, are perceived as the epitome of perfection. The Church's most devout followers aspire to emulate these demons, seeking the elusive secret of ascension. To this end, they conduct numerous sinister experiments and rituals involving hulls, hollows, vampires, and the occasional demon, all within the maze-like dungeons beneath the Church's primary cathedral in Brightstone.",
//       clocksArray: [
//         {
//           display: "Unlock the secret of ascension",
//           value: 0,
//           max: 12
//         },
//         {
//           display: "Eliminate the Reconciled",
//           value: 0,
//           max: 12
//         }
//       ],
//       npcsData: [
//         {
//           name: "Elder Rowan",
//           gender: "m",
//           keyPhrases: [
//             "Devout",
//             "Resolute",
//             "Visionary"
//           ],
//           other: "Leader of the Church of Ecstasy."
//         },
//         {
//           name: "Preceptor Dunvil",
//           gender: "m",
//           keyPhrases: [
//             "Unorthodox",
//             "Obsessive",
//             "Enigmatic"
//           ],
//           other: "Arcane researcher for the Church."
//         }
//       ],
//       turfStrings: [
//         "The Sanctorium grand cathedral in Brightstone",
//         "Many other smaller temples across the city"
//       ],
//       assetStrings: [
//         "A large treasury of tithes from citizens",
//         "Extensive arcane and occult libraries, workspaces, and artifacts",
//         "Many cohorts of acolytes and hollows who enforce the will of the Church's leadership"
//       ],
//       alliesStrings: [
//         "the City Council",
//         "the Leviathan Hunters",
//         "the Spirit Wardens"
//       ],
//       enemiesStrings: [
//         "the Path of Echoes",
//         "the Reconciled"
//       ]
//     },
//     "the Circle of Flame": {
//       name: "the Circle of Flame",
//       subtitle: "a Refined Secret Society with Unknown Intentions",
//       concept: "A refined secret society of antiquarians and scholars; cover for extortion, graft, vice, and murder.",
//       description: "The Circle of Flame operates under the guise of a scholarly society, but in reality, they engage in extortion, graft, vice, and murder. With a vast treasury funded by their wealthy membership, they possess an impressive collection of ancient artifacts, maps, and ephemera. Their operations are protected by a highly trained and discreet private security force. They have a particular interest in the arcane artifacts and treasures of the Lost District.",
//       gm_notes: "Of special interest to the Circle are the remains of 'Kotar', a legendary sorcerer, demon, or hero who was mummified before the cataclysm. The Eye, Hand and Heart of Kotar are said to possess great power for those bold enough to risk their use.  Additionally, one of 'The Seven' is actually a demon in disguise.",
//       clocksArray: [
//         {
//           display: "Acquire all the ancient artifacts of Kotar",
//           value: 0,
//           max: 8
//         }
//       ],
//       npcsData: [
//         {
//           name: "Elstera Avrathi",
//           gender: "f",
//           keyPhrases: [
//             "Secretive",
//             "Gracious"
//           ],
//           other: "Iruvian diplomat and member of 'The Seven', the leadership council of the Circle"
//         },
//         {
//           name: "Lady Drake",
//           gender: "f",
//           keyPhrases: [
//             "Cunning",
//             "Ruthless"
//           ],
//           other: "Magistrate and member of 'The Seven'"
//         },
//         {
//           name: "Raffello",
//           gender: "m",
//           keyPhrases: [
//             "Visionary",
//             "Obsessive"
//           ],
//           other: "Painter and member of 'The Seven'"
//         },
//         {
//           name: "Lord Mora",
//           gender: "m",
//           keyPhrases: [
//             "Cold",
//             "Suspicious"
//           ],
//           other: "Noble and member of 'The Seven'"
//         },
//         {
//           name: "Lady Penderyn",
//           gender: "f",
//           keyPhrases: [
//             "Charming",
//             "Patient"
//           ],
//           other: "Noble and member of 'The Seven'"
//         },
//         {
//           name: "Madame Tesslyn",
//           gender: "f",
//           keyPhrases: [
//             "Sophisticated",
//             "Subtle"
//           ],
//           other: "Vice purveyor and member of 'The Seven'"
//         },
//         {
//           name: "Harvale Brogan",
//           gender: "m",
//           keyPhrases: [
//             "Shrewd",
//             "Quiet"
//           ],
//           other: "Vice purveyor and member of 'The Seven'"
//         }
//       ],
//       turfStrings: [
//         "The Centuralia club, Six Towers (HQ)"
//       ],
//       assetStrings: [
//         "Vast treasury provided by wealthy membership",
//         "Impressive collection of ancient artifacts, maps, and ephemera",
//         "Highly trained and discreet private security force"
//       ],
//       alliesStrings: [
//         "the City Council",
//         "the Forgotten Gods",
//         "the Foundation",
//         "the Path of Echoes"
//       ],
//       enemiesStrings: [
//         "the Hive",
//         "the Silver Nails"
//       ]
//     },
//     "the City Council": {
//       name: "the City Council",
//       subtitle: "the Elite Nobility Governing Duskvol",
//       concept: "The elite nobility who run the city government, its treasury, magistrates, and public works.",
//       description: "The City Council is composed of the scions of the six most powerful noble families in Doskvol. They oversee the city's government, treasury, magistrates, and public works. The council chambers are located in Charterhall, which also houses the government offices and the impregnable city treasury vaults. The council holds ownership of all public spaces in the city, including streets, docks, and waterways.",
//       gm_notes: "The members of the Council are all high-ranking adepts in the Church of the Ecstasy of the Flesh. Some of them are also secretly initiates in the Path of Echoes. Three of the councilors (Bowmore, Clelland, Rowan) have aligned against Strangford and are maneuvering to remove the house from the council. Dunvil and Penderyn have not taken sides so far.",
//       clocksArray: [
//         {
//           display: "Strangford eliminates threats",
//           value: 0,
//           max: 8
//         },
//         {
//           display: "Strangford is removed from council",
//           value: 0,
//           max: 6
//         }
//       ],
//       npcsData: [
//         {
//           name: "Bowmore",
//           gender: "",
//           keyPhrases: [],
//           other: "Noble head of the esteemed Bowmore family."
//         },
//         {
//           name: "Clelland",
//           gender: "",
//           keyPhrases: [],
//           other: "Noble head of the esteemed Clelland family."
//         },
//         {
//           name: "Dunvil",
//           gender: "",
//           keyPhrases: [],
//           other: "Noble head of the esteemed Dunvil family."
//         },
//         {
//           name: "Penderyn",
//           gender: "",
//           keyPhrases: [],
//           other: "Noble head of the esteemed Penderyn family."
//         },
//         {
//           name: "Rowan",
//           gender: "",
//           keyPhrases: [],
//           other: "Noble head of the esteemed Rowan family."
//         },
//         {
//           name: "Strangford",
//           gender: "",
//           keyPhrases: [],
//           other: "Noble head of the esteemed Strangford family."
//         }
//       ],
//       turfStrings: [
//         "The city council chambers in Charterhall",
//         "Government offices",
//         "Impregnable city treasury vaults",
//         "Ownership of all public spaces in the city, including streets, docks, and waterways"
//       ],
//       assetStrings: [
//         "A massive treasury of coin and valuable goods",
//         "Many officials, barristers, clerks, and officials",
//         "The public coaches operated by the Cabbies"
//       ],
//       alliesStrings: [
//         "Lord Scurlock",
//         "the Bluecoats",
//         "the Brigade",
//         "the Cabbies",
//         "the Church of Ecstasy",
//         "the Circle of Flame",
//         "the Foundation",
//         "the Sparkwrights"
//       ],
//       enemiesStrings: [
//         "the Imperial Military",
//         "the Inspectors",
//         "the Ministry of Preservation",
//         "the Reconciled"
//       ]
//     },
//     "the Crows": {
//       name: "the Crows",
//       subtitle: "an Old Gang with New Leadership",
//       concept: "An old gang known for running illegal games of chance and extortion rackets.",
//       description: "The Crows claim all of Crow's Foot as their turf, with everyone in the district paying up the chain to them. Their headquarters is in an abandoned City Watch tower, and they operate gambling dens in Crow's Foot and extortion rackets at the Docks. Led by Lyssa, they are known for their veteran gang of thugs and killers. They also possess a number of small boats and a fortified HQ.",
//       gm_notes: "Lyssa murdered the former boss of the Crows, Roric. His vengeful ghost is now at large in the city. As the power-play continues, the Crows' hold on the district might slip away due to some members' loyalty to Roric.",
//       clocksArray: [
//         {
//           display: "Reestablish control of Crow's Foot",
//           value: 0,
//           max: 6
//         },
//         {
//           display: "Rise in Tier",
//           value: 0,
//           max: 6
//         }
//       ],
//       npcsData: [
//         {
//           name: "Lyssa",
//           gender: "f",
//           keyPhrases: [
//             "Brash",
//             "Killer",
//             "Noble Family"
//           ],
//           other: "Leader of The Crows."
//         },
//         {
//           name: "Bell",
//           gender: "f",
//           keyPhrases: [
//             "Loyal"
//           ],
//           other: "Second-in-command of The Crows."
//         }
//       ],
//       turfStrings: [
//         "Claims all of Crow's Foot",
//         "HQ in an abandoned City Watch tower",
//         "Operates gambling dens in Crow's Foot",
//         "Extortion rackets at the Docks"
//       ],
//       assetStrings: [
//         "A veteran gang of thugs and killers",
//         "A number of small boats",
//         "A fortified HQ"
//       ],
//       alliesStrings: [
//         "Citizens of Crow's Foot",
//         "Sailors",
//         "the Bluecoats",
//         "the Lost"
//       ],
//       enemiesStrings: [
//         "the Dockers",
//         "the Hive",
//         "the Inspectors"
//       ]
//     },
//     "Deathlands Scavengers": {
//       name: "Deathlands Scavengers",
//       subtitle: "Explorers of the Wastelands Beyond the Lightning Barriers",
//       concept: "Convicts from Ironhook and desperate freelancers who roam the wasteland beyond the lightning barriers.",
//       description: "The Deathlands Scavengers are a group of convicts and freelancers who have chosen to roam the perilous wastelands beyond Duskvol's lightning barriers. These wastelands, known as the deathlands, are treacherous and filled with spirits and other dangers. The scavengers are led by Lady Thorn, a brave and caring leader who is haunted by her past. They search for lost artifacts and treasures in the wastes, which they sell or trade in the city. Some even manage to gather enough to buy a pardon and return to life within the barriers.",
//       gm_notes: "Condemned prisoners are sometimes given “mercy” and sent into the deathlands rather than being executed at Ironhook. A few survive, thanks to Lady Thorn and her deathlands scavengers, who take them in and train them in the ways of deathlands hunting and survival.",
//       clocksArray: [
//         {
//           display: "Obtain pardons (repeating)",
//           value: 0,
//           max: 8
//         }
//       ],
//       npcsData: [
//         {
//           name: "Lady Thorn",
//           gender: "f",
//           keyPhrases: [
//             "Haunted",
//             "Brave",
//             "Caring"
//           ],
//           other: "Leader of the Deathlands Scavengers."
//         },
//         {
//           name: "Richter",
//           gender: "m",
//           keyPhrases: [
//             "Patient",
//             "Quiet",
//             "Deadly"
//           ],
//           other: "A skilled hunter in the wastelands."
//         }
//       ],
//       turfStrings: [
//         "A few precious hold-fasts in the deathlands, secured by ancient rites against spirits.",
//         "Hunting grounds to feed on the few strange animals that survived the cataclysm."
//       ],
//       assetStrings: [
//         "Generators, lightning hooks, gas-masks, air tanks, and other essentials of deathlands survival.",
//         "A secret ancient book of ritual sorcery."
//       ],
//       alliesStrings: [
//         "the Forgotten Gods",
//         "the Gondoliers",
//         "the Spirit Wardens"
//       ],
//       enemiesStrings: [
//         "Ironhook Prison"
//       ]
//     },
//     "the Dimmer Sisters": {
//       name: "the Dimmer Sisters",
//       subtitle: "Reclusive Mystics of the Occult",
//       concept: "House-bound recluses with an occult reputation.",
//       description: "The Dimmer Sisters are enigmatic figures who reside in a fine old manor house, along with the ancient temple ruin and subterranean canal beneath it. They have a reputation in the occult circles of Duskvol, and their true names and exact number remain a mystery. Some believe they are an ancient family of possessing spirits, while others whisper that they might be vampires. One thing is certain: those who enter their house are never seen again. They are served by apothecaries and witches, and their dealings are mostly kept secret from the outside world.",
//       gm_notes: "The Sisters have been slowly and secretly consolidating the trade of captured spirits and spirit essences in Doskvol for several decades. Only a few remaining rivals stand between them and domination of the market.",
//       clocksArray: [
//         {
//           display: "Dominate the spirit trade",
//           value: 0,
//           max: 6
//         },
//         {
//           display: "Obtain arcane secrets (repeating)",
//           value: 0,
//           max: 4
//         }
//       ],
//       npcsData: [
//         {
//           name: "Roslyn",
//           gender: "f",
//           keyPhrases: [
//             "Patient",
//             "Loyal",
//             "Arcane"
//           ],
//           other: "Deals with contacts outside the house."
//         },
//         {
//           name: "Irelen",
//           gender: "f",
//           keyPhrases: [
//             "Loyal",
//             "Enigmatic",
//             "Obsessive"
//           ],
//           other: "A sparkcraft tinkerer."
//         }
//       ],
//       turfStrings: [
//         "Fine old manor house and grounds (HQ)",
//         "Ancient temple ruin and subterranean canal beneath",
//         "Apothecaries and witches in their service"
//       ],
//       assetStrings: [
//         "A private electroplasmic generator, lightning barriers, and spirit containment vessels",
//         "Many spirits bound to service"
//       ],
//       alliesStrings: [
//         "the Forgotten Gods",
//         "the Foundation"
//       ],
//       enemiesStrings: [
//         "the Reconciled",
//         "the Spirit Wardens"
//       ]
//     },
//     "the Fog Hounds": {
//       name: "the Fog Hounds",
//       subtitle: "a Rough Gang of Smugglers Seeking Patronage",
//       concept: "A crew of rough smugglers looking for a patron.",
//       description: "Led by Margette Vale, The Fog Hounds are a crew of hard-bitten, tough sailors, all former Void Sea transport haulers. These sailors have been put out of work by the new cargo rail lines and are well-worn from years of harrowing work on the Void Sea. The crew is insular and clannish, often skeptical of outsiders. However, once trust is earned, their loyalty is unbreakable. They currently aim to dominate the Northern smuggling routes in and out of Duskwall, hoping to eliminate any rivals and secure a steady patron.",
//       gm_notes: "Vale and her crew are working to absorb or eliminate the remaining rivals in their territory. Their ultimate goal is to establish a consistent relationship with a patron who requires a regular flow of contraband.",
//       clocksArray: [
//         {
//           display: "Eliminate rival smugglers",
//           value: 0,
//           max: 8
//         },
//         {
//           display: "Obtain a regular patron",
//           value: 0,
//           max: 6
//         }
//       ],
//       npcsData: [
//         {
//           name: "Margette Vale",
//           gender: "f",
//           keyPhrases: [
//             "Quiet",
//             "Cold",
//             "Fearless"
//           ],
//           other: "Leader of The Fog Hounds."
//         },
//         {
//           name: "Bear",
//           gender: "m",
//           keyPhrases: [
//             "Fierce",
//             "Moody",
//             "Brash"
//           ],
//           other: "Second in command."
//         },
//         {
//           name: "Goldie",
//           gender: "f",
//           keyPhrases: [
//             "Calculating",
//             "Patient",
//             "Confident"
//           ],
//           other: "Navigator for the crew."
//         }
//       ],
//       turfStrings: [
//         "Underground canal dock (HQ)",
//         "North and East city canal routes",
//         "Northern Void Sea routes",
//         "Old North Port supply caches"
//       ],
//       assetStrings: [
//         "Medium steamship, Fog Hound",
//         "A crew of hard-bitten, tough, expert sailors",
//         "A wide array of Imperial transport and cargo documents, some forged, some legit"
//       ],
//       alliesStrings: [
//         "the Dockers",
//         "the Lampblacks"
//       ],
//       enemiesStrings: [
//         "the Bluecoats"
//       ]
//     },
//     "the Gondoliers": {
//       name: "the Gondoliers",
//       subtitle: "Canal Boat Operators with Occult Knowledge",
//       concept: "The canal boat operators. Venerated by ancient tradition. Said to know occult secrets.",
//       description: "The Gondoliers are the canal boat operators of Doskvol, venerated by ancient tradition and believed to possess occult knowledge. They are beloved by most citizens, who often turn to them for assistance with supernatural problems rather than the Spirit Wardens. The Gondoliers have been protecting citizens from rogue spirits and other supernatural threats since ancient times, long before the Spirit Wardens were established.",
//       gm_notes: "Recently, ritually disfigured hollows have been discovered in the canals, prompting an investigation by the Gondoliers. The Spirit Wardens are deliberately ignoring this situation. All Gondoliers are granted the Whisper's Compel special ability.",
//       clocksArray: [
//         {
//           display: "Investigate desecrated hollows",
//           value: 0,
//           max: 8
//         },
//         {
//           display: "Destroy spirit wells (repeating)",
//           value: 0,
//           max: 4
//         }
//       ],
//       npcsData: [
//         {
//           name: "Eisele",
//           gender: "f",
//           keyPhrases: [
//             "Serene",
//             "Knowledgeable",
//             "Fearless"
//           ],
//           other: "Leader of the Gondoliers."
//         },
//         {
//           name: "Griggs",
//           gender: "m",
//           keyPhrases: [
//             "Strange",
//             "Ruthless",
//             "Haunted"
//           ],
//           other: "Chief Whisper for the Gondoliers."
//         }
//       ],
//       turfStrings: [
//         "The canals of Doskvol"
//       ],
//       assetStrings: [
//         "Fleet of gondolas and other water-craft",
//         "Map of known spirit wells and arcane sites across the city",
//         "A dedicated cohort of Adepts"
//       ],
//       alliesStrings: [
//         "Citizens of Barrowcleft",
//         "Citizens of Brightstone",
//         "Citizens of Charhollow",
//         "Citizens of Charterhall",
//         "Citizens of Coalridge",
//         "Citizens of Crow's Foot",
//         "Citizens of Dunslough",
//         "Citizens of Nightmarket",
//         "Citizens of Silkshore",
//         "Citizens of Six Towers",
//         "Citizens of Whitecrown",
//         "Citizens of the Docks",
//         "the Lampblacks"
//       ],
//       enemiesStrings: [
//         "the Red Sashes",
//         "the Spirit Wardens"
//       ]
//     },
//     "the Gray Cloaks": {
//       name: "the Gray Cloaks",
//       subtitle: "Former Bluecoats Turned Criminals",
//       concept: "A crew of former Bluecoats turned to crime after being framed and expelled from the City Watch.",
//       description: "The Gray Cloaks are a group of former Bluecoats who were unjustly framed for a crime they didn't commit. While they were involved in some minor corrupt activities, they were not responsible for burning down the Watch station or destroying evidence against Lord Strangford. Now, having turned to crime, they operate out of the basement of the burned-down City Watch station and have taken over several apartments in Six Towers. They also run a pit-fighting arena and gambling den.",
//       gm_notes: "The Gray Cloaks were framed by their Watch station commander for a crime that implicated Lord Strangford of the Leviathan Hunters. Some inspectors know the truth but lack evidence. Lord Strangford would pay handsomely to eliminate these threats.",
//       clocksArray: [
//         {
//           display: "Secure Six Towers as their turf",
//           value: 0,
//           max: 8
//         },
//         {
//           display: "Avenge their expulsion",
//           value: 0,
//           max: 8
//         }
//       ],
//       npcsData: [
//         {
//           name: "Nessa",
//           gender: "f",
//           keyPhrases: [
//             "Scrupulous",
//             "Daring"
//           ],
//           other: "Leader of the Gray Cloaks."
//         },
//         {
//           name: "Hutch",
//           gender: "m",
//           keyPhrases: [
//             "Brash",
//             "Fierce"
//           ],
//           other: "Second in command."
//         }
//       ],
//       turfStrings: [
//         "The basement of a burned-down City Watch station (HQ)",
//         "Several apartments above a tobacconist in Six Towers",
//         "A pit-fighting arena and gambling den"
//       ],
//       assetStrings: [
//         "A sizeable gang of trained enforcers",
//         "Old uniforms and badges used to impersonate the City Watch"
//       ],
//       alliesStrings: [
//         "the Inspectors"
//       ],
//       enemiesStrings: [
//         "the Bluecoats",
//         "the Leviathan Hunters"
//       ]
//     },
//     "the Grinders": {
//       name: "the Grinders",
//       subtitle: "Vicious Former Dockers and Refinery Workers",
//       concept: "A vicious gang of former dockers and leviathan blood refinery workers.",
//       description: "The Grinders are a group of dockers and refinery workers from Lockport, a city to the North in Skovlan. They have come to Doskvol with a mission to raise an army, secure a warship, and take control of Lockport. Their goal is to destroy the Empire's refineries. To fund their mission, they've turned to criminal activities, especially looting and hijacking cargo barges across Doskvol.",
//       gm_notes: "The city of Lockport processes 90% of the demon blood siphoned by the leviathan hunter ships of Doskvol. The refineries in Lockport have poisoned the city with toxic fumes and acid rain. The Grinders, affected by this, have come to Doskvol to raise an army and secure a warship to take control of Lockport and destroy the Empire's refineries.",
//       clocksArray: [
//         {
//           display: "Raise a crew, steal a war ship",
//           value: 0,
//           max: 12
//         },
//         {
//           display: "Fill war treasury",
//           value: 0,
//           max: 12
//         }
//       ],
//       npcsData: [
//         {
//           name: "Hutton",
//           gender: "m",
//           keyPhrases: [
//             "Confident",
//             "Volatile"
//           ],
//           other: "Leader of the Grinders."
//         },
//         {
//           name: "Sercy",
//           gender: "m",
//           keyPhrases: [
//             "Crippled",
//             "Defiant"
//           ],
//           other: "Second in command."
//         },
//         {
//           name: "Derret",
//           gender: "m",
//           keyPhrases: [
//             "Huge",
//             "Shrewd"
//           ],
//           other: "Toughest gang member."
//         }
//       ],
//       turfStrings: [
//         "Abandoned dock warehouse (HQ)",
//         "Underground canal dock"
//       ],
//       assetStrings: [
//         "A few small canal boats",
//         "Wrecking tools and explosives"
//       ],
//       alliesStrings: [
//         "Ulf Ironborn",
//         "the Dockers"
//       ],
//       enemiesStrings: [
//         "Sailors",
//         "the Bluecoats",
//         "the Imperial Military",
//         "the Leviathan Hunters",
//         "the Silver Nails"
//       ]
//     },
//     "the Hive": {
//       name: "the Hive",
//       subtitle: "a Secretive Guild of Contraband Merchants",
//       concept: "A guild of legitimate merchants who secretly trade in contraband. Named for their symbol, a golden bee.",
//       description: "The Hive, symbolized by a golden bee, is a guild of merchants that operates legitimately on the surface but secretly trades in contraband. They have a vast presence across Doskvol, owning many shops, taverns, cafes, warehouses, and other mercantile establishments. The Hive is known to avoid business with any occult or arcane groups, and many of its members are followers of the Church of Ecstasy, rejecting the superstitions of the past.",
//       gm_notes: "Djera Maha, the leader of The Hive, was once an urchin in the Dagger Isles. She climbed the ranks of every gang along the trade routes to Doskvol, establishing her acquisition and distribution network in the city. She is now poised to dominate all contraband markets. Djera had a close (possibly romantic) relationship with Roric, the leader of the Crows, who was recently murdered.",
//       clocksArray: [
//         {
//           display: "Dominate contraband market",
//           value: 0,
//           max: 8
//         },
//         {
//           display: "Avenge Roric's murder",
//           value: 0,
//           max: 6
//         }
//       ],
//       npcsData: [
//         {
//           name: "Djera Maha",
//           gender: "f",
//           keyPhrases: [
//             "Bold",
//             "Strategic",
//             "Confident"
//           ],
//           other: "Leader of The Hive."
//         },
//         {
//           name: "Karth Orris",
//           gender: "m",
//           keyPhrases: [
//             "Ruthless",
//             "Insightful",
//             "Jealous"
//           ],
//           other: "Mercenary commander for The Hive."
//         }
//       ],
//       turfStrings: [
//         "Many shops, taverns, cafes, warehouses, and other mercantile establishments all across the city."
//       ],
//       assetStrings: [
//         "A massive treasury",
//         "Elite mercenaries on retainer",
//         "A fleet of transport ships, carriages, wagons, and private trains"
//       ],
//       alliesStrings: [
//         "the Dagger Isles Consulate",
//         "the Ministry of Preservation"
//       ],
//       enemiesStrings: [
//         "the Circle of Flame",
//         "the Crows",
//         "the Unseen",
//         "the Wraiths"
//       ]
//     },
//     "the Lampblacks": {
//       name: "the Lampblacks",
//       subtitle: "the Former Lamp-Lighter Guild Turned Criminal",
//       concept: "The former lamp-lighter guild, turned to crime when their services were replaced by electric lights.",
//       description: "The Lampblacks, once a guild of lamp-lighters, turned to criminal activities after their services became obsolete due to the advent of electric lights. They now operate out of a coal warehouse in Crow's Foot and run several brothels and cheap drug dens across the district. Led by the charismatic Bazso Baz, they are seen by the working class as 'lovable rogues' standing up against the establishment. The gang is currently at war with the Red Sashes over turf and vengeance for past transgressions.",
//       gm_notes: "Bazso Baz is a member of a secret society, the forgotten gods cult named 'The Empty Vessel', and sometimes prioritizes the needs of that group over his gang. The Lampblacks and the Red Sashes are in a turf war, and Bazso is recruiting aggressively, making it clear that one is either with them or against them.",
//       clocksArray: [
//         {
//           display: "Destroy the Red Sashes",
//           value: 0,
//           max: 8
//         },
//         {
//           display: "Become ward boss of Crow's Foot",
//           value: 0,
//           max: 8
//         }
//       ],
//       npcsData: [
//         {
//           name: "Bazso Baz",
//           gender: "m",
//           keyPhrases: [
//             "Charming",
//             "Open",
//             "Ruthless",
//             "Whiskey Connoisseur"
//           ],
//           other: "Leader of The Lampblacks."
//         },
//         {
//           name: "Pickett",
//           gender: "m",
//           keyPhrases: [
//             "Shrewd",
//             "Conniving",
//             "Suspicious"
//           ],
//           other: "Second in command."
//         },
//         {
//           name: "Henner",
//           gender: "m",
//           keyPhrases: [
//             "Loyal",
//             "Reckless"
//           ],
//           other: "A thug in the gang."
//         }
//       ],
//       turfStrings: [
//         "HQ in the office of a coal warehouse",
//         "Operates a handful of brothels and cheap drug dens across Crow's Foot"
//       ],
//       assetStrings: [
//         "A fearsome gang of leg-breakers and mayhem-makers",
//         "A number of smugglers on the payroll who run their drugs"
//       ],
//       alliesStrings: [
//         "Ironhook Prison",
//         "the Fog Hounds",
//         "the Gondoliers"
//       ],
//       enemiesStrings: [
//         "the Bluecoats",
//         "the Cabbies",
//         "the Red Sashes"
//       ]
//     },
//     "the Leviathan Hunters": {
//       name: "the Leviathan Hunters",
//       subtitle: "the Captains and Crews who Hunt the Leviathans of the Void Sea",
//       concept: "The captains and crews that grapple with titanic demons of the Void Sea to drain their blood for processing into electroplasm.",
//       description: "The Leviathan Hunters are renowned for their daring ventures into the Void Sea, where they grapple with immense demons to extract their blood. This blood is then processed into electroplasm, a vital resource for the city of Doskvol. The hunters operate a fleet of vessels, each owned by a noble house that commands it. They have numerous expert sailors, spark-craft technicians, demonologist Whispers, and void-touched navigators. Additionally, they maintain companies of marines to safeguard their ships and their precious cargo both at sea and in port.",
//       gm_notes: "The captains harbor a terrible secret: the known hunting grounds for leviathans are becoming barren. The once-reliable movements of these immortal creatures in the Void Sea have changed, and they are migrating elsewhere. New hunting grounds must be discovered before the surplus of leviathan blood runs out, threatening the lightning barriers and the survival of humanity.",
//       clocksArray: [
//         {
//           display: "Discover new hunting grounds",
//           value: 0,
//           max: 12
//         },
//         {
//           display: "Surplus runs dry",
//           value: 0,
//           max: 12
//         }
//       ],
//       npcsData: [
//         {
//           name: "Lord Strangford",
//           gender: "m",
//           keyPhrases: [
//             "Ruthless",
//             "Arrogant",
//             "Tainted"
//           ],
//           other: "A captain of the Leviathan Hunters."
//         },
//         {
//           name: "Lady Clave",
//           gender: "f",
//           keyPhrases: [
//             "Daring",
//             "Cruel",
//             "Accomplished"
//           ],
//           other: "Another captain in the fleet."
//         },
//         {
//           name: "Lady Ankhayat",
//           gender: "f",
//           keyPhrases: [
//             "Confident",
//             "Charming",
//             "Scoundrel"
//           ],
//           other: "An Iruvian captain of the Leviathan Hunters."
//         }
//       ],
//       turfStrings: [
//         "The massive metal docks for the huge hunter ships",
//         "Construction and repair facilities",
//         "Several small private leviathan blood processing facilities for the captains' personal shares"
//       ],
//       assetStrings: [
//         "The leviathan hunter fleet",
//         "Many cohorts of expert sailors, spark-craft technicians, demonologist Whispers, and void-touched navigators",
//         "Companies of marines"
//       ],
//       alliesStrings: [
//         "Sailors",
//         "the Church of Ecstasy",
//         "the City Council",
//         "the Dockers",
//         "the Sparkwrights"
//       ],
//       enemiesStrings: [
//         "the Grinders",
//         "the Ministry of Preservation",
//         "the Path of Echoes"
//       ]
//     },
//     "the Lost": {
//       name: "the Lost",
//       subtitle: "Protectors of the Downtrodden",
//       concept: "A group of street-toughs and ex-soldiers dedicated to protecting the downtrodden and the hopeless.",
//       description: "The Lost is a group of former thugs, killers, and Imperial soldiers who have turned their efforts towards protecting the vulnerable. Operating primarily in the districts of Coalridge and Dunslough, they have recently been focusing on sabotaging and attacking the notoriously cruel workhouse foremen in Coalridge. Their actions have emboldened union organizing efforts in the district, leading to increased tensions with local Bluecoat patrols.",
//       gm_notes: "The Lost are driven by a need for atonement. Each member keeps a pile of stones under their bed, with each stone representing a sin they've committed. They believe that by performing just deeds, they can balance out these sins. The Coalridge foremen are offering a significant reward to anyone who can eliminate The Lost.",
//       clocksArray: [
//         {
//           display: "Destroy cruel workhouses (repeating)",
//           value: 0,
//           max: 4
//         }
//       ],
//       npcsData: [
//         {
//           name: "Cortland",
//           gender: "m",
//           keyPhrases: [
//             "Idealist",
//             "Candid",
//             "Cavalier"
//           ],
//           other: "The leader of The Lost."
//         }
//       ],
//       turfStrings: [
//         "Converted rail car (HQ)",
//         "The poverty-stricken streets of Coalridge and Dunslough"
//       ],
//       assetStrings: [
//         "A very experienced gang of formerly vicious thugs, killers, and Imperial soldiers"
//       ],
//       alliesStrings: [
//         "Citizens of Coalridge",
//         "Citizens of Dunslough",
//         "Laborers",
//         "the Crows"
//       ],
//       enemiesStrings: [
//         "Laborers",
//         "the Billhooks",
//         "the Bluecoats"
//       ]
//     },
//     "the Ministry of Preservation": {
//       name: "the Ministry of Preservation",
//       subtitle: "Overseers of Vital Resources and Transport",
//       concept: "Oversees transportation between cities and the disbursement of food and other vital resources.",
//       description: "The Ministry of Preservation is responsible for overseeing transportation between cities and managing the distribution of essential resources. They control the electro-rail train lines of the Imperium and have a significant influence over radiant energy farms, eeleries, and other food-growing enterprises throughout the city. The Ministry has a fleet of cargo ships, armed escorts, and the Rail Jacks who work the train lines. They also maintain a private mercenary company that answers only to the ministry.",
//       gm_notes: "The Ministry leadership believes that the leviathan hunters are too vital to the public well-being to be controlled by the noble houses. They are taking covert actions to seize control of the hunters and bring them under Ministry control.",
//       clocksArray: [
//         {
//           display: "Seize control of Leviathan Hunters",
//           value: 0,
//           max: 12
//         }
//       ],
//       npcsData: [
//         {
//           name: "Lord Dalmore",
//           gender: "m",
//           keyPhrases: [
//             "Commanding",
//             "Intelligent"
//           ],
//           other: "Executive officer in Doskvol."
//         },
//         {
//           name: "Lady Slane",
//           gender: "f",
//           keyPhrases: [
//             "Insightful",
//             "Subtle",
//             "Effective"
//           ],
//           other: "Chief of operations."
//         },
//         {
//           name: "Captain Lannock",
//           gender: "m",
//           keyPhrases: [
//             "Shrewd",
//             "Ruthless"
//           ],
//           other: "Mercenary commander."
//         }
//       ],
//       turfStrings: [
//         "The electro-rail train lines of the Imperium",
//         "Radiant energy farms, eeleries, and other food-growing enterprises throughout the city"
//       ],
//       assetStrings: [
//         "A fleet of cargo ships and their armed escorts",
//         "A significant treasury from taxation and transportation licensing",
//         "The Rail Jacks who work the train lines",
//         "A private mercenary company"
//       ],
//       alliesStrings: [
//         "the Billhooks",
//         "the Imperial Military",
//         "the Rail Jacks",
//         "the Sparkwrights"
//       ],
//       enemiesStrings: [
//         "the Leviathan Hunters"
//       ]
//     },
//     "the Reconciled": {
//       name: "the Reconciled",
//       subtitle: "Ancient Spirits Seeking Order",
//       concept: "An association of ancient spirits who have not gone feral with the passage of time.",
//       description: "The Reconciled is a unique association of ancient spirits that, unlike most spirits, have not gone feral over time. They do not have a specific turf within the city. These spirits can possess victims indefinitely without causing any harm, and they have several hidden spirit wells across the city and in the deathlands, which provide them with the arcane energy they need to survive.",
//       gm_notes: "The Reconciled view themselves as the rightful rulers of Duskwall. Some members of the City Council have become initiates in the Path of Echoes and will soon be vulnerable to possession by the Reconciled. These councilors are also high-ranking members of the Church of the Ecstasy of the Flesh, providing an opportunity for infiltration.",
//       clocksArray: [
//         {
//           display: "Infiltrate the City Council",
//           value: 0,
//           max: 8
//         },
//         {
//           display: "Infiltrate the Church of Ecstasy",
//           value: 0,
//           max: 8
//         }
//       ],
//       npcsData: [],
//       turfStrings: [],
//       assetStrings: [
//         "Several secret and hidden spirit wells across the city and in the deathlands"
//       ],
//       alliesStrings: [
//         "the City Council",
//         "the Gondoliers"
//       ],
//       enemiesStrings: [
//         "the Church of Ecstasy",
//         "the Sparkwrights",
//         "the Spirit Wardens"
//       ]
//     },
//     "the Red Sashes": {
//       name: "the Red Sashes",
//       subtitle: "Ancient Iruvian Swordsmen Turned Criminals",
//       concept: "Originally a school of ancient Iruvian sword arts, since expanded into criminal endeavors.",
//       description: "The Red Sashes started as a school teaching ancient Iruvian sword arts. They have since expanded their operations into the criminal world. They operate out of their sword-fighting school which also serves as their headquarters. They have a strong presence in Crow's Foot and the Docks, where they run high-end drug dens. Several members of the Red Sashes are from noble Iruvian families, and their connections to powerful families in Doskvol make them a force to be reckoned with.",
//       gm_notes: "The Red Sashes and the Lampblacks are currently at war over turf and for revenge. Mylera is recruiting aggressively, making it clear that neutrality is not an option. The Red Sashes have connections with former sword students in various influential positions.",
//       clocksArray: [
//         {
//           display: "Destroy the Lampblacks",
//           value: 0,
//           max: 8
//         },
//         {
//           display: "Become ward boss of Crow's Foot",
//           value: 0,
//           max: 8
//         }
//       ],
//       npcsData: [
//         {
//           name: "Mylera Klev",
//           gender: "f",
//           keyPhrases: [
//             "Shrewd",
//             "Ruthless",
//             "Educated",
//             "Art Collector"
//           ],
//           other: "Leader of the Red Sashes."
//         }
//       ],
//       turfStrings: [
//         "HQ in their sword-fighting school/temple",
//         "Several high-end drug dens across Crow's Foot and the Docks"
//       ],
//       assetStrings: [
//         "Small contingent of master sword-fighters",
//         "Master alchemist; many potent potions and essences"
//       ],
//       alliesStrings: [
//         "the Cabbies",
//         "the Dockers",
//         "the Inspectors",
//         "the Iruvian Consulate",
//         "the Path of Echoes"
//       ],
//       enemiesStrings: [
//         "the Bluecoats",
//         "the Gondoliers",
//         "the Lampblacks"
//       ]
//     },
//     "Lord Scurlock": {
//       name: "Lord Scurlock",
//       subtitle: "a Mysterious Noble with Dark Secrets",
//       concept: "An ancient noble, rumored to be immortal like the Emperor. Possibly a vampire or sorcerer. Obsessed with the occult.",
//       description: "Lord Scurlock is an enigmatic figure in Doskvol, known for his cold demeanor and arcane interests. Rumors suggest he might be immortal, drawing comparisons with the Emperor. Some even whisper that he could be a vampire or a sorcerer. He owns a dilapidated manor house in Six Towers, which hides catacombs beneath. Across the city, he has an array of business holdings and cult shrines, all seemingly connected to a mysterious purpose.",
//       gm_notes: "Lord Scurlock is a vampire bound by ancient magic to the demon Setarra. Their roles as master and servant have shifted over time. Currently, Scurlock owes a debt: Setarra has discovered sea demons in the harbor, trapped in stone since the cataclysm. She wishes to free them, and Scurlock must assist or face dire consequences.",
//       clocksArray: [
//         {
//           display: "Fulfill debt to Setarra",
//           value: 0,
//           max: 12
//         },
//         {
//           display: "Obtain arcane secrets (repeating)",
//           value: 0,
//           max: 6
//         }
//       ],
//       npcsData: [
//         {
//           name: "Lord Scurlock",
//           gender: "m",
//           keyPhrases: [
//             "Enigmatic",
//             "Cold",
//             "Arcane",
//             "Old-fashioned"
//           ],
//           other: "An individual so powerful he's considered a faction on his own. In combat, his personal scale is Tier III, equivalent to a large gang. Immune to spirits and moves silently. Difficult to look at directly."
//         }
//       ],
//       turfStrings: [
//         "A secret lair outside the city",
//         "A dilapidated manor house in Six Towers and the catacombs beneath",
//         "Various business holdings and cult shrines across the city"
//       ],
//       assetStrings: [
//         "An impressive collection of occult and arcane curios, books, and ephemera",
//         "An ancient demonic temple"
//       ],
//       alliesStrings: [
//         "the Bluecoats",
//         "the City Council",
//         "the Forgotten Gods",
//         "the Inspectors"
//       ],
//       enemiesStrings: [
//         "the Immortal Emperor",
//         "the Spirit Wardens"
//       ]
//     },
//     "the Silver Nails": {
//       name: "the Silver Nails",
//       subtitle: "Severosi Mercenaries and Ghost Killers",
//       concept: "A company of Severosi mercenaries who fought for the Empire in the Unity War. Renowned ghost killers.",
//       description: "The Silver Nails are a company of Severosi mercenaries known for their prowess in the Unity War. They are especially renowned as ghost killers. Based in Duskvol, they have their sights set on the Lost District, a forbidden area outside the city's lightning barrier. They aim to drive out or destroy the fierce ghosts that inhabit this district and seize control to uncover the hidden treasures and artifacts within. Their expertise from the deathlands of Severos makes them uniquely qualified for this task.",
//       gm_notes: "The Silver Nails are looking to explore the Lost District, which is currently under the control of the Spirit Wardens. The Wardens are doing everything in their power to keep the Silver Nails and others out. Each member wears a ring fashioned from a silver nail, which protects against possession. They are all trained in the Ghost Fighter special ability.",
//       clocksArray: [
//         {
//           display: "Destroy spirits in the Lost District",
//           value: 0,
//           max: 8
//         },
//         {
//           display: "Control the Lost District",
//           value: 0,
//           max: 8
//         }
//       ],
//       npcsData: [
//         {
//           name: "Seresh",
//           gender: "m",
//           keyPhrases: [
//             "Bold",
//             "Brash",
//             "Defiant"
//           ],
//           other: "Leader of The Silver Nails."
//         },
//         {
//           name: "Tuhan",
//           gender: "m",
//           keyPhrases: [
//             "Bold",
//             "Cunning",
//             "Charming"
//           ],
//           other: "Lead scout for The Silver Nails."
//         }
//       ],
//       turfStrings: [
//         "A large inn (The Mustang) and its fine stables (HQ)"
//       ],
//       assetStrings: [
//         "A contingent of exquisite Severosian cavalry horses—fearless, swift, and trained to hunt and battle spirits",
//         "Arcane lances"
//       ],
//       alliesStrings: [
//         "Sailors",
//         "the Imperial Military",
//         "the Severosi Consulate"
//       ],
//       enemiesStrings: [
//         "Skovlander Refugees",
//         "the Circle of Flame",
//         "the Grinders",
//         "the Skovlan Consulate",
//         "the Spirit Wardens"
//       ]
//     },
//     "the Sparkwrights": {
//       name: "the Sparkwrights",
//       subtitle: "Engineers of the Lightning Barriers and Pioneers of Spark-Craft",
//       concept: "The engineers who maintain the lightning barriers. Also pioneers of spark-craft technology, indulging in dangerous research.",
//       description: "The Sparkwrights are the engineers responsible for maintaining Duskvol's lightning barriers. Beyond this crucial role, they are also at the forefront of spark-craft technology. They constantly push the boundaries with their dangerous research, seeking innovations that could revolutionize the city's defenses and power sources.",
//       gm_notes: "For centuries, the Sparkwrights have been working secretly to develop an alternative fuel that could replace leviathan blood, which powers the lightning barriers. Some researchers have come close, but mysterious 'accidents' have thwarted their progress. These accidents are likely orchestrated by the nobility who control leviathan hunting.",
//       clocksArray: [
//         {
//           display: "Develop alternative fuel",
//           value: 0,
//           max: 12
//         }
//       ],
//       npcsData: [
//         {
//           name: "Una Farros",
//           gender: "f",
//           keyPhrases: [
//             "Curious",
//             "Vain",
//             "Famous"
//           ],
//           other: "Instructor at Charterhall University."
//         }
//       ],
//       turfStrings: [
//         "Massive workshop, factory, and design facility in Coalridge"
//       ],
//       assetStrings: [
//         "The electroplasmic generators, city lights, lightning barriers and associated facilities and systems across the city"
//       ],
//       alliesStrings: [
//         "the City Council",
//         "the Leviathan Hunters",
//         "the Ministry of Preservation"
//       ],
//       enemiesStrings: [
//         "the Foundation",
//         "the Path of Echoes",
//         "the Reconciled"
//       ]
//     },
//     "the Spirit Wardens": {
//       name: "the Spirit Wardens",
//       subtitle: "Bronze-Masked Hunters of Rogue Spirits",
//       concept: "The bronze-masked hunters who destroy rogue spirits. Also run Bellweather Crematorium to properly dispose of corpses.",
//       description: "The Spirit Wardens are the enigmatic bronze-masked hunters responsible for destroying rogue spirits in the city. They operate the Bellweather Crematorium, ensuring the proper disposal of corpses to prevent the rise of these spirits. The Wardens maintain complete anonymity, with members cutting all personal ties and living solely for their duty. They utilize advanced equipment, including spirit-hunter hulls, and have the support of many expert Whispers. Their operations are so secretive that even their allies and enemies are often left guessing their next moves.",
//       gm_notes: "The Spirit Wardens are aware of an enemy trying to infiltrate their ranks, though they are unaware that this enemy is the Unseen. They are currently setting a trap to identify and eliminate this threat.",
//       clocksArray: [
//         {
//           display: "Uncover the infiltrators",
//           value: 0,
//           max: 8
//         }
//       ],
//       npcsData: [
//         {
//           name: "Bakoros",
//           gender: "unknown",
//           keyPhrases: [],
//           other: "A Warden who may be several individuals and sometimes lectures at the College of Immortal studies at Doskvol Academy."
//         }
//       ],
//       turfStrings: [
//         "Bellweather Crematorium",
//         "The Master Warden's estate in Whitecrown"
//       ],
//       assetStrings: [
//         "The death bells that ring whenever someone dies in the city",
//         "The deathseeker crows that find the body",
//         "Many cohorts of expert Whispers",
//         "The most advanced spectrological and spark-craft equipment, including several spirit-hunter hulls"
//       ],
//       alliesStrings: [
//         "Deathlands Scavengers",
//         "the Church of Ecstasy"
//       ],
//       enemiesStrings: [
//         "Lord Scurlock",
//         "the Dimmer Sisters",
//         "the Gondoliers",
//         "the Path of Echoes",
//         "the Reconciled",
//         "the Silver Nails",
//         "the Unseen"
//       ]
//     },
//     "Ulf Ironborn": {
//       name: "Ulf Ironborn",
//       subtitle: "a Brutal Skovlander Fighting for Turf",
//       concept: "A brutal Skovlander, newly arrived in the Dusk, fighting everyone for turf.",
//       description: "Ulf Ironborn is a fierce Skovlander who has recently come to Doskvol. He is aggressively trying to establish his territory in the city, leading his gang in ruthless smash & grab operations. As more Skovlander war refugees come to the city, tensions rise, especially with the appearance of 'NO SKOVS' signs. Ulf's strong distrust for the local Akorosi and anyone loyal to the Imperial government makes him a volatile figure, but those of Skovlander blood can easily earn his trust.",
//       gm_notes: "Ulf's anger is on a hair-trigger, especially with the rising bigotry against Skovlanders. He is likely to lead his gang into war against any 'true Duskers' who challenge him.",
//       clocksArray: [
//         {
//           display: "Carve out gang territory",
//           value: 0,
//           max: 6
//         },
//         {
//           display: "Rise in Tier",
//           value: 0,
//           max: 4
//         }
//       ],
//       npcsData: [
//         {
//           name: "Ulf Ironborn",
//           gender: "m",
//           keyPhrases: [
//             "Ruthless",
//             "Savage",
//             "Bold"
//           ],
//           other: "Leader of his gang, a brutal Skovlander."
//         },
//         {
//           name: "Havid",
//           gender: "m",
//           keyPhrases: [
//             "Ruthless",
//             "Volatile",
//             "Shrewd"
//           ],
//           other: "Ulf's second in command."
//         }
//       ],
//       turfStrings: [
//         "Rooms, workshop, and stable at The Old Forge tavern (HQ)",
//         "A gambling den"
//       ],
//       assetStrings: [
//         "A small but powerfully savage gang of thugs"
//       ],
//       alliesStrings: [
//         "the Grinders"
//       ],
//       enemiesStrings: [
//         "Citizens of Coalridge",
//         "the Billhooks"
//       ]
//     },
//     "the Unseen": {
//       name: "the Unseen",
//       subtitle: "an Insidious Criminal Enterprise with Hidden Membership",
//       concept: "An insidious criminal enterprise with secret membership. Thought to pull the strings of the entire underworld.",
//       description: "The Unseen are believed to control much of the underworld from the shadows. They have a multitude of vice dens and extortion rackets across the city, with few realizing they are paying up to this secretive group. Their perfect secrecy is maintained through arcane rituals, allowing core members to recognize each other with a special second sight. Anyone outside the group who learns the identity of a member soon forgets due to a ritual that erases that memory.",
//       gm_notes: "The Unseen are attempting to infiltrate the Spirit Wardens, a group whose secret membership has resisted their advances. The Tower and The Star, key figures within the Unseen, are plotting to place their own operatives among the Wardens to take control from the inside.",
//       clocksArray: [
//         {
//           display: "Infiltrate the Spirit Wardens",
//           value: 0,
//           max: 8
//         },
//         {
//           display: "Expand into other cities",
//           value: 0,
//           max: 8
//         }
//       ],
//       npcsData: [
//         {
//           name: "The Tower",
//           gender: "m",
//           keyPhrases: [],
//           other: "Leader of the Unseen."
//         },
//         {
//           name: "The Star",
//           gender: "m",
//           keyPhrases: [],
//           other: "Captain of the Unseen."
//         },
//         {
//           name: "Grull",
//           gender: "m",
//           keyPhrases: [],
//           other: "Mid-level thug undercover as a coach driver."
//         }
//       ],
//       turfStrings: [
//         "A multitude of vice dens and extortion rackets across the city",
//         "Several opulent townhouses used as safe houses"
//       ],
//       assetStrings: [
//         "A legion of thugs, thieves, and killers on-call to their secret masters."
//       ],
//       alliesStrings: [
//         "Ironhook Prison",
//         "the Bluecoats",
//         "the Cyphers",
//         "the Forgotten Gods"
//       ],
//       enemiesStrings: [
//         "the Hive",
//         "the Ink Rakes",
//         "the Spirit Wardens"
//       ]
//     },
//     "the Wraiths": {
//       name: "the Wraiths",
//       subtitle: "a Mysterious Crew of Masked Thieves and Spies",
//       concept: "A mysterious crew of masked thieves and spies.",
//       description: "The Wraiths operate primarily in Silkshore and Nightmarket, specializing in the theft of luxury items and intelligence gathering. Their operations often serve clients who use the stolen information for blackmail. Each member of the Wraiths wears a mask and goes by an alias, communicating with others using a private sign language. They have a secret lair in a tower in Silkshore and are equipped with all manner of thieves' gear for burglary.",
//       gm_notes: "The Wraiths recently stole a private map book from a luxury brothel in Nightmarket. This map book reveals the secret hunting grounds of leviathan sites that will be used by the ship Storm Palace in the upcoming season. While the map is of no use to the Wraiths, it's highly valuable to another leviathan hunter. The Wraiths are now trying to discreetly arrange its sale.",
//       clocksArray: [
//         {
//           display: "Recruit expert thieves",
//           value: 0,
//           max: 8
//         },
//         {
//           display: "Secure an arcane ally",
//           value: 0,
//           max: 6
//         }
//       ],
//       npcsData: [
//         {
//           name: "Slate",
//           gender: "m",
//           keyPhrases: [
//             "Sophisticated",
//             "Daring",
//             "Secretive"
//           ],
//           other: "Leader of the Wraiths."
//         },
//         {
//           name: "Loop",
//           gender: "m",
//           keyPhrases: [
//             "Obsessive",
//             "Moody",
//             "Secretive"
//           ],
//           other: "Appraisal expert for the Wraiths."
//         }
//       ],
//       turfStrings: [
//         "Silkshore and Nightmarket as primary hunting grounds",
//         "A scattered collection of secret rooftop shelters",
//         "A secret lair in a tower in Silkshore"
//       ],
//       assetStrings: [
//         "All manner of thieves' gear for burglary"
//       ],
//       alliesStrings: [
//         "the Cabbies"
//       ],
//       enemiesStrings: [
//         "the Bluecoats",
//         "the Hive",
//         "the Inspectors"
//       ]
//     }
//   },
//   CREW_OBJECTS: [
//     {
//       type: "contact",
//       playbook: "Bravos",
//       name: "Meg",
//       description: "a pit-fighter",
//       hints: [
//         "Perhaps a trainer",
//         "or perhaps a fellow extortion artist?"
//       ]
//     },
//     {
//       type: "contact",
//       playbook: "Bravos",
//       name: "Conway",
//       description: "a Bluecoat",
//       hints: [
//         "Perhaps an informant within the City Watch?"
//       ]
//     },
//     {
//       type: "contact",
//       playbook: "Bravos",
//       name: "Keller",
//       description: "a blacksmith",
//       hints: [
//         "Perhaps a source for armaments?"
//       ]
//     },
//     {
//       type: "contact",
//       playbook: "Bravos",
//       name: "Tomas",
//       description: "a physicker",
//       hints: [
//         "Perhaps a former thug turned doctor?"
//       ]
//     },
//     {
//       type: "contact",
//       playbook: "Bravos",
//       name: "Walker",
//       description: "a ward boss",
//       hints: [
//         "Perhaps an employer who often needs violent work?"
//       ]
//     },
//     {
//       type: "contact",
//       playbook: "Bravos",
//       name: "Lutes",
//       description: "a tavern owner",
//       hints: [
//         "Perhaps a good source of news and gossip?"
//       ]
//     },
//     {
//       type: "favoredOperation",
//       playbook: "Bravos",
//       name: "Battle",
//       description: "Defeat an enemy with overwhelming force."
//     },
//     {
//       type: "favoredOperation",
//       playbook: "Bravos",
//       name: "Extortion",
//       description: "Threaten violence unless you’re paid off."
//     },
//     {
//       type: "favoredOperation",
//       playbook: "Bravos",
//       name: "Sabotage",
//       description: "Hurt an opponent by destroying something."
//     },
//     {
//       type: "favoredOperation",
//       playbook: "Bravos",
//       name: "Smash & Grab",
//       description: "A fast and violent armed robbery."
//     },
//     {
//       type: "contact",
//       playbook: "Cult",
//       name: "Gagan",
//       description: "an academic"
//     },
//     {
//       type: "contact",
//       playbook: "Cult",
//       name: "Adikin",
//       description: "an occultist"
//     },
//     {
//       type: "contact",
//       playbook: "Cult",
//       name: "Hutchins",
//       description: "an antiquarian"
//     },
//     {
//       type: "contact",
//       playbook: "Cult",
//       name: "Moriya",
//       description: "a spirit trafficker"
//     },
//     {
//       type: "contact",
//       playbook: "Cult",
//       name: "Mateas Kline",
//       description: "a noble"
//     },
//     {
//       type: "contact",
//       playbook: "Cult",
//       name: "Bennett",
//       description: "an astronomer"
//     },
//     {
//       type: "favoredOperation",
//       playbook: "Cult",
//       name: "Acquisition",
//       description: "Procure an arcane artifact and attune it to your god."
//     },
//     {
//       type: "favoredOperation",
//       playbook: "Cult",
//       name: "Augury",
//       description: "Do what you must to attract the god’s attention and counsel."
//     },
//     {
//       type: "favoredOperation",
//       playbook: "Cult",
//       name: "Consecration",
//       description: "Anoint a place for your deity."
//     },
//     {
//       type: "favoredOperation",
//       playbook: "Cult",
//       name: "Sacrifice",
//       description: "Destroy what is valuable or good in honor of your god."
//     },
//     {
//       type: "favoredOperation",
//       playbook: "Hawkers",
//       name: "Sale",
//       description: "A significant transaction with a special buyer of illicit product."
//     },
//     {
//       type: "favoredOperation",
//       playbook: "Hawkers",
//       name: "Supply",
//       description: "A transaction to acquire new product or establish a new supplier."
//     },
//     {
//       type: "favoredOperation",
//       playbook: "Hawkers",
//       name: "Show of Force",
//       description: "Make an example of an enemy to dominate territory."
//     },
//     {
//       type: "favoredOperation",
//       playbook: "Hawkers",
//       name: "Socialize",
//       description: "Improve customer and/or supplier relations with a social event."
//     },
//     {
//       type: "contact",
//       playbook: "Hawkers",
//       name: "Rolan Wott",
//       description: "a magistrate",
//       hints: [
//         "Perhaps with a feckless son in Doskvol Academy, always in need of rescuing?"
//       ]
//     },
//     {
//       type: "contact",
//       playbook: "Hawkers",
//       name: "Laroze",
//       description: "a Bluecoat",
//       hints: [
//         "Perhaps an informant within the City Watch?"
//       ]
//     },
//     {
//       type: "contact",
//       playbook: "Hawkers",
//       name: "Lydra",
//       description: "a deal broker",
//       hints: [
//         "Perhaps known for her vicious retribution on those who don’t hold up their end?"
//       ]
//     },
//     {
//       type: "contact",
//       playbook: "Hawkers",
//       name: "Hoxley",
//       description: "a smuggler",
//       hints: [
//         "Perhaps a friend of powerful ship captains?"
//       ]
//     },
//     {
//       type: "contact",
//       playbook: "Hawkers",
//       name: "Anya",
//       description: "a dilettante",
//       hints: [
//         "Perhaps a well-connected socialite?"
//       ]
//     },
//     {
//       type: "contact",
//       playbook: "Hawkers",
//       name: "Marlo",
//       description: "a gang boss",
//       hints: [
//         "Perhaps a good partner with a gang of tough thugs?"
//       ]
//     },
//     {
//       type: "favoredOperation",
//       playbook: "Shadows",
//       name: "Burglary",
//       description: "Theft by breaking and entering."
//     },
//     {
//       type: "favoredOperation",
//       playbook: "Shadows",
//       name: "Espionage",
//       description: "Obtain secret information by covert or clandestine means."
//     },
//     {
//       type: "favoredOperation",
//       playbook: "Shadows",
//       name: "Robbery",
//       description: "Theft by force or threats."
//     },
//     {
//       type: "favoredOperation",
//       playbook: "Shadows",
//       name: "Sabotage",
//       description: "Hurt an opponent by destroying something."
//     },
//     {
//       type: "contact",
//       playbook: "Shadows",
//       name: "Dowler",
//       description: "an explorer",
//       hints: [
//         "Perhaps one of the rare deathlands scavengers that survived his sentence?"
//       ]
//     },
//     {
//       type: "contact",
//       playbook: "Shadows",
//       name: "Laroze",
//       description: "a Bluecoat",
//       hints: [
//         "Perhaps an informant within the City Watch?"
//       ]
//     },
//     {
//       type: "contact",
//       playbook: "Shadows",
//       name: "Amancio",
//       description: "a deal broker",
//       hints: [
//         "Perhaps a well-connected underworld figure, famous for their neutrality?"
//       ]
//     },
//     {
//       type: "contact",
//       playbook: "Shadows",
//       name: "Fitz",
//       description: "a collector",
//       hints: [
//         "Perhaps an aficionado of strange artifacts?"
//       ]
//     },
//     {
//       type: "contact",
//       playbook: "Shadows",
//       name: "Adelaide Phroaig",
//       description: "a noble",
//       hints: [
//         "Perhaps a source for scores among the elite?"
//       ]
//     },
//     {
//       type: "contact",
//       playbook: "Shadows",
//       name: "Rigney",
//       description: "a tavern owner",
//       hints: [
//         "Perhaps a good source of news and gossip?"
//       ]
//     },
//     {
//       type: "favoredOperation",
//       playbook: "Smugglers",
//       name: "Arcane/Weird",
//       description: "Spirit essences, ghosts, cult materials."
//     },
//     {
//       type: "favoredOperation",
//       playbook: "Smugglers",
//       name: "Arms",
//       description: "Restricted military weapons, heavy ordnance, explosives."
//     },
//     {
//       type: "favoredOperation",
//       playbook: "Smugglers",
//       name: "Contraband",
//       description: "High-tax luxuries, drugs, banned art, etc."
//     },
//     {
//       type: "favoredOperation",
//       playbook: "Smugglers",
//       name: "Passengers",
//       description: "People or livestock traveling in secret."
//     },
//     {
//       type: "contact",
//       playbook: "Smugglers",
//       name: "Elynn",
//       description: "a dock worker",
//       hints: [
//         "Perhaps a friend who can help with the infernal paperwork of the Empire?"
//       ]
//     },
//     {
//       type: "contact",
//       playbook: "Smugglers",
//       name: "Rolan",
//       description: "a drug dealer",
//       hints: [
//         "Perhaps a client with strong underworld ties?"
//       ]
//     },
//     {
//       type: "contact",
//       playbook: "Smugglers",
//       name: "Sera",
//       description: "an arms dealer",
//       hints: [
//         "Perhaps a supplier with military access?"
//       ]
//     },
//     {
//       type: "contact",
//       playbook: "Smugglers",
//       name: "Nyelle",
//       description: "a spirit trafficker",
//       hints: [
//         "Perhaps a supplier for the strangest of cargo?"
//       ]
//     },
//     {
//       type: "contact",
//       playbook: "Smugglers",
//       name: "Decker",
//       description: "an anarchist",
//       hints: [
//         "Perhaps a client in need of the illegal tools of revolution?"
//       ]
//     },
//     {
//       type: "contact",
//       playbook: "Smugglers",
//       name: "Esme",
//       description: "a tavern owner",
//       hints: [
//         "Perhaps a good source of news and gossip?"
//       ]
//     },
//     {
//       type: "claim",
//       playbook: "Cult",
//       name: "Ancient Altar",
//       rules: "You get +1d to the engagement roll for occult plans.",
//       flavor: "Its blessing is with you."
//     },
//     {
//       type: "claim",
//       playbook: "Cult",
//       name: "Ancient Gate",
//       rules: "Safe passage in the deathlands. When you leave the city through this gate, the spirits of the deathlands will not molest you unless directly provoked.",
//       flavor: ""
//     },
//     {
//       type: "claim",
//       playbook: "Cult",
//       name: "Ancient Obelisk",
//       rules: "-1 stress cost for all arcane powers and rituals. This effect applies to all cultists, everywhere—so long as the deity is well-pleased. You don’t have to be on-site at the obelisk to benefit from its power.",
//       flavor: ""
//     },
//     {
//       type: "claim",
//       playbook: "Cult",
//       name: "Ancient Tower",
//       rules: "You get +1d to Consort with arcane entities on-site.",
//       flavor: "This tower was prepared by sorcery from the pre-cataclysm and acts as an arcane lens to focus eldritch energy across the black mirror into the void."
//     },
//     {
//       type: "claim",
//       playbook: "Cult",
//       name: "Cloister",
//       rules: "Your Adept cohorts get +1 scale.",
//       flavor: "More room for hopeful novices desperate to pledge their service."
//     },
//     {
//       type: "claim",
//       playbook: "Cult",
//       name: "Offertory",
//       rules: "You get +2 coin in your payoff for scores that involve occult operations.",
//       flavor: "The frightened locals offer you tribute when you perform your dark practices. They don’t want to be next."
//     },
//     {
//       type: "claim",
//       playbook: "Cult",
//       name: "Sanctuary",
//       rules: "+1d to Command and Sway rolls on-site. Your sanctuary maintains its effect as long as your deity is well-pleased with your service.",
//       flavor: ""
//     },
//     {
//       type: "claim",
//       playbook: "Cult",
//       name: "Spirit Well",
//       rules: "You get +1d to Attune rolls on-site.",
//       flavor: "A spirit well draws ghosts and other things to its power, which you harness to aid your arts."
//     },
//     {
//       type: "claim",
//       playbook: "Cult",
//       name: "Sacred Nexus",
//       rules: "You get +1d to healing treatment rolls.",
//       flavor: "Ancient arcane energy seeps into the wounded here, speeding their recovery, and marking them consecrated by its power."
//     },
//     {
//       type: "claim",
//       playbook: "Cult",
//       name: "Vice Den",
//       rules: "Any time during downtime, roll dice equal to your Tier. You earn coin equal to the highest result, minus your heat.",
//       flavor: ""
//     },
//     {
//       type: "claim",
//       playbook: "Bravos",
//       name: "Barracks",
//       rules: "Your Thug cohorts get +1 scale.",
//       flavor: "Extra room means more gang members."
//     },
//     {
//       type: "claim",
//       playbook: "Bravos",
//       name: "Bluecoat Confederates",
//       rules: "You get +1d to the engagement roll for assault plans.",
//       flavor: "The street patrol around here helps you out now."
//     },
//     {
//       type: "claim",
//       playbook: "Bravos",
//       name: "Bluecoat Intimidation",
//       rules: "You get -2 heat per score.",
//       flavor: "The law doesn’t want any trouble from you; they look the other way."
//     },
//     {
//       type: "claim",
//       playbook: "Bravos",
//       name: "Fighting Pits",
//       rules: "During downtime, roll dice equal to your Tier. You earn coin equal to the highest result, minus your heat.",
//       flavor: "The locals love to gamble away their hard-won coin on the bloodsports you host."
//     },
//     {
//       type: "claim",
//       playbook: "Bravos",
//       name: "Infirmary",
//       rules: "You get +1d to healing treatment rolls. The infirmary also has beds for long-term convalescence.",
//       flavor: ""
//     },
//     {
//       type: "claim",
//       playbook: "Bravos",
//       name: "Informants",
//       rules: "You get +1d to gather information for a score.",
//       flavor: "Your eyes and ears on the streets are always on the lookout for new targets."
//     },
//     {
//       type: "claim",
//       playbook: "Bravos",
//       name: "Protection Racket",
//       rules: "Any time during downtime, roll dice equal to your Tier. You earn coin equal to the highest result, minus your heat.",
//       flavor: "Some of the locals are terrified of you and will gladly pay for “protection.”"
//     },
//     {
//       type: "claim",
//       playbook: "Bravos",
//       name: "Street Fence",
//       rules: "You get +2 coin in your payoff for scores that involve lower-class targets.",
//       flavor: "An expert can find the treasure amid the trash you loot from your poorer victims."
//     },
//     {
//       type: "claim",
//       playbook: "Bravos",
//       name: "Terrorized Citizens",
//       rules: "You get +2 coin in your payoff for scores that involve battle or extortion.",
//       flavor: "The frightened locals offer you tribute whenever you lash out. They don’t want to be next."
//     },
//     {
//       type: "claim",
//       playbook: "Bravos",
//       name: "Warehouses",
//       rules: "You get +1d to acquire asset rolls.",
//       flavor: "You have space to hold all the various spoils you end up with after your battles. It can be useful on its own or for barter when you need it."
//     },
//     {
//       type: "claim",
//       playbook: "Hawkers",
//       name: "Cover Identities",
//       rules: "You get +1d to the engagement roll for deception and social plans.",
//       flavor: "False identities help confuse the opposition."
//     },
//     {
//       type: "claim",
//       playbook: "Hawkers",
//       name: "Cover Operation",
//       rules: "You get -2 heat per score.",
//       flavor: "The cover of a legitimate operation helps deflect some of the heat from law enforcement."
//     },
//     {
//       type: "claim",
//       playbook: "Hawkers",
//       name: "Foreign Market",
//       rules: "Any time during downtime, roll dice equal to your Tier. You earn coin equal to the highest result, minus your heat.",
//       flavor: "Some of your product makes its way out of the city."
//     },
//     {
//       type: "claim",
//       playbook: "Hawkers",
//       name: "Informants",
//       rules: "You get +1d to gather information for a score.",
//       flavor: "Your eyes and ears on the streets are always on the lookout for new clients."
//     },
//     {
//       type: "claim",
//       playbook: "Hawkers",
//       name: "Local Graft",
//       rules: "You get +2 coin in payoff for scores that involve a show of force or socializing.",
//       flavor: "A few city officials share bribe money with those who show that they’re players on the scene."
//     },
//     {
//       type: "claim",
//       playbook: "Hawkers",
//       name: "Lookouts",
//       rules: "You get +1d to Hunt or Survey on your turf.",
//       flavor: ""
//     },
//     {
//       type: "claim",
//       playbook: "Hawkers",
//       name: "Luxury Venue",
//       rules: "+1d to Consort and Sway rolls on-site.",
//       flavor: "Silks, paintings, and crystal impress the clientele."
//     },
//     {
//       type: "claim",
//       playbook: "Hawkers",
//       name: "Personal Clothier",
//       rules: "You get +1d to the engagement roll for social plans.",
//       flavor: "You always arrive on the scene in the most current and alluring fashion."
//     },
//     {
//       type: "claim",
//       playbook: "Hawkers",
//       name: "Surplus Cache",
//       rules: "You get +2 coin in payoff for scores that involve product sale or supply.",
//       flavor: "You have an abundance of product, which pads your pockets every now and then."
//     },
//     {
//       type: "claim",
//       playbook: "Hawkers",
//       name: "Vice Den",
//       rules: "Any time during downtime, roll dice equal to your Tier. You earn coin equal to the highest result, minus your heat.",
//       flavor: "Is this claim a den you’ve overtaken from another purveyor, or a new establishment replacing something else?"
//     },
//     {
//       type: "claim",
//       playbook: "Shadows",
//       name: "Covert Drop",
//       rules: "You get +2 coin in payoff for scores that involve espionage or sabotage.",
//       flavor: "The perfect hidden exchange point is worth the extra coin to discerning clientele."
//     },
//     {
//       type: "claim",
//       playbook: "Shadows",
//       name: "Drug Den",
//       rules: "Any time during downtime, roll dice equal to your Tier. You earn coin equal to the highest result, minus your heat.",
//       flavor: "What’s the drug of choice?"
//     },
//     {
//       type: "claim",
//       playbook: "Shadows",
//       name: "Gambling Den",
//       rules: "Any time during downtime, roll dice equal to your Tier. You earn coin equal to the highest result, minus your heat.",
//       flavor: "Cards, dice, or something more unusual on offer?"
//     },
//     {
//       type: "claim",
//       playbook: "Shadows",
//       name: "Hagfish Farm",
//       rules: "When you use the reduce heat downtime activity after a score that involves killing, you get +1d to the roll and quiet, convenient disposal of any corpses you left on the job.",
//       flavor: ""
//     },
//     {
//       type: "claim",
//       playbook: "Shadows",
//       name: "Infirmary",
//       rules: "You get +1d to healing treatment rolls. The infirmary also has beds for long-term convalescence.",
//       flavor: ""
//     },
//     {
//       type: "claim",
//       playbook: "Shadows",
//       name: "Informants",
//       rules: "You get +1d to gather information for a score.",
//       flavor: "Your eyes and ears on the streets are always on the lookout for new targets."
//     },
//     {
//       type: "claim",
//       playbook: "Shadows",
//       name: "Interrogation Chamber",
//       rules: "You get +1d to Command and Sway on-site.",
//       flavor: "Grisly business, but effective."
//     },
//     {
//       type: "claim",
//       playbook: "Shadows",
//       name: "Lookouts",
//       rules: "You get +1d to Hunt or Survey on your turf.",
//       flavor: ""
//     },
//     {
//       type: "claim",
//       playbook: "Shadows",
//       name: "Loyal Fence",
//       rules: "You get +2 coin in payoff for scores that involve burglary or robbery.",
//       flavor: "It requires a skilled eye and good contacts to move stolen goods."
//     },
//     {
//       type: "claim",
//       playbook: "Shadows",
//       name: "Secret Pathways",
//       rules: "You get +1d to the engagement roll for stealth plans.",
//       flavor: "You might have access to long-forgotten underground canals, rooftop walkways, or some other route of your choosing."
//     },
//     {
//       type: "claim",
//       playbook: "Shadows",
//       name: "Tavern",
//       rules: "You get +1d to Consort and Sway rolls on-site.",
//       flavor: "Some booze and friendly conversation can go a long way."
//     },
//     {
//       type: "claim",
//       playbook: "Smugglers",
//       name: "Ancient Gate",
//       rules: "Safe passage in the deathlands.",
//       flavor: "When you leave the city through this gate, spirits in the deathlands will not molest you unless directly provoked."
//     },
//     {
//       type: "claim",
//       playbook: "Smugglers",
//       name: "Cover Operation",
//       rules: "You get -2 heat per score.",
//       flavor: "What’s your cover? Who did you seize it from?"
//     },
//     {
//       type: "claim",
//       playbook: "Smugglers",
//       name: "Fleet",
//       rules: "Your cohorts have their own vehicles. Each cohort has a common vehicle, with quality equal to your Tier.",
//       flavor: ""
//     },
//     {
//       type: "claim",
//       playbook: "Smugglers",
//       name: "Informants",
//       rules: "You get +1d to gather information for a score.",
//       flavor: "Your eyes and ears on the streets are always on the lookout for new clients."
//     },
//     {
//       type: "claim",
//       playbook: "Smugglers",
//       name: "Luxury Fence",
//       rules: "You get +2 coin in payoff for scores that involve high-class targets.",
//       flavor: "It requires a skilled eye and good contacts to move hot luxury goods."
//     },
//     {
//       type: "claim",
//       playbook: "Smugglers",
//       name: "Secret Routes",
//       rules: "You get +1d to the engagement roll for transport plans.",
//       flavor: "You might have access to long-forgotten underground canals, dark streets normally hidden behind debris, or some other route of your choosing."
//     },
//     {
//       type: "claim",
//       playbook: "Smugglers",
//       name: "Side Business",
//       rules: "Any time during downtime, roll dice equal to your Tier. You earn coin equal to the highest result, minus your heat.",
//       flavor: "What kind of legitimate business is this? How do you get paid in secret?"
//     },
//     {
//       type: "claim",
//       playbook: "Smugglers",
//       name: "Tavern",
//       rules: "You get +1d to Consort and Sway rolls on-site.",
//       flavor: "Some booze and friendly conversation can go a long way."
//     },
//     {
//       type: "claim",
//       playbook: "Smugglers",
//       name: "Vice Den",
//       rules: "Any time during downtime, roll dice equal to your Tier. You earn coin equal to the highest result, minus your heat.",
//       flavor: "Perhaps you sell some of the contraband you smuggle here? Or do you not mix your operations?"
//     },
//     {
//       type: "claim",
//       playbook: "Smugglers",
//       name: "Warehouses",
//       rules: "You get +1d to acquire asset rolls.",
//       flavor: "You have space to hold all the various items and supplies you end up with from your smuggling runs. They can be useful on their own or for barter when you need it."
//     }
//   ],
//   ABILITIES: {
//     Descriptions: {
//       "Battleborn": "<p><em>If you 'reduce harm' that means the level of harm you're facing right now is reduced by one.</em></p><p><em>If you use this ability to push yourself, you get one of the benefits (+1d, +1 effect, act despite severe harm) but you don't take 2 stress.</em></p><p><em>Your special armor is restored at the beginning of downtime.</em></p>",
//       "Bodyguard": "<p><em>The protect teamwork maneuver lets you face a consequence for a teammate.</em></p><p><em>If you choose to resist that consequence, this ability gives you +1d to your resistance roll.</em></p><p><em>Also, when you read a situation to gather information about hidden dangers or potential attackers, you get +1 effect—which means more detailed information.</em></p>",
//       "Ghost Fighter": "<p><em>When you're imbued, you can strongly interact with ghosts and spirit-stuff, rather than weakly interact.</em></p><p><em>When you imbue yourself with spirit energy, how do you do it? What does it look like when the energy manifests?</em></p>",
//       "Leader": "<p><em>This ability makes your cohorts more effective in battle and also allows them to resist harm by using armor.</em></p><p><em>While you lead your cohorts, they won't stop fighting until they take fatal harm (level 4) or you order them to cease.</em></p><p><em>What do you do to inspire such bravery in battle?</em></p>",
//       "Mule": "<p><em>This ability is great if you want to wear heavy armor and pack a heavy weapon without attracting lots of attention. Since your exact gear is determined on-the-fly during an operation, having more load also gives you more options to get creative with when dealing with problems during a score.</em></p>",
//       "Not to Be Trifled With": "<p><em>When you push yourself to activate this ability, you still get one of the normal benefits of pushing yourself (+1d, +1 effect, etc.) in addition to the special ability.</em></p><p><em>If you perform a feat that verges on the superhuman, you might break a metal weapon with your bare hands, tackle a galloping horse, lift a huge weight, etc.</em></p><p><em>If you engage a small gang on equal footing, you don't suffer reduced effect due to scale against a small gang (up to six people).</em></p>",
//       "Savage": "<p><em>You instill fear in those around you when you get violent. How they react depends on the person. Some people will flee from you, some will be impressed, some will get violent in return. The GM judges the response of a given NPC.</em></p><p><em>In addition, when you Command someone who's affected by fear (from this ability or otherwise), take +1d to your roll.</em></p>",
//       "Vigorous": "<p><em>Your healing clock becomes a 3-clock, and you get a bonus die when you recover.</em></p>",
//       "Sharpshooter": "<p><em>When you push yourself to activate this ability, you still get one of the normal benefits of pushing yourself (+1d, +1 effect, etc.) in addition to the special ability.</em></p><p><em>The first use of this ability allows you to attempt long-range sniper shots that would otherwise be impossible with the rudimentary firearms of Duskwall.</em></p><p><em>The second use allows you to keep up a steady rate of fire in a battle (enough to 'suppress' a small gang up to six people), rather than stopping for a slow reload or discarding a gun after each shot. When an enemy is suppressed, they're reluctant to maneuver or attack (usually calling for a fortune roll to see if they can manage it).</em></p>",
//       "Focused": "<p><em>If you 'resist a consequence' of the appropriate type, you avoid it completely.</em></p><p><em>If you use this ability to push yourself, you get one of the benefits (+1d, +1 effect, act despite severe harm) but you don't take 2 stress.</em></p><p><em>Your special armor is restored at the beginning of downtime.</em></p>",
//       "Ghost Hunter (Arrow-Swift)": "<p><em>Your pet functions as a <strong>cohort (Expert: Hunter)</strong>.</em></p><p><em>This ability gives them potency against supernatural targets and the arcane ability to move extremely quickly, out-pacing any other creature or vehicle.</em></p>",
//       "Ghost Hunter (Ghost Form)": "<p><em>Your pet functions as a <strong>cohort (Expert: Hunter)</strong>.</em></p><p><em>This ability gives them potency against supernatural targets and the arcane ability to transform into electroplasmic vapor as if it were a spirit.</em></p>",
//       "Ghost Hunter (Mind Link)": "<p><em>Your pet functions as a <strong>cohort (Expert: Hunter)</strong>.</em></p><p><em>This ability gives them potency against supernatural targets and the arcane ability to share senses and thoughts telepathically with their master.</em></p>",
//       "Scout": "<p><em>A 'target' can be a person, a destination, a good ambush spot, an item, etc.</em></p>",
//       "Survivor": "<p><em>This ability gives you an additional stress box, so you have 10 instead of 9. The maximum number of stress boxes a PC can have (from any number of additional special abilities or upgrades) is 12.</em></p>",
//       "Tough As Nails": "<p><em>With this ability, level 3 harm doesn't incapacitate you; instead you take -1d to your rolls (as if it were level 2 harm). Level 2 harm affects you as if it were level 1 (less effect). Level 1 harm has no effect on you (but you still write it on your sheet, and must recover to heal it). Record the harm at its original level—for healing purposes, the original harm level applies.</em></p>",
//       "Alchemist": "<p><em>Follow the Inventing procedure with the GM (page 224) to define your first special alchemical formula.</em></p>",
//       "Artificer": "<p><em>Follow the Inventing procedure with the GM (page 224) to define your first spark-craft design.</em></p>",
//       "Fortitude": "<p><em>If you 'resist a consequence' of the appropriate type, you avoid it completely.</em></p><p><em>If you use this ability to push yourself, you get one of the benefits (+1d, +1 effect, act despite severe harm) but you don't take 2 stress.</em></p><p><em>Your special armor is restored at the beginning of downtime.</em></p>",
//       "Ghost Ward": "<p><em>If you make an area anathema to spirits, they will do everything they can to avoid it, and will suffer torment if forced inside the area.</em></p><p><em>If you make an area enticing to spirits, they will seek it out and linger in the area, and will suffer torment if forced to leave.</em></p><p><em>This effect lasts for several days over an area the size of a small room.</em></p><p><em>Particularly powerful or prepared spirits may roll their quality or arcane magnitude to see how well they're able to resist the effect.</em></p>",
//       "Physicker": "<p><em>Knowledge of anatomy and healing is a rare and esoteric thing in Duskwall. Without this ability, any attempts at treatment are likely to fail or make things worse.</em></p><p><em>You can use this ability to give first aid (rolling <strong>Tinker</strong>) to allow your patient to ignore a harm penalty for an hour or two.</em></p>",
//       "Saboteur": "<p><em>You can drill holes in things, melt stuff with acid, even use a muffled explosive, and it will all be very quiet and extremely hard to notice.</em></p>",
//       "Venomous": "<p><em>You choose the type of drug or poison when you get this ability. Only a single drug or poison may be chosen—you can't become immune to any essences, oils, or other alchemical substances.</em></p><p><em>You may change the drug or poison by completing a <strong>long-term project</strong>.</em></p><p><em>When you push yourself to activate this ability, you still get one of the normal benefits of pushing yourself (+1d, +1 effect, etc.) if you're making a roll, in addition to the special ability.</em></p>",
//       "Infiltrator": "<p><em>This ability lets you contend with higher-Tier enemies on equal footing. When you're cracking a safe, picking a lock, or sneaking past elite guards, your effect level is never reduced due to superior Tier or quality level of your opposition.</em></p><p><em>Are you a renowned safe cracker? Do people tell stories of how you slipped under the noses of two Chief Inspectors, or are your exceptional talents yet to be discovered?</em></p>",
//       "Ambush": "<p><em>This ability benefits from preparation— so don't forget you can do that in a flashback.</em></p>",
//       "Daredevil": "<p><em>This special ability is a bit of a gamble. The bonus die helps you, but if you suffer consequences, they'll probably be more costly to resist. But hey, you're a daredevil, so no big deal, right?</em></p>",
//       "The Devil's Footsteps": "<p><em>When you push yourself to activate this ability, you still get one of the normal benefits of pushing yourself (+1d, +1 effect, etc.) if you're making a roll, in addition to the special ability.</em></p><p><em>If you perform an athletic feat (running, tumbling, balance, climbing, etc.) that verges on the superhuman, you might climb a sheer surface that lacks good hand-holds, tumble safely out of a three-story fall, leap a shocking distance, etc.</em></p><p><em>If you maneuver to confuse your enemies, they attack each other for a moment before they realize their mistake. The GM might make a fortune roll to see how badly they harm or interfere with each other.</em></p>",
//       "Expertise": "<p><em>This special ability is good for covering for your team. If they're all terrible at your favored action, you don't have to worry about suffering a lot of stress when you lead their group action.</em></p>",
//       "Ghost Veil": "<p><em>This ability transforms you into an intangible shadow for a few moments. If you spend additional stress, you can extend the effect for additional benefits, which may improve your position or effect for action rolls, depending on the circumstances, as usual.</em></p>",
//       "Reflexes": "<p><em>This ability gives you the initiative in most situations. Some specially trained NPCs (and some demons and spirits) might also have reflexes, but otherwise, you're always the first to act, and can interrupt anyone else who tries to beat you to the punch.</em></p><p><em>This ability usually doesn't negate the need to make an action roll that you would otherwise have to make, but it may improve your position or effect.</em></p>",
//       "Shadow": "<p><em>If you 'resist a consequence' of the appropriate type, you avoid it completely.</em></p><p><em>If you use this ability to push yourself, you get one of the benefits (+1d, +1 effect, act despite severe harm) but you don't take 2 stress.</em></p><p><em>Your special armor is restored at the beginning of downtime.</em></p>",
//       "Rook's Gambit": "<p><em>This is the 'jack-of-all-trades' ability. If you want to attempt lots of different sorts of actions and still have a good dice pool to roll, this is the special ability for you.</em></p>",
//       "Cloak & Dagger": "<p><em>This ability gives you the chance to more easily get out of trouble if a covert operation goes haywire. Also, don't forget your <strong class='cyan-bright'>fine</strong> <strong>disguise kit</strong> gear, which boosts the effect of your covert deception methods.</em></p>",
//       "Ghost Voice": "<p><em>The first part of this ability gives you permission to do something that is normally impossible: when you speak to a spirit, it always listens and understands you, even if it would otherwise be too bestial or insane to do so.</em></p><p><em>The second part of the ability increases your effect when you use social actions with the supernatural.</em></p>",
//       "Like Looking Into a Mirror": "<p><em>This ability works in all situations without restriction. It is very powerful, but also a bit of a curse. You see though every lie, even the kind ones.</em></p>",
//       "A Little Something on the Side": "<p><em>Since this money comes at the end of downtime, after all downtime actions are resolved, you can't remove it from your stash and spend it on extra activities until your next downtime phase.</em></p>",
//       "Mesmerism": "<p><em>The victims' memory 'glosses over' the missing time, so it's not suspicious that they've forgotten something.</em></p><p><em>When you next interact with the victim, they remember everything clearly, including the strange effect of this ability.</em></p>",
//       "Subterfuge": "<p><em>If you 'resist a consequence' of the appropriate type, you avoid it completely.</em></p><p><em>If you use this ability to push yourself, you get one of the benefits (+1d, +1 effect, act despite severe harm) but you don't take 2 stress.</em></p><p><em>Your special armor is restored at the beginning of downtime.</em></p>",
//       "Trust in Me": "<p><em>This ability isn't just for social interactions. Any action can get the bonus. 'Intimate' is for you and the group to define, it need not exclusively mean romantic intimacy.</em></p>",
//       "Foresight": "<p><em>You can narrate an event in the past that helps your teammate now, or you might explain how you expected this situation and planned a helpful contingency that you reveal now.</em></p>",
//       "Calculating": "<p><em>If you forget to use this ability during downtime, you can still activate it during the score and flashback to the previous downtime when the extra activity happened.</em></p>",
//       "Connected": "<p><em>Your array of underworld connections can be leveraged to loan assets, pressure a vendor to give you a better deal, intimidate witnesses, etc.</em></p>",
//       "Functioning Vice": "<p><em>If you indulged your vice and rolled a 4, you could increase the result to 5 or 6, or you could reduce the result to 3 or 2 (perhaps to avoid overindulgence).</em></p><p><em>Allies that join you don't need to have the same vice as you, just one that could be indulged alongside yours somehow.</em></p>",
//       "Ghost Contract": "<p><em>The mark of the oath is obvious to anyone who sees it (perhaps a magical rune appears on the skin).</em></p><p><em>When you suffer 'Cursed' harm, you're incapacitated by withering: enfeebled muscles, hair falling out, bleeding from the eyes and ears, etc., until you either fulfill the deal or discover a way to heal the curse.</em></p>",
//       "Jail Bird": "<p><em>Zero is the minimum wanted level; this ability can't make your wanted level negative.</em></p>",
//       "Mastermind": "<p><em>If you protect a teammate, this ability negates or reduces the severity of a consequence or harm that your teammate is facing. You don't have to be present to use this ability—say how you prepared for this situation in the past.</em></p><p><em>If you use this ability to push yourself, you get one of the benefits (+1d, +1 effect, act despite severe harm) but you don't take 2 stress.</em></p><p><em>Your special armor is restored at the beginning of downtime.</em></p>",
//       "Weaving the Web": "<p><em>Your network of underworld connections can always be leveraged to gain insight for a job—even when your contacts aren't aware that they're helping you.</em></p>",
//       "Compel": "<p><em>The GM will tell you if you sense any ghosts nearby. If you don't, you can <strong>gather information</strong> (maybe <strong>Attune</strong>, <strong>Survey</strong>, or <strong>Study</strong>) to attempt to locate one.</em></p><p><em>By default, a ghost wants to satisfy its need for life essence and to exact vengeance. When you compel it, you can give it a general or specific command, but the more general it is (like 'Protect me') the more the ghost will interpret it according to its own desires.</em></p><p><em>Your control over the ghost lasts until the command is fulfilled, or until a day has passed, whichever comes first.</em></p>",
//       "Iron Will": "<p><em>With this ability, you do not freeze up or flee when confronted by any kind of supernatural entity or strange occult event.</em></p>",
//       "Occultist": "<p><em>Consorting with a given entity may require special preparations or travel to a specific place. The GM will tell you about any requirements.</em></p><p><em>You get the bonus die to your Command rolls because you can demonstrate a secret knowledge of or influence over the entity when you interact with cultists.</em></p>",
//       "Ritual": "<p><em>Without this special ability, the study and practice of rituals leaves you utterly vulnerable to the powers you supplicate. Such endeavors are not recommended.</em></p>",
//       "Strange Methods": "<p><em>Follow the Inventing procedure with the GM (page 224) to define your first arcane design.</em></p>",
//       "Tempest": "<p><em>When you push yourself to activate this ability, you still get one of the normal benefits of pushing yourself (+1d, +1 effect, etc.) if you're making a roll, in addition to the special ability.</em></p><p><em>When you unleash lightning as a weapon, the GM will describe its effect level and significant collateral damage. If you unleash it in combat against an enemy who's threatening you, you'll still make an action roll in the fight (usually with Attune).</em></p><p><em>When you summon a storm, the GM will describe its effect level. If you're using this power as cover or distraction, it's probably a setup teamwork maneuver, using Attune.</em></p>",
//       "Warded": "<p><em>If you resist a consequence, this ability negates it completely.</em></p><p><em>If you use this ability to push yourself, you get one of the benefits (+1d, +1 effect, act despite severe harm) but you don't take 2 stress.</em></p><p><em>Your special armor is restored at the beginning of downtime.</em></p>"
//     },
//     RollMods: {
//       "Battleborn": [
//         {
//           key: "system.roll_mods",
//           mode: 2,
//           priority: null,
//           value: "name:Battleborn@cat:after@type:ability@cTypes:Action@cTraits:hunt|finesse|prowl|skirmish|wreck|attune|command@eKey:Negate-PushCost|Cost-SpecialArmor@status:Hidden@tooltip:<h1>Battleborn</h1><p>You may expend your <strong class='cyan-bright'>special armor</strong> instead of paying <strong class='red-bright'>2 stress</strong> to <strong>Push</strong> yourself during a fight.</p>"
//         },
//         {
//           key: "system.roll_mods",
//           mode: 2,
//           priority: null,
//           value: "name:Battleborn@cat:roll@type:ability@cTypes:Resistance@val:0@eKey:Cost-SpecialArmor|Negate-HarmLevel@status:Hidden@tooltip:<h1>Battleborn</h1><p>You may expend your <strong class='cyan-bright'>special armor</strong> to reduce the level of <strong class='red-bright'>harm</strong> you are resisting by one.</p>"
//         }
//       ],
//       "Bodyguard": [
//         {
//           key: "system.roll_mods",
//           mode: 2,
//           priority: null,
//           value: "name:Bodyguard@cat:roll@type:ability@cTypes:Resistance@status:Hidden@tooltip:<h1>Bodyguard</h1><p>When you <strong class='cyan-bright'>protect</strong> a teammate, take <strong class='gold-bright'>+1d</strong> to your <strong>resistance</strong> roll.</p>"
//         },
//         {
//           key: "system.roll_mods",
//           mode: 2,
//           priority: null,
//           value: "name:Bodyguard@cat:effect@type:ability@status:Hidden@tooltip:<h1>Bodyguard</h1><p>When you <strong class='cyan-bright'>gather information</strong> to anticipate possible threats in the current situation, you get <strong class='gold-bright'>+1 effect</strong>.</p>"
//         }
//       ],
//       "Ghost Fighter": [
//         {
//           key: "system.roll_mods",
//           mode: 2,
//           priority: null,
//           value: "name:Ghost Fighter@cat:effect@type:ability@cTypes:Action@cTraits:hunt|finesse|prowl|skirmish|wreck|attune|command@val:0@eKey:ForceOn-Potency@status:Hidden@tooltip:<h1>Ghost Fighter</h1><p>You may <strong class='cyan-bright'>imbue</strong> your hands, melee weapons, or tools with spirit energy, giving you <strong class='gold-bright'>Potency</strong> in combat vs. the supernatural.</p><p>You may also grapple with spirits to restrain and capture them.</p>"
//         }
//       ],
//       "Leader": [
//         {
//           key: "system.roll_mods",
//           mode: 2,
//           priority: null,
//           isCohort: true,
//           value: "name:Leader@cat:effect@type:ability@cTypes:Action@cTraits:command@status:Hidden@tooltip:<h1>Leader</h1><p>When a <strong class='cyan-bright'>Leader</strong> <strong>Command</strong>s this cohort in combat, it gains <strong class='gold-bright'>+1 effect</strong>.</p>"
//         }
//       ],
//       "Not to Be Trifled With": [
//         {
//           key: "system.roll_mods",
//           mode: 2,
//           priority: null,
//           value: "name:Superhuman Feat@cat:roll@type:ability@cTypes:Action@cTraits:hunt|finesse|prowl|skirmish|wreck|command@val:0@eKey:Is-Push|ForceOn-Push@sourceName:Not to Be Trifled With@status:Hidden@tooltip:<h1>Not to Be Trifled With — Superhuman Feat</h1><p>You can <strong>Push</strong> yourself to perform a feat of physical force that verges on the superhuman <em>(you might break a metal weapon with your bare hands, tackle a galloping horse, lift a huge weight, etc.)</em>.</p><p>You still gain <strong class='gold-bright'>+1d</strong> to your roll at the cost of <strong class='red-bright'>2 stress</strong>, as normal for a <strong>Push</strong>.</p>"
//         },
//         {
//           key: "system.roll_mods",
//           mode: 2,
//           priority: null,
//           value: "name:Superhuman Feat@cat:effect@type:ability@cTypes:Action@cTraits:hunt|finesse|prowl|skirmish|wreck|command@val:0@eKey:Is-Push|ForceOn-Push@sourceName:Not to Be Trifled With@status:Hidden@tooltip:<h1>Not to Be Trifled With — Superhuman Feat</h1><p>You can <strong>Push</strong> yourself to perform a feat of physical force that verges on the superhuman <em>(you might break a metal weapon with your bare hands, tackle a galloping horse, lift a huge weight, etc.)</em>.</p><p>You still gain <strong class='gold-bright'>+1 effect</strong> at the cost of <strong class='red-bright'>2 stress</strong>, as normal for a <strong>Push</strong>.</p>"
//         },
//         {
//           key: "system.roll_mods",
//           mode: 2,
//           priority: null,
//           value: "name:Engage Gang@cat:roll@type:ability@cTypes:Action@cTraits:hunt|finesse|prowl|skirmish|wreck|attune|command@val:0@eKey:Is-Push|ForceOn-Push|Negate-ScalePenalty@sourceName:Not to Be Trifled With@status:Hidden@tooltip:<h1>Not to Be Trifled With — Engage Gang</h1><p>You can <strong>Push</strong> yourself to engage a gang of up to six members on equal footing (negating any <strong>Scale</strong> penalties).</p><p>You still gain <strong class='gold-bright'>+1d</strong> to your roll at the cost of <strong class='red-bright'>2 stress</strong>, as normal for a <strong>Push</strong>.</p>"
//         },
//         {
//           key: "system.roll_mods",
//           mode: 2,
//           priority: null,
//           value: "name:Engage Gang@cat:effect@type:ability@cTypes:Action@cTraits:hunt|finesse|prowl|skirmish|wreck|attune|command@val:0@eKey:Is-Push|ForceOn-Push|Negate-ScalePenalty@sourceName:Not to Be Trifled With@status:Hidden@tooltip:<h1>Not to Be Trifled With — Engage Gang</h1><p>You can <strong>Push</strong> yourself to engage a gang of up to six members on equal footing (negating any <strong>Scale</strong> penalties).</p><p>You still gain <strong class='gold-bright'>+1 effect</strong> at the cost of <strong class='red-bright'>2 stress</strong>, as normal for a <strong>Push</strong>.</p>"
//         }
//       ],
//       "Savage": [
//         {
//           key: "system.roll_mods",
//           mode: 2,
//           priority: null,
//           value: "name:Savage@cat:roll@type:ability@cTypes:Action@cTraits:command@status:Hidden@tooltip:<h1>Savage</h1><p>When you <strong>Command</strong> a fightened target, gain <strong class='gold-bright'>+1d</strong> to your roll.</p>"
//         }
//       ],
//       "Vigorous": [
//         {
//           key: "system.roll_mods",
//           mode: 2,
//           priority: null,
//           value: "name:Vigorous@cat:roll@type:ability@cTypes:Downtime@aTypes:Engagement|Recover@status:Hidden@tooltip:<h1>Vigorous</h1><p>You gain <strong class='gold-bright'>+1d</strong> to <strong>healing treatment</strong> rolls.</p>"
//         }
//       ],
//       "Sharpshooter": [
//         {
//           key: "system.roll_mods",
//           mode: 2,
//           priority: null,
//           value: "name:Extreme Range@cat:roll@type:ability@cTypes:Action@cTraits:hunt|finesse|prowl|skirmish|wreck@val:0@eKey:Is-Push|ForceOn-Push@sourceName:Sharpshooter@status:Hidden@tooltip:<h1>Sharpshooter — Extreme Range</h1><p>You can <strong>Push</strong> yourself to make a ranged attack at extreme distance, one that would otherwise be impossible with the rudimentary firearms of Duskwall.</p><p>You still gain <strong class='gold-bright'>+1d</strong> to your roll at the cost of <strong class='red-bright'>2 stress</strong>, as normal for a <strong>Push</strong>.</p>"
//         },
//         {
//           key: "system.roll_mods",
//           mode: 2,
//           priority: null,
//           value: "name:Extreme Range@cat:effect@type:ability@cTypes:Action@cTraits:hunt|finesse|prowl|skirmish|wreck@val:0@eKey:Is-Push|ForceOn-Push@sourceName:Sharpshooter@status:Hidden@tooltip:<h1>Sharpshooter — Extreme Range</h1><p>You can <strong>Push</strong> yourself to make a ranged attack at extreme distance, one that would otherwise be impossible with the rudimentary firearms of Duskwall.</p><p>You still gain <strong class='gold-bright'>+1 effect</strong> at the cost of <strong class='red-bright'>2 stress</strong>, as normal for a <strong>Push</strong>.</p>"
//         },
//         {
//           key: "system.roll_mods",
//           mode: 2,
//           priority: null,
//           value: "name:Suppression Fire@cat:roll@type:ability@cTypes:Action@cTraits:hunt|finesse|prowl|skirmish|wreck@val:0@eKey:Is-Push|ForceOn-Push@sourceName:Sharpshooter@status:Hidden@tooltip:<h1>Sharpshooter — Suppression Fire</h1><p>You can <strong>Push</strong> yourself to maintain a steady rate of suppression fire during a battle, enough to suppress a small gang of up to six members. <em>(When an enemy is suppressed, they're reluctant to maneuver or attack, usually calling for a <strong>fortune</strong> roll to see if they can manage it.)</em></p><p>You still gain <strong class='gold-bright'>+1d</strong> to your roll at the cost of <strong class='red-bright'>2 stress</strong>, as normal for a <strong>Push</strong>.</p>"
//         },
//         {
//           key: "system.roll_mods",
//           mode: 2,
//           priority: null,
//           value: "name:Suppression Fire@cat:effect@type:ability@cTypes:Action@cTraits:hunt|finesse|prowl|skirmish|wreck@val:0@eKey:Is-Push|ForceOn-Push@sourceName:Sharpshooter@status:Hidden@tooltip:<h1>Sharpshooter — Suppression Fire</h1><p>You can <strong>Push</strong> yourself to maintain a steady rate of suppression fire during a battle, enough to suppress a small gang of up to six members. <em>When an enemy is suppressed, they're reluctant to maneuver or attack, usually calling for a <strong>fortune</strong> roll to see if they can manage it.</em></p><p>You still gain <strong class='gold-bright'>+1 effect</strong> at the cost of <strong class='red-bright'>2 stress</strong>, as normal for a <strong>Push</strong>.</p>"
//         }
//       ],
//       "Focused": [
//         {
//           key: "system.roll_mods",
//           mode: 2,
//           priority: null,
//           value: "name:Focused@cat:roll@type:ability@cTypes:Resistance@cTraits:Insight|Resolve@val:0@eKey:Cost-SpecialArmor|Negate-Consequence@status:Hidden@tooltip:<h1>Focused</h1><p>You may expend your <strong class='cyan-bright'>special armor</strong> to completely negate a <strong>consequence</strong> of <strong class='red-bright'>surprise</strong> or <strong class='red-bright'>mental harm</strong>.</p>"
//         },
//         {
//           key: "system.roll_mods",
//           mode: 2,
//           priority: null,
//           value: "name:Focused@cat:after@type:ability@cTypes:Action@cTraits:hunt|study|survey|finesse|prowl|skirmish|wreck@eKey:Negate-PushCost|Cost-SpecialArmor@status:Hidden@tooltip:<h1>Focused</h1><p>You may expend your <strong class='cyan-bright'>special armor</strong> instead of paying <strong class='red-bright'>2 stress</strong> to <strong>Push</strong> yourself for ranged combat or tracking.</p>"
//         }
//       ],
//       "Ghost Hunter (Arrow-Swift)": [
//         {
//           key: "system.roll_mods",
//           mode: 2,
//           priority: null,
//           isCohort: true,
//           value: "name:Ghost Hunter (Arrow-Swift)@cat:effect@type:ability@cTypes:Action@cTraits:quality@val:0@eKey:ForceOn-Potency@status:Hidden@tooltip:<h1>Ghost Hunter (Arrow-Swift)</h1><p>This cohort is <strong class='cyan-bright'>imbued</strong> with spirit energy, granting it <strong class='gold-bright'>Potency</strong> against the supernatural.</p>"
//         }
//       ],
//       "Ghost Hunter (Ghost Form)": [
//         {
//           key: "system.roll_mods",
//           mode: 2,
//           priority: null,
//           isCohort: true,
//           value: "name:Ghost Hunter (Ghost Form)@cat:effect@type:ability@cTypes:Action@cTraits:quality@val:0@eKey:ForceOn-Potency@status:Hidden@tooltip:<h1>Ghost Hunter (Ghost Form)</h1><p>This cohort is <strong class='cyan-bright'>imbued</strong> with spirit energy, granting it <strong class='gold-bright'>Potency</strong> against the supernatural.</p>"
//         }
//       ],
//       "Ghost Hunter (Mind Link)": [
//         {
//           key: "system.roll_mods",
//           mode: 2,
//           priority: null,
//           isCohort: true,
//           value: "name:Ghost Hunter (Mind Link)@cat:effect@type:ability@cTypes:Action@cTraits:quality@val:0@eKey:ForceOn-Potency@status:Hidden@tooltip:<h1>Ghost Hunter (Mind Link)</h1><p>This cohort is <strong class='cyan-bright'>imbued</strong> with spirit energy, granting it <strong class='gold-bright'>Potency</strong> against the supernatural.</p>"
//         }
//       ],
//       "Scout": [
//         {
//           key: "system.roll_mods",
//           mode: 2,
//           priority: null,
//           value: "name:Scout@cat:effect@type:ability@cTypes:Action|Downtime|LongTermProject@cTraits:hunt|study|survey|attune|consort|sway@status:Hidden@tooltip:<h1>Scout</h1><p>When you <strong>gather information</strong> to discover the location of a target <em>(a person, a destination, a good ambush spot, etc)</em>, you gain <strong class='gold-bright'>+1 effect</strong>.</p>"
//         },
//         {
//           key: "system.roll_mods",
//           mode: 2,
//           priority: null,
//           value: "name:Scout@cat:roll@type:ability@cTypes:Action@cTraits:hunt|finesse|prowl@status:Hidden@tooltip:<h1>Scout</h1><p>When you hide in a prepared position or use camouflage, you get <strong class='gold-bright'>+1d</strong> to rolls to avoid detection.</p>"
//         }
//       ],
//       "Alchemist": [
//         {
//           key: "system.roll_mods",
//           mode: 2,
//           priority: null,
//           value: "name:Alchemist@cat:result@type:ability@cTypes:Downtime|LongTermProject@status:Hidden@tooltip:<h1>Alchemist</h1><p>When you <strong>invent</strong> or <strong>craft</strong> a creation with <em>alchemical</em> features, you gain <strong class='gold-bright'>+1 result level</strong> to your roll.</p>"
//         }
//       ],
//       "Artificer": [
//         {
//           key: "system.roll_mods",
//           mode: 2,
//           priority: null,
//           value: "name:Artificer@cat:result@type:ability@cTypes:Downtime|LongTermProject@cTraits:study|tinker@status:Hidden@tooltip:<h1>Artificer</h1><p>When you <strong>invent</strong> or <strong>craft</strong> a creation with <em>spark-craft</em> features, you gain <strong class='gold-bright'>+1 result level</strong> to your roll.</p>"
//         }
//       ],
//       "Fortitude": [
//         {
//           key: "system.roll_mods",
//           mode: 2,
//           priority: null,
//           value: "name:Fortitude@cat:roll@type:ability@cTypes:Resistance@val:0@eKey:Cost-SpecialArmor|Negate-Consequence@status:Hidden@tooltip:<h1>Fortitude</h1><p>You may expend your <strong class='cyan-bright'>special armor</strong> to completely negate a <strong>consequence</strong> of <strong class='red-bright'>fatigue</strong>, <strong class='red-bright'>weakness</strong>, or <strong class='red-bright'>chemical effects</strong>.</p>"
//         },
//         {
//           key: "system.roll_mods",
//           mode: 2,
//           priority: null,
//           value: "name:Fortitude@cat:after@type:ability@cTypes:Action@cTraits:study|survey|tinker|finesse|skirmish|wreck@eKey:Negate-PushCost|Cost-SpecialArmor@status:Hidden@tooltip:<h1>Fortitude</h1><p>You may expend your <strong class='cyan-bright'>special armor</strong> instead of paying <strong class='red-bright'>2 stress</strong> to <strong>Push</strong> yourself when working with technical skill or handling alchemicals.</p>"
//         }
//       ],
//       "Ghost Ward": [
//         {
//           key: "system.roll_mods",
//           mode: 2,
//           priority: null,
//           value: "name:Ghost Ward@cat:after@type:ability@cTypes:Action@cTraits:wreck@val:0@status:Hidden@tooltip:<h1>Ghost Ward</h1><p>When you <strong>Wreck</strong> an area with <em>arcane</em> substances, ruining it for any other use, it becomes <strong class='cyan-bright'>anathema</strong> or <strong class='cyan-bright'>enticing</strong> to spirits (your choice).</p>"
//         }
//       ],
//       "Physicker": [
//         {
//           key: "system.roll_mods",
//           mode: 2,
//           priority: null,
//           isMember: true,
//           value: "name:Physicker@cat:roll@type:ability@cTypes:Downtime@aTypes:Engagement|Recover@status:Hidden@tooltip:<h1>Physicker</h1><p>You gain <strong class='gold-bright'>+1d</strong> to your <strong>healing treatment</strong> rolls.</p>"
//         }
//       ],
//       "Saboteur": [
//         {
//           key: "system.roll_mods",
//           mode: 2,
//           priority: null,
//           value: "name:Saboteur@cat:after@type:ability@cTypes:Action|Downtime|LongTermProject@aTraits:wreck@val:0@status:Hidden@tooltip:<h1>Saboteur</h1><p>When you <strong>Wreck</strong>, your work is much quieter than it should be and the damage is very well-hidden from casual inspection.</p>"
//         }
//       ],
//       "Venomous": [
//         {
//           key: "system.roll_mods",
//           mode: 2,
//           priority: null,
//           value: "name:Venomous@cat:roll@type:ability@cTypes:Action@val:0@eKey:Is-Push|ForceOn-Push@status:Hidden@tooltip:<h1>Venomous</h1><p>You can <strong>Push</strong> yourself to secrete your chosen drug or poison through your skin or saliva, or exhale it as a vapor.</p><p>You still gain <strong class='gold-bright'>+1d</strong> to your roll at the cost of <strong class='red-bright'>2 stress</strong>, as normal for a <strong>Push</strong>.</p>"
//         },
//         {
//           key: "system.roll_mods",
//           mode: 2,
//           priority: null,
//           value: "name:Venomous@cat:effect@type:ability@cTypes:Action@val:0@eKey:Is-Push|ForceOn-Push@status:Hidden@tooltip:<h1>Venomous</h1><p>You can <strong>Push</strong> yourself to secrete your chosen drug or poison through your skin or saliva, or exhale it as a vapor.</p><p>You still gain <strong class='gold-bright'>+1 effect</strong> at the cost of <strong class='red-bright'>2 stress</strong>, as normal for a <strong>Push</strong>.</p>"
//         }
//       ],
//       "Infiltrator": [
//         {
//           key: "system.roll_mods",
//           mode: 2,
//           priority: null,
//           value: "name:Infiltrator@cat:effect@type:ability@cTypes:Action|Downtime|LongTermProject@cTraits:tinker|finesse|wreck|attune@val:0@eKey:Negate-QualityPenalty|Negate-TierPenalty@status:Hidden@tooltip:<h1>Infiltrator</h1><p>You are not affected by low <strong class='red-bright'>Quality</strong> or <strong class='red-bright'>Tier</strong> when you bypass security measures.</p>"
//         }
//       ],
//       "Ambush": [
//         {
//           key: "system.roll_mods",
//           mode: 2,
//           priority: null,
//           value: "name:Ambush@cat:roll@type:ability@cTypes:Action@cTraits:hunt|finesse|prowl|skirmish|wreck|attune@status:Hidden@tooltip:<h1>Ambush</h1><p>When you attack from hiding or spring a trap, you get <strong class='gold-bright'>+1d</strong> to your roll.</p>"
//         }
//       ],
//       "Daredevil": [
//         {
//           key: "system.roll_mods",
//           mode: 2,
//           priority: null,
//           value: "name:Daredevil@cat:roll@type:ability@eKey:AutoRevealOn-Desperate|ForceOn-(Daredevil),after@status:ToggledOff@tooltip:<h1>Daredevil</h1><p>When you make a <strong class='red-bright'>desperate</strong> <strong>action</strong> roll, you may gain <strong class='gold-bright'>+1d</strong> to your roll, if you also take <strong class='red-bright'>−1d</strong> to <strong>resistance</strong> rolls against any consequences.</p>"
//         },
//         {
//           key: "system.roll_mods",
//           mode: 2,
//           priority: null,
//           value: "name:Daredevil@cat:roll@posNeg:negative@type:ability@cTypes:Resistance@status:Hidden@tooltip:<h1 class='red-bright'>Daredevil</h1><p>By choosing to gain <strong>+1d</strong> to your <strong class='red-bright'>desperate</strong> <strong>action</strong> roll, you suffer <strong class='red-bright'>−1d</strong> to <strong>resistance</strong> rolls against the consequences of that action.</p>"
//         },
//         {
//           key: "system.roll_mods",
//           mode: 2,
//           priority: null,
//           value: "name:(Daredevil)@cat:after@posNeg:negative@type:ability@val:0@sourceName:Daredevil@status:Hidden@tooltip:<h1 class='red-bright'>Daredevil</h1><p>You will suffer <strong class='red-bright'>−1d</strong> to <strong>resistance</strong> rolls against any consequences of this <strong>action</strong> roll.</p>"
//         }
//       ],
//       "The Devil's Footsteps": [
//         {
//           key: "system.roll_mods",
//           mode: 2,
//           priority: null,
//           value: "name:Superhuman Feat@cat:roll@type:ability@val:0@eKey:Is-Push|ForceOn-Push@sourceName:The Devil's Footsteps@status:ToggledOff@tooltip:<h1>The Devil's Footsteps — Superhuman Feat</h1><p>You can <strong>Push</strong> yourself to perform a feat of physical force that verges on the superhuman <em>(you might climb a sheer surface that lacks good hand-holds, tumble safely out of a three-story fall, leap a shocking distance, etc.)</em>.</p><p>You still gain <strong class='gold-bright'>+1d</strong> to your roll at the cost of <strong class='red-bright'>2 stress</strong>, as normal for a <strong>Push</strong>.</p>"
//         },
//         {
//           key: "system.roll_mods",
//           mode: 2,
//           priority: null,
//           value: "name:Superhuman Feat@cat:effect@type:ability@val:0@eKey:Is-Push|ForceOn-Push@sourceName:The Devil's Footsteps@status:ToggledOff@tooltip:<h1>The Devil's Footsteps — Superhuman Feat</h1><p>You can <strong>Push</strong> yourself to perform a feat of physical force that verges on the superhuman <em>(you might climb a sheer surface that lacks good hand-holds, tumble safely out of a three-story fall, leap a shocking distance, etc.)</em>.</p><p>You still gain <strong class='gold-bright'>+1 effect</strong> at the cost of <strong class='red-bright'>2 stress</strong>, as normal for a <strong>Push</strong>.</p>"
//         },
//         {
//           key: "system.roll_mods",
//           mode: 2,
//           priority: null,
//           value: "name:Sow Confusion@cat:roll@type:ability@val:0@eKey:Is-Push|ForceOn-Push@sourceName:The Devil's Footsteps@status:ToggledOff@tooltip:<h1>The Devil's Footsteps — Sow Confusion</h1><p>You can <strong>Push</strong> yourself to maneuver to confuse your enemies so they mistakenly attack each other. <em>(They attack each other for a moment before they realize their mistake. The GM might make a <strong>fortune</strong> roll to see how badly they harm or interfere with each other.)</em>.</p><p>You still gain <strong class='gold-bright'>+1d</strong> to your roll at the cost of <strong class='red-bright'>2 stress</strong>, as normal for a <strong>Push</strong>.</p>"
//         },
//         {
//           key: "system.roll_mods",
//           mode: 2,
//           priority: null,
//           value: "name:Sow Confusion@cat:effect@type:ability@val:0@eKey:Is-Push|ForceOn-Push@sourceName:The Devil's Footsteps@status:ToggledOff@tooltip:<h1>The Devil's Footsteps — Sow Confusion</h1><p>You can <strong>Push</strong> yourself to maneuver to confuse your enemies so they mistakenly attack each other. <em>(They attack each other for a moment before they realize their mistake. The GM might make a <strong>fortune</strong> roll to see how badly they harm or interfere with each other.)</em>.</p><p>You still gain <strong class='gold-bright'>+1 effect</strong> at the cost of <strong class='red-bright'>2 stress</strong>, as normal for a <strong>Push</strong>.</p>"
//         }
//       ],
//       "Shadow": [
//         {
//           key: "system.roll_mods",
//           mode: 2,
//           priority: null,
//           value: "name:Shadow@cat:after@type:ability@cTypes:Action@cTraits:hunt|study|survey|tinker|finesse|prowl|skirmish|wreck@eKey:Negate-PushCost|Cost-SpecialArmor@status:Hidden@tooltip:<h1>Shadow</h1><p>You may expend your <strong class='cyan-bright'>special armor</strong> instead of paying <strong class='red-bright'>2 stress</strong> to <strong>Push</strong> yourself for a feat of athletics or stealth.</p>"
//         },
//         {
//           key: "system.roll_mods",
//           mode: 2,
//           priority: null,
//           value: "name:Shadow@cat:roll@type:ability@cTypes:Resistance@val:0@eKey:Cost-SpecialArmor|Negate-HarmLevel@status:Hidden@tooltip:<h1>Shadow</h1><p>You may expend your <strong class='cyan-bright'>special armor</strong> to completely negate a <strong>consequence</strong> of <strong class='red-bright'>detection</strong> or <strong class='red-bright'>security measures</strong>.</p>"
//         }
//       ],
//       "Rook's Gambit": [
//         {
//           key: "system.roll_mods",
//           mode: 2,
//           priority: null,
//           value: "name:Rook's Gambit@cat:roll@type:ability@cTypes:Action|Downtime|AcquireAsset|LongTermProject@val:0@eKey:ForceOn-BestAction|Cost-Stress2@status:Hidden@tooltip:<h1>Rook's Gambit</h1><p>Take <strong class='red-bright'>2 stress</strong> to roll your <strong class='gold-bright'>best action rating</strong> while performing a different action.</p><p><em>(Describe how you adapt your skill to this use.)</em></p>"
//         }
//       ],
//       "Cloak & Dagger": [
//         {
//           key: "system.roll_mods",
//           mode: 2,
//           priority: null,
//           value: "name:Cloak & Dagger@cat:roll@type:ability@cTypes:Action|Resistance@cTraits:finesse|prowl|attune|command|consort|sway|Insight@status:Hidden@tooltip:<h1>Cloak & Dagger</h1><p>When you use a disguise or other form of covert misdirection, you get <strong class='gold-bright'>+1d</strong> to rolls to confuse or deflect suspicion.</p>"
//         }
//       ],
//       "Ghost Voice": [
//         {
//           key: "system.roll_mods",
//           mode: 2,
//           priority: null,
//           value: "name:Ghost Voice@cat:effect@type:ability@cTypes:Action|Downtime|LongTermProject@cTraits:attune|command|consort|sway@val:0@eKey:ForceOn-Potency@status:Hidden@tooltip:<h1>Ghost Voice</h1><p>You gain <strong class='gold-bright'>Potency</strong> when communicating with the supernatural.</p>"
//         }
//       ],
//       "Mesmerism": [
//         {
//           key: "system.roll_mods",
//           mode: 2,
//           priority: null,
//           value: "name:Mesmerism@cat:after@type:ability@cTypes:Action@cTraits:sway@val:0@status:Hidden@tooltip:<h1>Mesmerism</h1><p>When you <strong>Sway</strong> someone, you may cause them to forget that it's happened until they next interact with you.</p>"
//         }
//       ],
//       "Subterfuge": [
//         {
//           key: "system.roll_mods",
//           mode: 2,
//           priority: null,
//           value: "name:Subterfuge@cat:roll@type:ability@cTypes:Resistance@cTraits:Insight@val:0@eKey:Cost-SpecialArmor|Negate-Consequence@status:Hidden@tooltip:<h1>Subterfuge</h1><p>You may expend your <strong class='cyan-bright'>special armor</strong> to completely negate a <strong>consequence</strong> of <strong class='red-bright'>suspicion</strong> or <strong class='red-bright'>persuasion</strong>.</p>"
//         },
//         {
//           key: "system.roll_mods",
//           mode: 2,
//           priority: null,
//           value: "name:Subterfuge@cat:after@type:ability@cTypes:Action@cTraits:finesse|attune|consort|sway@eKey:Negate-PushCost|Cost-SpecialArmor@status:Hidden@tooltip:<h1>Subterfuge</h1><p>You may expend your <strong class='cyan-bright'>special armor</strong> instead of paying <strong class='red-bright'>2 stress</strong> to <strong>Push</strong> yourself for subterfuge.</p>"
//         }
//       ],
//       "Trust in Me": [
//         {
//           key: "system.roll_mods",
//           mode: 2,
//           priority: null,
//           value: "name:Trust in Me@cat:roll@type:ability@cTypes:Action|Downtime|LongTermProject@cTraits:hunt|study|survey|tinker|finesse|prowl|skirmish|wreck|attune|command|consort|sway|Insight|Prowess|Resolve|tier|quality|magnitude|number@status:Hidden@tooltip:<h1>Trust in Me</h1><p>You gain <strong class='gold-bright'>+1d</strong> to rolls opposed by a target with whom you have an intimate relationship.</p>"
//         }
//       ],
//       "Connected": [
//         {
//           key: "system.roll_mods",
//           mode: 2,
//           priority: null,
//           value: "name:Connected@cat:result@type:ability@cTypes:Downtime@aTypes:AcquireAsset|ReduceHeat@status:Hidden@tooltip:<h1>Connected</h1><p>When you <strong>acquire an asset</strong> or <strong>reduce heat</strong>, you get <strong class='gold-bright'>+1 result level</strong>.</p>"
//         }
//       ],
//       "Jail Bird": [
//         {
//           key: "system.roll_mods",
//           mode: 2,
//           priority: null,
//           value: "name:Jail Bird@cat:effect@type:ability@cTypes:Downtime@aTypes:Incarceration@eKey:Increase-Tier1@status:Hidden@tooltip:<h1>Jail Bird</h1><p>You gain <strong class='gold-bright'>+1 Tier</strong> while <strong class='cyan-bright'>incarcerated</strong>.</p>"
//         }
//       ],
//       "Mastermind": [
//         {
//           key: "system.roll_mods",
//           mode: 2,
//           priority: null,
//           value: "name:Mastermind@cat:after@type:ability@cTypes:Action|Downtime|LongTermProject@eKey:Negate-PushCost|Cost-SpecialArmor@status:Hidden@tooltip:<h1>Mastermind</h1><p>You may expend your <strong class='cyan-bright'>special armor</strong> instead of paying <strong class='red-bright'>2 stress</strong> to <strong>Push</strong> yourself when you <strong>gather information</strong> or work on a <strong>long-term project</strong>.</p>"
//         }
//       ],
//       "Weaving the Web": [
//         {
//           key: "system.roll_mods",
//           mode: 2,
//           priority: null,
//           value: "name:Weaving the Web@cat:roll@type:ability@cTypes:Action|Downtime|LongTermProject@cTraits:consort@status:Hidden@tooltip:<h1>Weaving the Web</h1><p>You gain <strong class='gold-bright'>+1d</strong> to <strong>Consort</strong> when you <strong>gather information</strong> on a target for a <strong>score</strong>.</p>"
//         },
//         {
//           key: "system.roll_mods",
//           mode: 2,
//           priority: null,
//           value: "name:Weaving the Web@cat:roll@type:ability@cTypes:GatherInfo@status:Hidden@tooltip:<h1>Weaving the Web</h1><p>You gain <strong class='gold-bright'>+1d</strong> to the <strong>engagement roll</strong> for the targeted <strong>score</strong>.</p>"
//         }
//       ],
//       "Ghost Mind": [
//         {
//           key: "system.roll_mods",
//           mode: 2,
//           priority: null,
//           value: "name:Ghost Mind@cat:roll@type:ability@cTypes:Action|Downtime|LongTermProject@cTraits:hunt|study|survey|tinker|prowl|attune|command|consort|sway@status:Hidden@tooltip:<h1>Ghost Mind</h1><p>You gain <strong class='gold-bright'>+1d</strong> to rolls to <strong>gather information</strong> about the supernatural by any means.</p>"
//         }
//       ],
//       "Iron Will": [
//         {
//           key: "system.roll_mods",
//           mode: 2,
//           priority: null,
//           value: "name:Iron Will@cat:roll@type:ability@cTypes:Resistance@aTraits:Resolve@status:Hidden@tooltip:<h1>Iron Will</h1><p>You gain <strong class='gold-bright'>+1d</strong> to <strong>Resolve resistance</strong> rolls.</p>"
//         }
//       ],
//       "Occultist": [
//         {
//           key: "system.roll_mods",
//           mode: 2,
//           priority: null,
//           value: "name:Occultist@cat:roll@type:ability@cTypes:Action|Downtime|LongTermProject@cTraits:command@status:Hidden@tooltip:<h1>Occultist</h1><p>You gain <strong class='gold-bright'>+1d</strong> to rolls to <strong>Command</strong> cultists following ancient powers, forgotten gods or demons with whom you have previously <strong>Consort</strong>ed</p>"
//         }
//       ],
//       "Strange Methods": [
//         {
//           key: "system.roll_mods",
//           mode: 2,
//           priority: null,
//           value: "name:Strange Methods@cat:result@type:ability@cTypes:Downtime|LongTermProject@status:Hidden@tooltip:<h1>Strange Methods</h1><p>When you <strong>invent</strong> or <strong>craft</strong> a creation with <em>arcane</em> features, you gain <strong class='gold-bright'>+1 result level</strong> to your roll.</p>"
//         }
//       ],
//       "Tempest": [
//         {
//           key: "system.roll_mods",
//           mode: 2,
//           priority: null,
//           value: "name:Throw Lightning@cat:roll@type:ability@cTypes:Action@val:0@eKey:Is-Push|ForceOn-Push@sourceName:Tempest@status:Hidden@tooltip:<h1>Tempest — Throw Lightning</h1><p>You can <strong>Push</strong> yourself to unleash a stroke of lightning as a weapon. The GM will describe its <strong>effect level</strong> and significant collateral damage.</p><p>If you unleash it in combat against an enemy who's threatening you, you'll still make an <strong>action</strong> roll in the fight (usually with <strong>Attune</strong>).</p><p>You still gain <strong class='gold-bright'>+1d</strong> to your roll at the cost of <strong class='red-bright'>2 stress</strong>, as normal for a <strong>Push</strong>.</p>"
//         },
//         {
//           key: "system.roll_mods",
//           mode: 2,
//           priority: null,
//           value: "name:Throw Lightning@cat:effect@type:ability@cTypes:Action@val:0@eKey:Is-Push|ForceOn-Push@sourceName:Tempest@status:Hidden@tooltip:<h1>Tempest — Throw Lightning</h1><p>You can <strong>Push</strong> yourself to unleash a stroke of lightning as a weapon. The GM will describe its <strong>effect level</strong> and significant collateral damage.</p><p>If you unleash it in combat against an enemy who's threatening you, you'll still make an <strong>action</strong> roll in the fight (usually with <strong>Attune</strong>).</p><p>You still gain <strong class='gold-bright'>+1 effect</strong> at the cost of <strong class='red-bright'>2 stress</strong>, as normal for a <strong>Push</strong>.</p>"
//         },
//         {
//           key: "system.roll_mods",
//           mode: 2,
//           priority: null,
//           value: "name:Summon Storm@cat:roll@type:ability@cTypes:Action@val:0@eKey:Is-Push|ForceOn-Push@sourceName:Tempest@status:Hidden@tooltip:<h1>Tempest — Summon Storm</h1><p>You can <strong>Push</strong> yourself to summon a storm in your immediate vicinity <em>(torrential rain, roaring winds, heavy fog, chilling frost and snow, etc.)</em>. The GM will describe its <strong>effect level</strong>.</p><p>If you're using this power as cover or distraction, it's probably a <strong>Setup teamwork</strong> maneuver, using <strong>Attune</strong>.</p><p>You still gain <strong class='gold-bright'>+1d</strong> to your roll at the cost of <strong class='red-bright'>2 stress</strong>, as normal for a <strong>Push</strong>.</p>"
//         },
//         {
//           key: "system.roll_mods",
//           mode: 2,
//           priority: null,
//           value: "name:Summon Storm@cat:effect@type:ability@cTypes:Action@val:0@eKey:Is-Push|ForceOn-Push@sourceName:Tempest@status:Hidden@tooltip:<h1>Tempest — Summon Storm</h1><p>You can <strong>Push</strong> yourself to summon a storm in your immediate vicinity <em>(torrential rain, roaring winds, heavy fog, chilling frost and snow, etc.)</em>. The GM will describe its <strong>effect level</strong>.</p><p>If you're using this power as cover or distraction, it's probably a <strong>Setup teamwork</strong> maneuver, using <strong>Attune</strong>.</p><p>You still gain <strong class='gold-bright'>+1 effect</strong> at the cost of <strong class='red-bright'>2 stress</strong>, as normal for a <strong>Push</strong>.</p>"
//         }
//       ],
//       "Warded": [
//         {
//           key: "system.roll_mods",
//           mode: 2,
//           priority: null,
//           value: "name:Warded@cat:roll@type:ability@cTypes:Resistance@val:0@eKey:Cost-SpecialArmor|Negate-Consequence@status:Hidden@tooltip:<h1>Warded</h1><p>You may expend your <strong class='cyan-bright'>special armor</strong> to completely negate a <strong>consequence</strong> of <strong class='red-bright'>supernatural</strong> origin.</p>"
//         },
//         {
//           key: "system.roll_mods",
//           mode: 2,
//           priority: null,
//           value: "name:Warded@cat:after@type:ability@cTypes:Action@eKey:Negate-PushCost|Cost-SpecialArmor@status:Hidden@tooltip:<h1>Warded</h1><p>You may expend your <strong class='cyan-bright'>special armor</strong> instead of paying <strong class='red-bright'>2 stress</strong> to <strong>Push</strong> yourself when you contend with or employ <em>arcane</em> forces.</p>"
//         }
//       ]
//     }
//   },
//   CREW_ABILITIES: {
//     Descriptions: {
//       "Deadly": "<p><em>Each player may choose the action they prefer (you don't all have to choose the same one).</em></p><p><em>If you take this ability during initial character and crew creation, it supersedes the normal starting limit for action ratings.</em></p>",
//       "Crow's Veil": "<p><em>The bells don't ring at the crematorium when a member of your crew kills someone. Do you have a 'membership ritual' now that conveys this talent?</em></p>",
//       "Emberdeath": "<p><em>This ability activates at the moment of the target's death (spend 3 stress then or lose the opportunity to use it). It can only be triggered by a killing blow. Some particularly powerful supernatural entities or specially protected targets may be resistant or immune to this ability.</em></p>",
//       "No Traces": "<p><em>There are many clients who value quiet operations. This ability rewards you for keeping a low profile.</em></p>",
//       "Patron": "<p><em>Who is your patron? Why do they help you?</em></p>",
//       "Predators": "<p><em>This ability applies when the goal is murder. It doesn't apply to other stealth or deception operations you attempt that happen to involve killing.</em></p>",
//       "Vipers": "<p><em>The poison immunity lasts for the entire score, until you next have downtime.</em></p>",
//       "Dangerous": "<p><em>Each player may choose the action they prefer (you don't all have to choose the same one).</em></p><p><em>If you take this ability during initial character and crew creation, it supersedes the normal starting limit for action ratings.</em></p>",
//       "Blood Brothers": "<p><em>If you have the Elite Thugs upgrade, it stacks with this ability. So, if you had an Adepts gang cohort, and the Elite Thugs upgrade, and then took Blood Brothers, your Adepts would add the Thugs type and also get +1d to rolls when they did Thug-type actions.</em></p><p><em>This ability may result in a gang with three types, surpassing the normal limit of two.</em></p>",
//       "Door Kickers": "<p><em>This ability applies when the goal is to attack an enemy. It doesn't apply to other operations you attempt that happen to involve fighting.</em></p>",
//       "Fiends": "<p><em>The maximum wanted level is 4. Regardless of how much turf you hold (from this ability or otherwise) the minimum rep cost to advance your Tier is always 6.</em></p>",
//       "Forged In The Fire": "<p><em>This ability applies to PCs in the crew. It doesn't confer any special toughness to your cohorts.</em></p>",
//       "Chosen": "<p><em>Each player may choose the action they prefer (you don't all have to choose the same one).</em></p><p><em>If you take this ability during initial character and crew creation, it supersedes the normal starting limit for action ratings.</em></p>",
//       "Bound in Darkness": "<p><em>By what occult means does your teamwork manifest over distance? How is it strange or disturbing? By what ritualistic method are cult members initiated into this ability?</em></p>",
//       "Conviction": "<p><em>What sort of sacrifice does your deity find pleasing?</em></p>",
//       "Silver Tongues": "<p><em>Each player may choose the action they prefer (you don't all have to choose the same one).</em></p><p><em>If you take this ability during initial character and crew creation, it supersedes the normal starting limit for action ratings.</em></p>",
//       "Accord": "<p><em>If your status changes, you lose the turf until it becomes +3 again. Regardless of how much turf you hold (from this ability or otherwise) the minimum rep cost to advance your Tier is always 6.</em></p>",
//       "Ghost Market": "<p><em>They do not pay in coin. What do they pay with?</em></p><p><em>The GM will certainly have an idea about how your strange new clients pay, but jump in with your own ideas, too! This ability is usually a big shift in the game, so talk it out and come up with something that everyone is excited about. If it's a bit mysterious and uncertain, that's good. You have more to explore that way.</em></p>",
//       "The Good Stuff": "<p><em>The quality of your product might be used for a fortune roll to find out how impressed a potential client is, to find out how enthralled or incapacitated a user is in their indulgence of it, to discover if a strange variation has side-effects, etc.</em></p>",
//       "Everyone Steals": "<p><em>Each player may choose the action they prefer (you don't all have to choose the same one).</em></p><p><em>If you take this ability during initial character and crew creation, it supersedes the normal starting limit for action ratings.</em></p>",
//       "Ghost Echoes": "<p><em>You might explore the echo of an ancient building, crumbled to dust in the real world, but still present in the ghost field; or discern the electroplasmic glow of treasures lost in the depths of the canals; or use a sorcerous ghost door from the pre-cataclysm to infiltrate an otherwise secure location; etc.</em></p><p><em>The GM will tell you what echoes persist nearby when you gather information about them. You might also undertake investigations to discover particular echoes you hope to find.</em></p>",
//       "Pack Rats": "<p><em>This ability might mean that you actually have the item you need in your pile of stuff, or it could mean you have extra odds and ends to barter with.</em></p>",
//       "Slippery": "<p><em>The GM might sometimes want to choose an entanglement instead of rolling. In that case, they'll choose two and you can pick between them.</em></p>",
//       "Synchronized": "<p><em>For example, Lyric leads a group action to Attune to the ghost field to overcome a magical ward on the Dimmer Sisters' door. Emily, Lyric's player, rolls and gets a 6, and so does Matt! Because the crew has Synchronized, their two separate 6s count as a critical success on the roll.</em></p>",
//       "Ghost Passage": "<p><em>What do you do to 'carry' a spirit? Must the spirit consent, or can you use this ability to trap an unwilling spirit within?</em></p>",
//       "Reavers": "<p><em>If your vehicle already has armor, this ability gives an additional armor box.</em></p>",
//       "Renegades": "<p><em>Each player may choose the action they prefer (you don't all have to choose the same one).</em></p><p><em>If you take this ability during initial character and crew creation, it supersedes the normal starting limit for action ratings.</em></p>"
//     },
//     RollMods: {
//       "Predators": [
//         {
//           key: "system.roll_mods",
//           mode: 2,
//           priority: null,
//           value: "name:Predators@cat:roll@type:crew_ability@cTypes:GatherInfo@status:Hidden@tooltip:<h1>Predators</h1><p>When you use a <strong><em>stealth</em></strong> or <strong><em>deception</em> plan</strong> to commit murder, take <strong class='gold-bright'>+1d</strong> to the <strong>engagement</strong> roll.</p>"
//         }
//       ],
//       "Vipers": [
//         {
//           key: "system.roll_mods",
//           mode: 2,
//           priority: null,
//           isMember: true,
//           value: "name:Vipers (Crew Ability)@cat:result@type:crew_ability@cTypes:Downtime|AcquireAsset|LongTermProject@sourceName:Vipers@status:Hidden@tooltip:<h1>Vipers (Crew Ability)</h1><p>When you <strong>acquire</strong> or <strong>craft</strong> poisons, you get <strong class='gold-bright'>+1 result level</strong> to your roll.</p>"
//         }
//       ],
//       "Blood Brothers": [
//         {
//           key: "system.roll_mods",
//           mode: 2,
//           priority: null,
//           isCohort: true,
//           value: "name:Blood Brothers (Crew Ability)@cat:roll@type:crew_ability@cTypes:Action@cTraits:hunt|finesse|prowl|skirmish|wreck|attune|command@sourceName:Blood Brothers@status:Hidden@tooltip:<h1>Blood Brothers (Crew Ability)</h1><p>When fighting alongside crew members in combat, gain <strong class='gold-bright'>+1d</strong> for <strong>assist</strong>, <strong>setup</strong> and <strong>group teamwork actions</strong>.</p>"
//         }
//       ],
//       "Door Kickers": [
//         {
//           key: "system.roll_mods",
//           mode: 2,
//           priority: null,
//           value: "name:Door Kickers@cat:roll@type:crew_ability@cTypes:GatherInfo@status:Hidden@tooltip:<h1>Door Kickers</h1><p>When you use an <strong><em>assault</em> plan</strong>, take <strong class='gold-bright'>+1d</strong> to the <strong>engagement</strong> roll.</p>"
//         }
//       ],
//       "Anointed": [
//         {
//           key: "system.roll_mods",
//           mode: 2,
//           priority: null,
//           isMember: true,
//           value: "name:Anointed (Crew Ability)@cat:roll@type:crew_ability@cTypes:Resistance@sourceName:Anointed@status:Hidden@tooltip:<h1>Anointed (Crew Ability)</h1><p>Gain <strong class='gold-bright'>+1d</strong> to <strong>resistance</strong> rolls against supernatural threats.</p>"
//         },
//         {
//           key: "system.roll_mods",
//           mode: 2,
//           priority: null,
//           isMember: true,
//           value: "name:Anointed (Crew Ability)@cat:roll@type:crew_ability@cTypes:Downtime|Engagement|Recover@sourceName:Anointed@status:Hidden@tooltip:<h1>Anointed (Crew Ability)</h1><p>Gain <strong class='gold-bright'>+1d</strong> to <strong>healing treatment</strong> rolls when you have supernatural <strong class='red-bright'>harm</strong>.</p>"
//         }
//       ],
//       "Conviction": [
//         {
//           key: "system.roll_mods",
//           mode: 2,
//           priority: null,
//           isMember: true,
//           value: "name:Conviction (Crew Ability)@cat:roll@type:crew_ability@cTypes:Action@sourceName:Conviction@status:Hidden@tooltip:<h1>Conviction (Crew Ability)</h1><p>You may call upon your deity to <strong>assist</strong> any one <strong>action</strong> roll you make.</p><p>You cannot use this ability again until you indulge your <strong><em>Worship</em></strong> vice.</p>"
//         }
//       ],
//       "Zealotry": [
//         {
//           key: "system.roll_mods",
//           mode: 2,
//           priority: null,
//           isCohort: true,
//           value: "name:Zealotry (Crew Ability)@cat:roll@type:crew_ability@cTypes:Action|Downtime@sourceName:Zealotry@status:Hidden@tooltip:<h1>Zealotry (Crew Ability)</h1><p>Gain <strong class='gold-bright'>+1d</strong> when acting against enemies of the faith.</p>"
//         }
//       ],
//       "The Good Stuff": [
//         {
//           key: "system.roll_mods",
//           mode: 2,
//           priority: null,
//           isMember: true,
//           value: "name:The Good Stuff (Crew Ability)@cat:effect@type:crew_ability@cTypes:Action|Downtime@val:0@eKey:Increase-Quality2@sourceName:The Good Stuff@status:Hidden@tooltip:<h1>The Good Stuff (Crew Ability)</h1><p>The quality of your product is equal to your <strong class='gold-bright'>Tier +2</strong>.</p>"
//         }
//       ],
//       "High Society": [
//         {
//           key: "system.roll_mods",
//           mode: 2,
//           priority: null,
//           isMember: true,
//           value: "name:High Society (Crew Ability)@cat:roll@type:crew_ability@sourceName:High Society@status:Hidden@tooltip:<h1>High Society (Crew Ability)</h1><p>Gain <strong class='gold-bright'>+1d</strong> to <strong>gather information</strong> about the city's elite.</p>"
//         }
//       ],
//       "Pack Rats": [
//         {
//           key: "system.roll_mods",
//           mode: 2,
//           priority: null,
//           isMember: true,
//           value: "name:Pack Rats (Crew Ability)@cat:roll@type:crew_ability@aTypes:AcquireAsset@sourceName:Pack Rats@status:Hidden@tooltip:<h1>Pack Rats (Crew Ability)</h1><p>Gain <strong class='gold-bright'>+1d</strong> to <strong>acquire an asset</strong>.</p>"
//         }
//       ],
//       "Second Story": [
//         {
//           key: "system.roll_mods",
//           mode: 2,
//           priority: null,
//           value: "name:Second Story@cat:roll@type:crew_ability@cTypes:GatherInfo@status:Hidden@tooltip:<h1>Second Story</h1><p>When you execute a <strong>clandestine infiltration plan</strong>, gain <strong class='gold-bright'>+1d</strong> to the <strong>engagement</strong> roll.</p>"
//         }
//       ],
//       "Slippery": [
//         {
//           key: "system.roll_mods",
//           mode: 2,
//           priority: null,
//           isMember: true,
//           value: "name:Slippery (Crew Ability)@cat:roll@type:crew_ability@cTypes:Downtime@aTypes:ReduceHeat@sourceName:Slippery@status:Hidden@tooltip:<h1>Slippery (Crew Ability)</h1><p>Gain <strong class='gold-bright'>+1d</strong> to <strong>reduce heat</strong> rolls.</p>"
//         }
//       ],
//       "Synchronized": [
//         {
//           key: "system.roll_mods",
//           mode: 2,
//           priority: null,
//           isMember: true,
//           isCohort: true,
//           value: "name:Synchronized (Crew Ability)@cat:after@type:crew_ability@cTypes:Action@sourceName:Synchronized@status:Hidden@tooltip:<h1>Synchronized (Crew Ability)</h1><p>When you perform a <strong>group teamwork action</strong>, you may count <strong class='cyan-bright'>multiple 6s from different rolls</strong> as a <strong class='gold-bright'>critical success</strong>.</p>"
//         }
//       ],
//       "Just Passing Through": [
//         {
//           key: "system.roll_mods",
//           mode: 2,
//           priority: null,
//           isMember: true,
//           value: "name:Just Passing Through (Crew Ability)@cat:roll@type:crew_ability@cTypes:Action|Downtime@cTraits:finesse|prowl|consort|sway@sourceName:Just Passing Through@status:Hidden@tooltip:<h1>Just Passing Through (Crew Ability)</h1><p>When your <strong class='red-bright'>heat</strong> is <strong>4 or less</strong>, gain <strong class='gold-bright'>+1d</strong> to rolls to deceive people when you pass yourself off as ordinary citizens.</p>"
//         }
//       ],
//       "Reavers": [
//         {
//           key: "system.roll_mods",
//           mode: 2,
//           priority: null,
//           isMember: true,
//           value: "name:Reavers (Crew Ability)@cat:effect@type:crew_ability@cTypes:Action@cTraits:hunt|finesse|prowl|skirmish|wreck@sourceName:Reavers@status:Hidden@tooltip:<h1>Reavers (Crew Ability)</h1><p>When you go into conflict aboard a <strong class='cyan-bright'>vehicle</strong>, gain <strong class='gold-bright'>+1 effect</strong> for vehicle damage and speed.</p>"
//         }
//       ]
//     }
//   },
//   CREW_UPGRADES: {
//     Descriptions: {},
//     RollMods: {
//       "Ironhook Contacts": [
//         {
//           key: "system.roll_mods",
//           mode: 2,
//           priority: null,
//           isMember: true,
//           value: "name:Ironhook Contacts (Crew Upgrade)@cat:roll@type:crew_upgrade@cTypes:Downtime@aTypes:Incarceration@eKey:Increase-Tier1@sourceName:Ironhook Contacts@status:Hidden@tooltip:<h1>Ironhook Contacts (Crew Upgrade)</h1><p>Gain <strong class='gold-bright'>+1 Tier</strong> while in prison, including the <strong>incarceration</strong> roll.</p>"
//         }
//       ]
//     }
//   }
// };

// const problemLog: string[] = [];

// function parseColumnItem(item: string, isFaction = false) {
//   if (isFaction) {
//     const faction = game.actors.getName(item);
//     if (!faction) {
//       problemLog.push(item);
//     } else {
//       return `<p class='inline-doc-link-container'><img class='inline-doc-img' src="${faction.img}" /><a class='inline-doc-link faction-link' data-action='open' data-target='${faction.uuid}'>${item}</a></p>`;
//     }
//   }
//   return `<p>${item}</p>`;
// }
// function formatSplitColumnsWithHeader(col1: {header: string, elements: string[]}, col2: {header: string, elements: string[]}, isFactionList = false) {
//   return [
//     "<div class='tox-two-column-flex'>",
//     "<div class='tox-half-column'>",
//     `<h2>${col1.header}</h2>`,
//     ...col1.elements.map((elem) => parseColumnItem(elem, isFactionList)),
//     "</div>",
//     "<div class='tox-half-column'>",
//     `<h2>${col2.header}</h2>`,
//     ...col2.elements.map((elem) => parseColumnItem(elem, isFactionList)),
//     "</div>",
//     "</div>"
//   ].join("");
// }
// function formatSplitColumns(elements?: string[], isFactionList = false) {
//   if (!elements) { return "" }
//   return [
//     "<div class='tox-two-column-flex'>",
//     ...elements.map((elem) => parseColumnItem(elem, isFactionList)),
//     "</div>"
//   ].join("");
// }

// const {claim, favoredOperation, contact} = U.group(JSONDATA.CREW_OBJECTS, "type");

// export const updateClaims = async () => {
//   const errorReport: string[] = [];
//   const playbookUpdateData: Partial<Record<Playbook,Record<string, string>>> = {};
//   (claim ?? []).forEach((cl) => {
//     const playbookObj = game.items.getName(cl.playbook);
//     if (!playbookObj || playbookObj.type !== BladesItemType.crew_playbook) {
//       errorReport.push(`Claim ${cl.name} has invalid playbook ${cl.playbook}`);
//       return;
//     }
//     const [turfNum] = Object.entries(playbookObj.system.turfs ?? {}).find(([_, tData]: [unknown, BladesClaimData]) => tData.name === cl.name) ?? [];
//     if (!turfNum) {
//       errorReport.push(`Claim ${cl.name} has invalid turf name ${cl.name} for playbook ${cl.playbook}`);
//       return;
//     }
//     const playbookName = playbookObj.name as Playbook;
//     const playbookData = playbookUpdateData[playbookName] ?? {};
//     playbookData[`system.turfs.${turfNum}.description`] = cl.rules ?? "";
//     if (cl.flavor) {
//       playbookData[`system.turfs.${turfNum}.flavor`] = cl.flavor;
//     }
//     playbookUpdateData[playbookName] = playbookData;
//   });

//   await Promise.all(Object.entries(playbookUpdateData).map(async ([playbook, data]) => game.items.getName(playbook)
//     ?.update(data)
//     .then((item) => item?.addTag(playbook))));

//   console.log(errorReport);
// };

// export const updateOps = async () => {
//   const errorReport: string[] = [];
//   await Promise.all((favoredOperation ?? []).map(async (op) => {
//     const playbookObj = game.items.getName(op.playbook);
//     if (!playbookObj || playbookObj.type !== BladesItemType.crew_playbook) {
//       errorReport.push(`Favored Op ${op.name} has invalid playbook ${op.playbook}`);
//       return undefined;
//     }
//     const item = await BladesItem.create({
//       name: op.name,
//       type: BladesItemType.preferred_op,
//       img: playbookObj.img,
//       system: {
//         description: op.description
//       }
//     }) as BladesItemOfType<BladesItemType.preferred_op>;
//     if (BladesItem.IsType(item, BladesItemType.preferred_op)) {
//       return item.addTag(playbookObj.name as Playbook);
//     }
//     return undefined;
//   }));

//   console.log(errorReport);
// };

// export const updateContacts = async () => {
//   const errorReport: string[] = [];
//   await Promise.all((contact ?? []).map(async (ct) => {
//     const playbookObj = game.items.getName(ct.playbook);
//     if (!BladesItem.IsType(playbookObj, BladesItemType.crew_playbook)) {
//       errorReport.push(`Contact ${ct.name} has invalid playbook ${ct.playbook}`);
//       return undefined;
//     }
//     const actor: BladesNPC = await Actor.create({
//       name: ct.name,
//       type: BladesActorType.npc,
//       system: {
//         description: ct.description,
//         prompts: ct.hints?.join(" ")
//       } as Partial<BladesActorSystem>
//     }) as BladesNPC;
//     return actor.addTag(playbookObj.name as Playbook);
//   }));

//   console.log(errorReport);
// };

// const updateFactionData = async (factionData: FactionData) => {
//   const faction = game.actors.getName(factionData.name) as BladesFaction|undefined;
//   const updateData: Record<string, string|null> = {};
//   if (faction) {
//     updateData["system.subtitle"] = factionData.subtitle ?? "";
//     updateData["system.concept"] = factionData.concept ?? "";
//     updateData["system.description"] = [
//       `<p>${factionData.description}</p>`,
//       formatSplitColumnsWithHeader(
//         {
//           header: "Allied Factions",
//           elements: factionData.alliesStrings ?? []
//         },
//         {
//           header: "Opposing Factions",
//           elements: factionData.enemiesStrings ?? []
//         },
//         true
//       )
//     ].join("");
//     updateData["system.situation"] = `<p>${factionData.gm_notes}</p>`;
//     updateData["system.assets"] = formatSplitColumns(factionData.assetStrings);
//     updateData["system.turf"] = formatSplitColumns(factionData.turfStrings);
//     updateData["system.-=clocks"] = null;
//     updateData["system.-=status"] = null;
//     updateData["system.-=goal_1"] = null;
//     updateData["system.-=goal_2"] = null;
//     updateData["system.-=quirks"] = null;
//     updateData["system.-=notables"] = null;
//     updateData["system.-=allies"] = null;
//     updateData["system.-=enemies"] = null;
//     updateData["system.-=goal_clock"] = null;
//     updateData["system.-=type"] = null;
//     updateData["system.-=goal_1_clock_value"] = null;
//     updateData["system.-=goal_1_clock_max"] = null;
//     updateData["system.-=goal_2_clock_value"] = null;
//     updateData["system.-=goal_2_clock_max"] = null;
//     updateData["system.-=tier_bonus"] = null;
//     await faction.update(updateData);
//     factionData.clocksArray?.forEach((clockData: {display: string, value: number, max: number}, i: number) => {
//       let color = "white";
//       if (i > 0) { color = "yellow" }
//       if (clockData.max > 8) { color = "red" }
//       if (/\(repeating\)/.test(clockData.display)) { color = "cyan" }
//       faction.addClock({
//         display: clockData.display,
//         value: clockData.value,
//         max: clockData.max,
//         isVisible: true,
//         color
//       });
//     });
//   } else {
//     problemLog.push(`Unable to find faction "${factionData.name}"`);
//   }
// };

// export const updateFactions = async () => {
//   await Promise.all(Object.values(JSONDATA.FACTIONS).map(async (factionData) => updateFactionData(factionData)));
//   console.log(problemLog);
// };

// export const updateRollMods = async () => {
//   await Promise.all([
//     ...Object.entries(JSONDATA.ABILITIES.RollMods)
//       .map(async ([abilityName, eData]) => {
//         // Get ability doc
//         const abilityDoc = game.items.getName(abilityName);
//         if (!abilityDoc) {
//           eLog.error("updateRollMods", `updateRollMods: Ability ${abilityName} Not Found.`);
//           return undefined;
//         }

//         // Get active effects on abilityDoc
//         const abilityEffects = Array.from(abilityDoc.effects ?? []) as BladesActiveEffect[];

//         // Separate out 'APPLYTOMEMBERS' and 'APPLYTOCOHORTS' ActiveEffects
//         const toMemberEffects = abilityEffects.filter((effect) => effect.changes.some((change) => change.key === "APPLYTOMEMBERS"));
//         const toCohortEffects = abilityEffects.filter((effect) => effect.changes.some((change) => change.key === "APPLYTOCOHORTS"));
//         const standardEffects = abilityEffects.filter((effect) => effect.changes.every((change) => !["APPLYTOMEMBERS", "APPLYTOCOHORTS"].includes(change.key)));

//         // Confirm eData.isMember and eData.isCohort are consistent across all changes.
//         const testChange = eData[0];
//         if (
//           (testChange.isMember && eData.some((change) => !change.isMember))
//         || (!testChange.isMember && eData.some((change) => change.isMember))
//         ) {
//           return eLog.error("updateRollMods", `updateRollMods: Ability ${abilityName} has inconsistent 'isMember' entries.`);
//         }
//         if (
//           (testChange.isCohort && eData.some((change) => !change.isCohort))
//         || (!testChange.isCohort && eData.some((change) => change.isCohort))
//         ) {
//           return eLog.error("updateRollMods", `updateRollMods: Ability ${abilityName} has inconsistent 'isCohort' entries.`);
//         }

//         // If eData.isMember or eData.isCohort, first see if there already is such an effect on the doc
//         if (testChange.isMember) {
//           if (toMemberEffects.length > 1) {
//             return eLog.error("updateRollMods", `updateRollMods: Ability ${abilityName} Has Multiple 'APPLYTOMEMBERS' Active Effects`);
//           }

//           // Initialize new effect data
//           const effectData: {
//           name: string,
//           icon: string,
//           changes: Array<Partial<EffectChangeData>>
//         } = {
//           name: abilityName,
//           icon: abilityDoc.img ?? "",
//           changes: eData.map((change) => {
//             delete change.isMember;
//             return change;
//           })
//         };

//           // Derive new effect data from existing effect, if any, then delete existing effect
//           if (toMemberEffects.length === 1) {
//             const abilityEffect = toMemberEffects[0] ;
//             effectData.name = abilityEffect.name ?? effectData.name;
//             effectData.icon = abilityEffect.icon ?? effectData.icon;
//             effectData.changes.unshift(...abilityEffect.changes.filter((change) => change.key !== "system.roll_mods"));
//             await abilityEffect.delete();
//           } else {
//             effectData.changes.unshift({
//               key: "APPLYTOMEMBERS",
//               mode: 0,
//               priority: null,
//               value: `${abilityName.replace(/\s*\([^()]*? (Ability|Upgrade)\)\s*$/, "")} (Scoundrel Ability)`
//             });
//           }

//           // Create new ActiveEffect
//           return abilityDoc.createEmbeddedDocuments("ActiveEffect", [effectData]);
//         } else if (testChange.isCohort) {
//           if (toCohortEffects.length > 1) {
//             eLog.error("updateRollMods", `updateRollMods: Ability ${abilityName} Has Multiple 'APPLYTOCOHORTS' Active Effects`);
//             return undefined;
//           }

//           // Initialize new effect data
//           const effectData: {
//           name: string,
//           icon: string,
//           changes: Array<Partial<EffectChangeData>>
//         } = {
//           name: abilityName,
//           icon: abilityDoc.img ?? "",
//           changes: eData.map((change) => {
//             delete change.isCohort;
//             return change;
//           })
//         };

//           // Derive new effect data from existing effect, if any, then delete existing effect
//           if (toCohortEffects.length === 1) {
//             const abilityEffect = toCohortEffects[0] ;
//             effectData.name = abilityEffect.name ?? effectData.name;
//             effectData.icon = abilityEffect.icon ?? effectData.icon;
//             effectData.changes.unshift(...abilityEffect.changes.filter((change) => change.key !== "system.roll_mods"));
//             await abilityEffect.delete();
//           } else {
//             effectData.changes.unshift({
//               key: "APPLYTOCOHORTS",
//               mode: 0,
//               priority: null,
//               value: `${abilityName.replace(/\s*\([^()]*? (Ability|Upgrade)\)\s*$/, "")} (Scoundrel Ability)`
//             });
//           }

//           // Create new ActiveEffect
//           return abilityDoc.createEmbeddedDocuments("ActiveEffect", [effectData]);
//         } else {
//           if (standardEffects.length > 1) {
//             eLog.error("updateRollMods", `updateRollMods: Ability ${abilityName} Has Multiple Active Effects`);
//             return undefined;
//           }

//           // Initialize new effect data
//           const effectData: {
//           name: string,
//           icon: string,
//           changes: Array<Partial<EffectChangeData>>
//         } = {
//           name: abilityName,
//           icon: abilityDoc.img ?? "",
//           changes: eData
//         };

//           // Derive new effect data from existing effect, if any, then delete existing effect
//           if (standardEffects.length === 1) {
//             const abilityEffect = standardEffects[0] ;
//             effectData.name = abilityEffect.name ?? effectData.name;
//             effectData.icon = abilityEffect.icon ?? effectData.icon;
//             effectData.changes.unshift(...abilityEffect.changes.filter((change) => change.key !== "system.roll_mods"));
//             await abilityEffect.delete();
//           }

//           // Create new ActiveEffect
//           return abilityDoc.createEmbeddedDocuments("ActiveEffect", [effectData]);
//         }
//       }),
//     ...Object.entries(JSONDATA.CREW_ABILITIES.RollMods)
//       .map(async ([aName, eData]) => {
//         // Get crew ability doc
//         const crewAbilityDoc = game.items.getName(aName);
//         if (!crewAbilityDoc) {
//           eLog.error("updateRollMods", `updateRollMods: Crew Ability ${aName} Not Found.`);
//           return undefined;
//         }

//         // Get active effects on crewAbilityDoc
//         const abilityEffects = Array.from(crewAbilityDoc.effects ?? []) as BladesActiveEffect[];

//         // Separate out 'APPLYTOMEMBERS' and 'APPLYTOCOHORTS' ActiveEffects
//         const toMemberEffects = abilityEffects.filter((effect) => effect.changes.some((change) => change.key === "APPLYTOMEMBERS"));
//         const toCohortEffects = abilityEffects.filter((effect) => effect.changes.some((change) => change.key === "APPLYTOCOHORTS"));
//         const standardEffects = abilityEffects.filter((effect) => effect.changes.every((change) => !["APPLYTOMEMBERS", "APPLYTOCOHORTS"].includes(change.key)));

//         // Confirm eData.isMember and eData.isCohort are consistent across all changes.
//         const testChange = eData[0];
//         if (
//           (testChange.isMember && eData.some((change) => !change.isMember))
//         || (!testChange.isMember && eData.some((change) => change.isMember))
//         ) {
//           return eLog.error("updateRollMods", `updateRollMods: Crew Ability ${aName} has inconsistent 'isMember' entries.`);
//         }
//         if (
//           (testChange.isCohort && eData.some((change) => !change.isCohort))
//         || (!testChange.isCohort && eData.some((change) => change.isCohort))
//         ) {
//           return eLog.error("updateRollMods", `updateRollMods: Crew Ability ${aName} has inconsistent 'isCohort' entries.`);
//         }

//         // If eData.isMember or eData.isCohort, first see if there already is such an effect on the doc
//         if (testChange.isMember) {
//           if (toMemberEffects.length > 1) {
//             return eLog.error("updateRollMods", `updateRollMods: Crew Ability ${aName} Has Multiple 'APPLYTOMEMBERS' Active Effects`);
//           }

//           // Initialize new effect data
//           const effectData: {
//           name: string,
//           icon: string,
//           changes: Array<Partial<EffectChangeData>>
//           } = {
//             name: aName,
//             icon: crewAbilityDoc.img ?? "",
//             changes: eData.map((change) => {
//               delete change.isMember;
//               return change;
//             })
//           };

//           // Derive new effect data from existing effect, if any, then delete existing effect
//           if (toMemberEffects.length === 1) {
//             const abilityEffect = toMemberEffects[0] ;
//             effectData.name = abilityEffect.name ?? effectData.name;
//             effectData.icon = abilityEffect.icon ?? effectData.icon;
//             effectData.changes.unshift(...abilityEffect.changes.filter((change) => change.key !== "system.roll_mods"));
//             await abilityEffect.delete();
//           } else {
//             effectData.changes.unshift({
//               key: "APPLYTOMEMBERS",
//               mode: 0,
//               priority: null,
//               value: `${aName.replace(/\s*\([^()]*? (Ability|Upgrade)\)\s*$/, "")} (Crew Ability)`
//             });
//           }

//           // Create new ActiveEffect
//           return crewAbilityDoc.createEmbeddedDocuments("ActiveEffect", [effectData]);
//         } else if (testChange.isCohort) {
//           if (toCohortEffects.length > 1) {
//             eLog.error("updateRollMods", `updateRollMods: Crew Ability ${aName} Has Multiple 'APPLYTOCOHORTS' Active Effects`);
//             return undefined;
//           }

//           // Initialize new effect data
//           const effectData: {
//           name: string,
//           icon: string,
//           changes: Array<Partial<EffectChangeData>>
//           } = {
//             name: aName,
//             icon: crewAbilityDoc.img ?? "",
//             changes: eData.map((change) => {
//               delete change.isCohort;
//               return change;
//             })
//           };

//           // Derive new effect data from existing effect, if any, then delete existing effect
//           if (toCohortEffects.length === 1) {
//             const abilityEffect = toCohortEffects[0] ;
//             effectData.name = abilityEffect.name ?? effectData.name;
//             effectData.icon = abilityEffect.icon ?? effectData.icon;
//             effectData.changes.unshift(...abilityEffect.changes.filter((change) => change.key !== "system.roll_mods"));
//             await abilityEffect.delete();
//           } else {
//             effectData.changes.unshift({
//               key: "APPLYTOCOHORTS",
//               mode: 0,
//               priority: null,
//               value: `${aName.replace(/\s*\([^()]*? (Ability|Upgrade)\)\s*$/, "")} (Crew Ability)`
//             });
//           }

//           // Create new ActiveEffect
//           return crewAbilityDoc.createEmbeddedDocuments("ActiveEffect", [effectData]);
//         } else {
//           if (standardEffects.length > 1) {
//             eLog.error("updateRollMods", `updateRollMods: Crew Ability ${aName} Has Multiple Active Effects`);
//             return undefined;
//           }

//           // Initialize new effect data
//           const effectData: {
//           name: string,
//           icon: string,
//           changes: Array<Partial<EffectChangeData>>
//           } = {
//             name: aName,
//             icon: crewAbilityDoc.img ?? "",
//             changes: eData
//           };

//           // Derive new effect data from existing effect, if any, then delete existing effect
//           if (standardEffects.length === 1) {
//             const abilityEffect = standardEffects[0] ;
//             effectData.name = abilityEffect.name ?? effectData.name;
//             effectData.icon = abilityEffect.icon ?? effectData.icon;
//             effectData.changes.unshift(...abilityEffect.changes.filter((change) => change.key !== "system.roll_mods"));
//             await abilityEffect.delete();
//           }

//           // Create new ActiveEffect
//           return crewAbilityDoc.createEmbeddedDocuments("ActiveEffect", [effectData]);
//         }
//       }),
//     ...Object.entries(JSONDATA.CREW_UPGRADES.RollMods)
//       .map(async ([aName, eData]) => {
//         // Get crew upgrade doc
//         const crewUpgradeDoc = game.items.getName(aName);
//         if (!crewUpgradeDoc) {
//           eLog.error("updateRollMods", `updateRollMods: Crew Upgrade ${aName} Not Found.`);
//           return undefined;
//         }

//         // Get active effects on crewUpgradeDoc
//         const abilityEffects = Array.from(crewUpgradeDoc.effects ?? []) as BladesActiveEffect[];

//         // Separate out 'APPLYTOMEMBERS' and 'APPLYTOCOHORTS' ActiveEffects
//         const toMemberEffects = abilityEffects.filter((effect) => effect.changes.some((change) => change.key === "APPLYTOMEMBERS"));
//         const toCohortEffects = abilityEffects.filter((effect) => effect.changes.some((change) => change.key === "APPLYTOCOHORTS"));
//         const standardEffects = abilityEffects.filter((effect) => effect.changes.every((change) => !["APPLYTOMEMBERS", "APPLYTOCOHORTS"].includes(change.key)));

//         // Confirm eData.isMember and eData.isCohort are consistent across all changes.
//         const testChange = eData[0];
//         if (
//           (testChange.isMember && eData.some((change) => !change.isMember))
//         || (!testChange.isMember && eData.some((change) => change.isMember))
//         ) {
//           return eLog.error("updateRollMods", `updateRollMods: Crew Upgrade ${aName} has inconsistent 'isMember' entries.`);
//         }
//         if (
//           (testChange.isCohort && eData.some((change) => !change.isCohort))
//         || (!testChange.isCohort && eData.some((change) => change.isCohort))
//         ) {
//           return eLog.error("updateRollMods", `updateRollMods: Crew Upgrade ${aName} has inconsistent 'isCohort' entries.`);
//         }

//         // If eData.isMember or eData.isCohort, first see if there already is such an effect on the doc
//         if (testChange.isMember) {
//           if (toMemberEffects.length > 1) {
//             return eLog.error("updateRollMods", `updateRollMods: Crew Upgrade ${aName} Has Multiple 'APPLYTOMEMBERS' Active Effects`);
//           }

//           // Initialize new effect data
//           const effectData: {
//           name: string,
//           icon: string,
//           changes: Array<Partial<EffectChangeData>>
//         } = {
//           name: aName,
//           icon: crewUpgradeDoc.img ?? "",
//           changes: eData.map((change) => {
//             delete change.isMember;
//             return change;
//           })
//         };

//           // Derive new effect data from existing effect, if any, then delete existing effect
//           if (toMemberEffects.length === 1) {
//             const abilityEffect = toMemberEffects[0] ;
//             effectData.name = abilityEffect.name ?? effectData.name;
//             effectData.icon = abilityEffect.icon ?? effectData.icon;
//             effectData.changes.unshift(...abilityEffect.changes.filter((change) => change.key !== "system.roll_mods"));
//             await abilityEffect.delete();
//           } else {
//             effectData.changes.unshift({
//               key: "APPLYTOMEMBERS",
//               mode: 0,
//               priority: null,
//               value: `${aName.replace(/\s*\([^()]*? (Ability|Upgrade)\)\s*$/, "")} (Crew Upgrade)`
//             });
//           }

//           // Create new ActiveEffect
//           return crewUpgradeDoc.createEmbeddedDocuments("ActiveEffect", [effectData]);
//         } else if (testChange.isCohort) {
//           if (toCohortEffects.length > 1) {
//             eLog.error("updateRollMods", `updateRollMods: Crew Upgrade ${aName} Has Multiple 'APPLYTOCOHORTS' Active Effects`);
//             return undefined;
//           }

//           // Initialize new effect data
//           const effectData: {
//           name: string,
//           icon: string,
//           changes: Array<Partial<EffectChangeData>>
//         } = {
//           name: aName,
//           icon: crewUpgradeDoc.img ?? "",
//           changes: eData.map((change) => {
//             delete change.isCohort;
//             return change;
//           })
//         };

//           // Derive new effect data from existing effect, if any, then delete existing effect
//           if (toCohortEffects.length === 1) {
//             const abilityEffect = toCohortEffects[0] ;
//             effectData.name = abilityEffect.name ?? effectData.name;
//             effectData.icon = abilityEffect.icon ?? effectData.icon;
//             effectData.changes.unshift(...abilityEffect.changes.filter((change) => change.key !== "system.roll_mods"));
//             await abilityEffect.delete();
//           } else {
//             effectData.changes.unshift({
//               key: "APPLYTOCOHORTS",
//               mode: 0,
//               priority: null,
//               value: `${aName.replace(/\s*\([^()]*? (Ability|Upgrade)\)\s*$/, "")} (Crew Upgrade)`
//             });
//           }

//           // Create new ActiveEffect
//           return crewUpgradeDoc.createEmbeddedDocuments("ActiveEffect", [effectData]);
//         } else {
//           if (standardEffects.length > 1) {
//             eLog.error("updateRollMods", `updateRollMods: Crew Upgrade ${aName} Has Multiple Active Effects`);
//             return undefined;
//           }

//           // Initialize new effect data
//           const effectData: {
//           name: string,
//           icon: string,
//           changes: Array<Partial<EffectChangeData>>
//         } = {
//           name: aName,
//           icon: crewUpgradeDoc.img ?? "",
//           changes: eData
//         };

//           // Derive new effect data from existing effect, if any, then delete existing effect
//           if (standardEffects.length === 1) {
//             const abilityEffect = standardEffects[0] ;
//             effectData.name = abilityEffect.name ?? effectData.name;
//             effectData.icon = abilityEffect.icon ?? effectData.icon;
//             effectData.changes.unshift(...abilityEffect.changes.filter((change) => change.key !== "system.roll_mods"));
//             await abilityEffect.delete();
//           }

//           // Create new ActiveEffect
//           return crewUpgradeDoc.createEmbeddedDocuments("ActiveEffect", [effectData]);
//         }
//       })
//   ]);
// };

// export const updateDescriptions = async () => {
//   return Promise.all(Object.entries({
//     ...JSONDATA.ABILITIES.Descriptions,
//     ...JSONDATA.CREW_ABILITIES.Descriptions,
//     ...JSONDATA.CREW_UPGRADES.Descriptions
//   })
//     .map(async ([aName, desc]) => {
//       const itemDoc = game.items.getName(aName);
//       if (!itemDoc) {
//         eLog.error("applyRollEffects", `ApplyDescriptions: Item Doc ${aName} Not Found.`);
//         return undefined;
//       }

//       // Update system.notes
//       return itemDoc.update({"system.notes": desc});
//     }));
// };
