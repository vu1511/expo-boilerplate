import { StyleSheet } from 'react-native-unistyles'

export const styles = StyleSheet.create(({ colors, borderRadius }) => ({
  triggerBtn: {
    alignSelf: 'flex-start',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.palette.overlay50,
  },
  popover: {
    borderRadius: borderRadius.sm,
    overflow: 'hidden',
    alignSelf: 'flex-start',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  visible: {
    opacity: 1,
  },
  hidden: {
    opacity: 0,
  },
  shadow: {
    shadowColor: colors.text,
    shadowOffset: {
      width: 4,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 5,
  },
}))
