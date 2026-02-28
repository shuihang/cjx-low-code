import { booleanType, objectType, stringType } from '../../_util/type'
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
import {
  ElInput, ElSelect, ElCascader, ElRadioGroup, ElRadioButton,
  ElSwitch, ElInputNumber, ElCheckboxGroup, ElColorPicker, ElTree
} from 'element-plus';
import type {
  Column,
  TableColumnCtx,
  CascaderInstance,
  CascaderProps,
  CheckboxProps,
  DatePickerProps,
  InputNumberInstance,
  InputProps,
  RadioProps,
  SwitchInstance,
  ColorPickerProps
} from 'element-plus'
import type {
  ColumnProps,
  DialogFormType,
  ViewTabs,
} from '../../crud/src/interface'
import type { FormHelper } from './helpers'
import XEditTable from '../../editTable/src/index'
import type { EditTableProps } from '../../editTable'
import type { ExtractComponentsEmits, EmitsAddArgs } from '../../dialog/src/dialog'
import type { ElDatePickerEmitType, ElTreeSelectType } from './elComponentType'
import { FORM_ON_EVENT_SUFFIX } from '../../_util/env'

export type {
  ColumnProps
}


export type RecordAnyType = Record<string, any>

export type FormModelValueType = RecordAnyType

type EmitsAddHelpers<T extends object, F extends object = FormModelValueType> = EmitsAddArgs<T, [[_helpers: FormHelper<F>]], 'end'>

export type InferComponentEmitType<T extends abstract new (...args: any[]) => any, F extends object = FormModelValueType> = Partial<ExtractComponentsEmits<InstanceType<T>['$props'], [[_helpers: FormHelper<F>]], 'end'>>


/** 测试 */
type CustomStr<T extends string = ''> = `${string}${T}`


/** 表单弹窗该项的插槽 */
export type FormSlot = Record<string, FormColumnProps & {
    _xBoxType: DialogFormType
    /** 表单项的值 查看表单才有 */
    $value?: any
    /** 表单项的索引 查看表单才有 */
    $index?: number
  }>

/** 表单分组的插槽 */
export type GroupFormSlot = Record<CustomStr<'GroupForm'>, never>

/** 搜索栏该项的插槽 */
export type SearchSlot = Record<CustomStr<'Search'>, FormColumnProps>

/** 查看弹窗 tab的插槽 */
export type TabFormSlot = Record<CustomStr<'TabForm'>, never>

export type GroupLabelSlot = Record<CustomStr<'GroupLabel'>, never>


export type {
  DialogFormType,
  ViewTabs
}

type OmitStr = 'modelValue'

export type Arrayable<T> = T | T[]


type SelectProps = Partial<Omit<ExtractPropTypes<InstanceType<typeof ElSelect>>, OmitStr>>

export interface FormTypePropsAndEmit<F extends object = FormModelValueType> {
  /** input组件的配置项 具体参考element-plus官网 */
  input: {
    props: InputProps & InputHTMLAttributes;
    emit: InferComponentEmitType<typeof ElInput, F>
  };
  /** textarea组件的配置项 具体参考element-plus官网 */
  textarea: {
    props: InputProps & TextareaHTMLAttributes;
    emit: InferComponentEmitType<typeof ElInput, F>
  };
  /** inputNumber组件的配置项 具体参考element-plus官网 */
  inputNumber: {
    props: InputNumberInstance;
    emit: InferComponentEmitType<typeof ElInputNumber, F>
  };
  /** select组件的配置项 具体参考element-plus官网 */
  select: {
    props: SelectProps;
    emit: InferComponentEmitType<typeof ElSelect>
    // emit: Partial<EmitsAddHelpers<ElSelectType, F>>
  };
  /** checkbox组件的配置项 具体参考element-plus官网 */
  checkbox: {
    props: CheckboxProps;
    emit: InferComponentEmitType<typeof ElCheckboxGroup, F>
  };
  datePicker: {
    /** datePicker组件的配置项 具体参考element-plus官网 */
    props: DatePickerProps;
    // emit: InferComponentEmitType<typeof ElDatePicker, F>
    // 因为el-date-picker的类型声明文件中，没有emit事件，所以需要手动添加
    /** datePicker组件的事件支持el-date-picker的所有事件 具体参考element-plus官网 */
    emit: Partial<EmitsAddHelpers<ElDatePickerEmitType, F>>
  };
  radio: {
    /** radio组件的配置项 具体参考element-plus官网 */
    radio: RadioProps;
    /** radio组件的事件支持el-radio的所有事件 具体参考element-plus官网 */
    emit: InferComponentEmitType<typeof ElRadioGroup, F>
  };
  radioButton: {
    /** radio组件的配置项 button类型 */
    props: RadioProps;
    emit: InferComponentEmitType<typeof ElRadioButton, F>
  };
  cascader: {
    /** cascader组件的配置项 具体参考element-plus官网 */
    props: CascaderInstance & { props: CascaderProps }; // Partial<Omit<CascaderInstance, OmitStr | 'props'> & { props: CascaderProps }>;
    emit: InferComponentEmitType<typeof ElCascader, F>
  };
  /** switch组件的配置项 具体参考element-plus官网 */
  switch: {
    props: SwitchInstance;
    emit: InferComponentEmitType<typeof ElSwitch, F>
  };
  /** treeSelect组件的配置项 具体参考element-plus官网 */
  treeSelect: {
    props: SelectProps & InstanceType<typeof ElTree>; //  Partial<Omit<ExtractPropTypes<InstanceType<typeof ElTree>>, OmitStr>>;
    // emit: InferComponentEmitType<typeof ElTreeSelect, F>
    // 因为el-tree-select的类型声明文件中，没有emit事件，所以需要手动添加
    emit: Partial<EmitsAddHelpers<ElTreeSelectType, F>> 
  };
  /** colorPicker组件的配置项 具体参考element-plus官网 */
  colorPicker: {
    props: ColorPickerProps;
    emit: InferComponentEmitType<typeof ElColorPicker, F>
  };
  /** 可编辑表格 表格表单配置项 */
  editTable: {
    props: EditTableProps;
    emit: InferComponentEmitType<typeof XEditTable, F>
  },
}

export type FormTypeProps = {
  [key in FormItemType]?: Partial<Omit<InferFormTypePropsType<key, 'props'>, OmitStr>> 
}

export type FormOnEventType<F extends object = FormModelValueType> = {
  [K in FormItemType as `${K & string}${typeof FORM_ON_EVENT_SUFFIX}`]?: InferFormTypePropsType<K, 'emit', F>
}

export type InferFormTypePropsType<
  T extends FormItemType,
  K extends 'props' | 'emit' = 'props',
  F extends object = FormModelValueType
> = T extends keyof FormTypePropsAndEmit<F>
  ? K extends keyof FormTypePropsAndEmit<F>[T]
    ? FormTypePropsAndEmit<F>[T][K]
    : never
  : never;

/**
 * 表单控件类型枚举
 * @type {'input' | 'textarea' | 'inputNumber' | 'select' | 'checkbox' | 'datePicker' | 'radio' | 'radioButton' | 'cascader' | 'switch' | 'treeSelect' | 'colorPicker' | 'upload' | 'sign' | 'editTable' | 'selectPeople' | 'dateTimeRange'}
 * 
 * @description 定义了所有可用的表单控件类型：
 * - input: 文本输入框
 * - textarea: 多行文本输入框
 * - inputNumber: 数字输入框
 * - select: 下拉选择框
 * - checkbox: 复选框
 * - datePicker: 日期选择器
 * - radio: 单选框
 * - radioButton: 按钮样式的单选框
 * - cascader: 级联选择器
 * - switch: 开关
 * - treeSelect: 树形选择器
 * - colorPicker: 颜色选择器
 * - upload: 文件上传
 * - sign: 签名
 * - regionalGrid: 区域网格选择
 * - deptSelect: 部门选择
 * - editTable: 可编辑表格
 * - selectPeople: 人员选择
 * - dateTimeRange: 日期时间范围选择器
 */
export type FormItemType = keyof FormTypePropsAndEmit



// export type FormItemType =
//   'input' | 'textarea' | 'inputNumber' | 'select' | 'checkbox' | 'datePicker' | 'radio'  | 'radioButton' |
//   'cascader' | 'switch' | 'treeSelect' | 'upload'   | 'sign' | 'regionalGrid' | 'deptSelect' | 'editTable' | 'selectPeople'
export const componentPropsValues: FormItemType[] = [
  'input', 'textarea', 'inputNumber', 'select', 'checkbox', 'datePicker', 'radio', 'radioButton', 'cascader',
  'switch', 'treeSelect', 'editTable', 'colorPicker'
]

/**
 * 从XCrud组件中 需要提取的属性
*/
export const formColumnValues = [
  ...componentPropsValues,
  'prop', 'label', 'componentBind','rules', 'order', 'dicData', 'props', 'formatter', 'tip', 'tipPlacement',
  'span', 'checkSpan','labelWidth', 'formSlotNodes', 'type', 'labelTip', 'labelTipPlacement', 'style', 'on',
  'dicAjaxResolve', 'labelStyle'
] as const

export type FormStateProps = (typeof formColumnValues)[number]

export type FormColumnProps<F extends object = FormModelValueType> =
  Omit<Pick<ColumnProps, FormStateProps>, 'type' | 'on' | 'formatter' | 'disabled' | 'display'> & {
  // /** 列标题 */
  // label: string | VNode,
  // /** 列标题的内容属性名称 */
  // prop: string
  // componentBind?: string,
  // /** 表单项标题宽度 默认90*/
  // labelWidth?: number
  /**
   * 表单项的类型枚举
   * @type {'input' | 'textarea' | 'inputNumber' | 'select' | 'checkbox' | 'datePicker' | 'radio' | 'radioButton' | 'cascader' | 'switch' | 'treeSelect' | 'colorPicker' | 'upload' | 'sign' | 'editTable' | 'selectPeople' | 'dateTimeRange'}
   * @description 定义了表单组件支持的所有输入类型
   * @default 'input'
   * 
   * @description 定义了表单组件支持的所有输入类型：
   * - input: 文本输入框
   * - textarea: 多行文本输入框
   * - inputNumber: 数字输入框
   * - select: 下拉选择框
   * - checkbox: 复选框
   * - datePicker: 日期选择器
   * - radio: 单选框
   * - radioButton: 按钮样式的单选框
   * - cascader: 级联选择器
   * - switch: 开关
   * - treeSelect: 树形选择器
   * - colorPicker: 颜色选择器
   * - upload: 文件上传
   * - sign: 签名
   * - regionalGrid: 区域网格选择
   * - deptSelect: 部门选择
   * - editTable: 可编辑表格
   * - selectPeople: 人员选择
   * - dateTimeRange: 日期时间范围选择器
   * 
   * @example
   * ```typescript
   * const option = ref<FormOption>({
   *   column: [
   *    {
   *      label: '姓名',
   *      prop: 'name',
   *      type: 'input'
   *    }
   *   ]
   * })
   * ```
   */
  type?: FormItemType,
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
  formatter?: (form: F, column: TableColumnCtx<Column>, cellValue: any, index: number) => any
  /** 此配置仅用于 isView=true(查看模式) 有效 该项的栅列 默认为1 type为textarea/sign/upload的情况默认为2 */
  checkSpan?: number
  /** 此配置仅用于 isView=true(查看模式) 有效 */
  collapseShow?: boolean | ((props: { form: F, column: FormColumnProps[] }) => boolean)
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
    * @returns {boolean} 是否显示
  */
  display?: boolean | ((props: {form: F, column: FormColumnProps[] }) => boolean)
  /**
    * 弹出表单当前项是否禁用 支持布尔类型和函数表达式 默认false
    * @param {any} form 表单绑定的form
    * @param {FormColumnProps[]} column 列数据
    * @returns {boolean} 是否可以编辑
  **/
  disabled?: boolean | ((props: {form: F, column: FormColumnProps[] }) => boolean),
   /**
   * 表单项的事件处理器配置
   * @type {FormOnEventType}
   * @description 根据不同的表单项类型，定义相应的事件处理器
   * @example
   * const option = ref<FormOption>({
   *   column: [
   *    {
   *      label: '单选框',
   *      prop: 'radio',
   *      type: 'radio',
   *      dicData: [
   *        { label: '输入框必填', value: '1'}
   *        { label: '输入框非必填', value: '2'}
   *      ],
   *      on: {
   *        // 因为本项为单选框 所以是radioEvent 里面支持el-radio组件的所有事件
   *        radioEvent: {
   *          onChange: (value, _helpers) => {
   *            // 联动其他表单项的配置
   *            _helpers.updateColumns(['inputTest'], {
   *               label: '输入框-' + value,
   *               rules: [
   *                 { required: value === '1', message: '请输入内容', trigger: 'blur' }
   *               ]
   *             })
   *             // 处理输入值变化
   *             _helpers.updateForm({
   *                inputTest: value + ' changed'
   *             })
   *            }
   *          }
   *        }
   *      }
   *    },
   *    {
   *     label: '输入框',
   *     prop: 'inputTest',
   *     rules: [
   *      { required: true, message: '请输入内容', trigger: 'blur' }
   *     ]
   *    },
   *   ]
   * })
   *
   */
  on?: FormOnEventType<F>
  /** 响应事件 */
  // change?: (value: any, column: FormColumnProps[]) => void
}

export type GroupInterface<F extends object = FormModelValueType> = {
  /** 标题 */
  label: string | VNode,
  /** 表单分组的属性名称 */
  prop?: string,
  /**  */
  labelWidth?: number,
  /** icon 图标 */
  icon?: string,
  /** 是否开启折叠功能 */
  collapse?: boolean,
  /** 是否预览模式 默认false */
  isView?: boolean,
  /** 表单 */
  // columnSpan?: number,
  /** 表单查看模式的 一行 Descriptions Item 的数量 */
  checkColumnSpan?: number,
  /**
   * 弹出表单当前项是否显示 支持布尔类型和函数表达式 默认`true`
   * @param {any} form 表单绑定的form
   * @param {FormColumnProps[]} column 列数据
   * @returns {boolean} 是否显示
   */
  display?: ((props: { form: F, column: FormColumnProps<F>[] }) => boolean),
  /** 表单的各项 */
  column?: FormColumnProps<F>[]
}


export interface FormOption<F extends object = FormModelValueType> {
  /** 标题宽度 */
  labelWidth?: number,
  /** 栅格占据的列数 */
  formSpan?: number,
  /** 表单操作栏是否显示 */
  menuBtn?: boolean,
  /** 确定按钮是否显示 */
  submitBtn?: boolean,
  /** 确定按钮文本 */
  submitBtnText?: string
  /** 取消按钮是否显示 */
  cancelBtn?: boolean,
  /** 取消按钮文本 */
  cancelBtnText?: string,
  /** 表单查看模式的 一行 Descriptions Item 的数量  */
  checkColumnSpan?: number,
  /** tab */
  viewTabs?: ViewTabs[],
  /** 当前tab */
  viewTabsCurrent?: string | number,
  /** 表单的各项 */
  column?: FormColumnProps<F>[],
  /** 分组 */
  group?: GroupInterface<F>[]
}

export const searchFromProps = () => ({
  /** 配置项 */
  option: objectType<FormOption | UnwrapRef<FormOption>>(),
  /**  绑定的值 */
  form: {
    type: Object as PropType<ComputedRef>,
    require: true,
    default: () => {}
  },
  /** 是否显示查询按钮 */
  queryBtn: booleanType(true),
})

export type SearchFromProps = Partial<ExtractPropTypes<ReturnType<typeof searchFromProps>>>;


export const fromProps = () => ({
  /** 配置项 */
  option: objectType<FormOption | UnwrapRef<FormOption>>(),
  /** 绑定的值 */
  form: {
    type: Object,
    require: true,
    default: () => {}
  },
  /** 增 删 改 */
  xBoxType: objectType<Ref<DialogFormType>>(),
  /** 是否查看模式 */
  isView: booleanType(),
  /** 内容区域样式 */
  contentStyle: objectType<CSSProperties>(),
  /** 操作区域样式 */ 
  menuStyle: objectType<CSSProperties>({}),
  /** 是否开启禁止编辑模式 */
  disabled: booleanType(false),
  /** 插槽后缀仅在配合XCrud组件时使用 单独使用XForm组件时请不要使用 */
  _slotSuffix: stringType(''),
})

export type FromProps = Partial<ExtractPropTypes<ReturnType<typeof fromProps>>>;
