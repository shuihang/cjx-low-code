<template>
  <div>test</div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'Test',
})

const props = defineProps({
  msg: {
    type: String,
    default: 'test',
  },
  count: {
    type: Number,
    default: 0,
  },
})
</script>
