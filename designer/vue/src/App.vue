<template>
  <el-container direction="vertical" class="h-100%">
    <router-view name="TopBar" />

    <el-main :style="contentStyle">
      <router-view v-slot="{ Component }">
        <component :is="Component" />
      </router-view>
    </el-main>
    <router-view name="FooterBar" />
  </el-container>
</template>

<script lang="ts" setup>
import type { CSSProperties } from 'vue'

const contentStyle: CSSProperties = {
  width: '100vw',
  minHeight: 'calc(100vh - 300px)',
  background: '#fff',
  padding: '0',
  margin: '0'
}
</script>

<style lang="scss">
* {
  /* transition: all .5s; */
  /* transition: color 1s; */
}
html,
body {
  margin: 0;
  height: 100%;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100%;
  width: 100%;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.ant-select-dropdown .ant-select-item-option-selected:not(.ant-select-item-option-disabled) {
  color: #fff !important;
  .ant-select-item-option-content div {
    border-color: #fff !important;
  }
}
</style>
