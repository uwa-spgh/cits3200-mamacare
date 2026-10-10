
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import type { RootState } from "../store/store";

export default function LanguageSync() {
  const language = useSelector(
    (state: RootState) => state.dataReducer.language
  );

  const { i18n } = useTranslation();

  useEffect(() => {
    if (language && i18n.language !== language) {
      void i18n.changeLanguage(language);
    }
  }, [language, i18n]);

  return null;
}