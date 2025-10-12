import { cloneElement, isValidElement, type RefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  Animated,
  BackHandler,
  Easing,
  type LayoutChangeEvent,
  StyleProp,
  StyleSheet,
  TouchableWithoutFeedback,
  useWindowDimensions,
  type View,
  ViewStyle,
} from 'react-native'

import Arrow from './arrow'
import { styles } from './style'
import { Measurement, PopoverDirection, PopoverProps } from './types'
import {
  computePopoverDirection,
  computePopoverPosition,
  computePopoverSize,
  computeTransformAdjustments,
  defaultMeasurement,
} from './utils'

/*
  TODO: 
  1. compute popover position with safeAreaInsets
  2. support more animations
  3. support edge offset both width and height
*/

export default function Popover({
  visible: externalVisible,
  trigger,
  children,
  offset = 0,
  placement = 'auto',
  arrowSize = 8,
  edgeOffset = 12,
  backgroundStyle,
  backdropClosable = true,
  popoverStyle: externalPopoverStyle,
  onOpenStart,
  onOpenComplete,
  onCloseStart,
  onCloseComplete,
  onBackdropPress,
  onBackButtonPress,
}: PopoverProps) {
  const windowSize = useWindowDimensions()

  const hasExternalVisible = typeof externalVisible === 'boolean'

  const triggerRef = useRef<View | null>(null)
  const scale = useRef(new Animated.Value(0)).current

  const opacityAnimated = scale.interpolate({ inputRange: [0, 1], outputRange: [0, 1] })

  const [visible, setVisible] = useState(false)
  const visibleRef = useRef(visible)
  const [measurement, setMeasurement] = useState<Measurement>(defaultMeasurement)

  const onOpen = useCallback(() => {
    onOpenStart?.()
    setVisible(true)
    visibleRef.current = true
    Animated.timing(scale, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
      easing: Easing.out(Easing.back(1)),
    }).start(({ finished }) => {
      if (finished && onOpenComplete) {
        onOpenComplete()
      }
    })
  }, [scale, onOpenStart, onOpenComplete])

  const onClose = useCallback(() => {
    onCloseStart?.()
    Animated.timing(scale, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
      easing: Easing.inOut(Easing.quad),
    }).start(({ finished }) => {
      setVisible(false)
      visibleRef.current = false
      setMeasurement(defaultMeasurement)
      if (finished && onCloseComplete) {
        onCloseComplete()
      }
    })
  }, [scale, onCloseStart, onCloseComplete])

  if (hasExternalVisible && externalVisible !== visible) {
    if (externalVisible) {
      onOpen()
    } else {
      onClose()
    }
  }

  useEffect(() => {
    const handleBackPress = () => {
      if (visibleRef.current) {
        onBackButtonPress?.()
        return true
      }

      return false
    }

    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress)

    return () => backHandler.remove()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handlePressBackdrop = useCallback(() => {
    onBackdropPress?.()
    if (backdropClosable && !hasExternalVisible) {
      onClose()
    }
  }, [onClose, onBackdropPress, backdropClosable, hasExternalVisible])

  const handleOnLayout = useCallback(
    ({ nativeEvent: { layout } }: LayoutChangeEvent) => {
      triggerRef.current?.measure?.((x, y, width, height, pageX, pageY) => {
        console.log('trigger measure: ', { x, y, width, height, pageX, pageY })
        const nextMeasurement: Measurement = {
          measured: true,
          popover: layout,
          children: { pageX, pageY, height, width },
          direction: placement as PopoverDirection,
        }

        const direction = computePopoverDirection(placement, nextMeasurement.children, windowSize)
        const size = computePopoverSize(direction, nextMeasurement, windowSize, { edgeOffset, offset, arrowSize })

        nextMeasurement.direction = direction
        nextMeasurement.popover.width = size.width
        nextMeasurement.popover.height = size.height

        setMeasurement(nextMeasurement)
      })
    },
    [placement, windowSize, edgeOffset, offset, arrowSize],
  )

  const { popoverStyle, popoverWrapperStyle, arrowStyle } = useMemo<{
    arrowStyle: ViewStyle
    popoverStyle: ViewStyle
    popoverWrapperStyle: ViewStyle
  }>(() => {
    const { measured, popover, direction } = measurement

    if (!measured || !popover.width || !popover.height) {
      return {
        popoverStyle: {},
        arrowStyle: { position: 'absolute' },
        popoverWrapperStyle: { position: 'absolute', opacity: 0 },
      }
    }

    const { x, y, arrowX, arrowY } = computePopoverPosition(direction, measurement, windowSize, {
      offset,
      arrowSize,
      edgeOffset,
    })

    return {
      arrowStyle: { ...styles.shadow, position: 'absolute', left: arrowX, top: arrowY },
      popoverStyle: { maxWidth: popover.width, maxHeight: popover.height },
      popoverWrapperStyle: {
        ...styles.shadow,
        position: 'absolute',
        opacity: opacityAnimated,
        transform: [
          { translateX: x },
          { translateY: y },
          ...computeTransformAdjustments(direction, popover, { arrowSize, arrowX, arrowY }, scale),
        ],
      },
    }
  }, [measurement, windowSize, opacityAnimated, scale, arrowSize, offset, edgeOffset])

  const triggerElement = useMemo(() => {
    if (!trigger) return null

    if (isValidElement(trigger)) {
      if (hasExternalVisible) {
        // @ts-ignore
        return cloneElement(trigger, { ref: triggerRef })
      } else {
        return cloneElement(trigger, {
          // @ts-ignore
          ref: triggerRef,
          onPress: onOpen,
        })
      }
    } else if (typeof trigger === 'function') {
      return trigger({ sourceRef: triggerRef, openPopover: onOpen })
    } else if (Object.hasOwnProperty.call(trigger, 'current')) {
      triggerRef.current = (trigger as RefObject<View>).current
    }

    return null
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onOpen, trigger, visible, externalVisible])

  const { popoverStyles, backgroundColor } = useMemo<{
    popoverStyles: StyleProp<ViewStyle>
    backgroundColor: ViewStyle['backgroundColor']
  }>(() => {
    const style = StyleSheet.flatten(externalPopoverStyle)
    const background = style?.backgroundColor || styles.popover.backgroundColor

    return {
      backgroundColor: background,
      popoverStyles: [styles.popover, style, popoverStyle],
    }
  }, [popoverStyle, externalPopoverStyle])

  const RenderChildren = useMemo(() => {
    if (typeof children === 'function') {
      return children({
        closePopover: () => {
          if (!hasExternalVisible) {
            onClose()
          }
        },
      })
    } else if (children) {
      return children
    }

    return null
  }, [children, onClose, hasExternalVisible])

  return (
    <>
      {visible && (
        <>
          <TouchableWithoutFeedback testID="popover-backdrop" onPress={handlePressBackdrop}>
            <Animated.View style={[styles.backdrop, backgroundStyle, { opacity: opacityAnimated }]} />
          </TouchableWithoutFeedback>
          <Animated.View testID="popover-wrapper" style={popoverWrapperStyle} onLayout={handleOnLayout}>
            <Animated.View style={arrowStyle}>
              <Arrow direction={measurement.direction} size={arrowSize} color={backgroundColor} />
            </Animated.View>
            <Animated.View testID="popover-children" style={popoverStyles}>
              {RenderChildren}
            </Animated.View>
          </Animated.View>
        </>
      )}

      {triggerElement}
    </>
  )
}
