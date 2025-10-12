<template>
  <!-- <div @click="onClickOutside">
    <el-icon><Warning /></el-icon>
  </div> -->
  <ElPopover
    popper-class="is-light"
    ref="popoverRef"
    trigger="click"
    width="auto"
  >
    <template #reference>
      <div class="popover-reference">
        <slot></slot>
        <el-icon class="popover-reference-icon"><Warning /></el-icon>
      </div>
    </template>
    <div class="m-1">
      <code class="popover-content">
        {{ props.content }}
      </code>
    </div>
  </ElPopover>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElPopover, ElIcon } from 'element-plus'
import { Warning } from '@element-plus/icons-vue'

const props = defineProps({
  content: {
    type: String,
    default: ''
  },
})


const popoverRef = ref();
const onClickOutside = () => {
  console.log('点击了外部')
  popoverRef.value?.hide()
}

</script>

<style>
.el-popper.is-light {
  padding: 2px 8px !important;
  background: var(--el-bg-color-overlay);
  border: 1px solid var(--el-border-color-light);
}
.popover-reference {
  display: flex;
  align-items: center;
  justify-content: center;
}
.popover-reference-icon {
  margin-left: 6px;
}
.m-1 {
  margin: 0.25rem;
}
.popover-content {
  display: block;
  width: 100%;
  padding: 1px 4px;
  box-sizing: border-box;
  color: var(--code-tooltip-color);
  background-color: var(--code-tooltip-bg-color);
  text-align: center;
  font-size: 14px;
  border-radius: 4px;
  padding: 0.15rem 0.5rem;
  transition: color 0.25s, background-color 0.5s;
}
.popover-reference-slot {
  display: flex;
  align-items: center;
}
.slot-code {
  border-radius: 4px;
  padding: 3px 6px;
  background-color: var(--vp-code-bg);
  transition: color 0.25s, background-color 0.5s;
}
</style>