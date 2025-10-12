<template>
  <div>
    <XEditTable :data="data" :option="option" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { XEditTable } from 'cjx-low-code'
import type { EditTableOption } from 'cjx-low-code'

const data = ref([])

const option = ref<EditTableOption>({
  
})

</script>