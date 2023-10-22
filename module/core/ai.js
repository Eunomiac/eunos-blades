/* ****▌███████████████████████████████████████████████████████████████████████████▐**** *\
|*     ▌█░░░░░░░░░ Euno's Blades in the Dark for Foundry VTT ░░░░░░░░░░░█▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░ by Eunomiac ░░░░░░░░░░░░░██████████████████▐     *|
|*     ▌█  License █ v0.1.0 ██▐     *|
|*     ▌████░░░░  ░░░░█████▐     *|
\* ****▌███████████████████████████████████████████████████████████████████████████▐**** */

import C from "./constants.js";
import U from "./utilities.js";
class BladesAI {
    apiKey;
    model;
    temperature = 0.5;
    frequency_penalty = 0.8;
    presence_penalty = 0.8;
    systemMessage;
    examplePrompts;
        constructor(systemMessage, examplePrompts, config = {}) {
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
        this.systemMessage = systemMessage;
        this.examplePrompts = examplePrompts;
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
        async query(prompt, modelMod, extendedContext = false) {
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
        
        const response = await fetch("https://api.openai.com/v1/chat/completions", fetchRequest);
        if (!response.ok) {
            throw new Error(`OpenAI API request failed with status ${response.status}`);
        }
        const data = await response.json();
        fetchRequest.body = JSON.parse(fetchRequest.body);
        eLog.checkLog3("BladesAI", "AI Query", { prompt: fetchRequest, response: data });
        return data.choices[0].message.content;
    }
}
export const PROMPTS = {
    GeneralContentGenerator: {
        system: "You will act as a creative content generator for a game of Blades In The Dark set in the city of Duskvol. You will be prompted with some element of the game world (a location, a character, an event, a faction, a dilemma) in the form of a JSON object. Your job is to analyze the JSON object and replace any values that equal \"<GEN>\" with original content of your own creation. Original content must meet these requirements:  (A) it should align with and be consistent with the provided contextual information, as well as your broader understanding of the game's themes. (B) It should be presented in a format that matches (in length and in style) other entries for that particular value, examples of which will also be provided. (C) It should be creative, interesting, and daring: Be bold with your creativity. Specific context for this prompt is as follows:"
    },
    NPCGenerator: {
        system: "You will play the role of a \"creative content generator\" for random NPCs generated for the Blades In The Dark roleplaying system. When prompted with a description of a subject (an NPC, a category of NPCs, a faction, or a group of NPCs), you will respond with a pipe-delimited list of sixteen items, divided into four categories, prefacing each category with the associated header in square brackets: [5 KEYWORDS] Five one-word keywords describing the subject. [5 PHRASES] Five evocative phrases that could be used by a GM directly when narrating the subject during play. These should be extremely well-worded, very original, and packed with drama and evocative imagery. Be bold with your responses here. [3 QUIRKS/MOTIFFS] Three phrases describing potential quirks or motiffs that a GM could employ in a scene involving the subject. [3 PLOT HOOKS] Three plot hooks that could directly and specifically involve one or more of the PCs. The PCs are: (1) Alistair, full name Lord Alistair Bram Chesterfield, the crew's boss, a Spider with connections among the nobility; (2) High-Flyer, a former noble himself, now serving as the crew's Slide; (3) Jax, a stoic and laconic Hound with ties to the disenfranchised of Duskvol; (4) Ollie, the youngest of the crew at barely nineteen, a prodigy Leech with knowledge of alchemy and spark-craft, who grew up as an orphan in Duskvol's underground; (5) Wraith, the mysterious Lurk of the crew, who never speaks for reasons unknown; and (6) Spencer, the bookish Whisper of the crew, who harbors a secret fascination for demons and all things related to them.",
        examples: [
            {
                human: "The Billhooks, a hack-and-slash gang of toughened thugs. The Billhooks have a bloody reputation, often leaving the butchered corpses of their victims strewn about in a grisly display. Many wonder why the Bluecoats turn a blind eye to their savagery. Based out of their butcher shop headquarters, they are led by Tarvul, who is currently serving life in prison.",
                ai: "[5 KEYWORDS]brutal|unrelenting|savage|fierce|unhinged|[5 PHRASES]blood-flecked, yellowed teeth|eyes that want to flay your skin from your bones|crooked leer like he's looking at his Judas goat|reek like a charnel house|gobbets of a meaty lunch still in his beard|[3 QUIRKS/MOTIFFS]always ready to wreck, vandalize or destroy something|relish in instilling fear in others|have a twisted sense of loyalty|[3 PLOT HOOKS]Tarvul hires the crew to start a war among his most promising underlings, intending to make whoever survives his successor|the Billhooks kidnap a member of High-Flyer's noble family|a Demon of Shadows promises Spencer the answer to three questions, in exchange for an artifact recently stolen by the Billhooks"
            },
            {
                human: "The hooded proprietor of a half-flooded grotto tavern near the docks. 'Strange passageways lead to stranger chambers beyond.' Vice Purveyor - Weird.",
                ai: "[5 KEYWORDS]mysterious|cryptic|enigmatic|peculiar|shrouded|[5 PHRASES]a voice like silk sliding over gravel|the flicker of torchlight dancing on the flooded floor|the scent of brackish water and old spices|a smile that hinted at a thousand secrets hidden in the shadows|hands gnarled as driftwood, eternally damp|[3 QUIRKS/MOTIFFS]has an uncanny knack for knowing patrons' darkest secrets without them telling him|never seems to sleep or leave the tavern, always there no matter what time you visit|always seen with a strange, luminescent creature that lives in one of the flooded chambers behind the bar|[3 PLOT HOOKS]Alistair hears rumors that this tavern is actually a front for a powerful secret society - perhaps they could be useful allies...or dangerous enemies.|The proprietor offers Ollie a rare alchemical ingredient - but it's not for sale. He'll only trade it for something equally valuable.|Wraith overhears whispers about a hidden chamber beneath the tavern where unimaginable treasures are kept."
            },
            {
                human: "Setarra, a Demon. Patient, Defiant, Ruthless, Cold",
                ai: "[5 KEYWORDS]shadowy|sinister|unfathomable|enigmatic|tempting|[5 PHRASES]whispers that crawl under your skin|always watching, always plotting|a voice like silk and venom|intoxicating presence that draws you closer, despite your instincts urging you to run|eyes like black holes, swallowing all light around them|[3 QUIRKS/MOTIFFS]a disorienting mist clings to her form, obscuring her true shape|casually discusses the devastating acts of capricious revenge she has taken on those who crossed her|never forgets a slight or betrayal, no matter how small or insignificant it may seem at the time|[3 PLOT HOOKS]seeks revenge against Alistair for meddling in her affairs years ago|makes Ollie an offer he can't refuse: unlimited access to forbidden alchemical knowledge in exchange for a single favor, to be called in at some future time|tempts Spencer with forbidden knowledge about demons, promising answers to all their questions if they perform a dangerous ritual"
            }
                    ]
    },
    HarmAdjuster: {
        system: "You will act as a \"Harm Generator\" for a game of Blades In The Dark.  You will be prompted with (1) a short phrase describing an injury, lasting consequence or other setback, (2) a 'severity level' representing how bad the described harm is, and (3) a 'target severity level' describing how severe the described harm should be.  Your job is to increase or decrease the subjective severity of the harm described in the prompt so that it aligns with the target severity level. You should respond with a pipe-delimited list of three possibilities. Your three suggestions should be different from each other, but they should all logically follow from the initial harm described: You should not introduce new facts or make assumptions that are not indicated in the initial prompt. There are four severity levels: Level 1: Lesser Harm (e.g. 'Battered', 'Drained', 'Distracted', 'Scared', 'Confused'), Level 2: Moderate Harm (e.g. 'Exhausted', 'Deep Cut to Arm', 'Concussion', 'Panicked', 'Seduced'), Level 3: Severe Harm (e.g. 'Impaled', 'Broken Leg', 'Shot In Chest', 'Badly Burned', 'Terrified'), Level 4: Fatal Harm (e.g. 'Impaled Through Heart', 'Electrocuted', 'Drowned').",
        examples: [
            { human: "Shattered Right Leg/Severity 3/Target 2", ai: "Fractured Right Ankle|Dislocated Knee|Broken Foot" },
            { human: "Tainted Soul/Severity 2/Target 4", ai: "Fully Corrupted|Lost To Darkness|Soulless" },
            { human: "Humiliated/Severity 2/Target 1", ai: "Embarrassed|Momentarily Off-Balance|Enraged" }
        ]
    }
};
export default BladesAI;