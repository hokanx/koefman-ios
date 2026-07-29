import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';
import i18n from 'i18next';
import { I18nManager } from 'react-native';
import { initReactI18next } from 'react-i18next';

import ar from './locales/ar.json';
import de from './locales/de.json';
import en from './locales/en.json';

export const SUPPORTED_LANGUAGES = ['de', 'en', 'ar'] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];
export const RTL_LANGUAGES: readonly SupportedLanguage[] = ['ar'];
export const DEFAULT_LANGUAGE: SupportedLanguage = 'de';

const LANGUAGE_STORAGE_KEY = '@koefman/language';

const resources = {
  de: { translation: de },
  en: { translation: en },
  ar: { translation: ar },
};

function isSupportedLanguage(lang: string | null | undefined): lang is SupportedLanguage {
  return !!lang && (SUPPORTED_LANGUAGES as readonly string[]).includes(lang);
}

async function resolveInitialLanguage(): Promise<SupportedLanguage> {
  const stored = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (isSupportedLanguage(stored)) return stored;

  const deviceLanguage = Localization.getLocales()[0]?.languageCode;
  if (isSupportedLanguage(deviceLanguage)) return deviceLanguage;

  return DEFAULT_LANGUAGE;
}

/** Returns true if I18nManager's layout direction changed (caller should prompt a restart). */
function applyRTL(language: SupportedLanguage): boolean {
  const shouldBeRTL = RTL_LANGUAGES.includes(language);
  if (I18nManager.isRTL !== shouldBeRTL) {
    I18nManager.allowRTL(shouldBeRTL);
    I18nManager.forceRTL(shouldBeRTL);
    return true;
  }
  return false;
}

export async function initI18n(): Promise<{ language: SupportedLanguage; layoutChanged: boolean }> {
  const language = await resolveInitialLanguage();
  const layoutChanged = applyRTL(language);

  if (!i18n.isInitialized) {
    await i18n.use(initReactI18next).init({
      resources,
      lng: language,
      fallbackLng: DEFAULT_LANGUAGE,
      interpolation: { escapeValue: false },
    });
  }

  return { language, layoutChanged };
}

/** Persists the choice, flips I18nManager's RTL flag if needed, and switches i18next's active language. */
export async function changeLanguage(language: SupportedLanguage): Promise<{ layoutChanged: boolean }> {
  await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  const layoutChanged = applyRTL(language);
  await i18n.changeLanguage(language);
  return { layoutChanged };
}

export default i18n;
