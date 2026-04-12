import { Reaction } from '@cjx-low-code/reactivity'
import { useForceUpdate } from './useForceUpdate'
import type { IObserverOptions } from '../types'

export const useObserver = <T extends () => any>(
  view: T,
  options?: IObserverOptions
): ReturnType<T> => {
  const forceUpdate = useForceUpdate()
  const tracker = new Reaction(() => {
    if (typeof options?.scheduler === 'function') {
      options.scheduler(forceUpdate)
    } else {
      forceUpdate()
    }
    // options?.displayName
  })

  return tracker.track(view)
}
