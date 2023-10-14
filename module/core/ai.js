/* ****▌███████████████████████████████████████████████████████████████████████████▐**** *\
|*     ▌█░░░░░░░░░ Euno's Blades in the Dark for Foundry VTT ░░░░░░░░░░░█▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░ by Eunomiac ░░░░░░░░░░░░░██████████████████▐     *|
|*     ▌█  License █ v0.1.0 ██▐     *|
|*     ▌████░░░░  ░░░░█████▐     *|
\* ****▌███████████████████████████████████████████████████████████████████████████▐**** */

import axios from "axios.js";
import U from "./utilities.js";
export class AI {
    apiKey;
    systemMessage;
    examplePrompts;
        constructor(systemMessage, examplePrompts) {
        const apiKey = U.getSetting("openAPIKey");
        if (!apiKey) {
            throw new Error("You must configure your OpenAI API Key in Settings to use AI features.");
        }
        this.apiKey = apiKey;
        this.systemMessage = systemMessage;
        this.examplePrompts = examplePrompts;
    }
        async query(prompt) {
        const response = await axios.post("https://api.openai.com/v1/engines/davinci-codex/completions", {
            prompt: `${this.systemMessage}\n${this.examplePrompts.join("\n")}\n${prompt}`,
            max_tokens: 60,
            temperature: 0.5,
                        top_p: 1,
                        frequency_penalty: 0.8,
                        presence_penalty: 0.8
        }, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${this.apiKey}`
            }
        });
        if (response.status !== 200) {
            throw new Error(`OpenAI API request failed with status ${response.status}`);
        }
        return response.data;
    }
}