import { objectType } from '../../_util/type'
import type { Language } from '@cjx-low-code/locale'
import type { InjectionKey, Ref, ExtractPropTypes } from 'vue'

export const configProviderProps = () => ({
  locale: objectType<Language>(), // 国际化
})

export type ConfigProviderContext = Partial<ExtractPropTypes<ReturnType<typeof configProviderProps>>>

export const configProviderContextKey: InjectionKey<
  Ref<ConfigProviderContext>
> = Symbol()