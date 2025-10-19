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
  column: [ 
    {
      label: 'Name',
      prop: 'name'
    },
    {
      label: 'Age',
      prop: 'age',
      searchType: 'input',
      type: 'inputNumber',
      inputNumber: {
        min: 0
      }
    },
    {
      label: 'Address',
      prop: 'address'
    },
    {
      label: 'Sex',
      prop: 'sex',
      search: true,
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

const data = [
  {
    name: 'Zhang San',
    age: 18,
    address: 'Beijing',
    sex: '1'
  },
  {
    name: 'Xiao Hong',
    age: 20,
    address: 'Shanghai',
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