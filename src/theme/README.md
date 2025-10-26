# Theme System Guide

A complete theming system powered by [react-native-unistyles](https://reactnativeunistyles.vercel.app/) with TypeScript support, light/dark modes, and responsive design.

## Quick Start

### 1. Typography Component (Recommended)

```tsx
import { Typography } from '@/components/typography'

// Basic usage
<Typography variant="h1">Heading</Typography>
<Typography variant="body">Body text</Typography>

// With theme colors
<Typography variant="h2" color="tint">Primary heading</Typography>
<Typography variant="body" color="textDim">Dimmed text</Typography>

// With nested palette colors
<Typography color="palette.neutral900">Dark text</Typography>
<Typography color="palette.primary500">Primary color</Typography>

// With custom colors
<Typography color="#FF0000">Custom red</Typography>
```

**Available variants:** `display`, `h1`, `h2`, `h3`, `body`, `bodyMedium`, `bodyLarge`, `caption`, `captionMedium`, `button`, `buttonLarge`

### 2. Custom Stylesheets

```tsx
import { StyleSheet } from 'react-native-unistyles'

const Component = () => {
  const { styles, theme } = useUnistyles()
  return <View style={styles.container} />
}

const styles = StyleSheet.create((theme) => ({
  container: {
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  },
  text: {
    color: theme.colors.text,
    fontSize: theme.fontSize.lg,
    fontFamily: theme.fontFamily.inter.medium,
  },
}))
```

### 3. Common Utilities

```tsx
import { commonStyles } from '@/theme'

<View style={[commonStyles.flex_row, commonStyles.p_md, commonStyles.gap_xs]}>
  <Text style={commonStyles.m_sm}>Quick styling</Text>
</View>
```

### 4. Theme Management

```tsx
import { useTheme } from '@/hooks/use-theme'

const Component = () => {
  const { themeMode, currentTheme, setThemeMode, isSystemTheme } = useTheme()
  
  return (
    <>
      <Text>Current: {currentTheme}</Text>
      <Button onPress={() => setThemeMode('light')}>Light</Button>
      <Button onPress={() => setThemeMode('dark')}>Dark</Button>
      <Button onPress={() => setThemeMode('system')}>System</Button>
    </>
  )
}
```

## Design Tokens

### Colors
```typescript
theme.colors.text           // Primary text
theme.colors.textDim        // Secondary text
theme.colors.background     // Background
theme.colors.border         // Borders
theme.colors.tint           // Primary/accent color
theme.colors.tintInactive   // Inactive state
theme.colors.separator      // Dividers
theme.colors.error          // Error state
theme.colors.errorBackground
theme.colors.transparent

// Nested palette (full TypeScript support)
theme.colors.palette.neutral[100-900]
theme.colors.palette.primary[100-600]
theme.colors.palette.secondary[100-500]
theme.colors.palette.accent[100-500]
theme.colors.palette.angry[100,500]
theme.colors.palette.overlay[20,50]
```

### Spacing (8pt grid)
```typescript
theme.spacing.xxxs  // 2
theme.spacing.xxs   // 4
theme.spacing.xs    // 8
theme.spacing.sm    // 12
theme.spacing.md    // 16
theme.spacing.lg    // 24
theme.spacing.xl    // 32
theme.spacing.xxl   // 48
theme.spacing.xxxl  // 64
```

### Typography
```typescript
// Font families (Inter)
theme.fontFamily.inter.regular
theme.fontFamily.inter.medium
theme.fontFamily.inter.semiBold
theme.fontFamily.inter.bold

// Font sizes
theme.fontSize.xs    // 12
theme.fontSize.sm    // 14
theme.fontSize.md    // 16
theme.fontSize.lg    // 18
theme.fontSize.xl    // 20
theme.fontSize.xxl   // 24
theme.fontSize.xxxl  // 32
theme.fontSize.display // 40

// Font weights
theme.fontWeight.light     // 300
theme.fontWeight.regular   // 400
theme.fontWeight.medium    // 500
theme.fontWeight.semiBold  // 600
theme.fontWeight.bold      // 700

// Line heights
theme.lineHeight.xs   // 16
theme.lineHeight.sm   // 20
theme.lineHeight.md   // 24
// ... etc

// Semantic typography
theme.typography.display
theme.typography.h1
theme.typography.h2
theme.typography.h3
theme.typography.body
theme.typography.bodyMedium
theme.typography.bodyLarge
theme.typography.caption
theme.typography.captionMedium
theme.typography.button
theme.typography.buttonLarge
```

### Other Tokens
```typescript
// Border radius
theme.borderRadius.none  // 0
theme.borderRadius.sm    // 4
theme.borderRadius.md    // 8
theme.borderRadius.lg    // 12
theme.borderRadius.xl    // 16
theme.borderRadius.full  // 9999

// Animation timing
theme.timing.quick   // 150
theme.timing.normal  // 300
theme.timing.slow    // 500
```

## Common Utilities (snake_case)

### Flexbox
```typescript
// Direction
flex_row, flex_col

// Alignment
items_center, items_start, items_end
justify_center, justify_between, justify_around, justify_evenly
self_start, self_center, self_end

// Flex properties
flex_1, grow_1, shrink_0, shrink_1
```

### Spacing Utilities
Pattern: `{property}_{direction}_{size}`

**Padding:** `p_xs`, `px_md`, `py_lg`, `pt_sm`, `pr_xl`, `pb_xs`, `pl_md`
**Margin:** `m_xs`, `mx_md`, `my_lg`, `mt_sm`, `mr_xl`, `mb_xs`, `ml_md`  
**Gap:** `gap_xs`, `r_gap_md`, `c_gap_lg`

Sizes: `xxxs`, `xxs`, `xs`, `sm`, `md`, `lg`, `xl`, `xxl`, `xxxl`

### Opacity
```typescript
opacity_0, opacity_50, opacity_75, opacity_100
```

## Advanced Usage

### Responsive Design
```tsx
const styles = StyleSheet.create((theme) => ({
  container: {
    padding: theme.spacing.md,
    variants: {
      xs: { flexDirection: 'column' },
      md: { flexDirection: 'row' },
    },
  },
}))
```

### Dynamic Styles
```tsx
const Component = ({ variant }: Props) => {
  const styles = StyleSheet.create((theme) => ({
    container: {
      backgroundColor: variant === 'primary' 
        ? theme.colors.tint 
        : theme.colors.background,
    },
  }))
  
  return <View style={styles.container} />
}
```

### Access Theme Outside Components
```tsx
import { UnistylesRuntime } from 'react-native-unistyles'

UnistylesRuntime.themeName            // 'light' | 'dark'
UnistylesRuntime.setTheme('dark')     // Change theme
UnistylesRuntime.theme.colors.tint    // Access theme values
```

## Theme Configuration

Theme preferences are automatically persisted using MMKV storage:
- **System mode** (default): Follows device theme
- **Light mode**: Always light
- **Dark mode**: Always dark

Theme is initialized at app launch via `getInitialTheme()` in `src/theme/utils.ts`.

## Best Practices

✅ **Use Typography component** for text
✅ **Use theme tokens** instead of hardcoded values  
✅ **Use common utilities** for simple layouts  
✅ **Create stylesheets** for complex components  
✅ **Leverage TypeScript** autocomplete (`theme.`)  
✅ **Test both themes** light and dark

❌ Don't hardcode colors: `color: '#000'`  
❌ Don't hardcode spacing: `padding: 16`  
❌ Don't mix theme approaches  

## Testing

Theme utilities are fully tested. See `src/theme/__test__/` for:
- ✅ Theme initialization tests
- ✅ Storage preference tests  
- ✅ System theme fallback tests
- ✅ Theme switching tests

Run tests: `npm test -- src/theme/__test__/utils.test.ts`

## Resources

- [Unistyles Docs](https://reactnativeunistyles.vercel.app/)
- [TypeScript Support](https://reactnativeunistyles.vercel.app/reference/typescript/)
- Theme tests: `src/theme/__test__/`

