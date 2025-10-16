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
// import { XCrud } from 'cjx-low-code'
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
              label: '姓名',
              prop: 'name',
              type: 'input',
              rules: [
                { required: true, message: '请输入姓名', trigger: 'blur' }
              ]
            },
            {
              label: '年龄',
              prop: 'age',
              type: 'inputNumber',
              inputNumber: {
                min: 1
              },
              rules: [
                { required: true, message: '请输入年龄', trigger: 'blur' }
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
    name: '张三',
    age: 28,
    address: '北京市',
    sex: '1',
    editTable: [
      {
        name: '张三的儿子',
        age: 6
      }
    ]
  },
  {
    name: '小红',
    age: 20,
    address: '上海市',
    sex: '2',
    editTable: [
      {
        name: '小红的女儿',
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