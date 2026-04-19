import type { Component, SetupContext } from 'vue'
export interface IObserverOptions {
  name?: string
  scheduler?: (updater: () => void) => void
}

export type ObserverComponent<T extends Component> = T & {
  setup?: (props: Record<string, any>, context: SetupContext) => any
}
