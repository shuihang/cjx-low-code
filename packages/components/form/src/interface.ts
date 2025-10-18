import { booleanType, objectType } from '../../_util/type'
import type { Column, ElSelect, ElTree, TableColumnCtx } from 'element-plus'
import type {
  CSSProperties,
  ComputedRef,
  ExtractPropTypes,
  InputHTMLAttributes,
  PropType,
  Ref,
  TextareaHTMLAttributes,
  UnwrapRef,
  VNode,
} from 'vue'
// ISelectProps
import type {
  CascaderInstance,
  CascaderProps,
  CheckboxProps,
  DatePickerProps,
  InputNumberInstance,
  InputProps,
  RadioProps,
  SwitchInstance,
} from 'element-plus'
import type {
  ColumnProps,
  DialogFormType,
  ViewTabs,
} from '../../crud/src/interface'
// import type { UpLoadProps } from '@cjx-low-code/components/cjx-uploadFile/interface';
import type { EditTableProps } from '../../editTable'

/** 测试 */
type CustomStr<T extends string = ''> = `${string}${T}`

/** 表单弹窗该项的插槽 */
export type FormSlot = {
  [key: string]: FormColumnProps & {
    /** 表单项的值 查看表单才有 */
    $value?: any
    /** 表单项的索引 查看表单才有 */
    $index?: number
  }
}

/** 表单分组的插槽 */
export type GroupFormSlot = Record<CustomStr<'GroupForm'>, never>

/** 搜索栏该项的插槽 */
export type SearchSlot = Record<CustomStr<'Search'>, FormColumnProps>

/** 查看弹窗 tab的插槽 */
export type TabFormSlot = Record<CustomStr<'TabForm'>, never>

export type GroupLabelSlot = Record<CustomStr<'GroupLabel'>, never>

export type { DialogFormType, ViewTabs }

type OmitStr = 'modelValue'

export type Arrayable<T> = T | T[]

type SelectProps = Partial<
  Omit<ExtractPropTypes<InstanceType<typeof ElSelect>>, OmitStr>
>

export interface FormTypeProps {
  /** input组件的配置项 具体参考element-plus官网 */
  input?: Partial<Omit<InputProps, OmitStr> & InputHTMLAttributes>
  /** textarea组件的配置项 具体参考element-plus官网 */
  textarea?: Partial<
    Omit<InputProps, OmitStr | 'type'> & TextareaHTMLAttributes
  >
  /** inputNumber组件的配置项 具体参考element-plus官网 */
  inputNumber?: Partial<Omit<InputNumberInstance, OmitStr>>
  /** select组件的配置项 具体参考element-plus官网 */
  select?: SelectProps // Partial<Omit<ISelectProps, OmitStr>>,
  /** checkbox组件的配置项 具体参考element-plus官网 */
  checkbox?: Partial<Omit<CheckboxProps, OmitStr>>
  /** datePicker组件的配置项 具体参考element-plus官网 */
  datePicker?: Partial<Omit<DatePickerProps, OmitStr>>
  /** radio组件的配置项 具体参考element-plus官网 */
  radio?: Partial<Omit<RadioProps, OmitStr>>
  /** radio组件的配置项 button类型 */
  radioButton?: Partial<Omit<RadioProps, OmitStr>>
  /** cascader组件的配置项 具体参考element-plus官网 */
  cascader?: Partial<
    Omit<CascaderInstance, OmitStr | 'props'> & { props: CascaderProps }
  >
  /** switch组件的配置项 具体参考element-plus官网 */
  switch?: Partial<Omit<SwitchInstance, OmitStr>>
  /** treeSelect组件的配置项 具体参考element-plus官网 */
  treeSelect?: SelectProps &
    Partial<Omit<ExtractPropTypes<InstanceType<typeof ElTree>>, OmitStr>>
  /** 上传组件配置项  */
  // upload?: Partial<Omit<UpLoadProps, OmitStr>>
  /** 可编辑表格 表格表单配置项 */
  editTable?: Partial<Omit<EditTableProps, OmitStr>>
  /** 选择组织的配置项 */
}

/**
 *'input' | 'textarea' | 'inputNumber' | 'select' | 'checkbox' | 'datePicker' | 'radio'  | 'radioButton' |
  'cascader' | 'switch' | 'treeSelect' | 'upload'   | 'sign' | 'regionalGrid' | 'deptSelect' | 'editTable' | 'selectPeople'
*/
export type FormItemType = keyof FormTypeProps
// export type FormItemType =
//   'input' | 'textarea' | 'inputNumber' | 'select' | 'checkbox' | 'datePicker' | 'radio'  | 'radioButton' |
//   'cascader' | 'switch' | 'treeSelect' | 'upload'   | 'sign' | 'regionalGrid' | 'deptSelect' | 'editTable' | 'selectPeople'
export const componentPropsValues: FormItemType[] = [
  'input',
  'textarea',
  'inputNumber',
  'select',
  'checkbox',
  'datePicker',
  'radio',
  'radioButton',
  'cascader',
  'switch',
  'treeSelect',
  'editTable',
]

/**
 * 从cjx-crud组件中 需要提取的属性
 */
export const formColumnValues = [
  ...componentPropsValues,
  'prop',
  'label',
  'componentBind',
  'rules',
  'order',
  'dicData',
  'props',
  'change',
  'formatter',
  'tip',
  'tipPlacement',
  'span',
  'checkSpan',
  'labelWidth',
  'slot',
  'formSlotNodes',
  'type',
  'labelTip',
  'labelTipPlacement',
  'style',
  'on',
  'dicAjaxResolve',
] as const

export type FormStateProps = typeof formColumnValues[number]

export type FormColumnProps = Pick<ColumnProps, FormStateProps> & {
  // /** 列标题 */
  // label: string | VNode,
  // /** 列标题的内容属性名称 */
  // prop: string
  // componentBind?: string,
  // /** 表单项标题宽度 默认90*/
  // labelWidth?: number
  // /** 表单项的类型 默认input */
  // type?: FormItemType
  // /** 表单项是否插槽 */
  // formSlot?: boolean
  // /** 表单项 插槽的VNode */
  // formSlotNodes?: SlotNodesInterface,
  // /** 表单项的栅列 */
  // span?: number
  // /** 表单校验条件 */
  // rules?: Array<Partial<FormItemRule>>,
  // /** 位置排序，序号越大越靠前 */
  // order?: number
  // /** 数据字典值 */
  // dicData?: DicDataInterface,
  // /** 数据字典接口函数返回的数据  */
  // dicAjaxResolve?: Promise<any>
  // /** 数据字典属性的配置对象 */
  // props?: PropsInterface
  /**
   * 用来格式化内容 此配置仅用于 isView=true(查看模式) 有效
   * @param {any} form 表单绑定的form
   * @param {TableColumnCtx<Column>} column 列数据
   * @param {any} cellValue 单元格数据
   * @param {number} index 行索引
   * @returns 格式化后的内容
   **/
  formatter?: (
    row: any,
    column: TableColumnCtx<Column>,
    cellValue: any,
    index: number
  ) => any
  /** 此配置仅用于 isView=true(查看模式) 有效 该项的栅列 默认为1 type为textarea/sign/upload的情况默认为2 */
  checkSpan?: number
  /** 此配置仅用于 isView=true(查看模式) 有效 */
  collapseShow?:
    | boolean
    | ((props: {
        form: { [K in string]: any }
        column: FormColumnProps[]
      }) => boolean)
  // /** 内容提示辅助语 */
  // tip?: string | VNode
  // /** 内容提示辅助语位置 */
  // tipPlacement?: Placement
  // /** 标题提示辅助语 */
  // labelTip?: string | VNode
  // /** 标题提示辅助语位置 */
  // labelTipPlacement?: Placement
  // /** 表单项的样式  */
  // style?: CSSProperties
  /** 辅助文字 */
  placeholder?: string
  /** 是否可清除 */
  clearable?: boolean
  /**
   * 弹出表单当前项是否显示 支持布尔类型和函数表达式 默认true
   * @param {any} form 表单绑定的form
   * @param {FormColumnProps[]} column 列数据
   * @param {number} index 行索引
   * @param {DialogFormType} _XBoxType 弹窗类型
   * @returns {boolean} 是否显示
   */
  display?:
    | boolean
    | ((props: {
        form: any
        column: FormColumnProps[]
        index: number
        _XBoxType?: DialogFormType
      }) => boolean)
  /**
   * 弹出表单当前项是否禁用 支持布尔类型和函数表达式 默认false
   * @param {any} form 表单绑定的form
   * @param {FormColumnProps[]} column 列数据
   * @param {number} index 行索引
   * @param {DialogFormType} _XBoxType 弹窗类型
   * @returns {boolean} 是否可以编辑
   **/
  disabled?:
    | boolean
    | ((props: {
        form: any
        column: FormColumnProps[]
        index: number
        _XBoxType?: DialogFormType
      }) => boolean)
  // /** 组件响应的事件 */
  on?: { [key in `on${Capitalize<string>}`]: (...args: any[]) => void }
  /** 响应事件 */
  change?: (value: any, column: FormColumnProps[]) => void
}

export type GroupInterface = {
  /** 标题 */
  label: string | VNode
  /** 表单分组的属性名称 */
  prop?: string
  /**  */
  labelWidth?: number
  /** 是否插槽 */
  slot?: boolean
  /** icon 图标 */
  icon?: string
  /** 是否开启折叠功能 */
  collapse?: boolean
  /** 是否预览模式 默认false */
  isView?: boolean
  /** 表单 */
  // columnSpan?: number,
  /** 表单查看模式的 一行 Descriptions Item 的数量 */
  checkColumnSpan?: number
  display?: (props: {
    form: any
    column: FormColumnProps[]
    index: number
    _XBoxType?: DialogFormType
  }) => boolean
  /** 表单的各项 */
  column?: FormColumnProps[]
}

export interface FormOption {
  /** 标题宽度 */
  labelWidth?: number
  /** 栅格占据的列数 */
  formSpan?: number
  /** 表单操作栏是否显示 */
  menuBtn?: boolean
  /** 确定按钮是否显示 */
  submitBtn?: boolean
  /** 确定按钮文本 */
  submitBtnText?: string
  /** 取消按钮是否显示 */
  cancelBtn?: boolean
  /** 取消按钮文本 */
  cancelBtnText?: string
  /** 表单查看模式的 一行 Descriptions Item 的数量  */
  checkColumnSpan?: number
  /** tab */
  viewTabs?: ViewTabs[]
  /** 当前tab */
  viewTabsCurrent?: string | number
  /** 表单的各项 */
  column: FormColumnProps[]
  /** 分组 */
  group?: GroupInterface[]
}

export const searchFromProps = () => ({
  /** 配置项 */
  option: objectType<FormOption | UnwrapRef<FormOption>>(),
  /**  绑定的值 */
  form: {
    type: Object as PropType<ComputedRef>,
    require: true,
    default: () => {},
  },
  /** 是否显示查询按钮 */
  queryBtn: booleanType(true),
})

export type SearchFromProps = Partial<
  ExtractPropTypes<ReturnType<typeof searchFromProps>>
>

export const fromProps = () => ({
  /** 配置项 */
  option: objectType<FormOption | UnwrapRef<FormOption>>(),
  /** 绑定的值 */
  form: {
    type: Object,
    require: true,
    default: () => {},
  },
  /** 增 删 改 */
  ztBoxType: objectType<Ref<DialogFormType>>(),
  /** 是否查看模式 */
  isView: booleanType(),
  /** 内容区域样式 */
  contentStyle: objectType<CSSProperties>(),
  /** 操作区域样式 */
  menuStyle: objectType<CSSProperties>({}),
  /** 是否开启禁止编辑模式 */
  disabled: booleanType(false),
})

export type FromProps = Partial<ExtractPropTypes<ReturnType<typeof fromProps>>>
