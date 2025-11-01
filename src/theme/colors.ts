const grayPalette = {
  gray50: '#FAFAFA',
  gray100: '#F5F5F5',
  gray200: '#EEEEEE',
  gray300: '#E0E0E0',
  gray400: '#BDBDBD',
  gray500: '#9E9E9E',
  gray600: '#757575',
  gray700: '#616161',
  gray800: '#424242',
  gray900: '#212121',
  gray950: '#141414',
}

const darkPalette = {
  neutral900: '#FFFFFF',
  neutral800: '#F4F2F1',
  neutral700: '#D7CEC9',
  neutral600: '#B6ACA6',
  neutral500: '#978F8A',
  neutral400: '#564E4A',
  neutral300: '#3C3836',
  neutral200: '#191015',
  neutral100: '#000000',

  primary600: '#F4E0D9',
  primary500: '#E8C1B4',
  primary400: '#DDA28E',
  primary300: '#D28468',
  primary200: '#C76542',
  primary100: '#A54F31',

  secondary500: '#DCDDE9',
  secondary400: '#BCC0D6',
  secondary300: '#9196B9',
  secondary200: '#626894',
  secondary100: '#41476E',

  accent500: '#FFEED4',
  accent400: '#FFE1B2',
  accent300: '#FDD495',
  accent200: '#FBC878',
  accent100: '#FFBB50',

  angry100: '#F2D6CD',
  angry500: '#C03403',

  overlay20: 'rgba(25, 16, 21, 0.2)',
  overlay50: 'rgba(25, 16, 21, 0.5)',
} as const

export const colorsDark = {
  ...grayPalette,
  white: '#FFFFFF',
  black: '#000000',
  palette: darkPalette,
  transparent: 'rgba(0, 0, 0, 0)',
  text: darkPalette.neutral800,
  textDim: darkPalette.neutral600,
  background: darkPalette.neutral200,
  border: darkPalette.neutral400,
  tint: darkPalette.primary500,
  tintInactive: darkPalette.neutral300,
  separator: darkPalette.neutral300,
  error: darkPalette.angry500,
  errorBackground: darkPalette.angry100,
} as const

const lightPalette = {
  neutral100: '#FFFFFF',
  neutral200: '#F4F2F1',
  neutral300: '#D7CEC9',
  neutral400: '#B6ACA6',
  neutral500: '#978F8A',
  neutral600: '#564E4A',
  neutral700: '#3C3836',
  neutral800: '#191015',
  neutral900: '#000000',

  primary100: '#F4E0D9',
  primary200: '#E8C1B4',
  primary300: '#DDA28E',
  primary400: '#D28468',
  primary500: '#C76542',
  primary600: '#A54F31',

  secondary100: '#DCDDE9',
  secondary200: '#BCC0D6',
  secondary300: '#9196B9',
  secondary400: '#626894',
  secondary500: '#41476E',

  accent100: '#FFEED4',
  accent200: '#FFE1B2',
  accent300: '#FDD495',
  accent400: '#FBC878',
  accent500: '#FFBB50',

  angry100: '#F2D6CD',
  angry500: '#C03403',

  overlay20: 'rgba(25, 16, 21, 0.2)',
  overlay50: 'rgba(25, 16, 21, 0.5)',
} as const

export const colorsLight = {
  ...grayPalette,
  white: '#FFFFFF',
  black: '#000000',
  /**
   * The palette is available to use, but prefer using the name.
   * This is only included for rare, one-off cases. Try to use
   * semantic names as much as possible.
   */
  palette: lightPalette,
  /**
   * A helper for making something see-thru.
   */
  transparent: 'rgba(0, 0, 0, 0)',
  /**
   * The default text color in many components.
   */
  text: lightPalette.neutral800,
  /**
   * Secondary text information.
   */
  textDim: lightPalette.neutral600,
  /**
   * The default color of the screen background.
   */
  background: lightPalette.neutral200,
  /**
   * The default border color.
   */
  border: lightPalette.neutral400,
  /**
   * The main tinting color.
   */
  tint: lightPalette.primary500,
  /**
   * The inactive tinting color.
   */
  tintInactive: lightPalette.neutral300,
  /**
   * A subtle color used for lines.
   */
  separator: lightPalette.neutral300,
  /**
   * Error messages.
   */
  error: lightPalette.angry500,
  /**
   * Error Background.
   */
  errorBackground: lightPalette.angry100,
} as const
