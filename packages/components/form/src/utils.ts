import { computed } from 'vue'
import type { Ref } from 'vue'
import { isObject, isArray } from '../../_util/shared'
import type { DeepPartial } from '../../_util/type'

export const getValueByPath = (
  form: Ref<Record<string, any>>,
  path: string
) => {
  return computed({
    get() {
      let value = form.value
      if (!path) {
        return
      }
      if (path?.indexOf('.') === -1) {
        return value[path]
      }

      const pathArray = path.split('.')
      pathArray.forEach((prop, index) => {
        if (!value[prop]) {
          value[prop] = index === pathArray.length - 1 ? '' : {}
        }
        value = value[prop]
      })
      return value
    },
    set(newValue) {
      if (!path.includes('.')) {
        form.value[path] = newValue
        return
      }

      const pathArray = path.split('.')
      const lastProp = pathArray.pop()
      const obj = pathArray.reduce(
        (accumulator: Record<string, any>, currentValue) => {
          return accumulator[currentValue] || { [currentValue]: '' }
        },
        form.value
      )
      lastProp && (obj[lastProp] = newValue)
    },
  })
}

export function deepMerge<T extends object, K extends DeepPartial<T>>(target: T, source: K): T {
  const result = { ...target }
  
  Object.keys(source).forEach(key => {
    const sourceValue = source[key]
    if (sourceValue && isObject(sourceValue) && !isArray(sourceValue)) {
      result[key] = deepMerge((result[key] || {}), sourceValue)
    } else {
      result[key] = sourceValue
    }
  })
  
  return result
}