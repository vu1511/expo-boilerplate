import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  triggerBtn: {
    alignSelf: 'flex-start',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  popover: {
    borderRadius: 4,
    overflow: 'hidden',
    alignSelf: 'flex-start',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  visible: {
    opacity: 1,
  },
  hidden: {
    opacity: 0,
  },
  shadow: {
    shadowColor: '#424242',
    shadowOffset: {
      width: 4,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 5,
  },
})
