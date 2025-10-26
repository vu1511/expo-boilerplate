import { Dimensions, Platform } from 'react-native'

export const screen = Dimensions.get('window')
export const screenWidth = screen.width
export const screenHeight = screen.height
export const isIOS = Platform.OS === 'ios'
export const isAndroid = Platform.OS === 'android'
