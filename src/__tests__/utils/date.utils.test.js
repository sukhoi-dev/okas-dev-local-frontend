import { describe, it, expect } from 'vitest'
import { formatDate, formatDateTime, timeAgo } from '../../shared/utils/date.utils'

describe('formatDate', () => {
  it('returns dash for null', () => {
    expect(formatDate(null)).toBe('—')
  })
  it('returns dash for undefined', () => {
    expect(formatDate(undefined)).toBe('—')
  })
  it('returns a non-empty string for a valid date', () => {
    const result = formatDate('2024-01-15')
    expect(typeof result).toBe('string')
    expect(result.length).toBeGreaterThan(0)
    expect(result).not.toBe('—')
  })
  it('formats ISO date string without throwing', () => {
    expect(() => formatDate('2024-06-12T10:00:00Z')).not.toThrow()
  })
})

describe('formatDateTime', () => {
  it('returns dash for null', () => {
    expect(formatDateTime(null)).toBe('—')
  })
  it('returns dash for undefined', () => {
    expect(formatDateTime(undefined)).toBe('—')
  })
  it('returns a non-empty string for a valid datetime', () => {
    const result = formatDateTime('2024-01-15T14:30:00Z')
    expect(typeof result).toBe('string')
    expect(result).not.toBe('—')
  })
})

describe('timeAgo', () => {
  it('returns "just now" for a very recent date', () => {
    const recent = new Date(Date.now() - 5000).toISOString()
    expect(timeAgo(recent)).toBe('just now')
  })
  it('returns minutes ago for a 2-minute-old date', () => {
    const twoMinAgo = new Date(Date.now() - 2 * 60 * 1000).toISOString()
    expect(timeAgo(twoMinAgo)).toBe('2 minutes ago')
  })
  it('returns hours ago for a 3-hour-old date', () => {
    const threeHrsAgo = new Date(Date.now() - 3 * 3600 * 1000).toISOString()
    expect(timeAgo(threeHrsAgo)).toBe('3 hours ago')
  })
  it('returns days ago for a 2-day-old date', () => {
    const twoDaysAgo = new Date(Date.now() - 2 * 86400 * 1000).toISOString()
    expect(timeAgo(twoDaysAgo)).toBe('2 days ago')
  })
  it('returns singular for exactly 1 day', () => {
    const oneDayAgo = new Date(Date.now() - 86400 * 1000).toISOString()
    expect(timeAgo(oneDayAgo)).toBe('1 day ago')
  })
})
