# Localization Guide

This project uses **react-i18next** and **expo-localization** for internationalization (i18n) support.

## 🌐 Supported Languages

- **English (en)** - Default
- **Vietnamese (vi)**

## 📁 Project Structure

```
locales/
├── en.json           # English translations
├── vi.json           # Vietnamese translations
└── index.ts          # i18n configuration

hooks/
└── useTranslation.ts # Custom translation hook
```

## 🚀 Quick Start

### Basic Usage

```typescript
import { useTranslation } from '@/hooks/useTranslation'

export default function MyComponent() {
  const { t } = useTranslation()
  
  return <Text>{t('common.submit')}</Text>
}
```

### With Interpolation

```typescript
// Translation: "Welcome to {{appName}}!"
<Text>{t('messages.welcome', { appName: 'My App' })}</Text>
```

### With Pluralization

```typescript
// Automatically handles singular/plural
<Text>{t('messages.itemsCount', { count: 5 })}</Text>
```

### Change Language

```typescript
const { changeLanguage } = useTranslation()

// Switch to Vietnamese
await changeLanguage('vi')

// Switch to English
await changeLanguage('en')
```

### Get Current Language

```typescript
const { currentLanguage } = useTranslation()
console.log(currentLanguage) // 'en' or 'vi'
```

## 📝 Translation Keys Structure

```json
{
  "common": {
    "submit": "Submit",
    "cancel": "Cancel",
    ...
  },
  "navigation": {
    "home": "Home",
    "explore": "Explore",
    ...
  },
  "auth": {
    "login": "Login",
    "logout": "Logout",
    ...
  },
  "messages": {
    "welcome": "Welcome to {{appName}}!",
    ...
  },
  "validation": {
    "required": "This field is required",
    ...
  },
  "settings": {
    "language": "Language",
    ...
  }
}
```

## 🎨 Language Switcher Component

The project includes a pre-built `LanguageSwitcher` component:

```typescript
import { LanguageSwitcher } from '@/components/language-switcher'

export default function SettingsScreen() {
  return (
    <View>
      <LanguageSwitcher />
    </View>
  )
}
```

## 🔧 Configuration

### i18n Configuration (`locales/index.ts`)

```typescript
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import * as Localization from 'expo-localization'

i18n
  .use(initReactI18next)
  .init({
    resources: { en, vi },
    lng: Localization.getLocales()[0]?.languageCode || 'en',
    fallbackLng: 'en',
    compatibilityJSON: 'v3', // Important for React Native
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false, // Important for React Native
    },
  })
```

## 📱 Device Language Detection

The app automatically detects the device language using `expo-localization`:

```typescript
const deviceLanguage = Localization.getLocales()[0]?.languageCode || 'en'
```

If the device language is not supported, it falls back to English.

## 🎯 Best Practices

### 1. Always Use Translation Keys

❌ **Don't**:
```typescript
<Text>Submit</Text>
```

✅ **Do**:
```typescript
<Text>{t('common.submit')}</Text>
```

### 2. Organize Keys Logically

Group related translations together:
- `common.*` - Common UI elements
- `navigation.*` - Navigation labels
- `auth.*` - Authentication related
- `messages.*` - User messages
- `validation.*` - Form validation
- `settings.*` - Settings screen

### 3. Use Namespaced Keys

```typescript
// Good
t('auth.login')
t('auth.logout')

// Avoid
t('login')
t('logout')
```

### 4. Handle Dynamic Content

```typescript
// With interpolation
t('messages.welcome', { appName: 'Expo' })

// With pluralization
t('messages.itemsCount', { count: items.length })
```

### 5. Provide Context

```typescript
// Instead of generic keys
t('button.save') // Could be "Save" or "Lưu"

// Use context-specific keys
t('profile.saveButton')
t('settings.saveChanges')
```

## 🌍 Adding New Languages

1. Create a new translation file:
```bash
touch locales/fr.json
```

2. Add translations:
```json
{
  "common": {
    "submit": "Soumettre",
    ...
  }
}
```

3. Update `locales/index.ts`:
```typescript
import fr from './fr.json'

const resources = {
  en: { translation: en },
  vi: { translation: vi },
  fr: { translation: fr }, // Add new language
}
```

4. Update `LanguageSwitcher` component:
```typescript
const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' }, // Add new language
]
```

## 🧪 Testing Different Languages

### On Device/Emulator

1. **iOS**: Settings → General → Language & Region
2. **Android**: Settings → System → Languages

### Programmatically

```typescript
import { useTranslation } from '@/hooks/useTranslation'

const { changeLanguage } = useTranslation()

// Test Vietnamese
await changeLanguage('vi')

// Test English
await changeLanguage('en')
```

## 🔍 TypeScript Support

For better type safety, you can create a type definition:

```typescript
// types/i18n.d.ts
import 'react-i18next'
import en from '@/locales/en.json'

declare module 'react-i18next' {
  interface CustomTypeOptions {
    resources: {
      translation: typeof en
    }
  }
}
```

This provides autocomplete for translation keys:

```typescript
// TypeScript will suggest available keys
t('common.submit') // ✅
t('common.invalid') // ❌ Error: Key doesn't exist
```

## 📚 Additional Resources

- [react-i18next Documentation](https://react.i18next.com/)
- [i18next Documentation](https://www.i18next.com/)
- [Expo Localization](https://docs.expo.dev/versions/latest/sdk/localization/)

## 🐛 Troubleshooting

### Translations Not Updating

Make sure you're importing the i18n config in your root layout:

```typescript
// app/_layout.tsx
import '@/locales'
```

### Missing Translations

Check the console for missing translation warnings. Always provide a fallback:

```typescript
i18n.init({
  fallbackLng: 'en', // Falls back to English
})
```

### Tab Labels Not Updating

Tab labels need to re-render when language changes. Make sure to use the `useTranslation` hook in the tab layout:

```typescript
// app/(tabs)/_layout.tsx
const { t } = useTranslation()

<Tabs.Screen
  name="index"
  options={{ title: t('navigation.home') }}
/>
```

## ✅ Checklist for New Features

When adding new features with text content:

- [ ] Add translation keys to `en.json`
- [ ] Add translation keys to `vi.json`
- [ ] Use `t()` function instead of hardcoded strings
- [ ] Test with both languages
- [ ] Handle pluralization if needed
- [ ] Handle interpolation for dynamic content
- [ ] Update this documentation if adding new categories