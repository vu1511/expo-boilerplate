import { PropsWithChildren, useState } from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import { useUnistyles } from 'react-native-unistyles'

import { ChevronRight } from '@/assets'
import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'

export function Collapsible({ children, title }: PropsWithChildren & { title: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const { theme } = useUnistyles()

  const styles = StyleSheet.create({
    heading: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
    },
    content: {
      marginTop: theme.spacing.xs,
      marginLeft: theme.spacing.lg,
    },
  })

  return (
    <ThemedView>
      <TouchableOpacity style={styles.heading} onPress={() => setIsOpen((value) => !value)} activeOpacity={0.8}>
        <ChevronRight
          size={18}
          color={theme.colors.text}
          style={{ transform: [{ rotate: isOpen ? '90deg' : '0deg' }] }}
        />

        <ThemedText type="defaultSemiBold">{title}</ThemedText>
      </TouchableOpacity>
      {isOpen && <ThemedView style={styles.content}>{children}</ThemedView>}
    </ThemedView>
  )
}
