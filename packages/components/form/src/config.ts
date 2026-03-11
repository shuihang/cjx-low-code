import type { Placement } from '../../crud/src/interface'
import type { FormItemType, SchemaProvide } from './interface'

type FormConfigType = {
  /** 表单 栅格占据的列数 */
  SPAN: number
  /** 表单查看模式的 一行 Descriptions Item 的数量 */
  CHECK_COLUMN_SPAN: number
  // menuSpan: ,
  /** 表单项label位置 */
  LABEL_POSITION: 'left' | 'right' | 'top'
  /** 查看模式下的表单项label位置 */
  CHECK_LABEL_ALIGN: 'center' | 'left' | 'right'
  /** 标题宽度 */
  LABEL_WIDTH: number
  /** 内容提示辅助语位置 */
  TIP_PLACEMENT: Placement
  /**标题提示辅助语位置 */
  LABEL_TIP_PLACEMENT: Placement
  /** 是否显示操作栏 */
  MENU_BTN: boolean
  /** 空字符串校验的表单项类型 */
  EMPTY_STRING_FORM_ITEMS: FormItemType[]
  /** 全屏宽度24格的表单项类型 */
  FULLSCREEN_COL_SPAN_24_FORM_ITEMS: FormItemType[]
  /** 查看表单宽度24格的表单项类型 */
  VIEW_FORM_COL_SPAN_24_FORM_ITEMS: FormItemType[]
  /**
   * 获取列的表单项类型
   * @param col 列配置
   * @returns 表单项类型ew3m ,
   */
  getColumnFormType: (col: SchemaProvide) => FormItemType
}

const formConfig: FormConfigType = {
  SPAN: 12,
  CHECK_COLUMN_SPAN: 2,
  LABEL_WIDTH: 90,
  TIP_PLACEMENT: 'right-start',
  LABEL_TIP_PLACEMENT: 'top',
  LABEL_POSITION: 'right',
  CHECK_LABEL_ALIGN: 'right',
  MENU_BTN: true,
  EMPTY_STRING_FORM_ITEMS: ['input', 'textarea'],
  FULLSCREEN_COL_SPAN_24_FORM_ITEMS: ['textarea'],
  VIEW_FORM_COL_SPAN_24_FORM_ITEMS: ['textarea'],
  getColumnFormType(col) {
    return col.type || 'input'
  }
}

export default formConfig
