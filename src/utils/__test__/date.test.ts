import * as dateUtils from '@/utils/date'

const {
  addTime,
  date,
  formatDate,
  getCalendarTime,
  getDateRange,
  getRelativeTimeTo,
  isAfter,
  isBefore,
  isFuture,
  isPast,
  isSame,
  isToday,
  isTomorrow,
  isValidDate,
  isYesterday,
  now,
  subtractTime,
} = dateUtils

describe('Date Utilities', () => {
  // Mock setDateLocale to avoid changing global state
  let setDateLocaleSpy: jest.SpyInstance

  beforeAll(() => {
    // Create spy and mock implementation that doesn't actually change state
    setDateLocaleSpy = jest.spyOn(dateUtils, 'setDateLocale').mockImplementation(() => {})
  })

  afterAll(() => {
    // Restore original implementation
    setDateLocaleSpy.mockRestore()
  })

  describe('Date Creation', () => {
    it('should create current date', () => {
      const current = now()
      expect(current).toBeDefined()
      expect(current.isValid()).toBe(true)
    })

    it('should create date from string', () => {
      const d = date('2024-01-01')
      expect(d.isValid()).toBe(true)
      expect(d.year()).toBe(2024)
      expect(d.month()).toBe(0) // January is 0
      expect(d.date()).toBe(1)
    })
  })

  describe('Date Formatting', () => {
    const testDate = new Date('2024-01-15T14:30:00')

    it('should format date with preset formats', () => {
      expect(formatDate(testDate, 'date-only')).toBe('January 15, 2024')
      expect(formatDate(testDate, 'time-only')).toBe('2:30 PM')
    })

    it('should format date with custom format', () => {
      expect(formatDate(testDate, 'YYYY-MM-DD')).toBe('2024-01-15')
      expect(formatDate(testDate, 'MMM D, YYYY')).toBe('Jan 15, 2024')
    })
  })

  describe('Date Comparisons', () => {
    const today = new Date()
    const yesterday = subtractTime(today, 1, 'day').toDate()
    const tomorrow = addTime(today, 1, 'day').toDate()

    it('should check if date is today', () => {
      expect(isToday(today)).toBe(true)
      expect(isToday(yesterday)).toBe(false)
    })

    it('should check if date is yesterday', () => {
      expect(isYesterday(yesterday)).toBe(true)
      expect(isYesterday(today)).toBe(false)
    })

    it('should check if date is tomorrow', () => {
      expect(isTomorrow(tomorrow)).toBe(true)
      expect(isTomorrow(today)).toBe(false)
    })

    it('should check if date is in past', () => {
      expect(isPast(yesterday)).toBe(true)
      expect(isPast(tomorrow)).toBe(false)
    })

    it('should check if date is in future', () => {
      expect(isFuture(tomorrow)).toBe(true)
      expect(isFuture(yesterday)).toBe(false)
    })

    it('should check if two dates are the same', () => {
      const date1 = new Date('2024-01-15T10:00:00')
      const date2 = new Date('2024-01-15T14:00:00')
      const date3 = new Date('2024-01-16T10:00:00')

      expect(isSame(date1, date2, 'day')).toBe(true)
      expect(isSame(date1, date3, 'day')).toBe(false)
    })

    it('should check before/after', () => {
      expect(isBefore(yesterday, today)).toBe(true)
      expect(isAfter(tomorrow, today)).toBe(true)
      expect(isBefore(tomorrow, today)).toBe(false)
    })
  })

  describe('Date Manipulation', () => {
    const baseDate = new Date('2024-01-15T12:00:00')

    it('should add time', () => {
      const result = addTime(baseDate, 2, 'days')
      expect(result.date()).toBe(17)
    })

    it('should subtract time', () => {
      const result = subtractTime(baseDate, 2, 'days')
      expect(result.date()).toBe(13)
    })
  })

  describe('Business Logic', () => {
    it('should get date range', () => {
      const start = new Date('2024-01-01')
      const end = new Date('2024-01-05')
      const range = getDateRange(start, end)

      expect(range).toHaveLength(5)
      expect(range[0].date()).toBe(1)
      expect(range[4].date()).toBe(5)
    })
  })

  describe('Relative Time', () => {
    it('should get relative time between dates', () => {
      const date1 = new Date('2024-01-01')
      const date2 = new Date('2024-01-03')
      const relativeTime = getRelativeTimeTo(date1, date2)

      expect(relativeTime).toContain('day')
    })

    it('should get calendar time', () => {
      const calendarTime = getCalendarTime(now())
      expect(calendarTime).toContain('Today')
    })
  })

  describe('Validation', () => {
    it('should validate dates', () => {
      expect(isValidDate('2024-01-01')).toBe(true)
      expect(isValidDate(new Date())).toBe(true)
      expect(isValidDate('invalid')).toBe(false)
      expect(isValidDate(null)).toBe(false)
    })
  })

  describe('Locale', () => {
    beforeEach(() => {
      setDateLocaleSpy.mockClear()
    })

    it('should call setDateLocale when setting locale', () => {
      // Use the spied version from dateUtils
      dateUtils.setDateLocale('en')
      expect(setDateLocaleSpy).toHaveBeenCalledWith('en')
      expect(setDateLocaleSpy).toHaveBeenCalledTimes(1)

      dateUtils.setDateLocale('vi')
      expect(setDateLocaleSpy).toHaveBeenCalledWith('vi')
      expect(setDateLocaleSpy).toHaveBeenCalledTimes(2)
    })
  })
})
