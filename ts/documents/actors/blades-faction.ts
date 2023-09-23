import {BladesActorType, Factor} from "../../core/constants.js";
import BladesActor from "../../blades-actor.js";

const JSONDATA: {FACTIONS: Record<string,any>} = {
  FACTIONS: {
    "the Billhooks": {
      name: "the Billhooks",
      subtitle: "a Hack-and-Slash Gang of Toughened Thugs",
      concept: "A tough gang of thugs who prefer hatchets, meat hooks, and pole arms.",
      description: "The Billhooks have a bloody reputation, often leaving the butchered corpses of their victims strewn about in a grisly display. Many wonder why the Bluecoats turn a blind eye to their savagery. Based out of their butcher shop headquarters, they are led by Tarvul, who is currently serving life in prison.",
      gm_notes: "Erin and Coran both want to take control of the Billhooks gang, either when Tarvul gets too old (which will be soon) or by taking the position by force. There is no love lost between Erin and Corran and they'll have no qualms about fighting a family member for leadership. Meanwhile, the rest of the gang wants to continue their reign of terror to pressure a magistrate to pardon Tarvul and other gang members and release them from Ironhook.",
      clocks: [
        {
          label: "Terrorize magistrates to pardon members in prison",
          value: 0,
          max: 8
        }
      ],
      npcs: [
        {
          name: "Tarvul",
          gender: "m",
          keyPhrases: [
            "Savage",
            "Arrogant",
            "Family Man"
          ],
          other: "Leader of the Billhooks, currently serving life in prison."
        },
        {
          name: "Erin",
          gender: "f",
          keyPhrases: [
            "Confident",
            "Deadly",
            "Ambitious"
          ],
          other: "Billhooks Captain, sister to Tarvul."
        },
        {
          name: "Coran",
          gender: "m",
          keyPhrases: [
            "Fierce",
            "Loyal",
            "Quiet"
          ],
          other: "Billhooks thug, Tarvul's son."
        }
      ],
      turf: [
        "a butcher shop (HQ), stockyard & slaughterhouse",
        "animal fighting pits",
        "gambling dens",
        "several terrified merchants & businesses (which they extort)"
      ],
      assets: [
        "a large gang of bloodthirsty butchers",
        "a pack of death-dogs"
      ],
      allies: [
        "the Bluecoats",
        "the Ministry of Preservation"
      ],
      enemies: [
        "Citizens of Crow's Foot",
        "Citizens of the Docks",
        "Ulf Ironborn",
        "the Lost"
      ]
    },
    "the Bluecoats": {
      name: "the Bluecoats",
      subtitle: "the Corrupt City Watch of Duskvol",
      concept: "The City Watch of Duskwall. Known as the meanest gang in the city. Corrupt, violent, and cruel.",
      description: "The Bluecoats claim the whole city as their turf, but find their influence severely limited in Whitecrown, where the Imperial Military garrison holds sway under command of the Lord Governor. They are divided into companies by district, and have fierce rivalries, often good-natured, but sometimes violent.",
      gm_notes: "The Bluecoats have become jealous of the elite hardware and vehicles used by the Imperial Military. They want to refit their watch-guards in heavy armor and weapons, to better strike fear into those they prey upon.",
      clocks: [
        {
          label: "Procure bigger budget, military arms & equipment",
          value: 0,
          max: 8
        }
      ],
      npcs: [
        {
          name: "Commander Clelland",
          gender: "m",
          keyPhrases: [
            "Corrupt",
            "Cruel",
            "Arrogant"
          ],
          other: "Chief commissioner of the City Watch."
        },
        {
          name: "Captain Michter",
          gender: "m",
          keyPhrases: [
            "Ambitious",
            "Fierce",
            "Confident"
          ],
          other: "Chief instructor."
        },
        {
          name: "Captain Vale",
          gender: "m",
          keyPhrases: [
            "Loyal",
            "Insightful",
            "Quiet"
          ],
          other: "Quartermaster."
        }
      ],
      turf: [
        "The whole city, except Whitecrown"
      ],
      assets: [
        "Many large gangs of vicious thugs in uniform",
        "Armored coaches and canal patrol boats",
        "Public punishment sites (pillories, stocks, hanging cages)"
      ],
      allies: [
        "Ironhook Prison",
        "Lord Scurlock",
        "the Billhooks",
        "the City Council",
        "the Crows",
        "the Unseen"
      ],
      enemies: [
        "the Imperial Military"
      ]
    },
    "the Church of Ecstasy": {
      name: "the Church of Ecstasy",
      subtitle: "the State Religion Honoring Life and Abhorring Spirits",
      concept: "The “state religion” honors the life of the body and abhors the corrupted spirit world. Essentially a secret society.",
      description: "The Church of Ecstasy, the state religion, venerates the sanctity of the physical body while condemning the tainted realm of spirits. Operating as a clandestine organization, zealous believers occasionally volunteer to be hollowed to 'become purified'. This practice was once common among the ancient cult of the Empty Vessel, which preceded the Church.",
      gm_notes: "According to the Church's secret teachings, the purest entities are those devoid of spirits: the demons. These demons, immortal and uncorrupted by the madness that afflicts rogue human spirits and vampires, are perceived as the epitome of perfection. The Church's most devout followers aspire to emulate these demons, seeking the elusive secret of ascension. To this end, they conduct numerous sinister experiments and rituals involving hulls, hollows, vampires, and the occasional demon, all within the maze-like dungeons beneath the Church's primary cathedral in Brightstone.",
      clocks: [
        {
          label: "Unlock the secret of ascension",
          value: 0,
          max: 12
        },
        {
          label: "Eliminate the Reconciled",
          value: 0,
          max: 12
        }
      ],
      npcs: [
        {
          name: "Elder Rowan",
          gender: "m",
          keyPhrases: [
            "Devout",
            "Resolute",
            "Visionary"
          ],
          other: "Leader of the Church of Ecstasy."
        },
        {
          name: "Preceptor Dunvil",
          gender: "m",
          keyPhrases: [
            "Unorthodox",
            "Obsessive",
            "Enigmatic"
          ],
          other: "Arcane researcher for the Church."
        }
      ],
      turf: [
        "The Sanctorium grand cathedral in Brightstone",
        "Many other smaller temples across the city"
      ],
      assets: [
        "A large treasury of tithes from citizens",
        "Extensive arcane and occult libraries, workspaces, and artifacts",
        "Many cohorts of acolytes and hollows who enforce the will of the Church's leadership"
      ],
      allies: [
        "the City Council",
        "the Leviathan Hunters",
        "the Spirit Wardens"
      ],
      enemies: [
        "the Path of Echoes",
        "the Reconciled"
      ]
    },
    "the Circle of Flame": {
      name: "the Circle of Flame",
      subtitle: "a Refined Secret Society with Unknown Intentions",
      concept: "A refined secret society of antiquarians and scholars; cover for extortion, graft, vice, and murder.",
      description: "The Circle of Flame operates under the guise of a scholarly society, but in reality, they engage in extortion, graft, vice, and murder. With a vast treasury funded by their wealthy membership, they possess an impressive collection of ancient artifacts, maps, and ephemera. Their operations are protected by a highly trained and discreet private security force. They have a particular interest in the arcane artifacts and treasures of the Lost District.",
      gm_notes: "Of special interest to the Circle are the remains of 'Kotar', a legendary sorcerer, demon, or hero who was mummified before the cataclysm. The Eye, Hand and Heart of Kotar are said to possess great power for those bold enough to risk their use.  Additionally, one of 'The Seven' is actually a demon in disguise.",
      clocks: [
        {
          label: "Acquire all the ancient artifacts of Kotar",
          value: 0,
          max: 8
        }
      ],
      npcs: [
        {
          name: "Elstera Avrathi",
          gender: "f",
          keyPhrases: [
            "Secretive",
            "Gracious"
          ],
          other: "Iruvian diplomat and member of 'The Seven', the leadership council of the Circle"
        },
        {
          name: "Lady Drake",
          gender: "f",
          keyPhrases: [
            "Cunning",
            "Ruthless"
          ],
          other: "Magistrate and member of 'The Seven'"
        },
        {
          name: "Raffello",
          gender: "m",
          keyPhrases: [
            "Visionary",
            "Obsessive"
          ],
          other: "Painter and member of 'The Seven'"
        },
        {
          name: "Lord Mora",
          gender: "m",
          keyPhrases: [
            "Cold",
            "Suspicious"
          ],
          other: "Noble and member of 'The Seven'"
        },
        {
          name: "Lady Penderyn",
          gender: "f",
          keyPhrases: [
            "Charming",
            "Patient"
          ],
          other: "Noble and member of 'The Seven'"
        },
        {
          name: "Madame Tesslyn",
          gender: "f",
          keyPhrases: [
            "Sophisticated",
            "Subtle"
          ],
          other: "Vice purveyor and member of 'The Seven'"
        },
        {
          name: "Harvale Brogan",
          gender: "m",
          keyPhrases: [
            "Shrewd",
            "Quiet"
          ],
          other: "Vice purveyor and member of 'The Seven'"
        }
      ],
      turf: [
        "The Centuralia club, Six Towers (HQ)"
      ],
      assets: [
        "Vast treasury provided by wealthy membership",
        "Impressive collection of ancient artifacts, maps, and ephemera",
        "Highly trained and discreet private security force"
      ],
      allies: [
        "the City Council",
        "the Forgotten Gods",
        "the Foundation",
        "the Path of Echoes"
      ],
      enemies: [
        "the Hive",
        "the Silver Nails"
      ]
    },
    "the City Council": {
      name: "the City Council",
      subtitle: "the Elite Nobility Governing Duskvol",
      concept: "The elite nobility who run the city government, its treasury, magistrates, and public works.",
      description: "The City Council is composed of the scions of the six most powerful noble families in Doskvol. They oversee the city's government, treasury, magistrates, and public works. The council chambers are located in Charterhall, which also houses the government offices and the impregnable city treasury vaults. The council holds ownership of all public spaces in the city, including streets, docks, and waterways.",
      gm_notes: "The members of the Council are all high-ranking adepts in the Church of the Ecstasy of the Flesh. Some of them are also secretly initiates in the Path of Echoes. Three of the councilors (Bowmore, Clelland, Rowan) have aligned against Strangford and are maneuvering to remove the house from the council. Dunvil and Penderyn have not taken sides so far.",
      clocks: [
        {
          label: "Strangford eliminates threats",
          value: 0,
          max: 8
        },
        {
          label: "Strangford is removed from council",
          value: 0,
          max: 6
        }
      ],
      npcs: [
        {
          name: "Bowmore",
          gender: "",
          keyPhrases: [],
          other: "Noble head of the esteemed Bowmore family."
        },
        {
          name: "Clelland",
          gender: "",
          keyPhrases: [],
          other: "Noble head of the esteemed Clelland family."
        },
        {
          name: "Dunvil",
          gender: "",
          keyPhrases: [],
          other: "Noble head of the esteemed Dunvil family."
        },
        {
          name: "Penderyn",
          gender: "",
          keyPhrases: [],
          other: "Noble head of the esteemed Penderyn family."
        },
        {
          name: "Rowan",
          gender: "",
          keyPhrases: [],
          other: "Noble head of the esteemed Rowan family."
        },
        {
          name: "Strangford",
          gender: "",
          keyPhrases: [],
          other: "Noble head of the esteemed Strangford family."
        }
      ],
      turf: [
        "The city council chambers in Charterhall",
        "Government offices",
        "Impregnable city treasury vaults",
        "Ownership of all public spaces in the city, including streets, docks, and waterways"
      ],
      assets: [
        "A massive treasury of coin and valuable goods",
        "Many officials, barristers, clerks, and officials",
        "The public coaches operated by the Cabbies"
      ],
      allies: [
        "Lord Scurlock",
        "the Bluecoats",
        "the Brigade",
        "the Cabbies",
        "the Church of Ecstasy",
        "the Circle of Flame",
        "the Foundation",
        "the Sparkwrights"
      ],
      enemies: [
        "the Imperial Military",
        "the Inspectors",
        "the Ministry of Preservation",
        "the Reconciled"
      ]
    },
    "the Crows": {
      name: "the Crows",
      subtitle: "an Old Gang with New Leadership",
      concept: "An old gang known for running illegal games of chance and extortion rackets.",
      description: "The Crows claim all of Crow's Foot as their turf, with everyone in the district paying up the chain to them. Their headquarters is in an abandoned City Watch tower, and they operate gambling dens in Crow's Foot and extortion rackets at the Docks. Led by Lyssa, they are known for their veteran gang of thugs and killers. They also possess a number of small boats and a fortified HQ.",
      gm_notes: "Lyssa murdered the former boss of the Crows, Roric. His vengeful ghost is now at large in the city. As the power-play continues, the Crows' hold on the district might slip away due to some members' loyalty to Roric.",
      clocks: [
        {
          label: "Reestablish control of Crow's Foot",
          value: 0,
          max: 6
        },
        {
          label: "Rise in Tier",
          value: 0,
          max: 6
        }
      ],
      npcs: [
        {
          name: "Lyssa",
          gender: "f",
          keyPhrases: [
            "Brash",
            "Killer",
            "Noble Family"
          ],
          other: "Leader of The Crows."
        },
        {
          name: "Bell",
          gender: "f",
          keyPhrases: [
            "Loyal"
          ],
          other: "Second-in-command of The Crows."
        }
      ],
      turf: [
        "Claims all of Crow's Foot",
        "HQ in an abandoned City Watch tower",
        "Operates gambling dens in Crow's Foot",
        "Extortion rackets at the Docks"
      ],
      assets: [
        "A veteran gang of thugs and killers",
        "A number of small boats",
        "A fortified HQ"
      ],
      allies: [
        "Citizens of Crow's Foot",
        "Sailors",
        "the Bluecoats",
        "the Lost"
      ],
      enemies: [
        "the Dockers",
        "the Hive",
        "the Inspectors"
      ]
    },
    "Deathlands Scavengers": {
      name: "Deathlands Scavengers",
      subtitle: "Explorers of the Wastelands Beyond the Lightning Barriers",
      concept: "Convicts from Ironhook and desperate freelancers who roam the wasteland beyond the lightning barriers.",
      description: "The Deathlands Scavengers are a group of convicts and freelancers who have chosen to roam the perilous wastelands beyond Duskvol's lightning barriers. These wastelands, known as the deathlands, are treacherous and filled with spirits and other dangers. The scavengers are led by Lady Thorn, a brave and caring leader who is haunted by her past. They search for lost artifacts and treasures in the wastes, which they sell or trade in the city. Some even manage to gather enough to buy a pardon and return to life within the barriers.",
      gm_notes: "Condemned prisoners are sometimes given “mercy” and sent into the deathlands rather than being executed at Ironhook. A few survive, thanks to Lady Thorn and her deathlands scavengers, who take them in and train them in the ways of deathlands hunting and survival.",
      clocks: [
        {
          label: "Obtain pardons (repeating)",
          value: 0,
          max: 8
        }
      ],
      npcs: [
        {
          name: "Lady Thorn",
          gender: "f",
          keyPhrases: [
            "Haunted",
            "Brave",
            "Caring"
          ],
          other: "Leader of the Deathlands Scavengers."
        },
        {
          name: "Richter",
          gender: "m",
          keyPhrases: [
            "Patient",
            "Quiet",
            "Deadly"
          ],
          other: "A skilled hunter in the wastelands."
        }
      ],
      turf: [
        "A few precious hold-fasts in the deathlands, secured by ancient rites against spirits.",
        "Hunting grounds to feed on the few strange animals that survived the cataclysm."
      ],
      assets: [
        "Generators, lightning hooks, gas-masks, air tanks, and other essentials of deathlands survival.",
        "A secret ancient book of ritual sorcery."
      ],
      allies: [
        "the Forgotten Gods",
        "the Gondoliers",
        "the Spirit Wardens"
      ],
      enemies: [
        "Ironhook Prison"
      ]
    },
    "the Dimmer Sisters": {
      name: "the Dimmer Sisters",
      subtitle: "Reclusive Mystics of the Occult",
      concept: "House-bound recluses with an occult reputation.",
      description: "The Dimmer Sisters are enigmatic figures who reside in a fine old manor house, along with the ancient temple ruin and subterranean canal beneath it. They have a reputation in the occult circles of Duskvol, and their true names and exact number remain a mystery. Some believe they are an ancient family of possessing spirits, while others whisper that they might be vampires. One thing is certain: those who enter their house are never seen again. They are served by apothecaries and witches, and their dealings are mostly kept secret from the outside world.",
      gm_notes: "The Sisters have been slowly and secretly consolidating the trade of captured spirits and spirit essences in Doskvol for several decades. Only a few remaining rivals stand between them and domination of the market.",
      clocks: [
        {
          label: "Dominate the spirit trade",
          value: 0,
          max: 6
        },
        {
          label: "Obtain arcane secrets (repeating)",
          value: 0,
          max: 4
        }
      ],
      npcs: [
        {
          name: "Roslyn",
          gender: "f",
          keyPhrases: [
            "Patient",
            "Loyal",
            "Arcane"
          ],
          other: "Deals with contacts outside the house."
        },
        {
          name: "Irelen",
          gender: "f",
          keyPhrases: [
            "Loyal",
            "Enigmatic",
            "Obsessive"
          ],
          other: "A sparkcraft tinkerer."
        }
      ],
      turf: [
        "Fine old manor house and grounds (HQ)",
        "Ancient temple ruin and subterranean canal beneath",
        "Apothecaries and witches in their service"
      ],
      assets: [
        "A private electroplasmic generator, lightning barriers, and spirit containment vessels",
        "Many spirits bound to service"
      ],
      allies: [
        "the Forgotten Gods",
        "the Foundation"
      ],
      enemies: [
        "the Reconciled",
        "the Spirit Wardens"
      ]
    },
    "the Fog Hounds": {
      name: "the Fog Hounds",
      subtitle: "a Rough Gang of Smugglers Seeking Patronage",
      concept: "A crew of rough smugglers looking for a patron.",
      description: "Led by Margette Vale, The Fog Hounds are a crew of hard-bitten, tough sailors, all former Void Sea transport haulers. These sailors have been put out of work by the new cargo rail lines and are well-worn from years of harrowing work on the Void Sea. The crew is insular and clannish, often skeptical of outsiders. However, once trust is earned, their loyalty is unbreakable. They currently aim to dominate the Northern smuggling routes in and out of Duskwall, hoping to eliminate any rivals and secure a steady patron.",
      gm_notes: "Vale and her crew are working to absorb or eliminate the remaining rivals in their territory. Their ultimate goal is to establish a consistent relationship with a patron who requires a regular flow of contraband.",
      clocks: [
        {
          label: "Eliminate rival smugglers",
          value: 0,
          max: 8
        },
        {
          label: "Obtain a regular patron",
          value: 0,
          max: 6
        }
      ],
      npcs: [
        {
          name: "Margette Vale",
          gender: "f",
          keyPhrases: [
            "Quiet",
            "Cold",
            "Fearless"
          ],
          other: "Leader of The Fog Hounds."
        },
        {
          name: "Bear",
          gender: "m",
          keyPhrases: [
            "Fierce",
            "Moody",
            "Brash"
          ],
          other: "Second in command."
        },
        {
          name: "Goldie",
          gender: "f",
          keyPhrases: [
            "Calculating",
            "Patient",
            "Confident"
          ],
          other: "Navigator for the crew."
        }
      ],
      turf: [
        "Underground canal dock (HQ)",
        "North and East city canal routes",
        "Northern Void Sea routes",
        "Old North Port supply caches"
      ],
      assets: [
        "Medium steamship, Fog Hound",
        "A crew of hard-bitten, tough, expert sailors",
        "A wide array of Imperial transport and cargo documents, some forged, some legit"
      ],
      allies: [
        "the Dockers",
        "the Lampblacks"
      ],
      enemies: [
        "the Bluecoats"
      ]
    },
    "the Gondoliers": {
      name: "the Gondoliers",
      subtitle: "Canal Boat Operators with Occult Knowledge",
      concept: "The canal boat operators. Venerated by ancient tradition. Said to know occult secrets.",
      description: "The Gondoliers are the canal boat operators of Doskvol, venerated by ancient tradition and believed to possess occult knowledge. They are beloved by most citizens, who often turn to them for assistance with supernatural problems rather than the Spirit Wardens. The Gondoliers have been protecting citizens from rogue spirits and other supernatural threats since ancient times, long before the Spirit Wardens were established.",
      gm_notes: "Recently, ritually disfigured hollows have been discovered in the canals, prompting an investigation by the Gondoliers. The Spirit Wardens are deliberately ignoring this situation. All Gondoliers are granted the Whisper's Compel special ability.",
      clocks: [
        {
          label: "Investigate desecrated hollows",
          value: 0,
          max: 8
        },
        {
          label: "Destroy spirit wells (repeating)",
          value: 0,
          max: 4
        }
      ],
      npcs: [
        {
          name: "Eisele",
          gender: "f",
          keyPhrases: [
            "Serene",
            "Knowledgeable",
            "Fearless"
          ],
          other: "Leader of the Gondoliers."
        },
        {
          name: "Griggs",
          gender: "m",
          keyPhrases: [
            "Strange",
            "Ruthless",
            "Haunted"
          ],
          other: "Chief Whisper for the Gondoliers."
        }
      ],
      turf: [
        "The canals of Doskvol"
      ],
      assets: [
        "Fleet of gondolas and other water-craft",
        "Map of known spirit wells and arcane sites across the city",
        "A dedicated cohort of Adepts"
      ],
      allies: [
        "Citizens of Barrowcleft",
        "Citizens of Brightstone",
        "Citizens of Charhollow",
        "Citizens of Charterhall",
        "Citizens of Coalridge",
        "Citizens of Crow's Foot",
        "Citizens of Dunslough",
        "Citizens of Nightmarket",
        "Citizens of Silkshore",
        "Citizens of Six Towers",
        "Citizens of Whitecrown",
        "Citizens of the Docks",
        "the Lampblacks"
      ],
      enemies: [
        "the Red Sashes",
        "the Spirit Wardens"
      ]
    },
    "the Gray Cloaks": {
      name: "the Gray Cloaks",
      subtitle: "Former Bluecoats Turned Criminals",
      concept: "A crew of former Bluecoats turned to crime after being framed and expelled from the City Watch.",
      description: "The Gray Cloaks are a group of former Bluecoats who were unjustly framed for a crime they didn't commit. While they were involved in some minor corrupt activities, they were not responsible for burning down the Watch station or destroying evidence against Lord Strangford. Now, having turned to crime, they operate out of the basement of the burned-down City Watch station and have taken over several apartments in Six Towers. They also run a pit-fighting arena and gambling den.",
      gm_notes: "The Gray Cloaks were framed by their Watch station commander for a crime that implicated Lord Strangford of the Leviathan Hunters. Some inspectors know the truth but lack evidence. Lord Strangford would pay handsomely to eliminate these threats.",
      clocks: [
        {
          label: "Secure Six Towers as their turf",
          value: 0,
          max: 8
        },
        {
          label: "Avenge their expulsion",
          value: 0,
          max: 8
        }
      ],
      npcs: [
        {
          name: "Nessa",
          gender: "f",
          keyPhrases: [
            "Scrupulous",
            "Daring"
          ],
          other: "Leader of the Gray Cloaks."
        },
        {
          name: "Hutch",
          gender: "m",
          keyPhrases: [
            "Brash",
            "Fierce"
          ],
          other: "Second in command."
        }
      ],
      turf: [
        "The basement of a burned-down City Watch station (HQ)",
        "Several apartments above a tobacconist in Six Towers",
        "A pit-fighting arena and gambling den"
      ],
      assets: [
        "A sizeable gang of trained enforcers",
        "Old uniforms and badges used to impersonate the City Watch"
      ],
      allies: [
        "the Inspectors"
      ],
      enemies: [
        "the Bluecoats",
        "the Leviathan Hunters"
      ]
    },
    "the Grinders": {
      name: "the Grinders",
      subtitle: "Vicious Former Dockers and Refinery Workers",
      concept: "A vicious gang of former dockers and leviathan blood refinery workers.",
      description: "The Grinders are a group of dockers and refinery workers from Lockport, a city to the North in Skovlan. They have come to Doskvol with a mission to raise an army, secure a warship, and take control of Lockport. Their goal is to destroy the Empire's refineries. To fund their mission, they've turned to criminal activities, especially looting and hijacking cargo barges across Doskvol.",
      gm_notes: "The city of Lockport processes 90% of the demon blood siphoned by the leviathan hunter ships of Doskvol. The refineries in Lockport have poisoned the city with toxic fumes and acid rain. The Grinders, affected by this, have come to Doskvol to raise an army and secure a warship to take control of Lockport and destroy the Empire's refineries.",
      clocks: [
        {
          label: "Raise a crew, steal a war ship",
          value: 0,
          max: 12
        },
        {
          label: "Fill war treasury",
          value: 0,
          max: 12
        }
      ],
      npcs: [
        {
          name: "Hutton",
          gender: "m",
          keyPhrases: [
            "Confident",
            "Volatile"
          ],
          other: "Leader of the Grinders."
        },
        {
          name: "Sercy",
          gender: "m",
          keyPhrases: [
            "Crippled",
            "Defiant"
          ],
          other: "Second in command."
        },
        {
          name: "Derret",
          gender: "m",
          keyPhrases: [
            "Huge",
            "Shrewd"
          ],
          other: "Toughest gang member."
        }
      ],
      turf: [
        "Abandoned dock warehouse (HQ)",
        "Underground canal dock"
      ],
      assets: [
        "A few small canal boats",
        "Wrecking tools and explosives"
      ],
      allies: [
        "Ulf Ironborn",
        "the Dockers"
      ],
      enemies: [
        "Sailors",
        "the Bluecoats",
        "the Imperial Military",
        "the Leviathan Hunters",
        "the Silver Nails"
      ]
    },
    "the Hive": {
      name: "the Hive",
      subtitle: "a Secretive Guild of Contraband Merchants",
      concept: "A guild of legitimate merchants who secretly trade in contraband. Named for their symbol, a golden bee.",
      description: "The Hive, symbolized by a golden bee, is a guild of merchants that operates legitimately on the surface but secretly trades in contraband. They have a vast presence across Doskvol, owning many shops, taverns, cafes, warehouses, and other mercantile establishments. The Hive is known to avoid business with any occult or arcane groups, and many of its members are followers of the Church of Ecstasy, rejecting the superstitions of the past.",
      gm_notes: "Djera Maha, the leader of The Hive, was once an urchin in the Dagger Isles. She climbed the ranks of every gang along the trade routes to Doskvol, establishing her acquisition and distribution network in the city. She is now poised to dominate all contraband markets. Djera had a close (possibly romantic) relationship with Roric, the leader of the Crows, who was recently murdered.",
      clocks: [
        {
          label: "Dominate contraband market",
          value: 0,
          max: 8
        },
        {
          label: "Avenge Roric's murder",
          value: 0,
          max: 6
        }
      ],
      npcs: [
        {
          name: "Djera Maha",
          gender: "f",
          keyPhrases: [
            "Bold",
            "Strategic",
            "Confident"
          ],
          other: "Leader of The Hive."
        },
        {
          name: "Karth Orris",
          gender: "m",
          keyPhrases: [
            "Ruthless",
            "Insightful",
            "Jealous"
          ],
          other: "Mercenary commander for The Hive."
        }
      ],
      turf: [
        "Many shops, taverns, cafes, warehouses, and other mercantile establishments all across the city."
      ],
      assets: [
        "A massive treasury",
        "Elite mercenaries on retainer",
        "A fleet of transport ships, carriages, wagons, and private trains"
      ],
      allies: [
        "the Dagger Isles Consulate",
        "the Ministry of Preservation"
      ],
      enemies: [
        "the Circle of Flame",
        "the Crows",
        "the Unseen",
        "the Wraiths"
      ]
    },
    "the Lampblacks": {
      name: "the Lampblacks",
      subtitle: "the Former Lamp-Lighter Guild Turned Criminal",
      concept: "The former lamp-lighter guild, turned to crime when their services were replaced by electric lights.",
      description: "The Lampblacks, once a guild of lamp-lighters, turned to criminal activities after their services became obsolete due to the advent of electric lights. They now operate out of a coal warehouse in Crow's Foot and run several brothels and cheap drug dens across the district. Led by the charismatic Bazso Baz, they are seen by the working class as 'lovable rogues' standing up against the establishment. The gang is currently at war with the Red Sashes over turf and vengeance for past transgressions.",
      gm_notes: "Bazso Baz is a member of a secret society, the forgotten gods cult named 'The Empty Vessel', and sometimes prioritizes the needs of that group over his gang. The Lampblacks and the Red Sashes are in a turf war, and Bazso is recruiting aggressively, making it clear that one is either with them or against them.",
      clocks: [
        {
          label: "Destroy the Red Sashes",
          value: 0,
          max: 8
        },
        {
          label: "Become ward boss of Crow's Foot",
          value: 0,
          max: 8
        }
      ],
      npcs: [
        {
          name: "Bazso Baz",
          gender: "m",
          keyPhrases: [
            "Charming",
            "Open",
            "Ruthless",
            "Whiskey Connoisseur"
          ],
          other: "Leader of The Lampblacks."
        },
        {
          name: "Pickett",
          gender: "m",
          keyPhrases: [
            "Shrewd",
            "Conniving",
            "Suspicious"
          ],
          other: "Second in command."
        },
        {
          name: "Henner",
          gender: "m",
          keyPhrases: [
            "Loyal",
            "Reckless"
          ],
          other: "A thug in the gang."
        }
      ],
      turf: [
        "HQ in the office of a coal warehouse",
        "Operates a handful of brothels and cheap drug dens across Crow's Foot"
      ],
      assets: [
        "A fearsome gang of leg-breakers and mayhem-makers",
        "A number of smugglers on the payroll who run their drugs"
      ],
      allies: [
        "Ironhook Prison",
        "the Fog Hounds",
        "the Gondoliers"
      ],
      enemies: [
        "the Bluecoats",
        "the Cabbies",
        "the Red Sashes"
      ]
    },
    "the Leviathan Hunters": {
      name: "the Leviathan Hunters",
      subtitle: "the Captains and Crews who Hunt the Leviathans of the Void Sea",
      concept: "The captains and crews that grapple with titanic demons of the Void Sea to drain their blood for processing into electroplasm.",
      description: "The Leviathan Hunters are renowned for their daring ventures into the Void Sea, where they grapple with immense demons to extract their blood. This blood is then processed into electroplasm, a vital resource for the city of Doskvol. The hunters operate a fleet of vessels, each owned by a noble house that commands it. They have numerous expert sailors, spark-craft technicians, demonologist Whispers, and void-touched navigators. Additionally, they maintain companies of marines to safeguard their ships and their precious cargo both at sea and in port.",
      gm_notes: "The captains harbor a terrible secret: the known hunting grounds for leviathans are becoming barren. The once-reliable movements of these immortal creatures in the Void Sea have changed, and they are migrating elsewhere. New hunting grounds must be discovered before the surplus of leviathan blood runs out, threatening the lightning barriers and the survival of humanity.",
      clocks: [
        {
          label: "Discover new hunting grounds",
          value: 0,
          max: 12
        },
        {
          label: "Surplus runs dry",
          value: 0,
          max: 12
        }
      ],
      npcs: [
        {
          name: "Lord Strangford",
          gender: "m",
          keyPhrases: [
            "Ruthless",
            "Arrogant",
            "Tainted"
          ],
          other: "A captain of the Leviathan Hunters."
        },
        {
          name: "Lady Clave",
          gender: "f",
          keyPhrases: [
            "Daring",
            "Cruel",
            "Accomplished"
          ],
          other: "Another captain in the fleet."
        },
        {
          name: "Lady Ankhayat",
          gender: "f",
          keyPhrases: [
            "Confident",
            "Charming",
            "Scoundrel"
          ],
          other: "An Iruvian captain of the Leviathan Hunters."
        }
      ],
      turf: [
        "The massive metal docks for the huge hunter ships",
        "Construction and repair facilities",
        "Several small private leviathan blood processing facilities for the captains' personal shares"
      ],
      assets: [
        "The leviathan hunter fleet",
        "Many cohorts of expert sailors, spark-craft technicians, demonologist Whispers, and void-touched navigators",
        "Companies of marines"
      ],
      allies: [
        "Sailors",
        "the Church of Ecstasy",
        "the City Council",
        "the Dockers",
        "the Sparkwrights"
      ],
      enemies: [
        "the Grinders",
        "the Ministry of Preservation",
        "the Path of Echoes"
      ]
    },
    "the Lost": {
      name: "the Lost",
      subtitle: "Protectors of the Downtrodden",
      concept: "A group of street-toughs and ex-soldiers dedicated to protecting the downtrodden and the hopeless.",
      description: "The Lost is a group of former thugs, killers, and Imperial soldiers who have turned their efforts towards protecting the vulnerable. Operating primarily in the districts of Coalridge and Dunslough, they have recently been focusing on sabotaging and attacking the notoriously cruel workhouse foremen in Coalridge. Their actions have emboldened union organizing efforts in the district, leading to increased tensions with local Bluecoat patrols.",
      gm_notes: "The Lost are driven by a need for atonement. Each member keeps a pile of stones under their bed, with each stone representing a sin they've committed. They believe that by performing just deeds, they can balance out these sins. The Coalridge foremen are offering a significant reward to anyone who can eliminate The Lost.",
      clocks: [
        {
          label: "Destroy cruel workhouses (repeating)",
          value: 0,
          max: 4
        }
      ],
      npcs: [
        {
          name: "Cortland",
          gender: "m",
          keyPhrases: [
            "Idealist",
            "Candid",
            "Cavalier"
          ],
          other: "The leader of The Lost."
        }
      ],
      turf: [
        "Converted rail car (HQ)",
        "The poverty-stricken streets of Coalridge and Dunslough"
      ],
      assets: [
        "A very experienced gang of formerly vicious thugs, killers, and Imperial soldiers"
      ],
      allies: [
        "Citizens of Coalridge",
        "Citizens of Dunslough",
        "Laborers",
        "the Crows"
      ],
      enemies: [
        "Laborers",
        "the Billhooks",
        "the Bluecoats"
      ]
    },
    "the Ministry of Preservation": {
      name: "the Ministry of Preservation",
      subtitle: "Overseers of Vital Resources and Transport",
      concept: "Oversees transportation between cities and the disbursement of food and other vital resources.",
      description: "The Ministry of Preservation is responsible for overseeing transportation between cities and managing the distribution of essential resources. They control the electro-rail train lines of the Imperium and have a significant influence over radiant energy farms, eeleries, and other food-growing enterprises throughout the city. The Ministry has a fleet of cargo ships, armed escorts, and the Rail Jacks who work the train lines. They also maintain a private mercenary company that answers only to the ministry.",
      gm_notes: "The Ministry leadership believes that the leviathan hunters are too vital to the public well-being to be controlled by the noble houses. They are taking covert actions to seize control of the hunters and bring them under Ministry control.",
      clocks: [
        {
          label: "Seize control of Leviathan Hunters",
          value: 0,
          max: 12
        }
      ],
      npcs: [
        {
          name: "Lord Dalmore",
          gender: "m",
          keyPhrases: [
            "Commanding",
            "Intelligent"
          ],
          other: "Executive officer in Doskvol."
        },
        {
          name: "Lady Slane",
          gender: "f",
          keyPhrases: [
            "Insightful",
            "Subtle",
            "Effective"
          ],
          other: "Chief of operations."
        },
        {
          name: "Captain Lannock",
          gender: "m",
          keyPhrases: [
            "Shrewd",
            "Ruthless"
          ],
          other: "Mercenary commander."
        }
      ],
      turf: [
        "The electro-rail train lines of the Imperium",
        "Radiant energy farms, eeleries, and other food-growing enterprises throughout the city"
      ],
      assets: [
        "A fleet of cargo ships and their armed escorts",
        "A significant treasury from taxation and transportation licensing",
        "The Rail Jacks who work the train lines",
        "A private mercenary company"
      ],
      allies: [
        "the Billhooks",
        "the Imperial Military",
        "the Rail Jacks",
        "the Sparkwrights"
      ],
      enemies: [
        "the Leviathan Hunters"
      ]
    },
    "the Reconciled": {
      name: "the Reconciled",
      subtitle: "Ancient Spirits Seeking Order",
      concept: "An association of ancient spirits who have not gone feral with the passage of time.",
      description: "The Reconciled is a unique association of ancient spirits that, unlike most spirits, have not gone feral over time. They do not have a specific turf within the city. These spirits can possess victims indefinitely without causing any harm, and they have several hidden spirit wells across the city and in the deathlands, which provide them with the arcane energy they need to survive.",
      gm_notes: "The Reconciled view themselves as the rightful rulers of Duskwall. Some members of the City Council have become initiates in the Path of Echoes and will soon be vulnerable to possession by the Reconciled. These councilors are also high-ranking members of the Church of the Ecstasy of the Flesh, providing an opportunity for infiltration.",
      clocks: [
        {
          label: "Infiltrate the City Council",
          value: 0,
          max: 8
        },
        {
          label: "Infiltrate the Church of Ecstasy",
          value: 0,
          max: 8
        }
      ],
      npcs: [],
      turf: [],
      assets: [
        "Several secret and hidden spirit wells across the city and in the deathlands"
      ],
      allies: [
        "the City Council",
        "the Gondoliers"
      ],
      enemies: [
        "the Church of Ecstasy",
        "the Sparkwrights",
        "the Spirit Wardens"
      ]
    },
    "the Red Sashes": {
      name: "the Red Sashes",
      subtitle: "Ancient Iruvian Swordsmen Turned Criminals",
      concept: "Originally a school of ancient Iruvian sword arts, since expanded into criminal endeavors.",
      description: "The Red Sashes started as a school teaching ancient Iruvian sword arts. They have since expanded their operations into the criminal world. They operate out of their sword-fighting school which also serves as their headquarters. They have a strong presence in Crow's Foot and the Docks, where they run high-end drug dens. Several members of the Red Sashes are from noble Iruvian families, and their connections to powerful families in Doskvol make them a force to be reckoned with.",
      gm_notes: "The Red Sashes and the Lampblacks are currently at war over turf and for revenge. Mylera is recruiting aggressively, making it clear that neutrality is not an option. The Red Sashes have connections with former sword students in various influential positions.",
      clocks: [
        {
          label: "Destroy the Lampblacks",
          value: 0,
          max: 8
        },
        {
          label: "Become ward boss of Crow's Foot",
          value: 0,
          max: 8
        }
      ],
      npcs: [
        {
          name: "Mylera Klev",
          gender: "f",
          keyPhrases: [
            "Shrewd",
            "Ruthless",
            "Educated",
            "Art Collector"
          ],
          other: "Leader of the Red Sashes."
        }
      ],
      turf: [
        "HQ in their sword-fighting school/temple",
        "Several high-end drug dens across Crow's Foot and the Docks"
      ],
      assets: [
        "Small contingent of master sword-fighters",
        "Master alchemist; many potent potions and essences"
      ],
      allies: [
        "the Cabbies",
        "the Dockers",
        "the Inspectors",
        "the Iruvian Consulate",
        "the Path of Echoes"
      ],
      enemies: [
        "the Bluecoats",
        "the Gondoliers",
        "the Lampblacks"
      ]
    },
    "Lord Scurlock": {
      name: "Lord Scurlock",
      subtitle: "a Mysterious Noble with Dark Secrets",
      concept: "An ancient noble, rumored to be immortal like the Emperor. Possibly a vampire or sorcerer. Obsessed with the occult.",
      description: "Lord Scurlock is an enigmatic figure in Doskvol, known for his cold demeanor and arcane interests. Rumors suggest he might be immortal, drawing comparisons with the Emperor. Some even whisper that he could be a vampire or a sorcerer. He owns a dilapidated manor house in Six Towers, which hides catacombs beneath. Across the city, he has an array of business holdings and cult shrines, all seemingly connected to a mysterious purpose.",
      gm_notes: "Lord Scurlock is a vampire bound by ancient magic to the demon Setarra. Their roles as master and servant have shifted over time. Currently, Scurlock owes a debt: Setarra has discovered sea demons in the harbor, trapped in stone since the cataclysm. She wishes to free them, and Scurlock must assist or face dire consequences.",
      clocks: [
        {
          label: "Fulfill debt to Setarra",
          value: 0,
          max: 12
        },
        {
          label: "Obtain arcane secrets (repeating)",
          value: 0,
          max: 6
        }
      ],
      npcs: [
        {
          name: "Lord Scurlock",
          gender: "m",
          keyPhrases: [
            "Enigmatic",
            "Cold",
            "Arcane",
            "Old-fashioned"
          ],
          other: "An individual so powerful he's considered a faction on his own. In combat, his personal scale is Tier III, equivalent to a large gang. Immune to spirits and moves silently. Difficult to look at directly."
        }
      ],
      turf: [
        "A secret lair outside the city",
        "A dilapidated manor house in Six Towers and the catacombs beneath",
        "Various business holdings and cult shrines across the city"
      ],
      assets: [
        "An impressive collection of occult and arcane curios, books, and ephemera",
        "An ancient demonic temple"
      ],
      allies: [
        "the Bluecoats",
        "the City Council",
        "the Forgotten Gods",
        "the Inspectors"
      ],
      enemies: [
        "the Immortal Emperor",
        "the Spirit Wardens"
      ]
    },
    "the Silver Nails": {
      name: "the Silver Nails",
      subtitle: "Severosi Mercenaries and Ghost Killers",
      concept: "A company of Severosi mercenaries who fought for the Empire in the Unity War. Renowned ghost killers.",
      description: "The Silver Nails are a company of Severosi mercenaries known for their prowess in the Unity War. They are especially renowned as ghost killers. Based in Duskvol, they have their sights set on the Lost District, a forbidden area outside the city's lightning barrier. They aim to drive out or destroy the fierce ghosts that inhabit this district and seize control to uncover the hidden treasures and artifacts within. Their expertise from the deathlands of Severos makes them uniquely qualified for this task.",
      gm_notes: "The Silver Nails are looking to explore the Lost District, which is currently under the control of the Spirit Wardens. The Wardens are doing everything in their power to keep the Silver Nails and others out. Each member wears a ring fashioned from a silver nail, which protects against possession. They are all trained in the Ghost Fighter special ability.",
      clocks: [
        {
          label: "Destroy spirits in the Lost District",
          value: 0,
          max: 8
        },
        {
          label: "Control the Lost District",
          value: 0,
          max: 8
        }
      ],
      npcs: [
        {
          name: "Seresh",
          gender: "m",
          keyPhrases: [
            "Bold",
            "Brash",
            "Defiant"
          ],
          other: "Leader of The Silver Nails."
        },
        {
          name: "Tuhan",
          gender: "m",
          keyPhrases: [
            "Bold",
            "Cunning",
            "Charming"
          ],
          other: "Lead scout for The Silver Nails."
        }
      ],
      turf: [
        "A large inn (The Mustang) and its fine stables (HQ)"
      ],
      assets: [
        "A contingent of exquisite Severosian cavalry horses—fearless, swift, and trained to hunt and battle spirits",
        "Arcane lances"
      ],
      allies: [
        "Sailors",
        "the Imperial Military",
        "the Severosi Consulate"
      ],
      enemies: [
        "Skovlander Refugees",
        "the Circle of Flame",
        "the Grinders",
        "the Skovlan Consulate",
        "the Spirit Wardens"
      ]
    },
    "the Sparkwrights": {
      name: "the Sparkwrights",
      subtitle: "Engineers of the Lightning Barriers and Pioneers of Spark-Craft",
      concept: "The engineers who maintain the lightning barriers. Also pioneers of spark-craft technology, indulging in dangerous research.",
      description: "The Sparkwrights are the engineers responsible for maintaining Duskvol's lightning barriers. Beyond this crucial role, they are also at the forefront of spark-craft technology. They constantly push the boundaries with their dangerous research, seeking innovations that could revolutionize the city's defenses and power sources.",
      gm_notes: "For centuries, the Sparkwrights have been working secretly to develop an alternative fuel that could replace leviathan blood, which powers the lightning barriers. Some researchers have come close, but mysterious 'accidents' have thwarted their progress. These accidents are likely orchestrated by the nobility who control leviathan hunting.",
      clocks: [
        {
          label: "Develop alternative fuel",
          value: 0,
          max: 12
        }
      ],
      npcs: [
        {
          name: "Una Farros",
          gender: "f",
          keyPhrases: [
            "Curious",
            "Vain",
            "Famous"
          ],
          other: "Instructor at Charterhall University."
        }
      ],
      turf: [
        "Massive workshop, factory, and design facility in Coalridge"
      ],
      assets: [
        "The electroplasmic generators, city lights, lightning barriers and associated facilities and systems across the city"
      ],
      allies: [
        "the City Council",
        "the Leviathan Hunters",
        "the Ministry of Preservation"
      ],
      enemies: [
        "the Foundation",
        "the Path of Echoes",
        "the Reconciled"
      ]
    },
    "the Spirit Wardens": {
      name: "the Spirit Wardens",
      subtitle: "Bronze-Masked Hunters of Rogue Spirits",
      concept: "The bronze-masked hunters who destroy rogue spirits. Also run Bellweather Crematorium to properly dispose of corpses.",
      description: "The Spirit Wardens are the enigmatic bronze-masked hunters responsible for destroying rogue spirits in the city. They operate the Bellweather Crematorium, ensuring the proper disposal of corpses to prevent the rise of these spirits. The Wardens maintain complete anonymity, with members cutting all personal ties and living solely for their duty. They utilize advanced equipment, including spirit-hunter hulls, and have the support of many expert Whispers. Their operations are so secretive that even their allies and enemies are often left guessing their next moves.",
      gm_notes: "The Spirit Wardens are aware of an enemy trying to infiltrate their ranks, though they are unaware that this enemy is the Unseen. They are currently setting a trap to identify and eliminate this threat.",
      clocks: [
        {
          label: "Uncover the infiltrators",
          value: 0,
          max: 8
        }
      ],
      npcs: [
        {
          name: "Bakoros",
          gender: "unknown",
          keyPhrases: [],
          other: "A Warden who may be several individuals and sometimes lectures at the College of Immortal studies at Doskvol Academy."
        }
      ],
      turf: [
        "Bellweather Crematorium",
        "The Master Warden's estate in Whitecrown"
      ],
      assets: [
        "The death bells that ring whenever someone dies in the city",
        "The deathseeker crows that find the body",
        "Many cohorts of expert Whispers",
        "The most advanced spectrological and spark-craft equipment, including several spirit-hunter hulls"
      ],
      allies: [
        "Deathlands Scavengers",
        "the Church of Ecstasy"
      ],
      enemies: [
        "Lord Scurlock",
        "the Dimmer Sisters",
        "the Gondoliers",
        "the Path of Echoes",
        "the Reconciled",
        "the Silver Nails",
        "the Unseen"
      ]
    },
    "Ulf Ironborn": {
      name: "Ulf Ironborn",
      subtitle: "a Brutal Skovlander Fighting for Turf",
      concept: "A brutal Skovlander, newly arrived in the Dusk, fighting everyone for turf.",
      description: "Ulf Ironborn is a fierce Skovlander who has recently come to Doskvol. He is aggressively trying to establish his territory in the city, leading his gang in ruthless smash & grab operations. As more Skovlander war refugees come to the city, tensions rise, especially with the appearance of 'NO SKOVS' signs. Ulf's strong distrust for the local Akorosi and anyone loyal to the Imperial government makes him a volatile figure, but those of Skovlander blood can easily earn his trust.",
      gm_notes: "Ulf's anger is on a hair-trigger, especially with the rising bigotry against Skovlanders. He is likely to lead his gang into war against any 'true Duskers' who challenge him.",
      clocks: [
        {
          label: "Carve out gang territory",
          value: 0,
          max: 6
        },
        {
          label: "Rise in Tier",
          value: 0,
          max: 4
        }
      ],
      npcs: [
        {
          name: "Ulf Ironborn",
          gender: "m",
          keyPhrases: [
            "Ruthless",
            "Savage",
            "Bold"
          ],
          other: "Leader of his gang, a brutal Skovlander."
        },
        {
          name: "Havid",
          gender: "m",
          keyPhrases: [
            "Ruthless",
            "Volatile",
            "Shrewd"
          ],
          other: "Ulf's second in command."
        }
      ],
      turf: [
        "Rooms, workshop, and stable at The Old Forge tavern (HQ)",
        "A gambling den"
      ],
      assets: [
        "A small but powerfully savage gang of thugs"
      ],
      allies: [
        "the Grinders"
      ],
      enemies: [
        "Citizens of Coalridge",
        "the Billhooks"
      ]
    },
    "the Unseen": {
      name: "the Unseen",
      subtitle: "an Insidious Criminal Enterprise with Hidden Membership",
      concept: "An insidious criminal enterprise with secret membership. Thought to pull the strings of the entire underworld.",
      description: "The Unseen are believed to control much of the underworld from the shadows. They have a multitude of vice dens and extortion rackets across the city, with few realizing they are paying up to this secretive group. Their perfect secrecy is maintained through arcane rituals, allowing core members to recognize each other with a special second sight. Anyone outside the group who learns the identity of a member soon forgets due to a ritual that erases that memory.",
      gm_notes: "The Unseen are attempting to infiltrate the Spirit Wardens, a group whose secret membership has resisted their advances. The Tower and The Star, key figures within the Unseen, are plotting to place their own operatives among the Wardens to take control from the inside.",
      clocks: [
        {
          label: "Infiltrate the Spirit Wardens",
          value: 0,
          max: 8
        },
        {
          label: "Expand into other cities",
          value: 0,
          max: 8
        }
      ],
      npcs: [
        {
          name: "The Tower",
          gender: "m",
          keyPhrases: [],
          other: "Leader of the Unseen."
        },
        {
          name: "The Star",
          gender: "m",
          keyPhrases: [],
          other: "Captain of the Unseen."
        },
        {
          name: "Grull",
          gender: "m",
          keyPhrases: [],
          other: "Mid-level thug undercover as a coach driver."
        }
      ],
      turf: [
        "A multitude of vice dens and extortion rackets across the city",
        "Several opulent townhouses used as safe houses"
      ],
      assets: [
        "A legion of thugs, thieves, and killers on-call to their secret masters."
      ],
      allies: [
        "Ironhook Prison",
        "the Bluecoats",
        "the Cyphers",
        "the Forgotten Gods"
      ],
      enemies: [
        "the Hive",
        "the Ink Rakes",
        "the Spirit Wardens"
      ]
    },
    "the Wraiths": {
      name: "the Wraiths",
      subtitle: "a Mysterious Crew of Masked Thieves and Spies",
      concept: "A mysterious crew of masked thieves and spies.",
      description: "The Wraiths operate primarily in Silkshore and Nightmarket, specializing in the theft of luxury items and intelligence gathering. Their operations often serve clients who use the stolen information for blackmail. Each member of the Wraiths wears a mask and goes by an alias, communicating with others using a private sign language. They have a secret lair in a tower in Silkshore and are equipped with all manner of thieves' gear for burglary.",
      gm_notes: "The Wraiths recently stole a private map book from a luxury brothel in Nightmarket. This map book reveals the secret hunting grounds of leviathan sites that will be used by the ship Storm Palace in the upcoming season. While the map is of no use to the Wraiths, it's highly valuable to another leviathan hunter. The Wraiths are now trying to discreetly arrange its sale.",
      clocks: [
        {
          label: "Recruit expert thieves",
          value: 0,
          max: 8
        },
        {
          label: "Secure an arcane ally",
          value: 0,
          max: 6
        }
      ],
      npcs: [
        {
          name: "Slate",
          gender: "m",
          keyPhrases: [
            "Sophisticated",
            "Daring",
            "Secretive"
          ],
          other: "Leader of the Wraiths."
        },
        {
          name: "Loop",
          gender: "m",
          keyPhrases: [
            "Obsessive",
            "Moody",
            "Secretive"
          ],
          other: "Appraisal expert for the Wraiths."
        }
      ],
      turf: [
        "Silkshore and Nightmarket as primary hunting grounds",
        "A scattered collection of secret rooftop shelters",
        "A secret lair in a tower in Silkshore"
      ],
      assets: [
        "All manner of thieves' gear for burglary"
      ],
      allies: [
        "the Cabbies"
      ],
      enemies: [
        "the Bluecoats",
        "the Hive",
        "the Inspectors"
      ]
    }
  }
};

const problemLog: string[] = [];

function parseColumnItem(item: string, isFaction = false) {
  if (isFaction) {
    const faction = game.actors.getName(item);
    if (!faction) {
      problemLog.push(item);
    } else {
      return `<p class='inline-doc-link-container'><img class='inline-doc-img' src="${faction.img}" /><a class='inline-doc-link faction-link' data-action='open' data-target='${faction.uuid}'>${item}</a></p>`;
    }
  }
  return `<p>${item}</p>`;
}
function formatSplitColumnsWithHeader(col1: {header: string, elements: string[]}, col2: {header: string, elements: string[]}, isFactionList = false) {
  return [
    "<div class='tox-two-column-flex'>",
    "<div class='tox-half-column'>",
    `<h2>${col1.header}</h2>`,
    ...col1.elements.map((elem) => parseColumnItem(elem, isFactionList)),
    "</div>",
    "<div class='tox-half-column'>",
    `<h2>${col2.header}</h2>`,
    ...col2.elements.map((elem) => parseColumnItem(elem, isFactionList)),
    "</div>",
    "</div>"
  ].join("");
}
function formatSplitColumns(elements: string[], isFactionList = false) {
  return [
    "<div class='tox-two-column-flex'>",
    ...elements.map((elem) => parseColumnItem(elem, isFactionList)),
    "</div>"
  ].join("");
}

async function updateFactionData(factionData: ValueOf<typeof JSONDATA["FACTIONS"]>) {
  const faction = await game.actors.getName(factionData.name) as BladesFaction|undefined;
  const updateData: Record<string, any> = {};
  if (faction) {
    updateData["system.subtitle"] = factionData.subtitle;
    updateData["system.concept"] = factionData.concept;
    updateData["system.description"] = [
      `<p>${factionData.description}</p>`,
      formatSplitColumnsWithHeader(
        {
          header: "Allied Factions",
          elements: factionData.allies
        },
        {
          header: "Opposing Factions",
          elements: factionData.enemies
        },
        true
      )
    ].join("");
    updateData["system.situation"] = `<p>${factionData.gm_notes}</p>`;
    updateData["system.assets"] = formatSplitColumns(factionData.assets);
    updateData["system.turf"] = formatSplitColumns(factionData.turf);
    updateData["system.-=clocks"] = null;
    updateData["system.-=status"] = null;
    updateData["system.-=goal_1"] = null;
    updateData["system.-=goal_2"] = null;
    updateData["system.-=quirks"] = null;
    updateData["system.-=notables"] = null;
    updateData["system.-=allies"] = null;
    updateData["system.-=enemies"] = null;
    updateData["system.-=goal_clock"] = null;
    updateData["system.-=type"] = null;
    updateData["system.-=goal_1_clock_value"] = null;
    updateData["system.-=goal_1_clock_max"] = null;
    updateData["system.-=goal_2_clock_value"] = null;
    updateData["system.-=goal_2_clock_max"] = null;
    updateData["system.-=tier_bonus"] = null;
    await faction.update(updateData);
    factionData.clocks.forEach((clockData: {label: string, value: number, max: number}, i: number) => {
      let color = "white";
      if (i > 0) { color = "yellow" }
      if (clockData.max > 8) { color = "red" }
      if (/\(repeating\)/.test(clockData.label)) { color = "cyan" }
      faction.addClock({
        display: clockData.label,
        value: clockData.value,
        max: clockData.max,
        isVisible: true,
        color
      });
    });
  } else {
    problemLog.push(`Unable to find faction "${factionData.name}"`);
  }
}

Object.assign(
  globalThis,
  {
    PARSEFACTIONS: async (factionName?: string) => {
      if (factionName) {
        if (factionName in JSONDATA.FACTIONS) {
          updateFactionData(JSONDATA.FACTIONS[factionName]);
          return;
        } else {
          throw new Error(factionName + " is not in the JSON data.");
        }
      }
      Object.values(JSONDATA.FACTIONS).forEach(async (factionData) => {
        updateFactionData(factionData);
      });
      console.log(problemLog);
    }
  }
);

class BladesFaction extends BladesActor implements BladesActorSubClass.Faction,
                                                   BladesRollCollab.OppositionDocData {


  // #region BladesRollCollab Implementation

  get rollFactors(): Partial<Record<Factor,BladesRollCollab.FactorData>> {
    const factorData: Partial<Record<Factor,BladesRollCollab.FactorData>> = {
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

    return factorData;
  }

  // #region BladesRollCollab.OppositionDoc Implementation
  get rollOppID() { return this.id }
  get rollOppDoc() { return this }
  get rollOppImg() { return this.img ?? "" }
  get rollOppName() { return this.name ?? "" }
  get rollOppSubName() { return "" }
  get rollOppType() { return this.type }

  get rollOppModsData(): BladesRollCollab.RollModData[] { return [] }
  // #endregion

  // #endregion

  async addClock(clockData: Partial<BladesClockData> = {}) {
    clockData.id ??= clockData.id ?? randomID();
    clockData.color ??= "white";
    clockData.display ??= "";
    clockData.isVisible ??= false;
    clockData.isNameVisible ??= false;
    clockData.isActive ??= false;
    clockData.max ??= 4;
    clockData.target ??= `system.clocks.${clockData.id}.value`;
    clockData.value ??= 0;

    return this.update({[`system.clocks.${clockData.id}`]: clockData});
  }

  async deleteClock(clockID: string) {
    return this.update({[`system.clocks.-=${clockID}`]: null});
  }
}

declare interface BladesFaction {
  type: BladesActorType.faction,
  system: BladesActorSchema.Faction
}

export default BladesFaction;