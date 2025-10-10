import type { Component, ExtractPropTypes, UnwrapRef, ComputedRef } from 'vue';
import { ElInput, ElInputNumber, ElOption, ElSelect, FormItemRule } from 'element-plus';
import { objectType, arrayType, stringType, booleanType } from '../../_util/type';
import { FormTypeProps } from '../../form/src/interface';
import type { Placement } from '../../crud/src/interface';
import { useLocale } from '@cjx-low-code/hooks';

export type {
  Placement
}

const { t } = useLocale()

export const inputPlaceholder = t('common.inputText');
export const selectPlaceholder = t('common.selectText');

type EditTableComponents = Pick<FormTypeProps, 'input' | 'select' | 'inputNumber' | 'textarea'>

export const editTableMapProps: {
  [key in keyof EditTableComponents]-?: {
    components: Component,
    subComponents?: Component,
    placeholder: string,
    /** 组件的类型 */
    type?: string,
    /** 默认值 */
    defaultValue?: any,
  } & { [K in key]?: FormTypeProps[key] }
} = {
  input: {
    components: ElInput,
    placeholder: inputPlaceholder,
    defaultValue: ''
  },
  textarea: {
    components: ElInput,
    placeholder: inputPlaceholder,
    type: 'textarea',
    defaultValue: ''
  },
  inputNumber: {
    components: ElInputNumber,
    placeholder: inputPlaceholder,
    defaultValue: 0
  },
  select: {
    components: ElSelect,
    subComponents: ElOption,
    placeholder: selectPlaceholder,
    defaultValue: ''
  },
}

export type EditTableColumn = {
  /** 表格表单当前项的label */
  label: string;
  /** 表格表单当前项的键 */
  prop: string,
  /** 类型 */
  type: 'input' | 'select' | 'inputNumber',
  /** 字典数据 */
  dicData?: any[],
  /** 操作栏宽度 默认220 */
  width?: number,
  /** 操作栏最小宽度 */
  minWidth?: number,
  /** 表单的校验条件 */
  rules?: Array<Partial<FormItemRule>>,
  /** 内容提示辅助语 */
  tip?: string,
  /** 内容提示辅助语位置 */
  tipPlacement?: Placement,
  /** 是否隐藏 */
  hide?: boolean | ComputedRef<boolean>
  /** 插槽 */
  slot?: boolean
  /** 组件响应的事件 */
  on?: {[key in `on${Capitalize<string>}`]: (...args: any[]) => void},
} & EditTableComponents

export type EditTableOption = {
  /** 行数据的 Key，用来优化 Table 的渲染；在使用 copyBtn功能时，该属性必需对应数据的唯一标识 默认id。 */
  rowKey?: string,
  /** 是否显示复制按钮 copyBtn为true时，rowKey属性必需对应数据的唯一标识(rowKey默认id) 默认false/不显示 */
  copyBtn?: boolean,
  /** 是否显示删除按钮 默认false/不显示 */
  delBtn?: boolean,
  /** 是否显示新增按钮 默认false/不显示 */
  addBtn?: boolean,
  /** 是否是否可以拖拽排序  默认false/不开启 */
  sortable?: boolean,
  /** 是否带有纵向边框 默认false */
  border?: boolean,
  /** 是否有序号 默认false */
  index?: boolean,
  /** 表格表单的表头配置 */
  column: EditTableColumn[]
}

export const editTableProps = () => ({
  /** 表格表单的配置 */
  option: objectType<EditTableOption | UnwrapRef<EditTableOption>>(),
  /** 表格表单绑定的数据 */
  modelValue: arrayType<Array<any>>(),
  /** 是否只读 */
  isView: booleanType(false),
  /** 如果这个组件嵌套在cjx-from组件里 在需要表单校验的情况下 该参数必须配置 配置规则(如果modelValue(表格表单绑定的数据)绑定的是form.arr 那么prop='arr' ) */
  prop: stringType(),
  label: stringType()
})

export type EditTableProps = Partial<ExtractPropTypes<ReturnType<typeof editTableProps>>>;


