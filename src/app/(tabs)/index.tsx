import { Image } from 'expo-image'
import { Link } from 'expo-router'
import { useRef } from 'react'
import { Platform, TouchableOpacity, View } from 'react-native'
import Keys from 'react-native-keys'
import { PopoverPlacement } from 'react-native-popover-view'
import { StyleSheet } from 'react-native-unistyles'

import { Typography } from '@/components'
import { DateTimeDemo } from '@/components/date-time-demo'
import { HelloWave } from '@/components/hello-wave'
import { LanguageSwitcher } from '@/components/language-switcher'
import ParallaxScrollView from '@/components/parallax-scroll-view'
import { useTheme } from '@/hooks/useTheme'
import { useTranslation } from '@/hooks/useTranslation'
import { BottomSheetService, ModalService, PopoverService, ToastService } from '@/services'
import { commonStyles } from '@/theme'

export default function HomeScreen() {
  const { t } = useTranslation()
  const { currentTheme, themeMode, setThemeMode } = useTheme()

  const popoverTrigger1Ref = useRef<View>(null)
  const popoverTrigger2Ref = useRef<View>(null)
  const popoverTrigger3Ref = useRef<View>(null)

  return (
    <ParallaxScrollView
      headerImage={<Image source={require('@/assets/images/partial-react-logo.png')} style={styles.reactLogo} />}
    >
      <View style={styles.titleContainer}>
        <Typography variant="h1">{t('messages.welcome', { appName: 'Expo Boilerplate' })}</Typography>
        <HelloWave />
      </View>
      <View style={styles.stepContainer}>
        <Typography>{t('settings.language')}</Typography>
        <LanguageSwitcher />
        <Typography style={styles.hintText}>{t('settings.changeLanguage')}</Typography>
      </View>

      <DateTimeDemo />

      <View style={styles.stepContainer}>
        <Typography>Toast Service</Typography>
        <View style={[commonStyles.row_items_center, commonStyles.gap_xs, { flexWrap: 'wrap' }]}>
          <TouchableOpacity
            style={styles.themeButton(false)}
            onPress={() =>
              ToastService.success('Internal implementation function to show toast', {
                description: 'This is a description of the toast',
              })
            }
          >
            <Typography>📢 Show toast</Typography>
          </TouchableOpacity>
          <TouchableOpacity style={styles.themeButton(false)} onPress={() => ToastService.hide()}>
            <Typography>❌ Hide toast</Typography>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.stepContainer}>
        <Typography>Modal Service</Typography>
        <View style={[commonStyles.row_items_center, commonStyles.gap_xs, { flexWrap: 'wrap' }]}>
          <TouchableOpacity
            style={styles.themeButton(false)}
            onPress={() =>
              ModalService.show(
                <View style={styles.modalContent}>
                  <Typography style={styles.modalTitle}>Modal Example</Typography>
                  <Typography>This is a modal dialog using ModalService.</Typography>
                  <Typography style={styles.modalHint}>
                    You can add any React component as content. Tap outside or swipe down to dismiss.
                  </Typography>
                  <Typography style={styles.modalHint}>
                    You can add any React component as content. Tap outside or swipe down to dismiss.
                  </Typography>
                  <TouchableOpacity
                    style={styles.modalButton}
                    onPress={() => {
                      ModalService.hide()
                    }}
                  >
                    <Typography style={styles.modalButtonText}>Close Modal</Typography>
                  </TouchableOpacity>
                </View>,
                {
                  dismissible: true,
                  animationType: 'slide',
                  onDismiss: () => {
                    ToastService.info('Modal was dismissed')
                  },
                },
              )
            }
          >
            <Typography>🪟 Show Modal</Typography>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.themeButton(false)}
            onPress={() =>
              ModalService.show(
                <View style={styles.modalContent}>
                  <Typography style={styles.modalTitle}>Fade Modal</Typography>
                  <Typography>This modal uses fade animation instead of slide.</Typography>
                  <TouchableOpacity style={styles.modalButton} onPress={() => ModalService.hide()}>
                    <Typography style={styles.modalButtonText}>Close</Typography>
                  </TouchableOpacity>
                </View>,
                {
                  animationType: 'fade',
                  dismissible: true,
                },
              )
            }
          >
            <Typography>✨ Fade Modal</Typography>
          </TouchableOpacity>
          <TouchableOpacity style={styles.themeButton(false)} onPress={() => ModalService.hide()}>
            <Typography>❌ Hide Modal</Typography>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.stepContainer}>
        <Typography>Bottom Sheet Service</Typography>
        <View style={[commonStyles.row_items_center, commonStyles.gap_xs, { flexWrap: 'wrap' }]}>
          <TouchableOpacity
            style={styles.themeButton(false)}
            onPress={() =>
              BottomSheetService.show(
                <View style={styles.bottomSheetContent}>
                  <Typography style={styles.bottomSheetTitle}>Bottom Sheet Example</Typography>
                  <Typography>This is a bottom sheet using BottomSheetService.</Typography>
                  <Typography style={styles.bottomSheetHint}>
                    Swipe down or tap outside to dismiss. You can add any content here.
                  </Typography>
                  <TouchableOpacity
                    style={styles.modalButton}
                    onPress={() => {
                      BottomSheetService.dismiss()
                    }}
                  >
                    <Typography style={styles.modalButtonText}>Close Bottom Sheet</Typography>
                  </TouchableOpacity>
                </View>,
                {
                  snapPoints: ['50%'],
                  enablePanDownToClose: true,
                  onDismiss: () => {
                    ToastService.info('Bottom sheet was dismissed')
                  },
                },
              )
            }
          >
            <Typography>📄 Show Bottom Sheet</Typography>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.themeButton(false)}
            onPress={() =>
              BottomSheetService.show(
                <View style={styles.bottomSheetContent}>
                  <Typography style={styles.bottomSheetTitle}>Multi-Snap Bottom Sheet</Typography>
                  <Typography>This bottom sheet has multiple snap points: 50% and 90%.</Typography>
                  <Typography style={styles.bottomSheetHint}>Try dragging it to different heights!</Typography>
                  <View style={styles.bottomSheetActions}>
                    <TouchableOpacity
                      style={styles.modalButton}
                      onPress={() => {
                        BottomSheetService.dismiss()
                        ToastService.success('Option 1 selected')
                      }}
                    >
                      <Typography style={styles.modalButtonText}>Option 1</Typography>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.modalButton}
                      onPress={() => {
                        BottomSheetService.dismiss()
                        ToastService.success('Option 2 selected')
                      }}
                    >
                      <Typography style={styles.modalButtonText}>Option 2</Typography>
                    </TouchableOpacity>
                  </View>
                </View>,
                {
                  snapPoints: ['50%', '90%'],
                  initialSnapPointIndex: 0,
                  enablePanDownToClose: true,
                },
              )
            }
          >
            <Typography>📊 Multi-Snap</Typography>
          </TouchableOpacity>
          <TouchableOpacity style={styles.themeButton(false)} onPress={() => BottomSheetService.dismiss()}>
            <Typography>❌ Dismiss</Typography>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.stepContainer}>
        <Typography>Popover Service</Typography>
        <View style={[commonStyles.row_items_center, commonStyles.gap_xs, { flexWrap: 'wrap' }]}>
          <TouchableOpacity
            ref={popoverTrigger1Ref}
            style={styles.themeButton(false)}
            onPress={() =>
              PopoverService.show(
                popoverTrigger1Ref,
                <View style={styles.popoverContent}>
                  <Typography style={styles.modalTitle}>Popover Example</Typography>
                  <Typography>This is a popover using PopoverService.</Typography>
                  <Typography style={styles.modalHint}>
                    Popovers are anchored to the trigger element and positioned automatically.
                  </Typography>
                  <TouchableOpacity
                    style={styles.modalButton}
                    onPress={() => {
                      PopoverService.hide()
                    }}
                  >
                    <Typography style={styles.modalButtonText}>Close Popover</Typography>
                  </TouchableOpacity>
                </View>,
                {
                  placement: PopoverPlacement.AUTO,
                  onDismiss: () => {
                    ToastService.info('Popover was dismissed')
                  },
                },
              )
            }
          >
            <Typography>💬 Show Popover</Typography>
          </TouchableOpacity>
          <TouchableOpacity
            ref={popoverTrigger2Ref}
            style={styles.themeButton(false)}
            onPress={() =>
              PopoverService.show(
                popoverTrigger2Ref,
                <View style={styles.popoverContent}>
                  <Typography style={styles.modalTitle}>Bottom Placement</Typography>
                  <Typography>This popover is positioned at the bottom.</Typography>
                  <View style={styles.popoverActions}>
                    <TouchableOpacity
                      style={styles.modalButton}
                      onPress={() => {
                        PopoverService.hide()
                        ToastService.success('Action 1 selected')
                      }}
                    >
                      <Typography style={styles.modalButtonText}>Action 1</Typography>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.modalButton}
                      onPress={() => {
                        PopoverService.hide()
                        ToastService.success('Action 2 selected')
                      }}
                    >
                      <Typography style={styles.modalButtonText}>Action 2</Typography>
                    </TouchableOpacity>
                  </View>
                </View>,
                {
                  placement: PopoverPlacement.BOTTOM,
                  onDismiss: () => {
                    ToastService.info('Bottom popover dismissed')
                  },
                },
              )
            }
          >
            <Typography>⬇️ Bottom</Typography>
          </TouchableOpacity>
          <TouchableOpacity
            ref={popoverTrigger3Ref}
            style={styles.themeButton(false)}
            onPress={() =>
              PopoverService.show(
                popoverTrigger3Ref,
                <View style={styles.popoverContent}>
                  <Typography style={styles.modalTitle}>Top Placement</Typography>
                  <Typography>This popover appears above the trigger.</Typography>
                  <Typography style={styles.modalHint}>
                    Try different placements: TOP, BOTTOM, LEFT, RIGHT, or AUTO.
                  </Typography>
                  <TouchableOpacity
                    style={styles.modalButton}
                    onPress={() => {
                      PopoverService.hide()
                    }}
                  >
                    <Typography style={styles.modalButtonText}>Close</Typography>
                  </TouchableOpacity>
                </View>,
                {
                  placement: PopoverPlacement.TOP,
                },
              )
            }
          >
            <Typography>⬆️ Top</Typography>
          </TouchableOpacity>
          <TouchableOpacity style={styles.themeButton(false)} onPress={() => PopoverService.hide()}>
            <Typography>❌ Hide</Typography>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.stepContainer}>
        <Typography>Theme</Typography>
        <View style={styles.themeSwitcher}>
          <TouchableOpacity style={styles.themeButton(themeMode === 'light')} onPress={() => setThemeMode('light')}>
            <Typography>☀️ Light</Typography>
          </TouchableOpacity>

          <TouchableOpacity style={styles.themeButton(themeMode === 'dark')} onPress={() => setThemeMode('dark')}>
            <Typography>🌙 Dark</Typography>
          </TouchableOpacity>

          <TouchableOpacity style={styles.themeButton(themeMode === 'system')} onPress={() => setThemeMode('system')}>
            <Typography>📱 System</Typography>
          </TouchableOpacity>
        </View>
        <Typography style={styles.hintText}>
          Current theme: {currentTheme} {themeMode !== 'system' && `(${themeMode} mode)`}
        </Typography>
      </View>
      <View style={styles.stepContainer}>
        <Typography>Step 1: Try it</Typography>
        <Typography>
          Edit <Typography>app/(tabs)/index.tsx</Typography> to see changes. Press{' '}
          <Typography>
            {Platform.select({
              ios: 'cmd + d',
              android: 'cmd + m',
              web: 'F12',
            })}
          </Typography>{' '}
          to open developer tools.
        </Typography>
      </View>
      <View style={styles.stepContainer}>
        <Link href="/modal">
          <Link.Trigger>
            <Typography>Step 2: Explore</Typography>
          </Link.Trigger>
          <Link.Preview />
          <Link.Menu>
            <Link.MenuAction title="Action" icon="cube" onPress={() => alert('Action pressed')} />
            <Link.MenuAction title="Share" icon="square.and.arrow.up" onPress={() => alert('Share pressed')} />
            <Link.Menu title="More" icon="ellipsis">
              <Link.MenuAction title="Delete" icon="trash" destructive onPress={() => alert('Delete pressed')} />
            </Link.Menu>
          </Link.Menu>
        </Link>

        <Typography>{`Tap the Explore tab to learn more about what's included in this starter app.`}</Typography>
      </View>
      <View style={styles.stepContainer}>
        <Typography>Step 3: Get a fresh start</Typography>
        <Typography>
          {`When you're ready, run `}
          <Typography>npm run reset-project</Typography> to get a fresh <Typography>app</Typography> directory. This
          will move the current <Typography>app</Typography> to <Typography>app-example</Typography>.
        </Typography>
      </View>
    </ParallaxScrollView>
  )
}

const styles = StyleSheet.create(({ spacing, typography, colors, borderRadius }) => {
  return {
    container: {
      backgroundColor: colors.background,
    },
    titleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
    },
    title: {
      fontFamily: typography.body,
    },
    stepContainer: {
      gap: spacing.xs,
      marginBottom: spacing.xs,
    },
    reactLogo: {
      height: 178,
      width: 290,
      bottom: 0,
      left: 0,
      position: 'absolute',
    },
    hintText: {
      fontSize: 12,
      opacity: 0.7,
      textAlign: 'center',
    },
    themeSwitcher: {
      flexDirection: 'row',
      gap: spacing.xs,
      justifyContent: 'center',
    },
    themeButton: (isActive: boolean) => ({
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: borderRadius.md,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: isActive ? colors.tint : colors.background,
      minWidth: 90,
      alignItems: 'center',
    }),
    modalContent: {
      gap: spacing.md,
      alignItems: 'center',
    },
    modalTitle: {
      ...typography.h2,
      marginBottom: spacing.xs,
    },
    modalHint: {
      ...typography.caption,
      opacity: 0.7,
      textAlign: 'center',
      marginTop: spacing.xs,
    },
    modalButton: {
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      borderRadius: borderRadius.md,
      backgroundColor: colors.tint,
      marginTop: spacing.md,
      minWidth: 120,
      alignItems: 'center',
    },
    modalButtonText: {
      color: colors.background,
      fontWeight: typography.button.fontWeight,
    },
    bottomSheetContent: {
      padding: spacing.lg,
      gap: spacing.md,
      alignItems: 'center',
      paddingBottom: spacing.xl,
    },
    bottomSheetTitle: {
      ...typography.h2,
      marginBottom: spacing.xs,
    },
    bottomSheetHint: {
      ...typography.caption,
      opacity: 0.7,
      textAlign: 'center',
      marginTop: spacing.xs,
    },
    bottomSheetActions: {
      flexDirection: 'row',
      gap: spacing.md,
      marginTop: spacing.md,
      width: '100%',
      justifyContent: 'space-around',
    },
    popoverContent: {
      gap: spacing.md,
      alignItems: 'center',
      minWidth: 200,
    },
    popoverActions: {
      flexDirection: 'row',
      gap: spacing.sm,
      marginTop: spacing.sm,
      width: '100%',
      justifyContent: 'space-around',
    },
  }
})
