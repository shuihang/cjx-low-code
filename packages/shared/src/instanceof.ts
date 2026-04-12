import { globalThisPolyfill } from './global'
import { isFunction, isString } from './shared'
export const instOf = (value: any, cls: any) => {
  if (isFunction(cls)) return value instanceof cls
  if (isString(cls)) {
    return globalThisPolyfill[cls] ? value instanceof globalThisPolyfill[cls] : false
  }
  return false
}
