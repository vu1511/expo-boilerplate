import type { TransformsStyle } from 'react-native'

import {
  ChildrenMeasurement,
  ComputePopoverPosition,
  ComputeTransformAdjustments,
  EPopoverAutoDirection,
  EPopoverDirection,
  Measurement,
  PopoverDirection,
  PopoverLayout,
  PopoverOffsets,
  PopoverPlacement,
  Size,
} from './types'

export const defaultMeasurement: Measurement = {
  children: { width: 0, height: 0, pageX: 0, pageY: 0 },
  popover: { width: 0, height: 0, x: 0, y: 0 },
  measured: false,
  direction: EPopoverDirection.Bottom,
}

const computePopoverHorizontal = (
  { pageX: childrenX, width: childrenWidth }: ChildrenMeasurement,
  { width: popoverWidth }: PopoverLayout,
  { width: screenWidth }: Size,
  edgeOffset: number,
): number => {
  const halfChildrenWidth = childrenWidth / 2
  const popoverSpacing = popoverWidth / 2 + edgeOffset
  const leftSpacing = childrenX + halfChildrenWidth
  const rightSpacing = screenWidth - (childrenX + childrenWidth) + halfChildrenWidth
  const isChildrenOnLeft = leftSpacing < screenWidth / 2
  const center = childrenX + (childrenWidth - popoverWidth) / 2

  if (isChildrenOnLeft) {
    const centerable = leftSpacing > popoverSpacing
    return centerable ? center : edgeOffset
  } else {
    const centerable = rightSpacing > popoverSpacing
    return centerable ? center : screenWidth - (popoverWidth + edgeOffset)
  }
}

const computePopoverVertical = (
  { pageY: childrenY, height: childrenHeight }: ChildrenMeasurement,
  { height: popoverHeight }: PopoverLayout,
  { height: screenHeight }: Size,
  edgeOffset: number,
): number => {
  const halfChildrenHeight = childrenHeight / 2
  const popoverSpacing = popoverHeight / 2 + edgeOffset
  const topSpacing = childrenY + halfChildrenHeight
  const bottomSpacing = screenHeight - (childrenY + childrenHeight) + halfChildrenHeight
  const isChildrenOnTop = topSpacing < screenHeight / 2
  const center = childrenY + (childrenHeight - popoverHeight) / 2

  if (isChildrenOnTop) {
    const centerable = topSpacing > popoverSpacing
    return centerable ? center : edgeOffset
  } else {
    const centerable = bottomSpacing > popoverSpacing
    return centerable ? center : screenHeight - (popoverHeight + edgeOffset)
  }
}

export const computePopoverPosition: ComputePopoverPosition = (
  direction,
  { children, popover },
  windowSize,
  { offset, arrowSize, edgeOffset },
) => {
  switch (direction) {
    case EPopoverDirection.Left: {
      const top = computePopoverVertical(children, popover, windowSize, edgeOffset)
      return {
        y: top,
        x: children.pageX - (popover.width + offset + arrowSize),
        arrowX: popover.width,
        arrowY: Math.max(children.pageY + children.height / 2 - top - arrowSize / 2, arrowSize),
      }
    }
    case EPopoverDirection.Right: {
      const top = computePopoverVertical(children, popover, windowSize, edgeOffset)
      return {
        y: top,
        x: children.pageX + children.width + offset + arrowSize,
        arrowX: -arrowSize,
        arrowY: Math.max(children.pageY + children.height / 2 - top - arrowSize / 2, arrowSize),
      }
    }
    case EPopoverDirection.Top: {
      const left = computePopoverHorizontal(children, popover, windowSize, edgeOffset)
      return {
        x: left,
        y: children.pageY - (popover.height + offset + arrowSize),
        arrowY: popover.height,
        arrowX: children.pageX + children.width / 2 - left - arrowSize / 2,
      }
    }
    default: {
      const left = computePopoverHorizontal(children, popover, windowSize, edgeOffset)
      return {
        x: left,
        y: children.pageY + children.height + offset + arrowSize,
        arrowY: -arrowSize,
        arrowX: Math.max(children.pageX + children.width / 2 - left - arrowSize / 2, arrowSize),
      }
    }
  }
}

export const computeTransformAdjustments: ComputeTransformAdjustments = (
  direction,
  { width, height },
  { arrowSize, arrowX, arrowY },
  scale,
): Exclude<TransformsStyle['transform'], string | undefined> => {
  const maxArrowY = height / 2 - arrowSize / 2
  const maxArrowX = width / 2 - arrowSize / 2
  const translateY = maxArrowY - arrowY
  const translateX = maxArrowX - arrowX

  switch (direction) {
    case EPopoverDirection.Right:
      return [
        { translateX: -width / 2 },
        { translateY: -translateY },
        { scale },
        { translateX: width / 2 },
        { translateY: translateY },
      ]
    case EPopoverDirection.Bottom:
      return [
        { translateY: -height / 2 },
        { translateX: -translateX },
        { scale },
        { translateY: height / 2 },
        { translateX: translateX },
      ]
    case EPopoverDirection.Left:
      return [
        { translateX: width / 2 },
        { translateY: -translateY },
        { scale },
        { translateX: -width / 2 },
        { translateY: translateY },
      ]
    case EPopoverDirection.Top:
      return [
        { translateY: height / 2 },
        { translateX: -translateX },
        { scale },
        { translateY: -height / 2 },
        { translateX: translateX },
      ]
    default:
      return []
  }
}

export const computePopoverDirection = (
  placement: PopoverPlacement,
  children: ChildrenMeasurement,
  { width: screenWidth, height: screenHeight }: Size,
): PopoverDirection => {
  if (
    placement !== EPopoverAutoDirection.Auto &&
    placement !== EPopoverAutoDirection.AutoHorizontal &&
    placement !== EPopoverAutoDirection.AutoVertical
  ) {
    return placement
  }

  const topSpacing = children.pageY
  const bottomSpacing = screenHeight - (children.pageY + children.height)
  const leftSpacing = children.pageX
  const rightSpacing = screenWidth - (children.pageX + children.width)

  if (placement === EPopoverAutoDirection.AutoVertical) {
    return bottomSpacing >= topSpacing ? EPopoverDirection.Bottom : EPopoverDirection.Top
  }

  if (placement === EPopoverAutoDirection.AutoHorizontal) {
    return rightSpacing >= leftSpacing ? EPopoverDirection.Right : EPopoverDirection.Left
  }

  const spacings = {
    [EPopoverDirection.Top]: topSpacing,
    [EPopoverDirection.Bottom]: bottomSpacing,
    [EPopoverDirection.Left]: leftSpacing,
    [EPopoverDirection.Right]: rightSpacing,
  }

  return Object.entries(spacings).reduce((currDirection, [direction, spacing]) => {
    return spacing > spacings[currDirection] ? (direction as EPopoverDirection) : currDirection
  }, EPopoverDirection.Left as EPopoverDirection)
}

export const computePopoverSize = (
  direction: PopoverDirection,
  { children, popover }: Measurement,
  { width: screenWidth, height: screenHeight }: Size,
  { edgeOffset, offset, arrowSize }: PopoverOffsets,
): Size => {
  const result = { ...popover }
  let maxWidth = 0
  let maxHeight = 0

  if (direction === EPopoverDirection.Top) {
    maxWidth = screenWidth - edgeOffset * 2
    maxHeight = children.pageY - (edgeOffset + offset + arrowSize)
  } else if (direction === EPopoverDirection.Bottom) {
    const top = children.pageY + children.height + offset + arrowSize
    maxWidth = screenWidth - edgeOffset * 2
    maxHeight = screenHeight - (top + edgeOffset)
  } else if (direction === EPopoverDirection.Left) {
    maxWidth = children.pageX - (offset + edgeOffset + arrowSize)
    maxHeight = screenHeight - edgeOffset * 2
  } else {
    maxWidth = screenWidth - (children.pageX + children.width + offset + edgeOffset + arrowSize)
    maxHeight = screenHeight - edgeOffset * 2
  }

  if (popover.height > maxHeight) {
    result.height = maxHeight > 0 ? maxHeight : 0
  }
  if (popover.width > maxWidth) {
    result.width = maxWidth > 0 ? maxWidth : 0
  }

  return result
}
