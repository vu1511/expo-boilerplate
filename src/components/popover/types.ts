import {
  type AnimatableNumericValue,
  type Animated,
  type LayoutRectangle,
  type TransformsStyle,
  type ViewStyle,
} from 'react-native'

export type Size = {
  width: number
  height: number
}

export type ChildrenMeasurement = {
  width: number
  height: number
  pageX: number
  pageY: number
}

export type PopoverLayout = LayoutRectangle

export type Measurement = {
  children: ChildrenMeasurement
  popover: PopoverLayout
  direction: PopoverDirection
  measured: boolean
}

export enum EPopoverDirection {
  Top = 'top',
  Right = 'right',
  Bottom = 'bottom',
  Left = 'left',
}

export enum EPopoverAutoDirection {
  Auto = 'auto',
  AutoVertical = 'autoVertical',
  AutoHorizontal = 'autoHorizontal',
}

export type PopoverDirection = `${EPopoverDirection}` | EPopoverDirection

export type PopoverPlacement = `${EPopoverAutoDirection}` | EPopoverAutoDirection | PopoverDirection

export type ComputePopoverPositionResult = {
  x: number
  y: number
  arrowX: number
  arrowY: number
}

export type PopoverOffsets = {
  offset: number
  arrowSize: number
  edgeOffset: number
}

export type ComputePopoverPosition = (
  direction: PopoverDirection,
  measurement: Measurement,
  windowSize: Size,
  offsets: PopoverOffsets
) => ComputePopoverPositionResult

export type ComputePopoverStyles = (
  scale: Animated.Value,
  opacityAnimated: Animated.AnimatedInterpolation<string | number>,
  direction: PopoverDirection,
  measurement: Measurement,
  windowSize: Size,
  offsets: PopoverOffsets
) => {
  arrowStyle: ViewStyle
  popoverStyle: ViewStyle
  popoverWrapperStyle: ViewStyle
}

export type ComputeTransformAdjustments = (
  direction: PopoverDirection,
  popover: LayoutRectangle,
  arrow: { arrowSize: number; arrowX: number; arrowY: number },
  scale: AnimatableNumericValue
) => Exclude<TransformsStyle['transform'], string | undefined>
