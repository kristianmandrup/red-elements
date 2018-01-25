export function expectIs(value) {
  expect(value).toBe(value)
}

export function expectError(value) {
  if (value && value.error) {
    return expect(value.error).toBeDefined()
  }

  expect(value instanceof Error).toBeTruthy()
}

export function expectNotError(value) {
  expect(value instanceof Error).not.toBeTruthy()
}

export function expectEqual(value) {
  expect(value).toEqual(value)
}

export function expectObj(value) {
  expect(typeof value).toBe('object')
}

export function expectObjs(...values) {
  values.map(v => expectObj)
}

export function expectFunction(value) {
  expect(typeof value).toBe('function')
}

export function expectFunctions(...values) {
  values.map(v => expectFunction)
}

export function expectString(value) {
  expect(typeof value).toBe('string')
}

export function expectTruthy(value) {
  expect(value).toBeTruthy()
}

export function expectArray(value) {
  expect(Array.isArray(value)).toBe(true)
}

export function expectDefined(value) {
  expect(value).toBeDefined()
}

export function expectUndefined(value) {
  expect(value).toBeUndefined()
}
