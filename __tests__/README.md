# Jest & React Native Testing Library Configuration Summary

## ✅ What Was Configured

### 1. **Dependencies Installed**
All testing dependencies are already in `package.json`:
- `jest` (v30.2.0)
- `jest-expo` (v54.0.12) - Expo preset for Jest
- `@testing-library/react-native` (v13.3.3)
- `@testing-library/jest-native` (v5.4.3)
- `@types/jest` (v30.0.0)

### 2. **Configuration Files**

#### `jest.config.js`
- **Preset**: `jest-expo` (critical for Expo projects)
- **Module Aliases**: Maps `@/*` to project root
- **Transform Patterns**: Configured to handle React Native, Expo, and related packages
- **Setup File**: Points to `jest.setup.ts`
- **Test Matching**: Finds `.test` and `.spec` files
- **Coverage**: Configured with appropriate exclusions

#### `jest.setup.ts`
- Extends Jest with `@testing-library/jest-native` matchers
- Mocks Expo Winter Runtime globals:
  - `__ExpoImportMetaRegistry`
  - `structuredClone`
- Pre-configured mocks for common Expo modules:
  - `expo-router`
  - `expo-haptics`
  - `expo-font`
  - `expo-asset`

### 3. **NPM Scripts**
Added to `package.json`:
```json
{
  "test": "jest",
  "test:watch": "jest --watch",
  "test:coverage": "jest --coverage"
}
```

### 4. **Example Test File**
Created `__tests__/example.test.tsx` demonstrating:
- Basic component rendering
- Using React Native Testing Library queries
- Using jest-native custom matchers

## 🚀 Usage

### Run Tests
```bash
# Run all tests
yarn test

# Run tests in watch mode
yarn test:watch

# Run with coverage
yarn test:coverage

# Run specific test file
yarn test path/to/file.test.tsx
```

### Write a Test
```tsx
import { render, screen, fireEvent } from '@testing-library/react-native'
import MyComponent from './MyComponent'

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />)
    
    expect(screen.getByText('Hello')).toBeTruthy()
    expect(screen.getByTestId('container')).toBeOnTheScreen()
  })

  it('should handle interaction', () => {
    const onPress = jest.fn()
    render(<MyComponent onPress={onPress} />)
    
    fireEvent.press(screen.getByText('Button'))
    
    expect(onPress).toHaveBeenCalledTimes(1)
  })
})
```

## 📚 Key Features

### Available Matchers (from jest-native)
- `toBeOnTheScreen()`
- `toBeVisible()`
- `toBeDisabled()`
- `toHaveTextContent(text)`
- `toHaveStyle(style)`
- And more...

### Testing Utilities
- `render()` - Render components
- `screen` - Query rendered components
- `fireEvent` - Trigger events
- `waitFor()` - Wait for async operations
- `cleanup()` - Clean up after tests (automatic)

## 🔧 Troubleshooting

### Module Not Found
If you get "Cannot find module" errors for Expo packages:
1. Add the package to `transformIgnorePatterns` in `jest.config.js`
2. Add a mock in `jest.setup.ts` if needed

### Async/Timer Issues
For components with animations or timers:
```tsx
jest.useFakeTimers()

it('test with animation', async () => {
  render(<AnimatedComponent />)
  
  jest.advanceTimersByTime(300)
  
  await waitFor(() => {
    expect(screen.getByTestId('element')).toBeVisible()
  })
})
```

### Navigation Testing
`expo-router` is already mocked. To customize:
```tsx
jest.mocked(useRouter).mockReturnValue({
  push: jest.fn(),
  // ... other methods
})
```

## 📖 Documentation
See `TESTING.md` for comprehensive testing guide and examples.

## ✨ Status
- ✅ Jest configured with jest-expo preset
- ✅ React Native Testing Library integrated
- ✅ Jest Native matchers available
- ✅ Expo runtime mocks in place
- ✅ Common Expo modules mocked
- ✅ Example tests passing
- ✅ Test scripts configured
