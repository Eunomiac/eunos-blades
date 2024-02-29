import BladesActor from "../BladesActor";
import BladesItem from "../BladesItem";
import {BladesDialogType} from "../classes/BladesDialog";
import BladesRoll from "../classes/BladesRoll";
import {RollResult, AttributeTrait, Position} from "../core/constants";

declare global {
  namespace BladesDialog {
    interface Options extends DialogOptions {}
    interface Data extends Dialog.Data {
      parent: BladesActor|BladesItem|BladesRoll;
      dialogType?: BladesDialogType;
      docType?: "Actor"|"Item";
      tabs?: Record<string, BladesActor[] | BladesItem[]>;
      tags?: BladesTag[];
      consequenceData?: Record<
        Position,
        Record<
          RollResult.partial|RollResult.fail,
          Record<
            string,
            BladesRoll.ConsequenceData
          >
        >
      >,
      consequenceTypeOptions?: Record<
        Position,
        Record<
          RollResult.partial|RollResult.fail,
          Array<BladesSelectOption<string, ConsequenceType>>
        >
      >,
      consequenceTypeOptionsAll?: Array<BladesSelectOption<string, ConsequenceType>>,
      consequenceAttributeOptions?: Array<BladesSelectOption<string, AttributeTrait>>,
      prompt?: string,
      target?: string,
      flagTarget?: string
    }
  }
}