import { i18n } from '@/plugins/vueI18n'

type I18nGlobalTranslation = {
  (key: string): string
  (key: string, locale: string): string
  (key: string, locale: string, list: unknown[]): string
  (key: string, locale: string, named: Record<string, unknown>): string
  (key: string, list: unknown[]): string
  (key: string, named: Record<string, unknown>): string
}

type I18nTranslationRestParameters = [string, any]

const getKey = (namespace: string | undefined, key: string) => {
  if (!namespace) {
    return key
  }
  if (key.startsWith(namespace)) {
    return key
  }
  return `${namespace}.${key}`
}

export const useI18n = (
  namespace?: string
): {
  t: I18nGlobalTranslation
} => {
  const normalFn = {
    t: (key: string, ...arg: any[]) => {
      if (i18n) {
        const { t, ...methods } = i18n.global
        if (!key) return ''
        if (!key.includes('.') && !namespace) return key
        //@ts-ignore
        return t(getKey(namespace, key), ...(arg as I18nTranslationRestParameters))
      }
      return getKey(namespace, key)
    }
  }

  if (!i18n) {
    return normalFn
  }

  const { t, ...methods } = i18n.global

  const tFn: I18nGlobalTranslation = (key: string, ...arg: any[]) => {
    if (!key) return ''
    if (!key.includes('.') && !namespace) return key
    //@ts-ignore
    return t(getKey(namespace, key), ...(arg as I18nTranslationRestParameters))
  }
  return {
    ...methods,
    t: tFn
  }
}

export const t = (key: string) => key

export const useI18nNumbFn = (): {
  t: I18nGlobalTranslation
  /**
   * 拿到文本的国际化
   */
  textNumbI18n: (label: string) => () => string
  /**
   * 拿到 请输入 的国际化加上文本的国际化
   */
  inputTextNumbI18n: (label: string) => () => string
  /**
   * 拿到 请选择 的国际化加上文本的国际化
   */
  selectTextNumbI18n: (label: string) => () => string
} => {
  const { t } = useI18n()

  return {
    t,
    textNumbI18n: (label) => () => t(label),
    inputTextNumbI18n: (label) => () => t('common.inputText') + label,
    selectTextNumbI18n: (label) => () => t('common.selectText') + label
  }
}
