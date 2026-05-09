import { createI18n } from 'vue-i18n'
import ElementPlus from 'element-plus'
import en from 'element-plus/es/locale/lang/en'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import { setHtmlPageLang } from './helper'
import type { I18n, I18nOptions } from 'vue-i18n'
import type { App } from 'vue'
import { elLocaleMap, useLocaleStoreWithOut } from '@/store/modules/locale'
export let i18n: ReturnType<typeof createI18n>

const data = {
  zh: zhCn,
  en
}

const createI18nOptions = async (): Promise<I18nOptions> => {
  const localeStore = useLocaleStoreWithOut()
  const locale = localeStore.getCurrentLocale
  const localeMap = localeStore.getLocaleMap

  const key = locale.lang === 'zh' ? 'zh' : locale.lang

  const message = data[key]
  setHtmlPageLang(locale.lang)
  localeStore.setCurrentLocale({
    lang: locale.lang
    // elLocale
  })

  return {
    legacy: false,
    locale: locale.lang,
    fallbackLocale: locale.lang,
    messages: {
      [locale.lang]: message
    },
    availableLocales: localeMap.map((v) => v.lang),
    sync: true,
    silentTranslationWarn: true,
    missingWarn: false,
    silentFallbackWarn: true
  }
}

export const setupI18n = async (app: App<Element>) => {
  const localeStore = useLocaleStoreWithOut()
  const locale = localeStore.getCurrentLocale

  const options = await createI18nOptions()
  i18n = createI18n(options) as I18n
  app.use(i18n)
  // console.log(elLocaleMap[locale.lang], locale.lang)

  app.use(ElementPlus, {
    locale: elLocaleMap[locale.lang]
  })
}
