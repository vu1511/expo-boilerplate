# Icon System

Custom path-based SVG icon system with theme integration for simple, scalable icons.

## Quick Usage

```tsx
import { Home, Edit, ChevronDown } from '@/assets/icons'

<Home size="lg" />
<Edit size={28} fill="#FF0000" />
<ChevronDown size="md" fill={theme.colors.tint} />
```
## Usage Examples

### Tab Navigation
```tsx
import { Home, Explore } from '@/assets/icons'

<Tabs.Screen
  name="index"
  options={{
    title: 'Home',
    tabBarIcon: ({ color }) => <Home size={28} fill={color} />,
  }}
/>
```

### Button with Icon
```tsx
import { Edit } from '@/assets/icons'

<Pressable onPress={handleEdit}>
  {({ pressed }) => (
    <Edit size="md" style={{ opacity: pressed ? 0.5 : 1 }} />
  )}
</Pressable>
```

## Creating Icons

1. **Create icon file:**
```tsx
// assets/icons/my-icon.tsx
import { createSinglePathSVG } from '@/lib/icons'

export const MyIcon = createSinglePathSVG({
  path: 'M12 2L2 7v10l10 5 10-5V7L12 2z'
})
```

2. **Export from index:**
```tsx
// assets/icons/index.ts
export * from './my-icon'
```

3. **Use the icon:**
```tsx
import { MyIcon } from '@/assets/icons'

<MyIcon size="md" fill={theme.colors.tint} />
```

## Size Options

- `xs` - 16px
- `sm` - 20px  
- `md` - 24px (default)
- `lg` - 28px
- `xl` - 32px
- Custom number: `size={30}`

## Features

- ✅ Theme integration (automatic color adaptation)
- ✅ Size variants (xs, sm, md, lg, xl)
- ✅ Custom fill colors
- ✅ TypeScript support
- ✅ Individual files for scalability

## Best Practices

- Each icon in its own file for scalability
- Use semantic names (e.g., `ChevronLeft` not `ArrowLeft`)
- Export all icons from `index.ts`
- Use theme colors for consistency