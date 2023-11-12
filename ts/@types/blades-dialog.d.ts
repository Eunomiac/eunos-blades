import BladesActor from "../BladesActor";
import BladesItem from "../BladesItem";
import {BladesDialogType} from "../BladesDialog";
import BladesRoll from "../BladesRoll";
import {RollResult, AttributeTrait} from "../core/constants";

declare global {
  namespace BladesDialog {
    interface Options extends DialogOptions {}
    interface Data extends Dialog.Data {
      parent: BladesActor|BladesRoll;
      dialogType?: BladesDialogType;
      docType?: "Actor"|"Item";
      tabs?: Record<string, BladesActor[] | BladesItem[]>;
      tags?: BladesTag[];
      consequenceData?: {
        [RollResult.partial]?: Record<
          string, // stringified index
          BladesRoll.ConsequenceData
        >,
        [RollResult.fail]?: Record<
          string, // stringified index
          BladesRoll.ConsequenceData
        >
      },
      consequenceTypeOptions?: {
        [RollResult.partial]: Array<BladesSelectOption<string, ConsequenceType>>,
        [RollResult.fail]: Array<BladesSelectOption<string, ConsequenceType>>
      }
      consequenceTypeOptionsAll?: Array<BladesSelectOption<string, ConsequenceType>>,
      consequenceAttributeOptions?: Array<BladesSelectOption<string, AttributeTrait>>
    }
  }
}