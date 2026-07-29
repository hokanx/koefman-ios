import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTranslation } from 'react-i18next';

import { CustomersScreen } from '../screens/customers/CustomersScreen';
import { DashboardScreen } from '../screens/dashboard/DashboardScreen';
import { InvoicesScreen } from '../screens/invoices/InvoicesScreen';
import { OffersScreen } from '../screens/offers/OffersScreen';
import { SettingsScreen } from '../screens/settings/SettingsScreen';
import { useTheme } from '../theme/useTheme';
import type { AppTabParamList } from './types';

const Tab = createBottomTabNavigator<AppTabParamList>();

export function AppTabs() {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.surface },
        headerTintColor: theme.colors.text,
        tabBarStyle: { backgroundColor: theme.colors.surface, borderTopColor: theme.colors.border },
        tabBarActiveTintColor: theme.colors.accent,
        tabBarInactiveTintColor: theme.colors.textMuted,
      }}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} options={{ title: t('nav.dashboard') }} />
      <Tab.Screen name="Customers" component={CustomersScreen} options={{ title: t('nav.customers') }} />
      <Tab.Screen name="Offers" component={OffersScreen} options={{ title: t('nav.offers') }} />
      <Tab.Screen name="Invoices" component={InvoicesScreen} options={{ title: t('nav.invoices') }} />
      <Tab.Screen name="Settings" component={SettingsScreen} options={{ title: t('nav.settings') }} />
    </Tab.Navigator>
  );
}
