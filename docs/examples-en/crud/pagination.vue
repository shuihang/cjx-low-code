<template>
  <div>
    <XCrud
      v-model:form="form"
      v-model:search="search"
      :option="option"
      :data="data"
      :page="page"
      :on-load="onLoad"
      @before-open="beforeOpen"
      @row-del="rowDel"
      @row-save="addSave"
      @row-update="rowUpdate"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { CrudPageProps, TableOption } from 'cjx-low-code'

const option = ref<TableOption>({
  addBtn: true,
  menu: true,
  viewBtn: true,
  column: [
    {
      label: 'Name',
      prop: 'name',
      search: true
    },
    {
      label: 'Age',
      prop: 'age',
      search: true,
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

const page = ref<CrudPageProps>({
  total: 20,
  pageSize: 10,
  currentPage: 1
})

const form = ref({})

const search = ref({})

const beforeOpen: (...args: any[]) => void = (type, row, done) => {
  ElMessage.success(type)
  done()
}

const onLoad = async () => {
  // 模拟异步请求
  await new Promise<void>((resolve) => {
    ElMessage.success(JSON.stringify(search.value))
    setTimeout(() => resolve(), 500)
  })
}

const addSave = (row: any, done: () => void) => {
  ElMessage.success(JSON.stringify(row))
  done()
}

const rowUpdate = (row: any, done: () => void) => {
  ElMessage.success(JSON.stringify(row))
  done()
}

const rowDel = (row: any, index: number) => {
  ElMessage.success(JSON.stringify(row))
}
</script>
