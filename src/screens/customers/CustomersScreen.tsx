import { useTranslation } from 'react-i18next';

import { PlaceholderScreen } from '../../components/PlaceholderScreen';

export function CustomersScreen() {
  const { t } = useTranslation();
  return <PlaceholderScreen title={t('nav.customers')} />;
}
