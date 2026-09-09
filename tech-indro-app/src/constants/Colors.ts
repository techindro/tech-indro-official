/**
 * Tech Indro Design System — Theme & Colors Tokens
 * Full support for Dynamic Light & Dark Mode
 */

export const LightColors = {
  // Brand Colors
  primary: '#ff6b35',
  primaryHover: '#e55a2b',
  primaryLight: '#ff8c5a',
  primaryDark: '#cc4e1d',
  secondary: '#6747a8',
  accent: '#ffb703',

  // Gradient Pairs
  heroGradientStart: '#667eea',
  heroGradientEnd: '#764ba2',
  primaryGradientStart: '#ff6b35',
  primaryGradientEnd: '#f7931e',

  // Backgrounds
  background: '#f8fafc',
  surface: '#ffffff',
  surfaceAlt: '#f1f5f9',
  backgroundElement: '#f1f5f9',
  backgroundSelected: '#e2e8f0',
  card: '#ffffff',
  cardBorder: '#f1f5f9',

  // Text
  text: '#0f172a',
  textMain: '#0f172a',
  textSecondary: '#334155',
  textMuted: '#64748b',
  textLight: '#94a3b8',

  // Borders
  border: '#e2e8f0',
  borderLight: '#f1f5f9',

  // Status
  success: '#10b981',
  error: '#ef4444',
  danger: '#ef4444',
  warning: '#f59e0b',
  info: '#4f46e5',

  // Constants
  white: '#ffffff',
  black: '#000000',
  overlay: 'rgba(0,0,0,0.5)',
  glassWhite: 'rgba(255,255,255,0.1)',

  // Category colors
  categoryPurple: '#4f46e5',
  categoryPink: '#ec4899',
  categoryAmber: '#f59e0b',
  categoryGreen: '#10b981',
};

export const DarkColors = {
  // Brand Colors
  primary: '#ff6b35',
  primaryHover: '#ff8c5a',
  primaryLight: '#ff8c5a',
  primaryDark: '#7c2d12',
  secondary: '#a78bfa',
  accent: '#fbbf24',

  // Gradient Pairs
  heroGradientStart: '#1e1b4b',
  heroGradientEnd: '#312e81',
  primaryGradientStart: '#ff6b35',
  primaryGradientEnd: '#d97706',

  // Backgrounds
  background: '#090d1f',
  surface: '#0f172a',
  surfaceAlt: '#1e293b',
  backgroundElement: '#1e293b',
  backgroundSelected: '#334155',
  card: '#0f172a',
  cardBorder: '#1e293b',

  // Text
  text: '#f8fafc',
  textMain: '#f8fafc',
  textSecondary: '#cbd5e1',
  textMuted: '#94a3b8',
  textLight: '#64748b',

  // Borders
  border: '#1e293b',
  borderLight: '#334155',

  // Status
  success: '#34d399',
  error: '#f87171',
  danger: '#f87171',
  warning: '#fbbf24',
  info: '#818cf8',

  // Constants
  white: '#ffffff',
  black: '#000000',
  overlay: 'rgba(0,0,0,0.7)',
  glassWhite: 'rgba(255,255,255,0.05)',

  // Category colors
  categoryPurple: '#818cf8',
  categoryPink: '#f472b6',
  categoryAmber: '#fbbf24',
  categoryGreen: '#34d399',
};

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 12,
  four: 16,
  five: 20,
  six: 24,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 48,
  massive: 64,
};

export const BorderRadius = {
  xs: 4,
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 20,
  pill: 50,
  full: 9999,
};

export const FontSize = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  hero: 36,
  display: 42,
};

export const FontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extrabold: '800' as const,
};

// Default export compatible with existing code
const Colors = LightColors;
export default Colors;
