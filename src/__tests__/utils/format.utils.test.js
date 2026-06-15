import { describe, it, expect } from 'vitest'
import { capitalize, truncate, formatNumber, roleLabel } from '../../shared/utils/format.utils'

describe('capitalize', () => {
  it('capitalizes first letter and lowercases rest', () => {
    expect(capitalize('hELLO')).toBe('Hello')
  })
  it('handles single character', () => {
    expect(capitalize('a')).toBe('A')
  })
  it('returns empty string for empty input', () => {
    expect(capitalize('')).toBe('')
  })
  it('returns empty string for null/undefined', () => {
    expect(capitalize(null)).toBe('')
    expect(capitalize(undefined)).toBe('')
  })
})

describe('truncate', () => {
  it('returns original when under limit', () => {
    expect(truncate('hello', 10)).toBe('hello')
  })
  it('truncates and appends ellipsis when over limit', () => {
    const result = truncate('hello world', 5)
    expect(result).toBe('hello…')
  })
  it('uses default limit of 50', () => {
    const long = 'a'.repeat(51)
    const result = truncate(long)
    expect(result.endsWith('…')).toBe(true)
    expect(result.length).toBe(51)
  })
  it('returns undefined safely', () => {
    expect(truncate(undefined)).toBeUndefined()
  })
})

describe('formatNumber', () => {
  it('formats numbers in Indian numbering system', () => {
    const result = formatNumber(100000)
    expect(result).toBe('1,00,000')
  })
  it('returns dash for null', () => {
    expect(formatNumber(null)).toBe('—')
  })
  it('returns dash for undefined', () => {
    expect(formatNumber(undefined)).toBe('—')
  })
  it('formats zero', () => {
    expect(formatNumber(0)).toBe('0')
  })
})

describe('roleLabel', () => {
  it('maps admin', () => {
    expect(roleLabel('admin')).toBe('Admin')
  })
  it('maps distributor', () => {
    expect(roleLabel('distributor')).toBe('Distributor')
  })
  it('maps si', () => {
    expect(roleLabel('si')).toBe('System Integrator')
  })
  it('maps pm', () => {
    expect(roleLabel('pm')).toBe('Project Manager')
  })
  it('maps user', () => {
    expect(roleLabel('user')).toBe('User')
  })
  it('returns unknown role as-is', () => {
    expect(roleLabel('superuser')).toBe('superuser')
  })
})
