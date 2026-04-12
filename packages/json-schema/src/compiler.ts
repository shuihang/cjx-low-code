import { isArray, isFunction, isPlainObject, isString, reduce } from '@cjx-low-code/shared'
import { isNoNeedCompileObject } from './shared'
import type { IGeneralFieldState } from '@cjx-low-code/core'

const ExpRE = /^\s*\{\{([\s\S]*)\}\}\s*$/
const Registry = {
  silent: false,
  compile(expression: string, scope = {}) {
    if (Registry.silent) {
      try {
        return new Function('$root', `with($root) { return (${expression}); }`)(scope)
      } catch {}
    } else {
      return new Function('$root', `with($root) { return (${expression}); }`)(scope)
    }
  }
}

export const silent = (value = true) => {
  Registry.silent = !!value
}

export const registerCompiler = (compiler: (expression: string, scope: any) => any) => {
  if (isFunction(compiler)) {
    Registry.compile = compiler
  }
}

export const shallowCompile = <Source = any, Scope = any>(source: Source, scope?: Scope) => {
  if (isString(source)) {
    const matched = source.match(ExpRE)
    if (!matched) return source
    return Registry.compile(matched[1], scope || {})
  }
  return source
}

export const compile = <Source = any, Scope = any>(source: Source, scope?: Scope): any => {
  const seenObjects = []
  const compile = (source: any) => {
    if (isString(source)) {
      return shallowCompile(source, scope)
    } else if (isArray(source)) {
      return source.map((value: any) => compile(value))
    } else if (isPlainObject(source)) {
      if (isNoNeedCompileObject(source)) return source
      const seenIndex = seenObjects.indexOf(source as never)
      if (seenIndex > -1) {
        return source
      }
      const addIndex = seenObjects.length
      seenObjects.push(source as never)
      const results = reduce(
        source as Record<string, unknown>,
        (buf, value, key) => {
          buf[key] = compile(value)
          return buf
        },
        {}
      )
      seenObjects.splice(addIndex, 1)
      return results
    }
    return source
  }
  console.log(source)
  return compile(source)
}
