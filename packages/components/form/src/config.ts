import type { Placement } from '../../crud/src/interface'
import type { FormItemType, FormColumnProps } from './interface'

type FormConfigType = {
  /** 表单 栅格占据的列数 */
  span: number
  /** 表单查看模式的 一行 Descriptions Item 的数量 */
  check_column_span: number
  // menuSpan: ,
  /** 表单项label位置 */
  LABEL_POSITION: 'left' | 'right' | 'top',
  /** 查看模式下的表单项label位置 */
  CHECK_LABEL_ALIGN: 'center' | 'left' | 'right'
  /** 标题宽度 */
  label_width: number
  /** 内容提示辅助语位置 */
  tipPlacement: Placement
  /**标题提示辅助语位置 */
  labelTipPlacement: Placement
  /** 是否显示操作栏 */
  menu_btn: boolean,
  /** 空字符串校验的表单项类型 */
  EMPTY_STRINGFORM_ITEMS: FormItemType[]
  /** 全屏宽度24格的表单项类型 */
  FULLSCREEN_COL_SPAN_24_FORM_ITEMS: FormItemType[],
  /** 查看表单宽度24格的表单项类型 */
  VIEW_FORM_COL_SPAN_24_FORM_ITEMS: FormItemType[],
  /**
   * 获取列的表单项类型
   * @param column 列配置
   * @returns 表单项类型
   */
  getColumnFormType: (column: FormColumnProps) => FormItemType
}

const form_config: FormConfigType = {
  span: 12,
  check_column_span: 2,
  label_width: 90,
  tipPlacement: 'right-start',
  labelTipPlacement: 'top',
  LABEL_POSITION: 'right',
  CHECK_LABEL_ALIGN: 'right',
  menu_btn: true,
  EMPTY_STRINGFORM_ITEMS: ['input', 'textarea'],
  FULLSCREEN_COL_SPAN_24_FORM_ITEMS: ['textarea'],
  VIEW_FORM_COL_SPAN_24_FORM_ITEMS: ['textarea'],
  getColumnFormType(column: FormColumnProps) {
    return column.type || 'input'
  }
}

export default form_config
