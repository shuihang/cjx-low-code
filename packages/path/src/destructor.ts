import { isNumber, isValid } from '@cjx-low-code/shared'
import type { DestructorRules, Segments } from './types'

type Mutators = {
  getIn: (segments: Segments, source: any) => any
  setIn: (segments: Segments, source: any, value: any) => void
  deleteIn?: (segments: Segments, source: any) => any
  existIn?: (segments: Segments, source: any, start: number) => boolean
}

const DestructorCache = new Map()

export const getDestructor = (source: string) => {
  return DestructorCache.get(source)
}

export const setDestructor = (source: string, rules: DestructorRules) => {
  DestructorCache.set(source, rules)
}

export const getInByDestructor = (source: any, rules: DestructorRules, mutators: Mutators) => {
  let response = {}
  if (rules.length) {
    if (isNumber(rules[0]?.path?.[0])) {
      response = []
    }
  }
  source = isValid(source) ? source : {}
  rules.forEach(({ key, path }) => {
    if (path?.length && key) {
      mutators.setIn(path, response, source[key])
    }
  })
  return response
}

export const setInByDestructor = (
  source: any,
  rules: DestructorRules,
  value: any,
  mutators: Mutators
) => {
  rules.forEach(({ key, path }) => {
    if (path?.length && key) {
      mutators.setIn([key], source, mutators.getIn(path, value))
    }
  })
}
