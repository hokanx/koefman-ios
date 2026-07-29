import { useTranslation } from 'react-i18next';
import { Alert, DevSettings, Pressable, StyleSheet, Text, View } from 'react-native';

import { changeLanguage, SUPPORTED_LANGUAGES, type SupportedLanguage } from '../i18n';
import { useTheme } from '../theme/useTheme';

const LABELS: Record<SupportedLanguage, string> = {
  de: 'Deutsch',
  en: 'English',
  ar: 'العربية',
};

export function LanguageSwitch() {
  const { i18n, t } = useTranslation();
  const theme = useTheme();
  const active = i18n.language as SupportedLanguage;

  const handleSelect = async (language: SupportedLanguage) => {
    if (language === active) return;
    const { layoutChanged } = await changeLanguage(language);
    if (layoutChanged) {
      if (__DEV__) {
        DevSettings.reload();
      } else {
        Alert.alert(t('common.restartRequiredTitle'), t('common.restartRequiredBody'));
      }
    }
  };

  return (
    <View style={styles.row}>
      {SUPPORTED_LANGUAGES.map((language) => {
        const isActive = language === active;
        return (
          <Pressable
            key={language}
            onPress={() => handleSelect(language)}
            style={[
              styles.pill,
              {
                backgroundColor: isActive ? theme.colors.accent : theme.colors.surfaceElevated,
                borderColor: theme.colors.border,
              },
            ]}
          >
            <Text style={{ color: isActive ? theme.colors.textInverse : theme.colors.text, fontWeight: '600' }}>
              {LABELS[language]}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  pill: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 999,
    borderWidth: 1,
  },
});
