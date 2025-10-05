import { render, screen } from '@testing-library/react-native'
import { Text, View } from 'react-native'

describe('Example Test Suite', () => {
  it('should render a simple component', () => {
    const TestComponent = () => (
      <View testID="test-container">
        <Text>Hello, Testing!</Text>
      </View>
    )

    render(<TestComponent />)

    expect(screen.getByTestId('test-container')).toBeTruthy()
    expect(screen.getByText('Hello, Testing!')).toBeTruthy()
  })

  it('should use jest-native matchers', () => {
    const TestComponent = () => (
      <View testID="visible-view">
        <Text testID="test-text">Test Text</Text>
      </View>
    )

    render(<TestComponent />)

    expect(screen.getByTestId('visible-view')).toBeOnTheScreen()
    expect(screen.getByTestId('test-text')).toHaveTextContent('Test Text')
  })
})
