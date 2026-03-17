import {DefaultTheme} from '@react-navigation/native';

export const COLORS = {
  primary: '#FF2D08',
  secondary: '#CF240A',
  lightBlack: '#090302',
  black: '#000000',
  white: '#ffffff',
  grey1: '#dadada',
  grey2: '#cdcdcd',
  grey3: '#c0c0c0',
  grey4: '#b4b4b4',
  grey5: '#a7a7a7',
  grey6: '#9BA6B0',
  grey6: '#E2E8ED',
  grey200: '#C2D0DC',
  grey300: '#E2E8ED',
  grey400: '#DCDCDC',
  textGray: 'rgba(127, 127, 127, 1)',
  pink: 'rgba(232, 63, 111, 1)',
  yellow: 'rgba(255, 191, 0, 1)',
  green: '#1DC560',
  red: '#FF0000',
  blue: '#0EA0E8',
  lightblue: '#F1F5F8',
  lightYellow: '#FFF10A1A',
  darkGray: '#4C4F4D',
  danger: '#FF4D4F',
};

export const FONTS = {
  black: 'Poppins-Black',
  bold: 'Poppins-Bold',
  extraBold: 'Poppins-ExtraBold',
  extraLight: 'Poppins-ExtraLight',
  light: 'Poppins-Light',
  medium: 'Poppins-Medium',
  regular: 'Poppins-Regular',
  semiBold: 'Poppins-SemiBold',
  thin: 'Poppins-Thin',
  Italic: 'Poppins-Italic',
};

export const NavigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: COLORS.primary,
    background: COLORS.lightblue,
  },
};
