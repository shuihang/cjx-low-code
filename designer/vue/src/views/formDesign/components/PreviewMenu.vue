<template>
  <div class="preview-menu flex justify-end items-center p-b-10px">
    <el-button type="primary" size="small" @click="openPreviewSourceCode">预览源码</el-button>
    <el-button type="primary" size="small" @click="openPreviewForm">预览表单</el-button>
  </div>
</template>

<script setup lang="ts">
import PreviewForm from './PreviewForm.vue'
import PreviewSourceCode from './PreviewSourceCode.vue'
const proxy = getCurrentInstance()?.appContext.config.globalProperties

const openPreviewSourceCode = () => {
  proxy?.$Dialog(PreviewSourceCode, {
    option: {
      title: '预览源码'
    }
  })
}

const openPreviewForm = () => {
  proxy?.$Dialog(PreviewForm, {
    option: {
      title: '预览表单'
    }
  })
}
</script>
