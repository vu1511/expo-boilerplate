import { memo, useCallback, useMemo } from 'react'
import Popover, { PopoverMode, PopoverPlacement } from 'react-native-popover-view'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useUnistyles } from 'react-native-unistyles'

import { usePopoverStore } from './store'

/**
 * Popover Root Component
 *
 * Renders the popover component for displaying popovers.
 * Configure default options here if needed.
 *
 * Must be placed in your app's root layout.
 */
export const PopoverRoot = memo(() => {
  const { theme } = useUnistyles()
  const insets = useSafeAreaInsets()
  const { visible, content, triggerRef, options, hide, reset } = usePopoverStore()

  const handleRequestClose = useCallback(() => {
    options.onRequestClose?.()
    hide()
  }, [hide, options])

  const handleDismiss = useCallback(() => {
    options.onDismiss?.()
    reset()
  }, [options, reset])

  const popoverStyle = useMemo(
    () => ({
      backgroundColor: theme.colors.background,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      shadowColor: theme.colors.gray800,
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 8,
    }),
    [theme.colors.background, theme.colors.gray800, theme.borderRadius.md, theme.spacing.md],
  )

  const backgroundStyle = useMemo(
    () => ({
      backgroundColor: options.backgroundColor || theme.colors.transparent,
    }),
    [options.backgroundColor, theme.colors.transparent],
  )

  if (!content || !triggerRef) {
    return null
  }

  return (
    <Popover
      isVisible={visible}
      from={triggerRef}
      displayAreaInsets={insets}
      onRequestClose={handleRequestClose}
      onCloseComplete={handleDismiss}
      placement={options.placement || PopoverPlacement.AUTO}
      mode={PopoverMode.RN_MODAL}
      offset={options.offset}
      arrowSize={options.arrowSize}
      popoverStyle={[popoverStyle, options.style]}
      animationConfig={options.animationConfig}
      backgroundStyle={backgroundStyle}
    >
      {content}
    </Popover>
  )
})
