<template>
  <div>
    <XEditTable v-model="data" :option="option" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { EditTableOption } from 'cjx-low-code'

const data = ref([])

const option = ref<EditTableOption>({
  sortable: false,
  addBtn: true,
  delBtn: true,
  copyBtn: true,
  column: [
    {
      label: '姓名',
      prop: 'name',
      type: 'input',
    },
    {
      label: '年龄',
      prop: 'age',
      type: 'inputNumber',
    },
    {
      label: '性别',
      prop: 'sex',
      type: 'select',
      dicData: [
        {
          label: '男',
          value: '1'
        },
        {
          label: '女',
          value: '2'
        }
      ]
    }
  ]
})

</script>