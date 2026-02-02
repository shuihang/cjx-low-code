import type { CSSProperties } from 'vue'

type SearchConfigType = {
  /** 搜索栏 展开时的样式 */
  search_expand_style: CSSProperties
  /** 搜索栏默认 栅格占据的列数  */
  search_span: number
  /** 标题宽度 */
  label_width: number
  /** 搜索栏col的高度 */
  searchColOffsetHeight: string
  /** 是否显示操作栏 */
  menu_btn: boolean,
  /**
   * 搜索栏 栅格占据的列数
   * @param data.width 搜索栏宽度
   * @param data.searchSpan 搜索栏默认 栅格占据的列数
   * @param data.cloumnLength 搜索栏列数
   * @returns 搜索栏 栅格占据的列数
   */
  getColSpan: (data: { width: number, searchSpan: number, cloumnLength: number }) => number,
  /** 搜索栏插槽后缀 */
  slotSuffix: string
}

/** 搜索栏默认 栅格占据的列数 */
const search_span = 12

const search_config: SearchConfigType = {
  search_expand_style: {
    animationName: 'ztSlideDownIn',
    animationDuration: '0.1s',
    overflow: 'hidden',
  },
  search_span,
  label_width: 90,
  searchColOffsetHeight: '55px',
  menu_btn: true,
  getColSpan: ({ width, searchSpan, cloumnLength = 0 }) => {
    if (width < 768) return 24
    if (width < 992) return 12
    if (width < 1200) return searchSpan
    if (width < 1920) return cloumnLength <= 3 ? searchSpan : searchSpan - 4
    return cloumnLength <= 3 ? searchSpan : 4
  },
  slotSuffix: 'Search',
}

export default search_config
