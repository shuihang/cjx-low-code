import type { VNode } from 'vue'
import type { FormColumnProps } from '../interface'
import createFormItem from './createFormItem'
import { RenderSearchFormVNode, Common, RenderFormVNode } from './initFormTamplate'
import { defaultOnError as onError, createError, ErrorCodes } from '../../../_util/errors'

export interface FormRenderOptions {
  slotSuffix?: string
  onSubmit?: () => void
  isSearch?: boolean
  isView?: boolean
  useComponentPropsValues?: boolean
}

export type FormRenderContext =
  InstanceType<typeof Common>
  & Partial<InstanceType<typeof RenderSearchFormVNode>>
  & Partial<InstanceType<typeof RenderFormVNode>>

export function FormRender(options: FormRenderOptions = {}) {
  return function(
    _target: any,
    _propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ): PropertyDescriptor {
    const originalMethod = descriptor.value

    descriptor.value = function(this: FormRenderContext, ...args: any[]): (VNode | undefined)[] | VNode | undefined {
      try {
        const instance = this as FormRenderContext
        const actualOptions: FormRenderOptions = {
          ...options,
          slotSuffix: instance.slotSuffix ?? options.slotSuffix,
          isView: instance.isView ?? options.isView,
          onSubmit: instance.onSubmit ?? options.onSubmit,
        }

        const sortedColumns = originalMethod.apply(this, args) as FormColumnProps[]

        if (!sortedColumns) return

        const result = sortedColumns.map((item, index) =>
          createFormItem(item, index, instance, actualOptions)
        ).filter(Boolean)

        return result.length > 0 ? result : undefined
      } catch (error) {
        onError(createError(ErrorCodes.FORM_RENDER_DECORATOR_ERROR, String(error)))
        return
      }
    }

    return descriptor
  }
}
