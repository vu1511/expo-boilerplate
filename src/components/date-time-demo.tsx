/**
 * Date Time Demo Component
 *
 * Example component demonstrating the usage of date utilities with multi-locale support.
 * This component shows various date formatting options and automatically updates when the locale changes.
 */

import { ScrollView, StyleSheet, Text, View } from 'react-native'

import { formatDate, isToday, isTomorrow, isYesterday, now } from '@/utils/date'

export function DateTimeDemo() {
  // Use translation hook to trigger re-renders when language changes
  const currentTime = now()

  const sampleDate = new Date('2024-01-15T14:30:00')

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Date Time Utilities Demo</Text>

      {/* Current Time */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Current Time</Text>
        <DateRow label="Now" value={formatDate(currentTime, 'full')} />
        <DateRow label="ISO String" value={currentTime.toISOString()} />
      </View>

      {/* Format Examples */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Format Examples</Text>
        <DateRow label="Full" value={formatDate(sampleDate, 'full')} />
        <DateRow label="Long" value={formatDate(sampleDate, 'long')} />
        <DateRow label="Medium" value={formatDate(sampleDate, 'medium')} />
        <DateRow label="Short" value={formatDate(sampleDate, 'short')} />
        <DateRow label="Date Only" value={formatDate(sampleDate, 'date-only')} />
        <DateRow label="Time Only" value={formatDate(sampleDate, 'time-only')} />
        <DateRow label="Custom (YYYY-MM-DD)" value={formatDate(sampleDate, 'YYYY-MM-DD')} />
      </View>

      {/* Date Checks */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Date Checks</Text>
        <DateRow label="Is Today" value={isToday(currentTime).toString()} />
        <DateRow label="Is Yesterday" value={isYesterday(currentTime).toString()} />
        <DateRow label="Is Tomorrow" value={isTomorrow(currentTime).toString()} />
      </View>
    </ScrollView>
  )
}

interface DateRowProps {
  label: string
  value: string
}

function DateRow({ label, value }: DateRowProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}:</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  section: {
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#555',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 8,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 6,
    alignItems: 'flex-start',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    width: 140,
    flexShrink: 0,
  },
  value: {
    fontSize: 14,
    color: '#333',
    flex: 1,
    flexWrap: 'wrap',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
})
