import type { CSSProperties } from 'vue'

type SearchConfigType = {
  /** 搜索栏 展开时的样式 */
  search_expand_style: CSSProperties
  /** 搜索栏 栅格占据的列数  */
  search_span: number
  /** 标题宽度 */
  label_width: number
  /** 搜索栏col的高度 */
  searchColOffsetHeight: string
  /** 是否显示操作栏 */
  menu_btn: boolean
}

const search_config: SearchConfigType = {
  search_expand_style: {
    animationName: 'ztSlideDownIn',
    animationDuration: '0.1s',
    overflow: 'hidden',
  },
  search_span: 12,
  label_width: 90,
  searchColOffsetHeight: '55px',
  menu_btn: true,
}

export default search_config
