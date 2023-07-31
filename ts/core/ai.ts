import {BladesActorType, BladesItemType} from "./constants.js";
const AI: Record<string, (...args: any[]) => any> = {};

const SYSTEM_INTRO = `
  You will act as a creative content generator for a game of Blades In The Dark set in the city of Duskvol. You will be prompted with some element of the game world (a location, a character, an event, a faction, a dilemma) in the form of a JSON object. Your job is to analyze the JSON object and replace any values that equal "<GEN>" with original content of your own creation. Original content must meet these requirements:  (A) it should align with and be consistent with the provided contextual information, as well as your broader understanding of the game's themes. (B) It should be presented in a format that matches (in length and in style) other entries for that particular value, examples of which will also be provided. (C) It should be creative, interesting, and daring: Be bold with your creativity!

  Specific context for this prompt is as follows:
`;

AI.QuerySystem = (keyword: string) => {
  // Scans in-game objects for keyword. Crafts system message that incorporates retrieved data.
};

AI.QueryAssistant = (type: BladesActorType|BladesItemType, keys: string[]) => {
  // Given a type and a list of keys, will return suitable examples of JSON objects containing those keys.
};

export default AI;