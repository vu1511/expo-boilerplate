import { fireEvent, render, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react-native'
import { forwardRef, useRef, useState } from 'react'
import { Dimensions, Platform, Text, TouchableOpacity, View } from 'react-native'
import Popover from './popover'

jest.useFakeTimers()

jest.mock('react-native-portalize', () => {
  const { View } = require('react-native')

  return {
    Portal: ({ children }: any) => <View>{children}</View>,
    PortalProvider: ({ children }: any) => <View>{children}</View>,
  }
})

const ChildrenComponent = ({ onPress }: { onPress?(): void }) => {
  return <Text onPress={() => onPress?.()}>children component</Text>
}

const TriggerComponent = forwardRef<TouchableOpacity, { onPress?(): void }>(({ onPress }, ref) => {
  return (
    <TouchableOpacity ref={ref} onPress={onPress}>
      <Text>trigger component</Text>
    </TouchableOpacity>
  )
})

describe('Popover', () => {
  const LAYOUT_WIDTH = 393
  const LAYOUT_HEIGHT = 852
  const POPOVER_WIDTH = 200
  const POPOVER_HEIGHT = 100
  const TOOLTIP_WIDTH = 80
  const TOOLTIP_HEIGHT = 40

  const delay = (ms = 300) => waitFor(() => jest.advanceTimersByTime(ms)) // wait for ms = 300 before animation done

  const triggerOnLayoutEvent = async () => {
    await delay()
    fireEvent(screen.getByTestId('popover-wrapper'), 'layout', {
      nativeEvent: { layout: { x: 0, y: 0, width: 200, height: 100 } },
    })
  }

  const checkPopoverInvisible = async () => {
    const invisiblePopoverWrapper = await waitForElementToBeRemoved(() => screen.queryByTestId('popover-wrapper'))
    expect(invisiblePopoverWrapper).not.toBeOnTheScreen()
  }

  const checkPopoverVisible = () => {
    expect(screen.getByTestId('popover-wrapper')).toBeVisible()
  }

  const onTriggerComponentPress = () => {
    fireEvent(screen.getByText('trigger component'), 'press')
  }

  beforeAll(() => {
    const { x, y, width, height, pageX, pageY } = {
      x: 0,
      y: 0,
      pageX: 0,
      pageY: 0,
      width: TOOLTIP_WIDTH,
      height: TOOLTIP_HEIGHT,
    }

    // mock triggerRef.current.measure
    jest.spyOn(View.prototype, 'measure').mockImplementation((cb) => cb(x, y, width, height, pageX, pageY))
  })

  afterAll(() => {
    jest.clearAllMocks()
  })

  beforeAll(() => {
    Platform.OS = 'android'
    Dimensions.get = jest.fn().mockReturnValue({
      width: LAYOUT_WIDTH,
      height: LAYOUT_HEIGHT,
      fontScale: 1,
      scale: 1,
    })
  })

  afterAll(() => {
    jest.clearAllMocks()
  })

  describe('Show/Hide Popover', () => {
    // eslint-disable-next-line jest/expect-expect
    it('toggle popover by component', async () => {
      render(
        <Popover trigger={<TriggerComponent />}>
          <ChildrenComponent />
        </Popover>
      )

      onTriggerComponentPress()
      await triggerOnLayoutEvent()
      checkPopoverVisible()

      fireEvent(screen.getByTestId('popover-backdrop'), 'press')
      await checkPopoverInvisible()
    })

    // eslint-disable-next-line jest/expect-expect
    it('toggle controlled popover by state', async () => {
      const Component = () => {
        const [visible, setVisible] = useState(false)
        return (
          <Popover visible={visible} trigger={<TriggerComponent onPress={() => setVisible(true)} />}>
            <ChildrenComponent onPress={() => setVisible(false)} />
          </Popover>
        )
      }

      render(<Component />)

      onTriggerComponentPress()
      await triggerOnLayoutEvent()
      checkPopoverVisible()

      fireEvent(screen.getByText('children component'), 'press') // close by state (visible)
      await checkPopoverInvisible()
    })

    // eslint-disable-next-line jest/expect-expect
    it('toggle popover by ref', async () => {
      const Component = () => {
        const ref = useRef<TouchableOpacity>(null)
        const [visible, setVisible] = useState(false)
        return (
          <>
            <Popover trigger={ref} visible={visible} onBackdropPress={() => setVisible(false)}>
              <ChildrenComponent />
            </Popover>
            <TriggerComponent ref={ref} onPress={() => setVisible(true)} />
          </>
        )
      }

      render(<Component />)

      onTriggerComponentPress()
      await triggerOnLayoutEvent()
      checkPopoverVisible()

      fireEvent(screen.getByTestId('popover-backdrop'), 'press')
      await checkPopoverInvisible()
    })

    // eslint-disable-next-line jest/expect-expect
    it('toggle popover by function', async () => {
      const Component = () => {
        return (
          <Popover trigger={({ sourceRef, openPopover }) => <TriggerComponent ref={sourceRef} onPress={openPopover} />}>
            <ChildrenComponent />
          </Popover>
        )
      }

      render(<Component />)

      onTriggerComponentPress()
      await triggerOnLayoutEvent()
      checkPopoverVisible()

      fireEvent(screen.getByTestId('popover-backdrop'), 'press')
      await checkPopoverInvisible()
    })
  })

  describe('Popover position', () => {
    const ARROW_SIZE = 8
    const EDGE_OFFSET = 10

    it('right position', async () => {
      render(
        <Popover placement="right" trigger={<TriggerComponent />} edgeOffset={EDGE_OFFSET} arrowSize={ARROW_SIZE}>
          <ChildrenComponent />
        </Popover>
      )

      onTriggerComponentPress()

      await delay()
      const popoverWrapper = screen.getByTestId('popover-wrapper')
      fireEvent(popoverWrapper, 'layout', {
        nativeEvent: { layout: { x: 0, y: 0, width: POPOVER_WIDTH, height: POPOVER_HEIGHT } },
      })

      checkPopoverVisible()

      expect(popoverWrapper.props.style.transform[0].translateX).toBe(88) // popover width (80) + arrow size (8)
      expect(popoverWrapper.props.style.transform[1].translateY).toBe(10) // edgeOffset (10)
    })

    it('bottom position', async () => {
      render(
        <Popover placement="bottom" trigger={<TriggerComponent />} edgeOffset={EDGE_OFFSET} arrowSize={ARROW_SIZE}>
          <ChildrenComponent />
        </Popover>
      )

      onTriggerComponentPress()

      await delay()
      const popoverWrapper = screen.getByTestId('popover-wrapper')
      fireEvent(popoverWrapper, 'layout', {
        nativeEvent: { layout: { x: 0, y: 0, width: POPOVER_WIDTH, height: POPOVER_HEIGHT } },
      })

      checkPopoverVisible()

      expect(popoverWrapper.props.style.transform[0].translateX).toBe(10) // edgeOffset (10)
      expect(popoverWrapper.props.style.transform[1].translateY).toBe(48) // popover height (40) + arrow size (8)
    })
  })
})
