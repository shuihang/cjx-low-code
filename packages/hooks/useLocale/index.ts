import { computed, inject, isRef, ref, unref } from 'vue'
import type { ComputedRef } from 'vue'
import { get } from 'lodash-unified'
import Chinese from '../../locale/lang/zh-CN'

import type { MaybeRef } from '@vueuse/core'
import type { InjectionKey, Ref } from 'vue'
import type { Language } from '@cjx-low-code/locale'

export type TranslatorOption = Record<string, string | number>
export type Translator = (path: string, option?: TranslatorOption) => string
export type LocaleContext = {
  locale: Ref<Language>
  lang: Ref<string>
  t: Translator
}

export const buildTranslator =
  (locale: MaybeRef<Language>): Translator =>
  (path, option) =>
    translate(path, option, unref(locale))

export const translate = (
  path: string,
  option: undefined | TranslatorOption,
  locale: Language
): string => {
  // console.log('translate', path, option)
  return (get(locale, `cjx.${path}`, `cjx.${path}`) as string).replace(
    /\{(\w+)\}/g,
    (_, key) => `${option?.[key] ?? `{${key}}`}`
  )
}

export const buildLocaleContext = (
  locale: ComputedRef<Language>
): LocaleContext => {
  const lang = computed(() => unref(locale).name)
  const localeRef = isRef(locale) ? locale : ref(locale)
  // console.log('locale', locale.value)
  return {
    lang,
    locale: localeRef,
    t: buildTranslator(locale),
  }
}

export const localeContextKey: InjectionKey<Ref<Language | undefined>> =
  Symbol('cjxLocaleContextKey')

export const useLocale = (localeOverrides?: Ref<Language | undefined>) => {
  const locale = localeOverrides || inject(localeContextKey, ref())!
  // console.log('useLocale', inject(localeContextKey)?.value)
  return buildLocaleContext(computed(() => locale?.value || Chinese))
}
