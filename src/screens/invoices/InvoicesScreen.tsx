import { useTranslation } from 'react-i18next';

import { PlaceholderScreen } from '../../components/PlaceholderScreen';

export function InvoicesScreen() {
  const { t } = useTranslation();
  return <PlaceholderScreen title={t('nav.invoices')} />;
}
