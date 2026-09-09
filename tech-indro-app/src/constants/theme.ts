import DefaultColors, {
  LightColors,
  DarkColors,
  Spacing,
  BorderRadius,
  FontSize,
  FontWeight,
} from './Colors';

export { Spacing, BorderRadius, FontSize, FontWeight };

export const MaxContentWidth = 1200;

export const Fonts = {
  regular: 'Inter',
  bold: 'Inter-Bold',
  mono: 'monospace',
};

export type ThemeColor = keyof typeof LightColors;

export const Colors = {
  light: {
    ...LightColors,
    backgroundElement: LightColors.surfaceAlt,
  },
  dark: {
    ...DarkColors,
    backgroundElement: DarkColors.surfaceAlt,
  },
  ...DefaultColors,
};

export default Colors;
