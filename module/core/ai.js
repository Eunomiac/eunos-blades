import C from "./constants.js";
import U from "./utilities.js";
export var OpenAITool;
(function (OpenAITool) {
    OpenAITool["code_interpreter"] = "code_interpreter";
    OpenAITool["retrieval"] = "retrieval";
    OpenAITool["function"] = "function";
})(OpenAITool || (OpenAITool = {}));
export var OpenAIModel;
(function (OpenAIModel) {
    OpenAIModel["ada"] = "ada";
    OpenAIModel["ada-code-search-code"] = "ada-code-search-code";
    OpenAIModel["ada-code-search-text"] = "ada-code-search-text";
    OpenAIModel["ada-search-document"] = "ada-search-document";
    OpenAIModel["ada-search-query"] = "ada-search-query";
    OpenAIModel["ada-similarity"] = "ada-similarity";
    OpenAIModel["babbage"] = "babbage";
    OpenAIModel["babbage-002"] = "babbage-002";
    OpenAIModel["babbage-code-search-code"] = "babbage-code-search-code";
    OpenAIModel["babbage-code-search-text"] = "babbage-code-search-text";
    OpenAIModel["babbage-search-document"] = "babbage-search-document";
    OpenAIModel["babbage-search-query"] = "babbage-search-query";
    OpenAIModel["babbage-similarity"] = "babbage-similarity";
    OpenAIModel["canary-tts"] = "canary-tts";
    OpenAIModel["canary-whisper"] = "canary-whisper";
    OpenAIModel["code-davinci-edit-001"] = "code-davinci-edit-001";
    OpenAIModel["code-search-ada-code-001"] = "code-search-ada-code-001";
    OpenAIModel["code-search-ada-text-001"] = "code-search-ada-text-001";
    OpenAIModel["code-search-babbage-code-001"] = "code-search-babbage-code-001";
    OpenAIModel["code-search-babbage-text-001"] = "code-search-babbage-text-001";
    OpenAIModel["curie"] = "curie";
    OpenAIModel["curie-instruct-beta"] = "curie-instruct-beta";
    OpenAIModel["curie-search-document"] = "curie-search-document";
    OpenAIModel["curie-search-query"] = "curie-search-query";
    OpenAIModel["curie-similarity"] = "curie-similarity";
    OpenAIModel["dall-e-2"] = "dall-e-2";
    OpenAIModel["davinci"] = "davinci";
    OpenAIModel["davinci-002"] = "davinci-002";
    OpenAIModel["davinci-instruct-beta"] = "davinci-instruct-beta";
    OpenAIModel["davinci-search-document"] = "davinci-search-document";
    OpenAIModel["davinci-search-query"] = "davinci-search-query";
    OpenAIModel["davinci-similarity"] = "davinci-similarity";
    OpenAIModel["gpt-3.5-turbo"] = "gpt-3.5-turbo";
    OpenAIModel["gpt-3.5-turbo-0301"] = "gpt-3.5-turbo-0301";
    OpenAIModel["gpt-3.5-turbo-0613"] = "gpt-3.5-turbo-0613";
    OpenAIModel["gpt-3.5-turbo-1106"] = "gpt-3.5-turbo-1106";
    OpenAIModel["gpt-3.5-turbo-16k"] = "gpt-3.5-turbo-16k";
    OpenAIModel["gpt-3.5-turbo-16k-0613"] = "gpt-3.5-turbo-16k-0613";
    OpenAIModel["gpt-3.5-turbo-instruct"] = "gpt-3.5-turbo-instruct";
    OpenAIModel["gpt-3.5-turbo-instruct-0914"] = "gpt-3.5-turbo-instruct-0914";
    OpenAIModel["gpt-4"] = "gpt-4";
    OpenAIModel["gpt-4-0314"] = "gpt-4-0314";
    OpenAIModel["gpt-4-0613"] = "gpt-4-0613";
    OpenAIModel["gpt-4-1106-preview"] = "gpt-4-1106-preview";
    OpenAIModel["gpt-4-vision-preview"] = "gpt-4-vision-preview";
    OpenAIModel["text-ada-001"] = "text-ada-001";
    OpenAIModel["text-babbage-001"] = "text-babbage-001";
    OpenAIModel["text-curie-001"] = "text-curie-001";
    OpenAIModel["text-davinci-001"] = "text-davinci-001";
    OpenAIModel["text-davinci-002"] = "text-davinci-002";
    OpenAIModel["text-davinci-003"] = "text-davinci-003";
    OpenAIModel["text-davinci-edit-001"] = "text-davinci-edit-001";
    OpenAIModel["text-embedding-ada-002"] = "text-embedding-ada-002";
    OpenAIModel["text-search-ada-doc-001"] = "text-search-ada-doc-001";
    OpenAIModel["text-search-ada-query-001"] = "text-search-ada-query-001";
    OpenAIModel["text-search-babbage-doc-001"] = "text-search-babbage-doc-001";
    OpenAIModel["text-search-babbage-query-001"] = "text-search-babbage-query-001";
    OpenAIModel["text-search-curie-doc-001"] = "text-search-curie-doc-001";
    OpenAIModel["text-search-curie-query-001"] = "text-search-curie-query-001";
    OpenAIModel["text-search-davinci-doc-001"] = "text-search-davinci-doc-001";
    OpenAIModel["text-search-davinci-query-001"] = "text-search-davinci-query-001";
    OpenAIModel["text-similarity-ada-001"] = "text-similarity-ada-001";
    OpenAIModel["text-similarity-babbage-001"] = "text-similarity-babbage-001";
    OpenAIModel["text-similarity-curie-001"] = "text-similarity-curie-001";
    OpenAIModel["text-similarity-davinci-001"] = "text-similarity-davinci-001";
    OpenAIModel["tts-1"] = "tts-1";
    OpenAIModel["tts-1-1106"] = "tts-1-1106";
    OpenAIModel["tts-1-hd"] = "tts-1-hd";
    OpenAIModel["tts-1-hd-1106"] = "tts-1-hd-1106";
    OpenAIModel["whisper-1"] = "whisper-1";
})(OpenAIModel || (OpenAIModel = {}));
class AIAssistant {
    #apiKey;
    #id;
    #name;
    get name() { return this.#name; }
    #instructions;
    #tools;
    #model;
    #fileIDs;
    #metadata;
    constructor(nameOrID, instructions, model = OpenAIModel["gpt-4-1106-preview"], { isUsingRetrieval, functionTools, file_ids, metadata } = {}) {
        // Initialize private properties so TypeScript doesn't yell at me.
        this.#id = "";
        this.#name = "";
        this.#instructions = instructions ?? "";
        this.#tools = [];
        this.#model = model;
        this.#fileIDs = file_ids ?? [];
        this.#metadata = metadata ?? {};
        // Retrieve API key
        const apiKey = U.getSetting("openAPIKey");
        if (!apiKey) {
            throw new Error("API Key required in Settings to use AI features.");
        }
        this.#apiKey = apiKey;
        // If instructions sent, we're creating a new Assistant.
        if (instructions) {
            this.#name = nameOrID;
            if (isUsingRetrieval) {
                this.#tools.push({ type: "retrieval" });
            }
            if (functionTools && functionTools.length) {
                this.#tools.push(...functionTools);
            }
            this.createAssistant();
        }
        else {
            // Otherwise, assume an ID was passed, and fetch the existing assistant.
            this.#id = nameOrID;
            this.retrieveAssistant();
        }
    }
    async createAssistant() {
        // curl https://api.openai.com/v1/assistants \
        // -H "Content-Type: application/json" \
        // -H "Authorization: Bearer $OPENAI_API_KEY" \
        // -H "OpenAI-Beta: assistants=v1" \
        // -d '{
        //   "instructions": "You are an HR bot, and you have access to files to answer employee questions about company policies.",
        //   "tools": [{"type": "retrieval"}],
        //   "model": "gpt-4",
        //   "file_ids": ["file-abc123"]
        // }'
        const fetchRequest = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${this.#apiKey}`,
                "OpenAI-Beta": "assistants=v1"
            },
            body: JSON.stringify({
                name: this.#name,
                instructions: this.#instructions,
                tools: this.#tools,
                model: this.#model,
                file_ids: this.#fileIDs
            })
        };
        eLog.checkLog3("BladesAssistant", "Fetch Request", fetchRequest);
        // Send a POST request to the OpenAI API
        const response = await fetch("https://api.openai.com/v1/assistants", fetchRequest);
        // Check if the response status is not 200 (OK)
        if (!response.ok) {
            console.log("Failed AI Request:", JSON.parse(fetchRequest.body));
            // Throw an error with the status code
            throw new Error(`OpenAI API request failed with status ${response.status}`);
        }
        // Parse the response body as JSON
        const data = await response.json();
        fetchRequest.body = JSON.parse(fetchRequest.body);
        eLog.checkLog3("BladesAI", "AI Query", { prompt: fetchRequest, response: data });
        this.#id = data.id;
    }
    async retrieveAssistant() {
        //   curl https://api.openai.com/v1/assistants/asst_abc123 \
        // -H "Content-Type: application/json" \
        // -H "Authorization: Bearer $OPENAI_API_KEY" \
        // -H "OpenAI-Beta: assistants=v1"
        const fetchRequest = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${this.#apiKey}`,
                "OpenAI-Beta": "assistants=v1"
            }
        };
        // Send a POST request to the OpenAI API
        const response = await fetch(`https://api.openai.com/v1/assistants/${this.#id}`, fetchRequest);
        // Check if the response status is not 200 (OK)
        if (!response.ok) {
            // Throw an error with the status code
            throw new Error(`OpenAI API request failed with status ${response.status}`);
        }
        // Parse the response body as JSON
        const data = await response.json();
        eLog.checkLog3("BladesAI", "AI Query", { prompt: fetchRequest, response: data });
        this.#name = data.name;
        this.#instructions = data.instructions;
        this.#tools = data.tools;
        this.#model = data.model;
        this.#fileIDs = data.file_ids;
        this.#metadata = data.metadata;
    }
}
/**
 * AI class for querying OpenAI API
 */
class BladesAI {
    static async GetModels(isVerbose = false) {
        const apiKey = U.getSetting("openAPIKey");
        if (!apiKey) {
            throw new Error("You must configure your OpenAI API Key in Settings to use AI features.");
        }
        const fetchRequest = {
            method: "GET",
            headers: {
                Authorization: `Bearer ${apiKey}`
            }
        };
        // Send a POST request to the OpenAI API
        const response = await fetch("https://api.openai.com/v1/models", fetchRequest);
        // Check if the response status is not 200 (OK)
        if (!response.ok) {
            // Throw an error with the status code
            throw new Error(`OpenAI API request failed with status ${response.status}`);
        }
        // Parse the response body as JSON
        const data = await response.json();
        // const modelKeys = data.map(({id}: {id: string}) => id);
        // const modelData = data.map(({id: _id, ...mData}: Record<string, string>) => mData);
        const dataList = Object.fromEntries(data.map(({ id, ...mData }) => [id, mData]));
        if (isVerbose) {
            eLog.checkLog3("BladesAI", "Available Models", { dataList });
        }
    }
    apiKey;
    model;
    temperature = 0.5;
    frequency_penalty = 0.8;
    presence_penalty = 0.8;
    systemMessage;
    examplePrompts;
    /**
     * AI class constructor
     * @param {BladesAI.Config} [config] Configuration settings for the API
     */
    constructor(config) {
        const apiKey = U.getSetting("openAPIKey");
        if (!apiKey) {
            throw new Error("You must configure your OpenAI API Key in Settings to use AI features.");
        }
        this.model = U.getSetting("openAPIModelLevel");
        if (typeof this.model !== "number") {
            eLog.error("BladesAI", "Set base AI quality in settings. Defaulting to lowest.");
            this.model = 0;
        }
        this.apiKey = apiKey;
        this.systemMessage = config.systemMessage;
        this.examplePrompts = config.examplePrompts;
        this.temperature = config.temperature ?? this.temperature;
        this.frequency_penalty = config.frequency_penalty ?? this.frequency_penalty;
        this.presence_penalty = config.presence_penalty ?? this.presence_penalty;
    }
    _initialMessages = [];
    get initialMessages() {
        if (this._initialMessages.length === 0) {
            this._initialMessages.push({
                role: "system",
                content: this.systemMessage
            });
            for (const { human, ai } of this.examplePrompts) {
                this._initialMessages.push({
                    role: "user",
                    content: human
                });
                this._initialMessages.push({
                    role: "assistant",
                    content: ai
                });
            }
        }
        return this._initialMessages;
    }
    prompts = {};
    responses = {};
    getResponse(queryID) {
        return this.responses[queryID] ?? null;
    }
    hasQueried(queryID) {
        return this.prompts[queryID] !== undefined;
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
    async query(queryID, prompt, modelMod, extendedContext = false) {
        if (!prompt) {
            return;
        }
        this.responses[queryID] = null;
        const modelNum = typeof modelMod === "number"
            ? U.clampNum(this.model + modelMod, [0, 2])
            : this.model;
        const model = extendedContext
            ? C.AI_MODELS.extendedContext[modelNum]
            : C.AI_MODELS.baseContext[modelNum];
        const fetchRequest = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${this.apiKey}`
            },
            body: JSON.stringify({
                model,
                temperature: this.temperature,
                frequency_penalty: this.frequency_penalty,
                presence_penalty: this.presence_penalty,
                messages: [
                    ...this.initialMessages,
                    {
                        role: "user",
                        content: prompt
                    }
                ]
            })
        };
        // EeLog.checkLog3("BladesAI", "Fetch Request", fetchRequest);
        // Send a POST request to the OpenAI API
        const response = await fetch("https://api.openai.com/v1/chat/completions", fetchRequest);
        // {
        //   method: "POST",
        //   headers: {
        //     // The content type of the request
        //     "Content-Type": "application/json",
        //     // The authorization header with the API key
        //     Authorization: `Bearer ${this.apiKey}`
        //   },
        //   body: JSON.stringify({
        //     model,
        //     messages: [
        //       ...this.initialMessages,
        //       {
        //         role: "user",
        //         content: prompt
        //       }
        //     ],
        //     // Maximum number of tokens in the output. Min: 1, Max: 4096
        //     // max_tokens: 60,
        //     // Controls randomness. Higher values mean the model will take more risks.
        //     temperature: 0.5, // 0 to 2.0
        //     /* The 'top_p' parameter is an alternative to 'temperature' for controlling the randomness of
        //       the AI's responses. It represents the cumulative probability and its value ranges from 0 to 1.
        //       A lower value makes the AI's responses more deterministic, while a higher value makes them
        //       more diverse and unpredictable. */
        //     // top_p: 1, // 0 to 1
        //     /* The 'frequency_penalty' parameter is used to penalize new tokens based on their frequency in
        //       the training set. Its value ranges from 0 to 1. A higher value means the AI is less likely to
        //       use common phrases from its training set, leading to more unique responses. A lower value
        //       means the AI is more likely to use common phrases, leading to more predictable responses. */
        //     frequency_penalty: 0.8, // -2.0 to 2.0
        //     /* The 'presence_penalty' parameter is used to penalize tokens (words or phrases) that are out
        //       of context. Its value ranges from 0 to 1. A higher value means the AI is less likely to
        //       include out-of-context tokens in its responses, leading to more coherent and contextually
        //       appropriate responses. A lower value means the AI is more likely to include out-of-context
        //       tokens, which can lead to more creative but potentially less coherent responses. */
        //     presence_penalty: 0.8 // -2.0 to 2.0
        //   })
        // }
        // );
        // Check if the response status is not 200 (OK)
        if (!response.ok) {
            console.log("Failed AI Request:", JSON.parse(fetchRequest.body));
            // Throw an error with the status code
            throw new Error(`OpenAI API request failed with status ${response.status}`);
        }
        // Parse the response body as JSON
        const data = await response.json();
        fetchRequest.body = JSON.parse(fetchRequest.body);
        eLog.checkLog3("BladesAI", "AI Query", { prompt: fetchRequest, response: data });
        this.responses[queryID] = data.choices[0].message.content;
        return this.responses[queryID];
    }
}
export const AGENTS = {
    GeneralContentGenerator: {
        systemMessage: "You will act as a creative content generator for a game of Blades In The Dark set in the city of Duskvol. You will be prompted with some element of the game world (a location, a character, an event, a faction, a dilemma) in the form of a JSON object. Your job is to analyze the JSON object and replace any values that equal \"<GEN>\" with original content of your own creation. Original content must meet these requirements:  (A) it should align with and be consistent with the provided contextual information, as well as your broader understanding of the game's themes. (B) It should be presented in a format that matches (in length and in style) other entries for that particular value, examples of which will also be provided. (C) It should be creative, interesting, and daring: Be bold with your creativity. Specific context for this prompt is as follows:",
        examplePrompts: []
    },
    NPCGenerator: {
        systemMessage: "You will play the role of a \"creative content generator\" for random NPCs generated for the Blades In The Dark roleplaying system. When prompted with a description of a subject (an NPC, a category of NPCs, a faction, or a group of NPCs), you will respond with a pipe-delimited list of sixteen items, divided into four categories, prefacing each category with the associated header in square brackets: [5 KEYWORDS] Five one-word keywords describing the subject. [5 PHRASES] Five evocative phrases that could be used by a GM directly when narrating the subject during play. These should be extremely well-worded, very original, and packed with drama and evocative imagery. Be bold with your responses here. [3 QUIRKS/MOTIFFS] Three phrases describing potential quirks or motiffs that a GM could employ in a scene involving the subject. [3 PLOT HOOKS] Three plot hooks that could directly and specifically involve one or more of the PCs. The PCs are: (1) Alistair, full name Lord Alistair Bram Chesterfield, the crew's boss, a Spider with connections among the nobility; (2) High-Flyer, a former noble himself, now serving as the crew's Slide; (3) Jax, a stoic and laconic Hound with ties to the disenfranchised of Duskvol; (4) Ollie, the youngest of the crew at barely nineteen, a prodigy Leech with knowledge of alchemy and spark-craft, who grew up as an orphan in Duskvol's underground; (5) Wraith, the mysterious Lurk of the crew, who never speaks for reasons unknown; and (6) Spencer, the bookish Whisper of the crew, who harbors a secret fascination for demons and all things related to them.",
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
        systemMessage: "You will act as a \"Setback Adjuster\" for a game of Blades In The Dark.  You will be prompted with a short phrase describing an injury, lasting consequence or other setback. Your job is to respond with a pipe-delimited list of three possible alternative consequences that are less severe by one level, using the following scale as a rough guide: Level 1 = Lesser (e.g. 'Battered', 'Drained', 'Distracted', 'Scared', 'Confused'), Level 2 = Moderate (e.g. 'Exhausted', 'Deep Cut to Arm', 'Concussion', 'Panicked', 'Seduced'), Level 3 = Severe (e.g. 'Impaled', 'Broken Leg', 'Shot In Chest', 'Badly Burned', 'Terrified'), Level 4 = Fatal or Ruinous (e.g. 'Impaled Through Heart', 'Electrocuted', 'Headquarters Burned to the Ground'). So, if you determine that the consequence described in the prompt is severity level 3, you should respond with three narratively similar consequences that are severity level 2.  Your three suggestions should be different from each other, but they should all logically follow from the initial harm described: You should not introduce new facts or make assumptions that are not indicated in the initial prompt. The consequences you suggest should always describe a NEGATIVE setback or complication, just one that is less severe than the one described in the prompt.",
        examplePrompts: [
            { human: "Shattered Right Leg", ai: "Fractured Right Ankle|Dislocated Knee|Broken Foot" },
            { human: "Soul Destroyed", ai: "Fully Corrupted|Lost In Darkness|Spirit Broken" },
            { human: "Humiliated", ai: "Embarrassed|Momentarily Off-Balance|Enraged" },
            { human: "She Escapes!", ai: "She Spots a Means of Escape|She Puts More Distance Between You|She Stops to Gloat" },
            { human: "The fire spreads to the hostages.", ai: "The fire approaches the hostages.|The hostages must be evacuated.|The fire billows choking black smoke." }
        ]
    }
};
export default BladesAI;
export { AIAssistant };
