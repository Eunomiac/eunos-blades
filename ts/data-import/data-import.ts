import {BladesActorType, BladesItemType, Playbook} from "../core/constants.js";
import U from "../core/utilities.js";
import BladesActor from "../blades-actor.js";
import BladesItem from "../blades-item.js";
const crewObjects = [
  {
    type: "contact",
    playbook: "Bravos",
    name: "Meg",
    description: "a pit-fighter",
    hints: [
      "Perhaps a trainer",
      "or perhaps a fellow extortion artist?"
    ]
  },
  {
    type: "contact",
    playbook: "Bravos",
    name: "Conway",
    description: "a Bluecoat",
    hints: [
      "Perhaps an informant within the City Watch?"
    ]
  },
  {
    type: "contact",
    playbook: "Bravos",
    name: "Keller",
    description: "a blacksmith",
    hints: [
      "Perhaps a source for armaments?"
    ]
  },
  {
    type: "contact",
    playbook: "Bravos",
    name: "Tomas",
    description: "a physicker",
    hints: [
      "Perhaps a former thug turned doctor?"
    ]
  },
  {
    type: "contact",
    playbook: "Bravos",
    name: "Walker",
    description: "a ward boss",
    hints: [
      "Perhaps an employer who often needs violent work?"
    ]
  },
  {
    type: "contact",
    playbook: "Bravos",
    name: "Lutes",
    description: "a tavern owner",
    hints: [
      "Perhaps a good source of news and gossip?"
    ]
  },
  {
    type: "favoredOperation",
    playbook: "Bravos",
    name: "Battle",
    description: "Defeat an enemy with overwhelming force."
  },
  {
    type: "favoredOperation",
    playbook: "Bravos",
    name: "Extortion",
    description: "Threaten violence unless you’re paid off."
  },
  {
    type: "favoredOperation",
    playbook: "Bravos",
    name: "Sabotage",
    description: "Hurt an opponent by destroying something."
  },
  {
    type: "favoredOperation",
    playbook: "Bravos",
    name: "Smash & Grab",
    description: "A fast and violent armed robbery."
  },
  {
    type: "contact",
    playbook: "Cult",
    name: "Gagan",
    description: "an academic"
  },
  {
    type: "contact",
    playbook: "Cult",
    name: "Adikin",
    description: "an occultist"
  },
  {
    type: "contact",
    playbook: "Cult",
    name: "Hutchins",
    description: "an antiquarian"
  },
  {
    type: "contact",
    playbook: "Cult",
    name: "Moriya",
    description: "a spirit trafficker"
  },
  {
    type: "contact",
    playbook: "Cult",
    name: "Mateas Kline",
    description: "a noble"
  },
  {
    type: "contact",
    playbook: "Cult",
    name: "Bennett",
    description: "an astronomer"
  },
  {
    type: "favoredOperation",
    playbook: "Cult",
    name: "Acquisition",
    description: "Procure an arcane artifact and attune it to your god."
  },
  {
    type: "favoredOperation",
    playbook: "Cult",
    name: "Augury",
    description: "Do what you must to attract the god’s attention and counsel."
  },
  {
    type: "favoredOperation",
    playbook: "Cult",
    name: "Consecration",
    description: "Anoint a place for your deity."
  },
  {
    type: "favoredOperation",
    playbook: "Cult",
    name: "Sacrifice",
    description: "Destroy what is valuable or good in honor of your god."
  },
  {
    type: "favoredOperation",
    playbook: "Hawkers",
    name: "Sale",
    description: "A significant transaction with a special buyer of illicit product."
  },
  {
    type: "favoredOperation",
    playbook: "Hawkers",
    name: "Supply",
    description: "A transaction to acquire new product or establish a new supplier."
  },
  {
    type: "favoredOperation",
    playbook: "Hawkers",
    name: "Show of Force",
    description: "Make an example of an enemy to dominate territory."
  },
  {
    type: "favoredOperation",
    playbook: "Hawkers",
    name: "Socialize",
    description: "Improve customer and/or supplier relations with a social event."
  },
  {
    type: "contact",
    playbook: "Hawkers",
    name: "Rolan Wott",
    description: "a magistrate",
    hints: [
      "Perhaps with a feckless son in Doskvol Academy, always in need of rescuing?"
    ]
  },
  {
    type: "contact",
    playbook: "Hawkers",
    name: "Laroze",
    description: "a Bluecoat",
    hints: [
      "Perhaps an informant within the City Watch?"
    ]
  },
  {
    type: "contact",
    playbook: "Hawkers",
    name: "Lydra",
    description: "a deal broker",
    hints: [
      "Perhaps known for her vicious retribution on those who don’t hold up their end?"
    ]
  },
  {
    type: "contact",
    playbook: "Hawkers",
    name: "Hoxley",
    description: "a smuggler",
    hints: [
      "Perhaps a friend of powerful ship captains?"
    ]
  },
  {
    type: "contact",
    playbook: "Hawkers",
    name: "Anya",
    description: "a dilettante",
    hints: [
      "Perhaps a well-connected socialite?"
    ]
  },
  {
    type: "contact",
    playbook: "Hawkers",
    name: "Marlo",
    description: "a gang boss",
    hints: [
      "Perhaps a good partner with a gang of tough thugs?"
    ]
  },
  {
    type: "favoredOperation",
    playbook: "Shadows",
    name: "Burglary",
    description: "Theft by breaking and entering."
  },
  {
    type: "favoredOperation",
    playbook: "Shadows",
    name: "Espionage",
    description: "Obtain secret information by covert or clandestine means."
  },
  {
    type: "favoredOperation",
    playbook: "Shadows",
    name: "Robbery",
    description: "Theft by force or threats."
  },
  {
    type: "favoredOperation",
    playbook: "Shadows",
    name: "Sabotage",
    description: "Hurt an opponent by destroying something."
  },
  {
    type: "contact",
    playbook: "Shadows",
    name: "Dowler",
    description: "an explorer",
    hints: [
      "Perhaps one of the rare deathlands scavengers that survived his sentence?"
    ]
  },
  {
    type: "contact",
    playbook: "Shadows",
    name: "Laroze",
    description: "a Bluecoat",
    hints: [
      "Perhaps an informant within the City Watch?"
    ]
  },
  {
    type: "contact",
    playbook: "Shadows",
    name: "Amancio",
    description: "a deal broker",
    hints: [
      "Perhaps a well-connected underworld figure, famous for their neutrality?"
    ]
  },
  {
    type: "contact",
    playbook: "Shadows",
    name: "Fitz",
    description: "a collector",
    hints: [
      "Perhaps an aficionado of strange artifacts?"
    ]
  },
  {
    type: "contact",
    playbook: "Shadows",
    name: "Adelaide Phroaig",
    description: "a noble",
    hints: [
      "Perhaps a source for scores among the elite?"
    ]
  },
  {
    type: "contact",
    playbook: "Shadows",
    name: "Rigney",
    description: "a tavern owner",
    hints: [
      "Perhaps a good source of news and gossip?"
    ]
  },
  {
    type: "favoredOperation",
    playbook: "Smugglers",
    name: "Arcane/Weird",
    description: "Spirit essences, ghosts, cult materials."
  },
  {
    type: "favoredOperation",
    playbook: "Smugglers",
    name: "Arms",
    description: "Restricted military weapons, heavy ordnance, explosives."
  },
  {
    type: "favoredOperation",
    playbook: "Smugglers",
    name: "Contraband",
    description: "High-tax luxuries, drugs, banned art, etc."
  },
  {
    type: "favoredOperation",
    playbook: "Smugglers",
    name: "Passengers",
    description: "People or livestock traveling in secret."
  },
  {
    type: "contact",
    playbook: "Smugglers",
    name: "Elynn",
    description: "a dock worker",
    hints: [
      "Perhaps a friend who can help with the infernal paperwork of the Empire?"
    ]
  },
  {
    type: "contact",
    playbook: "Smugglers",
    name: "Rolan",
    description: "a drug dealer",
    hints: [
      "Perhaps a client with strong underworld ties?"
    ]
  },
  {
    type: "contact",
    playbook: "Smugglers",
    name: "Sera",
    description: "an arms dealer",
    hints: [
      "Perhaps a supplier with military access?"
    ]
  },
  {
    type: "contact",
    playbook: "Smugglers",
    name: "Nyelle",
    description: "a spirit trafficker",
    hints: [
      "Perhaps a supplier for the strangest of cargo?"
    ]
  },
  {
    type: "contact",
    playbook: "Smugglers",
    name: "Decker",
    description: "an anarchist",
    hints: [
      "Perhaps a client in need of the illegal tools of revolution?"
    ]
  },
  {
    type: "contact",
    playbook: "Smugglers",
    name: "Esme",
    description: "a tavern owner",
    hints: [
      "Perhaps a good source of news and gossip?"
    ]
  },
  {
    type: "claim",
    playbook: "Cult",
    name: "Ancient Altar",
    rules: "You get +1d to the engagement roll for occult plans.",
    flavor: "Its blessing is with you."
  },
  {
    type: "claim",
    playbook: "Cult",
    name: "Ancient Gate",
    rules: "Safe passage in the deathlands. When you leave the city through this gate, the spirits of the deathlands will not molest you unless directly provoked.",
    flavor: ""
  },
  {
    type: "claim",
    playbook: "Cult",
    name: "Ancient Obelisk",
    rules: "-1 stress cost for all arcane powers and rituals. This effect applies to all cultists, everywhere—so long as the deity is well-pleased. You don’t have to be on-site at the obelisk to benefit from its power.",
    flavor: ""
  },
  {
    type: "claim",
    playbook: "Cult",
    name: "Ancient Tower",
    rules: "You get +1d to Consort with arcane entities on-site.",
    flavor: "This tower was prepared by sorcery from the pre-cataclysm and acts as an arcane lens to focus eldritch energy across the black mirror into the void."
  },
  {
    type: "claim",
    playbook: "Cult",
    name: "Cloister",
    rules: "Your Adept cohorts get +1 scale.",
    flavor: "More room for hopeful novices desperate to pledge their service."
  },
  {
    type: "claim",
    playbook: "Cult",
    name: "Offertory",
    rules: "You get +2 coin in your payoff for scores that involve occult operations.",
    flavor: "The frightened locals offer you tribute when you perform your dark practices. They don’t want to be next."
  },
  {
    type: "claim",
    playbook: "Cult",
    name: "Sanctuary",
    rules: "+1d to Command and Sway rolls on-site. Your sanctuary maintains its effect as long as your deity is well-pleased with your service.",
    flavor: ""
  },
  {
    type: "claim",
    playbook: "Cult",
    name: "Spirit Well",
    rules: "You get +1d to Attune rolls on-site.",
    flavor: "A spirit well draws ghosts and other things to its power, which you harness to aid your arts."
  },
  {
    type: "claim",
    playbook: "Cult",
    name: "Sacred Nexus",
    rules: "You get +1d to healing treatment rolls.",
    flavor: "Ancient arcane energy seeps into the wounded here, speeding their recovery, and marking them consecrated by its power."
  },
  {
    type: "claim",
    playbook: "Cult",
    name: "Vice Den",
    rules: "Any time during downtime, roll dice equal to your Tier. You earn coin equal to the highest result, minus your heat.",
    flavor: ""
  },
  {
    type: "claim",
    playbook: "Bravos",
    name: "Barracks",
    rules: "Your Thug cohorts get +1 scale.",
    flavor: "Extra room means more gang members."
  },
  {
    type: "claim",
    playbook: "Bravos",
    name: "Bluecoat Confederates",
    rules: "You get +1d to the engagement roll for assault plans.",
    flavor: "The street patrol around here helps you out now."
  },
  {
    type: "claim",
    playbook: "Bravos",
    name: "Bluecoat Intimidation",
    rules: "You get -2 heat per score.",
    flavor: "The law doesn’t want any trouble from you; they look the other way."
  },
  {
    type: "claim",
    playbook: "Bravos",
    name: "Fighting Pits",
    rules: "During downtime, roll dice equal to your Tier. You earn coin equal to the highest result, minus your heat.",
    flavor: "The locals love to gamble away their hard-won coin on the bloodsports you host."
  },
  {
    type: "claim",
    playbook: "Bravos",
    name: "Infirmary",
    rules: "You get +1d to healing treatment rolls. The infirmary also has beds for long-term convalescence.",
    flavor: ""
  },
  {
    type: "claim",
    playbook: "Bravos",
    name: "Informants",
    rules: "You get +1d to gather information for a score.",
    flavor: "Your eyes and ears on the streets are always on the lookout for new targets."
  },
  {
    type: "claim",
    playbook: "Bravos",
    name: "Protection Racket",
    rules: "Any time during downtime, roll dice equal to your Tier. You earn coin equal to the highest result, minus your heat.",
    flavor: "Some of the locals are terrified of you and will gladly pay for “protection.”"
  },
  {
    type: "claim",
    playbook: "Bravos",
    name: "Street Fence",
    rules: "You get +2 coin in your payoff for scores that involve lower-class targets.",
    flavor: "An expert can find the treasure amid the trash you loot from your poorer victims."
  },
  {
    type: "claim",
    playbook: "Bravos",
    name: "Terrorized Citizens",
    rules: "You get +2 coin in your payoff for scores that involve battle or extortion.",
    flavor: "The frightened locals offer you tribute whenever you lash out. They don’t want to be next."
  },
  {
    type: "claim",
    playbook: "Bravos",
    name: "Warehouses",
    rules: "You get +1d to acquire asset rolls.",
    flavor: "You have space to hold all the various spoils you end up with after your battles. It can be useful on its own or for barter when you need it."
  },
  {
    type: "claim",
    playbook: "Hawkers",
    name: "Cover Identities",
    rules: "You get +1d to the engagement roll for deception and social plans.",
    flavor: "False identities help confuse the opposition."
  },
  {
    type: "claim",
    playbook: "Hawkers",
    name: "Cover Operation",
    rules: "You get -2 heat per score.",
    flavor: "The cover of a legitimate operation helps deflect some of the heat from law enforcement."
  },
  {
    type: "claim",
    playbook: "Hawkers",
    name: "Foreign Market",
    rules: "Any time during downtime, roll dice equal to your Tier. You earn coin equal to the highest result, minus your heat.",
    flavor: "Some of your product makes its way out of the city."
  },
  {
    type: "claim",
    playbook: "Hawkers",
    name: "Informants",
    rules: "You get +1d to gather information for a score.",
    flavor: "Your eyes and ears on the streets are always on the lookout for new clients."
  },
  {
    type: "claim",
    playbook: "Hawkers",
    name: "Local Graft",
    rules: "You get +2 coin in payoff for scores that involve a show of force or socializing.",
    flavor: "A few city officials share bribe money with those who show that they’re players on the scene."
  },
  {
    type: "claim",
    playbook: "Hawkers",
    name: "Lookouts",
    rules: "You get +1d to Hunt or Survey on your turf.",
    flavor: ""
  },
  {
    type: "claim",
    playbook: "Hawkers",
    name: "Luxury Venue",
    rules: "+1d to Consort and Sway rolls on-site.",
    flavor: "Silks, paintings, and crystal impress the clientele."
  },
  {
    type: "claim",
    playbook: "Hawkers",
    name: "Personal Clothier",
    rules: "You get +1d to the engagement roll for social plans.",
    flavor: "You always arrive on the scene in the most current and alluring fashion."
  },
  {
    type: "claim",
    playbook: "Hawkers",
    name: "Surplus Cache",
    rules: "You get +2 coin in payoff for scores that involve product sale or supply.",
    flavor: "You have an abundance of product, which pads your pockets every now and then."
  },
  {
    type: "claim",
    playbook: "Hawkers",
    name: "Vice Den",
    rules: "Any time during downtime, roll dice equal to your Tier. You earn coin equal to the highest result, minus your heat.",
    flavor: "Is this claim a den you’ve overtaken from another purveyor, or a new establishment replacing something else?"
  },
  {
    type: "claim",
    playbook: "Shadows",
    name: "Covert Drop",
    rules: "You get +2 coin in payoff for scores that involve espionage or sabotage.",
    flavor: "The perfect hidden exchange point is worth the extra coin to discerning clientele."
  },
  {
    type: "claim",
    playbook: "Shadows",
    name: "Drug Den",
    rules: "Any time during downtime, roll dice equal to your Tier. You earn coin equal to the highest result, minus your heat.",
    flavor: "What’s the drug of choice?"
  },
  {
    type: "claim",
    playbook: "Shadows",
    name: "Gambling Den",
    rules: "Any time during downtime, roll dice equal to your Tier. You earn coin equal to the highest result, minus your heat.",
    flavor: "Cards, dice, or something more unusual on offer?"
  },
  {
    type: "claim",
    playbook: "Shadows",
    name: "Hagfish Farm",
    rules: "When you use the reduce heat downtime activity after a score that involves killing, you get +1d to the roll and quiet, convenient disposal of any corpses you left on the job.",
    flavor: ""
  },
  {
    type: "claim",
    playbook: "Shadows",
    name: "Infirmary",
    rules: "You get +1d to healing treatment rolls. The infirmary also has beds for long-term convalescence.",
    flavor: ""
  },
  {
    type: "claim",
    playbook: "Shadows",
    name: "Informants",
    rules: "You get +1d to gather information for a score.",
    flavor: "Your eyes and ears on the streets are always on the lookout for new targets."
  },
  {
    type: "claim",
    playbook: "Shadows",
    name: "Interrogation Chamber",
    rules: "You get +1d to Command and Sway on-site.",
    flavor: "Grisly business, but effective."
  },
  {
    type: "claim",
    playbook: "Shadows",
    name: "Lookouts",
    rules: "You get +1d to Hunt or Survey on your turf.",
    flavor: ""
  },
  {
    type: "claim",
    playbook: "Shadows",
    name: "Loyal Fence",
    rules: "You get +2 coin in payoff for scores that involve burglary or robbery.",
    flavor: "It requires a skilled eye and good contacts to move stolen goods."
  },
  {
    type: "claim",
    playbook: "Shadows",
    name: "Secret Pathways",
    rules: "You get +1d to the engagement roll for stealth plans.",
    flavor: "You might have access to long-forgotten underground canals, rooftop walkways, or some other route of your choosing."
  },
  {
    type: "claim",
    playbook: "Shadows",
    name: "Tavern",
    rules: "You get +1d to Consort and Sway rolls on-site.",
    flavor: "Some booze and friendly conversation can go a long way."
  },
  {
    type: "claim",
    playbook: "Smugglers",
    name: "Ancient Gate",
    rules: "Safe passage in the deathlands.",
    flavor: "When you leave the city through this gate, spirits in the deathlands will not molest you unless directly provoked."
  },
  {
    type: "claim",
    playbook: "Smugglers",
    name: "Cover Operation",
    rules: "You get -2 heat per score.",
    flavor: "What’s your cover? Who did you seize it from?"
  },
  {
    type: "claim",
    playbook: "Smugglers",
    name: "Fleet",
    rules: "Your cohorts have their own vehicles. Each cohort has a common vehicle, with quality equal to your Tier.",
    flavor: ""
  },
  {
    type: "claim",
    playbook: "Smugglers",
    name: "Informants",
    rules: "You get +1d to gather information for a score.",
    flavor: "Your eyes and ears on the streets are always on the lookout for new clients."
  },
  {
    type: "claim",
    playbook: "Smugglers",
    name: "Luxury Fence",
    rules: "You get +2 coin in payoff for scores that involve high-class targets.",
    flavor: "It requires a skilled eye and good contacts to move hot luxury goods."
  },
  {
    type: "claim",
    playbook: "Smugglers",
    name: "Secret Routes",
    rules: "You get +1d to the engagement roll for transport plans.",
    flavor: "You might have access to long-forgotten underground canals, dark streets normally hidden behind debris, or some other route of your choosing."
  },
  {
    type: "claim",
    playbook: "Smugglers",
    name: "Side Business",
    rules: "Any time during downtime, roll dice equal to your Tier. You earn coin equal to the highest result, minus your heat.",
    flavor: "What kind of legitimate business is this? How do you get paid in secret?"
  },
  {
    type: "claim",
    playbook: "Smugglers",
    name: "Tavern",
    rules: "You get +1d to Consort and Sway rolls on-site.",
    flavor: "Some booze and friendly conversation can go a long way."
  },
  {
    type: "claim",
    playbook: "Smugglers",
    name: "Vice Den",
    rules: "Any time during downtime, roll dice equal to your Tier. You earn coin equal to the highest result, minus your heat.",
    flavor: "Perhaps you sell some of the contraband you smuggle here? Or do you not mix your operations?"
  },
  {
    type: "claim",
    playbook: "Smugglers",
    name: "Warehouses",
    rules: "You get +1d to acquire asset rolls.",
    flavor: "You have space to hold all the various items and supplies you end up with from your smuggling runs. They can be useful on their own or for barter when you need it."
  }
];

const {claim, favoredOperation, contact} = U.group(crewObjects, "type");

export const UpdateClaims = async () => {
  const errorReport: string[] = [];
  const playbookUpdateData: Partial<Record<Playbook,Record<string, any>>> = {};
  claim.forEach((cl) => {
    const playbookObj = game.items.getName(cl.playbook);
    if (!playbookObj || playbookObj.type !== BladesItemType.crew_playbook) {
      errorReport.push(`Claim ${cl.name} has invalid playbook ${cl.playbook}`);
      return;
    }
    const [turfNum] = Object.entries(playbookObj.system.turfs ?? {}).find(([tNum, tData]: [string, any]) => tData.name === cl.name) ?? [];
    if (!turfNum) {
      errorReport.push(`Claim ${cl.name} has invalid turf name ${cl.name} for playbook ${cl.playbook}`);
      return;
    }
    playbookUpdateData[playbookObj.name as Playbook] ??= {};

    playbookUpdateData[playbookObj.name as Playbook]![`system.turfs.${turfNum}.description`] = cl.rules;
    if (cl.flavor) {
      playbookUpdateData[playbookObj.name as Playbook]![`system.turfs.${turfNum}.flavor`] = cl.flavor;
    }
  });

  Object.entries(playbookUpdateData).forEach(async ([playbook, data]) => {
    game.items.getName(playbook)
      ?.update(data)
      .then((item) => item?.addTag(playbook));
  });
};

export const UpdateOps = async () => {
  const errorReport: string[] = [];
  favoredOperation.forEach((op) => {
    const playbookObj = game.items.getName(op.playbook);
    if (!playbookObj || playbookObj.type !== BladesItemType.crew_playbook) {
      errorReport.push(`Favored Op ${op.name} has invalid playbook ${op.playbook}`);
      return;
    }
    BladesItem.create({
      name: op.name,
      type: BladesItemType.preferred_op,
      img: playbookObj.img,
      system: {
        description: op.description
      }
    }).then((item) => (<BladesItem>item)?.addTag(playbookObj.name as Playbook));
  });
};

export const UpdateContacts = async () => {
  const errorReport: string[] = [];
  contact.forEach((ct) => {
    const playbookObj = game.items.getName(ct.playbook);
    if (!playbookObj || playbookObj.type !== BladesItemType.crew_playbook) {
      errorReport.push(`Contact ${ct.name} has invalid playbook ${ct.playbook}`);
      return;
    }
    BladesActor.create({
      name: ct.name,
      type: BladesActorType.npc,
      system: {
        description: ct.description,
        prompts: ct.hints?.join(" ")
      } as Partial<BladesActorSystem>
    }).then((actor) => (<BladesActor>actor)?.addTag(playbookObj.name as Playbook));
  });
};
