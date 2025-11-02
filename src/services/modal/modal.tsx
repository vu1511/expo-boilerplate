import { memo, useCallback } from 'react'
import { View } from 'react-native'
import Modal from 'react-native-modal'
import { StyleSheet, useUnistyles } from 'react-native-unistyles'

import { useModalStore } from './store'

/**
 * Modal Root Component
 *
 * Renders the modal component for displaying modals.
 * Configure default options here if needed.
 *
 * Must be placed in your app's root layout.
 */
export const ModalRoot = memo(() => {
  const { theme } = useUnistyles()
  const { visible, content, options, hide, reset } = useModalStore()

  const handleBackdropPress = useCallback(() => {
    if (options.dismissible) {
      hide()
    }
  }, [hide, options.dismissible])

  const onModalHide = useCallback(() => {
    options.onDismiss?.()
    reset()
  }, [options, reset])

  if (!content) {
    return null
  }

  return (
    <Modal
      isVisible={visible}
      style={styles.modal}
      backdropColor={theme.colors.black}
      animationIn={options.animationType === 'fade' ? 'fadeIn' : 'slideInUp'}
      animationOut={options.animationType === 'fade' ? 'fadeOut' : 'slideOutDown'}
      backdropOpacity={options.transparent ? 0.5 : 1}
      onModalHide={onModalHide}
      onBackdropPress={handleBackdropPress}
      onBackButtonPress={handleBackdropPress}
      onSwipeComplete={handleBackdropPress}
      useNativeDriverForBackdrop
      hideModalContentWhileAnimating
    >
      <View style={[styles.content, options.style]}>{content}</View>
    </Modal>
  )
})

const styles = StyleSheet.create(({ colors, spacing, borderRadius }) => ({
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 0,
  },
  content: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    maxHeight: '90%',
    maxWidth: '90%',
  },
}))
