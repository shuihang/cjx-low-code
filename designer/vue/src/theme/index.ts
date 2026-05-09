/** 主题色配置 */
export type ThemeColorData = Array<{ label: string; value: string; id: symbol }>

export const themeColorData: ThemeColorData = [
  {
    label: '蓝',
    value: '#1677ff',
    id: Symbol()
  },
  {
    label: '绿',
    value: '#00b96b',
    id: Symbol()
  },
  {
    label: '红',
    value: '#F5222D',
    id: Symbol()
  }
]
