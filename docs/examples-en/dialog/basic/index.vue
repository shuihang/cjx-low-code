<template>
  <div>
    <el-button type="primary" @click="openDialog">Open command style pop-up window</el-button>
  </div>
</template>

<script setup lang="ts">
import { getCurrentInstance } from 'vue'
import Dome from './demo.vue';
const proxy = getCurrentInstance()?.appContext.config.globalProperties

const openDialog = () => {
  proxy?.$XDialog(Dome, {
    option: {
      title: 'Command style pop-up window',
      width: '500px',
    }
  })
}
</script>