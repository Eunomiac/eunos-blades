import BladesActor from "../BladesActor";
import BladesItem from "../BladesItem";

declare global {
  namespace BladesDialog {
    interface Options extends DialogOptions {}
    interface Data extends Dialog.Data {
      parent: BladesActor;
      docType: "Actor"|"Item";
      tabs: Record<string, BladesActor[] | BladesItem[]>;
      tags?: BladesTag[];
    }
  }
}