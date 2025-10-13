<template>
  <div>
    <XCrud v-model:form="form" :option="option" :data="data" :page="page" @before-open="beforeOpen" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import type { TableOption, CrudPageProps } from 'cjx-low-code'
const option: TableOption = {
  addBtn: true,
  menu: true,
  viewBtn: true,
  column: [ 
    {
      label: '姓名',
      prop: 'name',
      search: true
    },
    {
      label: '年龄',
      prop: 'age',
      search: true
    },
    {
      label: '地址',
      prop: 'address'
    },
    {
      label: '性别',
      prop: 'sex',
    }
  ]
}

const data = [
  {
    name: '张三',
    age: 18,
    address: '北京市',
    sex: '男'
  },
  {
    name: '小红',
    age: 20,
    address: '上海市',
    sex: '女'
  }
]

const form = ref({})

const beforeOpen: (...args: any[]) => void = (type, row, done) => {
  console.log(type, row)
  done()
}

const page = ref<CrudPageProps>({
  total: 20,
  pageSize: 10,
  currentPage: 1
})
</script>