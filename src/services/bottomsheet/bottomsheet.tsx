import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from '@gorhom/bottom-sheet'
import { useFocusEffect } from 'expo-router'
import { memo, useCallback, useEffect, useRef } from 'react'
import { BackHandler } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

import { useBottomSheetStore } from './store'

/**
 * Bottom Sheet Root Component
 *
 * Renders the bottom sheet component for displaying bottom sheets.
 * Configure default options here if needed.
 *
 * Must be placed in your app's root layout.
 */
export const BottomSheetRoot = memo(() => {
  const { visible, content, options, dismiss, reset } = useBottomSheetStore()
  const bottomSheetRef = useRef<BottomSheetModal>(null)

  useEffect(() => {
    if (visible) {
      bottomSheetRef.current?.present()
    } else {
      bottomSheetRef.current?.dismiss()
    }
  }, [visible])

  const onDismiss = useCallback(() => {
    options.onDismiss?.()
    reset()
  }, [options, reset])

  const handleSheetChanges = useCallback(
    (index: number) => {
      if (index === -1) {
        dismiss()
      }
    },
    [dismiss],
  )

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (visible) {
          dismiss()
          return true
        } else {
          return false
        }
      }
      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress)
      return () => subscription.remove()
    }, [dismiss, visible]),
  )

  const renderBackdrop = useCallback(
    ({ animatedIndex, style, ...rest }: BottomSheetBackdropProps) => {
      return (
        <BottomSheetBackdrop
          {...rest}
          style={style}
          onPress={dismiss}
          disappearsOnIndex={-1}
          pressBehavior="collapse"
          animatedIndex={animatedIndex}
        />
      )
    },
    [dismiss],
  )

  if (!content) {
    return null
  }

  const snapPoints = options.snapPoints || ['50%']

  return (
    <BottomSheetModalProvider>
      <BottomSheetModal
        ref={bottomSheetRef}
        index={options.initialSnapPointIndex ?? 0}
        snapPoints={snapPoints}
        style={styles.container}
        keyboardBehavior="extend"
        keyboardBlurBehavior="none"
        enableDynamicSizing={options.enableDynamicSizing}
        enablePanDownToClose={options.enablePanDownToClose}
        enableHandlePanningGesture={options.enableHandlePanningGesture}
        backgroundStyle={options.backgroundStyle || styles.background}
        handleIndicatorStyle={options.handleIndicatorStyle || styles.indicator}
        onDismiss={onDismiss}
        backdropComponent={renderBackdrop}
        onChange={handleSheetChanges}
      >
        <BottomSheetView style={styles.content}>{content}</BottomSheetView>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  )
})

const styles = StyleSheet.create(({ colors, spacing }) => ({
  container: {
    borderTopLeftRadius: spacing.md,
    borderTopRightRadius: spacing.md,
    backgroundColor: colors.background,
  },
  indicator: {
    backgroundColor: colors.gray500,
    height: 4,
    width: 48,
    borderRadius: spacing.xs,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.md,
  },
  background: {
    backgroundColor: colors.background,
  },
}))
