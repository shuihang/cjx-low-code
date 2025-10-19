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
      type: 'select',
      search: true,
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
    },
    {
      label: '',
      prop: 'editTable',
      type: 'editTable',
      hide: true,
      span: 24,
      editTable: {
        option: {
          addBtn: true,
          delBtn: true,
          copyBtn: true,
          sortable: true,
          column: [
            {
              label: 'Name',
              prop: 'name',
              type: 'input',
              rules: [
                { required: true, message: 'Please enter name', trigger: 'blur' }
              ]
            },
            {
              label: 'Age',
              prop: 'age',
              type: 'inputNumber',
              inputNumber: {
                min: 1
              },
              rules: [
                { required: true, message: 'Please enter age', trigger: 'blur' }
              ]

            }
          ]
        }
      }
    }
  ],
})

const data = [
  {
    name: 'Zhang San',
    age: 28,
    address: 'Beijing',
    sex: '1',
    editTable: [
      {
        name: "Zhang San's son",
        age: 6
      }
    ]
  },
  {
    name: 'Xiao Hong',
    age: 27,
    address: 'Shanghai',
    sex: '2',
    editTable: [
      {
        name: "Xiaohong's daughter",
        age: 6
      },
    ]
  }
]

const form = ref({
 
})

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