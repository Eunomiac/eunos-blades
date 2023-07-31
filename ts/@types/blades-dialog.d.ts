import BladesActor from "../blades-actor";
import BladesItem from "../blades-item";

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