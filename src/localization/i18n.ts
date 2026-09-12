import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';

import en from './en.json';
import ne from './ne.json';

const LANGUAGES = {
    en: {
        translation: en
    },
    ne: {
        translation: ne
    }
}

i18n.use(initReactI18next).init({
    resources: LANGUAGES,
    lng: 'en', // default language
    fallbackLng: 'en', // fallback language
    defaultNS: 'translation',
    ns: ['translation'],
    react:{
        useSuspense: false
    },
    interpolation: {
        escapeValue: false, // react already safes from xss
    },
})

export default i18n;