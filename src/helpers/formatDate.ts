import { toIntlLocale } from "../localization/localeMap";

export const formatEdd = (iso: string, locale: string = "en"): string => {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString(toIntlLocale(locale), {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};
