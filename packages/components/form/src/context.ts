import { inject, provide } from 'vue'
import type { ComputedRef } from 'vue'
import type { TemplateProps } from './init/initFormTamplate'

type FormProvide = {
  isView: ComputedRef<boolean>,
} & Pick<TemplateProps, 'newForm' | 'formSpan' | 'labelWidth' | 'slotSuffix' | 'xBoxType' | 'isFullscreen' | 'checkColumnSpan' | 'onUpdateModelValue'>

export const formProviderKey = Symbol('formProviderKey')

export const useFormProviderKey = (props: ComputedRef<FormProvide>) => {
  return provide(formProviderKey, props)
}

export const useFormInjectKey = (): ComputedRef<FormProvide> => {
  return inject(formProviderKey) as ComputedRef<FormProvide>
}
