import BladesActor from "../BladesActor";
import BladesItem from "../BladesItem";
import {BladesDialogType} from "../BladesDialog";

declare global {
  namespace BladesDialog {
    interface Options extends DialogOptions {}
    interface Data extends Dialog.Data {
      parent: BladesActor;
      dialogType?: BladesDialogType;
      docType: "Actor"|"Item";
      tabs: Record<string, BladesActor[] | BladesItem[]>;
      tags?: BladesTag[];
    }
  }
}