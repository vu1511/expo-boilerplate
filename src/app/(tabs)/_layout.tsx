import { Tabs } from 'expo-router'
import React from 'react'
import { useUnistyles } from 'react-native-unistyles'

import { Explore, Home } from '@/assets/icons'
import { HapticTab } from '@/components/haptic-tab'
import { useTranslation } from '@/hooks/useTranslation'

export default function TabLayout() {
  const { t } = useTranslation()
  const { theme } = useUnistyles()

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.tint,
        tabBarInactiveTintColor: theme.colors.tintInactive,
        tabBarStyle: {
          backgroundColor: theme.colors.background,
          borderTopColor: theme.colors.separator,
          borderTopWidth: 1,
        },
        tabBarLabelStyle: {
          fontFamily: theme.fontFamily.inter.medium,
          fontSize: theme.fontSize.xs,
          fontWeight: theme.fontWeight.medium,
          marginTop: 4,
        },
        headerShown: false,
        tabBarButton: HapticTab,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('navigation.home'),
          tabBarIcon: ({ color }) => <Home size={28} fill={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: t('navigation.explore'),
          tabBarIcon: ({ color }) => <Explore size={28} fill={color} />,
        }}
      />
    </Tabs>
  )
}
