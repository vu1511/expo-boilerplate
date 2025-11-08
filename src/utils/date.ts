import 'dayjs/locale/en'
import 'dayjs/locale/vi'

import dayjs from 'dayjs'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import calendar from 'dayjs/plugin/calendar'
import isSameOrAfterPlugin from 'dayjs/plugin/isSameOrAfter'
import isSameOrBeforePlugin from 'dayjs/plugin/isSameOrBefore'
import isTodayPlugin from 'dayjs/plugin/isToday'
import isTomorrowPlugin from 'dayjs/plugin/isTomorrow'
import isYesterdayPlugin from 'dayjs/plugin/isYesterday'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import relativeTime from 'dayjs/plugin/relativeTime'
import utcPlugin from 'dayjs/plugin/utc'

import type { DateFormat, DateInput, DateUnit, ManipulateUnit } from '@/types/date'
import type { LanguageCode } from '@/types/i18next'

dayjs.extend(relativeTime)
dayjs.extend(calendar)
dayjs.extend(isTodayPlugin)
dayjs.extend(isYesterdayPlugin)
dayjs.extend(isTomorrowPlugin)
dayjs.extend(isSameOrBeforePlugin)
dayjs.extend(isSameOrAfterPlugin)
dayjs.extend(utcPlugin)
dayjs.extend(advancedFormat)
dayjs.extend(localizedFormat)

/**
 * Set the global locale for dayjs
 * @param locale - The locale code to set
 * @example
 * setDateLocale('vi') // Sets Vietnamese locale
 */
export const setDateLocale = (locale: LanguageCode) => {
  dayjs.locale(locale)
}

/**
 * Get the dayjs instance with current locale
 * @param date - Optional date input
 * @returns Dayjs instance
 * @example
 * const now = date()
 * const specificDate = date('2024-01-01')
 */
export const date = (date?: DateInput) => {
  return dayjs(date)
}

/**
 * Get the current date and time
 * @returns Current dayjs instance
 */
export const now = () => {
  return dayjs()
}

/**
 * Get the UTC date
 * @param date - Optional date input
 * @returns Dayjs instance in UTC
 */
export const utc = (date?: DateInput) => {
  return dayjs.utc(date)
}

/**
 * Format a date according to the specified format
 * @param date - The date to format
 * @param format - The format type or custom format string
 * @returns Formatted date string
 * @example
 * formatDate(new Date(), 'full')
 * formatDate(new Date(), 'YYYY-MM-DD')
 */
export const formatDate = (date: DateInput, format: DateFormat = 'medium'): string => {
  const d = dayjs(date)

  if (!d.isValid()) {
    return ''
  }

  switch (format) {
    case 'full':
      return d.format('dddd, MMMM D, YYYY [at] h:mm A')
    case 'long':
      return d.format('MMMM D, YYYY h:mm A')
    case 'medium':
      return d.format('MMM D, YYYY h:mm A')
    case 'short':
      return d.format('M/D/YYYY h:mm A')
    case 'date-only':
      return d.format('MMMM D, YYYY')
    case 'time-only':
      return d.format('h:mm A')
    case 'relative':
      return d.fromNow()
    case 'calendar':
      return d.calendar()
    default:
      return d.format(format)
  }
}

/**
 * Get relative time between two dates
 * @param date1 - The first date
 * @param date2 - The second date
 * @param withoutSuffix - If true, removes "ago" or "in" suffix
 * @returns Relative time string
 * @example
 * getRelativeTimeTo(date1, date2) // "2 hours ago"
 */
export const getRelativeTimeTo = (date1: DateInput, date2: DateInput, withoutSuffix = false): string => {
  return dayjs(date1).from(dayjs(date2), withoutSuffix)
}

/**
 * Get calendar time (e.g., "Today at 12:00 PM", "Yesterday at 3:30 PM")
 * @param date - The date to format
 * @returns Calendar formatted string
 * @example
 * getCalendarTime(new Date()) // "Today at 12:00 PM"
 */
export const getCalendarTime = (date: DateInput): string => {
  return dayjs(date).calendar()
}

/**
 * Check if a date is today
 * @param date - The date to check
 * @returns True if date is today
 */
export const isToday = (date: DateInput): boolean => {
  return dayjs(date).isToday()
}

/**
 * Check if a date is yesterday
 * @param date - The date to check
 * @returns True if date is yesterday
 */
export const isYesterday = (date: DateInput): boolean => {
  return dayjs(date).isYesterday()
}

/**
 * Check if a date is tomorrow
 * @param date - The date to check
 * @returns True if date is tomorrow
 */
export const isTomorrow = (date: DateInput): boolean => {
  return dayjs(date).isTomorrow()
}

/**
 * Check if a date is in the past
 * @param date - The date to check
 * @returns True if date is before now
 */
export const isPast = (date: DateInput): boolean => {
  return dayjs(date).isBefore(dayjs())
}

/**
 * Check if a date is in the future
 * @param date - The date to check
 * @returns True if date is after now
 */
export const isFuture = (date: DateInput): boolean => {
  return dayjs(date).isAfter(dayjs())
}

/**
 * Check if two dates are the same
 * @param date1 - The first date
 * @param date2 - The second date
 * @param unit - The unit of comparison (default: 'millisecond')
 * @returns True if dates are the same
 * @example
 * isSame(date1, date2, 'day')
 */
export const isSame = (date1: DateInput, date2: DateInput, unit?: DateUnit): boolean => {
  return dayjs(date1).isSame(dayjs(date2), unit)
}

/**
 * Check if a date is before another date
 * @param date1 - The date to check
 * @param date2 - The date to compare against
 * @param unit - The unit of comparison
 * @returns True if date1 is before date2
 */
export const isBefore = (date1: DateInput, date2: DateInput, unit?: DateUnit): boolean => {
  return dayjs(date1).isBefore(dayjs(date2), unit)
}

/**
 * Check if a date is after another date
 * @param date1 - The date to check
 * @param date2 - The date to compare against
 * @param unit - The unit of comparison
 * @returns True if date1 is after date2
 */
export const isAfter = (date1: DateInput, date2: DateInput, unit?: DateUnit): boolean => {
  return dayjs(date1).isAfter(dayjs(date2), unit)
}

/**
 * Check if a date is same or before another date
 * @param date1 - The date to check
 * @param date2 - The date to compare against
 * @param unit - The unit of comparison
 * @returns True if date1 is same or before date2
 */
export const isSameOrBefore = (date1: DateInput, date2: DateInput, unit?: DateUnit): boolean => {
  return dayjs(date1).isSameOrBefore(dayjs(date2), unit)
}

/**
 * Check if a date is same or after another date
 * @param date1 - The date to check
 * @param date2 - The date to compare against
 * @param unit - The unit of comparison
 * @returns True if date1 is same or after date2
 */
export const isSameOrAfter = (date1: DateInput, date2: DateInput, unit?: DateUnit): boolean => {
  return dayjs(date1).isSameOrAfter(dayjs(date2), unit)
}

/**
 * Add time to a date
 * @param date - The date to add to
 * @param value - The amount to add
 * @param unit - The unit of time to add
 * @returns New dayjs instance with added time
 * @example
 * addTime(new Date(), 2, 'days')
 */
export const addTime = (date: DateInput, value: number, unit: ManipulateUnit) => {
  return dayjs(date).add(value, unit)
}

/**
 * Subtract time from a date
 * @param date - The date to subtract from
 * @param value - The amount to subtract
 * @param unit - The unit of time to subtract
 * @returns New dayjs instance with subtracted time
 * @example
 * subtractTime(new Date(), 2, 'days')
 */
export const subtractTime = (date: DateInput, value: number, unit: ManipulateUnit) => {
  return dayjs(date).subtract(value, unit)
}

/**
 * Check if a date is valid
 * @param date - The date to validate
 * @returns True if date is valid
 */
export const isValidDate = (date: DateInput): boolean => {
  return dayjs(date).isValid()
}

/**
 * Get array of dates in a range
 * @param startDate - The start date
 * @param endDate - The end date
 * @param unit - The unit to increment (default: 'day')
 * @returns Array of dayjs instances
 * @example
 * getDateRange('2024-01-01', '2024-01-07') // [Day1, Day2, ..., Day7]
 */
export const getDateRange = (startDate: DateInput, endDate: DateInput, unit: ManipulateUnit = 'day') => {
  const dates: dayjs.Dayjs[] = []
  let current = dayjs(startDate)
  const end = dayjs(endDate)

  while (current.isBefore(end) || current.isSame(end, unit)) {
    dates.push(current)
    current = current.add(1, unit)
  }

  return dates
}

export { dayjs }
export default dayjs
