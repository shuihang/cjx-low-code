import type { CSSProperties } from 'vue'

type SearchConfigType = {
  /** 搜索栏 展开时的样式 */
  searchExpandStyle: CSSProperties
  /** 搜索栏默认 栅格占据的列数  */
  searchSpan: number
  /** 标题宽度 */
  labelWidth: number
  /** 搜索栏col的高度 */
  searchColOffsetHeight: string
  /** 是否显示操作栏 */
  menuBtn: boolean
  /**
   * 搜索栏 栅格占据的列数
   * @param data.width 搜索栏宽度
   * @param data.searchSpan 搜索栏默认 栅格占据的列数
   * @param data.cloumnLength 搜索栏列数
   * @returns 搜索栏 栅格占据的列数
   */
  getColSpan: (data: { width: number; searchSpan: number; cloumnLength: number }) => number
  /** 搜索栏插槽后缀 */
  slotSuffix: string
}

/** 搜索栏默认 栅格占据的列数 */
const searchSpan = 12

const searchConfig: SearchConfigType = {
  searchExpandStyle: {
    animationName: 'xSlideDownIn',
    animationDuration: '0.1s',
    overflow: 'hidden'
  },
  searchSpan,
  labelWidth: 90,
  searchColOffsetHeight: '55px',
  menuBtn: true,
  getColSpan: ({ width, searchSpan, cloumnLength = 0 }) => {
    if (width < 768) return 24
    if (width < 992) return 12
    if (width < 1200) return searchSpan
    if (width < 1920) return cloumnLength <= 3 ? searchSpan : searchSpan - 4
    return cloumnLength <= 3 ? searchSpan : 4
  },
  slotSuffix: 'Search'
}

export default searchConfig
