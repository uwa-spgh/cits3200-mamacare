import { registerSheet, SheetDefinition } from "react-native-actions-sheet";
import LanguageBottomSheet from "./LanguageBottomSheet";
import GenderBottomSheet from "./GenderBottomSheet";

registerSheet("LANG_SHEET", LanguageBottomSheet);

declare module "react-native-actions-sheet" {
  interface Sheets {
    LANG_SHEET: SheetDefinition<{
      payload: {
        onConfirm: (code: string) => void;
      };
    }>;
  }
}

export {};
registerSheet("GENDER_SHEET", GenderBottomSheet);

declare module "react-native-actions-sheet" {
    interface Sheets {
        GENDER_SHEET: {
            returnValue: string;
        };
    }
}

export { };
