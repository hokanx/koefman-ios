import { useTranslation } from 'react-i18next';
import { SafeAreaView, StyleSheet, Text } from 'react-native';

import { useAuth } from '../../auth/AuthContext';
import { Button } from '../../components/Button';
import { LanguageSwitch } from '../../components/LanguageSwitch';
import { useTheme } from '../../theme/useTheme';

export function SettingsScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const { signOut } = useAuth();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>{t('nav.settings')}</Text>

      <Text style={[styles.sectionLabel, { color: theme.colors.textMuted }]}>{t('settings.language')}</Text>
      <LanguageSwitch />

      <Button label={t('auth.signOut')} onPress={() => signOut()} variant="secondary" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    gap: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 8,
  },
});
