<template>
  <div class="custom-sidebar">
    <!-- 你的自定义侧边栏内容 -->
    <div v-for="item in sidebarItems" :key="item.text" class="sidebar-item">
      <a :href="item.link">{{ item.text }}</a>
      <div v-if="item.items" class="sub-items">
        <a v-for="subItem in item.items" :key="subItem.text" :href="subItem.link">
          {{ subItem.text }}
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useData } from 'vitepress'

const { theme } = useData()
const sidebarItems = ref([])

onMounted(() => {
  // 获取侧边栏数据
  sidebarItems.value = theme.value.sidebar['/zh-CN/component/']
})
</script>

<style scoped>
.custom-sidebar {
  /* 自定义样式 */
}
</style>
