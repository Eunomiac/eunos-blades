import {BladesActorType, BladesItemType} from "../core/constants";
import BladesActor from "../blades-actor";
import BladesItem from "../blades-item";

declare global {

  // Abstract class to which BladesActors and BladesItems must adhere
  declare abstract class BladesDocument<T extends Actor | Item> {

    static override async create(): Promise<T extends Actor ? BladesActor : BladesItem>

    static get All(): T extends Actor ? BladesActor[] : BladesItem[];
    static Get(docRef: DocRef): (T extends Actor ? BladesActor[] : BladesItem[]) | undefined;
    static GetTypeWithTags(type: BladesActorType | BladesItemType, ...tags: BladesTag[]): T extends Actor ? BladesActor[] : BladesItem[];
    static IsType<T extends BladesActorType|BladesItemType>(doc: BladesDoc, ...types: T[]): boolean;

    tags: BladesTag[];
    hasTag(...tags: BladesTag[]): boolean
    addTag(...tags: BladesTag[]): Promise<void>
    remTag(...tags: BladesTag[]): Promise<void>

    tooltip: string|undefined;
    dialogCSSClasses: string;
  }

  // template.json "template" definitions applying to both Actors and Items
  namespace BladesDocSchemaTemplate {

    export interface Default {
      world_name: string,
      gm_notes: string,
      tags: BladesTag[]
    }

  }
}