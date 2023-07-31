import {Attributes, Actions, BladesPhase} from "./core/constants";

declare global {
  // Final data sent to Handlebars through BladesActorSheet.getData()
  namespace BladesSheetData {

    export interface Scoundrel {
      isOwner: boolean,

      attributes: Record<Attributes, Record<Actions,ValueMax>>,

      acquaintancesName: string,

      preparedItems: {
        abilities: Array<BladesItemOfType<BladesItemType.ability> & {
          inRuleDotline?: BladesDotlineData
        }>,
        background?: BladesItemOfType<BladesItemType.background>,
        heritage?: BladesItemOfType<BladesItemType.heritage>,
        vice?: BladesItemOfType<BladesItemType.vice>,
        loadout: Array<BladesItemOfType<BladesItemType.item> & {
          numberCircle?: number,
          numberCircleClass?: string,
          inRuleDotline?: BladesDotlineData
        }>,
        playbook?: BladesItemOfType<BladesItemType.playbook>
      },

      preparedActors: {
        crew?: BladesActorOfType<BladesActorType.crew>,
        vice_purveyor?: BladesActorOfType<BladesActorType.npc>,
        acquaintances: Array<BladesActor>
      },

      hasVicePurveyor: boolean,
      healing_clock: BladesClockData,

      stashData: BladesCompData,
      stressData: BladesCompData,
      traumaData: BladesCompData,
      abilityData: BladesCompData,
      actionData: BladesCompData,

      loadData: {
        curLoad: number,
        selLoadCount: number,
        selections: string[],
        selLoadLevel: string
      },
      armor: Record<string,boolean>
    }

    export interface Crew { }

    export interface NPC { }

    export interface Faction {
      tierData: BladesCompData
    }
  }
}