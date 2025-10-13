<template>
  <div>
    <XEditTable v-model="data" :option="option" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { XEditTable } from 'cjx-low-code'
import type { EditTableOption } from 'cjx-low-code'

const data = ref([])

const option = ref<EditTableOption>({
  sortable: false,
  addBtn: true,
  delBtn: true,
  copyBtn: true,
  column: [
    {
      label: 'Name',
      prop: 'name',
      type: 'input',
    },
    {
      label: 'Age',
      prop: 'age',
      type: 'inputNumber',
    },
    {
      label: 'Sex',
      prop: 'sex',
      type: 'select',
      dicData: [
        {
          label: 'boy',
          value: '1'
        },
        {
          label: 'girl',
          value: '2'
        }
      ]
    }
  ]
})

</script>