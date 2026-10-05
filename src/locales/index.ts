import { createI18n } from 'vue-i18n';
import vi from './vi/common.json';
import en from './en/common.json';
import fr from './fr/common.json';
import viAuthentication from './vi/authentication.json';
import enAuthentication from './en/authentication.json';
import frAuthentication from './fr/authentication.json';
import viSystem from './vi/system.json';
import enSystem from './en/system.json';
import frSystem from './fr/system.json';
export const i18n = createI18n({
  legacy: false,
  locale: (typeof localStorage !== 'undefined' ? localStorage.getItem('hr-locale') : null) || 'vi',
  fallbackLocale: 'en',
  messages: {
    vi: { ...vi, common: vi, authentication: viAuthentication, system: viSystem },
    en: { ...en, common: en, authentication: enAuthentication, system: enSystem },
    fr: { ...fr, common: fr, authentication: frAuthentication, system: frSystem },
  },
});
