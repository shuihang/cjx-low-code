<template>
  <div>
    <el-button type="primary" @click="openDialog">打开命令式弹窗</el-button>
  </div>
</template>

<script setup lang="ts">
import { getCurrentInstance } from 'vue'
import Dome from './dome.vue';
const proxy = getCurrentInstance()?.appContext.config.globalProperties

const openDialog = () => {
  proxy?.$XDialog(Dome, {
    option: {
      title: '命令式弹窗',
      width: '500px',
    }
  })
}
</script>