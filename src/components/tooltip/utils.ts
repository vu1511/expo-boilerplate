import { LayoutRectangle } from 'react-native'

type WindowSize = {
  width: number
  height: number
}

type ChildrenMeasurement = {
  width: number
  height: number
  pageX: number
  pageY: number
}

type TooltipLayout = LayoutRectangle

export type Measurement = {
  children: ChildrenMeasurement
  tooltip: TooltipLayout
  measured: boolean
}

export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right'

const getTooltipXPosition = (
  { pageX: childrenX, width: childrenWidth }: ChildrenMeasurement,
  { width: tooltipWidth }: TooltipLayout,
  { width: screenWidth }: WindowSize,
  edgeOffset: number
): number => {
  const halfChildrenWidth = childrenWidth / 2
  const tooltipSpacing = tooltipWidth / 2 + edgeOffset
  const leftSpacing = childrenX + halfChildrenWidth
  const rightSpacing = screenWidth - (childrenX + childrenWidth) + halfChildrenWidth
  const isChildrenOnLeft = leftSpacing < screenWidth / 2
  const center = childrenX + (childrenWidth - tooltipWidth) / 2

  if (isChildrenOnLeft) {
    const centerable = leftSpacing > tooltipSpacing
    return centerable ? center : edgeOffset
  } else {
    const centerable = rightSpacing > tooltipSpacing
    return centerable ? center : screenWidth - (tooltipWidth + edgeOffset)
  }
}

const getTooltipYPosition = (
  { pageY: childrenY, height: childrenHeight }: ChildrenMeasurement,
  { height: tooltipHeight }: TooltipLayout,
  { height: screenHeight }: WindowSize,
  offset: number
): number => {
  const halfChildrenWidth = childrenHeight / 2
  const tooltipSpacing = tooltipHeight / 2 + offset
  const topSpacing = childrenY + halfChildrenWidth
  const bottomSpacing = screenHeight - (childrenY + childrenHeight) + halfChildrenWidth
  const isChildrenOnTop = topSpacing < screenHeight / 2
  const center = childrenY + (childrenHeight - tooltipHeight) / 2

  if (isChildrenOnTop) {
    const centerable = topSpacing > tooltipSpacing
    return centerable ? center : offset
  } else {
    const centerable = bottomSpacing > tooltipSpacing
    return centerable ? center : screenHeight - (tooltipHeight + offset)
  }
}

export const getTooltipPosition = (
  { children, tooltip, measured }: Measurement,
  offset: number,
  edgeOffset: number,
  position: TooltipPlacement,
  windowSize: WindowSize
): { left: number; top: number; maxWidth?: number; maxHeight?: number } => {
  if (!measured) {
    return { left: 0, top: 0 }
  }

  if (position === 'top') {
    return {
      left: getTooltipXPosition(children, tooltip, windowSize, edgeOffset),
      top: children.pageY - (tooltip.height + offset),
      maxWidth: windowSize.width - edgeOffset * 2,
      maxHeight: children.pageY - (edgeOffset + offset),
    }
  } else if (position === 'bottom') {
    const top = children.pageY + children.height + offset

    return {
      top: top,
      left: getTooltipXPosition(children, tooltip, windowSize, edgeOffset),
      maxHeight: windowSize.height - (top + edgeOffset),
      maxWidth: windowSize.width - edgeOffset * 2,
    }
  } else if (position === 'left') {
    const nextWidth = children.pageX - offset - edgeOffset
    const maxWidth = nextWidth > 0 ? nextWidth : 0

    return {
      maxWidth,
      maxHeight: windowSize.height - edgeOffset * 2,
      left: children.pageX - (tooltip.width + offset),
      top: getTooltipYPosition(children, tooltip, windowSize, offset),
    }
  } else {
    const nextWidth = windowSize.width - (children.pageX + children.width + offset + edgeOffset)
    const maxWidth = nextWidth > 0 ? nextWidth : 0

    return {
      maxWidth,
      maxHeight: windowSize.height - edgeOffset * 2,
      left: children.pageX + children.width + offset,
      top: getTooltipYPosition(children, tooltip, windowSize, offset),
    }
  }
}
