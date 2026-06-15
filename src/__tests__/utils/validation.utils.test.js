import { describe, it, expect } from 'vitest'
import {
  isEmail, isRequired, minLength, maxLength, isPhone, validate,
} from '../../shared/utils/validation.utils'

describe('isEmail', () => {
  it('accepts a valid email', () => {
    expect(isEmail('user@example.com')).toBe(true)
  })
  it('rejects missing @', () => {
    expect(isEmail('userexample.com')).toBe(false)
  })
  it('rejects missing domain', () => {
    expect(isEmail('user@')).toBe(false)
  })
  it('rejects empty string', () => {
    expect(isEmail('')).toBe(false)
  })
  it('accepts subdomain email', () => {
    expect(isEmail('user@mail.okas.io')).toBe(true)
  })
})

describe('isRequired', () => {
  it('returns true for non-empty string', () => {
    expect(isRequired('hello')).toBe(true)
  })
  it('returns false for empty string', () => {
    expect(isRequired('')).toBe(false)
  })
  it('returns false for whitespace only', () => {
    expect(isRequired('   ')).toBe(false)
  })
  it('returns false for null', () => {
    expect(isRequired(null)).toBe(false)
  })
  it('returns false for undefined', () => {
    expect(isRequired(undefined)).toBe(false)
  })
  it('returns true for number 0', () => {
    expect(isRequired(0)).toBe(true)
  })
})

describe('minLength', () => {
  it('passes when length equals min', () => {
    expect(minLength(3)('abc')).toBe(true)
  })
  it('passes when length exceeds min', () => {
    expect(minLength(3)('abcde')).toBe(true)
  })
  it('fails when length is below min', () => {
    expect(minLength(5)('abc')).toBe(false)
  })
})

describe('maxLength', () => {
  it('passes when length equals max', () => {
    expect(maxLength(5)('hello')).toBe(true)
  })
  it('passes when length is below max', () => {
    expect(maxLength(10)('hi')).toBe(true)
  })
  it('fails when length exceeds max', () => {
    expect(maxLength(3)('toolong')).toBe(false)
  })
})

describe('isPhone', () => {
  it('accepts a 10-digit number', () => {
    expect(isPhone('9876543210')).toBe(true)
  })
  it('accepts international format', () => {
    expect(isPhone('+91 98765 43210')).toBe(true)
  })
  it('rejects too short', () => {
    expect(isPhone('123')).toBe(false)
  })
})

describe('validate', () => {
  it('returns null when all rules pass', () => {
    const result = validate('hello@test.com', [
      { test: isRequired, message: 'Required' },
      { test: isEmail,    message: 'Invalid email' },
    ])
    expect(result).toBeNull()
  })

  it('returns first failing message', () => {
    const result = validate('', [
      { test: isRequired, message: 'Required' },
      { test: isEmail,    message: 'Invalid email' },
    ])
    expect(result).toBe('Required')
  })

  it('returns second rule message when first passes but second fails', () => {
    const result = validate('notanemail', [
      { test: isRequired, message: 'Required' },
      { test: isEmail,    message: 'Invalid email' },
    ])
    expect(result).toBe('Invalid email')
  })
})
