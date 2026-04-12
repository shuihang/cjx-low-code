import { defineComponent } from 'vue'
import { each, merge } from '@cjx-low-code/shared'
import { h } from './h'
import type { VueComponent } from '../types'

type ListenersTransformRules = Record<string, string>

export const transformComponent = <T extends VueComponent>(
  tag: T,
  transformRules?: ListenersTransformRules,
  defaultProps?: Partial<T>
): T => {
  return defineComponent({
    name: tag.name,
    setup(props, { attrs, slots }) {
      return () => {
        let data = {
          ...attrs
        }
        if (transformRules) {
          const listeners = transformRules
          each(listeners, (event, extract) => {
            data[`on${event[0].toUpperCase()}${event.slice(1)}`] =
              attrs[`on${extract[0].toUpperCase()}${extract.slice(1)}`]
          })
        }
        if (defaultProps) {
          data = merge(defaultProps, attrs)
        }

        return h(tag, data, slots)
      }
    }
  }) as T
}
