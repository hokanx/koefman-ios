import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '../theme/useTheme';

/**
 * Text wordmark fallback — no logo assets were provided yet (see
 * assets/brand/README.md). Swap this out for an <Image> of
 * logo-lockup-1200.png once the real export lands.
 */
export function Logo({ size = 'large' }: { size?: 'large' | 'small' }) {
  const theme = useTheme();
  const fontSize = size === 'large' ? 40 : 20;

  return (
    <View style={styles.container}>
      <Text style={[styles.text, { color: theme.colors.text, fontSize }]}>KÖFMAN</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  text: {
    fontWeight: '700',
    letterSpacing: 4,
  },
});
