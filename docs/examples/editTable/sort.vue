<template>
  <div>
    <XEditTable v-model="data" :option="option" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { EditTableOption } from 'cjx-low-code'

const data = ref([
  {
    name: '张三',
    age: 18,
    sex: '1'
  },
  {
    name: '李四',
    age: 20,
    sex: '2'
  },
  {
    name: '王五',
    age: 22,
    sex: '1'
  },
  {
    name: '赵六',
    age: 24,
    sex: '2'
  },
])

const option = ref<EditTableOption>({
  sortable: true,
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