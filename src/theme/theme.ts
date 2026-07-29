/**
 * Dark-premium default theme. `primary`/`accent` are placeholders — swap them
 * for Claude Design's tokens as soon as they land, everything else in the app
 * reads from here rather than hardcoding colors.
 */
export const theme = {
  colors: {
    background: '#0F1115',
    surface: '#191C22',
    surfaceElevated: '#22262E',
    border: '#2C313B',
    primary: '#111111',
    accent: '#C8A24B',
    text: '#F5F6F8',
    textMuted: '#9AA1AC',
    textInverse: '#0F1115',
    success: '#3CB273',
    warning: '#E0A93E',
    danger: '#E0553E',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  radius: {
    sm: 8,
    md: 14,
    lg: 20,
    pill: 999,
  },
  typography: {
    title: { fontSize: 28, fontWeight: '700' as const },
    heading: { fontSize: 20, fontWeight: '600' as const },
    body: { fontSize: 16, fontWeight: '400' as const },
    caption: { fontSize: 13, fontWeight: '400' as const },
  },
};

export type Theme = typeof theme;
