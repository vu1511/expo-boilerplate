import type { Dayjs, ManipulateType, UnitType } from 'dayjs'

/**
 * Date utility types
 * Centralized type definitions for date utilities
 */

export type DateInput = string | number | Date | Dayjs | null | undefined

export type DateUnit = UnitType

export type ManipulateUnit = ManipulateType

export type DateFormat =
  | 'full' // Monday, January 1, 2024 at 12:00 PM
  | 'long' // January 1, 2024 12:00 PM
  | 'medium' // Jan 1, 2024 12:00 PM
  | 'short' // 1/1/2024 12:00 PM
  | 'date-only' // January 1, 2024
  | 'time-only' // 12:00 PM
  | 'relative' // 2 hours ago
  | 'calendar' // Today at 12:00 PM
  | 'YYYY-MM-DD' // 2024-01-31
  | 'DD/MM/YYYY' // 31/01/2024
  | 'MM/DD/YYYY' // 01/31/2024
  | 'DD-MM-YYYY' // 31-01-2024
  | 'YYYY/MM/DD' // 2024/01/31
  | 'MMM D, YYYY' // Jan 31, 2024
  | 'dddd, MMMM D, YYYY' // Wednesday, January 31, 2024
  | (string & {}) // Allow custom format strings while preserving autocomplete
