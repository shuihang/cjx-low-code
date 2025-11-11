<template>
  <div>
    <XCrud
      v-model:form="form"
      v-model:search="search"
      :option="option"
      :data="data"
      @before-open="beforeOpen"
      @row-save="addSave"
      @row-update="rowUpdate"
      :on-load="onLoad"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import type { TableOption } from 'cjx-low-code'
import { ElMessage } from 'element-plus'

const option = ref<TableOption>({
  addBtn: true,
  menu: true,
  viewBtn: true,
  updateBtn: true,
  column: [ 
    {
      label: '姓名',
      prop: 'name',
      search: true
    },
    {
      label: '年龄',
      prop: 'age',
      search: true,
      searchType: 'input',
      type: 'inputNumber',
      inputNumber: {
        min: 0
      }
    },
    {
      label: '地址',
      prop: 'address'
    },
    {
      label: '性别',
      prop: 'sex',
      type: 'select',
      search: true,
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

const data = [
  {
    name: '张三',
    age: 18,
    address: '北京市',
    sex: '1'
  },
  {
    name: '小红',
    age: 20,
    address: '上海市',
    sex: '2'
  }
]


const form = ref({})

const search = ref({})

const beforeOpen: (...args: any[]) => void = (type, row, done) => {
 ElMessage.success(type)
  done()
}

const onLoad = async () => {
  // 模拟异步请求
  await new Promise<void>(resolve => {
    ElMessage.success(JSON.stringify(search.value))
    setTimeout(() => resolve(), 500)
  })
}

const addSave = (row: any, done: Function) => {
  ElMessage.success(JSON.stringify(row))
  done()
}


const rowUpdate = (row: any, done: Function) => {
  ElMessage.success(JSON.stringify(row))
  done()
}
</script>