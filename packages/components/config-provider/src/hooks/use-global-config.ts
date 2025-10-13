import { getCurrentInstance, provide, computed, unref, ref } from 'vue'
import type { MaybeRef } from '@vueuse/core'
import type { App, Ref } from 'vue'
import { localeContextKey } from '@cjx-low-code/hooks'
import type { ConfigProviderContext } from '../interface'


export const provideGlobalConfig = (
  config: MaybeRef<ConfigProviderContext>,
  app?: App,
  global = false
) => {
  const inSetup = !!getCurrentInstance()
  //const oldConfig = inSetup ? useGlobalConfig() : undefined

  const provideFn = app?.provide ?? (inSetup ? provide : undefined)
  if (!provideFn) {
    console.warn(
      'provideGlobalConfig',
      'You are using provideGlobalConfig() without a valid app instance. Use it inside setup() or pass an app instance.'
    )
    // if (inSetup)
    // debugWarn(
    //   'provideGlobalConfig',
    //   'provideGlobalConfig() can only be used inside setup().'
    // )
    return
  }

  const context = computed(() => {
    const cfg = unref(config)
    return cfg
    // if (!oldConfig?.value) return cfg
    // return mergeConfig(oldConfig.value, cfg)
  })
  
  // console.log('provideGlobalConfig', context.value.locale)
  provideFn(
    localeContextKey,
    ref(context.value.locale)
  )
 

  // if (global || !globalConfig.value) {
  //   globalConfig.value = context.value
  // }
  return context
}

// const mergeConfig = (
//   a: ConfigProviderContext,
//   b: ConfigProviderContext
// ): ConfigProviderContext => {
//   const keys = [...new Set([...keysOf(a), ...keysOf(b)])]
//   const obj: Record<string, any> = {}
//   for (const key of keys) {
//     obj[key] = b[key] !== undefined ? b[key] : a[key]
//   }
//   return obj
// }