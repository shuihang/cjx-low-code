import { computed } from 'vue'
import type { Ref } from 'vue'

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
