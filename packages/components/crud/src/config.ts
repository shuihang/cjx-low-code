import { useLocale } from '@cjx-low-code/hooks'

const { t } = useLocale()

/**
 *  crud组件默认配置
 **/
const crudConfig = {
  /** 行数据的 Key，用来优化 Table 的渲染；在使用 reserve-selection 功能与显示树形数据时，该属性是必填的。 */
  row_key: 'id',
  /** 序号栏宽度 */
  index_width: '62',
  /** 序号栏标题 */
  index_title: t('table.index'),
  /** 复选框栏宽度 */
  selection_width: '50',
  /** 操作栏宽度 */
  menu_width: '220',
  /** 操作栏标题 */
  menu_title: t('table.action'),
  /** 标题栏列是否固定在左侧或者右侧。 true 表示固定在左侧 */
  menu_fixed: 'right',
  /** 操作栏表头的对齐方式 */
  menu_header_align: 'center',
  /** 头部操作栏 按钮 */
  // headerBtnSize: 'default',
  /** 表格头部菜单栏右边是否显示 */
  menu_header_right: true,
  /** 表格是否显示加载动画 */
  table_loading: true,
  /** 表格弹窗宽度 */
  dialog_width: '80%',
  /** 拖动排序绑定的dom元素 */
  dropRowClass: '.el-table__body-wrapper table tbody',
}

export default crudConfig
