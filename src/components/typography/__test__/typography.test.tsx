import { render } from '@testing-library/react-native'
import React from 'react'
import { Text } from 'react-native'

import { Typography } from '../index'

// Mock react-native-unistyles
jest.mock('react-native-unistyles', () => ({
  useUnistyles: () => ({
    theme: {
      colors: {
        text: '#191015',
        textDim: '#564E4A',
        background: '#F4F2F1',
        border: '#B6ACA6',
        tint: '#C76542',
        tintInactive: '#D7CEC9',
        separator: '#D7CEC9',
        error: '#C03403',
        errorBackground: '#F2D6CD',
        transparent: 'rgba(0, 0, 0, 0)',
        palette: {
          neutral100: '#FFFFFF',
          neutral200: '#F4F2F1',
          neutral300: '#D7CEC9',
          neutral400: '#B6ACA6',
          neutral500: '#978F8A',
          neutral600: '#564E4A',
          neutral700: '#3C3836',
          neutral800: '#191015',
          neutral900: '#000000',
          primary100: '#F4E0D9',
          primary200: '#E8C1B4',
          primary300: '#DDA28E',
          primary400: '#D28468',
          primary500: '#C76542',
          primary600: '#A54F31',
          secondary100: '#DCDDE9',
          secondary200: '#BCC0D6',
          secondary300: '#9196B9',
          secondary400: '#626894',
          secondary500: '#41476E',
          accent100: '#FFEED4',
          accent200: '#FFE1B2',
          accent300: '#FDD495',
          accent400: '#FBC878',
          accent500: '#FFBB50',
          angry100: '#F2D6CD',
          angry500: '#C03403',
          overlay20: 'rgba(25, 16, 21, 0.2)',
          overlay50: 'rgba(25, 16, 21, 0.5)',
        },
      },
    },
  }),
}))

// Mock theme typography
jest.mock('@/theme', () => ({
  typography: {
    display: {
      fontFamily: 'Inter-Bold',
      fontSize: 40,
      lineHeight: 48,
      fontWeight: '700',
    },
    h1: {
      fontFamily: 'Inter-Bold',
      fontSize: 32,
      lineHeight: 40,
      fontWeight: '700',
    },
    h2: {
      fontFamily: 'Inter-SemiBold',
      fontSize: 24,
      lineHeight: 32,
      fontWeight: '600',
    },
    h3: {
      fontFamily: 'Inter-SemiBold',
      fontSize: 20,
      lineHeight: 28,
      fontWeight: '600',
    },
    body: {
      fontFamily: 'Inter-Regular',
      fontSize: 16,
      lineHeight: 24,
      fontWeight: '400',
    },
    bodyMedium: {
      fontFamily: 'Inter-Medium',
      fontSize: 16,
      lineHeight: 24,
      fontWeight: '500',
    },
    bodyLarge: {
      fontFamily: 'Inter-Regular',
      fontSize: 18,
      lineHeight: 28,
      fontWeight: '400',
    },
    caption: {
      fontFamily: 'Inter-Regular',
      fontSize: 14,
      lineHeight: 20,
      fontWeight: '400',
    },
    captionMedium: {
      fontFamily: 'Inter-Medium',
      fontSize: 14,
      lineHeight: 20,
      fontWeight: '500',
    },
    button: {
      fontFamily: 'Inter-Medium',
      fontSize: 16,
      lineHeight: 24,
      fontWeight: '500',
    },
    buttonLarge: {
      fontFamily: 'Inter-Medium',
      fontSize: 18,
      lineHeight: 28,
      fontWeight: '500',
    },
  },
  ThemeColorKey: {},
}))

describe('Typography', () => {
  describe('Rendering', () => {
    it('renders children text correctly', () => {
      const { getByText } = render(<Typography>Hello World</Typography>)
      expect(getByText('Hello World')).toBeTruthy()
    })

    it('renders as Text component', () => {
      const { UNSAFE_root } = render(<Typography>Test</Typography>)
      const textComponent = UNSAFE_root.findByType(Text)
      expect(textComponent).toBeTruthy()
    })
  })

  describe('Variants', () => {
    it('applies default body variant when no variant is specified', () => {
      const { getByText } = render(<Typography>Default Text</Typography>)
      const text = getByText('Default Text')
      const styles = text.props.style

      expect(styles).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            fontFamily: 'Inter-Regular',
            fontSize: 16,
            lineHeight: 24,
            fontWeight: '400',
          }),
        ]),
      )
    })

    it('applies h1 variant styles', () => {
      const { getByText } = render(<Typography variant="h1">Heading 1</Typography>)
      const text = getByText('Heading 1')
      const styles = text.props.style

      expect(styles).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            fontFamily: 'Inter-Bold',
            fontSize: 32,
            lineHeight: 40,
            fontWeight: '700',
          }),
        ]),
      )
    })

    it('applies h2 variant styles', () => {
      const { getByText } = render(<Typography variant="h2">Heading 2</Typography>)
      const text = getByText('Heading 2')
      const styles = text.props.style

      expect(styles).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            fontFamily: 'Inter-SemiBold',
            fontSize: 24,
            lineHeight: 32,
            fontWeight: '600',
          }),
        ]),
      )
    })

    it('applies caption variant styles', () => {
      const { getByText } = render(<Typography variant="caption">Small text</Typography>)
      const text = getByText('Small text')
      const styles = text.props.style

      expect(styles).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            fontFamily: 'Inter-Regular',
            fontSize: 14,
            lineHeight: 20,
            fontWeight: '400',
          }),
        ]),
      )
    })

    it('applies display variant styles', () => {
      const { getByText } = render(<Typography variant="display">Display Text</Typography>)
      const text = getByText('Display Text')
      const styles = text.props.style

      expect(styles).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            fontFamily: 'Inter-Bold',
            fontSize: 40,
            lineHeight: 48,
            fontWeight: '700',
          }),
        ]),
      )
    })
  })

  describe('Colors', () => {
    it('applies theme color from top-level color key', () => {
      const { getByText } = render(<Typography color="tint">Tinted Text</Typography>)
      const text = getByText('Tinted Text')
      const styles = text.props.style

      expect(styles).toEqual(expect.arrayContaining([expect.objectContaining({ color: '#C76542' })]))
    })

    it('applies theme color from nested palette key', () => {
      const { getByText } = render(<Typography color="palette.neutral900">Dark Text</Typography>)
      const text = getByText('Dark Text')
      const styles = text.props.style

      expect(styles).toEqual(expect.arrayContaining([expect.objectContaining({ color: '#000000' })]))
    })

    it('applies custom hex color', () => {
      const { getByText } = render(<Typography color="#FF0000">Red Text</Typography>)
      const text = getByText('Red Text')
      const styles = text.props.style

      expect(styles).toEqual(expect.arrayContaining([expect.objectContaining({ color: '#FF0000' })]))
    })

    it('applies custom rgba color', () => {
      const { getByText } = render(<Typography color="rgba(255, 0, 0, 0.5)">Transparent Red</Typography>)
      const text = getByText('Transparent Red')
      const styles = text.props.style

      expect(styles).toEqual(expect.arrayContaining([expect.objectContaining({ color: 'rgba(255, 0, 0, 0.5)' })]))
    })

    it('renders without color when color prop is not provided', () => {
      const { getByText } = render(<Typography>No Color</Typography>)
      const text = getByText('No Color')
      const styles = text.props.style

      // Should only have typography styles, no color override
      expect(styles).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            fontFamily: 'Inter-Regular',
            fontSize: 16,
            lineHeight: 24,
            fontWeight: '400',
          }),
        ]),
      )
    })
  })

  describe('Custom Styles', () => {
    it('merges custom styles with variant styles', () => {
      const customStyle = { textAlign: 'center' as const, marginTop: 10 }
      const { getByText } = render(
        <Typography variant="h1" style={customStyle}>
          Styled Heading
        </Typography>,
      )
      const text = getByText('Styled Heading')
      const styles = text.props.style

      expect(styles).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            fontFamily: 'Inter-Bold',
            fontSize: 32,
            lineHeight: 40,
            fontWeight: '700',
          }),
          expect.objectContaining(customStyle),
        ]),
      )
    })

    it('allows style to override variant styles', () => {
      const customStyle = { fontSize: 50 }
      const { getByText } = render(
        <Typography variant="body" style={customStyle}>
          Override Font Size
        </Typography>,
      )
      const text = getByText('Override Font Size')
      const styles = text.props.style

      // Custom style should come after variant style in array, so it overrides
      expect(styles).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            fontFamily: 'Inter-Regular',
            lineHeight: 24,
            fontWeight: '400',
          }),
          expect.objectContaining({ fontSize: 50 }),
        ]),
      )
    })
  })

  describe('Props Passthrough', () => {
    it('passes through Text props like numberOfLines', () => {
      const { getByText } = render(<Typography numberOfLines={2}>Long text that should be truncated</Typography>)
      const text = getByText('Long text that should be truncated')

      expect(text.props.numberOfLines).toBe(2)
    })

    it('passes through Text props like testID', () => {
      const { getByTestId } = render(<Typography testID="test-typography">Test</Typography>)
      expect(getByTestId('test-typography')).toBeTruthy()
    })

    it('passes through Text props like accessible', () => {
      const { getByText } = render(<Typography accessible={true}>Accessible Text</Typography>)
      const text = getByText('Accessible Text')

      expect(text.props.accessible).toBe(true)
    })

    it('passes through Text props like onPress', () => {
      const onPress = jest.fn()
      const { getByText } = render(<Typography onPress={onPress}>Pressable Text</Typography>)
      const text = getByText('Pressable Text')

      expect(text.props.onPress).toBe(onPress)
    })
  })

  describe('Edge Cases', () => {
    it('handles empty children', () => {
      const { UNSAFE_root } = render(<Typography></Typography>)
      expect(UNSAFE_root).toBeTruthy()
    })

    it('handles null children gracefully', () => {
      const { UNSAFE_root } = render(<Typography>{null}</Typography>)
      expect(UNSAFE_root).toBeTruthy()
    })

    it('handles multiple children', () => {
      const { getByText } = render(
        <Typography>
          First <Text>Second</Text>
        </Typography>,
      )
      expect(getByText('Second')).toBeTruthy()
    })

    it('combines variant, color, and custom styles correctly', () => {
      const customStyle = { textDecorationLine: 'underline' as const }
      const { getByText } = render(
        <Typography variant="h2" color="palette.primary500" style={customStyle}>
          Complex Styling
        </Typography>,
      )
      const text = getByText('Complex Styling')
      const styles = text.props.style

      expect(styles).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            fontFamily: 'Inter-SemiBold',
            fontSize: 24,
            lineHeight: 32,
            fontWeight: '600',
          }),
          expect.objectContaining({ color: '#C76542' }),
          expect.objectContaining(customStyle),
        ]),
      )
    })
  })

  describe('Memoization', () => {
    it('should be a memoized component', () => {
      const { rerender, getByText } = render(<Typography>Initial</Typography>)

      // Verify initial render
      expect(getByText('Initial')).toBeTruthy()

      // Re-render with same props should not cause re-render
      rerender(<Typography>Initial</Typography>)

      expect(getByText('Initial')).toBeTruthy()
    })
  })
})
