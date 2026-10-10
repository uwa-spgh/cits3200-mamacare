
export const INTL_LOCALE_MAP: Record<string, string> = {
  en: 'en-US',
  ne: 'ne-NP'
};

export const toIntlLocale = (i18nLanguage: string | undefined): string => {
  if (!i18nLanguage) return 'en-US'; // Default
  if (INTL_LOCALE_MAP[i18nLanguage]) return INTL_LOCALE_MAP[i18nLanguage];
  const base = i18nLanguage.split('-')[0];
  return INTL_LOCALE_MAP[base] ?? 'en-US';
};