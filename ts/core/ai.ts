import axios from "axios";
import U from "./utilities";

/**
 * AI class for querying OpenAI API
 */
export class AI {
  private apiKey: string;

  private systemMessage: string;

  private examplePrompts: string[];

  /**
   * AI class constructor
   * @param {string} systemMessage System message to be sent with each prompt
   * @param {string[]} examplePrompts Example prompts/responses
   */
  constructor(systemMessage: string, examplePrompts: string[]) {
    const apiKey = U.getSetting("openAPIKey") as string|undefined;
    if (!apiKey) {
      throw new Error("You must configure your OpenAI API Key in Settings to use AI features.");
    }
    this.apiKey = apiKey;
    this.systemMessage = systemMessage;
    this.examplePrompts = examplePrompts;
  }

  /**
   * Query OpenAI API
   * @param {string} prompt The prompt to send to the API
   * @returns {Promise<any>} The API response
   */
  async query(prompt: string) {
    // Send a POST request to the OpenAI API
    const response = await axios.post(
      "https://api.openai.com/v1/engines/davinci-codex/completions",
      {
        // The prompt to be sent to the API, prefixed with the system message
        prompt: `${this.systemMessage}\n${this.examplePrompts.join("\n")}\n${prompt}`,
        // Maximum number of tokens in the output. Min: 1, Max: 4096
        max_tokens: 60,
        // Controls randomness. Higher values mean the model will take more risks. Min: 0, Max: 1
        temperature: 0.5,
        /* The 'top_p' parameter is an alternative to 'temperature' for controlling the randomness of
          the AI's responses. It represents the cumulative probability and its value ranges from 0 to 1.
          A lower value makes the AI's responses more deterministic, while a higher value makes them
          more diverse and unpredictable.
               Min: 0, Max: 1 */
        top_p: 1,
        /* The 'frequency_penalty' parameter is used to penalize new tokens based on their frequency in
          the training set. Its value ranges from 0 to 1. A higher value means the AI is less likely to
          use common phrases from its training set, leading to more unique responses. A lower value
          means the AI is more likely to use common phrases, leading to more predictable responses.
               Min: 0, Max: 1 */
        frequency_penalty: 0.8,
        /* The 'presence_penalty' parameter is used to penalize tokens (words or phrases) that are out
          of context. Its value ranges from 0 to 1. A higher value means the AI is less likely to
          include out-of-context tokens in its responses, leading to more coherent and contextually
          appropriate responses. A lower value means the AI is more likely to include out-of-context
          tokens, which can lead to more creative but potentially less coherent responses.
               Min: 0, Max: 1 */
        presence_penalty: 0.8
      },
      {
        headers: {
          // The content type of the request
          "Content-Type": "application/json",
          // The authorization header with the API key
          Authorization: `Bearer ${this.apiKey}`
        }
      }
    );

    // Check if the response status is not 200 (OK)
    if (response.status !== 200) {
      // Throw an error with the status code
      throw new Error(`OpenAI API request failed with status ${response.status}`);
    }

    // Return the data from the response
    return response.data;
  }
}
