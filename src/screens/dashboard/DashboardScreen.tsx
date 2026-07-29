import { useTranslation } from 'react-i18next';

import { PlaceholderScreen } from '../../components/PlaceholderScreen';

export function DashboardScreen() {
  const { t } = useTranslation();
  return <PlaceholderScreen title={t('nav.dashboard')} />;
}
