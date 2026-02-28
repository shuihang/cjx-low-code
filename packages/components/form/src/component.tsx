import type { FunctionalComponent } from 'vue'

export const XComponent: FunctionalComponent = (_, { slots }) => {
  return <>{slots.default?.()}</>
}
