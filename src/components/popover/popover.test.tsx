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

const viewMeasureFn = jest.spyOn(View.prototype, 'measure')

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
  const PAGE_Y = 0
  const PAGE_X = 0
  const LAYOUT_WIDTH = 393
  const LAYOUT_HEIGHT = 852
  const POPOVER_WIDTH = 200
  const POPOVER_HEIGHT = 100
  const TRIGGER_WIDTH = 80
  const TRIGGER_HEIGHT = 40
  const ARROW_SIZE = 8
  const EDGE_OFFSET = 10

  const delay = (ms = 300) => waitFor(() => jest.advanceTimersByTime(ms)) // wait for ms = 300 before animation done

  const triggerOnLayoutEvent = async () => {
    await delay()
    fireEvent(screen.getByTestId('popover-wrapper'), 'layout', {
      nativeEvent: { layout: { x: 0, y: 0, width: POPOVER_WIDTH, height: POPOVER_HEIGHT } },
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
    Platform.OS = 'android'
    Dimensions.get = jest.fn().mockReturnValue({
      width: LAYOUT_WIDTH,
      height: LAYOUT_HEIGHT,
      fontScale: 1,
      scale: 1,
    })
  })

  afterAll(() => {
    jest.resetAllMocks()
  })

  describe('Show/Hide Popover', () => {
    beforeAll(() => {
      viewMeasureFn.mockImplementation((cb) => cb(0, 0, TRIGGER_WIDTH, TRIGGER_HEIGHT, PAGE_X, PAGE_Y))
    })

    afterAll(() => {
      jest.resetAllMocks()
    })

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
    const PAGE_X = 100
    const PAGE_Y = 100

    beforeAll(() => {
      viewMeasureFn.mockImplementation((cb) => cb(0, 0, TRIGGER_WIDTH, TRIGGER_HEIGHT, PAGE_X, PAGE_Y))
    })

    afterAll(() => {
      jest.resetAllMocks()
    })

    it('right position', async () => {
      render(
        <Popover placement="right" trigger={<TriggerComponent />} edgeOffset={EDGE_OFFSET} arrowSize={ARROW_SIZE}>
          <ChildrenComponent />
        </Popover>
      )

      onTriggerComponentPress()

      await triggerOnLayoutEvent()
      const popoverWrapper = screen.getByTestId('popover-wrapper')

      checkPopoverVisible()

      expect(popoverWrapper.props.style.transform[0].translateX).toBe(188) // pageX(100) + popover width(80) + arrow size(8)
      expect(popoverWrapper.props.style.transform[1].translateY).toBe(70) // pageY(100) + (trigger height(40) - popover height(100)) / 2
    })

    it('left position', async () => {
      render(
        <Popover placement="left" trigger={<TriggerComponent />} edgeOffset={EDGE_OFFSET} arrowSize={ARROW_SIZE}>
          <ChildrenComponent />
        </Popover>
      )

      onTriggerComponentPress()

      await triggerOnLayoutEvent()
      const popoverWrapper = screen.getByTestId('popover-wrapper')

      checkPopoverVisible()

      expect(popoverWrapper.props.style.transform[0].translateX).toBe(10) // edge offset(10)
      expect(popoverWrapper.props.style.transform[1].translateY).toBe(70) // pageY(100) + (trigger height(40) - popover height(100)) / 2
    })

    it('bottom position', async () => {
      render(
        <Popover placement="bottom" trigger={<TriggerComponent />} edgeOffset={EDGE_OFFSET} arrowSize={ARROW_SIZE}>
          <ChildrenComponent />
        </Popover>
      )

      onTriggerComponentPress()

      await triggerOnLayoutEvent()
      const popoverWrapper = screen.getByTestId('popover-wrapper')

      checkPopoverVisible()

      expect(popoverWrapper.props.style.transform[0].translateX).toBe(40) // pageX(100) + (trigger width(80) - popover width(200)) / 2
      expect(popoverWrapper.props.style.transform[1].translateY).toBe(148) // pageY(100) + popover height(40) + arrow size(8)
    })

    it('top position', async () => {
      render(
        <Popover placement="top" trigger={<TriggerComponent />} edgeOffset={EDGE_OFFSET} arrowSize={ARROW_SIZE}>
          <ChildrenComponent />
        </Popover>
      )

      onTriggerComponentPress()

      await triggerOnLayoutEvent()
      const popoverWrapper = screen.getByTestId('popover-wrapper')

      checkPopoverVisible()

      expect(popoverWrapper.props.style.transform[0].translateX).toBe(40) // pageX(100) + (trigger width(80) - popover width(200)) / 2
      expect(popoverWrapper.props.style.transform[1].translateY).toBe(10) // edge offset(10)
    })
  })

  describe('Popover maximum width and height when it overflows the screen size.', () => {
    const PAGE_X = 100
    const PAGE_Y = 100
    const POPOVER_WIDTH = 2000
    const POPOVER_HEIGHT = 2000

    const triggerOnLayoutEvent = async () => {
      await delay()
      fireEvent(screen.getByTestId('popover-wrapper'), 'layout', {
        nativeEvent: { layout: { x: 0, y: 0, width: POPOVER_WIDTH, height: POPOVER_HEIGHT } },
      })
    }

    beforeAll(() => {
      viewMeasureFn.mockImplementation((cb) => cb(0, 0, TRIGGER_WIDTH, TRIGGER_HEIGHT, PAGE_X, PAGE_Y))
    })

    afterAll(() => {
      jest.resetAllMocks()
    })

    it('maximum width and height from right position', async () => {
      render(
        <Popover placement="right" trigger={<TriggerComponent />} edgeOffset={EDGE_OFFSET} arrowSize={ARROW_SIZE}>
          <ChildrenComponent />
        </Popover>
      )

      onTriggerComponentPress()

      await triggerOnLayoutEvent()
      const popoverChildren = screen.getByTestId('popover-children')

      checkPopoverVisible()

      expect(popoverChildren.props.style.maxWidth).toBe(195) // layoutWidth(393) - children width(80) - arrow size(8) - pageX(100) - edgeOffset(10)
      expect(popoverChildren.props.style.maxHeight).toBe(832) // edgeOffset(10) * 2
    })

    it('maximum width and height from left position', async () => {
      render(
        <Popover placement="left" trigger={<TriggerComponent />} edgeOffset={EDGE_OFFSET} arrowSize={ARROW_SIZE}>
          <ChildrenComponent />
        </Popover>
      )

      onTriggerComponentPress()

      await triggerOnLayoutEvent()
      const popoverChildren = screen.getByTestId('popover-children')

      checkPopoverVisible()

      expect(popoverChildren.props.style.maxWidth).toBe(82) // pageX(100) - arrow size(8) - edgeOffset(10)
      expect(popoverChildren.props.style.maxHeight).toBe(832) // edgeOffset(10) * 2
    })

    it('maximum width and height from top position', async () => {
      render(
        <Popover placement="top" trigger={<TriggerComponent />} edgeOffset={EDGE_OFFSET} arrowSize={ARROW_SIZE}>
          <ChildrenComponent />
        </Popover>
      )

      onTriggerComponentPress()

      await triggerOnLayoutEvent()
      const popoverChildren = screen.getByTestId('popover-children')

      checkPopoverVisible()

      expect(popoverChildren.props.style.maxWidth).toBe(373) // pageY(100) - arrow size(8) - edgeOffset(10)
      expect(popoverChildren.props.style.maxHeight).toBe(82) // layoutWidth(393) - edgeOffset(10) * 2
    })

    it('maximum width and height from bottom position', async () => {
      render(
        <Popover placement="bottom" trigger={<TriggerComponent />} edgeOffset={EDGE_OFFSET} arrowSize={ARROW_SIZE}>
          <ChildrenComponent />
        </Popover>
      )

      onTriggerComponentPress()

      await triggerOnLayoutEvent()
      const popoverChildren = screen.getByTestId('popover-children')

      checkPopoverVisible()

      expect(popoverChildren.props.style.maxWidth).toBe(373) // pageY(100) - arrow size(8) - edgeOffset(10)
      expect(popoverChildren.props.style.maxHeight).toBe(694) // layoutHeight(852) - pageY(100) - triggerHeight(40) - edgeOffset(10) - arrowSize(8)
    })
  })
})
