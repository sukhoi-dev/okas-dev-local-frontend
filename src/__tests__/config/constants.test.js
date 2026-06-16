import { describe, it, expect } from 'vitest'
import { APP_NAME, ROLES, ROUTE_PATHS, PAGINATION_DEFAULTS, HTTP_STATUS } from '../../config/constants'

describe('APP_NAME', () => {
  it('is WE.OKAS', () => {
    expect(APP_NAME).toBe('WE.OKAS')
  })
})

describe('ROLES', () => {
  it('defines all five roles', () => {
    expect(Object.keys(ROLES)).toHaveLength(5)
  })
  it('ADMIN maps to admin', () => {
    expect(ROLES.ADMIN).toBe('admin')
  })
  it('SYSTEM_INTEGRATOR maps to si', () => {
    expect(ROLES.SYSTEM_INTEGRATOR).toBe('si')
  })
})

describe('ROUTE_PATHS', () => {
  it('LOGIN path is correct', () => {
    expect(ROUTE_PATHS.LOGIN).toBe('/auth/login')
  })
  it('WEOKAS_PROJECTS path is correct', () => {
    expect(ROUTE_PATHS.WEOKAS_PROJECTS).toBe('/we-okas/projects')
  })
  it('all paths start with /', () => {
    Object.values(ROUTE_PATHS).forEach(path => {
      expect(path.startsWith('/')).toBe(true)
    })
  })
})

describe('PAGINATION_DEFAULTS', () => {
  it('default page is 1', () => {
    expect(PAGINATION_DEFAULTS.PAGE).toBe(1)
  })
  it('default page size is 10', () => {
    expect(PAGINATION_DEFAULTS.PAGE_SIZE).toBe(10)
  })
  it('page size options include 10', () => {
    expect(PAGINATION_DEFAULTS.PAGE_SIZE_OPTIONS).toContain(10)
  })
})

describe('HTTP_STATUS', () => {
  it('OK is 200', () => {
    expect(HTTP_STATUS.OK).toBe(200)
  })
  it('CREATED is 201', () => {
    expect(HTTP_STATUS.CREATED).toBe(201)
  })
  it('UNAUTHORIZED is 401', () => {
    expect(HTTP_STATUS.UNAUTHORIZED).toBe(401)
  })
  it('NOT_FOUND is 404', () => {
    expect(HTTP_STATUS.NOT_FOUND).toBe(404)
  })
  it('SERVER_ERROR is 500', () => {
    expect(HTTP_STATUS.SERVER_ERROR).toBe(500)
  })
})
