import {
  arrayType,
  booleanType,
  functionType,
  objectType,
  someType,
  stringType,
} from '../../_util/type'
import type {
  Column,
  FormItemRule,
  TableColumnCtx,
  TreeNode,
} from 'element-plus'
import type { CSSProperties, ComputedRef, UnwrapRef, VNode } from 'vue'
import type {
  FormColumnProps,
  FormItemType,
  FormTypeProps,
  GroupInterface,
  formColumnValues,
} from '../../form/src/interface'
import type { PropsToForm, SlotNodesInterface } from '../../form/src/tempform'
import type { DicDataInterface, PropsInterface } from '../../_util/tool'

export { FormItemRule, SlotNodesInterface, PropsInterface, DicDataInterface }

export const dialogFormTypeValues = ['check', 'create', 'update'] as const

export type DialogFormType = typeof dialogFormTypeValues[number]

export type Row<T> = T

export type Index = number
export interface Scope {
  /** 当前行索引 */
  $index: Index
  /** 当前行数据 */
  row: Row<any>
}

export type Placement =
  'top'
  | 'top-start'
  | 'top-end'
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'
  | 'left'
  | 'left-start'
  | 'left-end'
  | 'right'
  | 'right-start'
  | 'right-end'

/**
 * @param {boolean} done 关闭弹窗 isClear/是否清空表单数据，默认为true
 */
export type CrudFunction<T> = (
  form: T,
  /**
   * 关闭弹窗
   * @param {boolean} isClear 是否清空表单数据 默认为true
   */
  done: (isClear?: boolean) => void,
  index?: number
) => void

// 表格开启懒加载
export type TreeLoad<T extends object> = (
  row: any,
  treeNode: TreeNode,
  resolve: (data: T[]) => void
) => void

// 表单弹窗弹出前的回调
export type BeforeOpen<T> = (
  type: DialogFormType,
  row: T,
  done: () => void
) => void

// 导出
export type HandleExport = (
  exportFn: (
    exportApi: (params?: object) => Promise<any>,
    name: string,
    params?: object
  ) => void
) => void

export interface ImportProps {
  /** 导入接口 */
  importApi: (params?: object) => Promise<any>
  /** 下载模版的接口 */
  downloadApi: (params?: object) => Promise<any>
  /** 导入模版弹窗的标题 */
  title: string
  /** 模版下载完成的名字 */
  downName?: string
  /** 要下载的模版的标识 */
  fileName?: string
  /** 导入的参数 */
  importParams?: {
    [K in string]: any
  }
  /** 导入成功之后响应的函数 */
  onSuccess: () => void
}
export type HandleImport = (importFn: (props: ImportProps) => void) => void

export type ViewTabs = {
  label: string
  value: string
}

type RulesType = Array<Partial<FormItemRule>>
export interface SpanMethodProps<T> {
  row: T
  column: TableColumnCtx<T>
  rowIndex: number
  columnIndex: number
}

/**
 * @param {any} form 表单绑定的form
 * @param {TableColumnCtx<Column>} column 列数据
 * @param {number} index 行索引 cjx-crud组件才有 cjx-form为undefined
 * @param {DialogFormType} _XBoxType 弹窗类型 cjx-crud组件才有 cjx-form为undefined
 * @returns {boolean} 是否显示
 */
export type DisplayInterface =
  | boolean
  | ((props: {
      form: any
      column: FormColumnProps[]
      index?: number
      _XBoxType?: DialogFormType
    }) => boolean)

export type ColumnProps = Pick<PropsToForm, 'change'> &
  FormTypeProps & {
    /** 列标题 */
    label: string | VNode
    /** 列标题国际化 国际化切换语言时能实时更新视图,不需要刷新页面 当有i18nLabel时会覆盖label */
    // i18nLabel?: I18nKey,
    /** 列标题的内容属性名称 同时也是弹窗绑定的值 */
    prop: string
    /** 表单项的需要绑定的其他值 type为selectPeople/regionalGrid 的时候该参数必填 */
    componentBind?: string
    /**
    * 表单项的类型 默认input
    * @type {FormItemType} 'input' | 'textarea' | 'inputNumber' | 'select' | 'checkbox' | 'datePicker' | 'radio'  | 'radioButton' |
      'cascader' | 'switch' | 'treeSelect' | 'upload'  | 'sign' | 'editTable' | 'selectPeople'
    */
    type?: FormItemType
    /** 控制是否使用表单项插槽，目前已废弃 现在只要有对应的插槽就会渲染  */
    formSlot?: boolean
    /** 表单项 插槽的VNode */
    formSlotNodes?: SlotNodesInterface
    /** 表单项的栅列 */
    span?: number
    /** 表单查看弹窗项的栅列 默认为`1`  type为textarea/sign/upload的情况默认为`2` */
    checkSpan?: number
    /** 对齐方式 默认left */
    align?: 'left' | 'center' | 'right'
    /** 表头对齐方式， 若不设置该项，则使用表格的对齐方式 默认为`left` */
    headerAlign?: 'left' | 'center' | 'right'
    /** 列是否固定在左侧或者右侧。 `true`表示固定在左侧 */
    fixed?: boolean | 'left' | 'right'
    /** 对应列的宽度 默认为`90`*/
    width?: number | string
    /** 对应列的最小宽度， 对应列的最小宽度， 与 width 的区别是 width 是固定的，min-width 会把剩余宽度按比例分配给设置了 min-width 的列 */
    minWidth?: number | string
    /** 当内容过长被隐藏时显示 tooltip */
    showOverflowTooltip?: boolean
    /**
     * 用来格式化内容
     * @param {any} row 行数据
     * @param {TableColumnCtx<Column>} column 列数据
     * @param {any} cellValue 单元格数据
     * @param {number} index 行索引
     * @returns 格式化后的内容
     * */
    formatter?: (
      row: any,
      column: TableColumnCtx<Column>,
      cellValue: any,
      index: number
    ) => any
    /** 列的 className */
    className?: string
    /** 当前列标题的自定义类名 */
    labelClassName?: string
    /** 仅对 type=selection 的列有效，类型为 `Function`，`Function` 的返回值用来决定这一行的`CheckBox`是否可以勾选 */
    selectable?: () => void
    /** 数据字典属性的配置对象 */
    props?: PropsInterface
    /**
     * 数据字典值
     * @type {DicDataInterface} 默认为 {label: any, value: any}[]
     */
    dicData?: DicDataInterface
    /** 数据字典接口url地址 */
    // dicUrl?: string,
    /** 数据字典接口url携带请求参数 */
    // dicQuery?: object,
    /** 数据字典接口url携带头部参数 */
    // dicHeaders?: object,
    /** 数据字典接口函数 返回数据格式化方法  */
    // dicAjaxFormatter?: (res: any) => any[],
    /** 数据字典 接口函数返回的数据  */
    dicAjaxResolve?: Promise<any>
    /** 数据字典接口请求方式 */
    // dicMethod?: 'GET' | 'POST' | 'PUT',
    /** 搜索项框栅列 */
    searchSpan?: number
    /** 搜索栏操作区域的栅列 */
    menuSpan?: number
    /** 搜索项标题宽度 默认为`90` */
    searchLabelWidth?: number
    /** 是否为搜索项 默认为`false` */
    search?: boolean
    /** 控制是否使用搜索栏插槽，目前已废弃 现在只要有对应的插槽就会渲染  */
    searchSlot?: boolean
    /** 搜索项辅助文字 */
    searchPlaceholder?: string
    /** 搜索项的类型 默认为`input` */
    searchType?: FormItemType
    /* 搜索项清除 默认为`true` */
    searchClearable?: boolean
    /** 表单校验条件 */
    rules?: RulesType
    /** 控制是否使用表格插槽，目前已废弃 现在只要有对应的插槽就会渲染 */
    slot?: boolean
    /**
     * 表单当前项是否显示。可以是布尔类型或函数表达式。
     * 如果未使用此参数，则取 `display` 参数的值，默认为 `true`。
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
     * 表单新增时当前项是否显示。可以是布尔类型或函数表达式。
     * 如果未使用此参数，则取 `display` 参数的值，默认为 `true`。
     * @param {any} form 表单绑定的form
     * @param {FormColumnProps[]} column 列数据
     * @param {number} index 行索引
     * @param {DialogFormType} _XBoxType 弹窗类型
     * @returns {boolean} 是否显示
     */
    createDisplay?: DisplayInterface
    /**
     * 表单编辑时当前项是否显示。可以是布尔类型或函数表达式。
     * 如果未使用此参数，则取 `display` 参数的值，默认为 `true`。
     * @param {any} form 表单绑定的form
     * @param {FormColumnProps[]} column 列数据
     * @param {number} index 行索引
     * @param {DialogFormType} _XBoxType 弹窗类型
     * @returns {boolean} 是否显示
     */
    updateDisplay?: DisplayInterface
    /**
     * 表单查看时当前项是否显示。可以是布尔类型或函数表达式。
     * 如果未使用此参数，则取 `display` 参数的值，默认为 `true`。
     * @type {DisplayInterface = boolean | ((props: {form: any, column: FormColumnProps[], index: number, _XBoxType?: DialogFormType }) => boolean)}
     * @param {any} form 表单绑定的form
     * @param {FormColumnProps[]} column 列数据
     * @param {number} index 行索引
     * @param {DialogFormType} _XBoxType 弹窗类型
     * @returns {boolean} 是否显示
     */
    checkDisplay?: DisplayInterface
    /**
     * 表单当前项是否显示。可以是布尔类型或函数表达式。
     * 如果未使用此参数，则取 `display` 参数的值，默认为 `true`。
     * @param {any} form 表单绑定的form
     * @param {FormColumnProps[]} column 列数据
     * @param {number} index 行索引
     * @param {DialogFormType} _XBoxType 弹窗类型
     * @returns {boolean} 是否可以编辑
     * */
    disabled?:
      | boolean
      | ((props: {
          form: any
          column: FormColumnProps[]
          index: number
          _XBoxType?: DialogFormType
        }) => boolean)
    /**
     * 表单新增时当前项是否显示。可以是布尔类型或函数表达式。
     * 如果未使用此参数，则取 `disabled` 参数的值，默认为 `false`。
     * @param {any} form 表单绑定的form
     * @param {FormColumnProps[]} column 列数据
     * @param {number} index 行索引
     * @param {DialogFormType} _XBoxType 弹窗类型
     * @returns {boolean} 是否可以编辑
     * */
    createDisabled?:
      | boolean
      | ((props: {
          form: any
          column: FormColumnProps[]
          index: number
          _XBoxType?: DialogFormType
        }) => boolean)
    /**
     * 表单编辑时当前项是否显示。可以是布尔类型或函数表达式。
     * 如果未使用此参数，则取 `disabled` 参数的值，默认为 `false`。
     * @param {any} form 表单绑定的form
     * @param {FormColumnProps[]} column 列数据
     * @param {number} index 行索引
     * @param {DialogFormType} _XBoxType 弹窗类型
     * @returns {boolean} 是否可以编辑
     * */
    updateDisabled?:
      | boolean
      | ((props: {
          form: any
          column: FormColumnProps[]
          index: number
          _XBoxType?: DialogFormType
        }) => boolean)
    /**
     * 表单查看时当前项是否显示。可以是布尔类型或函数表达式。
     * 如果未使用此参数，则取 `disabled` 参数的值，默认为 `false`。
     * @param {any} form 表单绑定的form
     * @param {FormColumnProps[]} column 列数据
     * @param {number} index 行索引
     * @param {DialogFormType} _XBoxType 弹窗类型
     * @returns {boolean} 是否可以编辑
     * */
    checkDisabled?:
      | boolean
      | ((props: {
          form: any
          column: FormColumnProps[]
          index: number
          _XBoxType?: DialogFormType
        }) => boolean)
    /** 表单项标题宽度 默认`90`*/
    labelWidth?: number
    /** 表格项是否隐藏 默认为 `false` */
    hide?: boolean
    /** 设置列 需要用到 */
    setUpHide?: boolean
    /** 位置排序，序号越大越靠前 */
    order?: number
    /** 表单位置排序，序号越大越靠前 如果没有会取`order`参数 */
    formOrder?: number
    /** 搜索栏位置排序，序号越大越靠前 */
    searchOrder?: number
    /** 内容提示辅助语 */
    tip?: string | VNode
    /** 内容提示辅助语位置 */
    tipPlacement?: Placement
    /** 标题提示辅助语 */
    labelTip?: string | VNode
    /** 标题提示辅助语位置 */
    labelTipPlacement?: Placement
    /** 表单项的样式  */
    style?: CSSProperties
    /** 实现以该列为基准的排序 默认为`false`*/
    sortable?: boolean
    /** 组件响应的事件 */
    on?: { [key in `on${Capitalize<string>}`]: (...args: any[]) => void }
  }

export type TableGroupInterface = Omit<GroupInterface, 'column'> & {
  column?: Pick<
    ColumnProps,
    | typeof formColumnValues[number]
    | 'display'
    | 'checkDisplay'
    | 'updateDisplay'
    | 'createDisplay'
    | 'disabled'
    | 'checkDisabled'
    | 'updateDisabled'
    | 'createDisabled'
  >[]
}

export type TableOption = {
  /** 表格标题 */
  title?: string | VNode
  /** 表格高度 */
  height?: string
  /** table的最大高度。 合法的值为数字或者单位为 px 的高度。 */
  maxHeight?: string
  /** 是否有序号 默认为`false` */
  index?: boolean
  /** 序号栏宽度 默认为`50` */
  indexWidth?: string | number
  /** 序号栏 文本内容 */
  indexText?: string
  /** 是否懒加载子节点数据(树形表格) */
  lazy?: boolean
  /** 渲染嵌套数据的配置选项(树形表格) */
  treeProps?: {
    hasChildren?: string
    children?: string
    /** 父节点和子节点的选择状态是否关联 */
    checkStrictly?: boolean
  }
  /** 是否带有纵向边框 默认为`false` */
  border?: boolean
  /**  */
  span?: number
  /** 表单项的文字宽度 默认为`90` */
  labelWidth?: number
  /** 查看弹窗的labelWidth 如果没有取labelWidth 默认为`90` */
  checkLabelWidth?: number
  /** 是否有选择框 默认为`false` */
  selection?: boolean
  /** 多选切换分页是否会情况已选择的数据  请注意， 需指定 rowKey 来让这个功能生效。 默认为`true` */
  reserveSelection?: boolean
  /** 是否有单选列 默认为`false` */
  radio?: boolean
  /** 复选框栏宽度 默认为`50` */
  selectionWidth?: string
  /** 行数据的`Key`，用来优化 `Table`的渲染；在使用 `reserve-selection`功能与显示树形数据时，该属性是必填的。 */
  rowKey?: string
  /** 是否显示操作栏 默认为`false` */
  menu?: boolean
  /** 操作栏标题 */
  menuTitle?: string
  /** 操作栏宽度 默认为`220` */
  menuWidth?: string | number
  /** 操作栏最小宽度 */
  menuMinWidth?: string | number
  /** 操作栏列是否固定在左侧或者右侧。 `true`表示固定在左侧  默认`right`*/
  menuFixed?: boolean | 'left' | 'right'
  /**操作栏表头的对齐方式 */
  menuHeaderAlign?: 'left' | 'center' | 'right'
  /** 操作栏按钮的对齐方式 默认为`center` */
  menuAlign?: 'left' | 'center' | 'right'
  /** 是否开启拖拽排序 默认为`false` */
  sortable?: boolean
  /** 表头配置 */
  column: ColumnProps[]
  /** 表单分组 */
  group?: TableGroupInterface[]
  /* column 的 key， 如果需要使用 filter-change 事件，则需要此属性标识是哪个 column 的筛选条件 */
  // filterChange: functionType<(filters: any) => void>()
  /** 表格等待框的控制 */
  tableLoading?: boolean
  /** 是否要高亮当前行 */
  highlightCurrentRow?: boolean
  /** 搜索项标题宽度 */
  searchLabelWidth?: number
  /** 搜索项框栅列 */
  searchSpan?: number
  /** 是否默认展开所有行，当前表格包含展开行存在或者为树形表格时有效 */
  defaultExpandAll?: boolean
  /** 弹窗是否为抽屉 */
  isDrawer?: boolean
  /** 表格新增弹窗标题 */
  addTitle?: string
  /** 表格修改弹窗标题 */
  editTitle?: string
  /** 表格查看弹窗标题 */
  viewTitle?: string
  /** 表格弹窗宽度 */
  dialogWidth?: string
  /** 表格新增按钮 */
  addBtn?: boolean
  /** 表格删除按钮 */
  delBtn?: boolean
  /** 表格查看按钮 */
  viewBtn?: boolean
  /** 表格修改按钮 */
  updateBtn?: boolean
  /** 表格导入按钮 */
  importBtn?: boolean
  /** 表格导出按钮 */
  excelBtn?: boolean
  /** tabs查看 仅对查看弹窗有效 */
  viewTabs?: ViewTabs[]
  /** 当前tab */
  viewTabsCurrent?: string | number
  /** 表格头部菜单栏右边是否显示 */
  menuHeaderRight?: boolean
  /** 是否卡片模式 */
  isCard?: boolean
  /** 表单操作栏是否显示 */
  menuBtn?: boolean
  /** 表格弹窗取消按钮 */
  cancelBtn?: boolean
  /** 表格弹窗取消按钮文本 */
  cancelBtnText?: string
  /** 表格弹窗提交按钮 */
  submitBtn?: boolean
  /** 表格弹窗提交按钮文本 */
  submitBtnText?: string
  /** 表单查看模式的一行 Descriptions-Item的数量 默认为`2` */
  checkColumnSpan?: number
}

// export type TableOption = Partial<ExtractPropTypes<ReturnType<typeof tableOption>>>;

export interface CrudPageProps {
  /** 当前页数 */
  currentPage?: number
  /** 每页显示条目个数 */
  pageSize?: number
  /** 总条目数 */
  total?: number
  /** 页码按钮的数量，当总页数超过该值时会折叠 */
  pagerCount?: number
  /** 是否为分页按钮添加背景色 */
  background?: boolean
  /** 组件布局，子组件名用逗号分隔 */
  layout?: Array<
    'prev' | 'pager' | 'next' | 'jumper' | '->' | 'sizes' | 'total' | 'slot'
  >
  /** 每页显示个数选择器的选项设置 */
  pageSizes?: number[]
}

/* crud组件 回调事件 */
export interface EmitFn {
  /** 页码切换的回调 */
  onCurrentChange: (pageSize: number) => void
  /** 切换每页显示条目个数的回调 */
  onSizeChange: (pageSize: number) => void
  /** 清空搜索回调方法 */
  onSearchReset: () => void
  /** 点击搜索后触发该事件 */
  onSearchChange: (form: object, done: () => void) => void
  /** 表单弹窗 确认事件 */
  onFormSubmitChange: (form: object, done: (isClear?: boolean) => void) => void
  /** 弹窗关闭的回调函数 */
  onCloseChange: () => void
  /** 导出的 响应函数 */
  onHandleExport: () => void
  /* 导入的 响应函数 */
  onHandleImport: () => void
  /** 表格密度 */
  onTableDensity: (value: 'large' | 'default' | 'small') => void
  /** 监听搜索栏的展开收起 事件 */
  onExpandChange: (height: number) => void
  /** 表单切换tab触发的事件 */
  onDialogTabChange: (index: number) => void
}

export type PermissionMenBtnType = ComputedRef<boolean> | ((porps: Scope) => boolean) 

/* 权限配置 */
export interface CrudPermission {
  /** 新增按钮权限 */
  addBtn?: ComputedRef<boolean>
  /** 编辑按钮权限 */
  editBtn?: PermissionMenBtnType
  /** 删除按钮权限 */
  delBtn?: PermissionMenBtnType
  /** 查看按钮权限 */
  viewBtn?: PermissionMenBtnType
  /** 导出按钮权限 */
  exportBtn?: ComputedRef<boolean>
  /** 导入按钮权限 */
  importBtn?: ComputedRef<boolean>
  /** 查询按钮权限 */
  queryBtn?: ComputedRef<boolean>
}

export const crudProps = () => ({
  onLoad: functionType<() => Promise<any>>(),
  /** 表格数据 */
  data: arrayType<any[]>(),
  /** 表格配置 */
  option: objectType<TableOption | UnwrapRef<TableOption>>(),
  /** 分页的配置 */
  page: objectType<CrudPageProps>(),
  /** 搜索条件 */
  search: objectType<object>(),
  /** 表单数据的双向绑定 */
  form: objectType<object>(),
  /**
   * 按钮权限配置
   *
   **/
  permission: objectType<CrudPermission>(),
  /** 合并行或列的计算方法 */
  spanMethod: functionType(),
  /** 自定义的合计计算方法 */
  summaryMethod: functionType(),
  /** 行的 className 的回调方法，也可以使用字符串为所有行设置一个固定的 className。 */
  rowClassName:
    someType<
      (data: { row: any; rowIndex: number }) => string | CSSProperties
    >(),
  /** 单元格的 className 的回调方法，也可以使用字符串为所有单元格设置一个固定的 className。 */
  cellClassName:
    someType<
      (data: {
        row: any
        column: any
        rowIndex: number
        columnIndex: number
      }) => string | CSSProperties
    >(),

  /** 加载动画 */
  tableLoading: booleanType(),
  /** 表单弹窗的className */
  dialogClassName: stringType(),
})
