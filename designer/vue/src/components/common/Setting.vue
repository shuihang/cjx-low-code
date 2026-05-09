<template>
  <el-drawer
    v-model="openDrawer"
    width="320"
    :closable="false"
    :footer-style="{ textAlign: 'right' }"
    @close="onClose"
  >
    <template #header>
      <div class="title">
        <el-icon><Setting /></el-icon>网站设置
      </div>
    </template>

    <div class="list">
      <h3><i class="iconfont icon-quanping1" />全屏</h3>
      <div class="theme">
        <el-switch
          v-model:checked="isEnabled"
          checked-children="开"
          un-checked-children="关"
          @change="screenfullChange"
        />
      </div>
    </div>

    <div class="list">
      <h3><i class="iconfont icon-pifuzhuti" />主题色</h3>
      <div class="theme color">
        <el-button
          v-for="item in themeColorData"
          :key="item.id"
          type="primary"
          :style="themeBtnStyle(item.value)"
          @click="themeColorChange(item.value)"
        >
          {{ item.label }}
        </el-button>
      </div>
    </div>

    <div class="list">
      <h3><i class="iconfont icon-yuanjiaojuxing1" />圆角</h3>
      <div class="theme">
        <el-input-number
          id="inputNumber"
          v-model:value="theme.token.borderRadius"
          :min="0"
          style="width: 80%; margin-right: 6px"
          @change="themeRadiusChange"
        />
        px
      </div>
    </div>

    <template #footer>
      <!-- <a-button style="margin-right: 8px" @click="onClose">关闭</a-button> -->
      <el-button type="primary" @click="onClose">关闭</el-button>
    </template>
  </el-drawer>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia'

import { Setting } from '@element-plus/icons-vue'
import screenfull from 'screenfull'

// 主题色
import useTheme from '@/store/modules/theme'

// 外观设置是否打开
import useSetting from '@/store/modules/setting'
const { themeColorData, theme, themeColor } = storeToRefs(useTheme())
// openDrawer/是否打开网站设置 isEnabled/是否全屏
const { openDrawer, isEnabled } = storeToRefs(useSetting())

const themeBtnStyle = (color: string) => {
  return themeColor.value === color
    ? {
        marginRight: '15px',
        backgroundColor: `${color} !important`,
        boxShadow: `0 2px 0 ${color}`,
        color: `#fff`
      }
    : {
        marginRight: '15px',
        color,
        backgroundColor: 'transparent',
        borderColor: color,
        boxShadow: 'none'
      }
}

// 全屏
const screenfullChange = () => {
  //screenfull.isEnabled  此方法返回布尔值，判断当前能不能进入全屏
  if (!screenfull.isEnabled) {
    return false
  }
  //screenfull.toggle 此方法是执行全屏化操作。如果已是全屏状态，则退出全屏
  screenfull.toggle()
}
// 监听全屏
screenfull.on('change', () => {
  isEnabled.value = screenfull.isFullscreen
  // console.log('Am I fullscreen?', screenfull.isFullscreen ? 'Yes' : 'No');
})

// 主题色
const themeColorChange = (value: string) => {
  themeColor.value = value
  useTheme().setThemeColor(value)
}

// 圆角
const themeRadiusChange = (value: number) => {
  useTheme().setThemeBorderRadius(Number(value))
}

const onClose = () => {
  // open.value = false;
  openDrawer.value = false
}
</script>

<style lang="scss" scoped>
@use '../../theme/styles/mixin.scss' as *;
.title {
  @include color;
}
.list {
  margin-bottom: 25px;
  h3 {
    font-size: 15px;
    width: 66px; //必须设置宽度才行
    text-align-last: justify;
    text-align: justify;

    .iconfont {
      font-size: 14px;
      margin-left: 2px;
      @include color;
    }
  }
  .theme {
    display: flex;
    align-items: center;
    margin-top: 15px;
  }
}
</style>
