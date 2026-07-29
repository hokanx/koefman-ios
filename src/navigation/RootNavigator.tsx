import { NavigationContainer } from '@react-navigation/native';

import { useAuth } from '../auth/AuthContext';
import { Logo } from '../components/Logo';
import { useTheme } from '../theme/useTheme';
import { AppTabs } from './AppTabs';
import { AuthNavigator } from './AuthNavigator';
import { StyleSheet, View } from 'react-native';

function SplashLoading() {
  const theme = useTheme();
  return (
    <View style={[styles.splash, { backgroundColor: theme.colors.background }]}>
      <Logo size="large" />
    </View>
  );
}

export function RootNavigator() {
  const { session, isLoading } = useAuth();

  if (isLoading) {
    return <SplashLoading />;
  }

  return <NavigationContainer>{session ? <AppTabs /> : <AuthNavigator />}</NavigationContainer>;
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
