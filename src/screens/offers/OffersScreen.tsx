import { useTranslation } from 'react-i18next';

import { PlaceholderScreen } from '../../components/PlaceholderScreen';

export function OffersScreen() {
  const { t } = useTranslation();
  return <PlaceholderScreen title={t('nav.offers')} />;
}
