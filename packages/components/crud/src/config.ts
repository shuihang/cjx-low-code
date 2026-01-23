import { useLocale } from '@cjx-low-code/hooks'
import type { AlignType, CrudPageProps } from './interface';

const { t } = useLocale()

type CrudConfigType = {
  /** 行数据的 Key，用来优化 Table 的渲染；在使用 reserve-selection 功能与显示树形数据时，该属性是必填的。 */
  row_key: string,
  /** 序号栏宽度 */
  index_width: string,
  /** 序号栏标题 */
  index_title: string,
  /** 复选框栏宽度 */
  selection_width: string,
  /** 操作栏宽度 */
  menu_width: string,
  /** 操作栏标题 */
  menu_title: string,
  /** 标题栏列是否固定在左侧或者右侧。 true 表示固定在左侧 */
  menu_fixed: 'left' | 'right',
  /** 操作栏表头的对齐方式 */
  menu_header_align: AlignType,
  /** 头部操作栏 按钮 */
  // headerBtnSize: 'default',
  /** 表格头部菜单栏右边是否显示 */
  menu_header_right: boolean,
  /** 表格是否显示加载动画 */
  table_loading: boolean,
  /** 表格弹窗宽度 */
  dialog_width: string,
  /** 拖动排序绑定的dom元素 */
  dropRowClass: string,
  /** 是否显示溢出提示 默认 `true` */
  show_overflow_tooltip: boolean,
  /** 最大菜单按钮数量 超出后显示更多按钮，默认为3个按钮 */
  MAX_MENU_BTN_COUNT: number,
  /** 导出文件默认后缀 */
  export_file_suffix: `.${string}`,
  /** 分页器布局 */
  page_layout: Required<Pick<CrudPageProps, 'layout'>>['layout'],
  /** 分页器最多显示页码数量 */
  pager_count: number,
  /** 分页器每页显示条数选择器的选项设置 */
  page_sizes: number[],
  /** 分页器是否显示背景 */
  page_background: boolean,
  /** 拖动排序绑定的dom元素类名 */
  draggable_class: string,
}

/**
 *  crud组件默认配置
 **/
const crudConfig: CrudConfigType = {
  row_key: 'id',
  index_width: '62',
  index_title: t('table.index'),
  selection_width: '50',
  menu_width: '220',
  menu_title: t('table.action'),
  menu_fixed: 'right',
  menu_header_align: 'center',
  menu_header_right: true,
  table_loading: true,
  dialog_width: '80%',
  dropRowClass: '.el-table__body-wrapper table tbody',
  show_overflow_tooltip: true,
  MAX_MENU_BTN_COUNT: 3,
  export_file_suffix: '.xlsx',
  page_layout: ['total', 'sizes', 'prev', 'pager', 'next', 'jumper'],
  pager_count: 7,
  page_sizes: [10, 20, 30, 50, 100],
  page_background: true,
  draggable_class: 'handle'
}

export default crudConfig
