import { isArray, isFunction, isNumber, isRegExp, isString } from '@cjx-low-code/shared'
import { getDestructor, getInByDestructor, setInByDestructor } from './destructor'
import type { Pattern, Segments } from './types'

const isAssignable = (val: any) => typeof val === 'object' || typeof val === 'function'

const isNumberIndex = (val: any) => (isString(val) ? /^\d+$/.test(val) : isNumber(val))

const isSimplePath = (val: string) =>
  !val.includes('*') &&
  !val.includes('~') &&
  !val.includes('[') &&
  !val.includes(']') &&
  !val.includes(',') &&
  !val.includes(':') &&
  !val.includes(' ') &&
  val[0] !== '.'

const pathCache = new Map()

const isMatcher = Symbol('PATH_MATCHER')

const isValid = (val: any) => val !== undefined && val !== null

const parseString = (source: any) => {
  if (isString(source)) {
    source = source.replace(/\s*/g, '')
    try {
      const { segments, isMatchPattern } = parse(source)
      return !isMatchPattern ? segments : source
    } catch {
      return source
    }
  } else if (source instanceof Path) {
    return source.segments
  }
  return source
}

const getIn = (segments: Segments, source: any) => {
  for (const index of segments) {
    const rules = getDestructor(index as string)
    if (!rules) {
      if (!isValid(source)) return
      source = source[index]
    } else {
      source = getInByDestructor(source, rules, { setIn, getIn })
      break
    }
  }
  return source
}

const setIn = (segments: Segments, source: any, value: any) => {
  for (let i = 0; i < segments.length; i++) {
    const index = segments[i]
    const rules = getDestructor(index as string)
    if (!rules) {
      if (!isValid(source) || !isAssignable(source)) return
      if (isArray(source) && !isNumberIndex(index)) {
        return
      }
      if (!isValid(source[index])) {
        if (value === undefined) {
          if (source[index] === null) source[index] = value
          return
        }
        if (i < segments.length - 1) {
          source[index] = isNumber(segments[i + 1]) ? [] : {}
        }
      }
      if (i === segments.length - 1) {
        source[index] = value
      }
      source = source[index]
    } else {
      setInByDestructor(source, rules, value, { setIn, getIn })
      break
    }
  }
}

const parse = (pattern: Pattern, base?: Pattern) => {
  if (pattern instanceof Path) {
    return {
      entire: pattern.entire,
      segments: pattern.segments.slice(),
      isRegExp: false
      // tree: pattern.tree
    }
  } else if (isString(pattern)) {
    if (!pattern) {
      return {
        entire: '',
        segments: [],
        isRegExp: false
      }
    }
    if (isSimplePath(pattern)) {
      return {
        entire: pattern,
        segments: pattern.split('.'),
        isRegExp: false
      }
    }
    // const parser = new Parser(pattern, Path.parse(base))
    // const tree = parser.parse()
    // if (!parser.isMatchPattern) {
    //   const segments = parser.data.segments
    //   return {
    //     entire: segments.join('.'),
    //     segments,
    //     tree,
    //     isRegExp: false
    //   }
    // } else {
    //   return {
    //     entire: pattern,
    //     segments: [],
    //     isRegExp: false,
    //     tree
    //   }
    // }
  } else if (isFunction(pattern) && pattern[isMatcher]) {
    return parse(pattern['path'])
  } else if (isArray(pattern)) {
    return {
      entire: pattern.join('.'),
      segments: pattern.reduce((buf, key) => {
        return buf.concat(parseString(key))
      }, []),
      isRegExp: false
    }
  } else if (isRegExp(pattern)) {
    return {
      entire: pattern,
      segments: [],
      isRegExp: true
    }
  } else {
    return {
      entire: '',
      isRegExp: false,
      segments: pattern !== undefined ? [pattern] : []
    }
  }
}

export class Path {
  public entire: string | RegExp
  public segments: string[] = []
  public isRegExp: boolean

  constructor(input: Pattern, base?: Pattern) {
    const { entire, segments, isRegExp } = parse(input, base)
    this.entire = entire
    this.segments = segments
    this.isRegExp = isRegExp
  }

  getIn = (source?: any) => {
    return getIn(this.segments, source)
  }

  setIn = (source?: any, value?: any) => {
    setIn(this.segments, source, value)
    return source
  }

  static parse(path: Pattern = '', base?: Pattern): Path {
    if (path instanceof Path) {
      const found = pathCache.get(path.entire)
      if (found) {
        return found
      } else {
        pathCache.set(path.entire, path)
        return path
      }
    } else if (path && path[isMatcher]) {
      return Path.parse(path['path'])
    } else {
      const key_ = base ? Path.parse(base) : ''
      const key = `${path}:${key_}`
      const found = pathCache.get(key)
      if (found) {
        return found
      } else {
        path = new Path(path, base)
        pathCache.set(key, path)
        return path
      }
    }
  }

  static getIn = (source: any, pattern: Pattern) => {
    const path = Path.parse(pattern)
    return path.getIn(source)
  }

  static setIn = (source: any, pattern: Pattern, value: any) => {
    const path = Path.parse(pattern)
    return path.setIn(source, value)
  }
}
