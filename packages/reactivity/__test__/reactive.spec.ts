import { describe, expect, test } from 'vitest'
import { isReactive, reactive } from '../src/observable'

describe('reactivity/reactive', () => {
  test('Object', () => {
    const original = { foo: 1 }
    const observed = reactive(original)
    expect(observed).not.toBe(original)
    expect(isReactive(original)).toBe(false)
    expect(isReactive(observed)).toBe(true)
    // get
    expect(observed.foo).toBe(1)
    // has
    expect('foo' in observed).toBe(true)
    // ownKeys
    expect(Object.keys(observed)).toEqual(['foo'])
  })
})
