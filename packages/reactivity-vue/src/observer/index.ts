import { useObserver } from '../hooks/useObserver'
import type { IObserverOptions, ObserverComponent } from '../types'
import type { Component } from 'vue'

/**
 * 用于将 Vue 组件转换为响应式组件
 */
export const observer = function <T extends Component>(
  opts: ObserverComponent<T>,
  options?: IObserverOptions
): T {
  const name = options?.name || opts.name || 'ObservableComponent'

  return {
    name,
    ...opts,
    setup(props: Record<string, any>, context: any) {
      // 初始化 observer - useObserver 会拦截 instance.render
      useObserver(options)

      // 执行原始的 setup，直接返回结果
      // 不需要额外包裹，因为 useObserver 已经拦截了渲染
      return opts?.setup?.(props, context)
    }
  }
}

/**
 * 批量 observer
 * 用于同时转换多个组件
 */
export const observerBatch = (components: Record<string, any>, options?: IObserverOptions) => {
  const result: Record<string, any> = {}
  for (const [key, component] of Object.entries(components)) {
    result[key] = observer(component, { ...options, name: component.name || key })
  }
  return result
}
