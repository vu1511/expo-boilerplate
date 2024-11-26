import React, { FunctionComponentElement, ReactElement, ReactNode, useCallback, useMemo, useRef, useState } from 'react'
import {
  GestureResponderEvent,
  LayoutChangeEvent,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableWithoutFeedback,
  useWindowDimensions,
  View,
} from 'react-native'
import { Portal } from 'react-native-portalize'
import { getTooltipPosition, Measurement, TooltipPlacement } from './utils'

export type TooltipProps = {
  triangleSize?: number
  title: string | ReactElement
  titleStyle?: StyleProp<TextStyle>
  placement?: TooltipPlacement
  children:
    | ((open: () => void) => ReactNode)
    | FunctionComponentElement<{
        ref: React.RefObject<View>
        onPress?: null | ((event: GestureResponderEvent) => void) | undefined
      }>
  edgeOffset?: number
  offset?: number
  color?: string
}

export default function Tooltip({
  title,
  children,
  offset = 0,
  titleStyle,
  placement = 'top',
  triangleSize = 8,
  edgeOffset = 24,
  color = '#0D1A31',
}: TooltipProps) {
  const windowSize = useWindowDimensions()

  const triggerElementRef = useRef<View>(null)

  const [visible, setVisible] = useState(false)
  const [measurement, setMeasurement] = useState<Measurement>(defaultMeasurement)

  const handleOnLayout = ({ nativeEvent: { layout } }: LayoutChangeEvent) => {
    triggerElementRef.current?.measure((_x, _y, width, height, pageX, pageY) => {
      setMeasurement({
        children: { pageX, pageY, height, width },
        tooltip: layout,
        measured: true,
      })
    })
  }

  const onOpen = useCallback(() => {
    setVisible(true)
  }, [])

  const onClose = useCallback(() => {
    setVisible(false)
    setMeasurement(defaultMeasurement)
  }, [])

  const { tooltipStyle } = useMemo(() => {
    // const maxWidth = windowSize.width - offset * 2
    // const maxHeight = windowSize.height - offset * 2

    const { top, left, maxWidth, maxHeight } = getTooltipPosition(
      measurement,
      offset,
      edgeOffset,
      placement,
      windowSize
    )

    return {
      // triangleLeft: measurement.children.pageX - (triangleSize - measurement.children.width / 2),
      // triangleTop: placement === 'top' ? top + measurement.tooltip.height - triangleSize - 1 : top,
      tooltipStyle: {
        top,
        left,
        maxWidth,
        maxHeight,
        // maxWidth: windowSize.width - offset * 2,
      },
    }
  }, [measurement, placement, triangleSize, windowSize, offset])

  const triggerElement = useMemo(() => {
    if (typeof children === 'function') {
      return children(onOpen)
    } else if (React.isValidElement(children)) {
      return React.cloneElement(children, {
        onPress: onOpen,
        ref: triggerElementRef,
      })
    }
    return children
  }, [children, onOpen])

  return (
    <>
      {visible && (
        <Portal>
          <TouchableWithoutFeedback onPress={onClose}>
            <View style={styles.container}>
              {/* <View
                style={{
                  position: 'absolute',
                  top: triangleTop,
                  left: triangleLeft,
                  ...(measurement.measured ? styles.visible : styles.hidden),
                }}
              >
                <Triangle isDown={placement === 'top'} size={triangleSize} color={color} />
              </View> */}

              <View
                onLayout={handleOnLayout}
                style={[
                  styles.tooltip,
                  tooltipStyle,
                  {
                    padding: 8,
                    backgroundColor: color,
                    ...(measurement.measured ? styles.visible : styles.hidden),
                  },
                ]}
              >
                {typeof title === 'string' ? <Text style={[styles.tooltipTitle, titleStyle]}>{title}</Text> : title}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Portal>
      )}

      {triggerElement}
    </>
  )
}

const defaultMeasurement = {
  children: { width: 0, height: 0, pageX: 0, pageY: 0 },
  tooltip: { width: 0, height: 0, x: 0, y: 0 },
  measured: false,
}

const styles = StyleSheet.create({
  triggerBtn: {
    alignSelf: 'flex-start',
  },
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  tooltip: {
    overflow: 'hidden',
    alignSelf: 'flex-start',
    justifyContent: 'center',
  },
  tooltipTitle: {
    fontSize: 12,
    color: 'white',
    // ...Typography.body12Normal,
    // color: Colors.white,
  },
  visible: {
    opacity: 1,
  },
  hidden: {
    opacity: 0,
  },
})
