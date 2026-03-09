import { inject, provide } from 'vue'
import { useCompRef } from '@cjx-low-code/hooks'
import XForm from '../../form'
import type { ComputedRef, Ref } from 'vue'
import type { CrudPermission, DialogFormType, EmitFn, Scope, TableOption } from './interface'

export type SetUpInterface = Required<Pick<TableOption, 'index' | 'selection'>>

const formRef = useCompRef(XForm)

type FormInstance = typeof formRef

export type CrudProvide = ComputedRef<
  EmitFn & {
    option: ComputedRef<TableOption>
    /**  按钮权限 */
    permission: CrudPermission
    /** table组件的key 控制更新 */
    reload: Ref<number>
    /**  是否显示头部搜索栏 */
    isShowHeaderSearch: Ref<boolean>
    /** 是否显示弹窗 */
    showDialogForm: Ref<boolean>
    /**  打开弹窗 */
    handleShowDialogForm: (type: DialogFormType, scope?: Scope) => void
    /**  弹窗类型 */
    boxType: Ref<DialogFormType>
    /** 弹窗表单的ref */
    formRef: FormInstance
    /** 表格显示密度 large/宽松 default/默认 small/紧密 */
    tableSize: Ref<'large' | 'default' | 'small'>
    setUpMenuChange: (key: keyof SetUpInterface, value: boolean) => void
  }
>

export const crudProviderKey = Symbol('crudProviderKey')

export const useCrudProviderKey = (props: CrudProvide) => {
  return provide(crudProviderKey, props)
}

export const useCrudInjectKey = (): CrudProvide => {
  return inject(crudProviderKey) as CrudProvide
}
