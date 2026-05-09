/** 网站设置 pinia */
import { defineStore } from 'pinia'

interface SettingProps {
  openDrawer: boolean
  isEnabled: boolean
}

const useSetting = defineStore('setting', {
  state: (): SettingProps => {
    return {
      openDrawer: false, // 是否打开网站设置
      isEnabled: false // 是否全屏
    }
  },
  actions: {}
})

export default useSetting
