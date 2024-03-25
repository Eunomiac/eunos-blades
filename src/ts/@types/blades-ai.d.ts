// #region IMPORTS ~
/* eslint-disable @typescript-eslint/no-unused-vars */
import BladesAIAssistant from "../core/ai";
import OpenAI from "openai";
/* eslint-enable @typescript-eslint/no-unused-vars */
// #endregion

declare global {

  type OpenAIAssistant = OpenAI.Beta.Assistants.Assistant;

  namespace BladesAI {
    export type Usage = "text"|"speech"|"image";

    export interface AssistantConfig extends Partial<OpenAI.Beta.Assistants.AssistantCreateParams> {
      name: string,
      instructions: string,
      usage: Usage,

      goodPrompts?: Array<{prompt: string, response: string}>,
      badPrompts?: Array<{prompt: string, response: string}>
    }
  }

}
