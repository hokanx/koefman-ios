import { Image, StyleSheet } from 'react-native';

// Full "KÖFMAN" lockup for login/splash; icon-only mark for small in-app spots.
// Both are white-on-transparent exports, so they read on the dark theme background.
const LOCKUP = require('../../assets/brand/lockup_transparent_1200.png');
const ICON_MARK = require('../../assets/brand/icon_mark_transparent_512.png');

export function Logo({ size = 'large' }: { size?: 'large' | 'small' }) {
  if (size === 'small') {
    return <Image source={ICON_MARK} style={styles.small} resizeMode="contain" />;
  }

  return <Image source={LOCKUP} style={styles.large} resizeMode="contain" />;
}

const styles = StyleSheet.create({
  large: {
    width: 260,
    height: 170,
    alignSelf: 'center',
  },
  small: {
    width: 40,
    height: 40,
  },
});
