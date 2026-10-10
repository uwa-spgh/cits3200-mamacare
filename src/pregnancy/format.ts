import type { TFunction } from "i18next";
import type { PregnancyProgress } from "./progress";

export const pregnancyLocale = (language: string) => language.startsWith("ne") ? "ne-NP" : "en-US";

export function formatGestation(progress: PregnancyProgress, t: TFunction, language: string) {
  const number = new Intl.NumberFormat(pregnancyLocale(language));
  return t("pregnancy.gestation", {
    weeks: t("pregnancy.weeks", { count: progress.weeks, value: number.format(progress.weeks) }),
    days: t("pregnancy.days", { count: progress.days, value: number.format(progress.days) }),
  });
}

export function formatCountdown(progress: PregnancyProgress, t: TFunction, language: string) {
  if (progress.daysUntilDue === 0) return t("pregnancy.dueToday");
  const count = Math.abs(progress.daysUntilDue);
  return t(progress.daysUntilDue > 0 ? "pregnancy.daysToGo" : "pregnancy.daysPastDue", {
    count,
    value: new Intl.NumberFormat(pregnancyLocale(language)).format(count),
  });
}

export function formatDueDate(progress: PregnancyProgress, language: string) {
  return new Intl.DateTimeFormat(pregnancyLocale(language), {
    day: "numeric", month: "short", year: "numeric",
  }).format(progress.dueDate);
}
