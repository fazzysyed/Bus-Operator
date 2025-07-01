import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';

import english from './en.json';
import serbian from './sr.json';
import greek from './gr.json'; // rename gr.json to el.json
import bosnian from './bs.json';

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v3',
  lng: 'en',
  fallbackLng: 'en',
  resources: {
    en: english,
    sr: serbian,
    el: greek,
    bs: bosnian,
  },
  interpolation: {
    escapeValue: false, // react already safe from xss
  },
});

export default i18n;
