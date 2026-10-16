import type { TextStyle } from 'react-native';

// Fixel by MacPaw (SIL OFL 1.1). Display cuts for large numbers and titles,
// Text cuts for everything people read at body size.
export const fonts = {
  displayLight: 'FixelDisplay-Light',
  displaySemiBold: 'FixelDisplay-SemiBold',
  regular: 'FixelText-Regular',
  medium: 'FixelText-Medium',
  semiBold: 'FixelText-SemiBold',
};

export const type = {
  hero: {
    fontFamily: fonts.displayLight,
    fontSize: 112,
    lineHeight: 116,
    letterSpacing: -4,
  },
  title: {
    fontFamily: fonts.displaySemiBold,
    fontSize: 30,
    lineHeight: 36,
    letterSpacing: -0.4,
  },
  headline: { fontFamily: fonts.semiBold, fontSize: 17, lineHeight: 22 },
  body: { fontFamily: fonts.regular, fontSize: 16, lineHeight: 23 },
  callout: { fontFamily: fonts.medium, fontSize: 15, lineHeight: 20 },
  value: {
    fontFamily: fonts.displaySemiBold,
    fontSize: 24,
    lineHeight: 28,
  },
  caption: { fontFamily: fonts.regular, fontSize: 13, lineHeight: 18 },
  label: { fontFamily: fonts.medium, fontSize: 13, lineHeight: 18 },
} satisfies Record<string, TextStyle>;

export type TypeVariant = keyof typeof type;
