import { inject, provide } from 'vue'
import type { DialogFormType } from '@cjx-low-code/components/crud/src/interface'
import type { ComputedRef, Ref } from 'vue'

interface FormProvide {
  newForm: Ref<object>
  formSpan?: number
  labelWidth: number
  // type: string,
  slotSuffix: string
  ztBoxType?: Ref<DialogFormType>
  isView: boolean
  isFullscreen: Ref<boolean>
  onUpdateModelValue: (prop: string, value: string) => void
}

export const formProviderKey = Symbol('formProviderKey')

// 导出一个名为 useFormProviderKey 的常量，它是一个函数
export const useFormProviderKey = (props: ComputedRef<FormProvide>) => {
  // 调用 provide 函数，将 formProviderKey 作为依赖注入的键，props 作为注入的值
  // provide 是 Vue 3 中用于依赖注入的函数，可以在父组件中提供数据，供子组件使用
  return provide(formProviderKey, props)
}

export const useFormInjectKey = (): ComputedRef<FormProvide> => {
  return inject(formProviderKey) as ComputedRef<FormProvide>
}
