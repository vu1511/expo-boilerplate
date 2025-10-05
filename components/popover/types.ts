import { type LegacyRef, type ReactNode, type RefObject } from 'react'
import {
  type AnimatableNumericValue,
  type Animated,
  type LayoutRectangle,
  type StyleProp,
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
  offsets: PopoverOffsets,
) => ComputePopoverPositionResult

export type ComputePopoverStyles = (
  scale: Animated.Value,
  opacityAnimated: Animated.AnimatedInterpolation<string | number>,
  direction: PopoverDirection,
  measurement: Measurement,
  windowSize: Size,
  offsets: PopoverOffsets,
) => {
  arrowStyle: ViewStyle
  popoverStyle: ViewStyle
  popoverWrapperStyle: ViewStyle
}

export type ComputeTransformAdjustments = (
  direction: PopoverDirection,
  popover: LayoutRectangle,
  arrow: { arrowSize: number; arrowX: number; arrowY: number },
  scale: AnimatableNumericValue,
) => Exclude<TransformsStyle['transform'], string | undefined>

type Noop = () => void

export type PopoverProps = {
  /**
   * Controls the visibility of the popover.
   * Determine Popover is controlled component.
   * This prop is required when `trigger` is `ref` or `function`.
   */
  visible?: boolean

  /**
   * size of popover's arrow, set to `0` to hide, default value is `8`
   */
  arrowSize?: number

  /**
   * Determines the position of the popover, one of `top`, `right`, `bottom`, `left`, `auto`, `autoVertical`, `autoHorizontal`.
   * - `auto`: Automatically selects the best position (`top`, `right`, `bottom`, or `left`).
   * - `autoVertical`: Selects the best vertical position (`top` or `bottom`).
   * - `autoHorizontal`: Selects the best horizontal position (`left` or `right`).
   */
  placement?: PopoverPlacement

  /**
   * The element or function that triggers the popover.
   * The `ref` of the element must include a `measure` function.
   * Accepts one of the following:
   * - A React node.
   * - A `ref` object pointing to a React element.
   * - A function that returns a React node. This function receives props containing:
   *   - `sourceRef`: A `ref` to the trigger element.
   *   - `openPopover`: A function to open the popover programmatically.
   */
  trigger: ReactNode | RefObject<{}> | ((props: { sourceRef: LegacyRef<any>; openPopover: Noop }) => ReactNode)

  /**
   * The content displayed inside the popover.
   * Can be a React node or a function that returns a React node.
   * If `visible` is not set (uncontrolled mode), the function receives `closePopover`, a callback to close the popover.
   */
  children: ReactNode | ((props: { closePopover: Noop }) => ReactNode)

  /**
   * Custom styles for the popover container.
   * Use the `backgroundColor` property to change the background color of both the popover and the arrow.
   */
  popoverStyle?: StyleProp<ViewStyle>

  /**
   * Custom styles for the background overlay.
   */
  backgroundStyle?: StyleProp<ViewStyle>

  /**
   * Distance between the popover and the trigger element, in pixels.
   */
  offset?: number

  /**
   * Additional spacing between the popover and the edges of the screen, in pixels.
   */
  edgeOffset?: number

  /**
   * Determines whether tapping on the backdrop closes the popover. Default is `true`.
   */
  backdropClosable?: boolean

  /**
   * Callback function triggered when the backdrop is pressed.
   */
  onBackdropPress?: Noop

  /**
   * Callback function triggered when the popover starts closing.
   */
  onCloseStart?: Noop

  /**
   * Callback function triggered when the popover has completely closed.
   */
  onCloseComplete?: Noop

  /**
   * Callback function triggered when the popover starts opening.
   */
  onOpenStart?: Noop

  /**
   * Callback function triggered when the popover has completely opened.
   */
  onOpenComplete?: Noop

  /**
   * Callback function triggered when hardware button presses for back navigation.
   */
  onBackButtonPress?: Noop
}
