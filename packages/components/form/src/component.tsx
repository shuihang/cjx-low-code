import type { FunctionalComponent } from 'vue'

export const ZtComponent: FunctionalComponent = (_, { slots }) => {
  return <>{slots.default?.()}</>
}
