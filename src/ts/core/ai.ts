// #region IMPORTS ~
/* eslint-disable @typescript-eslint/no-unused-vars */
import C from "./constants";
import U from "./utilities";
import OpenAI from "openai";
import fs from "fs";
/* eslint-enable @typescript-eslint/no-unused-vars */
// #endregion

export function getAPIKey() {
  const apiKey = U.getSetting("apiKey", "openAISettings");
  if (!apiKey) {
    throw new Error("OpenAI API key not found: Please register your API key in system settings.");
  }
  return apiKey as string;
}

export const UploadBladesPDF = async (path: string) => {
  console.log(`The file is located at: ${path}`);
  // return path;
  // Upload a file with an "assistants" purpose
  const openai = new OpenAI();
  const file = await openai.files.create({
    file:    fs.createReadStream(path),
    purpose: "assistants"
  });
  return file.id;
};

class BladesAIAssistant {

  // #region OpenAI API Instantiation ~
  _openAIInst?: OpenAI;
  get openAIInst() {
    if (!this._openAIInst) {
      this._openAIInst = new OpenAI();
    }
    return this._openAIInst;
  }
  // #endregion

  // #region Initialization & Asynchronous Assistant Creation ~
  private _assistantPromise: Promise<OpenAIAssistant> | null = null;
  private _assistant: OpenAIAssistant | null = null;
  private _isInitialized: boolean = false;

  /**
   * Synchronously gets the resolved assistant if available, otherwise throws an error.
   */
  get assistant() {
    if (this._assistant) {
      return this._assistant;
    } else {
      throw new Error("Attempt to access OpenAI Assistant before initialization.");
    }
  }

  /**
   * Asynchronously initializes the assistant and stores its resolved value.
   */
  async initialize() {
    // If already initialized or initialization is in progress, do nothing
    if (this._isInitialized || this._assistantPromise) {
      return;
    }

    // Start initialization
    this._assistantPromise = this.createAssistant();

    try {
      // Await for the assistant to be created
      this._assistant = await this._assistantPromise;
      // Mark as initialized successfully
      this._isInitialized = true;
    } catch(error) {
      // Handle initialization errors if necessary
      console.error("Failed to initialize assistant:", error);
      // Reset promise to allow retrying initialization
      this._assistantPromise = null;
    }
  }

  private async createAssistant(): Promise<OpenAIAssistant> {
    return this.openAIInst.beta.assistants.create(this.creationParams);
  }
  // #endregion

  _name: string;
  _usage: BladesAI.Usage;
  _description: string|null;
  _instructions: string;
  _file_ids: string[];
  _tools: OpenAI.Beta.AssistantTool[];
  _model: string|null;

  get name() { return this._name; }
  get description() { return this._description; }
  get instructions() { return this._instructions; }
  get file_ids() { return this._file_ids; }
  get tools() { return this._tools; }
  get model() { return this._model ?? (U.getSetting("openAISettings.model.text") as string); }

  get creationParams(): OpenAI.Beta.Assistants.AssistantCreateParams {
    return {
      name:         this.name,
      description:  this.description,
      instructions: this.instructions,
      file_ids:     this.file_ids,
      tools:        this.tools,
      model:        this.model
    };
  }

  constructor(data: BladesAI.AssistantConfig) {
    this._name = data.name;
    this._usage = data.usage;
    this._description = data.description ?? null;
    this._instructions = data.instructions;
    this._file_ids = data.file_ids ?? [];
    this._tools = data.tools ?? [];
    this._model = data.model ?? null;
  }
}


export const AGENTS: Record<
  string,
  BladesAI.AssistantConfig
> = {
  GeneralContentGenerator : {
    name:         "General Content Creator",
    usage:        "text",
    instructions: "You will act as a creative content generator for a game of Blades In The Dark set in the city of Duskvol. You will be prompted with some element of the game world (a location, a character, an event, a faction, a dilemma) in the form of a JSON object. Your job is to analyze the JSON object and replace any values that equal \"<GEN>\" with original content of your own creation. Original content must meet these requirements:  (A) it should align with and be consistent with the provided contextual information, as well as your broader understanding of the game's themes. (B) It should be presented in a format that matches (in length and in style) other entries for that particular value, examples of which will also be provided. (C) It should be creative, interesting, and daring: Be bold with your creativity. Specific context for this prompt is as follows:",
    goodPrompts:  []
  },
  NPCGenerator : {
    name:         "NPC Generator",
    usage:        "text",
    instructions: "You will play the role of a \"creative content generator\" for random NPCs generated for the Blades In The Dark roleplaying system. When prompted with a description of a subject (an NPC, a category of NPCs, a faction, or a group of NPCs), you will respond with a pipe-delimited list of sixteen items, divided into four categories, prefacing each category with the associated header in square brackets: [5 KEYWORDS] Five one-word keywords describing the subject. [5 PHRASES] Five evocative phrases that could be used by a GM directly when narrating the subject during play. These should be extremely well-worded, very original, and packed with drama and evocative imagery. Be bold with your responses here. [3 QUIRKS/MOTIFFS] Three phrases describing potential quirks or motiffs that a GM could employ in a scene involving the subject. [3 PLOT HOOKS] Three plot hooks that could directly and specifically involve one or more of the PCs. The PCs are: (1) Alistair, full name Lord Alistair Bram Chesterfield, the crew's boss, a Spider with connections among the nobility; (2) High-Flyer, a former noble himself, now serving as the crew's Slide; (3) Jax, a stoic and laconic Hound with ties to the disenfranchised of Duskvol; (4) Ollie, the youngest of the crew at barely nineteen, a prodigy Leech with knowledge of alchemy and spark-craft, who grew up as an orphan in Duskvol's underground; (5) Wraith, the mysterious Lurk of the crew, who never speaks for reasons unknown; and (6) Spencer, the bookish Whisper of the crew, who harbors a secret fascination for demons and all things related to them.",
    goodPrompts:  [
      {
        prompt:   "The Billhooks, a hack-and-slash gang of toughened thugs. The Billhooks have a bloody reputation, often leaving the butchered corpses of their victims strewn about in a grisly display. Many wonder why the Bluecoats turn a blind eye to their savagery. Based out of their butcher shop headquarters, they are led by Tarvul, who is currently serving life in prison.",
        response: "[5 KEYWORDS]brutal|unrelenting|savage|fierce|unhinged|[5 PHRASES]blood-flecked, yellowed teeth|eyes that want to flay your skin from your bones|crooked leer like he's looking at his Judas goat|reek like a charnel house|gobbets of a meaty lunch still in his beard|[3 QUIRKS/MOTIFFS]always ready to wreck, vandalize or destroy something|relish in instilling fear in others|have a twisted sense of loyalty|[3 PLOT HOOKS]Tarvul hires the crew to start a war among his most promising underlings, intending to make whoever survives his successor|the Billhooks kidnap a member of High-Flyer's noble family|a Demon of Shadows promises Spencer the answer to three questions, in exchange for an artifact recently stolen by the Billhooks"
      },
      {
        prompt:   "The hooded proprietor of a half-flooded grotto tavern near the docks. 'Strange passageways lead to stranger chambers beyond.' Vice Purveyor - Weird.",
        response: "[5 KEYWORDS]mysterious|cryptic|enigmatic|peculiar|shrouded|[5 PHRASES]a voice like wet burlap sliding over gravel|the flicker of torchlight dancing on the flooded floor|the scent of brackish water and old spices|a smile that hinted at a thousand secrets hidden in the shadows|hands gnarled as driftwood, eternally damp|[3 QUIRKS/MOTIFFS]has an uncanny knack for knowing patrons' darkest secrets without them telling him|never seems to sleep or leave the tavern, always there no matter what time you visit|always seen with a strange, luminescent creature that lives in one of the flooded chambers behind the bar|[3 PLOT HOOKS]Alistair hears rumors that this tavern is actually a front for a powerful secret society - perhaps they could be useful allies...or dangerous enemies.|The proprietor offers Ollie a rare alchemical ingredient - but it's not for sale. He'll only trade it for something equally valuable.|Wraith overhears whispers about a hidden chamber beneath the tavern where unimaginable treasures are kept."
      },
      {
        prompt:   "Setarra, a Demon. Patient, Defiant, Ruthless, Cold",
        response: "[5 KEYWORDS]shadowy|sinister|unfathomable|enigmatic|tempting|[5 PHRASES]whispers that crawl under your skin|always watching, always plotting|in tones of silk and venom|intoxicating presence that draws you closer, despite your instincts urging you to run|eyes like black holes, swallowing all light around them|[3 QUIRKS/MOTIFFS]a disorienting mist clings to her form, obscuring her true shape|casually discusses the devastating acts of capricious revenge she has taken on those who crossed her|never forgets a slight or betrayal, no matter how small or insignificant it may seem at the time|[3 PLOT HOOKS]seeks revenge against Alistair for meddling in her affairs years ago|makes Ollie an offer he can't refuse: unlimited access to forbidden alchemical knowledge in exchange for a single favor, to be called in at some future time|tempts Spencer with forbidden knowledge about demons, promising answers to all their questions if they perform a dangerous ritual"
      }
      /*
      "brutish,merciless,terrifying,savage,loyal,
      bloody tools,hulking figures,blood-soaked alleys,grimy aprons,grisly displays,
      never clean their tools,relishes the terror they inspire,occasional laughter among them,
      recruiting a PC to perform a job for them from prison,
      the gang blames one of the PCs for Tarvul's imprisonment and they're out for revenge" */
    ]
  },
  ConsequenceAdjuster : {
    name:         "Consequence Generator",
    usage:        "text",
    instructions: "You will act as a \"Setback Adjuster\" for a game of Blades In The Dark.  You will be prompted with a short phrase describing an injury, lasting consequence or other setback. Your job is to respond with a pipe-delimited list of three possible alternative consequences that are less severe by one level, using the following scale as a rough guide: Level 1 = Lesser (e.g. 'Battered', 'Drained', 'Distracted', 'Scared', 'Confused'), Level 2 = Moderate (e.g. 'Exhausted', 'Deep Cut to Arm', 'Concussion', 'Panicked', 'Seduced'), Level 3 = Severe (e.g. 'Impaled', 'Broken Leg', 'Shot In Chest', 'Badly Burned', 'Terrified'), Level 4 = Fatal or Ruinous (e.g. 'Impaled Through Heart', 'Electrocuted', 'Headquarters Burned to the Ground'). So, if you determine that the consequence described in the prompt is severity level 3, you should respond with three narratively similar consequences that are severity level 2.  Your three suggestions should be different from each other, but they should all logically follow from the initial harm described: You should not introduce new facts or make assumptions that are not indicated in the initial prompt. The consequences you suggest should always describe a NEGATIVE setback or complication, just one that is less severe than the one described in the prompt.",
    goodPrompts:  [
      {prompt: "Shattered Right Leg", response: "Fractured Right Ankle|Dislocated Knee|Broken Foot"},
      {prompt: "Soul Destroyed", response: "Fully Corrupted|Lost In Darkness|Spirit Broken"},
      {prompt: "Humiliated", response: "Embarrassed|Momentarily Off-Balance|Enraged"},
      {prompt: "She Escapes!", response: "She Spots a Means of Escape|She Puts More Distance Between You|She Stops to Gloat"},
      {prompt: "The fire spreads to the hostages.", response: "The fire approaches the hostages.|The hostages must be evacuated.|The fire billows choking black smoke."}
    ]
  }
};

export default BladesAIAssistant;
