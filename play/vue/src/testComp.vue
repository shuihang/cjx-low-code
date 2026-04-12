<template>
  <div>
    <h1>Test Comp {{ type }}</h1>
    <slot name="testCompSlot" test="11" />
    <slot />
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'TestComp'
})

const props = defineProps({
  /**
   * ATestComp组件的 props类型jsDoc
   */
  type: {
    type: String,
    default: 'text'
  },
  onTest: {
    type: Function,
    default: () => ({})
  }
})

const emits = defineEmits<{
  (e: 'change', d: any): void
}>()

const slots = defineSlots<{
  /**
   * 测试组件插槽
   */
  testCompSlot: (props: { test: string }) => any
  default: () => any
}>()
</script>
