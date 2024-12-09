import React, { Component, ReactElement, ReactNode, RefObject, useCallback, useMemo, useRef, useState } from 'react'
import {
  Animated,
  Easing,
  LayoutChangeEvent,
  StyleProp,
  StyleSheet,
  TouchableWithoutFeedback,
  useWindowDimensions,
  View,
  ViewStyle,
} from 'react-native'
import { Portal } from 'react-native-portalize'
import Arrow from './arrow'
import { styles } from './style'
import { Measurement, PopoverDirection, PopoverPlacement } from './types'
import {
  computePopoverDirection,
  computePopoverPosition,
  computePopoverSize,
  computeTransformAdjustments,
  defaultMeasurement,
} from './utils'

export type PopoverProps = {
  // visible?: boolean
  arrowSize?: number
  placement?: PopoverPlacement
  trigger: RefObject<Component> | ((sourceRef: RefObject<Component>, openPopover: () => void) => ReactNode) | ReactNode
  children: ReactElement
  popoverStyle?: StyleProp<ViewStyle>
  backgroundStyle?: StyleProp<ViewStyle>
  offset?: number
  edgeOffset?: number
}

/*
  TODO: 
  1. compute popover position with safeAreaInsets
  2. complete props
  3. allow pass width, height to arrow
  4. define document for props, show example
  5. modify position with autoVertical: priority show on bottom , autoHorizontal: priority show on right, auto
  6. support more animations
  7. support edge offset both width and height
*/

export default function Popover({
  // visible: externalVisible,
  trigger,
  children,
  offset = 0,
  popoverStyle: externalPopoverStyle,
  placement = 'top',
  arrowSize = 8,
  edgeOffset = 12,
  backgroundStyle,
}: PopoverProps) {
  const windowSize = useWindowDimensions()

  const childrenElementRef = useRef<View>(null)
  const triggerElementRef = useRef<View>(null)
  const scale = useRef(new Animated.Value(0)).current

  const opacityAnimated = scale.interpolate({ inputRange: [0, 1], outputRange: [0, 1] })

  const [visible, setVisible] = useState(false)
  const [measurement, setMeasurement] = useState<Measurement>(defaultMeasurement)

  const handleOnLayout = useCallback(
    ({ nativeEvent: { layout } }: LayoutChangeEvent) => {
      triggerElementRef.current?.measure((x, y, width, height, pageX, pageY) => {
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
    [placement, windowSize, edgeOffset, offset, arrowSize]
  )

  const onOpen = useCallback(async () => {
    setVisible(true)
    Animated.timing(scale, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
      easing: Easing.out(Easing.back(1)),
    }).start()
  }, [scale])

  const onClose = useCallback(() => {
    Animated.timing(scale, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
      easing: Easing.inOut(Easing.quad),
    }).start(() => {
      setVisible(false)
      setMeasurement(defaultMeasurement)
    })
  }, [scale])

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
    if (typeof trigger === 'function') {
      return trigger(triggerElementRef, onOpen)
    } else if (React.isValidElement(trigger)) {
      return React.cloneElement(trigger, {
        onPress: onOpen,
        ref: triggerElementRef,
      } as any)
    }
    return trigger
  }, [trigger, onOpen])

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

  return (
    <>
      {visible && (
        <Portal>
          <TouchableWithoutFeedback onPress={onClose}>
            <Animated.View style={[styles.overlay, backgroundStyle, { opacity: opacityAnimated }]}>
              <Animated.View ref={childrenElementRef} style={popoverWrapperStyle} onLayout={handleOnLayout}>
                <Animated.View style={arrowStyle}>
                  <Arrow direction={measurement.direction} size={arrowSize} color={backgroundColor} />
                </Animated.View>
                <Animated.View style={popoverStyles}>{children}</Animated.View>
              </Animated.View>
            </Animated.View>
          </TouchableWithoutFeedback>
        </Portal>
      )}

      {triggerElement}
    </>
  )
}
