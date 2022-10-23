/* ****▌███████████████████████████████████████████████████████████████████████████▐**** *\
|*     ▌████░░░░░░░░░░░ Euno's Blades in the Dark for Foundry VTT ░░░░░░░░░░░░░████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░ by Eunomiac ░░░░░░░░░░░░░██████████████████▐     *|
|*     ▌████████████████████████████  License █ v0.1.0 ████████████████████████████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░░░░░░  ░░░░░░░░░░░░░░░░░░███████████████████▐     *|
\* ****▌███████████████████████████████████████████████████████████████████████████▐**** */

const DATA = {
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
            desc: "TARNALI was a Whisper composer who built a special harpsichord. When two tones are played, often a third \"ghost'' tone can be heard. By attaching the tuning pegs to crystals and runes, Tarnali built a harpsichord that could interact with the Ghost Field through calculated progressions of played tones.",
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
export default DATA;