/** 主题 pinia */
import { defineStore } from 'pinia'
// TS封装的 本地缓存类
import { Storage } from '../../utils/storage'

// 导入主题配置
import { themeColorData } from '../../theme/index'
import type { ThemeColorData } from '../../theme/index'

// 需要忽略的
const colorIgnore = ['borderRadius', 'colorPrimaryTextActive']

const color: string = new Storage().getItem('colorTheme') || themeColorData[0].value
document.documentElement.dataset.theme = color

interface TokenProps {
  colorLink: string
  colorPrimary: string
  colorPrimaryBg: string
  colorPrimaryTextActive: '#ffffff'
  borderRadius: number
}
interface ThemeProps {
  themeColorData: ThemeColorData
  theme: { token: TokenProps }
  themeColor: string
}

const useTheme = defineStore('theme', {
  state: (): ThemeProps => ({
    themeColorData, // 有几个颜色的主题的 数据列表
    theme: {
      token: {
        colorLink: color,
        colorPrimary: color,
        colorPrimaryBg: color,
        colorPrimaryTextActive: '#ffffff',
        borderRadius: new Storage().getItem('borderRadiusTheme') || 20
      }
    },
    themeColor: color
  }),
  actions: {
    // 设置的 所有主题颜色
    setThemeColor(value: string) {
      Object.keys(this.theme.token).forEach((key) => {
        if (!colorIgnore.includes(key)) {
          this.theme.token[key] = value
        }
      })

      new Storage().setItem('colorTheme', value)
      document.documentElement.dataset.theme = value
    },
    // 设置圆角
    setThemeBorderRadius(value: number) {
      this.theme.token.borderRadius = value
      new Storage().setItem('borderRadiusTheme', value)
    }
  }
})

export default useTheme
