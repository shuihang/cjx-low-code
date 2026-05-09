/** 用户 pinia */
import { defineStore } from 'pinia'
// TS封装的 本地缓存类
import { Storage } from '../../utils/storage'

// 用户基本信息
export type UserInfo = {
  userName: string
  [data: string]: any // 任意属性
}
// 用户相关的 全局数据
export interface UserProps {
  isLogin: boolean
  userInfo?: UserInfo
}

const useUserStore = defineStore('user', {
  state: (): UserProps => ({
    isLogin: new Storage().getItem('isLogin'),
    userInfo: new Storage().getItem<UserInfo>('userInfo')
  }),
  actions: {
    // 登陆
    login(data: UserInfo) {
      this.isLogin = true
      this.userInfo = data
      new Storage().setItem('isLogin', true)
      new Storage().setItem('userInfo', this.userInfo)
    },
    // 退出登陆
    logout() {
      new Storage().removeItem('isLogin')
      new Storage().removeItem('userInfo')
      this.isLogin = false
      this.userInfo = new Storage().getItem<UserInfo>('userInfo')
    }
  }
})

export default useUserStore
