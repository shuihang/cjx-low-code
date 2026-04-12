import { objectType } from '@cjx-low-code/shared'
import type { Language } from '@cjx-low-code/locale'
import type { ExtractPropTypes, InjectionKey, Ref } from 'vue'

export const configProviderProps = () => ({
  locale: objectType<Language>() // 国际化
})

export type ConfigProviderContext = Partial<
  ExtractPropTypes<ReturnType<typeof configProviderProps>>
>

export const configProviderContextKey: InjectionKey<Ref<ConfigProviderContext>> = Symbol()
