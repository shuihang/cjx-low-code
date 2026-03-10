import type { VNode } from 'vue'
import type { CustomSlotsType } from '../../_util/type'
import type { DialogFormType, Scope } from './interface'
import type { FormColumnProps } from '../../form/src/interface'

/** 测试 */
type CustomStr<T extends string = ''> = `${string}${T}`

/**
 * 表格该项的插槽
 */
export type TableSlot = {
  /**
   * @param [key: string] 插槽
   */
  [key: string]: Scope
}

/** 表单弹窗该项的插槽 */
export type FormSlot = Record<
  CustomStr<'Form'>,
  FormColumnProps & {
    /** 当前的弹窗类型 check/查看 create/新增 update/修改 */
    _XBoxType: DialogFormType
    /** 表单项的值 查看表单才有 */
    $value?: any
    /** 表单项的索引 查看表单才有 */
    $index?: number
  }
>

/** 表单分组的插槽 */
export type GroupFormSlot = Record<
  CustomStr<'GroupForm'>,
  {
    /** 当前的弹窗类型 check/查看 create/新增 update/修改 */
    _XBoxType: DialogFormType
  }
>

/** 搜索栏该项的插槽 */
export type SearchSlot = Record<CustomStr<'Search'>, FormColumnProps>

/** 查看弹窗 tab的插槽 */
export type TabFormSlot = Record<CustomStr<'TabForm'>, never>

export type GroupLabelSlot = Record<
  CustomStr<'GroupLabel'>,
  {
    /** 当前的弹窗类型 check/查看 create/新增 update/修改 */
    _XBoxType: DialogFormType
  }
>

export type CrudSlotType = CustomSlotsType<
  {
    /** 表格头部操作栏插槽 */
    headerMenu?: () => void
    /**
     * 操作栏插槽
     * @type {Scope={ row: any, $index: number }}
     * @param row 当前行数据
     * @param $index 当前行索引
     **/
    menu: (data: Scope) => VNode[]
    /** 表格搜索操作栏插槽 */
    searchMenu?: () => void
    /** 分页器插槽 */
    page?: () => void
    /** 表格插槽 */
    table?: () => void
    /** 导入弹窗头部插槽 */
    importHeader?: () => Promise<any>
    /** 表单头部位置插槽 */
    formHeader?: (props: { _XBoxType?: DialogFormType }) => void
    /** 表单弹窗底部位置插槽 */
    formFooter?: (props: { _XBoxType?: DialogFormType }) => void
  } & SearchSlot &
    FormSlot &
    GroupFormSlot &
    TableSlot &
    TabFormSlot &
    GroupLabelSlot
>
