import { registerSheet, SheetDefinition } from "react-native-actions-sheet";
import LanguageBottomSheet from "./LanguageBottomSheet";

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